import { Router } from 'express'
import {
  login,
  logout,
  me,
  passkeyList,
  passkeyLoginOptions,
  passkeyLoginVerify,
  passkeyRegistrationOptions,
  passkeyRegistrationVerify,
  passkeyRemove,
  register,
} from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/passkey/login/options', passkeyLoginOptions)
router.post('/passkey/login/verify', passkeyLoginVerify)
router.post('/passkey/registration/options', requireAuth, passkeyRegistrationOptions)
router.post('/passkey/registration/verify', requireAuth, passkeyRegistrationVerify)
router.get('/passkeys', requireAuth, passkeyList)
router.delete('/passkeys/:credentialId', requireAuth, passkeyRemove)
router.get('/me', requireAuth, me)
router.post('/logout', requireAuth, logout)

export default router
