import { getWallet, listWalletHistory } from '../services/walletService.js'

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

