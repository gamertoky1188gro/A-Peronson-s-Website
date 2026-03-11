import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import {
  adminDeleteUser,
  adminListUsers,
  adminVerifyUser,
  followUserController,
  friendRequestController,
  lookupUsers,
  me,
  searchUsersController,
  updateMyProfile,
} from '../controllers/userController.js'

const router = Router()

router.get('/me', requireAuth, me)
router.patch('/me/profile', requireAuth, updateMyProfile)
router.get('/search', requireAuth, searchUsersController)
router.post('/lookup', requireAuth, lookupUsers)
router.post('/:userId/follow', requireAuth, followUserController)
router.post('/:userId/friend-request', requireAuth, friendRequestController)

router.get('/', requireAuth, allowRoles('owner', 'admin'), adminListUsers)
router.patch('/:userId/verify', requireAuth, allowRoles('owner', 'admin'), adminVerifyUser)
router.delete('/:userId', requireAuth, allowRoles('owner', 'admin'), adminDeleteUser)

export default router
