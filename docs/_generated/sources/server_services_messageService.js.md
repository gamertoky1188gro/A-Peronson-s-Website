    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | import { trackTransition } from '../utils/metrics.js'
    6 | import {
    7 |   buildFriendMatchId,
    8 |   hasFriendRelationship,
    9 |   isFriendConnected,
   10 |   listFriendConnectionsForUser,
   11 | } from './friendService.js'
   12 | import { upsertLeadFromMessage } from './leadService.js'
   13 | import { assertMessagingAllowed, moderateTextOrRedactWithContext } from './policyService.js'
   14 | import { getRequirementById } from './requirementService.js'
   15 | import { autoSummarizeMatch, resolveOrgOwnerFromMatch } from './aiConversationService.js'
   16 | import { getOrgAiSettings } from './orgAiService.js'
   17 | import { attachMessageToQueue, evaluateMessagePolicy } from './communicationPolicyService.js'
   18 | import { recordWorkflowEvent } from './workflowLifecycleService.js'
   19 | 
   20 | const FILE = 'messages.json'
   21 | const USERS_FILE = 'users.json'
   22 | const MESSAGE_REQUESTS_FILE = 'message_requests.json'
   23 | const CONVERSATION_LOCKS_FILE = 'conversation_locks.json'
   24 | const MESSAGE_READS_FILE = 'message_reads.json'
   25 | const USE_SQL_CRM = isCrmSqlEnabled()
   26 | 
   27 | async function readStore(fileName) {
   28 |   if (USE_SQL_CRM) return readJson(fileName)
   29 |   return readLegacyJson(fileName)
   30 | }
   31 | 
   32 | function buildUsersById(users = []) {
   33 |   return new Map((Array.isArray(users) ? users : []).map((user) => [user.id, user]))
   34 | }
   35 | 
   36 | function enrichMessage(message = {}, usersById = new Map()) {
   37 |   const sender = usersById.get(message.sender_id) || null
   38 |   const senderName = sanitizeString(sender?.name || '', 120)
   39 |   return {
   40 |     ...message,
   41 |     sender_name: senderName || message.sender_name || '',
   42 |     sender_email: sender?.email || message.sender_email || '',
   43 |     sender_verified: Boolean(sender?.verified),
   44 |     sender_role: sender?.role || message.sender_role || '',
   45 |   }
   46 | }
   47 | 
   48 | function parseFriendMatchId(matchId = '') {
   49 |   const parts = String(matchId).split(':')
   50 |   if (parts.length !== 3 || parts[0] !== 'friend') return null
   51 |   const first = sanitizeString(parts[1], 120)
   52 |   const second = sanitizeString(parts[2], 120)
   53 |   if (!first || !second) return null
   54 |   return [first, second]
   55 | }
   56 | 
   57 | export async function canAccessMatch(matchId, userId) {
   58 |   const pair = parseFriendMatchId(matchId)
   59 |   if (!pair) return true
   60 |   if (!pair.includes(userId)) return false
   61 |   return hasFriendRelationship(pair[0], pair[1], { includePending: true })
   62 | }
   63 | 
   64 | export async function postFriendMessage(senderId, targetUserId, message, type = 'text') {
   65 |   const targetId = sanitizeString(String(targetUserId || ''), 120)
   66 |   if (!targetId || senderId === targetId) {
   67 |     const err = new Error('Invalid friend target')
   68 |     err.status = 400
   69 |     throw err
   70 |   }
   71 | 
   72 |   const connected = await isFriendConnected(senderId, targetId)
   73 |   if (!connected) {
   74 |     const err = new Error('Only friends can send direct messages')
   75 |     err.status = 403
   76 |     throw err
   77 |   }
   78 | 
   79 |   const matchId = buildFriendMatchId(senderId, targetId)
   80 |   const entry = await postMessage(matchId, senderId, message, type)
   81 |   return { match_id: matchId, message: entry }
   82 | }
   83 | 
   84 | export async function listFriendMatchIdsForUser(userId) {
   85 |   const connections = await listFriendConnectionsForUser(userId)
   86 |   const ids = new Set(connections.map((row) => row.match_id).filter(Boolean))
   87 | 
   88 |   const messages = await readStore(FILE)
   89 |   messages
   90 |     .map((row) => row.match_id)
   91 |     .filter((matchId) => {
   92 |       const pair = parseFriendMatchId(matchId)
   93 |       return Array.isArray(pair) && pair.includes(userId)
   94 |     })
   95 |     .forEach((matchId) => ids.add(matchId))
   96 | 
   97 |   return [...ids]
   98 | }
   99 | 
  100 | function upsertRequestState(requests, threadId, updates = {}) {
  101 |   const existingIndex = requests.findIndex((request) => request.thread_id === threadId)
  102 |   const nextEntry = {
  103 |     thread_id: threadId,
  104 |     status: 'pending',
  105 |     acted_by: null,
  106 |     acted_at: null,
  107 |     ...updates,
  108 |   }
  109 | 
  110 |   if (existingIndex === -1) {
  111 |     requests.push(nextEntry)
  112 |     return nextEntry
  113 |   }
  114 | 
  115 |   requests[existingIndex] = {
  116 |     ...requests[existingIndex],
  117 |     ...updates,
  118 |   }
  119 |   return requests[existingIndex]
  120 | }
  121 | 
  122 | function requestIdFromMatchId(matchId = '') {
  123 |   return String(matchId).split(':')[0] || ''
  124 | }
  125 | 
  126 | async function enforceConversationLock(matchId, sender) {
  127 |   if (String(matchId || '').startsWith('friend:')) return null
  128 |   if (!sender) return null
  129 | 
  130 |   const requestId = requestIdFromMatchId(matchId)
  131 |   if (!requestId) return null
  132 | 
  133 |   const role = String(sender.role || '').toLowerCase()
  134 |   if (['owner', 'admin'].includes(role)) return null
  135 |   if (role !== 'agent') return null
  136 | 
  137 |   const requirement = await getRequirementById(requestId)
  138 |   if (requirement && String(requirement.buyer_id || '') === String(sender.id || '')) return null
  139 | 
  140 |   const locks = await readStore(CONVERSATION_LOCKS_FILE)
  141 |   const existing = locks.find((lock) => lock.request_id === requestId)
  142 |   const allowed = existing
  143 |     ? [...new Set([...(Array.isArray(existing.allowed_users) ? existing.allowed_users : []), ...(Array.isArray(existing.allowed_agents) ? existing.allowed_agents : [])])]
  144 |     : []
  145 | 
  146 |   if (!existing) {
  147 |     const row = {
  148 |       request_id: requestId,
  149 |       locked_by: sender.id,
  150 |       allowed_agents: [sender.id],
  151 |       allowed_users: [sender.id],
  152 |       lock_type: 'agent_claim',
  153 |       lock_status: 'claimed',
  154 |       lock_reason: 'agent_claim',
  155 |       created_at: new Date().toISOString(),
  156 |       updated_at: new Date().toISOString(),
  157 |     }
  158 |     locks.push(row)
  159 |     await writeJson(CONVERSATION_LOCKS_FILE, locks)
  160 |     return row
  161 |   }
  162 | 
  163 |   if (existing.lock_type !== 'agent_claim') return existing
  164 |   if (existing.locked_by === sender.id || allowed.includes(sender.id)) {
  165 |     return existing
  166 |   }
  167 | 
  168 |   const err = new Error('Conversation locked by another agent. Request access to proceed.')
  169 |   err.status = 403
  170 |   err.code = 'CONVERSATION_LOCKED'
  171 |   err.lock = existing
  172 |   throw err
  173 | }
  174 | 
  175 | function buildLockMeta(lock, usersById, currentUserId) {
  176 |   if (!lock) {
  177 |     return {
  178 |       status: 'unclaimed',
  179 |       can_request_access: true,
  180 |       claimed_by: null,
  181 |       claimed_by_name: '',
  182 |       lock_type: null,
  183 |       lock_reason: null,
  184 |     }
  185 |   }
  186 | 
  187 |   const claimedByName = usersById.get(lock.locked_by)?.name || lock.locked_by
  188 |   const isOwner = lock.locked_by === currentUserId
  189 |   const allowed = [
  190 |     ...(Array.isArray(lock.allowed_users) ? lock.allowed_users : []),
  191 |     ...(Array.isArray(lock.allowed_agents) ? lock.allowed_agents : []),
  192 |   ].map(String)
  193 |   const isGranted = allowed.includes(currentUserId)
  194 |   const lockType = lock.lock_type || null
  195 |   const lockReason = lock.lock_reason || null
  196 | 
  197 |   if (isOwner) {
  198 |     return {
  199 |       status: lock.lock_status || 'claimed',
  200 |       can_request_access: false,
  201 |       claimed_by: lock.locked_by,
  202 |       claimed_by_name: claimedByName,
  203 |       lock_type: lockType,
  204 |       lock_reason: lockReason,
  205 |     }
  206 |   }
  207 | 
  208 |   if (isGranted) {
  209 |     return {
  210 |       status: 'granted',
  211 |       can_request_access: false,
  212 |       claimed_by: lock.locked_by,
  213 |       claimed_by_name: claimedByName,
  214 |       lock_type: lockType,
  215 |       lock_reason: lockReason,
  216 |     }
  217 |   }
  218 | 
  219 |   return {
  220 |     status: lock.lock_status === 'locked' ? 'request_access' : 'request_access',
  221 |     can_request_access: true,
  222 |     claimed_by: lock.locked_by,
  223 |     claimed_by_name: claimedByName,
  224 |     lock_type: lockType,
  225 |     lock_reason: lockReason,
  226 |   }
  227 | }
  228 | 
  229 | function withConversationMeta(message, usersById, lock, currentUserId) {
  230 |   return {
  231 |     ...message,
  232 |     request_id: requestIdFromMatchId(message.match_id),
  233 |     conversation_lock: buildLockMeta(lock, usersById, currentUserId),
  234 |   }
  235 | }
  236 | 
  237 | function buildReadMap(reads = [], userId = '') {
  238 |   const normalized = String(userId || '')
  239 |   const map = new Map()
  240 |   ;(Array.isArray(reads) ? reads : []).forEach((row) => {
  241 |     if (String(row.user_id) !== normalized) return
  242 |     const matchId = String(row.match_id || '')
  243 |     if (!matchId) return
  244 |     map.set(matchId, row)
  245 |   })
  246 |   return map
  247 | }
  248 | 
  249 | function countUnread(messages = [], userId = '', lastReadAt = null) {
  250 |   const cutoff = lastReadAt ? new Date(lastReadAt).getTime() : 0
  251 |   let count = 0
  252 |   for (const msg of messages) {
  253 |     if (String(msg.sender_id || '') === String(userId || '')) continue
  254 |     const ts = new Date(msg.timestamp || 0).getTime()
  255 |     if (!Number.isFinite(ts)) continue
  256 |     if (!cutoff || ts > cutoff) count += 1
  257 |   }
  258 |   return count
  259 | }
  260 | 
  261 | function applyFriendThreadMeta(message, fallbackFriend, currentUserId) {
  262 |   if (!fallbackFriend) return message
  263 | 
  264 |   const direction = fallbackFriend.requester_id === currentUserId ? 'outgoing' : 'incoming'
  265 |   return {
  266 |     ...message,
  267 |     friend_request_status: fallbackFriend.type === 'friend_request' ? String(fallbackFriend.status || 'pending') : 'accepted',
  268 |     friend_request_direction: fallbackFriend.type === 'friend_request' ? direction : 'accepted',
  269 |   }
  270 | }
  271 | 
  272 | export async function postMessage(matchId, senderId, message, type = 'text', attachment = null, options = {}) {
  273 |   const messages = await readStore(FILE)
  274 |   const users = await readStore(USERS_FILE)
  275 |   const usersById = buildUsersById(users)
  276 |   const messageRequests = await readStore(MESSAGE_REQUESTS_FILE)
  277 |   const safeAttachment = attachment ? {
  278 |     name: sanitizeString(attachment?.name, 220),
  279 |     url: sanitizeString(attachment?.url, 600),
  280 |     mime_type: sanitizeString(attachment?.mime_type, 120),
  281 |     size: Number(attachment?.size || 0),
  282 |   } : null
  283 | 
  284 |   const entry = {
  285 |     id: crypto.randomUUID(),
  286 |     match_id: matchId,
  287 |     sender_id: senderId,
  288 |     message: '',
  289 |     timestamp: new Date().toISOString(),
  290 |     type,
  291 |     attachment: safeAttachment && safeAttachment.url ? safeAttachment : null,
  292 |     policy_status: 'delivered',
  293 |     policy_reason: 'policy_allow',
  294 |     policy_priority: null,
  295 |     retry_after_seconds: 0,
  296 |     requires_human_review: false,
  297 |     queue_id: null,
  298 |   }
  299 | 
  300 |   const sender = users.find((u) => u.id === senderId)
  301 |   // Enforce per-org AI auto-reply settings for messages originating from AI flows
  302 |   const sourceLabel = String(options?.source_label || '')
  303 |   if (sourceLabel.startsWith('ai:')) {
  304 |     const orgOwnerId = await resolveOrgOwnerFromMatch(matchId, senderId) || ''
  305 |     if (orgOwnerId) {
  306 |       const orgSettings = await getOrgAiSettings(orgOwnerId)
  307 |       if (!orgSettings.auto_reply_enabled) {
  308 |         const err = new Error('Auto-reply disabled by organization settings.')
  309 |         err.status = 403
  310 |         err.code = 'AI_AUTO_REPLY_DISABLED'
  311 |         throw err
  312 |       }
  313 | 
  314 |       const cutoff = Date.now() - (60 * 60 * 1000)
  315 |       const recent = (Array.isArray(messages) ? messages : []).filter((m) => String(m.sender_id || '') === String(senderId) && new Date(m.timestamp || 0).getTime() >= cutoff)
  316 |       if (recent.length >= Number(orgSettings.auto_reply_rate_limit_per_hour || 20)) {
  317 |         const err = new Error('Auto-reply rate limit exceeded for this organization.')
  318 |         err.status = 429
  319 |         err.code = 'AI_AUTO_REPLY_RATE_LIMIT'
  320 |         throw err
  321 |       }
  322 |     }
  323 |   }
  324 | 
  325 |   assertMessagingAllowed(sender)
  326 | 
  327 |   if (!String(matchId || '').startsWith('friend:')) {
  328 |     const requestId = requestIdFromMatchId(matchId)
  329 |     if (requestId) {
  330 |       const requirement = await getRequirementById(requestId)
  331 |       if (requirement?.verified_only) {
  332 |         const role = String(sender?.role || '').toLowerCase()
  333 |         const isBuyer = String(requirement?.buyer_id || '') === String(sender?.id || '')
  334 |         const isAdmin = ['owner', 'admin'].includes(role)
  335 |         let isVerifiedSupplier = Boolean(sender?.verified)
  336 |         if (!isVerifiedSupplier && role === 'agent' && sender?.org_owner_id) {
  337 |           const owner = usersById.get(String(sender.org_owner_id)) || null
  338 |           isVerifiedSupplier = Boolean(owner?.verified)
  339 |         }
  340 |         if (!isBuyer && !isAdmin && !isVerifiedSupplier) {
  341 |           const err = new Error('Verified-only: This buyer accepts messages only from verified suppliers. Verify your account to unlock direct access.')
  342 |           err.status = 403
  343 |           err.code = 'VERIFIED_ONLY'
  344 |           throw err
  345 |         }
  346 |       }
  347 |     }
  348 |   }
  349 | 
  350 |   await enforceConversationLock(matchId, sender)
  351 | 
  352 |   const policyResult = await evaluateMessagePolicy({
  353 |     sender,
  354 |     matchId,
  355 |     text: sanitizeString(message, 2000),
  356 |     type,
  357 |     orgId: sender?.org_owner_id || sender?.id || '',
  358 |   })
  359 | 
  360 |   if (policyResult.action === 'soft_block' || policyResult.action === 'hard_block') {
  361 |     const err = new Error(policyResult.rejection_message || 'Message rejected by communication policy')
  362 |     err.status = 429
  363 |     err.code = policyResult.action === 'hard_block' ? 'POLICY_HARD_BLOCK' : 'POLICY_SOFT_BLOCK'
  364 |     err.policy = policyResult
  365 |     throw err
  366 |   }
  367 | 
  368 |   if (policyResult.action === 'queue') {
  369 |     entry.policy_status = 'queued'
  370 |     entry.policy_reason = policyResult.reason
  371 |     entry.policy_priority = policyResult?.decision?.queue_priority_label || null
  372 |     entry.retry_after_seconds = Number(policyResult.retry_after_seconds || 0)
  373 |     entry.queue_id = policyResult?.queue?.id || null
  374 |   }
  375 | 
  376 | 
  377 |   const recentContext = messages
  378 |     .filter((m) => String(m.match_id || '') === String(matchId || ''))
  379 |     .slice(-5)
  380 |     .map((m) => m?.message || '')
  381 | 
  382 |   const moderation = await moderateTextOrRedactWithContext({
  383 |     actor: sender,
  384 |     text: sanitizeString(message, 2000),
  385 |     context_texts: recentContext,
  386 |     entity_type: 'message',
  387 |     entity_id: matchId,
  388 |   })
  389 | 
  390 |   entry.message = moderation.text
  391 |   entry.moderated = Boolean(moderation.moderated)
  392 |   entry.moderation_reason = moderation.reason || ''
  393 |   messages.push(entry)
  394 | 
  395 |   if (entry.queue_id) {
  396 |     await attachMessageToQueue(entry.queue_id, entry.id)
  397 |   }
  398 | 
  399 |   if (!sender?.verified) {
  400 |     upsertRequestState(messageRequests, matchId, { status: 'pending', acted_by: null, acted_at: null })
  401 |   }
  402 | 
  403 |   await writeJson(FILE, messages)
  404 |   await writeJson(MESSAGE_REQUESTS_FILE, messageRequests)
  405 | 
  406 |   // CRM (project.md): Every inquiry/message becomes a lead for Buying House / Factory org accounts.
  407 |   // Best-effort: never block the message if lead upsert fails.
  408 |   try {
  409 |     await upsertLeadFromMessage({
  410 |       match_id: matchId,
  411 |       sender_id: senderId,
  412 |       timestamp: entry.timestamp,
  413 |       source_type: options?.source_type,
  414 |       source_id: options?.source_id,
  415 |       source_label: options?.source_label,
  416 |     })
  417 |   } catch {
  418 |     void 0
  419 |   }
  420 | 
  421 |   await trackTransition(matchId, 'matched', 'first_message_sent', { sender_id: senderId })
  422 | 
  423 |   await recordWorkflowEvent('chat_message_sent', { match_id: matchId, chat_thread_id: matchId }, { sender_id: senderId }).catch(() => null)
  424 | 
  425 |   try {
  426 |     const orgOwnerId = await resolveOrgOwnerFromMatch(matchId, senderId)
  427 |     if (orgOwnerId) {
  428 |       autoSummarizeMatch({ matchId, orgOwnerId }).catch(() => {})
  429 |     }
  430 |   } catch {
  431 |     void 0
  432 |   }
  433 | 
  434 |   return enrichMessage(entry, usersById)
  435 | }
  436 | 
  437 | export async function listMessagesByMatch(matchId) {
  438 |   const messages = await readStore(FILE)
  439 |   const users = await readStore(USERS_FILE)
  440 |   const usersById = buildUsersById(users)
  441 |   return messages
  442 |     .filter((m) => m.match_id === matchId)
  443 |     .map((message) => enrichMessage(message, usersById))
  444 | }
  445 | 
  446 | export async function tieredInbox(matchIds, currentUserId) {
  447 |   const users = await readStore(USERS_FILE)
  448 |   const usersById = buildUsersById(users)
  449 |   const messages = await readStore(FILE)
  450 |   const messageRequests = await readStore(MESSAGE_REQUESTS_FILE)
  451 |   const conversationLocks = await readStore(CONVERSATION_LOCKS_FILE)
  452 |   const messageReads = await readStore(MESSAGE_READS_FILE)
  453 |   const lockByRequestId = new Map(conversationLocks.map((lock) => [lock.request_id, lock]))
  454 |   const readByMatch = buildReadMap(messageReads, currentUserId)
  455 | 
  456 |   const filtered = messages
  457 |     .filter((m) => matchIds.includes(m.match_id))
  458 |     .map((message) => enrichMessage(message, usersById))
  459 |   const requestMap = new Map(messageRequests.map((request) => [request.thread_id, request]))
  460 |   const messagesByMatchId = new Map()
  461 |   for (const message of filtered) {
  462 |     if (!messagesByMatchId.has(message.match_id)) messagesByMatchId.set(message.match_id, [])
  463 |     messagesByMatchId.get(message.match_id).push(message)
  464 |   }
  465 |   const latestByThread = new Map()
  466 |   const friendConnections = await listFriendConnectionsForUser(currentUserId)
  467 |   const friendConnectionByMatchId = new Map(friendConnections.map((row) => [row.match_id, row]))
  468 | 
  469 |   for (const message of filtered) {
  470 |     const existing = latestByThread.get(message.match_id)
  471 |     if (!existing || new Date(message.timestamp || 0).getTime() > new Date(existing.timestamp || 0).getTime()) {
  472 |       latestByThread.set(message.match_id, message)
  473 |     }
  474 |   }
  475 | 
  476 |   const priority = []
  477 |   const requestPool = []
  478 |   for (const matchId of matchIds) {
  479 |     const fallbackFriend = friendConnectionByMatchId.get(matchId)
  480 |     const m = latestByThread.get(matchId) || (fallbackFriend ? enrichMessage({
  481 |       id: `friend-thread-${matchId}` ,
  482 |       match_id: matchId,
  483 |       sender_id: fallbackFriend.other_user_id,
  484 |       message: fallbackFriend.type === 'friend_request'
  485 |         ? (fallbackFriend.requester_id === currentUserId ? 'Friend request sent. Start chatting after acceptance.' : 'Incoming friend request. Accept to start chatting.')
  486 |         : 'You are now friends. Say hello!',
  487 |       timestamp: fallbackFriend.updated_at || fallbackFriend.created_at || new Date().toISOString(),
  488 |       type: 'system',
  489 |       attachment: null,
  490 |     }, usersById) : null)
  491 |     if (!m) continue
  492 | 
  493 |     const request = requestMap.get(m.match_id)
  494 |     if (request?.status === 'rejected') continue
  495 | 
  496 |     const sender = usersById.get(m.sender_id)
  497 |     const requestId = requestIdFromMatchId(m.match_id)
  498 |     const lock = lockByRequestId.get(requestId)
  499 |     const readRow = readByMatch.get(m.match_id)
  500 |     const lastReadAt = readRow?.last_read_at || null
  501 |     const unreadCount = countUnread(messagesByMatchId.get(m.match_id) || [], currentUserId, lastReadAt)
  502 |     const withMeta = applyFriendThreadMeta({
  503 |       ...withConversationMeta(m, usersById, lock, currentUserId),
  504 |       unread_count: unreadCount,
  505 |       last_read_at: lastReadAt,
  506 |     }, fallbackFriend, currentUserId)
  507 | 
  508 |     const isPendingFriend = fallbackFriend?.type === 'friend_request' && fallbackFriend?.status === 'pending'
  509 | 
  510 |     if (isPendingFriend) {
  511 |       requestPool.push(withMeta)
  512 |       continue
  513 |     }
  514 | 
  515 |     if (request?.status === 'accepted' || sender?.verified || fallbackFriend?.type === 'friend') priority.push(withMeta)
  516 |     else requestPool.push(withMeta)
  517 |   }
  518 |   return { priority, request_pool: requestPool }
  519 | }
  520 | 
  521 | export async function markThreadRead(matchId, userId) {
  522 |   const safeMatchId = sanitizeString(String(matchId || ''), 200)
  523 |   if (!safeMatchId) {
  524 |     const err = new Error('matchId is required')
  525 |     err.status = 400
  526 |     throw err
  527 |   }
  528 | 
  529 |   const rows = await readStore(MESSAGE_READS_FILE)
  530 |   const nextRows = Array.isArray(rows) ? rows : []
  531 |   const now = new Date().toISOString()
  532 |   const idx = nextRows.findIndex((row) => String(row.match_id) === safeMatchId && String(row.user_id) === String(userId))
  533 | 
  534 |   if (idx >= 0) {
  535 |     nextRows[idx] = { ...nextRows[idx], last_read_at: now, updated_at: now }
  536 |   } else {
  537 |     nextRows.push({
  538 |       id: crypto.randomUUID(),
  539 |       match_id: safeMatchId,
  540 |       user_id: String(userId),
  541 |       last_read_at: now,
  542 |       updated_at: now,
  543 |     })
  544 |   }
  545 | 
  546 |   await writeJson(MESSAGE_READS_FILE, nextRows)
  547 |   return { match_id: safeMatchId, user_id: String(userId), last_read_at: now }
  548 | }
  549 | 
  550 | async function updateRequestStatus(threadId, status, actedBy) {
  551 |   const messageRequests = await readStore(MESSAGE_REQUESTS_FILE)
  552 |   const actedAt = new Date().toISOString()
  553 |   const request = upsertRequestState(messageRequests, threadId, {
  554 |     status,
  555 |     acted_by: actedBy,
  556 |     acted_at: actedAt,
  557 |   })
  558 |   await writeJson(MESSAGE_REQUESTS_FILE, messageRequests)
  559 |   return request
  560 | }
  561 | 
  562 | export async function acceptMessageRequest(threadId, actedBy) {
  563 |   return updateRequestStatus(threadId, 'accepted', actedBy)
  564 | }
  565 | 
  566 | export async function rejectMessageRequest(threadId, actedBy) {
  567 |   return updateRequestStatus(threadId, 'rejected', actedBy)
  568 | }
  569 | 