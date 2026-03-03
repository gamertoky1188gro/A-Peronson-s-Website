import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { analyticsDashboard, analyticsSummary } from '../controllers/analyticsController.js'

const router = Router()

router.get('/summary', requireAuth, allowRoles('admin', 'buying_house', 'factory', 'buyer'), analyticsSummary)
router.get('/dashboard', requireAuth, allowRoles('admin', 'buying_house', 'factory', 'buyer'), analyticsDashboard)

export default router
