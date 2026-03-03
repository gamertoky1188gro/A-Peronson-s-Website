import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { analyticsDashboard, analyticsSummary } from '../controllers/analyticsController.js'

const router = Router()

router.get('/summary', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsSummary)
router.get('/dashboard', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsDashboard)

export default router
