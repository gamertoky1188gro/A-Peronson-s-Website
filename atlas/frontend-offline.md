# frontend-offline

- **Parent**: (none — top-level module under `src/`)
- **Purpose**: "GarTexHub HyperCache" offline twin — IndexedDB mirror of the marketplace, an outbox for offline writes, a connectivity state machine, and a PWA service worker. Lets the SPA read cached feed/products/profile data and queue drafts while offline.
- **Key Files**: `src/sw.js`, `src/offline/schema.js`, `src/offline/db.js`, `src/offline/broadcast.js`, `src/offline/connectivity.js`, `src/offline/cacheManager.js`, `src/offline/offlineStore.js`, `src/offline/hash.js`, `src/offline/conflictResolver.js`, `src/offline/syncTransport.js`, `src/offline/syncEngine.js`, `src/offline/outbox.js`, `src/components/OfflineBanner.jsx`, `src/components/OfflineStorageSection.jsx`
- **Dependencies**: frontend-lib, backend-sync (HTTP contract)
- **Dependents**: frontend-app, frontend-pages (`MainFeed.jsx`, `Settings.jsx`)
- **Exposes**: `runSync()`, `startConnectivity()`/`stopConnectivity()`/`getStatus()`/`pingNow()`, `enqueueDraft()`/`flushOutbox()`/`getOutboxCount()`, `getDb()`, `getStorageMode()`/`setStorageMode()`/`persist()`/`quotaInfo()`/`storeFootprint()`, `getRouteCacheMode()`, `resolveConflict()`, `contentHash()`, `registerServiceWorker()`.

## Data Flow
1. `src/main.jsx` registers `src/sw.js` (prod, or `?sw=1`); SW precaches the 14-file app shell into `gartexhub-app-shell-v1`.
2. `OfflineBanner.jsx` starts `connectivity.js` → `ONLINE | DEGRADED | OFFLINE | SYNCING | UP_TO_DATE | SYNC_ERROR | OFFLINE_SNAPSHOT`.
3. `syncEngine.runSync()`: `GET /api/sync/head` → compare `serverSequence` vs local → `GET /api/sync/delta?since=` → optional `hash.js` content-hash verify → apply into Dexie via `ENTITY_TO_STORE` → commit cursor → `flushOutboxToServer()` (best effort).
4. Offline CREATEs go to the Dexie `outbox` store via `enqueueDraft()` with `Idempotency-Key = localId`; `flushOutbox()` POSTs to `/requirements` or `/feed/posts` with exponential backoff (`2s·2^(n-1)`, cap 120s, max 8 attempts, concurrency 3). `409` ⇒ treated as applied. `payment/password/contract/admin` entities are hard-blocked, never queued.
5. `broadcast.js` (`BroadcastChannel("gartexhub-hypercache")`, localStorage fallback) fans out entity/outbox/resync events across tabs.
6. SW routing: `NetworkOnly` for `/api/*`, `/ws*`, `/api/feed/stream`; navigations serve cached `/index.html` + background revalidate + navigation preload; `/assets/*` cache-first. Never `skipWaiting` on install — the page posts `{type:"SKIP_WAITING"}` from the OfflineBanner refresh button. A hashed-asset miss with nothing cached triggers throttled `STALE_SHELL` message + `registration.update()`.

## Internal Structure
- **Dexie stores (18, DB `gartexhub-local`, SCHEMA_VERSION 1)** — entity mirrors (`users`, `profiles`, `feedPosts`, `products`, `requirements`, `notifications`, `messages`, `conversations`, `media`); query/page caches (`searchResults`, `feedPages`, `feedIndexes`); metadata (`routeMetadata`, `cacheMetadata`); sync plumbing (`syncState`, `syncChanges`); write queues (`outbox`, `conflicts`).
- **Conflict policy** (`conflictResolver.js`): numeric `version`/`v` wins → else newest `updatedAt|updated_at|modifiedAt|createdAt` → exact tie prefers **server**. Loser written to `conflicts`.
- **Storage modes** (`cacheManager.js`): `smart` | `full` | `wifi-only`, persisted at `hypercache.storageMode`.
- **Route cache modes** (`offlineStore.js`): `local-first` | `local-first+realtime` | `static` | `network-required`.
- **Settings surface** (`OfflineStorageSection.jsx`): storage-mode radio, quota bar, per-store footprint, "Download for offline" (`SNAPSHOT_STEPS` = feed / profile / products), `persist()`, "Clear offline data".