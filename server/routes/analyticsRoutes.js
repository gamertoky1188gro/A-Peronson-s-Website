import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { analyticsCompany, analyticsDashboard, analyticsPlatform, analyticsSummary } from '../controllers/analyticsController.js'

const router = Router()

router.get('/summary', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsSummary)
router.get('/dashboard', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), analyticsDashboard)
router.get('/company', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), analyticsCompany)
router.get('/platform', requireAuth, allowRoles('owner', 'admin'), analyticsPlatform)

export default router
