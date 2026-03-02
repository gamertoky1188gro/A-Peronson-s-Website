import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const FILE = 'social_interactions.json'

export async function addComment(user, entityType, entityId, text) {
  const all = await readJson(FILE)
  const row = {
    id: crypto.randomUUID(),
    interaction_type: 'comment',
    entity_type: sanitizeString(entityType, 60),
    entity_id: sanitizeString(entityId, 120),
    actor_id: user.id,
    actor_name: user.name,
    actor_verified: Boolean(user.verified),
    text: sanitizeString(text, 800),
    created_at: new Date().toISOString(),
  }
  all.push(row)
  await writeJson(FILE, all)
  return row
}

export async function addAction(user, entityType, entityId, action, reason = '') {
  const all = await readJson(FILE)
  const row = {
    id: crypto.randomUUID(),
    interaction_type: action,
    entity_type: sanitizeString(entityType, 60),
    entity_id: sanitizeString(entityId, 120),
    actor_id: user.id,
    actor_name: user.name,
    actor_verified: Boolean(user.verified),
    text: sanitizeString(reason, 800),
    created_at: new Date().toISOString(),
  }
  all.push(row)
  await writeJson(FILE, all)
  return row
}

export async function listInteractions(entityType, entityId) {
  const all = await readJson(FILE)
  const rows = all.filter((x) => x.entity_type === entityType && x.entity_id === entityId)
  const comments = rows.filter((x) => x.interaction_type === 'comment')
  return {
    comments,
    share_count: rows.filter((x) => x.interaction_type === 'share').length,
    report_count: rows.filter((x) => x.interaction_type === 'report').length,
  }
}
