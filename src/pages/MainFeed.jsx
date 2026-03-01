import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function MainFeed() {
  const [uniqueToggle, setUniqueToggle] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  // Sample posts/cards
  const posts = [
    {
      id: 1,
      type: 'buyer-request',
      org: 'Global Apparel Co',
      verified: true,
      accountType: 'Buyer',
      time: '2 hours ago',
      content: 'Looking for cotton t-shirt manufacturers with MOQ 500 units',
      deadline: '2026-03-15',
      tags: ['Cotton', 'T-Shirts', 'MOQ 500+'],
    },
    {
      id: 2,
      type: 'factory',
      org: 'Premier Textile Mills',
      verified: true,
      accountType: 'Factory',
      time: '4 hours ago',
      content: 'Specialized in knitted textiles and sustainable fabrics',
      hasVideo: true,
      tags: ['Knitted', 'Sustainable'],
    },
    {
      id: 3,
      type: 'buyer-request',
      org: 'Fashion Forward Ltd',
      verified: false,
      accountType: 'Buyer',
      time: '6 hours ago',
      content: 'Urgent: Need denim manufacturers for winter collection',
      deadline: '2026-02-28',
      tags: ['Denim', 'Winter', 'Urgent'],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAVBAR */}
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4">
        {/* LEFT SIDEBAR */}
        <div className="col-span-3 hidden lg:block space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900">Your Name</p>
                <p className="text-xs text-gray-600">Buyer Account</p>
              </div>
            </div>
            <hr className="my-4" />
            <div className="space-y-2 text-sm">
              <p className="text-gray-700"><span className="font-semibold">12</span> Connections</p>
              <p className="text-gray-700"><span className="font-semibold">5</span> Saved Items</p>
            </div>
          </div>

          {/* Unique Toggle */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Unique Algorithm</p>
                <p className="text-xs text-gray-600">Diversify your feed</p>
              </div>
              <button
                onClick={() => setUniqueToggle(!uniqueToggle)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  uniqueToggle ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    uniqueToggle ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900 text-sm mb-3">Quick Filters</p>
            <div className="space-y-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeFilter === 'all' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setActiveFilter('requests')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeFilter === 'requests' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                🔹 Buyer Requests
              </button>
              <button
                onClick={() => setActiveFilter('products')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeFilter === 'products' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                🏭 Company Products
              </button>
            </div>
          </div>
        </div>

        {/* MAIN FEED */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{post.org}</p>
                        {post.verified && <span className="text-blue-600">✓</span>}
                      </div>
                      <p className="text-xs text-gray-600">{post.accountType}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{post.time}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-800 mb-3">{post.content}</p>

                {post.hasVideo && (
                  <div className="bg-gray-100 rounded-lg p-8 text-center mb-3 border-2 border-dashed border-gray-300">
                    <span className="text-3xl">🎬</span>
                    <p className="text-sm text-gray-600 mt-2">Video available</p>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                <div className="flex gap-4">
                  <button className="hover:text-blue-600 transition">💬 Comment</button>
                  <button className="hover:text-blue-600 transition">↗️ Share</button>
                  <button className="hover:text-blue-600 transition">⭐ Save</button>
                </div>
                {post.type === 'buyer-request' && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition">
                    Take Lead
                  </button>
                )}
                {post.type === 'factory' && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition">
                    Message
                  </button>
                )}
              </div>

              {post.deadline && (
                <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200 text-xs text-yellow-800">
                  ⏰ Deadline: {post.deadline}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-3 hidden xl:block space-y-4">
          {/* Suggested Connections */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900 mb-3">Suggested Connections</p>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <p className="text-sm text-gray-900">Company {i}</p>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold">Add</button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900 mb-3">Trending Categories</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>T-Shirts</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Denim</span>
                <span className="font-semibold">134</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Sustainable Fabric</span>
                <span className="font-semibold">98</span>
              </div>
            </div>
          </div>

          {/* Recently Active Buyers */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900 mb-3">Recently Active Buyers</p>
            <div className="space-y-2 text-sm">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">●</span>
                  <span>Buyer Company {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING ASSISTANT */}
      <FloatingAssistant />
    </div>
  )
}
