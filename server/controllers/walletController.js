import { getWallet, listWalletHistory, redeemCouponForUser } from '../services/walletService.js'

export async function getMyWallet(req, res) {
  const wallet = await getWallet(req.user.id)
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' })
  return res.json(wallet)
}

export async function getMyWalletHistory(req, res) {
  const limit = req.query?.limit || 50
  const items = await listWalletHistory(req.user.id, limit)
  return res.json({ items })
}

export async function redeemCoupon(req, res) {
  const code = String(req.body?.code || '').trim()
  if (!code) return res.status(400).json({ error: 'Coupon code is required' })
  try {
    const result = await redeemCouponForUser({ userId: req.user.id, code })
    return res.json(result)
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message || 'Unable to redeem coupon' })
  }
}
