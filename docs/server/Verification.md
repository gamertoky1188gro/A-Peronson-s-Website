# Verification

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/verification` -> `server/routes/verificationRoutes.js:63` (router var: `verificationRoutes`)

## Routes (ultra-detailed)

### GET `/api/verification/me`

- **Route definition:** `server/routes/verificationRoutes.js:7`

```js
router.get('/me', requireAuth, getMyVerification)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getMyVerification`
- **Controller file:** `server/controllers/verificationController.js`

#### Controller implementation: `server/controllers/verificationController.js:4`

```js
export async function getMyVerification(req, res) {
  const rec = await getVerification(req.user.id)
  return res.json(rec || { user_id: req.user.id, verified: false, missing_required: [] })
}

```
### POST `/api/verification/me`

- **Route definition:** `server/routes/verificationRoutes.js:8`

```js
router.post('/me', requireAuth, allowRoles('buyer', 'factory', 'buying_house'), submitMyVerification)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer', 'factory', 'buying_house')`
- **Handler:** `submitMyVerification`
- **Controller file:** `server/controllers/verificationController.js`

#### Controller implementation: `server/controllers/verificationController.js:9`

```js
export async function submitMyVerification(req, res) {
  const user = await findUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  try {
    const rec = await upsertVerification(user, req.body?.documents || {})
    return res.json(rec)
  } catch (error) {
    const status = Number(error?.statusCode) || 400
    return res.status(status).json({ error: error?.message || 'Verification data is invalid' })
  }
}

```
### POST `/api/verification/admin/:userId/approve`

- **Route definition:** `server/routes/verificationRoutes.js:9`

```js
router.post('/admin/:userId/approve', requireAuth, allowRoles('admin'), adminApprove)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('admin')`
- **Handler:** `adminApprove`
- **Controller file:** `server/controllers/verificationController.js`

#### Controller implementation: `server/controllers/verificationController.js:22`

```js
export async function adminApprove(req, res) {
  const rec = await adminApproveVerification(req.params.userId)
  if (!rec) return res.status(404).json({ error: 'Verification record not found' })
  await setUserVerification(req.params.userId, rec.verified)
  return res.json(rec)
}

```
### POST `/api/verification/admin/revoke-expired`

- **Route definition:** `server/routes/verificationRoutes.js:10`

```js
router.post('/admin/revoke-expired', requireAuth, allowRoles('admin'), adminRevokeExpired)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('admin')`
- **Handler:** `adminRevokeExpired`
- **Controller file:** `server/controllers/verificationController.js`

#### Controller implementation: `server/controllers/verificationController.js:29`

```js
export async function adminRevokeExpired(req, res) {
  const updated = await revokeExpiredVerifications()
  return res.json({ ok: true, total: updated.length })
}

```
## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

