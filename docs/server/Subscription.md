# Subscription - Server Feature Documentation (Manual)

## File Structure & Overview
- `server/routes/subscriptionRoutes.js`: Subscription endpoints and admin set endpoint.
- `server/controllers/subscriptionController.js`: Plan update, renew, remaining-days and verification-expiry helpers.
- `server/services/subscriptionService.js`: Core subscription persistence and date math.
- `server/services/verificationService.js`: Expiring-soon marker integration.
- `server/services/userService.js`: Admin user existence check.
- `server/database/subscriptions.json`: Subscription records.
- `server/database/verification.json`: Updated by expiring-soon marker endpoint.

## Code Explanation

### `subscriptionRoutes.js`
- Registers:
  - `GET /me`
  - `POST /me`
  - `POST /me/renew-monthly`
  - `GET /me/remaining-days`
  - `POST /me/verification/mark-expiring-soon`
  - `POST /admin/:userId` (admin only)

### `subscriptionController.js`
Functions:
- `getMySubscription`: returns user subscription or free-plan fallback object.
- `updateMySubscription`: upserts plan (`premium` or `free`) + auto_renew.
- `adminSetUserSubscription`: validates target user then upserts their plan.
- `renewMyPremiumMonthly`: extends premium by ~30 days from current valid end or now.
- `getMyRemainingDays`: returns integer days remaining.
- `markMyVerificationExpiringSoon`: updates verification record expiring flags based on remaining days.

### `subscriptionService.js`
Functions:
- `getSubscription(userId)`: lookup by `user_id`.
- `upsertSubscription(userId, plan, autoRenew)`:
  - `premium` -> 30-day window.
  - `free` -> very long horizon (3650 days).
- `renewPremiumMonthly(userId, autoRenew)`:
  - extends from existing end if still active.
- `getRemainingDays(userId)`: days to expiry (rounded up).
- `isSubscriptionValid(userId)`: remaining days > 0.

Data types:
- Subscription:
  - `user_id`, `plan`, `start_date`, `end_date`, `auto_renew`.

Dependencies:
- `jsonStore`, date helpers in same module.

## API Endpoints
- `GET /api/subscriptions/me`
  - Auth: required.
  - Response: subscription object or default free fallback.
- `POST /api/subscriptions/me`
  - Body: `{ "plan": "premium|free", "auto_renew": true }`
  - Response: updated subscription.
- `POST /api/subscriptions/me/renew-monthly`
  - Body optional: `{ "auto_renew": true }`
  - Response: renewed premium subscription.
- `GET /api/subscriptions/me/remaining-days`
  - Response: `{ "user_id": "...", "remaining_days": <number> }`
- `POST /api/subscriptions/me/verification/mark-expiring-soon`
  - Body optional: `{ "threshold_days": 7 }`
  - Response: updated verification record or `404`.
- `POST /api/subscriptions/admin/:userId`
  - Auth + admin role.
  - Body: `{ "plan": "premium|free", "auto_renew": true }`
  - Response: updated subscription or `404` user.

## Database / Data Model
- `subscriptions.json`:
  - one row per user id.
- Related:
  - `verification.json` receives derived status fields from expiring-soon endpoint.

Example service query:
```js
subs.find((s) => s.user_id === userId)
```

## Business Logic & Workflow
1. Frontend subscription page calls `/me` and `/me/remaining-days`.
2. Plan change calls `/me` (POST), persisted in `subscriptions.json`.
3. Renewal endpoint extends premium window.
4. Verification status helper endpoint derives expiring flags in verification records.
5. Admin endpoint can override user plan.

## Error Handling & Validation
- Non-admin blocked on admin endpoint by middleware.
- Admin set returns `404` when target user not found.
- Expiring-soon endpoint returns `404` if verification record absent.
- Plan values normalized to `premium` else `free`.

## Security Considerations
- JWT required on all routes.
- Admin-only override route enforced via `allowRoles('admin')`.
- No sensitive card/payment data handled in this service.

## Extra Notes / Metadata
- Free plan end date is intentionally far-future, not true “no-expiry”.
- Premium renewal logic preserves remaining paid time when active.
