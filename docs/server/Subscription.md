# Subscription

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/subscriptions` -> `server/routes/subscriptionRoutes.js:116` (router var: `subscriptionRoutes`)

## Routes (ultra-detailed)

### GET `/api/subscriptions/me`

- **Route definition:** `server/routes/subscriptionRoutes.js:8`

```js
router.get("/me", requireAuth, getMySubscription);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getMySubscription`
- **Controller file:** `server/controllers/subscriptionController.js`

#### Controller implementation: `server/controllers/subscriptionController.js:6`

```js
export async function getMySubscription(req, res) {
  const sub = await getSubscription(req.user.id);
  return res.json(
    sub || {
      user_id: req.user.id,
      plan: "free",
      start_date: "",
      end_date: "",
      auto_renew: true,
    },
  );
}
```

### POST `/api/subscriptions/me`

- **Route definition:** `server/routes/subscriptionRoutes.js:9`

```js
router.post("/me", requireAuth, updateMySubscription);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `updateMySubscription`
- **Controller file:** `server/controllers/subscriptionController.js`

#### Controller implementation: `server/controllers/subscriptionController.js:11`

```js
export async function updateMySubscription(req, res) {
  const plan = req.body?.plan === "premium" ? "premium" : "free";
  const sub = await upsertSubscription(
    req.user.id,
    plan,
    req.body?.auto_renew,
    {
      actor_id: req.user.id,
      source: "user_request",
      note: "self_service",
    },
  );
  return res.json(sub);
}
```

### POST `/api/subscriptions/me/renew-monthly`

- **Route definition:** `server/routes/subscriptionRoutes.js:10`

```js
router.post("/me/renew-monthly", requireAuth, renewMyPremiumMonthly);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `renewMyPremiumMonthly`
- **Controller file:** `server/controllers/subscriptionController.js`

#### Controller implementation: `server/controllers/subscriptionController.js:34`

```js
export async function renewMyPremiumMonthly(req, res) {
  const FIRST_MONTH_PRICE_USD = 1.99;
  const RENEWAL_PRICE_USD = 6.99;

  const existing = await getSubscription(req.user.id);
  const isFirstTime =
    !existing || String(existing.plan || "").toLowerCase() !== "premium";
  const priceUsd = isFirstTime ? FIRST_MONTH_PRICE_USD : RENEWAL_PRICE_USD;

  try {
    const charge = await debitWallet({
      userId: req.user.id,
      amountUsd: priceUsd,
      reason: "subscription_renewal",
      ref: `subscription:${req.user.id}`,
      allowRestricted: true,
    });
    const sub = await renewPremiumMonthly(req.user.id, req.body?.auto_renew);
    return res.json({
      ...sub,
      price_usd: priceUsd,
      wallet: charge.wallet,
      wallet_entry: charge.entry,
    });
  } catch (error) {
    return res
      .status(error.status || 400)
      .json({ error: error.message || "Unable to renew subscription" });
  }
}
```

### GET `/api/subscriptions/me/remaining-days`

- **Route definition:** `server/routes/subscriptionRoutes.js:11`

```js
router.get("/me/remaining-days", requireAuth, getMyRemainingDays);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getMyRemainingDays`
- **Controller file:** `server/controllers/subscriptionController.js`

#### Controller implementation: `server/controllers/subscriptionController.js:57`

```js
export async function getMyRemainingDays(req, res) {
  const remaining_days = await getRemainingDays(req.user.id);
  return res.json({ user_id: req.user.id, remaining_days });
}
```

### POST `/api/subscriptions/me/verification/mark-expiring-soon`

- **Route definition:** `server/routes/subscriptionRoutes.js:12`

```js
router.post(
  "/me/verification/mark-expiring-soon",
  requireAuth,
  markMyVerificationExpiringSoon,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `markMyVerificationExpiringSoon`
- **Controller file:** `server/controllers/subscriptionController.js`

#### Controller implementation: `server/controllers/subscriptionController.js:62`

```js
export async function markMyVerificationExpiringSoon(req, res) {
  const remainingDays = await getRemainingDays(req.user.id);
  const rec = await markVerificationExpiringSoon(
    req.user.id,
    remainingDays,
    req.body?.threshold_days || 7,
  );
  if (!rec)
    return res.status(404).json({ error: "Verification record not found" });
  return res.json(rec);
}
```

### POST `/api/subscriptions/admin/:userId`

- **Route definition:** `server/routes/subscriptionRoutes.js:13`

```js
router.post(
  "/admin/:userId",
  requireAuth,
  requireAdminSecurity,
  adminSetUserSubscription,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
- **Handler:** `adminSetUserSubscription`
- **Controller file:** `server/controllers/subscriptionController.js`

#### Controller implementation: `server/controllers/subscriptionController.js:21`

```js
export async function adminSetUserSubscription(req, res) {
  const user = await findUserById(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const plan = req.body?.plan === "premium" ? "premium" : "free";
  const sub = await upsertSubscription(user.id, plan, req.body?.auto_renew, {
    actor_id: req.user.id,
    source: "admin_request",
    note: "subscription_override",
  });
  return res.json(sub);
}
```

## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.
