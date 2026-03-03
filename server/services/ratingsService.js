import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const FILE = 'ratings.json'
const NOTIFICATIONS_FILE = 'notifications.json'
const QUALIFYING_MILESTONES = ['contract_signed', 'communication_completed']
const RECENT_LIMIT = 10

function normalizeProfileKey(profileKey) {
  const value = sanitizeString(profileKey, 160)
  return value || ''
}

function safeNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function emptyStore() {
  return { ratings: [], milestones: [], feedback_requests: [] }
}

async function readStore() {
  const store = await readJson(FILE)
  if (!store || typeof store !== 'object' || Array.isArray(store)) return emptyStore()
  return {
    ratings: Array.isArray(store.ratings) ? store.ratings : [],
    milestones: Array.isArray(store.milestones) ? store.milestones : [],
    feedback_requests: Array.isArray(store.feedback_requests) ? store.feedback_requests : [],
  }
}

async function saveStore(store) {
  await writeJson(FILE, store)
}

async function createFeedbackRequestNotification(counterpartyId, profileKey) {
  const notifications = await readJson(NOTIFICATIONS_FILE)
  notifications.push({
    id: crypto.randomUUID(),
    user_id: counterpartyId,
    type: 'rating_feedback_request',
    entity_type: 'profile',
    entity_id: profileKey,
    message: 'A completed interaction qualifies for feedback. Please submit a rating.',
    read: false,
    created_at: new Date().toISOString(),
  })
  await writeJson(NOTIFICATIONS_FILE, notifications)
}

function sortByCreatedAtDesc(rows) {
  return [...rows].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
}

function computeBreakdown(ratings) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const rating of ratings) {
    const value = Math.min(5, Math.max(1, Math.round(safeNumber(rating.score, 0))))
    counts[value] += 1
  }
  return counts
}

function computeReliability(ratings) {
  if (!ratings.length) {
    return { confidence: 'low', verified_counterparty_ratio: 0, qualified_interaction_ratio: 0, recent_volume: 0 }
  }

  let verifiedCounterparty = 0
  let qualifiedInteraction = 0
  const recent = sortByCreatedAtDesc(ratings).slice(0, 30)

  for (const row of ratings) {
    if (row.reliability_flags?.verified_counterparty) verifiedCounterparty += 1
    if (row.reliability_flags?.qualified_milestone_pair) qualifiedInteraction += 1
  }

  const verifiedRatio = verifiedCounterparty / ratings.length
  const qualifiedRatio = qualifiedInteraction / ratings.length
  const recentVolume = recent.length
  const confidence = ratings.length >= 20 && verifiedRatio >= 0.6 ? 'high' : ratings.length >= 8 ? 'medium' : 'low'

  return {
    confidence,
    verified_counterparty_ratio: Number(verifiedRatio.toFixed(2)),
    qualified_interaction_ratio: Number(qualifiedRatio.toFixed(2)),
    recent_volume: recentVolume,
  }
}

export async function recordMilestone({ profileKey, counterpartyId, interactionType, milestone, actorId }) {
  const normalizedProfile = normalizeProfileKey(profileKey)
  const normalizedCounterparty = sanitizeString(counterpartyId, 120)
  const normalizedInteractionType = sanitizeString(interactionType || 'deal', 40)
  const normalizedMilestone = sanitizeString(milestone, 60)

  if (!normalizedProfile || !normalizedCounterparty || !normalizedMilestone) return null

  const store = await readStore()
  const now = new Date().toISOString()
  const existingIndex = store.milestones.findIndex((row) =>
    row.profile_key === normalizedProfile
      && row.counterparty_id === normalizedCounterparty
      && row.interaction_type === normalizedInteractionType
      && row.milestone === normalizedMilestone)

  if (existingIndex >= 0) {
    store.milestones[existingIndex] = {
      ...store.milestones[existingIndex],
      status: 'completed',
      completed_at: now,
      updated_at: now,
      updated_by: actorId,
    }
  } else {
    store.milestones.push({
      id: crypto.randomUUID(),
      profile_key: normalizedProfile,
      counterparty_id: normalizedCounterparty,
      interaction_type: normalizedInteractionType,
      milestone: normalizedMilestone,
      status: 'completed',
      completed_at: now,
      created_at: now,
      updated_at: now,
      updated_by: actorId,
    })
  }

  const completed = store.milestones
    .filter((row) => row.profile_key === normalizedProfile && row.counterparty_id === normalizedCounterparty && row.status === 'completed')
    .map((row) => row.milestone)
  const qualifies = QUALIFYING_MILESTONES.every((name) => completed.includes(name))

  let feedbackRequest = null
  if (qualifies) {
    const existingRequest = store.feedback_requests.find((row) =>
      row.profile_key === normalizedProfile
        && row.counterparty_id === normalizedCounterparty
        && row.status === 'pending')

    if (!existingRequest) {
      feedbackRequest = {
        id: crypto.randomUUID(),
        profile_key: normalizedProfile,
        counterparty_id: normalizedCounterparty,
        interaction_type: normalizedInteractionType,
        milestones: QUALIFYING_MILESTONES,
        status: 'pending',
        triggered_by: actorId,
        created_at: now,
      }
      store.feedback_requests.push(feedbackRequest)
      await createFeedbackRequestNotification(normalizedCounterparty, normalizedProfile)
    }
  }

  await saveStore(store)
  return { feedback_request: feedbackRequest, qualifies }
}

export async function createRating({ profileKey, fromUserId, interactionType, score, comment = '', reliabilityFlags = {} }) {
  const normalizedProfile = normalizeProfileKey(profileKey)
  const normalizedFrom = sanitizeString(fromUserId, 120)
  const normalizedInteractionType = sanitizeString(interactionType || 'deal', 40)
  const normalizedComment = sanitizeString(comment, 500)
  const numericScore = Math.min(5, Math.max(1, Math.round(safeNumber(score, 0))))

  if (!normalizedProfile || !normalizedFrom || !numericScore) {
    const err = new Error('profile_key, from_user_id and score are required')
    err.status = 400
    throw err
  }

  const store = await readStore()
  const pendingIdx = store.feedback_requests.findIndex((row) => row.profile_key === normalizedProfile && row.counterparty_id === normalizedFrom && row.status === 'pending')
  if (pendingIdx >= 0) {
    store.feedback_requests[pendingIdx].status = 'fulfilled'
    store.feedback_requests[pendingIdx].fulfilled_at = new Date().toISOString()
  }

  const rating = {
    id: crypto.randomUUID(),
    profile_key: normalizedProfile,
    from_user_id: normalizedFrom,
    interaction_type: normalizedInteractionType,
    score: numericScore,
    comment: normalizedComment,
    reliability_flags: {
      verified_counterparty: Boolean(reliabilityFlags.verified_counterparty),
      qualified_milestone_pair: Boolean(reliabilityFlags.qualified_milestone_pair),
    },
    created_at: new Date().toISOString(),
  }

  store.ratings.push(rating)
  await saveStore(store)
  return rating
}

export async function getProfileRatingsSummary(profileKey) {
  const normalizedProfile = normalizeProfileKey(profileKey)
  const store = await readStore()
  const ratings = sortByCreatedAtDesc(store.ratings.filter((row) => row.profile_key === normalizedProfile))
  const recent = ratings.slice(0, RECENT_LIMIT)
  const totalCount = ratings.length
  const average = totalCount ? ratings.reduce((sum, row) => sum + safeNumber(row.score, 0), 0) / totalCount : 0
  const recentAverage = recent.length ? recent.reduce((sum, row) => sum + safeNumber(row.score, 0), 0) / recent.length : 0

  return {
    profile_key: normalizedProfile,
    aggregate: {
      average_score: Number(average.toFixed(2)),
      recent_average_score: Number(recentAverage.toFixed(2)),
      total_count: totalCount,
      reliability: computeReliability(ratings),
    },
    breakdown: computeBreakdown(ratings),
    recent_reviews: recent.slice(0, 5).map((row) => ({
      id: row.id,
      score: row.score,
      comment: row.comment,
      interaction_type: row.interaction_type,
      created_at: row.created_at,
    })),
    feedback_requests: store.feedback_requests.filter((row) => row.profile_key === normalizedProfile && row.status === 'pending').length,
  }
}

export async function getRatingsForProfiles(profileKeys = []) {
  const keys = [...new Set((Array.isArray(profileKeys) ? profileKeys : []).map(normalizeProfileKey).filter(Boolean))]
  const result = {}
  for (const key of keys) {
    result[key] = await getProfileRatingsSummary(key)
  }
  return result
}
