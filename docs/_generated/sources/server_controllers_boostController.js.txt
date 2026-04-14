    1 | import { cancelBoost, listBoostsForUser, purchaseBoost } from '../services/boostService.js'
    2 | import { handleControllerError } from '../utils/permissions.js'
    3 | import { ensureEntitlement } from '../services/entitlementService.js'
    4 | 
    5 | export async function getMyBoosts(req, res) {
    6 |   const items = await listBoostsForUser(req.user.id)
    7 |   return res.json({ items })
    8 | }
    9 | 
   10 | export async function createBoost(req, res) {
   11 |   try {
   12 |     const scope = String(req.body?.scope || '').toLowerCase()
   13 |     const feature = scope === 'profile' ? 'profile_boost' : 'product_boost'
   14 |     await ensureEntitlement(req.user, feature, 'Premium boost requires an active subscription.')
   15 |     const result = await purchaseBoost(req.user.id, req.body || {})
   16 |     if (result === 'active_exists') {
   17 |       return res.status(409).json({ error: 'An active boost already exists for this scope.' })
   18 |     }
   19 |     return res.status(201).json(result)
   20 |   } catch (error) {
   21 |     return handleControllerError(res, error)
   22 |   }
   23 | }
   24 | 
   25 | export async function cancelBoostController(req, res) {
   26 |   const result = await cancelBoost(req.user.id, req.params.boostId)
   27 |   if (!result) return res.status(404).json({ error: 'Boost not found' })
   28 |   if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   29 |   return res.json(result)
   30 | }
   31 | 