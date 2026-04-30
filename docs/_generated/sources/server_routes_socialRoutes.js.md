    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { createAction, createComment, createReport, createShare, getEntityInteractions } from '../controllers/socialController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.post('/actions', requireAuth, createAction)
    8 | router.get('/:entityType/:entityId', requireAuth, getEntityInteractions)
    9 | router.post('/:entityType/:entityId/comment', requireAuth, createComment)
   10 | router.post('/:entityType/:entityId/share', requireAuth, createShare)
   11 | router.post('/:entityType/:entityId/report', requireAuth, createReport)
   12 | 
   13 | export default router
   14 | 