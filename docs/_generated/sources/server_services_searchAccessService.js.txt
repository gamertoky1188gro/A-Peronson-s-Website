    1 | import { FILTER_TIERS, PLAN_DAILY_LIMITS, PLAN_FILTER_ACCESS, SEARCH_CAPABILITIES } from '../config/searchAccessConfig.js'
    2 | import { getAdminConfig } from './adminConfigService.js'
    3 | import { getSubscription } from './subscriptionService.js'
    4 | import { readJson, writeJson } from '../utils/jsonStore.js'
    5 | 
    6 | const USAGE_FILE = 'search_usage_counters.json'
    7 | 
    8 | function todayKey() {
    9 |   return new Date().toISOString().slice(0, 10)
   10 | }
   11 | 
   12 | function resolvePlan(plan) {
   13 |   return plan === 'premium' ? 'premium' : 'free'
   14 | }
   15 | 
   16 | export async function getUserPlan(userId) {
   17 |   const sub = await getSubscription(userId)
   18 |   return resolvePlan(sub?.plan)
   19 | }
   20 | 
   21 | export function extractUsedAdvancedFilters(filters = {}) {
   22 |   return FILTER_TIERS.advanced.filter((key) => {
   23 |     const value = filters[key]
   24 |     if (typeof value === 'boolean') return value
   25 |     return value !== undefined && value !== null && String(value).trim() !== ''
   26 |   })
   27 | }
   28 | 
   29 | export function canUseAdvancedFilters(plan) {
   30 |   const resolvedPlan = resolvePlan(plan)
   31 |   const allowed = PLAN_FILTER_ACCESS[resolvedPlan]?.allowedTiers || ['basic']
   32 |   return allowed.includes('advanced')
   33 | }
   34 | 
   35 | async function getUsageRows() {
   36 |   return readJson(USAGE_FILE)
   37 | }
   38 | 
   39 | async function upsertUsageRow(userId, action, dateKey, incrementBy = 0) {
   40 |   const rows = await getUsageRows()
   41 |   const idx = rows.findIndex((row) => row.user_id === userId && row.action === action)
   42 | 
   43 |   if (idx >= 0) {
   44 |     const nextCount = rows[idx].date === dateKey ? Number(rows[idx].count || 0) + incrementBy : incrementBy
   45 |     rows[idx] = {
   46 |       ...rows[idx],
   47 |       date: dateKey,
   48 |       count: Math.max(0, nextCount),
   49 |       updated_at: new Date().toISOString(),
   50 |       ...(rows[idx].date !== dateKey ? { reset_at: new Date().toISOString() } : {}),
   51 |     }
   52 |   } else {
   53 |     rows.push({
   54 |       user_id: userId,
   55 |       action,
   56 |       date: dateKey,
   57 |       count: Math.max(0, incrementBy),
   58 |       updated_at: new Date().toISOString(),
   59 |     })
   60 |   }
   61 | 
   62 |   await writeJson(USAGE_FILE, rows)
   63 |   return rows.find((row) => row.user_id === userId && row.action === action)
   64 | }
   65 | 
   66 | export async function getQuotaSnapshot(userId, action, plan) {
   67 |   const resolvedPlan = resolvePlan(plan)
   68 |   const config = await getAdminConfig()
   69 |   const configuredSearchDaily = Number(config?.plan_limits?.[resolvedPlan]?.search_daily || 0)
   70 |   const fallbackLimit = Number(PLAN_DAILY_LIMITS[resolvedPlan]?.[action] || 0)
   71 |   const dailyLimit = configuredSearchDaily > 0 ? configuredSearchDaily : fallbackLimit
   72 |   const today = todayKey()
   73 |   const rows = await getUsageRows()
   74 |   const usage = rows.find((row) => row.user_id === userId && row.action === action)
   75 | 
   76 |   let used = 0
   77 |   if (usage?.date === today) {
   78 |     used = Number(usage.count || 0)
   79 |   } else if (usage) {
   80 |     await upsertUsageRow(userId, action, today, 0)
   81 |   }
   82 | 
   83 |   const remaining = Math.max(0, dailyLimit - used)
   84 |   return {
   85 |     action,
   86 |     plan: resolvedPlan,
   87 |     date: today,
   88 |     daily_limit: dailyLimit,
   89 |     used,
   90 |     remaining,
   91 |   }
   92 | }
   93 | 
   94 | export async function consumeQuota(userId, action, plan) {
   95 |   const snapshot = await getQuotaSnapshot(userId, action, plan)
   96 |   if (snapshot.remaining <= 0) {
   97 |     return { allowed: false, quota: snapshot }
   98 |   }
   99 | 
  100 |   await upsertUsageRow(userId, action, snapshot.date, 1)
  101 |   return {
  102 |     allowed: true,
  103 |     quota: {
  104 |       ...snapshot,
  105 |       used: snapshot.used + 1,
  106 |       remaining: Math.max(0, snapshot.remaining - 1),
  107 |     },
  108 |   }
  109 | }
  110 | 
  111 | export function getSearchCapabilities(plan) {
  112 |   const resolvedPlan = resolvePlan(plan)
  113 |   const capabilities = SEARCH_CAPABILITIES[resolvedPlan]
  114 |   return {
  115 |     plan: resolvedPlan,
  116 |     ...capabilities,
  117 |   }
  118 | }
  119 | 
  120 | export function buildSearchAccessPayload({ action, plan, quota, missingFilters = [], upgradeRequired = false }) {
  121 |   const capabilities = getSearchCapabilities(plan)
  122 |   return {
  123 |     action,
  124 |     plan: capabilities.plan,
  125 |     capabilities,
  126 |     quota,
  127 |     requirements: {
  128 |       upgrade_required: Boolean(upgradeRequired || missingFilters.length > 0),
  129 |       ...(missingFilters.length ? { advanced_filters: missingFilters } : {}),
  130 |     },
  131 |   }
  132 | }
  133 | 
  134 | export function buildLimitError({ code, message, quota, missingFilters = [], upgradeRequired = false }) {
  135 |   const action = quota?.action || null
  136 |   const plan = quota?.plan || 'free'
  137 |   const access = buildSearchAccessPayload({
  138 |     action,
  139 |     plan,
  140 |     quota,
  141 |     missingFilters,
  142 |     upgradeRequired,
  143 |   })
  144 | 
  145 |   return {
  146 |     error: message,
  147 |     code,
  148 |     action,
  149 |     plan,
  150 |     quota,
  151 |     remaining_quota: quota?.remaining ?? 0,
  152 |     requirements: access.requirements,
  153 |     capabilities: access.capabilities,
  154 |     ...(missingFilters.length ? { advanced_filters: missingFilters } : {}),
  155 |   }
  156 | }
  157 | 