import { readJson, writeJson } from "../utils/jsonStore.js";
import { recordSubscriptionEvent } from "./subscriptionHistoryService.js";

const FILE = "subscriptions.json";

function nowIso() {
  return new Date().toISOString();
}

function plusDays(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function diffDaysFromNow(endDate) {
  const endTime = new Date(endDate || "").getTime();
  if (!Number.isFinite(endTime)) return 0;
  const diffMs = endTime - Date.now();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

export async function getSubscription(userId) {
  const subs = await readJson(FILE);
  return subs.find((s) => s.user_id === userId) || null;
}

export async function upsertSubscription(
  userId,
  plan = "free",
  autoRenew = true,
  meta = {},
) {
  const subs = await readJson(FILE);
  const idx = subs.findIndex((s) => s.user_id === userId);
  const previousPlan = idx >= 0 ? subs[idx]?.plan || "" : "";
  const start = nowIso();
  const end = plan === "premium" ? plusDays(30) : plusDays(3650);
  const next = {
    user_id: userId,
    plan,
    start_date: start,
    end_date: end,
    auto_renew: Boolean(autoRenew),
  };

  if (idx >= 0) subs[idx] = { ...subs[idx], ...next };
  else subs.push(next);

  await writeJson(FILE, subs);
  const action =
    previousPlan && previousPlan !== plan
      ? plan === "premium"
        ? "upgrade"
        : "downgrade"
      : "set";
  await recordSubscriptionEvent({
    userId,
    plan,
    previousPlan,
    action,
    actorId: meta?.actor_id || "",
    source: meta?.source || "system",
    note: meta?.note || "",
  });
  return next;
}

export async function renewPremiumMonthly(userId, autoRenew = true, meta = {}) {
  const subs = await readJson(FILE);
  const idx = subs.findIndex((s) => s.user_id === userId);
  const current = idx >= 0 ? subs[idx] : null;
  const previousPlan = current?.plan || "";

  const currentEndTime = new Date(current?.end_date || "").getTime();
  const baseTime =
    Number.isFinite(currentEndTime) && currentEndTime > Date.now()
      ? currentEndTime
      : Date.now();
  const end = new Date(baseTime + 30 * 24 * 60 * 60 * 1000).toISOString();
  const start = nowIso();

  const next = {
    user_id: userId,
    plan: "premium",
    start_date: start,
    end_date: end,
    auto_renew: Boolean(autoRenew),
  };

  if (idx >= 0) subs[idx] = { ...current, ...next };
  else subs.push(next);

  await writeJson(FILE, subs);
  await recordSubscriptionEvent({
    userId,
    plan: "premium",
    previousPlan,
    action: "renew",
    actorId: meta?.actor_id || "",
    source: meta?.source || "system",
    note: meta?.note || "",
  });
  return next;
}

export async function getRemainingDays(userId) {
  const sub = await getSubscription(userId);
  if (!sub) return 0;
  return diffDaysFromNow(sub.end_date);
}

export async function isSubscriptionValid(userId) {
  const sub = await getSubscription(userId);
  if (!sub) return false;
  return diffDaysFromNow(sub.end_date) > 0;
}
