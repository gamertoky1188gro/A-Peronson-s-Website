    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | 
    4 | const FILE = 'conversation_locks.json'
    5 | const NOTIFICATIONS_FILE = 'notifications.json'
    6 | 
    7 | async function createLockNotification(userId, message, requestId, actorId, meta = {}) {
    8 |   if (!userId) return
    9 |   const notifications = await readJson(NOTIFICATIONS_FILE)
   10 |   notifications.push({
   11 |     id: crypto.randomUUID(),
   12 |     user_id: userId,
   13 |     type: 'conversation_lock',
   14 |     entity_type: 'buyer_request',
   15 |     entity_id: requestId,
   16 |     message,
   17 |     actor_id: actorId,
   18 |     meta,
   19 |     read: false,
   20 |     created_at: new Date().toISOString(),
   21 |   })
   22 |   await writeJson(NOTIFICATIONS_FILE, notifications)
   23 | }
   24 | 
   25 | function normalizeAllowed(lock) {
   26 |   if (!lock) return []
   27 |   const allowedUsers = Array.isArray(lock.allowed_users) ? lock.allowed_users : []
   28 |   const allowedAgents = Array.isArray(lock.allowed_agents) ? lock.allowed_agents : []
   29 |   return [...new Set([...allowedUsers, ...allowedAgents].map((id) => String(id)))]
   30 | }
   31 | 
   32 | export async function claimConversation(requestId, agent) {
   33 |   const all = await readJson(FILE)
   34 |   const existing = all.find((x) => x.request_id === requestId)
   35 |   if (!existing) {
   36 |     const row = {
   37 |       request_id: requestId,
   38 |       locked_by: agent.id,
   39 |       allowed_agents: [agent.id],
   40 |       allowed_users: [agent.id],
   41 |       lock_type: 'agent_claim',
   42 |       lock_status: 'claimed',
   43 |       lock_reason: 'agent_claim',
   44 |       created_at: new Date().toISOString(),
   45 |       updated_at: new Date().toISOString(),
   46 |     }
   47 |     all.push(row)
   48 |     await writeJson(FILE, all)
   49 |     await createLockNotification(agent.id, `You claimed buyer request ${requestId}.`, requestId, agent.id)
   50 |     return { status: 'claimed', ...row }
   51 |   }
   52 | 
   53 |   const allowed = normalizeAllowed(existing)
   54 |   if (existing.locked_by === agent.id || allowed.includes(agent.id)) {
   55 |     return { status: 'granted', ...existing }
   56 |   }
   57 | 
   58 |   return { status: 'locked', notification: 'Conversation is locked by another agent.' }
   59 | }
   60 | 
   61 | export async function grantConversationAccess(requestId, actor, targetUserId) {
   62 |   if (!targetUserId) return 'invalid_target'
   63 |   const all = await readJson(FILE)
   64 |   const idx = all.findIndex((x) => x.request_id === requestId)
   65 |   if (idx < 0) return null
   66 |   const isOwner = String(all[idx].locked_by) === String(actor?.id || '')
   67 |   const isAdmin = ['owner', 'admin'].includes(String(actor?.role || '').toLowerCase())
   68 |   if (!isOwner && !isAdmin) return 'forbidden'
   69 | 
   70 |   const allowedUsers = normalizeAllowed(all[idx])
   71 |   if (!allowedUsers.includes(targetUserId)) {
   72 |     all[idx].allowed_users = [...allowedUsers, targetUserId]
   73 |   }
   74 |   all[idx].updated_at = new Date().toISOString()
   75 |   await writeJson(FILE, all)
   76 |   await createLockNotification(
   77 |     targetUserId,
   78 |     `Access granted for buyer request ${requestId}. You can now join this conversation.`,
   79 |     requestId,
   80 |     actor?.id,
   81 |     { request_id: requestId, granted_by: actor?.id },
   82 |   )
   83 |   return all[idx]
   84 | }
   85 | 
   86 | export async function requestConversationAccess(requestId, requester) {
   87 |   const all = await readJson(FILE)
   88 |   const lock = all.find((x) => x.request_id === requestId)
   89 |   if (!lock) {
   90 |     return { status: 'unclaimed', request_id: requestId }
   91 |   }
   92 | 
   93 |   const allowed = normalizeAllowed(lock)
   94 |   if (lock.locked_by === requester.id || allowed.includes(requester.id)) {
   95 |     return { status: 'granted', ...lock }
   96 |   }
   97 | 
   98 |   await createLockNotification(
   99 |     lock.locked_by,
  100 |     `${requester.name || 'An agent'} requested access to buyer request ${requestId}.`,
  101 |     requestId,
  102 |     requester.id,
  103 |     { request_id: requestId, requester_id: requester.id },
  104 |   )
  105 | 
  106 |   await createLockNotification(
  107 |     requester.id,
  108 |     `Access request sent for buyer request ${requestId}.`,
  109 |     requestId,
  110 |     requester.id,
  111 |     { request_id: requestId, requester_id: requester.id },
  112 |   )
  113 | 
  114 |   return { status: 'requested', request_id: requestId, locked_by: lock.locked_by }
  115 | }
  116 | 
  117 | export async function transferConversation(requestId, actor, targetUserId) {
  118 |   if (!targetUserId) return 'invalid_target'
  119 |   const all = await readJson(FILE)
  120 |   const idx = all.findIndex((x) => x.request_id === requestId)
  121 |   if (idx < 0) return null
  122 | 
  123 |   const current = all[idx]
  124 |   const isOwner = String(current.locked_by) === String(actor?.id || '')
  125 |   const isAdmin = ['owner', 'admin'].includes(String(actor?.role || '').toLowerCase())
  126 |   if (!isOwner && !isAdmin) return 'forbidden'
  127 | 
  128 |   all[idx] = {
  129 |     ...current,
  130 |     locked_by: targetUserId,
  131 |     allowed_agents: [targetUserId],
  132 |     allowed_users: [targetUserId],
  133 |     lock_type: 'agent_claim',
  134 |     lock_status: 'claimed',
  135 |     lock_reason: 'agent_transfer',
  136 |     updated_at: new Date().toISOString(),
  137 |   }
  138 |   await writeJson(FILE, all)
  139 | 
  140 |   await createLockNotification(
  141 |     targetUserId,
  142 |     `A conversation was transferred to you for buyer request ${requestId}. You now own this thread.`,
  143 |     requestId,
  144 |     actor?.id,
  145 |     { request_id: requestId, transferred_by: actor?.id },
  146 |   )
  147 | 
  148 |   await createLockNotification(
  149 |     current.locked_by,
  150 |     `You transferred buyer request ${requestId}. You no longer have messaging access.`,
  151 |     requestId,
  152 |     actor?.id,
  153 |     { request_id: requestId, transferred_to: targetUserId },
  154 |   )
  155 | 
  156 |   return all[idx]
  157 | }
  158 | 