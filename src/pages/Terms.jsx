/*
  Route: /terms
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Render Terms & Conditions content in a readable, scannable layout.
    - Use an "Industrial Digital" visual language: paper-like studio (light) + command center (dark).

  Micro-interactions:
    - Staggered section reveal (Framer Motion).
    - "Signature draw" mark hover (CSS animation) to reinforce legal/contract context.
*/
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const easePremium = [0.16, 1, 0.3, 1]
const Motion = motion

function SignatureMark({ className='' }) {
  return (
    <div
      className={[
        'signature-draw inline-flex items-center justify-center rounded-xl px-3 py-2',
        'bg-black/[0.02] dark:bg-white/5 text-[#0f172a] dark:text-white',
        className,
      ].join(' ')}
      aria-hidden="true"
    >
      <svg width="120" height="28" viewBox="0 0 240 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 40c10-16 18-24 26-24 12 0 2 30 16 30 12 0 8-36 26-36 18 0 6 36 26 36 16 0 10-26 26-26 14 0 6 22 20 22 14 0 8-18 20-18 12 0 8 16 20 16 10 0 16-10 20-16 4-6 8-12 18-12 10 0 18 10 24 22"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
    </div>
  )
}

function LegalCard({ children, className='', index = 0, id }) {
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
        'bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
        'dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5',
        className,
      ].join(' ')}
    >
      {children}
    </motion.section>
  )
}

export default function Terms() {
  const reduceMotion = useReducedMotion()
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen legal-weave bg-[#f8fafc] text-[#0f172a] dark:bg-[#020617] dark:text-[#f8fafc] transition-colors duration-500 ease-in-out px-4 py-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easePremium }}
          className="mb-8"
        >
          <div className="rounded-3xl bg-[#ffffff]/80 backdrop-blur-md borderless-shadow shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10">
                  Legal Agreement
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
                  Terms & Conditions
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Last Updated:{' '}
                  <span className="text-[#0f172a] dark:text-slate-100">{lastUpdated}</span>
                </p>
              </div>
              <div className="max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                This platform is an international B2B Garments and Textiles Marketplace, where Buyer,
                Factory and Buying House connect for professional business purposes. By creating or
                using an account on the platform, you agree to the following terms and conditions.
              </div>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-12 gap-6">
          <LegalCard index={0} className="col-span-12 md:col-span-6" id="purpose">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
                1
              </span>
              Purpose of the Platform
            </h2>
            <ul className="space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {[
                'To establish direct and professional connections between international buyers and Garments/Textile Factories',
                'To ensure business matching based on Buyer Request and Company Product',
                'To manage digital contracts, communication and verification processes in a controlled manner',
                'The platform will be operated as a controlled business environment.',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </LegalCard>

          <LegalCard index={1} className="col-span-12 md:col-span-6" id="account-policy">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
                2
              </span>
              Account Policy
            </h2>
            <ul className="space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {[
                'It is mandatory to open an account only for legitimate business purposes.',
                'Accurate, true and up-to-date information must be provided.',
                'Providing incorrect, false or misleading information will result in administrative action.',
                'The owner will create and manage a certain number of IDs in the Buying House Enterprise account.',
                'Each user is responsible for the security of their login information.',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </LegalCard>

          <LegalCard
            index={2}
            className={[
              'col-span-12',
              '!bg-rose-50 !text-[#0f172a] !ring-1 !ring-rose-200/70 !shadow-[0_12px_40px_rgba(244,63,94,0.12)]',
              'dark:!bg-[#0b1220] dark:!text-white dark:ring-1 dark:ring-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none',
            ].join(' ')}
            id="conduct"
          >
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3 flex items-center gap-3 text-[#0f172a] dark:text-white">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-800 borderless-shadow dark:bg-white/10 dark:text-white text-sm">
                3
              </span>
              User Conduct
            </h2>
            <p className="mb-4 font-semibold text-rose-950/80 dark:text-white/80">
              The following activities are strictly prohibited and will be subject to action:
            </p>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-slate-800 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0">
              {[
                'Posting fake orders or misleading Buyer Requests',
                'Fraudulent or misleading communications',
                'Inducing unsafe transactions outside the platform',
                'Uploading copyright-infringing content',
                'Promoting illegal or prohibited products',
                'Posting obscene, immoral, or offensive content',
                'Uploading videos with excessive musical instruments',
                'Using copyrighted music',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1 bg-rose-100 p-1 rounded-full dark:bg-white/10">
                    <svg className="w-2.5 h-2.5 text-rose-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm italic text-slate-600 dark:text-white/80">
              All media content must be published in a professional and business-like manner.
            </p>
            <div className="mt-6 rounded-2xl borderless-shadow bg-rose-50 p-4 text-sm text-rose-900 shadow-[0_8px_30px_rgba(244,63,94,0.12)] dark:bg-rose-500/10 dark:text-rose-100">
              <p className="font-bold uppercase tracking-wide">Strict policy: No third-party contact sharing</p>
              <p className="mt-2 leading-relaxed">
                Sharing any external contact information (phone, email, WhatsApp, Telegram, Facebook, Instagram, or similar)
                is strictly forbidden on GarTexHub. Violations will result in account restrictions and may lead to permanent
                termination.
              </p>
            </div>
          </LegalCard>

          {[
            {
              id: 4,
              title: 'Buyer Request and Communication Policy',
              points: [
                'Buyer Requests must be clear, specific, and business-like.',
                'Messages from verified users will be displayed on a priority basis.',
                'Other messages will be stored as requests and displayed in a controlled manner.',
                'Spam and irrelevant communications will be controlled.',
                'The platform will monitor and control communications.',
              ],
            },
            {
              id: 5,
              title: 'Digital Agreements and Signatures',
              points: [
                'Digital signatures executed on the platform will be considered legally binding.',
                'A PDF copy of each agreement will be provided to both parties.',
                'A copy will be stored in the company system as legal evidence if necessary.',
              ],
            },
            {
              id: 6,
              title: 'Call and Chat Policy',
              points: [
                'Video and audio calls made through the platform will be recorded.',
                'All recordings will be stored only with the company.',
                'Recordings will not be provided directly to any party, except as required by law.',
                'Records will only be used for dispute resolution, security and legal purposes.',
              ],
            },
            {
              id: 7,
              title: 'Ratings and Transparency',
              points: [
                'Ratings will be provided by the platform upon successful order completion.',
                'User performance and behavior will directly impact visibility.',
                'Providing artificial or manipulated ratings will result in administrative action.',
              ],
            },
            {
              id: 8,
              title: 'Subscription and Enterprise Benefits',
              points: [
                'Buying House and Enterprise accounts will have enhanced management benefits.',
                'Certain advanced features will be enabled through upgrades.',
                'Subscription policies will apply where applicable.',
              ],
            },
          ].map((section, sectionIndex) => {
            const isStitch = section.id === 5
            return (
              <LegalCard
                key={section.id}
                index={3 + sectionIndex}
                className={[
                  'col-span-12 md:col-span-6',
                  isStitch ? 'ring-1 ring-slate-200/70 dark:ring-1 dark:ring-white/10 outline outline-1 outline-dashed outline-slate-200/80 dark:outline-white/10' : '',
                ].join(' ')}
                id={`section-${section.id}`}
              >
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
                    {section.id}
                  </span>
                  {section.title}
                </h2>
                <ul className="space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {section.points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0"></span>
                      {p}
                    </li>
                  ))}
                </ul>
                {isStitch ? (
                  <div className="mt-6 flex justify-end">
                    <SignatureMark />
                  </div>
                ) : null}
              </LegalCard>
            )
          })}

          <LegalCard
            index={8}
            className="col-span-12 bg-amber-50 text-amber-950 dark:bg-[rgba(120,53,15,0.10)] dark:text-amber-50 dark:ring-1 dark:ring-amber-500/20 borderless-shadow"
            id="liability"
          >
            <h2 className="text-lg md:text-xl font-bold tracking-tight mb-3 flex items-center gap-2 text-amber-950 dark:text-white">
              <span className="text-amber-600 dark:text-amber-400">⚠</span>
              9. Liability
            </h2>
            <div className="space-y-3 text-sm md:text-base leading-relaxed">
              <p>
                The platform provides connectivity between Buyers and Sellers. Strong and effective
                security measures have been implemented to prevent fraud.
              </p>
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                If the user violates policies, verification processes or security instructions and
                suffers losses, the user will bear the responsibility himself.
              </p>
            </div>
          </LegalCard>

          <LegalCard index={9} className="col-span-12" id="suspension">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
                10
              </span>
              Account Suspension or Cancellation
            </h2>
            <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              <p>
                Accounts will be suspended or canceled in cases of:{' '}
                <strong>Violation of terms, Fraudulent activity, Providing false information,</strong>{' '}
                or <strong>Behavior that damages reputation</strong>.
              </p>
              <ul className="list-disc ml-5 space-y-1 text-sm md:text-base">
                <li>The user will be notified before closing the account.</li>
                <li>A warning will be given if necessary.</li>
                <li>In case of repeated or serious violations, the account will be permanently closed.</li>
              </ul>
            </div>
          </LegalCard>

          <LegalCard index={10} className="col-span-12 md:col-span-6" id="change-policy">
            <h3 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2">
              11. Change Policy
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              These Terms will be updated as needed. Users will be notified of any significant changes via notification.
            </p>
          </LegalCard>

          <LegalCard index={11} className="col-span-12 md:col-span-6" id="consent">
            <h3 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2">
              12. Consent
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              By creating an account or using the Platform, you agree to be bound by all provisions of these Terms and Conditions.
            </p>
          </LegalCard>

          <motion.footer
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easePremium, delay: reduceMotion ? 0 : 12 * 0.1 }}
            className="col-span-12 text-center"
          >
            <div className="rounded-2xl p-6 bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                © 2026 GarTexHub Professional Network. All Rights Reserved.
              </p>
            </div>
          </motion.footer>
        </div>
      </div>
    </div>
  )
}

