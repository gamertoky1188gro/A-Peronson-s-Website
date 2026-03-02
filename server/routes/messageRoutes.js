import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getMessages, inbox, sendMessage } from '../controllers/messageController.js'

const router = Router()

router.get('/inbox', requireAuth, inbox)
router.post('/:matchId', requireAuth, sendMessage)
router.get('/:matchId', requireAuth, getMessages)

export default router
