    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { getChatbotProfile, replyWithChatbot, getChatbotSettingsController, updateChatbotSettingsController } from '../controllers/chatbotController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | // Public summary for UI (still requires auth because it reveals product/capability hints).
    8 | router.get('/profile/:userId', requireAuth, getChatbotProfile)
    9 | 
   10 | // Generate an optional bot reply for a chat thread.
   11 | router.post('/reply', requireAuth, replyWithChatbot)
   12 | router.get('/settings', requireAuth, getChatbotSettingsController)
   13 | router.post('/settings', requireAuth, updateChatbotSettingsController)
   14 | 
   15 | export default router
   16 | 