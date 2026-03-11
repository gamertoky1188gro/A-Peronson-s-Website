import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { requireAuth } from '../middleware/auth.js'
import {
  acceptRequest,
  getMessages,
  inbox,
  rejectRequest,
  sendFriendDirectMessage,
  sendMessage,
  uploadMessageAttachment,
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
router.post('/:matchId/upload', requireAuth, upload.single('file'), uploadMessageAttachment)
router.post('/:matchId', requireAuth, sendMessage)
router.get('/:matchId', requireAuth, getMessages)

export default router
