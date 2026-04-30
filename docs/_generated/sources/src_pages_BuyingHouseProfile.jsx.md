    1 | /*
    2 |   Route: /buying-house/:id
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
   13 |     - Render Buying House profile with enterprise-style trust and collaboration context.
   14 |     - Show verification/trust summary and credibility meter.
   15 |     - Show organization/agents and relationship actions (depending on backend data).
   16 | 
   17 |   Key API endpoints:
   18 |     - GET /api/profiles/:id
   19 |     - GET /api/ratings/profiles/user::id (public ratings summary)
   20 | */
   21 | import React, { useCallback, useEffect, useMemo, useState } from 'react'
   22 | import { useNavigate, useParams } from 'react-router-dom'
   23 | import { motion, useReducedMotion } from 'framer-motion'
   24 | import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
   25 | import { trackClientEvent } from '../lib/events'
   26 | import { recordLeadSource } from '../lib/leadSource'
   27 | import VerificationPanel from '../components/profile/VerificationPanel'
   28 | import CrmSummaryPanel from '../components/profile/CrmSummaryPanel'
   29 | 
   30 | const Motion = motion
   31 | 
   32 | function roleToRoute(role, id) {
   33 |   // Safety redirect helper: ensures we land on the correct profile route for a given role.
   34 |   if (!id) return '/feed'
   35 |   if (role === 'buyer') return `/buyer/${encodeURIComponent(id)}`
   36 |   if (role === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
   37 |   return `/factory/${encodeURIComponent(id)}`
   38 | }
   39 | 
   40 | function isBoostActive(boost) {
   41 |   if (!boost) return false
   42 |   if (String(boost.status || '').toLowerCase() !== 'active') return false
   43 |   const now = Date.now()
   44 |   const startsAt = new Date(boost.starts_at).getTime()
   45 |   const endsAt = new Date(boost.ends_at).getTime()
   46 |   if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false
   47 |   return now >= startsAt && now <= endsAt
   48 | }
   49 | 
   50 | export default function BuyingHouseProfile() {
   51 |   const { id } = useParams()
   52 |   const navigate = useNavigate()
   53 |   const token = useMemo(() => getToken(), [])
   54 |   const viewer = getCurrentUser()
   55 | 
   56 |   const [loading, setLoading] = useState(true)
   57 |   const [error, setError] = useState('')
   58 |   const [profile, setProfile] = useState(null)
   59 |   const [ratingSummary, setRatingSummary] = useState(null)
   60 |   const [certification, setCertification] = useState(null)
   61 |   const [notice, setNotice] = useState('')
   62 | 
   63 |   const [activeTab, setActiveTab] = useState('overview')
   64 |   const [products, setProducts] = useState([])
   65 |   const [productsCursor, setProductsCursor] = useState(0)
   66 |   const [productsNext, setProductsNext] = useState(null)
   67 |   const [loadingProducts, setLoadingProducts] = useState(false)
   68 |   const [profileBoost, setProfileBoost] = useState(null)
   69 | 
   70 |   const [partnerNetwork, setPartnerNetwork] = useState(null)
   71 |   const [loadingNetwork, setLoadingNetwork] = useState(false)
   72 |   const reduceMotion = useReducedMotion()
   73 | 
   74 |   const user = profile?.user || null
   75 |   const verification = profile?.verification_summary || null
   76 |   const relationship = profile?.relationship || { following: false, friend_status: 'none' }
   77 |   const viewerPerms = profile?.viewer_permissions || { is_self: false, is_admin: false }
   78 |   const isBoosted = Boolean(profileBoost)
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
   91 |       if (data?.user?.role && data.user.role !== 'buying_house') {
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
  141 |   const loadPartnerNetwork = useCallback(async () => {
  142 |     if (!id) return
  143 |     setLoadingNetwork(true)
  144 |     try {
  145 |       const data = await apiRequest(`/profiles/${encodeURIComponent(id)}/partner-network`, { token })
  146 |       setPartnerNetwork(data || null)
  147 |     } catch {
  148 |       setPartnerNetwork(null)
  149 |     } finally {
  150 |       setLoadingNetwork(false)
  151 |     }
  152 |   }, [id, token])
  153 | 
  154 |   useEffect(() => {
  155 |     loadProfile()
  156 |     loadRatings()
  157 |     loadCertification()
  158 |   }, [loadProfile, loadRatings, loadCertification])
  159 | 
  160 |   useEffect(() => {
  161 |     if (!user?.id) return
  162 |     trackClientEvent('profile_view', {
  163 |       entityType: 'profile',
  164 |       entityId: user.id,
  165 |       metadata: { role: user.role || 'buying_house' },
  166 |     })
  167 |   }, [user?.id, user?.role])
  168 | 
  169 |   useEffect(() => {
  170 |     if (!viewerPerms.is_self) return
  171 |     const tokenValue = getToken()
  172 |     if (!tokenValue) return
  173 |     apiRequest('/boosts/me', { token: tokenValue })
  174 |       .then((data) => {
  175 |         const active = (data?.items || []).find((boost) => boost.scope === 'profile' && isBoostActive(boost))
  176 |         setProfileBoost(active || null)
  177 |       })
  178 |       .catch(() => setProfileBoost(null))
  179 |   }, [viewerPerms.is_self])
  180 | 
  181 |   useEffect(() => {
  182 |     if (activeTab !== 'products') return
  183 |     if (products.length) return
  184 |     loadProducts({ reset: true })
  185 |   }, [activeTab, loadProducts, products.length])
  186 | 
  187 |   useEffect(() => {
  188 |     if (activeTab !== 'partner') return
  189 |     if (partnerNetwork) return
  190 |     loadPartnerNetwork()
  191 |   }, [activeTab, loadPartnerNetwork, partnerNetwork])
  192 | 
  193 |   async function follow() {
  194 |     if (!id) return
  195 |     try {
  196 |       const res = await apiRequest(`/users/${encodeURIComponent(id)}/follow`, { method: 'POST', token })
  197 |       setProfile((prev) => (prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev))
  198 |     } catch {
  199 |       // ignore
  200 |     }
  201 |   }
  202 | 
  203 |   async function connect() {
  204 |     if (!id) return
  205 |     try {
  206 |       const res = await apiRequest(`/users/${encodeURIComponent(id)}/friend-request`, { method: 'POST', token })
  207 |       setProfile((prev) => (prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev))
  208 |     } catch {
  209 |       // ignore
  210 |     }
  211 |   }
  212 | 
  213 |   function contact() {
  214 |     if (id) {
  215 |       recordLeadSource({
  216 |         type: 'direct',
  217 |         id: `profile:${id}`,
  218 |         label: `Profile: ${user?.name || 'buying house'}`,
  219 |       })
  220 |     }
  221 |     navigate('/chat', { state: { notice: `Contacting ${user?.name || 'buying house'}. If you are unverified, your first message may appear as a request.` } })
  222 |   }
  223 | 
  224 |   async function requestPartner() {
  225 |     if (!id) return
  226 |     setNotice('')
  227 |     try {
  228 |       await apiRequest('/partners/requests', { method: 'POST', token, body: { targetAccountId: id } })
  229 |       setNotice('Partner request sent.')
  230 |     } catch (err) {
  231 |       setNotice(err.message || 'Unable to send partner request.')
  232 |     }
  233 |   }
  234 | 
  235 |   if (loading) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Loading profile...</div>
  236 |   if (error) return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">{error}</div>
  237 |   if (!user) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>
  238 | 
  239 |   const canRequestPartner = viewer && ['factory', 'buying_house', 'admin'].includes(viewer.role) && !viewerPerms.is_self
  240 | 
  241 |   return (
  242 |     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
  243 |       <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
  244 |         <aside className="col-span-12 lg:col-span-4 space-y-4">
  245 |           <motion.div
  246 |             initial={reduceMotion ? false : { opacity: 0, y: 16 }}
  247 |             animate={reduceMotion ? false : { opacity: 1, y: 0 }}
  248 |             transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  249 |             className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800"
  250 |           >
  251 |             <div className="flex items-center gap-3">
  252 |               {user.profile?.profile_image ? (
  253 |                 <img src={user.profile.profile_image} alt={user.name} className="h-14 w-14 rounded-2xl object-cover" />
  254 |               ) : (
  255 |                 <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
  256 |               )}
  257 |               <div className="min-w-0">
  258 |                 <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
  259 |                 <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
  260 |                   <span className="uppercase">Buying House</span>
  261 |                   {user.profile?.country ? <span>- {user.profile.country}</span> : null}
  262 |                   {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
  263 |                   {isCertified ? <span className="font-bold text-emerald-600">Certified</span> : null}
  264 |                   {isPremium ? <span title="Boosted visibility enabled for Premium" className="font-bold text-blue-600">Premium Reach</span> : null}
  265 |                   {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
  266 |                 </div>
  267 |               </div>
  268 |             </div>
  269 | 
  270 |             <div className="mt-4 flex flex-wrap gap-2">
  271 |               <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
  272 |               <button onClick={follow} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
  273 |                 {relationship.following ? 'Following' : 'Follow'}
  274 |               </button>
  275 |               <button onClick={connect} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
  276 |                 {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
  277 |               </button>
  278 |             </div>
  279 | 
  280 |             {canRequestPartner ? (
  281 |               <div className="mt-3">
  282 |                 <button
  283 |                   type="button"
  284 |                   onClick={requestPartner}
  285 |                   className="w-full rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
  286 |                 >
  287 |                   Request partner network connection
  288 |                 </button>
  289 |                 {notice ? <p className="mt-2 text-[11px] text-slate-600">{notice}</p> : null}
  290 |               </div>
  291 |             ) : null}
  292 | 
  293 |             <div className="mt-4 grid grid-cols-1 gap-3">
  294 |               <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  295 |                 <p className="text-[11px] text-slate-500">Industry</p>
  296 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.industry || 'Garments & Textile'}</p>
  297 |               </div>
  298 |               <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  299 |                 <p className="text-[11px] text-slate-500">Organization</p>
  300 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
  301 |               </div>
  302 |               <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  303 |                 <p className="text-[11px] text-slate-500">Rating</p>
  304 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
  305 |                 <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
  306 |               </div>
  307 |             </div>
  308 |             <div className="mt-3 grid grid-cols-2 gap-3">
  309 |               <div className="rounded-xl borderless-shadow bg-white p-3">
  310 |                 <p className="text-[11px] text-slate-500">Partner factories</p>
  311 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '--'}</p>
  312 |               </div>
  313 |               <div className="rounded-xl borderless-shadow bg-white p-3">
  314 |                 <p className="text-[11px] text-slate-500">Requests</p>
  315 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
  316 |               </div>
  317 |             </div>
  318 |           </motion.div>
  319 | 
  320 |           <VerificationPanel summary={verification} />
  321 |           {certification ? (
  322 |             <div className="mt-4 rounded-xl bg-white/60 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  323 |               <p className="text-[11px] text-slate-500">Order Completion Certification</p>
  324 |               <p className="mt-1 text-sm font-semibold text-slate-900">{certification.status || 'pending'}</p>
  325 |               <p className="text-[11px] text-slate-600">Signed contracts: {certification.signed_contracts ?? 0}</p>
  326 |             </div>
  327 |           ) : null}
  328 |         </aside>
  329 | 
  330 |         <main className="col-span-12 lg:col-span-8 space-y-4">
  331 |           <CrmSummaryPanel targetId={user.id} />
  332 |           <motion.div
  333 |             initial={reduceMotion ? false : { opacity: 0, y: 16 }}
  334 |             animate={reduceMotion ? false : { opacity: 1, y: 0 }}
  335 |             transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
  336 |             className="rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800"
  337 |           >
  338 |             <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
  339 |               {['overview', 'partner', 'products', 'reviews'].map((tab) => (
  340 |                 <button
  341 |                   key={tab}
  342 |                   type="button"
  343 |                   onClick={() => setActiveTab(tab)}
  344 |                   className={`relative rounded-full px-3 py-2 text-xs font-semibold transition ring-1 active:scale-95${
  345 |                     activeTab === tab
  346 |                       ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
  347 |                       : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
  348 |                   }`}
  349 |                 >
  350 |                   {activeTab === tab ? (
  351 |                     <motion.span
  352 |                       layoutId="profile-tab"
  353 |                       className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
  354 |                       transition={{ type: 'spring', stiffness: 420, damping: 34 }}
  355 |                     />
  356 |                   ) : null}
  357 |                   {tab === 'overview' ? 'Overview' : tab === 'partner' ? 'Partner Network' : tab === 'products' ? 'Products' : 'Reviews'}
  358 |                 </button>
  359 |               ))}
  360 |             </div>
  361 | 
  362 |             <div className="p-4">
  363 |               {activeTab === 'overview' ? (
  364 |                 <div className="space-y-4">
  365 |                   <div>
  366 |                     <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
  367 |                     <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
  368 |                   </div>
  369 | 
  370 |                   {hasBrandKit ? (
  371 |                     <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  372 |                       <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Brand Kit</p>
  373 |                       <div className="mt-3 flex items-center gap-3">
  374 |                         {brandProfile.brand_logo_url ? (
  375 |                           <img src={brandProfile.brand_logo_url} alt="Brand logo" className="h-12 w-12 rounded-xl object-cover" />
  376 |                         ) : (
  377 |                           <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
  378 |                         )}
  379 |                         <div className="min-w-0">
  380 |                           <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
  381 |                             {brandProfile.brand_name || user.name}
  382 |                           </div>
  383 |                           {brandProfile.brand_tagline ? (
  384 |                             <div className="text-xs text-slate-600 dark:text-slate-300">{brandProfile.brand_tagline}</div>
  385 |                           ) : null}
  386 |                           {brandProfile.brand_website ? (
  387 |                             <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{brandProfile.brand_website}</div>
  388 |                           ) : null}
  389 |                         </div>
  390 |                       </div>
  391 |                     </div>
  392 |                   ) : null}
  393 | 
  394 |                   {isPremium && hasAccountManager ? (
  395 |                     <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  396 |                       <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dedicated Account Manager</p>
  397 |                       <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
  398 |                         {brandProfile.account_manager_name || 'Assigned manager'}
  399 |                       </div>
  400 |                       <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
  401 |                         {brandProfile.account_manager_email || brandProfile.account_manager_phone || ''}
  402 |                       </div>
  403 |                     </div>
  404 |                   ) : null}
  405 |                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  406 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  407 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Industry</p>
  408 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.industry || 'Garments & Textile'}</p>
  409 |                     </div>
  410 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  411 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Organization</p>
  412 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
  413 |                     </div>
  414 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  415 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating</p>
  416 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
  417 |                       <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
  418 |                     </div>
  419 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  420 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country</p>
  421 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '--'}</p>
  422 |                     </div>
  423 |                   </div>
  424 |                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  425 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  426 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Certifications</p>
  427 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '--'}</p>
  428 |                     </div>
  429 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  430 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Capacity</p>
  431 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.sourcing_capacity || '--'}</p>
  432 |                     </div>
  433 |                   </div>
  434 |                   {(user.profile?.companies_worked_with || []).length > 0 && (
  435 |                     <div>
  436 |                       <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Companies Worked With</p>
  437 |                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  438 |                         {(user.profile?.companies_worked_with || []).map((company, idx) => (
  439 |                           <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  440 |                             {company.logo ? (
  441 |                               <img src={company.logo} alt={company.name} className="h-10 w-10 rounded-lg object-cover" />
  442 |                             ) : (
  443 |                               <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500" />
  444 |                             )}
  445 |                             <div className="min-w-0 flex-1">
  446 |                               <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{company.name}</p>
  447 |                               {company.location && <p className="text-xs text-slate-500 dark:text-slate-400">{company.location}</p>}
  448 |                             </div>
  449 |                           </div>
  450 |                         ))}
  451 |                       </div>
  452 |                     </div>
  453 |                   )}
  454 |                 </div>
  455 |               ) : null}
  456 | 
  457 |               {activeTab === 'partner' ? (
  458 |                 <div className="space-y-3">
  459 |                   {loadingNetwork ? <div className="text-sm text-slate-600">Loading partner network...</div> : null}
  460 |                   {!loadingNetwork && partnerNetwork ? (
  461 |                     <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
  462 |                       <p className="text-sm font-bold text-slate-900">Connected factories</p>
  463 |                       <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
  464 |                       {Array.isArray(partnerNetwork.factories) ? (
  465 |                         <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
  466 |                           {partnerNetwork.factories.map((f) => (
  467 |                             <div key={f.id} className="rounded-xl borderless-shadow bg-white px-3 py-2 flex items-center justify-between">
  468 |                               <span className="text-xs font-semibold text-slate-800">{f.name}</span>
  469 |                               {f.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : <span className="text-xs text-slate-500">--</span>}
  470 |                             </div>
  471 |                           ))}
  472 |                         </div>
  473 |                       ) : (
  474 |                         <p className="mt-2 text-[11px] text-slate-600">Factory list is private; only the organization owner/admin can see it.</p>
  475 |                       )}
  476 |                     </div>
  477 |                   ) : null}
  478 |                 </div>
  479 |               ) : null}
  480 | 
  481 |               {activeTab === 'products' ? (
  482 |                 <div className="space-y-3">
  483 |                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  484 |                     {products.map((p) => (
  485 |                       <div key={p.id} className="rounded-2xl borderless-shadow bg-white p-4">
  486 |                         {p.cover_image_public_url ? (
  487 |                           <img src={p.cover_image_public_url} alt={p.title || 'Product'} className="h-32 w-full rounded-xl object-cover mb-3" />
  488 |                         ) : null}
  489 |                         <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
  490 |                         <p className="mt-1 text-xs text-slate-600">{p.category || '--'} - MOQ {p.moq || '--'} - Lead time {p.lead_time_days || '--'}</p>
  491 |                         <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
  492 |                         <p className="mt-2 text-[11px] text-slate-500">Status: {String(p.status || 'published')}</p>
  493 |                       </div>
  494 |                     ))}
  495 |                   </div>
  496 |                   {loadingProducts ? <div className="text-sm text-slate-600">Loading...</div> : null}
  497 |                   {productsNext !== null && !loadingProducts ? (
  498 |                     <button
  499 |                       type="button"
  500 |                       onClick={() => loadProducts({ reset: false })}
  501 |                       className="rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
  502 |                     >
  503 |                       Load more
  504 |                     </button>
  505 |                   ) : null}
  506 |                   {!products.length && !loadingProducts ? <div className="text-sm text-slate-600">No products found.</div> : null}
  507 |                 </div>
  508 |               ) : null}
  509 | 
  510 |               {activeTab === 'reviews' ? (
  511 |                 <div className="space-y-3">
  512 |                   <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  513 |                     <p className="text-sm font-bold text-slate-900">Rating summary</p>
  514 |                     <p className="mt-1 text-sm text-slate-700">
  515 |                       {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 - {ratingSummary?.aggregate?.total_count ?? 0} reviews - {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
  516 |                     </p>
  517 |                   </div>
  518 |                   <div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800 ring-1 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/30">
  519 |                     <p className="font-semibold">Review Policy</p>
  520 |                     <p className="mt-1">Reviews can only be edited or deleted by the person who wrote them. Profile owners cannot delete reviews to maintain transparency and trust.</p>
  521 |                   </div>
  522 |                   {(ratingSummary?.recent_reviews || []).map((r) => {
  523 |                     const canEdit = viewer?.id && String(viewer.id) === String(r.from_user_id || '')
  524 |                     return (
  525 |                       <div key={r.id} className="rounded-2xl borderless-shadow bg-white p-4">
  526 |                         <div className="flex flex-wrap items-start justify-between gap-3">
  527 |                           <div>
  528 |                             <p className="text-sm font-semibold text-slate-900">{r.score} / 5</p>
  529 |                             <p className="mt-1 text-sm text-slate-700">{r.comment || 'No comment provided.'}</p>
  530 |                           </div>
  531 |                           {canEdit ? (
  532 |                             <div className="flex items-center gap-2">
  533 |                               <button
  534 |                                 type="button"
  535 |                                 className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50"
  536 |                                 onClick={async () => {
  537 |                                   const nextScore = Number(window.prompt('Update score (1-5)', r.score))
  538 |                                   if (!Number.isFinite(nextScore)) return
  539 |                                   const nextComment = window.prompt('Update comment', r.comment || '') || ''
  540 |                                   try {
  541 |                                     await apiRequest(`/ratings/${r.id}`, { method: 'PATCH', token, body: { score: nextScore, comment: nextComment } })
  542 |                                     await loadRatings()
  543 |                                   } catch {
  544 |                                     // ignore
  545 |                                   }
  546 |                                 }}
  547 |                               >
  548 |                                 Edit
  549 |                               </button>
  550 |                               <button
  551 |                                 type="button"
  552 |                                 className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
  553 |                                 onClick={async () => {
  554 |                                   if (!window.confirm('Delete this review?')) return
  555 |                                   try {
  556 |                                     await apiRequest(`/ratings/${r.id}`, { method: 'DELETE', token })
  557 |                                     await loadRatings()
  558 |                                   } catch {
  559 |                                     // ignore
  560 |                                   }
  561 |                                 }}
  562 |                               >
  563 |                                 Delete
  564 |                               </button>
  565 |                             </div>
  566 |                           ) : null}
  567 |                         </div>
  568 |                       </div>
  569 |                     )
  570 |                   })}
  571 |                   {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600">No reviews yet.</div> : null}
  572 |                 </div>
  573 |               ) : null}
  574 |             </div>
  575 |           </motion.div>
  576 |         </main>
  577 |       </div>
  578 |     </div>
  579 |   )
  580 | }
  581 | 
  582 | 