# Commit 0702 — 4ad5c64

| Field | Value |
|-------|-------|
| **Commit Number** | 0702 |
| **Commit Hash** | `4ad5c64e9468a20931a003e604a6aee5757ca0f6` |
| **Parent Hash** | `cebd32d8ac5f170afbaa2dec48eeef1d2b69aef4` |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-16 19:01:15 |
| **Branch** | main |
| **Files Changed** | 2 |
| **Additions** | 2 |
| **Deletions** | 1 |
| **Net Change** | +2/-1 |
| **Merge Commit** | No |

## Pre-fill Organization Name in Onboarding from Signup

This commit fixes a UX issue where the onboarding page's organization name field was empty even though the user had entered their company name during signup. The fix adds `organization_name` to the user profile during registration (backend) and adds `user?.name` as a fallback in the onboarding page's initial state (frontend).

## Files Changed

| File | Type | + | - | Delta |
|------|------|---|---|-------|
| `server/services/userService.js` | modified | +1 | -0 | +1 |
| `src/pages/auth/OnboardingPage.jsx` | modified | +1 | -1 | 0 |

## Detailed Diff Analysis

### server/services/userService.js

In the `registerUser` function, added `organization_name` to the profile object created during user registration:
```js
profile: {
    organization_name: sanitizeString(payload.company_name || "", 120),
    position: sanitizeString(payload.profile?.position || "", 80),
    ...
}
```
Previously, the organization name from the signup form was not being persisted to the user's profile. This meant the onboarding page had no data to pre-fill.

### src/pages/auth/OnboardingPage.jsx

Changed the initial state for `organizationName` from:
```js
const [organizationName, setOrganizationName] = useState(
    () => user?.profile?.organization_name || user?.company_name || "",
);
```
to:
```js
const [organizationName, setOrganizationName] = useState(
    () => user?.profile?.organization_name || user?.company_name || user?.name || "",
);
```
Added `user?.name` as a third fallback. This ensures that even if neither `organization_name` nor `company_name` is available, the user's display name is used as a reasonable default.

## Why This Change Was Needed

Users entering their organization name during signup expected it to carry over to the onboarding step. The empty field created friction and confusion -- users had to re-type information they had already provided. The root cause was twofold: (1) the backend wasn't saving `company_name` to the profile's `organization_name` field, and (2) the frontend had no fallback beyond `company_name`.

## Was It Useful

Yes. This is a small but important UX improvement:
- Eliminates redundant data entry during onboarding.
- The backend fix ensures the data persists correctly.
- The frontend fallback chain (`organization_name` -> `company_name` -> `name`) covers all possible data states.

## Impact Analysis

- **Users**: Organization name is now pre-filled in onboarding, reducing friction.
- **No breaking changes**: The fallback chain only adds a new option; existing behavior is preserved.
- **Backend**: One additional field written to the user profile during registration.

## Relationship to Surrounding Commits

This precedes commit 0703 (adding "Other" category in onboarding). Both commits improve the onboarding flow.

## Confidence Notes

- **Confidence: Very high**. The changes are minimal and targeted -- one line added in each file.
- The fix is backwards-compatible with existing user data.
