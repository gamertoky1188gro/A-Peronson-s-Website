    1 | /*
    2 |   Route: /factory/:id
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
   13 |     - Render the Factory profile (overview + products + requests as applicable).
   14 |     - Highlight verification/trust and show credibility meter (VerificationPanel).
   15 |     - Provide relationship actions (follow/connect/message) depending on backend support.
   16 | 
   17 |   Key API endpoints:
   18 |     - GET /api/profiles/:id
   19 |     - GET /api/profiles/:id/products?cursor=...
   20 |     - GET /api/ratings/profiles/user::id (public ratings summary)
   21 | */
   22 | import React, { useCallback, useEffect, useMemo, useState } from 'react'
   23 | import { useNavigate, useParams } from 'react-router-dom'
   24 | import { motion, useReducedMotion } from 'framer-motion'
   25 | import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
   26 | import { trackClientEvent } from '../lib/events'
   27 | import { recordLeadSource } from '../lib/leadSource'
   28 | import VerificationPanel from '../components/profile/VerificationPanel'
   29 | import CrmSummaryPanel from '../components/profile/CrmSummaryPanel'
   30 | 
   31 | const Motion = motion
   32 | 
   33 | function roleToRoute(role, id) {
   34 |   // Safety redirect helper: ensures we land on the correct profile route for a given role.
   35 |   if (!id) return '/feed'
   36 |   if (role === 'buyer') return `/buyer/${encodeURIComponent(id)}`
   37 |   if (role === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
   38 |   return `/factory/${encodeURIComponent(id)}`
   39 | }
   40 | 
   41 | function isApprovedVideo(product) {
   42 |   return Boolean(product?.video_url) && String(product?.video_review_status || '').toLowerCase() === 'approved' && !product?.video_restricted
   43 | }
   44 | 
   45 | function isBoostActive(boost) {
   46 |   if (!boost) return false
   47 |   if (String(boost.status || '').toLowerCase() !== 'active') return false
   48 |   const now = Date.now()
   49 |   const startsAt = new Date(boost.starts_at).getTime()
   50 |   const endsAt = new Date(boost.ends_at).getTime()
   51 |   if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false
   52 |   return now >= startsAt && now <= endsAt
   53 | }
   54 | 
   55 | export default function FactoryProfile() {
   56 |   const { id } = useParams()
   57 |   const navigate = useNavigate()
   58 |   const token = useMemo(() => getToken(), [])
   59 |   const currentUser = useMemo(() => getCurrentUser(), [])
   60 | 
   61 |   const [loading, setLoading] = useState(true)
   62 |   const [error, setError] = useState('')
   63 |   const [profile, setProfile] = useState(null)
   64 |   const [ratingSummary, setRatingSummary] = useState(null)
   65 |   const [certification, setCertification] = useState(null)
   66 | 
   67 |   const [activeTab, setActiveTab] = useState('overview')
   68 |   const [products, setProducts] = useState([])
   69 |   const [productsCursor, setProductsCursor] = useState(0)
   70 |   const [productsNext, setProductsNext] = useState(null)
   71 |   const [loadingProducts, setLoadingProducts] = useState(false)
   72 |   const [profileBoost, setProfileBoost] = useState(null)
   73 |   const reduceMotion = useReducedMotion()
   74 | 
   75 |   const user = profile?.user || null
   76 |   const verification = profile?.verification_summary || null
   77 |   const relationship = profile?.relationship || { following: false, friend_status: 'none' }
   78 |   const viewerPerms = profile?.viewer_permissions || { is_self: false, is_admin: false }
   79 |   const isPremium = String(user?.subscription_status || '').toLowerCase() === 'premium'
   80 |   const brandProfile = user?.profile || {}
   81 |   const hasBrandKit = Boolean(brandProfile.brand_name || brandProfile.brand_logo_url || brandProfile.brand_tagline || brandProfile.brand_website)
   82 |   const hasAccountManager = Boolean(brandProfile.account_manager_name || brandProfile.account_manager_email || brandProfile.account_manager_phone)
   83 |   const isCertified = String(certification?.status || '').toLowerCase() === 'certified'
   84 | 
   85 |   const loadProfile = useCallback(async () => {
   86 |     if (!id) return
   87 |     setLoading(true)
   88 |     setError('')
   89 |     try {
   90 |       const data = await apiRequest(`/profiles/${encodeURIComponent(id)}`, { token })
   91 |       if (data?.user?.role && data.user.role !== 'factory') {
   92 |         navigate(roleToRoute(data.user.role, id), { replace: true })
   93 |         return
   94 |       }
   95 |       setProfile(data)
   96 |     } catch (err) {
   97 |       setError(err.message || 'Failed to load profile')
   98 |       setProfile(null)
   99 |     } finally {
  100 |       setLoading(false)
  101 |     }
  102 |   }, [id, navigate, token])
  103 | 
  104 |   const loadRatings = useCallback(async () => {
  105 |     if (!id) return
  106 |     try {
  107 |       const data = await apiRequest(`/ratings/profiles/user:${encodeURIComponent(id)}`, { token: '' })
  108 |       setRatingSummary(data || null)
  109 |     } catch {
  110 |       setRatingSummary(null)
  111 |     }
  112 |   }, [id])
  113 | 
  114 |   const loadCertification = useCallback(async () => {
  115 |     if (!id || !token) return
  116 |     try {
  117 |       const data = await apiRequest(`/certifications/org/${encodeURIComponent(id)}`, { token })
  118 |       setCertification(data?.summary || null)
  119 |     } catch {
  120 |       setCertification(null)
  121 |     }
  122 |   }, [id, token])
  123 | 
  124 |   const loadProducts = useCallback(async ({ reset }) => {
  125 |     if (!id) return
  126 |     const cursor = reset ? 0 : productsCursor
  127 |     setLoadingProducts(true)
  128 |     try {
  129 |       const data = await apiRequest(`/profiles/${encodeURIComponent(id)}/products?cursor=${cursor}&limit=10`, { token })
  130 |       const rows = Array.isArray(data?.items) ? data.items : []
  131 |       setProducts((prev) => (reset ? rows : [...prev, ...rows]))
  132 |       setProductsCursor(reset ? 10 : cursor + 10)
  133 |       setProductsNext(data?.next_cursor ?? null)
  134 |     } catch {
  135 |       // ignore
  136 |     } finally {
  137 |       setLoadingProducts(false)
  138 |     }
  139 |   }, [id, productsCursor, token])
  140 | 
  141 |   useEffect(() => {
  142 |     loadProfile()
  143 |     loadRatings()
  144 |     loadCertification()
  145 |   }, [loadProfile, loadRatings, loadCertification])
  146 | 
  147 |   useEffect(() => {
  148 |     if (!user?.id) return
  149 |     trackClientEvent('profile_view', {
  150 |       entityType: 'profile',
  151 |       entityId: user.id,
  152 |       metadata: { role: user.role || 'factory' },
  153 |     })
  154 |   }, [user?.id, user?.role])
  155 | 
  156 |   useEffect(() => {
  157 |     if (!viewerPerms.is_self) return
  158 |     const tokenValue = getToken()
  159 |     if (!tokenValue) return
  160 |     apiRequest('/boosts/me', { token: tokenValue })
  161 |       .then((data) => {
  162 |         const active = (data?.items || []).find((boost) => boost.scope === 'profile' && isBoostActive(boost))
  163 |         setProfileBoost(active || null)
  164 |       })
  165 |       .catch(() => setProfileBoost(null))
  166 |   }, [viewerPerms.is_self])
  167 | 
  168 |   useEffect(() => {
  169 |     if (!['products', 'videos'].includes(activeTab)) return
  170 |     if (products.length) return
  171 |     loadProducts({ reset: true })
  172 |   }, [activeTab, loadProducts, products.length])
  173 | 
  174 |   async function follow() {
  175 |     if (!id) return
  176 |     try {
  177 |       const res = await apiRequest(`/users/${encodeURIComponent(id)}/follow`, { method: 'POST', token })
  178 |       setProfile((prev) => (prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev))
  179 |     } catch {
  180 |       // ignore
  181 |     }
  182 |   }
  183 | 
  184 |   async function connect() {
  185 |     if (!id) return
  186 |     try {
  187 |       const res = await apiRequest(`/users/${encodeURIComponent(id)}/friend-request`, { method: 'POST', token })
  188 |       setProfile((prev) => (prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev))
  189 |     } catch {
  190 |       // ignore
  191 |     }
  192 |   }
  193 | 
  194 |   function contact() {
  195 |     if (id) {
  196 |       recordLeadSource({
  197 |         type: 'direct',
  198 |         id: `profile:${id}`,
  199 |         label: `Profile: ${user?.name || 'factory'}`,
  200 |       })
  201 |     }
  202 |     navigate('/chat', { state: { notice: `Contacting ${user?.name || 'factory'}. If you are unverified, your first message may appear as a request.` } })
  203 |   }
  204 | 
  205 |   const visibleVideos = useMemo(() => {
  206 |     if (viewerPerms.is_self || viewerPerms.is_admin) return products.filter((p) => p.video_url)
  207 |     return products.filter(isApprovedVideo)
  208 |   }, [products, viewerPerms.is_admin, viewerPerms.is_self])
  209 |   const isBoosted = Boolean(profileBoost)
  210 | 
  211 |   if (loading) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Loading profile...</div>
  212 |   if (error) return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">{error}</div>
  213 |   if (!user) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>
  214 | 
  215 |   return (
  216 |     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
  217 |       <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
  218 |         <aside className="col-span-12 lg:col-span-4 space-y-4">
  219 |           <motion.div
  220 |             initial={reduceMotion ? false : { opacity: 0, y: 16 }}
  221 |             animate={reduceMotion ? false : { opacity: 1, y: 0 }}
  222 |             transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  223 |             className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800"
  224 |           >
  225 |             <div className="flex items-center gap-3">
  226 |               {user.profile?.profile_image ? (
  227 |                 <img src={user.profile.profile_image} alt={user.name} className="h-14 w-14 rounded-2xl object-cover" />
  228 |               ) : (
  229 |                 <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
  230 |               )}
  231 |               <div className="min-w-0">
  232 |                 <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
  233 |                 <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
  234 |                   <span className="uppercase">Factory</span>
  235 |                   {user.profile?.country ? <span>- {user.profile.country}</span> : null}
  236 |                   {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
  237 |                   {isCertified ? <span className="font-bold text-emerald-600">Certified</span> : null}
  238 |                   {isPremium ? <span title="Boosted visibility enabled for Premium" className="font-bold text-blue-600">Premium Reach</span> : null}
  239 |                   {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
  240 |                 </div>
  241 |               </div>
  242 |             </div>
  243 | 
  244 |             <div className="mt-4 flex gap-2">
  245 |               <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
  246 |               <button onClick={follow} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
  247 |                 {relationship.following ? 'Following' : 'Follow'}
  248 |               </button>
  249 |               <button onClick={connect} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
  250 |                 {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
  251 |               </button>
  252 |             </div>
  253 | 
  254 |             <div className="mt-4 grid grid-cols-1 gap-3">
  255 |               <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  256 |                 <p className="text-[11px] text-slate-500">Industry</p>
  257 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.industry || 'Garments & Textile'}</p>
  258 |               </div>
  259 |               <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  260 |                 <p className="text-[11px] text-slate-500">Organization</p>
  261 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
  262 |               </div>
  263 |               <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  264 |                 <p className="text-[11px] text-slate-500">Rating</p>
  265 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
  266 |                 <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
  267 |               </div>
  268 |             </div>
  269 |             <div className="mt-3 grid grid-cols-2 gap-3">
  270 |               <div className="rounded-xl borderless-shadow bg-white p-3">
  271 |                 <p className="text-[11px] text-slate-500">Capacity</p>
  272 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.monthly_capacity || '--'}</p>
  273 |                 <p className="text-[11px] text-slate-600">Monthly</p>
  274 |               </div>
  275 |               <div className="rounded-xl borderless-shadow bg-white p-3">
  276 |                 <p className="text-[11px] text-slate-500">MOQ</p>
  277 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.moq || '--'}</p>
  278 |                 <p className="text-[11px] text-slate-600">Declared</p>
  279 |               </div>
  280 |             </div>
  281 |           </motion.div>
  282 | 
  283 |           <VerificationPanel summary={verification} />
  284 |           {certification ? (
  285 |             <div className="mt-4 rounded-xl bg-white/60 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  286 |               <p className="text-[11px] text-slate-500">Order Completion Certification</p>
  287 |               <p className="mt-1 text-sm font-semibold text-slate-900">{certification.status || 'pending'}</p>
  288 |               <p className="text-[11px] text-slate-600">Signed contracts: {certification.signed_contracts ?? 0}</p>
  289 |             </div>
  290 |           ) : null}
  291 |         </aside>
  292 | 
  293 |         <main className="col-span-12 lg:col-span-8 space-y-4">
  294 |           <CrmSummaryPanel targetId={user.id} />
  295 |           <motion.div
  296 |             initial={reduceMotion ? false : { opacity: 0, y: 16 }}
  297 |             animate={reduceMotion ? false : { opacity: 1, y: 0 }}
  298 |             transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
  299 |             className="rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800"
  300 |           >
  301 |             <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
  302 |               {['overview', 'products', 'videos', 'reviews'].map((tab) => (
  303 |                 <button
  304 |                   key={tab}
  305 |                   type="button"
  306 |                   onClick={() => setActiveTab(tab)}
  307 |                   className={`relative rounded-full px-3 py-2 text-xs font-semibold transition ring-1 active:scale-95${
  308 |                     activeTab === tab
  309 |                       ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
  310 |                       : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
  311 |                   }`}
  312 |                 >
  313 |                   {activeTab === tab ? (
  314 |                     <motion.span
  315 |                       layoutId="profile-tab"
  316 |                       className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
  317 |                       transition={{ type: 'spring', stiffness: 420, damping: 34 }}
  318 |                     />
  319 |                   ) : null}
  320 |                   {tab === 'overview' ? 'Overview' : tab === 'products' ? 'Products' : tab === 'videos' ? 'Video Gallery' : 'Reviews'}
  321 |                 </button>
  322 |               ))}
  323 |             </div>
  324 | 
  325 |             <div className="p-4">
  326 |               {activeTab === 'overview' ? (
  327 |                 <div className="space-y-4">
  328 |                   <div>
  329 |                     <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
  330 |                     <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
  331 |                   </div>
  332 | 
  333 |                   {hasBrandKit ? (
  334 |                     <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  335 |                       <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Brand Kit</p>
  336 |                       <div className="mt-3 flex items-center gap-3">
  337 |                         {brandProfile.brand_logo_url ? (
  338 |                           <img src={brandProfile.brand_logo_url} alt="Brand logo" className="h-12 w-12 rounded-xl object-cover" />
  339 |                         ) : (
  340 |                           <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
  341 |                         )}
  342 |                         <div className="min-w-0">
  343 |                           <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
  344 |                             {brandProfile.brand_name || user.name}
  345 |                           </div>
  346 |                           {brandProfile.brand_tagline ? (
  347 |                             <div className="text-xs text-slate-600 dark:text-slate-300">{brandProfile.brand_tagline}</div>
  348 |                           ) : null}
  349 |                           {brandProfile.brand_website ? (
  350 |                             <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{brandProfile.brand_website}</div>
  351 |                           ) : null}
  352 |                         </div>
  353 |                       </div>
  354 |                     </div>
  355 |                   ) : null}
  356 | 
  357 |                   {isPremium && hasAccountManager ? (
  358 |                     <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  359 |                       <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dedicated Account Manager</p>
  360 |                       <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
  361 |                         {brandProfile.account_manager_name || 'Assigned manager'}
  362 |                       </div>
  363 |                       <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
  364 |                         {brandProfile.account_manager_email || brandProfile.account_manager_phone || ''}
  365 |                       </div>
  366 |                     </div>
  367 |                   ) : null}
  368 | 
  369 |                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
  370 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  371 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Industry</p>
  372 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.industry || 'Garments & Textile'}</p>
  373 |                     </div>
  374 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  375 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Organization</p>
  376 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
  377 |                     </div>
  378 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  379 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating</p>
  380 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
  381 |                       <p className="text-[11px] text-slate-600 dark:text-slate-400">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
  382 |                     </div>
  383 |                   </div>
  384 |                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
  385 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  386 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lead time</p>
  387 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.lead_time_days || '--'} days</p>
  388 |                     </div>
  389 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  390 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Certifications</p>
  391 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '--'}</p>
  392 |                     </div>
  393 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  394 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Employees</p>
  395 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.employee_count || '--'}</p>
  396 |                     </div>
  397 |                   </div>
  398 | 
  399 |                   {(user.profile?.companies_worked_with || []).length > 0 && (
  400 |                     <div>
  401 |                       <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Companies Worked With</p>
  402 |                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  403 |                         {(user.profile?.companies_worked_with || []).map((company, idx) => (
  404 |                           <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  405 |                             {company.logo ? (
  406 |                               <img src={company.logo} alt={company.name} className="h-10 w-10 rounded-lg object-cover" />
  407 |                             ) : (
  408 |                               <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500" />
  409 |                             )}
  410 |                             <div className="min-w-0 flex-1">
  411 |                               <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{company.name}</p>
  412 |                               {company.location && <p className="text-xs text-slate-500 dark:text-slate-400">{company.location}</p>}
  413 |                             </div>
  414 |                           </div>
  415 |                         ))}
  416 |                       </div>
  417 |                     </div>
  418 |                   )}
  419 |                 </div>
  420 |               ) : null}
  421 | 
  422 |               {activeTab === 'products' ? (
  423 |                 <div className="space-y-3">
  424 |                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  425 |                     {products.map((p) => (
  426 |                       <div key={p.id} className="rounded-2xl borderless-shadow bg-white p-4">
  427 |                         {p.cover_image_public_url ? (
  428 |                           <img src={p.cover_image_public_url} alt={p.title || 'Product'} className="h-32 w-full rounded-xl object-cover mb-3" />
  429 |                         ) : null}
  430 |                         <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
  431 |                         <p className="mt-1 text-xs text-slate-600">{p.category || '--'} - MOQ {p.moq || '--'} - Lead time {p.lead_time_days || '--'}</p>
  432 |                         <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
  433 |                         <p className="mt-2 text-[11px] text-slate-500">Status: {String(p.status || 'published')}</p>
  434 |                         {p.hasVideo ? <p className="mt-2 text-xs font-semibold text-indigo-700">Video available</p> : null}
  435 |                       </div>
  436 |                     ))}
  437 |                   </div>
  438 |                   {loadingProducts ? <div className="text-sm text-slate-600">Loading...</div> : null}
  439 |                   {productsNext !== null && !loadingProducts ? (
  440 |                     <button
  441 |                       type="button"
  442 |                       onClick={() => loadProducts({ reset: false })}
  443 |                       className="rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
  444 |                     >
  445 |                       Load more
  446 |                     </button>
  447 |                   ) : null}
  448 |                   {!products.length && !loadingProducts ? <div className="text-sm text-slate-600">No products found.</div> : null}
  449 |                 </div>
  450 |               ) : null}
  451 | 
  452 |               {activeTab === 'videos' ? (
  453 |                 <div className="space-y-3">
  454 |                   <p className="text-sm text-slate-700">
  455 |                     Only approved media is public. Pending or restricted media remains hidden unless you are the profile owner or an admin.
  456 |                   </p>
  457 |                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  458 |                     {visibleVideos.map((p) => (
  459 |                       <div key={p.id} className="rounded-2xl borderless-shadow bg-white p-4">
  460 |                         <p className="text-sm font-bold text-slate-900">{p.title || 'Video'}</p>
  461 |                         <p className="mt-1 text-xs text-slate-600">Status: {String(p.video_review_status || '--').replaceAll('_', ' ')}</p>
  462 |                         <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
  463 |                         {p.video_url ? (
  464 |                           <a href={p.video_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-[#0A66C2] hover:underline">
  465 |                             Open video link
  466 |                           </a>
  467 |                         ) : null}
  468 |                       </div>
  469 |                     ))}
  470 |                   </div>
  471 |                   {!visibleVideos.length && !loadingProducts ? <div className="text-sm text-slate-600">No public videos available.</div> : null}
  472 |                 </div>
  473 |               ) : null}
  474 | 
  475 |               {activeTab === 'reviews' ? (
  476 |                 <div className="space-y-3">
  477 |                   <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  478 |                     <p className="text-sm font-bold text-slate-900">Rating summary</p>
  479 |                     <p className="mt-1 text-sm text-slate-700">
  480 |                       {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 - {ratingSummary?.aggregate?.total_count ?? 0} reviews - {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
  481 |                     </p>
  482 |                   </div>
  483 |                   {(ratingSummary?.recent_reviews || []).map((r) => {
  484 |                     const canEdit = currentUser?.id && String(currentUser.id) === String(r.from_user_id || '')
  485 |                     return (
  486 |                       <div key={r.id} className="rounded-2xl borderless-shadow bg-white p-4">
  487 |                         <div className="flex items-start justify-between gap-3">
  488 |                           <div className="flex-1">
  489 |                             <p className="text-sm font-semibold text-slate-900">{r.score}* -- {r.reviewer_name || 'Anonymous'}</p>
  490 |                             <p className="mt-1 text-sm text-slate-700">{r.comment || 'No comment provided.'}</p>
  491 |                             <p className="mt-2 text-xs text-slate-500">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</p>
  492 |                           </div>
  493 |                           {canEdit ? (
  494 |                             <div className="flex flex-col gap-2">
  495 |                               <button
  496 |                                 type="button"
  497 |                                 className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
  498 |                                 onClick={async () => {
  499 |                                   const score = window.prompt('Update rating (1-5)', String(r.score || '5'))
  500 |                                   if (!score) return
  501 |                                   const comment = window.prompt('Update review comment', r.comment || '')
  502 |                                   try {
  503 |                                     await apiRequest(`/ratings/${r.id}`, { method: 'PATCH', token, body: { score: Number(score), comment: comment ?? '' } })
  504 |                                     await loadRatings()
  505 |                                   } catch {
  506 |                                     // ignore
  507 |                                   }
  508 |                                 }}
  509 |                               >
  510 |                                 Edit
  511 |                               </button>
  512 |                               <button
  513 |                                 type="button"
  514 |                                 className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
  515 |                                 onClick={async () => {
  516 |                                   if (!window.confirm('Delete this review?')) return
  517 |                                   try {
  518 |                                     await apiRequest(`/ratings/${r.id}`, { method: 'DELETE', token })
  519 |                                     await loadRatings()
  520 |                                   } catch {
  521 |                                     // ignore
  522 |                                   }
  523 |                                 }}
  524 |                               >
  525 |                                 Delete
  526 |                               </button>
  527 |                             </div>
  528 |                           ) : null}
  529 |                         </div>
  530 |                       </div>
  531 |                     )
  532 |                   })}
  533 |                   {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600">No reviews yet.</div> : null}
  534 |                 </div>
  535 |               ) : null}
  536 |             </div>
  537 |           </motion.div>
  538 |         </main>
  539 |       </div>
  540 |     </div>
  541 |   )
  542 | }
  543 | 
  544 | 