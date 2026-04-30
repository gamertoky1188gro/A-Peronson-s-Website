    1 | /*
    2 |   Route: /buyer/:id
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
   13 |     - Render the Buyer profile (overview + requests).
   14 |     - Show trust indicators (verification summary, credibility meter, verified badge).
   15 |     - Provide relationship actions (follow/connect/message).
   16 | 
   17 |   Key API endpoints:
   18 |     - GET /api/profiles/:id
   19 |     - GET /api/ratings/profiles/user::id (public ratings summary)
   20 |     - GET /api/profiles/:id/requests?cursor=...
   21 | 
   22 |   Major UI/UX patterns:
   23 |     - Industrial-tech surfaces: white cards + subtle borders (light), ringed slate cards (dark).
   24 |     - layoutId animated tab indicator.
   25 |     - Tactile CTA feedback (active:scale-95).
   26 | */
   27 | import React, { useCallback, useEffect, useMemo, useState } from 'react'
   28 | import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
   29 | import { motion, useReducedMotion } from 'framer-motion'
   30 | import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
   31 | import { trackClientEvent } from '../lib/events'
   32 | import { recordLeadSource } from '../lib/leadSource'
   33 | import VerificationPanel from '../components/profile/VerificationPanel'
   34 | import CrmSummaryPanel from '../components/profile/CrmSummaryPanel'
   35 | import JourneyTimeline from '../components/JourneyTimeline'
   36 | 
   37 | const Motion = motion
   38 | 
   39 | function roleToRoute(role, id) {
   40 |   // Safety: if a user opens a profile id that is not a buyer, redirect to the correct role route.
   41 |   if (!id) return '/feed'
   42 |   if (role === 'buyer') return `/buyer/${encodeURIComponent(id)}`
   43 |   if (role === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
   44 |   return `/factory/${encodeURIComponent(id)}`
   45 | }
   46 | 
   47 | function isBoostActive(boost) {
   48 |   if (!boost) return false
   49 |   if (String(boost.status || '').toLowerCase() !== 'active') return false
   50 |   const now = Date.now()
   51 |   const startsAt = new Date(boost.starts_at).getTime()
   52 |   const endsAt = new Date(boost.ends_at).getTime()
   53 |   if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false
   54 |   return now >= startsAt && now <= endsAt
   55 | }
   56 | 
   57 | export default function BuyerProfile() {
   58 |   const { id } = useParams()
   59 |   const navigate = useNavigate()
   60 |   const location = useLocation()
   61 |   const token = useMemo(() => getToken(), [])
   62 |   const currentUser = useMemo(() => getCurrentUser(), [])
   63 | 
   64 |   const [loading, setLoading] = useState(true)
   65 |   const [error, setError] = useState('')
   66 |   const [profile, setProfile] = useState(null)
   67 |   const [ratingSummary, setRatingSummary] = useState(null)
   68 |   const [certification, setCertification] = useState(null)
   69 | 
   70 |   const [activeTab, setActiveTab] = useState('overview')
   71 |   const [requests, setRequests] = useState([])
   72 |   const [requestsCursor, setRequestsCursor] = useState(0)
   73 |   const [requestsNext, setRequestsNext] = useState(null)
   74 |   const [loadingRequests, setLoadingRequests] = useState(false)
   75 |   const [profileBoost, setProfileBoost] = useState(null)
   76 |   const reduceMotion = useReducedMotion()
   77 |   const journeyParams = useMemo(() => new URLSearchParams(location.search), [location.search])
   78 | 
   79 |   const user = profile?.user || null
   80 |   const verification = profile?.verification_summary || null
   81 |   const relationship = profile?.relationship || { following: false, friend_status: 'none' }
   82 |   const viewerPerms = profile?.viewer_permissions || { is_self: false, is_admin: false }
   83 |   const isBoosted = Boolean(profileBoost)
   84 |   const isPremium = String(user?.subscription_status || '').toLowerCase() === 'premium'
   85 |   const brandProfile = user?.profile || {}
   86 |   const hasBrandKit = Boolean(brandProfile.brand_name || brandProfile.brand_logo_url || brandProfile.brand_tagline || brandProfile.brand_website)
   87 |   const hasAccountManager = Boolean(brandProfile.account_manager_name || brandProfile.account_manager_email || brandProfile.account_manager_phone)
   88 |   const isCertified = String(certification?.status || '').toLowerCase() === 'certified'
   89 | 
   90 |   const loadProfile = useCallback(async () => {
   91 |     if (!id) return
   92 |     setLoading(true)
   93 |     setError('')
   94 |     try {
   95 |       const data = await apiRequest(`/profiles/${encodeURIComponent(id)}`, { token })
   96 |       if (data?.user?.role && data.user.role !== 'buyer') {
   97 |         navigate(roleToRoute(data.user.role, id), { replace: true })
   98 |         return
   99 |       }
  100 |       setProfile(data)
  101 |     } catch (err) {
  102 |       setError(err.message || 'Failed to load profile')
  103 |       setProfile(null)
  104 |     } finally {
  105 |       setLoading(false)
  106 |     }
  107 |   }, [id, navigate, token])
  108 | 
  109 |   const loadRatings = useCallback(async () => {
  110 |     if (!id) return
  111 |     try {
  112 |       const data = await apiRequest(`/ratings/profiles/user:${encodeURIComponent(id)}`, { token: '' })
  113 |       setRatingSummary(data || null)
  114 |     } catch {
  115 |       setRatingSummary(null)
  116 |     }
  117 |   }, [id])
  118 | 
  119 |   const loadCertification = useCallback(async () => {
  120 |     if (!id || !token) return
  121 |     try {
  122 |       const data = await apiRequest(`/certifications/org/${encodeURIComponent(id)}`, { token })
  123 |       setCertification(data?.summary || null)
  124 |     } catch {
  125 |       setCertification(null)
  126 |     }
  127 |   }, [id, token])
  128 | 
  129 |   const loadRequests = useCallback(async ({ reset }) => {
  130 |     if (!id) return
  131 |     const cursor = reset ? 0 : requestsCursor
  132 |     setLoadingRequests(true)
  133 |     try {
  134 |       const data = await apiRequest(`/profiles/${encodeURIComponent(id)}/requests?cursor=${cursor}&limit=10`, { token })
  135 |       const rows = Array.isArray(data?.items) ? data.items : []
  136 |       setRequests((prev) => (reset ? rows : [...prev, ...rows]))
  137 |       setRequestsCursor(reset ? 10 : cursor + 10)
  138 |       setRequestsNext(data?.next_cursor ?? null)
  139 |     } catch {
  140 |       // keep current list
  141 |     } finally {
  142 |       setLoadingRequests(false)
  143 |     }
  144 |   }, [id, requestsCursor, token])
  145 | 
  146 |   useEffect(() => {
  147 |     loadProfile()
  148 |     loadRatings()
  149 |     loadCertification()
  150 |   }, [loadProfile, loadRatings, loadCertification])
  151 | 
  152 |   useEffect(() => {
  153 |     if (!user?.id) return
  154 |     trackClientEvent('profile_view', {
  155 |       entityType: 'profile',
  156 |       entityId: user.id,
  157 |       metadata: { role: user.role || 'buyer' },
  158 |     })
  159 |   }, [user?.id, user?.role])
  160 | 
  161 |   useEffect(() => {
  162 |     if (!viewerPerms.is_self) return
  163 |     const tokenValue = getToken()
  164 |     if (!tokenValue) return
  165 |     apiRequest('/boosts/me', { token: tokenValue })
  166 |       .then((data) => {
  167 |         const active = (data?.items || []).find((boost) => boost.scope === 'profile' && isBoostActive(boost))
  168 |         setProfileBoost(active || null)
  169 |       })
  170 |       .catch(() => setProfileBoost(null))
  171 |   }, [viewerPerms.is_self])
  172 | 
  173 |   useEffect(() => {
  174 |     if (activeTab !== 'requests') return
  175 |     if (requests.length) return
  176 |     loadRequests({ reset: true })
  177 |   }, [activeTab, loadRequests, requests.length])
  178 | 
  179 |   async function follow() {
  180 |     if (!id) return
  181 |     try {
  182 |       const res = await apiRequest(`/users/${encodeURIComponent(id)}/follow`, { method: 'POST', token })
  183 |       setProfile((prev) => (prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev))
  184 |     } catch {
  185 |       // ignore
  186 |     }
  187 |   }
  188 | 
  189 |   async function connect() {
  190 |     if (!id) return
  191 |     try {
  192 |       const res = await apiRequest(`/users/${encodeURIComponent(id)}/friend-request`, { method: 'POST', token })
  193 |       setProfile((prev) => (prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev))
  194 |     } catch {
  195 |       // ignore
  196 |     }
  197 |   }
  198 | 
  199 |   function contact() {
  200 |     if (id) {
  201 |       recordLeadSource({
  202 |         type: 'direct',
  203 |         id: `profile:${id}`,
  204 |         label: `Profile: ${user?.name || 'buyer'}`,
  205 |       })
  206 |     }
  207 |     navigate('/chat', { state: { notice: `Contacting ${user?.name || 'buyer'}. If you are unverified, your first message may appear as a request.` } })
  208 |   }
  209 | 
  210 |   if (loading) {
  211 |     return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Loading profile...</div>
  212 |   }
  213 |   if (error) {
  214 |     return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">{error}</div>
  215 |   }
  216 |   if (!user) {
  217 |     return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>
  218 |   }
  219 | 
  220 |   return (
  221 |     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
  222 |       <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
  223 |         <aside className="col-span-12 lg:col-span-4 space-y-4">
  224 |           <motion.div
  225 |             initial={reduceMotion ? false : { opacity: 0, y: 16 }}
  226 |             animate={reduceMotion ? false : { opacity: 1, y: 0 }}
  227 |             transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  228 |             className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800"
  229 |           >
  230 |             <div className="flex items-center gap-3">
  231 |               {user.profile?.profile_image ? (
  232 |                 <img src={user.profile.profile_image} alt={user.name} className="h-14 w-14 rounded-2xl object-cover" />
  233 |               ) : (
  234 |                 <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
  235 |               )}
  236 |               <div className="min-w-0">
  237 |                 <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
  238 |                 <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
  239 |                   <span className="uppercase">Buyer</span>
  240 |                   {user.profile?.country ? <span>- {user.profile.country}</span> : null}
  241 |                   {user.verified ? (
  242 |                     <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
  243 |                       Verified
  244 |                     </span>
  245 |                   ) : null}
  246 |                   {isCertified ? (
  247 |                     <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
  248 |                       Certified
  249 |                     </span>
  250 |                   ) : null}
  251 |                   {isPremium ? (
  252 |                     <span title="Boosted visibility enabled for Premium" className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-500/20 dark:text-blue-200">
  253 |                       Premium Reach
  254 |                     </span>
  255 |                   ) : null}
  256 |                   {isBoosted ? (
  257 |                     <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-200">
  258 |                       Boosted
  259 |                     </span>
  260 |                   ) : null}
  261 |                 </div>
  262 |               </div>
  263 |             </div>
  264 | 
  265 |             <div className="mt-4 flex gap-2">
  266 |               <button onClick={contact} className="flex-1 rounded-full bg-[var(--gt-blue)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95">Contact</button>
  267 |               <button onClick={follow} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
  268 |                 {relationship.following ? 'Following' : 'Follow'}
  269 |               </button>
  270 |               <button onClick={connect} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
  271 |                 {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
  272 |               </button>
  273 |             </div>
  274 | 
  275 |             <div className="mt-4 grid grid-cols-1 gap-3">
  276 |               <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  277 |                 <p className="text-[11px] text-slate-500">Industry</p>
  278 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.industry || 'Garments & Textile'}</p>
  279 |               </div>
  280 |               <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  281 |                 <p className="text-[11px] text-slate-500">Organization</p>
  282 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
  283 |               </div>
  284 |               <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  285 |                 <p className="text-[11px] text-slate-500">Rating</p>
  286 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
  287 |                 <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
  288 |               </div>
  289 |               <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  290 |                 <p className="text-[11px] text-slate-500">Certifications</p>
  291 |                 <p className="mt-1 text-sm font-semibold text-slate-900">
  292 |                   {(user.profile?.certifications || []).join(', ') || '--'}
  293 |                 </p>
  294 |               </div>
  295 |               <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  296 |                 <p className="text-[11px] text-slate-500">Capacity</p>
  297 |                 <p className="mt-1 text-sm font-semibold text-slate-900">
  298 |                   {user.profile?.sourcing_capacity || user.profile?.monthly_capacity || user.profile?.annual_capacity || user.profile?.capacity || '--'}
  299 |                 </p>
  300 |               </div>
  301 |             </div>
  302 |             <div className="mt-3 grid grid-cols-2 gap-3">
  303 |               <div className="rounded-xl bg-white/60 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  304 |                 <p className="text-[11px] text-slate-500">Requests</p>
  305 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
  306 |                 <p className="text-[11px] text-slate-600">Total posted</p>
  307 |               </div>
  308 |               <div className="rounded-xl bg-white/60 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  309 |                 <p className="text-[11px] text-slate-500">Joined</p>
  310 |                 <p className="mt-1 text-sm font-semibold text-slate-900">{user.created_at ? new Date(user.created_at).getFullYear() : '--'}</p>
  311 |                 <p className="text-[11px] text-slate-600">Year</p>
  312 |               </div>
  313 |             </div>
  314 |           </motion.div>
  315 | 
  316 |           <VerificationPanel summary={verification} />
  317 |           {certification ? (
  318 |             <div className="mt-4 rounded-xl bg-white/60 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  319 |               <p className="text-[11px] text-slate-500">Order Completion Certification</p>
  320 |               <p className="mt-1 text-sm font-semibold text-slate-900">{certification.status || 'pending'}</p>
  321 |               <p className="text-[11px] text-slate-600">Signed contracts: {certification.signed_contracts ?? 0}</p>
  322 |             </div>
  323 |           ) : null}
  324 |         </aside>
  325 | 
  326 |         <main className="col-span-12 lg:col-span-8 space-y-4">
  327 |           <CrmSummaryPanel targetId={user.id} />
  328 |           <JourneyTimeline
  329 |             title="Journey Timeline"
  330 |             matchId={journeyParams.get('match_id') || journeyParams.get('journey_match_id') || ''}
  331 |             contractId={journeyParams.get('contract_id') || ''}
  332 |             requirementId={journeyParams.get('requirement_id') || ''}
  333 |           />
  334 |           <motion.div
  335 |             initial={reduceMotion ? false : { opacity: 0, y: 16 }}
  336 |             animate={reduceMotion ? false : { opacity: 1, y: 0 }}
  337 |             transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
  338 |             className="rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800"
  339 |           >
  340 |             <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
  341 |               {['overview', 'requests', 'reviews'].map((tab) => (
  342 |                 <button
  343 |                   key={tab}
  344 |                   type="button"
  345 |                   onClick={() => setActiveTab(tab)}
  346 |                   className={`relative rounded-full px-3 py-2 text-xs font-semibold transition ring-1 active:scale-95${
  347 |                     activeTab === tab
  348 |                       ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
  349 |                       : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
  350 |                   }`}
  351 |                 >
  352 |                   {activeTab === tab ? (
  353 |                     <motion.span
  354 |                       layoutId="profile-tab"
  355 |                       className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
  356 |                       transition={{ type: 'spring', stiffness: 420, damping: 34 }}
  357 |                     />
  358 |                   ) : null}
  359 |                   {tab === 'overview' ? 'Overview' : tab === 'requests' ? 'Buyer Requests' : 'Reviews'}
  360 |                 </button>
  361 |               ))}
  362 |             </div>
  363 | 
  364 |             <div className="p-4">
  365 |               {activeTab === 'overview' ? (
  366 |                 <div className="space-y-4">
  367 |                   <div>
  368 |                     <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
  369 |                     <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
  370 |                   </div>
  371 | 
  372 |                   {hasBrandKit ? (
  373 |                     <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  374 |                       <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Brand Kit</p>
  375 |                       <div className="mt-3 flex items-center gap-3">
  376 |                         {brandProfile.brand_logo_url ? (
  377 |                           <img src={brandProfile.brand_logo_url} alt="Brand logo" className="h-12 w-12 rounded-xl object-cover" />
  378 |                         ) : (
  379 |                           <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
  380 |                         )}
  381 |                         <div className="min-w-0">
  382 |                           <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
  383 |                             {brandProfile.brand_name || user.name}
  384 |                           </div>
  385 |                           {brandProfile.brand_tagline ? (
  386 |                             <div className="text-xs text-slate-600 dark:text-slate-300">{brandProfile.brand_tagline}</div>
  387 |                           ) : null}
  388 |                           {brandProfile.brand_website ? (
  389 |                             <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{brandProfile.brand_website}</div>
  390 |                           ) : null}
  391 |                         </div>
  392 |                       </div>
  393 |                     </div>
  394 |                   ) : null}
  395 | 
  396 |                   {isPremium && hasAccountManager ? (
  397 |                     <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  398 |                       <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dedicated Account Manager</p>
  399 |                       <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
  400 |                         {brandProfile.account_manager_name || 'Assigned manager'}
  401 |                       </div>
  402 |                       <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
  403 |                         {brandProfile.account_manager_email || brandProfile.account_manager_phone || ''}
  404 |                       </div>
  405 |                     </div>
  406 |                   ) : null}
  407 | 
  408 |                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  409 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  410 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country</p>
  411 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '--'}</p>
  412 |                     </div>
  413 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  414 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Certifications</p>
  415 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '--'}</p>
  416 |                     </div>
  417 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  418 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Since</p>
  419 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.active_since || new Date().getFullYear()}</p>
  420 |                     </div>
  421 |                     <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  422 |                       <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</p>
  423 |                       <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Buyer</p>
  424 |                     </div>
  425 |                   </div>
  426 | 
  427 |                   {(user.profile?.companies_worked_with || []).length > 0 && (
  428 |                     <div>
  429 |                       <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Companies Worked With</p>
  430 |                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  431 |                         {(user.profile?.companies_worked_with || []).map((company, idx) => (
  432 |                           <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  433 |                             {company.logo ? (
  434 |                               <img src={company.logo} alt={company.name} className="h-10 w-10 rounded-lg object-cover" />
  435 |                             ) : (
  436 |                               <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500" />
  437 |                             )}
  438 |                             <div className="min-w-0 flex-1">
  439 |                               <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{company.name}</p>
  440 |                               {company.location && <p className="text-xs text-slate-500 dark:text-slate-400">{company.location}</p>}
  441 |                             </div>
  442 |                           </div>
  443 |                         ))}
  444 |                       </div>
  445 |                     </div>
  446 |                   )}
  447 |                 </div>
  448 |               ) : null}
  449 | 
  450 |               {activeTab === 'requests' ? (
  451 |                 <div className="space-y-3">
  452 |                   {viewerPerms.is_self || viewerPerms.is_admin ? (
  453 |                     <>
  454 |                       {requests.map((r) => (
  455 |                         <div key={r.id} className="rounded-2xl borderless-shadow bg-white p-4 dark:bg-slate-900/50">
  456 |                           <div className="flex items-start justify-between gap-3">
  457 |                             <div className="flex-1">
  458 |                               <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{r.category || 'Request'}</p>
  459 |                               <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{r.custom_description || ''}</p>
  460 |                               <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 grid grid-cols-2 gap-2">
  461 |                                 <div>Quantity: <span className="font-semibold text-slate-800 dark:text-slate-200">{r.quantity || '-'}</span></div>
  462 |                                 <div>Timeline: <span className="font-semibold text-slate-800 dark:text-slate-200">{r.timeline_days || '-'} days</span></div>
  463 |                                 <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-200">{r.material || '-'}</span></div>
  464 |                                 <div>Status: <span className="font-semibold text-slate-800 dark:text-slate-200">{r.status || '-'}</span></div>
  465 |                               </div>
  466 |                             </div>
  467 |                             <div className="shrink-0">
  468 |                               <button onClick={contact} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] transition">Contact</button>
  469 |                             </div>
  470 |                           </div>
  471 |                         </div>
  472 |                       ))}
  473 |                       {loadingRequests ? <div className="text-sm text-slate-600 dark:text-slate-300">Loading...</div> : null}
  474 |                       {requestsNext !== null && !loadingRequests ? (
  475 |                         <button
  476 |                           type="button"
  477 |                           onClick={() => loadRequests({ reset: false })}
  478 |                           className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
  479 |                         >
  480 |                           Load more
  481 |                         </button>
  482 |                       ) : null}
  483 |                       {!requests.length && !loadingRequests ? <div className="text-sm text-slate-600 dark:text-slate-300">No requests found.</div> : null}
  484 |                     </>
  485 |                   ) : (
  486 |                     <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
  487 |                       <p className="font-semibold">Request details are private</p>
  488 |                       <p className="mt-2">Only the buyer can view detailed request information to protect business privacy.</p>
  489 |                       <p className="mt-3 text-xs">Total requests posted: <span className="font-bold">{profile?.counts?.requests || 0}</span></p>
  490 |                     </div>
  491 |                   )}
  492 |                 </div>
  493 |               ) : null}
  494 | 
  495 |               {activeTab === 'reviews' ? (
  496 |                 <div className="space-y-3">
  497 |                   <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  498 |                     <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Rating summary</p>
  499 |                     <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
  500 |                       {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 - {ratingSummary?.aggregate?.total_count ?? 0} reviews - {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
  501 |                     </p>
  502 |                   </div>
  503 |                   <div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800 ring-1 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/30">
  504 |                     <p className="font-semibold">Review Policy</p>
  505 |                     <p className="mt-1">Reviews can only be edited or deleted by the person who wrote them. Profile owners cannot delete reviews to maintain transparency and trust.</p>
  506 |                   </div>
  507 |                   {(ratingSummary?.recent_reviews || []).map((r) => {
  508 |                     const canEdit = currentUser?.id && String(currentUser.id) === String(r.from_user_id || '')
  509 |                     return (
  510 |                       <div key={r.id} className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10">
  511 |                         <div className="flex items-start justify-between gap-3">
  512 |                           <div className="flex-1">
  513 |                             <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.score}* -- {r.reviewer_name || 'Anonymous'}</p>
  514 |                             <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{r.comment || 'No comment provided.'}</p>
  515 |                             <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</p>
  516 |                           </div>
  517 |                           {canEdit ? (
  518 |                             <div className="flex flex-col gap-2">
  519 |                               <button
  520 |                                 type="button"
  521 |                                 className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
  522 |                                 onClick={async () => {
  523 |                                   const score = window.prompt('Update rating (1-5)', String(r.score || '5'))
  524 |                                   if (!score) return
  525 |                                   const comment = window.prompt('Update review comment', r.comment || '')
  526 |                                   try {
  527 |                                     await apiRequest(`/ratings/${r.id}`, { method: 'PATCH', token, body: { score: Number(score), comment: comment ?? '' } })
  528 |                                     await loadRatings()
  529 |                                   } catch {
  530 |                                     // ignore
  531 |                                   }
  532 |                                 }}
  533 |                               >
  534 |                                 Edit
  535 |                               </button>
  536 |                               <button
  537 |                                 type="button"
  538 |                                 className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
  539 |                                 onClick={async () => {
  540 |                                   if (!window.confirm('Delete this review?')) return
  541 |                                   try {
  542 |                                     await apiRequest(`/ratings/${r.id}`, { method: 'DELETE', token })
  543 |                                     await loadRatings()
  544 |                                   } catch {
  545 |                                     // ignore
  546 |                                   }
  547 |                                 }}
  548 |                               >
  549 |                                 Delete
  550 |                               </button>
  551 |                             </div>
  552 |                           ) : null}
  553 |                         </div>
  554 |                       </div>
  555 |                     )
  556 |                   })}
  557 |                   {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600 dark:text-slate-300">No reviews yet.</div> : null}
  558 |                 </div>
  559 |               ) : null}
  560 |             </div>
  561 |           </motion.div>
  562 |         </main>
  563 |       </div>
  564 |     </div>
  565 |   )
  566 | }
  567 | 
  568 | 