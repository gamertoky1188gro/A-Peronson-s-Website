# Message

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/messages` -> `server/routes/messageRoutes.js:71` (router var: `messageRoutes`)

## Routes (ultra-detailed)

### GET `/api/messages/inbox`

- **Route definition:** `server/routes/messageRoutes.js:31`

```js
router.get('/inbox', requireAuth, inbox)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `inbox`
- **Controller file:** `—`

### POST `/api/messages/requests/:threadId/accept`

- **Route definition:** `server/routes/messageRoutes.js:32`

```js
router.post('/requests/:threadId/accept', requireAuth, acceptRequest)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `acceptRequest`
- **Controller file:** `—`

### POST `/api/messages/requests/:threadId/reject`

- **Route definition:** `server/routes/messageRoutes.js:33`

```js
router.post('/requests/:threadId/reject', requireAuth, rejectRequest)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `rejectRequest`
- **Controller file:** `—`

### POST `/api/messages/friend/:userId`

- **Route definition:** `server/routes/messageRoutes.js:34`

```js
router.post('/friend/:userId', requireAuth, sendFriendDirectMessage)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `sendFriendDirectMessage`
- **Controller file:** `—`

### POST `/api/messages/:matchId/upload`

- **Route definition:** `server/routes/messageRoutes.js:35`

```js
router.post('/:matchId/upload', requireAuth, upload.single('file'), uploadMessageAttachment)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `upload.single('file')`
- **Handler:** `uploadMessageAttachment`
- **Controller file:** `—`

### POST `/api/messages/:matchId`

- **Route definition:** `server/routes/messageRoutes.js:36`

```js
router.post('/:matchId', requireAuth, sendMessage)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `sendMessage`
- **Controller file:** `—`

### GET `/api/messages/:matchId`

- **Route definition:** `server/routes/messageRoutes.js:37`

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

