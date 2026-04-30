    1 | import { readJson, writeJson } from '../utils/jsonStore.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | import { createNotification } from '../services/notificationService.js'
    4 | import { getAdminConfig } from '../services/adminConfigService.js'
    5 | 
    6 | function resolveReviewStatus(status) {
    7 |   const normalized = String(status || 'approved').toLowerCase()
    8 |   if (['approved', 'pending_review', 'rejected'].includes(normalized)) return normalized
    9 |   return 'approved'
   10 | }
   11 | 
   12 | function publicUser(user) {
   13 |   if (!user) return null
   14 |   return {
   15 |     id: user.id,
   16 |     name: user.name || '',
   17 |     email: user.email || '',
   18 |     role: user.role || '',
   19 |   }
   20 | }
   21 | 
   22 | export async function listModerationProducts(req, res) {
   23 |   const status = resolveReviewStatus(req.query?.status || 'pending_review')
   24 |   const limit = Math.max(1, Math.min(200, Number(req.query?.limit || 50)))
   25 |   const offset = Math.max(0, Number(req.query?.offset || 0))
   26 | 
   27 |   const [products, users] = await Promise.all([
   28 |     readJson('company_products.json'),
   29 |     readJson('users.json'),
   30 |   ])
   31 | 
   32 |   const rows = Array.isArray(products) ? products : []
   33 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
   34 |   const filtered = rows
   35 |     .filter((p) => resolveReviewStatus(p.content_review_status) === status)
   36 |     .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))
   37 | 
   38 |   const items = filtered.slice(offset, offset + limit).map((row) => ({
   39 |     ...row,
   40 |     owner: publicUser(usersById.get(String(row.company_id || ''))),
   41 |   }))
   42 | 
   43 |   return res.json({ items, total: filtered.length, status })
   44 | }
   45 | 
   46 | export async function updateModerationProduct(req, res) {
   47 |   const productId = sanitizeString(String(req.params.productId || ''), 120)
   48 |   const nextStatusRaw = sanitizeString(String(req.body?.status || ''), 40)
   49 |   if (!productId || !nextStatusRaw) return res.status(400).json({ error: 'productId and status are required' })
   50 | 
   51 |   const nextStatus = resolveReviewStatus(nextStatusRaw)
   52 |   const reason = sanitizeString(String(req.body?.reason || ''), 240)
   53 | 
   54 |   const products = await readJson('company_products.json')
   55 |   const rows = Array.isArray(products) ? products : []
   56 |   const idx = rows.findIndex((p) => String(p.id) === String(productId))
   57 |   if (idx < 0) return res.status(404).json({ error: 'Product not found' })
   58 | 
   59 |   const current = rows[idx]
   60 |   rows[idx] = {
   61 |     ...current,
   62 |     content_review_status: nextStatus,
   63 |     content_review_reason: nextStatus === 'rejected' ? (reason || current.content_review_reason || 'Content standards violation.') : '',
   64 |     content_reviewed_at: new Date().toISOString(),
   65 |     content_reviewed_by: sanitizeString(String(req.user?.id || 'admin'), 120),
   66 |     updated_at: new Date().toISOString(),
   67 |   }
   68 | 
   69 |   await writeJson('company_products.json', rows)
   70 | 
   71 |   const config = await getAdminConfig()
   72 |   const fixTip = config?.moderation?.clothing_rules?.reason_templates?.fix_guidance || ''
   73 |   const notifyMessage = nextStatus === 'approved'
   74 |     ? 'Your product was approved after review.'
   75 |     : `Your product was rejected: ${rows[idx].content_review_reason || 'Content standards violation.'} ${fixTip}`.trim()
   76 | 
   77 |   if (rows[idx].company_id) {
   78 |     await createNotification(rows[idx].company_id, {
   79 |       type: 'product_content_review',
   80 |       entity_type: 'company_product',
   81 |       entity_id: rows[idx].id,
   82 |       message: notifyMessage,
   83 |       meta: { review_status: nextStatus, reason: rows[idx].content_review_reason },
   84 |     })
   85 |   }
   86 | 
   87 |   return res.json({ ok: true, item: rows[idx] })
   88 | }
   89 | 