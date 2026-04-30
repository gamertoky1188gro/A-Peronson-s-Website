    1 | import { createRequirement, listRequirements, removeRequirement, getRequirementById, updateRequirement } from '../services/requirementService.js'
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
   12 | import { handleControllerError } from '../utils/permissions.js'
   13 | import { ensureEntitlement } from '../services/entitlementService.js'
   14 | import { generateMatchesForRequirement, listMatchesForRequirement } from '../services/matchingService.js'
   15 | import { getOrderCertificationMap } from '../services/orderCertificationService.js'
   16 | import { isOpenSearchConfigured, searchOpenSearch } from '../services/openSearchService.js'
   17 | import { getBaseCurrency, normalizeMoney } from '../services/currencyService.js'
   18 | import { recordWorkflowEvent } from '../services/workflowLifecycleService.js'
   19 | 
   20 | function redactRequirementForBuyer(requirement) {
   21 |   return {
   22 |     id: requirement.id,
   23 |     buyer_id: requirement.buyer_id,
   24 |     title: requirement.title || requirement.category || 'Buyer Request',
   25 |     request_type: requirement.request_type || 'garments',
   26 |     verified_only: Boolean(requirement.verified_only),
   27 |     specs: requirement.specs || {},
   28 |     quote_deadline: requirement.quote_deadline || null,
   29 |     expires_at: requirement.expires_at || null,
   30 |     max_suppliers: requirement.max_suppliers ?? null,
   31 |     product: requirement.product || requirement.category || '',
   32 |     category: requirement.category || '',
   33 |     quantity: requirement.quantity || '',
   34 |     moq: requirement.moq || '',
   35 |     price_range: requirement.price_range || '',
   36 |     material: requirement.material || '',
   37 |     fabric_gsm: requirement.fabric_gsm || '',
   38 |     target_market: requirement.target_market || '',
   39 |     delivery_timeline: requirement.delivery_timeline || '',
   40 |     certifications_required: Array.isArray(requirement.certifications_required) ? requirement.certifications_required : [],
   41 |     shipping_terms: requirement.shipping_terms || '',
   42 |     ai_summary: requirement.ai_summary || '',
   43 |     status: requirement.status || 'open',
   44 |     created_at: requirement.created_at,
   45 |     redacted: true,
   46 |   }
   47 | }
   48 | 
   49 | function parseNumber(value) {
   50 |   if (value === undefined || value === null) return null
   51 |   const raw = String(value).trim()
   52 |   if (!raw) return null
   53 |   const n = Number(raw.replace(/[^\d.]/g, ''))
   54 |   return Number.isFinite(n) ? n : null
   55 | }
   56 | 
   57 | function parseList(value) {
   58 |   return String(value || '')
   59 |     .split(',')
   60 |     .map((entry) => entry.trim().toLowerCase())
   61 |     .filter(Boolean)
   62 | }
   63 | 
   64 | function parseBoolean(value) {
   65 |   if (typeof value === 'boolean') return value
   66 |   return String(value || '').toLowerCase() === 'true'
   67 | }
   68 | 
   69 | function parseCoordinate(value) {
   70 |   const n = Number(String(value || '').trim())
   71 |   return Number.isFinite(n) ? n : null
   72 | }
   73 | 
   74 | function parseRange(value) {
   75 |   const raw = String(value || '').trim()
   76 |   if (!raw) return { min: null, max: null }
   77 |   const parts = raw.split('-').map((part) => parseNumber(part))
   78 |   const min = Number.isFinite(parts[0]) ? parts[0] : null
   79 |   const max = Number.isFinite(parts[1]) ? parts[1] : null
   80 |   if (min === null && max === null) {
   81 |     const single = parseNumber(raw)
   82 |     return { min: single, max: single }
   83 |   }
   84 |   return { min, max }
   85 | }
   86 | 
   87 | function normalizeSearchText(value) {
   88 |   return String(value || '')
   89 |     .toLowerCase()
   90 |     .normalize('NFKD')
   91 |     .replace(/[\u0300-\u036f]/g, '')
   92 |     .replace(/[^a-z0-9]+/g, ' ')
   93 |     .trim()
   94 | }
   95 | 
   96 | function buildSearchTokens(raw) {
   97 |   const base = normalizeSearchText(raw)
   98 |   if (!base) return []
   99 |   const tokens = base
  100 |     .split(/\s+/)
  101 |     .map((token) => (token === 'woman' ? 'women' : token))
  102 |     .filter(Boolean)
  103 |   return [...new Set(tokens)]
  104 | }
  105 | 
  106 | function rangesOverlap(filterRange, valueRange) {
  107 |   if (!filterRange) return true
  108 |   const filter = parseRange(filterRange)
  109 |   const value = parseRange(valueRange)
  110 |   if (filter.min === null && filter.max === null) return true
  111 |   if (value.min === null && value.max === null) return false
  112 | 
  113 |   const fMin = filter.min ?? filter.max
  114 |   const fMax = filter.max ?? filter.min
  115 |   const vMin = value.min ?? value.max
  116 |   const vMax = value.max ?? value.min
  117 | 
  118 |   if (fMin !== null && vMax !== null && vMax < fMin) return false
  119 |   if (fMax !== null && vMin !== null && vMin > fMax) return false
  120 |   return true
  121 | }
  122 | 
  123 | function _numberInsideRange(value, rangeRaw) {
  124 |   const range = parseRange(rangeRaw)
  125 |   if (!Number.isFinite(value)) return false
  126 |   if (range.min !== null && value < range.min) return false
  127 |   if (range.max !== null && value > range.max) return false
  128 |   return true
  129 | }
  130 | 
  131 | function matchesMoqRange(rawRange, moqValue) {
  132 |   if (!rawRange) return true
  133 |   const moq = Number.isFinite(Number(moqValue)) ? Number(moqValue) : parseNumber(moqValue)
  134 |   if (!Number.isFinite(moq)) return false
  135 | 
  136 |   const range = String(rawRange || '').trim()
  137 |   const parts = range.split('-').map((p) => parseNumber(p))
  138 |   const min = Number.isFinite(parts[0]) ? parts[0] : null
  139 |   const max = Number.isFinite(parts[1]) ? parts[1] : null
  140 | 
  141 |   if (min !== null && moq < min) return false
  142 |   if (max !== null && moq > max) return false
  143 |   return true
  144 | }
  145 | 
  146 | function buildOrgMemberIndex(users = []) {
  147 |   const ownerByMember = new Map()
  148 |   const membersByOwner = new Map()
  149 | 
  150 |   for (const user of users) {
  151 |     const userId = String(user?.id || '')
  152 |     if (!userId) continue
  153 |     const role = String(user?.role || '').toLowerCase()
  154 |     const ownerId = role === 'agent' && user?.org_owner_id ? String(user.org_owner_id) : userId
  155 |     ownerByMember.set(userId, ownerId)
  156 |     if (!membersByOwner.has(ownerId)) membersByOwner.set(ownerId, new Set([ownerId]))
  157 |     membersByOwner.get(ownerId).add(userId)
  158 |   }
  159 | 
  160 |   return { ownerByMember, membersByOwner }
  161 | }
  162 | 
  163 | function buildResponseTimeByOwner(messages = [], users = []) {
  164 |   const { ownerByMember } = buildOrgMemberIndex(users)
  165 |   const messagesByMatch = new Map()
  166 | 
  167 |   for (const msg of messages) {
  168 |     const matchId = String(msg?.match_id || '')
  169 |     if (!matchId || matchId.startsWith('friend:')) continue
  170 |     if (!messagesByMatch.has(matchId)) messagesByMatch.set(matchId, [])
  171 |     messagesByMatch.get(matchId).push(msg)
  172 |   }
  173 | 
  174 |   const responseTimes = new Map()
  175 | 
  176 |   for (const msgs of messagesByMatch.values()) {
  177 |     const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
  178 |     const ownersInMatch = new Set(sorted.map((m) => ownerByMember.get(String(m.sender_id || '')) || String(m.sender_id || '')).filter(Boolean))
  179 | 
  180 |     for (const ownerId of ownersInMatch) {
  181 |       let inboundAt = null
  182 |       for (const message of sorted) {
  183 |         const senderOwner = ownerByMember.get(String(message.sender_id || '')) || String(message.sender_id || '')
  184 |         if (!senderOwner || senderOwner === ownerId) continue
  185 |         const ts = new Date(message.timestamp || '').getTime()
  186 |         if (!Number.isFinite(ts)) continue
  187 |         inboundAt = ts
  188 |         break
  189 |       }
  190 |       if (!inboundAt) continue
  191 | 
  192 |       let outboundAt = null
  193 |       for (const message of sorted) {
  194 |         const senderOwner = ownerByMember.get(String(message.sender_id || '')) || String(message.sender_id || '')
  195 |         if (!senderOwner || senderOwner !== ownerId) continue
  196 |         const ts = new Date(message.timestamp || '').getTime()
  197 |         if (!Number.isFinite(ts) || ts < inboundAt) continue
  198 |         outboundAt = ts
  199 |         break
  200 |       }
  201 |       if (!outboundAt) continue
  202 | 
  203 |       const hours = (outboundAt - inboundAt) / (1000 * 60 * 60)
  204 |       if (!responseTimes.has(ownerId)) responseTimes.set(ownerId, [])
  205 |       responseTimes.get(ownerId).push(hours)
  206 |     }
  207 |   }
  208 | 
  209 |   const averages = new Map()
  210 |   for (const [ownerId, times] of responseTimes.entries()) {
  211 |     const avg = times.length ? (times.reduce((a, b) => a + b, 0) / times.length) : 0
  212 |     averages.set(ownerId, Math.round(avg * 10) / 10)
  213 |   }
  214 | 
  215 |   return averages
  216 | }
  217 | 
  218 | function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  219 |   const toRad = (deg) => (deg * Math.PI) / 180
  220 |   const r = 6371
  221 |   const dLat = toRad(lat2 - lat1)
  222 |   const dLng = toRad(lng2 - lng1)
  223 |   const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  224 |   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  225 |   return r * c
  226 | }
  227 | 
  228 | function bucketResponseTime(avgHours) {
  229 |   if (!Number.isFinite(avgHours) || avgHours <= 0) return 'unknown'
  230 |   if (avgHours <= 4) return '0-4h'
  231 |   if (avgHours <= 12) return '4-12h'
  232 |   if (avgHours <= 24) return '12-24h'
  233 |   return '24h+'
  234 | }
  235 | 
  236 | function bucketYearsInBusiness(value) {
  237 |   const years = Number(value)
  238 |   if (!Number.isFinite(years) || years <= 0) return 'unknown'
  239 |   if (years <= 2) return '0-2y'
  240 |   if (years <= 5) return '3-5y'
  241 |   if (years <= 10) return '6-10y'
  242 |   return '10y+'
  243 | }
  244 | 
  245 | function bucketTeamSeats(value) {
  246 |   const seats = Number(value)
  247 |   if (!Number.isFinite(seats) || seats <= 0) return 'unknown'
  248 |   if (seats <= 5) return '1-5'
  249 |   if (seats <= 10) return '6-10'
  250 |   if (seats <= 20) return '11-20'
  251 |   return '20+'
  252 | }
  253 | 
  254 | function computeAuditScore(company = {}, certification = null) {
  255 |   const profile = company?.profile || {}
  256 |   const certs = Array.isArray(profile?.certifications) ? profile.certifications : []
  257 |   let score = 0
  258 |   score += Math.min(certs.length * 20, 60)
  259 |   const rawAudit = String(profile?.audit_date || company?.audit_date || '').trim()
  260 |   if (rawAudit) {
  261 |     const ts = Date.parse(rawAudit)
  262 |     if (!Number.isNaN(ts)) {
  263 |       const days = (Date.now() - ts) / (1000 * 60 * 60 * 24)
  264 |       if (days <= 365) score += 30
  265 |       else if (days <= 730) score += 15
  266 |     }
  267 |   }
  268 |   const certStatus = String(certification?.status || company?.order_certification_status || '').toLowerCase()
  269 |   if (certStatus === 'certified') score += 10
  270 |   if (score > 100) score = 100
  271 |   if (score <= 0) return null
  272 |   return Math.round(score)
  273 | }
  274 | 
  275 | function topFacetEntries(counts = {}, limit = 8) {
  276 |   return Object.fromEntries(
  277 |     Object.entries(counts)
  278 |       .sort((a, b) => b[1] - a[1])
  279 |       .slice(0, limit),
  280 |   )
  281 | }
  282 | 
  283 | export async function createBuyerRequirement(req, res) {
  284 |   try {
  285 |     const requirement = await createRequirement(req.user.id, req.body)
  286 |     return res.status(201).json(requirement)
  287 |   } catch (error) {
  288 |     return handleControllerError(res, error)
  289 |   }
  290 | }
  291 | 
  292 | export async function getRequirements(req, res) {
  293 |   const filters = {}
  294 |   if (req.user.role === 'buyer') filters.buyerId = req.user.id
  295 |   return res.json(await listRequirements(filters))
  296 | }
  297 | 
  298 | export async function browseRequirements(req, res) {
  299 |   await recordWorkflowEvent('search_open', {
  300 |     search_source: 'requirements_search',
  301 |     requirement_id: req.query.requirement_id || req.query.id || '',
  302 |   }, { actor_id: req.user.id }).catch(() => null)
  303 |   const [all, users] = await Promise.all([
  304 |     listRequirements({}),
  305 |     readJson('users.json'),
  306 |   ])
  307 |   const usersById = new Map(users.map((u) => [u.id, u]))
  308 |   const viewerPlan = await getUserPlan(req.user.id)
  309 |   const viewerPremium = viewerPlan === 'premium'
  310 |   const viewerRole = String(req.user?.role || '').toLowerCase()
  311 |   const enforcePriorityAccess = !viewerPremium && ['factory', 'buying_house', 'agent'].includes(viewerRole)
  312 |   const nowMs = Date.now()
  313 | 
  314 |   const out = all
  315 |     .map((r) => {
  316 |       const buyer = usersById.get(r.buyer_id) || null
  317 |       const buyerPlan = String(buyer?.subscription_status || '').toLowerCase()
  318 |       const buyerPremium = buyerPlan === 'premium'
  319 |       const priorityUntil = r.priority_until ? new Date(r.priority_until).getTime() : 0
  320 |       const priorityActive = String(r.priority_tier || '').toLowerCase() === 'priority'
  321 |         && (!priorityUntil || priorityUntil > nowMs)
  322 | 
  323 |       return {
  324 |         ...r,
  325 |         priority_score: (buyerPremium ? 2 : 0) + (buyer?.verified ? 0.5 : 0),
  326 |         priority_active: priorityActive,
  327 |       }
  328 |     })
  329 |     .filter((r) => (enforcePriorityAccess ? !r.priority_active : true))
  330 |     .sort((a, b) => {
  331 |       if (a.priority_score !== b.priority_score) return b.priority_score - a.priority_score
  332 |       const aCreated = new Date(a.created_at || '').getTime()
  333 |       const bCreated = new Date(b.created_at || '').getTime()
  334 |       return bCreated - aCreated
  335 |     })
  336 |     .map((r) => (r.buyer_id === req.user.id ? r : redactRequirementForBuyer(r)))
  337 | 
  338 |   return res.json(out)
  339 | }
  340 | 
  341 | export async function getRequirement(req, res) {
  342 |   const requirement = await getRequirementById(req.params.requirementId)
  343 |   if (!requirement) return res.status(404).json({ error: 'Requirement not found' })
  344 |   if (req.user.role === 'buyer' && requirement.buyer_id !== req.user.id) {
  345 |     return res.status(403).json({ error: 'Forbidden' })
  346 |   }
  347 |   return res.json(requirement)
  348 | }
  349 | 
  350 | export async function getSmartMatches(req, res) {
  351 |   try {
  352 |     await ensureEntitlement(req.user, 'smart_supplier_matching', 'Premium plan required for smart supplier matching.')
  353 |     const requirement = await getRequirementById(req.params.requirementId)
  354 |     if (!requirement) return res.status(404).json({ error: 'Requirement not found' })
  355 |     if (req.user.role === 'buyer' && requirement.buyer_id !== req.user.id) {
  356 |       return res.status(403).json({ error: 'Forbidden' })
  357 |     }
  358 | 
  359 |     const matches = await generateMatchesForRequirement(requirement)
  360 |     const ranked = Array.isArray(matches) && matches.length ? matches : await listMatchesForRequirement(requirement.id)
  361 |     return res.json({ matches: ranked })
  362 |   } catch (error) {
  363 |     return handleControllerError(res, error)
  364 |   }
  365 | }
  366 | 
  367 | export async function patchRequirement(req, res) {
  368 |   try {
  369 |     const updated = await updateRequirement(req.params.requirementId, req.body || {}, req.user)
  370 |     if (updated === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  371 |     if (!updated) return res.status(404).json({ error: 'Requirement not found' })
  372 |     return res.json(updated)
  373 |   } catch (error) {
  374 |     return handleControllerError(res, error)
  375 |   }
  376 | }
  377 | 
  378 | export async function deleteRequirement(req, res) {
  379 |   const ok = await removeRequirement(req.params.requirementId, req.user)
  380 |   if (ok === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  381 |   if (!ok) return res.status(404).json({ error: 'Requirement not found' })
  382 |   return res.json({ ok: true })
  383 | }
  384 | 
  385 | export async function searchRequirements(req, res) {
  386 |   const plan = await getUserPlan(req.user.id)
  387 |   const priorityOnly = req.query.priorityOnly === 'true'
  388 |   if (priorityOnly) {
  389 |     await ensureEntitlement(req.user, 'buyer_request_priority_access', 'Premium plan required for priority buyer requests.')
  390 |   }
  391 | 
  392 |   const estimateOnly = String(req.query.estimateOnly || '').toLowerCase() === 'true'
  393 |   const cursor = Number.isFinite(Number(req.query.cursor)) ? Math.max(0, Math.floor(Number(req.query.cursor))) : 0
  394 |   const limitRaw = Number.isFinite(Number(req.query.limit)) ? Math.floor(Number(req.query.limit)) : 50
  395 |   const limit = estimateOnly ? 0 : Math.min(50, Math.max(1, limitRaw))
  396 | 
  397 |   const advancedFilters = extractUsedAdvancedFilters(req.query)
  398 |   const quotaPreview = advancedFilters.length > 0
  399 |     ? await getQuotaSnapshot(req.user.id, 'requirements_search', plan)
  400 |     : null
  401 | 
  402 |   if (advancedFilters.length > 0 && !canUseAdvancedFilters(plan)) {
  403 |     return res.status(403).json(buildLimitError({
  404 |       code: 'upgrade_required',
  405 |       message: 'Advanced filters require a premium plan',
  406 |       quota: quotaPreview,
  407 |       missingFilters: advancedFilters,
  408 |       upgradeRequired: true,
  409 |     }))
  410 |   }
  411 | 
  412 |   let quotaUse = { allowed: true, quota: { action: 'requirements_search', plan, unlimited: true } }
  413 |   if (advancedFilters.length > 0) {
  414 |     if (quotaPreview && quotaPreview.remaining <= 0) {
  415 |       return res.status(429).json(buildLimitError({
  416 |         code: 'limit_reached',
  417 |         message: 'Daily requirement search limit reached',
  418 |         quota: quotaPreview,
  419 |       }))
  420 |     }
  421 |     quotaUse = estimateOnly
  422 |       ? { allowed: true, quota: quotaPreview }
  423 |       : await consumeQuota(req.user.id, 'requirements_search', plan)
  424 |     if (!quotaUse.allowed) {
  425 |       return res.status(429).json(buildLimitError({
  426 |         code: 'limit_reached',
  427 |         message: 'Daily requirement search limit reached',
  428 |         quota: quotaUse.quota,
  429 |       }))
  430 |     }
  431 |   }
  432 | 
  433 |   const q = String(req.query.q || '').trim()
  434 |   const searchTokens = buildSearchTokens(q)
  435 |   const wantedIndustry = String(req.query.industry || '').trim().toLowerCase()
  436 |   const wantedCountry = String(req.query.country || '').trim().toLowerCase()
  437 |   const wantedOrgType = String(req.query.orgType || '').trim().toLowerCase()
  438 |   const verifiedOnly = req.query.verifiedOnly === 'true'
  439 |   const moqRange = String(req.query.moqRange || '').trim()
  440 |   const priceRange = String(req.query.priceRange || '').trim()
  441 |   const priceCurrency = String(req.query.priceCurrency || req.query.currency || '').trim().toUpperCase()
  442 |   const wantedCategories = parseList(req.query.category)
  443 |   const wantedIncoterms = parseList(req.query.incoterms)
  444 |   const wantedPaymentTerms = parseList(req.query.paymentTerms)
  445 |   const wantedDocumentReady = parseList(req.query.documentReady)
  446 |   const wantedAuditDate = String(req.query.auditDate || '').trim().toLowerCase()
  447 |   const wantedLanguage = parseList(req.query.languageSupport)
  448 |   const wantedFabricTypes = parseList(req.query.fabricType)
  449 |   const wantedSizeRange = String(req.query.sizeRange || '').trim().toLowerCase()
  450 |   const wantedColorPantone = parseList(req.query.colorPantone)
  451 |   const wantedCustomization = parseList(req.query.customization)
  452 |   const sampleAvailable = req.query.sampleAvailable === 'true'
  453 |   const sampleLeadTimeMax = parseNumber(req.query.sampleLeadTime)
  454 |   const wantedCertificationsRaw = String(req.query.certifications || '').trim()
  455 |   const wantedCertifications = wantedCertificationsRaw
  456 |     ? wantedCertificationsRaw.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean)
  457 |     : []
  458 |   const leadTimeMax = parseNumber(req.query.leadTimeMax)
  459 |   const gsmMin = parseNumber(req.query.gsmMin)
  460 |   const gsmMax = parseNumber(req.query.gsmMax)
  461 |   const capacityMin = parseNumber(req.query.capacityMin)
  462 |   const processes = parseList(req.query.processes)
  463 |   const yearsInBusinessMin = parseNumber(req.query.yearsInBusinessMin)
  464 |   const responseTimeMax = parseNumber(req.query.responseTimeMax)
  465 |   const teamSeatsMin = parseNumber(req.query.teamSeatsMin)
  466 |   const handlesMultipleFactoriesFilter = req.query.handlesMultipleFactories !== undefined
  467 |     ? parseBoolean(req.query.handlesMultipleFactories)
  468 |     : null
  469 |   const exportPorts = parseList(req.query.exportPort)
  470 |   const hasPermissionMatrixFilter = req.query.hasPermissionMatrix !== undefined
  471 |     ? parseBoolean(req.query.hasPermissionMatrix)
  472 |     : null
  473 |   const auditScoreMin = parseNumber(req.query.auditScoreMin)
  474 |   const permissionSection = String(req.query.permissionSection || '').trim().toLowerCase()
  475 |   const permissionSectionEdit = req.query.permissionSectionEdit !== undefined
  476 |     ? parseBoolean(req.query.permissionSectionEdit)
  477 |     : null
  478 |   const roleSeatsRaw = String(req.query.roleSeats || '').trim()
  479 |   const roleSeatsMap = {}
  480 |   if (roleSeatsRaw) {
  481 |     for (const part of roleSeatsRaw.split(',')) {
  482 |       const [roleRaw, seatsRaw] = String(part || '').split(':').map((s) => (s || '').trim())
  483 |       if (!roleRaw) continue
  484 |       const n = parseNumber(seatsRaw)
  485 |       if (n !== null) roleSeatsMap[String(roleRaw).toLowerCase()] = n
  486 |     }
  487 |   }
  488 |   const distanceKm = parseNumber(req.query.distanceKm)
  489 |   const locationLat = parseCoordinate(req.query.locationLat)
  490 |   const locationLng = parseCoordinate(req.query.locationLng)
  491 |   const distanceFilterActive = distanceKm !== null && locationLat !== null && locationLng !== null
  492 |   const baseCurrency = await getBaseCurrency()
  493 |   let fxStale = false
  494 |   let priceRangeBase = ''
  495 |   if (priceRange) {
  496 |     const parsed = parseRange(priceRange)
  497 |     const fromCurrency = priceCurrency || baseCurrency
  498 |     const minConv = parsed.min === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.min, fromCurrency, baseCurrency)
  499 |     const maxConv = parsed.max === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.max, fromCurrency, baseCurrency)
  500 |     fxStale = Boolean(minConv.fx_stale || maxConv.fx_stale || (parsed.min !== null && minConv.amount === null) || (parsed.max !== null && maxConv.amount === null))
  501 |     const minText = minConv.amount !== null ? String(minConv.amount) : ''
  502 |     const maxText = maxConv.amount !== null ? String(maxConv.amount) : ''
  503 |     priceRangeBase = [minText, maxText].filter((v, idx) => v || idx === 0).join('-')
  504 |   }
  505 | 
  506 |   const openSearchReady = await isOpenSearchConfigured()
  507 |   const openSearchResult = openSearchReady
  508 |     ? await searchOpenSearch({
  509 |       index: 'requirements',
  510 |       query: q,
  511 |       cursor,
  512 |       limit,
  513 |       estimateOnly,
  514 |       filters: {
  515 |         industry: wantedIndustry,
  516 |         country: wantedCountry,
  517 |         orgType: wantedOrgType,
  518 |         verifiedOnly,
  519 |         category: wantedCategories,
  520 |         moqRange,
  521 |         priceRangeBase: priceRangeBase || priceRange,
  522 |         leadTimeMax,
  523 |         gsmMin,
  524 |         gsmMax,
  525 |         capacityMin,
  526 |         yearsInBusinessMin,
  527 |         responseTimeMax,
  528 |         teamSeatsMin,
  529 |         ...(handlesMultipleFactoriesFilter === null ? {} : { handlesMultipleFactories: handlesMultipleFactoriesFilter }),
  530 |         ...(hasPermissionMatrixFilter === null ? {} : { hasPermissionMatrix: hasPermissionMatrixFilter }),
  531 |         ...(auditScoreMin === null ? {} : { auditScoreMin }),
  532 |         ...(permissionSection ? { permissionSection } : {}),
  533 |         ...(permissionSectionEdit === null ? {} : { permissionSectionEdit }),
  534 |         ...(roleSeatsRaw ? { roleSeats: roleSeatsRaw } : {}),
  535 |         fabricType: wantedFabricTypes,
  536 |         certifications: wantedCertifications,
  537 |         incoterms: wantedIncoterms,
  538 |         paymentTerms: wantedPaymentTerms,
  539 |         documentReady: wantedDocumentReady,
  540 |         languageSupport: wantedLanguage,
  541 |         processes,
  542 |         exportPort: exportPorts,
  543 |         auditDate: wantedAuditDate,
  544 |         sizeRange: wantedSizeRange,
  545 |         colorPantone: wantedColorPantone,
  546 |         customization: wantedCustomization,
  547 |         sampleAvailable,
  548 |         sampleLeadTimeMax,
  549 |         locationLat,
  550 |         locationLng,
  551 |         distanceKm,
  552 |       },
  553 |     })
  554 |     : null
  555 |   const openSearchIds = Array.isArray(openSearchResult?.ids) ? openSearchResult.ids.map(String) : []
  556 |   const openSearchIdSet = openSearchIds.length ? new Set(openSearchIds) : null
  557 |   const engine = openSearchResult?.engine || 'fallback_json'
  558 | 
  559 |   if (estimateOnly && engine === 'opensearch') {
  560 |     const resolvedFacets = openSearchResult?.facets
  561 |       ? { ...openSearchResult.facets, category: openSearchResult.facets.category || openSearchResult.facets.categories || {} }
  562 |       : {}
  563 |     return res.json({
  564 |       engine,
  565 |       cursor,
  566 |       limit,
  567 |       total: Number(openSearchResult?.total || 0),
  568 |       next_cursor: null,
  569 |       items: [],
  570 |       facets: resolvedFacets,
  571 |       ...(openSearchResult?.error_code ? { error_code: openSearchResult.error_code } : {}),
  572 |       ...buildSearchAccessPayload({
  573 |         action: 'requirements_search',
  574 |         plan,
  575 |         quota: quotaUse.quota,
  576 |       }),
  577 |     })
  578 |   }
  579 | 
  580 |   const all = await listRequirements({})
  581 |   const [users, messages, orderCertMap] = await Promise.all([
  582 |     readJson('users.json'),
  583 |     readJson('messages.json'),
  584 |     getOrderCertificationMap(),
  585 |   ])
  586 |   const usersById = new Map(users.map((u) => [u.id, u]))
  587 |   const responseTimeByOwner = buildResponseTimeByOwner(messages, users)
  588 | 
  589 |   const viewerPremium = plan === 'premium'
  590 |   const viewerRole = String(req.user?.role || '').toLowerCase()
  591 |   const enforcePriorityAccess = !viewerPremium && ['factory', 'buying_house', 'agent'].includes(viewerRole)
  592 |   const nowMs = Date.now()
  593 | 
  594 |   const results = all
  595 |     .map((r) => {
  596 |       const buyer = usersById.get(r.buyer_id) || null
  597 |       const buyerPlan = String(buyer?.subscription_status || '').toLowerCase()
  598 |       const buyerPremium = buyerPlan === 'premium'
  599 |       const certification = buyer ? orderCertMap.get(String(buyer.id)) : null
  600 |       const authorCountry = String(buyer?.profile?.country || '').trim()
  601 |       const profile = buyer?.profile || {}
  602 |       const priorityUntil = r.priority_until ? new Date(r.priority_until).getTime() : 0
  603 |       const priorityActive = String(r.priority_tier || '').toLowerCase() === 'priority'
  604 |         && (!priorityUntil || priorityUntil > nowMs)
  605 |       return {
  606 |         ...r,
  607 |         author: buyer ? {
  608 |           id: buyer.id,
  609 |           name: buyer.name,
  610 |           role: buyer.role,
  611 |           verified: Boolean(buyer.verified),
  612 |           premium: buyerPremium,
  613 |           country: authorCountry,
  614 |           industry: String(profile?.industry || ''),
  615 |           main_processes: Array.isArray(profile?.main_processes) ? profile.main_processes : [],
  616 |           years_in_business: profile?.years_in_business || '',
  617 |           handles_multiple_factories: Boolean(profile?.handles_multiple_factories),
  618 |           team_seats: profile?.team_seats || '',
  619 |           role_seats: profile?.role_seats || profile?.roleSeats || (profile?.permission_matrix?.members?.seats || null),
  620 |           export_ports: Array.isArray(profile?.export_ports) ? profile.export_ports : [],
  621 |           location_lat: profile?.location_lat ?? '',
  622 |           location_lng: profile?.location_lng ?? '',
  623 |           avg_response_hours: responseTimeByOwner.get(String(buyer.id)) ?? null,
  624 |           order_certification_status: certification?.status || '',
  625 |           permission_matrix: profile?.permission_matrix || buyer?.permission_matrix || null,
  626 |           has_permission_matrix: Boolean(profile?.permission_matrix || buyer?.permission_matrix),
  627 |           audit_score: computeAuditScore(buyer, certification),
  628 |         } : { id: r.buyer_id, name: 'Unknown buyer', role: 'buyer', verified: false, country: '' },
  629 |         profile_key: `user:${r.buyer_id}`,
  630 |         priority_score: (buyerPremium ? 2 : 0) + (buyer?.verified ? 0.5 : 0),
  631 |         priority_active: priorityActive,
  632 |       }
  633 |     })
  634 |     .filter((r) => (enforcePriorityAccess ? !r.priority_active : true))
  635 |     .filter((r) => {
  636 |       if (openSearchIdSet) {
  637 |         if (!openSearchIdSet.has(String(r.id))) return false
  638 |         if (priorityOnly && !r.priority_active) return false
  639 |         return true
  640 |       }
  641 |       if (priorityOnly && !r.priority_active) return false
  642 |       if (searchTokens.length) {
  643 |         const searchText = normalizeSearchText(`${r.category} ${r.product} ${r.material} ${r.custom_description} ${r.title} ${r.color_pantone || ''} ${r.size_range || ''}`)
  644 |         const hit = searchTokens.every((token) => searchText.includes(token))
  645 |         if (!hit) return false
  646 |       }
  647 |       if (wantedCategories.length > 0) {
  648 |         const categoryValue = String(r.category || r.product || '').toLowerCase()
  649 |         if (!wantedCategories.includes(categoryValue)) return false
  650 |       }
  651 |       if (wantedIndustry) {
  652 |         const reqIndustry = String(r.industry || '').toLowerCase()
  653 |         const buyerIndustry = String(r.author?.industry || '').toLowerCase()
  654 |         if (reqIndustry !== wantedIndustry && buyerIndustry !== wantedIndustry) return false
  655 |       }
  656 |       if (wantedOrgType && String(r.author?.role || '').toLowerCase() !== wantedOrgType) return false
  657 |       if (wantedCountry && String(r.author?.country || '').toLowerCase() !== wantedCountry) return false
  658 |       if (verifiedOnly && !r.author?.verified) return false
  659 |       if (moqRange && !matchesMoqRange(moqRange, r.moq || r.quantity)) return false
  660 |       if (priceRangeBase) {
  661 |         const normalizedMin = Number.isFinite(Number(r.priceBaseMin)) ? Number(r.priceBaseMin) : Number(r.priceNormalizedBase)
  662 |         const normalizedMax = Number.isFinite(Number(r.priceBaseMax)) ? Number(r.priceBaseMax) : Number(r.priceNormalizedBase)
  663 |         if (Number.isFinite(normalizedMin) || Number.isFinite(normalizedMax)) {
  664 |           const synthetic = `${Number.isFinite(normalizedMin) ? normalizedMin : ''}-${Number.isFinite(normalizedMax) ? normalizedMax : ''}`
  665 |           if (!rangesOverlap(priceRangeBase, synthetic)) return false
  666 |         } else if (!rangesOverlap(priceRange, r.price_range || '')) return false
  667 |       }
  668 |       if (wantedIncoterms.length > 0) {
  669 |         const incoterm = String(r.incoterms || '').toLowerCase()
  670 |         const hit = wantedIncoterms.some((term) => incoterm.includes(term))
  671 |         if (!hit) return false
  672 |       }
  673 |       if (wantedCertifications.length > 0) {
  674 |         const required = Array.isArray(r.certifications_required) ? r.certifications_required.map((c) => String(c).toLowerCase()) : []
  675 |         const hit = wantedCertifications.some((c) => required.includes(c))
  676 |         if (!hit) return false
  677 |       }
  678 |       if (leadTimeMax !== null) {
  679 |         const timeline = parseNumber(r.timeline_days || r.delivery_timeline || '')
  680 |         if (timeline === null || timeline > leadTimeMax) return false
  681 |       }
  682 |       if (gsmMin !== null || gsmMax !== null) {
  683 |         const gsm = parseNumber(r.fabric_gsm || '')
  684 |         if (gsm === null) return false
  685 |         if (gsmMin !== null && gsm < gsmMin) return false
  686 |         if (gsmMax !== null && gsm > gsmMax) return false
  687 |       }
  688 |       if (capacityMin !== null) {
  689 |         const cap = parseNumber(r.capacity_min || '')
  690 |         if (cap === null || cap < capacityMin) return false
  691 |       }
  692 |       if (wantedPaymentTerms.length > 0) {
  693 |         const payment = String(r.payment_terms || '').toLowerCase()
  694 |         const hit = wantedPaymentTerms.some((term) => payment.includes(term))
  695 |         if (!hit) return false
  696 |       }
  697 |       if (wantedDocumentReady.length > 0) {
  698 |         const doc = String(r.document_ready || '').toLowerCase()
  699 |         const hit = wantedDocumentReady.some((term) => doc.includes(term))
  700 |         if (!hit) return false
  701 |       }
  702 |       if (wantedAuditDate && String(r.audit_date || '').toLowerCase() !== wantedAuditDate) return false
  703 |       if (wantedLanguage.length > 0) {
  704 |         const lang = String(r.language_support || '').toLowerCase()
  705 |         const hit = wantedLanguage.some((term) => lang.includes(term))
  706 |         if (!hit) return false
  707 |       }
  708 |       if (wantedFabricTypes.length > 0) {
  709 |         const material = String(r.material || '').toLowerCase()
  710 |         const hit = wantedFabricTypes.some((fabric) => material.includes(fabric))
  711 |         if (!hit) return false
  712 |       }
  713 |       if (wantedSizeRange && !String(r.size_range || '').toLowerCase().includes(wantedSizeRange)) return false
  714 |       if (wantedColorPantone.length > 0) {
  715 |         const color = String(r.color_pantone || '').toLowerCase()
  716 |         const hit = wantedColorPantone.some((code) => color.includes(code))
  717 |         if (!hit) return false
  718 |       }
  719 |       if (wantedCustomization.length > 0) {
  720 |         const customization = String(r.customization_capabilities || '').toLowerCase()
  721 |         const hit = wantedCustomization.some((entry) => customization.includes(entry))
  722 |         if (!hit) return false
  723 |       }
  724 |       if (sampleAvailable) {
  725 |         const available = String(r.sample_available || '').toLowerCase()
  726 |         if (!(available === 'true' || available === 'yes' || r.sample_lead_time_days || r.sample_timeline)) return false
  727 |       }
  728 |       if (sampleLeadTimeMax !== null) {
  729 |         const sampleLead = parseNumber(r.sample_lead_time_days || r.sample_timeline || '')
  730 |         if (sampleLead === null || sampleLead > sampleLeadTimeMax) return false
  731 |       }
  732 |       if (processes.length > 0) {
  733 |         const authorProcesses = Array.isArray(r.author?.main_processes)
  734 |           ? r.author.main_processes.map((p) => String(p).toLowerCase())
  735 |           : []
  736 |         const hit = processes.some((p) => authorProcesses.includes(p))
  737 |         if (!hit) return false
  738 |       }
  739 |       if (yearsInBusinessMin !== null) {
  740 |         const years = parseNumber(r.author?.years_in_business || '')
  741 |         if (years === null || years < yearsInBusinessMin) return false
  742 |       }
  743 |       if (teamSeatsMin !== null) {
  744 |         const seats = parseNumber(r.author?.team_seats || '')
  745 |         if (seats === null || seats < teamSeatsMin) return false
  746 |       }
  747 |       if (roleSeatsMap && Object.keys(roleSeatsMap).length) {
  748 |         const profileRoleSeats = r.author?.role_seats || r.author?.roleSeats || {}
  749 |         const permMemberSeats = r.author?.permission_matrix?.members?.seats || null
  750 |         for (const [roleKey, minSeats] of Object.entries(roleSeatsMap)) {
  751 |           let ownerSeats = null
  752 |           if (profileRoleSeats && profileRoleSeats[roleKey] !== undefined) {
  753 |             ownerSeats = parseNumber(profileRoleSeats[roleKey])
  754 |           } else if (permMemberSeats && permMemberSeats[roleKey] !== undefined) {
  755 |             ownerSeats = parseNumber(permMemberSeats[roleKey])
  756 |           } else {
  757 |             ownerSeats = parseNumber(r.author?.team_seats || '')
  758 |           }
  759 |           if (!Number.isFinite(ownerSeats) || ownerSeats < minSeats) return false
  760 |         }
  761 |       }
  762 |       if (handlesMultipleFactoriesFilter !== null) {
  763 |         if (Boolean(r.author?.handles_multiple_factories) !== handlesMultipleFactoriesFilter) return false
  764 |       }
  765 |       if (hasPermissionMatrixFilter !== null) {
  766 |         const hasPerm = Boolean(r.author?.has_permission_matrix)
  767 |         if (hasPermissionMatrixFilter !== hasPerm) return false
  768 |       }
  769 |       if (permissionSection) {
  770 |         const pm = r.author?.permission_matrix || null
  771 |         const sec = pm && pm[permissionSection] ? pm[permissionSection] : null
  772 |         const hasView = Boolean(sec && sec.view)
  773 |         const hasEdit = Boolean(sec && sec.edit)
  774 |         if (permissionSectionEdit === null) {
  775 |           if (!hasView && !hasEdit) return false
  776 |         } else if (permissionSectionEdit === true) {
  777 |           if (!hasEdit) return false
  778 |         } else if (permissionSectionEdit === false) {
  779 |           if (!hasView) return false
  780 |         }
  781 |       }
  782 |       if (auditScoreMin !== null) {
  783 |         const score = Number(r.author?.audit_score)
  784 |         if (!Number.isFinite(score) || score < auditScoreMin) return false
  785 |       }
  786 |       if (exportPorts.length > 0) {
  787 |         const authorPorts = Array.isArray(r.author?.export_ports)
  788 |           ? r.author.export_ports.map((p) => String(p).toLowerCase())
  789 |           : []
  790 |         const hit = exportPorts.some((p) => authorPorts.includes(p))
  791 |         if (!hit) return false
  792 |       }
  793 |       if (responseTimeMax !== null) {
  794 |         const avg = Number(r.author?.avg_response_hours)
  795 |         if (!Number.isFinite(avg) || avg > responseTimeMax) return false
  796 |       }
  797 |       if (distanceFilterActive) {
  798 |         const authorLat = parseCoordinate(r.author?.location_lat)
  799 |         const authorLng = parseCoordinate(r.author?.location_lng)
  800 |         if (authorLat !== null && authorLng !== null) {
  801 |           const distance = haversineDistanceKm(locationLat, locationLng, authorLat, authorLng)
  802 |           if (!Number.isFinite(distance) || distance > distanceKm) return false
  803 |         } else if (!wantedCountry) {
  804 |           return false
  805 |         }
  806 |       }
  807 |       return true
  808 |     })
  809 | 
  810 |   const items = results
  811 |     .sort((a, b) => {
  812 |       if (a.priority_score !== b.priority_score) return b.priority_score - a.priority_score
  813 |       if (viewerPremium) {
  814 |         const aCreated = new Date(a.created_at || '').getTime()
  815 |         const bCreated = new Date(b.created_at || '').getTime()
  816 |         return bCreated - aCreated
  817 |       }
  818 |       return 0
  819 |     })
  820 |     .map((row) => {
  821 |     if (req.user.role === 'buyer' && row.buyer_id !== req.user.id) {
  822 |       return { ...redactRequirementForBuyer(row), author: row.author, profile_key: row.profile_key }
  823 |     }
  824 |     return row
  825 |   })
  826 | 
  827 |   const orderedResults = (() => {
  828 |     if (!openSearchIdSet) return items
  829 |     const byId = new Map(items.map((row) => [String(row.id), row]))
  830 |     return openSearchIds.map((id) => byId.get(String(id))).filter(Boolean)
  831 |   })()
  832 | 
  833 |   const totalMatched = engine === 'opensearch' ? Number(openSearchResult?.total || 0) : orderedResults.length
  834 |   const pagedItems = engine === 'opensearch'
  835 |     ? orderedResults
  836 |     : orderedResults.slice(cursor, cursor + limit)
  837 |   const nextCursor = estimateOnly
  838 |     ? null
  839 |     : (engine === 'opensearch'
  840 |         ? (cursor + openSearchIds.length < totalMatched ? cursor + openSearchIds.length : null)
  841 |         : (cursor + pagedItems.length < totalMatched ? cursor + pagedItems.length : null))
  842 | 
  843 |   const facets = orderedResults.reduce((acc, row) => {
  844 |     const category = String(row.category || 'Other')
  845 |     const country = String(row.author?.country || 'Unknown')
  846 |     acc.categories[category] = (acc.categories[category] || 0) + 1
  847 |     acc.countries[country] = (acc.countries[country] || 0) + 1
  848 |     acc.verified[row.author?.verified ? 'verified' : 'unverified'] += 1
  849 |     const fabric = String(row.material || '').trim()
  850 |     if (fabric) acc.fabricType[fabric] = (acc.fabricType[fabric] || 0) + 1
  851 |     const certifications = Array.isArray(row.certifications) ? row.certifications : []
  852 |     certifications.forEach((cert) => {
  853 |       const key = String(cert || 'Other')
  854 |       acc.certifications[key] = (acc.certifications[key] || 0) + 1
  855 |     })
  856 |     const incoterm = String(row.incoterms || row.shipping_terms || '').trim()
  857 |     if (incoterm) acc.incoterms[incoterm] = (acc.incoterms[incoterm] || 0) + 1
  858 |     const payment = String(row.payment_terms || '').trim()
  859 |     if (payment) acc.paymentTerms[payment] = (acc.paymentTerms[payment] || 0) + 1
  860 |     const documentReady = String(row.document_ready || '').trim()
  861 |     if (documentReady) acc.documentReady[documentReady] = (acc.documentReady[documentReady] || 0) + 1
  862 |     const language = String(row.language_support || '').trim()
  863 |     if (language) acc.languageSupport[language] = (acc.languageSupport[language] || 0) + 1
  864 |     const customization = String(row.customization_capabilities || '').trim()
  865 |     if (customization) acc.customization[customization] = (acc.customization[customization] || 0) + 1
  866 |     const processesList = Array.isArray(row.author?.main_processes) ? row.author.main_processes : []
  867 |     processesList.forEach((proc) => {
  868 |       const key = String(proc || 'Other')
  869 |       acc.processes[key] = (acc.processes[key] || 0) + 1
  870 |     })
  871 |     const exportPortsList = Array.isArray(row.author?.export_ports) ? row.author.export_ports : []
  872 |     exportPortsList.forEach((port) => {
  873 |       const key = String(port || 'Other')
  874 |       acc.export_ports[key] = (acc.export_ports[key] || 0) + 1
  875 |     })
  876 |     const responseBucket = bucketResponseTime(Number(row.author?.avg_response_hours))
  877 |     acc.response_time[responseBucket] = (acc.response_time[responseBucket] || 0) + 1
  878 |     const yearsBucket = bucketYearsInBusiness(row.author?.years_in_business)
  879 |     acc.years_in_business[yearsBucket] = (acc.years_in_business[yearsBucket] || 0) + 1
  880 |     const seatsBucket = bucketTeamSeats(row.author?.team_seats)
  881 |     acc.team_seats[seatsBucket] = (acc.team_seats[seatsBucket] || 0) + 1
  882 |     const handlesKey = row.author?.handles_multiple_factories ? 'true' : 'false'
  883 |     acc.handles_multiple_factories[handlesKey] = (acc.handles_multiple_factories[handlesKey] || 0) + 1
  884 |     return acc
  885 |   }, {
  886 |     categories: {},
  887 |     countries: {},
  888 |     verified: { verified: 0, unverified: 0 },
  889 |     processes: {},
  890 |     export_ports: {},
  891 |     response_time: {},
  892 |     years_in_business: {},
  893 |     team_seats: {},
  894 |     handles_multiple_factories: {},
  895 |     fabricType: {},
  896 |     certifications: {},
  897 |     incoterms: {},
  898 |     paymentTerms: {},
  899 |     documentReady: {},
  900 |     languageSupport: {},
  901 |     customization: {},
  902 |   })
  903 | 
  904 |   const cappedFacets = {
  905 |     ...facets,
  906 |     category: facets.categories || facets.category || {},
  907 |     processes: topFacetEntries(facets.processes, 8),
  908 |     export_ports: topFacetEntries(facets.export_ports, 8),
  909 |   }
  910 | 
  911 |   const resolvedFacets = openSearchResult?.facets
  912 |     ? { ...openSearchResult.facets, category: openSearchResult.facets.category || openSearchResult.facets.categories || {} }
  913 |     : cappedFacets
  914 | 
  915 |   return res.json({
  916 |     engine,
  917 |     cursor,
  918 |     limit,
  919 |     total: totalMatched,
  920 |     next_cursor: nextCursor,
  921 |     items: pagedItems,
  922 |     facets: resolvedFacets,
  923 |     ...(openSearchResult?.error_code ? { error_code: openSearchResult.error_code } : {}),
  924 |     ...buildSearchAccessPayload({
  925 |       action: 'requirements_search',
  926 |       plan,
  927 |       quota: quotaUse.quota,
  928 |     }),
  929 |     fx: {
  930 |       base_currency: baseCurrency,
  931 |       filter_currency: priceCurrency || baseCurrency,
  932 |       fx_stale: fxStale,
  933 |     },
  934 |   })
  935 | }
  936 | 