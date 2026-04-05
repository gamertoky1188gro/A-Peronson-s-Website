import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import {
  getOperationsPolicies,
  getOperationsQueue,
  postOperationsEscalate,
  postOperationsRebalance,
  putOperationsPolicies,
} from '../controllers/orgOperationsController.js'

const router = Router()

router.use(requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'))

router.get('/policies', getOperationsPolicies)
router.put('/policies', putOperationsPolicies)
router.get('/queue', getOperationsQueue)
router.post('/rebalance', postOperationsRebalance)
router.post('/escalate/:leadId', postOperationsEscalate)

export default router
