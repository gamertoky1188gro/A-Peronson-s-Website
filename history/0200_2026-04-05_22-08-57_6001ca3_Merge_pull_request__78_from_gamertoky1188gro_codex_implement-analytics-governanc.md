## Commit Metadata

- **Hash:** 6001ca352351de033f851843145bd175af9e2df3
- **Parent:** 94fc77876f2a77973bbbf4c72bedcd488ab872b1 6ef4f9822c78e34ba3a89e96988151654c4e19ac
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 22:08:57
- **Message:** Merge pull request #78 from gamertoky1188gro/codex/implement-analytics-governance-service-0g7rcc

## Custom Title

Merge pull request #78 from gamertoky1188gro/codex/implement-analytics-governance-service-0g7rcc

## High-Level Summary

Merge pull request #78 from gamertoky1188gro/codex/implement-analytics-governance-service-0g7rcc

4 files changed, 90 insertions(+), 6 deletions(-)

## File-by-File Breakdown

.../**tests**/analyticsGovernanceService.test.js | 39 ++++++++++++++++++++--
server/services/adminConfigService.js | 2 ++
server/services/analyticsGovernanceService.js | 32 ++++++++++++++++++
server/services/analyticsService.js | 23 ++++++++++---
4 files changed, 90 insertions(+), 6 deletions(-)

## Detailed Diff Analysis

```diff
diff --git a/server/services/__tests__/analyticsGovernanceService.test.js b/server/services/__tests__/analyticsGovernanceService.test.js
index 342888f..d64334d 100644
--- a/server/services/__tests__/analyticsGovernanceService.test.js
+++ b/server/services/__tests__/analyticsGovernanceService.test.js
@@ -1,7 +1,7 @@
 import test from 'node:test'
 import assert from 'node:assert/strict'

-import { sanitizePlatformAnalytics } from '../analyticsGovernanceService.js'
+import { checkAnalyticsAccessPolicy, sanitizePlatformAnalytics } from '../analyticsGovernanceService.js'

 function baseReport() {
   return {
@@ -57,7 +57,16 @@ test('suppresses cohorts below min cohort size', () => {
 })

 test('strips denied identifier fields from nested metadata', () => {
-  const { report } = sanitizePlatformAnalytics(baseReport(), {
+  const reportWithLocation = baseReport()
+  reportWithLocation.metadata = {
+    actor_id: 'user-1',
+    raw_ip: '10.10.10.10',
+    exact_lat: 23.8103,
+    exact_lng: 90.4125,
+    ip_country: 'BD',
+  }
+
+  const { report } = sanitizePlatformAnalytics(reportWithLocation, {
     enabled: true,
     min_cohort_size: 2,
   })
@@ -65,6 +74,9 @@ test('strips denied identifier fields from nested metadata', () => {
   assert.ok(!('metadata' in report) || !('actor_id' in (report.metadata || {})))
   assert.equal(JSON.stringify(report).includes('raw_ip'), false)
   assert.equal(JSON.stringify(report).includes('actor_id'), false)
+  assert.equal(JSON.stringify(report).includes('exact_lat'), false)
+  assert.equal(JSON.stringify(report).includes('exact_lng'), false)
+  assert.equal(JSON.stringify(report).includes('ip_country'), false)
 })

 test('keeps stable output schema under suppression', () => {
@@ -94,3 +106,26 @@ test('keeps stable output schema under suppression', () => {
   assert.equal(Array.isArray(report.trending_search_categories), true)
   assert.equal(report.top_categories_by_country[0].country, 'insufficient_data')
 })
+
+test('policy denies non-admin view access when governance allows only admin and owner roles', () => {
+  const result = checkAnalyticsAccessPolicy({ id: 'agent-1', role: 'agent' }, {
+    enabled: true,
+    min_cohort_size: 10,
+    geo_granularity: 'country',
+    view_allowed_roles: ['admin', 'owner'],
+  }, { mode: 'view' })
+
+  assert.equal(result.allowed, false)
+  assert.equal(result.reason, 'analytics_view_denied')
+})
+
+test('policy denies raw export when allow_raw_exports is disabled', () => {
+  const result = checkAnalyticsAccessPolicy({ id: 'admin-1', role: 'admin' }, {
+    enabled: true,
+    allow_raw_exports: false,
+    export_allowed_roles: ['admin', 'owner'],
+  }, { mode: 'export' })
+
+  assert.equal(result.allowed, false)
+  assert.equal(result.reason, 'analytics_export_denied')
+})
diff --git a/server/services/adminConfigService.js b/server/services/adminConfigService.js
index ac1326e..c4cfe39 100644
--- a/server/services/adminConfigService.js
+++ b/server/services/adminConfigService.js
@@ -70,7 +70,9 @@ const DEFAULT_CONFIG = {
       min_cohort_size: 10,
       geo_granularity: 'country',
       retention_days: 365,
+      allow_raw_exports: false,
       export_allowed_roles: ['admin', 'owner'],
+      view_allowed_roles: ['admin', 'owner'],
     },
   },
   support: {
diff --git a/server/services/analyticsGovernanceService.js b/server/services/analyticsGovernanceService.js
index df2c959..5a386bf 100644
--- a/server/services/analyticsGovernanceService.js
+++ b/server/services/analyticsGovernanceService.js
@@ -5,7 +5,9 @@ export const ANALYTICS_GOVERNANCE_DEFAULTS = Object.freeze({
   min_cohort_size: 10,
   geo_granularity: 'country',
   retention_days: 365,
+  allow_raw_exports: false,
   export_allowed_roles: ['admin', 'owner'],
+  view_allowed_roles: ['admin', 'owner'],
   date_granularity: 'month',
 })

@@ -25,6 +27,9 @@ export const DENIED_ANALYTICS_FIELDS = Object.freeze([
   'phone',
   'ip',
   'raw_ip',
+  'ip_country',
+  'ip_region',
+  'ip_city',
   'lat',
   'lng',
   'latitude',
@@ -66,9 +71,13 @@ function normalizeGovernanceConfig(config = {}) {
       ? geo
       : ANALYTICS_GOVERNANCE_DEFAULTS.geo_granularity,
     retention_days: Number.isFinite(retentionDays) && retentionDays > 0 ? Math.floor(retentionDays) : ANALYTICS_GOVERNANCE_DEFAULTS.retention_days,
+    allow_raw_exports: Boolean(candidate.allow_raw_exports),
     export_allowed_roles: Array.isArray(candidate.export_allowed_roles) && candidate.export_allowed_roles.length
       ? candidate.export_allowed_roles.map((role) => String(role || '').toLowerCase()).filter(Boolean)
       : ANALYTICS_GOVERNANCE_DEFAULTS.export_allowed_roles,
+    view_allowed_roles: Array.isArray(candidate.view_allowed_roles) && candidate.view_allowed_roles.length
+      ? candidate.view_allowed_roles.map((role) => String(role || '').toLowerCase()).filter(Boolean)
+      : ANALYTICS_GOVERNANCE_DEFAULTS.view_allowed_roles,
     date_granularity: SENSITIVE_BUCKETING_RULES.date.levels.includes(date)
       ? date
       : ANALYTICS_GOVERNANCE_DEFAULTS.date_granularity,
@@ -80,6 +89,29 @@ export async function getAnalyticsGovernanceConfig() {
   return normalizeGovernanceConfig(config?.analytics?.governance)
 }

+export function checkAnalyticsAccessPolicy(user, config = ANALYTICS_GOVERNANCE_DEFAULTS, { mode = 'view' } = {}) {
+  const governance = normalizeGovernanceConfig(config)
+  const role = String(user?.role || '').toLowerCase()
+  const deniedReason = mode === 'export' ? 'analytics_export_denied' : 'analytics_view_denied'
+
+  if (!governance.enabled) return { allowed: true, governance, mode, role }
+
+  if (mode === 'export') {
+    if (!governance.allow_raw_exports) {
+      return { allowed: false, governance, mode, role, reason: deniedReason }
+    }
+    if (!governance.export_allowed_roles.includes(role)) {
+      return { allowed: false, governance, mode, role, reason: deniedReason }
+    }
+    return { allowed: true, governance, mode, role }
+  }
+
+  if (!governance.view_allowed_roles.includes(role)) {
+    return { allowed: false, governance, mode, role, reason: deniedReason }
+  }
+  return { allowed: true, governance, mode, role }
+}
+
 function sanitizeCountry(country, granularity) {
   const raw = String(country || 'Unknown').trim() || 'Unknown'
   if (granularity === 'country') return raw
diff --git a/server/services/analyticsService.js b/server/services/analyticsService.js
index 77fe347..e3c023e 100644
--- a/server/services/analyticsService.js
+++ b/server/services/analyticsService.js
@@ -7,7 +7,7 @@ import { canViewAnalytics, canViewAnalyticsAdmin, canViewAnalyticsDashboard, for
 import { getPlanForUser } from './entitlementService.js'
 import { getOrderCertificationSummary } from './orderCertificationService.js'
 import { appendAuditLog } from '../utils/auditStore.js'
-import { getAnalyticsGovernanceConfig, sanitizePlatformAnalytics } from './analyticsGovernanceService.js'
+import { checkAnalyticsAccessPolicy, getAnalyticsGovernanceConfig, sanitizePlatformAnalytics } from './analyticsGovernanceService.js'

 const FILE = 'analytics.json'
 const SEARCH_TREND_MIN_EVENTS = 25
@@ -588,6 +588,10 @@ export async function getCompanyAnalytics(user) {
 export async function getPlatformAnalytics(user) {
   ensureAnalyticsAdminAccess(user)

+  const governance = await getAnalyticsGovernanceConfig()
+  const viewPolicy = checkAnalyticsAccessPolicy(user, governance, { mode: 'view' })
+  if (!viewPolicy.allowed) throw forbiddenError('Analytics governance policy denied this request')
+
   const [requirements, users, events] = await Promise.all([
     readJson('requirements.json'),
     readJson('users.json'),
@@ -599,8 +603,16 @@ export async function getPlatformAnalytics(user) {
   const globalCategories = {}
   const priceBuckets = {}

-  const requirementsRows = Array.isArray(requirements) ? requirements : []
-  const eventRows = Array.isArray(events) ? events : []
+  const retentionMs = Math.max(1, Number(governance.retention_days || 365)) * 24 * 60 * 60 * 1000
+  const retentionCutoff = Date.now() - retentionMs
+  const requirementsRows = (Array.isArray(requirements) ? requirements : []).filter((row) => {
+    const createdAt = new Date(row?.created_at || '').getTime()
+    return Number.isFinite(createdAt) && createdAt >= retentionCutoff
+  })
+  const eventRows = (Array.isArray(events) ? events : []).filter((row) => {
+    const createdAt = new Date(row?.created_at || '').getTime()
+    return Number.isFinite(createdAt) && createdAt >= retentionCutoff
+  })

   for (const req of requirementsRows) {
     const buyer = usersById.get(String(req.buyer_id || ''))
@@ -716,7 +728,6 @@ export async function getPlatformAnalytics(user) {
     trending_search_categories: trendingCategories,
   }

-  const governance = await getAnalyticsGovernanceConfig()
   const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)

   appendAuditLog({
@@ -729,6 +740,10 @@ export async function getPlatformAnalytics(user) {
     status: 200,
     payload: {
       requested_scope: 'platform',
+      governance_mode: viewPolicy.mode,
+      governance_retention_days: governance.retention_days,
+      governance_geo_granularity: governance.geo_granularity,
+      governance_min_cohort_size: governance.min_cohort_size,
       suppression_counts: suppression,
     },
   }).catch(() => null)
```

## Why This Change

Merge pull request #78 from gamertoky1188gro/codex/implement-analytics-governance-service-0g7rcc

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 4 files changed, 90 insertions(+), 6 deletions(-)
- **Risk:** Moderate

## Relationships

Commit 200 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
