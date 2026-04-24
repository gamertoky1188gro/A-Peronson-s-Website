# Product

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/products` -> `server/routes/productRoutes.js:119` (router var: `productRoutes`)

## Routes (ultra-detailed)

### GET `/api/products/`

- **Route definition:** `server/routes/productRoutes.js:7`

```js
router.get("/", requireAuth, getProducts);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getProducts`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:279`

```js
export async function getProducts(req, res) {
  const mine = req.query.mine === "true";
  const category = req.query.category || "";
  const actor = await resolveActor(req);
  const companyId = mine
    ? actor?.role === "agent"
      ? String(actor?.org_owner_id || "")
      : String(actor?.id || "")
    : "";
  if (
    mine &&
    actor?.role === "agent" &&
    !actor?.permission_matrix?.products?.edit
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }
  if (mine && actor?.role === "agent" && !companyId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  return res.json(
    await listProducts({
      category,
      companyId,
      includeDrafts: mine,
      viewerId: companyId,
      viewerRole: actor?.role || "",
    }),
  );
}
```

### GET `/api/products/search`

- **Route definition:** `server/routes/productRoutes.js:8`

```js
router.get("/search", requireAuth, validateFiltersMiddleware, searchProducts);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `validateFiltersMiddleware`
- **Handler:** `searchProducts`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:301`

```js
export async function searchProducts(req, res) {
  await recordWorkflowEvent('search_open', {
    search_source: 'products_search',
    product_id: req.query.product_id || req.query.id || '',
  }, { actor_id: req.user.id }).catch(() => null)
  const plan = await getUserPlan(req.user.id)
  const priorityOnly = req.query.priorityOnly === 'true'
  if (priorityOnly) {
    await ensureEntitlement(req.user, 'priority_search_ranking', 'Premium plan required for priority search filter.')
  }

  const estimateOnly = String(req.query.estimateOnly || '').toLowerCase() === 'true'
  const cursor = Number.isFinite(Number(req.query.cursor)) ? Math.max(0, Math.floor(Number(req.query.cursor))) : 0
  const limitRaw = Number.isFinite(Number(req.query.limit)) ? Math.floor(Number(req.query.limit)) : 50
  const limit = estimateOnly ? 0 : Math.min(50, Math.max(1, limitRaw))

  const advancedFilters = extractUsedAdvancedFilters(req.query)
  const quotaPreview = advancedFilters.length > 0
    ? await getQuotaSnapshot(req.user.id, 'products_search', plan)
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

  let quotaUse = { allowed: true, quota: { action: 'products_search', plan, unlimited: true } }
  if (advancedFilters.length > 0) {
    if (quotaPreview && quotaPreview.remaining <= 0) {
      return res.status(429).json(buildLimitError({
        code: 'limit_reached',
        message: 'Daily product search limit reached',
        quota: quotaPreview,
      }))
    }
    quotaUse = estimateOnly
      ? { allowed: true, quota: quotaPreview }
      : await consumeQuota(req.user.id, 'products_search', plan)
    if (!quotaUse.allowed) {
      return res.status(429).json(buildLimitError({
        code: 'limit_reached',
        message: 'Daily product search limit reached',
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
  const wantedCertificationsRaw = String(req.query.certifications || '').trim()
  const wantedCertifications = wantedCertificationsRaw
    ? wantedCertificationsRaw.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean)
    : []
  const leadTimeMax = parseNumber(req.query.leadTimeMax)
  const capacityMin = parseNumber(req.query.capacityMin)
  const gsmMin = parseNumber(req.query.gsmMin)
  const gsmMax = parseNumber(req.query.gsmMax)
  const wantedFabricTypes = parseList(req.query.fabricType)
  const wantedSizeRange = String(req.query.sizeRange || '').trim().toLowerCase()
  const wantedColorPantone = parseList(req.query.colorPantone)
  const wantedCustomization = parseList(req.query.customization)
  const sampleAvailable = req.query.sampleAvailable === 'true'
  const sampleLeadTimeMax = parseNumber(req.query.sampleLeadTime)
  const wantedPaymentTerms = parseList(req.query.paymentTerms)
  const wantedDocumentReady = parseList(req.query.documentReady)
  const wantedAuditDate = String(req.query.auditDate || '').trim().toLowerCase()
  const wantedLanguage = parseList(req.query.languageSupport)
  const wantedIncoterms = parseList(req.query.incoterms)
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
```

### GET `/api/products/views/me`

- **Route definition:** `server/routes/productRoutes.js:9`

```js
router.get("/views/me", requireAuth, getMyViewedProducts);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getMyViewedProducts`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:877`

```js
export async function getMyViewedProducts(req, res) {
  const cursor = Number.isFinite(Number(req.query.cursor))
    ? Math.max(0, Math.floor(Number(req.query.cursor)))
    : 0;
  const limitRaw = Number.isFinite(Number(req.query.limit))
    ? Math.floor(Number(req.query.limit))
    : 10;
  const limit = Math.min(50, Math.max(1, limitRaw));
  return res.json(await listMyProductViews(req.user.id, { cursor, limit }));
}
```

### POST `/api/products/`

- **Route definition:** `server/routes/productRoutes.js:10`

```js
router.post(
  "/",
  requireAuth,
  allowRoles("factory", "buying_house", "admin", "agent"),
  postProduct,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('factory', 'buying_house', 'admin', 'agent')`
- **Handler:** `postProduct`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:269`

```js
export async function postProduct(req, res) {
  try {
    const actor = await resolveActor(req);
    const row = await createProduct(actor, req.body);
    return res.status(201).json(row);
  } catch (error) {
    return handleControllerError(res, error);
  }
}
```

### PATCH `/api/products/:productId`

- **Route definition:** `server/routes/productRoutes.js:11`

```js
router.patch(
  "/:productId",
  requireAuth,
  allowRoles("factory", "buying_house", "admin", "agent"),
  updateProduct,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('factory', 'buying_house', 'admin', 'agent')`
- **Handler:** `updateProduct`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:853`

```js
export async function updateProduct(req, res) {
  const actor = await resolveActor(req);
  const updated = await updateProductById(
    actor,
    req.params.productId,
    req.body || {},
  );
  if (updated === "forbidden")
    return res.status(403).json({ error: "Forbidden" });
  if (!updated) return res.status(404).json({ error: "Product not found" });
  return res.json(updated);
}
```

### DELETE `/api/products/:productId`

- **Route definition:** `server/routes/productRoutes.js:12`

```js
router.delete(
  "/:productId",
  requireAuth,
  allowRoles("factory", "buying_house", "admin", "agent"),
  deleteProduct,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles('factory', 'buying_house', 'admin', 'agent')`
- **Handler:** `deleteProduct`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:861`

```js
export async function deleteProduct(req, res) {
  const actor = await resolveActor(req);
  const removed = await removeProduct(actor, req.params.productId);
  if (removed === "forbidden")
    return res.status(403).json({ error: "Forbidden" });
  if (!removed) return res.status(404).json({ error: "Product not found" });
  return res.json({ ok: true });
}
```

### POST `/api/products/:productId/view`

- **Route definition:** `server/routes/productRoutes.js:13`

```js
router.post("/:productId/view", requireAuth, recordProductView);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `recordProductView`
- **Controller file:** `server/controllers/productController.js`

#### Controller implementation: `server/controllers/productController.js:869`

```js
export async function recordProductView(req, res) {
  const ip = extractClientIp(req);
  const geo = ip ? await locateIp(ip) : null;
  const result = await recordView(req.user.id, req.params.productId, {
    windowMinutes: 10,
    geo,
  });
  if (result === "not_found")
    return res.status(404).json({ error: "Product not found" });
  return res.status(201).json(result);
}
```

## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.
