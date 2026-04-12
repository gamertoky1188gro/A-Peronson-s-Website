/*
  Route: /support
  Access: Protected (login required)

  Purpose:
    - Collect bug reports, feature requests, account issues, and general feedback.
    - Store submissions in the reports queue for admin review.
*/
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { apiRequest, API_BASE, getCurrentUser, getToken, hasEntitlement } from '../lib/auth'

const CATEGORY_OPTIONS = [
  'Bug Report',
  'Feature Request',
  'Account Problem',
  'Payment / Verification Issue',
  'Report a User',
  'Content Report',
  'General Feedback',
  'Other',
]

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent']

export default function SupportReports() {
  const token = useMemo(() => getToken(), [])
  const sessionUser = getCurrentUser()
  const canPrioritySupport = hasEntitlement(sessionUser, 'dedicated_support')
  const canDedicatedManager = hasEntitlement(sessionUser, 'dedicated_account_manager')
  const accountManager = sessionUser?.profile || {}
  const hasAccountManager = Boolean(accountManager.account_manager_name || accountManager.account_manager_email || accountManager.account_manager_phone)
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('Bug Report')
  const [description, setDescription] = useState('')
  const [pageUrl, setPageUrl] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [contactEmail, setContactEmail] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [reportId, setReportId] = useState('')
  const [tickets, setTickets] = useState([])
  const [ticketsLoading, setTicketsLoading] = useState(false)
  const [messagesByTicket, setMessagesByTicket] = useState({})
  const [messageDrafts, setMessageDrafts] = useState({})

  const loadTickets = useCallback(async () => {
    if (!token) return
    setTicketsLoading(true)
    try {
      const data = await apiRequest('/support/tickets', { token })
      setTickets(Array.isArray(data?.items) ? data.items : [])
    } catch {
      setTickets([])
    } finally {
      setTicketsLoading(false)
    }
  }, [token])

  async function loadMessages(ticketId) {
    if (!token || !ticketId) return
    try {
      const data = await apiRequest(`/support/tickets/${encodeURIComponent(ticketId)}/messages`, { token })
      setMessagesByTicket((prev) => ({ ...prev, [ticketId]: Array.isArray(data?.items) ? data.items : [] }))
    } catch {
      setMessagesByTicket((prev) => ({ ...prev, [ticketId]: [] }))
    }
  }

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  async function submitReport(e) {
    e.preventDefault()
    if (!token) {
      setFeedback('Please login again to submit a report.')
      return
    }
    setLoading(true)
    setFeedback('')
    setReportId('')
    try {
      const report = await apiRequest('/support/tickets', {
        method: 'POST',
        token,
        body: {
          subject,
          category,
          description,
          page_url: pageUrl,
          ...(canPrioritySupport ? { priority } : {}),
          contact_email: contactEmail,
        },
      })

      const ticketId = report?.ticket?.id || report?.id
      if (attachment && ticketId) {
        const formData = new FormData()
        formData.append('file', attachment)
        formData.append('entity_type', 'support_ticket')
        formData.append('entity_id', ticketId)
        formData.append('type', 'screenshot')

        const res = await fetch(`${API_BASE}/documents`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Attachment upload failed')
        }
      }

      setReportId(ticketId || '')
      setFeedback('Ticket submitted successfully.')
      setSubject('')
      setDescription('')
      setPageUrl('')
      setPriority('Medium')
      setContactEmail('')
      setAttachment(null)
      await loadTickets()
    } catch (err) {
      setFeedback(err.message || 'Unable to submit report')
    } finally {
      setLoading(false)
    }
  }

  async function submitMessage(ticketId) {
    const message = String(messageDrafts?.[ticketId] || '').trim()
    if (!token || !ticketId || !message) return
    try {
      await apiRequest(`/support/tickets/${encodeURIComponent(ticketId)}/messages`, {
        method: 'POST',
        token,
        body: { message },
      })
      setMessageDrafts((prev) => ({ ...prev, [ticketId]: '' }))
      await loadMessages(ticketId)
      await loadTickets()
    } catch (err) {
      setFeedback(err.message || 'Unable to send message')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
          <h1 className="text-2xl font-bold">Support & Reports</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Report bugs, request features, or share any issue. We collect everything in one place so it can be tracked and resolved.
          </p>
          {canDedicatedManager && hasAccountManager ? (
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200/60">
              <div className="font-semibold text-slate-800">Dedicated account manager</div>
              <div>{accountManager.account_manager_name || 'Support manager'}</div>
              <div>{accountManager.account_manager_email || ''}</div>
              <div>{accountManager.account_manager_phone || ''}</div>
            </div>
          ) : null}
        </div>

        <form onSubmit={submitReport} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800 space-y-4">
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              className="mt-1 w-full rounded-lg borderless-shadow px-3 py-2 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary of the issue"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select className="mt-1 w-full rounded-lg borderless-shadow px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Priority</label>
              <select
                className="mt-1 w-full rounded-lg borderless-shadow px-3 py-2 text-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={!canPrioritySupport}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {canPrioritySupport ? (
                <p className="mt-1 text-[11px] text-emerald-600">Premium Priority</p>
              ) : (
                <p className="mt-1 text-[11px] text-amber-600">Premium required for priority support.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full min-h-[140px] rounded-lg borderless-shadow px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write the full details here"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Page URL (optional)</label>
              <input
                className="mt-1 w-full rounded-lg borderless-shadow px-3 py-2 text-sm"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Contact Email (optional)</label>
              <input
                className="mt-1 w-full rounded-lg borderless-shadow px-3 py-2 text-sm"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Screenshot / File (optional)</label>
            <input
              type="file"
              className="mt-1 w-full rounded-lg borderless-shadow px-3 py-2 text-sm"
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
            />
          </div>

          {feedback ? (
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200/60">
              {feedback} {reportId ? `Reference ID: ${reportId}` : ''}
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--gt-blue-hover)] disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Support Tickets</h2>
            <button type="button" onClick={loadTickets} className="text-xs text-slate-600 hover:text-slate-900">Refresh</button>
          </div>
          {ticketsLoading ? (
            <div className="text-sm text-slate-500">Loading tickets...</div>
          ) : null}
          {!ticketsLoading && tickets.length === 0 ? (
            <div className="text-sm text-slate-500">No tickets yet.</div>
          ) : null}
          <div className="space-y-4">
          {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-xl borderless-shadow p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{ticket.subject || 'Support ticket'}</div>
                    <div className="text-xs text-slate-500">Status: {ticket.status || 'open'} - Priority: {ticket.priority || 'standard'}</div>
                  </div>
                  <div className="text-xs text-slate-500">
                    SLA: Response by {ticket.sla_response_due_at ? new Date(ticket.sla_response_due_at).toLocaleString() : '--'} -
                    Resolve by {ticket.sla_resolution_due_at ? new Date(ticket.sla_resolution_due_at).toLocaleString() : '--'}
                  </div>
                </div>
                {canPrioritySupport && ticket.priority && String(ticket.priority).toLowerCase() !== 'standard' ? (
                  <div className="mt-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200/70">
                    Priority queue
                  </div>
                ) : null}

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadMessages(ticket.id)}
                    className="text-xs text-[var(--gt-blue)] hover:underline"
                  >
                    View messages
                  </button>
                </div>

                {(messagesByTicket[ticket.id] || []).length ? (
                  <div className="mt-3 space-y-2 max-h-48 overflow-auto rounded-lg bg-slate-50 p-3">
                    {(messagesByTicket[ticket.id] || []).map((msg) => (
                      <div key={msg.id} className="text-xs">
                        <div className="font-semibold">{msg.sender_role || 'user'}</div>
                        <div className="text-slate-600">{msg.message}</div>
                        <div className="text-[10px] text-slate-400">{new Date(msg.created_at).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 flex items-center gap-2">
                  <input
                    className="flex-1 rounded-lg borderless-shadow px-3 py-2 text-xs"
                    placeholder="Send a follow-up message"
                    value={messageDrafts[ticket.id] || ''}
                    onChange={(e) => setMessageDrafts((prev) => ({ ...prev, [ticket.id]: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => submitMessage(ticket.id)}
                    className="rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--gt-blue-hover)]"
                  >
                    Send
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

