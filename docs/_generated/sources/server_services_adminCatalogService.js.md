    1 | import crypto from 'crypto'
    2 | import { readJson } from '../utils/jsonStore.js'
    3 | import { readLocalJson } from '../utils/localStore.js'
    4 | import { getAdminConfig } from './adminConfigService.js'
    5 | import { readAuditLog } from '../utils/auditStore.js'
    6 | import { listExpiringVerifications } from './verificationService.js'
    7 | 
    8 | const ORG_OVERRIDE_FILE = 'org_admin_overrides.json'
    9 | const VERIFICATION_BADGE_AUDIT = 'verification_badge_audit.json'
   10 | const MATCH_QUALITY_FILE = 'match_quality.json'
   11 | const SPAM_FILTERS_FILE = 'spam_filters.json'
   12 | const SPAM_FLAGS_FILE = 'spam_flags.json'
   13 | const CONTRACT_AUDIT_FILE = 'contract_audit.json'
   14 | const CALL_ESCALATIONS_FILE = 'call_escalations.json'
   15 | const CHAT_TRANSFER_FILE = 'chat_transfer_audit.json'
   16 | const CONTENT_FLAGS_FILE = 'content_flags.json'
   17 | const SUPPORT_TICKETS_FILE = 'support_tickets.json'
   18 | const NOTIFICATION_TEMPLATES_FILE = 'notification_templates.json'
   19 | const NOTIFICATION_BATCHES_FILE = 'notification_batches.json'
   20 | const MONTHLY_TRIGGERS_FILE = 'monthly_summary_triggers.json'
   21 | const AI_RESPONSE_AUDIT_FILE = 'ai_response_audit.json'
   22 | const TRAFFIC_ANALYTICS_FILE = 'traffic_analytics.json'
   23 | const EMAIL_SEGMENTS_FILE = 'email_segments.json'
   24 | const COUPON_CAMPAIGNS_FILE = 'coupon_campaigns.json'
   25 | const PARTNER_OVERRIDES_FILE = 'partner_overrides.json'
   26 | const FEATURED_LISTINGS_FILE = 'featured_listings.json'
   27 | 
   28 | const DEFAULT_ORG_OVERRIDES = {
   29 |   staff_limits: {},
   30 |   buying_house_staff_ids: [],
   31 |   permission_matrix: {},
   32 | }
   33 | 
   34 | function toNumber(value, fallback = 0) {
   35 |   const num = Number(value)
   36 |   return Number.isFinite(num) ? num : fallback
   37 | }
   38 | 
   39 | function sortByDateDesc(rows = [], field = 'created_at') {
   40 |   return [...rows].sort((a, b) => String(b?.[field] || '').localeCompare(String(a?.[field] || '')))
   41 | }
   42 | 
   43 | function mapUserSafe(user) {
   44 |   if (!user) return null
   45 |   const safe = { ...user }
   46 |   delete safe.password_hash
   47 |   return safe
   48 | }
   49 | 
   50 | function buildDuplicateIndex(rows = [], fields = []) {
   51 |   const map = new Map()
   52 |   for (const row of rows) {
   53 |     for (const field of fields) {
   54 |       const raw = String(row?.[field] || '').trim()
   55 |       if (!raw) continue
   56 |       const key = `${field}:${raw.toLowerCase()}`
   57 |       const bucket = map.get(key) || { field, value: raw, user_ids: [] }
   58 |       bucket.user_ids.push(row.user_id || row.id)
   59 |       map.set(key, bucket)
   60 |     }
   61 |   }
   62 |   return [...map.values()].filter((entry) => entry.user_ids.length > 1)
   63 | }
   64 | 
   65 | function deriveOrgRegistry(users = [], overrides = {}, config = {}) {
   66 |   const owners = users.filter((u) => ['buyer', 'factory', 'buying_house'].includes(String(u.role || '').toLowerCase()))
   67 |   const staffByOrg = new Map()
   68 |   const agentsByOrg = new Map()
   69 | 
   70 |   users.forEach((user) => {
   71 |     const orgId = String(user.org_owner_id || '')
   72 |     if (!orgId) return
   73 |     const list = staffByOrg.get(orgId) || []
   74 |     list.push(user)
   75 |     staffByOrg.set(orgId, list)
   76 |     if (String(user.role || '').toLowerCase() === 'agent') {
   77 |       const agents = agentsByOrg.get(orgId) || []
   78 |       agents.push(user)
   79 |       agentsByOrg.set(orgId, agents)
   80 |     }
   81 |   })
   82 | 
   83 |   const freeLimit = Number(config?.plan_limits?.free?.member_limit || 10)
   84 |   const premiumLimit = Number(config?.plan_limits?.premium?.member_limit || 50)
   85 | 
   86 |   const orgs = owners.map((owner) => {
   87 |     const orgId = String(owner.id)
   88 |     const staff = staffByOrg.get(orgId) || []
   89 |     const agents = agentsByOrg.get(orgId) || []
   90 |     const overrideLimit = overrides.staff_limits?.[orgId]
   91 |     const plan = String(owner.subscription_status || '').toLowerCase() === 'premium' ? 'premium' : 'free'
   92 |     const limit = overrideLimit !== undefined ? Number(overrideLimit) : (plan === 'premium' ? premiumLimit : freeLimit)
   93 |     return {
   94 |       org_owner_id: orgId,
   95 |       org_name: owner.company || owner.name || 'Organization',
   96 |       role: owner.role,
   97 |       region: owner.region || owner.country || '',
   98 |       premium: plan === 'premium',
   99 |       verified: Boolean(owner.verified),
  100 |       staff_count: staff.length,
  101 |       agent_count: agents.length,
  102 |       staff_limit: limit,
  103 |       quotas: config?.org_quotas?.[orgId] || {},
  104 |       permission_matrix: overrides.permission_matrix?.[orgId] || {},
  105 |     }
  106 |   })
  107 | 
  108 |   const staffList = [...staffByOrg.entries()].flatMap(([orgId, staff]) => (
  109 |     staff.map((member) => ({
  110 |       org_owner_id: orgId,
  111 |       id: member.id,
  112 |       name: member.name,
  113 |       role: member.role,
  114 |       status: member.status,
  115 |       region: member.region || '',
  116 |       created_at: member.created_at,
  117 |     }))
  118 |   ))
  119 | 
  120 |   return { orgs, staff_list: staffList }
  121 | }
  122 | 
  123 | function buildFunnelStats({ users = [], requirements = [], matches = [], contracts = [] }) {
  124 |   const dealCount = contracts.filter((c) => String(c.lifecycle_status || '').toLowerCase() === 'signed').length
  125 |   return {
  126 |     signup: users.length,
  127 |     request: requirements.length,
  128 |     match: matches.length,
  129 |     deal: dealCount,
  130 |   }
  131 | }
  132 | 
  133 | function buildConversionTrend(events = []) {
  134 |   const byDay = {}
  135 |   events.forEach((event) => {
  136 |     const date = String(event.created_at || event.at || '').slice(0, 10)
  137 |     if (!date) return
  138 |     byDay[date] = (byDay[date] || 0) + 1
  139 |   })
  140 |   return Object.entries(byDay).map(([date, count]) => ({ date, count }))
  141 | }
  142 | 
  143 | function buildResponseSpeed(messages = []) {
  144 |   const responseTimes = messages
  145 |     .filter((m) => m.created_at)
  146 |     .map((m) => new Date(m.created_at).getTime())
  147 |     .filter((t) => Number.isFinite(t))
  148 |   if (!responseTimes.length) return { avg_minutes: 0, median_minutes: 0 }
  149 |   responseTimes.sort((a, b) => a - b)
  150 |   const diffs = responseTimes.slice(1).map((t, idx) => Math.max(0, t - responseTimes[idx]))
  151 |   if (!diffs.length) return { avg_minutes: 0, median_minutes: 0 }
  152 |   const avg = diffs.reduce((sum, v) => sum + v, 0) / diffs.length / 60000
  153 |   const median = diffs[Math.floor(diffs.length / 2)] / 60000
  154 |   return { avg_minutes: Math.round(avg * 10) / 10, median_minutes: Math.round(median * 10) / 10 }
  155 | }
  156 | 
  157 | function pickDate(row, fields = ['created_at', 'submitted_at', 'updated_at', 'timestamp']) {
  158 |   for (const field of fields) {
  159 |     const value = row?.[field]
  160 |     if (value) return value
  161 |   }
  162 |   return ''
  163 | }
  164 | 
  165 | function dateKey(value) {
  166 |   if (!value) return ''
  167 |   const date = new Date(value)
  168 |   if (Number.isNaN(date.getTime())) return ''
  169 |   return date.toISOString().slice(0, 10)
  170 | }
  171 | 
  172 | function buildDailySeries(rows = [], options = {}) {
  173 |   const { dateField = 'created_at', days = 14, uniqueBy } = options
  174 |   const today = new Date()
  175 |   const series = []
  176 |   const buckets = new Map()
  177 |   for (let i = days - 1; i >= 0; i -= 1) {
  178 |     const d = new Date(today)
  179 |     d.setDate(today.getDate() - i)
  180 |     const key = d.toISOString().slice(0, 10)
  181 |     series.push({ date: key, count: 0 })
  182 |     buckets.set(key, uniqueBy ? new Set() : 0)
  183 |   }
  184 | 
  185 |   rows.forEach((row) => {
  186 |     const rawDate = dateField ? row?.[dateField] : pickDate(row)
  187 |     const key = dateKey(rawDate)
  188 |     if (!key || !buckets.has(key)) return
  189 |     if (uniqueBy) {
  190 |       buckets.get(key).add(String(row?.[uniqueBy] || ''))
  191 |     } else {
  192 |       buckets.set(key, Number(buckets.get(key) || 0) + 1)
  193 |     }
  194 |   })
  195 | 
  196 |   return series.map((entry) => {
  197 |     const bucket = buckets.get(entry.date)
  198 |     const count = uniqueBy ? (bucket ? bucket.size : 0) : Number(bucket || 0)
  199 |     return { ...entry, count }
  200 |   })
  201 | }
  202 | 
  203 | function summarizeSeries(series = []) {
  204 |   const total = series.reduce((sum, row) => sum + Number(row.count || 0), 0)
  205 |   const last = series.length ? series[series.length - 1].count : 0
  206 |   return { total, last_day: last }
  207 | }
  208 | 
  209 | function normalizeDocType(doc = {}) {
  210 |   return String(doc.doc_type || doc.type || doc.category || doc.entity_type || '').toLowerCase()
  211 | }
  212 | 
  213 | function buildVerificationDocs(documents = []) {
  214 |   const verificationKeywords = ['verification', 'business', 'vat', 'ein', 'eori', 'bank', 'tax', 'registration']
  215 |   return documents
  216 |     .filter((doc) => {
  217 |       const type = normalizeDocType(doc)
  218 |       return verificationKeywords.some((key) => type.includes(key))
  219 |     })
  220 |     .map((doc) => ({
  221 |       id: doc.id,
  222 |       user_id: doc.user_id || doc.owner_id,
  223 |       type: doc.doc_type || doc.type || doc.category || 'verification',
  224 |       status: doc.status || doc.review_status || doc.moderation_status || 'pending',
  225 |       submitted_at: doc.submitted_at || doc.created_at || doc.updated_at,
  226 |       file_url: doc.file_url || doc.url || '',
  227 |     }))
  228 | }
  229 | 
  230 | function computeTrafficAnalytics(analyticsRows = [], stored = {}) {
  231 |   const summary = { clicks: 0, visits: 0 }
  232 |   const sources = new Map()
  233 |   const domains = new Map()
  234 | 
  235 |   analyticsRows.forEach((event) => {
  236 |     const name = String(event.event || event.type || event.name || '').toLowerCase()
  237 |     const isClick = name.includes('click')
  238 |     const isVisit = name.includes('visit') || name.includes('page_view') || name.includes('view')
  239 |     if (isClick) summary.clicks += 1
  240 |     if (isVisit) summary.visits += 1
  241 | 
  242 |     const source = String(event.source || event.utm_source || event.referrer || '').trim()
  243 |     if (source) {
  244 |       const existing = sources.get(source) || { source, clicks: 0, visits: 0 }
  245 |       if (isClick) existing.clicks += 1
  246 |       if (isVisit) existing.visits += 1
  247 |       sources.set(source, existing)
  248 |     }
  249 | 
  250 |     let domain = ''
  251 |     const url = event.url || event.page || event.path || ''
  252 |     if (url) {
  253 |       try {
  254 |         const parsed = new URL(url, 'http://localhost')
  255 |         domain = parsed.hostname && parsed.hostname !== 'localhost' ? parsed.hostname : ''
  256 |       } catch {
  257 |         domain = ''
  258 |       }
  259 |     }
  260 |     if (domain) {
  261 |       const existing = domains.get(domain) || { domain, clicks: 0, visits: 0 }
  262 |       if (isClick) existing.clicks += 1
  263 |       if (isVisit) existing.visits += 1
  264 |       domains.set(domain, existing)
  265 |     }
  266 |   })
  267 | 
  268 |   const storedSummary = stored?.summary || {}
  269 |   const mergedSummary = {
  270 |     clicks: (storedSummary.clicks || 0) + summary.clicks,
  271 |     visits: (storedSummary.visits || 0) + summary.visits,
  272 |   }
  273 | 
  274 |   const storedDomains = Array.isArray(stored?.domains) ? stored.domains : []
  275 |   const storedSources = Array.isArray(stored?.sources) ? stored.sources : []
  276 |   storedDomains.forEach((row) => {
  277 |     if (!row?.domain) return
  278 |     const existing = domains.get(row.domain) || { domain: row.domain, clicks: 0, visits: 0 }
  279 |     existing.clicks += row.clicks || 0
  280 |     existing.visits += row.visits || 0
  281 |     domains.set(row.domain, existing)
  282 |   })
  283 |   storedSources.forEach((row) => {
  284 |     if (!row?.source) return
  285 |     const existing = sources.get(row.source) || { source: row.source, clicks: 0, visits: 0 }
  286 |     existing.clicks += row.clicks || 0
  287 |     existing.visits += row.visits || 0
  288 |     sources.set(row.source, existing)
  289 |   })
  290 | 
  291 |   return {
  292 |     summary: mergedSummary,
  293 |     sources: [...sources.values()],
  294 |     domains: [...domains.values()],
  295 |   }
  296 | }
  297 | 
  298 | function buildMatchQuality(matches = [], messages = []) {
  299 |   const messagesByMatch = messages.reduce((acc, msg) => {
  300 |     const key = String(msg.match_id || '')
  301 |     if (!key) return acc
  302 |     acc[key] = acc[key] || []
  303 |     acc[key].push(msg)
  304 |     return acc
  305 |   }, {})
  306 | 
  307 |   return (Array.isArray(matches) ? matches : []).map((match) => {
  308 |     const matchId = String(match.id || match.match_id || '')
  309 |     const thread = messagesByMatch[matchId] || []
  310 |     const responseCount = thread.length
  311 |     const verifiedBias = (match.buyer_verified || match.factory_verified) ? 10 : 0
  312 |     const score = Math.min(100, Math.round(responseCount * 5 + verifiedBias))
  313 |     return {
  314 |       match_id: matchId,
  315 |       score,
  316 |       note: responseCount ? `Messages: ${responseCount}` : 'No activity yet',
  317 |       updated_at: new Date().toISOString(),
  318 |     }
  319 |   })
  320 | }
  321 | 
  322 | function detectSpamSignals(messages = []) {
  323 |   const keywords = ['whatsapp', 'telegram', 'wechat', 'viber', 'crypto', 'bitcoin', 'western union', 'moneygram', 'wire transfer', 'free money']
  324 |   return (Array.isArray(messages) ? messages : []).map((message) => {
  325 |     const text = String(message.message || message.content || message.text || '').toLowerCase()
  326 |     if (!text) return null
  327 |     let score = 0
  328 |     if (/(https?:\/\/|www\.)/.test(text)) score += 2
  329 |     if (keywords.some((k) => text.includes(k))) score += 2
  330 |     if (/(\d{10,})/.test(text)) score += 1
  331 |     if (text.length > 280) score += 1
  332 |     if (score < 2) return null
  333 |     return {
  334 |       id: crypto.randomUUID(),
  335 |       message_id: message.id,
  336 |       sender_id: message.sender_id,
  337 |       score,
  338 |       reason: 'auto_classifier',
  339 |       created_at: message.timestamp || message.created_at || new Date().toISOString(),
  340 |     }
  341 |   }).filter(Boolean)
  342 | }
  343 | 
  344 | export async function getAdminCatalog() {
  345 |   const [
  346 |     users,
  347 |     verification,
  348 |     subscriptions,
  349 |     requirements,
  350 |     matches,
  351 |     documents,
  352 |     companyProducts,
  353 |     paymentProofs,
  354 |     callSessions,
  355 |     messages,
  356 |     violations,
  357 |     reports,
  358 |     notifications,
  359 |     analytics,
  360 |     walletHistory,
  361 |     couponCodes,
  362 |     couponRedemptions,
  363 |     assistantKnowledge,
  364 |     leadNotes,
  365 |   ] = await Promise.all([
  366 |     readJson('users.json'),
  367 |     readJson('verification.json'),
  368 |     readJson('subscriptions.json'),
  369 |     readJson('requirements.json'),
  370 |     readJson('matches.json'),
  371 |     readJson('documents.json'),
  372 |     readJson('company_products.json'),
  373 |     readJson('payment_proofs.json'),
  374 |     readJson('call_sessions.json'),
  375 |     readJson('messages.json'),
  376 |     readJson('violations.json'),
  377 |     readJson('reports.json'),
  378 |     readJson('notifications.json'),
  379 |     readJson('analytics.json'),
  380 |     readJson('wallet_history.json'),
  381 |     readJson('coupon_codes.json'),
  382 |     readJson('coupon_redemptions.json'),
  383 |     readJson('assistant_knowledge.json'),
  384 |     readJson('lead_notes.json'),
  385 |   ])
  386 | 
  387 |   const [
  388 |     orgOverrides,
  389 |     badgeAudit,
  390 |     matchQuality,
  391 |     spamFilters,
  392 |     spamFlags,
  393 |     contractAudit,
  394 |     callEscalations,
  395 |     chatTransfers,
  396 |     contentFlags,
  397 |     supportTicketsLocal,
  398 |     notificationTemplates,
  399 |     notificationBatches,
  400 |     monthlyTriggers,
  401 |     aiResponseAudit,
  402 |     trafficAnalyticsStored,
  403 |     emailSegments,
  404 |     couponCampaigns,
  405 |     partnerOverrides,
  406 |     invoices,
  407 |     payouts,
  408 |     featuredListings,
  409 |   ] = await Promise.all([
  410 |     readLocalJson(ORG_OVERRIDE_FILE, DEFAULT_ORG_OVERRIDES),
  411 |     readLocalJson(VERIFICATION_BADGE_AUDIT, []),
  412 |     readLocalJson(MATCH_QUALITY_FILE, []),
  413 |     readLocalJson(SPAM_FILTERS_FILE, []),
  414 |     readLocalJson(SPAM_FLAGS_FILE, []),
  415 |     readLocalJson(CONTRACT_AUDIT_FILE, []),
  416 |     readLocalJson(CALL_ESCALATIONS_FILE, []),
  417 |     readLocalJson(CHAT_TRANSFER_FILE, []),
  418 |     readLocalJson(CONTENT_FLAGS_FILE, []),
  419 |     readLocalJson(SUPPORT_TICKETS_FILE, []),
  420 |     readLocalJson(NOTIFICATION_TEMPLATES_FILE, []),
  421 |     readLocalJson(NOTIFICATION_BATCHES_FILE, []),
  422 |     readLocalJson(MONTHLY_TRIGGERS_FILE, []),
  423 |     readLocalJson(AI_RESPONSE_AUDIT_FILE, []),
  424 |     readLocalJson(TRAFFIC_ANALYTICS_FILE, { summary: {}, sources: [], domains: [] }),
  425 |     readLocalJson(EMAIL_SEGMENTS_FILE, []),
  426 |     readLocalJson(COUPON_CAMPAIGNS_FILE, []),
  427 |     readLocalJson(PARTNER_OVERRIDES_FILE, []),
  428 |     readLocalJson('invoice_log.json', []),
  429 |     readLocalJson('payout_ledger.json', []),
  430 |     readLocalJson(FEATURED_LISTINGS_FILE, []),
  431 |   ])
  432 | 
  433 |   const config = await getAdminConfig()
  434 |   const auditLog = await readAuditLog()
  435 | 
  436 |   const usersRows = Array.isArray(users) ? users : []
  437 |   const verificationRows = Array.isArray(verification) ? verification : []
  438 |   const subscriptionRows = Array.isArray(subscriptions) ? subscriptions : []
  439 |   const requirementRows = Array.isArray(requirements) ? requirements : []
  440 |   const matchRows = Array.isArray(matches) ? matches : []
  441 |   const documentRows = Array.isArray(documents) ? documents : []
  442 |   const productRows = Array.isArray(companyProducts) ? companyProducts : []
  443 |   const proofRows = Array.isArray(paymentProofs) ? paymentProofs : []
  444 |   const callRows = Array.isArray(callSessions) ? callSessions : []
  445 |   const messageRows = Array.isArray(messages) ? messages : []
  446 |   const violationRows = Array.isArray(violations) ? violations : []
  447 |   const reportRows = Array.isArray(reports) ? reports : []
  448 |   const notificationRows = Array.isArray(notifications) ? notifications : []
  449 |   const analyticsRows = Array.isArray(analytics) ? analytics : []
  450 |   const walletRows = Array.isArray(walletHistory) ? walletHistory : []
  451 |   const couponRows = Array.isArray(couponCodes) ? couponCodes : []
  452 |   const couponRedemptionRows = Array.isArray(couponRedemptions) ? couponRedemptions : []
  453 |   const knowledgeRows = Array.isArray(assistantKnowledge) ? assistantKnowledge : []
  454 |   const notesRows = Array.isArray(leadNotes) ? leadNotes : []
  455 |   const supportTicketRows = await readJson(SUPPORT_TICKETS_FILE)
  456 |   const supportTickets = Array.isArray(supportTicketRows) ? supportTicketRows : []
  457 | 
  458 |   const orgRegistry = deriveOrgRegistry(usersRows, orgOverrides || DEFAULT_ORG_OVERRIDES, config || {})
  459 | 
  460 |   const expiringVerification = await listExpiringVerifications(30).catch(() => [])
  461 |   const duplicateCandidates = buildDuplicateIndex(verificationRows, [
  462 |     'business_registration',
  463 |     'vat_ein',
  464 |     'eori',
  465 |     'bank_account',
  466 |     'tax_id',
  467 |     'company_registration',
  468 |   ])
  469 | 
  470 |   const failedRenewals = subscriptionRows.filter((s) => {
  471 |     const end = new Date(s.end_date || 0).getTime()
  472 |     return Number.isFinite(end) && end < Date.now() && Boolean(s.auto_renew)
  473 |   })
  474 |   const revenueByPlan = subscriptionRows.reduce((acc, sub) => {
  475 |     const plan = String(sub.plan || 'free')
  476 |     acc[plan] = (acc[plan] || 0) + 1
  477 |     return acc
  478 |   }, {})
  479 |   const revenueSummary = Object.entries(revenueByPlan).map(([plan, count]) => ({
  480 |     plan,
  481 |     subscribers: count,
  482 |     price_usd: plan === 'premium' ? toNumber(config?.pricing?.premium_usd, 0) : toNumber(config?.pricing?.free_usd, 0),
  483 |   }))
  484 | 
  485 |   const couponCampaignList = Array.isArray(couponCampaigns) ? couponCampaigns : []
  486 |   const earlyAdopter = couponCampaignList.filter((c) => String(c.type || '').toLowerCase() === 'early_adopter')
  487 | 
  488 |   const partnerRequests = await readJson('partner_requests.json')
  489 |   const partnerRows = Array.isArray(partnerRequests) ? partnerRequests : []
  490 |   const connectedFactories = partnerRows.filter((row) => row.status === 'connected')
  491 | 
  492 |   const contractDocs = documentRows.filter((d) => String(d.entity_type || '').toLowerCase().includes('contract'))
  493 |   const verificationDocs = buildVerificationDocs(documentRows)
  494 |   const funnelStats = buildFunnelStats({ users: usersRows, requirements: requirementRows, matches: matchRows, contracts: contractDocs })
  495 |   const conversionTrend = buildConversionTrend(analyticsRows)
  496 |   const responseSpeed = buildResponseSpeed(messageRows)
  497 | 
  498 |   const loginEvents = analyticsRows.filter((event) => {
  499 |     const name = String(event.type || event.event || event.name || '').toLowerCase()
  500 |     return name.includes('login') || name.includes('auth') || name.includes('session')
  501 |   })
  502 |   const activityEvents = analyticsRows
  503 |     .filter((event) => event.actor_id || event.user_id)
  504 |     .map((event) => ({ ...event, actor_id: event.actor_id || event.user_id }))
  505 | 
  506 |   const activeUsersTrend = buildDailySeries(activityEvents, { dateField: 'created_at', uniqueBy: 'actor_id', days: 14 })
  507 |   const loginTrend = buildDailySeries(loginEvents, { dateField: 'created_at', days: 14 })
  508 |   const buyerRequestTrend = buildDailySeries(requirementRows, { dateField: undefined, days: 14 })
  509 |   const factoryProducts = productRows.filter((row) => String(row.company_role || '').toLowerCase() === 'factory')
  510 |   const factoryPerformanceTrend = buildDailySeries(factoryProducts, { dateField: 'created_at', days: 14 })
  511 | 
  512 |   const activeUsersSummary = summarizeSeries(activeUsersTrend)
  513 |   const loginSummary = summarizeSeries(loginTrend)
  514 |   const requestSummary = summarizeSeries(buyerRequestTrend)
  515 |   const factorySummary = summarizeSeries(factoryPerformanceTrend)
  516 | 
  517 |   const factoryTop = factoryProducts.reduce((acc, row) => {
  518 |     const key = String(row.company_id || row.owner_id || 'unknown')
  519 |     const current = acc[key] || { company_id: key, company_name: row.company_name || 'Factory', products: 0, last_product_at: '' }
  520 |     const created = row.created_at || row.updated_at || ''
  521 |     const last = current.last_product_at && created
  522 |       ? (String(created) > String(current.last_product_at) ? created : current.last_product_at)
  523 |       : (current.last_product_at || created)
  524 |     acc[key] = { ...current, products: current.products + 1, last_product_at: last }
  525 |     return acc
  526 |   }, {})
  527 | 
  528 |   const aiSummaries = notesRows.filter((note) => String(note.note || '').startsWith('AI Summary:') || String(note.note || '').startsWith('AI Negotiation:'))
  529 |   const matchesByBuyer = matchRows.reduce((acc, match) => {
  530 |     const buyerId = String(match.buyer_id || '')
  531 |     if (!buyerId) return acc
  532 |     acc[buyerId] = acc[buyerId] || []
  533 |     acc[buyerId].push(match)
  534 |     return acc
  535 |   }, {})
  536 |   const contractsByBuyer = contractDocs.reduce((acc, doc) => {
  537 |     const buyerId = String(doc.buyer_id || doc.owner_id || '')
  538 |     if (!buyerId) return acc
  539 |     acc[buyerId] = acc[buyerId] || []
  540 |     acc[buyerId].push(doc)
  541 |     return acc
  542 |   }, {})
  543 | 
  544 |   const featuredRows = Array.isArray(featuredListings) ? featuredListings : []
  545 |   const productById = new Map(productRows.map((row) => [String(row.id), row]))
  546 |   const requirementById = new Map(requirementRows.map((row) => [String(row.id), row]))
  547 |   const featured = featuredRows.map((row) => {
  548 |     const entityId = String(row.entity_id || row.id)
  549 |     const entityType = String(row.entity_type || '').toLowerCase()
  550 |     const product = entityType.includes('product') ? productById.get(entityId) : null
  551 |     const request = entityType.includes('request') ? requirementById.get(entityId) : null
  552 |     return {
  553 |       ...row,
  554 |       entity_id: entityId,
  555 |       entity_type: entityType || (product ? 'product' : request ? 'request' : 'unknown'),
  556 |       title: row.label || product?.title || request?.title || 'Featured item',
  557 |       status: product?.video_review_status || request?.status || 'active',
  558 |       owner_id: product?.company_id || request?.buyer_id || '',
  559 |     }
  560 |   })
  561 | 
  562 |   return {
  563 |     orgs: {
  564 |       list: orgRegistry.orgs,
  565 |       staff_list: orgRegistry.staff_list,
  566 |       staff_limits: orgOverrides?.staff_limits || {},
  567 |       buying_house_staff_ids: orgOverrides?.buying_house_staff_ids || [],
  568 |       permission_matrix: orgOverrides?.permission_matrix || {},
  569 |     },
  570 |     verification: {
  571 |       docs_queue: sortByDateDesc(verificationDocs, 'submitted_at'),
  572 |       badge_audit: sortByDateDesc(badgeAudit, 'at'),
  573 |       duplicates: duplicateCandidates,
  574 |       expiring: expiringVerification,
  575 |       fraud_flags: verificationRows.filter((row) => Boolean(row.fraud_flag)),
  576 |     },
  577 |     finance: {
  578 |       failed_renewals: failedRenewals,
  579 |       upgrade_history: sortByDateDesc(await readLocalJson('subscription_history.json', []), 'created_at'),
  580 |       invoices: invoices,
  581 |       payouts: payouts,
  582 |       revenue_summary: revenueSummary,
  583 |     },
  584 |     wallet: {
  585 |       ledger: sortByDateDesc(walletRows, 'created_at'),
  586 |       redemptions: sortByDateDesc(couponRedemptionRows, 'created_at'),
  587 |       refunds: await readLocalJson('refund_log.json', []),
  588 |     },
  589 |     coupons: {
  590 |       codes: couponRows,
  591 |       campaigns: couponCampaignList,
  592 |       early_adopter_campaigns: earlyAdopter,
  593 |     },
  594 |     partners: {
  595 |       requests: partnerRows,
  596 |       connected_factories: connectedFactories,
  597 |       overrides: partnerOverrides,
  598 |       blacklist: config?.partner_controls?.blacklist || [],
  599 |       whitelist: config?.partner_controls?.whitelist || [],
  600 |       free_tier_limit: Number(config?.plan_limits?.free?.partner_limit || 5),
  601 |     },
  602 |     requests: {
  603 |       list: requirementRows,
  604 |       matches: matchRows,
  605 |       match_quality: (Array.isArray(matchQuality) && matchQuality.length) ? matchQuality : buildMatchQuality(matchRows, messageRows),
  606 |       spam_filters: spamFilters,
  607 |       spam_flags: spamFlags,
  608 |     },
  609 |     contracts: {
  610 |       vault: contractDocs,
  611 |       audit_trail: contractAudit,
  612 |       payment_proofs: proofRows,
  613 |     },
  614 |     calls: {
  615 |       logs: callRows,
  616 |       escalations: callEscalations,
  617 |     },
  618 |     moderation: {
  619 |       violations: violationRows,
  620 |       chat_transfers: chatTransfers,
  621 |       spam_flags: spamFlags,
  622 |       auto_spam_flags: detectSpamSignals(messageRows),
  623 |     },
  624 |     content: {
  625 |       product_videos: productRows,
  626 |       documents: documentRows,
  627 |       flags: contentFlags,
  628 |     },
  629 |     support: {
  630 |       tickets: supportTickets.length ? supportTickets : supportTicketsLocal,
  631 |       reports: reportRows,
  632 |       sla_targets: config?.support?.sla_targets || {},
  633 |     },
  634 |     notifications: {
  635 |       templates: notificationTemplates,
  636 |       batches: notificationBatches,
  637 |       monthly_triggers: monthlyTriggers,
  638 |       notifications: notificationRows,
  639 |     },
  640 |     analytics: {
  641 |       platform_metrics: analyticsRows.slice(0, 50),
  642 |       buying_house: usersRows.filter((u) => String(u.role || '').toLowerCase() === 'buying_house').map((u) => ({
  643 |         ...mapUserSafe(u),
  644 |         requests: requirementRows.filter((r) => String(r.buyer_id || '') === String(u.id)).length,
  645 |         matches: (matchesByBuyer[String(u.id)] || []).length,
  646 |         deals: (contractsByBuyer[String(u.id)] || []).filter((c) => String(c.lifecycle_status || '').toLowerCase() === 'signed').length,
  647 |       })),
  648 |       funnel: funnelStats,
  649 |       agent_performance: usersRows.filter((u) => String(u.role || '').toLowerCase() === 'agent').map((u) => ({
  650 |         id: u.id,
  651 |         name: u.name,
  652 |         performance_score: u.performance_score || 0,
  653 |         assigned_requests: u.assigned_requests || 0,
  654 |       })),
  655 |       conversion_trend: conversionTrend,
  656 |       response_speed: responseSpeed,
  657 |       active_users: {
  658 |         last_14_days: activeUsersSummary.total,
  659 |         last_day: activeUsersSummary.last_day,
  660 |       },
  661 |       active_users_trend: activeUsersTrend,
  662 |       login_trend: loginTrend,
  663 |       login_summary: loginSummary,
  664 |       buyer_request_trend: buyerRequestTrend,
  665 |       buyer_request_summary: requestSummary,
  666 |       factory_performance_trend: factoryPerformanceTrend,
  667 |       factory_performance_summary: factorySummary,
  668 |       factory_top: Object.values(factoryTop).sort((a, b) => b.products - a.products).slice(0, 8),
  669 |     },
  670 |     search: {
  671 |       alerts: await readJson('search_alerts.json'),
  672 |       usage: await readJson('search_usage_counters.json'),
  673 |     },
  674 |     ai: {
  675 |       knowledge_entries: knowledgeRows,
  676 |       summary_logs: aiSummaries,
  677 |       response_audit: aiResponseAudit,
  678 |     },
  679 |     system: {
  680 |       feature_flags: config?.feature_flags || {},
  681 |       plan_limits: config?.plan_limits || {},
  682 |       pricing: config?.pricing || {},
  683 |       policies: config?.policies || {},
  684 |       integrations: config?.integrations || {},
  685 |       retention: config?.retention || {},
  686 |     },
  687 |     security: {
  688 |       admin_audit_log: auditLog.slice(-200),
  689 |       access_log: auditLog.slice(-50).map((entry) => ({
  690 |         id: entry.id || crypto.randomUUID(),
  691 |         at: entry.at,
  692 |         actor_id: entry.actor_id,
  693 |         ip: entry.ip,
  694 |         device_id: entry.device_id,
  695 |         status: entry.status,
  696 |         path: entry.path,
  697 |       })),
  698 |     },
  699 |     traffic: computeTrafficAnalytics(analyticsRows, trafficAnalyticsStored),
  700 |     emails: {
  701 |       segments: emailSegments,
  702 |     },
  703 |     featured: {
  704 |       listings: featured,
  705 |     },
  706 |   }
  707 | }
  708 | 