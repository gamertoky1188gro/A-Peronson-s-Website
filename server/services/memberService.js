import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { getSubscription } from './subscriptionService.js'
import { getAdminConfig } from './adminConfigService.js'
import { getPlanForUser } from './entitlementService.js'

/**
 * Member/Team system (Phase 2)
 * - "Members" are stored as real user rows in `users.json` with `role: "agent"`.
 * - This enables single-field Agent login: Email OR Agent ID (member_id).
 * - Legacy support: if `members.json` exists with old rows, we migrate them into users.json on demand.
 */

const USERS_FILE = 'users.json'
const LEGACY_MEMBERS_FILE = 'members.json'

const DEFAULT_FREE_MEMBER_LIMIT = 10

// Legacy permissions are still supported for UI compatibility (checkbox list).
const VALID_PERMISSIONS = new Set(['view_requests', 'assign_requests', 'manage_members', 'reports_only'])
const PERMISSION_CONFLICTS = [['manage_members', 'reports_only']]

// Permission matrix is the longer-term, role-safe permission model.
const MATRIX_SECTIONS = ['requests', 'products', 'analytics', 'members', 'documents']

function sanitizePermissions(permissions) {
  if (!Array.isArray(permissions)) return []
  return [...new Set(permissions.map((p) => sanitizeString(String(p), 64)).filter((p) => VALID_PERMISSIONS.has(p)))]
}

function sanitizePermissionMatrix(rawMatrix) {
  const input = rawMatrix && typeof rawMatrix === 'object' ? rawMatrix : {}
  const matrix = {}

  for (const section of MATRIX_SECTIONS) {
    const sectionValue = input?.[section] && typeof input[section] === 'object' ? input[section] : {}
    matrix[section] = {
      view: Boolean(sectionValue.view),
      edit: Boolean(sectionValue.edit),
    }
  }

  // Hard rule: agents can never manage members from the UI/API.
  matrix.members = { view: false, edit: false }

  return matrix
}

function hasPermissionConflict(permissions) {
  return PERMISSION_CONFLICTS.find(([a, b]) => permissions.includes(a) && permissions.includes(b)) || null
}

function cleanAgent(user) {
  const { password_hash: _passwordHash, ...safe } = user
  return safe
}

function normalizeAgent(orgOwnerId, payload = {}, current = null) {
  const name = sanitizeString(payload.name ?? current?.name, 120)
  const username = sanitizeString(payload.username ?? current?.username, 64)
  const memberId = sanitizeString(payload.member_id ?? payload.account_id ?? current?.member_id, 64)

  // Force role to agent (this endpoint is "member management", i.e. sub-accounts).
  const role = 'agent'
  const status = sanitizeString(payload.status ?? current?.status ?? 'active', 32) || 'active'

  const permissions = payload.permissions === undefined
    ? (Array.isArray(current?.permissions) ? current.permissions : [])
    : sanitizePermissions(payload.permissions)

  const permissionMatrix = payload.permission_matrix === undefined
    ? sanitizePermissionMatrix(current?.permission_matrix || {})
    : sanitizePermissionMatrix(payload.permission_matrix)

  // Use a synthetic email so agents remain valid "users" but are not discoverable via search suggestions.
  const email = sanitizeString(payload.email ?? current?.email, 160) || `agent-${memberId}@gartexhub.local`

  const messagingRestricted = sanitizeString(payload.messaging_restricted_until ?? current?.messaging_restricted_until ?? '', 64).trim()

  return {
    id: current?.id || crypto.randomUUID(),
    org_owner_id: orgOwnerId,
    name,
    username,
    member_id: memberId,
    account_id: memberId,
    email: email.toLowerCase(),
    role,
    status,
    // Agents are internal sub-accounts; they do not receive the public $5 wallet credit.
    wallet_balance_usd: Number(current?.wallet_balance_usd ?? 0),
    policy_strikes: Number(current?.policy_strikes ?? 0),
    messaging_restricted_until: messagingRestricted || null,
    permissions,
    permission_matrix: permissionMatrix,
    assigned_requests: Number(payload.assigned_requests ?? current?.assigned_requests ?? 0),
    performance_score: Number(payload.performance_score ?? current?.performance_score ?? 0),
    created_at: current?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

async function readAllUsersRaw() {
  const users = await readJson(USERS_FILE)
  return Array.isArray(users) ? users : []
}

async function writeAllUsersRaw(users) {
  await writeJson(USERS_FILE, users)
}

async function migrateLegacyMembersIfNeeded() {
  // If no legacy file exists or it is empty, skip.
  let legacy = []
  try {
    legacy = await readJson(LEGACY_MEMBERS_FILE)
  } catch {
    legacy = []
  }
  if (!Array.isArray(legacy) || legacy.length === 0) return

  const users = await readAllUsersRaw()
  const existingByMemberId = new Map(
    users
      .filter((u) => String(u.member_id || '').trim())
      .map((u) => [String(u.member_id || '').toLowerCase(), u]),
  )

  let mutated = false
  for (const row of legacy) {
    const memberId = sanitizeString(row.member_id || row.account_id, 64)
    if (!memberId) continue
    const key = memberId.toLowerCase()
    if (existingByMemberId.has(key)) continue

    const orgOwnerId = sanitizeString(row.org_owner_id || row.organization_id, 120) || ''
    if (!orgOwnerId) continue

    const agent = normalizeAgent(orgOwnerId, row, {
      id: crypto.randomUUID(),
      name: row.name || memberId,
      username: row.username || memberId,
      member_id: memberId,
      email: row.email || `agent-${memberId}@gartexhub.local`,
      role: 'agent',
      status: row.status || 'active',
      permissions: Array.isArray(row.permissions) ? row.permissions : [],
      permission_matrix: row.permission_matrix || {},
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at || new Date().toISOString(),
    })

    // Preserve legacy password hash if present; otherwise create a random one (agent must reset).
    agent.password_hash = row.password_hash || (await bcrypt.hash(crypto.randomBytes(12).toString('base64url'), 10))

    users.push(agent)
    existingByMemberId.set(key, agent)
    mutated = true
  }

  if (mutated) {
    await writeAllUsersRaw(users)
  }
}

async function listAgentsForOrg(orgOwnerId) {
  await migrateLegacyMembersIfNeeded()
  const users = await readAllUsersRaw()
  return users
    .filter((u) => String(u.role || '').toLowerCase() === 'agent')
    .filter((u) => String(u.org_owner_id) === String(orgOwnerId))
}

export async function listMembers(orgOwnerId) {
  const agents = await listAgentsForOrg(orgOwnerId)
  return agents.map(cleanAgent)
}

async function assertFreePlanMemberLimit(orgOwnerId, allAgents, currentAgent = null, nextStatus = 'active', orgOwnerRecord = null) {
  const plan = orgOwnerRecord ? await getPlanForUser(orgOwnerRecord) : (await getSubscription(orgOwnerId))?.plan === 'premium' ? 'premium' : 'free'
  if (plan !== 'free') return

  const config = await getAdminConfig()
  const freeLimit = Number(config?.plan_limits?.free?.agent_limit || DEFAULT_FREE_MEMBER_LIMIT)
  const activeCount = allAgents.filter((m) => m.status === 'active' && String(m.id) !== String(currentAgent?.id)).length
  if (nextStatus === 'active' && activeCount >= freeLimit) {
    const error = new Error(`Free plan allows up to ${freeLimit} active sub-accounts`)
    error.status = 403
    throw error
  }
}

function ensureUniqueIdentity({ users, orgOwnerId, username, memberId, currentUserId = null }) {
  const dupeUsername = users.find(
    (u) =>
      String(u.role || '').toLowerCase() === 'agent' &&
      String(u.org_owner_id) === String(orgOwnerId) &&
      String(u.id) !== String(currentUserId) &&
      String(u.username || '').toLowerCase() === String(username || '').toLowerCase(),
  )
  if (dupeUsername) {
    const error = new Error('Duplicate username in this organization')
    error.status = 409
    throw error
  }

  // Agent ID must be globally unique so the agent can login using only that ID.
  const dupeMemberId = users.find(
    (u) =>
      String(u.id) !== String(currentUserId) &&
      String(u.member_id || '').toLowerCase() === String(memberId || '').toLowerCase(),
  )
  if (dupeMemberId) {
    const error = new Error('Member ID already exists')
    error.status = 409
    throw error
  }
}

export async function createMember(orgOwnerId, payload) {
  await migrateLegacyMembersIfNeeded()
  const users = await readAllUsersRaw()

  const agent = normalizeAgent(orgOwnerId, payload)
  const conflict = hasPermissionConflict(agent.permissions)
  if (conflict) {
    const error = new Error(`Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}`)
    error.status = 400
    throw error
  }

  if (!agent.name || !agent.username || !agent.member_id) {
    const error = new Error('name, username and member_id are required')
    error.status = 400
    throw error
  }

  ensureUniqueIdentity({ users, orgOwnerId, username: agent.username, memberId: agent.member_id })

  const orgAgents = users
    .filter((u) => String(u.role || '').toLowerCase() === 'agent')
    .filter((u) => String(u.org_owner_id) === String(orgOwnerId))

  const orgOwner = users.find((u) => String(u.id) === String(orgOwnerId)) || null
  await assertFreePlanMemberLimit(orgOwnerId, orgAgents, null, 'active', orgOwner)

  const rawPassword = String(payload.password || '').trim() || crypto.randomBytes(8).toString('base64url')
  agent.password_hash = await bcrypt.hash(rawPassword, 10)

  users.push(agent)
  await writeAllUsersRaw(users)

  // Surface the generated password when client didn't provide one (helps onboarding).
  const safe = cleanAgent(agent)
  if (!payload.password) return { ...safe, temporary_password: rawPassword }
  return safe
}

export async function updateMember(orgOwnerId, memberId, payload) {
  await migrateLegacyMembersIfNeeded()
  const users = await readAllUsersRaw()
  const idx = users.findIndex((u) => String(u.id) === String(memberId) && String(u.org_owner_id) === String(orgOwnerId) && String(u.role || '').toLowerCase() === 'agent')
  if (idx < 0) return null

  const current = users[idx]
  const next = normalizeAgent(orgOwnerId, payload, current)

  if (!['active', 'inactive'].includes(next.status)) {
    const error = new Error('status must be active or inactive')
    error.status = 400
    throw error
  }

  ensureUniqueIdentity({ users, orgOwnerId, username: next.username, memberId: next.member_id, currentUserId: current.id })

  const conflict = hasPermissionConflict(next.permissions)
  if (conflict) {
    const error = new Error(`Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}`)
    error.status = 400
    throw error
  }

  const orgAgents = users
    .filter((u) => String(u.role || '').toLowerCase() === 'agent')
    .filter((u) => String(u.org_owner_id) === String(orgOwnerId))

  const orgOwner = users.find((u) => String(u.id) === String(orgOwnerId)) || null
  await assertFreePlanMemberLimit(orgOwnerId, orgAgents, current, next.status, orgOwner)

  users[idx] = {
    ...current,
    ...next,
    password_hash: current.password_hash,
  }

  await writeAllUsersRaw(users)
  return cleanAgent(users[idx])
}

export async function updateMemberPermissions(orgOwnerId, memberId, permissionsPayload, permissionMatrixPayload) {
  return updateMember(orgOwnerId, memberId, { permissions: permissionsPayload, permission_matrix: permissionMatrixPayload })
}

export async function resetMemberPassword(orgOwnerId, memberId) {
  await migrateLegacyMembersIfNeeded()
  const users = await readAllUsersRaw()
  const idx = users.findIndex((u) => String(u.id) === String(memberId) && String(u.org_owner_id) === String(orgOwnerId) && String(u.role || '').toLowerCase() === 'agent')
  if (idx < 0) return null

  const tempPassword = crypto.randomBytes(6).toString('base64url')
  users[idx] = {
    ...users[idx],
    password_hash: await bcrypt.hash(tempPassword, 10),
    password_reset_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  await writeAllUsersRaw(users)
  return { member: cleanAgent(users[idx]), temporary_password: tempPassword }
}

export async function deactivateOrRemoveMember(orgOwnerId, memberId, mode = 'deactivate') {
  await migrateLegacyMembersIfNeeded()
  const users = await readAllUsersRaw()
  const idx = users.findIndex((u) => String(u.id) === String(memberId) && String(u.org_owner_id) === String(orgOwnerId) && String(u.role || '').toLowerCase() === 'agent')
  if (idx < 0) return null

  if (mode === 'remove') {
    const [removed] = users.splice(idx, 1)
    await writeAllUsersRaw(users)
    return { removed: cleanAgent(removed), mode: 'remove' }
  }

  users[idx] = {
    ...users[idx],
    status: 'inactive',
    updated_at: new Date().toISOString(),
  }
  await writeAllUsersRaw(users)
  return { member: cleanAgent(users[idx]), mode: 'deactivate' }
}

export function getMemberConstraints() {
  return {
    free_member_limit: DEFAULT_FREE_MEMBER_LIMIT,
    valid_permissions: [...VALID_PERMISSIONS],
    permission_conflicts: PERMISSION_CONFLICTS,
    permission_matrix_sections: MATRIX_SECTIONS,
  }
}
