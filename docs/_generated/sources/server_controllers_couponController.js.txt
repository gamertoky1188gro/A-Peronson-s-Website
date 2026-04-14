    1 | import { createCouponCode, listCouponCodes } from '../services/walletService.js'
    2 | 
    3 | export async function listCoupons(req, res) {
    4 |   const rows = await listCouponCodes()
    5 |   return res.json({ items: rows })
    6 | }
    7 | 
    8 | export async function createCoupon(req, res) {
    9 |   try {
   10 |     const row = await createCouponCode({
   11 |       code: req.body?.code,
   12 |       amount_usd: req.body?.amount_usd,
   13 |       active: req.body?.active,
   14 |       max_redemptions: req.body?.max_redemptions,
   15 |       expires_at: req.body?.expires_at,
   16 |       marketing_source: req.body?.marketing_source,
   17 |       verification_free_months: req.body?.verification_free_months,
   18 |       requires_card: req.body?.requires_card,
   19 |       created_by: req.user?.id,
   20 |     })
   21 |     return res.status(201).json(row)
   22 |   } catch (error) {
   23 |     return res.status(error.status || 400).json({ error: error.message || 'Unable to create coupon' })
   24 |   }
   25 | }
   26 | 