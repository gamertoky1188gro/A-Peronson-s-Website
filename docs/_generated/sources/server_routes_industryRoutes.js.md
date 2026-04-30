    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { getIndustryAutoReply, getIndustryPage } from '../controllers/industryController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.get('/:slug', requireAuth, getIndustryPage)
    8 | router.post('/:slug/auto-reply', requireAuth, getIndustryAutoReply)
    9 | 
   10 | export default router
   11 | 
   12 | 