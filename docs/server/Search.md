# Search - Server Feature Documentation (Manual)

## File Structure & Overview
- `server/routes/searchRoutes.js`: search module route registration.
- `server/controllers/notificationController.js`: `createSearchAlert` handler reused by search route.
- `server/services/notificationService.js`: alert persistence.
- `server/services/searchAccessService.js`: quota and plan enforcement.
- `server/database/search_alerts.json`: alert store.

## Code Explanation

### `searchRoutes.js`
- Defines:
  - `POST /api/search/alerts`
- Middleware:
  - `requireAuth`.
- Handler:
  - `createSearchAlert` imported from notification controller.

### `notificationController.createSearchAlert`
Process:
1. Retrieves user plan.
2. Consumes quota for action `search_alerts_create`.
3. Returns `429` when quota exhausted.
4. Saves search alert (query + filters).
5. Returns `201` plus search-access payload.

## API Endpoints
- `POST /api/search/alerts`
- Auth: required.
- Body:
```json
{
  "query": "cotton polo factory",
  "filters": {
    "category": "shirt",
    "verifiedOnly": true
  }
}
```
- Response:
  - `201`: alert row + quota/access details.
  - `400`: query missing.
  - `429`: daily limit reached.

## Database / Data Model
- `search_alerts.json` fields:
  - `id`, `user_id`, `query`, `filters`, `created_at`, `updated_at`.
- Duplicate behavior:
  - same user + same normalized query updates existing alert instead of creating new row.

## Business Logic & Workflow
1. Search UI invokes `/api/search/alerts`.
2. Backend checks quota by plan.
3. Alert saved/updated.
4. Later, entity emission logic can match alert query tokens and generate notifications.

## Error Handling & Validation
- Empty query -> `400`.
- Quota exceeded -> `429` structured limit payload.
- Auth failures -> middleware `401`.

## Security Considerations
- Auth required.
- Quota protections reduce abuse/spam.
- Query sanitized before persistence.

## Extra Notes / Metadata
- Search route intentionally delegates to notification controller to keep alert business rules centralized.
