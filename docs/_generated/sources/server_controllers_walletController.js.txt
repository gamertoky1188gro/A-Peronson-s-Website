    1 | import { getWallet, listWalletHistory, redeemCouponForUser } from '../services/walletService.js'
    2 | 
    3 | export async function getMyWallet(req, res) {
    4 |   const wallet = await getWallet(req.user.id)
    5 |   if (!wallet) return res.status(404).json({ error: 'Wallet not found' })
    6 |   return res.json(wallet)
    7 | }
    8 | 
    9 | export async function getMyWalletHistory(req, res) {
   10 |   const limit = req.query?.limit || 50
   11 |   const items = await listWalletHistory(req.user.id, limit)
   12 |   return res.json({ items })
   13 | }
   14 | 
   15 | export async function redeemCoupon(req, res) {
   16 |   const code = String(req.body?.code || '').trim()
   17 |   if (!code) return res.status(400).json({ error: 'Coupon code is required' })
   18 |   try {
   19 |     const result = await redeemCouponForUser({ userId: req.user.id, code })
   20 |     return res.json(result)
   21 |   } catch (error) {
   22 |     return res.status(error.status || 400).json({ error: error.message || 'Unable to redeem coupon' })
   23 |   }
   24 | }
   25 | 