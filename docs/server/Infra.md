# Infrastructure Management

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/infra` -> `server/routes/infraRoutes.js:15` (router var: `router`)

## Routes (ultra-detailed)

### GET `/api/infra/overview`

- **Route definition:** `server/routes/infraRoutes.js:17`
- **Middleware:** requireAuth, requireAdminSecurity, adminAuditLogger
- **Handler:** `infraOverview`
- **Access:** Admin only

### GET `/api/infra/processes`

- **Route definition:** `server/routes/infraRoutes.js:24`
- **Middleware:** requireAuth, requireAdminSecurity, adminAuditLogger
- **Handler:** `infraProcesses`
- **Access:** Admin only

### GET `/api/infra/services`

- **Route definition:** `server/routes/infraRoutes.js:31`
- **Middleware:** requireAuth, requireAdminSecurity, adminAuditLogger
- **Handler:** `infraServices`
- **Access:** Admin only

### GET `/api/infra/storage`

- **Route definition:** `server/routes/infraRoutes.js:38`
- **Middleware:** requireAuth, requireAdminSecurity, adminAuditLogger
- **Handler:** `infraStorage`
- **Access:** Admin only

### GET `/api/infra/state`

- **Route definition:** `server/routes/infraRoutes.js:45`
- **Middleware:** requireAuth, requireAdminSecurity, adminAuditLogger
- **Handler:** `infraState`
- **Access:** Admin only

### POST `/api/infra/actions`

- **Route definition:** `server/routes/infraRoutes.js:52`
- **Middleware:** requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger
- **Handler:** `infraAction`
- **Access:** Admin only (step-up auth required)
- **Actions:** service restart/stop/start, process kill, backup, package management, OS users, SSL certs, command execution

---

## Service Layer

- **Infra Service:** `server/services/infraService.js`

---

_Generated from source: server/routes/infraRoutes.js_
