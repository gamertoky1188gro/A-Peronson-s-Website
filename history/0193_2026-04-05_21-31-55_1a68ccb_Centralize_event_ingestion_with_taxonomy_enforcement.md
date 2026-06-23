## Commit Metadata
- **Hash:** 1a68ccb2f570e53a3194360513f5d2540bc31616
- **Parent:** 68cf50cfa6a7793c26947af9434e85a7447283c8
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 21:31:55
- **Message:** Centralize event ingestion with taxonomy enforcement

## Custom Title
Centralize event ingestion with taxonomy enforcement

## High-Level Summary
Centralize event ingestion with taxonomy enforcement

 14 files changed, 394 insertions(+), 16 deletions(-)

## File-by-File Breakdown
commit 1a68ccb2f570e53a3194360513f5d2540bc31616
Author: Cyber Code Master <148459541+gamertoky1188gro@users.noreply.github.com>
Date:   Sun Apr 5 21:31:55 2026 +0600

    Centralize event ingestion with taxonomy enforcement

 server/controllers/eventController.js    |  23 +++-
 server/server.js                         |   3 +
 server/services/boostService.js          |   2 +-
 server/services/documentService.js       |   2 +-
 server/services/eventIngestionService.js | 180 +++++++++++++++++++++++++++++++
 server/services/eventTrackingService.js  |  47 ++++++++
 server/services/feedService.js           |   2 +-
 server/services/leadReminderService.js   |   2 +-
 server/services/leadService.js           |   2 +-
 server/services/paymentProofService.js   |   2 +-
 server/services/productService.js        |   2 +-
 server/services/productViewService.js    |   2 +-
 shared/event-taxonomy.json               |  68 ++++++++++++
 src/lib/events.js                        |  73 ++++++++++++-
 14 files changed, 394 insertions(+), 16 deletions(-)

## Detailed Diff Analysis
```diff
diff --git a/server/controllers/eventController.js b/server/controllers/eventController.js
index 3798772..d09ab67 100644
--- a/server/controllers/eventController.js
+++ b/server/controllers/eventController.js
@@ -1,4 +1,4 @@
-import { trackEvent } from '../services/analyticsService.js'
+import { ingestEvent } from '../services/eventIngestionService.js'
 import { extractClientIp, locateIp } from '../services/geoService.js'
 import { sanitizeString } from '../utils/validators.js'
 
@@ -84,12 +84,27 @@ export async function postEvent(req, res) {
     user_agent: sanitizeString(String(req.headers['user-agent'] || ''), 180),
   }
 
-  await trackEvent({
+  const allowUnknownTypes = String(process.env.EVENTS_ALLOW_UNKNOWN_TYPES || '').toLowerCase() === 'true'
+  const result = await ingestEvent({
     type,
     actor_id: buildActorId(req, clientId),
     entity_id: entityId || (entityType ? `type:${entityType}` : ''),
     metadata: enrichedMeta,
-  })
+    context: {
+      actorType: req.user?.id ? 'user' : 'anonymous',
+      orgOwnerId: sanitizeString(String(req.user?.org_owner_id || req.user?.id || ''), 120) || 'unknown',
+      entityType: entityType || 'unknown',
+      entityId: entityId || 'unknown',
+      sourceModule: 'web_client',
+      sessionId: sanitizeString(String(metadata.session_id || ''), 180) || 'unknown',
+    },
+  }, { allowUnknownTypes, sourceModule: 'event_controller' })
 
-  return res.status(201).json({ ok: true })
+  if (!result.accepted) {
+    if (result.reason === 'unknown_event_type') return res.status(400).json({ error: 'Unknown event type' })
+    if (result.reason === 'duplicate_event') return res.status(202).json({ ok: true, deduped: true })
+    return res.status(400).json({ error: 'Event validation failed', reason: result.reason })
+  }
+
+  return res.status(201).json({ ok: true, schema_version: result.schema_version })
 }
diff --git a/server/server.js b/server/server.js
index ec380af..5025c1d 100644
--- a/server/server.js
+++ b/server/server.js
@@ -61,6 +61,7 @@ import { revokeExpiredVerifications } from './services/verificationService.js'
 import { enforcePartnerFreeTierLimits } from './services/partnerNetworkService.js'
 import { runLeadReminderSweep } from './services/leadReminderService.js'
 import { refreshRates } from './services/currencyService.js'
+import { startEventQualityReporter } from './services/eventIngestionService.js'
 
 const app = express()
 const PORT = process.env.PORT || 4000
@@ -70,6 +71,8 @@ setInterval(() => {
   refreshRates().catch(() => null)
 }, FX_REFRESH_INTERVAL_MS).unref()
 
+startEventQualityReporter()
+
 app.use(cors())
 app.use(express.json({ limit: '5mb' }))
 
diff --git a/server/services/boostService.js b/server/services/boostService.js
index 07e5243..7596499 100644
--- a/server/services/boostService.js
+++ b/server/services/boostService.js
@@ -2,7 +2,7 @@ import crypto from 'crypto'
 import { readJson, writeJson } from '../utils/jsonStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { debitWallet } from './walletService.js'
-import { trackEvent } from './analyticsService.js'
+import { trackEvent } from './eventTrackingService.js'
 
 const FILE = 'boosts.json'
 
diff --git a/server/services/documentService.js b/server/services/documentService.js
index 170ba68..f2c18ca 100644
--- a/server/services/documentService.js
+++ b/server/services/documentService.js
@@ -5,7 +5,7 @@ import { readJson, writeJson } from '../utils/jsonStore.js'
 import { readLocalJson } from '../utils/localStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { canAccessContract, canManagePartnerNetwork, canModifyContract, isAgent, isOwnerOrAdmin, scopeRecordsForUser } from '../utils/permissions.js'
-import { trackEvent } from './analyticsService.js'
+import { trackEvent } from './eventTrackingService.js'
 import { ensureCertificationForContract } from './certificationService.js'
 import { markLeadConvertedFromContract } from './leadService.js'
 
diff --git a/server/services/eventIngestionService.js b/server/services/eventIngestionService.js
new file mode 100644
index 0000000..53b33a6
--- /dev/null
+++ b/server/services/eventIngestionService.js
@@ -0,0 +1,180 @@
+import fs from 'fs/promises'
+import path from 'path'
+import crypto from 'crypto'
+import { trackEvent as persistEvent } from './analyticsService.js'
+import { sanitizeString } from '../utils/validators.js'
+import { logInfo, logWarn } from '../utils/logger.js'
+
+const TAXONOMY_PATH = path.join(process.cwd(), 'shared', 'event-taxonomy.json')
+const DEFAULT_SCHEMA_VERSION = '1.0.0'
+const DEFAULT_SOURCE_MODULE = 'backend'
+const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000
+const NOISY_EVENTS = new Set(['page_view', 'click', 'search_filters_changed'])
+
+const qualityState = {
+  unknown_types: {},
+  missing_required_fields: {},
+  dropped_events: 0,
+  ingested_events: 0,
+  deduped_events: 0,
+}
+
+const recentIdempotency = new Map()
+let taxonomyPromise = null
+
+function touchMetric(bucket, key) {
+  bucket[key] = (bucket[key] || 0) + 1
+}
+
+function compactDedupCache() {
+  const now = Date.now()
+  for (const [key, expiresAt] of recentIdempotency.entries()) {
+    if (expiresAt <= now) recentIdempotency.delete(key)
+  }
+}
+
+async function loadTaxonomy() {
+  if (!taxonomyPromise) {
+    taxonomyPromise = fs
+      .readFile(TAXONOMY_PATH, 'utf8')
+      .then((raw) => JSON.parse(raw))
+      .catch(() => ({
+        version: DEFAULT_SCHEMA_VERSION,
+        canonical_events: [],
+        required_context_dimensions: [],
+        required_fields: ['type'],
+        event_requirements: {},
+      }))
+  }
+  return taxonomyPromise
+}
+
+function normalizeEventType(type) {
+  return sanitizeString(String(type || ''), 80).toLowerCase().replace(/\s+/g, '_')
+}
+
+function normalizeContext(context = {}, base = {}) {
+  return {
+    actorType: sanitizeString(String(context.actorType || base.actorType || 'unknown'), 60) || 'unknown',
+    orgOwnerId: sanitizeString(String(context.orgOwnerId || base.orgOwnerId || 'unknown'), 120) || 'unknown',
+    entityType: sanitizeString(String(context.entityType || base.entityType || 'unknown'), 80) || 'unknown',
+    entityId: sanitizeString(String(context.entityId || base.entityId || 'unknown'), 160) || 'unknown',
+    sourceModule: sanitizeString(String(context.sourceModule || base.sourceModule || DEFAULT_SOURCE_MODULE), 80) || DEFAULT_SOURCE_MODULE,
+    sessionId: sanitizeString(String(context.sessionId || base.sessionId || 'server'), 180) || 'server',
+  }
+}
+
+function buildIdempotencyKey({ providedKey, type, actorId, entityId, sessionId }) {
+  const provided = sanitizeString(String(providedKey || ''), 200)
+  if (provided) return provided
+  if (!NOISY_EVENTS.has(type)) return ''
+
+  const minuteBucket = Math.floor(Date.now() / 15000)
+  const stable = `${type}|${actorId || 'unknown'}|${entityId || 'unknown'}|${sessionId || 'server'}|${minuteBucket}`
+  return crypto.createHash('sha256').update(stable).digest('hex')
+}
+
+function validateRequiredMetadata(metadata, requiredKeys = [], eventType = '') {
+  const missing = []
+  for (const key of requiredKeys) {
+    const value = metadata?.[key]
+    if (value === undefined || value === null || String(value).trim() === '') missing.push(key)
+  }
+  if (missing.length) touchMetric(qualityState.missing_required_fields, `${eventType}:${missing.join(',')}`)
+  return missing
+}
+
+export async function ingestEvent(payload = {}, options = {}) {
+  compactDedupCache()
+  const taxonomy = await loadTaxonomy()
+
+  const type = normalizeEventType(payload.type)
+  const actorId = sanitizeString(String(payload.actor_id || ''), 160)
+  const entityId = sanitizeString(String(payload.entity_id || ''), 180)
+  const metadata = payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {}
+
+  const context = normalizeContext(payload.context, {
+    entityId,
+    sourceModule: options.sourceModule,
+    actorType: options.actorType,
+    orgOwnerId: options.orgOwnerId,
+    entityType: options.entityType,
+    sessionId: options.sessionId,
+  })
+
+  if (!type || !actorId || !entityId) {
+    qualityState.dropped_events += 1
+    touchMetric(qualityState.missing_required_fields, 'base_required_fields')
+    return { accepted: false, reason: 'missing_required_fields' }
+  }
+
+  const canonicalEvents = new Set(Array.isArray(taxonomy.canonical_events) ? taxonomy.canonical_events : [])
+  const allowUnknownTypes = options.allowUnknownTypes === true
+  if (!canonicalEvents.has(type) && !allowUnknownTypes) {
+    qualityState.dropped_events += 1
+    touchMetric(qualityState.unknown_types, type)
+    return { accepted: false, reason: 'unknown_event_type', type }
+  }
+
+  const metadataRequirements = taxonomy?.event_requirements?.[type] || []
+  const missingMetadata = validateRequiredMetadata(metadata, metadataRequirements, type)
+  if (missingMetadata.length) {
+    qualityState.dropped_events += 1
+    return { accepted: false, reason: 'missing_required_metadata', missing: missingMetadata }
+  }
+
+  const idempotencyKey = buildIdempotencyKey({
+    providedKey: payload.idempotency_key || metadata.idempotency_key || options.idempotencyKey,
+    type,
+    actorId,
+    entityId,
+    sessionId: context.sessionId,
+  })
+
+  if (idempotencyKey) {
+    if (recentIdempotency.has(idempotencyKey)) {
+      qualityState.deduped_events += 1
+      return { accepted: false, reason: 'duplicate_event', idempotency_key: idempotencyKey }
+    }
+
+    recentIdempotency.set(idempotencyKey, Date.now() + IDEMPOTENCY_TTL_MS)
+  }
+
+  const enrichedMetadata = {
+    ...metadata,
+    context,
+    schema_version: sanitizeString(String(payload.schema_version || taxonomy.version || DEFAULT_SCHEMA_VERSION), 20),
+    idempotency_key: idempotencyKey,
+    received_at: new Date().toISOString(),
+  }
+
+  await persistEvent({
+    type,
+    actor_id: actorId,
+    entity_id: entityId,
+    metadata: enrichedMetadata,
+  })
+
+  qualityState.ingested_events += 1
+  return { accepted: true, type, idempotency_key: idempotencyKey, schema_version: enrichedMetadata.schema_version }
+}
+
+export function startEventQualityReporter() {
+  const intervalMs = Math.max(60_000, Number(process.env.EVENT_QUALITY_REPORT_INTERVAL_MS || 15 * 60 * 1000))
+  setInterval(() => {
+    logInfo('event-quality-report', {
+      ingested_events: qualityState.ingested_events,
+      dropped_events: qualityState.dropped_events,
+      deduped_events: qualityState.deduped_events,
+      unknown_types: qualityState.unknown_types,
+      missing_required_fields: qualityState.missing_required_fields,
+    })
+  }, intervalMs).unref()
+
+  logWarn('event-quality-report-enabled', { interval_ms: intervalMs })
+}
+
+export async function isKnownEventType(type) {
+  const taxonomy = await loadTaxonomy()
+  return new Set(taxonomy.canonical_events || []).has(normalizeEventType(type))
+}
diff --git a/server/services/eventTrackingService.js b/server/services/eventTrackingService.js
new file mode 100644
index 0000000..1d0f2f6
--- /dev/null
+++ b/server/services/eventTrackingService.js
@@ -0,0 +1,47 @@
+import { ingestEvent } from './eventIngestionService.js'
+import { sanitizeString } from '../utils/validators.js'
+
+function inferActorType(actorId = '') {
+  const raw = String(actorId || '')
+  if (!raw) return 'unknown'
+  if (raw.startsWith('anon:')) return 'anonymous'
+  return 'user'
+}
+
+export async function trackEventWithTaxonomy({
+  type,
+  actor_id,
+  entity_id,
+  metadata = {},
+  sourceModule = 'backend',
+  actorType = '',
+  orgOwnerId = '',
+  entityType = '',
+  sessionId = 'server',
+  idempotencyKey = '',
+  allowUnknownTypes = false,
+} = {}) {
+  const safeEntityId = sanitizeString(String(entity_id || metadata?.entity_id || ''), 180)
+  const safeEntityType = sanitizeString(String(entityType || metadata?.entity_type || ''), 80)
+
+  return ingestEvent({
+    type,
+    actor_id,
+    entity_id: safeEntityId || (safeEntityType ? `type:${safeEntityType}` : 'unknown'),
+    metadata,
+    idempotency_key: idempotencyKey,
+    context: {
+      actorType: sanitizeString(String(actorType || metadata?.actor_type || inferActorType(actor_id)), 60),
+      orgOwnerId: sanitizeString(String(orgOwnerId || metadata?.org_owner_id || actor_id || 'unknown'), 120),
+      entityType: safeEntityType || 'unknown',
+      entityId: safeEntityId || 'unknown',
+      sourceModule: sanitizeString(String(sourceModule || metadata?.source_module || 'backend'), 80),
+      sessionId: sanitizeString(String(sessionId || metadata?.session_id || 'server'), 180),
+    },
+  }, {
+    sourceModule,
+    allowUnknownTypes,
+  })
+}
+
+export const trackEvent = trackEventWithTaxonomy
diff --git a/server/services/feedService.js b/server/services/feedService.js
index 57f8929..fdd1226 100644
--- a/server/services/feedService.js
+++ b/server/services/feedService.js
@@ -1,7 +1,7 @@
 import { listRequirements } from './requirementService.js'
 import { listProducts } from './productService.js'
 import { readJson } from '../utils/jsonStore.js'
-import { trackEvent } from './analyticsService.js'
+import { trackEvent } from './eventTrackingService.js'
 import { logInfo } from '../utils/logger.js'
 import { getOrderCertificationMap } from './orderCertificationService.js'
 
diff --git a/server/services/leadReminderService.js b/server/services/leadReminderService.js
index 33f94ee..e8c3167 100644
--- a/server/services/leadReminderService.js
+++ b/server/services/leadReminderService.js
@@ -3,7 +3,7 @@ import { readLegacyJson, isCrmSqlEnabled } from '../utils/crmFallbackStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { createNotification } from './notificationService.js'
 import { sendEmail } from './emailService.js'
-import { trackEvent } from './analyticsService.js'
+import { trackEvent } from './eventTrackingService.js'
 import { logError } from '../utils/logger.js'
 
 const REMINDERS_FILE = 'lead_reminders.json'
diff --git a/server/services/leadService.js b/server/services/leadService.js
index 47f9d72..6c9ab1a 100644
--- a/server/services/leadService.js
+++ b/server/services/leadService.js
@@ -5,7 +5,7 @@ import { isCrmSqlEnabled, readLegacyJson } from '../utils/crmFallbackStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { forbiddenError, isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
 import { getPlanForUser } from './entitlementService.js'
-import { trackEvent } from './analyticsService.js'
+import { trackEvent } from './eventTrackingService.js'
 
 const LEADS_FILE = 'leads.json'
 const NOTES_FILE = 'lead_notes.json'
diff --git a/server/services/paymentProofService.js b/server/services/paymentProofService.js
index 48a8aa9..6860a6f 100644
--- a/server/services/paymentProofService.js
+++ b/server/services/paymentProofService.js
@@ -3,7 +3,7 @@ import { readJson, writeJson } from '../utils/jsonStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { canAccessContract } from '../utils/permissions.js'
 import { createNotification } from './notificationService.js'
-import { trackEvent } from './analyticsService.js'
+import { trackEvent } from './eventTrackingService.js'
 
 const FILE = 'payment_proofs.json'
 const DOCUMENTS_FILE = 'documents.json'
diff --git a/server/services/productService.js b/server/services/productService.js
index dad5eb8..e524cb1 100644
--- a/server/services/productService.js
+++ b/server/services/productService.js
@@ -1,7 +1,7 @@
 import crypto from 'crypto'
 import { readJson, writeJson } from '../utils/jsonStore.js'
 import { sanitizeString } from '../utils/validators.js'
-import { trackEvent } from './analyticsService.js'
+import { trackEvent } from './eventTrackingService.js'
 import { createNotification, emitNotificationsForEntity } from './notificationService.js'
 import { moderateTextOrRedact } from './policyService.js'
 import { isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
diff --git a/server/services/productViewService.js b/server/services/productViewService.js
index f901bec..05d6035 100644
--- a/server/services/productViewService.js
+++ b/server/services/productViewService.js
@@ -1,7 +1,7 @@
 import crypto from 'crypto'
 import { readJson, writeJson } from '../utils/jsonStore.js'
 import { sanitizeString } from '../utils/validators.js'
-import { trackEvent } from './analyticsService.js'
+import { trackEvent } from './eventTrackingService.js'
 
 const FILE = 'product_views.json'
 const USERS_FILE = 'users.json'
diff --git a/shared/event-taxonomy.json b/shared/event-taxonomy.json
new file mode 100644
index 0000000..54925fa
--- /dev/null
+++ b/shared/event-taxonomy.json
@@ -0,0 +1,68 @@
+{
+  "version": "1.0.0",
+  "required_context_dimensions": [
+    "actorType",
+    "orgOwnerId",
+    "entityType",
+    "entityId",
+    "sourceModule",
+    "sessionId"
+  ],
+  "required_fields": ["type", "actor_id", "entity_id", "context"],
+  "optional_fields": ["metadata", "idempotency_key", "schema_version", "received_at"],
+  "canonical_events": [
+    "boost_cancelled",
+    "boost_purchase",
+    "call_end",
+    "call_start",
+    "call_warning_shown",
+    "click",
+    "contract_archived",
+    "contract_buyer_signed",
+    "contract_call_warning",
+    "contract_created",
+    "contract_factory_signed",
+    "contract_locked",
+    "contract_signed",
+    "feed_item_viewed",
+    "industry_auto_reply",
+    "industry_page_view",
+    "lead_converted",
+    "lead_created",
+    "lead_reminder_due",
+    "lead_source_attached",
+    "message_sent",
+    "new_profile_boost_impressions",
+    "page_duration",
+    "page_view",
+    "payment_proof_created",
+    "payment_proof_status_updated",
+    "payment_proof_submitted",
+    "product_created",
+    "product_deleted",
+    "product_image_registered",
+    "product_image_removed",
+    "product_image_uploaded",
+    "product_image_url_added",
+    "product_media_updated",
+    "product_published",
+    "product_unpublished",
+    "product_updated",
+    "product_video_updated",
+    "product_video_uploaded",
+    "product_viewed",
+    "profile_view",
+    "search_filters_changed",
+    "search_run",
+    "session_end",
+    "session_start"
+  ],
+  "event_requirements": {
+    "lead_source_attached": ["source_type", "source_id"],
+    "lead_created": ["source_type"],
+    "lead_converted": ["buyer_id", "factory_id"],
+    "search_run": ["query"],
+    "search_filters_changed": ["filter_count"],
+    "payment_proof_status_updated": ["status"]
+  }
+}
diff --git a/src/lib/events.js b/src/lib/events.js
index c4eafaa..1a13e9a 100644
--- a/src/lib/events.js
+++ b/src/lib/events.js
@@ -3,6 +3,54 @@ import { apiRequest, getToken } from './auth'
 const CLIENT_ID_KEY = 'gt_client_id'
 const SESSION_ID_KEY = 'gt_session_id'
 
+const CANONICAL_EVENTS = new Set([
+  'boost_cancelled',
+  'boost_purchase',
+  'call_end',
+  'call_start',
+  'call_warning_shown',
+  'click',
+  'contract_archived',
+  'contract_buyer_signed',
+  'contract_call_warning',
+  'contract_created',
+  'contract_factory_signed',
+  'contract_locked',
+  'contract_signed',
+  'feed_item_viewed',
+  'industry_auto_reply',
+  'industry_page_view',
+  'lead_converted',
+  'lead_created',
+  'lead_reminder_due',
+  'lead_source_attached',
+  'message_sent',
+  'new_profile_boost_impressions',
+  'page_duration',
+  'page_view',
+  'payment_proof_created',
+  'payment_proof_status_updated',
+  'payment_proof_submitted',
+  'product_created',
+  'product_deleted',
+  'product_image_registered',
+  'product_image_removed',
+  'product_image_uploaded',
+  'product_image_url_added',
+  'product_media_updated',
+  'product_published',
+  'product_unpublished',
+  'product_updated',
+  'product_video_updated',
+  'product_video_uploaded',
+  'product_viewed',
+  'profile_view',
+  'search_filters_changed',
+  'search_run',
+  'session_end',
+  'session_start',
+])
+
 function randomId() {
   // Prefer crypto UUID when available; fall back to a simple random string.
   try {
@@ -13,6 +61,10 @@ function randomId() {
   return `cid_${Math.random().toString(16).slice(2)}_${Date.now()}`
 }
 
+function normalizeEventType(type) {
+  return String(type || '').trim().toLowerCase().replace(/\s+/g, '_')
+}
+
 export function getClientId() {
   try {
     const existing = localStorage.getItem(CLIENT_ID_KEY)
@@ -41,16 +93,29 @@ export function getSessionId() {
 export async function trackClientEvent(type, { entityType = '', entityId = '', metadata = {} } = {}) {
   // Best-effort event logging: failures should never break UI flows.
   try {
+    const canonicalType = normalizeEventType(type)
+    if (!CANONICAL_EVENTS.has(canonicalType)) return
+
     const sessionId = getSessionId()
+    const normalizedEntityType = String(entityType || metadata?.entity_type || 'unknown').trim().toLowerCase() || 'unknown'
+    const normalizedEntityId = String(entityId || metadata?.entity_id || 'unknown').trim() || 'unknown'
+
     await apiRequest('/events', {
       method: 'POST',
       token: getToken(),
       body: {
-        type,
-        entity_type: entityType,
-        entity_id: entityId,
+        type: canonicalType,
+        entity_type: normalizedEntityType,
+        entity_id: normalizedEntityId,
         client_id: getClientId(),
-        metadata: { ...metadata, session_id: sessionId },
+        metadata: {
+          ...metadata,
+          session_id: sessionId,
+          actor_type: getToken() ? 'user' : 'anonymous',
+          source_module: 'web_client',
+          entity_type: normalizedEntityType,
+          entity_id: normalizedEntityId,
+        },
       },
     })
   } catch {
```

## Why This Change
Centralize event ingestion with taxonomy enforcement

## Was It Useful
Yes — part of iterative feature development.

## Impact Analysis
- **Scope:**  14 files changed, 394 insertions(+), 16 deletions(-)
- **Risk:** Moderate

## Relationships
Commit 193 in the 0181-0220 sequence.

## Confidence Notes
Auto-generated from git history.
