import React, { useEffect, useMemo, useState } from 'react'
import { apiRequest, getCurrentUser, getToken } from '../../lib/auth'

function formatDate(value) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString()
}

export default function CrmSummaryPanel({ targetId }) {
  const token = useMemo(() => getToken(), [])
  const currentUser = useMemo(() => getCurrentUser(), [])
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || !targetId) return
    let alive = true
    apiRequest(`/crm/profile/${encodeURIComponent(targetId)}`, { token })
      .then((res) => {
        if (!alive) return
        setData(res)
        setError('')
      })
      .catch((err) => {
        if (!alive) return
        setError(err.status === 403 ? '' : (err.message || 'Unable to load CRM summary'))
        setData(null)
      })
    return () => {
      alive = false
    }
  }, [targetId, token])

  if (!data && !error) return null
  if (!data) return null

  const leadStatus = data?.leads?.by_status || {}
  const recentThreads = Array.isArray(data?.messages?.threads) ? data.messages.threads : []
  const recentCalls = Array.isArray(data?.calls?.items) ? data.calls.items : []
  const recentContracts = Array.isArray(data?.contracts?.items) ? data.contracts.items : []
  const openLink = currentUser?.role === 'agent' ? '/agent?tab=leads' : '/owner?tab=leads'

  return (
    <section className="mt-6 rounded-2xl borderless-shadow bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">CRM Summary</p>
          <p className="text-[11px] text-slate-500">Visible only to your team</p>
        </div>
        <a href={openLink} className="rounded-full bg-[#0A66C2] px-3 py-1 text-[11px] font-semibold text-white">
          Open Leads
        </a>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-600">Lead Status</p>
          <div className="mt-2 space-y-1 text-xs text-slate-700">
            {Object.keys(leadStatus).length ? (
              Object.entries(leadStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize">{String(status).replace(/_/g, ' ')}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-400">No leads yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-600">Recent Messages</p>
          <div className="mt-2 space-y-2 text-xs text-slate-700">
            {recentThreads.length ? recentThreads.slice(0, 4).map((thread) => (
              <div key={thread.match_id} className="flex items-center justify-between">
                <span className="truncate">Thread {thread.match_id.slice(0, 10)}...</span>
                <span className="text-[10px] text-slate-500">{formatDate(thread.last_message_at)}</span>
              </div>
            )) : <div className="text-slate-400">No messages yet.</div>}
          </div>
        </div>

        <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-600">Calls & Contracts</p>
          <div className="mt-2 space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span>Calls</span>
              <span className="font-semibold">{data?.calls?.total ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Contracts</span>
              <span className="font-semibold">{data?.contracts?.total ?? 0}</span>
            </div>
            {recentContracts.length ? (
              <div className="text-[10px] text-slate-500">
                Latest contract: {formatDate(recentContracts[0]?.updated_at || recentContracts[0]?.created_at)}
              </div>
            ) : null}
            {recentCalls.length ? (
              <div className="text-[10px] text-slate-500">
                Latest call: {formatDate(recentCalls[0]?.created_at || recentCalls[0]?.started_at)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
