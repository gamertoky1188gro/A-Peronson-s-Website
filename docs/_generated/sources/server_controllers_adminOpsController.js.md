    1 | import { readJson } from '../utils/jsonStore.js'
    2 | import { readLocalJson } from '../utils/localStore.js'
    3 | import { listContracts } from '../services/documentService.js'
    4 | import { listReports } from '../services/reportService.js'
    5 | import { getAdminConfig } from '../services/adminConfigService.js'
    6 | import { listSubscriptionHistory } from '../services/subscriptionHistoryService.js'
    7 | import { listUsers } from '../services/userService.js'
    8 | 
    9 | function sortByDateDesc(rows = [], field = 'created_at') {
   10 |   return [...rows].sort((a, b) => String(b?.[field] || '').localeCompare(String(a?.[field] || '')))
   11 | }
   12 | 
   13 | function toBool(value) {
   14 |   if (typeof value === 'boolean') return value
   15 |   if (value === undefined || value === null || value === '') return undefined
   16 |   return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase())
   17 | }
   18 | 
   19 | function buildDuplicateIndex(rows = [], fields = []) {
   20 |   const map = new Map()
   21 |   for (const row of rows) {
   22 |     for (const field of fields) {
   23 |       const raw = String(row?.[field] || '').trim()
   24 |       if (!raw) continue
   25 |       const key = `${field}:${raw.toLowerCase()}`
   26 |       const bucket = map.get(key) || { field, value: raw, user_ids: [] }
   27 |       bucket.user_ids.push(row.user_id || row.id)
   28 |       map.set(key, bucket)
   29 |     }
   30 |   }
   31 |   return [...map.values()].filter((entry) => entry.user_ids.length > 1)
   32 | }
   33 | 
   34 | function normalizeRole(value) {
   35 |   return String(value || '').toLowerCase()
   36 | }
   37 | 
   38 | function getFieldValue(source, path) {
   39 |   if (!source || !path) return undefined
   40 |   return String(path)
   41 |     .split('.')
   42 |     .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source)
   43 | }
   44 | 
   45 | function toComparable(value) {
   46 |   if (value === undefined || value === null) return ''
   47 |   if (typeof value === 'boolean') return value
   48 |   if (typeof value === 'number') return value
   49 |   return String(value).toLowerCase()
   50 | }
   51 | 
   52 | function matchesFilterValue(userValue, filterValue) {
   53 |   if (filterValue === undefined || filterValue === null || filterValue === '') return true
   54 |   if (Array.isArray(filterValue)) {
   55 |     return filterValue.map(toComparable).includes(toComparable(userValue))
   56 |   }
   57 |   if (typeof filterValue === 'object') {
   58 |     const inList = filterValue.$in || filterValue.in
   59 |     if (Array.isArray(inList)) {
   60 |       return inList.map(toComparable).includes(toComparable(userValue))
   61 |     }
   62 |     if (filterValue.contains !== undefined) {
   63 |       return String(userValue || '').toLowerCase().includes(String(filterValue.contains || '').toLowerCase())
   64 |     }
   65 |     if (filterValue.eq !== undefined) {
   66 |       return toComparable(userValue) === toComparable(filterValue.eq)
   67 |     }
   68 |   }
   69 |   return toComparable(userValue) === toComparable(filterValue)
   70 | }
   71 | 
   72 | function matchesSegmentFilter(user, filter) {
   73 |   if (!filter || typeof filter !== 'object') return true
   74 |   return Object.entries(filter).every(([key, value]) => {
   75 |     if (key === 'premium') {
   76 |       const premium = String(user.subscription_status || '').toLowerCase() === 'premium'
   77 |       return matchesFilterValue(premium, value)
   78 |     }
   79 |     if (key === 'verified') {
   80 |       return matchesFilterValue(Boolean(user.verified), value)
   81 |     }
   82 |     const userValue = getFieldValue(user, key)
   83 |     return matchesFilterValue(userValue, value)
   84 |   })
   85 | }
   86 | 
   87 | function parseFilter(raw) {
   88 |   if (!raw) return {}
   89 |   if (typeof raw === 'string') {
   90 |     try {
   91 |       return JSON.parse(raw)
   92 |     } catch {
   93 |       return {}
   94 |     }
   95 |   }
   96 |   return raw
   97 | }
   98 | 
   99 | export async function listSignupsAdmin(req, res) {
  100 |   const [users, subscriptions, verifications] = await Promise.all([
  101 |     listUsers(),
  102 |     readJson('subscriptions.json'),
  103 |     readJson('verification.json'),
  104 |   ])
  105 |   const subRows = Array.isArray(subscriptions) ? subscriptions : []
  106 |   const verificationRows = Array.isArray(verifications) ? verifications : []
  107 |   const role = normalizeRole(req.query?.role)
  108 |   const status = normalizeRole(req.query?.status)
  109 |   const region = normalizeRole(req.query?.region)
  110 |   const verified = toBool(req.query?.verified)
  111 |   const premium = toBool(req.query?.premium)
  112 | 
  113 |   const rows = (Array.isArray(users) ? users : []).filter((user) => {
  114 |     if (role && normalizeRole(user.role) !== role) return false
  115 |     if (status && normalizeRole(user.status) !== status) return false
  116 |     if (region && normalizeRole(user.region || user.country) !== region) return false
  117 |     if (verified !== undefined && Boolean(user.verified) !== verified) return false
  118 |     if (premium !== undefined) {
  119 |       const isPremium = String(user.subscription_status || '').toLowerCase() === 'premium'
  120 |       if (isPremium !== premium) return false
  121 |     }
  122 |     return true
  123 |   }).map((user) => {
  124 |     const sub = subRows.find((s) => String(s.user_id) === String(user.id))
  125 |     const verification = verificationRows.find((v) => String(v.user_id) === String(user.id))
  126 |     return {
  127 |       id: user.id,
  128 |       name: user.name,
  129 |       email: user.email,
  130 |       role: user.role,
  131 |       status: user.status,
  132 |       region: user.region || user.country || '',
  133 |       verified: Boolean(user.verified),
  134 |       premium: String(user.subscription_status || '').toLowerCase() === 'premium',
  135 |       created_at: user.created_at,
  136 |       subscription: sub || null,
  137 |       verification: verification || null,
  138 |     }
  139 |   })
  140 | 
  141 |   return res.json({ items: sortByDateDesc(rows, 'created_at') })
  142 | }
  143 | 
  144 | export async function listStrikeHistoryAdmin(req, res) {
  145 |   const [violations, users] = await Promise.all([
  146 |     readJson('violations.json'),
  147 |     listUsers(),
  148 |   ])
  149 |   const vRows = Array.isArray(violations) ? violations : []
  150 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  151 |   const items = sortByDateDesc(vRows).map((row) => ({
  152 |     ...row,
  153 |     user: (() => {
  154 |       const user = usersById.get(String(row.actor_id))
  155 |       if (!user) return null
  156 |       return { id: user.id, name: user.name, email: user.email, role: user.role }
  157 |     })(),
  158 |   }))
  159 |   return res.json({ items })
  160 | }
  161 | 
  162 | export async function listFraudReviewAdmin(req, res) {
  163 |   const [verifications, documents] = await Promise.all([
  164 |     readJson('verification.json'),
  165 |     readJson('documents.json'),
  166 |   ])
  167 |   const verificationRows = Array.isArray(verifications) ? verifications : []
  168 |   const documentRows = Array.isArray(documents) ? documents : []
  169 |   const flagged = verificationRows.filter((row) => Boolean(row.fraud_flag))
  170 |   const duplicates = buildDuplicateIndex(verificationRows, [
  171 |     'business_registration',
  172 |     'vat_ein',
  173 |     'eori',
  174 |     'bank_account',
  175 |     'tax_id',
  176 |     'company_registration',
  177 |   ])
  178 |   const docsByUser = documentRows.reduce((acc, doc) => {
  179 |     const key = String(doc.user_id || doc.owner_id || '')
  180 |     if (!key) return acc
  181 |     acc[key] = acc[key] || []
  182 |     acc[key].push(doc)
  183 |     return acc
  184 |   }, {})
  185 |   const items = flagged.map((row) => ({
  186 |     ...row,
  187 |     documents: docsByUser[String(row.user_id)] || [],
  188 |   }))
  189 |   return res.json({ items, duplicates })
  190 | }
  191 | 
  192 | export async function listOrgOwnershipAdmin(req, res) {
  193 |   const [users, config] = await Promise.all([listUsers(), getAdminConfig()])
  194 |   const userRows = Array.isArray(users) ? users : []
  195 |   const owners = userRows.filter((u) => ['buyer', 'factory', 'buying_house'].includes(normalizeRole(u.role)))
  196 |   const staffByOrg = new Map()
  197 |   const agentsByOrg = new Map()
  198 | 
  199 |   userRows.forEach((user) => {
  200 |     const orgId = String(user.org_owner_id || '')
  201 |     if (!orgId) return
  202 |     const list = staffByOrg.get(orgId) || []
  203 |     list.push(user)
  204 |     staffByOrg.set(orgId, list)
  205 |     if (normalizeRole(user.role) === 'agent') {
  206 |       const agents = agentsByOrg.get(orgId) || []
  207 |       agents.push(user)
  208 |       agentsByOrg.set(orgId, agents)
  209 |     }
  210 |   })
  211 | 
  212 |   const freeLimit = Number(config?.plan_limits?.free?.member_limit || 10)
  213 |   const premiumLimit = Number(config?.plan_limits?.premium?.member_limit || 50)
  214 | 
  215 |   const orgs = owners.map((owner) => {
  216 |     const orgId = String(owner.id)
  217 |     const staff = staffByOrg.get(orgId) || []
  218 |     const agents = agentsByOrg.get(orgId) || []
  219 |     const plan = String(owner.subscription_status || '').toLowerCase() === 'premium' ? 'premium' : 'free'
  220 |     const limit = plan === 'premium' ? premiumLimit : freeLimit
  221 |     return {
  222 |       org_owner_id: orgId,
  223 |       org_name: owner.company || owner.name || 'Organization',
  224 |       role: owner.role,
  225 |       region: owner.region || owner.country || '',
  226 |       premium: plan === 'premium',
  227 |       verified: Boolean(owner.verified),
  228 |       staff_count: staff.length,
  229 |       agent_count: agents.length,
  230 |       staff_limit: limit,
  231 |     }
  232 |   })
  233 | 
  234 |   const staff_list = [...staffByOrg.entries()].flatMap(([orgId, staff]) => (
  235 |     staff.map((member) => ({
  236 |       org_owner_id: orgId,
  237 |       id: member.id,
  238 |       name: member.name,
  239 |       role: member.role,
  240 |       status: member.status,
  241 |       region: member.region || '',
  242 |       created_at: member.created_at,
  243 |     }))
  244 |   ))
  245 | 
  246 |   return res.json({ orgs, staff_list })
  247 | }
  248 | 
  249 | export async function listWalletLedgerAdmin(req, res) {
  250 |   const [history, refunds] = await Promise.all([
  251 |     readJson('wallet_history.json'),
  252 |     readLocalJson('refund_log.json', []),
  253 |   ])
  254 |   const historyRows = Array.isArray(history) ? history : []
  255 |   const refundRows = Array.isArray(refunds) ? refunds : []
  256 |   const ledger = [
  257 |     ...historyRows.map((row) => ({ ...row, entry_type: row.type || 'wallet', created_at: row.created_at || row.at })),
  258 |     ...refundRows.map((row) => ({ ...row, entry_type: 'refund', created_at: row.created_at || row.at })),
  259 |   ]
  260 |   return res.json({ items: sortByDateDesc(ledger, 'created_at') })
  261 | }
  262 | 
  263 | export async function listPartnerRequestsAdmin(req, res) {
  264 |   const requests = await readJson('partner_requests.json')
  265 |   const rows = Array.isArray(requests) ? requests : []
  266 |   return res.json({ items: sortByDateDesc(rows) })
  267 | }
  268 | 
  269 | export async function listContractsAdmin(req, res) {
  270 |   const contracts = await listContracts(req.user)
  271 |   return res.json({ items: sortByDateDesc(contracts, 'updated_at') })
  272 | }
  273 | 
  274 | export async function listDisputesAdmin(req, res) {
  275 |   const reports = await listReports()
  276 |   const disputes = reports.filter((r) => String(r.entity_type || '') === 'contract_dispute')
  277 |   return res.json({ items: sortByDateDesc(disputes) })
  278 | }
  279 | 
  280 | export async function listCallsAdmin(req, res) {
  281 |   const calls = await readJson('call_sessions.json')
  282 |   const rows = Array.isArray(calls) ? calls : []
  283 |   const items = sortByDateDesc(rows).map((call) => {
  284 |     const hasRecording = Boolean(call.recording_url) || String(call.recording_status || '').toLowerCase() === 'available'
  285 |     const proofRequired = Boolean(call.proof_required)
  286 |     return {
  287 |       ...call,
  288 |       proof_verified: proofRequired ? hasRecording : false,
  289 |       proof_evidence: hasRecording ? 'recording' : '',
  290 |     }
  291 |   })
  292 |   return res.json({ items })
  293 | }
  294 | 
  295 | export async function listPaymentProofsAdmin(req, res) {
  296 |   const proofs = await readJson('payment_proofs.json')
  297 |   const rows = Array.isArray(proofs) ? proofs : []
  298 |   const items = sortByDateDesc(rows).map((proof) => ({
  299 |     ...proof,
  300 |     evidence_present: Boolean(proof.document_url || proof.file_url || proof.attachment_url),
  301 |   }))
  302 |   return res.json({ items })
  303 | }
  304 | 
  305 | export async function listWalletHistoryAdmin(req, res) {
  306 |   const history = await readJson('wallet_history.json')
  307 |   const rows = Array.isArray(history) ? history : []
  308 |   return res.json({ items: sortByDateDesc(rows) })
  309 | }
  310 | 
  311 | export async function listSearchAlertsAdmin(req, res) {
  312 |   const alerts = await readJson('search_alerts.json')
  313 |   const rows = Array.isArray(alerts) ? alerts : []
  314 |   return res.json({ items: sortByDateDesc(rows) })
  315 | }
  316 | 
  317 | export async function listSearchUsageAdmin(req, res) {
  318 |   const usage = await readJson('search_usage_counters.json')
  319 |   const rows = Array.isArray(usage) ? usage : []
  320 |   const config = await getAdminConfig()
  321 |   const threshold = Number(config?.search_limits?.abusive_search_threshold || 120)
  322 |   const flagged = rows.map((row) => ({ ...row, abusive: Number(row.count || 0) >= threshold }))
  323 |   return res.json({ items: flagged })
  324 | }
  325 | 
  326 | export async function listMatchesAdmin(req, res) {
  327 |   const matches = await readJson('matches.json')
  328 |   const rows = Array.isArray(matches) ? matches : []
  329 |   return res.json({ items: rows })
  330 | }
  331 | 
  332 | export async function listRequirementsAdmin(req, res) {
  333 |   const requirements = await readJson('requirements.json')
  334 |   const rows = Array.isArray(requirements) ? requirements : []
  335 |   return res.json({ items: sortByDateDesc(rows) })
  336 | }
  337 | 
  338 | export async function listSubscriptionHistoryAdmin(req, res) {
  339 |   const items = await listSubscriptionHistory({})
  340 |   return res.json({ items })
  341 | }
  342 | 
  343 | export async function listInvoicesAdmin(req, res) {
  344 |   const items = await readLocalJson('invoice_log.json', [])
  345 |   return res.json({ items })
  346 | }
  347 | 
  348 | export async function listPayoutsAdmin(req, res) {
  349 |   const items = await readLocalJson('payout_ledger.json', [])
  350 |   return res.json({ items })
  351 | }
  352 | 
  353 | export async function listRefundsAdmin(req, res) {
  354 |   const items = await readLocalJson('refund_log.json', [])
  355 |   return res.json({ items })
  356 | }
  357 | 
  358 | export async function listCouponReport(req, res) {
  359 |   const [codes, redemptions, users] = await Promise.all([
  360 |     readJson('coupon_codes.json'),
  361 |     readJson('coupon_redemptions.json'),
  362 |     readJson('users.json'),
  363 |   ])
  364 |   const codeRows = Array.isArray(codes) ? codes : []
  365 |   const redemptionRows = Array.isArray(redemptions) ? redemptions : []
  366 |   const usersRows = Array.isArray(users) ? users : []
  367 |   const userById = new Map(usersRows.map((u) => [String(u.id), u]))
  368 | 
  369 |   const byCode = codeRows.map((code) => {
  370 |     const redemptionsForCode = redemptionRows.filter((r) => String(r.code_id) === String(code.id))
  371 |     const total = redemptionsForCode.reduce((sum, r) => sum + Number(r.amount_usd || 0), 0)
  372 |     const uniqueUsers = new Set(redemptionsForCode.map((r) => String(r.user_id))).size
  373 |     const roles = redemptionsForCode.reduce((acc, r) => {
  374 |       const user = userById.get(String(r.user_id))
  375 |       const role = String(user?.role || 'unknown')
  376 |       acc[role] = (acc[role] || 0) + 1
  377 |       return acc
  378 |     }, {})
  379 |     return {
  380 |       code_id: code.id,
  381 |       code: code.code,
  382 |       active: code.active,
  383 |       marketing_source: code.marketing_source || '',
  384 |       campaign: code.campaign || '',
  385 |       role_restrictions: code.role_restrictions || [],
  386 |       max_redemptions: code.max_redemptions || null,
  387 |       redemption_count: redemptionsForCode.length,
  388 |       unique_users: uniqueUsers,
  389 |       redeemed_total_usd: Math.round(total * 100) / 100,
  390 |       average_redemption_usd: redemptionsForCode.length ? Math.round((total / redemptionsForCode.length) * 100) / 100 : 0,
  391 |       redemptions_by_role: roles,
  392 |     }
  393 |   })
  394 | 
  395 |   const byCampaign = byCode.reduce((acc, row) => {
  396 |     const key = row.campaign || 'uncategorized'
  397 |     acc[key] = acc[key] || { campaign: key, redemption_count: 0, redeemed_total_usd: 0, unique_users: new Set() }
  398 |     acc[key].redemption_count += row.redemption_count
  399 |     acc[key].redeemed_total_usd = Math.round((acc[key].redeemed_total_usd + row.redeemed_total_usd) * 100) / 100
  400 |     row.unique_users && acc[key].unique_users.add(row.unique_users)
  401 |     return acc
  402 |   }, {})
  403 | 
  404 |   return res.json({
  405 |     codes: byCode,
  406 |     campaigns: Object.values(byCampaign).map((row) => ({
  407 |       campaign: row.campaign,
  408 |       redemption_count: row.redemption_count,
  409 |       redeemed_total_usd: row.redeemed_total_usd,
  410 |       unique_users: row.unique_users instanceof Set ? row.unique_users.size : row.unique_users || 0,
  411 |     })),
  412 |   })
  413 | }
  414 | 
  415 | export async function listAiAuditLogs(req, res) {
  416 |   const notes = await readJson('lead_notes.json')
  417 |   const rows = Array.isArray(notes) ? notes : []
  418 |   const aiNotes = rows.filter((row) => String(row.note || '').startsWith('AI Summary:') || String(row.note || '').startsWith('AI Negotiation:'))
  419 |   return res.json({ items: sortByDateDesc(aiNotes) })
  420 | }
  421 | 
  422 | function toCsv(rows = []) {
  423 |   if (!rows.length) return 'email'
  424 |   const header = 'email'
  425 |   const lines = rows.map((row) => `"${String(row || '').replace(/"/g, '""')}"`)
  426 |   return [header, ...lines].join('\n')
  427 | }
  428 | 
  429 | export async function exportEmailSegmentAdmin(req, res) {
  430 |   const segmentId = String(req.query?.segment_id || '').trim()
  431 |   if (!segmentId) return res.status(400).json({ error: 'segment_id is required' })
  432 | 
  433 |   const [segments, users] = await Promise.all([
  434 |     readLocalJson('email_segments.json', []),
  435 |     listUsers(),
  436 |   ])
  437 | 
  438 |   const rows = Array.isArray(segments) ? segments : []
  439 |   const segment = rows.find((row) => String(row.id) === segmentId)
  440 |   if (!segment) return res.status(404).json({ error: 'segment not found' })
  441 | 
  442 |   const filter = parseFilter(segment.filter)
  443 |   const matches = (Array.isArray(users) ? users : []).filter((user) => matchesSegmentFilter(user, filter))
  444 |   const emails = [...new Set(matches.map((u) => u.email).filter(Boolean))]
  445 |   const csv = toCsv(emails)
  446 |   res.setHeader('Content-Type', 'text/csv')
  447 |   res.setHeader('Content-Disposition', `attachment; filename="segment_${segmentId}.csv"`)
  448 |   return res.send(csv)
  449 | }
  450 | 