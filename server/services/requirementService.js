import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { logInfo } from '../utils/logger.js'
import { emitNotificationsForEntity } from './notificationService.js'
import { recordMilestone } from './ratingsService.js'
import { moderateTextOrRedact } from './policyService.js'

const FILE = 'requirements.json'

function buildRequirementSummary(requirement) {
  if (!requirement) return ''
  const parts = []
  const push = (label, value) => {
    const safe = sanitizeString(value || '', 160)
    if (!safe) return
    parts.push(label ? `${label}: ${safe}` : safe)
  }

  push('', requirement.title || requirement.category)
  push('Category', requirement.category)
  push('Quantity', requirement.quantity)
  push('MOQ', requirement.moq)
  push('Price', requirement.price_range)
  push('Material', requirement.material)
  push('GSM', requirement.fabric_gsm)
  push('Size', requirement.size_range)
  push('Color', requirement.color_pantone)
  push('Customization', requirement.customization_capabilities)
  push('Techpack', requirement.techpack_accepted ? 'Accepted' : '')
  push('Sample lead time', requirement.sample_lead_time_days || requirement.sample_timeline)
  push('Lead time', requirement.delivery_timeline || requirement.timeline_days)
  push('Incoterms', requirement.incoterms)
  if (Array.isArray(requirement.certifications_required) && requirement.certifications_required.length > 0) {
    push('Certifications', requirement.certifications_required.join(', '))
  }
  push('Compliance', requirement.compliance_details || requirement.compliance_notes)
  return parts.filter(Boolean).slice(0, 12).join(' | ')
}

function normalizeRequirement(buyerId, payload) {
  const title = sanitizeString(payload.title || payload.request_title || payload.category, 160)
  const normalized = {
    id: crypto.randomUUID(),
    buyer_id: buyerId,
    title,
    // Structured fields (Phase 2). Older UI will continue to use category/material/quantity/etc.
    product: sanitizeString(payload.product || payload.category, 120),
    industry: sanitizeString(payload.industry || payload.industry_type || '', 80),
    category: sanitizeString(payload.category, 120),
    target_market: sanitizeString(payload.target_market || payload.target || '', 80),
    quantity: sanitizeString(payload.quantity, 40),
    moq: sanitizeString(payload.moq || payload.moq_qty || '', 40),
    price_range: sanitizeString(payload.price_range || payload.target_price, 80),
    material: sanitizeString(payload.material || payload.fabric_type, 120),
    fabric_gsm: sanitizeString(payload.fabric_gsm || payload.gsm || '', 40),
    timeline_days: sanitizeString(payload.timeline_days, 40),
    delivery_timeline: sanitizeString(payload.delivery_timeline || payload.delivery || payload.deadline || '', 80),
    certifications_required: Array.isArray(payload.certifications_required) ? payload.certifications_required.map((c) => sanitizeString(c, 80)) : [],
    shipping_terms: sanitizeString(payload.shipping_terms || payload.shipping_port, 120),
    incoterms: sanitizeString(payload.incoterms || '', 80),
    payment_terms: sanitizeString(payload.payment_terms || '', 120),
    document_ready: sanitizeString(payload.document_ready || '', 80),
    audit_date: sanitizeString(payload.audit_date || '', 80),
    language_support: sanitizeString(payload.language_support || '', 120),
    capacity_min: sanitizeString(payload.capacity_min || '', 80),
    trims_wash: sanitizeString(payload.trims_wash || payload.trims || payload.wash || '', 200),
    sample_timeline: sanitizeString(payload.sample_timeline || '', 120),
    sample_available: sanitizeString(payload.sample_available || '', 40),
    sample_lead_time_days: sanitizeString(payload.sample_lead_time_days || '', 40),
    packaging: sanitizeString(payload.packaging || '', 200),
    compliance_notes: sanitizeString(payload.compliance_notes || '', 400),
    compliance_details: sanitizeString(payload.compliance_details || '', 400),
    custom_description: sanitizeString(payload.custom_description || '', 1500),
    size_range: sanitizeString(payload.size_range || payload.size_chart || '', 120),
    color_pantone: sanitizeString(payload.color_pantone || payload.colors || '', 120),
    customization_capabilities: sanitizeString(payload.customization_capabilities || payload.customization || '', 240),
    techpack_accepted: Boolean(payload.techpack_accepted),
    // Lead ownership / assignment (Buying House flow).
    assigned_agent_id: sanitizeString(payload.assigned_agent_id || '', 120),
    assigned_at: sanitizeString(payload.assigned_at || '', 40),
    assigned_by: sanitizeString(payload.assigned_by || '', 120),
    status: 'open',
    created_at: new Date().toISOString(),
  }
  normalized.ai_summary = buildRequirementSummary(normalized)
  return normalized
}

export async function createRequirement(buyerId, payload) {
  const requirements = await readJson(FILE)
  const requirement = normalizeRequirement(buyerId, payload)

  // Trust & safety (project.md): auto-remove outside-contact sharing or obscene text.
  // We moderate the free-text fields that are most likely to contain contact details.
  try {
    const users = await readJson('users.json')
    const actor = users.find((u) => String(u.id) === String(buyerId)) || null
    if (actor) {
      const moderated = await moderateTextOrRedact({
        actor,
        text: requirement.custom_description,
        entity_type: 'buyer_request',
        entity_id: requirement.id,
      })
      requirement.custom_description = moderated.text
      requirement.moderated = Boolean(moderated.moderated)
      requirement.moderation_reason = moderated.reason || ''
    }
  } catch {
    // silent: never block creation due to moderation pipeline failures
  }

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
  const actorRole = String(actor?.role || '').toLowerCase()
  const canAssign = actorRole === 'buying_house' || actorRole === 'owner' || actorRole === 'admin'

  const requestedAssignedAgentId = patch.assigned_agent_id !== undefined ? sanitizeString(patch.assigned_agent_id || '', 120) : undefined
  const assignmentChanged = requestedAssignedAgentId !== undefined && requestedAssignedAgentId !== String(previous.assigned_agent_id || '')
  if (assignmentChanged && !canAssign) return 'forbidden'

  const next = {
    ...previous,
    title: patch.title !== undefined ? sanitizeString(patch.title, 160) : (previous.title || ''),
    product: patch.product !== undefined ? sanitizeString(patch.product, 120) : (previous.product || ''),
    category: patch.category !== undefined ? sanitizeString(patch.category, 120) : requirements[idx].category,
    industry: patch.industry !== undefined ? sanitizeString(patch.industry, 80) : (previous.industry || ''),
    target_market: patch.target_market !== undefined ? sanitizeString(patch.target_market, 80) : (previous.target_market || ''),
    quantity: patch.quantity !== undefined ? sanitizeString(patch.quantity, 40) : requirements[idx].quantity,
    price_range: patch.price_range !== undefined ? sanitizeString(patch.price_range, 80) : requirements[idx].price_range,
    material: patch.material !== undefined ? sanitizeString(patch.material, 120) : requirements[idx].material,
    moq: patch.moq !== undefined ? sanitizeString(patch.moq, 40) : (previous.moq || ''),
    fabric_gsm: patch.fabric_gsm !== undefined ? sanitizeString(patch.fabric_gsm, 40) : (previous.fabric_gsm || ''),
    timeline_days: patch.timeline_days !== undefined ? sanitizeString(patch.timeline_days, 40) : requirements[idx].timeline_days,
    delivery_timeline: patch.delivery_timeline !== undefined ? sanitizeString(patch.delivery_timeline, 80) : (previous.delivery_timeline || ''),
    certifications_required: patch.certifications_required !== undefined
      ? (Array.isArray(patch.certifications_required) ? patch.certifications_required.map((c) => sanitizeString(c, 80)) : [])
      : requirements[idx].certifications_required,
    shipping_terms: patch.shipping_terms !== undefined ? sanitizeString(patch.shipping_terms, 120) : requirements[idx].shipping_terms,
    incoterms: patch.incoterms !== undefined ? sanitizeString(patch.incoterms, 80) : (previous.incoterms || ''),
    payment_terms: patch.payment_terms !== undefined ? sanitizeString(patch.payment_terms, 120) : (previous.payment_terms || ''),
    document_ready: patch.document_ready !== undefined ? sanitizeString(patch.document_ready, 80) : (previous.document_ready || ''),
    audit_date: patch.audit_date !== undefined ? sanitizeString(patch.audit_date, 80) : (previous.audit_date || ''),
    language_support: patch.language_support !== undefined ? sanitizeString(patch.language_support, 120) : (previous.language_support || ''),
    capacity_min: patch.capacity_min !== undefined ? sanitizeString(patch.capacity_min, 80) : (previous.capacity_min || ''),
    trims_wash: patch.trims_wash !== undefined ? sanitizeString(patch.trims_wash, 200) : (previous.trims_wash || ''),
    sample_timeline: patch.sample_timeline !== undefined ? sanitizeString(patch.sample_timeline, 120) : (previous.sample_timeline || ''),
    sample_available: patch.sample_available !== undefined ? sanitizeString(patch.sample_available, 40) : (previous.sample_available || ''),
    sample_lead_time_days: patch.sample_lead_time_days !== undefined ? sanitizeString(patch.sample_lead_time_days, 40) : (previous.sample_lead_time_days || ''),
    packaging: patch.packaging !== undefined ? sanitizeString(patch.packaging, 200) : (previous.packaging || ''),
    compliance_notes: patch.compliance_notes !== undefined ? sanitizeString(patch.compliance_notes, 400) : (previous.compliance_notes || ''),
    compliance_details: patch.compliance_details !== undefined ? sanitizeString(patch.compliance_details, 400) : (previous.compliance_details || ''),
    custom_description: patch.custom_description !== undefined ? sanitizeString(patch.custom_description, 1500) : requirements[idx].custom_description,
    size_range: patch.size_range !== undefined ? sanitizeString(patch.size_range, 120) : (previous.size_range || ''),
    color_pantone: patch.color_pantone !== undefined ? sanitizeString(patch.color_pantone, 120) : (previous.color_pantone || ''),
    customization_capabilities: patch.customization_capabilities !== undefined ? sanitizeString(patch.customization_capabilities, 240) : (previous.customization_capabilities || ''),
    techpack_accepted: patch.techpack_accepted !== undefined ? Boolean(patch.techpack_accepted) : Boolean(previous.techpack_accepted),
    status: patch.status !== undefined ? sanitizeString(patch.status, 20) : requirements[idx].status,
    assigned_agent_id: assignmentChanged ? requestedAssignedAgentId : sanitizeString(previous.assigned_agent_id || '', 120),
    assigned_at: assignmentChanged ? new Date().toISOString() : sanitizeString(previous.assigned_at || '', 40),
    assigned_by: assignmentChanged ? sanitizeString(actor.id || '', 120) : sanitizeString(previous.assigned_by || '', 120),
  }

  next.ai_summary = buildRequirementSummary(next)

  // Trust & safety moderation for updated free-text fields.
  try {
    if (patch.custom_description !== undefined) {
      const moderated = await moderateTextOrRedact({
        actor,
        text: next.custom_description,
        entity_type: 'buyer_request',
        entity_id: next.id,
      })
      next.custom_description = moderated.text
      next.moderated = Boolean(moderated.moderated)
      next.moderation_reason = moderated.reason || ''
    }
  } catch {
    // silent
  }

  requirements[idx] = next
  await writeJson(FILE, requirements)
  // project.md: smart notifications trigger when new matching buyer requests appear.
  // Emit on updates as well so edited requests can match saved alerts.
  await emitNotificationsForEntity('buyer_request', next)

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
