import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { getSubscription } from './subscriptionService.js'

const FILE = 'members.json'
const FREE_MEMBER_LIMIT = 10
const VALID_PERMISSIONS = new Set(['view_requests', 'assign_requests', 'manage_members', 'reports_only'])
const PERMISSION_CONFLICTS = [['manage_members', 'reports_only']]
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

  return matrix
}

function hasPermissionConflict(permissions) {
  return PERMISSION_CONFLICTS.find(([a, b]) => permissions.includes(a) && permissions.includes(b)) || null
}

function cleanMember(member) {
  const { password_hash: _passwordHash, ...safe } = member
  return safe
}

function normalizeMember(member) {
  const username = sanitizeString(member.username || member.account_id, 64)
  const memberId = sanitizeString(member.member_id || member.account_id, 64)
  const orgOwnerId = sanitizeString(member.org_owner_id || member.organization_id, 120)

  return {
    ...member,
    org_owner_id: orgOwnerId,
    organization_id: orgOwnerId,
    username,
    member_id: memberId,
    account_id: member.account_id || memberId,
    permission_matrix: sanitizePermissionMatrix(member.permission_matrix),
  }
}

async function getOrgMembers(orgOwnerId) {
  const members = await readJson(FILE)
  return members.filter((m) => String(m.org_owner_id) === String(orgOwnerId)).map(normalizeMember)
}

async function readAllMembers() {
  const members = await readJson(FILE)
  return members.map(normalizeMember)
}

export async function listMembers(orgOwnerId) {
  const members = await getOrgMembers(orgOwnerId)
  return members.map(cleanMember)
}

async function assertFreePlanMemberLimit(orgOwnerId, allMembers, currentMember = null, nextStatus = 'active') {
  const subscription = await getSubscription(orgOwnerId)
  const plan = subscription?.plan === 'premium' ? 'premium' : 'free'
  if (plan !== 'free') return

  const orgMembers = allMembers.filter((m) => String(m.org_owner_id) === String(orgOwnerId))
  const activeCount = orgMembers.filter((m) => m.status === 'active' && String(m.id) !== String(currentMember?.id)).length
  if (nextStatus === 'active' && activeCount >= FREE_MEMBER_LIMIT) {
    const error = new Error('Free plan allows up to 10 active sub-accounts')
    error.status = 403
    throw error
  }
}

function ensureUniqueIdentity({ members, orgOwnerId, username, memberId, currentMemberId = null }) {
  const duplicateUsername = members.find(
    (m) =>
      String(m.org_owner_id) === String(orgOwnerId) &&
      String(m.id) !== String(currentMemberId) &&
      m.username.toLowerCase() === username.toLowerCase(),
  )
  if (duplicateUsername) {
    const error = new Error('Duplicate username in this organization')
    error.status = 409
    throw error
  }

  const duplicateMemberId = members.find(
    (m) =>
      String(m.org_owner_id) === String(orgOwnerId) &&
      String(m.id) !== String(currentMemberId) &&
      String(m.member_id || '').toLowerCase() === memberId.toLowerCase(),
  )
  if (duplicateMemberId) {
    const error = new Error('Member ID already exists')
    error.status = 409
    throw error
  }
}

export async function createMember(orgOwnerId, payload) {
  const members = await readAllMembers()

  const name = sanitizeString(payload.name, 120)
  const username = sanitizeString(payload.username, 64)
  const memberId = sanitizeString(payload.member_id || payload.account_id, 64)
  const role = sanitizeString(payload.role, 64)
  const permissions = sanitizePermissions(payload.permissions)
  const permissionMatrix = sanitizePermissionMatrix(payload.permission_matrix)

  if (!name || !username || !memberId || !role || !payload.password) {
    const error = new Error('name, username, member_id, role and password are required')
    error.status = 400
    throw error
  }

  ensureUniqueIdentity({ members, orgOwnerId, username, memberId })

  const conflict = hasPermissionConflict(permissions)
  if (conflict) {
    const error = new Error(`Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}`)
    error.status = 400
    throw error
  }

  await assertFreePlanMemberLimit(orgOwnerId, members)

  const hash = await bcrypt.hash(String(payload.password), 10)
  const member = {
    id: crypto.randomUUID(),
    org_owner_id: orgOwnerId,
    organization_id: orgOwnerId,
    name,
    username,
    member_id: memberId,
    account_id: memberId,
    role,
    permissions,
    permission_matrix: permissionMatrix,
    password_hash: hash,
    status: 'active',
    assigned_requests: Number(payload.assigned_requests || 0),
    performance_score: Number(payload.performance_score || 0),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  members.push(member)
  await writeJson(FILE, members)
  return cleanMember(member)
}

export async function updateMember(orgOwnerId, memberId, payload) {
  const members = await readAllMembers()
  const idx = members.findIndex((m) => String(m.id) === String(memberId) && String(m.org_owner_id) === String(orgOwnerId))
  if (idx < 0) return null

  const current = members[idx]
  const name = payload.name === undefined ? current.name : sanitizeString(payload.name, 120)
  const username = payload.username === undefined ? current.username : sanitizeString(payload.username, 64)
  const normalizedMemberId =
    payload.member_id === undefined && payload.account_id === undefined
      ? current.member_id
      : sanitizeString(payload.member_id || payload.account_id, 64)
  const role = payload.role === undefined ? current.role : sanitizeString(payload.role, 64)
  const status = payload.status === undefined ? current.status : sanitizeString(payload.status, 32)
  const permissions = payload.permissions === undefined ? current.permissions : sanitizePermissions(payload.permissions)
  const permissionMatrix =
    payload.permission_matrix === undefined
      ? sanitizePermissionMatrix(current.permission_matrix)
      : sanitizePermissionMatrix(payload.permission_matrix)

  if (!name || !username || !normalizedMemberId || !role) {
    const error = new Error('name, username, member_id and role are required')
    error.status = 400
    throw error
  }

  if (!['active', 'inactive'].includes(status)) {
    const error = new Error('status must be active or inactive')
    error.status = 400
    throw error
  }

  ensureUniqueIdentity({
    members,
    orgOwnerId,
    username,
    memberId: normalizedMemberId,
    currentMemberId: current.id,
  })

  const conflict = hasPermissionConflict(permissions)
  if (conflict) {
    const error = new Error(`Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}`)
    error.status = 400
    throw error
  }

  await assertFreePlanMemberLimit(orgOwnerId, members, current, status)

  members[idx] = {
    ...current,
    name,
    username,
    member_id: normalizedMemberId,
    account_id: normalizedMemberId,
    role,
    status,
    permissions,
    permission_matrix: permissionMatrix,
    updated_at: new Date().toISOString(),
  }

  await writeJson(FILE, members)
  return cleanMember(members[idx])
}

export async function updateMemberPermissions(orgOwnerId, memberId, permissionsPayload, permissionMatrixPayload) {
  const members = await readAllMembers()
  const idx = members.findIndex((m) => String(m.id) === String(memberId) && String(m.org_owner_id) === String(orgOwnerId))
  if (idx < 0) return null

  const permissions = sanitizePermissions(permissionsPayload)
  const conflict = hasPermissionConflict(permissions)
  if (conflict) {
    const error = new Error(`Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}`)
    error.status = 400
    throw error
  }

  members[idx] = {
    ...members[idx],
    permissions,
    permission_matrix: sanitizePermissionMatrix(permissionMatrixPayload),
    updated_at: new Date().toISOString(),
  }
  await writeJson(FILE, members)
  return cleanMember(members[idx])
}

export async function resetMemberPassword(orgOwnerId, memberId) {
  const members = await readAllMembers()
  const idx = members.findIndex((m) => String(m.id) === String(memberId) && String(m.org_owner_id) === String(orgOwnerId))
  if (idx < 0) return null

  const tempPassword = crypto.randomBytes(6).toString('base64url')
  members[idx] = {
    ...members[idx],
    password_hash: await bcrypt.hash(tempPassword, 10),
    password_reset_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  await writeJson(FILE, members)
  return { member: cleanMember(members[idx]), temporary_password: tempPassword }
}

export async function deactivateOrRemoveMember(orgOwnerId, memberId, mode = 'deactivate') {
  const members = await readAllMembers()
  const idx = members.findIndex((m) => String(m.id) === String(memberId) && String(m.org_owner_id) === String(orgOwnerId))
  if (idx < 0) return null

  if (mode === 'remove') {
    const [removed] = members.splice(idx, 1)
    await writeJson(FILE, members)
    return { removed: cleanMember(removed), mode: 'remove' }
  }

  members[idx] = {
    ...members[idx],
    status: 'inactive',
    updated_at: new Date().toISOString(),
  }
  await writeJson(FILE, members)
  return { member: cleanMember(members[idx]), mode: 'deactivate' }
}

export function getMemberConstraints() {
  return {
    free_member_limit: FREE_MEMBER_LIMIT,
    valid_permissions: [...VALID_PERMISSIONS],
    permission_conflicts: PERMISSION_CONFLICTS,
    permission_matrix_sections: MATRIX_SECTIONS,
  }
}
