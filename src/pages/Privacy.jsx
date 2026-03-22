/*
  Route: /privacy
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Render the Privacy Policy content (legal).
    - Provide clear, scannable sections (bento layout + optional sticky TOC).
    - Use "Industrial Digital" palette: paper-gray (light) + slate command center (dark).

  Notes:
    - Keep the legal text exact; only structure/styling should change.
    - This page does not fetch data; it is static content.
*/
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const easePremium = [0.16, 1, 0.3, 1]
const Motion = motion

function LegalCard({ children, className = '', index = 0, id }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        ease: easePremium,
        delay: reduceMotion ? 0 : index * 0.1,
      }}
      className={[
        'rounded-2xl p-6 lg:p-8 transition-colors duration-500 ease-in-out',
        'bg-[#ffffff] border border-slate-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
        'dark:bg-[#0f172a] dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/5',
        className,
      ].join(' ')}
    >
      {children}
    </motion.section>
  )
}

function TocLink({ href, label }) {
  return (
    <a
      href={href}
      className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-700 hover:text-indigo-700 bg-black/[0.03] hover:bg-black/[0.05] dark:text-slate-200 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 transition"
    >
      {label}
    </a>
  )
}

export default function Privacy() {
  const reduceMotion = useReducedMotion()
  const lastUpdated = '16 March 2026'

  return (
    <div className="min-h-screen legal-weave bg-[#f8fafc] text-[#0f172a] dark:bg-[#020617] dark:text-[#f8fafc] transition-colors duration-500 ease-in-out px-4 py-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easePremium }}
          className="mb-5"
        >
          <div className="rounded-3xl bg-[#ffffff]/80 backdrop-blur-md border border-slate-200 shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-sky-50 text-sky-700 border border-sky-100 dark:bg-white/5 dark:text-sky-200 dark:border-transparent dark:ring-1 dark:ring-white/10">
                  Legal Documentation
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
                  Privacy Policy
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Last Updated:{' '}
                  <span className="text-[#0f172a] dark:text-slate-100">{lastUpdated}</span>
                </p>
              </div>
              <div className="max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                This Privacy Policy explains how our B2B Garments and Textile Marketplace platform <span className="font-bold text-indigo-700 dark:text-indigo-300">collects, uses, protects, and manages your information</span>. Our platform connects international Buyers, Factories, and Buying Houses in a secure and professional environment. <span className="font-semibold text-rose-700 dark:text-rose-300">By creating an account or using our services, you agree to the practices described in this policy.</span>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="sticky top-[72px] z-40 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-[#ffffff]/70 backdrop-blur-md shadow-[0_10px_34px_rgba(2,6,23,0.05)] px-4 py-3 dark:bg-[#020617]/60 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
            <div className="flex flex-wrap items-center gap-2">
              <TocLink href="#collect" label="1. Collect" />
              <TocLink href="#use" label="2. Use" />
              <TocLink href="#fraud" label="3. Fraud" />
              <TocLink href="#sharing" label="4. Sharing" />
              <TocLink href="#storage" label="5. Storage" />
              <TocLink href="#contracts" label="6. Contracts" />
              <TocLink href="#security" label="7. Security" />
              <TocLink href="#rights" label="8. Rights" />
              <TocLink href="#contact" label="13. Contact" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <LegalCard index={0} className="col-span-12" id="collect">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm">
                1
              </span>
              Information We Collect
            </h2>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Account Data</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Full Name', 'Organization Name', 'Email Address', 'Phone Number', 'Country', 'Verification Docs', 'Account Type'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Business Data</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Product Specifications', 'Design Requirements', 'Order Documents', 'Digital Signature Records'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Communications</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Chat messages', 'Video/Audio logs', 'Call recordings'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Technical Information</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['IP address', 'Device/Browser type', 'Usage activity', 'Search history'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </LegalCard>

          <LegalCard index={1} className="col-span-12" id="use">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm">
                2
              </span>
              How We Use Your Information
            </h2>

            <div className="rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
              <ul className="grid md:grid-cols-2 gap-4 list-none p-0 m-0">
                {[
                  'Account Management',
                  'Order Matching',
                  'AI-Assisted Replies',
                  'Secure Communications',
                  'Digital Contracts',
                  'Fraud Prevention',
                  'Personalized Alerts',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm md:text-base font-medium rounded-xl px-3 py-2">
                    <span className="text-sky-600 dark:text-sky-300">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </LegalCard>

          <LegalCard
            index={2}
            className="col-span-12 dark:bg-[#0b1220] dark:text-white dark:ring-1 dark:ring-white/10"
            id="fraud"
          >
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-[#0f172a] dark:text-white">3. Fraud Prevention Measures</h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-white/85 mb-4">
              <span className="font-bold text-rose-700 dark:text-rose-300">We take fraud prevention seriously.</span> <span className="text-indigo-700 dark:text-indigo-300 font-semibold">All calls are recorded</span> and <span className="text-indigo-700 dark:text-indigo-300 font-semibold">contracts are digitally signed</span> for your security.
            </p>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-slate-700 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0">
              {[
                'Identity verification process',
                'Secure digital contracts',
                'Recorded calls for disputes',
                'Verified user visibility',
                'Role-based access control',
                'Suspicious activity monitoring',
                'Secure reference exchange',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 bg-black/5 dark:bg-white/10 p-1 rounded-full">
                    <svg className="w-3 h-3 text-indigo-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </LegalCard>

          {[
            {
              id: 4,
              title: 'Data Sharing Policy',
              text: 'We do not sell personal data to third parties. Information may be shared only between involved business partners, when legally required, or to prevent fraud.',
              anchor: 'sharing',
            },
            {
              id: 5,
              title: 'Call Recording & Chat Storage',
              text: 'All communications conducted within the platform may be securely stored. Call recordings are retained strictly for legal protection and dispute resolution.',
              anchor: 'storage',
            },
            {
              id: 6,
              title: 'Digital Contracts & Signatures',
              text: 'Digital signatures executed through the platform are legally binding. PDF copies are provided and securely stored for legal record integrity.',
              anchor: 'contracts',
            },
            {
              id: 7,
              title: 'Data Security',
              text: 'We employ encrypted transmission, secure server infrastructure, multi-level authentication, and granular role-based permissions.',
              anchor: 'security',
            },
            {
              id: 8,
              title: 'User Rights',
              text: 'You have the right to update info, request deletion, obtain a copy of your data, and manage notification preferences.',
              anchor: 'rights',
            },
          ].map((item, idx) => (
            <LegalCard key={item.id} index={3 + idx} id={item.anchor} className="col-span-12 md:col-span-6">
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-3">
                {item.id}. {item.title}
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">{item.text}</p>
            </LegalCard>
          ))}

          <LegalCard index={8} className="col-span-12 dark:bg-[#0b1220] dark:text-white" id="contact">
            <h2 className="text-xl font-bold mb-4 text-[#0f172a] dark:text-white">13. Contact Information</h2>
            <div className="space-y-1">
              <p className="text-slate-500 dark:text-white/60 text-sm">Direct Support</p>
              <p className="font-bold underline decoration-sky-500 underline-offset-4">gartexhub@gmail.com</p>
            </div>
          </LegalCard>

          <motion.footer
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easePremium, delay: reduceMotion ? 0 : 9 * 0.1 }}
            className="col-span-12 text-center"
          >
            <div className="rounded-2xl p-6 bg-[#ffffff] border border-slate-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                © 2026 GARTEXHUB PROFESSIONAL NETWORK. ALL RIGHTS RESERVE
              </p>
            </div>
          </motion.footer>
        </div>
      </div>
    </div>
  )
}
