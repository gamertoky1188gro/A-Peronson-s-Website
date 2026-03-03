import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { trackTransition } from '../utils/metrics.js'

const FILE = 'messages.json'
const USERS_FILE = 'users.json'
const MESSAGE_REQUESTS_FILE = 'message_requests.json'

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

export async function postMessage(matchId, senderId, message, type = 'text') {
  const messages = await readJson(FILE)
  const users = await readJson(USERS_FILE)
  const messageRequests = await readJson(MESSAGE_REQUESTS_FILE)
  const entry = {
    id: crypto.randomUUID(),
    match_id: matchId,
    sender_id: senderId,
    message: sanitizeString(message, 2000),
    timestamp: new Date().toISOString(),
    type,
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

export async function tieredInbox(matchIds) {
  const users = await readJson(USERS_FILE)
  const messages = await readJson(FILE)
  const messageRequests = await readJson(MESSAGE_REQUESTS_FILE)
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

    const sender = users.find((u) => u.id === m.sender_id)
    if (request?.status === 'accepted' || sender?.verified) priority.push(m)
    else requestPool.push(m)
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
