## Commit Metadata

- **Hash:** c6ff2cba21f122c8bf058001640342ad4bc6e373
- **Parent:** 5f6d7cfc670e637d0c7c89f1278e0aa7a72dcddb 59009cad8a2c177d48d805b8cbc194a7ba4798a9
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 20:28:13
- **Message:** Merge pull request #70 from gamertoky1188gro/codex/extend-prisma-schema-with-models-and-foreign-keys

## Custom Title

Merge pull request #70 from gamertoky1188gro/codex/extend-prisma-schema-with-models-and-foreign-keys

## High-Level Summary

Merge pull request #70 from gamertoky1188gro/codex/extend-prisma-schema-with-models-and-foreign-keys

10 files changed, 651 insertions(+), 79 deletions(-)

## File-by-File Breakdown

.../migration.sql | 127 +++++++++++
prisma/schema.prisma | 27 ++-
scripts/db/migrate-crm-json-to-sql.mjs | 241 +++++++++++++++++++++
server/services/analyticsService.js | 32 +--
server/services/crmService.js | 56 +++--
server/services/leadReminderService.js | 34 ++-
server/services/leadService.js | 155 +++++++++++--
server/services/messageService.js | 35 +--
server/utils/crmFallbackStore.js | 22 ++
server/utils/jsonStore.js | 1 +
10 files changed, 651 insertions(+), 79 deletions(-)

## Detailed Diff Analysis

```diff
diff --git a/prisma/migrations/20260405100000_crm_normalized_models/migration.sql b/prisma/migrations/20260405100000_crm_normalized_models/migration.sql
new file mode 100644
index 0000000..3a39204
--- /dev/null
+++ b/prisma/migrations/20260405100000_crm_normalized_models/migration.sql
@@ -0,0 +1,127 @@
+-- Extend CRM tables with normalized lead columns and interaction logs.
+
+ALTER TABLE "leads"
+  ADD COLUMN IF NOT EXISTS "source_type" TEXT,
+  ADD COLUMN IF NOT EXISTS "source_id" TEXT,
+  ADD COLUMN IF NOT EXISTS "source_label" TEXT,
+  ADD COLUMN IF NOT EXISTS "conversion_at" TIMESTAMP(3);
+
+ALTER TABLE "lead_reminders"
+  ALTER COLUMN "done" SET DEFAULT false;
+
+UPDATE "lead_reminders"
+SET "done" = false
+WHERE "done" IS NULL;
+
+ALTER TABLE "lead_reminders"
+  ALTER COLUMN "done" SET NOT NULL,
+  ADD COLUMN IF NOT EXISTS "notified_at" TIMESTAMP(3);
+
+CREATE TABLE IF NOT EXISTS "interaction_logs" (
+  "id" TEXT NOT NULL,
+  "org_owner_id" TEXT NOT NULL,
+  "actor_id" TEXT,
+  "channel" TEXT,
+  "interaction_type" TEXT NOT NULL,
+  "entity_type" TEXT,
+  "entity_id" TEXT,
+  "match_id" TEXT,
+  "metadata" JSONB,
+  "occurred_at" TIMESTAMP(3) NOT NULL,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  CONSTRAINT "interaction_logs_pkey" PRIMARY KEY ("id")
+);
+
+-- Indexes
+CREATE INDEX IF NOT EXISTS "leads_org_owner_id_assigned_agent_id_counterparty_id_match_id_status_updated_at_idx"
+  ON "leads"("org_owner_id", "assigned_agent_id", "counterparty_id", "match_id", "status", "updated_at");
+
+CREATE INDEX IF NOT EXISTS "lead_notes_lead_id_created_at_idx"
+  ON "lead_notes"("lead_id", "created_at");
+
+CREATE INDEX IF NOT EXISTS "lead_reminders_lead_id_remind_at_done_idx"
+  ON "lead_reminders"("lead_id", "remind_at", "done");
+
+CREATE INDEX IF NOT EXISTS "interaction_logs_org_owner_id_interaction_type_occurred_at_idx"
+  ON "interaction_logs"("org_owner_id", "interaction_type", "occurred_at");
+
+-- Foreign keys (guarded for idempotency)
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'leads_org_owner_id_fkey'
+  ) THEN
+    ALTER TABLE "leads"
+      ADD CONSTRAINT "leads_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'leads_assigned_agent_id_fkey'
+  ) THEN
+    ALTER TABLE "leads"
+      ADD CONSTRAINT "leads_assigned_agent_id_fkey" FOREIGN KEY ("assigned_agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'leads_counterparty_id_fkey'
+  ) THEN
+    ALTER TABLE "leads"
+      ADD CONSTRAINT "leads_counterparty_id_fkey" FOREIGN KEY ("counterparty_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'lead_notes_lead_id_fkey'
+  ) THEN
+    ALTER TABLE "lead_notes"
+      ADD CONSTRAINT "lead_notes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'lead_notes_org_owner_id_fkey'
+  ) THEN
+    ALTER TABLE "lead_notes"
+      ADD CONSTRAINT "lead_notes_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'lead_notes_author_id_fkey'
+  ) THEN
+    ALTER TABLE "lead_notes"
+      ADD CONSTRAINT "lead_notes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'lead_reminders_lead_id_fkey'
+  ) THEN
+    ALTER TABLE "lead_reminders"
+      ADD CONSTRAINT "lead_reminders_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'lead_reminders_org_owner_id_fkey'
+  ) THEN
+    ALTER TABLE "lead_reminders"
+      ADD CONSTRAINT "lead_reminders_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'lead_reminders_created_by_fkey'
+  ) THEN
+    ALTER TABLE "lead_reminders"
+      ADD CONSTRAINT "lead_reminders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_org_owner_id_fkey'
+  ) THEN
+    ALTER TABLE "interaction_logs"
+      ADD CONSTRAINT "interaction_logs_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_actor_id_fkey'
+  ) THEN
+    ALTER TABLE "interaction_logs"
+      ADD CONSTRAINT "interaction_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+  END IF;
+END $$;
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 8744827..065e247 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -353,12 +353,17 @@ model Lead {
   match_id             String
   counterparty_id      String?
   source               String?
+  source_type          String?
+  source_id            String?
+  source_label         String?
   status               String?
   assigned_agent_id    String?
+  conversion_at        DateTime?
   created_at           DateTime @default(now())
   updated_at           DateTime?
   last_interaction_at  DateTime?

+  @@index([org_owner_id, assigned_agent_id, counterparty_id, match_id, status, updated_at])
   @@map("leads")
 }

@@ -370,6 +375,7 @@ model LeadNote {
   note         String?
   created_at   DateTime @default(now())

+  @@index([lead_id, created_at])
   @@map("lead_notes")
 }

@@ -380,12 +386,31 @@ model LeadReminder {
   created_by   String
   remind_at    DateTime
   message      String?
-  done         Boolean? @default(false)
+  done         Boolean  @default(false)
+  notified_at  DateTime?
   created_at   DateTime @default(now())

+  @@index([lead_id, remind_at, done])
   @@map("lead_reminders")
 }

+model InteractionLog {
+  id               String   @id
+  org_owner_id     String
+  actor_id         String?
+  channel          String?
+  interaction_type String
+  entity_type      String?
+  entity_id        String?
+  match_id         String?
+  metadata         Json?
+  occurred_at      DateTime
+  created_at       DateTime @default(now())
+
+  @@index([org_owner_id, interaction_type, occurred_at])
+  @@map("interaction_logs")
+}
+
 model AnalyticsEvent {
   id         String   @id
   type       String
diff --git a/scripts/db/migrate-crm-json-to-sql.mjs b/scripts/db/migrate-crm-json-to-sql.mjs
new file mode 100644
index 0000000..f2c9e85
--- /dev/null
+++ b/scripts/db/migrate-crm-json-to-sql.mjs
@@ -0,0 +1,241 @@
+import fs from 'node:fs/promises'
+import path from 'node:path'
+import prisma from '../../server/utils/prisma.js'
+
+const ROOT = process.cwd()
+const LEGACY_DB_DIR = path.join(ROOT, 'server', 'database')
+
+function toIso(value, fallback = null) {
+  if (!value) return fallback
+  const d = new Date(value)
+  return Number.isFinite(d.getTime()) ? d.toISOString() : fallback
+}
+
+async function readLegacyJson(fileName) {
+  const filePath = path.join(LEGACY_DB_DIR, fileName)
+  const raw = await fs.readFile(filePath, 'utf8').catch(() => null)
+  if (!raw) return []
+  try {
+    const parsed = JSON.parse(raw)
+    return Array.isArray(parsed) ? parsed : []
+  } catch {
+    return []
+  }
+}
+
+function sanitizeId(value, fallbackPrefix) {
+  const str = String(value || '').trim()
+  if (str) return str
+  return `${fallbackPrefix}_${Math.random().toString(36).slice(2, 10)}`
+}
+
+async function migrateLeads(leads) {
+  for (const lead of leads) {
+    const id = sanitizeId(lead.id, 'lead')
+    const orgOwnerId = String(lead.org_owner_id || '')
+    if (!orgOwnerId) continue
+    await prisma.lead.upsert({
+      where: { id },
+      update: {
+        org_owner_id: orgOwnerId,
+        match_id: String(lead.match_id || ''),
+        counterparty_id: lead.counterparty_id || null,
+        status: lead.status || 'new',
+        assigned_agent_id: lead.assigned_agent_id || null,
+        source: lead.source || null,
+        source_type: lead.source_type || null,
+        source_id: lead.source_id || null,
+        source_label: lead.source_label || null,
+        conversion_at: toIso(lead.conversion_at),
+        last_interaction_at: toIso(lead.last_interaction_at),
+        updated_at: toIso(lead.updated_at, new Date().toISOString()),
+      },
+      create: {
+        id,
+        org_owner_id: orgOwnerId,
+        match_id: String(lead.match_id || ''),
+        counterparty_id: lead.counterparty_id || null,
+        status: lead.status || 'new',
+        assigned_agent_id: lead.assigned_agent_id || null,
+        source: lead.source || null,
+        source_type: lead.source_type || null,
+        source_id: lead.source_id || null,
+        source_label: lead.source_label || null,
+        conversion_at: toIso(lead.conversion_at),
+        last_interaction_at: toIso(lead.last_interaction_at),
+        created_at: toIso(lead.created_at, new Date().toISOString()),
+        updated_at: toIso(lead.updated_at),
+      },
+    })
+  }
+}
+
+async function migrateLeadNotes(notes) {
+  for (const note of notes) {
+    const id = sanitizeId(note.id, 'lead_note')
+    if (!note.lead_id || !note.org_owner_id || !note.author_id) continue
+    await prisma.leadNote.upsert({
+      where: { id },
+      update: {
+        lead_id: String(note.lead_id),
+        org_owner_id: String(note.org_owner_id),
+        author_id: String(note.author_id),
+        note: note.note || '',
+        created_at: toIso(note.created_at, new Date().toISOString()),
+      },
+      create: {
+        id,
+        lead_id: String(note.lead_id),
+        org_owner_id: String(note.org_owner_id),
+        author_id: String(note.author_id),
+        note: note.note || '',
+        created_at: toIso(note.created_at, new Date().toISOString()),
+      },
+    })
+  }
+}
+
+async function migrateLeadReminders(reminders) {
+  for (const reminder of reminders) {
+    const id = sanitizeId(reminder.id, 'lead_reminder')
+    if (!reminder.lead_id || !reminder.org_owner_id || !reminder.created_by) continue
+    await prisma.leadReminder.upsert({
+      where: { id },
+      update: {
+        lead_id: String(reminder.lead_id),
+        org_owner_id: String(reminder.org_owner_id),
+        created_by: String(reminder.created_by),
+        remind_at: toIso(reminder.remind_at, new Date().toISOString()),
+        message: reminder.message || '',
+        done: Boolean(reminder.done),
+        notified_at: toIso(reminder.notified_at),
+        created_at: toIso(reminder.created_at, new Date().toISOString()),
+      },
+      create: {
+        id,
+        lead_id: String(reminder.lead_id),
+        org_owner_id: String(reminder.org_owner_id),
+        created_by: String(reminder.created_by),
+        remind_at: toIso(reminder.remind_at, new Date().toISOString()),
+        message: reminder.message || '',
+        done: Boolean(reminder.done),
+        notified_at: toIso(reminder.notified_at),
+        created_at: toIso(reminder.created_at, new Date().toISOString()),
+      },
+    })
+  }
+}
+
+async function migrateInteractions(messages, calls) {
+  for (const message of messages) {
+    const id = sanitizeId(message.id, 'il_msg')
+    const matchId = String(message.match_id || '')
+    const senderId = String(message.sender_id || '') || null
+    if (!senderId) continue
+    const eventAt = toIso(message.timestamp || message.created_at, new Date().toISOString())
+    await prisma.interactionLog.upsert({
+      where: { id },
+      update: {
+        org_owner_id: senderId,
+        actor_id: senderId,
+        channel: 'chat',
+        interaction_type: 'message',
+        entity_type: 'message',
+        entity_id: String(message.id || ''),
+        match_id: matchId || null,
+        metadata: {
+          type: message.type || 'text',
+          has_attachment: Boolean(message.attachment),
+        },
+        occurred_at: eventAt,
+      },
+      create: {
+        id,
+        org_owner_id: senderId,
+        actor_id: senderId,
+        channel: 'chat',
+        interaction_type: 'message',
+        entity_type: 'message',
+        entity_id: String(message.id || ''),
+        match_id: matchId || null,
+        metadata: {
+          type: message.type || 'text',
+          has_attachment: Boolean(message.attachment),
+        },
+        occurred_at: eventAt,
+      },
+    }).catch(() => {})
+  }
+
+  for (const call of calls) {
+    const id = `il_call_${sanitizeId(call.id, 'call')}`
+    const actorId = String(call.created_by || '') || null
+    if (!actorId) continue
+    await prisma.interactionLog.upsert({
+      where: { id },
+      update: {
+        org_owner_id: actorId,
+        actor_id: actorId,
+        channel: 'call',
+        interaction_type: 'call',
+        entity_type: 'call_session',
+        entity_id: String(call.id || ''),
+        match_id: String(call.match_id || call?.context?.chat_thread_id || '') || null,
+        metadata: {
+          status: call.status || null,
+          duration_minutes: call.duration_minutes || null,
+        },
+        occurred_at: toIso(call.started_at || call.created_at, new Date().toISOString()),
+      },
+      create: {
+        id,
+        org_owner_id: actorId,
+        actor_id: actorId,
+        channel: 'call',
+        interaction_type: 'call',
+        entity_type: 'call_session',
+        entity_id: String(call.id || ''),
+        match_id: String(call.match_id || call?.context?.chat_thread_id || '') || null,
+        metadata: {
+          status: call.status || null,
+          duration_minutes: call.duration_minutes || null,
+        },
+        occurred_at: toIso(call.started_at || call.created_at, new Date().toISOString()),
+      },
+    }).catch(() => {})
+  }
+}
+
+async function main() {
+  const [leads, notes, reminders, messages, callSessions] = await Promise.all([
+    readLegacyJson('leads.json'),
+    readLegacyJson('lead_notes.json'),
+    readLegacyJson('lead_reminders.json'),
+    readLegacyJson('messages.json'),
+    readLegacyJson('call_sessions.json'),
+  ])
+
+  console.log('Legacy rows found:', {
+    leads: leads.length,
+    lead_notes: notes.length,
+    lead_reminders: reminders.length,
+    messages: messages.length,
+    call_sessions: callSessions.length,
+  })
+
+  await migrateLeads(leads)
+  await migrateLeadNotes(notes)
+  await migrateLeadReminders(reminders)
+  await migrateInteractions(messages, callSessions)
+
+  console.log('CRM JSON → SQL migration complete.')
+}
+
+main()
+  .catch((error) => {
+    console.error('CRM JSON → SQL migration failed:', error)
+    process.exitCode = 1
+  })
+  .finally(async () => {
+    await prisma.$disconnect()
+  })
diff --git a/server/services/analyticsService.js b/server/services/analyticsService.js
index 1383f48..40aabcf 100644
--- a/server/services/analyticsService.js
+++ b/server/services/analyticsService.js
@@ -1,5 +1,7 @@
 import crypto from 'crypto'
-import { readJson, writeJson } from '../utils/jsonStore.js'
+import { readJson } from '../utils/jsonStore.js'
+import prisma from '../utils/prisma.js'
+import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
 import { getAdminConfig } from './adminConfigService.js'
 import { canViewAnalytics, canViewAnalyticsAdmin, canViewAnalyticsDashboard, forbiddenError, scopeRecordsForUser } from '../utils/permissions.js'
 import { getPlanForUser } from './entitlementService.js'
@@ -7,6 +9,7 @@ import { getOrderCertificationSummary } from './orderCertificationService.js'

 const FILE = 'analytics.json'
 const SEARCH_TREND_MIN_EVENTS = 25
+const CRM_SQL_ENABLED = isCrmSqlEnabled()

 async function getSearchMinEvents() {
   try {
@@ -19,16 +22,20 @@ async function getSearchMinEvents() {
 }

 export async function trackEvent({ type, actor_id, entity_id, metadata = {} }) {
-  const all = await readJson(FILE)
-  all.push({
-    id: crypto.randomUUID(),
-    type,
-    actor_id,
-    entity_id,
-    metadata,
-    created_at: new Date().toISOString(),
-  })
-  await writeJson(FILE, all)
+  if (CRM_SQL_ENABLED) {
+    await prisma.analyticsEvent.create({
+      data: {
+        id: crypto.randomUUID(),
+        type,
+        actor_id: actor_id || null,
+        entity_id: entity_id || null,
+        metadata,
+        created_at: new Date(),
+      },
+    })
+    return
+  }
+  // Legacy fallback is intentionally read-only during the verification window.
 }

 function ensureAnalyticsAccess(user) {
@@ -60,7 +67,7 @@ function scopeAnalyticsRecords(user, records, idFields) {

 export async function getAnalyticsSummary(user) {
   ensureAnalyticsAccess(user)
-  const all = await readJson(FILE)
+  const all = CRM_SQL_ENABLED ? await prisma.analyticsEvent.findMany() : await readLegacyJson(FILE)
   const scoped = scopeAnalyticsRecords(user, all, ['actor_id', 'entity_id'])
   const byType = scoped.reduce((acc, e) => {
     acc[e.type] = (acc[e.type] || 0) + 1
@@ -932,4 +939,3 @@ export async function getPremiumInsights(user) {
     },
   }
 }
-
diff --git a/server/services/crmService.js b/server/services/crmService.js
index 677152b..dab7edb 100644
--- a/server/services/crmService.js
+++ b/server/services/crmService.js
@@ -1,4 +1,6 @@
 import { readJson } from '../utils/jsonStore.js'
+import prisma from '../utils/prisma.js'
+import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { isOwnerOrAdmin } from '../utils/permissions.js'

@@ -11,6 +13,21 @@ function buildOrgMemberIds(users = [], orgId = '') {
   })
   return members
 }
+const CRM_SQL_ENABLED = isCrmSqlEnabled()
+
+async function readStore(fileName) {
+  if (CRM_SQL_ENABLED) {
+    switch (fileName) {
+      case 'users.json': return prisma.user.findMany()
+      case 'messages.json': return prisma.message.findMany()
+      case 'call_sessions.json': return prisma.callSession.findMany()
+      case 'documents.json': return prisma.document.findMany()
+      case 'leads.json': return prisma.lead.findMany()
+      default: return readJson(fileName)
+    }
+  }
+  return readLegacyJson(fileName)
+}

 function canViewCrm(actor, targetUser) {
   if (!actor || !targetUser) return false
@@ -21,25 +38,6 @@ function canViewCrm(actor, targetUser) {
   return false
 }

-function compactThreadSummary(messages = []) {
-  const byMatch = new Map()
-  messages.forEach((msg) => {
-    const matchId = String(msg.match_id || '')
-    if (!matchId) return
-    if (!byMatch.has(matchId)) {
-      byMatch.set(matchId, { match_id: matchId, last_message_at: msg.timestamp || msg.created_at || '', message_count: 0 })
-    }
-    const entry = byMatch.get(matchId)
-    entry.message_count += 1
-    const ts = String(msg.timestamp || msg.created_at || '')
-    if (!entry.last_message_at || ts > entry.last_message_at) {
-      entry.last_message_at = ts
-    }
-  })
-  return [...byMatch.values()]
-    .sort((a, b) => String(b.last_message_at || '').localeCompare(String(a.last_message_at || '')))
-}
-
 function parseMarketplaceMatchId(matchId = '') {
   const parts = String(matchId).split(':')
   if (parts.length !== 2) return null
@@ -100,11 +98,11 @@ export async function getCrmProfileSummary(actor, targetId, options = {}) {
   if (!safeTarget) return { error: 'Target id required' }

   const [users, messages, calls, documents, leads] = await Promise.all([
-    readJson('users.json'),
-    readJson('messages.json'),
-    readJson('call_sessions.json'),
-    readJson('documents.json'),
-    readJson('leads.json'),
+    readStore('users.json'),
+    readStore('messages.json'),
+    readStore('call_sessions.json'),
+    readStore('documents.json'),
+    readStore('leads.json'),
   ])

   const targetUser = (Array.isArray(users) ? users : []).find((u) => String(u.id) === safeTarget) || null
@@ -238,11 +236,11 @@ export async function getCrmRelationshipTimeline(actor, counterpartyId, options
   if (!actorOrgId) return { error: 'forbidden' }

   const [users, messages, calls, documents, leads] = await Promise.all([
-    readJson('users.json'),
-    readJson('messages.json'),
-    readJson('call_sessions.json'),
-    readJson('documents.json'),
-    readJson('leads.json'),
+    readStore('users.json'),
+    readStore('messages.json'),
+    readStore('call_sessions.json'),
+    readStore('documents.json'),
+    readStore('leads.json'),
   ])

   const allUsers = Array.isArray(users) ? users : []
diff --git a/server/services/leadReminderService.js b/server/services/leadReminderService.js
index b970f6e..33f94ee 100644
--- a/server/services/leadReminderService.js
+++ b/server/services/leadReminderService.js
@@ -1,4 +1,5 @@
-import { readJson, writeJson } from '../utils/jsonStore.js'
+import prisma from '../utils/prisma.js'
+import { readLegacyJson, isCrmSqlEnabled } from '../utils/crmFallbackStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { createNotification } from './notificationService.js'
 import { sendEmail } from './emailService.js'
@@ -8,6 +9,7 @@ import { logError } from '../utils/logger.js'
 const REMINDERS_FILE = 'lead_reminders.json'
 const LEADS_FILE = 'leads.json'
 const USERS_FILE = 'users.json'
+const CRM_SQL_ENABLED = isCrmSqlEnabled()

 let sweepActive = false

@@ -31,11 +33,17 @@ export async function runLeadReminderSweep() {
   sweepActive = true

   try {
-    const [reminders, leads, users] = await Promise.all([
-      readJson(REMINDERS_FILE),
-      readJson(LEADS_FILE),
-      readJson(USERS_FILE),
-    ])
+    const [reminders, leads, users] = CRM_SQL_ENABLED
+      ? await Promise.all([
+        prisma.leadReminder.findMany(),
+        prisma.lead.findMany(),
+        prisma.user.findMany(),
+      ])
+      : await Promise.all([
+        readLegacyJson(REMINDERS_FILE),
+        readLegacyJson(LEADS_FILE),
+        readLegacyJson(USERS_FILE),
+      ])

     const reminderRows = Array.isArray(reminders) ? reminders : []
     const leadRows = Array.isArray(leads) ? leads : []
@@ -99,8 +107,18 @@ export async function runLeadReminderSweep() {
       }
     })

-    if (processed > 0) {
-      await writeJson(REMINDERS_FILE, nextReminders)
+    if (processed > 0 && CRM_SQL_ENABLED) {
+      await prisma.$transaction(
+        nextReminders
+          .filter((row) => row?.id)
+          .map((row) => prisma.leadReminder.update({
+            where: { id: row.id },
+            data: {
+              done: Boolean(row.done),
+              notified_at: row.notified_at ? new Date(row.notified_at) : null,
+            },
+          })),
+      )
     }

     return { ok: true, processed }
diff --git a/server/services/leadService.js b/server/services/leadService.js
index eca66b0..47f9d72 100644
--- a/server/services/leadService.js
+++ b/server/services/leadService.js
@@ -1,5 +1,7 @@
 import crypto from 'crypto'
 import { readJson, writeJson } from '../utils/jsonStore.js'
+import prisma from '../utils/prisma.js'
+import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { forbiddenError, isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
 import { getPlanForUser } from './entitlementService.js'
@@ -10,6 +12,14 @@ const NOTES_FILE = 'lead_notes.json'
 const REMINDERS_FILE = 'lead_reminders.json'
 const USERS_FILE = 'users.json'
 const REQUIREMENTS_FILE = 'requirements.json'
+const CRM_SQL_ENABLED = isCrmSqlEnabled()
+
+async function readStore(fileName) {
+  if (CRM_SQL_ENABLED) {
+    return readJson(fileName)
+  }
+  return readLegacyJson(fileName)
+}

 const LEAD_STATUSES = new Set([
   'new',
@@ -55,7 +65,7 @@ function parseMarketplaceMatchId(matchId = '') {

 async function resolveBuyerId(requirementId) {
   if (!requirementId) return ''
-  const requirements = await readJson(REQUIREMENTS_FILE)
+  const requirements = await readStore(REQUIREMENTS_FILE)
   const requirement = requirements.find((row) => String(row?.id || '') === String(requirementId)) || null
   return sanitizeString(requirement?.buyer_id || requirement?.buyerId || '', 120)
 }
@@ -130,7 +140,7 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp, so
   const senderId = sanitizeString(sender_id || '', 120)
   if (!matchId) return null

-  const users = await readJson(USERS_FILE)
+  const users = await readStore(USERS_FILE)
   const usersById = new Map(users.map((u) => [u.id, u]))
   const sender = usersById.get(senderId) || null

@@ -177,7 +187,7 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp, so

   if (orgTargets.size === 0) return null

-  const leads = await readJson(LEADS_FILE)
+  const leads = await readStore(LEADS_FILE)
   const now = new Date().toISOString()
   const interactionAt = sanitizeString(timestamp || now, 64) || now
   const updated = []
@@ -284,7 +294,7 @@ export async function markLeadConvertedFromContract({ buyerId, factoryId, contra
   const safeContract = sanitizeString(String(contractId || ''), 120)
   if (!safeBuyer || !safeFactory || !safeContract) return []

-  const leads = await readJson(LEADS_FILE)
+  const leads = await readStore(LEADS_FILE)
   let touched = false
   const now = new Date().toISOString()
   const updated = []
@@ -314,7 +324,24 @@ export async function markLeadConvertedFromContract({ buyerId, factoryId, contra
 }

 export async function listLeads(actor) {
-  const leads = await readJson(LEADS_FILE)
+  if (CRM_SQL_ENABLED) {
+    if (isOwnerOrAdmin(actor)) {
+      return prisma.lead.findMany({ orderBy: { updated_at: 'desc' } })
+    }
+    const orgId = actorOrgOwnerId(actor)
+    if (isAgent(actor)) {
+      return prisma.lead.findMany({
+        where: { org_owner_id: orgId, assigned_agent_id: String(actor.id || '') },
+        orderBy: { updated_at: 'desc' },
+      })
+    }
+    return prisma.lead.findMany({
+      where: { org_owner_id: orgId },
+      orderBy: { updated_at: 'desc' },
+    })
+  }
+
+  const leads = await readStore(LEADS_FILE)
   if (isOwnerOrAdmin(actor)) return leads.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))

   const orgId = actorOrgOwnerId(actor)
@@ -331,7 +358,21 @@ export async function listLeads(actor) {

 export async function getLeadById(actor, leadId) {
   const id = sanitizeString(String(leadId || ''), 120)
-  const leads = await readJson(LEADS_FILE)
+  if (CRM_SQL_ENABLED) {
+    const actorOrgId = actorOrgOwnerId(actor)
+    const lead = await prisma.lead.findFirst({
+      where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
+    })
+    if (!lead) return null
+    ensureLeadAccess(actor, lead)
+    const [notes, reminders] = await Promise.all([
+      prisma.leadNote.findMany({ where: { lead_id: id }, orderBy: { created_at: 'desc' } }),
+      prisma.leadReminder.findMany({ where: { lead_id: id }, orderBy: { remind_at: 'asc' } }),
+    ])
+    return { ...lead, notes, reminders }
+  }
+
+  const leads = await readStore(LEADS_FILE)
   const lead = leads.find((row) => String(row.id) === id) || null
   if (!lead) return null
   ensureLeadAccess(actor, lead)
@@ -347,8 +388,21 @@ export async function getLeadById(actor, leadId) {
 export async function getLeadByMatch(actor, matchId) {
   const id = sanitizeString(String(matchId || ''), 160)
   if (!id) return null
+  if (CRM_SQL_ENABLED) {
+    const actorOrgId = actorOrgOwnerId(actor)
+    const lead = await prisma.lead.findFirst({
+      where: isOwnerOrAdmin(actor) ? { match_id: id } : { match_id: id, org_owner_id: actorOrgId },
+    })
+    if (!lead) return null
+    ensureLeadAccess(actor, lead)
+    const [notes, reminders] = await Promise.all([
+      prisma.leadNote.findMany({ where: { lead_id: String(lead.id) }, orderBy: { created_at: 'desc' } }),
+      prisma.leadReminder.findMany({ where: { lead_id: String(lead.id) }, orderBy: { remind_at: 'asc' } }),
+    ])
+    return { ...lead, notes, reminders }
+  }

-  const leads = await readJson(LEADS_FILE)
+  const leads = await readStore(LEADS_FILE)
   const lead = leads.find((row) => String(row.match_id || '') === id) || null
   if (!lead) return null
   ensureLeadAccess(actor, lead)
@@ -363,7 +417,35 @@ export async function getLeadByMatch(actor, matchId) {

 export async function updateLead(actor, leadId, patch = {}) {
   const id = sanitizeString(String(leadId || ''), 120)
-  const leads = await readJson(LEADS_FILE)
+  if (CRM_SQL_ENABLED) {
+    const actorOrgId = actorOrgOwnerId(actor)
+    const current = await prisma.lead.findFirst({
+      where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
+    })
+    if (!current) return null
+    ensureLeadWriteAccess(actor, current)
+
+    const assignedAgentId = patch.assigned_agent_id !== undefined
+      ? sanitizeString(String(patch.assigned_agent_id || ''), 120) || null
+      : current.assigned_agent_id
+    if (!isAgent(actor) && assignedAgentId) {
+      const assignedAgent = await prisma.user.findFirst({
+        where: { id: assignedAgentId, role: 'agent', org_owner_id: current.org_owner_id },
+      })
+      if (!assignedAgent) throw forbiddenError()
+    }
+
+    return prisma.lead.update({
+      where: { id },
+      data: {
+        status: patch.status !== undefined ? normalizeStatus(patch.status, current.status || 'new') : current.status,
+        ...(isAgent(actor) ? {} : { assigned_agent_id: assignedAgentId }),
+        updated_at: new Date(),
+      },
+    })
+  }
+
+  const leads = await readStore(LEADS_FILE)
   const idx = leads.findIndex((row) => String(row.id) === id)
   if (idx < 0) return null

@@ -385,12 +467,32 @@ export async function updateLead(actor, leadId, patch = {}) {

 export async function addLeadNote(actor, leadId, noteText) {
   const id = sanitizeString(String(leadId || ''), 120)
-  const leads = await readJson(LEADS_FILE)
+  if (CRM_SQL_ENABLED) {
+    const actorOrgId = actorOrgOwnerId(actor)
+    const lead = await prisma.lead.findFirst({
+      where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
+    })
+    if (!lead) return null
+    ensureLeadWriteAccess(actor, lead)
+
+    return prisma.leadNote.create({
+      data: {
+        id: crypto.randomUUID(),
+        lead_id: id,
+        org_owner_id: lead.org_owner_id,
+        author_id: String(actor.id || ''),
+        note: sanitizeString(String(noteText || ''), 1600),
+        created_at: new Date(),
+      },
+    })
+  }
+
+  const leads = await readStore(LEADS_FILE)
   const lead = leads.find((row) => String(row.id) === id) || null
   if (!lead) return null
   ensureLeadWriteAccess(actor, lead)

-  const notes = await readJson(NOTES_FILE)
+  const notes = await readStore(NOTES_FILE)
   const row = {
     id: crypto.randomUUID(),
     lead_id: id,
@@ -406,7 +508,32 @@ export async function addLeadNote(actor, leadId, noteText) {

 export async function addLeadReminder(actor, leadId, payload = {}) {
   const id = sanitizeString(String(leadId || ''), 120)
-  const leads = await readJson(LEADS_FILE)
+  if (CRM_SQL_ENABLED) {
+    const actorOrgId = actorOrgOwnerId(actor)
+    const lead = await prisma.lead.findFirst({
+      where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
+    })
+    if (!lead) return null
+    ensureLeadWriteAccess(actor, lead)
+
+    const remindAtRaw = payload?.remind_at ? new Date(payload.remind_at) : new Date(Date.now() + 24 * 60 * 60 * 1000)
+    const remindAt = Number.isNaN(remindAtRaw.getTime()) ? new Date(Date.now() + 24 * 60 * 60 * 1000) : remindAtRaw
+
+    return prisma.leadReminder.create({
+      data: {
+        id: crypto.randomUUID(),
+        lead_id: id,
+        org_owner_id: lead.org_owner_id,
+        created_by: String(actor.id || ''),
+        remind_at: remindAt,
+        message: sanitizeString(String(payload?.message || 'Follow up'), 240),
+        done: false,
+        created_at: new Date(),
+      },
+    })
+  }
+
+  const leads = await readStore(LEADS_FILE)
   const lead = leads.find((row) => String(row.id) === id) || null
   if (!lead) return null
   ensureLeadWriteAccess(actor, lead)
@@ -414,7 +541,7 @@ export async function addLeadReminder(actor, leadId, payload = {}) {
   const remindAtRaw = payload?.remind_at ? new Date(payload.remind_at) : new Date(Date.now() + 24 * 60 * 60 * 1000)
   const remindAt = Number.isNaN(remindAtRaw.getTime()) ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : remindAtRaw.toISOString()

-  const reminders = await readJson(REMINDERS_FILE)
+  const reminders = await readStore(REMINDERS_FILE)
   const row = {
     id: crypto.randomUUID(),
     lead_id: id,
@@ -437,13 +564,13 @@ export async function addLeadNoteForMatch({ matchId, orgOwnerId, note, authorId
   const safeAuthor = sanitizeString(String(authorId || 'system'), 120)
   if (!safeMatchId || !safeOrgId || !safeNote) return null

-  const leads = await readJson(LEADS_FILE)
+  const leads = await readStore(LEADS_FILE)
   const lead = leads.find((row) =>
     String(row.match_id || '') === safeMatchId && String(row.org_owner_id || '') === safeOrgId
   ) || null
   if (!lead) return null

-  const notes = await readJson(NOTES_FILE)
+  const notes = await readStore(NOTES_FILE)
   const row = {
     id: crypto.randomUUID(),
     lead_id: lead.id,
diff --git a/server/services/messageService.js b/server/services/messageService.js
index 9a2d560..0dcff23 100644
--- a/server/services/messageService.js
+++ b/server/services/messageService.js
@@ -1,5 +1,6 @@
 import crypto from 'crypto'
 import { readJson, writeJson } from '../utils/jsonStore.js'
+import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { trackTransition } from '../utils/metrics.js'
 import {
@@ -18,6 +19,12 @@ const USERS_FILE = 'users.json'
 const MESSAGE_REQUESTS_FILE = 'message_requests.json'
 const CONVERSATION_LOCKS_FILE = 'conversation_locks.json'
 const MESSAGE_READS_FILE = 'message_reads.json'
+const CRM_SQL_ENABLED = isCrmSqlEnabled()
+
+async function readStore(fileName) {
+  if (CRM_SQL_ENABLED) return readJson(fileName)
+  return readLegacyJson(fileName)
+}

 function buildUsersById(users = []) {
   return new Map((Array.isArray(users) ? users : []).map((user) => [user.id, user]))
@@ -75,7 +82,7 @@ export async function listFriendMatchIdsForUser(userId) {
   const connections = await listFriendConnectionsForUser(userId)
   const ids = new Set(connections.map((row) => row.match_id).filter(Boolean))

-  const messages = await readJson(FILE)
+  const messages = await readStore(FILE)
   messages
     .map((row) => row.match_id)
     .filter((matchId) => {
@@ -127,7 +134,7 @@ async function enforceConversationLock(matchId, sender) {
   const requirement = await getRequirementById(requestId)
   if (requirement && String(requirement.buyer_id || '') === String(sender.id || '')) return null

-  const locks = await readJson(CONVERSATION_LOCKS_FILE)
+  const locks = await readStore(CONVERSATION_LOCKS_FILE)
   const existing = locks.find((lock) => lock.request_id === requestId)
   const allowed = existing
     ? [...new Set([...(Array.isArray(existing.allowed_users) ? existing.allowed_users : []), ...(Array.isArray(existing.allowed_agents) ? existing.allowed_agents : [])])]
@@ -260,10 +267,10 @@ function applyFriendThreadMeta(message, fallbackFriend, currentUserId) {
 }

 export async function postMessage(matchId, senderId, message, type = 'text', attachment = null, options = {}) {
-  const messages = await readJson(FILE)
-  const users = await readJson(USERS_FILE)
+  const messages = await readStore(FILE)
+  const users = await readStore(USERS_FILE)
   const usersById = buildUsersById(users)
-  const messageRequests = await readJson(MESSAGE_REQUESTS_FILE)
+  const messageRequests = await readStore(MESSAGE_REQUESTS_FILE)
   const safeAttachment = attachment ? {
     name: sanitizeString(attachment?.name, 220),
     url: sanitizeString(attachment?.url, 600),
@@ -364,8 +371,8 @@ export async function postMessage(matchId, senderId, message, type = 'text', att
 }

 export async function listMessagesByMatch(matchId) {
-  const messages = await readJson(FILE)
-  const users = await readJson(USERS_FILE)
+  const messages = await readStore(FILE)
+  const users = await readStore(USERS_FILE)
   const usersById = buildUsersById(users)
   return messages
     .filter((m) => m.match_id === matchId)
@@ -373,12 +380,12 @@ export async function listMessagesByMatch(matchId) {
 }

 export async function tieredInbox(matchIds, currentUserId) {
-  const users = await readJson(USERS_FILE)
+  const users = await readStore(USERS_FILE)
   const usersById = buildUsersById(users)
-  const messages = await readJson(FILE)
-  const messageRequests = await readJson(MESSAGE_REQUESTS_FILE)
-  const conversationLocks = await readJson(CONVERSATION_LOCKS_FILE)
-  const messageReads = await readJson(MESSAGE_READS_FILE)
+  const messages = await readStore(FILE)
+  const messageRequests = await readStore(MESSAGE_REQUESTS_FILE)
+  const conversationLocks = await readStore(CONVERSATION_LOCKS_FILE)
+  const messageReads = await readStore(MESSAGE_READS_FILE)
   const lockByRequestId = new Map(conversationLocks.map((lock) => [lock.request_id, lock]))
   const readByMatch = buildReadMap(messageReads, currentUserId)

@@ -455,7 +462,7 @@ export async function markThreadRead(matchId, userId) {
     throw err
   }

-  const rows = await readJson(MESSAGE_READS_FILE)
+  const rows = await readStore(MESSAGE_READS_FILE)
   const nextRows = Array.isArray(rows) ? rows : []
   const now = new Date().toISOString()
   const idx = nextRows.findIndex((row) => String(row.match_id) === safeMatchId && String(row.user_id) === String(userId))
@@ -477,7 +484,7 @@ export async function markThreadRead(matchId, userId) {
 }

 async function updateRequestStatus(threadId, status, actedBy) {
-  const messageRequests = await readJson(MESSAGE_REQUESTS_FILE)
+  const messageRequests = await readStore(MESSAGE_REQUESTS_FILE)
   const actedAt = new Date().toISOString()
   const request = upsertRequestState(messageRequests, threadId, {
     status,
diff --git a/server/utils/crmFallbackStore.js b/server/utils/crmFallbackStore.js
new file mode 100644
index 0000000..e4417be
--- /dev/null
+++ b/server/utils/crmFallbackStore.js
@@ -0,0 +1,22 @@
+import fs from 'node:fs/promises'
+import path from 'node:path'
+
+const ROOT = process.cwd()
+const LEGACY_DB_DIR = path.join(ROOT, 'server', 'database')
+
+export function isCrmSqlEnabled() {
+  const raw = String(process.env.CRM_SQL_ENABLED ?? 'true').toLowerCase().trim()
+  return !['0', 'false', 'no', 'off'].includes(raw)
+}
+
+export async function readLegacyJson(fileName) {
+  const filePath = path.join(LEGACY_DB_DIR, fileName)
+  const raw = await fs.readFile(filePath, 'utf8').catch(() => null)
+  if (!raw) return []
+  try {
+    const parsed = JSON.parse(raw)
+    return Array.isArray(parsed) ? parsed : []
+  } catch {
+    return []
+  }
+}
diff --git a/server/utils/jsonStore.js b/server/utils/jsonStore.js
index 1a1665f..0e3ee38 100644
--- a/server/utils/jsonStore.js
+++ b/server/utils/jsonStore.js
@@ -127,6 +127,7 @@ const FILE_HANDLERS = {
   'leads.json': tableHandler('lead', ['id']),
   'lead_notes.json': tableHandler('leadNote', ['id']),
   'lead_reminders.json': tableHandler('leadReminder', ['id']),
+  'interaction_logs.json': tableHandler('interactionLog', ['id']),
   'analytics.json': tableHandler('analyticsEvent', ['id']),
   'boosts.json': tableHandler('boost', ['id']),
   'product_views.json': tableHandler('productView', ['id']),
```

## Why This Change

Merge pull request #70 from gamertoky1188gro/codex/extend-prisma-schema-with-models-and-foreign-keys

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 10 files changed, 651 insertions(+), 79 deletions(-)
- **Risk:** Moderate

## Relationships

Commit 184 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
