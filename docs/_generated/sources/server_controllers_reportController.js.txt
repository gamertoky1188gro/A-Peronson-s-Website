    1 | import { createReport } from '../services/reportService.js'
    2 | import { readJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | function isOwnerOrAdmin(user) {
    6 |   return ['owner', 'admin'].includes(String(user?.role || '').toLowerCase())
    7 | }
    8 | 
    9 | function canAppealProduct(actor, product) {
   10 |   if (!actor || !product) return false
   11 |   if (isOwnerOrAdmin(actor)) return true
   12 |   if (String(product.company_id || '') === String(actor.id || '')) return true
   13 |   if (String(actor.role || '').toLowerCase() === 'agent' && String(actor.org_owner_id || '') === String(product.company_id || '')) return true
   14 |   return false
   15 | }
   16 | 
   17 | export async function createSystemReportController(req, res) {
   18 |   const reason = sanitizeString(String(req.body?.reason || ''), 400)
   19 |   if (!reason) return res.status(400).json({ error: 'reason is required' })
   20 |   const row = await createReport({
   21 |     actor: req.user,
   22 |     entity_type: 'system_report',
   23 |     entity_id: sanitizeString(String(req.body?.page || 'system'), 160),
   24 |     reason,
   25 |     metadata: { category: sanitizeString(String(req.body?.category || 'system'), 80) },
   26 |   })
   27 |   return res.status(201).json(row)
   28 | }
   29 | 
   30 | export async function createProductAppealReportController(req, res) {
   31 |   const productId = sanitizeString(String(req.body?.product_id || ''), 120)
   32 |   const reason = sanitizeString(String(req.body?.reason || ''), 400)
   33 |   if (!productId || !reason) return res.status(400).json({ error: 'product_id and reason are required' })
   34 | 
   35 |   const products = await readJson('company_products.json')
   36 |   const product = (Array.isArray(products) ? products : []).find((p) => String(p.id) === String(productId))
   37 |   if (!product) return res.status(404).json({ error: 'Product not found' })
   38 |   if (!canAppealProduct(req.user, product)) return res.status(403).json({ error: 'Forbidden' })
   39 | 
   40 |   const row = await createReport({
   41 |     actor: req.user,
   42 |     entity_type: 'product_appeal',
   43 |     entity_id: productId,
   44 |     reason,
   45 |     metadata: { product_title: product.title || '', review_status: product.content_review_status || '' },
   46 |   })
   47 |   return res.status(201).json(row)
   48 | }
   49 | 
   50 | export async function createContentReportController(req, res) {
   51 |   const targetType = sanitizeString(String(req.body?.entity_type || ''), 80)
   52 |   const targetId = sanitizeString(String(req.body?.entity_id || ''), 160)
   53 |   const reason = sanitizeString(String(req.body?.reason || ''), 400)
   54 |   if (!targetType || !targetId || !reason) return res.status(400).json({ error: 'entity_type, entity_id, and reason are required' })
   55 | 
   56 |   const row = await createReport({
   57 |     actor: req.user,
   58 |     entity_type: 'content_report',
   59 |     entity_id: `${targetType}:${targetId}`,
   60 |     reason,
   61 |     metadata: { target_entity_type: targetType, target_entity_id: targetId },
   62 |   })
   63 |   return res.status(201).json(row)
   64 | }
   65 | 