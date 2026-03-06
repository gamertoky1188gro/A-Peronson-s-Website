import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

const POLL_INTERVAL_MS = 4000
const TERMINAL_RECORDING_STATUSES = new Set(['available', 'failed'])
const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:4000'

function StatBadge({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  )
}

export default function CallInterface() {
  const [searchParams] = useSearchParams()
  const [callId, setCallId] = useState(searchParams.get('callId') || '')
  const [statusMessage, setStatusMessage] = useState('')
  const [callDetails, setCallDetails] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [peerState, setPeerState] = useState('Connecting')

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const wsRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)

  const matchId = useMemo(() => searchParams.get('matchId') || '', [searchParams])
  const user = useMemo(() => getCurrentUser(), [])
  const participantId = user?.id || `guest-${Date.now()}`

  const ensureCallSession = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setStatusMessage('Please sign in to access call sessions.')
      return
    }

    if (callId) return
    if (!matchId) {
      setStatusMessage('Missing callId or matchId in the URL. Open from chat or provide a matchId.')
      return
    }

    try {
      const result = await apiRequest('/calls/join', {
        method: 'POST',
        token,
        body: {
          match_id: matchId,
          title: 'Supplier Intro Meeting',
          chat_thread_id: matchId,
        },
      })
      if (result?.call?.id) {
        setCallId(result.call.id)
        setCallDetails(result.call)
        setStatusMessage(result.created ? 'New call session created.' : 'Joined existing call session.')
      }
    } catch (err) {
      setStatusMessage(err.message || 'Unable to open call session.')
    }
  }, [callId, matchId])

  const refreshCallDetails = useCallback(async ({ silent = false } = {}) => {
    const token = getToken()
    if (!token || !callId) return null

    if (!silent) setIsRefreshing(true)

    try {
      const call = await apiRequest(`/calls/${callId}`, { token })
      setCallDetails(call)
      return call
    } catch {
      if (!silent) setStatusMessage('Unable to load call details.')
      return null
    } finally {
      if (!silent) setIsRefreshing(false)
    }
  }, [callId])

  const setupPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return peerConnectionRef.current

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })

    pc.onicecandidate = (event) => {
      if (!event.candidate || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
      wsRef.current.send(JSON.stringify({
        type: 'webrtc_signal',
        signal: { type: 'ice', candidate: event.candidate },
      }))
    }

    pc.ontrack = (event) => {
      if (!remoteStreamRef.current) remoteStreamRef.current = new MediaStream()
      event.streams[0].getTracks().forEach((track) => remoteStreamRef.current.addTrack(track))
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStreamRef.current
      setPeerState('Connected')
    }

    const stream = localStreamRef.current
    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))
    }

    peerConnectionRef.current = pc
    return pc
  }, [])

  const startLocalMedia = useCallback(async () => {
    if (localStreamRef.current) return localStreamRef.current
    const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    localStreamRef.current = media
    if (localVideoRef.current) localVideoRef.current.srcObject = media
    return media
  }, [])

  const createOfferAndSend = useCallback(async () => {
    const pc = setupPeerConnection()
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'webrtc_signal', signal: { type: 'offer', sdp: offer.sdp } }))
    }
  }, [setupPeerConnection])

  useEffect(() => {
    ensureCallSession()
  }, [ensureCallSession])

  useEffect(() => {
    if (callId) refreshCallDetails()
  }, [callId, refreshCallDetails])

  useEffect(() => {
    if (!callDetails || callDetails.status !== 'ended') return undefined
    if (TERMINAL_RECORDING_STATUSES.has(callDetails.recording_status)) return undefined

    const timer = window.setInterval(async () => {
      const latest = await refreshCallDetails({ silent: true })
      if (!latest || latest.status !== 'ended') return
      if (TERMINAL_RECORDING_STATUSES.has(latest.recording_status)) {
        window.clearInterval(timer)
        setStatusMessage(
          latest.recording_status === 'available'
            ? 'Recording is now available and call is completed.'
            : 'Recording processing failed and the call has been finalized with a failure reason.',
        )
      }
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [callDetails, refreshCallDetails])

  useEffect(() => {
    if (!callId) return undefined
    let active = true

    const initializeWs = async () => {
      try {
        await startLocalMedia()
      } catch {
        setStatusMessage('Unable to access camera/microphone.')
      }

      const ws = new WebSocket(WS_BASE)
      wsRef.current = ws

      ws.onopen = () => {
        if (!active) return
        setPeerState('Joining room...')
        ws.send(JSON.stringify({
          type: 'join_call_room',
          call_id: callId,
          participant_id: participantId,
        }))
      }

      ws.onmessage = async (evt) => {
        if (!active) return
        const payload = JSON.parse(String(evt.data || '{}'))

        if (payload.type === 'joined_call_room') {
          setPeerState(payload.should_offer ? 'Connecting to participant...' : 'Waiting for participant...')
          setupPeerConnection()
          if (payload.should_offer) {
            await createOfferAndSend()
          }
          return
        }

        if (payload.type === 'participant_joined') {
          setPeerState('Participant joined')
          return
        }

        if (payload.type === 'participant_left') {
          setPeerState('Participant left')
          return
        }

        if (payload.type === 'webrtc_signal') {
          const pc = setupPeerConnection()
          const signal = payload.signal || {}

          if (signal.type === 'offer' && signal.sdp) {
            await pc.setRemoteDescription({ type: 'offer', sdp: signal.sdp })
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            ws.send(JSON.stringify({ type: 'webrtc_signal', signal: { type: 'answer', sdp: answer.sdp } }))
            return
          }

          if (signal.type === 'answer' && signal.sdp) {
            await pc.setRemoteDescription({ type: 'answer', sdp: signal.sdp })
            return
          }

          if (signal.type === 'ice' && signal.candidate) {
            await pc.addIceCandidate(signal.candidate)
          }
        }
      }

      ws.onerror = () => {
        if (active) setPeerState('WebSocket error')
      }

      ws.onclose = () => {
        if (active) setPeerState('Disconnected')
      }
    }

    initializeWs()

    return () => {
      active = false
      if (wsRef.current) wsRef.current.close()
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
        localStreamRef.current = null
      }
      remoteStreamRef.current = null
    }
  }, [callId, participantId, setupPeerConnection, startLocalMedia, createOfferAndSend])

  async function scheduleFollowUp() {
    const token = getToken()
    if (!token) {
      setStatusMessage('Please sign in to schedule a follow-up call.')
      return
    }

    const scheduledForInput = window.prompt('Follow-up date/time', new Date().toISOString())
    if (!scheduledForInput) return

    const parsedScheduledFor = new Date(scheduledForInput)
    const scheduledFor = Number.isNaN(parsedScheduledFor.getTime()) ? new Date().toISOString() : parsedScheduledFor.toISOString()

    try {
      const created = await apiRequest('/calls/scheduled', {
        method: 'POST',
        token,
        body: {
          match_id: callDetails?.match_id || matchId,
          title: `Follow-up: ${callDetails?.title || 'Supplier Intro'}`,
          chat_thread_id: callDetails?.context?.chat_thread_id || matchId,
          scheduled_for: scheduledFor,
          contract_id: callDetails?.contract_id || '',
          security_audit_id: callDetails?.security_audit_id || '',
        },
      })
      setStatusMessage(`Follow-up scheduled for ${new Date(created.scheduled_for).toLocaleString()}.`)
    } catch (err) {
      setStatusMessage(err.message || 'Failed to schedule follow-up.')
    }
  }

  async function startCall() {
    const token = getToken()
    if (!token || !callId) return
    try {
      const next = await apiRequest(`/calls/${callId}/start`, { method: 'POST', token })
      setCallDetails(next)
      setStatusMessage('Call session started.')
    } catch (err) {
      setStatusMessage(err.message || 'Unable to start call.')
    }
  }

  async function endCall() {
    const token = getToken()
    if (!token || !callId) return

    try {
      const ended = await apiRequest(`/calls/${callId}/end`, { method: 'POST', token, body: { reason: 'manual_end' } })
      setCallDetails(ended)
      setStatusMessage('Call ended. Recording is processing and status will refresh automatically.')
      await refreshCallDetails({ silent: true })
    } catch (err) {
      setStatusMessage(err.message || 'Unable to end call.')
    }
  }

  async function refreshRecordingStatus() {
    const latest = await refreshCallDetails()
    if (!latest) return

    if (latest.recording_status === 'available') {
      setStatusMessage('Recording is available.')
      return
    }

    if (latest.recording_status === 'failed') {
      setStatusMessage('Recording failed to process. Check audit details for failure reason.')
      return
    }

    setStatusMessage('Recording is still processing.')
  }

  const canStartCall = callDetails?.status === 'scheduled'
  const canEndCall = ['scheduled', 'in_progress'].includes(callDetails?.status)

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-3 md:p-4">
          <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                {callDetails?.title || 'Supplier Intro Meeting'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {callDetails?.status || 'scheduled'} • {callDetails?.recording_status || 'pending recording'} • {peerState}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                onClick={() => {
                  setIsMuted((v) => !v)
                  const stream = localStreamRef.current
                  if (stream) stream.getAudioTracks().forEach((t) => { t.enabled = isMuted })
                }}
              >
                {isMuted ? '🔇 Unmute' : '🎙️ Mute'}
              </button>
              <button
                className="rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                onClick={() => {
                  setIsCameraOn((v) => !v)
                  const stream = localStreamRef.current
                  if (stream) stream.getVideoTracks().forEach((t) => { t.enabled = !isCameraOn })
                }}
              >
                {isCameraOn ? '📷 Camera On' : '📷 Camera Off'}
              </button>
              <button className="rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">🖥️ Share</button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="relative h-[300px] md:h-[420px] overflow-hidden rounded-2xl bg-black">
              <div className="absolute left-3 top-3 z-10 rounded-lg bg-black/45 px-2 py-1 text-xs text-white">You</div>
              <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            </div>
            <div className="relative h-[300px] md:h-[420px] overflow-hidden rounded-2xl bg-black">
              <div className="absolute left-3 top-3 z-10 rounded-lg bg-black/45 px-2 py-1 text-xs text-white">Participant</div>
              <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
            </div>
          </div>

          {statusMessage ? (
            <div className="mt-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-3 py-2 text-sm text-blue-700 dark:text-blue-300">
              {statusMessage}
            </div>
          ) : null}

          <footer className="mt-4 flex flex-wrap items-center gap-2">
            {canStartCall ? (
              <button className="rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm" onClick={startCall}>Start Call</button>
            ) : null}
            {canEndCall ? (
              <button className="rounded-xl border border-red-400 bg-red-600 px-3 py-2 text-sm text-white" onClick={endCall}>End Call</button>
            ) : null}
            <button className="rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm" onClick={refreshRecordingStatus} disabled={isRefreshing}>
              {isRefreshing ? 'Refreshing…' : 'Refresh Recording'}
            </button>
            <button className="rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm" onClick={scheduleFollowUp}>Schedule Follow-up</button>
            <Link to="/" className="ml-auto rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">Leave</Link>
          </footer>
        </section>

        <aside className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">Meeting Details</h2>
          <div className="grid gap-2">
            <StatBadge label="Meeting ID" value={callDetails?.id || callId || 'Pending'} />
            <StatBadge label="Match ID" value={callDetails?.match_id || matchId || 'N/A'} />
            <StatBadge label="Started" value={callDetails?.started_at ? new Date(callDetails.started_at).toLocaleString() : 'Not started'} />
            <StatBadge label="Ended" value={callDetails?.ended_at ? new Date(callDetails.ended_at).toLocaleString() : 'In progress'} />
          </div>

          <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Participants</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(callDetails?.participant_ids || []).length > 0 ? (callDetails.participant_ids.map((id) => (
                <span key={id} className="rounded-full border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs text-gray-700 dark:text-gray-300">
                  {id}
                </span>
              ))) : <span className="text-sm text-gray-600 dark:text-gray-300">No participant data yet.</span>}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Notes</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">Share key decisions, pricing updates, and next actions here during the call.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
