import {
  assistantReply,
  createKnowledgeEntry,
  deleteKnowledgeEntry,
  listKnowledge,
  updateKnowledgeEntry,
} from '../services/assistantService.js'
import { canManageMembers, deny, handleControllerError } from '../utils/permissions.js'

function orgIdFromUser(user) {
  return user?.org_id || user?.organization_id || user?.id || 'public_guest'
}

function handleError(res, error) {
  return handleControllerError(res, error)
}

export async function askAssistant(req, res) {
  const orgId = orgIdFromUser(req.user)
  const result = await assistantReply(orgId, req.body?.question || '')
  return res.json(result)
}

export async function getAssistantKnowledge(req, res) {
  const orgId = orgIdFromUser(req.user)
  const entries = await listKnowledge(orgId)
  return res.json({ entries })
}

export async function createAssistantKnowledge(req, res) {
  if (!canManageMembers(req.user)) return deny(res)
  try {
    const orgId = orgIdFromUser(req.user)
    const entry = await createKnowledgeEntry(orgId, req.body || {})
    return res.status(201).json(entry)
  } catch (error) {
    return handleError(res, error)
  }
}

export async function updateAssistantKnowledge(req, res) {
  if (!canManageMembers(req.user)) return deny(res)
  try {
    const orgId = orgIdFromUser(req.user)
    const entry = await updateKnowledgeEntry(orgId, req.params.entryId, req.body || {})
    return res.json(entry)
  } catch (error) {
    return handleError(res, error)
  }
}

export async function removeAssistantKnowledge(req, res) {
  if (!canManageMembers(req.user)) return deny(res)
  const orgId = orgIdFromUser(req.user)
  const ok = await deleteKnowledgeEntry(orgId, req.params.entryId)
  if (!ok) return res.status(404).json({ error: 'Knowledge entry not found' })
  return res.json({ ok: true })
}
