/*
  Route: /pricing
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Present pricing tiers (Free vs Premium).
    - Present enterprise-style analytics preview tiles (dynamic, public).
    - Feature comparison table (icons, row hover, no vertical lines).

  Key API endpoints:
    - GET /api/system/pricing  (via `apiRequest('/system/pricing')`)

  Major UI/UX patterns:
    - Zinc-first palette (pricing-only) for a clean SaaS look.
    - Spotlight hover (`SpotlightCard`) for borderless depth.
    - Premium card perimeter beam (CSS conic gradient) + pulse badge.
    - Staggered entrance via Framer Motion (bento tiles + cards).
    - Magnetic CTAs via `MagneticButton`.
*/
import React, { useEffect, useMemo, useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
import MagneticButton from '../components/ui/MagneticButton'
import SpotlightCard from '../components/ui/SpotlightCard'

const Motion = motion

const PLAN_OPTIONS = [
  { key: 'buyer', label: 'Buyer' },
  { key: 'factory', label: 'Factory' },
  { key: 'buying_house', label: 'Buying House' },
]

function planKeyForUserRole(role) {
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'buyer') return 'buyer'
  if (normalized === 'factory') return 'factory'
  if (normalized === 'buying_house') return 'buying_house'
  // Owner/Admin/Agent: default to enterprise/buying-house view.
  return 'buying_house'
}

// Static fallback values (used when API is loading or errors).
const defaultPricing = {
  ok: true,
  analytics: {
    tiles: [
      { label: 'Order completion', value: '84%', sublabel: 'last 30 days', accent: 'teal' },
      { label: 'Avg. cycle', value: '12d', sublabel: 'request → contract', accent: 'blue' },
      { label: 'Active orgs', value: '32', sublabel: 'buyers + factories', accent: 'gold' },
      { label: 'Response SLA', value: '1h 22m', sublabel: 'median', accent: 'blue' },
    ],
  },
}

function Skeleton({ className = '' }) {
  // Shimmer skeleton block (App.css `.skeleton`).
  return <div className={['skeleton', className].join(' ')} />
}

function MotionItem({ index, className = '', children }) {
  const reduceMotion = useReducedMotion()
  // Respect reduced-motion preference.
  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      // Bento entrance: fade + slide up (20px) with a small stagger per index.
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
    >
      {children}
    </motion.div>
  )
}

function accentClasses(accent) {
  if (accent === 'teal') return 'text-[#2dd4bf]'
  if (accent === 'gold') return 'text-[#f59e0b]'
  return 'text-[var(--gt-blue)]'
}

export default function Pricing() {
  const [pricing, setPricing] = useState(defaultPricing)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Logged-out visitors can preview pricing for each account type.
  // Logged-in users see only the plan for their current role.
  const [previewRole, setPreviewRole] = useState('buyer')

  const sessionUser = getCurrentUser()
  const token = getToken()
  const isLoggedIn = Boolean(token && sessionUser)
  const activePlanKey = isLoggedIn ? planKeyForUserRole(sessionUser?.role) : previewRole

  useEffect(() => {
    let alive = true
    const controller = new AbortController()

    apiRequest('/system/pricing', { signal: controller.signal })
      .then((data) => {
        if (!alive) return
        if (data?.ok && data?.analytics?.tiles) setPricing(data)
      })
      .catch((err) => {
        if (!alive) return
        if (err?.name === 'AbortError') return
        setLoadError(String(err?.message || 'Failed to load analytics'))
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

  const plansByRole = useMemo(() => ({
    buyer: {
      Free: [
        'Post structured buyer requests',
        'Search factories & suppliers (basic)',
        'Chat & call access',
        'Contract Vault (basic)',
        'Saved searches (limited)',
      ],
      Premium: [
        'Verified supplier priority',
        'Advanced filters + smarter matching',
        'Priority inbox placement',
        'Extended Contract Vault',
        'Dedicated support',
      ],
    },
    factory: {
      Free: [
        'Product management',
        'Video gallery (approved media)',
        'Receive buyer requests',
        'Chat & call access',
        'Contract Vault (basic)',
        'Agent IDs / sub-accounts (limit 10)',
      ],
      Premium: [
        'Verified badge subscription',
        'Advanced visibility + account reach boost',
        'Exportable reporting',
        'Extended Contract Vault',
        'Agent IDs / sub-accounts (unlimited)',
        'Dedicated support',
      ],
    },
    buying_house: {
      Free: [
        'Lead workflow basics',
        'Buyer request queue access',
        'Partner Network (Buying House only)',
        'Chat & call access',
        'Contract Vault (basic)',
        'Agent IDs / sub-accounts (limit 10)',
      ],
      Premium: [
        'Enterprise analytics page',
        'Conversation lock + team control',
        'Partner Network management',
        'Exportable reporting',
        'Extended Contract Vault',
        'Agent IDs / sub-accounts (unlimited)',
        'Dedicated support',
      ],
    },
  }), [])

  const activePlan = plansByRole[activePlanKey] || plansByRole.buyer
  const freeFeatures = activePlan.Free
  const premiumFeatures = activePlan.Premium

  const boostCtaHref = isLoggedIn ? '/org-settings?tab=boosts' : '/login'
  const boostCtaLabel = isLoggedIn ? 'Manage boosts' : 'Login to purchase'

  // Marketing badge on Premium (not a live account status indicator).
  const verificationStatus = 'verified_active'

  const statusLabel = {
    verified_active: 'Verified active',
    expiring_soon: 'Expiring soon',
    expired: 'Expired (renew to restore badge)',
  }

  const statusChip = {
    verified_active:
      'verified-pulse bg-[rgba(245,158,11,0.18)] text-[#f59e0b] shadow-[0_0_0_1px_rgba(245,158,11,0.22),0_18px_40px_rgba(245,158,11,0.10)] dark:bg-[rgba(245,158,11,0.14)]',
    expiring_soon:
      'bg-[rgba(245,158,11,0.16)] text-[#f59e0b] shadow-[0_0_0_1px_rgba(245,158,11,0.18)] dark:bg-[rgba(245,158,11,0.12)]',
    expired:
      'bg-[rgba(244,63,94,0.16)] text-[#fb7185] shadow-[0_0_0_1px_rgba(244,63,94,0.20)] dark:bg-[rgba(244,63,94,0.12)]',
  }

  const tableRows = useMemo(() => {
    const roleSpecificFirstRow = (() => {
      if (activePlanKey === 'buyer') return { label: 'Structured buyer requests', free: true, premium: true }
      if (activePlanKey === 'factory') return { label: 'Product management', free: true, premium: true }
      return { label: 'Partner Network', free: true, premium: true }
    })()

    return [
      roleSpecificFirstRow,
      { label: 'Agent IDs / sub-accounts', free: 'Up to 10', premium: 'Unlimited' },
      { label: 'Contract Vault storage', free: 'Basic', premium: 'Extended' },
      { label: 'Exportable reports', free: false, premium: true },
      { label: 'Priority inbox', free: false, premium: true },
      { label: 'Analytics page', free: activePlanKey === 'buying_house' ? 'Limited' : 'Basic', premium: true },
      { label: 'Search filtering priority', free: 'Standard', premium: 'Advanced' },
      { label: 'Support level', free: 'Standard', premium: 'Dedicated' },
    ]
  }, [activePlanKey])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fafafa] text-[#09090b] dark:bg-[#09090b] dark:text-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
              Pricing
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] sm:text-5xl">
              Clear plans for serious sourcing teams
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
              Borderless surfaces, verified signals, and export-ready reporting -- built for buying houses and factories.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton
                to="/signup"
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[var(--gt-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(10,102,194,0.25)] transition hover:brightness-105 dark:shadow-none"
              >
                Create your organization
              </MagneticButton>
              <MagneticButton
                to="#plans"
                className="inline-flex items-center justify-center rounded-md bg-[rgba(9,9,11,0.06)] px-5 py-3 text-sm font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
              >
                View plans
              </MagneticButton>
            </div>
          </div>

          <MotionItem index={0} className="lg:col-span-5">
            <SpotlightCard
              className={[
                'rounded-xl p-6',
                'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
                'transition duration-300 ease-out',
                'hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.18)]',
                'dark:hover:translate-y-0 dark:hover:shadow-none',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#09090b] dark:text-[#fafafa]">Analytics snapshot</p>
                <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                  Live
                </span>
              </div>
              {loadError ? (
                <p className="mt-3 text-xs text-[#a1a1aa]">Analytics unavailable -- showing defaults.</p>
              ) : null}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
                  <div
                    key={tile.label}
                    className="rounded-lg bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]"
                  >
                    {loading ? (
                      <>
                        <Skeleton className="h-3 w-24 rounded" />
                        <Skeleton className="mt-3 h-7 w-16 rounded" />
                        <Skeleton className="mt-3 h-3 w-28 rounded" />
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">{tile.label}</p>
                        <p className={['mt-2 text-2xl font-bold tracking-tight', accentClasses(tile.accent)].join(' ')}>
                          {tile.value}
                        </p>
                        <p className="mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">{tile.sublabel}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </MotionItem>
        </div>

        <div className="mt-16" id="plans">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Simple, transparent pricing</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
              Choose the surface you need today -- upgrade when your team scales.
            </p>
          </div>

          {!isLoggedIn && (
            <div className="mx-auto mt-8 max-w-3xl rounded-xl bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">Preview pricing for:</span>
                <div className="flex flex-wrap gap-2">
                  {PLAN_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setPreviewRole(opt.key)}
                      className={[
                        'rounded-full px-4 py-2 text-xs font-semibold transition',
                        previewRole === opt.key
                          ? 'bg-[var(--gt-blue)] text-white shadow-[0_10px_24px_rgba(10,102,194,0.24)]'
                          : 'bg-[#ffffff] text-[#09090b] shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:bg-slate-50 dark:bg-[#18181b] dark:text-[#fafafa] dark:shadow-none dark:hover:bg-slate-700',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <MotionItem index={1}>
              <SpotlightCard
                className={[
                  'rounded-xl p-7',
                  'bg-[rgba(9,9,11,0.02)] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                  'transition duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-18px_rgba(0,0,0,0.22)]',
                  'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
                  'dark:hover:translate-y-0 dark:hover:shadow-none',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Free</h3>
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Start with essential workflow.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$0</p>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>

                <ul className="mt-6 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  {freeFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(9,9,11,0.06)] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                        <Minus className="h-3 w-3" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <MagneticButton
                    to="/signup"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[rgba(9,9,11,0.06)] px-5 py-3 text-sm font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
                  >
                    Get started
                  </MagneticButton>
                </div>
              </SpotlightCard>
            </MotionItem>

            <MotionItem index={2}>
              <SpotlightCard
                className={[
                  'conic-beam rounded-xl p-7',
                  'bg-[rgba(255,255,255,0.70)] backdrop-blur-[12px]',
                  'border border-black/5 shadow-[0_10px_38px_-18px_rgba(0,0,0,0.22)]',
                  'transition duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:shadow-[0_16px_54px_-22px_rgba(0,0,0,0.26)]',
                  'dark:bg-[rgba(24,24,27,0.70)] dark:border-[#27272a] dark:shadow-none',
                  'dark:hover:translate-y-0 dark:hover:shadow-none',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Premium</h3>
                      <span className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusChip[verificationStatus]].join(' ')}>
                        {statusLabel[verificationStatus]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Built for buying houses & enterprise teams.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$199</p>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>

                <ul className="mt-6 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  {premiumFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-[#2dd4bf]">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <MagneticButton
                    to="/signup"
                    className="shimmer-btn inline-flex w-full items-center justify-center rounded-md bg-[#2dd4bf] px-5 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none"
                  >
                    Choose premium
                  </MagneticButton>
                </div>
              </SpotlightCard>
            </MotionItem>
          </div>

          <div className="mt-8">
            <MotionItem index={3}>
              <SpotlightCard
                className={[
                  'rounded-xl p-7',
                  'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                  'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
                  'transition duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.18)]',
                  'dark:hover:translate-y-0 dark:hover:shadow-none',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Boost add-on</h3>
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                      Optional paid boosts increase visibility for profiles and feed posts without changing your plan.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$9.99</p>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per 7 days</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  <span className="inline-flex items-center rounded-full bg-[rgba(9,9,11,0.06)] px-3 py-1 text-xs font-semibold text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                    Feed + Profile
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[rgba(9,9,11,0.06)] px-3 py-1 text-xs font-semibold text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                    Wallet debit
                  </span>
                </div>

                <div className="mt-6">
                  <MagneticButton
                    to={boostCtaHref}
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(10,102,194,0.25)] transition hover:brightness-105 dark:shadow-none"
                  >
                    {boostCtaLabel}
                  </MagneticButton>
                </div>
              </SpotlightCard>
            </MotionItem>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid gap-6 md:grid-cols-6">
            <MotionItem index={3} className="md:col-span-3">
              <SpotlightCard
                className={[
                  'rounded-xl p-7',
                  'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                  'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
                  'transition duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.18)]',
                  'dark:hover:translate-y-0 dark:hover:shadow-none',
                ].join(' ')}
              >
                <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Why enterprise matters</h3>
                <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  When your team scales, structure beats noise. Premium keeps workflows conflict-free and audit-ready.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  {['Team scale without limits', 'Decision-ready visibility', 'Secure contract trail', 'Verified trust signals'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(10,102,194,0.14)] text-[var(--gt-blue)]">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </MotionItem>

            <MotionItem index={4} className="md:col-span-3">
              <SpotlightCard
                className={[
                  'rounded-xl p-7',
                  'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                  'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
                  'transition duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.18)]',
                  'dark:hover:translate-y-0 dark:hover:shadow-none',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Enterprise analytics</h3>
                  <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                    Auto-sorted
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Decision-ready metrics without spreadsheet UI.</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
                    <div
                      key={tile.label}
                      className="rounded-lg bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]"
                    >
                      {loading ? (
                        <>
                          <Skeleton className="h-3 w-24 rounded" />
                          <Skeleton className="mt-3 h-7 w-14 rounded" />
                          <Skeleton className="mt-3 h-3 w-20 rounded" />
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">{tile.label}</p>
                          <p className={['mt-2 text-2xl font-bold tracking-tight', accentClasses(tile.accent)].join(' ')}>
                            {tile.value}
                          </p>
                          <p className="mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">{tile.sublabel}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </MotionItem>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Feature comparison</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Horizontal lines only. Clear, audit-ready differences.</p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
                  <th className="px-6 py-4">Feature</th>
                  <th className="px-6 py-4">Free</th>
                  <th className="px-6 py-4">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7] dark:divide-[#27272a]">
                {tableRows.map((row) => (
                  <tr key={row.label} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-[#09090b] dark:text-[#fafafa]">{row.label}</td>
                    <td className="px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="h-4 w-4 text-[#2dd4bf]" /> : <Minus className="h-4 w-4 text-[#a1a1aa]" />
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="h-4 w-4 text-[#2dd4bf]" /> : <Minus className="h-4 w-4 text-[#a1a1aa]" />
                      ) : (
                        row.premium
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">FAQ</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Short answers, no sales noise.</p>
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-4">
            {[
              { q: 'Can I upgrade anytime*', a: 'Yes -- your data stays intact.' },
              { q: 'Can I downgrade*', a: 'Yes -- plan limits apply immediately.' },
              { q: 'Does GarTexHub handle payments*', a: 'Not yet. The platform focuses on workflow + coordination.' },
              { q: 'Are calls recorded*', a: 'Yes -- for documentation and compliance.' },
            ].map((item, idx) => (
              <MotionItem key={item.q} index={5 + idx}>
                <SpotlightCard
                  className={[
                    'rounded-xl p-6',
                    'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                    'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
                    'transition duration-300 ease-out',
                    'hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.18)]',
                    'dark:hover:translate-y-0 dark:hover:shadow-none',
                  ].join(' ')}
                >
                  <p className="font-semibold text-[#09090b] dark:text-[#fafafa]">{item.q}</p>
                  <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">{item.a}</p>
                </SpotlightCard>
              </MotionItem>
            ))}
          </div>
        </div>

        <div className="mt-16 pb-4">
          <SpotlightCard
            className={[
              'rounded-xl p-10 text-center',
              'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
              'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
            ].join(' ')}
          >
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
              Build a structured textile network today
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#52525b] dark:text-[#a1a1aa]">
              Start free, upgrade when your org needs analytics, export, and secure contract management.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <MagneticButton
                to="/signup"
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[var(--gt-blue)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(10,102,194,0.25)] transition hover:brightness-105 dark:shadow-none"
              >
                Create your organization
              </MagneticButton>
              <MagneticButton
                to="/signup"
                className="inline-flex items-center justify-center rounded-md bg-[#2dd4bf] px-6 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none"
              >
                Choose premium
              </MagneticButton>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  )
}

