import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { combinedFeed } from '../controllers/feedController.js'

const router = Router()
router.get('/', requireAuth, combinedFeed)
export default router
