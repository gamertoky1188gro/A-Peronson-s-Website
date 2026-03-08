import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:4000'

function sortByNewest(a, b) {
  return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
}

function sortByOldest(a, b) {
  return new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
}

function normalizeThreads(messages = []) {
  const byMatchId = new Map()

  messages.forEach((message) => {
    if (!message?.match_id) return
    const existing = byMatchId.get(message.match_id)
    const lock = message.conversation_lock || existing?.lock || null

    if (!existing) {
      byMatchId.set(message.match_id, {
        id: message.match_id,
        matchId: message.match_id,
        requestId: message.request_id || String(message.match_id).split(':')[0],
        name: formatDisplayName(message.sender_name || message.company_name || message.sender_company_name, message.sender_id),
        senderId: message.sender_id,
        verified: Boolean(message.sender_verified),
        last: message.message || 'No message content',
        unread: 0,
        timestamp: message.timestamp,
        lock,
        isFriendThread: String(message.match_id || '').startsWith('friend:'),
        friendRequestStatus: message.friend_request_status || null,
        friendRequestDirection: message.friend_request_direction || null,
      })
      return
    }

    if (new Date(message.timestamp || 0).getTime() > new Date(existing.timestamp || 0).getTime()) {
      byMatchId.set(message.match_id, {
        ...existing,
        last: message.message || existing.last,
        timestamp: message.timestamp,
        lock,
        isFriendThread: existing.isFriendThread || String(message.match_id || '').startsWith('friend:'),
        friendRequestStatus: message.friend_request_status || existing.friendRequestStatus || null,
        friendRequestDirection: message.friend_request_direction || existing.friendRequestDirection || null,
      })
    }
  })

  return [...byMatchId.values()].sort(sortByNewest)
}

function lockStatusLabel(lock, thread = null) {
  if (thread?.isFriendThread) {
    if (thread.friendRequestStatus === 'pending' && thread.friendRequestDirection === 'incoming') return 'Incoming friend request'
    if (thread.friendRequestStatus === 'pending' && thread.friendRequestDirection === 'outgoing') return 'Friend request pending'
    return 'Direct friend chat'
  }

  if (!lock || lock.status === 'unclaimed') return 'Unclaimed'
  if (lock.status === 'claimed') return `Claimed by ${lock.claimed_by_name || 'you'}`
  if (lock.status === 'granted') return 'Access granted'
  return `Claimed by ${lock.claimed_by_name || 'another agent'}`
}


function isImageMessage(message) {
  return message?.type === 'image' || String(message?.attachment?.mime_type || '').startsWith('image/')
}

function isVideoMessage(message) {
  return message?.type === 'video' || String(message?.attachment?.mime_type || '').startsWith('video/')
}

function toAbsoluteAssetUrl(url = '') {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
  const base = apiUrl.replace(/\/api\/?$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}


function truncateId(value = '', size = 8) {
  const normalized = String(value || '')
  if (normalized.length <= size) return normalized
  return `${normalized.slice(0, size)}...`
}

function formatDisplayName(name, fallbackId) {
  if (name && String(name).trim()) return String(name).trim()
  const token = String(fallbackId || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 7) || 'unknown'
  return `User-${token}`
}

function getInitials(label = '') {
  const words = String(label).trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'U'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase()
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
  const [members, setMembers] = useState([])
  const [targetAgentId, setTargetAgentId] = useState('')
  const [lockActionStatus, setLockActionStatus] = useState('')
  const [messagesByThread, setMessagesByThread] = useState({})
  const [draftMessage, setDraftMessage] = useState('')
  const [isLiveMessagingEnabled, setIsLiveMessagingEnabled] = useState(true)
  const [chatConnectionStatus, setChatConnectionStatus] = useState('offline')
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [showThreadInfo, setShowThreadInfo] = useState(false)

  const wsRef = useRef(null)
  const fileInputRef = useRef(null)
  const reconnectTimerRef = useRef(null)
  const currentUser = useMemo(() => getCurrentUser(), [])
  const navigate = useNavigate()

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
      setActiveThreadId((currentThreadId) => {
        const threadStillVisible = [...priority, ...requests].some((thread) => thread.id === currentThreadId)
        if (threadStillVisible) return currentThreadId
        if (priority.length > 0) return priority[0].id
        if (requests.length > 0) return requests[0].id
        return null
      })

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
  }, [])

  const loadMembers = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const data = await apiRequest('/members', { token })
      setMembers(Array.isArray(data?.members) ? data.members : [])
    } catch {
      setMembers([])
    }
  }, [])

  const loadThreadMessages = useCallback(async (matchId) => {
    const token = getToken()
    if (!token || !matchId) return

    try {
      const data = await apiRequest(`/messages/${matchId}`, { token })
      setMessagesByThread((previous) => ({
        ...previous,
        [matchId]: Array.isArray(data) ? data.sort(sortByOldest) : [],
      }))
    } catch {
      setMessagesByThread((previous) => ({
        ...previous,
        [matchId]: [],
      }))
    }
  }, [])

  useEffect(() => {
    loadInbox()
    loadMembers()
  }, [loadInbox, loadMembers])

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
  const activeMessages = useMemo(() => {
    if (!activeThread?.matchId) return []
    return messagesByThread[activeThread.matchId] || []
  }, [activeThread, messagesByThread])

  useEffect(() => {
    if (!activeThread?.matchId) return
    loadThreadMessages(activeThread.matchId)
  }, [activeThread, loadThreadMessages])

  useEffect(() => {
    if (!isLiveMessagingEnabled) {
      setChatConnectionStatus('offline')
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      return undefined
    }

    let isActive = true

    const connect = () => {
      const token = getToken()
      if (!token) {
        setChatConnectionStatus('offline')
        return
      }

      setChatConnectionStatus('connecting')
      const ws = new WebSocket(WS_BASE)
      wsRef.current = ws

      ws.onopen = () => {
        if (!isActive) return
        setChatConnectionStatus('online')
        if (activeThread?.matchId) {
          ws.send(JSON.stringify({
            type: 'join_chat_room',
            match_id: activeThread.matchId,
            token,
          }))
        }
      }

      ws.onmessage = (event) => {
        if (!isActive) return
        const payload = JSON.parse(String(event.data || '{}'))

        if (payload.type === 'joined_chat_room') {
          const roomMatchId = payload.match_id
          const history = Array.isArray(payload.messages) ? payload.messages.sort(sortByOldest) : []
          setMessagesByThread((previous) => ({ ...previous, [roomMatchId]: history }))
          return
        }

        if (payload.type === 'chat_message') {
          const roomMatchId = payload.match_id
          const incomingMessage = payload.message
          if (!roomMatchId || !incomingMessage?.id) return
          setMessagesByThread((previous) => {
            const existing = previous[roomMatchId] || []
            if (existing.some((message) => message.id === incomingMessage.id)) return previous
            return {
              ...previous,
              [roomMatchId]: [...existing, incomingMessage].sort(sortByOldest),
            }
          })
          return
        }

        if (payload.type === 'chat_error') {
          setChatConnectionStatus('error')
          setError(payload.error || 'Live messaging error')
        }
      }

      ws.onerror = () => {
        if (isActive) setChatConnectionStatus('error')
      }

      ws.onclose = () => {
        if (!isActive) return
        setChatConnectionStatus('offline')
        if (reconnectTimerRef.current) window.clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = window.setTimeout(connect, 1500)
      }
    }

    connect()

    return () => {
      isActive = false
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [isLiveMessagingEnabled, activeThread?.matchId])

  async function updateRequestState(thread, decision) {
    const token = getToken()
    if (!token || !thread?.id) {
      setError('Please sign in to update message requests.')
      return
    }

    try {
      if (thread.isFriendThread) {
        if (decision === 'accept') {
          await apiRequest(`/users/${thread.senderId}/friend-request`, {
            method: 'POST',
            token,
          })
          setError('')
        }
      } else {
        await apiRequest(`/messages/requests/${thread.id}/${decision}`, {
          method: 'POST',
          token,
        })
      }

      await loadInbox()
    } catch (err) {
      setError(err.message || `Failed to ${decision} request`)
    }
  }

  async function requestConversationAccess(thread) {
    const token = getToken()
    if (!token || !thread?.requestId) return
    setLockActionStatus('Requesting access...')
    try {
      await apiRequest(`/conversations/${thread.requestId}/claim`, { method: 'POST', token })
      setLockActionStatus('Access is now granted for this conversation.')
      await loadInbox()
    } catch (err) {
      setLockActionStatus(err.message || 'Unable to request access.')
    }
  }

  async function grantConversationAccess(thread) {
    const token = getToken()
    if (!token || !thread?.requestId || !targetAgentId) {
      setLockActionStatus('Select a member to grant access.')
      return
    }

    setLockActionStatus('Granting access...')
    try {
      await apiRequest(`/conversations/${thread.requestId}/grant`, {
        method: 'POST',
        token,
        body: { target_agent_id: targetAgentId },
      })
      setLockActionStatus('Secondary agent access granted and notification sent.')
      setTargetAgentId('')
      await loadInbox()
    } catch (err) {
      setLockActionStatus(err.message || 'Unable to grant access.')
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


  async function startInstantCall(thread) {
    const token = getToken()
    if (!token || !thread?.matchId) {
      setScheduleStatus('Please sign in and select a valid thread before starting a call.')
      return
    }

    setScheduleStatus('Starting call room...')
    try {
      const result = await apiRequest('/calls/join', {
        method: 'POST',
        token,
        body: {
          match_id: thread.matchId,
          chat_thread_id: thread.matchId,
          title: `Call with ${thread.name}`,
        },
      })
      const callId = result?.call?.id
      if (!callId) throw new Error('Unable to open call room')
      setScheduleStatus('Call room ready. Redirecting...')
      navigate(`/call?callId=${encodeURIComponent(callId)}&matchId=${encodeURIComponent(thread.matchId)}`)
    } catch (err) {
      setScheduleStatus(err.message || 'Failed to start call')
    }
  }

  async function sendAttachment(file) {
    const token = getToken()
    if (!token || !activeThread?.matchId || !file) return

    setUploading(true)
    setUploadStatus('Uploading file...')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('message', draftMessage.trim())

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const response = await fetch(`${apiBase}/messages/${encodeURIComponent(activeThread.matchId)}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error || 'Upload failed')

      setMessagesByThread((previous) => ({
        ...previous,
        [activeThread.matchId]: [...(previous[activeThread.matchId] || []), payload].sort(sortByOldest),
      }))
      setDraftMessage('')
      setUploadStatus('File sent.')
      await loadInbox()
    } catch (err) {
      setUploadStatus(err.message || 'Unable to upload file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function renderMessageBody(message) {
    const attachmentUrl = toAbsoluteAssetUrl(message?.attachment?.url || '')

    if (isImageMessage(message) && attachmentUrl) {
      return (
        <div className="space-y-1">
          {message.message ? <div>{message.message}</div> : null}
          <a href={attachmentUrl} target="_blank" rel="noreferrer">
            <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-56 rounded border" />
          </a>
        </div>
      )
    }

    if (isVideoMessage(message) && attachmentUrl) {
      return (
        <div className="space-y-1">
          {message.message ? <div>{message.message}</div> : null}
          <video src={attachmentUrl} controls className="max-h-56 rounded border w-full" />
        </div>
      )
    }

    if (message?.attachment?.url) {
      return (
        <div className="space-y-1">
          {message.message ? <div>{message.message}</div> : null}
          <a href={attachmentUrl} target="_blank" rel="noreferrer" className="underline">
            {message?.attachment?.name || 'Open file'}
          </a>
        </div>
      )
    }

    return <div>{message.message}</div>
  }

  async function sendMessage() {
    const token = getToken()
    if (!token || !activeThread?.matchId) return

    const content = draftMessage.trim()
    if (!content) return

    try {
      if (isLiveMessagingEnabled && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'chat_message',
          match_id: activeThread.matchId,
          token,
          message: content,
          message_type: 'text',
        }))
      } else {
        const created = await apiRequest(`/messages/${activeThread.matchId}`, {
          method: 'POST',
          token,
          body: {
            message: content,
            type: 'text',
          },
        })
        setMessagesByThread((previous) => ({
          ...previous,
          [activeThread.matchId]: [...(previous[activeThread.matchId] || []), created].sort(sortByOldest),
        }))
      }

      setDraftMessage('')
      await loadInbox()
    } catch (err) {
      setError(err.message || 'Unable to send message')
    }
  }

  const activeThreadDisplayName = formatDisplayName(activeThread?.name, activeThread?.senderId || activeThread?.matchId)
  const activeThreadInitials = getInitials(activeThreadDisplayName)
  const compactThreadId = truncateId(activeThread?.matchId, 18)

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 dark:bg-[#0f172a] dark:text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-6 p-4 lg:grid-cols-3 lg:p-6">
        <aside className="lg:col-span-1">
          <div className="flex h-full min-h-[72vh] flex-col rounded-2xl border border-[#E2E8F0] bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-[#1e293b]">
            <input className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-[#0f172a]" placeholder="Search chats" value={query} onChange={(event) => setQuery(event.target.value)} />

            <div className="mt-4 flex-1 space-y-4 overflow-auto pr-1">
              {loading && <div className="text-sm text-slate-500">Loading inbox...</div>}
              {!loading && error && <div className="text-sm text-red-600">{error}</div>}

              {!loading && !error && (
                <>
                  <section>
                    <h2 className="mb-2 text-sm font-semibold">Priority Inbox</h2>
                    <div className="space-y-2">
                      {filteredPriorityInbox.map((thread) => {
                        const threadName = formatDisplayName(thread.name, thread.senderId || thread.id)
                        return (
                          <button key={`priority-${thread.id}`} className={`w-full rounded-lg px-3 py-2 text-left transition ${activeThreadId === thread.id ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'}`} onClick={() => setActiveThreadId(thread.id)}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="truncate font-semibold">{threadName}</div>
                              <span className="text-[#0A66C2]">✓</span>
                            </div>
                            <div className="text-xs text-slate-500">{lockStatusLabel(thread.lock, thread)}</div>
                            <div className="truncate text-sm text-slate-500">{thread.last}</div>
                          </button>
                        )
                      })}
                      {filteredPriorityInbox.length === 0 && <p className="text-sm text-slate-500">No priority messages yet.</p>}
                    </div>
                  </section>

                  <section>
                    <h2 className="mb-2 text-sm font-semibold">Message Requests</h2>
                    <div className="space-y-2">
                      {filteredRequests.map((thread) => {
                        const threadName = formatDisplayName(thread.name, thread.senderId || thread.id)
                        return (
                          <div key={`request-${thread.id}`} className="rounded-lg border border-[#E2E8F0] p-2 dark:border-slate-700">
                            <button className={`w-full rounded px-2 py-1 text-left ${activeThreadId === thread.id ? 'bg-slate-100 dark:bg-slate-800' : ''}`} onClick={() => setActiveThreadId(thread.id)}>
                              <div className="truncate font-semibold">{threadName}</div>
                              <div className="text-xs text-slate-500">{lockStatusLabel(thread.lock, thread)}</div>
                              <div className="truncate text-sm text-slate-500">{thread.last}</div>
                            </button>
                            <div className="mt-2 flex gap-2">
                              {thread.isFriendThread && thread.friendRequestDirection === 'outgoing' ? <span className="text-xs text-slate-500">Waiting for user to accept.</span> : null}
                              {thread.isFriendThread && thread.friendRequestDirection === 'incoming' ? <button className="h-10 rounded-md bg-[#0A66C2] px-3 text-sm font-semibold text-white" onClick={() => updateRequestState(thread, 'accept')}>Accept Friend</button> : null}
                              {!thread.isFriendThread ? (
                                <>
                                  <button className="h-10 rounded-md bg-[#0A66C2] px-3 text-sm font-semibold text-white" onClick={() => updateRequestState(thread, 'accept')}>Accept</button>
                                  <button className="h-10 rounded-md border border-[#E2E8F0] px-3 text-sm font-semibold dark:border-slate-600" onClick={() => updateRequestState(thread, 'reject')}>Reject</button>
                                </>
                              ) : null}
                            </div>
                          </div>
                        )
                      })}
                      {filteredRequests.length === 0 && <p className="text-sm text-slate-500">No pending message requests.</p>}
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-2">
          <div className="flex h-full min-h-[72vh] flex-col rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1e293b]">
            {activeThread ? (
              <>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">{activeThreadInitials}</div>
                    <div>
                      <div className="font-semibold">{activeThreadDisplayName}</div>
                      <div className="text-sm text-slate-500">{priorityInbox.some((thread) => thread.id === activeThread.id) ? 'Priority Inbox' : 'Message Request'}</div>
                      <div className="text-xs text-slate-500">{lockStatusLabel(activeThread.lock, activeThread)}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="h-10 rounded-md border border-[#E2E8F0] px-3 text-sm font-semibold dark:border-slate-600" onClick={() => startInstantCall(activeThread)}>📹 Video Call</button>
                    <button className="h-10 rounded-md border border-[#E2E8F0] px-3 text-sm font-semibold dark:border-slate-600" onClick={() => startInstantCall(activeThread)}>📞 Audio Call</button>
                    <button className="h-10 rounded-md border border-[#E2E8F0] px-3 text-sm font-semibold dark:border-slate-600" onClick={() => scheduleCall(activeThread)}>📅 Schedule</button>
                  </div>
                </div>

                <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs dark:bg-[#0f172a]">
                  <div><span className="font-semibold">Live messaging:</span> {isLiveMessagingEnabled ? 'Enabled' : 'Disabled'} • {chatConnectionStatus}</div>
                  <button className="rounded border border-[#E2E8F0] px-2 py-1 dark:border-slate-600" onClick={() => setIsLiveMessagingEnabled((v) => !v)}>{isLiveMessagingEnabled ? 'Disable WS' : 'Enable WS'}</button>
                </div>

                {activeThread.lock?.status === 'request_access' && <button className="mb-2 h-10 w-fit rounded-md border border-[#E2E8F0] px-3 text-sm font-semibold dark:border-slate-600" onClick={() => requestConversationAccess(activeThread)}>Request Access</button>}

                {activeThread.lock?.status === 'claimed' && (
                  <div className="mb-2 flex items-center gap-2">
                    <select className="h-10 rounded border border-[#E2E8F0] px-2 text-sm dark:border-slate-600 dark:bg-[#0f172a]" value={targetAgentId} onChange={(event) => setTargetAgentId(event.target.value)}>
                      <option value="">Select agent to grant access</option>
                      {members.map((member) => <option key={member.id} value={member.id}>{member.name || member.email || truncateId(member.id, 10)}</option>)}
                    </select>
                    <button className="h-10 rounded-md bg-[#0A66C2] px-3 text-sm font-semibold text-white" onClick={() => grantConversationAccess(activeThread)}>Grant Access</button>
                  </div>
                )}

                {lockActionStatus && <div className="mb-2 text-sm text-[#0A66C2]">{lockActionStatus}</div>}
                {scheduleStatus && <div className="mb-2 text-sm text-[#0A66C2]">{scheduleStatus}</div>}

                <div className="mb-3 flex-1 overflow-auto">
                  <div className="space-y-3">
                    {activeMessages.length > 0 ? activeMessages.map((message) => {
                      const isOwn = message.sender_id === currentUser?.id
                      const messageName = isOwn ? 'You' : formatDisplayName(message.sender_name || message.sender_company_name, message.sender_id)
                      const avatarLabel = isOwn ? getInitials(currentUser?.name || 'You') : getInitials(messageName)
                      return (
                        <div key={message.id} className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          {!isOwn ? <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">{avatarLabel}</div> : null}
                          <div className={`max-w-[70%] break-words rounded-2xl px-3 py-2 text-sm shadow-sm ${isOwn ? 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white dark:from-[#1d4ed8] dark:to-[#1e40af]' : 'bg-slate-100 text-slate-800 dark:bg-[#0f172a] dark:text-slate-100'}`}>
                            <div className={`mb-1 text-xs ${isOwn ? 'text-blue-100' : 'text-slate-500'}`}>{messageName} • {new Date(message.timestamp).toLocaleTimeString()}</div>
                            {renderMessageBody(message)}
                          </div>
                          {isOwn ? <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">{avatarLabel}</div> : null}
                        </div>
                      )
                    }) : <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-500 dark:bg-[#0f172a]">No messages yet.</div>}

                    <div className="flex items-center justify-center gap-2 text-[0.75rem] text-[#94a3b8]">
                      <span>Match Thread: {showThreadInfo ? activeThread.matchId : compactThreadId}</span>
                      <button className="rounded border border-[#E2E8F0] px-1 dark:border-slate-600" onClick={() => setShowThreadInfo((value) => !value)}>{showThreadInfo ? 'Hide' : 'Info'}</button>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 text-[0.75rem] text-[#94a3b8] dark:bg-[#0f172a]">
                      <div className="mb-1 font-semibold">Call History</div>
                      {activeCallHistory.length > 0 ? activeCallHistory.slice(0, 3).map((call) => <div key={call.id} className="mb-1">{call.title} • {call.status} • {new Date(call.scheduled_for).toLocaleString()}</div>) : <div>No calls scheduled yet.</div>}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input className="h-10 flex-1 rounded-md border border-[#E2E8F0] px-3 text-sm dark:border-slate-600 dark:bg-[#0f172a]" placeholder="Write a message..." value={draftMessage} onChange={(event) => setDraftMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') sendMessage() }} />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) sendAttachment(file)
                      }}
                    />
                    <button className="h-10 rounded-md border border-[#E2E8F0] px-3 text-sm font-semibold dark:border-slate-600" onClick={() => fileInputRef.current?.click()} disabled={uploading}>📎</button>
                    <button className="h-10 rounded-md bg-[#0A66C2] px-4 text-sm font-semibold text-white" onClick={sendMessage}>Send</button>
                  </div>
                  <p className="text-xs text-slate-500">WS is used for live messaging and call signaling. Upload supports images, videos, and documents with preview.</p>
                  {uploadStatus ? <p className="text-xs text-[#0A66C2]">{uploadStatus}</p> : null}
                </div>
              </>
            ) : (
              <div className="my-auto text-center text-sm text-slate-500">Select a chat to begin</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )

}
