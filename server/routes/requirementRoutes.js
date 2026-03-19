import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { browseRequirements, createBuyerRequirement, deleteRequirement, getRequirement, getRequirements, patchRequirement, searchRequirements } from '../controllers/requirementController.js'

const router = Router()

router.post('/', requireAuth, allowRoles('buyer'), createBuyerRequirement)
router.get('/', requireAuth, getRequirements)
// Buyers can browse other buyer requests only in a redacted/summary format.
router.get('/browse', requireAuth, allowRoles('buyer'), browseRequirements)
router.get('/search', requireAuth, searchRequirements)
router.get('/:requirementId', requireAuth, getRequirement)
router.patch('/:requirementId', requireAuth, allowRoles('buyer', 'admin', 'owner', 'buying_house'), patchRequirement)
router.delete('/:requirementId', requireAuth, allowRoles('buyer', 'admin'), deleteRequirement)

export default router
