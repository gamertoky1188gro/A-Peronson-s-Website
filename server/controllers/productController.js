import { createProduct, listProducts } from '../services/productService.js'
import {
  buildLimitError,
  canUseAdvancedFilters,
  consumeQuota,
  extractUsedAdvancedFilters,
  getQuotaSnapshot,
  getUserPlan,
} from '../services/searchAccessService.js'

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
  const q = String(req.query.q || '').toLowerCase().trim()
  const results = all.filter((p) => {
    if (q && !`${p.title} ${p.category} ${p.material} ${p.description}`.toLowerCase().includes(q)) return false
    if (req.query.category && String(p.category).toLowerCase() !== String(req.query.category).toLowerCase()) return false
    return true
  })
  return res.json({
    items: results,
    quota: quotaUse.quota,
    plan,
  })
}
