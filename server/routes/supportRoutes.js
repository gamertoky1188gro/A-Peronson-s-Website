import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createSupportReport } from '../controllers/supportController.js'

const router = Router()

router.post('/reports', requireAuth, createSupportReport)

export default router
