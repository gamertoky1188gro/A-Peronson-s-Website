# backend-sync

- **Parent**: (none — top-level server module)
- **Purpose**: Server half of the HyperCache offline twin — an append-only change ledger in Prisma that the client polls for deltas, plus pure stateless hash/delta helpers shared with the client algorithm.
- **Key Files**: `server/utils/hypercache.js`, `server/services/changeLogService.js`, `server/services/entityVersionService.js`, `server/services/syncService.js`, `server/controllers/syncController.js`, `server/routes/syncRoutes.js`
- **Dependencies**: data-prisma, backend-utils
- **Dependents**: backend-server, frontend-offline
- **Exposes**: `GET /api/sync/head`, `GET /api/sync/delta?since=&limit=`, `GET|POST /api/sync/hydrate?entity_type=&ids=` (all `requireAuth`); `appendChange()`/`emitAfterCommit()`, `getHead()`, `getDelta()`, `hydrateSyncEntities()`.

## Data Flow
1. Writers call `emitAfterCommit()` in `feedPostService.js` / `productService.js` / `requirementService.js` → `changeLogService.appendChange()` bumps the entity version (`entityVersionService`) and appends a `SyncChange` row (`seq`, `entity_type`, `entity_id`, `operation`, `entity_version`, `content_hash`, `occurred_at`).
2. `getHead()` returns `{ serverSequence (max seq), feedGeneration, appBuild, schemaVersion }`.
3. `getDelta(since, limit)` returns rows with `seq > since`, `take limit + 1` to signal `hasMore`. Defaults `DELTA_LIMIT_DEFAULT=200`, max `DELTA_LIMIT_MAX=1000`, `SYNC_SCHEMA_VERSION=1`.
4. **Gap detection**: `needsReset()` returns `{ ok:false, code:"RESET_REQUIRED" }` when the first row's `seq !== lastSeq + 1` (threshold `DELTA_GAP_RESET_THRESHOLD = 5000`) → client sets full-resync flag. Counterpart of client `setFullResyncPending()`.
5. `feedStreamController.js` dynamically imports `syncService.getDelta(since, 200)` to replay missed changes before attaching the live SSE stream.

## Internal Structure
`server/utils/hypercache.js` (76 lines, pure/stateless/unit-tested, **imported by no server file** — mirror of client `hash.js`/`outbox.js`): `stableStringify`, `computeHash`, `buildSyncHead`, `buildInvalidatePayload`, `sortDeltaBySeq`, `needsReset`, `outboxInsert` (dedupes by `idempotencyKey`, matching the client's `idempotencyKey === localId`).