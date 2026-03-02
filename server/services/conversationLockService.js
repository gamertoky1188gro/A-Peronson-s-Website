import { readJson, writeJson } from '../utils/jsonStore.js'

const FILE = 'conversation_locks.json'

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
    return { status: 'claimed', ...row }
  }

  if (existing.locked_by === agent.id || existing.allowed_agents.includes(agent.id)) {
    return { status: 'granted', ...existing }
  }

  return { status: 'locked', notification: 'Conversation is locked by another agent.' }
}

export async function grantConversationAccess(requestId, ownerId, targetAgentId) {
  const all = await readJson(FILE)
  const idx = all.findIndex((x) => x.request_id === requestId)
  if (idx < 0) return null
  if (all[idx].locked_by !== ownerId) return 'forbidden'
  if (!all[idx].allowed_agents.includes(targetAgentId)) all[idx].allowed_agents.push(targetAgentId)
  await writeJson(FILE, all)
  return all[idx]
}
