# backend-utils

- **Parent**: (none — under `server/`)
- **Purpose**: Shared server primitives — DB clients, caching, logging facade, validation, session/file stores, hypercache hash helpers.
- **Key Files**: `server/utils/prisma.js`, `db.js`, `redis.js`, `logger.js`, `validators.js`, `permissions.js`, `privacy.js`, `sessionStore.js`, `localStore.js`, `metrics.js`, `svgSanitizer.js`, `hypercache.js`, `hallucinationDetector.js`, `auditStore.js`, `crmFallbackStore.js`, `dotenv.js`, `pendingInvites.js`, `server/schemas/searchFilters.schema.json`, `server/config/searchAccessConfig.js`
- **Dependencies**: data-prisma
- **Dependents**: backend-server, backend-controllers, backend-services, backend-middleware, backend-log, backend-workers, backend-sync
- **Exposes**: Singleton Prisma client, Redis client, `logInfo/logWarn/logError/logDebug/logSuccess/logCritical`, input validators, RBAC permission checks, privacy redaction, session/pending-invite stores, search-filter schema, `hallucinationDetector`, and hypercache pure helpers (`stableStringify`, `computeHash`, `buildSyncHead`, `buildInvalidatePayload`, `sortDeltaBySeq`, `needsReset`, `outboxInsert`).

## Notes
- `hypercache.js` (76 lines, stateless/unit-tested) is the server mirror of client `hash.js` + `outbox.js`. It is **imported by no server file** — it exists as a shared, testable reference (`tests/unit/server-hypercache.test.js`). Actual persistence is the Prisma `SyncChange` ledger.