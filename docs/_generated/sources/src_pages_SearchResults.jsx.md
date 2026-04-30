    1 | ﻿/*
    2 |   Route: /search
    3 |   Access: Protected (login required)
    4 |   Allowed roles: buyer, buying_house, factory, owner, admin, agent
    5 | 
    6 |   Public Pages:
    7 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    8 |   Protected Pages (login required):
    9 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
   10 |     /notifications, /chat, /call, /verification, /verification-center
   11 | 
   12 |   Primary responsibilities:
   13 |     - Run marketplace search across Buyer Requests and Companies/Products.
   14 |     - Provide basic filters for free tier and advanced filters for premium tier.
   15 |     - Support quick view modals and recent views rail.
   16 | 
   17 |   Key API endpoints:
   18 |     - GET /api/requirements/search?... (buyer requests)
   19 |     - GET /api/products/search?... (companies/products)
   20 |     - GET /api/ratings/search?profile_keys=...
   21 |     - GET /api/products/views/me?cursor=...
   22 |     - POST /api/search/alerts (save alerts)
   23 | 
   24 |   Major UI/UX patterns:
   25 |     - Glass + glow search bar with shortcut hint (Ctrl/Cmd + K).
   26 |     - layoutId animated tabs for "All / Buyer Requests / Companies".
   27 |     - Skeleton shimmer while loading.
   28 |     - Optional premium-locked overlays for advanced filters.
   29 | */
   30 | import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
   31 | import { Link, useNavigate, useSearchParams } from 'react-router-dom'
   32 | import { Briefcase, Building2, Filter, LayoutGrid, Bell, Share2, Search as SearchIcon } from 'lucide-react'
   33 | import { motion, useReducedMotion } from 'framer-motion'
   34 | import { apiRequest, getCurrentUser, getToken, hasEntitlement } from '../lib/auth'
   35 | import ProductQuickViewModal from '../components/products/ProductQuickViewModal'
   36 | import { trackClientEvent } from '../lib/events'
   37 | import { recordLeadSource } from '../lib/leadSource'
   38 | import L from 'leaflet'
   39 | import { ADVANCED_FILTER_KEYS, DEFAULT_CORE_FILTER_KEYS, validateCoreFilterRenderKeys } from './searchFiltersConfig'
   40 | 
   41 | const Motion = motion
   42 | 
   43 | const TAB_OPTIONS = [
   44 |   { id: 'all', label: 'All', icon: LayoutGrid },
   45 |   { id: 'requests', label: 'Buyer Requests', icon: Briefcase },
   46 |   { id: 'companies', label: 'Companies', icon: Building2 },
   47 | ]
   48 | 
   49 | const INDUSTRY_OPTIONS = [
   50 |   { value: 'garments', label: 'Garments' },
   51 |   { value: 'textile', label: 'Textile' },
   52 | ]
   53 | 
   54 | const GARMENT_CATEGORIES = ['Shirts', 'Pants', 'Jackets', 'Knitwear', 'Denim', 'Women', 'Kids']
   55 | const TEXTILE_CATEGORIES = ['Woven', 'Knit', 'Denim', 'Non-woven', 'Yarn', 'Trim', 'Accessories']
   56 | const FABRIC_TYPE_OPTIONS = ['Cotton', 'Polyester', 'Blend', 'Denim', 'Linen', 'Wool']
   57 | const CERTIFICATION_OPTIONS = ['GOTS', 'OEKO-TEX', 'BSCI', 'WRAP', 'Sedex']
   58 | const PROCESS_OPTIONS = ['Knit', 'Woven', 'Dyeing', 'Finishing', 'Embroidery', 'Printing']
   59 | const LANGUAGE_OPTIONS = ['English', 'Bangla', 'Chinese', 'Spanish']
   60 | const INCOTERM_OPTIONS = ['FOB', 'CIF', 'EXW', 'DDP']
   61 | const PAYMENT_OPTIONS = ['LC', 'TT', 'Escrow', 'Bank Guarantee']
   62 | const DOCUMENT_READY_OPTIONS = ['Export Docs', 'Lab Reports', 'Techpacks']
   63 | const CUSTOMIZATION_OPTIONS = ['Techpack Accepted', 'Pattern Making', 'Embroidery']
   64 | const SIZE_RANGE_OPTIONS = ['XS-XL', 'S-XXL', 'Custom']
   65 | const EXPORT_PORT_OPTIONS = ['Chittagong', 'Dhaka', 'Shanghai', 'Shenzhen', 'Singapore']
   66 | const YEARS_IN_BUSINESS_MIN_BUCKETS = [
   67 |   { value: '', label: 'Any' },
   68 |   { value: '1', label: '1+ yr' },
   69 |   { value: '3', label: '3+ yr' },
   70 |   { value: '5', label: '5+ yr' },
   71 |   { value: '10', label: '10+ yr' },
   72 | ]
   73 | const RESPONSE_TIME_MAX_BUCKETS = [
   74 |   { value: '', label: 'Any' },
   75 |   { value: '1', label: '≤ 1h' },
   76 |   { value: '4', label: '≤ 4h' },
   77 |   { value: '12', label: '≤ 12h' },
   78 |   { value: '24', label: '≤ 24h' },
   79 |   { value: '48', label: '≤ 48h' },
   80 | ]
   81 | const TEAM_SEATS_MIN_BUCKETS = [
   82 |   { value: '', label: 'Any' },
   83 |   { value: '2', label: '2+' },
   84 |   { value: '5', label: '5+' },
   85 |   { value: '10', label: '10+' },
   86 |   { value: '25', label: '25+' },
   87 | ]
   88 | const SAMPLE_LEAD_TIME_MAX_DAYS = 45
   89 | const MOQ_BUCKETS = [
   90 |   { value: '', label: 'Any' },
   91 |   { value: '1-100', label: '1–100' },
   92 |   { value: '101-1000', label: '101–1,000' },
   93 |   { value: '1001-', label: '1001+' },
   94 | ]
   95 | const CURRENCY_OPTIONS = ['USD', 'EUR', 'CNY', 'BDT', 'GBP']
   96 | const PRESET_STORAGE_KEY = 'gt_search_selected_preset'
   97 | const PRESET_KEYS = ['buyer', 'buying_house', 'factory']
   98 | 
   99 | function normalizePresetKey(value) {
  100 |   const normalized = String(value || '').toLowerCase()
  101 |   return PRESET_KEYS.includes(normalized) ? normalized : ''
  102 | }
  103 | 
  104 | function createDefaultFilters(searchParams) {
  105 |   return {
  106 |     industry: searchParams.get('industry') || '',
  107 |     moqRange: searchParams.get('moqRange') || '',
  108 |     priceRange: searchParams.get('priceRange') || '',
  109 |     priceCurrency: searchParams.get('priceCurrency') || '',
  110 |     country: searchParams.get('country') || '',
  111 |     verifiedOnly: searchParams.get('verifiedOnly') === 'true',
  112 |     orgType: searchParams.get('orgType') || '',
  113 |     priorityOnly: searchParams.get('priorityOnly') === 'true',
  114 |     leadTimeMax: searchParams.get('leadTimeMax') || '',
  115 |     fabricType: parseCsvParam(searchParams.get('fabricType')),
  116 |     gsmMin: searchParams.get('gsmMin') || '',
  117 |     gsmMax: searchParams.get('gsmMax') || '',
  118 |     sizeRange: searchParams.get('sizeRange') || '',
  119 |     sizeRangeCustom: searchParams.get('sizeRangeCustom') || '',
  120 |     colorPantone: parseCsvParam(searchParams.get('colorPantone')),
  121 |     customization: parseCsvParam(searchParams.get('customization')),
  122 |     sampleAvailable: searchParams.get('sampleAvailable') === 'true',
  123 |     sampleLeadTime: searchParams.get('sampleLeadTime') || '',
  124 |     certifications: parseCsvParam(searchParams.get('certifications')),
  125 |     incoterms: parseCsvParam(searchParams.get('incoterms')),
  126 |     paymentTerms: parseCsvParam(searchParams.get('paymentTerms')),
  127 |     documentReady: parseCsvParam(searchParams.get('documentReady')),
  128 |     auditDate: searchParams.get('auditDate') || '',
  129 |       auditScoreMin: searchParams.get('auditScoreMin') || '',
  130 |       hasPermissionMatrix: searchParams.get('hasPermissionMatrix') === 'true',
  131 |       permissionSection: searchParams.get('permissionSection') || '',
  132 |         permissionSectionEdit: searchParams.get('permissionSectionEdit') === 'true',
  133 |         roleSeats: parseRoleSeatsParam(searchParams.get('roleSeats')),
  134 |     languageSupport: parseCsvParam(searchParams.get('languageSupport')),
  135 |     capacityMin: searchParams.get('capacityMin') || '',
  136 |     processes: parseCsvParam(searchParams.get('processes')),
  137 |     yearsInBusinessMin: searchParams.get('yearsInBusinessMin') || '',
  138 |     responseTimeMax: searchParams.get('responseTimeMax') || '',
  139 |     teamSeatsMin: searchParams.get('teamSeatsMin') || '',
  140 |     handlesMultipleFactories: searchParams.get('handlesMultipleFactories') === 'true',
  141 |     exportPort: parseCsvParam(searchParams.get('exportPort')),
  142 |     distanceKm: searchParams.get('distanceKm') || '',
  143 |     locationLat: searchParams.get('locationLat') || '',
  144 |     locationLng: searchParams.get('locationLng') || '',
  145 |   }
  146 | }
  147 | 
  148 | function parseCsvParam(value) {
  149 |   return String(value || '')
  150 |     .split(',')
  151 |     .map((entry) => entry.trim())
  152 |     .filter(Boolean)
  153 | }
  154 | 
  155 | function parseRoleSeatsParam(value) {
  156 |   const raw = String(value || '').trim()
  157 |   if (!raw) return []
  158 |   return raw
  159 |     .split(',')
  160 |     .map((part) => {
  161 |       const [roleRaw, seatsRaw] = String(part || '').split(':').map((s) => (s || '').trim())
  162 |       if (!roleRaw) return null
  163 |       return { role: roleRaw, seats: seatsRaw || '' }
  164 |     })
  165 |     .filter(Boolean)
  166 | }
  167 | 
  168 | function serializeRoleSeats(entries) {
  169 |   if (!Array.isArray(entries) || !entries.length) return ''
  170 |   return entries
  171 |     .filter((e) => e && e.role)
  172 |     .map((e) => `${e.role}:${String(e.seats || '')}`)
  173 |     .join(',')
  174 | }
  175 | 
  176 | function toCsv(value) {
  177 |   if (!value) return ''
  178 |   if (Array.isArray(value)) return value.filter(Boolean).join(',')
  179 |   return String(value || '')
  180 | }
  181 | 
  182 | function hasFilterValue(value) {
  183 |   if (Array.isArray(value)) return value.length > 0
  184 |   if (typeof value === 'boolean') return value
  185 |   return String(value || '').trim().length > 0
  186 | }
  187 | 
  188 | function parseRangeValue(value) {
  189 |   const raw = String(value || '').trim()
  190 |   if (!raw || !raw.includes('-')) return { min: '', max: '' }
  191 |   const [min, max] = raw.split('-').map((part) => part.trim())
  192 |   return { min, max }
  193 | }
  194 | 
  195 | function rangeToString(min, max) {
  196 |   const minVal = String(min || '').trim()
  197 |   const maxVal = String(max || '').trim()
  198 |   if (!minVal && !maxVal) return ''
  199 |   if (!maxVal) return `${minVal}-`
  200 |   if (!minVal) return `0-${maxVal}`
  201 |   return `${minVal}-${maxVal}`
  202 | }
  203 | 
  204 | function mergeFacetCounts(a = {}, b = {}) {
  205 |   const out = { ...(a || {}) }
  206 |   Object.entries(b || {}).forEach(([key, counts]) => {
  207 |     const bucket = out[key] || {}
  208 |     Object.entries(counts || {}).forEach(([label, count]) => {
  209 |       bucket[label] = (bucket[label] || 0) + Number(count || 0)
  210 |     })
  211 |     out[key] = bucket
  212 |   })
  213 |   return out
  214 | }
  215 | 
  216 | function getFacetCount(counts = {}, label = '') {
  217 |   if (!counts || !label) return undefined
  218 |   if (counts[label] !== undefined) return counts[label]
  219 |   const lower = label.toLowerCase()
  220 |   if (counts[lower] !== undefined) return counts[lower]
  221 |   const matchKey = Object.keys(counts).find((key) => String(key).toLowerCase() === lower)
  222 |   return matchKey ? counts[matchKey] : undefined
  223 | }
  224 | 
  225 | function hashString(value) {
  226 |   let hash = 0
  227 |   const text = String(value || '')
  228 |   for (let i = 0; i < text.length; i += 1) {
  229 |     hash = ((hash << 5) - hash) + text.charCodeAt(i)
  230 |     hash |= 0
  231 |   }
  232 |   return Math.abs(hash).toString(36)
  233 | }
  234 | 
  235 | function roleToProfileRoute(role, id) {
  236 |   // Convert a company role -> correct profile route.
  237 |   // Used when clicking a search result card to navigate to the right profile page.
  238 |   if (!id) return ''
  239 |   const normalized = String(role || '').toLowerCase()
  240 |   if (normalized === 'buyer') return `/buyer/${encodeURIComponent(id)}`
  241 |   if (normalized === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
  242 |   return `/factory/${encodeURIComponent(id)}`
  243 | }
  244 | 
  245 | 
  246 | function buildQueryString({ q, category, filters, includeAdvanced, includePriority = false }) {
  247 |   // Build URLSearchParams from UI state.
  248 |   // Core filters are always free; advanced filters require premium.
  249 |   const params = new URLSearchParams()
  250 |   if (q) params.set('q', q)
  251 |   if (Array.isArray(category) ? category.length : category) params.set('category', toCsv(category))
  252 |   if (filters.industry) params.set('industry', filters.industry)
  253 | 
  254 |   // Core filters (always included if set)
  255 |   if (filters.moqRange) params.set('moqRange', filters.moqRange)
  256 |   if (filters.priceRange) params.set('priceRange', filters.priceRange)
  257 |   if (filters.priceCurrency) params.set('priceCurrency', filters.priceCurrency)
  258 |   if (filters.country) params.set('country', filters.country)
  259 |   if (filters.verifiedOnly) params.set('verifiedOnly', 'true')
  260 |   if (filters.orgType) params.set('orgType', filters.orgType)
  261 |   if (filters.leadTimeMax) params.set('leadTimeMax', filters.leadTimeMax)
  262 |   if (includePriority && filters.priorityOnly) params.set('priorityOnly', 'true')
  263 | 
  264 |   // Advanced filters (premium only)
  265 |   if (includeAdvanced) {
  266 |     if (hasFilterValue(filters.fabricType)) params.set('fabricType', toCsv(filters.fabricType))
  267 |     if (filters.gsmMin) params.set('gsmMin', filters.gsmMin)
  268 |     if (filters.gsmMax) params.set('gsmMax', filters.gsmMax)
  269 |     if (filters.sizeRange) params.set('sizeRange', filters.sizeRange)
  270 |     if (filters.sizeRange === 'Custom' && filters.sizeRangeCustom) params.set('sizeRangeCustom', filters.sizeRangeCustom)
  271 |     if (hasFilterValue(filters.colorPantone)) params.set('colorPantone', toCsv(filters.colorPantone))
  272 |     if (hasFilterValue(filters.customization)) params.set('customization', toCsv(filters.customization))
  273 |     if (filters.sampleAvailable) params.set('sampleAvailable', 'true')
  274 |     if (filters.sampleLeadTime) params.set('sampleLeadTime', filters.sampleLeadTime)
  275 |     if (hasFilterValue(filters.certifications)) params.set('certifications', toCsv(filters.certifications))
  276 |     if (hasFilterValue(filters.incoterms)) params.set('incoterms', toCsv(filters.incoterms))
  277 |     if (hasFilterValue(filters.paymentTerms)) params.set('paymentTerms', toCsv(filters.paymentTerms))
  278 |     if (hasFilterValue(filters.documentReady)) params.set('documentReady', toCsv(filters.documentReady))
  279 |     if (filters.auditScoreMin) params.set('auditScoreMin', filters.auditScoreMin)
  280 |     if (filters.auditDate) params.set('auditDate', filters.auditDate)
  281 |     if (filters.hasPermissionMatrix) params.set('hasPermissionMatrix', 'true')
  282 |       if (filters.permissionSection) params.set('permissionSection', filters.permissionSection)
  283 |       if (filters.permissionSectionEdit) params.set('permissionSectionEdit', 'true')
  284 |     if (hasFilterValue(filters.languageSupport)) params.set('languageSupport', toCsv(filters.languageSupport))
  285 |     if (filters.capacityMin) params.set('capacityMin', filters.capacityMin)
  286 |     if (hasFilterValue(filters.processes)) params.set('processes', toCsv(filters.processes))
  287 |     if (filters.yearsInBusinessMin) params.set('yearsInBusinessMin', filters.yearsInBusinessMin)
  288 |     if (filters.responseTimeMax) params.set('responseTimeMax', filters.responseTimeMax)
  289 |     if (filters.teamSeatsMin) params.set('teamSeatsMin', filters.teamSeatsMin)
  290 |     if (filters.roleSeats && Array.isArray(filters.roleSeats) && filters.roleSeats.length) {
  291 |       const rs = serializeRoleSeats(filters.roleSeats)
  292 |       if (rs) params.set('roleSeats', rs)
  293 |     }
  294 |     if (filters.handlesMultipleFactories) params.set('handlesMultipleFactories', 'true')
  295 |     if (hasFilterValue(filters.exportPort)) params.set('exportPort', toCsv(filters.exportPort))
  296 |     if (filters.distanceKm) params.set('distanceKm', filters.distanceKm)
  297 |     if (filters.locationLat) params.set('locationLat', filters.locationLat)
  298 |     if (filters.locationLng) params.set('locationLng', filters.locationLng)
  299 |   }
  300 | 
  301 |   return params.toString()
  302 | }
  303 | 
  304 | function ResultSkeletonCard({ index }) {
  305 |   return (
  306 |     <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800" aria-hidden="true">
  307 |       <div className="flex items-start justify-between gap-3">
  308 |         <div className="min-w-0 flex-1">
  309 |           <div className="h-3 w-1/3 rounded-full skeleton" />
  310 |           <div className="mt-3 h-3 w-3/4 rounded-full skeleton" />
  311 |           <div className="mt-2 h-3 w-2/3 rounded-full skeleton" />
  312 |           <div className="mt-4 grid grid-cols-2 gap-2">
  313 |             <div className="h-3 rounded-full skeleton" />
  314 |             <div className="h-3 rounded-full skeleton" />
  315 |             <div className="h-3 rounded-full skeleton" />
  316 |             <div className="h-3 rounded-full skeleton" />
  317 |           </div>
  318 |         </div>
  319 |         <div className="flex flex-col gap-2">
  320 |           <div className="h-9 w-28 rounded-full skeleton" />
  321 |           <div className="h-9 w-28 rounded-full skeleton" />
  322 |         </div>
  323 |       </div>
  324 |       <span className="sr-only">Loading result {index + 1}</span>
  325 |     </div>
  326 |   )
  327 | }
  328 | 
  329 | function ChipGroup({ options = [], values = [], onChange, disabled, counts = {} }) {
  330 |   return (
  331 |     <div className="flex flex-wrap gap-2">
  332 |       {options.map((option) => {
  333 |         const selected = values.includes(option)
  334 |         const count = getFacetCount(counts, option)
  335 |         return (
  336 |           <button
  337 |             key={option}
  338 |             type="button"
  339 |             disabled={disabled}
  340 |             onClick={() => {
  341 |               if (disabled) return
  342 |               if (selected) onChange(values.filter((entry) => entry !== option))
  343 |               else onChange([...values, option])
  344 |             }}
  345 |             className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${
  346 |               selected
  347 |                 ? ' bg-[var(--gt-blue)] text-white ring-transparent dark:bg-[var(--gt-blue)] dark:text-white'
  348 |                 : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10'
  349 |             } ${disabled ? 'opacity-50' : ''}`}
  350 |           >
  351 |             {option}
  352 |             {Number.isFinite(Number(count)) ? (
  353 |               <span className={`ml-1 text-[10px] ${selected ? 'text-white/80' : 'text-slate-400'}`}>({count})</span>
  354 |             ) : null}
  355 |           </button>
  356 |         )
  357 |       })}
  358 |     </div>
  359 |   )
  360 | }
  361 | 
  362 | function BucketChips({ options = [], value = '', onChange, disabled }) {
  363 |   const selectedValue = String(value || '')
  364 |   return (
  365 |     <div className="flex flex-wrap gap-2">
  366 |       {options.map((option) => {
  367 |         const optValue = String(option?.value ?? '')
  368 |         const selected = selectedValue === optValue || (!selectedValue && !optValue)
  369 |         return (
  370 |           <button
  371 |             key={`${optValue || 'any'}-${option.label}`}
  372 |             type="button"
  373 |             disabled={disabled}
  374 |             onClick={() => {
  375 |               if (disabled) return
  376 |               const next = selected && optValue ? '' : optValue
  377 |               onChange(next)
  378 |             }}
  379 |             className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${
  380 |               selected
  381 |                 ? ' bg-[var(--gt-blue)] text-white ring-transparent dark:bg-[var(--gt-blue)] dark:text-white'
  382 |                 : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10'
  383 |             } ${disabled ? 'opacity-50' : ''}`}
  384 |           >
  385 |             {option.label}
  386 |           </button>
  387 |         )
  388 |       })}
  389 |     </div>
  390 |   )
  391 | }
  392 | 
  393 | function RangeSlider({ min = 0, max = 100, step = 1, valueMin = '', valueMax = '', onChange, suffix = '', disabled = false, formatValue }) {
  394 |   const minValue = valueMin === '' ? min : Number(valueMin)
  395 |   const maxValue = valueMax === '' ? max : Number(valueMax)
  396 |   const format = typeof formatValue === 'function'
  397 |     ? formatValue
  398 |     : (v) => `${v}${suffix}`
  399 |   return (
  400 |     <div className="space-y-2">
  401 |       <div className="flex items-center gap-2 text-[11px] text-slate-500">
  402 |         <span>{Number.isFinite(minValue) ? format(minValue) : format(min)}</span>
  403 |         <div className="h-px flex-1 bg-slate-200" />
  404 |         <span>{Number.isFinite(maxValue) ? format(maxValue) : format(max)}</span>
  405 |       </div>
  406 |       <div className="flex items-center gap-3">
  407 |         <input
  408 |           type="range"
  409 |           min={min}
  410 |           max={max}
  411 |           step={step}
  412 |           value={Number.isFinite(minValue) ? minValue : min}
  413 |           onChange={(event) => onChange(String(event.target.value || ''), valueMax)}
  414 |           disabled={disabled}
  415 |           className="w-full"
  416 |         />
  417 |         <input
  418 |           type="range"
  419 |           min={min}
  420 |           max={max}
  421 |           step={step}
  422 |           value={Number.isFinite(maxValue) ? maxValue : max}
  423 |           onChange={(event) => onChange(valueMin, String(event.target.value || ''))}
  424 |           disabled={disabled}
  425 |           className="w-full"
  426 |         />
  427 |       </div>
  428 |     </div>
  429 |   )
  430 | }
  431 | 
  432 | export default function SearchResults() {
  433 |   const navigate = useNavigate()
  434 |   const [searchParams, setSearchParams] = useSearchParams()
  435 |   const token = useMemo(() => getToken(), [])
  436 |   const sessionUser = getCurrentUser()
  437 |   const isBuyer = String(sessionUser?.role || '').toLowerCase() === 'buyer'
  438 |   const canAdvancedFilters = hasEntitlement(sessionUser, 'advanced_search_filters')
  439 |   const canEarlyAccess = hasEntitlement(sessionUser, 'early_access_verified_factories')
  440 |   const canPriorityAccessRequests = hasEntitlement(sessionUser, 'buyer_request_priority_access')
  441 |   const canPriorityAccessCompanies = hasEntitlement(sessionUser, 'priority_search_ranking')
  442 |   const reduceMotion = useReducedMotion()
  443 |   const queryInputRef = useRef(null)
  444 |   const isMac = useMemo(() => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])
  445 | 
  446 |   // URL-serializable search state (project.md): allows sharing/saving searches.
  447 |   const [query, setQuery] = useState(() => searchParams.get('q') || '')
  448 |   const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'all')
  449 |   const [category, setCategory] = useState(() => parseCsvParam(searchParams.get('category')))
  450 |   const [filtersOpen, setFiltersOpen] = useState(false)
  451 |   const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  452 |   const [productMoreOpen, setProductMoreOpen] = useState(false)
  453 |   const [supplierMoreOpen, setSupplierMoreOpen] = useState(false)
  454 |   const [productAdvancedOpen, setProductAdvancedOpen] = useState(false)
  455 |   const [supplierAdvancedOpen, setSupplierAdvancedOpen] = useState(false)
  456 |   const [filterMode, setFilterMode] = useState('product')
  457 |   const [activePreset, setActivePreset] = useState(() => normalizePresetKey(localStorage.getItem(PRESET_STORAGE_KEY)))
  458 |   const renderedDefaultCoreFilterKeys = useMemo(() => [...DEFAULT_CORE_FILTER_KEYS], [])
  459 |   const [upgradePrompt, setUpgradePrompt] = useState('')
  460 |   const [alertFeedback, setAlertFeedback] = useState('')
  461 |   const [autoSaveCandidate, setAutoSaveCandidate] = useState(null)
  462 |   const [managePresetsOpen, setManagePresetsOpen] = useState(false)
  463 |   const [serverPresets, setServerPresets] = useState([])
  464 |   const [serverPresetsLoading, setServerPresetsLoading] = useState(false)
  465 |   const [earlyVerifiedFactories, setEarlyVerifiedFactories] = useState([])
  466 |   const [earlyVerifiedError, setEarlyVerifiedError] = useState('')
  467 |   const [pantoneDraft, setPantoneDraft] = useState('')
  468 |   const [roleSeatDraftRole, setRoleSeatDraftRole] = useState('')
  469 |   const [roleSeatDraftSeats, setRoleSeatDraftSeats] = useState('')
  470 |   const [locationLabel, setLocationLabel] = useState('')
  471 |   const [geoQuery, setGeoQuery] = useState('')
  472 |   const [geoResults, setGeoResults] = useState([])
  473 |   const [geoLoading, setGeoLoading] = useState(false)
  474 |   const [geoError, setGeoError] = useState('')
  475 |   const [showMapPreview, setShowMapPreview] = useState(false)
  476 |   const mapRef = useRef(null)
  477 |   const mapInstanceRef = useRef(null)
  478 |   const [autoSaveAlertsEnabled] = useState(() => {
  479 |     const raw = sessionUser?.profile?.auto_save_search_alerts
  480 |     if (raw === undefined || raw === null || raw === '') return true
  481 |     return raw === true || String(raw).toLowerCase() === 'true'
  482 |   })
  483 | 
  484 |   const [filters, setFilters] = useState(() => createDefaultFilters(searchParams))
  485 |   const hasAdvancedFiltersFromUrl = useMemo(() => (
  486 |     ADVANCED_FILTER_KEYS.some((key) => key !== 'priorityOnly' && hasFilterValue(searchParams.get(key)))
  487 |   ), [searchParams])
  488 | 
  489 |   useEffect(() => {
  490 |     const inDev = !import.meta.env.PROD
  491 |     if (!inDev) return
  492 |     const validation = validateCoreFilterRenderKeys(renderedDefaultCoreFilterKeys)
  493 |     if (!validation.isValid) {
  494 |       console.warn('[SearchResults] Invalid default core filter configuration.', validation)
  495 |     }
  496 |   }, [renderedDefaultCoreFilterKeys])
  497 | 
  498 |   useEffect(() => {
  499 |     let alive = true
  500 |     const loadEarlyVerified = async () => {
  501 |       if (!token) return
  502 |       if (!isBuyer || !canEarlyAccess) {
  503 |         setEarlyVerifiedFactories([])
  504 |         return
  505 |       }
  506 |       try {
  507 |         const data = await apiRequest('/users/verified/early', { token })
  508 |         if (!alive) return
  509 |         setEarlyVerifiedFactories(Array.isArray(data?.items) ? data.items : [])
  510 |         setEarlyVerifiedError('')
  511 |       } catch (err) {
  512 |         if (!alive) return
  513 |         setEarlyVerifiedFactories([])
  514 |         setEarlyVerifiedError(err.message || 'Unable to load early verified factories')
  515 |       }
  516 |     }
  517 |     loadEarlyVerified()
  518 |     return () => {
  519 |       alive = false
  520 |     }
  521 |   }, [canEarlyAccess, isBuyer, sessionUser, token])
  522 | 
  523 |   const [capabilities, setCapabilities] = useState(() => ({
  524 |     filters: { advanced: canAdvancedFilters },
  525 |   }))
  526 |   const hasAdvancedAccess = Boolean(capabilities?.filters?.advanced)
  527 |   const premiumLocked = !hasAdvancedAccess
  528 |   const priorityAllowedForTab = useMemo(() => {
  529 |     if (activeTab === 'requests') return canPriorityAccessRequests
  530 |     if (activeTab === 'companies') return canPriorityAccessCompanies
  531 |     return canPriorityAccessRequests && canPriorityAccessCompanies
  532 |   }, [activeTab, canPriorityAccessRequests, canPriorityAccessCompanies])
  533 | 
  534 |   useEffect(() => {
  535 |     const storedPreset = normalizePresetKey(localStorage.getItem(PRESET_STORAGE_KEY))
  536 |     if (storedPreset) {
  537 |       setActivePreset(storedPreset)
  538 |       return
  539 |     }
  540 |     const rolePreset = normalizePresetKey(String(sessionUser?.role || '').toLowerCase())
  541 |     if (rolePreset) {
  542 |       localStorage.setItem(PRESET_STORAGE_KEY, rolePreset)
  543 |       setActivePreset(rolePreset)
  544 |     }
  545 |   }, [sessionUser?.role])
  546 | 
  547 |   const categoryOptions = useMemo(() => {
  548 |     const industry = String(filters.industry || '').toLowerCase()
  549 |     if (industry === 'textile') return TEXTILE_CATEGORIES
  550 |     if (industry === 'garments') return GARMENT_CATEGORIES
  551 |     return [...new Set([...GARMENT_CATEGORIES, ...TEXTILE_CATEGORIES])]
  552 |   }, [filters.industry])
  553 | 
  554 |   const facetCounts = useMemo(() => ({
  555 |     category: facets?.category || {},
  556 |     fabricType: facets?.fabricType || facets?.fabric_type || {},
  557 |     certifications: facets?.certifications || {},
  558 |     processes: facets?.processes || {},
  559 |     languageSupport: facets?.languageSupport || facets?.language_support || {},
  560 |     incoterms: facets?.incoterms || {},
  561 |     paymentTerms: facets?.paymentTerms || facets?.payment_terms || {},
  562 |     documentReady: facets?.documentReady || facets?.document_ready || {},
  563 |     exportPort: facets?.exportPort || facets?.export_ports || {},
  564 |   }), [facets])
  565 | 
  566 |   const moqRangeValues = useMemo(() => parseRangeValue(filters.moqRange), [filters.moqRange])
  567 |   const priceRangeValues = useMemo(() => parseRangeValue(filters.priceRange), [filters.priceRange])
  568 | 
  569 |   const priceFormatter = useMemo(() => {
  570 |     const curr = String(filters.priceCurrency || 'USD')
  571 |     try {
  572 |       const nf = new Intl.NumberFormat(undefined, { style: 'currency', currency: curr, maximumFractionDigits: 2 })
  573 |       return (v) => nf.format(Number(v || 0))
  574 |     } catch {
  575 |       return (v) => `${curr} ${v}`
  576 |     }
  577 |   }, [filters.priceCurrency])
  578 | 
  579 |   const [loading, setLoading] = useState(false)
  580 |   const [error, setError] = useState('')
  581 |   const [quotaMessage, setQuotaMessage] = useState('')
  582 | 
  583 |   const [requests, setRequests] = useState([])
  584 |   const [companies, setCompanies] = useState([])
  585 |   const [requestsTotal, setRequestsTotal] = useState(0)
  586 |   const [companiesTotal, setCompaniesTotal] = useState(0)
  587 |   const [facets, setFacets] = useState({})
  588 |   const [ratingsByProfileKey, setRatingsByProfileKey] = useState({})
  589 |   const [recentViews, setRecentViews] = useState([])
  590 |   const [quickViewItem, setQuickViewItem] = useState(null)
  591 | 
  592 |   const [estimateTotals, setEstimateTotals] = useState({ requests: null, companies: null })
  593 |   const [estimateLoading, setEstimateLoading] = useState(false)
  594 |   const [estimateError, setEstimateError] = useState('')
  595 |   const estimateSeqRef = useRef(0)
  596 |   const skipEstimateRef = useRef(false)
  597 | 
  598 |   const totalResults = (Number(requestsTotal) || 0) + (Number(companiesTotal) || 0)
  599 | 
  600 |   const autoSearchRef = useRef(false)
  601 |   const filterTrackRef = useRef({ key: '', initialized: false })
  602 |   const autoSaveKeyRef = useRef('')
  603 |   const lastSearchMetadataRef = useRef({ searched: false, preset: '' })
  604 |   const dirtyFilterSinceSearchRef = useRef(false)
  605 | 
  606 |   const autoSaveAlert = useCallback(async (candidate) => {
  607 |     if (!autoSaveAlertsEnabled) return
  608 |     if (!candidate) return
  609 |     const key = JSON.stringify(candidate)
  610 |     if (autoSaveKeyRef.current === key) return
  611 |     autoSaveKeyRef.current = key
  612 |     try {
  613 |       await apiRequest('/search/alerts', {
  614 |         method: 'POST',
  615 |         token,
  616 |         body: { query: candidate.query || 'saved-search', filters: { category: toCsv(candidate.category), ...candidate.filters, auto: true } },
  617 |       })
  618 |     } catch (err) {
  619 |       if (err?.status === 429) {
  620 |         setAlertFeedback('Daily auto-alert quota reached. Search still ran normally.')
  621 |       } else if (err?.message) {
  622 |         setAlertFeedback(err.message)
  623 |       }
  624 |     }
  625 |   }, [autoSaveAlertsEnabled, token])
  626 | 
  627 |   const runSearch = useCallback(async () => {
  628 |     const q = query.trim()
  629 |     setLoading(true)
  630 |     setError('')
  631 |     setQuotaMessage('')
  632 |     setUpgradePrompt('')
  633 |     setAlertFeedback('')
  634 | 
  635 |     try {
  636 |       const qsUrl = buildQueryString({
  637 |         q,
  638 |         category,
  639 |         filters,
  640 |         includeAdvanced: hasAdvancedAccess,
  641 |         includePriority: Boolean(filters.priorityOnly),
  642 |       })
  643 |       const includePriorityRequests = Boolean(filters.priorityOnly) && activeTab !== 'companies' && canPriorityAccessRequests
  644 |       const includePriorityCompanies = Boolean(filters.priorityOnly) && activeTab !== 'requests' && canPriorityAccessCompanies
  645 |       const qsRequests = buildQueryString({
  646 |         q,
  647 |         category,
  648 |         filters,
  649 |         includeAdvanced: hasAdvancedAccess,
  650 |         includePriority: includePriorityRequests,
  651 |       })
  652 |       const qsProducts = buildQueryString({
  653 |         q,
  654 |         category,
  655 |         filters,
  656 |         includeAdvanced: hasAdvancedAccess,
  657 |         includePriority: includePriorityCompanies,
  658 |       })
  659 | 
  660 |       // Keep URL in sync so searches are shareable/bookmarkable (project.md).
  661 |       const nextParams = new URLSearchParams(qsUrl)
  662 |       if (activeTab) nextParams.set('tab', activeTab)
  663 |       setSearchParams(nextParams, { replace: true })
  664 | 
  665 |       const [reqRes, prodRes] = await Promise.all([
  666 |         apiRequest(`/requirements/search?${qsRequests}`, { token }),
  667 |         apiRequest(`/products/search?${qsProducts}`, { token }),
  668 |       ])
  669 | 
  670 |       const reqItems = Array.isArray(reqRes?.items) ? reqRes.items : []
  671 |       const prodItems = Array.isArray(prodRes?.items) ? prodRes.items : []
  672 |       const reqTotal = Number.isFinite(Number(reqRes?.total)) ? Number(reqRes.total) : reqItems.length
  673 |       const prodTotal = Number.isFinite(Number(prodRes?.total)) ? Number(prodRes.total) : prodItems.length
  674 |       lastSearchMetadataRef.current = { searched: true, preset: activePreset || '' }
  675 |       dirtyFilterSinceSearchRef.current = false
  676 | 
  677 |       setRequests(reqItems)
  678 |       setCompanies(prodItems)
  679 |       setRequestsTotal(reqTotal)
  680 |       setCompaniesTotal(prodTotal)
  681 | 
  682 |       const reqFacets = reqRes?.facets || {}
  683 |       const prodFacets = prodRes?.facets || {}
  684 |       const mergedFacets = activeTab === 'requests'
  685 |         ? reqFacets
  686 |         : (activeTab === 'companies' ? prodFacets : mergeFacetCounts(reqFacets, prodFacets))
  687 |       setFacets(mergedFacets || {})
  688 | 
  689 |       const mergedCapabilities = reqRes?.capabilities || prodRes?.capabilities || { filters: { advanced: false } }
  690 |       setCapabilities(mergedCapabilities)
  691 | 
  692 |       const hasActiveFilters = Boolean(q) || category.length > 0 || Object.values(filters || {}).some((v) => hasFilterValue(v))
  693 |       const candidate = hasActiveFilters ? { query: q, category, filters } : null
  694 |       setAutoSaveCandidate(candidate)
  695 |       await autoSaveAlert(candidate)
  696 | 
  697 |       if (reqRes?.quota) {
  698 |         if (reqRes.quota.unlimited) {
  699 |           setQuotaMessage('Core searches are unlimited on your plan.')
  700 |         } else if (reqRes.quota.remaining !== undefined) {
  701 |           setQuotaMessage(`Search quota remaining today: ${reqRes.quota.remaining}`)
  702 |         }
  703 |       }
  704 | 
  705 |       trackClientEvent('search_run', {
  706 |         entityType: 'search',
  707 |         entityId: activeTab,
  708 |         metadata: {
  709 |           query: q,
  710 |           categories: category,
  711 |           category_primary: category[0] || '',
  712 |           industry: filters.industry || '',
  713 |           tab: activeTab,
  714 |           advanced: hasAdvancedAccess,
  715 |           preset: activePreset || 'none',
  716 |           total_results: reqTotal + prodTotal,
  717 |         },
  718 |       })
  719 |       trackClientEvent('search_preset_conversion', {
  720 |         entityType: 'search',
  721 |         entityId: activeTab,
  722 |         metadata: {
  723 |           preset: activePreset || 'none',
  724 |           total_results: reqTotal + prodTotal,
  725 |         },
  726 |       })
  727 | 
  728 |       if (q || category.length > 0 || Object.values(filters || {}).some((v) => hasFilterValue(v))) {
  729 |         const fingerprint = hashString(JSON.stringify({ q, category, filters, tab: activeTab }))
  730 |         recordLeadSource({
  731 |           type: 'search',
  732 |           id: fingerprint,
  733 |           label: q || category.join(', ') || 'Search',
  734 |         })
  735 |       }
  736 |     } catch (err) {
  737 |       setError(err.message || 'Search failed')
  738 |       setRequests([])
  739 |       setCompanies([])
  740 |       setRequestsTotal(0)
  741 |       setCompaniesTotal(0)
  742 |       if (err?.quota?.unlimited) {
  743 |         setQuotaMessage('Core searches are unlimited on your plan.')
  744 |       } else if (err?.quota?.remaining !== undefined) {
  745 |         setQuotaMessage(`Remaining today: ${err.quota.remaining}`)
  746 |       }
  747 |     } finally {
  748 |       setLoading(false)
  749 |     }
  750 |   }, [activePreset, activeTab, autoSaveAlert, category, filters, hasAdvancedAccess, query, setSearchParams, token, canPriorityAccessCompanies, canPriorityAccessRequests])
  751 | 
  752 |   useEffect(() => {
  753 |     const handler = (e) => {
  754 |       const key = String(e.key || '').toLowerCase()
  755 |       if (key !== 'k') return
  756 |       if (!(e.ctrlKey || e.metaKey)) return
  757 |       e.preventDefault()
  758 |       queryInputRef.current?.focus?.()
  759 |     }
  760 |     window.addEventListener('keydown', handler)
  761 |     return () => window.removeEventListener('keydown', handler)
  762 |   }, [])
  763 | 
  764 |   useEffect(() => {
  765 |     // Auto-run when landing on /search with URL params (shared/bookmarked search).
  766 |     if (autoSearchRef.current) return
  767 |     autoSearchRef.current = true
  768 | 
  769 |     const hasUrlQuery = Boolean(
  770 |       (query && query.trim()) ||
  771 |       category.length > 0 ||
  772 |       Object.values(filters || {}).some((v) => hasFilterValue(v)),
  773 |     )
  774 | 
  775 |     if (hasUrlQuery) {
  776 |       skipEstimateRef.current = true
  777 |       runSearch()
  778 |     }
  779 |   }, [category, filters, query, runSearch])
  780 | 
  781 |   useEffect(() => {
  782 |     if (!activePreset) return
  783 |     if (autoSearchRef.current) return
  784 |     const hasUrlQuery = Boolean(
  785 |       (query && query.trim()) ||
  786 |       category.length > 0 ||
  787 |       Object.values(filters || {}).some((v) => hasFilterValue(v)),
  788 |     )
  789 |     if (hasUrlQuery) return
  790 |     applyPreset(activePreset)
  791 |   // eslint-disable-next-line react-hooks/exhaustive-deps
  792 |   }, [activePreset])
  793 | 
  794 |   useEffect(() => {
  795 |     if (!filters.priorityOnly) return
  796 |     if (priorityAllowedForTab) return
  797 |     setFilters((prev) => ({ ...prev, priorityOnly: false }))
  798 |     setUpgradePrompt('Priority-only filter requires a Premium plan.')
  799 |   }, [filters.priorityOnly, priorityAllowedForTab])
  800 | 
  801 |   useEffect(() => {
  802 |     if (!token) return
  803 |     if (skipEstimateRef.current) {
  804 |       skipEstimateRef.current = false
  805 |       return
  806 |     }
  807 | 
  808 |     const q = query.trim()
  809 |     const hasActiveFilters = Boolean(
  810 |       q ||
  811 |       category.length > 0 ||
  812 |       Object.values(filters || {}).some((v) => hasFilterValue(v)),
  813 |     )
  814 | 
  815 |     if (!hasActiveFilters) {
  816 |       setEstimateTotals({ requests: null, companies: null })
  817 |       setEstimateError('')
  818 |       setEstimateLoading(false)
  819 |       return
  820 |     }
  821 | 
  822 |     const seq = (estimateSeqRef.current += 1)
  823 |     const includePriorityRequests = Boolean(filters.priorityOnly) && activeTab !== 'companies' && canPriorityAccessRequests
  824 |     const includePriorityCompanies = Boolean(filters.priorityOnly) && activeTab !== 'requests' && canPriorityAccessCompanies
  825 | 
  826 |     const timer = window.setTimeout(async () => {
  827 |       setEstimateLoading(true)
  828 |       setEstimateError('')
  829 |       try {
  830 |         const qsRequestsBase = buildQueryString({
  831 |           q,
  832 |           category,
  833 |           filters,
  834 |           includeAdvanced: hasAdvancedAccess,
  835 |           includePriority: includePriorityRequests,
  836 |         })
  837 |         const qsProductsBase = buildQueryString({
  838 |           q,
  839 |           category,
  840 |           filters,
  841 |           includeAdvanced: hasAdvancedAccess,
  842 |           includePriority: includePriorityCompanies,
  843 |         })
  844 | 
  845 |         const qsRequests = `${qsRequestsBase}${qsRequestsBase ? '&' : ''}estimateOnly=true`
  846 |         const qsProducts = `${qsProductsBase}${qsProductsBase ? '&' : ''}estimateOnly=true`
  847 |         const [reqRes, prodRes] = await Promise.all([
  848 |           apiRequest(`/requirements/search?${qsRequests}`, { token }),
  849 |           apiRequest(`/products/search?${qsProducts}`, { token }),
  850 |         ])
  851 | 
  852 |         if (estimateSeqRef.current !== seq) return
  853 | 
  854 |         const reqTotal = Number.isFinite(Number(reqRes?.total)) ? Number(reqRes.total) : 0
  855 |         const prodTotal = Number.isFinite(Number(prodRes?.total)) ? Number(prodRes.total) : 0
  856 |         setEstimateTotals({ requests: reqTotal, companies: prodTotal })
  857 |         const reqFacets = reqRes?.facets || {}
  858 |         const prodFacets = prodRes?.facets || {}
  859 |         const mergedFacets = activeTab === 'requests'
  860 |           ? reqFacets
  861 |           : (activeTab === 'companies' ? prodFacets : mergeFacetCounts(reqFacets, prodFacets))
  862 |         if (Object.keys(mergedFacets || {}).length) setFacets(mergedFacets)
  863 | 
  864 |         const mergedCapabilities = reqRes?.capabilities || prodRes?.capabilities
  865 |         if (mergedCapabilities) setCapabilities(mergedCapabilities)
  866 |       } catch (err) {
  867 |         if (estimateSeqRef.current !== seq) return
  868 |         setEstimateTotals({ requests: null, companies: null })
  869 |         setEstimateError(err.message || 'Unable to estimate results.')
  870 |       } finally {
  871 |         if (estimateSeqRef.current === seq) {
  872 |           setEstimateLoading(false)
  873 |         }
  874 |       }
  875 |     }, 450)
  876 | 
  877 |     return () => window.clearTimeout(timer)
  878 |   }, [activeTab, canPriorityAccessCompanies, canPriorityAccessRequests, category, filters, hasAdvancedAccess, query, token])
  879 | 
  880 |   useEffect(() => {
  881 |     const activeAdvancedKeys = hasAdvancedAccess
  882 |       ? ADVANCED_FILTER_KEYS.filter((key) => hasFilterValue(filters[key]))
  883 |       : []
  884 |     const activeCoreKeys = DEFAULT_CORE_FILTER_KEYS.filter((key) => (key === 'category' ? category.length > 0 : hasFilterValue(filters[key])))
  885 |     const payload = {
  886 |       query: query.trim(),
  887 |       categories: category,
  888 |       category_primary: category[0] || '',
  889 |       industry: filters.industry || '',
  890 |       tab: activeTab,
  891 |       advanced: hasAdvancedAccess,
  892 |       active_filter_keys: [...activeCoreKeys, ...activeAdvancedKeys],
  893 |     }
  894 |     const key = JSON.stringify(payload)
  895 |     if (!filterTrackRef.current.initialized) {
  896 |       filterTrackRef.current = { key, initialized: true }
  897 |       return
  898 |     }
  899 |     if (filterTrackRef.current.key === key) return
  900 |     filterTrackRef.current.key = key
  901 |     const timer = window.setTimeout(() => {
  902 |       trackClientEvent('search_filters_changed', {
  903 |         entityType: 'search',
  904 |         entityId: activeTab,
  905 |         metadata: payload,
  906 |       })
  907 |     }, 600)
  908 |     return () => window.clearTimeout(timer)
  909 |   }, [activeTab, category, filters, hasAdvancedAccess, query])
  910 | 
  911 |   useEffect(() => {
  912 |     const depth = supplierAdvancedOpen || productAdvancedOpen
  913 |       ? 3
  914 |       : (productMoreOpen || supplierMoreOpen || advancedFiltersOpen ? 2 : (filtersOpen ? 1 : 0))
  915 |     trackClientEvent('search_filter_depth_opened', {
  916 |       entityType: 'search',
  917 |       entityId: activeTab,
  918 |       metadata: {
  919 |         depth,
  920 |         preset: activePreset || 'none',
  921 |       },
  922 |     })
  923 |   }, [activePreset, activeTab, advancedFiltersOpen, filtersOpen, productAdvancedOpen, productMoreOpen, supplierAdvancedOpen, supplierMoreOpen])
  924 | 
  925 |   useEffect(() => {
  926 |     const hasChanges = Boolean(query.trim() || category.length > 0 || Object.values(filters || {}).some((v) => hasFilterValue(v)))
  927 |     if (hasChanges) dirtyFilterSinceSearchRef.current = true
  928 |   }, [category, filters, query])
  929 | 
  930 |   useEffect(() => () => {
  931 |     if (dirtyFilterSinceSearchRef.current && !lastSearchMetadataRef.current.searched) {
  932 |       trackClientEvent('search_filter_abandonment', {
  933 |         entityType: 'search',
  934 |         entityId: activeTab,
  935 |         metadata: {
  936 |           preset: activePreset || 'none',
  937 |         },
  938 |       })
  939 |     }
  940 |   }, [activePreset, activeTab])
  941 | 
  942 |   useEffect(() => {
  943 |     if (!geoQuery) {
  944 |       setGeoResults([])
  945 |       return
  946 |     }
  947 |     const timer = window.setTimeout(() => {
  948 |       runGeoSearch(geoQuery)
  949 |     }, 450)
  950 |     return () => window.clearTimeout(timer)
  951 |   }, [geoQuery])
  952 | 
  953 |   useEffect(() => {
  954 |     const lat = Number(filters.locationLat)
  955 |     const lng = Number(filters.locationLng)
  956 |     if (!showMapPreview) return
  957 |     if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
  958 |     if (!mapRef.current) return
  959 | 
  960 |     if (!mapInstanceRef.current) {
  961 |       mapInstanceRef.current = L.map(mapRef.current, {
  962 |         center: [lat, lng],
  963 |         zoom: 10,
  964 |         zoomControl: false,
  965 |         attributionControl: false,
  966 |       })
  967 |       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  968 |         maxZoom: 19,
  969 |       }).addTo(mapInstanceRef.current)
  970 |     }
  971 | 
  972 |     mapInstanceRef.current.setView([lat, lng], 10)
  973 |     const marker = L.marker([lat, lng])
  974 |     marker.addTo(mapInstanceRef.current)
  975 |     return () => {
  976 |       if (mapInstanceRef.current && marker) {
  977 |         mapInstanceRef.current.removeLayer(marker)
  978 |       }
  979 |     }
  980 |   }, [filters.locationLat, filters.locationLng, showMapPreview])
  981 | 
  982 |   const loadRecentViews = useCallback(async () => {
  983 |     try {
  984 |       const data = await apiRequest('/products/views/me?cursor=0&limit=5', { token })
  985 |       setRecentViews(Array.isArray(data?.items) ? data.items : [])
  986 |     } catch {
  987 |       setRecentViews([])
  988 |     }
  989 |   }, [token])
  990 | 
  991 |   useEffect(() => {
  992 |     const keys = [...new Set(companies.map((c) => String(c.profile_key || '')).filter(Boolean))]
  993 |     if (!keys.length) {
  994 |       setRatingsByProfileKey({})
  995 |       return
  996 |     }
  997 | 
  998 |     apiRequest(`/ratings/search?profile_keys=${encodeURIComponent(keys.join(','))}`, { token })
  999 |       .then((data) => setRatingsByProfileKey(data || {}))
 1000 |       .catch(() => setRatingsByProfileKey({}))
 1001 |   }, [companies, token])
 1002 | 
 1003 |   useEffect(() => {
 1004 |     loadRecentViews()
 1005 |   }, [loadRecentViews])
 1006 | 
 1007 |   function updateAdvancedFilter(key, value) {
 1008 |     if (!hasAdvancedAccess) {
 1009 |       setUpgradePrompt('Advanced filters require a Premium plan. Upgrade to unlock these filters.')
 1010 |       return
 1011 |     }
 1012 |     setFilters((prev) => ({ ...prev, [key]: value }))
 1013 |   }
 1014 | 
 1015 |   function toggleCategory(option) {
 1016 |     setCategory((prev) => {
 1017 |       if (prev.includes(option)) return prev.filter((entry) => entry !== option)
 1018 |       return [...prev, option]
 1019 |     })
 1020 |   }
 1021 | 
 1022 |   function clearCategories() {
 1023 |     setCategory([])
 1024 |   }
 1025 | 
 1026 |   function updateCoreFilter(key, value) {
 1027 |     setFilters((prev) => ({ ...prev, [key]: value }))
 1028 |   }
 1029 | 
 1030 |   function updateRangeFilter(key, min, max) {
 1031 |     setFilters((prev) => ({ ...prev, [key]: rangeToString(min, max) }))
 1032 |   }
 1033 | 
 1034 |   function addPantone(value) {
 1035 |     const cleaned = String(value || '').trim()
 1036 |     if (!cleaned) return
 1037 |     updateAdvancedFilter('colorPantone', [...new Set([...(filters.colorPantone || []), cleaned])])
 1038 |     setPantoneDraft('')
 1039 |   }
 1040 | 
 1041 |   function addRoleSeat() {
 1042 |     const role = String(roleSeatDraftRole || '').trim()
 1043 |     if (!role) return
 1044 |     const seats = String(roleSeatDraftSeats || '').trim()
 1045 |     const existing = Array.isArray(filters.roleSeats) ? (filters.roleSeats || []) : []
 1046 |     const next = existing.filter((e) => String(e?.role || '').toLowerCase() !== role.toLowerCase())
 1047 |     next.push({ role, seats })
 1048 |     updateAdvancedFilter('roleSeats', next)
 1049 |     setRoleSeatDraftRole('')
 1050 |     setRoleSeatDraftSeats('')
 1051 |   }
 1052 | 
 1053 |   function removePantone(value) {
 1054 |     updateAdvancedFilter('colorPantone', (filters.colorPantone || []).filter((entry) => entry !== value))
 1055 |   }
 1056 | 
 1057 |   async function runGeoSearch(term) {
 1058 |     const q = String(term || '').trim()
 1059 |     if (!q) {
 1060 |       setGeoResults([])
 1061 |       return
 1062 |     }
 1063 |     setGeoLoading(true)
 1064 |     setGeoError('')
 1065 |     try {
 1066 |       const data = await apiRequest(`/geo/search?q=${encodeURIComponent(q)}`)
 1067 |       setGeoResults(Array.isArray(data?.items) ? data.items : [])
 1068 |     } catch (err) {
 1069 |       setGeoResults([])
 1070 |       setGeoError(err.message || 'Unable to search location')
 1071 |     } finally {
 1072 |       setGeoLoading(false)
 1073 |     }
 1074 |   }
 1075 | 
 1076 |   function selectGeoResult(result) {
 1077 |     if (!result) return
 1078 |     updateAdvancedFilter('locationLat', String(result.lat))
 1079 |     updateAdvancedFilter('locationLng', String(result.lng))
 1080 |     setLocationLabel(result.label || '')
 1081 |     setGeoQuery(result.label || '')
 1082 |     setGeoResults([])
 1083 |   }
 1084 | 
 1085 |   function useCurrentLocation() {
 1086 |     if (!navigator.geolocation) {
 1087 |       setAlertFeedback('Geolocation is not available in this browser.')
 1088 |       return
 1089 |     }
 1090 |     navigator.geolocation.getCurrentPosition((position) => {
 1091 |       const lat = position.coords.latitude.toFixed(6)
 1092 |       const lng = position.coords.longitude.toFixed(6)
 1093 |       updateAdvancedFilter('locationLat', lat)
 1094 |       updateAdvancedFilter('locationLng', lng)
 1095 |       setLocationLabel('Current location')
 1096 |       setGeoQuery('Current location')
 1097 |     }, () => {
 1098 |       setAlertFeedback('Unable to access your location.')
 1099 |     })
 1100 |   }
 1101 | 
 1102 |   function updatePriorityFilter(value) {
 1103 |     if (!priorityAllowedForTab) {
 1104 |       setUpgradePrompt('Priority-only filter requires a Premium plan.')
 1105 |       return
 1106 |     }
 1107 |     setFilters((prev) => ({ ...prev, priorityOnly: value }))
 1108 |   }
 1109 | 
 1110 |   function clearAllFilters() {
 1111 |     setQuery('')
 1112 |     setCategory([])
 1113 |     setFilters(createDefaultFilters(new URLSearchParams()))
 1114 |     setGeoQuery('')
 1115 |     setGeoResults([])
 1116 |     setLocationLabel('')
 1117 |   }
 1118 | 
 1119 |   async function saveAlert(presetLabel = '') {
 1120 |     setAlertFeedback('')
 1121 |     const q = query.trim()
 1122 |     const hasFilters = Object.values(filters || {}).some((v) => hasFilterValue(v))
 1123 |     if (!q && category.length === 0 && !hasFilters) {
 1124 |       setAlertFeedback('Enter a query or select filters before saving.')
 1125 |       return
 1126 |     }
 1127 |     try {
 1128 |       const result = await apiRequest('/search/alerts', {
 1129 |         method: 'POST',
 1130 |         token,
 1131 |         body: { query: q || 'saved-search', filters: { category: toCsv(category), ...filters, preset: presetLabel } },
 1132 |       })
 1133 |       setAlertFeedback(`Search saved. Remaining alert quota today: ${result?.quota?.remaining ?? '-'}`)
 1134 |     } catch (err) {
 1135 |       setAlertFeedback(err.message || 'Failed to save alert.')
 1136 |     }
 1137 |   }
 1138 | 
 1139 |   function getShareUrl() {
 1140 |     try {
 1141 |       const qs = buildQueryString({
 1142 |         q: query.trim(),
 1143 |         category,
 1144 |         filters,
 1145 |         includeAdvanced: hasAdvancedAccess,
 1146 |         includePriority: Boolean(filters.priorityOnly),
 1147 |       })
 1148 |       const params = new URLSearchParams(qs)
 1149 |       if (activeTab) params.set('tab', activeTab)
 1150 |       return `${window.location.origin}/search?${params.toString()}`
 1151 |     } catch {
 1152 |       return `${window.location.origin}/search`
 1153 |     }
 1154 |   }
 1155 | 
 1156 |   async function handleShareClick() {
 1157 |     const url = getShareUrl()
 1158 |     try {
 1159 |       if (navigator?.clipboard?.writeText) {
 1160 |         await navigator.clipboard.writeText(url)
 1161 |         setAlertFeedback('Share link copied to clipboard.')
 1162 |       } else {
 1163 |         // fallback
 1164 |         window.prompt('Copy this link', url)
 1165 |       }
 1166 |     } catch {
 1167 |       setAlertFeedback(`Unable to copy link. ${url}`)
 1168 |     }
 1169 |   }
 1170 | 
 1171 |   function listLocalPresets() {
 1172 |     try {
 1173 |       return PRESET_KEYS.map((k) => {
 1174 |         const raw = localStorage.getItem(`gt_search_preset_${k}`)
 1175 |         if (!raw) return null
 1176 |         try { return { key: k, data: JSON.parse(raw) } } catch { return null }
 1177 |       }).filter(Boolean)
 1178 |     } catch {
 1179 |       return []
 1180 |     }
 1181 |   }
 1182 | 
 1183 |   function deleteLocalPreset(presetKey) {
 1184 |     try {
 1185 |       localStorage.removeItem(`gt_search_preset_${presetKey}`)
 1186 |       if (localStorage.getItem(PRESET_STORAGE_KEY) === presetKey) localStorage.removeItem(PRESET_STORAGE_KEY)
 1187 |       setAlertFeedback('Preset deleted.')
 1188 |       setManagePresetsOpen(false)
 1189 |     } catch {
 1190 |       // ignore
 1191 |     }
 1192 |   }
 1193 | 
 1194 |   async function shareLocalPreset(preset) {
 1195 |     try {
 1196 |       const payload = preset?.data || {}
 1197 |       const qs = buildQueryString({
 1198 |         q: payload.query || '',
 1199 |         category: payload.category || [],
 1200 |         filters: payload.filters || {},
 1201 |         includeAdvanced: hasAdvancedAccess,
 1202 |         includePriority: Boolean(payload?.filters?.priorityOnly),
 1203 |       })
 1204 |       const params = new URLSearchParams(qs)
 1205 |       if (activeTab) params.set('tab', activeTab)
 1206 |       const url = `${window.location.origin}/search?${params.toString()}`
 1207 |       if (navigator?.clipboard?.writeText) {
 1208 |         await navigator.clipboard.writeText(url)
 1209 |         setAlertFeedback('Preset link copied to clipboard.')
 1210 |       } else {
 1211 |         window.prompt('Copy this preset link', url)
 1212 |       }
 1213 |     } catch {
 1214 |       setAlertFeedback('Unable to copy preset link.')
 1215 |     }
 1216 |   }
 1217 | 
 1218 |   function savePresetLocal(presetKey) {
 1219 |     try {
 1220 |       const payload = { query, category, filters }
 1221 |       localStorage.setItem(`gt_search_preset_${presetKey}`, JSON.stringify(payload))
 1222 |       localStorage.setItem(PRESET_STORAGE_KEY, presetKey)
 1223 |       setActivePreset(presetKey)
 1224 |     } catch {
 1225 |       // ignore storage failures
 1226 |     }
 1227 |   }
 1228 | 
 1229 |   function presetFallback(presetKey) {
 1230 |     if (presetKey === 'buyer') {
 1231 |       return { query: '', category: [], filters: { industry: 'garments', orgType: 'factory', verifiedOnly: true } }
 1232 |     }
 1233 |     if (presetKey === 'buying_house') {
 1234 |       return { query: '', category: [], filters: { orgType: 'factory', verifiedOnly: true, handlesMultipleFactories: true } }
 1235 |     }
 1236 |     return { query: '', category: [], filters: { orgType: 'buying_house', verifiedOnly: true } }
 1237 |   }
 1238 | 
 1239 |   function applyPreset(presetKey) {
 1240 |     const normalizedPresetKey = normalizePresetKey(presetKey)
 1241 |     if (!normalizedPresetKey) return
 1242 |     try {
 1243 |       const raw = localStorage.getItem(`gt_search_preset_${normalizedPresetKey}`)
 1244 |       const preset = raw ? JSON.parse(raw) : presetFallback(normalizedPresetKey)
 1245 |       setQuery(preset?.query || '')
 1246 |       const presetCategory = Array.isArray(preset?.category)
 1247 |         ? preset.category
 1248 |         : parseCsvParam(preset?.category)
 1249 |       setCategory(presetCategory)
 1250 |       if (preset?.filters) {
 1251 |         setFilters((prev) => ({
 1252 |           ...prev,
 1253 |           ...preset.filters,
 1254 |           fabricType: Array.isArray(preset.filters.fabricType) ? preset.filters.fabricType : parseCsvParam(preset.filters.fabricType),
 1255 |           colorPantone: Array.isArray(preset.filters.colorPantone) ? preset.filters.colorPantone : parseCsvParam(preset.filters.colorPantone),
 1256 |           customization: Array.isArray(preset.filters.customization) ? preset.filters.customization : parseCsvParam(preset.filters.customization),
 1257 |           certifications: Array.isArray(preset.filters.certifications) ? preset.filters.certifications : parseCsvParam(preset.filters.certifications),
 1258 |           incoterms: Array.isArray(preset.filters.incoterms) ? preset.filters.incoterms : parseCsvParam(preset.filters.incoterms),
 1259 |           paymentTerms: Array.isArray(preset.filters.paymentTerms) ? preset.filters.paymentTerms : parseCsvParam(preset.filters.paymentTerms),
 1260 |           documentReady: Array.isArray(preset.filters.documentReady) ? preset.filters.documentReady : parseCsvParam(preset.filters.documentReady),
 1261 |           languageSupport: Array.isArray(preset.filters.languageSupport) ? preset.filters.languageSupport : parseCsvParam(preset.filters.languageSupport),
 1262 |           processes: Array.isArray(preset.filters.processes) ? preset.filters.processes : parseCsvParam(preset.filters.processes),
 1263 |           exportPort: Array.isArray(preset.filters.exportPort) ? preset.filters.exportPort : parseCsvParam(preset.filters.exportPort),
 1264 |         }))
 1265 |       }
 1266 |       localStorage.setItem(PRESET_STORAGE_KEY, normalizedPresetKey)
 1267 |       setActivePreset(normalizedPresetKey)
 1268 |       setAlertFeedback(`Loaded ${normalizedPresetKey.replace('_', ' ')} preset.`)
 1269 |     } catch {
 1270 |       setAlertFeedback('Unable to load preset.')
 1271 |     }
 1272 |   }
 1273 | 
 1274 |   async function savePreset(presetKey) {
 1275 |     await saveAlert(presetKey)
 1276 |     savePresetLocal(presetKey)
 1277 |     setAutoSaveCandidate(null)
 1278 |   }
 1279 | 
 1280 |   const fetchServerPresets = useCallback(async () => {
 1281 |     if (!token) {
 1282 |       setServerPresets([])
 1283 |       return
 1284 |     }
 1285 |     setServerPresetsLoading(true)
 1286 |     try {
 1287 |       const data = await apiRequest('/presets', { token })
 1288 |       setServerPresets(Array.isArray(data?.items) ? data.items : [])
 1289 |     } catch {
 1290 |       setServerPresets([])
 1291 |     } finally {
 1292 |       setServerPresetsLoading(false)
 1293 |     }
 1294 |   }, [token])
 1295 | 
 1296 |   async function createServerPresetFromCurrent(name, shared = false) {
 1297 |     if (!token) {
 1298 |       setAlertFeedback('Login required to save presets.')
 1299 |       return null
 1300 |     }
 1301 |     try {
 1302 |       const payload = { name: String(name || 'Preset'), filters: { query, category, ...filters }, shared: Boolean(shared) }
 1303 |       await apiRequest('/presets', { method: 'POST', token, body: payload })
 1304 |       await fetchServerPresets()
 1305 |       setAlertFeedback('Preset saved to server.')
 1306 |       return true
 1307 |     } catch (err) {
 1308 |       setAlertFeedback(err.message || 'Unable to save preset to server.')
 1309 |       return null
 1310 |     }
 1311 |   }
 1312 | 
 1313 |   async function createServerPresetFromLocal(presetKey) {
 1314 |     try {
 1315 |       const raw = localStorage.getItem(`gt_search_preset_${presetKey}`)
 1316 |       if (!raw) {
 1317 |         setAlertFeedback('Local preset not found')
 1318 |         return null
 1319 |       }
 1320 |       const parsed = JSON.parse(raw)
 1321 |       if (!token) {
 1322 |         setAlertFeedback('Login required to save presets.')
 1323 |         return null
 1324 |       }
 1325 |       const payload = { name: `${presetKey.replace('_', ' ')} preset`, filters: { query: parsed.query || '', category: parsed.category || [], ...parsed.filters }, shared: false }
 1326 |       await apiRequest('/presets', { method: 'POST', token, body: payload })
 1327 |       await fetchServerPresets()
 1328 |       setAlertFeedback('Local preset copied to server.')
 1329 |       return true
 1330 |     } catch (err) {
 1331 |       setAlertFeedback(err.message || 'Unable to copy preset to server.')
 1332 |       return null
 1333 |     }
 1334 |   }
 1335 | 
 1336 |   function applyServerPreset(preset) {
 1337 |     try {
 1338 |       const data = preset?.filters || {}
 1339 |       setQuery(data.query || '')
 1340 |       const presetCategory = Array.isArray(data.category) ? data.category : parseCsvParam(data.category)
 1341 |       setCategory(presetCategory)
 1342 |       if (data) {
 1343 |         setFilters((prev) => ({
 1344 |           ...prev,
 1345 |           ...data,
 1346 |           fabricType: Array.isArray(data.fabricType) ? data.fabricType : parseCsvParam(data.fabricType),
 1347 |           colorPantone: Array.isArray(data.colorPantone) ? data.colorPantone : parseCsvParam(data.colorPantone),
 1348 |           customization: Array.isArray(data.customization) ? data.customization : parseCsvParam(data.customization),
 1349 |           certifications: Array.isArray(data.certifications) ? data.certifications : parseCsvParam(data.certifications),
 1350 |           incoterms: Array.isArray(data.incoterms) ? data.incoterms : parseCsvParam(data.incoterms),
 1351 |           paymentTerms: Array.isArray(data.paymentTerms) ? data.paymentTerms : parseCsvParam(data.paymentTerms),
 1352 |           documentReady: Array.isArray(data.documentReady) ? data.documentReady : parseCsvParam(data.documentReady),
 1353 |           languageSupport: Array.isArray(data.languageSupport) ? data.languageSupport : parseCsvParam(data.languageSupport),
 1354 |           processes: Array.isArray(data.processes) ? data.processes : parseCsvParam(data.processes),
 1355 |           exportPort: Array.isArray(data.exportPort) ? data.exportPort : parseCsvParam(data.exportPort),
 1356 |         }))
 1357 |       }
 1358 |       setActivePreset(preset?.name || '')
 1359 |       setAlertFeedback(`Loaded preset "${preset?.name || ''}"`)
 1360 |     } catch {
 1361 |       setAlertFeedback('Unable to load preset.')
 1362 |     }
 1363 |   }
 1364 | 
 1365 |   async function updateServerPreset(presetId) {
 1366 |     if (!token) {
 1367 |       setAlertFeedback('Login required.')
 1368 |       return null
 1369 |     }
 1370 |     try {
 1371 |       const name = window.prompt('Rename preset (leave blank to keep current name)', '')
 1372 |       if (name === null) return null
 1373 |       const body = { name: name || undefined, filters: { query, category, ...filters } }
 1374 |       await apiRequest(`/presets/${encodeURIComponent(presetId)}`, { method: 'PATCH', token, body })
 1375 |       await fetchServerPresets()
 1376 |       setAlertFeedback('Preset updated.')
 1377 |       return true
 1378 |     } catch (err) {
 1379 |       setAlertFeedback(err.message || 'Unable to update preset.')
 1380 |       return null
 1381 |     }
 1382 |   }
 1383 | 
 1384 |   async function deleteServerPreset(presetId) {
 1385 |     if (!token) {
 1386 |       setAlertFeedback('Login required.')
 1387 |       return false
 1388 |     }
 1389 |     try {
 1390 |       await apiRequest(`/presets/${encodeURIComponent(presetId)}`, { method: 'DELETE', token })
 1391 |       await fetchServerPresets()
 1392 |       setAlertFeedback('Preset deleted.')
 1393 |       return true
 1394 |     } catch (err) {
 1395 |       setAlertFeedback(err.message || 'Unable to delete preset.')
 1396 |       return false
 1397 |     }
 1398 |   }
 1399 | 
 1400 |   useEffect(() => {
 1401 |     if (!managePresetsOpen) return
 1402 |     fetchServerPresets().catch(() => null)
 1403 |   }, [managePresetsOpen, fetchServerPresets])
 1404 | 
 1405 |   function openChatNotice(name, leadSource, journeyContext = {}) {
 1406 |     if (leadSource?.type && leadSource?.id) {
 1407 |       recordLeadSource({
 1408 |         type: leadSource.type,
 1409 |         id: leadSource.id,
 1410 |         label: leadSource.label || '',
 1411 |       })
 1412 |     }
 1413 |     const params = new URLSearchParams()
 1414 |     params.set('journey_source', 'search')
 1415 |     if (journeyContext?.matchId) params.set('match_id', journeyContext.matchId)
 1416 |     if (journeyContext?.productId) params.set('product_id', journeyContext.productId)
 1417 |     if (journeyContext?.requirementId) params.set('requirement_id', journeyContext.requirementId)
 1418 |     const token = getToken()
 1419 |     if (token) {
 1420 |       apiRequest('/workflow/journeys', {
 1421 |         method: 'POST',
 1422 |         token,
 1423 |         body: {
 1424 |           match_id: journeyContext?.matchId || '',
 1425 |           requirement_id: journeyContext?.requirementId || '',
 1426 |           product_id: journeyContext?.productId || '',
 1427 |           initial_state: 'discovered',
 1428 |         },
 1429 |       })
 1430 |         .then((journey) => {
 1431 |           if (!journey?.id) return null
 1432 |           return apiRequest(`/workflow/journeys/${encodeURIComponent(journey.id)}/transition`, {
 1433 |             method: 'POST',
 1434 |             token,
 1435 |             body: {
 1436 |               to_state: 'matched',
 1437 |               event_type: 'match_confirmed',
 1438 |               metadata: { source: 'search_results_contact' },
 1439 |             },
 1440 |           })
 1441 |         })
 1442 |         .catch(() => null)
 1443 |     }
 1444 |     const query = params.toString()
 1445 |     navigate(`/chat${query ? `?${query}` : ''}`, { state: { notice: `Contacting ${name}. If you are unverified, your first message may appear as a request.` } })
 1446 |   }
 1447 | 
 1448 |   const activeFilterChips = useMemo(() => {
 1449 |     const chips = []
 1450 |     if (query.trim()) chips.push({ key: 'query', label: `Query: ${query.trim()}`, onRemove: () => setQuery('') })
 1451 |     if (category.length) chips.push({ key: 'category', label: `Category: ${category.join(', ')}`, onRemove: clearCategories })
 1452 |     if (filters.industry) chips.push({ key: 'industry', label: `Industry: ${filters.industry}`, onRemove: () => setFilters((prev) => ({ ...prev, industry: '' })) })
 1453 |     if (filters.country) chips.push({ key: 'country', label: `Country: ${filters.country}`, onRemove: () => setFilters((prev) => ({ ...prev, country: '' })) })
 1454 |     if (filters.incoterms && Array.isArray(filters.incoterms) && filters.incoterms.length) chips.push({ key: 'incoterms', label: `Incoterms: ${filters.incoterms.join(', ')}`, onRemove: () => setFilters((prev) => ({ ...prev, incoterms: [] })) })
 1455 |     if (filters.auditDate) chips.push({ key: 'auditDate', label: `Last audit: ${filters.auditDate}`, onRemove: () => setFilters((prev) => ({ ...prev, auditDate: '' })) })
 1456 |     if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', label: 'Verified only', onRemove: () => setFilters((prev) => ({ ...prev, verifiedOnly: false })) })
 1457 |     if (filters.orgType) chips.push({ key: 'orgType', label: `Account: ${filters.orgType.replace('_', ' ')}`, onRemove: () => setFilters((prev) => ({ ...prev, orgType: '' })) })
 1458 |     if (filters.priorityOnly) chips.push({ key: 'priorityOnly', label: 'Priority only', onRemove: () => setFilters((prev) => ({ ...prev, priorityOnly: false })) })
 1459 |     if (filters.priceRange) {
 1460 |       const pr = priceRangeValues || { min: '', max: '' }
 1461 |       const minLabel = pr.min ? priceFormatter(pr.min) : ''
 1462 |       const maxLabel = pr.max ? priceFormatter(pr.max) : ''
 1463 |       const label = `Price: ${minLabel}${(minLabel && maxLabel) ? ` - ${maxLabel}` : ''}`
 1464 |       chips.push({ key: 'priceRange', label, onRemove: () => setFilters((prev) => ({ ...prev, priceRange: '' })) })
 1465 |     }
 1466 |     if (filters.auditScoreMin) chips.push({ key: 'auditScoreMin', label: `Audit score ≥ ${filters.auditScoreMin}`, onRemove: () => setFilters((prev) => ({ ...prev, auditScoreMin: '' })) })
 1467 |     if (filters.hasPermissionMatrix) chips.push({ key: 'hasPermissionMatrix', label: 'Role-based access', onRemove: () => setFilters((prev) => ({ ...prev, hasPermissionMatrix: false })) })
 1468 |     if (filters.permissionSection) chips.push({ key: 'permissionSection', label: `Permission: ${filters.permissionSection}${filters.permissionSectionEdit ? ' (edit)' : ''}`, onRemove: () => setFilters((prev) => ({ ...prev, permissionSection: '', permissionSectionEdit: false })) })
 1469 |     if (filters.roleSeats && Array.isArray(filters.roleSeats) && filters.roleSeats.length) {
 1470 |       (filters.roleSeats || []).forEach((entry) => {
 1471 |         if (!entry || !entry.role) return
 1472 |         const label = `${entry.role}: ${entry.seats || '0'} seats`
 1473 |         chips.push({ key: `roleSeats-${entry.role}`, label, onRemove: () => setFilters((prev) => ({ ...prev, roleSeats: (prev.roleSeats || []).filter((e) => e.role !== entry.role) })) })
 1474 |       })
 1475 |     }
 1476 |     return chips
 1477 |   }, [category, filters, priceFormatter, priceRangeValues, query])
 1478 | 
 1479 |   return (
 1480 |     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
 1481 |       <div className="max-w-7xl mx-auto px-4 py-6">
 1482 |         <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md dark:bg-slate-950/40 dark:ring-white/10">
 1483 |           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 1484 |             <div className="flex items-center gap-2">
 1485 |               <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center">
 1486 |                 <SearchIcon size={18} />
 1487 |               </div>
 1488 |               <div>
 1489 |                 <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Search</p>
 1490 |                 <p className="text-[11px] text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
 1491 |               </div>
 1492 |             </div>
 1493 | 
 1494 |             <div className="flex gap-2">
 1495 |               <button
 1496 |                 type="button"
 1497 |                 onClick={() => setFiltersOpen((v) => !v)}
 1498 |                 className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
 1499 |               >
 1500 |                 <Filter size={16} />
 1501 |                 Filters
 1502 |               </button>
 1503 |               <button
 1504 |                 type="button"
 1505 |                 onClick={saveAlert}
 1506 |                 className="inline-flex items-center gap-2 rounded-full bg-[var(--gt-blue)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
 1507 |               >
 1508 |                 <Bell size={16} />
 1509 |                 Save search
 1510 |               </button>
 1511 |               <button
 1512 |                 type="button"
 1513 |                 onClick={handleShareClick}
 1514 |                 className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
 1515 |               >
 1516 |                 <Share2 size={16} />
 1517 |                 Share
 1518 |               </button>
 1519 |               <Link
 1520 |                 to="/notifications"
 1521 |                 className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
 1522 |               >
 1523 |                 Alerts
 1524 |               </Link>
 1525 |             </div>
 1526 |           </div>
 1527 | 
 1528 |           <div className="mt-4 flex flex-col gap-2 sm:flex-row">
 1529 |             <div className="relative flex-1">
 1530 |               <input
 1531 |                 ref={queryInputRef}
 1532 |                 value={query}
 1533 |                 onChange={(e) => setQuery(e.target.value)}
 1534 |                 placeholder="Search requests, factories, products..."
 1535 |                 className="w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1536 |               />
 1537 |               <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
 1538 |                 {isMac ? 'Cmd K' : 'Ctrl K'}
 1539 |               </span>
 1540 |             </div>
 1541 |             <button
 1542 |               type="button"
 1543 |               onClick={runSearch}
 1544 |               className="rounded-full bg-[var(--gt-blue)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95 disabled:opacity-60"
 1545 |               disabled={loading}
 1546 |             >
 1547 |               {loading ? 'Searching...' : 'Search'}
 1548 |             </button>
 1549 |           </div>
 1550 | 
 1551 |           <div className="mt-3 flex flex-wrap items-center gap-2">
 1552 |             <button
 1553 |               type="button"
 1554 |               onClick={clearCategories}
 1555 |               className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${category.length ? ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50' : ' bg-[var(--gt-blue)] text-white ring-transparent'}`}
 1556 |             >
 1557 |               All categories
 1558 |             </button>
 1559 |             {categoryOptions.map((option) => (
 1560 |               <button
 1561 |                 key={option}
 1562 |                 type="button"
 1563 |                 onClick={() => toggleCategory(option)}
 1564 |                 className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${category.includes(option) ? ' bg-[var(--gt-blue)] text-white ring-transparent' : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50'}`}
 1565 |               >
 1566 |                 {option}
 1567 |                 {Number.isFinite(Number(getFacetCount(facetCounts.category, option))) ? (
 1568 |                   <span className={`ml-1 text-[10px] ${category.includes(option) ? 'text-white/80' : 'text-slate-400'}`}>
 1569 |                     ({getFacetCount(facetCounts.category, option)})
 1570 |                   </span>
 1571 |                 ) : null}
 1572 |               </button>
 1573 |             ))}
 1574 |           </div>
 1575 | 
 1576 |           <div className="sticky top-2 z-20 mt-3 rounded-xl bg-white/90 p-2 ring-1 ring-slate-200/70 backdrop-blur dark:bg-slate-950/70 dark:ring-white/10">
 1577 |             <div className="flex flex-wrap items-center gap-2">
 1578 |               {activeFilterChips.length ? activeFilterChips.map((chip) => (
 1579 |                 <button
 1580 |                   key={chip.key}
 1581 |                   type="button"
 1582 |                   onClick={chip.onRemove}
 1583 |                   className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100"
 1584 |                 >
 1585 |                   {chip.label} ×
 1586 |                 </button>
 1587 |               )) : <span className="text-[11px] text-slate-500 dark:text-slate-400">No active filters</span>}
 1588 |               <button
 1589 |                 type="button"
 1590 |                 onClick={clearAllFilters}
 1591 |                 className="ml-auto rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 hover:bg-slate-50 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
 1592 |               >
 1593 |                 Clear all
 1594 |               </button>
 1595 |             </div>
 1596 |           </div>
 1597 | 
 1598 |           {(estimateLoading || estimateError || estimateTotals.requests !== null || estimateTotals.companies !== null) ? (
 1599 |             <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
 1600 |               {estimateLoading ? 'Estimating results...' : estimateError ? (
 1601 |                 <span className="text-rose-600">{estimateError}</span>
 1602 |               ) : (
 1603 |                 <>
 1604 |                   {activeTab === 'requests'
 1605 |                     ? `Estimated buyer requests: ${estimateTotals.requests ?? 0}`
 1606 |                     : activeTab === 'companies'
 1607 |                       ? `Estimated companies: ${estimateTotals.companies ?? 0}`
 1608 |                       : `Estimated: ${(estimateTotals.requests ?? 0)} buyer requests · ${(estimateTotals.companies ?? 0)} companies (${(estimateTotals.requests ?? 0) + (estimateTotals.companies ?? 0)} total)`}
 1609 |                 </>
 1610 |               )}
 1611 |             </div>
 1612 |           ) : null}
 1613 | 
 1614 |           {filtersOpen ? (
 1615 |             <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
 1616 |               <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
 1617 |                 <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Product</p>
 1618 |                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core filters are visible first</p>
 1619 |                 <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
 1620 |                   <select
 1621 |                     value={filters.industry}
 1622 |                     onChange={(e) => updateCoreFilter('industry', e.target.value)}
 1623 |                     className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1624 |                   >
 1625 |                     <option value="">Industry (Any)</option>
 1626 |                     {INDUSTRY_OPTIONS.map((option) => (
 1627 |                       <option key={option.value} value={option.value}>{option.label}</option>
 1628 |                     ))}
 1629 |                   </select>
 1630 |                   <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1631 |                     <p className="text-[11px] font-semibold text-slate-500">MOQ range</p>
 1632 |                     <div className="mt-2">
 1633 |                       <BucketChips
 1634 |                         options={MOQ_BUCKETS}
 1635 |                         value={filters.moqRange}
 1636 |                         onChange={(val) => {
 1637 |                           // BucketChips returns a value like "min-max" or '' for Any
 1638 |                           if (!val) updateRangeFilter('moqRange', '', '')
 1639 |                           else {
 1640 |                             const parts = String(val).split('-')
 1641 |                             const min = parts[0] || ''
 1642 |                             const max = parts[1] === undefined ? '' : parts[1]
 1643 |                             updateRangeFilter('moqRange', min, max)
 1644 |                           }
 1645 |                         }}
 1646 |                         disabled={false}
 1647 |                       />
 1648 |                     </div>
 1649 |                     <div className="mt-3">
 1650 |                       <RangeSlider
 1651 |                         min={0}
 1652 |                         max={5000}
 1653 |                         step={50}
 1654 |                         valueMin={moqRangeValues.min}
 1655 |                         valueMax={moqRangeValues.max}
 1656 |                         onChange={(min, max) => updateRangeFilter('moqRange', min, max)}
 1657 |                       />
 1658 |                     </div>
 1659 |                   </div>
 1660 |                   <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1661 |                     <p className="text-[11px] font-semibold text-slate-500">Price per unit</p>
 1662 |                     <div className="mt-2 flex items-center gap-2">
 1663 |                       <select
 1664 |                         value={filters.priceCurrency || ''}
 1665 |                         onChange={(e) => updateCoreFilter('priceCurrency', e.target.value)}
 1666 |                         className="w-28 rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1667 |                       >
 1668 |                         <option value="">Currency</option>
 1669 |                         {CURRENCY_OPTIONS.map((c) => (
 1670 |                           <option key={c} value={c}>{c}</option>
 1671 |                         ))}
 1672 |                       </select>
 1673 |                       <div className="flex-1">
 1674 |                         <RangeSlider
 1675 |                           min={0}
 1676 |                           max={200}
 1677 |                           step={1}
 1678 |                           valueMin={priceRangeValues.min}
 1679 |                           valueMax={priceRangeValues.max}
 1680 |                           onChange={(min, max) => updateRangeFilter('priceRange', min, max)}
 1681 |                           suffix=""
 1682 |                           formatValue={priceFormatter}
 1683 |                         />
 1684 |                       </div>
 1685 |                     </div>
 1686 |                   </div>
 1687 |                   <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1688 |                     <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
 1689 |                     <div className="mt-2">
 1690 |                       <ChipGroup
 1691 |                         options={INCOTERM_OPTIONS}
 1692 |                         values={filters.incoterms || []}
 1693 |                         onChange={(values) => updateCoreFilter('incoterms', values)}
 1694 |                         disabled={false}
 1695 |                         counts={facetCounts.incoterms}
 1696 |                       />
 1697 |                     </div>
 1698 |                   </div>
 1699 |                   <button
 1700 |                     type="button"
 1701 |                     onClick={() => setProductMoreOpen((prev) => !prev)}
 1702 |                     className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
 1703 |                   >
 1704 |                     {productMoreOpen ? 'Hide more filters' : 'More filters'}
 1705 |                   </button>
 1706 |                   {productMoreOpen ? (
 1707 |                     <>
 1708 |                       <input
 1709 |                         value={filters.country}
 1710 |                         onChange={(e) => updateCoreFilter('country', e.target.value)}
 1711 |                         placeholder="Country (e.g. Bangladesh)"
 1712 |                         className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1713 |                       />
 1714 |                       <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
 1715 |                         <input
 1716 |                           type="checkbox"
 1717 |                           checked={filters.verifiedOnly}
 1718 |                           onChange={(e) => updateCoreFilter('verifiedOnly', e.target.checked)}
 1719 |                           className="h-4 w-4"
 1720 |                         />
 1721 |                         Verified only
 1722 |                       </label>
 1723 |                     </>
 1724 |                   ) : null}
 1725 |                 </div>
 1726 |               </div>
 1727 | 
 1728 |               <div className={`rounded-2xl p-4 ring-1 shadow-sm${premiumLocked ? ' bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : ' bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`} data-has-advanced-url-filters={hasAdvancedFiltersFromUrl ? 'true' : 'false'}>
 1729 |                 <div className="flex items-center justify-between gap-2">
 1730 |                   <div>
 1731 |                     <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Supplier / Account</p>
 1732 |                     <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core visible first, attributes under More filters</p>
 1733 |                   </div>
 1734 |                   <button
 1735 |                     type="button"
 1736 |                     onClick={() => setSupplierMoreOpen((prev) => !prev)}
 1737 |                     className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
 1738 |                   >
 1739 |                     {supplierMoreOpen ? 'Hide more filters' : 'More filters'}
 1740 |                   </button>
 1741 |                   <button
 1742 |                     type="button"
 1743 |                     onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
 1744 |                     className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
 1745 |                   >
 1746 |                     {advancedFiltersOpen ? 'Hide advanced' : 'Advanced'}
 1747 |                   </button>
 1748 |                 </div>
 1749 | 
 1750 |                 <div className="mt-3 grid grid-cols-1 gap-2">
 1751 |                   <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1752 |                     <p className="text-[11px] font-semibold text-slate-500">Account type</p>
 1753 |                     <div className="mt-2 flex flex-wrap gap-2">
 1754 |                       {['', 'buyer', 'factory', 'buying_house'].map((value) => {
 1755 |                         const label = value === '' ? 'Any' : (value === 'buying_house' ? 'Buying House' : value.charAt(0).toUpperCase() + value.slice(1))
 1756 |                         const active = filters.orgType === value
 1757 |                         return (
 1758 |                           <button
 1759 |                             key={value || 'any'}
 1760 |                             type="button"
 1761 |                             onClick={() => updateCoreFilter('orgType', value)}
 1762 |                             className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${active ? ' bg-[var(--gt-blue)] text-white ring-transparent' : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50'}`}
 1763 |                           >
 1764 |                             {label}
 1765 |                           </button>
 1766 |                         )
 1767 |                       })}
 1768 |                     </div>
 1769 |                   </div>
 1770 |                   {supplierMoreOpen ? (
 1771 |                     <select
 1772 |                       value={filters.leadTimeMax}
 1773 |                       onChange={(e) => updateCoreFilter('leadTimeMax', e.target.value)}
 1774 |                       className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1775 |                     >
 1776 |                       <option value="">Lead time (Any)</option>
 1777 |                       <option value="7">Lead time &lt;= 7 days</option>
 1778 |                       <option value="14">Lead time &lt;= 14 days</option>
 1779 |                       <option value="30">Lead time &lt;= 30 days</option>
 1780 |                       <option value="60">Lead time &lt;= 60 days</option>
 1781 |                       <option value="90">Lead time &lt;= 90 days</option>
 1782 |                     </select>
 1783 |                   ) : null}
 1784 |                 </div>
 1785 | 
 1786 |                 {advancedFiltersOpen ? (
 1787 |                   <div className="mt-3 grid grid-cols-1 gap-2">
 1788 |                     <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
 1789 |                       <input
 1790 |                         type="checkbox"
 1791 |                         checked={filters.priorityOnly}
 1792 |                         onChange={(e) => updatePriorityFilter(e.target.checked)}
 1793 |                         className="h-4 w-4"
 1794 |                       />
 1795 |                       Priority only
 1796 |                       {!priorityAllowedForTab ? (
 1797 |                         <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
 1798 |                           Premium
 1799 |                         </span>
 1800 |                       ) : null}
 1801 |                     </label>
 1802 |                     <div className="flex flex-wrap gap-2 rounded-full bg-slate-50 p-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
 1803 |                       <button
 1804 |                         type="button"
 1805 |                         onClick={() => setFilterMode('product')}
 1806 |                         className={`rounded-full px-3 py-1 ${filterMode === 'product' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
 1807 |                       >
 1808 |                         Product Filters
 1809 |                       </button>
 1810 |                       <button
 1811 |                         type="button"
 1812 |                         onClick={() => setFilterMode('supplier')}
 1813 |                         className={`rounded-full px-3 py-1 ${filterMode === 'supplier' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
 1814 |                       >
 1815 |                         Supplier Filters
 1816 |                       </button>
 1817 |                     </div>
 1818 |                     <button
 1819 |                       type="button"
 1820 |                       onClick={() => (filterMode === 'product' ? setProductAdvancedOpen((prev) => !prev) : setSupplierAdvancedOpen((prev) => !prev))}
 1821 |                       className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
 1822 |                     >
 1823 |                       {(filterMode === 'product' ? productAdvancedOpen : supplierAdvancedOpen) ? 'Hide advanced block' : 'Open advanced block'}
 1824 |                     </button>
 1825 | 
 1826 |                     {filterMode === 'product' ? (
 1827 |                       productAdvancedOpen ? (
 1828 |                       <>
 1829 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1830 |                           <p className="text-[11px] font-semibold text-slate-500">Fabric type</p>
 1831 |                           <div className="mt-2">
 1832 |                             <ChipGroup
 1833 |                               options={FABRIC_TYPE_OPTIONS}
 1834 |                               values={filters.fabricType}
 1835 |                               onChange={(values) => updateAdvancedFilter('fabricType', values)}
 1836 |                               disabled={premiumLocked}
 1837 |                               counts={facetCounts.fabricType}
 1838 |                             />
 1839 |                           </div>
 1840 |                         </div>
 1841 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1842 |                           <p className="text-[11px] font-semibold text-slate-500">GSM / Weight</p>
 1843 |                           <div className="mt-2">
 1844 |                             <RangeSlider
 1845 |                               min={80}
 1846 |                               max={600}
 1847 |                               step={10}
 1848 |                               valueMin={filters.gsmMin}
 1849 |                               valueMax={filters.gsmMax}
 1850 |                               onChange={(min, max) => {
 1851 |                                 updateAdvancedFilter('gsmMin', min)
 1852 |                                 updateAdvancedFilter('gsmMax', max)
 1853 |                               }}
 1854 |                               disabled={premiumLocked}
 1855 |                             />
 1856 |                           </div>
 1857 |                         </div>
 1858 |                         <select
 1859 |                           value={filters.sizeRange}
 1860 |                           onChange={(e) => updateAdvancedFilter('sizeRange', e.target.value)}
 1861 |                           disabled={premiumLocked}
 1862 |                           className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1863 |                         >
 1864 |                           <option value="">Size range (Any)</option>
 1865 |                           {SIZE_RANGE_OPTIONS.map((option) => (
 1866 |                             <option key={option} value={option}>{option}</option>
 1867 |                           ))}
 1868 |                         </select>
 1869 |                         {filters.sizeRange === 'Custom' ? (
 1870 |                           <div className="mt-2">
 1871 |                             <input
 1872 |                               value={filters.sizeRangeCustom || ''}
 1873 |                               onChange={(e) => updateAdvancedFilter('sizeRangeCustom', e.target.value)}
 1874 |                               placeholder="Custom sizes (e.g. Chest:32-40; Waist:28-36)"
 1875 |                               disabled={premiumLocked}
 1876 |                               className="w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1877 |                             />
 1878 |                           </div>
 1879 |                         ) : null}
 1880 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1881 |                           <p className="text-[11px] font-semibold text-slate-500">Color / Pantone</p>
 1882 |                           <div className="mt-2 flex flex-wrap gap-2">
 1883 |                             {(filters.colorPantone || []).map((code) => (
 1884 |                               <button
 1885 |                                 key={code}
 1886 |                                 type="button"
 1887 |                                 onClick={() => removePantone(code)}
 1888 |                                 className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700"
 1889 |                               >
 1890 |                                 {code} ×
 1891 |                               </button>
 1892 |                             ))}
 1893 |                           </div>
 1894 |                           <div className="mt-2 flex gap-2">
 1895 |                             <input
 1896 |                               value={pantoneDraft}
 1897 |                               onChange={(e) => setPantoneDraft(e.target.value)}
 1898 |                               placeholder="Add Pantone (e.g. 19-4052)"
 1899 |                               disabled={premiumLocked}
 1900 |                               className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1901 |                               onKeyDown={(event) => {
 1902 |                                 if (event.key === 'Enter') {
 1903 |                                   event.preventDefault()
 1904 |                                   addPantone(pantoneDraft)
 1905 |                                 }
 1906 |                               }}
 1907 |                             />
 1908 |                             <button
 1909 |                               type="button"
 1910 |                               onClick={() => addPantone(pantoneDraft)}
 1911 |                               disabled={premiumLocked}
 1912 |                               className="rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
 1913 |                             >
 1914 |                               Add
 1915 |                             </button>
 1916 |                           </div>
 1917 |                         </div>
 1918 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1919 |                           <p className="text-[11px] font-semibold text-slate-500">Customization</p>
 1920 |                           <div className="mt-2 space-y-2">
 1921 |                             {CUSTOMIZATION_OPTIONS.map((opt) => {
 1922 |                               const checked = Array.isArray(filters.customization) && filters.customization.includes(opt)
 1923 |                               return (
 1924 |                                 <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
 1925 |                                   <input
 1926 |                                     type="checkbox"
 1927 |                                     checked={checked}
 1928 |                                     disabled={premiumLocked}
 1929 |                                     onChange={() => {
 1930 |                                       const next = checked
 1931 |                                         ? (filters.customization || []).filter((c) => c !== opt)
 1932 |                                         : [...(filters.customization || []), opt]
 1933 |                                       updateAdvancedFilter('customization', next)
 1934 |                                     }}
 1935 |                                     className="h-4 w-4"
 1936 |                                   />
 1937 |                                   {opt}
 1938 |                                 </label>
 1939 |                               )
 1940 |                             })}
 1941 |                           </div>
 1942 |                         </div>
 1943 |                         <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
 1944 |                           <input
 1945 |                             type="checkbox"
 1946 |                             checked={filters.sampleAvailable}
 1947 |                             onChange={(e) => updateAdvancedFilter('sampleAvailable', e.target.checked)}
 1948 |                             disabled={premiumLocked}
 1949 |                             className="h-4 w-4"
 1950 |                           />
 1951 |                           Sample available
 1952 |                         </label>
 1953 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1954 |                           <div className="flex items-center justify-between gap-3">
 1955 |                             <p className="text-[11px] font-semibold text-slate-500">Sample lead time (days)</p>
 1956 |                             <button
 1957 |                               type="button"
 1958 |                               onClick={() => updateAdvancedFilter('sampleLeadTime', '')}
 1959 |                               disabled={premiumLocked || !filters.sampleLeadTime}
 1960 |                               className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-60 dark:text-slate-300 dark:hover:text-slate-200"
 1961 |                             >
 1962 |                               Clear
 1963 |                             </button>
 1964 |                           </div>
 1965 |                           <div className="mt-2 flex items-center gap-3">
 1966 |                             <input
 1967 |                               type="range"
 1968 |                               min="0"
 1969 |                               max={String(SAMPLE_LEAD_TIME_MAX_DAYS)}
 1970 |                               step="1"
 1971 |                               value={Number.isFinite(Number(filters.sampleLeadTime)) ? Number(filters.sampleLeadTime) : SAMPLE_LEAD_TIME_MAX_DAYS}
 1972 |                               onChange={(e) => updateAdvancedFilter('sampleLeadTime', e.target.value)}
 1973 |                               disabled={premiumLocked}
 1974 |                               className="w-full"
 1975 |                             />
 1976 |                             <input
 1977 |                               type="number"
 1978 |                               min="0"
 1979 |                               max={String(SAMPLE_LEAD_TIME_MAX_DAYS)}
 1980 |                               value={filters.sampleLeadTime}
 1981 |                               onChange={(e) => updateAdvancedFilter('sampleLeadTime', e.target.value)}
 1982 |                               placeholder="Any"
 1983 |                               disabled={premiumLocked}
 1984 |                               className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1985 |                             />
 1986 |                           </div>
 1987 |                           <div className="mt-1 text-[10px] text-slate-400">
 1988 |                             {filters.sampleLeadTime ? `Up to ${filters.sampleLeadTime} days` : 'Any (move slider to set)'}
 1989 |                           </div>
 1990 |                         </div>
 1991 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1992 |                           <p className="text-[11px] font-semibold text-slate-500">Certifications</p>
 1993 |                           <div className="mt-2">
 1994 |                             <ChipGroup
 1995 |                               options={CERTIFICATION_OPTIONS}
 1996 |                               values={filters.certifications}
 1997 |                               onChange={(values) => updateAdvancedFilter('certifications', values)}
 1998 |                               disabled={premiumLocked}
 1999 |                               counts={facetCounts.certifications}
 2000 |                             />
 2001 |                           </div>
 2002 |                         </div>
 2003 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2004 |                           <p className="text-[11px] font-semibold text-slate-500">Last audit date</p>
 2005 |                           <input
 2006 |                             type="date"
 2007 |                             value={filters.auditDate}
 2008 |                             onChange={(e) => updateAdvancedFilter('auditDate', e.target.value)}
 2009 |                             disabled={premiumLocked}
 2010 |                             className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 2011 |                           />
 2012 |                         </div>
 2013 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2014 |                           <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
 2015 |                           <div className="mt-2">
 2016 |                             <ChipGroup
 2017 |                               options={INCOTERM_OPTIONS}
 2018 |                               values={filters.incoterms}
 2019 |                               onChange={(values) => updateAdvancedFilter('incoterms', values)}
 2020 |                               disabled={premiumLocked}
 2021 |                               counts={facetCounts.incoterms}
 2022 |                             />
 2023 |                           </div>
 2024 |                         </div>
 2025 |                       </>
 2026 |                       ) : <p className="text-[11px] text-slate-500">Open advanced block to configure product attributes.</p>
 2027 |                     ) : (
 2028 |                       supplierAdvancedOpen ? (
 2029 |                       <>
 2030 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2031 |                           <p className="text-[11px] font-semibold text-slate-500">Payment terms</p>
 2032 |                           <div className="mt-2">
 2033 |                             <ChipGroup
 2034 |                               options={PAYMENT_OPTIONS}
 2035 |                               values={filters.paymentTerms}
 2036 |                               onChange={(values) => updateAdvancedFilter('paymentTerms', values)}
 2037 |                               disabled={premiumLocked}
 2038 |                               counts={facetCounts.paymentTerms}
 2039 |                             />
 2040 |                           </div>
 2041 |                         </div>
 2042 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2043 |                           <p className="text-[11px] font-semibold text-slate-500">Document readiness</p>
 2044 |                           <div className="mt-2">
 2045 |                             <ChipGroup
 2046 |                               options={DOCUMENT_READY_OPTIONS}
 2047 |                               values={filters.documentReady}
 2048 |                               onChange={(values) => updateAdvancedFilter('documentReady', values)}
 2049 |                               disabled={premiumLocked}
 2050 |                               counts={facetCounts.documentReady}
 2051 |                             />
 2052 |                           </div>
 2053 |                         </div>
 2054 |                         
 2055 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2056 |                           <div className="flex items-center justify-between gap-3">
 2057 |                             <p className="text-[11px] font-semibold text-slate-500">Audit score (min)</p>
 2058 |                             <button
 2059 |                               type="button"
 2060 |                               onClick={() => updateAdvancedFilter('auditScoreMin', '')}
 2061 |                               disabled={premiumLocked || !filters.auditScoreMin}
 2062 |                               className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-60"
 2063 |                             >
 2064 |                               Clear
 2065 |                             </button>
 2066 |                           </div>
 2067 |                           <div className="mt-2 flex items-center gap-3">
 2068 |                             <input
 2069 |                               type="range"
 2070 |                               min="0"
 2071 |                               max="100"
 2072 |                               step="1"
 2073 |                               value={Number(filters.auditScoreMin || 0)}
 2074 |                               onChange={(e) => updateAdvancedFilter('auditScoreMin', e.target.value)}
 2075 |                               disabled={premiumLocked}
 2076 |                               className="w-full"
 2077 |                             />
 2078 |                             <input
 2079 |                               type="number"
 2080 |                               min="0"
 2081 |                               max="100"
 2082 |                               value={filters.auditScoreMin}
 2083 |                               onChange={(e) => updateAdvancedFilter('auditScoreMin', e.target.value)}
 2084 |                               placeholder="Any"
 2085 |                               disabled={premiumLocked}
 2086 |                               className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 2087 |                             />
 2088 |                           </div>
 2089 |                           <div className="mt-1 text-[10px] text-slate-400">
 2090 |                             {filters.auditScoreMin ? `Min score: ${filters.auditScoreMin}` : 'Any (move slider to set)'}
 2091 |                           </div>
 2092 |                         </div>
 2093 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2094 |                           <p className="text-[11px] font-semibold text-slate-500">Language support</p>
 2095 |                           <div className="mt-2">
 2096 |                             <ChipGroup
 2097 |                               options={LANGUAGE_OPTIONS}
 2098 |                               values={filters.languageSupport}
 2099 |                               onChange={(values) => updateAdvancedFilter('languageSupport', values)}
 2100 |                               disabled={premiumLocked}
 2101 |                               counts={facetCounts.languageSupport}
 2102 |                             />
 2103 |                           </div>
 2104 |                         </div>
 2105 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2106 |                           <p className="text-[11px] font-semibold text-slate-500">Production capacity (units/month)</p>
 2107 |                           <div className="mt-2 flex items-center gap-3">
 2108 |                             <input
 2109 |                               type="range"
 2110 |                               min="0"
 2111 |                               max="100000"
 2112 |                               step="500"
 2113 |                               value={Number(filters.capacityMin || 0)}
 2114 |                               onChange={(e) => updateAdvancedFilter('capacityMin', e.target.value)}
 2115 |                               disabled={premiumLocked}
 2116 |                               className="w-full"
 2117 |                             />
 2118 |                             <span className="text-[11px] font-semibold">{filters.capacityMin || 0}</span>
 2119 |                           </div>
 2120 |                         </div>
 2121 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2122 |                           <p className="text-[11px] font-semibold text-slate-500">Main processes</p>
 2123 |                           <div className="mt-2">
 2124 |                             <ChipGroup
 2125 |                               options={PROCESS_OPTIONS}
 2126 |                               values={filters.processes}
 2127 |                               onChange={(values) => updateAdvancedFilter('processes', values)}
 2128 |                               disabled={premiumLocked}
 2129 |                               counts={facetCounts.processes}
 2130 |                             />
 2131 |                           </div>
 2132 |                         </div>
 2133 |                         <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
 2134 |                           <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2135 |                             <p className="text-[11px] font-semibold text-slate-500">Years in business (min)</p>
 2136 |                             <div className="mt-2">
 2137 |                               <BucketChips
 2138 |                                 options={YEARS_IN_BUSINESS_MIN_BUCKETS}
 2139 |                                 value={filters.yearsInBusinessMin}
 2140 |                                 onChange={(value) => updateAdvancedFilter('yearsInBusinessMin', value)}
 2141 |                                 disabled={premiumLocked}
 2142 |                               />
 2143 |                             </div>
 2144 |                           </div>
 2145 |                           <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2146 |                             <p className="text-[11px] font-semibold text-slate-500">Avg response time (max)</p>
 2147 |                             <div className="mt-2">
 2148 |                               <BucketChips
 2149 |                                 options={RESPONSE_TIME_MAX_BUCKETS}
 2150 |                                 value={filters.responseTimeMax}
 2151 |                                 onChange={(value) => updateAdvancedFilter('responseTimeMax', value)}
 2152 |                                 disabled={premiumLocked}
 2153 |                               />
 2154 |                             </div>
 2155 |                           </div>
 2156 |                         </div>
 2157 |                         <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
 2158 |                           <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2159 |                             <p className="text-[11px] font-semibold text-slate-500">Team seats (min)</p>
 2160 |                             <div className="mt-2">
 2161 |                               <BucketChips
 2162 |                                 options={TEAM_SEATS_MIN_BUCKETS}
 2163 |                                 value={filters.teamSeatsMin}
 2164 |                                 onChange={(value) => updateAdvancedFilter('teamSeatsMin', value)}
 2165 |                                 disabled={premiumLocked}
 2166 |                               />
 2167 |                             </div>
 2168 |                           </div>
 2169 |                           <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
 2170 |                             <input
 2171 |                               type="checkbox"
 2172 |                               checked={Boolean(filters.hasPermissionMatrix)}
 2173 |                               onChange={(e) => updateAdvancedFilter('hasPermissionMatrix', e.target.checked)}
 2174 |                               disabled={premiumLocked}
 2175 |                               className="h-4 w-4"
 2176 |                             />
 2177 |                             Has role-based access (permission matrix)
 2178 |                           </label>
 2179 |                           <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2180 |                             <p className="text-[11px] font-semibold text-slate-500">Permission area</p>
 2181 |                             <select
 2182 |                               value={filters.permissionSection || ''}
 2183 |                               onChange={(e) => updateAdvancedFilter('permissionSection', e.target.value)}
 2184 |                               disabled={premiumLocked}
 2185 |                               className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 2186 |                             >
 2187 |                               <option value="">Any (permission)</option>
 2188 |                               <option value="requests">Requests</option>
 2189 |                               <option value="products">Products</option>
 2190 |                               <option value="analytics">Analytics</option>
 2191 |                               <option value="members">Members</option>
 2192 |                               <option value="documents">Documents</option>
 2193 |                             </select>
 2194 |                             <label className="mt-2 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
 2195 |                               <input
 2196 |                                 type="checkbox"
 2197 |                                 checked={Boolean(filters.permissionSectionEdit)}
 2198 |                                 onChange={(e) => updateAdvancedFilter('permissionSectionEdit', e.target.checked)}
 2199 |                                 disabled={premiumLocked}
 2200 |                                 className="h-4 w-4"
 2201 |                               />
 2202 |                               Require edit access
 2203 |                             </label>
 2204 |                           </div>
 2205 |                           <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2206 |                             <p className="text-[11px] font-semibold text-slate-500">Role seats</p>
 2207 |                             <div className="mt-2">
 2208 |                               <div className="flex gap-2">
 2209 |                                 <input
 2210 |                                   type="text"
 2211 |                                   placeholder="Role (e.g., manager)"
 2212 |                                   value={roleSeatDraftRole}
 2213 |                                   onChange={(e) => setRoleSeatDraftRole(e.target.value)}
 2214 |                                   disabled={premiumLocked}
 2215 |                                   className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 2216 |                                 />
 2217 |                                 <input
 2218 |                                   type="number"
 2219 |                                   min="0"
 2220 |                                   placeholder="Seats"
 2221 |                                   value={roleSeatDraftSeats}
 2222 |                                   onChange={(e) => setRoleSeatDraftSeats(e.target.value)}
 2223 |                                   disabled={premiumLocked}
 2224 |                                   className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 2225 |                                 />
 2226 |                                 <button
 2227 |                                   type="button"
 2228 |                                   onClick={addRoleSeat}
 2229 |                                   disabled={premiumLocked || !roleSeatDraftRole}
 2230 |                                   className="rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
 2231 |                                 >
 2232 |                                   Add
 2233 |                                 </button>
 2234 |                               </div>
 2235 |                               <div className="mt-2 space-y-1">
 2236 |                                 {Array.isArray(filters.roleSeats) && filters.roleSeats.length ? (
 2237 |                                   filters.roleSeats.map((entry) => (
 2238 |                                     <div key={entry.role} className="flex items-center justify-between">
 2239 |                                       <div className="text-[11px] text-slate-700">{entry.role}: {entry.seats || 0} seats</div>
 2240 |                                       <div>
 2241 |                                         <button
 2242 |                                           type="button"
 2243 |                                           onClick={() => updateAdvancedFilter('roleSeats', (filters.roleSeats || []).filter((e) => e.role !== entry.role))}
 2244 |                                           disabled={premiumLocked}
 2245 |                                           className="rounded-full px-2 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30"
 2246 |                                         >
 2247 |                                           Remove
 2248 |                                         </button>
 2249 |                                       </div>
 2250 |                                     </div>
 2251 |                                   ))
 2252 |                                 ) : (
 2253 |                                   <div className="text-[11px] text-slate-400">No role seat filters</div>
 2254 |                                 )}
 2255 |                               </div>
 2256 |                             </div>
 2257 |                           </div>
 2258 |                           <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2259 |                             <p className="text-[11px] font-semibold text-slate-500">Export ports</p>
 2260 |                             <div className="mt-2">
 2261 |                               <ChipGroup
 2262 |                                 options={EXPORT_PORT_OPTIONS}
 2263 |                                 values={filters.exportPort}
 2264 |                                 onChange={(values) => updateAdvancedFilter('exportPort', values)}
 2265 |                                 disabled={premiumLocked}
 2266 |                                 counts={facetCounts.exportPort}
 2267 |                               />
 2268 |                             </div>
 2269 |                           </div>
 2270 |                         </div>
 2271 |                         <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
 2272 |                           <input
 2273 |                             type="checkbox"
 2274 |                             checked={filters.handlesMultipleFactories}
 2275 |                             onChange={(e) => updateAdvancedFilter('handlesMultipleFactories', e.target.checked)}
 2276 |                             disabled={premiumLocked}
 2277 |                             className="h-4 w-4"
 2278 |                           />
 2279 |                           Handles multiple factories
 2280 |                         </label>
 2281 |                         <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2282 |                           <p className="text-[11px] font-semibold text-slate-500">Location + radius</p>
 2283 |                           <div className="mt-2 flex gap-2">
 2284 |                             <input
 2285 |                               value={geoQuery}
 2286 |                               onChange={(e) => setGeoQuery(e.target.value)}
 2287 |                               placeholder="Search city or country"
 2288 |                               disabled={premiumLocked}
 2289 |                               className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 2290 |                             />
 2291 |                             <button
 2292 |                               type="button"
 2293 |                               onClick={useCurrentLocation}
 2294 |                               disabled={premiumLocked}
 2295 |                               className="rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
 2296 |                             >
 2297 |                               Use my location
 2298 |                             </button>
 2299 |                           </div>
 2300 |                           {geoLoading ? <div className="mt-2 text-[10px] text-slate-500">Searching locations...</div> : null}
 2301 |                           {geoError ? <div className="mt-2 text-[10px] text-rose-600">{geoError}</div> : null}
 2302 |                           {geoResults.length ? (
 2303 |                             <div className="mt-2 max-h-32 space-y-1 overflow-auto rounded-lg borderless-shadow bg-white p-2">
 2304 |                               {geoResults.map((result) => (
 2305 |                                 <button
 2306 |                                   key={result.id}
 2307 |                                   type="button"
 2308 |                                   onClick={() => selectGeoResult(result)}
 2309 |                                   className="w-full text-left text-[11px] text-slate-700 hover:text-[var(--gt-blue)]"
 2310 |                                 >
 2311 |                                   {result.label}
 2312 |                                 </button>
 2313 |                               ))}
 2314 |                             </div>
 2315 |                           ) : null}
 2316 |                           {locationLabel ? (
 2317 |                             <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
 2318 |                               Selected: {locationLabel}
 2319 |                             </div>
 2320 |                           ) : null}
 2321 |                           <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
 2322 |                             <span>Lat: {filters.locationLat || '--'} · Lng: {filters.locationLng || '--'}</span>
 2323 |                             <button
 2324 |                               type="button"
 2325 |                               onClick={() => setShowMapPreview((prev) => !prev)}
 2326 |                               className="text-[10px] font-semibold text-[var(--gt-blue)]"
 2327 |                             >
 2328 |                               {showMapPreview ? 'Hide map' : 'Show map'}
 2329 |                             </button>
 2330 |                           </div>
 2331 |                           <div className="mt-2 flex items-center gap-3">
 2332 |                             <input
 2333 |                               type="range"
 2334 |                               min="0"
 2335 |                               max="2000"
 2336 |                               step="50"
 2337 |                               value={Number(filters.distanceKm || 0)}
 2338 |                               onChange={(e) => updateAdvancedFilter('distanceKm', e.target.value)}
 2339 |                               disabled={premiumLocked}
 2340 |                               className="w-full"
 2341 |                             />
 2342 |                             <span className="text-[11px] font-semibold">{filters.distanceKm || 0}km</span>
 2343 |                           </div>
 2344 |                           {showMapPreview && filters.locationLat && filters.locationLng ? (
 2345 |                             <div className="mt-2 h-36 overflow-hidden rounded-lg borderless-shadow">
 2346 |                               <div ref={mapRef} className="h-full w-full" />
 2347 |                             </div>
 2348 |                           ) : null}
 2349 |                         </div>
 2350 |                       </>
 2351 |                       ) : <p className="text-[11px] text-slate-500">Open advanced block to configure supplier/account attributes.</p>
 2352 |                     )}
 2353 |                   </div>
 2354 |                 ) : (
 2355 |                   <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Advanced filters are hidden to keep search simple. Use "More filters" when needed.</p>
 2356 |                 )}
 2357 |               </div>
 2358 | 
 2359 |               <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
 2360 |                 <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Filter guidance</p>
 2361 |                 <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
 2362 |                   <p>Supplier filters use profile data such as main processes, export ports, and years in business.</p>
 2363 |                   <p>Distance radius uses coordinates. Use “Use my location” to fill lat/lng quickly. If a supplier has no coordinates, we fall back to country matching.</p>
 2364 |                   <p>Premium filters are optional. Core filters always remain free and unlimited.</p>
 2365 |                 </div>
 2366 |               </div>
 2367 | 
 2368 |               <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
 2369 |                 <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status & presets</p>
 2370 |                 <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
 2371 |                   {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
 2372 |                   {upgradePrompt ? <p className="text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2">{upgradePrompt}</p> : null}
 2373 |                   {alertFeedback ? <p className="text-sky-800 bg-sky-50 borderless-shadow rounded-xl p-2">{alertFeedback}</p> : null}
 2374 |                 </div>
 2375 | 
 2376 |                 <div className="mt-4">
 2377 |                   <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Apply preset</p>
 2378 |                   <div className="mt-2 flex flex-wrap gap-2">
 2379 |                     <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
 2380 |                     <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
 2381 |                     <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
 2382 |                   </div>
 2383 |                 </div>
 2384 | 
 2385 |                 <div className="mt-3">
 2386 |                   <button type="button" onClick={() => setManagePresetsOpen((p) => !p)} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Manage presets</button>
 2387 |                   {managePresetsOpen ? (
 2388 |                     <div className="mt-2 space-y-2">
 2389 |                       {listLocalPresets().length ? listLocalPresets().map((p) => (
 2390 |                         <div key={p.key} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70">
 2391 |                           <div className="min-w-0 text-xs text-slate-700">{p.key.replace('_', ' ')} preset</div>
 2392 |                           <div className="flex gap-2">
 2393 |                             <button type="button" onClick={() => applyPreset(p.key)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
 2394 |                             <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
 2395 |                             <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
 2396 |                             <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
 2397 |                           </div>
 2398 |                         </div>
 2399 |                       )) : (
 2400 |                         <div className="text-xs text-slate-500">No local presets saved. Use the preset buttons above to save one.</div>
 2401 |                       )}
 2402 | 
 2403 |                       <div className="pt-2 border-t" />
 2404 | 
 2405 |                       <div>
 2406 |                         <p className="text-xs font-semibold text-slate-500">Server presets</p>
 2407 |                         <div className="mt-2 space-y-2">
 2408 |                           {serverPresetsLoading ? (
 2409 |                             <div className="text-xs text-slate-500">Loading server presets...</div>
 2410 |                           ) : (serverPresets.length ? serverPresets.map((sp) => (
 2411 |                             <div key={sp.id} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70">
 2412 |                               <div className="min-w-0 text-xs text-slate-700">{sp.name}{String(sp.owner_id) === String(sessionUser?.id) ? ' (you)' : ''}</div>
 2413 |                               <div className="flex gap-2">
 2414 |                                 <button type="button" onClick={() => applyServerPreset(sp)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
 2415 |                                 {String(sp.owner_id) === String(sessionUser?.id) ? (
 2416 |                                   <>
 2417 |                                     <button type="button" onClick={() => updateServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Save</button>
 2418 |                                     <button type="button" onClick={() => deleteServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
 2419 |                                   </>
 2420 |                                 ) : null}
 2421 |                               </div>
 2422 |                             </div>
 2423 |                           )) : (
 2424 |                             <div className="text-xs text-slate-500">No server presets. Save your current search to create one.</div>
 2425 |                           ))}
 2426 | 
 2427 |                           <div className="mt-2">
 2428 |                             <button type="button" onClick={() => {
 2429 |                               const name = window.prompt('Preset name')
 2430 |                               if (name) createServerPresetFromCurrent(name)
 2431 |                             }} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Save current as server preset</button>
 2432 |                           </div>
 2433 |                         </div>
 2434 |                       </div>
 2435 |                     </div>
 2436 |                   ) : null}
 2437 |                 </div>
 2438 | 
 2439 |                 {autoSaveCandidate ? (
 2440 |                   <div className="mt-4 rounded-xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-white/5 dark:text-slate-200">
 2441 |                     <p className="font-semibold text-slate-700 dark:text-slate-100">Save this search as a preset</p>
 2442 |                     <div className="mt-2 flex flex-wrap gap-2">
 2443 |                       <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
 2444 |                       <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
 2445 |                       <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
 2446 |                       <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
 2447 |                     </div>
 2448 |                   </div>
 2449 |                 ) : null}
 2450 |               </div>
 2451 |             </div>
 2452 |           ) : null}
 2453 |         </div>
 2454 | 
 2455 |         <div className="mt-5 grid grid-cols-12 gap-4">
 2456 |           <div className="col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10">
 2457 |             <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
 2458 |               {TAB_OPTIONS.map((t) => {
 2459 |                 const Icon = t.icon
 2460 |                 const active = activeTab === t.id
 2461 |                 const count = t.id === 'requests' ? requestsTotal : t.id === 'companies' ? companiesTotal : totalResults
 2462 |                 return (
 2463 |                   <motion.button
 2464 |                     key={t.id}
 2465 |                     type="button"
 2466 |                     onClick={() => setActiveTab(t.id)}
 2467 |                     whileTap={reduceMotion ? undefined : { scale: 0.98 }}
 2468 |                     className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ring-1${
 2469 |                       active
 2470 |                         ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
 2471 |                         : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
 2472 |                     }`}
 2473 |                   >
 2474 |                     {active ? (
 2475 |                       <motion.span
 2476 |                         layoutId="search-tab"
 2477 |                         className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
 2478 |                         transition={{ type: 'spring', stiffness: 420, damping: 34 }}
 2479 |                       />
 2480 |                     ) : null}
 2481 |                     <span className="relative inline-flex items-center gap-2">
 2482 |                       <Icon size={16} />
 2483 |                       <span>{t.label}</span>
 2484 |                       <span className="text-[11px] opacity-70">({count})</span>
 2485 |                     </span>
 2486 |                   </motion.button>
 2487 |                 )
 2488 |               })}
 2489 |             </div>
 2490 | 
 2491 |             <div className="p-4">
 2492 |             {loading ? (
 2493 |               <div className="space-y-3">
 2494 |                 {Array.from({ length: 6 }).map((_, i) => (
 2495 |                   <ResultSkeletonCard key={`result-skel-${i}`} index={i} />
 2496 |                 ))}
 2497 |               </div>
 2498 |             ) : null}
 2499 | 
 2500 |             {!loading && error ? (
 2501 |               <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 text-center ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30">
 2502 |                 {error}
 2503 |               </div>
 2504 |             ) : null}
 2505 | 
 2506 |             {!loading && !error && totalResults === 0 ? (
 2507 |               <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-700 text-center ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 2508 |                 No results found. Try a different query or category.
 2509 |               </div>
 2510 |             ) : null}
 2511 | 
 2512 |             {!loading && !error ? (
 2513 |               <div className="space-y-4">
 2514 |                 {(activeTab === 'all' || activeTab === 'requests') ? (
 2515 |                   <div className="space-y-3">
 2516 |                     {requests.map((r, idx) => {
 2517 |                       const author = r.author || {}
 2518 |                       const profileRoute = roleToProfileRoute(author.role, author.id)
 2519 |                       const requestType = String(r.request_type || 'garments').toLowerCase()
 2520 |                       const specs = r.specs && typeof r.specs === 'object' ? r.specs : {}
 2521 |                       const isCertified = String(author.order_certification_status || '').toLowerCase() === 'certified'
 2522 |                       const quoteDeadline = r.quote_deadline ? new Date(r.quote_deadline) : null
 2523 |                       const expiresAt = r.expires_at ? new Date(r.expires_at) : null
 2524 |                       const isExpired = expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < Date.now()
 2525 |                       const maxSuppliers = Number.isFinite(Number(r.max_suppliers)) ? Number(r.max_suppliers) : null
 2526 |                       const specLabel = requestType === 'textile'
 2527 |                         ? [specs.material_type || r.category, specs.unit || ''].filter(Boolean).join(' - ')
 2528 |                         : [specs.gender_target || '', specs.season || ''].filter(Boolean).join(' - ')
 2529 |                       return (
 2530 |                         <motion.div
 2531 |                           key={r.id}
 2532 |                           initial={reduceMotion ? false : { opacity: 0, y: 20 }}
 2533 |                           animate={reduceMotion ? false : { opacity: 1, y: 0 }}
 2534 |                           transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
 2535 |                           className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800"
 2536 |                         >
 2537 |                           <div className="flex items-start justify-between gap-3">
 2538 |                             <div className="min-w-0">
 2539 |                               <div className="flex items-center gap-2">
 2540 |                                 <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
 2541 |                                   {author.name || 'Buyer'}
 2542 |                                 </Link>
 2543 |                                 <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600 dark:bg-white/10 dark:text-slate-200">
 2544 |                                   {requestType}
 2545 |                                 </span>
 2546 |                                 {r.verified_only ? (
 2547 |                                   <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
 2548 |                                     Verified only
 2549 |                                   </span>
 2550 |                                 ) : null}
 2551 |                                 {r.discussion_active ? (
 2552 |                                   <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
 2553 |                                     Active discussion
 2554 |                                   </span>
 2555 |                                 ) : null}
 2556 |                                 {author.verified ? (
 2557 |                                   <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
 2558 |                                     Verified
 2559 |                                   </span>
 2560 |                                 ) : null}
 2561 |                                 {isCertified ? (
 2562 |                                   <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
 2563 |                                     Certified
 2564 |                                   </span>
 2565 |                                 ) : null}
 2566 |                                 {r.priority_active ? (
 2567 |                                   <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
 2568 |                                     Priority
 2569 |                                   </span>
 2570 |                                 ) : null}
 2571 |                                 {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
 2572 |                               </div>
 2573 |                               {(specLabel || quoteDeadline || expiresAt) ? (
 2574 |                                 <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
 2575 |                                   {specLabel ? <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">{specLabel}</span> : null}
 2576 |                                   {quoteDeadline ? <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">Quote by {quoteDeadline.toLocaleDateString()}</span> : null}
 2577 |                                   {expiresAt ? (
 2578 |                                     <span className={`rounded-full px-2 py-1${isExpired ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'}`}>
 2579 |                                       {isExpired ? 'Expired' : `Expires ${expiresAt.toLocaleDateString()}`}
 2580 |                                     </span>
 2581 |                                   ) : null}
 2582 |                                   {maxSuppliers !== null ? (
 2583 |                                     <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">Max suppliers: {maxSuppliers}</span>
 2584 |                                   ) : null}
 2585 |                                 </div>
 2586 |                               ) : null}
 2587 |                               <p className="mt-2 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{r.custom_description || ''}</p>
 2588 |                               <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
 2589 |                                 <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.category || '-'}</span></div>
 2590 |                                 <div>Quantity/MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.quantity || '-'}</span></div>
 2591 |                                 <div>Timeline: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.timeline_days || '-'}</span></div>
 2592 |                                 <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.material || '-'}</span></div>
 2593 |                               </div>
 2594 |                             </div>
 2595 |                             <div className="flex flex-col gap-2 shrink-0">
 2596 |                               <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
 2597 |                                 Open profile
 2598 |                               </Link>
 2599 |                               <button
 2600 |                                 type="button"
 2601 |                                 onClick={() => openChatNotice(author.name || 'buyer', {
 2602 |                                   type: 'buyer_request',
 2603 |                                   id: r.id,
 2604 |                                   label: r.title || r.category || 'Buyer request',
 2605 |                                 }, { requirementId: r.id })}
 2606 |                                 className="rounded-full bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
 2607 |                               >
 2608 |                                 Contact
 2609 |                               </button>
 2610 |                             </div>
 2611 |                           </div>
 2612 |                         </motion.div>
 2613 |                       )
 2614 |                     })}
 2615 |                   </div>
 2616 |                 ) : null}
 2617 | 
 2618 |                 {(activeTab === 'all' || activeTab === 'companies') ? (
 2619 |                   <div className="space-y-3">
 2620 |                     {companies.map((p, idx) => {
 2621 |                       const author = p.author || {}
 2622 |                       const profileRoute = roleToProfileRoute(author.role, author.id)
 2623 |                       const rating = ratingsByProfileKey?.[p.profile_key] || null
 2624 |                       const isCertified = String(author.order_certification_status || '').toLowerCase() === 'certified'
 2625 |                       return (
 2626 |                         <motion.div
 2627 |                           key={p.id}
 2628 |                           initial={reduceMotion ? false : { opacity: 0, y: 20 }}
 2629 |                           animate={reduceMotion ? false : { opacity: 1, y: 0 }}
 2630 |                           transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
 2631 |                           className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800"
 2632 |                         >
 2633 |                           <div className="flex items-start justify-between gap-3">
 2634 |                             <div className="min-w-0">
 2635 |                               <div className="flex items-center gap-2">
 2636 |                                 <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
 2637 |                                   {author.name || p.title || 'Company'}
 2638 |                                 </Link>
 2639 |                                 {author.verified ? (
 2640 |                                   <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
 2641 |                                     Verified
 2642 |                                   </span>
 2643 |                                 ) : null}
 2644 |                                 {isCertified ? (
 2645 |                                   <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
 2646 |                                     Certified
 2647 |                                   </span>
 2648 |                                 ) : null}
 2649 |                                 {author.premium ? (
 2650 |                                   <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
 2651 |                                     Premium
 2652 |                                   </span>
 2653 |                                 ) : null}
 2654 |                                 {p.boost_active ? (
 2655 |                                   <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
 2656 |                                     Boosted {p.boost_multiplier && p.boost_multiplier !== 1 ? `x${p.boost_multiplier}` : ""}
 2657 |                                   </span>
 2658 |                                 ) : null}
 2659 |                                 {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
 2660 |                                 {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">- {String(author.role).replaceAll('_', ' ')}</span> : null}
 2661 |                               </div>
 2662 |                               <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
 2663 |                               <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{p.description || ''}</p>
 2664 |                               <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
 2665 |                                 <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.category || '-'}</span></div>
 2666 |                                 <div>MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.moq || '-'}</span></div>
 2667 |                                 <div>Lead time: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.lead_time_days || '-'}</span></div>
 2668 |                                 <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.material || '-'}</span></div>
 2669 |                               </div>
 2670 | 
 2671 |                               <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
 2672 |                                 Rating: <span className="font-semibold text-slate-800 dark:text-slate-100">{rating?.average_score ?? '0.0'}</span> ({rating?.total_count ?? 0}) - Confidence {Math.round((rating?.score_confidence ?? 0) * 100)}%
 2673 |                               </div>
 2674 |                               {p.hasVideo ? <div className="mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-200">Video available</div> : null}
 2675 |                             </div>
 2676 |                             <div className="flex flex-col gap-2 shrink-0">
 2677 |                               <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
 2678 |                                 View profile
 2679 |                               </Link>
 2680 |                               <button
 2681 |                                 type="button"
 2682 |                                 onClick={() => setQuickViewItem({ ...p, author })}
 2683 |                                 className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
 2684 |                               >
 2685 |                                 Quick view
 2686 |                               </button>
 2687 |                               <button
 2688 |                                 type="button"
 2689 |                                 onClick={() => openChatNotice(author.name || 'company', {
 2690 |                                   type: 'product',
 2691 |                                   id: p.id,
 2692 |                                   label: p.title || 'Product',
 2693 |                                 }, { productId: p.id })}
 2694 |                                 className="rounded-full bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
 2695 |                               >
 2696 |                                 Contact
 2697 |                               </button>
 2698 |                             </div>
 2699 |                           </div>
 2700 |                         </motion.div>
 2701 |                       )
 2702 |                     })}
 2703 |                   </div>
 2704 |                 ) : null}
 2705 |               </div>
 2706 |             ) : null}
 2707 |             </div>
 2708 |           </div>
 2709 | 
 2710 |           <aside className="col-span-12 xl:col-span-3 space-y-4">
 2711 |             {isBuyer ? (
 2712 |               <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
 2713 |                 <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Early verified factories</p>
 2714 |                 <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Premium-only early access list</p>
 2715 |                 {!canEarlyAccess ? (
 2716 |                   <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
 2717 |                     Upgrade to Premium to unlock early access to newly verified factories.
 2718 |                     <div className="mt-2">
 2719 |                       <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
 2720 |                     </div>
 2721 |                   </div>
 2722 |                 ) : earlyVerifiedError ? (
 2723 |                   <div className="mt-2 text-xs text-rose-600 dark:text-rose-300">{earlyVerifiedError}</div>
 2724 |                 ) : (
 2725 |                   <div className="mt-3 space-y-2">
 2726 |                     {earlyVerifiedFactories.length ? earlyVerifiedFactories.slice(0, 6).map((row) => (
 2727 |                       <Link
 2728 |                         key={row.id}
 2729 |                         to={roleToProfileRoute(row.role, row.id)}
 2730 |                         className="block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
 2731 |                       >
 2732 |                         <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.name || 'Factory'}</p>
 2733 |                         <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.country || '-'} - verified</p>
 2734 |                       </Link>
 2735 |                     )) : (
 2736 |                       <div className="text-xs text-slate-500 dark:text-slate-400">No new verified factories yet.</div>
 2737 |                     )}
 2738 |                   </div>
 2739 |                 )}
 2740 |               </div>
 2741 |             ) : null}
 2742 |             <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
 2743 |               <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
 2744 |               <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you - Recorded on Quick View</p>
 2745 |               <div className="mt-3 space-y-2">
 2746 |                 {recentViews.length ? recentViews.map((row) => (
 2747 |                   <button
 2748 |                     key={row.id}
 2749 |                     type="button"
 2750 |                     onClick={() => setQuickViewItem({ ...row.product, author: row.author })}
 2751 |                     className="w-full text-left rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-[0.99] dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
 2752 |                     title="Open Quick View"
 2753 |                   >
 2754 |                     <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.product?.title || 'Product'}</p>
 2755 |                     <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} - {new Date(row.viewed_at).toLocaleString()}</p>
 2756 |                   </button>
 2757 |                 )) : (
 2758 |                   <div className="text-xs text-slate-500 dark:text-slate-400">No views yet. Use "Quick view" on a product.</div>
 2759 |                 )}
 2760 |               </div>
 2761 |               <div className="mt-3">
 2762 |                 <Link to="/notifications" className="text-xs font-semibold text-[var(--gt-blue)] hover:underline">Open full history</Link>
 2763 |               </div>
 2764 |             </div>
 2765 | 
 2766 |             {premiumLocked ? (
 2767 |               <div className="rounded-2xl p-4 ring-1 ring-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:ring-amber-500/30">
 2768 |                 <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Advanced filters locked</p>
 2769 |                 <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">
 2770 |                   Upgrade to Premium to unlock advanced filters. Core filters remain unlimited on the free plan.
 2771 |                 </p>
 2772 |               </div>
 2773 |             ) : null}
 2774 |           </aside>
 2775 |         </div>
 2776 |       </div>
 2777 | 
 2778 |       <ProductQuickViewModal
 2779 |         open={Boolean(quickViewItem)}
 2780 |         item={quickViewItem}
 2781 |         onClose={() => setQuickViewItem(null)}
 2782 |         onViewed={loadRecentViews}
 2783 |       />
 2784 |     </div>
 2785 |   )
 2786 | }
 2787 | 