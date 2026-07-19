# Commit 0574 — `f020c7c3ed70`

| Field       | Value                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| Commit Hash | `f020c7c3ed700cd8787c1e792a5755b365389150`                                                              |
| Parent Hash | `805582f59b843a1b8b31f79ba713f49202e31d5b`                                                              |
| Author      | gamertoky1188gro                                                                                        |
| Date        | 2026-06-08 14:34:12 +0600                                                                               |
| Subject     | fix: use company_id/buyer_id for profile links, pass viewer to feed listProducts, absolute favicon path |

---

## High-Level Summary

Three fixes: profile links in search results now use `company_id`/`buyer_id` instead of `id`, the feed service passes viewer context to `listProducts`, and favicon path changed to absolute `/vite.svg`.

---

## Files Changed

| File                             | Status   | Insertions | Deletions |
| -------------------------------- | -------- | ---------- | --------- |
| `index.html`                     | modified | 1          | 1         |
| `server/services/feedService.js` | modified | 1          | 1         |
| `src/pages/SearchResults.jsx`    | modified | 4          | 4         |

**3 files changed, 6 insertions, 6 deletions**

---

## Detailed Diff Analysis

### `SearchResults.jsx`

- Changed all `to={\`/buyer/${item.id}\`}` → `to={\`/buyer/${item.buyer_id}\`}`
- Changed `to={\`/factory/${item.id}\`}` → `to={\`/factory/${item.company_id}\`}`

### `feedService.js`

- Now passes `viewerId: viewer?.id, viewerRole: viewer?.role` to `listProducts()`.

### `index.html`

- Changed `<link rel="icon" href="./vite.svg">` → `href="/vite.svg"` (absolute path).

---

## Why

Search results were linking to wrong profile URLs (using internal `id` instead of the business `company_id`/`buyer_id`). Feed products need viewer context for permissions.

---

## Was It Useful

Yes — fixes broken profile links.

---

## Impact

Medium — fixes broken navigation links.

---

## Confidence

High.
