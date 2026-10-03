# Commit 0657 — bbebe82

| Field | Value |
|-------|-------|
| **Commit Number** | 0657 |
| **Commit Hash** | bbebe82710f13059209e93541a3d7b1f9c2a2c12 |
| **Parent Hash** | e60ca2279c9bc5a182a18c3d68017a8616018d30 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-03 00:11:46 |
| **Branch** | main |
| **Files Changed** | 50 |
| **Additions** | 63 |
| **Deletions** | 61 |
| **Net Change** | +63/-61 |
| **Merge Commit** | No |

## route-all-bypass-console-error-calls-through-centralized-logger

Systematic replacement of 6 bare `console.error` calls with the project's centralized logger (`logError` on the server, `logger.error` on the client). The commit touches 5 source files (the real changes) and triggers a full dist rebuild with 45 chunk renames. The 6 bypass points were locations where errors were caught and dumped directly to `console.error` instead of flowing through the structured logging pipeline — meaning they were invisible to the TUI log viewer, the WebSocket log stream, and the log file writer.

**Server-side changes (3 files):** `server/check-user.js` — the `main().catch(console.error)` at the bottom was replaced with `main().catch((err) => logError("check-user failed", err))`, routing the error through `logError` which stamps it with timestamp, level, source, and writes to the log hub. `server/controllers/feedUploadController.js` — the `runAIAnalysis(doc.id, fullPath).catch(console.error)` fire-and-forget call was replaced with a `logError("feedUpload_aiAnalysis_failed", err)` handler, so AI analysis failures are now visible in the log system. `server/server.js` — two fire-and-forget calls (`ensureVenv().catch(console.error)` and `scanAndAnalyzeExistingFiles().catch(console.error)`) were replaced with `logError("ensureVenv_failed", err)` and `logError("scanExistingFiles_failed", err)` respectively. These were startup background tasks whose failures were previously silent.

**Client-side changes (2 files):** `src/App.jsx` — the `verifyAndSyncUser(token).catch(console.error)` call in the `AppLayout` mount effect was replaced with `logger.error("User sync failed:", err)`, routing the error through the frontend logger which batches and forwards structured entries to the server. `src/components/admin/PaymentProofReviewModal.jsx` — the `console.error("Review failed", err)` in the review catch block was replaced with `logger.error("Review failed", err)`. The file also gained a `logger` import from `../../lib/logger.js`.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| server/check-user.js | edit | 2 | 2 | 0 |
| server/controllers/feedUploadController.js | edit | 1 | 1 | 0 |
| server/server.js | edit | 2 | 2 | 0 |
| src/App.jsx | edit | 2 | 1 | +1 |
| src/components/admin/PaymentProofReviewModal.jsx | edit | 2 | 1 | +1 |
| dist/assets/*.js (45 chunk renames) | dist | 55 | 54 | +1 |
| dist/index.html | dist | 1 | 1 | 0 |

## Detailed Diff Analysis

**Why these 6 locations mattered:** All 6 were "bypass" points — `.catch(console.error)` patterns where the developer needed to silence an unhandled promise rejection but didn't want to add a full error handler. The problem is that `console.error` writes to stderr, which is invisible to the project's centralized logging infrastructure (the TUI log viewer, WebSocket log stream, and file-based log writer introduced in 0658). By routing through `logError`/`logger.error`, these failures now appear in the structured log pipeline with timestamps, categories, and source attribution.

**Server-side `logError`:** Imported from `server/utils/logger.js`, `logError` accepts a message string and an error object. It creates a structured log entry with level "error", stamps it with the current timestamp and server source, and emits it through the log hub — which writes to the file log, broadcasts to connected TUI instances, and stores in the ring buffer.

**Client-side `logger.error`:** Imported from `src/lib/logger.js`, the frontend logger batches log entries and forwards them to `POST /api/logs` in the background. The server's `logController` then ingests them into the same log hub, so client-side errors appear alongside server-side errors in the unified log stream.

## Why This Change Was Needed

Bare `console.error` calls bypass the centralized logging system, making errors invisible to monitoring, debugging, and the real-time TUI dashboard. In a production environment, these errors would only appear in container/process stderr — unstructured, unsearchable, and disconnected from request context.

## Was It Useful

Yes. This is a small but important consistency fix. All 6 locations were easy to miss during the original implementation of the logging system, and routing them through the logger ensures complete visibility.

## Impact Analysis

- **Monitoring:** Errors that were previously invisible in the log system are now captured.
- **Debugging:** Developers using the TUI log viewer will see these errors with full context.
- **Risk:** Zero. The behavior is identical — errors are still logged, just through a structured pipeline instead of raw stderr.

## Relationship to Surrounding Commits

This commit cleans up logging consistency right before the major infrastructure additions in 0658 (log file writer, request capture, WhatsApp archives). It ensures the logging pipeline is clean and complete before new logging features are added on top.

## Confidence Notes

- All 6 bypass locations were identified by searching for `console.error` in server and src directories.
- The replacement patterns are semantically identical — same error information, just routed through structured logging.
- The dist rebuild confirms no build errors from the import additions.

## Optional Technical Details

- The server-side `logError` function calls `logHub.emit("entry", { level: "error", message, data: error, source: "server" })`.
- The client-side `logger.error` pushes to a batch queue that flushes every 2 seconds or when the batch reaches 50 entries.
- `PaymentProofReviewModal.jsx` was the only file that needed a new `logger` import added — the other files already had the necessary imports.
