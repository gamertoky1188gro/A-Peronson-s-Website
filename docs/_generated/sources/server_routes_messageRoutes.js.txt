    1 | import { Router } from 'express'
    2 | import multer from 'multer'
    3 | import path from 'path'
    4 | import { requireAuth } from '../middleware/auth.js'
    5 | import {
    6 |   acceptRequest,
    7 |   getMessages,
    8 |   inbox,
    9 |   getPolicyConfig,
   10 |   markRead,
   11 |   rejectRequest,
   12 |   sendFriendDirectMessage,
   13 |   sendMessage,
   14 |   uploadMessageAttachment,
   15 |   listPolicyReviewQueue,
   16 |   listMessagePolicyQueueInspector,
   17 |   markPolicyFalsePositive,
   18 |   updatePolicyConfig,
   19 |   updateSenderReputation,
   20 |   weeklyPolicyDecisionQualityReport,
   21 | } from '../controllers/messageController.js'
   22 | 
   23 | const router = Router()
   24 | 
   25 | const uploadDir = path.join(process.cwd(), 'server', 'uploads', 'chat')
   26 | const upload = multer({
   27 |   storage: multer.diskStorage({
   28 |     destination: (_req, _file, cb) => cb(null, uploadDir),
   29 |     filename: (_req, file, cb) => {
   30 |       const ext = path.extname(file.originalname || '').slice(0, 12)
   31 |       const baseWithoutExt = path.basename(file.originalname || 'file', ext)
   32 |       const safeBase = baseWithoutExt.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 80) || 'file'
   33 |       cb(null, `${Date.now()}-${safeBase}${ext || ''}`)
   34 |     },
   35 |   }),
   36 |   limits: { fileSize: 25 * 1024 * 1024 },
   37 | })
   38 | 
   39 | router.get('/inbox', requireAuth, inbox)
   40 | router.post('/requests/:threadId/accept', requireAuth, acceptRequest)
   41 | router.post('/requests/:threadId/reject', requireAuth, rejectRequest)
   42 | router.post('/friend/:userId', requireAuth, sendFriendDirectMessage)
   43 | 
   44 | router.get('/policy/config', requireAuth, getPolicyConfig)
   45 | router.get('/policy/review-queue', requireAuth, listPolicyReviewQueue)
   46 | router.get('/policy/queue-inspector', requireAuth, listMessagePolicyQueueInspector)
   47 | router.post('/policy/review-queue/:decisionId/false-positive', requireAuth, markPolicyFalsePositive)
   48 | router.post('/policy/reputation/:senderId/adjust', requireAuth, updateSenderReputation)
   49 | router.get('/policy/reports/weekly-decision-quality', requireAuth, weeklyPolicyDecisionQualityReport)
   50 | router.put('/policy/config', requireAuth, updatePolicyConfig)
   51 | router.post('/:matchId/read', requireAuth, markRead)
   52 | router.post('/:matchId/upload', requireAuth, upload.single('file'), uploadMessageAttachment)
   53 | router.post('/:matchId', requireAuth, sendMessage)
   54 | router.get('/:matchId', requireAuth, getMessages)
   55 | 
   56 | export default router
   57 | 