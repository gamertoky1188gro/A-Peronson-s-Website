import crypto from 'crypto'
import { readJson, writeJson } from './jsonStore.js'

const FILE = 'metrics.json'

export async function trackTransition(requirementId, fromStatus, toStatus, context = {}) {
  const all = await readJson(FILE)
  all.push({
    id: crypto.randomUUID(),
    requirement_id: requirementId,
    from_status: fromStatus,
    to_status: toStatus,
    context,
    created_at: new Date().toISOString(),
  })
  await writeJson(FILE, all)
}
