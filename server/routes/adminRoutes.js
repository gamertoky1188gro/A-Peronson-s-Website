import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { subscriptionsAudit, usersAudit, verificationAudit } from '../controllers/adminController.js'

const router = Router()

router.get('/users', requireAuth, allowRoles('admin'), usersAudit)
router.get('/verification', requireAuth, allowRoles('admin'), verificationAudit)
router.get('/subscriptions', requireAuth, allowRoles('admin'), subscriptionsAudit)

export default router
