    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { getMyCertification, getOrgCertification } from '../controllers/certificationController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.get('/me', requireAuth, getMyCertification)
    8 | router.get('/org/:orgId', requireAuth, getOrgCertification)
    9 | 
   10 | export default router
   11 | 