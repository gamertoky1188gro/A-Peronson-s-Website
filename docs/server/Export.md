# Data Export

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/export` -> `server/routes/exportRoutes.js:5` (router var: `router`)

## Routes (ultra-detailed)

### POST `/api/export/analytics`

- **Route definition:** `server/routes/exportRoutes.js:7`

```js
router.post("/analytics", requireAuth, exportAnalytics);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `exportAnalytics`
- **Controller file:** `server/controllers/exportController.js`

---

## Service Layer

- **Export Service:** `server/services/exportService.js`

## Supported Export Types

- Analytics data exports
- Report generation

---

*Generated from source: server/routes/exportRoutes.js*