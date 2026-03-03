import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import {
  createOrgMember,
  deactivateOrRemoveOrgMember,
  listOrgMembers,
  patchMemberPermissions,
  postMemberPasswordReset,
  putOrgMember,
} from '../controllers/memberController.js'

const router = Router()

router.get('/', requireAuth, allowRoles('owner', 'admin'), listOrgMembers)
router.post('/', requireAuth, allowRoles('owner', 'admin'), createOrgMember)
router.put('/:memberId', requireAuth, allowRoles('owner', 'admin'), putOrgMember)
router.patch('/:memberId/permissions', requireAuth, allowRoles('owner', 'admin'), patchMemberPermissions)
router.post('/:memberId/reset-password', requireAuth, allowRoles('owner', 'admin'), postMemberPasswordReset)
router.delete('/:memberId', requireAuth, allowRoles('owner', 'admin'), deactivateOrRemoveOrgMember)

export default router
