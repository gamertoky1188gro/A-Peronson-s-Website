    1 | import crypto from 'crypto'
    2 | import bcrypt from 'bcryptjs'
    3 | import { readJson, writeJson } from '../utils/jsonStore.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | import { upsertSubscription } from './subscriptionService.js'
    6 | import { getAdminConfig } from './adminConfigService.js'
    7 | import { creditWallet, redeemCouponForUser } from './walletService.js'
    8 | import { getPlanForUser } from './entitlementService.js'
    9 | import { reindexOrg } from './openSearchService.js'
   10 | 
   11 | const FILE = 'users.json'
   12 | const CONNECTION_FILE = 'user_connections.json'
   13 | 
   14 | const OPENSEARCH_REINDEX_PROFILE_KEYS = new Set([
   15 |   'country',
   16 |   'industry',
   17 |   'certifications',
   18 |   'monthly_capacity',
   19 |   'lead_time_days',
   20 |   'payment_terms',
   21 |   'document_ready',
   22 |   'audit_date',
   23 |   'language_support',
   24 |   'incoterms',
   25 |   'main_processes',
   26 |   'years_in_business',
   27 |   'handles_multiple_factories',
   28 |   'team_seats',
   29 |   'export_ports',
   30 |   'location_lat',
   31 |   'location_lng',
   32 | ])
   33 | 
   34 | function cleanUser(user) {
   35 |   const { password_hash: _passwordHash, passkeys, ...safe } = user
   36 |   return {
   37 |     ...safe,
   38 |     passkeys: Array.isArray(passkeys)
   39 |       ? passkeys.map((key) => ({
   40 |         id: key.id,
   41 |         name: key.name || '',
   42 |         created_at: key.created_at || '',
   43 |         last_used_at: key.last_used_at || '',
   44 |         transports: Array.isArray(key.transports) ? key.transports : [],
   45 |       }))
   46 |       : [],
   47 |   }
   48 | }
   49 | 
   50 | 
   51 | export function buildFriendMatchId(userA, userB) {
   52 |   const ids = [sanitizeString(String(userA || ''), 120), sanitizeString(String(userB || ''), 120)].filter(Boolean).sort()
   53 |   if (ids.length !== 2) return ''
   54 |   return `friend:${ids[0]}:${ids[1]}`
   55 | }
   56 | 
   57 | export function isUserPairInFriendMatch(matchId, userA, userB) {
   58 |   if (!String(matchId || '').startsWith('friend:')) return false
   59 |   return matchId === buildFriendMatchId(userA, userB)
   60 | }
   61 | 
   62 | export async function isFriendConnected(userA, userB) {
   63 |   if (!userA || !userB || userA === userB) return false
   64 |   const rows = await readJson(CONNECTION_FILE)
   65 |   return rows.some((row) => {
   66 |     const samePair = (row.requester_id === userA && row.receiver_id === userB) || (row.requester_id === userB && row.receiver_id === userA)
   67 |     if (!samePair) return false
   68 |     const status = String(row.status || '').toLowerCase()
   69 |     if (row.type === 'friend' && ['active', 'accepted'].includes(status)) return true
   70 |     if (row.type === 'friend_request' && ['active', 'accepted'].includes(status)) return true
   71 |     return false
   72 |   })
   73 | }
   74 | 
   75 | function connectionSnapshot(connections, viewerId, targetId) {
   76 |   const following = connections.some((row) => row.type === 'follow' && row.requester_id === viewerId && row.receiver_id === targetId && row.status === 'active')
   77 | 
   78 |   const friends = connections.some((row) => {
   79 |     const samePair = (row.requester_id === viewerId && row.receiver_id === targetId) || (row.requester_id === targetId && row.receiver_id === viewerId)
   80 |     if (!samePair) return false
   81 |     const status = String(row.status || '').toLowerCase()
   82 |     if (row.type === 'friend' && ['active', 'accepted'].includes(status)) return true
   83 |     if (row.type === 'friend_request' && ['active', 'accepted'].includes(status)) return true
   84 |     return false
   85 |   })
   86 | 
   87 |   if (friends) {
   88 |     return { following, friend_status: 'friends' }
   89 |   }
   90 | 
   91 |   const outgoingPending = connections.some((row) => row.type === 'friend_request' && row.requester_id === viewerId && row.receiver_id === targetId && row.status === 'pending')
   92 |   if (outgoingPending) {
   93 |     return { following, friend_status: 'requested' }
   94 |   }
   95 | 
   96 |   const incomingPending = connections.some((row) => row.type === 'friend_request' && row.requester_id === targetId && row.receiver_id === viewerId && row.status === 'pending')
   97 |   if (incomingPending) {
   98 |     return { following, friend_status: 'incoming' }
   99 |   }
  100 | 
  101 |   return { following, friend_status: 'none' }
  102 | }
  103 | 
  104 | export async function listUsers() {
  105 |   const users = await readJson(FILE)
  106 |   return users.map(cleanUser)
  107 | }
  108 | 
  109 | export async function listUsersByIds(ids = []) {
  110 |   const users = await readJson(FILE)
  111 |   const set = new Set((Array.isArray(ids) ? ids : []).map((id) => String(id)))
  112 |   return users.filter((u) => set.has(String(u.id))).map(cleanUser)
  113 | }
  114 | 
  115 | export async function listEarlyVerifiedFactories({ days = 30, limit = 20 } = {}) {
  116 |   const users = await readJson(FILE)
  117 |   const cutoff = Date.now() - Number(days || 30) * 24 * 60 * 60 * 1000
  118 |   const rows = users
  119 |     .filter((u) => String(u.role || '').toLowerCase() === 'factory')
  120 |     .filter((u) => Boolean(u.verified))
  121 |     .filter((u) => {
  122 |       const ts = new Date(u.updated_at || u.created_at || '').getTime()
  123 |       return Number.isFinite(ts) ? ts >= cutoff : false
  124 |     })
  125 |     .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))
  126 |     .slice(0, Math.max(1, Math.min(50, Number(limit || 20))))
  127 |     .map(cleanUser)
  128 | 
  129 |   return rows
  130 | }
  131 | 
  132 | export async function searchUsers(viewerId, query) {
  133 |   const users = await readJson(FILE)
  134 |   const connections = await readJson(CONNECTION_FILE)
  135 |   const search = sanitizeString(query || '', 120).trim().toLowerCase()
  136 | 
  137 |   const matches = users
  138 |     // Agents are internal sub-accounts and should not appear in global user search suggestions.
  139 |     .filter((user) => String(user.role || '').toLowerCase() !== 'agent')
  140 |     .filter((user) => {
  141 |       if (!search) return true
  142 |       return user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search) || String(user.role || '').toLowerCase().includes(search)
  143 |     })
  144 |     .slice(0, 12)
  145 |     .map((user) => {
  146 |       const safe = cleanUser(user)
  147 |       const isSelf = user.id === viewerId
  148 |       const relation = isSelf ? { following: false, friend_status: 'self' } : connectionSnapshot(connections, viewerId, user.id)
  149 |       return {
  150 |         id: safe.id,
  151 |         name: safe.name,
  152 |         email: safe.email,
  153 |         role: safe.role,
  154 |         verified: Boolean(safe.verified),
  155 |         is_self: isSelf,
  156 |         ...relation,
  157 |       }
  158 |     })
  159 | 
  160 |   return matches
  161 | }
  162 | 
  163 | export async function followUser(viewerId, targetId) {
  164 |   const rows = await readJson(CONNECTION_FILE)
  165 |   const now = new Date().toISOString()
  166 | 
  167 |   const existingIndex = rows.findIndex((row) => row.type === 'follow' && row.requester_id === viewerId && row.receiver_id === targetId)
  168 |   if (existingIndex >= 0) {
  169 |     rows[existingIndex] = {
  170 |       ...rows[existingIndex],
  171 |       status: 'active',
  172 |       updated_at: now,
  173 |     }
  174 |   } else {
  175 |     rows.push({
  176 |       id: crypto.randomUUID(),
  177 |       type: 'follow',
  178 |       requester_id: viewerId,
  179 |       receiver_id: targetId,
  180 |       status: 'active',
  181 |       created_at: now,
  182 |       updated_at: now,
  183 |     })
  184 |   }
  185 | 
  186 |   await writeJson(CONNECTION_FILE, rows)
  187 |   return connectionSnapshot(rows, viewerId, targetId)
  188 | }
  189 | 
  190 | export async function sendFriendRequest(viewerId, targetId) {
  191 |   const rows = await readJson(CONNECTION_FILE)
  192 |   const now = new Date().toISOString()
  193 | 
  194 |   const existingFriendIndex = rows.findIndex(
  195 |     (row) => row.type === 'friend' && ['active', 'accepted'].includes(String(row.status || '').toLowerCase())
  196 |       && ((row.requester_id === viewerId && row.receiver_id === targetId) || (row.requester_id === targetId && row.receiver_id === viewerId)),
  197 |   )
  198 | 
  199 |   if (existingFriendIndex >= 0) {
  200 |     return connectionSnapshot(rows, viewerId, targetId)
  201 |   }
  202 | 
  203 |   const incomingIndex = rows.findIndex((row) => row.type === 'friend_request' && row.requester_id === targetId && row.receiver_id === viewerId && row.status === 'pending')
  204 |   if (incomingIndex >= 0) {
  205 |     rows[incomingIndex] = {
  206 |       ...rows[incomingIndex],
  207 |       type: 'friend',
  208 |       status: 'active',
  209 |       updated_at: now,
  210 |     }
  211 |     await writeJson(CONNECTION_FILE, rows)
  212 |     return connectionSnapshot(rows, viewerId, targetId)
  213 |   }
  214 | 
  215 |   const outgoingIndex = rows.findIndex((row) => row.type === 'friend_request' && row.requester_id === viewerId && row.receiver_id === targetId && row.status === 'pending')
  216 |   if (outgoingIndex < 0) {
  217 |     rows.push({
  218 |       id: crypto.randomUUID(),
  219 |       type: 'friend_request',
  220 |       requester_id: viewerId,
  221 |       receiver_id: targetId,
  222 |       status: 'pending',
  223 |       created_at: now,
  224 |       updated_at: now,
  225 |     })
  226 |     await writeJson(CONNECTION_FILE, rows)
  227 |   }
  228 | 
  229 |   return connectionSnapshot(rows, viewerId, targetId)
  230 | }
  231 | 
  232 | export async function findUserByEmail(email) {
  233 |   const users = await readJson(FILE)
  234 |   return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  235 | }
  236 | 
  237 | export async function findUserByMemberId(memberId) {
  238 |   const id = sanitizeString(String(memberId || ''), 64).trim()
  239 |   if (!id) return null
  240 |   const users = await readJson(FILE)
  241 |   return users.find((u) => String(u.member_id || '').toLowerCase() === id.toLowerCase())
  242 | }
  243 | 
  244 | export async function findUserById(id) {
  245 |   const users = await readJson(FILE)
  246 |   return users.find((u) => u.id === id)
  247 | }
  248 | 
  249 | export async function registerUser(payload) {
  250 |   const users = await readJson(FILE)
  251 |   const hash = await bcrypt.hash(payload.password, 10)
  252 |   const nowIso = new Date().toISOString()
  253 | 
  254 |   const user = {
  255 |     id: crypto.randomUUID(),
  256 |     name: sanitizeString(payload.name || payload.company_name, 120),
  257 |     email: payload.email.toLowerCase(),
  258 |     password_hash: hash,
  259 |     role: payload.role,
  260 |     status: 'active',
  261 |     verified: payload.role === 'admin',
  262 |     subscription_status: payload.subscription_status === 'premium' ? 'premium' : 'free',
  263 |     created_at: nowIso,
  264 |     wallet_balance_usd: 0,
  265 |     wallet_restricted_usd: 0,
  266 |     // Trust & moderation state (project.md): warnings/restrictions for policy violations.
  267 |     policy_strikes: 0,
  268 |     messaging_restricted_until: null,
  269 |     passkeys: [],
  270 |     profile: {
  271 |       country: sanitizeString(payload.profile?.country || '', 120),
  272 |       certifications: Array.isArray(payload.profile?.certifications) ? payload.profile.certifications.map((c) => sanitizeString(c, 80)) : [],
  273 |       bank_proof: sanitizeString(payload.profile?.bank_proof || '', 200),
  274 |       export_license: sanitizeString(payload.profile?.export_license || '', 160),
  275 |       monthly_capacity: sanitizeString(payload.profile?.monthly_capacity || '', 80),
  276 |       moq: sanitizeString(payload.profile?.moq || '', 40),
  277 |       lead_time_days: sanitizeString(payload.profile?.lead_time_days || '', 40),
  278 |     },
  279 |   }
  280 | 
  281 |   users.push(user)
  282 |   await writeJson(FILE, users)
  283 |   await upsertSubscription(user.id, user.subscription_status, true, {
  284 |     actor_id: user.id,
  285 |     source: 'system',
  286 |     note: 'user_created',
  287 |   })
  288 |   // project.md: auto $5 restricted credit for all new accounts (configurable).
  289 |   try {
  290 |     const config = await getAdminConfig()
  291 |     if (config?.feature_flags?.auto_credit !== false) {
  292 |       await creditWallet({
  293 |         userId: user.id,
  294 |         amountUsd: 5,
  295 |         reason: 'auto_credit',
  296 |         ref: `auto-credit:${user.id}`,
  297 |         restricted: true,
  298 |         metadata: { source: 'signup' },
  299 |       })
  300 |     }
  301 |   } catch {
  302 |     // non-blocking: auto-credit failures should not block signup
  303 |   }
  304 |   if (payload?.coupon_code) {
  305 |     await redeemCouponForUser({ userId: user.id, code: payload.coupon_code })
  306 |   }
  307 |   return cleanUser(user)
  308 | }
  309 | 
  310 | export async function verifyPassword(user, password) {
  311 |   return bcrypt.compare(password, user.password_hash)
  312 | }
  313 | 
  314 | function buildDeletedEmail(userId) {
  315 |   const suffix = sanitizeString(String(userId || ''), 80).slice(0, 48) || crypto.randomUUID()
  316 |   return `deleted+${suffix}@gartexhub.invalid`
  317 | }
  318 | 
  319 | export async function deleteUserWithPassword(userId, password) {
  320 |   const users = await readJson(FILE)
  321 |   const index = users.findIndex((u) => u.id === userId)
  322 |   if (index < 0) return null
  323 | 
  324 |   const current = users[index]
  325 |   const ok = await verifyPassword(current, String(password || ''))
  326 |   if (!ok) {
  327 |     const err = new Error('Invalid password')
  328 |     err.status = 401
  329 |     throw err
  330 |   }
  331 | 
  332 |   const now = new Date().toISOString()
  333 |   users[index] = {
  334 |     ...current,
  335 |     name: 'Deleted User',
  336 |     email: buildDeletedEmail(current.id),
  337 |     status: 'deleted',
  338 |     verified: false,
  339 |     subscription_status: 'free',
  340 |     password_hash: await bcrypt.hash(crypto.randomUUID(), 10),
  341 |     password_reset_at: now,
  342 |     profile: {
  343 |       ...(current.profile || {}),
  344 |       deleted_at: now,
  345 |       delete_reason: 'self_delete',
  346 |     },
  347 |   }
  348 |   await writeJson(FILE, users)
  349 | 
  350 |   const connections = await readJson(CONNECTION_FILE)
  351 |   const filtered = connections.filter((row) => row.requester_id !== userId && row.receiver_id !== userId)
  352 |   if (filtered.length !== connections.length) {
  353 |     await writeJson(CONNECTION_FILE, filtered)
  354 |   }
  355 | 
  356 |   return cleanUser(users[index])
  357 | }
  358 | 
  359 | export async function updateProfile(userId, profilePatch) {
  360 |   const users = await readJson(FILE)
  361 |   const index = users.findIndex((u) => u.id === userId)
  362 |   if (index < 0) return null
  363 | 
  364 |   const current = users[index]
  365 |   const plan = await getPlanForUser(current)
  366 |   const brandingFields = new Set([
  367 |     'brand_logo_url',
  368 |     'brand_cover_url',
  369 |     'brand_color',
  370 |     'brand_accent',
  371 |     'brand_tagline',
  372 |     'brand_website',
  373 |     'brand_name',
  374 |     'account_manager_name',
  375 |     'account_manager_email',
  376 |     'account_manager_phone',
  377 |   ])
  378 |   const patchEntries = Object.entries(profilePatch || {})
  379 |     .filter(([key]) => plan === 'premium' || !brandingFields.has(key))
  380 |     .map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => sanitizeString(String(x), 120)) : sanitizeString(String(v ?? ''), 240)])
  381 | 
  382 |   const nextProfile = {
  383 |     ...current.profile,
  384 |     ...Object.fromEntries(patchEntries),
  385 |   }
  386 | 
  387 |   users[index] = { ...current, profile: nextProfile }
  388 |   await writeJson(FILE, users)
  389 | 
  390 |   const patchedKeys = new Set(patchEntries.map(([key]) => key))
  391 |   const shouldReindex = [...patchedKeys].some((key) => OPENSEARCH_REINDEX_PROFILE_KEYS.has(key))
  392 |   if (shouldReindex) {
  393 |     const orgId = current.role === 'agent' && current.org_owner_id ? String(current.org_owner_id) : String(current.id)
  394 |     try {
  395 |       await reindexOrg(orgId)
  396 |     } catch {
  397 |       // ignore index failures
  398 |     }
  399 |   }
  400 | 
  401 |   return cleanUser(users[index])
  402 | }
  403 | 
  404 | export async function setUserVerification(userId, verified) {
  405 |   const users = await readJson(FILE)
  406 |   const index = users.findIndex((u) => u.id === userId)
  407 |   if (index < 0) return null
  408 |   users[index].verified = Boolean(verified)
  409 |   await writeJson(FILE, users)
  410 |   const updated = users[index]
  411 |   const orgId = updated.role === 'agent' && updated.org_owner_id ? String(updated.org_owner_id) : String(updated.id)
  412 |   try {
  413 |     await reindexOrg(orgId)
  414 |   } catch {
  415 |     // ignore index failures
  416 |   }
  417 |   return cleanUser(users[index])
  418 | }
  419 | 
  420 | export async function setUserSubscriptionStatus(userId, plan) {
  421 |   const users = await readJson(FILE)
  422 |   const index = users.findIndex((u) => u.id === userId)
  423 |   if (index < 0) return null
  424 |   users[index].subscription_status = plan === 'premium' ? 'premium' : 'free'
  425 |   await writeJson(FILE, users)
  426 |   return cleanUser(users[index])
  427 | }
  428 | 
  429 | export async function adminUpdateUser(userId, patch = {}) {
  430 |   const users = await readJson(FILE)
  431 |   const index = users.findIndex((u) => u.id === userId)
  432 |   if (index < 0) return null
  433 | 
  434 |   const current = users[index]
  435 |   const allowedRoles = new Set(['buyer', 'factory', 'buying_house', 'owner', 'admin', 'agent'])
  436 |   const nextRole = allowedRoles.has(String(patch.role || '').toLowerCase()) ? String(patch.role).toLowerCase() : current.role
  437 |   const nextStatus = patch.status ? sanitizeString(String(patch.status), 40) : current.status
  438 |   const nextVerified = patch.verified === undefined ? current.verified : Boolean(patch.verified)
  439 |   const nextPlan = patch.subscription_status ? (String(patch.subscription_status).toLowerCase() === 'premium' ? 'premium' : 'free') : current.subscription_status
  440 |   const nextStrikes = patch.policy_strikes === undefined ? current.policy_strikes : Math.max(0, Number(patch.policy_strikes || 0))
  441 |   const nextMessagingRestricted = patch.messaging_restricted_until === undefined
  442 |     ? current.messaging_restricted_until
  443 |     : (patch.messaging_restricted_until ? new Date(patch.messaging_restricted_until).toISOString() : null)
  444 |   const nextOrgOwnerId = patch.org_owner_id !== undefined
  445 |     ? (sanitizeString(String(patch.org_owner_id || ''), 120) || null)
  446 |     : current.org_owner_id
  447 |   const nextMemberId = patch.member_id !== undefined
  448 |     ? (sanitizeString(String(patch.member_id || ''), 120) || null)
  449 |     : current.member_id
  450 |   const nextPermissions = patch.permissions !== undefined
  451 |     ? (Array.isArray(patch.permissions) ? patch.permissions.map((p) => sanitizeString(String(p), 64)) : [])
  452 |     : current.permissions
  453 |   let nextPermissionMatrix = current.permission_matrix
  454 |   if (patch.permission_matrix !== undefined) {
  455 |     const rawMatrix = patch.permission_matrix && typeof patch.permission_matrix === 'object' ? patch.permission_matrix : {}
  456 |     const sections = ['requests', 'products', 'analytics', 'members', 'documents']
  457 |     nextPermissionMatrix = Object.fromEntries(sections.map((section) => {
  458 |       const sectionValue = rawMatrix?.[section] && typeof rawMatrix[section] === 'object' ? rawMatrix[section] : {}
  459 |       return [section, { view: Boolean(sectionValue.view), edit: Boolean(sectionValue.edit) }]
  460 |     }))
  461 |   }
  462 |   const nextChatbot = patch.chatbot_enabled === undefined ? current.chatbot_enabled : Boolean(patch.chatbot_enabled)
  463 | 
  464 |   const profile = { ...(current.profile || {}) }
  465 |   if (patch.fraud_flags !== undefined) {
  466 |     profile.fraud_flags = Array.isArray(patch.fraud_flags) ? patch.fraud_flags.map((v) => sanitizeString(String(v), 80)) : []
  467 |   }
  468 |   if (patch.admin_notes !== undefined) {
  469 |     profile.admin_notes = sanitizeString(String(patch.admin_notes || ''), 800)
  470 |   }
  471 | 
  472 |   const next = {
  473 |     ...current,
  474 |     role: nextRole,
  475 |     status: nextStatus,
  476 |     verified: nextVerified,
  477 |     subscription_status: nextPlan,
  478 |     policy_strikes: nextStrikes,
  479 |     messaging_restricted_until: nextMessagingRestricted,
  480 |     org_owner_id: nextOrgOwnerId,
  481 |     member_id: nextMemberId,
  482 |     permissions: nextPermissions,
  483 |     permission_matrix: nextPermissionMatrix,
  484 |     chatbot_enabled: nextChatbot,
  485 |     profile,
  486 |   }
  487 | 
  488 |   users[index] = next
  489 |   await writeJson(FILE, users)
  490 | 
  491 |   const roleChanged = String(current.role || '').toLowerCase() !== String(nextRole || '').toLowerCase()
  492 |   const verifiedChanged = Boolean(current.verified) !== Boolean(nextVerified)
  493 |   const ownerChanged = String(current.org_owner_id || '') !== String(nextOrgOwnerId || '')
  494 |   if (roleChanged || verifiedChanged || ownerChanged) {
  495 |     const touched = new Set()
  496 |     const currentOrgId = current.role === 'agent' && current.org_owner_id ? String(current.org_owner_id) : String(current.id)
  497 |     const nextOrgId = nextRole === 'agent' && nextOrgOwnerId ? String(nextOrgOwnerId) : String(next.id)
  498 |     if (currentOrgId) touched.add(currentOrgId)
  499 |     if (nextOrgId) touched.add(nextOrgId)
  500 |     for (const orgId of touched) {
  501 |       try {
  502 |         await reindexOrg(orgId)
  503 |       } catch {
  504 |         // ignore index failures
  505 |       }
  506 |     }
  507 |   }
  508 | 
  509 |   return cleanUser(next)
  510 | }
  511 | 
  512 | export async function adminSetPassword(userId, newPassword) {
  513 |   const users = await readJson(FILE)
  514 |   const index = users.findIndex((u) => u.id === userId)
  515 |   if (index < 0) return null
  516 | 
  517 |   const hash = await bcrypt.hash(String(newPassword), 10)
  518 |   users[index].password_hash = hash
  519 |   users[index].password_reset_at = new Date().toISOString()
  520 |   await writeJson(FILE, users)
  521 |   return cleanUser(users[index])
  522 | }
  523 | 
  524 | export async function adminForceLogout(userId) {
  525 |   const users = await readJson(FILE)
  526 |   const index = users.findIndex((u) => u.id === userId)
  527 |   if (index < 0) return null
  528 |   users[index].password_reset_at = new Date().toISOString()
  529 |   await writeJson(FILE, users)
  530 |   return cleanUser(users[index])
  531 | }
  532 | 
  533 | export async function adminLockMessaging(userId, lockHours = 0) {
  534 |   const users = await readJson(FILE)
  535 |   const index = users.findIndex((u) => u.id === userId)
  536 |   if (index < 0) return null
  537 | 
  538 |   const hours = Math.max(0, Number(lockHours || 0))
  539 |   users[index].messaging_restricted_until = hours
  540 |     ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
  541 |     : null
  542 |   await writeJson(FILE, users)
  543 |   return cleanUser(users[index])
  544 | }
  545 | 
  546 | export async function deleteUser(userId) {
  547 |   const users = await readJson(FILE)
  548 |   const next = users.filter((u) => u.id !== userId)
  549 |   if (next.length === users.length) return false
  550 |   await writeJson(FILE, next)
  551 |   return true
  552 | }
  553 | 