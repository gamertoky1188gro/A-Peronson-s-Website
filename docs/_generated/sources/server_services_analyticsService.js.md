    1 | import crypto from 'crypto'
    2 | import { readJson } from '../utils/jsonStore.js'
    3 | import prisma from '../utils/prisma.js'
    4 | import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
    5 | import { getAdminConfig } from './adminConfigService.js'
    6 | import { canViewAnalytics, canViewAnalyticsAdmin, canViewAnalyticsDashboard, forbiddenError, scopeRecordsForUser } from '../utils/permissions.js'
    7 | import { getPlanForUser } from './entitlementService.js'
    8 | import { getOrderCertificationSummary } from './orderCertificationService.js'
    9 | import { appendAuditLog } from '../utils/auditStore.js'
   10 | import {
   11 |   assertNoUnauthorizedAnalyticsJoin,
   12 |   checkAnalyticsAccessPolicy,
   13 |   getAnalyticsGovernanceConfig,
   14 |   sanitizePlatformAnalytics,
   15 | } from './analyticsGovernanceService.js'
   16 | 
   17 | const FILE = 'analytics.json'
   18 | const SEARCH_TREND_MIN_EVENTS = 25
   19 | const USE_SQL_CRM = isCrmSqlEnabled()
   20 | 
   21 | async function getSearchMinEvents() {
   22 |   try {
   23 |     const config = await getAdminConfig()
   24 |     const raw = Number(config?.analytics?.search_min_events)
   25 |     return Number.isFinite(raw) && raw > 0 ? raw : SEARCH_TREND_MIN_EVENTS
   26 |   } catch {
   27 |     return SEARCH_TREND_MIN_EVENTS
   28 |   }
   29 | }
   30 | 
   31 | export async function trackEvent({ type, actor_id, entity_id, metadata = {} }) {
   32 |   if (USE_SQL_CRM) {
   33 |     await prisma.analyticsEvent.create({
   34 |       data: {
   35 |         id: crypto.randomUUID(),
   36 |         type,
   37 |         actor_id: actor_id || null,
   38 |         entity_id: entity_id || null,
   39 |         metadata,
   40 |         created_at: new Date(),
   41 |       },
   42 |     })
   43 |     return
   44 |   }
   45 |   // Legacy fallback is intentionally read-only during the verification window.
   46 | }
   47 | 
   48 | function ensureAnalyticsAccess(user) {
   49 |   if (canViewAnalytics(user)) return
   50 |   throw forbiddenError()
   51 | }
   52 | 
   53 | function ensureAnalyticsDashboardAccess(user) {
   54 |   if (canViewAnalyticsDashboard(user)) return
   55 |   throw forbiddenError()
   56 | }
   57 | 
   58 | function ensureAnalyticsAdminAccess(user) {
   59 |   if (canViewAnalyticsAdmin(user)) return
   60 |   throw forbiddenError()
   61 | }
   62 | 
   63 | function scopeAnalyticsRecords(user, records, idFields) {
   64 |   // Main accounts (buying house / factory) can view the org-level dashboard.
   65 |   // In this MVP data model, we treat them as org managers (unscoped) to avoid "all zeros".
   66 |   const role = String(user?.role || '').toLowerCase()
   67 |   if (role === 'buying_house' || role === 'factory' || role === 'owner' || role === 'admin') return records
   68 | 
   69 |   return scopeRecordsForUser(user, records, {
   70 |     idFields,
   71 |     assignmentFields: ['assigned_agent_id', 'agent_id'],
   72 |   })
   73 | }
   74 | 
   75 | export async function getAnalyticsSummary(user) {
   76 |   ensureAnalyticsAccess(user)
   77 |   const all = USE_SQL_CRM ? await prisma.analyticsEvent.findMany() : await readLegacyJson(FILE)
   78 |   const scoped = scopeAnalyticsRecords(user, all, ['actor_id', 'entity_id'])
   79 |   const byType = scoped.reduce((acc, e) => {
   80 |     acc[e.type] = (acc[e.type] || 0) + 1
   81 |     return acc
   82 |   }, {})
   83 |   return { total_events: scoped.length, by_type: byType }
   84 | }
   85 | 
   86 | function monthKey(value) {
   87 |   const d = new Date(value || '')
   88 |   if (Number.isNaN(d.getTime())) return null
   89 |   return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
   90 | }
   91 | 
   92 | function toMonthlySeries(items, dateKey) {
   93 |   const bucket = items.reduce((acc, item) => {
   94 |     const key = monthKey(item[dateKey])
   95 |     if (!key) return acc
   96 |     acc[key] = (acc[key] || 0) + 1
   97 |     return acc
   98 |   }, {})
   99 | 
  100 |   return Object.entries(bucket)
  101 |     .sort(([a], [b]) => a.localeCompare(b))
  102 |     .map(([month, count]) => ({ month, count }))
  103 | }
  104 | 
  105 | function formatHours(avgHours) {
  106 |   const h = Number(avgHours) || 0
  107 |   if (!Number.isFinite(h) || h <= 0) return '--'
  108 |   if (h < 1) return `${Math.round(h * 60)}m`
  109 |   if (h < 24) return `${Math.round(h)}h`
  110 |   return `${Math.round(h / 24)}d`
  111 | }
  112 | 
  113 | function calcPercent(n, d) {
  114 |   const dn = Number(d) || 0
  115 |   if (!dn) return 0
  116 |   return Math.round((Number(n || 0) / dn) * 100)
  117 | }
  118 | 
  119 | function safeNumber(value) {
  120 |   const n = Number(String(value || '').replace(/[^\d.]/g, ''))
  121 |   return Number.isFinite(n) ? n : null
  122 | }
  123 | 
  124 | function bucketNormalizedPrice(value) {
  125 |   const n = Number(value)
  126 |   if (!Number.isFinite(n) || n < 0) return 'unknown'
  127 |   if (n <= 5) return '0-5'
  128 |   if (n <= 10) return '5-10'
  129 |   if (n <= 20) return '10-20'
  130 |   if (n <= 50) return '20-50'
  131 |   return '50+'
  132 | }
  133 | 
  134 | function normalizedPriceForBucket(row = {}) {
  135 |   const min = Number(row?.priceBaseMin)
  136 |   const max = Number(row?.priceBaseMax)
  137 |   if (Number.isFinite(min)) return min
  138 |   if (Number.isFinite(max)) return max
  139 |   const legacy = Number(row?.priceNormalizedBase)
  140 |   return Number.isFinite(legacy) ? legacy : null
  141 | }
  142 | 
  143 | function parseMatchId(matchId = '') {
  144 |   const parts = String(matchId || '').split(':')
  145 |   if (parts.length !== 2) return null
  146 |   return { requirementId: parts[0], supplierId: parts[1] }
  147 | }
  148 | 
  149 | function computeResponseTimesForOrg(messages = [], orgMemberIds = new Set()) {
  150 |   const messagesByMatch = new Map()
  151 | 
  152 |   for (const msg of messages) {
  153 |     const matchId = String(msg?.match_id || '')
  154 |     if (!matchId || matchId.startsWith('friend:')) continue
  155 |     if (!messagesByMatch.has(matchId)) messagesByMatch.set(matchId, [])
  156 |     messagesByMatch.get(matchId).push(msg)
  157 |   }
  158 | 
  159 |   const responseTimes = []
  160 |   for (const msgs of messagesByMatch.values()) {
  161 |     const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
  162 |     const firstInbound = sorted.find((m) => !orgMemberIds.has(String(m.sender_id || '')))
  163 |     if (!firstInbound?.timestamp) continue
  164 |     const inboundAt = new Date(firstInbound.timestamp).getTime()
  165 |     if (!Number.isFinite(inboundAt)) continue
  166 | 
  167 |     const firstOutbound = sorted.find((m) => orgMemberIds.has(String(m.sender_id || '')) && new Date(m.timestamp).getTime() >= inboundAt)
  168 |     if (!firstOutbound?.timestamp) continue
  169 |     const outboundAt = new Date(firstOutbound.timestamp).getTime()
  170 |     if (!Number.isFinite(outboundAt)) continue
  171 | 
  172 |     responseTimes.push((outboundAt - inboundAt) / (1000 * 60 * 60))
  173 |   }
  174 | 
  175 |   const avg = responseTimes.length ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0
  176 |   return { avg_hours: avg, formatted: formatHours(avg) }
  177 | }
  178 | 
  179 | export async function getDashboardAnalytics(user) {
  180 |   ensureAnalyticsDashboardAccess(user)
  181 | 
  182 |   const [events, requirements, messages, matches, documents, users, products, ratings] = await Promise.all([
  183 |     readJson(FILE),
  184 |     readJson('requirements.json'),
  185 |     readJson('messages.json'),
  186 |     readJson('matches.json'),
  187 |     readJson('documents.json'),
  188 |     readJson('users.json'),
  189 |     readJson('company_products.json'),
  190 |     readJson('ratings.json'),
  191 |   ])
  192 | 
  193 |   const scopedEvents = scopeAnalyticsRecords(user, events, ['actor_id', 'entity_id'])
  194 |   const scopedRequirements = scopeAnalyticsRecords(user, requirements, ['buyer_id', 'requester_id'])
  195 |   const scopedMessages = scopeAnalyticsRecords(user, messages, ['sender_id', 'receiver_id'])
  196 |   const scopedMatches = scopeAnalyticsRecords(user, matches, ['buyer_id', 'factory_id'])
  197 |   const scopedDocuments = scopeAnalyticsRecords(user, documents, ['uploaded_by', 'buyer_id', 'factory_id', 'entity_id'])
  198 |   const scopedProducts = scopeAnalyticsRecords(user, products, ['company_id', 'uploaded_by', 'owner_id'])
  199 | 
  200 |   const uniqueActiveChats = new Set(scopedMessages.map((m) => m.match_id).filter(Boolean)).size
  201 |   const connectedPartners = new Set(scopedMatches.map((m) => m.factory_id).filter(Boolean)).size
  202 |   const contractDocs = scopedDocuments.filter((d) => d.entity_type === 'contract' || String(d.type || '').toLowerCase().includes('contract'))
  203 |   const byType = scopedEvents.reduce((acc, e) => {
  204 |     acc[e.type] = (acc[e.type] || 0) + 1
  205 |     return acc
  206 |   }, {})
  207 | 
  208 |   const interactionSummary = (() => {
  209 |     const pageViews = scopedEvents.filter((e) => e.type === 'page_view')
  210 |     const clicks = scopedEvents.filter((e) => e.type === 'click')
  211 |     const sessionEvents = scopedEvents.filter((e) => e.type === 'session_end' || e.type === 'page_duration')
  212 |     const durations = sessionEvents
  213 |       .map((e) => {
  214 |         const seconds = Number(e?.metadata?.duration_seconds)
  215 |         if (Number.isFinite(seconds) && seconds > 0) return seconds
  216 |         const ms = Number(e?.metadata?.duration_ms)
  217 |         if (Number.isFinite(ms) && ms > 0) return Math.round(ms / 1000)
  218 |         return 0
  219 |       })
  220 |       .filter((v) => v > 0)
  221 |     const avgSessionSeconds = durations.length
  222 |       ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
  223 |       : 0
  224 | 
  225 |     const viewsByPage = pageViews.reduce((acc, e) => {
  226 |       const key = String(e.entity_id || e?.metadata?.entity_id || e?.metadata?.entity_type || 'unknown')
  227 |       acc[key] = (acc[key] || 0) + 1
  228 |       return acc
  229 |     }, {})
  230 | 
  231 |     const topPages = Object.entries(viewsByPage)
  232 |       .sort((a, b) => b[1] - a[1])
  233 |       .slice(0, 5)
  234 |       .map(([page, count]) => ({ page, count }))
  235 | 
  236 |     return {
  237 |       total_page_views: pageViews.length,
  238 |       total_clicks: clicks.length,
  239 |       avg_session_duration_seconds: avgSessionSeconds,
  240 |       top_pages: topPages,
  241 |     }
  242 |   })()
  243 | 
  244 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  245 | 
  246 |   function isRecent(iso, days = 30) {
  247 |     const t = new Date(String(iso || '')).getTime()
  248 |     if (!Number.isFinite(t)) return false
  249 |     return t >= Date.now() - days * 24 * 60 * 60 * 1000
  250 |   }
  251 | 
  252 |   function percent(n, d) {
  253 |     const dn = Number(d) || 0
  254 |     if (!dn) return 0
  255 |     return Math.round((Number(n || 0) / dn) * 100)
  256 |   }
  257 | 
  258 | 
  259 |   // --- Top metrics (project.md) ---
  260 |   const uniqueRequirementIdsWithMatch = new Set(scopedMatches.map((m) => String(m.requirement_id || '')).filter(Boolean)).size
  261 |   const buyerSupplierMatchRate = percent(uniqueRequirementIdsWithMatch, scopedRequirements.length)
  262 | 
  263 |   const buyersActive = new Set()
  264 |   const suppliersActive = new Set()
  265 | 
  266 |   scopedRequirements.filter((r) => isRecent(r.created_at)).forEach((r) => {
  267 |     if (r?.buyer_id) buyersActive.add(String(r.buyer_id))
  268 |   })
  269 |   scopedProducts.filter((p) => isRecent(p.created_at)).forEach((p) => {
  270 |     if (p?.company_id) suppliersActive.add(String(p.company_id))
  271 |   })
  272 |   scopedMessages.filter((m) => isRecent(m.timestamp)).forEach((m) => {
  273 |     const sender = usersById.get(String(m.sender_id || ''))
  274 |     if (!sender) return
  275 |     const role = String(sender.role || '').toLowerCase()
  276 |     if (role === 'buyer') buyersActive.add(String(sender.id))
  277 |     if (role === 'factory' || role === 'buying_house') suppliersActive.add(String(sender.id))
  278 |   })
  279 | 
  280 |   const activeBuyerSupplierRatio = suppliersActive.size
  281 |     ? `${buyersActive.size}:${suppliersActive.size}`
  282 |     : `${buyersActive.size}:0`
  283 | 
  284 |   const requestToContractConversion = percent(contractDocs.length, scopedRequirements.length)
  285 | 
  286 |   // Time to first qualified response: first verified supplier message after a buyer request.
  287 |   const firstResponseHours = []
  288 |   const requirementsById = new Map(scopedRequirements.map((r) => [String(r.id), r]))
  289 |   const messagesByMatch = scopedMessages.reduce((acc, m) => {
  290 |     const id = String(m.match_id || '')
  291 |     if (!id) return acc
  292 |     if (!acc.has(id)) acc.set(id, [])
  293 |     acc.get(id).push(m)
  294 |     return acc
  295 |   }, new Map())
  296 | 
  297 |   for (const [matchId, msgs] of messagesByMatch.entries()) {
  298 |     const parts = String(matchId).split(':')
  299 |     if (parts.length !== 2) continue
  300 |     const requirementId = parts[0]
  301 |     const factoryId = parts[1]
  302 |     const reqRow = requirementsById.get(String(requirementId))
  303 |     if (!reqRow?.created_at) continue
  304 |     const buyerId = String(reqRow.buyer_id || '')
  305 |     const createdAt = new Date(reqRow.created_at).getTime()
  306 |     if (!Number.isFinite(createdAt)) continue
  307 | 
  308 |     const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
  309 |     const firstQualified = sorted.find((m) => {
  310 |       const senderId = String(m.sender_id || '')
  311 |       if (!senderId) return false
  312 |       if (senderId === buyerId) return false
  313 |       if (senderId !== String(factoryId)) return false
  314 |       const sender = usersById.get(senderId)
  315 |       return Boolean(sender?.verified)
  316 |     })
  317 |     if (!firstQualified?.timestamp) continue
  318 |     const firstAt = new Date(firstQualified.timestamp).getTime()
  319 |     if (!Number.isFinite(firstAt) || firstAt < createdAt) continue
  320 |     firstResponseHours.push((firstAt - createdAt) / (1000 * 60 * 60))
  321 |   }
  322 | 
  323 |   const avgFirstResponseHours = firstResponseHours.length
  324 |     ? (firstResponseHours.reduce((a, b) => a + b, 0) / firstResponseHours.length)
  325 |     : 0
  326 | 
  327 |   const repeatBuyerRate = (() => {
  328 |     const counts = scopedRequirements.reduce((acc, r) => {
  329 |       const bid = String(r.buyer_id || '')
  330 |       if (!bid) return acc
  331 |       acc[bid] = (acc[bid] || 0) + 1
  332 |       return acc
  333 |     }, {})
  334 |     const buyers = Object.keys(counts)
  335 |     const repeat = buyers.filter((b) => counts[b] >= 2).length
  336 |     return percent(repeat, buyers.length)
  337 |   })()
  338 | 
  339 |   // Buying house metrics (project.md) derived from same data model (MVP approximations).
  340 |   const demandTrend = scopedRequirements
  341 |     .reduce((acc, r) => {
  342 |       const k = String(r.category || r.product || 'Other')
  343 |       acc[k] = (acc[k] || 0) + 1
  344 |       return acc
  345 |     }, {})
  346 | 
  347 |   const topRequested = Object.entries(demandTrend)
  348 |     .sort((a, b) => b[1] - a[1])
  349 |     .slice(0, 5)
  350 |     .map(([label, count]) => ({ label, count }))
  351 | 
  352 |   const leadDealConversion = percent(contractDocs.length, uniqueActiveChats || 0)
  353 | 
  354 |   const avgRating = (() => {
  355 |     const rows = Array.isArray(ratings) ? ratings : []
  356 |     const scoped = scopeAnalyticsRecords(user, rows, ['target_profile_key', 'author_id', 'target_user_id'])
  357 |     const values = scoped.map((r) => Number(r.rating || r.stars || 0)).filter((n) => Number.isFinite(n) && n > 0)
  358 |     if (!values.length) return 0
  359 |     return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
  360 |   })()
  361 | 
  362 |   const trustedDealScore = Math.max(0, Math.round((contractDocs.length * 10) + (avgRating * 5)))
  363 | 
  364 |   const role = String(user?.role || '').toLowerCase()
  365 |   const top_metrics = (() => {
  366 |     // Marketplace-owner view (owner/admin): use marketplace success metrics.
  367 |     if (role === 'owner' || role === 'admin') {
  368 |       return [
  369 |         { key: 'match_success_rate', label: 'Buyer -> Supplier Match Success', value: `${buyerSupplierMatchRate}%`, hint: 'Matched requests / total requests' },
  370 |         { key: 'active_ratio', label: 'Active Buyer : Supplier Ratio', value: activeBuyerSupplierRatio, hint: '30-day active users' },
  371 |         { key: 'request_to_contract', label: 'Request -> Contract Conversion', value: `${requestToContractConversion}%`, hint: 'Contracts / buyer requests' },
  372 |         { key: 'first_response', label: 'Time to First Qualified Response', value: formatHours(avgFirstResponseHours), hint: 'Verified supplier response speed' },
  373 |         { key: 'repeat_buyer', label: 'Repeat Buyer Rate', value: `${repeatBuyerRate}%`, hint: 'Buyers with 2+ requests' },
  374 |       ]
  375 |     }
  376 | 
  377 |     // Organization view (buying_house/factory): use the 5 metrics Shaun listed for enterprise analytics.
  378 |     if (role === 'buying_house' || role === 'factory') {
  379 |       return [
  380 |         { key: 'request_match_rate', label: 'Buyer Request Match Rate', value: `${buyerSupplierMatchRate}%`, hint: 'Matched requests / total requests' },
  381 |         { key: 'lead_deal', label: 'Lead -> Deal Conversion', value: `${leadDealConversion}%`, hint: 'Contracts / active chats' },
  382 |         { key: 'response_speed', label: 'Factory Response Speed', value: formatHours(avgFirstResponseHours), hint: 'Avg first verified reply' },
  383 |         { key: 'demand_trend', label: 'Buyer Demand Trend', value: topRequested.map((x) => x.label).join(', ') || '-', hint: 'Top requested categories' },
  384 |         { key: 'trusted_score', label: 'Trusted Deal Score', value: String(trustedDealScore), hint: 'Contracts + ratings (MVP)' },
  385 |       ]
  386 |     }
  387 | 
  388 |     // Agents: show limited metrics (permission gated elsewhere).
  389 |     return [
  390 |       { key: 'assigned_requests', label: 'Open Buyer Requests', value: String(scopedRequirements.filter((r) => r.status === 'open').length), hint: 'Visible within your scope' },
  391 |       { key: 'active_chats', label: 'Active Chats', value: String(uniqueActiveChats), hint: 'Threads with messages' },
  392 |       { key: 'contracts', label: 'Contracts', value: String(contractDocs.length), hint: 'Contracts in your scope' },
  393 |       { key: 'first_response', label: 'Avg First Response', value: formatHours(avgFirstResponseHours), hint: 'Within your scope' },
  394 |       { key: 'demand_trend', label: 'Demand Trend', value: topRequested.map((x) => x.label).join(', ') || '-', hint: 'Marketplace trend (MVP)' },
  395 |     ]
  396 |   })()
  397 | 
  398 |   return {
  399 |     totals: {
  400 |       buyer_requests: scopedRequirements.length,
  401 |       open_buyer_requests: scopedRequirements.filter((r) => r.status === 'open').length,
  402 |       chats: uniqueActiveChats,
  403 |       messages: scopedMessages.length,
  404 |       partner_network: connectedPartners,
  405 |       contracts: contractDocs.length,
  406 |       documents: scopedDocuments.length,
  407 |       factories: users.filter((u) => u.role === 'factory').length,
  408 |     },
  409 |     top_metrics,
  410 |     analytics_events: {
  411 |       total: scopedEvents.length,
  412 |       by_type: byType,
  413 |     },
  414 |     interaction_summary: interactionSummary,
  415 |     series: {
  416 |       buyer_requests: toMonthlySeries(scopedRequirements, 'created_at'),
  417 |       chats: toMonthlySeries(scopedMessages, 'timestamp'),
  418 |       documents: toMonthlySeries(scopedDocuments, 'created_at'),
  419 |     },
  420 |   }
  421 | }
  422 | 
  423 | 
  424 | export async function getCompanyAnalytics(user) {
  425 |   ensureAnalyticsDashboardAccess(user)
  426 |   const plan = await getPlanForUser(user)
  427 | 
  428 |   const [events, products, productViews, messages, documents, users, leads, requirements] = await Promise.all([
  429 |     readJson(FILE),
  430 |     readJson('company_products.json'),
  431 |     readJson('product_views.json'),
  432 |     readJson('messages.json'),
  433 |     readJson('documents.json'),
  434 |     readJson('users.json'),
  435 |     readJson('leads.json'),
  436 |     readJson('requirements.json'),
  437 |   ])
  438 | 
  439 |   const actorRole = String(user?.role || '').toLowerCase()
  440 |   const orgOwnerId = actorRole === 'agent'
  441 |     ? String(user?.org_owner_id || '')
  442 |     : String(user?.id || '')
  443 | 
  444 |   if (!orgOwnerId) throw forbiddenError()
  445 | 
  446 |   const orgAgents = (Array.isArray(users) ? users : [])
  447 |     .filter((u) => String(u.org_owner_id || '') === orgOwnerId && String(u.role || '').toLowerCase() === 'agent')
  448 |   const orgMemberIds = new Set([orgOwnerId, ...orgAgents.map((u) => String(u.id))])
  449 | 
  450 |   const orgProducts = (Array.isArray(products) ? products : [])
  451 |     .filter((p) => String(p.company_id || '') === orgOwnerId)
  452 |   const productById = new Map(orgProducts.map((p) => [String(p.id), p]))
  453 | 
  454 |   const orgViews = (Array.isArray(productViews) ? productViews : [])
  455 |     .filter((v) => productById.has(String(v.product_id)))
  456 | 
  457 |   if (plan !== 'premium') {
  458 |     const profileEvents = (Array.isArray(events) ? events : [])
  459 |       .filter((e) => String(e.type || '') === 'profile_view' && String(e.entity_id || '') === orgOwnerId)
  460 |     return {
  461 |       limited: true,
  462 |       totals: {
  463 |         profile_visits: profileEvents.length,
  464 |         product_views: orgViews.length,
  465 |       },
  466 |       top_products: [],
  467 |       profile_visits_by_country: [],
  468 |     }
  469 |   }
  470 | 
  471 |   const viewsByProduct = orgViews.reduce((acc, v) => {
  472 |     const pid = String(v.product_id || '')
  473 |     if (!pid) return acc
  474 |     acc[pid] = (acc[pid] || 0) + 1
  475 |     return acc
  476 |   }, {})
  477 | 
  478 |   const topProducts = Object.entries(viewsByProduct)
  479 |     .sort((a, b) => b[1] - a[1])
  480 |     .slice(0, 5)
  481 |     .map(([productId, views]) => ({
  482 |       product_id: productId,
  483 |       title: productById.get(productId)?.title || 'Product',
  484 |       views,
  485 |     }))
  486 | 
  487 |   const profileEvents = (Array.isArray(events) ? events : [])
  488 |     .filter((e) => String(e.type || '') === 'profile_view' && String(e.entity_id || '') === orgOwnerId)
  489 | 
  490 |   const profileVisitsByCountry = profileEvents.reduce((acc, e) => {
  491 |     const country = String(e?.metadata?.country || 'Unknown')
  492 |     acc[country] = (acc[country] || 0) + 1
  493 |     return acc
  494 |   }, {})
  495 | 
  496 |   const profileVisitsByCountryList = Object.entries(profileVisitsByCountry)
  497 |     .sort((a, b) => b[1] - a[1])
  498 |     .map(([country, count]) => ({ country, count }))
  499 | 
  500 |   const orgMessages = (Array.isArray(messages) ? messages : [])
  501 |     .filter((m) => {
  502 |       const matchId = String(m.match_id || '')
  503 |       const parts = matchId.split(':')
  504 |       if (parts.length !== 2) return false
  505 |       return String(parts[1]) === orgOwnerId
  506 |     })
  507 | 
  508 |   const inboundMessages = orgMessages.filter((m) => !orgMemberIds.has(String(m.sender_id || ''))).length
  509 |   const conversationIds = new Set(orgMessages.map((m) => m.match_id).filter(Boolean))
  510 | 
  511 |   const contractDocs = (Array.isArray(documents) ? documents : [])
  512 |     .filter((d) => d.entity_type === 'contract' || String(d.type || '').toLowerCase().includes('contract'))
  513 |     .filter((d) => String(d.factory_id || '') === orgOwnerId || String(d.buyer_id || '') === orgOwnerId)
  514 | 
  515 |   const conversionRate = calcPercent(contractDocs.length, conversationIds.size)
  516 | 
  517 |   const messagesByMatch = new Map()
  518 |   for (const m of orgMessages) {
  519 |     const matchId = String(m.match_id || '')
  520 |     if (!matchId) continue
  521 |     if (!messagesByMatch.has(matchId)) messagesByMatch.set(matchId, [])
  522 |     messagesByMatch.get(matchId).push(m)
  523 |   }
  524 | 
  525 |   const responseTimes = []
  526 |   for (const msgs of messagesByMatch.values()) {
  527 |     const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
  528 |     const firstInbound = sorted.find((m) => !orgMemberIds.has(String(m.sender_id || '')))
  529 |     if (!firstInbound?.timestamp) continue
  530 |     const inboundAt = new Date(firstInbound.timestamp).getTime()
  531 |     if (!Number.isFinite(inboundAt)) continue
  532 |     const firstOutbound = sorted.find((m) => orgMemberIds.has(String(m.sender_id || '')) && new Date(m.timestamp).getTime() >= inboundAt)
  533 |     if (!firstOutbound?.timestamp) continue
  534 |     const outboundAt = new Date(firstOutbound.timestamp).getTime()
  535 |     if (!Number.isFinite(outboundAt)) continue
  536 |     responseTimes.push((outboundAt - inboundAt) / (1000 * 60 * 60))
  537 |   }
  538 | 
  539 |   const avgResponseHours = responseTimes.length
  540 |     ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
  541 |     : 0
  542 | 
  543 |   const leadRows = (Array.isArray(leads) ? leads : []).filter((l) => String(l.org_owner_id || '') === orgOwnerId)
  544 |   const requirementById = new Map((Array.isArray(requirements) ? requirements : []).map((r) => [String(r.id), r]))
  545 |   const leadSources = new Map()
  546 |   for (const lead of leadRows) {
  547 |     const sourceType = String(lead.source_type || 'message')
  548 |     const sourceId = String(lead.source_id || '')
  549 |     const key = `${sourceType}:${sourceId || 'unknown'}`
  550 |     const existing = leadSources.get(key) || {
  551 |       source_type: sourceType,
  552 |       source_id: sourceId,
  553 |       label: String(lead.source_label || ''),
  554 |       count: 0,
  555 |     }
  556 |     existing.count += 1
  557 |     if (!existing.label && lead.source_label) existing.label = String(lead.source_label)
  558 |     leadSources.set(key, existing)
  559 |   }
  560 | 
  561 |   const topLeadSources = [...leadSources.values()]
  562 |     .map((entry) => {
  563 |       let label = entry.label
  564 |       if (!label) {
  565 |         if (entry.source_type === 'product') {
  566 |           label = productById.get(String(entry.source_id))?.title || 'Product'
  567 |         } else if (entry.source_type === 'buyer_request') {
  568 |           const req = requirementById.get(String(entry.source_id))
  569 |           label = req?.title || req?.category || 'Buyer request'
  570 |         } else if (entry.source_type === 'search') {
  571 |           label = `Search ${entry.source_id || ''}`.trim()
  572 |         } else if (entry.source_type === 'feed_post') {
  573 |           label = 'Feed post'
  574 |         } else if (entry.source_type === 'direct') {
  575 |           label = 'Direct message'
  576 |         } else {
  577 |           label = entry.source_type.replace(/_/g, ' ')
  578 |         }
  579 |       }
  580 |       return { ...entry, label }
  581 |     })
  582 |     .sort((a, b) => b.count - a.count)
  583 |     .slice(0, 5)
  584 | 
  585 |   return {
  586 |     totals: {
  587 |       profile_visits: profileEvents.length,
  588 |       product_views: orgViews.length,
  589 |       inbound_messages: inboundMessages,
  590 |       conversations: conversationIds.size,
  591 |       contracts: contractDocs.length,
  592 |       conversion_rate_pct: conversionRate,
  593 |       avg_response_hours: Math.round(avgResponseHours * 10) / 10,
  594 |       avg_response_time: formatHours(avgResponseHours),
  595 |     },
  596 |     top_products: topProducts,
  597 |     profile_visits_by_country: profileVisitsByCountryList,
  598 |     top_lead_sources: topLeadSources,
  599 |   }
  600 | }
  601 | 
  602 | export async function getPlatformAnalytics(user) {
  603 |   return getPlatformAnalyticsAdmin(user, {})
  604 | }
  605 | 
  606 | function resolvePlatformOrgScopeId(user) {
  607 |   const role = String(user?.role || '').toLowerCase()
  608 |   if (role === 'agent') return String(user?.org_owner_id || '')
  609 |   if (role === 'buyer' || role === 'factory' || role === 'buying_house') return String(user?.id || '')
  610 |   return ''
  611 | }
  612 | 
  613 | async function buildPlatformAnalyticsSnapshot(governance) {
  614 |   const [requirements, users, events] = await Promise.all([
  615 |     readJson('requirements.json'),
  616 |     readJson('users.json'),
  617 |     readJson(FILE),
  618 |   ])
  619 | 
  620 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  621 |   const retentionMs = Math.max(1, Number(governance.retention_days || 365)) * 24 * 60 * 60 * 1000
  622 |   const retentionCutoff = Date.now() - retentionMs
  623 |   const requirementsRows = (Array.isArray(requirements) ? requirements : []).filter((row) => {
  624 |     const createdAt = new Date(row?.created_at || '').getTime()
  625 |     return Number.isFinite(createdAt) && createdAt >= retentionCutoff
  626 |   })
  627 |   const eventRows = (Array.isArray(events) ? events : []).filter((row) => {
  628 |     const createdAt = new Date(row?.created_at || '').getTime()
  629 |     return Number.isFinite(createdAt) && createdAt >= retentionCutoff
  630 |   })
  631 | 
  632 |   return { usersById, requirementsRows, eventRows }
  633 | }
  634 | 
  635 | function buildRawPlatformReport(requirementsRows, eventRows, usersById) {
  636 |   const byCountry = {}
  637 |   const globalCategories = {}
  638 |   const priceBuckets = {}
  639 | 
  640 |   for (const req of requirementsRows) {
  641 |     const buyer = usersById.get(String(req.buyer_id || ''))
  642 |     const country = String(buyer?.profile?.country || 'Unknown')
  643 |     const category = String(req.category || req.product || 'Other')
  644 | 
  645 |     if (!byCountry[country]) byCountry[country] = {}
  646 |     byCountry[country][category] = (byCountry[country][category] || 0) + 1
  647 |     globalCategories[category] = (globalCategories[category] || 0) + 1
  648 | 
  649 |     const bucket = bucketNormalizedPrice(normalizedPriceForBucket(req))
  650 |     priceBuckets[bucket] = (priceBuckets[bucket] || 0) + 1
  651 |   }
  652 | 
  653 |   const topCategoriesByCountry = Object.entries(byCountry).map(([country, categories]) => ({
  654 |     country,
  655 |     categories: Object.entries(categories)
  656 |       .sort((a, b) => b[1] - a[1])
  657 |       .slice(0, 5)
  658 |       .map(([label, count]) => ({ label, count })),
  659 |   }))
  660 | 
  661 |   const topCategoriesGlobal = Object.entries(globalCategories)
  662 |     .sort((a, b) => b[1] - a[1])
  663 |     .slice(0, 8)
  664 |     .map(([label, count]) => ({ label, count }))
  665 | 
  666 |   const priceRangeDemand = Object.entries(priceBuckets)
  667 |     .sort((a, b) => b[1] - a[1])
  668 |     .map(([bucket, count]) => ({ bucket, count }))
  669 | 
  670 |   const buyerCounts = requirementsRows.reduce((acc, r) => {
  671 |     const bid = String(r.buyer_id || '')
  672 |     if (!bid) return acc
  673 |     acc[bid] = (acc[bid] || 0) + 1
  674 |     return acc
  675 |   }, {})
  676 |   const buyers = Object.keys(buyerCounts)
  677 |   const repeatBuyers = buyers.filter((bid) => buyerCounts[bid] >= 2).length
  678 |   const repeatBuyerRate = calcPercent(repeatBuyers, buyers.length)
  679 | 
  680 |   const searchEvents = eventRows.filter((e) => String(e.type || '') === 'search_run')
  681 |   const searchEventCount = searchEvents.length
  682 |   const searchByCountry = {}
  683 |   const searchGlobal = {}
  684 | 
  685 |   searchEvents.forEach((event) => {
  686 |     const meta = event?.metadata || {}
  687 |     const country = String(meta.country || 'Unknown')
  688 |     const categories = Array.isArray(meta.categories) ? meta.categories : []
  689 |     const rawCategory = String(meta.category_primary || categories[0] || meta.category || '')
  690 |     const category = rawCategory.trim() || 'Other'
  691 |     if (!searchByCountry[country]) searchByCountry[country] = {}
  692 |     searchByCountry[country][category] = (searchByCountry[country][category] || 0) + 1
  693 |     searchGlobal[category] = (searchGlobal[category] || 0) + 1
  694 |   })
  695 | 
  696 |   const topSearchCategoriesByCountry = Object.entries(searchByCountry).map(([country, categories]) => ({
  697 |     country,
  698 |     categories: Object.entries(categories)
  699 |       .sort((a, b) => b[1] - a[1])
  700 |       .slice(0, 5)
  701 |       .map(([label, count]) => ({ label, count })),
  702 |   }))
  703 | 
  704 |   const topSearchCategoriesGlobal = Object.entries(searchGlobal)
  705 |     .sort((a, b) => b[1] - a[1])
  706 |     .slice(0, 8)
  707 |     .map(([label, count]) => ({ label, count }))
  708 | 
  709 |   const now = Date.now()
  710 |   const last30 = now - 30 * 24 * 60 * 60 * 1000
  711 |   const prev30 = now - 60 * 24 * 60 * 60 * 1000
  712 |   const trendBuckets = { current: {}, previous: {} }
  713 |   searchEvents.forEach((event) => {
  714 |     const ts = new Date(event.created_at || '').getTime()
  715 |     const meta = event?.metadata || {}
  716 |     const categories = Array.isArray(meta.categories) ? meta.categories : []
  717 |     const rawCategory = String(meta.category_primary || categories[0] || meta.category || '')
  718 |     const category = rawCategory.trim() || 'Other'
  719 |     if (!Number.isFinite(ts)) return
  720 |     if (ts >= last30) trendBuckets.current[category] = (trendBuckets.current[category] || 0) + 1
  721 |     else if (ts >= prev30) trendBuckets.previous[category] = (trendBuckets.previous[category] || 0) + 1
  722 |   })
  723 | 
  724 |   const trendingCategories = Object.keys(trendBuckets.current).map((cat) => {
  725 |     const current = trendBuckets.current[cat] || 0
  726 |     const previous = trendBuckets.previous[cat] || 0
  727 |     return { label: cat, delta: current - previous, current, previous }
  728 |   }).sort((a, b) => b.delta - a.delta).slice(0, 6)
  729 | 
  730 |   // --- Monthly demand series by category and by top products ---
  731 |   const monthly_demand_by_category = topCategoriesGlobal.map((c) => {
  732 |     const label = String(c.label || 'Other')
  733 |     const rows = (requirementsRows || []).filter((r) => String(r.category || r.product || 'Other') === label)
  734 |     return { label, series: toMonthlySeries(rows, 'created_at') }
  735 |   })
  736 | 
  737 |   const productCounts = (requirementsRows || []).reduce((acc, r) => {
  738 |     const p = String(r.product || r.product_name || r.product_id || '').trim()
  739 |     if (!p) return acc
  740 |     acc[p] = (acc[p] || 0) + 1
  741 |     return acc
  742 |   }, {})
  743 | 
  744 |   const topProductsGlobal = Object.entries(productCounts)
  745 |     .sort((a, b) => b[1] - a[1])
  746 |     .slice(0, 8)
  747 |     .map(([label, count]) => ({ label, count }))
  748 | 
  749 |   const monthly_demand_by_product = topProductsGlobal.map((p) => {
  750 |     const label = String(p.label || 'unknown')
  751 |     const rows = (requirementsRows || []).filter((r) => String(r.product || r.product_name || r.product_id || '') === label)
  752 |     return { label, series: toMonthlySeries(rows, 'created_at') }
  753 |   })
  754 | 
  755 |   return {
  756 |     totals: {
  757 |       buyer_requests: requirementsRows.length,
  758 |       repeat_buyer_rate: repeatBuyerRate,
  759 |     },
  760 |     search_event_count: searchEventCount,
  761 |     top_categories_by_country: topCategoriesByCountry,
  762 |     top_categories_global: topCategoriesGlobal,
  763 |     monthly_demand_trend: toMonthlySeries(requirementsRows, 'created_at'),
  764 |     monthly_demand_by_category,
  765 |     monthly_demand_by_product,
  766 |     price_range_demand: priceRangeDemand,
  767 |     top_search_categories_by_country: topSearchCategoriesByCountry,
  768 |     top_search_categories_global: topSearchCategoriesGlobal,
  769 |     trending_search_categories: trendingCategories,
  770 |   }
  771 | }
  772 | 
  773 | function toGovernedResponse(report, { scopeLevel, suppression, privacyThresholdApplied }) {
  774 |   return {
  775 |     ...report,
  776 |     scope_level: scopeLevel,
  777 |     suppressed_fields: Object.keys(suppression || {}).filter((key) => {
  778 |       if (key === 'noise_injected') return Boolean(suppression[key])
  779 |       return Number(suppression[key] || 0) > 0
  780 |     }),
  781 |     privacy_threshold_applied: Boolean(privacyThresholdApplied),
  782 |   }
  783 | }
  784 | 
  785 | export async function getPlatformAnalyticsSummary(user) {
  786 |   ensureAnalyticsAccess(user)
  787 |   const governance = await getAnalyticsGovernanceConfig()
  788 |   const viewPolicy = checkAnalyticsAccessPolicy(user, governance, { mode: 'view' })
  789 |   if (!viewPolicy.allowed) throw forbiddenError('Analytics governance policy denied this request')
  790 | 
  791 |   const { usersById, requirementsRows, eventRows } = await buildPlatformAnalyticsSnapshot(governance)
  792 |   const minEvents = await getSearchMinEvents()
  793 |   const rawReport = buildRawPlatformReport(requirementsRows, eventRows, usersById)
  794 |   rawReport.search_min_events = minEvents
  795 |   rawReport.search_data_ready = rawReport.search_event_count >= minEvents
  796 |   rawReport.search_data_source = rawReport.search_data_ready ? 'search_events' : 'proxy_requests'
  797 |   rawReport.top_categories_by_country = []
  798 |   rawReport.top_search_categories_by_country = []
  799 | 
  800 |   const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)
  801 |   const response = toGovernedResponse(report, {
  802 |     scopeLevel: 'platform_summary_aggregated',
  803 |     suppression,
  804 |     privacyThresholdApplied: governance.enabled,
  805 |   })
  806 | 
  807 |   appendAuditLog({
  808 |     id: crypto.randomUUID(),
  809 |     at: new Date().toISOString(),
  810 |     actor_id: user?.id || null,
  811 |     actor_role: user?.role || null,
  812 |     action: 'platform_analytics_summary_requested',
  813 |     path: '/analytics/platform/summary',
  814 |     status: 200,
  815 |     payload: { scope_level: response.scope_level, suppression_counts: suppression },
  816 |   }).catch(() => null)
  817 | 
  818 |   return response
  819 | }
  820 | 
  821 | export async function getPlatformOverview(user) {
  822 |   // Lightweight anonymized overview for all authenticated roles.
  823 |   const governance = await getAnalyticsGovernanceConfig()
  824 |   const { usersById, requirementsRows, eventRows } = await buildPlatformAnalyticsSnapshot(governance)
  825 |   const rawReport = buildRawPlatformReport(requirementsRows, eventRows, usersById)
  826 | 
  827 |   const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)
  828 |   const response = toGovernedResponse(report, {
  829 |     scopeLevel: 'platform_overview_aggregated',
  830 |     suppression,
  831 |     privacyThresholdApplied: governance.enabled,
  832 |   })
  833 | 
  834 |   appendAuditLog({
  835 |     id: crypto.randomUUID(),
  836 |     at: new Date().toISOString(),
  837 |     actor_id: user?.id || null,
  838 |     actor_role: user?.role || null,
  839 |     action: 'platform_analytics_overview_requested',
  840 |     path: '/analytics/platform/overview',
  841 |     status: 200,
  842 |     payload: { scope_level: response.scope_level, suppression_counts: suppression },
  843 |   }).catch(() => null)
  844 | 
  845 |   return response
  846 | }
  847 | 
  848 | export async function getPlatformTrends(user, options = {}) {
  849 |   // Role-scoped trends; non-admins get org-scoped anonymized trends only.
  850 |   const governance = await getAnalyticsGovernanceConfig()
  851 |   const role = String(user?.role || '').toLowerCase()
  852 |   const isAdmin = role === 'admin' || role === 'owner'
  853 | 
  854 |   const orgScopeId = resolvePlatformOrgScopeId(user)
  855 |   if (!isAdmin && !orgScopeId) {
  856 |     // only admins/owners may request global trends
  857 |     const err = new Error('Forbidden: trends require org scope or admin role')
  858 |     err.status = 403
  859 |     throw err
  860 |   }
  861 | 
  862 |   assertNoUnauthorizedAnalyticsJoin(options.dimensions || [])
  863 |   const { usersById, requirementsRows, eventRows } = await buildPlatformAnalyticsSnapshot(governance)
  864 | 
  865 |   const scopedRequirements = orgScopeId
  866 |     ? requirementsRows.filter((row) => String(row?.buyer_id || '') === orgScopeId || String(row?.assigned_agent_id || row?.agent_id || '') === orgScopeId)
  867 |     : requirementsRows
  868 | 
  869 |   const scopedEvents = orgScopeId
  870 |     ? eventRows.filter((row) => String(row?.actor_id || '') === orgScopeId || String(row?.entity_id || '') === orgScopeId)
  871 |     : eventRows
  872 | 
  873 |   const rawReport = buildRawPlatformReport(scopedRequirements, scopedEvents, usersById)
  874 |   rawReport.org_scope = orgScopeId ? `org:${orgScopeId.slice(0, 6)}***` : 'org:global'
  875 | 
  876 |   const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)
  877 |   const response = toGovernedResponse(report, {
  878 |     scopeLevel: orgScopeId ? 'platform_trends_org_anonymized' : 'platform_trends_global_anonymized',
  879 |     suppression,
  880 |     privacyThresholdApplied: governance.enabled,
  881 |   })
  882 | 
  883 |   appendAuditLog({
  884 |     id: crypto.randomUUID(),
  885 |     at: new Date().toISOString(),
  886 |     actor_id: user?.id || null,
  887 |     actor_role: user?.role || null,
  888 |     action: 'platform_analytics_trends_requested',
  889 |     path: '/analytics/platform/trends',
  890 |     status: 200,
  891 |     payload: { scope_level: response.scope_level, requested_dimensions: options.dimensions || [], org_scope: rawReport.org_scope, suppression_counts: suppression },
  892 |   }).catch(() => null)
  893 | 
  894 |   return response
  895 | }
  896 | 
  897 | export async function getPlatformAnalyticsSegment(user, options = {}) {
  898 |   ensureAnalyticsAccess(user)
  899 |   const governance = await getAnalyticsGovernanceConfig()
  900 |   const viewPolicy = checkAnalyticsAccessPolicy(user, governance, { mode: 'view' })
  901 |   if (!viewPolicy.allowed) throw forbiddenError('Analytics governance policy denied this request')
  902 | 
  903 |   assertNoUnauthorizedAnalyticsJoin(options.dimensions || [])
  904 |   const orgScopeId = resolvePlatformOrgScopeId(user)
  905 |   const { usersById, requirementsRows, eventRows } = await buildPlatformAnalyticsSnapshot(governance)
  906 |   const scopedRequirements = requirementsRows.filter((row) => {
  907 |     if (!orgScopeId) return false
  908 |     const buyerId = String(row?.buyer_id || '')
  909 |     const assignedAgent = String(row?.assigned_agent_id || row?.agent_id || '')
  910 |     return buyerId === orgScopeId || assignedAgent === orgScopeId
  911 |   })
  912 |   const scopedEvents = eventRows.filter((row) => {
  913 |     if (!orgScopeId) return false
  914 |     return String(row?.actor_id || '') === orgScopeId || String(row?.entity_id || '') === orgScopeId
  915 |   })
  916 | 
  917 |   const minEvents = await getSearchMinEvents()
  918 |   const rawReport = buildRawPlatformReport(scopedRequirements, scopedEvents, usersById)
  919 |   rawReport.search_min_events = minEvents
  920 |   rawReport.search_data_ready = rawReport.search_event_count >= minEvents
  921 |   rawReport.search_data_source = rawReport.search_data_ready ? 'search_events' : 'proxy_requests'
  922 |   rawReport.org_scope = orgScopeId ? `org:${orgScopeId.slice(0, 6)}***` : 'org:unknown'
  923 | 
  924 |   const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)
  925 |   const response = toGovernedResponse(report, {
  926 |     scopeLevel: 'platform_segment_org_anonymized',
  927 |     suppression,
  928 |     privacyThresholdApplied: governance.enabled,
  929 |   })
  930 | 
  931 |   appendAuditLog({
  932 |     id: crypto.randomUUID(),
  933 |     at: new Date().toISOString(),
  934 |     actor_id: user?.id || null,
  935 |     actor_role: user?.role || null,
  936 |     action: 'platform_analytics_segment_requested',
  937 |     path: '/analytics/platform/segment',
  938 |     status: 200,
  939 |     payload: {
  940 |       scope_level: response.scope_level,
  941 |       requested_dimensions: options.dimensions || [],
  942 |       org_scope: rawReport.org_scope,
  943 |       suppression_counts: suppression,
  944 |     },
  945 |   }).catch(() => null)
  946 | 
  947 |   return response
  948 | }
  949 | 
  950 | export async function getPlatformAnalyticsAdmin(user, options = {}) {
  951 |   ensureAnalyticsAdminAccess(user)
  952 | 
  953 |   const governance = await getAnalyticsGovernanceConfig()
  954 |   const viewPolicy = checkAnalyticsAccessPolicy(user, governance, { mode: 'view' })
  955 |   if (!viewPolicy.allowed) throw forbiddenError('Analytics governance policy denied this request')
  956 | 
  957 |   const { usersById, requirementsRows, eventRows } = await buildPlatformAnalyticsSnapshot(governance)
  958 |   const rawReport = buildRawPlatformReport(requirementsRows, eventRows, usersById)
  959 |   const minEvents = await getSearchMinEvents()
  960 |   rawReport.search_min_events = minEvents
  961 |   rawReport.search_data_ready = rawReport.search_event_count >= minEvents
  962 |   rawReport.search_data_source = rawReport.search_data_ready ? 'search_events' : 'proxy_requests'
  963 |   if (!rawReport.search_data_ready) {
  964 |     rawReport.top_search_categories_by_country = rawReport.top_categories_by_country
  965 |     rawReport.top_search_categories_global = rawReport.top_categories_global
  966 |   }
  967 | 
  968 |   const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)
  969 |   const response = toGovernedResponse(report, {
  970 |     scopeLevel: 'platform_admin_full_detail',
  971 |     suppression,
  972 |     privacyThresholdApplied: governance.enabled,
  973 |   })
  974 | 
  975 |   appendAuditLog({
  976 |     id: crypto.randomUUID(),
  977 |     at: new Date().toISOString(),
  978 |     actor_id: user?.id || null,
  979 |     actor_role: user?.role || null,
  980 |     action: options.export ? 'platform_analytics_export_requested' : 'platform_analytics_admin_requested',
  981 |     path: '/analytics/platform/admin',
  982 |     status: 200,
  983 |     payload: {
  984 |       requested_scope: 'platform_admin',
  985 |       export_requested: Boolean(options.export),
  986 |       governance_mode: viewPolicy.mode,
  987 |       governance_retention_days: governance.retention_days,
  988 |       governance_geo_granularity: governance.geo_granularity,
  989 |       governance_min_cohort_size: governance.min_cohort_size,
  990 |       suppression_counts: suppression,
  991 |     },
  992 |   }).catch(() => null)
  993 | 
  994 |   return response
  995 | }
  996 | 
  997 | export async function getPremiumInsights(user) {
  998 |   const plan = await getPlanForUser(user)
  999 |   if (plan !== 'premium') throw forbiddenError('Premium plan required')
 1000 | 
 1001 |   const role = String(user?.role || '').toLowerCase()
 1002 |   const [requirements, matches, messages, documents, users, leads, products, productViews] = await Promise.all([
 1003 |     readJson('requirements.json'),
 1004 |     readJson('matches.json'),
 1005 |     readJson('messages.json'),
 1006 |     readJson('documents.json'),
 1007 |     readJson('users.json'),
 1008 |     readJson('leads.json'),
 1009 |     readJson('company_products.json'),
 1010 |     readJson('product_views.json'),
 1011 |   ])
 1012 | 
 1013 |   const docs = Array.isArray(documents) ? documents : []
 1014 |   const contracts = docs.filter((d) => d.entity_type === 'contract' || String(d.type || '').toLowerCase().includes('contract'))
 1015 | 
 1016 |   if (role === 'buyer') {
 1017 |     const myRequests = Array.isArray(requirements) ? requirements.filter((r) => String(r.buyer_id || '') === String(user.id)) : []
 1018 |     const myReqIds = new Set(myRequests.map((r) => String(r.id || '')))
 1019 |     const myMatches = Array.isArray(matches) ? matches.filter((m) => myReqIds.has(String(m.requirement_id || ''))) : []
 1020 |     const matchedReqIds = new Set(myMatches.map((m) => String(m.requirement_id || '')))
 1021 |     const myContracts = contracts.filter((c) => String(c.buyer_id || '') === String(user.id))
 1022 | 
 1023 |     const relatedMessages = Array.isArray(messages)
 1024 |       ? messages.filter((m) => {
 1025 |         const match = parseMatchId(m.match_id || '')
 1026 |         return match && myReqIds.has(String(match.requirementId))
 1027 |       })
 1028 |       : []
 1029 | 
 1030 |     const response = computeResponseTimesForOrg(relatedMessages, new Set([String(user.id)]))
 1031 | 
 1032 |     const categoryCounts = myRequests.reduce((acc, r) => {
 1033 |       const key = String(r.category || r.product || 'Other')
 1034 |       acc[key] = (acc[key] || 0) + 1
 1035 |       return acc
 1036 |     }, {})
 1037 | 
 1038 |     const priceBuckets = myRequests.reduce((acc, r) => {
 1039 |       const bucket = bucketNormalizedPrice(normalizedPriceForBucket(r))
 1040 |       acc[bucket] = (acc[bucket] || 0) + 1
 1041 |       return acc
 1042 |     }, {})
 1043 | 
 1044 |     const avgQty = (() => {
 1045 |       const nums = myRequests.map((r) => safeNumber(r.quantity)).filter((n) => Number.isFinite(n))
 1046 |       if (!nums.length) return null
 1047 |       return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
 1048 |     })()
 1049 | 
 1050 |     const buyingPatternRows = [
 1051 |       ...Object.entries(categoryCounts)
 1052 |         .sort((a, b) => b[1] - a[1])
 1053 |         .slice(0, 5)
 1054 |         .map(([label, count]) => ({ label, count })),
 1055 |       ...Object.entries(priceBuckets)
 1056 |         .map(([bucket, count]) => ({ label: `Price ${bucket}`, count })),
 1057 |       ...(avgQty !== null ? [{ label: 'Avg order qty', count: avgQty }] : []),
 1058 |     ]
 1059 | 
 1060 |     const signedContracts = myContracts.filter((c) => String(c.lifecycle_status || '').toLowerCase() === 'signed').length
 1061 |     const certification = await getOrderCertificationSummary(user.id)
 1062 |     const smartMatchSuccessRate = calcPercent(signedContracts, matchedReqIds.size || 0)
 1063 | 
 1064 |     return {
 1065 |       role,
 1066 |       request_performance: {
 1067 |         total_requests: myRequests.length,
 1068 |         matched_requests: matchedReqIds.size,
 1069 |         match_rate_pct: calcPercent(matchedReqIds.size, myRequests.length),
 1070 |         avg_response_time: response.formatted,
 1071 |         contracts_signed: signedContracts,
 1072 |         conversion_rate_pct: calcPercent(signedContracts, myRequests.length),
 1073 |       },
 1074 |       smart_matching_success_rate: {
 1075 |         match_rate_pct: smartMatchSuccessRate,
 1076 |         matched_requests: matchedReqIds.size,
 1077 |         contracts_signed: signedContracts,
 1078 |       },
 1079 |       buying_pattern_analysis: buyingPatternRows,
 1080 |       order_completion_certification: {
 1081 |         status: certification?.status || 'pending',
 1082 |         signed_contracts: certification?.signed_contracts ?? signedContracts,
 1083 |         issued_at: certification?.issued_at || null,
 1084 |       },
 1085 |       request_performance_insights: {
 1086 |         open_requests: myRequests.filter((r) => String(r.status || '').toLowerCase() === 'open').length,
 1087 |         response_speed_hours: Math.round((response.avg_hours || 0) * 10) / 10,
 1088 |       },
 1089 |     }
 1090 |   }
 1091 | 
 1092 |   const orgId = role === 'agent' ? String(user.org_owner_id || '') : String(user.id || '')
 1093 |   const orgUsers = Array.isArray(users)
 1094 |     ? users.filter((u) => String(u.org_owner_id || '') === orgId || String(u.id) === orgId)
 1095 |     : []
 1096 |   const orgMemberIds = new Set(orgUsers.map((u) => String(u.id)))
 1097 | 
 1098 |   const orgMatches = Array.isArray(matches) ? matches.filter((m) => String(m.factory_id || '') === orgId) : []
 1099 |   const orgReqIds = new Set(orgMatches.map((m) => String(m.requirement_id || '')))
 1100 |   const orgRequests = Array.isArray(requirements) ? requirements.filter((r) => orgReqIds.has(String(r.id || ''))) : []
 1101 | 
 1102 |   const orgMessages = Array.isArray(messages)
 1103 |     ? messages.filter((m) => {
 1104 |       const match = parseMatchId(m.match_id || '')
 1105 |       return match && String(match.supplierId) === orgId
 1106 |     })
 1107 |     : []
 1108 | 
 1109 |   const inboundMessages = orgMessages.filter((m) => !orgMemberIds.has(String(m.sender_id || '')))
 1110 |   const buyers = new Set(orgRequests.map((r) => String(r.buyer_id || '')).filter(Boolean))
 1111 | 
 1112 |   const orgContracts = contracts.filter((c) => String(c.factory_id || '') === orgId || String(c.buyer_id || '') === orgId)
 1113 |   const signedContracts = orgContracts.filter((c) => String(c.lifecycle_status || '').toLowerCase() === 'signed').length
 1114 |   const orgCertification = await getOrderCertificationSummary(orgId)
 1115 | 
 1116 |   const response = computeResponseTimesForOrg(orgMessages, orgMemberIds)
 1117 | 
 1118 |   const orgProducts = Array.isArray(products) ? products.filter((p) => String(p.company_id || '') === orgId) : []
 1119 |   const productIds = new Set(orgProducts.map((p) => String(p.id || '')))
 1120 |   const orgViews = Array.isArray(productViews) ? productViews.filter((v) => productIds.has(String(v.product_id || ''))) : []
 1121 |   const inquiryRate = orgViews.length ? Math.round((inboundMessages.length / orgViews.length) * 100) / 100 : 0
 1122 | 
 1123 |   const leadRows = Array.isArray(leads) ? leads.filter((l) => String(l.org_owner_id || '') === orgId) : []
 1124 |   const leadByAgent = leadRows.reduce((acc, lead) => {
 1125 |     const key = String(lead.assigned_agent_id || 'unassigned')
 1126 |     acc[key] = (acc[key] || 0) + 1
 1127 |     return acc
 1128 |   }, {})
 1129 | 
 1130 |   const leadOutcomeByAgent = leadRows.reduce((acc, lead) => {
 1131 |     const key = String(lead.assigned_agent_id || 'unassigned')
 1132 |     if (!acc[key]) acc[key] = { closed: 0, confirmed: 0, converted: 0 }
 1133 |     const status = String(lead.status || '')
 1134 |     if (status === 'closed') acc[key].closed += 1
 1135 |     if (status === 'order_confirmed') acc[key].confirmed += 1
 1136 |     if (lead.conversion_at) acc[key].converted += 1
 1137 |     return acc
 1138 |   }, {})
 1139 | 
 1140 |   const agentPerformance = orgUsers
 1141 |     .filter((u) => String(u.role || '').toLowerCase() === 'agent')
 1142 |     .map((agent) => ({
 1143 |       agent_id: agent.id,
 1144 |       name: agent.name,
 1145 |       assigned_leads: leadByAgent[String(agent.id)] || 0,
 1146 |       closed_leads: leadOutcomeByAgent[String(agent.id)]?.closed || 0,
 1147 |       orders_confirmed: leadOutcomeByAgent[String(agent.id)]?.confirmed || 0,
 1148 |       conversions: leadOutcomeByAgent[String(agent.id)]?.converted || 0,
 1149 |     }))
 1150 | 
 1151 |   const categoryCounts = orgRequests.reduce((acc, r) => {
 1152 |     const key = String(r.category || r.product || 'Other')
 1153 |     acc[key] = (acc[key] || 0) + 1
 1154 |     return acc
 1155 |   }, {})
 1156 | 
 1157 |   const buyingPattern = Object.entries(categoryCounts)
 1158 |     .sort((a, b) => b[1] - a[1])
 1159 |     .slice(0, 5)
 1160 |     .map(([label, count]) => ({ label, count }))
 1161 | 
 1162 |   return {
 1163 |     role,
 1164 |     advanced_analytics: {
 1165 |       product_views: orgViews.length,
 1166 |       inbound_inquiries: inboundMessages.length,
 1167 |       inquiry_rate: inquiryRate,
 1168 |     },
 1169 |     buyer_interest_analytics: {
 1170 |       unique_buyers: buyers.size,
 1171 |       inbound_messages: inboundMessages.length,
 1172 |       matched_requests: orgReqIds.size,
 1173 |     },
 1174 |     request_performance_insights: {
 1175 |       open_requests: orgRequests.filter((r) => String(r.status || '').toLowerCase() === 'open').length,
 1176 |       response_speed: response.formatted,
 1177 |       match_rate_pct: calcPercent(orgReqIds.size, orgRequests.length),
 1178 |     },
 1179 |     buyer_communication_insights: {
 1180 |       avg_response_time: response.formatted,
 1181 |       total_messages: orgMessages.length,
 1182 |       inbound_messages: inboundMessages.length,
 1183 |     },
 1184 |     buyer_conversion_insights: {
 1185 |       contracts_signed: signedContracts,
 1186 |       conversion_rate_pct: calcPercent(signedContracts, orgMessages.length ? orgMessages.length : 1),
 1187 |     },
 1188 |     agent_performance_analytics: agentPerformance,
 1189 |     lead_distribution: leadByAgent,
 1190 |     buying_pattern_analysis: buyingPattern,
 1191 |     order_completion_certification: {
 1192 |       status: orgCertification?.status || 'pending',
 1193 |       signed_contracts: orgCertification?.signed_contracts ?? signedContracts,
 1194 |       issued_at: orgCertification?.issued_at || null,
 1195 |     },
 1196 |   }
 1197 | }
 1198 | 