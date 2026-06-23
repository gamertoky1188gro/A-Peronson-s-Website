# Commit 0552 — `c99a8c78ff4f`

| Field | Value |
|-------|-------|
| Commit Hash | `c99a8c78ff4f756dc835bb6e770435cdf018f7da` |
| Parent Hash | `b78f81a9da8bb4fa64c408624a04d916dcfd3072` |
| Author | gamertoky1188gro |
| Date | 2026-06-06 18:10:19 +0600 |
| Subject | fix: feed search 500 - avatar_url in profile JSON, not top-level column |

---

## High-Level Summary

Fixes a 500 error in feed search caused by trying to access `avatar_url` as a top-level column. The avatar is stored inside the `profile` JSON column. Also adds better error logging in `handleControllerError`.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `server/services/feedPostService.js` | modified | 2 | 2 |
| `server/utils/permissions.js` | modified | 4 | 2 |

**2 files changed, 6 insertions, 4 deletions**

---

## Detailed Diff Analysis

### `feedPostService.js`
- Changed `select: { id: true, name: true, avatar_url: true }` → `select: { id: true, name: true, profile: true }`
- Changed `avatar_url` → `profile?.avatar_url || profile?.avatar || ""`

### `permissions.js`
- `handleControllerError` now logs `console.error` with status, message, and stack trace for 500-level errors before responding.

---

## Why

Prisma schema stores `avatar_url` inside the `profile` JSON field, not as a direct column. Accessing it directly causes a database error. Better error logging helps debug future 500s.

---

## Was It Useful

Yes — fixes a production-crashing bug.

---

## Impact

Medium — bug fix that prevents 500 errors on feed search.

---

## Confidence

High.
