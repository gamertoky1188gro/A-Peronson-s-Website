# Commit 0061: Add Org Member Management APIs and Permission Matrix

## Commit Metadata

| Field | Value |
|---|---|
| Commit Number | 0061 |
| Hash | `36827990fc4f1ec29efbfcb411fffcdf4c002587` |
| Parent Hash | `daa05c1b1aca8ff9eac7258b97f1a524fb704774` |
| Author | Cyber Code Master |
| Date/Time | 2026-03-03 11:53:43 |
| Files Changed | 6 |
| Additions | 364 |
| Deletions | 134 |
| Net Change | +230 |
| Merge | No |

## Custom Title
Introduce Granular Permission Matrix and Org-Scoped Member CRUD API

## High-Level Summary
This commit overhauls the member management system by introducing a **permission matrix** — a structured view/edit permission model across five modules (requests, products, analytics, members, documents). It adds a `PUT /org/members/:memberId` endpoint for full member updates, renames `account_id` to `username`/`member_id` fields, enforces unique usernames per organization, implements free-plan member caps, and refactors the React `MemberManagement` page to support the new matrix UI with inline editing. A new `orgRoutes.js` mount point is created to namespace member routes under `/org/members`.

## File-by-File Breakdown

### server/controllers/memberController.js (modified, +17/-1)
- **What changed**: Added `putOrgMember` controller function that calls `updateMember` service; modified `patchMemberPermissions` to accept `permission_matrix` from request body.
- **Why it matters**: Provides a new update endpoint and threads the permission matrix through the existing permissions PATCH path.

### server/routes/memberRoutes.js (modified, +2/-1)
- **What changed**: Added `PUT /:memberId` route wired to `putOrgMember`.
- **Why it matters**: Exposes the member update API under the authenticated owner/admin guard.

### server/routes/orgRoutes.js (added, +8/-0)
- **What changed**: New route file that mounts `memberRoutes` under `/members`.
- **Why it matters**: Creates a `/org/members` namespace for org-scoped operations.

### server/server.js (modified, +2/-0)
- **What changed**: Imported `orgRoutes` and mounted it at `/api/org`.
- **Why it matters**: Registers the new route namespace in the Express app.

### server/services/memberService.js (modified, +120/-25)
- **What changed**: Added `sanitizePermissionMatrix`, `normalizeMember`, `readAllMembers`, `ensureUniqueIdentity`, `assertFreePlanMemberLimit` functions; rewrote `createMember` to use `username`/`member_id` instead of `account_id` and added matrix to creation; added full `updateMember` service; updated `updateMemberPermissions` to persist matrix; added `permission_matrix_sections` to `getMemberConstraints`.
- **Why it matters**: Core logic — enforces unique usernames, free-plan caps, permission conflict detection, and the matrix data model.

### src/pages/MemberManagement.jsx (modified, +145/-92)
- **What changed**: Replaced `account_id` with `username`/`member_id` in forms and table; added `PermissionMatrixEditor` component (view/edit toggles per module); refactored `PermissionEditor` into reusable `PermissionSelector`; created `MemberEditor` component combining all fields; changed API base from `/members` to `/org/members`; increased modal width to `max-w-2xl`; added scrolling.
- **Why it matters**: Complete UI rewrite to support the new matrix model, improving member management UX.

## Detailed Diff Analysis

### Functions/Classes Added
- **`putOrgMember`** (controller) — HTTP handler for `PUT /org/members/:memberId`
- **`sanitizePermissionMatrix`** (service) — Normalizes raw matrix input to `{ view: boolean, edit: boolean }` per section
- **`normalizeMember`** (service) — Ensures all members have `username`, `member_id`, and sanitized matrix
- **`readAllMembers`** (service) — Reads and normalizes the full member list
- **`ensureUniqueIdentity`** (service) — Throws 409 on duplicate username/member_id within org
- **`assertFreePlanMemberLimit`** (service) — Throws 403 if free plan would exceed 10 active members
- **`updateMember`** (service) — Full member update logic (name, username, member_id, role, status, permissions, matrix)
- **`PermissionMatrixEditor`** (React component) — UI for view/edit checkboxes per module section
- **`PermissionSelector`** (React component) — Extracted reusable permission checkbox grid
- **`MemberEditor`** (React component) — Full edit form for an existing member (name, username, member_id, role, status, matrix, permissions)
- **`createBlankMatrix`** (helper) — Generates a matrix with all false view/edit from section list

### Logic Changes
- **Renamed fields**: `account_id` split into `username` (unique within org) and `member_id` (globally unique)
- **Duplicate checking**: Now checks `username` case-insensitively within org, and `member_id` globally
- **Free plan cap**: Extracted into `assertFreePlanMemberLimit`, accounts for status changes on update
- **Permission matrix**: Added as a new `permission_matrix` field alongside the flat `permissions` array
- **Client-side validation removed**: Duplicate checks were taken out of the React component, now done server-side
- **API endpoint relocation**: All member API calls moved from `/members` to `/org/members`

### UI/UX Changes
- Table columns changed from `Member Name`, `Member ID`, `Assigned Requests`, `Performance` to `Name`, `Username`, `Member ID`
- Create/edit forms now include a `Permission Matrix` section with per-module view/edit toggles
- Edit modal uses the new `MemberEditor` component with all fields editable (not just permissions)
- Modals are wider (`max-w-2xl`) and scrollable for smaller screens

## Why This Change May Have Been Needed
This is a **feature expansion** to support multi-tenant organizational structures where different members need different levels of access across functional modules. The old flat `permissions` array was too coarse; a matrix with per-module view/edit granularity provides finer access control. The field rename (`account_id` → `username`/`member_id`) aligns with standard identity conventions. Free-plan limits were likely being circumvented, so enforcement was hardened.

## Was It Useful?
**Highly useful.** The permission matrix enables role-based access for enterprise features (e.g., a member who can view analytics but not edit products). The org-scoped routing (`/api/org/members`) prepares for adding more org-level resources. The unique username constraint prevents confusion.

## Impact Analysis
- **Developers**: New `permission_matrix` field on member objects; old `account_id` clients will break — need to migrate to `username`/`member_id`.
- **Users**: Members see a permission matrix in the UI; free-plan orgs capped at 10 active members.
- **Backward compatibility**: Not fully compatible — `account_id` is gone from the API response, replaced by `username` and `member_id`. The old `/members` route still exists but the frontend now calls `/org/members`.

## Relationship to Surrounding Commits
This is the feature commit that precedes a merge PR (#33). It establishes the member permission matrix and org-scoped routing that subsequent commits will build upon.

## Confidence Notes
High confidence. The diff is complete and consistent across backend and frontend. The structural changes are clearly motivated by the need for granular permissions and org scoping.

## Optional Technical Details
- `MATRIX_SECTIONS` constant defines five modules: `requests`, `products`, `analytics`, `members`, `documents`
- Permission conflicts rule: `manage_members` cannot be combined with `reports_only`
- The `normalizeMember` function is applied to all reads, ensuring backward normalization for legacy JSON data
