## Commit Metadata

- **Hash:** 0918039fde8c90a374137290fbb598b2ed109c34
- **Parent:** c6ff2cba21f122c8bf058001640342ad4bc6e373 4a64668efabc69b08a544e74992dd1d8677e01e7
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 20:39:24
- **Message:** Merge pull request #71 from gamertoky1188gro/codex/implement-analytics-governance-service

## Custom Title

Merge pull request #71 from gamertoky1188gro/codex/implement-analytics-governance-service

## High-Level Summary

Merge pull request #71 from gamertoky1188gro/codex/implement-analytics-governance-service

4 files changed, 380 insertions(+), 1 deletion(-)

## File-by-File Breakdown

.../**tests**/analyticsGovernanceService.test.js | 96 ++++++++
server/services/adminConfigService.js | 7 +
server/services/analyticsGovernanceService.js | 255 +++++++++++++++++++++
server/services/analyticsService.js | 23 +-
4 files changed, 380 insertions(+), 1 deletion(-)

## Detailed Diff Analysis

```diff
diff --git a/server/services/__tests__/analyticsGovernanceService.test.js b/server/services/__tests__/analyticsGovernanceService.test.js
new file mode 100644
index 0000000..342888f
--- /dev/null
+++ b/server/services/__tests__/analyticsGovernanceService.test.js
@@ -0,0 +1,96 @@
+import test from 'node:test'
+import assert from 'node:assert/strict'
+
+import { sanitizePlatformAnalytics } from '../analyticsGovernanceService.js'
+
+function baseReport() {
+  return {
+    totals: { buyer_requests: 4, repeat_buyer_rate: 25 },
+    search_event_count: 12,
+    search_min_events: 25,
+    search_data_ready: false,
+    search_data_source: 'proxy_requests',
+    top_categories_by_country: [
+      {
+        country: 'Bangladesh',
+        categories: [
+          { label: 'Cotton', count: 4 },
+          { label: 'Linen', count: 3 },
+        ],
+      },
+    ],
+    top_categories_global: [
+      { label: 'Cotton', count: 4 },
+      { label: 'Linen', count: 1 },
+    ],
+    monthly_demand_trend: [{ month: '2026-03-01T00:00:00.000Z', count: 4 }],
+    price_range_demand: [
+      { bucket: '0-5', count: 3 },
+      { bucket: '5-10', count: 1 },
+    ],
+    top_search_categories_by_country: [
+      {
+        country: 'Bangladesh',
+        categories: [{ label: 'Cotton', count: 2 }],
+      },
+    ],
+    top_search_categories_global: [{ label: 'Cotton', count: 2 }],
+    trending_search_categories: [{ label: 'Cotton', current: 1, previous: 1, delta: 0 }],
+    metadata: {
+      actor_id: 'user-1',
+      raw_ip: '10.10.10.10',
+    },
+  }
+}
+
+test('suppresses cohorts below min cohort size', () => {
+  const { report, suppression } = sanitizePlatformAnalytics(baseReport(), {
+    enabled: true,
+    min_cohort_size: 10,
+    geo_granularity: 'country',
+  })
+
+  assert.equal(report.top_categories_by_country[0].country, 'insufficient_data')
+  assert.deepEqual(report.top_categories_by_country[0].categories, [{ label: 'insufficient_data', count: 7 }])
+  assert.ok(report.top_categories_global.some((row) => row.label === 'insufficient_data'))
+  assert.ok(suppression.suppressed_cohorts >= 1)
+})
+
+test('strips denied identifier fields from nested metadata', () => {
+  const { report } = sanitizePlatformAnalytics(baseReport(), {
+    enabled: true,
+    min_cohort_size: 2,
+  })
+
+  assert.ok(!('metadata' in report) || !('actor_id' in (report.metadata || {})))
+  assert.equal(JSON.stringify(report).includes('raw_ip'), false)
+  assert.equal(JSON.stringify(report).includes('actor_id'), false)
+})
+
+test('keeps stable output schema under suppression', () => {
+  const expectedKeys = [
+    'totals',
+    'search_event_count',
+    'search_min_events',
+    'search_data_ready',
+    'search_data_source',
+    'top_categories_by_country',
+    'top_categories_global',
+    'monthly_demand_trend',
+    'price_range_demand',
+    'top_search_categories_by_country',
+    'top_search_categories_global',
+    'trending_search_categories',
+  ]
+
+  const { report } = sanitizePlatformAnalytics(baseReport(), {
+    enabled: true,
+    min_cohort_size: 50,
+    geo_granularity: 'global',
+  })
+
+  assert.deepEqual(Object.keys(report), expectedKeys)
+  assert.equal(Array.isArray(report.top_categories_by_country), true)
+  assert.equal(Array.isArray(report.trending_search_categories), true)
+  assert.equal(report.top_categories_by_country[0].country, 'insufficient_data')
+})
diff --git a/server/services/adminConfigService.js b/server/services/adminConfigService.js
index 75abb81..ac1326e 100644
--- a/server/services/adminConfigService.js
+++ b/server/services/adminConfigService.js
@@ -65,6 +65,13 @@ const DEFAULT_CONFIG = {
   },
   analytics: {
     search_min_events: 25,
+    governance: {
+      enabled: true,
+      min_cohort_size: 10,
+      geo_granularity: 'country',
+      retention_days: 365,
+      export_allowed_roles: ['admin', 'owner'],
+    },
   },
   support: {
     sla_targets: {
diff --git a/server/services/analyticsGovernanceService.js b/server/services/analyticsGovernanceService.js
new file mode 100644
index 0000000..df2c959
--- /dev/null
+++ b/server/services/analyticsGovernanceService.js
@@ -0,0 +1,255 @@
+import { getAdminConfig } from './adminConfigService.js'
+
+export const ANALYTICS_GOVERNANCE_DEFAULTS = Object.freeze({
+  enabled: true,
+  min_cohort_size: 10,
+  geo_granularity: 'country',
+  retention_days: 365,
+  export_allowed_roles: ['admin', 'owner'],
+  date_granularity: 'month',
+})
+
+export const ALLOWED_ANALYTICS_DIMENSIONS = Object.freeze([
+  'country',
+  'category',
+  'price_bucket',
+  'month',
+  'search_category',
+])
+
+export const DENIED_ANALYTICS_FIELDS = Object.freeze([
+  'actor_id',
+  'user_id',
+  'buyer_id',
+  'email',
+  'phone',
+  'ip',
+  'raw_ip',
+  'lat',
+  'lng',
+  'latitude',
+  'longitude',
+  'exact_lat',
+  'exact_lng',
+])
+
+export const SENSITIVE_BUCKETING_RULES = Object.freeze({
+  country: {
+    levels: ['country', 'region', 'global'],
+    fallback: 'global',
+  },
+  price: {
+    buckets: ['0-5', '5-10', '10-20', '20-50', '50+', 'unknown'],
+    fallback: 'unknown',
+  },
+  date: {
+    levels: ['day', 'week', 'month', 'quarter'],
+    fallback: 'month',
+  },
+})
+
+function toObject(value) {
+  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
+}
+
+function normalizeGovernanceConfig(config = {}) {
+  const candidate = toObject(config)
+  const minCohort = Number(candidate.min_cohort_size)
+  const retentionDays = Number(candidate.retention_days)
+  const geo = String(candidate.geo_granularity || ANALYTICS_GOVERNANCE_DEFAULTS.geo_granularity).toLowerCase()
+  const date = String(candidate.date_granularity || ANALYTICS_GOVERNANCE_DEFAULTS.date_granularity).toLowerCase()
+
+  return {
+    enabled: candidate.enabled !== false,
+    min_cohort_size: Number.isFinite(minCohort) && minCohort > 0 ? Math.floor(minCohort) : ANALYTICS_GOVERNANCE_DEFAULTS.min_cohort_size,
+    geo_granularity: SENSITIVE_BUCKETING_RULES.country.levels.includes(geo)
+      ? geo
+      : ANALYTICS_GOVERNANCE_DEFAULTS.geo_granularity,
+    retention_days: Number.isFinite(retentionDays) && retentionDays > 0 ? Math.floor(retentionDays) : ANALYTICS_GOVERNANCE_DEFAULTS.retention_days,
+    export_allowed_roles: Array.isArray(candidate.export_allowed_roles) && candidate.export_allowed_roles.length
+      ? candidate.export_allowed_roles.map((role) => String(role || '').toLowerCase()).filter(Boolean)
+      : ANALYTICS_GOVERNANCE_DEFAULTS.export_allowed_roles,
+    date_granularity: SENSITIVE_BUCKETING_RULES.date.levels.includes(date)
+      ? date
+      : ANALYTICS_GOVERNANCE_DEFAULTS.date_granularity,
+  }
+}
+
+export async function getAnalyticsGovernanceConfig() {
+  const config = await getAdminConfig()
+  return normalizeGovernanceConfig(config?.analytics?.governance)
+}
+
+function sanitizeCountry(country, granularity) {
+  const raw = String(country || 'Unknown').trim() || 'Unknown'
+  if (granularity === 'country') return raw
+  if (granularity === 'region') return 'regional'
+  return 'global'
+}
+
+function toMonth(isoValue) {
+  const ts = new Date(String(isoValue || '')).getTime()
+  if (!Number.isFinite(ts)) return null
+  const date = new Date(ts)
+  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
+}
+
+function toQuarter(isoValue) {
+  const ts = new Date(String(isoValue || '')).getTime()
+  if (!Number.isFinite(ts)) return null
+  const date = new Date(ts)
+  const quarter = Math.floor(date.getUTCMonth() / 3) + 1
+  return `${date.getUTCFullYear()}-Q${quarter}`
+}
+
+function bucketDate(value, granularity) {
+  if (granularity === 'quarter') return toQuarter(value)
+  return toMonth(value)
+}
+
+function toPriceBucket(bucket) {
+  const normalized = String(bucket || '').trim().toLowerCase()
+  if (SENSITIVE_BUCKETING_RULES.price.buckets.includes(normalized)) return normalized
+  return SENSITIVE_BUCKETING_RULES.price.fallback
+}
+
+function stripDeniedFields(value, deniedFields) {
+  if (Array.isArray(value)) return value.map((item) => stripDeniedFields(item, deniedFields))
+  if (!value || typeof value !== 'object') return value
+
+  return Object.fromEntries(Object.entries(value)
+    .filter(([key]) => !deniedFields.has(String(key).toLowerCase()))
+    .map(([key, nested]) => [key, stripDeniedFields(nested, deniedFields)]))
+}
+
+function suppressLabeledItems(items = [], minCohort = 10, suppression = { suppressed_values: 0 }) {
+  const kept = []
+  let suppressedCount = 0
+
+  for (const item of items) {
+    const count = Number(item?.count || 0)
+    if (count > 0 && count < minCohort) {
+      suppressedCount += count
+      suppression.suppressed_values += 1
+      continue
+    }
+    kept.push({
+      ...item,
+      label: String(item?.label || 'unknown'),
+      count,
+    })
+  }
+
+  if (suppressedCount > 0) {
+    kept.push({ label: 'insufficient_data', count: suppressedCount })
+  }
+
+  return kept
+}
+
+function suppressTrendItems(items = [], minCohort = 10, suppression = { suppressed_values: 0 }) {
+  return items.map((item) => {
+    const current = Number(item?.current || 0)
+    const previous = Number(item?.previous || 0)
+    const label = current + previous < minCohort ? 'insufficient_data' : String(item?.label || 'unknown')
+    if (label === 'insufficient_data') suppression.suppressed_values += 1
+    return {
+      label,
+      current,
+      previous,
+      delta: Number(item?.delta || current - previous),
+    }
+  })
+}
+
+function sanitizeCountryCategoryRows(rows = [], governance, suppression) {
+  const merged = new Map()
+
+  for (const row of rows) {
+    const countryKey = sanitizeCountry(row?.country, governance.geo_granularity)
+    if (!merged.has(countryKey)) merged.set(countryKey, new Map())
+    const categories = merged.get(countryKey)
+
+    const rowCategories = Array.isArray(row?.categories) ? row.categories : []
+    for (const category of rowCategories) {
+      const label = String(category?.label || 'Other')
+      categories.set(label, (categories.get(label) || 0) + Number(category?.count || 0))
+    }
+  }
+
+  const output = []
+  for (const [country, categories] of merged.entries()) {
+    const categoryRows = [...categories.entries()]
+      .map(([label, count]) => ({ label, count }))
+      .sort((a, b) => b.count - a.count)
+      .slice(0, 5)
+
+    const cohortSize = categoryRows.reduce((sum, row) => sum + Number(row.count || 0), 0)
+    if (cohortSize > 0 && cohortSize < governance.min_cohort_size) {
+      suppression.suppressed_cohorts += 1
+      output.push({
+        country: 'insufficient_data',
+        categories: [{ label: 'insufficient_data', count: cohortSize }],
+      })
+      continue
+    }
+
+    output.push({
+      country,
+      categories: suppressLabeledItems(categoryRows, governance.min_cohort_size, suppression),
+    })
+  }
+
+  return output
+}
+
+export function sanitizePlatformAnalytics(raw = {}, config = ANALYTICS_GOVERNANCE_DEFAULTS) {
+  const governance = normalizeGovernanceConfig(config)
+  if (!governance.enabled) {
+    return {
+      report: stripDeniedFields(raw, new Set(DENIED_ANALYTICS_FIELDS)),
+      suppression: { suppressed_values: 0, suppressed_cohorts: 0 },
+      governance,
+    }
+  }
+
+  const suppression = { suppressed_values: 0, suppressed_cohorts: 0 }
+  const monthlyTrend = (Array.isArray(raw.monthly_demand_trend) ? raw.monthly_demand_trend : [])
+    .map((entry) => ({
+      month: bucketDate(entry?.month, governance.date_granularity) || 'unknown',
+      count: Number(entry?.count || 0),
+    }))
+
+  const priceRangeDemand = suppressLabeledItems(
+    (Array.isArray(raw.price_range_demand) ? raw.price_range_demand : []).map((row) => ({
+      label: toPriceBucket(row?.bucket),
+      count: Number(row?.count || 0),
+    })),
+    governance.min_cohort_size,
+    suppression,
+  ).map((row) => ({ bucket: row.label, count: row.count }))
+
+  const report = {
+    totals: {
+      buyer_requests: Number(raw?.totals?.buyer_requests || 0),
+      repeat_buyer_rate: Number(raw?.totals?.repeat_buyer_rate || 0),
+    },
+    search_event_count: Number(raw?.search_event_count || 0),
+    search_min_events: Number(raw?.search_min_events || governance.min_cohort_size),
+    search_data_ready: Boolean(raw?.search_data_ready),
+    search_data_source: String(raw?.search_data_source || 'unknown'),
+    top_categories_by_country: sanitizeCountryCategoryRows(raw?.top_categories_by_country, governance, suppression),
+    top_categories_global: suppressLabeledItems(raw?.top_categories_global, governance.min_cohort_size, suppression),
+    monthly_demand_trend: monthlyTrend,
+    price_range_demand: priceRangeDemand,
+    top_search_categories_by_country: sanitizeCountryCategoryRows(raw?.top_search_categories_by_country, governance, suppression),
+    top_search_categories_global: suppressLabeledItems(raw?.top_search_categories_global, governance.min_cohort_size, suppression),
+    trending_search_categories: suppressTrendItems(raw?.trending_search_categories, governance.min_cohort_size, suppression),
+  }
+
+  return {
+    report: stripDeniedFields(report, new Set(DENIED_ANALYTICS_FIELDS)),
+    suppression,
+    governance,
+  }
+}
diff --git a/server/services/analyticsService.js b/server/services/analyticsService.js
index 40aabcf..bc9071f 100644
--- a/server/services/analyticsService.js
+++ b/server/services/analyticsService.js
@@ -6,6 +6,8 @@ import { getAdminConfig } from './adminConfigService.js'
 import { canViewAnalytics, canViewAnalyticsAdmin, canViewAnalyticsDashboard, forbiddenError, scopeRecordsForUser } from '../utils/permissions.js'
 import { getPlanForUser } from './entitlementService.js'
 import { getOrderCertificationSummary } from './orderCertificationService.js'
+import { appendAuditLog } from '../utils/auditStore.js'
+import { getAnalyticsGovernanceConfig, sanitizePlatformAnalytics } from './analyticsGovernanceService.js'

 const FILE = 'analytics.json'
 const SEARCH_TREND_MIN_EVENTS = 25
@@ -719,7 +721,7 @@ export async function getPlatformAnalytics(user) {
   const proxySearchByCountry = searchDataReady ? topSearchCategoriesByCountry : topCategoriesByCountry
   const proxySearchGlobal = searchDataReady ? topSearchCategoriesGlobal : topCategoriesGlobal

-  return {
+  const rawReport = {
     totals: {
       buyer_requests: requirementsRows.length,
       repeat_buyer_rate: repeatBuyerRate,
@@ -736,6 +738,25 @@ export async function getPlatformAnalytics(user) {
     top_search_categories_global: proxySearchGlobal,
     trending_search_categories: trendingCategories,
   }
+
+  const governance = await getAnalyticsGovernanceConfig()
+  const { report, suppression } = sanitizePlatformAnalytics(rawReport, governance)
+
+  appendAuditLog({
+    id: crypto.randomUUID(),
+    at: new Date().toISOString(),
+    actor_id: user?.id || null,
+    actor_role: user?.role || null,
+    action: 'platform_analytics_requested',
+    path: '/analytics/platform',
+    status: 200,
+    payload: {
+      requested_scope: 'platform',
+      suppression_counts: suppression,
+    },
+  }).catch(() => null)
+
+  return report
 }

 export async function getPremiumInsights(user) {
```

## Why This Change

Merge pull request #71 from gamertoky1188gro/codex/implement-analytics-governance-service

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 4 files changed, 380 insertions(+), 1 deletion(-)
- **Risk:** Moderate

## Relationships

Commit 186 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
