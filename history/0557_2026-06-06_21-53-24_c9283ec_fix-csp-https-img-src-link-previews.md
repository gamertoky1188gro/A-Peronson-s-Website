# Commit 0557 — `c9283eceb0d9`

| Field | Value |
|-------|-------|
| Commit Hash | `c9283eceb0d9b1abff412143c6d0ddae34c3c2cc` |
| Parent Hash | `5828227e33440b39b236f290469047ea7d6416ad` |
| Author | gamertoky1188gro |
| Date | 2026-06-06 21:53:24 +0600 |
| Subject | fix CSP: add https: to img-src for link preview images |

---

## High-Level Summary

Adds `https:` to the Content-Security-Policy `img-src` directive in both `index.html` (meta tag) and `server.js` (helmet config) to allow loading link preview images from external HTTPS sources.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `.husky/pre-commit.bak` | deleted | 0 | 37 |
| `index.html` | modified | 1 | 1 |
| `server/server.js` | modified | 1 | 1 |

**3 files changed, 2 insertions, 38 deletions**

---

## Detailed Diff Analysis

### `index.html`
- Added `https:` to `img-src` CSP directive.

### `server/server.js`
- Added `"https:"` to helmet's `imgSrc` array.

### `.husky/pre-commit.bak`
- Deleted (was accidentally committed in 555).

---

## Why

Link preview images are fetched from external HTTPS URLs. CSP was blocking them, causing images not to render in link preview cards.

---

## Was It Useful

Yes — fixes broken link preview images.

---

## Impact

Low — CSP permission addition.

---

## Confidence

High.
