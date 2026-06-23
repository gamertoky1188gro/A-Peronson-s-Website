# Commit 0392 — `563d75514ec`

| Field | Value |
|-------|-------|
| Commit Hash | `563d75514ec186c186484fe51f7f8543c60dfe56` |
| Parent Hash | `e9d2615454722c4e9aa743b5cbe3e06a1f2d0084` |
| Author | gamertoky1188gro |
| Date | 2026-05-22 13:20:45 +0600 |
| Subject | fix: make HARAM_DETECTION_DIR optional so server starts without it |

---

## High-Level Summary

Changes the `HARAM_DETECTION_DIR` requirement from a hard `throw` to a warning log. Guards all AI moderation functions with `aiAvailable` checks so the server starts cleanly even when the Python AI moderation directory is not configured.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `server/services/aiModerationService.js` | modified | 13 | 2 |

**1 file changed, 11 insertions, 2 deletions**

---

## Why

The server was crashing on startup if `HARAM_DETECTION_DIR` wasn't set. This makes it optional — AI moderation is simply disabled instead of fatal.

---

## Was It Useful

Yes — fixes a server crash on new deployments.

---

## Impact

Small but important for deployability.

---

## Relationships

Fixes a regression introduced in 0387.

---

## Confidence

High.
