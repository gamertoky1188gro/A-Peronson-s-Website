# Notification

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/notifications` -> `server/routes/notificationRoutes.js:74` (router var: `notificationRoutes`)

## Routes (ultra-detailed)

### GET `/api/notifications/`

- **Route definition:** `server/routes/notificationRoutes.js:7`

```js
router.get('/', requireAuth, getNotifications)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getNotifications`
- **Controller file:** `server/controllers/notificationController.js`

#### Controller implementation: `server/controllers/notificationController.js:32`

```js
export async function getNotifications(req, res) {
  return res.json(await listNotifications(req.user.id))
}

```
### PATCH `/api/notifications/:notificationId/read`

- **Route definition:** `server/routes/notificationRoutes.js:8`

```js
router.patch('/:notificationId/read', requireAuth, readNotification)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `readNotification`
- **Controller file:** `server/controllers/notificationController.js`

#### Controller implementation: `server/controllers/notificationController.js:36`

```js
export async function readNotification(req, res) {
  const row = await markNotificationRead(req.user.id, req.params.notificationId)
  if (!row) return res.status(404).json({ error: 'Notification not found' })
  return res.json(row)
}

```
### GET `/api/notifications/search-alerts`

- **Route definition:** `server/routes/notificationRoutes.js:9`

```js
router.get('/search-alerts', requireAuth, getSearchAlerts)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getSearchAlerts`
- **Controller file:** `server/controllers/notificationController.js`

#### Controller implementation: `server/controllers/notificationController.js:28`

```js
export async function getSearchAlerts(req, res) {
  return res.json(await listMySearchAlerts(req.user.id))
}

```
### POST `/api/notifications/search-alerts`

- **Route definition:** `server/routes/notificationRoutes.js:10`

```js
router.post('/search-alerts', requireAuth, createSearchAlert)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `createSearchAlert`
- **Controller file:** `server/controllers/notificationController.js`

#### Controller implementation: `server/controllers/notificationController.js:4`

```js
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
  return res.status(201).json({
    ...row,
    ...buildSearchAccessPayload({
      action: 'search_alerts_create',
      plan,
      quota: quotaUse.quota,
    }),
  })
}

```
### DELETE `/api/notifications/search-alerts/:alertId`

- **Route definition:** `server/routes/notificationRoutes.js:11`

```js
router.delete('/search-alerts/:alertId', requireAuth, deleteSearchAlert)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `deleteSearchAlert`
- **Controller file:** `server/controllers/notificationController.js`

#### Controller implementation: `server/controllers/notificationController.js:42`

```js
export async function deleteSearchAlert(req, res) {
  const ok = await deleteSearchAlertForUser(req.user.id, req.params.alertId)
  if (!ok) return res.status(404).json({ error: 'Search alert not found' })
  return res.json({ ok: true })
}

```
## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

