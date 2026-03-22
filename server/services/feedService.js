import { listRequirements } from './requirementService.js'
import { listProducts } from './productService.js'
import { readJson } from '../utils/jsonStore.js'
import { trackEvent } from './analyticsService.js'
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
const DISCUSSION_BOOST_HOURS = 48
const DISCUSSION_BOOST_MULTIPLIER = 1.12
const PREMIUM_FEED_BOOST_MULTIPLIER = 1.08

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

function buildRatingMap(store) {
  const rows = Array.isArray(store?.ratings)
    ? store.ratings
    : Array.isArray(store)
      ? store
      : []
  const sums = new Map()
  const counts = new Map()
  for (const row of rows) {
    const key = String(row?.profile_key || '')
    if (!key.startsWith('user:')) continue
    const userId = key.slice('user:'.length)
    if (!userId) continue
    const value = Number(row?.score || 0)
    if (!Number.isFinite(value) || value <= 0) continue
    sums.set(userId, (sums.get(userId) || 0) + value)
    counts.set(userId, (counts.get(userId) || 0) + 1)
  }
  const averages = new Map()
  for (const [userId, total] of sums.entries()) {
    const count = counts.get(userId) || 0
    if (!count) continue
    averages.set(userId, total / count)
  }
  return averages
}

function isActivePaidBoost(boost) {
  if (!boost) return false
  if (String(boost.status || '').toLowerCase() !== 'active') return false
  const now = Date.now()
  const startsAt = new Date(boost.starts_at).getTime()
  const endsAt = new Date(boost.ends_at).getTime()
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false
  return now >= startsAt && now <= endsAt
}

function buildPaidBoostMap(boosts = []) {
  const byUser = new Map()
  boosts.forEach((boost) => {
    if (!isActivePaidBoost(boost)) return
    if (String(boost.scope || '').toLowerCase() !== 'feed') return
    const userId = String(boost.user_id || '')
    const multiplier = Number(boost.multiplier || 1)
    if (!userId || !Number.isFinite(multiplier) || multiplier <= 1) return
    const current = byUser.get(userId) || 1
    if (multiplier > current) byUser.set(userId, multiplier)
  })
  return byUser
}

function normalizeCategoryValue(item = {}) {
  const value = String(item.category || '').toLowerCase().trim()
  return value || 'unknown'
}

function diversifyFeedItems(items = [], { explorationRate = 0.2, maxSameAuthorRun = 1, maxSameCategoryRun = 2 } = {}) {
  if (!Array.isArray(items) || items.length <= 2) return items

  const topWindow = items.slice(0, 20)
  const freq = new Map()
  for (const item of topWindow) {
    const key = normalizeCategoryValue(item)
    freq.set(key, (freq.get(key) || 0) + 1)
  }
  const dominantCategory = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'

  const dominantPool = []
  const explorePool = []
  for (const item of items) {
    const cat = normalizeCategoryValue(item)
    if (cat === dominantCategory) dominantPool.push(item)
    else explorePool.push(item)
  }

  const explorationEvery = Math.max(3, Math.round(1 / Math.max(0.05, explorationRate)))
  const output = []
  let lastAuthorId = ''
  let lastCategory = ''
  let authorRun = 0
  let categoryRun = 0

  function authorIdFor(item) {
    if (item.feed_type === 'buyer_request') return item.buyer_id || ''
    if (item.feed_type === 'company_product') return item.company_id || ''
    return ''
  }

  function canPick(item) {
    const authorId = authorIdFor(item)
    const category = normalizeCategoryValue(item)

    const nextAuthorRun = authorId && authorId === lastAuthorId ? authorRun + 1 : 1
    const nextCategoryRun = category && category === lastCategory ? categoryRun + 1 : 1

    if (authorId && nextAuthorRun > maxSameAuthorRun) return false
    if (category && nextCategoryRun > maxSameCategoryRun) return false
    return true
  }

  function pickFrom(poolPrimary, poolSecondary) {
    const scanLimit = 30
    const tryPools = [poolPrimary, poolSecondary]
    for (const pool of tryPools) {
      if (!pool.length) continue
      const maxScan = Math.min(scanLimit, pool.length)
      for (let i = 0; i < maxScan; i++) {
        const candidate = pool[i]
        if (!candidate) continue
        if (!canPick(candidate)) continue
        pool.splice(i, 1)
        return candidate
      }
    }

    const fallback = poolPrimary.shift() || poolSecondary.shift() || null
    return fallback
  }

  while (dominantPool.length || explorePool.length) {
    const step = output.length
    const shouldExplore = explorePool.length > 0 && (step % explorationEvery === explorationEvery - 1)
    const chosen = shouldExplore
      ? pickFrom(explorePool, dominantPool)
      : pickFrom(dominantPool, explorePool)

    if (!chosen) break

    const authorId = authorIdFor(chosen)
    const category = normalizeCategoryValue(chosen)

    if (authorId && authorId === lastAuthorId) authorRun += 1
    else {
      lastAuthorId = authorId
      authorRun = 1
    }

    if (category && category === lastCategory) categoryRun += 1
    else {
      lastCategory = category
      categoryRun = 1
    }

    output.push(chosen)
  }

  return output.length ? output : items
}

export async function getCombinedFeed({ unique = false, type = 'all', category = '', cursor = 0, limit = 12, viewer = null }) {
  const requests = type === 'products' ? [] : await listRequirements({ status: 'open' })
  const products = type === 'requests' ? [] : await listProducts({ category })
  const users = await readJson('users.json')
  const socialInteractions = await readJson('social_interactions.json')
  const boosts = await readJson('boosts.json')
  const ratingsStore = await readJson('ratings.json')
  const paidBoostByUser = buildPaidBoostMap(Array.isArray(boosts) ? boosts : [])
  const ratingByUser = buildRatingMap(ratingsStore)
  const viewerVerified = Boolean(viewer?.verified)

  const discussionByRequest = new Map()
  if (Array.isArray(socialInteractions)) {
    for (const row of socialInteractions) {
      if (row.interaction_type !== 'comment') continue
      if (String(row.entity_type || '') !== 'buyer_request') continue
      const requestId = String(row.entity_id || '')
      if (!requestId) continue
      const ts = new Date(row.created_at || '').getTime()
      if (!Number.isFinite(ts)) continue
      const prev = discussionByRequest.get(requestId) || 0
      if (ts > prev) discussionByRequest.set(requestId, ts)
    }
  }

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
    const avgRating = ratingByUser.get(String(authorId || '')) || null
    const trustedSeller = verifiedContact || (Number.isFinite(avgRating) && avgRating >= 4.3)
    const accountAgeDays = getAccountAgeDays(author)
    const minAccountAgeDays = FEED_BOOST_CONFIG.minimumAccountAgeHours / 24
    const accountAgeEligible = accountAgeDays >= minAccountAgeDays

    const discussionTs = discussionByRequest.get(String(item.id || '')) || 0
    const discussionActive = item.feed_type === 'buyer_request'
      && discussionTs
      && (Date.now() - discussionTs) <= (DISCUSSION_BOOST_HOURS * 60 * 60 * 1000)
    const discussionBoost = viewerVerified && discussionActive ? DISCUSSION_BOOST_MULTIPLIER : 1
    const premiumBoostMultiplier = String(author?.subscription_status || '').toLowerCase() === 'premium'
      ? PREMIUM_FEED_BOOST_MULTIPLIER
      : 1

    const antiAbuseEligible = profileCompleteness >= FEED_BOOST_CONFIG.minProfileCompleteness
      && verifiedContact
      && activityQuality >= FEED_BOOST_CONFIG.minActivityQuality
      && accountAgeEligible
      && antiAbuseSignals.antiAbusePassed

    const ageBoostMultiplier = antiAbuseEligible ? getAgeBoostMultiplier(accountAgeDays) : 1
    const guardedAgeBoost = !trustedSeller && ageBoostMultiplier > 1.2 ? 1.2 : ageBoostMultiplier
    const paidBoostMultiplier = paidBoostByUser.get(String(authorId || '')) || 1
    const trustMultiplier = trustedSeller ? 1.06 : 1
    const combinedMultiplier = Math.max(1, guardedAgeBoost * paidBoostMultiplier * trustMultiplier * discussionBoost * premiumBoostMultiplier)
    const boostActive = combinedMultiplier > 1
    const recencyScore = calculateRecencyScore(item.created_at)
    const rankingScore = recencyScore * combinedMultiplier

    return {
      ...item,
      discussion_active: discussionActive && viewerVerified,
      _ranking: {
        ranking_score: rankingScore,
      },
      feed_metadata: {
        boost_active: boostActive,
        paid_boost_active: paidBoostMultiplier > 1,
        premium_boost_active: premiumBoostMultiplier > 1,
        ranking_components: {
          recency_score: roundNumber(recencyScore),
          account_age_days: roundNumber(accountAgeDays),
          boost_multiplier: roundNumber(combinedMultiplier),
          paid_boost_multiplier: roundNumber(paidBoostMultiplier),
          premium_boost_multiplier: roundNumber(premiumBoostMultiplier),
          age_boost_multiplier: roundNumber(guardedAgeBoost),
          discussion_boost_multiplier: roundNumber(discussionBoost),
          trust_multiplier: roundNumber(trustMultiplier),
          avg_rating: avgRating !== null ? roundNumber(avgRating) : null,
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
    sortedItems = diversifyFeedItems(sortedItems, {
      explorationRate: 0.2,
      maxSameAuthorRun: 1,
      maxSameCategoryRun: 2,
    })
  }

  const boostActiveCount = sortedItems.filter((item) => item.feed_metadata?.boost_active).length
  const totalItemCount = sortedItems.length
  const newProfileBoostedCount = sortedItems.filter((item) => {
    const multiplier = item.feed_metadata?.ranking_components?.age_boost_multiplier || 1
    return Number(multiplier) > 1
  }).length
  const safeCursor = Math.max(0, Math.floor(Number(cursor || 0)))
  const safeLimit = Math.min(50, Math.max(1, Math.floor(Number(limit || 12))))
  const pageItems = sortedItems.slice(safeCursor, safeCursor + safeLimit)
  const nextCursor = safeCursor + safeLimit < totalItemCount ? safeCursor + safeLimit : null

  logInfo('Feed ranking components', {
    total_items: totalItemCount,
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

  if (newProfileBoostedCount > 0) {
    await trackEvent({
      type: 'new_profile_boost_impressions',
      actor_id: null,
      entity_id: null,
      metadata: { count: newProfileBoostedCount, total: totalItemCount },
    })
  }

  return {
    tags: CATEGORIES,
    unique,
    cursor: safeCursor,
    next_cursor: nextCursor,
    metadata: {
      boost: {
        active_item_count: boostActiveCount,
        total_item_count: totalItemCount,
        config: FEED_BOOST_CONFIG,
      },
    },
    items: pageItems,
  }
}
