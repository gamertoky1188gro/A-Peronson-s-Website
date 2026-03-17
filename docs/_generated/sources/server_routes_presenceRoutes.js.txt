    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { getPresence } from '../controllers/presenceController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.post('/', requireAuth, getPresence)
    8 | 
    9 | export default router
   10 | 