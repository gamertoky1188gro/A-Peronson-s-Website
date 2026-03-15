import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, History, ShieldAlert, Sparkles, Trash2 } from 'lucide-react'
import { apiRequest, getToken } from '../lib/auth'
import ProductQuickViewModal from '../components/products/ProductQuickViewModal'

const TABS = [
  { id: 'all', label: 'All', icon: Bell },
  { id: 'smart_search_match', label: 'Search Matches', icon: Sparkles },
  { id: 'conversation_lock', label: 'Conversation Locks', icon: ShieldAlert },
  { id: 'rating_feedback_request', label: 'Rating Requests', icon: ShieldAlert },
  { id: 'system', label: 'System', icon: Bell },
  { id: 'viewed', label: 'Viewed Products', icon: History },
]

function feedLinkForEntity(entityType, entityId) {
  if (!entityType || !entityId) return '/feed'
  return `/feed?item=${encodeURIComponent(`${entityType}:${entityId}`)}`
}

export default function NotificationsCenter() {
  const token = useMemo(() => getToken(), [])
  const [tab, setTab] = useState('all')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [items, setItems] = useState([])
  const [alerts, setAlerts] = useState([])

  const [views, setViews] = useState([])
  const [viewsCursor, setViewsCursor] = useState(0)
  const [viewsNext, setViewsNext] = useState(null)
  const [loadingViews, setLoadingViews] = useState(false)
  const [quickViewItem, setQuickViewItem] = useState(null)

  const loadNotifications = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/notifications', { token })
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load notifications')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [token])

  const loadAlerts = useCallback(async () => {
    if (!token) return
    try {
      const data = await apiRequest('/notifications/search-alerts', { token })
      setAlerts(Array.isArray(data) ? data : [])
    } catch {
      setAlerts([])
    }
  }, [token])

  const loadViews = useCallback(async ({ reset }) => {
    if (!token) return
    const cursor = reset ? 0 : viewsCursor
    setLoadingViews(true)
    try {
      const data = await apiRequest(`/products/views/me?cursor=${cursor}&limit=10`, { token })
      const rows = Array.isArray(data?.items) ? data.items : []
      setViews((prev) => (reset ? rows : [...prev, ...rows]))
      setViewsCursor(reset ? 10 : cursor + 10)
      setViewsNext(data?.next_cursor ?? null)
    } catch {
      if (reset) setViews([])
      setViewsNext(null)
    } finally {
      setLoadingViews(false)
    }
  }, [token, viewsCursor])

  useEffect(() => {
    loadNotifications()
    loadAlerts()
  }, [loadAlerts, loadNotifications])

  useEffect(() => {
    if (tab !== 'viewed') return
    if (views.length) return
    loadViews({ reset: true })
  }, [loadViews, tab, views.length])

  async function markRead(id) {
    if (!token || !id) return
    await apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH', token })
    await loadNotifications()
  }

  async function deleteAlert(id) {
    if (!token || !id) return
    await apiRequest(`/notifications/search-alerts/${encodeURIComponent(id)}`, { method: 'DELETE', token })
    await loadAlerts()
  }

  const filteredItems = useMemo(() => {
    const base = items.filter((it) => {
      if (unreadOnly && it.read) return false
      if (tab === 'all') return it.type !== 'viewed'
      if (tab === 'viewed') return false
      return it.type === tab
    })
    return base
  }, [items, tab, unreadOnly])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        <main className="col-span-12 lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-slate-900">Notifications</p>
                <p className="text-[11px] text-slate-500">Smart search matches, system alerts, and your viewed history.</p>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="h-4 w-4" />
                Unread only
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {TABS.map((t) => {
                const Icon = t.icon
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                      active ? 'border-[#0A66C2] bg-[#0A66C2]/5 text-[#0A66C2]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {tab !== 'viewed' ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              {loading ? <div className="text-sm text-slate-600">Loading…</div> : null}
              {!loading && error ? <div className="text-sm text-rose-700">{error}</div> : null}
              {!loading && !error && !filteredItems.length ? (
                <div className="text-sm text-slate-600">No notifications for this tab.</div>
              ) : null}

              <div className="space-y-3">
                {filteredItems.map((i) => (
                  <div key={i.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{i.message || i.title || 'Notification'}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{new Date(i.created_at).toLocaleString()}</p>
                      <p className="mt-1 text-[11px] text-slate-500">Type: {i.type}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        to={feedLinkForEntity(i.entity_type, i.entity_id)}
                        className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
                      >
                        View
                      </Link>
                      {!i.read ? (
                        <button onClick={() => markRead(i.id)} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                          Mark read
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">Viewed Products</p>
                  <p className="text-[11px] text-slate-500">Private to you • Recorded on Quick View</p>
                </div>
                <button
                  type="button"
                  onClick={() => loadViews({ reset: true })}
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-3">
                {views.map((row) => (
                  <div key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{row.product?.title || 'Product'}</p>
                      <p className="mt-1 text-[11px] text-slate-500 truncate">{row.author?.name || 'Company'} • {new Date(row.viewed_at).toLocaleString()}</p>
                      <p className="mt-2 text-xs text-slate-600">
                        {row.product?.category || '—'} • MOQ {row.product?.moq || '—'} • Lead time {row.product?.lead_time_days || '—'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuickViewItem({ ...row.product, author: row.author })}
                        className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Quick view
                      </button>
                      {row.author?.id ? (
                        <Link
                          to={row.author.role === 'buying_house' ? `/buying-house/${row.author.id}` : `/factory/${row.author.id}`}
                          className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
                        >
                          Company
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}

                {loadingViews ? <div className="text-sm text-slate-600">Loading…</div> : null}
                {!views.length && !loadingViews ? <div className="text-sm text-slate-600">No viewed products yet.</div> : null}
              </div>

              {viewsNext !== null && !loadingViews ? (
                <button
                  type="button"
                  onClick={() => loadViews({ reset: false })}
                  className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Load more
                </button>
              ) : null}
            </div>
          )}
        </main>

        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-900">Saved Search Alerts</p>
            <p className="mt-1 text-[11px] text-slate-500">These power smart notifications for new matching posts.</p>
            <div className="mt-3 space-y-2">
              {alerts.length ? alerts.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{a.query}</p>
                    <p className="text-[11px] text-slate-500">Updated: {new Date(a.updated_at || a.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAlert(a.id)}
                    className="rounded-full border border-slate-200 p-2 hover:bg-rose-50"
                    aria-label="Delete alert"
                    title="Delete alert"
                  >
                    <Trash2 size={16} className="text-rose-600" />
                  </button>
                </div>
              )) : (
                <div className="text-xs text-slate-500">No saved alerts yet. Save an alert from the search page.</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-900">Tips</p>
            <ul className="mt-2 text-xs text-slate-600 space-y-1">
              <li>- Smart matches trigger when new buyer requests or products match your saved alert keywords.</li>
              <li>- Use verification and credibility to reduce fraud risk.</li>
              <li>- Viewed history is private and helps you revisit products quickly.</li>
            </ul>
          </div>
        </aside>
      </div>

      <ProductQuickViewModal
        open={Boolean(quickViewItem)}
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onViewed={() => loadViews({ reset: true })}
      />
    </div>
  )
}

