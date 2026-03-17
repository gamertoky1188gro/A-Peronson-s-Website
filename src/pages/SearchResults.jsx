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
    - Glass + glow search bar with shortcut hint (Ctrl/⌘ + K).
    - layoutId animated tabs for "All / Buyer Requests / Companies".
    - Skeleton shimmer while loading.
    - Optional premium-locked overlays for advanced filters.
*/
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, Building2, Filter, LayoutGrid, Bell, Search as SearchIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
import ProductQuickViewModal from '../components/products/ProductQuickViewModal'

const TAB_OPTIONS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'requests', label: 'Buyer Requests', icon: Briefcase },
  { id: 'companies', label: 'Companies', icon: Building2 },
]

function roleToProfileRoute(role, id) {
  // Convert a company role -> correct profile route.
  // Used when clicking a search result card to navigate to the right profile page.
  if (!id) return ''
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'buyer') return `/buyer/${encodeURIComponent(id)}`
  if (normalized === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
  return `/factory/${encodeURIComponent(id)}`
}

function buildQueryString({ q, category, filters, allowAdvanced }) {
  // Build URLSearchParams from UI state.
  // `allowAdvanced` gates premium-only filters so we don't send params the backend will ignore/reject.
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category) params.set('category', category)

  if (allowAdvanced) {
    if (filters.moqRange) params.set('moqRange', filters.moqRange)
    if (filters.country) params.set('country', filters.country)
    if (filters.verifiedOnly) params.set('verifiedOnly', 'true')
    if (filters.orgType) params.set('orgType', filters.orgType)
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
  const token = useMemo(() => getToken(), [])
  const sessionUser = getCurrentUser()
  const reduceMotion = useReducedMotion()
  const queryInputRef = useRef(null)
  const isMac = useMemo(() => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])

  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [category, setCategory] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [upgradePrompt, setUpgradePrompt] = useState('')
  const [alertFeedback, setAlertFeedback] = useState('')

  const [filters, setFilters] = useState({
    moqRange: '',
    country: '',
    verifiedOnly: false,
    orgType: '',
  })

  const [capabilities, setCapabilities] = useState(() => ({
    filters: { advanced: sessionUser?.subscription_status === 'premium' },
  }))
  const premiumLocked = !capabilities?.filters?.advanced

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quotaMessage, setQuotaMessage] = useState('')

  const [requests, setRequests] = useState([])
  const [companies, setCompanies] = useState([])
  const [ratingsByProfileKey, setRatingsByProfileKey] = useState({})
  const [recentViews, setRecentViews] = useState([])
  const [quickViewItem, setQuickViewItem] = useState(null)

  const totalResults = requests.length + companies.length

  const allowAdvanced = !premiumLocked

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

  const runSearch = useCallback(async () => {
    const q = query.trim()
    setLoading(true)
    setError('')
    setQuotaMessage('')
    setUpgradePrompt('')
    setAlertFeedback('')

    try {
      const qs = buildQueryString({ q, category: category.trim(), filters, allowAdvanced })
      const [reqRes, prodRes] = await Promise.all([
        apiRequest(`/requirements/search?${qs}`, { token }),
        apiRequest(`/products/search?${qs}`, { token }),
      ])

      const reqItems = Array.isArray(reqRes?.items) ? reqRes.items : []
      const prodItems = Array.isArray(prodRes?.items) ? prodRes.items : []

      setRequests(reqItems)
      setCompanies(prodItems)

      const mergedCapabilities = reqRes?.capabilities || prodRes?.capabilities || { filters: { advanced: false } }
      setCapabilities(mergedCapabilities)

      if (reqRes?.quota) {
        setQuotaMessage(`Search quota remaining today: ${reqRes.quota.remaining}`)
      }
    } catch (err) {
      setError(err.message || 'Search failed')
      setRequests([])
      setCompanies([])
      if (err?.quota?.remaining !== undefined) {
        setQuotaMessage(`Remaining today: ${err.quota.remaining}`)
      }
    } finally {
      setLoading(false)
    }
  }, [allowAdvanced, category, filters, query, token])

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
    if (premiumLocked) {
      setUpgradePrompt('Upgrade to Premium to use advanced filters.')
      return
    }
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  async function saveAlert() {
    setAlertFeedback('')
    const q = query.trim()
    if (!q) {
      setAlertFeedback('Enter a search query first.')
      return
    }
    try {
      const result = await apiRequest('/search/alerts', {
        method: 'POST',
        token,
        body: { query: q, filters: { category, ...filters } },
      })
      setAlertFeedback(`Alert saved. Remaining alert quota today: ${result?.quota?.remaining ?? '-'}`)
    } catch (err) {
      setAlertFeedback(err.message || 'Failed to save alert.')
    }
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
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
              >
                <Bell size={16} />
                Save alert
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
                placeholder="Search requests, factories, products…"
                className="w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                {isMac ? '⌘ K' : 'Ctrl K'}
              </span>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full bg-white px-4 py-3 text-sm text-slate-800 ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
            >
              <option value="">All categories</option>
              <option value="Shirts">Shirts</option>
              <option value="Knitwear">Knitwear</option>
              <option value="Denim">Denim</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
            <button
              type="button"
              onClick={runSearch}
              className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {filtersOpen ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`rounded-2xl p-4 ring-1 shadow-sm ${premiumLocked ? 'bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : 'bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`}>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Advanced filters</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{premiumLocked ? 'Locked on Free plan' : 'Available'}</p>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <select
                    value={filters.moqRange}
                    onChange={(e) => updateAdvancedFilter('moqRange', e.target.value)}
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">{`MOQ: ${formatMoqRangeLabel('Any')}`}</option>
                    <option value="0-100">MOQ: 0 - 100</option>
                    <option value="101-300">MOQ: 101 - 300</option>
                    <option value="301-1000">MOQ: 301 - 1000</option>
                    <option value="1001-999999">MOQ: 1000+</option>
                  </select>

                  <input
                    value={filters.country}
                    onChange={(e) => updateAdvancedFilter('country', e.target.value)}
                    placeholder="Country (e.g. Bangladesh)"
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  />

                  <select
                    value={filters.orgType}
                    onChange={(e) => updateAdvancedFilter('orgType', e.target.value)}
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">Organization type (Any)</option>
                    <option value="buyer">Buyer</option>
                    <option value="factory">Factory</option>
                    <option value="buying_house">Buying House</option>
                  </select>

                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => updateAdvancedFilter('verifiedOnly', e.target.checked)}
                      className="h-4 w-4"
                    />
                    Verified only
                  </label>
                </div>
              </div>

              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-2">{alertFeedback}</p> : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10">
          <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
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
                  className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ring-1 ${
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
                                {author.verified ? (
                                  <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                                    Verified
                                  </span>
                                ) : null}
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">• {author.country}</span> : null}
                              </div>
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
                                className="rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
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
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">• {author.country}</span> : null}
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">• {String(author.role).replaceAll('_', ' ')}</span> : null}
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
                                Rating: <span className="font-semibold text-slate-800 dark:text-slate-100">{rating?.average_score ?? '0.0'}</span> ({rating?.total_count ?? 0}) • Confidence {Math.round((rating?.score_confidence ?? 0) * 100)}%
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
                                className="rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
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
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you • Recorded on Quick View</p>
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
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} • {new Date(row.viewed_at).toLocaleString()}</p>
                  </button>
                )) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400">No views yet. Use “Quick view” on a product.</div>
                )}
              </div>
              <div className="mt-3">
                <Link to="/notifications" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300">Open full history</Link>
              </div>
            </div>

            {premiumLocked ? (
              <div className="rounded-2xl p-4 ring-1 ring-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:ring-amber-500/30">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Premium filters</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">Upgrade to use advanced filters like country, MOQ range, verified-only, and org type.</p>
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
