    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   createOrgMember,
    5 |   deactivateOrRemoveOrgMember,
    6 |   listOrgMembers,
    7 |   patchMemberPermissions,
    8 |   postMemberPasswordReset,
    9 |   putOrgMember,
   10 | } from '../controllers/memberController.js'
   11 | 
   12 | const router = Router()
   13 | 
   14 | router.get('/', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), listOrgMembers)
   15 | router.post('/', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), createOrgMember)
   16 | router.put('/:memberId', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), putOrgMember)
   17 | router.patch('/:memberId/permissions', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), patchMemberPermissions)
   18 | router.post('/:memberId/reset-password', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), postMemberPasswordReset)
   19 | router.delete('/:memberId', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory'), deactivateOrRemoveOrgMember)
   20 | 
   21 | export default router
   22 | 