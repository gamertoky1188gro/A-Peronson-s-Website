    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import prisma from '../utils/prisma.js'
    4 | import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
    5 | import { sanitizeString } from '../utils/validators.js'
    6 | import { forbiddenError, isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
    7 | import { getPlanForUser } from './entitlementService.js'
    8 | import { trackEvent } from './eventTrackingService.js'
    9 | import { applyLeadOpsOnCreateOrUpdate, evaluateAndEscalateLeadIfBreached } from './enterpriseOpsService.js'
   10 | 
   11 | const LEADS_FILE = 'leads.json'
   12 | const NOTES_FILE = 'lead_notes.json'
   13 | const REMINDERS_FILE = 'lead_reminders.json'
   14 | const ASSIGNMENTS_FILE = 'lead_assignments.json'
   15 | const USERS_FILE = 'users.json'
   16 | const REQUIREMENTS_FILE = 'requirements.json'
   17 | const USE_SQL_CRM = isCrmSqlEnabled()
   18 | 
   19 | async function readStore(fileName) {
   20 |   if (USE_SQL_CRM) {
   21 |     return readJson(fileName)
   22 |   }
   23 |   return readLegacyJson(fileName)
   24 | }
   25 | 
   26 | const LEAD_STATUSES = new Set([
   27 |   'new',
   28 |   'contacted',
   29 |   'negotiating',
   30 |   'sample_sent',
   31 |   'order_confirmed',
   32 |   'closed',
   33 | ])
   34 | 
   35 | export const LEAD_STATUS_LABELS = {
   36 |   new: 'New',
   37 |   contacted: 'Contacted',
   38 |   negotiating: 'Negotiating',
   39 |   sample_sent: 'Sample Sent',
   40 |   order_confirmed: 'Order Confirmed',
   41 |   closed: 'Closed',
   42 | }
   43 | 
   44 | function normalizeStatus(value, fallback = 'new') {
   45 |   const status = sanitizeString(String(value || ''), 40).toLowerCase().replace(/\s+/g, '_')
   46 |   return LEAD_STATUSES.has(status) ? status : fallback
   47 | }
   48 | 
   49 | function parseFriendMatchId(matchId = '') {
   50 |   const parts = String(matchId).split(':')
   51 |   if (parts.length !== 3 || parts[0] !== 'friend') return null
   52 |   const first = sanitizeString(parts[1], 120)
   53 |   const second = sanitizeString(parts[2], 120)
   54 |   if (!first || !second) return null
   55 |   return [first, second]
   56 | }
   57 | 
   58 | function parseMarketplaceMatchId(matchId = '') {
   59 |   // Marketplace threads use the format `${requirementId}:${factoryOrSupplierId}`.
   60 |   const parts = String(matchId).split(':')
   61 |   if (parts.length !== 2) return null
   62 |   const requirementId = sanitizeString(parts[0], 120)
   63 |   const supplierId = sanitizeString(parts[1], 120)
   64 |   if (!requirementId || !supplierId) return null
   65 |   return { requirementId, supplierId }
   66 | }
   67 | 
   68 | async function resolveBuyerId(requirementId) {
   69 |   if (!requirementId) return ''
   70 |   const requirements = await readStore(REQUIREMENTS_FILE)
   71 |   const requirement = requirements.find((row) => String(row?.id || '') === String(requirementId)) || null
   72 |   return sanitizeString(requirement?.buyer_id || requirement?.buyerId || '', 120)
   73 | }
   74 | 
   75 | function actorOrgOwnerId(actor) {
   76 |   if (!actor) return ''
   77 |   if (isAgent(actor)) return sanitizeString(actor.org_owner_id || '', 120)
   78 |   return sanitizeString(actor.id || '', 120)
   79 | }
   80 | 
   81 | const LEAD_SOURCE_TYPES = new Set([
   82 |   'buyer_request',
   83 |   'product',
   84 |   'feed_post',
   85 |   'search',
   86 |   'direct',
   87 |   'message',
   88 | ])
   89 | 
   90 | function normalizeLeadSourceType(value, fallback = '') {
   91 |   const normalized = sanitizeString(String(value || ''), 40).toLowerCase().replace(/\s+/g, '_')
   92 |   if (LEAD_SOURCE_TYPES.has(normalized)) return normalized
   93 |   return fallback
   94 | }
   95 | 
   96 | function canAccessLead(actor, lead) {
   97 |   if (!actor || !lead) return false
   98 |   if (isOwnerOrAdmin(actor)) return true
   99 | 
  100 |   const actorId = String(actor.id || '')
  101 |   const orgId = actorOrgOwnerId(actor)
  102 |   if (orgId && String(lead.org_owner_id || '') !== orgId) return false
  103 | 
  104 |   if (isAgent(actor)) {
  105 |     return String(lead.assigned_agent_id || '') === actorId
  106 |   }
  107 | 
  108 |   return true
  109 | }
  110 | 
  111 | function ensureLeadAccess(actor, lead) {
  112 |   if (canAccessLead(actor, lead)) return
  113 |   throw forbiddenError()
  114 | }
  115 | 
  116 | function ensureLeadWriteAccess(actor, lead) {
  117 |   if (!actor || !lead) throw forbiddenError()
  118 |   if (isOwnerOrAdmin(actor)) return
  119 | 
  120 |   const orgId = actorOrgOwnerId(actor)
  121 |   if (!orgId || String(lead.org_owner_id || '') !== orgId) throw forbiddenError()
  122 | 
  123 |   if (isAgent(actor)) {
  124 |     // Agents can only update/annotate their assigned leads.
  125 |     if (String(lead.assigned_agent_id || '') !== String(actor.id || '')) throw forbiddenError()
  126 |     return
  127 |   }
  128 | }
  129 | 
  130 | function pickCounterparty({ buyerId, supplierId, orgOwnerId, friendPair }) {
  131 |   if (Array.isArray(friendPair)) {
  132 |     return friendPair.find((id) => id !== orgOwnerId) || ''
  133 |   }
  134 | 
  135 |   if (orgOwnerId === supplierId) return buyerId || ''
  136 |   if (orgOwnerId === buyerId) return supplierId || ''
  137 |   return buyerId || supplierId || ''
  138 | }
  139 | 
  140 | export async function upsertLeadFromMessage({ match_id, sender_id, timestamp, source_type, source_id, source_label }) {
  141 |   const matchId = sanitizeString(match_id || '', 240)
  142 |   const senderId = sanitizeString(sender_id || '', 120)
  143 |   if (!matchId) return null
  144 | 
  145 |   const users = await readStore(USERS_FILE)
  146 |   const usersById = new Map(users.map((u) => [u.id, u]))
  147 |   const sender = usersById.get(senderId) || null
  148 | 
  149 |   const friendPair = parseFriendMatchId(matchId)
  150 |   const marketplace = friendPair ? null : parseMarketplaceMatchId(matchId)
  151 |   const buyerId = marketplace ? await resolveBuyerId(marketplace.requirementId) : ''
  152 |   const supplierId = marketplace ? marketplace.supplierId : ''
  153 |   const derivedSourceType = marketplace ? 'buyer_request' : (friendPair ? 'direct' : 'message')
  154 |   const derivedSourceId = marketplace?.requirementId || matchId || ''
  155 |   const overrideSourceType = normalizeLeadSourceType(source_type, '')
  156 |   const overrideSourceId = sanitizeString(source_id || '', 200)
  157 |   const overrideSourceLabel = sanitizeString(source_label || '', 160)
  158 |   const leadSourceType = overrideSourceType || derivedSourceType
  159 |   const leadSourceId = overrideSourceId || derivedSourceId
  160 | 
  161 |   const orgTargets = new Map()
  162 | 
  163 |   // If an agent sends a message, it should become a lead for their owning org.
  164 |   if (sender?.role === 'agent' && sender.org_owner_id) {
  165 |     orgTargets.set(sender.org_owner_id, { assigned_agent_id: sender.id })
  166 |   }
  167 | 
  168 |   // Marketplace supplier side (factory/buying_house account id in match id).
  169 |   const supplierUser = supplierId ? usersById.get(supplierId) : null
  170 |   if (supplierUser && ['factory', 'buying_house'].includes(String(supplierUser.role || '').toLowerCase())) {
  171 |     orgTargets.set(supplierUser.id, orgTargets.get(supplierUser.id) || {})
  172 |   }
  173 | 
  174 |   // If buyer side is an org (rare), allow CRM for that org too.
  175 |   const buyerUser = buyerId ? usersById.get(buyerId) : null
  176 |   if (buyerUser && ['factory', 'buying_house'].includes(String(buyerUser.role || '').toLowerCase())) {
  177 |     orgTargets.set(buyerUser.id, orgTargets.get(buyerUser.id) || {})
  178 |   }
  179 | 
  180 |   // Friend threads: create lead for any org-like participant (factory/buying_house) or agent owner.
  181 |   if (Array.isArray(friendPair)) {
  182 |     friendPair.forEach((id) => {
  183 |       const u = usersById.get(id)
  184 |       if (!u) return
  185 |       const role = String(u.role || '').toLowerCase()
  186 |       if (role === 'factory' || role === 'buying_house') orgTargets.set(u.id, orgTargets.get(u.id) || {})
  187 |     })
  188 |   }
  189 | 
  190 |   if (orgTargets.size === 0) return null
  191 | 
  192 |   const leads = await readStore(LEADS_FILE)
  193 |   const now = new Date().toISOString()
  194 |   const interactionAt = sanitizeString(timestamp || now, 64) || now
  195 |   const updated = []
  196 | 
  197 |   const leadCountsByAgent = leads.reduce((acc, row) => {
  198 |     const agentId = String(row.assigned_agent_id || '')
  199 |     if (!agentId) return acc
  200 |     acc[agentId] = (acc[agentId] || 0) + 1
  201 |     return acc
  202 |   }, {})
  203 | 
  204 |   const agentsByOrg = users.reduce((acc, u) => {
  205 |     if (String(u.role || '').toLowerCase() !== 'agent') return acc
  206 |     const ownerId = String(u.org_owner_id || '')
  207 |     if (!ownerId) return acc
  208 |     if (!acc.has(ownerId)) acc.set(ownerId, [])
  209 |     acc.get(ownerId).push(u)
  210 |     return acc
  211 |   }, new Map())
  212 | 
  213 |   function pickLeastLoadedAgent(orgOwnerId) {
  214 |     const agents = agentsByOrg.get(String(orgOwnerId || '')) || []
  215 |     if (!agents.length) return ''
  216 |     const sorted = agents.slice().sort((a, b) => {
  217 |       const aCount = (leadCountsByAgent[String(a.id)] || 0) + Number(a.assigned_requests || 0)
  218 |       const bCount = (leadCountsByAgent[String(b.id)] || 0) + Number(b.assigned_requests || 0)
  219 |       return aCount - bCount
  220 |     })
  221 |     return String(sorted[0]?.id || '')
  222 |   }
  223 | 
  224 |   for (const [orgOwnerId, extras] of orgTargets.entries()) {
  225 |     const orgId = sanitizeString(String(orgOwnerId || ''), 120)
  226 |     if (!orgId) continue
  227 | 
  228 |     const orgOwner = usersById.get(orgId)
  229 |     const plan = orgOwner ? await getPlanForUser(orgOwner) : 'free'
  230 |     const allowAutoAssign = plan === 'premium'
  231 | 
  232 |     const existingIndex = leads.findIndex((lead) => String(lead.org_owner_id || '') === orgId && String(lead.match_id || '') === matchId)
  233 |     const counterpartyId = pickCounterparty({ buyerId, supplierId, orgOwnerId: orgId, friendPair })
  234 |     const autoAssignedAgent = !extras.assigned_agent_id && allowAutoAssign ? pickLeastLoadedAgent(orgId) : ''
  235 | 
  236 |     if (existingIndex >= 0) {
  237 |       const current = leads[existingIndex]
  238 |       const nextLead = {
  239 |         ...current,
  240 |         counterparty_id: current.counterparty_id || counterpartyId,
  241 |         assigned_agent_id: extras.assigned_agent_id || current.assigned_agent_id || autoAssignedAgent || '',
  242 |         source_type: current.source_type || leadSourceType,
  243 |         source_id: current.source_id || leadSourceId,
  244 |         source_label: current.source_label || overrideSourceLabel || '',
  245 |         last_interaction_at: interactionAt,
  246 |         updated_at: now,
  247 |       }
  248 |       leads[existingIndex] = await applyLeadOpsOnCreateOrUpdate({
  249 |         actor: sender || { id: orgId, org_owner_id: orgId, role: 'owner' },
  250 |         lead: nextLead,
  251 |         trigger: 'update',
  252 |       })
  253 |       updated.push(leads[existingIndex])
  254 |       if (!current.source_type && leadSourceType) {
  255 |         await trackEvent({
  256 |           type: 'lead_source_attached',
  257 |           actor_id: senderId || orgId,
  258 |           entity_id: current.id,
  259 |           metadata: { source_type: leadSourceType, source_id: leadSourceId },
  260 |         })
  261 |       }
  262 |       continue
  263 |     }
  264 | 
  265 |     const baseRow = {
  266 |       id: crypto.randomUUID(),
  267 |       org_owner_id: orgId,
  268 |       match_id: matchId,
  269 |       counterparty_id: counterpartyId,
  270 |       source: 'message',
  271 |       source_type: leadSourceType,
  272 |       source_id: leadSourceId,
  273 |       source_label: overrideSourceLabel || '',
  274 |       status: 'new',
  275 |       assigned_agent_id: extras.assigned_agent_id || autoAssignedAgent || '',
  276 |       created_at: now,
  277 |       updated_at: now,
  278 |       last_interaction_at: interactionAt,
  279 |       conversion_at: '',
  280 |     }
  281 |     const row = await applyLeadOpsOnCreateOrUpdate({
  282 |       actor: sender || { id: orgId, org_owner_id: orgId, role: 'owner' },
  283 |       lead: baseRow,
  284 |       trigger: 'create',
  285 |     })
  286 |     leads.push(row)
  287 |     updated.push(row)
  288 |     await trackEvent({ type: 'lead_created', actor_id: senderId || orgId, entity_id: row.id, metadata: { source_type: leadSourceType, source_id: leadSourceId } })
  289 |     if (leadSourceType) {
  290 |       await trackEvent({
  291 |         type: 'lead_source_attached',
  292 |         actor_id: senderId || orgId,
  293 |         entity_id: row.id,
  294 |         metadata: { source_type: leadSourceType, source_id: leadSourceId },
  295 |       })
  296 |     }
  297 |   }
  298 | 
  299 |   await writeJson(LEADS_FILE, leads)
  300 |   await Promise.all(updated.map((lead) => evaluateAndEscalateLeadIfBreached({
  301 |     actor: sender || { id: lead.org_owner_id, org_owner_id: lead.org_owner_id, role: 'owner' },
  302 |     lead,
  303 |   })))
  304 |   return updated
  305 | }
  306 | 
  307 | export async function markLeadConvertedFromContract({ buyerId, factoryId, contractId }) {
  308 |   const safeBuyer = sanitizeString(String(buyerId || ''), 120)
  309 |   const safeFactory = sanitizeString(String(factoryId || ''), 120)
  310 |   const safeContract = sanitizeString(String(contractId || ''), 120)
  311 |   if (!safeBuyer || !safeFactory || !safeContract) return []
  312 | 
  313 |   const leads = await readStore(LEADS_FILE)
  314 |   let touched = false
  315 |   const now = new Date().toISOString()
  316 |   const updated = []
  317 | 
  318 |   const next = leads.map((lead) => {
  319 |     const orgId = String(lead.org_owner_id || '')
  320 |     const counterparty = String(lead.counterparty_id || '')
  321 |     const shouldMatch = (orgId === safeFactory && counterparty === safeBuyer) || (orgId === safeBuyer && counterparty === safeFactory)
  322 |     if (!shouldMatch) return lead
  323 |     if (lead.conversion_at) return lead
  324 |     const row = {
  325 |       ...lead,
  326 |       conversion_at: now,
  327 |       updated_at: now,
  328 |     }
  329 |     touched = true
  330 |     updated.push(row)
  331 |     return row
  332 |   })
  333 | 
  334 |   if (touched) {
  335 |     await writeJson(LEADS_FILE, next)
  336 |     await trackEvent({ type: 'lead_converted', actor_id: safeFactory || safeBuyer, entity_id: safeContract, metadata: { buyer_id: safeBuyer, factory_id: safeFactory } })
  337 |   }
  338 | 
  339 |   return updated
  340 | }
  341 | 
  342 | export async function listLeads(actor) {
  343 |   if (USE_SQL_CRM) {
  344 |     if (isOwnerOrAdmin(actor)) {
  345 |       return prisma.lead.findMany({ orderBy: { updated_at: 'desc' } })
  346 |     }
  347 |     const orgId = actorOrgOwnerId(actor)
  348 |     if (isAgent(actor)) {
  349 |       return prisma.lead.findMany({
  350 |         where: { org_owner_id: orgId, assigned_agent_id: String(actor.id || '') },
  351 |         orderBy: { updated_at: 'desc' },
  352 |       })
  353 |     }
  354 |     return prisma.lead.findMany({
  355 |       where: { org_owner_id: orgId },
  356 |       orderBy: { updated_at: 'desc' },
  357 |     })
  358 |   }
  359 | 
  360 |   const leads = await readStore(LEADS_FILE)
  361 |   if (isOwnerOrAdmin(actor)) return leads.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  362 | 
  363 |   const orgId = actorOrgOwnerId(actor)
  364 |   const filtered = leads.filter((lead) => String(lead.org_owner_id || '') === orgId)
  365 | 
  366 |   if (isAgent(actor)) {
  367 |     return filtered
  368 |       .filter((lead) => String(lead.assigned_agent_id || '') === String(actor.id || ''))
  369 |       .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  370 |   }
  371 | 
  372 |   return filtered.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  373 | }
  374 | 
  375 | export async function getLeadById(actor, leadId) {
  376 |   const id = sanitizeString(String(leadId || ''), 120)
  377 |   if (USE_SQL_CRM) {
  378 |     const actorOrgId = actorOrgOwnerId(actor)
  379 |     const lead = await prisma.lead.findFirst({
  380 |       where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
  381 |     })
  382 |     if (!lead) return null
  383 |     ensureLeadAccess(actor, lead)
  384 |     const [notes, reminders] = await Promise.all([
  385 |       prisma.leadNote.findMany({ where: { lead_id: id }, orderBy: { created_at: 'desc' } }),
  386 |       prisma.leadReminder.findMany({ where: { lead_id: id }, orderBy: { remind_at: 'asc' } }),
  387 |     ])
  388 |     return { ...lead, notes, reminders }
  389 |   }
  390 | 
  391 |   const leads = await readStore(LEADS_FILE)
  392 |   const lead = leads.find((row) => String(row.id) === id) || null
  393 |   if (!lead) return null
  394 |   ensureLeadAccess(actor, lead)
  395 | 
  396 |   const [notes, reminders] = await Promise.all([readJson(NOTES_FILE), readJson(REMINDERS_FILE)])
  397 |   return {
  398 |     ...lead,
  399 |     notes: notes.filter((n) => String(n.lead_id || '') === id).sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || ''))),
  400 |     reminders: reminders.filter((r) => String(r.lead_id || '') === id).sort((a, b) => String(a.remind_at || '').localeCompare(String(b.remind_at || ''))),
  401 |   }
  402 | }
  403 | 
  404 | export async function getLeadByMatch(actor, matchId) {
  405 |   const id = sanitizeString(String(matchId || ''), 160)
  406 |   if (!id) return null
  407 |   if (USE_SQL_CRM) {
  408 |     const actorOrgId = actorOrgOwnerId(actor)
  409 |     const lead = await prisma.lead.findFirst({
  410 |       where: isOwnerOrAdmin(actor) ? { match_id: id } : { match_id: id, org_owner_id: actorOrgId },
  411 |     })
  412 |     if (!lead) return null
  413 |     ensureLeadAccess(actor, lead)
  414 |     const [notes, reminders] = await Promise.all([
  415 |       prisma.leadNote.findMany({ where: { lead_id: String(lead.id) }, orderBy: { created_at: 'desc' } }),
  416 |       prisma.leadReminder.findMany({ where: { lead_id: String(lead.id) }, orderBy: { remind_at: 'asc' } }),
  417 |     ])
  418 |     return { ...lead, notes, reminders }
  419 |   }
  420 | 
  421 |   const leads = await readStore(LEADS_FILE)
  422 |   const lead = leads.find((row) => String(row.match_id || '') === id) || null
  423 |   if (!lead) return null
  424 |   ensureLeadAccess(actor, lead)
  425 | 
  426 |   const [notes, reminders] = await Promise.all([readJson(NOTES_FILE), readJson(REMINDERS_FILE)])
  427 |   return {
  428 |     ...lead,
  429 |     notes: notes.filter((n) => String(n.lead_id || '') === String(lead.id)).sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || ''))),
  430 |     reminders: reminders.filter((r) => String(r.lead_id || '') === String(lead.id)).sort((a, b) => String(a.remind_at || '').localeCompare(String(b.remind_at || ''))),
  431 |   }
  432 | }
  433 | 
  434 | export async function updateLead(actor, leadId, patch = {}) {
  435 |   const id = sanitizeString(String(leadId || ''), 120)
  436 |   if (USE_SQL_CRM) {
  437 |     const actorOrgId = actorOrgOwnerId(actor)
  438 |     const current = await prisma.lead.findFirst({
  439 |       where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
  440 |     })
  441 |     if (!current) return null
  442 |     ensureLeadWriteAccess(actor, current)
  443 | 
  444 |     const assignedAgentId = patch.assigned_agent_id !== undefined
  445 |       ? sanitizeString(String(patch.assigned_agent_id || ''), 120) || null
  446 |       : current.assigned_agent_id
  447 |     if (!isAgent(actor) && assignedAgentId) {
  448 |       const assignedAgent = await prisma.user.findFirst({
  449 |         where: { id: assignedAgentId, role: 'agent', org_owner_id: current.org_owner_id },
  450 |       })
  451 |       if (!assignedAgent) throw forbiddenError()
  452 |     }
  453 | 
  454 |     let updated = await prisma.lead.update({
  455 |       where: { id },
  456 |       data: {
  457 |         status: patch.status !== undefined ? normalizeStatus(patch.status, current.status || 'new') : current.status,
  458 |         ...(isAgent(actor) ? {} : { assigned_agent_id: assignedAgentId }),
  459 |         updated_at: new Date(),
  460 |       },
  461 |     })
  462 |     const opsLead = await applyLeadOpsOnCreateOrUpdate({ actor, lead: updated, trigger: 'update' })
  463 |     if (String(updated.assigned_agent_id || '') !== String(opsLead.assigned_agent_id || '')) {
  464 |       updated = await prisma.lead.update({
  465 |         where: { id },
  466 |         data: { assigned_agent_id: opsLead.assigned_agent_id || null, updated_at: new Date() },
  467 |       })
  468 |     } else {
  469 |       updated = opsLead
  470 |     }
  471 |     if (!isAgent(actor) && patch.assigned_agent_id !== undefined && String(current.assigned_agent_id || '') !== String(updated.assigned_agent_id || '')) {
  472 |       const now = new Date()
  473 |       await prisma.leadAssignment.create({
  474 |         data: {
  475 |           id: crypto.randomUUID(),
  476 |           lead_id: updated.id,
  477 |           org_owner_id: updated.org_owner_id,
  478 |           assigned_by: String(actor.id || ''),
  479 |           assigned_to: updated.assigned_agent_id || null,
  480 |           previous_assignee: current.assigned_agent_id || null,
  481 |           reason: sanitizeString(String(patch.assignment_reason || 'manual_assignment'), 180) || 'manual_assignment',
  482 |           assigned_at: now,
  483 |           created_at: now,
  484 |         },
  485 |       })
  486 |       await trackEvent({
  487 |         type: 'lead_reassigned',
  488 |         actor_id: String(actor.id || ''),
  489 |         entity_id: updated.id,
  490 |         entityType: 'lead',
  491 |         metadata: { org_owner_id: updated.org_owner_id, assigned_to: updated.assigned_agent_id || '' },
  492 |         allowUnknownTypes: true,
  493 |       })
  494 |     }
  495 |     await evaluateAndEscalateLeadIfBreached({ actor, lead: updated })
  496 |     return updated
  497 |   }
  498 | 
  499 |   const leads = await readStore(LEADS_FILE)
  500 |   const idx = leads.findIndex((row) => String(row.id) === id)
  501 |   if (idx < 0) return null
  502 | 
  503 |   const current = leads[idx]
  504 |   ensureLeadWriteAccess(actor, current)
  505 | 
  506 |   let next = {
  507 |     ...current,
  508 |     status: patch.status !== undefined ? normalizeStatus(patch.status, current.status) : current.status,
  509 |     // Main accounts can assign leads to an agent; agents cannot reassign.
  510 |     ...(isAgent(actor) ? {} : { assigned_agent_id: patch.assigned_agent_id !== undefined ? sanitizeString(String(patch.assigned_agent_id || ''), 120) : current.assigned_agent_id }),
  511 |     updated_at: new Date().toISOString(),
  512 |   }
  513 |   next = await applyLeadOpsOnCreateOrUpdate({ actor, lead: next, trigger: 'update' })
  514 | 
  515 |   leads[idx] = next
  516 |   await writeJson(LEADS_FILE, leads)
  517 |   if (!isAgent(actor) && patch.assigned_agent_id !== undefined && String(current.assigned_agent_id || '') !== String(next.assigned_agent_id || '')) {
  518 |     const assignments = await readStore(ASSIGNMENTS_FILE)
  519 |     assignments.push({
  520 |       id: crypto.randomUUID(),
  521 |       lead_id: next.id,
  522 |       org_owner_id: next.org_owner_id,
  523 |       assigned_by: String(actor.id || ''),
  524 |       assigned_to: next.assigned_agent_id || '',
  525 |       previous_assignee: current.assigned_agent_id || '',
  526 |       reason: sanitizeString(String(patch.assignment_reason || 'manual_assignment'), 180) || 'manual_assignment',
  527 |       assigned_at: new Date().toISOString(),
  528 |       created_at: new Date().toISOString(),
  529 |     })
  530 |     await writeJson(ASSIGNMENTS_FILE, assignments)
  531 |     await trackEvent({
  532 |       type: 'lead_reassigned',
  533 |       actor_id: String(actor.id || ''),
  534 |       entity_id: next.id,
  535 |       entityType: 'lead',
  536 |       metadata: { org_owner_id: next.org_owner_id, assigned_to: next.assigned_agent_id || '' },
  537 |       allowUnknownTypes: true,
  538 |     })
  539 |   }
  540 |   await evaluateAndEscalateLeadIfBreached({ actor, lead: next })
  541 |   return next
  542 | }
  543 | 
  544 | export async function addLeadNote(actor, leadId, noteText) {
  545 |   const id = sanitizeString(String(leadId || ''), 120)
  546 |   if (USE_SQL_CRM) {
  547 |     const actorOrgId = actorOrgOwnerId(actor)
  548 |     const lead = await prisma.lead.findFirst({
  549 |       where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
  550 |     })
  551 |     if (!lead) return null
  552 |     ensureLeadWriteAccess(actor, lead)
  553 | 
  554 |     return prisma.leadNote.create({
  555 |       data: {
  556 |         id: crypto.randomUUID(),
  557 |         lead_id: id,
  558 |         org_owner_id: lead.org_owner_id,
  559 |         author_id: String(actor.id || ''),
  560 |         note: sanitizeString(String(noteText || ''), 1600),
  561 |         created_at: new Date(),
  562 |       },
  563 |     })
  564 |   }
  565 | 
  566 |   const leads = await readStore(LEADS_FILE)
  567 |   const lead = leads.find((row) => String(row.id) === id) || null
  568 |   if (!lead) return null
  569 |   ensureLeadWriteAccess(actor, lead)
  570 | 
  571 |   const notes = await readStore(NOTES_FILE)
  572 |   const row = {
  573 |     id: crypto.randomUUID(),
  574 |     lead_id: id,
  575 |     org_owner_id: lead.org_owner_id,
  576 |     author_id: String(actor.id || ''),
  577 |     note: sanitizeString(String(noteText || ''), 1600),
  578 |     created_at: new Date().toISOString(),
  579 |   }
  580 |   notes.push(row)
  581 |   await writeJson(NOTES_FILE, notes)
  582 |   return row
  583 | }
  584 | 
  585 | export async function addLeadReminder(actor, leadId, payload = {}) {
  586 |   const id = sanitizeString(String(leadId || ''), 120)
  587 |   if (USE_SQL_CRM) {
  588 |     const actorOrgId = actorOrgOwnerId(actor)
  589 |     const lead = await prisma.lead.findFirst({
  590 |       where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
  591 |     })
  592 |     if (!lead) return null
  593 |     ensureLeadWriteAccess(actor, lead)
  594 | 
  595 |     const remindAtRaw = payload?.remind_at ? new Date(payload.remind_at) : new Date(Date.now() + 24 * 60 * 60 * 1000)
  596 |     const remindAt = Number.isNaN(remindAtRaw.getTime()) ? new Date(Date.now() + 24 * 60 * 60 * 1000) : remindAtRaw
  597 | 
  598 |     return prisma.leadReminder.create({
  599 |       data: {
  600 |         id: crypto.randomUUID(),
  601 |         lead_id: id,
  602 |         org_owner_id: lead.org_owner_id,
  603 |         created_by: String(actor.id || ''),
  604 |         remind_at: remindAt,
  605 |         message: sanitizeString(String(payload?.message || 'Follow up'), 240),
  606 |         done: false,
  607 |         created_at: new Date(),
  608 |       },
  609 |     })
  610 |   }
  611 | 
  612 |   const leads = await readStore(LEADS_FILE)
  613 |   const lead = leads.find((row) => String(row.id) === id) || null
  614 |   if (!lead) return null
  615 |   ensureLeadWriteAccess(actor, lead)
  616 | 
  617 |   const remindAtRaw = payload?.remind_at ? new Date(payload.remind_at) : new Date(Date.now() + 24 * 60 * 60 * 1000)
  618 |   const remindAt = Number.isNaN(remindAtRaw.getTime()) ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : remindAtRaw.toISOString()
  619 | 
  620 |   const reminders = await readStore(REMINDERS_FILE)
  621 |   const row = {
  622 |     id: crypto.randomUUID(),
  623 |     lead_id: id,
  624 |     org_owner_id: lead.org_owner_id,
  625 |     created_by: String(actor.id || ''),
  626 |     remind_at: remindAt,
  627 |     message: sanitizeString(String(payload?.message || 'Follow up'), 240),
  628 |     done: false,
  629 |     created_at: new Date().toISOString(),
  630 |   }
  631 |   reminders.push(row)
  632 |   await writeJson(REMINDERS_FILE, reminders)
  633 |   return row
  634 | }
  635 | 
  636 | export async function addLeadNoteForMatch({ matchId, orgOwnerId, note, authorId = 'system' }) {
  637 |   const safeMatchId = sanitizeString(String(matchId || ''), 200)
  638 |   const safeOrgId = sanitizeString(String(orgOwnerId || ''), 120)
  639 |   const safeNote = sanitizeString(String(note || ''), 1600)
  640 |   const safeAuthor = sanitizeString(String(authorId || 'system'), 120)
  641 |   if (!safeMatchId || !safeOrgId || !safeNote) return null
  642 | 
  643 |   const leads = await readStore(LEADS_FILE)
  644 |   const lead = leads.find((row) =>
  645 |     String(row.match_id || '') === safeMatchId && String(row.org_owner_id || '') === safeOrgId
  646 |   ) || null
  647 |   if (!lead) return null
  648 | 
  649 |   const notes = await readStore(NOTES_FILE)
  650 |   const row = {
  651 |     id: crypto.randomUUID(),
  652 |     lead_id: lead.id,
  653 |     org_owner_id: lead.org_owner_id,
  654 |     author_id: safeAuthor || lead.org_owner_id,
  655 |     note: safeNote,
  656 |     created_at: new Date().toISOString(),
  657 |   }
  658 |   notes.push(row)
  659 |   await writeJson(NOTES_FILE, notes)
  660 |   return row
  661 | }
  662 | 