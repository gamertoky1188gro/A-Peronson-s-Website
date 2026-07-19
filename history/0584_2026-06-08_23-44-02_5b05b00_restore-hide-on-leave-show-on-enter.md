# Commit 0584 — `5b05b005c785`

| Field       | Value                                               |
| ----------- | --------------------------------------------------- |
| Commit Hash | `5b05b005c785c075fcb594e6ab50fc5a39ddf559`          |
| Parent Hash | `a58cd7d1977b651eab7bae1c66909f330faa9795`          |
| Author      | gamertoky1188gro                                    |
| Date        | 2026-06-08 23:44:02 +0600                           |
| Subject     | fix: restore hide-on-leave / show-on-enter behavior |

---

## High-Level Summary

Restores the hide-on-mouseleave/show-on-mouseenter behavior that was removed in the previous commit, plus the initial hidden state with first-move reveal.

---

## Files Changed

| File                                    | Status   | Insertions | Deletions |
| --------------------------------------- | -------- | ---------- | --------- |
| `src/components/ui/CyberpunkCursor.jsx` | modified | 7          | 0         |

**1 file changed, 7 insertions**

---

## Detailed Diff Analysis

### `CyberpunkCursor.jsx`

- Re-added `window.addEventListener("mouseleave", ...)` and `window.addEventListener("mouseenter", ...)` hide/show.
- Re-added `body.classList.add("cp-hidden")` and the one-time `mousemove` listener.

---

## Why

The hide-on-leave behavior prevents the cursor from appearing on screenshots, videos, or when the user is not actively using the mouse.

---

## Was It Useful

Yes — restores needed feature.

---

## Impact

Low — restoration of removed code.

---

## Confidence

High.
