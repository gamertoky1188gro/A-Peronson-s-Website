    1 | import { readJson, writeJson } from '../utils/jsonStore.js'
    2 | import { recordSubscriptionEvent } from './subscriptionHistoryService.js'
    3 | 
    4 | const FILE = 'subscriptions.json'
    5 | 
    6 | function nowIso() {
    7 |   return new Date().toISOString()
    8 | }
    9 | 
   10 | function plusDays(days) {
   11 |   return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
   12 | }
   13 | 
   14 | function diffDaysFromNow(endDate) {
   15 |   const endTime = new Date(endDate || '').getTime()
   16 |   if (!Number.isFinite(endTime)) return 0
   17 |   const diffMs = endTime - Date.now()
   18 |   if (diffMs <= 0) return 0
   19 |   return Math.ceil(diffMs / (24 * 60 * 60 * 1000))
   20 | }
   21 | 
   22 | export async function getSubscription(userId) {
   23 |   const subs = await readJson(FILE)
   24 |   return subs.find((s) => s.user_id === userId) || null
   25 | }
   26 | 
   27 | export async function upsertSubscription(userId, plan = 'free', autoRenew = true, meta = {}) {
   28 |   const subs = await readJson(FILE)
   29 |   const idx = subs.findIndex((s) => s.user_id === userId)
   30 |   const previousPlan = idx >= 0 ? subs[idx]?.plan || '' : ''
   31 |   const start = nowIso()
   32 |   const end = plan === 'premium' ? plusDays(30) : plusDays(3650)
   33 |   const next = { user_id: userId, plan, start_date: start, end_date: end, auto_renew: Boolean(autoRenew) }
   34 | 
   35 |   if (idx >= 0) subs[idx] = { ...subs[idx], ...next }
   36 |   else subs.push(next)
   37 | 
   38 |   await writeJson(FILE, subs)
   39 |   const action = previousPlan && previousPlan !== plan
   40 |     ? (plan === 'premium' ? 'upgrade' : 'downgrade')
   41 |     : 'set'
   42 |   await recordSubscriptionEvent({
   43 |     userId,
   44 |     plan,
   45 |     previousPlan,
   46 |     action,
   47 |     actorId: meta?.actor_id || '',
   48 |     source: meta?.source || 'system',
   49 |     note: meta?.note || '',
   50 |   })
   51 |   return next
   52 | }
   53 | 
   54 | export async function renewPremiumMonthly(userId, autoRenew = true, meta = {}) {
   55 |   const subs = await readJson(FILE)
   56 |   const idx = subs.findIndex((s) => s.user_id === userId)
   57 |   const current = idx >= 0 ? subs[idx] : null
   58 |   const previousPlan = current?.plan || ''
   59 | 
   60 |   const currentEndTime = new Date(current?.end_date || '').getTime()
   61 |   const baseTime = Number.isFinite(currentEndTime) && currentEndTime > Date.now() ? currentEndTime : Date.now()
   62 |   const end = new Date(baseTime + (30 * 24 * 60 * 60 * 1000)).toISOString()
   63 |   const start = nowIso()
   64 | 
   65 |   const next = {
   66 |     user_id: userId,
   67 |     plan: 'premium',
   68 |     start_date: start,
   69 |     end_date: end,
   70 |     auto_renew: Boolean(autoRenew),
   71 |   }
   72 | 
   73 |   if (idx >= 0) subs[idx] = { ...current, ...next }
   74 |   else subs.push(next)
   75 | 
   76 |   await writeJson(FILE, subs)
   77 |   await recordSubscriptionEvent({
   78 |     userId,
   79 |     plan: 'premium',
   80 |     previousPlan,
   81 |     action: 'renew',
   82 |     actorId: meta?.actor_id || '',
   83 |     source: meta?.source || 'system',
   84 |     note: meta?.note || '',
   85 |   })
   86 |   return next
   87 | }
   88 | 
   89 | export async function getRemainingDays(userId) {
   90 |   const sub = await getSubscription(userId)
   91 |   if (!sub) return 0
   92 |   return diffDaysFromNow(sub.end_date)
   93 | }
   94 | 
   95 | export async function isSubscriptionValid(userId) {
   96 |   const sub = await getSubscription(userId)
   97 |   if (!sub) return false
   98 |   return diffDaysFromNow(sub.end_date) > 0
   99 | }
  100 | 