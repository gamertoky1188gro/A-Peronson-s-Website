import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { canViewAnalytics, canViewAnalyticsAdmin, canViewAnalyticsDashboard, forbiddenError, scopeRecordsForUser } from '../utils/permissions.js'

const FILE = 'analytics.json'

export async function trackEvent({ type, actor_id, entity_id, metadata = {} }) {
  const all = await readJson(FILE)
  all.push({
    id: crypto.randomUUID(),
    type,
    actor_id,
    entity_id,
    metadata,
    created_at: new Date().toISOString(),
  })
  await writeJson(FILE, all)
}

function ensureAnalyticsAccess(user) {
  if (canViewAnalytics(user)) return
  throw forbiddenError()
}

function ensureAnalyticsDashboardAccess(user) {
  if (canViewAnalyticsDashboard(user)) return
  throw forbiddenError()
}

function ensureAnalyticsAdminAccess(user) {
  if (canViewAnalyticsAdmin(user)) return
  throw forbiddenError()
}

function scopeAnalyticsRecords(user, records, idFields) {
  // Main accounts (buying house / factory) can view the org-level dashboard.
  // In this MVP data model, we treat them as org managers (unscoped) to avoid "all zeros".
  const role = String(user?.role || '').toLowerCase()
  if (role === 'buying_house' || role === 'factory' || role === 'owner' || role === 'admin') return records

  return scopeRecordsForUser(user, records, {
    idFields,
    assignmentFields: ['assigned_agent_id', 'agent_id'],
  })
}

export async function getAnalyticsSummary(user) {
  ensureAnalyticsAccess(user)
  const all = await readJson(FILE)
  const scoped = scopeAnalyticsRecords(user, all, ['actor_id', 'entity_id'])
  const byType = scoped.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})
  return { total_events: scoped.length, by_type: byType }
}

function monthKey(value) {
  const d = new Date(value || '')
  if (Number.isNaN(d.getTime())) return null
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function toMonthlySeries(items, dateKey) {
  const bucket = items.reduce((acc, item) => {
    const key = monthKey(item[dateKey])
    if (!key) return acc
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return Object.entries(bucket)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }))
}

function formatHours(avgHours) {
  const h = Number(avgHours) || 0
  if (!Number.isFinite(h) || h <= 0) return '--'
  if (h < 1) return `${Math.round(h * 60)}m`
  if (h < 24) return `${Math.round(h)}h`
  return `${Math.round(h / 24)}d`
}

function calcPercent(n, d) {
  const dn = Number(d) || 0
  if (!dn) return 0
  return Math.round((Number(n || 0) / dn) * 100)
}

function parseNumericRange(value) {
  const raw = String(value || '')
  if (!raw) return { min: null, max: null }
  const matches = raw.match(/\d+(\.\d+)?/g)
  if (!matches || matches.length === 0) return { min: null, max: null }
  const nums = matches.map((n) => Number(n)).filter((n) => Number.isFinite(n))
  if (!nums.length) return { min: null, max: null }
  const min = nums[0] ?? null
  const max = nums[1] ?? nums[0] ?? null
  return { min, max }
}

function bucketPriceRange(value) {
  const { min, max } = parseNumericRange(value)
  const ref = min ?? max
  if (ref === null || !Number.isFinite(ref)) return 'unknown'
  if (ref <= 5) return '0-5'
  if (ref <= 10) return '5-10'
  if (ref <= 20) return '10-20'
  if (ref <= 50) return '20-50'
  return '50+'
}

export async function getDashboardAnalytics(user) {
  ensureAnalyticsDashboardAccess(user)

  const [events, requirements, messages, matches, documents, users, products, ratings] = await Promise.all([
    readJson(FILE),
    readJson('requirements.json'),
    readJson('messages.json'),
    readJson('matches.json'),
    readJson('documents.json'),
    readJson('users.json'),
    readJson('company_products.json'),
    readJson('ratings.json'),
  ])

  const scopedEvents = scopeAnalyticsRecords(user, events, ['actor_id', 'entity_id'])
  const scopedRequirements = scopeAnalyticsRecords(user, requirements, ['buyer_id', 'requester_id'])
  const scopedMessages = scopeAnalyticsRecords(user, messages, ['sender_id', 'receiver_id'])
  const scopedMatches = scopeAnalyticsRecords(user, matches, ['buyer_id', 'factory_id'])
  const scopedDocuments = scopeAnalyticsRecords(user, documents, ['uploaded_by', 'buyer_id', 'factory_id', 'entity_id'])
  const scopedProducts = scopeAnalyticsRecords(user, products, ['company_id', 'uploaded_by', 'owner_id'])

  const uniqueActiveChats = new Set(scopedMessages.map((m) => m.match_id).filter(Boolean)).size
  const connectedPartners = new Set(scopedMatches.map((m) => m.factory_id).filter(Boolean)).size
  const contractDocs = scopedDocuments.filter((d) => d.entity_type === 'contract' || String(d.type || '').toLowerCase().includes('contract'))
  const byType = scopedEvents.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})

  const interactionSummary = (() => {
    const pageViews = scopedEvents.filter((e) => e.type === 'page_view')
    const clicks = scopedEvents.filter((e) => e.type === 'click')
    const sessionEvents = scopedEvents.filter((e) => e.type === 'session_end' || e.type === 'page_duration')
    const durations = sessionEvents
      .map((e) => {
        const seconds = Number(e?.metadata?.duration_seconds)
        if (Number.isFinite(seconds) && seconds > 0) return seconds
        const ms = Number(e?.metadata?.duration_ms)
        if (Number.isFinite(ms) && ms > 0) return Math.round(ms / 1000)
        return 0
      })
      .filter((v) => v > 0)
    const avgSessionSeconds = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0

    const viewsByPage = pageViews.reduce((acc, e) => {
      const key = String(e.entity_id || e?.metadata?.entity_id || e?.metadata?.entity_type || 'unknown')
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const topPages = Object.entries(viewsByPage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }))

    return {
      total_page_views: pageViews.length,
      total_clicks: clicks.length,
      avg_session_duration_seconds: avgSessionSeconds,
      top_pages: topPages,
    }
  })()

  const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))

  function isRecent(iso, days = 30) {
    const t = new Date(String(iso || '')).getTime()
    if (!Number.isFinite(t)) return false
    return t >= Date.now() - days * 24 * 60 * 60 * 1000
  }

  function percent(n, d) {
    const dn = Number(d) || 0
    if (!dn) return 0
    return Math.round((Number(n || 0) / dn) * 100)
  }


  // --- Top metrics (project.md) ---
  const uniqueRequirementIdsWithMatch = new Set(scopedMatches.map((m) => String(m.requirement_id || '')).filter(Boolean)).size
  const buyerSupplierMatchRate = percent(uniqueRequirementIdsWithMatch, scopedRequirements.length)

  const buyersActive = new Set()
  const suppliersActive = new Set()

  scopedRequirements.filter((r) => isRecent(r.created_at)).forEach((r) => {
    if (r?.buyer_id) buyersActive.add(String(r.buyer_id))
  })
  scopedProducts.filter((p) => isRecent(p.created_at)).forEach((p) => {
    if (p?.company_id) suppliersActive.add(String(p.company_id))
  })
  scopedMessages.filter((m) => isRecent(m.timestamp)).forEach((m) => {
    const sender = usersById.get(String(m.sender_id || ''))
    if (!sender) return
    const role = String(sender.role || '').toLowerCase()
    if (role === 'buyer') buyersActive.add(String(sender.id))
    if (role === 'factory' || role === 'buying_house') suppliersActive.add(String(sender.id))
  })

  const activeBuyerSupplierRatio = suppliersActive.size
    ? `${buyersActive.size}:${suppliersActive.size}`
    : `${buyersActive.size}:0`

  const requestToContractConversion = percent(contractDocs.length, scopedRequirements.length)

  // Time to first qualified response: first verified supplier message after a buyer request.
  const firstResponseHours = []
  const requirementsById = new Map(scopedRequirements.map((r) => [String(r.id), r]))
  const messagesByMatch = scopedMessages.reduce((acc, m) => {
    const id = String(m.match_id || '')
    if (!id) return acc
    if (!acc.has(id)) acc.set(id, [])
    acc.get(id).push(m)
    return acc
  }, new Map())

  for (const [matchId, msgs] of messagesByMatch.entries()) {
    const parts = String(matchId).split(':')
    if (parts.length !== 2) continue
    const requirementId = parts[0]
    const factoryId = parts[1]
    const reqRow = requirementsById.get(String(requirementId))
    if (!reqRow?.created_at) continue
    const buyerId = String(reqRow.buyer_id || '')
    const createdAt = new Date(reqRow.created_at).getTime()
    if (!Number.isFinite(createdAt)) continue

    const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
    const firstQualified = sorted.find((m) => {
      const senderId = String(m.sender_id || '')
      if (!senderId) return false
      if (senderId === buyerId) return false
      if (senderId !== String(factoryId)) return false
      const sender = usersById.get(senderId)
      return Boolean(sender?.verified)
    })
    if (!firstQualified?.timestamp) continue
    const firstAt = new Date(firstQualified.timestamp).getTime()
    if (!Number.isFinite(firstAt) || firstAt < createdAt) continue
    firstResponseHours.push((firstAt - createdAt) / (1000 * 60 * 60))
  }

  const avgFirstResponseHours = firstResponseHours.length
    ? (firstResponseHours.reduce((a, b) => a + b, 0) / firstResponseHours.length)
    : 0

  const repeatBuyerRate = (() => {
    const counts = scopedRequirements.reduce((acc, r) => {
      const bid = String(r.buyer_id || '')
      if (!bid) return acc
      acc[bid] = (acc[bid] || 0) + 1
      return acc
    }, {})
    const buyers = Object.keys(counts)
    const repeat = buyers.filter((b) => counts[b] >= 2).length
    return percent(repeat, buyers.length)
  })()

  // Buying house metrics (project.md) derived from same data model (MVP approximations).
  const demandTrend = scopedRequirements
    .reduce((acc, r) => {
      const k = String(r.category || r.product || 'Other')
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {})

  const topRequested = Object.entries(demandTrend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }))

  const leadDealConversion = percent(contractDocs.length, uniqueActiveChats || 0)

  const avgRating = (() => {
    const rows = Array.isArray(ratings) ? ratings : []
    const scoped = scopeAnalyticsRecords(user, rows, ['target_profile_key', 'author_id', 'target_user_id'])
    const values = scoped.map((r) => Number(r.rating || r.stars || 0)).filter((n) => Number.isFinite(n) && n > 0)
    if (!values.length) return 0
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
  })()

  const trustedDealScore = Math.max(0, Math.round((contractDocs.length * 10) + (avgRating * 5)))

  const role = String(user?.role || '').toLowerCase()
  const top_metrics = (() => {
    // Marketplace-owner view (owner/admin): use marketplace success metrics.
    if (role === 'owner' || role === 'admin') {
      return [
        { key: 'match_success_rate', label: 'Buyer → Supplier Match Success', value: `${buyerSupplierMatchRate}%`, hint: 'Matched requests / total requests' },
        { key: 'active_ratio', label: 'Active Buyer : Supplier Ratio', value: activeBuyerSupplierRatio, hint: '30-day active users' },
        { key: 'request_to_contract', label: 'Request → Contract Conversion', value: `${requestToContractConversion}%`, hint: 'Contracts / buyer requests' },
        { key: 'first_response', label: 'Time to First Qualified Response', value: formatHours(avgFirstResponseHours), hint: 'Verified supplier response speed' },
        { key: 'repeat_buyer', label: 'Repeat Buyer Rate', value: `${repeatBuyerRate}%`, hint: 'Buyers with 2+ requests' },
      ]
    }

    // Organization view (buying_house/factory): use the 5 metrics Shaun listed for enterprise analytics.
    if (role === 'buying_house' || role === 'factory') {
      return [
        { key: 'request_match_rate', label: 'Buyer Request Match Rate', value: `${buyerSupplierMatchRate}%`, hint: 'Matched requests / total requests' },
        { key: 'lead_deal', label: 'Lead → Deal Conversion', value: `${leadDealConversion}%`, hint: 'Contracts / active chats' },
        { key: 'response_speed', label: 'Factory Response Speed', value: formatHours(avgFirstResponseHours), hint: 'Avg first verified reply' },
        { key: 'demand_trend', label: 'Buyer Demand Trend', value: topRequested.map((x) => x.label).join(', ') || '—', hint: 'Top requested categories' },
        { key: 'trusted_score', label: 'Trusted Deal Score', value: String(trustedDealScore), hint: 'Contracts + ratings (MVP)' },
      ]
    }

    // Agents: show limited metrics (permission gated elsewhere).
    return [
      { key: 'assigned_requests', label: 'Open Buyer Requests', value: String(scopedRequirements.filter((r) => r.status === 'open').length), hint: 'Visible within your scope' },
      { key: 'active_chats', label: 'Active Chats', value: String(uniqueActiveChats), hint: 'Threads with messages' },
      { key: 'contracts', label: 'Contracts', value: String(contractDocs.length), hint: 'Contracts in your scope' },
      { key: 'first_response', label: 'Avg First Response', value: formatHours(avgFirstResponseHours), hint: 'Within your scope' },
      { key: 'demand_trend', label: 'Demand Trend', value: topRequested.map((x) => x.label).join(', ') || '—', hint: 'Marketplace trend (MVP)' },
    ]
  })()

  return {
    totals: {
      buyer_requests: scopedRequirements.length,
      open_buyer_requests: scopedRequirements.filter((r) => r.status === 'open').length,
      chats: uniqueActiveChats,
      messages: scopedMessages.length,
      partner_network: connectedPartners,
      contracts: contractDocs.length,
      documents: scopedDocuments.length,
      factories: users.filter((u) => u.role === 'factory').length,
    },
    top_metrics,
    analytics_events: {
      total: scopedEvents.length,
      by_type: byType,
    },
    interaction_summary: interactionSummary,
    series: {
      buyer_requests: toMonthlySeries(scopedRequirements, 'created_at'),
      chats: toMonthlySeries(scopedMessages, 'timestamp'),
      documents: toMonthlySeries(scopedDocuments, 'created_at'),
    },
  }
}


export async function getCompanyAnalytics(user) {
  ensureAnalyticsDashboardAccess(user)

  const [events, products, productViews, messages, documents, users] = await Promise.all([
    readJson(FILE),
    readJson('company_products.json'),
    readJson('product_views.json'),
    readJson('messages.json'),
    readJson('documents.json'),
    readJson('users.json'),
  ])

  const actorRole = String(user?.role || '').toLowerCase()
  const orgOwnerId = actorRole === 'agent'
    ? String(user?.org_owner_id || '')
    : String(user?.id || '')

  if (!orgOwnerId) throw forbiddenError()

  const orgAgents = (Array.isArray(users) ? users : [])
    .filter((u) => String(u.org_owner_id || '') === orgOwnerId && String(u.role || '').toLowerCase() === 'agent')
  const orgMemberIds = new Set([orgOwnerId, ...orgAgents.map((u) => String(u.id))])

  const orgProducts = (Array.isArray(products) ? products : [])
    .filter((p) => String(p.company_id || '') === orgOwnerId)
  const productById = new Map(orgProducts.map((p) => [String(p.id), p]))

  const orgViews = (Array.isArray(productViews) ? productViews : [])
    .filter((v) => productById.has(String(v.product_id)))

  const viewsByProduct = orgViews.reduce((acc, v) => {
    const pid = String(v.product_id || '')
    if (!pid) return acc
    acc[pid] = (acc[pid] || 0) + 1
    return acc
  }, {})

  const topProducts = Object.entries(viewsByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([productId, views]) => ({
      product_id: productId,
      title: productById.get(productId)?.title || 'Product',
      views,
    }))

  const profileEvents = (Array.isArray(events) ? events : [])
    .filter((e) => String(e.type || '') === 'profile_view' && String(e.entity_id || '') === orgOwnerId)

  const profileVisitsByCountry = profileEvents.reduce((acc, e) => {
    const country = String(e?.metadata?.country || 'Unknown')
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {})

  const profileVisitsByCountryList = Object.entries(profileVisitsByCountry)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({ country, count }))

  const orgMessages = (Array.isArray(messages) ? messages : [])
    .filter((m) => {
      const matchId = String(m.match_id || '')
      const parts = matchId.split(':')
      if (parts.length !== 2) return false
      return String(parts[1]) === orgOwnerId
    })

  const inboundMessages = orgMessages.filter((m) => !orgMemberIds.has(String(m.sender_id || ''))).length
  const conversationIds = new Set(orgMessages.map((m) => m.match_id).filter(Boolean))

  const contractDocs = (Array.isArray(documents) ? documents : [])
    .filter((d) => d.entity_type === 'contract' || String(d.type || '').toLowerCase().includes('contract'))
    .filter((d) => String(d.factory_id || '') === orgOwnerId || String(d.buyer_id || '') === orgOwnerId)

  const conversionRate = calcPercent(contractDocs.length, conversationIds.size)

  const messagesByMatch = new Map()
  for (const m of orgMessages) {
    const matchId = String(m.match_id || '')
    if (!matchId) continue
    if (!messagesByMatch.has(matchId)) messagesByMatch.set(matchId, [])
    messagesByMatch.get(matchId).push(m)
  }

  const responseTimes = []
  for (const msgs of messagesByMatch.values()) {
    const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
    const firstInbound = sorted.find((m) => !orgMemberIds.has(String(m.sender_id || '')))
    if (!firstInbound?.timestamp) continue
    const inboundAt = new Date(firstInbound.timestamp).getTime()
    if (!Number.isFinite(inboundAt)) continue
    const firstOutbound = sorted.find((m) => orgMemberIds.has(String(m.sender_id || '')) && new Date(m.timestamp).getTime() >= inboundAt)
    if (!firstOutbound?.timestamp) continue
    const outboundAt = new Date(firstOutbound.timestamp).getTime()
    if (!Number.isFinite(outboundAt)) continue
    responseTimes.push((outboundAt - inboundAt) / (1000 * 60 * 60))
  }

  const avgResponseHours = responseTimes.length
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0

  return {
    totals: {
      profile_visits: profileEvents.length,
      product_views: orgViews.length,
      inbound_messages: inboundMessages,
      conversations: conversationIds.size,
      contracts: contractDocs.length,
      conversion_rate_pct: conversionRate,
      avg_response_hours: Math.round(avgResponseHours * 10) / 10,
      avg_response_time: formatHours(avgResponseHours),
    },
    top_products: topProducts,
    profile_visits_by_country: profileVisitsByCountryList,
  }
}

export async function getPlatformAnalytics(user) {
  ensureAnalyticsAdminAccess(user)

  const [requirements, users] = await Promise.all([
    readJson('requirements.json'),
    readJson('users.json'),
  ])

  const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  const byCountry = {}
  const globalCategories = {}
  const priceBuckets = {}

  const requirementsRows = Array.isArray(requirements) ? requirements : []

  for (const req of requirementsRows) {
    const buyer = usersById.get(String(req.buyer_id || ''))
    const country = String(buyer?.profile?.country || 'Unknown')
    const category = String(req.category || req.product || 'Other')

    if (!byCountry[country]) byCountry[country] = {}
    byCountry[country][category] = (byCountry[country][category] || 0) + 1
    globalCategories[category] = (globalCategories[category] || 0) + 1

    const bucket = bucketPriceRange(req.price_range || req.priceRange || '')
    priceBuckets[bucket] = (priceBuckets[bucket] || 0) + 1
  }

  const topCategoriesByCountry = Object.entries(byCountry).map(([country, categories]) => ({
    country,
    categories: Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count]) => ({ label, count })),
  }))

  const topCategoriesGlobal = Object.entries(globalCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count]) => ({ label, count }))

  const priceRangeDemand = Object.entries(priceBuckets)
    .sort((a, b) => b[1] - a[1])
    .map(([bucket, count]) => ({ bucket, count }))

  const buyerCounts = requirementsRows.reduce((acc, r) => {
    const bid = String(r.buyer_id || '')
    if (!bid) return acc
    acc[bid] = (acc[bid] || 0) + 1
    return acc
  }, {})
  const buyers = Object.keys(buyerCounts)
  const repeatBuyers = buyers.filter((bid) => buyerCounts[bid] >= 2).length
  const repeatBuyerRate = calcPercent(repeatBuyers, buyers.length)

  return {
    totals: {
      buyer_requests: requirementsRows.length,
      repeat_buyer_rate: repeatBuyerRate,
    },
    top_categories_by_country: topCategoriesByCountry,
    top_categories_global: topCategoriesGlobal,
    monthly_demand_trend: toMonthlySeries(requirementsRows, 'created_at'),
    price_range_demand: priceRangeDemand,
  }
}
