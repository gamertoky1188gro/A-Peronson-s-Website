import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Download,
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
import AttachmentPreviewModal from '../components/chat/AttachmentPreviewModal'
import MarkdownMessage from '../components/chat/MarkdownMessage'
import FileAttachmentCard from '../components/chat/FileAttachmentCard'

const WS_BASE = (() => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ws`
})()

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

function normalizeThreads(messages = [], currentUserId = '') {
  const byMatchId = new Map()
  const latestByOther = new Map()

  messages.forEach((message) => {
    if (!message?.match_id) return
    const existing = byMatchId.get(message.match_id)
    const lock = message.conversation_lock || existing?.lock || null
    const isOther = currentUserId && message.sender_id && message.sender_id !== currentUserId
    const otherCandidate = isOther ? message : null

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
      if (otherCandidate) {
        latestByOther.set(message.match_id, otherCandidate)
      }
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

    const existingOther = latestByOther.get(message.match_id)
    if (otherCandidate) {
      if (!existingOther || new Date(message.timestamp || 0).getTime() > new Date(existingOther.timestamp || 0).getTime()) {
        latestByOther.set(message.match_id, otherCandidate)
      }
    }
  })

  const normalized = [...byMatchId.values()].map((thread) => {
    const other = latestByOther.get(thread.matchId)
    if (!other) return thread
    return {
      ...thread,
      name: formatDisplayName(other.sender_name || other.company_name || other.sender_company_name, other.sender_id),
      avatar: other.sender_avatar_url || other.sender_avatar || thread.avatar,
      senderId: other.sender_id,
      verified: Boolean(other.sender_verified),
    }
  })

  return normalized.sort(sortByNewest)
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

const IMAGE_ATTACHMENT_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'apng', 'webp', 'avif', 'svg', 'ico'])
const VIDEO_ATTACHMENT_EXTS = new Set(['mp4', 'mov', 'avi', 'wmv', 'webm', 'mkv', 'flv', '3gp', 'mpg', 'mpeg', 'm4v', 'amv'])

function safeAttachmentExt(attachment) {
  const candidates = [attachment?.name, attachment?.url].map((value) => String(value || '').trim()).filter(Boolean)
  if (candidates.length === 0) return ''

  const raw = candidates[0]
  const cleaned = raw.split('?')[0].split('#')[0]
  const tail = cleaned.split('/').pop() || cleaned
  const match = tail.match(/\.([a-z0-9]+)$/i)
  return match ? match[1].toLowerCase() : ''
}

function isImageExt(attachment) {
  const ext = safeAttachmentExt(attachment)
  return IMAGE_ATTACHMENT_EXTS.has(ext)
}

function isVideoExt(attachment) {
  const ext = safeAttachmentExt(attachment)
  return VIDEO_ATTACHMENT_EXTS.has(ext)
}

function isImageMessage(message) {
  return message?.type === 'image' || String(message?.attachment?.mime_type || '').startsWith('image/') || isImageExt(message?.attachment)
}

function isVideoMessage(message) {
  return message?.type === 'video' || String(message?.attachment?.mime_type || '').startsWith('video/') || isVideoExt(message?.attachment)
}

function toAbsoluteAssetUrl(url = '') {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiUrl = import.meta.env.VITE_API_URL || '/api'
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

function friendCounterpartyId(matchId = '', currentUserId = '') {
  if (!matchId.startsWith('friend:')) return ''
  const parts = String(matchId).split(':')
  if (parts.length !== 3) return ''
  const a = parts[1]
  const b = parts[2]
  if (!currentUserId) return ''
  if (a === currentUserId) return b
  if (b === currentUserId) return a
  return ''
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
  const [callPromptThread, setCallPromptThread] = useState(null)
  const [previewAttachment, setPreviewAttachment] = useState(null)
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
  const activeThreadMatchIdRef = useRef('')
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
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
      let liveUser = getCurrentUser()
      if (token && !liveUser?.id) {
        try {
          liveUser = await apiRequest('/users/me', { token })
        } catch {
          liveUser = null
        }
      }
      setCurrentUser(liveUser)
      const currentUserId = liveUser?.id || ''
      if (!token) {
        setPriorityInbox([])
        setMessageRequests([])
        setError('Please sign in to view your inbox.')
        return
      }

      const data = await apiRequest('/messages/inbox', { token })
      const priority = normalizeThreads(data?.priority || [], currentUserId)
      const requests = normalizeThreads(data?.request_pool || [], currentUserId)
      const allMatchIds = [...new Set([...priority, ...requests].map((thread) => thread.matchId).filter(Boolean))]

      const friendCounterpartyIds = [...new Set(
        [...priority, ...requests]
          .filter((thread) => thread.isFriendThread)
          .map((thread) => friendCounterpartyId(thread.matchId, currentUserId))
          .filter(Boolean)
      )]

      let userById = {}
      if (friendCounterpartyIds.length > 0) {
        const lookup = await apiRequest('/users/lookup', { method: 'POST', token, body: { ids: friendCounterpartyIds } })
        userById = (lookup?.users || []).reduce((acc, user) => {
          acc[user.id] = user
          return acc
        }, {})
      }

      const applyFriendDisplay = (threads) => threads.map((thread) => {
        if (!thread.isFriendThread) return thread
        const counterpartyId = friendCounterpartyId(thread.matchId, currentUserId)
        const user = userById[counterpartyId]
        if (!user) return { ...thread, senderId: counterpartyId || thread.senderId }
        return {
          ...thread,
          name: formatDisplayName(user.name, user.id),
          avatar: user.avatar_url || user.avatar || thread.avatar,
          senderId: user.id,
          verified: Boolean(user.verified),
        }
      })

      setPriorityInbox(applyFriendDisplay(priority))
      setMessageRequests(applyFriendDisplay(requests))
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
  activeThreadMatchIdRef.current = activeThread?.matchId || ''
  const activeCallHistory = useMemo(() => {
    if (!activeThread?.matchId) return []
    return callHistoryByThread[activeThread.matchId] || []
  }, [activeThread, callHistoryByThread])
  const activeMessages = useMemo(() => {
    if (!activeThread?.matchId) return []
    return messagesByThread[activeThread.matchId] || []
  }, [activeThread, messagesByThread])

  const sharedMedia = useMemo(() => {
    return activeMessages
      .filter((message) => (isImageMessage(message) || isVideoMessage(message)) && message?.attachment?.url)
      .slice(-9)
      .reverse()
  }, [activeMessages])

  const sharedLinks = useMemo(() => {
    return activeMessages
      .filter((message) => message?.attachment?.url && !isImageMessage(message) && !isVideoMessage(message))
      .slice(-6)
      .reverse()
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
        ws.send(JSON.stringify({
          type: 'identify',
          token,
        }))
        const matchId = activeThreadMatchIdRef.current
        if (matchId) {
          ws.send(JSON.stringify({
            type: 'join_chat_room',
            match_id: matchId,
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

        if (payload.type === 'incoming_call') {
          const from = payload?.from || {}
          if (!payload?.call_id) return
          setCallPromptThread({
            id: payload.match_id || payload.call_id,
            matchId: payload.match_id || '',
            callId: payload.call_id,
            name: from.name || from.email || 'Caller',
            avatar: from.avatar || '',
            senderId: from.id || '',
            verified: Boolean(from.verified),
            direction: 'incoming',
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
  }, [isLiveMessagingEnabled])

  useEffect(() => {
    if (!isLiveMessagingEnabled) return
    const token = getToken()
    const matchId = activeThread?.matchId || ''
    if (!token || !matchId) return
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({
      type: 'join_chat_room',
      match_id: matchId,
      token,
    }))
  }, [isLiveMessagingEnabled, activeThread?.matchId])

  useEffect(() => {
    const token = getToken()
    if (!token) return undefined

    const interval = window.setInterval(async () => {
      if (callPromptThread?.direction === 'incoming') return
      try {
        const data = await apiRequest('/calls/pending', { token })
        const invite = (data?.invites || [])[0]
        if (!invite?.call_id) return
        const from = invite?.from || {}
        setCallPromptThread({
          id: invite.match_id || invite.call_id,
          matchId: invite.match_id || '',
          callId: invite.call_id,
          name: from.name || from.email || 'Caller',
          avatar: from.avatar || '',
          senderId: from.id || '',
          verified: Boolean(from.verified),
          direction: 'incoming',
        })
      } catch {
        // silent
      }
    }, 2000)

    return () => window.clearInterval(interval)
  }, [callPromptThread])

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
    const currentUserId = currentUser?.id || ''
    if (thread.isFriendThread) {
      const parts = String(thread.matchId || '').split(':')
      if (parts.length === 3) {
        if (parts[1]) participantIds.add(parts[1])
        if (parts[2]) participantIds.add(parts[2])
      }
    } else {
      activeMessages.forEach((message) => {
        if (message?.sender_id) participantIds.add(message.sender_id)
      })
      if (thread.senderId) participantIds.add(thread.senderId)
    }
    if (currentUserId) participantIds.delete(currentUserId)

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

  function closeCallPrompt() {
    setCallPromptThread(null)
  }

  async function acceptCallPrompt() {
    if (!callPromptThread) return
    const thread = callPromptThread
    setCallPromptThread(null)
    if (thread.callId) {
      navigate(`/call?callId=${encodeURIComponent(thread.callId)}&matchId=${encodeURIComponent(thread.matchId || '')}`)
      return
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

      const apiBase = import.meta.env.VITE_API_URL || '/api'
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

  function openAttachmentPreview(attachment, absoluteUrlOverride = '') {
    const rawUrl = absoluteUrlOverride || attachment?.url || ''
    if (!rawUrl) return
    setPreviewAttachment({
      url: absoluteUrlOverride ? absoluteUrlOverride : toAbsoluteAssetUrl(rawUrl),
      name: attachment?.name || 'Attachment',
      mimeType: attachment?.mime_type || attachment?.mimeType || '',
    })
  }

  function renderMessageBody(message, isOwn = false) {
    const attachmentUrl = toAbsoluteAssetUrl(message?.attachment?.url || '')

    if (isImageMessage(message) && attachmentUrl) {
      return (
        <div className="space-y-1">
          {message.message ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
          <button
            type="button"
            onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
            className="block w-full overflow-hidden rounded-xl border border-slate-100 text-left transition-opacity hover:opacity-95 dark:border-transparent"
            title="View image"
          >
            <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-64 w-full object-cover" />
          </button>
          <a
            href={attachmentUrl}
            download={message?.attachment?.name || undefined}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200"
          >
            <Download size={12} />
            Download
          </a>
        </div>
      )
    }

    if (isVideoMessage(message) && attachmentUrl) {
      return (
        <div className="space-y-1">
          {message.message ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
          <button
            type="button"
            onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
            className="relative block w-full overflow-hidden rounded-xl border border-slate-100 text-left dark:border-transparent"
            title="View video"
          >
            <video src={attachmentUrl} muted playsInline preload="metadata" className="max-h-64 w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
              <div className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white">Play</div>
            </div>
          </button>
          <a
            href={attachmentUrl}
            download={message?.attachment?.name || undefined}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200"
          >
            <Download size={12} />
            Download
          </a>
        </div>
      )
    }

    if (message?.attachment?.url) {
      return (
        <div className="space-y-1">
          {message.message && message.message !== 'Shared a file' ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
          <FileAttachmentCard
            attachment={message?.attachment}
            url={attachmentUrl}
            isOwn={isOwn}
            isLight={isLight}
            onOpen={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
          />
        </div>
      )
    }

    const firstUrl = extractFirstUrl(message?.message || '')
    if (firstUrl) {
      const meta = linkPreviewMeta(firstUrl)
      return (
        <div className="space-y-2">
          <MarkdownMessage text={message.message} />
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

    return <MarkdownMessage text={message.message} />
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
        .chat-markdown {
          font-size: 13px;
          line-height: 1.45;
          color: inherit;
          word-break: break-word;
        }
        .chat-markdown > :first-child { margin-top: 0; }
        .chat-markdown > :last-child { margin-bottom: 0; }
        .chat-markdown p { margin: 0.25rem 0; }
        .chat-markdown h1, .chat-markdown h2, .chat-markdown h3, .chat-markdown h4, .chat-markdown h5, .chat-markdown h6 {
          margin: 0.45rem 0 0.25rem;
          font-weight: 800;
          line-height: 1.25;
        }
        .chat-markdown h1 { font-size: 1.15rem; }
        .chat-markdown h2 { font-size: 1.08rem; }
        .chat-markdown h3 { font-size: 1.02rem; }
        .chat-markdown ul, .chat-markdown ol { margin: 0.25rem 0; padding-left: 1.2rem; }
        .chat-markdown ul { list-style: disc; }
        .chat-markdown ol { list-style: decimal; }
        .chat-markdown li { margin: 0.12rem 0; }
        .chat-markdown blockquote {
          margin: 0.35rem 0;
          padding-left: 0.75rem;
          border-left: 3px solid ${isLight ? '#cbd5e1' : '#2f295c'};
          color: ${isLight ? '#334155' : '#cdd2ff'};
          opacity: ${isLight ? 0.9 : 0.95};
        }
        .chat-markdown code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.92em;
          padding: 0.12rem 0.28rem;
          border-radius: 0.35rem;
          background: ${isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(0,0,0,0.35)'};
        }
        .chat-markdown pre {
          margin: 0.35rem 0;
          padding: 0.75rem;
          border-radius: 0.85rem;
          overflow-x: auto;
          background: ${isLight ? '#0b1020' : 'rgba(0,0,0,0.35)'};
          color: #e2e8f0;
        }
        .chat-markdown pre code {
          padding: 0;
          background: transparent;
        }
        .chat-markdown table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.4rem 0;
          font-size: 12px;
        }
        .chat-markdown th, .chat-markdown td {
          border: 1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.12)'};
          padding: 0.35rem 0.5rem;
        }
        .chat-markdown th {
          background: ${isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)'};
          font-weight: 700;
        }
        .chat-markdown input[type="checkbox"] {
          accent-color: #6366f1;
        }
        .chat-markdown hr {
          border: none;
          border-top: 1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.12)'};
          margin: 0.5rem 0;
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
      <AttachmentPreviewModal
        open={Boolean(previewAttachment)}
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
      {callPromptThread ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#14122b] p-6 text-white shadow-2xl">
            <div className="flex items-center gap-4">
              {callPromptThread.avatar ? (
                <img
                  src={avatarUrl(callPromptThread.avatar)}
                  alt={callPromptThread.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2a2744] text-lg font-bold">
                  {getInitials(formatDisplayName(callPromptThread.name, callPromptThread.senderId))}
                </div>
              )}
              <div>
                <p className="text-sm text-slate-300">{callPromptThread.direction === 'incoming' ? 'Incoming call' : 'Calling'}</p>
                <p className="text-lg font-semibold">{formatDisplayName(callPromptThread.name, callPromptThread.senderId)}</p>
                <p className="text-xs text-slate-400">{callPromptThread.direction === 'incoming' ? 'Accept to join the call.' : 'Ready to start the call?'}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={closeCallPrompt}
                className="flex-1 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
              >
                Decline
              </button>
              <button
                onClick={acceptCallPrompt}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
              >
                Accept
              </button>
            </div>
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
              {isLight ? '??' : '??'}
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
                          {renderMessageBody(message, isOwn)}
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
                  <textarea
                    rows={1}
                    className="flex-1 resize-none bg-transparent px-2 py-2 text-[14px] leading-5 outline-none placeholder:text-slate-400"
                    style={{ color: theme.textPrimary, maxHeight: 140 }}
                    placeholder="Write a message..."
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        sendMessage()
                      }
                    }}
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
                            {sharedLinks.length > 0 ? sharedLinks.map(item => {
                              const url = toAbsoluteAssetUrl(item.attachment?.url || '')
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => openAttachmentPreview(item.attachment, url)}
                                  className="flex w-full items-center gap-2 rounded-xl border border-slate-50 bg-slate-50/50 p-2.5 text-left text-[11px] font-medium transition-colors hover:border-[#6366f1]/20 dark:border-slate-800 dark:bg-slate-800/30"
                                  title="Preview"
                                >
                                  <div className="h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700"><Plus size={12} className="opacity-30" /></div>
                                  <span className="truncate flex-1">{item.attachment?.name || 'File'}</span>
                                </button>
                              )
                            }) : <p className="text-[10px] text-slate-400 italic text-center py-2">No documents shared</p>}
                          </div>
                        )}
                        {section.id === 'sharedMedia' && (
                          <div className="grid grid-cols-3 gap-1.5">
                            {sharedMedia.length > 0 ? sharedMedia.slice(0, 6).map(item => {
                              const url = toAbsoluteAssetUrl(item.attachment?.url || '')
                              const isVideo = isVideoMessage(item)
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => openAttachmentPreview(item.attachment, url)}
                                  className="relative aspect-square overflow-hidden rounded-lg"
                                  title="View"
                                >
                                  {isVideo ? (
                                    <>
                                      <video src={url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                                        <div className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white">Play</div>
                                      </div>
                                    </>
                                  ) : (
                                    <img src={url} alt="" className="h-full w-full object-cover transition-transform hover:scale-110" />
                                  )}
                                </button>
                              )
                            }) : <p className="col-span-3 text-[10px] text-slate-400 italic text-center py-2">No media shared</p>}
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

