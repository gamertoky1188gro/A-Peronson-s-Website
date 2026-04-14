# Message

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/messages` -> `server/routes/messageRoutes.js:123` (router var: `messageRoutes`)

## Routes (ultra-detailed)

### GET `/api/messages/inbox`

- **Route definition:** `server/routes/messageRoutes.js:39`

```js
router.get('/inbox', requireAuth, inbox)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `inbox`
- **Controller file:** `—`

### POST `/api/messages/requests/:threadId/accept`

- **Route definition:** `server/routes/messageRoutes.js:40`

```js
router.post('/requests/:threadId/accept', requireAuth, acceptRequest)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `acceptRequest`
- **Controller file:** `—`

### POST `/api/messages/requests/:threadId/reject`

- **Route definition:** `server/routes/messageRoutes.js:41`

```js
router.post('/requests/:threadId/reject', requireAuth, rejectRequest)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `rejectRequest`
- **Controller file:** `—`

### POST `/api/messages/friend/:userId`

- **Route definition:** `server/routes/messageRoutes.js:42`

```js
router.post('/friend/:userId', requireAuth, sendFriendDirectMessage)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `sendFriendDirectMessage`
- **Controller file:** `—`

### GET `/api/messages/policy/config`

- **Route definition:** `server/routes/messageRoutes.js:44`

```js
router.get('/policy/config', requireAuth, getPolicyConfig)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getPolicyConfig`
- **Controller file:** `—`

### GET `/api/messages/policy/review-queue`

- **Route definition:** `server/routes/messageRoutes.js:45`

```js
router.get('/policy/review-queue', requireAuth, listPolicyReviewQueue)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `listPolicyReviewQueue`
- **Controller file:** `—`

### GET `/api/messages/policy/queue-inspector`

- **Route definition:** `server/routes/messageRoutes.js:46`

```js
router.get('/policy/queue-inspector', requireAuth, listMessagePolicyQueueInspector)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `listMessagePolicyQueueInspector`
- **Controller file:** `—`

### POST `/api/messages/policy/review-queue/:decisionId/false-positive`

- **Route definition:** `server/routes/messageRoutes.js:47`

```js
router.post('/policy/review-queue/:decisionId/false-positive', requireAuth, markPolicyFalsePositive)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `markPolicyFalsePositive`
- **Controller file:** `—`

### POST `/api/messages/policy/reputation/:senderId/adjust`

- **Route definition:** `server/routes/messageRoutes.js:48`

```js
router.post('/policy/reputation/:senderId/adjust', requireAuth, updateSenderReputation)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `updateSenderReputation`
- **Controller file:** `—`

### GET `/api/messages/policy/reports/weekly-decision-quality`

- **Route definition:** `server/routes/messageRoutes.js:49`

```js
router.get('/policy/reports/weekly-decision-quality', requireAuth, weeklyPolicyDecisionQualityReport)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `weeklyPolicyDecisionQualityReport`
- **Controller file:** `—`

### POST `/api/messages/:matchId/read`

- **Route definition:** `server/routes/messageRoutes.js:51`

```js
router.post('/:matchId/read', requireAuth, markRead)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `markRead`
- **Controller file:** `—`

### POST `/api/messages/:matchId/upload`

- **Route definition:** `server/routes/messageRoutes.js:52`

```js
router.post('/:matchId/upload', requireAuth, upload.single('file'), uploadMessageAttachment)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `upload.single('file')`
- **Handler:** `uploadMessageAttachment`
- **Controller file:** `—`

### POST `/api/messages/:matchId`

- **Route definition:** `server/routes/messageRoutes.js:53`

```js
router.post('/:matchId', requireAuth, sendMessage)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `sendMessage`
- **Controller file:** `—`

### GET `/api/messages/:matchId`

- **Route definition:** `server/routes/messageRoutes.js:54`

```js
router.get('/:matchId', requireAuth, getMessages)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getMessages`
- **Controller file:** `—`

## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

