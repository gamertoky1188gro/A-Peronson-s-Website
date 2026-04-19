import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

const STATUS_TABS = [
  { key: 'connected', label: 'Connected' },
  { key: 'pending', label: 'Pending Requests' },
  { key: 'rejected', label: 'Rejected' },
]

export default function PartnerNetwork() {
  const user = getCurrentUser()
  const token = getToken()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('connected')
  const [targetAccountId, setTargetAccountId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [permissions, setPermissions] = useState({ can_manage: false, view_only: false })

  const loadNetwork = useCallback(async (status = tab) => {
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest(`/partners?status=${status}`, { token })
      setRows(data.requests || [])
      setPermissions(data.permissions || { can_manage: false, view_only: false })
    } catch (err) {
      setError(err.status === 403 ? 'You do not have permission to perform this action.' : err.message)
    } finally {
      setLoading(false)
    }
  }, [tab, token])

  useEffect(() => {
    loadNetwork(tab)
  }, [loadNetwork, tab])

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => {
      const counterparty = row.counterparty || {}
      return (
        String(counterparty.name || '').toLowerCase().includes(q)
        || String(counterparty.id || '').toLowerCase().includes(q)
      )
    })
  }, [query, rows])

  const sendRequest = async () => {
    if (!targetAccountId.trim()) return
    setLoading(true)
    setError('')
    try {
      await apiRequest('/partners/requests', {
        method: 'POST',
        token,
        body: { targetAccountId: targetAccountId.trim() },
      })
      setTargetAccountId('')
      setTab('pending')
      await loadNetwork('pending')
    } catch (err) {
      setError(err.status === 403 ? 'You do not have permission to perform this action.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  const applyAction = async (requestId, action) => {
    setLoading(true)
    setError('')
    try {
      await apiRequest(`/partners/requests/${requestId}/${action}`, { method: 'POST', token })
      await loadNetwork(tab)
    } catch (err) {
      setError(err.status === 403 ? 'You do not have permission to perform this action.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  const canManage = permissions.can_manage && !permissions.view_only

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#020617] dark:text-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Partner Network</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Manage connected factories and request workflow by account ID</p>
            {permissions.view_only && <p className="text-xs text-amber-700 mt-1 dark:text-amber-200">Agent mode: view-only access enabled.</p>}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={targetAccountId}
              onChange={(e) => setTargetAccountId(e.target.value)}
              placeholder="Target account ID"
              className="px-3 py-2 shadow-borderless ring-1 ring-slate-200/60 rounded w-64 bg-white focus:outline-none focus:ring-2 focus:ring-gtBlue/25 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10"
              disabled={!canManage || loading}
            />
            <button
              onClick={sendRequest}
              disabled={!canManage || loading || !targetAccountId.trim()}
              className="px-4 py-2 bg-gtBlue hover:bg-gtBlueHover text-white rounded-md disabled:opacity-60"
            >
              Send Request
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search partners" className="px-3 py-2 shadow-borderless ring-1 ring-slate-200/60 rounded w-72 bg-white focus:outline-none focus:ring-2 focus:ring-gtBlue/25 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10" />
          <div className="text-sm text-slate-600 dark:text-slate-300">Signed in as: {user?.role || 'unknown'}</div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            {STATUS_TABS.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`px-3 py-2 rounded${tab === item.key ? 'bg-gtBlue hover:bg-gtBlueHover text-white' : 'bg-white shadow-borderless ring-1 ring-slate-200/60 text-slate-700 hover:bg-slate-50 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10 dark:text-slate-200 dark:hover:bg-white/8'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error ? <div className="mb-3 text-sm text-red-600">{error}</div> : null}
        {loading ? <div className="mb-3 text-sm text-slate-600 dark:text-slate-300">Loading...</div> : null}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRows.map((row) => {
            const counterparty = row.counterparty || {}
            const isIncoming = row.direction === 'incoming'
            const isMine = row.requester_id === user?.id
            return (
              <div key={row.id} className="rounded-2xl bg-white shadow-borderless ring-1 ring-slate-200/60 p-4 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{counterparty.name || 'Unknown account'}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Account ID: {counterparty.id}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 capitalize">Role: {counterparty.role || 'unknown'}</div>
                  </div>
                  {counterparty.verified && <div className="text-sm text-gtBlue font-semibold">✓ Verified</div>}
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  <div>Status: <span className="capitalize font-medium">{row.status}</span></div>
                  <div>Direction: <span className="capitalize">{row.direction}</span></div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    to={counterparty.role === 'factory' ? `/factory/${counterparty.id}` : `/buying-house/${counterparty.id}`}
                    className="px-3 py-1 bg-gtBlue hover:bg-gtBlueHover text-white rounded"
                  >
                    View Profile
                  </Link>

                  {row.status === 'pending' && canManage && isIncoming && (
                    <>
                      <button onClick={() => applyAction(row.id, 'accept')} className="px-3 py-1 shadow-borderless dark:shadow-borderlessDark rounded text-sm" disabled={loading}>Accept</button>
                      <button onClick={() => applyAction(row.id, 'reject')} className="px-3 py-1 shadow-borderless dark:shadow-borderlessDark rounded text-sm" disabled={loading}>Reject</button>
                    </>
                  )}

                  {row.status === 'pending' && canManage && isMine && (
                    <button onClick={() => applyAction(row.id, 'cancel')} className="px-3 py-1 shadow-borderless dark:shadow-borderlessDark rounded text-sm" disabled={loading}>Cancel</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {!loading && filteredRows.length === 0 && <div className="text-sm text-slate-600 dark:text-slate-300 mt-4">No requests found for this filter.</div>}
      </div>

    </div>
  )
}
