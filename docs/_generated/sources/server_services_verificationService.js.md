    1 | import { readJson, writeJson } from '../utils/jsonStore.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | import { logInfo } from '../utils/logger.js'
    4 | import { isEuCountry } from '../../shared/config/geo.js'
    5 | 
    6 | const FILE = 'verification.json'
    7 | 
    8 | const BUYER_REGIONS = {
    9 |   EU: 'EU',
   10 |   USA: 'USA',
   11 |   OTHER: 'OTHER',
   12 | }
   13 | 
   14 | const requiredByRoleRegion = {
   15 |   factory: ['company_registration', 'trade_license', 'tin', 'authorized_person_nid', 'bank_proof', 'erc'],
   16 |   buying_house: ['company_registration', 'trade_license', 'tin', 'authorized_person_nid', 'bank_proof'],
   17 |   buyer: {
   18 |     EU: ['company_registration', 'vat', 'eori', 'bank_proof'],
   19 |     USA: ['company_registration', 'ein', 'ior', 'bank_proof'],
   20 |     OTHER: ['company_registration', 'bank_proof'],
   21 |   },
   22 | }
   23 | 
   24 | const fieldAliases = {
   25 |   tin: ['tin', 'tin_or_ein'],
   26 |   ein: ['ein', 'tin_or_ein'],
   27 |   erc: ['erc', 'erc_or_eori'],
   28 |   eori: ['eori', 'erc_or_eori'],
   29 | }
   30 | 
   31 | const REVIEW_STATUSES = new Set(['pending', 'approved', 'rejected', 'incomplete', 'expired'])
   32 | const DUPLICATE_FIELDS = ['company_registration', 'vat', 'ein', 'eori', 'bank_proof', 'erc', 'tin', 'trade_license']
   33 | 
   34 | export const VERIFICATION_FIELD_LABELS = {
   35 |   company_registration: 'Company Registration',
   36 |   trade_license: 'Trade License',
   37 |   tin: 'TIN (Tax Identification Number)',
   38 |   ein: 'EIN (Employer Identification Number)',
   39 |   vat: 'VAT Number',
   40 |   eori: 'EORI (Customs Registration)',
   41 |   ior: 'IOR (Importer of Record)',
   42 |   authorized_person_nid: 'Authorized Person NID',
   43 |   bank_proof: 'Company Bank Proof',
   44 |   erc: 'ERC (Export Registration)',
   45 | }
   46 | 
   47 | function normalizeReviewStatus(value, fallback = 'pending') {
   48 |   const status = sanitizeString(String(value || ''), 20).toLowerCase()
   49 |   return REVIEW_STATUSES.has(status) ? status : fallback
   50 | }
   51 | 
   52 | function emptyDocs() {
   53 |   return {
   54 |     company_registration: '',
   55 |     trade_license: '',
   56 |     tin: '',
   57 |     ein: '',
   58 |     vat: '',
   59 |     eori: '',
   60 |     ior: '',
   61 |     authorized_person_nid: '',
   62 |     bank_proof: '',
   63 |     erc: '',
   64 |     tin_or_ein: '',
   65 |     erc_or_eori: '',
   66 |     buyer_country: '',
   67 |     optional_licenses: [],
   68 |   }
   69 | }
   70 | 
   71 | function sanitizeDocsPatch(documentsPatch = {}) {
   72 |   const entries = Object.entries(documentsPatch)
   73 |   const out = {}
   74 | 
   75 |   for (const [key, value] of entries) {
   76 |     if (key === 'optional_licenses') {
   77 |       const values = Array.isArray(value) ? value : [value]
   78 |       out.optional_licenses = values
   79 |         .map((v) => sanitizeString(String(v || ''), 240))
   80 |         .filter(Boolean)
   81 |       continue
   82 |     }
   83 | 
   84 |     out[key] = sanitizeString(String(value || ''), 240)
   85 |   }
   86 | 
   87 |   return out
   88 | }
   89 | 
   90 | function normalizeBuyerCountry(rawCountry) {
   91 |   return sanitizeString(String(rawCountry || ''), 60)
   92 | }
   93 | 
   94 | function validateBuyerGeography(role, docs, buyerRegion) {
   95 |   if (role !== 'buyer') return
   96 | 
   97 |   const buyerCountry = normalizeBuyerCountry(docs?.buyer_country)
   98 |   const countryIsEu = isEuCountry(buyerCountry)
   99 | 
  100 |   if (countryIsEu && buyerRegion !== BUYER_REGIONS.EU) {
  101 |     const err = new Error('Selected buyer country is in the EU. Set buyer_region to EU.')
  102 |     err.statusCode = 400
  103 |     throw err
  104 |   }
  105 | 
  106 |   if (buyerRegion === BUYER_REGIONS.EU && !countryIsEu) {
  107 |     const err = new Error('buyer_region=EU requires selecting a valid EU country in buyer_country.')
  108 |     err.statusCode = 400
  109 |     throw err
  110 |   }
  111 | }
  112 | 
  113 | function normalizeBuyerRegion(rawRegion) {
  114 |   const region = sanitizeString(String(rawRegion || ''), 20).toUpperCase()
  115 |   return BUYER_REGIONS[region] || BUYER_REGIONS.OTHER
  116 | }
  117 | 
  118 | function getRequiredFields(role, buyerRegion) {
  119 |   if (role !== 'buyer') return requiredByRoleRegion[role] || []
  120 |   return requiredByRoleRegion.buyer[buyerRegion] || requiredByRoleRegion.buyer.OTHER
  121 | }
  122 | 
  123 | function hasDocument(docs, field) {
  124 |   const possibleFields = fieldAliases[field] || [field]
  125 |   return possibleFields.some((name) => !!docs?.[name])
  126 | }
  127 | 
  128 | function normalizeDocValue(value) {
  129 |   return sanitizeString(String(value || ''), 240).toLowerCase()
  130 | }
  131 | 
  132 | function buildCredibility(required, docs) {
  133 |   const completedRequired = required.filter((field) => hasDocument(docs, field)).length
  134 |   const requiredTotal = required.length
  135 |   const optionalLicenses = Array.isArray(docs?.optional_licenses) ? docs.optional_licenses.filter(Boolean) : []
  136 |   const requiredCompletionPct = requiredTotal > 0 ? (completedRequired / requiredTotal) * 100 : 100
  137 | 
  138 |   const requiredScore = requiredCompletionPct * 0.85
  139 |   const optionalScore = Math.min(optionalLicenses.length, 5) * 3
  140 |   const score = Math.min(100, Math.round(requiredScore + optionalScore))
  141 | 
  142 |   let badge = 'Basic credibility'
  143 |   if (score >= 90) badge = 'High credibility'
  144 |   else if (score >= 70) badge = 'Strong credibility'
  145 |   else if (score >= 40) badge = 'Moderate credibility'
  146 | 
  147 |   return {
  148 |     score,
  149 |     badge,
  150 |     completeness: `${completedRequired}/${requiredTotal} required documents submitted`,
  151 |     required_completed: completedRequired,
  152 |     required_total: requiredTotal,
  153 |     optional_licenses_count: optionalLicenses.length,
  154 |   }
  155 | }
  156 | 
  157 | function hasAnyDocument(docs) {
  158 |   if (!docs) return false
  159 |   const keys = Object.keys(docs)
  160 |   return keys.some((key) => {
  161 |     if (key === 'optional_licenses') {
  162 |       return Array.isArray(docs.optional_licenses) && docs.optional_licenses.some(Boolean)
  163 |     }
  164 |     return Boolean(String(docs[key] || '').trim())
  165 |   })
  166 | }
  167 | 
  168 | function toPublicFileUrl(filePath = '') {
  169 |   if (!filePath) return ''
  170 |   const normalized = String(filePath).replace(/\\/g, '/')
  171 |   if (normalized.startsWith('/uploads/')) return normalized
  172 |   const idx = normalized.indexOf('server/uploads/')
  173 |   if (idx >= 0) return `/uploads/${normalized.slice(idx + 'server/uploads/'.length)}`
  174 |   return normalized.startsWith('uploads/') ? `/${normalized}` : normalized
  175 | }
  176 | 
  177 | export async function getVerification(userId) {
  178 |   const all = await readJson(FILE)
  179 |   return all.find((v) => v.user_id === userId) || null
  180 | }
  181 | 
  182 | function diffDaysFromNow(endDate) {
  183 |   const endTime = new Date(endDate || '').getTime()
  184 |   if (!Number.isFinite(endTime)) return 0
  185 |   const diffMs = endTime - Date.now()
  186 |   if (diffMs <= 0) return 0
  187 |   return Math.ceil(diffMs / (24 * 60 * 60 * 1000))
  188 | }
  189 | 
  190 | export async function isVerificationSubscriptionValid(userId) {
  191 |   const rec = await getVerification(userId)
  192 |   if (!rec?.subscription_valid_until) return false
  193 |   return diffDaysFromNow(rec.subscription_valid_until) > 0
  194 | }
  195 | 
  196 | export async function setVerificationSubscription(userId, endDate) {
  197 |   const all = await readJson(FILE)
  198 |   const idx = all.findIndex((v) => v.user_id === userId)
  199 |   const nextEnd = endDate || ''
  200 |   const remainingDays = diffDaysFromNow(nextEnd)
  201 |   const expiringSoon = remainingDays > 0 && remainingDays <= 7
  202 | 
  203 |   if (idx < 0) {
  204 |     all.push({
  205 |       user_id: userId,
  206 |       role: '',
  207 |       buyer_region: '',
  208 |       documents: emptyDocs(),
  209 |       verified: false,
  210 |       verified_at: '',
  211 |       subscription_valid_until: nextEnd,
  212 |       subscription_remaining_days: remainingDays,
  213 |       expiring_soon: expiringSoon,
  214 |       missing_required: [],
  215 |       credibility: buildCredibility([], emptyDocs()),
  216 |       review_status: 'pending',
  217 |       review_reason: '',
  218 |       reviewed_at: '',
  219 |       updated_at: new Date().toISOString(),
  220 |     })
  221 |   } else {
  222 |     all[idx].subscription_valid_until = nextEnd
  223 |     all[idx].subscription_remaining_days = remainingDays
  224 |     all[idx].expiring_soon = expiringSoon
  225 |     all[idx].verification_status = all[idx].verified
  226 |       ? (expiringSoon ? 'expiring_soon' : 'verified_active')
  227 |       : (remainingDays > 0 ? 'pending_review' : 'expired')
  228 |     all[idx].updated_at = new Date().toISOString()
  229 |   }
  230 | 
  231 |   await writeJson(FILE, all)
  232 |   return idx < 0 ? all[all.length - 1] : all[idx]
  233 | }
  234 | 
  235 | function addDaysFrom(baseDate, days = 30) {
  236 |   const now = Date.now()
  237 |   const base = new Date(baseDate || '').getTime()
  238 |   const start = Number.isFinite(base) && base > now ? base : now
  239 |   return new Date(start + days * 24 * 60 * 60 * 1000).toISOString()
  240 | }
  241 | 
  242 | export async function extendVerificationSubscription(userId, days = 30) {
  243 |   const rec = await getVerification(userId)
  244 |   const nextEnd = addDaysFrom(rec?.subscription_valid_until, days)
  245 |   return setVerificationSubscription(userId, nextEnd)
  246 | }
  247 | 
  248 | function normalizeCountryCode(value) {
  249 |   return sanitizeString(String(value || ''), 80).trim()
  250 | }
  251 | 
  252 | function inferBuyerRegion(user, record) {
  253 |   if (record?.buyer_region) return record.buyer_region
  254 |   const docsCountry = normalizeBuyerCountry(record?.documents?.buyer_country)
  255 |   const profileCountry = normalizeCountryCode(user?.profile?.country)
  256 |   const candidate = docsCountry || profileCountry
  257 |   const upper = candidate.toUpperCase()
  258 | 
  259 |   if (isEuCountry(candidate)) return BUYER_REGIONS.EU
  260 |   if (upper === 'USA' || upper === 'US' || upper === 'UNITED STATES' || upper === 'UNITED STATES OF AMERICA') return BUYER_REGIONS.USA
  261 |   return BUYER_REGIONS.OTHER
  262 | }
  263 | 
  264 | export function getVerificationPublicSummary(user, record) {
  265 |   const role = user?.role || record?.role || ''
  266 |   const buyerRegion = role === 'buyer' ? inferBuyerRegion(user, record) : ''
  267 |   const required = getRequiredFields(role, buyerRegion)
  268 |   const docs = record?.documents || emptyDocs()
  269 |   const credibility = record?.credibility || buildCredibility(required, docs)
  270 | 
  271 |   const required_checklist = required.map((key) => ({
  272 |     key,
  273 |     label: VERIFICATION_FIELD_LABELS[key] || key,
  274 |     submitted: hasDocument(docs, key),
  275 |   }))
  276 | 
  277 |   const optionalLicenses = Array.isArray(docs?.optional_licenses) ? docs.optional_licenses.filter(Boolean) : []
  278 | 
  279 |   return {
  280 |     verified: Boolean(record?.verified),
  281 |     buyer_region: buyerRegion,
  282 |     credibility,
  283 |     required_checklist,
  284 |     optional_licenses_count: optionalLicenses.length,
  285 |   }
  286 | }
  287 | 
  288 | export async function upsertVerification(user, documentsPatch) {
  289 |   const all = await readJson(FILE)
  290 |   const idx = all.findIndex((v) => v.user_id === user.id)
  291 |   const existing = idx >= 0 ? all[idx] : null
  292 | 
  293 |   const docs = {
  294 |     ...(existing?.documents || emptyDocs()),
  295 |     ...sanitizeDocsPatch(documentsPatch || {}),
  296 |   }
  297 | 
  298 |   const buyerRegion = user.role === 'buyer'
  299 |     ? normalizeBuyerRegion(documentsPatch?.buyer_region || existing?.buyer_region)
  300 |     : ''
  301 | 
  302 |   validateBuyerGeography(user.role, docs, buyerRegion)
  303 | 
  304 |   const required = getRequiredFields(user.role, buyerRegion)
  305 |   const missing_required = required.filter((key) => !hasDocument(docs, key))
  306 |   const credibility = buildCredibility(required, docs)
  307 | 
  308 |   const shouldKeepApproved = Boolean(existing?.verified) && missing_required.length === 0
  309 |   const nextReviewStatus = shouldKeepApproved
  310 |     ? 'approved'
  311 |     : (missing_required.length > 0 ? 'incomplete' : 'pending')
  312 | 
  313 |   const record = {
  314 |     user_id: user.id,
  315 |     role: user.role,
  316 |     buyer_region: buyerRegion,
  317 |     documents: docs,
  318 |     verified: shouldKeepApproved,
  319 |     verified_at: shouldKeepApproved ? (existing?.verified_at || '') : '',
  320 |     subscription_valid_until: existing?.subscription_valid_until || '',
  321 |     missing_required,
  322 |     credibility,
  323 |     review_status: nextReviewStatus,
  324 |     review_reason: nextReviewStatus === 'rejected' ? sanitizeString(String(existing?.review_reason || ''), 240) : '',
  325 |     reviewed_at: shouldKeepApproved ? (existing?.reviewed_at || '') : '',
  326 |     updated_at: new Date().toISOString(),
  327 |   }
  328 | 
  329 |   if (idx >= 0) all[idx] = record
  330 |   else all.push(record)
  331 | 
  332 |   await writeJson(FILE, all)
  333 |   logInfo('Verification documents updated', {
  334 |     user_id: user.id,
  335 |     buyer_region: buyerRegion,
  336 |     missing_required: missing_required.length,
  337 |     credibility_score: credibility.score,
  338 |   })
  339 |   return record
  340 | }
  341 | 
  342 | export async function adminApproveVerification(userId) {
  343 |   const all = await readJson(FILE)
  344 |   const idx = all.findIndex((v) => v.user_id === userId)
  345 |   if (idx < 0) return null
  346 | 
  347 |   const validSub = await isVerificationSubscriptionValid(userId)
  348 |   if (!validSub) {
  349 |     all[idx].verified = false
  350 |     all[idx].missing_required = [...(all[idx].missing_required || []), 'premium_subscription_required_for_verification']
  351 |     await writeJson(FILE, all)
  352 |     return all[idx]
  353 |   }
  354 | 
  355 |   if ((all[idx].missing_required || []).length > 0) {
  356 |     all[idx].verified = false
  357 |     all[idx].review_status = 'incomplete'
  358 |     all[idx].review_reason = 'missing_required_documents'
  359 |     all[idx].reviewed_at = new Date().toISOString()
  360 |     await writeJson(FILE, all)
  361 |     return all[idx]
  362 |   }
  363 | 
  364 |   all[idx].verified = true
  365 |   all[idx].verified_at = new Date().toISOString()
  366 |   all[idx].review_status = 'approved'
  367 |   all[idx].review_reason = ''
  368 |   all[idx].reviewed_at = new Date().toISOString()
  369 |   all[idx].subscription_valid_until = all[idx].subscription_valid_until || ''
  370 |   await writeJson(FILE, all)
  371 |   logInfo('Verification approved', { user_id: userId })
  372 |   return all[idx]
  373 | }
  374 | 
  375 | export async function adminRejectVerification(userId, reason = '') {
  376 |   const all = await readJson(FILE)
  377 |   const idx = all.findIndex((v) => v.user_id === userId)
  378 |   if (idx < 0) return null
  379 | 
  380 |   all[idx].verified = false
  381 |   all[idx].verified_at = ''
  382 |   all[idx].review_status = 'rejected'
  383 |   all[idx].review_reason = sanitizeString(String(reason || 'rejected_by_admin'), 240)
  384 |   all[idx].reviewed_at = new Date().toISOString()
  385 |   await writeJson(FILE, all)
  386 |   logInfo('Verification rejected', { user_id: userId, reason })
  387 |   return all[idx]
  388 | }
  389 | 
  390 | export async function revokeExpiredVerifications() {
  391 |   const all = await readJson(FILE)
  392 |   let changed = false
  393 | 
  394 |   for (const rec of all) {
  395 |     const active = rec.subscription_valid_until && new Date(rec.subscription_valid_until).getTime() > Date.now()
  396 |     const remainingDays = rec.subscription_valid_until ? Math.max(0, Math.ceil((new Date(rec.subscription_valid_until).getTime() - Date.now()) / (24 * 60 * 60 * 1000))) : 0
  397 |     const expiringSoon = rec.verified && remainingDays > 0 && remainingDays <= 7
  398 |     if (!active && rec.verified) {
  399 |       rec.verified = false
  400 |       rec.subscription_valid_until = rec.subscription_valid_until || ''
  401 |       rec.review_status = 'expired'
  402 |       rec.review_reason = 'subscription_expired'
  403 |       rec.reviewed_at = new Date().toISOString()
  404 |       changed = true
  405 |     }
  406 |     if (rec.subscription_remaining_days !== remainingDays) {
  407 |       rec.subscription_remaining_days = remainingDays
  408 |       changed = true
  409 |     }
  410 |     if (rec.expiring_soon !== expiringSoon) {
  411 |       rec.expiring_soon = expiringSoon
  412 |       changed = true
  413 |     }
  414 |     const nextStatus = rec.verified
  415 |       ? (expiringSoon ? 'expiring_soon' : 'verified_active')
  416 |       : (remainingDays > 0 ? 'pending_review' : 'expired')
  417 |     if (rec.verification_status !== nextStatus) {
  418 |       rec.verification_status = nextStatus
  419 |       changed = true
  420 |     }
  421 |   }
  422 | 
  423 |   if (changed) await writeJson(FILE, all)
  424 |   return all
  425 | }
  426 | 
  427 | export async function listVerificationQueue({ status } = {}) {
  428 |   const [all, users, documents] = await Promise.all([
  429 |     readJson(FILE),
  430 |     readJson('users.json'),
  431 |     readJson('documents.json'),
  432 |   ])
  433 | 
  434 |   const usersById = new Map(users.map((u) => [String(u.id), u]))
  435 |   const docsByUser = new Map()
  436 | 
  437 |   const verificationDocs = Array.isArray(documents)
  438 |     ? documents.filter((doc) => String(doc.entity_type || '') === 'verification')
  439 |     : []
  440 | 
  441 |   for (const doc of verificationDocs) {
  442 |     const ownerId = String(doc.entity_id || doc.uploaded_by || '')
  443 |     if (!ownerId) continue
  444 |     if (!docsByUser.has(ownerId)) docsByUser.set(ownerId, [])
  445 |     docsByUser.get(ownerId).push({
  446 |       ...doc,
  447 |       public_url: toPublicFileUrl(doc.file_path || doc.url || ''),
  448 |     })
  449 |   }
  450 | 
  451 |   const duplicateIndex = {}
  452 |   DUPLICATE_FIELDS.forEach((field) => {
  453 |     duplicateIndex[field] = new Map()
  454 |   })
  455 |   const rows = Array.isArray(all) ? all : []
  456 | 
  457 |   for (const rec of rows) {
  458 |     const docs = rec?.documents || {}
  459 |     DUPLICATE_FIELDS.forEach((field) => {
  460 |       const aliasFields = fieldAliases[field] || [field]
  461 |       const value = aliasFields.map((key) => docs?.[key]).find(Boolean)
  462 |       if (!value) return
  463 |       const normalized = normalizeDocValue(value)
  464 |       if (!normalized) return
  465 |       const bucket = duplicateIndex[field]
  466 |       if (!bucket.has(normalized)) bucket.set(normalized, new Set())
  467 |       bucket.get(normalized).add(String(rec.user_id || ''))
  468 |     })
  469 |   }
  470 | 
  471 |   const filtered = rows.filter((rec) => {
  472 |     const reviewStatus = normalizeReviewStatus(rec.review_status, rec.verified ? 'approved' : 'pending')
  473 |     if (status) return reviewStatus === status
  474 |     if (!hasAnyDocument(rec.documents)) return false
  475 |     return reviewStatus !== 'approved'
  476 |   })
  477 | 
  478 |   return filtered
  479 |     .map((rec) => {
  480 |       const user = usersById.get(String(rec.user_id || '')) || null
  481 |       const summary = getVerificationPublicSummary(user || {}, rec)
  482 |       const duplicate_flags = DUPLICATE_FIELDS.reduce((flags, field) => {
  483 |         const aliasFields = fieldAliases[field] || [field]
  484 |         const value = aliasFields.map((key) => rec?.documents?.[key]).find(Boolean)
  485 |         if (!value) return flags
  486 |         const normalized = normalizeDocValue(value)
  487 |         if (!normalized) return flags
  488 |         const bucket = duplicateIndex[field]
  489 |         const matchedUsers = bucket.get(normalized)
  490 |         if (matchedUsers && matchedUsers.size > 1) {
  491 |           flags.push({
  492 |             field,
  493 |             value,
  494 |             user_ids: Array.from(matchedUsers),
  495 |           })
  496 |         }
  497 |         return flags
  498 |       }, [])
  499 |       return {
  500 |         ...rec,
  501 |         review_status: normalizeReviewStatus(rec.review_status, rec.verified ? 'approved' : 'pending'),
  502 |         user: user ? {
  503 |           id: user.id,
  504 |           name: user.name,
  505 |           email: user.email,
  506 |           role: user.role,
  507 |           verified: Boolean(user.verified),
  508 |           subscription_status: user.subscription_status,
  509 |           country: user.profile?.country || '',
  510 |         } : null,
  511 |         required_checklist: summary.required_checklist,
  512 |         credibility: summary.credibility,
  513 |         duplicate_flags,
  514 |         uploaded_documents: docsByUser.get(String(rec.user_id || '')) || [],
  515 |       }
  516 |     })
  517 |     .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  518 | }
  519 | 
  520 | export async function listExpiringVerifications(thresholdDays = 7) {
  521 |   const all = await readJson(FILE)
  522 |   const rows = Array.isArray(all) ? all : []
  523 |   return rows.filter((rec) => {
  524 |     const remaining = Number(rec.subscription_remaining_days || 0)
  525 |     return rec.verified && remaining > 0 && remaining <= thresholdDays
  526 |   })
  527 | }
  528 | 
  529 | export async function markVerificationExpiringSoon(userId, remainingDays, thresholdDays = 7) {
  530 |   const all = await readJson(FILE)
  531 |   const idx = all.findIndex((v) => v.user_id === userId)
  532 |   if (idx < 0) return null
  533 | 
  534 |   const nextRemainingDays = Math.max(0, Number(remainingDays) || 0)
  535 |   const isExpiringSoon = all[idx].verified && nextRemainingDays > 0 && nextRemainingDays <= thresholdDays
  536 | 
  537 |   all[idx].subscription_remaining_days = nextRemainingDays
  538 |   all[idx].expiring_soon = isExpiringSoon
  539 |   all[idx].verification_status = all[idx].verified
  540 |     ? (isExpiringSoon ? 'expiring_soon' : 'verified_active')
  541 |     : 'expired'
  542 |   all[idx].updated_at = new Date().toISOString()
  543 | 
  544 |   await writeJson(FILE, all)
  545 |   return all[idx]
  546 | }
  547 | 