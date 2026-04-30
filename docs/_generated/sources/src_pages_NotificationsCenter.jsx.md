    1 | /*
    2 |   Route: /notifications
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
   13 |     - Display system + workflow notifications (search matches, conversation locks, rating requests, etc.).
   14 |     - Provide tabbed filtering with animated active pill indicator.
   15 |     - Support actions like mark-as-read and manage search alerts.
   16 | 
   17 |   Key API endpoints:
   18 |     - GET /api/notifications
   19 |     - PATCH /api/notifications/:id/read
   20 |     - GET /api/notifications/search-alerts
   21 |     - DELETE /api/notifications/search-alerts/:id
   22 |     - GET /api/products/views/me (for the "Viewed Products" tab)
   23 | */
   24 | import React, { useCallback, useEffect, useMemo, useState } from 'react'
   25 | import { Link } from 'react-router-dom'
   26 | import { Bell, Factory, History, ShieldAlert, Sparkles, Trash2 } from 'lucide-react'
   27 | import { motion, useReducedMotion } from 'framer-motion'
   28 | import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
   29 | import ProductQuickViewModal from '../components/products/ProductQuickViewModal'
   30 | 
   31 | const Motion = motion
   32 | 
   33 | const TABS = [
   34 |   // Notification types supported by backend; used to filter the list on the client.
   35 |   { id: 'all', label: 'All', icon: Bell },
   36 |   { id: 'smart_search_match', label: 'Search Matches', icon: Sparkles },
   37 |   { id: 'partner_request', label: 'Partner Requests', icon: Factory },
   38 |   { id: 'conversation_lock', label: 'Conversation Locks', icon: ShieldAlert },
   39 |   { id: 'rating_feedback_request', label: 'Rating Requests', icon: ShieldAlert },
   40 |   { id: 'system', label: 'System', icon: Bell },
   41 |   { id: 'viewed', label: 'Viewed Products', icon: History },
   42 | ]
   43 | 
   44 | const TYPE_LABELS = {
   45 |   smart_search_match: 'Search Match',
   46 |   partner_request: 'Connection Request',
   47 |   conversation_lock: 'Conversation Lock',
   48 |   rating_feedback_request: 'Rating Request',
   49 |   monthly_summary: 'Monthly Summary',
   50 |   system: 'System',
   51 | }
   52 | 
   53 | function typeAccent(type = '') {
   54 |   const key = String(type || '').toLowerCase()
   55 |   if (key === 'partner_request') return 'bg-[#0A66C2]'
   56 |   if (key === 'smart_search_match') return 'bg-emerald-500'
   57 |   if (key === 'rating_feedback_request') return 'bg-amber-500'
   58 |   if (key === 'monthly_summary') return 'bg-indigo-500'
   59 |   if (key === 'conversation_lock') return 'bg-rose-500'
   60 |   return 'bg-slate-400'
   61 | }
   62 | 
   63 | function feedLinkForEntity(entityType, entityId) {
   64 |   // Build a deep-link to the feed filtered to a specific entity.
   65 |   if (!entityType || !entityId) return '/feed'
   66 |   return `/feed?item=${encodeURIComponent(`${entityType}:${entityId}`)}`
   67 | }
   68 | 
   69 | export default function NotificationsCenter() {
   70 |   const token = useMemo(() => getToken(), [])
   71 |   const user = useMemo(() => getCurrentUser(), [])
   72 |   const reduceMotion = useReducedMotion()
   73 |   const [tab, setTab] = useState('all')
   74 |   const [unreadOnly, setUnreadOnly] = useState(false)
   75 |   const [loading, setLoading] = useState(true)
   76 |   const [error, setError] = useState('')
   77 | 
   78 |   const [items, setItems] = useState([])
   79 |   const [alerts, setAlerts] = useState([])
   80 | 
   81 |   const [views, setViews] = useState([])
   82 |   const [viewsCursor, setViewsCursor] = useState(0)
   83 |   const [viewsNext, setViewsNext] = useState(null)
   84 |   const [loadingViews, setLoadingViews] = useState(false)
   85 |   const [quickViewItem, setQuickViewItem] = useState(null)
   86 | 
   87 |   const loadNotifications = useCallback(async () => {
   88 |     if (!token) return
   89 |     setLoading(true)
   90 |     setError('')
   91 |     try {
   92 |       const data = await apiRequest('/notifications', { token })
   93 |       setItems(Array.isArray(data) ? data : [])
   94 |     } catch (err) {
   95 |       setError(err.message || 'Failed to load notifications')
   96 |       setItems([])
   97 |     } finally {
   98 |       setLoading(false)
   99 |     }
  100 |   }, [token])
  101 | 
  102 |   const loadAlerts = useCallback(async () => {
  103 |     if (!token) return
  104 |     try {
  105 |       const data = await apiRequest('/notifications/search-alerts', { token })
  106 |       setAlerts(Array.isArray(data) ? data : [])
  107 |     } catch {
  108 |       setAlerts([])
  109 |     }
  110 |   }, [token])
  111 | 
  112 |   const loadViews = useCallback(async ({ reset }) => {
  113 |     if (!token) return
  114 |     const cursor = reset ? 0 : viewsCursor
  115 |     setLoadingViews(true)
  116 |     try {
  117 |       const data = await apiRequest(`/products/views/me?cursor=${cursor}&limit=10`, { token })
  118 |       const rows = Array.isArray(data?.items) ? data.items : []
  119 |       setViews((prev) => (reset ? rows : [...prev, ...rows]))
  120 |       setViewsCursor(reset ? 10 : cursor + 10)
  121 |       setViewsNext(data?.next_cursor ?? null)
  122 |     } catch {
  123 |       if (reset) setViews([])
  124 |       setViewsNext(null)
  125 |     } finally {
  126 |       setLoadingViews(false)
  127 |     }
  128 |   }, [token, viewsCursor])
  129 | 
  130 |   useEffect(() => {
  131 |     loadNotifications()
  132 |     loadAlerts()
  133 |   }, [loadAlerts, loadNotifications])
  134 | 
  135 |   useEffect(() => {
  136 |     if (tab !== 'viewed') return
  137 |     if (views.length) return
  138 |     loadViews({ reset: true })
  139 |   }, [loadViews, tab, views.length])
  140 | 
  141 |   async function markRead(id) {
  142 |     if (!token || !id) return
  143 |     await apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH', token })
  144 |     await loadNotifications()
  145 |   }
  146 | 
  147 |   async function respondPartnerRequest(requestId, action, notificationId) {
  148 |     if (!token || !requestId) return
  149 |     await apiRequest(`/partners/requests/${encodeURIComponent(requestId)}/${action}`, { method: 'POST', token })
  150 |     if (notificationId) {
  151 |       await apiRequest(`/notifications/${encodeURIComponent(notificationId)}/read`, { method: 'PATCH', token })
  152 |     }
  153 |     await loadNotifications()
  154 |   }
  155 | 
  156 |   async function deleteAlert(id) {
  157 |     if (!token || !id) return
  158 |     await apiRequest(`/notifications/search-alerts/${encodeURIComponent(id)}`, { method: 'DELETE', token })
  159 |     await loadAlerts()
  160 |   }
  161 | 
  162 |   const filteredItems = useMemo(() => {
  163 |     const base = items.filter((it) => {
  164 |       if (unreadOnly && it.read) return false
  165 |       if (tab === 'all') return it.type !== 'viewed'
  166 |       if (tab === 'viewed') return false
  167 |       return it.type === tab
  168 |     })
  169 |     return base
  170 |   }, [items, tab, unreadOnly])
  171 | 
  172 |   return (
  173 |     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
  174 |       <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
  175 |         <main className="col-span-12 lg:col-span-8 space-y-4">
  176 |           <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  177 |             <div className="flex items-center justify-between gap-3">
  178 |               <div>
  179 |                 <p className="text-lg font-bold text-slate-900">Notifications</p>
  180 |                 <p className="text-[11px] text-slate-500">Smart search matches, system alerts, and your viewed history.</p>
  181 |               </div>
  182 |               <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
  183 |                 <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="h-4 w-4" />
  184 |                 Unread only
  185 |               </label>
  186 |             </div>
  187 | 
  188 |             <div className="mt-4 flex flex-wrap gap-2">
  189 |               {TABS.map((t) => {
  190 |                 const Icon = t.icon
  191 |                 const active = tab === t.id
  192 |                 return (
  193 |                   <motion.button
  194 |                     key={t.id}
  195 |                     type="button"
  196 |                     onClick={() => setTab(t.id)}
  197 |                     whileTap={reduceMotion ? undefined : { scale: 0.98 }}
  198 |                     className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ring-1${
  199 |                       active
  200 |                         ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
  201 |                         : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
  202 |                     }`}
  203 |                   >
  204 |                     {active ? (
  205 |                       <motion.span
  206 |                         layoutId="notif-tab"
  207 |                         className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
  208 |                         transition={{ type: 'spring', stiffness: 420, damping: 34 }}
  209 |                       />
  210 |                     ) : null}
  211 |                     <span className="relative inline-flex items-center gap-2">
  212 |                       <Icon size={16} />
  213 |                       {t.label}
  214 |                     </span>
  215 |                   </motion.button>
  216 |                 )
  217 |               })}
  218 |             </div>
  219 |           </div>
  220 | 
  221 |           {tab !== 'viewed' ? (
  222 |             <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  223 |               {loading ? (
  224 |                 <div className="space-y-3">
  225 |                   {Array.from({ length: 6 }).map((_, i) => (
  226 |                     <div key={`notif-skel-${i}`} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10">
  227 |                       <div className="flex items-start justify-between gap-3">
  228 |                         <div className="min-w-0 flex-1 space-y-2">
  229 |                           <div className="h-3 w-1/3 rounded-full skeleton" />
  230 |                           <div className="h-3 w-2/3 rounded-full skeleton" />
  231 |                           <div className="h-3 w-1/2 rounded-full skeleton" />
  232 |                         </div>
  233 |                         <div className="h-8 w-20 rounded-full skeleton" />
  234 |                       </div>
  235 |                     </div>
  236 |                   ))}
  237 |                 </div>
  238 |               ) : null}
  239 |               {!loading && error ? <div className="text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}
  240 |               {!loading && !error && !filteredItems.length ? (
  241 |                 <div className="text-sm text-slate-600">No notifications for this tab.</div>
  242 |               ) : null}
  243 | 
  244 |               <div className="space-y-3">
  245 |                 {filteredItems.map((i) => (
  246 |                   <div key={i.id} className="relative overflow-hidden rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5">
  247 |                     <div className={`absolute left-0 top-0 h-full w-1${typeAccent(i.type)}`} />
  248 |                     <div className="flex items-start justify-between gap-4 pl-3">
  249 |                       <div className="min-w-0">
  250 |                         <div className="flex flex-wrap items-center gap-2">
  251 |                           <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
  252 |                             {TYPE_LABELS[i.type] || 'Update'}
  253 |                           </span>
  254 |                           {!i.read ? <span className="text-[10px] font-semibold text-emerald-600">New</span> : null}
  255 |                         </div>
  256 |                         <p className="mt-2 text-sm font-semibold text-slate-900">{i.message || i.title || 'Notification'}</p>
  257 |                         <p className="mt-1 text-[11px] text-slate-500">{new Date(i.created_at).toLocaleString()}</p>
  258 |                         {i.type === 'partner_request' ? (
  259 |                           <p className="mt-1 text-[11px] text-slate-500">
  260 |                             Request ID: {i?.meta?.request_id || i.entity_id}
  261 |                           </p>
  262 |                         ) : null}
  263 |                       </div>
  264 |                       <div className="flex flex-col gap-2 shrink-0">
  265 |                         {i.type === 'partner_request' && (user?.role === 'factory' || user?.role === 'admin' || user?.role === 'owner') ? (
  266 |                           <div className="flex flex-col gap-2">
  267 |                             <button
  268 |                               type="button"
  269 |                               onClick={() => respondPartnerRequest(i?.meta?.request_id || i.entity_id, 'accept', i.id)}
  270 |                               className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
  271 |                             >
  272 |                               Accept
  273 |                             </button>
  274 |                             <button
  275 |                               type="button"
  276 |                               onClick={() => respondPartnerRequest(i?.meta?.request_id || i.entity_id, 'reject', i.id)}
  277 |                               className="rounded-full borderless-shadow px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 text-center"
  278 |                             >
  279 |                               Reject
  280 |                             </button>
  281 |                           </div>
  282 |                         ) : i.type === 'rating_feedback_request' ? (
  283 |                           <Link
  284 |                             to={`/ratings/feedback?profile_key=${encodeURIComponent(i?.entity_id || i?.meta?.profile_key || '')}`}
  285 |                             className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
  286 |                           >
  287 |                             Rate now
  288 |                           </Link>
  289 |                         ) : i.entity_type ? (
  290 |                           <Link
  291 |                             to={feedLinkForEntity(i.entity_type, i.entity_id)}
  292 |                             className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
  293 |                           >
  294 |                             View
  295 |                           </Link>
  296 |                         ) : null}
  297 |                         {!i.read ? (
  298 |                           <button onClick={() => markRead(i.id)} className="rounded-full borderless-shadow px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
  299 |                             Mark read
  300 |                           </button>
  301 |                         ) : null}
  302 |                       </div>
  303 |                     </div>
  304 |                   </div>
  305 |                 ))}
  306 |               </div>
  307 |             </div>
  308 |           ) : (
  309 |             <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  310 |               <div className="flex items-center justify-between gap-3 mb-3">
  311 |                 <div>
  312 |                   <p className="text-sm font-bold text-slate-900">Viewed Products</p>
  313 |                   <p className="text-[11px] text-slate-500">Private to you - Recorded on Quick View</p>
  314 |                 </div>
  315 |                 <button
  316 |                   type="button"
  317 |                   onClick={() => loadViews({ reset: true })}
  318 |                   className="rounded-full borderless-shadow px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
  319 |                 >
  320 |                   Refresh
  321 |                 </button>
  322 |               </div>
  323 | 
  324 |               <div className="space-y-3">
  325 |                 {views.map((row) => (
  326 |                   <div key={row.id} className="rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5 flex items-start justify-between gap-3">
  327 |                     <div className="min-w-0">
  328 |                       <p className="text-sm font-semibold text-slate-900 truncate">{row.product?.title || 'Product'}</p>
  329 |                       <p className="mt-1 text-[11px] text-slate-500 truncate">{row.author?.name || 'Company'} - {new Date(row.viewed_at).toLocaleString()}</p>
  330 |                       <p className="mt-2 text-xs text-slate-600">
  331 |                         {row.product?.category || '--'} - MOQ {row.product?.moq || '--'} - Lead time {row.product?.lead_time_days || '--'}
  332 |                       </p>
  333 |                     </div>
  334 |                     <div className="flex flex-col gap-2 shrink-0">
  335 |                       <button
  336 |                         type="button"
  337 |                         onClick={() => setQuickViewItem({ ...row.product, author: row.author })}
  338 |                         className="rounded-full borderless-shadow px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
  339 |                       >
  340 |                         Quick view
  341 |                       </button>
  342 |                       {row.author?.id ? (
  343 |                         <Link
  344 |                           to={row.author.role === 'buying_house' ? `/buying-house/${row.author.id}` : `/factory/${row.author.id}`}
  345 |                           className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
  346 |                         >
  347 |                           Company
  348 |                         </Link>
  349 |                       ) : null}
  350 |                     </div>
  351 |                   </div>
  352 |                 ))}
  353 | 
  354 |                 {loadingViews ? <div className="text-sm text-slate-600">Loading...</div> : null}
  355 |                 {!views.length && !loadingViews ? <div className="text-sm text-slate-600">No viewed products yet.</div> : null}
  356 |               </div>
  357 | 
  358 |               {viewsNext !== null && !loadingViews ? (
  359 |                 <button
  360 |                   type="button"
  361 |                   onClick={() => loadViews({ reset: false })}
  362 |                   className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
  363 |                 >
  364 |                   Load more
  365 |                 </button>
  366 |               ) : null}
  367 |             </div>
  368 |           )}
  369 |         </main>
  370 | 
  371 |         <aside className="col-span-12 lg:col-span-4 space-y-4">
  372 |           <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  373 |             <p className="text-sm font-bold text-slate-900">Saved Search Alerts</p>
  374 |             <p className="mt-1 text-[11px] text-slate-500">These power smart notifications for new matching posts.</p>
  375 |             <div className="mt-3 space-y-2">
  376 |               {alerts.length ? alerts.map((a) => (
  377 |                 <div key={a.id} className="rounded-xl bg-white p-3 ring-1 ring-slate-200/70 shadow-sm dark:bg-white/5 dark:ring-white/10 flex items-start justify-between gap-2">
  378 |                   <div className="min-w-0">
  379 |                     <p className="text-xs font-semibold text-slate-900 truncate">{a.query}</p>
  380 |                     <p className="text-[11px] text-slate-500">Updated: {new Date(a.updated_at || a.created_at).toLocaleString()}</p>
  381 |                   </div>
  382 |                   <button
  383 |                     type="button"
  384 |                     onClick={() => deleteAlert(a.id)}
  385 |                     className="rounded-full borderless-shadow p-2 hover:bg-rose-50"
  386 |                     aria-label="Delete alert"
  387 |                     title="Delete alert"
  388 |                   >
  389 |                     <Trash2 size={16} className="text-rose-600" />
  390 |                   </button>
  391 |                 </div>
  392 |               )) : (
  393 |                 <div className="text-xs text-slate-500">No saved alerts yet. Save an alert from the search page.</div>
  394 |               )}
  395 |             </div>
  396 |           </div>
  397 | 
  398 |           <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
  399 |             <p className="text-sm font-bold text-slate-900">Tips</p>
  400 |             <ul className="mt-2 text-xs text-slate-600 space-y-1">
  401 |               <li>- Smart matches trigger when new buyer requests or products match your saved alert keywords.</li>
  402 |               <li>- Use verification and credibility to reduce fraud risk.</li>
  403 |               <li>- Viewed history is private and helps you revisit products quickly.</li>
  404 |             </ul>
  405 |           </div>
  406 |         </aside>
  407 |       </div>
  408 | 
  409 |       <ProductQuickViewModal
  410 |         open={Boolean(quickViewItem)}
  411 |         item={quickViewItem}
  412 |         onClose={() => setQuickViewItem(null)}
  413 |         onViewed={() => loadViews({ reset: true })}
  414 |       />
  415 |     </div>
  416 |   )
  417 | }
  418 | 
  419 | 