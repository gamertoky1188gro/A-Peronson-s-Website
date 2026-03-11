import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getPresence } from '../controllers/presenceController.js'

const router = Router()

router.post('/', requireAuth, getPresence)

export default router
