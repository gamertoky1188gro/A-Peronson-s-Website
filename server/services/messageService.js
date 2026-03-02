import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { trackTransition } from '../utils/metrics.js'

const FILE = 'messages.json'
const USERS_FILE = 'users.json'

export async function postMessage(matchId, senderId, message, type = 'text') {
  const messages = await readJson(FILE)
  const entry = {
    id: crypto.randomUUID(),
    match_id: matchId,
    sender_id: senderId,
    message: sanitizeString(message, 2000),
    timestamp: new Date().toISOString(),
    type,
  }
  messages.push(entry)
  await writeJson(FILE, messages)
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
  const filtered = messages.filter((m) => matchIds.includes(m.match_id))

  const priority = []
  const requestPool = []
  for (const m of filtered) {
    const sender = users.find((u) => u.id === m.sender_id)
    if (sender?.verified) priority.push(m)
    else requestPool.push(m)
  }
  return { priority, request_pool: requestPool }
}
