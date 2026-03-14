import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, Building2, Filter, LayoutGrid, Bell, Search as SearchIcon } from 'lucide-react'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

const TAB_OPTIONS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'requests', label: 'Buyer Requests', icon: Briefcase },
  { id: 'companies', label: 'Companies', icon: Building2 },
]

function roleToProfileRoute(role, id) {
  if (!id) return ''
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'buyer') return `/buyer/${encodeURIComponent(id)}`
  if (normalized === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
  return `/factory/${encodeURIComponent(id)}`
}

function buildQueryString({ q, category, filters, allowAdvanced }) {
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

export default function SearchResults() {
  const navigate = useNavigate()
  const token = useMemo(() => getToken(), [])
  const sessionUser = getCurrentUser()

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

  const totalResults = requests.length + companies.length

  const allowAdvanced = !premiumLocked

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center">
                <SearchIcon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Search</p>
                <p className="text-[11px] text-slate-500">Garments & Textile marketplace</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Filter size={16} />
                Filters
              </button>
              <button
                type="button"
                onClick={saveAlert}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
              >
                <Bell size={16} />
                Save alert
              </button>
              <Link
                to="/notifications"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Alerts
              </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. cotton shirts MOQ 100"
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm"
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
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {filtersOpen ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`rounded-2xl border p-4 ${premiumLocked ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}>
                <p className="text-xs font-bold text-slate-700">Advanced filters</p>
                <p className="text-[11px] text-slate-500 mt-1">{premiumLocked ? 'Locked on Free plan' : 'Available'}</p>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <select
                    value={filters.moqRange}
                    onChange={(e) => updateAdvancedFilter('moqRange', e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
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
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />

                  <select
                    value={filters.orgType}
                    onChange={(e) => updateAdvancedFilter('orgType', e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Organization type (Any)</option>
                    <option value="buyer">Buyer</option>
                    <option value="factory">Factory</option>
                    <option value="buying_house">Buying House</option>
                  </select>

                  <label className="flex items-center gap-2 text-sm text-slate-700">
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

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold text-slate-700">Status</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-2">{alertFeedback}</p> : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-5 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200">
            {TAB_OPTIONS.map((t) => {
              const Icon = t.icon
              const active = activeTab === t.id
              const count = t.id === 'requests' ? requests.length : t.id === 'companies' ? companies.length : totalResults
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                    active ? 'border-[#0A66C2] bg-[#0A66C2]/5 text-[#0A66C2]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{t.label}</span>
                  <span className="text-[11px] opacity-70">({count})</span>
                </button>
              )
            })}
          </div>

          <div className="p-4">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 text-center">Loading results…</div>
            ) : null}

            {!loading && error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 text-center">{error}</div>
            ) : null}

            {!loading && !error && totalResults === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 text-center">
                No results found. Try a different query or category.
              </div>
            ) : null}

            {!loading && !error ? (
              <div className="space-y-4">
                {(activeTab === 'all' || activeTab === 'requests') ? (
                  <div className="space-y-3">
                    {requests.map((r) => {
                      const author = r.author || {}
                      const profileRoute = roleToProfileRoute(author.role, author.id)
                      return (
                        <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 hover:underline truncate">
                                  {author.name || 'Buyer'}
                                </Link>
                                {author.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : null}
                                {author.country ? <span className="text-[11px] text-slate-500">• {author.country}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">{r.custom_description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                                <div>Category: <span className="font-semibold text-slate-800">{r.category || '-'}</span></div>
                                <div>Quantity/MOQ: <span className="font-semibold text-slate-800">{r.quantity || '-'}</span></div>
                                <div>Timeline: <span className="font-semibold text-slate-800">{r.timeline_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800">{r.material || '-'}</span></div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Link to={profileRoute} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-center">
                                Open profile
                              </Link>
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'buyer')}
                                className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
                              >
                                Contact
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : null}

                {(activeTab === 'all' || activeTab === 'companies') ? (
                  <div className="space-y-3">
                    {companies.map((p) => {
                      const author = p.author || {}
                      const profileRoute = roleToProfileRoute(author.role, author.id)
                      const rating = ratingsByProfileKey?.[p.profile_key] || null
                      return (
                        <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 hover:underline truncate">
                                  {author.name || p.title || 'Company'}
                                </Link>
                                {author.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : null}
                                {author.country ? <span className="text-[11px] text-slate-500">• {author.country}</span> : null}
                                {author.role ? <span className="text-[11px] text-slate-500 uppercase">• {String(author.role).replaceAll('_', ' ')}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 font-semibold">{p.title || 'Product'}</p>
                              <p className="mt-1 text-sm text-slate-700 line-clamp-2">{p.description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                                <div>Category: <span className="font-semibold text-slate-800">{p.category || '-'}</span></div>
                                <div>MOQ: <span className="font-semibold text-slate-800">{p.moq || '-'}</span></div>
                                <div>Lead time: <span className="font-semibold text-slate-800">{p.lead_time_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800">{p.material || '-'}</span></div>
                              </div>

                              <div className="mt-3 text-xs text-slate-600">
                                Rating: <span className="font-semibold text-slate-800">{rating?.average_score ?? '0.0'}</span> ({rating?.total_count ?? 0}) • Confidence {Math.round((rating?.score_confidence ?? 0) * 100)}%
                              </div>
                              {p.hasVideo ? <div className="mt-2 text-xs font-semibold text-indigo-700">Video available</div> : null}
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Link to={profileRoute} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-center">
                                View profile
                              </Link>
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'company')}
                                className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
                              >
                                Contact
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
