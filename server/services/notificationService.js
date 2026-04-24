import crypto from "crypto";
import { readJson, writeJson } from "../utils/jsonStore.js";
import { sanitizeString } from "../utils/validators.js";
import {
  emitNotificationCreated,
  emitNotificationRead,
} from "../realtime/realtimeBus.js";

const ALERTS_FILE = "search_alerts.json";
const NOTIFICATIONS_FILE = "notifications.json";
const REQUIREMENTS_FILE = "requirements.json";
const MESSAGES_FILE = "messages.json";
const DOCUMENTS_FILE = "documents.json";

export async function createNotification(userId, payload = {}) {
  const notifications = await readJson(NOTIFICATIONS_FILE);
  const row = {
    id: crypto.randomUUID(),
    user_id: sanitizeString(String(userId || ""), 120),
    type: sanitizeString(payload.type || "system", 64),
    entity_type: sanitizeString(payload.entity_type || "", 64),
    entity_id: sanitizeString(payload.entity_id || "", 120),
    message: sanitizeString(payload.message || "Notification", 240),
    meta: payload.meta && typeof payload.meta === "object" ? payload.meta : {},
    read: false,
    created_at: new Date().toISOString(),
  };
  notifications.push(row);
  await writeJson(NOTIFICATIONS_FILE, notifications);
  emitNotificationCreated(userId, row);
  return row;
}

export async function saveSearchAlert(userId, query, filters = {}) {
  const alerts = await readJson(ALERTS_FILE);
  const normalizedQuery = sanitizeString(query || "", 160).toLowerCase();
  if (!normalizedQuery) return null;

  const existing = alerts.find(
    (a) => a.user_id === userId && a.query === normalizedQuery,
  );
  if (existing) {
    existing.filters = filters;
    existing.updated_at = new Date().toISOString();
    await writeJson(ALERTS_FILE, alerts);
    return existing;
  }

  const row = {
    id: crypto.randomUUID(),
    user_id: userId,
    query: normalizedQuery,
    filters,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  alerts.push(row);
  await writeJson(ALERTS_FILE, alerts);
  return row;
}

export async function listMySearchAlerts(userId) {
  const alerts = await readJson(ALERTS_FILE);
  return alerts.filter((a) => a.user_id === userId);
}

export async function deleteSearchAlertForUser(userId, alertId) {
  const alerts = await readJson(ALERTS_FILE);
  const next = alerts.filter(
    (a) => !(a.user_id === userId && a.id === alertId),
  );
  if (next.length === alerts.length) return false;
  await writeJson(ALERTS_FILE, next);
  return true;
}

function normalizeFilters(filters = {}) {
  return filters && typeof filters === "object" ? filters : {};
}

function scoreMatch(alert, entityType, entity, payloadText) {
  const hay = String(payloadText || "").toLowerCase();
  const queryParts = String(alert.query || "")
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (!queryParts.length) return 0;

  let score = 0;
  const title = String(entity?.title || "").toLowerCase();

  for (const part of queryParts) {
    if (!part) continue;
    if (title.includes(part)) score += 25;
    else if (hay.includes(part)) score += 15;
  }

  const filters = normalizeFilters(alert.filters);
  if (filters.verifiedOnly && !entity?.verified) return 0;
  if (
    filters.category &&
    String(entity?.category || "").toLowerCase() !==
      String(filters.category || "").toLowerCase()
  )
    return 0;

  // orgType is only meaningful for company products (factory/buying_house).
  if (filters.orgType && entityType === "company_product") {
    if (
      String(entity?.company_role || "").toLowerCase() !==
      String(filters.orgType || "").toLowerCase()
    )
      return 0;
  }

  // Give a small bonus when core filters match.
  if (filters.category && score > 0) score += 10;
  if (filters.verifiedOnly && score > 0) score += 10;

  return score;
}

export async function emitNotificationsForEntity(entityType, entity) {
  const alerts = await readJson(ALERTS_FILE);
  const notifications = await readJson(NOTIFICATIONS_FILE);
  const payloadText = `${entity.title || ""} ${entity.category || ""} ${entity.material || ""} ${entity.description || ""} ${entity.custom_description || ""}`;

  for (const alert of alerts) {
    const score = scoreMatch(alert, entityType, entity, payloadText);
    if (score < 50) continue;
    notifications.push({
      id: crypto.randomUUID(),
      user_id: alert.user_id,
      type: "smart_search_match",
      entity_type: entityType,
      entity_id: entity.id,
      message: `New ${entityType.replace("_", " ")} matches your search: "${alert.query}"`,
      meta: { score },
      read: false,
      created_at: new Date().toISOString(),
    });
  }

  await writeJson(NOTIFICATIONS_FILE, notifications);
}

export async function listNotifications(userId) {
  const notifications = await readJson(NOTIFICATIONS_FILE);
  const list = notifications.filter((n) => n.user_id === userId);
  const ensured = await ensureMonthlySummary(userId, list, notifications);
  return ensured
    .filter((n) => n.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function markNotificationRead(userId, id) {
  const notifications = await readJson(NOTIFICATIONS_FILE);
  const idx = notifications.findIndex(
    (n) => n.id === id && n.user_id === userId,
  );
  if (idx < 0) return null;
  notifications[idx].read = true;
  await writeJson(NOTIFICATIONS_FILE, notifications);
  emitNotificationRead(userId, id);
  return notifications[idx];
}

function monthKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

async function ensureMonthlySummary(
  userId,
  userNotifications = [],
  allNotifications = [],
) {
  const key = monthKey();
  const already = userNotifications.some(
    (n) => n.type === "monthly_summary" && String(n?.meta?.month || "") === key,
  );
  if (already) return allNotifications;

  const [requirements, messages, documents] = await Promise.all([
    readJson(REQUIREMENTS_FILE),
    readJson(MESSAGES_FILE),
    readJson(DOCUMENTS_FILE),
  ]);

  const monthStart = new Date(`${key}-01T00:00:00.000Z`);
  const isThisMonth = (iso) => {
    if (!iso) return false;
    const ts = new Date(iso).getTime();
    return Number.isFinite(ts) && ts >= monthStart.getTime();
  };

  const reqCount = (Array.isArray(requirements) ? requirements : []).filter(
    (r) => r?.buyer_id === userId && isThisMonth(r.created_at),
  ).length;
  const msgCount = (Array.isArray(messages) ? messages : []).filter(
    (m) => m?.sender_id === userId && isThisMonth(m.timestamp || m.created_at),
  ).length;
  const contractCount = (Array.isArray(documents) ? documents : []).filter(
    (d) =>
      String(d?.entity_type || "") === "contract" && isThisMonth(d.created_at),
  ).length;

  const summary = {
    id: crypto.randomUUID(),
    user_id: sanitizeString(String(userId || ""), 120),
    type: "monthly_summary",
    entity_type: "summary",
    entity_id: key,
    message: `Monthly summary (${key}): ${reqCount} requests, ${msgCount} messages, ${contractCount} contracts.`,
    meta: {
      month: key,
      requests: reqCount,
      messages: msgCount,
      contracts: contractCount,
    },
    read: false,
    created_at: new Date().toISOString(),
  };

  allNotifications.push(summary);
  await writeJson(NOTIFICATIONS_FILE, allNotifications);
  return allNotifications;
}
