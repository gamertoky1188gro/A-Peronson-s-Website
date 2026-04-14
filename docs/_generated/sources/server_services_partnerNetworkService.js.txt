    1 | import crypto from 'crypto'
    2 | import { readJson, updateJson } from '../utils/jsonStore.js'
    3 | import { findUserById, listUsers } from './userService.js'
    4 | import { recordMilestone } from './ratingsService.js'
    5 | import { createNotification } from './notificationService.js'
    6 | import { getAdminConfig } from './adminConfigService.js'
    7 | import { getPlanForUser } from './entitlementService.js'
    8 | import {
    9 |   canManagePartnerNetwork,
   10 |   canViewPartnerNetwork,
   11 |   canRespondToPartnerRequest,
   12 |   isAgent,
   13 |   isOwnerOrAdmin,
   14 |   scopeRecordsForUser,
   15 | } from '../utils/permissions.js'
   16 | 
   17 | const FILE = 'partner_requests.json'
   18 | const ACTIVE_STATUSES = new Set(['pending', 'connected'])
   19 | 
   20 | async function isPremium(user) {
   21 |   const plan = await getPlanForUser(user)
   22 |   return plan === 'premium'
   23 | }
   24 | 
   25 | function isAllowedPair(fromRole, toRole) {
   26 |   return (fromRole === 'factory' && toRole === 'buying_house') || (fromRole === 'buying_house' && toRole === 'factory')
   27 | }
   28 | 
   29 | function mapWithCounterparty(request, me, usersById) {
   30 |   const counterpartyId = request.requester_id === me.id ? request.target_id : request.requester_id
   31 |   const counterparty = usersById.get(counterpartyId)
   32 |   return {
   33 |     ...request,
   34 |     direction: request.requester_id === me.id ? 'outgoing' : 'incoming',
   35 |     counterparty: counterparty
   36 |       ? { id: counterparty.id, name: counterparty.name, role: counterparty.role, verified: Boolean(counterparty.verified) }
   37 |       : { id: counterpartyId, name: 'Unknown account', role: 'unknown', verified: false },
   38 |   }
   39 | }
   40 | 
   41 | export async function getPartnerNetwork(user, { status } = {}) {
   42 |   if (!canViewPartnerNetwork(user)) {
   43 |     const err = new Error('Forbidden')
   44 |     err.status = 403
   45 |     throw err
   46 |   }
   47 | 
   48 |   const [requests, users] = await Promise.all([readJson(FILE), listUsers()])
   49 |   const usersById = new Map(users.map((u) => [u.id, u]))
   50 | 
   51 |   const scoped = scopeRecordsForUser(user, requests, {
   52 |     idFields: ['requester_id', 'target_id'],
   53 |     assignmentFields: ['assigned_agent_id', 'agent_id'],
   54 |   })
   55 | 
   56 |   const filtered = status ? scoped.filter((r) => r.status === status) : scoped
   57 |   const rows = filtered.map((r) => mapWithCounterparty(r, user, usersById)).sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
   58 |   const connectedFactories = rows
   59 |     .filter((r) => r.status === 'connected' && r.counterparty?.role === 'factory')
   60 |     .map((r) => r.counterparty)
   61 | 
   62 |   return {
   63 |     requests: rows,
   64 |     connected_factories: connectedFactories,
   65 |     permissions: {
   66 |       view_only: isAgent(user),
   67 |       can_manage: canManagePartnerNetwork(user),
   68 |     },
   69 |   }
   70 | }
   71 | 
   72 | export async function sendPartnerRequest(user, targetAccountId) {
   73 |   if (!canManagePartnerNetwork(user)) {
   74 |     const err = new Error('Forbidden')
   75 |     err.status = 403
   76 |     throw err
   77 |   }
   78 | 
   79 |   const target = await findUserById(targetAccountId)
   80 |   if (!target) {
   81 |     const err = new Error('Target account not found')
   82 |     err.status = 404
   83 |     throw err
   84 |   }
   85 | 
   86 |   if (target.id === user.id) {
   87 |     const err = new Error('Cannot request your own account')
   88 |     err.status = 400
   89 |     throw err
   90 |   }
   91 | 
   92 |   if (!isAllowedPair(user.role, target.role)) {
   93 |     const err = new Error('Partner requests only allowed between factory and buying house accounts')
   94 |     err.status = 400
   95 |     throw err
   96 |   }
   97 | 
   98 |   const now = new Date().toISOString()
   99 |   const id = crypto.randomUUID()
  100 |   const config = await getAdminConfig()
  101 |   const freePartnerLimit = Number(config?.plan_limits?.free?.partner_limit || 5)
  102 |   const isPremiumUser = await isPremium(user)
  103 | 
  104 |   const created = await updateJson(FILE, (rows) => {
  105 |   const duplicate = rows.find((r) =>
  106 |       ((r.requester_id === user.id && r.target_id === target.id) || (r.requester_id === target.id && r.target_id === user.id))
  107 |       && (r.status === 'pending' || r.status === 'connected'))
  108 |     if (duplicate) {
  109 |       const err = new Error('An active partner relationship/request already exists between these accounts')
  110 |       err.status = 409
  111 |       throw err
  112 |     }
  113 | 
  114 |     if (user.role === 'buying_house' && !isPremiumUser) {
  115 |       const outgoing = rows.filter((r) => r.requester_id === user.id && ACTIVE_STATUSES.has(r.status))
  116 |       if (outgoing.length >= freePartnerLimit) {
  117 |         const err = new Error(`Upgrade to premium to send more than ${freePartnerLimit} partner requests.`)
  118 |         err.status = 403
  119 |         throw err
  120 |       }
  121 |     }
  122 | 
  123 |     const row = {
  124 |       id,
  125 |       requester_id: user.id,
  126 |       requester_role: user.role,
  127 |       target_id: target.id,
  128 |       target_role: target.role,
  129 |       status: 'pending',
  130 |       created_at: now,
  131 |       updated_at: now,
  132 |     }
  133 |     rows.push(row)
  134 |     return rows
  135 |   })
  136 | 
  137 |   const row = created.find((r) => r.id === id)
  138 |   if (row) {
  139 |     // Notify the target factory so they can accept/reject from /notifications.
  140 |     await createNotification(target.id, {
  141 |       type: 'partner_request',
  142 |       entity_type: 'partner_request',
  143 |       entity_id: row.id,
  144 |       message: `New partner request from ${user.name}`,
  145 |       meta: {
  146 |         request_id: row.id,
  147 |         requester_id: user.id,
  148 |         requester_role: user.role,
  149 |       },
  150 |     })
  151 |   }
  152 | 
  153 |   return row
  154 | }
  155 | 
  156 | export async function updatePartnerRequestStatus(user, requestId, action) {
  157 |   // Accept/reject is allowed for factories (targets) and owner/admin. Cancel is allowed for buying house requester and owner/admin.
  158 |   const isAdmin = isOwnerOrAdmin(user)
  159 |   const isFactory = canRespondToPartnerRequest(user) && !isAdmin && String(user?.role || '').toLowerCase() === 'factory'
  160 |   const canCancel = isAdmin || String(user?.role || '').toLowerCase() === 'buying_house'
  161 |   if (!isAdmin && !isFactory && !canCancel) {
  162 |     const err = new Error('Forbidden')
  163 |     err.status = 403
  164 |     throw err
  165 |   }
  166 | 
  167 |   if (!['accept', 'reject', 'cancel'].includes(action)) {
  168 |       const err = new Error('Invalid action')
  169 |       err.status = 400
  170 |       throw err
  171 |     }
  172 | 
  173 |   const config = await getAdminConfig()
  174 |   const freePartnerLimit = Number(config?.plan_limits?.free?.partner_limit || 5)
  175 |   const isPremiumUser = await isPremium(user)
  176 | 
  177 |   let updatedRow = null
  178 |   const nextStatus = action === 'accept' ? 'connected' : action === 'reject' ? 'rejected' : 'cancelled'
  179 | 
  180 |   await updateJson(FILE, (rows) => {
  181 |     const index = rows.findIndex((r) => r.id === requestId)
  182 |     if (index < 0) {
  183 |       const err = new Error('Request not found')
  184 |       err.status = 404
  185 |       throw err
  186 |     }
  187 | 
  188 |     const current = rows[index]
  189 |     if (current.status !== 'pending') {
  190 |       const err = new Error('Only pending requests can be updated')
  191 |       err.status = 400
  192 |       throw err
  193 |     }
  194 | 
  195 |     if (action === 'accept' && String(user.role || '').toLowerCase() === 'factory' && !isPremiumUser) {
  196 |       const existingConnections = rows.filter((r) => r.target_id === user.id && r.status === 'connected').length
  197 |       if (existingConnections >= freePartnerLimit) {
  198 |         const err = new Error(`Subscribe to premium to accept more than ${freePartnerLimit} partner requests.`)
  199 |         err.status = 403
  200 |         throw err
  201 |       }
  202 |     }
  203 | 
  204 |     if (!isAdmin) {
  205 |       if (action === 'cancel' && current.requester_id !== user.id) {
  206 |         const err = new Error('Only requester can cancel this request')
  207 |         err.status = 403
  208 |         throw err
  209 |       }
  210 |       if ((action === 'accept' || action === 'reject') && current.target_id !== user.id) {
  211 |         const err = new Error('Only target account can accept/reject this request')
  212 |         err.status = 403
  213 |         throw err
  214 |       }
  215 |     }
  216 | 
  217 |     const now = new Date().toISOString()
  218 |     const next = { ...current, status: nextStatus, updated_at: now }
  219 |     rows[index] = next
  220 |     updatedRow = next
  221 |     return rows
  222 |   })
  223 | 
  224 |   if (updatedRow && nextStatus === 'connected') {
  225 |     // Notify the requester that the factory accepted the connection.
  226 |     await createNotification(updatedRow.requester_id, {
  227 |       type: 'partner_request',
  228 |       entity_type: 'partner_request',
  229 |       entity_id: updatedRow.id,
  230 |       message: 'Partner request accepted',
  231 |       meta: {
  232 |         request_id: updatedRow.id,
  233 |         target_id: updatedRow.target_id,
  234 |       },
  235 |     })
  236 |     await Promise.all([
  237 |       recordMilestone({
  238 |         profileKey: `user:${updatedRow.requester_id}`,
  239 |         counterpartyId: updatedRow.target_id,
  240 |         interactionType: 'contract',
  241 |         milestone: 'contract_signed',
  242 |         actorId: user.id,
  243 |       }),
  244 |       recordMilestone({
  245 |         profileKey: `user:${updatedRow.target_id}`,
  246 |         counterpartyId: updatedRow.requester_id,
  247 |         interactionType: 'contract',
  248 |         milestone: 'contract_signed',
  249 |         actorId: user.id,
  250 |       }),
  251 |     ])
  252 |   }
  253 | 
  254 |   return updatedRow
  255 | }
  256 | 
  257 | export async function enforcePartnerFreeTierLimits() {
  258 |   const [requests, users, config] = await Promise.all([readJson(FILE), listUsers(), getAdminConfig()])
  259 |   const rows = Array.isArray(requests) ? requests : []
  260 |   const usersById = new Map(users.map((u) => [String(u.id), u]))
  261 |   const freePartnerLimit = Number(config?.plan_limits?.free?.partner_limit || 5)
  262 | 
  263 |   const activeByUser = rows.reduce((acc, row) => {
  264 |     if (row.status !== 'connected') return acc
  265 |     const requester = String(row.requester_id)
  266 |     const target = String(row.target_id)
  267 |     acc[requester] = acc[requester] || []
  268 |     acc[target] = acc[target] || []
  269 |     acc[requester].push(row)
  270 |     acc[target].push(row)
  271 |     return acc
  272 |   }, {})
  273 | 
  274 |   let updated = false
  275 |   const now = new Date().toISOString()
  276 |   const next = rows.map((row) => {
  277 |     if (row.status !== 'connected') return row
  278 |     const requester = usersById.get(String(row.requester_id))
  279 |     const target = usersById.get(String(row.target_id))
  280 |     const requesterFree = requester && !isPremium(requester)
  281 |     const targetFree = target && !isPremium(target)
  282 |     const requesterActive = activeByUser[String(row.requester_id)] || []
  283 |     const targetActive = activeByUser[String(row.target_id)] || []
  284 |     const requesterOver = requesterFree && requesterActive.length > freePartnerLimit
  285 |     const targetOver = targetFree && targetActive.length > freePartnerLimit
  286 |     if (requesterOver || targetOver) {
  287 |       updated = true
  288 |       return { ...row, limit_exceeded: true, enforced_at: now }
  289 |     }
  290 |     return row.limit_exceeded ? { ...row, limit_exceeded: false, enforced_at: now } : row
  291 |   })
  292 | 
  293 |   if (updated) {
  294 |     await updateJson(FILE, () => next)
  295 |   }
  296 | 
  297 |   return { updated, limit: freePartnerLimit }
  298 | }
  299 | 