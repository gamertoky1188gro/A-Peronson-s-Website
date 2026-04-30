    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import validateFiltersMiddleware from '../middleware/validateSearchFilters.js'
    4 | import { browseRequirements, createBuyerRequirement, deleteRequirement, getRequirement, getRequirements, patchRequirement, searchRequirements, getSmartMatches } from '../controllers/requirementController.js'
    5 | 
    6 | const router = Router()
    7 | 
    8 | router.post('/', requireAuth, allowRoles('buyer'), createBuyerRequirement)
    9 | router.get('/', requireAuth, getRequirements)
   10 | // Buyers can browse other buyer requests only in a redacted/summary format.
   11 | router.get('/browse', requireAuth, allowRoles('buyer'), browseRequirements)
   12 | router.get('/search', requireAuth, validateFiltersMiddleware, searchRequirements)
   13 | router.get('/:requirementId/matches', requireAuth, getSmartMatches)
   14 | router.get('/:requirementId', requireAuth, getRequirement)
   15 | router.patch('/:requirementId', requireAuth, allowRoles('buyer', 'admin', 'owner', 'buying_house'), patchRequirement)
   16 | router.delete('/:requirementId', requireAuth, allowRoles('buyer', 'admin'), deleteRequirement)
   17 | 
   18 | export default router
   19 | 