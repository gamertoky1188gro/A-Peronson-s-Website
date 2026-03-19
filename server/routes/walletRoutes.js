import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getMyWallet, getMyWalletHistory } from '../controllers/walletController.js'

const router = Router()

router.get('/me', requireAuth, getMyWallet)
router.get('/me/history', requireAuth, getMyWalletHistory)

export default router

