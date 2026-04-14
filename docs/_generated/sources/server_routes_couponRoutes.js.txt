    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { requireAdminSecurity } from '../middleware/adminSecurity.js'
    4 | import { createCoupon, listCoupons } from '../controllers/couponController.js'
    5 | 
    6 | const router = Router()
    7 | 
    8 | router.get('/', requireAuth, requireAdminSecurity, listCoupons)
    9 | router.post('/', requireAuth, requireAdminSecurity, createCoupon)
   10 | 
   11 | export default router
   12 | 