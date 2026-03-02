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
    throw new Error(data?.error || data?.message || `Request failed (${res.status})`)
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

function normalizeCompany(raw) {
  return {
    id: raw.id ?? raw._id,
    name: raw.name || raw.organization_name || raw.org || raw.author?.name || 'Unknown company',
    category: raw.category || raw.primary_category || raw.material || 'General',
    hasVideo: Boolean(raw.hasVideo || raw.video_url),
  }
}

export default function SearchResults() {
  const [searchQueryInput, setSearchQueryInput] = useState('cotton shirts MOQ 100+')
  const [activeQuery, setActiveQuery] = useState('cotton shirts MOQ 100+')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
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
  const [alertFeedback, setAlertFeedback] = useState('')

  const totalResults = buyerRequests.length + companies.length

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (activeQuery.trim()) params.set('q', activeQuery.trim())
    if (filters.primary) params.set('primary', filters.primary)
    if (filters.category) params.set('category', filters.category)
    if (filters.moqRange) params.set('moqRange', filters.moqRange)
    if (filters.country) params.set('country', filters.country)
    if (filters.verifiedOnly) params.set('verifiedOnly', 'true')
    if (filters.orgType) params.set('orgType', filters.orgType)
    return params.toString()
  }, [activeQuery, filters])

  const runSearch = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [requestRes, companyRes] = await Promise.all([
        api(`/requirements/search?${queryString}`).catch(() => []),
        api(`/products/search?${queryString}`).catch(() => []),
      ])

      setBuyerRequests(toArray(requestRes).map(normalizeRequest))
      setCompanies(toArray(companyRes).map(normalizeCompany))
    } catch (err) {
      setError(err.message || 'Failed to load search results')
      setBuyerRequests([])
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }, [queryString])

  useEffect(() => {
    runSearch()
  }, [runSearch])

  async function handleSaveAlert() {
    setAlertFeedback('')
    const query = searchQueryInput.trim()
    if (!query) {
      setAlertFeedback('Please enter a query before saving an alert.')
      return
    }

    try {
      await api('/search/alerts', {
        method: 'POST',
        body: JSON.stringify({
          query,
          filters,
        }),
      })
      setAlertFeedback(`Alert saved for "${query}"`)
    } catch (err) {
      setAlertFeedback(err.message || 'Failed to save alert')
    }
  }

  function submitSearch(e) {
    e.preventDefault()
    setActiveQuery(searchQueryInput)
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

        {alertFeedback && <p className="mb-4 text-sm text-blue-700">{alertFeedback}</p>}

        {showFilters && (
          <div className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Filter Results</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Filter</label>
                <select
                  value={filters.primary}
                  onChange={(e) => setFilters({ ...filters, primary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">MOQ Range</label>
                <select
                  value={filters.moqRange}
                  onChange={(e) => setFilters({ ...filters, moqRange: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Any</option>
                  <option value="100-500">100-500</option>
                  <option value="500-1000">500-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">All</option>
                  <option value="bangladesh">Bangladesh</option>
                  <option value="india">India</option>
                  <option value="vietnam">Vietnam</option>
                  <option value="china">China</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="verifiedOnly" className="ml-2 text-sm text-gray-700">
                  Verified Only
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                <select
                  value={filters.orgType}
                  onChange={(e) => setFilters({ ...filters, orgType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">All</option>
                  <option value="buyer">Buyer</option>
                  <option value="factory">Factory</option>
                  <option value="distributor">Distributor</option>
                </select>
              </div>
            </div>
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
