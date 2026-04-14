    1 | /*
    2 |   Route: /feed
    3 |   Access: Protected (login required)
    4 |   Allowed roles: buyer, buying_house, factory, owner, admin, agent
    5 | 
    6 |   Public Pages:
    7 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    8 |   Protected Pages (login required):
    9 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
   10 |     /notifications, /chat, /call, /verification, /verification-center
   11 | 
   12 |   Primary responsibilities:
   13 |     - Render the main "work" feed (buyer requests + company products).
   14 |     - Provide filtering, sorting, and the "Unique toggle" mode.
   15 |     - Support actions: share/copy, open comments drawer, report modal, etc.
   16 | 
   17 |   Key API endpoints (high level):
   18 |     - GET /api/feed (and/or role-specific feed endpoints, depending on server implementation)
   19 |     - POST/PATCH for reactions/comments/reporting (via child components)
   20 | 
   21 |   Major UI/UX patterns:
   22 |     - Industrial-tech palette: slate-50 in light, slate-950-ish in dark (`#020617`).
   23 |     - Borderless depth: rings in dark mode (avoids global border overrides).
   24 |     - Skeleton shimmer while loading (App.css `.skeleton`).
   25 |     - Staggered entrance for feed items (Framer Motion).
   26 | */
   27 | import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
   28 | import { Link, useNavigate, useSearchParams } from 'react-router-dom'
   29 | import { motion, useReducedMotion } from 'framer-motion'
   30 | import FeedControlBar from '../components/feed/FeedControlBar'
   31 | import FeedItemCard from '../components/feed/FeedItemCard'
   32 | import CommentsDrawer from '../components/feed/CommentsDrawer'
   33 | import ReportModal from '../components/feed/ReportModal'
   34 | import useLocalStorageState from '../hooks/useLocalStorageState'
   35 | import { apiRequest, fetchCurrentUser, getCurrentUser, getToken, hasEntitlement } from '../lib/auth'
   36 | import { trackClientEvent } from '../lib/events'
   37 | import { recordLeadSource } from '../lib/leadSource'
   38 | 
   39 | const Motion = motion
   40 | 
   41 | function formatRelativeTime(value) {
   42 |   // Convert an ISO timestamp into a short "Just now / 5m ago / 2h ago" label for feed cards.
   43 |   if (!value) return ''
   44 |   const date = new Date(value)
   45 |   if (Number.isNaN(date.getTime())) return ''
   46 |   const diffMs = Date.now() - date.getTime()
   47 |   const diffMinutes = Math.floor(diffMs / 60000)
   48 |   if (diffMinutes < 1) return 'Just now'
   49 |   if (diffMinutes < 60) return `${diffMinutes}m ago`
   50 |   const diffHours = Math.floor(diffMinutes / 60)
   51 |   if (diffHours < 24) return `${diffHours}h ago`
   52 |   const diffDays = Math.floor(diffHours / 24)
   53 |   return `${diffDays}d ago`
   54 | }
   55 | 
   56 | function buildFeedLeadLabel(item) {
   57 |   const title = String(item?.title || '').trim()
   58 |   if (title) return title
   59 |   const category = String(item?.category || '').trim()
   60 |   if (category) return category
   61 |   const content = String(item?.content || '').replace(/\s+/g, ' ').trim()
   62 |   if (content) return content.slice(0, 80)
   63 |   const author = String(item?.author?.name || '').trim()
   64 |   return author ? `${author} update` : 'Feed post'
   65 | }
   66 | 
   67 | function normalizeFeedItem(raw) {
   68 |   // Backend feed rows can be buyer requests or company products.
   69 |   // This function normalizes server shape -> UI shape so downstream components can be consistent.
   70 |   const entityType = raw.feed_type === 'buyer_request' ? 'buyer_request' : 'company_product'
   71 |   const isBuyerRequest = entityType === 'buyer_request'
   72 |   const authorId = raw.buyer_id || raw.company_id || raw.author_id || ''
   73 |   const accountType = raw.company_role || (isBuyerRequest ? 'buyer' : 'factory')
   74 |   const rolePath = accountType === 'buying_house' ? 'buying-house' : (accountType === 'buyer' ? 'buyer' : 'factory')
   75 |   const priorityUntil = raw.priority_until ? new Date(raw.priority_until).getTime() : 0
   76 |   const priorityActive = raw.priority_active !== undefined
   77 |     ? Boolean(raw.priority_active)
   78 |     : (String(raw.priority_tier || '').toLowerCase() === 'priority' && (!priorityUntil || priorityUntil > Date.now()))
   79 | 
   80 |   return {
   81 |     id: raw.id,
   82 |     entityType,
   83 |     author: {
   84 |       id: authorId,
   85 |       name: raw.author?.name || raw.company_name || raw.organization_name || raw.org || raw.name || 'Unknown',
   86 |       accountType: accountType ? String(accountType).replaceAll('_', ' ') : (isBuyerRequest ? 'Buyer' : 'Company'),
   87 |       rolePath,
   88 |     },
   89 |     verified: Boolean(raw.author?.verified || raw.verified),
   90 |     createdAt: formatRelativeTime(raw.created_at),
   91 |     content: isBuyerRequest ? (raw.custom_description || '') : (raw.description || ''),
   92 |     title: raw.title || '',
   93 |     category: raw.category || '',
   94 |     tags: [raw.category, raw.material].filter(Boolean),
   95 |     material: raw.material || '',
   96 |     quantity: raw.quantity || '',
   97 |     timelineDays: raw.timeline_days || '',
   98 |     shippingTerms: raw.shipping_terms || '',
   99 |     certifications: Array.isArray(raw.certifications_required) ? raw.certifications_required : [],
  100 |     moq: raw.moq || '',
  101 |     leadTimeDays: raw.lead_time_days || '',
  102 |     hasVideo: Boolean(raw.hasVideo || (!raw.video_restricted && raw.video_review_status === 'approved' && raw.video_url)),
  103 |     discussionActive: Boolean(raw.discussion_active),
  104 |     feedMetadata: raw.feed_metadata || {},
  105 |     priorityActive,
  106 |     certificationStatus: raw.order_certification_status || '',
  107 |   }
  108 | }
  109 | 
  110 | async function copyToClipboard(text) {
  111 |   // Utility used for "Copy link" / "Copy details" actions.
  112 |   // Uses modern Clipboard API when available, with a DOM fallback for older browsers.
  113 |   if (!text) return false
  114 |   if (navigator.clipboard?.writeText) {
  115 |     await navigator.clipboard.writeText(text)
  116 |     return true
  117 |   }
  118 | 
  119 |   const el = document.createElement('textarea')
  120 |   el.value = text
  121 |   el.setAttribute('readonly', 'true')
  122 |   el.style.position = 'fixed'
  123 |   el.style.left = '-9999px'
  124 |   document.body.appendChild(el)
  125 |   el.select()
  126 |   const ok = document.execCommand('copy')
  127 |   document.body.removeChild(el)
  128 |   return ok
  129 | }
  130 | 
  131 | function FeedSkeletonCard({ index }) {
  132 |   return (
  133 |     <div
  134 |       className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800"
  135 |       aria-hidden="true"
  136 |     >
  137 |       <div className="flex items-center gap-3">
  138 |         <div className="h-10 w-10 rounded-full skeleton" />
  139 |         <div className="flex-1 space-y-2">
  140 |           <div className="h-3 w-1/3 rounded-full skeleton" />
  141 |           <div className="h-2 w-1/4 rounded-full skeleton" />
  142 |         </div>
  143 |         <div className="h-6 w-16 rounded-full skeleton" />
  144 |       </div>
  145 |       <div className="mt-4 space-y-2">
  146 |         <div className="h-3 w-2/3 rounded-full skeleton" />
  147 |         <div className="h-3 w-1/2 rounded-full skeleton" />
  148 |         <div className="h-24 w-full rounded-xl skeleton" />
  149 |       </div>
  150 |       <div className="mt-4 flex items-center justify-between">
  151 |         <div className="h-3 w-32 rounded-full skeleton" />
  152 |         <div className="h-9 w-32 rounded-full skeleton" />
  153 |       </div>
  154 |       <span className="sr-only">Loading feed item {index + 1}</span>
  155 |     </div>
  156 |   )
  157 | }
  158 | 
  159 | export default function MainFeed() {
  160 |   // Router helpers:
  161 |   // - navigate: used for routing to profiles/chat/etc.
  162 |   // - searchParams: used to restore filters from URL query string.
  163 |   const navigate = useNavigate()
  164 |   const [searchParams] = useSearchParams()
  165 |   // Auth/session:
  166 |   // - token: bearer token for protected API calls
  167 |   // - sessionUser: cached user object stored client-side
  168 |   const token = useMemo(() => getToken(), [])
  169 |   const sessionUser = getCurrentUser()
  170 |   const userId = sessionUser?.id || 'user'
  171 |   // Persistent per-user key for the "Unique toggle" state.
  172 |   const uniqueKey = `gartexhub_unique:${userId}`
  173 | 
  174 |   // User snapshot (can be refreshed from server if needed).
  175 |   const [user, setUser] = useState(sessionUser)
  176 |   // Feed filters (type + category) and the unique-mode toggle.
  177 |   const [activeType, setActiveType] = useState('all')
  178 |   const [activeCategory, setActiveCategory] = useState('')
  179 |   const [unique, setUnique] = useLocalStorageState(uniqueKey, false)
  180 | 
  181 |   // Feed data list + pagination cursor.
  182 |   const [items, setItems] = useState([])
  183 |   const [tags, setTags] = useState([])
  184 |   const [nextCursor, setNextCursor] = useState(0)
  185 |   const [loading, setLoading] = useState(true)
  186 |   const [loadingMore, setLoadingMore] = useState(false)
  187 |   const [error, setError] = useState('')
  188 |   const [notice, setNotice] = useState({ type: '', message: '' })
  189 | 
  190 |   const [commentsItem, setCommentsItem] = useState(null)
  191 |   const [reportItem, setReportItem] = useState(null)
  192 |   const [reportCooldowns, setReportCooldowns] = useState({})
  193 |   const [reportBusy, setReportBusy] = useState(false)
  194 |   const [expressBusyId, setExpressBusyId] = useState('')
  195 |   const [claimedRequestId, setClaimedRequestId] = useState('')
  196 |   const [earlyVerifiedFactories, setEarlyVerifiedFactories] = useState([])
  197 |   const [earlyVerifiedError, setEarlyVerifiedError] = useState('')
  198 |   const [earlyVerifiedLoading, setEarlyVerifiedLoading] = useState(false)
  199 | 
  200 |   const highlightKey = searchParams.get('item') || ''
  201 |   const sentinelRef = useRef(null)
  202 |   const reduceMotion = useReducedMotion()
  203 | 
  204 |   const canExpressInterest = useMemo(() => {
  205 |     const role = user?.role || ''
  206 |     return role === 'buying_house' || role === 'admin'
  207 |   }, [user?.role])
  208 | 
  209 |   const isBuyer = String(user?.role || '').toLowerCase() === 'buyer'
  210 |   const canEarlyAccess = hasEntitlement(user, 'early_access_verified_factories')
  211 | 
  212 |   const headerLabel = useMemo(() => {
  213 |     if (activeType === 'requests') return 'Buyer Requests'
  214 |     if (activeType === 'products') return 'Company Products'
  215 |     return ''
  216 |   }, [activeType])
  217 | 
  218 |   const loadUser = useCallback(async () => {
  219 |     try {
  220 |       const fresh = await fetchCurrentUser(token)
  221 |       if (fresh) setUser(fresh)
  222 |     } catch {
  223 |       // ignore
  224 |     }
  225 |   }, [token])
  226 | 
  227 |   const loadFeedPage = useCallback(async ({ reset }) => {
  228 |     const limit = 12
  229 |     const cursor = reset ? 0 : Number(nextCursor || 0)
  230 | 
  231 |     if (reset) {
  232 |       setLoading(true)
  233 |       setError('')
  234 |       setNotice({ type: '', message: '' })
  235 |     } else {
  236 |       setLoadingMore(true)
  237 |       setError('')
  238 |     }
  239 | 
  240 |     try {
  241 |       // Role-based feed filtering:
  242 |       // - Buyer: sees products + only their own requests
  243 |       // - Factory/Buying House: sees all buyer requests
  244 |       const role = user?.role || ''
  245 |       let feedType = activeType
  246 | 
  247 |       // Override feed type based on role if 'all' is selected
  248 |       if (activeType === 'all') {
  249 |         if (role === 'buyer') {
  250 |           feedType = 'products' // Buyers see products by default, not all buyer requests
  251 |         } else if (role === 'factory' || role === 'buying_house') {
  252 |           feedType = 'requests' // Factory/Buying House see buyer requests by default
  253 |         }
  254 |       }
  255 | 
  256 |       const query = new URLSearchParams({
  257 |         unique: unique ? 'true' : 'false',
  258 |         type: feedType,
  259 |         category: activeCategory,
  260 |         cursor: String(cursor),
  261 |         limit: String(limit),
  262 |         role_filter: 'true',
  263 |       }).toString()
  264 |       const data = await apiRequest(`/feed?${query}`, { token })
  265 |       const rows = Array.isArray(data?.items) ? data.items : []
  266 |       const normalized = rows.map(normalizeFeedItem)
  267 | 
  268 |       setTags(Array.isArray(data?.tags) ? data.tags : [])
  269 |       setItems((previous) => (reset ? normalized : [...previous, ...normalized]))
  270 | 
  271 |       const serverNext = data?.next_cursor
  272 |       setNextCursor(serverNext === null || serverNext === undefined ? null : serverNext)
  273 | 
  274 |       if (reset) {
  275 |         normalized.slice(0, 6).forEach((item) => {
  276 |           trackClientEvent('feed_item_viewed', {
  277 |             entityType: item.entityType,
  278 |             entityId: item.id,
  279 |           })
  280 |         })
  281 |       }
  282 |     } catch (err) {
  283 |       setError(err.message || 'Failed to load feed')
  284 |       if (reset) setItems([])
  285 |       setNextCursor(null)
  286 |     } finally {
  287 |       setLoading(false)
  288 |       setLoadingMore(false)
  289 |     }
  290 |   }, [activeCategory, activeType, nextCursor, token, unique, user?.role])
  291 | 
  292 |   useEffect(() => {
  293 |     loadUser()
  294 |   }, [loadUser])
  295 | 
  296 |   useEffect(() => {
  297 |     let alive = true
  298 |     if (!token || !isBuyer) return undefined
  299 |     if (!canEarlyAccess) {
  300 |       setEarlyVerifiedFactories([])
  301 |       setEarlyVerifiedError('')
  302 |       return undefined
  303 |     }
  304 |     setEarlyVerifiedLoading(true)
  305 |     apiRequest('/users/verified/early', { token })
  306 |       .then((data) => {
  307 |         if (!alive) return
  308 |         setEarlyVerifiedFactories(Array.isArray(data?.items) ? data.items : [])
  309 |         setEarlyVerifiedError('')
  310 |       })
  311 |       .catch((err) => {
  312 |         if (!alive) return
  313 |         setEarlyVerifiedFactories([])
  314 |         setEarlyVerifiedError(err.message || 'Unable to load early verified factories')
  315 |       })
  316 |       .finally(() => {
  317 |         if (!alive) return
  318 |         setEarlyVerifiedLoading(false)
  319 |       })
  320 |     return () => {
  321 |       alive = false
  322 |     }
  323 |   }, [token, isBuyer, canEarlyAccess])
  324 | 
  325 |   useEffect(() => {
  326 |     setItems([])
  327 |     setNextCursor(0)
  328 |     loadFeedPage({ reset: true })
  329 |     // eslint-disable-next-line react-hooks/exhaustive-deps
  330 |   }, [activeType, activeCategory, unique])
  331 | 
  332 |   useEffect(() => {
  333 |     const node = sentinelRef.current
  334 |     if (!node) return undefined
  335 |     if (nextCursor === null || loadingMore || loading) return undefined
  336 | 
  337 |     const observer = new IntersectionObserver((entries) => {
  338 |       const entry = entries[0]
  339 |       if (entry?.isIntersecting && !loadingMore && !loading && nextCursor !== null) {
  340 |         loadFeedPage({ reset: false })
  341 |       }
  342 |     }, { rootMargin: '220px' })
  343 | 
  344 |     observer.observe(node)
  345 |     return () => observer.disconnect()
  346 |   }, [loadFeedPage, loading, loadingMore, nextCursor])
  347 | 
  348 |   function isReportCoolingDown(item) {
  349 |     const key = `${item.entityType}:${item.id}`
  350 |     const ends = reportCooldowns[key] || 0
  351 |     return ends > Date.now()
  352 |   }
  353 | 
  354 |   async function handleShare(item) {
  355 |     setNotice({ type: '', message: '' })
  356 |     try {
  357 |       await apiRequest(`/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}/share`, { method: 'POST', token })
  358 |       const url = `${window.location.origin}/feed?item=${encodeURIComponent(`${item.entityType}:${item.id}`)}`
  359 |       await copyToClipboard(url)
  360 |       setNotice({ type: 'success', message: 'Share link copied to clipboard.' })
  361 |     } catch (err) {
  362 |       setNotice({ type: 'error', message: err.message || 'Share failed.' })
  363 |     }
  364 |   }
  365 | 
  366 |   function handleMessage(item = null) {
  367 |     if (item?.id) {
  368 |       const sourceType = item.entityType === 'buyer_request'
  369 |         ? 'buyer_request'
  370 |         : (item.entityType === 'product' || item.entityType === 'company_product')
  371 |           ? 'product'
  372 |           : 'feed_post'
  373 |       recordLeadSource({
  374 |         type: sourceType,
  375 |         id: item.id,
  376 |         label: buildFeedLeadLabel(item),
  377 |       })
  378 |     }
  379 |     navigate('/chat', {
  380 |       state: {
  381 |         notice: 'Open chat from inbox. If you are unverified, your first message may appear as a message request.',
  382 |       },
  383 |     })
  384 |     setNotice({ type: 'info', message: 'Tip: unverified accounts start as message requests (anti-spam).' })
  385 |   }
  386 | 
  387 |   async function handleSubmitReport(reason) {
  388 |     if (!reportItem?.id || reportBusy) return
  389 |     if (isReportCoolingDown(reportItem)) return
  390 |     setReportBusy(true)
  391 |     setNotice({ type: '', message: '' })
  392 |     try {
  393 |       await apiRequest('/reports/content', {
  394 |         method: 'POST',
  395 |         token,
  396 |         body: { entity_type: reportItem.entityType, entity_id: reportItem.id, reason },
  397 |       })
  398 |       const key = `${reportItem.entityType}:${reportItem.id}`
  399 |       setReportCooldowns((prev) => ({ ...prev, [key]: Date.now() + 15000 }))
  400 |       setNotice({ type: 'success', message: 'Report submitted. Thank you.' })
  401 |       setReportItem(null)
  402 |     } catch (err) {
  403 |       setNotice({ type: 'error', message: err.message || 'Failed to submit report.' })
  404 |     } finally {
  405 |       setReportBusy(false)
  406 |     }
  407 |   }
  408 | 
  409 |   async function handleExpressInterest(item) {
  410 |     if (!item?.id || expressBusyId) return
  411 |     setExpressBusyId(item.id)
  412 |     setNotice({ type: '', message: '' })
  413 |     try {
  414 |       const response = await apiRequest(`/conversations/${encodeURIComponent(item.id)}/claim`, { method: 'POST', token })
  415 |       if (response?.status === 'locked') {
  416 |         setNotice({ type: 'error', message: 'Already claimed by another agent. Open chat to request access.' })
  417 |       } else if (response?.status === 'granted') {
  418 |         setNotice({ type: 'success', message: 'You already have access for this buyer request.' })
  419 |         setClaimedRequestId(item.id)
  420 |       } else {
  421 |         setNotice({ type: 'success', message: 'Interest recorded and conversation lock claimed.' })
  422 |         setClaimedRequestId(item.id)
  423 |       }
  424 |     } catch (err) {
  425 |       const message = err?.status === 409 ? 'Already claimed by another agent.' : (err.message || 'Failed to express interest.')
  426 |       setNotice({ type: 'error', message })
  427 |     } finally {
  428 |       setExpressBusyId('')
  429 |     }
  430 |   }
  431 | 
  432 |   const quickActions = useMemo(() => {
  433 |     const role = user?.role || ''
  434 |     if (role === 'buyer') {
  435 |       return [{ to: '/buyer-requests', label: 'Post a Buyer Request' }]
  436 |     }
  437 |     if (role === 'factory') {
  438 |       return [{ to: '/product-management', label: 'Post a Product' }, { to: '/member-management', label: 'Members' }]
  439 |     }
  440 |     if (role === 'buying_house') {
  441 |       return [{ to: '/product-management', label: 'Post a Product' }, { to: '/agent', label: 'Go to Agent Dashboard' }]
  442 |     }
  443 |     return [{ to: '/search', label: 'Search' }]
  444 |   }, [user?.role])
  445 | 
  446 |   return (
  447 |     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
  448 |       <FeedControlBar
  449 |         activeType={activeType}
  450 |         onTypeChange={(type) => {
  451 |           setActiveType(type)
  452 |           setNotice({ type: '', message: '' })
  453 |           setClaimedRequestId('')
  454 |         }}
  455 |         unique={Boolean(unique)}
  456 |         onUniqueChange={(value) => {
  457 |           setUnique(value)
  458 |           setNotice({ type: '', message: '' })
  459 |           setClaimedRequestId('')
  460 |         }}
  461 |         categories={tags}
  462 |         activeCategory={activeCategory}
  463 |         onCategoryChange={(category) => {
  464 |           setActiveCategory(category)
  465 |           setNotice({ type: '', message: '' })
  466 |           setClaimedRequestId('')
  467 |         }}
  468 |       />
  469 | 
  470 |       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 px-4 py-4">
  471 |         <aside className="col-span-12 lg:col-span-3 space-y-4">
  472 |           <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  473 |             <div className="flex items-center gap-3">
  474 |               <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
  475 |               <div className="min-w-0">
  476 |                 <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Member'}</p>
  477 |                 <p className="text-xs text-slate-500">{user?.role ? user.role.replaceAll('_', ' ') : 'Account'}</p>
  478 |               </div>
  479 |             </div>
  480 | 
  481 |             <div className="mt-4 borderless-divider-t pt-4">
  482 |               <p className="text-xs font-semibold text-slate-700 mb-2">Quick actions</p>
  483 |               <div className="flex flex-wrap gap-2">
  484 |                 {quickActions.map((a) => (
  485 |                   <Link
  486 |                     key={a.to}
  487 |                     to={a.to}
  488 |                     className="rounded-full borderless-shadow bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
  489 |                   >
  490 |                     {a.label}
  491 |                   </Link>
  492 |                 ))}
  493 |               </div>
  494 |             </div>
  495 |           </div>
  496 | 
  497 |           {headerLabel ? (
  498 |             <div className="hidden lg:block rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  499 |               <p className="text-xs font-semibold text-slate-500">Viewing</p>
  500 |               <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
  501 |               {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
  502 |             </div>
  503 |           ) : null}
  504 |         </aside>
  505 | 
  506 |         <main className="col-span-12 lg:col-span-6 space-y-4">
  507 |           {headerLabel ? (
  508 |             <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  509 |               <p className="text-xs font-semibold text-slate-500">Feed</p>
  510 |               <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
  511 |               {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
  512 |             </div>
  513 |           ) : null}
  514 | 
  515 |           {notice?.message ? (
  516 |             <div className={`rounded-2xl p-4 text-sm ring-1${
  517 |               notice.type === 'error'
  518 |                 ? 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30'
  519 |                 : notice.type === 'success'
  520 |                   ? 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/25'
  521 |                   : 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/25'
  522 |             }`}>
  523 |               <div className="flex items-center justify-between gap-3">
  524 |                 <p className="font-medium">{notice.message}</p>
  525 |                 {claimedRequestId ? (
  526 |                   <button
  527 |                     type="button"
  528 |                     onClick={() => navigate('/chat', { state: { notice: `Buyer request ${claimedRequestId} claimed. Open inbox to continue.` } })}
  529 |                     className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
  530 |                   >
  531 |                     Open Chat
  532 |                   </button>
  533 |                 ) : null}
  534 |               </div>
  535 |             </div>
  536 |           ) : null}
  537 | 
  538 |           {isBuyer ? (
  539 |             <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  540 |               <div className="flex items-center justify-between">
  541 |                 <div>
  542 |                   <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Early access: new verified factories</p>
  543 |                   <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified in the last 30 days</p>
  544 |                 </div>
  545 |                 {!canEarlyAccess ? (
  546 |                   <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
  547 |                     Premium
  548 |                   </span>
  549 |                 ) : null}
  550 |               </div>
  551 |               {!canEarlyAccess ? (
  552 |                 <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
  553 |                   Unlock early access to newly verified factories with a Premium plan.
  554 |                   <div className="mt-2">
  555 |                     <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
  556 |                   </div>
  557 |                 </div>
  558 |               ) : (
  559 |                 <div className="mt-3">
  560 |                   {earlyVerifiedLoading ? <div className="text-xs text-slate-500">Loading early access list...</div> : null}
  561 |                   {earlyVerifiedError ? <div className="text-xs text-rose-600">{earlyVerifiedError}</div> : null}
  562 |                   {!earlyVerifiedLoading && !earlyVerifiedError ? (
  563 |                     <div className="space-y-2">
  564 |                       {earlyVerifiedFactories.length ? earlyVerifiedFactories.slice(0, 6).map((factory) => (
  565 |                         <Link
  566 |                           key={factory.id}
  567 |                           to={`/factory/${encodeURIComponent(factory.id)}`}
  568 |                           className="block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
  569 |                         >
  570 |                           <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{factory.name || 'Factory'}</p>
  571 |                           <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{factory.country || '-'} · verified</p>
  572 |                         </Link>
  573 |                       )) : (
  574 |                         <div className="text-xs text-slate-500 dark:text-slate-400">No new verified factories yet.</div>
  575 |                       )}
  576 |                     </div>
  577 |                   ) : null}
  578 |                 </div>
  579 |               )}
  580 |             </div>
  581 |           ) : null}
  582 | 
  583 |           {loading ? (
  584 |             <div className="space-y-4">
  585 |               {Array.from({ length: 4 }).map((_, i) => (
  586 |                 <FeedSkeletonCard key={`feed-skel-${i}`} index={i} />
  587 |               ))}
  588 |             </div>
  589 |           ) : null}
  590 | 
  591 |           {!loading && error ? (
  592 |             <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30">
  593 |               {error}
  594 |               <div className="mt-3">
  595 |                 <button
  596 |                   type="button"
  597 |                   onClick={() => loadFeedPage({ reset: true })}
  598 |                   className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
  599 |                 >
  600 |                   Retry
  601 |                 </button>
  602 |               </div>
  603 |             </div>
  604 |           ) : null}
  605 | 
  606 |           {!loading && !error && items.length === 0 ? (
  607 |             <div className="rounded-2xl bg-[#ffffff] p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-800">
  608 |               No feed items found.
  609 |             </div>
  610 |           ) : null}
  611 | 
  612 |           {!loading && !error && items.map((item, idx) => {
  613 |             const highlight = highlightKey === `${item.entityType}:${item.id}`
  614 |             const reportDisabled = isReportCoolingDown(item)
  615 | 
  616 |             return (
  617 |               <motion.div
  618 |                 key={`${item.entityType}:${item.id}`}
  619 |                 initial={reduceMotion ? false : { opacity: 0, y: 20 }}
  620 |                 animate={reduceMotion ? false : { opacity: 1, y: 0 }}
  621 |                 transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
  622 |               >
  623 |                 <FeedItemCard
  624 |                   item={item}
  625 |                   highlight={highlight}
  626 |                   canExpressInterest={canExpressInterest && item.entityType === 'buyer_request'}
  627 |                   expressInterestDisabled={expressBusyId === item.id}
  628 |                   onExpressInterest={() => handleExpressInterest(item)}
  629 |                   onOpenComments={() => setCommentsItem(item)}
  630 |                   onShare={() => handleShare(item)}
  631 |                   onReport={() => {
  632 |                     if (reportDisabled) {
  633 |                       setNotice({ type: 'info', message: 'Please wait a few seconds before reporting again.' })
  634 |                       return
  635 |                     }
  636 |                     setReportItem(item)
  637 |                   }}
  638 |                   onMessage={() => handleMessage(item)}
  639 |                 />
  640 |               </motion.div>
  641 |             )
  642 |           })}
  643 | 
  644 |           <div ref={sentinelRef} className="h-10" />
  645 | 
  646 |           {loadingMore ? (
  647 |             <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  648 |               <div className="h-3 w-40 rounded-full skeleton mx-auto" />
  649 |             </div>
  650 |           ) : null}
  651 | 
  652 |           {!loading && !error && nextCursor === null ? (
  653 |             <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-3">You’re all caught up.</div>
  654 |           ) : null}
  655 |         </main>
  656 | 
  657 |         <aside className="col-span-3 hidden xl:block space-y-4">
  658 |           <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  659 |             <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tips</p>
  660 |             <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
  661 |               Turn on <span className="font-semibold">Unique</span> to avoid seeing only one product type all day. Use the category chips for fast filtering.
  662 |             </p>
  663 |             <div className="mt-3 flex gap-2">
  664 |               <Link to="/search" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Search</Link>
  665 |               <Link to="/notifications" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Alerts</Link>
  666 |             </div>
  667 |           </div>
  668 |         </aside>
  669 |       </div>
  670 | 
  671 |       <CommentsDrawer open={Boolean(commentsItem)} onClose={() => setCommentsItem(null)} item={commentsItem} />
  672 | 
  673 |       <ReportModal
  674 |         open={Boolean(reportItem)}
  675 |         item={reportItem}
  676 |         onClose={() => setReportItem(null)}
  677 |         onSubmit={(reason) => handleSubmitReport(reason)}
  678 |       />
  679 |     </div>
  680 |   )
  681 | }
  682 | 