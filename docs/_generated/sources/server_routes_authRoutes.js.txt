    1 | import { Router } from 'express'
    2 | import {
    3 |   login,
    4 |   logout,
    5 |   me,
    6 |   passkeyList,
    7 |   passkeyLoginOptions,
    8 |   passkeyLoginVerify,
    9 |   passkeyRegistrationOptions,
   10 |   passkeyRegistrationVerify,
   11 |   passkeyRemove,
   12 |   register,
   13 | } from '../controllers/authController.js'
   14 | import { requireAuth } from '../middleware/auth.js'
   15 | 
   16 | const router = Router()
   17 | 
   18 | router.post('/register', register)
   19 | router.post('/login', login)
   20 | router.post('/passkey/login/options', passkeyLoginOptions)
   21 | router.post('/passkey/login/verify', passkeyLoginVerify)
   22 | router.post('/passkey/registration/options', requireAuth, passkeyRegistrationOptions)
   23 | router.post('/passkey/registration/verify', requireAuth, passkeyRegistrationVerify)
   24 | router.get('/passkeys', requireAuth, passkeyList)
   25 | router.delete('/passkeys/:credentialId', requireAuth, passkeyRemove)
   26 | router.get('/me', requireAuth, me)
   27 | router.post('/logout', requireAuth, logout)
   28 | 
   29 | export default router
   30 | 