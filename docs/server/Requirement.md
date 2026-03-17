# Requirement

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/requirements` -> `server/routes/requirementRoutes.js:61` (router var: `requirementRoutes`)

## Routes (ultra-detailed)

### POST `/api/requirements/`

- **Route definition:** `server/routes/requirementRoutes.js:7`

```js
router.post('/', requireAuth, allowRoles('buyer'), createBuyerRequirement)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer')`
- **Handler:** `createBuyerRequirement`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:33`

```js
export async function createBuyerRequirement(req, res) {
  const requirement = await createRequirement(req.user.id, req.body)
  return res.status(201).json(requirement)
}

```
### GET `/api/requirements/`

- **Route definition:** `server/routes/requirementRoutes.js:8`

```js
router.get('/', requireAuth, getRequirements)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getRequirements`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:38`

```js
export async function getRequirements(req, res) {
  const filters = {}
  if (req.user.role === 'buyer') filters.buyerId = req.user.id
  return res.json(await listRequirements(filters))
}

```
### GET `/api/requirements/search`

- **Route definition:** `server/routes/requirementRoutes.js:9`

```js
router.get('/search', requireAuth, searchRequirements)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `searchRequirements`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:64`

```js
export async function searchRequirements(req, res) {
  const plan = await getUserPlan(req.user.id)
  const advancedFilters = extractUsedAdvancedFilters(req.query)
  const quotaPreview = await getQuotaSnapshot(req.user.id, 'requirements_search', plan)

  if (advancedFilters.length > 0 && !canUseAdvancedFilters(plan)) {
    return res.status(403).json(buildLimitError({
      code: 'upgrade_required',
      message: 'Advanced filters require a premium plan',
      quota: quotaPreview,
      missingFilters: advancedFilters,
      upgradeRequired: true,
    }))
  }

  const quotaUse = await consumeQuota(req.user.id, 'requirements_search', plan)
  if (!quotaUse.allowed) {
    return res.status(429).json(buildLimitError({
      code: 'limit_reached',
      message: 'Daily requirement search limit reached',
      quota: quotaUse.quota,
    }))
  }

  const all = await listRequirements({})
  const users = await readJson('users.json')
  const usersById = new Map(users.map((u) => [u.id, u]))

  const q = String(req.query.q || '').toLowerCase().trim()
  const wantedCountry = String(req.query.country || '').trim().toLowerCase()
  const wantedOrgType = String(req.query.orgType || '').trim().toLowerCase()
  const verifiedOnly = req.query.verifiedOnly === 'true'
  const moqRange = String(req.query.moqRange || '').trim()

  const results = all
    .map((r) => {
      const buyer = usersById.get(r.buyer_id) || null
      const authorCountry = String(buyer?.profile?.country || '').trim()
      return {
        ...r,
        author: buyer ? {
          id: buyer.id,
          name: buyer.name,
          role: buyer.role,
          verified: Boolean(buyer.verified),
          country: authorCountry,
        } : { id: r.buyer_id, name: 'Unknown buyer', role: 'buyer', verified: false, country: '' },
        profile_key: `user:${r.buyer_id}`,
      }
    })
    .filter((r) => {
      if (q && !`${r.category} ${r.material} ${r.custom_description}`.toLowerCase().includes(q)) return false
      if (req.query.category && String(r.category).toLowerCase() !== String(req.query.category).toLowerCase()) return false
      if (wantedOrgType && String(r.author?.role || '').toLowerCase() !== wantedOrgType) return false
      if (wantedCountry && String(r.author?.country || '').toLowerCase() !== wantedCountry) return false
      if (verifiedOnly && !r.author?.verified) return false
      if (moqRange && !matchesMoqRange(moqRange, r.quantity)) return false
      return true
    })

  return res.json({
    items: results,
    ...buildSearchAccessPayload({
      action: 'requirements_search',
      plan,
      quota: quotaUse.quota,
    }),
  })
}

```
### GET `/api/requirements/:requirementId`

- **Route definition:** `server/routes/requirementRoutes.js:10`

```js
router.get('/:requirementId', requireAuth, getRequirement)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getRequirement`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:44`

```js
export async function getRequirement(req, res) {
  const requirement = await getRequirementById(req.params.requirementId)
  if (!requirement) return res.status(404).json({ error: 'Requirement not found' })
  return res.json(requirement)
}

```
### PATCH `/api/requirements/:requirementId`

- **Route definition:** `server/routes/requirementRoutes.js:11`

```js
router.patch('/:requirementId', requireAuth, allowRoles('buyer', 'admin'), patchRequirement)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer', 'admin')`
- **Handler:** `patchRequirement`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:50`

```js
export async function patchRequirement(req, res) {
  const updated = await updateRequirement(req.params.requirementId, req.body || {}, req.user)
  if (updated === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!updated) return res.status(404).json({ error: 'Requirement not found' })
  return res.json(updated)
}

```
### DELETE `/api/requirements/:requirementId`

- **Route definition:** `server/routes/requirementRoutes.js:12`

```js
router.delete('/:requirementId', requireAuth, allowRoles('buyer', 'admin'), deleteRequirement)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer', 'admin')`
- **Handler:** `deleteRequirement`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:57`

```js
export async function deleteRequirement(req, res) {
  const ok = await removeRequirement(req.params.requirementId, req.user)
  if (ok === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!ok) return res.status(404).json({ error: 'Requirement not found' })
  return res.json({ ok: true })
}

```
## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

