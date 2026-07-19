# Commit 0411 — `1c6a7af724c`

| Field       | Value                                      |
| ----------- | ------------------------------------------ |
| Commit Hash | `1c6a7af724cb3840febc534f9fe8ca2ec9f49ccb` |
| Parent Hash | `cb2de9324826f3f19d42aac973ba553bde939d54` |
| Author      | gamertoky1188gro                           |
| Date        | 2026-05-22 22:37:08 +0600                  |
| Subject     | fix: guest session title                   |

---

## High-Level Summary

Changes session title from `"user-null"` to `"guest"` when `userId` is null.

---

## Files Changed

| File                                  | Status   | Insertions | Deletions |
| ------------------------------------- | -------- | ---------- | --------- |
| `server/services/assistantService.js` | modified | 2          | 0         |

**1 file changed, 1 insertion, 1 deletion**

---

## Why

Guest sessions were being titled `"user-null"`. This fixes it to `"guest"`.

---

## Was It Useful

Small cosmetic fix.

---

## Impact

Negligible.

---

## Relationships

Follow-up to 0410's guest session feature.

---

## Confidence

High.
