    1 | import { readJson } from '../utils/jsonStore.js'
    2 | import prisma from '../utils/prisma.js'
    3 | import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | import { isOwnerOrAdmin } from '../utils/permissions.js'
    6 | 
    7 | function buildOrgMemberIds(users = [], orgId = '') {
    8 |   const members = new Set()
    9 |   if (!orgId) return members
   10 |   members.add(String(orgId))
   11 |   users.forEach((u) => {
   12 |     if (String(u.org_owner_id || '') === String(orgId)) members.add(String(u.id))
   13 |   })
   14 |   return members
   15 | }
   16 | const USE_SQL_CRM = isCrmSqlEnabled()
   17 | 
   18 | async function readStore(fileName) {
   19 |   if (USE_SQL_CRM) {
   20 |     switch (fileName) {
   21 |       case 'users.json': return prisma.user.findMany()
   22 |       case 'messages.json': return prisma.message.findMany()
   23 |       case 'call_sessions.json': return prisma.callSession.findMany()
   24 |       case 'documents.json': return prisma.document.findMany()
   25 |       case 'leads.json': return prisma.lead.findMany()
   26 |       default: return readJson(fileName)
   27 |     }
   28 |   }
   29 |   return readLegacyJson(fileName)
   30 | }
   31 | 
   32 | function canViewCrm(actor, targetUser) {
   33 |   if (!actor || !targetUser) return false
   34 |   if (isOwnerOrAdmin(actor)) return true
   35 |   const actorId = String(actor.id || '')
   36 |   if (actorId && actorId === String(targetUser.id || '')) return true
   37 |   if (actor.role === 'agent' && String(actor.org_owner_id || '') === String(targetUser.id || '')) return true
   38 |   return false
   39 | }
   40 | 
   41 | function parseMarketplaceMatchId(matchId = '') {
   42 |   const parts = String(matchId).split(':')
   43 |   if (parts.length !== 2) return null
   44 |   return { requirementId: sanitizeString(parts[0], 120), supplierId: sanitizeString(parts[1], 120) }
   45 | }
   46 | 
   47 | function parseTimestamp(value) {
   48 |   if (!value) return null
   49 |   const ts = new Date(value).getTime()
   50 |   return Number.isFinite(ts) ? ts : null
   51 | }
   52 | 
   53 | function withinRange(value, range = {}) {
   54 |   const ts = parseTimestamp(value)
   55 |   if (!Number.isFinite(ts)) return false
   56 |   if (range.from && ts < range.from) return false
   57 |   if (range.to && ts > range.to) return false
   58 |   return true
   59 | }
   60 | 
   61 | function buildThreadTimeline(messages = [], usersById = new Map(), leadByMatch = new Map()) {
   62 |   const byMatch = new Map()
   63 |   messages.forEach((msg) => {
   64 |     const matchId = String(msg.match_id || '')
   65 |     if (!matchId) return
   66 |     if (!byMatch.has(matchId)) {
   67 |       byMatch.set(matchId, {
   68 |         match_id: matchId,
   69 |         counterparty_id: leadByMatch.get(matchId)?.counterparty_id || '',
   70 |         last_message_at: msg.timestamp || msg.created_at || '',
   71 |         message_count: 0,
   72 |         messages: [],
   73 |       })
   74 |     }
   75 |     const entry = byMatch.get(matchId)
   76 |     entry.message_count += 1
   77 |     const ts = String(msg.timestamp || msg.created_at || '')
   78 |     if (!entry.last_message_at || ts > entry.last_message_at) {
   79 |       entry.last_message_at = ts
   80 |     }
   81 |     const sender = usersById.get(String(msg.sender_id || ''))
   82 |     entry.messages.push({
   83 |       ...msg,
   84 |       sender_name: sender?.name || sender?.email || msg.sender_name || '',
   85 |       sender_role: sender?.role || msg.sender_role || '',
   86 |     })
   87 |   })
   88 | 
   89 |   for (const thread of byMatch.values()) {
   90 |     thread.messages.sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
   91 |   }
   92 | 
   93 |   return [...byMatch.values()].sort((a, b) => String(b.last_message_at || '').localeCompare(String(a.last_message_at || '')))
   94 | }
   95 | 
   96 | export async function getCrmProfileSummary(actor, targetId, options = {}) {
   97 |   const safeTarget = sanitizeString(String(targetId || ''), 120)
   98 |   if (!safeTarget) return { error: 'Target id required' }
   99 | 
  100 |   const [users, messages, calls, documents, leads] = await Promise.all([
  101 |     readStore('users.json'),
  102 |     readStore('messages.json'),
  103 |     readStore('call_sessions.json'),
  104 |     readStore('documents.json'),
  105 |     readStore('leads.json'),
  106 |   ])
  107 | 
  108 |   const targetUser = (Array.isArray(users) ? users : []).find((u) => String(u.id) === safeTarget) || null
  109 |   if (!targetUser) return { error: 'Target user not found' }
  110 |   if (!canViewCrm(actor, targetUser)) return { error: 'forbidden' }
  111 | 
  112 |   const orgId = String(targetUser.id || '')
  113 |   const orgMembers = buildOrgMemberIds(users, orgId)
  114 | 
  115 |   const range = {
  116 |     from: parseTimestamp(options?.from),
  117 |     to: parseTimestamp(options?.to),
  118 |   }
  119 | 
  120 |   const messageRows = (Array.isArray(messages) ? messages : []).filter((m) => {
  121 |     const matchId = String(m.match_id || '')
  122 |     const senderId = String(m.sender_id || '')
  123 |     if (orgMembers.has(senderId)) return true
  124 |     if (matchId.endsWith(`:${orgId}`)) return true
  125 |     if (matchId.startsWith('friend:') && orgMembers.has(senderId)) return true
  126 |     return false
  127 |   })
  128 |     .filter((m) => (options?.match_id ? String(m.match_id || '') === String(options.match_id) : true))
  129 |     .filter((m) => (range.from || range.to ? withinRange(m.timestamp || m.created_at, range) : true))
  130 | 
  131 |   const leadRows = (Array.isArray(leads) ? leads : [])
  132 |     .filter((l) => String(l.org_owner_id || '') === orgId)
  133 |     .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  134 | 
  135 |   const leadByMatch = new Map(leadRows.map((lead) => [String(lead.match_id || ''), lead]))
  136 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  137 | 
  138 |   const threads = buildThreadTimeline(messageRows, usersById, leadByMatch)
  139 | 
  140 |   const callRows = (Array.isArray(calls) ? calls : []).filter((c) => {
  141 |     const participants = Array.isArray(c.participant_ids) ? c.participant_ids.map(String) : []
  142 |     return participants.some((id) => orgMembers.has(id))
  143 |   })
  144 |     .filter((c) => (options?.match_id ? String(c.match_id || c?.context?.chat_thread_id || '') === String(options.match_id) : true))
  145 |     .filter((c) => (range.from || range.to ? withinRange(c.created_at || c.started_at, range) : true))
  146 | 
  147 |   const callItems = callRows
  148 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  149 |     .map((row) => ({
  150 |       ...row,
  151 |       participants: Array.isArray(row.participant_ids)
  152 |         ? row.participant_ids.map((id) => {
  153 |           const user = usersById.get(String(id))
  154 |           return { id, name: user?.name || user?.email || id }
  155 |         })
  156 |         : [],
  157 |     }))
  158 | 
  159 |   const contractRows = (Array.isArray(documents) ? documents : [])
  160 |     .filter((d) => String(d.entity_type || '').toLowerCase() === 'contract')
  161 |     .filter((d) => String(d.buyer_id || '') === orgId || String(d.factory_id || '') === orgId)
  162 |     .filter((d) => {
  163 |       if (!options?.match_id) return true
  164 |       const parsed = parseMarketplaceMatchId(String(options.match_id))
  165 |       if (!parsed) return true
  166 |       return String(d.factory_id || '') === String(parsed.supplierId)
  167 |     })
  168 |     .filter((d) => (range.from || range.to ? withinRange(d.updated_at || d.created_at, range) : true))
  169 |   const contractItems = contractRows
  170 |     .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))
  171 |     .map((row) => ({
  172 |       ...row,
  173 |       signed_at: row.buyer_signed_at || row.factory_signed_at || '',
  174 |     }))
  175 | 
  176 |   const leadStatusCounts = leadRows.reduce((acc, lead) => {
  177 |     const key = String(lead.status || 'new')
  178 |     acc[key] = (acc[key] || 0) + 1
  179 |     return acc
  180 |   }, {})
  181 | 
  182 |   const agentOutcomes = (Array.isArray(users) ? users : [])
  183 |     .filter((u) => String(u.org_owner_id || '') === orgId && String(u.role || '').toLowerCase() === 'agent')
  184 |     .map((agent) => {
  185 |       const assigned = leadRows.filter((l) => String(l.assigned_agent_id || '') === String(agent.id))
  186 |       const closed = assigned.filter((l) => String(l.status || '') === 'closed').length
  187 |       const confirmed = assigned.filter((l) => String(l.status || '') === 'order_confirmed').length
  188 |       const converted = assigned.filter((l) => Boolean(l.conversion_at)).length
  189 |       return {
  190 |         agent_id: agent.id,
  191 |         name: agent.name || agent.email || agent.id,
  192 |         assigned_leads: assigned.length,
  193 |         closed_leads: closed,
  194 |         orders_confirmed: confirmed,
  195 |         conversions: converted,
  196 |       }
  197 |     })
  198 | 
  199 |   const previousOrders = contractItems
  200 |     .filter((row) => String(row.lifecycle_status || '').toLowerCase() === 'signed')
  201 |     .sort((a, b) => String(b.signed_at || '').localeCompare(String(a.signed_at || '')))
  202 | 
  203 |   return {
  204 |     org_id: orgId,
  205 |     role: targetUser.role || '',
  206 |     leads: {
  207 |       total: leadRows.length,
  208 |       by_status: leadStatusCounts,
  209 |       latest: leadRows.slice(0, 6),
  210 |     },
  211 |     messages: {
  212 |       total_threads: threads.length,
  213 |       total_messages: messageRows.length,
  214 |       threads,
  215 |     },
  216 |     calls: {
  217 |       total: callRows.length,
  218 |       items: callItems,
  219 |     },
  220 |     contracts: {
  221 |       total: contractRows.length,
  222 |       items: contractItems,
  223 |     },
  224 |     previous_orders: previousOrders,
  225 |     agent_outcomes: agentOutcomes,
  226 |   }
  227 | }
  228 | 
  229 | export async function getCrmRelationshipTimeline(actor, counterpartyId, options = {}) {
  230 |   const safeCounterparty = sanitizeString(String(counterpartyId || ''), 120)
  231 |   if (!safeCounterparty) return { error: 'Counterparty id required' }
  232 | 
  233 |   const actorOrgId = String(actor?.role || '').toLowerCase() === 'agent'
  234 |     ? sanitizeString(actor?.org_owner_id || '', 120)
  235 |     : sanitizeString(actor?.id || '', 120)
  236 |   if (!actorOrgId) return { error: 'forbidden' }
  237 | 
  238 |   const [users, messages, calls, documents, leads] = await Promise.all([
  239 |     readStore('users.json'),
  240 |     readStore('messages.json'),
  241 |     readStore('call_sessions.json'),
  242 |     readStore('documents.json'),
  243 |     readStore('leads.json'),
  244 |   ])
  245 | 
  246 |   const allUsers = Array.isArray(users) ? users : []
  247 |   const orgUser = allUsers.find((u) => String(u.id) === actorOrgId) || null
  248 |   if (!orgUser) return { error: 'Organization not found' }
  249 |   if (!canViewCrm(actor, orgUser)) return { error: 'forbidden' }
  250 | 
  251 |   const counterparty = allUsers.find((u) => String(u.id) === safeCounterparty) || null
  252 | 
  253 |   const orgMembers = buildOrgMemberIds(allUsers, actorOrgId)
  254 |   const range = {
  255 |     from: parseTimestamp(options?.from),
  256 |     to: parseTimestamp(options?.to),
  257 |   }
  258 | 
  259 |   const leadRows = (Array.isArray(leads) ? leads : [])
  260 |     .filter((l) => String(l.org_owner_id || '') === actorOrgId)
  261 |     .filter((l) => String(l.counterparty_id || '') === safeCounterparty)
  262 |     .filter((l) => (options?.match_id ? String(l.match_id || '') === String(options.match_id) : true))
  263 |     .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  264 | 
  265 |   const matchIds = new Set(leadRows.map((lead) => String(lead.match_id || '')).filter(Boolean))
  266 |   const messageRows = (Array.isArray(messages) ? messages : [])
  267 |     .filter((m) => matchIds.has(String(m.match_id || '')))
  268 |     .filter((m) => (range.from || range.to ? withinRange(m.timestamp || m.created_at, range) : true))
  269 | 
  270 |   const leadByMatch = new Map(leadRows.map((lead) => [String(lead.match_id || ''), lead]))
  271 |   const usersById = new Map(allUsers.map((u) => [String(u.id), u]))
  272 |   const threads = buildThreadTimeline(messageRows, usersById, leadByMatch)
  273 | 
  274 |   const callRows = (Array.isArray(calls) ? calls : [])
  275 |     .filter((c) => {
  276 |       const participants = Array.isArray(c.participant_ids) ? c.participant_ids.map(String) : []
  277 |       if (!participants.some((id) => orgMembers.has(id))) return false
  278 |       if (!participants.includes(safeCounterparty)) return false
  279 |       return true
  280 |     })
  281 |     .filter((c) => (options?.match_id ? String(c.match_id || c?.context?.chat_thread_id || '') === String(options.match_id) : true))
  282 |     .filter((c) => (range.from || range.to ? withinRange(c.created_at || c.started_at, range) : true))
  283 | 
  284 |   const callItems = callRows
  285 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  286 |     .map((row) => ({
  287 |       ...row,
  288 |       participants: Array.isArray(row.participant_ids)
  289 |         ? row.participant_ids.map((id) => {
  290 |           const user = usersById.get(String(id))
  291 |           return { id, name: user?.name || user?.email || id }
  292 |         })
  293 |         : [],
  294 |     }))
  295 | 
  296 |   const contractRows = (Array.isArray(documents) ? documents : [])
  297 |     .filter((d) => String(d.entity_type || '').toLowerCase() === 'contract')
  298 |     .filter((d) => {
  299 |       const buyerId = String(d.buyer_id || '')
  300 |       const factoryId = String(d.factory_id || '')
  301 |       return (buyerId === actorOrgId && factoryId === safeCounterparty) || (factoryId === actorOrgId && buyerId === safeCounterparty)
  302 |     })
  303 |     .filter((d) => (range.from || range.to ? withinRange(d.updated_at || d.created_at, range) : true))
  304 | 
  305 |   const contractItems = contractRows
  306 |     .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))
  307 |     .map((row) => ({
  308 |       ...row,
  309 |       signed_at: row.buyer_signed_at || row.factory_signed_at || '',
  310 |     }))
  311 | 
  312 |   const previousOrders = contractItems
  313 |     .filter((row) => String(row.lifecycle_status || '').toLowerCase() === 'signed')
  314 |     .sort((a, b) => String(b.signed_at || '').localeCompare(String(a.signed_at || '')))
  315 | 
  316 |   const leadStatusCounts = leadRows.reduce((acc, lead) => {
  317 |     const key = String(lead.status || 'new')
  318 |     acc[key] = (acc[key] || 0) + 1
  319 |     return acc
  320 |   }, {})
  321 | 
  322 |   const agentOutcomes = allUsers
  323 |     .filter((u) => String(u.org_owner_id || '') === actorOrgId && String(u.role || '').toLowerCase() === 'agent')
  324 |     .map((agent) => {
  325 |       const assigned = leadRows.filter((l) => String(l.assigned_agent_id || '') === String(agent.id))
  326 |       const closed = assigned.filter((l) => String(l.status || '') === 'closed').length
  327 |       const confirmed = assigned.filter((l) => String(l.status || '') === 'order_confirmed').length
  328 |       const converted = assigned.filter((l) => Boolean(l.conversion_at)).length
  329 |       return {
  330 |         agent_id: agent.id,
  331 |         name: agent.name || agent.email || agent.id,
  332 |         assigned_leads: assigned.length,
  333 |         closed_leads: closed,
  334 |         orders_confirmed: confirmed,
  335 |         conversions: converted,
  336 |       }
  337 |     })
  338 | 
  339 |   return {
  340 |     org_id: actorOrgId,
  341 |     role: orgUser.role || '',
  342 |     counterparty_id: safeCounterparty,
  343 |     counterparty: counterparty ? {
  344 |       id: counterparty.id,
  345 |       name: counterparty.name || '',
  346 |       role: counterparty.role || '',
  347 |       verified: Boolean(counterparty.verified),
  348 |       country: counterparty?.profile?.country || '',
  349 |     } : null,
  350 |     leads: {
  351 |       total: leadRows.length,
  352 |       by_status: leadStatusCounts,
  353 |       latest: leadRows.slice(0, 6),
  354 |     },
  355 |     messages: {
  356 |       total_threads: threads.length,
  357 |       total_messages: messageRows.length,
  358 |       threads,
  359 |     },
  360 |     calls: {
  361 |       total: callRows.length,
  362 |       items: callItems,
  363 |     },
  364 |     contracts: {
  365 |       total: contractRows.length,
  366 |       items: contractItems,
  367 |     },
  368 |     previous_orders: previousOrders,
  369 |     agent_outcomes: agentOutcomes,
  370 |   }
  371 | }
  372 | 