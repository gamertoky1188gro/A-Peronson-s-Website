# Commit 0568 — `ffea1d71efd0`

| Field | Value |
|-------|-------|
| Commit Hash | `ffea1d71efd097e4e134d4ab1b8fa448a409fb35` |
| Parent Hash | `7c90f289c109f595e2dc2168161f6b6052afe9a1` |
| Author | gamertoky1188gro |
| Date | 2026-06-07 20:12:39 +0600 |
| Subject | feat: Facebook-style post detail modal with Post + Comments tabs |

---

## High-Level Summary

Creates a `PostDetailModal` component that replaces the `CommentsDrawer`. It's a centered modal with two tabs: "Post" (showing full post preview) and "Comments" (with threaded comments, reply support, and inline comment input). The modal includes share and report buttons.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `src/components/feed/PostDetailModal.jsx` | new | 379 | 0 |
| `src/pages/MainFeed.jsx` | modified | 3 | 2 |

**2 files changed, 382 insertions, 2 deletions**

---

## Detailed Diff Analysis

### `PostDetailModal.jsx`
- Full-featured modal with Post tab (shows `PostPreview` component) and Comments tab.
- Comments: threaded tree view with expand/collapse, inline reply input, user mentions.
- Fetches comments from `/social/:entityType/:entityId` API.
- Post, Share, Report action buttons.
- Sticky header with author info and close button.
- Scrollable content area with `max-h-[90vh]`.

### `MainFeed.jsx`
- Replaced `CommentsDrawer` import/usage with `PostDetailModal`.

---

## Why

The old CommentsDrawer was a slide-in panel. A centered modal with tabs provides a richer, Facebook-style experience for viewing posts and comments together.

---

## Was It Useful

Yes — major UX upgrade for post interaction.

---

## Impact

Large — new 379-line modal component.

---

## Confidence

High.
