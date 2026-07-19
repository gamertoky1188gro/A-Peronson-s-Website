# Commit 0585 — `6d6bfd888567`

| Field       | Value                                                            |
| ----------- | ---------------------------------------------------------------- |
| Commit Hash | `6d6bfd8885677adb8e9209d9e6203c5278593512`                       |
| Parent Hash | `5b05b005c785c075fcb594e6ab50fc5a39ddf559`                       |
| Author      | gamertoky1188gro                                                 |
| Date        | 2026-06-09 00:17:26 +0600                                        |
| Subject     | fix: use document mouseleave/mouseout for reliable hide-on-leave |

---

## High-Level Summary

Improves hide-on-leave reliability by using `document` level events (`mouseleave`, `mouseenter`, `mouseout`) instead of `window` events, and refactors event listeners with named functions for better cleanup.

---

## Files Changed

| File                                    | Status   | Insertions | Deletions |
| --------------------------------------- | -------- | ---------- | --------- |
| `src/components/ui/CyberpunkCursor.jsx` | modified | 39         | 12        |

**1 file changed, 39 insertions, 12 deletions**

---

## Detailed Diff Analysis

### `CyberpunkCursor.jsx`

- Refactored all event listeners to use named function references (e.g., `onResize`, `onMouseMove`, `onLeave`).
- Changed `window.addEventListener("mouseleave")` → `document.addEventListener("mouseleave")`.
- Changed `window.addEventListener("mouseenter")` → `document.addEventListener("mouseenter")`.
- Added `document.addEventListener("mouseout", onLeaveDoc)` that checks `!e.relatedTarget && !e.toElement` for reliable leave detection.
- Properly cleans up all listeners in the return function.

---

## Why

`window` mouseleave events are not reliable across browsers, especially when the mouse moves over iframes or other embedded elements. `document`-level events with relatedTarget check are more robust.

---

## Was It Useful

Yes — more reliable cursor hiding.

---

## Impact

Medium — event listener refactor.

---

## Confidence

High.
