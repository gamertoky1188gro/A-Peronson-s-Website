import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FloatingAssistant from '../components/FloatingAssistant'
import { apiRequest, getToken } from '../lib/auth'

function sortByNewest(a, b) {
  return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
}

function normalizeThreads(messages = []) {
  const byMatchId = new Map()

  messages.forEach((message) => {
    if (!message?.match_id) return
    const existing = byMatchId.get(message.match_id)
    if (!existing) {
      byMatchId.set(message.match_id, {
        id: message.match_id,
        matchId: message.match_id,
        name: message.sender_name || message.sender_id || 'Unknown sender',
        senderId: message.sender_id,
        verified: Boolean(message.sender_verified),
        last: message.message || 'No message content',
        unread: 0,
        timestamp: message.timestamp,
      })
      return
    }

    if (new Date(message.timestamp || 0).getTime() > new Date(existing.timestamp || 0).getTime()) {
      byMatchId.set(message.match_id, {
        ...existing,
        last: message.message || existing.last,
        timestamp: message.timestamp,
      })
    }
  })

  return [...byMatchId.values()].sort(sortByNewest)
}

export default function ChatInterface() {
  const [priorityInbox, setPriorityInbox] = useState([])
  const [messageRequests, setMessageRequests] = useState([])
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [scheduleStatus, setScheduleStatus] = useState('')
  const [callHistoryByThread, setCallHistoryByThread] = useState({})

  const loadInbox = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const token = getToken()
      if (!token) {
        setPriorityInbox([])
        setMessageRequests([])
        setError('Please sign in to view your inbox.')
        return
      }

      const data = await apiRequest('/messages/inbox', { token })
      const priority = normalizeThreads(data?.priority || [])
      const requests = normalizeThreads(data?.request_pool || [])
      const allMatchIds = [...new Set([...priority, ...requests].map((thread) => thread.matchId).filter(Boolean))]

      setPriorityInbox(priority)
      setMessageRequests(requests)
      if (!activeThreadId && priority.length > 0) {
        setActiveThreadId(priority[0].id)
      }

      if (allMatchIds.length > 0) {
        const callHistoryResponse = await apiRequest(`/calls/history?match_ids=${allMatchIds.join(',')}`, { token })
        const grouped = (callHistoryResponse?.items || []).reduce((acc, item) => {
          const key = item.match_id || item.context?.chat_thread_id
          if (!key) return acc
          if (!acc[key]) acc[key] = []
          acc[key].push(item)
          return acc
        }, {})
        setCallHistoryByThread(grouped)
      } else {
        setCallHistoryByThread({})
      }
    } catch (err) {
      setPriorityInbox([])
      setMessageRequests([])
      setError(err.message || 'Failed to load inbox')
    } finally {
      setLoading(false)
    }
  }, [activeThreadId])

  useEffect(() => {
    loadInbox()
  }, [loadInbox])

  const filteredPriorityInbox = useMemo(() => {
    if (!query.trim()) return priorityInbox
    const search = query.toLowerCase()
    return priorityInbox.filter((thread) => thread.name.toLowerCase().includes(search) || thread.last.toLowerCase().includes(search))
  }, [priorityInbox, query])

  const filteredRequests = useMemo(() => {
    if (!query.trim()) return messageRequests
    const search = query.toLowerCase()
    return messageRequests.filter((thread) => thread.name.toLowerCase().includes(search) || thread.last.toLowerCase().includes(search))
  }, [messageRequests, query])

  const allVisibleThreads = useMemo(() => [...filteredPriorityInbox, ...filteredRequests], [filteredPriorityInbox, filteredRequests])
  const activeThread = allVisibleThreads.find((thread) => thread.id === activeThreadId)
  const activeCallHistory = useMemo(() => {
    if (!activeThread?.matchId) return []
    return callHistoryByThread[activeThread.matchId] || []
  }, [activeThread, callHistoryByThread])

  function acceptRequest(threadId) {
    setMessageRequests((current) => {
      const accepted = current.find((thread) => thread.id === threadId)
      if (!accepted) return current
      setPriorityInbox((existing) => [accepted, ...existing].sort(sortByNewest))
      if (!activeThreadId) setActiveThreadId(threadId)
      return current.filter((thread) => thread.id !== threadId)
    })
  }

  function rejectRequest(threadId) {
    setMessageRequests((current) => current.filter((thread) => thread.id !== threadId))
    if (activeThreadId === threadId) {
      setActiveThreadId(filteredPriorityInbox[0]?.id || null)
    }
  }

  async function scheduleCall(thread) {
    const token = getToken()
    if (!token || !thread?.matchId) {
      setScheduleStatus('Please sign in and select a valid thread before scheduling.')
      return
    }

    const scheduledForInput = window.prompt('Schedule date/time (ISO or YYYY-MM-DD HH:mm)', new Date().toISOString())
    if (!scheduledForInput) return

    const contractId = window.prompt('Contract ID to link (optional)', '') || ''
    const securityAuditId = window.prompt('Security audit ID to link (optional)', '') || ''
    const parsedScheduledFor = new Date(scheduledForInput)
    const scheduledFor = Number.isNaN(parsedScheduledFor.getTime()) ? new Date().toISOString() : parsedScheduledFor.toISOString()

    setScheduleStatus('Scheduling call...')
    try {
      const created = await apiRequest('/calls/scheduled', {
        method: 'POST',
        token,
        body: {
          match_id: thread.matchId,
          title: `Call with ${thread.name}`,
          chat_thread_id: thread.id,
          scheduled_for: scheduledFor,
          contract_id: contractId,
          security_audit_id: securityAuditId,
        },
      })
      setScheduleStatus(`Scheduled call for ${new Date(created.scheduled_for).toLocaleString()}.`)
      await loadInbox()
    } catch (err) {
      setScheduleStatus(err.message || 'Failed to schedule call')
    }
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4 space-y-4">
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Search chats"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            {loading && <div className="text-sm text-[#5A5A5A]">Loading inbox...</div>}
            {!loading && error && <div className="text-sm text-red-600">{error}</div>}

            {!loading && !error && (
              <>
                <section>
                  <h2 className="text-sm font-semibold mb-2">Priority Inbox</h2>
                  <div className="space-y-2">
                    {filteredPriorityInbox.map((thread) => (
                      <div
                        key={`priority-${thread.id}`}
                        className={`p-2 rounded cursor-pointer ${activeThreadId === thread.id ? 'bg-[#F4F9FF]' : ''}`}
                        onClick={() => setActiveThreadId(thread.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="font-semibold">
                              {thread.name} <span className="text-[#0A66C2]">✓</span>
                            </div>
                            <div className="text-sm text-[#5A5A5A] truncate">{thread.last}</div>
                          </div>
                          {thread.unread > 0 && <div className="text-xs bg-[#0A66C2] text-white px-2 py-1 rounded">{thread.unread}</div>}
                        </div>
                      </div>
                    ))}
                    {filteredPriorityInbox.length === 0 && <p className="text-sm text-[#5A5A5A]">No priority messages yet.</p>}
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-semibold mb-2">Message Requests</h2>
                  <div className="space-y-2">
                    {filteredRequests.map((thread) => (
                      <div key={`request-${thread.id}`} className="p-2 rounded border border-[#E7E7E7]">
                        <button
                          className={`w-full text-left rounded ${activeThreadId === thread.id ? 'bg-[#F4F9FF]' : ''}`}
                          onClick={() => setActiveThreadId(thread.id)}
                        >
                          <div className="font-semibold">{thread.name}</div>
                          <div className="text-sm text-[#5A5A5A] truncate">{thread.last}</div>
                        </button>
                        <div className="mt-2 flex gap-2">
                          <button
                            className="px-3 py-1 text-sm rounded bg-[#0A66C2] text-white"
                            onClick={() => acceptRequest(thread.id)}
                          >
                            Accept
                          </button>
                          <button
                            className="px-3 py-1 text-sm rounded border"
                            onClick={() => rejectRequest(thread.id)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredRequests.length === 0 && <p className="text-sm text-[#5A5A5A]">No pending message requests.</p>}
                  </div>
                </section>
              </>
            )}
          </div>
        </aside>

        <main className="lg:col-span-2">
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4 h-[60vh] flex flex-col">
            {activeThread ? (
              <>
                <div className="flex items-center justify-between border-b pb-3 mb-3">
                  <div>
                    <div className="font-semibold">{activeThread.name}</div>
                    <div className="text-sm text-[#5A5A5A]">
                      {priorityInbox.some((thread) => thread.id === activeThread.id) ? 'Priority Inbox' : 'Message Request'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded">📹 Video Call</button>
                    <button className="px-3 py-1 border rounded">📞 Audio Call</button>
                    <button className="px-3 py-1 border rounded" onClick={() => scheduleCall(activeThread)}>📅 Schedule</button>
                  </div>
                </div>
                {scheduleStatus && <div className="mb-2 text-sm text-[#0A66C2]">{scheduleStatus}</div>}
                <div className="flex-1 overflow-auto mb-3">
                  <div className="space-y-3">
                    <div className="self-start bg-white neo-panel cyberpunk-card p-2 rounded shadow">{activeThread.last}</div>
                    <div className="text-center text-sm text-[#5A5A5A]">
                      Match Thread: {activeThread.matchId}
                    </div>
                    <div className="text-sm border rounded p-2 bg-[#F8FBFF]">
                      <div className="font-semibold mb-1">Call History</div>
                      {activeCallHistory.length > 0 ? activeCallHistory.slice(0, 3).map((call) => (
                        <div key={call.id} className="mb-1">
                          {call.title} • {call.status} • {new Date(call.scheduled_for).toLocaleString()}
                        </div>
                      )) : <div className="text-[#5A5A5A]">No calls scheduled yet.</div>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 border px-3 py-2 rounded" placeholder="Write a message..." />
                  <button className="px-4 py-2 bg-[#0A66C2] text-white rounded">Send</button>
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-[#5A5A5A]">Select a chat to begin</div>
            )}
          </div>
        </main>
      </div>

      <FloatingAssistant />
    </div>
  )
}
