import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { requireAuth } from '../middleware/auth.js'
import {
  acceptRequest,
  getMessages,
  inbox,
  getPolicyConfig,
  markRead,
  rejectRequest,
  sendFriendDirectMessage,
  sendMessage,
  uploadMessageAttachment,
  listPolicyReviewQueue,
  listMessagePolicyQueueInspector,
  markPolicyFalsePositive,
  updatePolicyConfig,
  updateSenderReputation,
  weeklyPolicyDecisionQualityReport,
} from '../controllers/messageController.js'

const router = Router()

const uploadDir = path.join(process.cwd(), 'server', 'uploads', 'chat')
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').slice(0, 12)
      const baseWithoutExt = path.basename(file.originalname || 'file', ext)
      const safeBase = baseWithoutExt.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 80) || 'file'
      cb(null, `${Date.now()}-${safeBase}${ext || ''}`)
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
})

router.get('/inbox', requireAuth, inbox)
router.post('/requests/:threadId/accept', requireAuth, acceptRequest)
router.post('/requests/:threadId/reject', requireAuth, rejectRequest)
router.post('/friend/:userId', requireAuth, sendFriendDirectMessage)

router.get('/policy/config', requireAuth, getPolicyConfig)
router.get('/policy/review-queue', requireAuth, listPolicyReviewQueue)
router.get('/policy/queue-inspector', requireAuth, listMessagePolicyQueueInspector)
router.post('/policy/review-queue/:decisionId/false-positive', requireAuth, markPolicyFalsePositive)
router.post('/policy/reputation/:senderId/adjust', requireAuth, updateSenderReputation)
router.get('/policy/reports/weekly-decision-quality', requireAuth, weeklyPolicyDecisionQualityReport)
router.put('/policy/config', requireAuth, updatePolicyConfig)
router.post('/:matchId/read', requireAuth, markRead)
router.post('/:matchId/upload', requireAuth, upload.single('file'), uploadMessageAttachment)
router.post('/:matchId', requireAuth, sendMessage)
router.get('/:matchId', requireAuth, getMessages)

export default router
