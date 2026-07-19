# Commit 0403 — `8bd230c1ecc`

| Field       | Value                                                      |
| ----------- | ---------------------------------------------------------- |
| Commit Hash | `8bd230c1ecc73c88699b7f9ddc96e6f79f55bfeb`                 |
| Parent Hash | `90e3d95da61439008cff7ec840e4636dd0412c0d`                 |
| Author      | gamertoky1188gro                                           |
| Date        | 2026-05-22 19:31:07 +0600                                  |
| Subject     | fix: capture opencode server stderr and full error details |

---

## High-Level Summary

Adds stderr/stdout forwarding from the opencode server process to the app's logger. Adds error response logging in `callOpencode` when the opencode API returns an error.

---

## Files Changed

| File                                  | Status   | Insertions | Deletions |
| ------------------------------------- | -------- | ---------- | --------- |
| `server/services/assistantService.js` | modified | 23         | 0         |

**1 file changed, 22 insertions, 1 deletion**

---

## Why

Debugging the opencode server — previously stderr was lost, making it impossible to diagnose startup or runtime failures.

---

## Was It Useful

Yes — critical for debugging opencode integration issues.

---

## Impact

Medium — adds extensive logging to the assistant service.

---

## Relationships

Part of opencode debugging series.

---

## Confidence

High.
