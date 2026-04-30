    1 | import crypto from 'crypto'
    2 | import bcrypt from 'bcryptjs'
    3 | import { readJson, writeJson } from '../utils/jsonStore.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | import { getSubscription } from './subscriptionService.js'
    6 | import { getAdminConfig } from './adminConfigService.js'
    7 | import { getPlanForUser } from './entitlementService.js'
    8 | 
    9 | /**
   10 |  * Member/Team system (Phase 2)
   11 |  * - "Members" are stored as real user rows in `users.json` with `role: "agent"`.
   12 |  * - This enables single-field Agent login: Email OR Agent ID (member_id).
   13 |  * - Legacy support: if `members.json` exists with old rows, we migrate them into users.json on demand.
   14 |  */
   15 | 
   16 | const USERS_FILE = 'users.json'
   17 | const LEGACY_MEMBERS_FILE = 'members.json'
   18 | 
   19 | const DEFAULT_FREE_MEMBER_LIMIT = 10
   20 | 
   21 | // Legacy permissions are still supported for UI compatibility (checkbox list).
   22 | const VALID_PERMISSIONS = new Set(['view_requests', 'assign_requests', 'manage_members', 'reports_only'])
   23 | const PERMISSION_CONFLICTS = [['manage_members', 'reports_only']]
   24 | 
   25 | // Permission matrix is the longer-term, role-safe permission model.
   26 | const MATRIX_SECTIONS = ['requests', 'products', 'analytics', 'members', 'documents']
   27 | 
   28 | function sanitizePermissions(permissions) {
   29 |   if (!Array.isArray(permissions)) return []
   30 |   return [...new Set(permissions.map((p) => sanitizeString(String(p), 64)).filter((p) => VALID_PERMISSIONS.has(p)))]
   31 | }
   32 | 
   33 | function sanitizePermissionMatrix(rawMatrix) {
   34 |   const input = rawMatrix && typeof rawMatrix === 'object' ? rawMatrix : {}
   35 |   const matrix = {}
   36 | 
   37 |   for (const section of MATRIX_SECTIONS) {
   38 |     const sectionValue = input?.[section] && typeof input[section] === 'object' ? input[section] : {}
   39 |     matrix[section] = {
   40 |       view: Boolean(sectionValue.view),
   41 |       edit: Boolean(sectionValue.edit),
   42 |     }
   43 |   }
   44 | 
   45 |   // Hard rule: agents can never manage members from the UI/API.
   46 |   matrix.members = { view: false, edit: false }
   47 | 
   48 |   return matrix
   49 | }
   50 | 
   51 | function hasPermissionConflict(permissions) {
   52 |   return PERMISSION_CONFLICTS.find(([a, b]) => permissions.includes(a) && permissions.includes(b)) || null
   53 | }
   54 | 
   55 | function cleanAgent(user) {
   56 |   const { password_hash: _passwordHash, ...safe } = user
   57 |   return safe
   58 | }
   59 | 
   60 | function normalizeAgent(orgOwnerId, payload = {}, current = null) {
   61 |   const name = sanitizeString(payload.name ?? current?.name, 120)
   62 |   const username = sanitizeString(payload.username ?? current?.username, 64)
   63 |   const memberId = sanitizeString(payload.member_id ?? payload.account_id ?? current?.member_id, 64)
   64 | 
   65 |   // Force role to agent (this endpoint is "member management", i.e. sub-accounts).
   66 |   const role = 'agent'
   67 |   const status = sanitizeString(payload.status ?? current?.status ?? 'active', 32) || 'active'
   68 | 
   69 |   const permissions = payload.permissions === undefined
   70 |     ? (Array.isArray(current?.permissions) ? current.permissions : [])
   71 |     : sanitizePermissions(payload.permissions)
   72 | 
   73 |   const permissionMatrix = payload.permission_matrix === undefined
   74 |     ? sanitizePermissionMatrix(current?.permission_matrix || {})
   75 |     : sanitizePermissionMatrix(payload.permission_matrix)
   76 | 
   77 |   // Use a synthetic email so agents remain valid "users" but are not discoverable via search suggestions.
   78 |   const email = sanitizeString(payload.email ?? current?.email, 160) || `agent-${memberId}@gartexhub.local`
   79 | 
   80 |   const messagingRestricted = sanitizeString(payload.messaging_restricted_until ?? current?.messaging_restricted_until ?? '', 64).trim()
   81 | 
   82 |   return {
   83 |     id: current?.id || crypto.randomUUID(),
   84 |     org_owner_id: orgOwnerId,
   85 |     name,
   86 |     username,
   87 |     member_id: memberId,
   88 |     account_id: memberId,
   89 |     email: email.toLowerCase(),
   90 |     role,
   91 |     status,
   92 |     // Agents are internal sub-accounts; they do not receive the public $5 wallet credit.
   93 |     wallet_balance_usd: Number(current?.wallet_balance_usd ?? 0),
   94 |     policy_strikes: Number(current?.policy_strikes ?? 0),
   95 |     messaging_restricted_until: messagingRestricted || null,
   96 |     permissions,
   97 |     permission_matrix: permissionMatrix,
   98 |     assigned_requests: Number(payload.assigned_requests ?? current?.assigned_requests ?? 0),
   99 |     performance_score: Number(payload.performance_score ?? current?.performance_score ?? 0),
  100 |     created_at: current?.created_at || new Date().toISOString(),
  101 |     updated_at: new Date().toISOString(),
  102 |   }
  103 | }
  104 | 
  105 | async function readAllUsersRaw() {
  106 |   const users = await readJson(USERS_FILE)
  107 |   return Array.isArray(users) ? users : []
  108 | }
  109 | 
  110 | async function writeAllUsersRaw(users) {
  111 |   await writeJson(USERS_FILE, users)
  112 | }
  113 | 
  114 | async function migrateLegacyMembersIfNeeded() {
  115 |   // If no legacy file exists or it is empty, skip.
  116 |   let legacy = []
  117 |   try {
  118 |     legacy = await readJson(LEGACY_MEMBERS_FILE)
  119 |   } catch {
  120 |     legacy = []
  121 |   }
  122 |   if (!Array.isArray(legacy) || legacy.length === 0) return
  123 | 
  124 |   const users = await readAllUsersRaw()
  125 |   const existingByMemberId = new Map(
  126 |     users
  127 |       .filter((u) => String(u.member_id || '').trim())
  128 |       .map((u) => [String(u.member_id || '').toLowerCase(), u]),
  129 |   )
  130 | 
  131 |   let mutated = false
  132 |   for (const row of legacy) {
  133 |     const memberId = sanitizeString(row.member_id || row.account_id, 64)
  134 |     if (!memberId) continue
  135 |     const key = memberId.toLowerCase()
  136 |     if (existingByMemberId.has(key)) continue
  137 | 
  138 |     const orgOwnerId = sanitizeString(row.org_owner_id || row.organization_id, 120) || ''
  139 |     if (!orgOwnerId) continue
  140 | 
  141 |     const agent = normalizeAgent(orgOwnerId, row, {
  142 |       id: crypto.randomUUID(),
  143 |       name: row.name || memberId,
  144 |       username: row.username || memberId,
  145 |       member_id: memberId,
  146 |       email: row.email || `agent-${memberId}@gartexhub.local`,
  147 |       role: 'agent',
  148 |       status: row.status || 'active',
  149 |       permissions: Array.isArray(row.permissions) ? row.permissions : [],
  150 |       permission_matrix: row.permission_matrix || {},
  151 |       created_at: row.created_at || new Date().toISOString(),
  152 |       updated_at: row.updated_at || new Date().toISOString(),
  153 |     })
  154 | 
  155 |     // Preserve legacy password hash if present; otherwise create a random one (agent must reset).
  156 |     agent.password_hash = row.password_hash || (await bcrypt.hash(crypto.randomBytes(12).toString('base64url'), 10))
  157 | 
  158 |     users.push(agent)
  159 |     existingByMemberId.set(key, agent)
  160 |     mutated = true
  161 |   }
  162 | 
  163 |   if (mutated) {
  164 |     await writeAllUsersRaw(users)
  165 |   }
  166 | }
  167 | 
  168 | async function listAgentsForOrg(orgOwnerId) {
  169 |   await migrateLegacyMembersIfNeeded()
  170 |   const users = await readAllUsersRaw()
  171 |   return users
  172 |     .filter((u) => String(u.role || '').toLowerCase() === 'agent')
  173 |     .filter((u) => String(u.org_owner_id) === String(orgOwnerId))
  174 | }
  175 | 
  176 | export async function listMembers(orgOwnerId) {
  177 |   const agents = await listAgentsForOrg(orgOwnerId)
  178 |   return agents.map(cleanAgent)
  179 | }
  180 | 
  181 | async function assertFreePlanMemberLimit(orgOwnerId, allAgents, currentAgent = null, nextStatus = 'active', orgOwnerRecord = null) {
  182 |   const plan = orgOwnerRecord ? await getPlanForUser(orgOwnerRecord) : (await getSubscription(orgOwnerId))?.plan === 'premium' ? 'premium' : 'free'
  183 |   if (plan !== 'free') return
  184 | 
  185 |   const config = await getAdminConfig()
  186 |   const freeLimit = Number(config?.plan_limits?.free?.agent_limit || DEFAULT_FREE_MEMBER_LIMIT)
  187 |   const activeCount = allAgents.filter((m) => m.status === 'active' && String(m.id) !== String(currentAgent?.id)).length
  188 |   if (nextStatus === 'active' && activeCount >= freeLimit) {
  189 |     const error = new Error(`Free plan allows up to ${freeLimit} active sub-accounts`)
  190 |     error.status = 403
  191 |     throw error
  192 |   }
  193 | }
  194 | 
  195 | function ensureUniqueIdentity({ users, orgOwnerId, username, memberId, currentUserId = null }) {
  196 |   const dupeUsername = users.find(
  197 |     (u) =>
  198 |       String(u.role || '').toLowerCase() === 'agent' &&
  199 |       String(u.org_owner_id) === String(orgOwnerId) &&
  200 |       String(u.id) !== String(currentUserId) &&
  201 |       String(u.username || '').toLowerCase() === String(username || '').toLowerCase(),
  202 |   )
  203 |   if (dupeUsername) {
  204 |     const error = new Error('Duplicate username in this organization')
  205 |     error.status = 409
  206 |     throw error
  207 |   }
  208 | 
  209 |   // Agent ID must be globally unique so the agent can login using only that ID.
  210 |   const dupeMemberId = users.find(
  211 |     (u) =>
  212 |       String(u.id) !== String(currentUserId) &&
  213 |       String(u.member_id || '').toLowerCase() === String(memberId || '').toLowerCase(),
  214 |   )
  215 |   if (dupeMemberId) {
  216 |     const error = new Error('Member ID already exists')
  217 |     error.status = 409
  218 |     throw error
  219 |   }
  220 | }
  221 | 
  222 | export async function createMember(orgOwnerId, payload) {
  223 |   await migrateLegacyMembersIfNeeded()
  224 |   const users = await readAllUsersRaw()
  225 | 
  226 |   const agent = normalizeAgent(orgOwnerId, payload)
  227 |   const conflict = hasPermissionConflict(agent.permissions)
  228 |   if (conflict) {
  229 |     const error = new Error(`Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}`)
  230 |     error.status = 400
  231 |     throw error
  232 |   }
  233 | 
  234 |   if (!agent.name || !agent.username || !agent.member_id) {
  235 |     const error = new Error('name, username and member_id are required')
  236 |     error.status = 400
  237 |     throw error
  238 |   }
  239 | 
  240 |   ensureUniqueIdentity({ users, orgOwnerId, username: agent.username, memberId: agent.member_id })
  241 | 
  242 |   const orgAgents = users
  243 |     .filter((u) => String(u.role || '').toLowerCase() === 'agent')
  244 |     .filter((u) => String(u.org_owner_id) === String(orgOwnerId))
  245 | 
  246 |   const orgOwner = users.find((u) => String(u.id) === String(orgOwnerId)) || null
  247 |   await assertFreePlanMemberLimit(orgOwnerId, orgAgents, null, 'active', orgOwner)
  248 | 
  249 |   const rawPassword = String(payload.password || '').trim() || crypto.randomBytes(8).toString('base64url')
  250 |   agent.password_hash = await bcrypt.hash(rawPassword, 10)
  251 | 
  252 |   users.push(agent)
  253 |   await writeAllUsersRaw(users)
  254 | 
  255 |   // Surface the generated password when client didn't provide one (helps onboarding).
  256 |   const safe = cleanAgent(agent)
  257 |   if (!payload.password) return { ...safe, temporary_password: rawPassword }
  258 |   return safe
  259 | }
  260 | 
  261 | export async function updateMember(orgOwnerId, memberId, payload) {
  262 |   await migrateLegacyMembersIfNeeded()
  263 |   const users = await readAllUsersRaw()
  264 |   const idx = users.findIndex((u) => String(u.id) === String(memberId) && String(u.org_owner_id) === String(orgOwnerId) && String(u.role || '').toLowerCase() === 'agent')
  265 |   if (idx < 0) return null
  266 | 
  267 |   const current = users[idx]
  268 |   const next = normalizeAgent(orgOwnerId, payload, current)
  269 | 
  270 |   if (!['active', 'inactive'].includes(next.status)) {
  271 |     const error = new Error('status must be active or inactive')
  272 |     error.status = 400
  273 |     throw error
  274 |   }
  275 | 
  276 |   ensureUniqueIdentity({ users, orgOwnerId, username: next.username, memberId: next.member_id, currentUserId: current.id })
  277 | 
  278 |   const conflict = hasPermissionConflict(next.permissions)
  279 |   if (conflict) {
  280 |     const error = new Error(`Permission conflict: ${conflict[0]} cannot be combined with ${conflict[1]}`)
  281 |     error.status = 400
  282 |     throw error
  283 |   }
  284 | 
  285 |   const orgAgents = users
  286 |     .filter((u) => String(u.role || '').toLowerCase() === 'agent')
  287 |     .filter((u) => String(u.org_owner_id) === String(orgOwnerId))
  288 | 
  289 |   const orgOwner = users.find((u) => String(u.id) === String(orgOwnerId)) || null
  290 |   await assertFreePlanMemberLimit(orgOwnerId, orgAgents, current, next.status, orgOwner)
  291 | 
  292 |   users[idx] = {
  293 |     ...current,
  294 |     ...next,
  295 |     password_hash: current.password_hash,
  296 |   }
  297 | 
  298 |   await writeAllUsersRaw(users)
  299 |   return cleanAgent(users[idx])
  300 | }
  301 | 
  302 | export async function updateMemberPermissions(orgOwnerId, memberId, permissionsPayload, permissionMatrixPayload) {
  303 |   return updateMember(orgOwnerId, memberId, { permissions: permissionsPayload, permission_matrix: permissionMatrixPayload })
  304 | }
  305 | 
  306 | export async function resetMemberPassword(orgOwnerId, memberId) {
  307 |   await migrateLegacyMembersIfNeeded()
  308 |   const users = await readAllUsersRaw()
  309 |   const idx = users.findIndex((u) => String(u.id) === String(memberId) && String(u.org_owner_id) === String(orgOwnerId) && String(u.role || '').toLowerCase() === 'agent')
  310 |   if (idx < 0) return null
  311 | 
  312 |   const tempPassword = crypto.randomBytes(6).toString('base64url')
  313 |   users[idx] = {
  314 |     ...users[idx],
  315 |     password_hash: await bcrypt.hash(tempPassword, 10),
  316 |     password_reset_at: new Date().toISOString(),
  317 |     updated_at: new Date().toISOString(),
  318 |   }
  319 | 
  320 |   await writeAllUsersRaw(users)
  321 |   return { member: cleanAgent(users[idx]), temporary_password: tempPassword }
  322 | }
  323 | 
  324 | export async function deactivateOrRemoveMember(orgOwnerId, memberId, mode = 'deactivate') {
  325 |   await migrateLegacyMembersIfNeeded()
  326 |   const users = await readAllUsersRaw()
  327 |   const idx = users.findIndex((u) => String(u.id) === String(memberId) && String(u.org_owner_id) === String(orgOwnerId) && String(u.role || '').toLowerCase() === 'agent')
  328 |   if (idx < 0) return null
  329 | 
  330 |   if (mode === 'remove') {
  331 |     const [removed] = users.splice(idx, 1)
  332 |     await writeAllUsersRaw(users)
  333 |     return { removed: cleanAgent(removed), mode: 'remove' }
  334 |   }
  335 | 
  336 |   users[idx] = {
  337 |     ...users[idx],
  338 |     status: 'inactive',
  339 |     updated_at: new Date().toISOString(),
  340 |   }
  341 |   await writeAllUsersRaw(users)
  342 |   return { member: cleanAgent(users[idx]), mode: 'deactivate' }
  343 | }
  344 | 
  345 | export async function getMemberConstraints(orgOwnerRecord = null) {
  346 |   const config = await getAdminConfig()
  347 |   const freeLimit = Number(config?.plan_limits?.free?.agent_limit ?? DEFAULT_FREE_MEMBER_LIMIT)
  348 |   const premiumLimit = Number(config?.plan_limits?.premium?.agent_limit ?? 999)
  349 |   const plan = orgOwnerRecord ? await getPlanForUser(orgOwnerRecord) : 'free'
  350 |   return {
  351 |     plan,
  352 |     free_member_limit: freeLimit,
  353 |     premium_member_limit: premiumLimit,
  354 |     valid_permissions: [...VALID_PERMISSIONS],
  355 |     permission_conflicts: PERMISSION_CONFLICTS,
  356 |     permission_matrix_sections: MATRIX_SECTIONS,
  357 |   }
  358 | }
  359 | 