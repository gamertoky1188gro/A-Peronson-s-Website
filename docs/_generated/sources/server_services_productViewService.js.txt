    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { trackEvent } from './eventTrackingService.js'
    5 | 
    6 | const FILE = 'product_views.json'
    7 | const USERS_FILE = 'users.json'
    8 | const PRODUCTS_FILE = 'company_products.json'
    9 | 
   10 | function toIsoNow() {
   11 |   return new Date().toISOString()
   12 | }
   13 | 
   14 | function safeArray(value) {
   15 |   return Array.isArray(value) ? value : []
   16 | }
   17 | 
   18 | function sortNewest(a, b) {
   19 |   return String(b.viewed_at || '').localeCompare(String(a.viewed_at || ''))
   20 | }
   21 | 
   22 | function normalizeProductVideoFlags(product) {
   23 |   const reviewStatus = product.video_review_status || 'approved'
   24 |   const restricted = Boolean(product.video_restricted || reviewStatus !== 'approved')
   25 |   return {
   26 |     ...product,
   27 |     video_review_status: reviewStatus,
   28 |     video_restricted: restricted,
   29 |     video_url: restricted ? '' : product.video_url,
   30 |     hasVideo: !restricted && Boolean(product.video_url),
   31 |   }
   32 | }
   33 | 
   34 | function publicAuthor(user) {
   35 |   if (!user) return null
   36 |   return {
   37 |     id: user.id,
   38 |     name: user.name || '',
   39 |     role: user.role || '',
   40 |     verified: Boolean(user.verified),
   41 |     country: String(user.profile?.country || ''),
   42 |   }
   43 | }
   44 | 
   45 | export async function recordView(userId, productId, { windowMinutes = 10, geo = null } = {}) {
   46 |   const viewerId = sanitizeString(String(userId || ''), 120)
   47 |   const pid = sanitizeString(String(productId || ''), 120)
   48 |   if (!viewerId || !pid) return 'not_found'
   49 | 
   50 |   const products = await readJson(PRODUCTS_FILE)
   51 |   const product = safeArray(products).find((p) => String(p.id) === pid) || null
   52 |   if (!product) return 'not_found'
   53 | 
   54 |   const all = safeArray(await readJson(FILE))
   55 |   const now = Date.now()
   56 |   const windowMs = Math.max(1, Number(windowMinutes) || 10) * 60 * 1000
   57 | 
   58 |   const existingIndex = all.findIndex((row) => row.user_id === viewerId && row.product_id === pid)
   59 |   if (existingIndex >= 0) {
   60 |     const lastAt = new Date(all[existingIndex].viewed_at || 0).getTime()
   61 |     if (Number.isFinite(lastAt) && (now - lastAt) < windowMs) {
   62 |       return { ok: true, deduped: true, viewed_at: all[existingIndex].viewed_at }
   63 |     }
   64 |     all[existingIndex].viewed_at = toIsoNow()
   65 |     all[existingIndex].updated_at = toIsoNow()
   66 |   } else {
   67 |     all.push({
   68 |       id: crypto.randomUUID(),
   69 |       user_id: viewerId,
   70 |       product_id: pid,
   71 |       viewed_at: toIsoNow(),
   72 |       created_at: toIsoNow(),
   73 |       updated_at: toIsoNow(),
   74 |     })
   75 |   }
   76 | 
   77 |   await writeJson(FILE, all)
   78 |   await trackEvent({
   79 |     type: 'product_viewed',
   80 |     actor_id: viewerId,
   81 |     entity_id: pid,
   82 |     metadata: geo && typeof geo === 'object'
   83 |       ? {
   84 |         country: geo.country || '',
   85 |         city: geo.city || '',
   86 |         lat: geo.lat ?? null,
   87 |         lng: geo.lng ?? null,
   88 |       }
   89 |       : {},
   90 |   })
   91 |   return { ok: true, deduped: false }
   92 | }
   93 | 
   94 | export async function listMyProductViews(userId, { cursor = 0, limit = 10 } = {}) {
   95 |   const viewerId = sanitizeString(String(userId || ''), 120)
   96 |   const safeCursor = Math.max(0, Math.floor(Number(cursor || 0)))
   97 |   const safeLimit = Math.min(50, Math.max(1, Math.floor(Number(limit || 10))))
   98 | 
   99 |   const [views, products, users] = await Promise.all([
  100 |     readJson(FILE),
  101 |     readJson(PRODUCTS_FILE),
  102 |     readJson(USERS_FILE),
  103 |   ])
  104 | 
  105 |   const viewsForUser = safeArray(views).filter((v) => v.user_id === viewerId).sort(sortNewest)
  106 |   const productsById = new Map(safeArray(products).map((p) => [String(p.id), normalizeProductVideoFlags(p)]))
  107 |   const usersById = new Map(safeArray(users).map((u) => [String(u.id), u]))
  108 | 
  109 |   const pageRows = viewsForUser.slice(safeCursor, safeCursor + safeLimit)
  110 |   const items = pageRows.map((v) => {
  111 |     const product = productsById.get(String(v.product_id)) || null
  112 |     const author = product ? publicAuthor(usersById.get(String(product.company_id))) : null
  113 |     return {
  114 |       id: v.id,
  115 |       viewed_at: v.viewed_at,
  116 |       product: product ? {
  117 |         id: product.id,
  118 |         title: product.title,
  119 |         category: product.category,
  120 |         material: product.material,
  121 |         moq: product.moq,
  122 |         lead_time_days: product.lead_time_days,
  123 |         description: product.description,
  124 |         hasVideo: Boolean(product.hasVideo),
  125 |         video_url: product.video_url || '',
  126 |         video_review_status: product.video_review_status || '',
  127 |       } : null,
  128 |       author,
  129 |     }
  130 |   }).filter((row) => row.product)
  131 | 
  132 |   const nextCursor = safeCursor + safeLimit < viewsForUser.length ? safeCursor + safeLimit : null
  133 |   return {
  134 |     cursor: safeCursor,
  135 |     next_cursor: nextCursor,
  136 |     total: viewsForUser.length,
  137 |     items,
  138 |   }
  139 | }
  140 | 