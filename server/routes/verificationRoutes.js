import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { adminApprove, adminRevokeExpired, getMyVerification, submitMyVerification } from '../controllers/verificationController.js'

const router = Router()

router.get('/me', requireAuth, getMyVerification)
router.post('/me', requireAuth, allowRoles('buyer', 'factory', 'buying_house'), submitMyVerification)
router.post('/admin/:userId/approve', requireAuth, allowRoles('admin'), adminApprove)
router.post('/admin/revoke-expired', requireAuth, allowRoles('admin'), adminRevokeExpired)

export default router
