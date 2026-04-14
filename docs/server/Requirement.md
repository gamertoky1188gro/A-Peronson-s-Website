# Requirement

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/requirements` -> `server/routes/requirementRoutes.js:113` (router var: `requirementRoutes`)

## Routes (ultra-detailed)

### POST `/api/requirements/`

- **Route definition:** `server/routes/requirementRoutes.js:8`

```js
router.post('/', requireAuth, allowRoles('buyer'), createBuyerRequirement)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer')`
- **Handler:** `createBuyerRequirement`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:283`

```js
export async function createBuyerRequirement(req, res) {
  try {
    const requirement = await createRequirement(req.user.id, req.body)
    return res.status(201).json(requirement)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

```
### GET `/api/requirements/`

- **Route definition:** `server/routes/requirementRoutes.js:9`

```js
router.get('/', requireAuth, getRequirements)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getRequirements`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:292`

```js
export async function getRequirements(req, res) {
  const filters = {}
  if (req.user.role === 'buyer') filters.buyerId = req.user.id
  return res.json(await listRequirements(filters))
}

```
### GET `/api/requirements/browse`

- **Route definition:** `server/routes/requirementRoutes.js:11`

```js
router.get('/browse', requireAuth, allowRoles('buyer'), browseRequirements)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer')`
- **Handler:** `browseRequirements`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:298`

```js
export async function browseRequirements(req, res) {
  await recordWorkflowEvent('search_open', {
    search_source: 'requirements_search',
    requirement_id: req.query.requirement_id || req.query.id || '',
  }, { actor_id: req.user.id }).catch(() => null)
  const [all, users] = await Promise.all([
    listRequirements({}),
    readJson('users.json'),
  ])
  const usersById = new Map(users.map((u) => [u.id, u]))
  const viewerPlan = await getUserPlan(req.user.id)
  const viewerPremium = viewerPlan === 'premium'
  const viewerRole = String(req.user?.role || '').toLowerCase()
  const enforcePriorityAccess = !viewerPremium && ['factory', 'buying_house', 'agent'].includes(viewerRole)
  const nowMs = Date.now()

  const out = all
    .map((r) => {
      const buyer = usersById.get(r.buyer_id) || null
      const buyerPlan = String(buyer?.subscription_status || '').toLowerCase()
      const buyerPremium = buyerPlan === 'premium'
      const priorityUntil = r.priority_until ? new Date(r.priority_until).getTime() : 0
      const priorityActive = String(r.priority_tier || '').toLowerCase() === 'priority'
        && (!priorityUntil || priorityUntil > nowMs)

      return {
        ...r,
        priority_score: (buyerPremium ? 2 : 0) + (buyer?.verified ? 0.5 : 0),
        priority_active: priorityActive,
      }
    })
    .filter((r) => (enforcePriorityAccess ? !r.priority_active : true))
    .sort((a, b) => {
      if (a.priority_score !== b.priority_score) return b.priority_score - a.priority_score
      const aCreated = new Date(a.created_at || '').getTime()
      const bCreated = new Date(b.created_at || '').getTime()
      return bCreated - aCreated
    })
    .map((r) => (r.buyer_id === req.user.id ? r : redactRequirementForBuyer(r)))

  return res.json(out)
}

```
### GET `/api/requirements/search`

- **Route definition:** `server/routes/requirementRoutes.js:12`

```js
router.get('/search', requireAuth, validateFiltersMiddleware, searchRequirements)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `validateFiltersMiddleware`
- **Handler:** `searchRequirements`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:385`

```js
export async function searchRequirements(req, res) {
  const plan = await getUserPlan(req.user.id)
  const priorityOnly = req.query.priorityOnly === 'true'
  if (priorityOnly) {
    await ensureEntitlement(req.user, 'buyer_request_priority_access', 'Premium plan required for priority buyer requests.')
  }

  const estimateOnly = String(req.query.estimateOnly || '').toLowerCase() === 'true'
  const cursor = Number.isFinite(Number(req.query.cursor)) ? Math.max(0, Math.floor(Number(req.query.cursor))) : 0
  const limitRaw = Number.isFinite(Number(req.query.limit)) ? Math.floor(Number(req.query.limit)) : 50
  const limit = estimateOnly ? 0 : Math.min(50, Math.max(1, limitRaw))

  const advancedFilters = extractUsedAdvancedFilters(req.query)
  const quotaPreview = advancedFilters.length > 0
    ? await getQuotaSnapshot(req.user.id, 'requirements_search', plan)
    : null

  if (advancedFilters.length > 0 && !canUseAdvancedFilters(plan)) {
    return res.status(403).json(buildLimitError({
      code: 'upgrade_required',
      message: 'Advanced filters require a premium plan',
      quota: quotaPreview,
      missingFilters: advancedFilters,
      upgradeRequired: true,
    }))
  }

  let quotaUse = { allowed: true, quota: { action: 'requirements_search', plan, unlimited: true } }
  if (advancedFilters.length > 0) {
    if (quotaPreview && quotaPreview.remaining <= 0) {
      return res.status(429).json(buildLimitError({
        code: 'limit_reached',
        message: 'Daily requirement search limit reached',
        quota: quotaPreview,
      }))
    }
    quotaUse = estimateOnly
      ? { allowed: true, quota: quotaPreview }
      : await consumeQuota(req.user.id, 'requirements_search', plan)
    if (!quotaUse.allowed) {
      return res.status(429).json(buildLimitError({
        code: 'limit_reached',
        message: 'Daily requirement search limit reached',
        quota: quotaUse.quota,
      }))
    }
  }

  const q = String(req.query.q || '').trim()
  const searchTokens = buildSearchTokens(q)
  const wantedIndustry = String(req.query.industry || '').trim().toLowerCase()
  const wantedCountry = String(req.query.country || '').trim().toLowerCase()
  const wantedOrgType = String(req.query.orgType || '').trim().toLowerCase()
  const verifiedOnly = req.query.verifiedOnly === 'true'
  const moqRange = String(req.query.moqRange || '').trim()
  const priceRange = String(req.query.priceRange || '').trim()
  const priceCurrency = String(req.query.priceCurrency || req.query.currency || '').trim().toUpperCase()
  const wantedCategories = parseList(req.query.category)
  const wantedIncoterms = parseList(req.query.incoterms)
  const wantedPaymentTerms = parseList(req.query.paymentTerms)
  const wantedDocumentReady = parseList(req.query.documentReady)
  const wantedAuditDate = String(req.query.auditDate || '').trim().toLowerCase()
  const wantedLanguage = parseList(req.query.languageSupport)
  const wantedFabricTypes = parseList(req.query.fabricType)
  const wantedSizeRange = String(req.query.sizeRange || '').trim().toLowerCase()
  const wantedColorPantone = parseList(req.query.colorPantone)
  const wantedCustomization = parseList(req.query.customization)
  const sampleAvailable = req.query.sampleAvailable === 'true'
  const sampleLeadTimeMax = parseNumber(req.query.sampleLeadTime)
  const wantedCertificationsRaw = String(req.query.certifications || '').trim()
  const wantedCertifications = wantedCertificationsRaw
    ? wantedCertificationsRaw.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean)
    : []
  const leadTimeMax = parseNumber(req.query.leadTimeMax)
  const gsmMin = parseNumber(req.query.gsmMin)
  const gsmMax = parseNumber(req.query.gsmMax)
  const capacityMin = parseNumber(req.query.capacityMin)
  const processes = parseList(req.query.processes)
  const yearsInBusinessMin = parseNumber(req.query.yearsInBusinessMin)
  const responseTimeMax = parseNumber(req.query.responseTimeMax)
  const teamSeatsMin = parseNumber(req.query.teamSeatsMin)
  const handlesMultipleFactoriesFilter = req.query.handlesMultipleFactories !== undefined
    ? parseBoolean(req.query.handlesMultipleFactories)
    : null
  const exportPorts = parseList(req.query.exportPort)
  const hasPermissionMatrixFilter = req.query.hasPermissionMatrix !== undefined
    ? parseBoolean(req.query.hasPermissionMatrix)
    : null
  const auditScoreMin = parseNumber(req.query.auditScoreMin)
  const permissionSection = String(req.query.permissionSection || '').trim().toLowerCase()
  const permissionSectionEdit = req.query.permissionSectionEdit !== undefined
    ? parseBoolean(req.query.permissionSectionEdit)
    : null
  const roleSeatsRaw = String(req.query.roleSeats || '').trim()
  const roleSeatsMap = {}
  if (roleSeatsRaw) {
    for (const part of roleSeatsRaw.split(',')) {
      const [roleRaw, seatsRaw] = String(part || '').split(':').map((s) => (s || '').trim())
      if (!roleRaw) continue
      const n = parseNumber(seatsRaw)
      if (n !== null) roleSeatsMap[String(roleRaw).toLowerCase()] = n
    }
  }
  const distanceKm = parseNumber(req.query.distanceKm)
  const locationLat = parseCoordinate(req.query.locationLat)
  const locationLng = parseCoordinate(req.query.locationLng)
  const distanceFilterActive = distanceKm !== null && locationLat !== null && locationLng !== null
  const baseCurrency = await getBaseCurrency()
  let fxStale = false
  let priceRangeBase = ''
  if (priceRange) {
    const parsed = parseRange(priceRange)
    const fromCurrency = priceCurrency || baseCurrency
    const minConv = parsed.min === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.min, fromCurrency, baseCurrency)
    const maxConv = parsed.max === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.max, fromCurrency, baseCurrency)
    fxStale = Boolean(minConv.fx_stale || maxConv.fx_stale || (parsed.min !== null && minConv.amount === null) || (parsed.max !== null && maxConv.amount === null))
    const minText = minConv.amount !== null ? String(minConv.amount) : ''
    const maxText = maxConv.amount !== null ? String(maxConv.amount) : ''
    priceRangeBase = [minText, maxText].filter((v, idx) => v || idx === 0).join('-')
  }
```
### GET `/api/requirements/:requirementId/matches`

- **Route definition:** `server/routes/requirementRoutes.js:13`

```js
router.get('/:requirementId/matches', requireAuth, getSmartMatches)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getSmartMatches`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:350`

```js
export async function getSmartMatches(req, res) {
  try {
    await ensureEntitlement(req.user, 'smart_supplier_matching', 'Premium plan required for smart supplier matching.')
    const requirement = await getRequirementById(req.params.requirementId)
    if (!requirement) return res.status(404).json({ error: 'Requirement not found' })
    if (req.user.role === 'buyer' && requirement.buyer_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const matches = await generateMatchesForRequirement(requirement)
    const ranked = Array.isArray(matches) && matches.length ? matches : await listMatchesForRequirement(requirement.id)
    return res.json({ matches: ranked })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

```
### GET `/api/requirements/:requirementId`

- **Route definition:** `server/routes/requirementRoutes.js:14`

```js
router.get('/:requirementId', requireAuth, getRequirement)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getRequirement`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:341`

```js
export async function getRequirement(req, res) {
  const requirement = await getRequirementById(req.params.requirementId)
  if (!requirement) return res.status(404).json({ error: 'Requirement not found' })
  if (req.user.role === 'buyer' && requirement.buyer_id !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  return res.json(requirement)
}

```
### PATCH `/api/requirements/:requirementId`

- **Route definition:** `server/routes/requirementRoutes.js:15`

```js
router.patch('/:requirementId', requireAuth, allowRoles('buyer', 'admin', 'owner', 'buying_house'), patchRequirement)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer', 'admin', 'owner', 'buying_house')`
- **Handler:** `patchRequirement`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:367`

```js
export async function patchRequirement(req, res) {
  try {
    const updated = await updateRequirement(req.params.requirementId, req.body || {}, req.user)
    if (updated === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
    if (!updated) return res.status(404).json({ error: 'Requirement not found' })
    return res.json(updated)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

```
### DELETE `/api/requirements/:requirementId`

- **Route definition:** `server/routes/requirementRoutes.js:16`

```js
router.delete('/:requirementId', requireAuth, allowRoles('buyer', 'admin'), deleteRequirement)
```
- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('buyer', 'admin')`
- **Handler:** `deleteRequirement`
- **Controller file:** `server/controllers/requirementController.js`

#### Controller implementation: `server/controllers/requirementController.js:378`

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

