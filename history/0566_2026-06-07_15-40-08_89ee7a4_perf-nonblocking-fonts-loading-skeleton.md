# Commit 0566 — `89ee7a4b07bb`

| Field       | Value                                                                                  |
| ----------- | -------------------------------------------------------------------------------------- |
| Commit Hash | `89ee7a4b07bb9506d5396cd5cc4ecd462ec63663`                                             |
| Parent Hash | `06d73b6feab2ee4d697867416aa9cae4ed2b4bac`                                             |
| Author      | gamertoky1188gro                                                                       |
| Date        | 2026-06-07 15:40:08 +0600                                                              |
| Subject     | perf: non-blocking Google Fonts, add root loading skeleton, disable sourcemaps in prod |

---

## High-Level Summary

Three performance improvements: Google Fonts loading is now non-blocking (preload + JS-switched stylesheet), a loading spinner skeleton is shown in `#root` until React hydrates, and sourcemaps are disabled in production builds.

---

## Files Changed

| File             | Status   | Insertions | Deletions |
| ---------------- | -------- | ---------- | --------- |
| `index.html`     | modified | 15         | 2         |
| `vite.config.js` | modified | 2          | 2         |

**2 files changed, 15 insertions, 4 deletions**

---

## Detailed Diff Analysis

### `index.html`

- Google Fonts link changed from blocking `<link rel="stylesheet">` to `<link rel="preload" as="style" ... onload="...rel='stylesheet'">` with `<noscript>` fallback.
- Added inline loading skeleton HTML inside `#root` with spinner animation and dark mode support via `@media(prefers-color-scheme:dark)`.

### `vite.config.js`

- Changed `reportCompressedSize: true` → `false`.
- Changed `sourcemap: true` → `process.env.NODE_ENV !== "production"`.

---

## Why

Blocking font loading delays page rendering. The loading skeleton gives visual feedback during JS bundle loading. Disabling sourcemaps in prod reduces bundle size.

---

## Was It Useful

Yes — improves perceived load time and bundle size.

---

## Impact

Medium — non-blocking fonts and loading state.

---

## Confidence

High.
