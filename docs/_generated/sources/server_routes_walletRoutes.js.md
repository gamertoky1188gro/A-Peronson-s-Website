    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { getMyWallet, getMyWalletHistory, redeemCoupon } from '../controllers/walletController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.get('/me', requireAuth, getMyWallet)
    8 | router.get('/me/history', requireAuth, getMyWalletHistory)
    9 | router.post('/redeem', requireAuth, redeemCoupon)
   10 | 
   11 | export default router
   12 | 