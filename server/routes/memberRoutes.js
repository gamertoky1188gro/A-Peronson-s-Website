import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import {
  createOrgMember,
  deactivateOrRemoveOrgMember,
  listOrgMembers,
  patchMemberPermissions,
  postMemberPasswordReset,
} from '../controllers/memberController.js'

const router = Router()

router.get('/', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), listOrgMembers)
router.post('/', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), createOrgMember)
router.patch('/:memberId/permissions', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), patchMemberPermissions)
router.post('/:memberId/reset-password', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), postMemberPasswordReset)
router.delete('/:memberId', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), deactivateOrRemoveOrgMember)

export default router
