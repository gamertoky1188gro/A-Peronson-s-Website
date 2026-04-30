    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   askAssistant,
    5 |   askAssistantPublic,
    6 |   postExtractRequirement,
    7 |   postGenerateFirstResponse,
    8 |   postValidateResponse,
    9 |   createAssistantKnowledge,
   10 |   getConversationSummary,
   11 |   getAssistantKnowledge,
   12 |   getNegotiationHelper,
   13 |   removeAssistantKnowledge,
   14 |   updateAssistantKnowledge,
   15 | } from '../controllers/assistantController.js'
   16 | 
   17 | const router = Router()
   18 | 
   19 | router.post('/ask', requireAuth, askAssistant)
   20 | router.post('/ask-public', askAssistantPublic)
   21 | router.post('/extract-requirement', requireAuth, postExtractRequirement)
   22 | router.post('/generate-first-response', requireAuth, postGenerateFirstResponse)
   23 | router.post('/validate-response', requireAuth, postValidateResponse)
   24 | router.post('/conversation-summary', requireAuth, getConversationSummary)
   25 | router.post('/negotiation', requireAuth, getNegotiationHelper)
   26 | router.get('/knowledge', requireAuth, getAssistantKnowledge)
   27 | router.post('/knowledge', requireAuth, allowRoles('owner', 'admin'), createAssistantKnowledge)
   28 | router.put('/knowledge/:entryId', requireAuth, allowRoles('owner', 'admin'), updateAssistantKnowledge)
   29 | router.delete('/knowledge/:entryId', requireAuth, allowRoles('owner', 'admin'), removeAssistantKnowledge)
   30 | 
   31 | export default router
   32 | 