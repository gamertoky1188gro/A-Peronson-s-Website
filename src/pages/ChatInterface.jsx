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
  Phone,
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



const PANEL_STYLE = {
  background: 'rgb(16, 13, 34)',
  border: 'none',
  boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
}

const RIGHT_PANEL_STYLE = {
  background: '#100D22',
  border: 'none',
  boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
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
        avatar: message.sender_avatar_url || message.sender_avatar || '',
        senderId: message.sender_id,
        verified: Boolean(message.sender_verified),
        last: String(message.message || '').trim(),
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
        last: String(message.message || '').trim() || existing.last,
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
  const cleaned = String(fallbackId || '')
    .replace(/^friend:/i, '')
    .replace(/[_:.@-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned || 'Unknown contact'
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

function avatarUrl(avatar = '') {
  return String(avatar || '').trim()
}

function dateDividerLabel(iso) {
  if (!iso) return 'Recent'
  const date = new Date(iso)
  const now = new Date()
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const dayDiff = Math.floor((startToday - startDate) / 86400000)
  if (dayDiff <= 0) return 'Today'
  if (dayDiff === 1) return 'Yesterday'
  return date.toLocaleDateString()
}

function formatPresence(iso) {
  if (!iso) return 'No recent activity'
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 2) return 'Online'
  if (mins < 60) return `Last seen ${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Last seen ${hours}h ago`
  return `Last seen ${new Date(iso).toLocaleDateString()}`
}

function linkPreviewMeta(url = '') {
  try {
    const parsed = new URL(url)
    return {
      host: parsed.hostname.replace(/^www\./i, ''),
      title: parsed.hostname.replace(/^www\./i, ''),
      description: parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : 'Shared link',
    }
  } catch {
    return { host: 'link', title: 'Shared link', description: url || 'Open link' }
  }
}

export default function ChatInterface() {
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('chat-theme-mode') || 'dark'
    } catch {
      return 'dark'
    }
  })
  const [priorityInbox, setPriorityInbox] = useState([])
  // ... rest of state ...
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
  const [presenceMap, setPresenceMap] = useState({})
  const [notice, setNotice] = useState(null)

  const wsRef = useRef(null)
  const fileInputRef = useRef(null)
  const reconnectTimerRef = useRef(null)
  const currentUser = useMemo(() => getCurrentUser(), [])
  const navigate = useNavigate()
  const location = useLocation()
  const isLight = themeMode === 'light'

  const presenceStatus = useCallback((userId) => presenceMap?.[userId]?.status || 'offline', [presenceMap])
  const presenceLastSeen = useCallback((userId) => presenceMap?.[userId]?.last_seen || null, [presenceMap])

  const theme = useMemo(() => ({
    pageBg: isLight ? '#f8fafc' : 'rgb(4, 0, 23)',
    panelBg: isLight ? '#ffffff' : 'rgb(16, 13, 34)',
    rightPanelBg: isLight ? '#ffffff' : '#100D22',
    subPanelBg: isLight ? '#fcfdfe' : '#100D22',
    tileBg: isLight ? '#f1f5f9' : '#171031',
    threadIdleBg: isLight ? 'transparent' : '#101328',
    threadActiveBg: isLight ? '#f0f7ff' : '#2f295c',
    textPrimary: isLight ? '#1e293b' : '#ffffff',
    textMuted: isLight ? '#64748b' : '#8e93b4',
    inputBg: isLight ? '#f1f5f9' : '#171031',
    shadow: isLight ? '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)' : '0 10px 40px rgba(0,0,0,0.45)',
    accent: '#4f46e5',
  }), [isLight])

  useEffect(() => {
    try {
      localStorage.setItem('chat-theme-mode', themeMode)
    } catch {
      // no-op
    }
  }, [themeMode])

  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

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
    return activeMessages.filter((message) => message?.type === 'post').slice(-6).reverse()
  }, [activeMessages])

  const participantIds = useMemo(() => {
    const ids = new Set()
    activeMessages.forEach((m) => {
      if (m.sender_id) ids.add(m.sender_id)
    })
    if (activeThread?.senderId) ids.add(activeThread.senderId)
    if (currentUser?.id) ids.add(currentUser.id)
    return Array.from(ids)
  }, [activeMessages, activeThread, currentUser])

  useEffect(() => {
    if (!activeThread?.matchId) return
    loadThreadMessages(activeThread.matchId)
  }, [activeThread, loadThreadMessages])

  const refreshPresence = useCallback(async (ids) => {
    const token = getToken()
    if (!token || !ids || ids.length === 0) return
    try {
      const data = await apiRequest('/presence', { method: 'POST', token, body: { user_ids: ids } })
      if (data?.presence) setPresenceMap(data.presence)
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    if (participantIds.length === 0) return
    refreshPresence(participantIds)
  }, [participantIds, refreshPresence])

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

    const participantIds = new Set()
    activeMessages.forEach((message) => {
      if (message?.sender_id) participantIds.add(message.sender_id)
    })
    if (thread.senderId) participantIds.add(thread.senderId)
    if (currentUser?.id) participantIds.delete(currentUser.id)

    setScheduleStatus('Starting call room...')
    try {
      const result = await apiRequest('/calls/join', {
        method: 'POST',
        token,
        body: {
          match_id: thread.matchId,
          chat_thread_id: thread.matchId,
          title: `Call with ${thread.name}`,
          participant_ids: [...participantIds],
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
          {message.message ? <div className="mb-1">{message.message}</div> : null}
          <a href={attachmentUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-slate-100 dark:border-transparent">
            <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-64 w-full object-cover" />
          </a>
        </div>
      )
    }

    if (isVideoMessage(message) && attachmentUrl) {
      return (
        <div className="space-y-1">
          {message.message ? <div className="mb-1">{message.message}</div> : null}
          <video src={attachmentUrl} controls className="max-h-64 w-full rounded-xl" />
        </div>
      )
    }

    if (message?.attachment?.url) {
      return (
        <div className="space-y-1">
          {message.message ? <div className="mb-1">{message.message}</div> : null}
          <a href={attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-blue-600 underline dark:bg-black/20">
            <Plus size={14} />
            {message?.attachment?.name || 'Open file'}
          </a>
        </div>
      )
    }

    const firstUrl = extractFirstUrl(message?.message || '')
    if (firstUrl) {
      const meta = linkPreviewMeta(firstUrl)
      return (
        <div className="space-y-2">
          <p>{message.message.replace(firstUrl, '').trim() || 'Link shared'}</p>
          <a href={firstUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-transparent dark:bg-black/20">
            <div className="mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]">
              {meta.host}
            </div>
            <div className="text-sm font-semibold">{meta.title}</div>
            <div className="text-xs opacity-70">{meta.description}</div>
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
  const activeAvatar = avatarUrl(activeThread?.avatar)
  const visibleError = String(error || '').toLowerCase().includes('forbidden') ? '' : error
  const todayLabel = dateDividerLabel(activeMessages[activeMessages.length - 1]?.timestamp)

  return (
    <div
      className="h-screen w-screen font-['Poppins',sans-serif] text-white chat-interface-container overflow-hidden"
      style={{
        background: theme.pageBg,
        color: theme.textPrimary,
      }}
    >
      <style>{`
        .chat-interface-container *,
        .chat-interface-container *:before,
        .chat-interface-container *:after {
          border-color: ${isLight ? '#e2e8f0' : 'transparent'} !important;
          box-shadow: none !important;
          outline: none !important;
        }
        .chat-interface-container img {
          border: none !important;
        }
        .chat-interface-container input::placeholder {
          color: ${isLight ? '#94a3b8' : '#7f86ae'} !important;
        }
      `}</style>
      {notice ? (
        <div className="mx-3 mt-2 rounded-xl px-4 py-3 text-sm font-medium shadow-sm"
          style={{ background: notice.type === 'error' ? '#fee2e2' : '#e0f2fe', color: '#0f172a' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[13px] font-semibold">{notice.title || 'Notice'}</div>
              <div className="text-[12px] opacity-80">{notice.message || ''}</div>
            </div>
            <button onClick={() => setNotice(null)} className="text-xs font-semibold">Dismiss</button>
          </div>
        </div>
      ) : null}
      <div className="grid h-full w-full grid-cols-1 gap-2 p-2 md:grid-cols-[62px_1fr] lg:grid-cols-[62px_minmax(260px,22vw)_1fr] xl:grid-cols-[62px_minmax(260px,20vw)_1fr_minmax(280px,22vw)]">
        <aside className="hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1" style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
          <div className="space-y-2">
            <button
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] border-none shadow-none text-lg transition-colors ${
                isLight ? 'bg-white text-orange-400 shadow-sm' : 'bg-[#171031] text-[#D4FF59]'
              }`}
              onClick={() => setThemeMode((value) => (value === 'light' ? 'dark' : 'light'))}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? '☀️' : '🌙'}
            </button>
            {CHAT_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-all ${
                    isActive
                      ? (isLight ? 'bg-[#6366f1] text-white' : 'bg-[#6e4ff6]/20 text-[#D4FF59]')
                      : (isLight ? 'text-slate-400 hover:bg-white hover:text-[#6366f1]' : 'bg-[#171031] text-[#8f95bb] hover:text-white')
                  }`}
                  title={item.label}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </Link>
              )
            })}
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors"
            style={{ background: isLight ? '#ffffff' : theme.tileBg, color: isLight ? '#ef4444' : '#8f95bb' }}
            onClick={() => navigate('/login')}
            title="Logout"
          >
            <LogOut size={18} strokeWidth={1.5} />
          </button>
        </aside>

        <aside className="hidden lg:block rounded-[24px] p-5 overflow-hidden border border-slate-200/50 dark:border-none" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
          </div>

          <div className="relative mb-6">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full appearance-none rounded-[14px] border border-transparent pl-10 pr-11 text-[13px] outline-none transition-all focus:border-[#6366f1]/50"
              style={{ background: theme.inputBg, color: theme.textPrimary }}
              placeholder="Search conversations..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>Direct Messages</h3>
            <span className="text-[10px] font-bold text-[#6366f1]">{allVisibleThreads.length}</span>
          </div>

          <div className="h-[calc(100vh-250px)] space-y-1 overflow-auto pr-1 custom-scrollbar">
            {loading ? <div className="p-4 text-center text-sm text-slate-400">Loading inbox...</div> : null}
            {!loading && visibleError ? <div className="p-4 text-center text-sm text-red-400">{visibleError}</div> : null}
            {!loading &&
              !visibleError &&
              [...filteredPriorityInbox, ...filteredRequests].map((thread) => {
                const threadName = formatDisplayName(thread.name, thread.senderId || thread.id)
                const isActive = activeThreadId === thread.id
                return (
                  <button
                    key={thread.id}
                    className="group w-full rounded-[16px] px-3 py-3 text-left transition-all"
                    style={{ background: isActive ? theme.threadActiveBg : 'transparent' }}
                    onClick={() => setActiveThreadId(thread.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        {thread.avatar ? (
                          <img src={avatarUrl(thread.avatar)} alt={threadName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold shadow-sm ${isActive ? 'bg-[#6366f1] text-white' : 'bg-slate-100 text-slate-500'}`}>{getInitials(threadName)}</div>
                        )}
                        <span
                          className="absolute bottom-0 right-0 h-3 w-3 rounded-full"
                          style={{ background: presenceStatus(thread.senderId) === 'online' ? '#22c55e' : '#94a3b8', border: '2px solid transparent' }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`truncate text-[14px] font-semibold ${isActive ? 'text-[#6366f1]' : ''}`}>{threadName}</p>
                          <span className="flex-shrink-0 text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
                        </div>
                        <p className={`truncate text-xs ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>{thread.last || 'No messages'}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
          </div>
        </aside>

        <main className="rounded-[24px] p-0 flex flex-col h-full overflow-hidden border border-slate-200/50 dark:border-none" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {activeAvatar ? (
                      <img src={activeAvatar} alt={activeThreadDisplayName} className="h-10 w-10 rounded-full object-cover shadow-sm" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{activeThreadInitials}</div>
                    )}
                    <span
                      className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full"
                      style={{ background: presenceStatus(activeThread?.senderId) === 'online' ? '#22c55e' : '#94a3b8', border: '2px solid transparent' }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">{activeThreadDisplayName}</p>
                    <p className="text-[11px] font-medium text-slate-400">
                      {presenceStatus(activeThread?.senderId) === 'online'
                        ? 'Online'
                        : formatPresence(presenceLastSeen(activeThread?.senderId))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => startInstantCall(activeThread)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50"
                    title="Start call"
                  >
                    <Phone size={16} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
                    <Search size={16} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
                    <EllipsisVertical size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-auto p-6 custom-scrollbar" style={{ background: isLight ? '#f8fafc' : 'transparent' }}>
                <div className="flex justify-center mb-6">
                  <span className="rounded-full bg-transparent border border-slate-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:text-slate-600">{todayLabel}</span>
                </div>
                {activeMessages.length > 0 ? (
                  activeMessages.map((message) => {
                    const isOwn = message.sender_id === currentUser?.id
                    return (
                      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`group relative max-w-[80%] sm:max-w-[70%] rounded-[20px] px-4 py-3 text-[13.5px] shadow-sm transition-all ${
                          isOwn 
                            ? 'bg-[#6366f1] text-white rounded-br-none' 
                            : `${isLight ? 'bg-white border border-slate-100' : 'bg-[#2a2744]'} rounded-bl-none`
                        }`} style={!isOwn ? { color: theme.textPrimary } : undefined}>
                          {renderMessageBody(message)}
                          <div className={`mt-1 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-60 ${isOwn ? 'text-white' : 'text-slate-400'}`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400 italic">No messages yet. Start the conversation!</div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="relative flex items-center gap-2 rounded-[18px] p-1.5" style={{ background: theme.inputBg }}>
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Plus size={20} />
                  </button>
                  <input
                    className="flex-1 bg-transparent px-2 text-[14px] outline-none placeholder:text-slate-400"
                    style={{ color: theme.textPrimary }}
                    placeholder="Write a message..."
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={(event) => { if (event.key === 'Enter') sendMessage() }}
                  />
                  <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) sendAttachment(file) }} />
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-md transition-transform hover:scale-105 active:scale-95" onClick={sendMessage}>
                    <SendHorizontal size={18} />
                  </button>
                </div>
                {uploadStatus || scheduleStatus ? (
                  <p className="mt-2 px-4 text-[11px] font-medium text-[#6366f1]">{uploadStatus || scheduleStatus}</p>
                ) : null}
              </div>
            </>
          ) : <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-4">
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center dark:bg-slate-800/30">
                  <MessageCircle size={32} className="opacity-20" />
                </div>
                <p className="text-sm font-medium">Select a conversation to start chatting</p>
              </div>}
        </main>

        <aside className="hidden xl:block rounded-[24px] p-6 h-full overflow-auto border border-slate-200/50 dark:border-none" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-white shadow-md dark:border-slate-800">
                  {activeAvatar ? (
                    <img src={activeAvatar} alt={activeThreadDisplayName} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400">{activeThreadInitials}</div>
                  )}
                </div>
                <h3 className="text-lg font-bold tracking-tight">{activeThreadDisplayName}</h3>
                <p className="text-xs font-medium text-slate-400 tracking-wide">@{truncateId(activeThread.senderId || activeThread.matchId, 16)}</p>
              </div>

              <div className="mb-8 grid grid-cols-4 gap-3">
                {[
                  { icon: Flag, title: 'Report' },
                  { icon: Lock, title: 'Block' },
                  { icon: Info, title: 'Info' },
                  { icon: VolumeX, title: 'Mute' }
                ].map((action, i) => (
                  <button key={i} className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70" title={action.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-transparent text-slate-400 dark:text-slate-500">
                      <action.icon size={16} strokeWidth={2} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  { id: 'sharedDocument', label: 'Documents', count: sharedLinks.length, icon: FolderOpen },
                  { id: 'sharedMedia', label: 'Media', count: sharedMedia.length, icon: Search },
                  { id: 'sharedPost', label: 'Posts', count: sharedPosts.length, icon: Home }
                ].map((section) => (
                  <div key={section.id} className="overflow-hidden rounded-[18px] border border-slate-100/50 dark:border-slate-800/50">
                    <button 
                      className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50" 
                      style={{ background: isLight ? '#f8fafc' : '#101328', color: theme.textMuted }}
                      onClick={() => setAccordionState(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                    >
                      <div className="flex items-center gap-2">
                        <section.icon size={14} className="opacity-50" />
                        <span>{section.label} <span className="ml-1 opacity-50">({section.count})</span></span>
                      </div>
                      {accordionState[section.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {accordionState[section.id] && (
                      <div className="p-3 bg-white dark:bg-transparent">
                        {section.id === 'sharedDocument' && (
                          <div className="space-y-2">
                            {sharedLinks.length > 0 ? sharedLinks.map(item => (
                              <a key={item.id} href={toAbsoluteAssetUrl(item.attachment?.url)} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-slate-50 bg-slate-50/50 p-2.5 text-[11px] font-medium transition-colors hover:border-[#6366f1]/20 dark:border-slate-800 dark:bg-slate-800/30">
                                <div className="h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700"><Plus size={12} className="opacity-30" /></div>
                                <span className="truncate flex-1">{item.attachment?.name || 'File'}</span>
                              </a>
                            )) : <p className="text-[10px] text-slate-400 italic text-center py-2">No documents shared</p>}
                          </div>
                        )}
                        {section.id === 'sharedMedia' && (
                          <div className="grid grid-cols-3 gap-1.5">
                            {sharedMedia.length > 0 ? sharedMedia.slice(0, 6).map(item => (
                              <a key={item.id} href={toAbsoluteAssetUrl(item.attachment?.url)} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-lg">
                                <img src={toAbsoluteAssetUrl(item.attachment?.url)} alt="" className="h-full w-full object-cover transition-transform hover:scale-110" />
                              </a>
                            )) : <p className="col-span-3 text-[10px] text-slate-400 italic text-center py-2">No media shared</p>}
                          </div>
                        )}
                        {section.id === 'sharedPost' && (
                          <div className="space-y-2">
                            {sharedPosts.length > 0 ? sharedPosts.map(item => (
                              <div key={item.id} style={{ background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.03)' }}>
                                <p className="line-clamp-2 leading-relaxed opacity-80">{item.message}</p>
                              </div>
                            )) : <p className="text-[10px] text-slate-400 italic text-center py-2">No posts shared</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex h-full flex-col items-center justify-center text-slate-400 text-xs italic">Details will appear here</div>}
        </aside>
      </div>
    </div>
  )
}

