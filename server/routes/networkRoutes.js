import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireAdminSecurity } from '../middleware/adminSecurity.js'
import { requireAdminStepUp } from '../middleware/adminStepUp.js'
import { adminAuditLogger } from '../middleware/adminAudit.js'
import { networkAction, networkInventory, networkOverview } from '../controllers/networkController.js'

const router = Router()

router.get('/overview', requireAuth, requireAdminSecurity, adminAuditLogger(), networkOverview)
router.get('/inventory', requireAuth, requireAdminSecurity, adminAuditLogger(), networkInventory)
router.post('/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger({
  actionResolver: (req) => String(req.body?.action || 'network.action'),
}), networkAction)

export default router

