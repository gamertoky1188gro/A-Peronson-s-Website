import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  createJourneyEvent,
  getJourney,
  getJourneyByContext,
  rollbackJourney,
} from '../controllers/dealJourneyController.js'

const router = Router()

router.get('/context', requireAuth, getJourneyByContext)
router.get('/:journeyId', requireAuth, getJourney)
router.post('/events', requireAuth, createJourneyEvent)
router.post('/:journeyId/rollback', requireAuth, rollbackJourney)

export default router
