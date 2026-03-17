# Assistant

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/assistant` -> `server/routes/assistantRoutes.js:69` (router var: `assistantRoutes`)

## Routes (ultra-detailed)

### POST `/api/assistant/ask`

- **Route definition:** `server/routes/assistantRoutes.js:14`

```js
router.post('/ask', requireAuth, askAssistant)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `askAssistant`
- **Controller file:** `—`

### POST `/api/assistant/ask-public`

- **Route definition:** `server/routes/assistantRoutes.js:15`

```js
router.post('/ask-public', askAssistantPublic)
```
- **Middleware stack (in order):**
  - _none detected_
- **Handler:** `askAssistantPublic`
- **Controller file:** `—`

### GET `/api/assistant/knowledge`

- **Route definition:** `server/routes/assistantRoutes.js:16`

```js
router.get('/knowledge', requireAuth, getAssistantKnowledge)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getAssistantKnowledge`
- **Controller file:** `—`

### POST `/api/assistant/knowledge`

- **Route definition:** `server/routes/assistantRoutes.js:17`

```js
router.post('/knowledge', requireAuth, allowRoles('owner', 'admin'), createAssistantKnowledge)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('owner', 'admin')`
- **Handler:** `createAssistantKnowledge`
- **Controller file:** `—`

### DELETE `/api/assistant/knowledge/:entryId`

- **Route definition:** `server/routes/assistantRoutes.js:19`

```js
router.delete('/knowledge/:entryId', requireAuth, allowRoles('owner', 'admin'), removeAssistantKnowledge)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('owner', 'admin')`
- **Handler:** `removeAssistantKnowledge`
- **Controller file:** `—`

## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

