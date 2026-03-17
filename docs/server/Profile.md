# Profile

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/profiles` -> `server/routes/profileRoutes.js:83` (router var: `profileRoutes`)

## Routes (ultra-detailed)

### GET `/api/profiles/:userId`

- **Route definition:** `server/routes/profileRoutes.js:7`

```js
router.get('/:userId', requireAuth, getProfile)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getProfile`
- **Controller file:** `server/controllers/profileController.js`

#### Controller implementation: `server/controllers/profileController.js:15`

```js
export async function getProfile(req, res) {
  const data = await getProfileOverview(req.user.id, req.params.userId)
  if (data === 'not_found') return res.status(404).json({ error: 'User not found' })
  return res.json(data)
}

```
### GET `/api/profiles/:userId/requests`

- **Route definition:** `server/routes/profileRoutes.js:8`

```js
router.get('/:userId/requests', requireAuth, getProfileRequests)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getProfileRequests`
- **Controller file:** `server/controllers/profileController.js`

#### Controller implementation: `server/controllers/profileController.js:21`

```js
export async function getProfileRequests(req, res) {
  const { cursor, limit } = parsePaging(req.query)
  const data = await getProfileRequestsPage(req.user.id, req.params.userId, { cursor, limit })
  if (data === 'not_found') return res.status(404).json({ error: 'User not found' })
  if (data === 'invalid_role') return res.status(400).json({ error: 'Requests only available for buyer profiles' })
  return res.json(data)
}

```
### GET `/api/profiles/:userId/products`

- **Route definition:** `server/routes/profileRoutes.js:9`

```js
router.get('/:userId/products', requireAuth, getProfileProducts)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getProfileProducts`
- **Controller file:** `server/controllers/profileController.js`

#### Controller implementation: `server/controllers/profileController.js:29`

```js
export async function getProfileProducts(req, res) {
  const { cursor, limit } = parsePaging(req.query)
  const data = await getProfileProductsPage(req.user.id, req.params.userId, { cursor, limit })
  if (data === 'not_found') return res.status(404).json({ error: 'User not found' })
  if (data === 'invalid_role') return res.status(400).json({ error: 'Products only available for factory / buying house profiles' })
  return res.json(data)
}

```
### GET `/api/profiles/:userId/partner-network`

- **Route definition:** `server/routes/profileRoutes.js:10`

```js
router.get('/:userId/partner-network', requireAuth, getProfilePartnerNetwork)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getProfilePartnerNetwork`
- **Controller file:** `server/controllers/profileController.js`

#### Controller implementation: `server/controllers/profileController.js:37`

```js
export async function getProfilePartnerNetwork(req, res) {
  const data = await getProfilePartnerNetworkSummary(req.user.id, req.params.userId)
  if (data === 'not_found') return res.status(404).json({ error: 'User not found' })
  if (data === 'invalid_role') return res.status(400).json({ error: 'Partner network only available for buying house profiles' })
  return res.json(data)
}


```
## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

