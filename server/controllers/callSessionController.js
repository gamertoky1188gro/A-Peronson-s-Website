import {
  createScheduledCallSession,
  endCallSession,
  getCallSession,
  listCallHistory,
  markRecording,
  startCallSession,
} from '../services/callSessionService.js'

export async function createScheduledCall(req, res) {
  const call = await createScheduledCallSession(req.user.id, req.body)
  return res.status(201).json(call)
}

export async function startCall(req, res) {
  const result = await startCallSession(req.params.callId, req.user.id)
  if (!result) return res.status(404).json({ error: 'Call session not found' })
  if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  return res.json(result)
}

export async function endCall(req, res) {
  const result = await endCallSession(req.params.callId, req.user.id, req.body?.reason)
  if (!result) return res.status(404).json({ error: 'Call session not found' })
  if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  return res.json(result)
}

export async function updateRecording(req, res) {
  const result = await markRecording(req.params.callId, req.user.id, req.body)
  if (!result) return res.status(404).json({ error: 'Call session not found' })
  if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
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
