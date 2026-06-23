# Commit 0147: Fix SPA Fallback Route Wildcard Pattern

## Commit Metadata

| Field | Value |
|-------|-------|
| **Commit Number** | 0147 |
| **Commit Hash** | `d877261fdd52babeda7a74f4e2e0d2f7010f0c98` |
| **Parent Hash** | `fc32c4b791acd84e4bdce9770dc2edf4e46b28a1` |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-03-26 23:21:51 |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 1 |
| **Net Change** | 0 |
| **Merge Commit** | No |

## Custom Title

Fix Express SPA Wildcard Route from `*` to `/*`

## High-Level Summary

A single-character change in `server/server.js` that fixes the Express wildcard route for SPA fallback from `'*'` to `'/*'`. This ensures that only unmatched path requests get the `index.html` SPA response, rather than also matching all HTTP methods incorrectly.

## File-by-File Breakdown

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `server/server.js` | Modified | 1 | 1 | 0 |

Changed line 120: `app.get('*', ...)` → `app.get('/*', ...)`

## Detailed Diff Analysis

In Express, `app.get('*', ...)` matches the literal path `*` for GET requests (which works in practice but is non-standard), while `app.get('/*', ...)` uses the Express path pattern syntax meaning "match any path". The `/*` pattern is the conventional way to implement SPA fallback routing in Express, ensuring all unmatched GET requests receive the `index.html` file.

## Why This Change May Have Been Needed

The prior `'*'` pattern may have caused issues with nested routes or route parameters in Express, potentially returning the SPA shell for API routes that should have been caught by other middleware first. The `'/*'` pattern is more robust.

## Was It Useful?

Yes. This is a correctness fix that aligns the SPA fallback with Express best practices. It prevents edge cases where the wildcard might interfere with other route matching.

## Impact Analysis

- **Users**: No visible change when working correctly
- **Developers**: More reliable route matching for nested SPA routes
- **Backward compatibility**: Minimal risk — behavior should be identical for standard cases

## Relationship to Surrounding Commits

This fix follows the deployment script improvements in 0146 and precedes additional deployment/script refinements in 0148. It addresses a potential issue discovered during the deployment flow testing.

## Confidence Notes

High confidence. The fix is a well-known Express pattern correction.
