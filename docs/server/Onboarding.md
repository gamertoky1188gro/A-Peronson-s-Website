# Onboarding - Server Feature Documentation (Manual)

## File Structure & Overview

- `server/routes/onboardingRoutes.js`: onboarding submit route.
- `server/controllers/onboardingController.js`: onboarding patch construction and profile update call.
- `server/services/userService.js`: profile update persistence.
- `server/database/users.json`: user profile storage.

## Code Explanation

### `onboardingRoutes.js`

- Endpoint:
  - `POST /api/onboarding/`
- Middleware:
  - `requireAuth`.

### `onboardingController.js`

- Function `submitOnboarding(req, res)`:

1. Builds profile patch:
   - `profile_image`
   - `organization_name`
   - `categories` (array fallback)
   - `onboarding_completed: 'true'`
2. Calls `updateProfile(req.user.id, patch)`.
3. Returns updated user or `404` if user not found.

Inputs:

- `req.body.profile_image: string`
- `req.body.organization_name: string`
- `req.body.categories: string[]`

Output:

- `200` updated safe user.
- `404` user missing.

Dependencies:

- `userService.updateProfile`.

## API Endpoints

- `POST /api/onboarding/`
- Auth: required.
- Body example:

```json
{
  "profile_image": "https://cdn/.../avatar.png",
  "organization_name": "Acme Garments",
  "categories": ["knitwear", "denim"]
}
```

- Response:
  - `200` updated user object.
  - `404` not found.

## Database / Data Model

- Writes into `users.json` user profile object:
  - adds/updates onboarding-related keys.
- `updateProfile` sanitizes scalar and array values before persistence.

## Business Logic & Workflow

1. Frontend onboarding wizard submits consolidated profile patch.
2. Backend merges patch into existing user profile.
3. User profile marked as onboarding completed.
4. Client can proceed to role-home/feed flows.

## Error Handling & Validation

- Missing auth handled by middleware.
- Missing user id in store returns `404`.
- Basic fallback defaults used for missing request fields.

## Security Considerations

- JWT required.
- Profile values sanitized in user service.

## Extra Notes / Metadata

- `onboarding_completed` is stored as string `'true'` in current implementation, not boolean.
