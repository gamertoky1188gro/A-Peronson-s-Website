# Commit 0900 — 9b009c7
| Field | Value |
|-------|-------|
| **Commit Number** | 0900 |
| **Commit Hash** | 9b009c78d2d9a6b884c511ce24c19eefd3510c06 |
| **Parent Hash** | 28bd0e27c7c9b73163ea24e1a00e5c4ddb51a82b |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-04 00:52:37 |
| **Files Changed** | 43 |
| **Additions** | 1753 |
| **Deletions** | 280 |
| **Net Change** | +1753/-280 |
| **Merge Commit** | No |

## Stop the OOM Restart Loop and 'Invalid Token' Logouts

Root-caused a production incident on Render Free (512 MiB): the boot path spawned the opencode child next to the API and then `initAllUserSessions` re-spawned it per user, OOMing every 3–10 minutes. requireAuth turned DB errors into 401 'Invalid token', so users were logged out at random. Fix: lazy, guarded, single-flight opencode startup with idle stop and memory guard; DB-failure-aware error handling (503 DATABASE_UNAVAILABLE/AUTH_BACKEND_UNAVAILABLE instead of 401); query-result caching (30 s) with a Prisma extension for invalidation; batched analytics writes; parallel feed queries; lazy heavy deps (boot heap 47.7 → 27.7 MB); Server-Timing header; CORS fix for the site's own origin; plus targeted fixes (bcrypt install for account unlock, first-signature DateTime 500, member feed access to page-config). Client: apiRequest timeout/retry/shared GETs, feed renders from cached user, Contract Vault side-signing, subscription upgrade from the dashboard.

Original commit message: “Stop the OOM restart loop and the "Invalid token" logouts; cut DB round trips”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `tests/unit/server-resilience.test.js` | Added | 332 | 0 | +332/-0 |
| `src/lib/auth.js` | Modified | 202 | 59 | +202/-59 |
| `src/pages/Settings.jsx` | Modified | 111 | 25 | +111/-25 |
| `server/middleware/auth.js` | Modified | 88 | 39 | +88/-39 |
| `server/utils/authCache.js` | Added | 108 | 0 | +108/-0 |
| `server/services/assistantService.js` | Modified | 81 | 3 | +81/-3 |
| `server/server.js` | Modified | 29 | 47 | +29/-47 |
| `server/utils/prisma.js` | Modified | 71 | 1 | +71/-1 |
| `server/utils/batchWriter.js` | Added | 61 | 0 | +61/-0 |
| `server/utils/memoryBudget.js` | Added | 58 | 0 | +58/-0 |
| `server/services/analyticsService.js` | Modified | 44 | 12 | +44/-12 |
| `server/utils/corsPolicy.js` | Added | 54 | 0 | +54/-0 |
| `server/utils/appStateCache.js` | Added | 46 | 0 | +46/-0 |
| `src/pages/MainFeed.jsx` | Modified | 35 | 6 | +35/-6 |
| `vite.config.js` | Added | 40 | 0 | +40/-0 |
| `server/controllers/subscriptionController.js` | Modified | 25 | 14 | +25/-14 |
| `Claude.md` | Modified | 31 | 7 | +31/-7 |
| `server/middleware/errorHandler.js` | Modified | 37 | 1 | +37/-1 |
| `server/utils/requestContext.js` | Added | 38 | 0 | +38/-0 |
| `server/utils/ttlMemo.js` | Added | 33 | 0 | +33/-0 |
| `src/pages/ContractVault.jsx` | Modified | 27 | 5 | +27/-5 |
| `server/controllers/searchController.js` | Modified | 20 | 9 | +20/-9 |
| `src/components/ui/NeonAtom.jsx` | Modified | 15 | 12 | +15/-12 |
| `server/services/syncService.js` | Modified | 12 | 14 | +12/-14 |
| `server/controllers/systemController.js` | Modified | 16 | 3 | +16/-3 |
| `server/log/format.js` | Added | 19 | 0 | +19/-0 |
| `server/services/feedGenerationService.js` | Modified | 13 | 4 | +13/-4 |
| `src/App.jsx` | Modified | 16 | 1 | +16/-1 |
| `src/pages/OwnerDashboard.jsx` | Modified | 16 | 1 | +16/-1 |
| `server/services/feedService.js` | Modified | 10 | 4 | +10/-4 |
| `server/routes/feedRoutes.js` | Added | 13 | 0 | +13/-0 |
| `index.html` | Added | 11 | 0 | +11/-0 |
| `server/utils/clone.js` | Added | 11 | 0 | +11/-0 |
| `server/utils/localStore.js` | Modified | 7 | 1 | +7/-1 |
| `server/controllers/userController.js` | Modified | 5 | 2 | +5/-2 |
| `server/services/documentService.js` | Modified | 4 | 2 | +4/-2 |
| `src/pages/SearchResults.jsx` | Modified | 4 | 1 | +4/-1 |
| `server/controllers/adminMasterController.js` | Modified | 2 | 2 | +2/-2 |
| `server/utils/redis.js` | Modified | 3 | 1 | +3/-1 |
| `server/services/qdrantService.js` | Modified | 2 | 1 | +2/-1 |
| `server/services/imageProcessor.js` | Modified | 1 | 1 | +1/-1 |
| `server/services/linkPreviewService.js` | Modified | 1 | 1 | +1/-1 |
| `server/services/openSearchService.js` | Modified | 1 | 1 | +1/-1 |

### What changed per file

- **`tests/unit/server-resilience.test.js`** — added. +332/-0 lines.
- **`src/lib/auth.js`** — modified. +202/-59 lines.
- **`src/pages/Settings.jsx`** — modified. +111/-25 lines.
- **`server/middleware/auth.js`** — modified. +88/-39 lines.
- **`server/utils/authCache.js`** — added. +108/-0 lines.
- **`server/services/assistantService.js`** — modified. +81/-3 lines.
- **`server/server.js`** — modified. +29/-47 lines.
- **`server/utils/prisma.js`** — modified. +71/-1 lines.
- **`server/utils/batchWriter.js`** — added. +61/-0 lines.
- **`server/utils/memoryBudget.js`** — added. +58/-0 lines.
- **`server/services/analyticsService.js`** — modified. +44/-12 lines.
- **`server/utils/corsPolicy.js`** — added. +54/-0 lines.
- **`server/utils/appStateCache.js`** — added. +46/-0 lines.
- **`src/pages/MainFeed.jsx`** — modified. +35/-6 lines.
- **`vite.config.js`** — added. +40/-0 lines.
- **`server/controllers/subscriptionController.js`** — modified. +25/-14 lines.
- **`Claude.md`** — modified. +31/-7 lines.
- **`server/middleware/errorHandler.js`** — modified. +37/-1 lines.
- **`server/utils/requestContext.js`** — added. +38/-0 lines.
- **`server/utils/ttlMemo.js`** — added. +33/-0 lines.
- **`src/pages/ContractVault.jsx`** — modified. +27/-5 lines.
- **`server/controllers/searchController.js`** — modified. +20/-9 lines.
- **`src/components/ui/NeonAtom.jsx`** — modified. +15/-12 lines.
- **`server/services/syncService.js`** — modified. +12/-14 lines.
- **`server/controllers/systemController.js`** — modified. +16/-3 lines.
- (remaining 18 listed files above follow the same change class.)

## Detailed Diff Analysis

- **Files changed:** 43; **+1753/-280**.
- **Areas touched:** docs/history 1 file(s), src/server/shared 39 file(s), tests 1 file(s), config/CI 0 file(s).

## Why This Change Was Needed

Production stability / incident response: the deployment was effectively down for most users.

## Was It Useful

Useful and high impact. Large blast radius by design; the commit is dense but coherent, and it converts silent auth failures into accurate errors.

## Impact Analysis

All users. Restarts stop; logouts stop; first paint is faster; DB load drops; subscription upgrade path starts charging the price the API computes. Anyone relying on the old 401-on-DB-error behavior will see 503s instead — a deliberate, documented change.

## Relationship to Surrounding Commits

- **Follows:** 0900 (post-merge) — stop the oom restart loop and 'invalid token' logouts.
- Core of the production-stability branch; merged as 0902.

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
