import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { crmProfileSummary } from '../controllers/crmController.js'

const router = Router()

router.get('/profile/:targetId', requireAuth, allowRoles('owner', 'admin', 'buyer', 'factory', 'buying_house', 'agent'), crmProfileSummary)

export default router
