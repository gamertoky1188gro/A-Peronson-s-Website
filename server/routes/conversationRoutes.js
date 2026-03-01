import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { claim, grant } from '../controllers/conversationController.js'

const router = Router()
router.post('/:requestId/claim', requireAuth, allowRoles('buying_house', 'admin'), claim)
router.post('/:requestId/grant', requireAuth, allowRoles('buying_house', 'admin'), grant)
export default router
