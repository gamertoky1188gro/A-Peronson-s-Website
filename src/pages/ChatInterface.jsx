import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  EllipsisVertical,
  Filter,
  Flag,
  FolderOpen,
  Home,
  Info,
  Lock,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  SendHorizontal,
  VolumeX,
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

const SOCIAL_CATEGORIES = [
  { id: 'x', name: 'X', label: 'X', badge: 12, bg: '#111111' },
  { id: 'instagram', name: 'Instagram', label: 'IG', badge: 24, bg: 'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)' },
  { id: 'whatsapp', name: 'WhatsApp', label: 'WA', badge: 132, bg: '#25D366' },
  { id: 'linkedin', name: 'LinkedIn', label: 'in', badge: 2, bg: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', label: 'TT', badge: 16, bg: '#0f0f10' },
]

const PANEL_STYLE = {
  background: 'linear-gradient(160deg, rgba(20,22,45,0.95), rgba(15,18,36,0.88))',
  border: '1px solid rgba(212,255,89,0.08)',
  boxShadow: '0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)',
}



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

function formatTime(iso) {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()
}

function extractFirstUrl(text = '') {
  const match = String(text).match(/https?:\/\/[^\s]+/i)
  return match ? match[0] : ''
}

function avatarUrl(seed = 'user') {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`
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
  const [accordionState, setAccordionState] = useState({
    sharedDocument: true,
    sharedMedia: true,
    sharedPost: true,
  })

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

  const sharedMedia = useMemo(() => {
    return activeMessages.filter((message) => isImageMessage(message) && message?.attachment?.url).slice(-9).reverse()
  }, [activeMessages])

  const sharedLinks = useMemo(() => {
    return activeMessages.filter((message) => message?.attachment?.url && !isImageMessage(message)).slice(-6).reverse()
  }, [activeMessages])

  const sharedPosts = useMemo(() => {
    return activeMessages.filter((message) => String(message?.message || '').trim().length > 0).slice(-6).reverse()
  }, [activeMessages])

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

    const firstUrl = extractFirstUrl(message?.message || '')
    if (firstUrl) {
      return (
        <div className="space-y-2">
          <p>{message.message.replace(firstUrl, '').trim() || 'Link shared'}</p>
          <a href={firstUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/10 bg-black/20 p-2">
            <div className="mb-2 h-24 overflow-hidden rounded-lg bg-[#1f2448]">
              <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80" alt="Raven.cafe preview" className="h-full w-full object-cover" />
            </div>
            <div className="text-sm font-semibold">Raven.cafe</div>
            <div className="text-xs text-[#d2d4eb]">Casual hangout in the centre of kotagede.</div>
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
  const activeAvatar = avatarUrl(activeThreadDisplayName)
  const visibleError = String(error || '').toLowerCase().includes('forbidden') ? '' : error

  return (
    <div
      className="min-h-screen px-4 py-5 font-['Poppins',sans-serif] text-white"
      style={{
        background:
          'radial-gradient(circle at 10% 10%, rgba(124,58,237,0.25), transparent 35%), radial-gradient(circle at 90% 15%, rgba(59,130,246,0.2), transparent 35%), #0B0E14',
      }}
    >
      <div className="mx-auto grid max-w-[1700px] grid-cols-1 gap-4 lg:grid-cols-[62px_286px_minmax(560px,1fr)_356px]">
        <aside className="rounded-[22px] p-2" style={PANEL_STYLE}>
          <div className="flex h-full flex-col items-center justify-between py-1">
            <div className="space-y-2">
              {CHAT_NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-[12px] border ${
                      isActive
                        ? 'border-[#9e7bff] bg-[#6e4ff6]/20 text-[#D4FF59]'
                        : 'border-white/5 bg-[#0f1126] text-[#8f95bb] hover:border-white/10 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </Link>
                )
              })}
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/10 bg-[#0f1126] text-[#8f95bb] hover:text-[#D4FF59]"
              onClick={() => navigate('/login')}
              title="Logout"
            >
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          </div>
        </aside>

        <aside className="rounded-[24px] p-4" style={PANEL_STYLE}>
          <div className="mb-3">
            <h2 className="text-lg font-semibold">Message category</h2>
            <p className="text-xs text-[#8e93b4]">{currentUser?.email || 'hussein.saddam@gmail.com'}</p>
          </div>

          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3c6]" />
            <input
              className="h-10 w-full rounded-[12px] border border-white/15 bg-white/10 pl-9 pr-11 text-[13px] text-white placeholder:text-[#a0a5c6] backdrop-blur"
              placeholder="Search Message..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8bddf]" />
          </div>

          <div className="mb-4 space-y-2">
            {SOCIAL_CATEGORIES.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-[12px] border border-white/5 bg-[#0f1126] px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs text-white" style={{ background: item.bg }}>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-[11px] text-[#8e93b4]">{item.name.toLowerCase()}</div>
                  </div>
                </div>
                <span className="rounded-full bg-[#2a2d4f] px-2 py-0.5 text-[11px] font-semibold text-[#d7dcff]">{item.badge}</span>
              </div>
            ))}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Direct Message</h3>
            <span className="rounded-md bg-[#22264a] px-2 py-1 text-[11px] text-[#cad0f3]">Newest</span>
          </div>

          <div className="h-[calc(100vh-562px)] min-h-[220px] space-y-2 overflow-auto pr-1">
            {loading ? <div className="text-sm text-[#9ca3c6]">Loading inbox...</div> : null}
            {!loading && visibleError ? <div className="text-sm text-red-300">{visibleError}</div> : null}
            {!loading &&
              !visibleError &&
              [...filteredPriorityInbox, ...filteredRequests].map((thread) => {
                const threadName = formatDisplayName(thread.name, thread.senderId || thread.id)
                return (
                  <button
                    key={thread.id}
                    className={`w-full rounded-[14px] border px-3 py-2 text-left ${
                      activeThreadId === thread.id ? 'border-[#8c6bff]/70 bg-[#2f295c]' : 'border-white/5 bg-[#101328]'
                    }`}
                    onClick={() => setActiveThreadId(thread.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img src={avatarUrl(threadName)} alt={`${threadName} avatar`} className="h-8 w-8 rounded-full" />
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#0f1126] bg-[#28d368]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[13px] font-semibold">{threadName}</p>
                          <span className="text-[11px] text-[#97a0c6]">{formatTime(thread.timestamp)}</span>
                        </div>
                        <p className="truncate text-xs text-[#8e93b4]">{thread.last}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
          </div>
        </aside>

        <main className="rounded-[24px] p-4" style={PANEL_STYLE}>
          {activeThread ? (
            <>
              <div className="mb-4 flex items-center justify-between rounded-[16px] border border-white/10 bg-[#131739] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={activeAvatar} alt={`${activeThreadDisplayName} profile`} className="h-10 w-10 rounded-full" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#131739] bg-[#28d368]" />
                  </div>
                  <div>
                    <p className="font-semibold">{activeThreadDisplayName}</p>
                    <p className="text-xs text-[#a1a8cf]">Online • {lockStatusLabel(activeThread.lock, activeThread)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28d368]" />
                  <button className="rounded-[12px] border border-white/10 bg-white/5 p-2 hover:bg-white/10">
                    <EllipsisVertical size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between text-xs text-[#8e93b4]">
                <span>{isLiveMessagingEnabled ? 'Realtime connected' : 'Realtime paused'}</span>
                <button className="rounded-md border border-white/15 px-2 py-1" onClick={() => setIsLiveMessagingEnabled((value) => !value)}>
                  {isLiveMessagingEnabled ? 'Disable WS' : 'Enable WS'}
                </button>
              </div>

              <div className="h-[calc(100vh-322px)] space-y-3 overflow-auto rounded-[18px] border border-white/10 bg-[#0d1030] p-4">
                <div className="text-center text-xs text-[#787ea6]">Today</div>
                {activeMessages.length > 0 ? (
                  activeMessages.map((message) => {
                    const isOwn = message.sender_id === currentUser?.id
                    return (
                      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[68%] rounded-[16px] px-3 py-2.5 text-[13px] leading-5 ${isOwn ? 'bg-gradient-to-r from-[#7f4dff] to-[#b86cff] text-white' : 'bg-[#2a2744] text-white'}`}>
                          {renderMessageBody(message)}
                          <div className="mt-1.5 text-right text-[10px] text-white/65">{formatTime(message.timestamp)}</div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-sm text-[#9ca3c6]">No messages yet.</div>
                )}
              </div>

              <div className="relative mt-4 rounded-[16px] border border-white/15 bg-[#12163a] p-2">
                <input
                  className="h-11 w-full rounded-[12px] border border-white/10 bg-[#0b0f2d] pl-11 pr-28 text-[13px] text-white placeholder:text-[#7f86ae]"
                  placeholder="Type a message..."
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') sendMessage() }}
                />
                <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) sendAttachment(file) }} />
                <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-[10px] border border-white/15 bg-[#1e2146] p-2 text-[#d4d8ff]" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <Plus size={13} strokeWidth={1.6} />
                </button>
                <button className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-[10px] bg-[#D4FF59] px-3.5 py-2 text-[13px] font-semibold text-[#111723]" onClick={sendMessage}>
                  Send <SendHorizontal size={12} strokeWidth={1.9} />
                </button>
              </div>
              {uploadStatus ? <p className="mt-2 text-xs text-[#a8b3e7]">{uploadStatus}</p> : null}
              {scheduleStatus ? <p className="mt-1 text-xs text-[#a8b3e7]">{scheduleStatus}</p> : null}
            </>
          ) : <div className="flex h-full items-center justify-center text-sm text-[#8e8eaa]">Select a chat to begin</div>}
        </main>

        <aside className="rounded-[24px] p-4" style={PANEL_STYLE}>
          {activeThread ? (
            <>
              <div className="mb-4 rounded-[16px] border border-white/10 bg-[#11152f] p-5 text-center">
                <img src={activeAvatar} alt={`${activeThreadDisplayName} avatar`} className="mx-auto mb-3 h-[78px] w-[78px] rounded-full" />
                <p className="text-xl font-semibold">{activeThreadDisplayName}</p>
                <p className="text-sm text-[#97a0c8]">@{truncateId(activeThread.senderId || activeThread.matchId, 14)}</p>
              </div>

              <div className="mb-4 grid grid-cols-4 gap-2">
                <button className="rounded-[10px] border border-white/10 bg-[#11152f] p-2 text-[#c9cef4]"><Flag size={14} strokeWidth={1.6} className="mx-auto" /></button>
                <button className="rounded-[10px] border border-white/10 bg-[#11152f] p-2 text-[#c9cef4]"><Lock size={14} strokeWidth={1.6} className="mx-auto" /></button>
                <button className="rounded-[10px] border border-white/10 bg-[#11152f] p-2 text-[#c9cef4]"><Info size={14} strokeWidth={1.6} className="mx-auto" /></button>
                <button className="rounded-[10px] border border-white/10 bg-[#11152f] p-2 text-[#c9cef4]"><VolumeX size={14} strokeWidth={1.6} className="mx-auto" /></button>
              </div>

              <div className="space-y-3">
                <section className="rounded-[14px] border border-white/10 bg-[#11152f]">
                  <button className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold" onClick={() => setAccordionState((value) => ({ ...value, sharedDocument: !value.sharedDocument }))}>
                    Shared Document
                    <span>{accordionState.sharedDocument ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                  </button>
                  {accordionState.sharedDocument ? (
                    <div className="border-t border-white/10 px-3 py-2 text-xs text-[#a9b1d7]">
                      {sharedLinks.length > 0 ? sharedLinks.map((item) => (
                        <a key={item.id} href={toAbsoluteAssetUrl(item.attachment?.url || '')} target="_blank" rel="noreferrer" className="mb-2 block rounded-lg bg-[#1a1f43] px-2 py-2">
                          {item.attachment?.name || 'Attachment'}
                        </a>
                      )) : <span>No shared files yet.</span>}
                    </div>
                  ) : null}
                </section>

                <section className="rounded-[14px] border border-white/10 bg-[#11152f]">
                  <button className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold" onClick={() => setAccordionState((value) => ({ ...value, sharedMedia: !value.sharedMedia }))}>
                    Shared Media
                    <span>{accordionState.sharedMedia ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                  </button>
                  {accordionState.sharedMedia ? (
                    <div className="border-t border-white/10 px-3 py-3">
                      <div className="mb-3 grid grid-cols-3 gap-2">
                        {sharedMedia.length > 0 ? sharedMedia.slice(0, 6).map((item) => (
                          <a key={item.id} href={toAbsoluteAssetUrl(item.attachment?.url || '')} target="_blank" rel="noreferrer">
                            <img src={toAbsoluteAssetUrl(item.attachment?.url || '')} alt="shared media" className="h-[62px] w-full rounded-[9px] object-cover" />
                          </a>
                        )) : Array.from({ length: 6 }).map((_, index) => (
                          <img key={`media-ph-${index}`} src={`https://picsum.photos/seed/chat-media-${index}/180/120`} alt="media placeholder" className="h-[62px] w-full rounded-[9px] object-cover" />
                        ))}
                      </div>
                      <button className="w-full rounded-full bg-[#D4FF59] px-4 py-2 text-[12px] font-semibold text-[#111723]">View All (1647)</button>
                    </div>
                  ) : null}
                </section>

                <section className="rounded-[14px] border border-white/10 bg-[#11152f]">
                  <button className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold" onClick={() => setAccordionState((value) => ({ ...value, sharedPost: !value.sharedPost }))}>
                    Shared Post
                    <span>{accordionState.sharedPost ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                  </button>
                  {accordionState.sharedPost ? (
                    <div className="border-t border-white/10 px-3 py-3">
                      <div className="grid grid-cols-3 gap-2">
                        {(sharedMedia.length > 0 ? sharedMedia.slice(0, 6) : Array.from({ length: 6 }).map((_, index) => ({ id: `post-${index}`, attachment: { url: `https://picsum.photos/seed/chat-post-${index}/180/120` } }))).map((item) => (
                          <img key={item.id} src={toAbsoluteAssetUrl(item.attachment?.url || '')} alt="shared post" className="h-[62px] w-full rounded-[9px] object-cover" />
                        ))}
                      </div>
                      {sharedPosts.length > 0 ? <p className="mt-2 text-[11px] text-[#a9b1d7]">{sharedPosts[0].message.slice(0, 52)}</p> : null}
                    </div>
                  ) : null}
                </section>
              </div>
            </>
          ) : <div className="text-sm text-[#b3b5cc]">Thread details appear here.</div>}
        </aside>
      </div>
    </div>
  )
}

