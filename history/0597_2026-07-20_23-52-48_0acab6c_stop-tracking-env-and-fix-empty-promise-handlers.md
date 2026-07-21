# Commit 0597 — `0acab6cd8684`

| Field | Value |
|-------|-------|
| **Commit Number** | 0597 |
| **Commit Hash** | `0acab6cd8684b17d07f78eb8ee16c3eebde5180d` |
| **Parent Hash** | `86f4e885f041d2742ec36421fbc8dbebd9782e3d` |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-20 23:52:48 |
| **Branch** | main |
| **Files Changed** | 6 |
| **Additions** | 14 |
| **Deletions** | 53 |
| **Net Change** | −39 |
| **Merge Commit** | No |

## Stop Tracking .env Secrets and Fix Empty Promise Handlers

Adds `.env` to `.gitignore` to prevent secrets from being committed, removes the tracked `.env` file from the repository, and fixes 4 empty `.catch(() => {})` promise handlers by adding `console.warn` logging.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `.env` | Deleted | 0 | 42 | −42 |
| `.gitignore` | Modified | 3 | 0 | +3 |
| `src/components/feed/FeedItemCard.jsx` | Modified | 1 | 1 | +1/-1 |
| `src/pages/CallInterface.jsx` | Modified | 8 | 8 | +8/-8 |
| `src/pages/MainFeed.jsx` | Modified | 1 | 1 | +1/-1 |
| `src/pages/OrgSettings.jsx` | Modified | 1 | 1 | +1/-1 |

### `.env` — Deleted

The entire `.env` file (42 lines) was removed from tracking. This file contained hardcoded secrets including database credentials (`DATABASE_URL` with PostgreSQL password), admin MFA codes, JWT secret, OpenSearch credentials, Gemini API key, and AI configuration. Removing this from version control is a critical security fix.

### `.gitignore` — Modified

Added a new `.env` entry to the `.gitignore` file to prevent accidental re-committing of environment files in the future.

### Promise `.catch()` fixes — 4 files

Each empty `.catch(() => {})` handler was replaced with a `console.warn()` call that provides a descriptive message:

| File | Previous | Fixed |
|------|----------|-------|
| `FeedItemCard.jsx` | `.catch(() => {})` — clipboard copy failure | `.catch(() => console.warn("Failed to copy link"))` |
| `CallInterface.jsx` | 8 instances of `.catch(() => {})` — autoplay/stream/offer failures | Each now has a descriptive `console.warn` message |
| `MainFeed.jsx` | `.catch(() => {})` — feed config load failure | `.catch(() => console.warn("Failed to load feed config"))` |
| `OrgSettings.jsx` | `.catch(() => {})` — notification prefs load failure | `.catch(() => console.warn("Failed to load notification preferences"))` |

The `CallInterface.jsx` changes include 8 specific locations: local video autoplay, remote video autoplay (twice), permission-less stream attempt, permission-granted stream request, exception during stream request, pending offer answer, offer start, and remote video play after unmute.

## Why This Change Was Needed

Two critical issues: (1) The `.env` file containing database passwords, API keys, JWT secrets, and admin credentials was tracked in git — a severe security vulnerability. (2) Empty `.catch(() => {})` handlers silently swallow errors, making debugging impossible during development and hiding failures in production.

## Detailed Diff Analysis

The `.env` deletion removes 42 lines of sensitive configuration. The `.gitignore` addition is 3 lines (`# Environment files`, blank, `.env`). All promise handler changes follow the same pattern: replace `() => {}` with `() => console.warn("...")`.

## Was It Useful

**Useful** — removes hardcoded secrets from version control (security fix) and makes promise failures visible during development (debuggability fix).

## Impact Analysis

- Security: `.env` no longer in git; future `.env` changes won't be tracked
- Debugging: promise rejections now log warnings instead of being silently swallowed
- Backwards compatible: warnings are non-blocking
- Note: secrets remain in git history — a `git filter-repo` would be needed for complete removal

## Relationship to Surrounding Commits

Follows the lint cleanup (0596). This commit addresses two audit findings from the security audit: Fix 1 (secrets in git) and Fix 2 (empty promise handlers). However, this is reverted in the very next commit (0598).

## Confidence Notes

High confidence. The changes are straightforward and clearly visible in the diff.
