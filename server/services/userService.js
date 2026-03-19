import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { upsertSubscription } from './subscriptionService.js'

const FILE = 'users.json'
const CONNECTION_FILE = 'user_connections.json'

function cleanUser(user) {
  const { password_hash: _passwordHash, ...safe } = user
  return safe
}


export function buildFriendMatchId(userA, userB) {
  const ids = [sanitizeString(String(userA || ''), 120), sanitizeString(String(userB || ''), 120)].filter(Boolean).sort()
  if (ids.length !== 2) return ''
  return `friend:${ids[0]}:${ids[1]}`
}

export function isUserPairInFriendMatch(matchId, userA, userB) {
  if (!String(matchId || '').startsWith('friend:')) return false
  return matchId === buildFriendMatchId(userA, userB)
}

export async function isFriendConnected(userA, userB) {
  if (!userA || !userB || userA === userB) return false
  const rows = await readJson(CONNECTION_FILE)
  return rows.some((row) => {
    const samePair = (row.requester_id === userA && row.receiver_id === userB) || (row.requester_id === userB && row.receiver_id === userA)
    if (!samePair) return false
    const status = String(row.status || '').toLowerCase()
    if (row.type === 'friend' && ['active', 'accepted'].includes(status)) return true
    if (row.type === 'friend_request' && ['active', 'accepted'].includes(status)) return true
    return false
  })
}

function connectionSnapshot(connections, viewerId, targetId) {
  const following = connections.some((row) => row.type === 'follow' && row.requester_id === viewerId && row.receiver_id === targetId && row.status === 'active')

  const friends = connections.some((row) => {
    const samePair = (row.requester_id === viewerId && row.receiver_id === targetId) || (row.requester_id === targetId && row.receiver_id === viewerId)
    if (!samePair) return false
    const status = String(row.status || '').toLowerCase()
    if (row.type === 'friend' && ['active', 'accepted'].includes(status)) return true
    if (row.type === 'friend_request' && ['active', 'accepted'].includes(status)) return true
    return false
  })

  if (friends) {
    return { following, friend_status: 'friends' }
  }

  const outgoingPending = connections.some((row) => row.type === 'friend_request' && row.requester_id === viewerId && row.receiver_id === targetId && row.status === 'pending')
  if (outgoingPending) {
    return { following, friend_status: 'requested' }
  }

  const incomingPending = connections.some((row) => row.type === 'friend_request' && row.requester_id === targetId && row.receiver_id === viewerId && row.status === 'pending')
  if (incomingPending) {
    return { following, friend_status: 'incoming' }
  }

  return { following, friend_status: 'none' }
}

export async function listUsers() {
  const users = await readJson(FILE)
  return users.map(cleanUser)
}

export async function listUsersByIds(ids = []) {
  const users = await readJson(FILE)
  const set = new Set((Array.isArray(ids) ? ids : []).map((id) => String(id)))
  return users.filter((u) => set.has(String(u.id))).map(cleanUser)
}

export async function searchUsers(viewerId, query) {
  const users = await readJson(FILE)
  const connections = await readJson(CONNECTION_FILE)
  const search = sanitizeString(query || '', 120).trim().toLowerCase()

  const matches = users
    // Agents are internal sub-accounts and should not appear in global user search suggestions.
    .filter((user) => String(user.role || '').toLowerCase() !== 'agent')
    .filter((user) => {
      if (!search) return true
      return user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search) || String(user.role || '').toLowerCase().includes(search)
    })
    .slice(0, 12)
    .map((user) => {
      const safe = cleanUser(user)
      const isSelf = user.id === viewerId
      const relation = isSelf ? { following: false, friend_status: 'self' } : connectionSnapshot(connections, viewerId, user.id)
      return {
        id: safe.id,
        name: safe.name,
        email: safe.email,
        role: safe.role,
        verified: Boolean(safe.verified),
        is_self: isSelf,
        ...relation,
      }
    })

  return matches
}

export async function followUser(viewerId, targetId) {
  const rows = await readJson(CONNECTION_FILE)
  const now = new Date().toISOString()

  const existingIndex = rows.findIndex((row) => row.type === 'follow' && row.requester_id === viewerId && row.receiver_id === targetId)
  if (existingIndex >= 0) {
    rows[existingIndex] = {
      ...rows[existingIndex],
      status: 'active',
      updated_at: now,
    }
  } else {
    rows.push({
      id: crypto.randomUUID(),
      type: 'follow',
      requester_id: viewerId,
      receiver_id: targetId,
      status: 'active',
      created_at: now,
      updated_at: now,
    })
  }

  await writeJson(CONNECTION_FILE, rows)
  return connectionSnapshot(rows, viewerId, targetId)
}

export async function sendFriendRequest(viewerId, targetId) {
  const rows = await readJson(CONNECTION_FILE)
  const now = new Date().toISOString()

  const existingFriendIndex = rows.findIndex(
    (row) => row.type === 'friend' && ['active', 'accepted'].includes(String(row.status || '').toLowerCase())
      && ((row.requester_id === viewerId && row.receiver_id === targetId) || (row.requester_id === targetId && row.receiver_id === viewerId)),
  )

  if (existingFriendIndex >= 0) {
    return connectionSnapshot(rows, viewerId, targetId)
  }

  const incomingIndex = rows.findIndex((row) => row.type === 'friend_request' && row.requester_id === targetId && row.receiver_id === viewerId && row.status === 'pending')
  if (incomingIndex >= 0) {
    rows[incomingIndex] = {
      ...rows[incomingIndex],
      type: 'friend',
      status: 'active',
      updated_at: now,
    }
    await writeJson(CONNECTION_FILE, rows)
    return connectionSnapshot(rows, viewerId, targetId)
  }

  const outgoingIndex = rows.findIndex((row) => row.type === 'friend_request' && row.requester_id === viewerId && row.receiver_id === targetId && row.status === 'pending')
  if (outgoingIndex < 0) {
    rows.push({
      id: crypto.randomUUID(),
      type: 'friend_request',
      requester_id: viewerId,
      receiver_id: targetId,
      status: 'pending',
      created_at: now,
      updated_at: now,
    })
    await writeJson(CONNECTION_FILE, rows)
  }

  return connectionSnapshot(rows, viewerId, targetId)
}

export async function findUserByEmail(email) {
  const users = await readJson(FILE)
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export async function findUserByMemberId(memberId) {
  const id = sanitizeString(String(memberId || ''), 64).trim()
  if (!id) return null
  const users = await readJson(FILE)
  return users.find((u) => String(u.member_id || '').toLowerCase() === id.toLowerCase())
}

export async function findUserById(id) {
  const users = await readJson(FILE)
  return users.find((u) => u.id === id)
}

export async function registerUser(payload) {
  const users = await readJson(FILE)
  const hash = await bcrypt.hash(payload.password, 10)
  const nowIso = new Date().toISOString()

  const user = {
    id: crypto.randomUUID(),
    name: sanitizeString(payload.name || payload.company_name, 120),
    email: payload.email.toLowerCase(),
    password_hash: hash,
    role: payload.role,
    status: 'active',
    verified: payload.role === 'admin',
    subscription_status: payload.subscription_status === 'premium' ? 'premium' : 'free',
    created_at: nowIso,
    // Marketing/monetization requirement (project.md):
    // Every brand-new account starts with $5 credit to use on platform services (verification/premium later).
    wallet_balance_usd: 5,
    // Trust & moderation state (project.md): warnings/restrictions for policy violations.
    policy_strikes: 0,
    messaging_restricted_until: '',
    profile: {
      country: sanitizeString(payload.profile?.country || '', 120),
      certifications: Array.isArray(payload.profile?.certifications) ? payload.profile.certifications.map((c) => sanitizeString(c, 80)) : [],
      bank_proof: sanitizeString(payload.profile?.bank_proof || '', 200),
      export_license: sanitizeString(payload.profile?.export_license || '', 160),
      monthly_capacity: sanitizeString(payload.profile?.monthly_capacity || '', 80),
      moq: sanitizeString(payload.profile?.moq || '', 40),
      lead_time_days: sanitizeString(payload.profile?.lead_time_days || '', 40),
    },
  }

  users.push(user)
  await writeJson(FILE, users)
  await upsertSubscription(user.id, user.subscription_status, true)
  return cleanUser(user)
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password_hash)
}

export async function updateProfile(userId, profilePatch) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null

  const current = users[index]
  const nextProfile = {
    ...current.profile,
    ...Object.fromEntries(Object.entries(profilePatch).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => sanitizeString(String(x), 120)) : sanitizeString(String(v ?? ''), 240)])),
  }

  users[index] = { ...current, profile: nextProfile }
  await writeJson(FILE, users)
  return cleanUser(users[index])
}

export async function setUserVerification(userId, verified) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null
  users[index].verified = Boolean(verified)
  await writeJson(FILE, users)
  return cleanUser(users[index])
}

export async function setUserSubscriptionStatus(userId, plan) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null
  users[index].subscription_status = plan === 'premium' ? 'premium' : 'free'
  await writeJson(FILE, users)
  return cleanUser(users[index])
}

export async function deleteUser(userId) {
  const users = await readJson(FILE)
  const next = users.filter((u) => u.id !== userId)
  if (next.length === users.length) return false
  await writeJson(FILE, next)
  return true
}
