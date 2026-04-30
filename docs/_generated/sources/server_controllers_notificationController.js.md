    1 | import { deleteSearchAlertForUser, listMySearchAlerts, listNotifications, markNotificationRead, saveSearchAlert } from '../services/notificationService.js'
    2 | import { buildLimitError, buildSearchAccessPayload, consumeQuota, getUserPlan } from '../services/searchAccessService.js'
    3 | 
    4 | export async function createSearchAlert(req, res) {
    5 |   const plan = await getUserPlan(req.user.id)
    6 |   const quotaUse = await consumeQuota(req.user.id, 'search_alerts_create', plan)
    7 | 
    8 |   if (!quotaUse.allowed) {
    9 |     return res.status(429).json(buildLimitError({
   10 |       code: 'limit_reached',
   11 |       message: 'Daily alert creation limit reached',
   12 |       quota: quotaUse.quota,
   13 |     }))
   14 |   }
   15 | 
   16 |   const row = await saveSearchAlert(req.user.id, req.body?.query, req.body?.filters || {})
   17 |   if (!row) return res.status(400).json({ error: 'Query is required' })
   18 |   return res.status(201).json({
   19 |     ...row,
   20 |     ...buildSearchAccessPayload({
   21 |       action: 'search_alerts_create',
   22 |       plan,
   23 |       quota: quotaUse.quota,
   24 |     }),
   25 |   })
   26 | }
   27 | 
   28 | export async function getSearchAlerts(req, res) {
   29 |   return res.json(await listMySearchAlerts(req.user.id))
   30 | }
   31 | 
   32 | export async function getNotifications(req, res) {
   33 |   return res.json(await listNotifications(req.user.id))
   34 | }
   35 | 
   36 | export async function readNotification(req, res) {
   37 |   const row = await markNotificationRead(req.user.id, req.params.notificationId)
   38 |   if (!row) return res.status(404).json({ error: 'Notification not found' })
   39 |   return res.json(row)
   40 | }
   41 | 
   42 | export async function deleteSearchAlert(req, res) {
   43 |   const ok = await deleteSearchAlertForUser(req.user.id, req.params.alertId)
   44 |   if (!ok) return res.status(404).json({ error: 'Search alert not found' })
   45 |   return res.json({ ok: true })
   46 | }
   47 | 