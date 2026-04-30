    1 | /*
    2 |   Route: /
    3 |   Page Name: Landing (TexHub)
    4 |   Access: Public
    5 | 
    6 |   Public Pages:
    7 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    8 |   Protected Pages (login required):
    9 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
   10 |     /notifications, /chat, /call, /verification, /verification-center
   11 | 
   12 |   Primary responsibilities:
   13 |     - Marketing/landing surface for GarTexHub (hero + bento features).
   14 |     - Demonstrate key platform concepts: Buyer Requests, Verified Factories, Contract Vault, Analytics, Agent Lock, etc.
   15 |     - Fetch "dynamic preview" data from a public system endpoint, and show skeleton shimmer while loading.
   16 | 
   17 |   Key API endpoints:
   18 |     - GET /api/system/home  (via `apiRequest('/system/home')`)
   19 | 
   20 |   Major UI/UX patterns used:
   21 |     - Borderless surfaces: depth via shadows/rings instead of hard borders.
   22 |     - Dark mode: deep midnight background + lifted card surfaces.
   23 |     - Motion: Framer Motion stagger entrances, hero character animation, magnetic buttons, spotlight hover.
   24 |     - `spotlight-card` custom utility (App.css): mouse-follow radial highlight inside cards.
   25 |     - `skeleton` custom utility (App.css): diagonal shimmer placeholder while loading.
   26 | */
   27 | import React, { useEffect, useMemo, useState } from 'react'
   28 | import { Link } from 'react-router-dom'
   29 | import { apiRequest } from '../lib/auth'
   30 | import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
   31 | 
   32 | const Motion = motion
   33 | 
   34 | function VerifiedBadge({ label = 'Verified' }) {
   35 |   return (
   36 |     // "Trust anchor" badge:
   37 |     // - Light mode: subtle emerald tint + soft glow
   38 |     // - Dark mode: slightly brighter mint glow (still subdued)
   39 |     <span
   40 |       className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_10px_24px_rgba(16,185,129,0.12)] dark:bg-emerald-400/8 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.14),0_0_32px_rgba(16,185,129,0.16)]"
   41 |       title="Verified"
   42 |     >
   43 |       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.65)] dark:bg-emerald-300 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
   44 |       {label}
   45 |     </span>
   46 |   )
   47 | }
   48 | 
   49 | function Surface({ className='', children }) {
   50 |   function handleSpotlightMove(event) {
   51 |     // Mouse-follow spotlight:
   52 |     // - store cursor position inside the card as CSS variables
   53 |     // - `spotlight-card::before` reads these variables to draw a radial gradient highlight
   54 |     const rect = event.currentTarget.getBoundingClientRect()
   55 |     event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
   56 |     event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
   57 |   }
   58 | 
   59 |   return (
   60 |     <div
   61 |       className={[
   62 |         // Visual: borderless card with depth via shadows (light) + lifted slate surface (dark).
   63 |         'spotlight-card rounded-3xl bg-white/75 backdrop-blur-sm',
   64 |         'shadow-[0_18px_46px_rgba(15,23,42,0.08)]',
   65 |         'dark:bg-[#0D0D14] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
   66 |         'transition duration-300 ease-out will-change-transform',
   67 |         'hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)]',
   68 |         'dark:hover:-translate-y-1',
   69 |         className,
   70 |       ].join(' ')}
   71 |       onMouseMove={handleSpotlightMove}
   72 |     >
   73 |       {children}
   74 |     </div>
   75 |   )
   76 | }
   77 | 
   78 | function GlassSurface({ className='', children }) {
   79 |   function handleSpotlightMove(event) {
   80 |     // Same spotlight behavior as `Surface`, but on a darker "secure room" glass surface.
   81 |     const rect = event.currentTarget.getBoundingClientRect()
   82 |     event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
   83 |     event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
   84 |   }
   85 | 
   86 |   return (
   87 |     <div
   88 |       className={[
   89 |         // Intentionally dark glass in *both* light + dark mode (Contract Vault = "secure room" vibe).
   90 |         // Avoid multiple `bg-*` utilities here (Tailwind utility ordering can make overrides unreliable).
   91 |         // `ring-1 ring-white/12` gives the "glass edge" without using borders (which are globally overridden in dark mode).
   92 |         'spotlight-card rounded-3xl bg-white/10 backdrop-blur-md text-[#1E293B] dark:text-white',
   93 |         'shadow-[0_22px_60px_rgba(2,6,23,0.55)]',
   94 |         'ring-1 ring-white/12',
   95 |         'transition duration-300 ease-out will-change-transform',
   96 |         'hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(2,6,23,0.65)]',
   97 |         className,
   98 |       ].join(' ')}
   99 |       onMouseMove={handleSpotlightMove}
  100 |     >
  101 |       {children}
  102 |     </div>
  103 |   )
  104 | }
  105 | 
  106 | function BentoMotion({ index, className='', children }) {
  107 |   const reduceMotion = useReducedMotion()
  108 |   // Accessibility: if user prefers reduced motion, render without animation.
  109 |   if (reduceMotion) return <div className={className}>{children}</div>
  110 | 
  111 |   return (
  112 |     <motion.div
  113 |       className={className}
  114 |       // Entrance: fade + slide up (and a tiny scale) to mimic modern "bento" reveal.
  115 |       initial={{ opacity: 0, y: 20, scale: 0.985 }}
  116 |       animate={{ opacity: 1, y: 0, scale: 1 }}
  117 |       transition={{
  118 |         duration: 0.5,
  119 |         ease: [0.16, 1, 0.3, 1],
  120 |         // Stagger timing: each card waits `index * 100ms`.
  121 |         delay: index * 0.1,
  122 |       }}
  123 |     >
  124 |       {children}
  125 |     </motion.div>
  126 |   )
  127 | }
  128 | 
  129 | function AnimatedHeroHeading({ text, className='' }) {
  130 |   const reduceMotion = useReducedMotion()
  131 |   // Reduced-motion users get static text (no per-character animation).
  132 |   if (reduceMotion) return <span className={className}>{text}</span>
  133 | 
  134 |   // Split into words, then characters, so we can stagger a micro animation per character.
  135 |   const words = String(text).split(' ')
  136 |   let globalIndex = 0
  137 |   return (
  138 |     <span className={className}>
  139 |       <span className="sr-only">{text}</span>
  140 |       <span aria-hidden="true">
  141 |         {words.map((word, wordIndex) => {
  142 |           const chars = Array.from(word)
  143 |           return (
  144 |             <React.Fragment key={`${word}-${wordIndex}`}>
  145 |               <span className="inline-block whitespace-nowrap">
  146 |                 {chars.map((ch, idx) => {
  147 |                   const charIndex = globalIndex++
  148 |                   return (
  149 |                     <motion.span
  150 |                       key={`${ch}-${idx}`}
  151 |                       className="inline-block"
  152 |                       initial={{ opacity: 0, y: 10 }}
  153 |                       animate={{ opacity: 1, y: 0 }}
  154 |                       transition={{ duration: 0.8, ease: 'easeOut', delay: charIndex * 0.012 }}
  155 |                     >
  156 |                       {ch}
  157 |                     </motion.span>
  158 |                   )
  159 |                 })}
  160 |               </span>
  161 |               {wordIndex < words.length - 1 ? ' ' : ''}
  162 |             </React.Fragment>
  163 |           )
  164 |         })}
  165 |       </span>
  166 |     </span>
  167 |   )
  168 | }
  169 | 
  170 | function MagneticLinkButton({ to, className='', children }) {
  171 |   const reduceMotion = useReducedMotion()
  172 |   // Motion values track the current offset; springs return to center smoothly.
  173 |   const x = useMotionValue(0)
  174 |   const y = useMotionValue(0)
  175 |   const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 })
  176 |   const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 })
  177 |   // Maximum translation in px (keep subtle so it feels premium, not gimmicky).
  178 |   const maxShift = 9
  179 | 
  180 |   function handleMove(event) {
  181 |     if (reduceMotion) return
  182 |     // Convert cursor position to -1..1 range and apply a scaled translation.
  183 |     const rect = event.currentTarget.getBoundingClientRect()
  184 |     const relX = (event.clientX - rect.left) / rect.width
  185 |     const relY = (event.clientY - rect.top) / rect.height
  186 |     const dx = (relX - 0.5) * 2
  187 |     const dy = (relY - 0.5) * 2
  188 |     x.set(dx * maxShift)
  189 |     y.set(dy * maxShift)
  190 |   }
  191 | 
  192 |   function handleLeave() {
  193 |     // Snap motion values back to 0; the spring will animate it.
  194 |     x.set(0)
  195 |     y.set(0)
  196 |   }
  197 | 
  198 |   return (
  199 |     <Link to={to} className="inline-flex">
  200 |       <motion.span
  201 |         className={className}
  202 |         style={{ x: springX, y: springY }}
  203 |         onMouseMove={handleMove}
  204 |         onMouseLeave={handleLeave}
  205 |         whileHover={reduceMotion ? undefined : { y: -4 }}
  206 |         transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  207 |       >
  208 |         {children}
  209 |       </motion.span>
  210 |     </Link>
  211 |   )
  212 | }
  213 | 
  214 | function SkeletonLine({ className='' }) {
  215 |   // Skeleton shimmer utility (App.css): used during loading to avoid layout shifts.
  216 |   return <div className={['skeleton rounded-xl', className].join(' ')} />
  217 | }
  218 | 
  219 | export default function TexHub() {
  220 |   const initialHome = useMemo(
  221 |       () => ({
  222 |         hero: {
  223 |           headline: 'Where global buyers, factories, and buying houses connect with clarity',
  224 |           subheadline: 'A focused B2B sourcing workflow platform for garments and textiles. Post requests, showcase products, connect quickly, and move from first contact to contract in one place.',
  225 |           short_description: 'A focused B2B platform for Bangladesh-centric but global-facing garments and textile sourcing.',
  226 |           presentation_rule: 'Strategic presentation rule: GartexHub must be presented in a way that makes business workflow stronger, more transparent, more efficient, and more trusted. It cannot be marketed with a destructive message against any group.',
  227 |           value_props: [
  228 |             'Structured buyer request system',
  229 |             'Factory product visibility engine',
  230 |             'Buying house team-based workflow',
  231 |             'AI-assisted communication + verification',
  232 |           ],
  233 |           trust_points: [
  234 |             'Organization-based verification',
  235 |             'Digital signature + PDF contract record',
  236 |             'Audit-ready activity history',
  237 |             'Controlled communication flow',
  238 |           ],
  239 |           buyerRequest: {
  240 |             label: 'Buyer Request',
  241 |             title: 'No live buyer requests yet',
  242 |             badge: 'Live',
  243 |             fields: [],
  244 |         },
  245 |         verifiedFactories: {
  246 |           title: 'Verified factories',
  247 |           subtitle: 'Matched by compliance',
  248 |           factories: [],
  249 |         },
  250 |       },
  251 |       bento: {
  252 |         professionalFeed: {
  253 |           title: 'Professional feed',
  254 |           description: 'A calm, LinkedIn-style surface where posts stay readable without heavy frames.',
  255 |           lanes: [
  256 |             { label: 'Buyer Requests', meta: 'Auto-sorted' },
  257 |             { label: 'Factory Updates', meta: 'Auto-sorted' },
  258 |             { label: 'Buying House Notes', meta: 'Auto-sorted' },
  259 |           ],
  260 |         },
  261 |         structuredBuyerRequests: {
  262 |           title: 'Structured buyer requests',
  263 |           description: 'Perfectly aligned fields so teams compare requirements instantly.',
  264 |           badge: 'Aligned',
  265 |           fields: [],
  266 |         },
  267 |         contractVault: {
  268 |           title: 'Contract Vault',
  269 |           description: 'A secure room vibe for agreements, compliance docs, and audit-ready records.',
  270 |           items: ['Draft → Signed', 'Version history', 'Team access control'],
  271 |           badge: 'Encrypted storage',
  272 |         },
  273 |         enterpriseAnalytics: {
  274 |           title: 'Enterprise analytics',
  275 |           description: 'Decision-ready reporting for buying houses -- without turning the UI into a spreadsheet.',
  276 |           stats: [],
  277 |         },
  278 |         agentLock: {
  279 |           title: 'Internal Agent Lock System',
  280 |           description: 'Subtle, conflict-free lead ownership across multi-agent buying house teams.',
  281 |           requestLabel: 'No active request yet',
  282 |           status: 'Idle',
  283 |           note: 'Live request locks will appear here once teams start claiming leads.',
  284 |         },
  285 |       },
  286 |       marketing: {
  287 |         sections: [],
  288 |       },
  289 |     }),
  290 |     [],
  291 |   )
  292 | 
  293 |   // `home` holds dynamic landing content fetched from the server (fallback to `initialHome`).
  294 |   const [home, setHome] = useState(initialHome)
  295 |   // Non-blocking error message for the public preview fetch.
  296 |   const [loadError, setLoadError] = useState('')
  297 |   // Loading flag for skeleton shimmer placeholders (prevents layout jump).
  298 |   const [loading, setLoading] = useState(true)
  299 |   // "Unique toggle" mode: switches between a strict professional view and a broader discovery view.
  300 |   const [mode, setMode] = useState('professional')
  301 | 
  302 |   useEffect(() => {
  303 |     // Fetch dynamic landing page content from `/system/home`.
  304 |     // We guard with `alive` + AbortController to avoid setState after unmount.
  305 |     let alive = true
  306 |     const controller = new AbortController()
  307 | 
  308 |     apiRequest('/system/home', { signal: controller.signal })
  309 |       .then((data) => {
  310 |         if (!alive) return
  311 |         if (data?.ok && data?.hero && data?.bento) {
  312 |           // Merge server data over local defaults (keeps layout stable if server omits a field).
  313 |           setHome((prev) => ({ ...prev, ...data }))
  314 |         }
  315 |       })
  316 |       .catch((err) => {
  317 |         if (!alive) return
  318 |         if (err?.name === 'AbortError') return
  319 |         // Keep rendering fallback content; only show a small inline error in the UI.
  320 |         setLoadError(String(err?.message || 'Failed to load'))
  321 |       })
  322 |       .finally(() => {
  323 |         if (!alive) return
  324 |         setLoading(false)
  325 |       })
  326 | 
  327 |     return () => {
  328 |       alive = false
  329 |       controller.abort()
  330 |     }
  331 |   }, [initialHome])
  332 | 
  333 |   const heroBuyerRequest = home?.hero?.buyerRequest || initialHome.hero.buyerRequest
  334 |   const heroFactories = home?.hero?.verifiedFactories || initialHome.hero.verifiedFactories
  335 |   const heroHeadline = home?.hero?.headline || initialHome.hero.headline
  336 |   const heroSubheadline = home?.hero?.subheadline || initialHome.hero.subheadline
  337 |   const heroShortDescription = home?.hero?.short_description || initialHome.hero.short_description
  338 |   const heroPresentation = home?.hero?.presentation_rule || initialHome.hero.presentation_rule
  339 |   const heroValueProps = Array.isArray(home?.hero?.value_props) ? home.hero.value_props : initialHome.hero.value_props
  340 |   const bento = home?.bento || initialHome.bento
  341 |   const marketingSections = Array.isArray(home?.marketing?.sections) ? home.marketing.sections : (initialHome?.marketing?.sections || [])
  342 | 
  343 |   const bentoView = useMemo(() => {
  344 |     // Derived bento data based on the current `mode` toggle.
  345 |     // This is where we can swap copy, lanes, and badge semantics while keeping structure aligned.
  346 |     if (mode === 'professional') return bento
  347 |     return {
  348 |       ...bento,
  349 |       professionalFeed: {
  350 |         ...bento.professionalFeed,
  351 |         title: 'Diverse feed',
  352 |         description: 'A broader surface for discovery -- still structured and readable.',
  353 |         lanes: [
  354 |           { label: 'Market Updates', meta: 'Auto-sorted' },
  355 |           { label: 'New Suppliers', meta: 'Auto-sorted' },
  356 |           { label: 'Opportunities', meta: 'Auto-sorted' },
  357 |         ],
  358 |       },
  359 |       structuredBuyerRequests: {
  360 |         ...bento.structuredBuyerRequests,
  361 |         badge: 'Verified',
  362 |       },
  363 |     }
  364 |   }, [bento, mode])
  365 | 
  366 |   return (
  367 |     <div className="neo-page relative min-h-screen overflow-x-hidden bg-[#F8FAFC] dark:bg-[#05050A]">
  368 |       <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
  369 |         <div
  370 |           className={[
  371 |             'absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full blur-3xl',
  372 |             mode === 'professional' ? 'bg-emerald-500/10' : 'bg-fuchsia-500/10',
  373 |           ].join(' ')}
  374 |         />
  375 |         <div
  376 |           className={[
  377 |             'absolute top-24 right-[-140px] h-[520px] w-[520px] rounded-full blur-3xl',
  378 |             mode === 'professional' ? 'bg-sky-500/10' : 'bg-violet-500/10',
  379 |           ].join(' ')}
  380 |         />
  381 |         <div
  382 |           className={[
  383 |             'absolute bottom-[-220px] left-[-160px] h-[600px] w-[600px] rounded-full blur-3xl',
  384 |             mode === 'professional' ? 'bg-indigo-500/10' : 'bg-emerald-500/10',
  385 |           ].join(' ')}
  386 |         />
  387 |       </div>
  388 |       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
  389 |         <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
  390 |           <div className="lg:col-span-6">
  391 |             <div className="inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
  392 |               <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]" />
  393 |               Clean Tech sourcing for garments & textiles
  394 |             </div>
  395 |               <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl dark:text-white">
  396 |                 <AnimatedHeroHeading text={heroHeadline} />
  397 |               </h1>
  398 |               <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-400">
  399 |                 {heroSubheadline}
  400 |               </p>
  401 |               <p className="mt-3 max-w-xl text-sm font-medium text-[#334155] dark:text-slate-300">
  402 |                 {heroShortDescription}
  403 |               </p>
  404 |               {heroPresentation ? (
  405 |                 <p className="mt-2 max-w-xl text-xs italic text-[#64748B] dark:text-slate-400">
  406 |                   {heroPresentation}
  407 |                 </p>
  408 |               ) : null}
  409 | 
  410 |             <div className="mt-8 flex flex-wrap items-center gap-3">
  411 |               <MagneticLinkButton
  412 |                 to="/signup"
  413 |                 className="shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
  414 |               >
  415 |                 Create Buyer Account
  416 |               </MagneticLinkButton>
  417 |               <MagneticLinkButton
  418 |                 to="/signup"
  419 |                 className="px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-white/70 text-[#1E293B] font-semibold tracking-tight backdrop-blur-sm transition duration-300 ease-out hover:bg-white hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]"
  420 |               >
  421 |                 Register Factory
  422 |               </MagneticLinkButton>
  423 |               <MagneticLinkButton
  424 |                 to="/login"
  425 |                 className="px-4 py-2 shadow-none inline-flex items-center justify-center rounded-2xl bg-[#1E293B]/5 text-[#1E293B]/80 font-semibold transition duration-300 ease-out hover:bg-[#1E293B]/8 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
  426 |               >
  427 |                 
  428 |               </MagneticLinkButton>
  429 |             </div>
  430 | 
  431 |             <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-[#475569] sm:grid-cols-4 dark:text-slate-400">
  432 |               <div className="flex items-center gap-2">
  433 |                 <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
  434 |                 Structured Buyer Requests
  435 |               </div>
  436 |               <div className="flex items-center gap-2">
  437 |                 <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
  438 |                 Verified Factories
  439 |               </div>
  440 |               <div className="flex items-center gap-2">
  441 |                 <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
  442 |                 Digital Contract Vault
  443 |               </div>
  444 |               <div className="flex items-center gap-2">
  445 |                 <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
  446 |                 AI Guided Workflow
  447 |               </div>
  448 |             </div>
  449 |           </div>
  450 | 
  451 |           <div className="lg:col-span-6">
  452 |             <Surface className="p-6">
  453 |               <div className="flex items-center justify-between">
  454 |                 {loading ? (
  455 |                   <>
  456 |                     <SkeletonLine className="h-7 w-40 rounded-full" />
  457 |                     <SkeletonLine className="h-7 w-24 rounded-full" />
  458 |                   </>
  459 |                 ) : (
  460 |                   <>
  461 |                     <div className="h-7 w-40 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]" />
  462 |                     <div className="h-7 w-24 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]" />
  463 |                   </>
  464 |                 )}
  465 |               </div>
  466 |               <div className="mt-5 grid gap-3">
  467 |                 {loading ? (
  468 |                   <>
  469 |                     <div className="rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
  470 |                       <SkeletonLine className="h-3 w-24" />
  471 |                       <SkeletonLine className="mt-3 h-4 w-64" />
  472 |                       <div className="mt-4 grid grid-cols-2 gap-2">
  473 |                         <SkeletonLine className="h-8" />
  474 |                         <SkeletonLine className="h-8" />
  475 |                       </div>
  476 |                     </div>
  477 |                     <div className="rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]">
  478 |                       <div className="flex items-center justify-between gap-3">
  479 |                         <SkeletonLine className="h-4 w-36" />
  480 |                         <SkeletonLine className="h-3 w-28" />
  481 |                       </div>
  482 |                       <div className="mt-3 grid gap-2">
  483 |                         <SkeletonLine className="h-10" />
  484 |                         <SkeletonLine className="h-10" />
  485 |                         <SkeletonLine className="h-10" />
  486 |                       </div>
  487 |                     </div>
  488 |                   </>
  489 |                 ) : (
  490 |                   <>
  491 |                     <div className="rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
  492 |                       <div className="flex items-center justify-between gap-4">
  493 |                         <div className="min-w-0">
  494 |                           <p className="text-xs font-semibold text-emerald-700">{heroBuyerRequest.label}</p>
  495 |                           <p className="mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white">{heroBuyerRequest.title}</p>
  496 |                         </div>
  497 |                         <VerifiedBadge label={heroBuyerRequest.badge} />
  498 |                       </div>
  499 |                       <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#475569] dark:text-slate-400">
  500 |                         {(heroBuyerRequest.fields || []).slice(0, 2).map((field) => (
  501 |                           <div
  502 |                             key={field.label}
  503 |                             className="flex items-center justify-between rounded-xl bg-[#1E293B]/4 px-3 py-2 dark:bg-white/[0.03]"
  504 |                           >
  505 |                             <span>{field.label}</span>
  506 |                             <span className="font-semibold text-[#1E293B] dark:text-white">{field.value}</span>
  507 |                           </div>
  508 |                         ))}
  509 |                       </div>
  510 |                     </div>
  511 |                     <div className="rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]">
  512 |                       <div className="flex items-center justify-between gap-3">
  513 |                         <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{heroFactories.title}</p>
  514 |                         <p className="text-xs text-[#475569] dark:text-slate-400">{heroFactories.subtitle}</p>
  515 |                       </div>
  516 |                       <div className="mt-3 grid gap-2">
  517 |                         {(heroFactories.factories || []).slice(0, 3).map((factory) => (
  518 |                           <div
  519 |                             key={factory.id || factory.name}
  520 |                             className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 dark:bg-[#05050A]"
  521 |                           >
  522 |                             <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{factory.name}</p>
  523 |                             {factory.verified ? <VerifiedBadge /> : <VerifiedBadge label="Review" />}
  524 |                           </div>
  525 |                         ))}
  526 |                       </div>
  527 |                     </div>
  528 |                   </>
  529 |                 )}
  530 |                 {loadError ? <p className="text-xs text-amber-700 dark:text-amber-300">{loadError}</p> : null}
  531 |               </div>
  532 |             </Surface>
  533 |           </div>
  534 |         </div>
  535 | 
  536 |         <div id="about" className="mt-16">
  537 |           <div className="grid gap-6 lg:grid-cols-2">
  538 |             <Surface className="relative p-8">
  539 |               <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]" />
  540 |               <div className="relative z-10">
  541 |                 <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Why GarTexHub</h3>
  542 |                 <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  543 |                   A sourcing workflow network built only for garments and textiles: low noise, structured requests, and trust by design.
  544 |                 </p>
  545 |                 <ul className="mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300">
  546 |                   {(heroValueProps || []).slice(0, 4).map((item) => (
  547 |                     <li key={item}>{item}</li>
  548 |                   ))}
  549 |                 </ul>
  550 |               </div>
  551 |             </Surface>
  552 |             <Surface className="relative p-8">
  553 |               <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent_70%)]" />
  554 |               <div className="relative z-10">
  555 |               <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Solution</h3>
  556 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  557 |                 Clear surfaces, verified signals, and structured workflows -- designed to stay calm at scale.
  558 |               </p>
  559 |               <ul className="mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300">
  560 |                 <li>Structured Buyer Requests</li>
  561 |                 <li>Verified supplier priority</li>
  562 |                 <li>Internal Agent Lock System</li>
  563 |                 <li>Organized partner network</li>
  564 |               </ul>
  565 |               </div>
  566 |             </Surface>
  567 |           </div>
  568 |         </div>
  569 | 
  570 |         <div id="how-it-works" className="mt-16">
  571 |           <div>
  572 |             <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">How GarTexHub works</h2>
  573 |             <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">A simple flow that stays structured end-to-end.</p>
  574 |           </div>
  575 | 
  576 |           <div className="mt-6 grid gap-6 md:grid-cols-3">
  577 |             <Surface className="p-6">
  578 |               <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 1</p>
  579 |               <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Post or search</h4>
  580 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  581 |                 Buyers post structured requirements. Factories publish products and capacity.
  582 |               </p>
  583 |             </Surface>
  584 |             <Surface className="p-6">
  585 |               <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 2</p>
  586 |               <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Smart matching + claim lead</h4>
  587 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  588 |                 Agents claim requests. AI summarizes context so the team moves fast without noise.
  589 |               </p>
  590 |             </Surface>
  591 |             <Surface className="p-6">
  592 |               <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 3</p>
  593 |               <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Chat, call, contract</h4>
  594 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  595 |                 Communicate, schedule meetings, and store agreements inside the Contract Vault.
  596 |               </p>
  597 |             </Surface>
  598 |           </div>
  599 |         </div>
  600 | 
  601 |         {marketingSections.length ? (
  602 |           <div className="mt-16">
  603 |             <div className="flex flex-col items-center text-center">
  604 |               <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Why GarTexHub</h3>
  605 |               <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  606 |                 Clear positioning and a structured sourcing workflow -- built only for garments & textile.
  607 |               </p>
  608 |             </div>
  609 | 
  610 |             <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 dark:gap-px">
  611 |               {marketingSections.map((section, idx) => (
  612 |                 <BentoMotion key={section.id || section.title || String(idx)} index={idx} className="md:col-span-1">
  613 |                   <Surface className="p-7">
  614 |                     {section.eyebrow ? (
  615 |                       <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{section.eyebrow}</p>
  616 |                     ) : null}
  617 |                     <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{section.title}</h4>
  618 |                     {section.description ? (
  619 |                       <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">{section.description}</p>
  620 |                     ) : null}
  621 |                     {Array.isArray(section.bullets) && section.bullets.length ? (
  622 |                       <ul className="mt-4 space-y-2 text-sm text-[#334155] dark:text-slate-300">
  623 |                         {section.bullets.map((bullet) => (
  624 |                           <li key={bullet} className="flex items-start gap-2">
  625 |                             <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/90" />
  626 |                             <span className="leading-relaxed">{bullet}</span>
  627 |                           </li>
  628 |                         ))}
  629 |                       </ul>
  630 |                     ) : null}
  631 |                   </Surface>
  632 |                 </BentoMotion>
  633 |               ))}
  634 |             </div>
  635 |           </div>
  636 |         ) : null}
  637 | 
  638 |         <div className="mt-16">
  639 |           <div className="flex flex-col items-center text-center">
  640 |             <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Platform features</h3>
  641 |             <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  642 |               Borderless surfaces, clean hierarchy, and strong trust indicators.
  643 |             </p>
  644 |           </div>
  645 | 
  646 |           <div
  647 |             className={[
  648 |               'mt-8 rounded-3xl bg-transparent p-0 dark:p-[2px] transition-colors duration-[400ms]',
  649 |               mode === 'professional' ? 'dark:bg-[#05050A]' : 'dark:bg-[#0B0A18]',
  650 |             ].join(' ')}
  651 |           >
  652 |           <div className="grid grid-cols-1 gap-6 md:grid-cols-6 dark:gap-px">
  653 |             <BentoMotion index={0} className="md:col-span-3">
  654 |             <Surface className="p-7">
  655 |               <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.professionalFeed.title}</h4>
  656 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  657 |                 {bentoView.professionalFeed.description}
  658 |               </p>
  659 |               <div className="mt-5 grid gap-2">
  660 |                 {loading ? (
  661 |                   <>
  662 |                     <SkeletonLine className="h-10" />
  663 |                     <SkeletonLine className="h-10" />
  664 |                     <SkeletonLine className="h-10" />
  665 |                   </>
  666 |                 ) : (
  667 |                   <AnimatePresence mode="popLayout" initial={false}>
  668 |                     <motion.div
  669 |                       key={mode}
  670 |                       initial={{ opacity: 0, y: 6 }}
  671 |                       animate={{ opacity: 1, y: 0 }}
  672 |                       exit={{ opacity: 0, y: -6 }}
  673 |                       transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  674 |                       className="grid gap-2"
  675 |                     >
  676 |                       {(bentoView.professionalFeed.lanes || []).map((lane) => (
  677 |                         <div
  678 |                           key={lane.label}
  679 |                           className="flex items-center justify-between rounded-2xl bg-slate-900/4 px-4 py-3 dark:bg-white/[0.03]"
  680 |                         >
  681 |                           <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{lane.label}</p>
  682 |                           <span className="rounded-full bg-[#1E293B]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] dark:bg-white/[0.06] dark:text-slate-400">
  683 |                             {lane.meta}
  684 |                           </span>
  685 |                         </div>
  686 |                       ))}
  687 |                     </motion.div>
  688 |                   </AnimatePresence>
  689 |                 )}
  690 |               </div>
  691 |             </Surface>
  692 |             </BentoMotion>
  693 | 
  694 |             <BentoMotion index={1} className="md:col-span-3">
  695 |             <Surface className="p-7">
  696 |               <div className="flex items-center justify-between gap-4">
  697 |                 <div>
  698 |                   <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.structuredBuyerRequests.title}</h4>
  699 |                   <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  700 |                     {bentoView.structuredBuyerRequests.description}
  701 |                   </p>
  702 |                 </div>
  703 |                 <VerifiedBadge label={bentoView.structuredBuyerRequests.badge} />
  704 |               </div>
  705 | 
  706 |               <div className="mt-5 grid gap-3 sm:grid-cols-2">
  707 |                 {loading ? (
  708 |                   <>
  709 |                     <SkeletonLine className="h-10" />
  710 |                     <SkeletonLine className="h-10" />
  711 |                     <SkeletonLine className="h-10" />
  712 |                     <SkeletonLine className="h-10" />
  713 |                   </>
  714 |                 ) : (
  715 |                   <AnimatePresence mode="popLayout" initial={false}>
  716 |                     <motion.div
  717 |                       key={mode}
  718 |                       initial={{ opacity: 0, y: 6 }}
  719 |                       animate={{ opacity: 1, y: 0 }}
  720 |                       exit={{ opacity: 0, y: -6 }}
  721 |                       transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  722 |                       className="grid gap-3 sm:grid-cols-2"
  723 |                     >
  724 |                       {(bentoView.structuredBuyerRequests.fields || []).map((field) => (
  725 |                         <div
  726 |                           key={field.label}
  727 |                           className="flex items-center justify-between rounded-2xl bg-slate-900/4 px-4 py-3 text-sm dark:bg-white/[0.03]"
  728 |                         >
  729 |                           <span className="text-[#64748B] dark:text-slate-400">{field.label}</span>
  730 |                           <span className="font-semibold text-[#1E293B] dark:text-white">{field.value}</span>
  731 |                         </div>
  732 |                       ))}
  733 |                     </motion.div>
  734 |                   </AnimatePresence>
  735 |                 )}
  736 |               </div>
  737 |             </Surface>
  738 |             </BentoMotion>
  739 | 
  740 |             <BentoMotion index={2} className="md:col-span-2">
  741 |             <GlassSurface className="p-7">
  742 |               <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.contractVault.title}</h4>
  743 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80">{bentoView.contractVault.description}</p>
  744 |               <div className="mt-5 space-y-2">
  745 |                 {(bentoView.contractVault.items || []).map((item) => (
  746 |                   <div key={item} className="rounded-2xl bg-[#1E293B]/5 px-4 py-3 text-sm text-[#1E293B] dark:bg-white/12 dark:text-white">
  747 |                     {item}
  748 |                   </div>
  749 |                 ))}
  750 |               </div>
  751 |               <div className="mt-5 inline-flex">
  752 |                 <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_16px_40px_rgba(16,185,129,0.12)] dark:bg-emerald-400/18 dark:text-emerald-200 dark:shadow-[0_0_26px_rgba(16,185,129,0.24)]">
  753 |                   {bentoView.contractVault.badge}
  754 |                 </span>
  755 |               </div>
  756 |             </GlassSurface>
  757 |             </BentoMotion>
  758 | 
  759 |             <BentoMotion index={3} className="md:col-span-4">
  760 |             <Surface className="p-7">
  761 |               <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.enterpriseAnalytics.title}</h4>
  762 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  763 |                 {bentoView.enterpriseAnalytics.description}
  764 |               </p>
  765 |               <div className="mt-5 grid gap-3 sm:grid-cols-3">
  766 |                 {(bentoView.enterpriseAnalytics.stats || []).map((stat) => (
  767 |                   <div key={stat.label} className="rounded-2xl bg-slate-900/4 p-4 dark:bg-white/[0.03]">
  768 |                     <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{stat.label}</p>
  769 |                     <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">{stat.value}</p>
  770 |                   </div>
  771 |                 ))}
  772 |               </div>
  773 |             </Surface>
  774 |             </BentoMotion>
  775 | 
  776 |             <BentoMotion index={4} className="md:col-span-4">
  777 |             <Surface className="p-7 bg-slate-900/3">
  778 |               <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.agentLock.title}</h4>
  779 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  780 |                 {bentoView.agentLock.description}
  781 |               </p>
  782 |               <div className="mt-5 rounded-2xl bg-white/70 p-4 dark:bg-white/[0.03]">
  783 |                 <div className="flex items-center justify-between gap-3">
  784 |                   <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{bentoView.agentLock.requestLabel}</p>
  785 |                   <span className="rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300">
  786 |                     {bentoView.agentLock.status}
  787 |                   </span>
  788 |                 </div>
  789 |                 <p className="mt-2 text-xs leading-relaxed text-[#475569] dark:text-slate-400">
  790 |                   {bentoView.agentLock.note}
  791 |                 </p>
  792 |               </div>
  793 |             </Surface>
  794 |             </BentoMotion>
  795 | 
  796 |             <BentoMotion index={5} className="md:col-span-2">
  797 |             <Surface
  798 |               className={[
  799 |                 'p-7 transition-colors duration-[400ms]',
  800 |                 mode === 'professional' ? '' : 'dark:bg-[#0E0D1A]',
  801 |               ].join(' ')}
  802 |             >
  803 |               <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Unique toggle</h4>
  804 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  805 |                 A tactile switch for diverse content modes -- recessed track, raised handle.
  806 |               </p>
  807 |               <div className="mt-5 inline-flex items-center gap-3">
  808 |                 <button
  809 |                   type="button"
  810 |                   onClick={() => setMode((current) => (current === 'professional' ? 'diverse' : 'professional'))}
  811 |                   className={[
  812 |                     'relative h-10 w-20 rounded-full p-1 flex items-center transition-colors duration-[400ms]',
  813 |                     mode === 'professional' ? 'justify-start bg-[#1E293B]/10' : 'justify-end bg-[#312E81]/12',
  814 |                     'shadow-[inset_0_2px_6px_rgba(15,23,42,0.18)]',
  815 |                     'dark:bg-white/[0.06] dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.7)]',
  816 |                   ].join(' ')}
  817 |                   aria-label="Toggle content mode"
  818 |                 >
  819 |                   <motion.div
  820 |                     layout
  821 |                     layoutId="home-mode-handle"
  822 |                     transition={{ type: 'spring', stiffness: 520, damping: 34 }}
  823 |                     className="h-8 w-8 rounded-full bg-white shadow-[0_10px_22px_rgba(15,23,42,0.20)] dark:bg-white/90 dark:shadow-[0_14px_40px_rgba(0,0,0,0.65)]"
  824 |                   />
  825 |                 </button>
  826 |                 <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
  827 |                   {mode === 'professional' ? 'Professional' : 'Diverse'}
  828 |                 </span>
  829 |               </div>
  830 |             </Surface>
  831 |             </BentoMotion>
  832 | 
  833 |             <BentoMotion index={6} className="md:col-span-2">
  834 |             <Surface className="p-7">
  835 |               <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Factory video gallery</h4>
  836 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  837 |                 Edge-to-edge thumbnails for an immersive profile experience.
  838 |               </p>
  839 |               <div className="mt-5 overflow-hidden rounded-2xl">
  840 |                 <div className="grid grid-cols-3">
  841 |                   {Array.from({ length: 6 }).map((_, i) => (
  842 |                     <div
  843 |                       key={i}
  844 |                       className={[
  845 |                         'aspect-video',
  846 |                         loading ? 'skeleton' : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-900 dark:to-slate-800',
  847 |                         !loading && i % 3 === 1 ? 'from-slate-100 to-slate-300 dark:from-slate-950 dark:to-slate-800' : '',
  848 |                       ].join(' ')}
  849 |                     />
  850 |                   ))}
  851 |                 </div>
  852 |               </div>
  853 |             </Surface>
  854 |             </BentoMotion>
  855 | 
  856 |             <BentoMotion index={7} className="md:col-span-4">
  857 |             <Surface className="p-7">
  858 |               <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">AI assistant</h4>
  859 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  860 |                 A floating assistant that feels premium -- glassy, calm, and helpful.
  861 |               </p>
  862 |               <div className="mt-5 rounded-2xl bg-white/55 backdrop-blur-md p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/50 dark:bg-white/[0.03] dark:ring-white/10">
  863 |                 <p className="text-sm font-semibold text-[#1E293B] dark:text-white">“Need help posting a request*”</p>
  864 |                 <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400">I can generate a structured template in seconds.</p>
  865 |               </div>
  866 |             </Surface>
  867 |             </BentoMotion>
  868 |           </div>
  869 |           </div>
  870 |         </div>
  871 | 
  872 |         <div className="mt-16">
  873 |           <Surface className="p-10">
  874 |             <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
  875 |               <div className="lg:col-span-7">
  876 |                 <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Built for growing buying houses</h3>
  877 |                 <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  878 |                   Unlimited sub-accounts · dedicated analytics · organization control · contract management
  879 |                 </p>
  880 |               </div>
  881 |               <div className="lg:col-span-5 lg:flex lg:justify-end">
  882 |                 <MagneticLinkButton
  883 |                   to="/pricing"
  884 |                   className="px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-emerald-500 hover:shadow-[0_22px_50px_rgba(16,185,129,0.28)] dark:bg-emerald-500/80 dark:hover:bg-emerald-500/90 dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
  885 |                 >
  886 |                   View enterprise plans
  887 |                 </MagneticLinkButton>
  888 |               </div>
  889 |             </div>
  890 |           </Surface>
  891 |         </div>
  892 | 
  893 |         <div className="mt-16">
  894 |           <div className="flex flex-col items-center text-center">
  895 |             <h3 className="text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Focused only on garments & textile</h3>
  896 |             <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">Industry categories:</p>
  897 |           </div>
  898 |           <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300">
  899 |             {['Shirts', 'Pants', 'Knitwear', 'Woven', 'Denim', 'Custom production'].map((tag) => (
  900 |               <span
  901 |                 key={tag}
  902 |                 className="rounded-full bg-white/70 px-4 py-2 shadow-[0_14px_38px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
  903 |               >
  904 |                 {tag}
  905 |               </span>
  906 |             ))}
  907 |           </div>
  908 |         </div>
  909 | 
  910 |         <div className="mt-16 pb-6">
  911 |           <Surface className="p-10">
  912 |             <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
  913 |               <div className="lg:col-span-7">
  914 |                 <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Start connecting with the right partners</h2>
  915 |                 <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
  916 |                   Clear CTAs and clean surfaces -- your first step into a structured marketplace.
  917 |                 </p>
  918 |               </div>
  919 |               <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
  920 |                 <MagneticLinkButton
  921 |                   to="/signup"
  922 |                   className="shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
  923 |                 >
  924 |                   Create account
  925 |                 </MagneticLinkButton>
  926 |                 <MagneticLinkButton
  927 |                   to="/login"
  928 |                   className="px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-white/70 text-[#1E293B] font-semibold tracking-tight backdrop-blur-sm transition duration-300 ease-out hover:bg-white hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]"
  929 |                 >
  930 |                   Login
  931 |                 </MagneticLinkButton>
  932 |               </div>
  933 |             </div>
  934 |           </Surface>
  935 |         </div>
  936 |       </div>
  937 |     </div>
  938 |   )
  939 | }
  940 | 