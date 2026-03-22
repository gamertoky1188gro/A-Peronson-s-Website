import { createProduct, listProducts, removeProduct, updateProductById } from '../services/productService.js'
import {
  buildLimitError,
  buildSearchAccessPayload,
  canUseAdvancedFilters,
  consumeQuota,
  extractUsedAdvancedFilters,
  getQuotaSnapshot,
  getUserPlan,
} from '../services/searchAccessService.js'
import { readJson } from '../utils/jsonStore.js'
import { listMyProductViews, recordView } from '../services/productViewService.js'
import { findUserById } from '../services/userService.js'
import { handleControllerError } from '../utils/permissions.js'

function parseNumber(value) {
  if (value === undefined || value === null) return null
  const raw = String(value).trim()
  if (!raw) return null
  const n = Number(raw.replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : null
}

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value
  return String(value || '').toLowerCase() === 'true'
}

function parseCoordinate(value) {
  const n = Number(String(value || '').trim())
  return Number.isFinite(n) ? n : null
}

function parseRange(value) {
  const raw = String(value || '').trim()
  if (!raw) return { min: null, max: null }
  const parts = raw.split('-').map((part) => parseNumber(part))
  const min = Number.isFinite(parts[0]) ? parts[0] : null
  const max = Number.isFinite(parts[1]) ? parts[1] : null
  if (min === null && max === null) {
    const single = parseNumber(raw)
    return { min: single, max: single }
  }
  return { min, max }
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function buildSearchTokens(raw) {
  const base = normalizeSearchText(raw)
  if (!base) return []
  const tokens = base
    .split(/\s+/)
    .map((token) => (token === 'woman' ? 'women' : token))
    .filter(Boolean)
  return [...new Set(tokens)]
}

function rangesOverlap(filterRange, valueRange) {
  if (!filterRange) return true
  const filter = parseRange(filterRange)
  const value = parseRange(valueRange)
  if (filter.min === null && filter.max === null) return true
  if (value.min === null && value.max === null) return false

  const fMin = filter.min ?? filter.max
  const fMax = filter.max ?? filter.min
  const vMin = value.min ?? value.max
  const vMax = value.max ?? value.min

  if (fMin !== null && vMax !== null && vMax < fMin) return false
  if (fMax !== null && vMin !== null && vMin > fMax) return false
  return true
}

function matchesMoqRange(rawRange, moqValue) {
  if (!rawRange) return true
  const moq = Number.isFinite(Number(moqValue)) ? Number(moqValue) : parseNumber(moqValue)
  if (!Number.isFinite(moq)) return false

  const range = String(rawRange || '').trim()
  const parts = range.split('-').map((p) => parseNumber(p))
  const min = Number.isFinite(parts[0]) ? parts[0] : null
  const max = Number.isFinite(parts[1]) ? parts[1] : null

  if (min !== null && moq < min) return false
  if (max !== null && moq > max) return false
  return true
}

function buildOrgMemberIndex(users = []) {
  const ownerByMember = new Map()
  const membersByOwner = new Map()

  for (const user of users) {
    const userId = String(user?.id || '')
    if (!userId) continue
    const role = String(user?.role || '').toLowerCase()
    const ownerId = role === 'agent' && user?.org_owner_id ? String(user.org_owner_id) : userId
    ownerByMember.set(userId, ownerId)
    if (!membersByOwner.has(ownerId)) membersByOwner.set(ownerId, new Set([ownerId]))
    membersByOwner.get(ownerId).add(userId)
  }

  return { ownerByMember, membersByOwner }
}

function buildResponseTimeByOwner(messages = [], users = []) {
  const { ownerByMember } = buildOrgMemberIndex(users)
  const messagesByMatch = new Map()

  for (const msg of messages) {
    const matchId = String(msg?.match_id || '')
    if (!matchId || matchId.startsWith('friend:')) continue
    if (!messagesByMatch.has(matchId)) messagesByMatch.set(matchId, [])
    messagesByMatch.get(matchId).push(msg)
  }

  const responseTimes = new Map()

  for (const msgs of messagesByMatch.values()) {
    const sorted = msgs.slice().sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')))
    const ownersInMatch = new Set(sorted.map((m) => ownerByMember.get(String(m.sender_id || '')) || String(m.sender_id || '')).filter(Boolean))

    for (const ownerId of ownersInMatch) {
      let inboundAt = null
      for (const message of sorted) {
        const senderOwner = ownerByMember.get(String(message.sender_id || '')) || String(message.sender_id || '')
        if (!senderOwner || senderOwner === ownerId) continue
        const ts = new Date(message.timestamp || '').getTime()
        if (!Number.isFinite(ts)) continue
        inboundAt = ts
        break
      }
      if (!inboundAt) continue

      let outboundAt = null
      for (const message of sorted) {
        const senderOwner = ownerByMember.get(String(message.sender_id || '')) || String(message.sender_id || '')
        if (!senderOwner || senderOwner !== ownerId) continue
        const ts = new Date(message.timestamp || '').getTime()
        if (!Number.isFinite(ts) || ts < inboundAt) continue
        outboundAt = ts
        break
      }
      if (!outboundAt) continue

      const hours = (outboundAt - inboundAt) / (1000 * 60 * 60)
      if (!responseTimes.has(ownerId)) responseTimes.set(ownerId, [])
      responseTimes.get(ownerId).push(hours)
    }
  }

  const averages = new Map()
  for (const [ownerId, times] of responseTimes.entries()) {
    const avg = times.length ? (times.reduce((a, b) => a + b, 0) / times.length) : 0
    averages.set(ownerId, Math.round(avg * 10) / 10)
  }

  return averages
}

function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const r = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return r * c
}

function bucketResponseTime(avgHours) {
  if (!Number.isFinite(avgHours) || avgHours <= 0) return 'unknown'
  if (avgHours <= 4) return '0-4h'
  if (avgHours <= 12) return '4-12h'
  if (avgHours <= 24) return '12-24h'
  return '24h+'
}

function bucketYearsInBusiness(value) {
  const years = Number(value)
  if (!Number.isFinite(years) || years <= 0) return 'unknown'
  if (years <= 2) return '0-2y'
  if (years <= 5) return '3-5y'
  if (years <= 10) return '6-10y'
  return '10y+'
}

function bucketTeamSeats(value) {
  const seats = Number(value)
  if (!Number.isFinite(seats) || seats <= 0) return 'unknown'
  if (seats <= 5) return '1-5'
  if (seats <= 10) return '6-10'
  if (seats <= 20) return '11-20'
  return '20+'
}

function topFacetEntries(counts = {}, limit = 8) {
  return Object.fromEntries(
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit),
  )
}

async function resolveActor(req) {
  if (!req.user || req.user.role !== 'agent') return req.user
  const actor = await findUserById(req.user.id)
  return actor || req.user
}

export async function postProduct(req, res) {
  try {
    const actor = await resolveActor(req)
    const row = await createProduct(actor, req.body)
    return res.status(201).json(row)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function getProducts(req, res) {
  const mine = req.query.mine === 'true'
  const category = req.query.category || ''
  const actor = await resolveActor(req)
  const companyId = mine
    ? (actor?.role === 'agent' ? String(actor?.org_owner_id || '') : String(actor?.id || ''))
    : ''
  if (mine && actor?.role === 'agent' && !actor?.permission_matrix?.products?.edit) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  if (mine && actor?.role === 'agent' && !companyId) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  return res.json(await listProducts({
    category,
    companyId,
    includeDrafts: mine,
    viewerId: companyId,
    viewerRole: actor?.role || '',
  }))
}

export async function searchProducts(req, res) {
  const plan = await getUserPlan(req.user.id)
  const advancedFilters = extractUsedAdvancedFilters(req.query)
  const quotaPreview = advancedFilters.length > 0
    ? await getQuotaSnapshot(req.user.id, 'products_search', plan)
    : null

  if (advancedFilters.length > 0 && !canUseAdvancedFilters(plan)) {
    return res.status(403).json(buildLimitError({
      code: 'upgrade_required',
      message: 'Advanced filters require a premium plan',
      quota: quotaPreview,
      missingFilters: advancedFilters,
      upgradeRequired: true,
    }))
  }

  const quotaUse = advancedFilters.length > 0
    ? await consumeQuota(req.user.id, 'products_search', plan)
    : { allowed: true, quota: { action: 'products_search', plan, unlimited: true } }
  if (advancedFilters.length > 0 && !quotaUse.allowed) {
    return res.status(429).json(buildLimitError({
      code: 'limit_reached',
      message: 'Daily product search limit reached',
      quota: quotaUse.quota,
    }))
  }

  const all = await listProducts({})
  const [users, messages] = await Promise.all([
    readJson('users.json'),
    readJson('messages.json'),
  ])
  const usersById = new Map(users.map((u) => [u.id, u]))
  const responseTimeByOwner = buildResponseTimeByOwner(messages, users)

  const q = String(req.query.q || '').trim()
  const searchTokens = buildSearchTokens(q)
  const wantedIndustry = String(req.query.industry || '').trim().toLowerCase()
  const wantedCountry = String(req.query.country || '').trim().toLowerCase()
  const wantedOrgType = String(req.query.orgType || '').trim().toLowerCase()
  const verifiedOnly = req.query.verifiedOnly === 'true'
  const moqRange = String(req.query.moqRange || '').trim()
  const priceRange = String(req.query.priceRange || '').trim()
  const wantedCertificationsRaw = String(req.query.certifications || '').trim()
  const wantedCertifications = wantedCertificationsRaw
    ? wantedCertificationsRaw.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean)
    : []
  const leadTimeMax = parseNumber(req.query.leadTimeMax)
  const capacityMin = parseNumber(req.query.capacityMin)
  const gsmMin = parseNumber(req.query.gsmMin)
  const gsmMax = parseNumber(req.query.gsmMax)
  const wantedFabricType = String(req.query.fabricType || '').trim().toLowerCase()
  const wantedSizeRange = String(req.query.sizeRange || '').trim().toLowerCase()
  const wantedColorPantone = String(req.query.colorPantone || '').trim().toLowerCase()
  const wantedCustomization = String(req.query.customization || '').trim().toLowerCase()
  const sampleAvailable = req.query.sampleAvailable === 'true'
  const sampleLeadTimeMax = parseNumber(req.query.sampleLeadTime)
  const wantedPaymentTerms = String(req.query.paymentTerms || '').trim().toLowerCase()
  const wantedDocumentReady = String(req.query.documentReady || '').trim().toLowerCase()
  const wantedAuditDate = String(req.query.auditDate || '').trim().toLowerCase()
  const wantedLanguage = String(req.query.languageSupport || '').trim().toLowerCase()
  const wantedIncoterms = String(req.query.incoterms || '').trim().toLowerCase()
  const processes = parseList(req.query.processes)
  const yearsInBusinessMin = parseNumber(req.query.yearsInBusinessMin)
  const responseTimeMax = parseNumber(req.query.responseTimeMax)
  const teamSeatsMin = parseNumber(req.query.teamSeatsMin)
  const handlesMultipleFactoriesFilter = req.query.handlesMultipleFactories !== undefined
    ? parseBoolean(req.query.handlesMultipleFactories)
    : null
  const exportPorts = parseList(req.query.exportPort)
  const distanceKm = parseNumber(req.query.distanceKm)
  const locationLat = parseCoordinate(req.query.locationLat)
  const locationLng = parseCoordinate(req.query.locationLng)
  const distanceFilterActive = distanceKm !== null && locationLat !== null && locationLng !== null

  const results = all
    .map((p) => {
      const company = usersById.get(p.company_id) || null
      const authorCountry = String(company?.profile?.country || '').trim()
      const profile = company?.profile || {}
      return {
        ...p,
        author: company ? {
          id: company.id,
          name: company.name,
          role: company.role,
          verified: Boolean(company.verified),
          country: authorCountry,
          industry: String(profile?.industry || ''),
          certifications: Array.isArray(profile?.certifications) ? profile.certifications : [],
          monthly_capacity: profile?.monthly_capacity || '',
          lead_time_days: profile?.lead_time_days || '',
          payment_terms: profile?.payment_terms || '',
          document_ready: profile?.document_ready || '',
          audit_date: profile?.audit_date || '',
          language_support: profile?.language_support || '',
          incoterms: profile?.incoterms || '',
          main_processes: Array.isArray(profile?.main_processes) ? profile.main_processes : [],
          years_in_business: profile?.years_in_business || '',
          handles_multiple_factories: Boolean(profile?.handles_multiple_factories),
          team_seats: profile?.team_seats || '',
          export_ports: Array.isArray(profile?.export_ports) ? profile.export_ports : [],
          location_lat: profile?.location_lat ?? '',
          location_lng: profile?.location_lng ?? '',
          avg_response_hours: responseTimeByOwner.get(String(company.id)) ?? null,
        } : { id: p.company_id, name: 'Unknown company', role: 'factory', verified: false, country: '' },
        profile_key: `user:${p.company_id}`,
      }
    })
    .filter((p) => {
      if (searchTokens.length) {
        const searchText = normalizeSearchText(`${p.title} ${p.category} ${p.material} ${p.description} ${p.color_pantone || ''} ${p.size_range || ''}`)
        const hit = searchTokens.every((token) => searchText.includes(token))
        if (!hit) return false
      }
      if (req.query.category && String(p.category).toLowerCase() !== String(req.query.category).toLowerCase()) return false
      if (wantedIndustry) {
        const productIndustry = String(p.industry || '').toLowerCase()
        const authorIndustry = String(p.author?.industry || '').toLowerCase()
        if (productIndustry !== wantedIndustry && authorIndustry !== wantedIndustry) return false
      }
      if (wantedOrgType && String(p.author?.role || '').toLowerCase() !== wantedOrgType) return false
      if (wantedCountry && String(p.author?.country || '').toLowerCase() !== wantedCountry) return false
      if (verifiedOnly && !p.author?.verified) return false
      if (moqRange && !matchesMoqRange(moqRange, p.moq)) return false
      if (priceRange && !rangesOverlap(priceRange, p.price_range || '')) return false
      if (leadTimeMax !== null) {
        const lead = parseNumber(p.lead_time_days || p.author?.lead_time_days || '')
        if (lead === null || lead > leadTimeMax) return false
      }
      if (capacityMin !== null) {
        const cap = parseNumber(p.author?.monthly_capacity || '')
        if (cap === null || cap < capacityMin) return false
      }
      if (gsmMin !== null || gsmMax !== null) {
        const gsm = parseNumber(p.fabric_gsm || '')
        if (gsm === null) return false
        if (gsmMin !== null && gsm < gsmMin) return false
        if (gsmMax !== null && gsm > gsmMax) return false
      }
      if (wantedCertifications.length > 0) {
        const authorCerts = Array.isArray(p.author?.certifications) ? p.author.certifications.map((c) => String(c).toLowerCase()) : []
        const hit = wantedCertifications.some((c) => authorCerts.includes(c))
        if (!hit) return false
      }
      if (wantedFabricType && !String(p.material || '').toLowerCase().includes(wantedFabricType)) return false
      if (wantedSizeRange && !String(p.size_range || '').toLowerCase().includes(wantedSizeRange)) return false
      if (wantedColorPantone && !String(p.color_pantone || '').toLowerCase().includes(wantedColorPantone)) return false
      if (wantedCustomization && !String(p.customization_capabilities || '').toLowerCase().includes(wantedCustomization)) return false
      if (sampleAvailable) {
        const available = String(p.sample_available || '').toLowerCase()
        if (!(available === 'true' || available === 'yes' || p.sample_lead_time_days)) return false
      }
      if (sampleLeadTimeMax !== null) {
        const sampleLead = parseNumber(p.sample_lead_time_days || '')
        if (sampleLead === null || sampleLead > sampleLeadTimeMax) return false
      }
      if (wantedPaymentTerms && String(p.author?.payment_terms || '').toLowerCase() !== wantedPaymentTerms) return false
      if (wantedDocumentReady && String(p.author?.document_ready || '').toLowerCase() !== wantedDocumentReady) return false
      if (wantedAuditDate && String(p.author?.audit_date || '').toLowerCase() !== wantedAuditDate) return false
      if (wantedLanguage && String(p.author?.language_support || '').toLowerCase() !== wantedLanguage) return false
      if (wantedIncoterms && String(p.author?.incoterms || '').toLowerCase() !== wantedIncoterms) return false
      if (processes.length > 0) {
        const authorProcesses = Array.isArray(p.author?.main_processes)
          ? p.author.main_processes.map((proc) => String(proc).toLowerCase())
          : []
        const hit = processes.some((proc) => authorProcesses.includes(proc))
        if (!hit) return false
      }
      if (yearsInBusinessMin !== null) {
        const years = parseNumber(p.author?.years_in_business || '')
        if (years === null || years < yearsInBusinessMin) return false
      }
      if (teamSeatsMin !== null) {
        const seats = parseNumber(p.author?.team_seats || '')
        if (seats === null || seats < teamSeatsMin) return false
      }
      if (handlesMultipleFactoriesFilter !== null) {
        if (Boolean(p.author?.handles_multiple_factories) !== handlesMultipleFactoriesFilter) return false
      }
      if (exportPorts.length > 0) {
        const authorPorts = Array.isArray(p.author?.export_ports)
          ? p.author.export_ports.map((port) => String(port).toLowerCase())
          : []
        const hit = exportPorts.some((port) => authorPorts.includes(port))
        if (!hit) return false
      }
      if (responseTimeMax !== null) {
        const avg = Number(p.author?.avg_response_hours)
        if (!Number.isFinite(avg) || avg > responseTimeMax) return false
      }
      if (distanceFilterActive) {
        const authorLat = parseCoordinate(p.author?.location_lat)
        const authorLng = parseCoordinate(p.author?.location_lng)
        if (authorLat !== null && authorLng !== null) {
          const distance = haversineDistanceKm(locationLat, locationLng, authorLat, authorLng)
          if (!Number.isFinite(distance) || distance > distanceKm) return false
        } else if (!wantedCountry) {
          return false
        }
      }
      return true
    })

  const facets = results.reduce((acc, row) => {
    const category = String(row.category || 'Other')
    const country = String(row.author?.country || 'Unknown')
    acc.categories[category] = (acc.categories[category] || 0) + 1
    acc.countries[country] = (acc.countries[country] || 0) + 1
    acc.verified[row.author?.verified ? 'verified' : 'unverified'] += 1
    const processesList = Array.isArray(row.author?.main_processes) ? row.author.main_processes : []
    processesList.forEach((proc) => {
      const key = String(proc || 'Other')
      acc.processes[key] = (acc.processes[key] || 0) + 1
    })
    const exportPortsList = Array.isArray(row.author?.export_ports) ? row.author.export_ports : []
    exportPortsList.forEach((port) => {
      const key = String(port || 'Other')
      acc.export_ports[key] = (acc.export_ports[key] || 0) + 1
    })
    const responseBucket = bucketResponseTime(Number(row.author?.avg_response_hours))
    acc.response_time[responseBucket] = (acc.response_time[responseBucket] || 0) + 1
    const yearsBucket = bucketYearsInBusiness(row.author?.years_in_business)
    acc.years_in_business[yearsBucket] = (acc.years_in_business[yearsBucket] || 0) + 1
    const seatsBucket = bucketTeamSeats(row.author?.team_seats)
    acc.team_seats[seatsBucket] = (acc.team_seats[seatsBucket] || 0) + 1
    const handlesKey = row.author?.handles_multiple_factories ? 'true' : 'false'
    acc.handles_multiple_factories[handlesKey] = (acc.handles_multiple_factories[handlesKey] || 0) + 1
    return acc
  }, {
    categories: {},
    countries: {},
    verified: { verified: 0, unverified: 0 },
    processes: {},
    export_ports: {},
    response_time: {},
    years_in_business: {},
    team_seats: {},
    handles_multiple_factories: {},
  })

  const cappedFacets = {
    ...facets,
    processes: topFacetEntries(facets.processes, 8),
    export_ports: topFacetEntries(facets.export_ports, 8),
  }

  return res.json({
    items: results,
    facets: cappedFacets,
    ...buildSearchAccessPayload({
      action: 'products_search',
      plan,
      quota: quotaUse.quota,
    }),
  })
}

export async function updateProduct(req, res) {
  const actor = await resolveActor(req)
  const updated = await updateProductById(actor, req.params.productId, req.body || {})
  if (updated === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!updated) return res.status(404).json({ error: 'Product not found' })
  return res.json(updated)
}

export async function deleteProduct(req, res) {
  const actor = await resolveActor(req)
  const removed = await removeProduct(actor, req.params.productId)
  if (removed === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!removed) return res.status(404).json({ error: 'Product not found' })
  return res.json({ ok: true })
}

export async function recordProductView(req, res) {
  const result = await recordView(req.user.id, req.params.productId, { windowMinutes: 10 })
  if (result === 'not_found') return res.status(404).json({ error: 'Product not found' })
  return res.status(201).json(result)
}

export async function getMyViewedProducts(req, res) {
  const cursor = Number.isFinite(Number(req.query.cursor)) ? Math.max(0, Math.floor(Number(req.query.cursor))) : 0
  const limitRaw = Number.isFinite(Number(req.query.limit)) ? Math.floor(Number(req.query.limit)) : 10
  const limit = Math.min(50, Math.max(1, limitRaw))
  return res.json(await listMyProductViews(req.user.id, { cursor, limit }))
}
