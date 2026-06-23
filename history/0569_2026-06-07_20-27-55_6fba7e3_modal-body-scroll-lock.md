# Commit 0569 — `6fba7e3eead0`

| Field | Value |
|-------|-------|
| Commit Hash | `6fba7e3eead0ac708fd11b3fa9bc7d9a41149875` |
| Parent Hash | `ffea1d71efd097e4e134d4ab1b8fa448a409fb35` |
| Author | gamertoky1188gro |
| Date | 2026-06-07 20:27:55 +0600 |
| Subject | fix: prevent body scroll when PostDetailModal is open |

---

## High-Level Summary

Adds body scroll locking when `PostDetailModal` is open by setting `document.body.style.overflow = "hidden"`, restoring it on close.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `src/components/feed/PostDetailModal.jsx` | modified | 10 | 1 |

**1 file changed, 10 insertions, 1 deletion**

---

## Detailed Diff Analysis

### `PostDetailModal.jsx`
- Added `useEffect` that sets `document.body.style.overflow = "hidden"` when `open` is true, and `""` on close/cleanup.
- Added `overscroll-contain` to the modal container to prevent scroll chaining.

---

## Why

Without body scroll locking, scrolling the background page while the modal is open creates a bad UX with two scrollable layers.

---

## Was It Useful

Yes — fixes background scroll issue.

---

## Impact

Low — body scroll lock effect.

---

## Confidence

High.
