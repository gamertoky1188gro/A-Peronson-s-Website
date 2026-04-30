    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   createJourneyEvent,
    5 |   getJourney,
    6 |   getJourneyByContext,
    7 |   rollbackJourney,
    8 | } from '../controllers/dealJourneyController.js'
    9 | 
   10 | const router = Router()
   11 | 
   12 | router.get('/context', requireAuth, getJourneyByContext)
   13 | router.get('/:journeyId', requireAuth, getJourney)
   14 | router.post('/events', requireAuth, createJourneyEvent)
   15 | router.post('/:journeyId/rollback', requireAuth, rollbackJourney)
   16 | 
   17 | export default router
   18 | 