import { createProduct, listProducts } from '../services/productService.js'
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

function parseNumber(value) {
  const n = Number(String(value || '').replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : null
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

export async function postProduct(req, res) {
  const row = await createProduct(req.user, req.body)
  return res.status(201).json(row)
}

export async function getProducts(req, res) {
  return res.json(await listProducts({ category: req.query.category }))
}

export async function searchProducts(req, res) {
  const plan = await getUserPlan(req.user.id)
  const advancedFilters = extractUsedAdvancedFilters(req.query)
  const quotaPreview = await getQuotaSnapshot(req.user.id, 'products_search', plan)

  if (advancedFilters.length > 0 && !canUseAdvancedFilters(plan)) {
    return res.status(403).json(buildLimitError({
      code: 'upgrade_required',
      message: 'Advanced filters require a premium plan',
      quota: quotaPreview,
      missingFilters: advancedFilters,
      upgradeRequired: true,
    }))
  }

  const quotaUse = await consumeQuota(req.user.id, 'products_search', plan)
  if (!quotaUse.allowed) {
    return res.status(429).json(buildLimitError({
      code: 'limit_reached',
      message: 'Daily product search limit reached',
      quota: quotaUse.quota,
    }))
  }

  const all = await listProducts({})
  const users = await readJson('users.json')
  const usersById = new Map(users.map((u) => [u.id, u]))

  const q = String(req.query.q || '').toLowerCase().trim()
  const wantedCountry = String(req.query.country || '').trim().toLowerCase()
  const wantedOrgType = String(req.query.orgType || '').trim().toLowerCase()
  const verifiedOnly = req.query.verifiedOnly === 'true'
  const moqRange = String(req.query.moqRange || '').trim()

  const results = all
    .map((p) => {
      const company = usersById.get(p.company_id) || null
      const authorCountry = String(company?.profile?.country || '').trim()
      return {
        ...p,
        author: company ? {
          id: company.id,
          name: company.name,
          role: company.role,
          verified: Boolean(company.verified),
          country: authorCountry,
        } : { id: p.company_id, name: 'Unknown company', role: 'factory', verified: false, country: '' },
        profile_key: `user:${p.company_id}`,
      }
    })
    .filter((p) => {
      if (q && !`${p.title} ${p.category} ${p.material} ${p.description}`.toLowerCase().includes(q)) return false
      if (req.query.category && String(p.category).toLowerCase() !== String(req.query.category).toLowerCase()) return false
      if (wantedOrgType && String(p.author?.role || '').toLowerCase() !== wantedOrgType) return false
      if (wantedCountry && String(p.author?.country || '').toLowerCase() !== wantedCountry) return false
      if (verifiedOnly && !p.author?.verified) return false
      if (moqRange && !matchesMoqRange(moqRange, p.moq)) return false
      return true
    })

  return res.json({
    items: results,
    ...buildSearchAccessPayload({
      action: 'products_search',
      plan,
      quota: quotaUse.quota,
    }),
  })
}
