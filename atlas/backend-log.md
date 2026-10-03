# backend-log

- **Purpose**: Central structured logging — ring buffer, counters, search DSL, burst summaries, live WS/REST transports.
- **Key Files**: `server/log/logHub.js`, `server/log/levels.js`, `server/log/categories.js`, `server/log/parsers.js`, `server/log/builtinParsers.js`, `server/log/search.js`, `server/log/burst.js`, `server/log/format.js`, `server/log/transport.js`, `server/log/logFileWriter.js`, `server/log/requestLogWriter.js`, `server/log/viewer/*`, `server/utils/logger.js`
- **Dependencies**: backend-utils
- **Dependents**: backend-server, backend-middleware, backend-realtime, backend-tui
- **Exposes**: `emit()` (with `_console` pretty-line stripping), 6 levels + 17 categories, parser plugin registry, query DSL (`user:`, `role:`, `path:`, `regex:/…/`, time windows, `-exclude`), burst summaries, REST `/api/logs/*` + WS `/ws/logs` (snapshot/entry/stats/heatmap/burst/session), latency histogram + p50/p95/p99.

## Data Flow
Services log via `utils/logger.js` → hub buffer (50k, grouped, bookmarked) → console (neon format) + file writers + WS subscribers; `setRuntimeMetrics()` injects redis/worker/queue stats.
