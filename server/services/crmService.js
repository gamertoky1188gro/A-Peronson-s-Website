import { readJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { isOwnerOrAdmin } from '../utils/permissions.js'

function buildOrgMemberIds(users = [], orgId = '') {
  const members = new Set()
  if (!orgId) return members
  members.add(String(orgId))
  users.forEach((u) => {
    if (String(u.org_owner_id || '') === String(orgId)) members.add(String(u.id))
  })
  return members
}

function canViewCrm(actor, targetUser) {
  if (!actor || !targetUser) return false
  if (isOwnerOrAdmin(actor)) return true
  const actorId = String(actor.id || '')
  if (actorId && actorId === String(targetUser.id || '')) return true
  if (actor.role === 'agent' && String(actor.org_owner_id || '') === String(targetUser.id || '')) return true
  return false
}

function compactThreadSummary(messages = []) {
  const byMatch = new Map()
  messages.forEach((msg) => {
    const matchId = String(msg.match_id || '')
    if (!matchId) return
    if (!byMatch.has(matchId)) {
      byMatch.set(matchId, { match_id: matchId, last_message_at: msg.timestamp || msg.created_at || '', message_count: 0 })
    }
    const entry = byMatch.get(matchId)
    entry.message_count += 1
    const ts = String(msg.timestamp || msg.created_at || '')
    if (!entry.last_message_at || ts > entry.last_message_at) {
      entry.last_message_at = ts
    }
  })
  return [...byMatch.values()]
    .sort((a, b) => String(b.last_message_at || '').localeCompare(String(a.last_message_at || '')))
}

export async function getCrmProfileSummary(actor, targetId) {
  const safeTarget = sanitizeString(String(targetId || ''), 120)
  if (!safeTarget) return { error: 'Target id required' }

  const [users, messages, calls, documents, leads] = await Promise.all([
    readJson('users.json'),
    readJson('messages.json'),
    readJson('call_sessions.json'),
    readJson('documents.json'),
    readJson('leads.json'),
  ])

  const targetUser = (Array.isArray(users) ? users : []).find((u) => String(u.id) === safeTarget) || null
  if (!targetUser) return { error: 'Target user not found' }
  if (!canViewCrm(actor, targetUser)) return { error: 'forbidden' }

  const orgId = String(targetUser.id || '')
  const orgMembers = buildOrgMemberIds(users, orgId)

  const messageRows = (Array.isArray(messages) ? messages : []).filter((m) => {
    const matchId = String(m.match_id || '')
    const senderId = String(m.sender_id || '')
    if (orgMembers.has(senderId)) return true
    if (matchId.endsWith(`:${orgId}`)) return true
    if (matchId.startsWith('friend:') && orgMembers.has(senderId)) return true
    return false
  })

  const threads = compactThreadSummary(messageRows).slice(0, 8)

  const callRows = (Array.isArray(calls) ? calls : []).filter((c) => {
    const participants = Array.isArray(c.participant_ids) ? c.participant_ids.map(String) : []
    return participants.some((id) => orgMembers.has(id))
  })
  const callItems = callRows
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
    .slice(0, 6)

  const contractRows = (Array.isArray(documents) ? documents : [])
    .filter((d) => String(d.entity_type || '').toLowerCase() === 'contract')
    .filter((d) => String(d.buyer_id || '') === orgId || String(d.factory_id || '') === orgId)
  const contractItems = contractRows
    .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))
    .slice(0, 6)

  const leadRows = (Array.isArray(leads) ? leads : [])
    .filter((l) => String(l.org_owner_id || '') === orgId)
    .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))

  const leadStatusCounts = leadRows.reduce((acc, lead) => {
    const key = String(lead.status || 'new')
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return {
    org_id: orgId,
    role: targetUser.role || '',
    leads: {
      total: leadRows.length,
      by_status: leadStatusCounts,
      latest: leadRows.slice(0, 6),
    },
    messages: {
      total_threads: threads.length,
      threads,
    },
    calls: {
      total: callRows.length,
      items: callItems,
    },
    contracts: {
      total: contractRows.length,
      items: contractItems,
    },
  }
}
