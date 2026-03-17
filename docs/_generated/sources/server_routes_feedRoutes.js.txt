    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { combinedFeed } from '../controllers/feedController.js'
    4 | 
    5 | const router = Router()
    6 | router.get('/', requireAuth, combinedFeed)
    7 | export default router
    8 | 