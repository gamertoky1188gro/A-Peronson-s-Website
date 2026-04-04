/*
  Route: /search
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Run marketplace search across Buyer Requests and Companies/Products.
    - Provide basic filters for free tier and advanced filters for premium tier.
    - Support quick view modals and recent views rail.

  Key API endpoints:
    - GET /api/requirements/search?... (buyer requests)
    - GET /api/products/search?... (companies/products)
    - GET /api/ratings/search?profile_keys=...
    - GET /api/products/views/me?cursor=...
    - POST /api/search/alerts (save alerts)

  Major UI/UX patterns:
    - Glass + glow search bar with shortcut hint (Ctrl/Cmd + K).
    - layoutId animated tabs for "All / Buyer Requests / Companies".
    - Skeleton shimmer while loading.
    - Optional premium-locked overlays for advanced filters.
*/
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Briefcase, Building2, Filter, LayoutGrid, Bell, Search as SearchIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { apiRequest, getCurrentUser, getToken, hasEntitlement } from '../lib/auth'
import ProductQuickViewModal from '../components/products/ProductQuickViewModal'
import { trackClientEvent } from '../lib/events'

const Motion = motion

const TAB_OPTIONS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'requests', label: 'Buyer Requests', icon: Briefcase },
  { id: 'companies', label: 'Companies', icon: Building2 },
]

const INDUSTRY_OPTIONS = [
  { value: 'garments', label: 'Garments' },
  { value: 'textile', label: 'Textile' },
]

const GARMENT_CATEGORIES = ['Shirts', 'Pants', 'Jackets', 'Knitwear', 'Denim', 'Women', 'Kids']
const TEXTILE_CATEGORIES = ['Woven', 'Knit', 'Denim', 'Non-woven', 'Yarn', 'Trim', 'Accessories']

function roleToProfileRoute(role, id) {
  // Convert a company role -> correct profile route.
  // Used when clicking a search result card to navigate to the right profile page.
  if (!id) return ''
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'buyer') return `/buyer/${encodeURIComponent(id)}`
  if (normalized === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
  return `/factory/${encodeURIComponent(id)}`
}

const CORE_FILTER_KEYS = ['industry', 'moqRange', 'priceRange', 'country', 'verifiedOnly', 'orgType', 'leadTimeMax', 'priorityOnly']
const ADVANCED_FILTER_KEYS = [
  'fabricType',
  'gsmMin',
  'gsmMax',
  'sizeRange',
  'colorPantone',
  'customization',
  'sampleAvailable',
  'sampleLeadTime',
  'certifications',
  'incoterms',
  'paymentTerms',
  'documentReady',
  'auditDate',
  'languageSupport',
  'capacityMin',
  'processes',
  'yearsInBusinessMin',
  'responseTimeMax',
  'teamSeatsMin',
  'handlesMultipleFactories',
  'exportPort',
  'distanceKm',
  'locationLat',
  'locationLng',
]

function buildQueryString({ q, category, filters, includeAdvanced, includePriority = false }) {
  // Build URLSearchParams from UI state.
  // Core filters are always free; advanced filters require premium.
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category) params.set('category', category)
  if (filters.industry) params.set('industry', filters.industry)

  // Core filters (always included if set)
  if (filters.moqRange) params.set('moqRange', filters.moqRange)
  if (filters.priceRange) params.set('priceRange', filters.priceRange)
  if (filters.country) params.set('country', filters.country)
  if (filters.verifiedOnly) params.set('verifiedOnly', 'true')
  if (filters.orgType) params.set('orgType', filters.orgType)
  if (filters.leadTimeMax) params.set('leadTimeMax', filters.leadTimeMax)
  if (includePriority && filters.priorityOnly) params.set('priorityOnly', 'true')

  // Advanced filters (premium only)
  if (includeAdvanced) {
    if (filters.fabricType) params.set('fabricType', filters.fabricType)
    if (filters.gsmMin) params.set('gsmMin', filters.gsmMin)
    if (filters.gsmMax) params.set('gsmMax', filters.gsmMax)
    if (filters.sizeRange) params.set('sizeRange', filters.sizeRange)
    if (filters.colorPantone) params.set('colorPantone', filters.colorPantone)
    if (filters.customization) params.set('customization', filters.customization)
    if (filters.sampleAvailable) params.set('sampleAvailable', 'true')
    if (filters.sampleLeadTime) params.set('sampleLeadTime', filters.sampleLeadTime)
    if (filters.certifications) params.set('certifications', filters.certifications)
    if (filters.incoterms) params.set('incoterms', filters.incoterms)
    if (filters.paymentTerms) params.set('paymentTerms', filters.paymentTerms)
    if (filters.documentReady) params.set('documentReady', filters.documentReady)
    if (filters.auditDate) params.set('auditDate', filters.auditDate)
    if (filters.languageSupport) params.set('languageSupport', filters.languageSupport)
    if (filters.capacityMin) params.set('capacityMin', filters.capacityMin)
    if (filters.processes) params.set('processes', filters.processes)
    if (filters.yearsInBusinessMin) params.set('yearsInBusinessMin', filters.yearsInBusinessMin)
    if (filters.responseTimeMax) params.set('responseTimeMax', filters.responseTimeMax)
    if (filters.teamSeatsMin) params.set('teamSeatsMin', filters.teamSeatsMin)
    if (filters.handlesMultipleFactories) params.set('handlesMultipleFactories', 'true')
    if (filters.exportPort) params.set('exportPort', filters.exportPort)
    if (filters.distanceKm) params.set('distanceKm', filters.distanceKm)
    if (filters.locationLat) params.set('locationLat', filters.locationLat)
    if (filters.locationLng) params.set('locationLng', filters.locationLng)
  }

  return params.toString()
}

function formatMoqRangeLabel(value) {
  if (!value) return 'Any'
  return value
}

function ResultSkeletonCard({ index }) {
  return (
    <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-3 w-1/3 rounded-full skeleton" />
          <div className="mt-3 h-3 w-3/4 rounded-full skeleton" />
          <div className="mt-2 h-3 w-2/3 rounded-full skeleton" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-9 w-28 rounded-full skeleton" />
          <div className="h-9 w-28 rounded-full skeleton" />
        </div>
      </div>
      <span className="sr-only">Loading result {index + 1}</span>
    </div>
  )
}

export default function SearchResults() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const token = useMemo(() => getToken(), [])
  const sessionUser = getCurrentUser()
  const isBuyer = String(sessionUser?.role || '').toLowerCase() === 'buyer'
  const canAdvancedFilters = hasEntitlement(sessionUser, 'advanced_search_filters')
  const canEarlyAccess = hasEntitlement(sessionUser, 'early_access_verified_factories')
  const canPriorityAccessRequests = hasEntitlement(sessionUser, 'buyer_request_priority_access')
  const canPriorityAccessCompanies = hasEntitlement(sessionUser, 'priority_search_ranking')
  const reduceMotion = useReducedMotion()
  const queryInputRef = useRef(null)
  const isMac = useMemo(() => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])

  // URL-serializable search state (project.md): allows sharing/saving searches.
  const [query, setQuery] = useState(() => searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'all')
  const [category, setCategory] = useState(() => searchParams.get('category') || '')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [filterMode, setFilterMode] = useState('product')
  const [upgradePrompt, setUpgradePrompt] = useState('')
  const [alertFeedback, setAlertFeedback] = useState('')
  const [autoSaveCandidate, setAutoSaveCandidate] = useState(null)
  const [earlyVerifiedFactories, setEarlyVerifiedFactories] = useState([])
  const [earlyVerifiedError, setEarlyVerifiedError] = useState('')
  const [autoSaveAlertsEnabled] = useState(() => {
    const raw = sessionUser?.profile?.auto_save_search_alerts
    if (raw === undefined || raw === null || raw === '') return true
    return raw === true || String(raw).toLowerCase() === 'true'
  })

  const [filters, setFilters] = useState(() => ({
    industry: searchParams.get('industry') || '',
    moqRange: searchParams.get('moqRange') || '',
    priceRange: searchParams.get('priceRange') || '',
    country: searchParams.get('country') || '',
    verifiedOnly: searchParams.get('verifiedOnly') === 'true',
    orgType: searchParams.get('orgType') || '',
    priorityOnly: searchParams.get('priorityOnly') === 'true',
    // Expanded filters (project.md)
    leadTimeMax: searchParams.get('leadTimeMax') || '',
    fabricType: searchParams.get('fabricType') || '',
    gsmMin: searchParams.get('gsmMin') || '',
    gsmMax: searchParams.get('gsmMax') || '',
    sizeRange: searchParams.get('sizeRange') || '',
    colorPantone: searchParams.get('colorPantone') || '',
    customization: searchParams.get('customization') || '',
    sampleAvailable: searchParams.get('sampleAvailable') === 'true',
    sampleLeadTime: searchParams.get('sampleLeadTime') || '',
    certifications: searchParams.get('certifications') || '',
    incoterms: searchParams.get('incoterms') || '',
    paymentTerms: searchParams.get('paymentTerms') || '',
    documentReady: searchParams.get('documentReady') || '',
    auditDate: searchParams.get('auditDate') || '',
    languageSupport: searchParams.get('languageSupport') || '',
    capacityMin: searchParams.get('capacityMin') || '',
    processes: searchParams.get('processes') || '',
    yearsInBusinessMin: searchParams.get('yearsInBusinessMin') || '',
    responseTimeMax: searchParams.get('responseTimeMax') || '',
    teamSeatsMin: searchParams.get('teamSeatsMin') || '',
    handlesMultipleFactories: searchParams.get('handlesMultipleFactories') === 'true',
    exportPort: searchParams.get('exportPort') || '',
    distanceKm: searchParams.get('distanceKm') || '',
    locationLat: searchParams.get('locationLat') || '',
    locationLng: searchParams.get('locationLng') || '',
  }))

  useEffect(() => {
    let alive = true
    const loadEarlyVerified = async () => {
      if (!token) return
      if (!isBuyer || !canEarlyAccess) {
        setEarlyVerifiedFactories([])
        return
      }
      try {
        const data = await apiRequest('/users/verified/early', { token })
        if (!alive) return
        setEarlyVerifiedFactories(Array.isArray(data?.items) ? data.items : [])
        setEarlyVerifiedError('')
      } catch (err) {
        if (!alive) return
        setEarlyVerifiedFactories([])
        setEarlyVerifiedError(err.message || 'Unable to load early verified factories')
      }
    }
    loadEarlyVerified()
    return () => {
      alive = false
    }
  }, [canEarlyAccess, isBuyer, sessionUser, token])

  const [capabilities, setCapabilities] = useState(() => ({
    filters: { advanced: canAdvancedFilters },
  }))
  const hasAdvancedAccess = Boolean(capabilities?.filters?.advanced)
  const premiumLocked = !hasAdvancedAccess
  const priorityAllowedForTab = useMemo(() => {
    if (activeTab === 'requests') return canPriorityAccessRequests
    if (activeTab === 'companies') return canPriorityAccessCompanies
    return canPriorityAccessRequests && canPriorityAccessCompanies
  }, [activeTab, canPriorityAccessRequests, canPriorityAccessCompanies])

  const categoryOptions = useMemo(() => {
    const industry = String(filters.industry || '').toLowerCase()
    if (industry === 'textile') return TEXTILE_CATEGORIES
    if (industry === 'garments') return GARMENT_CATEGORIES
    return [...new Set([...GARMENT_CATEGORIES, ...TEXTILE_CATEGORIES])]
  }, [filters.industry])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quotaMessage, setQuotaMessage] = useState('')

  const [requests, setRequests] = useState([])
  const [companies, setCompanies] = useState([])
  const [ratingsByProfileKey, setRatingsByProfileKey] = useState({})
  const [recentViews, setRecentViews] = useState([])
  const [quickViewItem, setQuickViewItem] = useState(null)

  const totalResults = requests.length + companies.length

  const autoSearchRef = useRef(false)
  const filterTrackRef = useRef({ key: '', initialized: false })
  const autoSaveKeyRef = useRef('')

  const autoSaveAlert = useCallback(async (candidate) => {
    if (!autoSaveAlertsEnabled) return
    if (!candidate) return
    const key = JSON.stringify(candidate)
    if (autoSaveKeyRef.current === key) return
    autoSaveKeyRef.current = key
    try {
      await apiRequest('/search/alerts', {
        method: 'POST',
        token,
        body: { query: candidate.query || 'saved-search', filters: { category: candidate.category, ...candidate.filters, auto: true } },
      })
    } catch (err) {
      if (err?.status === 429) {
        setAlertFeedback('Daily auto-alert quota reached. Search still ran normally.')
      } else if (err?.message) {
        setAlertFeedback(err.message)
      }
    }
  }, [autoSaveAlertsEnabled, token])

  const runSearch = useCallback(async () => {
    const q = query.trim()
    setLoading(true)
    setError('')
    setQuotaMessage('')
    setUpgradePrompt('')
    setAlertFeedback('')

    try {
      const qsUrl = buildQueryString({
        q,
        category: category.trim(),
        filters,
        includeAdvanced: hasAdvancedAccess,
        includePriority: Boolean(filters.priorityOnly),
      })
      const includePriorityRequests = Boolean(filters.priorityOnly) && activeTab !== 'companies' && canPriorityAccessRequests
      const includePriorityCompanies = Boolean(filters.priorityOnly) && activeTab !== 'requests' && canPriorityAccessCompanies
      const qsRequests = buildQueryString({
        q,
        category: category.trim(),
        filters,
        includeAdvanced: hasAdvancedAccess,
        includePriority: includePriorityRequests,
      })
      const qsProducts = buildQueryString({
        q,
        category: category.trim(),
        filters,
        includeAdvanced: hasAdvancedAccess,
        includePriority: includePriorityCompanies,
      })

      // Keep URL in sync so searches are shareable/bookmarkable (project.md).
      const nextParams = new URLSearchParams(qsUrl)
      if (activeTab) nextParams.set('tab', activeTab)
      setSearchParams(nextParams, { replace: true })

      const [reqRes, prodRes] = await Promise.all([
        apiRequest(`/requirements/search?${qsRequests}`, { token }),
        apiRequest(`/products/search?${qsProducts}`, { token }),
      ])

      const reqItems = Array.isArray(reqRes?.items) ? reqRes.items : []
      const prodItems = Array.isArray(prodRes?.items) ? prodRes.items : []

      setRequests(reqItems)
      setCompanies(prodItems)

      const mergedCapabilities = reqRes?.capabilities || prodRes?.capabilities || { filters: { advanced: false } }
      setCapabilities(mergedCapabilities)

      const hasActiveFilters = Boolean(q) || Boolean(category.trim()) || Object.values(filters || {}).some((v) => (typeof v === 'boolean' ? v : String(v || '').trim()))
      const candidate = hasActiveFilters ? { query: q, category: category.trim(), filters } : null
      setAutoSaveCandidate(candidate)
      await autoSaveAlert(candidate)

      if (reqRes?.quota) {
        if (reqRes.quota.unlimited) {
          setQuotaMessage('Core searches are unlimited on your plan.')
        } else if (reqRes.quota.remaining !== undefined) {
          setQuotaMessage(`Search quota remaining today: ${reqRes.quota.remaining}`)
        }
      }

      trackClientEvent('search_run', {
        entityType: 'search',
        entityId: activeTab,
        metadata: {
          query: q,
          category: category.trim(),
          filters: { ...filters, advanced: hasAdvancedAccess },
          total_results: reqItems.length + prodItems.length,
        },
      })
    } catch (err) {
      setError(err.message || 'Search failed')
      setRequests([])
      setCompanies([])
      if (err?.quota?.unlimited) {
        setQuotaMessage('Core searches are unlimited on your plan.')
      } else if (err?.quota?.remaining !== undefined) {
        setQuotaMessage(`Remaining today: ${err.quota.remaining}`)
      }
    } finally {
      setLoading(false)
    }
  }, [activeTab, autoSaveAlert, category, filters, hasAdvancedAccess, query, setSearchParams, token])

  useEffect(() => {
    const handler = (e) => {
      const key = String(e.key || '').toLowerCase()
      if (key !== 'k') return
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      queryInputRef.current?.focus?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    // Auto-run when landing on /search with URL params (shared/bookmarked search).
    if (autoSearchRef.current) return
    autoSearchRef.current = true

    const hasUrlQuery = Boolean(
      (query && query.trim()) ||
      (category && category.trim()) ||
      Object.values(filters || {}).some((v) => (typeof v === 'boolean' ? v : String(v || '').trim())),
    )

    if (hasUrlQuery) {
      runSearch()
    }
  }, [category, filters, query, runSearch])

  useEffect(() => {
    if (!filters.priorityOnly) return
    if (priorityAllowedForTab) return
    setFilters((prev) => ({ ...prev, priorityOnly: false }))
    setUpgradePrompt('Priority-only filter requires a Premium plan.')
  }, [filters.priorityOnly, priorityAllowedForTab])

  useEffect(() => {
    const payload = {
      query: query.trim(),
      category: category.trim(),
      filters: { ...filters, advanced: hasAdvancedAccess },
    }
    const key = JSON.stringify(payload)
    if (!filterTrackRef.current.initialized) {
      filterTrackRef.current = { key, initialized: true }
      return
    }
    if (filterTrackRef.current.key === key) return
    filterTrackRef.current.key = key
    const timer = window.setTimeout(() => {
      trackClientEvent('search_filters_changed', {
        entityType: 'search',
        entityId: activeTab,
        metadata: payload,
      })
    }, 600)
    return () => window.clearTimeout(timer)
  }, [activeTab, category, filters, hasAdvancedAccess, query])

  const loadRecentViews = useCallback(async () => {
    try {
      const data = await apiRequest('/products/views/me?cursor=0&limit=5', { token })
      setRecentViews(Array.isArray(data?.items) ? data.items : [])
    } catch {
      setRecentViews([])
    }
  }, [token])

  useEffect(() => {
    const keys = [...new Set(companies.map((c) => String(c.profile_key || '')).filter(Boolean))]
    if (!keys.length) {
      setRatingsByProfileKey({})
      return
    }

    apiRequest(`/ratings/search?profile_keys=${encodeURIComponent(keys.join(','))}`, { token })
      .then((data) => setRatingsByProfileKey(data || {}))
      .catch(() => setRatingsByProfileKey({}))
  }, [companies, token])

  useEffect(() => {
    loadRecentViews()
  }, [loadRecentViews])

  function updateAdvancedFilter(key, value) {
    if (!hasAdvancedAccess) {
      setUpgradePrompt('Advanced filters require a Premium plan. Upgrade to unlock these filters.')
      return
    }
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function updateCoreFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function updatePriorityFilter(value) {
    if (!priorityAllowedForTab) {
      setUpgradePrompt('Priority-only filter requires a Premium plan.')
      return
    }
    setFilters((prev) => ({ ...prev, priorityOnly: value }))
  }

  async function saveAlert(presetLabel = '') {
    setAlertFeedback('')
    const q = query.trim()
    const hasFilters = Object.values(filters || {}).some((v) => (typeof v === 'boolean' ? v : String(v || '').trim()))
    if (!q && !category && !hasFilters) {
      setAlertFeedback('Enter a query or select filters before saving.')
      return
    }
    try {
      const result = await apiRequest('/search/alerts', {
        method: 'POST',
        token,
        body: { query: q || 'saved-search', filters: { category, ...filters, preset: presetLabel } },
      })
      setAlertFeedback(`Search saved. Remaining alert quota today: ${result?.quota?.remaining ?? '-'}`)
    } catch (err) {
      setAlertFeedback(err.message || 'Failed to save alert.')
    }
  }

  function savePresetLocal(presetKey) {
    try {
      const payload = { query, category, filters }
      localStorage.setItem(`gt_search_preset_${presetKey}`, JSON.stringify(payload))
    } catch {
      // ignore storage failures
    }
  }

  function applyPreset(presetKey) {
    try {
      const raw = localStorage.getItem(`gt_search_preset_${presetKey}`)
      if (!raw) {
        setAlertFeedback('No saved preset found yet.')
        return
      }
      const preset = JSON.parse(raw)
      setQuery(preset?.query || '')
      setCategory(preset?.category || '')
      if (preset?.filters) {
        setFilters((prev) => ({ ...prev, ...preset.filters }))
      }
      setAlertFeedback(`Loaded ${presetKey.replace('_', ' ')} preset.`)
    } catch {
      setAlertFeedback('Unable to load preset.')
    }
  }

  async function savePreset(presetKey) {
    await saveAlert(presetKey)
    savePresetLocal(presetKey)
    setAutoSaveCandidate(null)
  }

  function openChatNotice(name) {
    navigate('/chat', { state: { notice: `Contacting ${name}. If you are unverified, your first message may appear as a request.` } })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md dark:bg-slate-950/40 dark:ring-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center">
                <SearchIcon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Search</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
                <Filter size={16} />
                Filters
              </button>
              <button
                type="button"
                onClick={saveAlert}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gt-blue)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
              >
                <Bell size={16} />
                Save search
              </button>
              <Link
                to="/notifications"
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
                Alerts
              </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <input
                ref={queryInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search requests, factories, products..."
                className="w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                {isMac ? 'Cmd K' : 'Ctrl K'}
              </span>
            </div>
            <button
              type="button"
              onClick={runSearch}
              className="rounded-full bg-[var(--gt-blue)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategory('')}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${category ? 'bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50' : 'bg-[var(--gt-blue)] text-white ring-transparent'}`}
            >
              All categories
            </button>
            {categoryOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${category === option ? 'bg-[var(--gt-blue)] text-white ring-transparent' : 'bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50'}`}
              >
                {option}
              </button>
            ))}
          </div>

          {filtersOpen ? (
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Core filters</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Always free</p>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <select
                    value={filters.industry}
                    onChange={(e) => updateCoreFilter('industry', e.target.value)}
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">Industry (Any)</option>
                    {INDUSTRY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <select
                    value={filters.moqRange}
                    onChange={(e) => updateCoreFilter('moqRange', e.target.value)}
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">{`MOQ: ${formatMoqRangeLabel('Any')}`}</option>
                    <option value="0-100">MOQ: 0 - 100</option>
                    <option value="101-300">MOQ: 101 - 300</option>
                    <option value="301-1000">MOQ: 301 - 1000</option>
                    <option value="1001-999999">MOQ: 1000+</option>
                  </select>
                  <input
                    value={filters.priceRange}
                    onChange={(e) => updateCoreFilter('priceRange', e.target.value)}
                    placeholder="Price range (e.g. 5-10 USD)"
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  />
                  <input
                    value={filters.country}
                    onChange={(e) => updateCoreFilter('country', e.target.value)}
                    placeholder="Country (e.g. Bangladesh)"
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  />
                  <select
                    value={filters.orgType}
                    onChange={(e) => updateCoreFilter('orgType', e.target.value)}
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">Account type (Any)</option>
                    <option value="buyer">Buyer</option>
                    <option value="factory">Factory</option>
                    <option value="buying_house">Buying House</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => updateCoreFilter('verifiedOnly', e.target.checked)}
                      className="h-4 w-4"
                    />
                    Verified only
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={filters.priorityOnly}
                      onChange={(e) => updatePriorityFilter(e.target.checked)}
                      className="h-4 w-4"
                    />
                    Priority only
                    {!priorityAllowedForTab ? (
                      <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Premium
                      </span>
                    ) : null}
                  </label>
                  <select
                    value={filters.leadTimeMax}
                    onChange={(e) => updateCoreFilter('leadTimeMax', e.target.value)}
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">Lead time (Any)</option>
                    <option value="7">Lead time &lt;= 7 days</option>
                    <option value="14">Lead time &lt;= 14 days</option>
                    <option value="30">Lead time &lt;= 30 days</option>
                    <option value="60">Lead time &lt;= 60 days</option>
                    <option value="90">Lead time &lt;= 90 days</option>
                  </select>
                </div>
              </div>

              <div className={`rounded-2xl p-4 ring-1 shadow-sm${premiumLocked ? 'bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : 'bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Advanced filters</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{premiumLocked ? 'Premium required to unlock' : 'Premium unlocked'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                  >
                    {advancedFiltersOpen ? 'Hide filters' : 'More filters'}
                  </button>
                </div>

                {advancedFiltersOpen ? (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div className="flex flex-wrap gap-2 rounded-full bg-slate-50 p-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                      <button
                        type="button"
                        onClick={() => setFilterMode('product')}
                        className={`rounded-full px-3 py-1 ${filterMode === 'product' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
                      >
                        Product Filters
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterMode('supplier')}
                        className={`rounded-full px-3 py-1 ${filterMode === 'supplier' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
                      >
                        Supplier Filters
                      </button>
                    </div>

                    {filterMode === 'product' ? (
                      <>
                        <input
                          value={filters.fabricType}
                          onChange={(e) => updateAdvancedFilter('fabricType', e.target.value)}
                          placeholder="Fabric type (e.g. Cotton)"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={filters.gsmMin}
                            onChange={(e) => updateAdvancedFilter('gsmMin', e.target.value)}
                            placeholder="GSM min"
                            disabled={premiumLocked}
                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                          <input
                            value={filters.gsmMax}
                            onChange={(e) => updateAdvancedFilter('gsmMax', e.target.value)}
                            placeholder="GSM max"
                            disabled={premiumLocked}
                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                        </div>
                        <input
                          value={filters.sizeRange}
                          onChange={(e) => updateAdvancedFilter('sizeRange', e.target.value)}
                          placeholder="Size range"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <input
                          value={filters.colorPantone}
                          onChange={(e) => updateAdvancedFilter('colorPantone', e.target.value)}
                          placeholder="Color / Pantone"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <input
                          value={filters.customization}
                          onChange={(e) => updateAdvancedFilter('customization', e.target.value)}
                          placeholder="Customization capability"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={filters.sampleAvailable}
                            onChange={(e) => updateAdvancedFilter('sampleAvailable', e.target.checked)}
                            disabled={premiumLocked}
                            className="h-4 w-4"
                          />
                          Sample available
                        </label>
                        <input
                          value={filters.sampleLeadTime}
                          onChange={(e) => updateAdvancedFilter('sampleLeadTime', e.target.value)}
                          placeholder="Sample lead time (days)"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <input
                          value={filters.certifications}
                          onChange={(e) => updateAdvancedFilter('certifications', e.target.value)}
                          placeholder="Certifications (e.g. GOTS,BSCI)"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <select
                          value={filters.incoterms}
                          onChange={(e) => updateAdvancedFilter('incoterms', e.target.value)}
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        >
                          <option value="">Incoterms (Any)</option>
                          <option value="FOB">FOB</option>
                          <option value="CIF">CIF</option>
                          <option value="EXW">EXW</option>
                          <option value="DDP">DDP</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <input
                          value={filters.paymentTerms}
                          onChange={(e) => updateAdvancedFilter('paymentTerms', e.target.value)}
                          placeholder="Payment terms"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <input
                          value={filters.documentReady}
                          onChange={(e) => updateAdvancedFilter('documentReady', e.target.value)}
                          placeholder="Document readiness"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <input
                          value={filters.auditDate}
                          onChange={(e) => updateAdvancedFilter('auditDate', e.target.value)}
                          placeholder="Audit date"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <input
                          value={filters.languageSupport}
                          onChange={(e) => updateAdvancedFilter('languageSupport', e.target.value)}
                          placeholder="Language support"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <input
                          value={filters.capacityMin}
                          onChange={(e) => updateAdvancedFilter('capacityMin', e.target.value)}
                          placeholder="Min capacity / month"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <input
                          value={filters.processes}
                          onChange={(e) => updateAdvancedFilter('processes', e.target.value)}
                          placeholder="Main processes (e.g. knit, woven)"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={filters.yearsInBusinessMin}
                            onChange={(e) => updateAdvancedFilter('yearsInBusinessMin', e.target.value)}
                            placeholder="Years in business (min)"
                            disabled={premiumLocked}
                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                          <input
                            value={filters.responseTimeMax}
                            onChange={(e) => updateAdvancedFilter('responseTimeMax', e.target.value)}
                            placeholder="Response time max (hours)"
                            disabled={premiumLocked}
                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={filters.teamSeatsMin}
                            onChange={(e) => updateAdvancedFilter('teamSeatsMin', e.target.value)}
                            placeholder="Team seats (min)"
                            disabled={premiumLocked}
                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                          <input
                            value={filters.exportPort}
                            onChange={(e) => updateAdvancedFilter('exportPort', e.target.value)}
                            placeholder="Export ports (comma-separated)"
                            disabled={premiumLocked}
                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={filters.handlesMultipleFactories}
                            onChange={(e) => updateAdvancedFilter('handlesMultipleFactories', e.target.checked)}
                            disabled={premiumLocked}
                            className="h-4 w-4"
                          />
                          Handles multiple factories
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={filters.locationLat}
                            onChange={(e) => updateAdvancedFilter('locationLat', e.target.value)}
                            placeholder="Location latitude"
                            disabled={premiumLocked}
                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                          <input
                            value={filters.locationLng}
                            onChange={(e) => updateAdvancedFilter('locationLng', e.target.value)}
                            placeholder="Location longitude"
                            disabled={premiumLocked}
                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                        </div>
                        <input
                          value={filters.distanceKm}
                          onChange={(e) => updateAdvancedFilter('distanceKm', e.target.value)}
                          placeholder="Distance radius (km)"
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Advanced filters are hidden to keep search simple. Use "More filters" when needed.</p>
                )}
              </div>

              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Filter guidance</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <p>Supplier filters use profile data such as main processes, export ports, and years in business.</p>
                  <p>Distance radius requires latitude/longitude from both sides. If a supplier has no coordinates, we fall back to country matching.</p>
                  <p>Premium filters are optional. Core filters always remain free and unlimited.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status & presets</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 borderless-shadow rounded-xl p-2">{alertFeedback}</p> : null}
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Apply preset</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
                </div>

                {autoSaveCandidate ? (
                  <div className="mt-4 rounded-xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-white/5 dark:text-slate-200">
                    <p className="font-semibold text-slate-700 dark:text-slate-100">Save this search as a preset</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10">
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {TAB_OPTIONS.map((t) => {
                const Icon = t.icon
                const active = activeTab === t.id
                const count = t.id === 'requests' ? requests.length : t.id === 'companies' ? companies.length : totalResults
                return (
                  <motion.button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ring-1${
                      active
                        ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
                        : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="search-tab"
                        className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative inline-flex items-center gap-2">
                      <Icon size={16} />
                      <span>{t.label}</span>
                      <span className="text-[11px] opacity-70">({count})</span>
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <div className="p-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ResultSkeletonCard key={`result-skel-${i}`} index={i} />
                ))}
              </div>
            ) : null}

            {!loading && error ? (
              <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 text-center ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30">
                {error}
              </div>
            ) : null}

            {!loading && !error && totalResults === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-700 text-center ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                No results found. Try a different query or category.
              </div>
            ) : null}

            {!loading && !error ? (
              <div className="space-y-4">
                {(activeTab === 'all' || activeTab === 'requests') ? (
                  <div className="space-y-3">
                    {requests.map((r, idx) => {
                      const author = r.author || {}
                      const profileRoute = roleToProfileRoute(author.role, author.id)
                      const requestType = String(r.request_type || 'garments').toLowerCase()
                      const specs = r.specs && typeof r.specs === 'object' ? r.specs : {}
                      const isCertified = String(author.order_certification_status || '').toLowerCase() === 'certified'
                      const quoteDeadline = r.quote_deadline ? new Date(r.quote_deadline) : null
                      const expiresAt = r.expires_at ? new Date(r.expires_at) : null
                      const isExpired = expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < Date.now()
                      const maxSuppliers = Number.isFinite(Number(r.max_suppliers)) ? Number(r.max_suppliers) : null
                      const specLabel = requestType === 'textile'
                        ? [specs.material_type || r.category, specs.unit || ''].filter(Boolean).join(' - ')
                        : [specs.gender_target || '', specs.season || ''].filter(Boolean).join(' - ')
                      return (
                        <motion.div
                          key={r.id}
                          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                          className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || 'Buyer'}
                                </Link>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600 dark:bg-white/10 dark:text-slate-200">
                                  {requestType}
                                </span>
                                {r.verified_only ? (
                                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                                    Verified only
                                  </span>
                                ) : null}
                                {r.discussion_active ? (
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                                    Active discussion
                                  </span>
                                ) : null}
                                {author.verified ? (
                                  <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                                    Verified
                                  </span>
                                ) : null}
                                {isCertified ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                                    Certified
                                  </span>
                                ) : null}
                                {r.priority_active ? (
                                  <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                                    Priority
                                  </span>
                                ) : null}
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
                              </div>
                              {(specLabel || quoteDeadline || expiresAt) ? (
                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                                  {specLabel ? <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">{specLabel}</span> : null}
                                  {quoteDeadline ? <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">Quote by {quoteDeadline.toLocaleDateString()}</span> : null}
                                  {expiresAt ? (
                                    <span className={`rounded-full px-2 py-1${isExpired ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'}`}>
                                      {isExpired ? 'Expired' : `Expires ${expiresAt.toLocaleDateString()}`}
                                    </span>
                                  ) : null}
                                  {maxSuppliers !== null ? (
                                    <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">Max suppliers: {maxSuppliers}</span>
                                  ) : null}
                                </div>
                              ) : null}
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{r.custom_description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.category || '-'}</span></div>
                                <div>Quantity/MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.quantity || '-'}</span></div>
                                <div>Timeline: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.timeline_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.material || '-'}</span></div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                Open profile
                              </Link>
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'buyer')}
                                className="rounded-full bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
                              >
                                Contact
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : null}

                {(activeTab === 'all' || activeTab === 'companies') ? (
                  <div className="space-y-3">
                    {companies.map((p, idx) => {
                      const author = p.author || {}
                      const profileRoute = roleToProfileRoute(author.role, author.id)
                      const rating = ratingsByProfileKey?.[p.profile_key] || null
                      const isCertified = String(author.order_certification_status || '').toLowerCase() === 'certified'
                      return (
                        <motion.div
                          key={p.id}
                          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                          className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || p.title || 'Company'}
                                </Link>
                                {author.verified ? (
                                  <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                                    Verified
                                  </span>
                                ) : null}
                                {isCertified ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                                    Certified
                                  </span>
                                ) : null}
                                {author.premium ? (
                                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                                    Premium
                                  </span>
                                ) : null}
                                {p.boost_active ? (
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                                    Boosted {p.boost_multiplier && p.boost_multiplier !== 1 ? `x${p.boost_multiplier}` : ""}
                                  </span>
                                ) : null}
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">- {String(author.role).replaceAll('_', ' ')}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{p.description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.category || '-'}</span></div>
                                <div>MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.moq || '-'}</span></div>
                                <div>Lead time: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.lead_time_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.material || '-'}</span></div>
                              </div>

                              <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                                Rating: <span className="font-semibold text-slate-800 dark:text-slate-100">{rating?.average_score ?? '0.0'}</span> ({rating?.total_count ?? 0}) - Confidence {Math.round((rating?.score_confidence ?? 0) * 100)}%
                              </div>
                              {p.hasVideo ? <div className="mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-200">Video available</div> : null}
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                View profile
                              </Link>
                              <button
                                type="button"
                                onClick={() => setQuickViewItem({ ...p, author })}
                                className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
                              >
                                Quick view
                              </button>
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'company')}
                                className="rounded-full bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
                              >
                                Contact
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}
            </div>
          </div>

          <aside className="col-span-12 xl:col-span-3 space-y-4">
            {isBuyer ? (
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Early verified factories</p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Premium-only early access list</p>
                {!canEarlyAccess ? (
                  <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                    Upgrade to Premium to unlock early access to newly verified factories.
                    <div className="mt-2">
                      <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
                    </div>
                  </div>
                ) : earlyVerifiedError ? (
                  <div className="mt-2 text-xs text-rose-600 dark:text-rose-300">{earlyVerifiedError}</div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {earlyVerifiedFactories.length ? earlyVerifiedFactories.slice(0, 6).map((row) => (
                      <Link
                        key={row.id}
                        to={roleToProfileRoute(row.role, row.id)}
                        className="block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
                      >
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.name || 'Factory'}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.country || '-'} - verified</p>
                      </Link>
                    )) : (
                      <div className="text-xs text-slate-500 dark:text-slate-400">No new verified factories yet.</div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you - Recorded on Quick View</p>
              <div className="mt-3 space-y-2">
                {recentViews.length ? recentViews.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setQuickViewItem({ ...row.product, author: row.author })}
                    className="w-full text-left rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-[0.99] dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
                    title="Open Quick View"
                  >
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.product?.title || 'Product'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} - {new Date(row.viewed_at).toLocaleString()}</p>
                  </button>
                )) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400">No views yet. Use "Quick view" on a product.</div>
                )}
              </div>
              <div className="mt-3">
                <Link to="/notifications" className="text-xs font-semibold text-[var(--gt-blue)] hover:underline">Open full history</Link>
              </div>
            </div>

            {premiumLocked ? (
              <div className="rounded-2xl p-4 ring-1 ring-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:ring-amber-500/30">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Advanced filters locked</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">
                  Upgrade to Premium to unlock advanced filters. Core filters remain unlimited on the free plan.
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      <ProductQuickViewModal
        open={Boolean(quickViewItem)}
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onViewed={loadRecentViews}
      />
    </div>
  )
}






