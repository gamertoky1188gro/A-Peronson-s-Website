    1 | import { Router } from 'express'
    2 | import { optionalAuth } from '../middleware/auth.js'
    3 | import { postEvent } from '../controllers/eventController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | // Public+protected event sink:
    8 | // - Anonymous visitors can send events using `client_id` (generated client-side).
    9 | // - Authenticated users will be tracked by `req.user.id`.
   10 | router.post('/', optionalAuth, postEvent)
   11 | 
   12 | export default router
   13 | 
   14 | 