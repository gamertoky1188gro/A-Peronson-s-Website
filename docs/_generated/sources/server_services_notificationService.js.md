    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | const ALERTS_FILE = 'search_alerts.json'
    6 | const NOTIFICATIONS_FILE = 'notifications.json'
    7 | const REQUIREMENTS_FILE = 'requirements.json'
    8 | const MESSAGES_FILE = 'messages.json'
    9 | const DOCUMENTS_FILE = 'documents.json'
   10 | 
   11 | export async function createNotification(userId, payload = {}) {
   12 |   const notifications = await readJson(NOTIFICATIONS_FILE)
   13 |   const row = {
   14 |     id: crypto.randomUUID(),
   15 |     user_id: sanitizeString(String(userId || ''), 120),
   16 |     type: sanitizeString(payload.type || 'system', 64),
   17 |     entity_type: sanitizeString(payload.entity_type || '', 64),
   18 |     entity_id: sanitizeString(payload.entity_id || '', 120),
   19 |     message: sanitizeString(payload.message || 'Notification', 240),
   20 |     meta: payload.meta && typeof payload.meta === 'object' ? payload.meta : {},
   21 |     read: false,
   22 |     created_at: new Date().toISOString(),
   23 |   }
   24 |   notifications.push(row)
   25 |   await writeJson(NOTIFICATIONS_FILE, notifications)
   26 |   return row
   27 | }
   28 | 
   29 | export async function saveSearchAlert(userId, query, filters = {}) {
   30 |   const alerts = await readJson(ALERTS_FILE)
   31 |   const normalizedQuery = sanitizeString(query || '', 160).toLowerCase()
   32 |   if (!normalizedQuery) return null
   33 | 
   34 |   const existing = alerts.find((a) => a.user_id === userId && a.query === normalizedQuery)
   35 |   if (existing) {
   36 |     existing.filters = filters
   37 |     existing.updated_at = new Date().toISOString()
   38 |     await writeJson(ALERTS_FILE, alerts)
   39 |     return existing
   40 |   }
   41 | 
   42 |   const row = {
   43 |     id: crypto.randomUUID(),
   44 |     user_id: userId,
   45 |     query: normalizedQuery,
   46 |     filters,
   47 |     created_at: new Date().toISOString(),
   48 |     updated_at: new Date().toISOString(),
   49 |   }
   50 |   alerts.push(row)
   51 |   await writeJson(ALERTS_FILE, alerts)
   52 |   return row
   53 | }
   54 | 
   55 | export async function listMySearchAlerts(userId) {
   56 |   const alerts = await readJson(ALERTS_FILE)
   57 |   return alerts.filter((a) => a.user_id === userId)
   58 | }
   59 | 
   60 | export async function deleteSearchAlertForUser(userId, alertId) {
   61 |   const alerts = await readJson(ALERTS_FILE)
   62 |   const next = alerts.filter((a) => !(a.user_id === userId && a.id === alertId))
   63 |   if (next.length === alerts.length) return false
   64 |   await writeJson(ALERTS_FILE, next)
   65 |   return true
   66 | }
   67 | 
   68 | function normalizeFilters(filters = {}) {
   69 |   return filters && typeof filters === 'object' ? filters : {}
   70 | }
   71 | 
   72 | function scoreMatch(alert, entityType, entity, payloadText) {
   73 |   const hay = String(payloadText || '').toLowerCase()
   74 |   const queryParts = String(alert.query || '')
   75 |     .split(/\s+/)
   76 |     .map((p) => p.trim())
   77 |     .filter(Boolean)
   78 | 
   79 |   if (!queryParts.length) return 0
   80 | 
   81 |   let score = 0
   82 |   const title = String(entity?.title || '').toLowerCase()
   83 | 
   84 |   for (const part of queryParts) {
   85 |     if (!part) continue
   86 |     if (title.includes(part)) score += 25
   87 |     else if (hay.includes(part)) score += 15
   88 |   }
   89 | 
   90 |   const filters = normalizeFilters(alert.filters)
   91 |   if (filters.verifiedOnly && !entity?.verified) return 0
   92 |   if (filters.category && String(entity?.category || '').toLowerCase() !== String(filters.category || '').toLowerCase()) return 0
   93 | 
   94 |   // orgType is only meaningful for company products (factory/buying_house).
   95 |   if (filters.orgType && entityType === 'company_product') {
   96 |     if (String(entity?.company_role || '').toLowerCase() !== String(filters.orgType || '').toLowerCase()) return 0
   97 |   }
   98 | 
   99 |   // Give a small bonus when core filters match.
  100 |   if (filters.category && score > 0) score += 10
  101 |   if (filters.verifiedOnly && score > 0) score += 10
  102 | 
  103 |   return score
  104 | }
  105 | 
  106 | export async function emitNotificationsForEntity(entityType, entity) {
  107 |   const alerts = await readJson(ALERTS_FILE)
  108 |   const notifications = await readJson(NOTIFICATIONS_FILE)
  109 |   const payloadText = `${entity.title || ''} ${entity.category || ''} ${entity.material || ''} ${entity.description || ''} ${entity.custom_description || ''}`
  110 | 
  111 |   for (const alert of alerts) {
  112 |     const score = scoreMatch(alert, entityType, entity, payloadText)
  113 |     if (score < 50) continue
  114 |     notifications.push({
  115 |       id: crypto.randomUUID(),
  116 |       user_id: alert.user_id,
  117 |       type: 'smart_search_match',
  118 |       entity_type: entityType,
  119 |       entity_id: entity.id,
  120 |       message: `New ${entityType.replace('_', ' ')} matches your search: "${alert.query}"`,
  121 |       meta: { score },
  122 |       read: false,
  123 |       created_at: new Date().toISOString(),
  124 |     })
  125 |   }
  126 | 
  127 |   await writeJson(NOTIFICATIONS_FILE, notifications)
  128 | }
  129 | 
  130 | export async function listNotifications(userId) {
  131 |   const notifications = await readJson(NOTIFICATIONS_FILE)
  132 |   const list = notifications.filter((n) => n.user_id === userId)
  133 |   const ensured = await ensureMonthlySummary(userId, list, notifications)
  134 |   return ensured.filter((n) => n.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at))
  135 | }
  136 | 
  137 | export async function markNotificationRead(userId, id) {
  138 |   const notifications = await readJson(NOTIFICATIONS_FILE)
  139 |   const idx = notifications.findIndex((n) => n.id === id && n.user_id === userId)
  140 |   if (idx < 0) return null
  141 |   notifications[idx].read = true
  142 |   await writeJson(NOTIFICATIONS_FILE, notifications)
  143 |   return notifications[idx]
  144 | }
  145 | 
  146 | function monthKey(date = new Date()) {
  147 |   const month = String(date.getMonth() + 1).padStart(2, '0')
  148 |   return `${date.getFullYear()}-${month}`
  149 | }
  150 | 
  151 | async function ensureMonthlySummary(userId, userNotifications = [], allNotifications = []) {
  152 |   const key = monthKey()
  153 |   const already = userNotifications.some((n) => n.type === 'monthly_summary' && String(n?.meta?.month || '') === key)
  154 |   if (already) return allNotifications
  155 | 
  156 |   const [requirements, messages, documents] = await Promise.all([
  157 |     readJson(REQUIREMENTS_FILE),
  158 |     readJson(MESSAGES_FILE),
  159 |     readJson(DOCUMENTS_FILE),
  160 |   ])
  161 | 
  162 |   const monthStart = new Date(`${key}-01T00:00:00.000Z`)
  163 |   const isThisMonth = (iso) => {
  164 |     if (!iso) return false
  165 |     const ts = new Date(iso).getTime()
  166 |     return Number.isFinite(ts) && ts >= monthStart.getTime()
  167 |   }
  168 | 
  169 |   const reqCount = (Array.isArray(requirements) ? requirements : [])
  170 |     .filter((r) => r?.buyer_id === userId && isThisMonth(r.created_at))
  171 |     .length
  172 |   const msgCount = (Array.isArray(messages) ? messages : [])
  173 |     .filter((m) => m?.sender_id === userId && isThisMonth(m.timestamp || m.created_at))
  174 |     .length
  175 |   const contractCount = (Array.isArray(documents) ? documents : [])
  176 |     .filter((d) => String(d?.entity_type || '') === 'contract' && isThisMonth(d.created_at))
  177 |     .length
  178 | 
  179 |   const summary = {
  180 |     id: crypto.randomUUID(),
  181 |     user_id: sanitizeString(String(userId || ''), 120),
  182 |     type: 'monthly_summary',
  183 |     entity_type: 'summary',
  184 |     entity_id: key,
  185 |     message: `Monthly summary (${key}): ${reqCount} requests, ${msgCount} messages, ${contractCount} contracts.`,
  186 |     meta: { month: key, requests: reqCount, messages: msgCount, contracts: contractCount },
  187 |     read: false,
  188 |     created_at: new Date().toISOString(),
  189 |   }
  190 | 
  191 |   allNotifications.push(summary)
  192 |   await writeJson(NOTIFICATIONS_FILE, allNotifications)
  193 |   return allNotifications
  194 | }
  195 | 