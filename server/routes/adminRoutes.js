import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { auditMatches, conversionMetrics } from '../controllers/adminController.js'

const router = Router()

router.get('/matches/audit', requireAuth, allowRoles('admin'), auditMatches)
router.get('/metrics', requireAuth, allowRoles('admin'), conversionMetrics)

export default router
