# Commit 0716 — 1637057

| Field | Value |
|-------|-------|
| **Commit Number** | 0716 |
| **Commit Hash** | 16370573ca75578c776c48b5119d45638c34360b |
| **Parent Hash** | 1f5618fc3762060d9678b4fef23eb7576c68d61e |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-17 12:48:22 |
| **Branch** | main |
| **Files Changed** | 2 |
| **Additions** | 8 |
| **Deletions** | 4 |
| **Net Change** | +8/-4 |
| **Merge Commit** | No |

## Fix Shared Post Page Returning "Post Not Found" Due to Status Mismatch

This commit fixes a bug where the shared post page (`/share/:entityType/:entityId`) returned a 404 "Post not found" error even when the post existed in the database. The root cause was a mismatch between the hardcoded status checks in `getShareablePost()` and the actual status values used in production.

The backend `getShareablePost` function only accepted `status === "active"` for buyer requests and products, but the database stores buyer requests with statuses like `open` and products with statuses like `published`. The fix expands the allowed status arrays to include all valid values: `["active", "open"]` for buyer requests, `["active", "open", "published"]` for products.

On the frontend, `SharedPost.jsx` replaced the authenticated `apiRequest()` call with a plain `fetch()` to the public endpoint. This is correct because shared post links are meant to be accessible without authentication — using `apiRequest()` would have attached a token or failed for unauthenticated visitors, potentially returning a different response or error.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| server/services/feedService.js | Modified | 2 | 2 | +0 |
| src/pages/SharedPost.jsx | Modified | 6 | 2 | +4 |

## Detailed Diff Analysis

### server/services/feedService.js
- Buyer request check: `raw.status !== "active"` → `!["active", "open"].includes(raw.status)`
- Product check: `raw.status !== "active"` → `!["active", "open", "published"].includes(raw.status)`
- User feed post check remains `raw.status !== "published"` (unchanged — already correct)

### src/pages/SharedPost.jsx
- Removes `import { apiRequest } from "../lib/auth.js"`
- Replaces `apiRequest(\`/feed/share/...\`)` with `fetch(\`/api/feed/share/...\`)` + manual error handling
- Adds proper `res.ok` check and JSON parsing for error responses

## Why This Change Was Needed

Shared post links were broken for all buyer requests and products because the status filter was too restrictive. The database uses `open` for buyer requests and `published` for products, but the code only accepted `active`. This meant every shared link returned 404, making the share feature completely non-functional for two of three entity types.

## Was It Useful

Yes — this fixes a critical broken feature. Shared post links are the primary mechanism for external sharing of GarTexHub content. Without this fix, two-thirds of shareable content types were inaccessible.

## Impact Analysis

- **Bug Fix**: Restores functionality for shared post links across buyer requests and products
- **Frontend**: Removes authentication dependency from the share endpoint call (correct behavior for public links)
- **Risk**: Low — expanding status arrays is conservative; using `fetch` instead of `apiRequest` is more correct for public endpoints

## Relationship to Surrounding Commits

- Follows commit 0715 (account lock hardening) — unrelated feature area
- Precedes commit 0717 (debug logging for share endpoint) — indicates the fix wasn't immediately sufficient and required further diagnosis
- Part of a mini-series (0716–0720) focused on debugging and fixing the share endpoint

## Confidence Notes

The status array expansion is correct based on the Prisma schema's status enums. The `fetch` replacement is the right pattern for public endpoints. However, the fact that commit 0717 immediately adds debug logging suggests there may be additional issues beyond just the status mismatch.

## Optional Technical Details

- The `apiRequest` helper in `auth.js` attaches Bearer tokens and may redirect on 401 — inappropriate for public share links
- The `fetch` call targets `/api/feed/share/` (with `/api` prefix) while `apiRequest` targets `/feed/share/` — this suggests `apiRequest` handles the base URL differently
- Status values are stored in the Prisma schema as enums, but the comparison uses `includes()` for flexibility
