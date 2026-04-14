    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | const USERS_FILE = 'users.json'
    6 | const HISTORY_FILE = 'wallet_history.json'
    7 | const COUPON_CODES_FILE = 'coupon_codes.json'
    8 | const COUPON_REDEMPTIONS_FILE = 'coupon_redemptions.json'
    9 | 
   10 | function toAmount(value) {
   11 |   const num = Number(value)
   12 |   if (!Number.isFinite(num) || num <= 0) return 0
   13 |   return Math.round(num * 100) / 100
   14 | }
   15 | 
   16 | export async function getWallet(userId) {
   17 |   const users = await readJson(USERS_FILE)
   18 |   const user = Array.isArray(users) ? users.find((u) => String(u.id) === String(userId || '')) : null
   19 |   if (!user) return null
   20 |   return {
   21 |     user_id: user.id,
   22 |     balance_usd: Math.round(Number(user.wallet_balance_usd || 0) * 100) / 100,
   23 |     restricted_balance_usd: Math.round(Number(user.wallet_restricted_usd || 0) * 100) / 100,
   24 |   }
   25 | }
   26 | 
   27 | export async function listWalletHistory(userId, limit = 50) {
   28 |   const history = await readJson(HISTORY_FILE)
   29 |   const rows = Array.isArray(history) ? history : []
   30 |   const filtered = rows
   31 |     .filter((r) => String(r.user_id) === String(userId || ''))
   32 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
   33 |   return filtered.slice(0, Math.max(1, Math.min(200, Number(limit) || 50)))
   34 | }
   35 | 
   36 | export async function creditWallet({ userId, amountUsd, reason = '', ref = '', metadata = {}, restricted = false }) {
   37 |   const amount = toAmount(amountUsd)
   38 |   if (!amount) {
   39 |     const err = new Error('Invalid amount')
   40 |     err.status = 400
   41 |     throw err
   42 |   }
   43 | 
   44 |   const users = await readJson(USERS_FILE)
   45 |   const idx = Array.isArray(users) ? users.findIndex((u) => String(u.id) === String(userId || '')) : -1
   46 |   if (idx < 0) {
   47 |     const err = new Error('User not found')
   48 |     err.status = 404
   49 |     throw err
   50 |   }
   51 | 
   52 |   const currentBalance = Math.round(Number(users[idx].wallet_balance_usd || 0) * 100) / 100
   53 |   const currentRestricted = Math.round(Number(users[idx].wallet_restricted_usd || 0) * 100) / 100
   54 |   const nextRestricted = restricted ? Math.round((currentRestricted + amount) * 100) / 100 : currentRestricted
   55 |   const nextBalance = restricted ? currentBalance : Math.round((currentBalance + amount) * 100) / 100
   56 | 
   57 |   users[idx] = {
   58 |     ...users[idx],
   59 |     wallet_balance_usd: nextBalance,
   60 |     wallet_restricted_usd: nextRestricted,
   61 |     wallet_updated_at: nowIso(),
   62 |   }
   63 |   await writeJson(USERS_FILE, users)
   64 | 
   65 |   const history = await readJson(HISTORY_FILE)
   66 |   const rows = Array.isArray(history) ? history : []
   67 |   rows.push({
   68 |     id: crypto.randomUUID(),
   69 |     user_id: users[idx].id,
   70 |     kind: 'credit',
   71 |     amount_usd: amount,
   72 |     balance_after_usd: nextBalance,
   73 |     reason: sanitizeString(String(reason || ''), 80),
   74 |     ref: sanitizeString(String(ref || ''), 160),
   75 |     meta: metadata && typeof metadata === 'object'
   76 |       ? { ...metadata, restricted_credit: restricted, restricted_balance_after_usd: nextRestricted }
   77 |       : { restricted_credit: restricted, restricted_balance_after_usd: nextRestricted },
   78 |     created_at: nowIso(),
   79 |   })
   80 |   await writeJson(HISTORY_FILE, rows)
   81 | 
   82 |   return { wallet: { user_id: users[idx].id, balance_usd: nextBalance, restricted_balance_usd: nextRestricted } }
   83 | }
   84 | 
   85 | export async function debitWallet({ userId, amountUsd, reason = '', ref = '', metadata = {}, allowRestricted = false }) {
   86 |   const amount = toAmount(amountUsd)
   87 |   if (!amount) {
   88 |     const err = new Error('Invalid amount')
   89 |     err.status = 400
   90 |     throw err
   91 |   }
   92 | 
   93 |   const users = await readJson(USERS_FILE)
   94 |   const idx = Array.isArray(users) ? users.findIndex((u) => String(u.id) === String(userId || '')) : -1
   95 |   if (idx < 0) {
   96 |     const err = new Error('User not found')
   97 |     err.status = 404
   98 |     throw err
   99 |   }
  100 | 
  101 |   const currentBalance = Math.round(Number(users[idx].wallet_balance_usd || 0) * 100) / 100
  102 |   const currentRestricted = Math.round(Number(users[idx].wallet_restricted_usd || 0) * 100) / 100
  103 |   const available = allowRestricted ? currentBalance + currentRestricted : currentBalance
  104 |   if (available < amount) {
  105 |     const err = new Error(`Insufficient wallet balance. Needed $${amount.toFixed(2)}.`)
  106 |     err.status = 402
  107 |     err.code = 'WALLET_INSUFFICIENT'
  108 |     err.balance_usd = currentBalance
  109 |     err.restricted_balance_usd = currentRestricted
  110 |     throw err
  111 |   }
  112 | 
  113 |   let restrictedUsed = 0
  114 |   let unrestrictedUsed = amount
  115 |   if (allowRestricted && currentRestricted > 0) {
  116 |     restrictedUsed = Math.min(currentRestricted, amount)
  117 |     unrestrictedUsed = Math.max(0, amount - restrictedUsed)
  118 |   }
  119 | 
  120 |   const nextRestricted = Math.round((currentRestricted - restrictedUsed) * 100) / 100
  121 |   const nextBalance = Math.round((currentBalance - unrestrictedUsed) * 100) / 100
  122 |   users[idx] = {
  123 |     ...users[idx],
  124 |     wallet_balance_usd: nextBalance,
  125 |     wallet_restricted_usd: nextRestricted,
  126 |     wallet_updated_at: new Date().toISOString(),
  127 |   }
  128 |   await writeJson(USERS_FILE, users)
  129 | 
  130 |   const history = await readJson(HISTORY_FILE)
  131 |   const rows = Array.isArray(history) ? history : []
  132 |   const row = {
  133 |     id: crypto.randomUUID(),
  134 |     user_id: users[idx].id,
  135 |     kind: 'debit',
  136 |     amount_usd: amount,
  137 |     balance_after_usd: nextBalance,
  138 |     reason: sanitizeString(String(reason || ''), 80),
  139 |     ref: sanitizeString(String(ref || ''), 160),
  140 |     meta: metadata && typeof metadata === 'object'
  141 |       ? { ...metadata, restricted_used_usd: restrictedUsed, restricted_balance_after_usd: nextRestricted }
  142 |       : { restricted_used_usd: restrictedUsed, restricted_balance_after_usd: nextRestricted },
  143 |     created_at: new Date().toISOString(),
  144 |   }
  145 |   rows.push(row)
  146 |   await writeJson(HISTORY_FILE, rows)
  147 | 
  148 |   return { wallet: { user_id: users[idx].id, balance_usd: nextBalance, restricted_balance_usd: nextRestricted }, entry: row }
  149 | }
  150 | 
  151 | function normalizeCouponCode(code = '') {
  152 |   return sanitizeString(String(code || ''), 80).trim().toUpperCase()
  153 | }
  154 | 
  155 | function nowIso() {
  156 |   return new Date().toISOString()
  157 | }
  158 | 
  159 | function isExpired(expiresAt) {
  160 |   if (!expiresAt) return false
  161 |   const ts = new Date(expiresAt).getTime()
  162 |   if (!Number.isFinite(ts)) return false
  163 |   return ts < Date.now()
  164 | }
  165 | 
  166 | export async function assertCouponRedeemable(code, userId = '') {
  167 |   const normalized = normalizeCouponCode(code)
  168 |   if (!normalized) {
  169 |     const err = new Error('Coupon code is required')
  170 |     err.status = 400
  171 |     throw err
  172 |   }
  173 | 
  174 |   const [codes, redemptions] = await Promise.all([
  175 |     readJson(COUPON_CODES_FILE),
  176 |     readJson(COUPON_REDEMPTIONS_FILE),
  177 |   ])
  178 | 
  179 |   const coupon = (Array.isArray(codes) ? codes : []).find((row) => String(row.code || '').toUpperCase() === normalized)
  180 |   if (!coupon || !coupon.active) {
  181 |     const err = new Error('Invalid or inactive coupon code')
  182 |     err.status = 404
  183 |     throw err
  184 |   }
  185 |   if (isExpired(coupon.expires_at)) {
  186 |     const err = new Error('Coupon code has expired')
  187 |     err.status = 410
  188 |     throw err
  189 |   }
  190 | 
  191 |   const allRedemptions = Array.isArray(redemptions) ? redemptions : []
  192 |   if (coupon.max_redemptions && allRedemptions.filter((r) => r.code_id === coupon.id).length >= coupon.max_redemptions) {
  193 |     const err = new Error('Coupon code has reached its redemption limit')
  194 |     err.status = 409
  195 |     throw err
  196 |   }
  197 | 
  198 |   if (userId) {
  199 |     const already = allRedemptions.some((r) => r.code_id === coupon.id && String(r.user_id) === String(userId))
  200 |     if (already) {
  201 |       const err = new Error('Coupon code already redeemed')
  202 |       err.status = 409
  203 |       throw err
  204 |     }
  205 |   }
  206 | 
  207 |   return coupon
  208 | }
  209 | 
  210 | function normalizeCouponPayload(payload = {}) {
  211 |   const code = normalizeCouponCode(payload.code || '')
  212 |   const amount = toAmount(payload.amount_usd ?? payload.amountUsd ?? 5)
  213 |   const marketingSource = sanitizeString(String(payload.marketing_source || ''), 120).trim()
  214 |   const campaign = sanitizeString(String(payload.campaign || ''), 120).trim()
  215 |   const createdBy = sanitizeString(String(payload.created_by || ''), 120).trim()
  216 |   const freeMonthsRaw = payload.verification_free_months ?? payload.verificationFreeMonths ?? payload.free_verification_months ?? payload.freeVerificationMonths
  217 |   const freeMonths = Number.isFinite(Number(freeMonthsRaw)) ? Math.max(0, Math.floor(Number(freeMonthsRaw))) : 0
  218 |   const requiresCard = payload.requires_card !== undefined
  219 |     ? Boolean(payload.requires_card)
  220 |     : payload.requiresCard !== undefined
  221 |       ? Boolean(payload.requiresCard)
  222 |       : false
  223 |   const maxRedemptions = payload.max_redemptions !== undefined && payload.max_redemptions !== null
  224 |     ? Number(payload.max_redemptions)
  225 |     : payload.maxRedemptions !== undefined && payload.maxRedemptions !== null
  226 |       ? Number(payload.maxRedemptions)
  227 |       : null
  228 |   const expiresAt = payload.expires_at || payload.expiresAt || ''
  229 |   let normalizedExpires = null
  230 |   if (expiresAt) {
  231 |     const parsed = new Date(expiresAt)
  232 |     if (!Number.isNaN(parsed.getTime())) normalizedExpires = parsed.toISOString()
  233 |   }
  234 |   const roleRestrictionsRaw = payload.role_restrictions ?? payload.roleRestrictions ?? payload.roles ?? []
  235 |   const roleRestrictions = Array.isArray(roleRestrictionsRaw)
  236 |     ? roleRestrictionsRaw.map((role) => sanitizeString(String(role || ''), 40).toLowerCase()).filter(Boolean)
  237 |     : String(roleRestrictionsRaw || '')
  238 |         .split(',')
  239 |         .map((role) => sanitizeString(role.trim(), 40).toLowerCase())
  240 |         .filter(Boolean)
  241 | 
  242 |   return {
  243 |     code,
  244 |     amount_usd: amount,
  245 |     active: payload.active !== undefined ? Boolean(payload.active) : true,
  246 |     max_redemptions: Number.isFinite(maxRedemptions) && maxRedemptions > 0 ? Math.floor(maxRedemptions) : null,
  247 |     expires_at: normalizedExpires,
  248 |     created_by: createdBy || null,
  249 |     marketing_source: marketingSource || null,
  250 |     campaign: campaign || null,
  251 |     role_restrictions: roleRestrictions.length ? roleRestrictions : null,
  252 |     verification_free_months: freeMonths || null,
  253 |     requires_card: requiresCard || null,
  254 |   }
  255 | }
  256 | 
  257 | export async function listCouponCodes() {
  258 |   const codes = await readJson(COUPON_CODES_FILE)
  259 |   const rows = Array.isArray(codes) ? codes : []
  260 |   return rows.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  261 | }
  262 | 
  263 | export async function createCouponCode(payload = {}) {
  264 |   const normalized = normalizeCouponPayload(payload)
  265 |   if (!normalized.code) {
  266 |     const err = new Error('Coupon code is required')
  267 |     err.status = 400
  268 |     throw err
  269 |   }
  270 |   if (!normalized.amount_usd) {
  271 |     const err = new Error('Coupon amount is invalid')
  272 |     err.status = 400
  273 |     throw err
  274 |   }
  275 | 
  276 |   const codes = await readJson(COUPON_CODES_FILE)
  277 |   const rows = Array.isArray(codes) ? codes : []
  278 |   const exists = rows.some((row) => String(row.code || '').toUpperCase() === normalized.code)
  279 |   if (exists) {
  280 |     const err = new Error('Coupon code already exists')
  281 |     err.status = 409
  282 |     throw err
  283 |   }
  284 | 
  285 |   const row = {
  286 |     id: crypto.randomUUID(),
  287 |     code: normalized.code,
  288 |     amount_usd: normalized.amount_usd,
  289 |     active: normalized.active,
  290 |     max_redemptions: normalized.max_redemptions,
  291 |     expires_at: normalized.expires_at,
  292 |     created_by: normalized.created_by,
  293 |     marketing_source: normalized.marketing_source,
  294 |     campaign: normalized.campaign,
  295 |     role_restrictions: normalized.role_restrictions,
  296 |     verification_free_months: normalized.verification_free_months,
  297 |     requires_card: normalized.requires_card,
  298 |     created_at: nowIso(),
  299 |   }
  300 | 
  301 |   rows.push(row)
  302 |   await writeJson(COUPON_CODES_FILE, rows)
  303 |   return row
  304 | }
  305 | 
  306 | export async function redeemCouponForUser({ userId, code }) {
  307 |   const normalized = normalizeCouponCode(code)
  308 |   const coupon = await assertCouponRedeemable(normalized, userId)
  309 |   const amount = toAmount(coupon.amount_usd || 0)
  310 |   if (!amount) {
  311 |     const err = new Error('Coupon amount is invalid')
  312 |     err.status = 400
  313 |     throw err
  314 |   }
  315 | 
  316 |   const users = await readJson(USERS_FILE)
  317 |   const idx = Array.isArray(users) ? users.findIndex((u) => String(u.id) === String(userId || '')) : -1
  318 |   if (idx < 0) {
  319 |     const err = new Error('User not found')
  320 |     err.status = 404
  321 |     throw err
  322 |   }
  323 | 
  324 |   if (coupon.requires_card && !users[idx]?.profile?.payment_method_on_file) {
  325 |     const err = new Error('Payment method required to redeem this coupon.')
  326 |     err.status = 402
  327 |     err.code = 'PAYMENT_METHOD_REQUIRED'
  328 |     throw err
  329 |   }
  330 | 
  331 |   const roleRestrictions = Array.isArray(coupon.role_restrictions) ? coupon.role_restrictions : []
  332 |   if (roleRestrictions.length) {
  333 |     const userRole = String(users[idx].role || '').toLowerCase()
  334 |     if (!roleRestrictions.includes(userRole)) {
  335 |       const err = new Error('Coupon code is not valid for this account role.')
  336 |       err.status = 403
  337 |       err.code = 'ROLE_NOT_ELIGIBLE'
  338 |       throw err
  339 |     }
  340 |   }
  341 | 
  342 |   const currentRestricted = Math.round(Number(users[idx].wallet_restricted_usd || 0) * 100) / 100
  343 |   const nextRestricted = Math.round((currentRestricted + amount) * 100) / 100
  344 |   const freeMonths = Number(coupon.verification_free_months || 0)
  345 |   let nextProfile = users[idx].profile || {}
  346 |   if (Number.isFinite(freeMonths) && freeMonths > 0) {
  347 |     const freeUntil = new Date()
  348 |     freeUntil.setDate(freeUntil.getDate() + (freeMonths * 30))
  349 |     nextProfile = {
  350 |       ...nextProfile,
  351 |       verification_free_until: freeUntil.toISOString(),
  352 |       verification_free_months: freeMonths,
  353 |       verification_free_source: coupon.code || coupon.id,
  354 |     }
  355 |   }
  356 | 
  357 |   users[idx] = {
  358 |     ...users[idx],
  359 |     profile: nextProfile,
  360 |     wallet_restricted_usd: nextRestricted,
  361 |     wallet_updated_at: nowIso(),
  362 |   }
  363 |   await writeJson(USERS_FILE, users)
  364 | 
  365 |   const redemptions = await readJson(COUPON_REDEMPTIONS_FILE)
  366 |   const nextRedemptions = Array.isArray(redemptions) ? redemptions : []
  367 |   const redemption = {
  368 |     id: crypto.randomUUID(),
  369 |     code_id: coupon.id,
  370 |     user_id: users[idx].id,
  371 |     amount_usd: amount,
  372 |     redeemed_at: nowIso(),
  373 |   }
  374 |   nextRedemptions.push(redemption)
  375 |   await writeJson(COUPON_REDEMPTIONS_FILE, nextRedemptions)
  376 | 
  377 |   const history = await readJson(HISTORY_FILE)
  378 |   const rows = Array.isArray(history) ? history : []
  379 |   const historyRow = {
  380 |     id: crypto.randomUUID(),
  381 |     user_id: users[idx].id,
  382 |     kind: 'credit',
  383 |     amount_usd: amount,
  384 |     balance_after_usd: Math.round(Number(users[idx].wallet_balance_usd || 0) * 100) / 100,
  385 |     reason: 'coupon_redeem',
  386 |     ref: `coupon:${coupon.code}`,
  387 |     meta: {
  388 |       restricted_credit: true,
  389 |       restricted_balance_after_usd: nextRestricted,
  390 |       coupon_id: coupon.id,
  391 |       coupon_code: coupon.code,
  392 |       marketing_source: coupon.marketing_source || null,
  393 |       campaign: coupon.campaign || null,
  394 |       role_restrictions: Array.isArray(coupon.role_restrictions) ? coupon.role_restrictions : null,
  395 |       verification_free_months: Number(coupon.verification_free_months || 0) || null,
  396 |       requires_card: Boolean(coupon.requires_card),
  397 |     },
  398 |     created_at: nowIso(),
  399 |   }
  400 |   rows.push(historyRow)
  401 |   await writeJson(HISTORY_FILE, rows)
  402 | 
  403 |   return {
  404 |     wallet: {
  405 |       user_id: users[idx].id,
  406 |       balance_usd: Math.round(Number(users[idx].wallet_balance_usd || 0) * 100) / 100,
  407 |       restricted_balance_usd: nextRestricted,
  408 |     },
  409 |     redemption,
  410 |   }
  411 | }
  412 | 