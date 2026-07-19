# Commit 0417 — `40861aa82fe`

| Field       | Value                                      |
| ----------- | ------------------------------------------ |
| Commit Hash | `40861aa82fe3e910059ec86aae187c52ef3de24d` |
| Parent Hash | `b294eb04768de80a5f8302246b89952cffb91b8a` |
| Author      | gamertoky1188gro                           |
| Date        | 2026-05-23 20:10:56 +0600                  |
| Subject     | fix: restore MAX_AI_ANSWER_CHARS constant  |

---

## High-Level Summary

Adds back the `MAX_AI_ANSWER_CHARS = 1200` constant that was also lost in the 0415 refactoring.

---

## Files Changed

| File                                  | Status   | Insertions | Deletions |
| ------------------------------------- | -------- | ---------- | --------- |
| `server/services/assistantService.js` | modified | 1          | 0         |

**1 file changed, 1 insertion**

---

## Why

The constant is used by the AI response sanitization functions.

---

## Was It Useful

Yes — prevents undefined reference errors.

---

## Impact

Small but critical.

---

## Relationships

Follow-up to 0416.

---

## Confidence

High.
