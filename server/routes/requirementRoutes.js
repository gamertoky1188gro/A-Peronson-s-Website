import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { createBuyerRequirement, deleteRequirement, getRequirement, getRequirements, patchRequirement, searchRequirements } from '../controllers/requirementController.js'

const router = Router()

router.post('/', requireAuth, allowRoles('buyer'), createBuyerRequirement)
router.get('/', requireAuth, getRequirements)
router.get('/search', requireAuth, searchRequirements)
router.get('/:requirementId', requireAuth, getRequirement)
router.patch('/:requirementId', requireAuth, allowRoles('buyer', 'admin'), patchRequirement)
router.delete('/:requirementId', requireAuth, allowRoles('buyer', 'admin'), deleteRequirement)

export default router
