    1 | /*
    2 |   Route: /call
    3 |   Access: Protected (login required)
    4 |   Allowed roles: buyer, buying_house, factory, owner, admin, agent
    5 | 
    6 |   Public Pages:
    7 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    8 |   Protected Pages (login required):
    9 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
   10 |     /notifications, /chat, /call, /verification, /verification-center
   11 | 
   12 |   Primary responsibilities:
   13 |     - Provide video/audio call UI and call controls (mic/cam, participants, share links).
   14 |     - Enforce any call-related permissions and safety cues (recording / identity / dispute context).
   15 | 
   16 |   Key API endpoints (high level):
   17 |     - POST /api/calls (create) / GET /api/calls/:id (status) (depending on server)
   18 |     - Any signaling endpoints if implemented (or WebRTC signaling via WS)
   19 | 
   20 |   Notes:
   21 |     - AppLayout hides NavBar/Footer for /call (immersive route).
   22 | */
   23 | import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
   24 | import { useNavigate, useSearchParams } from 'react-router-dom'
   25 | import {
   26 |   ChevronLeft,
   27 |   Copy,
   28 |   RefreshCw,
   29 |   ShieldAlert,
   30 |   MessageSquare,
   31 |   Mic,
   32 |   MicOff,
   33 |   Video,
   34 |   VideoOff,
   35 |   PhoneOff,
   36 |   Volume2,
   37 |   VolumeX,
   38 |   Maximize,
   39 |   Send,
   40 |   Smile,
   41 |   MoreHorizontal,
   42 | } from 'lucide-react'
   43 | import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
   44 | import { trackClientEvent } from '../lib/events'
   45 | import MarkdownMessage from '../components/chat/MarkdownMessage'
   46 | import JourneyTimeline from '../components/JourneyTimeline'
   47 | 
   48 | const WS_BASE = (() => {
   49 |   if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
   50 |   const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
   51 |   return `${protocol}//${window.location.host}/ws`
   52 | })()
   53 | 
   54 | const ICE_SERVERS = (() => {
   55 |   const fallback = [{ urls: 'stun:stun.l.google.com:19302' }]
   56 |   const raw = import.meta.env.VITE_ICE_SERVERS
   57 |   if (!raw) return fallback
   58 |   try {
   59 |     const parsed = JSON.parse(raw)
   60 |     if (Array.isArray(parsed) && parsed.length > 0) return parsed
   61 |     return fallback
   62 |   } catch {
   63 |     return fallback
   64 |   }
   65 | })()
   66 | 
   67 | const QUICK_EMOJIS = [
   68 |   '😀', '😁', '😂', '🤣', '😊', '😍', '😎', '🤝',
   69 |   '👍', '👎', '🙏', '👏', '🎉', '🔥', '💯', '✅',
   70 |   '⚡', '💡', '📝', '📎', '🧠', '🚀', '❤️', '✨',
   71 | ]
   72 | 
   73 | export default function CallInterface() {
   74 |   const [searchParams] = useSearchParams()
   75 |   const navigate = useNavigate()
   76 |   const [statusMessage, setStatusMessage] = useState('')
   77 |   const [callDetails, setCallDetails] = useState(null)
   78 |   const [participants, setParticipants] = useState([])
   79 |   const [isMuted, setIsMuted] = useState(false)
   80 |   const [isSpeakerMuted, setIsSpeakerMuted] = useState(false)
   81 |   const [isCameraOn, setIsCameraOn] = useState(true)
   82 |   const [isFullscreen, setIsFullscreen] = useState(false)
   83 |   const [timer, setTimer] = useState('00:00:00')
   84 |   const [chatDraft, setChatDraft] = useState('')
   85 |   const [chatMessages, setChatMessages] = useState([])
   86 |   const [isChatOpen, setIsChatOpen] = useState(() => {
   87 |     if (typeof window === 'undefined') return true
   88 |     return window.innerWidth >= 1024
   89 |   })
   90 |   const [unreadChatCount, setUnreadChatCount] = useState(0)
   91 |   const [isChatLive, setIsChatLive] = useState(false)
   92 |   const [wsStatus, setWsStatus] = useState('offline')
   93 |   const [rtcConnectionState, setRtcConnectionState] = useState('new')
   94 |   const [rtcIceState, setRtcIceState] = useState('new')
   95 |   const [micLevel, setMicLevel] = useState(0)
   96 |   const [isEmojiOpen, setIsEmojiOpen] = useState(false)
   97 |   const [isMoreOpen, setIsMoreOpen] = useState(false)
   98 |   const [toast, setToast] = useState(null)
   99 |   const [reconnectNonce, setReconnectNonce] = useState(0)
  100 |   const [hasRemoteStream, setHasRemoteStream] = useState(false)
  101 |   const [hasLocalStream, setHasLocalStream] = useState(false)
  102 |   const [isRequestingMedia, setIsRequestingMedia] = useState(false)
  103 |   const [mediaGate, setMediaGate] = useState(null)
  104 |   const [recordingState, setRecordingState] = useState('idle') // idle | recording | uploading | available | failed
  105 | 
  106 |   const localVideoRef = useRef(null)
  107 |   const remoteVideoRef = useRef(null)
  108 |   const stageRef = useRef(null)
  109 |   const chatScrollRef = useRef(null)
  110 |   const chatEndRef = useRef(null)
  111 |   const chatInputRef = useRef(null)
  112 |   const emojiPopoverRef = useRef(null)
  113 |   const morePopoverRef = useRef(null)
  114 |   const toastTimerRef = useRef(null)
  115 |   const wsRef = useRef(null)
  116 |   const peerConnectionRef = useRef(null)
  117 |   const iceServersRef = useRef(ICE_SERVERS)
  118 |   const localStreamRef = useRef(null)
  119 |   const remoteStreamRef = useRef(null)
  120 |   const localStreamPromiseRef = useRef(null)
  121 |   const pendingCandidatesRef = useRef([])
  122 |   const pendingRemoteOfferRef = useRef(null)
  123 |   const shouldOfferRef = useRef(false)
  124 |   const offerSentRef = useRef(false)
  125 |   const tokenRef = useRef('')
  126 |   const hasLocalStreamRef = useRef(false)
  127 |   const mediaGateRef = useRef(null)
  128 |   const isMutedRef = useRef(false)
  129 |   const audioRafRef = useRef(null)
  130 |   const audioContextRef = useRef(null)
  131 |   const isChatOpenRef = useRef(true)
  132 |   const chatRoomMatchIdRef = useRef('')
  133 |   const chatInitializedRef = useRef(false)
  134 |   const mountedRef = useRef(true)
  135 |   const redirectedRef = useRef(false)
  136 | 
  137 |   // Call recording (project.md requirement): record the call room locally and upload after ending.
  138 |   // MVP approach: canvas-composited video (remote + local PIP) + mixed audio (local + remote).
  139 |   const recorderRef = useRef(null)
  140 |   const recordingChunksRef = useRef([])
  141 |   const recordingCleanupRef = useRef(null)
  142 | 
  143 |   const callId = useMemo(() => searchParams.get('callId') || '', [searchParams])
  144 |   const matchId = useMemo(() => searchParams.get('matchId') || '', [searchParams])
  145 |   const user = useMemo(() => getCurrentUser(), [])
  146 |   const participantId = useMemo(() => (user?.id ? String(user.id) : ''), [user?.id])
  147 |   const effectiveMatchId = callDetails?.match_id || callDetails?.context?.chat_thread_id || matchId
  148 | 
  149 |   const localName = user?.name || user?.email || 'You'
  150 |   const remoteParticipant = participants.find((p) => p.id && p.id !== user?.id) || null
  151 |   const remoteName = remoteParticipant?.name || remoteParticipant?.email || callDetails?.title || 'Participant'
  152 | 
  153 |   const userMap = useMemo(() => {
  154 |     const map = new Map()
  155 |     participants.forEach((p) => { if (p?.id) map.set(p.id, p) })
  156 |     if (user?.id) map.set(user.id, user)
  157 |     return map
  158 |   }, [participants, user])
  159 | 
  160 |   const sortedChatMessages = useMemo(() => {
  161 |     return [...chatMessages].sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime())
  162 |   }, [chatMessages])
  163 | 
  164 |   const isSpeaking = !isMuted && micLevel > 0.12
  165 | 
  166 |   const connectionBadge = useMemo(() => {
  167 |     const wsOnline = wsStatus === 'online'
  168 |     const rtcConnected = rtcConnectionState === 'connected'
  169 |     const rtcFailed = rtcConnectionState === 'failed' || rtcIceState === 'failed'
  170 |     const rtcConnecting = ['new', 'connecting'].includes(rtcConnectionState) || ['checking'].includes(rtcIceState)
  171 | 
  172 |     if (!wsOnline) {
  173 |       return {
  174 |         label: wsStatus === 'connecting' ? 'Connecting' : 'Offline',
  175 |         pillClass: 'bg-slate-500/10 text-slate-700 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10',
  176 |         dotClass: wsStatus === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400',
  177 |       }
  178 |     }
  179 | 
  180 |     if (rtcFailed) {
  181 |       return {
  182 |         label: 'Connection issue',
  183 |         pillClass: 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/25',
  184 |         dotClass: 'bg-rose-500',
  185 |       }
  186 |     }
  187 | 
  188 |     if (rtcConnected) {
  189 |       return {
  190 |         label: 'Live',
  191 |         pillClass: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/25',
  192 |         dotClass: 'bg-emerald-500 animate-pulse',
  193 |       }
  194 |     }
  195 | 
  196 |     if (rtcConnecting) {
  197 |       return {
  198 |         label: 'Connecting',
  199 |         pillClass: 'bg-amber-500/10 text-amber-800 ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/25',
  200 |         dotClass: 'bg-amber-500 animate-pulse',
  201 |       }
  202 |     }
  203 | 
  204 |     return {
  205 |       label: 'Waiting',
  206 |       pillClass: 'bg-slate-500/10 text-slate-700 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10',
  207 |       dotClass: 'bg-slate-400',
  208 |     }
  209 |   }, [rtcConnectionState, rtcIceState, wsStatus])
  210 | 
  211 |   const formatMessageTime = (iso) => {
  212 |     if (!iso) return ''
  213 |     return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  214 |   }
  215 | 
  216 |   const buildMediaGate = (error) => {
  217 |     if (!window.isSecureContext) {
  218 |       return {
  219 |         title: 'Camera/microphone requires HTTPS',
  220 |         message: 'Open this app on https:// (or localhost). Then refresh and try again.',
  221 |         actionLabel: null,
  222 |       }
  223 |     }
  224 | 
  225 |     const name = String(error?.name || '')
  226 |     if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
  227 |       return {
  228 |         title: 'Camera/microphone blocked',
  229 |         message: 'Allow Camera + Microphone for this site (browser lock icon → Site settings), then click “Try again”.',
  230 |         actionLabel: 'Try again',
  231 |       }
  232 |     }
  233 | 
  234 |     if (name === 'NotFoundError') {
  235 |       return {
  236 |         title: 'No camera/microphone found',
  237 |         message: 'Connect a camera/microphone (or enable it in OS settings), then click “Try again”.',
  238 |         actionLabel: 'Try again',
  239 |       }
  240 |     }
  241 | 
  242 |     if (name === 'NotReadableError') {
  243 |       return {
  244 |         title: 'Camera/microphone is busy',
  245 |         message: 'Close other apps using your camera/microphone (Zoom/Meet/etc.), then click “Try again”.',
  246 |         actionLabel: 'Try again',
  247 |       }
  248 |     }
  249 | 
  250 |     return {
  251 |       title: 'Unable to access camera/microphone',
  252 |       message: error?.message ? String(error.message) : 'Please check browser and OS permissions, then try again.',
  253 |       actionLabel: 'Try again',
  254 |     }
  255 |   }
  256 | 
  257 |   const ensureLocalStream = useCallback(async () => {
  258 |     if (localStreamRef.current) return localStreamRef.current
  259 |     if (localStreamPromiseRef.current) return localStreamPromiseRef.current
  260 | 
  261 |     if (!window.isSecureContext) {
  262 |       const error = new Error('Camera/microphone requires a secure context (HTTPS or localhost).')
  263 |       if (mountedRef.current) {
  264 |         setHasLocalStream(false)
  265 |         setMediaGate(buildMediaGate(error))
  266 |         setStatusMessage('Camera/microphone requires HTTPS.')
  267 |       }
  268 |       throw error
  269 |     }
  270 | 
  271 |     if (!navigator?.mediaDevices?.getUserMedia) {
  272 |       const error = new Error('getUserMedia is not supported in this browser/environment.')
  273 |       if (mountedRef.current) {
  274 |         setHasLocalStream(false)
  275 |         setMediaGate(buildMediaGate(error))
  276 |         setStatusMessage('Camera/microphone is not supported here.')
  277 |       }
  278 |       throw error
  279 |     }
  280 | 
  281 |     if (mountedRef.current) {
  282 |       setIsRequestingMedia(true)
  283 |     }
  284 | 
  285 |     localStreamPromiseRef.current = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  286 |       .then((stream) => {
  287 |         localStreamRef.current = stream
  288 |         if (mountedRef.current) {
  289 |           setHasLocalStream(true)
  290 |           setMediaGate(null)
  291 |         }
  292 |         if (localVideoRef.current) {
  293 |           localVideoRef.current.srcObject = stream
  294 |           const playAttempt = localVideoRef.current.play?.()
  295 |           if (playAttempt && typeof playAttempt.catch === 'function') {
  296 |             playAttempt.catch(() => {})
  297 |           }
  298 |         }
  299 | 
  300 |         if (peerConnectionRef.current) {
  301 |           stream.getTracks().forEach((track) => {
  302 |             try {
  303 |               peerConnectionRef.current.addTrack(track, stream)
  304 |             } catch {
  305 |               // ignore duplicate track errors
  306 |             }
  307 |           })
  308 |         }
  309 |         return stream
  310 |       })
  311 |       .catch((err) => {
  312 |         localStreamPromiseRef.current = null
  313 |         if (mountedRef.current) {
  314 |           setHasLocalStream(false)
  315 |           setMediaGate(buildMediaGate(err))
  316 |           setStatusMessage('Camera/microphone permission not granted.')
  317 |         }
  318 |         throw err
  319 |       })
  320 |       .finally(() => {
  321 |         if (mountedRef.current) {
  322 |           setIsRequestingMedia(false)
  323 |         }
  324 |       })
  325 | 
  326 |     return localStreamPromiseRef.current
  327 |   }, [])
  328 | 
  329 |   const toSessionDescriptionInit = (description) => {
  330 |     if (!description) return null
  331 |     if (typeof description.toJSON === 'function') return description.toJSON()
  332 |     if (typeof description.sdp === 'string' && typeof description.type === 'string') {
  333 |       return { type: description.type, sdp: description.sdp }
  334 |     }
  335 |     return description
  336 |   }
  337 | 
  338 |   const toIceCandidateInit = (candidate) => {
  339 |     if (!candidate) return null
  340 |     if (typeof candidate.toJSON === 'function') return candidate.toJSON()
  341 |     return candidate
  342 |   }
  343 | 
  344 |   const createPeerConnection = useCallback((token) => {
  345 |     if (peerConnectionRef.current) return peerConnectionRef.current
  346 |     const pc = new RTCPeerConnection({
  347 |       iceServers: iceServersRef.current,
  348 |     })
  349 | 
  350 |     pc.onicecandidate = (event) => {
  351 |       if (!event.candidate) return
  352 |       if (wsRef.current?.readyState !== WebSocket.OPEN) return
  353 |       wsRef.current.send(JSON.stringify({
  354 |         type: 'webrtc_signal',
  355 |         call_id: callId,
  356 |         token,
  357 |         signal: { type: 'candidate', candidate: toIceCandidateInit(event.candidate) },
  358 |       }))
  359 |     }
  360 | 
  361 |     pc.ontrack = (event) => {
  362 |       let stream = event.streams?.[0] || null
  363 |       if (!stream) {
  364 |         if (!remoteStreamRef.current) remoteStreamRef.current = new MediaStream()
  365 |         stream = remoteStreamRef.current
  366 |         try {
  367 |           stream.addTrack(event.track)
  368 |         } catch {
  369 |           // ignore duplicate track errors
  370 |         }
  371 |       }
  372 | 
  373 |       if (!stream) return
  374 |       remoteStreamRef.current = stream
  375 |       if (remoteVideoRef.current) {
  376 |         remoteVideoRef.current.srcObject = stream
  377 |         const playAttempt = remoteVideoRef.current.play?.()
  378 |         if (playAttempt && typeof playAttempt.catch === 'function') {
  379 |           playAttempt.catch(() => {})
  380 |         }
  381 |       }
  382 |       if (mountedRef.current) setHasRemoteStream(true)
  383 |     }
  384 | 
  385 |     pc.onconnectionstatechange = () => {
  386 |       if (!mountedRef.current) return
  387 |       setRtcConnectionState(pc.connectionState || 'new')
  388 |       if (pc.connectionState === 'connected') {
  389 |         setStatusMessage('Call connected.')
  390 |       } else if (pc.connectionState === 'failed') {
  391 |         setStatusMessage('Call connection failed.')
  392 |       }
  393 |     }
  394 | 
  395 |     pc.oniceconnectionstatechange = () => {
  396 |       if (!mountedRef.current) return
  397 |       setRtcIceState(pc.iceConnectionState || 'new')
  398 |       if (pc.iceConnectionState === 'failed') {
  399 |         setStatusMessage('ICE negotiation failed (TURN server may be required).')
  400 |       } else if (pc.iceConnectionState === 'disconnected') {
  401 |         setStatusMessage('ICE disconnected.')
  402 |       }
  403 |     }
  404 | 
  405 |     if (mountedRef.current) {
  406 |       setRtcConnectionState(pc.connectionState || 'new')
  407 |       setRtcIceState(pc.iceConnectionState || 'new')
  408 |     }
  409 | 
  410 |     if (localStreamRef.current) {
  411 |       localStreamRef.current.getTracks().forEach((track) => {
  412 |         pc.addTrack(track, localStreamRef.current)
  413 |       })
  414 |     }
  415 | 
  416 |     peerConnectionRef.current = pc
  417 |     return pc
  418 |   }, [callId])
  419 | 
  420 |   const tryStartOffer = useCallback(async () => {
  421 |     if (!shouldOfferRef.current) return false
  422 |     if (offerSentRef.current) return false
  423 |     if (!hasLocalStreamRef.current) return false
  424 | 
  425 |     const token = tokenRef.current
  426 |     if (!token) return false
  427 |     if (!callId) return false
  428 |     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false
  429 | 
  430 |     try {
  431 |       const pc = createPeerConnection(token)
  432 |       const offer = await pc.createOffer()
  433 |       await pc.setLocalDescription(offer)
  434 |       wsRef.current.send(JSON.stringify({
  435 |         type: 'webrtc_signal',
  436 |         call_id: callId,
  437 |         token,
  438 |         signal: { type: 'offer', sdp: toSessionDescriptionInit(pc.localDescription) || offer },
  439 |       }))
  440 | 
  441 |       offerSentRef.current = true
  442 |       if (mountedRef.current) {
  443 |         setStatusMessage('Offer sent. Waiting for answer...')
  444 |       }
  445 |       return true
  446 |     } catch (error) {
  447 |       offerSentRef.current = false
  448 |       throw error
  449 |     }
  450 |   }, [callId, createPeerConnection])
  451 | 
  452 |   const tryAnswerPendingOffer = useCallback(async () => {
  453 |     const pendingOffer = pendingRemoteOfferRef.current
  454 |     if (!pendingOffer) return false
  455 |     if (!hasLocalStreamRef.current) return false
  456 | 
  457 |     const token = tokenRef.current
  458 |     if (!token) return false
  459 |     if (!callId) return false
  460 |     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false
  461 | 
  462 |     try {
  463 |       const pc = createPeerConnection(token)
  464 |       await pc.setRemoteDescription(pendingOffer)
  465 |       const answer = await pc.createAnswer()
  466 |       await pc.setLocalDescription(answer)
  467 |       wsRef.current.send(JSON.stringify({
  468 |         type: 'webrtc_signal',
  469 |         call_id: callId,
  470 |         token,
  471 |         signal: { type: 'answer', sdp: toSessionDescriptionInit(pc.localDescription) || answer },
  472 |       }))
  473 | 
  474 |       pendingRemoteOfferRef.current = null
  475 |       const pending = pendingCandidatesRef.current
  476 |       pendingCandidatesRef.current = []
  477 |       for (const queued of pending) {
  478 |         try {
  479 |           await pc.addIceCandidate(queued)
  480 |         } catch {
  481 |           // ignore candidate errors
  482 |         }
  483 |       }
  484 | 
  485 |       if (mountedRef.current) {
  486 |         setStatusMessage('Answer sent. Connecting...')
  487 |       }
  488 |       return true
  489 |     } catch (error) {
  490 |       // Keep pending offer for retry after the user fixes permissions.
  491 |       pendingRemoteOfferRef.current = pendingOffer
  492 |       throw error
  493 |     }
  494 |   }, [callId, createPeerConnection])
  495 | 
  496 |   useEffect(() => {
  497 |     if (!callId) {
  498 |       if (!redirectedRef.current) {
  499 |         redirectedRef.current = true
  500 |         navigate('/chat', {
  501 |           state: {
  502 |             notice: {
  503 |               type: 'error',
  504 |               title: 'Call link missing',
  505 |               message: 'You were redirected because this page needs a valid call id. Please start a call from the chat page.',
  506 |             },
  507 |           },
  508 |         })
  509 |       }
  510 |     }
  511 |   }, [callId, navigate])
  512 | 
  513 |   const loadCallDetails = useCallback(async () => {
  514 |     const token = getToken()
  515 |     if (!token || !callId) return
  516 |     try {
  517 |       const details = await apiRequest(`/calls/${callId}`, { token })
  518 |       setCallDetails(details)
  519 |     } catch {
  520 |       if (!redirectedRef.current) {
  521 |         redirectedRef.current = true
  522 |         navigate('/chat', {
  523 |           state: {
  524 |             notice: {
  525 |               type: 'error',
  526 |               title: 'Call not available',
  527 |               message: 'You were redirected because the call id is invalid or you no longer have access.',
  528 |             },
  529 |           },
  530 |         })
  531 |       }
  532 |     }
  533 |   }, [callId, navigate])
  534 | 
  535 |   const startCallIfNeeded = useCallback(async () => {
  536 |     const token = getToken()
  537 |     if (!token || !callId) return
  538 |     try {
  539 |       await apiRequest(`/calls/${callId}/start`, { method: 'POST', token })
  540 |       if (effectiveMatchId) {
  541 |         const journey = await apiRequest('/workflow/journeys', {
  542 |           method: 'POST',
  543 |           token,
  544 |           body: { match_id: effectiveMatchId, initial_state: 'discovered' },
  545 |         })
  546 |         if (journey?.id) {
  547 |           await apiRequest(`/workflow/journeys/${encodeURIComponent(journey.id)}/transition`, {
  548 |             method: 'POST',
  549 |             token,
  550 |             body: { to_state: 'negotiating', event_type: 'call_joined' },
  551 |           })
  552 |         }
  553 |       }
  554 |     } catch {
  555 |       // no-op
  556 |     }
  557 |   }, [callId, effectiveMatchId])
  558 | 
  559 |   const loadParticipants = useCallback(async () => {
  560 |     const token = getToken()
  561 |     if (!token || !callDetails?.participant_ids?.length) return
  562 |     const data = await apiRequest('/users/lookup', {
  563 |       method: 'POST',
  564 |       token,
  565 |       body: { ids: callDetails.participant_ids },
  566 |     })
  567 |     setParticipants(data?.users || [])
  568 |   }, [callDetails])
  569 | 
  570 |   const loadChatMessages = useCallback(async () => {
  571 |     const token = getToken()
  572 |     if (!token || !effectiveMatchId) return
  573 |     const data = await apiRequest(`/messages/${effectiveMatchId}`, { token })
  574 |     setChatMessages(Array.isArray(data) ? data : [])
  575 |   }, [effectiveMatchId])
  576 | 
  577 |   const loadIceServers = useCallback(async (token) => {
  578 |     if (!token || !callId) return ICE_SERVERS
  579 |     try {
  580 |       const data = await apiRequest(`/calls/${callId}/ice`, { token })
  581 |       const servers = Array.isArray(data?.iceServers) ? data.iceServers : []
  582 |       if (servers.length > 0) return servers
  583 |     } catch {
  584 |       // fallback to VITE_ICE_SERVERS / STUN-only
  585 |     }
  586 |     return ICE_SERVERS
  587 |   }, [callId])
  588 | 
  589 |   const joinChatRoom = useCallback((matchToJoin) => {
  590 |     const matchToJoinId = String(matchToJoin || '').trim()
  591 |     if (!matchToJoinId) return false
  592 | 
  593 |     const ws = wsRef.current
  594 |     if (!ws || ws.readyState !== WebSocket.OPEN) return false
  595 | 
  596 |     const token = tokenRef.current || getToken()
  597 |     if (!token) return false
  598 | 
  599 |     chatRoomMatchIdRef.current = matchToJoinId
  600 |     chatInitializedRef.current = false
  601 |     if (mountedRef.current) setIsChatLive(false)
  602 | 
  603 |     try {
  604 |       ws.send(JSON.stringify({
  605 |         type: 'join_chat_room',
  606 |         match_id: matchToJoinId,
  607 |         token,
  608 |       }))
  609 |       return true
  610 |     } catch {
  611 |       return false
  612 |     }
  613 |   }, [])
  614 | 
  615 |   const pushToast = useCallback((message, tone = 'info') => {
  616 |     const safeMessage = String(message || '').trim()
  617 |     if (!safeMessage) return
  618 |     if (!mountedRef.current) return
  619 | 
  620 |     setToast({ message: safeMessage, tone })
  621 |     if (toastTimerRef.current && typeof window !== 'undefined') {
  622 |       window.clearTimeout(toastTimerRef.current)
  623 |     }
  624 |     if (typeof window !== 'undefined') {
  625 |       toastTimerRef.current = window.setTimeout(() => {
  626 |         if (mountedRef.current) setToast(null)
  627 |       }, 2200)
  628 |     }
  629 |   }, [])
  630 | 
  631 |   const reconnectCall = useCallback(() => {
  632 |     offerSentRef.current = false
  633 |     shouldOfferRef.current = false
  634 |     pendingRemoteOfferRef.current = null
  635 |     pendingCandidatesRef.current = []
  636 | 
  637 |     if (mountedRef.current) {
  638 |       setStatusMessage('Reconnecting...')
  639 |       setHasRemoteStream(false)
  640 |       setIsChatLive(false)
  641 |       setWsStatus('connecting')
  642 |       setRtcConnectionState('new')
  643 |       setRtcIceState('new')
  644 |     }
  645 | 
  646 |     remoteStreamRef.current = null
  647 |     if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
  648 | 
  649 |     try {
  650 |       peerConnectionRef.current?.close?.()
  651 |     } catch {
  652 |       // ignore
  653 |     }
  654 |     peerConnectionRef.current = null
  655 | 
  656 |     try {
  657 |       wsRef.current?.close?.()
  658 |     } catch {
  659 |       // ignore
  660 |     }
  661 | 
  662 |     setReconnectNonce((value) => value + 1)
  663 |   }, [])
  664 | 
  665 |   const copyCallLink = useCallback(async () => {
  666 |     try {
  667 |       await navigator.clipboard.writeText(window.location.href)
  668 |       pushToast('Call link copied.', 'success')
  669 |     } catch {
  670 |       pushToast('Unable to copy call link.', 'error')
  671 |     }
  672 |   }, [pushToast])
  673 | 
  674 |   const requestMediaPermissions = useCallback(() => {
  675 |     if (mountedRef.current) setMediaGate(null)
  676 |     ensureLocalStream()
  677 |       .then(() => pushToast('Camera & microphone ready.', 'success'))
  678 |       .catch(() => pushToast('Please allow camera & microphone for calls.', 'error'))
  679 |   }, [ensureLocalStream, pushToast])
  680 | 
  681 |   useEffect(() => {
  682 |     mountedRef.current = true
  683 |     return () => {
  684 |       mountedRef.current = false
  685 |       if (toastTimerRef.current && typeof window !== 'undefined') {
  686 |         window.clearTimeout(toastTimerRef.current)
  687 |       }
  688 |       if (audioRafRef.current && typeof window !== 'undefined') {
  689 |         window.cancelAnimationFrame(audioRafRef.current)
  690 |       }
  691 |       if (audioContextRef.current) {
  692 |         audioContextRef.current.close?.().catch?.(() => {})
  693 |       }
  694 |     }
  695 |   }, [])
  696 | 
  697 |   useEffect(() => {
  698 |     hasLocalStreamRef.current = Boolean(hasLocalStream)
  699 |   }, [hasLocalStream])
  700 | 
  701 |   useEffect(() => {
  702 |     isMutedRef.current = Boolean(isMuted)
  703 |   }, [isMuted])
  704 | 
  705 |   useEffect(() => {
  706 |     mediaGateRef.current = mediaGate
  707 |   }, [mediaGate])
  708 | 
  709 |   useEffect(() => {
  710 |     isChatOpenRef.current = Boolean(isChatOpen)
  711 |     if (isChatOpen) setUnreadChatCount(0)
  712 |   }, [isChatOpen])
  713 | 
  714 |   useEffect(() => {
  715 |     if (!isChatOpen) return
  716 |     if (typeof window === 'undefined') return
  717 |     window.requestAnimationFrame(() => {
  718 |       chatEndRef.current?.scrollIntoView?.({ behavior: 'auto', block: 'end' })
  719 |     })
  720 |   }, [isChatOpen])
  721 | 
  722 |   useEffect(() => { loadCallDetails() }, [loadCallDetails])
  723 |   useEffect(() => { startCallIfNeeded() }, [startCallIfNeeded])
  724 |   useEffect(() => { loadParticipants() }, [loadParticipants])
  725 |   useEffect(() => { loadChatMessages() }, [loadChatMessages])
  726 | 
  727 |   useEffect(() => {
  728 |     if (!effectiveMatchId) return
  729 |     joinChatRoom(effectiveMatchId)
  730 |   }, [effectiveMatchId, joinChatRoom])
  731 | 
  732 |   useEffect(() => {
  733 |     if (sortedChatMessages.length === 0) return
  734 | 
  735 |     const last = sortedChatMessages[sortedChatMessages.length - 1]
  736 |     const lastIsOwn = last?.sender_id === user?.id
  737 |     const firstLoad = !chatInitializedRef.current
  738 | 
  739 |     const scrollEl = chatScrollRef.current
  740 |     const distanceFromBottom = scrollEl
  741 |       ? scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight
  742 |       : 0
  743 |     const nearBottom = distanceFromBottom < 140
  744 | 
  745 |     const shouldAutoScroll = firstLoad || (isChatOpenRef.current && (lastIsOwn || nearBottom))
  746 |     if (firstLoad) chatInitializedRef.current = true
  747 | 
  748 |     if (shouldAutoScroll) {
  749 |       setUnreadChatCount(0)
  750 |       chatEndRef.current?.scrollIntoView?.({ behavior: firstLoad ? 'auto' : 'smooth', block: 'end' })
  751 |       return
  752 |     }
  753 | 
  754 |     if (!firstLoad && !lastIsOwn && !isChatOpenRef.current) {
  755 |       setUnreadChatCount((count) => count + 1)
  756 |     }
  757 |   }, [sortedChatMessages, user?.id])
  758 | 
  759 |   useEffect(() => {
  760 |     if (isChatOpen) return
  761 |     if (isEmojiOpen) setIsEmojiOpen(false)
  762 |     if (isMoreOpen) setIsMoreOpen(false)
  763 |   }, [isChatOpen, isEmojiOpen, isMoreOpen])
  764 | 
  765 |   useEffect(() => {
  766 |     if (!isEmojiOpen && !isMoreOpen) return undefined
  767 | 
  768 |     const handleKeyDown = (event) => {
  769 |       if (event.key !== 'Escape') return
  770 |       setIsEmojiOpen(false)
  771 |       setIsMoreOpen(false)
  772 |     }
  773 | 
  774 |     const handleMouseDown = (event) => {
  775 |       const target = event.target
  776 |       if (isEmojiOpen && emojiPopoverRef.current && emojiPopoverRef.current.contains(target)) return
  777 |       if (isMoreOpen && morePopoverRef.current && morePopoverRef.current.contains(target)) return
  778 |       setIsEmojiOpen(false)
  779 |       setIsMoreOpen(false)
  780 |     }
  781 | 
  782 |     document.addEventListener('keydown', handleKeyDown)
  783 |     document.addEventListener('mousedown', handleMouseDown)
  784 |     return () => {
  785 |       document.removeEventListener('keydown', handleKeyDown)
  786 |       document.removeEventListener('mousedown', handleMouseDown)
  787 |     }
  788 |   }, [isEmojiOpen, isMoreOpen])
  789 | 
  790 |   useEffect(() => {
  791 |     if (!hasLocalStream) {
  792 |       setMicLevel(0)
  793 |       return undefined
  794 |     }
  795 | 
  796 |     if (typeof window === 'undefined') return undefined
  797 |     const stream = localStreamRef.current
  798 |     const audioTrack = stream?.getAudioTracks?.()[0] || null
  799 |     if (!audioTrack) {
  800 |       setMicLevel(0)
  801 |       return undefined
  802 |     }
  803 | 
  804 |     const AudioContextCtor = window.AudioContext || window.webkitAudioContext
  805 |     if (!AudioContextCtor) return undefined
  806 | 
  807 |     let cancelled = false
  808 |     let ctx = null
  809 |     let analyser = null
  810 |     let source = null
  811 |     let smoothing = 0
  812 |     let lastUiUpdateAt = 0
  813 | 
  814 |     try {
  815 |       ctx = new AudioContextCtor()
  816 |       audioContextRef.current = ctx
  817 |       analyser = ctx.createAnalyser()
  818 |       analyser.fftSize = 512
  819 |       source = ctx.createMediaStreamSource(new MediaStream([audioTrack]))
  820 |       source.connect(analyser)
  821 |     } catch {
  822 |       setMicLevel(0)
  823 |       return undefined
  824 |     }
  825 | 
  826 |     const data = new Uint8Array(analyser.fftSize)
  827 | 
  828 |     const tick = (timestamp) => {
  829 |       if (cancelled) return
  830 |       try {
  831 |         analyser.getByteTimeDomainData(data)
  832 |         let sum = 0
  833 |         for (let i = 0; i < data.length; i++) {
  834 |           const v = (data[i] - 128) / 128
  835 |           sum += v * v
  836 |         }
  837 |         const rms = Math.sqrt(sum / data.length)
  838 |         const level = Math.min(1, rms * 3.2)
  839 |         smoothing = smoothing * 0.82 + level * 0.18
  840 | 
  841 |         if (mountedRef.current && timestamp - lastUiUpdateAt > 90) {
  842 |           lastUiUpdateAt = timestamp
  843 |           setMicLevel(isMutedRef.current ? 0 : Number(smoothing.toFixed(3)))
  844 |         }
  845 |       } catch {
  846 |         // ignore
  847 |       }
  848 |       audioRafRef.current = window.requestAnimationFrame(tick)
  849 |     }
  850 | 
  851 |     audioRafRef.current = window.requestAnimationFrame(tick)
  852 |     ctx.resume?.().catch?.(() => {})
  853 | 
  854 |     return () => {
  855 |       cancelled = true
  856 |       if (audioRafRef.current && typeof window !== 'undefined') {
  857 |         window.cancelAnimationFrame(audioRafRef.current)
  858 |       }
  859 |       try { source?.disconnect?.() } catch { /* ignore */ }
  860 |       try { analyser?.disconnect?.() } catch { /* ignore */ }
  861 |       try { ctx?.close?.() } catch { /* ignore */ }
  862 |       audioContextRef.current = null
  863 |       if (mountedRef.current) setMicLevel(0)
  864 |     }
  865 |   }, [hasLocalStream])
  866 | 
  867 |   useEffect(() => {
  868 |     let active = true
  869 |     async function initPermissions() {
  870 |       if (!active) return
  871 | 
  872 |       if (!window.isSecureContext) {
  873 |         if (mountedRef.current) {
  874 |           setMediaGate(buildMediaGate(new Error('insecure_context')))
  875 |           setHasLocalStream(false)
  876 |         }
  877 |         return
  878 |       }
  879 | 
  880 |       if (!navigator?.permissions?.query) {
  881 |         ensureLocalStream().catch(() => {})
  882 |         return
  883 |       }
  884 | 
  885 |       try {
  886 |         const [cam, mic] = await Promise.all([
  887 |           navigator.permissions.query({ name: 'camera' }),
  888 |           navigator.permissions.query({ name: 'microphone' }),
  889 |         ])
  890 | 
  891 |         const state = [cam?.state, mic?.state]
  892 |         if (state.includes('denied')) {
  893 |           if (mountedRef.current) {
  894 |             setMediaGate(buildMediaGate({ name: 'NotAllowedError' }))
  895 |             setHasLocalStream(false)
  896 |           }
  897 |           return
  898 |         }
  899 | 
  900 |         if (state.includes('prompt')) {
  901 |           if (mountedRef.current) {
  902 |             setMediaGate({
  903 |               title: 'Enable camera & microphone',
  904 |               message: 'Click “Allow access” to let this page use your camera/microphone for the call.',
  905 |               actionLabel: 'Allow access',
  906 |             })
  907 |             setHasLocalStream(false)
  908 |           }
  909 |           return
  910 |         }
  911 | 
  912 |         ensureLocalStream().catch(() => {})
  913 |       } catch {
  914 |         ensureLocalStream().catch(() => {})
  915 |       }
  916 |     }
  917 | 
  918 |     initPermissions()
  919 |     return () => {
  920 |       active = false
  921 |       if (localStreamRef.current) {
  922 |         localStreamRef.current.getTracks().forEach((track) => track.stop())
  923 |       }
  924 |       if (mountedRef.current) {
  925 |         setHasLocalStream(false)
  926 |       }
  927 |     }
  928 |   }, [ensureLocalStream])
  929 | 
  930 |   useEffect(() => {
  931 |     if (!hasLocalStream) return
  932 |     tryAnswerPendingOffer().catch(() => {})
  933 |     tryStartOffer().catch(() => {})
  934 |   }, [hasLocalStream, tryAnswerPendingOffer, tryStartOffer])
  935 | 
  936 |   useEffect(() => {
  937 |     const token = getToken()
  938 |     if (!token || !callId) return
  939 |     tokenRef.current = token
  940 | 
  941 |     let active = true
  942 |     const safeSetStatus = (message) => {
  943 |       if (!active || !mountedRef.current) return
  944 |       setStatusMessage(message)
  945 |     }
  946 |     const safeSetWsStatus = (next) => {
  947 |       if (!active || !mountedRef.current) return
  948 |       setWsStatus(next)
  949 |     }
  950 |     const safeSetRemoteStream = (value) => {
  951 |       if (!active || !mountedRef.current) return
  952 |       setHasRemoteStream(value)
  953 |     }
  954 | 
  955 |     let ws = null
  956 | 
  957 |     async function connect() {
  958 |       safeSetStatus('Fetching ICE servers...')
  959 |       const resolvedIceServers = await loadIceServers(token)
  960 |       iceServersRef.current = resolvedIceServers
  961 |       if (!active) return
  962 | 
  963 |       safeSetWsStatus('connecting')
  964 |       ws = new WebSocket(WS_BASE)
  965 |       wsRef.current = ws
  966 |       safeSetStatus('Connecting to call server...')
  967 | 
  968 |       const sendSignal = (payload) => {
  969 |         if (ws.readyState !== WebSocket.OPEN) return
  970 |         ws.send(JSON.stringify(payload))
  971 |       }
  972 | 
  973 |       ws.onopen = () => {
  974 |         safeSetWsStatus('online')
  975 |         safeSetStatus('Joining call...')
  976 |         sendSignal({
  977 |           type: 'join_call_room',
  978 |           call_id: callId,
  979 |           token,
  980 |           participant_id: participantId,
  981 |         })
  982 |         const chatToJoin = chatRoomMatchIdRef.current || matchId
  983 |         if (chatToJoin) joinChatRoom(chatToJoin)
  984 |       }
  985 | 
  986 |       ws.onmessage = async (event) => {
  987 |         let payload
  988 |         try {
  989 |           payload = JSON.parse(String(event.data || ''))
  990 |         } catch {
  991 |           return
  992 |         }
  993 | 
  994 |         if (payload.type === 'call_error') {
  995 |           safeSetStatus(payload.error || 'Unable to join call room.')
  996 |           return
  997 |         }
  998 | 
  999 |         if (payload.type === 'joined_call_room') {
 1000 |           safeSetStatus(payload.should_offer ? 'Participant found. Starting call...' : 'Waiting for participant to join...')
 1001 |           shouldOfferRef.current = Boolean(payload.should_offer)
 1002 |           offerSentRef.current = false
 1003 |           createPeerConnection(token)
 1004 |           if (payload.should_offer) {
 1005 |             if (!hasLocalStreamRef.current) {
 1006 |               safeSetStatus('Allow camera/mic access to start the call.')
 1007 |               if (!mediaGateRef.current && mountedRef.current) {
 1008 |                 setMediaGate({
 1009 |                   title: 'Enable camera & microphone',
 1010 |                   message: 'Click “Allow access” to start the call.',
 1011 |                   actionLabel: 'Allow access',
 1012 |                 })
 1013 |               }
 1014 |               return
 1015 |             }
 1016 | 
 1017 |             tryStartOffer().catch((error) => {
 1018 |               safeSetStatus(`Unable to start call: ${error?.message || 'offer failed'}`)
 1019 |             })
 1020 |           }
 1021 |           return
 1022 |         }
 1023 | 
 1024 |         if (payload.type === 'participant_joined') {
 1025 |           safeSetStatus('Participant joined. Connecting...')
 1026 |           createPeerConnection(token)
 1027 |           return
 1028 |         }
 1029 | 
 1030 |         if (payload.type === 'joined_chat_room') {
 1031 |           const history = Array.isArray(payload.messages) ? [...payload.messages] : []
 1032 |           history.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime())
 1033 |           chatInitializedRef.current = false
 1034 |           if (payload.match_id) chatRoomMatchIdRef.current = String(payload.match_id)
 1035 |           setChatMessages(history)
 1036 |           setIsChatLive(true)
 1037 |           return
 1038 |         }
 1039 | 
 1040 |         if (payload.type === 'chat_message') {
 1041 |           const incoming = payload.message
 1042 |           if (!incoming?.id) return
 1043 |           setIsChatLive(true)
 1044 |           setChatMessages((previous) => {
 1045 |             if (previous.some((msg) => msg.id === incoming.id)) return previous
 1046 |             return [...previous, incoming]
 1047 |           })
 1048 |           return
 1049 |         }
 1050 | 
 1051 |         if (payload.type === 'chat_error') {
 1052 |           safeSetStatus(payload.error || 'Chat error.')
 1053 |           return
 1054 |         }
 1055 | 
 1056 |         if (payload.type === 'webrtc_signal' && payload.signal) {
 1057 |           const pc = createPeerConnection(token)
 1058 |           const signal = payload.signal
 1059 |           if (signal.type === 'offer') {
 1060 |             if (!signal.sdp) {
 1061 |               safeSetStatus('Offer handling failed: Missing offer SDP')
 1062 |               return
 1063 |             }
 1064 | 
 1065 |             if (!hasLocalStreamRef.current) {
 1066 |               pendingRemoteOfferRef.current = signal.sdp
 1067 |               safeSetStatus('Incoming call. Allow camera/mic to answer...')
 1068 |               if (!mediaGateRef.current && mountedRef.current) {
 1069 |                 setMediaGate({
 1070 |                   title: 'Enable camera & microphone',
 1071 |                   message: 'Click “Allow access” to answer the call.',
 1072 |                   actionLabel: 'Allow access',
 1073 |                 })
 1074 |               }
 1075 |               return
 1076 |             }
 1077 | 
 1078 |             try {
 1079 |               safeSetStatus('Offer received. Sending answer...')
 1080 |               await pc.setRemoteDescription(signal.sdp)
 1081 |               const answer = await pc.createAnswer()
 1082 |               await pc.setLocalDescription(answer)
 1083 |               sendSignal({
 1084 |                 type: 'webrtc_signal',
 1085 |                 call_id: callId,
 1086 |                 token,
 1087 |                 signal: { type: 'answer', sdp: toSessionDescriptionInit(pc.localDescription) || answer },
 1088 |               })
 1089 |               safeSetStatus('Answer sent. Connecting...')
 1090 | 
 1091 |               const pending = pendingCandidatesRef.current
 1092 |               pendingCandidatesRef.current = []
 1093 |               for (const queued of pending) {
 1094 |                 try {
 1095 |                   await pc.addIceCandidate(queued)
 1096 |                 } catch {
 1097 |                   // ignore candidate errors
 1098 |                 }
 1099 |               }
 1100 |             } catch (error) {
 1101 |               safeSetStatus(`Offer handling failed: ${error?.message || 'unknown error'}`)
 1102 |             }
 1103 |           } else if (signal.type === 'answer') {
 1104 |             try {
 1105 |               safeSetStatus('Answer received. Connecting...')
 1106 |               if (!signal.sdp) throw new Error('Missing answer SDP')
 1107 |               await pc.setRemoteDescription(signal.sdp)
 1108 | 
 1109 |               const pending = pendingCandidatesRef.current
 1110 |               pendingCandidatesRef.current = []
 1111 |               for (const queued of pending) {
 1112 |                 try {
 1113 |                   await pc.addIceCandidate(queued)
 1114 |                 } catch {
 1115 |                   // ignore candidate errors
 1116 |                 }
 1117 |               }
 1118 |             } catch (error) {
 1119 |               safeSetStatus(`Answer handling failed: ${error?.message || 'unknown error'}`)
 1120 |             }
 1121 |           } else if (signal.type === 'candidate') {
 1122 |             try {
 1123 |               const candidate = signal.candidate
 1124 |               if (pc.remoteDescription && pc.remoteDescription.type) {
 1125 |                 await pc.addIceCandidate(candidate)
 1126 |               } else {
 1127 |                 pendingCandidatesRef.current.push(candidate)
 1128 |               }
 1129 |             } catch {
 1130 |               // ignore candidate errors
 1131 |             }
 1132 |           }
 1133 |         }
 1134 | 
 1135 |         if (payload.type === 'participant_left') {
 1136 |           safeSetStatus('Participant left the call.')
 1137 |           safeSetRemoteStream(false)
 1138 |           remoteStreamRef.current = null
 1139 |           if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
 1140 |         }
 1141 |       }
 1142 | 
 1143 |       ws.onerror = () => {
 1144 |         safeSetWsStatus('error')
 1145 |         safeSetStatus('Unable to reach call server.')
 1146 |       }
 1147 | 
 1148 |       ws.onclose = () => {
 1149 |         safeSetWsStatus('offline')
 1150 |         safeSetStatus('Call server disconnected.')
 1151 |         if (mountedRef.current) setIsChatLive(false)
 1152 |         safeSetRemoteStream(false)
 1153 |         remoteStreamRef.current = null
 1154 |         if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
 1155 |         if (peerConnectionRef.current) {
 1156 |           peerConnectionRef.current.close()
 1157 |           peerConnectionRef.current = null
 1158 |         }
 1159 |         if (mountedRef.current) {
 1160 |           setRtcConnectionState('new')
 1161 |           setRtcIceState('new')
 1162 |         }
 1163 |       }
 1164 |     }
 1165 | 
 1166 |     connect().catch(() => {
 1167 |       safeSetStatus('Unable to start call signaling.')
 1168 |     })
 1169 | 
 1170 |     return () => {
 1171 |       active = false
 1172 |       if (ws) ws.close()
 1173 |     }
 1174 |   }, [callId, matchId, participantId, reconnectNonce, createPeerConnection, joinChatRoom, loadIceServers, tryStartOffer])
 1175 | 
 1176 |   useEffect(() => {
 1177 |     const startedAt = callDetails?.started_at || callDetails?.created_at
 1178 |     if (!startedAt) return
 1179 |     const startMs = new Date(startedAt).getTime()
 1180 |     const interval = setInterval(() => {
 1181 |       const elapsed = Math.max(0, Date.now() - startMs)
 1182 |       const totalSeconds = Math.floor(elapsed / 1000)
 1183 |       const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
 1184 |       const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
 1185 |       const seconds = String(totalSeconds % 60).padStart(2, '0')
 1186 |       setTimer(`${hours}:${minutes}:${seconds}`)
 1187 |     }, 1000)
 1188 |     return () => clearInterval(interval)
 1189 |   }, [callDetails])
 1190 | 
 1191 |   useEffect(() => {
 1192 |     const handleFullscreenChange = () => {
 1193 |       setIsFullscreen(Boolean(document.fullscreenElement))
 1194 |     }
 1195 | 
 1196 |     document.addEventListener('fullscreenchange', handleFullscreenChange)
 1197 |     return () => {
 1198 |       document.removeEventListener('fullscreenchange', handleFullscreenChange)
 1199 |     }
 1200 |   }, [])
 1201 | 
 1202 |   const toggleMute = () => {
 1203 |     setIsMuted((prev) => {
 1204 |       const next = !prev
 1205 |       if (localStreamRef.current) {
 1206 |         localStreamRef.current.getAudioTracks().forEach((track) => { track.enabled = !next })
 1207 |       }
 1208 |       return next
 1209 |     })
 1210 |   }
 1211 | 
 1212 |   const toggleSpeaker = () => {
 1213 |     setIsSpeakerMuted((prev) => {
 1214 |       const next = !prev
 1215 |       if (remoteVideoRef.current) {
 1216 |         remoteVideoRef.current.muted = next
 1217 |         if (!next) {
 1218 |           const playAttempt = remoteVideoRef.current.play?.()
 1219 |           if (playAttempt && typeof playAttempt.catch === 'function') {
 1220 |             playAttempt.catch(() => {})
 1221 |           }
 1222 |         }
 1223 |       }
 1224 |       return next
 1225 |     })
 1226 |   }
 1227 | 
 1228 |   const toggleCamera = () => {
 1229 |     setIsCameraOn((prev) => {
 1230 |       const next = !prev
 1231 |       if (localStreamRef.current) {
 1232 |         localStreamRef.current.getVideoTracks().forEach((track) => { track.enabled = !next })
 1233 |       }
 1234 |       return next
 1235 |     })
 1236 |   }
 1237 | 
 1238 |   const toggleFullscreen = async () => {
 1239 |     try {
 1240 |       if (document.fullscreenElement) {
 1241 |         await document.exitFullscreen?.()
 1242 |         return
 1243 |       }
 1244 |       await stageRef.current?.requestFullscreen?.()
 1245 |     } catch {
 1246 |       // ignore
 1247 |     }
 1248 |   }
 1249 | 
 1250 |   const startCallRecording = useCallback(async () => {
 1251 |     if (recordingState !== 'idle') return
 1252 |     if (!callId) return
 1253 |     if (!hasLocalStreamRef.current) return
 1254 |     if (!remoteStreamRef.current) return
 1255 |     if (typeof MediaRecorder === 'undefined') {
 1256 |       setRecordingState('failed')
 1257 |       return
 1258 |     }
 1259 | 
 1260 |     const localStream = localStreamRef.current
 1261 |     const remoteStream = remoteStreamRef.current
 1262 |     if (!localStream || !remoteStream) return
 1263 | 
 1264 |     try {
 1265 |       // --- Build a composited video track via canvas (remote full + local PIP) ---
 1266 |       const canvas = document.createElement('canvas')
 1267 |       canvas.width = 1280
 1268 |       canvas.height = 720
 1269 |       const ctx = canvas.getContext('2d', { alpha: false })
 1270 |       if (!ctx) throw new Error('Canvas recording context not available')
 1271 | 
 1272 |       const drawFrame = () => {
 1273 |         // Background.
 1274 |         ctx.fillStyle = '#000'
 1275 |         ctx.fillRect(0, 0, canvas.width, canvas.height)
 1276 | 
 1277 |         const remoteVideo = remoteVideoRef.current
 1278 |         const localVideo = localVideoRef.current
 1279 | 
 1280 |         // Draw remote full-screen when available; otherwise draw local.
 1281 |         const canDrawRemote = remoteVideo && remoteVideo.readyState >= 2
 1282 |         const canDrawLocal = localVideo && localVideo.readyState >= 2
 1283 | 
 1284 |         if (canDrawRemote) {
 1285 |           ctx.drawImage(remoteVideo, 0, 0, canvas.width, canvas.height)
 1286 |         } else if (canDrawLocal) {
 1287 |           ctx.drawImage(localVideo, 0, 0, canvas.width, canvas.height)
 1288 |         }
 1289 | 
 1290 |         // Local picture-in-picture overlay (bottom-right).
 1291 |         if (canDrawLocal && canDrawRemote) {
 1292 |           const pad = 22
 1293 |           const pipW = Math.round(canvas.width * 0.28)
 1294 |           const pipH = Math.round(canvas.height * 0.28)
 1295 |           const x = canvas.width - pipW - pad
 1296 |           const y = canvas.height - pipH - pad
 1297 |           ctx.save()
 1298 |           ctx.globalAlpha = 0.98
 1299 |           ctx.fillStyle = 'rgba(0,0,0,0.25)'
 1300 |           ctx.fillRect(x - 6, y - 6, pipW + 12, pipH + 12)
 1301 |           ctx.drawImage(localVideo, x, y, pipW, pipH)
 1302 |           ctx.strokeStyle = 'rgba(255,255,255,0.18)'
 1303 |           ctx.lineWidth = 2
 1304 |           ctx.strokeRect(x, y, pipW, pipH)
 1305 |           ctx.restore()
 1306 |         }
 1307 | 
 1308 |         recordingCleanupRef.current.raf = window.requestAnimationFrame(drawFrame)
 1309 |       }
 1310 | 
 1311 |       // --- Mix audio tracks into a single track ---
 1312 |       const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
 1313 |       const dest = audioCtx.createMediaStreamDestination()
 1314 | 
 1315 |       const connectStreamAudio = (stream) => {
 1316 |         const hasAudio = stream.getAudioTracks().length > 0
 1317 |         if (!hasAudio) return
 1318 |         const source = audioCtx.createMediaStreamSource(stream)
 1319 |         source.connect(dest)
 1320 |       }
 1321 | 
 1322 |       connectStreamAudio(localStream)
 1323 |       connectStreamAudio(remoteStream)
 1324 | 
 1325 |       const canvasStream = canvas.captureStream(30)
 1326 |       const mixedStream = new MediaStream([
 1327 |         ...canvasStream.getVideoTracks(),
 1328 |         ...dest.stream.getAudioTracks(),
 1329 |       ])
 1330 | 
 1331 |       const supported = [
 1332 |         'video/webm;codecs=vp8,opus',
 1333 |         'video/webm;codecs=vp9,opus',
 1334 |         'video/webm',
 1335 |       ].find((mime) => {
 1336 |         try {
 1337 |           return MediaRecorder.isTypeSupported(mime)
 1338 |         } catch {
 1339 |           return false
 1340 |         }
 1341 |       })
 1342 | 
 1343 |       const recorder = new MediaRecorder(mixedStream, supported ? { mimeType: supported } : undefined)
 1344 |       recordingChunksRef.current = []
 1345 | 
 1346 |       recorder.ondataavailable = (event) => {
 1347 |         if (event.data && event.data.size > 0) recordingChunksRef.current.push(event.data)
 1348 |       }
 1349 | 
 1350 |       recorder.onerror = () => {
 1351 |         setRecordingState('failed')
 1352 |       }
 1353 | 
 1354 |       // Store a cleanup object so we can stop raf + close audio context later.
 1355 |       recordingCleanupRef.current = {
 1356 |         raf: null,
 1357 |         stop: () => {
 1358 |           try {
 1359 |             if (recordingCleanupRef.current?.raf) window.cancelAnimationFrame(recordingCleanupRef.current.raf)
 1360 |           } catch {
 1361 |             // ignore
 1362 |           }
 1363 |           try {
 1364 |             audioCtx.close?.()
 1365 |           } catch {
 1366 |             // ignore
 1367 |           }
 1368 |           try {
 1369 |             mixedStream.getTracks().forEach((t) => t.stop())
 1370 |           } catch {
 1371 |             // ignore
 1372 |           }
 1373 |         },
 1374 |       }
 1375 | 
 1376 |       drawFrame()
 1377 |       recorder.start(1000)
 1378 |       recorderRef.current = recorder
 1379 |       setRecordingState('recording')
 1380 |     } catch (err) {
 1381 |       setRecordingState('failed')
 1382 |       setToast({ tone: 'error', message: err?.message || 'Recording could not be started.' })
 1383 |     }
 1384 |   }, [callId, recordingState])
 1385 | 
 1386 |   const stopRecordingAndUpload = useCallback(async () => {
 1387 |     const token = getToken()
 1388 |     if (!token || !callId) return
 1389 |     const recorder = recorderRef.current
 1390 |     if (!recorder || recorder.state === 'inactive') return
 1391 | 
 1392 |     setRecordingState('uploading')
 1393 | 
 1394 |     const stopped = new Promise((resolve) => {
 1395 |       recorder.onstop = () => resolve(true)
 1396 |     })
 1397 | 
 1398 |     try {
 1399 |       recorder.stop()
 1400 |     } catch {
 1401 |       // ignore
 1402 |     }
 1403 | 
 1404 |     await stopped
 1405 | 
 1406 |     try {
 1407 |       recordingCleanupRef.current?.stop?.()
 1408 |     } catch {
 1409 |       // ignore
 1410 |     }
 1411 | 
 1412 |     const chunks = recordingChunksRef.current || []
 1413 |     const mimeType = recorder.mimeType || 'video/webm'
 1414 |     const blob = new Blob(chunks, { type: mimeType })
 1415 | 
 1416 |     // Reset refs before upload so UI is not stuck if upload fails.
 1417 |     recorderRef.current = null
 1418 |     recordingChunksRef.current = []
 1419 | 
 1420 |     try {
 1421 |       const form = new FormData()
 1422 |       form.append('file', blob, `call-${callId}.webm`)
 1423 | 
 1424 |       const res = await fetch(`${API_BASE}/calls/${encodeURIComponent(callId)}/recording/upload`, {
 1425 |         method: 'POST',
 1426 |         headers: {
 1427 |           Authorization: `Bearer ${token}`,
 1428 |         },
 1429 |         body: form,
 1430 |       })
 1431 | 
 1432 |       const data = await res.json().catch(() => ({}))
 1433 |       if (!res.ok) throw new Error(data.error || 'Recording upload failed')
 1434 | 
 1435 |       setRecordingState('available')
 1436 |       setToast({ tone: 'success', message: 'Call recording saved securely.' })
 1437 |     } catch (err) {
 1438 |       setRecordingState('failed')
 1439 |       setToast({ tone: 'error', message: err?.message || 'Recording upload failed.' })
 1440 |     }
 1441 |   }, [callId])
 1442 | 
 1443 |   useEffect(() => {
 1444 |     // Auto-start call recording when the call is connected (mandatory call recording requirement).
 1445 |     if (recordingState !== 'idle') return
 1446 |     if (rtcConnectionState !== 'connected') return
 1447 |     if (!hasLocalStream || !hasRemoteStream) return
 1448 |     startCallRecording()
 1449 |   }, [hasLocalStream, hasRemoteStream, recordingState, rtcConnectionState, startCallRecording])
 1450 | 
 1451 |   const endCall = async () => {
 1452 |     const token = getToken()
 1453 |     if (token && callId) {
 1454 |       try {
 1455 |         await apiRequest(`/calls/${callId}/end`, { method: 'POST', token })
 1456 |         if (effectiveMatchId) {
 1457 |           const journey = await apiRequest(`/workflow/journeys/by-match/${encodeURIComponent(effectiveMatchId)}`, { token })
 1458 |           if (journey?.id) {
 1459 |             await apiRequest(`/workflow/journeys/${encodeURIComponent(journey.id)}/transition`, {
 1460 |               method: 'POST',
 1461 |               token,
 1462 |               body: { to_state: 'negotiating', event_type: 'call_ended' },
 1463 |             })
 1464 |           }
 1465 |         }
 1466 |       } catch {
 1467 |         // ignore
 1468 |       }
 1469 |     }
 1470 | 
 1471 |     if (callId) {
 1472 |       trackClientEvent('call_end', {
 1473 |         entityType: 'call_session',
 1474 |         entityId: callId,
 1475 |         metadata: { match_id: effectiveMatchId || '' },
 1476 |       })
 1477 |     }
 1478 | 
 1479 |     // Stop recording and upload before leaving the call room.
 1480 |     try {
 1481 |       await stopRecordingAndUpload()
 1482 |     } catch {
 1483 |       // ignore
 1484 |     }
 1485 |     navigate('/chat')
 1486 |   }
 1487 | 
 1488 |   const sendChatMessage = async () => {
 1489 |     setIsEmojiOpen(false)
 1490 |     const token = getToken()
 1491 |     const content = chatDraft.trim()
 1492 |     const threadId = effectiveMatchId || matchId
 1493 |     if (!token || !content || !threadId) return
 1494 |     try {
 1495 |       if (isChatLive && wsRef.current && wsRef.current.readyState === WebSocket.OPEN && chatRoomMatchIdRef.current === threadId) {
 1496 |         wsRef.current.send(JSON.stringify({
 1497 |           type: 'chat_message',
 1498 |           match_id: threadId,
 1499 |           token,
 1500 |           message: content,
 1501 |           message_type: 'text',
 1502 |         }))
 1503 |       } else {
 1504 |         const created = await apiRequest(`/messages/${threadId}`, {
 1505 |           method: 'POST',
 1506 |           token,
 1507 |           body: { message: content, type: 'text' },
 1508 |         })
 1509 |         setChatMessages((prev) => [...prev, created])
 1510 |       }
 1511 |       setChatDraft('')
 1512 |     } catch (err) {
 1513 |       setStatusMessage(err?.message || 'Unable to send message')
 1514 |     }
 1515 |   }
 1516 | 
 1517 |   return (
 1518 |     <div className="relative isolate flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-900 dark:from-[#050816] dark:via-slate-950/10 dark:to-[#120726] dark:text-slate-100">
 1519 |       <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
 1520 |         <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-[callFloat_14s_ease-in-out_infinite] dark:bg-cyan-400/10" />
 1521 |         <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10" style={{ animationDelay: '-6s' }} />
 1522 |         <div className="absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10" style={{ animationDelay: '-12s' }} />
 1523 |       </div>
 1524 |       {toast ? (
 1525 |         <div className="pointer-events-none fixed left-1/2 top-[76px] z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 px-2">
 1526 |           <div className={`rounded-2xl px-4 py-2 text-center text-sm font-semibold shadow-lg ring-1 backdrop-blur-xl${toast.tone === 'error' ? 'bg-rose-500/15 text-rose-100 ring-rose-500/25' : toast.tone === 'success' ? 'bg-emerald-500/15 text-emerald-50 ring-emerald-500/25' : 'bg-slate-950/75 text-white ring-white/10'}`}>
 1527 |             {toast.message}
 1528 |           </div>
 1529 |         </div>
 1530 |       ) : null}
 1531 |       {/* Top Header */}
 1532 |       <header className="flex h-16 items-center justify-between gap-4 borderless-divider-b bg-white/70 px-4 shadow-sm backdrop-blur-xl dark:bg-slate-950/40 sm:px-6">
 1533 |         <div className="flex min-w-0 items-center gap-3 sm:gap-4">
 1534 |           <button
 1535 |             type="button"
 1536 |             onClick={() => navigate(-1)}
 1537 |             className="group flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-600 shadow-sm ring-1 ring-slate-200/60 transition hover:bg-white hover:text-slate-900 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
 1538 |             title="Back"
 1539 |           >
 1540 |             <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
 1541 |           </button>
 1542 |           <div className="min-w-0">
 1543 |             <div className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base">
 1544 |               Call with <span className="text-slate-600 dark:text-slate-300">“{remoteName}”</span>
 1545 |             </div>
 1546 |             <div className="hidden truncate text-xs text-slate-500 dark:text-slate-300/80 sm:block">
 1547 |               {statusMessage || 'Preparing call...'}
 1548 |             </div>
 1549 |           </div>
 1550 |         </div>
 1551 | 
 1552 |         <div className="flex flex-none items-center gap-2">
 1553 |           <span className={`hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 sm:inline-flex${connectionBadge.pillClass}`}>
 1554 |             <span className={`h-2 w-2 rounded-full${connectionBadge.dotClass}`} />
 1555 |             {connectionBadge.label}
 1556 |           </span>
 1557 |           {recordingState !== 'idle' ? (
 1558 |             <span className="hidden items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 sm:inline-flex">
 1559 |               <span className={`h-2 w-2 rounded-full${recordingState === 'recording' ? 'bg-rose-500 animate-pulse' : recordingState === 'available' ? 'bg-emerald-500' : recordingState === 'uploading' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
 1560 |               {recordingState === 'recording'
 1561 |                 ? 'REC'
 1562 |                 : recordingState === 'uploading'
 1563 |                   ? 'Uploading'
 1564 |                   : recordingState === 'available'
 1565 |                     ? 'Saved'
 1566 |                     : 'Failed'}
 1567 |             </span>
 1568 |           ) : null}
 1569 |           <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold tabular-nums text-slate-700 ring-1 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
 1570 |             {timer}
 1571 |           </span>
 1572 |         </div>
 1573 |       </header>
 1574 | 
 1575 |       {/* Main Layout Content */}
 1576 |       <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6 lg:flex-row">
 1577 |         
 1578 |         {/* Left Side: Video Feed Area */}
 1579 |         <div className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10">
 1580 |           
 1581 |           <div ref={stageRef} className="relative flex-1 overflow-hidden rounded-[24px] bg-slate-950">
 1582 |             {/* Remote Participant Label */}
 1583 |             <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/10">
 1584 |               <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold">
 1585 |                 {(remoteName || 'U').slice(0, 1).toUpperCase()}
 1586 |               </div>
 1587 |               <div className="max-w-[220px] truncate">{remoteName}</div>
 1588 |             </div>
 1589 | 
 1590 |             {/* Remote Video (Main) */}
 1591 |             <video
 1592 |               ref={remoteVideoRef}
 1593 |               autoPlay
 1594 |               playsInline
 1595 |               muted={isSpeakerMuted}
 1596 |               className="absolute inset-0 h-full w-full object-cover"
 1597 |             />
 1598 |             <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
 1599 |             {!hasRemoteStream && (
 1600 |               <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-white/80">
 1601 |                 <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold ring-1 ring-white/10">
 1602 |                   {(remoteName || 'U').slice(0, 1).toUpperCase()}
 1603 |                 </div>
 1604 |                 <div className="text-base font-semibold">{remoteName}</div>
 1605 |                 <div className="max-w-xs text-center text-xs text-white/60">
 1606 |                   {statusMessage || 'Waiting to connect...'}
 1607 |                 </div>
 1608 |               </div>
 1609 |             )}
 1610 | 
 1611 |             {mediaGate && !hasLocalStream && (
 1612 |               <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
 1613 |                 <div className="w-full max-w-md rounded-2xl borderless-shadow bg-white/10 p-6 text-center text-white backdrop-blur-md">
 1614 |                   <div className="text-lg font-semibold">{mediaGate.title}</div>
 1615 |                   <div className="mt-2 text-sm text-white/80">{mediaGate.message}</div>
 1616 |                   <div className="mt-5 flex items-center justify-center gap-3">
 1617 |                     {mediaGate.actionLabel ? (
 1618 |                       <button
 1619 |                         type="button"
 1620 |                         onClick={() => ensureLocalStream().catch(() => {})}
 1621 |                         disabled={isRequestingMedia}
 1622 |                         className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
 1623 |                       >
 1624 |                         {isRequestingMedia ? 'Requesting...' : mediaGate.actionLabel}
 1625 |                       </button>
 1626 |                     ) : null}
 1627 |                     <button
 1628 |                       type="button"
 1629 |                       onClick={() => setMediaGate(null)}
 1630 |                       className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
 1631 |                     >
 1632 |                       Dismiss
 1633 |                     </button>
 1634 |                   </div>
 1635 |                 </div>
 1636 |               </div>
 1637 |             )}
 1638 | 
 1639 |             {/* Local Video (PiP) */}
 1640 |             <div
 1641 |               className={`absolute right-5 top-5 z-30 aspect-video w-40 overflow-hidden rounded-2xl bg-black/80 ring-1${isSpeaking ? 'ring-cyan-300/70' : 'ring-white/20'}shadow-2xl shadow-black/40 sm:w-56`}
 1642 |               style={isSpeaking ? { boxShadow: '0 22px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,211,238,0.35), 0 0 34px rgba(34,211,238,0.25)' } : undefined}
 1643 |             >
 1644 |               <video 
 1645 |                 ref={localVideoRef} 
 1646 |                 autoPlay 
 1647 |                 playsInline 
 1648 |                 muted 
 1649 |                 className="h-full w-full object-cover"
 1650 |               />
 1651 |               <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
 1652 |                 {localName}
 1653 |               </div>
 1654 |             </div>
 1655 | 
 1656 |             {/* Floating Call Controls */}
 1657 |             <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-black/35 p-2 backdrop-blur-xl ring-1 ring-white/10 shadow-lg">
 1658 |               <button
 1659 |                 type="button"
 1660 |                 onClick={() => setIsChatOpen((prev) => !prev)}
 1661 |                 className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isChatOpen ? 'bg-sky-500/90 hover:bg-sky-500' : 'bg-white/10 hover:bg-white/15'}`}
 1662 |                 title={isChatOpen ? 'Hide chat' : 'Show chat'}
 1663 |               >
 1664 |                 <MessageSquare size={20} />
 1665 |                 {unreadChatCount > 0 ? (
 1666 |                   <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-black/40">
 1667 |                     {unreadChatCount > 99 ? '99+' : unreadChatCount}
 1668 |                   </span>
 1669 |                 ) : null}
 1670 |               </button>
 1671 |               <button
 1672 |                 type="button"
 1673 |                 onClick={toggleSpeaker}
 1674 |                 className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isSpeakerMuted ? 'bg-amber-500/90 hover:bg-amber-500' : 'bg-white/10 hover:bg-white/15'}`}
 1675 |                 title={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
 1676 |               >
 1677 |                 {isSpeakerMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
 1678 |               </button>
 1679 |               <button 
 1680 |                 type="button"
 1681 |                 onClick={toggleMute}
 1682 |                 className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isMuted ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white/10 hover:bg-white/15'}`}
 1683 |                 title={isMuted ? 'Unmute mic' : 'Mute mic'}
 1684 |                 aria-pressed={!isMuted}
 1685 |                 style={!isMuted && micLevel > 0.02 ? { boxShadow: `0 0 ${10 + micLevel * 26}px rgba(34,211,238,${0.18 + micLevel * 0.35})` } : undefined}
 1686 |               >
 1687 |                 {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
 1688 |               </button>
 1689 |               <button 
 1690 |                 type="button"
 1691 |                 onClick={endCall}
 1692 |                 className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white transition-all hover:bg-rose-600 active:scale-95"
 1693 |                 title="End call"
 1694 |               >
 1695 |                 <PhoneOff size={20} />
 1696 |               </button>
 1697 |               <button 
 1698 |                 type="button"
 1699 |                 onClick={toggleCamera}
 1700 |                 className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${!isCameraOn ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white/10 hover:bg-white/15'}`}
 1701 |                 title={!isCameraOn ? 'Turn camera on' : 'Turn camera off'}
 1702 |               >
 1703 |                 {!isCameraOn ? <VideoOff size={20} /> : <Video size={20} />}
 1704 |               </button>
 1705 |               <button
 1706 |                 type="button"
 1707 |                 onClick={toggleFullscreen}
 1708 |                 className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isFullscreen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
 1709 |                 title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
 1710 |               >
 1711 |                 <Maximize size={20} />
 1712 |               </button>
 1713 |             </div>
 1714 |           </div>
 1715 | 
 1716 |           {/* Transcription Bar */}
 1717 |           <div className="flex items-center gap-3 borderless-divider-t bg-white/70 px-4 py-3 backdrop-blur-xl dark:bg-white/5 sm:px-6">
 1718 |             <div className="flex items-end gap-1.5 text-sky-600 dark:text-cyan-300" aria-hidden="true">
 1719 |               {[0.28, 0.44, 0.72, 0.44, 0.28].map((base, index) => (
 1720 |                 <span
 1721 |                   key={index}
 1722 |                   className="h-5 w-1.5 rounded-full bg-current transition-transform duration-150 will-change-transform"
 1723 |                   style={{ transformOrigin: 'bottom', transform: `scaleY(${Math.max(0.18, base + micLevel * 0.9)})` }}
 1724 |                 />
 1725 |               ))}
 1726 |             </div>
 1727 |             <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
 1728 |               {statusMessage || callDetails?.context?.notes || 'Live call in progress.'}
 1729 |             </p>
 1730 |           </div>
 1731 |         </div>
 1732 | 
 1733 |         {/* Right Side: Chat Sidebar */}
 1734 |         {isChatOpen ? (
 1735 |           <aside className="flex w-full flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10 lg:w-[380px]">
 1736 |             <div className="flex h-14 items-center justify-between gap-3 borderless-divider-b bg-white/40 px-5 backdrop-blur-xl dark:bg-white/5">
 1737 |               <div className="min-w-0">
 1738 |                 <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80">Chat</h2>
 1739 |                 <p className="truncate text-[11px] text-slate-500 dark:text-slate-300/70">{remoteName}</p>
 1740 |               </div>
 1741 |               <div ref={morePopoverRef} className="relative flex items-center gap-2">
 1742 |                 <span className={`hidden items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 sm:inline-flex${isChatLive ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-200' : 'bg-slate-500/10 text-slate-600 ring-slate-400/20 dark:text-slate-300'}`}>
 1743 |                   <span className={`h-2 w-2 rounded-full${isChatLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
 1744 |                   {isChatLive ? 'Live' : 'Syncing'}
 1745 |                 </span>
 1746 |                 <button
 1747 |                   type="button"
 1748 |                   onClick={() => {
 1749 |                     setIsMoreOpen((prev) => !prev)
 1750 |                     setIsEmojiOpen(false)
 1751 |                   }}
 1752 |                   className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
 1753 |                   title="More"
 1754 |                 >
 1755 |                   <MoreHorizontal size={20} />
 1756 |                 </button>
 1757 | 
 1758 |                 {isMoreOpen ? (
 1759 |                   <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl bg-white/90 p-2 shadow-xl ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-slate-950/60 dark:ring-white/10">
 1760 |                     <button
 1761 |                       type="button"
 1762 |                       onClick={() => {
 1763 |                         copyCallLink()
 1764 |                         setIsMoreOpen(false)
 1765 |                       }}
 1766 |                       className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
 1767 |                     >
 1768 |                       <Copy size={16} className="opacity-80" />
 1769 |                       Copy call link
 1770 |                     </button>
 1771 |                     <button
 1772 |                       type="button"
 1773 |                       onClick={() => {
 1774 |                         requestMediaPermissions()
 1775 |                         setIsMoreOpen(false)
 1776 |                       }}
 1777 |                       className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
 1778 |                     >
 1779 |                       <ShieldAlert size={16} className="opacity-80" />
 1780 |                       Request permissions
 1781 |                     </button>
 1782 |                     <button
 1783 |                       type="button"
 1784 |                       onClick={() => {
 1785 |                         reconnectCall()
 1786 |                         pushToast('Reconnecting call...', 'info')
 1787 |                         setIsMoreOpen(false)
 1788 |                       }}
 1789 |                       className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
 1790 |                     >
 1791 |                       <RefreshCw size={16} className="opacity-80" />
 1792 |                       Reconnect
 1793 |                     </button>
 1794 |                     <button
 1795 |                       type="button"
 1796 |                       onClick={() => {
 1797 |                         setIsChatOpen(false)
 1798 |                         setIsMoreOpen(false)
 1799 |                       }}
 1800 |                       className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
 1801 |                     >
 1802 |                       <MessageSquare size={16} className="opacity-80" />
 1803 |                       Hide chat
 1804 |                     </button>
 1805 |                   </div>
 1806 |                 ) : null}
 1807 |               </div>
 1808 |             </div>
 1809 |             <div className="borderless-divider-b bg-white/30 p-3 dark:bg-white/5">
 1810 |               <JourneyTimeline title="Journey Timeline" matchId={effectiveMatchId || ''} />
 1811 |             </div>
 1812 | 
 1813 |           <div ref={chatScrollRef} className="flex-1 overflow-y-auto bg-slate-50/60 p-5 space-y-6 dark:bg-black/20 scrollbar-hide">
 1814 |             {sortedChatMessages.length > 0 ? sortedChatMessages.map((msg) => {
 1815 |               const isOwn = msg.sender_id === user?.id
 1816 |               const sender = userMap.get(msg.sender_id)
 1817 |               const senderName = msg.sender_name || sender?.name || sender?.email || 'User'
 1818 |               return (
 1819 |                 <div key={msg.id} className={`flex flex-col${isOwn ? 'items-end' : 'items-start'}`}>
 1820 |                   <div className="flex items-center gap-2 mb-1">
 1821 |                     {!isOwn && (
 1822 |                       <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
 1823 |                         {senderName[0] || 'U'}
 1824 |                       </div>
 1825 |                     )}
 1826 |                     <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{senderName}</span>
 1827 |                     <span className="text-[10px] text-slate-400 dark:text-slate-400/80">{formatMessageTime(msg.timestamp)}</span>
 1828 |                   </div>
 1829 |                   <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm${
 1830 |                     isOwn
 1831 |                       ? 'bg-blue-600 text-white rounded-tr-none'
 1832 |                       : 'bg-white/80 text-slate-800 ring-1 ring-slate-200/60 rounded-tl-none dark:bg-white/5 dark:text-slate-100 dark:ring-white/10'
 1833 |                   }`}>
 1834 |                     <MarkdownMessage text={msg.message || ''} />
 1835 |                   </div>
 1836 |                 </div>
 1837 |               )
 1838 |             }) : (
 1839 |               <div className="text-sm text-slate-400">No messages yet.</div>
 1840 |             )}
 1841 |             <div ref={chatEndRef} />
 1842 |           </div>
 1843 | 
 1844 |             <div className="borderless-divider-t p-4">
 1845 |               <div className="relative flex items-center gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-slate-200/60 focus-within:ring-sky-500/30 dark:bg-white/5 dark:ring-white/10">
 1846 |                 <div ref={emojiPopoverRef} className="relative ml-1">
 1847 |                   <button
 1848 |                     type="button"
 1849 |                     onClick={() => {
 1850 |                       setIsEmojiOpen((prev) => !prev)
 1851 |                       setIsMoreOpen(false)
 1852 |                     }}
 1853 |                     className={`flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200${isEmojiOpen ? 'bg-slate-100 dark:bg-white/10' : ''}`}
 1854 |                     title="Emoji"
 1855 |                   >
 1856 |                     <Smile size={20} />
 1857 |                   </button>
 1858 | 
 1859 |                   {isEmojiOpen ? (
 1860 |                     <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-2xl bg-white/90 p-3 shadow-xl ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-slate-950/60 dark:ring-white/10">
 1861 |                       <div className="grid grid-cols-8 gap-1">
 1862 |                         {QUICK_EMOJIS.map((emoji) => (
 1863 |                           <button
 1864 |                             key={emoji}
 1865 |                             type="button"
 1866 |                             onClick={() => {
 1867 |                               setChatDraft((prev) => `${prev}${emoji}`)
 1868 |                               setIsEmojiOpen(false)
 1869 |                               chatInputRef.current?.focus?.()
 1870 |                             }}
 1871 |                             className="flex h-8 w-8 items-center justify-center rounded-xl text-lg transition hover:bg-slate-100 dark:hover:bg-white/10"
 1872 |                             title={`Insert ${emoji}`}
 1873 |                           >
 1874 |                             {emoji}
 1875 |                           </button>
 1876 |                         ))}
 1877 |                       </div>
 1878 |                       <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-300/70">Press Esc to close.</div>
 1879 |                     </div>
 1880 |                   ) : null}
 1881 |                 </div>
 1882 |                 <input 
 1883 |                   ref={chatInputRef}
 1884 |                   type="text" 
 1885 |                   placeholder="Type here..."
 1886 |                   className="flex-1 bg-transparent px-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-400/70"
 1887 |                   value={chatDraft}
 1888 |                   onChange={(e) => setChatDraft(e.target.value)}
 1889 |                   onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage() }}
 1890 |                   onFocus={() => setIsEmojiOpen(false)}
 1891 |                 />
 1892 |                 <button
 1893 |                   type="button"
 1894 |                   onClick={sendChatMessage}
 1895 |                   className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 active:scale-95"
 1896 |                   title="Send"
 1897 |                 >
 1898 |                   <Send size={16} />
 1899 |                 </button>
 1900 |               </div>
 1901 |             </div>
 1902 |           </aside>
 1903 |         ) : null}
 1904 | 
 1905 |       </div>
 1906 |     </div>
 1907 |   )
 1908 | }
 1909 | 