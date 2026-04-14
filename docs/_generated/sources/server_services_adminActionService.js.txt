    1 | import crypto from 'crypto'
    2 | import { readJson, updateJson, writeJson } from '../utils/jsonStore.js'
    3 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | import {
    6 |   adminForceLogout,
    7 |   adminLockMessaging,
    8 |   adminSetPassword,
    9 |   adminUpdateUser,
   10 |   findUserById,
   11 |   listUsers,
   12 |   setUserSubscriptionStatus,
   13 |   setUserVerification,
   14 | } from './userService.js'
   15 | import { upsertSubscription, renewPremiumMonthly } from './subscriptionService.js'
   16 | import { adminApproveVerification, adminRejectVerification, extendVerificationSubscription, listExpiringVerifications, revokeExpiredVerifications, setVerificationSubscription } from './verificationService.js'
   17 | import { creditWallet, debitWallet, createCouponCode } from './walletService.js'
   18 | import { updatePartnerRequestStatus } from './partnerNetworkService.js'
   19 | import { enforcePartnerFreeTierLimits } from './partnerNetworkService.js'
   20 | import { updateRequirement } from './requirementService.js'
   21 | import { updateContractArtifact, updateContractSignatures } from './documentService.js'
   22 | import { updatePaymentProof } from './paymentProofService.js'
   23 | import { createReport, resolveReport } from './reportService.js'
   24 | import { createNotification } from './notificationService.js'
   25 | import { createMember, deactivateOrRemoveMember, resetMemberPassword, updateMember, updateMemberPermissions } from './memberService.js'
   26 | import { updateAdminConfig, getAdminConfig } from './adminConfigService.js'
   27 | import { recordPolicyViolation, scanPolicyText } from './policyService.js'
   28 | import { markRecording } from './callSessionService.js'
   29 | import { createKnowledgeEntry, deleteKnowledgeEntry, updateKnowledgeEntry } from './assistantService.js'
   30 | import { recordRefund } from './refundService.js'
   31 | import { adminUpdateSupportTicket, createSupportTicket } from './supportTicketService.js'
   32 | import { addOrderCertificationEvidence, approveOrderCertification, revokeOrderCertification } from './orderCertificationService.js'
   33 | import { sendEmail } from './emailService.js'
   34 | 
   35 | function toId(value, max = 120) {
   36 |   return sanitizeString(String(value || ''), max)
   37 | }
   38 | 
   39 | function toBool(value) {
   40 |   if (typeof value === 'boolean') return value
   41 |   if (value === undefined || value === null) return false
   42 |   return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase())
   43 | }
   44 | 
   45 | function toNumber(value, fallback = 0) {
   46 |   const num = Number(value)
   47 |   return Number.isFinite(num) ? num : fallback
   48 | }
   49 | 
   50 | function parseCsvList(value) {
   51 |   if (Array.isArray(value)) return value.map((v) => sanitizeString(String(v || ''), 160)).filter(Boolean)
   52 |   return String(value || '')
   53 |     .split(',')
   54 |     .map((v) => sanitizeString(v.trim(), 160))
   55 |     .filter(Boolean)
   56 | }
   57 | 
   58 | function parseJson(value) {
   59 |   if (!value) return null
   60 |   if (typeof value === 'object') return value
   61 |   try {
   62 |     return JSON.parse(String(value))
   63 |   } catch {
   64 |     return null
   65 |   }
   66 | }
   67 | 
   68 | async function appendLocalRecord(fileName, record = {}, idKey = 'id') {
   69 |   const id = record?.[idKey] || crypto.randomUUID()
   70 |   const entry = {
   71 |     ...record,
   72 |     [idKey]: id,
   73 |     created_at: record.created_at || new Date().toISOString(),
   74 |   }
   75 |   await updateLocalJson(fileName, (rows = []) => {
   76 |     const next = Array.isArray(rows) ? rows : []
   77 |     next.push(entry)
   78 |     return next
   79 |   }, [])
   80 |   return entry
   81 | }
   82 | 
   83 | async function updateLocalRecord(fileName, id, patch = {}, idKey = 'id') {
   84 |   let updated = null
   85 |   await updateLocalJson(fileName, (rows = []) => {
   86 |     const next = Array.isArray(rows) ? rows : []
   87 |     const idx = next.findIndex((row) => String(row?.[idKey]) === String(id))
   88 |     if (idx < 0) {
   89 |       const err = new Error('Record not found')
   90 |       err.status = 404
   91 |       throw err
   92 |     }
   93 |     updated = { ...next[idx], ...patch, updated_at: new Date().toISOString() }
   94 |     next[idx] = updated
   95 |     return next
   96 |   }, [])
   97 |   return updated
   98 | }
   99 | 
  100 | async function removeLocalRecord(fileName, id, idKey = 'id') {
  101 |   await updateLocalJson(fileName, (rows = []) => (Array.isArray(rows) ? rows.filter((row) => String(row?.[idKey]) !== String(id)) : []), [])
  102 |   return true
  103 | }
  104 | 
  105 | function ensureActor(actor) {
  106 |   const role = String(actor?.role || '').toLowerCase()
  107 |   if (!actor || !['owner', 'admin'].includes(role)) {
  108 |     const err = new Error('Forbidden')
  109 |     err.status = 403
  110 |     throw err
  111 |   }
  112 |   return actor
  113 | }
  114 | 
  115 | async function resolveActor(actor) {
  116 |   ensureActor(actor)
  117 |   const full = await findUserById(actor.id)
  118 |   return full || actor
  119 | }
  120 | 
  121 | async function ensureUserExists(userId) {
  122 |   const user = await findUserById(userId)
  123 |   if (!user) {
  124 |     const err = new Error('User not found')
  125 |     err.status = 404
  126 |     throw err
  127 |   }
  128 |   return user
  129 | }
  130 | 
  131 | async function updateCouponsByKey({ codeOrId, patch }) {
  132 |   const key = sanitizeString(String(codeOrId || ''), 120).toUpperCase()
  133 |   if (!key) {
  134 |     const err = new Error('Coupon code or id is required')
  135 |     err.status = 400
  136 |     throw err
  137 |   }
  138 | 
  139 |   let updated = null
  140 |   await updateJson('coupon_codes.json', (rows) => {
  141 |     const nextRows = Array.isArray(rows) ? rows : []
  142 |     const idx = nextRows.findIndex((row) => String(row.id || '').toUpperCase() === key || String(row.code || '').toUpperCase() === key)
  143 |     if (idx < 0) {
  144 |       const err = new Error('Coupon not found')
  145 |       err.status = 404
  146 |       throw err
  147 |     }
  148 |     const current = nextRows[idx]
  149 |     updated = { ...current, ...patch, updated_at: new Date().toISOString() }
  150 |     nextRows[idx] = updated
  151 |     return nextRows
  152 |   })
  153 |   return updated
  154 | }
  155 | 
  156 | async function addPartnerListEntry(listKey, entryId) {
  157 |   const config = await getAdminConfig()
  158 |   const list = Array.isArray(config?.partner_controls?.[listKey]) ? config.partner_controls[listKey] : []
  159 |   const next = [...new Set([...list, entryId].filter(Boolean))]
  160 |   await updateAdminConfig({ partner_controls: { ...config.partner_controls, [listKey]: next } })
  161 |   return next
  162 | }
  163 | 
  164 | async function removePartnerListEntry(listKey, entryId) {
  165 |   const config = await getAdminConfig()
  166 |   const list = Array.isArray(config?.partner_controls?.[listKey]) ? config.partner_controls[listKey] : []
  167 |   const next = list.filter((id) => String(id) !== String(entryId))
  168 |   await updateAdminConfig({ partner_controls: { ...config.partner_controls, [listKey]: next } })
  169 |   return next
  170 | }
  171 | 
  172 | async function updateMessages(messageId, patch) {
  173 |   let updated = null
  174 |   await updateJson('messages.json', (rows) => {
  175 |     const nextRows = Array.isArray(rows) ? rows : []
  176 |     const idx = nextRows.findIndex((row) => String(row.id) === String(messageId))
  177 |     if (idx < 0) {
  178 |       const err = new Error('Message not found')
  179 |       err.status = 404
  180 |       throw err
  181 |     }
  182 |     updated = { ...nextRows[idx], ...patch }
  183 |     nextRows[idx] = updated
  184 |     return nextRows
  185 |   })
  186 |   return updated
  187 | }
  188 | 
  189 | async function updateUsersBulk(updater) {
  190 |   const users = await readJson('users.json')
  191 |   const next = Array.isArray(users) ? users.map((user) => updater(user)) : []
  192 |   await writeJson('users.json', next)
  193 |   return next
  194 | }
  195 | 
  196 | async function broadcastNotification({ actor, title, message, roles, premiumOnly, verifiedOnly }) {
  197 |   const users = await listUsers()
  198 |   const roleSet = new Set((roles || []).map((r) => String(r).toLowerCase()))
  199 |   const filtered = users.filter((u) => {
  200 |     if (roleSet.size && !roleSet.has(String(u.role || '').toLowerCase())) return false
  201 |     if (premiumOnly && String(u.subscription_status || '').toLowerCase() !== 'premium') return false
  202 |     if (verifiedOnly && !u.verified) return false
  203 |     return true
  204 |   })
  205 | 
  206 |   const titleText = sanitizeString(title || 'System announcement', 160)
  207 |   const msg = sanitizeString(message || '', 240)
  208 |   if (!msg) {
  209 |     const err = new Error('message is required')
  210 |     err.status = 400
  211 |     throw err
  212 |   }
  213 | 
  214 |   await Promise.all(filtered.map((user) => createNotification(user.id, {
  215 |     type: 'system_announcement',
  216 |     entity_type: 'announcement',
  217 |     entity_id: crypto.randomUUID(),
  218 |     message: `${titleText}: ${msg}`,
  219 |     meta: {
  220 |       title: titleText,
  221 |       actor_id: actor.id,
  222 |       premium_only: premiumOnly,
  223 |       verified_only: verifiedOnly,
  224 |     },
  225 |   })))
  226 | 
  227 |   return { recipients: filtered.length }
  228 | }
  229 | 
  230 | export async function performAdminAction(action, payload = {}, actor) {
  231 |   const name = sanitizeString(String(action || ''), 80)
  232 |   if (!name) {
  233 |     const err = new Error('action is required')
  234 |     err.status = 400
  235 |     throw err
  236 |   }
  237 | 
  238 |   const admin = await resolveActor(actor)
  239 | 
  240 |   if (name === 'users.export_emails') {
  241 |     const users = await listUsers()
  242 |     const emails = users.map((u) => u.email).filter(Boolean)
  243 |     return { ok: true, count: emails.length, emails }
  244 |   }
  245 | 
  246 |   if (name === 'user.update') {
  247 |     const userId = toId(payload.user_id)
  248 |     if (!userId) {
  249 |       const err = new Error('user_id is required')
  250 |       err.status = 400
  251 |       throw err
  252 |     }
  253 |     const updated = await adminUpdateUser(userId, payload || {})
  254 |     if (!updated) {
  255 |       const err = new Error('User not found')
  256 |       err.status = 404
  257 |       throw err
  258 |     }
  259 |     return { ok: true, user: updated }
  260 |   }
  261 | 
  262 |   if (name === 'user.reset_password') {
  263 |     const userId = toId(payload.user_id)
  264 |     const newPassword = sanitizeString(String(payload.new_password || ''), 120)
  265 |     if (!userId || !newPassword) {
  266 |       const err = new Error('user_id and new_password are required')
  267 |       err.status = 400
  268 |       throw err
  269 |     }
  270 |     await adminSetPassword(userId, newPassword)
  271 |     return { ok: true }
  272 |   }
  273 | 
  274 |   if (name === 'user.force_logout') {
  275 |     const userId = toId(payload.user_id)
  276 |     if (!userId) {
  277 |       const err = new Error('user_id is required')
  278 |       err.status = 400
  279 |       throw err
  280 |     }
  281 |     await adminForceLogout(userId)
  282 |     return { ok: true }
  283 |   }
  284 | 
  285 |   if (name === 'user.lock_messaging') {
  286 |     const userId = toId(payload.user_id)
  287 |     const hours = toNumber(payload.lock_hours, 24)
  288 |     if (!userId) {
  289 |       const err = new Error('user_id is required')
  290 |       err.status = 400
  291 |       throw err
  292 |     }
  293 |     await adminLockMessaging(userId, hours)
  294 |     return { ok: true, lock_hours: hours }
  295 |   }
  296 | 
  297 |   if (name === 'org.transfer') {
  298 |     const fromOwner = toId(payload.from_owner_id)
  299 |     const toOwner = toId(payload.to_owner_id)
  300 |     if (!fromOwner || !toOwner) {
  301 |       const err = new Error('from_owner_id and to_owner_id are required')
  302 |       err.status = 400
  303 |       throw err
  304 |     }
  305 |     await ensureUserExists(toOwner)
  306 |     let moved = 0
  307 |     await updateUsersBulk((user) => {
  308 |       if (String(user.org_owner_id || '') === fromOwner) {
  309 |         moved += 1
  310 |         return { ...user, org_owner_id: toOwner, updated_at: new Date().toISOString() }
  311 |       }
  312 |       return user
  313 |     })
  314 |     return { ok: true, moved, from_owner_id: fromOwner, to_owner_id: toOwner }
  315 |   }
  316 | 
  317 |   if (name === 'org.merge') {
  318 |     const source = toId(payload.source_owner_id)
  319 |     const target = toId(payload.target_owner_id)
  320 |     const archiveSource = toBool(payload.archive_source)
  321 |     if (!source || !target) {
  322 |       const err = new Error('source_owner_id and target_owner_id are required')
  323 |       err.status = 400
  324 |       throw err
  325 |     }
  326 |     await ensureUserExists(target)
  327 |     let moved = 0
  328 |     await updateUsersBulk((user) => {
  329 |       if (String(user.org_owner_id || '') === source) {
  330 |         moved += 1
  331 |         return { ...user, org_owner_id: target, updated_at: new Date().toISOString() }
  332 |       }
  333 |       if (String(user.id) === source && archiveSource) {
  334 |         const profile = { ...(user.profile || {}), org_merged_into: target, org_merged_at: new Date().toISOString() }
  335 |         return { ...user, status: 'inactive', profile, updated_at: new Date().toISOString() }
  336 |       }
  337 |       return user
  338 |     })
  339 |     return { ok: true, moved, source_owner_id: source, target_owner_id: target }
  340 |   }
  341 | 
  342 |   if (name === 'org.split') {
  343 |     const orgOwnerId = toId(payload.org_owner_id)
  344 |     const newOwnerId = toId(payload.new_owner_id)
  345 |     const memberIds = parseCsvList(payload.member_ids || payload.members)
  346 |     if (!orgOwnerId || !newOwnerId || memberIds.length === 0) {
  347 |       const err = new Error('org_owner_id, new_owner_id and member_ids are required')
  348 |       err.status = 400
  349 |       throw err
  350 |     }
  351 |     await ensureUserExists(newOwnerId)
  352 |     let moved = 0
  353 |     await updateUsersBulk((user) => {
  354 |       if (memberIds.includes(String(user.id)) && String(user.org_owner_id || '') === orgOwnerId) {
  355 |         moved += 1
  356 |         return { ...user, org_owner_id: newOwnerId, updated_at: new Date().toISOString() }
  357 |       }
  358 |       return user
  359 |     })
  360 |     return { ok: true, moved, org_owner_id: orgOwnerId, new_owner_id: newOwnerId }
  361 |   }
  362 | 
  363 |   if (name === 'org.quota') {
  364 |     const orgOwnerId = toId(payload.org_owner_id)
  365 |     const key = sanitizeString(String(payload.key || ''), 80)
  366 |     const value = toNumber(payload.value)
  367 |     if (!orgOwnerId || !key) {
  368 |       const err = new Error('org_owner_id and key are required')
  369 |       err.status = 400
  370 |       throw err
  371 |     }
  372 |     const config = await getAdminConfig()
  373 |     const current = config?.org_quotas?.[orgOwnerId] || {}
  374 |     const next = { ...current, [key]: value }
  375 |     const updated = await updateAdminConfig({ org_quotas: { ...config.org_quotas, [orgOwnerId]: next } })
  376 |     return { ok: true, config: updated }
  377 |   }
  378 | 
  379 |   if (name === 'org.staff_limit') {
  380 |     const orgOwnerId = toId(payload.org_owner_id)
  381 |     const limit = toNumber(payload.limit, 0)
  382 |     if (!orgOwnerId || !limit) {
  383 |       const err = new Error('org_owner_id and limit are required')
  384 |       err.status = 400
  385 |       throw err
  386 |     }
  387 |     await updateLocalJson('org_admin_overrides.json', (current = {}) => {
  388 |       const staffLimits = current.staff_limits || {}
  389 |       return { ...current, staff_limits: { ...staffLimits, [orgOwnerId]: limit } }
  390 |     }, { staff_limits: {}, buying_house_staff_ids: [], permission_matrix: {} })
  391 |     return { ok: true, org_owner_id: orgOwnerId, staff_limit: limit }
  392 |   }
  393 | 
  394 |   if (name === 'org.buying_house_staff.add') {
  395 |     const orgOwnerId = toId(payload.org_owner_id)
  396 |     const staffId = toId(payload.staff_id || payload.member_id)
  397 |     if (!orgOwnerId || !staffId) {
  398 |       const err = new Error('org_owner_id and staff_id are required')
  399 |       err.status = 400
  400 |       throw err
  401 |     }
  402 |     await updateLocalJson('org_admin_overrides.json', (current = {}) => {
  403 |       const list = Array.isArray(current.buying_house_staff_ids) ? current.buying_house_staff_ids : []
  404 |       list.push({ id: crypto.randomUUID(), org_owner_id: orgOwnerId, staff_id: staffId, created_at: new Date().toISOString() })
  405 |       return { ...current, buying_house_staff_ids: list }
  406 |     }, { staff_limits: {}, buying_house_staff_ids: [], permission_matrix: {} })
  407 |     return { ok: true, org_owner_id: orgOwnerId, staff_id: staffId }
  408 |   }
  409 | 
  410 |   if (name === 'org.buying_house_staff.remove') {
  411 |     const staffId = toId(payload.staff_id || payload.member_id)
  412 |     if (!staffId) {
  413 |       const err = new Error('staff_id is required')
  414 |       err.status = 400
  415 |       throw err
  416 |     }
  417 |     await updateLocalJson('org_admin_overrides.json', (current = {}) => {
  418 |       const list = Array.isArray(current.buying_house_staff_ids) ? current.buying_house_staff_ids : []
  419 |       return { ...current, buying_house_staff_ids: list.filter((row) => String(row.staff_id) !== String(staffId)) }
  420 |     }, { staff_limits: {}, buying_house_staff_ids: [], permission_matrix: {} })
  421 |     return { ok: true, staff_id: staffId }
  422 |   }
  423 | 
  424 |   if (name === 'org.permission_matrix') {
  425 |     const orgOwnerId = toId(payload.org_owner_id)
  426 |     const matrix = parseJson(payload.permission_matrix || payload.matrix)
  427 |     if (!orgOwnerId || !matrix) {
  428 |       const err = new Error('org_owner_id and permission_matrix are required')
  429 |       err.status = 400
  430 |       throw err
  431 |     }
  432 |     await updateLocalJson('org_admin_overrides.json', (current = {}) => {
  433 |       const nextMatrix = { ...(current.permission_matrix || {}), [orgOwnerId]: matrix }
  434 |       return { ...current, permission_matrix: nextMatrix }
  435 |     }, { staff_limits: {}, buying_house_staff_ids: [], permission_matrix: {} })
  436 |     return { ok: true, org_owner_id: orgOwnerId, permission_matrix: matrix }
  437 |   }
  438 | 
  439 |   if (name === 'agent.create') {
  440 |     const orgOwnerId = toId(payload.org_owner_id)
  441 |     if (!orgOwnerId) {
  442 |       const err = new Error('org_owner_id is required')
  443 |       err.status = 400
  444 |       throw err
  445 |     }
  446 |     const payloadOut = {
  447 |       name: payload.name,
  448 |       username: payload.username,
  449 |       member_id: payload.member_id,
  450 |       email: payload.email,
  451 |       permissions: parseCsvList(payload.permissions),
  452 |       permission_matrix: parseJson(payload.permission_matrix || payload.permission_matrix_json),
  453 |       status: payload.status,
  454 |       password: payload.password,
  455 |     }
  456 |     const created = await createMember(orgOwnerId, payloadOut)
  457 |     return { ok: true, member: created }
  458 |   }
  459 | 
  460 |   if (name === 'agent.deactivate' || name === 'agent.remove') {
  461 |     const orgOwnerId = toId(payload.org_owner_id)
  462 |     const memberId = toId(payload.member_id)
  463 |     if (!orgOwnerId || !memberId) {
  464 |       const err = new Error('org_owner_id and member_id are required')
  465 |       err.status = 400
  466 |       throw err
  467 |     }
  468 |     const result = await deactivateOrRemoveMember(orgOwnerId, memberId, name === 'agent.remove' ? 'remove' : 'deactivate')
  469 |     if (!result) {
  470 |       const err = new Error('Member not found')
  471 |       err.status = 404
  472 |       throw err
  473 |     }
  474 |     return { ok: true, ...result }
  475 |   }
  476 | 
  477 |   if (name === 'agent.activate') {
  478 |     const orgOwnerId = toId(payload.org_owner_id)
  479 |     const memberId = toId(payload.member_id)
  480 |     if (!orgOwnerId || !memberId) {
  481 |       const err = new Error('org_owner_id and member_id are required')
  482 |       err.status = 400
  483 |       throw err
  484 |     }
  485 |     const updated = await updateMember(orgOwnerId, memberId, { status: 'active' })
  486 |     if (!updated) {
  487 |       const err = new Error('Member not found')
  488 |       err.status = 404
  489 |       throw err
  490 |     }
  491 |     return { ok: true, member: updated }
  492 |   }
  493 | 
  494 |   if (name === 'agent.reset_password') {
  495 |     const orgOwnerId = toId(payload.org_owner_id)
  496 |     const memberId = toId(payload.member_id)
  497 |     if (!orgOwnerId || !memberId) {
  498 |       const err = new Error('org_owner_id and member_id are required')
  499 |       err.status = 400
  500 |       throw err
  501 |     }
  502 |     const result = await resetMemberPassword(orgOwnerId, memberId)
  503 |     if (!result) {
  504 |       const err = new Error('Member not found')
  505 |       err.status = 404
  506 |       throw err
  507 |     }
  508 |     return { ok: true, ...result }
  509 |   }
  510 | 
  511 |   if (name === 'agent.permissions') {
  512 |     const orgOwnerId = toId(payload.org_owner_id)
  513 |     const memberId = toId(payload.member_id)
  514 |     if (!orgOwnerId || !memberId) {
  515 |       const err = new Error('org_owner_id and member_id are required')
  516 |       err.status = 400
  517 |       throw err
  518 |     }
  519 |     const permissions = parseCsvList(payload.permissions)
  520 |     const matrix = parseJson(payload.permission_matrix || payload.permission_matrix_json)
  521 |     const updated = await updateMemberPermissions(orgOwnerId, memberId, permissions, matrix)
  522 |     if (!updated) {
  523 |       const err = new Error('Member not found')
  524 |       err.status = 404
  525 |       throw err
  526 |     }
  527 |     return { ok: true, member: updated }
  528 |   }
  529 | 
  530 |   if (name === 'verification.approve') {
  531 |     const userId = toId(payload.user_id)
  532 |     if (!userId) {
  533 |       const err = new Error('user_id is required')
  534 |       err.status = 400
  535 |       throw err
  536 |     }
  537 |     const record = await adminApproveVerification(userId)
  538 |     if (!record) {
  539 |       const err = new Error('Verification record not found')
  540 |       err.status = 404
  541 |       throw err
  542 |     }
  543 |     await setUserVerification(userId, Boolean(record.verified))
  544 |     await createNotification(userId, {
  545 |       type: record.verified ? 'verification_approved' : 'verification_pending',
  546 |       entity_type: 'verification',
  547 |       entity_id: userId,
  548 |       message: record.verified
  549 |         ? 'Your verification was approved.'
  550 |         : 'Verification requires additional steps (missing documents or premium subscription).',
  551 |       meta: {
  552 |         review_status: record.review_status,
  553 |         reason: record.review_reason,
  554 |       },
  555 |     })
  556 |     await appendLocalRecord('verification_badge_audit.json', {
  557 |       user_id: userId,
  558 |       action: record.verified ? 'approved' : 'pending',
  559 |       reason: record.review_reason || '',
  560 |       actor_id: admin.id,
  561 |       at: new Date().toISOString(),
  562 |     })
  563 |     return { ok: true, record }
  564 |   }
  565 | 
  566 |   if (name === 'verification.reject') {
  567 |     const userId = toId(payload.user_id)
  568 |     const reason = sanitizeString(String(payload.reason || 'rejected_by_admin'), 240)
  569 |     if (!userId) {
  570 |       const err = new Error('user_id is required')
  571 |       err.status = 400
  572 |       throw err
  573 |     }
  574 |     const record = await adminRejectVerification(userId, reason)
  575 |     if (!record) {
  576 |       const err = new Error('Verification record not found')
  577 |       err.status = 404
  578 |       throw err
  579 |     }
  580 |     await setUserVerification(userId, false)
  581 |     await createNotification(userId, {
  582 |       type: 'verification_rejected',
  583 |       entity_type: 'verification',
  584 |       entity_id: userId,
  585 |       message: `Verification rejected: ${reason}`,
  586 |       meta: { reason },
  587 |     })
  588 |     await appendLocalRecord('verification_badge_audit.json', {
  589 |       user_id: userId,
  590 |       action: 'rejected',
  591 |       reason,
  592 |       actor_id: admin.id,
  593 |       at: new Date().toISOString(),
  594 |     })
  595 |     return { ok: true, record }
  596 |   }
  597 | 
  598 |   if (name === 'verification.remind_expiring') {
  599 |     const threshold = payload.threshold_days !== undefined ? Math.max(1, toNumber(payload.threshold_days, 7)) : 7
  600 |     const expiring = await listExpiringVerifications(threshold)
  601 |     await Promise.all(expiring.map((rec) => createNotification(rec.user_id, {
  602 |       type: 'verification_expiring',
  603 |       entity_type: 'verification',
  604 |       entity_id: rec.user_id,
  605 |       message: `Your verification expires in ${rec.subscription_remaining_days || threshold} day(s). Renew premium to keep your badge active.`,
  606 |       meta: { remaining_days: rec.subscription_remaining_days || threshold },
  607 |     })))
  608 |     return { ok: true, count: expiring.length }
  609 |   }
  610 | 
  611 |   if (name === 'verification.revoke_expired') {
  612 |     const before = await readJson('verification.json')
  613 |     const updated = await revokeExpiredVerifications()
  614 |     const revokedIds = (Array.isArray(before) ? before : [])
  615 |       .filter((rec) => rec.verified && !updated.find((row) => row.user_id === rec.user_id && row.verified))
  616 |       .map((rec) => rec.user_id)
  617 |     await Promise.all(revokedIds.map((userId) => createNotification(userId, {
  618 |       type: 'verification_expired',
  619 |       entity_type: 'verification',
  620 |       entity_id: userId,
  621 |       message: 'Verification expired because the premium subscription ended.',
  622 |       meta: { reason: 'subscription_expired' },
  623 |     })))
  624 |     return { ok: true, revoked: revokedIds.length }
  625 |   }
  626 | 
  627 |   if (name === 'verification.doc.review') {
  628 |     const docId = toId(payload.doc_id || payload.document_id)
  629 |     const status = sanitizeString(String(payload.status || 'approved'), 40)
  630 |     if (!docId) {
  631 |       const err = new Error('doc_id is required')
  632 |       err.status = 400
  633 |       throw err
  634 |     }
  635 |     let updated = null
  636 |     await updateLocalJson('verification_docs.json', (rows = []) => {
  637 |       const next = Array.isArray(rows) ? rows : []
  638 |       const idx = next.findIndex((row) => String(row.id) === String(docId))
  639 |       const entry = {
  640 |         id: docId,
  641 |         status,
  642 |         review_reason: sanitizeString(String(payload.reason || ''), 200),
  643 |         reviewed_at: new Date().toISOString(),
  644 |         reviewer_id: admin.id,
  645 |       }
  646 |       if (idx < 0) {
  647 |         next.push(entry)
  648 |         updated = entry
  649 |       } else {
  650 |         updated = { ...next[idx], ...entry }
  651 |         next[idx] = updated
  652 |       }
  653 |       return next
  654 |     }, [])
  655 |     return { ok: true, document: updated }
  656 |   }
  657 | 
  658 |   if (name === 'verification.fraud.flag') {
  659 |     const userId = toId(payload.user_id)
  660 |     const reason = sanitizeString(String(payload.reason || 'fraud_flag'), 200)
  661 |     if (!userId) {
  662 |       const err = new Error('user_id is required')
  663 |       err.status = 400
  664 |       throw err
  665 |     }
  666 |     let updatedRecord = null
  667 |     await updateJson('verification.json', (rows) => {
  668 |       const next = Array.isArray(rows) ? rows : []
  669 |       const idx = next.findIndex((row) => String(row.user_id) === String(userId))
  670 |       if (idx < 0) {
  671 |         const err = new Error('Verification record not found')
  672 |         err.status = 404
  673 |         throw err
  674 |       }
  675 |       updatedRecord = { ...next[idx], fraud_flag: true, fraud_reason: reason, updated_at: new Date().toISOString() }
  676 |       next[idx] = updatedRecord
  677 |       return next
  678 |     })
  679 |     await appendLocalRecord('verification_badge_audit.json', {
  680 |       user_id: userId,
  681 |       action: 'fraud_flag',
  682 |       reason,
  683 |       actor_id: admin.id,
  684 |       at: new Date().toISOString(),
  685 |     })
  686 |     return { ok: true, record: updatedRecord }
  687 |   }
  688 | 
  689 |   if (name === 'verification.badge.revoke') {
  690 |     const userId = toId(payload.user_id)
  691 |     if (!userId) {
  692 |       const err = new Error('user_id is required')
  693 |       err.status = 400
  694 |       throw err
  695 |     }
  696 |     let updatedRecord = null
  697 |     await updateJson('verification.json', (rows) => {
  698 |       const next = Array.isArray(rows) ? rows : []
  699 |       const idx = next.findIndex((row) => String(row.user_id) === String(userId))
  700 |       if (idx < 0) {
  701 |         const err = new Error('Verification record not found')
  702 |         err.status = 404
  703 |         throw err
  704 |       }
  705 |       updatedRecord = { ...next[idx], verified: false, review_status: 'revoked', updated_at: new Date().toISOString() }
  706 |       next[idx] = updatedRecord
  707 |       return next
  708 |     })
  709 |     await setUserVerification(userId, false)
  710 |     await appendLocalRecord('verification_badge_audit.json', {
  711 |       user_id: userId,
  712 |       action: 'revoked',
  713 |       reason: sanitizeString(String(payload.reason || 'revoked_by_admin'), 200),
  714 |       actor_id: admin.id,
  715 |       at: new Date().toISOString(),
  716 |     })
  717 |     return { ok: true, record: updatedRecord }
  718 |   }
  719 | 
  720 |   if (name === 'subscription.set_plan') {
  721 |     const userId = toId(payload.user_id)
  722 |     const plan = sanitizeString(String(payload.plan || 'free'), 20).toLowerCase()
  723 |     if (!userId) {
  724 |       const err = new Error('user_id is required')
  725 |       err.status = 400
  726 |       throw err
  727 |     }
  728 |     await setUserSubscriptionStatus(userId, plan)
  729 |     const sub = await upsertSubscription(userId, plan, toBool(payload.auto_renew), {
  730 |       actor_id: admin.id,
  731 |       source: 'admin_action',
  732 |       note: `set_plan:${plan}`,
  733 |     })
  734 |     if (plan === 'premium') {
  735 |       await extendVerificationSubscription(userId, 30)
  736 |     } else {
  737 |       await setVerificationSubscription(userId, '')
  738 |     }
  739 |     return { ok: true, subscription: sub }
  740 |   }
  741 | 
  742 |   if (name === 'subscription.renew') {
  743 |     const userId = toId(payload.user_id)
  744 |     if (!userId) {
  745 |       const err = new Error('user_id is required')
  746 |       err.status = 400
  747 |       throw err
  748 |     }
  749 |     await setUserSubscriptionStatus(userId, 'premium')
  750 |     const sub = await renewPremiumMonthly(userId, toBool(payload.auto_renew), {
  751 |       actor_id: admin.id,
  752 |       source: 'admin_action',
  753 |       note: 'manual_renew',
  754 |     })
  755 |     await extendVerificationSubscription(userId, 30)
  756 |     return { ok: true, subscription: sub }
  757 |   }
  758 | 
  759 |   if (name === 'finance.invoice.add') {
  760 |     const invoice = {
  761 |       id: crypto.randomUUID(),
  762 |       user_id: toId(payload.user_id),
  763 |       amount_usd: toNumber(payload.amount_usd),
  764 |       status: sanitizeString(String(payload.status || 'issued'), 40),
  765 |       created_at: new Date().toISOString(),
  766 |       note: sanitizeString(String(payload.note || ''), 200),
  767 |     }
  768 |     await appendLocalRecord('invoice_log.json', invoice)
  769 |     return { ok: true, invoice }
  770 |   }
  771 | 
  772 |   if (name === 'finance.payout.add') {
  773 |     const payout = {
  774 |       id: crypto.randomUUID(),
  775 |       user_id: toId(payload.user_id),
  776 |       amount_usd: toNumber(payload.amount_usd),
  777 |       status: sanitizeString(String(payload.status || 'queued'), 40),
  778 |       created_at: new Date().toISOString(),
  779 |       note: sanitizeString(String(payload.note || ''), 200),
  780 |     }
  781 |     await appendLocalRecord('payout_ledger.json', payout)
  782 |     return { ok: true, payout }
  783 |   }
  784 | 
  785 |   if (name === 'wallet.credit') {
  786 |     const userId = toId(payload.user_id)
  787 |     const amount = toNumber(payload.amount_usd)
  788 |     if (!userId || !amount) {
  789 |       const err = new Error('user_id and amount_usd are required')
  790 |       err.status = 400
  791 |       throw err
  792 |     }
  793 |     const result = await creditWallet({
  794 |       userId,
  795 |       amountUsd: amount,
  796 |       reason: sanitizeString(String(payload.reason || 'manual_credit'), 80),
  797 |       ref: sanitizeString(String(payload.ref || ''), 160),
  798 |       restricted: toBool(payload.restricted),
  799 |       metadata: payload?.metadata && typeof payload.metadata === 'object' ? payload.metadata : {},
  800 |     })
  801 |     return { ok: true, ...result }
  802 |   }
  803 | 
  804 |   if (name === 'wallet.debit') {
  805 |     const userId = toId(payload.user_id)
  806 |     const amount = toNumber(payload.amount_usd)
  807 |     if (!userId || !amount) {
  808 |       const err = new Error('user_id and amount_usd are required')
  809 |       err.status = 400
  810 |       throw err
  811 |     }
  812 |     const result = await debitWallet({
  813 |       userId,
  814 |       amountUsd: amount,
  815 |       reason: sanitizeString(String(payload.reason || 'manual_debit'), 80),
  816 |       ref: sanitizeString(String(payload.ref || ''), 160),
  817 |       allowRestricted: toBool(payload.allow_restricted),
  818 |       metadata: payload?.metadata && typeof payload.metadata === 'object' ? payload.metadata : {},
  819 |     })
  820 |     return { ok: true, ...result }
  821 |   }
  822 | 
  823 |   if (name === 'wallet.refund') {
  824 |     const userId = toId(payload.user_id)
  825 |     const amount = toNumber(payload.amount_usd)
  826 |     if (!userId || !amount) {
  827 |       const err = new Error('user_id and amount_usd are required')
  828 |       err.status = 400
  829 |       throw err
  830 |     }
  831 |     const reason = sanitizeString(String(payload.reason || 'refund'), 120)
  832 |     const ref = sanitizeString(String(payload.ref || ''), 160)
  833 |     const result = await creditWallet({
  834 |       userId,
  835 |       amountUsd: amount,
  836 |       reason,
  837 |       ref,
  838 |       restricted: false,
  839 |       metadata: { refund: true, admin_id: admin.id },
  840 |     })
  841 |     const refund = await recordRefund({ userId, amountUsd: amount, reason, ref, actorId: admin.id })
  842 |     return { ok: true, refund, ...result }
  843 |   }
  844 | 
  845 |   if (name === 'wallet.auto_credit') {
  846 |     const enabled = toBool(payload.enabled)
  847 |     const config = await updateAdminConfig({ feature_flags: { auto_credit: enabled } })
  848 |     return { ok: true, config }
  849 |   }
  850 | 
  851 |   if (name === 'coupon.create') {
  852 |     const created = await createCouponCode(payload || {})
  853 |     return { ok: true, coupon: created }
  854 |   }
  855 | 
  856 |   if (name === 'coupon.disable') {
  857 |     const updated = await updateCouponsByKey({ codeOrId: payload.code || payload.coupon_id || payload.id, patch: { active: false } })
  858 |     return { ok: true, coupon: updated }
  859 |   }
  860 | 
  861 |   if (name === 'coupon.expire') {
  862 |     const expiresAt = payload.expires_at ? new Date(payload.expires_at).toISOString() : new Date().toISOString()
  863 |     const updated = await updateCouponsByKey({ codeOrId: payload.code || payload.coupon_id || payload.id, patch: { active: false, expires_at: expiresAt } })
  864 |     return { ok: true, coupon: updated }
  865 |   }
  866 | 
  867 |   if (name === 'coupon.redemption.add') {
  868 |     const codeId = toId(payload.code_id || payload.coupon_id)
  869 |     const userId = toId(payload.user_id)
  870 |     const amount = toNumber(payload.amount_usd)
  871 |     if (!codeId || !userId) {
  872 |       const err = new Error('code_id and user_id are required')
  873 |       err.status = 400
  874 |       throw err
  875 |     }
  876 |     const redemption = {
  877 |       id: crypto.randomUUID(),
  878 |       code_id: codeId,
  879 |       user_id: userId,
  880 |       amount_usd: amount,
  881 |       created_at: new Date().toISOString(),
  882 |     }
  883 |     await updateJson('coupon_redemptions.json', (rows) => {
  884 |       const next = Array.isArray(rows) ? rows : []
  885 |       next.push(redemption)
  886 |       return next
  887 |     })
  888 |     return { ok: true, redemption }
  889 |   }
  890 | 
  891 |   if (name === 'coupon.campaign.add') {
  892 |     const campaign = {
  893 |       id: crypto.randomUUID(),
  894 |       name: sanitizeString(String(payload.name || 'campaign'), 80),
  895 |       type: sanitizeString(String(payload.type || 'general'), 40),
  896 |       status: sanitizeString(String(payload.status || 'active'), 40),
  897 |       created_at: new Date().toISOString(),
  898 |     }
  899 |     await appendLocalRecord('coupon_campaigns.json', campaign)
  900 |     return { ok: true, campaign }
  901 |   }
  902 | 
  903 |   if (name === 'coupon.campaign.disable') {
  904 |     const campaignId = toId(payload.campaign_id || payload.id)
  905 |     const updated = await updateLocalRecord('coupon_campaigns.json', campaignId, { status: 'disabled' })
  906 |     return { ok: true, campaign: updated }
  907 |   }
  908 | 
  909 |   if (name === 'partner.force_accept' || name === 'partner.force_reject' || name === 'partner.force_cancel') {
  910 |     const requestId = toId(payload.request_id)
  911 |     if (!requestId) {
  912 |       const err = new Error('request_id is required')
  913 |       err.status = 400
  914 |       throw err
  915 |     }
  916 |     const actionVerb = name === 'partner.force_accept' ? 'accept' : name === 'partner.force_reject' ? 'reject' : 'cancel'
  917 |     const updated = await updatePartnerRequestStatus(admin, requestId, actionVerb)
  918 |     return { ok: true, request: updated }
  919 |   }
  920 | 
  921 |   if (name === 'partner.blacklist.add') {
  922 |     const entry = toId(payload.entry_id || payload.user_id || payload.org_id)
  923 |     if (!entry) {
  924 |       const err = new Error('entry_id is required')
  925 |       err.status = 400
  926 |       throw err
  927 |     }
  928 |     const list = await addPartnerListEntry('blacklist', entry)
  929 |     return { ok: true, blacklist: list }
  930 |   }
  931 | 
  932 |   if (name === 'partner.blacklist.remove') {
  933 |     const entry = toId(payload.entry_id || payload.user_id || payload.org_id)
  934 |     if (!entry) {
  935 |       const err = new Error('entry_id is required')
  936 |       err.status = 400
  937 |       throw err
  938 |     }
  939 |     const list = await removePartnerListEntry('blacklist', entry)
  940 |     return { ok: true, blacklist: list }
  941 |   }
  942 | 
  943 |   if (name === 'partner.whitelist.add') {
  944 |     const entry = toId(payload.entry_id || payload.user_id || payload.org_id)
  945 |     if (!entry) {
  946 |       const err = new Error('entry_id is required')
  947 |       err.status = 400
  948 |       throw err
  949 |     }
  950 |     const list = await addPartnerListEntry('whitelist', entry)
  951 |     return { ok: true, whitelist: list }
  952 |   }
  953 | 
  954 |   if (name === 'partner.whitelist.remove') {
  955 |     const entry = toId(payload.entry_id || payload.user_id || payload.org_id)
  956 |     if (!entry) {
  957 |       const err = new Error('entry_id is required')
  958 |       err.status = 400
  959 |       throw err
  960 |     }
  961 |     const list = await removePartnerListEntry('whitelist', entry)
  962 |     return { ok: true, whitelist: list }
  963 |   }
  964 | 
  965 |   if (name === 'partner.free_tier_limit') {
  966 |     const limit = toNumber(payload.limit, 5)
  967 |     const config = await updateAdminConfig({ plan_limits: { free: { partner_limit: limit } } })
  968 |     return { ok: true, config }
  969 |   }
  970 | 
  971 |   if (name === 'partner.enforce_free_tier') {
  972 |     const result = await enforcePartnerFreeTierLimits()
  973 |     return { ok: true, ...result }
  974 |   }
  975 | 
  976 |   if (name === 'partner.override') {
  977 |     const requestId = toId(payload.request_id)
  978 |     const action = sanitizeString(String(payload.override_action || payload.action || 'override'), 80)
  979 |     if (!requestId) {
  980 |       const err = new Error('request_id is required')
  981 |       err.status = 400
  982 |       throw err
  983 |     }
  984 |     const entry = await appendLocalRecord('partner_overrides.json', {
  985 |       request_id: requestId,
  986 |       action,
  987 |       note: sanitizeString(String(payload.note || ''), 200),
  988 |       actor_id: admin.id,
  989 |     })
  990 |     return { ok: true, override: entry }
  991 |   }
  992 | 
  993 |   if (name === 'partner.connect') {
  994 |     const requestId = toId(payload.request_id)
  995 |     if (!requestId) {
  996 |       const err = new Error('request_id is required')
  997 |       err.status = 400
  998 |       throw err
  999 |     }
 1000 |     let updatedRow = null
 1001 |     await updateJson('partner_requests.json', (rows) => {
 1002 |       const next = Array.isArray(rows) ? rows : []
 1003 |       const idx = next.findIndex((row) => String(row.id) === requestId)
 1004 |       if (idx < 0) {
 1005 |         const err = new Error('Partner request not found')
 1006 |         err.status = 404
 1007 |         throw err
 1008 |       }
 1009 |       updatedRow = { ...next[idx], status: 'connected', updated_at: new Date().toISOString() }
 1010 |       next[idx] = updatedRow
 1011 |       return next
 1012 |     })
 1013 |     return { ok: true, request: updatedRow }
 1014 |   }
 1015 | 
 1016 |   if (name === 'request.status') {
 1017 |     const requirementId = toId(payload.requirement_id)
 1018 |     const status = sanitizeString(String(payload.status || ''), 40)
 1019 |     if (!requirementId || !status) {
 1020 |       const err = new Error('requirement_id and status are required')
 1021 |       err.status = 400
 1022 |       throw err
 1023 |     }
 1024 |     const updated = await updateRequirement(requirementId, { status }, admin)
 1025 |     if (!updated) {
 1026 |       const err = new Error('Request not found')
 1027 |       err.status = 404
 1028 |       throw err
 1029 |     }
 1030 |     return { ok: true, request: updated }
 1031 |   }
 1032 | 
 1033 |   if (name === 'request.verified_only') {
 1034 |     const requirementId = toId(payload.requirement_id)
 1035 |     const verifiedOnly = toBool(payload.verified_only)
 1036 |     if (!requirementId) {
 1037 |       const err = new Error('requirement_id is required')
 1038 |       err.status = 400
 1039 |       throw err
 1040 |     }
 1041 |     const updated = await updateRequirement(requirementId, { verified_only: verifiedOnly }, admin)
 1042 |     if (!updated) {
 1043 |       const err = new Error('Request not found')
 1044 |       err.status = 404
 1045 |       throw err
 1046 |     }
 1047 |     return { ok: true, request: updated }
 1048 |   }
 1049 | 
 1050 |   if (name === 'request.expiry_override') {
 1051 |     const requirementId = toId(payload.requirement_id)
 1052 |     const expiresAt = payload.expires_at ? new Date(payload.expires_at).toISOString() : null
 1053 |     if (!requirementId || !expiresAt) {
 1054 |       const err = new Error('requirement_id and expires_at are required')
 1055 |       err.status = 400
 1056 |       throw err
 1057 |     }
 1058 |     const updated = await updateRequirement(requirementId, { expires_at: expiresAt }, admin)
 1059 |     if (!updated) {
 1060 |       const err = new Error('Request not found')
 1061 |       err.status = 404
 1062 |       throw err
 1063 |     }
 1064 |     return { ok: true, request: updated }
 1065 |   }
 1066 | 
 1067 |   if (name === 'match.quality.update') {
 1068 |     const matchId = toId(payload.match_id || payload.id)
 1069 |     const score = toNumber(payload.score, 0)
 1070 |     if (!matchId) {
 1071 |       const err = new Error('match_id is required')
 1072 |       err.status = 400
 1073 |       throw err
 1074 |     }
 1075 |     const entry = await appendLocalRecord('match_quality.json', {
 1076 |       match_id: matchId,
 1077 |       score,
 1078 |       note: sanitizeString(String(payload.note || ''), 200),
 1079 |       actor_id: admin.id,
 1080 |     })
 1081 |     return { ok: true, match_quality: entry }
 1082 |   }
 1083 | 
 1084 |   if (name === 'request.spam.filter.add') {
 1085 |     const pattern = sanitizeString(String(payload.pattern || ''), 120)
 1086 |     if (!pattern) {
 1087 |       const err = new Error('pattern is required')
 1088 |       err.status = 400
 1089 |       throw err
 1090 |     }
 1091 |     const entry = await appendLocalRecord('spam_filters.json', {
 1092 |       pattern,
 1093 |       action: sanitizeString(String(payload.action || 'flag'), 40),
 1094 |       created_by: admin.id,
 1095 |     })
 1096 |     return { ok: true, filter: entry }
 1097 |   }
 1098 | 
 1099 |   if (name === 'request.spam.filter.remove') {
 1100 |     const filterId = toId(payload.filter_id || payload.id)
 1101 |     if (!filterId) {
 1102 |       const err = new Error('filter_id is required')
 1103 |       err.status = 400
 1104 |       throw err
 1105 |     }
 1106 |     await removeLocalRecord('spam_filters.json', filterId)
 1107 |     return { ok: true }
 1108 |   }
 1109 | 
 1110 |   if (name === 'request.spam.flag') {
 1111 |     const requirementId = toId(payload.requirement_id || payload.request_id)
 1112 |     if (!requirementId) {
 1113 |       const err = new Error('requirement_id is required')
 1114 |       err.status = 400
 1115 |       throw err
 1116 |     }
 1117 |     const entry = await appendLocalRecord('spam_flags.json', {
 1118 |       entity_type: 'request',
 1119 |       entity_id: requirementId,
 1120 |       reason: sanitizeString(String(payload.reason || 'spam'), 200),
 1121 |       actor_id: admin.id,
 1122 |     })
 1123 |     return { ok: true, flag: entry }
 1124 |   }
 1125 | 
 1126 |   if (name === 'contract.lock' || name === 'contract.unlock' || name === 'contract.archive' || name === 'contract.unarchive') {
 1127 |     const contractId = toId(payload.contract_id)
 1128 |     if (!contractId) {
 1129 |       const err = new Error('contract_id is required')
 1130 |       err.status = 400
 1131 |       throw err
 1132 |     }
 1133 |     const status = name === 'contract.lock'
 1134 |       ? 'locked'
 1135 |       : name === 'contract.archive'
 1136 |         ? 'archived'
 1137 |         : 'generated'
 1138 |     const updated = await updateContractArtifact(contractId, { status }, admin)
 1139 |     if (!updated) {
 1140 |       const err = new Error('Contract not found')
 1141 |       err.status = 404
 1142 |       throw err
 1143 |     }
 1144 |     await appendLocalRecord('contract_audit.json', {
 1145 |       contract_id: contractId,
 1146 |       action: name,
 1147 |       actor_id: admin.id,
 1148 |       at: new Date().toISOString(),
 1149 |     })
 1150 |     return { ok: true, contract: updated }
 1151 |   }
 1152 | 
 1153 |   if (name === 'contract.signatures') {
 1154 |     const contractId = toId(payload.contract_id)
 1155 |     if (!contractId) {
 1156 |       const err = new Error('contract_id is required')
 1157 |       err.status = 400
 1158 |       throw err
 1159 |     }
 1160 |     const patch = {
 1161 |       buyer_signature_state: payload.buyer_signature_state,
 1162 |       factory_signature_state: payload.factory_signature_state,
 1163 |       is_draft: payload.is_draft !== undefined ? toBool(payload.is_draft) : undefined,
 1164 |     }
 1165 |     const updated = await updateContractSignatures(contractId, patch, admin)
 1166 |     if (!updated) {
 1167 |       const err = new Error('Contract not found')
 1168 |       err.status = 404
 1169 |       throw err
 1170 |     }
 1171 |     await appendLocalRecord('contract_audit.json', {
 1172 |       contract_id: contractId,
 1173 |       action: 'contract.signatures',
 1174 |       actor_id: admin.id,
 1175 |       at: new Date().toISOString(),
 1176 |       note: sanitizeString(String(payload.note || ''), 200),
 1177 |     })
 1178 |     return { ok: true, contract: updated }
 1179 |   }
 1180 | 
 1181 |   if (name === 'payment_proof.review') {
 1182 |     const proofId = toId(payload.proof_id)
 1183 |     if (!proofId) {
 1184 |       const err = new Error('proof_id is required')
 1185 |       err.status = 400
 1186 |       throw err
 1187 |     }
 1188 |     const updated = await updatePaymentProof(admin, proofId, {
 1189 |       status: payload.status,
 1190 |       review_reason: payload.review_reason,
 1191 |     })
 1192 |     if (!updated) {
 1193 |       const err = new Error('Payment proof not found')
 1194 |       err.status = 404
 1195 |       throw err
 1196 |     }
 1197 |     return { ok: true, payment_proof: updated }
 1198 |   }
 1199 | 
 1200 |   if (name === 'contract.audit.export') {
 1201 |     const contractId = toId(payload.contract_id)
 1202 |     if (!contractId) {
 1203 |       const err = new Error('contract_id is required')
 1204 |       err.status = 400
 1205 |       throw err
 1206 |     }
 1207 |     const entry = await appendLocalRecord('contract_audit.json', {
 1208 |       contract_id: contractId,
 1209 |       action: 'export',
 1210 |       actor_id: admin.id,
 1211 |       note: sanitizeString(String(payload.note || ''), 200),
 1212 |       at: new Date().toISOString(),
 1213 |     })
 1214 |     return { ok: true, export: entry }
 1215 |   }
 1216 | 
 1217 |   if (name === 'contract.audit.note') {
 1218 |     const contractId = toId(payload.contract_id)
 1219 |     if (!contractId) {
 1220 |       const err = new Error('contract_id is required')
 1221 |       err.status = 400
 1222 |       throw err
 1223 |     }
 1224 |     const entry = await appendLocalRecord('contract_audit.json', {
 1225 |       contract_id: contractId,
 1226 |       action: 'note',
 1227 |       actor_id: admin.id,
 1228 |       note: sanitizeString(String(payload.note || ''), 200),
 1229 |       at: new Date().toISOString(),
 1230 |     })
 1231 |     return { ok: true, audit: entry }
 1232 |   }
 1233 | 
 1234 |   if (name === 'dispute.open') {
 1235 |     const contractId = toId(payload.contract_id)
 1236 |     const reason = sanitizeString(String(payload.reason || ''), 400)
 1237 |     if (!contractId || !reason) {
 1238 |       const err = new Error('contract_id and reason are required')
 1239 |       err.status = 400
 1240 |       throw err
 1241 |     }
 1242 |     const report = await createReport({
 1243 |       actor: admin,
 1244 |       entity_type: 'contract_dispute',
 1245 |       entity_id: contractId,
 1246 |       reason,
 1247 |       metadata: payload?.metadata && typeof payload.metadata === 'object' ? payload.metadata : {},
 1248 |     })
 1249 |     return { ok: true, dispute: report }
 1250 |   }
 1251 | 
 1252 |   if (name === 'dispute.resolve') {
 1253 |     const reportId = toId(payload.report_id)
 1254 |     if (!reportId) {
 1255 |       const err = new Error('report_id is required')
 1256 |       err.status = 400
 1257 |       throw err
 1258 |     }
 1259 |     const resolved = await resolveReport(reportId, admin, {
 1260 |       action: payload.resolution_action,
 1261 |       note: payload.resolution_note,
 1262 |     })
 1263 |     if (!resolved) {
 1264 |       const err = new Error('Report not found')
 1265 |       err.status = 404
 1266 |       throw err
 1267 |     }
 1268 |     return { ok: true, dispute: resolved }
 1269 |   }
 1270 | 
 1271 |   if (name === 'call.recording') {
 1272 |     const callId = toId(payload.call_id)
 1273 |     if (!callId) {
 1274 |       const err = new Error('call_id is required')
 1275 |       err.status = 400
 1276 |       throw err
 1277 |     }
 1278 |     const calls = await readJson('call_sessions.json')
 1279 |     const call = Array.isArray(calls) ? calls.find((row) => String(row.id) === String(callId)) : null
 1280 |     if (!call) {
 1281 |       const err = new Error('Call not found')
 1282 |       err.status = 404
 1283 |       throw err
 1284 |     }
 1285 |     const result = await markRecording(callId, call.created_by || admin.id, {
 1286 |       recording_status: payload.recording_status,
 1287 |       recording_url: payload.recording_url,
 1288 |       failure_reason: payload.failure_reason,
 1289 |     })
 1290 |     if (!result || result === 'forbidden') {
 1291 |       const err = new Error('Recording update failed')
 1292 |       err.status = 400
 1293 |       throw err
 1294 |     }
 1295 |     return { ok: true, call: result }
 1296 |   }
 1297 | 
 1298 |   if (name === 'call.escalate') {
 1299 |     const callId = toId(payload.call_id)
 1300 |     if (!callId) {
 1301 |       const err = new Error('call_id is required')
 1302 |       err.status = 400
 1303 |       throw err
 1304 |     }
 1305 |     const entry = await appendLocalRecord('call_escalations.json', {
 1306 |       call_id: callId,
 1307 |       note: sanitizeString(String(payload.note || ''), 200),
 1308 |       severity: sanitizeString(String(payload.severity || 'medium'), 40),
 1309 |       actor_id: admin.id,
 1310 |     })
 1311 |     return { ok: true, escalation: entry }
 1312 |   }
 1313 | 
 1314 |   if (name === 'call.proof.enforce') {
 1315 |     const callId = toId(payload.call_id)
 1316 |     if (!callId) {
 1317 |       const err = new Error('call_id is required')
 1318 |       err.status = 400
 1319 |       throw err
 1320 |     }
 1321 |     let updated = null
 1322 |     await updateJson('call_sessions.json', (rows) => {
 1323 |       const next = Array.isArray(rows) ? rows : []
 1324 |       const idx = next.findIndex((row) => String(row.id) === String(callId))
 1325 |       if (idx < 0) {
 1326 |         const err = new Error('Call not found')
 1327 |         err.status = 404
 1328 |         throw err
 1329 |       }
 1330 |       updated = { ...next[idx], proof_required: true, proof_enforced_at: new Date().toISOString() }
 1331 |       next[idx] = updated
 1332 |       return next
 1333 |     })
 1334 |     return { ok: true, call: updated }
 1335 |   }
 1336 | 
 1337 |   if (name === 'message.takedown') {
 1338 |     const messageId = toId(payload.message_id)
 1339 |     const reason = sanitizeString(String(payload.reason || 'admin_takedown'), 120)
 1340 |     if (!messageId) {
 1341 |       const err = new Error('message_id is required')
 1342 |       err.status = 400
 1343 |       throw err
 1344 |     }
 1345 |     const messages = await readJson('messages.json')
 1346 |     const target = Array.isArray(messages) ? messages.find((m) => String(m.id) === String(messageId)) : null
 1347 |     if (!target) {
 1348 |       const err = new Error('Message not found')
 1349 |       err.status = 404
 1350 |       throw err
 1351 |     }
 1352 | 
 1353 |     const updated = await updateMessages(messageId, {
 1354 |       message: '[Removed by admin moderation]',
 1355 |       moderated: true,
 1356 |       moderation_reason: reason,
 1357 |     })
 1358 | 
 1359 |     if (toBool(payload.apply_strike ?? true)) {
 1360 |       await recordPolicyViolation({
 1361 |         actor_id: target.sender_id,
 1362 |         kind: 'manual_takedown',
 1363 |         reason,
 1364 |         entity_type: 'message',
 1365 |         entity_id: target.id,
 1366 |         content: target.message,
 1367 |         metadata: { admin_id: admin.id },
 1368 |       })
 1369 |     }
 1370 | 
 1371 |     return { ok: true, message: updated }
 1372 |   }
 1373 | 
 1374 |   if (name === 'message.redact') {
 1375 |     const messageId = toId(payload.message_id)
 1376 |     const reason = sanitizeString(String(payload.reason || 'admin_redact'), 120)
 1377 |     if (!messageId) {
 1378 |       const err = new Error('message_id is required')
 1379 |       err.status = 400
 1380 |       throw err
 1381 |     }
 1382 |     const updated = await updateMessages(messageId, {
 1383 |       message: '[Content redacted by admin]',
 1384 |       moderated: true,
 1385 |       moderation_reason: reason,
 1386 |     })
 1387 |     return { ok: true, message: updated }
 1388 |   }
 1389 | 
 1390 |   if (name === 'message.transfer.audit') {
 1391 |     const threadId = toId(payload.thread_id || payload.conversation_id)
 1392 |     if (!threadId) {
 1393 |       const err = new Error('thread_id is required')
 1394 |       err.status = 400
 1395 |       throw err
 1396 |     }
 1397 |     const entry = await appendLocalRecord('chat_transfer_audit.json', {
 1398 |       thread_id: threadId,
 1399 |       from: sanitizeString(String(payload.from || ''), 80),
 1400 |       to: sanitizeString(String(payload.to || ''), 80),
 1401 |       note: sanitizeString(String(payload.note || ''), 200),
 1402 |       actor_id: admin.id,
 1403 |     })
 1404 |     return { ok: true, transfer: entry }
 1405 |   }
 1406 | 
 1407 |   if (name === 'message.flag') {
 1408 |     const messageId = toId(payload.message_id)
 1409 |     if (!messageId) {
 1410 |       const err = new Error('message_id is required')
 1411 |       err.status = 400
 1412 |       throw err
 1413 |     }
 1414 |     const entry = await appendLocalRecord('spam_flags.json', {
 1415 |       entity_type: 'message',
 1416 |       entity_id: messageId,
 1417 |       reason: sanitizeString(String(payload.reason || 'spam'), 200),
 1418 |       actor_id: admin.id,
 1419 |     })
 1420 |     return { ok: true, flag: entry }
 1421 |   }
 1422 | 
 1423 |   if (name === 'message.spam.scan') {
 1424 |     const messages = await readJson('messages.json')
 1425 |     const rows = Array.isArray(messages) ? messages : []
 1426 |     let flagged = 0
 1427 |     for (const msg of rows) {
 1428 |       const scan = scanPolicyText(msg.message || '')
 1429 |       if (!scan) continue
 1430 |       await appendLocalRecord('spam_flags.json', {
 1431 |         entity_type: 'message',
 1432 |         entity_id: msg.id,
 1433 |         reason: scan.reason,
 1434 |         actor_id: admin.id,
 1435 |       })
 1436 |       flagged += 1
 1437 |     }
 1438 |     return { ok: true, flagged }
 1439 |   }
 1440 | 
 1441 |   if (name === 'content.flag') {
 1442 |     const entityId = toId(payload.entity_id)
 1443 |     if (!entityId) {
 1444 |       const err = new Error('entity_id is required')
 1445 |       err.status = 400
 1446 |       throw err
 1447 |     }
 1448 |     const entry = await appendLocalRecord('content_flags.json', {
 1449 |       entity_type: sanitizeString(String(payload.entity_type || 'document'), 40),
 1450 |       entity_id: entityId,
 1451 |       reason: sanitizeString(String(payload.reason || 'flagged'), 200),
 1452 |       actor_id: admin.id,
 1453 |     })
 1454 |     return { ok: true, flag: entry }
 1455 |   }
 1456 | 
 1457 |   if (name === 'content.bulk_approve') {
 1458 |     const docs = await readJson('documents.json')
 1459 |     const products = await readJson('company_products.json')
 1460 |     const nextDocs = Array.isArray(docs) ? docs.map((doc) => (
 1461 |       String(doc.moderation_status || '').toLowerCase() === 'pending_review'
 1462 |         ? { ...doc, moderation_status: 'approved' }
 1463 |         : doc
 1464 |     )) : []
 1465 |     const nextProducts = Array.isArray(products) ? products.map((product) => (
 1466 |       String(product.video_review_status || '').toLowerCase() !== 'approved' && product.video_url
 1467 |         ? { ...product, video_review_status: 'approved', video_restricted: false }
 1468 |         : product
 1469 |     )) : []
 1470 |     await writeJson('documents.json', nextDocs)
 1471 |     await writeJson('company_products.json', nextProducts)
 1472 |     return { ok: true, documents: nextDocs.length, products: nextProducts.length }
 1473 |   }
 1474 | 
 1475 |   if (name === 'violation.strike') {
 1476 |     const userId = toId(payload.user_id)
 1477 |     const reason = sanitizeString(String(payload.reason || 'manual_strike'), 120)
 1478 |     const kind = sanitizeString(String(payload.kind || 'manual'), 60)
 1479 |     if (!userId) {
 1480 |       const err = new Error('user_id is required')
 1481 |       err.status = 400
 1482 |       throw err
 1483 |     }
 1484 |     const violation = await recordPolicyViolation({
 1485 |       actor_id: userId,
 1486 |       kind,
 1487 |       reason,
 1488 |       entity_type: 'manual',
 1489 |       entity_id: userId,
 1490 |       content: reason,
 1491 |       metadata: { admin_id: admin.id },
 1492 |     })
 1493 |     return { ok: true, violation }
 1494 |   }
 1495 | 
 1496 |   if (name === 'support.ticket.create') {
 1497 |     const userId = toId(payload.user_id)
 1498 |     if (!userId) {
 1499 |       const err = new Error('user_id is required')
 1500 |       err.status = 400
 1501 |       throw err
 1502 |     }
 1503 |     const user = await ensureUserExists(userId)
 1504 |     const subject = sanitizeString(String(payload.subject || 'Support ticket'), 160)
 1505 |     const note = sanitizeString(String(payload.note || 'Created by admin'), 1200)
 1506 |     const priority = sanitizeString(String(payload.priority || 'standard'), 40)
 1507 |     const created = await createSupportTicket({
 1508 |       actor: user,
 1509 |       subject,
 1510 |       description: note,
 1511 |       category: 'Admin',
 1512 |       priority,
 1513 |       pageUrl: '',
 1514 |       contactEmail: user.email || '',
 1515 |     })
 1516 |     return { ok: true, ticket: created.ticket }
 1517 |   }
 1518 | 
 1519 |   if (name === 'support.ticket.update') {
 1520 |     const ticketId = toId(payload.ticket_id || payload.id)
 1521 |     if (!ticketId) {
 1522 |       const err = new Error('ticket_id is required')
 1523 |       err.status = 400
 1524 |       throw err
 1525 |     }
 1526 |     const patch = {
 1527 |       status: sanitizeString(String(payload.status || ''), 40),
 1528 |       priority: sanitizeString(String(payload.priority || ''), 40),
 1529 |       resolution_note: sanitizeString(String(payload.note || ''), 240),
 1530 |     }
 1531 |     const updated = await adminUpdateSupportTicket(ticketId, patch, admin.id)
 1532 |     return { ok: true, ticket: updated }
 1533 |   }
 1534 | 
 1535 |   if (name === 'support.ticket.resolve') {
 1536 |     const ticketId = toId(payload.ticket_id || payload.id)
 1537 |     if (!ticketId) {
 1538 |       const err = new Error('ticket_id is required')
 1539 |       err.status = 400
 1540 |       throw err
 1541 |     }
 1542 |     const updated = await adminUpdateSupportTicket(ticketId, { status: 'resolved' }, admin.id)
 1543 |     return { ok: true, ticket: updated }
 1544 |   }
 1545 | 
 1546 |   if (name === 'support.ticket.escalate') {
 1547 |     const ticketId = toId(payload.ticket_id || payload.id)
 1548 |     if (!ticketId) {
 1549 |       const err = new Error('ticket_id is required')
 1550 |       err.status = 400
 1551 |       throw err
 1552 |     }
 1553 |     const updated = await adminUpdateSupportTicket(ticketId, {
 1554 |       priority: 'high',
 1555 |       resolution_note: sanitizeString(String(payload.note || ''), 240),
 1556 |     }, admin.id)
 1557 |     return { ok: true, ticket: updated }
 1558 |   }
 1559 | 
 1560 |   if (name === 'account.manager.assign') {
 1561 |     const userId = toId(payload.user_id)
 1562 |     if (!userId) {
 1563 |       const err = new Error('user_id is required')
 1564 |       err.status = 400
 1565 |       throw err
 1566 |     }
 1567 |     const users = await readJson('users.json')
 1568 |     const rows = Array.isArray(users) ? users : []
 1569 |     const idx = rows.findIndex((u) => String(u.id) === String(userId))
 1570 |     if (idx < 0) {
 1571 |       const err = new Error('User not found')
 1572 |       err.status = 404
 1573 |       throw err
 1574 |     }
 1575 |     const profile = { ...(rows[idx].profile || {}) }
 1576 |     profile.account_manager_id = sanitizeString(String(payload.account_manager_id || ''), 120) || null
 1577 |     profile.account_manager_name = sanitizeString(String(payload.account_manager_name || ''), 120)
 1578 |     profile.account_manager_email = sanitizeString(String(payload.account_manager_email || ''), 160)
 1579 |     profile.account_manager_phone = sanitizeString(String(payload.account_manager_phone || ''), 60)
 1580 |     rows[idx] = { ...rows[idx], profile }
 1581 |     await writeJson('users.json', rows)
 1582 |     return { ok: true, user_id: rows[idx].id, profile }
 1583 |   }
 1584 | 
 1585 |   if (name === 'order.certification.approve') {
 1586 |     const userId = toId(payload.user_id)
 1587 |     if (!userId) {
 1588 |       const err = new Error('user_id is required')
 1589 |       err.status = 400
 1590 |       throw err
 1591 |     }
 1592 |     await ensureUserExists(userId)
 1593 |     const evidence = parseCsvList(payload.evidence_contract_ids || payload.evidence_ids)
 1594 |     const record = await approveOrderCertification(userId, {
 1595 |       issuedBy: admin.id,
 1596 |       evidenceContractIds: evidence,
 1597 |       note: payload.note,
 1598 |     })
 1599 |     return { ok: true, record }
 1600 |   }
 1601 | 
 1602 |   if (name === 'order.certification.revoke') {
 1603 |     const userId = toId(payload.user_id)
 1604 |     if (!userId) {
 1605 |       const err = new Error('user_id is required')
 1606 |       err.status = 400
 1607 |       throw err
 1608 |     }
 1609 |     await ensureUserExists(userId)
 1610 |     const record = await revokeOrderCertification(userId, { issuedBy: admin.id, note: payload.note })
 1611 |     return { ok: true, record }
 1612 |   }
 1613 | 
 1614 |   if (name === 'order.certification.evidence') {
 1615 |     const userId = toId(payload.user_id)
 1616 |     if (!userId) {
 1617 |       const err = new Error('user_id is required')
 1618 |       err.status = 400
 1619 |       throw err
 1620 |     }
 1621 |     await ensureUserExists(userId)
 1622 |     const evidence = parseCsvList(payload.evidence_contract_ids || payload.evidence_ids)
 1623 |     if (!evidence.length) {
 1624 |       const err = new Error('evidence_contract_ids are required')
 1625 |       err.status = 400
 1626 |       throw err
 1627 |     }
 1628 |     const record = await addOrderCertificationEvidence(userId, evidence, { issuedBy: admin.id, note: payload.note })
 1629 |     return { ok: true, record }
 1630 |   }
 1631 | 
 1632 |   if (name === 'notification.broadcast') {
 1633 |     const roles = parseCsvList(payload.roles || payload.role)
 1634 |     const premiumOnly = toBool(payload.premium_only)
 1635 |     const verifiedOnly = toBool(payload.verified_only)
 1636 |     const result = await broadcastNotification({
 1637 |       actor: admin,
 1638 |       title: payload.title,
 1639 |       message: payload.message,
 1640 |       roles,
 1641 |       premiumOnly,
 1642 |       verifiedOnly,
 1643 |     })
 1644 |     return { ok: true, ...result }
 1645 |   }
 1646 | 
 1647 |   if (name === 'notification.template.create') {
 1648 |     const entry = await appendLocalRecord('notification_templates.json', {
 1649 |       name: sanitizeString(String(payload.name || 'Template'), 120),
 1650 |       subject: sanitizeString(String(payload.subject || ''), 160),
 1651 |       body: sanitizeString(String(payload.body || ''), 1000),
 1652 |       channel: sanitizeString(String(payload.channel || 'email'), 40),
 1653 |       created_by: admin.id,
 1654 |     })
 1655 |     return { ok: true, template: entry }
 1656 |   }
 1657 | 
 1658 |   if (name === 'notification.template.update') {
 1659 |     const templateId = toId(payload.template_id || payload.id)
 1660 |     if (!templateId) {
 1661 |       const err = new Error('template_id is required')
 1662 |       err.status = 400
 1663 |       throw err
 1664 |     }
 1665 |     const updated = await updateLocalRecord('notification_templates.json', templateId, {
 1666 |       name: payload.name,
 1667 |       subject: payload.subject,
 1668 |       body: payload.body,
 1669 |       channel: payload.channel,
 1670 |     })
 1671 |     return { ok: true, template: updated }
 1672 |   }
 1673 | 
 1674 |   if (name === 'notification.batch.send') {
 1675 |     const entry = await appendLocalRecord('notification_batches.json', {
 1676 |       template_id: toId(payload.template_id),
 1677 |       status: sanitizeString(String(payload.status || 'queued'), 40),
 1678 |       recipients: toNumber(payload.recipients, 0),
 1679 |       scheduled_at: sanitizeString(String(payload.scheduled_at || ''), 40),
 1680 |       created_by: admin.id,
 1681 |     })
 1682 |     const templates = await readLocalJson('notification_templates.json', [])
 1683 |     const template = templates.find((t) => String(t.id) === String(entry.template_id))
 1684 |     const users = await listUsers()
 1685 |     const userIds = parseCsvList(payload.user_ids)
 1686 |     const roles = parseCsvList(payload.roles)
 1687 |     const premiumOnly = toBool(payload.premium_only)
 1688 |     const verifiedOnly = toBool(payload.verified_only)
 1689 |     const recipients = users.filter((u) => {
 1690 |       if (userIds.length && !userIds.includes(String(u.id))) return false
 1691 |       if (roles.length && !roles.includes(String(u.role || '').toLowerCase())) return false
 1692 |       if (premiumOnly && String(u.subscription_status || '').toLowerCase() !== 'premium') return false
 1693 |       if (verifiedOnly && !u.verified) return false
 1694 |       return true
 1695 |     })
 1696 |     if (template && recipients.length) {
 1697 |       await Promise.all(recipients.map((user) => createNotification(user.id, {
 1698 |         type: 'batch_notification',
 1699 |         entity_type: 'notification_batch',
 1700 |         entity_id: entry.id,
 1701 |         message: template.body || template.subject || 'Announcement',
 1702 |         meta: {
 1703 |           template_id: template.id,
 1704 |           channel: template.channel,
 1705 |           subject: template.subject,
 1706 |           batch_id: entry.id,
 1707 |         },
 1708 |       })))
 1709 |     }
 1710 |     return { ok: true, batch: entry }
 1711 |   }
 1712 | 
 1713 |   if (name === 'notification.monthly.trigger') {
 1714 |     const entry = await appendLocalRecord('monthly_summary_triggers.json', {
 1715 |       name: sanitizeString(String(payload.name || 'Monthly summary'), 120),
 1716 |       schedule: sanitizeString(String(payload.schedule || '0 9 1 * *'), 40),
 1717 |       enabled: payload.enabled !== undefined ? toBool(payload.enabled) : true,
 1718 |       created_by: admin.id,
 1719 |     })
 1720 |     return { ok: true, trigger: entry }
 1721 |   }
 1722 | 
 1723 |   if (name === 'ai.knowledge.create') {
 1724 |     const orgId = sanitizeString(String(payload.org_id || 'public'), 120)
 1725 |     const keywords = Array.isArray(payload.keywords) ? payload.keywords : parseCsvList(payload.keywords)
 1726 |     const entry = await createKnowledgeEntry(orgId, { ...payload, keywords })
 1727 |     return { ok: true, entry }
 1728 |   }
 1729 | 
 1730 |   if (name === 'ai.knowledge.update') {
 1731 |     const orgId = sanitizeString(String(payload.org_id || 'public'), 120)
 1732 |     const entryId = toId(payload.entry_id)
 1733 |     if (!entryId) {
 1734 |       const err = new Error('entry_id is required')
 1735 |       err.status = 400
 1736 |       throw err
 1737 |     }
 1738 |     const keywords = Array.isArray(payload.keywords) ? payload.keywords : parseCsvList(payload.keywords)
 1739 |     const entry = await updateKnowledgeEntry(orgId, entryId, { ...payload, keywords })
 1740 |     return { ok: true, entry }
 1741 |   }
 1742 | 
 1743 |   if (name === 'ai.knowledge.delete') {
 1744 |     const orgId = sanitizeString(String(payload.org_id || 'public'), 120)
 1745 |     const entryId = toId(payload.entry_id)
 1746 |     if (!entryId) {
 1747 |       const err = new Error('entry_id is required')
 1748 |       err.status = 400
 1749 |       throw err
 1750 |     }
 1751 |     const deleted = await deleteKnowledgeEntry(orgId, entryId)
 1752 |     return { ok: true, deleted }
 1753 |   }
 1754 | 
 1755 |   if (name === 'ai.response.flag') {
 1756 |     const entry = await appendLocalRecord('ai_response_audit.json', {
 1757 |       response_id: toId(payload.response_id),
 1758 |       reason: sanitizeString(String(payload.reason || 'flagged'), 200),
 1759 |       actor_id: admin.id,
 1760 |       created_at: new Date().toISOString(),
 1761 |     })
 1762 |     return { ok: true, audit: entry }
 1763 |   }
 1764 | 
 1765 |   if (name === 'system.feature_flag') {
 1766 |     const key = sanitizeString(String(payload.key || ''), 80)
 1767 |     if (!key) {
 1768 |       const err = new Error('key is required')
 1769 |       err.status = 400
 1770 |       throw err
 1771 |     }
 1772 |     const value = toBool(payload.value)
 1773 |     const config = await updateAdminConfig({ feature_flags: { [key]: value } })
 1774 |     return { ok: true, config }
 1775 |   }
 1776 | 
 1777 |   if (name === 'system.plan_limit') {
 1778 |     const plan = sanitizeString(String(payload.plan || ''), 20).toLowerCase()
 1779 |     const limitKey = sanitizeString(String(payload.key || ''), 80)
 1780 |     const value = toNumber(payload.value)
 1781 |     if (!plan || !limitKey) {
 1782 |       const err = new Error('plan and key are required')
 1783 |       err.status = 400
 1784 |       throw err
 1785 |     }
 1786 |     const config = await updateAdminConfig({ plan_limits: { [plan]: { [limitKey]: value } } })
 1787 |     return { ok: true, config }
 1788 |   }
 1789 | 
 1790 |   if (name === 'system.pricing') {
 1791 |     const plan = sanitizeString(String(payload.plan || ''), 20).toLowerCase()
 1792 |     const value = toNumber(payload.usd)
 1793 |     if (!plan) {
 1794 |       const err = new Error('plan is required')
 1795 |       err.status = 400
 1796 |       throw err
 1797 |     }
 1798 |     const key = plan === 'premium' ? 'premium_usd' : 'free_usd'
 1799 |     const config = await updateAdminConfig({ pricing: { [key]: value } })
 1800 |     return { ok: true, config }
 1801 |   }
 1802 | 
 1803 |   if (name === 'system.policy') {
 1804 |     const key = sanitizeString(String(payload.key || ''), 40)
 1805 |     const value = sanitizeString(String(payload.value || ''), 2000)
 1806 |     if (!key || !value) {
 1807 |       const err = new Error('key and value are required')
 1808 |       err.status = 400
 1809 |       throw err
 1810 |     }
 1811 |     const config = await updateAdminConfig({ policies: { [key]: value } })
 1812 |     return { ok: true, config }
 1813 |   }
 1814 | 
 1815 |   if (name === 'system.retention') {
 1816 |     const auditDays = payload.audit_days !== undefined ? Math.max(1, Math.floor(toNumber(payload.audit_days))) : undefined
 1817 |     const logsDays = payload.logs_days !== undefined ? Math.max(1, Math.floor(toNumber(payload.logs_days))) : undefined
 1818 |     const patch = {}
 1819 |     if (auditDays !== undefined) patch.audit_days = auditDays
 1820 |     if (logsDays !== undefined) patch.logs_days = logsDays
 1821 |     if (Object.keys(patch).length === 0) {
 1822 |       const err = new Error('audit_days or logs_days are required')
 1823 |       err.status = 400
 1824 |       throw err
 1825 |     }
 1826 |     const config = await updateAdminConfig({ retention: patch })
 1827 |     return { ok: true, config }
 1828 |   }
 1829 | 
 1830 |   if (name === 'system.search_limits') {
 1831 |     const patch = {}
 1832 |     if (payload.advanced_filter_gate !== undefined) patch.advanced_filter_gate = toBool(payload.advanced_filter_gate)
 1833 |     if (payload.abusive_search_threshold !== undefined) patch.abusive_search_threshold = Math.max(0, toNumber(payload.abusive_search_threshold))
 1834 |     if (Object.keys(patch).length === 0) {
 1835 |       const err = new Error('No search limit fields provided')
 1836 |       err.status = 400
 1837 |       throw err
 1838 |     }
 1839 |     const config = await updateAdminConfig({ search_limits: patch })
 1840 |     return { ok: true, config }
 1841 |   }
 1842 | 
 1843 |   if (name === 'email.test_send') {
 1844 |     const config = await getAdminConfig()
 1845 |     const emailConfig = config?.notifications?.email || {}
 1846 |     const recipient = sanitizeString(String(payload.to || payload.recipient || emailConfig.test_recipient || ''), 160)
 1847 |     if (!recipient) {
 1848 |       const err = new Error('Recipient email is required')
 1849 |       err.status = 400
 1850 |       throw err
 1851 |     }
 1852 |     const subject = sanitizeString(String(payload.subject || 'GarTexHub test email'), 200)
 1853 |     const body = sanitizeString(String(payload.message || 'This is a test email from GarTexHub.'), 2000)
 1854 |     const result = await sendEmail({ to: recipient, subject, text: body })
 1855 |     return { ok: true, result }
 1856 |   }
 1857 | 
 1858 |   if (name === 'integrations.update') {
 1859 |     const integrations = parseJson(payload.integrations || payload.payload)
 1860 |     if (!integrations || typeof integrations !== 'object') {
 1861 |       const err = new Error('integrations JSON is required')
 1862 |       err.status = 400
 1863 |       throw err
 1864 |     }
 1865 |     const config = await updateAdminConfig({ integrations })
 1866 |     return { ok: true, config }
 1867 |   }
 1868 | 
 1869 |   if (name === 'integrations.crm.export') {
 1870 |     const config = await getAdminConfig()
 1871 |     const exportsList = Array.isArray(config.integrations?.crm_exports) ? config.integrations.crm_exports : []
 1872 |     const entry = {
 1873 |       id: crypto.randomUUID(),
 1874 |       status: 'queued',
 1875 |       requested_at: new Date().toISOString(),
 1876 |       note: sanitizeString(String(payload.note || ''), 200),
 1877 |     }
 1878 |     const next = [...exportsList, entry]
 1879 |     const updated = await updateAdminConfig({ integrations: { crm_exports: next } })
 1880 |     return { ok: true, export: entry, config: updated }
 1881 |   }
 1882 | 
 1883 |   if (name === 'integrations.webhook.test') {
 1884 |     const config = await getAdminConfig()
 1885 |     const hooks = Array.isArray(config.integrations?.webhooks) ? config.integrations.webhooks : []
 1886 |     const results = []
 1887 |     if (typeof fetch === 'function') {
 1888 |       for (const hook of hooks) {
 1889 |         try {
 1890 |           const res = await fetch(hook.url || hook.endpoint || hook.target || '', {
 1891 |             method: 'POST',
 1892 |             headers: { 'content-type': 'application/json' },
 1893 |             body: JSON.stringify({ event: 'admin_webhook_test', at: new Date().toISOString() }),
 1894 |           })
 1895 |           results.push({ id: hook.id || hook.url, status: res.ok ? 'sent' : 'failed', code: res.status })
 1896 |         } catch (error) {
 1897 |           results.push({ id: hook.id || hook.url, status: 'failed', error: String(error?.message || 'error') })
 1898 |         }
 1899 |       }
 1900 |     }
 1901 |     return { ok: true, results }
 1902 |   }
 1903 | 
 1904 |   if (name === 'traffic.record') {
 1905 |     const domain = sanitizeString(String(payload.domain || 'site'), 120)
 1906 |     const clicks = toNumber(payload.clicks, 0)
 1907 |     const visits = toNumber(payload.visits, 0)
 1908 |     await updateLocalJson('traffic_analytics.json', (current = { summary: {}, sources: [], domains: [] }) => {
 1909 |       const summary = { ...(current.summary || {}) }
 1910 |       summary.clicks = (summary.clicks || 0) + clicks
 1911 |       summary.visits = (summary.visits || 0) + visits
 1912 |       const domains = Array.isArray(current.domains) ? current.domains : []
 1913 |       const existing = domains.find((d) => String(d.domain) === domain)
 1914 |       if (existing) {
 1915 |         existing.clicks = (existing.clicks || 0) + clicks
 1916 |         existing.visits = (existing.visits || 0) + visits
 1917 |       } else {
 1918 |         domains.push({ domain, clicks, visits })
 1919 |       }
 1920 |       return { ...current, summary, domains }
 1921 |     }, { summary: {}, sources: [], domains: [] })
 1922 |     return { ok: true }
 1923 |   }
 1924 | 
 1925 |   if (name === 'email.segment.create') {
 1926 |     const filter = parseJson(payload.filter) || payload.filter || {}
 1927 |     const entry = await appendLocalRecord('email_segments.json', {
 1928 |       name: sanitizeString(String(payload.name || 'Segment'), 120),
 1929 |       filter,
 1930 |       created_by: admin.id,
 1931 |     })
 1932 |     return { ok: true, segment: entry }
 1933 |   }
 1934 | 
 1935 |   if (name === 'email.segment.update') {
 1936 |     const segmentId = toId(payload.segment_id || payload.id)
 1937 |     if (!segmentId) {
 1938 |       const err = new Error('segment_id is required')
 1939 |       err.status = 400
 1940 |       throw err
 1941 |     }
 1942 |     const filter = parseJson(payload.filter) || payload.filter
 1943 |     const updated = await updateLocalRecord('email_segments.json', segmentId, {
 1944 |       name: payload.name,
 1945 |       filter,
 1946 |       updated_by: admin.id,
 1947 |     })
 1948 |     return { ok: true, segment: updated }
 1949 |   }
 1950 | 
 1951 |   if (name === 'email.segment.delete') {
 1952 |     const segmentId = toId(payload.segment_id || payload.id)
 1953 |     if (!segmentId) {
 1954 |       const err = new Error('segment_id is required')
 1955 |       err.status = 400
 1956 |       throw err
 1957 |     }
 1958 |     await removeLocalRecord('email_segments.json', segmentId)
 1959 |     return { ok: true }
 1960 |   }
 1961 | 
 1962 |   if (name === 'featured.add') {
 1963 |     const entityType = sanitizeString(String(payload.entity_type || 'product'), 40)
 1964 |     const entityId = toId(payload.entity_id || payload.id)
 1965 |     if (!entityId) {
 1966 |       const err = new Error('entity_id is required')
 1967 |       err.status = 400
 1968 |       throw err
 1969 |     }
 1970 |     const entry = await appendLocalRecord('featured_listings.json', {
 1971 |       entity_type: entityType,
 1972 |       entity_id: entityId,
 1973 |       label: sanitizeString(String(payload.label || ''), 120),
 1974 |       created_by: admin.id,
 1975 |     })
 1976 |     return { ok: true, featured: entry }
 1977 |   }
 1978 | 
 1979 |   if (name === 'featured.remove') {
 1980 |     const listingId = toId(payload.listing_id || payload.id)
 1981 |     const entityId = toId(payload.entity_id || '')
 1982 |     if (!listingId && !entityId) {
 1983 |       const err = new Error('listing_id or entity_id is required')
 1984 |       err.status = 400
 1985 |       throw err
 1986 |     }
 1987 |     if (listingId) {
 1988 |       await removeLocalRecord('featured_listings.json', listingId)
 1989 |       return { ok: true, removed: listingId }
 1990 |     }
 1991 |     await updateLocalJson('featured_listings.json', (rows = []) => (
 1992 |       Array.isArray(rows) ? rows.filter((row) => String(row.entity_id) !== entityId) : rows
 1993 |     ), [])
 1994 |     return { ok: true, removed_entity_id: entityId }
 1995 |   }
 1996 | 
 1997 |   const err = new Error(`Unknown admin action: ${name}`)
 1998 |   err.status = 400
 1999 |   throw err
 2000 | }
 2001 | 