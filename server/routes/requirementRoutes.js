import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import {
  adminDeleteRequirement,
  closeBuyerRequirement,
  createBuyerRequirement,
  getRequirementMatches,
  getRequirements,
  patchMatchStatus,
} from '../controllers/requirementController.js'

const router = Router()

router.post('/', requireAuth, allowRoles('buyer'), createBuyerRequirement)
router.get('/', requireAuth, getRequirements)
router.post('/:requirementId/close', requireAuth, allowRoles('buyer', 'admin'), closeBuyerRequirement)
router.get('/:requirementId/matches', requireAuth, getRequirementMatches)
router.patch('/:requirementId/matches/:factoryId/status', requireAuth, allowRoles('buyer', 'factory', 'admin'), patchMatchStatus)
router.delete('/:requirementId', requireAuth, allowRoles('admin'), adminDeleteRequirement)

export default router
