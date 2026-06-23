# Commit 0551 — `b78f81a9da8b`

| Field | Value |
|-------|-------|
| Commit Hash | `b78f81a9da8bb4fa64c408624a04d916dcfd3072` |
| Parent Hash | `20ff8cc7fb4da7ab311f07820d226d6404c27a66` |
| Author | gamertoky1188gro |
| Date | 2026-06-06 17:40:27 +0600 |
| Subject | fix: replace fallback_json engine with database (Prisma fallback) |

---

## High-Level Summary

Changes the OpenSearch fallback engine label from `"fallback_json"` to `"database"` in 5 locations across 3 server files when OpenSearch is unavailable or errors.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `server/controllers/productController.js` | modified | 1 | 1 |
| `server/controllers/requirementController.js` | modified | 1 | 1 |
| `server/services/openSearchService.js` | modified | 3 | 3 |

**3 files changed, 5 insertions, 5 deletions**

---

## Detailed Diff Analysis

### `productController.js` & `requirementController.js`
- Changed `osEngine = openSearchResult?.engine || "fallback_json"` → `"database"`

### `openSearchService.js`
- Three return paths (not configured, no client, OpenSearch error) all changed from `"fallback_json"` to `"database"`.

---

## Why

The term "fallback_json" was misleading — the actual fallback uses Prisma (database queries), not JSON files. Renaming clarifies the real behavior.

---

## Was It Useful

Yes — improves accuracy of search engine reporting.

---

## Impact

Low — string label change only.

---

## Confidence

High.
