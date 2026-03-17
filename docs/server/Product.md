# Product

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/products` -> `server/routes/productRoutes.js:67` (router var: `productRoutes`)

## Routes (ultra-detailed)

### GET `/api/products/`

- **Route definition:** `server/routes/productRoutes.js:6`

```js
router.get('/', requireAuth, getProducts)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getProducts`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:39`

```js
export async function getProducts(req, res) {
  const mine = req.query.mine === 'true'
  const category = req.query.category || ''
  const companyId = mine ? req.user.id : ''
  return res.json(await listProducts({ category, companyId }))
}

```
### GET `/api/products/search`

- **Route definition:** `server/routes/productRoutes.js:7`

```js
router.get('/search', requireAuth, searchProducts)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `searchProducts`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:46`

```js
export async function searchProducts(req, res) {
  const plan = await getUserPlan(req.user.id)
  const advancedFilters = extractUsedAdvancedFilters(req.query)
  const quotaPreview = await getQuotaSnapshot(req.user.id, 'products_search', plan)

  if (advancedFilters.length > 0 && !canUseAdvancedFilters(plan)) {
    return res.status(403).json(buildLimitError({
      code: 'upgrade_required',
      message: 'Advanced filters require a premium plan',
      quota: quotaPreview,
      missingFilters: advancedFilters,
      upgradeRequired: true,
    }))
  }

  const quotaUse = await consumeQuota(req.user.id, 'products_search', plan)
  if (!quotaUse.allowed) {
    return res.status(429).json(buildLimitError({
      code: 'limit_reached',
      message: 'Daily product search limit reached',
      quota: quotaUse.quota,
    }))
  }

  const all = await listProducts({})
  const users = await readJson('users.json')
  const usersById = new Map(users.map((u) => [u.id, u]))

  const q = String(req.query.q || '').toLowerCase().trim()
  const wantedCountry = String(req.query.country || '').trim().toLowerCase()
  const wantedOrgType = String(req.query.orgType || '').trim().toLowerCase()
  const verifiedOnly = req.query.verifiedOnly === 'true'
  const moqRange = String(req.query.moqRange || '').trim()

  const results = all
    .map((p) => {
      const company = usersById.get(p.company_id) || null
      const authorCountry = String(company?.profile?.country || '').trim()
      return {
        ...p,
        author: company ? {
          id: company.id,
          name: company.name,
          role: company.role,
          verified: Boolean(company.verified),
          country: authorCountry,
        } : { id: p.company_id, name: 'Unknown company', role: 'factory', verified: false, country: '' },
        profile_key: `user:${p.company_id}`,
      }
    })
    .filter((p) => {
      if (q && !`${p.title} ${p.category} ${p.material} ${p.description}`.toLowerCase().includes(q)) return false
      if (req.query.category && String(p.category).toLowerCase() !== String(req.query.category).toLowerCase()) return false
      if (wantedOrgType && String(p.author?.role || '').toLowerCase() !== wantedOrgType) return false
      if (wantedCountry && String(p.author?.country || '').toLowerCase() !== wantedCountry) return false
      if (verifiedOnly && !p.author?.verified) return false
      if (moqRange && !matchesMoqRange(moqRange, p.moq)) return false
      return true
    })

  return res.json({
    items: results,
    ...buildSearchAccessPayload({
      action: 'products_search',
      plan,
      quota: quotaUse.quota,
    }),
  })
}

```
### GET `/api/products/views/me`

- **Route definition:** `server/routes/productRoutes.js:8`

```js
router.get('/views/me', requireAuth, getMyViewedProducts)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getMyViewedProducts`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:136`

```js
export async function getMyViewedProducts(req, res) {
  const cursor = Number.isFinite(Number(req.query.cursor)) ? Math.max(0, Math.floor(Number(req.query.cursor))) : 0
  const limitRaw = Number.isFinite(Number(req.query.limit)) ? Math.floor(Number(req.query.limit)) : 10
  const limit = Math.min(50, Math.max(1, limitRaw))
  return res.json(await listMyProductViews(req.user.id, { cursor, limit }))
}

```
### POST `/api/products/`

- **Route definition:** `server/routes/productRoutes.js:9`

```js
router.post('/', requireAuth, allowRoles('factory', 'buying_house', 'admin'), postProduct)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('factory', 'buying_house', 'admin')`
- **Handler:** `postProduct`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:34`

```js
export async function postProduct(req, res) {
  const row = await createProduct(req.user, req.body)
  return res.status(201).json(row)
}

```
### PATCH `/api/products/:productId`

- **Route definition:** `server/routes/productRoutes.js:10`

```js
router.patch('/:productId', requireAuth, allowRoles('factory', 'buying_house', 'admin'), updateProduct)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('factory', 'buying_house', 'admin')`
- **Handler:** `updateProduct`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:116`

```js
export async function updateProduct(req, res) {
  const updated = await updateProductById(req.user, req.params.productId, req.body || {})
  if (updated === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!updated) return res.status(404).json({ error: 'Product not found' })
  return res.json(updated)
}

```
### DELETE `/api/products/:productId`

- **Route definition:** `server/routes/productRoutes.js:11`

```js
router.delete('/:productId', requireAuth, allowRoles('factory', 'buying_house', 'admin'), deleteProduct)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('factory', 'buying_house', 'admin')`
- **Handler:** `deleteProduct`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:123`

```js
export async function deleteProduct(req, res) {
  const removed = await removeProduct(req.user, req.params.productId)
  if (removed === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!removed) return res.status(404).json({ error: 'Product not found' })
  return res.json({ ok: true })
}

```
### POST `/api/products/:productId/view`

- **Route definition:** `server/routes/productRoutes.js:12`

```js
router.post('/:productId/view', requireAuth, recordProductView)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `recordProductView`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:130`

```js
export async function recordProductView(req, res) {
  const result = await recordView(req.user.id, req.params.productId, { windowMinutes: 10 })
  if (result === 'not_found') return res.status(404).json({ error: 'Product not found' })
  return res.status(201).json(result)
}

```
## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

