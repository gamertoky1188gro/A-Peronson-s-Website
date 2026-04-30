    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   createSupportReport,
    5 |   createSupportTicketController,
    6 |   listMySupportTicketsController,
    7 |   listSupportTicketMessagesController,
    8 |   postSupportTicketMessageController,
    9 | } from '../controllers/supportController.js'
   10 | 
   11 | const router = Router()
   12 | 
   13 | router.post('/reports', requireAuth, createSupportReport)
   14 | router.get('/tickets', requireAuth, listMySupportTicketsController)
   15 | router.post('/tickets', requireAuth, createSupportTicketController)
   16 | router.get('/tickets/:ticketId/messages', requireAuth, listSupportTicketMessagesController)
   17 | router.post('/tickets/:ticketId/messages', requireAuth, postSupportTicketMessageController)
   18 | 
   19 | export default router
   20 | 