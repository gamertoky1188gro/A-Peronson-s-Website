# backend-server

- **Parent**: (none — backend entry point)
- **Purpose**: Express 5 boot — middleware chain, 57 route mounts, WS upgrade routing (assistant + `/ws/logs`), TUI auto-launch, graceful shutdown.
- **Key Files**: `server/server.js`, `server/check-user.js`, `server/setupLlama.js`, `server/config/searchAccessConfig.js`, `server/seo/botMeta.js`, `server/database/admin_audit.json`
- **Dependencies**: backend-routes, backend-middleware, backend-realtime, backend-log, backend-utils, backend-sync
- **Dependents**: (none — backend entry)
- **Exposes**: HTTP API on `/api/*`, WS endpoints, static SEO files, `/api/logs/*` + `/ws/logs`, `/health`, runtime metrics polling into logHub.

## Data Flow
`requestCapture` → `requestLogger` (emits structured start/end with `request_id` + `duration_ms`) → route modules → `errorHandler`; `noServer` upgrade splits assistant WS vs logs WS; on listen, `maybeAutoLaunchLogTui()` spawns the terminal dashboard (opt-out `LOG_TUI_AUTO=0`, forced off in production unless `LOG_TUI_AUTO=1`). Server also polls redis + worker/queue depths into `logHub.setRuntimeMetrics()` every 5s. `/api/sync` mounts at line ~376; helmet's CSP header is stripped via `res.removeHeader("content-security-policy")`.

## Gotchas
- Auto-launch on Windows passes the bat path to `cmd /c start` **unquoted** — embedded quotes become `\"` which cmd mis-parses and the bat silently never runs.
- The auto-launch log line must use `->`, not `→` (cmd OEM code page mangles the arrow into a control char that pollutes stored entries).
- Bootstrap order matters: `app.use("/uploads", express.static(uploadsRoot))` precedes route mounts.