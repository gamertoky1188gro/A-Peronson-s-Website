import crypto from "crypto";
import { readJson, writeJson } from "../utils/jsonStore.js";
import { sanitizeString } from "../utils/validators.js";
import { debitWallet } from "./walletService.js";
import { trackEvent } from "./eventTrackingService.js";

const FILE = "boosts.json";

const DEFAULTS = {
  durationDays: Number(process.env.BOOST_DEFAULT_DURATION_DAYS || 7),
  multiplier: Number(process.env.BOOST_DEFAULT_MULTIPLIER || 1.5),
  priceUsd: Number(process.env.BOOST_DEFAULT_PRICE_USD || 9.99),
};

const ALLOWED_SCOPES = new Set(["feed", "profile"]);

function nowIso() {
  return new Date().toISOString();
}

function addDaysIso(days) {
  const safeDays = Number(days) > 0 ? Number(days) : DEFAULTS.durationDays;
  return new Date(Date.now() + safeDays * 24 * 60 * 60 * 1000).toISOString();
}

function normalizeScope(scope) {
  const value = sanitizeString(String(scope || ""), 20).toLowerCase();
  return ALLOWED_SCOPES.has(value) ? value : "feed";
}

function normalizeMultiplier(multiplier) {
  const value = Number(multiplier);
  if (!Number.isFinite(value) || value <= 1) return DEFAULTS.multiplier;
  return Math.min(3, Math.max(1.05, value));
}

function normalizePrice(priceUsd) {
  const value = Number(priceUsd);
  if (!Number.isFinite(value) || value <= 0) return DEFAULTS.priceUsd;
  return Math.round(value * 100) / 100;
}

function isActiveBoost(boost) {
  if (!boost) return false;
  if (String(boost.status || "").toLowerCase() !== "active") return false;
  const now = Date.now();
  const startsAt = new Date(boost.starts_at).getTime();
  const endsAt = new Date(boost.ends_at).getTime();
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false;
  return now >= startsAt && now <= endsAt;
}

export async function getActiveBoostMap(scope = "") {
  const normalizedScope = scope ? normalizeScope(scope) : "";
  const boosts = await readJson(FILE);
  const rows = Array.isArray(boosts) ? boosts : [];
  const activeByUser = {};

  rows.forEach((boost) => {
    if (!isActiveBoost(boost)) return;
    if (
      normalizedScope &&
      String(boost.scope || "").toLowerCase() !== normalizedScope
    )
      return;
    const userId = String(boost.user_id || "");
    if (!userId) return;
    const multiplier = Number(boost.multiplier || 1);
    if (!Number.isFinite(multiplier) || multiplier <= 1) return;
    const current = Number(activeByUser[userId] || 1);
    if (multiplier > current) activeByUser[userId] = multiplier;
  });

  return activeByUser;
}

export async function listBoostsForUser(userId) {
  const boosts = await readJson(FILE);
  return boosts
    .filter((b) => String(b.user_id) === String(userId || ""))
    .sort((a, b) =>
      String(b.created_at || "").localeCompare(String(a.created_at || "")),
    );
}

export async function getActiveBoostsForUser(userId, scope = "") {
  const normalizedScope = scope ? normalizeScope(scope) : "";
  const boosts = await listBoostsForUser(userId);
  return boosts.filter((b) => {
    if (
      normalizedScope &&
      String(b.scope || "").toLowerCase() !== normalizedScope
    )
      return false;
    return isActiveBoost(b);
  });
}

export async function getActiveBoostMultiplier(userId, scope = "") {
  const active = await getActiveBoostsForUser(userId, scope);
  if (!active.length) return 1;
  const maxMultiplier = active.reduce(
    (acc, b) => Math.max(acc, Number(b.multiplier || 1)),
    1,
  );
  return Number.isFinite(maxMultiplier) && maxMultiplier > 1
    ? maxMultiplier
    : 1;
}

export async function purchaseBoost(userId, payload = {}) {
  const boosts = await readJson(FILE);
  const scope = normalizeScope(payload.scope);
  const durationDays = Number(
    payload.duration_days || payload.durationDays || DEFAULTS.durationDays,
  );
  const multiplier = normalizeMultiplier(payload.multiplier);
  const priceUsd = normalizePrice(payload.price_usd);

  const hasActive = boosts.some(
    (b) =>
      String(b.user_id) === String(userId || "") &&
      String(b.scope || "").toLowerCase() === scope &&
      isActiveBoost(b),
  );
  if (hasActive) return "active_exists";

  await debitWallet({
    userId,
    amountUsd: priceUsd,
    reason: "boost_purchase",
    ref: `boost:${scope}`,
    metadata: { scope, multiplier, duration_days: durationDays },
  });

  const now = nowIso();
  const row = {
    id: crypto.randomUUID(),
    user_id: String(userId),
    scope,
    multiplier,
    status: "active",
    starts_at: now,
    ends_at: addDaysIso(durationDays),
    price_usd: priceUsd,
    created_at: now,
    cancelled_at: null,
  };

  boosts.push(row);
  await writeJson(FILE, boosts);

  await trackEvent({
    type: "boost_purchase",
    actor_id: String(userId),
    entity_id: row.id,
    metadata: {
      scope,
      multiplier,
      duration_days: durationDays,
      price_usd: priceUsd,
    },
  });

  return row;
}

export async function cancelBoost(userId, boostId) {
  const boosts = await readJson(FILE);
  const idx = boosts.findIndex((b) => String(b.id) === String(boostId || ""));
  if (idx < 0) return null;
  if (String(boosts[idx].user_id) !== String(userId || "")) return "forbidden";

  const next = {
    ...boosts[idx],
    status: "cancelled",
    cancelled_at: nowIso(),
  };
  boosts[idx] = next;
  await writeJson(FILE, boosts);

  await trackEvent({
    type: "boost_cancelled",
    actor_id: String(userId),
    entity_id: next.id,
    metadata: { scope: next.scope },
  });

  return next;
}

export async function expireBoosts() {
  const boosts = await readJson(FILE);
  let changed = false;
  const now = Date.now();
  const next = boosts.map((b) => {
    if (String(b.status || "").toLowerCase() !== "active") return b;
    const endsAt = new Date(b.ends_at).getTime();
    if (!Number.isFinite(endsAt) || endsAt >= now) return b;
    changed = true;
    return { ...b, status: "expired" };
  });

  if (changed) await writeJson(FILE, next);
  return next;
}
