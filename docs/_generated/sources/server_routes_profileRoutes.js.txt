    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { getProfile, getProfilePartnerNetwork, getProfileProducts, getProfileRequests } from '../controllers/profileController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.get('/:userId', requireAuth, getProfile)
    8 | router.get('/:userId/requests', requireAuth, getProfileRequests)
    9 | router.get('/:userId/products', requireAuth, getProfileProducts)
   10 | router.get('/:userId/partner-network', requireAuth, getProfilePartnerNetwork)
   11 | 
   12 | export default router
   13 | 
   14 | 