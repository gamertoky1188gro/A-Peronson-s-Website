import './utils/dotenv.js'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import http from 'http'
import { WebSocketServer } from 'ws'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import requirementRoutes from './routes/requirementRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import systemRoutes from './routes/systemRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import socialRoutes from './routes/socialRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import verificationRoutes from './routes/verificationRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'
import feedRoutes from './routes/feedRoutes.js'
import productRoutes from './routes/productRoutes.js'
import onboardingRoutes from './routes/onboardingRoutes.js'
import assistantRoutes from './routes/assistantRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import partnerNetworkRoutes from './routes/partnerNetworkRoutes.js'
import callSessionRoutes from './routes/callSessionRoutes.js'
import leadRoutes from './routes/leadRoutes.js'
import memberRoutes from './routes/memberRoutes.js'
import orgRoutes from './routes/orgRoutes.js'
import ratingsRoutes from './routes/ratingsRoutes.js'
import presenceRoutes from './routes/presenceRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import chatbotRoutes from './routes/chatbotRoutes.js'
import walletRoutes from './routes/walletRoutes.js'
import boostRoutes from './routes/boostRoutes.js'
import industryRoutes from './routes/industryRoutes.js'
import paymentProofRoutes from './routes/paymentProofRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import supportRoutes from './routes/supportRoutes.js'
import infraRoutes from './routes/infraRoutes.js'
import networkRoutes from './routes/networkRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logInfo, logError } from './utils/logger.js'
import { assistantReply } from './services/assistantService.js'
import { maybeGenerateBotReply } from './services/chatbotService.js'
import jwt from 'jsonwebtoken'
import { canAccessMatch, listMessagesByMatch, postMessage } from './services/messageService.js'
import { getCallSession } from './services/callSessionService.js'
import { setUserOnline, setUserOffline, touchUser } from './services/presenceService.js'
import { readJson } from './utils/jsonStore.js'
import { consumePendingInvites, enqueuePendingInvites } from './utils/pendingInvites.js'
import { ensureDatabaseConnection, closeDatabaseConnection } from './utils/db.js'
import { revokeExpiredVerifications } from './services/verificationService.js'
import { enforcePartnerFreeTierLimits } from './services/partnerNetworkService.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '5mb' }))

const uploadsRoot = path.join(process.cwd(), 'server', 'uploads')
const chatUploadsRoot = path.join(uploadsRoot, 'chat')
if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true })
if (!fs.existsSync(chatUploadsRoot)) fs.mkdirSync(chatUploadsRoot, { recursive: true })

app.use('/uploads', express.static(uploadsRoot))

const distRoot = path.join(process.cwd(), 'dist')
const serveDist = process.env.SERVE_DIST === 'true'
if (serveDist && fs.existsSync(distRoot)) {
  app.use(express.static(distRoot))
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'textile-trust-verification-mvp' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/requirements', requirementRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/verification', verificationRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/feed', feedRoutes)
app.use('/api/products', productRoutes)
app.use('/api/onboarding', onboardingRoutes)
app.use('/api/assistant', assistantRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/system', systemRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/social', socialRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/partners', partnerNetworkRoutes)
app.use('/api/calls', callSessionRoutes)
app.use('/api/org', orgRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/ratings', ratingsRoutes)
app.use('/api/presence', presenceRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/boosts', boostRoutes)
app.use('/api/industry', industryRoutes)
app.use('/api/payment-proofs', paymentProofRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/support', supportRoutes)
app.use('/api/infra', infraRoutes)
app.use('/api/network', networkRoutes)
app.use(errorHandler)

if (serveDist && fs.existsSync(distRoot)) {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(distRoot, 'index.html'))
  })
}

const server = http.createServer(app)
const wsServer = new WebSocketServer({ server })
const recentGreetingByIp = new Map()
const callRooms = new Map()
const chatRooms = new Map()
const socketsByUserId = new Map()
const JWT_SECRET = process.env.JWT_SECRET || 'mvp-dev-secret'
const JWT_ISSUER = process.env.JWT_ISSUER || 'gartexhub-api'
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'gartexhub-client'

function sendWs(socket, payload) {
  if (socket.readyState !== 1) return
  socket.send(JSON.stringify(payload))
}

function registerSocketUser(socket, userId) {
  if (!userId) return
  if (!socketsByUserId.has(userId)) socketsByUserId.set(userId, new Set())
  socketsByUserId.get(userId).add(socket)
}

function unregisterSocketUser(socket, userId) {
  if (!userId) return
  const set = socketsByUserId.get(userId)
  if (!set) return
  set.delete(socket)
  if (set.size === 0) socketsByUserId.delete(userId)
}

function broadcastToUsers(userIds = [], payload) {
  const undelivered = []
  userIds.forEach((userId) => {
    const sockets = socketsByUserId.get(userId)
    if (!sockets || sockets.size === 0) {
      undelivered.push(userId)
      return
    }
    sockets.forEach((sock) => sendWs(sock, payload))
  })
  return undelivered
}

function leaveCallRoom(socket) {
  const callId = socket.callRoomId
  if (!callId) return

  const room = callRooms.get(callId)
  if (!room) {
    socket.callRoomId = null
    return
  }

  room.delete(socket)
  for (const peer of room) {
    sendWs(peer, {
      type: 'participant_left',
      call_id: callId,
      participant_id: socket.participantId || null,
    })
  }

  if (room.size === 0) callRooms.delete(callId)
  socket.callRoomId = null
}

function leaveChatRoom(socket) {
  const matchId = socket.chatRoomId
  if (!matchId) return

  const room = chatRooms.get(matchId)
  if (!room) {
    socket.chatRoomId = null
    return
  }

  room.delete(socket)

  for (const peer of room) {
    sendWs(peer, {
      type: 'chat_participant_left',
      match_id: matchId,
      participant_id: socket.userId || null,
    })
  }

  if (room.size === 0) chatRooms.delete(matchId)
  socket.chatRoomId = null

  if (socket.userId) setUserOffline(socket.userId)
  if (socket.userId) unregisterSocketUser(socket, socket.userId)
}


function parseSocketUser(token) {
  if (!token) return null
  try {
    return jwt.verify(String(token), JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })
  } catch {
    return null
  }
}

async function joinChatRoom(socket, payload) {
  const matchId = String(payload?.match_id || '').trim()
  const user = parseSocketUser(payload?.token)

  if (!matchId) {
    sendWs(socket, { type: 'chat_error', error: 'match_id is required to join chat room' })
    return
  }

  if (!user?.id) {
    sendWs(socket, { type: 'chat_error', error: 'Valid token is required to join chat room' })
    return
  }

  const canJoin = await canAccessMatch(matchId, user.id)
  if (!canJoin) {
    sendWs(socket, { type: 'chat_error', error: 'Forbidden: thread access denied' })
    return
  }

  leaveChatRoom(socket)

  if (!chatRooms.has(matchId)) {
    chatRooms.set(matchId, new Set())
  }

  socket.userId = user.id
  registerSocketUser(socket, user.id)
  setUserOnline(user.id)
  const canSend = await canAccessMatch(matchId, socket.userId)
  if (!canSend) {
    sendWs(socket, { type: 'chat_error', error: 'Forbidden: thread access denied' })
    return
  }

  const room = chatRooms.get(matchId)
  const participants = [...room].map((participantSocket) => participantSocket.userId).filter(Boolean)
  room.add(socket)
  socket.chatRoomId = matchId
  touchUser(user.id)

  const history = await listMessagesByMatch(matchId)
  sendWs(socket, {
    type: 'joined_chat_room',
    match_id: matchId,
    participant_id: user.id,
    participants,
    messages: history,
  })

  for (const peer of room) {
    if (peer === socket) continue
    sendWs(peer, {
      type: 'chat_participant_joined',
      match_id: matchId,
      participant_id: user.id,
    })
  }
}

async function relayChatMessage(socket, payload) {
  const matchId = socket.chatRoomId
  if (!matchId || !socket.userId) {
    sendWs(socket, { type: 'chat_error', error: 'Join a chat room before sending messages' })
    return
  }

  const canSend = await canAccessMatch(matchId, socket.userId)
  if (!canSend) {
    sendWs(socket, { type: 'chat_error', error: 'Forbidden: thread access denied' })
    return
  }

  const room = chatRooms.get(matchId)
  if (!room) return

  const messageText = String(payload?.message || '').trim()
  if (!messageText) return

  try {
    const created = await postMessage(matchId, socket.userId, messageText, payload?.message_type || 'text')
    for (const peer of room) {
      sendWs(peer, {
        type: 'chat_message',
        match_id: matchId,
        message: created,
      })
    }

    try {
      const botResult = await maybeGenerateBotReply({ match_id: matchId, sender_id: socket.userId, message: messageText })
      if (botResult?.reply) {
        for (const peer of room) {
          sendWs(peer, {
            type: 'chat_message',
            match_id: matchId,
            message: botResult.reply,
          })
        }
      }
    } catch {
      // silent
    }
  } catch (error) {
    logError('chat_message_failed', error)
    sendWs(socket, { type: 'chat_error', error: 'Unable to send message' })
  }
}

async function joinCallRoom(socket, payload) {
  const callId = String(payload?.call_id || '').trim()
  const tokenUser = parseSocketUser(payload?.token)
  const participantId = String(payload?.participant_id || '').trim() || tokenUser?.id || `anon-${Date.now()}`
  if (!callId) {
    sendWs(socket, { type: 'call_error', error: 'call_id is required to join room' })
    return
  }

  if (!tokenUser?.id) {
    sendWs(socket, { type: 'call_error', error: 'Valid token is required to join call room' })
    return
  }

  const call = await getCallSession(callId, tokenUser.id)
  if (!call || call === 'forbidden') {
    sendWs(socket, { type: 'call_error', error: 'Forbidden: call access denied' })
    return
  }

  leaveCallRoom(socket)

  if (!callRooms.has(callId)) {
    callRooms.set(callId, new Set())
  }

  const room = callRooms.get(callId)
  const existingParticipants = [...room].map((s) => s.participantId).filter(Boolean)
  room.add(socket)
  socket.callRoomId = callId
  socket.participantId = participantId
  socket.userId = tokenUser.id
  registerSocketUser(socket, tokenUser.id)

  sendWs(socket, {
    type: 'joined_call_room',
    call_id: callId,
    participant_id: participantId,
    participants: existingParticipants,
    should_offer: existingParticipants.length > 0,
  })

  for (const peer of room) {
    if (peer === socket) continue
    sendWs(peer, {
      type: 'participant_joined',
      call_id: callId,
      participant_id: participantId,
    })
  }
}

function relaySignal(socket, payload) {
  const callId = socket.callRoomId
  if (!callId) return
  const room = callRooms.get(callId)
  if (!room) return

  const signalType = String(payload?.signal?.type || '')
  if (signalType && signalType !== 'candidate') {
    logInfo('webrtc_signal', {
      call_id: callId,
      from_user_id: socket.userId || null,
      from_participant_id: socket.participantId || null,
      signal_type: signalType,
    })
  }

  for (const peer of room) {
    if (peer === socket) continue
    sendWs(peer, {
      type: 'webrtc_signal',
      call_id: callId,
      from: socket.participantId || null,
      signal: payload?.signal || null,
    })
  }
}

wsServer.on('connection', (socket, req) => {
  logInfo('Assistant WebSocket connected')
  let lastQuestion = ''
  let lastQuestionAt = 0

  function sendReply(payload) {
    const answer = payload?.matched_answer || payload?.answer || payload?.message || ''
    sendWs(socket, {
      ...payload,
      matched_answer: answer,
      answer,
      message: answer,
    })
  }

  const clientIp = req?.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const lastGreetingAt = Number(recentGreetingByIp.get(clientIp) || 0)
  if (now - lastGreetingAt > 5_000) {
    recentGreetingByIp.set(clientIp, now)
    sendReply({
      type: 'reply',
      question: null,
      matched_answer: 'Hello! I am your GarTex Assistant (WS). How can I help you with your textile business today?',
      source: 'system:greeting',
      metadata: {
        matched_source: 'system:greeting',
        matched_type: 'system',
        confidence: 1,
        fallback_reason: null,
      },
    })
  }

  socket.on('message', async (rawMessage) => {
    let payload
    try {
      payload = JSON.parse(String(rawMessage || ''))
    } catch {
      sendReply({
        type: 'reply',
        question: null,
        matched_answer: 'Invalid message format. Please send JSON like {"type":"ask","question":"..."}.',
        source: 'ws:error',
        metadata: {
          matched_source: 'ws:error',
          matched_type: 'error',
          confidence: 0,
          fallback_reason: 'invalid_json',
        },
      })
      return
    }

    if (payload?.type === 'join_call_room') {
      await joinCallRoom(socket, payload)
      return
    }

    if (payload?.type === 'webrtc_signal') {
      relaySignal(socket, payload)
      return
    }

    if (payload?.type === 'identify') {
      const tokenUser = parseSocketUser(payload?.token)
      if (!tokenUser?.id) return
      socket.userId = tokenUser.id
      registerSocketUser(socket, tokenUser.id)
      const queued = consumePendingInvites(tokenUser.id)
      if (queued.length > 0) queued.forEach((invite) => sendWs(socket, invite))
      return
    }

    if (payload?.type === 'call_invite') {
      const tokenUser = parseSocketUser(payload?.token)
      if (!tokenUser?.id) return
      const participantIds = Array.isArray(payload?.participant_ids) ? payload.participant_ids.map((id) => String(id)) : []
      if (!participantIds.length) return
      const users = await readJson('users.json')
      const caller = users.find((u) => String(u.id) === String(tokenUser.id)) || null
      const callerPayload = caller ? {
        id: caller.id,
        name: caller.name || '',
        email: caller.email || '',
        avatar: caller.avatar_url || caller.avatar || '',
        role: caller.role || '',
      } : { id: tokenUser.id }

      const targets = participantIds.filter((id) => id && id !== tokenUser.id)
      if (!targets.length) return
      const invitePayload = {
        type: 'incoming_call',
        call_id: payload?.call_id || null,
        match_id: payload?.match_id || null,
        from: callerPayload,
      }
      const undelivered = broadcastToUsers(targets, invitePayload)
      enqueuePendingInvites(undelivered, [invitePayload])
      return
    }

    if (payload?.type === 'join_chat_room') {
      await joinChatRoom(socket, payload)
      return
    }

    if (payload?.type === 'chat_message') {
      await relayChatMessage(socket, payload)
      return
    }

    if (payload?.type !== 'ask') return

    const question = String(payload?.question || '')
    const messageNow = Date.now()
    if (question && question === lastQuestion && messageNow - lastQuestionAt < 1500) return
    lastQuestion = question
    lastQuestionAt = messageNow
    logInfo('Assistant WebSocket ask received', { question_chars: question.length })

    try {
      const result = await assistantReply('public_ws', question)
      const answer = result?.matched_answer || 'I could not find a response right now. Please try again.'
      sendReply({
        type: 'reply',
        request_id: payload?.request_id || null,
        question,
        matched_answer: answer,
        source: result?.source || 'ws:fallback',
        metadata: result?.metadata || {
          matched_source: null,
          matched_type: null,
          confidence: 0,
          fallback_reason: 'empty_result',
        },
      })
    } catch (error) {
      logError('Assistant WebSocket ask failed', error)
      sendReply({
        type: 'reply',
        request_id: payload?.request_id || null,
        question,
        matched_answer: 'I could not reach the AI model right now. Please try again.',
        source: 'ws:error',
        metadata: {
          matched_source: 'ws:error',
          matched_type: 'error',
          confidence: 0,
          fallback_reason: 'assistant_exception',
        },
      })
    }
  })

  socket.on('close', () => {
    leaveCallRoom(socket)
    leaveChatRoom(socket)
    if (socket.userId) setUserOffline(socket.userId)
    if (socket.userId) unregisterSocketUser(socket, socket.userId)
  })
})

async function start() {
  await ensureDatabaseConnection()
  // Verification renewals: keep badges in sync with subscription validity.
  revokeExpiredVerifications().catch((error) => logError('verification_expiry_check_failed', error))
  enforcePartnerFreeTierLimits().catch((error) => logError('partner_limit_check_failed', error))
  setInterval(() => {
    revokeExpiredVerifications().catch((error) => logError('verification_expiry_check_failed', error))
    enforcePartnerFreeTierLimits().catch((error) => logError('partner_limit_check_failed', error))
  }, 6 * 60 * 60 * 1000)
  server.listen(PORT, () => {
    logInfo(`Verification MVP API running on http://localhost:${PORT}`)
  })
}

start().catch((error) => {
  logError('Failed to start server', error)
  process.exit(1)
})

process.on('SIGINT', async () => {
  try {
    await closeDatabaseConnection()
  } finally {
    process.exit(0)
  }
})
