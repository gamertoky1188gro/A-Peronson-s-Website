    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import { requireAdminSecurity } from '../middleware/adminSecurity.js'
    4 | import {
    5 |   adminApprove,
    6 |   adminQueue,
    7 |   adminReject,
    8 |   adminRevokeExpired,
    9 |   getMyVerification,
   10 |   renewMyVerification,
   11 |   submitMyVerification,
   12 | } from '../controllers/verificationController.js'
   13 | 
   14 | const router = Router()
   15 | 
   16 | router.get('/me', requireAuth, getMyVerification)
   17 | router.post('/me', requireAuth, allowRoles('buyer', 'factory', 'buying_house'), submitMyVerification)
   18 | router.post('/renew', requireAuth, allowRoles('buyer', 'factory', 'buying_house'), renewMyVerification)
   19 | router.get('/admin/queue', requireAuth, requireAdminSecurity, adminQueue)
   20 | router.post('/admin/:userId/approve', requireAuth, requireAdminSecurity, adminApprove)
   21 | router.post('/admin/:userId/reject', requireAuth, requireAdminSecurity, adminReject)
   22 | router.post('/admin/revoke-expired', requireAuth, requireAdminSecurity, adminRevokeExpired)
   23 | 
   24 | export default router
   25 | 