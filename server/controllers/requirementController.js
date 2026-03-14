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
  const users = await readJson('users.json')
  const usersById = new Map(users.map((u) => [u.id, u]))

  const q = String(req.query.q || '').toLowerCase().trim()
  const wantedCountry = String(req.query.country || '').trim().toLowerCase()
  const wantedOrgType = String(req.query.orgType || '').trim().toLowerCase()
  const verifiedOnly = req.query.verifiedOnly === 'true'
  const moqRange = String(req.query.moqRange || '').trim()

  const results = all
    .map((r) => {
      const buyer = usersById.get(r.buyer_id) || null
      const authorCountry = String(buyer?.profile?.country || '').trim()
      return {
        ...r,
        author: buyer ? {
          id: buyer.id,
          name: buyer.name,
          role: buyer.role,
          verified: Boolean(buyer.verified),
          country: authorCountry,
        } : { id: r.buyer_id, name: 'Unknown buyer', role: 'buyer', verified: false, country: '' },
        profile_key: `user:${r.buyer_id}`,
      }
    })
    .filter((r) => {
      if (q && !`${r.category} ${r.material} ${r.custom_description}`.toLowerCase().includes(q)) return false
      if (req.query.category && String(r.category).toLowerCase() !== String(req.query.category).toLowerCase()) return false
      if (wantedOrgType && String(r.author?.role || '').toLowerCase() !== wantedOrgType) return false
      if (wantedCountry && String(r.author?.country || '').toLowerCase() !== wantedCountry) return false
      if (verifiedOnly && !r.author?.verified) return false
      if (moqRange && !matchesMoqRange(moqRange, r.quantity)) return false
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
