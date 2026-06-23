# Commit 0572 — `aea8da324478`

| Field | Value |
|-------|-------|
| Commit Hash | `aea8da324478df153d8f5f3a61af45a190fbee6a` |
| Parent Hash | `784d97e5e3ed92268b8f1c6d93f02955094951da` |
| Author | gamertoky1188gro |
| Date | 2026-06-07 22:06:58 +0600 |
| Subject | fix: CSP-compliant font loading, enrich comment actor names from user table |

---

## High-Level Summary

Two fixes: Google Fonts now load via JS assignment (bypasses CSP inline-style restriction that broke the `onload` approach), and the social service enriches comment actor names from the `user` table when they're missing.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `index.html` | modified | 4 | 1 |
| `server/services/socialService.js` | modified | 14 | 0 |
| `src/components/feed/PostDetailModal.jsx` | modified | 4 | 2 |

**3 files changed, 22 insertions, 3 deletions**

---

## Detailed Diff Analysis

### `index.html`
- Changed font loading from `onload="this.rel='stylesheet'"` to using `<script>` that does `document.getElementById("gfont-preload").rel = "stylesheet"` — the inline `onload` was blocked by CSP `'unsafe-inline'` restriction on `script-src`.

### `socialService.js`
- After fetching comments, checks for any with empty `actor_name` but non-null `actor_id`.
- Looks up those user IDs in the `user` table and fills in missing names.

### `PostDetailModal.jsx`
- Minor improvements to `getInitials`: returns "U" instead of "?" for empty names, better multi-word handling.

---

## Why

CSP was blocking the `onload` inline event handler. Comment actor names were sometimes null when stored without denormalized name data.

---

## Was It Useful

Yes — fixes font loading and comment display.

---

## Impact

Low — font loading fix + data enrichment.

---

## Confidence

High.
