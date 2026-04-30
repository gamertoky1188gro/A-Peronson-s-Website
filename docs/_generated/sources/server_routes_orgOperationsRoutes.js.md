    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   getLegacyOperationsPolicies,
    5 |   getOperationsPolicies,
    6 |   getOperationsEscalations,
    7 |   getOperationsQueue,
    8 |   getOperationsWorkload,
    9 |   postOperationsEscalate,
   10 |   postOperationsRebalance,
   11 |   postResolveEscalation,
   12 |   putLegacyOperationsPolicies,
   13 |   putOperationsPolicies,
   14 | } from '../controllers/orgOperationsController.js'
   15 | 
   16 | const router = Router()
   17 | 
   18 | router.use(requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'))
   19 | 
   20 | router.get('/policies', getOperationsPolicies)
   21 | router.put('/policies', putOperationsPolicies)
   22 | router.get('/legacy-policies', getLegacyOperationsPolicies)
   23 | router.put('/legacy-policies', putLegacyOperationsPolicies)
   24 | router.get('/queue', getOperationsQueue)
   25 | router.post('/rebalance', postOperationsRebalance)
   26 | router.post('/escalate/:leadId', postOperationsEscalate)
   27 | router.get('/escalations', getOperationsEscalations)
   28 | router.post('/escalations/:leadId/resolve', postResolveEscalation)
   29 | router.get('/workload', getOperationsWorkload)
   30 | 
   31 | export default router
   32 | 