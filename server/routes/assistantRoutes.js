import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import {
  askAssistant,
  askAssistantPublic,
  createAssistantKnowledge,
  getAssistantKnowledge,
  removeAssistantKnowledge,
  updateAssistantKnowledge,
} from '../controllers/assistantController.js'

const router = Router()

router.post('/ask', requireAuth, askAssistant)
router.post('/ask-public', askAssistantPublic)
router.get('/knowledge', requireAuth, getAssistantKnowledge)
router.post('/knowledge', requireAuth, allowRoles('owner', 'admin'), createAssistantKnowledge)
router.put('/knowledge/:entryId', requireAuth, allowRoles('owner', 'admin'), updateAssistantKnowledge)
router.delete('/knowledge/:entryId', requireAuth, allowRoles('owner', 'admin'), removeAssistantKnowledge)

export default router
