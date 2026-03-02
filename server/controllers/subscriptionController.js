import { findUserById } from '../services/userService.js'
import { getSubscription, upsertSubscription } from '../services/subscriptionService.js'

export async function getMySubscription(req, res) {
  const sub = await getSubscription(req.user.id)
  return res.json(sub || { user_id: req.user.id, plan: 'free', start_date: '', end_date: '', auto_renew: true })
}

export async function updateMySubscription(req, res) {
  const plan = req.body?.plan === 'premium' ? 'premium' : 'free'
  const sub = await upsertSubscription(req.user.id, plan, req.body?.auto_renew)
  return res.json(sub)
}

export async function adminSetUserSubscription(req, res) {
  const user = await findUserById(req.params.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const plan = req.body?.plan === 'premium' ? 'premium' : 'free'
  const sub = await upsertSubscription(user.id, plan, req.body?.auto_renew)
  return res.json(sub)
}
