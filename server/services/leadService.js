import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { forbiddenError, isAgent, isOwnerOrAdmin } from '../utils/permissions.js'

const LEADS_FILE = 'leads.json'
const NOTES_FILE = 'lead_notes.json'
const REMINDERS_FILE = 'lead_reminders.json'
const USERS_FILE = 'users.json'
const REQUIREMENTS_FILE = 'requirements.json'

const LEAD_STATUSES = new Set([
  'new',
  'contacted',
  'negotiating',
  'sample_sent',
  'order_confirmed',
  'closed',
])

export const LEAD_STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  negotiating: 'Negotiating',
  sample_sent: 'Sample Sent',
  order_confirmed: 'Order Confirmed',
  closed: 'Closed',
}

function normalizeStatus(value, fallback = 'new') {
  const status = sanitizeString(String(value || ''), 40).toLowerCase().replace(/\s+/g, '_')
  return LEAD_STATUSES.has(status) ? status : fallback
}

function parseFriendMatchId(matchId = '') {
  const parts = String(matchId).split(':')
  if (parts.length !== 3 || parts[0] !== 'friend') return null
  const first = sanitizeString(parts[1], 120)
  const second = sanitizeString(parts[2], 120)
  if (!first || !second) return null
  return [first, second]
}

function parseMarketplaceMatchId(matchId = '') {
  // Marketplace threads use the format `${requirementId}:${factoryOrSupplierId}`.
  const parts = String(matchId).split(':')
  if (parts.length !== 2) return null
  const requirementId = sanitizeString(parts[0], 120)
  const supplierId = sanitizeString(parts[1], 120)
  if (!requirementId || !supplierId) return null
  return { requirementId, supplierId }
}

async function resolveBuyerId(requirementId) {
  if (!requirementId) return ''
  const requirements = await readJson(REQUIREMENTS_FILE)
  const requirement = requirements.find((row) => String(row?.id || '') === String(requirementId)) || null
  return sanitizeString(requirement?.buyer_id || requirement?.buyerId || '', 120)
}

function actorOrgOwnerId(actor) {
  if (!actor) return ''
  if (isAgent(actor)) return sanitizeString(actor.org_owner_id || '', 120)
  return sanitizeString(actor.id || '', 120)
}

function canAccessLead(actor, lead) {
  if (!actor || !lead) return false
  if (isOwnerOrAdmin(actor)) return true

  const actorId = String(actor.id || '')
  const orgId = actorOrgOwnerId(actor)
  if (orgId && String(lead.org_owner_id || '') !== orgId) return false

  if (isAgent(actor)) {
    return String(lead.assigned_agent_id || '') === actorId
  }

  return true
}

function ensureLeadAccess(actor, lead) {
  if (canAccessLead(actor, lead)) return
  throw forbiddenError()
}

function ensureLeadWriteAccess(actor, lead) {
  if (!actor || !lead) throw forbiddenError()
  if (isOwnerOrAdmin(actor)) return

  const orgId = actorOrgOwnerId(actor)
  if (!orgId || String(lead.org_owner_id || '') !== orgId) throw forbiddenError()

  if (isAgent(actor)) {
    // Agents can only update/annotate their assigned leads.
    if (String(lead.assigned_agent_id || '') !== String(actor.id || '')) throw forbiddenError()
    return
  }
}

function pickCounterparty({ buyerId, supplierId, orgOwnerId, friendPair }) {
  if (Array.isArray(friendPair)) {
    return friendPair.find((id) => id !== orgOwnerId) || ''
  }

  if (orgOwnerId === supplierId) return buyerId || ''
  if (orgOwnerId === buyerId) return supplierId || ''
  return buyerId || supplierId || ''
}

export async function upsertLeadFromMessage({ match_id, sender_id, timestamp }) {
  const matchId = sanitizeString(match_id || '', 240)
  const senderId = sanitizeString(sender_id || '', 120)
  if (!matchId) return null

  const users = await readJson(USERS_FILE)
  const usersById = new Map(users.map((u) => [u.id, u]))
  const sender = usersById.get(senderId) || null

  const friendPair = parseFriendMatchId(matchId)
  const marketplace = friendPair ? null : parseMarketplaceMatchId(matchId)
  const buyerId = marketplace ? await resolveBuyerId(marketplace.requirementId) : ''
  const supplierId = marketplace ? marketplace.supplierId : ''

  const orgTargets = new Map()

  // If an agent sends a message, it should become a lead for their owning org.
  if (sender?.role === 'agent' && sender.org_owner_id) {
    orgTargets.set(sender.org_owner_id, { assigned_agent_id: sender.id })
  }

  // Marketplace supplier side (factory/buying_house account id in match id).
  const supplierUser = supplierId ? usersById.get(supplierId) : null
  if (supplierUser && ['factory', 'buying_house'].includes(String(supplierUser.role || '').toLowerCase())) {
    orgTargets.set(supplierUser.id, orgTargets.get(supplierUser.id) || {})
  }

  // If buyer side is an org (rare), allow CRM for that org too.
  const buyerUser = buyerId ? usersById.get(buyerId) : null
  if (buyerUser && ['factory', 'buying_house'].includes(String(buyerUser.role || '').toLowerCase())) {
    orgTargets.set(buyerUser.id, orgTargets.get(buyerUser.id) || {})
  }

  // Friend threads: create lead for any org-like participant (factory/buying_house) or agent owner.
  if (Array.isArray(friendPair)) {
    friendPair.forEach((id) => {
      const u = usersById.get(id)
      if (!u) return
      const role = String(u.role || '').toLowerCase()
      if (role === 'factory' || role === 'buying_house') orgTargets.set(u.id, orgTargets.get(u.id) || {})
    })
  }

  if (orgTargets.size === 0) return null

  const leads = await readJson(LEADS_FILE)
  const now = new Date().toISOString()
  const interactionAt = sanitizeString(timestamp || now, 64) || now
  const updated = []

  for (const [orgOwnerId, extras] of orgTargets.entries()) {
    const orgId = sanitizeString(String(orgOwnerId || ''), 120)
    if (!orgId) continue

    const existingIndex = leads.findIndex((lead) => String(lead.org_owner_id || '') === orgId && String(lead.match_id || '') === matchId)
    const counterpartyId = pickCounterparty({ buyerId, supplierId, orgOwnerId: orgId, friendPair })

    if (existingIndex >= 0) {
      const current = leads[existingIndex]
      leads[existingIndex] = {
        ...current,
        counterparty_id: current.counterparty_id || counterpartyId,
        assigned_agent_id: extras.assigned_agent_id || current.assigned_agent_id || '',
        last_interaction_at: interactionAt,
        updated_at: now,
      }
      updated.push(leads[existingIndex])
      continue
    }

    const row = {
      id: crypto.randomUUID(),
      org_owner_id: orgId,
      match_id: matchId,
      counterparty_id: counterpartyId,
      source: 'message',
      status: 'new',
      assigned_agent_id: extras.assigned_agent_id || '',
      created_at: now,
      updated_at: now,
      last_interaction_at: interactionAt,
    }
    leads.push(row)
    updated.push(row)
  }

  await writeJson(LEADS_FILE, leads)
  return updated
}

export async function listLeads(actor) {
  const leads = await readJson(LEADS_FILE)
  if (isOwnerOrAdmin(actor)) return leads.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))

  const orgId = actorOrgOwnerId(actor)
  const filtered = leads.filter((lead) => String(lead.org_owner_id || '') === orgId)

  if (isAgent(actor)) {
    return filtered
      .filter((lead) => String(lead.assigned_agent_id || '') === String(actor.id || ''))
      .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  }

  return filtered.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
}

export async function getLeadById(actor, leadId) {
  const id = sanitizeString(String(leadId || ''), 120)
  const leads = await readJson(LEADS_FILE)
  const lead = leads.find((row) => String(row.id) === id) || null
  if (!lead) return null
  ensureLeadAccess(actor, lead)

  const [notes, reminders] = await Promise.all([readJson(NOTES_FILE), readJson(REMINDERS_FILE)])
  return {
    ...lead,
    notes: notes.filter((n) => String(n.lead_id || '') === id).sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || ''))),
    reminders: reminders.filter((r) => String(r.lead_id || '') === id).sort((a, b) => String(a.remind_at || '').localeCompare(String(b.remind_at || ''))),
  }
}

export async function updateLead(actor, leadId, patch = {}) {
  const id = sanitizeString(String(leadId || ''), 120)
  const leads = await readJson(LEADS_FILE)
  const idx = leads.findIndex((row) => String(row.id) === id)
  if (idx < 0) return null

  const current = leads[idx]
  ensureLeadWriteAccess(actor, current)

  const next = {
    ...current,
    status: patch.status !== undefined ? normalizeStatus(patch.status, current.status) : current.status,
    // Main accounts can assign leads to an agent; agents cannot reassign.
    ...(isAgent(actor) ? {} : { assigned_agent_id: patch.assigned_agent_id !== undefined ? sanitizeString(String(patch.assigned_agent_id || ''), 120) : current.assigned_agent_id }),
    updated_at: new Date().toISOString(),
  }

  leads[idx] = next
  await writeJson(LEADS_FILE, leads)
  return next
}

export async function addLeadNote(actor, leadId, noteText) {
  const id = sanitizeString(String(leadId || ''), 120)
  const leads = await readJson(LEADS_FILE)
  const lead = leads.find((row) => String(row.id) === id) || null
  if (!lead) return null
  ensureLeadWriteAccess(actor, lead)

  const notes = await readJson(NOTES_FILE)
  const row = {
    id: crypto.randomUUID(),
    lead_id: id,
    org_owner_id: lead.org_owner_id,
    author_id: String(actor.id || ''),
    note: sanitizeString(String(noteText || ''), 1600),
    created_at: new Date().toISOString(),
  }
  notes.push(row)
  await writeJson(NOTES_FILE, notes)
  return row
}

export async function addLeadReminder(actor, leadId, payload = {}) {
  const id = sanitizeString(String(leadId || ''), 120)
  const leads = await readJson(LEADS_FILE)
  const lead = leads.find((row) => String(row.id) === id) || null
  if (!lead) return null
  ensureLeadWriteAccess(actor, lead)

  const remindAtRaw = payload?.remind_at ? new Date(payload.remind_at) : new Date(Date.now() + 24 * 60 * 60 * 1000)
  const remindAt = Number.isNaN(remindAtRaw.getTime()) ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : remindAtRaw.toISOString()

  const reminders = await readJson(REMINDERS_FILE)
  const row = {
    id: crypto.randomUUID(),
    lead_id: id,
    org_owner_id: lead.org_owner_id,
    created_by: String(actor.id || ''),
    remind_at: remindAt,
    message: sanitizeString(String(payload?.message || 'Follow up'), 240),
    done: false,
    created_at: new Date().toISOString(),
  }
  reminders.push(row)
  await writeJson(REMINDERS_FILE, reminders)
  return row
}

export async function addLeadNoteForMatch({ matchId, orgOwnerId, note, authorId = 'system' }) {
  const safeMatchId = sanitizeString(String(matchId || ''), 200)
  const safeOrgId = sanitizeString(String(orgOwnerId || ''), 120)
  const safeNote = sanitizeString(String(note || ''), 1600)
  const safeAuthor = sanitizeString(String(authorId || 'system'), 120)
  if (!safeMatchId || !safeOrgId || !safeNote) return null

  const leads = await readJson(LEADS_FILE)
  const lead = leads.find((row) =>
    String(row.match_id || '') === safeMatchId && String(row.org_owner_id || '') === safeOrgId
  ) || null
  if (!lead) return null

  const notes = await readJson(NOTES_FILE)
  const row = {
    id: crypto.randomUUID(),
    lead_id: lead.id,
    org_owner_id: lead.org_owner_id,
    author_id: safeAuthor || lead.org_owner_id,
    note: safeNote,
    created_at: new Date().toISOString(),
  }
  notes.push(row)
  await writeJson(NOTES_FILE, notes)
  return row
}
