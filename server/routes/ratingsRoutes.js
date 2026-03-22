import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  completeMilestone,
  getFeedbackRequests,
  getProfileRatings,
  getProfileRatingsAggregate,
  getProfileRatingsBatch,
  getSearchRatings,
  submitRating,
  editRating,
  removeRating,
} from '../controllers/ratingsController.js'

const router = Router()

router.get('/profiles/:profileKey', getProfileRatings)
router.get('/profiles/:profileKey/aggregate', getProfileRatingsAggregate)
router.get('/profiles', getProfileRatingsBatch)
router.get('/search', getSearchRatings)
router.get('/feedback-requests', requireAuth, getFeedbackRequests)
router.post('/profiles/:profileKey', requireAuth, submitRating)
router.post('/milestones', requireAuth, completeMilestone)
router.patch('/:id', requireAuth, editRating)
router.delete('/:id', requireAuth, removeRating)

export default router
