import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, getCurrentUser, getToken } from '../../lib/auth'

const STATUS_OPTIONS = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'negotiating', label: 'Negotiating' },
  { key: 'sample_sent', label: 'Sample Sent' },
  { key: 'order_confirmed', label: 'Order Confirmed' },
  { key: 'closed', label: 'Closed' },
]

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString()
}

function statusBadgeClass(status = '') {
  if (status === 'breached') return 'bg-rose-100 text-rose-700'
  if (status === 'warning') return 'bg-amber-100 text-amber-800'
  return 'bg-emerald-100 text-emerald-700'
}

export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true, showOperations = true }) {
  const token = useMemo(() => getToken(), [])
  const canAssignLeads = Boolean(getCurrentUser()?.capabilities?.leads?.assign)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [selected, setSelected] = useState(null)
  const [lookup, setLookup] = useState({})
  const [noteDraft, setNoteDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [queueMeta, setQueueMeta] = useState({ queue: [], team_queues: [], assignments: [], agent_capacity: [] })

  const loadLeads = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/leads', { token })
      const nextItems = Array.isArray(data?.items) ? data.items : []
      let operationsQueue = []
      if (showOperations) {
        try {
          const queueData = await apiRequest('/org/operations/queue', { token })
          operationsQueue = Array.isArray(queueData?.queue) ? queueData.queue : []
          setQueueMeta({
            queue: operationsQueue,
            team_queues: queueData?.team_queues || [],
            assignments: queueData?.assignments || [],
            agent_capacity: queueData?.agent_capacity || [],
          })
        } catch {
          setQueueMeta({ queue: [], team_queues: [], assignments: [], agent_capacity: [] })
        }
      }

      const queueMap = new Map(operationsQueue.map((row) => [row.id, row]))
      setItems(nextItems.map((lead) => ({ ...lead, ...(queueMap.get(lead.id) || {}) })))

      const ids = new Set()
      nextItems.forEach((lead) => {
        if (lead.counterparty_id) ids.add(String(lead.counterparty_id))
        if (lead.assigned_agent_id) ids.add(String(lead.assigned_agent_id))
      })

      if (ids.size > 0) {
        const lookupRes = await apiRequest('/users/lookup', { method: 'POST', token, body: { ids: [...ids] } })
        const map = (lookupRes?.users || []).reduce((acc, user) => {
          acc[user.id] = user
          return acc
        }, {})
        setLookup(map)
      } else {
        setLookup({})
      }
    } catch (err) {
      setItems([])
      setLookup({})
      setError(err.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [showOperations, token])

  const loadLeadDetail = useCallback(async (leadId) => {
    if (!token || !leadId) return
    setSaving(true)
    setError('')
    try {
      const data = await apiRequest(`/leads/${encodeURIComponent(leadId)}`, { token })
      setSelected(data)
    } catch (err) {
      setSelected(null)
      setError(err.message || 'Failed to load lead details')
    } finally {
      setSaving(false)
    }
  }, [token])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  useEffect(() => {
    if (!selectedId) {
      setSelected(null)
      setNoteDraft('')
      return
    }
    loadLeadDetail(selectedId)
  }, [loadLeadDetail, selectedId])

  async function updateLead(patch) {
    if (!token || !selectedId) return
    setSaving(true)
    setError('')
    try {
      const updated = await apiRequest(`/leads/${encodeURIComponent(selectedId)}`, { method: 'PATCH', token, body: patch })
      setItems((prev) => prev.map((lead) => (lead.id === updated.id ? { ...lead, ...updated } : lead)))
      setSelected((prev) => (prev ? { ...prev, ...updated } : prev))
    } catch (err) {
      setError(err.message || 'Failed to update lead')
    } finally {
      setSaving(false)
    }
  }

  async function submitNote() {
    if (!token || !selectedId) return
    const text = noteDraft.trim()
    if (!text) return

    setSaving(true)
    setError('')
    try {
      const created = await apiRequest(`/leads/${encodeURIComponent(selectedId)}/notes`, { method: 'POST', token, body: { note: text } })
      setSelected((prev) => (prev ? { ...prev, notes: [created, ...(prev.notes || [])] } : prev))
      setNoteDraft('')
    } catch (err) {
      setError(err.message || 'Failed to add note')
    } finally {
      setSaving(false)
    }
  }

  async function createReminder() {
    if (!token || !selectedId) return
    const remindAt = window.prompt('Reminder date/time (ISO or YYYY-MM-DD HH:mm)', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
    if (!remindAt) return
    const message = window.prompt('Reminder note (optional)', 'Follow up') || 'Follow up'

    setSaving(true)
    setError('')
    try {
      const created = await apiRequest(`/leads/${encodeURIComponent(selectedId)}/reminders`, {
        method: 'POST',
        token,
        body: { remind_at: remindAt, message },
      })
      setSelected((prev) => (prev ? { ...prev, reminders: [...(prev.reminders || []), created] } : prev))
    } catch (err) {
      setError(err.message || 'Failed to create reminder')
    } finally {
      setSaving(false)
    }
  }

  async function triggerRebalance() {
    if (!token) return
    setSaving(true)
    setError('')
    try {
      await apiRequest('/org/operations/rebalance', { method: 'POST', token, body: { strategy: 'least_loaded' } })
      await loadLeads()
      if (selectedId) await loadLeadDetail(selectedId)
    } catch (err) {
      setError(err.message || 'Failed to rebalance queue')
    } finally {
      setSaving(false)
    }
  }

  async function escalateLead(leadId) {
    if (!token || !leadId) return
    const reason = window.prompt('Escalation reason', 'SLA risk') || 'SLA risk'
    setSaving(true)
    setError('')
    try {
      const updated = await apiRequest(`/org/operations/escalate/${encodeURIComponent(leadId)}`, {
        method: 'POST',
        token,
        body: { reason },
      })
      setItems((prev) => prev.map((lead) => (lead.id === updated.id ? { ...lead, ...updated } : lead)))
      setSelected((prev) => (prev ? { ...prev, ...updated } : prev))
      await loadLeads()
    } catch (err) {
      setError(err.message || 'Failed to escalate lead')
    } finally {
      setSaving(false)
    }
  }

  const selectedCounterparty = selected?.counterparty_id ? lookup[selected.counterparty_id] : null
  const assignedAgent = selected?.assigned_agent_id ? lookup[selected.assigned_agent_id] : null

  return (
    <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="lg:w-2/5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-2">
              {showOperations ? (
                <button
                  type="button"
                  onClick={triggerRebalance}
                  className="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]"
                  disabled={loading || saving}
                >
                  Rebalance
                </button>
              ) : null}
              <button
                type="button"
                onClick={loadLeads}
                className="px-3 py-1.5 text-sm rounded-md borderless-shadow hover:bg-slate-50 active:scale-[0.98]"
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? <div className="text-sm text-slate-500">Loading leads...</div> : null}
          {error ? <div className="mt-2 text-sm text-rose-600">{error}</div> : null}

          <div className="mt-3 space-y-2 max-h-[520px] overflow-auto pr-1">
            {items.length === 0 && !loading ? <div className="text-sm text-slate-500">No leads yet. Leads are created automatically when chats start.</div> : null}
            {items.map((lead) => {
              const counterparty = lead.counterparty_id ? lookup[lead.counterparty_id] : null
              const label = counterparty?.name || lead.counterparty_id || 'Counterparty'
              const isActive = lead.id === selectedId
              const avatarUrl = counterparty?.profile?.profile_image || counterparty?.avatar_url || counterparty?.avatar || ''

              return (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => setSelectedId(lead.id)}
                  className={[
                    'w-full text-left rounded-lg borderless-shadow px-3 py-2 transition',
                    isActive ? 'bg-[#F4F9FF] ring-1 ring-[var(--gt-blue)]' : 'hover:bg-slate-50',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={label} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                          {String(label).slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <p className="font-medium truncate">{label}</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest text-slate-500">{(lead.status || 'new').replace(/_/g, ' ')}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {lead?.sla?.status ? (
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(lead.sla.status)}`}>
                        SLA {lead.sla.status}
                      </span>
                    ) : null}
                    {lead?.queue_owner_id ? (
                      <span className="text-[10px] text-slate-500">Queue: {lookup[lead.queue_owner_id]?.name || lead.queue_owner_id}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Last: {formatDate(lead.last_interaction_at || lead.updated_at)}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="lg:w-3/5">
          {!selectedId ? (
            <div className="rounded-xl borderless-shadow p-6 text-sm text-slate-500">
              Select a lead to view details, notes, and reminders.
            </div>
          ) : (
            <div className="rounded-xl borderless-shadow p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Counterparty</p>
                  <div className="mt-2 flex items-center gap-3">
                    {selectedCounterparty?.profile?.profile_image ? (
                      <img src={selectedCounterparty.profile.profile_image} alt={selectedCounterparty?.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                        {String(selectedCounterparty?.name || selected?.counterparty_id || '--').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{selectedCounterparty?.name || selected?.counterparty_id || '--'}</p>
                      <p className="text-xs text-slate-500">{selectedCounterparty?.profile?.organization_name || selectedCounterparty?.profile?.organization || ''}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Match: {selected?.match_id || '--'}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500">Status</label>
                  <select
                    value={selected?.status || 'new'}
                    onChange={(e) => updateLead({ status: e.target.value })}
                    className="rounded-md borderless-shadow px-3 py-2 text-sm"
                    disabled={saving}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="rounded-md borderless-shadow px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    disabled={!selected?.match_id}
                    onClick={() => {
                      if (!selected?.match_id) return
                      navigate('/chat', { state: { matchId: selected.match_id, notice: 'Opening the lead conversation.' } })
                    }}
                  >
                    Message
                  </button>
                  {showOperations ? (
                    <button
                      type="button"
                      className="rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-400"
                      disabled={saving || !selectedId}
                      onClick={() => escalateLead(selectedId)}
                    >
                      Escalate
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Assigned agent</p>
                  <p className="mt-1 text-sm font-medium">{assignedAgent?.name || selected?.assigned_agent_id || 'Unassigned'}</p>
                  {!allowAssign || !canAssignLeads ? null : (
                    <button
                      type="button"
                      onClick={() => updateLead({ assigned_agent_id: window.prompt('Assign to agent id (user id)', selected?.assigned_agent_id || '') || '' })}
                      className="mt-2 text-sm text-[var(--gt-blue)] hover:underline"
                      disabled={saving}
                    >
                      Assign
                    </button>
                  )}
                  {allowAssign && !canAssignLeads ? (
                    <p className="mt-2 text-xs text-slate-500">Lead assignment is restricted by your role policy.</p>
                  ) : null}
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Updated</p>
                  <p className="mt-1 text-sm font-medium">{formatDate(selected?.updated_at || '') || '--'}</p>
                  {selected?.sla?.status ? (
                    <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(selected.sla.status)}`}>
                      SLA {selected.sla.status}
                    </p>
                  ) : null}
                  {selected?.queue_owner_id ? (
                    <p className="mt-1 text-xs text-slate-600">Queue owner: {lookup[selected.queue_owner_id]?.name || selected.queue_owner_id}</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={createReminder}
                    className="mt-2 text-sm text-[var(--gt-blue)] hover:underline"
                    disabled={saving}
                  >
                    Set reminder
                  </button>
                </div>
              </div>

              <div className="mt-5">
                {showOperations ? (
                  <div className="mb-4 rounded-lg bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-widest text-slate-500">Team queue snapshot</p>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {(queueMeta.team_queues || []).slice(0, 4).map((queue) => (
                        <div key={queue.agent_id} className="rounded-md borderless-shadow px-2 py-1 text-xs">
                          <div className="font-medium">{queue.agent_name || queue.agent_id}</div>
                          <div className="text-slate-500">Load: {queue.current_load} leads</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <p className="text-xs uppercase tracking-widest text-slate-500">Internal notes</p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Add a note for your team..."
                    className="flex-1 rounded-md borderless-shadow px-3 py-2 text-sm"
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={submitNote}
                    className="px-3 py-2 rounded-md bg-[var(--gt-blue)] text-white text-sm font-medium hover:bg-[var(--gt-blue-hover)] active:scale-[0.98]"
                    disabled={saving}
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 space-y-2 max-h-[260px] overflow-auto pr-1">
                  {(selected?.notes || []).length === 0 ? <div className="text-sm text-slate-500">No notes yet.</div> : null}
                  {(selected?.notes || []).map((note) => (
                    <div key={note.id} className="rounded-lg borderless-shadow p-3">
                      <p className="text-sm text-slate-900">{note.note}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDate(note.created_at)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-widest text-slate-500">Reminders</p>
                <div className="mt-2 space-y-2">
                  {(selected?.reminders || []).length === 0 ? <div className="text-sm text-slate-500">No reminders yet.</div> : null}
                  {(selected?.reminders || []).map((reminder) => (
                    <div key={reminder.id} className="rounded-lg borderless-shadow p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{reminder.message}</p>
                        <p className="text-xs text-slate-500">{formatDate(reminder.remind_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
