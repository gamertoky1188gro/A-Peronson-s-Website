# CallSession

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/calls` -> `server/routes/callSessionRoutes.js:134` (router var: `callSessionRoutes`)

## Routes (ultra-detailed)

### POST `/api/calls/scheduled`

- **Route definition:** `server/routes/callSessionRoutes.js:41`

```js
router.post("/scheduled", requireAuth, createScheduledCall);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `createScheduledCall`
- **Controller file:** `—`

### POST `/api/calls/join`

- **Route definition:** `server/routes/callSessionRoutes.js:42`

```js
router.post("/join", requireAuth, joinOrCreateCall);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `joinOrCreateCall`
- **Controller file:** `—`

### POST `/api/calls/friend/:userId/join`

- **Route definition:** `server/routes/callSessionRoutes.js:43`

```js
router.post("/friend/:userId/join", requireAuth, joinFriendCall);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `joinFriendCall`
- **Controller file:** `—`

### GET `/api/calls/history`

- **Route definition:** `server/routes/callSessionRoutes.js:44`

```js
router.get("/history", requireAuth, getCallHistory);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getCallHistory`
- **Controller file:** `—`

### GET `/api/calls/by-contract/:contractId`

- **Route definition:** `server/routes/callSessionRoutes.js:45`

```js
router.get("/by-contract/:contractId", requireAuth, getCallsByContract);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getCallsByContract`
- **Controller file:** `—`

### GET `/api/calls/pending`

- **Route definition:** `server/routes/callSessionRoutes.js:46`

```js
router.get("/pending", requireAuth, getPendingInvites);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getPendingInvites`
- **Controller file:** `—`

### GET `/api/calls/:callId/ice`

- **Route definition:** `server/routes/callSessionRoutes.js:47`

```js
router.get("/:callId/ice", requireAuth, getCallIceServers);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getCallIceServers`
- **Controller file:** `—`

### GET `/api/calls/:callId`

- **Route definition:** `server/routes/callSessionRoutes.js:48`

```js
router.get("/:callId", requireAuth, getCall);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getCall`
- **Controller file:** `—`

### POST `/api/calls/:callId/start`

- **Route definition:** `server/routes/callSessionRoutes.js:49`

```js
router.post("/:callId/start", requireAuth, startCall);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `startCall`
- **Controller file:** `—`

### POST `/api/calls/:callId/end`

- **Route definition:** `server/routes/callSessionRoutes.js:50`

```js
router.post("/:callId/end", requireAuth, endCall);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `endCall`
- **Controller file:** `—`

### PATCH `/api/calls/:callId/recording`

- **Route definition:** `server/routes/callSessionRoutes.js:51`

```js
router.patch("/:callId/recording", requireAuth, updateRecording);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `updateRecording`
- **Controller file:** `—`

### GET `/api/calls/:callId/recording`

- **Route definition:** `server/routes/callSessionRoutes.js:52`

```js
router.get("/:callId/recording", requireAuth, getRecording);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getRecording`
- **Controller file:** `—`

### POST `/api/calls/:callId/recording/viewed`

- **Route definition:** `server/routes/callSessionRoutes.js:53`

```js
router.post(
  "/:callId/recording/viewed",
  requireAuth,
  markRecordingViewedController,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `markRecordingViewedController`
- **Controller file:** `—`

### POST `/api/calls/:callId/recording/upload`

- **Route definition:** `server/routes/callSessionRoutes.js:54`

```js
router.post(
  "/:callId/recording/upload",
  requireAuth,
  recordingUpload.single("file"),
  uploadRecordingFile,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `recordingUpload.single('file')`
- **Handler:** `uploadRecordingFile`
- **Controller file:** `—`

## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.
