import express from 'express'
import cors from 'cors'
import path from 'path'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import requirementRoutes from './routes/requirementRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import systemRoutes from './routes/systemRoutes.js'
import verificationRoutes from './routes/verificationRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'
import feedRoutes from './routes/feedRoutes.js'
import productRoutes from './routes/productRoutes.js'
import onboardingRoutes from './routes/onboardingRoutes.js'
import assistantRoutes from './routes/assistantRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logInfo } from './utils/logger.js'

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
app.use('/api/analytics', analyticsRoutes)
app.use('/api', systemRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
  logInfo(`Verification MVP API running on http://localhost:${PORT}`)
})
