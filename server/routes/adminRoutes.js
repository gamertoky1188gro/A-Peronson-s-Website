import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { subscriptionsAudit, usersAudit, verificationAudit } from '../controllers/adminController.js'

const router = Router()

router.get('/users', requireAuth, allowRoles('owner', 'admin'), usersAudit)
router.get('/verification', requireAuth, allowRoles('owner', 'admin'), verificationAudit)
router.get('/subscriptions', requireAuth, allowRoles('owner', 'admin'), subscriptionsAudit)

export default router
