    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { submitOnboarding } from '../controllers/onboardingController.js'
    4 | 
    5 | const router = Router()
    6 | router.post('/', requireAuth, submitOnboarding)
    7 | export default router
    8 | 