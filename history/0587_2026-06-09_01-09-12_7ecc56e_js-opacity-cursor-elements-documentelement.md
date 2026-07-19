# Commit 0587 — `7ecc56e5c02b`

| Field       | Value                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Commit Hash | `7ecc56e5c02b58fc19843c111c750c9214424da6`                                                                        |
| Parent Hash | `a65ad743864d8e5a0624c6b786a612bd40dc6f78`                                                                        |
| Author      | gamertoky1188gro                                                                                                  |
| Date        | 2026-06-09 01:09:12 +0600                                                                                         |
| Subject     | fix: replace CSS cp-hidden with direct JS opacity control on cursor elements; use documentElement for leave/enter |

---

## High-Level Summary

Replaces the CSS `.cp-hidden` class approach with direct JS opacity manipulation on cursor elements. Switches from `document` to `document.documentElement` for leave/enter events. Removes the `body, body * { cursor: none !important; }` CSS rule.

---

## Files Changed

| File                                    | Status   | Insertions | Deletions |
| --------------------------------------- | -------- | ---------- | --------- |
| `src/components/ui/CyberpunkCursor.jsx` | modified | 15         | 24        |

**1 file changed, 15 insertions, 24 deletions**

---

## Detailed Diff Analysis

### `CyberpunkCursor.jsx`

- Created `cursorEls = [core, ring, glow, dot, spinner]` array.
- Added `setCursorVisible(visible)` function that directly sets `el.style.opacity = "1"` or `"0"` on all cursor elements.
- Replaced `body.classList.add("cp-hidden")` → `setCursorVisible(false)`.
- Replaced `body.classList.remove("cp-hidden")` → `setCursorVisible(true)`.
- Changed `document.addEventListener("mouseleave")` → `document.documentElement.addEventListener("mouseleave")`.
- Changed `document.addEventListener("mouseenter")` → `document.documentElement.addEventListener("mouseenter")`.
- Removed the `onLeaveDoc` (mouseout) handler.
- Removed `body, body * { cursor: none !important; }` from injected CSS.
- Cleanup now resets `el.style.opacity` to empty string.

---

## Why

CSS class-based visibility was unreliable with the `body, body * { cursor: none }` rule. Direct JS opacity control is more deterministic. `documentElement` mouseleave/enter fires more reliably than `document` equivalents. Removing the aggressive CSS cursor rule lets individual element cursors work where needed.

---

## Was It Useful

Yes — more reliable cursor visibility control.

---

## Impact

Medium — refactor of visibility mechanism.

---

## Confidence

High.
