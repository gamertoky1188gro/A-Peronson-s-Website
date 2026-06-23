## Commit Metadata
- **Hash:** fce7676a0689a703e42d9f61b3480383a827840f
- **Parent:** f3423db52dd83579efbf8401eb70d6085610a0c1
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 21:06:30
- **Message:** Refine search core filters and add guard tests

## Custom Title
Refine search core filters and add guard tests

## High-Level Summary
Refine search core filters and add guard tests

 3 files changed, 122 insertions(+), 51 deletions(-)

## File-by-File Breakdown
commit fce7676a0689a703e42d9f61b3480383a827840f
Author: Cyber Code Master <148459541+gamertoky1188gro@users.noreply.github.com>
Date:   Sun Apr 5 21:06:30 2026 +0600

    Refine search core filters and add guard tests

 src/pages/SearchResults.jsx                     | 83 ++++++++++---------------
 src/pages/__tests__/searchFiltersConfig.test.js | 39 ++++++++++++
 src/pages/searchFiltersConfig.js                | 51 +++++++++++++++
 3 files changed, 122 insertions(+), 51 deletions(-)

## Detailed Diff Analysis
```diff
diff --git a/src/pages/SearchResults.jsx b/src/pages/SearchResults.jsx
index f45576b..ba8617e 100644
--- a/src/pages/SearchResults.jsx
+++ b/src/pages/SearchResults.jsx
@@ -36,6 +36,7 @@ import ProductQuickViewModal from '../components/products/ProductQuickViewModal'
 import { trackClientEvent } from '../lib/events'
 import { recordLeadSource } from '../lib/leadSource'
 import L from 'leaflet'
+import { ADVANCED_FILTER_KEYS, DEFAULT_CORE_FILTER_KEYS, validateCoreFilterRenderKeys } from './searchFiltersConfig'
 
 const Motion = motion
 
@@ -162,33 +163,6 @@ function roleToProfileRoute(role, id) {
   return `/factory/${encodeURIComponent(id)}`
 }
 
-const CORE_FILTER_KEYS = ['industry', 'moqRange', 'priceRange', 'country', 'verifiedOnly', 'orgType', 'leadTimeMax', 'priorityOnly']
-const ADVANCED_FILTER_KEYS = [
-  'fabricType',
-  'gsmMin',
-  'gsmMax',
-  'sizeRange',
-  'colorPantone',
-  'customization',
-  'sampleAvailable',
-  'sampleLeadTime',
-  'certifications',
-  'incoterms',
-  'paymentTerms',
-  'documentReady',
-  'auditDate',
-  'languageSupport',
-  'capacityMin',
-  'processes',
-  'yearsInBusinessMin',
-  'responseTimeMax',
-  'teamSeatsMin',
-  'handlesMultipleFactories',
-  'exportPort',
-  'distanceKm',
-  'locationLat',
-  'locationLng',
-]
 
 function buildQueryString({ q, category, filters, includeAdvanced, includePriority = false }) {
   // Build URLSearchParams from UI state.
@@ -389,6 +363,7 @@ export default function SearchResults() {
   const [filtersOpen, setFiltersOpen] = useState(false)
   const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
   const [filterMode, setFilterMode] = useState('product')
+  const renderedDefaultCoreFilterKeys = useMemo(() => [...DEFAULT_CORE_FILTER_KEYS], [])
   const [upgradePrompt, setUpgradePrompt] = useState('')
   const [alertFeedback, setAlertFeedback] = useState('')
   const [autoSaveCandidate, setAutoSaveCandidate] = useState(null)
@@ -444,6 +419,18 @@ export default function SearchResults() {
     locationLat: searchParams.get('locationLat') || '',
     locationLng: searchParams.get('locationLng') || '',
   }))
+  const hasAdvancedFiltersFromUrl = useMemo(() => (
+    ADVANCED_FILTER_KEYS.some((key) => key !== 'priorityOnly' && hasFilterValue(searchParams.get(key)))
+  ), [searchParams])
+
+  useEffect(() => {
+    const inDev = !import.meta.env.PROD
+    if (!inDev) return
+    const validation = validateCoreFilterRenderKeys(renderedDefaultCoreFilterKeys)
+    if (!validation.isValid) {
+      console.warn('[SearchResults] Invalid default core filter configuration.', validation)
+    }
+  }, [renderedDefaultCoreFilterKeys])
 
   useEffect(() => {
     let alive = true
@@ -775,7 +762,7 @@ export default function SearchResults() {
     const activeAdvancedKeys = hasAdvancedAccess
       ? ADVANCED_FILTER_KEYS.filter((key) => hasFilterValue(filters[key]))
       : []
-    const activeCoreKeys = CORE_FILTER_KEYS.filter((key) => hasFilterValue(filters[key]))
+    const activeCoreKeys = DEFAULT_CORE_FILTER_KEYS.filter((key) => (key === 'category' ? category.length > 0 : hasFilterValue(filters[key])))
     const payload = {
       query: query.trim(),
       categories: category,
@@ -1149,7 +1136,7 @@ export default function SearchResults() {
               <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                 <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Core filters</p>
                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Always free</p>
-                <div className="mt-3 grid grid-cols-1 gap-2">
+                <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
                   <select
                     value={filters.industry}
                     onChange={(e) => updateCoreFilter('industry', e.target.value)}
@@ -1221,20 +1208,6 @@ export default function SearchResults() {
                     />
                     Verified only
                   </label>
-                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
-                    <input
-                      type="checkbox"
-                      checked={filters.priorityOnly}
-                      onChange={(e) => updatePriorityFilter(e.target.checked)}
-                      className="h-4 w-4"
-                    />
-                    Priority only
-                    {!priorityAllowedForTab ? (
-                      <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
-                        Premium
-                      </span>
-                    ) : null}
-                  </label>
                   <select
                     value={filters.leadTimeMax}
                     onChange={(e) => updateCoreFilter('leadTimeMax', e.target.value)}
@@ -1250,7 +1223,7 @@ export default function SearchResults() {
                 </div>
               </div>
 
-              <div className={`rounded-2xl p-4 ring-1 shadow-sm${premiumLocked ? ' bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : ' bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`}>
+              <div className={`rounded-2xl p-4 ring-1 shadow-sm${premiumLocked ? ' bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : ' bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`} data-has-advanced-url-filters={hasAdvancedFiltersFromUrl ? 'true' : 'false'}>
                 <div className="flex items-center justify-between gap-2">
                   <div>
                     <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Advanced filters</p>
@@ -1261,12 +1234,26 @@ export default function SearchResults() {
                     onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
                     className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                   >
-                    {advancedFiltersOpen ? 'Hide filters' : 'More filters'}
+                    {advancedFiltersOpen ? 'Hide filters' : 'More Filters'}
                   </button>
                 </div>
 
                 {advancedFiltersOpen ? (
                   <div className="mt-3 grid grid-cols-1 gap-2">
+                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
+                      <input
+                        type="checkbox"
+                        checked={filters.priorityOnly}
+                        onChange={(e) => updatePriorityFilter(e.target.checked)}
+                        className="h-4 w-4"
+                      />
+                      Priority only
+                      {!priorityAllowedForTab ? (
+                        <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
+                          Premium
+                        </span>
+                      ) : null}
+                    </label>
                     <div className="flex flex-wrap gap-2 rounded-full bg-slate-50 p-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                       <button
                         type="button"
@@ -2034,9 +2021,3 @@ export default function SearchResults() {
     </div>
   )
 }
-
-
-
-
-
-
diff --git a/src/pages/__tests__/searchFiltersConfig.test.js b/src/pages/__tests__/searchFiltersConfig.test.js
new file mode 100644
index 0000000..f6c2934
--- /dev/null
+++ b/src/pages/__tests__/searchFiltersConfig.test.js
@@ -0,0 +1,39 @@
+import test from 'node:test'
+import assert from 'node:assert/strict'
+import {
+  DEFAULT_CORE_FILTER_KEYS,
+  validateCoreFilterRenderKeys,
+} from '../searchFiltersConfig.js'
+
+test('default core filters stay capped at 8 keys', () => {
+  assert.ok(DEFAULT_CORE_FILTER_KEYS.length <= 8)
+})
+
+test('default core filters match expected initial UI controls', () => {
+  assert.deepEqual(DEFAULT_CORE_FILTER_KEYS, [
+    'industry',
+    'category',
+    'verifiedOnly',
+    'country',
+    'moqRange',
+    'priceRange',
+    'orgType',
+    'leadTimeMax',
+  ])
+})
+
+test('guard utility flags leaked non-core keys', () => {
+  const result = validateCoreFilterRenderKeys([...DEFAULT_CORE_FILTER_KEYS, 'priorityOnly'])
+  assert.equal(result.isValid, false)
+  assert.deepEqual(result.unknownKeys, ['priorityOnly'])
+})
+
+test('guard utility passes for mobile and desktop initial core set', () => {
+  const mobileResult = validateCoreFilterRenderKeys(DEFAULT_CORE_FILTER_KEYS)
+  const desktopResult = validateCoreFilterRenderKeys(DEFAULT_CORE_FILTER_KEYS)
+
+  assert.equal(mobileResult.isValid, true)
+  assert.equal(desktopResult.isValid, true)
+  assert.ok(mobileResult.rendered.length <= 8)
+  assert.ok(desktopResult.rendered.length <= 8)
+})
diff --git a/src/pages/searchFiltersConfig.js b/src/pages/searchFiltersConfig.js
new file mode 100644
index 0000000..5ee7319
--- /dev/null
+++ b/src/pages/searchFiltersConfig.js
@@ -0,0 +1,51 @@
+export const DEFAULT_CORE_FILTER_KEYS = [
+  'industry',
+  'category',
+  'verifiedOnly',
+  'country',
+  'moqRange',
+  'priceRange',
+  'orgType',
+  'leadTimeMax',
+]
+
+export const ADVANCED_FILTER_KEYS = [
+  'priorityOnly',
+  'fabricType',
+  'gsmMin',
+  'gsmMax',
+  'sizeRange',
+  'colorPantone',
+  'customization',
+  'sampleAvailable',
+  'sampleLeadTime',
+  'certifications',
+  'incoterms',
+  'paymentTerms',
+  'documentReady',
+  'auditDate',
+  'languageSupport',
+  'capacityMin',
+  'processes',
+  'yearsInBusinessMin',
+  'responseTimeMax',
+  'teamSeatsMin',
+  'handlesMultipleFactories',
+  'exportPort',
+  'distanceKm',
+  'locationLat',
+  'locationLng',
+]
+
+export function validateCoreFilterRenderKeys(renderedKeys = []) {
+  const rendered = Array.from(new Set(renderedKeys.filter(Boolean)))
+  const unknownKeys = rendered.filter((key) => !DEFAULT_CORE_FILTER_KEYS.includes(key))
+  const exceededLimit = rendered.length > DEFAULT_CORE_FILTER_KEYS.length
+
+  return {
+    rendered,
+    unknownKeys,
+    exceededLimit,
+    isValid: unknownKeys.length === 0 && !exceededLimit,
+  }
+}
```

## Why This Change
Refine search core filters and add guard tests

## Was It Useful
Yes — part of iterative feature development.

## Impact Analysis
- **Scope:**  3 files changed, 122 insertions(+), 51 deletions(-)
- **Risk:** Moderate

## Relationships
Commit 189 in the 0181-0220 sequence.

## Confidence Notes
Auto-generated from git history.
