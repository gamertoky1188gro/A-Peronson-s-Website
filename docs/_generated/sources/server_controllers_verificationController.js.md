    1 | import { findUserById, setUserVerification } from '../services/userService.js'
    2 | import {
    3 |   adminApproveVerification,
    4 |   adminRejectVerification,
    5 |   extendVerificationSubscription,
    6 |   getVerification,
    7 |   listVerificationQueue,
    8 |   revokeExpiredVerifications,
    9 |   upsertVerification,
   10 | } from '../services/verificationService.js'
   11 | import { debitWallet } from '../services/walletService.js'
   12 | import { createNotification } from '../services/notificationService.js'
   13 | 
   14 | export async function getMyVerification(req, res) {
   15 |   const rec = await getVerification(req.user.id)
   16 |   return res.json(rec || { user_id: req.user.id, verified: false, missing_required: [] })
   17 | }
   18 | 
   19 | export async function submitMyVerification(req, res) {
   20 |   const user = await findUserById(req.user.id)
   21 |   if (!user) return res.status(404).json({ error: 'User not found' })
   22 | 
   23 |   try {
   24 |     const rec = await upsertVerification(user, req.body?.documents || {})
   25 |     return res.json(rec)
   26 |   } catch (error) {
   27 |     const status = Number(error?.statusCode) || 400
   28 |     return res.status(status).json({ error: error?.message || 'Verification data is invalid' })
   29 |   }
   30 | }
   31 | 
   32 | export async function adminApprove(req, res) {
   33 |   const rec = await adminApproveVerification(req.params.userId)
   34 |   if (!rec) return res.status(404).json({ error: 'Verification record not found' })
   35 |   await setUserVerification(req.params.userId, rec.verified)
   36 |   if (rec.verified) {
   37 |     await createNotification(req.params.userId, {
   38 |       type: 'verification_approved',
   39 |       entity_type: 'verification',
   40 |       entity_id: req.params.userId,
   41 |       message: 'Your verification has been approved. Your profile is now verified.',
   42 |       meta: { review_status: rec.review_status || 'approved' },
   43 |     })
   44 |   }
   45 |   return res.json(rec)
   46 | }
   47 | 
   48 | export async function adminReject(req, res) {
   49 |   const reason = req.body?.reason || 'Rejected by admin'
   50 |   const rec = await adminRejectVerification(req.params.userId, reason)
   51 |   if (!rec) return res.status(404).json({ error: 'Verification record not found' })
   52 |   await setUserVerification(req.params.userId, false)
   53 |   await createNotification(req.params.userId, {
   54 |     type: 'verification_rejected',
   55 |     entity_type: 'verification',
   56 |     entity_id: req.params.userId,
   57 |     message: `Verification was rejected. Reason: ${reason}`,
   58 |     meta: { review_status: rec.review_status || 'rejected', reason },
   59 |   })
   60 |   return res.json(rec)
   61 | }
   62 | 
   63 | export async function adminQueue(req, res) {
   64 |   const status = req.query.status || ''
   65 |   const rows = await listVerificationQueue({ status })
   66 |   return res.json({ items: rows })
   67 | }
   68 | 
   69 | export async function adminRevokeExpired(req, res) {
   70 |   const updated = await revokeExpiredVerifications()
   71 |   return res.json({ ok: true, total: updated.length })
   72 | }
   73 | 
   74 | export async function renewMyVerification(req, res) {
   75 |   // project.md: verification is subscription-based and renewed monthly.
   76 |   // MVP: wallet-only renewal (no payment gateway yet).
   77 |   const FIRST_MONTH_PRICE_USD = 1.99
   78 |   const RENEWAL_PRICE_USD = 6.99
   79 | 
   80 |   const existing = await getVerification(req.user.id)
   81 |   const user = await findUserById(req.user.id)
   82 |   const freeUntilRaw = user?.profile?.verification_free_until
   83 |   const freeUntil = freeUntilRaw ? new Date(freeUntilRaw) : null
   84 |   const hasFreeWindow = freeUntil && Number.isFinite(freeUntil.getTime()) && freeUntil.getTime() > Date.now()
   85 |   const isFirstTime = !existing?.subscription_valid_until
   86 |   const priceUsd = hasFreeWindow ? 0 : (isFirstTime ? FIRST_MONTH_PRICE_USD : RENEWAL_PRICE_USD)
   87 | 
   88 |   let charge = null
   89 |   if (priceUsd > 0) {
   90 |     charge = await debitWallet({
   91 |       userId: req.user.id,
   92 |       amountUsd: priceUsd,
   93 |       reason: 'verification_renewal',
   94 |       ref: `verification:${req.user.id}`,
   95 |       allowRestricted: true,
   96 |     })
   97 |   }
   98 | 
   99 |   const verification = await extendVerificationSubscription(req.user.id, 30)
  100 |   return res.json({
  101 |     ok: true,
  102 |     price_usd: priceUsd,
  103 |     free_until: hasFreeWindow ? freeUntil.toISOString() : null,
  104 |     wallet: charge?.wallet || null,
  105 |     wallet_entry: charge?.entry || null,
  106 |     verification,
  107 |   })
  108 | }
  109 | 