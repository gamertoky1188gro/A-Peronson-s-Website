# Network Management

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/network` -> `server/routes/networkRoutes.js:12` (router var: `router`)

## Routes (ultra-detailed)

### GET `/api/network/overview`

- **Route definition:** `server/routes/networkRoutes.js:14`

```js
router.get(
  "/overview",
  requireAuth,
  requireAdminSecurity,
  adminAuditLogger(),
  networkOverview,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
  - `adminAuditLogger()`
- **Handler:** `networkOverview`
- **Controller file:** `server/controllers/networkController.js`
- **Access:** Admin only (security layer)

---

### GET `/api/network/inventory`

- **Route definition:** `server/routes/networkRoutes.js:21`

```js
router.get(
  "/inventory",
  requireAuth,
  requireAdminSecurity,
  adminAuditLogger(),
  networkInventory,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
  - `adminAuditLogger()`
- **Handler:** `networkInventory`
- **Controller file:** `server/controllers/networkController.js`
- **Access:** Admin only (security layer)

---

### POST `/api/network/actions`

- **Route definition:** `server/routes/networkRoutes.js:28`

```js
router.post(
  "/actions",
  requireAuth,
  requireAdminSecurity,
  requireAdminStepUp,
  adminAuditLogger({
    actionResolver: (req) => String(req.body?.action || "network.action"),
  }),
  networkAction,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
  - `requireAdminStepUp`
  - `adminAuditLogger(...)`
- **Handler:** `networkAction`
- **Controller file:** `server/controllers/networkController.js`
- **Access:** Admin only (with step-up auth)
- **Actions include:**
  - Diagnostic: ping, traceroute, SNMP
  - Security: IDS scan, rogue AP scan, RADIUS/TACACS
  - Firewall: policy management
  - NetFlow: refresh data
  - Config: bulk deploy, restore
  - Device: discovery
  - Alerts: integrations

---

## Service Layer

- **Network Service:** `server/services/networkService.js`

## Middleware Details

- `requireAdminSecurity` - Admin security layer verification
- `requireAdminStepUp` - Additional authentication for sensitive actions
- `adminAuditLogger` - Audit trail for all operations

---

*Generated from source: server/routes/networkRoutes.js*