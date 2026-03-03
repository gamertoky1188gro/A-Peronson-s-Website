import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { completeMilestone, getProfileRatings, getProfileRatingsBatch, submitRating } from '../controllers/ratingsController.js'

const router = Router()

router.get('/profiles/:profileKey', getProfileRatings)
router.get('/profiles', getProfileRatingsBatch)
router.post('/profiles/:profileKey', requireAuth, submitRating)
router.post('/milestones', requireAuth, completeMilestone)

export default router
