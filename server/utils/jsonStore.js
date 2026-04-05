import prisma from './prisma.js'

const locks = new Map()

function withLock(fileName, action) {
  const prior = locks.get(fileName) || Promise.resolve()
  const next = prior.then(action, action)
  locks.set(fileName, next.finally(() => {
    if (locks.get(fileName) === next) {
      locks.delete(fileName)
    }
  }))
  return next
}

function toSerializable(value) {
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(toSerializable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toSerializable(v)]))
  }
  return value
}

function normalizeRows(rows) {
  return Array.isArray(rows) ? rows.map((row) => toSerializable(row)) : rows
}

function stripUndefined(row = {}) {
  return Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined))
}

function normalizeUserRow(row = {}) {
  const next = { ...row }
  if (next.messaging_restricted_until === '') next.messaging_restricted_until = null
  if (next.password_reset_at === '') next.password_reset_at = null
  if (next.created_at === '') delete next.created_at
  if (next.updated_at === '') next.updated_at = null
  if (next.wallet_updated_at !== undefined) delete next.wallet_updated_at
  if (next.passkeys !== undefined) delete next.passkeys
  return next
}

function keyForRow(row, keyFields) {
  return keyFields.map((field) => String(row?.[field] ?? '')).join('::')
}

function buildWhereFromKey(keyFields, row) {
  return Object.fromEntries(keyFields.map((field) => [field, row[field]]))
}

async function syncTable({ model, rows, keyFields, uniqueKeyName = null }) {
  const delegate = prisma[model]
  if (!delegate) throw new Error(`Unknown Prisma model: ${model}`)

  const safeRows = Array.isArray(rows) ? rows.map((r) => stripUndefined(r)) : []
  const existing = await delegate.findMany()
  const existingByKey = new Map(existing.map((row) => [keyForRow(row, keyFields), row]))
  const nextByKey = new Map(safeRows.map((row) => [keyForRow(row, keyFields), row]))

  const missingKeys = [...existingByKey.keys()].filter((k) => !nextByKey.has(k))
  if (missingKeys.length) {
    const or = missingKeys
      .map((key) => {
        const parts = key.split('::')
        const condition = {}
        keyFields.forEach((field, idx) => {
          condition[field] = parts[idx]
        })
        return condition
      })
      .filter((cond) => Object.values(cond).every((v) => v !== ''))

    if (or.length) {
      await delegate.deleteMany({ where: { OR: or } })
    }
  }

  for (const row of safeRows) {
    const hasAllKeys = keyFields.every((field) => row[field] !== undefined && row[field] !== null && String(row[field]) !== '')
    if (!hasAllKeys) continue

    const where = uniqueKeyName
      ? { [uniqueKeyName]: buildWhereFromKey(keyFields, row) }
      : buildWhereFromKey(keyFields, row)

    await delegate.upsert({
      where,
      update: row,
      create: row,
    })
  }

  return safeRows
}

function tableHandler(model, keyFields = ['id'], uniqueKeyName = null) {
  return {
    read: async () => normalizeRows(await prisma[model].findMany()),
    write: async (rows) => syncTable({ model, rows, keyFields, uniqueKeyName }),
  }
}

const FILE_HANDLERS = {
  'users.json': {
    read: async () => normalizeRows(await prisma.user.findMany()),
    write: async (rows) => syncTable({
      model: 'user',
      rows: Array.isArray(rows) ? rows.map(normalizeUserRow) : rows,
      keyFields: ['id'],
    }),
  },
  'subscriptions.json': tableHandler('subscription', ['id']),
  'verification.json': tableHandler('verification', ['user_id']),
  'requirements.json': tableHandler('requirement', ['id']),
  'company_products.json': tableHandler('product', ['id']),
  'messages.json': tableHandler('message', ['id']),
  'message_requests.json': tableHandler('messageRequest', ['thread_id']),
  'notifications.json': tableHandler('notification', ['id']),
  'search_alerts.json': tableHandler('searchAlert', ['id']),
  'search_usage_counters.json': tableHandler('searchUsageCounter', ['user_id', 'action'], 'user_id_action'),
  'conversation_locks.json': tableHandler('conversationLock', ['request_id']),
  'partner_requests.json': tableHandler('partnerRequest', ['id']),
  'call_sessions.json': tableHandler('callSession', ['id']),
  'call_recording_views.json': tableHandler('callRecordingView', ['id']),
  'documents.json': tableHandler('document', ['id']),
  'leads.json': tableHandler('lead', ['id']),
  'lead_notes.json': tableHandler('leadNote', ['id']),
  'lead_reminders.json': tableHandler('leadReminder', ['id']),
  'interaction_logs.json': tableHandler('interactionLog', ['id']),
  'event_logs.json': tableHandler('eventLog', ['id']),
  'analytics.json': tableHandler('analyticsEvent', ['id']),
  'boosts.json': tableHandler('boost', ['id']),
  'product_views.json': tableHandler('productView', ['id']),
  'reports.json': tableHandler('report', ['id']),
  'violations.json': tableHandler('policyViolation', ['id']),
  'social_interactions.json': tableHandler('socialInteraction', ['id']),
  'user_connections.json': tableHandler('userConnection', ['id']),
  'matches.json': tableHandler('match', ['requirement_id', 'factory_id'], 'requirement_id_factory_id'),
  'metrics.json': tableHandler('metricTransition', ['id']),
  'assistant_knowledge.json': tableHandler('assistantKnowledge', ['id']),
  'payment_proofs.json': tableHandler('paymentProof', ['id']),
  'wallet_history.json': tableHandler('walletHistory', ['id']),
  'coupon_codes.json': tableHandler('couponCode', ['id']),
  'coupon_redemptions.json': tableHandler('couponRedemption', ['id']),
  'message_reads.json': tableHandler('messageRead', ['match_id', 'user_id'], 'match_id_user_id'),
}

const ratingsHandler = {
  read: async () => {
    const [ratings, milestones, feedbackRequests, feedbackEvents] = await Promise.all([
      prisma.rating.findMany(),
      prisma.ratingMilestone.findMany(),
      prisma.ratingFeedbackRequest.findMany(),
      prisma.ratingFeedbackEvent.findMany(),
    ])
    return {
      ratings: normalizeRows(ratings),
      milestones: normalizeRows(milestones),
      feedback_requests: normalizeRows(feedbackRequests),
      feedback_events: normalizeRows(feedbackEvents),
    }
  },
  write: async (store = {}) => {
    const ratings = Array.isArray(store.ratings) ? store.ratings : []
    const milestones = Array.isArray(store.milestones) ? store.milestones : []
    const feedbackRequests = Array.isArray(store.feedback_requests) ? store.feedback_requests : []
    const feedbackEvents = Array.isArray(store.feedback_events) ? store.feedback_events : []

    await syncTable({ model: 'rating', rows: ratings, keyFields: ['id'] })
    await syncTable({ model: 'ratingMilestone', rows: milestones, keyFields: ['id'] })
    await syncTable({ model: 'ratingFeedbackRequest', rows: feedbackRequests, keyFields: ['id'] })
    await syncTable({ model: 'ratingFeedbackEvent', rows: feedbackEvents, keyFields: ['id'] })

    return store
  },
}

FILE_HANDLERS['ratings.json'] = ratingsHandler

export async function readJson(fileName) {
  const handler = FILE_HANDLERS[fileName]
  if (!handler) return []
  return handler.read()
}

export async function writeJson(fileName, data) {
  return withLock(fileName, async () => {
    const handler = FILE_HANDLERS[fileName]
    if (!handler) return data
    await handler.write(data)
    return data
  })
}

export async function updateJson(fileName, updater) {
  return withLock(fileName, async () => {
    const existing = await readJson(fileName)
    const next = await updater(existing)
    await writeJson(fileName, next)
    return next
  })
}
