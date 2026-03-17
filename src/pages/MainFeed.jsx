import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import FeedControlBar from '../components/feed/FeedControlBar'
import FeedItemCard from '../components/feed/FeedItemCard'
import CommentsDrawer from '../components/feed/CommentsDrawer'
import ReportModal from '../components/feed/ReportModal'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { apiRequest, fetchCurrentUser, getCurrentUser, getToken } from '../lib/auth'

function formatRelativeTime(value) {
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
  const entityType = raw.feed_type === 'buyer_request' ? 'buyer_request' : 'company_product'
  const isBuyerRequest = entityType === 'buyer_request'
  const authorId = raw.buyer_id || raw.company_id || raw.author_id || ''
  const accountType = raw.company_role || (isBuyerRequest ? 'buyer' : 'factory')
  const rolePath = accountType === 'buying_house' ? 'buying-house' : (accountType === 'buyer' ? 'buyer' : 'factory')

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
  }
}

async function copyToClipboard(text) {
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = useMemo(() => getToken(), [])
  const sessionUser = getCurrentUser()
  const userId = sessionUser?.id || 'user'
  const uniqueKey = `gartexhub_unique:${userId}`

  const [user, setUser] = useState(sessionUser)
  const [activeType, setActiveType] = useState('all')
  const [activeCategory, setActiveCategory] = useState('')
  const [unique, setUnique] = useLocalStorageState(uniqueKey, false)

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

  const highlightKey = searchParams.get('item') || ''
  const sentinelRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const canExpressInterest = useMemo(() => {
    const role = user?.role || ''
    return role === 'buying_house' || role === 'admin'
  }, [user?.role])

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
      const data = await apiRequest(
        `/feed?unique=${unique ? 'true' : 'false'}&type=${encodeURIComponent(activeType)}&category=${encodeURIComponent(activeCategory)}&cursor=${cursor}&limit=${limit}`,
        { token },
      )
      const rows = Array.isArray(data?.items) ? data.items : []
      const normalized = rows.map(normalizeFeedItem)

      setTags(Array.isArray(data?.tags) ? data.tags : [])
      setItems((previous) => (reset ? normalized : [...previous, ...normalized]))

      const serverNext = data?.next_cursor
      setNextCursor(serverNext === null || serverNext === undefined ? null : serverNext)
    } catch (err) {
      setError(err.message || 'Failed to load feed')
      if (reset) setItems([])
      setNextCursor(null)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [activeCategory, activeType, nextCursor, token, unique])

  useEffect(() => {
    loadUser()
  }, [loadUser])

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
      await apiRequest(`/social/${encodeURIComponent(reportItem.entityType)}/${encodeURIComponent(reportItem.id)}/report`, {
        method: 'POST',
        token,
        body: { reason },
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

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Quick actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((a) => (
                  <Link
                    key={a.to}
                    to={a.to}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
            <div className={`rounded-2xl p-4 text-sm ring-1 ${
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
