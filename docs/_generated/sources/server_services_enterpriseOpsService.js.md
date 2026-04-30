    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | import { forbiddenError, isAgent } from '../utils/permissions.js'
    6 | import { trackEvent } from './eventTrackingService.js'
    7 | 
    8 | const USE_SQL_CRM = isCrmSqlEnabled()
    9 | 
   10 | const POLICY_FILE = 'org_ops_policies.json'
   11 | const LEADS_FILE = 'leads.json'
   12 | const USERS_FILE = 'users.json'
   13 | const SLA_FILE = 'lead_sla_timers.json'
   14 | const ESCALATIONS_FILE = 'lead_escalations.json'
   15 | const WORKLOAD_FILE = 'agent_workloads.json'
   16 | const ASSIGNMENTS_FILE = 'lead_assignments.json'
   17 | 
   18 | const VALID_ASSIGNMENT_STRATEGIES = new Set(['round_robin', 'least_loaded', 'skill_based'])
   19 | const DEFAULT_STAGE_TARGETS = {
   20 |   new: 60,
   21 |   contacted: 180,
   22 |   negotiating: 720,
   23 |   sample_sent: 1440,
   24 |   order_confirmed: 2880,
   25 |   closed: 4320,
   26 | }
   27 | 
   28 | const DEFAULT_POLICY = {
   29 |   assignment_strategy: 'least_loaded',
   30 |   sla_targets_by_stage: DEFAULT_STAGE_TARGETS,
   31 |   escalation_rules: {
   32 |     time_based: { warning_minutes: 30, breach_minutes: 60 },
   33 |     risk_based: { high_risk_threshold: 80, auto_escalate_threshold: 95 },
   34 |   },
   35 |   workload_caps_per_agent: { default_max_active_leads: 10, overrides: {} },
   36 | }
   37 | 
   38 | async function readStore(fileName) {
   39 |   if (USE_SQL_CRM) return readJson(fileName)
   40 |   return readLegacyJson(fileName)
   41 | }
   42 | 
   43 | function actorOrgOwnerId(actor) {
   44 |   if (!actor) return ''
   45 |   if (isAgent(actor)) return sanitizeString(actor.org_owner_id || '', 120)
   46 |   return sanitizeString(actor.id || '', 120)
   47 | }
   48 | 
   49 | function normalizePolicyInput(payload = {}) {
   50 |   const safeAssignment = sanitizeString(String(payload.assignment_strategy || DEFAULT_POLICY.assignment_strategy), 80).toLowerCase()
   51 |   const assignment_strategy = VALID_ASSIGNMENT_STRATEGIES.has(safeAssignment) ? safeAssignment : DEFAULT_POLICY.assignment_strategy
   52 | 
   53 |   const inputStageTargets = payload?.sla_targets_by_stage && typeof payload.sla_targets_by_stage === 'object'
   54 |     ? payload.sla_targets_by_stage
   55 |     : {}
   56 |   const stageTargets = { ...DEFAULT_STAGE_TARGETS }
   57 |   Object.entries(inputStageTargets).forEach(([stage, value]) => {
   58 |     const stageKey = sanitizeString(String(stage || ''), 60).toLowerCase().replace(/\s+/g, '_')
   59 |     const minutes = Math.max(1, Number(value || DEFAULT_STAGE_TARGETS[stageKey] || 60))
   60 |     if (stageKey) stageTargets[stageKey] = minutes
   61 |   })
   62 | 
   63 |   const escalationRules = payload?.escalation_rules && typeof payload.escalation_rules === 'object'
   64 |     ? payload.escalation_rules
   65 |     : {}
   66 |   const timeBased = escalationRules?.time_based && typeof escalationRules.time_based === 'object' ? escalationRules.time_based : {}
   67 |   const riskBased = escalationRules?.risk_based && typeof escalationRules.risk_based === 'object' ? escalationRules.risk_based : {}
   68 | 
   69 |   const workloadCaps = payload?.workload_caps_per_agent && typeof payload.workload_caps_per_agent === 'object'
   70 |     ? payload.workload_caps_per_agent
   71 |     : {}
   72 |   const overrides = workloadCaps?.overrides && typeof workloadCaps.overrides === 'object' ? workloadCaps.overrides : {}
   73 | 
   74 |   return {
   75 |     assignment_strategy,
   76 |     sla_targets_by_stage: stageTargets,
   77 |     escalation_rules: {
   78 |       time_based: {
   79 |         warning_minutes: Math.max(1, Number(timeBased.warning_minutes ?? DEFAULT_POLICY.escalation_rules.time_based.warning_minutes)),
   80 |         breach_minutes: Math.max(1, Number(timeBased.breach_minutes ?? DEFAULT_POLICY.escalation_rules.time_based.breach_minutes)),
   81 |       },
   82 |       risk_based: {
   83 |         high_risk_threshold: Math.max(1, Number(riskBased.high_risk_threshold ?? DEFAULT_POLICY.escalation_rules.risk_based.high_risk_threshold)),
   84 |         auto_escalate_threshold: Math.max(1, Number(riskBased.auto_escalate_threshold ?? DEFAULT_POLICY.escalation_rules.risk_based.auto_escalate_threshold)),
   85 |       },
   86 |     },
   87 |     workload_caps_per_agent: {
   88 |       default_max_active_leads: Math.max(1, Number(workloadCaps.default_max_active_leads ?? DEFAULT_POLICY.workload_caps_per_agent.default_max_active_leads)),
   89 |       overrides: Object.fromEntries(
   90 |         Object.entries(overrides)
   91 |           .map(([agentId, cap]) => [sanitizeString(String(agentId || ''), 120), Math.max(1, Number(cap || 1))])
   92 |           .filter(([agentId]) => Boolean(agentId)),
   93 |       ),
   94 |     },
   95 |   }
   96 | }
   97 | 
   98 | async function ensurePolicy(orgOwnerId) {
   99 |   const rows = await readStore(POLICY_FILE)
  100 |   const existing = rows.find((row) => String(row.org_owner_id || '') === String(orgOwnerId))
  101 |   if (existing) return existing
  102 | 
  103 |   const now = new Date().toISOString()
  104 |   const created = {
  105 |     id: crypto.randomUUID(),
  106 |     org_owner_id: orgOwnerId,
  107 |     round_robin_index: 0,
  108 |     active: true,
  109 |     ...DEFAULT_POLICY,
  110 |     created_at: now,
  111 |     updated_at: now,
  112 |   }
  113 |   await writeJson(POLICY_FILE, [...rows, created])
  114 |   return created
  115 | }
  116 | 
  117 | export async function getOpsPolicies(actor) {
  118 |   const orgOwnerId = actorOrgOwnerId(actor)
  119 |   if (!orgOwnerId) throw forbiddenError()
  120 |   return ensurePolicy(orgOwnerId)
  121 | }
  122 | 
  123 | export async function updateOpsPolicies(actor, payload = {}) {
  124 |   const orgOwnerId = actorOrgOwnerId(actor)
  125 |   if (!orgOwnerId) throw forbiddenError()
  126 | 
  127 |   const rows = await readStore(POLICY_FILE)
  128 |   const policyInput = normalizePolicyInput(payload)
  129 |   const now = new Date().toISOString()
  130 |   const idx = rows.findIndex((row) => String(row.org_owner_id || '') === String(orgOwnerId))
  131 |   const nextPolicy = {
  132 |     ...(idx >= 0 ? rows[idx] : { id: crypto.randomUUID(), org_owner_id: orgOwnerId, created_at: now, round_robin_index: 0, active: true }),
  133 |     ...policyInput,
  134 |     updated_at: now,
  135 |   }
  136 | 
  137 |   const nextRows = idx >= 0 ? rows.map((row, rowIdx) => (rowIdx === idx ? nextPolicy : row)) : [...rows, nextPolicy]
  138 |   await writeJson(POLICY_FILE, nextRows)
  139 |   return nextPolicy
  140 | }
  141 | 
  142 | function computeAgentLoad(leads = [], agentId = '') {
  143 |   return leads.filter((lead) => String(lead.assigned_agent_id || '') === String(agentId) && String(lead.status || '') !== 'closed').length
  144 | }
  145 | 
  146 | function computeAgentCap(policy, agentId) {
  147 |   const override = Number(policy?.workload_caps_per_agent?.overrides?.[agentId])
  148 |   const base = Number(policy?.workload_caps_per_agent?.default_max_active_leads || 10)
  149 |   return Number.isFinite(override) && override > 0 ? override : base
  150 | }
  151 | 
  152 | async function persistWorkloads({ orgOwnerId, agents, leads, policy }) {
  153 |   const rows = await readStore(WORKLOAD_FILE)
  154 |   const now = new Date().toISOString()
  155 |   const nextRows = rows.filter((row) => String(row.org_owner_id || '') !== String(orgOwnerId))
  156 | 
  157 |   agents.forEach((agent) => {
  158 |     const current = rows.find((row) => String(row.org_owner_id || '') === String(orgOwnerId) && String(row.agent_id || '') === String(agent.id))
  159 |     nextRows.push({
  160 |       id: current?.id || crypto.randomUUID(),
  161 |       org_owner_id: orgOwnerId,
  162 |       agent_id: String(agent.id),
  163 |       active_leads: computeAgentLoad(leads, agent.id),
  164 |       capped_max_leads: computeAgentCap(policy, String(agent.id)),
  165 |       last_assigned_at: current?.last_assigned_at || null,
  166 |       updated_at: now,
  167 |     })
  168 |   })
  169 | 
  170 |   await writeJson(WORKLOAD_FILE, nextRows)
  171 | }
  172 | 
  173 | async function chooseAssignee({ policy, orgOwnerId, lead, leads, users }) {
  174 |   const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === String(orgOwnerId))
  175 |   if (!agents.length) return null
  176 | 
  177 |   const eligible = agents
  178 |     .map((agent) => ({
  179 |       agent,
  180 |       active_leads: computeAgentLoad(leads, agent.id),
  181 |       cap: computeAgentCap(policy, String(agent.id)),
  182 |     }))
  183 |     .filter((row) => row.active_leads < row.cap)
  184 | 
  185 |   if (!eligible.length) return null
  186 | 
  187 |   const strategy = String(policy?.assignment_strategy || DEFAULT_POLICY.assignment_strategy)
  188 | 
  189 |   if (strategy === 'round_robin') {
  190 |     const start = Math.max(0, Number(policy?.round_robin_index || 0)) % eligible.length
  191 |     const pick = eligible[start]
  192 |     return pick?.agent?.id ? { agentId: String(pick.agent.id), nextRoundRobinIndex: start + 1 } : null
  193 |   }
  194 | 
  195 |   if (strategy === 'skill_based') {
  196 |     const requiredSkill = sanitizeString(String(lead?.required_skill || lead?.source_type || ''), 120).toLowerCase()
  197 |     const skillMatched = requiredSkill
  198 |       ? eligible.filter((row) => Array.isArray(row.agent?.skills) && row.agent.skills.map((skill) => String(skill).toLowerCase()).includes(requiredSkill))
  199 |       : []
  200 |     const pool = skillMatched.length ? skillMatched : eligible
  201 |     const sorted = pool.slice().sort((a, b) => a.active_leads - b.active_leads)
  202 |     const top = sorted[0]
  203 |     return top?.agent?.id ? { agentId: String(top.agent.id) } : null
  204 |   }
  205 | 
  206 |   const sorted = eligible.slice().sort((a, b) => a.active_leads - b.active_leads)
  207 |   const top = sorted[0]
  208 |   return top?.agent?.id ? { agentId: String(top.agent.id) } : null
  209 | }
  210 | 
  211 | async function upsertSlaTimer(lead, policy) {
  212 |   const leadStatus = sanitizeString(String(lead?.status || 'new'), 60).toLowerCase().replace(/\s+/g, '_')
  213 |   const targetMinutes = Math.max(1, Number(policy?.sla_targets_by_stage?.[leadStatus] || DEFAULT_STAGE_TARGETS[leadStatus] || 60))
  214 |   const baseDate = new Date(lead?.updated_at || lead?.created_at || Date.now())
  215 |   const deadlineAt = new Date(baseDate.getTime() + targetMinutes * 60000)
  216 |   const rows = await readStore(SLA_FILE)
  217 |   const existingIdx = rows.findIndex((row) => String(row.lead_id || '') === String(lead.id) && String(row.stage || '') === leadStatus)
  218 |   const now = new Date().toISOString()
  219 |   const next = {
  220 |     ...(existingIdx >= 0 ? rows[existingIdx] : { id: crypto.randomUUID(), lead_id: lead.id, created_at: now }),
  221 |     org_owner_id: lead.org_owner_id,
  222 |     stage: leadStatus,
  223 |     target_minutes: targetMinutes,
  224 |     deadline_at: deadlineAt.toISOString(),
  225 |     updated_at: now,
  226 |   }
  227 |   const nextRows = existingIdx >= 0 ? rows.map((row, idx) => (idx === existingIdx ? next : row)) : [...rows, next]
  228 |   await writeJson(SLA_FILE, nextRows)
  229 |   return next
  230 | }
  231 | 
  232 | export async function applyLeadOpsOnCreateOrUpdate({ actor, lead, trigger = 'update' }) {
  233 |   if (!lead?.id || !lead?.org_owner_id) return lead
  234 | 
  235 |   const orgOwnerId = String(lead.org_owner_id)
  236 |   const [policy, leads, users] = await Promise.all([
  237 |     ensurePolicy(orgOwnerId),
  238 |     readStore(LEADS_FILE),
  239 |     readStore(USERS_FILE),
  240 |   ])
  241 | 
  242 |   const changed = { ...lead }
  243 | 
  244 |   if (!changed.assigned_agent_id) {
  245 |     const picked = await chooseAssignee({ policy, orgOwnerId, lead: changed, leads, users })
  246 |     if (picked?.agentId) {
  247 |       changed.assigned_agent_id = picked.agentId
  248 |       await trackEvent({
  249 |         type: 'lead_assignment',
  250 |         actor_id: String(actor?.id || orgOwnerId),
  251 |         entity_id: String(changed.id),
  252 |         entityType: 'lead',
  253 |         metadata: { org_owner_id: orgOwnerId, strategy: policy.assignment_strategy, assigned_to: picked.agentId, trigger },
  254 |         allowUnknownTypes: true,
  255 |       })
  256 |       const assignments = await readStore(ASSIGNMENTS_FILE)
  257 |       assignments.push({
  258 |         id: crypto.randomUUID(),
  259 |         lead_id: changed.id,
  260 |         org_owner_id: orgOwnerId,
  261 |         assigned_by: String(actor?.id || orgOwnerId),
  262 |         assigned_to: picked.agentId,
  263 |         previous_assignee: '',
  264 |         reason: 'policy_auto_assignment',
  265 |         assigned_at: new Date().toISOString(),
  266 |         created_at: new Date().toISOString(),
  267 |       })
  268 |       await writeJson(ASSIGNMENTS_FILE, assignments)
  269 | 
  270 |       if (picked.nextRoundRobinIndex !== undefined) {
  271 |         const policies = await readStore(POLICY_FILE)
  272 |         await writeJson(POLICY_FILE, policies.map((row) => (
  273 |           String(row.id || '') === String(policy.id)
  274 |             ? { ...row, round_robin_index: picked.nextRoundRobinIndex, updated_at: new Date().toISOString() }
  275 |             : row
  276 |         )))
  277 |       }
  278 |     }
  279 |   }
  280 | 
  281 |   const timer = await upsertSlaTimer(changed, policy)
  282 |   changed.sla = {
  283 |     stage: timer.stage,
  284 |     deadline_at: timer.deadline_at,
  285 |     target_minutes: timer.target_minutes,
  286 |   }
  287 | 
  288 |   await persistWorkloads({
  289 |     orgOwnerId,
  290 |     agents: users.filter((u) => String(u.role || '').toLowerCase() === 'agent' && String(u.org_owner_id || '') === orgOwnerId),
  291 |     leads: leads.map((existing) => (String(existing.id || '') === String(changed.id) ? changed : existing)),
  292 |     policy,
  293 |   })
  294 | 
  295 |   return changed
  296 | }
  297 | 
  298 | function timeEscalationSeverity(policy, timer) {
  299 |   const breachMinutes = Number(policy?.escalation_rules?.time_based?.breach_minutes || 60)
  300 |   const warningMinutes = Number(policy?.escalation_rules?.time_based?.warning_minutes || 30)
  301 |   const now = Date.now()
  302 |   const deadline = new Date(timer?.deadline_at || Date.now()).getTime()
  303 |   const overdueMinutes = Math.max(0, Math.floor((now - deadline) / 60000))
  304 |   if (overdueMinutes >= breachMinutes) return { breached: true, severity: 'critical', overdueMinutes }
  305 |   if (overdueMinutes >= warningMinutes) return { breached: true, severity: 'warning', overdueMinutes }
  306 |   return { breached: false, severity: 'healthy', overdueMinutes }
  307 | }
  308 | 
  309 | export async function evaluateAndEscalateLeadIfBreached({ actor, lead }) {
  310 |   if (!lead?.id || !lead?.org_owner_id) return { escalated: false }
  311 | 
  312 |   const orgOwnerId = String(lead.org_owner_id)
  313 |   const [policy, timers, escalations] = await Promise.all([
  314 |     ensurePolicy(orgOwnerId),
  315 |     readStore(SLA_FILE),
  316 |     readStore(ESCALATIONS_FILE),
  317 |   ])
  318 |   const leadTimers = timers.filter((row) => String(row.lead_id || '') === String(lead.id))
  319 |   if (!leadTimers.length) return { escalated: false }
  320 | 
  321 |   const activeEscalation = escalations.find((row) => String(row.lead_id || '') === String(lead.id) && !row.resolved_at)
  322 |   if (activeEscalation) return { escalated: false, activeEscalation }
  323 | 
  324 |   const breachedTimer = leadTimers
  325 |     .map((timer) => ({ timer, eval: timeEscalationSeverity(policy, timer) }))
  326 |     .find((item) => item.eval.breached)
  327 | 
  328 |   const riskScore = Number(lead?.risk_score || 0)
  329 |   const riskThreshold = Number(policy?.escalation_rules?.risk_based?.auto_escalate_threshold || 95)
  330 |   const riskBreached = riskScore >= riskThreshold
  331 | 
  332 |   if (!breachedTimer && !riskBreached) return { escalated: false }
  333 | 
  334 |   const reason = breachedTimer
  335 |     ? `time_breach_stage_${breachedTimer.timer.stage}`
  336 |     : `risk_breach_score_${riskScore}`
  337 | 
  338 |   const now = new Date().toISOString()
  339 |   const escalation = {
  340 |     id: crypto.randomUUID(),
  341 |     lead_id: String(lead.id),
  342 |     org_owner_id: orgOwnerId,
  343 |     sla_timer_id: breachedTimer?.timer?.id || null,
  344 |     severity: breachedTimer?.eval?.severity || 'critical',
  345 |     reason,
  346 |     triggered_by: String(actor?.id || 'system'),
  347 |     triggered_at: now,
  348 |     created_at: now,
  349 |     updated_at: now,
  350 |   }
  351 | 
  352 |   await writeJson(ESCALATIONS_FILE, [...escalations, escalation])
  353 | 
  354 |   if (breachedTimer?.timer?.id) {
  355 |     await writeJson(SLA_FILE, timers.map((row) => (
  356 |       String(row.id || '') === String(breachedTimer.timer.id)
  357 |         ? { ...row, breached_at: row.breached_at || now, updated_at: now }
  358 |         : row
  359 |     )))
  360 |   }
  361 | 
  362 |   await trackEvent({
  363 |     type: 'sla_breach',
  364 |     actor_id: String(actor?.id || orgOwnerId),
  365 |     entity_id: String(lead.id),
  366 |     entityType: 'lead',
  367 |     metadata: { org_owner_id: orgOwnerId, reason, severity: escalation.severity },
  368 |     allowUnknownTypes: true,
  369 |   })
  370 | 
  371 |   await trackEvent({
  372 |     type: 'lead_escalation',
  373 |     actor_id: String(actor?.id || orgOwnerId),
  374 |     entity_id: String(lead.id),
  375 |     entityType: 'lead',
  376 |     metadata: { org_owner_id: orgOwnerId, escalation_id: escalation.id, reason },
  377 |     allowUnknownTypes: true,
  378 |   })
  379 | 
  380 |   return { escalated: true, escalation }
  381 | }
  382 | 
  383 | export async function listEscalations(actor) {
  384 |   const orgOwnerId = actorOrgOwnerId(actor)
  385 |   if (!orgOwnerId) throw forbiddenError()
  386 | 
  387 |   const rows = await readStore(ESCALATIONS_FILE)
  388 |   return rows
  389 |     .filter((row) => String(row.org_owner_id || '') === String(orgOwnerId))
  390 |     .sort((a, b) => String(b.triggered_at || b.created_at || '').localeCompare(String(a.triggered_at || a.created_at || '')))
  391 | }
  392 | 
  393 | export async function resolveEscalation(actor, leadId, resolutionNote = '') {
  394 |   const orgOwnerId = actorOrgOwnerId(actor)
  395 |   if (!orgOwnerId) throw forbiddenError()
  396 | 
  397 |   const rows = await readStore(ESCALATIONS_FILE)
  398 |   const idx = rows.findIndex((row) => String(row.org_owner_id || '') === String(orgOwnerId) && String(row.lead_id || '') === String(leadId) && !row.resolved_at)
  399 |   if (idx < 0) return null
  400 | 
  401 |   const now = new Date().toISOString()
  402 |   const updated = {
  403 |     ...rows[idx],
  404 |     resolved_at: now,
  405 |     resolved_by: String(actor?.id || ''),
  406 |     resolution_note: sanitizeString(String(resolutionNote || 'resolved'), 300),
  407 |     updated_at: now,
  408 |   }
  409 |   const nextRows = rows.map((row, rowIdx) => (rowIdx === idx ? updated : row))
  410 |   await writeJson(ESCALATIONS_FILE, nextRows)
  411 | 
  412 |   await trackEvent({
  413 |     type: 'lead_escalation_resolved',
  414 |     actor_id: String(actor?.id || orgOwnerId),
  415 |     entity_id: String(leadId),
  416 |     entityType: 'lead',
  417 |     metadata: { org_owner_id: orgOwnerId, escalation_id: updated.id, resolution_note: updated.resolution_note },
  418 |     allowUnknownTypes: true,
  419 |   })
  420 | 
  421 |   return updated
  422 | }
  423 | 
  424 | export async function getWorkload(actor) {
  425 |   const orgOwnerId = actorOrgOwnerId(actor)
  426 |   if (!orgOwnerId) throw forbiddenError()
  427 | 
  428 |   const [leads, users, policy] = await Promise.all([
  429 |     readStore(LEADS_FILE),
  430 |     readStore(USERS_FILE),
  431 |     ensurePolicy(orgOwnerId),
  432 |   ])
  433 |   const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === String(orgOwnerId))
  434 | 
  435 |   await persistWorkloads({ orgOwnerId, agents, leads: leads.filter((lead) => String(lead.org_owner_id || '') === String(orgOwnerId)), policy })
  436 |   const refreshedRows = await readStore(WORKLOAD_FILE)
  437 | 
  438 |   return refreshedRows
  439 |     .filter((row) => String(row.org_owner_id || '') === String(orgOwnerId))
  440 |     .map((row) => ({
  441 |       ...row,
  442 |       agent_name: users.find((user) => String(user.id || '') === String(row.agent_id))?.name || row.agent_id,
  443 |       utilization_pct: row.capped_max_leads > 0 ? Math.min(100, Math.round((Number(row.active_leads || 0) / Number(row.capped_max_leads || 1)) * 100)) : 0,
  444 |     }))
  445 |     .sort((a, b) => Number(b.utilization_pct || 0) - Number(a.utilization_pct || 0))
  446 | }
  447 | 