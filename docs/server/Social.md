# Social - Server Feature Documentation (Manual)

## File Structure & Overview

- `server/routes/socialRoutes.js`: Social interaction endpoints.
- `server/controllers/socialController.js`: Comment/share/report/action handlers.
- `server/services/socialService.js`: Interaction persistence and aggregate reads.
- `server/database/social_interactions.json`: Stored social actions/comments.

## Code Explanation

### `socialRoutes.js`

- Protected routes:
  - `POST /actions`
  - `GET /:entityType/:entityId`
  - `POST /:entityType/:entityId/comment`
  - `POST /:entityType/:entityId/share`
  - `POST /:entityType/:entityId/report`

### `socialController.js`

Functions:

- `createComment`:
  - validates non-empty text.
  - writes comment interaction.
  - returns `201`.
- `createShare`:
  - writes `share` action.
  - returns `201`.
- `createReport`:
  - writes `report` action with optional reason text.
  - returns `201`.
- `getEntityInteractions`:
  - returns interaction summary for target entity.
- `createAction` (generic action entrypoint):
  - validates `entityType/entityId/action`.
  - maps `comment/share/report` to specialized handlers.
  - otherwise stores arbitrary action via `addAction`.
  - returns `400` for missing required fields.

### `socialService.js`

Functions:

- `addComment(user, entityType, entityId, text)`:
  - writes interaction row with actor metadata.
- `addAction(user, entityType, entityId, action, reason='')`:
  - writes generic action row.
- `listInteractions(entityType, entityId)`:
  - returns:
    - `comments`
    - `share_count`
    - `report_count`

Data types:

- Interaction row:
  - `id`, `interaction_type`, `entity_type`, `entity_id`, `actor_id`, `actor_name`, `actor_verified`, `text`, `created_at`.

## API Endpoints

- `POST /api/social/actions`
  - Body:

```json
{ "entityType": "buyer_request", "entityId": "abc", "action": "save" }
```

- Response: `201` row or `400`.
- `GET /api/social/:entityType/:entityId`
  - Response:

```json
{
  "comments": [],
  "share_count": 3,
  "report_count": 1
}
```

- `POST /api/social/:entityType/:entityId/comment`
  - Body: `{ "text": "Great post" }`
  - Response: `201` or `400`.
- `POST /api/social/:entityType/:entityId/share`
  - Response: `201`.
- `POST /api/social/:entityType/:entityId/report`
  - Body optional: `{ "reason": "Spam" }`
  - Response: `201`.

All routes: auth required.

## Database / Data Model

- `social_interactions.json` stores both comments and action signals.
- Query pattern by entity:

```js
all.filter((x) => x.entity_type === entityType && x.entity_id === entityId);
```

- Aggregates are computed on read, not pre-materialized.

## Business Logic & Workflow

1. Feed UI emits social action to `/api/social/actions` or specialized endpoint.
2. Controller validates and calls service writer.
3. Service appends interaction row to JSON store.
4. Interaction summary endpoint aggregates for display.

## Error Handling & Validation

- Missing comment text -> `400`.
- Missing required generic action fields -> `400`.
- Other write operations return created row.

## Security Considerations

- Auth required for all social interaction writes/reads.
- Text values and identifiers sanitized before persistence.

## Extra Notes / Metadata

- Generic `/actions` endpoint simplifies frontend integration for multiple action types.
- Report entries are stored similarly to other actions; no escalation queue in this module.
