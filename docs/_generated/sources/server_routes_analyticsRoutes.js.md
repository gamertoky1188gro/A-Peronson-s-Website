    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   analyticsCompany,
    5 |   analyticsDashboard,
    6 |   analyticsPlatformAdmin,
    7 |   analyticsPlatformSegment,
    8 |   analyticsPlatformSummary,
    9 |   analyticsPlatformOverview,
   10 |   analyticsPlatformTrends,
   11 |   analyticsPremium,
   12 |   analyticsSummary,
   13 |   analyticsViewers,
   14 | } from '../controllers/analyticsController.js'
   15 | 
   16 | const router = Router()
   17 | 
   18 | router.get('/summary', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsSummary)
   19 | router.get('/dashboard', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsDashboard)
   20 | router.get('/company', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), analyticsCompany)
   21 | router.get('/platform/overview', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsPlatformOverview)
   22 | router.get('/platform/trends', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsPlatformTrends)
   23 | router.get('/platform/summary', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsPlatformSummary)
   24 | router.get('/platform/segment', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsPlatformSegment)
   25 | router.get('/platform/admin', requireAuth, allowRoles('owner', 'admin'), analyticsPlatformAdmin)
   26 | router.get('/platform', requireAuth, allowRoles('owner', 'admin'), analyticsPlatformAdmin)
   27 | router.get('/premium', requireAuth, allowRoles('owner', 'admin', 'buyer', 'factory', 'buying_house', 'agent'), analyticsPremium)
   28 | router.get('/viewers', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), analyticsViewers)
   29 | 
   30 | export default router
   31 | 