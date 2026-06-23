## Commit Metadata
- **Hash:** 44cbdb7e8e42f614abc2e67c70c3f046e7ed6a6d
- **Parent:** d5a545f7bba1802c83a342f224f0be6e984e248f
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 22:04:11
- **Message:** Add CRM SQL relations, event logs, and regression coverage

## Custom Title
Add CRM SQL relations, event logs, and regression coverage

## High-Level Summary
Add CRM SQL relations, event logs, and regression coverage

 12 files changed, 333 insertions(+), 58 deletions(-)

## File-by-File Breakdown
commit 44cbdb7e8e42f614abc2e67c70c3f046e7ed6a6d
Author: Cyber Code Master <148459541+gamertoky1188gro@users.noreply.github.com>
Date:   Sun Apr 5 22:04:11 2026 +0600

    Add CRM SQL relations, event logs, and regression coverage

 .../migration.sql                                  |  78 +++++++++++++
 prisma/schema.prisma                               | 121 ++++++++++++++-------
 scripts/db/migrate-crm-json-to-sql.mjs             |  42 ++++++-
 .../__tests__/leadService.crm-regression.test.js   |  90 +++++++++++++++
 server/services/analyticsService.js                |   6 +-
 server/services/crmService.js                      |   4 +-
 server/services/leadReminderService.js             |   6 +-
 server/services/leadService.js                     |  16 +--
 server/services/messageService.js                  |   4 +-
 server/utils/crmFallbackStore.js                   |  14 ++-
 server/utils/jsonStore.js                          |   1 +
 server/utils/logger.js                             |   9 ++
 12 files changed, 333 insertions(+), 58 deletions(-)

## Detailed Diff Analysis
```diff
diff --git a/prisma/migrations/20260405153000_crm_relations_event_log/migration.sql b/prisma/migrations/20260405153000_crm_relations_event_log/migration.sql
new file mode 100644
index 0000000..eac84cc
--- /dev/null
+++ b/prisma/migrations/20260405153000_crm_relations_event_log/migration.sql
@@ -0,0 +1,78 @@
+-- CRM relation hardening + event log support.
+
+CREATE TABLE IF NOT EXISTS "event_logs" (
+  "id" TEXT NOT NULL,
+  "org_owner_id" TEXT NOT NULL,
+  "actor_id" TEXT,
+  "event_type" TEXT NOT NULL,
+  "entity_type" TEXT,
+  "entity_id" TEXT,
+  "payload" JSONB,
+  "occurred_at" TIMESTAMP(3) NOT NULL,
+  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
+);
+
+ALTER TABLE "interaction_logs"
+  ADD COLUMN IF NOT EXISTS "lead_id" TEXT,
+  ADD COLUMN IF NOT EXISTS "message_id" TEXT,
+  ADD COLUMN IF NOT EXISTS "call_session_id" TEXT,
+  ADD COLUMN IF NOT EXISTS "event_log_id" TEXT;
+
+-- CRM workload indexes
+CREATE INDEX IF NOT EXISTS "leads_org_owner_id_status_updated_at_idx"
+  ON "leads"("org_owner_id", "status", "updated_at");
+
+CREATE INDEX IF NOT EXISTS "leads_assigned_agent_id_updated_at_idx"
+  ON "leads"("assigned_agent_id", "updated_at");
+
+CREATE INDEX IF NOT EXISTS "interaction_logs_org_owner_id_interaction_type_occurred_at_idx"
+  ON "interaction_logs"("org_owner_id", "interaction_type", "occurred_at");
+
+CREATE INDEX IF NOT EXISTS "event_logs_org_owner_id_event_type_occurred_at_idx"
+  ON "event_logs"("org_owner_id", "event_type", "occurred_at");
+
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_lead_id_fkey'
+  ) THEN
+    ALTER TABLE "interaction_logs"
+      ADD CONSTRAINT "interaction_logs_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_message_id_fkey'
+  ) THEN
+    ALTER TABLE "interaction_logs"
+      ADD CONSTRAINT "interaction_logs_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_call_session_id_fkey'
+  ) THEN
+    ALTER TABLE "interaction_logs"
+      ADD CONSTRAINT "interaction_logs_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_event_log_id_fkey'
+  ) THEN
+    ALTER TABLE "interaction_logs"
+      ADD CONSTRAINT "interaction_logs_event_log_id_fkey" FOREIGN KEY ("event_log_id") REFERENCES "event_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'event_logs_org_owner_id_fkey'
+  ) THEN
+    ALTER TABLE "event_logs"
+      ADD CONSTRAINT "event_logs_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
+  END IF;
+
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_constraint WHERE conname = 'event_logs_actor_id_fkey'
+  ) THEN
+    ALTER TABLE "event_logs"
+      ADD CONSTRAINT "event_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
+  END IF;
+END $$;
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 89bde8c..0c5832a 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -37,6 +37,14 @@ model User {
   updated_at                 DateTime?
   password_reset_at          DateTime?
 
+  ownedLeads                Lead[]           @relation("LeadOrgOwner")
+  assignedLeads             Lead[]           @relation("LeadAssignedAgent")
+  counterpartyLeads         Lead[]           @relation("LeadCounterpartyUser")
+  leadNotes                 LeadNote[]       @relation("LeadNoteAuthor")
+  leadRemindersCreated      LeadReminder[]   @relation("LeadReminderCreator")
+  crmInteractionsOwned      InteractionLog[] @relation("InteractionOrgOwner")
+  crmInteractionsActor      InteractionLog[] @relation("InteractionActor")
+
   @@map("users")
 }
 
@@ -193,15 +201,16 @@ model CurrencyConfig {
 }
 
 model Message {
-  id                String   @id
+  id                String           @id
   match_id          String
   sender_id         String
-  message           String?  @db.Text
-  timestamp         DateTime @default(now())
+  message           String?          @db.Text
+  timestamp         DateTime         @default(now())
   type              String?
   attachment        Json?
   moderated         Boolean?
   moderation_reason String?
+  interactions      InteractionLog[]
 
   @@map("messages")
 }
@@ -312,23 +321,24 @@ model PartnerRequest {
 }
 
 model CallSession {
-  id               String   @id
-  created_by       String
-  match_id         String?
-  title            String?
-  scheduled_for    DateTime?
-  duration_minutes Int?
-  participant_ids  Json?
-  status           String?
-  recording_url    String?
-  recording_status String?
-  contract_id      String?
+  id                String           @id
+  created_by        String
+  match_id          String?
+  title             String?
+  scheduled_for     DateTime?
+  duration_minutes  Int?
+  participant_ids   Json?
+  status            String?
+  recording_url     String?
+  recording_status  String?
+  contract_id       String?
   security_audit_id String?
-  context          Json?
-  created_at       DateTime @default(now())
-  started_at       DateTime?
-  ended_at         DateTime?
-  audit_trail      Json?
+  context           Json?
+  created_at        DateTime         @default(now())
+  started_at        DateTime?
+  ended_at          DateTime?
+  audit_trail       Json?
+  interactions      InteractionLog[]
 
   @@map("call_sessions")
 }
@@ -377,22 +387,29 @@ model Document {
 }
 
 model Lead {
-  id                   String   @id
-  org_owner_id         String
-  match_id             String
-  counterparty_id      String?
-  source               String?
-  source_type          String?
-  source_id            String?
-  source_label         String?
-  status               String?
-  assigned_agent_id    String?
-  conversion_at        DateTime?
-  created_at           DateTime @default(now())
-  updated_at           DateTime?
-  last_interaction_at  DateTime?
-
-  @@index([org_owner_id, assigned_agent_id, counterparty_id, match_id, status, updated_at])
+  id                  String           @id
+  org_owner_id        String
+  match_id            String
+  counterparty_id     String?
+  source              String?
+  source_type         String?
+  source_id           String?
+  source_label        String?
+  status              String?
+  assigned_agent_id   String?
+  conversion_at       DateTime?
+  created_at          DateTime         @default(now())
+  updated_at          DateTime?
+  last_interaction_at DateTime?
+  orgOwner            User             @relation("LeadOrgOwner", fields: [org_owner_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
+  assignedAgent       User?            @relation("LeadAssignedAgent", fields: [assigned_agent_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
+  counterpartyUser    User?            @relation("LeadCounterpartyUser", fields: [counterparty_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
+  notes               LeadNote[]
+  reminders           LeadReminder[]
+  interactions        InteractionLog[]
+
+  @@index([org_owner_id, status, updated_at])
+  @@index([assigned_agent_id, updated_at])
   @@map("leads")
 }
 
@@ -403,6 +420,8 @@ model LeadNote {
   author_id    String
   note         String?
   created_at   DateTime @default(now())
+  lead         Lead     @relation(fields: [lead_id], references: [id], onDelete: Cascade, onUpdate: Cascade)
+  author       User     @relation("LeadNoteAuthor", fields: [author_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
 
   @@index([lead_id, created_at])
   @@map("lead_notes")
@@ -418,28 +437,56 @@ model LeadReminder {
   done         Boolean  @default(false)
   notified_at  DateTime?
   created_at   DateTime @default(now())
+  lead         Lead     @relation(fields: [lead_id], references: [id], onDelete: Cascade, onUpdate: Cascade)
+  creator      User     @relation("LeadReminderCreator", fields: [created_by], references: [id], onDelete: Restrict, onUpdate: Cascade)
 
   @@index([lead_id, remind_at, done])
   @@map("lead_reminders")
 }
 
 model InteractionLog {
-  id               String   @id
+  id               String      @id
   org_owner_id     String
   actor_id         String?
   channel          String?
   interaction_type String
   entity_type      String?
   entity_id        String?
+  lead_id          String?
+  message_id       String?
+  call_session_id  String?
+  event_log_id     String?
   match_id         String?
   metadata         Json?
   occurred_at      DateTime
-  created_at       DateTime @default(now())
+  created_at       DateTime    @default(now())
+  orgOwner         User        @relation("InteractionOrgOwner", fields: [org_owner_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
+  actor            User?       @relation("InteractionActor", fields: [actor_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
+  lead             Lead?       @relation(fields: [lead_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
+  message          Message?    @relation(fields: [message_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
+  callSession      CallSession? @relation(fields: [call_session_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
+  eventLog         EventLog?   @relation(fields: [event_log_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
 
   @@index([org_owner_id, interaction_type, occurred_at])
   @@map("interaction_logs")
 }
 
+model EventLog {
+  id           String           @id
+  org_owner_id String
+  actor_id     String?
+  event_type   String
+  entity_type  String?
+  entity_id    String?
+  payload      Json?
+  occurred_at  DateTime
+  created_at   DateTime         @default(now())
+  interactions InteractionLog[]
+
+  @@index([org_owner_id, event_type, occurred_at])
+  @@map("event_logs")
+}
+
 model AnalyticsEvent {
   id         String   @id
   type       String
diff --git a/scripts/db/migrate-crm-json-to-sql.mjs b/scripts/db/migrate-crm-json-to-sql.mjs
index f2c9e85..b0cb90c 100644
--- a/scripts/db/migrate-crm-json-to-sql.mjs
+++ b/scripts/db/migrate-crm-json-to-sql.mjs
@@ -126,6 +126,39 @@ async function migrateLeadReminders(reminders) {
   }
 }
 
+
+async function migrateEventLogs(eventLogs) {
+  for (const eventLog of eventLogs) {
+    const id = sanitizeId(eventLog.id, 'event_log')
+    const orgOwnerId = String(eventLog.org_owner_id || eventLog.actor_id || '')
+    if (!orgOwnerId) continue
+
+    await prisma.eventLog.upsert({
+      where: { id },
+      update: {
+        org_owner_id: orgOwnerId,
+        actor_id: String(eventLog.actor_id || '') || null,
+        event_type: String(eventLog.event_type || eventLog.type || 'event'),
+        entity_type: String(eventLog.entity_type || '') || null,
+        entity_id: String(eventLog.entity_id || '') || null,
+        payload: eventLog.payload || eventLog.metadata || {},
+        occurred_at: toIso(eventLog.occurred_at || eventLog.created_at, new Date().toISOString()),
+      },
+      create: {
+        id,
+        org_owner_id: orgOwnerId,
+        actor_id: String(eventLog.actor_id || '') || null,
+        event_type: String(eventLog.event_type || eventLog.type || 'event'),
+        entity_type: String(eventLog.entity_type || '') || null,
+        entity_id: String(eventLog.entity_id || '') || null,
+        payload: eventLog.payload || eventLog.metadata || {},
+        occurred_at: toIso(eventLog.occurred_at || eventLog.created_at, new Date().toISOString()),
+        created_at: toIso(eventLog.created_at, new Date().toISOString()),
+      },
+    })
+  }
+}
+
 async function migrateInteractions(messages, calls) {
   for (const message of messages) {
     const id = sanitizeId(message.id, 'il_msg')
@@ -143,6 +176,7 @@ async function migrateInteractions(messages, calls) {
         entity_type: 'message',
         entity_id: String(message.id || ''),
         match_id: matchId || null,
+        message_id: String(message.id || '') || null,
         metadata: {
           type: message.type || 'text',
           has_attachment: Boolean(message.attachment),
@@ -158,6 +192,7 @@ async function migrateInteractions(messages, calls) {
         entity_type: 'message',
         entity_id: String(message.id || ''),
         match_id: matchId || null,
+        message_id: String(message.id || '') || null,
         metadata: {
           type: message.type || 'text',
           has_attachment: Boolean(message.attachment),
@@ -181,6 +216,7 @@ async function migrateInteractions(messages, calls) {
         entity_type: 'call_session',
         entity_id: String(call.id || ''),
         match_id: String(call.match_id || call?.context?.chat_thread_id || '') || null,
+        call_session_id: String(call.id || '') || null,
         metadata: {
           status: call.status || null,
           duration_minutes: call.duration_minutes || null,
@@ -196,6 +232,7 @@ async function migrateInteractions(messages, calls) {
         entity_type: 'call_session',
         entity_id: String(call.id || ''),
         match_id: String(call.match_id || call?.context?.chat_thread_id || '') || null,
+        call_session_id: String(call.id || '') || null,
         metadata: {
           status: call.status || null,
           duration_minutes: call.duration_minutes || null,
@@ -207,12 +244,13 @@ async function migrateInteractions(messages, calls) {
 }
 
 async function main() {
-  const [leads, notes, reminders, messages, callSessions] = await Promise.all([
+  const [leads, notes, reminders, messages, callSessions, eventLogs] = await Promise.all([
     readLegacyJson('leads.json'),
     readLegacyJson('lead_notes.json'),
     readLegacyJson('lead_reminders.json'),
     readLegacyJson('messages.json'),
     readLegacyJson('call_sessions.json'),
+    readLegacyJson('event_logs.json'),
   ])
 
   console.log('Legacy rows found:', {
@@ -221,11 +259,13 @@ async function main() {
     lead_reminders: reminders.length,
     messages: messages.length,
     call_sessions: callSessions.length,
+    event_logs: eventLogs.length,
   })
 
   await migrateLeads(leads)
   await migrateLeadNotes(notes)
   await migrateLeadReminders(reminders)
+  await migrateEventLogs(eventLogs)
   await migrateInteractions(messages, callSessions)
 
   console.log('CRM JSON → SQL migration complete.')
diff --git a/server/services/__tests__/leadService.crm-regression.test.js b/server/services/__tests__/leadService.crm-regression.test.js
new file mode 100644
index 0000000..06f56b5
--- /dev/null
+++ b/server/services/__tests__/leadService.crm-regression.test.js
@@ -0,0 +1,90 @@
+import test from 'node:test'
+import assert from 'node:assert/strict'
+
+function buildPrismaStub() {
+  const leads = [
+    {
+      id: 'lead-1',
+      org_owner_id: 'org-1',
+      match_id: 'm-1',
+      counterparty_id: 'buyer-1',
+      status: 'new',
+      assigned_agent_id: 'agent-1',
+      updated_at: new Date('2026-04-04T00:00:00.000Z'),
+      created_at: new Date('2026-04-01T00:00:00.000Z'),
+    },
+  ]
+  const notes = []
+  const reminders = []
+
+  return {
+    leads,
+    notes,
+    reminders,
+    lead: {
+      findMany: async ({ where } = {}) => {
+        if (!where) return leads
+        return leads.filter((row) => Object.entries(where).every(([k, v]) => String(row[k] || '') === String(v || '')))
+      },
+      findFirst: async ({ where } = {}) => leads.find((row) => Object.entries(where || {}).every(([k, v]) => String(row[k] || '') === String(v || ''))) || null,
+      update: async ({ where, data }) => {
+        const idx = leads.findIndex((row) => row.id === where.id)
+        if (idx < 0) return null
+        leads[idx] = { ...leads[idx], ...data }
+        return leads[idx]
+      },
+    },
+    leadNote: {
+      findMany: async ({ where } = {}) => notes.filter((row) => String(row.lead_id) === String(where?.lead_id || '')),
+      create: async ({ data }) => {
+        notes.push(data)
+        return data
+      },
+    },
+    leadReminder: {
+      findMany: async ({ where } = {}) => reminders.filter((row) => String(row.lead_id) === String(where?.lead_id || '')),
+      create: async ({ data }) => {
+        reminders.push(data)
+        return data
+      },
+    },
+    user: {
+      findFirst: async ({ where } = {}) => {
+        if (where?.id === 'agent-1' && where?.role === 'agent' && where?.org_owner_id === 'org-1') return { id: 'agent-1' }
+        return null
+      },
+    },
+  }
+}
+
+test('lead CRUD/detail + note/reminder flows via SQL path', async () => {
+  process.env.USE_SQL_CRM = 'true'
+
+  const prismaModule = await import('../../utils/prisma.js')
+  const prisma = prismaModule.default
+  const stub = buildPrismaStub()
+
+  prisma.lead = stub.lead
+  prisma.leadNote = stub.leadNote
+  prisma.leadReminder = stub.leadReminder
+  prisma.user = stub.user
+
+  const leadService = await import('../leadService.js')
+  const actor = { id: 'org-1', role: 'factory' }
+
+  const listed = await leadService.listLeads(actor)
+  assert.equal(listed.length, 1)
+
+  const updated = await leadService.updateLead(actor, 'lead-1', { status: 'contacted', assigned_agent_id: 'agent-1' })
+  assert.equal(updated.status, 'contacted')
+
+  const note = await leadService.addLeadNote(actor, 'lead-1', 'Call scheduled')
+  assert.equal(note.lead_id, 'lead-1')
+
+  const reminder = await leadService.addLeadReminder(actor, 'lead-1', { message: 'Follow up tomorrow' })
+  assert.equal(reminder.lead_id, 'lead-1')
+
+  const detail = await leadService.getLeadById(actor, 'lead-1')
+  assert.equal(detail.notes.length, 1)
+  assert.equal(detail.reminders.length, 1)
+})
diff --git a/server/services/analyticsService.js b/server/services/analyticsService.js
index 5004dc9..77fe347 100644
--- a/server/services/analyticsService.js
+++ b/server/services/analyticsService.js
@@ -11,7 +11,7 @@ import { getAnalyticsGovernanceConfig, sanitizePlatformAnalytics } from './analy
 
 const FILE = 'analytics.json'
 const SEARCH_TREND_MIN_EVENTS = 25
-const CRM_SQL_ENABLED = isCrmSqlEnabled()
+const USE_SQL_CRM = isCrmSqlEnabled()
 
 async function getSearchMinEvents() {
   try {
@@ -24,7 +24,7 @@ async function getSearchMinEvents() {
 }
 
 export async function trackEvent({ type, actor_id, entity_id, metadata = {} }) {
-  if (CRM_SQL_ENABLED) {
+  if (USE_SQL_CRM) {
     await prisma.analyticsEvent.create({
       data: {
         id: crypto.randomUUID(),
@@ -69,7 +69,7 @@ function scopeAnalyticsRecords(user, records, idFields) {
 
 export async function getAnalyticsSummary(user) {
   ensureAnalyticsAccess(user)
-  const all = CRM_SQL_ENABLED ? await prisma.analyticsEvent.findMany() : await readLegacyJson(FILE)
+  const all = USE_SQL_CRM ? await prisma.analyticsEvent.findMany() : await readLegacyJson(FILE)
   const scoped = scopeAnalyticsRecords(user, all, ['actor_id', 'entity_id'])
   const byType = scoped.reduce((acc, e) => {
     acc[e.type] = (acc[e.type] || 0) + 1
diff --git a/server/services/crmService.js b/server/services/crmService.js
index dab7edb..7647deb 100644
--- a/server/services/crmService.js
+++ b/server/services/crmService.js
@@ -13,10 +13,10 @@ function buildOrgMemberIds(users = [], orgId = '') {
   })
   return members
 }
-const CRM_SQL_ENABLED = isCrmSqlEnabled()
+const USE_SQL_CRM = isCrmSqlEnabled()
 
 async function readStore(fileName) {
-  if (CRM_SQL_ENABLED) {
+  if (USE_SQL_CRM) {
     switch (fileName) {
       case 'users.json': return prisma.user.findMany()
       case 'messages.json': return prisma.message.findMany()
diff --git a/server/services/leadReminderService.js b/server/services/leadReminderService.js
index e8c3167..7cf07d1 100644
--- a/server/services/leadReminderService.js
+++ b/server/services/leadReminderService.js
@@ -9,7 +9,7 @@ import { logError } from '../utils/logger.js'
 const REMINDERS_FILE = 'lead_reminders.json'
 const LEADS_FILE = 'leads.json'
 const USERS_FILE = 'users.json'
-const CRM_SQL_ENABLED = isCrmSqlEnabled()
+const USE_SQL_CRM = isCrmSqlEnabled()
 
 let sweepActive = false
 
@@ -33,7 +33,7 @@ export async function runLeadReminderSweep() {
   sweepActive = true
 
   try {
-    const [reminders, leads, users] = CRM_SQL_ENABLED
+    const [reminders, leads, users] = USE_SQL_CRM
       ? await Promise.all([
         prisma.leadReminder.findMany(),
         prisma.lead.findMany(),
@@ -107,7 +107,7 @@ export async function runLeadReminderSweep() {
       }
     })
 
-    if (processed > 0 && CRM_SQL_ENABLED) {
+    if (processed > 0 && USE_SQL_CRM) {
       await prisma.$transaction(
         nextReminders
           .filter((row) => row?.id)
diff --git a/server/services/leadService.js b/server/services/leadService.js
index 6c9ab1a..f572b5a 100644
--- a/server/services/leadService.js
+++ b/server/services/leadService.js
@@ -12,10 +12,10 @@ const NOTES_FILE = 'lead_notes.json'
 const REMINDERS_FILE = 'lead_reminders.json'
 const USERS_FILE = 'users.json'
 const REQUIREMENTS_FILE = 'requirements.json'
-const CRM_SQL_ENABLED = isCrmSqlEnabled()
+const USE_SQL_CRM = isCrmSqlEnabled()
 
 async function readStore(fileName) {
-  if (CRM_SQL_ENABLED) {
+  if (USE_SQL_CRM) {
     return readJson(fileName)
   }
   return readLegacyJson(fileName)
@@ -324,7 +324,7 @@ export async function markLeadConvertedFromContract({ buyerId, factoryId, contra
 }
 
 export async function listLeads(actor) {
-  if (CRM_SQL_ENABLED) {
+  if (USE_SQL_CRM) {
     if (isOwnerOrAdmin(actor)) {
       return prisma.lead.findMany({ orderBy: { updated_at: 'desc' } })
     }
@@ -358,7 +358,7 @@ export async function listLeads(actor) {
 
 export async function getLeadById(actor, leadId) {
   const id = sanitizeString(String(leadId || ''), 120)
-  if (CRM_SQL_ENABLED) {
+  if (USE_SQL_CRM) {
     const actorOrgId = actorOrgOwnerId(actor)
     const lead = await prisma.lead.findFirst({
       where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
@@ -388,7 +388,7 @@ export async function getLeadById(actor, leadId) {
 export async function getLeadByMatch(actor, matchId) {
   const id = sanitizeString(String(matchId || ''), 160)
   if (!id) return null
-  if (CRM_SQL_ENABLED) {
+  if (USE_SQL_CRM) {
     const actorOrgId = actorOrgOwnerId(actor)
     const lead = await prisma.lead.findFirst({
       where: isOwnerOrAdmin(actor) ? { match_id: id } : { match_id: id, org_owner_id: actorOrgId },
@@ -417,7 +417,7 @@ export async function getLeadByMatch(actor, matchId) {
 
 export async function updateLead(actor, leadId, patch = {}) {
   const id = sanitizeString(String(leadId || ''), 120)
-  if (CRM_SQL_ENABLED) {
+  if (USE_SQL_CRM) {
     const actorOrgId = actorOrgOwnerId(actor)
     const current = await prisma.lead.findFirst({
       where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
@@ -467,7 +467,7 @@ export async function updateLead(actor, leadId, patch = {}) {
 
 export async function addLeadNote(actor, leadId, noteText) {
   const id = sanitizeString(String(leadId || ''), 120)
-  if (CRM_SQL_ENABLED) {
+  if (USE_SQL_CRM) {
     const actorOrgId = actorOrgOwnerId(actor)
     const lead = await prisma.lead.findFirst({
       where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
@@ -508,7 +508,7 @@ export async function addLeadNote(actor, leadId, noteText) {
 
 export async function addLeadReminder(actor, leadId, payload = {}) {
   const id = sanitizeString(String(leadId || ''), 120)
-  if (CRM_SQL_ENABLED) {
+  if (USE_SQL_CRM) {
     const actorOrgId = actorOrgOwnerId(actor)
     const lead = await prisma.lead.findFirst({
       where: isOwnerOrAdmin(actor) ? { id } : { id, org_owner_id: actorOrgId },
diff --git a/server/services/messageService.js b/server/services/messageService.js
index 0dcff23..65772c0 100644
--- a/server/services/messageService.js
+++ b/server/services/messageService.js
@@ -19,10 +19,10 @@ const USERS_FILE = 'users.json'
 const MESSAGE_REQUESTS_FILE = 'message_requests.json'
 const CONVERSATION_LOCKS_FILE = 'conversation_locks.json'
 const MESSAGE_READS_FILE = 'message_reads.json'
-const CRM_SQL_ENABLED = isCrmSqlEnabled()
+const USE_SQL_CRM = isCrmSqlEnabled()
 
 async function readStore(fileName) {
-  if (CRM_SQL_ENABLED) return readJson(fileName)
+  if (USE_SQL_CRM) return readJson(fileName)
   return readLegacyJson(fileName)
 }
 
diff --git a/server/utils/crmFallbackStore.js b/server/utils/crmFallbackStore.js
index e4417be..96d877a 100644
--- a/server/utils/crmFallbackStore.js
+++ b/server/utils/crmFallbackStore.js
@@ -4,9 +4,19 @@ import path from 'node:path'
 const ROOT = process.cwd()
 const LEGACY_DB_DIR = path.join(ROOT, 'server', 'database')
 
+function normalizeFlag(raw, fallback = true) {
+  if (raw === undefined || raw === null || raw === '') return fallback
+  const value = String(raw).toLowerCase().trim()
+  return !['0', 'false', 'no', 'off'].includes(value)
+}
+
+// Temporary rollout flag.
+// Prefer USE_SQL_CRM, but preserve backward compatibility with CRM_SQL_ENABLED.
 export function isCrmSqlEnabled() {
-  const raw = String(process.env.CRM_SQL_ENABLED ?? 'true').toLowerCase().trim()
-  return !['0', 'false', 'no', 'off'].includes(raw)
+  if (process.env.USE_SQL_CRM !== undefined) {
+    return normalizeFlag(process.env.USE_SQL_CRM, true)
+  }
+  return normalizeFlag(process.env.CRM_SQL_ENABLED, true)
 }
 
 export async function readLegacyJson(fileName) {
diff --git a/server/utils/jsonStore.js b/server/utils/jsonStore.js
index 0e3ee38..7c269bb 100644
--- a/server/utils/jsonStore.js
+++ b/server/utils/jsonStore.js
@@ -128,6 +128,7 @@ const FILE_HANDLERS = {
   'lead_notes.json': tableHandler('leadNote', ['id']),
   'lead_reminders.json': tableHandler('leadReminder', ['id']),
   'interaction_logs.json': tableHandler('interactionLog', ['id']),
+  'event_logs.json': tableHandler('eventLog', ['id']),
   'analytics.json': tableHandler('analyticsEvent', ['id']),
   'boosts.json': tableHandler('boost', ['id']),
   'product_views.json': tableHandler('productView', ['id']),
diff --git a/server/utils/logger.js b/server/utils/logger.js
index 9b45d67..8f9d2db 100644
--- a/server/utils/logger.js
+++ b/server/utils/logger.js
@@ -7,6 +7,15 @@ export function logInfo(message, data = null) {
   console.log(`[INFO] ${stamp} ${message}`)
 }
 
+export function logWarn(message, data = null) {
+  const stamp = new Date().toISOString()
+  if (data) {
+    console.warn(`[WARN] ${stamp} ${message}`, data)
+    return
+  }
+  console.warn(`[WARN] ${stamp} ${message}`)
+}
+
 export function logError(message, error = null) {
   const stamp = new Date().toISOString()
   if (error) {
```

## Why This Change
Add CRM SQL relations, event logs, and regression coverage

## Was It Useful
Yes — part of iterative feature development.

## Impact Analysis
- **Scope:**  12 files changed, 333 insertions(+), 58 deletions(-)
- **Risk:** Moderate

## Relationships
Commit 197 in the 0181-0220 sequence.

## Confidence Notes
Auto-generated from git history.
