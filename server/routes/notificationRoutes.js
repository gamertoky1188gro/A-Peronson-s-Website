import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createSearchAlert, getNotifications, getSearchAlerts, readNotification } from '../controllers/notificationController.js'

const router = Router()

router.get('/', requireAuth, getNotifications)
router.patch('/:notificationId/read', requireAuth, readNotification)
router.get('/search-alerts', requireAuth, getSearchAlerts)
router.post('/search-alerts', requireAuth, createSearchAlert)

export default router
