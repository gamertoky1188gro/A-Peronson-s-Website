    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { trackEvent } from './eventTrackingService.js'
    5 | import { createNotification, emitNotificationsForEntity } from './notificationService.js'
    6 | import { moderateTextOrRedact } from './policyService.js'
    7 | import { isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
    8 | import { getAdminConfig } from './adminConfigService.js'
    9 | import { getPlanForUser } from './entitlementService.js'
   10 | import { indexProduct, deleteProductIndex } from './openSearchService.js'
   11 | import { extractOriginalPrice, getBaseCurrency, normalizePriceRange } from './currencyService.js'
   12 | 
   13 | const FILE = 'company_products.json'
   14 | const PROHIBITED_MEDIA_KEYWORDS = ['porn', 'explicit', 'nudity', 'violence', 'weapon', 'drugs', 'hate']
   15 | const MUSIC_INSTRUMENT_KEYWORDS = [
   16 |   'music',
   17 |   'song',
   18 |   'lyrics',
   19 |   'guitar',
   20 |   'drum',
   21 |   'violin',
   22 |   'piano',
   23 |   'flute',
   24 |   'sitar',
   25 |   'tabla',
   26 |   'instrument',
   27 | ]
   28 | const PRODUCT_STATUSES = new Set(['draft', 'published'])
   29 | const IMAGE_URL_LIMIT = 12
   30 | const REVIEW_STATUSES = new Set(['approved', 'pending_review', 'rejected'])
   31 | 
   32 | function normalizeVideoReview(row) {
   33 |   const reviewStatus = row.video_review_status || 'approved'
   34 |   const restricted = Boolean(row.video_restricted || reviewStatus !== 'approved')
   35 |   return {
   36 |     ...row,
   37 |     video_review_status: reviewStatus,
   38 |     video_restricted: restricted,
   39 |     video_moderation_flags: Array.isArray(row.video_moderation_flags) ? row.video_moderation_flags : [],
   40 |     video_url: restricted ? '' : row.video_url,
   41 |     hasVideo: !restricted && Boolean(row.video_url),
   42 |   }
   43 | }
   44 | 
   45 | function normalizeProductStatus(value, fallback = 'published') {
   46 |   const status = sanitizeString(String(value || fallback), 20).toLowerCase()
   47 |   return PRODUCT_STATUSES.has(status) ? status : fallback
   48 | }
   49 | 
   50 | function sanitizeImageUrl(value) {
   51 |   return sanitizeString(String(value || ''), 600)
   52 | }
   53 | 
   54 | function isInternalMediaUrl(value) {
   55 |   const raw = sanitizeImageUrl(value)
   56 |   if (!raw) return false
   57 |   if (raw.startsWith('/uploads/')) return true
   58 |   if (raw.startsWith('uploads/')) return true
   59 |   if (raw.includes('server/uploads/')) return true
   60 |   return false
   61 | }
   62 | 
   63 | function normalizeImageUrls(value) {
   64 |   const cleaned = extractImageUrlCandidates(value)
   65 |   return [...new Set(cleaned.filter((url) => Boolean(url && isInternalMediaUrl(url))))].slice(0, IMAGE_URL_LIMIT)
   66 | }
   67 | 
   68 | function extractImageUrlCandidates(value) {
   69 |   const raw = Array.isArray(value)
   70 |     ? value
   71 |     : (typeof value === 'string' ? value.split(',') : [])
   72 |   const cleaned = raw.map((entry) => {
   73 |     if (typeof entry === 'string') return sanitizeImageUrl(entry)
   74 |     if (entry && typeof entry === 'object') {
   75 |       return sanitizeImageUrl(entry.url || entry.source_path || entry.file_path || '')
   76 |     }
   77 |     return ''
   78 |   }).filter(Boolean)
   79 |   return cleaned
   80 | }
   81 | 
   82 | function syncCoverImage(imageUrls, coverImage) {
   83 |   const cover = sanitizeImageUrl(coverImage)
   84 |   const urls = [...imageUrls]
   85 |   if (cover) {
   86 |     if (!urls.includes(cover)) urls.unshift(cover)
   87 |     return { cover_image_url: cover, image_urls: urls }
   88 |   }
   89 |   if (!urls.length) return { cover_image_url: '', image_urls: urls }
   90 |   return { cover_image_url: urls[0], image_urls: urls }
   91 | }
   92 | 
   93 | function toPublicFileUrl(filePath = '') {
   94 |   if (!filePath) return ''
   95 |   const normalized = String(filePath).replace(/\\/g, '/')
   96 |   if (normalized.startsWith('/uploads/')) return normalized
   97 |   const idx = normalized.indexOf('server/uploads/')
   98 |   if (idx >= 0) return `/uploads/${normalized.slice(idx + 'server/uploads/'.length)}`
   99 |   return normalized.startsWith('uploads/') ? `/${normalized}` : normalized
  100 | }
  101 | 
  102 | function buildImageGallery(product, documents = []) {
  103 |   const docRows = Array.isArray(documents) ? documents : []
  104 |   const relevantDocs = docRows.filter((doc) => {
  105 |     if (String(doc.entity_type || '') !== 'company_product') return false
  106 |     if (String(doc.entity_id || '') !== String(product.id || '')) return false
  107 |     const type = String(doc.type || '').toLowerCase()
  108 |     return !type || type.includes('image')
  109 |   })
  110 | 
  111 |   const docByPath = new Map()
  112 |   const docByPublic = new Map()
  113 |   relevantDocs.forEach((doc) => {
  114 |     const source = String(doc.file_path || doc.url || '')
  115 |     if (!source) return
  116 |     const publicUrl = toPublicFileUrl(source)
  117 |     docByPath.set(source, doc)
  118 |     docByPublic.set(publicUrl, doc)
  119 |   })
  120 | 
  121 |   const storedUrls = normalizeImageUrls(product.image_urls)
  122 |   const fallbackUrls = relevantDocs
  123 |     .map((doc) => String(doc.file_path || doc.url || ''))
  124 |     .filter(Boolean)
  125 |   const sources = storedUrls.length ? storedUrls : [...new Set(fallbackUrls)]
  126 | 
  127 |   const gallery = sources.map((source) => {
  128 |     const doc = docByPath.get(source) || docByPublic.get(source) || null
  129 |     const statusRaw = String(doc?.moderation_status || '').toLowerCase()
  130 |     const status = statusRaw || (doc ? 'approved' : 'pending_review')
  131 |     return {
  132 |       url: toPublicFileUrl(source),
  133 |       source_path: source,
  134 |       document_id: doc?.id || '',
  135 |       status,
  136 |       flags: Array.isArray(doc?.moderation_flags) ? doc.moderation_flags : [],
  137 |     }
  138 |   })
  139 | 
  140 |   return gallery
  141 | }
  142 | 
  143 | function assertInternalMediaUrls(urls = [], fieldName = 'media') {
  144 |   const bad = urls.filter((url) => url && !isInternalMediaUrl(url))
  145 |   if (bad.length) {
  146 |     const err = new Error(`Only internal media URLs are allowed for ${fieldName}.`)
  147 |     err.status = 400
  148 |     throw err
  149 |   }
  150 | }
  151 | 
  152 | function assertInternalMediaUrl(value, fieldName = 'media') {
  153 |   if (!value) return
  154 |   if (!isInternalMediaUrl(value)) {
  155 |     const err = new Error(`Only internal media URLs are allowed for ${fieldName}.`)
  156 |     err.status = 400
  157 |     throw err
  158 |   }
  159 | }
  160 | 
  161 | function presentProduct(product, documents = [], viewer = {}) {
  162 |   const normalized = {
  163 |     ...product,
  164 |     status: normalizeProductStatus(product.status),
  165 |     image_urls: normalizeImageUrls(product.image_urls),
  166 |     cover_image_url: sanitizeImageUrl(product.cover_image_url),
  167 |   }
  168 |   const gallery = buildImageGallery(normalized, documents)
  169 |   const isOwner = viewer?.id && String(viewer.id) === String(normalized.company_id)
  170 |   const canSeePending = isOwner || isOwnerOrAdmin(viewer)
  171 |   const visibleGallery = canSeePending ? gallery : gallery.filter((entry) => entry.status === 'approved')
  172 | 
  173 |   const coverSource = sanitizedCover(normalized.cover_image_url)
  174 |   const findCover = (items) => items.find((entry) => entry.source_path === coverSource || entry.url === coverSource)
  175 |   const coverEntry = findCover(canSeePending ? gallery : visibleGallery)
  176 |     || (canSeePending ? gallery[0] : visibleGallery[0])
  177 |     || null
  178 |   const coverPublicUrl = coverEntry ? coverEntry.url : ''
  179 |   const coverSourcePath = coverEntry ? coverEntry.source_path : ''
  180 | 
  181 |   return normalizeVideoReview({
  182 |     ...normalized,
  183 |     status: normalized.status,
  184 |     image_urls: canSeePending ? gallery.map((entry) => entry.source_path) : visibleGallery.map((entry) => entry.url),
  185 |     cover_image_url: canSeePending ? (coverSource || coverSourcePath) : coverPublicUrl,
  186 |     cover_image_public_url: coverPublicUrl,
  187 |     image_gallery: canSeePending ? gallery : visibleGallery,
  188 |   })
  189 | }
  190 | 
  191 | function sanitizedCover(value) {
  192 |   return sanitizeImageUrl(value)
  193 | }
  194 | 
  195 | function ensureAgentProductAccess(actor) {
  196 |   if (!actor || !isAgent(actor)) return
  197 |   if (!actor.permission_matrix?.products?.edit) {
  198 |     const err = new Error('Forbidden')
  199 |     err.status = 403
  200 |     throw err
  201 |   }
  202 | }
  203 | 
  204 | function resolveProductOwner(actor, users = []) {
  205 |   if (!actor) return { ownerId: '', ownerRole: '' }
  206 |   if (!isAgent(actor)) {
  207 |     return { ownerId: actor.id, ownerRole: actor.role }
  208 |   }
  209 | 
  210 |   ensureAgentProductAccess(actor)
  211 |   const ownerId = String(actor.org_owner_id || '')
  212 |   if (!ownerId) {
  213 |     const err = new Error('Forbidden')
  214 |     err.status = 403
  215 |     throw err
  216 |   }
  217 | 
  218 |   const owner = users.find((u) => String(u.id) === ownerId)
  219 |   if (!owner) {
  220 |     const err = new Error('Organization owner not found')
  221 |     err.status = 403
  222 |     throw err
  223 |   }
  224 | 
  225 |   return { ownerId, ownerRole: owner.role || 'buying_house' }
  226 | }
  227 | 
  228 | async function enforceProductLimits({ owner, allProducts, nextVideoUrl = '' }) {
  229 |   if (!owner) return
  230 |   const plan = await getPlanForUser(owner)
  231 |   if (plan === 'premium') return
  232 | 
  233 |   const config = await getAdminConfig()
  234 |   const planLimits = config?.plan_limits?.free || {}
  235 |   const productLimit = Number(planLimits.product_limit || 20)
  236 |   const videoLimit = Number(planLimits.video_limit || 2)
  237 | 
  238 |   const ownerId = String(owner.id || '')
  239 |   const ownerProducts = Array.isArray(allProducts)
  240 |     ? allProducts.filter((p) => String(p.company_id || '') === ownerId)
  241 |     : []
  242 | 
  243 |   if (productLimit > 0 && ownerProducts.length >= productLimit) {
  244 |     const err = new Error(`Free plan allows up to ${productLimit} products. Upgrade to add more.`)
  245 |     err.status = 403
  246 |     throw err
  247 |   }
  248 | 
  249 |   if (nextVideoUrl) {
  250 |     const existingVideos = ownerProducts.filter((p) => String(p.video_url || '').trim()).length
  251 |     if (videoLimit > 0 && existingVideos >= videoLimit) {
  252 |       const err = new Error(`Free plan allows up to ${videoLimit} product videos. Upgrade to add more.`)
  253 |       err.status = 403
  254 |       throw err
  255 |     }
  256 |   }
  257 | }
  258 | 
  259 | function getVideoModerationResult({ title = '', description = '', videoUrl = '' }) {
  260 |   const hardFlags = []
  261 |   const softFlags = []
  262 |   if (!videoUrl) {
  263 |     return { flags: [], videoReviewStatus: 'approved', videoRestricted: false }
  264 |   }
  265 | 
  266 |   if (!isInternalMediaUrl(videoUrl)) {
  267 |     hardFlags.push('external_video_url_blocked')
  268 |   }
  269 | 
  270 |   const searchableText = `${title} ${description} ${videoUrl}`.toLowerCase()
  271 |   for (const keyword of PROHIBITED_MEDIA_KEYWORDS) {
  272 |     if (searchableText.includes(keyword)) {
  273 |       hardFlags.push(`prohibited_media_keyword:${keyword}`)
  274 |     }
  275 |   }
  276 | 
  277 |   for (const keyword of MUSIC_INSTRUMENT_KEYWORDS) {
  278 |     if (searchableText.includes(keyword)) {
  279 |       softFlags.push(`music_or_instrument:${keyword}`)
  280 |     }
  281 |   }
  282 | 
  283 |   const flags = [...hardFlags, ...softFlags]
  284 |   const isInternal = isInternalMediaUrl(videoUrl)
  285 |   const videoRestricted = flags.length > 0 || isInternal
  286 |   const videoReviewStatus = hardFlags.length > 0
  287 |     ? 'restricted'
  288 |     : (isInternal || softFlags.length > 0 ? 'pending_review' : 'approved')
  289 |   return {
  290 |     flags,
  291 |     videoReviewStatus,
  292 |     videoRestricted,
  293 |   }
  294 | }
  295 | 
  296 | function normalizeTerms(list = []) {
  297 |   if (!Array.isArray(list)) return []
  298 |   return list.map((t) => String(t || '').trim().toLowerCase()).filter(Boolean)
  299 | }
  300 | 
  301 | function collectTermMatches(text = '', terms = []) {
  302 |   if (!text || !terms.length) return []
  303 |   const hay = String(text || '').toLowerCase()
  304 |   return terms.filter((term) => term && hay.includes(term))
  305 | }
  306 | 
  307 | function buildReviewReason(template = '', matched = []) {
  308 |   const base = template || 'This listing violates our content standards for modest apparel.'
  309 |   if (!matched.length) return base
  310 |   return `${base} Restricted keyword(s) detected: ${matched.slice(0, 3).join(', ')}.`
  311 | }
  312 | 
  313 | function resolveReviewStatus(status) {
  314 |   const normalized = String(status || 'approved').toLowerCase()
  315 |   return REVIEW_STATUSES.has(normalized) ? normalized : 'approved'
  316 | }
  317 | 
  318 | async function evaluateClothingModeration({ title, description, category, material, media = [] }) {
  319 |   const config = await getAdminConfig()
  320 |   const rules = config?.moderation?.clothing_rules || {}
  321 |   const forbiddenTerms = normalizeTerms(rules.forbidden_terms)
  322 |   const flagTerms = normalizeTerms(rules.flag_terms)
  323 |   const allowedTerms = normalizeTerms(rules.allowed_terms)
  324 |   const exceptions = normalizeTerms(rules.context_exceptions)
  325 |   const templates = rules.reason_templates || {}
  326 | 
  327 |   const text = [title, description, category, material, ...(media || [])]
  328 |     .map((part) => String(part || '').trim())
  329 |     .filter(Boolean)
  330 |     .join(' ')
  331 | 
  332 |   const forbiddenMatches = collectTermMatches(text, forbiddenTerms)
  333 |   const flagMatches = collectTermMatches(text, flagTerms)
  334 |   const allowedMatches = collectTermMatches(text, allowedTerms)
  335 |   const exceptionMatches = collectTermMatches(text, exceptions)
  336 |   const hasException = exceptionMatches.length > 0
  337 | 
  338 |   if (forbiddenMatches.length && !hasException) {
  339 |     return {
  340 |       status: 'rejected',
  341 |       reason: buildReviewReason(templates.rejected, forbiddenMatches),
  342 |       flags: [
  343 |         ...forbiddenMatches.map((term) => `forbidden:${term}`),
  344 |         ...flagMatches.map((term) => `flag:${term}`),
  345 |       ],
  346 |     }
  347 |   }
  348 | 
  349 |   if (flagMatches.length && !hasException) {
  350 |     return {
  351 |       status: 'pending_review',
  352 |       reason: buildReviewReason(templates.pending_review, flagMatches),
  353 |       flags: [
  354 |         ...flagMatches.map((term) => `flag:${term}`),
  355 |         ...allowedMatches.map((term) => `allowed:${term}`),
  356 |       ],
  357 |     }
  358 |   }
  359 | 
  360 |   return {
  361 |     status: 'approved',
  362 |     reason: '',
  363 |     flags: [
  364 |       ...allowedMatches.map((term) => `allowed:${term}`),
  365 |       ...exceptionMatches.map((term) => `exception:${term}`),
  366 |     ],
  367 |   }
  368 | }
  369 | 
  370 | export async function createProduct(user, payload) {
  371 |   const [all, users] = await Promise.all([
  372 |     readJson(FILE),
  373 |     readJson('users.json'),
  374 |   ])
  375 |   const { ownerId, ownerRole } = resolveProductOwner(user, users)
  376 |   const ownerUser = users.find((u) => String(u.id) === String(ownerId)) || user
  377 |   const title = sanitizeString(payload.title, 120)
  378 |   let description = sanitizeString(payload.description || '', 1200)
  379 |   const videoUrl = sanitizeString(payload.video_url || '', 260)
  380 | 
  381 |   await enforceProductLimits({ owner: ownerUser, allProducts: all, nextVideoUrl: videoUrl })
  382 | 
  383 |   const status = normalizeProductStatus(payload.status || 'published')
  384 |   const imageCandidates = extractImageUrlCandidates(payload.image_urls || payload.imageUrls)
  385 |   const imageUrls = normalizeImageUrls(imageCandidates)
  386 |   const coverSeed = sanitizeImageUrl(payload.cover_image_url || payload.coverImageUrl || '')
  387 |   assertInternalMediaUrls(imageCandidates, 'product images')
  388 |   assertInternalMediaUrl(coverSeed, 'product cover image')
  389 |   assertInternalMediaUrl(videoUrl, 'product video')
  390 |   const { cover_image_url, image_urls } = syncCoverImage(imageUrls, coverSeed)
  391 |   const moderation = getVideoModerationResult({ title, description, videoUrl })
  392 |   const clothingReview = await evaluateClothingModeration({
  393 |     title,
  394 |     description,
  395 |     category: sanitizeString(payload.category, 80),
  396 |     material: sanitizeString(payload.material, 80),
  397 |     media: [videoUrl, coverSeed, ...imageCandidates],
  398 |   })
  399 |   const row = {
  400 |     id: crypto.randomUUID(),
  401 |     company_id: ownerId,
  402 |     company_role: ownerRole,
  403 |     title,
  404 |     industry: sanitizeString(payload.industry || '', 80),
  405 |     category: sanitizeString(payload.category, 80),
  406 |     material: sanitizeString(payload.material, 80),
  407 |     moq: sanitizeString(payload.moq || '', 40),
  408 |     price_range: sanitizeString(payload.price_range || payload.priceRange || '', 80),
  409 |     lead_time_days: sanitizeString(payload.lead_time_days || '', 40),
  410 |     fabric_gsm: sanitizeString(payload.fabric_gsm || '', 40),
  411 |     size_range: sanitizeString(payload.size_range || '', 120),
  412 |     color_pantone: sanitizeString(payload.color_pantone || '', 120),
  413 |     customization_capabilities: sanitizeString(payload.customization_capabilities || payload.customization || '', 240),
  414 |     sample_available: sanitizeString(payload.sample_available || '', 40),
  415 |     sample_lead_time_days: sanitizeString(payload.sample_lead_time_days || '', 40),
  416 |     description: '',
  417 |     image_urls,
  418 |     cover_image_url,
  419 |     status,
  420 |     video_url: videoUrl,
  421 |     video_review_status: moderation.videoReviewStatus,
  422 |     video_restricted: moderation.videoRestricted,
  423 |     video_moderation_flags: moderation.flags,
  424 |     content_review_status: resolveReviewStatus(clothingReview.status),
  425 |     content_review_reason: clothingReview.reason || '',
  426 |     content_review_flags: clothingReview.flags || [],
  427 |     content_reviewed_at: new Date().toISOString(),
  428 |     content_reviewed_by: 'system',
  429 |     created_at: new Date().toISOString(),
  430 |   }
  431 | 
  432 |   const baseCurrency = await getBaseCurrency()
  433 |   const originalPrice = extractOriginalPrice(payload)
  434 |   const normalizedPrice = await normalizePriceRange({
  435 |     min: originalPrice.priceOriginalMin,
  436 |     max: originalPrice.priceOriginalMax,
  437 |     currency: originalPrice.currency,
  438 |     baseCurrency,
  439 |   })
  440 |   row.currency = originalPrice.currency
  441 |   row.priceOriginalMin = normalizedPrice.priceOriginalMin
  442 |   row.priceOriginalMax = normalizedPrice.priceOriginalMax
  443 |   row.priceBaseMin = normalizedPrice.priceBaseMin
  444 |   row.priceBaseMax = normalizedPrice.priceBaseMax
  445 |   row.priceNormalizedBase = normalizedPrice.priceBaseMin
  446 | 
  447 |   // Trust & safety (project.md): strip outside-contact sharing / obscene content from descriptions.
  448 |   try {
  449 |     const moderated = await moderateTextOrRedact({
  450 |       actor: user,
  451 |       text: description,
  452 |       entity_type: 'company_product',
  453 |       entity_id: row.id,
  454 |     })
  455 |     description = moderated.text
  456 |     row.moderated = Boolean(moderated.moderated)
  457 |     row.moderation_reason = moderated.reason || ''
  458 |   } catch {
  459 |     // silent
  460 |   }
  461 | 
  462 |   row.description = description
  463 |   all.push(row)
  464 |   await writeJson(FILE, all)
  465 |   try {
  466 |     await indexProduct(row, { ...(ownerUser || {}), ...(ownerUser?.profile || {}) })
  467 |   } catch {
  468 |     // ignore index failures
  469 |   }
  470 |   await trackEvent({ type: 'product_created', actor_id: user.id, entity_id: row.id })
  471 |   if (status === 'published') {
  472 |     await trackEvent({ type: 'product_published', actor_id: user.id, entity_id: row.id })
  473 |     if (row.content_review_status === 'approved') {
  474 |       await emitNotificationsForEntity('company_product', row)
  475 |     }
  476 |   }
  477 | 
  478 |   if (row.content_review_status !== 'approved') {
  479 |     const config = await getAdminConfig()
  480 |     const fixTip = config?.moderation?.clothing_rules?.reason_templates?.fix_guidance || ''
  481 |     const notice = row.content_review_status === 'rejected'
  482 |       ? `Product rejected: ${row.content_review_reason || 'Content standards violation.'} ${fixTip}`.trim()
  483 |       : `Product pending review: ${row.content_review_reason || 'Manual review required.'}`.trim()
  484 |     await createNotification(ownerId, {
  485 |       type: 'product_content_review',
  486 |       entity_type: 'company_product',
  487 |       entity_id: row.id,
  488 |       message: notice,
  489 |       meta: { review_status: row.content_review_status, reason: row.content_review_reason },
  490 |     })
  491 |   }
  492 | 
  493 |   const viewer = isAgent(user) ? { id: ownerId, role: ownerRole } : user
  494 |   return presentProduct(row, [], viewer)
  495 | }
  496 | 
  497 | export async function listProducts(filters = {}) {
  498 |   const [all, documents] = await Promise.all([
  499 |     readJson(FILE),
  500 |     readJson('documents.json'),
  501 |   ])
  502 |   const includeDrafts = Boolean(filters.includeDrafts)
  503 |   const viewerId = filters.viewerId || ''
  504 |   const viewerRole = filters.viewerRole || ''
  505 |   const viewer = viewerId ? { id: viewerId, role: viewerRole } : {}
  506 |   return all
  507 |     .filter((p) => !filters.category || String(p.category || '').toLowerCase() === String(filters.category).toLowerCase())
  508 |     .filter((p) => !filters.companyId || String(p.company_id) === String(filters.companyId))
  509 |     .filter((p) => (includeDrafts ? true : normalizeProductStatus(p.status) === 'published'))
  510 |     .filter((p) => {
  511 |       const reviewStatus = resolveReviewStatus(p.content_review_status)
  512 |       if (reviewStatus === 'approved') return true
  513 |       if (!viewerId) return false
  514 |       if (String(p.company_id) === String(viewerId)) return true
  515 |       if (['owner', 'admin'].includes(String(viewerRole || '').toLowerCase())) return true
  516 |       return false
  517 |     })
  518 |     .map((p) => presentProduct(p, documents, viewer))
  519 | }
  520 | 
  521 | function canMutateProduct(actor, product) {
  522 |   if (!actor || !product) return false
  523 |   if (isOwnerOrAdmin(actor)) return true
  524 |   if (isAgent(actor)) {
  525 |     if (!actor.permission_matrix?.products?.edit) return false
  526 |     return String(product.company_id) === String(actor.org_owner_id || '')
  527 |   }
  528 |   return String(product.company_id) === String(actor.id)
  529 | }
  530 | 
  531 | export async function updateProductById(actor, productId, patch = {}) {
  532 |   const id = sanitizeString(String(productId || ''), 120)
  533 |   if (!id) return null
  534 |   const [all, documents] = await Promise.all([
  535 |     readJson(FILE),
  536 |     readJson('documents.json'),
  537 |   ])
  538 |   const idx = all.findIndex((p) => String(p.id) === id)
  539 |   if (idx < 0) return null
  540 |   const existing = all[idx]
  541 |   if (!canMutateProduct(actor, existing)) return 'forbidden'
  542 | 
  543 |   const nextTitle = patch.title !== undefined ? sanitizeString(patch.title, 120) : existing.title
  544 |   let nextDescription = patch.description !== undefined ? sanitizeString(patch.description || '', 1200) : existing.description
  545 |   const nextVideoUrl = patch.video_url !== undefined ? sanitizeString(patch.video_url || '', 260) : existing.video_url
  546 |   const ownerId = String(existing.company_id || '')
  547 |   const users = await readJson('users.json')
  548 |   const ownerRecord = users.find((u) => String(u.id) === ownerId) || actor
  549 |   const addingVideo = !String(existing.video_url || '').trim() && String(nextVideoUrl || '').trim()
  550 |   if (addingVideo) {
  551 |     await enforceProductLimits({ owner: ownerRecord, allProducts: all, nextVideoUrl })
  552 |   }
  553 |   const moderation = getVideoModerationResult({ title: nextTitle, description: nextDescription, videoUrl: nextVideoUrl })
  554 |   const status = patch.status !== undefined ? normalizeProductStatus(patch.status, existing.status || 'published') : normalizeProductStatus(existing.status)
  555 |   const imageCandidates = patch.image_urls !== undefined || patch.imageUrls !== undefined
  556 |     ? extractImageUrlCandidates(patch.image_urls || patch.imageUrls || [])
  557 |     : extractImageUrlCandidates(existing.image_urls)
  558 |   const imageUrls = normalizeImageUrls(imageCandidates)
  559 |   const coverSeed = patch.cover_image_url !== undefined || patch.coverImageUrl !== undefined
  560 |     ? sanitizeImageUrl(patch.cover_image_url || patch.coverImageUrl || '')
  561 |     : sanitizeImageUrl(existing.cover_image_url)
  562 |   assertInternalMediaUrls(imageCandidates, 'product images')
  563 |   assertInternalMediaUrl(coverSeed, 'product cover image')
  564 |   assertInternalMediaUrl(nextVideoUrl, 'product video')
  565 |   const syncedCover = syncCoverImage(imageUrls, coverSeed)
  566 | 
  567 |   try {
  568 |     if (patch.description !== undefined) {
  569 |       const moderated = await moderateTextOrRedact({
  570 |         actor,
  571 |         text: nextDescription,
  572 |         entity_type: 'company_product',
  573 |         entity_id: existing.id,
  574 |       })
  575 |       nextDescription = moderated.text
  576 |     }
  577 |   } catch {
  578 |     // silent
  579 |   }
  580 | 
  581 |   const clothingReview = await evaluateClothingModeration({
  582 |     title: nextTitle,
  583 |     description: nextDescription,
  584 |     category: patch.category !== undefined ? sanitizeString(patch.category, 80) : existing.category,
  585 |     material: patch.material !== undefined ? sanitizeString(patch.material, 80) : existing.material,
  586 |     media: [nextVideoUrl, coverSeed, ...imageCandidates],
  587 |   })
  588 | 
  589 |   const next = {
  590 |     ...existing,
  591 |     title: nextTitle,
  592 |     industry: patch.industry !== undefined ? sanitizeString(patch.industry, 80) : existing.industry,
  593 |     category: patch.category !== undefined ? sanitizeString(patch.category, 80) : existing.category,
  594 |     material: patch.material !== undefined ? sanitizeString(patch.material, 80) : existing.material,
  595 |     moq: patch.moq !== undefined ? sanitizeString(patch.moq || '', 40) : existing.moq,
  596 |     price_range: patch.price_range !== undefined ? sanitizeString(patch.price_range || '', 80) : existing.price_range,
  597 |     lead_time_days: patch.lead_time_days !== undefined ? sanitizeString(patch.lead_time_days || '', 40) : existing.lead_time_days,
  598 |     fabric_gsm: patch.fabric_gsm !== undefined ? sanitizeString(patch.fabric_gsm || '', 40) : existing.fabric_gsm,
  599 |     size_range: patch.size_range !== undefined ? sanitizeString(patch.size_range || '', 120) : existing.size_range,
  600 |     color_pantone: patch.color_pantone !== undefined ? sanitizeString(patch.color_pantone || '', 120) : existing.color_pantone,
  601 |     customization_capabilities: patch.customization_capabilities !== undefined ? sanitizeString(patch.customization_capabilities || '', 240) : existing.customization_capabilities,
  602 |     sample_available: patch.sample_available !== undefined ? sanitizeString(patch.sample_available || '', 40) : existing.sample_available,
  603 |     sample_lead_time_days: patch.sample_lead_time_days !== undefined ? sanitizeString(patch.sample_lead_time_days || '', 40) : existing.sample_lead_time_days,
  604 |     description: nextDescription,
  605 |     image_urls: syncedCover.image_urls,
  606 |     cover_image_url: syncedCover.cover_image_url,
  607 |     status,
  608 |     video_url: nextVideoUrl,
  609 |     video_review_status: moderation.videoReviewStatus,
  610 |     video_restricted: moderation.videoRestricted,
  611 |     video_moderation_flags: moderation.flags,
  612 |     content_review_status: resolveReviewStatus(clothingReview.status),
  613 |     content_review_reason: clothingReview.reason || '',
  614 |     content_review_flags: clothingReview.flags || [],
  615 |     content_reviewed_at: new Date().toISOString(),
  616 |     content_reviewed_by: 'system',
  617 |     updated_at: new Date().toISOString(),
  618 |   }
  619 | 
  620 |   const baseCurrency = await getBaseCurrency()
  621 |   const originalPrice = extractOriginalPrice({
  622 |     priceOriginalMin: patch.priceOriginalMin !== undefined ? patch.priceOriginalMin : existing.priceOriginalMin,
  623 |     priceOriginalMax: patch.priceOriginalMax !== undefined ? patch.priceOriginalMax : existing.priceOriginalMax,
  624 |     priceOriginal: patch.priceOriginal !== undefined ? patch.priceOriginal : existing.priceOriginal,
  625 |     currency: patch.currency !== undefined ? patch.currency : (existing.currency || existing.currencyOriginal),
  626 |     price_range: next.price_range,
  627 |   })
  628 |   const normalizedPrice = await normalizePriceRange({
  629 |     min: originalPrice.priceOriginalMin,
  630 |     max: originalPrice.priceOriginalMax,
  631 |     currency: originalPrice.currency,
  632 |     baseCurrency,
  633 |   })
  634 |   next.currency = originalPrice.currency
  635 |   next.priceOriginalMin = normalizedPrice.priceOriginalMin
  636 |   next.priceOriginalMax = normalizedPrice.priceOriginalMax
  637 |   next.priceBaseMin = normalizedPrice.priceBaseMin
  638 |   next.priceBaseMax = normalizedPrice.priceBaseMax
  639 |   next.priceNormalizedBase = normalizedPrice.priceBaseMin
  640 | 
  641 |   all[idx] = next
  642 |   await writeJson(FILE, all)
  643 |   try {
  644 |     await indexProduct(next, { ...(ownerRecord || {}), ...(ownerRecord?.profile || {}) })
  645 |   } catch {
  646 |     // ignore index failures
  647 |   }
  648 |   await trackEvent({ type: 'product_updated', actor_id: actor.id, entity_id: next.id })
  649 |   if ((patch.image_urls !== undefined || patch.imageUrls !== undefined || patch.cover_image_url !== undefined || patch.coverImageUrl !== undefined) && syncedCover.image_urls.length) {
  650 |     await trackEvent({ type: 'product_media_updated', actor_id: actor.id, entity_id: next.id })
  651 |   }
  652 |   if (existing.status !== status && status === 'published') {
  653 |     await trackEvent({ type: 'product_published', actor_id: actor.id, entity_id: next.id })
  654 |   }
  655 |   if (existing.status !== status && status === 'draft') {
  656 |     await trackEvent({ type: 'product_unpublished', actor_id: actor.id, entity_id: next.id })
  657 |   }
  658 |   if (status === 'published' && next.content_review_status === 'approved') {
  659 |     // project.md: smart notifications trigger when new matching posts appear.
  660 |     await emitNotificationsForEntity('company_product', next)
  661 |   }
  662 | 
  663 |   if (next.content_review_status !== 'approved') {
  664 |     const config = await getAdminConfig()
  665 |     const fixTip = config?.moderation?.clothing_rules?.reason_templates?.fix_guidance || ''
  666 |     const notice = next.content_review_status === 'rejected'
  667 |       ? `Product rejected: ${next.content_review_reason || 'Content standards violation.'} ${fixTip}`.trim()
  668 |       : `Product pending review: ${next.content_review_reason || 'Manual review required.'}`.trim()
  669 |     await createNotification(ownerId, {
  670 |       type: 'product_content_review',
  671 |       entity_type: 'company_product',
  672 |       entity_id: next.id,
  673 |       message: notice,
  674 |       meta: { review_status: next.content_review_status, reason: next.content_review_reason },
  675 |     })
  676 |   }
  677 |   return presentProduct(next, documents, actor)
  678 | }
  679 | 
  680 | export async function removeProduct(actor, productId) {
  681 |   const id = sanitizeString(String(productId || ''), 120)
  682 |   if (!id) return null
  683 |   const all = await readJson(FILE)
  684 |   const existing = all.find((p) => String(p.id) === id)
  685 |   if (!existing) return null
  686 |   if (!canMutateProduct(actor, existing)) return 'forbidden'
  687 |   const next = all.filter((p) => String(p.id) !== id)
  688 |   await writeJson(FILE, next)
  689 |   try {
  690 |     await deleteProductIndex(id)
  691 |   } catch {
  692 |     // ignore index failures
  693 |   }
  694 |   await trackEvent({ type: 'product_deleted', actor_id: actor.id, entity_id: id })
  695 |   return true
  696 | }
  697 | 