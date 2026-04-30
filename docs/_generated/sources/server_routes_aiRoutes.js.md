    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { approveReplyDraft, draftReply, extractRequirements, sendApprovedReply } from '../controllers/aiController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.post('/requirements/extract', requireAuth, extractRequirements)
    8 | router.post('/reply/draft', requireAuth, draftReply)
    9 | router.post('/reply/approve', requireAuth, approveReplyDraft)
   10 | router.post('/reply/send', requireAuth, sendApprovedReply)
   11 | 
   12 | export default router
   13 | 