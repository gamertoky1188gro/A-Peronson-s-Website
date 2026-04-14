# Verification

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/verification` -> `server/routes/verificationRoutes.js:115` (router var: `verificationRoutes`)

## Routes (ultra-detailed)

### GET `/api/verification/me`

- **Route definition:** `server/routes/verificationRoutes.js:16`

```js
router.get('/me', requireAuth, getMyVerification)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getMyVerification`
- **Controller file:** `—`

### POST `/api/verification/me`

- **Route definition:** `server/routes/verificationRoutes.js:17`

```js
router.post('/me', requireAuth, allowRoles('buyer', 'factory', 'buying_house'), submitMyVerification)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer', 'factory', 'buying_house')`
- **Handler:** `submitMyVerification`
- **Controller file:** `—`

### POST `/api/verification/renew`

- **Route definition:** `server/routes/verificationRoutes.js:18`

```js
router.post('/renew', requireAuth, allowRoles('buyer', 'factory', 'buying_house'), renewMyVerification)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer', 'factory', 'buying_house')`
- **Handler:** `renewMyVerification`
- **Controller file:** `—`

### GET `/api/verification/admin/queue`

- **Route definition:** `server/routes/verificationRoutes.js:19`

```js
router.get('/admin/queue', requireAuth, requireAdminSecurity, adminQueue)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
- **Handler:** `adminQueue`
- **Controller file:** `—`

### POST `/api/verification/admin/:userId/approve`

- **Route definition:** `server/routes/verificationRoutes.js:20`

```js
router.post('/admin/:userId/approve', requireAuth, requireAdminSecurity, adminApprove)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
- **Handler:** `adminApprove`
- **Controller file:** `—`

### POST `/api/verification/admin/:userId/reject`

- **Route definition:** `server/routes/verificationRoutes.js:21`

```js
router.post('/admin/:userId/reject', requireAuth, requireAdminSecurity, adminReject)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
- **Handler:** `adminReject`
- **Controller file:** `—`

### POST `/api/verification/admin/revoke-expired`

- **Route definition:** `server/routes/verificationRoutes.js:22`

```js
router.post('/admin/revoke-expired', requireAuth, requireAdminSecurity, adminRevokeExpired)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
- **Handler:** `adminRevokeExpired`
- **Controller file:** `—`

## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

