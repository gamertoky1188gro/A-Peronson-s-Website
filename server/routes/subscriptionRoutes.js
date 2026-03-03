import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { adminSetUserSubscription, getMyRemainingDays, getMySubscription, markMyVerificationExpiringSoon, renewMyPremiumMonthly, updateMySubscription } from '../controllers/subscriptionController.js'

const router = Router()

router.get('/me', requireAuth, getMySubscription)
router.post('/me', requireAuth, updateMySubscription)
router.post('/me/renew-monthly', requireAuth, renewMyPremiumMonthly)
router.get('/me/remaining-days', requireAuth, getMyRemainingDays)
router.post('/me/verification/mark-expiring-soon', requireAuth, markMyVerificationExpiringSoon)
router.post('/admin/:userId', requireAuth, allowRoles('admin'), adminSetUserSubscription)

export default router
