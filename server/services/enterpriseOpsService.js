import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
import { sanitizeString } from '../utils/validators.js'
import { forbiddenError, isAgent } from '../utils/permissions.js'
import { trackEvent } from './eventTrackingService.js'

const USE_SQL_CRM = isCrmSqlEnabled()

const POLICY_FILE = 'org_ops_policies.json'
const LEADS_FILE = 'leads.json'
const USERS_FILE = 'users.json'
const SLA_FILE = 'lead_sla_timers.json'
const ESCALATIONS_FILE = 'lead_escalations.json'
const WORKLOAD_FILE = 'agent_workloads.json'
const ASSIGNMENTS_FILE = 'lead_assignments.json'

const VALID_ASSIGNMENT_STRATEGIES = new Set(['round_robin', 'least_loaded', 'skill_based'])
const DEFAULT_STAGE_TARGETS = {
  new: 60,
  contacted: 180,
  negotiating: 720,
  sample_sent: 1440,
  order_confirmed: 2880,
  closed: 4320,
}

const DEFAULT_POLICY = {
  assignment_strategy: 'least_loaded',
  sla_targets: DEFAULT_STAGE_TARGETS,
  escalation_rules: {
    time_based: { warning_minutes: 30, breach_minutes: 60 },
    risk_based: { high_risk_threshold: 80, auto_escalate_threshold: 95 },
  },
  workload_caps: { default_max_active_leads: 10, overrides: {} },
}

async function readStore(fileName) {
  if (USE_SQL_CRM) return readJson(fileName)
  return readLegacyJson(fileName)
}

function actorOrgOwnerId(actor) {
  if (!actor) return ''
  if (isAgent(actor)) return sanitizeString(actor.org_owner_id || '', 120)
  return sanitizeString(actor.id || '', 120)
}

function normalizePolicyInput(payload = {}) {
  const safeAssignment = sanitizeString(String(payload.assignment_strategy || DEFAULT_POLICY.assignment_strategy), 80).toLowerCase()
  const assignment_strategy = VALID_ASSIGNMENT_STRATEGIES.has(safeAssignment) ? safeAssignment : DEFAULT_POLICY.assignment_strategy

  const inputStageTargets = (payload?.sla_targets || payload?.sla_targets_by_stage) && typeof (payload?.sla_targets || payload?.sla_targets_by_stage) === 'object'
    ? (payload?.sla_targets || payload?.sla_targets_by_stage)
    : {}
  const stageTargets = { ...DEFAULT_STAGE_TARGETS }
  Object.entries(inputStageTargets).forEach(([stage, value]) => {
    const stageKey = sanitizeString(String(stage || ''), 60).toLowerCase().replace(/\s+/g, '_')
    const minutes = Math.max(1, Number(value || DEFAULT_STAGE_TARGETS[stageKey] || 60))
    if (stageKey) stageTargets[stageKey] = minutes
  })

  const escalationRules = payload?.escalation_rules && typeof payload.escalation_rules === 'object'
    ? payload.escalation_rules
    : {}
  const timeBased = escalationRules?.time_based && typeof escalationRules.time_based === 'object' ? escalationRules.time_based : {}
  const riskBased = escalationRules?.risk_based && typeof escalationRules.risk_based === 'object' ? escalationRules.risk_based : {}

  const workloadCaps = (payload?.workload_caps || payload?.workload_caps_per_agent) && typeof (payload?.workload_caps || payload?.workload_caps_per_agent) === 'object'
    ? (payload?.workload_caps || payload?.workload_caps_per_agent)
    : {}
  const overrides = workloadCaps?.overrides && typeof workloadCaps.overrides === 'object' ? workloadCaps.overrides : {}

  return {
    assignment_strategy,
    sla_targets: stageTargets,
    escalation_rules: {
      time_based: {
        warning_minutes: Math.max(1, Number(timeBased.warning_minutes ?? DEFAULT_POLICY.escalation_rules.time_based.warning_minutes)),
        breach_minutes: Math.max(1, Number(timeBased.breach_minutes ?? DEFAULT_POLICY.escalation_rules.time_based.breach_minutes)),
      },
      risk_based: {
        high_risk_threshold: Math.max(1, Number(riskBased.high_risk_threshold ?? DEFAULT_POLICY.escalation_rules.risk_based.high_risk_threshold)),
        auto_escalate_threshold: Math.max(1, Number(riskBased.auto_escalate_threshold ?? DEFAULT_POLICY.escalation_rules.risk_based.auto_escalate_threshold)),
      },
    },
    workload_caps: {
      default_max_active_leads: Math.max(1, Number(workloadCaps.default_max_active_leads ?? DEFAULT_POLICY.workload_caps.default_max_active_leads)),
      overrides: Object.fromEntries(
        Object.entries(overrides)
          .map(([agentId, cap]) => [sanitizeString(String(agentId || ''), 120), Math.max(1, Number(cap || 1))])
          .filter(([agentId]) => Boolean(agentId)),
      ),
    },
  }
}

async function ensurePolicy(orgOwnerId) {
  const rows = await readStore(POLICY_FILE)
  const existing = rows.find((row) => String(row.org_owner_id || '') === String(orgOwnerId))
  if (existing) return existing

  const now = new Date().toISOString()
  const created = {
    id: crypto.randomUUID(),
    org_owner_id: orgOwnerId,
    round_robin_index: 0,
    active: true,
    ...DEFAULT_POLICY,
    created_at: now,
    updated_at: now,
  }
  await writeJson(POLICY_FILE, [...rows, created])
  return created
}

export async function getOpsPolicies(actor) {
  const orgOwnerId = actorOrgOwnerId(actor)
  if (!orgOwnerId) throw forbiddenError()
  return ensurePolicy(orgOwnerId)
}

export async function updateOpsPolicies(actor, payload = {}) {
  const orgOwnerId = actorOrgOwnerId(actor)
  if (!orgOwnerId) throw forbiddenError()

  const rows = await readStore(POLICY_FILE)
  const policyInput = normalizePolicyInput(payload)
  const now = new Date().toISOString()
  const idx = rows.findIndex((row) => String(row.org_owner_id || '') === String(orgOwnerId))
  const nextPolicy = {
    ...(idx >= 0 ? rows[idx] : { id: crypto.randomUUID(), org_owner_id: orgOwnerId, created_at: now, round_robin_index: 0, active: true }),
    ...policyInput,
    updated_at: now,
  }

  const nextRows = idx >= 0 ? rows.map((row, rowIdx) => (rowIdx === idx ? nextPolicy : row)) : [...rows, nextPolicy]
  await writeJson(POLICY_FILE, nextRows)
  return nextPolicy
}

function computeAgentLoad(leads = [], agentId = '') {
  return leads.filter((lead) => String(lead.assigned_agent_id || '') === String(agentId) && String(lead.status || '') !== 'closed').length
}

function computeAgentCap(policy, agentId) {
  const override = Number(policy?.workload_caps?.overrides?.[agentId])
  const base = Number(policy?.workload_caps?.default_max_active_leads || 10)
  return Number.isFinite(override) && override > 0 ? override : base
}

async function persistWorkloads({ orgOwnerId, agents, leads, policy }) {
  const rows = await readStore(WORKLOAD_FILE)
  const now = new Date().toISOString()
  const nextRows = rows.filter((row) => String(row.org_owner_id || '') !== String(orgOwnerId))

  agents.forEach((agent) => {
    const current = rows.find((row) => String(row.org_owner_id || '') === String(orgOwnerId) && String(row.agent_id || '') === String(agent.id))
    nextRows.push({
      id: current?.id || crypto.randomUUID(),
      org_owner_id: orgOwnerId,
      agent_id: String(agent.id),
      active_leads: computeAgentLoad(leads, agent.id),
      capped_max_leads: computeAgentCap(policy, String(agent.id)),
      last_assigned_at: current?.last_assigned_at || null,
      updated_at: now,
    })
  })

  await writeJson(WORKLOAD_FILE, nextRows)
}

async function chooseAssignee({ policy, orgOwnerId, lead, leads, users }) {
  const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === String(orgOwnerId))
  if (!agents.length) return null

  const eligible = agents
    .map((agent) => ({
      agent,
      active_leads: computeAgentLoad(leads, agent.id),
      cap: computeAgentCap(policy, String(agent.id)),
    }))
    .filter((row) => row.active_leads < row.cap)

  if (!eligible.length) return null

  const strategy = String(policy?.assignment_strategy || DEFAULT_POLICY.assignment_strategy)

  if (strategy === 'round_robin') {
    const start = Math.max(0, Number(policy?.round_robin_index || 0)) % eligible.length
    const pick = eligible[start]
    return pick?.agent?.id ? { agentId: String(pick.agent.id), nextRoundRobinIndex: start + 1 } : null
  }

  if (strategy === 'skill_based') {
    const requiredSkill = sanitizeString(String(lead?.required_skill || lead?.source_type || ''), 120).toLowerCase()
    const skillMatched = requiredSkill
      ? eligible.filter((row) => Array.isArray(row.agent?.skills) && row.agent.skills.map((skill) => String(skill).toLowerCase()).includes(requiredSkill))
      : []
    const pool = skillMatched.length ? skillMatched : eligible
    const sorted = pool.slice().sort((a, b) => a.active_leads - b.active_leads)
    const top = sorted[0]
    return top?.agent?.id ? { agentId: String(top.agent.id) } : null
  }

  const sorted = eligible.slice().sort((a, b) => a.active_leads - b.active_leads)
  const top = sorted[0]
  return top?.agent?.id ? { agentId: String(top.agent.id) } : null
}

async function upsertSlaTimer(lead, policy) {
  const leadStatus = sanitizeString(String(lead?.status || 'new'), 60).toLowerCase().replace(/\s+/g, '_')
  const targetMinutes = Math.max(1, Number(policy?.sla_targets?.[leadStatus] || DEFAULT_STAGE_TARGETS[leadStatus] || 60))
  const baseDate = new Date(lead?.updated_at || lead?.created_at || Date.now())
  const deadlineAt = new Date(baseDate.getTime() + targetMinutes * 60000)
  const rows = await readStore(SLA_FILE)
  const existingIdx = rows.findIndex((row) => String(row.lead_id || '') === String(lead.id) && String(row.stage || '') === leadStatus)
  const now = new Date().toISOString()
  const next = {
    ...(existingIdx >= 0 ? rows[existingIdx] : { id: crypto.randomUUID(), lead_id: lead.id, created_at: now }),
    org_owner_id: lead.org_owner_id,
    stage: leadStatus,
    target_minutes: targetMinutes,
    deadline_at: deadlineAt.toISOString(),
    updated_at: now,
  }
  const nextRows = existingIdx >= 0 ? rows.map((row, idx) => (idx === existingIdx ? next : row)) : [...rows, next]
  await writeJson(SLA_FILE, nextRows)
  return next
}

export async function applyLeadOpsOnCreateOrUpdate({ actor, lead, trigger = 'update' }) {
  if (!lead?.id || !lead?.org_owner_id) return lead

  const orgOwnerId = String(lead.org_owner_id)
  const [policy, leads, users] = await Promise.all([
    ensurePolicy(orgOwnerId),
    readStore(LEADS_FILE),
    readStore(USERS_FILE),
  ])

  const changed = { ...lead }

  if (!changed.assigned_agent_id) {
    const picked = await chooseAssignee({ policy, orgOwnerId, lead: changed, leads, users })
    if (picked?.agentId) {
      changed.assigned_agent_id = picked.agentId
      await trackEvent({
        type: 'lead_assignment',
        actor_id: String(actor?.id || orgOwnerId),
        entity_id: String(changed.id),
        entityType: 'lead',
        metadata: { org_owner_id: orgOwnerId, strategy: policy.assignment_strategy, assigned_to: picked.agentId, trigger },
        allowUnknownTypes: true,
      })
      const assignments = await readStore(ASSIGNMENTS_FILE)
      assignments.push({
        id: crypto.randomUUID(),
        lead_id: changed.id,
        org_owner_id: orgOwnerId,
        assigned_by: String(actor?.id || orgOwnerId),
        assigned_to: picked.agentId,
        previous_assignee: '',
        reason: 'policy_auto_assignment',
        assigned_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      await writeJson(ASSIGNMENTS_FILE, assignments)

      if (picked.nextRoundRobinIndex !== undefined) {
        const policies = await readStore(POLICY_FILE)
        await writeJson(POLICY_FILE, policies.map((row) => (
          String(row.id || '') === String(policy.id)
            ? { ...row, round_robin_index: picked.nextRoundRobinIndex, updated_at: new Date().toISOString() }
            : row
        )))
      }
    }
  }

  const timer = await upsertSlaTimer(changed, policy)
  changed.sla = {
    stage: timer.stage,
    deadline_at: timer.deadline_at,
    target_minutes: timer.target_minutes,
  }

  await persistWorkloads({
    orgOwnerId,
    agents: users.filter((u) => String(u.role || '').toLowerCase() === 'agent' && String(u.org_owner_id || '') === orgOwnerId),
    leads: leads.map((existing) => (String(existing.id || '') === String(changed.id) ? changed : existing)),
    policy,
  })

  return changed
}

function timeEscalationSeverity(policy, timer) {
  const breachMinutes = Number(policy?.escalation_rules?.time_based?.breach_minutes || 60)
  const warningMinutes = Number(policy?.escalation_rules?.time_based?.warning_minutes || 30)
  const now = Date.now()
  const deadline = new Date(timer?.deadline_at || Date.now()).getTime()
  const overdueMinutes = Math.max(0, Math.floor((now - deadline) / 60000))
  if (overdueMinutes >= breachMinutes) return { breached: true, severity: 'critical', overdueMinutes }
  if (overdueMinutes >= warningMinutes) return { breached: true, severity: 'warning', overdueMinutes }
  return { breached: false, severity: 'healthy', overdueMinutes }
}

export async function evaluateAndEscalateLeadIfBreached({ actor, lead }) {
  if (!lead?.id || !lead?.org_owner_id) return { escalated: false }

  const orgOwnerId = String(lead.org_owner_id)
  const [policy, timers, escalations] = await Promise.all([
    ensurePolicy(orgOwnerId),
    readStore(SLA_FILE),
    readStore(ESCALATIONS_FILE),
  ])
  const leadTimers = timers.filter((row) => String(row.lead_id || '') === String(lead.id))
  if (!leadTimers.length) return { escalated: false }

  const activeEscalation = escalations.find((row) => String(row.lead_id || '') === String(lead.id) && !row.resolved_at)
  if (activeEscalation) return { escalated: false, activeEscalation }

  const breachedTimer = leadTimers
    .map((timer) => ({ timer, eval: timeEscalationSeverity(policy, timer) }))
    .find((item) => item.eval.breached)

  const riskScore = Number(lead?.risk_score || 0)
  const riskThreshold = Number(policy?.escalation_rules?.risk_based?.auto_escalate_threshold || 95)
  const riskBreached = riskScore >= riskThreshold

  if (!breachedTimer && !riskBreached) return { escalated: false }

  const reason = breachedTimer
    ? `time_breach_stage_${breachedTimer.timer.stage}`
    : `risk_breach_score_${riskScore}`

  const now = new Date().toISOString()
  const escalation = {
    id: crypto.randomUUID(),
    lead_id: String(lead.id),
    org_owner_id: orgOwnerId,
    sla_timer_id: breachedTimer?.timer?.id || null,
    severity: breachedTimer?.eval?.severity || 'critical',
    reason,
    triggered_by: String(actor?.id || 'system'),
    triggered_at: now,
    created_at: now,
    updated_at: now,
  }

  await writeJson(ESCALATIONS_FILE, [...escalations, escalation])

  if (breachedTimer?.timer?.id) {
    await writeJson(SLA_FILE, timers.map((row) => (
      String(row.id || '') === String(breachedTimer.timer.id)
        ? { ...row, breached_at: row.breached_at || now, updated_at: now }
        : row
    )))
  }

  await trackEvent({
    type: 'sla_breach',
    actor_id: String(actor?.id || orgOwnerId),
    entity_id: String(lead.id),
    entityType: 'lead',
    metadata: { org_owner_id: orgOwnerId, reason, severity: escalation.severity },
    allowUnknownTypes: true,
  })

  await trackEvent({
    type: 'lead_escalation',
    actor_id: String(actor?.id || orgOwnerId),
    entity_id: String(lead.id),
    entityType: 'lead',
    metadata: { org_owner_id: orgOwnerId, escalation_id: escalation.id, reason },
    allowUnknownTypes: true,
  })

  return { escalated: true, escalation }
}

export async function listEscalations(actor) {
  const orgOwnerId = actorOrgOwnerId(actor)
  if (!orgOwnerId) throw forbiddenError()

  const rows = await readStore(ESCALATIONS_FILE)
  return rows
    .filter((row) => String(row.org_owner_id || '') === String(orgOwnerId))
    .sort((a, b) => String(b.triggered_at || b.created_at || '').localeCompare(String(a.triggered_at || a.created_at || '')))
}

export async function resolveEscalation(actor, leadId, resolutionNote = '') {
  const orgOwnerId = actorOrgOwnerId(actor)
  if (!orgOwnerId) throw forbiddenError()

  const rows = await readStore(ESCALATIONS_FILE)
  const idx = rows.findIndex((row) => String(row.org_owner_id || '') === String(orgOwnerId) && String(row.lead_id || '') === String(leadId) && !row.resolved_at)
  if (idx < 0) return null

  const now = new Date().toISOString()
  const updated = {
    ...rows[idx],
    resolved_at: now,
    resolved_by: String(actor?.id || ''),
    resolution_note: sanitizeString(String(resolutionNote || 'resolved'), 300),
    updated_at: now,
  }
  const nextRows = rows.map((row, rowIdx) => (rowIdx === idx ? updated : row))
  await writeJson(ESCALATIONS_FILE, nextRows)

  await trackEvent({
    type: 'lead_escalation_resolved',
    actor_id: String(actor?.id || orgOwnerId),
    entity_id: String(leadId),
    entityType: 'lead',
    metadata: { org_owner_id: orgOwnerId, escalation_id: updated.id, resolution_note: updated.resolution_note },
    allowUnknownTypes: true,
  })

  return updated
}

export async function getWorkload(actor) {
  const orgOwnerId = actorOrgOwnerId(actor)
  if (!orgOwnerId) throw forbiddenError()

  const [leads, users, policy] = await Promise.all([
    readStore(LEADS_FILE),
    readStore(USERS_FILE),
    ensurePolicy(orgOwnerId),
  ])
  const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === String(orgOwnerId))

  await persistWorkloads({ orgOwnerId, agents, leads: leads.filter((lead) => String(lead.org_owner_id || '') === String(orgOwnerId)), policy })
  const refreshedRows = await readStore(WORKLOAD_FILE)

  return refreshedRows
    .filter((row) => String(row.org_owner_id || '') === String(orgOwnerId))
    .map((row) => ({
      ...row,
      agent_name: users.find((user) => String(user.id || '') === String(row.agent_id))?.name || row.agent_id,
      utilization_pct: row.capped_max_leads > 0 ? Math.min(100, Math.round((Number(row.active_leads || 0) / Number(row.capped_max_leads || 1)) * 100)) : 0,
    }))
    .sort((a, b) => Number(b.utilization_pct || 0) - Number(a.utilization_pct || 0))
}
