## Commit Metadata
- **Hash:** 2d69ddaec9b6bb08496c8c28c8c0f48ea5482c73
- **Parent:** 0c0019dca5b254250245af5bc5e735828cc080a3 df70a54db4c15ce0039922b734f2d9e2aaccf842
- **Author:** Cyber Code Master
- **Date:** 2026-04-06 19:04:16
- **Message:** Merge pull request #88 from gamertoky1188gro/codex/implement-enterprise-operations-service-and-ui

## Custom Title
Merge pull request #88 from gamertoky1188gro/codex/implement-enterprise-operations-service-and-ui

## High-Level Summary
Merge pull request #88 from gamertoky1188gro/codex/implement-enterprise-operations-service-and-ui

 11 files changed, 820 insertions(+), 25 deletions(-)

## File-by-File Breakdown
 .../migration.sql                                  |  64 +++
 prisma/schema.prisma                               |  71 ++++
 server/controllers/orgOperationsController.js      |  55 ++-
 server/routes/orgOperationsRoutes.js               |  10 +
 server/routes/orgRoutes.js                         |   1 +
 server/services/enterpriseOpsService.js            | 446 +++++++++++++++++++++
 server/services/leadService.js                     |  35 +-
 server/utils/jsonStore.js                          |   4 +
 src/components/leads/LeadManager.jsx               | 105 ++++-
 src/pages/AgentDashboard.jsx                       |  16 +-
 src/pages/OwnerDashboard.jsx                       |  38 +-
 11 files changed, 820 insertions(+), 25 deletions(-)

## Detailed Diff Analysis
```diff
diff --git a/prisma/migrations/20260406153000_add_enterprise_ops_engine/migration.sql b/prisma/migrations/20260406153000_add_enterprise_ops_engine/migration.sql
new file mode 100644
index 0000000..771a534
--- /dev/null
+++ b/prisma/migrations/20260406153000_add_enterprise_ops_engine/migration.sql
@@ -0,0 +1,64 @@
+CREATE TABLE IF NOT EXISTS "org_ops_policies" (
+  "id" TEXT PRIMARY KEY,
+  "org_owner_id" TEXT NOT NULL,
+  "assignment_strategy" TEXT NOT NULL DEFAULT 'least_loaded',
+  "sla_targets" JSONB,
+  "escalation_rules" JSONB,
+  "workload_caps" JSONB,
+  "round_robin_index" INTEGER NOT NULL DEFAULT 0,
+  "active" BOOLEAN NOT NULL DEFAULT TRUE,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3)
+);
+
+CREATE UNIQUE INDEX IF NOT EXISTS "org_ops_policy_org_owner_id" ON "org_ops_policies"("org_owner_id");
+
+CREATE TABLE IF NOT EXISTS "lead_sla_timers" (
+  "id" TEXT PRIMARY KEY,
+  "lead_id" TEXT NOT NULL,
+  "org_owner_id" TEXT NOT NULL,
+  "stage" TEXT NOT NULL,
+  "target_minutes" INTEGER NOT NULL,
+  "deadline_at" TIMESTAMP(3) NOT NULL,
+  "breached_at" TIMESTAMP(3),
+  "resolved_at" TIMESTAMP(3),
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3),
+  CONSTRAINT "lead_sla_timers_lead_fk" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE
+);
+
+CREATE UNIQUE INDEX IF NOT EXISTS "lead_sla_timers_lead_id_stage" ON "lead_sla_timers"("lead_id", "stage");
+CREATE INDEX IF NOT EXISTS "lead_sla_timers_org_deadline" ON "lead_sla_timers"("org_owner_id", "deadline_at");
+
+CREATE TABLE IF NOT EXISTS "lead_escalations" (
+  "id" TEXT PRIMARY KEY,
+  "lead_id" TEXT NOT NULL,
+  "org_owner_id" TEXT NOT NULL,
+  "sla_timer_id" TEXT,
+  "severity" TEXT,
+  "reason" TEXT NOT NULL,
+  "triggered_by" TEXT,
+  "triggered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "resolved_at" TIMESTAMP(3),
+  "resolved_by" TEXT,
+  "resolution_note" TEXT,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3),
+  CONSTRAINT "lead_escalations_lead_fk" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE
+);
+
+CREATE INDEX IF NOT EXISTS "lead_escalations_org_triggered" ON "lead_escalations"("org_owner_id", "triggered_at");
+CREATE INDEX IF NOT EXISTS "lead_escalations_lead_resolved" ON "lead_escalations"("lead_id", "resolved_at");
+
+CREATE TABLE IF NOT EXISTS "agent_workloads" (
+  "id" TEXT PRIMARY KEY,
+  "org_owner_id" TEXT NOT NULL,
+  "agent_id" TEXT NOT NULL,
+  "active_leads" INTEGER NOT NULL DEFAULT 0,
+  "capped_max_leads" INTEGER NOT NULL DEFAULT 10,
+  "last_assigned_at" TIMESTAMP(3),
+  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
+);
+
+CREATE UNIQUE INDEX IF NOT EXISTS "agent_workloads_org_owner_id_agent_id" ON "agent_workloads"("org_owner_id", "agent_id");
+CREATE INDEX IF NOT EXISTS "agent_workloads_org_active_leads" ON "agent_workloads"("org_owner_id", "active_leads");
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 0cae528..1575859 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -499,6 +499,8 @@ model Lead {
   reminders           LeadReminder[]
   interactions        InteractionLog[]
   assignments         LeadAssignment[]
+  slaTimers           LeadSlaTimer[]
+  escalations         LeadEscalation[]
 
   @@index([org_owner_id, status, updated_at])
   @@index([assigned_agent_id, updated_at])
@@ -536,6 +538,75 @@ model AgentCapacity {
   @@map("agent_capacity")
 }
 
+model OrgOpsPolicy {
+  id                  String   @id
+  org_owner_id        String
+  assignment_strategy String   @default("least_loaded")
+  sla_targets         Json?
+  escalation_rules    Json?
+  workload_caps       Json?
+  round_robin_index   Int      @default(0)
+  active              Boolean  @default(true)
+  created_at          DateTime @default(now())
+  updated_at          DateTime?
+
+  @@unique([org_owner_id], name: "org_ops_policy_org_owner_id")
+  @@map("org_ops_policies")
+}
+
+model LeadSlaTimer {
+  id                   String   @id
+  lead_id              String
+  org_owner_id         String
+  stage                String
+  target_minutes       Int
+  deadline_at          DateTime
+  breached_at          DateTime?
+  resolved_at          DateTime?
+  created_at           DateTime @default(now())
+  updated_at           DateTime?
+  lead                 Lead     @relation(fields: [lead_id], references: [id], onDelete: Cascade, onUpdate: Cascade)
+
+  @@unique([lead_id, stage], name: "lead_sla_timers_lead_id_stage")
+  @@index([org_owner_id, deadline_at])
+  @@map("lead_sla_timers")
+}
+
+model LeadEscalation {
+  id                String   @id
+  lead_id           String
+  org_owner_id      String
+  sla_timer_id      String?
+  severity          String?
+  reason            String
+  triggered_by      String?
+  triggered_at      DateTime @default(now())
+  resolved_at       DateTime?
+  resolved_by       String?
+  resolution_note   String?
+  created_at        DateTime @default(now())
+  updated_at        DateTime?
+  lead              Lead     @relation(fields: [lead_id], references: [id], onDelete: Cascade, onUpdate: Cascade)
+
+  @@index([org_owner_id, triggered_at])
+  @@index([lead_id, resolved_at])
+  @@map("lead_escalations")
+}
+
+model AgentWorkload {
+  id                  String   @id
+  org_owner_id        String
+  agent_id            String
+  active_leads        Int      @default(0)
+  capped_max_leads    Int      @default(10)
+  last_assigned_at    DateTime?
+  updated_at          DateTime @default(now())
+
+  @@unique([org_owner_id, agent_id], name: "agent_workloads_org_owner_id_agent_id")
+  @@index([org_owner_id, active_leads])
+  @@map("agent_workloads")
+}
+
 model LeadNote {
   id           String   @id
   lead_id      String
diff --git a/server/controllers/orgOperationsController.js b/server/controllers/orgOperationsController.js
index 33e6834..21ff41f 100644
--- a/server/controllers/orgOperationsController.js
+++ b/server/controllers/orgOperationsController.js
@@ -6,11 +6,18 @@ import {
   rebalanceOrgQueue,
   updateOrgPolicies,
 } from '../services/orgOperationsService.js'
+import {
+  getOpsPolicies,
+  getWorkload,
+  listEscalations,
+  resolveEscalation,
+  updateOpsPolicies,
+} from '../services/enterpriseOpsService.js'
 import { handleControllerError } from '../utils/permissions.js'
 
 export async function getOperationsPolicies(req, res) {
   try {
-    const policy = await getOrgPolicies(req.user)
+    const policy = await getOpsPolicies(req.user)
     return res.json(policy)
   } catch (error) {
     return handleControllerError(res, error)
@@ -18,6 +25,24 @@ export async function getOperationsPolicies(req, res) {
 }
 
 export async function putOperationsPolicies(req, res) {
+  try {
+    const policy = await updateOpsPolicies(req.user, req.body || {})
+    return res.json(policy)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function getLegacyOperationsPolicies(req, res) {
+  try {
+    const policy = await getOrgPolicies(req.user)
+    return res.json(policy)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function putLegacyOperationsPolicies(req, res) {
   try {
     const policy = await updateOrgPolicies(req.user, req.body || {})
     return res.json(policy)
@@ -54,3 +79,31 @@ export async function postOperationsEscalate(req, res) {
     return handleControllerError(res, error)
   }
 }
+
+export async function getOperationsEscalations(req, res) {
+  try {
+    const rows = await listEscalations(req.user)
+    return res.json({ items: rows })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function postResolveEscalation(req, res) {
+  try {
+    const updated = await resolveEscalation(req.user, req.params.leadId, req.body?.resolution_note)
+    if (!updated) return res.status(404).json({ error: 'Escalation not found' })
+    return res.json(updated)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function getOperationsWorkload(req, res) {
+  try {
+    const rows = await getWorkload(req.user)
+    return res.json({ items: rows })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
diff --git a/server/routes/orgOperationsRoutes.js b/server/routes/orgOperationsRoutes.js
index fe53892..c767c4f 100644
--- a/server/routes/orgOperationsRoutes.js
+++ b/server/routes/orgOperationsRoutes.js
@@ -1,10 +1,15 @@
 import { Router } from 'express'
 import { allowRoles, requireAuth } from '../middleware/auth.js'
 import {
+  getLegacyOperationsPolicies,
   getOperationsPolicies,
+  getOperationsEscalations,
   getOperationsQueue,
+  getOperationsWorkload,
   postOperationsEscalate,
   postOperationsRebalance,
+  postResolveEscalation,
+  putLegacyOperationsPolicies,
   putOperationsPolicies,
 } from '../controllers/orgOperationsController.js'
 
@@ -14,8 +19,13 @@ router.use(requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory',
 
 router.get('/policies', getOperationsPolicies)
 router.put('/policies', putOperationsPolicies)
+router.get('/legacy-policies', getLegacyOperationsPolicies)
+router.put('/legacy-policies', putLegacyOperationsPolicies)
 router.get('/queue', getOperationsQueue)
 router.post('/rebalance', postOperationsRebalance)
 router.post('/escalate/:leadId', postOperationsEscalate)
+router.get('/escalations', getOperationsEscalations)
+router.post('/escalations/:leadId/resolve', postResolveEscalation)
+router.get('/workload', getOperationsWorkload)
 
 export default router
diff --git a/server/routes/orgRoutes.js b/server/routes/orgRoutes.js
index ad3a699..a23ea83 100644
--- a/server/routes/orgRoutes.js
+++ b/server/routes/orgRoutes.js
@@ -6,5 +6,6 @@ const router = Router()
 
 router.use('/members', memberRoutes)
 router.use('/operations', orgOperationsRoutes)
+router.use('/ops', orgOperationsRoutes)
 
 export default router
diff --git a/server/services/enterpriseOpsService.js b/server/services/enterpriseOpsService.js
new file mode 100644
index 0000000..876c580
--- /dev/null
+++ b/server/services/enterpriseOpsService.js
@@ -0,0 +1,446 @@
+import crypto from 'crypto'
+import { readJson, writeJson } from '../utils/jsonStore.js'
+import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
+import { sanitizeString } from '../utils/validators.js'
+import { forbiddenError, isAgent } from '../utils/permissions.js'
+import { trackEvent } from './eventTrackingService.js'
+
+const USE_SQL_CRM = isCrmSqlEnabled()
+
+const POLICY_FILE = 'org_ops_policies.json'
+const LEADS_FILE = 'leads.json'
+const USERS_FILE = 'users.json'
+const SLA_FILE = 'lead_sla_timers.json'
+const ESCALATIONS_FILE = 'lead_escalations.json'
+const WORKLOAD_FILE = 'agent_workloads.json'
+const ASSIGNMENTS_FILE = 'lead_assignments.json'
+
+const VALID_ASSIGNMENT_STRATEGIES = new Set(['round_robin', 'least_loaded', 'skill_based'])
+const DEFAULT_STAGE_TARGETS = {
+  new: 60,
+  contacted: 180,
+  negotiating: 720,
+  sample_sent: 1440,
+  order_confirmed: 2880,
+  closed: 4320,
+}
+
+const DEFAULT_POLICY = {
+  assignment_strategy: 'least_loaded',
+  sla_targets_by_stage: DEFAULT_STAGE_TARGETS,
+  escalation_rules: {
+    time_based: { warning_minutes: 30, breach_minutes: 60 },
+    risk_based: { high_risk_threshold: 80, auto_escalate_threshold: 95 },
+  },
+  workload_caps_per_agent: { default_max_active_leads: 10, overrides: {} },
+}
+
+async function readStore(fileName) {
+  if (USE_SQL_CRM) return readJson(fileName)
+  return readLegacyJson(fileName)
+}
+
+function actorOrgOwnerId(actor) {
+  if (!actor) return ''
+  if (isAgent(actor)) return sanitizeString(actor.org_owner_id || '', 120)
+  return sanitizeString(actor.id || '', 120)
+}
+
+function normalizePolicyInput(payload = {}) {
+  const safeAssignment = sanitizeString(String(payload.assignment_strategy || DEFAULT_POLICY.assignment_strategy), 80).toLowerCase()
+  const assignment_strategy = VALID_ASSIGNMENT_STRATEGIES.has(safeAssignment) ? safeAssignment : DEFAULT_POLICY.assignment_strategy
+
+  const inputStageTargets = payload?.sla_targets_by_stage && typeof payload.sla_targets_by_stage === 'object'
+    ? payload.sla_targets_by_stage
+    : {}
+  const stageTargets = { ...DEFAULT_STAGE_TARGETS }
+  Object.entries(inputStageTargets).forEach(([stage, value]) => {
+    const stageKey = sanitizeString(String(stage || ''), 60).toLowerCase().replace(/\s+/g, '_')
+    const minutes = Math.max(1, Number(value || DEFAULT_STAGE_TARGETS[stageKey] || 60))
+    if (stageKey) stageTargets[stageKey] = minutes
+  })
+
+  const escalationRules = payload?.escalation_rules && typeof payload.escalation_rules === 'object'
+    ? payload.escalation_rules
+    : {}
+  const timeBased = escalationRules?.time_based && typeof escalationRules.time_based === 'object' ? escalationRules.time_based : {}
+  const riskBased = escalationRules?.risk_based && typeof escalationRules.risk_based === 'object' ? escalationRules.risk_based : {}
+
+  const workloadCaps = payload?.workload_caps_per_agent && typeof payload.workload_caps_per_agent === 'object'
+    ? payload.workload_caps_per_agent
+    : {}
+  const overrides = workloadCaps?.overrides && typeof workloadCaps.overrides === 'object' ? workloadCaps.overrides : {}
+
+  return {
+    assignment_strategy,
+    sla_targets_by_stage: stageTargets,
+    escalation_rules: {
+      time_based: {
+        warning_minutes: Math.max(1, Number(timeBased.warning_minutes ?? DEFAULT_POLICY.escalation_rules.time_based.warning_minutes)),
+        breach_minutes: Math.max(1, Number(timeBased.breach_minutes ?? DEFAULT_POLICY.escalation_rules.time_based.breach_minutes)),
+      },
+      risk_based: {
+        high_risk_threshold: Math.max(1, Number(riskBased.high_risk_threshold ?? DEFAULT_POLICY.escalation_rules.risk_based.high_risk_threshold)),
+        auto_escalate_threshold: Math.max(1, Number(riskBased.auto_escalate_threshold ?? DEFAULT_POLICY.escalation_rules.risk_based.auto_escalate_threshold)),
+      },
+    },
+    workload_caps_per_agent: {
+      default_max_active_leads: Math.max(1, Number(workloadCaps.default_max_active_leads ?? DEFAULT_POLICY.workload_caps_per_agent.default_max_active_leads)),
+      overrides: Object.fromEntries(
+        Object.entries(overrides)
+          .map(([agentId, cap]) => [sanitizeString(String(agentId || ''), 120), Math.max(1, Number(cap || 1))])
+          .filter(([agentId]) => Boolean(agentId)),
+      ),
+    },
+  }
+}
+
+async function ensurePolicy(orgOwnerId) {
+  const rows = await readStore(POLICY_FILE)
+  const existing = rows.find((row) => String(row.org_owner_id || '') === String(orgOwnerId))
+  if (existing) return existing
+
+  const now = new Date().toISOString()
+  const created = {
+    id: crypto.randomUUID(),
+    org_owner_id: orgOwnerId,
+    round_robin_index: 0,
+    active: true,
+    ...DEFAULT_POLICY,
+    created_at: now,
+    updated_at: now,
+  }
+  await writeJson(POLICY_FILE, [...rows, created])
+  return created
+}
+
+export async function getOpsPolicies(actor) {
+  const orgOwnerId = actorOrgOwnerId(actor)
+  if (!orgOwnerId) throw forbiddenError()
+  return ensurePolicy(orgOwnerId)
+}
+
+export async function updateOpsPolicies(actor, payload = {}) {
+  const orgOwnerId = actorOrgOwnerId(actor)
+  if (!orgOwnerId) throw forbiddenError()
+
+  const rows = await readStore(POLICY_FILE)
+  const policyInput = normalizePolicyInput(payload)
+  const now = new Date().toISOString()
+  const idx = rows.findIndex((row) => String(row.org_owner_id || '') === String(orgOwnerId))
+  const nextPolicy = {
+    ...(idx >= 0 ? rows[idx] : { id: crypto.randomUUID(), org_owner_id: orgOwnerId, created_at: now, round_robin_index: 0, active: true }),
+    ...policyInput,
+    updated_at: now,
+  }
+
+  const nextRows = idx >= 0 ? rows.map((row, rowIdx) => (rowIdx === idx ? nextPolicy : row)) : [...rows, nextPolicy]
+  await writeJson(POLICY_FILE, nextRows)
+  return nextPolicy
+}
+
+function computeAgentLoad(leads = [], agentId = '') {
+  return leads.filter((lead) => String(lead.assigned_agent_id || '') === String(agentId) && String(lead.status || '') !== 'closed').length
+}
+
+function computeAgentCap(policy, agentId) {
+  const override = Number(policy?.workload_caps_per_agent?.overrides?.[agentId])
+  const base = Number(policy?.workload_caps_per_agent?.default_max_active_leads || 10)
+  return Number.isFinite(override) && override > 0 ? override : base
+}
+
+async function persistWorkloads({ orgOwnerId, agents, leads, policy }) {
+  const rows = await readStore(WORKLOAD_FILE)
+  const now = new Date().toISOString()
+  const nextRows = rows.filter((row) => String(row.org_owner_id || '') !== String(orgOwnerId))
+
+  agents.forEach((agent) => {
+    const current = rows.find((row) => String(row.org_owner_id || '') === String(orgOwnerId) && String(row.agent_id || '') === String(agent.id))
+    nextRows.push({
+      id: current?.id || crypto.randomUUID(),
+      org_owner_id: orgOwnerId,
+      agent_id: String(agent.id),
+      active_leads: computeAgentLoad(leads, agent.id),
+      capped_max_leads: computeAgentCap(policy, String(agent.id)),
+      last_assigned_at: current?.last_assigned_at || null,
+      updated_at: now,
+    })
+  })
+
+  await writeJson(WORKLOAD_FILE, nextRows)
+}
+
+async function chooseAssignee({ policy, orgOwnerId, lead, leads, users }) {
+  const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === String(orgOwnerId))
+  if (!agents.length) return null
+
+  const eligible = agents
+    .map((agent) => ({
+      agent,
+      active_leads: computeAgentLoad(leads, agent.id),
+      cap: computeAgentCap(policy, String(agent.id)),
+    }))
+    .filter((row) => row.active_leads < row.cap)
+
+  if (!eligible.length) return null
+
+  const strategy = String(policy?.assignment_strategy || DEFAULT_POLICY.assignment_strategy)
+
+  if (strategy === 'round_robin') {
+    const start = Math.max(0, Number(policy?.round_robin_index || 0)) % eligible.length
+    const pick = eligible[start]
+    return pick?.agent?.id ? { agentId: String(pick.agent.id), nextRoundRobinIndex: start + 1 } : null
+  }
+
+  if (strategy === 'skill_based') {
+    const requiredSkill = sanitizeString(String(lead?.required_skill || lead?.source_type || ''), 120).toLowerCase()
+    const skillMatched = requiredSkill
+      ? eligible.filter((row) => Array.isArray(row.agent?.skills) && row.agent.skills.map((skill) => String(skill).toLowerCase()).includes(requiredSkill))
+      : []
+    const pool = skillMatched.length ? skillMatched : eligible
+    const sorted = pool.slice().sort((a, b) => a.active_leads - b.active_leads)
+    const top = sorted[0]
+    return top?.agent?.id ? { agentId: String(top.agent.id) } : null
+  }
+
+  const sorted = eligible.slice().sort((a, b) => a.active_leads - b.active_leads)
+  const top = sorted[0]
+  return top?.agent?.id ? { agentId: String(top.agent.id) } : null
+}
+
+async function upsertSlaTimer(lead, policy) {
+  const leadStatus = sanitizeString(String(lead?.status || 'new'), 60).toLowerCase().replace(/\s+/g, '_')
+  const targetMinutes = Math.max(1, Number(policy?.sla_targets_by_stage?.[leadStatus] || DEFAULT_STAGE_TARGETS[leadStatus] || 60))
+  const baseDate = new Date(lead?.updated_at || lead?.created_at || Date.now())
+  const deadlineAt = new Date(baseDate.getTime() + targetMinutes * 60000)
+  const rows = await readStore(SLA_FILE)
+  const existingIdx = rows.findIndex((row) => String(row.lead_id || '') === String(lead.id) && String(row.stage || '') === leadStatus)
+  const now = new Date().toISOString()
+  const next = {
+    ...(existingIdx >= 0 ? rows[existingIdx] : { id: crypto.randomUUID(), lead_id: lead.id, created_at: now }),
+    org_owner_id: lead.org_owner_id,
+    stage: leadStatus,
+    target_minutes: targetMinutes,
+    deadline_at: deadlineAt.toISOString(),
+    updated_at: now,
+  }
+  const nextRows = existingIdx >= 0 ? rows.map((row, idx) => (idx === existingIdx ? next : row)) : [...rows, next]
+  await writeJson(SLA_FILE, nextRows)
+  return next
+}
+
+export async function applyLeadOpsOnCreateOrUpdate({ actor, lead, trigger = 'update' }) {
+  if (!lead?.id || !lead?.org_owner_id) return lead
+
+  const orgOwnerId = String(lead.org_owner_id)
+  const [policy, leads, users] = await Promise.all([
+    ensurePolicy(orgOwnerId),
+    readStore(LEADS_FILE),
+    readStore(USERS_FILE),
+  ])
+
+  const changed = { ...lead }
+
+  if (!changed.assigned_agent_id) {
+    const picked = await chooseAssignee({ policy, orgOwnerId, lead: changed, leads, users })
+    if (picked?.agentId) {
+      changed.assigned_agent_id = picked.agentId
+      await trackEvent({
+        type: 'lead_assignment',
+        actor_id: String(actor?.id || orgOwnerId),
+        entity_id: String(changed.id),
+        entityType: 'lead',
+        metadata: { org_owner_id: orgOwnerId, strategy: policy.assignment_strategy, assigned_to: picked.agentId, trigger },
+        allowUnknownTypes: true,
+      })
+      const assignments = await readStore(ASSIGNMENTS_FILE)
+      assignments.push({
+        id: crypto.randomUUID(),
+        lead_id: changed.id,
+        org_owner_id: orgOwnerId,
+        assigned_by: String(actor?.id || orgOwnerId),
+        assigned_to: picked.agentId,
+        previous_assignee: '',
+        reason: 'policy_auto_assignment',
+        assigned_at: new Date().toISOString(),
+        created_at: new Date().toISOString(),
+      })
+      await writeJson(ASSIGNMENTS_FILE, assignments)
+
+      if (picked.nextRoundRobinIndex !== undefined) {
+        const policies = await readStore(POLICY_FILE)
+        await writeJson(POLICY_FILE, policies.map((row) => (
+          String(row.id || '') === String(policy.id)
+            ? { ...row, round_robin_index: picked.nextRoundRobinIndex, updated_at: new Date().toISOString() }
+            : row
+        )))
+      }
+    }
+  }
+
+  const timer = await upsertSlaTimer(changed, policy)
+  changed.sla = {
+    stage: timer.stage,
+    deadline_at: timer.deadline_at,
+    target_minutes: timer.target_minutes,
+  }
+
+  await persistWorkloads({
+    orgOwnerId,
+    agents: users.filter((u) => String(u.role || '').toLowerCase() === 'agent' && String(u.org_owner_id || '') === orgOwnerId),
+    leads: leads.map((existing) => (String(existing.id || '') === String(changed.id) ? changed : existing)),
+    policy,
+  })
+
+  return changed
+}
+
+function timeEscalationSeverity(policy, timer) {
+  const breachMinutes = Number(policy?.escalation_rules?.time_based?.breach_minutes || 60)
+  const warningMinutes = Number(policy?.escalation_rules?.time_based?.warning_minutes || 30)
+  const now = Date.now()
+  const deadline = new Date(timer?.deadline_at || Date.now()).getTime()
+  const overdueMinutes = Math.max(0, Math.floor((now - deadline) / 60000))
+  if (overdueMinutes >= breachMinutes) return { breached: true, severity: 'critical', overdueMinutes }
+  if (overdueMinutes >= warningMinutes) return { breached: true, severity: 'warning', overdueMinutes }
+  return { breached: false, severity: 'healthy', overdueMinutes }
+}
+
+export async function evaluateAndEscalateLeadIfBreached({ actor, lead }) {
+  if (!lead?.id || !lead?.org_owner_id) return { escalated: false }
+
+  const orgOwnerId = String(lead.org_owner_id)
+  const [policy, timers, escalations] = await Promise.all([
+    ensurePolicy(orgOwnerId),
+    readStore(SLA_FILE),
+    readStore(ESCALATIONS_FILE),
+  ])
+  const leadTimers = timers.filter((row) => String(row.lead_id || '') === String(lead.id))
+  if (!leadTimers.length) return { escalated: false }
+
+  const activeEscalation = escalations.find((row) => String(row.lead_id || '') === String(lead.id) && !row.resolved_at)
+  if (activeEscalation) return { escalated: false, activeEscalation }
+
+  const breachedTimer = leadTimers
+    .map((timer) => ({ timer, eval: timeEscalationSeverity(policy, timer) }))
+    .find((item) => item.eval.breached)
+
+  const riskScore = Number(lead?.risk_score || 0)
+  const riskThreshold = Number(policy?.escalation_rules?.risk_based?.auto_escalate_threshold || 95)
+  const riskBreached = riskScore >= riskThreshold
+
+  if (!breachedTimer && !riskBreached) return { escalated: false }
+
+  const reason = breachedTimer
+    ? `time_breach_stage_${breachedTimer.timer.stage}`
+    : `risk_breach_score_${riskScore}`
+
+  const now = new Date().toISOString()
+  const escalation = {
+    id: crypto.randomUUID(),
+    lead_id: String(lead.id),
+    org_owner_id: orgOwnerId,
+    sla_timer_id: breachedTimer?.timer?.id || null,
+    severity: breachedTimer?.eval?.severity || 'critical',
+    reason,
+    triggered_by: String(actor?.id || 'system'),
+    triggered_at: now,
+    created_at: now,
+    updated_at: now,
+  }
+
+  await writeJson(ESCALATIONS_FILE, [...escalations, escalation])
+
+  if (breachedTimer?.timer?.id) {
+    await writeJson(SLA_FILE, timers.map((row) => (
+      String(row.id || '') === String(breachedTimer.timer.id)
+        ? { ...row, breached_at: row.breached_at || now, updated_at: now }
+        : row
+    )))
+  }
+
+  await trackEvent({
+    type: 'sla_breach',
+    actor_id: String(actor?.id || orgOwnerId),
+    entity_id: String(lead.id),
+    entityType: 'lead',
+    metadata: { org_owner_id: orgOwnerId, reason, severity: escalation.severity },
+    allowUnknownTypes: true,
+  })
+
+  await trackEvent({
+    type: 'lead_escalation',
+    actor_id: String(actor?.id || orgOwnerId),
+    entity_id: String(lead.id),
+    entityType: 'lead',
+    metadata: { org_owner_id: orgOwnerId, escalation_id: escalation.id, reason },
+    allowUnknownTypes: true,
+  })
+
+  return { escalated: true, escalation }
+}
+
+export async function listEscalations(actor) {
+  const orgOwnerId = actorOrgOwnerId(actor)
+  if (!orgOwnerId) throw forbiddenError()
+
+  const rows = await readStore(ESCALATIONS_FILE)
+  return rows
+    .filter((row) => String(row.org_owner_id || '') === String(orgOwnerId))
+    .sort((a, b) => String(b.triggered_at || b.created_at || '').localeCompare(String(a.triggered_at || a.created_at || '')))
+}
+
+export async function resolveEscalation(actor, leadId, resolutionNote = '') {
+  const orgOwnerId = actorOrgOwnerId(actor)
+  if (!orgOwnerId) throw forbiddenError()
+
+  const rows = await readStore(ESCALATIONS_FILE)
+  const idx = rows.findIndex((row) => String(row.org_owner_id || '') === String(orgOwnerId) && String(row.lead_id || '') === String(leadId) && !row.resolved_at)
+  if (idx < 0) return null
+
+  const now = new Date().toISOString()
+  const updated = {
+    ...rows[idx],
+    resolved_at: now,
+    resolved_by: String(actor?.id || ''),
+    resolution_note: sanitizeString(String(resolutionNote || 'resolved'), 300),
+    updated_at: now,
+  }
+  const nextRows = rows.map((row, rowIdx) => (rowIdx === idx ? updated : row))
+  await writeJson(ESCALATIONS_FILE, nextRows)
+
+  await trackEvent({
+    type: 'lead_escalation_resolved',
+    actor_id: String(actor?.id || orgOwnerId),
+    entity_id: String(leadId),
+    entityType: 'lead',
+    metadata: { org_owner_id: orgOwnerId, escalation_id: updated.id, resolution_note: updated.resolution_note },
+    allowUnknownTypes: true,
+  })
+
+  return updated
+}
+
+export async function getWorkload(actor) {
+  const orgOwnerId = actorOrgOwnerId(actor)
+  if (!orgOwnerId) throw forbiddenError()
+
+  const [leads, users, policy] = await Promise.all([
+    readStore(LEADS_FILE),
+    readStore(USERS_FILE),
+    ensurePolicy(orgOwnerId),
+  ])
+  const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === String(orgOwnerId))
+
+  await persistWorkloads({ orgOwnerId, agents, leads: leads.filter((lead) => String(lead.org_owner_id || '') === String(orgOwnerId)), policy })
+  const refreshedRows = await readStore(WORKLOAD_FILE)
+
+  return refreshedRows
+    .filter((row) => String(row.org_owner_id || '') === String(orgOwnerId))
+    .map((row) => ({
+      ...row,
+      agent_name: users.find((user) => String(user.id || '') === String(row.agent_id))?.name || row.agent_id,
+      utilization_pct: row.capped_max_leads > 0 ? Math.min(100, Math.round((Number(row.active_leads || 0) / Number(row.capped_max_leads || 1)) * 100)) : 0,
+    }))
+    .sort((a, b) => Number(b.utilization_pct || 0) - Number(a.utilization_pct || 0))
+}
diff --git a/server/services/leadService.js b/server/services/leadService.js
index 16273d2..89e1412 100644
--- a/server/services/leadService.js
+++ b/server/services/leadService.js
@@ -6,6 +6,7 @@ import { sanitizeString } from '../utils/validators.js'
 import { forbiddenError, isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
 import { getPlanForUser } from './entitlementService.js'
 import { trackEvent } from './eventTrackingService.js'
+import { applyLeadOpsOnCreateOrUpdate, evaluateAndEscalateLeadIfBreached } from './enterpriseOpsService.js'
 
 const LEADS_FILE = 'leads.json'
 const NOTES_FILE = 'lead_notes.json'
@@ -234,7 +235,7 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp, so
 
     if (existingIndex >= 0) {
       const current = leads[existingIndex]
-      leads[existingIndex] = {
+      const nextLead = {
         ...current,
         counterparty_id: current.counterparty_id || counterpartyId,
         assigned_agent_id: extras.assigned_agent_id || current.assigned_agent_id || autoAssignedAgent || '',
@@ -244,6 +245,11 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp, so
         last_interaction_at: interactionAt,
         updated_at: now,
       }
+      leads[existingIndex] = await applyLeadOpsOnCreateOrUpdate({
+        actor: sender || { id: orgId, org_owner_id: orgId, role: 'owner' },
+        lead: nextLead,
+        trigger: 'update',
+      })
       updated.push(leads[existingIndex])
       if (!current.source_type && leadSourceType) {
         await trackEvent({
@@ -256,7 +262,7 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp, so
       continue
     }
 
-    const row = {
+    const baseRow = {
       id: crypto.randomUUID(),
       org_owner_id: orgId,
       match_id: matchId,
@@ -272,6 +278,11 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp, so
       last_interaction_at: interactionAt,
       conversion_at: '',
     }
+    const row = await applyLeadOpsOnCreateOrUpdate({
+      actor: sender || { id: orgId, org_owner_id: orgId, role: 'owner' },
+      lead: baseRow,
+      trigger: 'create',
+    })
     leads.push(row)
     updated.push(row)
     await trackEvent({ type: 'lead_created', actor_id: senderId || orgId, entity_id: row.id, metadata: { source_type: leadSourceType, source_id: leadSourceId } })
@@ -286,6 +297,10 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp, so
   }
 
   await writeJson(LEADS_FILE, leads)
+  await Promise.all(updated.map((lead) => evaluateAndEscalateLeadIfBreached({
+    actor: sender || { id: lead.org_owner_id, org_owner_id: lead.org_owner_id, role: 'owner' },
+    lead,
+  })))
   return updated
 }
 
@@ -436,7 +451,7 @@ export async function updateLead(actor, leadId, patch = {}) {
       if (!assignedAgent) throw forbiddenError()
     }
 
-    const updated = await prisma.lead.update({
+    let updated = await prisma.lead.update({
       where: { id },
       data: {
         status: patch.status !== undefined ? normalizeStatus(patch.status, current.status || 'new') : current.status,
@@ -444,6 +459,15 @@ export async function updateLead(actor, leadId, patch = {}) {
         updated_at: new Date(),
       },
     })
+    const opsLead = await applyLeadOpsOnCreateOrUpdate({ actor, lead: updated, trigger: 'update' })
+    if (String(updated.assigned_agent_id || '') !== String(opsLead.assigned_agent_id || '')) {
+      updated = await prisma.lead.update({
+        where: { id },
+        data: { assigned_agent_id: opsLead.assigned_agent_id || null, updated_at: new Date() },
+      })
+    } else {
+      updated = opsLead
+    }
     if (!isAgent(actor) && patch.assigned_agent_id !== undefined && String(current.assigned_agent_id || '') !== String(updated.assigned_agent_id || '')) {
       const now = new Date()
       await prisma.leadAssignment.create({
@@ -468,6 +492,7 @@ export async function updateLead(actor, leadId, patch = {}) {
         allowUnknownTypes: true,
       })
     }
+    await evaluateAndEscalateLeadIfBreached({ actor, lead: updated })
     return updated
   }
 
@@ -478,13 +503,14 @@ export async function updateLead(actor, leadId, patch = {}) {
   const current = leads[idx]
   ensureLeadWriteAccess(actor, current)
 
-  const next = {
+  let next = {
     ...current,
     status: patch.status !== undefined ? normalizeStatus(patch.status, current.status) : current.status,
     // Main accounts can assign leads to an agent; agents cannot reassign.
     ...(isAgent(actor) ? {} : { assigned_agent_id: patch.assigned_agent_id !== undefined ? sanitizeString(String(patch.assigned_agent_id || ''), 120) : current.assigned_agent_id }),
     updated_at: new Date().toISOString(),
   }
+  next = await applyLeadOpsOnCreateOrUpdate({ actor, lead: next, trigger: 'update' })
 
   leads[idx] = next
   await writeJson(LEADS_FILE, leads)
@@ -511,6 +537,7 @@ export async function updateLead(actor, leadId, patch = {}) {
       allowUnknownTypes: true,
     })
   }
+  await evaluateAndEscalateLeadIfBreached({ actor, lead: next })
   return next
 }
 
diff --git a/server/utils/jsonStore.js b/server/utils/jsonStore.js
index 338d9c3..1a338b6 100644
--- a/server/utils/jsonStore.js
+++ b/server/utils/jsonStore.js
@@ -130,7 +130,11 @@ const FILE_HANDLERS = {
   'interaction_logs.json': tableHandler('interactionLog', ['id']),
   'event_logs.json': tableHandler('eventLog', ['id']),
   'org_policies.json': tableHandler('orgPolicy', ['id']),
+  'org_ops_policies.json': tableHandler('orgOpsPolicy', ['id']),
   'lead_assignments.json': tableHandler('leadAssignment', ['id']),
+  'lead_sla_timers.json': tableHandler('leadSlaTimer', ['id']),
+  'lead_escalations.json': tableHandler('leadEscalation', ['id']),
+  'agent_workloads.json': tableHandler('agentWorkload', ['id']),
   'agent_capacity.json': tableHandler('agentCapacity', ['id']),
   'analytics.json': tableHandler('analyticsEvent', ['id']),
   'boosts.json': tableHandler('boost', ['id']),
diff --git a/src/components/leads/LeadManager.jsx b/src/components/leads/LeadManager.jsx
index d9792ba..14cfee1 100644
--- a/src/components/leads/LeadManager.jsx
+++ b/src/components/leads/LeadManager.jsx
@@ -24,6 +24,15 @@ function statusBadgeClass(status = '') {
   return 'bg-emerald-100 text-emerald-700'
 }
 
+function formatCountdown(deadlineAt) {
+  if (!deadlineAt) return 'No SLA'
+  const deadline = new Date(deadlineAt).getTime()
+  if (Number.isNaN(deadline)) return 'No SLA'
+  const deltaMinutes = Math.floor((deadline - Date.now()) / 60000)
+  if (deltaMinutes >= 0) return `${deltaMinutes}m left`
+  return `${Math.abs(deltaMinutes)}m overdue`
+}
+
 export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true, showOperations = true }) {
   const token = useMemo(() => getToken(), [])
   const canAssignLeads = Boolean(getCurrentUser()?.capabilities?.leads?.assign)
@@ -36,7 +45,7 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
   const [lookup, setLookup] = useState({})
   const [noteDraft, setNoteDraft] = useState('')
   const [saving, setSaving] = useState(false)
-  const [queueMeta, setQueueMeta] = useState({ queue: [], team_queues: [], assignments: [], agent_capacity: [] })
+  const [queueMeta, setQueueMeta] = useState({ queue: [], team_queues: [], assignments: [], agent_capacity: [], escalations: [], workload: [] })
 
   const loadLeads = useCallback(async () => {
     if (!token) return
@@ -48,16 +57,22 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
       let operationsQueue = []
       if (showOperations) {
         try {
-          const queueData = await apiRequest('/org/operations/queue', { token })
+          const [queueData, escalationsData, workloadData] = await Promise.all([
+            apiRequest('/org/ops/queue', { token }),
+            apiRequest('/org/ops/escalations', { token }).catch(() => ({ items: [] })),
+            apiRequest('/org/ops/workload', { token }).catch(() => ({ items: [] })),
+          ])
           operationsQueue = Array.isArray(queueData?.queue) ? queueData.queue : []
           setQueueMeta({
             queue: operationsQueue,
             team_queues: queueData?.team_queues || [],
             assignments: queueData?.assignments || [],
             agent_capacity: queueData?.agent_capacity || [],
+            escalations: escalationsData?.items || [],
+            workload: workloadData?.items || [],
           })
         } catch {
-          setQueueMeta({ queue: [], team_queues: [], assignments: [], agent_capacity: [] })
+          setQueueMeta({ queue: [], team_queues: [], assignments: [], agent_capacity: [], escalations: [], workload: [] })
         }
       }
 
@@ -177,7 +192,7 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
     setSaving(true)
     setError('')
     try {
-      await apiRequest('/org/operations/rebalance', { method: 'POST', token, body: { strategy: 'least_loaded' } })
+      await apiRequest('/org/ops/rebalance', { method: 'POST', token, body: { strategy: 'least_loaded' } })
       await loadLeads()
       if (selectedId) await loadLeadDetail(selectedId)
     } catch (err) {
@@ -193,7 +208,7 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
     setSaving(true)
     setError('')
     try {
-      const updated = await apiRequest(`/org/operations/escalate/${encodeURIComponent(leadId)}`, {
+      const updated = await apiRequest(`/org/ops/escalate/${encodeURIComponent(leadId)}`, {
         method: 'POST',
         token,
         body: { reason },
@@ -208,6 +223,34 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
     }
   }
 
+  async function resolveEscalation(leadId) {
+    if (!token || !leadId) return
+    setSaving(true)
+    setError('')
+    try {
+      await apiRequest(`/org/ops/escalations/${encodeURIComponent(leadId)}/resolve`, {
+        method: 'POST',
+        token,
+        body: { resolution_note: 'Resolved from CRM dashboard' },
+      })
+      await loadLeads()
+    } catch (err) {
+      setError(err.message || 'Failed to resolve escalation')
+    } finally {
+      setSaving(false)
+    }
+  }
+
+  const selectedAssignments = useMemo(() => (
+    (queueMeta.assignments || [])
+      .filter((row) => String(row.lead_id || '') === String(selectedId || ''))
+      .slice(0, 8)
+  ), [queueMeta.assignments, selectedId])
+
+  const selectedEscalation = useMemo(() => (
+    (queueMeta.escalations || []).find((row) => String(row.lead_id || '') === String(selectedId || '') && !row.resolved_at)
+  ), [queueMeta.escalations, selectedId])
+
   const selectedCounterparty = selected?.counterparty_id ? lookup[selected.counterparty_id] : null
   const assignedAgent = selected?.assigned_agent_id ? lookup[selected.assigned_agent_id] : null
 
@@ -274,9 +317,9 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
                     <span className="text-[11px] uppercase tracking-widest text-slate-500">{(lead.status || 'new').replace(/_/g, ' ')}</span>
                   </div>
                   <div className="mt-1 flex items-center gap-2">
-                    {lead?.sla?.status ? (
-                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(lead.sla.status)}`}>
-                        SLA {lead.sla.status}
+                    {lead?.sla?.status || lead?.sla?.deadline_at ? (
+                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(lead?.sla?.status || 'healthy')}`}>
+                        SLA {lead?.sla?.status || 'active'} · {formatCountdown(lead?.sla?.deadline_at)}
                       </span>
                     ) : null}
                     {lead?.queue_owner_id ? (
@@ -359,11 +402,15 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
                   {!allowAssign || !canAssignLeads ? null : (
                     <button
                       type="button"
-                      onClick={() => updateLead({ assigned_agent_id: window.prompt('Assign to agent id (user id)', selected?.assigned_agent_id || '') || '' })}
+                      onClick={() => {
+                        const assignedAgentId = window.prompt('Assign/reassign to agent id (user id)', selected?.assigned_agent_id || '') || ''
+                        const assignmentReason = window.prompt('Assignment reason (audit trail)', 'manual_reassignment') || 'manual_reassignment'
+                        updateLead({ assigned_agent_id: assignedAgentId, assignment_reason: assignmentReason })
+                      }}
                       className="mt-2 text-sm text-[var(--gt-blue)] hover:underline"
                       disabled={saving}
                     >
-                      Assign
+                      Assign / Reassign
                     </button>
                   )}
                   {allowAssign && !canAssignLeads ? (
@@ -373,11 +420,21 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
                 <div className="rounded-lg bg-slate-50 p-3">
                   <p className="text-xs uppercase tracking-widest text-slate-500">Updated</p>
                   <p className="mt-1 text-sm font-medium">{formatDate(selected?.updated_at || '') || '--'}</p>
-                  {selected?.sla?.status ? (
-                    <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(selected.sla.status)}`}>
-                      SLA {selected.sla.status}
+                  {selected?.sla?.status || selected?.sla?.deadline_at ? (
+                    <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(selected?.sla?.status || 'healthy')}`}>
+                      SLA {selected?.sla?.status || 'active'} · {formatCountdown(selected?.sla?.deadline_at)}
                     </p>
                   ) : null}
+                  {selectedEscalation ? (
+                    <button
+                      type="button"
+                      onClick={() => resolveEscalation(selectedId)}
+                      className="mt-2 text-xs rounded bg-emerald-600 px-2 py-1 text-white"
+                      disabled={saving}
+                    >
+                      Resolve escalation
+                    </button>
+                  ) : null}
                   {selected?.queue_owner_id ? (
                     <p className="mt-1 text-xs text-slate-600">Queue owner: {lookup[selected.queue_owner_id]?.name || selected.queue_owner_id}</p>
                   ) : null}
@@ -404,6 +461,15 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
                         </div>
                       ))}
                     </div>
+                    <p className="mt-3 text-xs uppercase tracking-widest text-slate-500">Escalation queue</p>
+                    <div className="mt-2 space-y-1">
+                      {(queueMeta.escalations || []).slice(0, 5).map((item) => (
+                        <div key={item.id} className="rounded-md borderless-shadow px-2 py-1 text-xs flex items-center justify-between gap-2">
+                          <span className="truncate">Lead {item.lead_id} · {item.reason}</span>
+                          <span className="text-slate-500">{formatDate(item.triggered_at)}</span>
+                        </div>
+                      ))}
+                    </div>
                   </div>
                 ) : null}
                 <p className="text-xs uppercase tracking-widest text-slate-500">Internal notes</p>
@@ -437,6 +503,19 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true,
               </div>
 
               <div className="mt-5">
+                {selectedAssignments.length ? (
+                  <div className="mb-4">
+                    <p className="text-xs uppercase tracking-widest text-slate-500">Assignment audit trail</p>
+                    <div className="mt-2 space-y-1">
+                      {selectedAssignments.map((item) => (
+                        <div key={item.id} className="rounded-lg borderless-shadow px-3 py-2 text-xs">
+                          <span className="font-medium">{item.reason || 'assignment'}</span>
+                          <span className="text-slate-500"> · {formatDate(item.assigned_at || item.created_at)}</span>
+                        </div>
+                      ))}
+                    </div>
+                  </div>
+                ) : null}
                 <p className="text-xs uppercase tracking-widest text-slate-500">Reminders</p>
                 <div className="mt-2 space-y-2">
                   {(selected?.reminders || []).length === 0 ? <div className="text-sm text-slate-500">No reminders yet.</div> : null}
diff --git a/src/pages/AgentDashboard.jsx b/src/pages/AgentDashboard.jsx
index 3ce2bfe..cd8d5a1 100644
--- a/src/pages/AgentDashboard.jsx
+++ b/src/pages/AgentDashboard.jsx
@@ -103,10 +103,18 @@ export default function AgentDashboard() {
     const token = getToken()
     if (!token) return
     try {
-      const queueData = await apiRequest('/org/operations/queue', { token })
-      setQueueSummary({ queue: queueData?.queue || [] })
+      const [queueData, escalationData, workloadData] = await Promise.all([
+        apiRequest('/org/ops/queue', { token }),
+        apiRequest('/org/ops/escalations', { token }).catch(() => ({ items: [] })),
+        apiRequest('/org/ops/workload', { token }).catch(() => ({ items: [] })),
+      ])
+      setQueueSummary({
+        queue: queueData?.queue || [],
+        escalations: escalationData?.items || [],
+        workload: workloadData?.items || [],
+      })
     } catch {
-      setQueueSummary({ queue: [] })
+      setQueueSummary({ queue: [], escalations: [], workload: [] })
     }
   }
 
@@ -171,6 +179,8 @@ export default function AgentDashboard() {
                     <p>Queue ownership: <strong>{queueSummary.queue.length}</strong> leads</p>
                     <button type="button" className="text-xs px-2 py-1 rounded bg-white borderless-shadow" onClick={refreshQueueSummary}>Refresh queue</button>
                   </div>
+                  <div className="mt-2 text-xs text-slate-600">Escalations pending: {queueSummary?.escalations?.filter((item) => !item.resolved_at).length || 0}</div>
+                  <div className="mt-1 text-xs text-slate-600">My workload rows: {queueSummary?.workload?.length || 0}</div>
                 </div>
                 <LeadManager title="My Leads (CRM)" allowAssign={false} showOperations />
               </div>
diff --git a/src/pages/OwnerDashboard.jsx b/src/pages/OwnerDashboard.jsx
index 821ba47..8257b60 100644
--- a/src/pages/OwnerDashboard.jsx
+++ b/src/pages/OwnerDashboard.jsx
@@ -28,14 +28,24 @@ export default function OwnerDashboard() {
   const [active, setActive] = useState('home')
   const { dashboard, subscription, isEnterprise, loading, error } = useAnalyticsDashboard()
   const [policy, setPolicy] = useState(null)
+  const [opsEscalations, setOpsEscalations] = useState([])
+  const [opsWorkload, setOpsWorkload] = useState([])
 
   const totals = dashboard?.totals || {}
 
   useEffect(() => {
     const token = getToken()
     if (!token) return
-    apiRequest('/org/operations/policies', { token })
-      .then(setPolicy)
+    Promise.all([
+      apiRequest('/org/ops/policies', { token }).catch(() => null),
+      apiRequest('/org/ops/escalations', { token }).catch(() => ({ items: [] })),
+      apiRequest('/org/ops/workload', { token }).catch(() => ({ items: [] })),
+    ])
+      .then(([policyRes, escalationsRes, workloadRes]) => {
+        setPolicy(policyRes)
+        setOpsEscalations(escalationsRes?.items || [])
+        setOpsWorkload(workloadRes?.items || [])
+      })
       .catch(() => null)
   }, [])
 
@@ -87,10 +97,30 @@ export default function OwnerDashboard() {
                 <div className="bg-white rounded-xl shadow-md p-4 text-sm text-slate-700">
                   <h3 className="font-semibold mb-2">Org Operations Policy</h3>
                   <p>Assignment strategy: <strong>{policy.assignment_strategy}</strong></p>
-                  <p>SLA response target: <strong>{policy?.sla_targets?.response_minutes} min</strong></p>
-                  <p>Escalation breach window: <strong>{policy?.escalation_windows?.breach_minutes} min</strong></p>
+                  <p>SLA target for new leads: <strong>{policy?.sla_targets_by_stage?.new} min</strong></p>
+                  <p>Escalation breach window: <strong>{policy?.escalation_rules?.time_based?.breach_minutes} min</strong></p>
                 </div>
               ) : null}
+              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
+                <div className="bg-white rounded-xl shadow-md p-4 text-sm">
+                  <h4 className="font-semibold mb-2">Escalation Queue</h4>
+                  {(opsEscalations || []).slice(0, 6).map((item) => (
+                    <div key={item.id} className="py-1 border-b border-slate-100">
+                      Lead <strong>{item.lead_id}</strong> · {item.reason}
+                    </div>
+                  ))}
+                  {!opsEscalations.length ? <div className="text-slate-500">No active escalations.</div> : null}
+                </div>
+                <div className="bg-white rounded-xl shadow-md p-4 text-sm">
+                  <h4 className="font-semibold mb-2">Agent Workload</h4>
+                  {(opsWorkload || []).slice(0, 6).map((item) => (
+                    <div key={item.id} className="py-1 border-b border-slate-100">
+                      {item.agent_name}: {item.active_leads}/{item.capped_max_leads} ({item.utilization_pct}%)
+                    </div>
+                  ))}
+                  {!opsWorkload.length ? <div className="text-slate-500">No workload records.</div> : null}
+                </div>
+              </div>
               <LeadManager title="Leads (CRM)" allowAssign showOperations />
             </div>
           )}
```

## Why This Change
Merge pull request #88 from gamertoky1188gro/codex/implement-enterprise-operations-service-and-ui

## Was It Useful
Yes — part of iterative feature development.

## Impact Analysis
- **Scope:**  11 files changed, 820 insertions(+), 25 deletions(-)
- **Risk:** Moderate

## Relationships
Commit 220 in the 0181-0220 sequence.

## Confidence Notes
Auto-generated from git history.
