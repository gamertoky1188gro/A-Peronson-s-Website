/*
  Route: /about
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Explain what GarTexHub is and why it exists (mission/vision/how it works).
    - Display trust-focused stats + verified documents (dynamic).
    - Use bento-grid layout + glass surfaces + subtle weave background (texture reference to textiles).

  Key API endpoints:
    - GET /api/system/about  (via `apiRequest('/system/about')`)

  Major UI/UX patterns:
    - Bento grid + glassmorphism surfaces.
    - Staggered reveal animations (Framer Motion).
    - Skeleton -> fade-in "trust load" while documents/stats fetch.
    - Verified glow indicators (trust anchors).
*/
import React, { useEffect, useMemo, useState } from 'react'
import { Check, FileText, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { apiRequest } from '../lib/auth'
import MagneticButton from '../components/ui/MagneticButton'
import SpotlightCard from '../components/ui/SpotlightCard'

const Motion = motion

// Fallback content keeps layout stable and provides "real-ish" numbers if API fails.
const fallbackAbout = {
  ok: true,
  stats: {
    verifiedFactories: 64,
    countriesCovered: 28,
    docsVerified: 18,
    avgResponseSla: '2h 14m',
  },
  documents: [
    { name: 'Trade license', status: 'Verified', updatedAt: '2026-03-12' },
    { name: 'Factory audit report', status: 'Verified', updatedAt: '2026-03-09' },
    { name: 'Compliance certificate', status: 'Pending', updatedAt: '2026-03-08' },
    { name: 'Bank reference letter', status: 'Verified', updatedAt: '2026-03-05' },
    { name: 'Tax registration', status: 'Expired', updatedAt: '2026-03-01' },
    { name: 'Ownership declaration', status: 'Verified', updatedAt: '2026-02-27' },
  ],
}

function Skeleton({ className = '' }) {
  return <div className={['skeleton', className].join(' ')} />
}

function MotionItem({ index, className = '', children }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
    >
      {children}
    </motion.div>
  )
}

function VerifiedBadge({ label = 'Verified' }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        'bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.12)]',
        'dark:bg-emerald-500/12 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_28px_rgba(16,185,129,0.14)]',
      ].join(' ')}
      title={label}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_14px_rgba(5,150,105,0.55)] dark:bg-emerald-400 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
      {label}
    </span>
  )
}

function StatusChip({ status }) {
  if (status === 'Verified') return <VerifiedBadge label="Verified" />
  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700 shadow-[0_0_0_1px_rgba(56,189,248,0.18)] dark:bg-sky-400/10 dark:text-sky-200">
        Pending
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-700 shadow-[0_0_0_1px_rgba(244,63,94,0.18)] dark:bg-rose-400/10 dark:text-rose-200">
      Expired
    </span>
  )
}

export default function About() {
  const [about, setAbout] = useState(fallbackAbout)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let alive = true
    const controller = new AbortController()

    apiRequest('/system/about', { signal: controller.signal })
      .then((data) => {
        if (!alive) return
        if (data?.ok && data?.stats && Array.isArray(data?.documents)) setAbout(data)
      })
      .catch((err) => {
        if (!alive) return
        if (err?.name === 'AbortError') return
        setLoadError(String(err?.message || 'Failed to load'))
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
      controller.abort()
    }
  }, [])

  const howItWorks = useMemo(
    () => [
      'Buyers can post structured requests with detailed specifications.',
      'Factories and Buying Houses can showcase products and capabilities.',
      'Verified accounts increase trust through document-based validation.',
      'Built-in communication tools enable secure discussions.',
      'Digital contracts and document storage ensure record integrity.',
    ],
    [],
  )

  function handleNeedleMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--needle-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--needle-y', `${event.clientY - rect.top}px`)
  }

  return (
    <div className="weave-bg relative min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#1E293B] dark:bg-[#0F172A] dark:text-[#F1F5F9]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <MotionItem index={0} className="lg:col-span-8">
            <SpotlightCard
              className={[
                'rounded-xl p-8',
                'bg-white/60 backdrop-blur-[10px]',
                'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-[#1E293B] dark:text-[#F1F5F9] sm:text-5xl">
                About GarTexHub
              </h1>
              <p className="mt-3 text-lg italic text-[#475569] dark:text-slate-300">
                A professional B2B platform built exclusively for the Garments and Textile industry.
              </p>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub is a professional B2B platform built exclusively for the Garments and Textile industry. Our goal is
                to create a structured, transparent, and trust-driven environment where international buyers, factories, and
                buying houses can connect with confidence.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <MagneticButton
                  to="/verification"
                  className="liquid-btn inline-flex items-center justify-center rounded-md bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.20)] transition hover:brightness-105 dark:bg-sky-500/15 dark:text-sky-100 dark:shadow-none"
                >
                  View verification standards
                </MagneticButton>
                <MagneticButton
                  to="/help"
                  className="liquid-btn inline-flex items-center justify-center rounded-md bg-white/70 px-5 py-3 text-sm font-semibold text-[#1E293B] shadow-[0_10px_26px_rgba(15,23,42,0.10)] transition hover:bg-white dark:bg-white/10 dark:text-white dark:shadow-none"
                >
                  Contact sales
                </MagneticButton>
              </div>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={1} className="lg:col-span-4">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#1E293B] dark:text-[#F1F5F9]">Trust indicators</p>
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              {loadError ? (
                <p className="mt-3 text-xs text-[#64748B] dark:text-slate-300">Live data unavailable -- showing defaults.</p>
              ) : null}

              <div className="mt-5 grid gap-3">
                {loading ? (
                  <>
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                  </>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid gap-3"
                    >
                      {[
                        { label: 'Verified factories', value: String(about.stats.verifiedFactories) },
                        { label: 'Countries covered', value: String(about.stats.countriesCovered) },
                        { label: 'Docs verified', value: String(about.stats.docsVerified) },
                        { label: 'Avg. response SLA', value: about.stats.avgResponseSla },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-900/4 px-4 py-3 dark:bg-white/5">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] dark:text-slate-300">{item.label}</p>
                          <p className="text-lg font-extrabold tracking-tight text-[#1E293B] dark:text-white">{item.value}</p>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={2} className="lg:col-span-12">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <h2 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-white">Why GarTexHub Exists</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                Cross-border textile trade often depends on informal communication, scattered documents, and manual
                verification processes. This creates inefficiencies, misunderstandings, and trust barriers.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub was created to solve this problem by combining structured communication, verified business
                identities, and secure documentation within one unified system.
              </p>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={3} className="lg:col-span-4">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Mission</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                To simplify international garment sourcing by building a secure digital infrastructure that prioritizes
                credibility, transparency, and efficiency.
              </p>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={4} className="lg:col-span-4">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Vision</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                To become a trusted digital bridge between global buyers and garment manufacturers, reducing negotiation
                friction and strengthening international trade relationships.
              </p>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={5} className="lg:col-span-4 lg:row-span-2">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-white/60 backdrop-blur-[10px]',
                'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">How the Platform Works</h2>

              <ul className="mt-6 space-y-4">
                {howItWorks.map((step, idx) => (
                  <motion.li
                    key={`${step}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.15 + idx * 0.08 }}
                    className="flex gap-3"
                  >
                    <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.18)] dark:bg-emerald-500/12 dark:text-emerald-200">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm leading-relaxed text-[#475569] dark:text-slate-300">{step}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={6} className="lg:col-span-8">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verification & Trust</h2>
                </div>
                <VerifiedBadge label="Verification green" />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub uses a document-based verification system. Companies must submit legal and operational documents,
                which are manually reviewed before verification status is granted.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                Verification is subscription-based and must be maintained to ensure ongoing compliance.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                The more verified documentation a company provides, the stronger its credibility and international acceptance.
              </p>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={7} className="lg:col-span-7">
            <SpotlightCard
              className={[
                'needle-area rounded-xl p-7',
                'bg-white/60 backdrop-blur-[10px]',
                'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
              onMouseMove={handleNeedleMove}
            >
              <span className="needle-cursor" />
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verified documents</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                    Skeleton loads into audit-ready details -- verified signals stay prominent.
                  </p>
                </div>
                <FileText className="h-5 w-5 text-[#0F172A]/70 dark:text-slate-200" />
              </div>

              <div className="mt-6 grid gap-3">
                {loading ? (
                  <>
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                  </>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key="docs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid gap-3"
                    >
                      {(about.documents || []).map((doc) => (
                        <div
                          key={doc.name}
                          className={[
                            'group flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3',
                            'bg-[#FFFFFF] shadow-[0_10px_26px_rgba(15,23,42,0.08)]',
                            'transition duration-300 ease-out',
                            'hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(15,23,42,0.12)]',
                            'dark:bg-white/5 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/7',
                          ].join(' ')}
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#1E293B] dark:text-white">{doc.name}</p>
                            <p className="mt-1 text-xs text-[#64748B] dark:text-slate-300">Updated {doc.updatedAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusChip status={doc.status} />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={8} className="lg:col-span-5">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Digital Bridge</h2>
                <span className="rounded-full bg-[#0F172A]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569] dark:bg-white/8 dark:text-slate-300">
                  Coming soon
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                A global map view that visualizes verified connections between buyers and manufacturers.
              </p>
              <div className="mt-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500/10 via-emerald-500/6 to-indigo-500/10 p-5 dark:from-sky-500/12 dark:via-emerald-500/8 dark:to-indigo-500/12">
                <div className="h-32 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                </div>
              </div>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={9} className="lg:col-span-6">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Industry Focus</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub is strictly dedicated to the Garments and Textile sector. By focusing on a single industry, we
                provide smarter categorization, clearer communication, and more relevant matching between buyers and
                manufacturers.
              </p>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={10} className="lg:col-span-6">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Professional Commitment</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                We do not process direct financial transactions. Our platform is designed to facilitate secure communication,
                structured agreements, and verified business interactions.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub operates with the principle that trust is earned through transparency, documentation, and
                professional conduct.
              </p>
            </SpotlightCard>
          </MotionItem>

          <MotionItem index={11} className="lg:col-span-12">
            <SpotlightCard
              className={[
                'rounded-xl p-8',
                'bg-white/60 backdrop-blur-[10px]',
                'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:border dark:border-slate-700/50 dark:shadow-none',
              ].join(' ')}
            >
              <h2 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-white">Contact & Legal Information</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                For partnership inquiries, support, or compliance-related questions, please contact us through our official
                communication channels listed on the platform.
              </p>
            </SpotlightCard>
          </MotionItem>
        </div>
      </div>
    </div>
  )
}
