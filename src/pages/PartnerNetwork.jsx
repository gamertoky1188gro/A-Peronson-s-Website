import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'
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
      setError(err.message)
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
      setError(err.message)
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
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const canManage = permissions.can_manage && !permissions.view_only

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Partner Network</h1>
            <p className="text-sm text-[#5A5A5A]">Manage connected factories and request workflow by account ID</p>
            {permissions.view_only && <p className="text-xs text-amber-700 mt-1">Agent mode: view-only access enabled.</p>}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={targetAccountId}
              onChange={(e) => setTargetAccountId(e.target.value)}
              placeholder="Target account ID"
              className="px-3 py-2 border rounded w-64"
              disabled={!canManage || loading}
            />
            <button
              onClick={sendRequest}
              disabled={!canManage || loading || !targetAccountId.trim()}
              className="px-4 py-2 bg-[#0A66C2] text-white rounded-md disabled:opacity-60"
            >
              Send Request
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search partners" className="px-3 py-2 border rounded w-72" />
          <div className="text-sm text-[#5A5A5A]">Signed in as: {user?.role || 'unknown'}</div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            {STATUS_TABS.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`px-3 py-2 rounded ${tab === item.key ? 'bg-[#0A66C2] text-white' : 'border'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error ? <div className="mb-3 text-sm text-red-600">{error}</div> : null}
        {loading ? <div className="mb-3 text-sm text-[#5A5A5A]">Loading...</div> : null}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRows.map((row) => {
            const counterparty = row.counterparty || {}
            const isIncoming = row.direction === 'incoming'
            const isMine = row.requester_id === user?.id
            return (
              <div key={row.id} className="bg-white neo-panel cyberpunk-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{counterparty.name || 'Unknown account'}</div>
                    <div className="text-sm text-[#5A5A5A]">Account ID: {counterparty.id}</div>
                    <div className="text-xs text-[#5A5A5A] capitalize">Role: {counterparty.role || 'unknown'}</div>
                  </div>
                  {counterparty.verified && <div className="text-sm text-[#0A66C2] font-semibold">✓ Verified</div>}
                </div>

                <div className="text-sm text-[#5A5A5A] mb-3">
                  <div>Status: <span className="capitalize font-medium">{row.status}</span></div>
                  <div>Direction: <span className="capitalize">{row.direction}</span></div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    to={counterparty.role === 'factory' ? `/factory/${counterparty.id}` : `/buying-house/${counterparty.id}`}
                    className="px-3 py-1 bg-[#0A66C2] text-white rounded"
                  >
                    View Profile
                  </Link>

                  {row.status === 'pending' && canManage && isIncoming && (
                    <>
                      <button onClick={() => applyAction(row.id, 'accept')} className="px-3 py-1 border rounded text-sm" disabled={loading}>Accept</button>
                      <button onClick={() => applyAction(row.id, 'reject')} className="px-3 py-1 border rounded text-sm" disabled={loading}>Reject</button>
                    </>
                  )}

                  {row.status === 'pending' && canManage && isMine && (
                    <button onClick={() => applyAction(row.id, 'cancel')} className="px-3 py-1 border rounded text-sm" disabled={loading}>Cancel</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {!loading && filteredRows.length === 0 && <div className="text-sm text-[#5A5A5A] mt-4">No requests found for this filter.</div>}
      </div>

      <FloatingAssistant />
    </div>
  )
}
