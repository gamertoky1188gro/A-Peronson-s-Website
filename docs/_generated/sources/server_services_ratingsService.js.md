    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | const FILE = 'ratings.json'
    6 | const NOTIFICATIONS_FILE = 'notifications.json'
    7 | const CALLS_FILE = 'call_sessions.json'
    8 | const DOCUMENTS_FILE = 'documents.json'
    9 | const MESSAGES_FILE = 'messages.json'
   10 | const AUTO_RATING_DAYS = Number(process.env.AUTO_RATING_DAYS || 7)
   11 | const QUALIFICATION_RULES = [
   12 |   ['contract_signed', 'communication_completed'],
   13 |   ['deal_completed'],
   14 | ]
   15 | const RECENT_LIMIT = 10
   16 | 
   17 | function normalizeProfileKey(profileKey) {
   18 |   const value = sanitizeString(profileKey, 160)
   19 |   return value || ''
   20 | }
   21 | 
   22 | function parseUserIdFromProfileKey(profileKey) {
   23 |   const normalized = normalizeProfileKey(profileKey)
   24 |   if (!normalized) return ''
   25 |   if (normalized.startsWith('user:')) return normalized.slice('user:'.length)
   26 |   return ''
   27 | }
   28 | 
   29 | function safeNumber(value, fallback = 0) {
   30 |   const parsed = Number(value)
   31 |   return Number.isFinite(parsed) ? parsed : fallback
   32 | }
   33 | 
   34 | function emptyStore() {
   35 |   return { ratings: [], milestones: [], feedback_requests: [], feedback_events: [] }
   36 | }
   37 | 
   38 | async function readStore() {
   39 |   const store = await readJson(FILE)
   40 |   if (!store || typeof store !== 'object' || Array.isArray(store)) return emptyStore()
   41 |   return {
   42 |     ratings: Array.isArray(store.ratings) ? store.ratings : [],
   43 |     milestones: Array.isArray(store.milestones) ? store.milestones : [],
   44 |     feedback_requests: Array.isArray(store.feedback_requests) ? store.feedback_requests : [],
   45 |     feedback_events: Array.isArray(store.feedback_events) ? store.feedback_events : [],
   46 |   }
   47 | }
   48 | 
   49 | async function saveStore(store) {
   50 |   await writeJson(FILE, store)
   51 | }
   52 | 
   53 | async function createFeedbackRequestNotification(counterpartyId, profileKey) {
   54 |   const notifications = await readJson(NOTIFICATIONS_FILE)
   55 |   notifications.push({
   56 |     id: crypto.randomUUID(),
   57 |     user_id: counterpartyId,
   58 |     type: 'rating_feedback_request',
   59 |     entity_type: 'profile',
   60 |     entity_id: profileKey,
   61 |     message: 'A completed interaction qualifies for feedback. Please submit a rating.',
   62 |     meta: {
   63 |       profile_key: profileKey,
   64 |       counterparty_id: counterpartyId,
   65 |     },
   66 |     read: false,
   67 |     created_at: new Date().toISOString(),
   68 |   })
   69 |   await writeJson(NOTIFICATIONS_FILE, notifications)
   70 | }
   71 | 
   72 | function sortByCreatedAtDesc(rows) {
   73 |   return [...rows].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
   74 | }
   75 | 
   76 | function computeBreakdown(ratings) {
   77 |   const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
   78 |   for (const rating of ratings) {
   79 |     const value = Math.min(5, Math.max(1, Math.round(safeNumber(rating.score, 0))))
   80 |     counts[value] += 1
   81 |   }
   82 |   return counts
   83 | }
   84 | 
   85 | function computeReliability(ratings) {
   86 |   if (!ratings.length) {
   87 |     return { confidence: 'low', verified_counterparty_ratio: 0, qualified_interaction_ratio: 0, recent_volume: 0 }
   88 |   }
   89 | 
   90 |   let verifiedCounterparty = 0
   91 |   let qualifiedInteraction = 0
   92 |   const recent = sortByCreatedAtDesc(ratings).slice(0, 30)
   93 | 
   94 |   for (const row of ratings) {
   95 |     if (row.reliability_flags?.verified_counterparty) verifiedCounterparty += 1
   96 |     if (row.reliability_flags?.qualified_milestone_pair) qualifiedInteraction += 1
   97 |   }
   98 | 
   99 |   const verifiedRatio = verifiedCounterparty / ratings.length
  100 |   const qualifiedRatio = qualifiedInteraction / ratings.length
  101 |   const recentVolume = recent.length
  102 |   const confidence = ratings.length >= 20 && verifiedRatio >= 0.6 ? 'high' : ratings.length >= 8 ? 'medium' : 'low'
  103 | 
  104 |   return {
  105 |     confidence,
  106 |     verified_counterparty_ratio: Number(verifiedRatio.toFixed(2)),
  107 |     qualified_interaction_ratio: Number(qualifiedRatio.toFixed(2)),
  108 |     recent_volume: recentVolume,
  109 |   }
  110 | }
  111 | 
  112 | function computeConfidenceMetadata(ratings, averageScore) {
  113 |   const sampleSize = ratings.length
  114 |   if (!sampleSize) {
  115 |     return {
  116 |       sample_size: 0,
  117 |       score_confidence: 0,
  118 |       standard_deviation: 0,
  119 |       margin_of_error_95: 0,
  120 |       ci95_lower: 0,
  121 |       ci95_upper: 0,
  122 |     }
  123 |   }
  124 | 
  125 |   const variance = ratings.reduce((acc, row) => {
  126 |     const delta = safeNumber(row.score, 0) - averageScore
  127 |     return acc + (delta * delta)
  128 |   }, 0) / sampleSize
  129 | 
  130 |   const stdDev = Math.sqrt(variance)
  131 |   const marginError = 1.96 * (stdDev / Math.sqrt(sampleSize))
  132 |   const normalizedConfidence = Math.max(0, Math.min(1, (sampleSize / (sampleSize + 6)) * (1 - (stdDev / 2.5))))
  133 | 
  134 |   return {
  135 |     sample_size: sampleSize,
  136 |     score_confidence: Number(normalizedConfidence.toFixed(2)),
  137 |     standard_deviation: Number(stdDev.toFixed(2)),
  138 |     margin_of_error_95: Number(marginError.toFixed(2)),
  139 |     ci95_lower: Number(Math.max(0, averageScore - marginError).toFixed(2)),
  140 |     ci95_upper: Number(Math.min(5, averageScore + marginError).toFixed(2)),
  141 |   }
  142 | }
  143 | 
  144 | function profileQualifiesForFeedback(completedMilestones = []) {
  145 |   return QUALIFICATION_RULES.some((rule) => rule.every((milestone) => completedMilestones.includes(milestone)))
  146 | }
  147 | 
  148 | function hasRecordedCall(calls, firstId, secondId) {
  149 |   if (!firstId || !secondId) return false
  150 |   return (Array.isArray(calls) ? calls : []).some((call) => {
  151 |     const participants = Array.isArray(call?.participant_ids) ? call.participant_ids.map(String) : []
  152 |     if (!participants.includes(String(firstId)) || !participants.includes(String(secondId))) return false
  153 |     return String(call?.recording_status || '').toLowerCase() === 'available' && call?.recording_url
  154 |   })
  155 | }
  156 | 
  157 | function hasSignedContract(contracts, firstId, secondId) {
  158 |   if (!firstId || !secondId) return false
  159 |   return (Array.isArray(contracts) ? contracts : []).some((contract) => {
  160 |     if (String(contract?.entity_type || '') !== 'contract') return false
  161 |     const buyerId = String(contract?.buyer_id || '')
  162 |     const factoryId = String(contract?.factory_id || '')
  163 |     const matches = (buyerId === String(firstId) && factoryId === String(secondId))
  164 |       || (buyerId === String(secondId) && factoryId === String(firstId))
  165 |     if (!matches) return false
  166 |     const buyerSigned = String(contract?.buyer_signature_state || '').toLowerCase() === 'signed'
  167 |     const factorySigned = String(contract?.factory_signature_state || '').toLowerCase() === 'signed'
  168 |     return buyerSigned && factorySigned
  169 |   })
  170 | }
  171 | 
  172 | function averageResponseHours(messages, responderId, requesterId) {
  173 |   if (!responderId || !requesterId) return null
  174 |   const threads = new Map()
  175 |   ;(Array.isArray(messages) ? messages : []).forEach((msg) => {
  176 |     const matchId = String(msg?.match_id || '')
  177 |     if (!matchId) return
  178 |     const senderId = String(msg?.sender_id || '')
  179 |     if (![responderId, requesterId].includes(senderId)) return
  180 |     if (!threads.has(matchId)) threads.set(matchId, [])
  181 |     threads.get(matchId).push(msg)
  182 |   })
  183 | 
  184 |   const responseTimes = []
  185 |   for (const msgs of threads.values()) {
  186 |     const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
  187 |     const firstRequest = sorted.find((m) => String(m.sender_id || '') === String(requesterId))
  188 |     if (!firstRequest?.timestamp) continue
  189 |     const start = new Date(firstRequest.timestamp).getTime()
  190 |     if (!Number.isFinite(start)) continue
  191 |     const response = sorted.find((m) => String(m.sender_id || '') === String(responderId) && new Date(m.timestamp).getTime() >= start)
  192 |     if (!response?.timestamp) continue
  193 |     const end = new Date(response.timestamp).getTime()
  194 |     if (!Number.isFinite(end)) continue
  195 |     responseTimes.push((end - start) / (1000 * 60 * 60))
  196 |   }
  197 | 
  198 |   if (!responseTimes.length) return null
  199 |   return responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
  200 | }
  201 | 
  202 | function buildSuggestedScore({ contractSigned, recordedCall, avgResponseHours }) {
  203 |   let score = 3.5
  204 |   const reasons = []
  205 | 
  206 |   if (contractSigned) {
  207 |     score += 0.6
  208 |     reasons.push('Contract signed')
  209 |   }
  210 |   if (recordedCall) {
  211 |     score += 0.4
  212 |     reasons.push('Recorded call completed')
  213 |   }
  214 | 
  215 |   if (avgResponseHours !== null) {
  216 |     if (avgResponseHours <= 4) {
  217 |       score += 0.3
  218 |       reasons.push('Fast responses')
  219 |     } else if (avgResponseHours <= 24) {
  220 |       score += 0.1
  221 |       reasons.push('Responsive follow-up')
  222 |     } else if (avgResponseHours > 48) {
  223 |       score -= 0.2
  224 |       reasons.push('Slow response time')
  225 |     }
  226 |   }
  227 | 
  228 |   score = Math.max(1, Math.min(5, score))
  229 |   const rounded = Math.round(score * 10) / 10
  230 |   return { score: rounded, reasons }
  231 | }
  232 | 
  233 | export async function recordMilestone({ profileKey, counterpartyId, interactionType, milestone, actorId }) {
  234 |   const normalizedProfile = normalizeProfileKey(profileKey)
  235 |   const normalizedCounterparty = sanitizeString(counterpartyId, 120)
  236 |   const normalizedInteractionType = sanitizeString(interactionType || 'deal', 40)
  237 |   const normalizedMilestone = sanitizeString(milestone, 60)
  238 | 
  239 |   if (!normalizedProfile || !normalizedCounterparty || !normalizedMilestone) return null
  240 | 
  241 |   const store = await readStore()
  242 |   const now = new Date().toISOString()
  243 |   const existingIndex = store.milestones.findIndex((row) =>
  244 |     row.profile_key === normalizedProfile
  245 |       && row.counterparty_id === normalizedCounterparty
  246 |       && row.interaction_type === normalizedInteractionType
  247 |       && row.milestone === normalizedMilestone)
  248 | 
  249 |   if (existingIndex >= 0) {
  250 |     store.milestones[existingIndex] = {
  251 |       ...store.milestones[existingIndex],
  252 |       status: 'completed',
  253 |       completed_at: now,
  254 |       updated_at: now,
  255 |       updated_by: actorId,
  256 |     }
  257 |   } else {
  258 |     store.milestones.push({
  259 |       id: crypto.randomUUID(),
  260 |       profile_key: normalizedProfile,
  261 |       counterparty_id: normalizedCounterparty,
  262 |       interaction_type: normalizedInteractionType,
  263 |       milestone: normalizedMilestone,
  264 |       status: 'completed',
  265 |       completed_at: now,
  266 |       created_at: now,
  267 |       updated_at: now,
  268 |       updated_by: actorId,
  269 |     })
  270 |   }
  271 | 
  272 |   const completed = store.milestones
  273 |     .filter((row) => row.profile_key === normalizedProfile && row.counterparty_id === normalizedCounterparty && row.status === 'completed')
  274 |     .map((row) => row.milestone)
  275 |   const qualifies = profileQualifiesForFeedback(completed)
  276 | 
  277 |   let feedbackRequest = null
  278 |   if (qualifies) {
  279 |     const existingRequest = store.feedback_requests.find((row) =>
  280 |       row.profile_key === normalizedProfile
  281 |         && row.counterparty_id === normalizedCounterparty
  282 |         && row.status === 'pending')
  283 | 
  284 |     if (!existingRequest) {
  285 |       feedbackRequest = {
  286 |         id: crypto.randomUUID(),
  287 |         profile_key: normalizedProfile,
  288 |         counterparty_id: normalizedCounterparty,
  289 |         interaction_type: normalizedInteractionType,
  290 |         qualification_rules: QUALIFICATION_RULES,
  291 |         status: 'pending',
  292 |         triggered_by: actorId,
  293 |         created_at: now,
  294 |       }
  295 |       store.feedback_requests.push(feedbackRequest)
  296 |       store.feedback_events.push({
  297 |         id: crypto.randomUUID(),
  298 |         profile_key: normalizedProfile,
  299 |         counterparty_id: normalizedCounterparty,
  300 |         interaction_type: normalizedInteractionType,
  301 |         event: 'feedback_requested',
  302 |         milestone: normalizedMilestone,
  303 |         created_at: now,
  304 |       })
  305 |       await createFeedbackRequestNotification(normalizedCounterparty, normalizedProfile)
  306 |     }
  307 |   }
  308 | 
  309 |   await saveStore(store)
  310 |   return { feedback_request: feedbackRequest, qualifies }
  311 | }
  312 | 
  313 | export async function createRating({ profileKey, fromUserId, interactionType, score, comment = '', reliabilityFlags = {} }) {
  314 |   const normalizedProfile = normalizeProfileKey(profileKey)
  315 |   const normalizedFrom = sanitizeString(fromUserId, 120)
  316 |   const normalizedInteractionType = sanitizeString(interactionType || 'deal', 40)
  317 |   const normalizedComment = sanitizeString(comment, 500)
  318 |   const numericScore = Math.min(5, Math.max(1, Math.round(safeNumber(score, 0))))
  319 | 
  320 |   if (!normalizedProfile || !normalizedFrom || !numericScore) {
  321 |     const err = new Error('profile_key, from_user_id and score are required')
  322 |     err.status = 400
  323 |     throw err
  324 |   }
  325 | 
  326 |   const store = await readStore()
  327 |   const pendingIdx = store.feedback_requests.findIndex((row) => row.profile_key === normalizedProfile && row.counterparty_id === normalizedFrom && row.status === 'pending')
  328 |   if (pendingIdx >= 0) {
  329 |     store.feedback_requests[pendingIdx].status = 'fulfilled'
  330 |     store.feedback_requests[pendingIdx].fulfilled_at = new Date().toISOString()
  331 |   }
  332 | 
  333 |   const rating = {
  334 |     id: crypto.randomUUID(),
  335 |     profile_key: normalizedProfile,
  336 |     from_user_id: normalizedFrom,
  337 |     interaction_type: normalizedInteractionType,
  338 |     score: numericScore,
  339 |     comment: normalizedComment,
  340 |     reliability_flags: {
  341 |       verified_counterparty: Boolean(reliabilityFlags.verified_counterparty),
  342 |       qualified_milestone_pair: Boolean(reliabilityFlags.qualified_milestone_pair),
  343 |       auto_generated: Boolean(reliabilityFlags.auto_generated),
  344 |     },
  345 |     auto_generated: Boolean(reliabilityFlags.auto_generated),
  346 |     created_at: new Date().toISOString(),
  347 |   }
  348 | 
  349 |   store.ratings.push(rating)
  350 |   await saveStore(store)
  351 |   return rating
  352 | }
  353 | 
  354 | async function autoGenerateRatingsForOverdueRequests() {
  355 |   const store = await readStore()
  356 |   const pending = store.feedback_requests.filter((row) => row.status === 'pending')
  357 |   if (!pending.length) return store
  358 | 
  359 |   const now = Date.now()
  360 |   const cutoffMs = Math.max(1, AUTO_RATING_DAYS) * 24 * 60 * 60 * 1000
  361 |   const overdue = pending.filter((row) => {
  362 |     const ts = new Date(row.created_at || '').getTime()
  363 |     if (!Number.isFinite(ts)) return false
  364 |     return now - ts >= cutoffMs
  365 |   })
  366 |   if (!overdue.length) return store
  367 | 
  368 |   const [calls, documents, messages] = await Promise.all([
  369 |     readJson(CALLS_FILE),
  370 |     readJson(DOCUMENTS_FILE),
  371 |     readJson(MESSAGES_FILE),
  372 |   ])
  373 | 
  374 |   for (const row of overdue) {
  375 |     const profileKey = normalizeProfileKey(row.profile_key)
  376 |     const counterpartyId = sanitizeString(row.counterparty_id, 120)
  377 |     if (!profileKey || !counterpartyId) continue
  378 | 
  379 |     const alreadyRated = store.ratings.some((rating) =>
  380 |       rating.profile_key === profileKey && String(rating.from_user_id || '') === String(counterpartyId))
  381 |     if (alreadyRated) {
  382 |       row.status = 'fulfilled'
  383 |       row.fulfilled_at = row.fulfilled_at || new Date().toISOString()
  384 |       continue
  385 |     }
  386 | 
  387 |     const targetUserId = parseUserIdFromProfileKey(profileKey)
  388 |     const contractSigned = hasSignedContract(documents, targetUserId, counterpartyId)
  389 |     const recordedCall = hasRecordedCall(calls, targetUserId, counterpartyId)
  390 |     const avgResponseHours = averageResponseHours(messages, targetUserId, counterpartyId)
  391 |     const suggestion = buildSuggestedScore({ contractSigned, recordedCall, avgResponseHours })
  392 | 
  393 |     const score = suggestion.reasons.length
  394 |       ? (Number.isFinite(Number(suggestion.score)) ? suggestion.score : 5)
  395 |       : 5
  396 |     const comment = 'Auto-rating (no user feedback).'
  397 | 
  398 |     store.ratings.push({
  399 |       id: crypto.randomUUID(),
  400 |       profile_key: profileKey,
  401 |       from_user_id: counterpartyId,
  402 |       interaction_type: sanitizeString(row.interaction_type || 'deal', 40),
  403 |       score: Math.min(5, Math.max(1, Math.round(score))),
  404 |       comment,
  405 |       reliability_flags: {
  406 |         verified_counterparty: false,
  407 |         qualified_milestone_pair: false,
  408 |         auto_generated: true,
  409 |       },
  410 |       auto_generated: true,
  411 |       created_at: new Date().toISOString(),
  412 |     })
  413 | 
  414 |     row.status = 'fulfilled'
  415 |     row.fulfilled_at = new Date().toISOString()
  416 |     store.feedback_events.push({
  417 |       id: crypto.randomUUID(),
  418 |       profile_key: profileKey,
  419 |       counterparty_id: counterpartyId,
  420 |       interaction_type: sanitizeString(row.interaction_type || 'deal', 40),
  421 |       event: 'auto_rating',
  422 |       milestone: 'no_user_feedback',
  423 |       created_at: new Date().toISOString(),
  424 |     })
  425 |   }
  426 | 
  427 |   await saveStore(store)
  428 |   return store
  429 | }
  430 | 
  431 | export async function getProfileRatingsSummary(profileKey) {
  432 |   const normalizedProfile = normalizeProfileKey(profileKey)
  433 |   const store = await readStore()
  434 |   const ratings = sortByCreatedAtDesc(store.ratings.filter((row) => row.profile_key === normalizedProfile))
  435 |   const recent = ratings.slice(0, RECENT_LIMIT)
  436 |   const totalCount = ratings.length
  437 |   const average = totalCount ? ratings.reduce((sum, row) => sum + safeNumber(row.score, 0), 0) / totalCount : 0
  438 |   const recentAverage = recent.length ? recent.reduce((sum, row) => sum + safeNumber(row.score, 0), 0) / recent.length : 0
  439 | 
  440 |   return {
  441 |     profile_key: normalizedProfile,
  442 |     aggregate: {
  443 |       average_score: Number(average.toFixed(2)),
  444 |       recent_average_score: Number(recentAverage.toFixed(2)),
  445 |       total_count: totalCount,
  446 |       reliability: computeReliability(ratings),
  447 |       confidence_metadata: computeConfidenceMetadata(ratings, average),
  448 |     },
  449 |     breakdown: computeBreakdown(ratings),
  450 |     recent_reviews: recent.slice(0, 5).map((row) => ({
  451 |       id: row.id,
  452 |       from_user_id: row.from_user_id,
  453 |       score: row.score,
  454 |       comment: row.comment,
  455 |       interaction_type: row.interaction_type,
  456 |       auto_generated: Boolean(row.auto_generated),
  457 |       created_at: row.created_at,
  458 |     })),
  459 |     feedback_requests: store.feedback_requests.filter((row) => row.profile_key === normalizedProfile && row.status === 'pending').length,
  460 |   }
  461 | }
  462 | 
  463 | export async function updateRating({ ratingId, actorId, score, comment }) {
  464 |   const store = await readStore()
  465 |   const idx = store.ratings.findIndex((row) => String(row.id) === String(ratingId || ''))
  466 |   if (idx < 0) return null
  467 |   if (String(store.ratings[idx].from_user_id) !== String(actorId)) {
  468 |     const err = new Error('Only the reviewer can edit this rating')
  469 |     err.status = 403
  470 |     throw err
  471 |   }
  472 | 
  473 |   const nextScore = score === undefined ? store.ratings[idx].score : Math.min(5, Math.max(1, Math.round(safeNumber(score, store.ratings[idx].score || 0))))
  474 |   const nextComment = comment === undefined ? store.ratings[idx].comment : sanitizeString(comment, 500)
  475 | 
  476 |   store.ratings[idx] = {
  477 |     ...store.ratings[idx],
  478 |     score: nextScore,
  479 |     comment: nextComment,
  480 |   }
  481 |   await saveStore(store)
  482 |   return store.ratings[idx]
  483 | }
  484 | 
  485 | export async function deleteRating({ ratingId, actorId }) {
  486 |   const store = await readStore()
  487 |   const idx = store.ratings.findIndex((row) => String(row.id) === String(ratingId || ''))
  488 |   if (idx < 0) return null
  489 |   if (String(store.ratings[idx].from_user_id) !== String(actorId)) {
  490 |     const err = new Error('Only the reviewer can delete this rating')
  491 |     err.status = 403
  492 |     throw err
  493 |   }
  494 | 
  495 |   const [removed] = store.ratings.splice(idx, 1)
  496 |   await saveStore(store)
  497 |   return removed
  498 | }
  499 | 
  500 | export async function getRatingsForProfiles(profileKeys = []) {
  501 |   const keys = [...new Set((Array.isArray(profileKeys) ? profileKeys : []).map(normalizeProfileKey).filter(Boolean))]
  502 |   const result = {}
  503 |   for (const key of keys) {
  504 |     result[key] = await getProfileRatingsSummary(key)
  505 |   }
  506 |   return result
  507 | }
  508 | 
  509 | export async function getAggregateForProfile(profileKey) {
  510 |   const summary = await getProfileRatingsSummary(profileKey)
  511 |   return {
  512 |     profile_key: summary.profile_key,
  513 |     aggregate: summary.aggregate,
  514 |     feedback_requests: summary.feedback_requests,
  515 |   }
  516 | }
  517 | 
  518 | export async function getSearchRatingCards(profileKeys = []) {
  519 |   const summaries = await getRatingsForProfiles(profileKeys)
  520 |   return Object.fromEntries(Object.entries(summaries).map(([profileKey, summary]) => [profileKey, {
  521 |     average_score: summary.aggregate.average_score,
  522 |     total_count: summary.aggregate.total_count,
  523 |     confidence: summary.aggregate.reliability.confidence,
  524 |     score_confidence: summary.aggregate.confidence_metadata.score_confidence,
  525 |     breakdown: summary.breakdown,
  526 |   }]))
  527 | }
  528 | 
  529 | export async function listPendingFeedbackRequestsForUser(userId) {
  530 |   const normalizedUser = sanitizeString(userId, 120)
  531 |   if (!normalizedUser) return []
  532 | 
  533 |   const store = await autoGenerateRatingsForOverdueRequests()
  534 |   const pending = store.feedback_requests
  535 |     .filter((row) => row.status === 'pending' && String(row.counterparty_id || '') === normalizedUser)
  536 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  537 | 
  538 |   if (!pending.length) return []
  539 | 
  540 |   const [calls, documents, messages] = await Promise.all([
  541 |     readJson(CALLS_FILE),
  542 |     readJson(DOCUMENTS_FILE),
  543 |     readJson(MESSAGES_FILE),
  544 |   ])
  545 | 
  546 |   return pending.map((row) => {
  547 |     const targetUserId = parseUserIdFromProfileKey(row.profile_key)
  548 |     const contractSigned = hasSignedContract(documents, targetUserId, normalizedUser)
  549 |     const recordedCall = hasRecordedCall(calls, targetUserId, normalizedUser)
  550 |     const avgResponseHours = averageResponseHours(messages, targetUserId, normalizedUser)
  551 |     const suggestion = buildSuggestedScore({ contractSigned, recordedCall, avgResponseHours })
  552 | 
  553 |     return {
  554 |       ...row,
  555 |       suggested_score: suggestion.score,
  556 |       suggested_reasons: suggestion.reasons,
  557 |       signals: {
  558 |         contract_signed: contractSigned,
  559 |         recorded_call: recordedCall,
  560 |         avg_response_hours: avgResponseHours !== null ? Math.round(avgResponseHours * 10) / 10 : null,
  561 |       },
  562 |     }
  563 |   })
  564 | }
  565 | 