    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { requireAdminSecurity } from '../middleware/adminSecurity.js'
    4 | import { adminSetUserSubscription, getMyRemainingDays, getMySubscription, markMyVerificationExpiringSoon, renewMyPremiumMonthly, updateMySubscription } from '../controllers/subscriptionController.js'
    5 | 
    6 | const router = Router()
    7 | 
    8 | router.get('/me', requireAuth, getMySubscription)
    9 | router.post('/me', requireAuth, updateMySubscription)
   10 | router.post('/me/renew-monthly', requireAuth, renewMyPremiumMonthly)
   11 | router.get('/me/remaining-days', requireAuth, getMyRemainingDays)
   12 | router.post('/me/verification/mark-expiring-soon', requireAuth, markMyVerificationExpiringSoon)
   13 | router.post('/admin/:userId', requireAuth, requireAdminSecurity, adminSetUserSubscription)
   14 | 
   15 | export default router
   16 | 