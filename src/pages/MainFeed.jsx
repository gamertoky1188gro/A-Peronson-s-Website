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
  if (Array.isArray(value.feed)) return value.feed
  if (Array.isArray(value.data)) return value.data
  return []
}

function normalizeFeedItem(raw) {
  const entityType = raw.feed_type || raw.entityType || raw.type || (raw.requirement ? 'buyer_request' : 'company_product')
  const isBuyerRequest = entityType === 'buyer_request' || entityType === 'buyer-request' || entityType === 'request'
  return {
    id: raw.id ?? raw._id,
    entityType: isBuyerRequest ? 'buyer_request' : 'company_product',
    author: {
      id: raw.author_id || raw.company_id || raw.buyer_id || null,
      name: raw.author?.name || raw.organization_name || raw.company_name || raw.org || raw.buyerName || raw.name || 'Unknown organization',
      accountType: raw.author?.accountType || raw.company_role || raw.orgType || (isBuyerRequest ? 'Buyer' : 'Factory'),
    },
    verified: Boolean(raw.verified || raw.author?.verified),
    createdAt: raw.createdAt || raw.created_at || null,
    content: raw.content || raw.requirement || raw.custom_description || raw.description || raw.title || '',
    deadline: raw.deadline || raw.timeline_days || null,
    tags: Array.isArray(raw.tags) ? raw.tags : [raw.category, raw.material].filter(Boolean),
    mediaReviewStatus: raw.video_review_status || 'approved',
    hasVideo: Boolean(raw.hasVideo || (raw.video_review_status === 'approved' && raw.video_url)),
  }
}

function formatRelativeTime(dateInput) {
  if (!dateInput) return 'Unknown time'
  const value = new Date(dateInput)
  if (Number.isNaN(value.getTime())) return String(dateInput)
  const diffMs = Date.now() - value.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

export default function MainFeed() {
  const [uniqueToggle, setUniqueToggle] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionFeedback, setActionFeedback] = useState('')
  const [user, setUser] = useState(null)

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts
    if (activeFilter === 'requests') return posts.filter((post) => post.entityType === 'buyer_request')
    return posts.filter((post) => post.entityType === 'company_product')
  }, [activeFilter, posts])

  const suggestedConnections = useMemo(() => {
    const uniq = []
    const seen = new Set([user?.name])
    for (const post of posts) {
      if (!seen.has(post.author.name)) {
        seen.add(post.author.name)
        uniq.push(post.author.name)
      }
      if (uniq.length === 5) break
    }
    return uniq
  }, [posts, user?.name])

  const trendingTags = useMemo(() => {
    const freq = new Map()
    posts.forEach((post) => post.tags.forEach((tag) => freq.set(tag, (freq.get(tag) || 0) + 1)))
    return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [posts])

  const activeBuyers = useMemo(() => {
    const buyers = posts.filter((p) => p.entityType === 'buyer_request').map((p) => p.author.name)
    return [...new Set(buyers)].slice(0, 5)
  }, [posts])

  const loadUser = useCallback(async () => {
    try {
      const profile = await api('/auth/me')
      setUser(profile?.user || null)
    } catch {
      setUser(null)
    }
  }, [])

  const loadFeed = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const typeParam = activeFilter === 'requests' ? 'requests' : activeFilter === 'products' ? 'products' : 'all'
      const feedData = await api(`/feed?unique=${uniqueToggle}&type=${typeParam}`)
      const feedItems = toArray(feedData).map(normalizeFeedItem)
      setPosts(feedItems)
    } catch (err) {
      setError(err.message || 'Failed to load feed')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [activeFilter, uniqueToggle])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    loadFeed()
  }, [loadFeed])

  async function handleSocialAction(post, action) {
    setActionFeedback('')
    try {
      await api('/social/actions', {
        method: 'POST',
        body: JSON.stringify({ entityId: post.id, entityType: post.entityType, action }),
      })
      setActionFeedback(`${action.replace('_', ' ')} recorded`)
    } catch (err) {
      setActionFeedback(err.message || `Failed to ${action}`)
    }
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-gray-50 neo-panel cyberpunk-card">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4">
        <div className="col-span-3 hidden lg:block space-y-4">
          <div className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name || 'Logged-in user'}</p>
                <p className="text-xs text-gray-600">{user?.role ? `${user.role.replaceAll('_', ' ')}` : 'Member'} Account</p>
              </div>
            </div>
            <hr className="my-4" />
            <div className="space-y-2 text-sm">
              <p className="text-gray-700"><span className="font-semibold">{suggestedConnections.length}</span> Connections</p>
              <p className="text-gray-700"><span className="font-semibold">{posts.length}</span> Feed Items</p>
            </div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Unique Algorithm</p>
                <p className="text-xs text-gray-600">Diversify your feed</p>
              </div>
              <button onClick={() => setUniqueToggle((current) => !current)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${uniqueToggle ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white neo-panel cyberpunk-card transition ${uniqueToggle ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900 text-sm mb-3">Quick Filters</p>
            <div className="space-y-2">
              <button onClick={() => setActiveFilter('all')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeFilter === 'all' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>All Posts</button>
              <button onClick={() => setActiveFilter('requests')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeFilter === 'requests' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>🔹 Buyer Requests</button>
              <button onClick={() => setActiveFilter('products')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeFilter === 'products' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>🏭 Company Products</button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 space-y-4">
          {actionFeedback && <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">{actionFeedback}</div>}
          {loading && <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">Loading feed...</div>}
          {!loading && error && <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>}
          {!loading && !error && filteredPosts.length === 0 && <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">No feed items found for this filter.</div>}

          {!loading && !error && filteredPosts.map((post) => (
            <div key={`${post.entityType}-${post.id}`} className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{post.author.name}</p>
                        {post.verified && <span className="text-blue-600">✓</span>}
                      </div>
                      <p className="text-xs text-gray-600">{post.author.accountType}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{formatRelativeTime(post.createdAt)}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-800 mb-3">{post.content}</p>
                {post.hasVideo && <div className="bg-gray-100 rounded-lg p-8 text-center mb-3 border-2 border-dashed border-gray-300"><span className="text-3xl">🎬</span><p className="text-sm text-gray-600 mt-2">Video available</p></div>}
                {post.tags.length > 0 && <div className="flex flex-wrap gap-2">{post.tags.map((tag, i) => <span key={`${post.id}-${tag}-${i}`} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">{tag}</span>)}</div>}
              </div>

              <div className="px-4 py-3 bg-gray-50 neo-panel cyberpunk-card border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                <div className="flex gap-4">
                  <button onClick={() => handleSocialAction(post, 'comment')} className="hover:text-blue-600 transition">💬 Comment</button>
                  <button onClick={() => handleSocialAction(post, 'share')} className="hover:text-blue-600 transition">↗️ Share</button>
                  <button onClick={() => handleSocialAction(post, 'save')} className="hover:text-blue-600 transition">⭐ Save</button>
                </div>
                {post.entityType === 'buyer_request' ? (
                  <button onClick={() => handleSocialAction(post, 'take_lead')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition">Take Lead</button>
                ) : (
                  <button onClick={() => handleSocialAction(post, 'message')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition">Message</button>
                )}
              </div>

              {post.deadline && <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200 text-xs text-yellow-800">⏰ Deadline: {post.deadline}</div>}
            </div>
          ))}
        </div>

        <div className="col-span-3 hidden xl:block space-y-4">
          <div className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900 mb-3">Suggested Connections</p>
            <div className="space-y-3">
              {suggestedConnections.length === 0 ? <p className="text-sm text-gray-500">No suggestions yet</p> : suggestedConnections.map((name) => (
                <div key={name} className="flex items-center justify-between">
                  <p className="text-sm text-gray-900">{name}</p>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold">Add</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900 mb-3">Trending Categories</p>
            <div className="space-y-2 text-sm">
              {trendingTags.length === 0 ? <p className="text-sm text-gray-500">No trend data yet</p> : trendingTags.map(([tag, count]) => (
                <div key={tag} className="flex justify-between text-gray-600"><span>{tag}</span><span className="font-semibold">{count}</span></div>
              ))}
            </div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900 mb-3">Recently Active Buyers</p>
            <div className="space-y-2 text-sm">
              {activeBuyers.length === 0 ? <p className="text-sm text-gray-500">No buyer activity yet</p> : activeBuyers.map((name) => (
                <div key={name} className="flex items-center gap-2 text-gray-600"><span className="text-green-500">●</span><span>{name}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
