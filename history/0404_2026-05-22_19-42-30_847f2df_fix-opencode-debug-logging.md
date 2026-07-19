# Commit 0404 — `847f2df5a67`

| Field       | Value                                                             |
| ----------- | ----------------------------------------------------------------- |
| Commit Hash | `847f2df5a674d19842c10038d0725af631098836`                        |
| Parent Hash | `8bd230c1ecc73c88699b7f9ddc96e6f79f55bfeb`                        |
| Author      | gamertoky1188gro                                                  |
| Date        | 2026-05-22 19:42:30 +0600                                         |
| Subject     | fix: add opencode server object debug logging and DEBUG log level |

---

## High-Level Summary

Adds `logLevel: "DEBUG"` to the opencode server config. Logs the keys of the opencode server object for debugging. Fixes process access to work with both `opencode.server.process` and `opencode.process` structures.

---

## Files Changed

| File                                  | Status   | Insertions | Deletions |
| ------------------------------------- | -------- | ---------- | --------- |
| `server/services/assistantService.js` | modified | 16         | 0         |

**1 file changed, 12 insertions, 4 deletions**

---

## Why

The opencode server object structure was unclear — adding debug logging helps understand the API shape. DEBUG log level provides more detailed internal logs.

---

## Was It Useful

Yes — aids in debugging the opencode SDK integration.

---

## Impact

Small — adds debug logging.

---

## Relationships

Part of opencode debugging series.

---

## Confidence

High.
