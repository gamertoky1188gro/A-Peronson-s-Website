# backend-server

- **Purpose**: Express 5 boot — middleware chain, 60+ route mounts, WS upgrade routing (assistant + `/ws/logs`), TUI auto-launch, graceful shutdown.
- **Key Files**: `server/server.js`, `server/check-user.js`, `server/setupLlama.js`, `server/config/*`, `server/database/admin_audit.json`
- **Dependencies**: backend-routes, backend-middleware, backend-realtime, backend-log, backend-utils
- **Dependents**: (none — backend entry)
- **Exposes**: HTTP API on `/api/*`, WS endpoints, static SEO files, `/api/logs/*` + `/ws/logs`, runtime metrics polling into logHub.

## Data Flow
`requestLogger` (emits structured start/end with `request_id` + `duration_ms`) → route modules → errorHandler; `noServer` upgrade splits assistant WS vs logs WS; on listen, `maybeAutoLaunchLogTui()` spawns terminal dashboard (opt-out `LOG_TUI_AUTO=0`).
