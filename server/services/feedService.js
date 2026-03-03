import { listRequirements } from './requirementService.js'
import { listProducts } from './productService.js'
import { readJson } from '../utils/jsonStore.js'
import { logInfo } from '../utils/logger.js'

const CATEGORIES = ['Shirts', 'Knitwear', 'Denim', 'Women', 'Kids']

const FEED_BOOST_CONFIG = {
  windowDays: Number(process.env.FEED_BOOST_WINDOW_DAYS || 30),
  decayDays: Number(process.env.FEED_BOOST_DECAY_DAYS || 60),
  maxMultiplier: Number(process.env.FEED_BOOST_MAX_MULTIPLIER || 1.35),
  minProfileCompleteness: Number(process.env.FEED_BOOST_MIN_PROFILE_COMPLETENESS || 0.5),
  minActivityQuality: Number(process.env.FEED_BOOST_MIN_ACTIVITY_QUALITY || 0.4),
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value))
}

function getAuthorId(item) {
  if (item.feed_type === 'buyer_request') return item.buyer_id
  if (item.feed_type === 'company_product') return item.company_id
  return ''
}

function computeProfileCompleteness(user = {}) {
  const profile = user.profile || {}
  const checks = [
    Boolean(user.name),
    Boolean(user.email),
    Boolean(profile.country),
    Array.isArray(profile.certifications) && profile.certifications.length > 0,
    Boolean(profile.bank_proof),
    Boolean(profile.export_license),
    Boolean(profile.monthly_capacity),
    Boolean(profile.moq),
    Boolean(profile.lead_time_days),
  ]

  const completed = checks.filter(Boolean).length
  return checks.length ? completed / checks.length : 0
}

function computeActivityQuality(authorItemIds = [], socialRows = []) {
  if (!authorItemIds.length) return 0.5

  const idSet = new Set(authorItemIds)
  const relevant = socialRows.filter((row) => idSet.has(row.entity_id))

  const positive = relevant.filter((row) => row.interaction_type === 'comment' || row.interaction_type === 'share').length
  const reports = relevant.filter((row) => row.interaction_type === 'report').length

  return (positive + 1) / (positive + reports + 2)
}

function getAccountAgeDays(user = {}) {
  if (!user.created_at) return Number.POSITIVE_INFINITY
  const ageMs = Date.now() - new Date(user.created_at).getTime()
  return Math.max(0, ageMs / (1000 * 60 * 60 * 24))
}

function getAgeBoostMultiplier(accountAgeDays) {
  const { windowDays, decayDays, maxMultiplier } = FEED_BOOST_CONFIG

  if (!Number.isFinite(accountAgeDays)) return 1
  if (accountAgeDays <= windowDays) return maxMultiplier
  if (accountAgeDays <= windowDays + decayDays) {
    const decayProgress = (accountAgeDays - windowDays) / Math.max(1, decayDays)
    const multiplier = 1 + (maxMultiplier - 1) * (1 - decayProgress)
    return Math.max(1, multiplier)
  }

  return 1
}

function calculateRecencyScore(itemCreatedAt) {
  const hoursOld = Math.max(0, (Date.now() - new Date(itemCreatedAt).getTime()) / (1000 * 60 * 60))
  return 1 / (1 + hoursOld / 24)
}

function roundNumber(value) {
  return Number(value.toFixed(4))
}

export async function getCombinedFeed({ unique = false, type = 'all', category = '' }) {
  const requests = type === 'products' ? [] : await listRequirements({ status: 'open' })
  const products = type === 'requests' ? [] : await listProducts({ category })
  const users = await readJson('users.json')
  const socialInteractions = await readJson('social_interactions.json')

  const combined = [
    ...requests.map((r) => ({ ...r, feed_type: 'buyer_request', icon: '💼' })),
    ...products.map((p) => ({ ...p, feed_type: 'company_product', icon: '🏭' })),
  ]

  const itemsByAuthor = combined.reduce((acc, item) => {
    const authorId = getAuthorId(item)
    if (!authorId) return acc
    if (!acc[authorId]) acc[authorId] = []
    acc[authorId].push(item.id)
    return acc
  }, {})

  const ranked = combined.map((item) => {
    const authorId = getAuthorId(item)
    const author = users.find((u) => u.id === authorId) || null
    const profileCompleteness = computeProfileCompleteness(author)
    const activityQuality = computeActivityQuality(itemsByAuthor[authorId] || [], socialInteractions)
    const verifiedContact = Boolean(author?.verified)
    const antiAbuseEligible = profileCompleteness >= FEED_BOOST_CONFIG.minProfileCompleteness
      && verifiedContact
      && activityQuality >= FEED_BOOST_CONFIG.minActivityQuality

    const accountAgeDays = getAccountAgeDays(author)
    const boostMultiplier = antiAbuseEligible ? getAgeBoostMultiplier(accountAgeDays) : 1
    const boostActive = boostMultiplier > 1
    const recencyScore = calculateRecencyScore(item.created_at)
    const rankingScore = recencyScore * boostMultiplier

    return {
      ...item,
      _ranking: {
        ranking_score: rankingScore,
      },
      feed_metadata: {
        boost_active: boostActive,
        ranking_components: {
          recency_score: roundNumber(recencyScore),
          account_age_days: roundNumber(accountAgeDays),
          boost_multiplier: roundNumber(boostMultiplier),
          profile_completeness: roundNumber(clamp01(profileCompleteness)),
          verified_contact: verifiedContact,
          activity_quality_score: roundNumber(clamp01(activityQuality)),
          anti_abuse_eligible: antiAbuseEligible,
        },
      },
    }
  })

  let sortedItems = ranked
    .sort((a, b) => b._ranking.ranking_score - a._ranking.ranking_score)
    .map((item) => {
      const next = { ...item }
      delete next._ranking
      return next
    })

  if (unique) {
    sortedItems = sortedItems.filter((item, idx) => idx % 2 === 0 || CATEGORIES.some((c) => String(item.category || '').toLowerCase().includes(c.toLowerCase())))
  }

  const boostActiveCount = sortedItems.filter((item) => item.feed_metadata?.boost_active).length
  logInfo('Feed ranking components', {
    total_items: sortedItems.length,
    boosted_items: boostActiveCount,
    boost_config: FEED_BOOST_CONFIG,
    ranking_snapshot: sortedItems.slice(0, 20).map((item) => ({
      item_id: item.id,
      feed_type: item.feed_type,
      boost_active: item.feed_metadata?.boost_active,
      ...item.feed_metadata?.ranking_components,
    })),
  })

  return {
    tags: CATEGORIES,
    unique,
    metadata: {
      boost: {
        active_item_count: boostActiveCount,
        total_item_count: sortedItems.length,
        config: FEED_BOOST_CONFIG,
      },
    },
    items: sortedItems,
  }
}
