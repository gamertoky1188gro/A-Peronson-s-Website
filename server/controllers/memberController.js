import {
  createMember,
  deactivateOrRemoveMember,
  getMemberConstraints,
  listMembers,
  resetMemberPassword,
  updateMember,
  updateMemberPermissions,
} from '../services/memberService.js'
import { canManageMembers, deny, handleControllerError } from '../utils/permissions.js'

function orgOwnerIdFromUser(user) {
  return user?.org_owner_id || user?.org_id || user?.organization_id || user?.id
}

function handleError(res, error) {
  return handleControllerError(res, error)
}

export async function createOrgMember(req, res) {
  if (!canManageMembers(req.user)) return deny(res)
  try {
    const member = await createMember(orgOwnerIdFromUser(req.user), req.body || {})
    return res.status(201).json({ member })
  } catch (error) {
    return handleError(res, error)
  }
}

export async function listOrgMembers(req, res) {
  if (!canManageMembers(req.user)) return deny(res)
  try {
    const members = await listMembers(orgOwnerIdFromUser(req.user))
    return res.json({ members, constraints: getMemberConstraints() })
  } catch (error) {
    return handleError(res, error)
  }
}

export async function putOrgMember(req, res) {
  if (!canManageMembers(req.user)) return deny(res)
  try {
    const member = await updateMember(orgOwnerIdFromUser(req.user), req.params.memberId, req.body || {})
    if (!member) return res.status(404).json({ error: 'Member not found' })
    return res.json({ member })
  } catch (error) {
    return handleError(res, error)
  }
}

export async function patchMemberPermissions(req, res) {
  if (!canManageMembers(req.user)) return deny(res)
  try {
    const member = await updateMemberPermissions(
      orgOwnerIdFromUser(req.user),
      req.params.memberId,
      req.body?.permissions,
      req.body?.permission_matrix,
    )
    if (!member) return res.status(404).json({ error: 'Member not found' })
    return res.json({ member })
  } catch (error) {
    return handleError(res, error)
  }
}

export async function postMemberPasswordReset(req, res) {
  if (!canManageMembers(req.user)) return deny(res)
  try {
    const result = await resetMemberPassword(orgOwnerIdFromUser(req.user), req.params.memberId)
    if (!result) return res.status(404).json({ error: 'Member not found' })
    return res.json(result)
  } catch (error) {
    return handleError(res, error)
  }
}

export async function deactivateOrRemoveOrgMember(req, res) {
  if (!canManageMembers(req.user)) return deny(res)
  try {
    const mode = req.query.remove === 'true' ? 'remove' : 'deactivate'
    const result = await deactivateOrRemoveMember(orgOwnerIdFromUser(req.user), req.params.memberId, mode)
    if (!result) return res.status(404).json({ error: 'Member not found' })
    return res.json(result)
  } catch (error) {
    return handleError(res, error)
  }
}
