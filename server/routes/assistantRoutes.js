import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { askAssistant } from '../controllers/assistantController.js'

const router = Router()
router.post('/ask', requireAuth, askAssistant)
export default router
