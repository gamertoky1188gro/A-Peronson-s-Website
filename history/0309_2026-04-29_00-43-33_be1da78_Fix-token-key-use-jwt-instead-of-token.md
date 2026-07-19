## Commit Metadata

- **Hash:** `be1da78841fbcf697bc991a6f9d1f9d386660c76`
- **Parent:** `aff9df69e8e66f848cf402b03cc4cd4bb9ebf3b8`
- **Author:** Cyber Code Master
- **Date:** 2026-04-29 00:43:33 +0600
- **Subject:** Fix token key - use jwt instead of token
- **Body:** (none)

## Custom Title

Fix Auth Token Key from "token" to "jwt"

## High-Level Summary

Changes the token key in `FeedManagement.jsx` from `"token"` to `"jwt"` to match the project's actual localStorage key convention.

## File-by-File

| File                           | Change |
| ------------------------------ | ------ |
| `src/pages/FeedManagement.jsx` | +3, -3 |

## Detailed Diff

```diff
--- a/src/pages/FeedManagement.jsx
+++ b/src/pages/FeedManagement.jsx
-        const token = localStorage.getItem("token");
+        const token = localStorage.getItem("jwt");
```

## Why

The page was reading from `localStorage.getItem("token")` but the authentication system stores the JWT under the key `"jwt"`. This caused all API calls to fail with 401 Unauthorized.

## Was It Useful

Yes — restored authenticated API calls in FeedManagement.

## Impact

Small. Single key name change in one file.

## Relationships

Follows commit 308. Part of auth integration fixes.

## Confidence

High
