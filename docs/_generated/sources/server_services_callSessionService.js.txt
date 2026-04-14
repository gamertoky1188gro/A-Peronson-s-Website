    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { recordMilestone } from './ratingsService.js'
    5 | import { recordWorkflowEvent } from './workflowLifecycleService.js'
    6 | 
    7 | const FILE = 'call_sessions.json'
    8 | const RECORDING_VIEWS_FILE = 'call_recording_views.json'
    9 | const MESSAGE_FILE = 'messages.json'
   10 | const REQUIREMENT_FILE = 'requirements.json'
   11 | const CALL_STATUS = {
   12 |   SCHEDULED: 'scheduled',
   13 |   IN_PROGRESS: 'in_progress',
   14 |   ENDED: 'ended',
   15 |   COMPLETED: 'completed',
   16 | }
   17 | const RECORDING_STATUS = {
   18 |   PENDING: 'pending',
   19 |   PROCESSING: 'processing',
   20 |   AVAILABLE: 'available',
   21 |   FAILED: 'failed',
   22 | }
   23 | 
   24 | function normalizeParticipantIds(participantIds = [], ownerId) {
   25 |   const all = [ownerId, ...(Array.isArray(participantIds) ? participantIds : [])]
   26 |   return [...new Set(all.filter(Boolean).map((id) => sanitizeString(id, 120)))]
   27 | }
   28 | 
   29 | function buildAuditEntry(event, actorId, metadata = {}) {
   30 |   return {
   31 |     id: crypto.randomUUID(),
   32 |     event,
   33 |     actor_id: actorId,
   34 |     timestamp: new Date().toISOString(),
   35 |     metadata,
   36 |   }
   37 | }
   38 | 
   39 | function parseFriendMatchId(matchId = '') {
   40 |   const parts = String(matchId).split(':')
   41 |   if (parts.length !== 3 || parts[0] !== 'friend') return null
   42 |   const first = sanitizeString(parts[1], 120)
   43 |   const second = sanitizeString(parts[2], 120)
   44 |   if (!first || !second) return null
   45 |   return [first, second]
   46 | }
   47 | 
   48 | function parseMarketplaceMatchId(matchId = '') {
   49 |   const parts = String(matchId).split(':')
   50 |   if (parts.length !== 2) return null
   51 |   const requirementId = sanitizeString(parts[0], 120)
   52 |   const factoryId = sanitizeString(parts[1], 120)
   53 |   if (!requirementId || !factoryId) return null
   54 |   return { requirementId, factoryId }
   55 | }
   56 | 
   57 | async function deriveParticipantIds(matchId) {
   58 |   const ids = new Set()
   59 |   const friendPair = parseFriendMatchId(matchId)
   60 |   if (Array.isArray(friendPair)) {
   61 |     friendPair.forEach((id) => { if (id) ids.add(id) })
   62 |   }
   63 | 
   64 |   const marketplacePair = parseMarketplaceMatchId(matchId)
   65 |   if (marketplacePair?.factoryId) {
   66 |     ids.add(marketplacePair.factoryId)
   67 |     const requirements = await readJson(REQUIREMENT_FILE)
   68 |     const requirement = requirements.find((row) => String(row?.id || '') === marketplacePair.requirementId) || null
   69 |     const buyerId = sanitizeString(requirement?.buyer_id || requirement?.buyerId, 120)
   70 |     if (buyerId) ids.add(buyerId)
   71 |   }
   72 | 
   73 |   const messages = await readJson(MESSAGE_FILE)
   74 |   messages
   75 |     .filter((message) => message?.match_id === matchId)
   76 |     .forEach((message) => {
   77 |       const senderId = sanitizeString(message?.sender_id, 120)
   78 |       if (senderId) ids.add(senderId)
   79 |     })
   80 | 
   81 |   return [...ids]
   82 | }
   83 | 
   84 | function ensureParticipant(call, userId) {
   85 |   return call.participant_ids.includes(userId) || call.created_by === userId
   86 | }
   87 | 
   88 | export async function createScheduledCallSession(userId, payload = {}) {
   89 |   const calls = await readJson(FILE)
   90 |   const parsedScheduledFor = payload?.scheduled_for ? new Date(payload.scheduled_for) : new Date()
   91 |   const scheduledFor = Number.isNaN(parsedScheduledFor.getTime()) ? new Date().toISOString() : parsedScheduledFor.toISOString()
   92 |   const row = {
   93 |     id: crypto.randomUUID(),
   94 |     created_by: userId,
   95 |     match_id: sanitizeString(payload?.match_id, 120),
   96 |     title: sanitizeString(payload?.title || 'Scheduled call', 180),
   97 |     scheduled_for: scheduledFor,
   98 |     duration_minutes: Number(payload?.duration_minutes) > 0 ? Number(payload.duration_minutes) : 30,
   99 |     participant_ids: normalizeParticipantIds(payload?.participant_ids, userId),
  100 |     status: CALL_STATUS.SCHEDULED,
  101 |     recording_url: '',
  102 |     recording_status: RECORDING_STATUS.PENDING,
  103 |     contract_id: sanitizeString(payload?.contract_id, 120),
  104 |     security_audit_id: sanitizeString(payload?.security_audit_id, 120),
  105 |     context: {
  106 |       chat_thread_id: sanitizeString(payload?.chat_thread_id || payload?.match_id, 120),
  107 |       notes: sanitizeString(payload?.notes, 400),
  108 |     },
  109 |     created_at: new Date().toISOString(),
  110 |     started_at: null,
  111 |     ended_at: null,
  112 |     audit_trail: [buildAuditEntry('scheduled', userId, { scheduled_for: scheduledFor })],
  113 |   }
  114 | 
  115 |   calls.push(row)
  116 |   await writeJson(FILE, calls)
  117 |   await recordWorkflowEvent('call_scheduled', {
  118 |     match_id: row.match_id,
  119 |     chat_thread_id: row.context?.chat_thread_id || row.match_id,
  120 |     contract_id: row.contract_id,
  121 |     call_id: row.id,
  122 |   }, { actor_id: userId, scheduled_for: row.scheduled_for }).catch(() => null)
  123 |   return row
  124 | }
  125 | 
  126 | export async function startCallSession(callId, userId) {
  127 |   const calls = await readJson(FILE)
  128 |   const idx = calls.findIndex((call) => call.id === callId)
  129 |   if (idx < 0) return null
  130 |   const call = calls[idx]
  131 |   if (!ensureParticipant(call, userId)) return 'forbidden'
  132 | 
  133 |   if (![CALL_STATUS.SCHEDULED, CALL_STATUS.IN_PROGRESS].includes(call.status)) return 'invalid_transition'
  134 | 
  135 |   const next = {
  136 |     ...call,
  137 |     status: CALL_STATUS.IN_PROGRESS,
  138 |     started_at: call.started_at || new Date().toISOString(),
  139 |     audit_trail: [...(call.audit_trail || []), buildAuditEntry('started', userId)],
  140 |   }
  141 |   calls[idx] = next
  142 |   await writeJson(FILE, calls)
  143 |   await recordWorkflowEvent('call_joined', {
  144 |     match_id: next.match_id,
  145 |     contract_id: next.contract_id,
  146 |   }, { actor_id: userId, source: 'calls.start' }).catch(() => null)
  147 | 
  148 |   return next
  149 | }
  150 | 
  151 | export async function endCallSession(callId, userId, endReason = '') {
  152 |   const calls = await readJson(FILE)
  153 |   const idx = calls.findIndex((call) => call.id === callId)
  154 |   if (idx < 0) return null
  155 |   const call = calls[idx]
  156 |   if (!ensureParticipant(call, userId)) return 'forbidden'
  157 | 
  158 |   if (![CALL_STATUS.SCHEDULED, CALL_STATUS.IN_PROGRESS].includes(call.status)) return 'invalid_transition'
  159 | 
  160 |   const reason = sanitizeString(endReason || 'completed', 120)
  161 |   const next = {
  162 |     ...call,
  163 |     status: CALL_STATUS.ENDED,
  164 |     ended_at: call.ended_at || new Date().toISOString(),
  165 |     recording_status: RECORDING_STATUS.PROCESSING,
  166 |     audit_trail: [
  167 |       ...(call.audit_trail || []),
  168 |       buildAuditEntry('ended', userId, { reason }),
  169 |       buildAuditEntry('recording_processing', userId, { reason: 'call_ended' }),
  170 |     ],
  171 |   }
  172 |   calls[idx] = next
  173 |   await writeJson(FILE, calls)
  174 |   await recordWorkflowEvent('call_ended', {
  175 |     match_id: next.match_id,
  176 |     contract_id: next.contract_id,
  177 |   }, { actor_id: userId, source: 'calls.end' }).catch(() => null)
  178 | 
  179 |   return next
  180 | }
  181 | 
  182 | export async function markRecording(callId, userId, payload = {}) {
  183 |   const calls = await readJson(FILE)
  184 |   const idx = calls.findIndex((call) => call.id === callId)
  185 |   if (idx < 0) return null
  186 |   const call = calls[idx]
  187 |   if (!ensureParticipant(call, userId)) return 'forbidden'
  188 | 
  189 |   const recordingStatus = sanitizeString(payload?.recording_status || RECORDING_STATUS.AVAILABLE, 30)
  190 |   const recordingUrl = sanitizeString(payload?.recording_url, 400)
  191 |   const failureReason = sanitizeString(payload?.failure_reason, 240)
  192 |   const currentStatus = sanitizeString(call?.recording_status || RECORDING_STATUS.PENDING, 30)
  193 | 
  194 |   const transitionKey = `${currentStatus}->${recordingStatus}`
  195 |   const validTransitions = new Set([
  196 |     `${RECORDING_STATUS.PENDING}->${RECORDING_STATUS.PROCESSING}`,
  197 |     `${RECORDING_STATUS.PROCESSING}->${RECORDING_STATUS.AVAILABLE}`,
  198 |     `${RECORDING_STATUS.PROCESSING}->${RECORDING_STATUS.FAILED}`,
  199 |   ])
  200 |   if (!validTransitions.has(transitionKey)) return 'invalid_transition'
  201 | 
  202 |   if (recordingStatus === RECORDING_STATUS.AVAILABLE && !recordingUrl) return 'missing_metadata'
  203 |   if (recordingStatus === RECORDING_STATUS.FAILED && !failureReason) return 'missing_failure_reason'
  204 | 
  205 |   const shouldComplete = [RECORDING_STATUS.AVAILABLE, RECORDING_STATUS.FAILED].includes(recordingStatus)
  206 |   const auditTrail = [
  207 |     ...(call.audit_trail || []),
  208 |     buildAuditEntry('recording_updated', userId, {
  209 |       from: currentStatus,
  210 |       to: recordingStatus,
  211 |       recording_url: recordingUrl,
  212 |       failure_reason: failureReason,
  213 |     }),
  214 |   ]
  215 | 
  216 |   if (recordingStatus === RECORDING_STATUS.AVAILABLE) {
  217 |     auditTrail.push(buildAuditEntry('recording_available', userId, { recording_url: recordingUrl }))
  218 |   }
  219 | 
  220 |   if (recordingStatus === RECORDING_STATUS.FAILED) {
  221 |     auditTrail.push(buildAuditEntry('recording_failed', userId, { failure_reason: failureReason }))
  222 |   }
  223 | 
  224 |   if (shouldComplete) {
  225 |     auditTrail.push(buildAuditEntry('completed', userId, { recording_status: recordingStatus }))
  226 |   }
  227 | 
  228 |   const next = {
  229 |     ...call,
  230 |     recording_status: recordingStatus,
  231 |     recording_url: recordingUrl,
  232 |     status: shouldComplete ? CALL_STATUS.COMPLETED : call.status,
  233 |     audit_trail: auditTrail,
  234 |   }
  235 |   calls[idx] = next
  236 |   await writeJson(FILE, calls)
  237 | 
  238 |   if (shouldComplete) {
  239 |     await recordWorkflowEvent('call_ended', {
  240 |       match_id: call.match_id,
  241 |       chat_thread_id: call.context?.chat_thread_id || call.match_id,
  242 |       contract_id: call.contract_id,
  243 |       call_id: call.id,
  244 |     }, { actor_id: userId, recording_status: recordingStatus }).catch(() => null)
  245 |     const participants = normalizeParticipantIds(call.participant_ids, call.created_by).filter((id) => id !== userId)
  246 |     await Promise.all(participants.map((counterpartyId) => recordMilestone({
  247 |       profileKey: `user:${userId}`,
  248 |       counterpartyId,
  249 |       interactionType: 'call',
  250 |       milestone: 'communication_completed',
  251 |       actorId: userId,
  252 |     })))
  253 |   }
  254 | 
  255 |   return next
  256 | }
  257 | 
  258 | export async function getCallSession(callId, userId) {
  259 |   const calls = await readJson(FILE)
  260 |   const call = calls.find((item) => item.id === callId)
  261 |   if (!call) return null
  262 |   if (!ensureParticipant(call, userId)) return 'forbidden'
  263 |   return call
  264 | }
  265 | 
  266 | export async function listCallHistory(matchIds = [], userId) {
  267 |   const calls = await readJson(FILE)
  268 |   const allowed = calls.filter((call) => ensureParticipant(call, userId))
  269 |   if (!Array.isArray(matchIds) || matchIds.length === 0) {
  270 |     return allowed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  271 |   }
  272 | 
  273 |   const ids = new Set(matchIds)
  274 |   return allowed
  275 |     .filter((call) => ids.has(call.match_id) || ids.has(call.context?.chat_thread_id))
  276 |     .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  277 | }
  278 | 
  279 | 
  280 | export async function findOrCreateCallSession(userId, payload = {}) {
  281 |   const matchId = sanitizeString(payload?.match_id, 120)
  282 |   if (!matchId) {
  283 |     const error = new Error('match_id is required')
  284 |     error.status = 400
  285 |     throw error
  286 |   }
  287 | 
  288 |   const calls = await readJson(FILE)
  289 |   const candidates = calls
  290 |     .filter((call) => ensureParticipant(call, userId) && call.match_id === matchId)
  291 |     .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  292 | 
  293 |   const active = candidates.find((call) => [CALL_STATUS.SCHEDULED, CALL_STATUS.IN_PROGRESS, CALL_STATUS.ENDED].includes(call.status))
  294 |   if (active) return { call: active, created: false }
  295 | 
  296 |   let participantIds = Array.isArray(payload?.participant_ids) ? payload.participant_ids : []
  297 |   if (participantIds.length === 0) {
  298 |     participantIds = await deriveParticipantIds(matchId)
  299 |   }
  300 | 
  301 |   const createdCall = await createScheduledCallSession(userId, {
  302 |     ...payload,
  303 |     participant_ids: participantIds,
  304 |   })
  305 |   return { call: createdCall, created: true }
  306 | }
  307 | 
  308 | export async function listCallsByContract(contractId, userId) {
  309 |   const id = sanitizeString(String(contractId || ''), 120)
  310 |   if (!id) return []
  311 |   const calls = await readJson(FILE)
  312 |   return (Array.isArray(calls) ? calls : [])
  313 |     .filter((call) => ensureParticipant(call, userId) && String(call.contract_id || '') === id)
  314 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  315 | }
  316 | 
  317 | export async function getRecordingMetadata(callId, userId) {
  318 |   const call = await getCallSession(callId, userId)
  319 |   if (!call) return null
  320 |   if (call === 'forbidden') return 'forbidden'
  321 | 
  322 |   const views = await readJson(RECORDING_VIEWS_FILE)
  323 |   const rows = Array.isArray(views) ? views : []
  324 |   const viewCount = rows.filter((v) => String(v.call_id || '') === String(callId || '')).length
  325 |   return {
  326 |     call_id: call.id,
  327 |     match_id: call.match_id || '',
  328 |     contract_id: call.contract_id || '',
  329 |     recording_status: call.recording_status || 'pending',
  330 |     recording_url: call.recording_url || '',
  331 |     recording_updated_at: call.recording_updated_at || call.updated_at || '',
  332 |     views: viewCount,
  333 |   }
  334 | }
  335 | 
  336 | export async function markRecordingViewed(callId, userId) {
  337 |   const call = await getCallSession(callId, userId)
  338 |   if (!call) return null
  339 |   if (call === 'forbidden') return 'forbidden'
  340 | 
  341 |   const views = await readJson(RECORDING_VIEWS_FILE)
  342 |   const rows = Array.isArray(views) ? views : []
  343 |   rows.push({
  344 |     id: crypto.randomUUID(),
  345 |     call_id: String(callId || ''),
  346 |     viewer_id: String(userId || ''),
  347 |     viewed_at: new Date().toISOString(),
  348 |   })
  349 |   await writeJson(RECORDING_VIEWS_FILE, rows)
  350 |   return { ok: true }
  351 | }
  352 | 