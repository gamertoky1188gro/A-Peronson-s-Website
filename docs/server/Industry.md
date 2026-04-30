# Industry Data

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/industry` -> `server/routes/industryRoutes.js:8` (router var: `router`)

## Routes

### GET `/api/industry/:slug`

- **Route definition:** `server/routes/industryRoutes.js:10`
- **Middleware:** requireAuth
- **Handler:** `getIndustryPage`
- **Purpose:** Get industry category page with stats

### POST `/api/industry/:slug/auto-reply`

- **Route definition:** `server/routes/industryRoutes.js:11`
- **Middleware:** requireAuth
- **Handler:** `getIndustryAutoReply`
- **Purpose:** Generate AI auto-reply for industry outreach

---

## Service Layer

- **Industry Service:** `server/services/industryService.js`

---

*Generated from source: server/routes/industryRoutes.js*