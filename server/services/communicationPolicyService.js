import crypto from "crypto";
import { readJson, writeJson } from "../utils/jsonStore.js";
import { sanitizeString } from "../utils/validators.js";

const MESSAGE_FILE = "messages.json";
const LIMITS_FILE = "communication_limits.json";
const QUEUE_FILE = "message_queue_items.json";
const LOGS_FILE = "message_policy_logs.json";
const REPUTATION_FILE = "sender_reputation.json";
const METRICS_FILE = "policy_metrics.json";

const LEGACY_LIMITS_FILE = "communication_policy_configs.json";
const LEGACY_QUEUE_FILE = "message_queue.json";
const LEGACY_LOGS_FILE = "message_policy_decisions.json";

const DEFAULT_GLOBAL_CONFIG = {
  id: "global",
  scope: "global",
  org_id: null,
  message_caps: {
    outbound_per_window: 12,
    window_minutes: 15,
    cooldown_seconds: 30,
  },
  priority_multipliers: {
    premium: 1.2,
    verified: 1.3,
  },
  strictness_mode: "balanced",
  spam_thresholds: {
    queue: 0.45,
    hard_block: 0.75,
  },
};

const STRICTNESS_MODES = {
  relaxed: { capFactor: 1.35, spamDelta: 0.08 },
  balanced: { capFactor: 1, spamDelta: 0 },
  strict: { capFactor: 0.8, spamDelta: -0.08 },
};

const RISK_PATTERNS = [
  {
    pattern:
      /(free\s+money|crypto\s+airdrop|guaranteed\s+profit|click\s+here)/i,
    weight: 0.45,
  },
  {
    pattern:
      /(http:\/\/|bit\.ly|t\.me|wa\.me|telegram|whatsapp|contact\s+me\s+on)/i,
    weight: 0.35,
  },
  { pattern: /(urgent|act\s+now|limited\s+offer|winner)/i, weight: 0.2 },
  { pattern: /(免费|点击|现在联系|优惠|促销)/i, weight: 0.25 },
  {
    pattern: /(বিনামূল্যে|অফার|যোগাযোগ|টেলিগ্রাম|হোয়াটসঅ্যাপ|হোয়াটসঅ্যাপ)/i,
    weight: 0.25,
  },
  {
    pattern: /(oferta|gratis|haz\s+clic|contacta\s+por\s+telegram)/i,
    weight: 0.2,
  },
];

function normalizeText(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function toIso(date = new Date()) {
  return new Date(date).toISOString();
}

function addMetric(metrics, key, step = 1) {
  metrics[key] = Number(metrics[key] || 0) + Number(step || 0);
}

function resolveStrictnessMode(mode = "balanced") {
  const key = String(mode || "balanced").toLowerCase();
  return STRICTNESS_MODES[key] ? key : "balanced";
}

function normalizeConfig(row = {}) {
  const strictnessMode = resolveStrictnessMode(row?.strictness_mode);
  const legacyMax = Number(
    row?.max_outreach_per_window ||
      DEFAULT_GLOBAL_CONFIG.message_caps.outbound_per_window,
  );
  const legacyWindow = Number(
    row?.outreach_window_minutes ||
      DEFAULT_GLOBAL_CONFIG.message_caps.window_minutes,
  );
  const legacyCooldown = Number(
    row?.cooldown_seconds ||
      DEFAULT_GLOBAL_CONFIG.message_caps.cooldown_seconds,
  );
  const legacyPremiumBoost = Number(row?.premium_boost || 20);
  const legacyVerifiedBoost = Number(row?.verified_boost || 30);

  return {
    ...DEFAULT_GLOBAL_CONFIG,
    ...row,
    message_caps: {
      ...DEFAULT_GLOBAL_CONFIG.message_caps,
      ...(row?.message_caps || {}),
      outbound_per_window: Number(
        row?.message_caps?.outbound_per_window ||
          row?.max_outreach_per_window ||
          legacyMax,
      ),
      window_minutes: Number(
        row?.message_caps?.window_minutes ||
          row?.outreach_window_minutes ||
          legacyWindow,
      ),
      cooldown_seconds: Number(
        row?.message_caps?.cooldown_seconds ||
          row?.cooldown_seconds ||
          legacyCooldown,
      ),
    },
    priority_multipliers: {
      ...DEFAULT_GLOBAL_CONFIG.priority_multipliers,
      ...(row?.priority_multipliers || {}),
      premium: Number(
        row?.priority_multipliers?.premium ||
          row?.premium_multiplier ||
          Math.max(1, legacyPremiumBoost / 100 + 1),
      ),
      verified: Number(
        row?.priority_multipliers?.verified ||
          row?.verified_multiplier ||
          Math.max(1, legacyVerifiedBoost / 100 + 1),
      ),
    },
    strictness_mode: strictnessMode,
    spam_thresholds: {
      ...DEFAULT_GLOBAL_CONFIG.spam_thresholds,
      ...(row?.spam_thresholds || {}),
      queue: Number(
        row?.spam_thresholds?.queue ||
          row?.keyword_risk_threshold_soft ||
          DEFAULT_GLOBAL_CONFIG.spam_thresholds.queue,
      ),
      hard_block: Number(
        row?.spam_thresholds?.hard_block ||
          row?.keyword_risk_threshold_hard ||
          DEFAULT_GLOBAL_CONFIG.spam_thresholds.hard_block,
      ),
    },
  };
}

function buildConfigMap(configRows = []) {
  const map = new Map();
  for (const row of configRows) {
    if (!row?.id) continue;
    map.set(String(row.id), normalizeConfig(row));
  }
  if (!map.has("global"))
    map.set("global", normalizeConfig(DEFAULT_GLOBAL_CONFIG));
  return map;
}

function resolvePolicyConfig(configMap, orgId = "") {
  const global = normalizeConfig(
    configMap.get("global") || DEFAULT_GLOBAL_CONFIG,
  );
  if (!orgId) return global;
  const orgRow = configMap.get(`org:${orgId}`);
  if (!orgRow) return global;
  return normalizeConfig({ ...global, ...orgRow });
}

function estimateSpamScore(text = "") {
  const normalized = normalizeText(text);
  if (!normalized) return 0;
  let score = 0;
  for (const entry of RISK_PATTERNS) {
    if (entry.pattern.test(normalized)) score += entry.weight;
  }
  return Math.max(0, Math.min(1, score));
}

function withinWindow(messages = [], senderId, windowMinutes = 15) {
  const cutoff = Date.now() - Number(windowMinutes || 15) * 60 * 1000;
  return messages.filter(
    (row) =>
      String(row.sender_id || "") === String(senderId || "") &&
      new Date(row.timestamp || 0).getTime() >= cutoff,
  );
}

function hasRecentDuplicate(messages = [], senderId, matchId, text = "") {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  const cutoff = Date.now() - 10 * 60 * 1000;
  return messages.some((row) => {
    if (String(row.sender_id || "") !== String(senderId || "")) return false;
    if (String(row.match_id || "") !== String(matchId || "")) return false;
    if (new Date(row.timestamp || 0).getTime() < cutoff) return false;
    return normalizeText(row.message || "") === normalized;
  });
}

function firstResponsePriority(messages = [], matchId, senderId) {
  const threadMessages = messages.filter(
    (row) => String(row.match_id || "") === String(matchId || ""),
  );
  const hasSentBefore = threadMessages.some(
    (row) => String(row.sender_id || "") === String(senderId || ""),
  );
  return !hasSentBefore && threadMessages.length <= 2;
}

function queueRanking({
  sender,
  reputationScore,
  spamScore,
  config,
  firstResponse,
}) {
  const premiumMultiplier =
    String(sender?.subscription_status || "").toLowerCase() === "premium"
      ? Number(config?.priority_multipliers?.premium || 1)
      : 1;
  const verifiedMultiplier = sender?.verified
    ? Number(config?.priority_multipliers?.verified || 1)
    : 1;

  const premiumVerifiedPriorityScore = Number(
    (premiumMultiplier * verifiedMultiplier * 100).toFixed(2),
  );
  const basePriority = Number(reputationScore || 50) + (firstResponse ? 12 : 0);
  const riskPenalty = Math.round(Number(spamScore || 0) * 70);
  const adjusted = Math.round(
    basePriority * premiumMultiplier * verifiedMultiplier - riskPenalty,
  );

  if (adjusted >= 90)
    return {
      queue_rank: "urgent",
      queue_priority_label: "P1-Urgent",
      queue_priority_score: adjusted,
      premium_verified_priority_score: premiumVerifiedPriorityScore,
    };
  if (adjusted >= 65)
    return {
      queue_rank: "high",
      queue_priority_label: "P2-High",
      queue_priority_score: adjusted,
      premium_verified_priority_score: premiumVerifiedPriorityScore,
    };
  if (adjusted >= 40)
    return {
      queue_rank: "standard",
      queue_priority_label: "P3-Standard",
      queue_priority_score: adjusted,
      premium_verified_priority_score: premiumVerifiedPriorityScore,
    };
  return {
    queue_rank: "low",
    queue_priority_label: "P4-Low",
    queue_priority_score: adjusted,
    premium_verified_priority_score: premiumVerifiedPriorityScore,
  };
}

function rejectionReason(action, reason, retryAfterSeconds = 0) {
  if (action === "soft_block")
    return `Rate limit reached. Retry after ${Math.max(1, Number(retryAfterSeconds || 0))} seconds.`;
  if (action === "hard_block" && reason === "duplicate_suppression")
    return "Duplicate message detected. Please send a unique message.";
  if (action === "hard_block")
    return "Message blocked by communication safety policy.";
  return "";
}

async function ensureDefaultConfigRows() {
  const [current, legacy] = await Promise.all([
    readJson(LIMITS_FILE),
    readJson(LEGACY_LIMITS_FILE),
  ]);
  const rows =
    Array.isArray(current) && current.length > 0
      ? current
      : Array.isArray(legacy)
        ? legacy
        : [];

  if (!rows.some((row) => row?.id === "global")) {
    rows.push({ ...DEFAULT_GLOBAL_CONFIG, updated_at: toIso() });
  }

  await Promise.all([
    writeJson(LIMITS_FILE, rows),
    writeJson(LEGACY_LIMITS_FILE, rows),
  ]);

  return rows;
}

export function evaluatePolicyContract({
  sender = null,
  matchId = "",
  text = "",
  messages = [],
  config = DEFAULT_GLOBAL_CONFIG,
  reputationScore = 50,
}) {
  const normalizedConfig = normalizeConfig(config);
  const strictness =
    STRICTNESS_MODES[resolveStrictnessMode(normalizedConfig.strictness_mode)];
  const softThreshold = Math.max(
    0.05,
    Math.min(
      0.95,
      Number(normalizedConfig.spam_thresholds.queue || 0.45) +
        strictness.spamDelta,
    ),
  );
  const hardThreshold = Math.max(
    softThreshold + 0.05,
    Math.min(
      0.99,
      Number(normalizedConfig.spam_thresholds.hard_block || 0.75) +
        strictness.spamDelta,
    ),
  );

  const spamScore = estimateSpamScore(text);
  const recentMessages = withinWindow(
    messages,
    sender?.id || "",
    normalizedConfig.message_caps.window_minutes,
  );
  const duplicate = hasRecentDuplicate(
    messages,
    sender?.id || "",
    matchId,
    text,
  );
  const firstResponse = firstResponsePriority(
    messages,
    matchId,
    sender?.id || "",
  );
  const ranking = queueRanking({
    sender,
    reputationScore,
    spamScore,
    config: normalizedConfig,
    firstResponse,
  });

  const baseCap = Math.max(
    1,
    Number(normalizedConfig.message_caps.outbound_per_window || 12),
  );
  const capLimit = Math.max(1, Math.floor(baseCap * strictness.capFactor));
  const retryAfterSeconds = Math.max(
    1,
    Number(normalizedConfig.message_caps.cooldown_seconds || 30),
  );

  let action = "allow";
  let reason = "policy_allow";
  let moderationFlag = false;

  if (duplicate) {
    action = "hard_block";
    reason = "duplicate_suppression";
    moderationFlag = true;
  } else if (spamScore >= hardThreshold) {
    action = "hard_block";
    reason = "spam_hard_block";
    moderationFlag = true;
  } else if (recentMessages.length >= capLimit) {
    action = "soft_block";
    reason = "rate_limit_exceeded";
  } else if (spamScore >= softThreshold) {
    action = "queue";
    reason = "spam_soft_queue";
  }

  return {
    action,
    reason,
    spamScore,
    reputationScore,
    retryAfterSeconds: action === "soft_block" ? retryAfterSeconds : 0,
    recentCount: recentMessages.length,
    ranking,
    firstResponse,
    moderationFlag,
  };
}

export async function evaluateMessagePolicy({
  sender = null,
  matchId = "",
  text = "",
  type = "text",
  orgId = "",
}) {
  const [
    messages,
    configsRaw,
    queueRowsRaw,
    legacyQueueRaw,
    logRowsRaw,
    legacyLogsRaw,
    reputationRowsRaw,
    metricsRaw,
  ] = await Promise.all([
    readJson(MESSAGE_FILE),
    ensureDefaultConfigRows(),
    readJson(QUEUE_FILE),
    readJson(LEGACY_QUEUE_FILE),
    readJson(LOGS_FILE),
    readJson(LEGACY_LOGS_FILE),
    readJson(REPUTATION_FILE),
    readJson(METRICS_FILE),
  ]);

  const configMap = buildConfigMap(configsRaw);
  const config = resolvePolicyConfig(configMap, orgId);
  const queueRows =
    Array.isArray(queueRowsRaw) && queueRowsRaw.length
      ? queueRowsRaw
      : Array.isArray(legacyQueueRaw)
        ? legacyQueueRaw
        : [];
  const logRows =
    Array.isArray(logRowsRaw) && logRowsRaw.length
      ? logRowsRaw
      : Array.isArray(legacyLogsRaw)
        ? legacyLogsRaw
        : [];
  const reputationRows = Array.isArray(reputationRowsRaw)
    ? reputationRowsRaw
    : [];
  const metrics =
    metricsRaw && typeof metricsRaw === "object" && !Array.isArray(metricsRaw)
      ? metricsRaw
      : {};

  const senderId = String(sender?.id || "");
  const nowIso = toIso();
  const reputationIdx = reputationRows.findIndex(
    (row) => String(row.sender_id || "") === senderId,
  );
  const reputation =
    reputationIdx >= 0
      ? reputationRows[reputationIdx]
      : {
          id: crypto.randomUUID(),
          sender_id: senderId,
          trust_score: 50,
          spam_reports: 0,
          positive_interactions: 0,
          updated_at: nowIso,
        };

  const reputationScore = Math.max(
    0,
    Math.min(100, Number(reputation.trust_score || 50)),
  );
  const contract = evaluatePolicyContract({
    sender,
    matchId,
    text,
    messages,
    config,
    reputationScore,
  });

  const decisionId = crypto.randomUUID();
  const queueId = crypto.randomUUID();

  const logRow = {
    id: decisionId,
    queue_id:
      contract.action === "allow" ||
      contract.action === "soft_block" ||
      contract.action === "hard_block"
        ? null
        : queueId,
    sender_id: senderId,
    org_id: orgId || null,
    match_id: sanitizeString(String(matchId || ""), 160),
    action: contract.action,
    reason: contract.reason,
    reputation_score: Number(contract.reputationScore || 0),
    spam_score: Number(contract.spamScore.toFixed(4)),
    frequency_count: contract.recentCount,
    first_response_priority: contract.firstResponse,
    queue_rank: contract.ranking.queue_rank,
    queue_score: contract.ranking.queue_priority_score,
    queue_priority_label: contract.ranking.queue_priority_label,
    premium_verified_priority_score:
      contract.ranking.premium_verified_priority_score,
    retry_after_seconds: contract.retryAfterSeconds,
    moderation_flag: Boolean(contract.moderationFlag),
    false_positive: false,
    reviewer_id: null,
    reviewer_notes: null,
    created_at: nowIso,
    updated_at: nowIso,
  };

  logRows.push(logRow);
  addMetric(metrics, "total_inbound_outbound_evaluated");
  addMetric(metrics, contract.action);
  if (contract.action === "hard_block" || contract.action === "soft_block")
    addMetric(metrics, "blocked_total");

  let queue = null;
  if (contract.action === "queue") {
    queue = {
      id: queueId,
      message_id: null,
      match_id: sanitizeString(String(matchId || ""), 160),
      sender_id: senderId,
      org_id: orgId || null,
      queue_status: "queued",
      queue_rank: contract.ranking.queue_rank,
      queue_score: contract.ranking.queue_priority_score,
      queue_priority_label: contract.ranking.queue_priority_label,
      policy_reason: contract.reason,
      retry_after_seconds: null,
      requires_human_review: false,
      metadata: { message_type: type },
      created_at: nowIso,
      updated_at: nowIso,
    };
    queueRows.push(queue);
    addMetric(metrics, "queued_total");
  }

  if (reputationIdx >= 0) {
    const delta =
      contract.action === "hard_block"
        ? -3
        : contract.action === "soft_block"
          ? -1.5
          : 0.2;
    reputationRows[reputationIdx] = {
      ...reputationRows[reputationIdx],
      trust_score: Math.max(
        0,
        Math.min(100, Number((reputationScore + delta).toFixed(2))),
      ),
      spam_reports:
        contract.action === "hard_block"
          ? Number(reputationRows[reputationIdx].spam_reports || 0) + 1
          : Number(reputationRows[reputationIdx].spam_reports || 0),
      positive_interactions:
        contract.action === "allow"
          ? Number(reputationRows[reputationIdx].positive_interactions || 0) + 1
          : Number(reputationRows[reputationIdx].positive_interactions || 0),
      updated_at: nowIso,
    };
  } else {
    reputationRows.push(reputation);
  }

  const blockedTotal = Number(metrics.blocked_total || 0);
  const evaluatedTotal = Number(metrics.total_inbound_outbound_evaluated || 0);
  metrics.blocked_rate = evaluatedTotal
    ? Number((blockedTotal / evaluatedTotal).toFixed(4))
    : 0;

  const queuedTotal = Number(metrics.queued_total || 0);
  const sentFromQueue = Number(metrics.sent_from_queue || 0);
  metrics.queued_to_sent_conversion = queuedTotal
    ? Number((sentFromQueue / queuedTotal).toFixed(4))
    : 0;

  const falsePositives = Number(metrics.false_positive_total || 0);
  const spamActions =
    Number(metrics.hard_block || 0) + Number(metrics.queue || 0);
  metrics.spam_false_positive_ratio = spamActions
    ? Number((falsePositives / spamActions).toFixed(4))
    : 0;

  await Promise.all([
    writeJson(QUEUE_FILE, queueRows),
    writeJson(LEGACY_QUEUE_FILE, queueRows),
    writeJson(LOGS_FILE, logRows),
    writeJson(LEGACY_LOGS_FILE, logRows),
    writeJson(REPUTATION_FILE, reputationRows),
    writeJson(METRICS_FILE, metrics),
  ]);

  return {
    action: contract.action,
    reason: contract.reason,
    queue,
    decision: logRow,
    spam_score: logRow.spam_score,
    reputation_score: logRow.reputation_score,
    premium_verified_priority_score: logRow.premium_verified_priority_score,
    queue_rank: logRow.queue_rank,
    retry_after_seconds: contract.retryAfterSeconds,
    moderation_flag: Boolean(contract.moderationFlag),
    rejection_message: rejectionReason(
      contract.action,
      contract.reason,
      contract.retryAfterSeconds,
    ),
  };
}

export async function attachMessageToQueue(queueId, messageId) {
  if (!queueId || !messageId) return;
  const queueRows = await readJson(QUEUE_FILE);
  const nextRows = Array.isArray(queueRows) ? queueRows : [];
  const idx = nextRows.findIndex(
    (row) => String(row.id || "") === String(queueId),
  );
  if (idx < 0) return;
  nextRows[idx] = {
    ...nextRows[idx],
    message_id: String(messageId),
    queue_status: "sent",
    updated_at: toIso(),
  };
  const metrics = await readJson(METRICS_FILE);
  const nextMetrics =
    metrics && typeof metrics === "object" && !Array.isArray(metrics)
      ? metrics
      : {};
  addMetric(nextMetrics, "sent_from_queue");
  const queuedTotal = Number(nextMetrics.queued_total || 0);
  const sentFromQueue = Number(nextMetrics.sent_from_queue || 0);
  nextMetrics.queued_to_sent_conversion = queuedTotal
    ? Number((sentFromQueue / queuedTotal).toFixed(4))
    : 0;

  await Promise.all([
    writeJson(QUEUE_FILE, nextRows),
    writeJson(LEGACY_QUEUE_FILE, nextRows),
    writeJson(METRICS_FILE, nextMetrics),
  ]);
}

export async function listPolicyFalsePositiveCandidates() {
  const logs = await readJson(LOGS_FILE);
  const rows = Array.isArray(logs) ? logs : [];
  return rows
    .filter((row) =>
      ["hard_block", "queue", "soft_block"].includes(String(row.action || "")),
    )
    .sort((a, b) =>
      String(b.created_at || "").localeCompare(String(a.created_at || "")),
    )
    .slice(0, 250);
}

export async function listMessageQueueItems({ status = "" } = {}) {
  const rows = await readJson(QUEUE_FILE);
  const queueRows = Array.isArray(rows) ? rows : [];
  const normalized = String(status || "")
    .trim()
    .toLowerCase();
  const filtered = normalized
    ? queueRows.filter(
        (row) => String(row.queue_status || "").toLowerCase() === normalized,
      )
    : queueRows;
  return filtered.sort((a, b) => {
    const scoreDelta = Number(b.queue_score || 0) - Number(a.queue_score || 0);
    if (scoreDelta !== 0) return scoreDelta;
    return String(a.created_at || "").localeCompare(String(b.created_at || ""));
  });
}

export async function markPolicyDecisionFalsePositive(
  decisionId,
  reviewerId,
  notes = "",
) {
  const logs = await readJson(LOGS_FILE);
  const next = Array.isArray(logs) ? logs : [];
  const idx = next.findIndex(
    (row) => String(row.id || "") === String(decisionId || ""),
  );
  if (idx < 0) return null;
  next[idx] = {
    ...next[idx],
    false_positive: true,
    reviewer_id: sanitizeString(String(reviewerId || ""), 120) || null,
    reviewer_notes: sanitizeString(String(notes || ""), 400) || null,
    updated_at: toIso(),
  };
  const metrics = await readJson(METRICS_FILE);
  const nextMetrics =
    metrics && typeof metrics === "object" && !Array.isArray(metrics)
      ? metrics
      : {};
  addMetric(nextMetrics, "false_positive_total");

  await Promise.all([
    writeJson(LOGS_FILE, next),
    writeJson(LEGACY_LOGS_FILE, next),
    writeJson(METRICS_FILE, nextMetrics),
  ]);
  return next[idx];
}

export async function adjustSenderReputation(
  senderId,
  delta = 0,
  actorId = "",
  notes = "",
) {
  const rows = await readJson(REPUTATION_FILE);
  const next = Array.isArray(rows) ? rows : [];
  const safeSenderId = sanitizeString(String(senderId || ""), 120);
  if (!safeSenderId) return null;

  const idx = next.findIndex(
    (row) => String(row.sender_id || "") === safeSenderId,
  );
  const now = toIso();
  if (idx < 0) {
    next.push({
      id: crypto.randomUUID(),
      sender_id: safeSenderId,
      trust_score: Math.max(0, Math.min(100, Number(50 + delta))),
      spam_reports: 0,
      positive_interactions: 0,
      adjusted_by: sanitizeString(String(actorId || ""), 120) || null,
      adjustment_notes: sanitizeString(String(notes || ""), 400) || null,
      updated_at: now,
    });
  } else {
    const current = Number(next[idx].trust_score || 50);
    next[idx] = {
      ...next[idx],
      trust_score: Math.max(
        0,
        Math.min(100, Number((current + Number(delta || 0)).toFixed(2))),
      ),
      adjusted_by: sanitizeString(String(actorId || ""), 120) || null,
      adjustment_notes: sanitizeString(String(notes || ""), 400) || null,
      updated_at: now,
    };
  }

  await writeJson(REPUTATION_FILE, next);
  return (
    next.find((row) => String(row.sender_id || "") === safeSenderId) || null
  );
}

export async function getWeeklyDecisionQualityReport() {
  const [logs, metrics] = await Promise.all([
    readJson(LOGS_FILE),
    readJson(METRICS_FILE),
  ]);
  const rows = Array.isArray(logs) ? logs : [];
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekly = rows.filter(
    (row) => new Date(row.created_at || 0).getTime() >= since,
  );

  const byAction = weekly.reduce((acc, row) => {
    const key = String(row.action || "unknown");
    acc[key] = Number(acc[key] || 0) + 1;
    return acc;
  }, {});
  const falsePositives = weekly.filter((row) => row.false_positive).length;
  const reviewed = weekly.filter(
    (row) => row.reviewer_id || row.false_positive,
  ).length;

  const responseQualityByRole = weekly.reduce((acc, row) => {
    const role = String(row.sender_role || "unknown");
    const base = Number(acc[role] || 0);
    const bonus =
      row.action === "allow" ? 1 : row.action === "queue" ? 0.4 : -0.8;
    acc[role] = Number((base + bonus).toFixed(3));
    return acc;
  }, {});

  return {
    window: "7d",
    generated_at: toIso(),
    totals: {
      decisions: weekly.length,
      false_positives: falsePositives,
      reviewed,
      false_positive_rate: weekly.length
        ? Number((falsePositives / weekly.length).toFixed(4))
        : 0,
    },
    by_action: byAction,
    policy_metrics:
      metrics && typeof metrics === "object" && !Array.isArray(metrics)
        ? metrics
        : {},
    response_quality_score_by_role: responseQualityByRole,
  };
}

export async function getCommunicationPolicyConfig({ org_id = "" } = {}) {
  const rows = await ensureDefaultConfigRows();
  const map = buildConfigMap(rows);
  return resolvePolicyConfig(map, org_id);
}

export async function upsertCommunicationPolicyConfig({
  scope = "global",
  org_id = null,
  config = {},
  actor_id = "",
}) {
  const safeScope = scope === "org" ? "org" : "global";
  const rows = await ensureDefaultConfigRows();
  const id =
    safeScope === "global"
      ? "global"
      : `org:${sanitizeString(String(org_id || ""), 120)}`;
  if (safeScope === "org" && !org_id) {
    const err = new Error("org_id is required for org scope policy updates");
    err.status = 400;
    throw err;
  }

  const idx = rows.findIndex((row) => String(row.id || "") === id);
  const base =
    safeScope === "global"
      ? DEFAULT_GLOBAL_CONFIG
      : { ...DEFAULT_GLOBAL_CONFIG, scope: "org", org_id };
  const nextRow = normalizeConfig({
    ...(idx >= 0 ? rows[idx] : base),
    ...config,
    id,
    scope: safeScope,
    org_id: safeScope === "org" ? org_id : null,
    updated_by: sanitizeString(String(actor_id || ""), 120) || null,
    updated_at: toIso(),
  });

  if (idx >= 0) rows[idx] = nextRow;
  else rows.push(nextRow);

  await Promise.all([
    writeJson(LIMITS_FILE, rows),
    writeJson(LEGACY_LIMITS_FILE, rows),
  ]);
  return nextRow;
}
