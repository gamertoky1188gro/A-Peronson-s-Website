# CallSession

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/calls` -> `server/routes/callSessionRoutes.js:78` (router var: `callSessionRoutes`)

## Routes (ultra-detailed)

### POST `/api/calls/scheduled`

- **Route definition:** `server/routes/callSessionRoutes.js:18`

```js
router.post('/scheduled', requireAuth, createScheduledCall)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `createScheduledCall`
- **Controller file:** `—`

### POST `/api/calls/join`

- **Route definition:** `server/routes/callSessionRoutes.js:19`

```js
router.post('/join', requireAuth, joinOrCreateCall)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `joinOrCreateCall`
- **Controller file:** `—`

### POST `/api/calls/friend/:userId/join`

- **Route definition:** `server/routes/callSessionRoutes.js:20`

```js
router.post('/friend/:userId/join', requireAuth, joinFriendCall)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `joinFriendCall`
- **Controller file:** `—`

### GET `/api/calls/history`

- **Route definition:** `server/routes/callSessionRoutes.js:21`

```js
router.get('/history', requireAuth, getCallHistory)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getCallHistory`
- **Controller file:** `—`

### GET `/api/calls/pending`

- **Route definition:** `server/routes/callSessionRoutes.js:22`

```js
router.get('/pending', requireAuth, getPendingInvites)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getPendingInvites`
- **Controller file:** `—`

### GET `/api/calls/:callId/ice`

- **Route definition:** `server/routes/callSessionRoutes.js:23`

```js
router.get('/:callId/ice', requireAuth, getCallIceServers)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getCallIceServers`
- **Controller file:** `—`

### GET `/api/calls/:callId`

- **Route definition:** `server/routes/callSessionRoutes.js:24`

```js
router.get('/:callId', requireAuth, getCall)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getCall`
- **Controller file:** `—`

### POST `/api/calls/:callId/start`

- **Route definition:** `server/routes/callSessionRoutes.js:25`

```js
router.post('/:callId/start', requireAuth, startCall)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `startCall`
- **Controller file:** `—`

### POST `/api/calls/:callId/end`

- **Route definition:** `server/routes/callSessionRoutes.js:26`

```js
router.post('/:callId/end', requireAuth, endCall)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `endCall`
- **Controller file:** `—`

### PATCH `/api/calls/:callId/recording`

- **Route definition:** `server/routes/callSessionRoutes.js:27`

```js
router.patch('/:callId/recording', requireAuth, updateRecording)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `updateRecording`
- **Controller file:** `—`

## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

