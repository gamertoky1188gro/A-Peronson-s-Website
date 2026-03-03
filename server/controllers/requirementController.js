import { createRequirement, listRequirements, removeRequirement, getRequirementById, updateRequirement } from '../services/requirementService.js'
import {
  buildLimitError,
  buildSearchAccessPayload,
  canUseAdvancedFilters,
  consumeQuota,
  extractUsedAdvancedFilters,
  getQuotaSnapshot,
  getUserPlan,
} from '../services/searchAccessService.js'

export async function createBuyerRequirement(req, res) {
  const requirement = await createRequirement(req.user.id, req.body)
  return res.status(201).json(requirement)
}

export async function getRequirements(req, res) {
  const filters = {}
  if (req.user.role === 'buyer') filters.buyerId = req.user.id
  return res.json(await listRequirements(filters))
}

export async function getRequirement(req, res) {
  const requirement = await getRequirementById(req.params.requirementId)
  if (!requirement) return res.status(404).json({ error: 'Requirement not found' })
  return res.json(requirement)
}

export async function patchRequirement(req, res) {
  const updated = await updateRequirement(req.params.requirementId, req.body || {}, req.user)
  if (updated === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!updated) return res.status(404).json({ error: 'Requirement not found' })
  return res.json(updated)
}

export async function deleteRequirement(req, res) {
  const ok = await removeRequirement(req.params.requirementId, req.user)
  if (ok === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!ok) return res.status(404).json({ error: 'Requirement not found' })
  return res.json({ ok: true })
}

export async function searchRequirements(req, res) {
  const plan = await getUserPlan(req.user.id)
  const advancedFilters = extractUsedAdvancedFilters(req.query)
  const quotaPreview = await getQuotaSnapshot(req.user.id, 'requirements_search', plan)

  if (advancedFilters.length > 0 && !canUseAdvancedFilters(plan)) {
    return res.status(403).json(buildLimitError({
      code: 'upgrade_required',
      message: 'Advanced filters require a premium plan',
      quota: quotaPreview,
      missingFilters: advancedFilters,
      upgradeRequired: true,
    }))
  }

  const quotaUse = await consumeQuota(req.user.id, 'requirements_search', plan)
  if (!quotaUse.allowed) {
    return res.status(429).json(buildLimitError({
      code: 'limit_reached',
      message: 'Daily requirement search limit reached',
      quota: quotaUse.quota,
    }))
  }

  const all = await listRequirements({})
  const q = String(req.query.q || '').toLowerCase().trim()
  const results = all.filter((r) => {
    if (q && !`${r.category} ${r.material} ${r.custom_description}`.toLowerCase().includes(q)) return false
    if (req.query.category && String(r.category).toLowerCase() !== String(req.query.category).toLowerCase()) return false
    if (req.query.verifiedOnly === 'true' && !r.verified) return false
    return true
  })

  return res.json({
    items: results,
    ...buildSearchAccessPayload({
      action: 'requirements_search',
      plan,
      quota: quotaUse.quota,
    }),
  })
}
