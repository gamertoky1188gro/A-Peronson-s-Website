## Commit Metadata

- **Hash:** 495910af223f55e60ad381eda376f933a93ff990
- **Parent:** 6ae3a68394f926f4bb60179906fdd75576ffcc3f
- **Author:** Cyber Code Master
- **Date:** 2026-04-06 01:15:35
- **Message:** Add communication policy engine, queue moderation flow, and chat policy UI states

## Custom Title

Add communication policy engine, queue moderation flow, and chat policy UI states

## High-Level Summary

Add communication policy engine, queue moderation flow, and chat policy UI states

11 files changed, 836 insertions(+), 4 deletions(-)

## File-by-File Breakdown

commit 495910af223f55e60ad381eda376f933a93ff990
Author: Cyber Code Master <148459541+gamertoky1188gro@users.noreply.github.com>
Date: Mon Apr 6 01:15:35 2026 +0600

    Add communication policy engine, queue moderation flow, and chat policy UI states

.../migration.sql | 74 ++++
prisma/schema.prisma | 82 +++++
server/controllers/messageController.js | 59 +++-
server/routes/messageRoutes.js | 9 +
server/server.js | 14 +-
.../communicationPolicyService.contract.test.js | 114 ++++++
server/services/communicationPolicyService.js | 392 +++++++++++++++++++++
server/services/messageService.js | 43 +++
server/utils/jsonStore.js | 4 +
src/lib/auth.js | 1 +
src/pages/ChatInterface.jsx | 48 ++-
11 files changed, 836 insertions(+), 4 deletions(-)

## Detailed Diff Analysis

```diff
diff --git a/prisma/migrations/20260405183000_add_communication_policy_engine/migration.sql b/prisma/migrations/20260405183000_add_communication_policy_engine/migration.sql
new file mode 100644
index 0000000..81f22c5
--- /dev/null
+++ b/prisma/migrations/20260405183000_add_communication_policy_engine/migration.sql
@@ -0,0 +1,74 @@
+-- Communication policy engine: queue + decisions + sender reputation + config
+ALTER TABLE "messages"
+  ADD COLUMN IF NOT EXISTS "policy_status" TEXT,
+  ADD COLUMN IF NOT EXISTS "policy_reason" TEXT,
+  ADD COLUMN IF NOT EXISTS "policy_priority" TEXT,
+  ADD COLUMN IF NOT EXISTS "retry_after_seconds" INTEGER,
+  ADD COLUMN IF NOT EXISTS "requires_human_review" BOOLEAN,
+  ADD COLUMN IF NOT EXISTS "queue_id" TEXT;
+
+CREATE TABLE IF NOT EXISTS "message_queue" (
+  "id" TEXT PRIMARY KEY,
+  "message_id" TEXT,
+  "match_id" TEXT NOT NULL,
+  "sender_id" TEXT NOT NULL,
+  "org_id" TEXT,
+  "queue_status" TEXT NOT NULL,
+  "queue_rank" TEXT NOT NULL,
+  "queue_score" INTEGER NOT NULL,
+  "queue_priority_label" TEXT,
+  "policy_reason" TEXT,
+  "retry_after_seconds" INTEGER,
+  "requires_human_review" BOOLEAN NOT NULL DEFAULT false,
+  "metadata" JSONB,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3)
+);
+
+CREATE TABLE IF NOT EXISTS "message_policy_decisions" (
+  "id" TEXT PRIMARY KEY,
+  "queue_id" TEXT,
+  "sender_id" TEXT NOT NULL,
+  "org_id" TEXT,
+  "match_id" TEXT NOT NULL,
+  "action" TEXT NOT NULL,
+  "reason" TEXT NOT NULL,
+  "trust_score" INTEGER NOT NULL,
+  "keyword_risk_score" DOUBLE PRECISION NOT NULL,
+  "frequency_count" INTEGER NOT NULL,
+  "first_response_priority" BOOLEAN NOT NULL DEFAULT false,
+  "queue_rank" TEXT,
+  "queue_score" INTEGER,
+  "queue_priority_label" TEXT,
+  "retry_after_seconds" INTEGER,
+  "requires_human_review" BOOLEAN NOT NULL DEFAULT false,
+  "false_positive" BOOLEAN NOT NULL DEFAULT false,
+  "reviewer_id" TEXT,
+  "reviewer_notes" TEXT,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "updated_at" TIMESTAMP(3)
+);
+
+CREATE TABLE IF NOT EXISTS "sender_reputation" (
+  "id" TEXT PRIMARY KEY,
+  "sender_id" TEXT NOT NULL UNIQUE,
+  "trust_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
+  "spam_reports" INTEGER NOT NULL DEFAULT 0,
+  "positive_interactions" INTEGER NOT NULL DEFAULT 0,
+  "updated_at" TIMESTAMP(3)
+);
+
+CREATE TABLE IF NOT EXISTS "communication_policy_configs" (
+  "id" TEXT PRIMARY KEY,
+  "scope" TEXT NOT NULL,
+  "org_id" TEXT,
+  "max_outreach_per_window" INTEGER NOT NULL,
+  "outreach_window_minutes" INTEGER NOT NULL,
+  "cooldown_seconds" INTEGER NOT NULL,
+  "premium_boost" INTEGER NOT NULL,
+  "verified_boost" INTEGER NOT NULL,
+  "keyword_risk_threshold_soft" DOUBLE PRECISION NOT NULL,
+  "keyword_risk_threshold_hard" DOUBLE PRECISION NOT NULL,
+  "updated_by" TEXT,
+  "updated_at" TIMESTAMP(3)
+);
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index bd5c3a2..ec19e9c 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -219,6 +219,12 @@ model Message {
   attachment        Json?
   moderated         Boolean?
   moderation_reason String?
+  policy_status     String?
+  policy_reason     String?
+  policy_priority   String?
+  retry_after_seconds Int?
+  requires_human_review Boolean?
+  queue_id          String?
   interactions      InteractionLog[]

   @@map("messages")
@@ -233,6 +239,82 @@ model MessageRequest {
   @@map("message_requests")
 }

+
+
+model MessageQueue {
+  id                   String   @id
+  message_id           String?
+  match_id             String
+  sender_id            String
+  org_id               String?
+  queue_status         String
+  queue_rank           String
+  queue_score          Int
+  queue_priority_label String?
+  policy_reason        String?
+  retry_after_seconds  Int?
+  requires_human_review Boolean @default(false)
+  metadata             Json?
+  created_at           DateTime @default(now())
+  updated_at           DateTime?
+
+  @@map("message_queue")
+}
+
+model MessagePolicyDecision {
+  id                    String   @id
+  queue_id              String?
+  sender_id             String
+  org_id                String?
+  match_id              String
+  action                String
+  reason                String
+  trust_score           Int
+  keyword_risk_score    Float
+  frequency_count       Int
+  first_response_priority Boolean @default(false)
+  queue_rank            String?
+  queue_score           Int?
+  queue_priority_label  String?
+  retry_after_seconds   Int?
+  requires_human_review Boolean @default(false)
+  false_positive        Boolean @default(false)
+  reviewer_id           String?
+  reviewer_notes        String?
+  created_at            DateTime @default(now())
+  updated_at            DateTime?
+
+  @@map("message_policy_decisions")
+}
+
+model SenderReputation {
+  id                    String   @id
+  sender_id             String   @unique
+  trust_score           Float    @default(50)
+  spam_reports          Int      @default(0)
+  positive_interactions Int      @default(0)
+  updated_at            DateTime?
+
+  @@map("sender_reputation")
+}
+
+model CommunicationPolicyConfig {
+  id                           String   @id
+  scope                        String
+  org_id                       String?
+  max_outreach_per_window      Int
+  outreach_window_minutes      Int
+  cooldown_seconds             Int
+  premium_boost                Int
+  verified_boost               Int
+  keyword_risk_threshold_soft  Float
+  keyword_risk_threshold_hard  Float
+  updated_by                   String?
+  updated_at                   DateTime?
+
+  @@map("communication_policy_configs")
+}
+
 model Notification {
   id         String   @id
   user_id    String
diff --git a/server/controllers/messageController.js b/server/controllers/messageController.js
index 7519267..ca1663c 100644
--- a/server/controllers/messageController.js
+++ b/server/controllers/messageController.js
@@ -13,6 +13,12 @@ import {
   tieredInbox,
 } from '../services/messageService.js'
 import { maybeGenerateBotReply } from '../services/chatbotService.js'
+import {
+  getWeeklyDecisionQualityReport,
+  listPolicyFalsePositiveCandidates,
+  markPolicyDecisionFalsePositive,
+  upsertCommunicationPolicyConfig,
+} from '../services/communicationPolicyService.js'
 import { readJson } from '../utils/jsonStore.js'

 export async function sendMessage(req, res) {
@@ -45,6 +51,9 @@ export async function sendMessage(req, res) {
       error: error.message || 'Unable to send message',
       code: error.code || undefined,
       lock: error.lock || undefined,
+      reason: error?.policy?.reason || undefined,
+      retry_after_seconds: Number(error?.policy?.retry_after_seconds || 0) || undefined,
+      policy: error?.policy || undefined,
     })
   }
 }
@@ -129,7 +138,12 @@ export async function uploadMessageAttachment(req, res) {

     return res.status(201).json({ ...created, bot_reply: botReply })
   } catch (error) {
-    return res.status(error.status || 400).json({ error: error.message || 'Unable to send message attachment' })
+    return res.status(error.status || 400).json({
+      error: error.message || 'Unable to send message attachment',
+      reason: error?.policy?.reason || undefined,
+      retry_after_seconds: Number(error?.policy?.retry_after_seconds || 0) || undefined,
+      policy: error?.policy || undefined,
+    })
   }
 }

@@ -161,3 +175,46 @@ export async function rejectRequest(req, res) {
   const request = await rejectMessageRequest(req.params.threadId, req.user.id)
   return res.json({ ok: true, request })
 }
+
+
+export async function updatePolicyConfig(req, res) {
+  const role = String(req.user?.role || '').toLowerCase()
+  if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can update communication policy config' })
+
+  try {
+    const updated = await upsertCommunicationPolicyConfig({
+      scope: req.body?.scope || 'global',
+      org_id: req.body?.org_id || null,
+      config: req.body?.config || {},
+      actor_id: req.user?.id || '',
+    })
+    return res.json({ ok: true, config: updated })
+  } catch (error) {
+    return res.status(error.status || 400).json({ error: error.message || 'Unable to update policy config' })
+  }
+}
+
+export async function listPolicyReviewQueue(req, res) {
+  const role = String(req.user?.role || '').toLowerCase()
+  if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can access policy review queue' })
+
+  const rows = await listPolicyFalsePositiveCandidates()
+  return res.json({ rows })
+}
+
+export async function markPolicyFalsePositive(req, res) {
+  const role = String(req.user?.role || '').toLowerCase()
+  if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can mark false positives' })
+
+  const updated = await markPolicyDecisionFalsePositive(req.params.decisionId, req.user.id, req.body?.notes || '')
+  if (!updated) return res.status(404).json({ error: 'Decision not found' })
+  return res.json({ ok: true, decision: updated })
+}
+
+export async function weeklyPolicyDecisionQualityReport(req, res) {
+  const role = String(req.user?.role || '').toLowerCase()
+  if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can access policy quality reports' })
+
+  const report = await getWeeklyDecisionQualityReport()
+  return res.json(report)
+}
diff --git a/server/routes/messageRoutes.js b/server/routes/messageRoutes.js
index a2d5f48..c295f1c 100644
--- a/server/routes/messageRoutes.js
+++ b/server/routes/messageRoutes.js
@@ -11,6 +11,10 @@ import {
   sendFriendDirectMessage,
   sendMessage,
   uploadMessageAttachment,
+  listPolicyReviewQueue,
+  markPolicyFalsePositive,
+  updatePolicyConfig,
+  weeklyPolicyDecisionQualityReport,
 } from '../controllers/messageController.js'

 const router = Router()
@@ -33,6 +37,11 @@ router.get('/inbox', requireAuth, inbox)
 router.post('/requests/:threadId/accept', requireAuth, acceptRequest)
 router.post('/requests/:threadId/reject', requireAuth, rejectRequest)
 router.post('/friend/:userId', requireAuth, sendFriendDirectMessage)
+
+router.get('/policy/review-queue', requireAuth, listPolicyReviewQueue)
+router.post('/policy/review-queue/:decisionId/false-positive', requireAuth, markPolicyFalsePositive)
+router.get('/policy/reports/weekly-decision-quality', requireAuth, weeklyPolicyDecisionQualityReport)
+router.put('/policy/config', requireAuth, updatePolicyConfig)
 router.post('/:matchId/read', requireAuth, markRead)
 router.post('/:matchId/upload', requireAuth, upload.single('file'), uploadMessageAttachment)
 router.post('/:matchId', requireAuth, sendMessage)
diff --git a/server/server.js b/server/server.js
index 7b16632..44ef459 100644
--- a/server/server.js
+++ b/server/server.js
@@ -337,7 +337,10 @@ async function relayChatMessage(socket, payload) {
       source_id: payload?.source_id,
       source_label: payload?.source_label,
     })
-    for (const peer of room) {
+
+    const shouldBroadcast = String(created?.policy_status || 'delivered') === 'delivered'
+    const peers = shouldBroadcast ? [...room] : [socket]
+    for (const peer of peers) {
       sendWs(peer, {
         type: 'chat_message',
         match_id: matchId,
@@ -361,7 +364,14 @@ async function relayChatMessage(socket, payload) {
     }
   } catch (error) {
     logError('chat_message_failed', error)
-    sendWs(socket, { type: 'chat_error', error: 'Unable to send message' })
+    const policyReason = error?.policy?.reason || null
+    const retryAfter = Number(error?.policy?.retry_after_seconds || 0)
+    sendWs(socket, {
+      type: 'chat_error',
+      error: error?.message || 'Unable to send message',
+      reason: policyReason,
+      retry_after_seconds: retryAfter,
+    })
   }
 }

diff --git a/server/services/__tests__/communicationPolicyService.contract.test.js b/server/services/__tests__/communicationPolicyService.contract.test.js
new file mode 100644
index 0000000..676b370
--- /dev/null
+++ b/server/services/__tests__/communicationPolicyService.contract.test.js
@@ -0,0 +1,114 @@
+import test from 'node:test'
+import assert from 'node:assert/strict'
+
+import { evaluatePolicyContract } from '../communicationPolicyService.js'
+
+function baseConfig() {
+  return {
+    max_outreach_per_window: 3,
+    outreach_window_minutes: 15,
+    cooldown_seconds: 45,
+    premium_boost: 20,
+    verified_boost: 30,
+    keyword_risk_threshold_soft: 0.4,
+    keyword_risk_threshold_hard: 0.75,
+  }
+}
+
+function recentMessage(senderId, matchId, text = 'hello') {
+  return {
+    sender_id: senderId,
+    match_id: matchId,
+    message: text,
+    timestamp: new Date().toISOString(),
+  }
+}
+
+test('verified sender is delayed (not rejected) on burst frequency limits', () => {
+  const config = baseConfig()
+  const messages = [
+    recentMessage('u-1', 'm-1', 'msg-1'),
+    recentMessage('u-1', 'm-1', 'msg-2'),
+    recentMessage('u-1', 'm-1', 'msg-3'),
+  ]
+
+  const result = evaluatePolicyContract({
+    sender: { id: 'u-1', verified: true, subscription_status: 'free' },
+    matchId: 'm-1',
+    text: 'new outreach',
+    messages,
+    config,
+    trustScore: 55,
+  })
+
+  assert.equal(result.action, 'delayed_queue')
+  assert.equal(result.reason, 'frequency_limit_boosted')
+})
+
+test('premium sender gets delayed queue while free sender gets reject under same burst', () => {
+  const config = baseConfig()
+  const messages = [
+    recentMessage('u-2', 'm-2', 'x1'),
+    recentMessage('u-2', 'm-2', 'x2'),
+    recentMessage('u-2', 'm-2', 'x3'),
+  ]
+
+  const premium = evaluatePolicyContract({
+    sender: { id: 'u-2', verified: false, subscription_status: 'premium' },
+    matchId: 'm-2',
+    text: 'premium burst',
+    messages,
+    config,
+    trustScore: 55,
+  })
+
+  const free = evaluatePolicyContract({
+    sender: { id: 'u-2', verified: false, subscription_status: 'free' },
+    matchId: 'm-2',
+    text: 'free burst',
+    messages,
+    config,
+    trustScore: 55,
+  })
+
+  assert.equal(premium.action, 'delayed_queue')
+  assert.equal(free.action, 'reject')
+  assert.equal(free.reason, 'frequency_limit')
+})
+
+test('new user burst behavior rejects after cap for unverified free users', () => {
+  const config = baseConfig()
+  const messages = [
+    recentMessage('new-user', 'thread', 'm1'),
+    recentMessage('new-user', 'thread', 'm2'),
+    recentMessage('new-user', 'thread', 'm3'),
+  ]
+
+  const result = evaluatePolicyContract({
+    sender: { id: 'new-user', verified: false, subscription_status: 'free' },
+    matchId: 'thread',
+    text: 'another message in same window',
+    messages,
+    config,
+    trustScore: 30,
+  })
+
+  assert.equal(result.action, 'reject')
+  assert.equal(result.reason, 'frequency_limit')
+  assert.equal(result.retryAfterSeconds, 45)
+})
+
+test('multilingual spam patterns trigger human review', () => {
+  const config = baseConfig()
+  const result = evaluatePolicyContract({
+    sender: { id: 'ml-spam', verified: false, subscription_status: 'free' },
+    matchId: 'm-4',
+    text: 'বিনামূল্যে অফার! এখন যোগাযোগ করুন telegram t.me/example 免费点击',
+    messages: [],
+    config,
+    trustScore: 40,
+  })
+
+  assert.equal(result.action, 'require_human_review')
+  assert.equal(result.reason, 'keyword_risk_hard')
+})
diff --git a/server/services/communicationPolicyService.js b/server/services/communicationPolicyService.js
new file mode 100644
index 0000000..8df4ee0
--- /dev/null
+++ b/server/services/communicationPolicyService.js
@@ -0,0 +1,392 @@
+import crypto from 'crypto'
+import { readJson, writeJson } from '../utils/jsonStore.js'
+import { sanitizeString } from '../utils/validators.js'
+
+const MESSAGE_FILE = 'messages.json'
+const USERS_FILE = 'users.json'
+const CONFIG_FILE = 'communication_policy_configs.json'
+const QUEUE_FILE = 'message_queue.json'
+const DECISIONS_FILE = 'message_policy_decisions.json'
+const REPUTATION_FILE = 'sender_reputation.json'
+const METRICS_FILE = 'policy_metrics.json'
+
+const DEFAULT_GLOBAL_CONFIG = {
+  id: 'global',
+  scope: 'global',
+  max_outreach_per_window: 12,
+  outreach_window_minutes: 15,
+  cooldown_seconds: 30,
+  premium_boost: 20,
+  verified_boost: 30,
+  keyword_risk_threshold_soft: 0.45,
+  keyword_risk_threshold_hard: 0.75,
+}
+
+const RISK_PATTERNS = [
+  { pattern: /(free\s+money|crypto\s+airdrop|guaranteed\s+profit|click\s+here)/i, weight: 0.45 },
+  { pattern: /(http:\/\/|bit\.ly|t\.me|wa\.me|telegram|whatsapp|contact\s+me\s+on)/i, weight: 0.35 },
+  { pattern: /(urgent|act\s+now|limited\s+offer|winner)/i, weight: 0.2 },
+  { pattern: /(免费|点击|现在联系|优惠|促销)/i, weight: 0.25 },
+  { pattern: /(বিনামূল্যে|অফার|যোগাযোগ|টেলিগ্রাম|হোয়াটসঅ্যাপ|হোয়াটসঅ্যাপ)/i, weight: 0.25 },
+  { pattern: /(oferta|gratis|haz\s+clic|contacta\s+por\s+telegram)/i, weight: 0.2 },
+]
+
+function normalizeText(value = '') {
+  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
+}
+
+function toIso(date = new Date()) {
+  return new Date(date).toISOString()
+}
+
+function addMetric(metrics, key) {
+  metrics[key] = Number(metrics[key] || 0) + 1
+}
+
+function buildConfigMap(configRows = []) {
+  const map = new Map()
+  for (const row of configRows) {
+    if (!row || !row.id) continue
+    map.set(String(row.id), row)
+  }
+  if (!map.has('global')) map.set('global', DEFAULT_GLOBAL_CONFIG)
+  return map
+}
+
+function resolvePolicyConfig(configMap, orgId = '') {
+  const global = { ...DEFAULT_GLOBAL_CONFIG, ...(configMap.get('global') || {}) }
+  if (!orgId) return global
+  const orgRow = configMap.get(`org:${orgId}`)
+  if (!orgRow) return global
+  return { ...global, ...orgRow }
+}
+
+function senderBoost(sender, config) {
+  let boost = 0
+  if (String(sender?.subscription_status || '').toLowerCase() === 'premium') boost += Number(config.premium_boost || 0)
+  if (sender?.verified) boost += Number(config.verified_boost || 0)
+  return boost
+}
+
+function estimateKeywordRisk(text = '') {
+  const normalized = normalizeText(text)
+  if (!normalized) return 0
+  let risk = 0
+  for (const entry of RISK_PATTERNS) {
+    if (entry.pattern.test(normalized)) risk += entry.weight
+  }
+  return Math.max(0, Math.min(1, risk))
+}
+
+function withinWindow(messages = [], senderId, windowMinutes = 15) {
+  const cutoff = Date.now() - Number(windowMinutes || 15) * 60 * 1000
+  return messages.filter((row) => (
+    String(row.sender_id || '') === String(senderId || '') &&
+    new Date(row.timestamp || 0).getTime() >= cutoff
+  ))
+}
+
+function hasRecentDuplicate(messages = [], senderId, matchId, text = '') {
+  const normalized = normalizeText(text)
+  if (!normalized) return false
+  const cutoff = Date.now() - 10 * 60 * 1000
+  return messages.some((row) => {
+    if (String(row.sender_id || '') !== String(senderId || '')) return false
+    if (String(row.match_id || '') !== String(matchId || '')) return false
+    if (new Date(row.timestamp || 0).getTime() < cutoff) return false
+    return normalizeText(row.message || '') === normalized
+  })
+}
+
+function firstResponsePriority(messages = [], matchId, senderId) {
+  const threadMessages = messages.filter((row) => String(row.match_id || '') === String(matchId || ''))
+  const hasSentBefore = threadMessages.some((row) => String(row.sender_id || '') === String(senderId || ''))
+  const isNewThread = threadMessages.length <= 2
+  return !hasSentBefore && isNewThread
+}
+
+function queueRanking({ sender, trustScore, riskScore, config, firstResponse }) {
+  const base = Number(trustScore || 0)
+  const boost = senderBoost(sender, config)
+  const firstResponseBonus = firstResponse ? 15 : 0
+  const riskPenalty = Math.round(Number(riskScore || 0) * 70)
+  const total = base + boost + firstResponseBonus - riskPenalty
+  if (total >= 85) return { rank: 'urgent', score: total, label: 'P1-Urgent' }
+  if (total >= 60) return { rank: 'high', score: total, label: 'P2-High' }
+  if (total >= 40) return { rank: 'standard', score: total, label: 'P3-Standard' }
+  return { rank: 'low', score: total, label: 'P4-Low' }
+}
+
+function rejectionReason(action, reason, retryAfterSeconds = 0) {
+  if (action !== 'reject') return ''
+  if (reason === 'duplicate_suppression') return 'Duplicate message detected. Please send a unique message.'
+  if (reason === 'frequency_limit') return `Rate limit reached. Retry after ${Math.max(1, Number(retryAfterSeconds || 0))} seconds.`
+  if (reason === 'keyword_risk_hard') return 'Message blocked by communication safety policy.'
+  return 'Message rejected by policy.'
+}
+
+async function ensureDefaultConfigRows() {
+  const current = await readJson(CONFIG_FILE)
+  const rows = Array.isArray(current) ? current : []
+  if (!rows.some((row) => row?.id === 'global')) {
+    rows.push({ ...DEFAULT_GLOBAL_CONFIG, updated_at: toIso() })
+    await writeJson(CONFIG_FILE, rows)
+  }
+  return rows
+}
+
+
+export function evaluatePolicyContract({ sender = null, matchId = '', text = '', messages = [], config = DEFAULT_GLOBAL_CONFIG, trustScore = 50 }) {
+  const riskScore = estimateKeywordRisk(text)
+  const recentMessages = withinWindow(messages, sender?.id || '', config.outreach_window_minutes)
+  const duplicate = hasRecentDuplicate(messages, sender?.id || '', matchId, text)
+  const firstResponse = firstResponsePriority(messages, matchId, sender?.id || '')
+  const ranking = queueRanking({ sender, trustScore, riskScore, config, firstResponse })
+
+  let action = 'allow'
+  let reason = 'policy_allow'
+  let retryAfterSeconds = 0
+  if (duplicate) {
+    action = 'reject'
+    reason = 'duplicate_suppression'
+  } else if (riskScore >= Number(config.keyword_risk_threshold_hard || 0.75)) {
+    action = 'require_human_review'
+    reason = 'keyword_risk_hard'
+  } else if (recentMessages.length >= Number(config.max_outreach_per_window || 12)) {
+    retryAfterSeconds = Number(config.cooldown_seconds || 30)
+    if (sender?.verified || String(sender?.subscription_status || '').toLowerCase() === 'premium') {
+      action = 'delayed_queue'
+      reason = 'frequency_limit_boosted'
+    } else {
+      action = 'reject'
+      reason = 'frequency_limit'
+    }
+  } else if (riskScore >= Number(config.keyword_risk_threshold_soft || 0.45)) {
+    action = 'delayed_queue'
+    reason = 'keyword_risk_soft'
+    retryAfterSeconds = Number(config.cooldown_seconds || 30)
+  }
+
+  return {
+    action,
+    reason,
+    riskScore,
+    retryAfterSeconds,
+    recentCount: recentMessages.length,
+    ranking,
+    firstResponse,
+  }
+}
+
+export async function evaluateMessagePolicy({ sender = null, matchId = '', text = '', type = 'text', orgId = '' }) {
+  const [messages, configsRaw, queueRowsRaw, decisionRowsRaw, reputationRowsRaw, metricsRaw] = await Promise.all([
+    readJson(MESSAGE_FILE),
+    ensureDefaultConfigRows(),
+    readJson(QUEUE_FILE),
+    readJson(DECISIONS_FILE),
+    readJson(REPUTATION_FILE),
+    readJson(METRICS_FILE),
+  ])
+
+  const configMap = buildConfigMap(configsRaw)
+  const config = resolvePolicyConfig(configMap, orgId)
+  const queueRows = Array.isArray(queueRowsRaw) ? queueRowsRaw : []
+  const decisionRows = Array.isArray(decisionRowsRaw) ? decisionRowsRaw : []
+  const reputationRows = Array.isArray(reputationRowsRaw) ? reputationRowsRaw : []
+  const metrics = (metricsRaw && typeof metricsRaw === 'object' && !Array.isArray(metricsRaw)) ? metricsRaw : {}
+
+  const senderId = String(sender?.id || '')
+  const nowIso = toIso()
+  const reputationIdx = reputationRows.findIndex((row) => String(row.sender_id || '') === senderId)
+  const reputation = reputationIdx >= 0
+    ? reputationRows[reputationIdx]
+    : { id: crypto.randomUUID(), sender_id: senderId, trust_score: 50, spam_reports: 0, positive_interactions: 0, updated_at: nowIso }
+
+  const trustScore = Math.max(0, Math.min(100, Number(reputation.trust_score || 50)))
+  const contract = evaluatePolicyContract({ sender, matchId, text, messages, config, trustScore })
+  const riskScore = contract.riskScore
+  const recentMessages = withinWindow(messages, senderId, config.outreach_window_minutes)
+  const firstResponse = contract.firstResponse
+  const ranking = contract.ranking
+  const action = contract.action
+  const reason = contract.reason
+  const retryAfterSeconds = contract.retryAfterSeconds
+
+  if (action === 'allow') addMetric(metrics, 'allow')
+  if (action === 'delayed_queue') addMetric(metrics, 'delayed_queue')
+  if (action === 'require_human_review') addMetric(metrics, 'require_human_review')
+  if (action === 'reject' && reason === 'duplicate_suppression') addMetric(metrics, 'duplicate_suppression')
+  if (action === 'reject' && reason === 'frequency_limit') addMetric(metrics, 'reject_frequency_limit')
+
+  const decisionId = crypto.randomUUID()
+  const queueId = crypto.randomUUID()
+  const decision = {
+    id: decisionId,
+    queue_id: action === 'allow' ? null : queueId,
+    sender_id: senderId,
+    org_id: orgId || null,
+    match_id: sanitizeString(String(matchId || ''), 160),
+    action,
+    reason,
+    trust_score: trustScore,
+    keyword_risk_score: Number(riskScore.toFixed(4)),
+    frequency_count: recentMessages.length,
+    first_response_priority: firstResponse,
+    queue_rank: ranking.rank,
+    queue_score: ranking.score,
+    queue_priority_label: ranking.label,
+    retry_after_seconds: retryAfterSeconds,
+    requires_human_review: action === 'require_human_review',
+    false_positive: false,
+    reviewer_id: null,
+    reviewer_notes: null,
+    created_at: nowIso,
+    updated_at: nowIso,
+  }
+
+  decisionRows.push(decision)
+
+  if (action !== 'allow') {
+    queueRows.push({
+      id: queueId,
+      message_id: null,
+      match_id: sanitizeString(String(matchId || ''), 160),
+      sender_id: senderId,
+      org_id: orgId || null,
+      queue_status: action === 'require_human_review' ? 'needs_review' : 'queued',
+      queue_rank: ranking.rank,
+      queue_score: ranking.score,
+      queue_priority_label: ranking.label,
+      policy_reason: reason,
+      retry_after_seconds: retryAfterSeconds,
+      requires_human_review: action === 'require_human_review',
+      metadata: {
+        message_type: type,
+      },
+      created_at: nowIso,
+      updated_at: nowIso,
+    })
+  }
+
+  if (reputationIdx >= 0) {
+    reputationRows[reputationIdx] = {
+      ...reputationRows[reputationIdx],
+      trust_score: action === 'reject' ? Math.max(0, trustScore - 2) : Math.min(100, trustScore + 0.2),
+      updated_at: nowIso,
+    }
+  } else {
+    reputationRows.push(reputation)
+  }
+
+  await Promise.all([
+    writeJson(QUEUE_FILE, queueRows),
+    writeJson(DECISIONS_FILE, decisionRows),
+    writeJson(REPUTATION_FILE, reputationRows),
+    writeJson(METRICS_FILE, metrics),
+  ])
+
+  return {
+    action,
+    reason,
+    queue: action === 'allow' ? null : queueRows[queueRows.length - 1],
+    decision,
+    retry_after_seconds: retryAfterSeconds,
+    rejection_message: rejectionReason(action, reason, retryAfterSeconds),
+  }
+}
+
+export async function attachMessageToQueue(queueId, messageId) {
+  if (!queueId || !messageId) return
+  const queueRows = await readJson(QUEUE_FILE)
+  const nextRows = Array.isArray(queueRows) ? queueRows : []
+  const idx = nextRows.findIndex((row) => String(row.id || '') === String(queueId))
+  if (idx < 0) return
+  nextRows[idx] = {
+    ...nextRows[idx],
+    message_id: String(messageId),
+    updated_at: toIso(),
+  }
+  await writeJson(QUEUE_FILE, nextRows)
+}
+
+export async function listPolicyFalsePositiveCandidates() {
+  const decisions = await readJson(DECISIONS_FILE)
+  const rows = Array.isArray(decisions) ? decisions : []
+  return rows
+    .filter((row) => ['reject', 'require_human_review', 'delayed_queue'].includes(String(row.action || '')))
+    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
+    .slice(0, 200)
+}
+
+export async function markPolicyDecisionFalsePositive(decisionId, reviewerId, notes = '') {
+  const decisions = await readJson(DECISIONS_FILE)
+  const next = Array.isArray(decisions) ? decisions : []
+  const idx = next.findIndex((row) => String(row.id || '') === String(decisionId || ''))
+  if (idx < 0) return null
+  next[idx] = {
+    ...next[idx],
+    false_positive: true,
+    reviewer_id: sanitizeString(String(reviewerId || ''), 120) || null,
+    reviewer_notes: sanitizeString(String(notes || ''), 400) || null,
+    updated_at: toIso(),
+  }
+  await writeJson(DECISIONS_FILE, next)
+  return next[idx]
+}
+
+export async function getWeeklyDecisionQualityReport() {
+  const decisions = await readJson(DECISIONS_FILE)
+  const metrics = await readJson(METRICS_FILE)
+  const rows = Array.isArray(decisions) ? decisions : []
+  const since = Date.now() - 7 * 24 * 60 * 60 * 1000
+  const weekly = rows.filter((row) => new Date(row.created_at || 0).getTime() >= since)
+
+  const byAction = weekly.reduce((acc, row) => {
+    const key = String(row.action || 'unknown')
+    acc[key] = Number(acc[key] || 0) + 1
+    return acc
+  }, {})
+  const falsePositives = weekly.filter((row) => row.false_positive).length
+  const reviewed = weekly.filter((row) => row.reviewer_id || row.false_positive).length
+
+  return {
+    window: '7d',
+    generated_at: toIso(),
+    totals: {
+      decisions: weekly.length,
+      false_positives: falsePositives,
+      reviewed,
+      false_positive_rate: weekly.length ? Number((falsePositives / weekly.length).toFixed(4)) : 0,
+    },
+    by_action: byAction,
+    policy_hit_counters: (metrics && typeof metrics === 'object' && !Array.isArray(metrics)) ? metrics : {},
+  }
+}
+
+export async function upsertCommunicationPolicyConfig({ scope = 'global', org_id = null, config = {}, actor_id = '' }) {
+  const safeScope = scope === 'org' ? 'org' : 'global'
+  const rows = await ensureDefaultConfigRows()
+  const id = safeScope === 'global' ? 'global' : `org:${sanitizeString(String(org_id || ''), 120)}`
+  if (safeScope === 'org' && !org_id) {
+    const err = new Error('org_id is required for org scope policy updates')
+    err.status = 400
+    throw err
+  }
+
+  const idx = rows.findIndex((row) => String(row.id || '') === id)
+  const base = safeScope === 'global' ? DEFAULT_GLOBAL_CONFIG : { ...DEFAULT_GLOBAL_CONFIG, scope: 'org', org_id }
+  const nextRow = {
+    ...(idx >= 0 ? rows[idx] : base),
+    ...config,
+    id,
+    scope: safeScope,
+    org_id: safeScope === 'org' ? org_id : null,
+    updated_by: sanitizeString(String(actor_id || ''), 120) || null,
+    updated_at: toIso(),
+  }
+
+  if (idx >= 0) rows[idx] = nextRow
+  else rows.push(nextRow)
+  await writeJson(CONFIG_FILE, rows)
+  return nextRow
+}
diff --git a/server/services/messageService.js b/server/services/messageService.js
index 65772c0..317aadc 100644
--- a/server/services/messageService.js
+++ b/server/services/messageService.js
@@ -13,6 +13,7 @@ import { upsertLeadFromMessage } from './leadService.js'
 import { assertMessagingAllowed, moderateTextOrRedactWithContext } from './policyService.js'
 import { getRequirementById } from './requirementService.js'
 import { autoSummarizeMatch, resolveOrgOwnerFromMatch } from './aiConversationService.js'
+import { attachMessageToQueue, evaluateMessagePolicy } from './communicationPolicyService.js'

 const FILE = 'messages.json'
 const USERS_FILE = 'users.json'
@@ -286,6 +287,12 @@ export async function postMessage(matchId, senderId, message, type = 'text', att
     timestamp: new Date().toISOString(),
     type,
     attachment: safeAttachment && safeAttachment.url ? safeAttachment : null,
+    policy_status: 'delivered',
+    policy_reason: 'policy_allow',
+    policy_priority: null,
+    retry_after_seconds: 0,
+    requires_human_review: false,
+    queue_id: null,
   }

   const sender = users.find((u) => u.id === senderId)
@@ -316,6 +323,38 @@ export async function postMessage(matchId, senderId, message, type = 'text', att

   await enforceConversationLock(matchId, sender)

+  const policyResult = await evaluateMessagePolicy({
+    sender,
+    matchId,
+    text: sanitizeString(message, 2000),
+    type,
+    orgId: sender?.org_owner_id || sender?.id || '',
+  })
+
+  if (policyResult.action === 'reject') {
+    const err = new Error(policyResult.rejection_message || 'Message rejected by communication policy')
+    err.status = 429
+    err.code = 'POLICY_REJECTED'
+    err.policy = policyResult
+    throw err
+  }
+
+  if (policyResult.action === 'delayed_queue') {
+    entry.policy_status = 'queued'
+    entry.policy_reason = policyResult.reason
+    entry.policy_priority = policyResult?.decision?.queue_priority_label || null
+    entry.retry_after_seconds = Number(policyResult.retry_after_seconds || 0)
+    entry.queue_id = policyResult?.queue?.id || null
+  }
+
+  if (policyResult.action === 'require_human_review') {
+    entry.policy_status = 'needs_review'
+    entry.policy_reason = policyResult.reason
+    entry.policy_priority = policyResult?.decision?.queue_priority_label || null
+    entry.requires_human_review = true
+    entry.queue_id = policyResult?.queue?.id || null
+  }
+
   const recentContext = messages
     .filter((m) => String(m.match_id || '') === String(matchId || ''))
     .slice(-5)
@@ -334,6 +373,10 @@ export async function postMessage(matchId, senderId, message, type = 'text', att
   entry.moderation_reason = moderation.reason || ''
   messages.push(entry)

+  if (entry.queue_id) {
+    await attachMessageToQueue(entry.queue_id, entry.id)
+  }
+
   if (!sender?.verified) {
     upsertRequestState(messageRequests, matchId, { status: 'pending', acted_by: null, acted_at: null })
   }
diff --git a/server/utils/jsonStore.js b/server/utils/jsonStore.js
index 7cca9f9..f729c5a 100644
--- a/server/utils/jsonStore.js
+++ b/server/utils/jsonStore.js
@@ -147,6 +147,10 @@ const FILE_HANDLERS = {
   'coupon_codes.json': tableHandler('couponCode', ['id']),
   'coupon_redemptions.json': tableHandler('couponRedemption', ['id']),
   'message_reads.json': tableHandler('messageRead', ['match_id', 'user_id'], 'match_id_user_id'),
+  'message_queue.json': tableHandler('messageQueue', ['id']),
+  'message_policy_decisions.json': tableHandler('messagePolicyDecision', ['id']),
+  'sender_reputation.json': tableHandler('senderReputation', ['id']),
+  'communication_policy_configs.json': tableHandler('communicationPolicyConfig', ['id']),
 }

 const ratingsHandler = {
diff --git a/src/lib/auth.js b/src/lib/auth.js
index 7bc2061..7ac62ef 100644
--- a/src/lib/auth.js
+++ b/src/lib/auth.js
@@ -88,6 +88,7 @@ export async function apiRequest(path, { method = 'GET', token = '', body, signa
     }
     const error = new Error(data.error || 'Request failed')
     error.status = res.status
+    error.details = data
     throw error
   }
   return data
diff --git a/src/pages/ChatInterface.jsx b/src/pages/ChatInterface.jsx
index 540eab2..b68d7fd 100644
--- a/src/pages/ChatInterface.jsx
+++ b/src/pages/ChatInterface.jsx
@@ -118,6 +118,10 @@ function normalizeThreads(messages = [], currentUserId = '') {
         isFriendThread: String(message.match_id || '').startsWith('friend:'),
         friendRequestStatus: message.friend_request_status || null,
         friendRequestDirection: message.friend_request_direction || null,
+        policyStatus: message.policy_status || 'delivered',
+        policyPriority: message.policy_priority || null,
+        policyReason: message.policy_reason || '',
+        retryAfterSeconds: Number(message.retry_after_seconds || 0),
       })
       if (otherCandidate) {
         latestByOther.set(message.match_id, otherCandidate)
@@ -136,6 +140,10 @@ function normalizeThreads(messages = [], currentUserId = '') {
         friendRequestDirection: message.friend_request_direction || existing.friendRequestDirection || null,
         unread: Number(message.unread_count || existing.unread || 0),
         lastReadAt: message.last_read_at || existing.lastReadAt || null,
+        policyStatus: message.policy_status || existing.policyStatus || 'delivered',
+        policyPriority: message.policy_priority || existing.policyPriority || null,
+        policyReason: message.policy_reason || existing.policyReason || '',
+        retryAfterSeconds: Number(message.retry_after_seconds || existing.retryAfterSeconds || 0),
       })
     }

@@ -341,6 +349,7 @@ export default function ChatInterface() {
   const [, setChatConnectionStatus] = useState('offline')
   const [uploading, setUploading] = useState(false)
   const [uploadStatus, setUploadStatus] = useState('')
+  const [policyFeedback, setPolicyFeedback] = useState({ reason: '', retryAfter: 0 })
   const [callPromptThread, setCallPromptThread] = useState(null)
   const [previewAttachment, setPreviewAttachment] = useState(null)
   const [accordionState, setAccordionState] = useState({
@@ -803,6 +812,10 @@ export default function ChatInterface() {

         if (payload.type === 'chat_error') {
           setChatConnectionStatus('online')
+          const retryAfter = Number(payload.retry_after_seconds || 0)
+          if (payload.reason || retryAfter > 0) {
+            setPolicyFeedback({ reason: payload.reason || payload.error || 'policy_blocked', retryAfter })
+          }
           if (!String(payload.error || '').toLowerCase().includes('forbidden')) {
             setError(payload.error || 'Live messaging issue')
           }
@@ -1203,6 +1216,14 @@ export default function ChatInterface() {
     }
   }

+  useEffect(() => {
+    if (!policyFeedback.retryAfter || policyFeedback.retryAfter <= 0) return undefined
+    const timer = window.setInterval(() => {
+      setPolicyFeedback((prev) => ({ ...prev, retryAfter: Math.max(0, Number(prev.retryAfter || 0) - 1) }))
+    }, 1000)
+    return () => window.clearInterval(timer)
+  }, [policyFeedback.retryAfter])
+
   async function sendMessage() {
     const token = getToken()
     if (!token || !activeThread?.matchId) return
@@ -1283,9 +1304,13 @@ export default function ChatInterface() {
       }

       setDraftMessage('')
+      setPolicyFeedback({ reason: '', retryAfter: 0 })
       await loadInbox()
     } catch (err) {
       const msg = err.message || 'Unable to send message'
+      const retryAfter = Number(err?.details?.policy?.retry_after_seconds || err?.details?.retry_after_seconds || 0)
+      const reason = err?.details?.policy?.reason || err?.details?.reason || ''
+      if (reason || retryAfter > 0) setPolicyFeedback({ reason: reason || msg, retryAfter })
       if (msg.toLowerCase().includes('verified-only')) {
         setNotice({
           title: 'Verified suppliers only',
@@ -1595,7 +1620,15 @@ export default function ChatInterface() {
                       <div className="min-w-0 flex-1">
                         <div className="flex items-center justify-between gap-1">
                           <p className={`truncate text-[14px] font-semibold${isActive ? 'text-[var(--gt-blue)]' : ''}`}>{threadName}</p>
-                          <span className="flex-shrink-0 text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
+                          <div className="ml-2 flex flex-shrink-0 items-center gap-1">
+                            {thread.policyStatus && thread.policyStatus !== 'delivered' ? (
+                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">Queued</span>
+                            ) : null}
+                            {thread.policyPriority ? (
+                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700">{thread.policyPriority}</span>
+                            ) : null}
+                            <span className="text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
+                          </div>
                         </div>
                         <div className="flex items-center justify-between gap-2">
                           <p className={`truncate text-xs${isActive ? 'text-slate-600' : hasUnread ? 'text-slate-700' : 'text-slate-400'}`}>{thread.last || 'No messages'}</p>
@@ -1727,6 +1760,14 @@ export default function ChatInterface() {
                           {renderMessageBody(message, isOwn)}
                           <div className={`mt-1 flex items-center gap-2 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-60${isOwn ? 'text-white' : 'text-slate-400'}`}>
                             <span>{formatTime(message.timestamp)}</span>
+                            {message.policy_status && message.policy_status !== 'delivered' ? (
+                              <span className="inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">
+                                {message.policy_status === 'needs_review' ? 'Needs review' : 'Queued'}
+                              </span>
+                            ) : null}
+                            {message.policy_priority ? (
+                              <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-600">{message.policy_priority}</span>
+                            ) : null}
                             {showReadTick ? (
                               <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
                                 ✓ Read
@@ -1816,6 +1857,11 @@ export default function ChatInterface() {
                     <SendHorizontal size={18} />
                   </button>
                 </div>
+                {policyFeedback.reason ? (
+                  <p className="mt-2 px-4 text-[11px] font-medium text-rose-500">
+                    Blocked: {policyFeedback.reason}{policyFeedback.retryAfter > 0 ? ` • Retry in ${policyFeedback.retryAfter}s` : ''}
+                  </p>
+                ) : null}
                 {uploadStatus || scheduleStatus ? (
                   <p className="mt-2 px-4 text-[11px] font-medium text-[var(--gt-blue)]">{uploadStatus || scheduleStatus}</p>
                 ) : null}
```

## Why This Change

Add communication policy engine, queue moderation flow, and chat policy UI states

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 11 files changed, 836 insertions(+), 4 deletions(-)
- **Risk:** Moderate

## Relationships

Commit 205 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
