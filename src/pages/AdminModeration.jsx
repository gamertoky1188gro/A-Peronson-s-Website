/*
  Route: /admin/moderation
  Access: Protected
  Allowed roles: owner, admin

  Purpose (project.md):
    - Provide a simple, human-review pipeline for reports and video moderation flags.
    - Keep this MVP lightweight: approve/reject videos, and resolve user reports.

  Key API:
    - GET /api/admin/videos/pending
    - POST /api/admin/videos/:id/approve
    - POST /api/admin/videos/:id/reject
    - GET /api/admin/reports
    - POST /api/admin/reports/:id/resolve
*/
import React, { useCallback, useEffect, useState } from 'react'
import { apiRequest, getToken } from '../lib/auth'

export default function AdminModeration() {
  const [tab, setTab] = useState('videos')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videos, setVideos] = useState([])
  const [reports, setReports] = useState([])
  const [verifications, setVerifications] = useState([])
  const [mediaQueue, setMediaQueue] = useState([])

  const load = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const [v, r, q, m] = await Promise.all([
        apiRequest('/admin/videos/pending', { token }),
        apiRequest('/admin/reports', { token }),
        apiRequest('/verification/admin/queue', { token }),
        apiRequest('/admin/media/pending', { token }),
      ])
      setVideos(Array.isArray(v?.items) ? v.items : [])
      setReports(Array.isArray(r?.items) ? r.items : [])
      setVerifications(Array.isArray(q?.items) ? q.items : [])
      setMediaQueue(Array.isArray(m?.items) ? m.items : [])
    } catch (err) {
      setError(err.message || 'Unable to load moderation queue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function approveVideo(id) {
    const token = getToken()
    if (!token) return
    await apiRequest(`/admin/videos/${encodeURIComponent(id)}/approve`, { method: 'POST', token })
    await load()
  }

  async function rejectVideo(id) {
    const token = getToken()
    if (!token) return
    const reason = window.prompt('Reject reason (shown to uploader)', 'Contains restricted content') || ''
    await apiRequest(`/admin/videos/${encodeURIComponent(id)}/reject`, { method: 'POST', token, body: { reason } })
    await load()
  }

  async function approveMedia(id) {
    const token = getToken()
    if (!token) return
    await apiRequest(`/admin/media/${encodeURIComponent(id)}/approve`, { method: 'POST', token })
    await load()
  }

  async function rejectMedia(id) {
    const token = getToken()
    if (!token) return
    const reason = window.prompt('Reject reason (shown to uploader)', 'Restricted content') || ''
    await apiRequest(`/admin/media/${encodeURIComponent(id)}/reject`, { method: 'POST', token, body: { reason } })
    await load()
  }

  async function resolve(id) {
    const token = getToken()
    if (!token) return
    const action = window.prompt('Resolution action', 'reviewed') || 'reviewed'
    const note = window.prompt('Moderator note (optional)', '') || ''
    await apiRequest(`/admin/reports/${encodeURIComponent(id)}/resolve`, { method: 'POST', token, body: { action, note } })
    await load()
  }

  async function approveVerification(userId) {
    const token = getToken()
    if (!token) return
    await apiRequest(`/verification/admin/${encodeURIComponent(userId)}/approve`, { method: 'POST', token })
    await load()
  }

  async function rejectVerification(userId) {
    const token = getToken()
    if (!token) return
    const reason = window.prompt('Reject reason (shown to user)', 'missing_required_documents') || ''
    await apiRequest(`/verification/admin/${encodeURIComponent(userId)}/reject`, { method: 'POST', token, body: { reason } })
    await load()
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 transition-colors duration-500 ease-in-out dark:bg-[#020617] dark:text-slate-100">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Moderation Center</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Review pending videos and user reports (MVP).</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('videos')} className={`rounded-full px-4 py-2 text-xs font-semibold ${tab === 'videos' ? 'bg-[var(--gt-blue)] text-white' : 'bg-white ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800'}`}>Videos</button>
            <button onClick={() => setTab('media')} className={`rounded-full px-4 py-2 text-xs font-semibold ${tab === 'media' ? 'bg-[var(--gt-blue)] text-white' : 'bg-white ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800'}`}>Media</button>
            <button onClick={() => setTab('reports')} className={`rounded-full px-4 py-2 text-xs font-semibold ${tab === 'reports' ? 'bg-[var(--gt-blue)] text-white' : 'bg-white ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800'}`}>Reports</button>
            <button onClick={() => setTab('verification')} className={`rounded-full px-4 py-2 text-xs font-semibold ${tab === 'verification' ? 'bg-[var(--gt-blue)] text-white' : 'bg-white ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800'}`}>Verification</button>
          </div>
        </div>

        {error ? <div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{error}</div> : null}
        {loading ? <div className="mt-5 text-sm text-slate-500">Loading...</div> : null}

        {tab === 'videos' ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {videos.map((v) => (
              <div key={v.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <div className="text-sm font-semibold">{v.title}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{v.company_name} - {v.company_role}</div>
                {v.video_url ? (
                  <div className="mt-3 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/60 dark:bg-black/20 dark:ring-slate-800">
                    <video src={v.video_url} controls className="w-full" />
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-slate-500">No video URL stored.</div>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-200">{v.video_review_status}</span>
                  {(v.video_moderation_flags || []).slice(0, 4).map((f) => (
                    <span key={f} className="rounded-full bg-rose-500/10 px-3 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-200">{f}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => approveVideo(v.id)} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Approve</button>
                  <button onClick={() => rejectVideo(v.id)} className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Reject</button>
                </div>
              </div>
            ))}
            {!videos.length && !loading ? <div className="text-sm text-slate-500">No pending videos.</div> : null}
          </div>
        ) : null}

        {tab === 'media' ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {mediaQueue.map((doc) => (
              <div key={doc.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <div className="text-sm font-semibold">{doc.type || 'Document'} - {doc.entity_type}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Entity: {doc.entity_id}</div>
                {doc.public_url ? (
                  <a
                    href={doc.public_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs font-semibold text-[var(--gt-blue)] hover:underline"
                  >
                    Open upload
                  </a>
                ) : (
                  <div className="mt-3 text-xs text-slate-500">No public URL available.</div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(doc.moderation_flags || []).slice(0, 4).map((flag) => (
                    <span key={flag} className="rounded-full bg-rose-500/10 px-3 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-200">{flag}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => approveMedia(doc.id)} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Approve</button>
                  <button onClick={() => rejectMedia(doc.id)} className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Reject</button>
                </div>
              </div>
            ))}
            {!mediaQueue.length && !loading ? <div className="text-sm text-slate-500">No pending media uploads.</div> : null}
          </div>
        ) : null}

        {tab === 'reports' ? (
          <div className="mt-6 space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{r.reason || 'Report'}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {r.entity_type}:{r.entity_id} - {r.actor_name || r.actor_id}
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${r.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200' : 'bg-amber-500/10 text-amber-700 dark:text-amber-200'}`}>
                    {r.status}
                  </span>
                </div>
                {r.status !== 'resolved' ? (
                  <div className="mt-4">
                    <button onClick={() => resolve(r.id)} className="rounded-xl bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white">Resolve</button>
                  </div>
                ) : null}
              </div>
            ))}
            {!reports.length && !loading ? <div className="text-sm text-slate-500">No open reports.</div> : null}
          </div>
        ) : null}

        {tab === 'verification' ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {verifications.map((rec) => (
              <div key={rec.user_id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{rec.user?.name || rec.user_id}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {rec.user?.role || rec.role} - {rec.user?.email || '--'} {rec.user?.country ? `- ${rec.user.country}` : ''}
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${rec.review_status === 'rejected' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-200' : 'bg-amber-500/10 text-amber-700 dark:text-amber-200'}`}>
                    {rec.review_status || 'pending'}
                  </span>
                </div>

                {rec.review_reason ? (
                  <div className="mt-2 text-xs text-rose-700 dark:text-rose-200">Reason: {rec.review_reason}</div>
                ) : null}

                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-white/5 dark:text-slate-200">
                  Credibility: <span className="font-semibold">{rec.credibility?.score ?? 0}/100</span> - {rec.credibility?.badge || 'Basic credibility'}
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  {(rec.required_checklist || []).map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-lg border border-slate-200 px-2 py-1 dark:border-white/10">
                      <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                      <span className={`font-semibold ${item.submitted ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                        {item.submitted ? 'Submitted' : 'Missing'}
                      </span>
                    </div>
                  ))}
                </div>

                {Array.isArray(rec.uploaded_documents) && rec.uploaded_documents.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rec.uploaded_documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.public_url || ''}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-100 dark:border-white/10"
                      >
                        {doc.type || 'Document'}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-slate-500">No uploaded documents yet.</div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => approveVerification(rec.user_id)} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Approve</button>
                  <button onClick={() => rejectVerification(rec.user_id)} className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Reject</button>
                </div>
              </div>
            ))}
            {!verifications.length && !loading ? <div className="text-sm text-slate-500">No pending verification submissions.</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

