import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
import { sanitizeString } from '../utils/validators.js'
import {
  canManageLeadAssignments,
  canManageOrgPolicies,
  canManageOrgQueue,
  forbiddenError,
  isAgent,
} from '../utils/permissions.js'
import { trackEvent } from './eventTrackingService.js'

const USE_SQL_CRM = isCrmSqlEnabled()

const POLICIES_FILE = 'org_policies.json'
const ASSIGNMENTS_FILE = 'lead_assignments.json'
const CAPACITY_FILE = 'agent_capacity.json'
const LEADS_FILE = 'leads.json'
const USERS_FILE = 'users.json'

const DEFAULT_POLICY = {
  assignment_strategy: 'least_loaded',
  sla_targets: {
    response_minutes: 60,
    contact_minutes: 240,
    resolution_minutes: 2880,
  },
  escalation_windows: {
    warning_minutes: 30,
    breach_minutes: 60,
  },
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

function toIso(value, fallback = new Date().toISOString()) {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return date.toISOString()
}

function normalizePolicyInput(input = {}) {
  const assignmentStrategy = sanitizeString(String(input.assignment_strategy || DEFAULT_POLICY.assignment_strategy), 80)
  const slaTargets = input?.sla_targets && typeof input.sla_targets === 'object' ? input.sla_targets : {}
  const escalationWindows = input?.escalation_windows && typeof input.escalation_windows === 'object' ? input.escalation_windows : {}

  return {
    assignment_strategy: assignmentStrategy || DEFAULT_POLICY.assignment_strategy,
    sla_targets: {
      response_minutes: Math.max(1, Number(slaTargets.response_minutes ?? DEFAULT_POLICY.sla_targets.response_minutes)),
      contact_minutes: Math.max(1, Number(slaTargets.contact_minutes ?? DEFAULT_POLICY.sla_targets.contact_minutes)),
      resolution_minutes: Math.max(1, Number(slaTargets.resolution_minutes ?? DEFAULT_POLICY.sla_targets.resolution_minutes)),
    },
    escalation_windows: {
      warning_minutes: Math.max(1, Number(escalationWindows.warning_minutes ?? DEFAULT_POLICY.escalation_windows.warning_minutes)),
      breach_minutes: Math.max(1, Number(escalationWindows.breach_minutes ?? DEFAULT_POLICY.escalation_windows.breach_minutes)),
    },
  }
}

function computeLoad(leads = [], agentId = '') {
  return leads.filter((lead) => String(lead.assigned_agent_id || '') === String(agentId)).length
}

function computeSlaStatus(lead, policy) {
  const referenceAt = new Date(lead?.last_interaction_at || lead?.updated_at || lead?.created_at || Date.now())
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - referenceAt.getTime()) / 60000))
  const breachAt = Number(policy?.escalation_windows?.breach_minutes || DEFAULT_POLICY.escalation_windows.breach_minutes)
  const warningAt = Number(policy?.escalation_windows?.warning_minutes || DEFAULT_POLICY.escalation_windows.warning_minutes)

  if (elapsedMinutes >= breachAt) return { status: 'breached', elapsed_minutes: elapsedMinutes }
  if (elapsedMinutes >= warningAt) return { status: 'warning', elapsed_minutes: elapsedMinutes }
  return { status: 'healthy', elapsed_minutes: elapsedMinutes }
}

async function ensurePolicy(orgOwnerId) {
  const policies = await readStore(POLICIES_FILE)
  const existing = policies.find((policy) => (
    String(policy.org_id || policy.org_owner_id || '') === String(orgOwnerId)
      && String(policy.code || 'operations') === 'operations'
  ))
  if (existing) return existing

  const now = new Date().toISOString()
  const created = {
    id: crypto.randomUUID(),
    org_id: orgOwnerId,
    code: 'operations',
    description: 'Org operations policy',
    config: {},
    ...DEFAULT_POLICY,
    active: true,
    created_at: now,
    updated_at: now,
  }

  await writeJson(POLICIES_FILE, [...policies, created])
  return created
}

export async function getOrgPolicies(actor) {
  const orgOwnerId = actorOrgOwnerId(actor)
  if (!orgOwnerId) throw forbiddenError()
  return ensurePolicy(orgOwnerId)
}

export async function updateOrgPolicies(actor, payload = {}) {
  if (!canManageOrgPolicies(actor)) throw forbiddenError('Policy admin permission required')
  const orgOwnerId = actorOrgOwnerId(actor)
  if (!orgOwnerId) throw forbiddenError()

  const policies = await readStore(POLICIES_FILE)
  const now = new Date().toISOString()
  const input = normalizePolicyInput(payload)
  const index = policies.findIndex((policy) => (
    String(policy.org_id || policy.org_owner_id || '') === orgOwnerId
      && String(policy.code || 'operations') === 'operations'
  ))

  const next = {
    ...(index >= 0 ? policies[index] : {
      id: crypto.randomUUID(),
      org_id: orgOwnerId,
      code: 'operations',
      description: 'Org operations policy',
      config: {},
      active: true,
      created_at: now,
    }),
    ...input,
    updated_at: now,
  }

  const rows = index >= 0
    ? policies.map((row, rowIndex) => (rowIndex === index ? next : row))
    : [...policies, next]

  await writeJson(POLICIES_FILE, rows)
  return next
}

export async function getOrgQueue(actor) {
  if (!canManageOrgQueue(actor) && !isAgent(actor)) throw forbiddenError('Queue manager permission required')

  const orgOwnerId = actorOrgOwnerId(actor)
  if (!orgOwnerId) throw forbiddenError()

  const [leads, users, policy, capacityRows] = await Promise.all([
    readStore(LEADS_FILE),
    readStore(USERS_FILE),
    ensurePolicy(orgOwnerId),
    readStore(CAPACITY_FILE),
  ])

  const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === orgOwnerId)

  const scopedLeads = leads.filter((lead) => String(lead.org_owner_id || '') === orgOwnerId)
    .filter((lead) => !isAgent(actor) || String(lead.assigned_agent_id || '') === String(actor.id || ''))
    .map((lead) => ({
      ...lead,
      queue_owner_id: lead.assigned_agent_id || orgOwnerId,
      sla: computeSlaStatus(lead, policy),
    }))

  const agentCapacity = agents.map((agent) => {
    const existing = capacityRows.find((row) => String(row.agent_id || '') === String(agent.id))
    const currentLoad = computeLoad(scopedLeads, agent.id)
    return {
      id: existing?.id || crypto.randomUUID(),
      org_owner_id: orgOwnerId,
      agent_id: agent.id,
      max_concurrent_leads: Number(existing?.max_concurrent_leads || 10),
      current_load: currentLoad,
      updated_at: new Date().toISOString(),
    }
  })

  return {
    queue: scopedLeads,
    team_queues: agents.map((agent) => ({
      agent_id: agent.id,
      agent_name: agent.name,
      current_load: computeLoad(scopedLeads, agent.id),
      leads: scopedLeads.filter((lead) => String(lead.assigned_agent_id || '') === String(agent.id)),
    })),
    agent_capacity: agentCapacity,
  }
}

export async function rebalanceOrgQueue(actor, payload = {}) {
  if (!canManageLeadAssignments(actor)) throw forbiddenError('Assignment manager permission required')

  const orgOwnerId = actorOrgOwnerId(actor)
  const [users, leads, capacityRows] = await Promise.all([
    readStore(USERS_FILE),
    readStore(LEADS_FILE),
    readStore(CAPACITY_FILE),
  ])

  const strategy = sanitizeString(String(payload.strategy || 'least_loaded'), 60) || 'least_loaded'
  const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === orgOwnerId)

  if (agents.length === 0) return { moved: 0, strategy, assignments: [] }

  const leadsInScope = leads.filter((lead) => String(lead.org_owner_id || '') === orgOwnerId)
  const loadByAgent = new Map(agents.map((agent) => [agent.id, computeLoad(leadsInScope, agent.id)]))
  const capacityByAgent = new Map(agents.map((agent) => {
    const cap = capacityRows.find((row) => String(row.agent_id || '') === String(agent.id))
    return [agent.id, Number(cap?.max_concurrent_leads || 10)]
  }))

  const updatedAssignments = []
  const now = new Date().toISOString()

  function pickAgent() {
    const ranked = agents
      .map((agent) => ({
        agent_id: agent.id,
        load: Number(loadByAgent.get(agent.id) || 0),
        capacity: Number(capacityByAgent.get(agent.id) || 10),
      }))
      .filter((agent) => agent.load < agent.capacity)
      .sort((a, b) => a.load - b.load)
    return ranked[0]?.agent_id || ''
  }

  const nextLeads = leads.map((lead) => {
    if (String(lead.org_owner_id || '') !== orgOwnerId) return lead
    const hasAssignee = Boolean(lead.assigned_agent_id)
    if (hasAssignee && strategy === 'fill_unassigned') return lead

    const targetAgentId = pickAgent()
    if (!targetAgentId || String(lead.assigned_agent_id || '') === String(targetAgentId)) return lead

    const previousAgentId = String(lead.assigned_agent_id || '')
    if (previousAgentId) loadByAgent.set(previousAgentId, Math.max(0, Number(loadByAgent.get(previousAgentId) || 0) - 1))
    loadByAgent.set(targetAgentId, Number(loadByAgent.get(targetAgentId) || 0) + 1)

    updatedAssignments.push({
      id: crypto.randomUUID(),
      lead_id: lead.id,
      org_owner_id: orgOwnerId,
      assigned_by: actor.id,
      assigned_to: targetAgentId,
      previous_assignee: previousAgentId,
      reason: 'queue_rebalanced',
      assigned_at: now,
      created_at: now,
    })

    return {
      ...lead,
      assigned_agent_id: targetAgentId,
      updated_at: now,
    }
  })

  if (updatedAssignments.length) {
    await Promise.all([
      writeJson(LEADS_FILE, nextLeads),
      writeJson(ASSIGNMENTS_FILE, [...await readStore(ASSIGNMENTS_FILE), ...updatedAssignments]),
      writeJson(CAPACITY_FILE, agents.map((agent) => ({
        id: crypto.randomUUID(),
        org_owner_id: orgOwnerId,
        agent_id: agent.id,
        max_concurrent_leads: Number(capacityByAgent.get(agent.id) || 10),
        current_load: Number(loadByAgent.get(agent.id) || 0),
        updated_at: now,
      }))),
    ])

    await trackEvent({
      type: 'queue_rebalanced',
      actor_id: actor.id,
      entity_id: orgOwnerId,
      entityType: 'org_operations',
      metadata: {
        org_owner_id: orgOwnerId,
        moved: updatedAssignments.length,
        strategy,
      },
      allowUnknownTypes: true,
    })
  }

  return {
    moved: updatedAssignments.length,
    strategy,
    assignments: updatedAssignments,
  }
}

export async function escalateOrgLead(actor, leadId, payload = {}) {
  if (!canManageLeadAssignments(actor) && !canManageOrgQueue(actor)) {
    throw forbiddenError('Queue manager or assignment manager permission required')
  }

  const orgOwnerId = actorOrgOwnerId(actor)
  const [leads, policy] = await Promise.all([readStore(LEADS_FILE), ensurePolicy(orgOwnerId)])
  const target = leads.find((lead) => String(lead.id || '') === String(leadId) && String(lead.org_owner_id || '') === orgOwnerId)
  if (!target) return null

  const now = new Date().toISOString()
  const reason = sanitizeString(String(payload.reason || 'manual_escalation'), 180)
  const escalated = {
    ...target,
    status: 'escalated',
    escalated_at: now,
    escalation_reason: reason,
    updated_at: now,
  }
  await writeJson(LEADS_FILE, leads.map((lead) => (lead.id === target.id ? escalated : lead)))

  const assignmentEvent = {
    id: crypto.randomUUID(),
    lead_id: target.id,
    org_owner_id: orgOwnerId,
    assigned_by: actor.id,
    assigned_to: target.assigned_agent_id || '',
    previous_assignee: target.assigned_agent_id || '',
    reason: reason || 'lead_escalated',
    assigned_at: now,
    created_at: now,
  }

  const history = await readStore(ASSIGNMENTS_FILE)
  await writeJson(ASSIGNMENTS_FILE, [...history, assignmentEvent])

  const sla = computeSlaStatus(escalated, policy)
  if (sla.status === 'breached') {
    await trackEvent({
      type: 'sla_breached',
      actor_id: actor.id,
      entity_id: target.id,
      entityType: 'lead',
      metadata: {
        org_owner_id: orgOwnerId,
        elapsed_minutes: sla.elapsed_minutes,
        breach_minutes: policy?.escalation_windows?.breach_minutes,
      },
      allowUnknownTypes: true,
    })
  }

  await trackEvent({
    type: 'lead_escalated',
    actor_id: actor.id,
    entity_id: target.id,
    entityType: 'lead',
    metadata: {
      org_owner_id: orgOwnerId,
      reason: reason || 'manual_escalation',
    },
    allowUnknownTypes: true,
  })

  await trackEvent({
    type: 'lead_reassigned',
    actor_id: actor.id,
    entity_id: target.id,
    entityType: 'lead',
    metadata: {
      org_owner_id: orgOwnerId,
      reason: reason || 'lead_escalated',
      assigned_to: target.assigned_agent_id || '',
    },
    allowUnknownTypes: true,
  })

  return escalated
}

export async function listLeadAssignmentHistory(actor) {
  const orgOwnerId = actorOrgOwnerId(actor)
  const history = await readStore(ASSIGNMENTS_FILE)
  return history
    .filter((row) => String(row.org_owner_id || '') === orgOwnerId)
    .sort((a, b) => String(b.assigned_at || b.created_at || '').localeCompare(String(a.assigned_at || a.created_at || '')))
}

export async function upsertAgentCapacity(actor, payload = {}) {
  if (!canManageLeadAssignments(actor)) throw forbiddenError('Assignment manager permission required')
  const orgOwnerId = actorOrgOwnerId(actor)
  const rows = await readStore(CAPACITY_FILE)
  const agentId = sanitizeString(String(payload.agent_id || ''), 120)
  if (!agentId) throw new Error('agent_id is required')

  const now = new Date().toISOString()
  const index = rows.findIndex((row) => String(row.agent_id || '') === agentId && String(row.org_owner_id || '') === orgOwnerId)
  const next = {
    ...(index >= 0 ? rows[index] : { id: crypto.randomUUID(), org_owner_id: orgOwnerId, agent_id: agentId }),
    max_concurrent_leads: Math.max(1, Number(payload.max_concurrent_leads || rows[index]?.max_concurrent_leads || 10)),
    current_load: Math.max(0, Number(payload.current_load ?? rows[index]?.current_load ?? 0)),
    updated_at: now,
  }

  const updatedRows = index >= 0 ? rows.map((row, rowIndex) => (rowIndex === index ? next : row)) : [...rows, next]
  await writeJson(CAPACITY_FILE, updatedRows)
  return next
}

export function getDefaultOrgPolicy(orgOwnerId) {
  return {
    id: crypto.randomUUID(),
    org_id: orgOwnerId,
    code: 'operations',
    description: 'Org operations policy',
    config: {},
    ...DEFAULT_POLICY,
    active: true,
    created_at: toIso(),
    updated_at: toIso(),
  }
}
