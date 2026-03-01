import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { trackEvent } from './analyticsService.js'

const FILE = 'company_products.json'

export async function createProduct(user, payload) {
  const all = await readJson(FILE)
  const row = {
    id: crypto.randomUUID(),
    company_id: user.id,
    company_role: user.role,
    title: sanitizeString(payload.title, 120),
    category: sanitizeString(payload.category, 80),
    material: sanitizeString(payload.material, 80),
    moq: sanitizeString(payload.moq || '', 40),
    lead_time_days: sanitizeString(payload.lead_time_days || '', 40),
    description: sanitizeString(payload.description || '', 1200),
    video_url: sanitizeString(payload.video_url || '', 260),
    created_at: new Date().toISOString(),
  }
  all.push(row)
  await writeJson(FILE, all)
  await trackEvent({ type: 'product_created', actor_id: user.id, entity_id: row.id })
  return row
}

export async function listProducts(filters = {}) {
  const all = await readJson(FILE)
  return all.filter((p) => !filters.category || p.category.toLowerCase() === String(filters.category).toLowerCase())
}
