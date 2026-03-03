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
  minimumAccountAgeHours: Number(process.env.FEED_BOOST_MIN_ACCOUNT_AGE_HOURS || 1),
  abuseRapidWindowMinutes: Number(process.env.FEED_ABUSE_RAPID_WINDOW_MINUTES || 120),
  abuseRapidMaxPosts: Number(process.env.FEED_ABUSE_RAPID_MAX_POSTS || 3),
  spamKeywordLimit: Number(process.env.FEED_SPAM_KEYWORD_LIMIT || 3),
  spamDuplicateRatioLimit: Number(process.env.FEED_SPAM_DUPLICATE_RATIO_LIMIT || 0.5),
  spamMinWordVarietyRatio: Number(process.env.FEED_SPAM_MIN_WORD_VARIETY || 0.35),
}

const SPAM_KEYWORDS = ['whatsapp', 'telegram', 'dm', 'discount', 'cheap', 'guarantee', 'click', 'urgent', '100%']

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

function normalizeContent(item = {}) {
  return `${item.title || ''} ${item.description || ''}`
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function evaluateSpamPattern(item = {}, authorItems = []) {
  const text = normalizeContent(item)
  if (!text) {
    return {
      keywordHits: 0,
      duplicateRatio: 0,
      wordVarietyRatio: 0,
      lowQualitySpam: false,
    }
  }

  const words = text.split(/\W+/).filter(Boolean)
  const uniqueWords = new Set(words)
  const wordVarietyRatio = words.length ? uniqueWords.size / words.length : 0

  const keywordHits = SPAM_KEYWORDS.reduce((count, keyword) => {
    return count + (text.includes(keyword) ? 1 : 0)
  }, 0)

  const normalizedItems = authorItems
    .map((authorItem) => normalizeContent(authorItem))
    .filter(Boolean)

  const duplicateCount = normalizedItems.filter((entry) => entry === text).length
  const duplicateRatio = normalizedItems.length ? duplicateCount / normalizedItems.length : 0

  const lowQualitySpam = keywordHits >= FEED_BOOST_CONFIG.spamKeywordLimit
    || duplicateRatio >= FEED_BOOST_CONFIG.spamDuplicateRatioLimit
    || wordVarietyRatio < FEED_BOOST_CONFIG.spamMinWordVarietyRatio

  return {
    keywordHits,
    duplicateRatio,
    wordVarietyRatio,
    lowQualitySpam,
  }
}

function evaluateRepeatedPosting(item = {}, authorItems = []) {
  const createdAt = new Date(item.created_at).getTime()
  if (!Number.isFinite(createdAt)) {
    return {
      postsInRapidWindow: 0,
      suspiciousRepeatedPosting: false,
    }
  }

  const rapidWindowMs = FEED_BOOST_CONFIG.abuseRapidWindowMinutes * 60 * 1000
  const windowStart = createdAt - rapidWindowMs

  const postsInRapidWindow = authorItems.filter((authorItem) => {
    const authorCreatedAt = new Date(authorItem.created_at).getTime()
    return Number.isFinite(authorCreatedAt) && authorCreatedAt >= windowStart && authorCreatedAt <= createdAt
  }).length

  return {
    postsInRapidWindow,
    suspiciousRepeatedPosting: postsInRapidWindow > FEED_BOOST_CONFIG.abuseRapidMaxPosts,
  }
}

function evaluateAntiAbuseSignals(item = {}, authorItems = []) {
  const repeatedPosting = evaluateRepeatedPosting(item, authorItems)
  const spamPattern = evaluateSpamPattern(item, authorItems)

  return {
    ...repeatedPosting,
    ...spamPattern,
    antiAbusePassed: !repeatedPosting.suspiciousRepeatedPosting && !spamPattern.lowQualitySpam,
  }
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
    acc[authorId].push(item)
    return acc
  }, {})

  const ranked = combined.map((item) => {
    const authorId = getAuthorId(item)
    const author = users.find((u) => u.id === authorId) || null
    const profileCompleteness = computeProfileCompleteness(author)
    const authorItems = itemsByAuthor[authorId] || []
    const activityQuality = computeActivityQuality(authorItems.map((authorItem) => authorItem.id), socialInteractions)
    const antiAbuseSignals = evaluateAntiAbuseSignals(item, authorItems)
    const verifiedContact = Boolean(author?.verified)
    const accountAgeDays = getAccountAgeDays(author)
    const minAccountAgeDays = FEED_BOOST_CONFIG.minimumAccountAgeHours / 24
    const accountAgeEligible = accountAgeDays >= minAccountAgeDays

    const antiAbuseEligible = profileCompleteness >= FEED_BOOST_CONFIG.minProfileCompleteness
      && verifiedContact
      && activityQuality >= FEED_BOOST_CONFIG.minActivityQuality
      && accountAgeEligible
      && antiAbuseSignals.antiAbusePassed

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
          account_age_eligible: accountAgeEligible,
          anti_abuse_eligible: antiAbuseEligible,
          suspicious_repeated_posting: antiAbuseSignals.suspiciousRepeatedPosting,
          posts_in_rapid_window: antiAbuseSignals.postsInRapidWindow,
          low_quality_spam: antiAbuseSignals.lowQualitySpam,
          spam_keyword_hits: antiAbuseSignals.keywordHits,
          duplicate_content_ratio: roundNumber(clamp01(antiAbuseSignals.duplicateRatio)),
          word_variety_ratio: roundNumber(clamp01(antiAbuseSignals.wordVarietyRatio)),
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
      author_id: getAuthorId(item),
      created_at: item.created_at,
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
