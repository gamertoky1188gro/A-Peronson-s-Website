# Admin - Server Feature Documentation (Manual)

## File Structure & Overview

- `server/routes/adminRoutes.js`: Admin audit endpoints.
- `server/controllers/adminController.js`: Raw data audit handlers for users/verification/subscriptions.
- `server/middleware/auth.js`: auth + role gates.
- Data stores:
  - `users.json`
  - `verification.json`
  - `subscriptions.json`

## Code Explanation

### `adminRoutes.js`

- Routes (all require auth + `owner|admin` roles):
  - `GET /api/admin/users`
  - `GET /api/admin/verification`
  - `GET /api/admin/subscriptions`

### `adminController.js`

- `verificationAudit(req, res)`:
  - reads `verification.json`.
  - returns full dataset.
- `subscriptionsAudit(req, res)`:
  - reads `subscriptions.json`.
  - returns full dataset.
- `usersAudit(req, res)`:
  - reads `users.json`.
  - strips `password_hash` from each user.
  - returns sanitized list.

Inputs/outputs:

- Input: authenticated admin request.
- Output: JSON arrays from backing stores.

Dependencies:

- `readJson` from `utils/jsonStore`.

## API Endpoints

- `GET /api/admin/users`
  - Response: `SafeUser[]`.
- `GET /api/admin/verification`
  - Response: verification records array.
- `GET /api/admin/subscriptions`
  - Response: subscription records array.

Status:

- `200`, `401`, `403`.

## Database / Data Model

- Users audit:
  - full user records excluding `password_hash`.
- Verification audit:
  - all verification state documents.
- Subscriptions audit:
  - all subscription plan rows.

## Business Logic & Workflow

1. Admin/owner calls audit endpoint.
2. Controller performs direct dataset read.
3. Users endpoint removes password hashes.
4. Response returned with no additional transformations.

## Error Handling & Validation

- Authorization failures are handled by middleware (`401`/`403`).
- Controller logic is simple read-and-return with minimal branching.

## Security Considerations

- Strong role gating required due to broad dataset visibility.
- Password hash redaction is explicitly implemented in users audit endpoint.

## Extra Notes / Metadata

- These endpoints are operational/audit style and intentionally expose broad internal state to trusted roles.
