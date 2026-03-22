/*
  Route: /buyer/:id
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Render the Buyer profile (overview + requests).
    - Show trust indicators (verification summary, credibility meter, verified badge).
    - Provide relationship actions (follow/connect/message).

  Key API endpoints:
    - GET /api/profiles/:id
    - GET /api/ratings/profiles/user::id (public ratings summary)
    - GET /api/profiles/:id/requests?cursor=...

  Major UI/UX patterns:
    - Industrial-tech surfaces: white cards + subtle borders (light), ringed slate cards (dark).
    - layoutId animated tab indicator.
    - Tactile CTA feedback (active:scale-95).
*/
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
import { trackClientEvent } from '../lib/events'
import VerificationPanel from '../components/profile/VerificationPanel'

const Motion = motion

function roleToRoute(role, id) {
  // Safety: if a user opens a profile id that is not a buyer, redirect to the correct role route.
  if (!id) return '/feed'
  if (role === 'buyer') return `/buyer/${encodeURIComponent(id)}`
  if (role === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
  return `/factory/${encodeURIComponent(id)}`
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

export default function BuyerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useMemo(() => getToken(), [])
  const currentUser = useMemo(() => getCurrentUser(), [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [ratingSummary, setRatingSummary] = useState(null)

  const [activeTab, setActiveTab] = useState('overview')
  const [requests, setRequests] = useState([])
  const [requestsCursor, setRequestsCursor] = useState(0)
  const [requestsNext, setRequestsNext] = useState(null)
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [profileBoost, setProfileBoost] = useState(null)
  const reduceMotion = useReducedMotion()

  const user = profile?.user || null
  const verification = profile?.verification_summary || null
  const relationship = profile?.relationship || { following: false, friend_status: 'none' }
  const viewerPerms = profile?.viewer_permissions || { is_self: false, is_admin: false }
  const isBoosted = Boolean(profileBoost)
  const isPremium = String(user?.subscription_status || '').toLowerCase() === 'premium'

  const loadProfile = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest(`/profiles/${encodeURIComponent(id)}`, { token })
      if (data?.user?.role && data.user.role !== 'buyer') {
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

  const loadRequests = useCallback(async ({ reset }) => {
    if (!id) return
    const cursor = reset ? 0 : requestsCursor
    setLoadingRequests(true)
    try {
      const data = await apiRequest(`/profiles/${encodeURIComponent(id)}/requests?cursor=${cursor}&limit=10`, { token })
      const rows = Array.isArray(data?.items) ? data.items : []
      setRequests((prev) => (reset ? rows : [...prev, ...rows]))
      setRequestsCursor(reset ? 10 : cursor + 10)
      setRequestsNext(data?.next_cursor ?? null)
    } catch {
      // keep current list
    } finally {
      setLoadingRequests(false)
    }
  }, [id, requestsCursor, token])

  useEffect(() => {
    loadProfile()
    loadRatings()
  }, [loadProfile, loadRatings])

  useEffect(() => {
    if (!user?.id) return
    trackClientEvent('profile_view', {
      entityType: 'profile',
      entityId: user.id,
      metadata: { role: user.role || 'buyer' },
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
    if (activeTab !== 'requests') return
    if (requests.length) return
    loadRequests({ reset: true })
  }, [activeTab, loadRequests, requests.length])

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
    navigate('/chat', { state: { notice: `Contacting ${user?.name || 'buyer'}. If you are unverified, your first message may appear as a request.` } })
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Loading profile...</div>
  }
  if (error) {
    return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">{error}</div>
  }
  if (!user) {
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>
  }

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
              {user.profile?.profile_image ? (
                <img src={user.profile.profile_image} alt={user.name} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              )}
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="uppercase">Buyer</span>
                  {user.profile?.country ? <span>- {user.profile.country}</span> : null}
                  {user.verified ? (
                    <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                      Verified
                    </span>
                  ) : null}
                  {isPremium ? (
                    <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-500/20 dark:text-blue-200">
                      Premium Reach
                    </span>
                  ) : null}
                  {isBoosted ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-200">
                      Boosted
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={contact} className="flex-1 rounded-full bg-[var(--gt-blue)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
              <button onClick={connect} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Industry</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.industry || 'Garments & Textile'}</p>
              </div>
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Organization</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
              </div>
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/60 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Requests</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
                <p className="text-[11px] text-slate-600">Total posted</p>
              </div>
              <div className="rounded-xl bg-white/60 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Joined</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.created_at ? new Date(user.created_at).getFullYear() : '--'}</p>
                <p className="text-[11px] text-slate-600">Year</p>
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
              {['overview', 'requests', 'reviews'].map((tab) => (
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
                  {tab === 'overview' ? 'Overview' : tab === 'requests' ? 'Buyer Requests' : 'Reviews'}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Certifications</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Since</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.active_since || new Date().getFullYear()}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Buyer</p>
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

              {activeTab === 'requests' ? (
                <div className="space-y-3">
                  {viewerPerms.is_self || viewerPerms.is_admin ? (
                    <>
                      {requests.map((r) => (
                        <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:bg-slate-900/50 dark:border-slate-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{r.category || 'Request'}</p>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{r.custom_description || ''}</p>
                              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 grid grid-cols-2 gap-2">
                                <div>Quantity: <span className="font-semibold text-slate-800 dark:text-slate-200">{r.quantity || '-'}</span></div>
                                <div>Timeline: <span className="font-semibold text-slate-800 dark:text-slate-200">{r.timeline_days || '-'} days</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-200">{r.material || '-'}</span></div>
                                <div>Status: <span className="font-semibold text-slate-800 dark:text-slate-200">{r.status || '-'}</span></div>
                              </div>
                            </div>
                            <div className="shrink-0">
                              <button onClick={contact} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] transition">Contact</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {loadingRequests ? <div className="text-sm text-slate-600 dark:text-slate-300">Loading...</div> : null}
                      {requestsNext !== null && !loadingRequests ? (
                        <button
                          type="button"
                          onClick={() => loadRequests({ reset: false })}
                          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
                        >
                          Load more
                        </button>
                      ) : null}
                      {!requests.length && !loadingRequests ? <div className="text-sm text-slate-600 dark:text-slate-300">No requests found.</div> : null}
                    </>
                  ) : (
                    <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                      <p className="font-semibold">Request details are private</p>
                      <p className="mt-2">Only the buyer can view detailed request information to protect business privacy.</p>
                      <p className="mt-3 text-xs">Total requests posted: <span className="font-bold">{profile?.counts?.requests || 0}</span></p>
                    </div>
                  )}
                </div>
              ) : null}

              {activeTab === 'reviews' ? (
                <div className="space-y-3">
                  <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 - {ratingSummary?.aggregate?.total_count ?? 0} reviews - {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
                  </div>
                  <div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800 ring-1 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/30">
                    <p className="font-semibold">Review Policy</p>
                    <p className="mt-1">Reviews can only be edited or deleted by the person who wrote them. Profile owners cannot delete reviews to maintain transparency and trust.</p>
                  </div>
                  {(ratingSummary?.recent_reviews || []).map((r) => {
                    const canEdit = currentUser?.id && String(currentUser.id) === String(r.from_user_id || '')
                    return (
                      <div key={r.id} className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.score}* -- {r.reviewer_name || 'Anonymous'}</p>
                            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{r.comment || 'No comment provided.'}</p>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</p>
                          </div>
                          {canEdit ? (
                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                                onClick={async () => {
                                  const score = window.prompt('Update rating (1-5)', String(r.score || '5'))
                                  if (!score) return
                                  const comment = window.prompt('Update review comment', r.comment || '')
                                  try {
                                    await apiRequest(`/ratings/${r.id}`, { method: 'PATCH', token, body: { score: Number(score), comment: comment ?? '' } })
                                    await loadRatings()
                                  } catch {
                                    // ignore
                                  }
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                                onClick={async () => {
                                  if (!window.confirm('Delete this review?')) return
                                  try {
                                    await apiRequest(`/ratings/${r.id}`, { method: 'DELETE', token })
                                    await loadRatings()
                                  } catch {
                                    // ignore
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                  {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600 dark:text-slate-300">No reviews yet.</div> : null}
                </div>
              ) : null}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

