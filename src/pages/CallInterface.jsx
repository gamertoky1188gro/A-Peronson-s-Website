/*
  Route: /call
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Provide video/audio call UI and call controls (mic/cam, participants, share links).
    - Enforce any call-related permissions and safety cues (recording / identity / dispute context).

  Key API endpoints (high level):
    - POST /api/calls (create) / GET /api/calls/:id (status) (depending on server)
    - Any signaling endpoints if implemented (or WebRTC signaling via WS)

  Notes:
    - AppLayout hides NavBar/Footer for /call (immersive route).
*/
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ChevronLeft,
  Copy,
  RefreshCw,
  ShieldAlert,
  MessageSquare,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Maximize,
  Send,
  Smile,
  MoreHorizontal,
} from 'lucide-react'
import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
import { trackClientEvent } from '../lib/events'
import MarkdownMessage from '../components/chat/MarkdownMessage'

const WS_BASE = (() => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ws`
})()

const ICE_SERVERS = (() => {
  const fallback = [{ urls: 'stun:stun.l.google.com:19302' }]
  const raw = import.meta.env.VITE_ICE_SERVERS
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return fallback
  } catch {
    return fallback
  }
})()

const QUICK_EMOJIS = [
  '😀', '😁', '😂', '🤣', '😊', '😍', '😎', '🤝',
  '👍', '👎', '🙏', '👏', '🎉', '🔥', '💯', '✅',
  '⚡', '💡', '📝', '📎', '🧠', '🚀', '❤️', '✨',
]

export default function CallInterface() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [statusMessage, setStatusMessage] = useState('')
  const [callDetails, setCallDetails] = useState(null)
  const [participants, setParticipants] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [timer, setTimer] = useState('00:00:00')
  const [chatDraft, setChatDraft] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [isChatOpen, setIsChatOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth >= 1024
  })
  const [unreadChatCount, setUnreadChatCount] = useState(0)
  const [isChatLive, setIsChatLive] = useState(false)
  const [wsStatus, setWsStatus] = useState('offline')
  const [rtcConnectionState, setRtcConnectionState] = useState('new')
  const [rtcIceState, setRtcIceState] = useState('new')
  const [micLevel, setMicLevel] = useState(0)
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [reconnectNonce, setReconnectNonce] = useState(0)
  const [hasRemoteStream, setHasRemoteStream] = useState(false)
  const [hasLocalStream, setHasLocalStream] = useState(false)
  const [isRequestingMedia, setIsRequestingMedia] = useState(false)
  const [mediaGate, setMediaGate] = useState(null)
  const [recordingState, setRecordingState] = useState('idle') // idle | recording | uploading | available | failed

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const stageRef = useRef(null)
  const chatScrollRef = useRef(null)
  const chatEndRef = useRef(null)
  const chatInputRef = useRef(null)
  const emojiPopoverRef = useRef(null)
  const morePopoverRef = useRef(null)
  const toastTimerRef = useRef(null)
  const wsRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const iceServersRef = useRef(ICE_SERVERS)
  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const localStreamPromiseRef = useRef(null)
  const pendingCandidatesRef = useRef([])
  const pendingRemoteOfferRef = useRef(null)
  const shouldOfferRef = useRef(false)
  const offerSentRef = useRef(false)
  const tokenRef = useRef('')
  const hasLocalStreamRef = useRef(false)
  const mediaGateRef = useRef(null)
  const isMutedRef = useRef(false)
  const audioRafRef = useRef(null)
  const audioContextRef = useRef(null)
  const isChatOpenRef = useRef(true)
  const chatRoomMatchIdRef = useRef('')
  const chatInitializedRef = useRef(false)
  const mountedRef = useRef(true)
  const redirectedRef = useRef(false)

  // Call recording (project.md requirement): record the call room locally and upload after ending.
  // MVP approach: canvas-composited video (remote + local PIP) + mixed audio (local + remote).
  const recorderRef = useRef(null)
  const recordingChunksRef = useRef([])
  const recordingCleanupRef = useRef(null)

  const callId = useMemo(() => searchParams.get('callId') || '', [searchParams])
  const matchId = useMemo(() => searchParams.get('matchId') || '', [searchParams])
  const user = useMemo(() => getCurrentUser(), [])
  const participantId = useMemo(() => (user?.id ? String(user.id) : ''), [user?.id])
  const effectiveMatchId = callDetails?.match_id || callDetails?.context?.chat_thread_id || matchId

  const localName = user?.name || user?.email || 'You'
  const remoteParticipant = participants.find((p) => p.id && p.id !== user?.id) || null
  const remoteName = remoteParticipant?.name || remoteParticipant?.email || callDetails?.title || 'Participant'

  const userMap = useMemo(() => {
    const map = new Map()
    participants.forEach((p) => { if (p?.id) map.set(p.id, p) })
    if (user?.id) map.set(user.id, user)
    return map
  }, [participants, user])

  const sortedChatMessages = useMemo(() => {
    return [...chatMessages].sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime())
  }, [chatMessages])

  const isSpeaking = !isMuted && micLevel > 0.12

  const connectionBadge = useMemo(() => {
    const wsOnline = wsStatus === 'online'
    const rtcConnected = rtcConnectionState === 'connected'
    const rtcFailed = rtcConnectionState === 'failed' || rtcIceState === 'failed'
    const rtcConnecting = ['new', 'connecting'].includes(rtcConnectionState) || ['checking'].includes(rtcIceState)

    if (!wsOnline) {
      return {
        label: wsStatus === 'connecting' ? 'Connecting' : 'Offline',
        pillClass: 'bg-slate-500/10 text-slate-700 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10',
        dotClass: wsStatus === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400',
      }
    }

    if (rtcFailed) {
      return {
        label: 'Connection issue',
        pillClass: 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/25',
        dotClass: 'bg-rose-500',
      }
    }

    if (rtcConnected) {
      return {
        label: 'Live',
        pillClass: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/25',
        dotClass: 'bg-emerald-500 animate-pulse',
      }
    }

    if (rtcConnecting) {
      return {
        label: 'Connecting',
        pillClass: 'bg-amber-500/10 text-amber-800 ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/25',
        dotClass: 'bg-amber-500 animate-pulse',
      }
    }

    return {
      label: 'Waiting',
      pillClass: 'bg-slate-500/10 text-slate-700 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10',
      dotClass: 'bg-slate-400',
    }
  }, [rtcConnectionState, rtcIceState, wsStatus])

  const formatMessageTime = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const buildMediaGate = (error) => {
    if (!window.isSecureContext) {
      return {
        title: 'Camera/microphone requires HTTPS',
        message: 'Open this app on https:// (or localhost). Then refresh and try again.',
        actionLabel: null,
      }
    }

    const name = String(error?.name || '')
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return {
        title: 'Camera/microphone blocked',
        message: 'Allow Camera + Microphone for this site (browser lock icon → Site settings), then click “Try again”.',
        actionLabel: 'Try again',
      }
    }

    if (name === 'NotFoundError') {
      return {
        title: 'No camera/microphone found',
        message: 'Connect a camera/microphone (or enable it in OS settings), then click “Try again”.',
        actionLabel: 'Try again',
      }
    }

    if (name === 'NotReadableError') {
      return {
        title: 'Camera/microphone is busy',
        message: 'Close other apps using your camera/microphone (Zoom/Meet/etc.), then click “Try again”.',
        actionLabel: 'Try again',
      }
    }

    return {
      title: 'Unable to access camera/microphone',
      message: error?.message ? String(error.message) : 'Please check browser and OS permissions, then try again.',
      actionLabel: 'Try again',
    }
  }

  const ensureLocalStream = useCallback(async () => {
    if (localStreamRef.current) return localStreamRef.current
    if (localStreamPromiseRef.current) return localStreamPromiseRef.current

    if (!window.isSecureContext) {
      const error = new Error('Camera/microphone requires a secure context (HTTPS or localhost).')
      if (mountedRef.current) {
        setHasLocalStream(false)
        setMediaGate(buildMediaGate(error))
        setStatusMessage('Camera/microphone requires HTTPS.')
      }
      throw error
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      const error = new Error('getUserMedia is not supported in this browser/environment.')
      if (mountedRef.current) {
        setHasLocalStream(false)
        setMediaGate(buildMediaGate(error))
        setStatusMessage('Camera/microphone is not supported here.')
      }
      throw error
    }

    if (mountedRef.current) {
      setIsRequestingMedia(true)
    }

    localStreamPromiseRef.current = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream
        if (mountedRef.current) {
          setHasLocalStream(true)
          setMediaGate(null)
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
          const playAttempt = localVideoRef.current.play?.()
          if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(() => {})
          }
        }

        if (peerConnectionRef.current) {
          stream.getTracks().forEach((track) => {
            try {
              peerConnectionRef.current.addTrack(track, stream)
            } catch {
              // ignore duplicate track errors
            }
          })
        }
        return stream
      })
      .catch((err) => {
        localStreamPromiseRef.current = null
        if (mountedRef.current) {
          setHasLocalStream(false)
          setMediaGate(buildMediaGate(err))
          setStatusMessage('Camera/microphone permission not granted.')
        }
        throw err
      })
      .finally(() => {
        if (mountedRef.current) {
          setIsRequestingMedia(false)
        }
      })

    return localStreamPromiseRef.current
  }, [])

  const toSessionDescriptionInit = (description) => {
    if (!description) return null
    if (typeof description.toJSON === 'function') return description.toJSON()
    if (typeof description.sdp === 'string' && typeof description.type === 'string') {
      return { type: description.type, sdp: description.sdp }
    }
    return description
  }

  const toIceCandidateInit = (candidate) => {
    if (!candidate) return null
    if (typeof candidate.toJSON === 'function') return candidate.toJSON()
    return candidate
  }

  const createPeerConnection = useCallback((token) => {
    if (peerConnectionRef.current) return peerConnectionRef.current
    const pc = new RTCPeerConnection({
      iceServers: iceServersRef.current,
    })

    pc.onicecandidate = (event) => {
      if (!event.candidate) return
      if (wsRef.current?.readyState !== WebSocket.OPEN) return
      wsRef.current.send(JSON.stringify({
        type: 'webrtc_signal',
        call_id: callId,
        token,
        signal: { type: 'candidate', candidate: toIceCandidateInit(event.candidate) },
      }))
    }

    pc.ontrack = (event) => {
      let stream = event.streams?.[0] || null
      if (!stream) {
        if (!remoteStreamRef.current) remoteStreamRef.current = new MediaStream()
        stream = remoteStreamRef.current
        try {
          stream.addTrack(event.track)
        } catch {
          // ignore duplicate track errors
        }
      }

      if (!stream) return
      remoteStreamRef.current = stream
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
        const playAttempt = remoteVideoRef.current.play?.()
        if (playAttempt && typeof playAttempt.catch === 'function') {
          playAttempt.catch(() => {})
        }
      }
      if (mountedRef.current) setHasRemoteStream(true)
    }

    pc.onconnectionstatechange = () => {
      if (!mountedRef.current) return
      setRtcConnectionState(pc.connectionState || 'new')
      if (pc.connectionState === 'connected') {
        setStatusMessage('Call connected.')
      } else if (pc.connectionState === 'failed') {
        setStatusMessage('Call connection failed.')
      }
    }

    pc.oniceconnectionstatechange = () => {
      if (!mountedRef.current) return
      setRtcIceState(pc.iceConnectionState || 'new')
      if (pc.iceConnectionState === 'failed') {
        setStatusMessage('ICE negotiation failed (TURN server may be required).')
      } else if (pc.iceConnectionState === 'disconnected') {
        setStatusMessage('ICE disconnected.')
      }
    }

    if (mountedRef.current) {
      setRtcConnectionState(pc.connectionState || 'new')
      setRtcIceState(pc.iceConnectionState || 'new')
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current)
      })
    }

    peerConnectionRef.current = pc
    return pc
  }, [callId])

  const tryStartOffer = useCallback(async () => {
    if (!shouldOfferRef.current) return false
    if (offerSentRef.current) return false
    if (!hasLocalStreamRef.current) return false

    const token = tokenRef.current
    if (!token) return false
    if (!callId) return false
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false

    try {
      const pc = createPeerConnection(token)
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      wsRef.current.send(JSON.stringify({
        type: 'webrtc_signal',
        call_id: callId,
        token,
        signal: { type: 'offer', sdp: toSessionDescriptionInit(pc.localDescription) || offer },
      }))

      offerSentRef.current = true
      if (mountedRef.current) {
        setStatusMessage('Offer sent. Waiting for answer...')
      }
      return true
    } catch (error) {
      offerSentRef.current = false
      throw error
    }
  }, [callId, createPeerConnection])

  const tryAnswerPendingOffer = useCallback(async () => {
    const pendingOffer = pendingRemoteOfferRef.current
    if (!pendingOffer) return false
    if (!hasLocalStreamRef.current) return false

    const token = tokenRef.current
    if (!token) return false
    if (!callId) return false
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false

    try {
      const pc = createPeerConnection(token)
      await pc.setRemoteDescription(pendingOffer)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      wsRef.current.send(JSON.stringify({
        type: 'webrtc_signal',
        call_id: callId,
        token,
        signal: { type: 'answer', sdp: toSessionDescriptionInit(pc.localDescription) || answer },
      }))

      pendingRemoteOfferRef.current = null
      const pending = pendingCandidatesRef.current
      pendingCandidatesRef.current = []
      for (const queued of pending) {
        try {
          await pc.addIceCandidate(queued)
        } catch {
          // ignore candidate errors
        }
      }

      if (mountedRef.current) {
        setStatusMessage('Answer sent. Connecting...')
      }
      return true
    } catch (error) {
      // Keep pending offer for retry after the user fixes permissions.
      pendingRemoteOfferRef.current = pendingOffer
      throw error
    }
  }, [callId, createPeerConnection])

  useEffect(() => {
    if (!callId) {
      if (!redirectedRef.current) {
        redirectedRef.current = true
        navigate('/chat', {
          state: {
            notice: {
              type: 'error',
              title: 'Call link missing',
              message: 'You were redirected because this page needs a valid call id. Please start a call from the chat page.',
            },
          },
        })
      }
    }
  }, [callId, navigate])

  const loadCallDetails = useCallback(async () => {
    const token = getToken()
    if (!token || !callId) return
    try {
      const details = await apiRequest(`/calls/${callId}`, { token })
      setCallDetails(details)
    } catch {
      if (!redirectedRef.current) {
        redirectedRef.current = true
        navigate('/chat', {
          state: {
            notice: {
              type: 'error',
              title: 'Call not available',
              message: 'You were redirected because the call id is invalid or you no longer have access.',
            },
          },
        })
      }
    }
  }, [callId, navigate])

  const startCallIfNeeded = useCallback(async () => {
    const token = getToken()
    if (!token || !callId) return
    try {
      await apiRequest(`/calls/${callId}/start`, { method: 'POST', token })
    } catch {
      // no-op
    }
  }, [callId])

  const loadParticipants = useCallback(async () => {
    const token = getToken()
    if (!token || !callDetails?.participant_ids?.length) return
    const data = await apiRequest('/users/lookup', {
      method: 'POST',
      token,
      body: { ids: callDetails.participant_ids },
    })
    setParticipants(data?.users || [])
  }, [callDetails])

  const loadChatMessages = useCallback(async () => {
    const token = getToken()
    if (!token || !effectiveMatchId) return
    const data = await apiRequest(`/messages/${effectiveMatchId}`, { token })
    setChatMessages(Array.isArray(data) ? data : [])
  }, [effectiveMatchId])

  const loadIceServers = useCallback(async (token) => {
    if (!token || !callId) return ICE_SERVERS
    try {
      const data = await apiRequest(`/calls/${callId}/ice`, { token })
      const servers = Array.isArray(data?.iceServers) ? data.iceServers : []
      if (servers.length > 0) return servers
    } catch {
      // fallback to VITE_ICE_SERVERS / STUN-only
    }
    return ICE_SERVERS
  }, [callId])

  const joinChatRoom = useCallback((matchToJoin) => {
    const matchToJoinId = String(matchToJoin || '').trim()
    if (!matchToJoinId) return false

    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return false

    const token = tokenRef.current || getToken()
    if (!token) return false

    chatRoomMatchIdRef.current = matchToJoinId
    chatInitializedRef.current = false
    if (mountedRef.current) setIsChatLive(false)

    try {
      ws.send(JSON.stringify({
        type: 'join_chat_room',
        match_id: matchToJoinId,
        token,
      }))
      return true
    } catch {
      return false
    }
  }, [])

  const pushToast = useCallback((message, tone = 'info') => {
    const safeMessage = String(message || '').trim()
    if (!safeMessage) return
    if (!mountedRef.current) return

    setToast({ message: safeMessage, tone })
    if (toastTimerRef.current && typeof window !== 'undefined') {
      window.clearTimeout(toastTimerRef.current)
    }
    if (typeof window !== 'undefined') {
      toastTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current) setToast(null)
      }, 2200)
    }
  }, [])

  const reconnectCall = useCallback(() => {
    offerSentRef.current = false
    shouldOfferRef.current = false
    pendingRemoteOfferRef.current = null
    pendingCandidatesRef.current = []

    if (mountedRef.current) {
      setStatusMessage('Reconnecting...')
      setHasRemoteStream(false)
      setIsChatLive(false)
      setWsStatus('connecting')
      setRtcConnectionState('new')
      setRtcIceState('new')
    }

    remoteStreamRef.current = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null

    try {
      peerConnectionRef.current?.close?.()
    } catch {
      // ignore
    }
    peerConnectionRef.current = null

    try {
      wsRef.current?.close?.()
    } catch {
      // ignore
    }

    setReconnectNonce((value) => value + 1)
  }, [])

  const copyCallLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      pushToast('Call link copied.', 'success')
    } catch {
      pushToast('Unable to copy call link.', 'error')
    }
  }, [pushToast])

  const requestMediaPermissions = useCallback(() => {
    if (mountedRef.current) setMediaGate(null)
    ensureLocalStream()
      .then(() => pushToast('Camera & microphone ready.', 'success'))
      .catch(() => pushToast('Please allow camera & microphone for calls.', 'error'))
  }, [ensureLocalStream, pushToast])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (toastTimerRef.current && typeof window !== 'undefined') {
        window.clearTimeout(toastTimerRef.current)
      }
      if (audioRafRef.current && typeof window !== 'undefined') {
        window.cancelAnimationFrame(audioRafRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close?.().catch?.(() => {})
      }
    }
  }, [])

  useEffect(() => {
    hasLocalStreamRef.current = Boolean(hasLocalStream)
  }, [hasLocalStream])

  useEffect(() => {
    isMutedRef.current = Boolean(isMuted)
  }, [isMuted])

  useEffect(() => {
    mediaGateRef.current = mediaGate
  }, [mediaGate])

  useEffect(() => {
    isChatOpenRef.current = Boolean(isChatOpen)
    if (isChatOpen) setUnreadChatCount(0)
  }, [isChatOpen])

  useEffect(() => {
    if (!isChatOpen) return
    if (typeof window === 'undefined') return
    window.requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView?.({ behavior: 'auto', block: 'end' })
    })
  }, [isChatOpen])

  useEffect(() => { loadCallDetails() }, [loadCallDetails])
  useEffect(() => { startCallIfNeeded() }, [startCallIfNeeded])
  useEffect(() => { loadParticipants() }, [loadParticipants])
  useEffect(() => { loadChatMessages() }, [loadChatMessages])

  useEffect(() => {
    if (!effectiveMatchId) return
    joinChatRoom(effectiveMatchId)
  }, [effectiveMatchId, joinChatRoom])

  useEffect(() => {
    if (sortedChatMessages.length === 0) return

    const last = sortedChatMessages[sortedChatMessages.length - 1]
    const lastIsOwn = last?.sender_id === user?.id
    const firstLoad = !chatInitializedRef.current

    const scrollEl = chatScrollRef.current
    const distanceFromBottom = scrollEl
      ? scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight
      : 0
    const nearBottom = distanceFromBottom < 140

    const shouldAutoScroll = firstLoad || (isChatOpenRef.current && (lastIsOwn || nearBottom))
    if (firstLoad) chatInitializedRef.current = true

    if (shouldAutoScroll) {
      setUnreadChatCount(0)
      chatEndRef.current?.scrollIntoView?.({ behavior: firstLoad ? 'auto' : 'smooth', block: 'end' })
      return
    }

    if (!firstLoad && !lastIsOwn && !isChatOpenRef.current) {
      setUnreadChatCount((count) => count + 1)
    }
  }, [sortedChatMessages, user?.id])

  useEffect(() => {
    if (isChatOpen) return
    if (isEmojiOpen) setIsEmojiOpen(false)
    if (isMoreOpen) setIsMoreOpen(false)
  }, [isChatOpen, isEmojiOpen, isMoreOpen])

  useEffect(() => {
    if (!isEmojiOpen && !isMoreOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setIsEmojiOpen(false)
      setIsMoreOpen(false)
    }

    const handleMouseDown = (event) => {
      const target = event.target
      if (isEmojiOpen && emojiPopoverRef.current && emojiPopoverRef.current.contains(target)) return
      if (isMoreOpen && morePopoverRef.current && morePopoverRef.current.contains(target)) return
      setIsEmojiOpen(false)
      setIsMoreOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isEmojiOpen, isMoreOpen])

  useEffect(() => {
    if (!hasLocalStream) {
      setMicLevel(0)
      return undefined
    }

    if (typeof window === 'undefined') return undefined
    const stream = localStreamRef.current
    const audioTrack = stream?.getAudioTracks?.()[0] || null
    if (!audioTrack) {
      setMicLevel(0)
      return undefined
    }

    const AudioContextCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioContextCtor) return undefined

    let cancelled = false
    let ctx = null
    let analyser = null
    let source = null
    let smoothing = 0
    let lastUiUpdateAt = 0

    try {
      ctx = new AudioContextCtor()
      audioContextRef.current = ctx
      analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      source = ctx.createMediaStreamSource(new MediaStream([audioTrack]))
      source.connect(analyser)
    } catch {
      setMicLevel(0)
      return undefined
    }

    const data = new Uint8Array(analyser.fftSize)

    const tick = (timestamp) => {
      if (cancelled) return
      try {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / data.length)
        const level = Math.min(1, rms * 3.2)
        smoothing = smoothing * 0.82 + level * 0.18

        if (mountedRef.current && timestamp - lastUiUpdateAt > 90) {
          lastUiUpdateAt = timestamp
          setMicLevel(isMutedRef.current ? 0 : Number(smoothing.toFixed(3)))
        }
      } catch {
        // ignore
      }
      audioRafRef.current = window.requestAnimationFrame(tick)
    }

    audioRafRef.current = window.requestAnimationFrame(tick)
    ctx.resume?.().catch?.(() => {})

    return () => {
      cancelled = true
      if (audioRafRef.current && typeof window !== 'undefined') {
        window.cancelAnimationFrame(audioRafRef.current)
      }
      try { source?.disconnect?.() } catch { /* ignore */ }
      try { analyser?.disconnect?.() } catch { /* ignore */ }
      try { ctx?.close?.() } catch { /* ignore */ }
      audioContextRef.current = null
      if (mountedRef.current) setMicLevel(0)
    }
  }, [hasLocalStream])

  useEffect(() => {
    let active = true
    async function initPermissions() {
      if (!active) return

      if (!window.isSecureContext) {
        if (mountedRef.current) {
          setMediaGate(buildMediaGate(new Error('insecure_context')))
          setHasLocalStream(false)
        }
        return
      }

      if (!navigator?.permissions?.query) {
        ensureLocalStream().catch(() => {})
        return
      }

      try {
        const [cam, mic] = await Promise.all([
          navigator.permissions.query({ name: 'camera' }),
          navigator.permissions.query({ name: 'microphone' }),
        ])

        const state = [cam?.state, mic?.state]
        if (state.includes('denied')) {
          if (mountedRef.current) {
            setMediaGate(buildMediaGate({ name: 'NotAllowedError' }))
            setHasLocalStream(false)
          }
          return
        }

        if (state.includes('prompt')) {
          if (mountedRef.current) {
            setMediaGate({
              title: 'Enable camera & microphone',
              message: 'Click “Allow access” to let this page use your camera/microphone for the call.',
              actionLabel: 'Allow access',
            })
            setHasLocalStream(false)
          }
          return
        }

        ensureLocalStream().catch(() => {})
      } catch {
        ensureLocalStream().catch(() => {})
      }
    }

    initPermissions()
    return () => {
      active = false
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (mountedRef.current) {
        setHasLocalStream(false)
      }
    }
  }, [ensureLocalStream])

  useEffect(() => {
    if (!hasLocalStream) return
    tryAnswerPendingOffer().catch(() => {})
    tryStartOffer().catch(() => {})
  }, [hasLocalStream, tryAnswerPendingOffer, tryStartOffer])

  useEffect(() => {
    const token = getToken()
    if (!token || !callId) return
    tokenRef.current = token

    let active = true
    const safeSetStatus = (message) => {
      if (!active || !mountedRef.current) return
      setStatusMessage(message)
    }
    const safeSetWsStatus = (next) => {
      if (!active || !mountedRef.current) return
      setWsStatus(next)
    }
    const safeSetRemoteStream = (value) => {
      if (!active || !mountedRef.current) return
      setHasRemoteStream(value)
    }

    let ws = null

    async function connect() {
      safeSetStatus('Fetching ICE servers...')
      const resolvedIceServers = await loadIceServers(token)
      iceServersRef.current = resolvedIceServers
      if (!active) return

      safeSetWsStatus('connecting')
      ws = new WebSocket(WS_BASE)
      wsRef.current = ws
      safeSetStatus('Connecting to call server...')

      const sendSignal = (payload) => {
        if (ws.readyState !== WebSocket.OPEN) return
        ws.send(JSON.stringify(payload))
      }

      ws.onopen = () => {
        safeSetWsStatus('online')
        safeSetStatus('Joining call...')
        sendSignal({
          type: 'join_call_room',
          call_id: callId,
          token,
          participant_id: participantId,
        })
        const chatToJoin = chatRoomMatchIdRef.current || matchId
        if (chatToJoin) joinChatRoom(chatToJoin)
      }

      ws.onmessage = async (event) => {
        let payload
        try {
          payload = JSON.parse(String(event.data || ''))
        } catch {
          return
        }

        if (payload.type === 'call_error') {
          safeSetStatus(payload.error || 'Unable to join call room.')
          return
        }

        if (payload.type === 'joined_call_room') {
          safeSetStatus(payload.should_offer ? 'Participant found. Starting call...' : 'Waiting for participant to join...')
          shouldOfferRef.current = Boolean(payload.should_offer)
          offerSentRef.current = false
          createPeerConnection(token)
          if (payload.should_offer) {
            if (!hasLocalStreamRef.current) {
              safeSetStatus('Allow camera/mic access to start the call.')
              if (!mediaGateRef.current && mountedRef.current) {
                setMediaGate({
                  title: 'Enable camera & microphone',
                  message: 'Click “Allow access” to start the call.',
                  actionLabel: 'Allow access',
                })
              }
              return
            }

            tryStartOffer().catch((error) => {
              safeSetStatus(`Unable to start call: ${error?.message || 'offer failed'}`)
            })
          }
          return
        }

        if (payload.type === 'participant_joined') {
          safeSetStatus('Participant joined. Connecting...')
          createPeerConnection(token)
          return
        }

        if (payload.type === 'joined_chat_room') {
          const history = Array.isArray(payload.messages) ? [...payload.messages] : []
          history.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime())
          chatInitializedRef.current = false
          if (payload.match_id) chatRoomMatchIdRef.current = String(payload.match_id)
          setChatMessages(history)
          setIsChatLive(true)
          return
        }

        if (payload.type === 'chat_message') {
          const incoming = payload.message
          if (!incoming?.id) return
          setIsChatLive(true)
          setChatMessages((previous) => {
            if (previous.some((msg) => msg.id === incoming.id)) return previous
            return [...previous, incoming]
          })
          return
        }

        if (payload.type === 'chat_error') {
          safeSetStatus(payload.error || 'Chat error.')
          return
        }

        if (payload.type === 'webrtc_signal' && payload.signal) {
          const pc = createPeerConnection(token)
          const signal = payload.signal
          if (signal.type === 'offer') {
            if (!signal.sdp) {
              safeSetStatus('Offer handling failed: Missing offer SDP')
              return
            }

            if (!hasLocalStreamRef.current) {
              pendingRemoteOfferRef.current = signal.sdp
              safeSetStatus('Incoming call. Allow camera/mic to answer...')
              if (!mediaGateRef.current && mountedRef.current) {
                setMediaGate({
                  title: 'Enable camera & microphone',
                  message: 'Click “Allow access” to answer the call.',
                  actionLabel: 'Allow access',
                })
              }
              return
            }

            try {
              safeSetStatus('Offer received. Sending answer...')
              await pc.setRemoteDescription(signal.sdp)
              const answer = await pc.createAnswer()
              await pc.setLocalDescription(answer)
              sendSignal({
                type: 'webrtc_signal',
                call_id: callId,
                token,
                signal: { type: 'answer', sdp: toSessionDescriptionInit(pc.localDescription) || answer },
              })
              safeSetStatus('Answer sent. Connecting...')

              const pending = pendingCandidatesRef.current
              pendingCandidatesRef.current = []
              for (const queued of pending) {
                try {
                  await pc.addIceCandidate(queued)
                } catch {
                  // ignore candidate errors
                }
              }
            } catch (error) {
              safeSetStatus(`Offer handling failed: ${error?.message || 'unknown error'}`)
            }
          } else if (signal.type === 'answer') {
            try {
              safeSetStatus('Answer received. Connecting...')
              if (!signal.sdp) throw new Error('Missing answer SDP')
              await pc.setRemoteDescription(signal.sdp)

              const pending = pendingCandidatesRef.current
              pendingCandidatesRef.current = []
              for (const queued of pending) {
                try {
                  await pc.addIceCandidate(queued)
                } catch {
                  // ignore candidate errors
                }
              }
            } catch (error) {
              safeSetStatus(`Answer handling failed: ${error?.message || 'unknown error'}`)
            }
          } else if (signal.type === 'candidate') {
            try {
              const candidate = signal.candidate
              if (pc.remoteDescription && pc.remoteDescription.type) {
                await pc.addIceCandidate(candidate)
              } else {
                pendingCandidatesRef.current.push(candidate)
              }
            } catch {
              // ignore candidate errors
            }
          }
        }

        if (payload.type === 'participant_left') {
          safeSetStatus('Participant left the call.')
          safeSetRemoteStream(false)
          remoteStreamRef.current = null
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
        }
      }

      ws.onerror = () => {
        safeSetWsStatus('error')
        safeSetStatus('Unable to reach call server.')
      }

      ws.onclose = () => {
        safeSetWsStatus('offline')
        safeSetStatus('Call server disconnected.')
        if (mountedRef.current) setIsChatLive(false)
        safeSetRemoteStream(false)
        remoteStreamRef.current = null
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close()
          peerConnectionRef.current = null
        }
        if (mountedRef.current) {
          setRtcConnectionState('new')
          setRtcIceState('new')
        }
      }
    }

    connect().catch(() => {
      safeSetStatus('Unable to start call signaling.')
    })

    return () => {
      active = false
      if (ws) ws.close()
    }
  }, [callId, matchId, participantId, reconnectNonce, createPeerConnection, joinChatRoom, loadIceServers, tryStartOffer])

  useEffect(() => {
    const startedAt = callDetails?.started_at || callDetails?.created_at
    if (!startedAt) return
    const startMs = new Date(startedAt).getTime()
    const interval = setInterval(() => {
      const elapsed = Math.max(0, Date.now() - startMs)
      const totalSeconds = Math.floor(elapsed / 1000)
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
      const seconds = String(totalSeconds % 60).padStart(2, '0')
      setTimer(`${hours}:${minutes}:${seconds}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [callDetails])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => { track.enabled = !next })
      }
      return next
    })
  }

  const toggleSpeaker = () => {
    setIsSpeakerMuted((prev) => {
      const next = !prev
      if (remoteVideoRef.current) {
        remoteVideoRef.current.muted = next
        if (!next) {
          const playAttempt = remoteVideoRef.current.play?.()
          if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(() => {})
          }
        }
      }
      return next
    })
  }

  const toggleCamera = () => {
    setIsCameraOn((prev) => {
      const next = !prev
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((track) => { track.enabled = !next })
      }
      return next
    })
  }

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.()
        return
      }
      await stageRef.current?.requestFullscreen?.()
    } catch {
      // ignore
    }
  }

  const startCallRecording = useCallback(async () => {
    if (recordingState !== 'idle') return
    if (!callId) return
    if (!hasLocalStreamRef.current) return
    if (!remoteStreamRef.current) return
    if (typeof MediaRecorder === 'undefined') {
      setRecordingState('failed')
      return
    }

    const localStream = localStreamRef.current
    const remoteStream = remoteStreamRef.current
    if (!localStream || !remoteStream) return

    try {
      // --- Build a composited video track via canvas (remote full + local PIP) ---
      const canvas = document.createElement('canvas')
      canvas.width = 1280
      canvas.height = 720
      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) throw new Error('Canvas recording context not available')

      const drawFrame = () => {
        // Background.
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const remoteVideo = remoteVideoRef.current
        const localVideo = localVideoRef.current

        // Draw remote full-screen when available; otherwise draw local.
        const canDrawRemote = remoteVideo && remoteVideo.readyState >= 2
        const canDrawLocal = localVideo && localVideo.readyState >= 2

        if (canDrawRemote) {
          ctx.drawImage(remoteVideo, 0, 0, canvas.width, canvas.height)
        } else if (canDrawLocal) {
          ctx.drawImage(localVideo, 0, 0, canvas.width, canvas.height)
        }

        // Local picture-in-picture overlay (bottom-right).
        if (canDrawLocal && canDrawRemote) {
          const pad = 22
          const pipW = Math.round(canvas.width * 0.28)
          const pipH = Math.round(canvas.height * 0.28)
          const x = canvas.width - pipW - pad
          const y = canvas.height - pipH - pad
          ctx.save()
          ctx.globalAlpha = 0.98
          ctx.fillStyle = 'rgba(0,0,0,0.25)'
          ctx.fillRect(x - 6, y - 6, pipW + 12, pipH + 12)
          ctx.drawImage(localVideo, x, y, pipW, pipH)
          ctx.strokeStyle = 'rgba(255,255,255,0.18)'
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, pipW, pipH)
          ctx.restore()
        }

        recordingCleanupRef.current.raf = window.requestAnimationFrame(drawFrame)
      }

      // --- Mix audio tracks into a single track ---
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const dest = audioCtx.createMediaStreamDestination()

      const connectStreamAudio = (stream) => {
        const hasAudio = stream.getAudioTracks().length > 0
        if (!hasAudio) return
        const source = audioCtx.createMediaStreamSource(stream)
        source.connect(dest)
      }

      connectStreamAudio(localStream)
      connectStreamAudio(remoteStream)

      const canvasStream = canvas.captureStream(30)
      const mixedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ])

      const supported = [
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp9,opus',
        'video/webm',
      ].find((mime) => {
        try {
          return MediaRecorder.isTypeSupported(mime)
        } catch {
          return false
        }
      })

      const recorder = new MediaRecorder(mixedStream, supported ? { mimeType: supported } : undefined)
      recordingChunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) recordingChunksRef.current.push(event.data)
      }

      recorder.onerror = () => {
        setRecordingState('failed')
      }

      // Store a cleanup object so we can stop raf + close audio context later.
      recordingCleanupRef.current = {
        raf: null,
        stop: () => {
          try {
            if (recordingCleanupRef.current?.raf) window.cancelAnimationFrame(recordingCleanupRef.current.raf)
          } catch {
            // ignore
          }
          try {
            audioCtx.close?.()
          } catch {
            // ignore
          }
          try {
            mixedStream.getTracks().forEach((t) => t.stop())
          } catch {
            // ignore
          }
        },
      }

      drawFrame()
      recorder.start(1000)
      recorderRef.current = recorder
      setRecordingState('recording')
    } catch (err) {
      setRecordingState('failed')
      setToast({ tone: 'error', message: err?.message || 'Recording could not be started.' })
    }
  }, [callId, recordingState])

  const stopRecordingAndUpload = useCallback(async () => {
    const token = getToken()
    if (!token || !callId) return
    const recorder = recorderRef.current
    if (!recorder || recorder.state === 'inactive') return

    setRecordingState('uploading')

    const stopped = new Promise((resolve) => {
      recorder.onstop = () => resolve(true)
    })

    try {
      recorder.stop()
    } catch {
      // ignore
    }

    await stopped

    try {
      recordingCleanupRef.current?.stop?.()
    } catch {
      // ignore
    }

    const chunks = recordingChunksRef.current || []
    const mimeType = recorder.mimeType || 'video/webm'
    const blob = new Blob(chunks, { type: mimeType })

    // Reset refs before upload so UI is not stuck if upload fails.
    recorderRef.current = null
    recordingChunksRef.current = []

    try {
      const form = new FormData()
      form.append('file', blob, `call-${callId}.webm`)

      const res = await fetch(`${API_BASE}/calls/${encodeURIComponent(callId)}/recording/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Recording upload failed')

      setRecordingState('available')
      setToast({ tone: 'success', message: 'Call recording saved securely.' })
    } catch (err) {
      setRecordingState('failed')
      setToast({ tone: 'error', message: err?.message || 'Recording upload failed.' })
    }
  }, [callId])

  useEffect(() => {
    // Auto-start call recording when the call is connected (mandatory call recording requirement).
    if (recordingState !== 'idle') return
    if (rtcConnectionState !== 'connected') return
    if (!hasLocalStream || !hasRemoteStream) return
    startCallRecording()
  }, [hasLocalStream, hasRemoteStream, recordingState, rtcConnectionState, startCallRecording])

  const endCall = async () => {
    const token = getToken()
    if (token && callId) {
      try {
        await apiRequest(`/calls/${callId}/end`, { method: 'POST', token })
      } catch {
        // ignore
      }
    }

    if (callId) {
      trackClientEvent('call_end', {
        entityType: 'call_session',
        entityId: callId,
        metadata: { match_id: effectiveMatchId || '' },
      })
    }

    // Stop recording and upload before leaving the call room.
    try {
      await stopRecordingAndUpload()
    } catch {
      // ignore
    }
    navigate('/chat')
  }

  const sendChatMessage = async () => {
    setIsEmojiOpen(false)
    const token = getToken()
    const content = chatDraft.trim()
    const threadId = effectiveMatchId || matchId
    if (!token || !content || !threadId) return
    try {
      if (isChatLive && wsRef.current && wsRef.current.readyState === WebSocket.OPEN && chatRoomMatchIdRef.current === threadId) {
        wsRef.current.send(JSON.stringify({
          type: 'chat_message',
          match_id: threadId,
          token,
          message: content,
          message_type: 'text',
        }))
      } else {
        const created = await apiRequest(`/messages/${threadId}`, {
          method: 'POST',
          token,
          body: { message: content, type: 'text' },
        })
        setChatMessages((prev) => [...prev, created])
      }
      setChatDraft('')
    } catch (err) {
      setStatusMessage(err?.message || 'Unable to send message')
    }
  }

  return (
    <div className="relative isolate flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-900 dark:from-[#050816] dark:via-slate-950/10 dark:to-[#120726] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-[callFloat_14s_ease-in-out_infinite] dark:bg-cyan-400/10" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10" style={{ animationDelay: '-6s' }} />
        <div className="absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10" style={{ animationDelay: '-12s' }} />
      </div>
      {toast ? (
        <div className="pointer-events-none fixed left-1/2 top-[76px] z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 px-2">
          <div className={`rounded-2xl px-4 py-2 text-center text-sm font-semibold shadow-lg ring-1 backdrop-blur-xl ${toast.tone === 'error' ? 'bg-rose-500/15 text-rose-100 ring-rose-500/25' : toast.tone === 'success' ? 'bg-emerald-500/15 text-emerald-50 ring-emerald-500/25' : 'bg-slate-950/75 text-white ring-white/10'}`}>
            {toast.message}
          </div>
        </div>
      ) : null}
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-200/60 bg-white/70 px-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-600 shadow-sm ring-1 ring-slate-200/60 transition hover:bg-white hover:text-slate-900 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
            title="Back"
          >
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base">
              Call with <span className="text-slate-600 dark:text-slate-300">“{remoteName}”</span>
            </div>
            <div className="hidden truncate text-xs text-slate-500 dark:text-slate-300/80 sm:block">
              {statusMessage || 'Preparing call...'}
            </div>
          </div>
        </div>

        <div className="flex flex-none items-center gap-2">
          <span className={`hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 sm:inline-flex ${connectionBadge.pillClass}`}>
            <span className={`h-2 w-2 rounded-full ${connectionBadge.dotClass}`} />
            {connectionBadge.label}
          </span>
          {recordingState !== 'idle' ? (
            <span className="hidden items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 sm:inline-flex">
              <span className={`h-2 w-2 rounded-full ${recordingState === 'recording' ? 'bg-rose-500 animate-pulse' : recordingState === 'available' ? 'bg-emerald-500' : recordingState === 'uploading' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
              {recordingState === 'recording'
                ? 'REC'
                : recordingState === 'uploading'
                  ? 'Uploading'
                  : recordingState === 'available'
                    ? 'Saved'
                    : 'Failed'}
            </span>
          ) : null}
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold tabular-nums text-slate-700 ring-1 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
            {timer}
          </span>
        </div>
      </header>

      {/* Main Layout Content */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6 lg:flex-row">
        
        {/* Left Side: Video Feed Area */}
        <div className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10">
          
          <div ref={stageRef} className="relative flex-1 overflow-hidden rounded-[24px] bg-slate-950">
            {/* Remote Participant Label */}
            <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold">
                {(remoteName || 'U').slice(0, 1).toUpperCase()}
              </div>
              <div className="max-w-[220px] truncate">{remoteName}</div>
            </div>

            {/* Remote Video (Main) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted={isSpeakerMuted}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
            {!hasRemoteStream && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-white/80">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold ring-1 ring-white/10">
                  {(remoteName || 'U').slice(0, 1).toUpperCase()}
                </div>
                <div className="text-base font-semibold">{remoteName}</div>
                <div className="max-w-xs text-center text-xs text-white/60">
                  {statusMessage || 'Waiting to connect...'}
                </div>
              </div>
            )}

            {mediaGate && !hasLocalStream && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 text-center text-white backdrop-blur-md">
                  <div className="text-lg font-semibold">{mediaGate.title}</div>
                  <div className="mt-2 text-sm text-white/80">{mediaGate.message}</div>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    {mediaGate.actionLabel ? (
                      <button
                        type="button"
                        onClick={() => ensureLocalStream().catch(() => {})}
                        disabled={isRequestingMedia}
                        className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
                      >
                        {isRequestingMedia ? 'Requesting...' : mediaGate.actionLabel}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setMediaGate(null)}
                      className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Local Video (PiP) */}
            <div
              className={`absolute right-5 top-5 z-30 aspect-video w-40 overflow-hidden rounded-2xl bg-black/80 ring-1 ${isSpeaking ? 'ring-cyan-300/70' : 'ring-white/20'} shadow-2xl shadow-black/40 sm:w-56`}
              style={isSpeaking ? { boxShadow: '0 22px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,211,238,0.35), 0 0 34px rgba(34,211,238,0.25)' } : undefined}
            >
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                {localName}
              </div>
            </div>

            {/* Floating Call Controls */}
            <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-black/35 p-2 backdrop-blur-xl ring-1 ring-white/10 shadow-lg">
              <button
                type="button"
                onClick={() => setIsChatOpen((prev) => !prev)}
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95 ${isChatOpen ? 'bg-sky-500/90 hover:bg-sky-500' : 'bg-white/10 hover:bg-white/15'}`}
                title={isChatOpen ? 'Hide chat' : 'Show chat'}
              >
                <MessageSquare size={20} />
                {unreadChatCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-black/40">
                    {unreadChatCount > 99 ? '99+' : unreadChatCount}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={toggleSpeaker}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95 ${isSpeakerMuted ? 'bg-amber-500/90 hover:bg-amber-500' : 'bg-white/10 hover:bg-white/15'}`}
                title={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
              >
                {isSpeakerMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button 
                type="button"
                onClick={toggleMute}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95 ${isMuted ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white/10 hover:bg-white/15'}`}
                title={isMuted ? 'Unmute mic' : 'Mute mic'}
                aria-pressed={!isMuted}
                style={!isMuted && micLevel > 0.02 ? { boxShadow: `0 0 ${10 + micLevel * 26}px rgba(34,211,238,${0.18 + micLevel * 0.35})` } : undefined}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button 
                type="button"
                onClick={endCall}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white transition-all hover:bg-rose-600 active:scale-95"
                title="End call"
              >
                <PhoneOff size={20} />
              </button>
              <button 
                type="button"
                onClick={toggleCamera}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95 ${!isCameraOn ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white/10 hover:bg-white/15'}`}
                title={!isCameraOn ? 'Turn camera on' : 'Turn camera off'}
              >
                {!isCameraOn ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95 ${isFullscreen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>

          {/* Transcription Bar */}
          <div className="flex items-center gap-3 border-t border-slate-200/60 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:px-6">
            <div className="flex items-end gap-1.5 text-sky-600 dark:text-cyan-300" aria-hidden="true">
              {[0.28, 0.44, 0.72, 0.44, 0.28].map((base, index) => (
                <span
                  key={index}
                  className="h-5 w-1.5 rounded-full bg-current transition-transform duration-150 will-change-transform"
                  style={{ transformOrigin: 'bottom', transform: `scaleY(${Math.max(0.18, base + micLevel * 0.9)})` }}
                />
              ))}
            </div>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              {statusMessage || callDetails?.context?.notes || 'Live call in progress.'}
            </p>
          </div>
        </div>

        {/* Right Side: Chat Sidebar */}
        {isChatOpen ? (
          <aside className="flex w-full flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10 lg:w-[380px]">
            <div className="flex h-14 items-center justify-between gap-3 border-b border-slate-200/60 bg-white/40 px-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="min-w-0">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80">Chat</h2>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-300/70">{remoteName}</p>
              </div>
              <div ref={morePopoverRef} className="relative flex items-center gap-2">
                <span className={`hidden items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 sm:inline-flex ${isChatLive ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-200' : 'bg-slate-500/10 text-slate-600 ring-slate-400/20 dark:text-slate-300'}`}>
                  <span className={`h-2 w-2 rounded-full ${isChatLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {isChatLive ? 'Live' : 'Syncing'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen((prev) => !prev)
                    setIsEmojiOpen(false)
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                  title="More"
                >
                  <MoreHorizontal size={20} />
                </button>

                {isMoreOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl bg-white/90 p-2 shadow-xl ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-slate-950/60 dark:ring-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        copyCallLink()
                        setIsMoreOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                    >
                      <Copy size={16} className="opacity-80" />
                      Copy call link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        requestMediaPermissions()
                        setIsMoreOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                    >
                      <ShieldAlert size={16} className="opacity-80" />
                      Request permissions
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        reconnectCall()
                        pushToast('Reconnecting call...', 'info')
                        setIsMoreOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                    >
                      <RefreshCw size={16} className="opacity-80" />
                      Reconnect
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChatOpen(false)
                        setIsMoreOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                    >
                      <MessageSquare size={16} className="opacity-80" />
                      Hide chat
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

          <div ref={chatScrollRef} className="flex-1 overflow-y-auto bg-slate-50/60 p-5 space-y-6 dark:bg-black/20 scrollbar-hide">
            {sortedChatMessages.length > 0 ? sortedChatMessages.map((msg) => {
              const isOwn = msg.sender_id === user?.id
              const sender = userMap.get(msg.sender_id)
              const senderName = msg.sender_name || sender?.name || sender?.email || 'User'
              return (
                <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!isOwn && (
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
                        {senderName[0] || 'U'}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{senderName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400/80">{formatMessageTime(msg.timestamp)}</span>
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
                    isOwn
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white/80 text-slate-800 ring-1 ring-slate-200/60 rounded-tl-none dark:bg-white/5 dark:text-slate-100 dark:ring-white/10'
                  }`}>
                    <MarkdownMessage text={msg.message || ''} />
                  </div>
                </div>
              )
            }) : (
              <div className="text-sm text-slate-400">No messages yet.</div>
            )}
            <div ref={chatEndRef} />
          </div>

            <div className="border-t border-slate-200/60 p-4 dark:border-white/10">
              <div className="relative flex items-center gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-slate-200/60 focus-within:ring-sky-500/30 dark:bg-white/5 dark:ring-white/10">
                <div ref={emojiPopoverRef} className="relative ml-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmojiOpen((prev) => !prev)
                      setIsMoreOpen(false)
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200 ${isEmojiOpen ? 'bg-slate-100 dark:bg-white/10' : ''}`}
                    title="Emoji"
                  >
                    <Smile size={20} />
                  </button>

                  {isEmojiOpen ? (
                    <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-2xl bg-white/90 p-3 shadow-xl ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-slate-950/60 dark:ring-white/10">
                      <div className="grid grid-cols-8 gap-1">
                        {QUICK_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setChatDraft((prev) => `${prev}${emoji}`)
                              setIsEmojiOpen(false)
                              chatInputRef.current?.focus?.()
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-lg transition hover:bg-slate-100 dark:hover:bg-white/10"
                            title={`Insert ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-300/70">Press Esc to close.</div>
                    </div>
                  ) : null}
                </div>
                <input 
                  ref={chatInputRef}
                  type="text" 
                  placeholder="Type here..."
                  className="flex-1 bg-transparent px-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-400/70"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage() }}
                  onFocus={() => setIsEmojiOpen(false)}
                />
                <button
                  type="button"
                  onClick={sendChatMessage}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 active:scale-95"
                  title="Send"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </aside>
        ) : null}

      </div>
    </div>
  )
}


