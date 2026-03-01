import { readJson, writeJson } from '../utils/jsonStore.js'

const FILE = 'subscriptions.json'

function nowIso() {
  return new Date().toISOString()
}

function plusDays(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export async function getSubscription(userId) {
  const subs = await readJson(FILE)
  return subs.find((s) => s.user_id === userId) || null
}

export async function upsertSubscription(userId, plan = 'free', autoRenew = true) {
  const subs = await readJson(FILE)
  const idx = subs.findIndex((s) => s.user_id === userId)
  const start = nowIso()
  const end = plan === 'premium' ? plusDays(30) : plusDays(3650)
  const next = { user_id: userId, plan, start_date: start, end_date: end, auto_renew: Boolean(autoRenew) }

  if (idx >= 0) subs[idx] = { ...subs[idx], ...next }
  else subs.push(next)

  await writeJson(FILE, subs)
  return next
}

export async function isSubscriptionValid(userId) {
  const sub = await getSubscription(userId)
  if (!sub) return false
  return new Date(sub.end_date).getTime() > Date.now()
}
