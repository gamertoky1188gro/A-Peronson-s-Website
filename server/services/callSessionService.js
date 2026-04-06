import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { recordMilestone } from './ratingsService.js'
import { recordWorkflowEvent } from './workflowLifecycleService.js'

const FILE = 'call_sessions.json'
const RECORDING_VIEWS_FILE = 'call_recording_views.json'
const MESSAGE_FILE = 'messages.json'
const REQUIREMENT_FILE = 'requirements.json'
const CALL_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  ENDED: 'ended',
  COMPLETED: 'completed',
}
const RECORDING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  AVAILABLE: 'available',
  FAILED: 'failed',
}

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

function parseFriendMatchId(matchId = '') {
  const parts = String(matchId).split(':')
  if (parts.length !== 3 || parts[0] !== 'friend') return null
  const first = sanitizeString(parts[1], 120)
  const second = sanitizeString(parts[2], 120)
  if (!first || !second) return null
  return [first, second]
}

function parseMarketplaceMatchId(matchId = '') {
  const parts = String(matchId).split(':')
  if (parts.length !== 2) return null
  const requirementId = sanitizeString(parts[0], 120)
  const factoryId = sanitizeString(parts[1], 120)
  if (!requirementId || !factoryId) return null
  return { requirementId, factoryId }
}

async function deriveParticipantIds(matchId) {
  const ids = new Set()
  const friendPair = parseFriendMatchId(matchId)
  if (Array.isArray(friendPair)) {
    friendPair.forEach((id) => { if (id) ids.add(id) })
  }

  const marketplacePair = parseMarketplaceMatchId(matchId)
  if (marketplacePair?.factoryId) {
    ids.add(marketplacePair.factoryId)
    const requirements = await readJson(REQUIREMENT_FILE)
    const requirement = requirements.find((row) => String(row?.id || '') === marketplacePair.requirementId) || null
    const buyerId = sanitizeString(requirement?.buyer_id || requirement?.buyerId, 120)
    if (buyerId) ids.add(buyerId)
  }

  const messages = await readJson(MESSAGE_FILE)
  messages
    .filter((message) => message?.match_id === matchId)
    .forEach((message) => {
      const senderId = sanitizeString(message?.sender_id, 120)
      if (senderId) ids.add(senderId)
    })

  return [...ids]
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
    status: CALL_STATUS.SCHEDULED,
    recording_url: '',
    recording_status: RECORDING_STATUS.PENDING,
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
  await recordWorkflowEvent('call_scheduled', {
    match_id: row.match_id,
    chat_thread_id: row.context?.chat_thread_id || row.match_id,
    contract_id: row.contract_id,
    call_id: row.id,
  }, { actor_id: userId, scheduled_for: row.scheduled_for }).catch(() => null)
  return row
}

export async function startCallSession(callId, userId) {
  const calls = await readJson(FILE)
  const idx = calls.findIndex((call) => call.id === callId)
  if (idx < 0) return null
  const call = calls[idx]
  if (!ensureParticipant(call, userId)) return 'forbidden'

  if (![CALL_STATUS.SCHEDULED, CALL_STATUS.IN_PROGRESS].includes(call.status)) return 'invalid_transition'

  const next = {
    ...call,
    status: CALL_STATUS.IN_PROGRESS,
    started_at: call.started_at || new Date().toISOString(),
    audit_trail: [...(call.audit_trail || []), buildAuditEntry('started', userId)],
  }
  calls[idx] = next
  await writeJson(FILE, calls)
  await recordWorkflowEvent('call_joined', {
    match_id: next.match_id,
    contract_id: next.contract_id,
  }, { actor_id: userId, source: 'calls.start' }).catch(() => null)

  return next
}

export async function endCallSession(callId, userId, endReason = '') {
  const calls = await readJson(FILE)
  const idx = calls.findIndex((call) => call.id === callId)
  if (idx < 0) return null
  const call = calls[idx]
  if (!ensureParticipant(call, userId)) return 'forbidden'

  if (![CALL_STATUS.SCHEDULED, CALL_STATUS.IN_PROGRESS].includes(call.status)) return 'invalid_transition'

  const reason = sanitizeString(endReason || 'completed', 120)
  const next = {
    ...call,
    status: CALL_STATUS.ENDED,
    ended_at: call.ended_at || new Date().toISOString(),
    recording_status: RECORDING_STATUS.PROCESSING,
    audit_trail: [
      ...(call.audit_trail || []),
      buildAuditEntry('ended', userId, { reason }),
      buildAuditEntry('recording_processing', userId, { reason: 'call_ended' }),
    ],
  }
  calls[idx] = next
  await writeJson(FILE, calls)
  await recordWorkflowEvent('call_ended', {
    match_id: next.match_id,
    contract_id: next.contract_id,
  }, { actor_id: userId, source: 'calls.end' }).catch(() => null)

  return next
}

export async function markRecording(callId, userId, payload = {}) {
  const calls = await readJson(FILE)
  const idx = calls.findIndex((call) => call.id === callId)
  if (idx < 0) return null
  const call = calls[idx]
  if (!ensureParticipant(call, userId)) return 'forbidden'

  const recordingStatus = sanitizeString(payload?.recording_status || RECORDING_STATUS.AVAILABLE, 30)
  const recordingUrl = sanitizeString(payload?.recording_url, 400)
  const failureReason = sanitizeString(payload?.failure_reason, 240)
  const currentStatus = sanitizeString(call?.recording_status || RECORDING_STATUS.PENDING, 30)

  const transitionKey = `${currentStatus}->${recordingStatus}`
  const validTransitions = new Set([
    `${RECORDING_STATUS.PENDING}->${RECORDING_STATUS.PROCESSING}`,
    `${RECORDING_STATUS.PROCESSING}->${RECORDING_STATUS.AVAILABLE}`,
    `${RECORDING_STATUS.PROCESSING}->${RECORDING_STATUS.FAILED}`,
  ])
  if (!validTransitions.has(transitionKey)) return 'invalid_transition'

  if (recordingStatus === RECORDING_STATUS.AVAILABLE && !recordingUrl) return 'missing_metadata'
  if (recordingStatus === RECORDING_STATUS.FAILED && !failureReason) return 'missing_failure_reason'

  const shouldComplete = [RECORDING_STATUS.AVAILABLE, RECORDING_STATUS.FAILED].includes(recordingStatus)
  const auditTrail = [
    ...(call.audit_trail || []),
    buildAuditEntry('recording_updated', userId, {
      from: currentStatus,
      to: recordingStatus,
      recording_url: recordingUrl,
      failure_reason: failureReason,
    }),
  ]

  if (recordingStatus === RECORDING_STATUS.AVAILABLE) {
    auditTrail.push(buildAuditEntry('recording_available', userId, { recording_url: recordingUrl }))
  }

  if (recordingStatus === RECORDING_STATUS.FAILED) {
    auditTrail.push(buildAuditEntry('recording_failed', userId, { failure_reason: failureReason }))
  }

  if (shouldComplete) {
    auditTrail.push(buildAuditEntry('completed', userId, { recording_status: recordingStatus }))
  }

  const next = {
    ...call,
    recording_status: recordingStatus,
    recording_url: recordingUrl,
    status: shouldComplete ? CALL_STATUS.COMPLETED : call.status,
    audit_trail: auditTrail,
  }
  calls[idx] = next
  await writeJson(FILE, calls)

  if (shouldComplete) {
    await recordWorkflowEvent('call_ended', {
      match_id: call.match_id,
      chat_thread_id: call.context?.chat_thread_id || call.match_id,
      contract_id: call.contract_id,
      call_id: call.id,
    }, { actor_id: userId, recording_status: recordingStatus }).catch(() => null)
    const participants = normalizeParticipantIds(call.participant_ids, call.created_by).filter((id) => id !== userId)
    await Promise.all(participants.map((counterpartyId) => recordMilestone({
      profileKey: `user:${userId}`,
      counterpartyId,
      interactionType: 'call',
      milestone: 'communication_completed',
      actorId: userId,
    })))
  }

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


export async function findOrCreateCallSession(userId, payload = {}) {
  const matchId = sanitizeString(payload?.match_id, 120)
  if (!matchId) {
    const error = new Error('match_id is required')
    error.status = 400
    throw error
  }

  const calls = await readJson(FILE)
  const candidates = calls
    .filter((call) => ensureParticipant(call, userId) && call.match_id === matchId)
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

  const active = candidates.find((call) => [CALL_STATUS.SCHEDULED, CALL_STATUS.IN_PROGRESS, CALL_STATUS.ENDED].includes(call.status))
  if (active) return { call: active, created: false }

  let participantIds = Array.isArray(payload?.participant_ids) ? payload.participant_ids : []
  if (participantIds.length === 0) {
    participantIds = await deriveParticipantIds(matchId)
  }

  const createdCall = await createScheduledCallSession(userId, {
    ...payload,
    participant_ids: participantIds,
  })
  return { call: createdCall, created: true }
}

export async function listCallsByContract(contractId, userId) {
  const id = sanitizeString(String(contractId || ''), 120)
  if (!id) return []
  const calls = await readJson(FILE)
  return (Array.isArray(calls) ? calls : [])
    .filter((call) => ensureParticipant(call, userId) && String(call.contract_id || '') === id)
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
}

export async function getRecordingMetadata(callId, userId) {
  const call = await getCallSession(callId, userId)
  if (!call) return null
  if (call === 'forbidden') return 'forbidden'

  const views = await readJson(RECORDING_VIEWS_FILE)
  const rows = Array.isArray(views) ? views : []
  const viewCount = rows.filter((v) => String(v.call_id || '') === String(callId || '')).length
  return {
    call_id: call.id,
    match_id: call.match_id || '',
    contract_id: call.contract_id || '',
    recording_status: call.recording_status || 'pending',
    recording_url: call.recording_url || '',
    recording_updated_at: call.recording_updated_at || call.updated_at || '',
    views: viewCount,
  }
}

export async function markRecordingViewed(callId, userId) {
  const call = await getCallSession(callId, userId)
  if (!call) return null
  if (call === 'forbidden') return 'forbidden'

  const views = await readJson(RECORDING_VIEWS_FILE)
  const rows = Array.isArray(views) ? views : []
  rows.push({
    id: crypto.randomUUID(),
    call_id: String(callId || ''),
    viewer_id: String(userId || ''),
    viewed_at: new Date().toISOString(),
  })
  await writeJson(RECORDING_VIEWS_FILE, rows)
  return { ok: true }
}
