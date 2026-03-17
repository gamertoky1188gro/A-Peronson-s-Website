# Search

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/search` -> `server/routes/searchRoutes.js:76` (router var: `searchRoutes`)

## Routes (ultra-detailed)

### POST `/api/search/alerts`

- **Route definition:** `server/routes/searchRoutes.js:7`

```js
router.post('/alerts', requireAuth, createSearchAlert)
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
## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

