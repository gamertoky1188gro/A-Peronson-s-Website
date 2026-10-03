# backend-utils

- **Purpose**: Shared server primitives — DB clients, caching, logging facade, validation, session/file stores.
- **Key Files**: `server/utils/prisma.js`, `server/utils/db.js`, `server/utils/redis.js`, `server/utils/logger.js`, `server/utils/validators.js`, `server/utils/permissions.js`, `server/utils/privacy.js`, `server/utils/sessionStore.js`, `server/utils/localStore.js`, `server/utils/metrics.js`, `server/utils/svgSanitizer.js`, `server/schemas/searchFilters.schema.json`, `server/config/searchAccessConfig.js`
- **Dependencies**: data-prisma
- **Dependents**: backend-server, backend-controllers, backend-services, backend-middleware, backend-log, backend-workers
- **Exposes**: Singleton Prisma client, Redis client, `logInfo/logWarn/logError/logDebug/logSuccess/logCritical`, input validators, RBAC permission checks, privacy redaction, session/pending-invite stores, search-filter schema.
