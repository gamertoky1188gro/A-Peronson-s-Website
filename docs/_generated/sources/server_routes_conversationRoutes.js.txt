    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import { claim, grant, requestAccess, transfer } from '../controllers/conversationController.js'
    4 | 
    5 | const router = Router()
    6 | router.post('/:requestId/claim', requireAuth, allowRoles('buying_house', 'admin', 'agent'), claim)
    7 | router.post('/:requestId/grant', requireAuth, allowRoles('buying_house', 'factory', 'admin', 'owner', 'agent'), grant)
    8 | router.post('/:requestId/request-access', requireAuth, allowRoles('buying_house', 'factory', 'admin', 'owner', 'agent'), requestAccess)
    9 | router.post('/:requestId/transfer', requireAuth, allowRoles('buying_house', 'factory', 'admin', 'owner', 'agent'), transfer)
   10 | export default router
   11 | 