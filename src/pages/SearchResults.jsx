import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FloatingAssistant from '../components/FloatingAssistant'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
function getAuthToken() {
  return localStorage.getItem('jwt') || ''
}

async function api(path, options = {}) {
  const token = getAuthToken()
  const res = await fetch(`${API}${path}`, {
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const error = new Error(data?.error || data?.message || `Request failed (${res.status})`)
    error.code = data?.code
    error.quota = data?.quota
    error.requirements = data?.requirements
    error.capabilities = data?.capabilities
    error.remainingQuota = data?.remaining_quota
    throw error
  }

  return data
}

function toArray(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (Array.isArray(value.items)) return value.items
  if (Array.isArray(value.results)) return value.results
  if (Array.isArray(value.data)) return value.data
  return []
}

function normalizeRequest(raw) {
  return {
    id: raw.id ?? raw._id,
    buyerName: raw.buyerName || raw.organization_name || raw.org || raw.author?.name || 'Unknown buyer',
    verified: Boolean(raw.verified || raw.author?.verified),
    requirement: raw.requirement || raw.content || raw.description || raw.title || '',
    deadline: raw.deadline || raw.timeline || 'N/A',
    moq: raw.moq || raw.quantity || 'N/A',
  }
}


function toProfileKey(name) {
  return `factory:${String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

function normalizeCompany(raw) {
  return {
    id: raw.id ?? raw._id,
    name: raw.name || raw.organization_name || raw.org || raw.author?.name || 'Unknown company',
    category: raw.category || raw.primary_category || raw.material || 'General',
    mediaReviewStatus: raw.video_review_status || 'approved',
    hasVideo: Boolean(raw.hasVideo || (raw.video_review_status === 'approved' && raw.video_url)),
    profileKey: raw.profile_key || toProfileKey(raw.name || raw.organization_name || raw.org),
  }
}

export default function SearchResults() {
  const [searchQueryInput, setSearchQueryInput] = useState('cotton shirts MOQ 100+')
  const [activeQuery, setActiveQuery] = useState('cotton shirts MOQ 100+')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [plan, setPlan] = useState('free')
  const [upgradePrompt, setUpgradePrompt] = useState('')
  const [filters, setFilters] = useState({
    primary: '',
    category: '',
    moqRange: '',
    country: '',
    verifiedOnly: false,
    orgType: '',
  })

  const [buyerRequests, setBuyerRequests] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quotaMessage, setQuotaMessage] = useState('')
  const [capabilityMessage, setCapabilityMessage] = useState('')
  const [alertFeedback, setAlertFeedback] = useState('')
  const [ratingsByProfile, setRatingsByProfile] = useState({})

  const premiumLocked = plan !== 'premium'
  const totalResults = buyerRequests.length + companies.length

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (activeQuery.trim()) params.set('q', activeQuery.trim())
    if (!premiumLocked && filters.primary) params.set('primary', filters.primary)
    if (filters.category) params.set('category', filters.category)
    if (!premiumLocked && filters.moqRange) params.set('moqRange', filters.moqRange)
    if (!premiumLocked && filters.country) params.set('country', filters.country)
    if (!premiumLocked && filters.verifiedOnly) params.set('verifiedOnly', 'true')
    if (!premiumLocked && filters.orgType) params.set('orgType', filters.orgType)
    return params.toString()
  }, [activeQuery, filters, premiumLocked])

  const runSearch = useCallback(async () => {
    setLoading(true)
    setError('')
    setQuotaMessage('')
    setUpgradePrompt('')

    try {
      const [requestRes, companyRes] = await Promise.all([
        api(`/requirements/search?${queryString}`),
        api(`/products/search?${queryString}`),
      ])

      setBuyerRequests(toArray(requestRes).map(normalizeRequest))
      setCompanies(toArray(companyRes).map(normalizeCompany))

      const requirementQuota = requestRes?.quota
      const productQuota = companyRes?.quota
      const requirementPlan = requestRes?.plan || plan
      const hasAdvancedAccess = Boolean(requestRes?.capabilities?.filters?.advanced)
      setPlan(requirementPlan === 'premium' ? 'premium' : 'free')
      setCapabilityMessage(hasAdvancedAccess ? 'Advanced filters enabled for your plan.' : 'Advanced filters are locked on free plans.')
      if (requirementQuota || productQuota) {
        setQuotaMessage(`Daily quota remaining — Requirements: ${requirementQuota?.remaining ?? '-'}, Products: ${productQuota?.remaining ?? '-'}`)
      }
    } catch (err) {
      if (err.code === 'upgrade_required') {
        const blocked = err?.requirements?.advanced_filters?.join(', ')
        setError(`This filter is available on premium plans only.${blocked ? ` Blocked: ${blocked}.` : ''} Upgrade to unlock advanced search.`)
        setUpgradePrompt('Upgrade to Premium to unlock advanced filters and larger daily quotas.')
      } else if (err.code === 'limit_reached') {
        const remaining = Number.isFinite(err.remainingQuota) ? err.remainingQuota : err?.quota?.remaining
        setError(`Daily limit reached for this action.${remaining !== undefined ? ` Remaining today: ${remaining}` : ''}`)
      } else {
        setError(err.message || 'Failed to load search results')
      }
      setBuyerRequests([])
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }, [plan, queryString])

  useEffect(() => {
    api('/subscriptions/me')
      .then((sub) => setPlan(sub?.plan === 'premium' ? 'premium' : 'free'))
      .catch(() => setPlan('free'))
  }, [])

  useEffect(() => {
    runSearch()
  }, [runSearch])

  useEffect(() => {
    const keys = companies.map((company) => company.profileKey).filter(Boolean)
    if (!keys.length) {
      setRatingsByProfile({})
      return
    }

    api(`/ratings/profiles?profile_keys=${encodeURIComponent(keys.join(','))}`)
      .then((data) => setRatingsByProfile(data || {}))
      .catch(() => setRatingsByProfile({}))
  }, [companies])

  async function handleSaveAlert() {
    setAlertFeedback('')
    const query = searchQueryInput.trim()
    if (!query) {
      setAlertFeedback('Please enter a query before saving an alert.')
      return
    }

    try {
      const result = await api('/search/alerts', {
        method: 'POST',
        body: JSON.stringify({
          query,
          filters,
        }),
      })
      setAlertFeedback(`Alert saved for "${query}". Remaining alert quota: ${result?.quota?.remaining ?? '-'}`)
    } catch (err) {
      if (err.code === 'limit_reached') {
        setAlertFeedback(`You have reached your daily alert limit. Remaining today: ${err?.quota?.remaining ?? 0}`)
        return
      }
      setAlertFeedback(err.message || 'Failed to save alert')
    }
  }

  function submitSearch(e) {
    e.preventDefault()
    setActiveQuery(searchQueryInput)
  }

  function handlePremiumFilterChange(key, value) {
    if (premiumLocked) {
      setUpgradePrompt('Upgrade to premium to use advanced filters.')
      return
    }
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-gray-50 neo-panel cyberpunk-card">
      <div className="max-w-7xl mx-auto p-4">
        <form onSubmit={submitSearch} className="mb-4 flex flex-col gap-2 md:flex-row">
          <input
            value={searchQueryInput}
            onChange={(e) => setSearchQueryInput(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
            placeholder="Search buyer requests and products"
          />
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Search</button>
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button type="button" onClick={handleSaveAlert} className="rounded-lg border border-blue-600 px-4 py-2 text-blue-700 hover:bg-blue-50">
            Save Alert
          </button>
        </form>

        <p className="mb-2 text-xs text-gray-600">Current plan: <strong className="uppercase">{plan}</strong></p>
        {premiumLocked && <p className="mb-4 rounded border border-amber-300 bg-amber-50 p-2 text-sm text-amber-800">Upgrade to Premium to unlock advanced filters and higher daily limits.</p>}
        {upgradePrompt && <p className="mb-4 rounded border border-amber-300 bg-amber-50 p-2 text-sm text-amber-800">{upgradePrompt}</p>}
        {alertFeedback && <p className="mb-4 text-sm text-blue-700">{alertFeedback}</p>}
        {quotaMessage && <p className="mb-2 text-xs text-gray-600">{quotaMessage}</p>}
        {capabilityMessage && <p className="mb-4 text-xs text-gray-600">{capabilityMessage}</p>}

        {showFilters && (
          <div className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Filter Results</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Filter {premiumLocked && <span className="text-xs text-amber-700">(Premium)</span>}</label>
                <select
                  value={filters.primary}
                  onChange={(e) => handlePremiumFilterChange('primary', e.target.value)}
                  disabled={premiumLocked}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">All</option>
                  <option value="garments">Garments</option>
                  <option value="textile">Textile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">All</option>
                  <option value="shirt">Shirt</option>
                  <option value="pants">Pants</option>
                  <option value="knitwear">Knitwear</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MOQ Range {premiumLocked && <span className="text-xs text-amber-700">(Premium)</span>}</label>
                <select
                  value={filters.moqRange}
                  onChange={(e) => handlePremiumFilterChange('moqRange', e.target.value)}
                  disabled={premiumLocked}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Any</option>
                  <option value="0-500">0-500</option>
                  <option value="500-1000">500-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country {premiumLocked && <span className="text-xs text-amber-700">(Premium)</span>}</label>
                <input
                  value={filters.country}
                  onChange={(e) => handlePremiumFilterChange('country', e.target.value)}
                  disabled={premiumLocked}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onChange={(e) => handlePremiumFilterChange('verifiedOnly', e.target.checked)}
                  disabled={premiumLocked}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <label htmlFor="verifiedOnly" className="ml-2 text-sm text-gray-700">
                  Verified Only {premiumLocked && <span className="text-xs text-amber-700">(Premium)</span>}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type {premiumLocked && <span className="text-xs text-amber-700">(Premium)</span>}</label>
                <select
                  value={filters.orgType}
                  onChange={(e) => handlePremiumFilterChange('orgType', e.target.value)}
                  disabled={premiumLocked}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">All</option>
                  <option value="buyer">Buyer</option>
                  <option value="factory">Factory</option>
                  <option value="distributor">Distributor</option>
                </select>
              </div>
            </div>
            {premiumLocked && <p className="text-xs text-amber-700">Premium filters are visible for discovery and disabled on free plans.</p>}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Results for "<strong>{activeQuery}</strong>" ({totalResults} total)
          </p>

          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium text-sm transition border-b-2 ${
                activeTab === 'all'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              All ({totalResults})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 font-medium text-sm transition border-b-2 ${
                activeTab === 'requests'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Buyer Requests ({buyerRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-4 py-2 font-medium text-sm transition border-b-2 ${
                activeTab === 'companies'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Companies ({companies.length})
            </button>
          </div>
        </div>

        {loading && <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">Loading results...</div>}
        {!loading && error && <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>}
        {!loading && !error && totalResults === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
            No results found. Try adjusting your query or filters.
          </div>
        )}

        {!loading && !error && totalResults > 0 && (
          <div className="space-y-4">
            {(activeTab === 'all' || activeTab === 'requests') && (
              <div>
                {buyerRequests.map((req) => (
                  <div key={req.id} className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-6 mb-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-gray-900">{req.buyerName}</p>
                          {req.verified && <span className="text-blue-600 text-sm">✓ Verified</span>}
                        </div>
                        <p className="text-gray-700 mb-3">{req.requirement}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>📦 MOQ: {req.moq} units</span>
                          <span>⏰ Deadline: {req.deadline}</span>
                        </div>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition ml-4">
                        Take Lead
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'companies') && (
              <div>
                {companies.map((company) => (
                  <div key={company.id} className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-6 mb-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                          <div>
                            <p className="font-semibold text-gray-900">{company.name}</p>
                            <p className="text-sm text-gray-600">{company.category}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">⭐ {ratingsByProfile?.[company.profileKey]?.aggregate?.average_score || '0.0'} ({ratingsByProfile?.[company.profileKey]?.aggregate?.total_count || 0} reviews)</div>
                        <div className="mt-1 text-xs text-gray-500">Breakdown: 5★ {ratingsByProfile?.[company.profileKey]?.breakdown?.[5] || 0} • 4★ {ratingsByProfile?.[company.profileKey]?.breakdown?.[4] || 0} • 3★ {ratingsByProfile?.[company.profileKey]?.breakdown?.[3] || 0}</div>
                        {company.hasVideo && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                            <span>🎬</span>
                            <span>Video available</span>
                          </div>
                        )}
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition ml-4">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <FloatingAssistant />
    </div>
  )
}
