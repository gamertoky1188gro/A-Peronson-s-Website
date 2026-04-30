# Org Operations

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/org-operations` -> `server/routes/orgOperationsRoutes.js:16` (router var: `router`)

## Routes

All routes require auth + roles: owner, admin, buying_house, factory, agent

### GET `/api/org-operations/policies`

- **Handler:** `getOperationsPolicies`

### PUT `/api/org-operations/policies`

- **Handler:** `putOperationsPolicies`

### GET `/api/org-operations/legacy-policies`

- **Handler:** `getLegacyOperationsPolicies`

### PUT `/api/org-operations/legacy-policies`

- **Handler:** `putLegacyOperationsPolicies`

### GET `/api/org-operations/queue`

- **Handler:** `getOperationsQueue`

### POST `/api/org-operations/rebalance`

- **Handler:** `postOperationsRebalance`

### POST `/api/org-operations/escalate/:leadId`

- **Handler:** `postOperationsEscalate`

### GET `/api/org-operations/escalations`

- **Handler:** `getOperationsEscalations`

### POST `/api/org-operations/escalations/:leadId/resolve`

- **Handler:** `postResolveEscalation`

### GET `/api/org-operations/workload`

- **Handler:** `getOperationsWorkload`

---

## Service Layer

- **Org Operations Service:** `server/services/orgOperationsService.js`

---

*Generated from source: server/routes/orgOperationsRoutes.js*