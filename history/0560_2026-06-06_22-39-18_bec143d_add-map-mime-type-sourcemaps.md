# Commit 0560 — `bec143d8e55a`

| Field       | Value                                      |
| ----------- | ------------------------------------------ |
| Commit Hash | `bec143d8e55a2a6f9a90f7818ea5e109a2758dec` |
| Parent Hash | `9a20d281e30a8c69f8a7b21b179e89b36ec89b42` |
| Author      | gamertoky1188gro                           |
| Date        | 2026-06-06 22:39:18 +0600                  |
| Subject     | fix: add .map MIME type for source maps    |

---

## High-Level Summary

Adds `.map` extension to the MIME type map in the Express static file serve to serve source map files with the correct `application/json` content type.

---

## Files Changed

| File               | Status   | Insertions | Deletions |
| ------------------ | -------- | ---------- | --------- |
| `server/server.js` | modified | 1          | 0         |

**1 file changed, 1 insertion**

---

## Detailed Diff Analysis

### `server/server.js`

- Added `".map": "application/json"` to the `MIME_TYPES` object.

---

## Why

Without the correct MIME type, browsers may fail to load source maps, showing console warnings or errors about unexpected content types.

---

## Was It Useful

Yes — fixes source map loading.

---

## Impact

Low — MIME type registration.

---

## Confidence

High.
