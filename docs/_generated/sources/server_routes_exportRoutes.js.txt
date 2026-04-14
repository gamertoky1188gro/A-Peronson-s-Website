    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { exportAnalytics } from '../controllers/exportController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.post('/analytics', requireAuth, exportAnalytics)
    8 | 
    9 | export default router
   10 | 