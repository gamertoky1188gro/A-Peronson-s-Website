import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { apiRequest, getToken } from '../lib/auth'
import VerificationPanel from '../components/profile/VerificationPanel'

function roleToRoute(role, id) {
  if (!id) return '/feed'
  if (role === 'buyer') return `/buyer/${encodeURIComponent(id)}`
  if (role === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
  return `/factory/${encodeURIComponent(id)}`
}

export default function BuyerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useMemo(() => getToken(), [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [ratingSummary, setRatingSummary] = useState(null)

  const [activeTab, setActiveTab] = useState('overview')
  const [requests, setRequests] = useState([])
  const [requestsCursor, setRequestsCursor] = useState(0)
  const [requestsNext, setRequestsNext] = useState(null)
  const [loadingRequests, setLoadingRequests] = useState(false)
  const reduceMotion = useReducedMotion()

  const user = profile?.user || null
  const verification = profile?.verification_summary || null
  const relationship = profile?.relationship || { following: false, friend_status: 'none' }

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
  }, [id, token])

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
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Loading profile…</div>
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
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="uppercase">Buyer</span>
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
                  {user.verified ? (
                    <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                      Verified
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={contact} className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
              <button onClick={connect} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Requests</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
                <p className="text-[11px] text-slate-600">Total posted</p>
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
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Certifications (declared)</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '—'}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === 'requests' ? (
                <div className="space-y-3">
                  {requests.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{r.category || 'Request'}</p>
                          <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{r.custom_description || ''}</p>
                          <div className="mt-2 text-xs text-slate-600 grid grid-cols-2 gap-2">
                            <div>Quantity: <span className="font-semibold text-slate-800">{r.quantity || '-'}</span></div>
                            <div>Timeline: <span className="font-semibold text-slate-800">{r.timeline_days || '-'}</span></div>
                            <div>Material: <span className="font-semibold text-slate-800">{r.material || '-'}</span></div>
                            <div>Status: <span className="font-semibold text-slate-800">{r.status || '-'}</span></div>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <button onClick={contact} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loadingRequests ? <div className="text-sm text-slate-600 dark:text-slate-300">Loading…</div> : null}
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
                </div>
              ) : null}

              {activeTab === 'reviews' ? (
                <div className="space-y-3">
                  <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 • {ratingSummary?.aggregate?.total_count ?? 0} reviews • {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
                  </div>
                  {(ratingSummary?.recent_reviews || []).map((r) => (
                    <div key={r.id} className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.score}★</p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{r.comment || 'No comment provided.'}</p>
                    </div>
                  ))}
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
