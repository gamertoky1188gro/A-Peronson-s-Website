# Commit 0570 — `8441b2cff71b`

| Field       | Value                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------- |
| Commit Hash | `8441b2cff71bb921c49a446ba1d450c85ddd536d`                                                   |
| Parent Hash | `6fba7e3eead0ac708fd11b3fa9bc7d9a41149875`                                                   |
| Author      | gamertoky1188gro                                                                             |
| Date        | 2026-06-07 21:36:07 +0600                                                                    |
| Subject     | fix: modal scroll containment - use overflow hidden on overlay, inner content handles scroll |

---

## High-Level Summary

Changes the modal's outer container from `overflow-y-auto` to `overflow: hidden` on the overlay, letting the inner content areas handle their own scrolling independently.

---

## Files Changed

| File                                      | Status   | Insertions | Deletions |
| ----------------------------------------- | -------- | ---------- | --------- |
| `src/components/feed/PostDetailModal.jsx` | modified | 1          | 1         |

**1 file changed, 1 insertion, 1 deletion**

---

## Detailed Diff Analysis

### `PostDetailModal.jsx`

- Changed: from `className="... overflow-y-auto pt-4 pb-4 sm:pt-10"` to `className="... pt-4 pb-4 sm:pt-10"` with inline `style={{ overflow: "hidden" }}`.

---

## Why

Scrolling the entire overlay container caused the modal header to scroll out of view. By hiding overflow on the overlay and letting each tab's content area scroll independently, the modal stays properly contained.

---

## Was It Useful

Yes — fixes scroll behavior in modal.

---

## Impact

Low — CSS containment fix.

---

## Confidence

High.
