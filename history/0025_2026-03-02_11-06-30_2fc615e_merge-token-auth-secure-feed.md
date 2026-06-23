# Commit 0025: Merge Token-Based Auth and Secure Feed Loading

## Commit Metadata

| Field | Value |
|-------|-------|
| **Commit Number** | 0025 |
| **Commit Hash** | `2fc615e8da373eb81705352024cf628b6f1a8da2` |
| **Parent Hashes** | `e8335d0` (0023), `8e1c5eb` (0024) |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-03-02 11:06:30 (+0600) |
| **Files Changed** | 5 (relative to first parent) |
| **Additions** | 112 |
| **Deletions** | 188 |
| **Net Change** | -76 lines |
| **Merge Commit** | Yes |

## Custom Title

**Merge Improved Auth Security and /me Endpoint**

## High-Level Summary

Merges the JWT security improvements from commit 0024. Key changes: JWT now includes issuer/audience claims, token expiry reduced to 12h, `/api/auth/me` endpoint added, and MainFeed rewritten for secure user loading. The net code reduction (-76 lines) comes from the MainFeed simplification.

## Files Changed (Relative to Parent 1)

- `server/middleware/auth.js` (+14/-8) — JWT issuer/audience, 12h expiry
- `server/controllers/authController.js` (+11/-4) — Added `me()` endpoint
- `server/routes/authRoutes.js` (+3/-2) — Added GET /me
- `src/lib/auth.js` (+6/-0) — Updated patterns
- `src/pages/MainFeed.jsx` (+78/-174) — Simplified, secure user loading
