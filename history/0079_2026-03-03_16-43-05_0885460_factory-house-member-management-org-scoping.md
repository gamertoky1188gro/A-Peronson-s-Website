# Commit 0079: Enable Factory/Buying House Member Management with Org Scoping

## Commit Metadata

| Field | Value |
|---|---|
| Commit Number | 0079 |
| Hash | `0885460f521157a6982402fc0ad7082864d72001` |
| Parent Hash | `746106667a8eddf2bb26409ae6594d10902d04af` |
| Author | Cyber Code Master |
| Date/Time | 2026-03-03 16:43:05 |
| Files Changed | 5 |
| Additions | 40 |
| Deletions | 23 |
| Net Change | +17 |
| Merge | No |

## Custom Title
Expand Member Management Access to Factory and Buying House Roles with Org ID Resolution

## High-Level Summary
This commit extends member management access from `owner`/`admin` only to include `buying_house` and `factory` roles. A new `orgOwnerIdFromUser` helper resolves the org owner ID from various user fields (`org_owner_id`, `org_id`, `organization_id`, or `id`). All member service functions now use string comparison for IDs to handle type mismatches. `canManageMembers` permission is expanded to a `MEMBER_MANAGER_ROLES` set. The frontend `App.jsx` adds a `MEMBER_MANAGEMENT_ROLES` constant and applies it to the member management route.

## File-by-File Breakdown

### server/controllers/memberController.js (modified, +10/-6)
- **What changed**: Added `orgOwnerIdFromUser` helper resolving org owner ID via cascading lookup; replaced all `req.user.id` references with `orgOwnerIdFromUser(req.user)`.
- **Why it matters**: Allows factory/buying house users (who have `org_owner_id` set) to manage members under their org.

### server/routes/memberRoutes.js (modified, +6/-6)
- **What changed**: Expanded `allowRoles` from `('owner', 'admin')` to `('owner', 'admin', 'buying_house', 'factory')` on all routes.
- **Why it matters**: Grants routing-level access to the new roles.

### server/services/memberService.js (modified, +17/-9)
- **What changed**: `normalizeMember` now also normalizes `org_owner_id` and `organization_id`; all ID comparisons converted to `String()` for type safety; `ensureUniqueIdentity` scopes duplicate `member_id` check within the same org.
- **Why it matters**: Fixes type-mismatch bugs and ensures member uniqueness is org-scoped.

### server/utils/permissions.js (modified, +2/-1)
- **What changed**: Added `MEMBER_MANAGER_ROLES` set (owner, admin, buying_house, factory); `canManageMembers` now checks against this set instead of `isOwnerOrAdmin`.
- **Why it matters**: Permission infrastructure for expanded member management.

### src/App.jsx (modified, +2/-1)
- **What changed**: Added `MEMBER_MANAGEMENT_ROLES` constant; member management route now uses `MEMBER_MANAGEMENT_ROLES` instead of `OWNER_ONLY_ROLES`.
- **Why it matters**: Frontend routing-level gate matches backend access expansion.

## Detailed Diff Analysis

### Functions/Classes Added
- **`orgOwnerIdFromUser(user)`** — Resolves org owner ID from `org_owner_id` → `org_id` → `organization_id` → `id`
- **`MEMBER_MANAGER_ROLES`** — Set: `['owner', 'admin', 'buying_house', 'factory']`

### Logic Changes
- **Org ID resolution**: Instead of always using `req.user.id`, the system now resolves the org owner hierarchically
- **String comparison**: All member lookups use `String()` conversion to prevent type-mismatch bugs (e.g., comparing number to string)
- **Org-scoped member_id uniqueness**: The `member_id` duplicate check now scopes to within the same org
- **Permission expansion**: `canManageMembers` returns true for buying_house and factory roles

### UI/UX Changes
- Member Management page is now accessible to factory and buying house roles in addition to owners/admins

## Why This Change May Have Been Needed
Factories and buying houses (which are organizations with sub-members) needed the ability to manage their own team members. Previously this was restricted to global owner/admin roles only.

## Was It Useful?
**Very useful.** This enables organizational hierarchy management for non-owner roles, which is essential for multi-user factories and buying houses.

## Impact Analysis
- **Developers**: `orgOwnerIdFromUser` is the new pattern for org-scoped operations. All ID comparisons should use `String()`.
- **Users**: Factory and buying house users can now access Member Management.
- **Backward compatibility**: All previous ID lookups now use string comparison — safe for existing data.

## Relationship to Surrounding Commits
Follows buyer request CRUD merge (0078) and precedes merge PR #42. This is a permissions/infrastructure change enabling the next set of features.

## Confidence Notes
High. The changes are systematic and well-motivated.

## Optional Technical Details
- The cascading fallback in `orgOwnerIdFromUser`: `org_owner_id` → `org_id` → `organization_id` → `id`
- String comparison was added to prevent bugs where JavaScript's `===` would fail due to type differences (e.g., `"123" !== 123`)
- The `ensureUniqueIdentity` function now checks `member_id` uniqueness within the same org, not globally
