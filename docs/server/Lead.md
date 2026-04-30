# Lead Management

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/leads` -> `server/routes/leadRoutes.js:12` (router var: `router`)

## Routes (ultra-detailed)

### GET `/api/leads`

- **Route definition:** `server/routes/leadRoutes.js:16`

```js
router.get(
  "/",
  requireAuth,
  allowRoles("owner", "admin", "buying_house", "factory", "agent"),
  getLeads,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles("owner", "admin", "buying_house", "factory", "agent")`
- **Handler:** `getLeads`
- **Controller file:** `server/controllers/leadController.js`

---

### GET `/api/leads/by-match/:matchId`

- **Route definition:** `server/routes/leadRoutes.js:21`

```js
router.get(
  "/by-match/:matchId",
  requireAuth,
  allowRoles("owner", "admin", "buying_house", "factory", "agent"),
  getLeadForMatch,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles("owner", "admin", "buying_house", "factory", "agent")`
- **Handler:** `getLeadForMatch`
- **Controller file:** `server/controllers/leadController.js`

---

### GET `/api/leads/:leadId`

- **Route definition:** `server/routes/leadRoutes.js:27`

```js
router.get(
  "/:leadId",
  requireAuth,
  allowRoles("owner", "admin", "buying_house", "factory", "agent"),
  getLead,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles("owner", "admin", "buying_house", "factory", "agent")`
- **Handler:** `getLead`
- **Controller file:** `server/controllers/leadController.js`

---

### PATCH `/api/leads/:leadId`

- **Route definition:** `server/routes/leadRoutes.js:33`

```js
router.patch(
  "/:leadId",
  requireAuth,
  allowRoles("owner", "admin", "buying_house", "factory", "agent"),
  patchLead,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles("owner", "admin", "buying_house", "factory", "agent")`
- **Handler:** `patchLead`
- **Controller file:** `server/controllers/leadController.js`

---

### POST `/api/leads/:leadId/notes`

- **Route definition:** `server/routes/leadRoutes.js:39`

```js
router.post(
  "/:leadId/notes",
  requireAuth,
  allowRoles("owner", "admin", "buying_house", "factory", "agent"),
  postLeadNote,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles("owner", "admin", "buying_house", "factory", "agent")`
- **Handler:** `postLeadNote`
- **Controller file:** `server/controllers/leadController.js`

---

### POST `/api/leads/:leadId/reminders`

- **Route definition:** `server/routes/leadRoutes.js:45`

```js
router.post(
  "/:leadId/reminders",
  requireAuth,
  allowRoles("owner", "admin", "buying_house", "factory", "agent"),
  postLeadReminder,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `allowRoles("owner", "admin", "buying_house", "factory", "agent")`
- **Handler:** `postLeadReminder`
- **Controller file:** `server/controllers/leadController.js`

---

## Service Layer

- **Lead Service:** `server/services/leadService.js`

## Related Models

- Lead (CRM lead entity)
- LeadNote (notes attached to leads)
- LeadReminder (scheduled reminders)

---

*Generated from source: server/routes/leadRoutes.js*