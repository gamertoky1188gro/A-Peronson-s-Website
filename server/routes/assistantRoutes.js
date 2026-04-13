import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import {
  askAssistant,
  askAssistantPublic,
  postExtractRequirement,
  postGenerateFirstResponse,
  postValidateResponse,
  createAssistantKnowledge,
  getConversationSummary,
  getAssistantKnowledge,
  getNegotiationHelper,
  removeAssistantKnowledge,
  updateAssistantKnowledge,
} from '../controllers/assistantController.js'

const router = Router()

router.post('/ask', requireAuth, askAssistant)
router.post('/ask-public', askAssistantPublic)
router.post('/extract-requirement', requireAuth, postExtractRequirement)
router.post('/generate-first-response', requireAuth, postGenerateFirstResponse)
router.post('/validate-response', requireAuth, postValidateResponse)
router.post('/conversation-summary', requireAuth, getConversationSummary)
router.post('/negotiation', requireAuth, getNegotiationHelper)
router.get('/knowledge', requireAuth, getAssistantKnowledge)
router.post('/knowledge', requireAuth, allowRoles('owner', 'admin'), createAssistantKnowledge)
router.put('/knowledge/:entryId', requireAuth, allowRoles('owner', 'admin'), updateAssistantKnowledge)
router.delete('/knowledge/:entryId', requireAuth, allowRoles('owner', 'admin'), removeAssistantKnowledge)

export default router
