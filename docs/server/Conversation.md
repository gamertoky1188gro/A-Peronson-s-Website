# Conversation

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/conversations` -> `server/routes/conversationRoutes.js:70` (router var: `conversationRoutes`)

## Routes (ultra-detailed)

### POST `/api/conversations/:requestId/claim`

- **Route definition:** `server/routes/conversationRoutes.js:6`

```js
router.post('/:requestId/claim', requireAuth, allowRoles('buying_house', 'admin'), claim)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buying_house', 'admin')`
- **Handler:** `claim`
- **Controller file:** `server/controllers/conversationController.js`

#### Controller implementation: `server/controllers/conversationController.js:3`

```js
export async function claim(req, res) {
  const result = await claimConversation(req.params.requestId, req.user)
  if (result.status === 'locked') return res.status(409).json(result)
  return res.json(result)
}

```
### POST `/api/conversations/:requestId/grant`

- **Route definition:** `server/routes/conversationRoutes.js:7`

```js
router.post('/:requestId/grant', requireAuth, allowRoles('buying_house', 'admin'), grant)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buying_house', 'admin')`
- **Handler:** `grant`
- **Controller file:** `server/controllers/conversationController.js`

#### Controller implementation: `server/controllers/conversationController.js:9`

```js
export async function grant(req, res) {
  const result = await grantConversationAccess(req.params.requestId, req.user.id, req.body?.target_agent_id)
  if (result === 'invalid_target') return res.status(400).json({ error: 'target_agent_id is required' })
  if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!result) return res.status(404).json({ error: 'Lock not found' })
  return res.json(result)
}

```
## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

