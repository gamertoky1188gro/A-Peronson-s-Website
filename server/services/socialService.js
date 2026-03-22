import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { moderateTextOrRedact } from './policyService.js'
import { createReport } from './reportService.js'
import { createNotification } from './notificationService.js'
import { getRequirementById } from './requirementService.js'

const FILE = 'social_interactions.json'

export async function addComment(user, entityType, entityId, text) {
  const all = await readJson(FILE)
  let safeText = sanitizeString(text, 800)

  try {
    const moderated = await moderateTextOrRedact({
      actor: user,
      text: safeText,
      entity_type: 'comment',
      entity_id: `${sanitizeString(entityType, 60)}:${sanitizeString(entityId, 120)}`,
    })
    safeText = moderated.text
  } catch {
    // silent
  }

  const row = {
    id: crypto.randomUUID(),
    interaction_type: 'comment',
    entity_type: sanitizeString(entityType, 60),
    entity_id: sanitizeString(entityId, 120),
    actor_id: user.id,
    actor_name: user.name,
    actor_verified: Boolean(user.verified),
    text: safeText,
    created_at: new Date().toISOString(),
  }
  all.push(row)
  await writeJson(FILE, all)

  if (String(entityType || '').toLowerCase() === 'buyer_request') {
    try {
      const requirement = await getRequirementById(entityId)
      const users = await readJson('users.json')
      const category = String(requirement?.category || '').toLowerCase()
      const industry = String(requirement?.industry || '').toLowerCase()
      const targets = users.filter((u) => {
        const role = String(u?.role || '').toLowerCase()
        if (!u?.verified) return false
        if (!(role === 'factory' || role === 'buying_house')) return false
        if (!category && !industry) return true
        const profile = u?.profile || {}
        const categories = Array.isArray(profile?.categories) ? profile.categories.map((c) => String(c || '').toLowerCase()) : []
        const profileIndustry = String(profile?.industry || '').toLowerCase()
        return (category && categories.includes(category)) || (industry && profileIndustry === industry)
      })
      await Promise.all(targets.map((target) => createNotification(target.id, {
        type: 'buyer_request_comment',
        entity_type: 'buyer_request',
        entity_id: entityId,
        message: `New comment on buyer request "${requirement?.title || requirement?.category || 'Request'}".`,
        meta: {
          request_id: entityId,
          category: requirement?.category || '',
          industry: requirement?.industry || '',
          actor_id: user?.id,
          comment_id: row.id,
        },
      })))
    } catch {
      // non-blocking
    }
  }

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

  if (String(action || '').toLowerCase() === 'report') {
    await createReport({
      actor: user,
      entity_type: sanitizeString(entityType, 60),
      entity_id: sanitizeString(entityId, 120),
      reason: reason || 'Reported content',
      metadata: { interaction_id: row.id },
    })
  }

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
