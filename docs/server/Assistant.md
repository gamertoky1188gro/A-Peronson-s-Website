# Assistant

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/assistant` -> `server/routes/assistantRoutes.js:121` (router var: `assistantRoutes`)

## Routes (ultra-detailed)

### POST `/api/assistant/ask`

- **Route definition:** `server/routes/assistantRoutes.js:19`

```js
router.post('/ask', requireAuth, askAssistant)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `askAssistant`
- **Controller file:** `—`

### POST `/api/assistant/ask-public`

- **Route definition:** `server/routes/assistantRoutes.js:20`

```js
router.post('/ask-public', askAssistantPublic)
```
- **Middleware stack (in order):**
  - _none detected_
- **Handler:** `askAssistantPublic`
- **Controller file:** `—`

### POST `/api/assistant/extract-requirement`

- **Route definition:** `server/routes/assistantRoutes.js:21`

```js
router.post('/extract-requirement', requireAuth, postExtractRequirement)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `postExtractRequirement`
- **Controller file:** `—`

### POST `/api/assistant/generate-first-response`

- **Route definition:** `server/routes/assistantRoutes.js:22`

```js
router.post('/generate-first-response', requireAuth, postGenerateFirstResponse)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `postGenerateFirstResponse`
- **Controller file:** `—`

### POST `/api/assistant/validate-response`

- **Route definition:** `server/routes/assistantRoutes.js:23`

```js
router.post('/validate-response', requireAuth, postValidateResponse)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `postValidateResponse`
- **Controller file:** `—`

### POST `/api/assistant/conversation-summary`

- **Route definition:** `server/routes/assistantRoutes.js:24`

```js
router.post('/conversation-summary', requireAuth, getConversationSummary)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getConversationSummary`
- **Controller file:** `—`

### POST `/api/assistant/negotiation`

- **Route definition:** `server/routes/assistantRoutes.js:25`

```js
router.post('/negotiation', requireAuth, getNegotiationHelper)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getNegotiationHelper`
- **Controller file:** `—`

### GET `/api/assistant/knowledge`

- **Route definition:** `server/routes/assistantRoutes.js:26`

```js
router.get('/knowledge', requireAuth, getAssistantKnowledge)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getAssistantKnowledge`
- **Controller file:** `—`

### POST `/api/assistant/knowledge`

- **Route definition:** `server/routes/assistantRoutes.js:27`

```js
router.post('/knowledge', requireAuth, allowRoles('owner', 'admin'), createAssistantKnowledge)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('owner', 'admin')`
- **Handler:** `createAssistantKnowledge`
- **Controller file:** `—`

### DELETE `/api/assistant/knowledge/:entryId`

- **Route definition:** `server/routes/assistantRoutes.js:29`

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

