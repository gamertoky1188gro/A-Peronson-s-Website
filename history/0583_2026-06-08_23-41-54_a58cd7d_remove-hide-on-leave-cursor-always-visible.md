# Commit 0583 — `a58cd7d1977b`

| Field       | Value                                                           |
| ----------- | --------------------------------------------------------------- |
| Commit Hash | `a58cd7d1977b651eab7bae1c66909f330faa9795`                      |
| Parent Hash | `919366fd9fcead43f429713f7864a80a4067e95f`                      |
| Author      | gamertoky1188gro                                                |
| Date        | 2026-06-08 23:41:54 +0600                                       |
| Subject     | fix: remove hide-on-leave behavior, cursor stays always visible |

---

## High-Level Summary

Removes the hide-on-mouseleave/show-on-mouseenter behavior and the initial hidden state, making the cursor always visible once initialized.

---

## Files Changed

| File                                    | Status   | Insertions | Deletions |
| --------------------------------------- | -------- | ---------- | --------- |
| `src/components/ui/CyberpunkCursor.jsx` | modified | 0          | 7         |

**1 file changed, 7 deletions**

---

## Detailed Diff Analysis

### `CyberpunkCursor.jsx`

- Removed `window.addEventListener("mouseleave", ...)` and `window.addEventListener("mouseenter", ...)` hide/show.
- Removed `body.classList.add("cp-hidden")` and the one-time `mousemove` listener to remove it.

---

## Why

The hide-on-leave behavior caused the cursor to disappear when the mouse left the window, which was disorienting. Always-on is simpler.

---

## Was It Useful

Temporary — reverted in next commit.

---

## Impact

Low — event listener removal.

---

## Confidence

High.
