import express from 'express'
import cors from 'cors'
import path from 'path'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import requirementRoutes from './routes/requirementRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import systemRoutes from './routes/systemRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logInfo } from './utils/logger.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'textile-trust-mvp' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/requirements', requirementRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', systemRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
  logInfo(`MVP API running on http://localhost:${PORT}`)
})
