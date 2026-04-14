    1 | import { getAdminConfig } from './adminConfigService.js'
    2 | 
    3 | export const ANALYTICS_GOVERNANCE_DEFAULTS = Object.freeze({
    4 |   enabled: true,
    5 |   min_cohort_size: 10,
    6 |   geo_granularity: 'country',
    7 |   retention_days: 365,
    8 |   allow_raw_exports: false,
    9 |   export_allowed_roles: ['admin', 'owner'],
   10 |   view_allowed_roles: ['admin', 'owner'],
   11 |   date_granularity: 'month',
   12 | })
   13 | 
   14 | export const ALLOWED_ANALYTICS_DIMENSIONS = Object.freeze([
   15 |   'country',
   16 |   'category',
   17 |   'price_bucket',
   18 |   'month',
   19 |   'search_category',
   20 |   'org_scope',
   21 | ])
   22 | 
   23 | export const DENIED_ANALYTICS_FIELDS = Object.freeze([
   24 |   'actor_id',
   25 |   'user_id',
   26 |   'buyer_id',
   27 |   'email',
   28 |   'phone',
   29 |   'ip',
   30 |   'raw_ip',
   31 |   'ip_country',
   32 |   'ip_region',
   33 |   'ip_city',
   34 |   'lat',
   35 |   'lng',
   36 |   'latitude',
   37 |   'longitude',
   38 |   'exact_lat',
   39 |   'exact_lng',
   40 |   'org_member_ids',
   41 |   'member_ids',
   42 | ])
   43 | 
   44 | const HIGH_RISK_JOIN_DIMENSIONS = new Set([
   45 |   'actor_id',
   46 |   'user_id',
   47 |   'buyer_id',
   48 |   'email',
   49 |   'phone',
   50 |   'ip',
   51 |   'country+category+month+price_bucket',
   52 | ])
   53 | 
   54 | export const SENSITIVE_BUCKETING_RULES = Object.freeze({
   55 |   country: {
   56 |     levels: ['country', 'region', 'global'],
   57 |     fallback: 'global',
   58 |   },
   59 |   price: {
   60 |     buckets: ['0-5', '5-10', '10-20', '20-50', '50+', 'unknown'],
   61 |     fallback: 'unknown',
   62 |   },
   63 |   date: {
   64 |     levels: ['day', 'week', 'month', 'quarter'],
   65 |     fallback: 'month',
   66 |   },
   67 | })
   68 | 
   69 | function toObject(value) {
   70 |   return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
   71 | }
   72 | 
   73 | function normalizeGovernanceConfig(config = {}) {
   74 |   const candidate = toObject(config)
   75 |   const minCohort = Number(candidate.min_cohort_size)
   76 |   const retentionDays = Number(candidate.retention_days)
   77 |   const geo = String(candidate.geo_granularity || ANALYTICS_GOVERNANCE_DEFAULTS.geo_granularity).toLowerCase()
   78 |   const date = String(candidate.date_granularity || ANALYTICS_GOVERNANCE_DEFAULTS.date_granularity).toLowerCase()
   79 | 
   80 |   return {
   81 |     enabled: candidate.enabled !== false,
   82 |     min_cohort_size: Number.isFinite(minCohort) && minCohort > 0 ? Math.floor(minCohort) : ANALYTICS_GOVERNANCE_DEFAULTS.min_cohort_size,
   83 |     geo_granularity: SENSITIVE_BUCKETING_RULES.country.levels.includes(geo)
   84 |       ? geo
   85 |       : ANALYTICS_GOVERNANCE_DEFAULTS.geo_granularity,
   86 |     retention_days: Number.isFinite(retentionDays) && retentionDays > 0 ? Math.floor(retentionDays) : ANALYTICS_GOVERNANCE_DEFAULTS.retention_days,
   87 |     allow_raw_exports: Boolean(candidate.allow_raw_exports),
   88 |     export_allowed_roles: Array.isArray(candidate.export_allowed_roles) && candidate.export_allowed_roles.length
   89 |       ? candidate.export_allowed_roles.map((role) => String(role || '').toLowerCase()).filter(Boolean)
   90 |       : ANALYTICS_GOVERNANCE_DEFAULTS.export_allowed_roles,
   91 |     view_allowed_roles: Array.isArray(candidate.view_allowed_roles) && candidate.view_allowed_roles.length
   92 |       ? candidate.view_allowed_roles.map((role) => String(role || '').toLowerCase()).filter(Boolean)
   93 |       : ANALYTICS_GOVERNANCE_DEFAULTS.view_allowed_roles,
   94 |     date_granularity: SENSITIVE_BUCKETING_RULES.date.levels.includes(date)
   95 |       ? date
   96 |       : ANALYTICS_GOVERNANCE_DEFAULTS.date_granularity,
   97 |   }
   98 | }
   99 | 
  100 | export async function getAnalyticsGovernanceConfig() {
  101 |   const config = await getAdminConfig()
  102 |   return normalizeGovernanceConfig(config?.analytics?.governance)
  103 | }
  104 | 
  105 | export function checkAnalyticsAccessPolicy(user, config = ANALYTICS_GOVERNANCE_DEFAULTS, { mode = 'view' } = {}) {
  106 |   const governance = normalizeGovernanceConfig(config)
  107 |   const role = String(user?.role || '').toLowerCase()
  108 |   const deniedReason = mode === 'export' ? 'analytics_export_denied' : 'analytics_view_denied'
  109 | 
  110 |   if (!governance.enabled) return { allowed: true, governance, mode, role }
  111 | 
  112 |   if (mode === 'export') {
  113 |     if (!governance.allow_raw_exports) {
  114 |       return { allowed: false, governance, mode, role, reason: deniedReason }
  115 |     }
  116 |     if (!governance.export_allowed_roles.includes(role)) {
  117 |       return { allowed: false, governance, mode, role, reason: deniedReason }
  118 |     }
  119 |     return { allowed: true, governance, mode, role }
  120 |   }
  121 | 
  122 |   if (!governance.view_allowed_roles.includes(role)) {
  123 |     return { allowed: false, governance, mode, role, reason: deniedReason }
  124 |   }
  125 |   return { allowed: true, governance, mode, role }
  126 | }
  127 | 
  128 | export function assertNoUnauthorizedAnalyticsJoin(requestedDimensions = []) {
  129 |   const dims = Array.isArray(requestedDimensions)
  130 |     ? requestedDimensions.map((value) => String(value || '').trim().toLowerCase()).filter(Boolean)
  131 |     : []
  132 |   const unique = [...new Set(dims)]
  133 |   const joined = unique.slice().sort().join('+')
  134 | 
  135 |   if (HIGH_RISK_JOIN_DIMENSIONS.has(joined)) {
  136 |     const error = new Error('Requested analytics join is not allowed by data governance policy')
  137 |     error.status = 403
  138 |     error.code = 'ANALYTICS_JOIN_BLOCKED'
  139 |     throw error
  140 |   }
  141 | 
  142 |   const directBlocked = unique.find((dimension) => HIGH_RISK_JOIN_DIMENSIONS.has(dimension))
  143 |   if (directBlocked) {
  144 |     const error = new Error(`Requested dimension "${directBlocked}" is restricted`)
  145 |     error.status = 403
  146 |     error.code = 'ANALYTICS_DIMENSION_BLOCKED'
  147 |     throw error
  148 |   }
  149 | 
  150 |   if (unique.length >= 4 && unique.includes('country') && unique.includes('category') && unique.includes('month')) {
  151 |     const error = new Error('Requested analytics slice is too specific and risks re-identification')
  152 |     error.status = 403
  153 |     error.code = 'ANALYTICS_REIDENTIFICATION_BLOCKED'
  154 |     throw error
  155 |   }
  156 | 
  157 |   return unique
  158 | }
  159 | 
  160 | function noiseForCount(count, seed) {
  161 |   if (!Number.isFinite(count) || count <= 0) return 0
  162 |   const hash = String(seed || 'seed')
  163 |     .split('')
  164 |     .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  165 |   return (hash % 2 === 0) ? 1 : -1
  166 | }
  167 | 
  168 | function applyNoiseToLabeledRows(rows = [], governance, suppression, seedPrefix = 'row') {
  169 |   return rows.map((row, index) => {
  170 |     const count = Number(row?.count || 0)
  171 |     const seed = `${seedPrefix}:${row?.label || row?.bucket || 'unknown'}:${index}`
  172 |     const sparse = count > 0 && count < (governance.min_cohort_size * 2)
  173 |     if (!sparse) return row
  174 |     const noisy = Math.max(0, count + noiseForCount(count, seed))
  175 |     if (noisy !== count) suppression.noise_injected = true
  176 |     return { ...row, count: noisy }
  177 |   })
  178 | }
  179 | 
  180 | function sanitizeCountry(country, granularity) {
  181 |   const raw = String(country || 'Unknown').trim() || 'Unknown'
  182 |   if (granularity === 'country') return raw
  183 |   if (granularity === 'region') return 'regional'
  184 |   return 'global'
  185 | }
  186 | 
  187 | function toMonth(isoValue) {
  188 |   const ts = new Date(String(isoValue || '')).getTime()
  189 |   if (!Number.isFinite(ts)) return null
  190 |   const date = new Date(ts)
  191 |   return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
  192 | }
  193 | 
  194 | function toQuarter(isoValue) {
  195 |   const ts = new Date(String(isoValue || '')).getTime()
  196 |   if (!Number.isFinite(ts)) return null
  197 |   const date = new Date(ts)
  198 |   const quarter = Math.floor(date.getUTCMonth() / 3) + 1
  199 |   return `${date.getUTCFullYear()}-Q${quarter}`
  200 | }
  201 | 
  202 | function bucketDate(value, granularity) {
  203 |   if (granularity === 'quarter') return toQuarter(value)
  204 |   return toMonth(value)
  205 | }
  206 | 
  207 | function toPriceBucket(bucket) {
  208 |   const normalized = String(bucket || '').trim().toLowerCase()
  209 |   if (SENSITIVE_BUCKETING_RULES.price.buckets.includes(normalized)) return normalized
  210 |   return SENSITIVE_BUCKETING_RULES.price.fallback
  211 | }
  212 | 
  213 | function stripDeniedFields(value, deniedFields) {
  214 |   if (Array.isArray(value)) return value.map((item) => stripDeniedFields(item, deniedFields))
  215 |   if (!value || typeof value !== 'object') return value
  216 | 
  217 |   return Object.fromEntries(Object.entries(value)
  218 |     .filter(([key]) => !deniedFields.has(String(key).toLowerCase()))
  219 |     .map(([key, nested]) => [key, stripDeniedFields(nested, deniedFields)]))
  220 | }
  221 | 
  222 | function suppressLabeledItems(items = [], minCohort = 10, suppression = { suppressed_values: 0 }) {
  223 |   const kept = []
  224 |   let suppressedCount = 0
  225 | 
  226 |   for (const item of items) {
  227 |     const count = Number(item?.count || 0)
  228 |     if (count > 0 && count < minCohort) {
  229 |       suppressedCount += count
  230 |       suppression.suppressed_values += 1
  231 |       continue
  232 |     }
  233 |     kept.push({
  234 |       ...item,
  235 |       label: String(item?.label || 'unknown'),
  236 |       count,
  237 |     })
  238 |   }
  239 | 
  240 |   if (suppressedCount > 0) {
  241 |     kept.push({ label: 'insufficient_data', count: suppressedCount })
  242 |   }
  243 | 
  244 |   return kept
  245 | }
  246 | 
  247 | function suppressTrendItems(items = [], minCohort = 10, suppression = { suppressed_values: 0 }) {
  248 |   return items.map((item) => {
  249 |     const current = Number(item?.current || 0)
  250 |     const previous = Number(item?.previous || 0)
  251 |     const label = current + previous < minCohort ? 'insufficient_data' : String(item?.label || 'unknown')
  252 |     if (label === 'insufficient_data') suppression.suppressed_values += 1
  253 |     return {
  254 |       label,
  255 |       current,
  256 |       previous,
  257 |       delta: Number(item?.delta || current - previous),
  258 |     }
  259 |   })
  260 | }
  261 | 
  262 | function sanitizeCountryCategoryRows(rows = [], governance, suppression) {
  263 |   const merged = new Map()
  264 | 
  265 |   for (const row of rows) {
  266 |     const countryKey = sanitizeCountry(row?.country, governance.geo_granularity)
  267 |     if (!merged.has(countryKey)) merged.set(countryKey, new Map())
  268 |     const categories = merged.get(countryKey)
  269 | 
  270 |     const rowCategories = Array.isArray(row?.categories) ? row.categories : []
  271 |     for (const category of rowCategories) {
  272 |       const label = String(category?.label || 'Other')
  273 |       categories.set(label, (categories.get(label) || 0) + Number(category?.count || 0))
  274 |     }
  275 |   }
  276 | 
  277 |   const output = []
  278 |   for (const [country, categories] of merged.entries()) {
  279 |     const categoryRows = [...categories.entries()]
  280 |       .map(([label, count]) => ({ label, count }))
  281 |       .sort((a, b) => b.count - a.count)
  282 |       .slice(0, 5)
  283 | 
  284 |     const cohortSize = categoryRows.reduce((sum, row) => sum + Number(row.count || 0), 0)
  285 |     if (cohortSize > 0 && cohortSize < governance.min_cohort_size) {
  286 |       suppression.suppressed_cohorts += 1
  287 |       output.push({
  288 |         country: 'insufficient_data',
  289 |         categories: [{ label: 'insufficient_data', count: cohortSize }],
  290 |       })
  291 |       continue
  292 |     }
  293 | 
  294 |     output.push({
  295 |       country,
  296 |       categories: suppressLabeledItems(categoryRows, governance.min_cohort_size, suppression),
  297 |     })
  298 |   }
  299 | 
  300 |   return output
  301 | }
  302 | 
  303 | export function sanitizePlatformAnalytics(raw = {}, config = ANALYTICS_GOVERNANCE_DEFAULTS) {
  304 |   const governance = normalizeGovernanceConfig(config)
  305 |   if (!governance.enabled) {
  306 |     return {
  307 |       report: stripDeniedFields(raw, new Set(DENIED_ANALYTICS_FIELDS)),
  308 |       suppression: { suppressed_values: 0, suppressed_cohorts: 0 },
  309 |       governance,
  310 |     }
  311 |   }
  312 | 
  313 |   const suppression = { suppressed_values: 0, suppressed_cohorts: 0, noise_injected: false }
  314 |   const monthlyTrend = (Array.isArray(raw.monthly_demand_trend) ? raw.monthly_demand_trend : [])
  315 |     .map((entry) => ({
  316 |       month: bucketDate(entry?.month, governance.date_granularity) || 'unknown',
  317 |       count: Number(entry?.count || 0),
  318 |     }))
  319 | 
  320 |   function sanitizeMonthlyByLabelRows(rows = []) {
  321 |     if (!Array.isArray(rows)) return []
  322 |     const out = []
  323 |     for (const row of rows) {
  324 |       const series = Array.isArray(row?.series) ? row.series : []
  325 |       const total = series.reduce((s, e) => s + Number(e?.count || 0), 0)
  326 |       if (total > 0 && total < governance.min_cohort_size) {
  327 |         suppression.suppressed_cohorts += 1
  328 |         out.push({ label: 'insufficient_data', series: [{ month: 'insufficient_data', count: total }] })
  329 |         continue
  330 |       }
  331 | 
  332 |       const buckets = {}
  333 |       for (const s of series) {
  334 |         const monthKey = bucketDate(s?.month, governance.date_granularity) || 'unknown'
  335 |         buckets[monthKey] = (buckets[monthKey] || 0) + Number(s?.count || 0)
  336 |       }
  337 | 
  338 |       const seriesArray = Object.entries(buckets)
  339 |         .sort(([a], [b]) => a.localeCompare(b))
  340 |         .map(([month, count]) => ({ month, count }))
  341 | 
  342 |       const noisy = applyNoiseToLabeledRows(
  343 |         seriesArray.map((r) => ({ label: r.month, count: r.count })),
  344 |         governance,
  345 |         suppression,
  346 |         `monthly:${String(row?.label || 'unknown')}`,
  347 |       ).map((r) => ({ month: r.label, count: r.count }))
  348 | 
  349 |       out.push({ label: String(row?.label || 'unknown'), series: noisy })
  350 |     }
  351 |     return out
  352 |   }
  353 | 
  354 |   const priceRangeDemand = suppressLabeledItems(
  355 |     (Array.isArray(raw.price_range_demand) ? raw.price_range_demand : []).map((row) => ({
  356 |       label: toPriceBucket(row?.bucket),
  357 |       count: Number(row?.count || 0),
  358 |     })),
  359 |     governance.min_cohort_size,
  360 |     suppression,
  361 |   ).map((row) => ({ bucket: row.label, count: row.count }))
  362 | 
  363 |   const report = {
  364 |     totals: {
  365 |       buyer_requests: Number(raw?.totals?.buyer_requests || 0),
  366 |       repeat_buyer_rate: Number(raw?.totals?.repeat_buyer_rate || 0),
  367 |     },
  368 |     search_event_count: Number(raw?.search_event_count || 0),
  369 |     search_min_events: Number(raw?.search_min_events || governance.min_cohort_size),
  370 |     search_data_ready: Boolean(raw?.search_data_ready),
  371 |     search_data_source: String(raw?.search_data_source || 'unknown'),
  372 |     top_categories_by_country: sanitizeCountryCategoryRows(raw?.top_categories_by_country, governance, suppression),
  373 |     top_categories_global: applyNoiseToLabeledRows(
  374 |       suppressLabeledItems(raw?.top_categories_global, governance.min_cohort_size, suppression),
  375 |       governance,
  376 |       suppression,
  377 |       'top_categories_global',
  378 |     ),
  379 |     monthly_demand_trend: monthlyTrend,
  380 |     monthly_demand_by_category: sanitizeMonthlyByLabelRows(raw?.monthly_demand_by_category),
  381 |     monthly_demand_by_product: sanitizeMonthlyByLabelRows(raw?.monthly_demand_by_product),
  382 |     price_range_demand: applyNoiseToLabeledRows(priceRangeDemand, governance, suppression, 'price_range_demand'),
  383 |     top_search_categories_by_country: sanitizeCountryCategoryRows(raw?.top_search_categories_by_country, governance, suppression),
  384 |     top_search_categories_global: applyNoiseToLabeledRows(
  385 |       suppressLabeledItems(raw?.top_search_categories_global, governance.min_cohort_size, suppression),
  386 |       governance,
  387 |       suppression,
  388 |       'top_search_categories_global',
  389 |     ),
  390 |     trending_search_categories: applyNoiseToLabeledRows(
  391 |       suppressTrendItems(raw?.trending_search_categories, governance.min_cohort_size, suppression).map((row) => ({
  392 |         ...row,
  393 |         count: Number(row?.current || 0),
  394 |       })),
  395 |       governance,
  396 |       suppression,
  397 |       'trending_search_categories',
  398 |     ).map((row) => ({
  399 |       label: row.label,
  400 |       current: row.count,
  401 |       previous: Number(row.previous || 0),
  402 |       delta: Number(row.count || 0) - Number(row.previous || 0),
  403 |     })),
  404 |   }
  405 | 
  406 |   return {
  407 |     report: stripDeniedFields(report, new Set(DENIED_ANALYTICS_FIELDS)),
  408 |     suppression,
  409 |     governance,
  410 |   }
  411 | }
  412 | 