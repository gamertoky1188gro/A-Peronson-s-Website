import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { getSubscription } from './subscriptionService.js'

const FILE = 'members.json'
const FREE_MEMBER_LIMIT = 10
const VALID_PERMISSIONS = new Set(['view_requests', 'assign_requests', 'manage_members', 'reports_only'])
const PERMISSION_CONFLICTS = [
  ['manage_members', 'reports_only'],
]

function sanitizePermissions(permissions) {
  if (!Array.isArray(permissions)) return []
  return [...new Set(permissions.map((p) => sanitizeString(String(p), 64)).filter((p) => VALID_PERMISSIONS.has(p)))]
}

function hasPermissionConflict(permissions) {
  return PERMISSION_CONFLICTS.find(([a, b]) => permissions.includes(a) && permissions.includes(b)) || null
}

function cleanMember(member) {
  const { password_hash: _passwordHash, ...safe } = member
  return safe
}

async function getOrgMembers(orgOwnerId) {
  const members = await readJson(FILE)
  return members.filter((m) => m.org_owner_id === orgOwnerId)
}

export async function listMembers(orgOwnerId) {
  const members = await getOrgMembers(orgOwnerId)
  return members.map(cleanMember)
}

export async function createMember(orgOwnerId, payload) {
  const members = await readJson(FILE)
  const orgMembers = members.filter((m) => m.org_owner_id === orgOwnerId)

  const subscription = await getSubscription(orgOwnerId)
  const plan = subscription?.plan === 'premium' ? 'premium' : 'free'
  if (plan === 'free' && orgMembers.filter((m) => m.status === 'active').length >= FREE_MEMBER_LIMIT) {
    const error = new Error('Free plan allows up to 10 active sub-accounts')
    error.status = 403
    throw error
  }

  const name = sanitizeString(payload.name, 120)
  const accountId = sanitizeString(payload.account_id, 64)
  const role = sanitizeString(payload.role, 64)
  const permissions = sanitizePermissions(payload.permissions)

  if (!name || !accountId || !role || !payload.password) {
    const error = new Error('name, account_id, role and password are required')
    error.status = 400
    throw error
  }

  const duplicateName = orgMembers.find((m) => m.name.toLowerCase() === name.toLowerCase())
  if (duplicateName) {
    const error = new Error('Duplicate member name in this organization')
    error.status = 409
    throw error
  }

  const duplicateAccount = members.find((m) => m.account_id.toLowerCase() === accountId.toLowerCase())
  if (duplicateAccount) {
    const error = new Error('Account ID already exists')
    error.status = 409
    throw error
  }

  const conflict = hasPermissionConflict(permissions)
  if (conflict) {
    const error = new Error(`Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}`)
    error.status = 400
    throw error
  }

  const hash = await bcrypt.hash(String(payload.password), 10)
  const member = {
    id: crypto.randomUUID(),
    org_owner_id: orgOwnerId,
    organization_id: orgOwnerId,
    name,
    account_id: accountId,
    role,
    permissions,
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

export async function updateMemberPermissions(orgOwnerId, memberId, permissionsPayload) {
  const members = await readJson(FILE)
  const idx = members.findIndex((m) => m.id === memberId && m.org_owner_id === orgOwnerId)
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
    updated_at: new Date().toISOString(),
  }
  await writeJson(FILE, members)
  return cleanMember(members[idx])
}

export async function resetMemberPassword(orgOwnerId, memberId) {
  const members = await readJson(FILE)
  const idx = members.findIndex((m) => m.id === memberId && m.org_owner_id === orgOwnerId)
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
  const members = await readJson(FILE)
  const idx = members.findIndex((m) => m.id === memberId && m.org_owner_id === orgOwnerId)
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
  }
}
