    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { requireAdminSecurity } from '../middleware/adminSecurity.js'
    4 | import { requireAdminStepUp } from '../middleware/adminStepUp.js'
    5 | import { adminAuditLogger } from '../middleware/adminAudit.js'
    6 | import { networkAction, networkInventory, networkOverview } from '../controllers/networkController.js'
    7 | 
    8 | const router = Router()
    9 | 
   10 | router.get('/overview', requireAuth, requireAdminSecurity, adminAuditLogger(), networkOverview)
   11 | router.get('/inventory', requireAuth, requireAdminSecurity, adminAuditLogger(), networkInventory)
   12 | router.post('/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger({
   13 |   actionResolver: (req) => String(req.body?.action || 'network.action'),
   14 | }), networkAction)
   15 | 
   16 | export default router
   17 | 
   18 | 