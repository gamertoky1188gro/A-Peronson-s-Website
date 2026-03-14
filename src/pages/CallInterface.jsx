import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ChevronLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  Maximize,
  Send,
  Smile,
  MoreHorizontal,
  Search
} from 'lucide-react'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

const WS_BASE = (() => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ws`
})()

export default function CallInterface() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [statusMessage, setStatusMessage] = useState('')
  const [callDetails, setCallDetails] = useState(null)
  const [participants, setParticipants] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [timer, setTimer] = useState('00:00:00')
  const [chatDraft, setChatDraft] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [hasRemoteStream, setHasRemoteStream] = useState(false)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const wsRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const localStreamPromiseRef = useRef(null)
  const pendingCandidatesRef = useRef([])
  const mountedRef = useRef(true)
  const redirectedRef = useRef(false)

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

  const formatMessageTime = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const ensureLocalStream = useCallback(async () => {
    if (localStreamRef.current) return localStreamRef.current
    if (localStreamPromiseRef.current) return localStreamPromiseRef.current

    localStreamPromiseRef.current = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream
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
        setStatusMessage('Camera/microphone permission not granted.')
        throw err
      })

    return localStreamPromiseRef.current
  }, [])

  const createPeerConnection = useCallback((token) => {
    if (peerConnectionRef.current) return peerConnectionRef.current
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })

    pc.onicecandidate = (event) => {
      if (!event.candidate) return
      if (wsRef.current?.readyState !== WebSocket.OPEN) return
      wsRef.current.send(JSON.stringify({
        type: 'webrtc_signal',
        call_id: callId,
        token,
        signal: { type: 'candidate', candidate: event.candidate },
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
      if (pc.connectionState === 'connected') {
        setStatusMessage('Call connected.')
      } else if (pc.connectionState === 'failed') {
        setStatusMessage('Call connection failed.')
      }
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current)
      })
    }

    peerConnectionRef.current = pc
    return pc
  }, [callId])

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

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => { loadCallDetails() }, [loadCallDetails])
  useEffect(() => { startCallIfNeeded() }, [startCallIfNeeded])
  useEffect(() => { loadParticipants() }, [loadParticipants])
  useEffect(() => { loadChatMessages() }, [loadChatMessages])

  useEffect(() => {
    ensureLocalStream().catch(() => {})
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [ensureLocalStream])

  useEffect(() => {
    const token = getToken()
    if (!token || !callId) return

    let active = true
    const safeSetStatus = (message) => {
      if (!active || !mountedRef.current) return
      setStatusMessage(message)
    }
    const safeSetRemoteStream = (value) => {
      if (!active || !mountedRef.current) return
      setHasRemoteStream(value)
    }

    const ws = new WebSocket(WS_BASE)
    wsRef.current = ws
    safeSetStatus('Connecting to call server...')

    const sendSignal = (payload) => {
      if (ws.readyState !== WebSocket.OPEN) return
      ws.send(JSON.stringify(payload))
    }

    ws.onopen = () => {
      safeSetStatus('Joining call...')
      sendSignal({
        type: 'join_call_room',
        call_id: callId,
        token,
        participant_id: participantId,
      })
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
        createPeerConnection(token)
        if (payload.should_offer) {
          await ensureLocalStream().catch(() => null)
          const pc = createPeerConnection(token)
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          sendSignal({
            type: 'webrtc_signal',
            call_id: callId,
            token,
            signal: { type: 'offer', sdp: pc.localDescription },
          })
        }
        return
      }

      if (payload.type === 'participant_joined') {
        safeSetStatus('Participant joined. Connecting...')
        createPeerConnection(token)
        return
      }

      if (payload.type === 'webrtc_signal' && payload.signal) {
        const pc = createPeerConnection(token)
        const signal = payload.signal
        if (signal.type === 'offer') {
          await ensureLocalStream().catch(() => null)
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          sendSignal({
            type: 'webrtc_signal',
            call_id: callId,
            token,
            signal: { type: 'answer', sdp: pc.localDescription },
          })

          const pending = pendingCandidatesRef.current
          pendingCandidatesRef.current = []
          for (const queued of pending) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(queued))
            } catch {
              // ignore candidate errors
            }
          }
        } else if (signal.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))

          const pending = pendingCandidatesRef.current
          pendingCandidatesRef.current = []
          for (const queued of pending) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(queued))
            } catch {
              // ignore candidate errors
            }
          }
        } else if (signal.type === 'candidate') {
          try {
            const candidate = signal.candidate
            if (pc.remoteDescription && pc.remoteDescription.type) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate))
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
      safeSetStatus('Unable to reach call server.')
    }

    ws.onclose = () => {
      safeSetStatus('Call server disconnected.')
      safeSetRemoteStream(false)
      remoteStreamRef.current = null
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
    }

    return () => {
      active = false
      ws.close()
    }
  }, [callId, participantId, createPeerConnection, ensureLocalStream])

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

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => { track.enabled = !next })
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

  const endCall = async () => {
    const token = getToken()
    if (token && callId) {
      try {
        await apiRequest(`/calls/${callId}/end`, { method: 'POST', token })
      } catch {
        // ignore
      }
    }
    navigate('/chat')
  }

  const sendChatMessage = async () => {
    const token = getToken()
    const content = chatDraft.trim()
    if (!token || !content || !effectiveMatchId) return
    try {
      const created = await apiRequest(`/messages/${effectiveMatchId}`, {
        method: 'POST',
        token,
        body: { message: content, type: 'text' },
      })
      setChatMessages((prev) => [...prev, created])
      setChatDraft('')
    } catch (err) {
      setStatusMessage(err.message || 'Unable to send message')
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-[#f8f9fa] font-sans text-slate-900 overflow-hidden">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-slate-500 hover:bg-slate-50"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-base font-semibold">Call with "{remoteName}"</h1>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-sm font-bold tabular-nums">{timer}</span>
        </div>
      </header>

      {/* Main Layout Content */}
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        
        {/* Left Side: Video Feed Area */}
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-lg border border-slate-100">
          
          <div className="relative flex-1 bg-[#2d2d2d] overflow-hidden">
            {/* Remote Participant Label */}
            <div className="absolute left-6 top-6 z-20 text-white font-medium drop-shadow-md">
              {remoteName}
            </div>

            {/* Remote Video (Main) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            {!hasRemoteStream && (
              <div className="absolute inset-0 flex items-center justify-center text-white/70 text-lg">
                {remoteName}
              </div>
            )}

            {/* Local Video (PiP) */}
            <div className="absolute right-6 top-6 z-30 h-40 w-64 overflow-hidden rounded-2xl border-2 border-white shadow-2xl bg-black">
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/40 px-1.5 py-0.5 rounded">
                {localName}
              </div>
            </div>

            {/* Floating Call Controls */}
            <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-white/10 p-2 backdrop-blur-md">
              <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors">
                <Volume2 size={20} />
              </button>
              <button 
                onClick={toggleMute}
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button 
                onClick={endCall}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <PhoneOff size={20} />
              </button>
              <button 
                onClick={toggleCamera}
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${!isCameraOn ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                {!isCameraOn ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors">
                <Maximize size={20} />
              </button>
            </div>

            {/* Volume Slider Mock */}
            <div className="absolute bottom-32 left-1/2 z-40 -translate-x-1/2 flex flex-col items-center gap-2 group">
               <div className="h-24 w-1 bg-white/20 rounded-full relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-500" />
                  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 h-3 w-3 bg-blue-500 border-2 border-white rounded-full" />
               </div>
            </div>
          </div>

          {/* Transcription Bar */}
          <div className="flex items-center gap-4 border-t bg-white px-6 py-4">
            <div className="flex items-center gap-1.5 text-blue-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="10" width="2" height="4" rx="1" fill="currentColor" />
                <rect x="7" y="7" width="2" height="10" rx="1" fill="currentColor" />
                <rect x="11" y="4" width="2" height="16" rx="1" fill="currentColor" />
                <rect x="15" y="7" width="2" height="10" rx="1" fill="currentColor" />
                <rect x="19" y="10" width="2" height="4" rx="1" fill="currentColor" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">
              {statusMessage || callDetails?.context?.notes || 'Live call in progress.'}
            </p>
          </div>
        </div>

        {/* Right Side: Chat Sidebar */}
        <aside className="flex w-96 flex-col overflow-hidden rounded-3xl bg-white shadow-lg border border-slate-100">
          <div className="flex h-14 items-center justify-between border-b px-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Chat</h2>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
            {sortedChatMessages.length > 0 ? sortedChatMessages.map((msg) => {
              const isOwn = msg.sender_id === user?.id
              const sender = userMap.get(msg.sender_id)
              const senderName = sender?.name || sender?.email || 'User'
              return (
                <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!isOwn && (
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
                        {senderName[0] || 'U'}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-700">{senderName}</span>
                    <span className="text-[10px] text-slate-400">{formatMessageTime(msg.timestamp)}</span>
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isOwn
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-white border text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.message || ''}
                  </div>
                </div>
              )
            }) : (
              <div className="text-sm text-slate-400">No messages yet.</div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="relative flex items-center gap-2 rounded-xl bg-slate-50 p-2 border border-slate-100">
              <button className="text-slate-400 hover:text-slate-600 ml-1">
                <Smile size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Type here..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage() }}
              />
              <button onClick={sendChatMessage} className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

