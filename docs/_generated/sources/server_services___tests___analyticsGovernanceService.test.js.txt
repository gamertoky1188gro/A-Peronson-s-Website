    1 | import test from 'node:test'
    2 | import assert from 'node:assert/strict'
    3 | 
    4 | import { assertNoUnauthorizedAnalyticsJoin, checkAnalyticsAccessPolicy, sanitizePlatformAnalytics } from '../analyticsGovernanceService.js'
    5 | 
    6 | function baseReport() {
    7 |   return {
    8 |     totals: { buyer_requests: 4, repeat_buyer_rate: 25 },
    9 |     search_event_count: 12,
   10 |     search_min_events: 25,
   11 |     search_data_ready: false,
   12 |     search_data_source: 'proxy_requests',
   13 |     top_categories_by_country: [
   14 |       {
   15 |         country: 'Bangladesh',
   16 |         categories: [
   17 |           { label: 'Cotton', count: 4 },
   18 |           { label: 'Linen', count: 3 },
   19 |         ],
   20 |       },
   21 |     ],
   22 |     top_categories_global: [
   23 |       { label: 'Cotton', count: 4 },
   24 |       { label: 'Linen', count: 1 },
   25 |     ],
   26 |     monthly_demand_trend: [{ month: '2026-03-01T00:00:00.000Z', count: 4 }],
   27 |     price_range_demand: [
   28 |       { bucket: '0-5', count: 3 },
   29 |       { bucket: '5-10', count: 1 },
   30 |     ],
   31 |     top_search_categories_by_country: [
   32 |       {
   33 |         country: 'Bangladesh',
   34 |         categories: [{ label: 'Cotton', count: 2 }],
   35 |       },
   36 |     ],
   37 |     top_search_categories_global: [{ label: 'Cotton', count: 2 }],
   38 |     trending_search_categories: [{ label: 'Cotton', current: 1, previous: 1, delta: 0 }],
   39 |     metadata: {
   40 |       actor_id: 'user-1',
   41 |       raw_ip: '10.10.10.10',
   42 |     },
   43 |   }
   44 | }
   45 | 
   46 | test('suppresses cohorts below min cohort size', () => {
   47 |   const { report, suppression } = sanitizePlatformAnalytics(baseReport(), {
   48 |     enabled: true,
   49 |     min_cohort_size: 10,
   50 |     geo_granularity: 'country',
   51 |   })
   52 | 
   53 |   assert.equal(report.top_categories_by_country[0].country, 'insufficient_data')
   54 |   assert.deepEqual(report.top_categories_by_country[0].categories, [{ label: 'insufficient_data', count: 7 }])
   55 |   assert.ok(report.top_categories_global.some((row) => row.label === 'insufficient_data'))
   56 |   assert.ok(suppression.suppressed_cohorts >= 1)
   57 | })
   58 | 
   59 | test('strips denied identifier fields from nested metadata', () => {
   60 |   const reportWithLocation = baseReport()
   61 |   reportWithLocation.metadata = {
   62 |     actor_id: 'user-1',
   63 |     raw_ip: '10.10.10.10',
   64 |     exact_lat: 23.8103,
   65 |     exact_lng: 90.4125,
   66 |     ip_country: 'BD',
   67 |   }
   68 | 
   69 |   const { report } = sanitizePlatformAnalytics(reportWithLocation, {
   70 |     enabled: true,
   71 |     min_cohort_size: 2,
   72 |   })
   73 | 
   74 |   assert.ok(!('metadata' in report) || !('actor_id' in (report.metadata || {})))
   75 |   assert.equal(JSON.stringify(report).includes('raw_ip'), false)
   76 |   assert.equal(JSON.stringify(report).includes('actor_id'), false)
   77 |   assert.equal(JSON.stringify(report).includes('exact_lat'), false)
   78 |   assert.equal(JSON.stringify(report).includes('exact_lng'), false)
   79 |   assert.equal(JSON.stringify(report).includes('ip_country'), false)
   80 | })
   81 | 
   82 | test('keeps stable output schema under suppression', () => {
   83 |   const expectedKeys = [
   84 |     'totals',
   85 |     'search_event_count',
   86 |     'search_min_events',
   87 |     'search_data_ready',
   88 |     'search_data_source',
   89 |     'top_categories_by_country',
   90 |     'top_categories_global',
   91 |     'monthly_demand_trend',
   92 |     'price_range_demand',
   93 |     'top_search_categories_by_country',
   94 |     'top_search_categories_global',
   95 |     'trending_search_categories',
   96 |   ]
   97 | 
   98 |   const { report } = sanitizePlatformAnalytics(baseReport(), {
   99 |     enabled: true,
  100 |     min_cohort_size: 50,
  101 |     geo_granularity: 'global',
  102 |   })
  103 | 
  104 |   assert.deepEqual(Object.keys(report), expectedKeys)
  105 |   assert.equal(Array.isArray(report.top_categories_by_country), true)
  106 |   assert.equal(Array.isArray(report.trending_search_categories), true)
  107 |   assert.equal(report.top_categories_by_country[0].country, 'insufficient_data')
  108 | })
  109 | 
  110 | test('policy denies non-admin view access when governance allows only admin and owner roles', () => {
  111 |   const result = checkAnalyticsAccessPolicy({ id: 'agent-1', role: 'agent' }, {
  112 |     enabled: true,
  113 |     min_cohort_size: 10,
  114 |     geo_granularity: 'country',
  115 |     view_allowed_roles: ['admin', 'owner'],
  116 |   }, { mode: 'view' })
  117 | 
  118 |   assert.equal(result.allowed, false)
  119 |   assert.equal(result.reason, 'analytics_view_denied')
  120 | })
  121 | 
  122 | test('policy denies raw export when allow_raw_exports is disabled', () => {
  123 |   const result = checkAnalyticsAccessPolicy({ id: 'admin-1', role: 'admin' }, {
  124 |     enabled: true,
  125 |     allow_raw_exports: false,
  126 |     export_allowed_roles: ['admin', 'owner'],
  127 |   }, { mode: 'export' })
  128 | 
  129 |   assert.equal(result.allowed, false)
  130 |   assert.equal(result.reason, 'analytics_export_denied')
  131 | })
  132 | 
  133 | test('blocks unauthorized analytics joins that can reveal identity', () => {
  134 |   assert.throws(
  135 |     () => assertNoUnauthorizedAnalyticsJoin(['country', 'category', 'month', 'price_bucket']),
  136 |     /too specific|not allowed/i,
  137 |   )
  138 | })
  139 | 
  140 | test('blocks direct re-identification dimensions', () => {
  141 |   assert.throws(
  142 |     () => assertNoUnauthorizedAnalyticsJoin(['country', 'email']),
  143 |     /restricted/i,
  144 |   )
  145 | })
  146 | 