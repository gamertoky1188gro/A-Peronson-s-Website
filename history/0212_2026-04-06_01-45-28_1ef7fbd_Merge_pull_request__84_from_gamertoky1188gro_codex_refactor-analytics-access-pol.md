## Commit Metadata

- **Hash:** 1ef7fbd8038601907806106fac042981af3d4abf
- **Parent:** a8ada1166d4cecce836e44260893a7d1e6b05e19 ab768e3a41eea9d064641fd730395ce033e54ba1
- **Author:** Cyber Code Master
- **Date:** 2026-04-06 01:45:28
- **Message:** Merge pull request #84 from gamertoky1188gro/codex/refactor-analytics-access-policy-and-endpoints

## Custom Title

Merge pull request #84 from gamertoky1188gro/codex/refactor-analytics-access-policy-and-endpoints

## High-Level Summary

Merge pull request #84 from gamertoky1188gro/codex/refactor-analytics-access-policy-and-endpoints

7 files changed, 348 insertions(+), 43 deletions(-)

## File-by-File Breakdown

server/controllers/analyticsController.js | 40 ++++-
server/routes/analyticsRoutes.js | 16 +-
.../**tests**/analyticsGovernanceService.test.js | 16 +-
server/services/analyticsGovernanceService.js | 98 ++++++++++-
server/services/analyticsService.js | 181 ++++++++++++++++++---
src/hooks/useAnalyticsDashboard.js | 20 ++-
src/pages/Insights.jsx | 20 ++-
7 files changed, 348 insertions(+), 43 deletions(-)

## Detailed Diff Analysis

```diff
diff --git a/server/controllers/analyticsController.js b/server/controllers/analyticsController.js
index 35df8c3..f43ba9e 100644
--- a/server/controllers/analyticsController.js
+++ b/server/controllers/analyticsController.js
@@ -1,4 +1,12 @@
-import { getAnalyticsSummary, getCompanyAnalytics, getDashboardAnalytics, getPlatformAnalytics, getPremiumInsights } from '../services/analyticsService.js'
+import {
+  getAnalyticsSummary,
+  getCompanyAnalytics,
+  getDashboardAnalytics,
+  getPlatformAnalyticsAdmin,
+  getPlatformAnalyticsSegment,
+  getPlatformAnalyticsSummary,
+  getPremiumInsights,
+} from '../services/analyticsService.js'
 import { handleControllerError } from '../utils/permissions.js'
 import { findUserById } from '../services/userService.js'
 import { ensureEntitlement } from '../services/entitlementService.js'
@@ -45,10 +53,34 @@ export async function analyticsCompany(req, res) {
   }
 }

-export async function analyticsPlatform(req, res) {
+export async function analyticsPlatformSummary(req, res) {
   try {
-    await authorize(req.user, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'platform' })
-    const report = await getPlatformAnalytics(req.user)
+    await authorize(req.user, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'platform_summary' })
+    const report = await getPlatformAnalyticsSummary(req.user)
+    return res.json(report)
+  } catch (error) {
+    return handleError(res, error)
+  }
+}
+
+export async function analyticsPlatformSegment(req, res) {
+  try {
+    await authorize(req.user, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'platform_segment' })
+    const dimensions = String(req.query?.dimensions || '')
+      .split(',')
+      .map((value) => value.trim())
+      .filter(Boolean)
+    const report = await getPlatformAnalyticsSegment(req.user, { dimensions })
+    return res.json(report)
+  } catch (error) {
+    return handleError(res, error)
+  }
+}
+
+export async function analyticsPlatformAdmin(req, res) {
+  try {
+    await authorize(req.user, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'platform_admin' })
+    const report = await getPlatformAnalyticsAdmin(req.user, { export: req.query?.export === 'true' })
     return res.json(report)
   } catch (error) {
     return handleError(res, error)
diff --git a/server/routes/analyticsRoutes.js b/server/routes/analyticsRoutes.js
index f6c17b4..63ca23b 100644
--- a/server/routes/analyticsRoutes.js
+++ b/server/routes/analyticsRoutes.js
@@ -1,13 +1,25 @@
 import { Router } from 'express'
 import { allowRoles, requireAuth } from '../middleware/auth.js'
-import { analyticsCompany, analyticsDashboard, analyticsPlatform, analyticsPremium, analyticsSummary, analyticsViewers } from '../controllers/analyticsController.js'
+import {
+  analyticsCompany,
+  analyticsDashboard,
+  analyticsPlatformAdmin,
+  analyticsPlatformSegment,
+  analyticsPlatformSummary,
+  analyticsPremium,
+  analyticsSummary,
+  analyticsViewers,
+} from '../controllers/analyticsController.js'

 const router = Router()

 router.get('/summary', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsSummary)
 router.get('/dashboard', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsDashboard)
 router.get('/company', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), analyticsCompany)
-router.get('/platform', requireAuth, allowRoles('owner', 'admin'), analyticsPlatform)
+router.get('/platform/summary', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsPlatformSummary)
+router.get('/platform/segment', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'), analyticsPlatformSegment)
+router.get('/platform/admin', requireAuth, allowRoles('owner', 'admin'), analyticsPlatformAdmin)
+router.get('/platform', requireAuth, allowRoles('owner', 'admin'), analyticsPlatformAdmin)
 router.get('/premium', requireAuth, allowRoles('owner', 'admin', 'buyer', 'factory', 'buying_house', 'agent'), analyticsPremium)
 router.get('/viewers', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), analyticsViewers)

diff --git a/server/services/__tests__/analyticsGovernanceService.test.js b/server/services/__tests__/analyticsGovernanceService.test.js
index d64334d..23d5f56 100644
--- a/server/services/__tests__/analyticsGovernanceService.test.js
+++ b/server/services/__tests__/analyticsGovernanceService.test.js
@@ -1,7 +1,7 @@
 import test from 'node:test'
 import assert from 'node:assert/strict'

-import { checkAnalyticsAccessPolicy, sanitizePlatformAnalytics } from '../analyticsGovernanceService.js'
+import { assertNoUnauthorizedAnalyticsJoin, checkAnalyticsAccessPolicy, sanitizePlatformAnalytics } from '../analyticsGovernanceService.js'

 function baseReport() {
   return {
@@ -129,3 +129,17 @@ test('policy denies raw export when allow_raw_exports is disabled', () => {
   assert.equal(result.allowed, false)
   assert.equal(result.reason, 'analytics_export_denied')
 })
+
+test('blocks unauthorized analytics joins that can reveal identity', () => {
+  assert.throws(
+    () => assertNoUnauthorizedAnalyticsJoin(['country', 'category', 'month', 'price_bucket']),
+    /too specific|not allowed/i,
+  )
+})
+
+test('blocks direct re-identification dimensions', () => {
+  assert.throws(
+    () => assertNoUnauthorizedAnalyticsJoin(['country', 'email']),
+    /restricted/i,
+  )
+})
diff --git a/server/services/analyticsGovernanceService.js b/server/services/analyticsGovernanceService.js
index 5a386bf..4f1ccfc 100644
--- a/server/services/analyticsGovernanceService.js
+++ b/server/services/analyticsGovernanceService.js
@@ -17,6 +17,7 @@ export const ALLOWED_ANALYTICS_DIMENSIONS = Object.freeze([
   'price_bucket',
   'month',
   'search_category',
+  'org_scope',
 ])

 export const DENIED_ANALYTICS_FIELDS = Object.freeze([
@@ -36,6 +37,18 @@ export const DENIED_ANALYTICS_FIELDS = Object.freeze([
   'longitude',
   'exact_lat',
   'exact_lng',
+  'org_member_ids',
+  'member_ids',
+])
+
+const HIGH_RISK_JOIN_DIMENSIONS = new Set([
+  'actor_id',
+  'user_id',
+  'buyer_id',
+  'email',
+  'phone',
+  'ip',
+  'country+category+month+price_bucket',
 ])

 export const SENSITIVE_BUCKETING_RULES = Object.freeze({
@@ -112,6 +125,58 @@ export function checkAnalyticsAccessPolicy(user, config = ANALYTICS_GOVERNANCE_D
   return { allowed: true, governance, mode, role }
 }

+export function assertNoUnauthorizedAnalyticsJoin(requestedDimensions = []) {
+  const dims = Array.isArray(requestedDimensions)
+    ? requestedDimensions.map((value) => String(value || '').trim().toLowerCase()).filter(Boolean)
+    : []
+  const unique = [...new Set(dims)]
+  const joined = unique.slice().sort().join('+')
+
+  if (HIGH_RISK_JOIN_DIMENSIONS.has(joined)) {
+    const error = new Error('Requested analytics join is not allowed by data governance policy')
+    error.status = 403
+    error.code = 'ANALYTICS_JOIN_BLOCKED'
+    throw error
+  }
+
+  const directBlocked = unique.find((dimension) => HIGH_RISK_JOIN_DIMENSIONS.has(dimension))
+  if (directBlocked) {
+    const error = new Error(`Requested dimension "${directBlocked}" is restricted`)
+    error.status = 403
+    error.code = 'ANALYTICS_DIMENSION_BLOCKED'
+    throw error
+  }
+
+  if (unique.length >= 4 && unique.includes('country') && unique.includes('category') && unique.includes('month')) {
+    const error = new Error('Requested analytics slice is too specific and risks re-identification')
+    error.status = 403
+    error.code = 'ANALYTICS_REIDENTIFICATION_BLOCKED'
+    throw error
+  }
+
+  return unique
+}
+
+function noiseForCount(count, seed) {
+  if (!Number.isFinite(count) || count <= 0) return 0
+  const hash = String(seed || 'seed')
+    .split('')
+    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
+  return (hash % 2 === 0) ? 1 : -1
+}
+
+function applyNoiseToLabeledRows(rows = [], governance, suppression, seedPrefix = 'row') {
+  return rows.map((row, index) => {
+    const count = Number(row?.count || 0)
+    const seed = `${seedPrefix}:${row?.label || row?.bucket || 'unknown'}:${index}`
+    const sparse = count > 0 && count < (governance.min_cohort_size * 2)
+    if (!sparse) return row
+    const noisy = Math.max(0, count + noiseForCount(count, seed))
+    if (noisy !== count) suppression.noise_injected = true
+    return { ...row, count: noisy }
+  })
+}
+
 function sanitizeCountry(country, granularity) {
   const raw = String(country || 'Unknown').trim() || 'Unknown'
   if (granularity === 'country') return raw
@@ -245,7 +310,7 @@ export function sanitizePlatformAnalytics(raw = {}, config = ANALYTICS_GOVERNANC
     }
   }

-  const suppression = { suppressed_values: 0, suppressed_cohorts: 0 }
+  const suppression = { suppressed_values: 0, suppressed_cohorts: 0, noise_injected: false }
   const monthlyTrend = (Array.isArray(raw.monthly_demand_trend) ? raw.monthly_demand_trend : [])
     .map((entry) => ({
       month: bucketDate(entry?.month, governance.date_granularity) || 'unknown',
@@ -271,12 +336,35 @@ export function sanitizePlatformAnalytics(raw = {}, config = ANALYTICS_GOVERNANC
     search_data_ready: Boolean(raw?.search_data_ready),
     search_data_source: String(raw?.search_data_source || 'unknown'),
     top_categories_by_country: sanitizeCountryCategoryRows(raw?.top_categories_by_country, governance, suppression),
-    top_categories_global: suppressLabeledItems(raw?.top_categories_global, governance.min_cohort_size, suppression),
+    top_categories_global: applyNoiseToLabeledRows(
+      suppressLabeledItems(raw?.top_categories_global, governance.min_cohort_size, suppression),
+      governance,
+      suppression,
+      'top_categories_global',
+    ),
     monthly_demand_trend: monthlyTrend,
-    price_range_demand: priceRangeDemand,
+    price_range_demand: applyNoiseToLabeledRows(priceRangeDemand, governance, suppression, 'price_range_demand'),
     top_search_categories_by_country: sanitizeCountryCategoryRows(raw?.top_search_categories_by_country, governance, suppression),
-    top_search_categories_global: suppressLabeledItems(raw?.top_search_categories_global, governance.min_cohort_size, suppression),
-    trending_search_categories: suppressTrendItems(raw?.trending_search_categories, governance.min_cohort_size, suppression),
+    top_search_categories_global: applyNoiseToLabeledRows(
+      suppressLabeledItems(raw?.top_search_categories_global, governance.min_cohort_size, suppression),
+      governance,
+      suppression,
+      'top_search_categories_global',
+    ),
+    trending_search_categories: applyNoiseToLabeledRows(
+      suppressTrendItems(raw?.trending_search_categories, governance.min_cohort_size, suppression).map((row) => ({
+        ...row,
+        count: Number(row?.current || 0),
+      })),
+      governance,
+      suppression,
+      'trending_search_categories',
+    ).map((row) => ({
+      label: row.label,
+      current: row.count,
+      previous: Number(row.previous || 0),
+      delta: Number(row.count || 0) - Number(row.previous || 0),
+    })),
   }

   return {
diff --git a/server/services/analyticsService.js b/server/services/analyticsService.js
index bd3f1ca..e2376dd 100644
--- a/server/services/analyticsService.js
+++ b/server/services/analyticsService.js
@@ -7,7 +7,12 @@ import { canViewAnalytics, canViewAnalyticsAdmin, canViewAnalyticsDashboard, for
 import { getPlanForUser } from './entitlementService.js'
 import { getOrderCertificationSummary } from './orderCertificationService.js'
 import { appendAuditLog } from '../utils/auditStore.js'
-import { checkAnalyticsAccessPolicy, getAnalyticsGovernanceConfig, sanitizePlatformAnalytics } from './analyticsGovernanceService.js'
+import {
+  assertNoUnauthorizedAnalyticsJoin,
+  checkAnalyticsAccessPolicy,
+  getAnalyticsGovernanceConfig,
+  sanitizePlatformAnalytics,
+} from './analyticsGovernanceService.js'

 const FILE = 'analytics.json'
 const SEARCH_TREND_MIN_EVENTS = 25
@@ -595,12 +600,17 @@ export async function getCompanyAnalytics(user) {
 }

 export async function getPlatformAnalytics(user) {
-  ensureAnalyticsAdminAccess(user)
+  return getPlatformAnalyticsAdmin(user, {})
+}

-  const governance = await getAnalyticsGovernanceConfig()
-  const viewPolicy = checkAnalyticsAccessPolicy(user, governance, { mode: 'view' })
-  if (!viewPolicy.allowed) throw forbiddenError('Analytics governance policy denied this request')
+function resolvePlatformOrgScopeId(user) {
+  const role = String(user?.role || '').toLowerCase()
+  if (role === 'agent') return String(user?.org_owner_id || '')
+  if (role === 'buyer' || role === 'factory' || role === 'buying_house') return String(user?.id || '')
+  return ''
+}

+async function buildPlatformAnalyticsSnapshot(governance) {
   const [requirements, users, events] = await Promise.all([
     readJson('requirements.json'),
     readJson('users.json'),
@@ -608,10 +618,6 @@ export async function getPlatformAnalytics(user) {
   ])

   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
-  const byCountry = {}
-  const globalCategories = {}
-  const priceBuckets = {}
-
   const retentionMs = Math.max(1, Number(governance.retention_days || 365)) * 24 * 60 * 60 * 1000
   const retentionCutoff = Date.now() - retentionMs
   const requirementsRows = (Array.isArray(requirements) ? requirements : []).filter((row) => {
@@ -623,6 +629,14 @@ export async function getPlatformAnalytics(user) {
     return Number.isFinite(createdAt) && createdAt >= retentionCutoff
   })

+  return { usersById, requirementsRows, eventRows }
+}
+
+function buildRawPlatformReport(requirementsRows, eventRows, usersById) {
+  const byCountry = {}
+  const globalCategories = {}
+  const priceBuckets = {}
+
   for (const req of requirementsRows) {
     const buyer = usersById.get(String(req.buyer_id || ''))
     const country = String(buyer?.profile?.country || 'Unknown')
@@ -665,8 +679,6 @@ export async function getPlatformAnalytics(user) {

   const searchEvents = eventRows.filter((e) => String(e.type || '') === 'search_run')
   const searchEventCount = searchEvents.length
-  const minEvents = await getSearchMinEvents()
-  const searchDataReady = searchEventCount >= minEvents
   const searchByCountry = {}
   const searchGlobal = {}

@@ -715,40 +727,159 @@ export async function getPlatformAnalytics(user) {
     return { label: cat, delta: current - previous, current, previous }
   }).sort((a, b) => b.delta - a.delta).slice(0, 6)

-  const searchDataSource = searchDataReady ? 'search_events' : 'proxy_requests'
-  const proxySearchByCountry = searchDataReady ? topSearchCategoriesByCountry : topCategoriesByCountry
-  const proxySearchGlobal = searchDataReady ? topSearchCategoriesGlobal : topCategoriesGlobal
-
-  const rawReport = {
+  return {
     totals: {
       buyer_requests: requirementsRows.length,
       repeat_buyer_rate: repeatBuyerRate,
     },
     search_event_count: searchEventCount,
-    search_min_events: minEvents,
-    search_data_ready: searchDataReady,
-    search_data_source: searchDataSource,
     top_categories_by_country: topCategoriesByCountry,
     top_categories_global: topCategoriesGlobal,
     monthly_demand_trend: toMonthlySeries(requirementsRows, 'created_at'),
     price_range_demand: priceRangeDemand,
-    top_search_categories_by_country: proxySearchByCountry,
-    top_search_categories_global: proxySearchGlobal,
+    top_search_categories_by_country: topSearchCategoriesByCountry,
+    top_search_categories_global: topSearchCategoriesGlobal,
     trending_search_categories: trendingCategories,
   }
+}
+
+function toGovernedResponse(report, { scopeLevel, suppression, privacyThresholdApplied }) {
+  return {
+    ...report,
+    scope_level: scopeLevel,
+    suppressed_fields: Object.keys(suppression || {}).filter((key) => {
+      if (key === 'noise_injected') return Boolean(suppression[key])
+      return Number(suppression[key] || 0) > 0
+    }),
+    privacy_threshold_applied: Boolean(privacyThresholdApplied),
+  }
+}
+
+export async function getPlatformAnalyticsSummary(user) {
+  ensureAnalyticsAccess(user)
+  const governance = await getAnalyticsGovernanceConfig()
+  const viewPolicy = checkAnalyticsAccessPolicy(user, governance, { mode: 'view' })
+  if (!viewPolicy.allowed) throw forbiddenError('Analytics governance policy denied this request')
+
+  const { usersById, requirementsRows, eventRows } = await buildPlatformAnalyticsSnapshot(governance)
+  const minEvents = await getSearchMinEvents()
+  const rawReport = buildRawPlatformReport(requirementsRows, eventRows, usersById)
+  rawReport.search_min_events = minEvents
+  rawReport.search_data_ready = rawReport.search_event_count >= minEvents
+  rawReport.search_data_source = rawReport.search_data_ready ? 'search_events' : 'proxy_requests'
+  rawReport.top_categories_by_country = []
+  rawReport.top_search_categories_by_country = []

   const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)
+  const response = toGovernedResponse(report, {
+    scopeLevel: 'platform_summary_aggregated',
+    suppression,
+    privacyThresholdApplied: governance.enabled,
+  })
+
+  appendAuditLog({
+    id: crypto.randomUUID(),
+    at: new Date().toISOString(),
+    actor_id: user?.id || null,
+    actor_role: user?.role || null,
+    action: 'platform_analytics_summary_requested',
+    path: '/analytics/platform/summary',
+    status: 200,
+    payload: { scope_level: response.scope_level, suppression_counts: suppression },
+  }).catch(() => null)
+
+  return response
+}
+
+export async function getPlatformAnalyticsSegment(user, options = {}) {
+  ensureAnalyticsAccess(user)
+  const governance = await getAnalyticsGovernanceConfig()
+  const viewPolicy = checkAnalyticsAccessPolicy(user, governance, { mode: 'view' })
+  if (!viewPolicy.allowed) throw forbiddenError('Analytics governance policy denied this request')
+
+  assertNoUnauthorizedAnalyticsJoin(options.dimensions || [])
+  const orgScopeId = resolvePlatformOrgScopeId(user)
+  const { usersById, requirementsRows, eventRows } = await buildPlatformAnalyticsSnapshot(governance)
+  const scopedRequirements = requirementsRows.filter((row) => {
+    if (!orgScopeId) return false
+    const buyerId = String(row?.buyer_id || '')
+    const assignedAgent = String(row?.assigned_agent_id || row?.agent_id || '')
+    return buyerId === orgScopeId || assignedAgent === orgScopeId
+  })
+  const scopedEvents = eventRows.filter((row) => {
+    if (!orgScopeId) return false
+    return String(row?.actor_id || '') === orgScopeId || String(row?.entity_id || '') === orgScopeId
+  })
+
+  const minEvents = await getSearchMinEvents()
+  const rawReport = buildRawPlatformReport(scopedRequirements, scopedEvents, usersById)
+  rawReport.search_min_events = minEvents
+  rawReport.search_data_ready = rawReport.search_event_count >= minEvents
+  rawReport.search_data_source = rawReport.search_data_ready ? 'search_events' : 'proxy_requests'
+  rawReport.org_scope = orgScopeId ? `org:${orgScopeId.slice(0, 6)}***` : 'org:unknown'
+
+  const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)
+  const response = toGovernedResponse(report, {
+    scopeLevel: 'platform_segment_org_anonymized',
+    suppression,
+    privacyThresholdApplied: governance.enabled,
+  })
+
+  appendAuditLog({
+    id: crypto.randomUUID(),
+    at: new Date().toISOString(),
+    actor_id: user?.id || null,
+    actor_role: user?.role || null,
+    action: 'platform_analytics_segment_requested',
+    path: '/analytics/platform/segment',
+    status: 200,
+    payload: {
+      scope_level: response.scope_level,
+      requested_dimensions: options.dimensions || [],
+      org_scope: rawReport.org_scope,
+      suppression_counts: suppression,
+    },
+  }).catch(() => null)
+
+  return response
+}
+
+export async function getPlatformAnalyticsAdmin(user, options = {}) {
+  ensureAnalyticsAdminAccess(user)
+
+  const governance = await getAnalyticsGovernanceConfig()
+  const viewPolicy = checkAnalyticsAccessPolicy(user, governance, { mode: 'view' })
+  if (!viewPolicy.allowed) throw forbiddenError('Analytics governance policy denied this request')
+
+  const { usersById, requirementsRows, eventRows } = await buildPlatformAnalyticsSnapshot(governance)
+  const rawReport = buildRawPlatformReport(requirementsRows, eventRows, usersById)
+  const minEvents = await getSearchMinEvents()
+  rawReport.search_min_events = minEvents
+  rawReport.search_data_ready = rawReport.search_event_count >= minEvents
+  rawReport.search_data_source = rawReport.search_data_ready ? 'search_events' : 'proxy_requests'
+  if (!rawReport.search_data_ready) {
+    rawReport.top_search_categories_by_country = rawReport.top_categories_by_country
+    rawReport.top_search_categories_global = rawReport.top_categories_global
+  }
+
+  const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)
+  const response = toGovernedResponse(report, {
+    scopeLevel: 'platform_admin_full_detail',
+    suppression,
+    privacyThresholdApplied: governance.enabled,
+  })

   appendAuditLog({
     id: crypto.randomUUID(),
     at: new Date().toISOString(),
     actor_id: user?.id || null,
     actor_role: user?.role || null,
-    action: 'platform_analytics_requested',
-    path: '/analytics/platform',
+    action: options.export ? 'platform_analytics_export_requested' : 'platform_analytics_admin_requested',
+    path: '/analytics/platform/admin',
     status: 200,
     payload: {
-      requested_scope: 'platform',
+      requested_scope: 'platform_admin',
+      export_requested: Boolean(options.export),
       governance_mode: viewPolicy.mode,
       governance_retention_days: governance.retention_days,
       governance_geo_granularity: governance.geo_granularity,
@@ -757,7 +888,7 @@ export async function getPlatformAnalytics(user) {
     },
   }).catch(() => null)

-  return report
+  return response
 }

 export async function getPremiumInsights(user) {
diff --git a/src/hooks/useAnalyticsDashboard.js b/src/hooks/useAnalyticsDashboard.js
index 2205601..9f54551 100644
--- a/src/hooks/useAnalyticsDashboard.js
+++ b/src/hooks/useAnalyticsDashboard.js
@@ -1,5 +1,5 @@
 import { useEffect, useMemo, useState } from 'react'
-import { apiRequest, getToken } from '../lib/auth'
+import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

 const ENTERPRISE_PLANS = new Set(['premium', 'enterprise'])

@@ -30,6 +30,8 @@ export default function useAnalyticsDashboard() {
         if (!alive) return
         setDashboard(dashboardData)
         setSubscription(subscriptionData)
+        const currentUser = getCurrentUser()
+        const role = String(currentUser?.role || '').toLowerCase()

         apiRequest('/analytics/company', { token })
           .then((data) => {
@@ -41,14 +43,24 @@ export default function useAnalyticsDashboard() {
             setCompanyAnalytics(null)
           })

-        apiRequest('/analytics/platform', { token })
+        const platformPath = ['owner', 'admin'].includes(role)
+          ? '/analytics/platform/admin'
+          : '/analytics/platform/segment'
+        apiRequest(platformPath, { token })
           .then((data) => {
             if (!alive) return
             setPlatformAnalytics(data)
           })
-          .catch(() => {
+          .catch(async () => {
             if (!alive) return
-            setPlatformAnalytics(null)
+            try {
+              const fallback = await apiRequest('/analytics/platform/summary', { token })
+              if (!alive) return
+              setPlatformAnalytics(fallback)
+            } catch {
+              if (!alive) return
+              setPlatformAnalytics(null)
+            }
           })

         apiRequest('/analytics/premium', { token })
diff --git a/src/pages/Insights.jsx b/src/pages/Insights.jsx
index 7cb9176..46afb7a 100644
--- a/src/pages/Insights.jsx
+++ b/src/pages/Insights.jsx
@@ -38,6 +38,9 @@ export default function Insights() {
   const searchEventCount = platformAnalytics?.search_event_count ?? 0
   const searchDataReady = platformAnalytics?.search_data_ready ?? true
   const searchMinEvents = platformAnalytics?.search_min_events ?? 25
+  const scopeLevel = String(platformAnalytics?.scope_level || 'not_available')
+  const suppressedFields = Array.isArray(platformAnalytics?.suppressed_fields) ? platformAnalytics.suppressed_fields : []
+  const privacyThresholdApplied = Boolean(platformAnalytics?.privacy_threshold_applied)
   const premiumRole = premiumInsights?.role || ''
   const canExportAnalytics = currentUser?.capabilities?.leads?.export !== false

@@ -460,6 +463,13 @@ export default function Insights() {

             {platformAnalytics ? (
               <div className="mt-8 space-y-4">
+                <div className="rounded-2xl bg-blue-50 p-4 text-xs text-blue-900 ring-1 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-200 dark:ring-blue-500/30">
+                  <div className="font-semibold uppercase tracking-[0.12em]">Scope: {scopeLevel.replace(/_/g, ' ')}</div>
+                  <div className="mt-1">
+                    Privacy thresholds: {privacyThresholdApplied ? 'applied' : 'not applied'}.
+                    {suppressedFields.length ? ` Suppressed controls: ${suppressedFields.join(', ')}.` : ' No suppressed slices in this snapshot.'}
+                  </div>
+                </div>
                 {!searchDataReady ? (
                   <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                     Search trends are still warming up. We need more search activity to show reliable demand insights. Current events: {searchEventCount}/{searchMinEvents}. Showing proxy demand from buyer requests.
@@ -471,7 +481,8 @@ export default function Insights() {
                   <StatCard label="Top Categories" value={platformCategories.map((c) => c.label).slice(0, 3).join(', ') || '--'} />
                 </div>

-                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
+                {scopeLevel !== 'platform_summary_aggregated' ? (
+                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                   <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                     <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Top Categories by Country</p>
                     <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">
@@ -494,7 +505,12 @@ export default function Insights() {
                       )) : <div className="text-sm text-slate-500">No price-range data yet.</div>}
                     </div>
                   </div>
-                </div>
+                  </div>
+                ) : (
+                  <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
+                    Detailed geography and segment breakdowns are hidden for this role. Switch to organization-scoped or admin scope for deeper cuts.
+                  </div>
+                )}

                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                   <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
```

## Why This Change

Merge pull request #84 from gamertoky1188gro/codex/refactor-analytics-access-policy-and-endpoints

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 7 files changed, 348 insertions(+), 43 deletions(-)
- **Risk:** Moderate

## Relationships

Commit 212 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
