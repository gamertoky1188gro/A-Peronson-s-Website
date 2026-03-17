    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { createSearchAlert, deleteSearchAlert, getNotifications, getSearchAlerts, readNotification } from '../controllers/notificationController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.get('/', requireAuth, getNotifications)
    8 | router.patch('/:notificationId/read', requireAuth, readNotification)
    9 | router.get('/search-alerts', requireAuth, getSearchAlerts)
   10 | router.post('/search-alerts', requireAuth, createSearchAlert)
   11 | router.delete('/search-alerts/:alertId', requireAuth, deleteSearchAlert)
   12 | 
   13 | export default router
   14 | 