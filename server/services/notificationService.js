import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const ALERTS_FILE = 'search_alerts.json'
const NOTIFICATIONS_FILE = 'notifications.json'

export async function saveSearchAlert(userId, query, filters = {}) {
  const alerts = await readJson(ALERTS_FILE)
  const normalizedQuery = sanitizeString(query || '', 160).toLowerCase()
  if (!normalizedQuery) return null

  const existing = alerts.find((a) => a.user_id === userId && a.query === normalizedQuery)
  if (existing) {
    existing.filters = filters
    existing.updated_at = new Date().toISOString()
    await writeJson(ALERTS_FILE, alerts)
    return existing
  }

  const row = {
    id: crypto.randomUUID(),
    user_id: userId,
    query: normalizedQuery,
    filters,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  alerts.push(row)
  await writeJson(ALERTS_FILE, alerts)
  return row
}

export async function listMySearchAlerts(userId) {
  const alerts = await readJson(ALERTS_FILE)
  return alerts.filter((a) => a.user_id === userId)
}

export async function deleteSearchAlertForUser(userId, alertId) {
  const alerts = await readJson(ALERTS_FILE)
  const next = alerts.filter((a) => !(a.user_id === userId && a.id === alertId))
  if (next.length === alerts.length) return false
  await writeJson(ALERTS_FILE, next)
  return true
}

function matches(alert, text) {
  const hay = String(text || '').toLowerCase()
  return alert.query.split(/\s+/).filter(Boolean).some((part) => hay.includes(part))
}

export async function emitNotificationsForEntity(entityType, entity) {
  const alerts = await readJson(ALERTS_FILE)
  const notifications = await readJson(NOTIFICATIONS_FILE)
  const payloadText = `${entity.title || ''} ${entity.category || ''} ${entity.material || ''} ${entity.description || ''} ${entity.custom_description || ''}`

  for (const alert of alerts) {
    if (!matches(alert, payloadText)) continue
    notifications.push({
      id: crypto.randomUUID(),
      user_id: alert.user_id,
      type: 'smart_search_match',
      entity_type: entityType,
      entity_id: entity.id,
      message: `New ${entityType.replace('_', ' ')} matches your search: "${alert.query}"`,
      read: false,
      created_at: new Date().toISOString(),
    })
  }

  await writeJson(NOTIFICATIONS_FILE, notifications)
}

export async function listNotifications(userId) {
  const notifications = await readJson(NOTIFICATIONS_FILE)
  return notifications.filter((n) => n.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function markNotificationRead(userId, id) {
  const notifications = await readJson(NOTIFICATIONS_FILE)
  const idx = notifications.findIndex((n) => n.id === id && n.user_id === userId)
  if (idx < 0) return null
  notifications[idx].read = true
  await writeJson(NOTIFICATIONS_FILE, notifications)
  return notifications[idx]
}
