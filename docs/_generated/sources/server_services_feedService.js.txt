    1 | import { listRequirements } from './requirementService.js'
    2 | import { listProducts } from './productService.js'
    3 | import { readJson } from '../utils/jsonStore.js'
    4 | import { trackEvent } from './eventTrackingService.js'
    5 | import { logInfo } from '../utils/logger.js'
    6 | import { getOrderCertificationMap } from './orderCertificationService.js'
    7 | 
    8 | const CATEGORIES = ['Shirts', 'Knitwear', 'Denim', 'Women', 'Kids']
    9 | 
   10 | const FEED_BOOST_CONFIG = {
   11 |   windowDays: Number(process.env.FEED_BOOST_WINDOW_DAYS || 30),
   12 |   decayDays: Number(process.env.FEED_BOOST_DECAY_DAYS || 60),
   13 |   maxMultiplier: Number(process.env.FEED_BOOST_MAX_MULTIPLIER || 1.35),
   14 |   minProfileCompleteness: Number(process.env.FEED_BOOST_MIN_PROFILE_COMPLETENESS || 0.5),
   15 |   minActivityQuality: Number(process.env.FEED_BOOST_MIN_ACTIVITY_QUALITY || 0.4),
   16 |   minimumAccountAgeHours: Number(process.env.FEED_BOOST_MIN_ACCOUNT_AGE_HOURS || 1),
   17 |   abuseRapidWindowMinutes: Number(process.env.FEED_ABUSE_RAPID_WINDOW_MINUTES || 120),
   18 |   abuseRapidMaxPosts: Number(process.env.FEED_ABUSE_RAPID_MAX_POSTS || 3),
   19 |   spamKeywordLimit: Number(process.env.FEED_SPAM_KEYWORD_LIMIT || 3),
   20 |   spamDuplicateRatioLimit: Number(process.env.FEED_SPAM_DUPLICATE_RATIO_LIMIT || 0.5),
   21 |   spamMinWordVarietyRatio: Number(process.env.FEED_SPAM_MIN_WORD_VARIETY || 0.35),
   22 | }
   23 | 
   24 | const SPAM_KEYWORDS = ['whatsapp', 'telegram', 'dm', 'discount', 'cheap', 'guarantee', 'click', 'urgent', '100%']
   25 | const DISCUSSION_BOOST_HOURS = 48
   26 | const DISCUSSION_BOOST_MULTIPLIER = 1.12
   27 | const PREMIUM_FEED_BOOST_MULTIPLIER = 1.08
   28 | 
   29 | function clamp01(value) {
   30 |   return Math.min(1, Math.max(0, value))
   31 | }
   32 | 
   33 | function getAuthorId(item) {
   34 |   if (item.feed_type === 'buyer_request') return item.buyer_id
   35 |   if (item.feed_type === 'company_product') return item.company_id
   36 |   return ''
   37 | }
   38 | 
   39 | function computeProfileCompleteness(user = {}) {
   40 |   const profile = user.profile || {}
   41 |   const checks = [
   42 |     Boolean(user.name),
   43 |     Boolean(user.email),
   44 |     Boolean(profile.country),
   45 |     Array.isArray(profile.certifications) && profile.certifications.length > 0,
   46 |     Boolean(profile.bank_proof),
   47 |     Boolean(profile.export_license),
   48 |     Boolean(profile.monthly_capacity),
   49 |     Boolean(profile.moq),
   50 |     Boolean(profile.lead_time_days),
   51 |   ]
   52 | 
   53 |   const completed = checks.filter(Boolean).length
   54 |   return checks.length ? completed / checks.length : 0
   55 | }
   56 | 
   57 | function computeActivityQuality(authorItemIds = [], socialRows = []) {
   58 |   if (!authorItemIds.length) return 0.5
   59 | 
   60 |   const idSet = new Set(authorItemIds)
   61 |   const relevant = socialRows.filter((row) => idSet.has(row.entity_id))
   62 | 
   63 |   const positive = relevant.filter((row) => row.interaction_type === 'comment' || row.interaction_type === 'share').length
   64 |   const reports = relevant.filter((row) => row.interaction_type === 'report').length
   65 | 
   66 |   return (positive + 1) / (positive + reports + 2)
   67 | }
   68 | 
   69 | function getAccountAgeDays(user = {}) {
   70 |   if (!user.created_at) return Number.POSITIVE_INFINITY
   71 |   const ageMs = Date.now() - new Date(user.created_at).getTime()
   72 |   return Math.max(0, ageMs / (1000 * 60 * 60 * 24))
   73 | }
   74 | 
   75 | function getAgeBoostMultiplier(accountAgeDays) {
   76 |   const { windowDays, decayDays, maxMultiplier } = FEED_BOOST_CONFIG
   77 | 
   78 |   if (!Number.isFinite(accountAgeDays)) return 1
   79 |   if (accountAgeDays <= windowDays) return maxMultiplier
   80 |   if (accountAgeDays <= windowDays + decayDays) {
   81 |     const decayProgress = (accountAgeDays - windowDays) / Math.max(1, decayDays)
   82 |     const multiplier = 1 + (maxMultiplier - 1) * (1 - decayProgress)
   83 |     return Math.max(1, multiplier)
   84 |   }
   85 | 
   86 |   return 1
   87 | }
   88 | 
   89 | function normalizeContent(item = {}) {
   90 |   return `${item.title || ''} ${item.description || ''}`
   91 |     .toLowerCase()
   92 |     .replace(/\s+/g, ' ')
   93 |     .trim()
   94 | }
   95 | 
   96 | function evaluateSpamPattern(item = {}, authorItems = []) {
   97 |   const text = normalizeContent(item)
   98 |   if (!text) {
   99 |     return {
  100 |       keywordHits: 0,
  101 |       duplicateRatio: 0,
  102 |       wordVarietyRatio: 0,
  103 |       lowQualitySpam: false,
  104 |     }
  105 |   }
  106 | 
  107 |   const words = text.split(/\W+/).filter(Boolean)
  108 |   const uniqueWords = new Set(words)
  109 |   const wordVarietyRatio = words.length ? uniqueWords.size / words.length : 0
  110 | 
  111 |   const keywordHits = SPAM_KEYWORDS.reduce((count, keyword) => {
  112 |     return count + (text.includes(keyword) ? 1 : 0)
  113 |   }, 0)
  114 | 
  115 |   const normalizedItems = authorItems
  116 |     .map((authorItem) => normalizeContent(authorItem))
  117 |     .filter(Boolean)
  118 | 
  119 |   const duplicateCount = normalizedItems.filter((entry) => entry === text).length
  120 |   const duplicateRatio = normalizedItems.length ? duplicateCount / normalizedItems.length : 0
  121 | 
  122 |   const lowQualitySpam = keywordHits >= FEED_BOOST_CONFIG.spamKeywordLimit
  123 |     || duplicateRatio >= FEED_BOOST_CONFIG.spamDuplicateRatioLimit
  124 |     || wordVarietyRatio < FEED_BOOST_CONFIG.spamMinWordVarietyRatio
  125 | 
  126 |   return {
  127 |     keywordHits,
  128 |     duplicateRatio,
  129 |     wordVarietyRatio,
  130 |     lowQualitySpam,
  131 |   }
  132 | }
  133 | 
  134 | function evaluateRepeatedPosting(item = {}, authorItems = []) {
  135 |   const createdAt = new Date(item.created_at).getTime()
  136 |   if (!Number.isFinite(createdAt)) {
  137 |     return {
  138 |       postsInRapidWindow: 0,
  139 |       suspiciousRepeatedPosting: false,
  140 |     }
  141 |   }
  142 | 
  143 |   const rapidWindowMs = FEED_BOOST_CONFIG.abuseRapidWindowMinutes * 60 * 1000
  144 |   const windowStart = createdAt - rapidWindowMs
  145 | 
  146 |   const postsInRapidWindow = authorItems.filter((authorItem) => {
  147 |     const authorCreatedAt = new Date(authorItem.created_at).getTime()
  148 |     return Number.isFinite(authorCreatedAt) && authorCreatedAt >= windowStart && authorCreatedAt <= createdAt
  149 |   }).length
  150 | 
  151 |   return {
  152 |     postsInRapidWindow,
  153 |     suspiciousRepeatedPosting: postsInRapidWindow > FEED_BOOST_CONFIG.abuseRapidMaxPosts,
  154 |   }
  155 | }
  156 | 
  157 | function evaluateAntiAbuseSignals(item = {}, authorItems = []) {
  158 |   const repeatedPosting = evaluateRepeatedPosting(item, authorItems)
  159 |   const spamPattern = evaluateSpamPattern(item, authorItems)
  160 | 
  161 |   return {
  162 |     ...repeatedPosting,
  163 |     ...spamPattern,
  164 |     antiAbusePassed: !repeatedPosting.suspiciousRepeatedPosting && !spamPattern.lowQualitySpam,
  165 |   }
  166 | }
  167 | 
  168 | function calculateRecencyScore(itemCreatedAt) {
  169 |   const hoursOld = Math.max(0, (Date.now() - new Date(itemCreatedAt).getTime()) / (1000 * 60 * 60))
  170 |   return 1 / (1 + hoursOld / 24)
  171 | }
  172 | 
  173 | function roundNumber(value) {
  174 |   return Number(value.toFixed(4))
  175 | }
  176 | 
  177 | function buildRatingMap(store) {
  178 |   const rows = Array.isArray(store?.ratings)
  179 |     ? store.ratings
  180 |     : Array.isArray(store)
  181 |       ? store
  182 |       : []
  183 |   const sums = new Map()
  184 |   const counts = new Map()
  185 |   for (const row of rows) {
  186 |     const key = String(row?.profile_key || '')
  187 |     if (!key.startsWith('user:')) continue
  188 |     const userId = key.slice('user:'.length)
  189 |     if (!userId) continue
  190 |     const value = Number(row?.score || 0)
  191 |     if (!Number.isFinite(value) || value <= 0) continue
  192 |     sums.set(userId, (sums.get(userId) || 0) + value)
  193 |     counts.set(userId, (counts.get(userId) || 0) + 1)
  194 |   }
  195 |   const averages = new Map()
  196 |   for (const [userId, total] of sums.entries()) {
  197 |     const count = counts.get(userId) || 0
  198 |     if (!count) continue
  199 |     averages.set(userId, total / count)
  200 |   }
  201 |   return averages
  202 | }
  203 | 
  204 | function isActivePaidBoost(boost) {
  205 |   if (!boost) return false
  206 |   if (String(boost.status || '').toLowerCase() !== 'active') return false
  207 |   const now = Date.now()
  208 |   const startsAt = new Date(boost.starts_at).getTime()
  209 |   const endsAt = new Date(boost.ends_at).getTime()
  210 |   if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false
  211 |   return now >= startsAt && now <= endsAt
  212 | }
  213 | 
  214 | function buildPaidBoostMap(boosts = []) {
  215 |   const byUser = new Map()
  216 |   boosts.forEach((boost) => {
  217 |     if (!isActivePaidBoost(boost)) return
  218 |     if (String(boost.scope || '').toLowerCase() !== 'feed') return
  219 |     const userId = String(boost.user_id || '')
  220 |     const multiplier = Number(boost.multiplier || 1)
  221 |     if (!userId || !Number.isFinite(multiplier) || multiplier <= 1) return
  222 |     const current = byUser.get(userId) || 1
  223 |     if (multiplier > current) byUser.set(userId, multiplier)
  224 |   })
  225 |   return byUser
  226 | }
  227 | 
  228 | function normalizeCategoryValue(item = {}) {
  229 |   const value = String(item.category || '').toLowerCase().trim()
  230 |   return value || 'unknown'
  231 | }
  232 | 
  233 | function diversifyFeedItems(items = [], { explorationRate = 0.2, maxSameAuthorRun = 1, maxSameCategoryRun = 2 } = {}) {
  234 |   if (!Array.isArray(items) || items.length <= 2) return items
  235 | 
  236 |   const topWindow = items.slice(0, 20)
  237 |   const freq = new Map()
  238 |   for (const item of topWindow) {
  239 |     const key = normalizeCategoryValue(item)
  240 |     freq.set(key, (freq.get(key) || 0) + 1)
  241 |   }
  242 |   const dominantCategory = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'
  243 | 
  244 |   const dominantPool = []
  245 |   const explorePool = []
  246 |   for (const item of items) {
  247 |     const cat = normalizeCategoryValue(item)
  248 |     if (cat === dominantCategory) dominantPool.push(item)
  249 |     else explorePool.push(item)
  250 |   }
  251 | 
  252 |   const explorationEvery = Math.max(3, Math.round(1 / Math.max(0.05, explorationRate)))
  253 |   const output = []
  254 |   let lastAuthorId = ''
  255 |   let lastCategory = ''
  256 |   let authorRun = 0
  257 |   let categoryRun = 0
  258 | 
  259 |   function authorIdFor(item) {
  260 |     if (item.feed_type === 'buyer_request') return item.buyer_id || ''
  261 |     if (item.feed_type === 'company_product') return item.company_id || ''
  262 |     return ''
  263 |   }
  264 | 
  265 |   function canPick(item) {
  266 |     const authorId = authorIdFor(item)
  267 |     const category = normalizeCategoryValue(item)
  268 | 
  269 |     const nextAuthorRun = authorId && authorId === lastAuthorId ? authorRun + 1 : 1
  270 |     const nextCategoryRun = category && category === lastCategory ? categoryRun + 1 : 1
  271 | 
  272 |     if (authorId && nextAuthorRun > maxSameAuthorRun) return false
  273 |     if (category && nextCategoryRun > maxSameCategoryRun) return false
  274 |     return true
  275 |   }
  276 | 
  277 |   function pickFrom(poolPrimary, poolSecondary) {
  278 |     const scanLimit = 30
  279 |     const tryPools = [poolPrimary, poolSecondary]
  280 |     for (const pool of tryPools) {
  281 |       if (!pool.length) continue
  282 |       const maxScan = Math.min(scanLimit, pool.length)
  283 |       for (let i = 0; i < maxScan; i++) {
  284 |         const candidate = pool[i]
  285 |         if (!candidate) continue
  286 |         if (!canPick(candidate)) continue
  287 |         pool.splice(i, 1)
  288 |         return candidate
  289 |       }
  290 |     }
  291 | 
  292 |     const fallback = poolPrimary.shift() || poolSecondary.shift() || null
  293 |     return fallback
  294 |   }
  295 | 
  296 |   while (dominantPool.length || explorePool.length) {
  297 |     const step = output.length
  298 |     const shouldExplore = explorePool.length > 0 && (step % explorationEvery === explorationEvery - 1)
  299 |     const chosen = shouldExplore
  300 |       ? pickFrom(explorePool, dominantPool)
  301 |       : pickFrom(dominantPool, explorePool)
  302 | 
  303 |     if (!chosen) break
  304 | 
  305 |     const authorId = authorIdFor(chosen)
  306 |     const category = normalizeCategoryValue(chosen)
  307 | 
  308 |     if (authorId && authorId === lastAuthorId) authorRun += 1
  309 |     else {
  310 |       lastAuthorId = authorId
  311 |       authorRun = 1
  312 |     }
  313 | 
  314 |     if (category && category === lastCategory) categoryRun += 1
  315 |     else {
  316 |       lastCategory = category
  317 |       categoryRun = 1
  318 |     }
  319 | 
  320 |     output.push(chosen)
  321 |   }
  322 | 
  323 |   return output.length ? output : items
  324 | }
  325 | 
  326 | export async function getCombinedFeed({ unique = false, type = 'all', category = '', cursor = 0, limit = 12, viewer = null }) {
  327 |   const requests = type === 'products' ? [] : await listRequirements({ status: 'open' })
  328 |   const products = type === 'requests' ? [] : await listProducts({ category })
  329 |   const users = await readJson('users.json')
  330 |   const orderCertMap = await getOrderCertificationMap()
  331 |   const socialInteractions = await readJson('social_interactions.json')
  332 |   const boosts = await readJson('boosts.json')
  333 |   const ratingsStore = await readJson('ratings.json')
  334 |   const paidBoostByUser = buildPaidBoostMap(Array.isArray(boosts) ? boosts : [])
  335 |   const ratingByUser = buildRatingMap(ratingsStore)
  336 |   const viewerVerified = Boolean(viewer?.verified)
  337 | 
  338 |   const discussionByRequest = new Map()
  339 |   if (Array.isArray(socialInteractions)) {
  340 |     for (const row of socialInteractions) {
  341 |       if (row.interaction_type !== 'comment') continue
  342 |       if (String(row.entity_type || '') !== 'buyer_request') continue
  343 |       const requestId = String(row.entity_id || '')
  344 |       if (!requestId) continue
  345 |       const ts = new Date(row.created_at || '').getTime()
  346 |       if (!Number.isFinite(ts)) continue
  347 |       const prev = discussionByRequest.get(requestId) || 0
  348 |       if (ts > prev) discussionByRequest.set(requestId, ts)
  349 |     }
  350 |   }
  351 | 
  352 |   const combined = [
  353 |     ...requests.map((r) => ({ ...r, feed_type: 'buyer_request', icon: '💼' })),
  354 |     ...products.map((p) => ({ ...p, feed_type: 'company_product', icon: '🏭' })),
  355 |   ]
  356 | 
  357 |   const itemsByAuthor = combined.reduce((acc, item) => {
  358 |     const authorId = getAuthorId(item)
  359 |     if (!authorId) return acc
  360 |     if (!acc[authorId]) acc[authorId] = []
  361 |     acc[authorId].push(item)
  362 |     return acc
  363 |   }, {})
  364 | 
  365 |   const ranked = combined.map((item) => {
  366 |     const authorId = getAuthorId(item)
  367 |     const author = users.find((u) => u.id === authorId) || null
  368 |     const certification = authorId ? orderCertMap.get(String(authorId)) : null
  369 |     const profileCompleteness = computeProfileCompleteness(author)
  370 |     const authorItems = itemsByAuthor[authorId] || []
  371 |     const activityQuality = computeActivityQuality(authorItems.map((authorItem) => authorItem.id), socialInteractions)
  372 |     const antiAbuseSignals = evaluateAntiAbuseSignals(item, authorItems)
  373 |     const verifiedContact = Boolean(author?.verified)
  374 |     const avgRating = ratingByUser.get(String(authorId || '')) || null
  375 |     const trustedSeller = verifiedContact || (Number.isFinite(avgRating) && avgRating >= 4.3)
  376 |     const accountAgeDays = getAccountAgeDays(author)
  377 |     const minAccountAgeDays = FEED_BOOST_CONFIG.minimumAccountAgeHours / 24
  378 |     const accountAgeEligible = accountAgeDays >= minAccountAgeDays
  379 | 
  380 |     const discussionTs = discussionByRequest.get(String(item.id || '')) || 0
  381 |     const discussionActive = item.feed_type === 'buyer_request'
  382 |       && discussionTs
  383 |       && (Date.now() - discussionTs) <= (DISCUSSION_BOOST_HOURS * 60 * 60 * 1000)
  384 |     const discussionBoost = viewerVerified && discussionActive ? DISCUSSION_BOOST_MULTIPLIER : 1
  385 |     const premiumBoostMultiplier = String(author?.subscription_status || '').toLowerCase() === 'premium'
  386 |       ? PREMIUM_FEED_BOOST_MULTIPLIER
  387 |       : 1
  388 | 
  389 |     const antiAbuseEligible = profileCompleteness >= FEED_BOOST_CONFIG.minProfileCompleteness
  390 |       && verifiedContact
  391 |       && activityQuality >= FEED_BOOST_CONFIG.minActivityQuality
  392 |       && accountAgeEligible
  393 |       && antiAbuseSignals.antiAbusePassed
  394 | 
  395 |     const ageBoostMultiplier = antiAbuseEligible ? getAgeBoostMultiplier(accountAgeDays) : 1
  396 |     const guardedAgeBoost = !trustedSeller && ageBoostMultiplier > 1.2 ? 1.2 : ageBoostMultiplier
  397 |     const paidBoostMultiplier = paidBoostByUser.get(String(authorId || '')) || 1
  398 |     const trustMultiplier = trustedSeller ? 1.06 : 1
  399 |     const combinedMultiplier = Math.max(1, guardedAgeBoost * paidBoostMultiplier * trustMultiplier * discussionBoost * premiumBoostMultiplier)
  400 |     const boostActive = combinedMultiplier > 1
  401 |     const recencyScore = calculateRecencyScore(item.created_at)
  402 |     const rankingScore = recencyScore * combinedMultiplier
  403 | 
  404 |     return {
  405 |       ...item,
  406 |       order_certification_status: certification?.status || '',
  407 |       discussion_active: discussionActive && viewerVerified,
  408 |       _ranking: {
  409 |         ranking_score: rankingScore,
  410 |       },
  411 |       feed_metadata: {
  412 |         boost_active: boostActive,
  413 |         paid_boost_active: paidBoostMultiplier > 1,
  414 |         premium_boost_active: premiumBoostMultiplier > 1,
  415 |         ranking_components: {
  416 |           recency_score: roundNumber(recencyScore),
  417 |           account_age_days: roundNumber(accountAgeDays),
  418 |           boost_multiplier: roundNumber(combinedMultiplier),
  419 |           paid_boost_multiplier: roundNumber(paidBoostMultiplier),
  420 |           premium_boost_multiplier: roundNumber(premiumBoostMultiplier),
  421 |           age_boost_multiplier: roundNumber(guardedAgeBoost),
  422 |           discussion_boost_multiplier: roundNumber(discussionBoost),
  423 |           trust_multiplier: roundNumber(trustMultiplier),
  424 |           avg_rating: avgRating !== null ? roundNumber(avgRating) : null,
  425 |           profile_completeness: roundNumber(clamp01(profileCompleteness)),
  426 |           verified_contact: verifiedContact,
  427 |           activity_quality_score: roundNumber(clamp01(activityQuality)),
  428 |           account_age_eligible: accountAgeEligible,
  429 |           anti_abuse_eligible: antiAbuseEligible,
  430 |           suspicious_repeated_posting: antiAbuseSignals.suspiciousRepeatedPosting,
  431 |           posts_in_rapid_window: antiAbuseSignals.postsInRapidWindow,
  432 |           low_quality_spam: antiAbuseSignals.lowQualitySpam,
  433 |           spam_keyword_hits: antiAbuseSignals.keywordHits,
  434 |           duplicate_content_ratio: roundNumber(clamp01(antiAbuseSignals.duplicateRatio)),
  435 |           word_variety_ratio: roundNumber(clamp01(antiAbuseSignals.wordVarietyRatio)),
  436 |         },
  437 |       },
  438 |     }
  439 |   })
  440 | 
  441 |   let sortedItems = ranked
  442 |     .sort((a, b) => b._ranking.ranking_score - a._ranking.ranking_score)
  443 |     .map((item) => {
  444 |       const next = { ...item }
  445 |       delete next._ranking
  446 |       return next
  447 |     })
  448 | 
  449 |   if (unique) {
  450 |     sortedItems = diversifyFeedItems(sortedItems, {
  451 |       explorationRate: 0.2,
  452 |       maxSameAuthorRun: 1,
  453 |       maxSameCategoryRun: 2,
  454 |     })
  455 |   }
  456 | 
  457 |   const boostActiveCount = sortedItems.filter((item) => item.feed_metadata?.boost_active).length
  458 |   const totalItemCount = sortedItems.length
  459 |   const newProfileBoostedCount = sortedItems.filter((item) => {
  460 |     const multiplier = item.feed_metadata?.ranking_components?.age_boost_multiplier || 1
  461 |     return Number(multiplier) > 1
  462 |   }).length
  463 |   const safeCursor = Math.max(0, Math.floor(Number(cursor || 0)))
  464 |   const safeLimit = Math.min(50, Math.max(1, Math.floor(Number(limit || 12))))
  465 |   const pageItems = sortedItems.slice(safeCursor, safeCursor + safeLimit)
  466 |   const nextCursor = safeCursor + safeLimit < totalItemCount ? safeCursor + safeLimit : null
  467 | 
  468 |   logInfo('Feed ranking components', {
  469 |     total_items: totalItemCount,
  470 |     boosted_items: boostActiveCount,
  471 |     boost_config: FEED_BOOST_CONFIG,
  472 |     ranking_snapshot: sortedItems.slice(0, 20).map((item) => ({
  473 |       item_id: item.id,
  474 |       feed_type: item.feed_type,
  475 |       author_id: getAuthorId(item),
  476 |       created_at: item.created_at,
  477 |       boost_active: item.feed_metadata?.boost_active,
  478 |       ...item.feed_metadata?.ranking_components,
  479 |     })),
  480 |   })
  481 | 
  482 |   if (newProfileBoostedCount > 0) {
  483 |     await trackEvent({
  484 |       type: 'new_profile_boost_impressions',
  485 |       actor_id: null,
  486 |       entity_id: null,
  487 |       metadata: { count: newProfileBoostedCount, total: totalItemCount },
  488 |     })
  489 |   }
  490 | 
  491 |   return {
  492 |     tags: CATEGORIES,
  493 |     unique,
  494 |     cursor: safeCursor,
  495 |     next_cursor: nextCursor,
  496 |     metadata: {
  497 |       boost: {
  498 |         active_item_count: boostActiveCount,
  499 |         total_item_count: totalItemCount,
  500 |         config: FEED_BOOST_CONFIG,
  501 |       },
  502 |     },
  503 |     items: pageItems,
  504 |   }
  505 | }
  506 | 