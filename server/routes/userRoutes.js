import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { adminDeleteUser, adminListUsers, adminVerifyUser, me, updateMyProfile } from '../controllers/userController.js'

const router = Router()

router.get('/me', requireAuth, me)
router.patch('/me/profile', requireAuth, updateMyProfile)

router.get('/', requireAuth, allowRoles('owner', 'admin'), adminListUsers)
router.patch('/:userId/verify', requireAuth, allowRoles('owner', 'admin'), adminVerifyUser)
router.delete('/:userId', requireAuth, allowRoles('owner', 'admin'), adminDeleteUser)

export default router
