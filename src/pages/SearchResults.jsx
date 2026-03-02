import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'
import { apiRequest, getToken } from '../lib/auth'

export default function SearchResults() {
  const [searchQuery] = useState('cotton shirts MOQ 100+')
  const [showFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [filters, setFilters] = useState({
    primary: '',
    category: '',
    moqRange: '',
    country: '',
    verifiedOnly: false,
    orgType: '',
  })



  useEffect(() => {
    const token = getToken()
    if (!token) return
    apiRequest('/notifications/search-alerts', {
      method: 'POST',
      token,
      body: { query: searchQuery, filters },
    }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])
  // Sample results
  const buyerRequests = [
    {
      id: 1,
      buyerName: 'Global Apparel Co',
      verified: true,
      requirement: 'Cotton t-shirts with custom embroidery',
      deadline: '2026-03-15',
      moq: 500,
    },
    {
      id: 2,
      buyerName: 'Fashion Forward Ltd',
      verified: false,
      requirement: 'Denim jeans for winter collection',
      deadline: '2026-02-28',
      moq: 1000,
    },
  ]

  const factories = [
    {
      id: 1,
      name: 'Premier Textile Mills',
      category: 'Knitted Textiles',
      hasVideo: true,
    },
    {
      id: 2,
      name: 'Asia Garment Factory',
      category: 'Full Garment Production',
      hasVideo: false,
    },
    {
      id: 3,
      name: 'Eco Fabrics Ltd',
      category: 'Sustainable Fabrics',
      hasVideo: true,
    },
  ]

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-gray-50 neo-panel cyberpunk-card">
      {/* TOP NAVBAR */}
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-4">
        {/* FILTER PANEL */}
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

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
              Apply Filters
            </button>
          </div>
        )}

        {/* RESULTS HEADER */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Results for "<strong>{searchQuery}</strong>" ({buyerRequests.length + factories.length} total)
          </p>

          {/* TABS */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium text-sm transition border-b-2 ${
                activeTab === 'all'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              All ({buyerRequests.length + factories.length})
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
              Companies ({factories.length})
            </button>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="space-y-4">
          {/* BUYER REQUESTS */}
          {(activeTab === 'all' || activeTab === 'requests') && (
            <div>
              {buyerRequests.map(req => (
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

          {/* FACTORIES */}
          {(activeTab === 'all' || activeTab === 'companies') && (
            <div>
              {factories.map(factory => (
                <div key={factory.id} className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-6 mb-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                        <div>
                          <p className="font-semibold text-gray-900">{factory.name}</p>
                          <p className="text-sm text-gray-600">{factory.category}</p>
                        </div>
                      </div>
                      {factory.hasVideo && (
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
      </div>

      <FloatingAssistant />
    </div>
  )
}
