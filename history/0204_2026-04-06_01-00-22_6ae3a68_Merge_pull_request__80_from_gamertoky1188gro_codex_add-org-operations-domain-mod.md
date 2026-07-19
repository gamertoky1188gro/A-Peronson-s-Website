## Commit Metadata

- **Hash:** 6ae3a68394f926f4bb60179906fdd75576ffcc3f
- **Parent:** 2524ef4c270b1c521a6a31a6549ae7898559cb36 29493e37f0d685c6eba0fa2e1fa45955d7a0e094
- **Author:** Cyber Code Master
- **Date:** 2026-04-06 01:00:22
- **Message:** Merge pull request #80 from gamertoky1188gro/codex/add-org-operations-domain-module-and-apis

## Custom Title

Merge pull request #80 from gamertoky1188gro/codex/add-org-operations-domain-module-and-apis

## High-Level Summary

Merge pull request #80 from gamertoky1188gro/codex/add-org-operations-domain-module-and-apis

15 files changed, 892 insertions(+), 19 deletions(-)

## File-by-File Breakdown

package.json | 3 +-
.../migration.sql | 46 +++
prisma/schema.prisma | 38 ++
scripts/db/backfill-org-operations-policies.mjs | 61 +++
server/controllers/orgOperationsController.js | 56 +++
server/routes/orgOperationsRoutes.js | 21 +
server/routes/orgRoutes.js | 2 +
server/services/leadService.js | 51 ++-
server/services/orgOperationsService.js | 425 +++++++++++++++++++++
server/utils/jsonStore.js | 3 +
server/utils/permissions.js | 15 +
shared/event-taxonomy.json | 4 +
src/components/leads/LeadManager.jsx | 136 ++++++-
src/pages/AgentDashboard.jsx | 23 +-
src/pages/OwnerDashboard.jsx | 27 +-
15 files changed, 892 insertions(+), 19 deletions(-)

## Detailed Diff Analysis

```diff
diff --git a/package.json b/package.json
index 3f4caec..5db8d11 100644
--- a/package.json
+++ b/package.json
@@ -15,7 +15,8 @@
     "db:generate": "prisma generate",
     "db:migrate:dev": "prisma migrate dev",
     "db:studio": "prisma studio",
-    "db:migrate:pg": "prisma migrate dev"
+    "db:migrate:pg": "prisma migrate dev",
+    "db:backfill:org-operations": "node scripts/db/backfill-org-operations-policies.mjs"
   },
   "dependencies": {
     "@fortawesome/fontawesome-free": "^7.2.0",
diff --git a/prisma/migrations/20260405170000_add_org_operations_models/migration.sql b/prisma/migrations/20260405170000_add_org_operations_models/migration.sql
new file mode 100644
index 0000000..19ecfd2
--- /dev/null
+++ b/prisma/migrations/20260405170000_add_org_operations_models/migration.sql
@@ -0,0 +1,46 @@
+-- AlterTable
+ALTER TABLE "org_policies"
+ADD COLUMN "assignment_strategy" TEXT,
+ADD COLUMN "sla_targets" JSONB,
+ADD COLUMN "escalation_windows" JSONB;
+
+-- CreateTable
+CREATE TABLE "lead_assignments" (
+  "id" TEXT NOT NULL,
+  "lead_id" TEXT NOT NULL,
+  "org_owner_id" TEXT NOT NULL,
+  "assigned_by" TEXT,
+  "assigned_to" TEXT,
+  "previous_assignee" TEXT,
+  "reason" TEXT,
+  "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  CONSTRAINT "lead_assignments_pkey" PRIMARY KEY ("id")
+);
+
+-- CreateTable
+CREATE TABLE "agent_capacity" (
+  "id" TEXT NOT NULL,
+  "org_owner_id" TEXT NOT NULL,
+  "agent_id" TEXT NOT NULL,
+  "max_concurrent_leads" INTEGER NOT NULL,
+  "current_load" INTEGER NOT NULL DEFAULT 0,
+  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  CONSTRAINT "agent_capacity_pkey" PRIMARY KEY ("id")
+);
+
+-- Indexes
+CREATE INDEX "lead_assignments_org_owner_id_assigned_at_idx" ON "lead_assignments"("org_owner_id", "assigned_at");
+CREATE UNIQUE INDEX "agent_capacity_org_owner_id_agent_id" ON "agent_capacity"("org_owner_id", "agent_id");
+
+ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_lead_id_fkey"
+FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
+
+ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_assigned_by_fkey"
+FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+
+ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_assigned_to_fkey"
+FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+
+ALTER TABLE "agent_capacity" ADD CONSTRAINT "agent_capacity_agent_id_fkey"
+FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index aea6bdc..bd5c3a2 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -44,6 +44,9 @@ model User {
   leadRemindersCreated      LeadReminder[]   @relation("LeadReminderCreator")
   crmInteractionsOwned      InteractionLog[] @relation("InteractionOrgOwner")
   crmInteractionsActor      InteractionLog[] @relation("InteractionActor")
+  leadAssignmentsByActor    LeadAssignment[] @relation("LeadAssignmentActor")
+  leadAssignmentsTargeted   LeadAssignment[] @relation("LeadAssignmentTarget")
+  agentCapacityRecords      AgentCapacity[]  @relation("AgentCapacityAgent")

   @@map("users")
 }
@@ -413,12 +416,44 @@ model Lead {
   notes               LeadNote[]
   reminders           LeadReminder[]
   interactions        InteractionLog[]
+  assignments         LeadAssignment[]

   @@index([org_owner_id, status, updated_at])
   @@index([assigned_agent_id, updated_at])
   @@map("leads")
 }

+model LeadAssignment {
+  id                String   @id
+  lead_id           String
+  org_owner_id      String
+  assigned_by       String?
+  assigned_to       String?
+  previous_assignee String?
+  reason            String?
+  assigned_at       DateTime @default(now())
+  created_at        DateTime @default(now())
+  lead              Lead     @relation(fields: [lead_id], references: [id], onDelete: Cascade, onUpdate: Cascade)
+  actor             User?    @relation("LeadAssignmentActor", fields: [assigned_by], references: [id], onDelete: SetNull, onUpdate: Cascade)
+  targetAgent       User?    @relation("LeadAssignmentTarget", fields: [assigned_to], references: [id], onDelete: SetNull, onUpdate: Cascade)
+
+  @@index([org_owner_id, assigned_at])
+  @@map("lead_assignments")
+}
+
+model AgentCapacity {
+  id                   String   @id
+  org_owner_id         String
+  agent_id             String
+  max_concurrent_leads Int
+  current_load         Int      @default(0)
+  updated_at           DateTime @default(now())
+  agent                User     @relation("AgentCapacityAgent", fields: [agent_id], references: [id], onDelete: Cascade, onUpdate: Cascade)
+
+  @@unique([org_owner_id, agent_id], name: "agent_capacity_org_owner_id_agent_id")
+  @@map("agent_capacity")
+}
+
 model LeadNote {
   id           String   @id
   lead_id      String
@@ -788,6 +823,9 @@ model OrgPolicy {
   code        String
   description String?
   config      Json?
+  assignment_strategy String?
+  sla_targets         Json?
+  escalation_windows  Json?
   active      Boolean  @default(true)
   created_at  DateTime @default(now())
   updated_at  DateTime?
diff --git a/scripts/db/backfill-org-operations-policies.mjs b/scripts/db/backfill-org-operations-policies.mjs
new file mode 100644
index 0000000..e4f8bfc
--- /dev/null
+++ b/scripts/db/backfill-org-operations-policies.mjs
@@ -0,0 +1,61 @@
+import crypto from 'crypto'
+import { PrismaClient } from '@prisma/client'
+
+const prisma = new PrismaClient()
+
+const DEFAULT_POLICY = {
+  assignment_strategy: 'least_loaded',
+  sla_targets: {
+    response_minutes: 60,
+    contact_minutes: 240,
+    resolution_minutes: 2880,
+  },
+  escalation_windows: {
+    warning_minutes: 30,
+    breach_minutes: 60,
+  },
+}
+
+async function run() {
+  const orgOwners = await prisma.user.findMany({
+    where: {
+      role: { in: ['owner', 'admin', 'buying_house', 'factory'] },
+    },
+    select: { id: true },
+  })
+
+  let inserted = 0
+  for (const owner of orgOwners) {
+    const exists = await prisma.orgPolicy.findUnique({
+      where: { org_id_policy_code: { org_id: owner.id, code: 'operations' } },
+      select: { id: true },
+    })
+    if (exists) continue
+
+    await prisma.orgPolicy.create({
+      data: {
+        id: crypto.randomUUID(),
+        org_id: owner.id,
+        code: 'operations',
+        description: 'Org operations policy',
+        config: {},
+        active: true,
+        assignment_strategy: DEFAULT_POLICY.assignment_strategy,
+        sla_targets: DEFAULT_POLICY.sla_targets,
+        escalation_windows: DEFAULT_POLICY.escalation_windows,
+      },
+    })
+    inserted += 1
+  }
+
+  console.log(`Backfill complete. Created ${inserted} org_policies row(s).`)
+}
+
+run()
+  .catch((error) => {
+    console.error('Backfill failed:', error)
+    process.exitCode = 1
+  })
+  .finally(async () => {
+    await prisma.$disconnect()
+  })
diff --git a/server/controllers/orgOperationsController.js b/server/controllers/orgOperationsController.js
new file mode 100644
index 0000000..33e6834
--- /dev/null
+++ b/server/controllers/orgOperationsController.js
@@ -0,0 +1,56 @@
+import {
+  escalateOrgLead,
+  getOrgPolicies,
+  getOrgQueue,
+  listLeadAssignmentHistory,
+  rebalanceOrgQueue,
+  updateOrgPolicies,
+} from '../services/orgOperationsService.js'
+import { handleControllerError } from '../utils/permissions.js'
+
+export async function getOperationsPolicies(req, res) {
+  try {
+    const policy = await getOrgPolicies(req.user)
+    return res.json(policy)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function putOperationsPolicies(req, res) {
+  try {
+    const policy = await updateOrgPolicies(req.user, req.body || {})
+    return res.json(policy)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function getOperationsQueue(req, res) {
+  try {
+    const queue = await getOrgQueue(req.user)
+    const assignments = await listLeadAssignmentHistory(req.user)
+    return res.json({ ...queue, assignments })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function postOperationsRebalance(req, res) {
+  try {
+    const result = await rebalanceOrgQueue(req.user, req.body || {})
+    return res.json(result)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function postOperationsEscalate(req, res) {
+  try {
+    const lead = await escalateOrgLead(req.user, req.params.leadId, req.body || {})
+    if (!lead) return res.status(404).json({ error: 'Lead not found' })
+    return res.json(lead)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
diff --git a/server/routes/orgOperationsRoutes.js b/server/routes/orgOperationsRoutes.js
new file mode 100644
index 0000000..fe53892
--- /dev/null
+++ b/server/routes/orgOperationsRoutes.js
@@ -0,0 +1,21 @@
+import { Router } from 'express'
+import { allowRoles, requireAuth } from '../middleware/auth.js'
+import {
+  getOperationsPolicies,
+  getOperationsQueue,
+  postOperationsEscalate,
+  postOperationsRebalance,
+  putOperationsPolicies,
+} from '../controllers/orgOperationsController.js'
+
+const router = Router()
+
+router.use(requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'))
+
+router.get('/policies', getOperationsPolicies)
+router.put('/policies', putOperationsPolicies)
+router.get('/queue', getOperationsQueue)
+router.post('/rebalance', postOperationsRebalance)
+router.post('/escalate/:leadId', postOperationsEscalate)
+
+export default router
diff --git a/server/routes/orgRoutes.js b/server/routes/orgRoutes.js
index cd4e4d4..ad3a699 100644
--- a/server/routes/orgRoutes.js
+++ b/server/routes/orgRoutes.js
@@ -1,8 +1,10 @@
 import { Router } from 'express'
 import memberRoutes from './memberRoutes.js'
+import orgOperationsRoutes from './orgOperationsRoutes.js'

 const router = Router()

 router.use('/members', memberRoutes)
+router.use('/operations', orgOperationsRoutes)

 export default router
diff --git a/server/services/leadService.js b/server/services/leadService.js
index f572b5a..16273d2 100644
--- a/server/services/leadService.js
+++ b/server/services/leadService.js
@@ -10,6 +10,7 @@ import { trackEvent } from './eventTrackingService.js'
 const LEADS_FILE = 'leads.json'
 const NOTES_FILE = 'lead_notes.json'
 const REMINDERS_FILE = 'lead_reminders.json'
+const ASSIGNMENTS_FILE = 'lead_assignments.json'
 const USERS_FILE = 'users.json'
 const REQUIREMENTS_FILE = 'requirements.json'
 const USE_SQL_CRM = isCrmSqlEnabled()
@@ -435,7 +436,7 @@ export async function updateLead(actor, leadId, patch = {}) {
       if (!assignedAgent) throw forbiddenError()
     }

-    return prisma.lead.update({
+    const updated = await prisma.lead.update({
       where: { id },
       data: {
         status: patch.status !== undefined ? normalizeStatus(patch.status, current.status || 'new') : current.status,
@@ -443,6 +444,31 @@ export async function updateLead(actor, leadId, patch = {}) {
         updated_at: new Date(),
       },
     })
+    if (!isAgent(actor) && patch.assigned_agent_id !== undefined && String(current.assigned_agent_id || '') !== String(updated.assigned_agent_id || '')) {
+      const now = new Date()
+      await prisma.leadAssignment.create({
+        data: {
+          id: crypto.randomUUID(),
+          lead_id: updated.id,
+          org_owner_id: updated.org_owner_id,
+          assigned_by: String(actor.id || ''),
+          assigned_to: updated.assigned_agent_id || null,
+          previous_assignee: current.assigned_agent_id || null,
+          reason: sanitizeString(String(patch.assignment_reason || 'manual_assignment'), 180) || 'manual_assignment',
+          assigned_at: now,
+          created_at: now,
+        },
+      })
+      await trackEvent({
+        type: 'lead_reassigned',
+        actor_id: String(actor.id || ''),
+        entity_id: updated.id,
+        entityType: 'lead',
+        metadata: { org_owner_id: updated.org_owner_id, assigned_to: updated.assigned_agent_id || '' },
+        allowUnknownTypes: true,
+      })
+    }
+    return updated
   }

   const leads = await readStore(LEADS_FILE)
@@ -462,6 +488,29 @@ export async function updateLead(actor, leadId, patch = {}) {

   leads[idx] = next
   await writeJson(LEADS_FILE, leads)
+  if (!isAgent(actor) && patch.assigned_agent_id !== undefined && String(current.assigned_agent_id || '') !== String(next.assigned_agent_id || '')) {
+    const assignments = await readStore(ASSIGNMENTS_FILE)
+    assignments.push({
+      id: crypto.randomUUID(),
+      lead_id: next.id,
+      org_owner_id: next.org_owner_id,
+      assigned_by: String(actor.id || ''),
+      assigned_to: next.assigned_agent_id || '',
+      previous_assignee: current.assigned_agent_id || '',
+      reason: sanitizeString(String(patch.assignment_reason || 'manual_assignment'), 180) || 'manual_assignment',
+      assigned_at: new Date().toISOString(),
+      created_at: new Date().toISOString(),
+    })
+    await writeJson(ASSIGNMENTS_FILE, assignments)
+    await trackEvent({
+      type: 'lead_reassigned',
+      actor_id: String(actor.id || ''),
+      entity_id: next.id,
+      entityType: 'lead',
+      metadata: { org_owner_id: next.org_owner_id, assigned_to: next.assigned_agent_id || '' },
+      allowUnknownTypes: true,
+    })
+  }
   return next
 }

diff --git a/server/services/orgOperationsService.js b/server/services/orgOperationsService.js
new file mode 100644
index 0000000..4838036
--- /dev/null
+++ b/server/services/orgOperationsService.js
@@ -0,0 +1,425 @@
+import crypto from 'crypto'
+import { readJson, writeJson } from '../utils/jsonStore.js'
+import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
+import { sanitizeString } from '../utils/validators.js'
+import {
+  canManageLeadAssignments,
+  canManageOrgPolicies,
+  canManageOrgQueue,
+  forbiddenError,
+  isAgent,
+} from '../utils/permissions.js'
+import { trackEvent } from './eventTrackingService.js'
+
+const USE_SQL_CRM = isCrmSqlEnabled()
+
+const POLICIES_FILE = 'org_policies.json'
+const ASSIGNMENTS_FILE = 'lead_assignments.json'
+const CAPACITY_FILE = 'agent_capacity.json'
+const LEADS_FILE = 'leads.json'
+const USERS_FILE = 'users.json'
+
+const DEFAULT_POLICY = {
+  assignment_strategy: 'least_loaded',
+  sla_targets: {
+    response_minutes: 60,
+    contact_minutes: 240,
+    resolution_minutes: 2880,
+  },
+  escalation_windows: {
+    warning_minutes: 30,
+    breach_minutes: 60,
+  },
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
+function toIso(value, fallback = new Date().toISOString()) {
+  if (!value) return fallback
+  const date = new Date(value)
+  if (Number.isNaN(date.getTime())) return fallback
+  return date.toISOString()
+}
+
+function normalizePolicyInput(input = {}) {
+  const assignmentStrategy = sanitizeString(String(input.assignment_strategy || DEFAULT_POLICY.assignment_strategy), 80)
+  const slaTargets = input?.sla_targets && typeof input.sla_targets === 'object' ? input.sla_targets : {}
+  const escalationWindows = input?.escalation_windows && typeof input.escalation_windows === 'object' ? input.escalation_windows : {}
+
+  return {
+    assignment_strategy: assignmentStrategy || DEFAULT_POLICY.assignment_strategy,
+    sla_targets: {
+      response_minutes: Math.max(1, Number(slaTargets.response_minutes ?? DEFAULT_POLICY.sla_targets.response_minutes)),
+      contact_minutes: Math.max(1, Number(slaTargets.contact_minutes ?? DEFAULT_POLICY.sla_targets.contact_minutes)),
+      resolution_minutes: Math.max(1, Number(slaTargets.resolution_minutes ?? DEFAULT_POLICY.sla_targets.resolution_minutes)),
+    },
+    escalation_windows: {
+      warning_minutes: Math.max(1, Number(escalationWindows.warning_minutes ?? DEFAULT_POLICY.escalation_windows.warning_minutes)),
+      breach_minutes: Math.max(1, Number(escalationWindows.breach_minutes ?? DEFAULT_POLICY.escalation_windows.breach_minutes)),
+    },
+  }
+}
+
+function computeLoad(leads = [], agentId = '') {
+  return leads.filter((lead) => String(lead.assigned_agent_id || '') === String(agentId)).length
+}
+
+function computeSlaStatus(lead, policy) {
+  const referenceAt = new Date(lead?.last_interaction_at || lead?.updated_at || lead?.created_at || Date.now())
+  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - referenceAt.getTime()) / 60000))
+  const breachAt = Number(policy?.escalation_windows?.breach_minutes || DEFAULT_POLICY.escalation_windows.breach_minutes)
+  const warningAt = Number(policy?.escalation_windows?.warning_minutes || DEFAULT_POLICY.escalation_windows.warning_minutes)
+
+  if (elapsedMinutes >= breachAt) return { status: 'breached', elapsed_minutes: elapsedMinutes }
+  if (elapsedMinutes >= warningAt) return { status: 'warning', elapsed_minutes: elapsedMinutes }
+  return { status: 'healthy', elapsed_minutes: elapsedMinutes }
+}
+
+async function ensurePolicy(orgOwnerId) {
+  const policies = await readStore(POLICIES_FILE)
+  const existing = policies.find((policy) => (
+    String(policy.org_id || policy.org_owner_id || '') === String(orgOwnerId)
+      && String(policy.code || 'operations') === 'operations'
+  ))
+  if (existing) return existing
+
+  const now = new Date().toISOString()
+  const created = {
+    id: crypto.randomUUID(),
+    org_id: orgOwnerId,
+    code: 'operations',
+    description: 'Org operations policy',
+    config: {},
+    ...DEFAULT_POLICY,
+    active: true,
+    created_at: now,
+    updated_at: now,
+  }
+
+  await writeJson(POLICIES_FILE, [...policies, created])
+  return created
+}
+
+export async function getOrgPolicies(actor) {
+  const orgOwnerId = actorOrgOwnerId(actor)
+  if (!orgOwnerId) throw forbiddenError()
+  return ensurePolicy(orgOwnerId)
+}
+
+export async function updateOrgPolicies(actor, payload = {}) {
+  if (!canManageOrgPolicies(actor)) throw forbiddenError('Policy admin permission required')
+  const orgOwnerId = actorOrgOwnerId(actor)
+  if (!orgOwnerId) throw forbiddenError()
+
+  const policies = await readStore(POLICIES_FILE)
+  const now = new Date().toISOString()
+  const input = normalizePolicyInput(payload)
+  const index = policies.findIndex((policy) => (
+    String(policy.org_id || policy.org_owner_id || '') === orgOwnerId
+      && String(policy.code || 'operations') === 'operations'
+  ))
+
+  const next = {
+    ...(index >= 0 ? policies[index] : {
+      id: crypto.randomUUID(),
+      org_id: orgOwnerId,
+      code: 'operations',
+      description: 'Org operations policy',
+      config: {},
+      active: true,
+      created_at: now,
+    }),
+    ...input,
+    updated_at: now,
+  }
+
+  const rows = index >= 0
+    ? policies.map((row, rowIndex) => (rowIndex === index ? next : row))
+    : [...policies, next]
+
+  await writeJson(POLICIES_FILE, rows)
+  return next
+}
+
+export async function getOrgQueue(actor) {
+  if (!canManageOrgQueue(actor) && !isAgent(actor)) throw forbiddenError('Queue manager permission required')
+
+  const orgOwnerId = actorOrgOwnerId(actor)
+  if (!orgOwnerId) throw forbiddenError()
+
+  const [leads, users, policy, capacityRows] = await Promise.all([
+    readStore(LEADS_FILE),
+    readStore(USERS_FILE),
+    ensurePolicy(orgOwnerId),
+    readStore(CAPACITY_FILE),
+  ])
+
+  const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === orgOwnerId)
+
+  const scopedLeads = leads.filter((lead) => String(lead.org_owner_id || '') === orgOwnerId)
+    .filter((lead) => !isAgent(actor) || String(lead.assigned_agent_id || '') === String(actor.id || ''))
+    .map((lead) => ({
+      ...lead,
+      queue_owner_id: lead.assigned_agent_id || orgOwnerId,
+      sla: computeSlaStatus(lead, policy),
+    }))
+
+  const agentCapacity = agents.map((agent) => {
+    const existing = capacityRows.find((row) => String(row.agent_id || '') === String(agent.id))
+    const currentLoad = computeLoad(scopedLeads, agent.id)
+    return {
+      id: existing?.id || crypto.randomUUID(),
+      org_owner_id: orgOwnerId,
+      agent_id: agent.id,
+      max_concurrent_leads: Number(existing?.max_concurrent_leads || 10),
+      current_load: currentLoad,
+      updated_at: new Date().toISOString(),
+    }
+  })
+
+  return {
+    queue: scopedLeads,
+    team_queues: agents.map((agent) => ({
+      agent_id: agent.id,
+      agent_name: agent.name,
+      current_load: computeLoad(scopedLeads, agent.id),
+      leads: scopedLeads.filter((lead) => String(lead.assigned_agent_id || '') === String(agent.id)),
+    })),
+    agent_capacity: agentCapacity,
+  }
+}
+
+export async function rebalanceOrgQueue(actor, payload = {}) {
+  if (!canManageLeadAssignments(actor)) throw forbiddenError('Assignment manager permission required')
+
+  const orgOwnerId = actorOrgOwnerId(actor)
+  const [users, leads, capacityRows] = await Promise.all([
+    readStore(USERS_FILE),
+    readStore(LEADS_FILE),
+    readStore(CAPACITY_FILE),
+  ])
+
+  const strategy = sanitizeString(String(payload.strategy || 'least_loaded'), 60) || 'least_loaded'
+  const agents = users.filter((user) => String(user.role || '').toLowerCase() === 'agent' && String(user.org_owner_id || '') === orgOwnerId)
+
+  if (agents.length === 0) return { moved: 0, strategy, assignments: [] }
+
+  const leadsInScope = leads.filter((lead) => String(lead.org_owner_id || '') === orgOwnerId)
+  const loadByAgent = new Map(agents.map((agent) => [agent.id, computeLoad(leadsInScope, agent.id)]))
+  const capacityByAgent = new Map(agents.map((agent) => {
+    const cap = capacityRows.find((row) => String(row.agent_id || '') === String(agent.id))
+    return [agent.id, Number(cap?.max_concurrent_leads || 10)]
+  }))
+
+  const updatedAssignments = []
+  const now = new Date().toISOString()
+
+  function pickAgent() {
+    const ranked = agents
+      .map((agent) => ({
+        agent_id: agent.id,
+        load: Number(loadByAgent.get(agent.id) || 0),
+        capacity: Number(capacityByAgent.get(agent.id) || 10),
+      }))
+      .filter((agent) => agent.load < agent.capacity)
+      .sort((a, b) => a.load - b.load)
+    return ranked[0]?.agent_id || ''
+  }
+
+  const nextLeads = leads.map((lead) => {
+    if (String(lead.org_owner_id || '') !== orgOwnerId) return lead
+    const hasAssignee = Boolean(lead.assigned_agent_id)
+    if (hasAssignee && strategy === 'fill_unassigned') return lead
+
+    const targetAgentId = pickAgent()
+    if (!targetAgentId || String(lead.assigned_agent_id || '') === String(targetAgentId)) return lead
+
+    const previousAgentId = String(lead.assigned_agent_id || '')
+    if (previousAgentId) loadByAgent.set(previousAgentId, Math.max(0, Number(loadByAgent.get(previousAgentId) || 0) - 1))
+    loadByAgent.set(targetAgentId, Number(loadByAgent.get(targetAgentId) || 0) + 1)
+
+    updatedAssignments.push({
+      id: crypto.randomUUID(),
+      lead_id: lead.id,
+      org_owner_id: orgOwnerId,
+      assigned_by: actor.id,
+      assigned_to: targetAgentId,
+      previous_assignee: previousAgentId,
+      reason: 'queue_rebalanced',
+      assigned_at: now,
+      created_at: now,
+    })
+
+    return {
+      ...lead,
+      assigned_agent_id: targetAgentId,
+      updated_at: now,
+    }
+  })
+
+  if (updatedAssignments.length) {
+    await Promise.all([
+      writeJson(LEADS_FILE, nextLeads),
+      writeJson(ASSIGNMENTS_FILE, [...await readStore(ASSIGNMENTS_FILE), ...updatedAssignments]),
+      writeJson(CAPACITY_FILE, agents.map((agent) => ({
+        id: crypto.randomUUID(),
+        org_owner_id: orgOwnerId,
+        agent_id: agent.id,
+        max_concurrent_leads: Number(capacityByAgent.get(agent.id) || 10),
+        current_load: Number(loadByAgent.get(agent.id) || 0),
+        updated_at: now,
+      }))),
+    ])
+
+    await trackEvent({
+      type: 'queue_rebalanced',
+      actor_id: actor.id,
+      entity_id: orgOwnerId,
+      entityType: 'org_operations',
+      metadata: {
+        org_owner_id: orgOwnerId,
+        moved: updatedAssignments.length,
+        strategy,
+      },
+      allowUnknownTypes: true,
+    })
+  }
+
+  return {
+    moved: updatedAssignments.length,
+    strategy,
+    assignments: updatedAssignments,
+  }
+}
+
+export async function escalateOrgLead(actor, leadId, payload = {}) {
+  if (!canManageLeadAssignments(actor) && !canManageOrgQueue(actor)) {
+    throw forbiddenError('Queue manager or assignment manager permission required')
+  }
+
+  const orgOwnerId = actorOrgOwnerId(actor)
+  const [leads, policy] = await Promise.all([readStore(LEADS_FILE), ensurePolicy(orgOwnerId)])
+  const target = leads.find((lead) => String(lead.id || '') === String(leadId) && String(lead.org_owner_id || '') === orgOwnerId)
+  if (!target) return null
+
+  const now = new Date().toISOString()
+  const reason = sanitizeString(String(payload.reason || 'manual_escalation'), 180)
+  const escalated = {
+    ...target,
+    status: 'escalated',
+    escalated_at: now,
+    escalation_reason: reason,
+    updated_at: now,
+  }
+  await writeJson(LEADS_FILE, leads.map((lead) => (lead.id === target.id ? escalated : lead)))
+
+  const assignmentEvent = {
+    id: crypto.randomUUID(),
+    lead_id: target.id,
+    org_owner_id: orgOwnerId,
+    assigned_by: actor.id,
+    assigned_to: target.assigned_agent_id || '',
+    previous_assignee: target.assigned_agent_id || '',
+    reason: reason || 'lead_escalated',
+    assigned_at: now,
+    created_at: now,
+  }
+
+  const history = await readStore(ASSIGNMENTS_FILE)
+  await writeJson(ASSIGNMENTS_FILE, [...history, assignmentEvent])
+
+  const sla = computeSlaStatus(escalated, policy)
+  if (sla.status === 'breached') {
+    await trackEvent({
+      type: 'sla_breached',
+      actor_id: actor.id,
+      entity_id: target.id,
+      entityType: 'lead',
+      metadata: {
+        org_owner_id: orgOwnerId,
+        elapsed_minutes: sla.elapsed_minutes,
+        breach_minutes: policy?.escalation_windows?.breach_minutes,
+      },
+      allowUnknownTypes: true,
+    })
+  }
+
+  await trackEvent({
+    type: 'lead_escalated',
+    actor_id: actor.id,
+    entity_id: target.id,
+    entityType: 'lead',
+    metadata: {
+      org_owner_id: orgOwnerId,
+      reason: reason || 'manual_escalation',
+    },
+    allowUnknownTypes: true,
+  })
+
+  await trackEvent({
+    type: 'lead_reassigned',
+    actor_id: actor.id,
+    entity_id: target.id,
+    entityType: 'lead',
+    metadata: {
+      org_owner_id: orgOwnerId,
+      reason: reason || 'lead_escalated',
+      assigned_to: target.assigned_agent_id || '',
+    },
+    allowUnknownTypes: true,
+  })
+
+  return escalated
+}
+
+export async function listLeadAssignmentHistory(actor) {
+  const orgOwnerId = actorOrgOwnerId(actor)
+  const history = await readStore(ASSIGNMENTS_FILE)
+  return history
+    .filter((row) => String(row.org_owner_id || '') === orgOwnerId)
+    .sort((a, b) => String(b.assigned_at || b.created_at || '').localeCompare(String(a.assigned_at || a.created_at || '')))
+}
+
+export async function upsertAgentCapacity(actor, payload = {}) {
+  if (!canManageLeadAssignments(actor)) throw forbiddenError('Assignment manager permission required')
+  const orgOwnerId = actorOrgOwnerId(actor)
+  const rows = await readStore(CAPACITY_FILE)
+  const agentId = sanitizeString(String(payload.agent_id || ''), 120)
+  if (!agentId) throw new Error('agent_id is required')
+
+  const now = new Date().toISOString()
+  const index = rows.findIndex((row) => String(row.agent_id || '') === agentId && String(row.org_owner_id || '') === orgOwnerId)
+  const next = {
+    ...(index >= 0 ? rows[index] : { id: crypto.randomUUID(), org_owner_id: orgOwnerId, agent_id: agentId }),
+    max_concurrent_leads: Math.max(1, Number(payload.max_concurrent_leads || rows[index]?.max_concurrent_leads || 10)),
+    current_load: Math.max(0, Number(payload.current_load ?? rows[index]?.current_load ?? 0)),
+    updated_at: now,
+  }
+
+  const updatedRows = index >= 0 ? rows.map((row, rowIndex) => (rowIndex === index ? next : row)) : [...rows, next]
+  await writeJson(CAPACITY_FILE, updatedRows)
+  return next
+}
+
+export function getDefaultOrgPolicy(orgOwnerId) {
+  return {
+    id: crypto.randomUUID(),
+    org_id: orgOwnerId,
+    code: 'operations',
+    description: 'Org operations policy',
+    config: {},
+    ...DEFAULT_POLICY,
+    active: true,
+    created_at: toIso(),
+    updated_at: toIso(),
+  }
+}
diff --git a/server/utils/jsonStore.js b/server/utils/jsonStore.js
index 7c269bb..7cca9f9 100644
--- a/server/utils/jsonStore.js
+++ b/server/utils/jsonStore.js
@@ -129,6 +129,9 @@ const FILE_HANDLERS = {
   'lead_reminders.json': tableHandler('leadReminder', ['id']),
   'interaction_logs.json': tableHandler('interactionLog', ['id']),
   'event_logs.json': tableHandler('eventLog', ['id']),
+  'org_policies.json': tableHandler('orgPolicy', ['id']),
+  'lead_assignments.json': tableHandler('leadAssignment', ['id']),
+  'agent_capacity.json': tableHandler('agentCapacity', ['id']),
   'analytics.json': tableHandler('analyticsEvent', ['id']),
   'boosts.json': tableHandler('boost', ['id']),
   'product_views.json': tableHandler('productView', ['id']),
diff --git a/server/utils/permissions.js b/server/utils/permissions.js
index cce1958..2b83f55 100644
--- a/server/utils/permissions.js
+++ b/server/utils/permissions.js
@@ -48,6 +48,21 @@ export function canManageMembers(user) {
   return MEMBER_MANAGER_ROLES.has(user?.role)
 }

+export function canManageOrgPolicies(user) {
+  if (isOwnerOrAdmin(user)) return true
+  return Boolean(user?.permission_matrix?.org_operations?.policy_admin)
+}
+
+export function canManageOrgQueue(user) {
+  if (isOwnerOrAdmin(user)) return true
+  return Boolean(user?.permission_matrix?.org_operations?.queue_manager)
+}
+
+export function canManageLeadAssignments(user) {
+  if (isOwnerOrAdmin(user)) return true
+  return Boolean(user?.permission_matrix?.org_operations?.assignment_manager)
+}
+
 export function canViewAnalytics(user) {
   return isOwnerOrAdmin(user) || hasRole(user, 'buying_house', 'factory', 'buyer', 'agent')
 }
diff --git a/shared/event-taxonomy.json b/shared/event-taxonomy.json
index 54925fa..7a507ba 100644
--- a/shared/event-taxonomy.json
+++ b/shared/event-taxonomy.json
@@ -29,8 +29,11 @@
     "industry_page_view",
     "lead_converted",
     "lead_created",
+    "lead_escalated",
+    "lead_reassigned",
     "lead_reminder_due",
     "lead_source_attached",
+    "queue_rebalanced",
     "message_sent",
     "new_profile_boost_impressions",
     "page_duration",
@@ -52,6 +55,7 @@
     "product_video_uploaded",
     "product_viewed",
     "profile_view",
+    "sla_breached",
     "search_filters_changed",
     "search_run",
     "session_end",
diff --git a/src/components/leads/LeadManager.jsx b/src/components/leads/LeadManager.jsx
index b7c8a4c..d9792ba 100644
--- a/src/components/leads/LeadManager.jsx
+++ b/src/components/leads/LeadManager.jsx
@@ -18,7 +18,13 @@ function formatDate(value) {
   return d.toLocaleString()
 }

-export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true }) {
+function statusBadgeClass(status = '') {
+  if (status === 'breached') return 'bg-rose-100 text-rose-700'
+  if (status === 'warning') return 'bg-amber-100 text-amber-800'
+  return 'bg-emerald-100 text-emerald-700'
+}
+
+export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true, showOperations = true }) {
   const token = useMemo(() => getToken(), [])
   const canAssignLeads = Boolean(getCurrentUser()?.capabilities?.leads?.assign)
   const navigate = useNavigate()
@@ -30,6 +36,7 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
   const [lookup, setLookup] = useState({})
   const [noteDraft, setNoteDraft] = useState('')
   const [saving, setSaving] = useState(false)
+  const [queueMeta, setQueueMeta] = useState({ queue: [], team_queues: [], assignments: [], agent_capacity: [] })

   const loadLeads = useCallback(async () => {
     if (!token) return
@@ -38,7 +45,24 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
     try {
       const data = await apiRequest('/leads', { token })
       const nextItems = Array.isArray(data?.items) ? data.items : []
-      setItems(nextItems)
+      let operationsQueue = []
+      if (showOperations) {
+        try {
+          const queueData = await apiRequest('/org/operations/queue', { token })
+          operationsQueue = Array.isArray(queueData?.queue) ? queueData.queue : []
+          setQueueMeta({
+            queue: operationsQueue,
+            team_queues: queueData?.team_queues || [],
+            assignments: queueData?.assignments || [],
+            agent_capacity: queueData?.agent_capacity || [],
+          })
+        } catch {
+          setQueueMeta({ queue: [], team_queues: [], assignments: [], agent_capacity: [] })
+        }
+      }
+
+      const queueMap = new Map(operationsQueue.map((row) => [row.id, row]))
+      setItems(nextItems.map((lead) => ({ ...lead, ...(queueMap.get(lead.id) || {}) })))

       const ids = new Set()
       nextItems.forEach((lead) => {
@@ -63,7 +87,7 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
     } finally {
       setLoading(false)
     }
-  }, [token])
+  }, [showOperations, token])

   const loadLeadDetail = useCallback(async (leadId) => {
     if (!token || !leadId) return
@@ -148,6 +172,42 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
     }
   }

+  async function triggerRebalance() {
+    if (!token) return
+    setSaving(true)
+    setError('')
+    try {
+      await apiRequest('/org/operations/rebalance', { method: 'POST', token, body: { strategy: 'least_loaded' } })
+      await loadLeads()
+      if (selectedId) await loadLeadDetail(selectedId)
+    } catch (err) {
+      setError(err.message || 'Failed to rebalance queue')
+    } finally {
+      setSaving(false)
+    }
+  }
+
+  async function escalateLead(leadId) {
+    if (!token || !leadId) return
+    const reason = window.prompt('Escalation reason', 'SLA risk') || 'SLA risk'
+    setSaving(true)
+    setError('')
+    try {
+      const updated = await apiRequest(`/org/operations/escalate/${encodeURIComponent(leadId)}`, {
+        method: 'POST',
+        token,
+        body: { reason },
+      })
+      setItems((prev) => prev.map((lead) => (lead.id === updated.id ? { ...lead, ...updated } : lead)))
+      setSelected((prev) => (prev ? { ...prev, ...updated } : prev))
+      await loadLeads()
+    } catch (err) {
+      setError(err.message || 'Failed to escalate lead')
+    } finally {
+      setSaving(false)
+    }
+  }
+
   const selectedCounterparty = selected?.counterparty_id ? lookup[selected.counterparty_id] : null
   const assignedAgent = selected?.assigned_agent_id ? lookup[selected.assigned_agent_id] : null

@@ -157,14 +217,26 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
         <div className="lg:w-2/5">
           <div className="flex items-center justify-between gap-3 mb-3">
             <h3 className="font-semibold">{title}</h3>
-            <button
-              type="button"
-              onClick={loadLeads}
-              className="px-3 py-1.5 text-sm rounded-md borderless-shadow hover:bg-slate-50 active:scale-[0.98]"
-              disabled={loading}
-            >
-              Refresh
-            </button>
+            <div className="flex items-center gap-2">
+              {showOperations ? (
+                <button
+                  type="button"
+                  onClick={triggerRebalance}
+                  className="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]"
+                  disabled={loading || saving}
+                >
+                  Rebalance
+                </button>
+              ) : null}
+              <button
+                type="button"
+                onClick={loadLeads}
+                className="px-3 py-1.5 text-sm rounded-md borderless-shadow hover:bg-slate-50 active:scale-[0.98]"
+                disabled={loading}
+              >
+                Refresh
+              </button>
+            </div>
           </div>

           {loading ? <div className="text-sm text-slate-500">Loading leads...</div> : null}
@@ -201,6 +273,16 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
                     </div>
                     <span className="text-[11px] uppercase tracking-widest text-slate-500">{(lead.status || 'new').replace(/_/g, ' ')}</span>
                   </div>
+                  <div className="mt-1 flex items-center gap-2">
+                    {lead?.sla?.status ? (
+                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(lead.sla.status)}`}>
+                        SLA {lead.sla.status}
+                      </span>
+                    ) : null}
+                    {lead?.queue_owner_id ? (
+                      <span className="text-[10px] text-slate-500">Queue: {lookup[lead.queue_owner_id]?.name || lead.queue_owner_id}</span>
+                    ) : null}
+                  </div>
                   <p className="mt-1 text-xs text-slate-500">Last: {formatDate(lead.last_interaction_at || lead.updated_at)}</p>
                 </button>
               )
@@ -257,6 +339,16 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
                   >
                     Message
                   </button>
+                  {showOperations ? (
+                    <button
+                      type="button"
+                      className="rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-400"
+                      disabled={saving || !selectedId}
+                      onClick={() => escalateLead(selectedId)}
+                    >
+                      Escalate
+                    </button>
+                  ) : null}
                 </div>
               </div>

@@ -281,6 +373,14 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
                 <div className="rounded-lg bg-slate-50 p-3">
                   <p className="text-xs uppercase tracking-widest text-slate-500">Updated</p>
                   <p className="mt-1 text-sm font-medium">{formatDate(selected?.updated_at || '') || '--'}</p>
+                  {selected?.sla?.status ? (
+                    <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(selected.sla.status)}`}>
+                      SLA {selected.sla.status}
+                    </p>
+                  ) : null}
+                  {selected?.queue_owner_id ? (
+                    <p className="mt-1 text-xs text-slate-600">Queue owner: {lookup[selected.queue_owner_id]?.name || selected.queue_owner_id}</p>
+                  ) : null}
                   <button
                     type="button"
                     onClick={createReminder}
@@ -293,6 +393,19 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
               </div>

               <div className="mt-5">
+                {showOperations ? (
+                  <div className="mb-4 rounded-lg bg-slate-50 p-3">
+                    <p className="text-xs uppercase tracking-widest text-slate-500">Team queue snapshot</p>
+                    <div className="mt-2 grid gap-2 md:grid-cols-2">
+                      {(queueMeta.team_queues || []).slice(0, 4).map((queue) => (
+                        <div key={queue.agent_id} className="rounded-md borderless-shadow px-2 py-1 text-xs">
+                          <div className="font-medium">{queue.agent_name || queue.agent_id}</div>
+                          <div className="text-slate-500">Load: {queue.current_load} leads</div>
+                        </div>
+                      ))}
+                    </div>
+                  </div>
+                ) : null}
                 <p className="text-xs uppercase tracking-widest text-slate-500">Internal notes</p>
                 <div className="mt-2 flex items-center gap-2">
                   <input
@@ -344,4 +457,3 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
     </div>
   )
 }
-
diff --git a/src/pages/AgentDashboard.jsx b/src/pages/AgentDashboard.jsx
index cf1cd4e..7846cd6 100644
--- a/src/pages/AgentDashboard.jsx
+++ b/src/pages/AgentDashboard.jsx
@@ -12,6 +12,7 @@ export default function AgentDashboard() {
   const [aiSuggestion, setAiSuggestion] = useState('')
   const [aiLoading, setAiLoading] = useState(false)
   const [aiError, setAiError] = useState('')
+  const [queueSummary, setQueueSummary] = useState({ queue: [] })

   async function generateAiReply() {
     const token = getToken()
@@ -44,6 +45,17 @@ export default function AgentDashboard() {
     }
   }

+  async function refreshQueueSummary() {
+    const token = getToken()
+    if (!token) return
+    try {
+      const queueData = await apiRequest('/org/operations/queue', { token })
+      setQueueSummary({ queue: queueData?.queue || [] })
+    } catch {
+      setQueueSummary({ queue: [] })
+    }
+  }
+
   return (
     <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#020617] dark:text-slate-100">
       <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
@@ -99,7 +111,15 @@ export default function AgentDashboard() {
                 <div className="text-sm text-[#5A5A5A]">Partner factories connected: {totals.partner_network ?? 0}</div>
               </div>
             ) : (
-              <LeadManager title="My Leads (CRM)" allowAssign={false} />
+              <div className="space-y-3">
+                <div className="rounded-lg bg-slate-50 p-3 text-sm">
+                  <div className="flex items-center justify-between gap-3">
+                    <p>Queue ownership: <strong>{queueSummary.queue.length}</strong> leads</p>
+                    <button type="button" className="text-xs px-2 py-1 rounded bg-white borderless-shadow" onClick={refreshQueueSummary}>Refresh queue</button>
+                  </div>
+                </div>
+                <LeadManager title="My Leads (CRM)" allowAssign={false} showOperations />
+              </div>
             )}
           </div>

@@ -147,4 +167,3 @@ export default function AgentDashboard() {
     </div>
   )
 }
-
diff --git a/src/pages/OwnerDashboard.jsx b/src/pages/OwnerDashboard.jsx
index 7a10412..821ba47 100644
--- a/src/pages/OwnerDashboard.jsx
+++ b/src/pages/OwnerDashboard.jsx
@@ -1,7 +1,8 @@
-import React, { useState } from 'react'
+import React, { useEffect, useState } from 'react'
 import { Link } from 'react-router-dom'
 import useAnalyticsDashboard from '../hooks/useAnalyticsDashboard'
 import LeadManager from '../components/leads/LeadManager'
+import { apiRequest, getToken } from '../lib/auth'

 function SeriesList({ title, items }) {
   return (
@@ -26,9 +27,18 @@ function SeriesList({ title, items }) {
 export default function OwnerDashboard() {
   const [active, setActive] = useState('home')
   const { dashboard, subscription, isEnterprise, loading, error } = useAnalyticsDashboard()
+  const [policy, setPolicy] = useState(null)

   const totals = dashboard?.totals || {}

+  useEffect(() => {
+    const token = getToken()
+    if (!token) return
+    apiRequest('/org/operations/policies', { token })
+      .then(setPolicy)
+      .catch(() => null)
+  }, [])
+
   return (
     <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#020617] dark:text-slate-100">
       <div className="max-w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-6 gap-6">
@@ -71,7 +81,19 @@ export default function OwnerDashboard() {
           {active === 'requests' && <div className="bg-white rounded-xl shadow-md p-4"><h3 className="font-semibold mb-2">Buyer Requests</h3><p className="text-sm text-[#5A5A5A]">Total: {totals.buyer_requests ?? 0} | Open: {totals.open_buyer_requests ?? 0}</p></div>}
           {active === 'chats' && <div className="bg-white rounded-xl shadow-md p-4"><h3 className="font-semibold mb-2">Chats</h3><p className="text-sm text-[#5A5A5A]">Active chat threads: {totals.chats ?? 0}. Messages sent: {totals.messages ?? 0}.</p></div>}
           {active === 'network' && <div className="bg-white rounded-xl shadow-md p-4"><h3 className="font-semibold mb-2">Partner Network</h3><p className="text-sm text-[#5A5A5A]">Connected factory partners: {totals.partner_network ?? 0}. Total factory profiles: {totals.factories ?? 0}.</p></div>}
-          {active === 'leads' && <LeadManager title="Leads (CRM)" allowAssign />}
+          {active === 'leads' && (
+            <div className="space-y-4">
+              {policy ? (
+                <div className="bg-white rounded-xl shadow-md p-4 text-sm text-slate-700">
+                  <h3 className="font-semibold mb-2">Org Operations Policy</h3>
+                  <p>Assignment strategy: <strong>{policy.assignment_strategy}</strong></p>
+                  <p>SLA response target: <strong>{policy?.sla_targets?.response_minutes} min</strong></p>
+                  <p>Escalation breach window: <strong>{policy?.escalation_windows?.breach_minutes} min</strong></p>
+                </div>
+              ) : null}
+              <LeadManager title="Leads (CRM)" allowAssign showOperations />
+            </div>
+          )}
           {active === 'contracts' && <div className="bg-white rounded-xl shadow-md p-4"><h3 className="font-semibold mb-2">Contracts Vault</h3><p className="text-sm text-[#5A5A5A]">Contracts uploaded: {totals.contracts ?? 0}. Total documents: {totals.documents ?? 0}.</p></div>}

           {active === 'insights' && (
@@ -91,4 +113,3 @@ export default function OwnerDashboard() {
     </div>
   )
 }
-
```

## Why This Change

Merge pull request #80 from gamertoky1188gro/codex/add-org-operations-domain-module-and-apis

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 15 files changed, 892 insertions(+), 19 deletions(-)
- **Risk:** Moderate

## Relationships

Commit 204 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
