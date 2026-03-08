# Notification - Server Feature Documentation (Manual)

## File Structure & Overview
- `server/routes/notificationRoutes.js`: Notification and search-alert endpoints.
- `server/controllers/notificationController.js`: Notification retrieval/read and alert creation with quota checks.
- `server/services/notificationService.js`: Alert persistence, notification generation, read flag updates.
- `server/services/searchAccessService.js`: Daily quota checks and access payload generation.
- `server/database/notifications.json`: User notifications.
- `server/database/search_alerts.json`: Saved search alerts.

## Code Explanation

### `notificationRoutes.js`
- Routes:
  - `GET /` -> list notifications
  - `PATCH /:notificationId/read` -> mark read
  - `GET /search-alerts` -> list user alerts
  - `POST /search-alerts` -> create/update alert
- All routes require auth.

### `notificationController.js`
Functions:
- `createSearchAlert(req, res)`:
  - gets user plan.
  - consumes `search_alerts_create` quota.
  - returns `429` when limit reached.
  - saves alert via service and returns `201` with quota/access metadata.
  - returns `400` when query missing.
- `getSearchAlerts`: returns current user’s alerts.
- `getNotifications`: returns sorted notifications.
- `readNotification`: marks specific notification read, `404` if not found.

### `notificationService.js`
Functions:
- `saveSearchAlert(userId, query, filters)`:
  - normalizes/sanitizes query.
  - updates existing alert for same user/query or creates new row.
- `listMySearchAlerts(userId)`.
- `emitNotificationsForEntity(entityType, entity)`:
  - compares new entity text against all saved alerts.
  - creates `smart_search_match` notifications for matched queries.
- `listNotifications(userId)`:
  - user-scoped, newest-first.
- `markNotificationRead(userId, id)`.

Data model types:
- Search alert:
  - `id`, `user_id`, `query`, `filters`, timestamps.
- Notification:
  - `id`, `user_id`, `type`, `entity_type`, `entity_id`, `message`, `read`, `created_at`.

## API Endpoints
- `GET /api/notifications/`
  - Response: `Notification[]`.
- `PATCH /api/notifications/:notificationId/read`
  - Response: updated notification or `404`.
- `GET /api/notifications/search-alerts`
  - Response: `SearchAlert[]`.
- `POST /api/notifications/search-alerts`
  - Body:
```json
{
  "query": "cotton polo",
  "filters": { "category": "shirt" }
}
```
  - Response:
    - `201`: alert row + access/quota payload
    - `400`: query missing
    - `429`: daily alert limit reached

## Database / Data Model
- `search_alerts.json`: alert definitions per user.
- `notifications.json`: generated notifications.

Matching logic:
- An alert matches when any token in `alert.query` is found in entity searchable text.

## Business Logic & Workflow
1. User saves alert from search UI.
2. Alert stored (or updated if same query exists).
3. New entities (products/requirements) call `emitNotificationsForEntity`.
4. Matched alerts produce unread notifications.
5. User reads notifications and marks items as read.

## Error Handling & Validation
- Missing alert query -> `400`.
- Quota exceed -> `429` with structured limit payload.
- Read operation on non-owned/non-existent item -> `404`.
- Query text sanitized and normalized.

## Security Considerations
- Auth required for all notification routes.
- All read/update operations are user-scoped.
- Quota controls mitigate spam/abuse.

## Extra Notes / Metadata
- Alert query matching is token-inclusion based (simple heuristic).
- Notification generation is synchronous in current service flow.
