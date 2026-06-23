# Commit 0571 — `784d97e5e3ed`

| Field | Value |
|-------|-------|
| Commit Hash | `784d97e5e3ed92268b8f1c6d93f02955094951da` |
| Parent Hash | `8441b2cff71bb921c49a446ba1d450c85ddd536d` |
| Author | gamertoky1188gro |
| Date | 2026-06-07 21:54:20 +0600 |
| Subject | feat: modern social-media style comment UI with avatars, threads, inline reply |

---

## High-Level Summary

Rewrites the comment UI in `PostDetailModal` with a modern social-media style: avatar circles with initials, rounded comment bubbles, inline reply input within each comment, threaded replies with expand/collapse, and a cleaner layout.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `src/components/feed/PostDetailModal.jsx` | modified | 129 | 123 |

**1 file changed, 129 insertions, 123 deletions**

---

## Detailed Diff Analysis

### `PostDetailModal.jsx`
- Added `getInitials(name)` and `avatarColors(name)` helper functions.
- Comments now render with avatar circles showing user initials on colored backgrounds.
- Changed comment layout to match social-media style: avatar left, name + text + actions right.
- Inline reply input appears inside each comment when Reply is clicked.
- Threaded replies shown with left border indent, expand/collapse for long threads.
- Comment input moved to sticky footer at bottom of comments tab.
- Empty state with icon for no comments.

---

## Why

The previous comment UI was functional but lacked visual polish. The new design mirrors modern social platforms like Facebook/LinkedIn for familiarity and engagement.

---

## Was It Useful

Yes — significant visual improvement.

---

## Impact

Medium — UI rewrite of comment system.

---

## Confidence

High.
