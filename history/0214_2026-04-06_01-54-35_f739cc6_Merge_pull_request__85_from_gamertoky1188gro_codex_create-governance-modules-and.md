## Commit Metadata

- **Hash:** f739cc6bab1aa1dd28e755a8a3aa2a344d72c9e5
- **Parent:** 1ef7fbd8038601907806106fac042981af3d4abf c8d3df2b7a282aaae70a0ce9c736eb1748264a43
- **Author:** Cyber Code Master
- **Date:** 2026-04-06 01:54:35
- **Message:** Merge pull request #85 from gamertoky1188gro/codex/create-governance-modules-and-features

## Custom Title

Merge pull request #85 from gamertoky1188gro/codex/create-governance-modules-and-features

## High-Level Summary

Merge pull request #85 from gamertoky1188gro/codex/create-governance-modules-and-features

9 files changed, 1181 insertions(+)

## File-by-File Breakdown

.../migration.sql | 119 +++++++++
prisma/schema.prisma | 142 ++++++++++
server/controllers/governanceController.js | 137 ++++++++++
server/routes/adminRoutes.js | 29 +++
server/services/enforcementService.js | 285 +++++++++++++++++++++
server/services/policyRegistryService.js | 143 +++++++++++
server/services/trustRiskScoringService.js | 110 ++++++++
src/App.jsx | 2 +
src/pages/AdminGovernance.jsx | 214 ++++++++++++++++
9 files changed, 1181 insertions(+)

## Detailed Diff Analysis

```diff
diff --git a/prisma/migrations/20260405203000_add_governance_modules/migration.sql b/prisma/migrations/20260405203000_add_governance_modules/migration.sql
new file mode 100644
index 0000000..366913f
--- /dev/null
+++ b/prisma/migrations/20260405203000_add_governance_modules/migration.sql
@@ -0,0 +1,119 @@
+CREATE TABLE "policy_definitions" (
+  "id" TEXT PRIMARY KEY,
+  "code" TEXT NOT NULL UNIQUE,
+  "name" TEXT NOT NULL,
+  "description" TEXT,
+  "active" BOOLEAN NOT NULL DEFAULT true,
+  "created_by" TEXT,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3)
+);
+
+CREATE TABLE "policy_versions" (
+  "id" TEXT PRIMARY KEY,
+  "policy_definition_id" TEXT NOT NULL REFERENCES "policy_definitions"("id") ON DELETE CASCADE,
+  "version" INTEGER NOT NULL,
+  "status" TEXT NOT NULL DEFAULT 'draft',
+  "effective_from" TIMESTAMP(3) NOT NULL,
+  "effective_to" TIMESTAMP(3),
+  "rules" JSONB,
+  "created_by" TEXT,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3),
+  CONSTRAINT "policy_definition_version" UNIQUE ("policy_definition_id", "version")
+);
+CREATE INDEX "policy_versions_effective_dates_idx" ON "policy_versions"("effective_from", "effective_to");
+
+CREATE TABLE "policy_rule_scopes" (
+  "id" TEXT PRIMARY KEY,
+  "policy_version_id" TEXT NOT NULL REFERENCES "policy_versions"("id") ON DELETE CASCADE,
+  "scope_type" TEXT NOT NULL,
+  "scope_value" TEXT NOT NULL,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
+);
+CREATE INDEX "policy_rule_scopes_scope_idx" ON "policy_rule_scopes"("scope_type", "scope_value");
+
+CREATE TABLE "trust_risk_evaluations" (
+  "id" TEXT PRIMARY KEY,
+  "user_id" TEXT NOT NULL,
+  "role" TEXT,
+  "trust_score" DOUBLE PRECISION NOT NULL,
+  "verification_recency" DOUBLE PRECISION NOT NULL,
+  "dispute_history" DOUBLE PRECISION NOT NULL,
+  "suspicious_messaging" DOUBLE PRECISION NOT NULL,
+  "contract_breach" DOUBLE PRECISION NOT NULL,
+  "decision" TEXT,
+  "signals" JSONB,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
+);
+CREATE INDEX "trust_risk_evaluations_user_id_created_at_idx" ON "trust_risk_evaluations"("user_id", "created_at");
+
+CREATE TABLE "governance_enforcements" (
+  "id" TEXT PRIMARY KEY,
+  "user_id" TEXT NOT NULL,
+  "evaluation_id" TEXT,
+  "policy_definition_id" TEXT,
+  "policy_version_id" TEXT,
+  "action" TEXT NOT NULL,
+  "reason" TEXT,
+  "status" TEXT NOT NULL DEFAULT 'applied',
+  "metadata" JSONB,
+  "expires_at" TIMESTAMP(3),
+  "created_by" TEXT,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3)
+);
+CREATE INDEX "governance_enforcements_user_id_created_at_idx" ON "governance_enforcements"("user_id", "created_at");
+CREATE INDEX "governance_enforcements_action_created_at_idx" ON "governance_enforcements"("action", "created_at");
+
+CREATE TABLE "governance_manual_review_queue" (
+  "id" TEXT PRIMARY KEY,
+  "enforcement_id" TEXT,
+  "user_id" TEXT NOT NULL,
+  "status" TEXT NOT NULL DEFAULT 'open',
+  "priority" TEXT NOT NULL DEFAULT 'normal',
+  "reason" TEXT,
+  "payload" JSONB,
+  "assigned_to" TEXT,
+  "resolved_at" TIMESTAMP(3),
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3)
+);
+CREATE INDEX "governance_manual_review_queue_status_priority_idx" ON "governance_manual_review_queue"("status", "priority");
+CREATE INDEX "governance_manual_review_queue_user_id_created_at_idx" ON "governance_manual_review_queue"("user_id", "created_at");
+
+CREATE TABLE "governance_notification_templates" (
+  "id" TEXT PRIMARY KEY,
+  "template_key" TEXT NOT NULL UNIQUE,
+  "channel" TEXT NOT NULL DEFAULT 'in_app',
+  "subject" TEXT NOT NULL,
+  "body" TEXT NOT NULL,
+  "active" BOOLEAN NOT NULL DEFAULT true,
+  "created_by" TEXT,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3)
+);
+
+CREATE TABLE "governance_appeals" (
+  "id" TEXT PRIMARY KEY,
+  "enforcement_id" TEXT NOT NULL,
+  "user_id" TEXT NOT NULL,
+  "status" TEXT NOT NULL DEFAULT 'submitted',
+  "reason" TEXT NOT NULL,
+  "outcome" TEXT,
+  "outcome_notes" TEXT,
+  "reviewed_by" TEXT,
+  "reviewed_at" TIMESTAMP(3),
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3)
+);
+CREATE INDEX "governance_appeals_enforcement_id_status_idx" ON "governance_appeals"("enforcement_id", "status");
+CREATE INDEX "governance_appeals_user_id_created_at_idx" ON "governance_appeals"("user_id", "created_at");
+
+CREATE TABLE "governance_monthly_reports" (
+  "id" TEXT PRIMARY KEY,
+  "month" TEXT NOT NULL UNIQUE,
+  "metrics" JSONB NOT NULL,
+  "created_by" TEXT,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
+);
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index ec19e9c..234e06b 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -931,3 +931,145 @@ model OrgMembershipAudit {
   @@index([org_id, created_at])
   @@map("org_membership_audit")
 }
+
+model PolicyDefinition {
+  id          String   @id
+  code        String   @unique
+  name        String
+  description String?
+  active      Boolean  @default(true)
+  created_by  String?
+  created_at  DateTime @default(now())
+  updated_at  DateTime?
+  versions    PolicyVersion[]
+
+  @@map("policy_definitions")
+}
+
+model PolicyVersion {
+  id                   String   @id
+  policy_definition_id String
+  version              Int
+  status               String   @default("draft")
+  effective_from       DateTime
+  effective_to         DateTime?
+  rules                Json?
+  created_by           String?
+  created_at           DateTime @default(now())
+  updated_at           DateTime?
+  policy               PolicyDefinition @relation(fields: [policy_definition_id], references: [id], onDelete: Cascade)
+  scopes               PolicyRuleScope[]
+
+  @@unique([policy_definition_id, version], name: "policy_definition_version")
+  @@index([effective_from, effective_to])
+  @@map("policy_versions")
+}
+
+model PolicyRuleScope {
+  id                String   @id
+  policy_version_id String
+  scope_type        String
+  scope_value       String
+  created_at        DateTime @default(now())
+  policy_version    PolicyVersion @relation(fields: [policy_version_id], references: [id], onDelete: Cascade)
+
+  @@index([scope_type, scope_value])
+  @@map("policy_rule_scopes")
+}
+
+model TrustRiskEvaluation {
+  id                   String   @id
+  user_id              String
+  role                 String?
+  trust_score          Float
+  verification_recency Float
+  dispute_history      Float
+  suspicious_messaging Float
+  contract_breach      Float
+  decision             String?
+  signals              Json?
+  created_at           DateTime @default(now())
+
+  @@index([user_id, created_at])
+  @@map("trust_risk_evaluations")
+}
+
+model GovernanceEnforcement {
+  id                   String   @id
+  user_id              String
+  evaluation_id        String?
+  policy_definition_id String?
+  policy_version_id    String?
+  action               String
+  reason               String?
+  status               String   @default("applied")
+  metadata             Json?
+  expires_at           DateTime?
+  created_by           String?
+  created_at           DateTime @default(now())
+  updated_at           DateTime?
+
+  @@index([user_id, created_at])
+  @@index([action, created_at])
+  @@map("governance_enforcements")
+}
+
+model GovernanceManualReviewQueue {
+  id             String   @id
+  enforcement_id String?
+  user_id        String
+  status         String   @default("open")
+  priority       String   @default("normal")
+  reason         String?
+  payload        Json?
+  assigned_to    String?
+  resolved_at    DateTime?
+  created_at     DateTime @default(now())
+  updated_at     DateTime?
+
+  @@index([status, priority])
+  @@index([user_id, created_at])
+  @@map("governance_manual_review_queue")
+}
+
+model GovernanceNotificationTemplate {
+  id           String   @id
+  template_key String   @unique
+  channel      String   @default("in_app")
+  subject      String
+  body         String
+  active       Boolean  @default(true)
+  created_by   String?
+  created_at   DateTime @default(now())
+  updated_at   DateTime?
+
+  @@map("governance_notification_templates")
+}
+
+model GovernanceAppeal {
+  id             String   @id
+  enforcement_id String
+  user_id        String
+  status         String   @default("submitted")
+  reason         String
+  outcome        String?
+  outcome_notes  String?
+  reviewed_by    String?
+  reviewed_at    DateTime?
+  created_at     DateTime @default(now())
+  updated_at     DateTime?
+
+  @@index([enforcement_id, status])
+  @@index([user_id, created_at])
+  @@map("governance_appeals")
+}
+
+model GovernanceMonthlyReport {
+  id         String   @id
+  month      String   @unique
+  metrics    Json
+  created_by String?
+  created_at DateTime @default(now())
+
+  @@map("governance_monthly_reports")
+}
diff --git a/server/controllers/governanceController.js b/server/controllers/governanceController.js
new file mode 100644
index 0000000..b4e4e67
--- /dev/null
+++ b/server/controllers/governanceController.js
@@ -0,0 +1,137 @@
+import {
+  createPolicyVersion,
+  listPolicyRegistry,
+  simulatePolicy,
+  upsertPolicyDefinition,
+} from '../services/policyRegistryService.js'
+import { computeTrustRiskSignals, recordTrustRiskEvaluation } from '../services/trustRiskScoringService.js'
+import {
+  applyEnforcement,
+  buildMonthlyGovernanceReport,
+  fileGovernanceAppeal,
+  listEnforcementHistory,
+  listGovernanceTemplates,
+  resolveGovernanceAppeal,
+  saveNotificationTemplate,
+} from '../services/enforcementService.js'
+import { handleControllerError } from '../utils/permissions.js'
+
+export async function listGovernancePoliciesController(req, res) {
+  try {
+    const items = await listPolicyRegistry()
+    return res.json({ items })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function upsertGovernancePolicyController(req, res) {
+  try {
+    const item = await upsertPolicyDefinition({ ...req.body, actorId: req.user?.id || null })
+    return res.json({ item })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function createGovernancePolicyVersionController(req, res) {
+  try {
+    const item = await createPolicyVersion({ ...req.body, actorId: req.user?.id || null })
+    return res.json({ item })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function simulateGovernancePolicyController(req, res) {
+  try {
+    const result = await simulatePolicy(req.body || {})
+    return res.json(result)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function trustSignalsController(req, res) {
+  try {
+    const userId = String(req.query?.user_id || req.body?.user_id || '')
+    const result = await computeTrustRiskSignals({ userId })
+    return res.json(result)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function evaluateTrustController(req, res) {
+  try {
+    const userId = String(req.body?.user_id || '')
+    const decision = req.body?.decision ? String(req.body.decision) : null
+    const result = await recordTrustRiskEvaluation({ userId, decision })
+    return res.json(result)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function applyGovernanceEnforcementController(req, res) {
+  try {
+    const result = await applyEnforcement({ ...req.body, actorId: req.user?.id || null })
+    return res.json(result)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function listGovernanceEnforcementHistoryController(req, res) {
+  try {
+    const items = await listEnforcementHistory({ limit: Number(req.query?.limit || 100) })
+    return res.json({ items })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function saveGovernanceTemplateController(req, res) {
+  try {
+    const item = await saveNotificationTemplate({ ...req.body, actorId: req.user?.id || null })
+    return res.json({ item })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function listGovernanceTemplateController(req, res) {
+  try {
+    const items = await listGovernanceTemplates()
+    return res.json({ items })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function fileGovernanceAppealController(req, res) {
+  try {
+    const item = await fileGovernanceAppeal(req.body || {})
+    return res.json({ item })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function resolveGovernanceAppealController(req, res) {
+  try {
+    const item = await resolveGovernanceAppeal({ ...req.body, actorId: req.user?.id || null })
+    return res.json({ item })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function generateGovernanceMonthlyReportController(req, res) {
+  try {
+    const item = await buildMonthlyGovernanceReport({ month: req.body?.month, actorId: req.user?.id || null })
+    return res.json({ item })
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
diff --git a/server/routes/adminRoutes.js b/server/routes/adminRoutes.js
index b7403ea..80a2d7d 100644
--- a/server/routes/adminRoutes.js
+++ b/server/routes/adminRoutes.js
@@ -62,6 +62,21 @@ import {
   listWalletLedgerAdmin,
   listWalletHistoryAdmin,
 } from '../controllers/adminOpsController.js'
+import {
+  applyGovernanceEnforcementController,
+  createGovernancePolicyVersionController,
+  evaluateTrustController,
+  fileGovernanceAppealController,
+  generateGovernanceMonthlyReportController,
+  listGovernanceEnforcementHistoryController,
+  listGovernancePoliciesController,
+  listGovernanceTemplateController,
+  resolveGovernanceAppealController,
+  saveGovernanceTemplateController,
+  simulateGovernancePolicyController,
+  trustSignalsController,
+  upsertGovernancePolicyController,
+} from '../controllers/governanceController.js'

 const router = Router()

@@ -123,6 +138,20 @@ router.get('/integrations/opensearch/status', requireAuth, requireAdminSecurity,
 router.get('/integrations/email/status', requireAuth, requireAdminSecurity, adminAuditLogger(), integrationEmailStatusController)
 router.post('/integrations/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), integrationActionController)

+router.get('/governance/policies', requireAuth, requireAdminSecurity, adminAuditLogger(), listGovernancePoliciesController)
+router.post('/governance/policies', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), upsertGovernancePolicyController)
+router.post('/governance/policy-versions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), createGovernancePolicyVersionController)
+router.post('/governance/simulate', requireAuth, requireAdminSecurity, adminAuditLogger(), simulateGovernancePolicyController)
+router.get('/governance/trust/signals', requireAuth, requireAdminSecurity, adminAuditLogger(), trustSignalsController)
+router.post('/governance/trust/evaluate', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), evaluateTrustController)
+router.post('/governance/enforcement/apply', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), applyGovernanceEnforcementController)
+router.get('/governance/enforcement/history', requireAuth, requireAdminSecurity, adminAuditLogger(), listGovernanceEnforcementHistoryController)
+router.get('/governance/templates', requireAuth, requireAdminSecurity, adminAuditLogger(), listGovernanceTemplateController)
+router.post('/governance/templates', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), saveGovernanceTemplateController)
+router.post('/governance/appeals', requireAuth, adminAuditLogger(), fileGovernanceAppealController)
+router.post('/governance/appeals/resolve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), resolveGovernanceAppealController)
+router.post('/governance/reports/monthly', requireAuth, requireAdminSecurity, adminAuditLogger(), generateGovernanceMonthlyReportController)
+
 router.get('/master', requireAuth, requireAdminSecurity, adminAuditLogger(), adminMasterOverviewController)
 router.post('/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger({
   actionResolver: (req) => String(req.body?.action || 'admin.action'),
diff --git a/server/services/enforcementService.js b/server/services/enforcementService.js
new file mode 100644
index 0000000..f3912dd
--- /dev/null
+++ b/server/services/enforcementService.js
@@ -0,0 +1,285 @@
+import crypto from 'crypto'
+import prisma from '../utils/prisma.js'
+import { createNotification } from './notificationService.js'
+
+const ENFORCEMENT_ACTIONS = Object.freeze({
+  SOFT_WARNING: 'soft_warning',
+  TEMP_COMMUNICATION_THROTTLE: 'temporary_communication_throttle',
+  FEATURE_LOCK: 'feature_lock',
+  MANUAL_REVIEW_QUEUE: 'manual_review_queue',
+})
+
+function actionForScore(score) {
+  const trust = Number(score || 0)
+  if (trust >= 75) return ENFORCEMENT_ACTIONS.SOFT_WARNING
+  if (trust >= 50) return ENFORCEMENT_ACTIONS.TEMP_COMMUNICATION_THROTTLE
+  if (trust >= 25) return ENFORCEMENT_ACTIONS.FEATURE_LOCK
+  return ENFORCEMENT_ACTIONS.MANUAL_REVIEW_QUEUE
+}
+
+function renderTemplate(template, context = {}) {
+  return String(template || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
+    const value = context[key]
+    return value == null ? '' : String(value)
+  })
+}
+
+async function getTemplate(templateKey, fallback) {
+  const template = await prisma.governanceNotificationTemplate.findUnique({ where: { template_key: templateKey } })
+  return template?.active ? template : fallback
+}
+
+export async function applyEnforcement({ userId, evaluationId = null, policyDefinitionId = null, policyVersionId = null, actorId = null, reason = '' }) {
+  const latestEval = evaluationId
+    ? await prisma.trustRiskEvaluation.findUnique({ where: { id: evaluationId } })
+    : await prisma.trustRiskEvaluation.findFirst({ where: { user_id: userId }, orderBy: { created_at: 'desc' } })
+
+  if (!latestEval) {
+    const error = new Error('No trust evaluation found for user')
+    error.status = 404
+    throw error
+  }
+
+  const action = actionForScore(latestEval.trust_score)
+  const now = new Date()
+  const expiresAt = action === ENFORCEMENT_ACTIONS.TEMP_COMMUNICATION_THROTTLE
+    ? new Date(now.getTime() + (6 * 60 * 60 * 1000))
+    : null
+
+  const enforcement = await prisma.governanceEnforcement.create({
+    data: {
+      id: crypto.randomUUID(),
+      user_id: String(userId),
+      evaluation_id: latestEval.id,
+      policy_definition_id: policyDefinitionId,
+      policy_version_id: policyVersionId,
+      action,
+      reason: String(reason || 'Automated trust governance decision'),
+      expires_at: expiresAt,
+      created_by: actorId,
+      metadata: {
+        trust_score: latestEval.trust_score,
+        signals: latestEval.signals || null,
+      },
+    },
+  })
+
+  if (action === ENFORCEMENT_ACTIONS.TEMP_COMMUNICATION_THROTTLE) {
+    await prisma.user.update({
+      where: { id: String(userId) },
+      data: {
+        messaging_restricted_until: expiresAt,
+      },
+    }).catch(() => null)
+  }
+
+  if (action === ENFORCEMENT_ACTIONS.FEATURE_LOCK) {
+    await prisma.user.update({
+      where: { id: String(userId) },
+      data: {
+        status: 'restricted',
+      },
+    }).catch(() => null)
+  }
+
+  if (action === ENFORCEMENT_ACTIONS.MANUAL_REVIEW_QUEUE) {
+    await prisma.governanceManualReviewQueue.create({
+      data: {
+        id: crypto.randomUUID(),
+        enforcement_id: enforcement.id,
+        user_id: String(userId),
+        reason: enforcement.reason,
+        priority: 'high',
+        payload: {
+          trust_score: latestEval.trust_score,
+          signals: latestEval.signals || {},
+        },
+      },
+    })
+  }
+
+  const fallback = {
+    subject: 'Trust governance update',
+    body: 'Action {{action}} was applied to your account. You can appeal this decision from support.',
+  }
+  const template = await getTemplate('trust_decision_notice', fallback)
+  await createNotification(String(userId), {
+    type: 'trust_governance_decision',
+    entity_type: 'governance_enforcement',
+    entity_id: enforcement.id,
+    message: renderTemplate(template.body, { action }),
+    meta: {
+      action,
+      trust_score: latestEval.trust_score,
+    },
+  })
+
+  return enforcement
+}
+
+export async function saveNotificationTemplate({ templateKey, subject, body, channel = 'in_app', actorId = null }) {
+  const key = String(templateKey || '').trim()
+  if (!key || !String(subject || '').trim() || !String(body || '').trim()) {
+    const error = new Error('templateKey, subject and body are required')
+    error.status = 400
+    throw error
+  }
+
+  const existing = await prisma.governanceNotificationTemplate.findUnique({ where: { template_key: key } })
+  if (existing) {
+    return prisma.governanceNotificationTemplate.update({
+      where: { id: existing.id },
+      data: {
+        channel: String(channel || 'in_app'),
+        subject: String(subject),
+        body: String(body),
+        updated_at: new Date(),
+      },
+    })
+  }
+
+  return prisma.governanceNotificationTemplate.create({
+    data: {
+      id: crypto.randomUUID(),
+      template_key: key,
+      channel: String(channel || 'in_app'),
+      subject: String(subject),
+      body: String(body),
+      created_by: actorId,
+    },
+  })
+}
+
+export async function fileGovernanceAppeal({ enforcementId, userId, reason }) {
+  if (!String(enforcementId || '').trim() || !String(userId || '').trim() || !String(reason || '').trim()) {
+    const error = new Error('enforcementId, userId and reason are required')
+    error.status = 400
+    throw error
+  }
+
+  const appeal = await prisma.governanceAppeal.create({
+    data: {
+      id: crypto.randomUUID(),
+      enforcement_id: String(enforcementId),
+      user_id: String(userId),
+      reason: String(reason),
+    },
+  })
+
+  const fallback = {
+    subject: 'Appeal received',
+    body: 'Your appeal for enforcement {{enforcement_id}} has been submitted.',
+  }
+  const template = await getTemplate('trust_appeal_received', fallback)
+  await createNotification(String(userId), {
+    type: 'trust_appeal_received',
+    entity_type: 'governance_appeal',
+    entity_id: appeal.id,
+    message: renderTemplate(template.body, { enforcement_id: enforcementId }),
+  })
+
+  return appeal
+}
+
+export async function resolveGovernanceAppeal({ appealId, outcome, notes = '', actorId = null }) {
+  const updated = await prisma.governanceAppeal.update({
+    where: { id: String(appealId || '') },
+    data: {
+      status: 'resolved',
+      outcome: String(outcome || 'upheld'),
+      outcome_notes: String(notes || ''),
+      reviewed_by: actorId,
+      reviewed_at: new Date(),
+      updated_at: new Date(),
+    },
+  })
+
+  await createNotification(String(updated.user_id), {
+    type: 'trust_appeal_resolved',
+    entity_type: 'governance_appeal',
+    entity_id: updated.id,
+    message: `Your trust appeal has been resolved with outcome: ${updated.outcome}.`,
+    meta: {
+      outcome: updated.outcome,
+      notes: updated.outcome_notes,
+    },
+  })
+
+  return updated
+}
+
+export async function buildMonthlyGovernanceReport({ month, actorId = null }) {
+  const monthValue = String(month || '').trim() || new Date().toISOString().slice(0, 7)
+  const start = new Date(`${monthValue}-01T00:00:00.000Z`)
+  const end = new Date(start)
+  end.setUTCMonth(end.getUTCMonth() + 1)
+
+  const [enforcements, evaluations, appeals] = await Promise.all([
+    prisma.governanceEnforcement.findMany({ where: { created_at: { gte: start, lt: end } } }),
+    prisma.trustRiskEvaluation.findMany({ where: { created_at: { gte: start, lt: end } } }),
+    prisma.governanceAppeal.findMany({ where: { created_at: { gte: start, lt: end } } }),
+  ])
+
+  const total = enforcements.length
+  const manualReviews = enforcements.filter((row) => row.action === ENFORCEMENT_ACTIONS.MANUAL_REVIEW_QUEUE).length
+  const falsePositives = enforcements.filter((row) => String(row.status || '').toLowerCase() === 'reverted').length
+  const appealOverturned = appeals.filter((row) => String(row.outcome || '').toLowerCase() === 'overturned').length
+
+  const roleBuckets = evaluations.reduce((acc, row) => {
+    const role = String(row.role || 'unknown')
+    const current = acc[role] || { count: 0, totalScore: 0 }
+    current.count += 1
+    current.totalScore += Number(row.trust_score || 0)
+    acc[role] = current
+    return acc
+  }, {})
+
+  const trustScoreDriftByRole = Object.entries(roleBuckets).map(([role, value]) => ({
+    role,
+    average_trust_score: value.count ? Number((value.totalScore / value.count).toFixed(2)) : 0,
+    evaluations: value.count,
+  }))
+
+  const metrics = {
+    month: monthValue,
+    policy_hit_rates: {
+      total_enforcements: total,
+      manual_review_rate: total ? Number((manualReviews / total).toFixed(4)) : 0,
+    },
+    false_positives: {
+      reverted_actions: falsePositives,
+      rate: total ? Number((falsePositives / total).toFixed(4)) : 0,
+    },
+    appeal_outcomes: {
+      submitted: appeals.length,
+      overturned: appealOverturned,
+      uphold_rate: appeals.length ? Number(((appeals.length - appealOverturned) / appeals.length).toFixed(4)) : 0,
+    },
+    trust_score_drift_by_role: trustScoreDriftByRole,
+  }
+
+  return prisma.governanceMonthlyReport.upsert({
+    where: { month: monthValue },
+    create: {
+      id: crypto.randomUUID(),
+      month: monthValue,
+      metrics,
+      created_by: actorId,
+    },
+    update: {
+      metrics,
+      created_by: actorId,
+    },
+  })
+}
+
+export async function listEnforcementHistory({ limit = 100 }) {
+  return prisma.governanceEnforcement.findMany({
+    orderBy: { created_at: 'desc' },
+    take: Math.max(1, Math.min(500, Number(limit) || 100)),
+  })
+}
+
+export async function listGovernanceTemplates() {
+  return prisma.governanceNotificationTemplate.findMany({ orderBy: { created_at: 'desc' } })
+}
diff --git a/server/services/policyRegistryService.js b/server/services/policyRegistryService.js
new file mode 100644
index 0000000..2d26bf7
--- /dev/null
+++ b/server/services/policyRegistryService.js
@@ -0,0 +1,143 @@
+import crypto from 'crypto'
+import prisma from '../utils/prisma.js'
+
+function normalizeScopes(scopes = {}) {
+  const role = Array.isArray(scopes?.role) ? scopes.role : []
+  const plan = Array.isArray(scopes?.plan) ? scopes.plan : []
+  const region = Array.isArray(scopes?.region) ? scopes.region : []
+  return {
+    role: [...new Set(role.map((v) => String(v || '').trim()).filter(Boolean))],
+    plan: [...new Set(plan.map((v) => String(v || '').trim()).filter(Boolean))],
+    region: [...new Set(region.map((v) => String(v || '').trim()).filter(Boolean))],
+  }
+}
+
+export async function upsertPolicyDefinition({ code, name, description = '', actorId }) {
+  const normalizedCode = String(code || '').trim().toLowerCase()
+  if (!normalizedCode || !String(name || '').trim()) {
+    const error = new Error('code and name are required')
+    error.status = 400
+    throw error
+  }
+
+  const existing = await prisma.policyDefinition.findUnique({ where: { code: normalizedCode } })
+  if (existing) {
+    return prisma.policyDefinition.update({
+      where: { id: existing.id },
+      data: {
+        name: String(name).trim(),
+        description: String(description || '').trim(),
+        updated_at: new Date(),
+      },
+    })
+  }
+
+  return prisma.policyDefinition.create({
+    data: {
+      id: crypto.randomUUID(),
+      code: normalizedCode,
+      name: String(name).trim(),
+      description: String(description || '').trim(),
+      created_by: actorId || null,
+    },
+  })
+}
+
+export async function createPolicyVersion({ policyId, status = 'draft', effectiveFrom, effectiveTo = null, rules = {}, scopes = {}, actorId }) {
+  const policy = await prisma.policyDefinition.findUnique({ where: { id: String(policyId || '') } })
+  if (!policy) {
+    const error = new Error('policy definition not found')
+    error.status = 404
+    throw error
+  }
+
+  const last = await prisma.policyVersion.findFirst({
+    where: { policy_definition_id: policy.id },
+    orderBy: { version: 'desc' },
+  })
+
+  const nextVersion = (last?.version || 0) + 1
+  const normalizedScopes = normalizeScopes(scopes)
+
+  const created = await prisma.policyVersion.create({
+    data: {
+      id: crypto.randomUUID(),
+      policy_definition_id: policy.id,
+      version: nextVersion,
+      status: String(status || 'draft').toLowerCase(),
+      effective_from: effectiveFrom ? new Date(effectiveFrom) : new Date(),
+      effective_to: effectiveTo ? new Date(effectiveTo) : null,
+      rules: rules && typeof rules === 'object' ? rules : {},
+      created_by: actorId || null,
+      scopes: {
+        create: [
+          ...normalizedScopes.role.map((value) => ({ id: crypto.randomUUID(), scope_type: 'role', scope_value: value })),
+          ...normalizedScopes.plan.map((value) => ({ id: crypto.randomUUID(), scope_type: 'plan', scope_value: value })),
+          ...normalizedScopes.region.map((value) => ({ id: crypto.randomUUID(), scope_type: 'region', scope_value: value })),
+        ],
+      },
+    },
+    include: { scopes: true },
+  })
+
+  return created
+}
+
+export async function listPolicyRegistry() {
+  return prisma.policyDefinition.findMany({
+    orderBy: { created_at: 'desc' },
+    include: {
+      versions: {
+        orderBy: { version: 'desc' },
+        include: { scopes: true },
+      },
+    },
+  })
+}
+
+export async function simulatePolicy({ policyVersionId, actor = {} }) {
+  const version = await prisma.policyVersion.findUnique({
+    where: { id: String(policyVersionId || '') },
+    include: { scopes: true, policy: true },
+  })
+  if (!version) {
+    const error = new Error('policy version not found')
+    error.status = 404
+    throw error
+  }
+
+  const role = String(actor.role || '').toLowerCase()
+  const plan = String(actor.plan || '').toLowerCase()
+  const region = String(actor.region || '').toLowerCase()
+
+  const roleScopes = version.scopes.filter((s) => s.scope_type === 'role').map((s) => s.scope_value.toLowerCase())
+  const planScopes = version.scopes.filter((s) => s.scope_type === 'plan').map((s) => s.scope_value.toLowerCase())
+  const regionScopes = version.scopes.filter((s) => s.scope_type === 'region').map((s) => s.scope_value.toLowerCase())
+
+  const roleHit = roleScopes.length === 0 || roleScopes.includes(role)
+  const planHit = planScopes.length === 0 || planScopes.includes(plan)
+  const regionHit = regionScopes.length === 0 || regionScopes.includes(region)
+
+  return {
+    policy: {
+      id: version.policy.id,
+      code: version.policy.code,
+      name: version.policy.name,
+    },
+    version: {
+      id: version.id,
+      version: version.version,
+      status: version.status,
+      effective_from: version.effective_from,
+      effective_to: version.effective_to,
+      rules: version.rules || {},
+    },
+    actor: { role, plan, region },
+    matched: roleHit && planHit && regionHit,
+    checks: {
+      role: roleHit,
+      plan: planHit,
+      region: regionHit,
+    },
+  }
+}
diff --git a/server/services/trustRiskScoringService.js b/server/services/trustRiskScoringService.js
new file mode 100644
index 0000000..5ebf3a2
--- /dev/null
+++ b/server/services/trustRiskScoringService.js
@@ -0,0 +1,110 @@
+import crypto from 'crypto'
+import prisma from '../utils/prisma.js'
+
+const MAX_SIGNAL = 100
+
+function clamp(value, min = 0, max = MAX_SIGNAL) {
+  const num = Number(value)
+  if (!Number.isFinite(num)) return min
+  return Math.max(min, Math.min(max, num))
+}
+
+function daysSince(value) {
+  if (!value) return null
+  const ts = new Date(value).getTime()
+  if (!Number.isFinite(ts)) return null
+  return Math.max(0, Math.floor((Date.now() - ts) / (24 * 60 * 60 * 1000)))
+}
+
+export async function computeTrustRiskSignals({ userId }) {
+  const id = String(userId || '').trim()
+  if (!id) {
+    const error = new Error('userId is required')
+    error.status = 400
+    throw error
+  }
+
+  const [user, verification, disputes, suspiciousMessages, breaches] = await Promise.all([
+    prisma.user.findUnique({ where: { id } }),
+    prisma.verification.findUnique({ where: { user_id: id } }),
+    prisma.report.findMany({
+      where: {
+        actor_id: id,
+        entity_type: 'dispute',
+      },
+      orderBy: { created_at: 'desc' },
+      take: 36,
+    }),
+    prisma.messagePolicyDecision.findMany({
+      where: {
+        sender_id: id,
+        OR: [
+          { action: 'block' },
+          { requires_human_review: true },
+        ],
+      },
+      orderBy: { created_at: 'desc' },
+      take: 100,
+    }),
+    prisma.report.findMany({
+      where: {
+        actor_id: id,
+        entity_type: 'contract',
+        OR: [
+          { resolution_action: { contains: 'breach' } },
+          { reason: { contains: 'breach' } },
+        ],
+      },
+      orderBy: { created_at: 'desc' },
+      take: 24,
+    }),
+  ])
+
+  const verificationDays = daysSince(verification?.verified_at)
+  const verificationRecency = verificationDays == null
+    ? 100
+    : clamp(Math.round((verificationDays / 180) * 100))
+
+  const disputeHistory = clamp(disputes.length * 15)
+  const suspiciousMessaging = clamp(suspiciousMessages.length * 8)
+  const contractBreach = clamp(breaches.length * 30)
+
+  const trustScore = clamp(100 - (
+    verificationRecency * 0.25 +
+    disputeHistory * 0.25 +
+    suspiciousMessaging * 0.30 +
+    contractBreach * 0.20
+  ))
+
+  return {
+    user_id: id,
+    role: user?.role || null,
+    trust_score: Number(trustScore.toFixed(2)),
+    signals: {
+      verification_recency: verificationRecency,
+      dispute_history: disputeHistory,
+      suspicious_messaging_behavior: suspiciousMessaging,
+      contract_breach_flags: contractBreach,
+    },
+  }
+}
+
+export async function recordTrustRiskEvaluation({ userId, decision = null }) {
+  const computed = await computeTrustRiskSignals({ userId })
+  const created = await prisma.trustRiskEvaluation.create({
+    data: {
+      id: crypto.randomUUID(),
+      user_id: computed.user_id,
+      role: computed.role,
+      trust_score: computed.trust_score,
+      verification_recency: computed.signals.verification_recency,
+      dispute_history: computed.signals.dispute_history,
+      suspicious_messaging: computed.signals.suspicious_messaging_behavior,
+      contract_breach: computed.signals.contract_breach_flags,
+      decision,
+      signals: computed.signals,
+    },
+  })
+
+  return created
+}
diff --git a/src/App.jsx b/src/App.jsx
index 0782c92..f8b5639 100644
--- a/src/App.jsx
+++ b/src/App.jsx
@@ -33,6 +33,7 @@ import IndustryPage from './pages/IndustryPage'
 import RatingFeedback from './pages/RatingFeedback'
 import SupportReports from './pages/SupportReports'
 import AdminPanel from './pages/AdminPanel'
+import AdminGovernance from './pages/AdminGovernance'
 import FloatingAssistant from './components/FloatingAssistant'
 import Footer from './components/Footer'
 import AccessDenied from './pages/AccessDenied'
@@ -99,6 +100,7 @@ function AppRoutes() {
       <Route path="/owner" element={<ProtectedRoute roles={OWNER_ROLES}><OwnerDashboard /></ProtectedRoute>} />
       <Route path="/agent" element={<ProtectedRoute roles={['buying_house', 'owner', 'admin', 'agent']}><AgentDashboard /></ProtectedRoute>} />
       <Route path="/admin" element={<ProtectedRoute roles={['owner', 'admin']}><AdminPanel /></ProtectedRoute>} />
+      <Route path="/admin/governance" element={<ProtectedRoute roles={['owner', 'admin']}><AdminGovernance /></ProtectedRoute>} />

       <Route path="/mvp" element={<MvpDashboard />} />
       <Route path="*" element={<Navigate to="/" replace />} />
diff --git a/src/pages/AdminGovernance.jsx b/src/pages/AdminGovernance.jsx
new file mode 100644
index 0000000..df2009a
--- /dev/null
+++ b/src/pages/AdminGovernance.jsx
@@ -0,0 +1,214 @@
+import React, { useEffect, useState } from 'react'
+import { apiRequest } from '../lib/auth'
+
+const initialPolicy = { code: '', name: '', description: '' }
+const initialVersion = { policyId: '', status: 'active', effectiveFrom: '', roleScopes: '', planScopes: '', regionScopes: '', rulesJson: '{"maxWarnings":1}' }
+const initialSimulation = { policyVersionId: '', role: '', plan: '', region: '' }
+const initialTemplate = { templateKey: 'trust_decision_notice', channel: 'in_app', subject: 'Trust decision update', body: 'Action {{action}} was applied to your account.' }
+
+function splitCsv(value) {
+  return String(value || '').split(',').map((part) => part.trim()).filter(Boolean)
+}
+
+export default function AdminGovernance() {
+  const [policy, setPolicy] = useState(initialPolicy)
+  const [version, setVersion] = useState(initialVersion)
+  const [simulation, setSimulation] = useState(initialSimulation)
+  const [userId, setUserId] = useState('')
+  const [trustSignals, setTrustSignals] = useState(null)
+  const [policies, setPolicies] = useState([])
+  const [history, setHistory] = useState([])
+  const [simulationResult, setSimulationResult] = useState(null)
+  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7))
+  const [monthlyReport, setMonthlyReport] = useState(null)
+  const [templates, setTemplates] = useState([])
+  const [status, setStatus] = useState('')
+
+  const load = async () => {
+    const [policyRes, historyRes, templatesRes] = await Promise.all([
+      apiRequest('/admin/governance/policies'),
+      apiRequest('/admin/governance/enforcement/history?limit=50'),
+      apiRequest('/admin/governance/templates'),
+    ])
+    setPolicies(policyRes?.items || [])
+    setHistory(historyRes?.items || [])
+    setTemplates(templatesRes?.items || [])
+  }
+
+  useEffect(() => {
+    let active = true
+    const run = async () => {
+      try {
+        await load()
+      } catch {
+        if (active) setStatus('Failed to load governance data')
+      }
+    }
+    run()
+    return () => {
+      active = false
+    }
+  }, [])
+
+  const savePolicy = async () => {
+    await apiRequest('/admin/governance/policies', {
+      method: 'POST',
+      body: policy,
+    })
+    setPolicy(initialPolicy)
+    setStatus('Policy saved')
+    await load()
+  }
+
+  const createVersion = async () => {
+    const rules = JSON.parse(version.rulesJson || '{}')
+    await apiRequest('/admin/governance/policy-versions', {
+      method: 'POST',
+      body: {
+        policyId: version.policyId,
+        status: version.status,
+        effectiveFrom: version.effectiveFrom || new Date().toISOString(),
+        rules,
+        scopes: {
+          role: splitCsv(version.roleScopes),
+          plan: splitCsv(version.planScopes),
+          region: splitCsv(version.regionScopes),
+        },
+      },
+    })
+    setStatus('Policy version created')
+    await load()
+  }
+
+  const simulate = async () => {
+    const result = await apiRequest('/admin/governance/simulate', {
+      method: 'POST',
+      body: {
+        policyVersionId: simulation.policyVersionId,
+        actor: {
+          role: simulation.role,
+          plan: simulation.plan,
+          region: simulation.region,
+        },
+      },
+    })
+    setSimulationResult(result)
+  }
+
+  const evaluateRisk = async () => {
+    if (!userId) return
+    const signals = await apiRequest(`/admin/governance/trust/signals?user_id=${encodeURIComponent(userId)}`)
+    setTrustSignals(signals)
+    const evalRow = await apiRequest('/admin/governance/trust/evaluate', {
+      method: 'POST',
+      body: { user_id: userId, decision: 'auto_evaluated' },
+    })
+    await apiRequest('/admin/governance/enforcement/apply', {
+      method: 'POST',
+      body: {
+        userId,
+        evaluationId: evalRow?.id,
+        reason: 'Automated governance review from admin panel',
+      },
+    })
+    setStatus('Trust evaluated and enforcement decision applied')
+    await load()
+  }
+
+  const saveTemplate = async () => {
+    await apiRequest('/admin/governance/templates', {
+      method: 'POST',
+      body: initialTemplate,
+    })
+    setStatus('Template saved')
+    await load()
+  }
+
+  const generateReport = async () => {
+    const result = await apiRequest('/admin/governance/reports/monthly', {
+      method: 'POST',
+      body: { month: reportMonth },
+    })
+    setMonthlyReport(result?.item || null)
+  }
+
+  return (
+    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
+      <div className="mx-auto max-w-6xl space-y-6">
+        <h1 className="text-3xl font-semibold">Admin Governance Console</h1>
+        {status ? <p className="rounded border border-emerald-400/40 bg-emerald-500/10 p-2 text-sm">{status}</p> : null}
+
+        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
+          <h2 className="text-lg font-semibold">Policy Editor</h2>
+          <div className="mt-3 grid gap-2 md:grid-cols-3">
+            <input className="rounded bg-slate-800 p-2" placeholder="Code" value={policy.code} onChange={(e) => setPolicy((p) => ({ ...p, code: e.target.value }))} />
+            <input className="rounded bg-slate-800 p-2" placeholder="Name" value={policy.name} onChange={(e) => setPolicy((p) => ({ ...p, name: e.target.value }))} />
+            <input className="rounded bg-slate-800 p-2" placeholder="Description" value={policy.description} onChange={(e) => setPolicy((p) => ({ ...p, description: e.target.value }))} />
+          </div>
+          <button className="mt-3 rounded bg-indigo-600 px-3 py-2 text-sm" onClick={savePolicy}>Save policy</button>
+
+          <div className="mt-4 grid gap-2 md:grid-cols-2">
+            <select className="rounded bg-slate-800 p-2" value={version.policyId} onChange={(e) => setVersion((p) => ({ ...p, policyId: e.target.value }))}>
+              <option value="">Select policy</option>
+              {policies.map((item) => <option value={item.id} key={item.id}>{item.code}</option>)}
+            </select>
+            <input className="rounded bg-slate-800 p-2" type="datetime-local" value={version.effectiveFrom} onChange={(e) => setVersion((p) => ({ ...p, effectiveFrom: e.target.value }))} />
+            <input className="rounded bg-slate-800 p-2" placeholder="Role scopes (csv)" value={version.roleScopes} onChange={(e) => setVersion((p) => ({ ...p, roleScopes: e.target.value }))} />
+            <input className="rounded bg-slate-800 p-2" placeholder="Plan scopes (csv)" value={version.planScopes} onChange={(e) => setVersion((p) => ({ ...p, planScopes: e.target.value }))} />
+            <input className="rounded bg-slate-800 p-2" placeholder="Region scopes (csv)" value={version.regionScopes} onChange={(e) => setVersion((p) => ({ ...p, regionScopes: e.target.value }))} />
+            <textarea className="rounded bg-slate-800 p-2" rows={3} placeholder="Rules JSON" value={version.rulesJson} onChange={(e) => setVersion((p) => ({ ...p, rulesJson: e.target.value }))} />
+          </div>
+          <button className="mt-3 rounded bg-indigo-600 px-3 py-2 text-sm" onClick={createVersion}>Create policy version</button>
+        </section>
+
+        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
+          <h2 className="text-lg font-semibold">Rule Simulation</h2>
+          <div className="mt-3 grid gap-2 md:grid-cols-4">
+            <input className="rounded bg-slate-800 p-2" placeholder="Policy version id" value={simulation.policyVersionId} onChange={(e) => setSimulation((p) => ({ ...p, policyVersionId: e.target.value }))} />
+            <input className="rounded bg-slate-800 p-2" placeholder="Role" value={simulation.role} onChange={(e) => setSimulation((p) => ({ ...p, role: e.target.value }))} />
+            <input className="rounded bg-slate-800 p-2" placeholder="Plan" value={simulation.plan} onChange={(e) => setSimulation((p) => ({ ...p, plan: e.target.value }))} />
+            <input className="rounded bg-slate-800 p-2" placeholder="Region" value={simulation.region} onChange={(e) => setSimulation((p) => ({ ...p, region: e.target.value }))} />
+          </div>
+          <button className="mt-3 rounded bg-violet-600 px-3 py-2 text-sm" onClick={simulate}>Run simulation</button>
+          {simulationResult ? <pre className="mt-3 overflow-auto rounded bg-slate-950 p-2 text-xs">{JSON.stringify(simulationResult, null, 2)}</pre> : null}
+        </section>
+
+        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
+          <h2 className="text-lg font-semibold">Trust Risk & Enforcement</h2>
+          <div className="mt-3 flex gap-2">
+            <input className="flex-1 rounded bg-slate-800 p-2" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
+            <button className="rounded bg-amber-600 px-3 py-2 text-sm" onClick={evaluateRisk}>Evaluate + enforce</button>
+          </div>
+          {trustSignals ? <pre className="mt-3 overflow-auto rounded bg-slate-950 p-2 text-xs">{JSON.stringify(trustSignals, null, 2)}</pre> : null}
+        </section>
+
+        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
+          <h2 className="text-lg font-semibold">Enforcement History Viewer</h2>
+          <div className="mt-3 space-y-2">
+            {history.map((item) => (
+              <div key={item.id} className="rounded border border-slate-800 p-2 text-sm">
+                <div className="font-medium">{item.action} • {item.user_id}</div>
+                <div className="text-slate-400">{item.reason || 'No reason'} • {new Date(item.created_at).toLocaleString()}</div>
+              </div>
+            ))}
+          </div>
+        </section>
+
+        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
+          <h2 className="text-lg font-semibold">Notification Templates & Appeal Workflow</h2>
+          <button className="mt-2 rounded bg-fuchsia-600 px-3 py-2 text-sm" onClick={saveTemplate}>Save trust templates</button>
+          <pre className="mt-3 overflow-auto rounded bg-slate-950 p-2 text-xs">{JSON.stringify(templates, null, 2)}</pre>
+        </section>
+
+        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
+          <h2 className="text-lg font-semibold">Monthly Governance Reporting</h2>
+          <div className="mt-2 flex gap-2">
+            <input className="rounded bg-slate-800 p-2" type="month" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} />
+            <button className="rounded bg-emerald-600 px-3 py-2 text-sm" onClick={generateReport}>Generate report</button>
+          </div>
+          {monthlyReport ? <pre className="mt-3 overflow-auto rounded bg-slate-950 p-2 text-xs">{JSON.stringify(monthlyReport, null, 2)}</pre> : null}
+        </section>
+      </div>
+    </div>
+  )
+}
```

## Why This Change

Merge pull request #85 from gamertoky1188gro/codex/create-governance-modules-and-features

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 9 files changed, 1181 insertions(+)
- **Risk:** Moderate

## Relationships

Commit 214 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
