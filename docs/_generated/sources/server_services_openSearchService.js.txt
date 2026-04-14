    1 | import { Client } from '@opensearch-project/opensearch'
    2 | import { getAdminConfig } from './adminConfigService.js'
    3 | import { readJson } from '../utils/jsonStore.js'
    4 | import { getBaseCurrency, normalizeMoney } from './currencyService.js'
    5 | 
    6 | const CONFIG_TTL_MS = 15000
    7 | const RESPONSE_CACHE_TTL_MS = 10 * 60 * 1000
    8 | const DEFAULT_PREFIX = 'gartexhub_'
    9 | 
   10 | let cachedConfig = { at: 0, value: null }
   11 | let clientState = { key: '', client: null }
   12 | let lastStatus = { last_ok_at: '', last_error_at: '', last_error: '' }
   13 | let responseCache = { at: 0, map: new Map() }
   14 | 
   15 | function now() {
   16 |   return Date.now()
   17 | }
   18 | 
   19 | function safeString(value) {
   20 |   return String(value || '').trim()
   21 | }
   22 | 
   23 | function normalizeKeyword(value) {
   24 |   return safeString(value).toLowerCase()
   25 | }
   26 | 
   27 | function normalizeKeywordList(values = []) {
   28 |   const rows = Array.isArray(values) ? values : []
   29 |   return rows.map((value) => normalizeKeyword(value)).filter(Boolean)
   30 | }
   31 | 
   32 | function parseNumberLike(value) {
   33 |   if (value === undefined || value === null) return null
   34 |   const raw = safeString(value)
   35 |   if (!raw) return null
   36 |   const n = Number(raw.replace(/[^\d.]/g, ''))
   37 |   return Number.isFinite(n) ? n : null
   38 | }
   39 | 
   40 | function parseRangeValue(value) {
   41 |   const raw = safeString(value)
   42 |   if (!raw) return { min: null, max: null }
   43 |   const [minRaw, maxRaw] = raw.split('-')
   44 |   const min = minRaw ? Number(String(minRaw).replace(/[^\d.]/g, '')) : null
   45 |   const max = maxRaw ? Number(String(maxRaw).replace(/[^\d.]/g, '')) : null
   46 |   return {
   47 |     min: Number.isFinite(min) ? min : null,
   48 |     max: Number.isFinite(max) ? max : null,
   49 |   }
   50 | }
   51 | 
   52 | function normalizePrefix(value) {
   53 |   const prefix = safeString(value) || DEFAULT_PREFIX
   54 |   return prefix.endsWith('_') ? prefix : `${prefix}_`
   55 | }
   56 | 
   57 | function buildGeoPoint(lat, lng) {
   58 |   const latNum = Number(lat)
   59 |   const lngNum = Number(lng)
   60 |   if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null
   61 |   return { lat: latNum, lon: lngNum }
   62 | }
   63 | 
   64 | function splitTokens(value) {
   65 |   const raw = safeString(value).toLowerCase()
   66 |   if (!raw) return []
   67 |   return raw
   68 |     .split(/[,/;|]+/g)
   69 |     .map((entry) => entry.trim())
   70 |     .filter(Boolean)
   71 | }
   72 | 
   73 | function parsePantoneCodes(value) {
   74 |   const raw = safeString(value).toUpperCase()
   75 |   if (!raw) return []
   76 |   return raw
   77 |     .split(/[,;|]+/g)
   78 |     .map((entry) => entry.trim())
   79 |     .filter(Boolean)
   80 | }
   81 | 
   82 | function mapTotalHits(total) {
   83 |   if (typeof total === 'number') return total
   84 |   const value = Number(total?.value)
   85 |   return Number.isFinite(value) ? value : 0
   86 | }
   87 | 
   88 | async function loadConfig() {
   89 |   if (cachedConfig.value && now() - cachedConfig.at < CONFIG_TTL_MS) return cachedConfig.value
   90 |   const admin = await getAdminConfig()
   91 |   const raw = admin?.integrations?.opensearch || {}
   92 |   const enabled = Boolean(raw.enabled)
   93 |   const cfg = {
   94 |     enabled,
   95 |     url: safeString(raw.url),
   96 |     username: safeString(raw.username),
   97 |     password: safeString(raw.password),
   98 |     index_prefix: normalizePrefix(raw.index_prefix),
   99 |     timeout_ms: Math.max(500, Math.min(60000, Number(raw.timeout_ms || 3000))),
  100 |     verify_tls: raw.verify_tls !== false,
  101 |   }
  102 |   cachedConfig = { at: now(), value: cfg }
  103 |   return cfg
  104 | }
  105 | 
  106 | function buildClientKey(cfg) {
  107 |   return JSON.stringify({
  108 |     url: cfg.url,
  109 |     username: cfg.username,
  110 |     password: cfg.password,
  111 |     timeout_ms: cfg.timeout_ms,
  112 |     verify_tls: cfg.verify_tls,
  113 |   })
  114 | }
  115 | 
  116 | async function getClient() {
  117 |   const cfg = await loadConfig()
  118 |   if (!cfg.enabled || !cfg.url) return { cfg, client: null }
  119 |   const key = buildClientKey(cfg)
  120 |   if (!clientState.client || clientState.key !== key) {
  121 |     clientState = {
  122 |       key,
  123 |       client: new Client({
  124 |         node: cfg.url,
  125 |         auth: cfg.username ? { username: cfg.username, password: cfg.password } : undefined,
  126 |         requestTimeout: cfg.timeout_ms,
  127 |         ssl: { rejectUnauthorized: Boolean(cfg.verify_tls) },
  128 |       }),
  129 |     }
  130 |   }
  131 |   return { cfg, client: clientState.client }
  132 | }
  133 | 
  134 | export async function isOpenSearchConfigured() {
  135 |   const cfg = await loadConfig()
  136 |   return Boolean(cfg.enabled && cfg.url)
  137 | }
  138 | 
  139 | function productMappings() {
  140 |   return {
  141 |     properties: {
  142 |       id: { type: 'keyword' },
  143 |       title: { type: 'text' },
  144 |       category: { type: 'keyword' },
  145 |       industry: { type: 'keyword' },
  146 |       material: { type: 'text', fields: { keyword: { type: 'keyword', ignore_above: 256 } } },
  147 |       size_range: { type: 'keyword' },
  148 |       color_pantone_codes: { type: 'keyword' },
  149 |       customization: { type: 'keyword' },
  150 |       sample_available: { type: 'boolean' },
  151 |       sample_lead_time_days: { type: 'double' },
  152 |       moq_value: { type: 'double' },
  153 |       price_base_min: { type: 'double' },
  154 |       price_base_max: { type: 'double' },
  155 |       base_currency: { type: 'keyword' },
  156 |       lead_time_days: { type: 'double' },
  157 |       fabric_gsm: { type: 'double' },
  158 |       created_at: { type: 'date' },
  159 |       verified: { type: 'boolean' },
  160 |       org_type: { type: 'keyword' },
  161 |       country: { type: 'keyword' },
  162 |       certifications: { type: 'keyword' },
  163 |       incoterms: { type: 'keyword' },
  164 |       payment_terms: { type: 'keyword' },
  165 |       document_ready: { type: 'keyword' },
  166 |       language_support: { type: 'keyword' },
  167 |       processes: { type: 'keyword' },
  168 |       export_ports: { type: 'keyword' },
  169 |       monthly_capacity: { type: 'double' },
  170 |       years_in_business: { type: 'double' },
  171 |       team_seats: { type: 'double' },
  172 |       handles_multiple_factories: { type: 'boolean' },
  173 |       avg_response_hours: { type: 'double' },
  174 |       audit_date: { type: 'keyword' },
  175 |       role_seats: { type: 'object' },
  176 |       location: { type: 'geo_point' },
  177 |     },
  178 |   }
  179 | }
  180 | 
  181 | function requirementMappings() {
  182 |   return {
  183 |     properties: {
  184 |       id: { type: 'keyword' },
  185 |       title: { type: 'text' },
  186 |       category: { type: 'keyword' },
  187 |       industry: { type: 'keyword' },
  188 |       material: { type: 'text', fields: { keyword: { type: 'keyword', ignore_above: 256 } } },
  189 |       size_range: { type: 'keyword' },
  190 |       color_pantone_codes: { type: 'keyword' },
  191 |       customization: { type: 'keyword' },
  192 |       sample_available: { type: 'boolean' },
  193 |       sample_lead_time_days: { type: 'double' },
  194 |       capacity_min: { type: 'double' },
  195 |       moq_value: { type: 'double' },
  196 |       price_base_min: { type: 'double' },
  197 |       price_base_max: { type: 'double' },
  198 |       base_currency: { type: 'keyword' },
  199 |       lead_time_days: { type: 'double' },
  200 |       fabric_gsm: { type: 'double' },
  201 |       created_at: { type: 'date' },
  202 |       certifications: { type: 'keyword' },
  203 |       incoterms: { type: 'keyword' },
  204 |       payment_terms: { type: 'keyword' },
  205 |       document_ready: { type: 'keyword' },
  206 |       audit_date: { type: 'keyword' },
  207 |       language_support: { type: 'keyword' },
  208 |       verified: { type: 'boolean' },
  209 |       org_type: { type: 'keyword' },
  210 |       country: { type: 'keyword' },
  211 |       processes: { type: 'keyword' },
  212 |       export_ports: { type: 'keyword' },
  213 |       years_in_business: { type: 'double' },
  214 |       team_seats: { type: 'double' },
  215 |       handles_multiple_factories: { type: 'boolean' },
  216 |       avg_response_hours: { type: 'double' },
  217 |       role_seats: { type: 'object' },
  218 |       location: { type: 'geo_point' },
  219 |     },
  220 |   }
  221 | }
  222 | 
  223 | async function ensureIndex(indexName, mappings) {
  224 |   const { client } = await getClient()
  225 |   if (!client) return { ok: false, reason: 'not_configured' }
  226 |   const exists = await client.indices.exists({ index: indexName })
  227 |   if (exists?.body === true) return { ok: true, created: false }
  228 |   await client.indices.create({
  229 |     index: indexName,
  230 |     body: {
  231 |       settings: {
  232 |         number_of_shards: 1,
  233 |         number_of_replicas: 0,
  234 |       },
  235 |       mappings,
  236 |     },
  237 |   })
  238 |   return { ok: true, created: true }
  239 | }
  240 | 
  241 | async function deleteIndexIfExists(indexName) {
  242 |   const { client } = await getClient()
  243 |   if (!client) return
  244 |   try {
  245 |     await client.indices.delete({ index: indexName })
  246 |   } catch {
  247 |     // ignore
  248 |   }
  249 | }
  250 | 
  251 | async function buildResponseTimeByOwner() {
  252 |   if (responseCache.map.size && now() - responseCache.at < RESPONSE_CACHE_TTL_MS) return responseCache.map
  253 |   const [messages, users] = await Promise.all([readJson('messages.json'), readJson('users.json')])
  254 |   const msgRows = Array.isArray(messages) ? messages : []
  255 |   const userRows = Array.isArray(users) ? users : []
  256 | 
  257 |   const ownerByMember = new Map()
  258 |   for (const user of userRows) {
  259 |     const userId = String(user?.id || '')
  260 |     if (!userId) continue
  261 |     const role = String(user?.role || '').toLowerCase()
  262 |     const ownerId = role === 'agent' && user?.org_owner_id ? String(user.org_owner_id) : userId
  263 |     ownerByMember.set(userId, ownerId)
  264 |   }
  265 | 
  266 |   const messagesByMatch = new Map()
  267 |   for (const msg of msgRows) {
  268 |     const matchId = String(msg?.match_id || '')
  269 |     if (!matchId || matchId.startsWith('friend:')) continue
  270 |     if (!messagesByMatch.has(matchId)) messagesByMatch.set(matchId, [])
  271 |     messagesByMatch.get(matchId).push(msg)
  272 |   }
  273 | 
  274 |   const responseTimes = new Map()
  275 | 
  276 |   for (const msgs of messagesByMatch.values()) {
  277 |     const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
  278 |     const ownersInMatch = new Set(
  279 |       sorted.map((m) => ownerByMember.get(String(m.sender_id || '')) || String(m.sender_id || '')).filter(Boolean),
  280 |     )
  281 | 
  282 |     for (const ownerId of ownersInMatch) {
  283 |       let inboundAt = null
  284 |       for (const message of sorted) {
  285 |         const senderOwner = ownerByMember.get(String(message.sender_id || '')) || String(message.sender_id || '')
  286 |         if (!senderOwner || senderOwner === ownerId) continue
  287 |         const ts = new Date(message.timestamp || '').getTime()
  288 |         if (!Number.isFinite(ts)) continue
  289 |         inboundAt = ts
  290 |         break
  291 |       }
  292 |       if (!inboundAt) continue
  293 | 
  294 |       let outboundAt = null
  295 |       for (const message of sorted) {
  296 |         const senderOwner = ownerByMember.get(String(message.sender_id || '')) || String(message.sender_id || '')
  297 |         if (!senderOwner || senderOwner !== ownerId) continue
  298 |         const ts = new Date(message.timestamp || '').getTime()
  299 |         if (!Number.isFinite(ts) || ts < inboundAt) continue
  300 |         outboundAt = ts
  301 |         break
  302 |       }
  303 |       if (!outboundAt) continue
  304 | 
  305 |       const hours = (outboundAt - inboundAt) / (1000 * 60 * 60)
  306 |       if (!responseTimes.has(ownerId)) responseTimes.set(ownerId, [])
  307 |       responseTimes.get(ownerId).push(hours)
  308 |     }
  309 |   }
  310 | 
  311 |   const averages = new Map()
  312 |   for (const [ownerId, times] of responseTimes.entries()) {
  313 |     const avg = times.length ? (times.reduce((a, b) => a + b, 0) / times.length) : 0
  314 |     averages.set(ownerId, Math.round(avg * 10) / 10)
  315 |   }
  316 | 
  317 |   responseCache = { at: now(), map: averages }
  318 |   return averages
  319 | }
  320 | 
  321 | async function buildProductDoc(product, author = {}, responseMap = null) {
  322 |   const baseCurrency = await getBaseCurrency()
  323 |   const priceRange = parseRangeValue(product.price_range || '')
  324 |   const originalCurrency = normalizeKeyword(product.currency || product.currencyOriginal || baseCurrency).toUpperCase()
  325 |   const priceBaseMin = Number.isFinite(Number(product.priceBaseMin))
  326 |     ? Number(product.priceBaseMin)
  327 |     : (priceRange.min !== null ? (await normalizeMoney(priceRange.min, originalCurrency, baseCurrency)).amount : Number(product.priceNormalizedBase) || null)
  328 |   const priceBaseMax = Number.isFinite(Number(product.priceBaseMax))
  329 |     ? Number(product.priceBaseMax)
  330 |     : (priceRange.max !== null ? (await normalizeMoney(priceRange.max, originalCurrency, baseCurrency)).amount : Number(product.priceNormalizedBase) || null)
  331 |   const moqValue = parseNumberLike(product.moq)
  332 |   const leadTime = parseNumberLike(product.lead_time_days || author.lead_time_days)
  333 |   const fabricGsm = parseNumberLike(product.fabric_gsm)
  334 |   const sampleLead = parseNumberLike(product.sample_lead_time_days)
  335 |   const sampleAvailable = (() => {
  336 |     const raw = safeString(product.sample_available).toLowerCase()
  337 |     if (raw === 'true' || raw === 'yes') return true
  338 |     return Boolean(sampleLead)
  339 |   })()
  340 |   const responseTimes = responseMap || await buildResponseTimeByOwner()
  341 |   const ownerId = String(author.id || '')
  342 |   const avgResponse = responseTimes.has(ownerId) ? responseTimes.get(ownerId) : null
  343 |   return {
  344 |     id: product.id,
  345 |     title: product.title || '',
  346 |     category: normalizeKeyword(product.category),
  347 |     industry: normalizeKeyword(product.industry || author.industry),
  348 |     material: normalizeKeyword(product.material),
  349 |     size_range: normalizeKeyword(product.size_range),
  350 |     color_pantone_codes: parsePantoneCodes(product.color_pantone),
  351 |     customization: splitTokens(product.customization_capabilities),
  352 |     sample_available: sampleAvailable,
  353 |     sample_lead_time_days: sampleLead,
  354 |     moq_value: moqValue,
  355 |     price_base_min: priceBaseMin,
  356 |     price_base_max: priceBaseMax,
  357 |     base_currency: baseCurrency,
  358 |     lead_time_days: leadTime,
  359 |     fabric_gsm: fabricGsm,
  360 |     created_at: product.created_at || new Date().toISOString(),
  361 |     verified: Boolean(author.verified),
  362 |     org_type: normalizeKeyword(author.role),
  363 |     country: normalizeKeyword(author.country),
  364 |     certifications: normalizeKeywordList(author.certifications),
  365 |     incoterms: splitTokens(author.incoterms),
  366 |     payment_terms: splitTokens(author.payment_terms),
  367 |     document_ready: splitTokens(author.document_ready),
  368 |     language_support: splitTokens(author.language_support),
  369 |     processes: normalizeKeywordList(author.main_processes),
  370 |     export_ports: normalizeKeywordList(author.export_ports),
  371 |     monthly_capacity: parseNumberLike(author.monthly_capacity),
  372 |     years_in_business: parseNumberLike(author.years_in_business),
  373 |     team_seats: parseNumberLike(author.team_seats),
  374 |     handles_multiple_factories: Boolean(author.handles_multiple_factories),
  375 |     avg_response_hours: avgResponse,
  376 |     audit_date: normalizeKeyword(author.audit_date),
  377 |     // normalize role seats (flatten keys to lowercase numbers when possible)
  378 |     role_seats: (() => {
  379 |       const raw = author.role_seats || author.roleSeats || (author.permission_matrix && author.permission_matrix.members && author.permission_matrix.members.seats) || null
  380 |       if (!raw || typeof raw !== 'object') return null
  381 |       const mapped = {}
  382 |       Object.entries(raw).forEach(([k, v]) => {
  383 |         const key = String(k || '').toLowerCase()
  384 |         const n = parseNumberLike(v)
  385 |         mapped[key] = n !== null ? n : v
  386 |       })
  387 |       return mapped
  388 |     })(),
  389 |     location: buildGeoPoint(author.location_lat, author.location_lng),
  390 |   }
  391 | }
  392 | 
  393 | function shouldIndexProduct(product) {
  394 |   const status = safeString(product?.status || 'published').toLowerCase()
  395 |   if (status && status !== 'published') return false
  396 |   const reviewStatus = safeString(product?.content_review_status || product?.contentReviewStatus || 'approved').toLowerCase()
  397 |   return !reviewStatus || reviewStatus === 'approved'
  398 | }
  399 | 
  400 | async function buildRequirementDoc(req, author = {}, responseMap = null) {
  401 |   const baseCurrency = await getBaseCurrency()
  402 |   const priceRange = parseRangeValue(req.price_range || req.target_price || '')
  403 |   const originalCurrency = normalizeKeyword(req.currency || req.currencyOriginal || baseCurrency).toUpperCase()
  404 |   const priceBaseMin = Number.isFinite(Number(req.priceBaseMin))
  405 |     ? Number(req.priceBaseMin)
  406 |     : (priceRange.min !== null ? (await normalizeMoney(priceRange.min, originalCurrency, baseCurrency)).amount : Number(req.priceNormalizedBase) || null)
  407 |   const priceBaseMax = Number.isFinite(Number(req.priceBaseMax))
  408 |     ? Number(req.priceBaseMax)
  409 |     : (priceRange.max !== null ? (await normalizeMoney(priceRange.max, originalCurrency, baseCurrency)).amount : Number(req.priceNormalizedBase) || null)
  410 |   const moqValue = parseNumberLike(req.moq || req.quantity)
  411 |   const leadTime = parseNumberLike(req.timeline_days || req.delivery_timeline || '')
  412 |   const fabricGsm = parseNumberLike(req.fabric_gsm)
  413 |   const sampleLead = parseNumberLike(req.sample_lead_time_days || req.sample_timeline)
  414 |   const sampleAvailable = (() => {
  415 |     const raw = safeString(req.sample_available).toLowerCase()
  416 |     if (raw === 'true' || raw === 'yes') return true
  417 |     return Boolean(sampleLead)
  418 |   })()
  419 |   const capacityMin = parseNumberLike(req.capacity_min)
  420 |   const responseTimes = responseMap || await buildResponseTimeByOwner()
  421 |   const ownerId = String(author.id || '')
  422 |   const avgResponse = responseTimes.has(ownerId) ? responseTimes.get(ownerId) : null
  423 |   return {
  424 |     id: req.id,
  425 |     title: req.title || '',
  426 |     category: normalizeKeyword(req.category),
  427 |     industry: normalizeKeyword(req.industry),
  428 |     material: normalizeKeyword(req.material),
  429 |     size_range: normalizeKeyword(req.size_range),
  430 |     color_pantone_codes: parsePantoneCodes(req.color_pantone),
  431 |     customization: splitTokens(req.customization_capabilities),
  432 |     sample_available: sampleAvailable,
  433 |     sample_lead_time_days: sampleLead,
  434 |     capacity_min: capacityMin,
  435 |     moq_value: moqValue,
  436 |     price_base_min: priceBaseMin,
  437 |     price_base_max: priceBaseMax,
  438 |     base_currency: baseCurrency,
  439 |     lead_time_days: leadTime,
  440 |     fabric_gsm: fabricGsm,
  441 |     created_at: req.created_at || new Date().toISOString(),
  442 |     certifications: normalizeKeywordList(req.certifications_required),
  443 |     incoterms: splitTokens(req.incoterms),
  444 |     payment_terms: splitTokens(req.payment_terms),
  445 |     document_ready: splitTokens(req.document_ready),
  446 |     audit_date: normalizeKeyword(req.audit_date),
  447 |     language_support: splitTokens(req.language_support),
  448 |     verified: Boolean(author.verified),
  449 |     org_type: normalizeKeyword(author.role),
  450 |     country: normalizeKeyword(author.country),
  451 |     processes: normalizeKeywordList(author.main_processes),
  452 |     export_ports: normalizeKeywordList(author.export_ports),
  453 |     years_in_business: parseNumberLike(author.years_in_business),
  454 |     team_seats: parseNumberLike(author.team_seats),
  455 |     handles_multiple_factories: Boolean(author.handles_multiple_factories),
  456 |     avg_response_hours: avgResponse,
  457 |     // normalize role seats (flatten keys to lowercase numbers when possible)
  458 |     role_seats: (() => {
  459 |       const raw = author.role_seats || author.roleSeats || (author.permission_matrix && author.permission_matrix.members && author.permission_matrix.members.seats) || null
  460 |       if (!raw || typeof raw !== 'object') return null
  461 |       const mapped = {}
  462 |       Object.entries(raw).forEach(([k, v]) => {
  463 |         const key = String(k || '').toLowerCase()
  464 |         const n = parseNumberLike(v)
  465 |         mapped[key] = n !== null ? n : v
  466 |       })
  467 |       return mapped
  468 |     })(),
  469 |     location: buildGeoPoint(author.location_lat, author.location_lng),
  470 |   }
  471 | }
  472 | 
  473 | export async function ensureOpenSearchIndices() {
  474 |   const cfg = await loadConfig()
  475 |   if (!cfg.enabled || !cfg.url) return { ok: false, reason: 'not_configured' }
  476 |   const productsIndex = `${cfg.index_prefix}products`
  477 |   const requirementsIndex = `${cfg.index_prefix}requirements`
  478 |   await ensureIndex(productsIndex, productMappings())
  479 |   await ensureIndex(requirementsIndex, requirementMappings())
  480 |   return { ok: true }
  481 | }
  482 | 
  483 | export async function indexProduct(product, author) {
  484 |   if (!shouldIndexProduct(product)) {
  485 |     await deleteProductIndex(String(product?.id || ''))
  486 |     return
  487 |   }
  488 |   const { cfg, client } = await getClient()
  489 |   if (!client) return
  490 |   const indexName = `${cfg.index_prefix}products`
  491 |   await ensureIndex(indexName, productMappings())
  492 |   const responseMap = await buildResponseTimeByOwner()
  493 |   const doc = await buildProductDoc(product, author, responseMap)
  494 |   await client.index({ index: indexName, id: doc.id, body: doc, refresh: true })
  495 | }
  496 | 
  497 | export async function indexRequirement(req, author) {
  498 |   const { cfg, client } = await getClient()
  499 |   if (!client) return
  500 |   const indexName = `${cfg.index_prefix}requirements`
  501 |   await ensureIndex(indexName, requirementMappings())
  502 |   const responseMap = await buildResponseTimeByOwner()
  503 |   const doc = await buildRequirementDoc(req, author, responseMap)
  504 |   await client.index({ index: indexName, id: doc.id, body: doc, refresh: true })
  505 | }
  506 | 
  507 | export async function deleteProductIndex(id) {
  508 |   const { cfg, client } = await getClient()
  509 |   if (!client) return
  510 |   const indexName = `${cfg.index_prefix}products`
  511 |   try {
  512 |     await client.delete({ index: indexName, id, refresh: true })
  513 |   } catch {
  514 |     // ignore
  515 |   }
  516 | }
  517 | 
  518 | export async function deleteRequirementIndex(id) {
  519 |   const { cfg, client } = await getClient()
  520 |   if (!client) return
  521 |   const indexName = `${cfg.index_prefix}requirements`
  522 |   try {
  523 |     await client.delete({ index: indexName, id, refresh: true })
  524 |   } catch {
  525 |     // ignore
  526 |   }
  527 | }
  528 | 
  529 | function buildFacetAggs() {
  530 |   return {
  531 |     category: { terms: { field: 'category', size: 12 } },
  532 |     certifications: { terms: { field: 'certifications', size: 12 } },
  533 |     processes: { terms: { field: 'processes', size: 12 } },
  534 |     languageSupport: { terms: { field: 'language_support', size: 12 } },
  535 |     incoterms: { terms: { field: 'incoterms', size: 12 } },
  536 |     paymentTerms: { terms: { field: 'payment_terms', size: 12 } },
  537 |     documentReady: { terms: { field: 'document_ready', size: 12 } },
  538 |     exportPort: { terms: { field: 'export_ports', size: 12 } },
  539 |     fabricType: { terms: { field: 'material.keyword', size: 12 } },
  540 |   }
  541 | }
  542 | 
  543 | function aggsToFacets(aggs = {}) {
  544 |   const out = {}
  545 |   Object.entries(aggs || {}).forEach(([key, value]) => {
  546 |     const buckets = value?.buckets || []
  547 |     out[key] = Object.fromEntries(
  548 |       buckets.map((bucket) => [String(bucket.key), Number(bucket.doc_count || 0)]),
  549 |     )
  550 |   })
  551 |   return out
  552 | }
  553 | 
  554 | function buildRangeFilter(field, range) {
  555 |   const filter = {}
  556 |   if (range.min !== null) filter.gte = range.min
  557 |   if (range.max !== null) filter.lte = range.max
  558 |   return Object.keys(filter).length ? { range: { [field]: filter } } : null
  559 | }
  560 | 
  561 | function addTermFilter(filters, field, value) {
  562 |   if (!value) return
  563 |   filters.push({ term: { [field]: value } })
  564 | }
  565 | 
  566 | function addTermsFilter(filters, field, values = []) {
  567 |   if (!values?.length) return
  568 |   filters.push({ terms: { [field]: values } })
  569 | }
  570 | 
  571 | export async function searchOpenSearch({
  572 |   index,
  573 |   query,
  574 |   filters = {},
  575 |   cursor = 0,
  576 |   limit = 20,
  577 |   estimateOnly = false,
  578 | } = {}) {
  579 |   const cfg = await loadConfig()
  580 |   if (!cfg.enabled || !cfg.url) return { engine: 'fallback_json', error_code: 'not_configured', ids: [], facets: null, total: 0 }
  581 | 
  582 |   const { client } = await getClient()
  583 |   if (!client) return { engine: 'fallback_json', error_code: 'not_configured', ids: [], facets: null, total: 0 }
  584 | 
  585 |   const indexName = `${cfg.index_prefix}${index}`
  586 |   const must = []
  587 |   const filter = []
  588 | 
  589 |   if (query) {
  590 |     must.push({
  591 |       multi_match: {
  592 |         query,
  593 |         fields: ['title^2', 'category', 'material', 'industry'],
  594 |       },
  595 |     })
  596 |   }
  597 | 
  598 |   addTermFilter(filter, 'industry', filters.industry)
  599 |   addTermFilter(filter, 'country', filters.country)
  600 |   addTermFilter(filter, 'org_type', filters.orgType)
  601 |   if (filters.verifiedOnly) addTermFilter(filter, 'verified', true)
  602 |   if (filters.category?.length) addTermsFilter(filter, 'category', filters.category)
  603 |   if (filters.fabricType?.length) addTermsFilter(filter, 'material.keyword', filters.fabricType)
  604 |   if (filters.certifications?.length) addTermsFilter(filter, 'certifications', filters.certifications)
  605 |   if (filters.processes?.length) addTermsFilter(filter, 'processes', filters.processes)
  606 |   if (filters.languageSupport?.length) addTermsFilter(filter, 'language_support', filters.languageSupport)
  607 |   if (filters.incoterms?.length) addTermsFilter(filter, 'incoterms', filters.incoterms)
  608 |   if (filters.paymentTerms?.length) addTermsFilter(filter, 'payment_terms', filters.paymentTerms)
  609 |   if (filters.documentReady?.length) addTermsFilter(filter, 'document_ready', filters.documentReady)
  610 |   if (filters.exportPort?.length) addTermsFilter(filter, 'export_ports', filters.exportPort)
  611 | 
  612 |   const moqRange = parseRangeValue(filters.moqRange)
  613 |   const moqFilter = buildRangeFilter('moq_value', moqRange)
  614 |   if (moqFilter) filter.push(moqFilter)
  615 | 
  616 |   const priceRange = parseRangeValue(filters.priceRangeBase || filters.priceRange)
  617 |   const priceMinFilter = buildRangeFilter('price_base_min', priceRange)
  618 |   const priceMaxFilter = buildRangeFilter('price_base_max', priceRange)
  619 |   if (priceMinFilter) filter.push(priceMinFilter)
  620 |   if (priceMaxFilter) filter.push(priceMaxFilter)
  621 | 
  622 |   if (filters.leadTimeMax) {
  623 |     filter.push({ range: { lead_time_days: { lte: Number(filters.leadTimeMax) } } })
  624 |   }
  625 |   if (filters.gsmMin) filter.push({ range: { fabric_gsm: { gte: Number(filters.gsmMin) } } })
  626 |   if (filters.gsmMax) filter.push({ range: { fabric_gsm: { lte: Number(filters.gsmMax) } } })
  627 |   if (filters.capacityMin !== undefined && filters.capacityMin !== null && String(filters.capacityMin).trim() !== '') {
  628 |     const capacityField = index === 'requirements' ? 'capacity_min' : 'monthly_capacity'
  629 |     filter.push({ range: { [capacityField]: { gte: Number(filters.capacityMin) } } })
  630 |   }
  631 |   if (filters.yearsInBusinessMin) filter.push({ range: { years_in_business: { gte: Number(filters.yearsInBusinessMin) } } })
  632 |   if (filters.teamSeatsMin) filter.push({ range: { team_seats: { gte: Number(filters.teamSeatsMin) } } })
  633 |   if (filters.responseTimeMax) filter.push({ range: { avg_response_hours: { lte: Number(filters.responseTimeMax) } } })
  634 |   if (filters.handlesMultipleFactories !== undefined && filters.handlesMultipleFactories !== null) {
  635 |     addTermFilter(filter, 'handles_multiple_factories', Boolean(filters.handlesMultipleFactories))
  636 |   }
  637 | 
  638 |   // roleSeats filter: accepts a comma-separated list like "manager:2,admin:1"
  639 |   if (filters.roleSeats) {
  640 |     const raw = String(filters.roleSeats || '').trim()
  641 |     if (raw) {
  642 |       for (const part of raw.split(',')) {
  643 |         const [roleRaw, seatsRaw] = String(part || '').split(':').map((s) => (s || '').trim())
  644 |         if (!roleRaw) continue
  645 |         const roleKey = String(roleRaw || '').toLowerCase()
  646 |         const minSeats = parseNumberLike(seatsRaw)
  647 |         if (minSeats === null) continue
  648 |         // Match documents where role_seats.<roleKey> >= minSeats OR team_seats >= minSeats
  649 |         filter.push({
  650 |           bool: {
  651 |             should: [
  652 |               { range: { [`role_seats.${roleKey}`]: { gte: minSeats } } },
  653 |               { range: { team_seats: { gte: minSeats } } },
  654 |             ],
  655 |           },
  656 |         })
  657 |       }
  658 |     }
  659 |   }
  660 |   if (filters.sampleAvailable) addTermFilter(filter, 'sample_available', true)
  661 |   if (filters.sampleLeadTimeMax !== undefined && filters.sampleLeadTimeMax !== null && String(filters.sampleLeadTimeMax).trim() !== '') {
  662 |     filter.push({ range: { sample_lead_time_days: { lte: Number(filters.sampleLeadTimeMax) } } })
  663 |   }
  664 |   if (filters.auditDate) addTermFilter(filter, 'audit_date', String(filters.auditDate))
  665 | 
  666 |   if (filters.sizeRange) addTermFilter(filter, 'size_range', String(filters.sizeRange))
  667 |   if (filters.colorPantone?.length) addTermsFilter(filter, 'color_pantone_codes', filters.colorPantone.map((c) => String(c).toUpperCase()))
  668 |   if (filters.customization?.length) addTermsFilter(filter, 'customization', filters.customization.map((c) => String(c).toLowerCase()))
  669 | 
  670 |   if (filters.locationLat !== undefined && filters.locationLat !== null && filters.locationLng !== undefined && filters.locationLng !== null && filters.distanceKm) {
  671 |     filter.push({
  672 |       geo_distance: {
  673 |         distance: `${filters.distanceKm}km`,
  674 |         location: {
  675 |           lat: Number(filters.locationLat),
  676 |           lon: Number(filters.locationLng),
  677 |         },
  678 |       },
  679 |     })
  680 |   }
  681 | 
  682 |   const from = Math.max(0, Number(cursor || 0))
  683 |   const size = estimateOnly ? 0 : Math.min(50, Math.max(1, Number(limit || 20)))
  684 | 
  685 |   const body = {
  686 |     from,
  687 |     size,
  688 |     track_total_hits: true,
  689 |     query: { bool: { must: must.length ? must : [{ match_all: {} }], filter } },
  690 |     aggs: buildFacetAggs(),
  691 |     ...(query ? {} : { sort: [{ created_at: 'desc' }] }),
  692 |   }
  693 | 
  694 |   try {
  695 |     const response = await client.search({ index: indexName, body })
  696 |     const hits = response?.body?.hits?.hits || []
  697 |     const ids = hits.map((hit) => hit._id)
  698 |     const facets = aggsToFacets(response?.body?.aggregations || {})
  699 |     const total = mapTotalHits(response?.body?.hits?.total)
  700 |     lastStatus = { ...lastStatus, last_ok_at: new Date().toISOString(), last_error: '' }
  701 |     return { engine: 'opensearch', ids, facets, total }
  702 |   } catch (error) {
  703 |     lastStatus = { last_ok_at: lastStatus.last_ok_at, last_error_at: new Date().toISOString(), last_error: error?.message || 'opensearch_error' }
  704 |     return { engine: 'fallback_json', error_code: 'opensearch_error', ids: [], facets: null, total: 0 }
  705 |   }
  706 | }
  707 | 
  708 | export async function reindexAll({ reset = false } = {}) {
  709 |   const cfg = await loadConfig()
  710 |   if (!cfg.enabled || !cfg.url) return { ok: false, reason: 'not_configured' }
  711 |   const { client } = await getClient()
  712 |   if (!client) return { ok: false, reason: 'not_configured' }
  713 | 
  714 |   const productsIndex = `${cfg.index_prefix}products`
  715 |   const requirementsIndex = `${cfg.index_prefix}requirements`
  716 | 
  717 |   if (reset) {
  718 |     await deleteIndexIfExists(productsIndex)
  719 |     await deleteIndexIfExists(requirementsIndex)
  720 |   }
  721 | 
  722 |   await ensureIndex(productsIndex, productMappings())
  723 |   await ensureIndex(requirementsIndex, requirementMappings())
  724 | 
  725 |   const [products, requirements, users] = await Promise.all([
  726 |     readJson('company_products.json'),
  727 |     readJson('requirements.json'),
  728 |     readJson('users.json'),
  729 |   ])
  730 | 
  731 |   const userRows = Array.isArray(users) ? users : []
  732 |   const usersById = new Map(userRows.map((u) => [String(u.id), u]))
  733 |   const responseMap = await buildResponseTimeByOwner()
  734 | 
  735 |   const productRows = Array.isArray(products) ? products : []
  736 |   if (productRows.length) {
  737 |     const ops = []
  738 |     for (const p of productRows) {
  739 |       if (!shouldIndexProduct(p)) continue
  740 |       const owner = usersById.get(String(p.company_id)) || null
  741 |       const author = owner?.profile ? { ...owner, ...owner.profile } : (owner || {})
  742 |       const doc = await buildProductDoc(p, author, responseMap)
  743 |       ops.push({ index: { _index: productsIndex, _id: doc.id } }, doc)
  744 |     }
  745 |     await client.bulk({ refresh: true, body: ops })
  746 |   }
  747 | 
  748 |   const reqRows = Array.isArray(requirements) ? requirements : []
  749 |   if (reqRows.length) {
  750 |     const ops = []
  751 |     for (const r of reqRows) {
  752 |       const owner = usersById.get(String(r.buyer_id)) || null
  753 |       const author = owner?.profile ? { ...owner, ...owner.profile } : (owner || {})
  754 |       const doc = await buildRequirementDoc(r, author, responseMap)
  755 |       ops.push({ index: { _index: requirementsIndex, _id: doc.id } }, doc)
  756 |     }
  757 |     await client.bulk({ refresh: true, body: ops })
  758 |   }
  759 | 
  760 |   return { ok: true }
  761 | }
  762 | 
  763 | export async function reindexOrg(orgId) {
  764 |   const cfg = await loadConfig()
  765 |   if (!cfg.enabled || !cfg.url) return { ok: false, reason: 'not_configured' }
  766 |   const safeOrgId = safeString(orgId)
  767 |   if (!safeOrgId) return { ok: false, reason: 'org_id_required' }
  768 | 
  769 |   const { client } = await getClient()
  770 |   if (!client) return { ok: false, reason: 'not_configured' }
  771 | 
  772 |   await ensureOpenSearchIndices()
  773 | 
  774 |   const [products, requirements, users] = await Promise.all([
  775 |     readJson('company_products.json'),
  776 |     readJson('requirements.json'),
  777 |     readJson('users.json'),
  778 |   ])
  779 | 
  780 |   const userRows = Array.isArray(users) ? users : []
  781 |   const usersById = new Map(userRows.map((u) => [String(u.id), u]))
  782 |   const owner = usersById.get(String(safeOrgId)) || null
  783 |   const author = owner?.profile ? { ...owner, ...owner.profile } : (owner || {})
  784 |   const responseMap = await buildResponseTimeByOwner()
  785 | 
  786 |   const productsIndex = `${cfg.index_prefix}products`
  787 |   const requirementsIndex = `${cfg.index_prefix}requirements`
  788 | 
  789 |   const productRows = (Array.isArray(products) ? products : [])
  790 |     .filter((p) => String(p.company_id || '') === safeOrgId)
  791 |     .filter((p) => shouldIndexProduct(p))
  792 |   if (productRows.length) {
  793 |     const ops = []
  794 |     for (const p of productRows) {
  795 |       const doc = await buildProductDoc(p, author, responseMap)
  796 |       ops.push({ index: { _index: productsIndex, _id: doc.id } }, doc)
  797 |     }
  798 |     await client.bulk({ refresh: true, body: ops })
  799 |   }
  800 | 
  801 |   const reqRows = (Array.isArray(requirements) ? requirements : []).filter((r) => String(r.buyer_id || '') === safeOrgId)
  802 |   if (reqRows.length) {
  803 |     const ops = []
  804 |     for (const r of reqRows) {
  805 |       const doc = await buildRequirementDoc(r, author, responseMap)
  806 |       ops.push({ index: { _index: requirementsIndex, _id: doc.id } }, doc)
  807 |     }
  808 |     await client.bulk({ refresh: true, body: ops })
  809 |   }
  810 | 
  811 |   return { ok: true, org_id: safeOrgId, products: productRows.length, requirements: reqRows.length }
  812 | }
  813 | 
  814 | export async function getOpenSearchStatus() {
  815 |   const cfg = await loadConfig()
  816 |   const configured = Boolean(cfg.enabled && cfg.url)
  817 |   if (!configured) {
  818 |     return {
  819 |       configured: false,
  820 |       enabled: Boolean(cfg.enabled),
  821 |       url_set: Boolean(cfg.url),
  822 |       index_prefix: cfg.index_prefix,
  823 |       last_ok_at: lastStatus.last_ok_at,
  824 |       last_error_at: lastStatus.last_error_at,
  825 |       last_error: lastStatus.last_error,
  826 |     }
  827 |   }
  828 | 
  829 |   const { client } = await getClient()
  830 |   if (!client) {
  831 |     return {
  832 |       configured: false,
  833 |       enabled: Boolean(cfg.enabled),
  834 |       url_set: Boolean(cfg.url),
  835 |       index_prefix: cfg.index_prefix,
  836 |       last_ok_at: lastStatus.last_ok_at,
  837 |       last_error_at: lastStatus.last_error_at,
  838 |       last_error: lastStatus.last_error,
  839 |     }
  840 |   }
  841 | 
  842 |   const productsIndex = `${cfg.index_prefix}products`
  843 |   const requirementsIndex = `${cfg.index_prefix}requirements`
  844 | 
  845 |   let reachable = false
  846 |   let products_exists = false
  847 |   let requirements_exists = false
  848 |   let products_count = 0
  849 |   let requirements_count = 0
  850 |   let error = ''
  851 | 
  852 |   try {
  853 |     await client.ping()
  854 |     reachable = true
  855 |     products_exists = (await client.indices.exists({ index: productsIndex }))?.body === true
  856 |     requirements_exists = (await client.indices.exists({ index: requirementsIndex }))?.body === true
  857 |     if (products_exists) {
  858 |       const res = await client.count({ index: productsIndex })
  859 |       products_count = Number(res?.body?.count || 0)
  860 |     }
  861 |     if (requirements_exists) {
  862 |       const res = await client.count({ index: requirementsIndex })
  863 |       requirements_count = Number(res?.body?.count || 0)
  864 |     }
  865 |     lastStatus = { ...lastStatus, last_ok_at: new Date().toISOString(), last_error: '' }
  866 |   } catch (err) {
  867 |     error = err?.message || 'opensearch_unreachable'
  868 |     lastStatus = { last_ok_at: lastStatus.last_ok_at, last_error_at: new Date().toISOString(), last_error: error }
  869 |   }
  870 | 
  871 |   return {
  872 |     configured: true,
  873 |     enabled: Boolean(cfg.enabled),
  874 |     reachable,
  875 |     url: cfg.url,
  876 |     index_prefix: cfg.index_prefix,
  877 |     indices: {
  878 |       products: { name: productsIndex, exists: products_exists, count: products_count },
  879 |       requirements: { name: requirementsIndex, exists: requirements_exists, count: requirements_count },
  880 |     },
  881 |     last_ok_at: lastStatus.last_ok_at,
  882 |     last_error_at: lastStatus.last_error_at,
  883 |     last_error: error || lastStatus.last_error,
  884 |   }
  885 | }
  886 | 