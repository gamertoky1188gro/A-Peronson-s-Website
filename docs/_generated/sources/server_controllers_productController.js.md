    1 | import { createProduct, listProducts, removeProduct, updateProductById } from '../services/productService.js'
    2 | import {
    3 |   buildLimitError,
    4 |   buildSearchAccessPayload,
    5 |   canUseAdvancedFilters,
    6 |   consumeQuota,
    7 |   extractUsedAdvancedFilters,
    8 |   getQuotaSnapshot,
    9 |   getUserPlan,
   10 | } from '../services/searchAccessService.js'
   11 | import { readJson } from '../utils/jsonStore.js'
   12 | import { listMyProductViews, recordView } from '../services/productViewService.js'
   13 | import { extractClientIp, locateIp } from '../services/geoService.js'
   14 | import { findUserById } from '../services/userService.js'
   15 | import { handleControllerError } from '../utils/permissions.js'
   16 | import { ensureEntitlement } from '../services/entitlementService.js'
   17 | import { getActiveBoostMap } from '../services/boostService.js'
   18 | import { getOrderCertificationMap } from '../services/orderCertificationService.js'
   19 | import { isOpenSearchConfigured, searchOpenSearch } from '../services/openSearchService.js'
   20 | import { getBaseCurrency, normalizeMoney } from '../services/currencyService.js'
   21 | import { recordWorkflowEvent } from '../services/workflowLifecycleService.js'
   22 | 
   23 | function parseNumber(value) {
   24 |   if (value === undefined || value === null) return null
   25 |   const raw = String(value).trim()
   26 |   if (!raw) return null
   27 |   const n = Number(raw.replace(/[^\d.]/g, ''))
   28 |   return Number.isFinite(n) ? n : null
   29 | }
   30 | 
   31 | function parseList(value) {
   32 |   return String(value || '')
   33 |     .split(',')
   34 |     .map((entry) => entry.trim().toLowerCase())
   35 |     .filter(Boolean)
   36 | }
   37 | 
   38 | function parseBoolean(value) {
   39 |   if (typeof value === 'boolean') return value
   40 |   return String(value || '').toLowerCase() === 'true'
   41 | }
   42 | 
   43 | function parseCoordinate(value) {
   44 |   const n = Number(String(value || '').trim())
   45 |   return Number.isFinite(n) ? n : null
   46 | }
   47 | 
   48 | function parseRange(value) {
   49 |   const raw = String(value || '').trim()
   50 |   if (!raw) return { min: null, max: null }
   51 |   const parts = raw.split('-').map((part) => parseNumber(part))
   52 |   const min = Number.isFinite(parts[0]) ? parts[0] : null
   53 |   const max = Number.isFinite(parts[1]) ? parts[1] : null
   54 |   if (min === null && max === null) {
   55 |     const single = parseNumber(raw)
   56 |     return { min: single, max: single }
   57 |   }
   58 |   return { min, max }
   59 | }
   60 | 
   61 | function normalizeSearchText(value) {
   62 |   return String(value || '')
   63 |     .toLowerCase()
   64 |     .normalize('NFKD')
   65 |     .replace(/[\u0300-\u036f]/g, '')
   66 |     .replace(/[^a-z0-9]+/g, ' ')
   67 |     .trim()
   68 | }
   69 | 
   70 | function buildSearchTokens(raw) {
   71 |   const base = normalizeSearchText(raw)
   72 |   if (!base) return []
   73 |   const tokens = base
   74 |     .split(/\s+/)
   75 |     .map((token) => (token === 'woman' ? 'women' : token))
   76 |     .filter(Boolean)
   77 |   return [...new Set(tokens)]
   78 | }
   79 | 
   80 | function rangesOverlap(filterRange, valueRange) {
   81 |   if (!filterRange) return true
   82 |   const filter = parseRange(filterRange)
   83 |   const value = parseRange(valueRange)
   84 |   if (filter.min === null && filter.max === null) return true
   85 |   if (value.min === null && value.max === null) return false
   86 | 
   87 |   const fMin = filter.min ?? filter.max
   88 |   const fMax = filter.max ?? filter.min
   89 |   const vMin = value.min ?? value.max
   90 |   const vMax = value.max ?? value.min
   91 | 
   92 |   if (fMin !== null && vMax !== null && vMax < fMin) return false
   93 |   if (fMax !== null && vMin !== null && vMin > fMax) return false
   94 |   return true
   95 | }
   96 | 
   97 | function _numberInsideRange(value, rangeRaw) {
   98 |   const range = parseRange(rangeRaw)
   99 |   if (!Number.isFinite(value)) return false
  100 |   if (range.min !== null && value < range.min) return false
  101 |   if (range.max !== null && value > range.max) return false
  102 |   return true
  103 | }
  104 | 
  105 | function matchesMoqRange(rawRange, moqValue) {
  106 |   if (!rawRange) return true
  107 |   const moq = Number.isFinite(Number(moqValue)) ? Number(moqValue) : parseNumber(moqValue)
  108 |   if (!Number.isFinite(moq)) return false
  109 | 
  110 |   const range = String(rawRange || '').trim()
  111 |   const parts = range.split('-').map((p) => parseNumber(p))
  112 |   const min = Number.isFinite(parts[0]) ? parts[0] : null
  113 |   const max = Number.isFinite(parts[1]) ? parts[1] : null
  114 | 
  115 |   if (min !== null && moq < min) return false
  116 |   if (max !== null && moq > max) return false
  117 |   return true
  118 | }
  119 | 
  120 | function buildOrgMemberIndex(users = []) {
  121 |   const ownerByMember = new Map()
  122 |   const membersByOwner = new Map()
  123 | 
  124 |   for (const user of users) {
  125 |     const userId = String(user?.id || '')
  126 |     if (!userId) continue
  127 |     const role = String(user?.role || '').toLowerCase()
  128 |     const ownerId = role === 'agent' && user?.org_owner_id ? String(user.org_owner_id) : userId
  129 |     ownerByMember.set(userId, ownerId)
  130 |     if (!membersByOwner.has(ownerId)) membersByOwner.set(ownerId, new Set([ownerId]))
  131 |     membersByOwner.get(ownerId).add(userId)
  132 |   }
  133 | 
  134 |   return { ownerByMember, membersByOwner }
  135 | }
  136 | 
  137 | function buildResponseTimeByOwner(messages = [], users = []) {
  138 |   const { ownerByMember } = buildOrgMemberIndex(users)
  139 |   const messagesByMatch = new Map()
  140 | 
  141 |   for (const msg of messages) {
  142 |     const matchId = String(msg?.match_id || '')
  143 |     if (!matchId || matchId.startsWith('friend:')) continue
  144 |     if (!messagesByMatch.has(matchId)) messagesByMatch.set(matchId, [])
  145 |     messagesByMatch.get(matchId).push(msg)
  146 |   }
  147 | 
  148 |   const responseTimes = new Map()
  149 | 
  150 |   for (const msgs of messagesByMatch.values()) {
  151 |     const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
  152 |     const ownersInMatch = new Set(sorted.map((m) => ownerByMember.get(String(m.sender_id || '')) || String(m.sender_id || '')).filter(Boolean))
  153 | 
  154 |     for (const ownerId of ownersInMatch) {
  155 |       let inboundAt = null
  156 |       for (const message of sorted) {
  157 |         const senderOwner = ownerByMember.get(String(message.sender_id || '')) || String(message.sender_id || '')
  158 |         if (!senderOwner || senderOwner === ownerId) continue
  159 |         const ts = new Date(message.timestamp || '').getTime()
  160 |         if (!Number.isFinite(ts)) continue
  161 |         inboundAt = ts
  162 |         break
  163 |       }
  164 |       if (!inboundAt) continue
  165 | 
  166 |       let outboundAt = null
  167 |       for (const message of sorted) {
  168 |         const senderOwner = ownerByMember.get(String(message.sender_id || '')) || String(message.sender_id || '')
  169 |         if (!senderOwner || senderOwner !== ownerId) continue
  170 |         const ts = new Date(message.timestamp || '').getTime()
  171 |         if (!Number.isFinite(ts) || ts < inboundAt) continue
  172 |         outboundAt = ts
  173 |         break
  174 |       }
  175 |       if (!outboundAt) continue
  176 | 
  177 |       const hours = (outboundAt - inboundAt) / (1000 * 60 * 60)
  178 |       if (!responseTimes.has(ownerId)) responseTimes.set(ownerId, [])
  179 |       responseTimes.get(ownerId).push(hours)
  180 |     }
  181 |   }
  182 | 
  183 |   const averages = new Map()
  184 |   for (const [ownerId, times] of responseTimes.entries()) {
  185 |     const avg = times.length ? (times.reduce((a, b) => a + b, 0) / times.length) : 0
  186 |     averages.set(ownerId, Math.round(avg * 10) / 10)
  187 |   }
  188 | 
  189 |   return averages
  190 | }
  191 | 
  192 | function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  193 |   const toRad = (deg) => (deg * Math.PI) / 180
  194 |   const r = 6371
  195 |   const dLat = toRad(lat2 - lat1)
  196 |   const dLng = toRad(lng2 - lng1)
  197 |   const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  198 |   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  199 |   return r * c
  200 | }
  201 | 
  202 | function bucketResponseTime(avgHours) {
  203 |   if (!Number.isFinite(avgHours) || avgHours <= 0) return 'unknown'
  204 |   if (avgHours <= 4) return '0-4h'
  205 |   if (avgHours <= 12) return '4-12h'
  206 |   if (avgHours <= 24) return '12-24h'
  207 |   return '24h+'
  208 | }
  209 | 
  210 | function bucketYearsInBusiness(value) {
  211 |   const years = Number(value)
  212 |   if (!Number.isFinite(years) || years <= 0) return 'unknown'
  213 |   if (years <= 2) return '0-2y'
  214 |   if (years <= 5) return '3-5y'
  215 |   if (years <= 10) return '6-10y'
  216 |   return '10y+'
  217 | }
  218 | 
  219 | function bucketTeamSeats(value) {
  220 |   const seats = Number(value)
  221 |   if (!Number.isFinite(seats) || seats <= 0) return 'unknown'
  222 |   if (seats <= 5) return '1-5'
  223 |   if (seats <= 10) return '6-10'
  224 |   if (seats <= 20) return '11-20'
  225 |   return '20+'
  226 | }
  227 | 
  228 | function computeAuditScore(company = {}, certification = null) {
  229 |   const profile = company?.profile || {}
  230 |   const certs = Array.isArray(profile?.certifications) ? profile.certifications : []
  231 |   let score = 0
  232 |   // Certifications contribute up to 60 points
  233 |   score += Math.min(certs.length * 20, 60)
  234 | 
  235 |   // Recent audit date boosts score
  236 |   const rawAudit = String(profile?.audit_date || company?.audit_date || '').trim()
  237 |   if (rawAudit) {
  238 |     const ts = Date.parse(rawAudit)
  239 |     if (!Number.isNaN(ts)) {
  240 |       const days = (Date.now() - ts) / (1000 * 60 * 60 * 24)
  241 |       if (days <= 365) score += 30
  242 |       else if (days <= 730) score += 15
  243 |     }
  244 |   }
  245 | 
  246 |   // Order certification adds modest bump
  247 |   const certStatus = String(certification?.status || company?.order_certification_status || '').toLowerCase()
  248 |   if (certStatus === 'certified') score += 10
  249 | 
  250 |   if (score > 100) score = 100
  251 |   if (score <= 0) return null
  252 |   return Math.round(score)
  253 | }
  254 | 
  255 | function topFacetEntries(counts = {}, limit = 8) {
  256 |   return Object.fromEntries(
  257 |     Object.entries(counts)
  258 |       .sort((a, b) => b[1] - a[1])
  259 |       .slice(0, limit),
  260 |   )
  261 | }
  262 | 
  263 | async function resolveActor(req) {
  264 |   if (!req.user || req.user.role !== 'agent') return req.user
  265 |   const actor = await findUserById(req.user.id)
  266 |   return actor || req.user
  267 | }
  268 | 
  269 | export async function postProduct(req, res) {
  270 |   try {
  271 |     const actor = await resolveActor(req)
  272 |     const row = await createProduct(actor, req.body)
  273 |     return res.status(201).json(row)
  274 |   } catch (error) {
  275 |     return handleControllerError(res, error)
  276 |   }
  277 | }
  278 | 
  279 | export async function getProducts(req, res) {
  280 |   const mine = req.query.mine === 'true'
  281 |   const category = req.query.category || ''
  282 |   const actor = await resolveActor(req)
  283 |   const companyId = mine
  284 |     ? (actor?.role === 'agent' ? String(actor?.org_owner_id || '') : String(actor?.id || ''))
  285 |     : ''
  286 |   if (mine && actor?.role === 'agent' && !actor?.permission_matrix?.products?.edit) {
  287 |     return res.status(403).json({ error: 'Forbidden' })
  288 |   }
  289 |   if (mine && actor?.role === 'agent' && !companyId) {
  290 |     return res.status(403).json({ error: 'Forbidden' })
  291 |   }
  292 |   return res.json(await listProducts({
  293 |     category,
  294 |     companyId,
  295 |     includeDrafts: mine,
  296 |     viewerId: companyId,
  297 |     viewerRole: actor?.role || '',
  298 |   }))
  299 | }
  300 | 
  301 | export async function searchProducts(req, res) {
  302 |   await recordWorkflowEvent('search_open', {
  303 |     search_source: 'products_search',
  304 |     product_id: req.query.product_id || req.query.id || '',
  305 |   }, { actor_id: req.user.id }).catch(() => null)
  306 |   const plan = await getUserPlan(req.user.id)
  307 |   const priorityOnly = req.query.priorityOnly === 'true'
  308 |   if (priorityOnly) {
  309 |     await ensureEntitlement(req.user, 'priority_search_ranking', 'Premium plan required for priority search filter.')
  310 |   }
  311 | 
  312 |   const estimateOnly = String(req.query.estimateOnly || '').toLowerCase() === 'true'
  313 |   const cursor = Number.isFinite(Number(req.query.cursor)) ? Math.max(0, Math.floor(Number(req.query.cursor))) : 0
  314 |   const limitRaw = Number.isFinite(Number(req.query.limit)) ? Math.floor(Number(req.query.limit)) : 50
  315 |   const limit = estimateOnly ? 0 : Math.min(50, Math.max(1, limitRaw))
  316 | 
  317 |   const advancedFilters = extractUsedAdvancedFilters(req.query)
  318 |   const quotaPreview = advancedFilters.length > 0
  319 |     ? await getQuotaSnapshot(req.user.id, 'products_search', plan)
  320 |     : null
  321 | 
  322 |   if (advancedFilters.length > 0 && !canUseAdvancedFilters(plan)) {
  323 |     return res.status(403).json(buildLimitError({
  324 |       code: 'upgrade_required',
  325 |       message: 'Advanced filters require a premium plan',
  326 |       quota: quotaPreview,
  327 |       missingFilters: advancedFilters,
  328 |       upgradeRequired: true,
  329 |     }))
  330 |   }
  331 | 
  332 |   let quotaUse = { allowed: true, quota: { action: 'products_search', plan, unlimited: true } }
  333 |   if (advancedFilters.length > 0) {
  334 |     if (quotaPreview && quotaPreview.remaining <= 0) {
  335 |       return res.status(429).json(buildLimitError({
  336 |         code: 'limit_reached',
  337 |         message: 'Daily product search limit reached',
  338 |         quota: quotaPreview,
  339 |       }))
  340 |     }
  341 |     quotaUse = estimateOnly
  342 |       ? { allowed: true, quota: quotaPreview }
  343 |       : await consumeQuota(req.user.id, 'products_search', plan)
  344 |     if (!quotaUse.allowed) {
  345 |       return res.status(429).json(buildLimitError({
  346 |         code: 'limit_reached',
  347 |         message: 'Daily product search limit reached',
  348 |         quota: quotaUse.quota,
  349 |       }))
  350 |     }
  351 |   }
  352 | 
  353 |   const q = String(req.query.q || '').trim()
  354 |   const searchTokens = buildSearchTokens(q)
  355 |   const wantedIndustry = String(req.query.industry || '').trim().toLowerCase()
  356 |   const wantedCountry = String(req.query.country || '').trim().toLowerCase()
  357 |   const wantedOrgType = String(req.query.orgType || '').trim().toLowerCase()
  358 |   const verifiedOnly = req.query.verifiedOnly === 'true'
  359 |   const moqRange = String(req.query.moqRange || '').trim()
  360 |   const priceRange = String(req.query.priceRange || '').trim()
  361 |   const priceCurrency = String(req.query.priceCurrency || req.query.currency || '').trim().toUpperCase()
  362 |   const wantedCategories = parseList(req.query.category)
  363 |   const wantedCertificationsRaw = String(req.query.certifications || '').trim()
  364 |   const wantedCertifications = wantedCertificationsRaw
  365 |     ? wantedCertificationsRaw.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean)
  366 |     : []
  367 |   const leadTimeMax = parseNumber(req.query.leadTimeMax)
  368 |   const capacityMin = parseNumber(req.query.capacityMin)
  369 |   const gsmMin = parseNumber(req.query.gsmMin)
  370 |   const gsmMax = parseNumber(req.query.gsmMax)
  371 |   const wantedFabricTypes = parseList(req.query.fabricType)
  372 |   const wantedSizeRange = String(req.query.sizeRange || '').trim().toLowerCase()
  373 |   const wantedColorPantone = parseList(req.query.colorPantone)
  374 |   const wantedCustomization = parseList(req.query.customization)
  375 |   const sampleAvailable = req.query.sampleAvailable === 'true'
  376 |   const sampleLeadTimeMax = parseNumber(req.query.sampleLeadTime)
  377 |   const wantedPaymentTerms = parseList(req.query.paymentTerms)
  378 |   const wantedDocumentReady = parseList(req.query.documentReady)
  379 |   const wantedAuditDate = String(req.query.auditDate || '').trim().toLowerCase()
  380 |   const wantedLanguage = parseList(req.query.languageSupport)
  381 |   const wantedIncoterms = parseList(req.query.incoterms)
  382 |   const processes = parseList(req.query.processes)
  383 |   const yearsInBusinessMin = parseNumber(req.query.yearsInBusinessMin)
  384 |   const responseTimeMax = parseNumber(req.query.responseTimeMax)
  385 |   const teamSeatsMin = parseNumber(req.query.teamSeatsMin)
  386 |   const handlesMultipleFactoriesFilter = req.query.handlesMultipleFactories !== undefined
  387 |     ? parseBoolean(req.query.handlesMultipleFactories)
  388 |     : null
  389 |   const exportPorts = parseList(req.query.exportPort)
  390 |   const hasPermissionMatrixFilter = req.query.hasPermissionMatrix !== undefined
  391 |     ? parseBoolean(req.query.hasPermissionMatrix)
  392 |     : null
  393 |   const auditScoreMin = parseNumber(req.query.auditScoreMin)
  394 |   const permissionSection = String(req.query.permissionSection || '').trim().toLowerCase()
  395 |   const permissionSectionEdit = req.query.permissionSectionEdit !== undefined
  396 |     ? parseBoolean(req.query.permissionSectionEdit)
  397 |     : null
  398 |   const roleSeatsRaw = String(req.query.roleSeats || '').trim()
  399 |   const roleSeatsMap = {}
  400 |   if (roleSeatsRaw) {
  401 |     for (const part of roleSeatsRaw.split(',')) {
  402 |       const [roleRaw, seatsRaw] = String(part || '').split(':').map((s) => (s || '').trim())
  403 |       if (!roleRaw) continue
  404 |       const n = parseNumber(seatsRaw)
  405 |       if (n !== null) roleSeatsMap[String(roleRaw).toLowerCase()] = n
  406 |     }
  407 |   }
  408 |   const distanceKm = parseNumber(req.query.distanceKm)
  409 |   const locationLat = parseCoordinate(req.query.locationLat)
  410 |   const locationLng = parseCoordinate(req.query.locationLng)
  411 |   const distanceFilterActive = distanceKm !== null && locationLat !== null && locationLng !== null
  412 |   const baseCurrency = await getBaseCurrency()
  413 |   let fxStale = false
  414 |   let priceRangeBase = ''
  415 |   if (priceRange) {
  416 |     const parsed = parseRange(priceRange)
  417 |     const fromCurrency = priceCurrency || baseCurrency
  418 |     const minConv = parsed.min === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.min, fromCurrency, baseCurrency)
  419 |     const maxConv = parsed.max === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.max, fromCurrency, baseCurrency)
  420 |     fxStale = Boolean(minConv.fx_stale || maxConv.fx_stale || (parsed.min !== null && minConv.amount === null) || (parsed.max !== null && maxConv.amount === null))
  421 |     const minText = minConv.amount !== null ? String(minConv.amount) : ''
  422 |     const maxText = maxConv.amount !== null ? String(maxConv.amount) : ''
  423 |     priceRangeBase = [minText, maxText].filter((v, idx) => v || idx === 0).join('-')
  424 |   }
  425 | 
  426 |   const openSearchReady = await isOpenSearchConfigured()
  427 |   const openSearchResult = openSearchReady
  428 |     ? await searchOpenSearch({
  429 |       index: 'products',
  430 |       query: q,
  431 |       cursor,
  432 |       limit,
  433 |       estimateOnly,
  434 |       filters: {
  435 |         industry: wantedIndustry,
  436 |         country: wantedCountry,
  437 |         orgType: wantedOrgType,
  438 |         verifiedOnly,
  439 |         category: wantedCategories,
  440 |         moqRange,
  441 |         priceRangeBase: priceRangeBase || priceRange,
  442 |         leadTimeMax,
  443 |         gsmMin,
  444 |         gsmMax,
  445 |         capacityMin,
  446 |         yearsInBusinessMin,
  447 |         responseTimeMax,
  448 |         teamSeatsMin,
  449 |         ...(handlesMultipleFactoriesFilter === null ? {} : { handlesMultipleFactories: handlesMultipleFactoriesFilter }),
  450 |         ...(hasPermissionMatrixFilter === null ? {} : { hasPermissionMatrix: hasPermissionMatrixFilter }),
  451 |         ...(auditScoreMin === null ? {} : { auditScoreMin }),
  452 |         ...(permissionSection ? { permissionSection } : {}),
  453 |         ...(permissionSectionEdit === null ? {} : { permissionSectionEdit }),
  454 |         ...(roleSeatsRaw ? { roleSeats: roleSeatsRaw } : {}),
  455 |         fabricType: wantedFabricTypes,
  456 |         certifications: wantedCertifications,
  457 |         incoterms: wantedIncoterms,
  458 |         paymentTerms: wantedPaymentTerms,
  459 |         documentReady: wantedDocumentReady,
  460 |         languageSupport: wantedLanguage,
  461 |         processes,
  462 |         exportPort: exportPorts,
  463 |         auditDate: wantedAuditDate,
  464 |         sizeRange: wantedSizeRange,
  465 |         colorPantone: wantedColorPantone,
  466 |         customization: wantedCustomization,
  467 |         sampleAvailable,
  468 |         sampleLeadTimeMax,
  469 |         locationLat,
  470 |         locationLng,
  471 |         distanceKm,
  472 |       },
  473 |     })
  474 |     : null
  475 |   const openSearchIds = Array.isArray(openSearchResult?.ids) ? openSearchResult.ids.map(String) : []
  476 |   const openSearchIdSet = openSearchIds.length ? new Set(openSearchIds) : null
  477 |   const engine = openSearchResult?.engine || 'fallback_json'
  478 | 
  479 |   if (estimateOnly && engine === 'opensearch') {
  480 |     const resolvedFacets = openSearchResult?.facets
  481 |       ? { ...openSearchResult.facets, category: openSearchResult.facets.category || openSearchResult.facets.categories || {} }
  482 |       : {}
  483 |     return res.json({
  484 |       engine,
  485 |       cursor,
  486 |       limit,
  487 |       total: Number(openSearchResult?.total || 0),
  488 |       next_cursor: null,
  489 |       items: [],
  490 |       facets: resolvedFacets,
  491 |       ...(openSearchResult?.error_code ? { error_code: openSearchResult.error_code } : {}),
  492 |       ...buildSearchAccessPayload({
  493 |         action: 'products_search',
  494 |         plan,
  495 |         quota: quotaUse.quota,
  496 |       }),
  497 |     })
  498 |   }
  499 | 
  500 |   const all = await listProducts({})
  501 |   const [users, messages, boostMap, orderCertMap] = await Promise.all([
  502 |     readJson('users.json'),
  503 |     readJson('messages.json'),
  504 |     getActiveBoostMap('feed'),
  505 |     getOrderCertificationMap(),
  506 |   ])
  507 |   const usersById = new Map(users.map((u) => [u.id, u]))
  508 |   const responseTimeByOwner = buildResponseTimeByOwner(messages, users)
  509 | 
  510 |   const results = all
  511 |     .map((p) => {
  512 |       const company = usersById.get(p.company_id) || null
  513 |       const companyPremium = String(company?.subscription_status || '').toLowerCase() === 'premium'
  514 |       const certification = company ? orderCertMap.get(String(company.id)) : null
  515 |       const authorCountry = String(company?.profile?.country || '').trim()
  516 |       const profile = company?.profile || {}
  517 |       const paidBoostMultiplier = Number(boostMap?.[String(p.company_id)] || 1)
  518 |       const premiumBoostMultiplier = companyPremium ? 1.1 : 1
  519 |       const effectiveBoost = (Number.isFinite(paidBoostMultiplier) ? paidBoostMultiplier : 1) * premiumBoostMultiplier
  520 |       const boostActive = effectiveBoost > 1
  521 |       const priorityScore = (companyPremium ? 2 : 0) + (company?.verified ? 0.5 : 0) + (boostActive ? 1.25 : 0)
  522 | 
  523 |       return {
  524 |         ...p,
  525 |         author: company ? {
  526 |           id: company.id,
  527 |           name: company.name,
  528 |           role: company.role,
  529 |           verified: Boolean(company.verified),
  530 |           premium: companyPremium,
  531 |           country: authorCountry,
  532 |           industry: String(profile?.industry || ''),
  533 |           certifications: Array.isArray(profile?.certifications) ? profile.certifications : [],
  534 |           monthly_capacity: profile?.monthly_capacity || '',
  535 |           lead_time_days: profile?.lead_time_days || '',
  536 |           payment_terms: profile?.payment_terms || '',
  537 |           document_ready: profile?.document_ready || '',
  538 |           audit_date: profile?.audit_date || '',
  539 |           language_support: profile?.language_support || '',
  540 |           incoterms: profile?.incoterms || '',
  541 |           main_processes: Array.isArray(profile?.main_processes) ? profile.main_processes : [],
  542 |           years_in_business: profile?.years_in_business || '',
  543 |           handles_multiple_factories: Boolean(profile?.handles_multiple_factories),
  544 |           team_seats: profile?.team_seats || '',
  545 |           export_ports: Array.isArray(profile?.export_ports) ? profile.export_ports : [],
  546 |           location_lat: profile?.location_lat ?? '',
  547 |           location_lng: profile?.location_lng ?? '',
  548 |           avg_response_hours: responseTimeByOwner.get(String(company.id)) ?? null,
  549 |           order_certification_status: certification?.status || '',
  550 |           permission_matrix: profile?.permission_matrix || company?.permission_matrix || null,
  551 |           has_permission_matrix: Boolean(profile?.permission_matrix || company?.permission_matrix),
  552 |           role_seats: profile?.role_seats || profile?.roleSeats || (profile?.permission_matrix?.members?.seats || null),
  553 |           audit_score: computeAuditScore(company, certification),
  554 |         } : { id: p.company_id, name: 'Unknown company', role: 'factory', verified: false, country: '' },
  555 |         profile_key: `user:${p.company_id}`,
  556 |         priority_score: priorityScore,
  557 |         priority_active: companyPremium || boostActive,
  558 |         boost_active: boostActive,
  559 |         boost_multiplier: Number.isFinite(effectiveBoost) ? Number(effectiveBoost.toFixed(2)) : 1,
  560 |       }
  561 |     })
  562 |     .filter((p) => {
  563 |       if (openSearchIdSet) {
  564 |         if (!openSearchIdSet.has(String(p.id))) return false
  565 |         if (priorityOnly && !p.priority_active) return false
  566 |         return true
  567 |       }
  568 |       if (priorityOnly && !p.priority_active) return false
  569 |       if (searchTokens.length) {
  570 |         const searchText = normalizeSearchText(`${p.title} ${p.category} ${p.material} ${p.description} ${p.color_pantone || ''} ${p.size_range || ''}`)
  571 |         const hit = searchTokens.every((token) => searchText.includes(token))
  572 |         if (!hit) return false
  573 |       }
  574 |       if (wantedCategories.length > 0) {
  575 |         const categoryValue = String(p.category || '').toLowerCase()
  576 |         if (!wantedCategories.includes(categoryValue)) return false
  577 |       }
  578 |       if (wantedIndustry) {
  579 |         const productIndustry = String(p.industry || '').toLowerCase()
  580 |         const authorIndustry = String(p.author?.industry || '').toLowerCase()
  581 |         if (productIndustry !== wantedIndustry && authorIndustry !== wantedIndustry) return false
  582 |       }
  583 |       if (wantedOrgType && String(p.author?.role || '').toLowerCase() !== wantedOrgType) return false
  584 |       if (wantedCountry && String(p.author?.country || '').toLowerCase() !== wantedCountry) return false
  585 |       if (verifiedOnly && !p.author?.verified) return false
  586 |       if (moqRange && !matchesMoqRange(moqRange, p.moq)) return false
  587 |       if (priceRangeBase) {
  588 |         const normalizedMin = Number.isFinite(Number(p.priceBaseMin)) ? Number(p.priceBaseMin) : Number(p.priceNormalizedBase)
  589 |         const normalizedMax = Number.isFinite(Number(p.priceBaseMax)) ? Number(p.priceBaseMax) : Number(p.priceNormalizedBase)
  590 |         if (Number.isFinite(normalizedMin) || Number.isFinite(normalizedMax)) {
  591 |           const synthetic = `${Number.isFinite(normalizedMin) ? normalizedMin : ''}-${Number.isFinite(normalizedMax) ? normalizedMax : ''}`
  592 |           if (!rangesOverlap(priceRangeBase, synthetic)) return false
  593 |         } else if (!rangesOverlap(priceRange, p.price_range || '')) return false
  594 |       }
  595 |       if (leadTimeMax !== null) {
  596 |         const lead = parseNumber(p.lead_time_days || p.author?.lead_time_days || '')
  597 |         if (lead === null || lead > leadTimeMax) return false
  598 |       }
  599 |       if (capacityMin !== null) {
  600 |         const cap = parseNumber(p.author?.monthly_capacity || '')
  601 |         if (cap === null || cap < capacityMin) return false
  602 |       }
  603 |       if (gsmMin !== null || gsmMax !== null) {
  604 |         const gsm = parseNumber(p.fabric_gsm || '')
  605 |         if (gsm === null) return false
  606 |         if (gsmMin !== null && gsm < gsmMin) return false
  607 |         if (gsmMax !== null && gsm > gsmMax) return false
  608 |       }
  609 |       if (wantedCertifications.length > 0) {
  610 |         const authorCerts = Array.isArray(p.author?.certifications) ? p.author.certifications.map((c) => String(c).toLowerCase()) : []
  611 |         const hit = wantedCertifications.some((c) => authorCerts.includes(c))
  612 |         if (!hit) return false
  613 |       }
  614 |       if (wantedFabricTypes.length > 0) {
  615 |         const material = String(p.material || '').toLowerCase()
  616 |         const hit = wantedFabricTypes.some((fabric) => material.includes(fabric))
  617 |         if (!hit) return false
  618 |       }
  619 |       if (wantedSizeRange && !String(p.size_range || '').toLowerCase().includes(wantedSizeRange)) return false
  620 |       if (wantedColorPantone.length > 0) {
  621 |         const color = String(p.color_pantone || '').toLowerCase()
  622 |         const hit = wantedColorPantone.some((code) => color.includes(code))
  623 |         if (!hit) return false
  624 |       }
  625 |       if (wantedCustomization.length > 0) {
  626 |         const customization = String(p.customization_capabilities || '').toLowerCase()
  627 |         const hit = wantedCustomization.some((entry) => customization.includes(entry))
  628 |         if (!hit) return false
  629 |       }
  630 |       if (sampleAvailable) {
  631 |         const available = String(p.sample_available || '').toLowerCase()
  632 |         if (!(available === 'true' || available === 'yes' || p.sample_lead_time_days)) return false
  633 |       }
  634 |       if (sampleLeadTimeMax !== null) {
  635 |         const sampleLead = parseNumber(p.sample_lead_time_days || '')
  636 |         if (sampleLead === null || sampleLead > sampleLeadTimeMax) return false
  637 |       }
  638 |       if (wantedPaymentTerms.length > 0) {
  639 |         const payment = String(p.author?.payment_terms || '').toLowerCase()
  640 |         const hit = wantedPaymentTerms.some((term) => payment.includes(term))
  641 |         if (!hit) return false
  642 |       }
  643 |       if (wantedDocumentReady.length > 0) {
  644 |         const doc = String(p.author?.document_ready || '').toLowerCase()
  645 |         const hit = wantedDocumentReady.some((term) => doc.includes(term))
  646 |         if (!hit) return false
  647 |       }
  648 |       if (wantedAuditDate && String(p.author?.audit_date || '').toLowerCase() !== wantedAuditDate) return false
  649 |       if (wantedLanguage.length > 0) {
  650 |         const lang = String(p.author?.language_support || '').toLowerCase()
  651 |         const hit = wantedLanguage.some((term) => lang.includes(term))
  652 |         if (!hit) return false
  653 |       }
  654 |       if (wantedIncoterms.length > 0) {
  655 |         const incoterm = String(p.author?.incoterms || '').toLowerCase()
  656 |         const hit = wantedIncoterms.some((term) => incoterm.includes(term))
  657 |         if (!hit) return false
  658 |       }
  659 |       if (processes.length > 0) {
  660 |         const authorProcesses = Array.isArray(p.author?.main_processes)
  661 |           ? p.author.main_processes.map((proc) => String(proc).toLowerCase())
  662 |           : []
  663 |         const hit = processes.some((proc) => authorProcesses.includes(proc))
  664 |         if (!hit) return false
  665 |       }
  666 |       if (yearsInBusinessMin !== null) {
  667 |         const years = parseNumber(p.author?.years_in_business || '')
  668 |         if (years === null || years < yearsInBusinessMin) return false
  669 |       }
  670 |       if (teamSeatsMin !== null) {
  671 |         const seats = parseNumber(p.author?.team_seats || '')
  672 |         if (seats === null || seats < teamSeatsMin) return false
  673 |       }
  674 |       if (roleSeatsMap && Object.keys(roleSeatsMap).length) {
  675 |         const profileRoleSeats = p.author?.role_seats || p.author?.roleSeats || {}
  676 |         const permMemberSeats = p.author?.permission_matrix?.members?.seats || null
  677 |         for (const [roleKey, minSeats] of Object.entries(roleSeatsMap)) {
  678 |           let ownerSeats = null
  679 |           if (profileRoleSeats && profileRoleSeats[roleKey] !== undefined) {
  680 |             ownerSeats = parseNumber(profileRoleSeats[roleKey])
  681 |           } else if (permMemberSeats && permMemberSeats[roleKey] !== undefined) {
  682 |             ownerSeats = parseNumber(permMemberSeats[roleKey])
  683 |           } else {
  684 |             ownerSeats = parseNumber(p.author?.team_seats || '')
  685 |           }
  686 |           if (!Number.isFinite(ownerSeats) || ownerSeats < minSeats) return false
  687 |         }
  688 |       }
  689 |       if (handlesMultipleFactoriesFilter !== null) {
  690 |         if (Boolean(p.author?.handles_multiple_factories) !== handlesMultipleFactoriesFilter) return false
  691 |       }
  692 |       if (hasPermissionMatrixFilter !== null) {
  693 |         const hasPerm = Boolean(p.author?.has_permission_matrix)
  694 |         if (hasPermissionMatrixFilter !== hasPerm) return false
  695 |       }
  696 |       if (permissionSection) {
  697 |         const pm = p.author?.permission_matrix || null
  698 |         const sec = pm && pm[permissionSection] ? pm[permissionSection] : null
  699 |         const hasView = Boolean(sec && sec.view)
  700 |         const hasEdit = Boolean(sec && sec.edit)
  701 |         if (permissionSectionEdit === null) {
  702 |           if (!hasView && !hasEdit) return false
  703 |         } else if (permissionSectionEdit === true) {
  704 |           if (!hasEdit) return false
  705 |         } else if (permissionSectionEdit === false) {
  706 |           if (!hasView) return false
  707 |         }
  708 |       }
  709 |       if (auditScoreMin !== null) {
  710 |         const score = Number(p.author?.audit_score)
  711 |         if (!Number.isFinite(score) || score < auditScoreMin) return false
  712 |       }
  713 |       if (exportPorts.length > 0) {
  714 |         const authorPorts = Array.isArray(p.author?.export_ports)
  715 |           ? p.author.export_ports.map((port) => String(port).toLowerCase())
  716 |           : []
  717 |         const hit = exportPorts.some((port) => authorPorts.includes(port))
  718 |         if (!hit) return false
  719 |       }
  720 |       if (responseTimeMax !== null) {
  721 |         const avg = Number(p.author?.avg_response_hours)
  722 |         if (!Number.isFinite(avg) || avg > responseTimeMax) return false
  723 |       }
  724 |       if (distanceFilterActive) {
  725 |         const authorLat = parseCoordinate(p.author?.location_lat)
  726 |         const authorLng = parseCoordinate(p.author?.location_lng)
  727 |         if (authorLat !== null && authorLng !== null) {
  728 |           const distance = haversineDistanceKm(locationLat, locationLng, authorLat, authorLng)
  729 |           if (!Number.isFinite(distance) || distance > distanceKm) return false
  730 |         } else if (!wantedCountry) {
  731 |           return false
  732 |         }
  733 |       }
  734 |       return true
  735 |     })
  736 | 
  737 |   const sortedResults = results
  738 |     .sort((a, b) => {
  739 |       if (a.priority_score !== b.priority_score) return b.priority_score - a.priority_score
  740 |       const aCreated = new Date(a.created_at || '').getTime()
  741 |       const bCreated = new Date(b.created_at || '').getTime()
  742 |       if (Number.isFinite(aCreated) && Number.isFinite(bCreated)) return bCreated - aCreated
  743 |       return 0
  744 |     })
  745 | 
  746 |   const orderedResults = (() => {
  747 |     if (!openSearchIdSet) return sortedResults
  748 |     const byId = new Map(sortedResults.map((row) => [String(row.id), row]))
  749 |     return openSearchIds.map((id) => byId.get(String(id))).filter(Boolean)
  750 |   })()
  751 | 
  752 |   const totalMatched = engine === 'opensearch' ? Number(openSearchResult?.total || 0) : orderedResults.length
  753 |   const pagedItems = engine === 'opensearch'
  754 |     ? orderedResults
  755 |     : orderedResults.slice(cursor, cursor + limit)
  756 |   const nextCursor = estimateOnly
  757 |     ? null
  758 |     : (engine === 'opensearch'
  759 |         ? (cursor + openSearchIds.length < totalMatched ? cursor + openSearchIds.length : null)
  760 |         : (cursor + pagedItems.length < totalMatched ? cursor + pagedItems.length : null))
  761 | 
  762 |   const facets = orderedResults.reduce((acc, row) => {
  763 |     const category = String(row.category || 'Other')
  764 |     const country = String(row.author?.country || 'Unknown')
  765 |     acc.categories[category] = (acc.categories[category] || 0) + 1
  766 |     acc.countries[country] = (acc.countries[country] || 0) + 1
  767 |     acc.verified[row.author?.verified ? 'verified' : 'unverified'] += 1
  768 |     const material = String(row.material || '').trim()
  769 |     if (material) acc.fabricType[material] = (acc.fabricType[material] || 0) + 1
  770 |     const certifications = Array.isArray(row.author?.certifications) ? row.author.certifications : []
  771 |     certifications.forEach((cert) => {
  772 |       const key = String(cert || 'Other')
  773 |       acc.certifications[key] = (acc.certifications[key] || 0) + 1
  774 |     })
  775 |     const incoterm = String(row.author?.incoterms || '').trim()
  776 |     if (incoterm) acc.incoterms[incoterm] = (acc.incoterms[incoterm] || 0) + 1
  777 |     const payment = String(row.author?.payment_terms || '').trim()
  778 |     if (payment) acc.paymentTerms[payment] = (acc.paymentTerms[payment] || 0) + 1
  779 |     const documentReady = String(row.author?.document_ready || '').trim()
  780 |     if (documentReady) acc.documentReady[documentReady] = (acc.documentReady[documentReady] || 0) + 1
  781 |     const language = String(row.author?.language_support || '').trim()
  782 |     if (language) acc.languageSupport[language] = (acc.languageSupport[language] || 0) + 1
  783 |     const processesList = Array.isArray(row.author?.main_processes) ? row.author.main_processes : []
  784 |     processesList.forEach((proc) => {
  785 |       const key = String(proc || 'Other')
  786 |       acc.processes[key] = (acc.processes[key] || 0) + 1
  787 |     })
  788 |     const exportPortsList = Array.isArray(row.author?.export_ports) ? row.author.export_ports : []
  789 |     exportPortsList.forEach((port) => {
  790 |       const key = String(port || 'Other')
  791 |       acc.export_ports[key] = (acc.export_ports[key] || 0) + 1
  792 |     })
  793 |     const responseBucket = bucketResponseTime(Number(row.author?.avg_response_hours))
  794 |     acc.response_time[responseBucket] = (acc.response_time[responseBucket] || 0) + 1
  795 |     const yearsBucket = bucketYearsInBusiness(row.author?.years_in_business)
  796 |     acc.years_in_business[yearsBucket] = (acc.years_in_business[yearsBucket] || 0) + 1
  797 |     const seatsBucket = bucketTeamSeats(row.author?.team_seats)
  798 |     acc.team_seats[seatsBucket] = (acc.team_seats[seatsBucket] || 0) + 1
  799 |     const handlesKey = row.author?.handles_multiple_factories ? 'true' : 'false'
  800 |     acc.handles_multiple_factories[handlesKey] = (acc.handles_multiple_factories[handlesKey] || 0) + 1
  801 |     return acc
  802 |   }, {
  803 |     categories: {},
  804 |     countries: {},
  805 |     verified: { verified: 0, unverified: 0 },
  806 |     processes: {},
  807 |     export_ports: {},
  808 |     response_time: {},
  809 |     years_in_business: {},
  810 |     team_seats: {},
  811 |     handles_multiple_factories: {},
  812 |     fabricType: {},
  813 |     certifications: {},
  814 |     incoterms: {},
  815 |     paymentTerms: {},
  816 |     documentReady: {},
  817 |     languageSupport: {},
  818 |   })
  819 | 
  820 |   const cappedFacets = {
  821 |     ...facets,
  822 |     category: facets.categories || facets.category || {},
  823 |     processes: topFacetEntries(facets.processes, 8),
  824 |     export_ports: topFacetEntries(facets.export_ports, 8),
  825 |   }
  826 | 
  827 |   const resolvedFacets = openSearchResult?.facets
  828 |     ? { ...openSearchResult.facets, category: openSearchResult.facets.category || openSearchResult.facets.categories || {} }
  829 |     : cappedFacets
  830 | 
  831 |   return res.json({
  832 |     engine,
  833 |     cursor,
  834 |     limit,
  835 |     total: totalMatched,
  836 |     next_cursor: nextCursor,
  837 |     items: pagedItems,
  838 |     facets: resolvedFacets,
  839 |     ...(openSearchResult?.error_code ? { error_code: openSearchResult.error_code } : {}),
  840 |     ...buildSearchAccessPayload({
  841 |       action: 'products_search',
  842 |       plan,
  843 |       quota: quotaUse.quota,
  844 |     }),
  845 |     fx: {
  846 |       base_currency: baseCurrency,
  847 |       filter_currency: priceCurrency || baseCurrency,
  848 |       fx_stale: fxStale,
  849 |     },
  850 |   })
  851 | }
  852 | 
  853 | export async function updateProduct(req, res) {
  854 |   const actor = await resolveActor(req)
  855 |   const updated = await updateProductById(actor, req.params.productId, req.body || {})
  856 |   if (updated === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  857 |   if (!updated) return res.status(404).json({ error: 'Product not found' })
  858 |   return res.json(updated)
  859 | }
  860 | 
  861 | export async function deleteProduct(req, res) {
  862 |   const actor = await resolveActor(req)
  863 |   const removed = await removeProduct(actor, req.params.productId)
  864 |   if (removed === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  865 |   if (!removed) return res.status(404).json({ error: 'Product not found' })
  866 |   return res.json({ ok: true })
  867 | }
  868 | 
  869 | export async function recordProductView(req, res) {
  870 |   const ip = extractClientIp(req)
  871 |   const geo = ip ? await locateIp(ip) : null
  872 |   const result = await recordView(req.user.id, req.params.productId, { windowMinutes: 10, geo })
  873 |   if (result === 'not_found') return res.status(404).json({ error: 'Product not found' })
  874 |   return res.status(201).json(result)
  875 | }
  876 | 
  877 | export async function getMyViewedProducts(req, res) {
  878 |   const cursor = Number.isFinite(Number(req.query.cursor)) ? Math.max(0, Math.floor(Number(req.query.cursor))) : 0
  879 |   const limitRaw = Number.isFinite(Number(req.query.limit)) ? Math.floor(Number(req.query.limit)) : 10
  880 |   const limit = Math.min(50, Math.max(1, limitRaw))
  881 |   return res.json(await listMyProductViews(req.user.id, { cursor, limit }))
  882 | }
  883 | 