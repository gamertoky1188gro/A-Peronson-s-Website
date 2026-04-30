    1 | import crypto from 'crypto'
    2 | import prisma from '../utils/prisma.js'
    3 | import { createNotification } from './notificationService.js'
    4 | 
    5 | const ENFORCEMENT_ACTIONS = Object.freeze({
    6 |   SOFT_WARNING: 'soft_warning',
    7 |   TEMP_COMMUNICATION_THROTTLE: 'temporary_communication_throttle',
    8 |   FEATURE_LOCK: 'feature_lock',
    9 |   MANUAL_REVIEW_QUEUE: 'manual_review_queue',
   10 | })
   11 | 
   12 | function actionForScore(score) {
   13 |   const trust = Number(score || 0)
   14 |   if (trust >= 75) return ENFORCEMENT_ACTIONS.SOFT_WARNING
   15 |   if (trust >= 50) return ENFORCEMENT_ACTIONS.TEMP_COMMUNICATION_THROTTLE
   16 |   if (trust >= 25) return ENFORCEMENT_ACTIONS.FEATURE_LOCK
   17 |   return ENFORCEMENT_ACTIONS.MANUAL_REVIEW_QUEUE
   18 | }
   19 | 
   20 | function renderTemplate(template, context = {}) {
   21 |   return String(template || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
   22 |     const value = context[key]
   23 |     return value == null ? '' : String(value)
   24 |   })
   25 | }
   26 | 
   27 | async function getTemplate(templateKey, fallback) {
   28 |   const template = await prisma.governanceNotificationTemplate.findUnique({ where: { template_key: templateKey } })
   29 |   return template?.active ? template : fallback
   30 | }
   31 | 
   32 | export async function applyEnforcement({ userId, evaluationId = null, policyDefinitionId = null, policyVersionId = null, actorId = null, reason = '' }) {
   33 |   const latestEval = evaluationId
   34 |     ? await prisma.trustRiskEvaluation.findUnique({ where: { id: evaluationId } })
   35 |     : await prisma.trustRiskEvaluation.findFirst({ where: { user_id: userId }, orderBy: { created_at: 'desc' } })
   36 | 
   37 |   if (!latestEval) {
   38 |     const error = new Error('No trust evaluation found for user')
   39 |     error.status = 404
   40 |     throw error
   41 |   }
   42 | 
   43 |   const action = actionForScore(latestEval.trust_score)
   44 |   const now = new Date()
   45 |   const expiresAt = action === ENFORCEMENT_ACTIONS.TEMP_COMMUNICATION_THROTTLE
   46 |     ? new Date(now.getTime() + (6 * 60 * 60 * 1000))
   47 |     : null
   48 | 
   49 |   const enforcement = await prisma.governanceEnforcement.create({
   50 |     data: {
   51 |       id: crypto.randomUUID(),
   52 |       user_id: String(userId),
   53 |       evaluation_id: latestEval.id,
   54 |       policy_definition_id: policyDefinitionId,
   55 |       policy_version_id: policyVersionId,
   56 |       action,
   57 |       reason: String(reason || 'Automated trust governance decision'),
   58 |       expires_at: expiresAt,
   59 |       created_by: actorId,
   60 |       metadata: {
   61 |         trust_score: latestEval.trust_score,
   62 |         signals: latestEval.signals || null,
   63 |       },
   64 |     },
   65 |   })
   66 | 
   67 |   if (action === ENFORCEMENT_ACTIONS.TEMP_COMMUNICATION_THROTTLE) {
   68 |     await prisma.user.update({
   69 |       where: { id: String(userId) },
   70 |       data: {
   71 |         messaging_restricted_until: expiresAt,
   72 |       },
   73 |     }).catch(() => null)
   74 |   }
   75 | 
   76 |   if (action === ENFORCEMENT_ACTIONS.FEATURE_LOCK) {
   77 |     await prisma.user.update({
   78 |       where: { id: String(userId) },
   79 |       data: {
   80 |         status: 'restricted',
   81 |       },
   82 |     }).catch(() => null)
   83 |   }
   84 | 
   85 |   if (action === ENFORCEMENT_ACTIONS.MANUAL_REVIEW_QUEUE) {
   86 |     await prisma.governanceManualReviewQueue.create({
   87 |       data: {
   88 |         id: crypto.randomUUID(),
   89 |         enforcement_id: enforcement.id,
   90 |         user_id: String(userId),
   91 |         reason: enforcement.reason,
   92 |         priority: 'high',
   93 |         payload: {
   94 |           trust_score: latestEval.trust_score,
   95 |           signals: latestEval.signals || {},
   96 |         },
   97 |       },
   98 |     })
   99 |   }
  100 | 
  101 |   const fallback = {
  102 |     subject: 'Trust governance update',
  103 |     body: 'Action {{action}} was applied to your account. You can appeal this decision from support.',
  104 |   }
  105 |   const template = await getTemplate('trust_decision_notice', fallback)
  106 |   await createNotification(String(userId), {
  107 |     type: 'trust_governance_decision',
  108 |     entity_type: 'governance_enforcement',
  109 |     entity_id: enforcement.id,
  110 |     message: renderTemplate(template.body, { action }),
  111 |     meta: {
  112 |       action,
  113 |       trust_score: latestEval.trust_score,
  114 |     },
  115 |   })
  116 | 
  117 |   return enforcement
  118 | }
  119 | 
  120 | export async function saveNotificationTemplate({ templateKey, subject, body, channel = 'in_app', actorId = null }) {
  121 |   const key = String(templateKey || '').trim()
  122 |   if (!key || !String(subject || '').trim() || !String(body || '').trim()) {
  123 |     const error = new Error('templateKey, subject and body are required')
  124 |     error.status = 400
  125 |     throw error
  126 |   }
  127 | 
  128 |   const existing = await prisma.governanceNotificationTemplate.findUnique({ where: { template_key: key } })
  129 |   if (existing) {
  130 |     return prisma.governanceNotificationTemplate.update({
  131 |       where: { id: existing.id },
  132 |       data: {
  133 |         channel: String(channel || 'in_app'),
  134 |         subject: String(subject),
  135 |         body: String(body),
  136 |         updated_at: new Date(),
  137 |       },
  138 |     })
  139 |   }
  140 | 
  141 |   return prisma.governanceNotificationTemplate.create({
  142 |     data: {
  143 |       id: crypto.randomUUID(),
  144 |       template_key: key,
  145 |       channel: String(channel || 'in_app'),
  146 |       subject: String(subject),
  147 |       body: String(body),
  148 |       created_by: actorId,
  149 |     },
  150 |   })
  151 | }
  152 | 
  153 | export async function fileGovernanceAppeal({ enforcementId, userId, reason }) {
  154 |   if (!String(enforcementId || '').trim() || !String(userId || '').trim() || !String(reason || '').trim()) {
  155 |     const error = new Error('enforcementId, userId and reason are required')
  156 |     error.status = 400
  157 |     throw error
  158 |   }
  159 | 
  160 |   const appeal = await prisma.governanceAppeal.create({
  161 |     data: {
  162 |       id: crypto.randomUUID(),
  163 |       enforcement_id: String(enforcementId),
  164 |       user_id: String(userId),
  165 |       reason: String(reason),
  166 |     },
  167 |   })
  168 | 
  169 |   const fallback = {
  170 |     subject: 'Appeal received',
  171 |     body: 'Your appeal for enforcement {{enforcement_id}} has been submitted.',
  172 |   }
  173 |   const template = await getTemplate('trust_appeal_received', fallback)
  174 |   await createNotification(String(userId), {
  175 |     type: 'trust_appeal_received',
  176 |     entity_type: 'governance_appeal',
  177 |     entity_id: appeal.id,
  178 |     message: renderTemplate(template.body, { enforcement_id: enforcementId }),
  179 |   })
  180 | 
  181 |   return appeal
  182 | }
  183 | 
  184 | export async function resolveGovernanceAppeal({ appealId, outcome, notes = '', actorId = null }) {
  185 |   const updated = await prisma.governanceAppeal.update({
  186 |     where: { id: String(appealId || '') },
  187 |     data: {
  188 |       status: 'resolved',
  189 |       outcome: String(outcome || 'upheld'),
  190 |       outcome_notes: String(notes || ''),
  191 |       reviewed_by: actorId,
  192 |       reviewed_at: new Date(),
  193 |       updated_at: new Date(),
  194 |     },
  195 |   })
  196 | 
  197 |   await createNotification(String(updated.user_id), {
  198 |     type: 'trust_appeal_resolved',
  199 |     entity_type: 'governance_appeal',
  200 |     entity_id: updated.id,
  201 |     message: `Your trust appeal has been resolved with outcome: ${updated.outcome}.`,
  202 |     meta: {
  203 |       outcome: updated.outcome,
  204 |       notes: updated.outcome_notes,
  205 |     },
  206 |   })
  207 | 
  208 |   return updated
  209 | }
  210 | 
  211 | export async function buildMonthlyGovernanceReport({ month, actorId = null }) {
  212 |   const monthValue = String(month || '').trim() || new Date().toISOString().slice(0, 7)
  213 |   const start = new Date(`${monthValue}-01T00:00:00.000Z`)
  214 |   const end = new Date(start)
  215 |   end.setUTCMonth(end.getUTCMonth() + 1)
  216 | 
  217 |   const [enforcements, evaluations, appeals] = await Promise.all([
  218 |     prisma.governanceEnforcement.findMany({ where: { created_at: { gte: start, lt: end } } }),
  219 |     prisma.trustRiskEvaluation.findMany({ where: { created_at: { gte: start, lt: end } } }),
  220 |     prisma.governanceAppeal.findMany({ where: { created_at: { gte: start, lt: end } } }),
  221 |   ])
  222 | 
  223 |   const total = enforcements.length
  224 |   const manualReviews = enforcements.filter((row) => row.action === ENFORCEMENT_ACTIONS.MANUAL_REVIEW_QUEUE).length
  225 |   const falsePositives = enforcements.filter((row) => String(row.status || '').toLowerCase() === 'reverted').length
  226 |   const appealOverturned = appeals.filter((row) => String(row.outcome || '').toLowerCase() === 'overturned').length
  227 | 
  228 |   const roleBuckets = evaluations.reduce((acc, row) => {
  229 |     const role = String(row.role || 'unknown')
  230 |     const current = acc[role] || { count: 0, totalScore: 0 }
  231 |     current.count += 1
  232 |     current.totalScore += Number(row.trust_score || 0)
  233 |     acc[role] = current
  234 |     return acc
  235 |   }, {})
  236 | 
  237 |   const trustScoreDriftByRole = Object.entries(roleBuckets).map(([role, value]) => ({
  238 |     role,
  239 |     average_trust_score: value.count ? Number((value.totalScore / value.count).toFixed(2)) : 0,
  240 |     evaluations: value.count,
  241 |   }))
  242 | 
  243 |   const metrics = {
  244 |     month: monthValue,
  245 |     policy_hit_rates: {
  246 |       total_enforcements: total,
  247 |       manual_review_rate: total ? Number((manualReviews / total).toFixed(4)) : 0,
  248 |     },
  249 |     false_positives: {
  250 |       reverted_actions: falsePositives,
  251 |       rate: total ? Number((falsePositives / total).toFixed(4)) : 0,
  252 |     },
  253 |     appeal_outcomes: {
  254 |       submitted: appeals.length,
  255 |       overturned: appealOverturned,
  256 |       uphold_rate: appeals.length ? Number(((appeals.length - appealOverturned) / appeals.length).toFixed(4)) : 0,
  257 |     },
  258 |     trust_score_drift_by_role: trustScoreDriftByRole,
  259 |   }
  260 | 
  261 |   return prisma.governanceMonthlyReport.upsert({
  262 |     where: { month: monthValue },
  263 |     create: {
  264 |       id: crypto.randomUUID(),
  265 |       month: monthValue,
  266 |       metrics,
  267 |       created_by: actorId,
  268 |     },
  269 |     update: {
  270 |       metrics,
  271 |       created_by: actorId,
  272 |     },
  273 |   })
  274 | }
  275 | 
  276 | export async function listEnforcementHistory({ limit = 100 }) {
  277 |   return prisma.governanceEnforcement.findMany({
  278 |     orderBy: { created_at: 'desc' },
  279 |     take: Math.max(1, Math.min(500, Number(limit) || 100)),
  280 |   })
  281 | }
  282 | 
  283 | export async function listGovernanceTemplates() {
  284 |   return prisma.governanceNotificationTemplate.findMany({ orderBy: { created_at: 'desc' } })
  285 | }
  286 | 