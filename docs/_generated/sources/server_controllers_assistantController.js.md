    1 | import {
    2 |   assistantReply,
    3 |   createKnowledgeEntry,
    4 |   deleteKnowledgeEntry,
    5 |   listKnowledge,
    6 |   updateKnowledgeEntry,
    7 | } from '../services/assistantService.js'
    8 | import aiOrchestration from '../services/aiOrchestrationService.js'
    9 | import {
   10 |   autoSummarizeMatch,
   11 |   generateConversationSummary,
   12 |   generateNegotiationHelper,
   13 |   recordNegotiationNote,
   14 |   recordSummaryNote,
   15 |   resolveOrgOwnerFromMatch,
   16 | } from '../services/aiConversationService.js'
   17 | import { canAccessMatch } from '../services/messageService.js'
   18 | import { canManageMembers, deny, handleControllerError } from '../utils/permissions.js'
   19 | import { logInfo } from '../utils/logger.js'
   20 | import { sanitizeString } from '../utils/validators.js'
   21 | 
   22 | function orgIdFromUser(user) {
   23 |   return user?.org_id || user?.organization_id || user?.id
   24 | }
   25 | 
   26 | function handleError(res, error) {
   27 |   return handleControllerError(res, error)
   28 | }
   29 | 
   30 | export async function askAssistant(req, res) {
   31 |   const orgId = orgIdFromUser(req.user)
   32 |   const question = req.body?.question || ''
   33 |   logInfo('Assistant /ask request received', {
   34 |     org_id: orgId,
   35 |     question_chars: String(question).length,
   36 |   })
   37 |   const result = await assistantReply(orgId, question)
   38 |   return res.json(result)
   39 | }
   40 | 
   41 | export async function askAssistantPublic(req, res) {
   42 |   const question = req.body?.question || ''
   43 |   logInfo('Assistant /ask-public request received', {
   44 |     question_chars: String(question).length,
   45 |   })
   46 |   const result = await assistantReply('public_ws', question)
   47 |   return res.json(result)
   48 | }
   49 | 
   50 | export async function getAssistantKnowledge(req, res) {
   51 |   const orgId = orgIdFromUser(req.user)
   52 |   const entries = await listKnowledge(orgId)
   53 |   return res.json({ entries })
   54 | }
   55 | 
   56 | export async function createAssistantKnowledge(req, res) {
   57 |   if (!canManageMembers(req.user)) return deny(res)
   58 |   try {
   59 |     const orgId = orgIdFromUser(req.user)
   60 |     const entry = await createKnowledgeEntry(orgId, req.body || {})
   61 |     return res.status(201).json(entry)
   62 |   } catch (error) {
   63 |     return handleError(res, error)
   64 |   }
   65 | }
   66 | 
   67 | export async function updateAssistantKnowledge(req, res) {
   68 |   if (!canManageMembers(req.user)) return deny(res)
   69 |   try {
   70 |     const orgId = orgIdFromUser(req.user)
   71 |     const entry = await updateKnowledgeEntry(orgId, req.params.entryId, req.body || {})
   72 |     return res.json(entry)
   73 |   } catch (error) {
   74 |     return handleError(res, error)
   75 |   }
   76 | }
   77 | 
   78 | export async function removeAssistantKnowledge(req, res) {
   79 |   if (!canManageMembers(req.user)) return deny(res)
   80 |   const orgId = orgIdFromUser(req.user)
   81 |   const ok = await deleteKnowledgeEntry(orgId, req.params.entryId)
   82 |   if (!ok) return res.status(404).json({ error: 'Knowledge entry not found' })
   83 |   return res.json({ ok: true })
   84 | }
   85 | 
   86 | export async function getConversationSummary(req, res) {
   87 |   const matchId = sanitizeString(String(req.body?.match_id || ''), 200)
   88 |   if (!matchId) return res.status(400).json({ error: 'match_id is required' })
   89 | 
   90 |   const allowed = await canAccessMatch(matchId, req.user.id)
   91 |   if (!allowed) return res.status(403).json({ error: 'Forbidden' })
   92 | 
   93 |   const orgOwnerId = await resolveOrgOwnerFromMatch(matchId, req.user.id) || orgIdFromUser(req.user)
   94 |   const force = Boolean(req.body?.force)
   95 | 
   96 |   try {
   97 |     let result = null
   98 |     let fromAuto = false
   99 |     if (!force && orgOwnerId) {
  100 |       result = await autoSummarizeMatch({ matchId, orgOwnerId })
  101 |       fromAuto = Boolean(result)
  102 |     }
  103 |     if (!result) {
  104 |       result = await generateConversationSummary(matchId)
  105 |     }
  106 |     if (result && orgOwnerId && !fromAuto) {
  107 |       await recordSummaryNote({ matchId, orgOwnerId, summary: result })
  108 |     }
  109 | 
  110 |     if (!result) return res.status(404).json({ error: 'No messages to summarize' })
  111 |     return res.json({ ok: true, summary: result.summary, suggested_reply: result.suggested_reply || '' })
  112 |   } catch (error) {
  113 |     return handleControllerError(res, error)
  114 |   }
  115 | }
  116 | 
  117 | export async function getNegotiationHelper(req, res) {
  118 |   const matchId = sanitizeString(String(req.body?.match_id || ''), 200)
  119 |   if (!matchId) return res.status(400).json({ error: 'match_id is required' })
  120 | 
  121 |   const allowed = await canAccessMatch(matchId, req.user.id)
  122 |   if (!allowed) return res.status(403).json({ error: 'Forbidden' })
  123 | 
  124 |   const orgOwnerId = await resolveOrgOwnerFromMatch(matchId, req.user.id) || orgIdFromUser(req.user)
  125 | 
  126 |   try {
  127 |     const helper = await generateNegotiationHelper(matchId)
  128 |     if (!helper) return res.status(404).json({ error: 'No messages to analyze' })
  129 | 
  130 |     if (orgOwnerId) {
  131 |       await recordNegotiationNote({ matchId, orgOwnerId, helper })
  132 |     }
  133 | 
  134 |     return res.json({
  135 |       ok: true,
  136 |       guidance: helper.guidance || '',
  137 |       suggested_reply: helper.suggested_reply || '',
  138 |     })
  139 |   } catch (error) {
  140 |     return handleControllerError(res, error)
  141 |   }
  142 | }
  143 | 
  144 | export async function postExtractRequirement(req, res) {
  145 |   try {
  146 |     const text = String(req.body?.text || '')
  147 |     if (!text) return res.status(400).json({ error: 'text is required' })
  148 |     const orgId = orgIdFromUser(req.user)
  149 |     const result = await aiOrchestration.extractRequirementFromText(text, orgId)
  150 |     return res.json(result)
  151 |   } catch (error) {
  152 |     return handleControllerError(res, error)
  153 |   }
  154 | }
  155 | 
  156 | export async function postGenerateFirstResponse(req, res) {
  157 |   try {
  158 |     const { extracted, match_id } = req.body || {}
  159 |     if (!extracted) return res.status(400).json({ error: 'extracted fields are required' })
  160 |     const orgId = orgIdFromUser(req.user)
  161 |     const draft = aiOrchestration.generateDraftResponse(extracted, [])
  162 |     const validation = await aiOrchestration.validateDraftResponse(draft, extracted, null, orgId)
  163 |     if (match_id) await aiOrchestration.persistAiMetadataForMatch(match_id, validation)
  164 |     return res.json({ draft, meta: validation })
  165 |   } catch (error) {
  166 |     return handleControllerError(res, error)
  167 |   }
  168 | }
  169 | 
  170 | export async function postValidateResponse(req, res) {
  171 |   try {
  172 |     const { draft, extracted, threshold = 0.6, match_id } = req.body || {}
  173 |     if (!draft || !extracted) return res.status(400).json({ error: 'draft and extracted are required' })
  174 |     const orgId = orgIdFromUser(req.user)
  175 |     const result = await aiOrchestration.validateDraftResponse(draft, extracted, threshold, orgId)
  176 |     if (match_id) await aiOrchestration.persistAiMetadataForMatch(match_id, result)
  177 |     return res.json(result)
  178 |   } catch (error) {
  179 |     return handleControllerError(res, error)
  180 |   }
  181 | }
  182 | 