# Org - Server Feature Documentation (Manual)

## File Structure & Overview

- `server/routes/orgRoutes.js`: organization namespace router.
- `server/routes/memberRoutes.js`: mounted sub-router for member management operations.
- `server/controllers/memberController.js`: member CRUD/permission/password reset handlers.
- `server/services/memberService.js`: member domain logic.
- `server/database/members.json` and related user stores (used by member service).

## Code Explanation

### `orgRoutes.js`

- Summary:
  - acts as namespace wrapper.
- Behavior:
  - mounts member routes at `/members`.
- Effective endpoint prefix:
  - `/api/org/members/*`.

### Delegated member endpoints

Via mounted `memberRoutes`, org namespace exposes:

- `GET /api/org/members`
- `POST /api/org/members`
- `PUT /api/org/members/:memberId`
- `PATCH /api/org/members/:memberId/permissions`
- `POST /api/org/members/:memberId/reset-password`
- `DELETE /api/org/members/:memberId`

Auth/authorization:

- inherited from `memberRoutes` (require auth + owner/admin/buying_house/factory role set).

## API Endpoints

- This module itself defines no direct handlers; it composes member endpoints under `/api/org`.
- Endpoint contracts are identical to member module contracts with the prefixed path.

## Database / Data Model

- Delegated to member service/database layer; org route introduces no new schema.

## Business Logic & Workflow

1. Client calls organization-scoped endpoint (`/api/org/members/...`).
2. Org router forwards request to member router.
3. Member controller/service performs operation.
4. Response returned through same route chain.

## Error Handling & Validation

- No direct validation in org route.
- Error behavior is inherited from member controller/service.

## Security Considerations

- Org router relies on member route middleware for auth + role gating.

## Extra Notes / Metadata

- Org namespace exists to provide semantic API grouping for organization operations while reusing member route implementation.
