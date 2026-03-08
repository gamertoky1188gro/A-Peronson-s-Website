# Analytics - Server Feature Documentation (Manual)

## File Structure & Overview
- `server/routes/analyticsRoutes.js`: analytics endpoint registration and role constraints.
- `server/controllers/analyticsController.js`: API-layer handlers for summary and dashboard.
- `server/services/analyticsService.js`: event tracking, scoped aggregation, monthly series generation.
- `server/utils/permissions.js`: access checks and scoped record filtering.
- Data sources:
  - `server/database/analytics.json`
  - `requirements.json`, `messages.json`, `matches.json`, `documents.json`, `users.json` (dashboard aggregation).

## Code Explanation

### `analyticsRoutes.js`
- `GET /api/analytics/summary`
  - roles: owner/admin/buying_house/factory/buyer/agent.
- `GET /api/analytics/dashboard`
  - roles: owner/admin only.

### `analyticsController.js`
- `analyticsSummary(req, res)`:
  - calls `getAnalyticsSummary(req.user)`.
  - catches and forwards via `handleControllerError`.
- `analyticsDashboard(req, res)`:
  - calls `getDashboardAnalytics(req.user)`.
  - same error handling path.

### `analyticsService.js`
Functions:
- `trackEvent({type, actor_id, entity_id, metadata})`:
  - appends event row to `analytics.json`.
- `getAnalyticsSummary(user)`:
  - permission check.
  - user-scoped event filtering.
  - returns total count + `by_type`.
- `getDashboardAnalytics(user)`:
  - admin permission check.
  - reads multiple datasets in parallel.
  - scopes each dataset to authorized view.
  - computes totals (requests, chats, partners, contracts, docs, factories).
  - computes event `by_type`.
  - computes monthly series for requests/chats/documents.

Helper internals:
- `monthKey`, `toMonthlySeries` for chart-ready monthly buckets.
- `scopeAnalyticsRecords` delegates scoping policy to permissions utility.

## API Endpoints
- `GET /api/analytics/summary`
  - Response:
```json
{ "total_events": 123, "by_type": { "product_created": 10 } }
```
  - Status: `200`, `403`.
- `GET /api/analytics/dashboard`
  - Response includes `totals`, `analytics_events`, `series`.
  - Status: `200`, `403`.

Auth:
- both endpoints require JWT auth.
- role-based authorization enforced in routing + service checks.

## Database / Data Model
- `analytics.json` event schema:
  - `id`, `type`, `actor_id`, `entity_id`, `metadata`, `created_at`.
- Dashboard joins data across:
  - requirements, messages, matches, documents, users.

Example grouping logic:
```js
const byType = scoped.reduce((acc, e) => {
  acc[e.type] = (acc[e.type] || 0) + 1
  return acc
}, {})
```

## Business Logic & Workflow
1. Feature services emit `trackEvent`.
2. Events stored in analytics store.
3. Summary endpoint gives lightweight user-scoped totals.
4. Dashboard endpoint computes broader KPI bundles and monthly trend series for admin/owner roles.

## Error Handling & Validation
- Forbidden access throws `forbiddenError` and is converted by controller error handler.
- Date parsing for series gracefully skips invalid timestamps.

## Security Considerations
- Multi-layer authorization:
  - route middleware role checks
  - service-level access checks.
- Record scoping ensures users only see permitted subset where applicable.

## Extra Notes / Metadata
- Data aggregation is computed on read over JSON stores (no pre-aggregated OLAP table).
- Monthly series is UTC month-based.
