import {
  createMember,
  deactivateOrRemoveMember,
  getMemberConstraints,
  listMembers,
  resetMemberPassword,
  updateMemberPermissions,
} from '../services/memberService.js'

function handleError(res, error) {
  return res.status(error.status || 500).json({ error: error.message || 'Request failed' })
}

export async function createOrgMember(req, res) {
  try {
    const member = await createMember(req.user.id, req.body || {})
    return res.status(201).json({ member })
  } catch (error) {
    return handleError(res, error)
  }
}

export async function listOrgMembers(req, res) {
  try {
    const members = await listMembers(req.user.id)
    return res.json({ members, constraints: getMemberConstraints() })
  } catch (error) {
    return handleError(res, error)
  }
}

export async function patchMemberPermissions(req, res) {
  try {
    const member = await updateMemberPermissions(req.user.id, req.params.memberId, req.body?.permissions)
    if (!member) return res.status(404).json({ error: 'Member not found' })
    return res.json({ member })
  } catch (error) {
    return handleError(res, error)
  }
}

export async function postMemberPasswordReset(req, res) {
  try {
    const result = await resetMemberPassword(req.user.id, req.params.memberId)
    if (!result) return res.status(404).json({ error: 'Member not found' })
    return res.json(result)
  } catch (error) {
    return handleError(res, error)
  }
}

export async function deactivateOrRemoveOrgMember(req, res) {
  try {
    const mode = req.query.remove === 'true' ? 'remove' : 'deactivate'
    const result = await deactivateOrRemoveMember(req.user.id, req.params.memberId, mode)
    if (!result) return res.status(404).json({ error: 'Member not found' })
    return res.json(result)
  } catch (error) {
    return handleError(res, error)
  }
}
