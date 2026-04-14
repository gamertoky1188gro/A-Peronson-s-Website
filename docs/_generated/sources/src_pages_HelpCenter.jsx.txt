    1 | /*
    2 |   Route: /help
    3 |   Access: Public
    4 | 
    5 |   Public Pages:
    6 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    7 |   Protected Pages (login required):
    8 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    9 |     /notifications, /chat, /call, /verification, /verification-center
   10 | 
   11 |   Primary responsibilities:
   12 |     - Help Center documentation + admin FAQ management UI (if user has permissions).
   13 |     - Keep the existing 2-column layout: main content + sticky sidebar.
   14 |     - Provide a bento-grid navigation hub for quick jumping to sections.
   15 | 
   16 |   Key API endpoints:
   17 |     - GET /api/assistant/knowledge (FAQ list)
   18 |     - POST/DELETE endpoints for FAQ management (depending on existing server implementation)
   19 | 
   20 |   Major UI/UX patterns:
   21 |     - "Modern Industrialist" palette:
   22 |       light = slate-50 studio; dark = deep slate (#0B0F1A).
   23 |     - Glassmorphism cards, spotlight hover, staggered entry motion.
   24 |     - Role glows in dark mode (Buyer/Factory/Buying House).
   25 |     - Verified shimmer badge styling (trust indicator).
   26 | 
   27 |   Special:
   28 |     - FloatingAssistant switches to "Orb" styling only on this route.
   29 | */
   30 | import React, { useCallback, useMemo, useState, useEffect } from 'react'
   31 | import { Check, ChevronDown, FileText, Lock, ShieldCheck, Sparkles } from 'lucide-react'
   32 | import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
   33 | import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
   34 | import SpotlightCard from '../components/ui/SpotlightCard'
   35 | 
   36 | const Motion = motion
   37 | 
   38 | const HELP_SECTIONS = [
   39 |   {
   40 |     id: 'quick-start',
   41 |     title: '1. Quick Start Guide',
   42 |     content: [
   43 |       'Step 1: Create an Account (Buyer, Factory, or Buying House).',
   44 |       'Step 2: Complete your basic profile setup (Organization Name, Category, Profile Image).',
   45 |       'Step 3: Explore the Main Feed or Search for relevant posts.',
   46 |       'Step 4: Start conversations or post Buyer Requests / Products.',
   47 |       'Step 5: Upgrade to Premium if advanced visibility and analytics are required.',
   48 |     ],
   49 |   },
   50 |   {
   51 |     id: 'account-types',
   52 |     title: '2. Account Types',
   53 |     subsections: [
   54 |       {
   55 |         name: 'Buyer Account',
   56 |         points: [
   57 |           'Post detailed Buyer Requests.',
   58 |           'Search and filter factories.',
   59 |           'Send direct messages.',
   60 |           'Schedule calls.',
   61 |         ],
   62 |       },
   63 |       {
   64 |         name: 'Factory Account',
   65 |         points: [
   66 |           'Upload product posts and videos.',
   67 |           'Respond to Buyer Requests.',
   68 |           'Accept connection requests from Buying Houses.',
   69 |           'Manage sub-accounts (Agents).',
   70 |         ],
   71 |       },
   72 |       {
   73 |         name: 'Buying House Account',
   74 |         points: [
   75 |           'Manage multiple agents.',
   76 |           'Connect with multiple factories.',
   77 |           'Assign Buyer Requests to specific agents.',
   78 |           'Monitor deals and analytics (Premium).',
   79 |         ],
   80 |       },
   81 |     ],
   82 |   },
   83 |   {
   84 |     id: 'verification',
   85 |     title: '3. Verification Process',
   86 |     description: 'Verification is document-based and requires backend approval.',
   87 |     roles: [
   88 |       {
   89 |         role: 'Factories must submit',
   90 |         docs: [
   91 |           'Company Registration',
   92 |           'Trade License',
   93 |           'TIN',
   94 |           'Authorized Person NID',
   95 |           'Company Bank Proof',
   96 |           'ERC (Export Registration Certificate)',
   97 |         ],
   98 |       },
   99 |       {
  100 |         role: 'Buying Houses must submit',
  101 |         docs: [
  102 |           'Company Registration',
  103 |           'Trade License',
  104 |           'TIN',
  105 |           'Authorized Person NID',
  106 |           'Company Bank Proof',
  107 |         ],
  108 |       },
  109 |       {
  110 |         role: 'International Buyers (EU / USA) must submit',
  111 |         docs: [
  112 |           'Business Registration',
  113 |           'VAT (EU) or EIN (USA)',
  114 |           'EORI (EU) or IOR (USA)',
  115 |           'Bank Proof',
  116 |         ],
  117 |       },
  118 |     ],
  119 |     footer:
  120 |       'Verification status is subscription-based and must be renewed monthly. The more verified documentation a company provides, the stronger its credibility.',
  121 |   },
  122 |   {
  123 |     id: 'messaging',
  124 |     title: '4. Messaging & Conversation Rules',
  125 |     sections: [
  126 |       { title: 'Verified Users', text: 'Messages go directly to inbox.' },
  127 |       { title: 'Unverified Users', text: 'Messages appear in "Message Requests."' },
  128 |       {
  129 |         title: 'Buying House Conversation Lock',
  130 |         points: [
  131 |           'When an Agent starts a conversation, it is assigned to that Agent.',
  132 |           'Other Agents cannot message unless permission is granted.',
  133 |           'This prevents internal conflict.',
  134 |         ],
  135 |       },
  136 |     ],
  137 |   },
  138 |   {
  139 |     id: 'subscriptions',
  140 |     title: '5. Subscription Plans',
  141 |     description: 'Two Plans Available: Free and Premium.',
  142 |     points: [
  143 |       'Increased profile visibility',
  144 |       'Advanced analytics (for eligible accounts)',
  145 |       'Extended management capabilities',
  146 |     ],
  147 |     footer: 'Feature visibility varies depending on account type.',
  148 |   },
  149 |   {
  150 |     id: 'calls',
  151 |     title: '6. Video & Audio Calls',
  152 |     points: [
  153 |       'Calls can be initiated directly from chat.',
  154 |       'Optional scheduling feature available.',
  155 |       'All calls may be recorded for security and compliance.',
  156 |       'Users are notified before recording begins.',
  157 |     ],
  158 |   },
  159 |   {
  160 |     id: 'contracts',
  161 |     title: '7. Contracts & Legal Vault',
  162 |     points: [
  163 |       'Digital contracts can be signed through the platform.',
  164 |       'PDF copies are stored securely in the Legal Vault.',
  165 |       'Both parties can access their contract history.',
  166 |     ],
  167 |     footer: 'GarTexHub does not process direct financial transactions.',
  168 |   },
  169 |   {
  170 |     id: 'security',
  171 |     title: '8. Security & Data Protection',
  172 |     points: [
  173 |       'Uploaded documents are securely stored.',
  174 |       'Verification requires backend approval.',
  175 |       'Expired licenses may remove verified status.',
  176 |       'Financial details are protected through encrypted systems.',
  177 |     ],
  178 |   },
  179 |   {
  180 |     id: 'assistant',
  181 |     title: '9. Floating AI Assistant',
  182 |     description: 'The Floating Assistant helps users with:',
  183 |     points: ['Understand settings', 'Navigate dashboards', 'Access help articles', 'Connect to support'],
  184 |     footer: 'It does not handle negotiations.',
  185 |   },
  186 | ]
  187 | 
  188 | function MotionItem({ index, className='', children }) {
  189 |   const reduceMotion = useReducedMotion()
  190 |   if (reduceMotion) return <div className={className}>{children}</div>
  191 |   return (
  192 |     <motion.div
  193 |       className={className}
  194 |       initial={{ opacity: 0, y: 20 }}
  195 |       animate={{ opacity: 1, y: 0 }}
  196 |       transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
  197 |     >
  198 |       {children}
  199 |     </motion.div>
  200 |   )
  201 | }
  202 | 
  203 | function Skeleton({ className='' }) {
  204 |   return <div className={['skeleton', className].join(' ')} />
  205 | }
  206 | 
  207 | function VerifiedBadge() {
  208 |   return (
  209 |     <span
  210 |       className={[
  211 |         'verified-shimmer inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
  212 |         'bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.10)]',
  213 |         'dark:bg-emerald-500/12 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_24px_rgba(16,185,129,0.12)]',
  214 |       ].join(' ')}
  215 |     >
  216 |       <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_14px_rgba(5,150,105,0.55)] dark:bg-emerald-400 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
  217 |       Verified
  218 |     </span>
  219 |   )
  220 | }
  221 | 
  222 | function cardClassName({ glass = false } = {}) {
  223 |   return [
  224 |     'spotlight-card rounded-xl p-6',
  225 |     glass ? 'bg-white/70 backdrop-blur-md' : 'bg-[#ffffff]',
  226 |     'borderless-shadow',
  227 |     'transition duration-300 ease-out will-change-transform',
  228 |     'hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]',
  229 |     'dark:bg-slate-900/40 dark:backdrop-blur-sm',
  230 |     'dark:ring-1 dark:ring-slate-800/60 dark:shadow-none',
  231 |     'dark:hover:translate-y-0 dark:hover:shadow-none dark:hover:ring-blue-500/35',
  232 |   ].join(' ')
  233 | }
  234 | 
  235 | function glowForAccount(name) {
  236 |   if (name.toLowerCase().includes('buyer')) {
  237 |     return 'dark:shadow-[0_0_0_1px_rgba(59,130,246,0.22),0_18px_60px_rgba(59,130,246,0.18)]'
  238 |   }
  239 |   if (name.toLowerCase().includes('factory')) {
  240 |     return 'dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_18px_60px_rgba(16,185,129,0.16)]'
  241 |   }
  242 |   return 'dark:shadow-[0_0_0_1px_rgba(99,102,241,0.22),0_18px_60px_rgba(99,102,241,0.18)]'
  243 | }
  244 | 
  245 | export default function HelpCenter() {
  246 |   const [q, setQ] = useState('')
  247 |   const [entries, setEntries] = useState([])
  248 |   const [feedback, setFeedback] = useState('')
  249 |   const [form, setForm] = useState({ question: '', answer: '', keywords: '' })
  250 |   const [editingId, setEditingId] = useState('')
  251 |   const [faqLoading, setFaqLoading] = useState(false)
  252 |   const [lockGranted, setLockGranted] = useState(false)
  253 | 
  254 |   const currentUser = useMemo(() => getCurrentUser(), [])
  255 |   const isOwnerAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin'
  256 |   const reduceMotion = useReducedMotion()
  257 | 
  258 |   const staticFaqs = [
  259 |     {
  260 |       q: 'Can I buy verification without documents*',
  261 |       a: 'No. Verification requires mandatory document submission and approval.',
  262 |     },
  263 |     {
  264 |       q: 'Can I create multiple sub-accounts*',
  265 |       a: 'Yes. Buying Houses and Factories can create limited sub-accounts under Free plans.',
  266 |     },
  267 |     { q: 'Does GarTexHub handle payments*', a: 'No. The platform facilitates communication and contracts only.' },
  268 |     { q: 'Can I increase my visibility*', a: 'Premium plans may provide improved reach.' },
  269 |   ]
  270 | 
  271 |   const loadFaqs = useCallback(async () => {
  272 |     try {
  273 |       const token = getToken()
  274 |       if (!token) return
  275 |       setFaqLoading(true)
  276 |       const data = await apiRequest('/assistant/knowledge', { token })
  277 |       setEntries((data.entries || []).filter((entry) => (entry.type || 'faq') === 'faq'))
  278 |     } catch (err) {
  279 |       setFeedback(err.status === 403 ? 'Access denied' : err.message)
  280 |     } finally {
  281 |       setFaqLoading(false)
  282 |     }
  283 |   }, [])
  284 | 
  285 |   useEffect(() => {
  286 |     if (!isOwnerAdmin) return
  287 |     const timeoutId = setTimeout(() => {
  288 |       loadFaqs()
  289 |     }, 0)
  290 |     return () => {
  291 |       clearTimeout(timeoutId)
  292 |     }
  293 |   }, [isOwnerAdmin, loadFaqs])
  294 | 
  295 |   function selectForEdit(entry) {
  296 |     setEditingId(entry.id)
  297 |     setForm({
  298 |       question: entry.question || '',
  299 |       answer: entry.answer || '',
  300 |       keywords: Array.isArray(entry.keywords) ? entry.keywords.join(', ') : '',
  301 |     })
  302 |   }
  303 | 
  304 |   function resetForm() {
  305 |     setEditingId('')
  306 |     setForm({ question: '', answer: '', keywords: '' })
  307 |   }
  308 | 
  309 |   async function saveFaq(e) {
  310 |     e.preventDefault()
  311 |     const token = getToken()
  312 |     if (!token) return
  313 |     const payload = {
  314 |       type: 'faq',
  315 |       question: form.question,
  316 |       answer: form.answer,
  317 |       keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
  318 |     }
  319 |     try {
  320 |       if (editingId) {
  321 |         await apiRequest(`/assistant/knowledge/${editingId}`, { method: 'PUT', token, body: payload })
  322 |       } else {
  323 |         await apiRequest('/assistant/knowledge', { method: 'POST', token, body: payload })
  324 |       }
  325 |       resetForm()
  326 |       loadFaqs()
  327 |       setFeedback('FAQ updated')
  328 |     } catch (err) {
  329 |       setFeedback(err.message)
  330 |     }
  331 |   }
  332 | 
  333 |   async function removeFaq(entryId) {
  334 |     const token = getToken()
  335 |     if (!token) return
  336 |     try {
  337 |       await apiRequest(`/assistant/knowledge/${entryId}`, { method: 'DELETE', token })
  338 |       loadFaqs()
  339 |     } catch (err) {
  340 |       setFeedback(err.message)
  341 |     }
  342 |   }
  343 | 
  344 |   const allFaqs = [...entries.map((e) => ({ q: e.question, a: e.answer, id: e.id })), ...staticFaqs]
  345 |   const filteredFaqs = allFaqs.filter(
  346 |     (f) => f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase()),
  347 |   )
  348 | 
  349 |   const hubTiles = [
  350 |     {
  351 |       id: 'quick-start',
  352 |       title: 'Quick Start Guide',
  353 |       desc: 'Fast setup for buyers, factories, and buying houses.',
  354 |       icon: Sparkles,
  355 |       span: 'lg:col-span-3',
  356 |     },
  357 |     {
  358 |       id: 'account-types',
  359 |       title: 'Account Types',
  360 |       desc: 'Clear roles, clear permissions.',
  361 |       icon: ShieldCheck,
  362 |       span: 'lg:col-span-3',
  363 |     },
  364 |     { id: 'faq', title: 'FAQ', desc: 'Searchable answers, no fluff.', icon: ChevronDown, span: 'lg:col-span-2' },
  365 |     { id: 'contracts', title: 'Legal Vault', desc: 'Contracts & audit-ready records.', icon: FileText, span: 'lg:col-span-2' },
  366 |     {
  367 |       id: 'verification',
  368 |       title: 'Verification',
  369 |       desc: 'Document-based trust indicators.',
  370 |       icon: ShieldCheck,
  371 |       span: 'lg:col-span-2',
  372 |     },
  373 |     { id: 'messaging', title: 'Messaging Lock', desc: 'Conflict-free team conversations.', icon: Lock, span: 'lg:col-span-2' },
  374 |   ]
  375 | 
  376 |   return (
  377 |     <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0B0F1A] dark:text-slate-100">
  378 |       <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
  379 |         <header className="text-center">
  380 |           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
  381 |           <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Industrial reliability, tech-forward SaaS guidance.</p>
  382 |         </header>
  383 | 
  384 |         <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
  385 |           <div className="lg:col-span-3 space-y-8">
  386 |             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
  387 |               {hubTiles.map((tile, idx) => {
  388 |                 const Icon = tile.icon
  389 |                 return (
  390 |                   <MotionItem key={tile.id} index={idx} className={tile.span}>
  391 |                     <a href={`#${tile.id}`} className={[cardClassName({ glass: true }), 'group block h-full'].join(' ')}>
  392 |                       <div className="flex items-start justify-between gap-3">
  393 |                         <div>
  394 |                           <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">{tile.title}</p>
  395 |                           <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{tile.desc}</p>
  396 |                         </div>
  397 |                         <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition group-hover:bg-blue-600/14 dark:bg-blue-500/12 dark:text-blue-400">
  398 |                           <Icon className="h-5 w-5" />
  399 |                         </span>
  400 |                       </div>
  401 |                     </a>
  402 |                   </MotionItem>
  403 |                 )
  404 |               })}
  405 |             </div>
  406 | 
  407 |             {HELP_SECTIONS.map((section, idx) => (
  408 |               <MotionItem key={section.id} index={hubTiles.length + idx}>
  409 |                 <section id={section.id} className="scroll-mt-6">
  410 |                   <SpotlightCard className={cardClassName()}>
  411 |                     <div className="flex flex-wrap items-center justify-between gap-3 borderless-divider-b pb-3">
  412 |                       <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{section.title}</h2>
  413 |                       {section.id === 'verification' ? <VerifiedBadge /> : null}
  414 |                     </div>
  415 | 
  416 |                     {section.description ? (
  417 |                       <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
  418 |                     ) : null}
  419 | 
  420 |                     {section.content ? (
  421 |                       <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
  422 |                         {section.content.map((item) => (
  423 |                           <li key={item} className="flex gap-2">
  424 |                             <span className="mt-0.5 text-blue-600 dark:text-blue-400">-</span>
  425 |                             <span>{item}</span>
  426 |                           </li>
  427 |                         ))}
  428 |                       </ul>
  429 |                     ) : null}
  430 | 
  431 |                     {section.subsections ? (
  432 |                       <div className="mt-5 grid gap-4 lg:grid-cols-3">
  433 |                         {section.subsections.map((sub, subIndex) => (
  434 |                           <motion.div
  435 |                             key={sub.name}
  436 |                             initial={reduceMotion ? false : { opacity: 0, y: 14 }}
  437 |                             animate={{ opacity: 1, y: 0 }}
  438 |                             transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 + subIndex * 0.05 }}
  439 |                             className={[
  440 |                               'rounded-xl bg-slate-900/2 p-5 transition duration-300 ease-out',
  441 |                               'hover:-translate-y-0.5 hover:bg-slate-900/3 active:scale-[0.98]',
  442 |                               'dark:bg-white/5 dark:hover:bg-white/6 dark:hover:translate-y-0',
  443 |                               glowForAccount(sub.name),
  444 |                             ].join(' ')}
  445 |                           >
  446 |                             <p className="font-semibold text-slate-900 dark:text-slate-100">{sub.name}</p>
  447 |                             <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
  448 |                               {sub.points.map((p) => (
  449 |                                 <li key={p} className="flex gap-2">
  450 |                                   <span className="mt-0.5 text-blue-600/90 dark:text-blue-400">-</span>
  451 |                                   <span>{p}</span>
  452 |                                 </li>
  453 |                               ))}
  454 |                             </ul>
  455 |                           </motion.div>
  456 |                         ))}
  457 |                       </div>
  458 |                     ) : null}
  459 | 
  460 |                     {section.roles ? (
  461 |                       <div className="mt-5 space-y-5">
  462 |                         {section.roles.map((roleBlock) => (
  463 |                           <div key={roleBlock.role}>
  464 |                             <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{roleBlock.role}</p>
  465 |                             <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-slate-500 md:grid-cols-2 dark:text-slate-400">
  466 |                               {roleBlock.docs.map((d) => (
  467 |                                 <li key={d} className="flex gap-2">
  468 |                                   <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">-</span>
  469 |                                   <span>{d}</span>
  470 |                                 </li>
  471 |                               ))}
  472 |                             </ul>
  473 |                           </div>
  474 |                         ))}
  475 |                       </div>
  476 |                     ) : null}
  477 | 
  478 |                     {section.sections ? (
  479 |                       <div className="mt-5 space-y-4">
  480 |                         {section.sections.map((s) => (
  481 |                           <div key={s.title} className="rounded-xl bg-slate-900/2 p-5 dark:bg-white/5">
  482 |                             <div className="flex items-center justify-between gap-3">
  483 |                               <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{s.title}</p>
  484 |                               {s.title.toLowerCase().includes('verified') ? <VerifiedBadge /> : null}
  485 |                             </div>
  486 |                             {s.text ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.text}</p> : null}
  487 |                             {s.points ? (
  488 |                               <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
  489 |                                 {s.points.map((p) => (
  490 |                                   <li key={p} className="flex gap-2">
  491 |                                     <span className="mt-0.5 text-blue-600 dark:text-blue-400">-</span>
  492 |                                     <span>{p}</span>
  493 |                                   </li>
  494 |                                 ))}
  495 |                               </ul>
  496 |                             ) : null}
  497 | 
  498 |                             {section.id === 'messaging' && s.title.toLowerCase().includes('lock') ? (
  499 |                               <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/70 px-4 py-3 backdrop-blur-md shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/5 dark:shadow-none">
  500 |                                 <div className="flex items-center gap-3">
  501 |                                   <AnimatePresence initial={false} mode="popLayout">
  502 |                                     {lockGranted ? (
  503 |                                       <motion.div
  504 |                                         key="unlocked"
  505 |                                         initial={reduceMotion ? false : { opacity: 0, x: 6 }}
  506 |                                         animate={{ opacity: 1, x: 0 }}
  507 |                                         exit={{ opacity: 0, x: -6 }}
  508 |                                         transition={{ duration: 0.25 }}
  509 |                                         className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-200"
  510 |                                       >
  511 |                                         <Check className="h-5 w-5" />
  512 |                                       </motion.div>
  513 |                                     ) : (
  514 |                                       <motion.div
  515 |                                         key="locked"
  516 |                                         initial={reduceMotion ? false : { opacity: 0, x: 6 }}
  517 |                                         animate={{ opacity: 1, x: 0 }}
  518 |                                         exit={{ opacity: 0, x: -6 }}
  519 |                                         transition={{ duration: 0.25 }}
  520 |                                         className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/6 text-slate-700 dark:bg-white/6 dark:text-slate-200"
  521 |                                       >
  522 |                                         <Lock className="h-5 w-5" />
  523 |                                       </motion.div>
  524 |                                     )}
  525 |                                   </AnimatePresence>
  526 |                                   <div>
  527 |                                     <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Lock demo</p>
  528 |                                     <p className="text-xs text-slate-500 dark:text-slate-400">
  529 |                                       {lockGranted ? 'Permission granted -- teammates can message.' : 'Locked -- teammates need permission.'}
  530 |                                     </p>
  531 |                                   </div>
  532 |                                 </div>
  533 |                                 <button
  534 |                                   type="button"
  535 |                                   onClick={() => setLockGranted((v) => !v)}
  536 |                                   className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400"
  537 |                                 >
  538 |                                   {lockGranted ? 'Reset' : 'Grant permission'}
  539 |                                 </button>
  540 |                               </div>
  541 |                             ) : null}
  542 |                           </div>
  543 |                         ))}
  544 |                       </div>
  545 |                     ) : null}
  546 | 
  547 |                     {section.points && !section.subsections && !section.sections ? (
  548 |                       <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
  549 |                         {section.points.map((p) => (
  550 |                           <li key={p} className="flex gap-2">
  551 |                             <span className="mt-0.5 text-blue-600 dark:text-blue-400">-</span>
  552 |                             <span>{p}</span>
  553 |                           </li>
  554 |                         ))}
  555 |                       </ul>
  556 |                     ) : null}
  557 | 
  558 |                     {section.footer ? (
  559 |                       <p className="mt-5 borderless-divider-t pt-3 text-xs italic text-slate-500 dark:text-slate-400">
  560 |                         {section.footer}
  561 |                       </p>
  562 |                     ) : null}
  563 |                   </SpotlightCard>
  564 |                 </section>
  565 |               </MotionItem>
  566 |             ))}
  567 | 
  568 |             <MotionItem index={hubTiles.length + HELP_SECTIONS.length}>
  569 |               <section id="faq" className="scroll-mt-6">
  570 |                 <SpotlightCard className={cardClassName()}>
  571 |                   <div className="flex flex-wrap items-center justify-between gap-3 borderless-divider-b pb-3">
  572 |                     <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
  573 |                       10. Frequently Asked Questions (FAQ)
  574 |                     </h2>
  575 |                     <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
  576 |                       Searchable
  577 |                     </span>
  578 |                   </div>
  579 | 
  580 |                   <div className="mt-4">
  581 |                     <input
  582 |                       placeholder="Search FAQs..."
  583 |                       value={q}
  584 |                       onChange={(e) => setQ(e.target.value)}
  585 |                       className="w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
  586 |                     />
  587 |                   </div>
  588 | 
  589 |                   <div className="mt-5 space-y-3">
  590 |                     {faqLoading ? (
  591 |                       <>
  592 |                         <Skeleton className="h-16 rounded-xl" />
  593 |                         <Skeleton className="h-16 rounded-xl" />
  594 |                         <Skeleton className="h-16 rounded-xl" />
  595 |                       </>
  596 |                     ) : (
  597 |                       <AnimatePresence mode="wait" initial={false}>
  598 |                         <motion.div
  599 |                           key="faq"
  600 |                           initial={reduceMotion ? false : { opacity: 0 }}
  601 |                           animate={{ opacity: 1 }}
  602 |                           exit={{ opacity: 0 }}
  603 |                           transition={{ duration: 0.3 }}
  604 |                           className="space-y-3"
  605 |                         >
  606 |                           {filteredFaqs.map((f) => (
  607 |                             <details
  608 |                               key={f.id || f.q}
  609 |                               className="group rounded-xl bg-slate-900/2 p-4 transition-colors hover:bg-slate-900/3 dark:bg-white/5 dark:hover:bg-white/6"
  610 |                             >
  611 |                               <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
  612 |                                 <span className="min-w-0 truncate">Q: {f.q}</span>
  613 |                                 <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400" />
  614 |                               </summary>
  615 |                               <p className="mt-3 pl-4 text-sm text-slate-500 dark:text-slate-400 borderless-shadow">
  616 |                                 A: {f.a}
  617 |                               </p>
  618 |                             </details>
  619 |                           ))}
  620 |                         </motion.div>
  621 |                       </AnimatePresence>
  622 |                     )}
  623 |                   </div>
  624 |                 </SpotlightCard>
  625 |               </section>
  626 |             </MotionItem>
  627 | 
  628 |             {isOwnerAdmin ? (
  629 |               <MotionItem index={hubTiles.length + HELP_SECTIONS.length + 1}>
  630 |                 <section className="scroll-mt-6">
  631 |                   <SpotlightCard className={cardClassName({ glass: true })}>
  632 |                     <div className="flex flex-wrap items-center justify-between gap-3 borderless-divider-b pb-3">
  633 |                       <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
  634 |                         Admin: Manage Knowledge Base FAQ
  635 |                       </h2>
  636 |                       <span className="rounded-full bg-blue-600/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700 dark:bg-blue-500/12 dark:text-blue-200">
  637 |                         Owner/Admin
  638 |                       </span>
  639 |                     </div>
  640 | 
  641 |                     <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
  642 |                       <form onSubmit={saveFaq} className="space-y-3">
  643 |                         <input
  644 |                           placeholder="Question"
  645 |                           value={form.question}
  646 |                           onChange={(e) => setForm({ ...form, question: e.target.value })}
  647 |                           className="w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
  648 |                           required
  649 |                         />
  650 |                         <textarea
  651 |                           placeholder="Answer"
  652 |                           value={form.answer}
  653 |                           onChange={(e) => setForm({ ...form, answer: e.target.value })}
  654 |                           className="min-h-28 w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
  655 |                           required
  656 |                         />
  657 |                         <input
  658 |                           placeholder="Keywords (comma separated)"
  659 |                           value={form.keywords}
  660 |                           onChange={(e) => setForm({ ...form, keywords: e.target.value })}
  661 |                           className="w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
  662 |                         />
  663 |                         <div className="flex flex-wrap gap-2">
  664 |                           <button
  665 |                             type="submit"
  666 |                             className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400"
  667 |                           >
  668 |                             {editingId ? 'Update' : 'Add'} FAQ
  669 |                           </button>
  670 |                           {editingId ? (
  671 |                             <button
  672 |                               type="button"
  673 |                               onClick={resetForm}
  674 |                               className="rounded-full bg-slate-900/4 px-5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-900/6 active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/8"
  675 |                             >
  676 |                               Cancel
  677 |                             </button>
  678 |                           ) : null}
  679 |                         </div>
  680 |                         {feedback ? <p className="text-xs text-slate-500 dark:text-slate-400">{feedback}</p> : null}
  681 |                       </form>
  682 | 
  683 |                       <div className="max-h-72 space-y-2 overflow-y-auto pr-2">
  684 |                         {faqLoading ? (
  685 |                           <>
  686 |                             <Skeleton className="h-12 rounded-xl" />
  687 |                             <Skeleton className="h-12 rounded-xl" />
  688 |                             <Skeleton className="h-12 rounded-xl" />
  689 |                             <Skeleton className="h-12 rounded-xl" />
  690 |                           </>
  691 |                         ) : (
  692 |                           entries.map((e) => (
  693 |                             <div
  694 |                               key={e.id}
  695 |                               className="rounded-xl bg-[#ffffff] p-3 text-xs shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/5 dark:shadow-none"
  696 |                             >
  697 |                               <div className="flex items-start justify-between gap-3">
  698 |                                 <div className="min-w-0 flex-1">
  699 |                                   <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{e.question}</p>
  700 |                                   <p className="mt-1 truncate text-slate-500 dark:text-slate-400">{e.answer}</p>
  701 |                                 </div>
  702 |                                 <div className="flex shrink-0 gap-2">
  703 |                                   <button onClick={() => selectForEdit(e)} className="text-blue-600 hover:underline dark:text-blue-400">
  704 |                                     Edit
  705 |                                   </button>
  706 |                                   <button onClick={() => removeFaq(e.id)} className="text-rose-600 hover:underline dark:text-rose-300">
  707 |                                     Del
  708 |                                   </button>
  709 |                                 </div>
  710 |                               </div>
  711 |                             </div>
  712 |                           ))
  713 |                         )}
  714 |                       </div>
  715 |                     </div>
  716 |                   </SpotlightCard>
  717 |                 </section>
  718 |               </MotionItem>
  719 |             ) : null}
  720 | 
  721 |             <MotionItem index={hubTiles.length + HELP_SECTIONS.length + 2}>
  722 |               <section className="scroll-mt-6">
  723 |                 <SpotlightCard className={cardClassName({ glass: true })}>
  724 |                   <div className="flex items-center justify-between gap-3">
  725 |                     <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Support</h2>
  726 |                     <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
  727 |                       Response varies
  728 |                     </span>
  729 |                   </div>
  730 |                   <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
  731 |                     If your issue is not resolved, use the Floating Assistant, submit a support ticket, or contact the GarTexHub Support Team.
  732 |                   </p>
  733 |                   <div className="mt-6 flex flex-wrap gap-3">
  734 |                     <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400">
  735 |                       Open support ticket
  736 |                     </button>
  737 |                     <button className="rounded-full bg-[#ffffff] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/8">
  738 |                       Live chat
  739 |                     </button>
  740 |                   </div>
  741 |                   <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
  742 |                     Tip: On <span className="font-semibold">/help</span>, the assistant uses an “Orb” style to indicate ready-to-help status.
  743 |                   </p>
  744 |                 </SpotlightCard>
  745 |               </section>
  746 |             </MotionItem>
  747 |           </div>
  748 | 
  749 |           <div className="space-y-6">
  750 |             <div className="sticky top-8 space-y-6">
  751 |               <SpotlightCard className={cardClassName({ glass: true })}>
  752 |                 <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Search</h3>
  753 |                 <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Search FAQ answers instantly.</p>
  754 |                 <div className="mt-4">
  755 |                   <input
  756 |                     value={q}
  757 |                     onChange={(e) => setQ(e.target.value)}
  758 |                     placeholder="Search users, terms, workflows..."
  759 |                     className="w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
  760 |                   />
  761 |                 </div>
  762 |                 <div className="mt-3 flex flex-wrap gap-2">
  763 |                   {['verification', 'contracts', 'messages', 'premium', 'sub-accounts'].map((chip) => (
  764 |                     <button
  765 |                       key={chip}
  766 |                       type="button"
  767 |                       onClick={() => setQ(chip)}
  768 |                       className="rounded-full bg-slate-900/4 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-900/6 active:scale-[0.98] dark:bg-white/6 dark:text-slate-300 dark:hover:bg-white/8"
  769 |                     >
  770 |                       {chip}
  771 |                     </button>
  772 |                   ))}
  773 |                 </div>
  774 |               </SpotlightCard>
  775 | 
  776 |               <SpotlightCard className={cardClassName({ glass: true })}>
  777 |                 <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Quick navigation</h3>
  778 |                 <div className="mt-4 flex flex-wrap gap-2">
  779 |                   {[...HELP_SECTIONS.map((s) => ({ id: s.id, label: s.title })), { id: 'faq', label: '10. FAQ' }].map((s) => (
  780 |                     <a
  781 |                       key={s.id}
  782 |                       href={`#${s.id}`}
  783 |                       className="rounded-full bg-blue-600/10 px-3 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-600/14 active:scale-[0.98] dark:bg-blue-500/12 dark:text-blue-200 dark:hover:bg-blue-500/18"
  784 |                     >
  785 |                       {s.label}
  786 |                     </a>
  787 |                   ))}
  788 |                 </div>
  789 |               </SpotlightCard>
  790 | 
  791 |               <SpotlightCard className={cardClassName({ glass: true })}>
  792 |                 <div className="flex items-center justify-between gap-3">
  793 |                   <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Floating Assistant</h3>
  794 |                   <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
  795 |                     Orb mode
  796 |                   </span>
  797 |                 </div>
  798 |                 <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
  799 |                   On this page, the assistant uses a glass “Orb” with a rotating ring in dark mode to signal it’s ready to help.
  800 |                 </p>
  801 |                 <div className="mt-4 rounded-xl bg-slate-900/2 p-4 dark:bg-white/5">
  802 |                   <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">What it can do</p>
  803 |                   <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
  804 |                     Setup, navigation, support articles -- it does not negotiate.
  805 |                   </p>
  806 |                 </div>
  807 |               </SpotlightCard>
  808 |             </div>
  809 |           </div>
  810 |         </div>
  811 |       </div>
  812 |     </div>
  813 |   )
  814 | }
  815 | 
  816 | 