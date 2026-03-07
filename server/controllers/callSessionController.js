import {
  createScheduledCallSession,
  endCallSession,
  findOrCreateCallSession,
  getCallSession,
  listCallHistory,
  markRecording,
  startCallSession,
} from '../services/callSessionService.js'
import { buildFriendMatchId, isFriendConnected } from '../services/userService.js'

export async function createScheduledCall(req, res) {
  const call = await createScheduledCallSession(req.user.id, req.body)
  return res.status(201).json(call)
}

export async function startCall(req, res) {
  const result = await startCallSession(req.params.callId, req.user.id)
  if (!result) return res.status(404).json({ error: 'Call session not found' })
  if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (result === 'invalid_transition') return res.status(409).json({ error: 'Call cannot be started from current state' })
  return res.json(result)
}

export async function endCall(req, res) {
  const result = await endCallSession(req.params.callId, req.user.id, req.body?.reason)
  if (!result) return res.status(404).json({ error: 'Call session not found' })
  if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (result === 'invalid_transition') return res.status(409).json({ error: 'Call cannot be ended from current state' })
  return res.json(result)
}

export async function updateRecording(req, res) {
  const requestedStatus = String(req.body?.recording_status || '').trim()
  const validStatuses = new Set(['processing', 'available', 'failed'])

  if (!requestedStatus || !validStatuses.has(requestedStatus)) {
    return res.status(400).json({ error: 'Invalid recording_status. Use processing, available, or failed.' })
  }

  if (requestedStatus === 'available' && !String(req.body?.recording_url || '').trim()) {
    return res.status(400).json({ error: 'recording_url is required when recording_status is available' })
  }

  if (requestedStatus === 'failed' && !String(req.body?.failure_reason || '').trim()) {
    return res.status(400).json({ error: 'failure_reason is required when recording_status is failed' })
  }

  const call = await getCallSession(req.params.callId, req.user.id)
  if (!call) return res.status(404).json({ error: 'Call session not found' })
  if (call === 'forbidden') return res.status(403).json({ error: 'Forbidden' })

  const currentRecordingStatus = String(call.recording_status || 'pending').trim()
  const allowedTransitions = {
    pending: new Set(['processing']),
    processing: new Set(['available', 'failed']),
    available: new Set(),
    failed: new Set(),
  }

  if (!allowedTransitions[currentRecordingStatus]?.has(requestedStatus)) {
    return res.status(409).json({
      error: `Invalid recording status transition from ${currentRecordingStatus} to ${requestedStatus}`,
    })
  }

  const result = await markRecording(req.params.callId, req.user.id, req.body)
  if (!result) return res.status(404).json({ error: 'Call session not found' })
  if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (result === 'invalid_transition') return res.status(409).json({ error: 'Invalid recording status transition for this call' })
  if (result === 'missing_metadata') return res.status(400).json({ error: 'recording_url is required when recording_status is available' })
  if (result === 'missing_failure_reason') return res.status(400).json({ error: 'failure_reason is required when recording_status is failed' })
  return res.json(result)
}

export async function getCall(req, res) {
  const result = await getCallSession(req.params.callId, req.user.id)
  if (!result) return res.status(404).json({ error: 'Call session not found' })
  if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  return res.json(result)
}

export async function getCallHistory(req, res) {
  const matchIds = req.query.match_ids
    ? String(req.query.match_ids)
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
    : []

  const history = await listCallHistory(matchIds, req.user.id)
  return res.json({ items: history })
}

export async function joinOrCreateCall(req, res) {
  const result = await findOrCreateCallSession(req.user.id, req.body || {})
  return res.status(result.created ? 201 : 200).json(result)
}


export async function joinFriendCall(req, res) {
  const targetId = String(req.params.userId || '').trim()
  if (!targetId || targetId === req.user.id) {
    return res.status(400).json({ error: 'Invalid friend target' })
  }

  const connected = await isFriendConnected(req.user.id, targetId)
  if (!connected) {
    return res.status(403).json({ error: 'Only friends can start direct calls' })
  }

  const matchId = buildFriendMatchId(req.user.id, targetId)
  const result = await findOrCreateCallSession(req.user.id, {
    match_id: matchId,
    chat_thread_id: matchId,
    participant_ids: [targetId],
    title: 'Friend call',
  })

  return res.status(result.created ? 201 : 200).json(result)
}
