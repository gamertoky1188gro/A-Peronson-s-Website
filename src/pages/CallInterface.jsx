import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiRequest, getToken } from '../lib/auth'

const POLL_INTERVAL_MS = 4000
const TERMINAL_RECORDING_STATUSES = new Set(['available', 'failed'])

export default function CallInterface() {
  const [searchParams] = useSearchParams()
  const [callId] = useState(searchParams.get('callId') || '')
  const [statusMessage, setStatusMessage] = useState('')
  const [callDetails, setCallDetails] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const matchId = useMemo(() => searchParams.get('matchId') || '', [searchParams])

  const refreshCallDetails = useCallback(async ({ silent = false } = {}) => {
    const token = getToken()
    if (!token || !callId) return null

    if (!silent) {
      setIsRefreshing(true)
    }

    try {
      const call = await apiRequest(`/calls/${callId}`, { token })
      setCallDetails(call)
      return call
    } catch {
      if (!silent) {
        setStatusMessage('Unable to load call details.')
      }
      return null
    } finally {
      if (!silent) {
        setIsRefreshing(false)
      }
    }
  }, [callId])

  useEffect(() => {
    refreshCallDetails()
  }, [refreshCallDetails])

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white neo-panel cyberpunk-card rounded-lg w-full max-w-4xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold">Meeting: {callDetails?.title || 'Supplier Intro'}</div>
            <div className="text-sm text-[#5A5A5A]">
              {callDetails?.status || 'scheduled'} • {callDetails?.recording_status || 'pending recording'}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded">Mute</button>
            <button className="px-3 py-1 border rounded">Camera</button>
            <button className="px-3 py-1 border rounded">Share</button>
            <button className="px-3 py-1 border rounded" onClick={startCall}>Start Call</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={endCall}>End Call</button>
            <button className="px-3 py-1 border rounded" onClick={refreshRecordingStatus} disabled={isRefreshing}>
              {isRefreshing ? 'Refreshing…' : 'Refresh Recording'}
            </button>
            <button className="px-3 py-1 border rounded" onClick={scheduleFollowUp}>Schedule Follow-up</button>
          </div>
        </div>

        {statusMessage && <div className="mb-2 text-sm text-[#0A66C2]">{statusMessage}</div>}

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-900 h-64 rounded"></div>
          <div className="bg-gray-900 h-64 rounded"></div>
        </div>

        <div className="mt-3 flex justify-between">
          <div className="text-sm text-[#5A5A5A]">Notes • Shared Files</div>
          <Link to="/" className="text-sm text-[#0A66C2]">Close</Link>
        </div>
      </div>

    </div>
  )
}
