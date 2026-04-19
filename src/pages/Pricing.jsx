/*
  Route: /pricing
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Present pricing tiers for Buyer, Factory, Buying House (Free vs Premium).
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
import { useLocation } from 'react-router-dom'
import { Check, Minus } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
import MagneticButton from '../components/ui/MagneticButton'
import SpotlightCard from '../components/ui/SpotlightCard'

const Motion = motion

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
      { label: 'Avg. cycle', value: '12d', sublabel: 'request -> contract', accent: 'blue' },
      { label: 'Active orgs', value: '32', sublabel: 'buyers + factories', accent: 'gold' },
      { label: 'Response SLA', value: '1h 22m', sublabel: 'median', accent: 'blue' },
    ],
  },
}

function Skeleton({ className='' }) {
  // Shimmer skeleton block (App.css `.skeleton`).
  return (
    <div
      className={[
        'relative overflow-hidden bg-slate-200/80 dark:bg-white/5',
        "after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%]",
        'after:pointer-events-none after:opacity-70 dark:after:opacity-90',
        'after:animate-skeleton',
        'after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)]',
        'dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]',
        className,
      ].join(' ')}
    />
  )
}

function MotionItem({ index, className='', children }) {
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
  return 'text-(--gt-blue)'
}

export default function Pricing() {
  const location = useLocation()
  const [pricing, setPricing] = useState(defaultPricing)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const sessionUser = getCurrentUser()
  const token = getToken()
  const isLoggedIn = Boolean(token && sessionUser)
  const activePlanKey = isLoggedIn ? planKeyForUserRole(sessionUser?.role) : 'neutral'

  useEffect(() => {
    // If route contains a hash (e.g. /pricing#plans), scroll to that section after render.
    if (typeof window !== 'undefined' && location?.hash) {
      const id = String(location.hash || '').replace(/^#/, '')
      if (id) {
        // Allow parent layout scroll-to-top to settle first.
        setTimeout(() => {
          const el = document.getElementById(id)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
      }
    }

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
  }, [location.hash])

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
        'Advanced Search Filters',
        'Priority Buyer Request Placement',
        'Dedicated Support',
        'Contract History & Audit Trail',
        'Early Access to New Verified Factories',
        'Buying Pattern Analysis',
        'Order Completion Certification',
        'AI Auto-reply Customization',
        'Smart Supplier Matching',
        'Request Performance Insights',
        'Profile & product boost with increased reach',
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
        'Profile & product boost with increased reach',
        'Advanced analytics (who viewed, inquiry rate)',
        'Priority in search results and filter',
        'AI auto-reply customization',
        'Dedicated account manager',
        'Custom branding on profile',
        'Enterprise analytics dashboard',
        'Unlimited agent/sub-ID creation',
        'Buying Pattern Analysis',
        'Order Completion Certification',
        'Dedicated Support',
        'Contract history & audit trail',
        'Multi-agent management',
        'Multiple team/agent access management',
        'Request factory Performance Insights',
        'Buyer interest analytics',
        'Agent performance analytics and reporting',
        'More product/video posting capacity',
        'Lead distribution across agents',
        'Buyer communication insights',
        'Buyer Request Priority Access',
        'Buyer Conversion Insights',
        'Unlimited Partner Network request accept',
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
        'Profile & product boost with increased reach',
        'Advanced analytics (who viewed, inquiry rate)',
        'Priority in search results and filter',
        'AI auto-reply customization',
        'Dedicated account manager',
        'Custom branding on profile',
        'Enterprise analytics dashboard',
        'Unlimited agent/sub-ID creation',
        'Buying Pattern Analysis',
        'Order Completion Certification',
        'Dedicated Support',
        'Contract history & audit trail',
        'Multi-agent management',
        'Multiple team/agent access management',
        'Request Buying house Performance Insights',
        'Buyer interest analytics',
        'Agent performance analytics and reporting',
        'More product/video posting capacity',
        'Lead distribution across agents',
        'Buyer communication insights',
        'Buyer Request Priority Access',
        'Buyer Conversion Insights',
        'Unlimited Partner Network Access',
      ],
    },
    neutral: {
      Free: [
        'Structured buyer requests or product posts',
        'Basic search and messaging access',
        'Contract Vault (basic)',
        'Saved searches (limited)',
      ],
      Premium: [
        'Advanced Search Filters',
        'Priority Buyer Request Placement',
        'Dedicated Support',
        'Contract History & Audit Trail',
        'Buying Pattern Analysis',
        'Order Completion Certification',
        'AI Auto-reply Customization',
        'Smart Supplier Matching',
        'Request Performance Insights',
        'Profile & product boost with increased reach',
      ],
    },
  }), [])

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

const premiumFeatures = [
  {
    title: 'Buyer (Premium)',
    items: [
      'Advanced Search Filters',
      'Priority Buyer Request Placement',
      'Dedicated Support',
      'Contract History & Audit Trail',
      'Early Access to New Verified Factories',
      'Buying Pattern Analysis',
      'Order Completion Certification',
      'AI Auto-reply Customization',
      'Smart Supplier Matching',
      'Request Performance Insights',
      'Profile & product boost with increased reach',
    ],
  },
  {
    title: 'Factory (Premium)',
    items: [
      'Profile & product boost with increased reach',
      'Advanced Analytics (views + inquiry rate)',
      'Priority in search results & filters',
      'AI auto-reply customization',
      'Dedicated Account Manager',
      'Custom Branding on Profile',
      'Enterprise Analytics Dashboard',
      'Unlimited Agent / Sub-ID Creation',
      'Buying Pattern Analysis',
      'Order Completion Certification',
      'Dedicated Support',
      'Contract History & Audit Trail',
      'Multi-agent Management',
      'Multiple Team / Agent Access Controls',
      'Request & Factory Performance Insights',
      'Buyer Interest Analytics',
      'Agent Performance Analytics & Reporting',
      'More Product & Video Posting Capacity',
      'Lead Distribution Across Agents',
      'Buyer Communication Insights',
      'Buyer Request Priority Access',
      'Buyer Conversion Insights',
      'Unlimited Partner Network Request Acceptance',
    ],
  },
  {
    title: 'Buying House (Premium)',
    items: [
      'Profile & product boost with increased reach',
      'Advanced Analytics (views + inquiry rate)',
      'Priority in search results & filters',
      'AI auto-reply customization',
      'Dedicated Account Manager',
      'Custom Branding on Profile',
      'Enterprise Analytics Dashboard',
      'Unlimited Agent / Sub-ID Creation',
      'Buying Pattern Analysis',
      'Order Completion Certification',
      'Dedicated Support',
      'Contract History & Audit Trail',
      'Multi-agent Management',
      'Multiple Team / Agent Access Controls',
      'Request Buying House Performance Insights',
      'Buyer Interest Analytics',
      'Agent Performance Analytics & Reporting',
      'More Product & Video Posting Capacity',
      'Lead Distribution Across Agents',
      'Buyer Communication Insights',
      'Buyer Request Priority Access',
      'Buyer Conversion Insights',
      'Unlimited Partner Network Access',
    ],
  },
]

  const tableRows = useMemo(() => {
    const roleSpecificFirstRow = (() => {
      if (activePlanKey === 'buyer') return { label: 'Structured buyer requests', free: true, premium: true }
      if (activePlanKey === 'factory') return { label: 'Product management', free: true, premium: true }
      if (activePlanKey === 'buying_house') return { label: 'Partner Network', free: true, premium: true }
      return { label: 'Buyer requests or product posts', free: true, premium: true }
    })()

    return [
      roleSpecificFirstRow,
      { label: 'Agent IDs / sub-accounts', free: 'Up to 10', premium: 'Unlimited' },
      { label: 'Contract Vault storage', free: 'Basic', premium: 'Extended' },
      { label: 'Exportable reports', free: false, premium: true },
      { label: 'AI auto-reply customization', free: false, premium: true },
      { label: 'Analytics page', free: activePlanKey === 'buying_house' ? 'Limited' : 'Basic', premium: true },
      { label: 'Search filtering priority', free: 'Standard', premium: 'Advanced' },
      { label: 'Priority request placement', free: false, premium: true },
      { label: 'Support level', free: 'Standard', premium: 'Dedicated' },
      { label: 'Buying pattern analysis', free: false, premium: true },
      { label: 'Order Completion Certification', free: false, premium: true },
      { label: 'Profile / product boost', free: false, premium: true },
    ]
  }, [activePlanKey])

  const roleSections = [
    { key: 'buyer', title: 'Buyer', subtitle: 'For direct buyers sourcing verified factories.' },
    { key: 'factory', title: 'Factory', subtitle: 'For factories managing products and inbound buyer requests.' },
    { key: 'buying_house', title: 'Buying House', subtitle: 'For buying houses coordinating teams and partners.' },
  ]

  const visibleSections = isLoggedIn
    ? roleSections.filter((section) => section.key === activePlanKey)
    : roleSections

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
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-(--gt-blue) px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(10,102,194,0.25)] transition hover:brightness-105 dark:shadow-none"
              >
                Create your organization
              </MagneticButton>
              <MagneticButton
                to="#plans"
                className="inline-flex items-center justify-center rounded-md border border-[#d4d4d8] bg-white px-5 py-3 text-sm font-semibold text-[#09090b] shadow-none transition hover:bg-[#fafafa] dark:border-white/10 dark:bg-[#18181b] dark:text-[#fafafa]"
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
                'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
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

        <div className="mt-10 space-y-10">
          {visibleSections.map((section, sectionIndex) => {
            const rolePlan = plansByRole[section.key]
            return (
              <div key={section.key} className="rounded-3xl shadow-borderless dark:shadow-borderlessDark bg-white/70 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] dark:bg-[#0f172a]/70 dark:shadow-none dark:ring-1 dark:ring-white/10">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{section.title}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{section.subtitle}</h3>
                  </div>
                  {isLoggedIn && activePlanKey === section.key ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                      Your current role
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <MotionItem index={sectionIndex * 2 + 1}>
            <SpotlightCard
              className={[
                'rounded-xl p-7',
                'bg-[rgba(9,9,11,0.02)] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                'transition duration-300 ease-out',
                'hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-18px_rgba(0,0,0,0.22)]',
                'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
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
                  {rolePlan.Free.map((f) => (
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

                  <MotionItem index={sectionIndex * 2 + 2}>
              <SpotlightCard
                className={[
                  'conic-beam rounded-xl p-7',
                  'bg-[rgba(255,255,255,0.70)] backdrop-blur-md',
                  'shadow-borderless dark:shadow-borderlessDark shadow-[0_10px_38px_-18px_rgba(0,0,0,0.22)]',
                  'transition duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:shadow-[0_16px_54px_-22px_rgba(0,0,0,0.26)]',
                  'dark:bg-[rgba(24,24,27,0.70)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
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
                  {rolePlan.Premium.map((f) => (
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
              </div>
            )
          })}
        </div>

        </div>

        <div className="mt-16">
          <div className="grid gap-6 md:grid-cols-6">
            <MotionItem index={3} className="md:col-span-3">
              <SpotlightCard
                className={[
                  'rounded-xl p-7',
                  'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                  'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
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
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(10,102,194,0.14)] text-(--gt-blue)">
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
                  'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
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

        <div className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] text-center">Premium feature deep dive</h2>
          <p className="mt-2 text-center text-sm text-[#52525b] dark:text-[#a1a1aa]">A role-specific roundup of what the Premium plan unlocks.</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {premiumFeatures.map((bundle) => (
              <SpotlightCard
                key={bundle.title}
                className={[
                  'rounded-2xl p-6',
                  'shadow-borderless dark:shadow-borderlessDark bg-[rgba(9,9,11,0.04)]',
                  'shadow-[0_20px_40px_-26px_rgba(0,0,0,0.85)] dark:bg-[rgba(250,250,250,0.04)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
                ].join(' ')}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{bundle.title}</p>
                <ul className="mt-4 space-y-2 text-sm text-[#09090b] dark:text-[#fafafa]">
                  {bundle.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.75 h-1.5 w-1.5 rounded-full bg-[#4B9DFB]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Feature comparison</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Horizontal lines only. Clear, audit-ready differences.</p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#18181b] dark:shadow-borderless dark:shadow-borderlessDark dark:shadow-none">
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
                  <tr key={row.label} className="transition-colors hover:bg-black/2 dark:hover:bg-white/2">
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
              { q: 'Does GarTexHub handle payments*', a: 'Not yet. The platform focuses on workflow + coordination. Premium can be activated via promo coupon without a card when eligible.' },
              { q: 'Are calls recorded*', a: 'Yes -- for documentation and compliance.' },
            ].map((item, idx) => (
              <MotionItem key={item.q} index={5 + idx}>
                <SpotlightCard
                  className={[
                    'rounded-xl p-6',
                    'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                    'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
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
              'dark:bg-[#18181b] dark:ring-1 dark:ring-white/10 dark:shadow-none',
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
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-(--gt-blue) px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(10,102,194,0.25)] transition hover:brightness-105 dark:shadow-none"
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


