    1 | import './utils/dotenv.js'
    2 | import express from 'express'
    3 | import cors from 'cors'
    4 | import path from 'path'
    5 | import fs from 'fs'
    6 | import http from 'http'
    7 | import { WebSocketServer } from 'ws'
    8 | import authRoutes from './routes/authRoutes.js'
    9 | import userRoutes from './routes/userRoutes.js'
   10 | import requirementRoutes from './routes/requirementRoutes.js'
   11 | import documentRoutes from './routes/documentRoutes.js'
   12 | import adminRoutes from './routes/adminRoutes.js'
   13 | import systemRoutes from './routes/systemRoutes.js'
   14 | import notificationRoutes from './routes/notificationRoutes.js'
   15 | import socialRoutes from './routes/socialRoutes.js'
   16 | import searchRoutes from './routes/searchRoutes.js'
   17 | import presetsRoutes from './routes/presetsRoutes.js'
   18 | import verificationRoutes from './routes/verificationRoutes.js'
   19 | import subscriptionRoutes from './routes/subscriptionRoutes.js'
   20 | import feedRoutes from './routes/feedRoutes.js'
   21 | import productRoutes from './routes/productRoutes.js'
   22 | import onboardingRoutes from './routes/onboardingRoutes.js'
   23 | import assistantRoutes from './routes/assistantRoutes.js'
   24 | import conversationRoutes from './routes/conversationRoutes.js'
   25 | import analyticsRoutes from './routes/analyticsRoutes.js'
   26 | import eventRoutes from './routes/eventRoutes.js'
   27 | import messageRoutes from './routes/messageRoutes.js'
   28 | import partnerNetworkRoutes from './routes/partnerNetworkRoutes.js'
   29 | import agentSubIdRoutes from './routes/agentSubIdRoutes.js'
   30 | import callSessionRoutes from './routes/callSessionRoutes.js'
   31 | import leadRoutes from './routes/leadRoutes.js'
   32 | import memberRoutes from './routes/memberRoutes.js'
   33 | import orgRoutes from './routes/orgRoutes.js'
   34 | import ratingsRoutes from './routes/ratingsRoutes.js'
   35 | import presenceRoutes from './routes/presenceRoutes.js'
   36 | import profileRoutes from './routes/profileRoutes.js'
   37 | import chatbotRoutes from './routes/chatbotRoutes.js'
   38 | import walletRoutes from './routes/walletRoutes.js'
   39 | import boostRoutes from './routes/boostRoutes.js'
   40 | import geoRoutes from './routes/geoRoutes.js'
   41 | import industryRoutes from './routes/industryRoutes.js'
   42 | import paymentProofRoutes from './routes/paymentProofRoutes.js'
   43 | import couponRoutes from './routes/couponRoutes.js'
   44 | import supportRoutes from './routes/supportRoutes.js'
   45 | import reportRoutes from './routes/reportRoutes.js'
   46 | import infraRoutes from './routes/infraRoutes.js'
   47 | import networkRoutes from './routes/networkRoutes.js'
   48 | import certificationRoutes from './routes/certificationRoutes.js'
   49 | import crmRoutes from './routes/crmRoutes.js'
   50 | import aiRoutes from './routes/aiRoutes.js'
   51 | import exportRoutes from './routes/exportRoutes.js'
   52 | import devRoutes from './routes/devRoutes.js'
   53 | import { startEsignWebhookRetryWorker } from './services/esignRetryService.js'
   54 | import dealJourneyRoutes from './routes/dealJourneyRoutes.js'
   55 | import workflowLifecycleRoutes from './routes/workflowLifecycleRoutes.js'
   56 | import { requestLogger } from './middleware/requestLogger.js'
   57 | import { errorHandler } from './middleware/errorHandler.js'
   58 | import { logInfo, logError } from './utils/logger.js'
   59 | import { assistantReply } from './services/assistantService.js'
   60 | import { maybeGenerateBotReply } from './services/chatbotService.js'
   61 | import jwt from 'jsonwebtoken'
   62 | import { canAccessMatch, listMessagesByMatch, postMessage } from './services/messageService.js'
   63 | import { getCallSession } from './services/callSessionService.js'
   64 | import { recordWorkflowEvent } from './services/workflowLifecycleService.js'
   65 | import { setUserOnline, setUserOffline, touchUser } from './services/presenceService.js'
   66 | import { readJson } from './utils/jsonStore.js'
   67 | import { consumePendingInvites, enqueuePendingInvites } from './utils/pendingInvites.js'
   68 | import { ensureDatabaseConnection, closeDatabaseConnection } from './utils/db.js'
   69 | import { revokeExpiredVerifications } from './services/verificationService.js'
   70 | import { enforcePartnerFreeTierLimits } from './services/partnerNetworkService.js'
   71 | import { runLeadReminderSweep } from './services/leadReminderService.js'
   72 | import { getFxHealth, refreshRates } from './services/currencyService.js'
   73 | import { startEventQualityReporter } from './services/eventIngestionService.js'
   74 | 
   75 | const app = express()
   76 | const PORT = process.env.PORT || 4000
   77 | 
   78 | const FX_REFRESH_INTERVAL_MS = 60 * 60 * 1000
   79 | refreshRates().catch(() => null)
   80 | setInterval(() => {
   81 |   refreshRates().catch(() => null)
   82 | }, FX_REFRESH_INTERVAL_MS).unref()
   83 | 
   84 | startEventQualityReporter()
   85 | 
   86 | app.use(cors())
   87 | app.use(express.json({ limit: '5mb' }))
   88 | 
   89 | const uploadsRoot = path.join(process.cwd(), 'server', 'uploads')
   90 | const chatUploadsRoot = path.join(uploadsRoot, 'chat')
   91 | if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true })
   92 | if (!fs.existsSync(chatUploadsRoot)) fs.mkdirSync(chatUploadsRoot, { recursive: true })
   93 | 
   94 | app.use('/uploads', express.static(uploadsRoot))
   95 | 
   96 | const distRoot = path.join(process.cwd(), 'dist')
   97 | const serveDist = process.env.SERVE_DIST === 'true'
   98 | if (serveDist && fs.existsSync(distRoot)) {
   99 |   app.use(express.static(distRoot))
  100 | }
  101 | 
  102 | app.use('/api', requestLogger({ timeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 45000) }))
  103 | 
  104 | app.get('/api/health', (req, res) => {
  105 |   res.json({
  106 |     ok: true,
  107 |     service: 'textile-trust-verification-mvp',
  108 |     fx: getFxHealth(),
  109 |   })
  110 | })
  111 | app.use('/api/auth', authRoutes)
  112 | app.use('/api/users', userRoutes)
  113 | app.use('/api/requirements', requirementRoutes)
  114 | app.use('/api/documents', documentRoutes)
  115 | app.use('/api/verification', verificationRoutes)
  116 | app.use('/api/subscriptions', subscriptionRoutes)
  117 | app.use('/api/admin', adminRoutes)
  118 | app.use('/api/feed', feedRoutes)
  119 | app.use('/api/products', productRoutes)
  120 | app.use('/api/onboarding', onboardingRoutes)
  121 | app.use('/api/assistant', assistantRoutes)
  122 | app.use('/api/conversations', conversationRoutes)
  123 | app.use('/api/messages', messageRoutes)
  124 | app.use('/api/analytics', analyticsRoutes)
  125 | app.use('/api/events', eventRoutes)
  126 | app.use('/api/leads', leadRoutes)
  127 | app.use('/api/system', systemRoutes)
  128 | app.use('/api/notifications', notificationRoutes)
  129 | app.use('/api/social', socialRoutes)
  130 | app.use('/api/search', searchRoutes)
  131 | app.use('/api/presets', presetsRoutes)
  132 | app.use('/api/partners', partnerNetworkRoutes)
  133 | app.use('/api/agents/subids', agentSubIdRoutes)
  134 | app.use('/api/calls', callSessionRoutes)
  135 | app.use('/api/org', orgRoutes)
  136 | app.use('/api/members', memberRoutes)
  137 | app.use('/api/ratings', ratingsRoutes)
  138 | app.use('/api/presence', presenceRoutes)
  139 | app.use('/api/profiles', profileRoutes)
  140 | app.use('/api/chatbot', chatbotRoutes)
  141 | app.use('/api/wallet', walletRoutes)
  142 | app.use('/api/boosts', boostRoutes)
  143 | app.use('/api/geo', geoRoutes)
  144 | app.use('/api/industry', industryRoutes)
  145 | app.use('/api/payment-proofs', paymentProofRoutes)
  146 | app.use('/api/coupons', couponRoutes)
  147 | app.use('/api/support', supportRoutes)
  148 | app.use('/api/reports', reportRoutes)
  149 | app.use('/api/certifications', certificationRoutes)
  150 | app.use('/api/crm', crmRoutes)
  151 | app.use('/api/ai', aiRoutes)
  152 | app.use('/api/deal-journeys', dealJourneyRoutes)
  153 | app.use('/api/workflow', workflowLifecycleRoutes)
  154 | app.use('/api/infra', infraRoutes)
  155 | app.use('/api/network', networkRoutes)
  156 | app.use('/api/exports', exportRoutes)
  157 | app.use('/api/dev', devRoutes)
  158 | app.use(errorHandler)
  159 | 
  160 | if (serveDist && fs.existsSync(distRoot)) {
  161 |   app.get(/.*/, (req, res) => {
  162 |     res.sendFile(path.join(distRoot, 'index.html'))
  163 |   })
  164 | }
  165 | 
  166 | const server = http.createServer(app)
  167 | const wsServer = new WebSocketServer({ server })
  168 | const recentGreetingByIp = new Map()
  169 | const callRooms = new Map()
  170 | const chatRooms = new Map()
  171 | const socketsByUserId = new Map()
  172 | const JWT_SECRET = process.env.JWT_SECRET || 'mvp-dev-secret'
  173 | const JWT_ISSUER = process.env.JWT_ISSUER || 'gartexhub-api'
  174 | const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'gartexhub-client'
  175 | 
  176 | function sendWs(socket, payload) {
  177 |   if (socket.readyState !== 1) return
  178 |   socket.send(JSON.stringify(payload))
  179 | }
  180 | 
  181 | function registerSocketUser(socket, userId) {
  182 |   if (!userId) return
  183 |   if (!socketsByUserId.has(userId)) socketsByUserId.set(userId, new Set())
  184 |   socketsByUserId.get(userId).add(socket)
  185 | }
  186 | 
  187 | function unregisterSocketUser(socket, userId) {
  188 |   if (!userId) return
  189 |   const set = socketsByUserId.get(userId)
  190 |   if (!set) return
  191 |   set.delete(socket)
  192 |   if (set.size === 0) socketsByUserId.delete(userId)
  193 | }
  194 | 
  195 | function broadcastToUsers(userIds = [], payload) {
  196 |   const undelivered = []
  197 |   userIds.forEach((userId) => {
  198 |     const sockets = socketsByUserId.get(userId)
  199 |     if (!sockets || sockets.size === 0) {
  200 |       undelivered.push(userId)
  201 |       return
  202 |     }
  203 |     sockets.forEach((sock) => sendWs(sock, payload))
  204 |   })
  205 |   return undelivered
  206 | }
  207 | 
  208 | function leaveCallRoom(socket) {
  209 |   const callId = socket.callRoomId
  210 |   if (!callId) return
  211 | 
  212 |   const room = callRooms.get(callId)
  213 |   if (!room) {
  214 |     socket.callRoomId = null
  215 |     return
  216 |   }
  217 | 
  218 |   room.delete(socket)
  219 |   for (const peer of room) {
  220 |     sendWs(peer, {
  221 |       type: 'participant_left',
  222 |       call_id: callId,
  223 |       participant_id: socket.participantId || null,
  224 |     })
  225 |   }
  226 | 
  227 |   if (room.size === 0) callRooms.delete(callId)
  228 |   socket.callRoomId = null
  229 | }
  230 | 
  231 | function leaveChatRoom(socket) {
  232 |   const matchId = socket.chatRoomId
  233 |   if (!matchId) return
  234 | 
  235 |   const room = chatRooms.get(matchId)
  236 |   if (!room) {
  237 |     socket.chatRoomId = null
  238 |     return
  239 |   }
  240 | 
  241 |   room.delete(socket)
  242 | 
  243 |   for (const peer of room) {
  244 |     sendWs(peer, {
  245 |       type: 'chat_participant_left',
  246 |       match_id: matchId,
  247 |       participant_id: socket.userId || null,
  248 |     })
  249 |   }
  250 | 
  251 |   if (room.size === 0) chatRooms.delete(matchId)
  252 |   socket.chatRoomId = null
  253 | 
  254 |   if (socket.userId) setUserOffline(socket.userId)
  255 |   if (socket.userId) unregisterSocketUser(socket, socket.userId)
  256 | }
  257 | 
  258 | 
  259 | function parseSocketUser(token) {
  260 |   if (!token) return null
  261 |   try {
  262 |     return jwt.verify(String(token), JWT_SECRET, {
  263 |       issuer: JWT_ISSUER,
  264 |       audience: JWT_AUDIENCE,
  265 |     })
  266 |   } catch {
  267 |     return null
  268 |   }
  269 | }
  270 | 
  271 | async function joinChatRoom(socket, payload) {
  272 |   const matchId = String(payload?.match_id || '').trim()
  273 |   const user = parseSocketUser(payload?.token)
  274 | 
  275 |   if (!matchId) {
  276 |     sendWs(socket, { type: 'chat_error', error: 'match_id is required to join chat room' })
  277 |     return
  278 |   }
  279 | 
  280 |   if (!user?.id) {
  281 |     sendWs(socket, { type: 'chat_error', error: 'Valid token is required to join chat room' })
  282 |     return
  283 |   }
  284 | 
  285 |   const canJoin = await canAccessMatch(matchId, user.id)
  286 |   if (!canJoin) {
  287 |     sendWs(socket, { type: 'chat_error', error: 'Forbidden: thread access denied' })
  288 |     return
  289 |   }
  290 | 
  291 |   leaveChatRoom(socket)
  292 | 
  293 |   if (!chatRooms.has(matchId)) {
  294 |     chatRooms.set(matchId, new Set())
  295 |   }
  296 | 
  297 |   socket.userId = user.id
  298 |   registerSocketUser(socket, user.id)
  299 |   setUserOnline(user.id)
  300 |   const canSend = await canAccessMatch(matchId, socket.userId)
  301 |   if (!canSend) {
  302 |     sendWs(socket, { type: 'chat_error', error: 'Forbidden: thread access denied' })
  303 |     return
  304 |   }
  305 | 
  306 |   const room = chatRooms.get(matchId)
  307 |   const participants = [...room].map((participantSocket) => participantSocket.userId).filter(Boolean)
  308 |   room.add(socket)
  309 |   socket.chatRoomId = matchId
  310 |   touchUser(user.id)
  311 |   await recordWorkflowEvent('chat_started', {
  312 |     match_id: matchId,
  313 |     requirement_id: payload?.requirement_id,
  314 |     product_id: payload?.product_id,
  315 |   }, { actor_id: user.id, source: 'ws.join_chat_room' }).catch(() => null)
  316 | 
  317 |   const history = await listMessagesByMatch(matchId)
  318 |   sendWs(socket, {
  319 |     type: 'joined_chat_room',
  320 |     match_id: matchId,
  321 |     participant_id: user.id,
  322 |     participants,
  323 |     messages: history,
  324 |   })
  325 | 
  326 |   for (const peer of room) {
  327 |     if (peer === socket) continue
  328 |     sendWs(peer, {
  329 |       type: 'chat_participant_joined',
  330 |       match_id: matchId,
  331 |       participant_id: user.id,
  332 |     })
  333 |   }
  334 | }
  335 | 
  336 | async function relayChatMessage(socket, payload) {
  337 |   const matchId = socket.chatRoomId
  338 |   if (!matchId || !socket.userId) {
  339 |     sendWs(socket, { type: 'chat_error', error: 'Join a chat room before sending messages' })
  340 |     return
  341 |   }
  342 | 
  343 |   const canSend = await canAccessMatch(matchId, socket.userId)
  344 |   if (!canSend) {
  345 |     sendWs(socket, { type: 'chat_error', error: 'Forbidden: thread access denied' })
  346 |     return
  347 |   }
  348 | 
  349 |   const room = chatRooms.get(matchId)
  350 |   if (!room) return
  351 | 
  352 |   const messageText = String(payload?.message || '').trim()
  353 |   if (!messageText) return
  354 | 
  355 |   try {
  356 |     const created = await postMessage(matchId, socket.userId, messageText, payload?.message_type || 'text', null, {
  357 |       source_type: payload?.source_type,
  358 |       source_id: payload?.source_id,
  359 |       source_label: payload?.source_label,
  360 |     })
  361 | 
  362 |     const policyStatus = String(created?.policy_status || 'delivered')
  363 |     const shouldBroadcast = policyStatus === 'delivered'
  364 |     const peers = shouldBroadcast ? [...room] : [socket]
  365 |     for (const peer of peers) {
  366 |       sendWs(peer, {
  367 |         type: 'chat_message',
  368 |         match_id: matchId,
  369 |         message: created,
  370 |       })
  371 |     }
  372 | 
  373 |     if (!shouldBroadcast) {
  374 |       sendWs(socket, {
  375 |         type: 'chat_policy_status',
  376 |         match_id: matchId,
  377 |         status: policyStatus,
  378 |         reason: created?.policy_reason || null,
  379 |         queue_rank: created?.policy_priority || null,
  380 |         retry_after_seconds: Number(created?.retry_after_seconds || 0),
  381 |       })
  382 |     }
  383 | 
  384 |     await recordWorkflowEvent('chat_message_sent', {
  385 |       match_id: matchId,
  386 |     }, { actor_id: socket.userId, source: 'ws.chat_message' }).catch(() => null)
  387 | 
  388 |     try {
  389 |       const botResult = await maybeGenerateBotReply({ match_id: matchId, sender_id: socket.userId, message: messageText })
  390 |       if (botResult?.reply) {
  391 |         for (const peer of room) {
  392 |           sendWs(peer, {
  393 |             type: 'chat_message',
  394 |             match_id: matchId,
  395 |             message: botResult.reply,
  396 |           })
  397 |         }
  398 |       }
  399 |     } catch {
  400 |       // silent
  401 |     }
  402 |   } catch (error) {
  403 |     logError('chat_message_failed', error)
  404 |     const policyReason = error?.policy?.reason || null
  405 |     const retryAfter = Number(error?.policy?.retry_after_seconds || 0)
  406 |     sendWs(socket, {
  407 |       type: 'chat_error',
  408 |       error: error?.message || 'Unable to send message',
  409 |       reason: policyReason,
  410 |       retry_after_seconds: retryAfter,
  411 |     })
  412 |   }
  413 | }
  414 | 
  415 | async function joinCallRoom(socket, payload) {
  416 |   const callId = String(payload?.call_id || '').trim()
  417 |   const tokenUser = parseSocketUser(payload?.token)
  418 |   const participantId = String(payload?.participant_id || '').trim() || tokenUser?.id || `anon-${Date.now()}`
  419 |   if (!callId) {
  420 |     sendWs(socket, { type: 'call_error', error: 'call_id is required to join room' })
  421 |     return
  422 |   }
  423 | 
  424 |   if (!tokenUser?.id) {
  425 |     sendWs(socket, { type: 'call_error', error: 'Valid token is required to join call room' })
  426 |     return
  427 |   }
  428 | 
  429 |   const call = await getCallSession(callId, tokenUser.id)
  430 |   if (!call || call === 'forbidden') {
  431 |     sendWs(socket, { type: 'call_error', error: 'Forbidden: call access denied' })
  432 |     return
  433 |   }
  434 | 
  435 |   leaveCallRoom(socket)
  436 | 
  437 |   if (!callRooms.has(callId)) {
  438 |     callRooms.set(callId, new Set())
  439 |   }
  440 | 
  441 |   const room = callRooms.get(callId)
  442 |   const existingParticipants = [...room].map((s) => s.participantId).filter(Boolean)
  443 |   room.add(socket)
  444 |   socket.callRoomId = callId
  445 |   socket.participantId = participantId
  446 |   socket.userId = tokenUser.id
  447 |   registerSocketUser(socket, tokenUser.id)
  448 | 
  449 |   sendWs(socket, {
  450 |     type: 'joined_call_room',
  451 |     call_id: callId,
  452 |     participant_id: participantId,
  453 |     participants: existingParticipants,
  454 |     should_offer: existingParticipants.length > 0,
  455 |   })
  456 | 
  457 |   for (const peer of room) {
  458 |     if (peer === socket) continue
  459 |     sendWs(peer, {
  460 |       type: 'participant_joined',
  461 |       call_id: callId,
  462 |       participant_id: participantId,
  463 |     })
  464 |   }
  465 | }
  466 | 
  467 | function relaySignal(socket, payload) {
  468 |   const callId = socket.callRoomId
  469 |   if (!callId) return
  470 |   const room = callRooms.get(callId)
  471 |   if (!room) return
  472 | 
  473 |   const signalType = String(payload?.signal?.type || '')
  474 |   if (signalType && signalType !== 'candidate') {
  475 |     logInfo('webrtc_signal', {
  476 |       call_id: callId,
  477 |       from_user_id: socket.userId || null,
  478 |       from_participant_id: socket.participantId || null,
  479 |       signal_type: signalType,
  480 |     })
  481 |   }
  482 | 
  483 |   for (const peer of room) {
  484 |     if (peer === socket) continue
  485 |     sendWs(peer, {
  486 |       type: 'webrtc_signal',
  487 |       call_id: callId,
  488 |       from: socket.participantId || null,
  489 |       signal: payload?.signal || null,
  490 |     })
  491 |   }
  492 | }
  493 | 
  494 | wsServer.on('connection', (socket, req) => {
  495 |   logInfo('Assistant WebSocket connected')
  496 |   let lastQuestion = ''
  497 |   let lastQuestionAt = 0
  498 | 
  499 |   function sendReply(payload) {
  500 |     const answer = payload?.matched_answer || payload?.answer || payload?.message || ''
  501 |     sendWs(socket, {
  502 |       ...payload,
  503 |       matched_answer: answer,
  504 |       answer,
  505 |       message: answer,
  506 |     })
  507 |   }
  508 | 
  509 |   const clientIp = req?.socket?.remoteAddress || 'unknown'
  510 |   const now = Date.now()
  511 |   const lastGreetingAt = Number(recentGreetingByIp.get(clientIp) || 0)
  512 |   if (now - lastGreetingAt > 5_000) {
  513 |     recentGreetingByIp.set(clientIp, now)
  514 |     sendReply({
  515 |       type: 'reply',
  516 |       question: null,
  517 |       matched_answer: 'Hello! I am your GarTex Assistant (WS). How can I help you with your textile business today?',
  518 |       source: 'system:greeting',
  519 |       metadata: {
  520 |         matched_source: 'system:greeting',
  521 |         matched_type: 'system',
  522 |         confidence: 1,
  523 |         fallback_reason: null,
  524 |       },
  525 |     })
  526 |   }
  527 | 
  528 |   socket.on('message', async (rawMessage) => {
  529 |     let payload
  530 |     try {
  531 |       payload = JSON.parse(String(rawMessage || ''))
  532 |     } catch {
  533 |       sendReply({
  534 |         type: 'reply',
  535 |         question: null,
  536 |         matched_answer: 'Invalid message format. Please send JSON like {"type":"ask","question":"..."}.',
  537 |         source: 'ws:error',
  538 |         metadata: {
  539 |           matched_source: 'ws:error',
  540 |           matched_type: 'error',
  541 |           confidence: 0,
  542 |           fallback_reason: 'invalid_json',
  543 |         },
  544 |       })
  545 |       return
  546 |     }
  547 | 
  548 |     if (payload?.type === 'join_call_room') {
  549 |       await joinCallRoom(socket, payload)
  550 |       return
  551 |     }
  552 | 
  553 |     if (payload?.type === 'webrtc_signal') {
  554 |       relaySignal(socket, payload)
  555 |       return
  556 |     }
  557 | 
  558 |     if (payload?.type === 'identify') {
  559 |       const tokenUser = parseSocketUser(payload?.token)
  560 |       if (!tokenUser?.id) return
  561 |       socket.userId = tokenUser.id
  562 |       registerSocketUser(socket, tokenUser.id)
  563 |       const queued = consumePendingInvites(tokenUser.id)
  564 |       if (queued.length > 0) queued.forEach((invite) => sendWs(socket, invite))
  565 |       return
  566 |     }
  567 | 
  568 |     if (payload?.type === 'call_invite') {
  569 |       const tokenUser = parseSocketUser(payload?.token)
  570 |       if (!tokenUser?.id) return
  571 |       const participantIds = Array.isArray(payload?.participant_ids) ? payload.participant_ids.map((id) => String(id)) : []
  572 |       if (!participantIds.length) return
  573 |       const users = await readJson('users.json')
  574 |       const caller = users.find((u) => String(u.id) === String(tokenUser.id)) || null
  575 |       const callerPayload = caller ? {
  576 |         id: caller.id,
  577 |         name: caller.name || '',
  578 |         email: caller.email || '',
  579 |         avatar: caller.avatar_url || caller.avatar || '',
  580 |         role: caller.role || '',
  581 |       } : { id: tokenUser.id }
  582 | 
  583 |       const targets = participantIds.filter((id) => id && id !== tokenUser.id)
  584 |       if (!targets.length) return
  585 |       const invitePayload = {
  586 |         type: 'incoming_call',
  587 |         call_id: payload?.call_id || null,
  588 |         match_id: payload?.match_id || null,
  589 |         from: callerPayload,
  590 |       }
  591 |       const undelivered = broadcastToUsers(targets, invitePayload)
  592 |       enqueuePendingInvites(undelivered, [invitePayload])
  593 |       return
  594 |     }
  595 | 
  596 |     if (payload?.type === 'join_chat_room') {
  597 |       await joinChatRoom(socket, payload)
  598 |       return
  599 |     }
  600 | 
  601 |     if (payload?.type === 'chat_message') {
  602 |       await relayChatMessage(socket, payload)
  603 |       return
  604 |     }
  605 | 
  606 |     if (payload?.type !== 'ask') return
  607 | 
  608 |     const question = String(payload?.question || '')
  609 |     const messageNow = Date.now()
  610 |     if (question && question === lastQuestion && messageNow - lastQuestionAt < 1500) return
  611 |     lastQuestion = question
  612 |     lastQuestionAt = messageNow
  613 |     logInfo('Assistant WebSocket ask received', { question_chars: question.length })
  614 | 
  615 |     try {
  616 |       const result = await assistantReply('public_ws', question)
  617 |       const answer = result?.matched_answer || 'I could not find a response right now. Please try again.'
  618 |       sendReply({
  619 |         type: 'reply',
  620 |         request_id: payload?.request_id || null,
  621 |         question,
  622 |         matched_answer: answer,
  623 |         source: result?.source || 'ws:fallback',
  624 |         metadata: result?.metadata || {
  625 |           matched_source: null,
  626 |           matched_type: null,
  627 |           confidence: 0,
  628 |           fallback_reason: 'empty_result',
  629 |         },
  630 |       })
  631 |     } catch (error) {
  632 |       logError('Assistant WebSocket ask failed', error)
  633 |       sendReply({
  634 |         type: 'reply',
  635 |         request_id: payload?.request_id || null,
  636 |         question,
  637 |         matched_answer: 'I could not reach the AI model right now. Please try again.',
  638 |         source: 'ws:error',
  639 |         metadata: {
  640 |           matched_source: 'ws:error',
  641 |           matched_type: 'error',
  642 |           confidence: 0,
  643 |           fallback_reason: 'assistant_exception',
  644 |         },
  645 |       })
  646 |     }
  647 |   })
  648 | 
  649 |   socket.on('close', () => {
  650 |     leaveCallRoom(socket)
  651 |     leaveChatRoom(socket)
  652 |     if (socket.userId) setUserOffline(socket.userId)
  653 |     if (socket.userId) unregisterSocketUser(socket, socket.userId)
  654 |   })
  655 | })
  656 | 
  657 | async function start() {
  658 |   await ensureDatabaseConnection()
  659 |   // Verification renewals: keep badges in sync with subscription validity.
  660 |   revokeExpiredVerifications().catch((error) => logError('verification_expiry_check_failed', error))
  661 |   enforcePartnerFreeTierLimits().catch((error) => logError('partner_limit_check_failed', error))
  662 |   runLeadReminderSweep().catch((error) => logError('lead_reminder_sweep_failed', error))
  663 |   setInterval(() => {
  664 |     revokeExpiredVerifications().catch((error) => logError('verification_expiry_check_failed', error))
  665 |     enforcePartnerFreeTierLimits().catch((error) => logError('partner_limit_check_failed', error))
  666 |   }, 6 * 60 * 60 * 1000)
  667 | 
  668 |   setInterval(() => {
  669 |     runLeadReminderSweep().catch((error) => logError('lead_reminder_sweep_failed', error))
  670 |   }, 5 * 60 * 1000)
  671 |   server.listen(PORT, () => {
  672 |     logInfo(`Verification MVP API running on http://localhost:${PORT}`)
  673 |   })
  674 | 
  675 |   try {
  676 |     startEsignWebhookRetryWorker()
  677 |   } catch (err) {
  678 |     logError('start_esign_retry_worker_failed', err)
  679 |   }
  680 | }
  681 | 
  682 | start().catch((error) => {
  683 |   logError('Failed to start server', error)
  684 |   process.exit(1)
  685 | })
  686 | 
  687 | process.on('SIGINT', async () => {
  688 |   try {
  689 |     await closeDatabaseConnection()
  690 |   } finally {
  691 |     process.exit(0)
  692 |   }
  693 | })
  694 | 