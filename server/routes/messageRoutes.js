import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { acceptRequest, getMessages, inbox, rejectRequest, sendMessage } from '../controllers/messageController.js'

const router = Router()

router.get('/inbox', requireAuth, inbox)
router.post('/requests/:threadId/accept', requireAuth, acceptRequest)
router.post('/requests/:threadId/reject', requireAuth, rejectRequest)
router.post('/:matchId', requireAuth, sendMessage)
router.get('/:matchId', requireAuth, getMessages)

export default router
