import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  askAssistant,
  createAssistantKnowledge,
  getAssistantKnowledge,
  removeAssistantKnowledge,
  updateAssistantKnowledge,
} from '../controllers/assistantController.js'

const router = Router()

router.post('/ask', requireAuth, askAssistant)
router.get('/knowledge', requireAuth, getAssistantKnowledge)
router.post('/knowledge', requireAuth, createAssistantKnowledge)
router.put('/knowledge/:entryId', requireAuth, updateAssistantKnowledge)
router.delete('/knowledge/:entryId', requireAuth, removeAssistantKnowledge)

export default router
