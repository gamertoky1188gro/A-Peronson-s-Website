import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { logInfo } from '../utils/logger.js'
import { emitNotificationsForEntity } from './notificationService.js'
import { recordMilestone } from './ratingsService.js'

const FILE = 'requirements.json'

function normalizeRequirement(buyerId, payload) {
  return {
    id: crypto.randomUUID(),
    buyer_id: buyerId,
    category: sanitizeString(payload.category, 120),
    quantity: sanitizeString(payload.quantity, 40),
    price_range: sanitizeString(payload.price_range || payload.target_price, 80),
    material: sanitizeString(payload.material || payload.fabric_type, 120),
    timeline_days: sanitizeString(payload.timeline_days, 40),
    certifications_required: Array.isArray(payload.certifications_required) ? payload.certifications_required.map((c) => sanitizeString(c, 80)) : [],
    shipping_terms: sanitizeString(payload.shipping_terms || payload.shipping_port, 120),
    custom_description: sanitizeString(payload.custom_description || '', 1500),
    status: 'open',
    created_at: new Date().toISOString(),
  }
}

export async function createRequirement(buyerId, payload) {
  const requirements = await readJson(FILE)
  const requirement = normalizeRequirement(buyerId, payload)
  requirements.push(requirement)
  await writeJson(FILE, requirements)
  await emitNotificationsForEntity('buyer_request', requirement)
  logInfo('Buyer request created', { requirement_id: requirement.id, buyer_id: buyerId, at: requirement.created_at })
  return requirement
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

export async function updateRequirement(requirementId, patch, actor) {
  const requirements = await readJson(FILE)
  const idx = requirements.findIndex((r) => r.id === requirementId)
  if (idx < 0) return null
  if (actor.role === 'buyer' && requirements[idx].buyer_id !== actor.id) return 'forbidden'

  const previous = requirements[idx]
  const next = {
    ...previous,
    category: patch.category !== undefined ? sanitizeString(patch.category, 120) : requirements[idx].category,
    quantity: patch.quantity !== undefined ? sanitizeString(patch.quantity, 40) : requirements[idx].quantity,
    price_range: patch.price_range !== undefined ? sanitizeString(patch.price_range, 80) : requirements[idx].price_range,
    material: patch.material !== undefined ? sanitizeString(patch.material, 120) : requirements[idx].material,
    timeline_days: patch.timeline_days !== undefined ? sanitizeString(patch.timeline_days, 40) : requirements[idx].timeline_days,
    certifications_required: patch.certifications_required !== undefined
      ? (Array.isArray(patch.certifications_required) ? patch.certifications_required.map((c) => sanitizeString(c, 80)) : [])
      : requirements[idx].certifications_required,
    shipping_terms: patch.shipping_terms !== undefined ? sanitizeString(patch.shipping_terms, 120) : requirements[idx].shipping_terms,
    custom_description: patch.custom_description !== undefined ? sanitizeString(patch.custom_description, 1500) : requirements[idx].custom_description,
    status: patch.status !== undefined ? sanitizeString(patch.status, 20) : requirements[idx].status,
  }

  requirements[idx] = next
  await writeJson(FILE, requirements)

  const normalizedStatus = String(next.status || '').toLowerCase()
  const statusTransitioned = normalizedStatus !== String(previous.status || '').toLowerCase()
  if (statusTransitioned && ['deal_completed', 'closed', 'fulfilled', 'completed'].includes(normalizedStatus) && patch?.counterparty_id) {
    await recordMilestone({
      profileKey: `user:${actor.id}`,
      counterpartyId: sanitizeString(patch.counterparty_id, 120),
      interactionType: 'deal',
      milestone: 'deal_completed',
      actorId: actor.id,
    })
  }

  return next
}

export async function removeRequirement(requirementId, actor) {
  const requirements = await readJson(FILE)
  const target = requirements.find((r) => r.id === requirementId)
  if (!target) return false
  if (actor.role === 'buyer' && target.buyer_id !== actor.id) return 'forbidden'
  const next = requirements.filter((r) => r.id !== requirementId)
  await writeJson(FILE, next)
  return true
}
