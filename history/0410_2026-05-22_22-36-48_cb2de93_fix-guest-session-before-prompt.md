# Commit 0410 — `cb2de932482`

| Field       | Value                                                            |
| ----------- | ---------------------------------------------------------------- |
| Commit Hash | `cb2de9324826f3f19d42aac973ba553bde939d54`                       |
| Parent Hash | `8bfe21a28aca957a783e024f9719e957d02260fb`                       |
| Author      | gamertoky1188gro                                                 |
| Date        | 2026-05-22 22:36:48 +0600                                        |
| Subject     | fix: create guest session before prompting to avoid UnknownError |

---

## High-Level Summary

Fixes a crash when prompting without a session — now creates a guest session (with `null` userId) via `createUserOpencodeSession(null)` before calling the API. Also removes the early return in `createUserOpencodeSession` when `userId` is null.

---

## Files Changed

| File                                  | Status   | Insertions | Deletions |
| ------------------------------------- | -------- | ---------- | --------- |
| `server/services/assistantService.js` | modified | 6          | 0         |

**1 file changed, 2 insertions, 4 deletions**

---

## Why

Calling the opencode API without first creating a session caused an `UnknownError`. Guest sessions (no user login required) now always get a session created first.

---

## Was It Useful

Yes — fixes a crash during unauthenticated AI queries.

---

## Impact

Medium — changes session creation flow.

---

## Relationships

Part of opencode integration.

---

## Confidence

High.
