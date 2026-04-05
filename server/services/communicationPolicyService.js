import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const MESSAGE_FILE = 'messages.json'
const USERS_FILE = 'users.json'
const CONFIG_FILE = 'communication_policy_configs.json'
const QUEUE_FILE = 'message_queue.json'
const DECISIONS_FILE = 'message_policy_decisions.json'
const REPUTATION_FILE = 'sender_reputation.json'
const METRICS_FILE = 'policy_metrics.json'

const DEFAULT_GLOBAL_CONFIG = {
  id: 'global',
  scope: 'global',
  max_outreach_per_window: 12,
  outreach_window_minutes: 15,
  cooldown_seconds: 30,
  premium_boost: 20,
  verified_boost: 30,
  keyword_risk_threshold_soft: 0.45,
  keyword_risk_threshold_hard: 0.75,
}

const RISK_PATTERNS = [
  { pattern: /(free\s+money|crypto\s+airdrop|guaranteed\s+profit|click\s+here)/i, weight: 0.45 },
  { pattern: /(http:\/\/|bit\.ly|t\.me|wa\.me|telegram|whatsapp|contact\s+me\s+on)/i, weight: 0.35 },
  { pattern: /(urgent|act\s+now|limited\s+offer|winner)/i, weight: 0.2 },
  { pattern: /(免费|点击|现在联系|优惠|促销)/i, weight: 0.25 },
  { pattern: /(বিনামূল্যে|অফার|যোগাযোগ|টেলিগ্রাম|হোয়াটসঅ্যাপ|হোয়াটসঅ্যাপ)/i, weight: 0.25 },
  { pattern: /(oferta|gratis|haz\s+clic|contacta\s+por\s+telegram)/i, weight: 0.2 },
]

function normalizeText(value = '') {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function toIso(date = new Date()) {
  return new Date(date).toISOString()
}

function addMetric(metrics, key) {
  metrics[key] = Number(metrics[key] || 0) + 1
}

function buildConfigMap(configRows = []) {
  const map = new Map()
  for (const row of configRows) {
    if (!row || !row.id) continue
    map.set(String(row.id), row)
  }
  if (!map.has('global')) map.set('global', DEFAULT_GLOBAL_CONFIG)
  return map
}

function resolvePolicyConfig(configMap, orgId = '') {
  const global = { ...DEFAULT_GLOBAL_CONFIG, ...(configMap.get('global') || {}) }
  if (!orgId) return global
  const orgRow = configMap.get(`org:${orgId}`)
  if (!orgRow) return global
  return { ...global, ...orgRow }
}

function senderBoost(sender, config) {
  let boost = 0
  if (String(sender?.subscription_status || '').toLowerCase() === 'premium') boost += Number(config.premium_boost || 0)
  if (sender?.verified) boost += Number(config.verified_boost || 0)
  return boost
}

function estimateKeywordRisk(text = '') {
  const normalized = normalizeText(text)
  if (!normalized) return 0
  let risk = 0
  for (const entry of RISK_PATTERNS) {
    if (entry.pattern.test(normalized)) risk += entry.weight
  }
  return Math.max(0, Math.min(1, risk))
}

function withinWindow(messages = [], senderId, windowMinutes = 15) {
  const cutoff = Date.now() - Number(windowMinutes || 15) * 60 * 1000
  return messages.filter((row) => (
    String(row.sender_id || '') === String(senderId || '') &&
    new Date(row.timestamp || 0).getTime() >= cutoff
  ))
}

function hasRecentDuplicate(messages = [], senderId, matchId, text = '') {
  const normalized = normalizeText(text)
  if (!normalized) return false
  const cutoff = Date.now() - 10 * 60 * 1000
  return messages.some((row) => {
    if (String(row.sender_id || '') !== String(senderId || '')) return false
    if (String(row.match_id || '') !== String(matchId || '')) return false
    if (new Date(row.timestamp || 0).getTime() < cutoff) return false
    return normalizeText(row.message || '') === normalized
  })
}

function firstResponsePriority(messages = [], matchId, senderId) {
  const threadMessages = messages.filter((row) => String(row.match_id || '') === String(matchId || ''))
  const hasSentBefore = threadMessages.some((row) => String(row.sender_id || '') === String(senderId || ''))
  const isNewThread = threadMessages.length <= 2
  return !hasSentBefore && isNewThread
}

function queueRanking({ sender, trustScore, riskScore, config, firstResponse }) {
  const base = Number(trustScore || 0)
  const boost = senderBoost(sender, config)
  const firstResponseBonus = firstResponse ? 15 : 0
  const riskPenalty = Math.round(Number(riskScore || 0) * 70)
  const total = base + boost + firstResponseBonus - riskPenalty
  if (total >= 85) return { rank: 'urgent', score: total, label: 'P1-Urgent' }
  if (total >= 60) return { rank: 'high', score: total, label: 'P2-High' }
  if (total >= 40) return { rank: 'standard', score: total, label: 'P3-Standard' }
  return { rank: 'low', score: total, label: 'P4-Low' }
}

function rejectionReason(action, reason, retryAfterSeconds = 0) {
  if (action !== 'reject') return ''
  if (reason === 'duplicate_suppression') return 'Duplicate message detected. Please send a unique message.'
  if (reason === 'frequency_limit') return `Rate limit reached. Retry after ${Math.max(1, Number(retryAfterSeconds || 0))} seconds.`
  if (reason === 'keyword_risk_hard') return 'Message blocked by communication safety policy.'
  return 'Message rejected by policy.'
}

async function ensureDefaultConfigRows() {
  const current = await readJson(CONFIG_FILE)
  const rows = Array.isArray(current) ? current : []
  if (!rows.some((row) => row?.id === 'global')) {
    rows.push({ ...DEFAULT_GLOBAL_CONFIG, updated_at: toIso() })
    await writeJson(CONFIG_FILE, rows)
  }
  return rows
}


export function evaluatePolicyContract({ sender = null, matchId = '', text = '', messages = [], config = DEFAULT_GLOBAL_CONFIG, trustScore = 50 }) {
  const riskScore = estimateKeywordRisk(text)
  const recentMessages = withinWindow(messages, sender?.id || '', config.outreach_window_minutes)
  const duplicate = hasRecentDuplicate(messages, sender?.id || '', matchId, text)
  const firstResponse = firstResponsePriority(messages, matchId, sender?.id || '')
  const ranking = queueRanking({ sender, trustScore, riskScore, config, firstResponse })

  let action = 'allow'
  let reason = 'policy_allow'
  let retryAfterSeconds = 0
  if (duplicate) {
    action = 'reject'
    reason = 'duplicate_suppression'
  } else if (riskScore >= Number(config.keyword_risk_threshold_hard || 0.75)) {
    action = 'require_human_review'
    reason = 'keyword_risk_hard'
  } else if (recentMessages.length >= Number(config.max_outreach_per_window || 12)) {
    retryAfterSeconds = Number(config.cooldown_seconds || 30)
    if (sender?.verified || String(sender?.subscription_status || '').toLowerCase() === 'premium') {
      action = 'delayed_queue'
      reason = 'frequency_limit_boosted'
    } else {
      action = 'reject'
      reason = 'frequency_limit'
    }
  } else if (riskScore >= Number(config.keyword_risk_threshold_soft || 0.45)) {
    action = 'delayed_queue'
    reason = 'keyword_risk_soft'
    retryAfterSeconds = Number(config.cooldown_seconds || 30)
  }

  return {
    action,
    reason,
    riskScore,
    retryAfterSeconds,
    recentCount: recentMessages.length,
    ranking,
    firstResponse,
  }
}

export async function evaluateMessagePolicy({ sender = null, matchId = '', text = '', type = 'text', orgId = '' }) {
  const [messages, configsRaw, queueRowsRaw, decisionRowsRaw, reputationRowsRaw, metricsRaw] = await Promise.all([
    readJson(MESSAGE_FILE),
    ensureDefaultConfigRows(),
    readJson(QUEUE_FILE),
    readJson(DECISIONS_FILE),
    readJson(REPUTATION_FILE),
    readJson(METRICS_FILE),
  ])

  const configMap = buildConfigMap(configsRaw)
  const config = resolvePolicyConfig(configMap, orgId)
  const queueRows = Array.isArray(queueRowsRaw) ? queueRowsRaw : []
  const decisionRows = Array.isArray(decisionRowsRaw) ? decisionRowsRaw : []
  const reputationRows = Array.isArray(reputationRowsRaw) ? reputationRowsRaw : []
  const metrics = (metricsRaw && typeof metricsRaw === 'object' && !Array.isArray(metricsRaw)) ? metricsRaw : {}

  const senderId = String(sender?.id || '')
  const nowIso = toIso()
  const reputationIdx = reputationRows.findIndex((row) => String(row.sender_id || '') === senderId)
  const reputation = reputationIdx >= 0
    ? reputationRows[reputationIdx]
    : { id: crypto.randomUUID(), sender_id: senderId, trust_score: 50, spam_reports: 0, positive_interactions: 0, updated_at: nowIso }

  const trustScore = Math.max(0, Math.min(100, Number(reputation.trust_score || 50)))
  const contract = evaluatePolicyContract({ sender, matchId, text, messages, config, trustScore })
  const riskScore = contract.riskScore
  const recentMessages = withinWindow(messages, senderId, config.outreach_window_minutes)
  const firstResponse = contract.firstResponse
  const ranking = contract.ranking
  const action = contract.action
  const reason = contract.reason
  const retryAfterSeconds = contract.retryAfterSeconds

  if (action === 'allow') addMetric(metrics, 'allow')
  if (action === 'delayed_queue') addMetric(metrics, 'delayed_queue')
  if (action === 'require_human_review') addMetric(metrics, 'require_human_review')
  if (action === 'reject' && reason === 'duplicate_suppression') addMetric(metrics, 'duplicate_suppression')
  if (action === 'reject' && reason === 'frequency_limit') addMetric(metrics, 'reject_frequency_limit')

  const decisionId = crypto.randomUUID()
  const queueId = crypto.randomUUID()
  const decision = {
    id: decisionId,
    queue_id: action === 'allow' ? null : queueId,
    sender_id: senderId,
    org_id: orgId || null,
    match_id: sanitizeString(String(matchId || ''), 160),
    action,
    reason,
    trust_score: trustScore,
    keyword_risk_score: Number(riskScore.toFixed(4)),
    frequency_count: recentMessages.length,
    first_response_priority: firstResponse,
    queue_rank: ranking.rank,
    queue_score: ranking.score,
    queue_priority_label: ranking.label,
    retry_after_seconds: retryAfterSeconds,
    requires_human_review: action === 'require_human_review',
    false_positive: false,
    reviewer_id: null,
    reviewer_notes: null,
    created_at: nowIso,
    updated_at: nowIso,
  }

  decisionRows.push(decision)

  if (action !== 'allow') {
    queueRows.push({
      id: queueId,
      message_id: null,
      match_id: sanitizeString(String(matchId || ''), 160),
      sender_id: senderId,
      org_id: orgId || null,
      queue_status: action === 'require_human_review' ? 'needs_review' : 'queued',
      queue_rank: ranking.rank,
      queue_score: ranking.score,
      queue_priority_label: ranking.label,
      policy_reason: reason,
      retry_after_seconds: retryAfterSeconds,
      requires_human_review: action === 'require_human_review',
      metadata: {
        message_type: type,
      },
      created_at: nowIso,
      updated_at: nowIso,
    })
  }

  if (reputationIdx >= 0) {
    reputationRows[reputationIdx] = {
      ...reputationRows[reputationIdx],
      trust_score: action === 'reject' ? Math.max(0, trustScore - 2) : Math.min(100, trustScore + 0.2),
      updated_at: nowIso,
    }
  } else {
    reputationRows.push(reputation)
  }

  await Promise.all([
    writeJson(QUEUE_FILE, queueRows),
    writeJson(DECISIONS_FILE, decisionRows),
    writeJson(REPUTATION_FILE, reputationRows),
    writeJson(METRICS_FILE, metrics),
  ])

  return {
    action,
    reason,
    queue: action === 'allow' ? null : queueRows[queueRows.length - 1],
    decision,
    retry_after_seconds: retryAfterSeconds,
    rejection_message: rejectionReason(action, reason, retryAfterSeconds),
  }
}

export async function attachMessageToQueue(queueId, messageId) {
  if (!queueId || !messageId) return
  const queueRows = await readJson(QUEUE_FILE)
  const nextRows = Array.isArray(queueRows) ? queueRows : []
  const idx = nextRows.findIndex((row) => String(row.id || '') === String(queueId))
  if (idx < 0) return
  nextRows[idx] = {
    ...nextRows[idx],
    message_id: String(messageId),
    updated_at: toIso(),
  }
  await writeJson(QUEUE_FILE, nextRows)
}

export async function listPolicyFalsePositiveCandidates() {
  const decisions = await readJson(DECISIONS_FILE)
  const rows = Array.isArray(decisions) ? decisions : []
  return rows
    .filter((row) => ['reject', 'require_human_review', 'delayed_queue'].includes(String(row.action || '')))
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
    .slice(0, 200)
}

export async function markPolicyDecisionFalsePositive(decisionId, reviewerId, notes = '') {
  const decisions = await readJson(DECISIONS_FILE)
  const next = Array.isArray(decisions) ? decisions : []
  const idx = next.findIndex((row) => String(row.id || '') === String(decisionId || ''))
  if (idx < 0) return null
  next[idx] = {
    ...next[idx],
    false_positive: true,
    reviewer_id: sanitizeString(String(reviewerId || ''), 120) || null,
    reviewer_notes: sanitizeString(String(notes || ''), 400) || null,
    updated_at: toIso(),
  }
  await writeJson(DECISIONS_FILE, next)
  return next[idx]
}

export async function getWeeklyDecisionQualityReport() {
  const decisions = await readJson(DECISIONS_FILE)
  const metrics = await readJson(METRICS_FILE)
  const rows = Array.isArray(decisions) ? decisions : []
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000
  const weekly = rows.filter((row) => new Date(row.created_at || 0).getTime() >= since)

  const byAction = weekly.reduce((acc, row) => {
    const key = String(row.action || 'unknown')
    acc[key] = Number(acc[key] || 0) + 1
    return acc
  }, {})
  const falsePositives = weekly.filter((row) => row.false_positive).length
  const reviewed = weekly.filter((row) => row.reviewer_id || row.false_positive).length

  return {
    window: '7d',
    generated_at: toIso(),
    totals: {
      decisions: weekly.length,
      false_positives: falsePositives,
      reviewed,
      false_positive_rate: weekly.length ? Number((falsePositives / weekly.length).toFixed(4)) : 0,
    },
    by_action: byAction,
    policy_hit_counters: (metrics && typeof metrics === 'object' && !Array.isArray(metrics)) ? metrics : {},
  }
}

export async function upsertCommunicationPolicyConfig({ scope = 'global', org_id = null, config = {}, actor_id = '' }) {
  const safeScope = scope === 'org' ? 'org' : 'global'
  const rows = await ensureDefaultConfigRows()
  const id = safeScope === 'global' ? 'global' : `org:${sanitizeString(String(org_id || ''), 120)}`
  if (safeScope === 'org' && !org_id) {
    const err = new Error('org_id is required for org scope policy updates')
    err.status = 400
    throw err
  }

  const idx = rows.findIndex((row) => String(row.id || '') === id)
  const base = safeScope === 'global' ? DEFAULT_GLOBAL_CONFIG : { ...DEFAULT_GLOBAL_CONFIG, scope: 'org', org_id }
  const nextRow = {
    ...(idx >= 0 ? rows[idx] : base),
    ...config,
    id,
    scope: safeScope,
    org_id: safeScope === 'org' ? org_id : null,
    updated_by: sanitizeString(String(actor_id || ''), 120) || null,
    updated_at: toIso(),
  }

  if (idx >= 0) rows[idx] = nextRow
  else rows.push(nextRow)
  await writeJson(CONFIG_FILE, rows)
  return nextRow
}
