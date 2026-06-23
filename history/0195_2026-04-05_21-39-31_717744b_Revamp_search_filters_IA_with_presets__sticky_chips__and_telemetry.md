## Commit Metadata
- **Hash:** 717744bc07eaa1b674b5283bcfe8fabcac30d34d
- **Parent:** f11736c4e99fe1470b2287fb0c328a9f93784f1b
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 21:39:31
- **Message:** Revamp search filters IA with presets, sticky chips, and telemetry

## Custom Title
Revamp search filters IA with presets, sticky chips, and telemetry

## High-Level Summary
Revamp search filters IA with presets, sticky chips, and telemetry

 2 files changed, 311 insertions(+), 96 deletions(-)

## File-by-File Breakdown
commit 717744bc07eaa1b674b5283bcfe8fabcac30d34d
Author: Cyber Code Master <148459541+gamertoky1188gro@users.noreply.github.com>
Date:   Sun Apr 5 21:39:31 2026 +0600

    Revamp search filters IA with presets, sticky chips, and telemetry

 docs/pages/SearchResults.md |  41 ++++-
 src/pages/SearchResults.jsx | 366 ++++++++++++++++++++++++++++++++------------
 2 files changed, 311 insertions(+), 96 deletions(-)

## Detailed Diff Analysis
```diff
diff --git a/docs/pages/SearchResults.md b/docs/pages/SearchResults.md
index e3f77e1..ba3c27d 100644
--- a/docs/pages/SearchResults.md
+++ b/docs/pages/SearchResults.md
@@ -3,6 +3,46 @@
 
 **Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent
 
+## IA + Control Map (2026-04 UX pass)
+
+### Top-level filter sections
+
+1. **Product**
+   - **Core (always visible):** Industry, MOQ range, Price per unit.
+   - **More filters:** Country and Verified only.
+   - **Advanced nested block:** Product attributes (fabric type, GSM, size range, color/pantone, customization, sample readiness, certifications, incoterms).
+2. **Supplier / Account**
+   - **Core (always visible):** Account type.
+   - **More filters:** Lead-time cap.
+   - **Advanced nested block:** Supplier/account attributes (payment terms, document readiness, audit, language support, capacity, processes, team/response buckets, export ports, geo distance, multi-factory handling).
+
+### Progressive disclosure model
+
+- Level 1: section core controls.
+- Level 2: section “More filters”.
+- Level 3: nested “Advanced block” within Product or Supplier/Account mode.
+
+### Presets and persistence
+
+- Presets: `buyer`, `buying_house`, `factory`.
+- Selected preset is persisted in local storage (`gt_search_selected_preset`).
+- Preset-specific filter payloads are saved locally (`gt_search_preset_<preset>`), and can also be saved server-side using search alerts.
+
+### Sticky active-filter rail
+
+- Active filter chips and a global **Clear all** action remain visible in a sticky area under category chips.
+
+### Telemetry
+
+- `search_filter_depth_opened`: records disclosure depth (1-3) and preset.
+- `search_filter_abandonment`: tracks abandonment when filters were changed but no search run occurred.
+- `search_preset_conversion`: tracks search conversion by selected preset.
+
+### UX cleanup decisions
+
+- Rare/secondary controls were moved behind section “More filters” and nested advanced blocks.
+- First interaction path now prioritizes high-signal, low-friction controls.
+
 ## 1) Purpose
 
 - **Why it exists:** See the route header comment in `src/pages/SearchResults.jsx`.
@@ -3927,4 +3967,3 @@
   - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
 - **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
 {% endraw %}
-
diff --git a/src/pages/SearchResults.jsx b/src/pages/SearchResults.jsx
index ba8617e..7657960 100644
--- a/src/pages/SearchResults.jsx
+++ b/src/pages/SearchResults.jsx
@@ -86,6 +86,50 @@ const TEAM_SEATS_MIN_BUCKETS = [
   { value: '25', label: '25+' },
 ]
 const SAMPLE_LEAD_TIME_MAX_DAYS = 45
+const PRESET_STORAGE_KEY = 'gt_search_selected_preset'
+const PRESET_KEYS = ['buyer', 'buying_house', 'factory']
+
+function normalizePresetKey(value) {
+  const normalized = String(value || '').toLowerCase()
+  return PRESET_KEYS.includes(normalized) ? normalized : ''
+}
+
+function createDefaultFilters(searchParams) {
+  return {
+    industry: searchParams.get('industry') || '',
+    moqRange: searchParams.get('moqRange') || '',
+    priceRange: searchParams.get('priceRange') || '',
+    country: searchParams.get('country') || '',
+    verifiedOnly: searchParams.get('verifiedOnly') === 'true',
+    orgType: searchParams.get('orgType') || '',
+    priorityOnly: searchParams.get('priorityOnly') === 'true',
+    leadTimeMax: searchParams.get('leadTimeMax') || '',
+    fabricType: parseCsvParam(searchParams.get('fabricType')),
+    gsmMin: searchParams.get('gsmMin') || '',
+    gsmMax: searchParams.get('gsmMax') || '',
+    sizeRange: searchParams.get('sizeRange') || '',
+    colorPantone: parseCsvParam(searchParams.get('colorPantone')),
+    customization: parseCsvParam(searchParams.get('customization')),
+    sampleAvailable: searchParams.get('sampleAvailable') === 'true',
+    sampleLeadTime: searchParams.get('sampleLeadTime') || '',
+    certifications: parseCsvParam(searchParams.get('certifications')),
+    incoterms: parseCsvParam(searchParams.get('incoterms')),
+    paymentTerms: parseCsvParam(searchParams.get('paymentTerms')),
+    documentReady: parseCsvParam(searchParams.get('documentReady')),
+    auditDate: searchParams.get('auditDate') || '',
+    languageSupport: parseCsvParam(searchParams.get('languageSupport')),
+    capacityMin: searchParams.get('capacityMin') || '',
+    processes: parseCsvParam(searchParams.get('processes')),
+    yearsInBusinessMin: searchParams.get('yearsInBusinessMin') || '',
+    responseTimeMax: searchParams.get('responseTimeMax') || '',
+    teamSeatsMin: searchParams.get('teamSeatsMin') || '',
+    handlesMultipleFactories: searchParams.get('handlesMultipleFactories') === 'true',
+    exportPort: parseCsvParam(searchParams.get('exportPort')),
+    distanceKm: searchParams.get('distanceKm') || '',
+    locationLat: searchParams.get('locationLat') || '',
+    locationLng: searchParams.get('locationLng') || '',
+  }
+}
 
 function parseCsvParam(value) {
   return String(value || '')
@@ -212,11 +256,6 @@ function buildQueryString({ q, category, filters, includeAdvanced, includePriori
   return params.toString()
 }
 
-function formatMoqRangeLabel(value) {
-  if (!value) return 'Any'
-  return value
-}
-
 function ResultSkeletonCard({ index }) {
   return (
     <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800" aria-hidden="true">
@@ -362,7 +401,12 @@ export default function SearchResults() {
   const [category, setCategory] = useState(() => parseCsvParam(searchParams.get('category')))
   const [filtersOpen, setFiltersOpen] = useState(false)
   const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
+  const [productMoreOpen, setProductMoreOpen] = useState(false)
+  const [supplierMoreOpen, setSupplierMoreOpen] = useState(false)
+  const [productAdvancedOpen, setProductAdvancedOpen] = useState(false)
+  const [supplierAdvancedOpen, setSupplierAdvancedOpen] = useState(false)
   const [filterMode, setFilterMode] = useState('product')
+  const [activePreset, setActivePreset] = useState(() => normalizePresetKey(localStorage.getItem(PRESET_STORAGE_KEY)))
   const renderedDefaultCoreFilterKeys = useMemo(() => [...DEFAULT_CORE_FILTER_KEYS], [])
   const [upgradePrompt, setUpgradePrompt] = useState('')
   const [alertFeedback, setAlertFeedback] = useState('')
@@ -384,41 +428,7 @@ export default function SearchResults() {
     return raw === true || String(raw).toLowerCase() === 'true'
   })
 
-  const [filters, setFilters] = useState(() => ({
-    industry: searchParams.get('industry') || '',
-    moqRange: searchParams.get('moqRange') || '',
-    priceRange: searchParams.get('priceRange') || '',
-    country: searchParams.get('country') || '',
-    verifiedOnly: searchParams.get('verifiedOnly') === 'true',
-    orgType: searchParams.get('orgType') || '',
-    priorityOnly: searchParams.get('priorityOnly') === 'true',
-    // Expanded filters (project.md)
-    leadTimeMax: searchParams.get('leadTimeMax') || '',
-    fabricType: parseCsvParam(searchParams.get('fabricType')),
-    gsmMin: searchParams.get('gsmMin') || '',
-    gsmMax: searchParams.get('gsmMax') || '',
-    sizeRange: searchParams.get('sizeRange') || '',
-    colorPantone: parseCsvParam(searchParams.get('colorPantone')),
-    customization: parseCsvParam(searchParams.get('customization')),
-    sampleAvailable: searchParams.get('sampleAvailable') === 'true',
-    sampleLeadTime: searchParams.get('sampleLeadTime') || '',
-    certifications: parseCsvParam(searchParams.get('certifications')),
-    incoterms: parseCsvParam(searchParams.get('incoterms')),
-    paymentTerms: parseCsvParam(searchParams.get('paymentTerms')),
-    documentReady: parseCsvParam(searchParams.get('documentReady')),
-    auditDate: searchParams.get('auditDate') || '',
-    languageSupport: parseCsvParam(searchParams.get('languageSupport')),
-    capacityMin: searchParams.get('capacityMin') || '',
-    processes: parseCsvParam(searchParams.get('processes')),
-    yearsInBusinessMin: searchParams.get('yearsInBusinessMin') || '',
-    responseTimeMax: searchParams.get('responseTimeMax') || '',
-    teamSeatsMin: searchParams.get('teamSeatsMin') || '',
-    handlesMultipleFactories: searchParams.get('handlesMultipleFactories') === 'true',
-    exportPort: parseCsvParam(searchParams.get('exportPort')),
-    distanceKm: searchParams.get('distanceKm') || '',
-    locationLat: searchParams.get('locationLat') || '',
-    locationLng: searchParams.get('locationLng') || '',
-  }))
+  const [filters, setFilters] = useState(() => createDefaultFilters(searchParams))
   const hasAdvancedFiltersFromUrl = useMemo(() => (
     ADVANCED_FILTER_KEYS.some((key) => key !== 'priorityOnly' && hasFilterValue(searchParams.get(key)))
   ), [searchParams])
@@ -468,6 +478,19 @@ export default function SearchResults() {
     return canPriorityAccessRequests && canPriorityAccessCompanies
   }, [activeTab, canPriorityAccessRequests, canPriorityAccessCompanies])
 
+  useEffect(() => {
+    const storedPreset = normalizePresetKey(localStorage.getItem(PRESET_STORAGE_KEY))
+    if (storedPreset) {
+      setActivePreset(storedPreset)
+      return
+    }
+    const rolePreset = normalizePresetKey(String(sessionUser?.role || '').toLowerCase())
+    if (rolePreset) {
+      localStorage.setItem(PRESET_STORAGE_KEY, rolePreset)
+      setActivePreset(rolePreset)
+    }
+  }, [sessionUser?.role])
+
   const categoryOptions = useMemo(() => {
     const industry = String(filters.industry || '').toLowerCase()
     if (industry === 'textile') return TEXTILE_CATEGORIES
@@ -514,6 +537,8 @@ export default function SearchResults() {
   const autoSearchRef = useRef(false)
   const filterTrackRef = useRef({ key: '', initialized: false })
   const autoSaveKeyRef = useRef('')
+  const lastSearchMetadataRef = useRef({ searched: false, preset: '' })
+  const dirtyFilterSinceSearchRef = useRef(false)
 
   const autoSaveAlert = useCallback(async (candidate) => {
     if (!autoSaveAlertsEnabled) return
@@ -583,6 +608,8 @@ export default function SearchResults() {
       const prodItems = Array.isArray(prodRes?.items) ? prodRes.items : []
       const reqTotal = Number.isFinite(Number(reqRes?.total)) ? Number(reqRes.total) : reqItems.length
       const prodTotal = Number.isFinite(Number(prodRes?.total)) ? Number(prodRes.total) : prodItems.length
+      lastSearchMetadataRef.current = { searched: true, preset: activePreset || '' }
+      dirtyFilterSinceSearchRef.current = false
 
       setRequests(reqItems)
       setCompanies(prodItems)
@@ -622,6 +649,15 @@ export default function SearchResults() {
           industry: filters.industry || '',
           tab: activeTab,
           advanced: hasAdvancedAccess,
+          preset: activePreset || 'none',
+          total_results: reqTotal + prodTotal,
+        },
+      })
+      trackClientEvent('search_preset_conversion', {
+        entityType: 'search',
+        entityId: activeTab,
+        metadata: {
+          preset: activePreset || 'none',
           total_results: reqTotal + prodTotal,
         },
       })
@@ -648,7 +684,7 @@ export default function SearchResults() {
     } finally {
       setLoading(false)
     }
-  }, [activeTab, autoSaveAlert, category, filters, hasAdvancedAccess, query, setSearchParams, token])
+  }, [activePreset, activeTab, autoSaveAlert, category, filters, hasAdvancedAccess, query, setSearchParams, token])
 
   useEffect(() => {
     const handler = (e) => {
@@ -679,6 +715,19 @@ export default function SearchResults() {
     }
   }, [category, filters, query, runSearch])
 
+  useEffect(() => {
+    if (!activePreset) return
+    if (autoSearchRef.current) return
+    const hasUrlQuery = Boolean(
+      (query && query.trim()) ||
+      category.length > 0 ||
+      Object.values(filters || {}).some((v) => hasFilterValue(v)),
+    )
+    if (hasUrlQuery) return
+    applyPreset(activePreset)
+  // eslint-disable-next-line react-hooks/exhaustive-deps
+  }, [activePreset])
+
   useEffect(() => {
     if (!filters.priorityOnly) return
     if (priorityAllowedForTab) return
@@ -742,6 +791,12 @@ export default function SearchResults() {
         const reqTotal = Number.isFinite(Number(reqRes?.total)) ? Number(reqRes.total) : 0
         const prodTotal = Number.isFinite(Number(prodRes?.total)) ? Number(prodRes.total) : 0
         setEstimateTotals({ requests: reqTotal, companies: prodTotal })
+        const reqFacets = reqRes?.facets || {}
+        const prodFacets = prodRes?.facets || {}
+        const mergedFacets = activeTab === 'requests'
+          ? reqFacets
+          : (activeTab === 'companies' ? prodFacets : mergeFacetCounts(reqFacets, prodFacets))
+        if (Object.keys(mergedFacets || {}).length) setFacets(mergedFacets)
 
         const mergedCapabilities = reqRes?.capabilities || prodRes?.capabilities
         if (mergedCapabilities) setCapabilities(mergedCapabilities)
@@ -750,8 +805,9 @@ export default function SearchResults() {
         setEstimateTotals({ requests: null, companies: null })
         setEstimateError(err.message || 'Unable to estimate results.')
       } finally {
-        if (estimateSeqRef.current !== seq) return
-        setEstimateLoading(false)
+        if (estimateSeqRef.current === seq) {
+          setEstimateLoading(false)
+        }
       }
     }, 450)
 
@@ -789,6 +845,37 @@ export default function SearchResults() {
     return () => window.clearTimeout(timer)
   }, [activeTab, category, filters, hasAdvancedAccess, query])
 
+  useEffect(() => {
+    const depth = supplierAdvancedOpen || productAdvancedOpen
+      ? 3
+      : (productMoreOpen || supplierMoreOpen || advancedFiltersOpen ? 2 : (filtersOpen ? 1 : 0))
+    trackClientEvent('search_filter_depth_opened', {
+      entityType: 'search',
+      entityId: activeTab,
+      metadata: {
+        depth,
+        preset: activePreset || 'none',
+      },
+    })
+  }, [activePreset, activeTab, advancedFiltersOpen, filtersOpen, productAdvancedOpen, productMoreOpen, supplierAdvancedOpen, supplierMoreOpen])
+
+  useEffect(() => {
+    const hasChanges = Boolean(query.trim() || category.length > 0 || Object.values(filters || {}).some((v) => hasFilterValue(v)))
+    if (hasChanges) dirtyFilterSinceSearchRef.current = true
+  }, [category, filters, query])
+
+  useEffect(() => () => {
+    if (dirtyFilterSinceSearchRef.current && !lastSearchMetadataRef.current.searched) {
+      trackClientEvent('search_filter_abandonment', {
+        entityType: 'search',
+        entityId: activeTab,
+        metadata: {
+          preset: activePreset || 'none',
+        },
+      })
+    }
+  }, [activePreset, activeTab])
+
   useEffect(() => {
     if (!geoQuery) {
       setGeoResults([])
@@ -945,6 +1032,15 @@ export default function SearchResults() {
     setFilters((prev) => ({ ...prev, priorityOnly: value }))
   }
 
+  function clearAllFilters() {
+    setQuery('')
+    setCategory([])
+    setFilters(createDefaultFilters(new URLSearchParams()))
+    setGeoQuery('')
+    setGeoResults([])
+    setLocationLabel('')
+  }
+
   async function saveAlert(presetLabel = '') {
     setAlertFeedback('')
     const q = query.trim()
@@ -969,19 +1065,29 @@ export default function SearchResults() {
     try {
       const payload = { query, category, filters }
       localStorage.setItem(`gt_search_preset_${presetKey}`, JSON.stringify(payload))
+      localStorage.setItem(PRESET_STORAGE_KEY, presetKey)
+      setActivePreset(presetKey)
     } catch {
       // ignore storage failures
     }
   }
 
+  function presetFallback(presetKey) {
+    if (presetKey === 'buyer') {
+      return { query: '', category: [], filters: { industry: 'garments', orgType: 'factory', verifiedOnly: true } }
+    }
+    if (presetKey === 'buying_house') {
+      return { query: '', category: [], filters: { orgType: 'factory', verifiedOnly: true, handlesMultipleFactories: true } }
+    }
+    return { query: '', category: [], filters: { orgType: 'buying_house', verifiedOnly: true } }
+  }
+
   function applyPreset(presetKey) {
+    const normalizedPresetKey = normalizePresetKey(presetKey)
+    if (!normalizedPresetKey) return
     try {
-      const raw = localStorage.getItem(`gt_search_preset_${presetKey}`)
-      if (!raw) {
-        setAlertFeedback('No saved preset found yet.')
-        return
-      }
-      const preset = JSON.parse(raw)
+      const raw = localStorage.getItem(`gt_search_preset_${normalizedPresetKey}`)
+      const preset = raw ? JSON.parse(raw) : presetFallback(normalizedPresetKey)
       setQuery(preset?.query || '')
       const presetCategory = Array.isArray(preset?.category)
         ? preset.category
@@ -1003,7 +1109,9 @@ export default function SearchResults() {
           exportPort: Array.isArray(preset.filters.exportPort) ? preset.filters.exportPort : parseCsvParam(preset.filters.exportPort),
         }))
       }
-      setAlertFeedback(`Loaded ${presetKey.replace('_', ' ')} preset.`)
+      localStorage.setItem(PRESET_STORAGE_KEY, normalizedPresetKey)
+      setActivePreset(normalizedPresetKey)
+      setAlertFeedback(`Loaded ${normalizedPresetKey.replace('_', ' ')} preset.`)
     } catch {
       setAlertFeedback('Unable to load preset.')
     }
@@ -1026,6 +1134,18 @@ export default function SearchResults() {
     navigate('/chat', { state: { notice: `Contacting ${name}. If you are unverified, your first message may appear as a request.` } })
   }
 
+  const activeFilterChips = useMemo(() => {
+    const chips = []
+    if (query.trim()) chips.push({ key: 'query', label: `Query: ${query.trim()}`, onRemove: () => setQuery('') })
+    if (category.length) chips.push({ key: 'category', label: `Category: ${category.join(', ')}`, onRemove: clearCategories })
+    if (filters.industry) chips.push({ key: 'industry', label: `Industry: ${filters.industry}`, onRemove: () => updateCoreFilter('industry', '') })
+    if (filters.country) chips.push({ key: 'country', label: `Country: ${filters.country}`, onRemove: () => updateCoreFilter('country', '') })
+    if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', label: 'Verified only', onRemove: () => updateCoreFilter('verifiedOnly', false) })
+    if (filters.orgType) chips.push({ key: 'orgType', label: `Account: ${filters.orgType.replace('_', ' ')}`, onRemove: () => updateCoreFilter('orgType', '') })
+    if (filters.priorityOnly) chips.push({ key: 'priorityOnly', label: 'Priority only', onRemove: () => setFilters((prev) => ({ ...prev, priorityOnly: false })) })
+    return chips
+  }, [category, filters.country, filters.industry, filters.orgType, filters.priorityOnly, filters.verifiedOnly, query])
+
   return (
     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
       <div className="max-w-7xl mx-auto px-4 py-6">
@@ -1115,6 +1235,28 @@ export default function SearchResults() {
             ))}
           </div>
 
+          <div className="sticky top-2 z-20 mt-3 rounded-xl bg-white/90 p-2 ring-1 ring-slate-200/70 backdrop-blur dark:bg-slate-950/70 dark:ring-white/10">
+            <div className="flex flex-wrap items-center gap-2">
+              {activeFilterChips.length ? activeFilterChips.map((chip) => (
+                <button
+                  key={chip.key}
+                  type="button"
+                  onClick={chip.onRemove}
+                  className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100"
+                >
+                  {chip.label} ×
+                </button>
+              )) : <span className="text-[11px] text-slate-500 dark:text-slate-400">No active filters</span>}
+              <button
+                type="button"
+                onClick={clearAllFilters}
+                className="ml-auto rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 hover:bg-slate-50 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
+              >
+                Clear all
+              </button>
+            </div>
+          </div>
+
           {(estimateLoading || estimateError || estimateTotals.requests !== null || estimateTotals.companies !== null) ? (
             <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
               {estimateLoading ? 'Estimating results...' : estimateError ? (
@@ -1134,8 +1276,8 @@ export default function SearchResults() {
           {filtersOpen ? (
             <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
               <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
-                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Core filters</p>
-                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Always free</p>
+                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Product</p>
+                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core filters are visible first</p>
                 <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
                   <select
                     value={filters.industry}
@@ -1174,12 +1316,58 @@ export default function SearchResults() {
                       />
                     </div>
                   </div>
-                  <input
-                    value={filters.country}
-                    onChange={(e) => updateCoreFilter('country', e.target.value)}
-                    placeholder="Country (e.g. Bangladesh)"
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
+                  <button
+                    type="button"
+                    onClick={() => setProductMoreOpen((prev) => !prev)}
+                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
+                  >
+                    {productMoreOpen ? 'Hide more filters' : 'More filters'}
+                  </button>
+                  {productMoreOpen ? (
+                    <>
+                      <input
+                        value={filters.country}
+                        onChange={(e) => updateCoreFilter('country', e.target.value)}
+                        placeholder="Country (e.g. Bangladesh)"
+                        className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                      />
+                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
+                        <input
+                          type="checkbox"
+                          checked={filters.verifiedOnly}
+                          onChange={(e) => updateCoreFilter('verifiedOnly', e.target.checked)}
+                          className="h-4 w-4"
+                        />
+                        Verified only
+                      </label>
+                    </>
+                  ) : null}
+                </div>
+              </div>
+
+              <div className={`rounded-2xl p-4 ring-1 shadow-sm${premiumLocked ? ' bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : ' bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`} data-has-advanced-url-filters={hasAdvancedFiltersFromUrl ? 'true' : 'false'}>
+                <div className="flex items-center justify-between gap-2">
+                  <div>
+                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Supplier / Account</p>
+                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core visible first, attributes under More filters</p>
+                  </div>
+                  <button
+                    type="button"
+                    onClick={() => setSupplierMoreOpen((prev) => !prev)}
+                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
+                  >
+                    {supplierMoreOpen ? 'Hide more filters' : 'More filters'}
+                  </button>
+                  <button
+                    type="button"
+                    onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
+                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
+                  >
+                    {advancedFiltersOpen ? 'Hide advanced' : 'Advanced'}
+                  </button>
+                </div>
+
+                <div className="mt-3 grid grid-cols-1 gap-2">
                   <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                     <p className="text-[11px] font-semibold text-slate-500">Account type</p>
                     <div className="mt-2 flex flex-wrap gap-2">
@@ -1199,43 +1387,20 @@ export default function SearchResults() {
                       })}
                     </div>
                   </div>
-                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
-                    <input
-                      type="checkbox"
-                      checked={filters.verifiedOnly}
-                      onChange={(e) => updateCoreFilter('verifiedOnly', e.target.checked)}
-                      className="h-4 w-4"
-                    />
-                    Verified only
-                  </label>
-                  <select
-                    value={filters.leadTimeMax}
-                    onChange={(e) => updateCoreFilter('leadTimeMax', e.target.value)}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  >
-                    <option value="">Lead time (Any)</option>
-                    <option value="7">Lead time &lt;= 7 days</option>
-                    <option value="14">Lead time &lt;= 14 days</option>
-                    <option value="30">Lead time &lt;= 30 days</option>
-                    <option value="60">Lead time &lt;= 60 days</option>
-                    <option value="90">Lead time &lt;= 90 days</option>
-                  </select>
-                </div>
-              </div>
-
-              <div className={`rounded-2xl p-4 ring-1 shadow-sm${premiumLocked ? ' bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : ' bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`} data-has-advanced-url-filters={hasAdvancedFiltersFromUrl ? 'true' : 'false'}>
-                <div className="flex items-center justify-between gap-2">
-                  <div>
-                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Advanced filters</p>
-                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{premiumLocked ? 'Premium required to unlock' : 'Premium unlocked'}</p>
-                  </div>
-                  <button
-                    type="button"
-                    onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
-                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
-                  >
-                    {advancedFiltersOpen ? 'Hide filters' : 'More Filters'}
-                  </button>
+                  {supplierMoreOpen ? (
+                    <select
+                      value={filters.leadTimeMax}
+                      onChange={(e) => updateCoreFilter('leadTimeMax', e.target.value)}
+                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                    >
+                      <option value="">Lead time (Any)</option>
+                      <option value="7">Lead time &lt;= 7 days</option>
+                      <option value="14">Lead time &lt;= 14 days</option>
+                      <option value="30">Lead time &lt;= 30 days</option>
+                      <option value="60">Lead time &lt;= 60 days</option>
+                      <option value="90">Lead time &lt;= 90 days</option>
+                    </select>
+                  ) : null}
                 </div>
 
                 {advancedFiltersOpen ? (
@@ -1270,8 +1435,16 @@ export default function SearchResults() {
                         Supplier Filters
                       </button>
                     </div>
+                    <button
+                      type="button"
+                      onClick={() => (filterMode === 'product' ? setProductAdvancedOpen((prev) => !prev) : setSupplierAdvancedOpen((prev) => !prev))}
+                      className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
+                    >
+                      {(filterMode === 'product' ? productAdvancedOpen : supplierAdvancedOpen) ? 'Hide advanced block' : 'Open advanced block'}
+                    </button>
 
                     {filterMode === 'product' ? (
+                      productAdvancedOpen ? (
                       <>
                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                           <p className="text-[11px] font-semibold text-slate-500">Fabric type</p>
@@ -1435,7 +1608,9 @@ export default function SearchResults() {
                           </div>
                         </div>
                       </>
+                      ) : <p className="text-[11px] text-slate-500">Open advanced block to configure product attributes.</p>
                     ) : (
+                      supplierAdvancedOpen ? (
                       <>
                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                           <p className="text-[11px] font-semibold text-slate-500">Payment terms</p>
@@ -1640,6 +1815,7 @@ export default function SearchResults() {
                           ) : null}
                         </div>
                       </>
+                      ) : <p className="text-[11px] text-slate-500">Open advanced block to configure supplier/account attributes.</p>
                     )}
                   </div>
                 ) : (
```

## Why This Change
Revamp search filters IA with presets, sticky chips, and telemetry

## Was It Useful
Yes — part of iterative feature development.

## Impact Analysis
- **Scope:**  2 files changed, 311 insertions(+), 96 deletions(-)
- **Risk:** Moderate

## Relationships
Commit 195 in the 0181-0220 sequence.

## Confidence Notes
Auto-generated from git history.
