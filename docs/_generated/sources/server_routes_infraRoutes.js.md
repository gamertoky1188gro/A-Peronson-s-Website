    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { requireAdminSecurity } from '../middleware/adminSecurity.js'
    4 | import { requireAdminStepUp } from '../middleware/adminStepUp.js'
    5 | import { adminAuditLogger } from '../middleware/adminAudit.js'
    6 | import { infraAction, infraOverview, infraProcesses, infraServices, infraState, infraStorage } from '../controllers/infraController.js'
    7 | 
    8 | const router = Router()
    9 | 
   10 | router.get('/overview', requireAuth, requireAdminSecurity, adminAuditLogger(), infraOverview)
   11 | router.get('/processes', requireAuth, requireAdminSecurity, adminAuditLogger(), infraProcesses)
   12 | router.get('/services', requireAuth, requireAdminSecurity, adminAuditLogger(), infraServices)
   13 | router.get('/storage', requireAuth, requireAdminSecurity, adminAuditLogger(), infraStorage)
   14 | router.get('/state', requireAuth, requireAdminSecurity, adminAuditLogger(), infraState)
   15 | router.post('/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger({
   16 |   actionResolver: (req) => String(req.body?.action || 'infra.action'),
   17 | }), infraAction)
   18 | 
   19 | export default router
   20 | 