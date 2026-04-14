    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import { crmProfileSummary, crmRelationshipTimeline } from '../controllers/crmController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.get('/profile/:targetId', requireAuth, allowRoles('owner', 'admin', 'buyer', 'factory', 'buying_house', 'agent'), crmProfileSummary)
    8 | router.get('/relationship/:counterpartyId', requireAuth, allowRoles('owner', 'admin', 'factory', 'buying_house', 'agent'), crmRelationshipTimeline)
    9 | 
   10 | export default router
   11 | 