import { listMySearchAlerts, listNotifications, markNotificationRead, saveSearchAlert } from '../services/notificationService.js'
import { buildLimitError, consumeQuota, getUserPlan } from '../services/searchAccessService.js'

export async function createSearchAlert(req, res) {
  const plan = await getUserPlan(req.user.id)
  const quotaUse = await consumeQuota(req.user.id, 'search_alerts_create', plan)

  if (!quotaUse.allowed) {
    return res.status(429).json(buildLimitError({
      code: 'limit_reached',
      message: 'Daily alert creation limit reached',
      quota: quotaUse.quota,
    }))
  }

  const row = await saveSearchAlert(req.user.id, req.body?.query, req.body?.filters || {})
  if (!row) return res.status(400).json({ error: 'Query is required' })
  return res.status(201).json({ ...row, quota: quotaUse.quota, plan })
}

export async function getSearchAlerts(req, res) {
  return res.json(await listMySearchAlerts(req.user.id))
}

export async function getNotifications(req, res) {
  return res.json(await listNotifications(req.user.id))
}

export async function readNotification(req, res) {
  const row = await markNotificationRead(req.user.id, req.params.notificationId)
  if (!row) return res.status(404).json({ error: 'Notification not found' })
  return res.json(row)
}
