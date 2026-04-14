    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { requireAdminSecurity } from '../middleware/adminSecurity.js'
    4 | import {
    5 |   adminDeleteUser,
    6 |   adminListUsers,
    7 |   adminResetPassword,
    8 |   adminUpdateUser,
    9 |   adminVerifyUser,
   10 |   adminForceLogout,
   11 |   adminLockMessaging,
   12 |   followUserController,
   13 |   friendRequestController,
   14 |   listEarlyVerifiedFactoriesController,
   15 |   lookupUsers,
   16 |   me,
   17 |   searchUsersController,
   18 |   updateMyProfile,
   19 |   deleteMyAccount,
   20 | } from '../controllers/userController.js'
   21 | 
   22 | const router = Router()
   23 | 
   24 | router.get('/me', requireAuth, me)
   25 | router.patch('/me/profile', requireAuth, updateMyProfile)
   26 | router.delete('/me', requireAuth, deleteMyAccount)
   27 | router.get('/search', requireAuth, searchUsersController)
   28 | router.get('/verified/early', requireAuth, listEarlyVerifiedFactoriesController)
   29 | router.post('/lookup', requireAuth, lookupUsers)
   30 | router.post('/:userId/follow', requireAuth, followUserController)
   31 | router.post('/:userId/friend-request', requireAuth, friendRequestController)
   32 | 
   33 | router.get('/', requireAuth, requireAdminSecurity, adminListUsers)
   34 | router.patch('/:userId', requireAuth, requireAdminSecurity, adminUpdateUser)
   35 | router.patch('/:userId/verify', requireAuth, requireAdminSecurity, adminVerifyUser)
   36 | router.post('/:userId/reset-password', requireAuth, requireAdminSecurity, adminResetPassword)
   37 | router.post('/:userId/force-logout', requireAuth, requireAdminSecurity, adminForceLogout)
   38 | router.post('/:userId/lock-messaging', requireAuth, requireAdminSecurity, adminLockMessaging)
   39 | router.delete('/:userId', requireAuth, requireAdminSecurity, adminDeleteUser)
   40 | 
   41 | export default router
   42 | 