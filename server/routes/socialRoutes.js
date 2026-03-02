import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createComment, createReport, createShare, getEntityInteractions } from '../controllers/socialController.js'

const router = Router()

router.get('/:entityType/:entityId', requireAuth, getEntityInteractions)
router.post('/:entityType/:entityId/comment', requireAuth, createComment)
router.post('/:entityType/:entityId/share', requireAuth, createShare)
router.post('/:entityType/:entityId/report', requireAuth, createReport)

export default router
