import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  acceptPartnerRequest,
  cancelPartnerRequest,
  createPartnerRequest,
  listPartnerNetwork,
  rejectPartnerRequest,
} from '../controllers/partnerNetworkController.js'

const router = Router()

router.get('/', requireAuth, listPartnerNetwork)
router.post('/requests', requireAuth, createPartnerRequest)
router.post('/requests/:requestId/accept', requireAuth, acceptPartnerRequest)
router.post('/requests/:requestId/reject', requireAuth, rejectPartnerRequest)
router.post('/requests/:requestId/cancel', requireAuth, cancelPartnerRequest)

export default router
