## Commit Metadata
- **Hash:** 0c286b0c1ea55a3fb9451363c6c963ced744b53f
- **Parent:** 5e88171c1caf550985a6c9b6c8961ac9d81430c1
- **Author:** Cyber Code Master
- **Date:** 2026-04-06 18:52:43
- **Message:** Add workflow lifecycle domain, API, hooks, UI timeline, and e2e coverage

## Custom Title
Add workflow lifecycle domain, API, hooks, UI timeline, and e2e coverage

## High-Level Summary
Add workflow lifecycle domain, API, hooks, UI timeline, and e2e coverage

 22 files changed, 774 insertions(+), 118 deletions(-)

## File-by-File Breakdown
commit 0c286b0c1ea55a3fb9451363c6c963ced744b53f
Author: Cyber Code Master <148459541+gamertoky1188gro@users.noreply.github.com>
Date:   Mon Apr 6 18:52:43 2026 +0600

    Add workflow lifecycle domain, API, hooks, UI timeline, and e2e coverage

 .../migration.sql                                  |  32 ++
 prisma/schema.prisma                               |  36 +++
 server/controllers/productController.js            |   4 +-
 server/controllers/requirementController.js        |   4 +-
 server/controllers/workflowLifecycleController.js  |  41 +++
 server/routes/workflowLifecycleRoutes.js           |  17 +
 server/server.js                                   |  13 +
 server/services/callSessionService.js              |  14 +-
 server/services/documentService.js                 |   6 +-
 server/services/matchingService.js                 |   4 +-
 server/services/messageService.js                  |   4 +-
 server/services/workflowLifecycleService.js        | 350 +++++++++++++++++++++
 server/utils/jsonStore.js                          |   2 +
 shared/workflowLifecycle.js                        |  71 +++++
 src/components/JourneyTimeline.jsx                 |  66 ++++
 src/components/journey/JourneyTimeline.jsx         |  96 +-----
 src/pages/BuyerProfile.jsx                         |   2 +-
 src/pages/CallInterface.jsx                        |  32 +-
 src/pages/ChatInterface.jsx                        |   2 +-
 src/pages/ContractVault.jsx                        |   9 +-
 src/pages/SearchResults.jsx                        |  26 ++
 tests/e2e/workflow-lifecycle.spec.ts               |  61 ++++
 22 files changed, 774 insertions(+), 118 deletions(-)

## Detailed Diff Analysis
```diff
diff --git a/prisma/migrations/20260406120000_add_workflow_lifecycle/migration.sql b/prisma/migrations/20260406120000_add_workflow_lifecycle/migration.sql
new file mode 100644
index 0000000..72aaebb
--- /dev/null
+++ b/prisma/migrations/20260406120000_add_workflow_lifecycle/migration.sql
@@ -0,0 +1,32 @@
+CREATE TABLE IF NOT EXISTS "workflow_journeys" (
+  "id" TEXT NOT NULL,
+  "match_id" TEXT,
+  "requirement_id" TEXT,
+  "product_id" TEXT,
+  "contract_id" TEXT,
+  "current_state" TEXT NOT NULL,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3),
+  CONSTRAINT "workflow_journeys_pkey" PRIMARY KEY ("id")
+);
+
+CREATE INDEX IF NOT EXISTS "workflow_journeys_match_id_idx" ON "workflow_journeys"("match_id");
+
+CREATE TABLE IF NOT EXISTS "workflow_transitions" (
+  "id" TEXT NOT NULL,
+  "journey_id" TEXT NOT NULL,
+  "from_state" TEXT NOT NULL,
+  "to_state" TEXT NOT NULL,
+  "event_type" TEXT NOT NULL,
+  "actor_id" TEXT,
+  "source" TEXT,
+  "metadata" JSONB,
+  "accepted" BOOLEAN NOT NULL DEFAULT true,
+  "error_code" TEXT,
+  "error_message" TEXT,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  CONSTRAINT "workflow_transitions_pkey" PRIMARY KEY ("id"),
+  CONSTRAINT "workflow_transitions_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "workflow_journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE
+);
+
+CREATE INDEX IF NOT EXISTS "workflow_transitions_journey_id_created_at_idx" ON "workflow_transitions"("journey_id", "created_at");
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 234e06b..0cae528 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -720,6 +720,42 @@ model Match {
   @@map("matches")
 }
 
+model WorkflowJourney {
+  id             String   @id
+  match_id       String?
+  requirement_id String?
+  product_id     String?
+  contract_id    String?
+  current_state  String
+  created_at     DateTime @default(now())
+  updated_at     DateTime?
+
+  transitions    WorkflowTransition[]
+
+  @@index([match_id])
+  @@map("workflow_journeys")
+}
+
+model WorkflowTransition {
+  id            String   @id
+  journey_id    String
+  from_state    String
+  to_state      String
+  event_type    String
+  actor_id      String?
+  source        String?
+  metadata      Json?
+  accepted      Boolean  @default(true)
+  error_code    String?
+  error_message String?
+  created_at    DateTime @default(now())
+
+  journey WorkflowJourney @relation(fields: [journey_id], references: [id], onDelete: Cascade)
+
+  @@index([journey_id, created_at])
+  @@map("workflow_transitions")
+}
+
 model MetricTransition {
   id             String   @id
   requirement_id String?
diff --git a/server/controllers/productController.js b/server/controllers/productController.js
index 775477b..2c3c5d6 100644
--- a/server/controllers/productController.js
+++ b/server/controllers/productController.js
@@ -18,7 +18,7 @@ import { getActiveBoostMap } from '../services/boostService.js'
 import { getOrderCertificationMap } from '../services/orderCertificationService.js'
 import { isOpenSearchConfigured, searchOpenSearch } from '../services/openSearchService.js'
 import { getBaseCurrency, normalizeMoney } from '../services/currencyService.js'
-import { recordJourneyEvent } from '../services/dealJourneyService.js'
+import { recordWorkflowEvent } from '../services/workflowLifecycleService.js'
 
 function parseNumber(value) {
   if (value === undefined || value === null) return null
@@ -272,7 +272,7 @@ export async function getProducts(req, res) {
 }
 
 export async function searchProducts(req, res) {
-  await recordJourneyEvent('search_open', {
+  await recordWorkflowEvent('search_open', {
     search_source: 'products_search',
     product_id: req.query.product_id || req.query.id || '',
   }, { actor_id: req.user.id }).catch(() => null)
diff --git a/server/controllers/requirementController.js b/server/controllers/requirementController.js
index 23a71ce..5928a91 100644
--- a/server/controllers/requirementController.js
+++ b/server/controllers/requirementController.js
@@ -15,7 +15,7 @@ import { generateMatchesForRequirement, listMatchesForRequirement } from '../ser
 import { getOrderCertificationMap } from '../services/orderCertificationService.js'
 import { isOpenSearchConfigured, searchOpenSearch } from '../services/openSearchService.js'
 import { getBaseCurrency, normalizeMoney } from '../services/currencyService.js'
-import { recordJourneyEvent } from '../services/dealJourneyService.js'
+import { recordWorkflowEvent } from '../services/workflowLifecycleService.js'
 
 function redactRequirementForBuyer(requirement) {
   return {
@@ -275,7 +275,7 @@ export async function getRequirements(req, res) {
 }
 
 export async function browseRequirements(req, res) {
-  await recordJourneyEvent('search_open', {
+  await recordWorkflowEvent('search_open', {
     search_source: 'requirements_search',
     requirement_id: req.query.requirement_id || req.query.id || '',
   }, { actor_id: req.user.id }).catch(() => null)
diff --git a/server/controllers/workflowLifecycleController.js b/server/controllers/workflowLifecycleController.js
new file mode 100644
index 0000000..0a965ef
--- /dev/null
+++ b/server/controllers/workflowLifecycleController.js
@@ -0,0 +1,41 @@
+import {
+  createWorkflowJourney,
+  getWorkflowJourneyById,
+  getWorkflowJourneyByMatchId,
+  transitionWorkflowJourney,
+} from '../services/workflowLifecycleService.js'
+
+export async function createJourney(req, res) {
+  const row = await createWorkflowJourney({
+    ...req.body,
+    actor_id: req.user?.id,
+    source: 'workflow_api',
+  })
+  return res.status(201).json(row)
+}
+
+export async function transitionJourney(req, res) {
+  const result = await transitionWorkflowJourney(req.params.id, {
+    ...req.body,
+    actor_id: req.user?.id,
+    source: 'workflow_api',
+  })
+
+  if (!result?.ok) {
+    return res.status(result.status || 409).json({ error: result.error?.message || 'Transition rejected', code: result.error?.code, allowed_next_states: result.error?.allowed_next_states || [] })
+  }
+
+  return res.json(result.journey)
+}
+
+export async function getJourney(req, res) {
+  const row = await getWorkflowJourneyById(req.params.id)
+  if (!row) return res.status(404).json({ error: 'Workflow journey not found', code: 'WORKFLOW_JOURNEY_NOT_FOUND' })
+  return res.json(row)
+}
+
+export async function getJourneyByMatch(req, res) {
+  const row = await getWorkflowJourneyByMatchId(req.params.matchId)
+  if (!row) return res.status(404).json({ error: 'Workflow journey not found', code: 'WORKFLOW_JOURNEY_NOT_FOUND' })
+  return res.json(row)
+}
diff --git a/server/routes/workflowLifecycleRoutes.js b/server/routes/workflowLifecycleRoutes.js
new file mode 100644
index 0000000..0b8ffb2
--- /dev/null
+++ b/server/routes/workflowLifecycleRoutes.js
@@ -0,0 +1,17 @@
+import { Router } from 'express'
+import { requireAuth } from '../middleware/auth.js'
+import {
+  createJourney,
+  getJourney,
+  getJourneyByMatch,
+  transitionJourney,
+} from '../controllers/workflowLifecycleController.js'
+
+const router = Router()
+
+router.post('/journeys', requireAuth, createJourney)
+router.post('/journeys/:id/transition', requireAuth, transitionJourney)
+router.get('/journeys/:id', requireAuth, getJourney)
+router.get('/journeys/by-match/:matchId', requireAuth, getJourneyByMatch)
+
+export default router
diff --git a/server/server.js b/server/server.js
index 3540188..15602d9 100644
--- a/server/server.js
+++ b/server/server.js
@@ -47,6 +47,7 @@ import certificationRoutes from './routes/certificationRoutes.js'
 import crmRoutes from './routes/crmRoutes.js'
 import aiRoutes from './routes/aiRoutes.js'
 import dealJourneyRoutes from './routes/dealJourneyRoutes.js'
+import workflowLifecycleRoutes from './routes/workflowLifecycleRoutes.js'
 import { requestLogger } from './middleware/requestLogger.js'
 import { errorHandler } from './middleware/errorHandler.js'
 import { logInfo, logError } from './utils/logger.js'
@@ -55,6 +56,7 @@ import { maybeGenerateBotReply } from './services/chatbotService.js'
 import jwt from 'jsonwebtoken'
 import { canAccessMatch, listMessagesByMatch, postMessage } from './services/messageService.js'
 import { getCallSession } from './services/callSessionService.js'
+import { recordWorkflowEvent } from './services/workflowLifecycleService.js'
 import { setUserOnline, setUserOffline, touchUser } from './services/presenceService.js'
 import { readJson } from './utils/jsonStore.js'
 import { consumePendingInvites, enqueuePendingInvites } from './utils/pendingInvites.js'
@@ -141,6 +143,7 @@ app.use('/api/certifications', certificationRoutes)
 app.use('/api/crm', crmRoutes)
 app.use('/api/ai', aiRoutes)
 app.use('/api/deal-journeys', dealJourneyRoutes)
+app.use('/api/workflow', workflowLifecycleRoutes)
 app.use('/api/infra', infraRoutes)
 app.use('/api/network', networkRoutes)
 app.use(errorHandler)
@@ -296,6 +299,11 @@ async function joinChatRoom(socket, payload) {
   room.add(socket)
   socket.chatRoomId = matchId
   touchUser(user.id)
+  await recordWorkflowEvent('chat_started', {
+    match_id: matchId,
+    requirement_id: payload?.requirement_id,
+    product_id: payload?.product_id,
+  }, { actor_id: user.id, source: 'ws.join_chat_room' }).catch(() => null)
 
   const history = await listMessagesByMatch(matchId)
   sendWs(socket, {
@@ -352,6 +360,11 @@ async function relayChatMessage(socket, payload) {
       })
     }
 
+
+    await recordWorkflowEvent('chat_message_sent', {
+      match_id: matchId,
+    }, { actor_id: socket.userId, source: 'ws.chat_message' }).catch(() => null)
+
     try {
       const botResult = await maybeGenerateBotReply({ match_id: matchId, sender_id: socket.userId, message: messageText })
       if (botResult?.reply) {
diff --git a/server/services/callSessionService.js b/server/services/callSessionService.js
index 638fc33..e07eac6 100644
--- a/server/services/callSessionService.js
+++ b/server/services/callSessionService.js
@@ -2,7 +2,7 @@ import crypto from 'crypto'
 import { readJson, writeJson } from '../utils/jsonStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { recordMilestone } from './ratingsService.js'
-import { recordJourneyEvent } from './dealJourneyService.js'
+import { recordWorkflowEvent } from './workflowLifecycleService.js'
 
 const FILE = 'call_sessions.json'
 const RECORDING_VIEWS_FILE = 'call_recording_views.json'
@@ -114,7 +114,7 @@ export async function createScheduledCallSession(userId, payload = {}) {
 
   calls.push(row)
   await writeJson(FILE, calls)
-  await recordJourneyEvent('call_scheduled', {
+  await recordWorkflowEvent('call_scheduled', {
     match_id: row.match_id,
     chat_thread_id: row.context?.chat_thread_id || row.match_id,
     contract_id: row.contract_id,
@@ -140,6 +140,10 @@ export async function startCallSession(callId, userId) {
   }
   calls[idx] = next
   await writeJson(FILE, calls)
+  await recordWorkflowEvent('call_joined', {
+    match_id: next.match_id,
+    contract_id: next.contract_id,
+  }, { actor_id: userId, source: 'calls.start' }).catch(() => null)
 
   return next
 }
@@ -167,6 +171,10 @@ export async function endCallSession(callId, userId, endReason = '') {
   }
   calls[idx] = next
   await writeJson(FILE, calls)
+  await recordWorkflowEvent('call_ended', {
+    match_id: next.match_id,
+    contract_id: next.contract_id,
+  }, { actor_id: userId, source: 'calls.end' }).catch(() => null)
 
   return next
 }
@@ -228,7 +236,7 @@ export async function markRecording(callId, userId, payload = {}) {
   await writeJson(FILE, calls)
 
   if (shouldComplete) {
-    await recordJourneyEvent('call_completed', {
+    await recordWorkflowEvent('call_ended', {
       match_id: call.match_id,
       chat_thread_id: call.context?.chat_thread_id || call.match_id,
       contract_id: call.contract_id,
diff --git a/server/services/documentService.js b/server/services/documentService.js
index 792a4a7..7c5fa1d 100644
--- a/server/services/documentService.js
+++ b/server/services/documentService.js
@@ -8,7 +8,7 @@ import { canAccessContract, canManagePartnerNetwork, canModifyContract, isAgent,
 import { trackEvent } from './eventTrackingService.js'
 import { ensureCertificationForContract } from './certificationService.js'
 import { markLeadConvertedFromContract } from './leadService.js'
-import { recordJourneyEvent } from './dealJourneyService.js'
+import { recordWorkflowEvent } from './workflowLifecycleService.js'
 
 const FILE = 'documents.json'
 const CONTRACT_AUDIT_FILE = 'contract_audit.json'
@@ -405,7 +405,7 @@ export async function createDraftContract(actor, payload = {}) {
   docs.push(contract)
   await writeJson(FILE, docs)
   await trackEvent({ type: 'contract_created', actor_id: actor.id, entity_id: contract.id })
-  await recordJourneyEvent('contract_draft', {
+  await recordWorkflowEvent('contract_created', {
     contract_id: contract.id,
     requirement_id: payload.requirement_id,
     product_id: payload.product_id,
@@ -497,7 +497,7 @@ export async function updateContractSignatures(contractId, patch = {}, actor) {
     await trackEvent({ type: 'contract_signed', actor_id: actor.id, entity_id: next.id })
     await ensureCertificationForContract(next)
     await markLeadConvertedFromContract({ buyerId: next.buyer_id, factoryId: next.factory_id, contractId: next.id })
-    await recordJourneyEvent('contract_signed', { contract_id: next.id }, { actor_id: actor.id }).catch(() => null)
+    await recordWorkflowEvent('contract_signed', { contract_id: next.id }, { actor_id: actor.id }).catch(() => null)
   }
   return { ...presentContractForActor(next, actor), payment_proof_ok: paymentProofOk }
 }
diff --git a/server/services/matchingService.js b/server/services/matchingService.js
index 006c9fb..0444eca 100644
--- a/server/services/matchingService.js
+++ b/server/services/matchingService.js
@@ -1,6 +1,6 @@
 import { readJson, writeJson } from '../utils/jsonStore.js'
 import { trackTransition } from '../utils/metrics.js'
-import { recordJourneyEvent } from './dealJourneyService.js'
+import { recordWorkflowEvent } from './workflowLifecycleService.js'
 
 const USERS_FILE = 'users.json'
 const MATCHES_FILE = 'matches.json'
@@ -45,7 +45,7 @@ export async function generateMatchesForRequirement(requirement) {
   await writeJson(MATCHES_FILE, [...withoutOld, ...ranked])
 
   if (ranked.length > 0) {
-    await recordJourneyEvent('match_confirmed', { requirement_id: requirement.id }, { match_count: ranked.length }).catch(() => null)
+    await recordWorkflowEvent('match_confirmed', { requirement_id: requirement.id }, { match_count: ranked.length }).catch(() => null)
   }
 
   return ranked
diff --git a/server/services/messageService.js b/server/services/messageService.js
index 4243f83..0ca8950 100644
--- a/server/services/messageService.js
+++ b/server/services/messageService.js
@@ -14,7 +14,7 @@ import { assertMessagingAllowed, moderateTextOrRedactWithContext } from './polic
 import { getRequirementById } from './requirementService.js'
 import { autoSummarizeMatch, resolveOrgOwnerFromMatch } from './aiConversationService.js'
 import { attachMessageToQueue, evaluateMessagePolicy } from './communicationPolicyService.js'
-import { recordJourneyEvent } from './dealJourneyService.js'
+import { recordWorkflowEvent } from './workflowLifecycleService.js'
 
 const FILE = 'messages.json'
 const USERS_FILE = 'users.json'
@@ -402,7 +402,7 @@ export async function postMessage(matchId, senderId, message, type = 'text', att
 
   await trackTransition(matchId, 'matched', 'first_message_sent', { sender_id: senderId })
 
-  await recordJourneyEvent('message_start', { match_id: matchId, chat_thread_id: matchId }, { sender_id: senderId }).catch(() => null)
+  await recordWorkflowEvent('chat_message_sent', { match_id: matchId, chat_thread_id: matchId }, { sender_id: senderId }).catch(() => null)
 
   try {
     const orgOwnerId = await resolveOrgOwnerFromMatch(matchId, senderId)
diff --git a/server/services/workflowLifecycleService.js b/server/services/workflowLifecycleService.js
new file mode 100644
index 0000000..c8b613a
--- /dev/null
+++ b/server/services/workflowLifecycleService.js
@@ -0,0 +1,350 @@
+import crypto from 'crypto'
+import prisma from '../utils/prisma.js'
+import { readLocalJson, writeLocalJson } from '../utils/localStore.js'
+import { sanitizeString } from '../utils/validators.js'
+import {
+  WORKFLOW_LIFECYCLE_STATES,
+  normalizeWorkflowLifecycleState,
+  validateWorkflowLifecycleTransition,
+} from '../../shared/workflowLifecycle.js'
+
+const JOURNEYS_FILE = 'workflow_journeys.json'
+const TRANSITIONS_FILE = 'workflow_transitions.json'
+const AUDIT_FILE = 'workflow_audit_logs.json'
+
+function nowIso() {
+  return new Date().toISOString()
+}
+
+function supportsPrismaWorkflow() {
+  return Boolean(prisma?.workflowJourney && prisma?.workflowTransition)
+}
+
+function normalizeJourney(journey = {}) {
+  return {
+    id: sanitizeString(journey.id, 120) || crypto.randomUUID(),
+    match_id: sanitizeString(journey.match_id, 120),
+    requirement_id: sanitizeString(journey.requirement_id, 120),
+    product_id: sanitizeString(journey.product_id, 120),
+    contract_id: sanitizeString(journey.contract_id, 120),
+    current_state: normalizeWorkflowLifecycleState(journey.current_state, 'discovered'),
+    created_at: sanitizeString(journey.created_at, 80) || nowIso(),
+    updated_at: sanitizeString(journey.updated_at, 80) || nowIso(),
+  }
+}
+
+function normalizeTransition(transition = {}) {
+  return {
+    id: sanitizeString(transition.id, 120) || crypto.randomUUID(),
+    journey_id: sanitizeString(transition.journey_id, 120),
+    from_state: normalizeWorkflowLifecycleState(transition.from_state, 'discovered'),
+    to_state: normalizeWorkflowLifecycleState(transition.to_state, 'discovered'),
+    event_type: sanitizeString(transition.event_type, 80) || 'state_transition',
+    actor_id: sanitizeString(transition.actor_id, 120),
+    source: sanitizeString(transition.source, 80),
+    metadata: transition.metadata && typeof transition.metadata === 'object' ? transition.metadata : {},
+    created_at: sanitizeString(transition.created_at, 80) || nowIso(),
+    accepted: Boolean(transition.accepted),
+    error_code: sanitizeString(transition.error_code, 80),
+    error_message: sanitizeString(transition.error_message, 260),
+  }
+}
+
+async function appendAuditLog(entry = {}) {
+  const rows = await readLocalJson(AUDIT_FILE, [])
+  const next = [...(Array.isArray(rows) ? rows : []), { id: crypto.randomUUID(), created_at: nowIso(), ...entry }]
+  await writeLocalJson(AUDIT_FILE, next)
+}
+
+async function readJourneys() {
+  if (supportsPrismaWorkflow()) {
+    const rows = await prisma.workflowJourney.findMany()
+    return rows.map(normalizeJourney)
+  }
+  const rows = await readLocalJson(JOURNEYS_FILE, [])
+  return (Array.isArray(rows) ? rows : []).map(normalizeJourney)
+}
+
+async function writeJourneys(rows = []) {
+  const safeRows = (Array.isArray(rows) ? rows : []).map(normalizeJourney)
+  if (supportsPrismaWorkflow()) {
+    const existing = await prisma.workflowJourney.findMany({ select: { id: true } })
+    const keepIds = new Set(safeRows.map((row) => row.id))
+    const deleteIds = existing.map((row) => row.id).filter((id) => !keepIds.has(id))
+    if (deleteIds.length) {
+      await prisma.workflowJourney.deleteMany({ where: { id: { in: deleteIds } } })
+    }
+
+    for (const row of safeRows) {
+      await prisma.workflowJourney.upsert({
+        where: { id: row.id },
+        create: row,
+        update: row,
+      })
+    }
+    return safeRows
+  }
+  await writeLocalJson(JOURNEYS_FILE, safeRows)
+  return safeRows
+}
+
+async function readTransitions(journeyId = '') {
+  const id = sanitizeString(journeyId, 120)
+  if (supportsPrismaWorkflow()) {
+    const where = id ? { journey_id: id } : undefined
+    const rows = await prisma.workflowTransition.findMany({ where, orderBy: { created_at: 'asc' } })
+    return rows.map(normalizeTransition)
+  }
+  const rows = await readLocalJson(TRANSITIONS_FILE, [])
+  const safe = (Array.isArray(rows) ? rows : []).map(normalizeTransition)
+  return id ? safe.filter((row) => row.journey_id === id) : safe
+}
+
+async function appendTransition(transition) {
+  const safe = normalizeTransition(transition)
+  if (supportsPrismaWorkflow()) {
+    await prisma.workflowTransition.create({ data: safe })
+    return safe
+  }
+  const rows = await readLocalJson(TRANSITIONS_FILE, [])
+  const next = [...(Array.isArray(rows) ? rows : []), safe]
+  await writeLocalJson(TRANSITIONS_FILE, next)
+  return safe
+}
+
+function resolveJourneyContext(journey, context = {}) {
+  return {
+    ...journey,
+    match_id: sanitizeString(context.match_id, 120) || journey.match_id,
+    requirement_id: sanitizeString(context.requirement_id, 120) || journey.requirement_id,
+    product_id: sanitizeString(context.product_id, 120) || journey.product_id,
+    contract_id: sanitizeString(context.contract_id, 120) || journey.contract_id,
+    updated_at: nowIso(),
+  }
+}
+
+function findJourneyByContext(rows = [], context = {}) {
+  const matchId = sanitizeString(context.match_id, 120)
+  const requirementId = sanitizeString(context.requirement_id, 120)
+  const productId = sanitizeString(context.product_id, 120)
+  const contractId = sanitizeString(context.contract_id, 120)
+
+  return rows.find((row) => {
+    if (matchId && row.match_id === matchId) return true
+    if (contractId && row.contract_id === contractId) return true
+    if (requirementId && row.requirement_id === requirementId) return true
+    if (productId && row.product_id === productId) return true
+    return false
+  }) || null
+}
+
+export async function createWorkflowJourney(payload = {}) {
+  const rows = await readJourneys()
+  const existing = findJourneyByContext(rows, payload)
+  if (existing) {
+    const merged = resolveJourneyContext(existing, payload)
+    await writeJourneys(rows.map((row) => (row.id === merged.id ? merged : row)))
+    return merged
+  }
+
+  const initialState = normalizeWorkflowLifecycleState(payload.initial_state, 'discovered')
+  const journey = normalizeJourney({
+    id: payload.id,
+    match_id: payload.match_id,
+    requirement_id: payload.requirement_id,
+    product_id: payload.product_id,
+    contract_id: payload.contract_id,
+    current_state: initialState,
+  })
+
+  await writeJourneys([...rows, journey])
+  await appendTransition({
+    journey_id: journey.id,
+    from_state: initialState,
+    to_state: initialState,
+    event_type: 'journey_created',
+    actor_id: sanitizeString(payload.actor_id, 120),
+    source: sanitizeString(payload.source, 80) || 'workflow_api',
+    metadata: { initial_state: initialState },
+    accepted: true,
+  })
+
+  return journey
+}
+
+export async function getWorkflowJourneyById(journeyId) {
+  const id = sanitizeString(journeyId, 120)
+  if (!id) return null
+  const rows = await readJourneys()
+  const journey = rows.find((row) => row.id === id) || null
+  if (!journey) return null
+  const transitions = await readTransitions(journey.id)
+  return { ...journey, transitions }
+}
+
+export async function getWorkflowJourneyByMatchId(matchId) {
+  const id = sanitizeString(matchId, 120)
+  if (!id) return null
+  const rows = await readJourneys()
+  const journey = rows.find((row) => row.match_id === id) || null
+  if (!journey) return null
+  const transitions = await readTransitions(journey.id)
+  return { ...journey, transitions }
+}
+
+export async function transitionWorkflowJourney(journeyId, payload = {}) {
+  const id = sanitizeString(journeyId, 120)
+  if (!id) {
+    return {
+      ok: false,
+      status: 400,
+      error: {
+        code: 'INVALID_JOURNEY_ID',
+        message: 'journey id is required',
+        allowed_next_states: [],
+      },
+    }
+  }
+
+  const toState = normalizeWorkflowLifecycleState(payload.to_state, '')
+  if (!toState) {
+    return {
+      ok: false,
+      status: 400,
+      error: {
+        code: 'INVALID_TO_STATE',
+        message: 'to_state is required',
+        allowed_next_states: [],
+      },
+    }
+  }
+
+  const rows = await readJourneys()
+  const current = rows.find((row) => row.id === id)
+  if (!current) {
+    return {
+      ok: false,
+      status: 404,
+      error: {
+        code: 'WORKFLOW_JOURNEY_NOT_FOUND',
+        message: 'Workflow journey not found',
+        allowed_next_states: [],
+      },
+    }
+  }
+
+  const merged = resolveJourneyContext(current, payload.context || {})
+  const validation = validateWorkflowLifecycleTransition(merged.current_state, toState)
+
+  if (!validation.ok) {
+    const failed = await appendTransition({
+      journey_id: id,
+      from_state: merged.current_state,
+      to_state: toState,
+      event_type: sanitizeString(payload.event_type, 80) || 'invalid_transition',
+      actor_id: sanitizeString(payload.actor_id, 120),
+      source: sanitizeString(payload.source, 80) || 'workflow_api',
+      metadata: payload.metadata || {},
+      accepted: false,
+      error_code: validation.code,
+      error_message: validation.message,
+    })
+
+    await appendAuditLog({
+      action: 'workflow_transition_rejected',
+      journey_id: id,
+      from_state: merged.current_state,
+      to_state: toState,
+      error_code: validation.code,
+      error_message: validation.message,
+      actor_id: sanitizeString(payload.actor_id, 120),
+      source: sanitizeString(payload.source, 80) || 'workflow_api',
+    })
+
+    return {
+      ok: false,
+      status: 409,
+      error: {
+        code: validation.code,
+        message: validation.message,
+        allowed_next_states: validation.allowed_next_states,
+      },
+      transition: failed,
+    }
+  }
+
+  const updated = {
+    ...merged,
+    current_state: toState,
+    updated_at: nowIso(),
+  }
+
+  await writeJourneys(rows.map((row) => (row.id === id ? updated : row)))
+
+  const accepted = await appendTransition({
+    journey_id: id,
+    from_state: merged.current_state,
+    to_state: toState,
+    event_type: sanitizeString(payload.event_type, 80) || 'state_transition',
+    actor_id: sanitizeString(payload.actor_id, 120),
+    source: sanitizeString(payload.source, 80) || 'workflow_api',
+    metadata: payload.metadata || {},
+    accepted: true,
+  })
+
+  await appendAuditLog({
+    action: 'workflow_transition_accepted',
+    journey_id: id,
+    from_state: merged.current_state,
+    to_state: toState,
+    actor_id: sanitizeString(payload.actor_id, 120),
+    source: sanitizeString(payload.source, 80) || 'workflow_api',
+  })
+
+  return { ok: true, status: 200, journey: { ...updated, transitions: await readTransitions(id) }, transition: accepted }
+}
+
+export async function recordWorkflowEvent(eventType, context = {}, metadata = {}) {
+  const safeType = sanitizeString(eventType, 80)
+  if (!safeType) return null
+
+  const stateByEvent = {
+    search_open: 'discovered',
+    match_confirmed: 'matched',
+    chat_started: 'contacted',
+    chat_message_sent: 'contacted',
+    call_scheduled: 'meeting_scheduled',
+    call_joined: 'negotiating',
+    call_ended: 'negotiating',
+    contract_created: 'contract_drafted',
+    contract_signed: 'contract_signed',
+    journey_closed: 'closed',
+  }
+
+  const journey = await createWorkflowJourney({ ...context, source: 'workflow_hook' })
+  const targetState = stateByEvent[safeType]
+  if (!targetState) return journey
+
+  if (journey.current_state === targetState) return journey
+
+  const fromIndex = WORKFLOW_LIFECYCLE_STATES.indexOf(journey.current_state)
+  const targetIndex = WORKFLOW_LIFECYCLE_STATES.indexOf(targetState)
+  if (fromIndex < 0 || targetIndex < 0) return journey
+
+  let currentJourney = journey
+  for (let idx = fromIndex + 1; idx <= targetIndex; idx += 1) {
+    const nextState = WORKFLOW_LIFECYCLE_STATES[idx]
+    const result = await transitionWorkflowJourney(currentJourney.id, {
+      to_state: nextState,
+      event_type: safeType,
+      actor_id: sanitizeString(metadata?.actor_id || context?.actor_id, 120),
+      source: 'workflow_hook',
+      metadata,
+      context,
+    })
+    if (!result?.ok) break
+    currentJourney = result.journey
+  }
+
+  return currentJourney
+}
diff --git a/server/utils/jsonStore.js b/server/utils/jsonStore.js
index f729c5a..338d9c3 100644
--- a/server/utils/jsonStore.js
+++ b/server/utils/jsonStore.js
@@ -140,6 +140,8 @@ const FILE_HANDLERS = {
   'social_interactions.json': tableHandler('socialInteraction', ['id']),
   'user_connections.json': tableHandler('userConnection', ['id']),
   'matches.json': tableHandler('match', ['requirement_id', 'factory_id'], 'requirement_id_factory_id'),
+  'workflow_journeys.json': tableHandler('workflowJourney', ['id']),
+  'workflow_transitions.json': tableHandler('workflowTransition', ['id']),
   'metrics.json': tableHandler('metricTransition', ['id']),
   'assistant_knowledge.json': tableHandler('assistantKnowledge', ['id']),
   'payment_proofs.json': tableHandler('paymentProof', ['id']),
diff --git a/shared/workflowLifecycle.js b/shared/workflowLifecycle.js
new file mode 100644
index 0000000..b2b76e9
--- /dev/null
+++ b/shared/workflowLifecycle.js
@@ -0,0 +1,71 @@
+export const WORKFLOW_LIFECYCLE_STATES = [
+  'discovered',
+  'matched',
+  'contacted',
+  'meeting_scheduled',
+  'negotiating',
+  'contract_drafted',
+  'contract_signed',
+  'closed',
+]
+
+export const WORKFLOW_LIFECYCLE_TRANSITIONS = {
+  discovered: ['matched'],
+  matched: ['contacted'],
+  contacted: ['meeting_scheduled', 'negotiating'],
+  meeting_scheduled: ['negotiating'],
+  negotiating: ['contract_drafted'],
+  contract_drafted: ['contract_signed'],
+  contract_signed: ['closed'],
+  closed: [],
+}
+
+export function isWorkflowLifecycleState(state) {
+  return WORKFLOW_LIFECYCLE_STATES.includes(String(state || '').trim())
+}
+
+export function nextWorkflowLifecycleStates(fromState) {
+  const from = String(fromState || '').trim()
+  if (!isWorkflowLifecycleState(from)) return []
+  return [...(WORKFLOW_LIFECYCLE_TRANSITIONS[from] || [])]
+}
+
+export function validateWorkflowLifecycleTransition(fromState, toState) {
+  const from = String(fromState || '').trim()
+  const to = String(toState || '').trim()
+
+  if (!isWorkflowLifecycleState(from)) {
+    return {
+      ok: false,
+      code: 'INVALID_FROM_STATE',
+      message: `Unknown workflow state: ${from || 'empty'}`,
+      allowed_next_states: [],
+    }
+  }
+
+  if (!isWorkflowLifecycleState(to)) {
+    return {
+      ok: false,
+      code: 'INVALID_TO_STATE',
+      message: `Unknown workflow state: ${to || 'empty'}`,
+      allowed_next_states: nextWorkflowLifecycleStates(from),
+    }
+  }
+
+  const allowed = nextWorkflowLifecycleStates(from)
+  if (!allowed.includes(to)) {
+    return {
+      ok: false,
+      code: 'INVALID_TRANSITION',
+      message: `Cannot transition workflow from ${from} to ${to}`,
+      allowed_next_states: allowed,
+    }
+  }
+
+  return { ok: true, code: 'OK', message: 'Transition accepted', allowed_next_states: allowed }
+}
+
+export function normalizeWorkflowLifecycleState(state, fallback = 'discovered') {
+  const normalized = String(state || '').trim()
+  return isWorkflowLifecycleState(normalized) ? normalized : fallback
+}
diff --git a/src/components/JourneyTimeline.jsx b/src/components/JourneyTimeline.jsx
new file mode 100644
index 0000000..f265258
--- /dev/null
+++ b/src/components/JourneyTimeline.jsx
@@ -0,0 +1,66 @@
+import React, { useEffect, useMemo, useState } from 'react'
+import { apiRequest, getToken } from '../lib/auth'
+
+const ORDERED_STATES = ['discovered', 'matched', 'contacted', 'meeting_scheduled', 'negotiating', 'contract_drafted', 'contract_signed', 'closed']
+
+function toLabel(state) {
+  return String(state || '').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
+}
+
+export default function JourneyTimeline({ title = 'Journey Timeline', matchId = '' }) {
+  const [journey, setJourney] = useState(null)
+  const [error, setError] = useState('')
+
+  useEffect(() => {
+    const token = getToken()
+    if (!token || !matchId) return
+
+    apiRequest(`/workflow/journeys/by-match/${encodeURIComponent(matchId)}`, { token })
+      .then((row) => {
+        setJourney(row)
+        setError('')
+      })
+      .catch(() => {
+        setJourney(null)
+        setError('Journey not started yet.')
+      })
+  }, [matchId])
+
+  const currentIndex = useMemo(() => ORDERED_STATES.indexOf(String(journey?.current_state || '')), [journey?.current_state])
+
+  return (
+    <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
+      <div className="flex flex-wrap items-center justify-between gap-2">
+        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
+        {journey?.id ? <span className="text-[11px] text-slate-500">Journey #{journey.id.slice(0, 8)}</span> : null}
+      </div>
+
+      <div className="mt-3 flex flex-wrap gap-2">
+        {ORDERED_STATES.map((state, idx) => {
+          const done = currentIndex >= idx
+          return (
+            <span
+              key={state}
+              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${done ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-50 text-slate-500 ring-slate-200'}`}
+            >
+              {toLabel(state)}
+            </span>
+          )
+        })}
+      </div>
+
+      {journey?.transitions?.length ? (
+        <div className="mt-3 text-xs text-slate-600">
+          Recent transitions:
+          <ul className="mt-1 list-disc pl-5">
+            {journey.transitions.slice(-3).reverse().map((row) => (
+              <li key={row.id}>{toLabel(row.from_state)} → {toLabel(row.to_state)} ({row.event_type})</li>
+            ))}
+          </ul>
+        </div>
+      ) : null}
+
+      {!journey && error ? <div className="mt-2 text-xs text-slate-500">{error}</div> : null}
+    </section>
+  )
+}
diff --git a/src/components/journey/JourneyTimeline.jsx b/src/components/journey/JourneyTimeline.jsx
index 2e88ad0..3f22732 100644
--- a/src/components/journey/JourneyTimeline.jsx
+++ b/src/components/journey/JourneyTimeline.jsx
@@ -1,95 +1 @@
-import React, { useEffect, useMemo, useState } from 'react'
-import { Link } from 'react-router-dom'
-import { apiRequest, getToken } from '../../lib/auth'
-
-const ORDERED_STATES = ['discovered', 'matched', 'contacted', 'negotiating', 'sample', 'agreed', 'signed', 'closed']
-
-function toLabel(state) {
-  return String(state || '').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
-}
-
-export default function JourneyTimeline({ title = 'Journey Timeline', requirementId = '', productId = '', matchId = '', contractId = '' }) {
-  const [journey, setJourney] = useState(null)
-  const [error, setError] = useState('')
-
-  useEffect(() => {
-    const token = getToken()
-    if (!token) return
-
-    const params = new URLSearchParams()
-    if (requirementId) params.set('requirement_id', requirementId)
-    if (productId) params.set('product_id', productId)
-    if (matchId) params.set('match_id', matchId)
-    if (contractId) params.set('contract_id', contractId)
-    if (![...params.keys()].length) return
-
-    apiRequest(`/deal-journeys/context?${params.toString()}`, { token })
-      .then((row) => {
-        setJourney(row)
-        setError('')
-      })
-      .catch(() => {
-        setJourney(null)
-        setError('Journey not started yet.')
-      })
-  }, [contractId, matchId, productId, requirementId])
-
-  const currentIndex = useMemo(() => ORDERED_STATES.indexOf(String(journey?.current_state || '')), [journey?.current_state])
-
-  return (
-    <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
-      <div className="flex flex-wrap items-center justify-between gap-2">
-        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
-        {journey?.id ? <span className="text-[11px] text-slate-500">Journey #{journey.id.slice(0, 8)}</span> : null}
-      </div>
-
-      <div className="mt-3 flex flex-wrap gap-2">
-        {ORDERED_STATES.map((state, idx) => {
-          const done = currentIndex >= idx
-          return (
-            <span
-              key={state}
-              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${done ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-50 text-slate-500 ring-slate-200'}`}
-            >
-              {toLabel(state)}
-            </span>
-          )
-        })}
-      </div>
-
-      {journey?.interrupted ? (
-        <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
-          Interrupted: {journey.interrupted_reason || 'Missing context. Resume from the latest active workspace.'}
-          <div className="mt-2 flex flex-wrap gap-2">
-            <Link to={matchId ? `/chat?match_id=${encodeURIComponent(matchId)}` : '/chat'} className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white">Resume in chat</Link>
-            <Link to={contractId ? `/contracts?contract_id=${encodeURIComponent(contractId)}` : '/contracts'} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-300">Open contract</Link>
-          </div>
-        </div>
-      ) : null}
-
-      {journey ? (
-        <div className="mt-3 text-xs text-slate-600">
-          Missing artifacts:
-          <ul className="mt-1 list-disc pl-5">
-            {!journey.chat_thread_id ? <li>Add a chat thread to continue negotiation.</li> : null}
-            {!(journey.call_ids || []).length ? <li>Schedule or complete at least one call.</li> : null}
-            {!journey.contract_id ? <li>Create contract draft before signing.</li> : null}
-          </ul>
-        </div>
-      ) : null}
-
-      {journey?.rollback_logs?.length ? (
-        <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-800">
-          <div className="font-semibold">Rollback reason logs</div>
-          <ul className="mt-1 list-disc pl-5">
-            {journey.rollback_logs.slice(-3).reverse().map((row) => (
-              <li key={row.id}>{row.from_state} → {row.to_state}: {row.reason}</li>
-            ))}
-          </ul>
-        </div>
-      ) : null}
-
-      {!journey && error ? <div className="mt-2 text-xs text-slate-500">{error}</div> : null}
-    </section>
-  )
-}
+export { default } from '../JourneyTimeline'
diff --git a/src/pages/BuyerProfile.jsx b/src/pages/BuyerProfile.jsx
index 104486a..8580ddc 100644
--- a/src/pages/BuyerProfile.jsx
+++ b/src/pages/BuyerProfile.jsx
@@ -32,7 +32,7 @@ import { trackClientEvent } from '../lib/events'
 import { recordLeadSource } from '../lib/leadSource'
 import VerificationPanel from '../components/profile/VerificationPanel'
 import CrmSummaryPanel from '../components/profile/CrmSummaryPanel'
-import JourneyTimeline from '../components/journey/JourneyTimeline'
+import JourneyTimeline from '../components/JourneyTimeline'
 
 const Motion = motion
 
diff --git a/src/pages/CallInterface.jsx b/src/pages/CallInterface.jsx
index 8aea438..86b3e05 100644
--- a/src/pages/CallInterface.jsx
+++ b/src/pages/CallInterface.jsx
@@ -43,6 +43,7 @@ import {
 import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
 import { trackClientEvent } from '../lib/events'
 import MarkdownMessage from '../components/chat/MarkdownMessage'
+import JourneyTimeline from '../components/JourneyTimeline'
 
 const WS_BASE = (() => {
   if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
@@ -536,10 +537,24 @@ export default function CallInterface() {
     if (!token || !callId) return
     try {
       await apiRequest(`/calls/${callId}/start`, { method: 'POST', token })
+      if (effectiveMatchId) {
+        const journey = await apiRequest('/workflow/journeys', {
+          method: 'POST',
+          token,
+          body: { match_id: effectiveMatchId, initial_state: 'discovered' },
+        })
+        if (journey?.id) {
+          await apiRequest(`/workflow/journeys/${encodeURIComponent(journey.id)}/transition`, {
+            method: 'POST',
+            token,
+            body: { to_state: 'negotiating', event_type: 'call_joined' },
+          })
+        }
+      }
     } catch {
       // no-op
     }
-  }, [callId])
+  }, [callId, effectiveMatchId])
 
   const loadParticipants = useCallback(async () => {
     const token = getToken()
@@ -1438,6 +1453,16 @@ export default function CallInterface() {
     if (token && callId) {
       try {
         await apiRequest(`/calls/${callId}/end`, { method: 'POST', token })
+        if (effectiveMatchId) {
+          const journey = await apiRequest(`/workflow/journeys/by-match/${encodeURIComponent(effectiveMatchId)}`, { token })
+          if (journey?.id) {
+            await apiRequest(`/workflow/journeys/${encodeURIComponent(journey.id)}/transition`, {
+              method: 'POST',
+              token,
+              body: { to_state: 'negotiating', event_type: 'call_ended' },
+            })
+          }
+        }
       } catch {
         // ignore
       }
@@ -1781,6 +1806,9 @@ export default function CallInterface() {
                 ) : null}
               </div>
             </div>
+            <div className="borderless-divider-b bg-white/30 p-3 dark:bg-white/5">
+              <JourneyTimeline title="Journey Timeline" matchId={effectiveMatchId || ''} />
+            </div>
 
           <div ref={chatScrollRef} className="flex-1 overflow-y-auto bg-slate-50/60 p-5 space-y-6 dark:bg-black/20 scrollbar-hide">
             {sortedChatMessages.length > 0 ? sortedChatMessages.map((msg) => {
@@ -1878,5 +1906,3 @@ export default function CallInterface() {
     </div>
   )
 }
-
-
diff --git a/src/pages/ChatInterface.jsx b/src/pages/ChatInterface.jsx
index dbcc01c..7fa4829 100644
--- a/src/pages/ChatInterface.jsx
+++ b/src/pages/ChatInterface.jsx
@@ -52,7 +52,7 @@ import { consumeLeadSource } from '../lib/leadSource'
 import AttachmentPreviewModal from '../components/chat/AttachmentPreviewModal'
 import MarkdownMessage from '../components/chat/MarkdownMessage'
 import FileAttachmentCard from '../components/chat/FileAttachmentCard'
-import JourneyTimeline from '../components/journey/JourneyTimeline'
+import JourneyTimeline from '../components/JourneyTimeline'
 
 const WS_BASE = (() => {
   if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
diff --git a/src/pages/ContractVault.jsx b/src/pages/ContractVault.jsx
index e919548..0eeadcc 100644
--- a/src/pages/ContractVault.jsx
+++ b/src/pages/ContractVault.jsx
@@ -25,12 +25,12 @@
     - Skeleton shimmer for list/detail while loading.
 */
 import React, { useEffect, useMemo, useRef, useState } from 'react'
-import { Link } from 'react-router-dom'
+import { Link, useLocation } from 'react-router-dom'
 import { motion, useReducedMotion } from 'framer-motion'
 import AccessDeniedState from '../components/AccessDeniedState'
 import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
 import { trackClientEvent } from '../lib/events'
-import JourneyTimeline from '../components/journey/JourneyTimeline'
+import JourneyTimeline from '../components/JourneyTimeline'
 
 const Motion = motion
 
@@ -244,6 +244,8 @@ function Drawer({ open, onClose, children }) {
 }
 
 export default function ContractVault() {
+  const location = useLocation()
+  const journeyParams = useMemo(() => new URLSearchParams(location.search), [location.search])
   const currentUser = useMemo(() => getCurrentUser(), [])
   const reduceMotion = useReducedMotion()
   const [loadingContracts, setLoadingContracts] = useState(true)
@@ -666,7 +668,7 @@ export default function ContractVault() {
 
       {actionError ? <div className="mt-4 rounded-xl borderless-shadow bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}
       <div className="mt-4">
-        <JourneyTimeline title="Journey Timeline" contractId={selected.id} />
+        <JourneyTimeline title="Journey Timeline" matchId={selected.match_id || journeyParams.get('journey_match_id') || journeyParams.get('match_id') || ''} />
       </div>
       {selected.requirement_id ? (
         <div className="mt-2">
@@ -1257,4 +1259,3 @@ export default function ContractVault() {
     </div>
   )
 }
-
diff --git a/src/pages/SearchResults.jsx b/src/pages/SearchResults.jsx
index eecb5a6..e1d6c5e 100644
--- a/src/pages/SearchResults.jsx
+++ b/src/pages/SearchResults.jsx
@@ -1136,6 +1136,32 @@ export default function SearchResults() {
     if (journeyContext?.matchId) params.set('match_id', journeyContext.matchId)
     if (journeyContext?.productId) params.set('product_id', journeyContext.productId)
     if (journeyContext?.requirementId) params.set('requirement_id', journeyContext.requirementId)
+    const token = getToken()
+    if (token) {
+      apiRequest('/workflow/journeys', {
+        method: 'POST',
+        token,
+        body: {
+          match_id: journeyContext?.matchId || '',
+          requirement_id: journeyContext?.requirementId || '',
+          product_id: journeyContext?.productId || '',
+          initial_state: 'discovered',
+        },
+      })
+        .then((journey) => {
+          if (!journey?.id) return null
+          return apiRequest(`/workflow/journeys/${encodeURIComponent(journey.id)}/transition`, {
+            method: 'POST',
+            token,
+            body: {
+              to_state: 'matched',
+              event_type: 'match_confirmed',
+              metadata: { source: 'search_results_contact' },
+            },
+          })
+        })
+        .catch(() => null)
+    }
     const query = params.toString()
     navigate(`/chat${query ? `?${query}` : ''}`, { state: { notice: `Contacting ${name}. If you are unverified, your first message may appear as a request.` } })
   }
diff --git a/tests/e2e/workflow-lifecycle.spec.ts b/tests/e2e/workflow-lifecycle.spec.ts
new file mode 100644
index 0000000..0ea8934
--- /dev/null
+++ b/tests/e2e/workflow-lifecycle.spec.ts
@@ -0,0 +1,61 @@
+import { test, expect } from '@playwright/test'
+
+const AUTH_HEADER = process.env.E2E_AUTH_TOKEN ? { Authorization: `Bearer ${process.env.E2E_AUTH_TOKEN}` } : {}
+
+test.describe('workflow lifecycle api', () => {
+  test('happy path: create + linear transitions', async ({ request }) => {
+    test.skip(!process.env.E2E_AUTH_TOKEN, 'Set E2E_AUTH_TOKEN to run authenticated workflow e2e tests.')
+
+    const create = await request.post('/api/workflow/journeys', {
+      headers: AUTH_HEADER,
+      data: {
+        match_id: `match-e2e-${Date.now()}`,
+        initial_state: 'discovered',
+      },
+    })
+    expect(create.ok()).toBeTruthy()
+    const journey = await create.json()
+    expect(journey.current_state).toBe('discovered')
+
+    for (const state of ['matched', 'contacted', 'meeting_scheduled', 'negotiating', 'contract_drafted', 'contract_signed', 'closed']) {
+      const transition = await request.post(`/api/workflow/journeys/${journey.id}/transition`, {
+        headers: AUTH_HEADER,
+        data: {
+          to_state: state,
+          event_type: 'e2e_transition',
+        },
+      })
+      expect(transition.ok()).toBeTruthy()
+      const row = await transition.json()
+      expect(row.current_state).toBe(state)
+    }
+  })
+
+  test('invalid transition: discovered -> contract_signed rejected deterministically', async ({ request }) => {
+    test.skip(!process.env.E2E_AUTH_TOKEN, 'Set E2E_AUTH_TOKEN to run authenticated workflow e2e tests.')
+
+    const create = await request.post('/api/workflow/journeys', {
+      headers: AUTH_HEADER,
+      data: {
+        match_id: `match-invalid-${Date.now()}`,
+        initial_state: 'discovered',
+      },
+    })
+    expect(create.ok()).toBeTruthy()
+    const journey = await create.json()
+
+    const transition = await request.post(`/api/workflow/journeys/${journey.id}/transition`, {
+      headers: AUTH_HEADER,
+      data: {
+        to_state: 'contract_signed',
+        event_type: 'e2e_invalid_transition',
+      },
+    })
+
+    expect(transition.status()).toBe(409)
+    const error = await transition.json()
+    expect(error.code).toBe('INVALID_TRANSITION')
+    expect(Array.isArray(error.allowed_next_states)).toBeTruthy()
+    expect(error.allowed_next_states).toContain('matched')
+  })
+})
```

## Why This Change
Add workflow lifecycle domain, API, hooks, UI timeline, and e2e coverage

## Was It Useful
Yes — part of iterative feature development.

## Impact Analysis
- **Scope:**  22 files changed, 774 insertions(+), 118 deletions(-)
- **Risk:** Moderate

## Relationships
Commit 217 in the 0181-0220 sequence.

## Confidence Notes
Auto-generated from git history.
