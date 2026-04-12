import {
  assistantReply,
  createKnowledgeEntry,
  deleteKnowledgeEntry,
  listKnowledge,
  updateKnowledgeEntry,
} from '../services/assistantService.js'
import aiOrchestration from '../services/aiOrchestrationService.js'
import {
  autoSummarizeMatch,
  generateConversationSummary,
  generateNegotiationHelper,
  recordNegotiationNote,
  recordSummaryNote,
  resolveOrgOwnerFromMatch,
} from '../services/aiConversationService.js'
import { canAccessMatch } from '../services/messageService.js'
import { canManageMembers, deny, handleControllerError } from '../utils/permissions.js'
import { logInfo } from '../utils/logger.js'
import { sanitizeString } from '../utils/validators.js'

function orgIdFromUser(user) {
  return user?.org_id || user?.organization_id || user?.id
}

function handleError(res, error) {
  return handleControllerError(res, error)
}

export async function askAssistant(req, res) {
  const orgId = orgIdFromUser(req.user)
  const question = req.body?.question || ''
  logInfo('Assistant /ask request received', {
    org_id: orgId,
    question_chars: String(question).length,
  })
  const result = await assistantReply(orgId, question)
  return res.json(result)
}

export async function askAssistantPublic(req, res) {
  const question = req.body?.question || ''
  logInfo('Assistant /ask-public request received', {
    question_chars: String(question).length,
  })
  const result = await assistantReply('public_ws', question)
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

export async function getConversationSummary(req, res) {
  const matchId = sanitizeString(String(req.body?.match_id || ''), 200)
  if (!matchId) return res.status(400).json({ error: 'match_id is required' })

  const allowed = await canAccessMatch(matchId, req.user.id)
  if (!allowed) return res.status(403).json({ error: 'Forbidden' })

  const orgOwnerId = await resolveOrgOwnerFromMatch(matchId, req.user.id) || orgIdFromUser(req.user)
  const force = Boolean(req.body?.force)

  try {
    let result = null
    let fromAuto = false
    if (!force && orgOwnerId) {
      result = await autoSummarizeMatch({ matchId, orgOwnerId })
      fromAuto = Boolean(result)
    }
    if (!result) {
      result = await generateConversationSummary(matchId)
    }
    if (result && orgOwnerId && !fromAuto) {
      await recordSummaryNote({ matchId, orgOwnerId, summary: result })
    }

    if (!result) return res.status(404).json({ error: 'No messages to summarize' })
    return res.json({ ok: true, summary: result.summary, suggested_reply: result.suggested_reply || '' })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function getNegotiationHelper(req, res) {
  const matchId = sanitizeString(String(req.body?.match_id || ''), 200)
  if (!matchId) return res.status(400).json({ error: 'match_id is required' })

  const allowed = await canAccessMatch(matchId, req.user.id)
  if (!allowed) return res.status(403).json({ error: 'Forbidden' })

  const orgOwnerId = await resolveOrgOwnerFromMatch(matchId, req.user.id) || orgIdFromUser(req.user)

  try {
    const helper = await generateNegotiationHelper(matchId)
    if (!helper) return res.status(404).json({ error: 'No messages to analyze' })

    if (orgOwnerId) {
      await recordNegotiationNote({ matchId, orgOwnerId, helper })
    }

    return res.json({
      ok: true,
      guidance: helper.guidance || '',
      suggested_reply: helper.suggested_reply || '',
    })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function postExtractRequirement(req, res) {
  try {
    const text = String(req.body?.text || '')
    if (!text) return res.status(400).json({ error: 'text is required' })
    const orgId = orgIdFromUser(req.user)
    const result = await aiOrchestration.extractRequirementFromText(text, orgId)
    return res.json(result)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function postGenerateFirstResponse(req, res) {
  try {
    const { extracted, match_id } = req.body || {}
    if (!extracted) return res.status(400).json({ error: 'extracted fields are required' })
    const orgId = orgIdFromUser(req.user)
    const draft = aiOrchestration.generateDraftResponse(extracted, [])
    const validation = await aiOrchestration.validateDraftResponse(draft, extracted, null, orgId)
    if (match_id) await aiOrchestration.persistAiMetadataForMatch(match_id, validation)
    return res.json({ draft, meta: validation })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function postValidateResponse(req, res) {
  try {
    const { draft, extracted, threshold = 0.6, match_id } = req.body || {}
    if (!draft || !extracted) return res.status(400).json({ error: 'draft and extracted are required' })
    const orgId = orgIdFromUser(req.user)
    const result = await aiOrchestration.validateDraftResponse(draft, extracted, threshold, orgId)
    if (match_id) await aiOrchestration.persistAiMetadataForMatch(match_id, result)
    return res.json(result)
  } catch (error) {
    return handleControllerError(res, error)
  }
}
