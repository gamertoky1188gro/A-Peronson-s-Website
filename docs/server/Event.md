# Event Tracking

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/events` -> `server/routes/eventRoutes.js:5` (router var: `router`)

## Routes (ultra-detailed)

### POST `/api/events`

- **Route definition:** `server/routes/eventRoutes.js:10`

```js
router.post("/", optionalAuth, postEvent);
```

- **Middleware stack (in order):**
  - `optionalAuth` (may be authenticated or anonymous)
- **Handler:** `postEvent`
- **Controller file:** `server/controllers/eventController.js`
- **Access:** Public (authenticated users tracked by user ID, anonymous by client_id)

---

## Service Layer

- **Event Service:** `server/services/eventService.js`

## Notes

- Supports both authenticated and anonymous event tracking
- Anonymous users use client_id (generated client-side)
- Used for analytics and user behavior tracking

---

_Generated from source: server/routes/eventRoutes.js_
