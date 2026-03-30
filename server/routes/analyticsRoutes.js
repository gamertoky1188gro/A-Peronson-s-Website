import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { analyticsCompany, analyticsDashboard, analyticsPlatform, analyticsPremium, analyticsSummary, analyticsViewers } from '../controllers/analyticsController.js'

const router = Router()

router.get('/summary', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsSummary)
router.get('/dashboard', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsDashboard)
router.get('/company', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), analyticsCompany)
router.get('/platform', requireAuth, allowRoles('owner', 'admin'), analyticsPlatform)
router.get('/premium', requireAuth, allowRoles('owner', 'admin', 'buyer', 'factory', 'buying_house', 'agent'), analyticsPremium)
router.get('/viewers', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), analyticsViewers)

export default router
