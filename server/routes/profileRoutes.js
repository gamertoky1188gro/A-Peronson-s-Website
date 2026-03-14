import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getProfile, getProfilePartnerNetwork, getProfileProducts, getProfileRequests } from '../controllers/profileController.js'

const router = Router()

router.get('/:userId', requireAuth, getProfile)
router.get('/:userId/requests', requireAuth, getProfileRequests)
router.get('/:userId/products', requireAuth, getProfileProducts)
router.get('/:userId/partner-network', requireAuth, getProfilePartnerNetwork)

export default router

