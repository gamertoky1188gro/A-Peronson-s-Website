import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { claim, grant, requestAccess } from '../controllers/conversationController.js'

const router = Router()
router.post('/:requestId/claim', requireAuth, allowRoles('buying_house', 'admin', 'agent'), claim)
router.post('/:requestId/grant', requireAuth, allowRoles('buying_house', 'admin', 'agent'), grant)
router.post('/:requestId/request-access', requireAuth, allowRoles('buying_house', 'admin', 'agent'), requestAccess)
export default router
