import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { generateMatchesForRequirement } from './matchingService.js'
import { trackTransition } from '../utils/metrics.js'

const FILE = 'requirements.json'

export async function createRequirement(buyerId, payload) {
  const requirements = await readJson(FILE)
  const requirement = {
    id: crypto.randomUUID(),
    buyer_id: buyerId,
    category: sanitizeString(payload.category, 120),
    fabric_type: sanitizeString(payload.fabric_type, 120),
    gsm: sanitizeString(payload.gsm, 30),
    quantity: sanitizeString(payload.quantity, 40),
    target_price: sanitizeString(payload.target_price, 50),
    certifications_required: Array.isArray(payload.certifications_required)
      ? payload.certifications_required.map((c) => sanitizeString(c, 80))
      : [],
    shipping_port: sanitizeString(payload.shipping_port, 120),
    timeline_days: sanitizeString(payload.timeline_days, 40),
    status: 'open',
    created_at: new Date().toISOString(),
  }

  requirements.push(requirement)
  await writeJson(FILE, requirements)
  await trackTransition(requirement.id, 'none', 'requirement_created', { buyer_id: buyerId })

  const matches = await generateMatchesForRequirement(requirement)
  if (matches.length) {
    requirement.status = 'matched'
    await writeJson(FILE, requirements.map((r) => (r.id === requirement.id ? requirement : r)))
    await trackTransition(requirement.id, 'requirement_created', 'matched', { matches: matches.length })
  }

  return { requirement, matches }
}

export async function listRequirements(filters = {}) {
  const requirements = await readJson(FILE)
  return requirements.filter((r) => {
    if (filters.buyerId && r.buyer_id !== filters.buyerId) return false
    if (filters.status && r.status !== filters.status) return false
    return true
  })
}

export async function getRequirementById(id) {
  const requirements = await readJson(FILE)
  return requirements.find((r) => r.id === id)
}

export async function closeRequirement(id) {
  const requirements = await readJson(FILE)
  const idx = requirements.findIndex((r) => r.id === id)
  if (idx < 0) return null
  const prev = requirements[idx].status
  requirements[idx].status = 'closed'
  await writeJson(FILE, requirements)
  await trackTransition(id, prev, 'closed')
  return requirements[idx]
}

export async function removeRequirement(id) {
  const requirements = await readJson(FILE)
  const next = requirements.filter((r) => r.id !== id)
  if (next.length === requirements.length) return false
  await writeJson(FILE, next)
  return true
}
