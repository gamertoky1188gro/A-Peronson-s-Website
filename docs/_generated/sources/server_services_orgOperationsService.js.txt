    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | import {
    6 |   canManageLeadAssignments,
    7 |   canManageOrgPolicies,
    8 |   canManageOrgQueue,
    9 |   forbiddenError,
   10 |   isAgent,
   11 | } from '../utils/permissions.js'
   12 | import { trackEvent } from './eventTrackingService.js'
   13 | 
   14 | const USE_SQL_CRM = isCrmSqlEnabled()
   15 | 
   16 | const POLICIES_FILE = 'org_policies.json'
   17 | const ASSIGNMENTS_FILE = 'lead_assignments.json'
   18 | const CAPACITY_FILE = 'agent_capacity.json'
   19 | const LEADS_FILE = 'leads.json'
   20 | const USERS_FILE = 'users.json'
   21 | 
   22 | const DEFAULT_POLICY = {
   23 |   assignment_strategy: 'least_loaded',
   24 |   sla_targets: {
   25 |     response_minutes: 60,
   26 |     contact_minutes: 240,
   27 |     resolution_minutes: 2880,
   28 |   },
   29 |   escalation_windows: {
   30 |     warning_minutes: 30,
   31 |     breach_minutes: 60,
   32 |   },
   33 | }
   34 | 
   35 | async function readStore(fileName) {
   36 |   if (USE_SQL_CRM) return readJson(fileName)
   37 |   return readLegacyJson(fileName)
   38 | }
   39 | 
   40 | function actorOrgOwnerId(actor) {
   41 |   if (!actor) return ''
   42 |   if (isAgent(actor)) return sanitizeString(actor.org_owner_id || '', 120)
   43 |   return sanitizeString(actor.id || '', 120)
   44 | }
   45 | 
   46 | function toIso(value, fallback = new Date().toISOString()) {
   47 |   if (!value) return fallback
   48 |   const date = new Date(value)
   49 |   if (Number.isNaN(date.getTime())) return fallback
   50 |   return date.toISOString()
   51 | }
   52 | 
   53 | function normalizePolicyInput(input = {}) {
   54 |   const assignmentStrategy = sanitizeString(String(input.assignment_strategy || DEFAULT_POLICY.assignment_strategy), 80)
   55 |   const slaTargets = input?.sla_targets && typeof input.sla_targets === 'object' ? input.sla_targets : {}
   56 |   const escalationWindows = input?.escalation_windows && typeof input.escalation_windows === 'object' ? input.escalation_windows : {}
   57 | 
   58 |   return {
   59 |     assignment_strategy: assignmentStrategy || DEFAULT_POLICY.assignment_strategy,
   60 |     sla_targets: {
   61 |       response_minutes: Math.max(1, Number(slaTargets.response_minutes ?? DEFAULT_POLICY.sla_targets.response_minutes)),
   62 |       contact_minutes: Math.max(1, Number(slaTargets.contact_minutes ?? DEFAULT_POLICY.sla_targets.contact_minutes)),
   63 |       resolution_minutes: Math.max(1, Number(slaTargets.resolution_minutes ?? DEFAULT_POLICY.sla_targets.resolution_minutes)),
   64 |     },
   65 |     escalation_windows: {
   66 |       warning_minutes: Math.max(1, Number(escalationWindows.warning_minutes ?? DEFAULT_POLICY.escalation_windows.warning_minutes)),
   67 |       breach_minutes: Math.max(1, Number(escalationWindows.breach_minutes ?? DEFAULT_POLICY.escalation_windows.breach_minutes)),
   68 |     },
   69 |   }
   70 | }
   71 | 
   72 | function computeLoad(leads = [], agentId = '') {
   73 |   return leads.filter((lead) => String(lead.assigned_agent_id || '') === String(agentId)).length
   74 | }
   75 | 
   76 | function computeSlaStatus(lead, policy) {
   77 |   const referenceAt = new Date(lead?.last_interaction_at || lead?.updated_at || lead?.created_at || Date.now())
   78 |   const elapsedMinutes = Math.max(0, Math.floor((Date.now() - referenceAt.getTime()) / 60000))
   79 |   const breachAt = Number(policy?.escalation_windows?.breach_minutes || DEFAULT_POLICY.escalation_windows.breach_minutes)
   80 |   const warningAt = Number(policy?.escalation_windows?.warning_minutes || DEFAULT_POLICY.escalation_windows.warning_minutes)
   81 | 
   82 |   if (elapsedMinutes >= breachAt) return { status: 'breached', elapsed_minutes: elapsedMinutes }
   83 |   if (elapsedMinutes >= warningAt) return { status: 'warning', elapsed_minutes: elapsedMinutes }
   84 |   return { status: 'healthy', elapsed_minutes: elapsedMinutes }
   85 | }
   86 | 
   87 | async function ensurePolicy(orgOwnerId) {
   88 |   const policies = await readStore(POLICIES_FILE)
   89 |   const existing = policies.find((policy) => (
   90 |     String(policy.org_id || policy.org_owner_id || '') === String(orgOwnerId)
   91 |       && String(policy.code || 'operations') === 'operations'
   92 |   ))
   93 |   if (existing) return existing
   94 | 
   95 |   const now = new Date().toISOString()
   96 |   const created = {
   97 |     id: crypto.randomUUID(),
   98 |     org_id: orgOwnerId,
   99 |     code: 'operations',
  100 |     description: 'Org operations policy',
  101 |     config: {},
  102 |     ...DEFAULT_POLICY,
  103 |     active: true,
  104 |     created_at: now,
  105 |     updated_at: now,
  106 |   }
  107 | 
  108 |   await writeJson(POLICIES_FILE, [...policies, created])
  109 |   return created
  110 | }
  111 | 
  112 | export async function getOrgPolicies(actor) {
  113 |   const orgOwnerId = actorOrgOwnerId(actor)
  114 |   if (!orgOwnerId) throw forbiddenError()
  115 |   return ensurePolicy(orgOwnerId)
  116 | }
  117 | 
  118 | export async function updateOrgPolicies(actor, payload = {}) {
  119 |   if (!canManageOrgPolicies(actor)) throw forbiddenError('Policy admin permission required')
  120 |   const orgOwnerId = actorOrgOwnerId(actor)
  121 |   if (!orgOwnerId) throw forbiddenError()
  122 | 
  123 |   const policies = await readStore(POLICIES_FILE)
  124 |   const now = new Date().toISOString()
  125 |   const input = normalizePolicyInput(payload)
  126 |   const index = policies.findIndex((policy) => (
  127 |     String(policy.org_id || policy.org_owner_id || '') === orgOwnerId
  128 |       && String(policy.code || 'operations') === 'operations'
  129 |   ))
  130 | 
  131 |   const next = {
  132 |     ...(index >= 0 ? policies[index] : {
  133 |       id: crypto.randomUUID(),
  134 |       org_id: orgOwnerId,
  135 |       code: 'operations',
  136 |       description: 'Org operations policy',
  137 |       config: {},
  138 |       active: true,
  139 |       created_at: now,
  140 |     }),
  141 |     ...input,
  142 |     updated_at: now,
  143 |   }
  144 | 
  145 |   const rows = index >= 0
  146 |     ? policies.map((row, rowIndex) => (rowIndex === index ? next : row))
  147 |     : [...policies, next]
  148 | 
  149 |   await writeJson(POLICIES_FILE, rows)
  150 |   return next
  151 | }
  152 | 
  153 | export async function getOrgQueue(actor) {
  154 |   if (!canManageOrgQueue(actor) && !isAgent(actor)) throw forbiddenError('Queue manager permission required')
  155 | 
  156 |   const orgOwnerId = actorOrgOwnerId(actor)
  157 |   if (!orgOwnerId) throw forbiddenError()
  158 | 
  159 |   const [leads, users, policy, capacityRows] = await Promise.all([
  160 |     readStore(LEADS_FILE),
  161 |     readStore(USERS_FILE),
  162 |     ensurePolicy(orgOwnerId),
  163 |     readStore(CAPACITY_FILE),
  164 |   ])
  165 | 
  166 |   const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === orgOwnerId)
  167 | 
  168 |   const scopedLeads = leads.filter((lead) => String(lead.org_owner_id || '') === orgOwnerId)
  169 |     .filter((lead) => !isAgent(actor) || String(lead.assigned_agent_id || '') === String(actor.id || ''))
  170 |     .map((lead) => ({
  171 |       ...lead,
  172 |       queue_owner_id: lead.assigned_agent_id || orgOwnerId,
  173 |       sla: computeSlaStatus(lead, policy),
  174 |     }))
  175 | 
  176 |   const agentCapacity = agents.map((agent) => {
  177 |     const existing = capacityRows.find((row) => String(row.agent_id || '') === String(agent.id))
  178 |     const currentLoad = computeLoad(scopedLeads, agent.id)
  179 |     return {
  180 |       id: existing?.id || crypto.randomUUID(),
  181 |       org_owner_id: orgOwnerId,
  182 |       agent_id: agent.id,
  183 |       max_concurrent_leads: Number(existing?.max_concurrent_leads || 10),
  184 |       current_load: currentLoad,
  185 |       updated_at: new Date().toISOString(),
  186 |     }
  187 |   })
  188 | 
  189 |   return {
  190 |     queue: scopedLeads,
  191 |     team_queues: agents.map((agent) => ({
  192 |       agent_id: agent.id,
  193 |       agent_name: agent.name,
  194 |       current_load: computeLoad(scopedLeads, agent.id),
  195 |       leads: scopedLeads.filter((lead) => String(lead.assigned_agent_id || '') === String(agent.id)),
  196 |     })),
  197 |     agent_capacity: agentCapacity,
  198 |   }
  199 | }
  200 | 
  201 | export async function rebalanceOrgQueue(actor, payload = {}) {
  202 |   if (!canManageLeadAssignments(actor)) throw forbiddenError('Assignment manager permission required')
  203 | 
  204 |   const orgOwnerId = actorOrgOwnerId(actor)
  205 |   const [users, leads, capacityRows] = await Promise.all([
  206 |     readStore(USERS_FILE),
  207 |     readStore(LEADS_FILE),
  208 |     readStore(CAPACITY_FILE),
  209 |   ])
  210 | 
  211 |   const strategy = sanitizeString(String(payload.strategy || 'least_loaded'), 60) || 'least_loaded'
  212 |   const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === orgOwnerId)
  213 | 
  214 |   if (agents.length === 0) return { moved: 0, strategy, assignments: [] }
  215 | 
  216 |   const leadsInScope = leads.filter((lead) => String(lead.org_owner_id || '') === orgOwnerId)
  217 |   const loadByAgent = new Map(agents.map((agent) => [agent.id, computeLoad(leadsInScope, agent.id)]))
  218 |   const capacityByAgent = new Map(agents.map((agent) => {
  219 |     const cap = capacityRows.find((row) => String(row.agent_id || '') === String(agent.id))
  220 |     return [agent.id, Number(cap?.max_concurrent_leads || 10)]
  221 |   }))
  222 | 
  223 |   const updatedAssignments = []
  224 |   const now = new Date().toISOString()
  225 | 
  226 |   function pickAgent() {
  227 |     const ranked = agents
  228 |       .map((agent) => ({
  229 |         agent_id: agent.id,
  230 |         load: Number(loadByAgent.get(agent.id) || 0),
  231 |         capacity: Number(capacityByAgent.get(agent.id) || 10),
  232 |       }))
  233 |       .filter((agent) => agent.load < agent.capacity)
  234 |       .sort((a, b) => a.load - b.load)
  235 |     return ranked[0]?.agent_id || ''
  236 |   }
  237 | 
  238 |   const nextLeads = leads.map((lead) => {
  239 |     if (String(lead.org_owner_id || '') !== orgOwnerId) return lead
  240 |     const hasAssignee = Boolean(lead.assigned_agent_id)
  241 |     if (hasAssignee && strategy === 'fill_unassigned') return lead
  242 | 
  243 |     const targetAgentId = pickAgent()
  244 |     if (!targetAgentId || String(lead.assigned_agent_id || '') === String(targetAgentId)) return lead
  245 | 
  246 |     const previousAgentId = String(lead.assigned_agent_id || '')
  247 |     if (previousAgentId) loadByAgent.set(previousAgentId, Math.max(0, Number(loadByAgent.get(previousAgentId) || 0) - 1))
  248 |     loadByAgent.set(targetAgentId, Number(loadByAgent.get(targetAgentId) || 0) + 1)
  249 | 
  250 |     updatedAssignments.push({
  251 |       id: crypto.randomUUID(),
  252 |       lead_id: lead.id,
  253 |       org_owner_id: orgOwnerId,
  254 |       assigned_by: actor.id,
  255 |       assigned_to: targetAgentId,
  256 |       previous_assignee: previousAgentId,
  257 |       reason: 'queue_rebalanced',
  258 |       assigned_at: now,
  259 |       created_at: now,
  260 |     })
  261 | 
  262 |     return {
  263 |       ...lead,
  264 |       assigned_agent_id: targetAgentId,
  265 |       updated_at: now,
  266 |     }
  267 |   })
  268 | 
  269 |   if (updatedAssignments.length) {
  270 |     await Promise.all([
  271 |       writeJson(LEADS_FILE, nextLeads),
  272 |       writeJson(ASSIGNMENTS_FILE, [...await readStore(ASSIGNMENTS_FILE), ...updatedAssignments]),
  273 |       writeJson(CAPACITY_FILE, agents.map((agent) => ({
  274 |         id: crypto.randomUUID(),
  275 |         org_owner_id: orgOwnerId,
  276 |         agent_id: agent.id,
  277 |         max_concurrent_leads: Number(capacityByAgent.get(agent.id) || 10),
  278 |         current_load: Number(loadByAgent.get(agent.id) || 0),
  279 |         updated_at: now,
  280 |       }))),
  281 |     ])
  282 | 
  283 |     await trackEvent({
  284 |       type: 'queue_rebalanced',
  285 |       actor_id: actor.id,
  286 |       entity_id: orgOwnerId,
  287 |       entityType: 'org_operations',
  288 |       metadata: {
  289 |         org_owner_id: orgOwnerId,
  290 |         moved: updatedAssignments.length,
  291 |         strategy,
  292 |       },
  293 |       allowUnknownTypes: true,
  294 |     })
  295 |   }
  296 | 
  297 |   return {
  298 |     moved: updatedAssignments.length,
  299 |     strategy,
  300 |     assignments: updatedAssignments,
  301 |   }
  302 | }
  303 | 
  304 | export async function escalateOrgLead(actor, leadId, payload = {}) {
  305 |   if (!canManageLeadAssignments(actor) && !canManageOrgQueue(actor)) {
  306 |     throw forbiddenError('Queue manager or assignment manager permission required')
  307 |   }
  308 | 
  309 |   const orgOwnerId = actorOrgOwnerId(actor)
  310 |   const [leads, policy] = await Promise.all([readStore(LEADS_FILE), ensurePolicy(orgOwnerId)])
  311 |   const target = leads.find((lead) => String(lead.id || '') === String(leadId) && String(lead.org_owner_id || '') === orgOwnerId)
  312 |   if (!target) return null
  313 | 
  314 |   const now = new Date().toISOString()
  315 |   const reason = sanitizeString(String(payload.reason || 'manual_escalation'), 180)
  316 |   const escalated = {
  317 |     ...target,
  318 |     status: 'escalated',
  319 |     escalated_at: now,
  320 |     escalation_reason: reason,
  321 |     updated_at: now,
  322 |   }
  323 |   await writeJson(LEADS_FILE, leads.map((lead) => (lead.id === target.id ? escalated : lead)))
  324 | 
  325 |   const assignmentEvent = {
  326 |     id: crypto.randomUUID(),
  327 |     lead_id: target.id,
  328 |     org_owner_id: orgOwnerId,
  329 |     assigned_by: actor.id,
  330 |     assigned_to: target.assigned_agent_id || '',
  331 |     previous_assignee: target.assigned_agent_id || '',
  332 |     reason: reason || 'lead_escalated',
  333 |     assigned_at: now,
  334 |     created_at: now,
  335 |   }
  336 | 
  337 |   const history = await readStore(ASSIGNMENTS_FILE)
  338 |   await writeJson(ASSIGNMENTS_FILE, [...history, assignmentEvent])
  339 | 
  340 |   const sla = computeSlaStatus(escalated, policy)
  341 |   if (sla.status === 'breached') {
  342 |     await trackEvent({
  343 |       type: 'sla_breached',
  344 |       actor_id: actor.id,
  345 |       entity_id: target.id,
  346 |       entityType: 'lead',
  347 |       metadata: {
  348 |         org_owner_id: orgOwnerId,
  349 |         elapsed_minutes: sla.elapsed_minutes,
  350 |         breach_minutes: policy?.escalation_windows?.breach_minutes,
  351 |       },
  352 |       allowUnknownTypes: true,
  353 |     })
  354 |   }
  355 | 
  356 |   await trackEvent({
  357 |     type: 'lead_escalated',
  358 |     actor_id: actor.id,
  359 |     entity_id: target.id,
  360 |     entityType: 'lead',
  361 |     metadata: {
  362 |       org_owner_id: orgOwnerId,
  363 |       reason: reason || 'manual_escalation',
  364 |     },
  365 |     allowUnknownTypes: true,
  366 |   })
  367 | 
  368 |   await trackEvent({
  369 |     type: 'lead_reassigned',
  370 |     actor_id: actor.id,
  371 |     entity_id: target.id,
  372 |     entityType: 'lead',
  373 |     metadata: {
  374 |       org_owner_id: orgOwnerId,
  375 |       reason: reason || 'lead_escalated',
  376 |       assigned_to: target.assigned_agent_id || '',
  377 |     },
  378 |     allowUnknownTypes: true,
  379 |   })
  380 | 
  381 |   return escalated
  382 | }
  383 | 
  384 | export async function listLeadAssignmentHistory(actor) {
  385 |   const orgOwnerId = actorOrgOwnerId(actor)
  386 |   const history = await readStore(ASSIGNMENTS_FILE)
  387 |   return history
  388 |     .filter((row) => String(row.org_owner_id || '') === orgOwnerId)
  389 |     .sort((a, b) => String(b.assigned_at || b.created_at || '').localeCompare(String(a.assigned_at || a.created_at || '')))
  390 | }
  391 | 
  392 | export async function upsertAgentCapacity(actor, payload = {}) {
  393 |   if (!canManageLeadAssignments(actor)) throw forbiddenError('Assignment manager permission required')
  394 |   const orgOwnerId = actorOrgOwnerId(actor)
  395 |   const rows = await readStore(CAPACITY_FILE)
  396 |   const agentId = sanitizeString(String(payload.agent_id || ''), 120)
  397 |   if (!agentId) throw new Error('agent_id is required')
  398 | 
  399 |   const now = new Date().toISOString()
  400 |   const index = rows.findIndex((row) => String(row.agent_id || '') === agentId && String(row.org_owner_id || '') === orgOwnerId)
  401 |   const next = {
  402 |     ...(index >= 0 ? rows[index] : { id: crypto.randomUUID(), org_owner_id: orgOwnerId, agent_id: agentId }),
  403 |     max_concurrent_leads: Math.max(1, Number(payload.max_concurrent_leads || rows[index]?.max_concurrent_leads || 10)),
  404 |     current_load: Math.max(0, Number(payload.current_load ?? rows[index]?.current_load ?? 0)),
  405 |     updated_at: now,
  406 |   }
  407 | 
  408 |   const updatedRows = index >= 0 ? rows.map((row, rowIndex) => (rowIndex === index ? next : row)) : [...rows, next]
  409 |   await writeJson(CAPACITY_FILE, updatedRows)
  410 |   return next
  411 | }
  412 | 
  413 | export function getDefaultOrgPolicy(orgOwnerId) {
  414 |   return {
  415 |     id: crypto.randomUUID(),
  416 |     org_id: orgOwnerId,
  417 |     code: 'operations',
  418 |     description: 'Org operations policy',
  419 |     config: {},
  420 |     ...DEFAULT_POLICY,
  421 |     active: true,
  422 |     created_at: toIso(),
  423 |     updated_at: toIso(),
  424 |   }
  425 | }
  426 | 