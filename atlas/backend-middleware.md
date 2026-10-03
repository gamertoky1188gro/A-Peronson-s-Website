# backend-middleware

- **Purpose**: Cross-cutting request guards — identity, plan gating, abuse protection, observability.
- **Key Files**: `server/middleware/auth.js`, `server/middleware/entitlements.js`, `server/middleware/rateLimiter.js`, `server/middleware/requestLogger.js`, `server/middleware/errorHandler.js`, `server/middleware/requestCapture.js`, `server/middleware/validateSearchFilters.js`, `server/middleware/adminAudit.js`, `server/middleware/adminDualConfirm.js`, `server/middleware/adminSecurity.js`, `server/middleware/adminStepUp.js`
- **Dependencies**: backend-utils, backend-log
- **Dependents**: backend-server, backend-routes
- **Exposes**: `requireAuth` (JWT + account-lock), plan/entitlement checks, per-route rate limits, structured request start/end/timeout logs (feeds flow tracker + latency histogram), admin step-up + dual-confirm + audit trail.

## Data Flow
`requestLogger` stamps `request_id`/`duration_ms` into logHub (powers Request Flow + latency percentiles); failures funnel to `errorHandler` with JSON-parse-safe logging.
