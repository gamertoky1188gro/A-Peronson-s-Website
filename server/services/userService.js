import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { upsertSubscription } from './subscriptionService.js'
import { getAdminConfig } from './adminConfigService.js'
import { creditWallet, redeemCouponForUser } from './walletService.js'

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
    wallet_balance_usd: 0,
    wallet_restricted_usd: 0,
    // Trust & moderation state (project.md): warnings/restrictions for policy violations.
    policy_strikes: 0,
    messaging_restricted_until: null,
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
  await upsertSubscription(user.id, user.subscription_status, true, {
    actor_id: user.id,
    source: 'system',
    note: 'user_created',
  })
  // project.md: auto $5 restricted credit for all new accounts (configurable).
  try {
    const config = await getAdminConfig()
    if (config?.feature_flags?.auto_credit !== false) {
      await creditWallet({
        userId: user.id,
        amountUsd: 5,
        reason: 'auto_credit',
        ref: `auto-credit:${user.id}`,
        restricted: true,
        metadata: { source: 'signup' },
      })
    }
  } catch {
    // non-blocking: auto-credit failures should not block signup
  }
  if (payload?.coupon_code) {
    await redeemCouponForUser({ userId: user.id, code: payload.coupon_code })
  }
  return cleanUser(user)
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password_hash)
}

function buildDeletedEmail(userId) {
  const suffix = sanitizeString(String(userId || ''), 80).slice(0, 48) || crypto.randomUUID()
  return `deleted+${suffix}@gartexhub.invalid`
}

export async function deleteUserWithPassword(userId, password) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null

  const current = users[index]
  const ok = await verifyPassword(current, String(password || ''))
  if (!ok) {
    const err = new Error('Invalid password')
    err.status = 401
    throw err
  }

  const now = new Date().toISOString()
  users[index] = {
    ...current,
    name: 'Deleted User',
    email: buildDeletedEmail(current.id),
    status: 'deleted',
    verified: false,
    subscription_status: 'free',
    password_hash: await bcrypt.hash(crypto.randomUUID(), 10),
    password_reset_at: now,
    profile: {
      ...(current.profile || {}),
      deleted_at: now,
      delete_reason: 'self_delete',
    },
  }
  await writeJson(FILE, users)

  const connections = await readJson(CONNECTION_FILE)
  const filtered = connections.filter((row) => row.requester_id !== userId && row.receiver_id !== userId)
  if (filtered.length !== connections.length) {
    await writeJson(CONNECTION_FILE, filtered)
  }

  return cleanUser(users[index])
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

export async function adminUpdateUser(userId, patch = {}) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null

  const current = users[index]
  const allowedRoles = new Set(['buyer', 'factory', 'buying_house', 'owner', 'admin', 'agent'])
  const nextRole = allowedRoles.has(String(patch.role || '').toLowerCase()) ? String(patch.role).toLowerCase() : current.role
  const nextStatus = patch.status ? sanitizeString(String(patch.status), 40) : current.status
  const nextVerified = patch.verified === undefined ? current.verified : Boolean(patch.verified)
  const nextPlan = patch.subscription_status ? (String(patch.subscription_status).toLowerCase() === 'premium' ? 'premium' : 'free') : current.subscription_status
  const nextStrikes = patch.policy_strikes === undefined ? current.policy_strikes : Math.max(0, Number(patch.policy_strikes || 0))
  const nextMessagingRestricted = patch.messaging_restricted_until === undefined
    ? current.messaging_restricted_until
    : (patch.messaging_restricted_until ? new Date(patch.messaging_restricted_until).toISOString() : null)
  const nextOrgOwnerId = patch.org_owner_id !== undefined
    ? (sanitizeString(String(patch.org_owner_id || ''), 120) || null)
    : current.org_owner_id
  const nextMemberId = patch.member_id !== undefined
    ? (sanitizeString(String(patch.member_id || ''), 120) || null)
    : current.member_id
  const nextPermissions = patch.permissions !== undefined
    ? (Array.isArray(patch.permissions) ? patch.permissions.map((p) => sanitizeString(String(p), 64)) : [])
    : current.permissions
  let nextPermissionMatrix = current.permission_matrix
  if (patch.permission_matrix !== undefined) {
    const rawMatrix = patch.permission_matrix && typeof patch.permission_matrix === 'object' ? patch.permission_matrix : {}
    const sections = ['requests', 'products', 'analytics', 'members', 'documents']
    nextPermissionMatrix = Object.fromEntries(sections.map((section) => {
      const sectionValue = rawMatrix?.[section] && typeof rawMatrix[section] === 'object' ? rawMatrix[section] : {}
      return [section, { view: Boolean(sectionValue.view), edit: Boolean(sectionValue.edit) }]
    }))
  }
  const nextChatbot = patch.chatbot_enabled === undefined ? current.chatbot_enabled : Boolean(patch.chatbot_enabled)

  const profile = { ...(current.profile || {}) }
  if (patch.fraud_flags !== undefined) {
    profile.fraud_flags = Array.isArray(patch.fraud_flags) ? patch.fraud_flags.map((v) => sanitizeString(String(v), 80)) : []
  }
  if (patch.admin_notes !== undefined) {
    profile.admin_notes = sanitizeString(String(patch.admin_notes || ''), 800)
  }

  const next = {
    ...current,
    role: nextRole,
    status: nextStatus,
    verified: nextVerified,
    subscription_status: nextPlan,
    policy_strikes: nextStrikes,
    messaging_restricted_until: nextMessagingRestricted,
    org_owner_id: nextOrgOwnerId,
    member_id: nextMemberId,
    permissions: nextPermissions,
    permission_matrix: nextPermissionMatrix,
    chatbot_enabled: nextChatbot,
    profile,
  }

  users[index] = next
  await writeJson(FILE, users)
  return cleanUser(next)
}

export async function adminSetPassword(userId, newPassword) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null

  const hash = await bcrypt.hash(String(newPassword), 10)
  users[index].password_hash = hash
  users[index].password_reset_at = new Date().toISOString()
  await writeJson(FILE, users)
  return cleanUser(users[index])
}

export async function adminForceLogout(userId) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null
  users[index].password_reset_at = new Date().toISOString()
  await writeJson(FILE, users)
  return cleanUser(users[index])
}

export async function adminLockMessaging(userId, lockHours = 0) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null

  const hours = Math.max(0, Number(lockHours || 0))
  users[index].messaging_restricted_until = hours
    ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
    : null
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
