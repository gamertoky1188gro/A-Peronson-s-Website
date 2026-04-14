    1 | /*
    2 |   Route: /terms
    3 |   Access: Public
    4 | 
    5 |   Public Pages:
    6 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    7 |   Protected Pages (login required):
    8 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    9 |     /notifications, /chat, /call, /verification, /verification-center
   10 | 
   11 |   Primary responsibilities:
   12 |     - Render Terms & Conditions content in a readable, scannable layout.
   13 |     - Use an "Industrial Digital" visual language: paper-like studio (light) + command center (dark).
   14 | 
   15 |   Micro-interactions:
   16 |     - Staggered section reveal (Framer Motion).
   17 |     - "Signature draw" mark hover (CSS animation) to reinforce legal/contract context.
   18 | */
   19 | import React from 'react'
   20 | import { motion, useReducedMotion } from 'framer-motion'
   21 | 
   22 | const easePremium = [0.16, 1, 0.3, 1]
   23 | const Motion = motion
   24 | 
   25 | function SignatureMark({ className='' }) {
   26 |   return (
   27 |     <div
   28 |       className={[
   29 |         'signature-draw inline-flex items-center justify-center rounded-xl px-3 py-2',
   30 |         'bg-black/[0.02] dark:bg-white/5 text-[#0f172a] dark:text-white',
   31 |         className,
   32 |       ].join(' ')}
   33 |       aria-hidden="true"
   34 |     >
   35 |       <svg width="120" height="28" viewBox="0 0 240 56" fill="none" xmlns="http://www.w3.org/2000/svg">
   36 |         <path
   37 |           d="M14 40c10-16 18-24 26-24 12 0 2 30 16 30 12 0 8-36 26-36 18 0 6 36 26 36 16 0 10-26 26-26 14 0 6 22 20 22 14 0 8-18 20-18 12 0 8 16 20 16 10 0 16-10 20-16 4-6 8-12 18-12 10 0 18 10 24 22"
   38 |           stroke="currentColor"
   39 |           strokeWidth="4"
   40 |           strokeLinecap="round"
   41 |           strokeLinejoin="round"
   42 |           opacity="0.9"
   43 |         />
   44 |       </svg>
   45 |     </div>
   46 |   )
   47 | }
   48 | 
   49 | function LegalCard({ children, className='', index = 0, id }) {
   50 |   const reduceMotion = useReducedMotion()
   51 | 
   52 |   return (
   53 |     <motion.section
   54 |       id={id}
   55 |       initial={reduceMotion ? false : { opacity: 0, y: 20 }}
   56 |       animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
   57 |       transition={{
   58 |         duration: 0.55,
   59 |         ease: easePremium,
   60 |         delay: reduceMotion ? 0 : index * 0.1,
   61 |       }}
   62 |       className={[
   63 |         'rounded-2xl p-6 lg:p-8 transition-colors duration-500 ease-in-out',
   64 |         'bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
   65 |         'dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5',
   66 |         className,
   67 |       ].join(' ')}
   68 |     >
   69 |       {children}
   70 |     </motion.section>
   71 |   )
   72 | }
   73 | 
   74 | export default function Terms() {
   75 |   const reduceMotion = useReducedMotion()
   76 |   const lastUpdated = new Date().toLocaleDateString('en-GB', {
   77 |     day: 'numeric',
   78 |     month: 'long',
   79 |     year: 'numeric',
   80 |   })
   81 | 
   82 |   return (
   83 |     <div className="min-h-screen legal-weave bg-[#f8fafc] text-[#0f172a] dark:bg-[#020617] dark:text-[#f8fafc] transition-colors duration-500 ease-in-out px-4 py-8 lg:px-12 lg:py-12">
   84 |       <div className="mx-auto max-w-6xl">
   85 |         <motion.header
   86 |           initial={reduceMotion ? false : { opacity: 0, y: -10 }}
   87 |           animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
   88 |           transition={{ duration: 0.5, ease: easePremium }}
   89 |           className="mb-8"
   90 |         >
   91 |           <div className="rounded-3xl bg-[#ffffff]/80 backdrop-blur-md borderless-shadow shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
   92 |             <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
   93 |               <div>
   94 |                 <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10">
   95 |                   Legal Agreement
   96 |                 </div>
   97 |                 <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
   98 |                   Terms & Conditions
   99 |                 </h1>
  100 |                 <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
  101 |                   Last Updated:{' '}
  102 |                   <span className="text-[#0f172a] dark:text-slate-100">{lastUpdated}</span>
  103 |                 </p>
  104 |               </div>
  105 |               <div className="max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
  106 |                 This platform is an international B2B Garments and Textiles Marketplace, where Buyer,
  107 |                 Factory and Buying House connect for professional business purposes. By creating or
  108 |                 using an account on the platform, you agree to the following terms and conditions.
  109 |               </div>
  110 |             </div>
  111 |           </div>
  112 |         </motion.header>
  113 | 
  114 |         <div className="grid grid-cols-12 gap-6">
  115 |           <LegalCard index={0} className="col-span-12 md:col-span-6" id="purpose">
  116 |             <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
  117 |               <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
  118 |                 1
  119 |               </span>
  120 |               Purpose of the Platform
  121 |             </h2>
  122 |             <ul className="space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  123 |               {[
  124 |                 'To establish direct and professional connections between international buyers and Garments/Textile Factories',
  125 |                 'To ensure business matching based on Buyer Request and Company Product',
  126 |                 'To manage digital contracts, communication and verification processes in a controlled manner',
  127 |                 'The platform will be operated as a controlled business environment.',
  128 |               ].map((item, idx) => (
  129 |                 <li key={idx} className="flex items-start gap-3">
  130 |                   <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0"></span>
  131 |                   {item}
  132 |                 </li>
  133 |               ))}
  134 |             </ul>
  135 |           </LegalCard>
  136 | 
  137 |           <LegalCard index={1} className="col-span-12 md:col-span-6" id="account-policy">
  138 |             <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
  139 |               <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
  140 |                 2
  141 |               </span>
  142 |               Account Policy
  143 |             </h2>
  144 |             <ul className="space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  145 |               {[
  146 |                 'It is mandatory to open an account only for legitimate business purposes.',
  147 |                 'Accurate, true and up-to-date information must be provided.',
  148 |                 'Providing incorrect, false or misleading information will result in administrative action.',
  149 |                 'The owner will create and manage a certain number of IDs in the Buying House Enterprise account.',
  150 |                 'Each user is responsible for the security of their login information.',
  151 |               ].map((item, idx) => (
  152 |                 <li key={idx} className="flex items-start gap-3">
  153 |                   <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0"></span>
  154 |                   {item}
  155 |                 </li>
  156 |               ))}
  157 |             </ul>
  158 |           </LegalCard>
  159 | 
  160 |           <LegalCard
  161 |             index={2}
  162 |             className={[
  163 |               'col-span-12',
  164 |               '!bg-rose-50 !text-[#0f172a] !ring-1 !ring-rose-200/70 !shadow-[0_12px_40px_rgba(244,63,94,0.12)]',
  165 |               'dark:!bg-[#0b1220] dark:!text-white dark:ring-1 dark:ring-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none',
  166 |             ].join(' ')}
  167 |             id="conduct"
  168 |           >
  169 |             <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3 flex items-center gap-3 text-[#0f172a] dark:text-white">
  170 |               <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-800 borderless-shadow dark:bg-white/10 dark:text-white text-sm">
  171 |                 3
  172 |               </span>
  173 |               User Conduct
  174 |             </h2>
  175 |             <p className="mb-4 font-semibold text-rose-950/80 dark:text-white/80">
  176 |               The following activities are strictly prohibited and will be subject to action:
  177 |             </p>
  178 |             <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-slate-800 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0">
  179 |               {[
  180 |                 'Posting fake orders or misleading Buyer Requests',
  181 |                 'Fraudulent or misleading communications',
  182 |                 'Inducing unsafe transactions outside the platform',
  183 |                 'Uploading copyright-infringing content',
  184 |                 'Promoting illegal or prohibited products',
  185 |                 'Posting obscene, immoral, or offensive content',
  186 |                 'Uploading videos with excessive musical instruments',
  187 |                 'Using copyrighted music',
  188 |               ].map((item, idx) => (
  189 |                 <li key={idx} className="flex items-start gap-3">
  190 |                   <span className="mt-1 bg-rose-100 p-1 rounded-full dark:bg-white/10">
  191 |                     <svg className="w-2.5 h-2.5 text-rose-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  192 |                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
  193 |                     </svg>
  194 |                   </span>
  195 |                   {item}
  196 |                 </li>
  197 |               ))}
  198 |             </ul>
  199 |             <p className="mt-6 text-sm italic text-slate-600 dark:text-white/80">
  200 |               All media content must be published in a professional and business-like manner.
  201 |             </p>
  202 |             <div className="mt-6 rounded-2xl borderless-shadow bg-rose-50 p-4 text-sm text-rose-900 shadow-[0_8px_30px_rgba(244,63,94,0.12)] dark:bg-rose-500/10 dark:text-rose-100">
  203 |               <p className="font-bold uppercase tracking-wide">Strict policy: No third-party contact sharing</p>
  204 |               <p className="mt-2 leading-relaxed">
  205 |                 Sharing any external contact information (phone, email, WhatsApp, Telegram, Facebook, Instagram, or similar)
  206 |                 is strictly forbidden on GarTexHub. Violations will result in account restrictions and may lead to permanent
  207 |                 termination.
  208 |               </p>
  209 |             </div>
  210 |           </LegalCard>
  211 | 
  212 |           {[
  213 |             {
  214 |               id: 4,
  215 |               title: 'Buyer Request and Communication Policy',
  216 |               points: [
  217 |                 'Buyer Requests must be clear, specific, and business-like.',
  218 |                 'Messages from verified users will be displayed on a priority basis.',
  219 |                 'Other messages will be stored as requests and displayed in a controlled manner.',
  220 |                 'Spam and irrelevant communications will be controlled.',
  221 |                 'The platform will monitor and control communications.',
  222 |               ],
  223 |             },
  224 |             {
  225 |               id: 5,
  226 |               title: 'Digital Agreements and Signatures',
  227 |               points: [
  228 |                 'Digital signatures executed on the platform will be considered legally binding.',
  229 |                 'A PDF copy of each agreement will be provided to both parties.',
  230 |                 'A copy will be stored in the company system as legal evidence if necessary.',
  231 |               ],
  232 |             },
  233 |             {
  234 |               id: 6,
  235 |               title: 'Call and Chat Policy',
  236 |               points: [
  237 |                 'Video and audio calls made through the platform will be recorded.',
  238 |                 'All recordings will be stored only with the company.',
  239 |                 'Recordings will not be provided directly to any party, except as required by law.',
  240 |                 'Records will only be used for dispute resolution, security and legal purposes.',
  241 |               ],
  242 |             },
  243 |             {
  244 |               id: 7,
  245 |               title: 'Ratings and Transparency',
  246 |               points: [
  247 |                 'Ratings will be provided by the platform upon successful order completion.',
  248 |                 'User performance and behavior will directly impact visibility.',
  249 |                 'Providing artificial or manipulated ratings will result in administrative action.',
  250 |               ],
  251 |             },
  252 |             {
  253 |               id: 8,
  254 |               title: 'Subscription and Enterprise Benefits',
  255 |               points: [
  256 |                 'Buying House and Enterprise accounts will have enhanced management benefits.',
  257 |                 'Certain advanced features will be enabled through upgrades.',
  258 |                 'Subscription policies will apply where applicable.',
  259 |               ],
  260 |             },
  261 |           ].map((section, sectionIndex) => {
  262 |             const isStitch = section.id === 5
  263 |             return (
  264 |               <LegalCard
  265 |                 key={section.id}
  266 |                 index={3 + sectionIndex}
  267 |                 className={[
  268 |                   'col-span-12 md:col-span-6',
  269 |                   isStitch ? 'ring-1 ring-slate-200/70 dark:ring-1 dark:ring-white/10 outline outline-1 outline-dashed outline-slate-200/80 dark:outline-white/10' : '',
  270 |                 ].join(' ')}
  271 |                 id={`section-${section.id}`}
  272 |               >
  273 |                 <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
  274 |                   <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
  275 |                     {section.id}
  276 |                   </span>
  277 |                   {section.title}
  278 |                 </h2>
  279 |                 <ul className="space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  280 |                   {section.points.map((p, idx) => (
  281 |                     <li key={idx} className="flex items-start gap-3">
  282 |                       <span className="mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0"></span>
  283 |                       {p}
  284 |                     </li>
  285 |                   ))}
  286 |                 </ul>
  287 |                 {isStitch ? (
  288 |                   <div className="mt-6 flex justify-end">
  289 |                     <SignatureMark />
  290 |                   </div>
  291 |                 ) : null}
  292 |               </LegalCard>
  293 |             )
  294 |           })}
  295 | 
  296 |           <LegalCard
  297 |             index={8}
  298 |             className="col-span-12 bg-amber-50 text-amber-950 dark:bg-[rgba(120,53,15,0.10)] dark:text-amber-50 dark:ring-1 dark:ring-amber-500/20 borderless-shadow"
  299 |             id="liability"
  300 |           >
  301 |             <h2 className="text-lg md:text-xl font-bold tracking-tight mb-3 flex items-center gap-2 text-amber-950 dark:text-white">
  302 |               <span className="text-amber-600 dark:text-amber-400">⚠</span>
  303 |               9. Liability
  304 |             </h2>
  305 |             <div className="space-y-3 text-sm md:text-base leading-relaxed">
  306 |               <p>
  307 |                 The platform provides connectivity between Buyers and Sellers. Strong and effective
  308 |                 security measures have been implemented to prevent fraud.
  309 |               </p>
  310 |               <p className="font-semibold text-amber-800 dark:text-amber-200">
  311 |                 If the user violates policies, verification processes or security instructions and
  312 |                 suffers losses, the user will bear the responsibility himself.
  313 |               </p>
  314 |             </div>
  315 |           </LegalCard>
  316 | 
  317 |           <LegalCard index={9} className="col-span-12" id="suspension">
  318 |             <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
  319 |               <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
  320 |                 10
  321 |               </span>
  322 |               Account Suspension or Cancellation
  323 |             </h2>
  324 |             <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  325 |               <p>
  326 |                 Accounts will be suspended or canceled in cases of:{' '}
  327 |                 <strong>Violation of terms, Fraudulent activity, Providing false information,</strong>{' '}
  328 |                 or <strong>Behavior that damages reputation</strong>.
  329 |               </p>
  330 |               <ul className="list-disc ml-5 space-y-1 text-sm md:text-base">
  331 |                 <li>The user will be notified before closing the account.</li>
  332 |                 <li>A warning will be given if necessary.</li>
  333 |                 <li>In case of repeated or serious violations, the account will be permanently closed.</li>
  334 |               </ul>
  335 |             </div>
  336 |           </LegalCard>
  337 | 
  338 |           <LegalCard index={10} className="col-span-12 md:col-span-6" id="change-policy">
  339 |             <h3 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2">
  340 |               11. Change Policy
  341 |             </h3>
  342 |             <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  343 |               These Terms will be updated as needed. Users will be notified of any significant changes via notification.
  344 |             </p>
  345 |           </LegalCard>
  346 | 
  347 |           <LegalCard index={11} className="col-span-12 md:col-span-6" id="consent">
  348 |             <h3 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2">
  349 |               12. Consent
  350 |             </h3>
  351 |             <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  352 |               By creating an account or using the Platform, you agree to be bound by all provisions of these Terms and Conditions.
  353 |             </p>
  354 |           </LegalCard>
  355 | 
  356 |           <motion.footer
  357 |             initial={reduceMotion ? false : { opacity: 0, y: 20 }}
  358 |             animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
  359 |             transition={{ duration: 0.55, ease: easePremium, delay: reduceMotion ? 0 : 12 * 0.1 }}
  360 |             className="col-span-12 text-center"
  361 |           >
  362 |             <div className="rounded-2xl p-6 bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out">
  363 |               <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
  364 |                 © 2026 GarTexHub Professional Network. All Rights Reserved.
  365 |               </p>
  366 |             </div>
  367 |           </motion.footer>
  368 |         </div>
  369 |       </div>
  370 |     </div>
  371 |   )
  372 | }
  373 | 
  374 | 