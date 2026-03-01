import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { adminSetUserSubscription, getMySubscription, updateMySubscription } from '../controllers/subscriptionController.js'

const router = Router()

router.get('/me', requireAuth, getMySubscription)
router.post('/me', requireAuth, updateMySubscription)
router.post('/admin/:userId', requireAuth, allowRoles('admin'), adminSetUserSubscription)

export default router
