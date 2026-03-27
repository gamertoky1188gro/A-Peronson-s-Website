import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireAdminSecurity } from '../middleware/adminSecurity.js'
import {
  adminDeleteUser,
  adminListUsers,
  adminResetPassword,
  adminUpdateUser,
  adminVerifyUser,
  adminForceLogout,
  adminLockMessaging,
  followUserController,
  friendRequestController,
  lookupUsers,
  me,
  searchUsersController,
  updateMyProfile,
  deleteMyAccount,
} from '../controllers/userController.js'

const router = Router()

router.get('/me', requireAuth, me)
router.patch('/me/profile', requireAuth, updateMyProfile)
router.delete('/me', requireAuth, deleteMyAccount)
router.get('/search', requireAuth, searchUsersController)
router.post('/lookup', requireAuth, lookupUsers)
router.post('/:userId/follow', requireAuth, followUserController)
router.post('/:userId/friend-request', requireAuth, friendRequestController)

router.get('/', requireAuth, requireAdminSecurity, adminListUsers)
router.patch('/:userId', requireAuth, requireAdminSecurity, adminUpdateUser)
router.patch('/:userId/verify', requireAuth, requireAdminSecurity, adminVerifyUser)
router.post('/:userId/reset-password', requireAuth, requireAdminSecurity, adminResetPassword)
router.post('/:userId/force-logout', requireAuth, requireAdminSecurity, adminForceLogout)
router.post('/:userId/lock-messaging', requireAuth, requireAdminSecurity, adminLockMessaging)
router.delete('/:userId', requireAuth, requireAdminSecurity, adminDeleteUser)

export default router
