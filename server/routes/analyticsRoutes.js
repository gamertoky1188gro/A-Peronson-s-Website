import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { analyticsSummary } from '../controllers/analyticsController.js'

const router = Router()
router.get('/summary', requireAuth, allowRoles('admin', 'buying_house', 'factory', 'buyer'), analyticsSummary)
export default router
