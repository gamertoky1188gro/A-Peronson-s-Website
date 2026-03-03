import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const FILE = 'call_sessions.json'

function normalizeParticipantIds(participantIds = [], ownerId) {
  const all = [ownerId, ...(Array.isArray(participantIds) ? participantIds : [])]
  return [...new Set(all.filter(Boolean).map((id) => sanitizeString(id, 120)))]
}

function buildAuditEntry(event, actorId, metadata = {}) {
  return {
    id: crypto.randomUUID(),
    event,
    actor_id: actorId,
    timestamp: new Date().toISOString(),
    metadata,
  }
}

function ensureParticipant(call, userId) {
  return call.participant_ids.includes(userId) || call.created_by === userId
}

export async function createScheduledCallSession(userId, payload = {}) {
  const calls = await readJson(FILE)
  const parsedScheduledFor = payload?.scheduled_for ? new Date(payload.scheduled_for) : new Date()
  const scheduledFor = Number.isNaN(parsedScheduledFor.getTime()) ? new Date().toISOString() : parsedScheduledFor.toISOString()
  const row = {
    id: crypto.randomUUID(),
    created_by: userId,
    match_id: sanitizeString(payload?.match_id, 120),
    title: sanitizeString(payload?.title || 'Scheduled call', 180),
    scheduled_for: scheduledFor,
    duration_minutes: Number(payload?.duration_minutes) > 0 ? Number(payload.duration_minutes) : 30,
    participant_ids: normalizeParticipantIds(payload?.participant_ids, userId),
    status: 'scheduled',
    recording_url: '',
    recording_status: 'pending',
    contract_id: sanitizeString(payload?.contract_id, 120),
    security_audit_id: sanitizeString(payload?.security_audit_id, 120),
    context: {
      chat_thread_id: sanitizeString(payload?.chat_thread_id || payload?.match_id, 120),
      notes: sanitizeString(payload?.notes, 400),
    },
    created_at: new Date().toISOString(),
    started_at: null,
    ended_at: null,
    audit_trail: [buildAuditEntry('scheduled', userId, { scheduled_for: scheduledFor })],
  }

  calls.push(row)
  await writeJson(FILE, calls)
  return row
}

export async function startCallSession(callId, userId) {
  const calls = await readJson(FILE)
  const idx = calls.findIndex((call) => call.id === callId)
  if (idx < 0) return null
  const call = calls[idx]
  if (!ensureParticipant(call, userId)) return 'forbidden'

  const next = {
    ...call,
    status: 'in_progress',
    started_at: call.started_at || new Date().toISOString(),
    audit_trail: [...(call.audit_trail || []), buildAuditEntry('started', userId)],
  }
  calls[idx] = next
  await writeJson(FILE, calls)
  return next
}

export async function endCallSession(callId, userId, endReason = '') {
  const calls = await readJson(FILE)
  const idx = calls.findIndex((call) => call.id === callId)
  if (idx < 0) return null
  const call = calls[idx]
  if (!ensureParticipant(call, userId)) return 'forbidden'

  const reason = sanitizeString(endReason || 'completed', 120)
  const next = {
    ...call,
    status: 'completed',
    ended_at: new Date().toISOString(),
    audit_trail: [...(call.audit_trail || []), buildAuditEntry('ended', userId, { reason })],
  }
  calls[idx] = next
  await writeJson(FILE, calls)
  return next
}

export async function markRecording(callId, userId, payload = {}) {
  const calls = await readJson(FILE)
  const idx = calls.findIndex((call) => call.id === callId)
  if (idx < 0) return null
  const call = calls[idx]
  if (!ensureParticipant(call, userId)) return 'forbidden'

  const recordingStatus = sanitizeString(payload?.recording_status || 'available', 30)
  const recordingUrl = sanitizeString(payload?.recording_url, 400)
  const next = {
    ...call,
    recording_status: recordingStatus,
    recording_url: recordingUrl,
    audit_trail: [
      ...(call.audit_trail || []),
      buildAuditEntry('recording_updated', userId, { recording_status: recordingStatus, recording_url: recordingUrl }),
    ],
  }
  calls[idx] = next
  await writeJson(FILE, calls)
  return next
}

export async function getCallSession(callId, userId) {
  const calls = await readJson(FILE)
  const call = calls.find((item) => item.id === callId)
  if (!call) return null
  if (!ensureParticipant(call, userId)) return 'forbidden'
  return call
}

export async function listCallHistory(matchIds = [], userId) {
  const calls = await readJson(FILE)
  const allowed = calls.filter((call) => ensureParticipant(call, userId))
  if (!Array.isArray(matchIds) || matchIds.length === 0) {
    return allowed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const ids = new Set(matchIds)
  return allowed
    .filter((call) => ids.has(call.match_id) || ids.has(call.context?.chat_thread_id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
