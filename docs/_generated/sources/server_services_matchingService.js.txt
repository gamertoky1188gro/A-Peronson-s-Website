    1 | import { readJson, writeJson } from '../utils/jsonStore.js'
    2 | import { trackTransition } from '../utils/metrics.js'
    3 | import { recordWorkflowEvent } from './workflowLifecycleService.js'
    4 | 
    5 | const USERS_FILE = 'users.json'
    6 | const MATCHES_FILE = 'matches.json'
    7 | 
    8 | function scoreFactory(requirement, factory) {
    9 |   let score = 0
   10 |   const reqQty = Number(requirement.quantity || 0)
   11 |   const moq = Number(factory.profile?.moq || 0)
   12 |   const lead = Number(factory.profile?.lead_time_days || 0)
   13 |   const timeline = Number(requirement.timeline_days || 0)
   14 | 
   15 |   const categories = factory.profile?.categories || []
   16 |   if (categories.map((c) => c.toLowerCase()).includes(String(requirement.category || '').toLowerCase())) score += 40
   17 |   if (reqQty > 0 && moq > 0 && moq <= reqQty) score += 25
   18 | 
   19 |   const factoryCerts = (factory.profile?.certifications || []).map((c) => c.toLowerCase())
   20 |   const reqCerts = (requirement.certifications_required || []).map((c) => c.toLowerCase())
   21 |   const certHits = reqCerts.filter((c) => factoryCerts.includes(c)).length
   22 |   score += certHits * 10
   23 | 
   24 |   if (timeline > 0 && lead > 0 && lead <= timeline) score += 20
   25 | 
   26 |   return Math.min(100, score)
   27 | }
   28 | 
   29 | export async function generateMatchesForRequirement(requirement) {
   30 |   const users = await readJson(USERS_FILE)
   31 |   const factories = users.filter((u) => u.role === 'factory')
   32 | 
   33 |   const ranked = factories
   34 |     .map((factory) => ({
   35 |       requirement_id: requirement.id,
   36 |       factory_id: factory.id,
   37 |       score: scoreFactory(requirement, factory),
   38 |       status: 'pending',
   39 |     }))
   40 |     .filter((m) => m.score > 0)
   41 |     .sort((a, b) => b.score - a.score)
   42 | 
   43 |   const matches = await readJson(MATCHES_FILE)
   44 |   const withoutOld = matches.filter((m) => m.requirement_id !== requirement.id)
   45 |   await writeJson(MATCHES_FILE, [...withoutOld, ...ranked])
   46 | 
   47 |   if (ranked.length > 0) {
   48 |     await recordWorkflowEvent('match_confirmed', { requirement_id: requirement.id }, { match_count: ranked.length }).catch(() => null)
   49 |   }
   50 | 
   51 |   return ranked
   52 | }
   53 | 
   54 | export async function updateMatchStatus(requirementId, factoryId, status) {
   55 |   const matches = await readJson(MATCHES_FILE)
   56 |   const index = matches.findIndex((m) => m.requirement_id === requirementId && m.factory_id === factoryId)
   57 |   if (index < 0) return null
   58 |   const prev = matches[index].status
   59 |   matches[index].status = status
   60 |   await writeJson(MATCHES_FILE, matches)
   61 |   if (status === 'accepted') {
   62 |     await trackTransition(requirementId, prev, 'accepted', { factory_id: factoryId })
   63 |   }
   64 |   return matches[index]
   65 | }
   66 | 
   67 | export async function listMatchesForRequirement(requirementId) {
   68 |   const matches = await readJson(MATCHES_FILE)
   69 |   return matches.filter((m) => m.requirement_id === requirementId).sort((a, b) => b.score - a.score)
   70 | }
   71 | 
   72 | export async function listMatchesForFactory(factoryId) {
   73 |   const matches = await readJson(MATCHES_FILE)
   74 |   return matches.filter((m) => m.factory_id === factoryId).sort((a, b) => b.score - a.score)
   75 | }
   76 | 