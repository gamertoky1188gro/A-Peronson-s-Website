/*
  Route: /help
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Help Center documentation + admin FAQ management UI (if user has permissions).
    - Keep the existing 2-column layout: main content + sticky sidebar.
    - Provide a bento-grid navigation hub for quick jumping to sections.

  Key API endpoints:
    - GET /api/assistant/knowledge (FAQ list)
    - POST/DELETE endpoints for FAQ management (depending on existing server implementation)

  Major UI/UX patterns:
    - "Modern Industrialist" palette:
      light = slate-50 studio; dark = deep slate (#0B0F1A).
    - Glassmorphism cards, spotlight hover, staggered entry motion.
    - Role glows in dark mode (Buyer/Factory/Buying House).
    - Verified shimmer badge styling (trust indicator).

  Special:
    - FloatingAssistant switches to "Orb" styling only on this route.
*/
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { Check, ChevronDown, FileText, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
import SpotlightCard from '../components/ui/SpotlightCard'

const Motion = motion

const HELP_SECTIONS = [
  {
    id: 'quick-start',
    title: '1. Quick Start Guide',
    content: [
      'Step 1: Create an Account (Buyer, Factory, or Buying House).',
      'Step 2: Complete your basic profile setup (Organization Name, Category, Profile Image).',
      'Step 3: Explore the Main Feed or Search for relevant posts.',
      'Step 4: Start conversations or post Buyer Requests / Products.',
      'Step 5: Upgrade to Premium if advanced visibility and analytics are required.',
    ],
  },
  {
    id: 'account-types',
    title: '2. Account Types',
    subsections: [
      {
        name: 'Buyer Account',
        points: [
          'Post detailed Buyer Requests.',
          'Search and filter factories.',
          'Send direct messages.',
          'Schedule calls.',
        ],
      },
      {
        name: 'Factory Account',
        points: [
          'Upload product posts and videos.',
          'Respond to Buyer Requests.',
          'Accept connection requests from Buying Houses.',
          'Manage sub-accounts (Agents).',
        ],
      },
      {
        name: 'Buying House Account',
        points: [
          'Manage multiple agents.',
          'Connect with multiple factories.',
          'Assign Buyer Requests to specific agents.',
          'Monitor deals and analytics (Premium).',
        ],
      },
    ],
  },
  {
    id: 'verification',
    title: '3. Verification Process',
    description: 'Verification is document-based and requires backend approval.',
    roles: [
      {
        role: 'Factories must submit',
        docs: [
          'Company Registration',
          'Trade License',
          'TIN',
          'Authorized Person NID',
          'Company Bank Proof',
          'ERC (Export Registration Certificate)',
        ],
      },
      {
        role: 'Buying Houses must submit',
        docs: [
          'Company Registration',
          'Trade License',
          'TIN',
          'Authorized Person NID',
          'Company Bank Proof',
        ],
      },
      {
        role: 'International Buyers (EU / USA) must submit',
        docs: [
          'Business Registration',
          'VAT (EU) or EIN (USA)',
          'EORI (EU) or IOR (USA)',
          'Bank Proof',
        ],
      },
    ],
    footer:
      'Verification status is subscription-based and must be renewed monthly. The more verified documentation a company provides, the stronger its credibility.',
  },
  {
    id: 'messaging',
    title: '4. Messaging & Conversation Rules',
    sections: [
      { title: 'Verified Users', text: 'Messages go directly to inbox.' },
      { title: 'Unverified Users', text: 'Messages appear in "Message Requests."' },
      {
        title: 'Buying House Conversation Lock',
        points: [
          'When an Agent starts a conversation, it is assigned to that Agent.',
          'Other Agents cannot message unless permission is granted.',
          'This prevents internal conflict.',
        ],
      },
    ],
  },
  {
    id: 'subscriptions',
    title: '5. Subscription Plans',
    description: 'Two Plans Available: Free and Premium.',
    points: [
      'Increased profile visibility',
      'Advanced analytics (for eligible accounts)',
      'Extended management capabilities',
    ],
    footer: 'Feature visibility varies depending on account type.',
  },
  {
    id: 'calls',
    title: '6. Video & Audio Calls',
    points: [
      'Calls can be initiated directly from chat.',
      'Optional scheduling feature available.',
      'All calls may be recorded for security and compliance.',
      'Users are notified before recording begins.',
    ],
  },
  {
    id: 'contracts',
    title: '7. Contracts & Legal Vault',
    points: [
      'Digital contracts can be signed through the platform.',
      'PDF copies are stored securely in the Legal Vault.',
      'Both parties can access their contract history.',
    ],
    footer: 'GarTexHub does not process direct financial transactions.',
  },
  {
    id: 'security',
    title: '8. Security & Data Protection',
    points: [
      'Uploaded documents are securely stored.',
      'Verification requires backend approval.',
      'Expired licenses may remove verified status.',
      'Financial details are protected through encrypted systems.',
    ],
  },
  {
    id: 'assistant',
    title: '9. Floating AI Assistant',
    description: 'The Floating Assistant helps users with:',
    points: ['Understand settings', 'Navigate dashboards', 'Access help articles', 'Connect to support'],
    footer: 'It does not handle negotiations.',
  },
]

function MotionItem({ index, className='', children }) {
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

function Skeleton({ className='' }) {
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

function VerifiedBadge() {
  return (
    <span
      className={[
        'verified-shimmer inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        'bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.10)]',
        'dark:bg-emerald-500/12 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_24px_rgba(16,185,129,0.12)]',
      ].join(' ')}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_14px_rgba(5,150,105,0.55)] dark:bg-emerald-400 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
      Verified
    </span>
  )
}

function cardClassName({ glass = false } = {}) {
  return [
    'rounded-xl p-6',
    glass ? 'bg-white/70 backdrop-blur-md' : 'bg-[#ffffff]',
    'shadow-borderless dark:shadow-borderlessDark',
    'transition duration-300 ease-out will-change-transform',
    'hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]',
    'dark:bg-slate-900/40 dark:backdrop-blur-sm',
    'dark:ring-1 dark:ring-slate-800/60 dark:shadow-none',
    'dark:hover:translate-y-0 dark:hover:shadow-none dark:hover:ring-blue-500/35',
  ].join(' ')
}

function glowForAccount(name) {
  if (name.toLowerCase().includes('buyer')) {
    return 'dark:shadow-[0_0_0_1px_rgba(59,130,246,0.22),0_18px_60px_rgba(59,130,246,0.18)]'
  }
  if (name.toLowerCase().includes('factory')) {
    return 'dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_18px_60px_rgba(16,185,129,0.16)]'
  }
  return 'dark:shadow-[0_0_0_1px_rgba(99,102,241,0.22),0_18px_60px_rgba(99,102,241,0.18)]'
}

export default function HelpCenter() {
  const [q, setQ] = useState('')
  const [entries, setEntries] = useState([])
  const [feedback, setFeedback] = useState('')
  const [form, setForm] = useState({ question: '', answer: '', keywords: '' })
  const [editingId, setEditingId] = useState('')
  const [faqLoading, setFaqLoading] = useState(false)
  const [lockGranted, setLockGranted] = useState(false)

  const currentUser = useMemo(() => getCurrentUser(), [])
  const isOwnerAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin'
  const reduceMotion = useReducedMotion()

  const staticFaqs = [
    {
      q: 'Can I buy verification without documents*',
      a: 'No. Verification requires mandatory document submission and approval.',
    },
    {
      q: 'Can I create multiple sub-accounts*',
      a: 'Yes. Buying Houses and Factories can create limited sub-accounts under Free plans.',
    },
    { q: 'Does GarTexHub handle payments*', a: 'No. The platform facilitates communication and contracts only.' },
    { q: 'Can I increase my visibility*', a: 'Premium plans may provide improved reach.' },
  ]

  const loadFaqs = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) return
      setFaqLoading(true)
      const data = await apiRequest('/assistant/knowledge', { token })
      setEntries((data.entries || []).filter((entry) => (entry.type || 'faq') === 'faq'))
    } catch (err) {
      setFeedback(err.status === 403 ? 'Access denied' : err.message)
    } finally {
      setFaqLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isOwnerAdmin) return
    const timeoutId = setTimeout(() => {
      loadFaqs()
    }, 0)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [isOwnerAdmin, loadFaqs])

  function selectForEdit(entry) {
    setEditingId(entry.id)
    setForm({
      question: entry.question || '',
      answer: entry.answer || '',
      keywords: Array.isArray(entry.keywords) ? entry.keywords.join(', ') : '',
    })
  }

  function resetForm() {
    setEditingId('')
    setForm({ question: '', answer: '', keywords: '' })
  }

  async function saveFaq(e) {
    e.preventDefault()
    const token = getToken()
    if (!token) return
    const payload = {
      type: 'faq',
      question: form.question,
      answer: form.answer,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    }
    try {
      if (editingId) {
        await apiRequest(`/assistant/knowledge/${editingId}`, { method: 'PUT', token, body: payload })
      } else {
        await apiRequest('/assistant/knowledge', { method: 'POST', token, body: payload })
      }
      resetForm()
      loadFaqs()
      setFeedback('FAQ updated')
    } catch (err) {
      setFeedback(err.message)
    }
  }

  async function removeFaq(entryId) {
    const token = getToken()
    if (!token) return
    try {
      await apiRequest(`/assistant/knowledge/${entryId}`, { method: 'DELETE', token })
      loadFaqs()
    } catch (err) {
      setFeedback(err.message)
    }
  }

  const allFaqs = [...entries.map((e) => ({ q: e.question, a: e.answer, id: e.id })), ...staticFaqs]
  const filteredFaqs = allFaqs.filter(
    (f) => f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase()),
  )

  const hubTiles = [
    {
      id: 'quick-start',
      title: 'Quick Start Guide',
      desc: 'Fast setup for buyers, factories, and buying houses.',
      icon: Sparkles,
      span: 'lg:col-span-3',
    },
    {
      id: 'account-types',
      title: 'Account Types',
      desc: 'Clear roles, clear permissions.',
      icon: ShieldCheck,
      span: 'lg:col-span-3',
    },
    { id: 'faq', title: 'FAQ', desc: 'Searchable answers, no fluff.', icon: ChevronDown, span: 'lg:col-span-2' },
    { id: 'contracts', title: 'Legal Vault', desc: 'Contracts & audit-ready records.', icon: FileText, span: 'lg:col-span-2' },
    {
      id: 'verification',
      title: 'Verification',
      desc: 'Document-based trust indicators.',
      icon: ShieldCheck,
      span: 'lg:col-span-2',
    },
    { id: 'messaging', title: 'Messaging Lock', desc: 'Conflict-free team conversations.', icon: Lock, span: 'lg:col-span-2' },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0B0F1A] dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Industrial reliability, tech-forward SaaS guidance.</p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {hubTiles.map((tile, idx) => {
                const Icon = tile.icon
                return (
                  <MotionItem key={tile.id} index={idx} className={tile.span}>
                    <a href={`#${tile.id}`} className={[cardClassName({ glass: true }), 'group block h-full'].join(' ')}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">{tile.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{tile.desc}</p>
                        </div>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition group-hover:bg-blue-600/14 dark:bg-blue-500/12 dark:text-blue-400">
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                    </a>
                  </MotionItem>
                )
              })}
            </div>

            {HELP_SECTIONS.map((section, idx) => (
              <MotionItem key={section.id} index={hubTiles.length + idx}>
                <section id={section.id} className="scroll-mt-6">
                  <SpotlightCard className={cardClassName()}>
                    <div className="flex flex-wrap items-center justify-between gap-3 shadow-dividerB dark:shadow-dividerBDark pb-3">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{section.title}</h2>
                      {section.id === 'verification' ? <VerifiedBadge /> : null}
                    </div>

                    {section.description ? (
                      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
                    ) : null}

                    {section.content ? (
                      <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        {section.content.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">-</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {section.subsections ? (
                      <div className="mt-5 grid gap-4 lg:grid-cols-3">
                        {section.subsections.map((sub, subIndex) => (
                          <motion.div
                            key={sub.name}
                            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 + subIndex * 0.05 }}
                            className={[
                              'rounded-xl bg-slate-900/2 p-5 transition duration-300 ease-out',
                              'hover:-translate-y-0.5 hover:bg-slate-900/3 active:scale-[0.98]',
                              'dark:bg-white/5 dark:hover:bg-white/6 dark:hover:translate-y-0',
                              glowForAccount(sub.name),
                            ].join(' ')}
                          >
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{sub.name}</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                              {sub.points.map((p) => (
                                <li key={p} className="flex gap-2">
                                  <span className="mt-0.5 text-blue-600/90 dark:text-blue-400">-</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    ) : null}

                    {section.roles ? (
                      <div className="mt-5 space-y-5">
                        {section.roles.map((roleBlock) => (
                          <div key={roleBlock.role}>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{roleBlock.role}</p>
                            <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-slate-500 md:grid-cols-2 dark:text-slate-400">
                              {roleBlock.docs.map((d) => (
                                <li key={d} className="flex gap-2">
                                  <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">-</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {section.sections ? (
                      <div className="mt-5 space-y-4">
                        {section.sections.map((s) => (
                          <div key={s.title} className="rounded-xl bg-slate-900/2 p-5 dark:bg-white/5">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{s.title}</p>
                              {s.title.toLowerCase().includes('verified') ? <VerifiedBadge /> : null}
                            </div>
                            {s.text ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.text}</p> : null}
                            {s.points ? (
                              <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                {s.points.map((p) => (
                                  <li key={p} className="flex gap-2">
                                    <span className="mt-0.5 text-blue-600 dark:text-blue-400">-</span>
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : null}

                            {section.id === 'messaging' && s.title.toLowerCase().includes('lock') ? (
                              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/70 px-4 py-3 backdrop-blur-md shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/5 dark:shadow-none">
                                <div className="flex items-center gap-3">
                                  <AnimatePresence initial={false} mode="popLayout">
                                    {lockGranted ? (
                                      <motion.div
                                        key="unlocked"
                                        initial={reduceMotion ? false : { opacity: 0, x: 6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -6 }}
                                        transition={{ duration: 0.25 }}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-200"
                                      >
                                        <Check className="h-5 w-5" />
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        key="locked"
                                        initial={reduceMotion ? false : { opacity: 0, x: 6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -6 }}
                                        transition={{ duration: 0.25 }}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/6 text-slate-700 dark:bg-white/6 dark:text-slate-200"
                                      >
                                        <Lock className="h-5 w-5" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Lock demo</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {lockGranted ? 'Permission granted -- teammates can message.' : 'Locked -- teammates need permission.'}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setLockGranted((v) => !v)}
                                  className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400"
                                >
                                  {lockGranted ? 'Reset' : 'Grant permission'}
                                </button>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {section.points && !section.subsections && !section.sections ? (
                      <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        {section.points.map((p) => (
                          <li key={p} className="flex gap-2">
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">-</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {section.footer ? (
                      <p className="mt-5 shadow-dividerT dark:shadow-dividerTDark pt-3 text-xs italic text-slate-500 dark:text-slate-400">
                        {section.footer}
                      </p>
                    ) : null}
                  </SpotlightCard>
                </section>
              </MotionItem>
            ))}

            <MotionItem index={hubTiles.length + HELP_SECTIONS.length}>
              <section id="faq" className="scroll-mt-6">
                <SpotlightCard className={cardClassName()}>
                  <div className="flex flex-wrap items-center justify-between gap-3 shadow-dividerB dark:shadow-dividerBDark pb-3">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      10. Frequently Asked Questions (FAQ)
                    </h2>
                    <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                      Searchable
                    </span>
                  </div>

                  <div className="mt-4">
                    <input
                      placeholder="Search FAQs..."
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    {faqLoading ? (
                      <>
                        <Skeleton className="h-16 rounded-xl" />
                        <Skeleton className="h-16 rounded-xl" />
                        <Skeleton className="h-16 rounded-xl" />
                      </>
                    ) : (
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key="faq"
                          initial={reduceMotion ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3"
                        >
                          {filteredFaqs.map((f) => (
                            <details
                              key={f.id || f.q}
                              className="group rounded-xl bg-slate-900/2 p-4 transition-colors hover:bg-slate-900/3 dark:bg-white/5 dark:hover:bg-white/6"
                            >
                              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                <span className="min-w-0 truncate">Q: {f.q}</span>
                                <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400" />
                              </summary>
                              <p className="mt-3 pl-4 text-sm text-slate-500 dark:text-slate-400 shadow-borderless dark:shadow-borderlessDark">
                                A: {f.a}
                              </p>
                            </details>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                </SpotlightCard>
              </section>
            </MotionItem>

            {isOwnerAdmin ? (
              <MotionItem index={hubTiles.length + HELP_SECTIONS.length + 1}>
                <section className="scroll-mt-6">
                  <SpotlightCard className={cardClassName({ glass: true })}>
                    <div className="flex flex-wrap items-center justify-between gap-3 shadow-dividerB dark:shadow-dividerBDark pb-3">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Admin: Manage Knowledge Base FAQ
                      </h2>
                      <span className="rounded-full bg-blue-600/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700 dark:bg-blue-500/12 dark:text-blue-200">
                        Owner/Admin
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <form onSubmit={saveFaq} className="space-y-3">
                        <input
                          placeholder="Question"
                          value={form.question}
                          onChange={(e) => setForm({ ...form, question: e.target.value })}
                          className="w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                          required
                        />
                        <textarea
                          placeholder="Answer"
                          value={form.answer}
                          onChange={(e) => setForm({ ...form, answer: e.target.value })}
                          className="min-h-28 w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                          required
                        />
                        <input
                          placeholder="Keywords (comma separated)"
                          value={form.keywords}
                          onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                          className="w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400"
                          >
                            {editingId ? 'Update' : 'Add'} FAQ
                          </button>
                          {editingId ? (
                            <button
                              type="button"
                              onClick={resetForm}
                              className="rounded-full bg-slate-900/4 px-5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-900/6 active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/8"
                            >
                              Cancel
                            </button>
                          ) : null}
                        </div>
                        {feedback ? <p className="text-xs text-slate-500 dark:text-slate-400">{feedback}</p> : null}
                      </form>

                      <div className="max-h-72 space-y-2 overflow-y-auto pr-2">
                        {faqLoading ? (
                          <>
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
                          </>
                        ) : (
                          entries.map((e) => (
                            <div
                              key={e.id}
                              className="rounded-xl bg-[#ffffff] p-3 text-xs shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/5 dark:shadow-none"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{e.question}</p>
                                  <p className="mt-1 truncate text-slate-500 dark:text-slate-400">{e.answer}</p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                  <button onClick={() => selectForEdit(e)} className="text-blue-600 hover:underline dark:text-blue-400">
                                    Edit
                                  </button>
                                  <button onClick={() => removeFaq(e.id)} className="text-rose-600 hover:underline dark:text-rose-300">
                                    Del
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                </section>
              </MotionItem>
            ) : null}

            <MotionItem index={hubTiles.length + HELP_SECTIONS.length + 2}>
              <section className="scroll-mt-6">
                <SpotlightCard className={cardClassName({ glass: true })}>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Support</h2>
                    <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                      Response varies
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    If your issue is not resolved, use the Floating Assistant, submit a support ticket, or contact the GarTexHub Support Team.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400">
                      Open support ticket
                    </button>
                    <button className="rounded-full bg-[#ffffff] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/8">
                      Live chat
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                    Tip: On <span className="font-semibold">/help</span>, the assistant uses an “Orb” style to indicate ready-to-help status.
                  </p>
                </SpotlightCard>
              </section>
            </MotionItem>
          </div>

          <div className="space-y-6">
            <div className="sticky top-8 space-y-6">
              <SpotlightCard className={cardClassName({ glass: true })}>
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Search</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Search FAQ answers instantly.</p>
                <div className="mt-4">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search users, terms, workflows..."
                    className="w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['verification', 'contracts', 'messages', 'premium', 'sub-accounts'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setQ(chip)}
                      className="rounded-full bg-slate-900/4 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-900/6 active:scale-[0.98] dark:bg-white/6 dark:text-slate-300 dark:hover:bg-white/8"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </SpotlightCard>

              <SpotlightCard className={cardClassName({ glass: true })}>
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Quick navigation</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[...HELP_SECTIONS.map((s) => ({ id: s.id, label: s.title })), { id: 'faq', label: '10. FAQ' }].map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="rounded-full bg-blue-600/10 px-3 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-600/14 active:scale-[0.98] dark:bg-blue-500/12 dark:text-blue-200 dark:hover:bg-blue-500/18"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </SpotlightCard>

              <SpotlightCard className={cardClassName({ glass: true })}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Floating Assistant</h3>
                  <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                    Orb mode
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  On this page, the assistant uses a glass “Orb” with a rotating ring in dark mode to signal it’s ready to help.
                </p>
                <div className="mt-4 rounded-xl bg-slate-900/2 p-4 dark:bg-white/5">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">What it can do</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Setup, navigation, support articles -- it does not negotiate.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

