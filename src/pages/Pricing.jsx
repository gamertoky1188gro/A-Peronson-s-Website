import React, { useEffect, useMemo, useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { apiRequest } from '../lib/auth'
import MagneticButton from '../components/ui/MagneticButton'
import SpotlightCard from '../components/ui/SpotlightCard'

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

function accentClasses(accent) {
  if (accent === 'teal') return 'text-[#2dd4bf]'
  if (accent === 'gold') return 'text-[#f59e0b]'
  return 'text-[#3b82f6]'
}

export default function Pricing() {
  const showDevControls = import.meta.env.DEV
  const [pricing, setPricing] = useState(defaultPricing)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [accountType, setAccountType] = useState('General')
  const [remainingDays, setRemainingDays] = useState(12)

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

  const features = useMemo(() => ({
    notLoggedIn: {
      Free: [
        'Basic dashboard access',
        'Partner network access',
        'Claim buyer requests',
        'Chat & call access',
        'Contract Vault (basic)',
        'Limited sub-accounts',
      ],
      Premium: [
        'Dedicated analytics',
        'Exportable reports',
        'Advanced insights',
        'Priority messaging',
        'Extended Contract Vault',
        'Unlimited sub-accounts',
        'Increased account reach',
      ],
    },
    loggedIn: {
      General: {
        Free: [
          'Basic dashboard access',
          'Partner network access',
          'Claim buyer requests',
          'Chat & call access',
          'Contract Vault (basic)',
          'Sub-accounts: limit 10',
        ],
        Premium: [
          'Dedicated analytics',
          'Exportable reports',
          'Advanced insights',
          'Priority messaging inbox',
          'Extended Contract Vault',
          'Unlimited sub-accounts',
          'Increased account reach',
        ],
      },
      Factory: {
        Free: [
          'Product management',
          'Video gallery',
          'Partner network requests',
          'Chat & call access',
          'Contract Vault (basic)',
          'Multiple account IDs: supported',
          'Sub-accounts: limit 10',
        ],
        Premium: [
          'Full product & order management',
          'Video & media showcase',
          'AI assistance for requests',
          'Exportable reports',
          'Extended Contract Vault',
          'Multiple account IDs: unlimited',
          'Unlimited sub-accounts',
          'Increased account reach',
        ],
      },
    },
  }), [])

  const effectiveLoggedIn = showDevControls ? isLoggedIn : false
  const accountTypes = effectiveLoggedIn ? ['General', 'Factory'] : []
  const freeFeatures = effectiveLoggedIn ? features.loggedIn[accountType].Free : features.notLoggedIn.Free
  const premiumFeatures = effectiveLoggedIn ? features.loggedIn[accountType].Premium : features.notLoggedIn.Premium

  const verificationStatus = showDevControls
    ? (remainingDays <= 0 ? 'expired' : remainingDays <= 7 ? 'expiring_soon' : 'verified_active')
    : 'verified_active'

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

  const tableRows = [
    { label: 'Dedicated analytics page', free: false, premium: true },
    { label: 'Exportable reports', free: false, premium: true },
    { label: 'Priority inbox', free: false, premium: true },
    { label: 'Unlimited sub-accounts', free: false, premium: true },
    { label: 'Contract Vault storage', free: 'Basic', premium: 'Extended' },
    { label: 'Order completion certification', free: false, premium: true },
    { label: 'Search filtering priority', free: 'Standard', premium: 'Advanced' },
    { label: 'Support level', free: 'Standard', premium: 'Dedicated' },
  ]

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
              Borderless surfaces, verified signals, and export-ready reporting — built for buying houses and factories.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton
                to="/signup"
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none"
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
                <p className="mt-3 text-xs text-[#a1a1aa]">Analytics unavailable — showing defaults.</p>
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
              Choose the surface you need today — upgrade when your team scales.
            </p>
          </div>

          {showDevControls ? (
            <div className="mx-auto mt-8 max-w-3xl rounded-xl bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">Preview:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoggedIn((v) => !v)
                      setAccountType('General')
                    }}
                    className="rounded-md bg-[#ffffff] px-3 py-2 text-xs font-semibold text-[#09090b] shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 dark:bg-[#18181b] dark:text-[#fafafa] dark:shadow-none"
                  >
                    {effectiveLoggedIn ? 'Sign out' : 'Mock sign in'}
                  </button>
                </div>

                {effectiveLoggedIn && accountTypes.length ? (
                  <div className="flex flex-wrap gap-2">
                    {accountTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAccountType(t)}
                        className={[
                          'rounded-md px-3 py-2 text-xs font-semibold transition',
                          accountType === t
                            ? 'bg-[#3b82f6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)]'
                            : 'bg-[#ffffff] text-[#09090b] shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:bg-[#18181b] dark:text-[#fafafa] dark:shadow-none',
                        ].join(' ')}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusChip[verificationStatus]].join(' ')}>
                  {statusLabel[verificationStatus]}
                </span>
                <span className="text-xs text-[#52525b] dark:text-[#a1a1aa]">Remaining: {Math.max(0, remainingDays)} day(s)</span>
                <button
                  type="button"
                  onClick={() => setRemainingDays((d) => d - 1)}
                  className="rounded-md bg-[rgba(9,9,11,0.06)] px-3 py-2 text-xs font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
                >
                  -1 day
                </button>
                <button
                  type="button"
                  onClick={() => setRemainingDays((d) => d + 1)}
                  className="rounded-md bg-[rgba(9,9,11,0.06)] px-3 py-2 text-xs font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
                >
                  +1 day
                </button>
              </div>
            </div>
          ) : null}

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
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-[#3b82f6]">
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
              { q: 'Can I upgrade anytime?', a: 'Yes — your data stays intact.' },
              { q: 'Can I downgrade?', a: 'Yes — plan limits apply immediately.' },
              { q: 'Does GarTexHub handle payments?', a: 'Not yet. The platform focuses on workflow + coordination.' },
              { q: 'Are calls recorded?', a: 'Yes — for documentation and compliance.' },
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
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none"
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

