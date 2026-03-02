import { listMySearchAlerts, listNotifications, markNotificationRead, saveSearchAlert } from '../services/notificationService.js'

export async function createSearchAlert(req, res) {
  const row = await saveSearchAlert(req.user.id, req.body?.query, req.body?.filters || {})
  if (!row) return res.status(400).json({ error: 'Query is required' })
  return res.status(201).json(row)
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
