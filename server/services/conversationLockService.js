import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'

const FILE = 'conversation_locks.json'
const NOTIFICATIONS_FILE = 'notifications.json'

async function createLockNotification(userId, message, requestId, actorId, meta = {}) {
  if (!userId) return
  const notifications = await readJson(NOTIFICATIONS_FILE)
  notifications.push({
    id: crypto.randomUUID(),
    user_id: userId,
    type: 'conversation_lock',
    entity_type: 'buyer_request',
    entity_id: requestId,
    message,
    actor_id: actorId,
    meta,
    read: false,
    created_at: new Date().toISOString(),
  })
  await writeJson(NOTIFICATIONS_FILE, notifications)
}

export async function claimConversation(requestId, agent) {
  const all = await readJson(FILE)
  const existing = all.find((x) => x.request_id === requestId)
  if (!existing) {
    const row = {
      request_id: requestId,
      locked_by: agent.id,
      allowed_agents: [agent.id],
      created_at: new Date().toISOString(),
    }
    all.push(row)
    await writeJson(FILE, all)
    await createLockNotification(agent.id, `You claimed buyer request ${requestId}.`, requestId, agent.id)
    return { status: 'claimed', ...row }
  }

  if (existing.locked_by === agent.id || existing.allowed_agents.includes(agent.id)) {
    return { status: 'granted', ...existing }
  }

  return { status: 'locked', notification: 'Conversation is locked by another agent.' }
}

export async function grantConversationAccess(requestId, ownerId, targetAgentId) {
  if (!targetAgentId) return 'invalid_target'
  const all = await readJson(FILE)
  const idx = all.findIndex((x) => x.request_id === requestId)
  if (idx < 0) return null
  if (all[idx].locked_by !== ownerId) return 'forbidden'
  if (!all[idx].allowed_agents.includes(targetAgentId)) all[idx].allowed_agents.push(targetAgentId)
  await writeJson(FILE, all)
  await createLockNotification(
    targetAgentId,
    `Access granted for buyer request ${requestId}. You can now join this conversation.`,
    requestId,
    ownerId,
    { request_id: requestId, granted_by: ownerId },
  )
  return all[idx]
}

export async function requestConversationAccess(requestId, requester) {
  const all = await readJson(FILE)
  const lock = all.find((x) => x.request_id === requestId)
  if (!lock) {
    return { status: 'unclaimed', request_id: requestId }
  }

  if (lock.locked_by === requester.id || lock.allowed_agents.includes(requester.id)) {
    return { status: 'granted', ...lock }
  }

  await createLockNotification(
    lock.locked_by,
    `${requester.name || 'An agent'} requested access to buyer request ${requestId}.`,
    requestId,
    requester.id,
    { request_id: requestId, requester_id: requester.id },
  )

  await createLockNotification(
    requester.id,
    `Access request sent for buyer request ${requestId}.`,
    requestId,
    requester.id,
    { request_id: requestId, requester_id: requester.id },
  )

  return { status: 'requested', request_id: requestId, locked_by: lock.locked_by }
}
