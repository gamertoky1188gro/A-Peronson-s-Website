    1 | /*
    2 |   Route: /about
    3 |   Access: Public
    4 | 
    5 |   Public Pages:
    6 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    7 |   Protected Pages (login required):
    8 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    9 |     /notifications, /chat, /call, /verification, /verification-center
   10 | 
   11 |   Primary responsibilities:
   12 |     - Explain what GarTexHub is and why it exists (mission/vision/how it works).
   13 |     - Display trust-focused stats + verified documents (dynamic).
   14 |     - Use bento-grid layout + glass surfaces + subtle weave background (texture reference to textiles).
   15 | 
   16 |   Key API endpoints:
   17 |     - GET /api/system/about  (via `apiRequest('/system/about')`)
   18 | 
   19 |   Major UI/UX patterns:
   20 |     - Bento grid + glassmorphism surfaces.
   21 |     - Staggered reveal animations (Framer Motion).
   22 |     - Skeleton -> fade-in "trust load" while documents/stats fetch.
   23 |     - Verified glow indicators (trust anchors).
   24 | */
   25 | import React, { useEffect, useMemo, useState } from 'react'
   26 | import { Check, FileText, ShieldCheck } from 'lucide-react'
   27 | import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
   28 | import { apiRequest } from '../lib/auth'
   29 | import MagneticButton from '../components/ui/MagneticButton'
   30 | import SpotlightCard from '../components/ui/SpotlightCard'
   31 | 
   32 | const Motion = motion
   33 | 
   34 | // Fallback content keeps layout stable and provides "real-ish" numbers if API fails.
   35 | const fallbackAbout = {
   36 |   ok: true,
   37 |   stats: {
   38 |     verifiedFactories: 64,
   39 |     countriesCovered: 28,
   40 |     docsVerified: 18,
   41 |     avgResponseSla: '2h 14m',
   42 |   },
   43 |   documents: [
   44 |     { name: 'Trade license', status: 'Verified', updatedAt: '2026-03-12' },
   45 |     { name: 'Factory audit report', status: 'Verified', updatedAt: '2026-03-09' },
   46 |     { name: 'Compliance certificate', status: 'Pending', updatedAt: '2026-03-08' },
   47 |     { name: 'Bank reference letter', status: 'Verified', updatedAt: '2026-03-05' },
   48 |     { name: 'Tax registration', status: 'Expired', updatedAt: '2026-03-01' },
   49 |     { name: 'Ownership declaration', status: 'Verified', updatedAt: '2026-02-27' },
   50 |   ],
   51 | }
   52 | 
   53 | function Skeleton({ className='' }) {
   54 |   return <div className={['skeleton', className].join(' ')} />
   55 | }
   56 | 
   57 | function MotionItem({ index, className='', children }) {
   58 |   const reduceMotion = useReducedMotion()
   59 |   if (reduceMotion) return <div className={className}>{children}</div>
   60 |   return (
   61 |     <motion.div
   62 |       className={className}
   63 |       initial={{ opacity: 0, y: 20 }}
   64 |       animate={{ opacity: 1, y: 0 }}
   65 |       transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
   66 |     >
   67 |       {children}
   68 |     </motion.div>
   69 |   )
   70 | }
   71 | 
   72 | function VerifiedBadge({ label = 'Verified' }) {
   73 |   return (
   74 |     <span
   75 |       className={[
   76 |         'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
   77 |         'bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.12)]',
   78 |         'dark:bg-emerald-500/12 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_28px_rgba(16,185,129,0.14)]',
   79 |       ].join(' ')}
   80 |       title={label}
   81 |     >
   82 |       <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_14px_rgba(5,150,105,0.55)] dark:bg-emerald-400 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
   83 |       {label}
   84 |     </span>
   85 |   )
   86 | }
   87 | 
   88 | function StatusChip({ status }) {
   89 |   if (status === 'Verified') return <VerifiedBadge label="Verified" />
   90 |   if (status === 'Pending') {
   91 |     return (
   92 |       <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700 shadow-[0_0_0_1px_rgba(56,189,248,0.18)] dark:bg-sky-400/10 dark:text-sky-200">
   93 |         Pending
   94 |       </span>
   95 |     )
   96 |   }
   97 |   return (
   98 |     <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-700 shadow-[0_0_0_1px_rgba(244,63,94,0.18)] dark:bg-rose-400/10 dark:text-rose-200">
   99 |       Expired
  100 |     </span>
  101 |   )
  102 | }
  103 | 
  104 | export default function About() {
  105 |   const [about, setAbout] = useState(fallbackAbout)
  106 |   const [loading, setLoading] = useState(true)
  107 |   const [loadError, setLoadError] = useState('')
  108 | 
  109 |   useEffect(() => {
  110 |     let alive = true
  111 |     const controller = new AbortController()
  112 | 
  113 |     apiRequest('/system/about', { signal: controller.signal })
  114 |       .then((data) => {
  115 |         if (!alive) return
  116 |         if (data?.ok && data?.stats && Array.isArray(data?.documents)) setAbout(data)
  117 |       })
  118 |       .catch((err) => {
  119 |         if (!alive) return
  120 |         if (err?.name === 'AbortError') return
  121 |         setLoadError(String(err?.message || 'Failed to load'))
  122 |       })
  123 |       .finally(() => {
  124 |         if (!alive) return
  125 |         setLoading(false)
  126 |       })
  127 | 
  128 |     return () => {
  129 |       alive = false
  130 |       controller.abort()
  131 |     }
  132 |   }, [])
  133 | 
  134 |   const howItWorks = useMemo(
  135 |     () => [
  136 |       'Buyers can post structured requests with detailed specifications.',
  137 |       'Factories and Buying Houses can showcase products and capabilities.',
  138 |       'Verified accounts increase trust through document-based validation.',
  139 |       'Built-in communication tools enable secure discussions.',
  140 |       'Digital contracts and document storage ensure record integrity.',
  141 |     ],
  142 |     [],
  143 |   )
  144 | 
  145 |   function handleNeedleMove(event) {
  146 |     const rect = event.currentTarget.getBoundingClientRect()
  147 |     event.currentTarget.style.setProperty('--needle-x', `${event.clientX - rect.left}px`)
  148 |     event.currentTarget.style.setProperty('--needle-y', `${event.clientY - rect.top}px`)
  149 |   }
  150 | 
  151 |   return (
  152 |     <div className="weave-bg relative min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#1E293B] dark:bg-[#0F172A] dark:text-[#F1F5F9]">
  153 |       <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
  154 |         <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
  155 |           <MotionItem index={0} className="lg:col-span-8">
  156 |             <SpotlightCard
  157 |               className={[
  158 |                 'rounded-xl p-8',
  159 |                 'bg-white/60 backdrop-blur-[10px]',
  160 |                 'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  161 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  162 |                 'transition duration-300 ease-out',
  163 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  164 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  165 |               ].join(' ')}
  166 |             >
  167 |               <h1 className="text-4xl font-extrabold tracking-tight text-[#1E293B] dark:text-[#F1F5F9] sm:text-5xl">
  168 |                 About GarTexHub - Show notifications
  169 |               </h1>
  170 |               <p className="mt-3 text-lg italic text-[#475569] dark:text-slate-300">
  171 |                 A professional B2B platform built exclusively for the Garments and Textile industry.
  172 |               </p>
  173 |               <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-300">
  174 |                 GarTexHub is a professional B2B platform built exclusively for the Garments and Textile industry. Our goal is
  175 |                 to create a structured, transparent, and trust-driven environment where international buyers, factories, and
  176 |                 buying houses can connect with confidence.
  177 |               </p>
  178 | 
  179 |               <div className="mt-7 flex flex-wrap gap-3">
  180 |                 <MagneticButton
  181 |                   to="/verification"
  182 |                   className="liquid-btn inline-flex items-center justify-center rounded-md bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.20)] transition hover:brightness-105 dark:bg-sky-500/15 dark:text-sky-100 dark:shadow-none"
  183 |                 >
  184 |                   View verification standards
  185 |                 </MagneticButton>
  186 |                 <MagneticButton
  187 |                   to="/help"
  188 |                   className="liquid-btn inline-flex items-center justify-center rounded-md bg-white/70 px-5 py-3 text-sm font-semibold text-[#1E293B] shadow-[0_10px_26px_rgba(15,23,42,0.10)] transition hover:bg-white dark:bg-white/10 dark:text-white dark:shadow-none"
  189 |                 >
  190 |                   Contact sales
  191 |                 </MagneticButton>
  192 |               </div>
  193 |             </SpotlightCard>
  194 |           </MotionItem>
  195 | 
  196 |           <MotionItem index={1} className="lg:col-span-4">
  197 |             <SpotlightCard
  198 |               className={[
  199 |                 'rounded-xl p-7',
  200 |                 'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  201 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  202 |                 'transition duration-300 ease-out',
  203 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  204 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  205 |               ].join(' ')}
  206 |             >
  207 |               <div className="flex items-center justify-between">
  208 |                 <p className="text-sm font-semibold text-[#1E293B] dark:text-[#F1F5F9]">Trust indicators</p>
  209 |                 <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
  210 |               </div>
  211 | 
  212 |               {loadError ? (
  213 |                 <p className="mt-3 text-xs text-[#64748B] dark:text-slate-300">Live data unavailable -- showing defaults.</p>
  214 |               ) : null}
  215 | 
  216 |               <div className="mt-5 grid gap-3">
  217 |                 {loading ? (
  218 |                   <>
  219 |                     <Skeleton className="h-14 rounded-lg" />
  220 |                     <Skeleton className="h-14 rounded-lg" />
  221 |                     <Skeleton className="h-14 rounded-lg" />
  222 |                     <Skeleton className="h-14 rounded-lg" />
  223 |                   </>
  224 |                 ) : (
  225 |                   <AnimatePresence mode="wait" initial={false}>
  226 |                     <motion.div
  227 |                       key="stats"
  228 |                       initial={{ opacity: 0 }}
  229 |                       animate={{ opacity: 1 }}
  230 |                       exit={{ opacity: 0 }}
  231 |                       transition={{ duration: 0.3 }}
  232 |                       className="grid gap-3"
  233 |                     >
  234 |                       {[
  235 |                         { label: 'Verified factories', value: String(about.stats.verifiedFactories) },
  236 |                         { label: 'Countries covered', value: String(about.stats.countriesCovered) },
  237 |                         { label: 'Docs verified', value: String(about.stats.docsVerified) },
  238 |                         { label: 'Avg. response SLA', value: about.stats.avgResponseSla },
  239 |                       ].map((item) => (
  240 |                         <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-900/4 px-4 py-3 dark:bg-white/5">
  241 |                           <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] dark:text-slate-300">{item.label}</p>
  242 |                           <p className="text-lg font-extrabold tracking-tight text-[#1E293B] dark:text-white">{item.value}</p>
  243 |                         </div>
  244 |                       ))}
  245 |                     </motion.div>
  246 |                   </AnimatePresence>
  247 |                 )}
  248 |               </div>
  249 |             </SpotlightCard>
  250 |           </MotionItem>
  251 | 
  252 |           <MotionItem index={2} className="lg:col-span-12">
  253 |             <SpotlightCard
  254 |               className={[
  255 |                 'rounded-xl p-7',
  256 |                 'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  257 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  258 |                 'transition duration-300 ease-out',
  259 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  260 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  261 |               ].join(' ')}
  262 |             >
  263 |               <h2 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-white">Why GarTexHub Exists</h2>
  264 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  265 |                 Cross-border textile trade often depends on informal communication, scattered documents, and manual
  266 |                 verification processes. This creates inefficiencies, misunderstandings, and trust barriers.
  267 |               </p>
  268 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  269 |                 GarTexHub was created to solve this problem by combining structured communication, verified business
  270 |                 identities, and secure documentation within one unified system.
  271 |               </p>
  272 |             </SpotlightCard>
  273 |           </MotionItem>
  274 | 
  275 |           <MotionItem index={3} className="lg:col-span-4">
  276 |             <SpotlightCard
  277 |               className={[
  278 |                 'rounded-xl p-7',
  279 |                 'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  280 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  281 |                 'transition duration-300 ease-out',
  282 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  283 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  284 |               ].join(' ')}
  285 |             >
  286 |               <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Mission</h2>
  287 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  288 |                 To simplify international garment sourcing by building a secure digital infrastructure that prioritizes
  289 |                 credibility, transparency, and efficiency.
  290 |               </p>
  291 |             </SpotlightCard>
  292 |           </MotionItem>
  293 | 
  294 |           <MotionItem index={4} className="lg:col-span-4">
  295 |             <SpotlightCard
  296 |               className={[
  297 |                 'rounded-xl p-7',
  298 |                 'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  299 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  300 |                 'transition duration-300 ease-out',
  301 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  302 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  303 |               ].join(' ')}
  304 |             >
  305 |               <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Vision</h2>
  306 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  307 |                 To become a trusted digital bridge between global buyers and garment manufacturers, reducing negotiation
  308 |                 friction and strengthening international trade relationships.
  309 |               </p>
  310 |             </SpotlightCard>
  311 |           </MotionItem>
  312 | 
  313 |           <MotionItem index={5} className="lg:col-span-4 lg:row-span-2">
  314 |             <SpotlightCard
  315 |               className={[
  316 |                 'rounded-xl p-7',
  317 |                 'bg-white/60 backdrop-blur-[10px]',
  318 |                 'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  319 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  320 |                 'transition duration-300 ease-out',
  321 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  322 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  323 |               ].join(' ')}
  324 |             >
  325 |               <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">How the Platform Works</h2>
  326 | 
  327 |               <ul className="mt-6 space-y-4">
  328 |                 {howItWorks.map((step, idx) => (
  329 |                   <motion.li
  330 |                     key={`${step}-${idx}`}
  331 |                     initial={{ opacity: 0, y: 10 }}
  332 |                     animate={{ opacity: 1, y: 0 }}
  333 |                     transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.15 + idx * 0.08 }}
  334 |                     className="flex gap-3"
  335 |                   >
  336 |                     <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.18)] dark:bg-emerald-500/12 dark:text-emerald-200">
  337 |                       <Check className="h-4 w-4" />
  338 |                     </span>
  339 |                     <div>
  340 |                       <p className="text-sm leading-relaxed text-[#475569] dark:text-slate-300">{step}</p>
  341 |                     </div>
  342 |                   </motion.li>
  343 |                 ))}
  344 |               </ul>
  345 |             </SpotlightCard>
  346 |           </MotionItem>
  347 | 
  348 |           <MotionItem index={6} className="lg:col-span-8">
  349 |             <SpotlightCard
  350 |               className={[
  351 |                 'rounded-xl p-7',
  352 |                 'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  353 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  354 |                 'transition duration-300 ease-out',
  355 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  356 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  357 |               ].join(' ')}
  358 |             >
  359 |               <div className="flex flex-wrap items-center justify-between gap-4">
  360 |                 <div>
  361 |                   <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verification & Trust</h2>
  362 |                 </div>
  363 |                 <VerifiedBadge label="Verification green" />
  364 |               </div>
  365 | 
  366 |               <p className="mt-4 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  367 |                 GarTexHub uses a document-based verification system. Companies must submit legal and operational documents,
  368 |                 which are manually reviewed before verification status is granted.
  369 |               </p>
  370 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  371 |                 Verification is subscription-based and must be maintained to ensure ongoing compliance.
  372 |               </p>
  373 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  374 |                 The more verified documentation a company provides, the stronger its credibility and international acceptance.
  375 |               </p>
  376 |             </SpotlightCard>
  377 |           </MotionItem>
  378 | 
  379 |           <MotionItem index={7} className="lg:col-span-7">
  380 |             <SpotlightCard
  381 |               className={[
  382 |                 'needle-area rounded-xl p-7',
  383 |                 'bg-white/60 backdrop-blur-[10px]',
  384 |                 'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  385 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  386 |                 'transition duration-300 ease-out',
  387 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  388 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  389 |               ].join(' ')}
  390 |               onMouseMove={handleNeedleMove}
  391 |             >
  392 |               <span className="needle-cursor" />
  393 |               <div className="flex items-center justify-between gap-3">
  394 |                 <div className="min-w-0">
  395 |                   <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verified documents</h2>
  396 |                   <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  397 |                     Skeleton loads into audit-ready details -- verified signals stay prominent.
  398 |                   </p>
  399 |                 </div>
  400 |                 <FileText className="h-5 w-5 text-[#0F172A]/70 dark:text-slate-200" />
  401 |               </div>
  402 | 
  403 |               <div className="mt-6 grid gap-3">
  404 |                 {loading ? (
  405 |                   <>
  406 |                     <Skeleton className="h-12 rounded-xl" />
  407 |                     <Skeleton className="h-12 rounded-xl" />
  408 |                     <Skeleton className="h-12 rounded-xl" />
  409 |                     <Skeleton className="h-12 rounded-xl" />
  410 |                   </>
  411 |                 ) : (
  412 |                   <AnimatePresence mode="wait" initial={false}>
  413 |                     <motion.div
  414 |                       key="docs"
  415 |                       initial={{ opacity: 0 }}
  416 |                       animate={{ opacity: 1 }}
  417 |                       exit={{ opacity: 0 }}
  418 |                       transition={{ duration: 0.3 }}
  419 |                       className="grid gap-3"
  420 |                     >
  421 |                       {(about.documents || []).map((doc) => (
  422 |                         <div
  423 |                           key={doc.name}
  424 |                           className={[
  425 |                             'group flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3',
  426 |                             'bg-[#FFFFFF] shadow-[0_10px_26px_rgba(15,23,42,0.08)]',
  427 |                             'transition duration-300 ease-out',
  428 |                             'hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(15,23,42,0.12)]',
  429 |                             'dark:bg-white/5 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/7',
  430 |                           ].join(' ')}
  431 |                         >
  432 |                           <div className="min-w-0">
  433 |                             <p className="truncate text-sm font-semibold text-[#1E293B] dark:text-white">{doc.name}</p>
  434 |                             <p className="mt-1 text-xs text-[#64748B] dark:text-slate-300">Updated {doc.updatedAt}</p>
  435 |                           </div>
  436 |                           <div className="flex items-center gap-2">
  437 |                             <StatusChip status={doc.status} />
  438 |                           </div>
  439 |                         </div>
  440 |                       ))}
  441 |                     </motion.div>
  442 |                   </AnimatePresence>
  443 |                 )}
  444 |               </div>
  445 |             </SpotlightCard>
  446 |           </MotionItem>
  447 | 
  448 |           <MotionItem index={8} className="lg:col-span-5">
  449 |             <SpotlightCard
  450 |               className={[
  451 |                 'rounded-xl p-7',
  452 |                 'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  453 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  454 |                 'transition duration-300 ease-out',
  455 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  456 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  457 |               ].join(' ')}
  458 |             >
  459 |               <div className="flex items-center justify-between gap-3">
  460 |                 <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Digital Bridge</h2>
  461 |                 <span className="rounded-full bg-[#0F172A]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569] dark:bg-white/8 dark:text-slate-300">
  462 |                   Coming soon
  463 |                 </span>
  464 |               </div>
  465 |               <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  466 |                 A global map view that visualizes verified connections between buyers and manufacturers.
  467 |               </p>
  468 |               <div className="mt-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500/10 via-emerald-500/6 to-indigo-500/10 p-5 dark:from-sky-500/12 dark:via-emerald-500/8 dark:to-indigo-500/12">
  469 |                 <div className="h-32 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
  470 |                 <div className="mt-4 grid grid-cols-3 gap-2">
  471 |                   <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
  472 |                   <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
  473 |                   <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
  474 |                 </div>
  475 |               </div>
  476 |             </SpotlightCard>
  477 |           </MotionItem>
  478 | 
  479 |           <MotionItem index={9} className="lg:col-span-6">
  480 |             <SpotlightCard
  481 |               className={[
  482 |                 'rounded-xl p-7',
  483 |                 'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  484 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  485 |                 'transition duration-300 ease-out',
  486 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  487 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  488 |               ].join(' ')}
  489 |             >
  490 |               <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Industry Focus</h2>
  491 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  492 |                 GarTexHub is strictly dedicated to the Garments and Textile sector. By focusing on a single industry, we
  493 |                 provide smarter categorization, clearer communication, and more relevant matching between buyers and
  494 |                 manufacturers.
  495 |               </p>
  496 |             </SpotlightCard>
  497 |           </MotionItem>
  498 | 
  499 |           <MotionItem index={10} className="lg:col-span-6">
  500 |             <SpotlightCard
  501 |               className={[
  502 |                 'rounded-xl p-7',
  503 |                 'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  504 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  505 |                 'transition duration-300 ease-out',
  506 |                 'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  507 |                 'dark:hover:translate-y-0 dark:hover:shadow-none',
  508 |               ].join(' ')}
  509 |             >
  510 |               <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Professional Commitment</h2>
  511 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  512 |                 We do not process direct financial transactions. Our platform is designed to facilitate secure communication,
  513 |                 structured agreements, and verified business interactions.
  514 |               </p>
  515 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  516 |                 GarTexHub operates with the principle that trust is earned through transparency, documentation, and
  517 |                 professional conduct.
  518 |               </p>
  519 |             </SpotlightCard>
  520 |           </MotionItem>
  521 | 
  522 |           <MotionItem index={11} className="lg:col-span-12">
  523 |             <SpotlightCard
  524 |               className={[
  525 |                 'rounded-xl p-8',
  526 |                 'bg-white/60 backdrop-blur-[10px]',
  527 |                 'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
  528 |                 'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
  529 |               ].join(' ')}
  530 |             >
  531 |               <h2 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-white">Contact & Legal Information</h2>
  532 |               <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
  533 |                 For partnership inquiries, support, or compliance-related questions, please contact us through our official
  534 |                 communication channels listed on the platform.
  535 |               </p>
  536 |             </SpotlightCard>
  537 |           </MotionItem>
  538 |         </div>
  539 |       </div>
  540 |     </div>
  541 |   )
  542 | }
  543 | 
  544 | 