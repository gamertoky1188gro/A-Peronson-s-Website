import { readJson, writeJson } from '../utils/jsonStore.js'
import { trackTransition } from '../utils/metrics.js'
import { recordWorkflowEvent } from './workflowLifecycleService.js'

const USERS_FILE = 'users.json'
const MATCHES_FILE = 'matches.json'

function scoreFactory(requirement, factory) {
  let score = 0
  const reqQty = Number(requirement.quantity || 0)
  const moq = Number(factory.profile?.moq || 0)
  const lead = Number(factory.profile?.lead_time_days || 0)
  const timeline = Number(requirement.timeline_days || 0)

  const categories = factory.profile?.categories || []
  if (categories.map((c) => c.toLowerCase()).includes(String(requirement.category || '').toLowerCase())) score += 40
  if (reqQty > 0 && moq > 0 && moq <= reqQty) score += 25

  const factoryCerts = (factory.profile?.certifications || []).map((c) => c.toLowerCase())
  const reqCerts = (requirement.certifications_required || []).map((c) => c.toLowerCase())
  const certHits = reqCerts.filter((c) => factoryCerts.includes(c)).length
  score += certHits * 10

  if (timeline > 0 && lead > 0 && lead <= timeline) score += 20

  return Math.min(100, score)
}

export async function generateMatchesForRequirement(requirement) {
  const users = await readJson(USERS_FILE)
  const factories = users.filter((u) => u.role === 'factory')

  const ranked = factories
    .map((factory) => ({
      requirement_id: requirement.id,
      factory_id: factory.id,
      score: scoreFactory(requirement, factory),
      status: 'pending',
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)

  const matches = await readJson(MATCHES_FILE)
  const withoutOld = matches.filter((m) => m.requirement_id !== requirement.id)
  await writeJson(MATCHES_FILE, [...withoutOld, ...ranked])

  if (ranked.length > 0) {
    await recordWorkflowEvent('match_confirmed', { requirement_id: requirement.id }, { match_count: ranked.length }).catch(() => null)
  }

  return ranked
}

export async function updateMatchStatus(requirementId, factoryId, status) {
  const matches = await readJson(MATCHES_FILE)
  const index = matches.findIndex((m) => m.requirement_id === requirementId && m.factory_id === factoryId)
  if (index < 0) return null
  const prev = matches[index].status
  matches[index].status = status
  await writeJson(MATCHES_FILE, matches)
  if (status === 'accepted') {
    await trackTransition(requirementId, prev, 'accepted', { factory_id: factoryId })
  }
  return matches[index]
}

export async function listMatchesForRequirement(requirementId) {
  const matches = await readJson(MATCHES_FILE)
  return matches.filter((m) => m.requirement_id === requirementId).sort((a, b) => b.score - a.score)
}

export async function listMatchesForFactory(factoryId) {
  const matches = await readJson(MATCHES_FILE)
  return matches.filter((m) => m.factory_id === factoryId).sort((a, b) => b.score - a.score)
}
