    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   createContentReportController,
    5 |   createProductAppealReportController,
    6 |   createSystemReportController,
    7 | } from '../controllers/reportController.js'
    8 | 
    9 | const router = Router()
   10 | 
   11 | router.post('/system', requireAuth, createSystemReportController)
   12 | router.post('/product-appeal', requireAuth, createProductAppealReportController)
   13 | router.post('/content', requireAuth, createContentReportController)
   14 | 
   15 | export default router
   16 | 