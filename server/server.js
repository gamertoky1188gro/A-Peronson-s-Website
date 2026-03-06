import express from 'express'
import cors from 'cors'
import path from 'path'
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
import messageRoutes from './routes/messageRoutes.js'
import partnerNetworkRoutes from './routes/partnerNetworkRoutes.js'
import callSessionRoutes from './routes/callSessionRoutes.js'
import memberRoutes from './routes/memberRoutes.js'
import orgRoutes from './routes/orgRoutes.js'
import ratingsRoutes from './routes/ratingsRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logInfo, logError } from './utils/logger.js'
import { assistantReply } from './services/assistantService.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')))

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
app.use('/api/system', systemRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/social', socialRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/partners', partnerNetworkRoutes)
app.use('/api/calls', callSessionRoutes)
app.use('/api/org', orgRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/ratings', ratingsRoutes)
app.use(errorHandler)

const server = http.createServer(app)
const wsServer = new WebSocketServer({ server })

wsServer.on('connection', (socket) => {
  logInfo('Assistant WebSocket connected')

  socket.send(JSON.stringify({
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
  }))

  socket.on('message', async (rawMessage) => {
    let payload
    try {
      payload = JSON.parse(String(rawMessage || ''))
    } catch {
      socket.send(JSON.stringify({
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
      }))
      return
    }

    if (payload?.type !== 'ask') return

    const question = String(payload?.question || '')
    logInfo('Assistant WebSocket ask received', { question_chars: question.length })

    try {
      const result = await assistantReply('public_ws', question)
      const answer = result?.matched_answer || 'I could not find a response right now. Please try again.'
      socket.send(JSON.stringify({
        type: 'reply',
        question,
        matched_answer: answer,
        source: result?.source || 'ws:fallback',
        metadata: result?.metadata || {
          matched_source: null,
          matched_type: null,
          confidence: 0,
          fallback_reason: 'empty_result',
        },
      }))
    } catch (error) {
      logError('Assistant WebSocket ask failed', error)
      socket.send(JSON.stringify({
        type: 'reply',
        question,
        matched_answer: 'I could not reach the AI model right now. Please try again.',
        source: 'ws:error',
        metadata: {
          matched_source: 'ws:error',
          matched_type: 'error',
          confidence: 0,
          fallback_reason: 'assistant_exception',
        },
      }))
    }
  })
})

server.listen(PORT, () => {
  logInfo(`Verification MVP API running on http://localhost:${PORT}`)
})
