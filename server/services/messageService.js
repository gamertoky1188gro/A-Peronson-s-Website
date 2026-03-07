import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { trackTransition } from '../utils/metrics.js'
import { buildFriendMatchId, isFriendConnected } from './friendService.js'

const FILE = 'messages.json'
const USERS_FILE = 'users.json'
const MESSAGE_REQUESTS_FILE = 'message_requests.json'
const CONVERSATION_LOCKS_FILE = 'conversation_locks.json'


function parseFriendMatchId(matchId = '') {
  const parts = String(matchId).split(':')
  if (parts.length !== 3 || parts[0] !== 'friend') return null
  const first = sanitizeString(parts[1], 120)
  const second = sanitizeString(parts[2], 120)
  if (!first || !second) return null
  return [first, second]
}

export async function canAccessMatch(matchId, userId) {
  const pair = parseFriendMatchId(matchId)
  if (!pair) return true
  if (!pair.includes(userId)) return false
  return isFriendConnected(pair[0], pair[1])
}

export async function postFriendMessage(senderId, targetUserId, message, type = 'text') {
  const targetId = sanitizeString(String(targetUserId || ''), 120)
  if (!targetId || senderId === targetId) {
    const err = new Error('Invalid friend target')
    err.status = 400
    throw err
  }

  const connected = await isFriendConnected(senderId, targetId)
  if (!connected) {
    const err = new Error('Only friends can send direct messages')
    err.status = 403
    throw err
  }

  const matchId = buildFriendMatchId(senderId, targetId)
  const entry = await postMessage(matchId, senderId, message, type)
  return { match_id: matchId, message: entry }
}

export async function listFriendMatchIdsForUser(userId) {
  const messages = await readJson(FILE)
  const ids = new Set(
    messages
      .map((row) => row.match_id)
      .filter((matchId) => {
        const pair = parseFriendMatchId(matchId)
        return Array.isArray(pair) && pair.includes(userId)
      }),
  )
  return [...ids]
}

function upsertRequestState(requests, threadId, updates = {}) {
  const existingIndex = requests.findIndex((request) => request.thread_id === threadId)
  const nextEntry = {
    thread_id: threadId,
    status: 'pending',
    acted_by: null,
    acted_at: null,
    ...updates,
  }

  if (existingIndex === -1) {
    requests.push(nextEntry)
    return nextEntry
  }

  requests[existingIndex] = {
    ...requests[existingIndex],
    ...updates,
  }
  return requests[existingIndex]
}

function requestIdFromMatchId(matchId = '') {
  return String(matchId).split(':')[0] || ''
}

function buildLockMeta(lock, usersById, currentUserId) {
  if (!lock) {
    return {
      status: 'unclaimed',
      can_request_access: true,
      claimed_by: null,
      claimed_by_name: '',
    }
  }

  const claimedByName = usersById.get(lock.locked_by)?.name || lock.locked_by
  const isOwner = lock.locked_by === currentUserId
  const isGranted = Array.isArray(lock.allowed_agents) && lock.allowed_agents.includes(currentUserId)

  if (isOwner) {
    return {
      status: 'claimed',
      can_request_access: false,
      claimed_by: lock.locked_by,
      claimed_by_name: claimedByName,
    }
  }

  if (isGranted) {
    return {
      status: 'granted',
      can_request_access: false,
      claimed_by: lock.locked_by,
      claimed_by_name: claimedByName,
    }
  }

  return {
    status: 'request_access',
    can_request_access: true,
    claimed_by: lock.locked_by,
    claimed_by_name: claimedByName,
  }
}

function withConversationMeta(message, usersById, lock, currentUserId) {
  return {
    ...message,
    request_id: requestIdFromMatchId(message.match_id),
    conversation_lock: buildLockMeta(lock, usersById, currentUserId),
  }
}

export async function postMessage(matchId, senderId, message, type = 'text', attachment = null) {
  const messages = await readJson(FILE)
  const users = await readJson(USERS_FILE)
  const messageRequests = await readJson(MESSAGE_REQUESTS_FILE)
  const safeAttachment = attachment ? {
    name: sanitizeString(attachment?.name, 220),
    url: sanitizeString(attachment?.url, 600),
    mime_type: sanitizeString(attachment?.mime_type, 120),
    size: Number(attachment?.size || 0),
  } : null

  const entry = {
    id: crypto.randomUUID(),
    match_id: matchId,
    sender_id: senderId,
    message: sanitizeString(message, 2000),
    timestamp: new Date().toISOString(),
    type,
    attachment: safeAttachment && safeAttachment.url ? safeAttachment : null,
  }
  messages.push(entry)

  const sender = users.find((u) => u.id === senderId)
  if (!sender?.verified) {
    upsertRequestState(messageRequests, matchId, { status: 'pending', acted_by: null, acted_at: null })
  }

  await writeJson(FILE, messages)
  await writeJson(MESSAGE_REQUESTS_FILE, messageRequests)
  await trackTransition(matchId, 'matched', 'first_message_sent', { sender_id: senderId })
  return entry
}

export async function listMessagesByMatch(matchId) {
  const messages = await readJson(FILE)
  return messages.filter((m) => m.match_id === matchId)
}

export async function tieredInbox(matchIds, currentUserId) {
  const users = await readJson(USERS_FILE)
  const usersById = new Map(users.map((user) => [user.id, user]))
  const messages = await readJson(FILE)
  const messageRequests = await readJson(MESSAGE_REQUESTS_FILE)
  const conversationLocks = await readJson(CONVERSATION_LOCKS_FILE)
  const lockByRequestId = new Map(conversationLocks.map((lock) => [lock.request_id, lock]))

  const filtered = messages.filter((m) => matchIds.includes(m.match_id))
  const requestMap = new Map(messageRequests.map((request) => [request.thread_id, request]))
  const latestByThread = new Map()

  for (const message of filtered) {
    const existing = latestByThread.get(message.match_id)
    if (!existing || new Date(message.timestamp || 0).getTime() > new Date(existing.timestamp || 0).getTime()) {
      latestByThread.set(message.match_id, message)
    }
  }

  const priority = []
  const requestPool = []
  for (const matchId of matchIds) {
    const m = latestByThread.get(matchId)
    if (!m) continue

    const request = requestMap.get(m.match_id)
    if (request?.status === 'rejected') continue

    const sender = usersById.get(m.sender_id)
    const requestId = requestIdFromMatchId(m.match_id)
    const lock = lockByRequestId.get(requestId)
    const withMeta = withConversationMeta(m, usersById, lock, currentUserId)

    if (request?.status === 'accepted' || sender?.verified) priority.push(withMeta)
    else requestPool.push(withMeta)
  }
  return { priority, request_pool: requestPool }
}

async function updateRequestStatus(threadId, status, actedBy) {
  const messageRequests = await readJson(MESSAGE_REQUESTS_FILE)
  const actedAt = new Date().toISOString()
  const request = upsertRequestState(messageRequests, threadId, {
    status,
    acted_by: actedBy,
    acted_at: actedAt,
  })
  await writeJson(MESSAGE_REQUESTS_FILE, messageRequests)
  return request
}

export async function acceptMessageRequest(threadId, actedBy) {
  return updateRequestStatus(threadId, 'accepted', actedBy)
}

export async function rejectMessageRequest(threadId, actedBy) {
  return updateRequestStatus(threadId, 'rejected', actedBy)
}
