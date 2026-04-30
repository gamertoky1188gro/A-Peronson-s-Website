    1 | /*
    2 |   Route: /pricing
    3 |   Access: Public
    4 | 
    5 |   Public Pages:
    6 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    7 |   Protected Pages (login required):
    8 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    9 |     /notifications, /chat, /call, /verification, /verification-center
   10 | 
   11 |   Primary responsibilities:
   12 |     - Present pricing tiers for Buyer, Factory, Buying House (Free vs Premium).
   13 |     - Present enterprise-style analytics preview tiles (dynamic, public).
   14 |     - Feature comparison table (icons, row hover, no vertical lines).
   15 | 
   16 |   Key API endpoints:
   17 |     - GET /api/system/pricing  (via `apiRequest('/system/pricing')`)
   18 | 
   19 |   Major UI/UX patterns:
   20 |     - Zinc-first palette (pricing-only) for a clean SaaS look.
   21 |     - Spotlight hover (`SpotlightCard`) for borderless depth.
   22 |     - Premium card perimeter beam (CSS conic gradient) + pulse badge.
   23 |     - Staggered entrance via Framer Motion (bento tiles + cards).
   24 |     - Magnetic CTAs via `MagneticButton`.
   25 | */
   26 | import React, { useEffect, useMemo, useState } from 'react'
   27 | import { useLocation } from 'react-router-dom'
   28 | import { Check, Minus } from 'lucide-react'
   29 | import { motion, useReducedMotion } from 'framer-motion'
   30 | import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
   31 | import MagneticButton from '../components/ui/MagneticButton'
   32 | import SpotlightCard from '../components/ui/SpotlightCard'
   33 | 
   34 | const Motion = motion
   35 | 
   36 | function planKeyForUserRole(role) {
   37 |   const normalized = String(role || '').toLowerCase()
   38 |   if (normalized === 'buyer') return 'buyer'
   39 |   if (normalized === 'factory') return 'factory'
   40 |   if (normalized === 'buying_house') return 'buying_house'
   41 |   // Owner/Admin/Agent: default to enterprise/buying-house view.
   42 |   return 'buying_house'
   43 | }
   44 | 
   45 | // Static fallback values (used when API is loading or errors).
   46 | const defaultPricing = {
   47 |   ok: true,
   48 |   analytics: {
   49 |     tiles: [
   50 |       { label: 'Order completion', value: '84%', sublabel: 'last 30 days', accent: 'teal' },
   51 |       { label: 'Avg. cycle', value: '12d', sublabel: 'request -> contract', accent: 'blue' },
   52 |       { label: 'Active orgs', value: '32', sublabel: 'buyers + factories', accent: 'gold' },
   53 |       { label: 'Response SLA', value: '1h 22m', sublabel: 'median', accent: 'blue' },
   54 |     ],
   55 |   },
   56 | }
   57 | 
   58 | function Skeleton({ className='' }) {
   59 |   // Shimmer skeleton block (App.css `.skeleton`).
   60 |   return <div className={['skeleton', className].join(' ')} />
   61 | }
   62 | 
   63 | function MotionItem({ index, className='', children }) {
   64 |   const reduceMotion = useReducedMotion()
   65 |   // Respect reduced-motion preference.
   66 |   if (reduceMotion) return <div className={className}>{children}</div>
   67 | 
   68 |   return (
   69 |     <motion.div
   70 |       className={className}
   71 |       // Bento entrance: fade + slide up (20px) with a small stagger per index.
   72 |       initial={{ opacity: 0, y: 20 }}
   73 |       animate={{ opacity: 1, y: 0 }}
   74 |       transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
   75 |     >
   76 |       {children}
   77 |     </motion.div>
   78 |   )
   79 | }
   80 | 
   81 | function accentClasses(accent) {
   82 |   if (accent === 'teal') return 'text-[#2dd4bf]'
   83 |   if (accent === 'gold') return 'text-[#f59e0b]'
   84 |   return 'text-[var(--gt-blue)]'
   85 | }
   86 | 
   87 | export default function Pricing() {
   88 |   const location = useLocation()
   89 |   const [pricing, setPricing] = useState(defaultPricing)
   90 |   const [loading, setLoading] = useState(true)
   91 |   const [loadError, setLoadError] = useState('')
   92 | 
   93 |   const sessionUser = getCurrentUser()
   94 |   const token = getToken()
   95 |   const isLoggedIn = Boolean(token && sessionUser)
   96 |   const activePlanKey = isLoggedIn ? planKeyForUserRole(sessionUser?.role) : 'neutral'
   97 | 
   98 |   useEffect(() => {
   99 |     // If route contains a hash (e.g. /pricing#plans), scroll to that section after render.
  100 |     if (typeof window !== 'undefined' && location?.hash) {
  101 |       const id = String(location.hash || '').replace(/^#/, '')
  102 |       if (id) {
  103 |         // Allow parent layout scroll-to-top to settle first.
  104 |         setTimeout(() => {
  105 |           const el = document.getElementById(id)
  106 |           if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  107 |         }, 80)
  108 |       }
  109 |     }
  110 | 
  111 |     let alive = true
  112 |     const controller = new AbortController()
  113 | 
  114 |     apiRequest('/system/pricing', { signal: controller.signal })
  115 |       .then((data) => {
  116 |         if (!alive) return
  117 |         if (data?.ok && data?.analytics?.tiles) setPricing(data)
  118 |       })
  119 |       .catch((err) => {
  120 |         if (!alive) return
  121 |         if (err?.name === 'AbortError') return
  122 |         setLoadError(String(err?.message || 'Failed to load analytics'))
  123 |       })
  124 |       .finally(() => {
  125 |         if (!alive) return
  126 |         setLoading(false)
  127 |       })
  128 | 
  129 |     return () => {
  130 |       alive = false
  131 |       controller.abort()
  132 |     }
  133 |   }, [])
  134 | 
  135 |   const plansByRole = useMemo(() => ({
  136 |     buyer: {
  137 |       Free: [
  138 |         'Post structured buyer requests',
  139 |         'Search factories & suppliers (basic)',
  140 |         'Chat & call access',
  141 |         'Contract Vault (basic)',
  142 |         'Saved searches (limited)',
  143 |       ],
  144 |       Premium: [
  145 |         'Advanced Search Filters',
  146 |         'Priority Buyer Request Placement',
  147 |         'Dedicated Support',
  148 |         'Contract History & Audit Trail',
  149 |         'Early Access to New Verified Factories',
  150 |         'Buying Pattern Analysis',
  151 |         'Order Completion Certification',
  152 |         'AI Auto-reply Customization',
  153 |         'Smart Supplier Matching',
  154 |         'Request Performance Insights',
  155 |         'Profile & product boost with increased reach',
  156 |       ],
  157 |     },
  158 |     factory: {
  159 |       Free: [
  160 |         'Product management',
  161 |         'Video gallery (approved media)',
  162 |         'Receive buyer requests',
  163 |         'Chat & call access',
  164 |         'Contract Vault (basic)',
  165 |         'Agent IDs / sub-accounts (limit 10)',
  166 |       ],
  167 |       Premium: [
  168 |         'Profile & product boost with increased reach',
  169 |         'Advanced analytics (who viewed, inquiry rate)',
  170 |         'Priority in search results and filter',
  171 |         'AI auto-reply customization',
  172 |         'Dedicated account manager',
  173 |         'Custom branding on profile',
  174 |         'Enterprise analytics dashboard',
  175 |         'Unlimited agent/sub-ID creation',
  176 |         'Buying Pattern Analysis',
  177 |         'Order Completion Certification',
  178 |         'Dedicated Support',
  179 |         'Contract history & audit trail',
  180 |         'Multi-agent management',
  181 |         'Multiple team/agent access management',
  182 |         'Request factory Performance Insights',
  183 |         'Buyer interest analytics',
  184 |         'Agent performance analytics and reporting',
  185 |         'More product/video posting capacity',
  186 |         'Lead distribution across agents',
  187 |         'Buyer communication insights',
  188 |         'Buyer Request Priority Access',
  189 |         'Buyer Conversion Insights',
  190 |         'Unlimited Partner Network request accept',
  191 |       ],
  192 |     },
  193 |     buying_house: {
  194 |       Free: [
  195 |         'Lead workflow basics',
  196 |         'Buyer request queue access',
  197 |         'Partner Network (Buying House only)',
  198 |         'Chat & call access',
  199 |         'Contract Vault (basic)',
  200 |         'Agent IDs / sub-accounts (limit 10)',
  201 |       ],
  202 |       Premium: [
  203 |         'Profile & product boost with increased reach',
  204 |         'Advanced analytics (who viewed, inquiry rate)',
  205 |         'Priority in search results and filter',
  206 |         'AI auto-reply customization',
  207 |         'Dedicated account manager',
  208 |         'Custom branding on profile',
  209 |         'Enterprise analytics dashboard',
  210 |         'Unlimited agent/sub-ID creation',
  211 |         'Buying Pattern Analysis',
  212 |         'Order Completion Certification',
  213 |         'Dedicated Support',
  214 |         'Contract history & audit trail',
  215 |         'Multi-agent management',
  216 |         'Multiple team/agent access management',
  217 |         'Request Buying house Performance Insights',
  218 |         'Buyer interest analytics',
  219 |         'Agent performance analytics and reporting',
  220 |         'More product/video posting capacity',
  221 |         'Lead distribution across agents',
  222 |         'Buyer communication insights',
  223 |         'Buyer Request Priority Access',
  224 |         'Buyer Conversion Insights',
  225 |         'Unlimited Partner Network Access',
  226 |       ],
  227 |     },
  228 |     neutral: {
  229 |       Free: [
  230 |         'Structured buyer requests or product posts',
  231 |         'Basic search and messaging access',
  232 |         'Contract Vault (basic)',
  233 |         'Saved searches (limited)',
  234 |       ],
  235 |       Premium: [
  236 |         'Advanced Search Filters',
  237 |         'Priority Buyer Request Placement',
  238 |         'Dedicated Support',
  239 |         'Contract History & Audit Trail',
  240 |         'Buying Pattern Analysis',
  241 |         'Order Completion Certification',
  242 |         'AI Auto-reply Customization',
  243 |         'Smart Supplier Matching',
  244 |         'Request Performance Insights',
  245 |         'Profile & product boost with increased reach',
  246 |       ],
  247 |     },
  248 |   }), [])
  249 | 
  250 |   // Marketing badge on Premium (not a live account status indicator).
  251 |   const verificationStatus = 'verified_active'
  252 | 
  253 |   const statusLabel = {
  254 |     verified_active: 'Verified active',
  255 |     expiring_soon: 'Expiring soon',
  256 |     expired: 'Expired (renew to restore badge)',
  257 |   }
  258 | 
  259 | const statusChip = {
  260 |   verified_active:
  261 |     'verified-pulse bg-[rgba(245,158,11,0.18)] text-[#f59e0b] shadow-[0_0_0_1px_rgba(245,158,11,0.22),0_18px_40px_rgba(245,158,11,0.10)] dark:bg-[rgba(245,158,11,0.14)]',
  262 |   expiring_soon:
  263 |     'bg-[rgba(245,158,11,0.16)] text-[#f59e0b] shadow-[0_0_0_1px_rgba(245,158,11,0.18)] dark:bg-[rgba(245,158,11,0.12)]',
  264 |   expired:
  265 |     'bg-[rgba(244,63,94,0.16)] text-[#fb7185] shadow-[0_0_0_1px_rgba(244,63,94,0.20)] dark:bg-[rgba(244,63,94,0.12)]',
  266 | }
  267 | 
  268 | const premiumFeatures = [
  269 |   {
  270 |     title: 'Buyer (Premium)',
  271 |     items: [
  272 |       'Advanced Search Filters',
  273 |       'Priority Buyer Request Placement',
  274 |       'Dedicated Support',
  275 |       'Contract History & Audit Trail',
  276 |       'Early Access to New Verified Factories',
  277 |       'Buying Pattern Analysis',
  278 |       'Order Completion Certification',
  279 |       'AI Auto-reply Customization',
  280 |       'Smart Supplier Matching',
  281 |       'Request Performance Insights',
  282 |       'Profile & product boost with increased reach',
  283 |     ],
  284 |   },
  285 |   {
  286 |     title: 'Factory (Premium)',
  287 |     items: [
  288 |       'Profile & product boost with increased reach',
  289 |       'Advanced Analytics (views + inquiry rate)',
  290 |       'Priority in search results & filters',
  291 |       'AI auto-reply customization',
  292 |       'Dedicated Account Manager',
  293 |       'Custom Branding on Profile',
  294 |       'Enterprise Analytics Dashboard',
  295 |       'Unlimited Agent / Sub-ID Creation',
  296 |       'Buying Pattern Analysis',
  297 |       'Order Completion Certification',
  298 |       'Dedicated Support',
  299 |       'Contract History & Audit Trail',
  300 |       'Multi-agent Management',
  301 |       'Multiple Team / Agent Access Controls',
  302 |       'Request & Factory Performance Insights',
  303 |       'Buyer Interest Analytics',
  304 |       'Agent Performance Analytics & Reporting',
  305 |       'More Product & Video Posting Capacity',
  306 |       'Lead Distribution Across Agents',
  307 |       'Buyer Communication Insights',
  308 |       'Buyer Request Priority Access',
  309 |       'Buyer Conversion Insights',
  310 |       'Unlimited Partner Network Request Acceptance',
  311 |     ],
  312 |   },
  313 |   {
  314 |     title: 'Buying House (Premium)',
  315 |     items: [
  316 |       'Profile & product boost with increased reach',
  317 |       'Advanced Analytics (views + inquiry rate)',
  318 |       'Priority in search results & filters',
  319 |       'AI auto-reply customization',
  320 |       'Dedicated Account Manager',
  321 |       'Custom Branding on Profile',
  322 |       'Enterprise Analytics Dashboard',
  323 |       'Unlimited Agent / Sub-ID Creation',
  324 |       'Buying Pattern Analysis',
  325 |       'Order Completion Certification',
  326 |       'Dedicated Support',
  327 |       'Contract History & Audit Trail',
  328 |       'Multi-agent Management',
  329 |       'Multiple Team / Agent Access Controls',
  330 |       'Request Buying House Performance Insights',
  331 |       'Buyer Interest Analytics',
  332 |       'Agent Performance Analytics & Reporting',
  333 |       'More Product & Video Posting Capacity',
  334 |       'Lead Distribution Across Agents',
  335 |       'Buyer Communication Insights',
  336 |       'Buyer Request Priority Access',
  337 |       'Buyer Conversion Insights',
  338 |       'Unlimited Partner Network Access',
  339 |     ],
  340 |   },
  341 | ]
  342 | 
  343 |   const tableRows = useMemo(() => {
  344 |     const roleSpecificFirstRow = (() => {
  345 |       if (activePlanKey === 'buyer') return { label: 'Structured buyer requests', free: true, premium: true }
  346 |       if (activePlanKey === 'factory') return { label: 'Product management', free: true, premium: true }
  347 |       if (activePlanKey === 'buying_house') return { label: 'Partner Network', free: true, premium: true }
  348 |       return { label: 'Buyer requests or product posts', free: true, premium: true }
  349 |     })()
  350 | 
  351 |     return [
  352 |       roleSpecificFirstRow,
  353 |       { label: 'Agent IDs / sub-accounts', free: 'Up to 10', premium: 'Unlimited' },
  354 |       { label: 'Contract Vault storage', free: 'Basic', premium: 'Extended' },
  355 |       { label: 'Exportable reports', free: false, premium: true },
  356 |       { label: 'AI auto-reply customization', free: false, premium: true },
  357 |       { label: 'Analytics page', free: activePlanKey === 'buying_house' ? 'Limited' : 'Basic', premium: true },
  358 |       { label: 'Search filtering priority', free: 'Standard', premium: 'Advanced' },
  359 |       { label: 'Priority request placement', free: false, premium: true },
  360 |       { label: 'Support level', free: 'Standard', premium: 'Dedicated' },
  361 |       { label: 'Buying pattern analysis', free: false, premium: true },
  362 |       { label: 'Order Completion Certification', free: false, premium: true },
  363 |       { label: 'Profile / product boost', free: false, premium: true },
  364 |     ]
  365 |   }, [activePlanKey])
  366 | 
  367 |   const roleSections = [
  368 |     { key: 'buyer', title: 'Buyer', subtitle: 'For direct buyers sourcing verified factories.' },
  369 |     { key: 'factory', title: 'Factory', subtitle: 'For factories managing products and inbound buyer requests.' },
  370 |     { key: 'buying_house', title: 'Buying House', subtitle: 'For buying houses coordinating teams and partners.' },
  371 |   ]
  372 | 
  373 |   const visibleSections = isLoggedIn
  374 |     ? roleSections.filter((section) => section.key === activePlanKey)
  375 |     : roleSections
  376 | 
  377 |   return (
  378 |     <div className="relative min-h-screen overflow-x-hidden bg-[#fafafa] text-[#09090b] dark:bg-[#09090b] dark:text-[#fafafa]">
  379 |       <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
  380 |         <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
  381 |           <div className="lg:col-span-7">
  382 |             <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
  383 |               Pricing
  384 |             </p>
  385 |             <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] sm:text-5xl">
  386 |               Clear plans for serious sourcing teams
  387 |             </h1>
  388 |             <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
  389 |               Borderless surfaces, verified signals, and export-ready reporting -- built for buying houses and factories.
  390 |             </p>
  391 | 
  392 |             <div className="mt-8 flex flex-wrap gap-3">
  393 |               <MagneticButton
  394 |                 to="/signup"
  395 |                 className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[var(--gt-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(10,102,194,0.25)] transition hover:brightness-105 dark:shadow-none"
  396 |               >
  397 |                 Create your organization
  398 |               </MagneticButton>
  399 |               {/* Removed duplicate/obtrusive "View plans" CTA from the hero to reduce clutter. */}
  400 |             </div>
  401 |           </div>
  402 | 
  403 |           <MotionItem index={0} className="lg:col-span-5">
  404 |             <SpotlightCard
  405 |               className={[
  406 |                 'rounded-xl p-6',
  407 |                 'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
  408 |                 'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  409 |                 'transition duration-300 ease-out',
  410 |                 'hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.18)]',
  411 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  412 |               ].join(' ')}
  413 |             >
  414 |               <div className="flex items-center justify-between">
  415 |                 <p className="text-sm font-semibold text-[#09090b] dark:text-[#fafafa]">Analytics snapshot</p>
  416 |                 <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
  417 |                   Live
  418 |                 </span>
  419 |               </div>
  420 |               {loadError ? (
  421 |                 <p className="mt-3 text-xs text-[#a1a1aa]">Analytics unavailable -- showing defaults.</p>
  422 |               ) : null}
  423 |               <div className="mt-5 grid gap-3 sm:grid-cols-2">
  424 |                 {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
  425 |                   <div
  426 |                     key={tile.label}
  427 |                     className="rounded-lg bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]"
  428 |                   >
  429 |                     {loading ? (
  430 |                       <>
  431 |                         <Skeleton className="h-3 w-24 rounded" />
  432 |                         <Skeleton className="mt-3 h-7 w-16 rounded" />
  433 |                         <Skeleton className="mt-3 h-3 w-28 rounded" />
  434 |                       </>
  435 |                     ) : (
  436 |                       <>
  437 |                         <p className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">{tile.label}</p>
  438 |                         <p className={['mt-2 text-2xl font-bold tracking-tight', accentClasses(tile.accent)].join(' ')}>
  439 |                           {tile.value}
  440 |                         </p>
  441 |                         <p className="mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">{tile.sublabel}</p>
  442 |                       </>
  443 |                     )}
  444 |                   </div>
  445 |                 ))}
  446 |               </div>
  447 |             </SpotlightCard>
  448 |           </MotionItem>
  449 |         </div>
  450 | 
  451 |         <div className="mt-16" id="plans">
  452 |           <div className="text-center">
  453 |             <h2 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Simple, transparent pricing</h2>
  454 |             <p className="mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
  455 |               Choose the surface you need today -- upgrade when your team scales.
  456 |             </p>
  457 |           </div>
  458 | 
  459 |         <div className="mt-10 space-y-10">
  460 |           {visibleSections.map((section, sectionIndex) => {
  461 |             const rolePlan = plansByRole[section.key]
  462 |             return (
  463 |               <div key={section.key} className="rounded-3xl borderless-shadow bg-white/70 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] dark:bg-[#0f172a]/70 dark:shadow-none dark:ring-1 dark:ring-white/10">
  464 |                 <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
  465 |                   <div>
  466 |                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{section.title}</p>
  467 |                     <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{section.subtitle}</h3>
  468 |                   </div>
  469 |                   {isLoggedIn && activePlanKey === section.key ? (
  470 |                     <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
  471 |                       Your current role
  472 |                     </span>
  473 |                   ) : null}
  474 |                 </div>
  475 | 
  476 |                 <div className="mt-6 grid gap-6 lg:grid-cols-2">
  477 |                   <MotionItem index={sectionIndex * 2 + 1}>
  478 |             <SpotlightCard
  479 |               className={[
  480 |                 'rounded-xl p-7',
  481 |                 'bg-[rgba(9,9,11,0.02)] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
  482 |                 'transition duration-300 ease-out',
  483 |                 'hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-18px_rgba(0,0,0,0.22)]',
  484 |                 'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  485 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  486 |               ].join(' ')}
  487 |             >
  488 |                 <div className="flex items-start justify-between gap-6">
  489 |                   <div>
  490 |                     <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Free</h3>
  491 |                     <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Start with essential workflow.</p>
  492 |                   </div>
  493 |                   <div className="text-right">
  494 |                     <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$0</p>
  495 |                     <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
  496 |                   </div>
  497 |                 </div>
  498 | 
  499 |                 <ul className="mt-6 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
  500 |                   {rolePlan.Free.map((f) => (
  501 |                     <li key={f} className="flex items-start gap-2">
  502 |                       <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(9,9,11,0.06)] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
  503 |                         <Minus className="h-3 w-3" />
  504 |                       </span>
  505 |                       <span>{f}</span>
  506 |                     </li>
  507 |                   ))}
  508 |                 </ul>
  509 | 
  510 |                 <div className="mt-7">
  511 |                   <MagneticButton
  512 |                     to="/signup"
  513 |                     className="inline-flex w-full items-center justify-center rounded-md bg-[rgba(9,9,11,0.06)] px-5 py-3 text-sm font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
  514 |                   >
  515 |                     Get started
  516 |                   </MagneticButton>
  517 |                 </div>
  518 |               </SpotlightCard>
  519 |             </MotionItem>
  520 | 
  521 |                   <MotionItem index={sectionIndex * 2 + 2}>
  522 |               <SpotlightCard
  523 |                 className={[
  524 |                   'conic-beam rounded-xl p-7',
  525 |                   'bg-[rgba(255,255,255,0.70)] backdrop-blur-[12px]',
  526 |                   'borderless-shadow shadow-[0_10px_38px_-18px_rgba(0,0,0,0.22)]',
  527 |                   'transition duration-300 ease-out',
  528 |                   'hover:-translate-y-0.5 hover:shadow-[0_16px_54px_-22px_rgba(0,0,0,0.26)]',
  529 |                   'dark:bg-[rgba(24,24,27,0.70)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  530 |                   'dark:hover:translate-y-0 dark:hover:shadow-none',
  531 |                 ].join(' ')}
  532 |               >
  533 |                 <div className="flex items-start justify-between gap-6">
  534 |                   <div>
  535 |                     <div className="flex items-center gap-2">
  536 |                       <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Premium</h3>
  537 |                       <span className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusChip[verificationStatus]].join(' ')}>
  538 |                         {statusLabel[verificationStatus]}
  539 |                       </span>
  540 |                     </div>
  541 |                     <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Built for buying houses & enterprise teams.</p>
  542 |                   </div>
  543 |                   <div className="text-right">
  544 |                     <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$199</p>
  545 |                     <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
  546 |                   </div>
  547 |                 </div>
  548 | 
  549 |                 <ul className="mt-6 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
  550 |                   {rolePlan.Premium.map((f) => (
  551 |                     <li key={f} className="flex items-start gap-2">
  552 |                       <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-[#2dd4bf]">
  553 |                         <Check className="h-3 w-3" />
  554 |                       </span>
  555 |                       <span>{f}</span>
  556 |                     </li>
  557 |                   ))}
  558 |                 </ul>
  559 | 
  560 |                 <div className="mt-7">
  561 |                   <MagneticButton
  562 |                     to="/signup"
  563 |                     className="shimmer-btn inline-flex w-full items-center justify-center rounded-md bg-[#2dd4bf] px-5 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none"
  564 |                   >
  565 |                     Choose premium
  566 |                   </MagneticButton>
  567 |                 </div>
  568 |               </SpotlightCard>
  569 |                   </MotionItem>
  570 |                 </div>
  571 |               </div>
  572 |             )
  573 |           })}
  574 |         </div>
  575 | 
  576 |         </div>
  577 | 
  578 |         <div className="mt-16">
  579 |           <div className="grid gap-6 md:grid-cols-6">
  580 |             <MotionItem index={3} className="md:col-span-3">
  581 |               <SpotlightCard
  582 |                 className={[
  583 |                   'rounded-xl p-7',
  584 |                   'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
  585 |                   'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  586 |                   'transition duration-300 ease-out',
  587 |                   'hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.18)]',
  588 |                   'dark:hover:translate-y-0 dark:hover:shadow-none',
  589 |                 ].join(' ')}
  590 |               >
  591 |                 <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Why enterprise matters</h3>
  592 |                 <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
  593 |                   When your team scales, structure beats noise. Premium keeps workflows conflict-free and audit-ready.
  594 |                 </p>
  595 |                 <ul className="mt-5 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
  596 |                   {['Team scale without limits', 'Decision-ready visibility', 'Secure contract trail', 'Verified trust signals'].map((item) => (
  597 |                     <li key={item} className="flex items-start gap-2">
  598 |                       <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(10,102,194,0.14)] text-[var(--gt-blue)]">
  599 |                         <Check className="h-3 w-3" />
  600 |                       </span>
  601 |                       <span>{item}</span>
  602 |                     </li>
  603 |                   ))}
  604 |                 </ul>
  605 |               </SpotlightCard>
  606 |             </MotionItem>
  607 | 
  608 |             <MotionItem index={4} className="md:col-span-3">
  609 |               <SpotlightCard
  610 |                 className={[
  611 |                   'rounded-xl p-7',
  612 |                   'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
  613 |                   'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  614 |                   'transition duration-300 ease-out',
  615 |                   'hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.18)]',
  616 |                   'dark:hover:translate-y-0 dark:hover:shadow-none',
  617 |                 ].join(' ')}
  618 |               >
  619 |                 <div className="flex items-center justify-between">
  620 |                   <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Enterprise analytics</h3>
  621 |                   <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
  622 |                     Auto-sorted
  623 |                   </span>
  624 |                 </div>
  625 |                 <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Decision-ready metrics without spreadsheet UI.</p>
  626 | 
  627 |                 <div className="mt-5 grid gap-3 sm:grid-cols-2">
  628 |                   {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
  629 |                     <div
  630 |                       key={tile.label}
  631 |                       className="rounded-lg bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]"
  632 |                     >
  633 |                       {loading ? (
  634 |                         <>
  635 |                           <Skeleton className="h-3 w-24 rounded" />
  636 |                           <Skeleton className="mt-3 h-7 w-14 rounded" />
  637 |                           <Skeleton className="mt-3 h-3 w-20 rounded" />
  638 |                         </>
  639 |                       ) : (
  640 |                         <>
  641 |                           <p className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">{tile.label}</p>
  642 |                           <p className={['mt-2 text-2xl font-bold tracking-tight', accentClasses(tile.accent)].join(' ')}>
  643 |                             {tile.value}
  644 |                           </p>
  645 |                           <p className="mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">{tile.sublabel}</p>
  646 |                         </>
  647 |                       )}
  648 |                     </div>
  649 |                   ))}
  650 |                 </div>
  651 |               </SpotlightCard>
  652 |             </MotionItem>
  653 |           </div>
  654 |         </div>
  655 | 
  656 |         <div className="mt-10">
  657 |           <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] text-center">Premium feature deep dive</h2>
  658 |           <p className="mt-2 text-center text-sm text-[#52525b] dark:text-[#a1a1aa]">A role-specific roundup of what the Premium plan unlocks.</p>
  659 |           <div className="mt-6 grid gap-6 lg:grid-cols-3">
  660 |             {premiumFeatures.map((bundle) => (
  661 |               <SpotlightCard
  662 |                 key={bundle.title}
  663 |                 className={[
  664 |                   'rounded-2xl p-6',
  665 |                   'borderless-shadow bg-[rgba(9,9,11,0.04)]',
  666 |                   'shadow-[0_20px_40px_-26px_rgba(0,0,0,0.85)] dark:bg-[rgba(250,250,250,0.04)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  667 |                 ].join(' ')}
  668 |               >
  669 |                 <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{bundle.title}</p>
  670 |                 <ul className="mt-4 space-y-2 text-sm text-[#09090b] dark:text-[#fafafa]">
  671 |                   {bundle.items.map((item) => (
  672 |                     <li key={item} className="flex items-start gap-2">
  673 |                       <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#4B9DFB]" />
  674 |                       <span>{item}</span>
  675 |                     </li>
  676 |                   ))}
  677 |                 </ul>
  678 |               </SpotlightCard>
  679 |             ))}
  680 |           </div>
  681 |         </div>
  682 | 
  683 |         <div className="mt-16">
  684 |           <div className="text-center">
  685 |             <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Feature comparison</h2>
  686 |             <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Horizontal lines only. Clear, audit-ready differences.</p>
  687 |           </div>
  688 | 
  689 |           <div className="mt-6 overflow-x-auto rounded-xl bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#18181b] dark:borderless-shadow dark:shadow-none">
  690 |             <table className="min-w-full text-left text-sm">
  691 |               <thead>
  692 |                 <tr className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
  693 |                   <th className="px-6 py-4">Feature</th>
  694 |                   <th className="px-6 py-4">Free</th>
  695 |                   <th className="px-6 py-4">Premium</th>
  696 |                 </tr>
  697 |               </thead>
  698 |               <tbody className="divide-y divide-[#e4e4e7] dark:divide-[#27272a]">
  699 |                 {tableRows.map((row) => (
  700 |                   <tr key={row.label} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
  701 |                     <td className="px-6 py-4 font-medium text-[#09090b] dark:text-[#fafafa]">{row.label}</td>
  702 |                     <td className="px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]">
  703 |                       {typeof row.free === 'boolean' ? (
  704 |                         row.free ? <Check className="h-4 w-4 text-[#2dd4bf]" /> : <Minus className="h-4 w-4 text-[#a1a1aa]" />
  705 |                       ) : (
  706 |                         row.free
  707 |                       )}
  708 |                     </td>
  709 |                     <td className="px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]">
  710 |                       {typeof row.premium === 'boolean' ? (
  711 |                         row.premium ? <Check className="h-4 w-4 text-[#2dd4bf]" /> : <Minus className="h-4 w-4 text-[#a1a1aa]" />
  712 |                       ) : (
  713 |                         row.premium
  714 |                       )}
  715 |                     </td>
  716 |                   </tr>
  717 |                 ))}
  718 |               </tbody>
  719 |             </table>
  720 |           </div>
  721 |         </div>
  722 | 
  723 |         <div className="mt-16">
  724 |           <div className="mx-auto max-w-3xl text-center">
  725 |             <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">FAQ</h2>
  726 |             <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Short answers, no sales noise.</p>
  727 |           </div>
  728 | 
  729 |           <div className="mx-auto mt-6 grid max-w-3xl gap-4">
  730 |             {[
  731 |               { q: 'Can I upgrade anytime*', a: 'Yes -- your data stays intact.' },
  732 |               { q: 'Can I downgrade*', a: 'Yes -- plan limits apply immediately.' },
  733 |               { q: 'Does GarTexHub handle payments*', a: 'Not yet. The platform focuses on workflow + coordination. Premium can be activated via promo coupon without a card when eligible.' },
  734 |               { q: 'Are calls recorded*', a: 'Yes -- for documentation and compliance.' },
  735 |             ].map((item, idx) => (
  736 |               <MotionItem key={item.q} index={5 + idx}>
  737 |                 <SpotlightCard
  738 |                   className={[
  739 |                     'rounded-xl p-6',
  740 |                     'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
  741 |                     'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  742 |                     'transition duration-300 ease-out',
  743 |                     'hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.18)]',
  744 |                     'dark:hover:translate-y-0 dark:hover:shadow-none',
  745 |                   ].join(' ')}
  746 |                 >
  747 |                   <p className="font-semibold text-[#09090b] dark:text-[#fafafa]">{item.q}</p>
  748 |                   <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">{item.a}</p>
  749 |                 </SpotlightCard>
  750 |               </MotionItem>
  751 |             ))}
  752 |           </div>
  753 |         </div>
  754 | 
  755 |         <div className="mt-16 pb-4">
  756 |           <SpotlightCard
  757 |             className={[
  758 |               'rounded-xl p-10 text-center',
  759 |               'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
  760 |               'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  761 |             ].join(' ')}
  762 |           >
  763 |             <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
  764 |               Build a structured textile network today
  765 |             </h2>
  766 |             <p className="mx-auto mt-3 max-w-xl text-sm text-[#52525b] dark:text-[#a1a1aa]">
  767 |               Start free, upgrade when your org needs analytics, export, and secure contract management.
  768 |             </p>
  769 |             <div className="mt-7 flex flex-wrap justify-center gap-3">
  770 |               <MagneticButton
  771 |                 to="/signup"
  772 |                 className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[var(--gt-blue)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(10,102,194,0.25)] transition hover:brightness-105 dark:shadow-none"
  773 |               >
  774 |                 Create your organization
  775 |               </MagneticButton>
  776 |               <MagneticButton
  777 |                 to="/signup"
  778 |                 className="inline-flex items-center justify-center rounded-md bg-[#2dd4bf] px-6 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none"
  779 |               >
  780 |                 Choose premium
  781 |               </MagneticButton>
  782 |             </div>
  783 |           </SpotlightCard>
  784 |         </div>
  785 |       </div>
  786 |     </div>
  787 |   )
  788 | }
  789 | 
  790 | 
  791 | 