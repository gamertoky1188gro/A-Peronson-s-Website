import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import {
  adminApprove,
  adminQueue,
  adminReject,
  adminRevokeExpired,
  getMyVerification,
  renewMyVerification,
  submitMyVerification,
} from '../controllers/verificationController.js'

const router = Router()

router.get('/me', requireAuth, getMyVerification)
router.post('/me', requireAuth, allowRoles('buyer', 'factory', 'buying_house'), submitMyVerification)
router.post('/renew', requireAuth, allowRoles('buyer', 'factory', 'buying_house'), renewMyVerification)
router.get('/admin/queue', requireAuth, allowRoles('owner', 'admin'), adminQueue)
router.post('/admin/:userId/approve', requireAuth, allowRoles('owner', 'admin'), adminApprove)
router.post('/admin/:userId/reject', requireAuth, allowRoles('owner', 'admin'), adminReject)
router.post('/admin/revoke-expired', requireAuth, allowRoles('owner', 'admin'), adminRevokeExpired)

export default router
