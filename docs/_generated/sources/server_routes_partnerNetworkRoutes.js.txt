    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   acceptPartnerRequest,
    5 |   cancelPartnerRequest,
    6 |   createPartnerRequest,
    7 |   listPartnerNetwork,
    8 |   rejectPartnerRequest,
    9 | } from '../controllers/partnerNetworkController.js'
   10 | 
   11 | const router = Router()
   12 | 
   13 | router.get('/', requireAuth, listPartnerNetwork)
   14 | router.post('/requests', requireAuth, createPartnerRequest)
   15 | router.post('/requests/:requestId/accept', requireAuth, acceptPartnerRequest)
   16 | router.post('/requests/:requestId/reject', requireAuth, rejectPartnerRequest)
   17 | router.post('/requests/:requestId/cancel', requireAuth, cancelPartnerRequest)
   18 | 
   19 | export default router
   20 | 