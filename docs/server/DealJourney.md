# Deal Journey

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/deal-journey` -> `server/routes/dealJourneyRoutes.js:10` (router var: `router`)

## Routes (ultra-detailed)

### GET `/api/deal-journey/context`

- **Route definition:** `server/routes/dealJourneyRoutes.js:12`

```js
router.get("/context", requireAuth, getJourneyByContext);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getJourneyByContext`
- **Controller file:** `server/controllers/dealJourneyController.js`

---

### GET `/api/deal-journey/:journeyId`

- **Route definition:** `server/routes/dealJourneyRoutes.js:13`

```js
router.get("/:journeyId", requireAuth, getJourney);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getJourney`
- **Controller file:** `server/controllers/dealJourneyController.js`

---

### POST `/api/deal-journey/events`

- **Route definition:** `server/routes/dealJourneyRoutes.js:14`

```js
router.post("/events", requireAuth, createJourneyEvent);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `createJourneyEvent`
- **Controller file:** `server/controllers/dealJourneyController.js`

---

### POST `/api/deal-journey/:journeyId/rollback`

- **Route definition:** `server/routes/dealJourneyRoutes.js:15`

```js
router.post("/:journeyId/rollback", requireAuth, rollbackJourney);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `rollbackJourney`
- **Controller file:** `server/controllers/dealJourneyController.js`

---

## Service Layer

- **Deal Journey Service:** `server/services/dealJourneyService.js`

## Related Models

- Journey (deal pipeline)
- JourneyEvent (timeline events)
- Context (buyer/factory relationship context)

---

_Generated from source: server/routes/dealJourneyRoutes.js_
