import { createRequirement, listRequirements, closeRequirement, removeRequirement, getRequirementById } from '../services/requirementService.js'
import { listMatchesForRequirement, updateMatchStatus } from '../services/matchingService.js'

export async function createBuyerRequirement(req, res) {
  const result = await createRequirement(req.user.id, req.body)
  return res.status(201).json(result)
}

export async function getRequirements(req, res) {
  const filters = {}
  if (req.user.role === 'buyer') filters.buyerId = req.user.id
  return res.json(await listRequirements(filters))
}

export async function getRequirementMatches(req, res) {
  const requirement = await getRequirementById(req.params.requirementId)
  if (!requirement) return res.status(404).json({ error: 'Requirement not found' })
  return res.json(await listMatchesForRequirement(requirement.id))
}

export async function patchMatchStatus(req, res) {
  const updated = await updateMatchStatus(req.params.requirementId, req.params.factoryId, req.body?.status)
  if (!updated) return res.status(404).json({ error: 'Match not found' })
  return res.json(updated)
}

export async function closeBuyerRequirement(req, res) {
  const requirement = await closeRequirement(req.params.requirementId)
  if (!requirement) return res.status(404).json({ error: 'Requirement not found' })
  return res.json(requirement)
}

export async function adminDeleteRequirement(req, res) {
  const ok = await removeRequirement(req.params.requirementId)
  if (!ok) return res.status(404).json({ error: 'Requirement not found' })
  return res.json({ ok: true })
}
