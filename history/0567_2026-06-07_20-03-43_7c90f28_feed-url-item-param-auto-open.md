# Commit 0567 — `7c90f289c109`

| Field | Value |
|-------|-------|
| Commit Hash | `7c90f289c109f595e2dc2168161f6b6052afe9a1` |
| Parent Hash | `89ee7a4b07bb9506d5396cd5cc4ecd462ec63663` |
| Author | gamertoky1188gro |
| Date | 2026-06-07 20:03:43 +0600 |
| Subject | fix: auto-open CommentsDrawer when feed URL has ?item= param |

---

## High-Level Summary

Adds a `useEffect` that watches the URL's `?item=` parameter and automatically opens the comments/post detail modal when a matching feed item is found.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `src/pages/MainFeed.jsx` | modified | 6 | 0 |

**1 file changed, 6 insertions**

---

## Detailed Diff Analysis

### `MainFeed.jsx`
- Added `useEffect` dependency on `highlightKey` and `items`.
- When `highlightKey` matches an item, sets `commentsItem` to that item, opening the comments drawer.

---

## Why

Users should be able to share direct links to specific feed items. The `?item=entityType:id` param now auto-opens the detail view.

---

## Was It Useful

Yes — enables deep-linking to feed posts.

---

## Impact

Low — effect to handle URL param.

---

## Confidence

High.
