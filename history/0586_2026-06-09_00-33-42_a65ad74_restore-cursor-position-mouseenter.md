# Commit 0586 — `a65ad743864d`

| Field | Value |
|-------|-------|
| Commit Hash | `a65ad743864d8e5a0624c6b786a612bd40dc6f78` |
| Parent Hash | `6d6bfd8885677adb8e9209d9e6203c5278593512` |
| Author | gamertoky1188gro |
| Date | 2026-06-09 00:33:42 +0600 |
| Subject | fix: on mouseenter, restore cursor position from event coords; set state.visible; remove duplicate setup block |

---

## High-Level Summary

Improves the mouseenter handler to restore cursor position from the event coordinates, sets `state.visible`, and removes a duplicate setup block that was causing double initialization.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `src/components/ui/CyberpunkCursor.jsx` | modified | 19 | 20 |

**1 file changed, 19 insertions, 20 deletions**

---

## Detailed Diff Analysis

### `CyberpunkCursor.jsx`
- `onLeave` now also sets `state.visible = false`.
- `onEnter` now sets `state.visible = true`, restores cursor position from `e.clientX/clientY`, and syncs `px/py` for interpolation.
- `onLeaveDoc` also sets `state.visible = false`.
- Removed duplicate setup block at the end of the effect (the second `document.addEventListener`, `body.classList.add`, and `animate()` call — the code before the refactor had two setup blocks, one of which was dead code).

---

## Why

When re-entering the document, the cursor position was stale (at last known position) until the user moved the mouse, causing a visible jump. Restoring from `e.clientX/clientY` fixes this. Removing duplicate code prevents double event listeners.

---

## Was It Useful

Yes — fixes cursor position jump on re-entry.

---

## Impact

Low — bug fix + dead code removal.

---

## Confidence

High.
