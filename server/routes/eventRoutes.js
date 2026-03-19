import { Router } from 'express'
import { optionalAuth } from '../middleware/auth.js'
import { postEvent } from '../controllers/eventController.js'

const router = Router()

// Public+protected event sink:
// - Anonymous visitors can send events using `client_id` (generated client-side).
// - Authenticated users will be tracked by `req.user.id`.
router.post('/', optionalAuth, postEvent)

export default router

