    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   createJourney,
    5 |   getJourney,
    6 |   getJourneyByMatch,
    7 |   transitionJourney,
    8 | } from '../controllers/workflowLifecycleController.js'
    9 | 
   10 | const router = Router()
   11 | 
   12 | router.post('/journeys', requireAuth, createJourney)
   13 | router.post('/journeys/:id/transition', requireAuth, transitionJourney)
   14 | router.get('/journeys/:id', requireAuth, getJourney)
   15 | router.get('/journeys/by-match/:matchId', requireAuth, getJourneyByMatch)
   16 | 
   17 | export default router
   18 | 