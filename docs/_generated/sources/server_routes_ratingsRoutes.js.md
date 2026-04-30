    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   completeMilestone,
    5 |   getFeedbackRequests,
    6 |   getProfileRatings,
    7 |   getProfileRatingsAggregate,
    8 |   getProfileRatingsBatch,
    9 |   getSearchRatings,
   10 |   submitRating,
   11 |   editRating,
   12 |   removeRating,
   13 | } from '../controllers/ratingsController.js'
   14 | 
   15 | const router = Router()
   16 | 
   17 | router.get('/profiles/:profileKey', getProfileRatings)
   18 | router.get('/profiles/:profileKey/aggregate', getProfileRatingsAggregate)
   19 | router.get('/profiles', getProfileRatingsBatch)
   20 | router.get('/search', getSearchRatings)
   21 | router.get('/feedback-requests', requireAuth, getFeedbackRequests)
   22 | router.post('/profiles/:profileKey', requireAuth, submitRating)
   23 | router.post('/milestones', requireAuth, completeMilestone)
   24 | router.patch('/:id', requireAuth, editRating)
   25 | router.delete('/:id', requireAuth, removeRating)
   26 | 
   27 | export default router
   28 | 