import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { adminDeleteUser, adminListUsers, adminVerifyUser, me, updateMyProfile } from '../controllers/userController.js'

const router = Router()

router.get('/me', requireAuth, me)
router.patch('/me/profile', requireAuth, updateMyProfile)

router.get('/', requireAuth, allowRoles('admin'), adminListUsers)
router.patch('/:userId/verify', requireAuth, allowRoles('admin'), adminVerifyUser)
router.delete('/:userId', requireAuth, allowRoles('admin'), adminDeleteUser)

export default router
