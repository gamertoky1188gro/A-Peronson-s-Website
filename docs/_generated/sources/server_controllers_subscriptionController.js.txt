    1 | import { findUserById } from '../services/userService.js'
    2 | import { markVerificationExpiringSoon } from '../services/verificationService.js'
    3 | import { getRemainingDays, getSubscription, renewPremiumMonthly, upsertSubscription } from '../services/subscriptionService.js'
    4 | import { debitWallet } from '../services/walletService.js'
    5 | 
    6 | export async function getMySubscription(req, res) {
    7 |   const sub = await getSubscription(req.user.id)
    8 |   return res.json(sub || { user_id: req.user.id, plan: 'free', start_date: '', end_date: '', auto_renew: true })
    9 | }
   10 | 
   11 | export async function updateMySubscription(req, res) {
   12 |   const plan = req.body?.plan === 'premium' ? 'premium' : 'free'
   13 |   const sub = await upsertSubscription(req.user.id, plan, req.body?.auto_renew, {
   14 |     actor_id: req.user.id,
   15 |     source: 'user_request',
   16 |     note: 'self_service',
   17 |   })
   18 |   return res.json(sub)
   19 | }
   20 | 
   21 | export async function adminSetUserSubscription(req, res) {
   22 |   const user = await findUserById(req.params.userId)
   23 |   if (!user) return res.status(404).json({ error: 'User not found' })
   24 |   const plan = req.body?.plan === 'premium' ? 'premium' : 'free'
   25 |   const sub = await upsertSubscription(user.id, plan, req.body?.auto_renew, {
   26 |     actor_id: req.user.id,
   27 |     source: 'admin_request',
   28 |     note: 'subscription_override',
   29 |   })
   30 |   return res.json(sub)
   31 | }
   32 | 
   33 | 
   34 | export async function renewMyPremiumMonthly(req, res) {
   35 |   const FIRST_MONTH_PRICE_USD = 1.99
   36 |   const RENEWAL_PRICE_USD = 6.99
   37 | 
   38 |   const existing = await getSubscription(req.user.id)
   39 |   const isFirstTime = !existing || String(existing.plan || '').toLowerCase() !== 'premium'
   40 |   const priceUsd = isFirstTime ? FIRST_MONTH_PRICE_USD : RENEWAL_PRICE_USD
   41 | 
   42 |   try {
   43 |     const charge = await debitWallet({
   44 |       userId: req.user.id,
   45 |       amountUsd: priceUsd,
   46 |       reason: 'subscription_renewal',
   47 |       ref: `subscription:${req.user.id}`,
   48 |       allowRestricted: true,
   49 |     })
   50 |     const sub = await renewPremiumMonthly(req.user.id, req.body?.auto_renew)
   51 |     return res.json({ ...sub, price_usd: priceUsd, wallet: charge.wallet, wallet_entry: charge.entry })
   52 |   } catch (error) {
   53 |     return res.status(error.status || 400).json({ error: error.message || 'Unable to renew subscription' })
   54 |   }
   55 | }
   56 | 
   57 | export async function getMyRemainingDays(req, res) {
   58 |   const remaining_days = await getRemainingDays(req.user.id)
   59 |   return res.json({ user_id: req.user.id, remaining_days })
   60 | }
   61 | 
   62 | export async function markMyVerificationExpiringSoon(req, res) {
   63 |   const remainingDays = await getRemainingDays(req.user.id)
   64 |   const rec = await markVerificationExpiringSoon(req.user.id, remainingDays, req.body?.threshold_days || 7)
   65 |   if (!rec) return res.status(404).json({ error: 'Verification record not found' })
   66 |   return res.json(rec)
   67 | }
   68 | 