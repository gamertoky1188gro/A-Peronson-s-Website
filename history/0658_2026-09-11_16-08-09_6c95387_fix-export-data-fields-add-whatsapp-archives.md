# Commit 0658 — 6c95387

| Field | Value |
|-------|-------|
| **Commit Number** | 0658 |
| **Commit Hash** | 6c95387fdd90968c12b1ac4ec11158d8c624a016 |
| **Parent Hash** | bbebe82710f13059209e93541a3d7b1f9c2a2c12 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 16:08:09 |
| **Branch** | main |
| **Files Changed** | 207 |
| **Additions** | 20669 |
| **Deletions** | 10 |
| **Net Change** | +20669/-10 |
| **Merge Commit** | No |

## fix-export-data-fields-add-whatsapp-chat-archives-and-log-infrastructure

A two-part commit that (1) fixes incorrect Prisma model/field names in the user data export endpoint and (2) adds WhatsApp chat archive files and log infrastructure. The 207 files changed and 20,669 additions are dominated by ~195 binary media files (WhatsApp chat images, videos, voice notes, PDFs) totaling ~50 MB committed to the `whatsapp-chats/` directory, plus new server-side log writing infrastructure.

**Export data fix (server/controllers/userController.js):** The `exportMyData` endpoint had three incorrect Prisma queries: `prisma.message.findMany` used `{ OR: [{ sender_id: userId }, { receiver_id: userId }] }` but should only query sent messages (`{ sender_id: userId }`); `prisma.companyProduct.findMany` was renamed to `prisma.product.findMany` with `company_id` instead of `user_id`; `prisma.buyerRequirement.findMany` was renamed to `prisma.requirement.findMany` with `buyer_id` instead of `user_id`; `prisma.document.findMany` used `uploaded_by` instead of `user_id`. These field name mismatches would cause the export endpoint to return empty arrays or throw Prisma errors.

**Log controller sanitization (server/controllers/logController.js):** Added a new `sanitizeLogText` function that strips newlines and collapses whitespace — used instead of the general `sanitizeText` for log-specific fields (level, message, url, ts, stack). This prevents multi-line log messages from breaking the line-delimited log format.

**New log infrastructure (server/log/):** Three new files were added. `logFileWriter.js` (112 lines) — a buffered file writer that appends structured log entries to `log/gartexhub.log` with 100 MB max size and 1 MB trim. `requestLogWriter.js` (102 lines) — similar writer for HTTP request logs to `log/requests.log` with 3 GB max and 10 MB trim. Both use batch flushing (500ms timer or batch threshold) and atomic trim via temp file + rename. `server/log/viewer/` — a web-based log viewer with `router.js` (107 lines) serving chunked log file reads and `public/index.html` (117 lines) providing a streaming UI with filtering, level/source/method filters, regex support, and a modal detail view.

**Request capture middleware (server/middleware/requestCapture.js):** New Express middleware (129 lines) that intercepts every HTTP request, captures the full URL decomposition (scheme, domain, subdomain, port, path, query, fragment), request headers (with sensitive header redaction), request body (up to 100 KB), response status, and duration. Writes structured entries to `requestLogWriter`. Mounted before all API routes in `server.js`.

**Server wiring (server/server.js):** Added imports for `viewerRouter` and `requestCapture`, mounted `requestCapture()` before all API routes, and added `/log-viewer` route for the web viewer.

**Gitignore update:** `.gitignore` updated to ignore `/logs/` and `/log/` directories.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| .gitignore | edit | 3 | 1 | +2 |
| server/controllers/logController.js | edit | 18 | 8 | +10 |
| server/controllers/userController.js | edit | 8 | 4 | +4 |
| server/log/logFileWriter.js | new | 112 | 0 | +112 |
| server/log/logHub.js | edit | 9 | 0 | +9 |
| server/log/requestLogWriter.js | new | 102 | 0 | +102 |
| server/log/viewer/public/index.html | new | 117 | 0 | +117 |
| server/log/viewer/router.js | new | 107 | 0 | +107 |
| server/middleware/requestCapture.js | new | 129 | 0 | +129 |
| server/server.js | edit | 4 | 0 | +4 |
| whatsapp-chats/ (195 files) | binary | ~20000 | 0 | ~20000 |
| server/uploads/profile/*.jpeg | binary | 1 | 0 | +1 |

## Detailed Diff Analysis

**Export data fix:** The Prisma model renames (`companyProduct` → `product`, `buyerRequirement` → `requirement`) and field renames (`user_id` → `company_id`/`buyer_id`/`uploaded_by`) reflect schema migrations that were applied to the database but not to the export endpoint. The message query change (removing `receiver_id` from the OR clause) limits the export to only messages the user sent, preventing data leakage of received messages.

**Log file writer architecture:** Both `LogFileWriter` and `RequestLogWriter` use the same pattern: a write queue with batch flushing (50 entries for logs, 20 for requests), a 500ms flush timer with `unref()` to avoid keeping the process alive, and atomic trim (write to `.tmp`, then `renameSync`). The `logHub.js` integration listens to the "all" event and appends every entry to the file writer.

**Request capture middleware:** The middleware monkey-patches `req.push` to intercept request body chunks without consuming the stream. It parses the full URL using `new URL()`, extracts client IP from `X-Forwarded-For` or `X-Real-IP`, redacts sensitive headers (`authorization`, `cookie`, `set-cookie`, `x-api-key`), and captures response status/duration on the `res.finish` event.

**WhatsApp archives:** 195 files including JPEG images (WhatsApp photos from various conversations), MP4 videos, OPUS voice notes, PDF documents (project analyses, contract drafts, markdown-to-PDF conversions), HTML exports (Gemini code sessions), and TXT chat exports. Organized into subdirectories: `Cyber Code Master Mira Dev/`, `GarTexHub B2B Marketplace/`, `textrade-global/`, `TexTrade Global`.

## Why This Change Was Needed

The export endpoint was broken due to stale Prisma model/field names — users requesting their data export would get empty or errored responses. The WhatsApp chat archives needed to be preserved as project documentation. The log infrastructure (file writer, request capture, web viewer) was needed for production debugging and monitoring.

## Was It Useful

Yes, but the WhatsApp archive inclusion is controversial. While it preserves project documentation, committing 50 MB of binary media to git permanently inflates the repository. A `.gitignore` exclusion or Git LFS would have been more appropriate for the binary files.

## Impact Analysis

- **Export endpoint:** Now returns correct data for all Prisma models.
- **Logging:** Server logs and HTTP requests are now persisted to disk and viewable via the web UI.
- **Repository size:** Increased by ~50 MB due to WhatsApp archives.
- **Risk:** Medium — the request capture middleware intercepts every HTTP request, which could impact performance under high load. The body capture (100 KB limit) could also capture sensitive data if not properly redacted.

## Relationship to Surrounding Commits

This commit builds on the logging consistency fixes in 0657 by adding the actual log persistence infrastructure. It also fixes the data export endpoint that was broken by schema migrations. The subsequent commits (0659-0664) are all smaller, focused UI/UX fixes.

## Confidence Notes

- The Prisma model/field name fixes were verified against the current schema.
- The log file writer uses `fs.appendFile` (async) with a sync fallback via `fs.writeFileSync` for the trim operation.
- The request capture middleware skips WebSocket upgrade requests (`req.headers.upgrade === "websocket"`).
- The WhatsApp archive files are binary and cannot be meaningfully diffed.

## Optional Technical Details

- `LogFileWriter` uses a 100 MB max size with 1 MB trim — when the file exceeds 100 MB, it reads the last 1 MB and overwrites the file.
- `RequestLogWriter` uses a 3 GB max size with 10 MB trim — designed for high-traffic production environments.
- The web viewer uses virtual scrolling (ROW_H=32px, OVERSCAN=80 rows) and reads log files in 512 KB chunks.
- `logHub.js` integration: `this.on("all", (entry) => logFileWriter.append(entry))` — this captures every log entry including parsed, categorized, and annotated entries.
