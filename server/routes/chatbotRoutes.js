import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getChatbotProfile, replyWithChatbot, getChatbotSettingsController, updateChatbotSettingsController } from '../controllers/chatbotController.js'

const router = Router()

// Public summary for UI (still requires auth because it reveals product/capability hints).
router.get('/profile/:userId', requireAuth, getChatbotProfile)

// Generate an optional bot reply for a chat thread.
router.post('/reply', requireAuth, replyWithChatbot)
router.get('/settings', requireAuth, getChatbotSettingsController)
router.post('/settings', requireAuth, updateChatbotSettingsController)

export default router
