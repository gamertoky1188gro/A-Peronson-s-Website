    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | const MESSAGE_FILE = 'messages.json'
    6 | const LIMITS_FILE = 'communication_limits.json'
    7 | const QUEUE_FILE = 'message_queue_items.json'
    8 | const LOGS_FILE = 'message_policy_logs.json'
    9 | const REPUTATION_FILE = 'sender_reputation.json'
   10 | const METRICS_FILE = 'policy_metrics.json'
   11 | 
   12 | const LEGACY_LIMITS_FILE = 'communication_policy_configs.json'
   13 | const LEGACY_QUEUE_FILE = 'message_queue.json'
   14 | const LEGACY_LOGS_FILE = 'message_policy_decisions.json'
   15 | 
   16 | const DEFAULT_GLOBAL_CONFIG = {
   17 |   id: 'global',
   18 |   scope: 'global',
   19 |   org_id: null,
   20 |   message_caps: {
   21 |     outbound_per_window: 12,
   22 |     window_minutes: 15,
   23 |     cooldown_seconds: 30,
   24 |   },
   25 |   priority_multipliers: {
   26 |     premium: 1.2,
   27 |     verified: 1.3,
   28 |   },
   29 |   strictness_mode: 'balanced',
   30 |   spam_thresholds: {
   31 |     queue: 0.45,
   32 |     hard_block: 0.75,
   33 |   },
   34 | }
   35 | 
   36 | const STRICTNESS_MODES = {
   37 |   relaxed: { capFactor: 1.35, spamDelta: 0.08 },
   38 |   balanced: { capFactor: 1, spamDelta: 0 },
   39 |   strict: { capFactor: 0.8, spamDelta: -0.08 },
   40 | }
   41 | 
   42 | const RISK_PATTERNS = [
   43 |   { pattern: /(free\s+money|crypto\s+airdrop|guaranteed\s+profit|click\s+here)/i, weight: 0.45 },
   44 |   { pattern: /(http:\/\/|bit\.ly|t\.me|wa\.me|telegram|whatsapp|contact\s+me\s+on)/i, weight: 0.35 },
   45 |   { pattern: /(urgent|act\s+now|limited\s+offer|winner)/i, weight: 0.2 },
   46 |   { pattern: /(免费|点击|现在联系|优惠|促销)/i, weight: 0.25 },
   47 |   { pattern: /(বিনামূল্যে|অফার|যোগাযোগ|টেলিগ্রাম|হোয়াটসঅ্যাপ|হোয়াটসঅ্যাপ)/i, weight: 0.25 },
   48 |   { pattern: /(oferta|gratis|haz\s+clic|contacta\s+por\s+telegram)/i, weight: 0.2 },
   49 | ]
   50 | 
   51 | function normalizeText(value = '') {
   52 |   return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
   53 | }
   54 | 
   55 | function toIso(date = new Date()) {
   56 |   return new Date(date).toISOString()
   57 | }
   58 | 
   59 | function addMetric(metrics, key, step = 1) {
   60 |   metrics[key] = Number(metrics[key] || 0) + Number(step || 0)
   61 | }
   62 | 
   63 | function resolveStrictnessMode(mode = 'balanced') {
   64 |   const key = String(mode || 'balanced').toLowerCase()
   65 |   return STRICTNESS_MODES[key] ? key : 'balanced'
   66 | }
   67 | 
   68 | function normalizeConfig(row = {}) {
   69 |   const strictnessMode = resolveStrictnessMode(row?.strictness_mode)
   70 |   const legacyMax = Number(row?.max_outreach_per_window || DEFAULT_GLOBAL_CONFIG.message_caps.outbound_per_window)
   71 |   const legacyWindow = Number(row?.outreach_window_minutes || DEFAULT_GLOBAL_CONFIG.message_caps.window_minutes)
   72 |   const legacyCooldown = Number(row?.cooldown_seconds || DEFAULT_GLOBAL_CONFIG.message_caps.cooldown_seconds)
   73 |   const legacyPremiumBoost = Number(row?.premium_boost || 20)
   74 |   const legacyVerifiedBoost = Number(row?.verified_boost || 30)
   75 | 
   76 |   return {
   77 |     ...DEFAULT_GLOBAL_CONFIG,
   78 |     ...row,
   79 |     message_caps: {
   80 |       ...DEFAULT_GLOBAL_CONFIG.message_caps,
   81 |       ...(row?.message_caps || {}),
   82 |       outbound_per_window: Number(row?.message_caps?.outbound_per_window || row?.max_outreach_per_window || legacyMax),
   83 |       window_minutes: Number(row?.message_caps?.window_minutes || row?.outreach_window_minutes || legacyWindow),
   84 |       cooldown_seconds: Number(row?.message_caps?.cooldown_seconds || row?.cooldown_seconds || legacyCooldown),
   85 |     },
   86 |     priority_multipliers: {
   87 |       ...DEFAULT_GLOBAL_CONFIG.priority_multipliers,
   88 |       ...(row?.priority_multipliers || {}),
   89 |       premium: Number(row?.priority_multipliers?.premium || row?.premium_multiplier || Math.max(1, legacyPremiumBoost / 100 + 1)),
   90 |       verified: Number(row?.priority_multipliers?.verified || row?.verified_multiplier || Math.max(1, legacyVerifiedBoost / 100 + 1)),
   91 |     },
   92 |     strictness_mode: strictnessMode,
   93 |     spam_thresholds: {
   94 |       ...DEFAULT_GLOBAL_CONFIG.spam_thresholds,
   95 |       ...(row?.spam_thresholds || {}),
   96 |       queue: Number(row?.spam_thresholds?.queue || row?.keyword_risk_threshold_soft || DEFAULT_GLOBAL_CONFIG.spam_thresholds.queue),
   97 |       hard_block: Number(row?.spam_thresholds?.hard_block || row?.keyword_risk_threshold_hard || DEFAULT_GLOBAL_CONFIG.spam_thresholds.hard_block),
   98 |     },
   99 |   }
  100 | }
  101 | 
  102 | function buildConfigMap(configRows = []) {
  103 |   const map = new Map()
  104 |   for (const row of configRows) {
  105 |     if (!row?.id) continue
  106 |     map.set(String(row.id), normalizeConfig(row))
  107 |   }
  108 |   if (!map.has('global')) map.set('global', normalizeConfig(DEFAULT_GLOBAL_CONFIG))
  109 |   return map
  110 | }
  111 | 
  112 | function resolvePolicyConfig(configMap, orgId = '') {
  113 |   const global = normalizeConfig(configMap.get('global') || DEFAULT_GLOBAL_CONFIG)
  114 |   if (!orgId) return global
  115 |   const orgRow = configMap.get(`org:${orgId}`)
  116 |   if (!orgRow) return global
  117 |   return normalizeConfig({ ...global, ...orgRow })
  118 | }
  119 | 
  120 | function estimateSpamScore(text = '') {
  121 |   const normalized = normalizeText(text)
  122 |   if (!normalized) return 0
  123 |   let score = 0
  124 |   for (const entry of RISK_PATTERNS) {
  125 |     if (entry.pattern.test(normalized)) score += entry.weight
  126 |   }
  127 |   return Math.max(0, Math.min(1, score))
  128 | }
  129 | 
  130 | function withinWindow(messages = [], senderId, windowMinutes = 15) {
  131 |   const cutoff = Date.now() - Number(windowMinutes || 15) * 60 * 1000
  132 |   return messages.filter((row) => (
  133 |     String(row.sender_id || '') === String(senderId || '')
  134 |       && new Date(row.timestamp || 0).getTime() >= cutoff
  135 |   ))
  136 | }
  137 | 
  138 | function hasRecentDuplicate(messages = [], senderId, matchId, text = '') {
  139 |   const normalized = normalizeText(text)
  140 |   if (!normalized) return false
  141 |   const cutoff = Date.now() - 10 * 60 * 1000
  142 |   return messages.some((row) => {
  143 |     if (String(row.sender_id || '') !== String(senderId || '')) return false
  144 |     if (String(row.match_id || '') !== String(matchId || '')) return false
  145 |     if (new Date(row.timestamp || 0).getTime() < cutoff) return false
  146 |     return normalizeText(row.message || '') === normalized
  147 |   })
  148 | }
  149 | 
  150 | function firstResponsePriority(messages = [], matchId, senderId) {
  151 |   const threadMessages = messages.filter((row) => String(row.match_id || '') === String(matchId || ''))
  152 |   const hasSentBefore = threadMessages.some((row) => String(row.sender_id || '') === String(senderId || ''))
  153 |   return !hasSentBefore && threadMessages.length <= 2
  154 | }
  155 | 
  156 | function queueRanking({ sender, reputationScore, spamScore, config, firstResponse }) {
  157 |   const premiumMultiplier = String(sender?.subscription_status || '').toLowerCase() === 'premium'
  158 |     ? Number(config?.priority_multipliers?.premium || 1)
  159 |     : 1
  160 |   const verifiedMultiplier = sender?.verified
  161 |     ? Number(config?.priority_multipliers?.verified || 1)
  162 |     : 1
  163 | 
  164 |   const premiumVerifiedPriorityScore = Number(((premiumMultiplier * verifiedMultiplier) * 100).toFixed(2))
  165 |   const basePriority = Number(reputationScore || 50) + (firstResponse ? 12 : 0)
  166 |   const riskPenalty = Math.round(Number(spamScore || 0) * 70)
  167 |   const adjusted = Math.round(basePriority * premiumMultiplier * verifiedMultiplier - riskPenalty)
  168 | 
  169 |   if (adjusted >= 90) return { queue_rank: 'urgent', queue_priority_label: 'P1-Urgent', queue_priority_score: adjusted, premium_verified_priority_score: premiumVerifiedPriorityScore }
  170 |   if (adjusted >= 65) return { queue_rank: 'high', queue_priority_label: 'P2-High', queue_priority_score: adjusted, premium_verified_priority_score: premiumVerifiedPriorityScore }
  171 |   if (adjusted >= 40) return { queue_rank: 'standard', queue_priority_label: 'P3-Standard', queue_priority_score: adjusted, premium_verified_priority_score: premiumVerifiedPriorityScore }
  172 |   return { queue_rank: 'low', queue_priority_label: 'P4-Low', queue_priority_score: adjusted, premium_verified_priority_score: premiumVerifiedPriorityScore }
  173 | }
  174 | 
  175 | function rejectionReason(action, reason, retryAfterSeconds = 0) {
  176 |   if (action === 'soft_block') return `Rate limit reached. Retry after ${Math.max(1, Number(retryAfterSeconds || 0))} seconds.`
  177 |   if (action === 'hard_block' && reason === 'duplicate_suppression') return 'Duplicate message detected. Please send a unique message.'
  178 |   if (action === 'hard_block') return 'Message blocked by communication safety policy.'
  179 |   return ''
  180 | }
  181 | 
  182 | async function ensureDefaultConfigRows() {
  183 |   const [current, legacy] = await Promise.all([readJson(LIMITS_FILE), readJson(LEGACY_LIMITS_FILE)])
  184 |   const rows = Array.isArray(current) && current.length > 0
  185 |     ? current
  186 |     : (Array.isArray(legacy) ? legacy : [])
  187 | 
  188 |   if (!rows.some((row) => row?.id === 'global')) {
  189 |     rows.push({ ...DEFAULT_GLOBAL_CONFIG, updated_at: toIso() })
  190 |   }
  191 | 
  192 |   await Promise.all([
  193 |     writeJson(LIMITS_FILE, rows),
  194 |     writeJson(LEGACY_LIMITS_FILE, rows),
  195 |   ])
  196 | 
  197 |   return rows
  198 | }
  199 | 
  200 | export function evaluatePolicyContract({ sender = null, matchId = '', text = '', messages = [], config = DEFAULT_GLOBAL_CONFIG, reputationScore = 50 }) {
  201 |   const normalizedConfig = normalizeConfig(config)
  202 |   const strictness = STRICTNESS_MODES[resolveStrictnessMode(normalizedConfig.strictness_mode)]
  203 |   const softThreshold = Math.max(0.05, Math.min(0.95, Number(normalizedConfig.spam_thresholds.queue || 0.45) + strictness.spamDelta))
  204 |   const hardThreshold = Math.max(softThreshold + 0.05, Math.min(0.99, Number(normalizedConfig.spam_thresholds.hard_block || 0.75) + strictness.spamDelta))
  205 | 
  206 |   const spamScore = estimateSpamScore(text)
  207 |   const recentMessages = withinWindow(messages, sender?.id || '', normalizedConfig.message_caps.window_minutes)
  208 |   const duplicate = hasRecentDuplicate(messages, sender?.id || '', matchId, text)
  209 |   const firstResponse = firstResponsePriority(messages, matchId, sender?.id || '')
  210 |   const ranking = queueRanking({ sender, reputationScore, spamScore, config: normalizedConfig, firstResponse })
  211 | 
  212 |   const baseCap = Math.max(1, Number(normalizedConfig.message_caps.outbound_per_window || 12))
  213 |   const capLimit = Math.max(1, Math.floor(baseCap * strictness.capFactor))
  214 |   const retryAfterSeconds = Math.max(1, Number(normalizedConfig.message_caps.cooldown_seconds || 30))
  215 | 
  216 |   let action = 'allow'
  217 |   let reason = 'policy_allow'
  218 |   let moderationFlag = false
  219 | 
  220 |   if (duplicate) {
  221 |     action = 'hard_block'
  222 |     reason = 'duplicate_suppression'
  223 |     moderationFlag = true
  224 |   } else if (spamScore >= hardThreshold) {
  225 |     action = 'hard_block'
  226 |     reason = 'spam_hard_block'
  227 |     moderationFlag = true
  228 |   } else if (recentMessages.length >= capLimit) {
  229 |     action = 'soft_block'
  230 |     reason = 'rate_limit_exceeded'
  231 |   } else if (spamScore >= softThreshold) {
  232 |     action = 'queue'
  233 |     reason = 'spam_soft_queue'
  234 |   }
  235 | 
  236 |   return {
  237 |     action,
  238 |     reason,
  239 |     spamScore,
  240 |     reputationScore,
  241 |     retryAfterSeconds: action === 'soft_block' ? retryAfterSeconds : 0,
  242 |     recentCount: recentMessages.length,
  243 |     ranking,
  244 |     firstResponse,
  245 |     moderationFlag,
  246 |   }
  247 | }
  248 | 
  249 | export async function evaluateMessagePolicy({ sender = null, matchId = '', text = '', type = 'text', orgId = '' }) {
  250 |   const [messages, configsRaw, queueRowsRaw, legacyQueueRaw, logRowsRaw, legacyLogsRaw, reputationRowsRaw, metricsRaw] = await Promise.all([
  251 |     readJson(MESSAGE_FILE),
  252 |     ensureDefaultConfigRows(),
  253 |     readJson(QUEUE_FILE),
  254 |     readJson(LEGACY_QUEUE_FILE),
  255 |     readJson(LOGS_FILE),
  256 |     readJson(LEGACY_LOGS_FILE),
  257 |     readJson(REPUTATION_FILE),
  258 |     readJson(METRICS_FILE),
  259 |   ])
  260 | 
  261 |   const configMap = buildConfigMap(configsRaw)
  262 |   const config = resolvePolicyConfig(configMap, orgId)
  263 |   const queueRows = Array.isArray(queueRowsRaw) && queueRowsRaw.length ? queueRowsRaw : (Array.isArray(legacyQueueRaw) ? legacyQueueRaw : [])
  264 |   const logRows = Array.isArray(logRowsRaw) && logRowsRaw.length ? logRowsRaw : (Array.isArray(legacyLogsRaw) ? legacyLogsRaw : [])
  265 |   const reputationRows = Array.isArray(reputationRowsRaw) ? reputationRowsRaw : []
  266 |   const metrics = (metricsRaw && typeof metricsRaw === 'object' && !Array.isArray(metricsRaw)) ? metricsRaw : {}
  267 | 
  268 |   const senderId = String(sender?.id || '')
  269 |   const nowIso = toIso()
  270 |   const reputationIdx = reputationRows.findIndex((row) => String(row.sender_id || '') === senderId)
  271 |   const reputation = reputationIdx >= 0
  272 |     ? reputationRows[reputationIdx]
  273 |     : { id: crypto.randomUUID(), sender_id: senderId, trust_score: 50, spam_reports: 0, positive_interactions: 0, updated_at: nowIso }
  274 | 
  275 |   const reputationScore = Math.max(0, Math.min(100, Number(reputation.trust_score || 50)))
  276 |   const contract = evaluatePolicyContract({ sender, matchId, text, messages, config, reputationScore })
  277 | 
  278 |   const decisionId = crypto.randomUUID()
  279 |   const queueId = crypto.randomUUID()
  280 | 
  281 |   const logRow = {
  282 |     id: decisionId,
  283 |     queue_id: contract.action === 'allow' || contract.action === 'soft_block' || contract.action === 'hard_block' ? null : queueId,
  284 |     sender_id: senderId,
  285 |     org_id: orgId || null,
  286 |     match_id: sanitizeString(String(matchId || ''), 160),
  287 |     action: contract.action,
  288 |     reason: contract.reason,
  289 |     reputation_score: Number(contract.reputationScore || 0),
  290 |     spam_score: Number(contract.spamScore.toFixed(4)),
  291 |     frequency_count: contract.recentCount,
  292 |     first_response_priority: contract.firstResponse,
  293 |     queue_rank: contract.ranking.queue_rank,
  294 |     queue_score: contract.ranking.queue_priority_score,
  295 |     queue_priority_label: contract.ranking.queue_priority_label,
  296 |     premium_verified_priority_score: contract.ranking.premium_verified_priority_score,
  297 |     retry_after_seconds: contract.retryAfterSeconds,
  298 |     moderation_flag: Boolean(contract.moderationFlag),
  299 |     false_positive: false,
  300 |     reviewer_id: null,
  301 |     reviewer_notes: null,
  302 |     created_at: nowIso,
  303 |     updated_at: nowIso,
  304 |   }
  305 | 
  306 |   logRows.push(logRow)
  307 |   addMetric(metrics, 'total_inbound_outbound_evaluated')
  308 |   addMetric(metrics, contract.action)
  309 |   if (contract.action === 'hard_block' || contract.action === 'soft_block') addMetric(metrics, 'blocked_total')
  310 | 
  311 |   let queue = null
  312 |   if (contract.action === 'queue') {
  313 |     queue = {
  314 |       id: queueId,
  315 |       message_id: null,
  316 |       match_id: sanitizeString(String(matchId || ''), 160),
  317 |       sender_id: senderId,
  318 |       org_id: orgId || null,
  319 |       queue_status: 'queued',
  320 |       queue_rank: contract.ranking.queue_rank,
  321 |       queue_score: contract.ranking.queue_priority_score,
  322 |       queue_priority_label: contract.ranking.queue_priority_label,
  323 |       policy_reason: contract.reason,
  324 |       retry_after_seconds: null,
  325 |       requires_human_review: false,
  326 |       metadata: { message_type: type },
  327 |       created_at: nowIso,
  328 |       updated_at: nowIso,
  329 |     }
  330 |     queueRows.push(queue)
  331 |     addMetric(metrics, 'queued_total')
  332 |   }
  333 | 
  334 |   if (reputationIdx >= 0) {
  335 |     const delta = contract.action === 'hard_block' ? -3 : (contract.action === 'soft_block' ? -1.5 : 0.2)
  336 |     reputationRows[reputationIdx] = {
  337 |       ...reputationRows[reputationIdx],
  338 |       trust_score: Math.max(0, Math.min(100, Number((reputationScore + delta).toFixed(2)))),
  339 |       spam_reports: contract.action === 'hard_block'
  340 |         ? Number(reputationRows[reputationIdx].spam_reports || 0) + 1
  341 |         : Number(reputationRows[reputationIdx].spam_reports || 0),
  342 |       positive_interactions: contract.action === 'allow'
  343 |         ? Number(reputationRows[reputationIdx].positive_interactions || 0) + 1
  344 |         : Number(reputationRows[reputationIdx].positive_interactions || 0),
  345 |       updated_at: nowIso,
  346 |     }
  347 |   } else {
  348 |     reputationRows.push(reputation)
  349 |   }
  350 | 
  351 |   const blockedTotal = Number(metrics.blocked_total || 0)
  352 |   const evaluatedTotal = Number(metrics.total_inbound_outbound_evaluated || 0)
  353 |   metrics.blocked_rate = evaluatedTotal ? Number((blockedTotal / evaluatedTotal).toFixed(4)) : 0
  354 | 
  355 |   const queuedTotal = Number(metrics.queued_total || 0)
  356 |   const sentFromQueue = Number(metrics.sent_from_queue || 0)
  357 |   metrics.queued_to_sent_conversion = queuedTotal ? Number((sentFromQueue / queuedTotal).toFixed(4)) : 0
  358 | 
  359 |   const falsePositives = Number(metrics.false_positive_total || 0)
  360 |   const spamActions = Number(metrics.hard_block || 0) + Number(metrics.queue || 0)
  361 |   metrics.spam_false_positive_ratio = spamActions ? Number((falsePositives / spamActions).toFixed(4)) : 0
  362 | 
  363 |   await Promise.all([
  364 |     writeJson(QUEUE_FILE, queueRows),
  365 |     writeJson(LEGACY_QUEUE_FILE, queueRows),
  366 |     writeJson(LOGS_FILE, logRows),
  367 |     writeJson(LEGACY_LOGS_FILE, logRows),
  368 |     writeJson(REPUTATION_FILE, reputationRows),
  369 |     writeJson(METRICS_FILE, metrics),
  370 |   ])
  371 | 
  372 |   return {
  373 |     action: contract.action,
  374 |     reason: contract.reason,
  375 |     queue,
  376 |     decision: logRow,
  377 |     spam_score: logRow.spam_score,
  378 |     reputation_score: logRow.reputation_score,
  379 |     premium_verified_priority_score: logRow.premium_verified_priority_score,
  380 |     queue_rank: logRow.queue_rank,
  381 |     retry_after_seconds: contract.retryAfterSeconds,
  382 |     moderation_flag: Boolean(contract.moderationFlag),
  383 |     rejection_message: rejectionReason(contract.action, contract.reason, contract.retryAfterSeconds),
  384 |   }
  385 | }
  386 | 
  387 | export async function attachMessageToQueue(queueId, messageId) {
  388 |   if (!queueId || !messageId) return
  389 |   const queueRows = await readJson(QUEUE_FILE)
  390 |   const nextRows = Array.isArray(queueRows) ? queueRows : []
  391 |   const idx = nextRows.findIndex((row) => String(row.id || '') === String(queueId))
  392 |   if (idx < 0) return
  393 |   nextRows[idx] = {
  394 |     ...nextRows[idx],
  395 |     message_id: String(messageId),
  396 |     queue_status: 'sent',
  397 |     updated_at: toIso(),
  398 |   }
  399 |   const metrics = await readJson(METRICS_FILE)
  400 |   const nextMetrics = (metrics && typeof metrics === 'object' && !Array.isArray(metrics)) ? metrics : {}
  401 |   addMetric(nextMetrics, 'sent_from_queue')
  402 |   const queuedTotal = Number(nextMetrics.queued_total || 0)
  403 |   const sentFromQueue = Number(nextMetrics.sent_from_queue || 0)
  404 |   nextMetrics.queued_to_sent_conversion = queuedTotal ? Number((sentFromQueue / queuedTotal).toFixed(4)) : 0
  405 | 
  406 |   await Promise.all([
  407 |     writeJson(QUEUE_FILE, nextRows),
  408 |     writeJson(LEGACY_QUEUE_FILE, nextRows),
  409 |     writeJson(METRICS_FILE, nextMetrics),
  410 |   ])
  411 | }
  412 | 
  413 | export async function listPolicyFalsePositiveCandidates() {
  414 |   const logs = await readJson(LOGS_FILE)
  415 |   const rows = Array.isArray(logs) ? logs : []
  416 |   return rows
  417 |     .filter((row) => ['hard_block', 'queue', 'soft_block'].includes(String(row.action || '')))
  418 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  419 |     .slice(0, 250)
  420 | }
  421 | 
  422 | export async function listMessageQueueItems({ status = '' } = {}) {
  423 |   const rows = await readJson(QUEUE_FILE)
  424 |   const queueRows = Array.isArray(rows) ? rows : []
  425 |   const normalized = String(status || '').trim().toLowerCase()
  426 |   const filtered = normalized ? queueRows.filter((row) => String(row.queue_status || '').toLowerCase() === normalized) : queueRows
  427 |   return filtered.sort((a, b) => {
  428 |     const scoreDelta = Number(b.queue_score || 0) - Number(a.queue_score || 0)
  429 |     if (scoreDelta !== 0) return scoreDelta
  430 |     return String(a.created_at || '').localeCompare(String(b.created_at || ''))
  431 |   })
  432 | }
  433 | 
  434 | export async function markPolicyDecisionFalsePositive(decisionId, reviewerId, notes = '') {
  435 |   const logs = await readJson(LOGS_FILE)
  436 |   const next = Array.isArray(logs) ? logs : []
  437 |   const idx = next.findIndex((row) => String(row.id || '') === String(decisionId || ''))
  438 |   if (idx < 0) return null
  439 |   next[idx] = {
  440 |     ...next[idx],
  441 |     false_positive: true,
  442 |     reviewer_id: sanitizeString(String(reviewerId || ''), 120) || null,
  443 |     reviewer_notes: sanitizeString(String(notes || ''), 400) || null,
  444 |     updated_at: toIso(),
  445 |   }
  446 |   const metrics = await readJson(METRICS_FILE)
  447 |   const nextMetrics = (metrics && typeof metrics === 'object' && !Array.isArray(metrics)) ? metrics : {}
  448 |   addMetric(nextMetrics, 'false_positive_total')
  449 | 
  450 |   await Promise.all([
  451 |     writeJson(LOGS_FILE, next),
  452 |     writeJson(LEGACY_LOGS_FILE, next),
  453 |     writeJson(METRICS_FILE, nextMetrics),
  454 |   ])
  455 |   return next[idx]
  456 | }
  457 | 
  458 | export async function adjustSenderReputation(senderId, delta = 0, actorId = '', notes = '') {
  459 |   const rows = await readJson(REPUTATION_FILE)
  460 |   const next = Array.isArray(rows) ? rows : []
  461 |   const safeSenderId = sanitizeString(String(senderId || ''), 120)
  462 |   if (!safeSenderId) return null
  463 | 
  464 |   const idx = next.findIndex((row) => String(row.sender_id || '') === safeSenderId)
  465 |   const now = toIso()
  466 |   if (idx < 0) {
  467 |     next.push({
  468 |       id: crypto.randomUUID(),
  469 |       sender_id: safeSenderId,
  470 |       trust_score: Math.max(0, Math.min(100, Number(50 + delta))),
  471 |       spam_reports: 0,
  472 |       positive_interactions: 0,
  473 |       adjusted_by: sanitizeString(String(actorId || ''), 120) || null,
  474 |       adjustment_notes: sanitizeString(String(notes || ''), 400) || null,
  475 |       updated_at: now,
  476 |     })
  477 |   } else {
  478 |     const current = Number(next[idx].trust_score || 50)
  479 |     next[idx] = {
  480 |       ...next[idx],
  481 |       trust_score: Math.max(0, Math.min(100, Number((current + Number(delta || 0)).toFixed(2)))),
  482 |       adjusted_by: sanitizeString(String(actorId || ''), 120) || null,
  483 |       adjustment_notes: sanitizeString(String(notes || ''), 400) || null,
  484 |       updated_at: now,
  485 |     }
  486 |   }
  487 | 
  488 |   await writeJson(REPUTATION_FILE, next)
  489 |   return next.find((row) => String(row.sender_id || '') === safeSenderId) || null
  490 | }
  491 | 
  492 | export async function getWeeklyDecisionQualityReport() {
  493 |   const [logs, metrics] = await Promise.all([readJson(LOGS_FILE), readJson(METRICS_FILE)])
  494 |   const rows = Array.isArray(logs) ? logs : []
  495 |   const since = Date.now() - 7 * 24 * 60 * 60 * 1000
  496 |   const weekly = rows.filter((row) => new Date(row.created_at || 0).getTime() >= since)
  497 | 
  498 |   const byAction = weekly.reduce((acc, row) => {
  499 |     const key = String(row.action || 'unknown')
  500 |     acc[key] = Number(acc[key] || 0) + 1
  501 |     return acc
  502 |   }, {})
  503 |   const falsePositives = weekly.filter((row) => row.false_positive).length
  504 |   const reviewed = weekly.filter((row) => row.reviewer_id || row.false_positive).length
  505 | 
  506 |   const responseQualityByRole = weekly.reduce((acc, row) => {
  507 |     const role = String(row.sender_role || 'unknown')
  508 |     const base = Number(acc[role] || 0)
  509 |     const bonus = row.action === 'allow' ? 1 : (row.action === 'queue' ? 0.4 : -0.8)
  510 |     acc[role] = Number((base + bonus).toFixed(3))
  511 |     return acc
  512 |   }, {})
  513 | 
  514 |   return {
  515 |     window: '7d',
  516 |     generated_at: toIso(),
  517 |     totals: {
  518 |       decisions: weekly.length,
  519 |       false_positives: falsePositives,
  520 |       reviewed,
  521 |       false_positive_rate: weekly.length ? Number((falsePositives / weekly.length).toFixed(4)) : 0,
  522 |     },
  523 |     by_action: byAction,
  524 |     policy_metrics: (metrics && typeof metrics === 'object' && !Array.isArray(metrics)) ? metrics : {},
  525 |     response_quality_score_by_role: responseQualityByRole,
  526 |   }
  527 | }
  528 | 
  529 | 
  530 | 
  531 | export async function getCommunicationPolicyConfig({ org_id = '' } = {}) {
  532 |   const rows = await ensureDefaultConfigRows()
  533 |   const map = buildConfigMap(rows)
  534 |   return resolvePolicyConfig(map, org_id)
  535 | }
  536 | 
  537 | export async function upsertCommunicationPolicyConfig({ scope = 'global', org_id = null, config = {}, actor_id = '' }) {
  538 |   const safeScope = scope === 'org' ? 'org' : 'global'
  539 |   const rows = await ensureDefaultConfigRows()
  540 |   const id = safeScope === 'global' ? 'global' : `org:${sanitizeString(String(org_id || ''), 120)}`
  541 |   if (safeScope === 'org' && !org_id) {
  542 |     const err = new Error('org_id is required for org scope policy updates')
  543 |     err.status = 400
  544 |     throw err
  545 |   }
  546 | 
  547 |   const idx = rows.findIndex((row) => String(row.id || '') === id)
  548 |   const base = safeScope === 'global' ? DEFAULT_GLOBAL_CONFIG : { ...DEFAULT_GLOBAL_CONFIG, scope: 'org', org_id }
  549 |   const nextRow = normalizeConfig({
  550 |     ...(idx >= 0 ? rows[idx] : base),
  551 |     ...config,
  552 |     id,
  553 |     scope: safeScope,
  554 |     org_id: safeScope === 'org' ? org_id : null,
  555 |     updated_by: sanitizeString(String(actor_id || ''), 120) || null,
  556 |     updated_at: toIso(),
  557 |   })
  558 | 
  559 |   if (idx >= 0) rows[idx] = nextRow
  560 |   else rows.push(nextRow)
  561 | 
  562 |   await Promise.all([
  563 |     writeJson(LIMITS_FILE, rows),
  564 |     writeJson(LEGACY_LIMITS_FILE, rows),
  565 |   ])
  566 |   return nextRow
  567 | }
  568 | 