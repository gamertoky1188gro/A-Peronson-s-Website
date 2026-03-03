import { FILTER_TIERS, PLAN_DAILY_LIMITS, PLAN_FILTER_ACCESS } from '../config/searchAccessConfig.js'
import { getSubscription } from './subscriptionService.js'
import { readJson, writeJson } from '../utils/jsonStore.js'

const USAGE_FILE = 'search_usage_counters.json'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function resolvePlan(plan) {
  return plan === 'premium' ? 'premium' : 'free'
}

export async function getUserPlan(userId) {
  const sub = await getSubscription(userId)
  return resolvePlan(sub?.plan)
}

export function extractUsedAdvancedFilters(filters = {}) {
  return FILTER_TIERS.advanced.filter((key) => {
    const value = filters[key]
    if (typeof value === 'boolean') return value
    return value !== undefined && value !== null && String(value).trim() !== ''
  })
}

export function canUseAdvancedFilters(plan) {
  const resolvedPlan = resolvePlan(plan)
  const allowed = PLAN_FILTER_ACCESS[resolvedPlan]?.allowedTiers || ['basic']
  return allowed.includes('advanced')
}

async function getUsageRows() {
  return readJson(USAGE_FILE)
}

async function upsertUsageRow(userId, action, dateKey, incrementBy = 0) {
  const rows = await getUsageRows()
  const idx = rows.findIndex((row) => row.user_id === userId && row.action === action && row.date === dateKey)

  if (idx >= 0) {
    rows[idx].count = Math.max(0, Number(rows[idx].count || 0) + incrementBy)
    rows[idx].updated_at = new Date().toISOString()
  } else {
    rows.push({
      user_id: userId,
      action,
      date: dateKey,
      count: Math.max(0, incrementBy),
      updated_at: new Date().toISOString(),
    })
  }

  await writeJson(USAGE_FILE, rows)
  return rows.find((row) => row.user_id === userId && row.action === action && row.date === dateKey)
}

export async function getQuotaSnapshot(userId, action, plan) {
  const resolvedPlan = resolvePlan(plan)
  const dailyLimit = Number(PLAN_DAILY_LIMITS[resolvedPlan]?.[action] || 0)
  const rows = await getUsageRows()
  const today = todayKey()
  const usage = rows.find((row) => row.user_id === userId && row.action === action && row.date === today)
  const used = Number(usage?.count || 0)
  const remaining = Math.max(0, dailyLimit - used)
  return {
    action,
    plan: resolvedPlan,
    date: today,
    daily_limit: dailyLimit,
    used,
    remaining,
  }
}

export async function consumeQuota(userId, action, plan) {
  const snapshot = await getQuotaSnapshot(userId, action, plan)
  if (snapshot.remaining <= 0) {
    return { allowed: false, quota: snapshot }
  }

  await upsertUsageRow(userId, action, snapshot.date, 1)
  return {
    allowed: true,
    quota: {
      ...snapshot,
      used: snapshot.used + 1,
      remaining: Math.max(0, snapshot.remaining - 1),
    },
  }
}

export function buildLimitError({ code, message, quota, missingFilters = [] }) {
  return {
    error: message,
    code,
    quota,
    remaining_quota: quota?.remaining ?? 0,
    ...(missingFilters.length ? { advanced_filters: missingFilters } : {}),
  }
}
