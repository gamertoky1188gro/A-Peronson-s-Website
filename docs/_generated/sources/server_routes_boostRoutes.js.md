    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { cancelBoostController, createBoost, getMyBoosts } from '../controllers/boostController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.get('/me', requireAuth, getMyBoosts)
    8 | router.post('/', requireAuth, createBoost)
    9 | router.post('/:boostId/cancel', requireAuth, cancelBoostController)
   10 | 
   11 | export default router
   12 | 
   13 | 