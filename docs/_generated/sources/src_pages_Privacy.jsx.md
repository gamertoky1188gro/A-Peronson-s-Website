    1 | /*
    2 |   Route: /privacy
    3 |   Access: Public
    4 | 
    5 |   Public Pages:
    6 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    7 |   Protected Pages (login required):
    8 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    9 |     /notifications, /chat, /call, /verification, /verification-center
   10 | 
   11 |   Primary responsibilities:
   12 |     - Render the Privacy Policy content (legal).
   13 |     - Provide clear, scannable sections (bento layout + optional sticky TOC).
   14 |     - Use "Industrial Digital" palette: paper-gray (light) + slate command center (dark).
   15 | 
   16 |   Notes:
   17 |     - Keep the legal text exact; only structure/styling should change.
   18 |     - This page does not fetch data; it is static content.
   19 | */
   20 | import React from 'react'
   21 | import { motion, useReducedMotion } from 'framer-motion'
   22 | 
   23 | const easePremium = [0.16, 1, 0.3, 1]
   24 | const Motion = motion
   25 | 
   26 | function LegalCard({ children, className='', index = 0, id }) {
   27 |   const reduceMotion = useReducedMotion()
   28 | 
   29 |   return (
   30 |     <motion.section
   31 |       id={id}
   32 |       initial={reduceMotion ? false : { opacity: 0, y: 20 }}
   33 |       animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
   34 |       transition={{
   35 |         duration: 0.55,
   36 |         ease: easePremium,
   37 |         delay: reduceMotion ? 0 : index * 0.1,
   38 |       }}
   39 |       className={[
   40 |         'rounded-2xl p-6 lg:p-8 transition-colors duration-500 ease-in-out',
   41 |         'bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
   42 |         'dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5',
   43 |         className,
   44 |       ].join(' ')}
   45 |     >
   46 |       {children}
   47 |     </motion.section>
   48 |   )
   49 | }
   50 | 
   51 | function TocLink({ href, label }) {
   52 |   return (
   53 |     <a
   54 |       href={href}
   55 |       className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-700 hover:text-indigo-700 bg-black/[0.03] hover:bg-black/[0.05] dark:text-slate-200 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 transition"
   56 |     >
   57 |       {label}
   58 |     </a>
   59 |   )
   60 | }
   61 | 
   62 | export default function Privacy() {
   63 |   const reduceMotion = useReducedMotion()
   64 |   const lastUpdated = '16 March 2026'
   65 | 
   66 |   return (
   67 |     <div className="min-h-screen legal-weave bg-[#f8fafc] text-[#0f172a] dark:bg-[#020617] dark:text-[#f8fafc] transition-colors duration-500 ease-in-out px-4 py-8 lg:px-12 lg:py-12">
   68 |       <div className="mx-auto max-w-6xl">
   69 |         <motion.header
   70 |           initial={reduceMotion ? false : { opacity: 0, y: -10 }}
   71 |           animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
   72 |           transition={{ duration: 0.5, ease: easePremium }}
   73 |           className="mb-5"
   74 |         >
   75 |           <div className="rounded-3xl bg-[#ffffff]/80 backdrop-blur-md borderless-shadow shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
   76 |             <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
   77 |               <div>
   78 |                 <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-sky-50 text-sky-700 borderless-shadow dark:bg-white/5 dark:text-sky-200 dark:ring-1 dark:ring-white/10">
   79 |                   Legal Documentation
   80 |                 </div>
   81 |                 <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
   82 |                   Privacy Policy
   83 |                 </h1>
   84 |                 <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
   85 |                   Last Updated:{' '}
   86 |                   <span className="text-[#0f172a] dark:text-slate-100">{lastUpdated}</span>
   87 |                 </p>
   88 |               </div>
   89 |               <div className="max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
   90 |                 This Privacy Policy explains how our B2B Garments and Textile Marketplace platform <span className="font-bold text-indigo-700 dark:text-indigo-300">collects, uses, protects, and manages your information</span>. Our platform connects international Buyers, Factories, and Buying Houses in a secure and professional environment. <span className="font-semibold text-rose-700 dark:text-rose-300">By creating an account or using our services, you agree to the practices described in this policy.</span>
   91 |               </div>
   92 |             </div>
   93 |           </div>
   94 |         </motion.header>
   95 | 
   96 |         <div className="sticky top-[72px] z-40 mb-6">
   97 |           <div className="rounded-2xl borderless-shadow bg-[#ffffff]/70 backdrop-blur-md shadow-[0_10px_34px_rgba(2,6,23,0.05)] px-4 py-3 dark:bg-[#020617]/60 dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
   98 |             <div className="flex flex-wrap items-center gap-2">
   99 |               <TocLink href="#collect" label="1. Collect" />
  100 |               <TocLink href="#use" label="2. Use" />
  101 |               <TocLink href="#fraud" label="3. Fraud" />
  102 |               <TocLink href="#sharing" label="4. Sharing" />
  103 |               <TocLink href="#storage" label="5. Storage" />
  104 |               <TocLink href="#contracts" label="6. Contracts" />
  105 |               <TocLink href="#security" label="7. Security" />
  106 |               <TocLink href="#rights" label="8. Rights" />
  107 |               <TocLink href="#contact" label="13. Contact" />
  108 |             </div>
  109 |           </div>
  110 |         </div>
  111 | 
  112 |         <div className="grid grid-cols-12 gap-6">
  113 |           <LegalCard index={0} className="col-span-12" id="collect">
  114 |             <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
  115 |               <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
  116 |                 1
  117 |               </span>
  118 |               Information We Collect
  119 |             </h2>
  120 | 
  121 |             <div className="grid grid-cols-12 gap-4">
  122 |               <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] borderless-shadow dark:bg-white/5 dark:ring-1 dark:ring-white/10">
  123 |                 <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Account Data</h3>
  124 |                 <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  125 |                   {['Full Name', 'Organization Name', 'Email Address', 'Phone Number', 'Country', 'Verification Docs', 'Account Type'].map((item) => (
  126 |                     <li key={item} className="flex items-center gap-2">
  127 |                       <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
  128 |                       {item}
  129 |                     </li>
  130 |                   ))}
  131 |                 </ul>
  132 |               </div>
  133 | 
  134 |               <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] borderless-shadow dark:bg-white/5 dark:ring-1 dark:ring-white/10">
  135 |                 <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Business Data</h3>
  136 |                 <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  137 |                   {['Product Specifications', 'Design Requirements', 'Order Documents', 'Digital Signature Records'].map((item) => (
  138 |                     <li key={item} className="flex items-center gap-2">
  139 |                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
  140 |                       {item}
  141 |                     </li>
  142 |                   ))}
  143 |                 </ul>
  144 |               </div>
  145 | 
  146 |               <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] borderless-shadow dark:bg-white/5 dark:ring-1 dark:ring-white/10">
  147 |                 <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Communications</h3>
  148 |                 <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  149 |                   {['Chat messages', 'Video/Audio logs', 'Call recordings'].map((item) => (
  150 |                     <li key={item} className="flex items-center gap-2">
  151 |                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
  152 |                       {item}
  153 |                     </li>
  154 |                   ))}
  155 |                 </ul>
  156 |               </div>
  157 | 
  158 |               <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] borderless-shadow dark:bg-white/5 dark:ring-1 dark:ring-white/10">
  159 |                 <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Technical Information</h3>
  160 |                 <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
  161 |                   {['IP address', 'Device/Browser type', 'Usage activity', 'Search history'].map((item) => (
  162 |                     <li key={item} className="flex items-center gap-2">
  163 |                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
  164 |                       {item}
  165 |                     </li>
  166 |                   ))}
  167 |                 </ul>
  168 |               </div>
  169 |             </div>
  170 |           </LegalCard>
  171 | 
  172 |           <LegalCard index={1} className="col-span-12" id="use">
  173 |             <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
  174 |               <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
  175 |                 2
  176 |               </span>
  177 |               How We Use Your Information
  178 |             </h2>
  179 | 
  180 |             <div className="rounded-2xl p-5 bg-black/[0.02] borderless-shadow dark:bg-white/5 dark:ring-1 dark:ring-white/10">
  181 |               <ul className="grid md:grid-cols-2 gap-4 list-none p-0 m-0">
  182 |                 {[
  183 |                   'Account Management',
  184 |                   'Order Matching',
  185 |                   'AI-Assisted Replies',
  186 |                   'Secure Communications',
  187 |                   'Digital Contracts',
  188 |                   'Fraud Prevention',
  189 |                   'Personalized Alerts',
  190 |                 ].map((item) => (
  191 |                   <li key={item} className="flex items-center gap-3 text-sm md:text-base font-medium rounded-xl px-3 py-2">
  192 |                     <span className="text-sky-600 dark:text-sky-300">✓</span>
  193 |                     {item}
  194 |                   </li>
  195 |                 ))}
  196 |               </ul>
  197 |             </div>
  198 |           </LegalCard>
  199 | 
  200 |           <LegalCard
  201 |             index={2}
  202 |             className="col-span-12 dark:bg-[#0b1220] dark:text-white dark:ring-1 dark:ring-white/10"
  203 |             id="fraud"
  204 |           >
  205 |             <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-[#0f172a] dark:text-white">3. Fraud Prevention Measures</h2>
  206 |             <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-white/85 mb-4">
  207 |               <span className="font-bold text-rose-700 dark:text-rose-300">We take fraud prevention seriously.</span> <span className="text-indigo-700 dark:text-indigo-300 font-semibold">All calls are recorded</span> and <span className="text-indigo-700 dark:text-indigo-300 font-semibold">contracts are digitally signed</span> for your security.
  208 |             </p>
  209 |             <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-slate-700 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0">
  210 |               {[
  211 |                 'Identity verification process',
  212 |                 'Secure digital contracts',
  213 |                 'Recorded calls for disputes',
  214 |                 'Verified user visibility',
  215 |                 'Role-based access control',
  216 |                 'Suspicious activity monitoring',
  217 |                 'Secure reference exchange',
  218 |               ].map((item) => (
  219 |                 <li key={item} className="flex items-start gap-3">
  220 |                   <span className="mt-1 bg-black/5 dark:bg-white/10 p-1 rounded-full">
  221 |                     <svg className="w-3 h-3 text-indigo-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  222 |                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
  223 |                     </svg>
  224 |                   </span>
  225 |                   {item}
  226 |                 </li>
  227 |               ))}
  228 |             </ul>
  229 |           </LegalCard>
  230 | 
  231 |           {[
  232 |             {
  233 |               id: 4,
  234 |               title: 'Data Sharing Policy',
  235 |               text: 'We do not sell personal data to third parties. Information may be shared only between involved business partners, when legally required, or to prevent fraud.',
  236 |               anchor: 'sharing',
  237 |             },
  238 |             {
  239 |               id: 5,
  240 |               title: 'Call Recording & Chat Storage',
  241 |               text: 'All communications conducted within the platform may be securely stored. Call recordings are retained strictly for legal protection and dispute resolution.',
  242 |               anchor: 'storage',
  243 |             },
  244 |             {
  245 |               id: 6,
  246 |               title: 'Digital Contracts & Signatures',
  247 |               text: 'Digital signatures executed through the platform are legally binding. PDF copies are provided and securely stored for legal record integrity.',
  248 |               anchor: 'contracts',
  249 |             },
  250 |             {
  251 |               id: 7,
  252 |               title: 'Data Security',
  253 |               text: 'We employ encrypted transmission, secure server infrastructure, multi-level authentication, and granular role-based permissions.',
  254 |               anchor: 'security',
  255 |             },
  256 |             {
  257 |               id: 8,
  258 |               title: 'User Rights',
  259 |               text: 'You have the right to update info, request deletion, obtain a copy of your data, and manage notification preferences.',
  260 |               anchor: 'rights',
  261 |             },
  262 |           ].map((item, idx) => (
  263 |             <LegalCard key={item.id} index={3 + idx} id={item.anchor} className="col-span-12 md:col-span-6">
  264 |               <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-3">
  265 |                 {item.id}. {item.title}
  266 |               </h2>
  267 |               <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">{item.text}</p>
  268 |             </LegalCard>
  269 |           ))}
  270 | 
  271 |           <LegalCard index={8} className="col-span-12 dark:bg-[#0b1220] dark:text-white" id="contact">
  272 |             <h2 className="text-xl font-bold mb-4 text-[#0f172a] dark:text-white">13. Contact Information</h2>
  273 |             <div className="space-y-1">
  274 |               <p className="text-slate-500 dark:text-white/60 text-sm">Direct Support</p>
  275 |               <p className="font-bold underline decoration-sky-500 underline-offset-4">gartexhub@gmail.com</p>
  276 |             </div>
  277 |           </LegalCard>
  278 | 
  279 |           <motion.footer
  280 |             initial={reduceMotion ? false : { opacity: 0, y: 20 }}
  281 |             animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
  282 |             transition={{ duration: 0.55, ease: easePremium, delay: reduceMotion ? 0 : 9 * 0.1 }}
  283 |             className="col-span-12 text-center"
  284 |           >
  285 |             <div className="rounded-2xl p-6 bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out">
  286 |               <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
  287 |                 © 2026 GARTEXHUB PROFESSIONAL NETWORK. ALL RIGHTS RESERVE
  288 |               </p>
  289 |             </div>
  290 |           </motion.footer>
  291 |         </div>
  292 |       </div>
  293 |     </div>
  294 |   )
  295 | }
  296 | 
  297 | 