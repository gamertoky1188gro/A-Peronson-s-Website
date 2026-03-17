import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../lib/auth'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

function VerifiedBadge({ label = 'Verified' }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_10px_24px_rgba(16,185,129,0.12)] dark:bg-emerald-400/8 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.14),0_0_32px_rgba(16,185,129,0.16)]"
      title="Verified"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.65)] dark:bg-emerald-300 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
      {label}
    </span>
  )
}

function Surface({ className = '', children }) {
  function handleSpotlightMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
  }

  return (
    <div
      className={[
        'spotlight-card rounded-3xl bg-white/75 backdrop-blur-sm',
        'shadow-[0_18px_46px_rgba(15,23,42,0.08)]',
        'dark:bg-[#0D0D14] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
        'transition duration-300 ease-out will-change-transform',
        'hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)]',
        'dark:hover:-translate-y-1',
        className,
      ].join(' ')}
      onMouseMove={handleSpotlightMove}
    >
      {children}
    </div>
  )
}

function GlassSurface({ className = '', children }) {
  function handleSpotlightMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
  }

  return (
    <div
      className={[
        // Intentionally dark glass in *both* light + dark mode (Contract Vault = "secure room" vibe).
        // Avoid multiple `bg-*` utilities here (Tailwind utility ordering can make overrides unreliable).
        'spotlight-card rounded-3xl bg-white/10 backdrop-blur-md text-[#1E293B] dark:text-white',
        'shadow-[0_22px_60px_rgba(2,6,23,0.55)]',
        'ring-1 ring-white/12',
        'transition duration-300 ease-out will-change-transform',
        'hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(2,6,23,0.65)]',
        className,
      ].join(' ')}
      onMouseMove={handleSpotlightMove}
    >
      {children}
    </div>
  )
}

function BentoMotion({ index, className = '', children }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1,
      }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedHeroHeading({ text, className = '' }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <span className={className}>{text}</span>

  const words = String(text).split(' ')
  let globalIndex = 0
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          const chars = Array.from(word)
          return (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={`${word}-${wordIndex}`}>
              <span className="inline-block whitespace-nowrap">
                {chars.map((ch, idx) => {
                  const charIndex = globalIndex++
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <motion.span
                      key={`${ch}-${idx}`}
                      className="inline-block"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: charIndex * 0.012 }}
                    >
                      {ch}
                    </motion.span>
                  )
                })}
              </span>
              {wordIndex < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          )
        })}
      </span>
    </span>
  )
}

function MagneticLinkButton({ to, className = '', children }) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 })
  const maxShift = 9

  function handleMove(event) {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const relX = (event.clientX - rect.left) / rect.width
    const relY = (event.clientY - rect.top) / rect.height
    const dx = (relX - 0.5) * 2
    const dy = (relY - 0.5) * 2
    x.set(dx * maxShift)
    y.set(dy * maxShift)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <Link to={to} className="inline-flex">
      <motion.span
        className={className}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.span>
    </Link>
  )
}

function SkeletonLine({ className = '' }) {
  return <div className={['skeleton rounded-xl', className].join(' ')} />
}

export default function TexHub() {
  const initialHome = useMemo(
    () => ({
      hero: {
        buyerRequest: {
          label: 'Buyer Request',
          title: 'Denim jacket — 10k pcs, wash + trims',
          badge: 'Priority',
          fields: [
            { label: 'Target', value: 'EU' },
            { label: 'Delivery', value: 'May' },
          ],
        },
        verifiedFactories: {
          title: 'Verified factories',
          subtitle: 'Matched by compliance',
          factories: [
            { id: null, name: 'GarmentWorks Ltd', verified: true },
            { id: null, name: 'TexPro Manufacturing', verified: true },
            { id: null, name: 'Stitch & Seal Co', verified: true },
          ],
        },
      },
      bento: {
        professionalFeed: {
          title: 'Professional feed',
          description: 'A calm, LinkedIn-style surface where posts stay readable without heavy frames.',
          lanes: [
            { label: 'Buyer Requests', meta: 'Auto-sorted' },
            { label: 'Factory Updates', meta: 'Auto-sorted' },
            { label: 'Buying House Notes', meta: 'Auto-sorted' },
          ],
        },
        structuredBuyerRequests: {
          title: 'Structured buyer requests',
          description: 'Perfectly aligned fields so teams compare requirements instantly.',
          badge: 'Aligned',
          fields: [
            { label: 'Product', value: 'Polo shirt' },
            { label: 'Qty', value: '30,000' },
            { label: 'Fabric', value: 'Cotton 200gsm' },
            { label: 'Target', value: 'USA' },
          ],
        },
        contractVault: {
          title: 'Contract Vault',
          description: 'A secure room vibe for agreements, compliance docs, and audit-ready records.',
          items: ['Draft → Signed', 'Version history', 'Team access control'],
          badge: 'Encrypted storage',
        },
        enterpriseAnalytics: {
          title: 'Enterprise analytics',
          description: 'Decision-ready reporting for buying houses — without turning the UI into a spreadsheet.',
          stats: [
            { label: 'Active leads', value: '128' },
            { label: 'Verified matches', value: '64' },
            { label: 'Avg. response', value: '2h 14m' },
          ],
        },
        agentLock: {
          title: 'Internal Agent Lock System',
          description: 'Subtle, conflict-free lead ownership across multi-agent buying house teams.',
          requestLabel: 'Request #BR-1842',
          status: 'Locked',
          note: 'Claimed by Agent A — teammates can collaborate without overwriting.',
        },
      },
    }),
    [],
  )

  const [home, setHome] = useState(initialHome)
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('professional')

  useEffect(() => {
    let alive = true
    const controller = new AbortController()

    apiRequest('/system/home', { signal: controller.signal })
      .then((data) => {
        if (!alive) return
        if (data?.ok && data?.hero && data?.bento) {
          setHome((prev) => ({ ...prev, ...data }))
        }
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
  }, [initialHome])

  const heroBuyerRequest = home?.hero?.buyerRequest || initialHome.hero.buyerRequest
  const heroFactories = home?.hero?.verifiedFactories || initialHome.hero.verifiedFactories
  const bento = home?.bento || initialHome.bento

  const bentoView = useMemo(() => {
    if (mode === 'professional') return bento
    return {
      ...bento,
      professionalFeed: {
        ...bento.professionalFeed,
        title: 'Diverse feed',
        description: 'A broader surface for discovery — still structured and readable.',
        lanes: [
          { label: 'Market Updates', meta: 'Auto-sorted' },
          { label: 'New Suppliers', meta: 'Auto-sorted' },
          { label: 'Opportunities', meta: 'Auto-sorted' },
        ],
      },
      structuredBuyerRequests: {
        ...bento.structuredBuyerRequests,
        badge: 'Verified',
        fields: [
          { label: 'Product', value: 'Hoodie' },
          { label: 'Qty', value: '12,500' },
          { label: 'Fabric', value: 'Fleece 320gsm' },
          { label: 'Target', value: 'EU' },
        ],
      },
    }
  }, [bento, mode])

  return (
    <div className="neo-page relative min-h-screen overflow-x-hidden bg-[#F8FAFC] dark:bg-[#05050A]">
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
        <div
          className={[
            'absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full blur-3xl',
            mode === 'professional' ? 'bg-emerald-500/10' : 'bg-fuchsia-500/10',
          ].join(' ')}
        />
        <div
          className={[
            'absolute top-24 right-[-140px] h-[520px] w-[520px] rounded-full blur-3xl',
            mode === 'professional' ? 'bg-sky-500/10' : 'bg-violet-500/10',
          ].join(' ')}
        />
        <div
          className={[
            'absolute bottom-[-220px] left-[-160px] h-[600px] w-[600px] rounded-full blur-3xl',
            mode === 'professional' ? 'bg-indigo-500/10' : 'bg-emerald-500/10',
          ].join(' ')}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]" />
              Clean Tech sourcing for garments & textiles
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl dark:text-white">
              <AnimatedHeroHeading text="Where global buyers meet verified garment & textile suppliers" />
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-400">
              A structured, low-noise B2B platform for buyer requests, verified factories, partner networks, and secure
              contracts — built for real teams.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticLinkButton
                to="/signup"
                className="shimmer-btn border-0 px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[#1E293B] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[#162132] hover:shadow-[0_22px_50px_rgba(15,23,42,0.25)] dark:bg-gradient-to-r dark:from-emerald-500/85 dark:via-sky-500/70 dark:to-indigo-500/70 dark:hover:from-emerald-500/92 dark:hover:via-sky-500/80 dark:hover:to-indigo-500/80 dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
              >
                Create Buyer Account
              </MagneticLinkButton>
              <MagneticLinkButton
                to="/signup"
                className="border-0 px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-white/70 text-[#1E293B] font-semibold tracking-tight backdrop-blur-sm transition duration-300 ease-out hover:bg-white hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]"
              >
                Register Factory
              </MagneticLinkButton>
              <MagneticLinkButton
                to="/feed"
                className="border-0 px-4 py-2 shadow-none inline-flex items-center justify-center rounded-2xl bg-[#1E293B]/5 text-[#1E293B]/80 font-semibold transition duration-300 ease-out hover:bg-[#1E293B]/8 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
              >
                Explore Platform
              </MagneticLinkButton>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-[#475569] sm:grid-cols-4 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
                Structured Buyer Requests
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
                Verified Factories
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
                Digital Contract Vault
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
                AI Guided Workflow
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Surface className="p-6">
              <div className="flex items-center justify-between">
                {loading ? (
                  <>
                    <SkeletonLine className="h-7 w-40 rounded-full" />
                    <SkeletonLine className="h-7 w-24 rounded-full" />
                  </>
                ) : (
                  <>
                    <div className="h-7 w-40 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]" />
                    <div className="h-7 w-24 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]" />
                  </>
                )}
              </div>
              <div className="mt-5 grid gap-3">
                {loading ? (
                  <>
                    <div className="rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                      <SkeletonLine className="h-3 w-24" />
                      <SkeletonLine className="mt-3 h-4 w-64" />
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <SkeletonLine className="h-8" />
                        <SkeletonLine className="h-8" />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]">
                      <div className="flex items-center justify-between gap-3">
                        <SkeletonLine className="h-4 w-36" />
                        <SkeletonLine className="h-3 w-28" />
                      </div>
                      <div className="mt-3 grid gap-2">
                        <SkeletonLine className="h-10" />
                        <SkeletonLine className="h-10" />
                        <SkeletonLine className="h-10" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-emerald-700">{heroBuyerRequest.label}</p>
                          <p className="mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white">{heroBuyerRequest.title}</p>
                        </div>
                        <VerifiedBadge label={heroBuyerRequest.badge} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#475569] dark:text-slate-400">
                        {(heroBuyerRequest.fields || []).slice(0, 2).map((field) => (
                          <div
                            key={field.label}
                            className="flex items-center justify-between rounded-xl bg-[#1E293B]/4 px-3 py-2 dark:bg-white/[0.03]"
                          >
                            <span>{field.label}</span>
                            <span className="font-semibold text-[#1E293B] dark:text-white">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{heroFactories.title}</p>
                        <p className="text-xs text-[#475569] dark:text-slate-400">{heroFactories.subtitle}</p>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {(heroFactories.factories || []).slice(0, 3).map((factory) => (
                          <div
                            key={factory.id || factory.name}
                            className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 dark:bg-[#05050A]"
                          >
                            <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{factory.name}</p>
                            {factory.verified ? <VerifiedBadge /> : <VerifiedBadge label="Review" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {loadError ? <p className="text-xs text-amber-700 dark:text-amber-300">{loadError}</p> : null}
              </div>
            </Surface>
          </div>
        </div>

        <div id="about" className="mt-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <Surface className="relative p-8">
              <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]" />
              <div className="relative z-10">
              <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Problem</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Typical marketplaces are loud and unstructured — teams lose time, trust, and context.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300">
                <li>Noise from random listings</li>
                <li>Unstructured buyer requirements</li>
                <li>Weak verification signals</li>
                <li>Internal lead conflicts in buying houses</li>
              </ul>
              </div>
            </Surface>
            <Surface className="relative p-8">
              <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent_70%)]" />
              <div className="relative z-10">
              <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Solution</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Clear surfaces, verified signals, and structured workflows — designed to stay calm at scale.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300">
                <li>Structured Buyer Requests</li>
                <li>Verified supplier priority</li>
                <li>Internal Agent Lock System</li>
                <li>Organized partner network</li>
              </ul>
              </div>
            </Surface>
          </div>
        </div>

        <div id="how-it-works" className="mt-16">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">How GarTexHub works</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">A simple flow that stays structured end-to-end.</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Surface className="p-6">
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 1</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Post or search</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Buyers post structured requirements. Factories publish products and capacity.
              </p>
            </Surface>
            <Surface className="p-6">
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 2</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Smart matching + claim lead</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Agents claim requests. AI summarizes context so the team moves fast without noise.
              </p>
            </Surface>
            <Surface className="p-6">
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 3</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Chat, call, contract</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Communicate, schedule meetings, and store agreements inside the Contract Vault.
              </p>
            </Surface>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Platform features</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
              Borderless surfaces, clean hierarchy, and strong trust indicators.
            </p>
          </div>

          <div
            className={[
              'mt-8 rounded-3xl bg-transparent p-0 dark:p-[2px] transition-colors duration-[400ms]',
              mode === 'professional' ? 'dark:bg-[#05050A]' : 'dark:bg-[#0B0A18]',
            ].join(' ')}
          >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-6 dark:gap-px">
            <BentoMotion index={0} className="md:col-span-3">
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.professionalFeed.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.professionalFeed.description}
              </p>
              <div className="mt-5 grid gap-2">
                {loading ? (
                  <>
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                  </>
                ) : (
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="grid gap-2"
                    >
                      {(bentoView.professionalFeed.lanes || []).map((lane) => (
                        <div
                          key={lane.label}
                          className="flex items-center justify-between rounded-2xl bg-slate-900/4 px-4 py-3 dark:bg-white/[0.03]"
                        >
                          <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{lane.label}</p>
                          <span className="rounded-full bg-[#1E293B]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] dark:bg-white/[0.06] dark:text-slate-400">
                            {lane.meta}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </Surface>
            </BentoMotion>

            <BentoMotion index={1} className="md:col-span-3">
            <Surface className="p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.structuredBuyerRequests.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                    {bentoView.structuredBuyerRequests.description}
                  </p>
                </div>
                <VerifiedBadge label={bentoView.structuredBuyerRequests.badge} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {loading ? (
                  <>
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                  </>
                ) : (
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      {(bentoView.structuredBuyerRequests.fields || []).map((field) => (
                        <div
                          key={field.label}
                          className="flex items-center justify-between rounded-2xl bg-slate-900/4 px-4 py-3 text-sm dark:bg-white/[0.03]"
                        >
                          <span className="text-[#64748B] dark:text-slate-400">{field.label}</span>
                          <span className="font-semibold text-[#1E293B] dark:text-white">{field.value}</span>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </Surface>
            </BentoMotion>

            <BentoMotion index={2} className="md:col-span-2">
            <GlassSurface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.contractVault.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80">{bentoView.contractVault.description}</p>
              <div className="mt-5 space-y-2">
                {(bentoView.contractVault.items || []).map((item) => (
                  <div key={item} className="rounded-2xl bg-[#1E293B]/5 px-4 py-3 text-sm text-[#1E293B] dark:bg-white/12 dark:text-white">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 inline-flex">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_16px_40px_rgba(16,185,129,0.12)] dark:bg-emerald-400/18 dark:text-emerald-200 dark:shadow-[0_0_26px_rgba(16,185,129,0.24)]">
                  {bentoView.contractVault.badge}
                </span>
              </div>
            </GlassSurface>
            </BentoMotion>

            <BentoMotion index={3} className="md:col-span-4">
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.enterpriseAnalytics.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.enterpriseAnalytics.description}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {(bentoView.enterpriseAnalytics.stats || []).map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-slate-900/4 p-4 dark:bg-white/[0.03]">
                    <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </Surface>
            </BentoMotion>

            <BentoMotion index={4} className="md:col-span-4">
            <Surface className="p-7 bg-slate-900/3">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.agentLock.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.agentLock.description}
              </p>
              <div className="mt-5 rounded-2xl bg-white/70 p-4 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{bentoView.agentLock.requestLabel}</p>
                  <span className="rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300">
                    {bentoView.agentLock.status}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#475569] dark:text-slate-400">
                  {bentoView.agentLock.note}
                </p>
              </div>
            </Surface>
            </BentoMotion>

            <BentoMotion index={5} className="md:col-span-2">
            <Surface
              className={[
                'p-7 transition-colors duration-[400ms]',
                mode === 'professional' ? '' : 'dark:bg-[#0E0D1A]',
              ].join(' ')}
            >
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Unique toggle</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                A tactile switch for diverse content modes — recessed track, raised handle.
              </p>
              <div className="mt-5 inline-flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMode((current) => (current === 'professional' ? 'diverse' : 'professional'))}
                  className={[
                    'relative h-10 w-20 rounded-full p-1 flex items-center transition-colors duration-[400ms]',
                    mode === 'professional' ? 'justify-start bg-[#1E293B]/10' : 'justify-end bg-[#312E81]/12',
                    'shadow-[inset_0_2px_6px_rgba(15,23,42,0.18)]',
                    'dark:bg-white/[0.06] dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.7)]',
                  ].join(' ')}
                  aria-label="Toggle content mode"
                >
                  <motion.div
                    layout
                    layoutId="home-mode-handle"
                    transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                    className="h-8 w-8 rounded-full bg-white shadow-[0_10px_22px_rgba(15,23,42,0.20)] dark:bg-white/90 dark:shadow-[0_14px_40px_rgba(0,0,0,0.65)]"
                  />
                </button>
                <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
                  {mode === 'professional' ? 'Professional' : 'Diverse'}
                </span>
              </div>
            </Surface>
            </BentoMotion>

            <BentoMotion index={6} className="md:col-span-2">
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Factory video gallery</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Edge-to-edge thumbnails for an immersive profile experience.
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl">
                <div className="grid grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      className={[
                        'aspect-video',
                        loading ? 'skeleton' : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-900 dark:to-slate-800',
                        !loading && i % 3 === 1 ? 'from-slate-100 to-slate-300 dark:from-slate-950 dark:to-slate-800' : '',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>
            </Surface>
            </BentoMotion>

            <BentoMotion index={7} className="md:col-span-4">
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">AI assistant</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                A floating assistant that feels premium — glassy, calm, and helpful.
              </p>
              <div className="mt-5 rounded-2xl bg-white/55 backdrop-blur-md p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/50 dark:bg-white/[0.03] dark:ring-white/10">
                <p className="text-sm font-semibold text-[#1E293B] dark:text-white">“Need help posting a request?”</p>
                <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400">I can generate a structured template in seconds.</p>
              </div>
            </Surface>
            </BentoMotion>
          </div>
          </div>
        </div>

        <div className="mt-16">
          <Surface className="p-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Built for growing buying houses</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Unlimited sub-accounts · dedicated analytics · organization control · contract management
                </p>
              </div>
              <div className="lg:col-span-5 lg:flex lg:justify-end">
                <MagneticLinkButton
                  to="/pricing"
                  className="border-0 px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-emerald-500 hover:shadow-[0_22px_50px_rgba(16,185,129,0.28)] dark:bg-emerald-500/80 dark:hover:bg-emerald-500/90 dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
                >
                  View enterprise plans
                </MagneticLinkButton>
              </div>
            </div>
          </Surface>
        </div>

        <div className="mt-16">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Focused only on garments & textile</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">Industry categories:</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300">
            {['Shirts', 'Pants', 'Knitwear', 'Woven', 'Denim', 'Custom production'].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/70 px-4 py-2 shadow-[0_14px_38px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-16 pb-6">
          <Surface className="p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Start connecting with the right partners</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Clear CTAs and clean surfaces — your first step into a structured marketplace.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
                <MagneticLinkButton
                  to="/signup"
                  className="shimmer-btn border-0 px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[#1E293B] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[#162132] hover:shadow-[0_22px_50px_rgba(15,23,42,0.25)] dark:bg-gradient-to-r dark:from-emerald-500/85 dark:via-sky-500/70 dark:to-indigo-500/70 dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
                >
                  Create account
                </MagneticLinkButton>
                <MagneticLinkButton
                  to="/login"
                  className="border-0 px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-white/70 text-[#1E293B] font-semibold tracking-tight backdrop-blur-sm transition duration-300 ease-out hover:bg-white hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]"
                >
                  Login
                </MagneticLinkButton>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  )
}
