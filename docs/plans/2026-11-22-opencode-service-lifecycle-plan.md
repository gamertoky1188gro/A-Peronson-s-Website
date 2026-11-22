# Plan: Eliminate the orphan-server problem with `@opencode/client/service`

Date: 2026-11-22 · Status: **plan only** (not implemented in this batch)

## Problem

Both the assistant (`assistantService.js` → `ensureOpencodeServer()`) and the
investigation runtime (`investigation/opencodeRuntime.js` →
`startInvestigationRuntime()`) hand-roll process management: find a free port
in 4200–4299, spawn `opencode serve --port <n>`, poll `/api/model`, and kill a
held `child` reference on shutdown. When the parent is `SIGKILL`ed the `finally`
never runs, leaving orphan `opencode serve --port 42xx` processes (we removed
24 of them on 2026-11-22). There is no version check and no shared registry —
two callers can each spawn their own server.

## Available API (verified against installed `@opencode/client` 2.0.32)

`@opencode/client/service` exports `Service.discover()`, `Service.ensure()`,
`Service.stop()`, `Service.headers(endpoint)`. Types:

- `DiscoverOptions/EnsureOptions`: `file?` (absolute registration file, XDG
  default), `version?: string | ((v: string) => boolean)`.
- `EnsureOptions` adds `command?` (default `opencode serve --service`), `env?`,
  `cwd?`; returns an `Endpoint { url, auth?: { type: "basic", username,
  password } }`.
- `Service.headers(endpoint)` builds the auth headers for the endpoint.

`@opencode/sdk` (in-process, `OpenCode.create()` + `await using`) exists on npm
(2.3.2) but is **not installed** and would be a larger rewrite.

## Quick win (recommended first step)

Adopt `Service` for the assistant, preserving the isolation we spent items
22/23/26/31 building:

1. **Dedicated registration file**, not the shared XDG path — otherwise
   `Service.ensure()` could attach to the operator's own unrestricted server.
   Use e.g. `path.join(os.tmpdir(), "gartexhub-opencode-<uid>.json")` (on Linux
   prefer `/tmp/opencode`, which is pre-created and approved).
2. **Version predicate**: `version: (v) => v.startsWith("2.")` so a stale v1
   server is never reused.
3. **Restricted spawn**: pass our resolved v2 binary via `command`, and pass
   `buildAssistantRuntimeEnv({ password })` via `env` so the MCP credentials and
   password isolation stay intact. `cwd` = `REPOSITORY_ROOT`.
4. Use `Service.headers(endpoint)` for the client's fetch wrapper instead of
   hand-built Basic auth; `opencodeV2Client` already rebuilds a `Headers`
   instance, so the auth header just gets set there.
5. Replace `warmOpencodeServer()` / idle-stop / back-off with
   `Service.ensure()` at the top of `getRunningOpencodeClient()`, and
   `Service.stop({ file })` on graceful shutdown. Keep the bounded back-off so
   a cold service is not respawned on every request.
6. Investigations: keep the per-case runtime for now, but route its spawn
   through `Service.ensure()` with a **per-case registration file** so
   `Service.stop({ file })` gives exact-instance shutdown (the current `child`
   ref already does this on the graceful path; `Service` makes a crash leave a
   discoverable, stoppable registration instead of an anonymous orphan).

**Acceptance:** no manual port allocation in either call site; `Service.stop()`
removes the registration file; a killed parent leaves a discoverable service
that a later `stop` can reap; no test that mocks the spawn helpers regresses.

## Big win (separate decision)

Install `@opencode/sdk` and host OpenCode in-process (`await using`), deleting
the spawn/port/child code entirely. This kills the orphan PID class outright
— no HTTP listener, no port management — but rewrites `opencodeRuntime.js`,
`investigationQueue.js`, `assistantService.js` and every test that mocks those
helpers. Needs its own focused batch and a fresh live spike.

## Out of scope

Plugin-side features (tool lifecycle hooks, retry hook, references) are covered
by `.opencode/plugins/gartexhub-support/index.mjs` in this batch and are
unrelated to service discovery.
