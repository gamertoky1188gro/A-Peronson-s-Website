/*
  Route: /factory/:id
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Render the Factory profile (overview + products + requests as applicable).
    - Highlight verification/trust and show credibility meter (VerificationPanel).
    - Provide relationship actions (follow/connect/message) depending on backend support.

  Key API endpoints:
    - GET /api/profiles/:id
    - GET /api/profiles/:id/products?cursor=...
    - GET /api/ratings/profiles/user::id (public ratings summary)
*/
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { apiRequest, getToken } from '../lib/auth'
import { trackClientEvent } from '../lib/events'
import VerificationPanel from '../components/profile/VerificationPanel'

const Motion = motion

function roleToRoute(role, id) {
  // Safety redirect helper: ensures we land on the correct profile route for a given role.
  if (!id) return '/feed'
  if (role === 'buyer') return `/buyer/${encodeURIComponent(id)}`
  if (role === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
  return `/factory/${encodeURIComponent(id)}`
}

function isApprovedVideo(product) {
  return Boolean(product?.video_url) && String(product?.video_review_status || '').toLowerCase() === 'approved' && !product?.video_restricted
}

function isBoostActive(boost) {
  if (!boost) return false
  if (String(boost.status || '').toLowerCase() !== 'active') return false
  const now = Date.now()
  const startsAt = new Date(boost.starts_at).getTime()
  const endsAt = new Date(boost.ends_at).getTime()
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false
  return now >= startsAt && now <= endsAt
}

export default function FactoryProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useMemo(() => getToken(), [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [ratingSummary, setRatingSummary] = useState(null)

  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState([])
  const [productsCursor, setProductsCursor] = useState(0)
  const [productsNext, setProductsNext] = useState(null)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [profileBoost, setProfileBoost] = useState(null)
  const reduceMotion = useReducedMotion()

  const user = profile?.user || null
  const verification = profile?.verification_summary || null
  const relationship = profile?.relationship || { following: false, friend_status: 'none' }
  const viewerPerms = profile?.viewer_permissions || { is_self: false, is_admin: false }

  const loadProfile = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest(`/profiles/${encodeURIComponent(id)}`, { token })
      if (data?.user?.role && data.user.role !== 'factory') {
        navigate(roleToRoute(data.user.role, id), { replace: true })
        return
      }
      setProfile(data)
    } catch (err) {
      setError(err.message || 'Failed to load profile')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [id, navigate, token])

  const loadRatings = useCallback(async () => {
    if (!id) return
    try {
      const data = await apiRequest(`/ratings/profiles/user:${encodeURIComponent(id)}`, { token: '' })
      setRatingSummary(data || null)
    } catch {
      setRatingSummary(null)
    }
  }, [id])

  const loadProducts = useCallback(async ({ reset }) => {
    if (!id) return
    const cursor = reset ? 0 : productsCursor
    setLoadingProducts(true)
    try {
      const data = await apiRequest(`/profiles/${encodeURIComponent(id)}/products?cursor=${cursor}&limit=10`, { token })
      const rows = Array.isArray(data?.items) ? data.items : []
      setProducts((prev) => (reset ? rows : [...prev, ...rows]))
      setProductsCursor(reset ? 10 : cursor + 10)
      setProductsNext(data?.next_cursor ?? null)
    } catch {
      // ignore
    } finally {
      setLoadingProducts(false)
    }
  }, [id, productsCursor, token])

  useEffect(() => {
    loadProfile()
    loadRatings()
  }, [loadProfile, loadRatings])

  useEffect(() => {
    if (!user?.id) return
    trackClientEvent('profile_view', {
      entityType: 'profile',
      entityId: user.id,
      metadata: { role: user.role || 'factory' },
    })
  }, [user?.id, user?.role])

  useEffect(() => {
    if (!viewerPerms.is_self) return
    const tokenValue = getToken()
    if (!tokenValue) return
    apiRequest('/boosts/me', { token: tokenValue })
      .then((data) => {
        const active = (data?.items || []).find((boost) => boost.scope === 'profile' && isBoostActive(boost))
        setProfileBoost(active || null)
      })
      .catch(() => setProfileBoost(null))
  }, [viewerPerms.is_self])

  useEffect(() => {
    if (!['products', 'videos'].includes(activeTab)) return
    if (products.length) return
    loadProducts({ reset: true })
  }, [activeTab, loadProducts, products.length])

  async function follow() {
    if (!id) return
    try {
      const res = await apiRequest(`/users/${encodeURIComponent(id)}/follow`, { method: 'POST', token })
      setProfile((prev) => (prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev))
    } catch {
      // ignore
    }
  }

  async function connect() {
    if (!id) return
    try {
      const res = await apiRequest(`/users/${encodeURIComponent(id)}/friend-request`, { method: 'POST', token })
      setProfile((prev) => (prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev))
    } catch {
      // ignore
    }
  }

  function contact() {
    navigate('/chat', { state: { notice: `Contacting ${user?.name || 'factory'}. If you are unverified, your first message may appear as a request.` } })
  }

  const visibleVideos = useMemo(() => {
    if (viewerPerms.is_self || viewerPerms.is_admin) return products.filter((p) => p.video_url)
    return products.filter(isApprovedVideo)
  }, [products, viewerPerms.is_admin, viewerPerms.is_self])
  const isBoosted = Boolean(profileBoost)

  if (loading) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Loading profile...</div>
  if (error) return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">{error}</div>
  if (!user) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="uppercase">Factory</span>
                  {user.profile?.country ? <span>- {user.profile.country}</span> : null}
                  {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
                  {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
              <button onClick={connect} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Capacity</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.monthly_capacity || '--'}</p>
                <p className="text-[11px] text-slate-600">Monthly</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">MOQ</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.moq || '--'}</p>
                <p className="text-[11px] text-slate-600">Declared</p>
              </div>
            </div>
          </motion.div>

          <VerificationPanel summary={verification} />
        </aside>

        <main className="col-span-12 lg:col-span-8 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {['overview', 'products', 'videos', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative rounded-full px-3 py-2 text-xs font-semibold transition ring-1 active:scale-95 ${
                    activeTab === tab
                      ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
                      : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
                  }`}
                >
                  {activeTab === tab ? (
                    <motion.span
                      layoutId="profile-tab"
                      className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  {tab === 'overview' ? 'Overview' : tab === 'products' ? 'Products' : tab === 'videos' ? 'Video Gallery' : 'Reviews'}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === 'overview' ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Industry</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.industry || 'Garments & Textile'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lead time</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.lead_time_days || '--'} days</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Certifications</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Capacity</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.production_capacity || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Employees</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.employee_count || '--'}</p>
                    </div>
                  </div>

                  {(user.profile?.companies_worked_with || []).length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Companies Worked With</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(user.profile?.companies_worked_with || []).map((company, idx) => (
                          <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                            {company.logo ? (
                              <img src={company.logo} alt={company.name} className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{company.name}</p>
                              {company.location && <p className="text-xs text-slate-500 dark:text-slate-400">{company.location}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {activeTab === 'products' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        {p.cover_image_public_url ? (
                          <img src={p.cover_image_public_url} alt={p.title || 'Product'} className="h-32 w-full rounded-xl object-cover mb-3" />
                        ) : null}
                        <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
                        <p className="mt-1 text-xs text-slate-600">{p.category || '--'} - MOQ {p.moq || '--'} - Lead time {p.lead_time_days || '--'}</p>
                        <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                        <p className="mt-2 text-[11px] text-slate-500">Status: {String(p.status || 'published')}</p>
                        {p.hasVideo ? <p className="mt-2 text-xs font-semibold text-indigo-700">Video available</p> : null}
                      </div>
                    ))}
                  </div>
                  {loadingProducts ? <div className="text-sm text-slate-600">Loading...</div> : null}
                  {productsNext !== null && !loadingProducts ? (
                    <button
                      type="button"
                      onClick={() => loadProducts({ reset: false })}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Load more
                    </button>
                  ) : null}
                  {!products.length && !loadingProducts ? <div className="text-sm text-slate-600">No products found.</div> : null}
                </div>
              ) : null}

              {activeTab === 'videos' ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-700">
                    Only approved media is public. Pending or restricted media remains hidden unless you are the profile owner or an admin.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {visibleVideos.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-bold text-slate-900">{p.title || 'Video'}</p>
                        <p className="mt-1 text-xs text-slate-600">Status: {String(p.video_review_status || '--').replaceAll('_', ' ')}</p>
                        <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                        {p.video_url ? (
                          <a href={p.video_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-[#0A66C2] hover:underline">
                            Open video link
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {!visibleVideos.length && !loadingProducts ? <div className="text-sm text-slate-600">No public videos available.</div> : null}
                </div>
              ) : null}

              {activeTab === 'reviews' ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-bold text-slate-900">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 - {ratingSummary?.aggregate?.total_count ?? 0} reviews - {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
                  </div>
                  {(ratingSummary?.recent_reviews || []).map((r) => (
                    <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-900">{r.score}*</p>
                      <p className="mt-1 text-sm text-slate-700">{r.comment || 'No comment provided.'}</p>
                    </div>
                  ))}
                  {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600">No reviews yet.</div> : null}
                </div>
              ) : null}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

