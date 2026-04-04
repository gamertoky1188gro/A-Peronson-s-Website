/*
  Route: /feed
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Render the main "work" feed (buyer requests + company products).
    - Provide filtering, sorting, and the "Unique toggle" mode.
    - Support actions: share/copy, open comments drawer, report modal, etc.

  Key API endpoints (high level):
    - GET /api/feed (and/or role-specific feed endpoints, depending on server implementation)
    - POST/PATCH for reactions/comments/reporting (via child components)

  Major UI/UX patterns:
    - Industrial-tech palette: slate-50 in light, slate-950-ish in dark (`#020617`).
    - Borderless depth: rings in dark mode (avoids global border overrides).
    - Skeleton shimmer while loading (App.css `.skeleton`).
    - Staggered entrance for feed items (Framer Motion).
*/
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import FeedControlBar from '../components/feed/FeedControlBar'
import FeedItemCard from '../components/feed/FeedItemCard'
import CommentsDrawer from '../components/feed/CommentsDrawer'
import ReportModal from '../components/feed/ReportModal'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { apiRequest, fetchCurrentUser, getCurrentUser, getToken, hasEntitlement } from '../lib/auth'
import { trackClientEvent } from '../lib/events'

const Motion = motion

function formatRelativeTime(value) {
  // Convert an ISO timestamp into a short "Just now / 5m ago / 2h ago" label for feed cards.
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function normalizeFeedItem(raw) {
  // Backend feed rows can be buyer requests or company products.
  // This function normalizes server shape -> UI shape so downstream components can be consistent.
  const entityType = raw.feed_type === 'buyer_request' ? 'buyer_request' : 'company_product'
  const isBuyerRequest = entityType === 'buyer_request'
  const authorId = raw.buyer_id || raw.company_id || raw.author_id || ''
  const accountType = raw.company_role || (isBuyerRequest ? 'buyer' : 'factory')
  const rolePath = accountType === 'buying_house' ? 'buying-house' : (accountType === 'buyer' ? 'buyer' : 'factory')
  const priorityUntil = raw.priority_until ? new Date(raw.priority_until).getTime() : 0
  const priorityActive = raw.priority_active !== undefined
    ? Boolean(raw.priority_active)
    : (String(raw.priority_tier || '').toLowerCase() === 'priority' && (!priorityUntil || priorityUntil > Date.now()))

  return {
    id: raw.id,
    entityType,
    author: {
      id: authorId,
      name: raw.author?.name || raw.company_name || raw.organization_name || raw.org || raw.name || 'Unknown',
      accountType: accountType ? String(accountType).replaceAll('_', ' ') : (isBuyerRequest ? 'Buyer' : 'Company'),
      rolePath,
    },
    verified: Boolean(raw.author?.verified || raw.verified),
    createdAt: formatRelativeTime(raw.created_at),
    content: isBuyerRequest ? (raw.custom_description || '') : (raw.description || ''),
    title: raw.title || '',
    category: raw.category || '',
    tags: [raw.category, raw.material].filter(Boolean),
    material: raw.material || '',
    quantity: raw.quantity || '',
    timelineDays: raw.timeline_days || '',
    shippingTerms: raw.shipping_terms || '',
    certifications: Array.isArray(raw.certifications_required) ? raw.certifications_required : [],
    moq: raw.moq || '',
    leadTimeDays: raw.lead_time_days || '',
    hasVideo: Boolean(raw.hasVideo || (!raw.video_restricted && raw.video_review_status === 'approved' && raw.video_url)),
    discussionActive: Boolean(raw.discussion_active),
    feedMetadata: raw.feed_metadata || {},
    priorityActive,
    certificationStatus: raw.order_certification_status || '',
  }
}

async function copyToClipboard(text) {
  // Utility used for "Copy link" / "Copy details" actions.
  // Uses modern Clipboard API when available, with a DOM fallback for older browsers.
  if (!text) return false
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', 'true')
  el.style.position = 'fixed'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(el)
  return ok
}

function FeedSkeletonCard({ index }) {
  return (
    <div
      className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded-full skeleton" />
          <div className="h-2 w-1/4 rounded-full skeleton" />
        </div>
        <div className="h-6 w-16 rounded-full skeleton" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-2/3 rounded-full skeleton" />
        <div className="h-3 w-1/2 rounded-full skeleton" />
        <div className="h-24 w-full rounded-xl skeleton" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-32 rounded-full skeleton" />
        <div className="h-9 w-32 rounded-full skeleton" />
      </div>
      <span className="sr-only">Loading feed item {index + 1}</span>
    </div>
  )
}

export default function MainFeed() {
  // Router helpers:
  // - navigate: used for routing to profiles/chat/etc.
  // - searchParams: used to restore filters from URL query string.
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Auth/session:
  // - token: bearer token for protected API calls
  // - sessionUser: cached user object stored client-side
  const token = useMemo(() => getToken(), [])
  const sessionUser = getCurrentUser()
  const userId = sessionUser?.id || 'user'
  // Persistent per-user key for the "Unique toggle" state.
  const uniqueKey = `gartexhub_unique:${userId}`

  // User snapshot (can be refreshed from server if needed).
  const [user, setUser] = useState(sessionUser)
  // Feed filters (type + category) and the unique-mode toggle.
  const [activeType, setActiveType] = useState('all')
  const [activeCategory, setActiveCategory] = useState('')
  const [unique, setUnique] = useLocalStorageState(uniqueKey, false)

  // Feed data list + pagination cursor.
  const [items, setItems] = useState([])
  const [tags, setTags] = useState([])
  const [nextCursor, setNextCursor] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState({ type: '', message: '' })

  const [commentsItem, setCommentsItem] = useState(null)
  const [reportItem, setReportItem] = useState(null)
  const [reportCooldowns, setReportCooldowns] = useState({})
  const [reportBusy, setReportBusy] = useState(false)
  const [expressBusyId, setExpressBusyId] = useState('')
  const [claimedRequestId, setClaimedRequestId] = useState('')
  const [earlyVerifiedFactories, setEarlyVerifiedFactories] = useState([])
  const [earlyVerifiedError, setEarlyVerifiedError] = useState('')
  const [earlyVerifiedLoading, setEarlyVerifiedLoading] = useState(false)

  const highlightKey = searchParams.get('item') || ''
  const sentinelRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const canExpressInterest = useMemo(() => {
    const role = user?.role || ''
    return role === 'buying_house' || role === 'admin'
  }, [user?.role])

  const isBuyer = String(user?.role || '').toLowerCase() === 'buyer'
  const canEarlyAccess = hasEntitlement(user, 'early_access_verified_factories')

  const headerLabel = useMemo(() => {
    if (activeType === 'requests') return 'Buyer Requests'
    if (activeType === 'products') return 'Company Products'
    return ''
  }, [activeType])

  const loadUser = useCallback(async () => {
    try {
      const fresh = await fetchCurrentUser(token)
      if (fresh) setUser(fresh)
    } catch {
      // ignore
    }
  }, [token])

  const loadFeedPage = useCallback(async ({ reset }) => {
    const limit = 12
    const cursor = reset ? 0 : Number(nextCursor || 0)

    if (reset) {
      setLoading(true)
      setError('')
      setNotice({ type: '', message: '' })
    } else {
      setLoadingMore(true)
      setError('')
    }

    try {
      // Role-based feed filtering:
      // - Buyer: sees products + only their own requests
      // - Factory/Buying House: sees all buyer requests
      const role = user?.role || ''
      let feedType = activeType

      // Override feed type based on role if 'all' is selected
      if (activeType === 'all') {
        if (role === 'buyer') {
          feedType = 'products' // Buyers see products by default, not all buyer requests
        } else if (role === 'factory' || role === 'buying_house') {
          feedType = 'requests' // Factory/Buying House see buyer requests by default
        }
      }

      const query = new URLSearchParams({
        unique: unique ? 'true' : 'false',
        type: feedType,
        category: activeCategory,
        cursor: String(cursor),
        limit: String(limit),
        role_filter: 'true',
      }).toString()
      const data = await apiRequest(`/feed?${query}`, { token })
      const rows = Array.isArray(data?.items) ? data.items : []
      const normalized = rows.map(normalizeFeedItem)

      setTags(Array.isArray(data?.tags) ? data.tags : [])
      setItems((previous) => (reset ? normalized : [...previous, ...normalized]))

      const serverNext = data?.next_cursor
      setNextCursor(serverNext === null || serverNext === undefined ? null : serverNext)

      if (reset) {
        normalized.slice(0, 6).forEach((item) => {
          trackClientEvent('feed_item_viewed', {
            entityType: item.entityType,
            entityId: item.id,
          })
        })
      }
    } catch (err) {
      setError(err.message || 'Failed to load feed')
      if (reset) setItems([])
      setNextCursor(null)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [activeCategory, activeType, nextCursor, token, unique, user?.role])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    let alive = true
    if (!token || !isBuyer) return undefined
    if (!canEarlyAccess) {
      setEarlyVerifiedFactories([])
      setEarlyVerifiedError('')
      return undefined
    }
    setEarlyVerifiedLoading(true)
    apiRequest('/users/verified/early', { token })
      .then((data) => {
        if (!alive) return
        setEarlyVerifiedFactories(Array.isArray(data?.items) ? data.items : [])
        setEarlyVerifiedError('')
      })
      .catch((err) => {
        if (!alive) return
        setEarlyVerifiedFactories([])
        setEarlyVerifiedError(err.message || 'Unable to load early verified factories')
      })
      .finally(() => {
        if (!alive) return
        setEarlyVerifiedLoading(false)
      })
    return () => {
      alive = false
    }
  }, [token, isBuyer, canEarlyAccess])

  useEffect(() => {
    setItems([])
    setNextCursor(0)
    loadFeedPage({ reset: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType, activeCategory, unique])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return undefined
    if (nextCursor === null || loadingMore || loading) return undefined

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting && !loadingMore && !loading && nextCursor !== null) {
        loadFeedPage({ reset: false })
      }
    }, { rootMargin: '220px' })

    observer.observe(node)
    return () => observer.disconnect()
  }, [loadFeedPage, loading, loadingMore, nextCursor])

  function isReportCoolingDown(item) {
    const key = `${item.entityType}:${item.id}`
    const ends = reportCooldowns[key] || 0
    return ends > Date.now()
  }

  async function handleShare(item) {
    setNotice({ type: '', message: '' })
    try {
      await apiRequest(`/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}/share`, { method: 'POST', token })
      const url = `${window.location.origin}/feed?item=${encodeURIComponent(`${item.entityType}:${item.id}`)}`
      await copyToClipboard(url)
      setNotice({ type: 'success', message: 'Share link copied to clipboard.' })
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Share failed.' })
    }
  }

  function handleMessage() {
    navigate('/chat', {
      state: {
        notice: 'Open chat from inbox. If you are unverified, your first message may appear as a message request.',
      },
    })
    setNotice({ type: 'info', message: 'Tip: unverified accounts start as message requests (anti-spam).' })
  }

  async function handleSubmitReport(reason) {
    if (!reportItem?.id || reportBusy) return
    if (isReportCoolingDown(reportItem)) return
    setReportBusy(true)
    setNotice({ type: '', message: '' })
    try {
      await apiRequest('/reports/content', {
        method: 'POST',
        token,
        body: { entity_type: reportItem.entityType, entity_id: reportItem.id, reason },
      })
      const key = `${reportItem.entityType}:${reportItem.id}`
      setReportCooldowns((prev) => ({ ...prev, [key]: Date.now() + 15000 }))
      setNotice({ type: 'success', message: 'Report submitted. Thank you.' })
      setReportItem(null)
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Failed to submit report.' })
    } finally {
      setReportBusy(false)
    }
  }

  async function handleExpressInterest(item) {
    if (!item?.id || expressBusyId) return
    setExpressBusyId(item.id)
    setNotice({ type: '', message: '' })
    try {
      const response = await apiRequest(`/conversations/${encodeURIComponent(item.id)}/claim`, { method: 'POST', token })
      if (response?.status === 'locked') {
        setNotice({ type: 'error', message: 'Already claimed by another agent. Open chat to request access.' })
      } else if (response?.status === 'granted') {
        setNotice({ type: 'success', message: 'You already have access for this buyer request.' })
        setClaimedRequestId(item.id)
      } else {
        setNotice({ type: 'success', message: 'Interest recorded and conversation lock claimed.' })
        setClaimedRequestId(item.id)
      }
    } catch (err) {
      const message = err?.status === 409 ? 'Already claimed by another agent.' : (err.message || 'Failed to express interest.')
      setNotice({ type: 'error', message })
    } finally {
      setExpressBusyId('')
    }
  }

  const quickActions = useMemo(() => {
    const role = user?.role || ''
    if (role === 'buyer') {
      return [{ to: '/buyer-requests', label: 'Post a Buyer Request' }]
    }
    if (role === 'factory') {
      return [{ to: '/product-management', label: 'Post a Product' }, { to: '/member-management', label: 'Members' }]
    }
    if (role === 'buying_house') {
      return [{ to: '/product-management', label: 'Post a Product' }, { to: '/agent', label: 'Go to Agent Dashboard' }]
    }
    return [{ to: '/search', label: 'Search' }]
  }, [user?.role])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <FeedControlBar
        activeType={activeType}
        onTypeChange={(type) => {
          setActiveType(type)
          setNotice({ type: '', message: '' })
          setClaimedRequestId('')
        }}
        unique={Boolean(unique)}
        onUniqueChange={(value) => {
          setUnique(value)
          setNotice({ type: '', message: '' })
          setClaimedRequestId('')
        }}
        categories={tags}
        activeCategory={activeCategory}
        onCategoryChange={(category) => {
          setActiveCategory(category)
          setNotice({ type: '', message: '' })
          setClaimedRequestId('')
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 px-4 py-4">
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Member'}</p>
                <p className="text-xs text-slate-500">{user?.role ? user.role.replaceAll('_', ' ') : 'Account'}</p>
              </div>
            </div>

            <div className="mt-4 borderless-divider-t pt-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Quick actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((a) => (
                  <Link
                    key={a.to}
                    to={a.to}
                    className="rounded-full borderless-shadow bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {headerLabel ? (
            <div className="hidden lg:block rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-xs font-semibold text-slate-500">Viewing</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
          ) : null}
        </aside>

        <main className="col-span-12 lg:col-span-6 space-y-4">
          {headerLabel ? (
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-xs font-semibold text-slate-500">Feed</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
          ) : null}

          {notice?.message ? (
            <div className={`rounded-2xl p-4 text-sm ring-1${
              notice.type === 'error'
                ? 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30'
                : notice.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/25'
                  : 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/25'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{notice.message}</p>
                {claimedRequestId ? (
                  <button
                    type="button"
                    onClick={() => navigate('/chat', { state: { notice: `Buyer request ${claimedRequestId} claimed. Open inbox to continue.` } })}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
                  >
                    Open Chat
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {isBuyer ? (
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Early access: new verified factories</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified in the last 30 days</p>
                </div>
                {!canEarlyAccess ? (
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                    Premium
                  </span>
                ) : null}
              </div>
              {!canEarlyAccess ? (
                <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                  Unlock early access to newly verified factories with a Premium plan.
                  <div className="mt-2">
                    <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  {earlyVerifiedLoading ? <div className="text-xs text-slate-500">Loading early access list...</div> : null}
                  {earlyVerifiedError ? <div className="text-xs text-rose-600">{earlyVerifiedError}</div> : null}
                  {!earlyVerifiedLoading && !earlyVerifiedError ? (
                    <div className="space-y-2">
                      {earlyVerifiedFactories.length ? earlyVerifiedFactories.slice(0, 6).map((factory) => (
                        <Link
                          key={factory.id}
                          to={`/factory/${encodeURIComponent(factory.id)}`}
                          className="block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
                        >
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{factory.name || 'Factory'}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{factory.country || '-'} · verified</p>
                        </Link>
                      )) : (
                        <div className="text-xs text-slate-500 dark:text-slate-400">No new verified factories yet.</div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <FeedSkeletonCard key={`feed-skel-${i}`} index={i} />
              ))}
            </div>
          ) : null}

          {!loading && error ? (
            <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30">
              {error}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => loadFeedPage({ reset: true })}
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}

          {!loading && !error && items.length === 0 ? (
            <div className="rounded-2xl bg-[#ffffff] p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-800">
              No feed items found.
            </div>
          ) : null}

          {!loading && !error && items.map((item, idx) => {
            const highlight = highlightKey === `${item.entityType}:${item.id}`
            const reportDisabled = isReportCoolingDown(item)

            return (
              <motion.div
                key={`${item.entityType}:${item.id}`}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
              >
                <FeedItemCard
                  item={item}
                  highlight={highlight}
                  canExpressInterest={canExpressInterest && item.entityType === 'buyer_request'}
                  expressInterestDisabled={expressBusyId === item.id}
                  onExpressInterest={() => handleExpressInterest(item)}
                  onOpenComments={() => setCommentsItem(item)}
                  onShare={() => handleShare(item)}
                  onReport={() => {
                    if (reportDisabled) {
                      setNotice({ type: 'info', message: 'Please wait a few seconds before reporting again.' })
                      return
                    }
                    setReportItem(item)
                  }}
                  onMessage={() => handleMessage(item)}
                />
              </motion.div>
            )
          })}

          <div ref={sentinelRef} className="h-10" />

          {loadingMore ? (
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <div className="h-3 w-40 rounded-full skeleton mx-auto" />
            </div>
          ) : null}

          {!loading && !error && nextCursor === null ? (
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-3">You’re all caught up.</div>
          ) : null}
        </main>

        <aside className="col-span-3 hidden xl:block space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tips</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Turn on <span className="font-semibold">Unique</span> to avoid seeing only one product type all day. Use the category chips for fast filtering.
            </p>
            <div className="mt-3 flex gap-2">
              <Link to="/search" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Search</Link>
              <Link to="/notifications" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Alerts</Link>
            </div>
          </div>
        </aside>
      </div>

      <CommentsDrawer open={Boolean(commentsItem)} onClose={() => setCommentsItem(null)} item={commentsItem} />

      <ReportModal
        open={Boolean(reportItem)}
        item={reportItem}
        onClose={() => setReportItem(null)}
        onSubmit={(reason) => handleSubmitReport(reason)}
      />
    </div>
  )
}
