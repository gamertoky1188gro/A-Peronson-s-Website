    1 | import prisma from './prisma.js'
    2 | 
    3 | const _mem = new Map()
    4 | 
    5 | function isTestEnv() {
    6 |   return process.env.NODE_ENV === 'test'
    7 | }
    8 | 
    9 | const locks = new Map()
   10 | 
   11 | function withLock(fileName, action) {
   12 |   const prior = locks.get(fileName) || Promise.resolve()
   13 |   const next = prior.then(action, action)
   14 |   locks.set(fileName, next.finally(() => {
   15 |     if (locks.get(fileName) === next) {
   16 |       locks.delete(fileName)
   17 |     }
   18 |   }))
   19 |   return next
   20 | }
   21 | 
   22 | function toSerializable(value) {
   23 |   if (value instanceof Date) return value.toISOString()
   24 |   if (Array.isArray(value)) return value.map(toSerializable)
   25 |   if (value && typeof value === 'object') {
   26 |     return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toSerializable(v)]))
   27 |   }
   28 |   return value
   29 | }
   30 | 
   31 | function normalizeRows(rows) {
   32 |   return Array.isArray(rows) ? rows.map((row) => toSerializable(row)) : rows
   33 | }
   34 | 
   35 | function stripUndefined(row = {}) {
   36 |   return Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined))
   37 | }
   38 | 
   39 | function normalizeUserRow(row = {}) {
   40 |   const next = { ...row }
   41 |   if (next.messaging_restricted_until === '') next.messaging_restricted_until = null
   42 |   if (next.password_reset_at === '') next.password_reset_at = null
   43 |   if (next.created_at === '') delete next.created_at
   44 |   if (next.updated_at === '') next.updated_at = null
   45 |   if (next.wallet_updated_at !== undefined) delete next.wallet_updated_at
   46 |   if (next.passkeys !== undefined) delete next.passkeys
   47 |   return next
   48 | }
   49 | 
   50 | function keyForRow(row, keyFields) {
   51 |   return keyFields.map((field) => String(row?.[field] ?? '')).join('::')
   52 | }
   53 | 
   54 | function buildWhereFromKey(keyFields, row) {
   55 |   return Object.fromEntries(keyFields.map((field) => [field, row[field]]))
   56 | }
   57 | 
   58 | async function syncTable({ model, rows, keyFields, uniqueKeyName = null }) {
   59 |   const delegate = prisma[model]
   60 |   if (!delegate) throw new Error(`Unknown Prisma model: ${model}`)
   61 | 
   62 |   const safeRows = Array.isArray(rows) ? rows.map((r) => stripUndefined(r)) : []
   63 |   const existing = await delegate.findMany()
   64 |   const existingByKey = new Map(existing.map((row) => [keyForRow(row, keyFields), row]))
   65 |   const nextByKey = new Map(safeRows.map((row) => [keyForRow(row, keyFields), row]))
   66 | 
   67 |   const missingKeys = [...existingByKey.keys()].filter((k) => !nextByKey.has(k))
   68 |   if (missingKeys.length) {
   69 |     const or = missingKeys
   70 |       .map((key) => {
   71 |         const parts = key.split('::')
   72 |         const condition = {}
   73 |         keyFields.forEach((field, idx) => {
   74 |           condition[field] = parts[idx]
   75 |         })
   76 |         return condition
   77 |       })
   78 |       .filter((cond) => Object.values(cond).every((v) => v !== ''))
   79 | 
   80 |     if (or.length) {
   81 |       await delegate.deleteMany({ where: { OR: or } })
   82 |     }
   83 |   }
   84 | 
   85 |   for (const row of safeRows) {
   86 |     const hasAllKeys = keyFields.every((field) => row[field] !== undefined && row[field] !== null && String(row[field]) !== '')
   87 |     if (!hasAllKeys) continue
   88 | 
   89 |     const where = uniqueKeyName
   90 |       ? { [uniqueKeyName]: buildWhereFromKey(keyFields, row) }
   91 |       : buildWhereFromKey(keyFields, row)
   92 | 
   93 |     await delegate.upsert({
   94 |       where,
   95 |       update: row,
   96 |       create: row,
   97 |     })
   98 |   }
   99 | 
  100 |   return safeRows
  101 | }
  102 | 
  103 | function tableHandler(model, keyFields = ['id'], uniqueKeyName = null) {
  104 |   return {
  105 |     read: async () => normalizeRows(await prisma[model].findMany()),
  106 |     write: async (rows) => syncTable({ model, rows, keyFields, uniqueKeyName }),
  107 |   }
  108 | }
  109 | 
  110 | const FILE_HANDLERS = {
  111 |   'users.json': {
  112 |     read: async () => normalizeRows(await prisma.user.findMany()),
  113 |     write: async (rows) => syncTable({
  114 |       model: 'user',
  115 |       rows: Array.isArray(rows) ? rows.map(normalizeUserRow) : rows,
  116 |       keyFields: ['id'],
  117 |     }),
  118 |   },
  119 |   'subscriptions.json': tableHandler('subscription', ['id']),
  120 |   'verification.json': tableHandler('verification', ['user_id']),
  121 |   'requirements.json': tableHandler('requirement', ['id']),
  122 |   'company_products.json': tableHandler('product', ['id']),
  123 |   'messages.json': tableHandler('message', ['id']),
  124 |   'message_requests.json': tableHandler('messageRequest', ['thread_id']),
  125 |   'notifications.json': tableHandler('notification', ['id']),
  126 |   'search_alerts.json': tableHandler('searchAlert', ['id']),
  127 |   'search_usage_counters.json': tableHandler('searchUsageCounter', ['user_id', 'action'], 'user_id_action'),
  128 |   'conversation_locks.json': tableHandler('conversationLock', ['request_id']),
  129 |   'partner_requests.json': tableHandler('partnerRequest', ['id']),
  130 |   'call_sessions.json': tableHandler('callSession', ['id']),
  131 |   'call_recording_views.json': tableHandler('callRecordingView', ['id']),
  132 |   'documents.json': tableHandler('document', ['id']),
  133 |   'leads.json': tableHandler('lead', ['id']),
  134 |   'lead_notes.json': tableHandler('leadNote', ['id']),
  135 |   'lead_reminders.json': tableHandler('leadReminder', ['id']),
  136 |   'interaction_logs.json': tableHandler('interactionLog', ['id']),
  137 |   'event_logs.json': tableHandler('eventLog', ['id']),
  138 |   'org_policies.json': tableHandler('orgPolicy', ['id']),
  139 |   'org_ops_policies.json': tableHandler('orgOpsPolicy', ['id']),
  140 |   'org_ai_settings.json': tableHandler('orgAiSetting', ['org_owner_id']),
  141 |   'lead_assignments.json': tableHandler('leadAssignment', ['id']),
  142 |   'lead_sla_timers.json': tableHandler('leadSlaTimer', ['id']),
  143 |   'lead_escalations.json': tableHandler('leadEscalation', ['id']),
  144 |   'agent_workloads.json': tableHandler('agentWorkload', ['id']),
  145 |   'agent_capacity.json': tableHandler('agentCapacity', ['id']),
  146 |   'analytics.json': tableHandler('analyticsEvent', ['id']),
  147 |   'boosts.json': tableHandler('boost', ['id']),
  148 |   'product_views.json': tableHandler('productView', ['id']),
  149 |   'reports.json': tableHandler('report', ['id']),
  150 |   'violations.json': tableHandler('policyViolation', ['id']),
  151 |   'social_interactions.json': tableHandler('socialInteraction', ['id']),
  152 |   'user_connections.json': tableHandler('userConnection', ['id']),
  153 |   'matches.json': tableHandler('match', ['requirement_id', 'factory_id'], 'requirement_id_factory_id'),
  154 |   'workflow_journeys.json': tableHandler('workflowJourney', ['id']),
  155 |   'workflow_transitions.json': tableHandler('workflowTransition', ['id']),
  156 |   'metrics.json': tableHandler('metricTransition', ['id']),
  157 |   'assistant_knowledge.json': tableHandler('assistantKnowledge', ['id']),
  158 |   'payment_proofs.json': tableHandler('paymentProof', ['id']),
  159 |   'wallet_history.json': tableHandler('walletHistory', ['id']),
  160 |   'coupon_codes.json': tableHandler('couponCode', ['id']),
  161 |   'coupon_redemptions.json': tableHandler('couponRedemption', ['id']),
  162 |   'message_reads.json': tableHandler('messageRead', ['match_id', 'user_id'], 'match_id_user_id'),
  163 |   'message_queue_items.json': tableHandler('messageQueue', ['id']),
  164 |   'message_policy_logs.json': tableHandler('messagePolicyDecision', ['id']),
  165 |   'communication_limits.json': tableHandler('communicationPolicyConfig', ['id']),
  166 |   'message_queue.json': tableHandler('messageQueue', ['id']),
  167 |   'message_policy_decisions.json': tableHandler('messagePolicyDecision', ['id']),
  168 |   'sender_reputation.json': tableHandler('senderReputation', ['id']),
  169 |   'communication_policy_configs.json': tableHandler('communicationPolicyConfig', ['id']),
  170 | }
  171 | 
  172 | const ratingsHandler = {
  173 |   read: async () => {
  174 |     const [ratings, milestones, feedbackRequests, feedbackEvents] = await Promise.all([
  175 |       prisma.rating.findMany(),
  176 |       prisma.ratingMilestone.findMany(),
  177 |       prisma.ratingFeedbackRequest.findMany(),
  178 |       prisma.ratingFeedbackEvent.findMany(),
  179 |     ])
  180 |     return {
  181 |       ratings: normalizeRows(ratings),
  182 |       milestones: normalizeRows(milestones),
  183 |       feedback_requests: normalizeRows(feedbackRequests),
  184 |       feedback_events: normalizeRows(feedbackEvents),
  185 |     }
  186 |   },
  187 |   write: async (store = {}) => {
  188 |     const ratings = Array.isArray(store.ratings) ? store.ratings : []
  189 |     const milestones = Array.isArray(store.milestones) ? store.milestones : []
  190 |     const feedbackRequests = Array.isArray(store.feedback_requests) ? store.feedback_requests : []
  191 |     const feedbackEvents = Array.isArray(store.feedback_events) ? store.feedback_events : []
  192 | 
  193 |     await syncTable({ model: 'rating', rows: ratings, keyFields: ['id'] })
  194 |     await syncTable({ model: 'ratingMilestone', rows: milestones, keyFields: ['id'] })
  195 |     await syncTable({ model: 'ratingFeedbackRequest', rows: feedbackRequests, keyFields: ['id'] })
  196 |     await syncTable({ model: 'ratingFeedbackEvent', rows: feedbackEvents, keyFields: ['id'] })
  197 | 
  198 |     return store
  199 |   },
  200 | }
  201 | 
  202 | FILE_HANDLERS['ratings.json'] = ratingsHandler
  203 | 
  204 | export async function readJson(fileName) {
  205 |   if (isTestEnv()) {
  206 |     return _mem.get(fileName) || []
  207 |   }
  208 |   const handler = FILE_HANDLERS[fileName]
  209 |   if (!handler) return []
  210 |   return handler.read()
  211 | }
  212 | 
  213 | export async function writeJson(fileName, data) {
  214 |   if (isTestEnv()) {
  215 |     _mem.set(fileName, data)
  216 |     return data
  217 |   }
  218 |   return withLock(fileName, async () => {
  219 |     const handler = FILE_HANDLERS[fileName]
  220 |     if (!handler) return data
  221 |     await handler.write(data)
  222 |     return data
  223 |   })
  224 | }
  225 | 
  226 | export async function updateJson(fileName, updater) {
  227 |   if (isTestEnv()) {
  228 |     const existing = _mem.get(fileName) || []
  229 |     const next = await updater(existing)
  230 |     _mem.set(fileName, next)
  231 |     return next
  232 |   }
  233 |   return withLock(fileName, async () => {
  234 |     const existing = await readJson(fileName)
  235 |     const next = await updater(existing)
  236 |     await writeJson(fileName, next)
  237 |     return next
  238 |   })
  239 | }
  240 | 