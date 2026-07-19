# Commit 0409 — `8bfe21a28ac`

| Field       | Value                                                            |
| ----------- | ---------------------------------------------------------------- |
| Commit Hash | `8bfe21a28aca957a783e024f9719e957d02260fb`                       |
| Parent Hash | `3245ed576e72d5d2659b69333d6a1e810f4b601e`                       |
| Author      | gamertoky1188gro                                                 |
| Date        | 2026-05-22 21:38:52 +0600                                        |
| Subject     | refactor: use opencode serve subprocess to capture internal logs |

---

## High-Level Summary

Major refactor of `ensureOpencodeServer()` — replaces `createOpencode()` SDK call with spawning a direct `opencode serve` subprocess using `child_process.spawn`. This captures the server's stdout/stderr directly. Adds polling-based health check (`checkOpencodeRunning`) with 20s timeout instead of a fixed 2s sleep.

---

## Files Changed

| File                                  | Status   | Insertions | Deletions |
| ------------------------------------- | -------- | ---------- | --------- |
| `server/services/assistantService.js` | modified | 76         | 0         |

**1 file changed, 43 insertions, 33 deletions**

---

## Detailed Changes

- Imports `spawn` from `child_process` (new), removes `createOpencode` import
- Replaces `createOpencode({ hostname, port, timeout })` with `spawn("opencode", ["serve", "--port", port, "--hostname", "127.0.0.1"])` with `OPENCODE_LOG_LEVEL=DEBUG` in env
- Captures `child.stderr.on("data")` and `child.stdout.on("data")` for logging
- Adds `child.on("exit")` handler that nulls `opencodePort` on unexpected exit
- Adds 20s polling-based startup detection instead of fixed 2s timeout
- Stores the child process in `opencodeServer` instead of the SDK object

---

## Why

The SDK's `createOpencode()` didn't expose internal server logs. By spawning the CLI directly, all stdout/stderr is captured and logged, making debugging possible.

---

## Was It Useful

Very — enables debugging of the opencode server which was otherwise a black box.

---

## Impact

Medium. Significant refactor of the server startup logic.

---

## Relationships

Part of opencode debugging/integration series.

---

## Confidence

High.
