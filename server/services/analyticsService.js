import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'

const FILE = 'analytics.json'

export async function trackEvent({ type, actor_id, entity_id, metadata = {} }) {
  const all = await readJson(FILE)
  all.push({
    id: crypto.randomUUID(),
    type,
    actor_id,
    entity_id,
    metadata,
    created_at: new Date().toISOString(),
  })
  await writeJson(FILE, all)
}

export async function getAnalyticsSummary() {
  const all = await readJson(FILE)
  const byType = all.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})
  return { total_events: all.length, by_type: byType }
}
