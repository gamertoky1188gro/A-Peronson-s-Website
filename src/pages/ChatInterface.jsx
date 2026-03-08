import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  CircleHelp,
  FolderOpen,
  Home,
  Info,
  MessageCircle,
  Mic,
  Phone,
  Plus,
  Search,
  Settings,
  Video,
  SendHorizontal,
  Linkedin,
  MessageSquareMore,
} from 'lucide-react'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:4000'

const CHAT_NAV_ITEMS = [
  { to: '/feed', label: 'Feed', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/notifications', label: 'Alerts', icon: Bell },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/contracts', label: 'Vault', icon: FolderOpen },
  { to: '/help', label: 'Help', icon: CircleHelp },
]



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
  const [messagesByThread, setMessagesByThread] = useState({})
  const [draftMessage, setDraftMessage] = useState('')
  const [isLiveMessagingEnabled, setIsLiveMessagingEnabled] = useState(true)
  const [, setChatConnectionStatus] = useState('offline')
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [showThreadInfo, setShowThreadInfo] = useState(false)

  const wsRef = useRef(null)
  const fileInputRef = useRef(null)
  const reconnectTimerRef = useRef(null)
  const currentUser = useMemo(() => getCurrentUser(), [])
  const navigate = useNavigate()
  const location = useLocation()

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
          setChatConnectionStatus('online')
          if (!String(payload.error || '').toLowerCase().includes('forbidden')) {
            setError(payload.error || 'Live messaging issue')
          }
        }
      }

      ws.onerror = () => {
        if (isActive) setChatConnectionStatus('online')
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
            <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-56 rounded-xl border border-white/10" />
          </a>
        </div>
      )
    }

    if (isVideoMessage(message) && attachmentUrl) {
      return (
        <div className="space-y-1">
          {message.message ? <div>{message.message}</div> : null}
          <video src={attachmentUrl} controls className="max-h-56 w-full rounded-xl border border-white/10" />
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
  const visibleError = String(error || '').toLowerCase().includes('forbidden') ? '' : error
  const liveOnline = isLiveMessagingEnabled

  return (
    <div className="min-h-screen bg-[#0f0f1b] bg-gradient-to-br from-[#0f0f1b] via-[#13132a] to-[#12162f] px-4 py-5 font-['Inter',sans-serif] text-white">
      <div className="mx-auto grid max-w-[1650px] grid-cols-1 gap-5 lg:grid-cols-[70px_350px_1fr_320px]">
        <aside className="rounded-[20px] border border-white/5 bg-[#16161e] p-2">
          <div className="flex h-full flex-col items-center justify-between py-1">
            <div className="space-y-2">
              {CHAT_NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.to
                return (
                  <Link key={item.to} to={item.to} className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border ${isActive ? 'border-[#8b5cf6]/70 bg-[#8b5cf6]/20 text-[#d4ff59]' : 'border-transparent bg-[#111119] text-[#a4a4bc] hover:border-white/10 hover:text-white'}`} title={item.label}>
                    {isActive ? <span className="absolute -left-2 h-6 w-1 rounded-full bg-[#d4ff70]" /> : null}
                    <Icon size={18} strokeWidth={1.8} />
                  </Link>
                )
              })}
            </div>
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#111119] text-[#a4a4bc] hover:text-white" onClick={() => navigate('/org-settings')}>
              <Settings size={18} strokeWidth={1.8} />
            </button>
          </div>
        </aside>

        <aside className="rounded-[20px] border border-white/5 bg-[#16161e] p-5">
          <h2 className="text-xl font-semibold">Messages</h2>
          <p className="mb-3 text-sm text-[#8e8eaa]">{currentUser?.email || 'inbox@gartexhub.com'}</p>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8eaa]" />
            <input className="h-11 w-full rounded-[20px] border border-white/20 bg-white pl-9 pr-3 text-sm text-[#19192b] placeholder:text-[#6f6f8d]" placeholder="Search Message..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>

          <div className="h-[calc(100vh-190px)] space-y-5 overflow-auto pr-1">
            {loading ? <div className="text-sm text-[#8e8eaa]">Loading inbox...</div> : null}
            {!loading && visibleError ? <div className="text-sm text-red-300">{visibleError}</div> : null}

            {!loading && !visibleError && (
              <>
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8e8eaa]">PRIORITY INBOX</h3>
                  <div className="space-y-3">
                    {filteredPriorityInbox.map((thread) => {
                      const threadName = formatDisplayName(thread.name, thread.senderId || thread.id)
                      return (
                        <button key={`priority-${thread.id}`} className={`w-full rounded-2xl border p-3 text-left ${activeThreadId === thread.id ? 'border-[#7b61ff]/60 bg-[#362f78]' : 'border-white/5 bg-[#111119]'}`} onClick={() => setActiveThreadId(thread.id)}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm font-semibold">{threadName}</div>
                              <div className="mt-0.5 text-xs text-[#8e8eaa]">{lockStatusLabel(thread.lock, thread)}</div>
                            </div>
                            <span className="rounded-full bg-[#d4ff70] px-2 py-0.5 text-[11px] font-semibold text-[#141414]">{Math.max(1, (thread.last || '').length % 12)}</span>
                          </div>
                          <div className="mt-1 truncate text-xs text-[#7f7f98]">{thread.last}</div>
                        </button>
                      )
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8e8eaa]">REQUESTS</h3>
                  <div className="space-y-3">
                    {filteredRequests.map((thread) => {
                      const threadName = formatDisplayName(thread.name, thread.senderId || thread.id)
                      return (
                        <div key={`request-${thread.id}`} className="rounded-2xl border border-white/5 bg-[#111119] p-3">
                          <button className="w-full text-left" onClick={() => setActiveThreadId(thread.id)}>
                            <div className="text-sm font-semibold">{threadName}</div>
                            <div className="text-xs text-[#8e8eaa]">{lockStatusLabel(thread.lock, thread)}</div>
                          </button>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {thread.isFriendThread && thread.friendRequestDirection === 'outgoing' ? <span className="text-xs text-[#8e8eaa]">Pending approval.</span> : null}
                            {thread.isFriendThread && thread.friendRequestDirection === 'incoming' ? <button className="rounded-lg bg-[#8b5cf6] px-3 py-1.5 text-xs font-semibold" onClick={() => updateRequestState(thread, 'accept')}>Accept Friend</button> : null}
                            {!thread.isFriendThread ? (
                              <>
                                <button className="rounded-lg bg-[#8b5cf6] px-3 py-1.5 text-xs font-semibold" onClick={() => updateRequestState(thread, 'accept')}>Accept</button>
                                <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold" onClick={() => updateRequestState(thread, 'reject')}>Reject</button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      )
                    })}
                    {filteredRequests.length === 0 ? <div className="text-sm text-[#8e8eaa]">No pending requests.</div> : null}
                  </div>
                </section>
              </>
            )}
          </div>
        </aside>

        <main className="rounded-[20px] border border-white/5 bg-[#16161e] p-5">
          {activeThread ? (
            <>
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/5 bg-[#111119] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7b61ff]/25 text-sm font-semibold">{activeThreadInitials}</div>
                  <div>
                    <div className="text-base font-semibold">{activeThreadDisplayName}</div>
                    <div className="text-xs text-[#8e8eaa]">{lockStatusLabel(activeThread.lock, activeThread)}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex h-10 items-center gap-1 rounded-xl border border-white/40 bg-transparent px-3 text-sm font-medium text-white" onClick={() => startInstantCall(activeThread)}><Video size={14} /> Video</button>
                  <button className="inline-flex h-10 items-center gap-1 rounded-xl border border-white/40 bg-transparent px-3 text-sm font-medium text-white" onClick={() => startInstantCall(activeThread)}><Mic size={14} /> Audio</button>
                  <button className="inline-flex h-10 items-center gap-1 rounded-xl border border-white/40 bg-transparent px-3 text-sm font-medium text-white" onClick={() => scheduleCall(activeThread)}><Phone size={14} /> Schedule</button>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between rounded-xl border border-white/5 bg-[#121225] p-3 text-xs text-[#c2c4dc]">
                <div className="inline-flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${liveOnline ? 'bg-[#d4ff70]' : 'bg-slate-500'}`} />
                  <span>Live: Enabled • {liveOnline ? 'online' : 'offline'}</span>
                </div>
                <button className="rounded-md border border-white/20 px-2 py-1" onClick={() => setIsLiveMessagingEnabled((value) => !value)}>{isLiveMessagingEnabled ? 'Disable WS' : 'Enable WS'}</button>
              </div>

              <div className="h-[calc(100vh-330px)] space-y-3 overflow-auto rounded-2xl border border-white/10 bg-[#0d0f2a] p-3">
                {activeMessages.length > 0 ? activeMessages.map((message) => {
                  const isOwn = message.sender_id === currentUser?.id
                  const messageName = isOwn ? 'You' : formatDisplayName(message.sender_name || message.sender_company_name, message.sender_id)
                  const avatarLabel = isOwn ? getInitials(currentUser?.name || 'You') : getInitials(messageName)
                  return (
                    <div key={message.id} className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      {!isOwn ? <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a3a] text-[11px] font-semibold">{avatarLabel}</div> : null}
                      <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${isOwn ? 'bg-[#6c5ce7] text-white' : 'bg-[#1e1e2f] text-white'}`}>
                        <div className="mb-1 text-[11px] text-[#b7b7cc]">{messageName} • {new Date(message.timestamp).toLocaleTimeString()}</div>
                        {renderMessageBody(message)}
                      </div>
                      {isOwn ? <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2a3a] text-[11px] font-semibold">{avatarLabel}</div> : null}
                    </div>
                  )
                }) : <div className="text-sm text-[#8e8eaa]">No messages yet.</div>}
              </div>

              <div className="mt-2 flex items-center justify-between text-[0.75rem] text-[#94a3b8]">
                <span>Match Thread: {showThreadInfo ? activeThread.matchId : compactThreadId}</span>
                <button className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2" onClick={() => setShowThreadInfo((value) => !value)}><Info size={12} /> {showThreadInfo ? 'Hide' : 'Info'}</button>
              </div>

              <div className="relative mt-3 rounded-2xl border border-white/10 bg-[#0f1335] p-2">
                <input className="h-12 w-full rounded-2xl bg-white pl-12 pr-28 text-sm text-[#19192b] placeholder:text-[#707090]" placeholder="Type a message..." value={draftMessage} onChange={(event) => setDraftMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') sendMessage() }} />
                <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) sendAttachment(file) }} />
                <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg border border-[#d6d6ea] bg-white p-2 text-[#2c2f45]" onClick={() => fileInputRef.current?.click()} disabled={uploading}><Plus size={14} /></button>
                <button className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-xl bg-[#d4ff70] px-4 py-2 text-sm font-semibold text-[#101018]" onClick={sendMessage}><SendHorizontal size={14} /> Send</button>
              </div>
              {uploadStatus ? <p className="mt-2 text-xs text-[#9db2ff]">{uploadStatus}</p> : null}
              {scheduleStatus ? <p className="mt-1 text-xs text-[#9db2ff]">{scheduleStatus}</p> : null}
            </>
          ) : <div className="flex h-full items-center justify-center text-sm text-[#8e8eaa]">Select a chat to begin</div>}
        </main>

        <aside className="rounded-[20px] border border-white/5 bg-[#16161e] p-5">
          {activeThread ? (
            <>
              <div className="mb-4 rounded-2xl border border-white/5 bg-[#131327] p-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#7b61ff]/25 text-xl font-semibold">{activeThreadInitials}</div>
                <div className="text-xl font-semibold">{activeThreadDisplayName}</div>
                <div className="mt-1 text-sm text-[#b3b5cc]">@{truncateId(activeThread.senderId || activeThread.matchId, 12)}</div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#111120] p-4 text-sm">
                <div className="mb-2 font-semibold text-white">Call History</div>
                {activeCallHistory.length > 0 ? activeCallHistory.slice(0, 5).map((call) => (
                  <div key={call.id} className="mb-2 rounded-lg bg-[#1a1a2a] p-2 text-xs text-[#bec3de]">{call.title} - {call.status} - {new Date(call.scheduled_for).toLocaleDateString()}</div>
                )) : <div className="text-xs text-[#b3b5cc]">No calls scheduled yet.</div>}
              </div>
            </>
          ) : <div className="text-sm text-[#b3b5cc]">Thread details appear here.</div>}
        </aside>
      </div>
    </div>
  )
}

