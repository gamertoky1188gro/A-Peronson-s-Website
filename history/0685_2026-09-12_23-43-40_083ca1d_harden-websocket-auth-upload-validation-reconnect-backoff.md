# Commit 0685 — 083ca1d

| Field | Value |
|-------|-------|
| **Commit Number** | 0685 |
| **Commit Hash** | 083ca1dd628c7fe016a441228cfc91d7a9b93801 |
| **Parent Hash** | 3453a74ae338180b2fd5d254449ba14b34642724 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 23:43:40 |
| **Branch** | main |
| **Files Changed** | 9 |
| **Additions** | 145 |
| **Deletions** | 16 |
| **Net Change** | +145/−16 |
| **Merge Commit** | No |

## fix(security): harden WebSocket auth, upload validation, reconnect backoff

This commit addresses three critical security and reliability gaps across the platform. First, the WebSocket `ask` handler in `server.js` was previously accessible by any unauthenticated client — a significant vulnerability that could have allowed unauthorized users to query the AI endpoint. The fix adds a `socket.userId` check before processing `ask` payloads, returning an auth-error reply for unauthenticated connections. Second, document uploads via `documentRoutes.js` previously accepted any file type with no filtering whatsoever. A new `fileFilter` in the multer configuration restricts uploads to a curated set of safe MIME types (JPEG, PNG, WebP, GIF, SVG, PDF, Office docs, plain text, CSV), with an additional pass-through for `image/*` and `video/*` prefixes. Third, the commit introduces SVG content sanitization across all upload paths — a new `svgSanitizer.js` utility strips `<script>`, `<foreignObject>`, event handlers, `javascript:` URLs, and other dangerous elements from uploaded SVG files. This is applied as post-upload sanitization for disk-based uploads (avatar, feed, message) and as pre-write sanitization for memory-based document uploads. Finally, both `ChatInterface` and `FloatingAssistant` components upgrade their WebSocket reconnection logic from a fixed 30-second retry to exponential backoff (2^n seconds, capped at 120 seconds), matching the pattern already used by `notificationsRealtime.js`.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `server/controllers/feedUploadController.js` | Modified | 3 | 0 | +3 |
| `server/controllers/messageController.js` | Modified | 3 | 0 | +3 |
| `server/controllers/userController.js` | Modified | 6 | 1 | +5 |
| `server/routes/documentRoutes.js` | Modified | 25 | 0 | +25 |
| `server/server.js` | Modified | 16 | 0 | +16 |
| `server/services/documentService.js` | Modified | 8 | 1 | +7 |
| `server/utils/svgSanitizer.js` | New | 63 | 0 | +63 |
| `src/components/FloatingAssistant.jsx` | Modified | 7 | 1 | +6 |
| `src/pages/ChatInterface.jsx` | Modified | 30 | 14 | +16 |

## Detailed Diff Analysis

- **`server/utils/svgSanitizer.js` (NEW):** Core regex-based SVG sanitizer. Exports `sanitizeSvgBuffer(buffer)` and `sanitizeSvgFile(filePath)`. Strips `<?xml>`, `<!DOCTYPE>`, dangerous tags (script, foreignObject, iframe, object, embed, form, input, etc.), event handlers (`on*`), `data-*` attributes, and `javascript:` URLs. Returns a boolean indicating whether sanitization occurred. Uses regex for speed rather than full XML parsing.
- **`server/routes/documentRoutes.js`:** Adds `ALLOWED_DOC_MIMES` Set (12 MIME types) and a `fileFilter` callback to multer. Rejects uploads with unrecognized MIME types via `cb(new Error("Unsupported file format"))`.
- **`server/server.js`:** The `ask` handler within the WebSocket connection block now checks `if (!socket.userId)` and returns a structured error reply with `confidence: 0` and `fallback_reason: "unauthenticated_ask"`.
- **`server/controllers/userController.js`:** `uploadAvatar` now calls `sanitizeSvgFile(fullPath)` before processing. The `fullPath` resolution was moved before sanitization to ensure it exists.
- **`server/controllers/feedUploadController.js` and `messageController.js`:** Both now call `sanitizeSvgFile(fullPath).catch(() => null)` after the upload write, silently handling non-SVG files.
- **`server/services/documentService.js`:** The `saveDocumentMetadata` function now checks for SVG mime/extension and calls `sanitizeSvgBuffer(file.buffer)` before writing to disk, replacing the raw buffer with the sanitized content.
- **`src/components/FloatingAssistant.jsx`:** Adds `reconnectAttemptsRef` (counter). On close, increments counter and computes `delay = Math.min(1000 * 2^n, 120_000)`. Resets to 0 on successful open and on cleanup. Replaces the hardcoded 30-second reconnect.
- **`src/pages/ChatInterface.jsx`:** Same exponential backoff pattern applied. Also has minor indentation changes in `ws.onopen` and `ws.onclose` handlers (cosmetic).

## Why This Change Was Needed

The unauthenticated WebSocket `ask` handler was a security vulnerability allowing anyone to query the AI. The lack of upload file-type validation meant arbitrary files (potentially malicious executables or oversized payloads) could be uploaded. SVG files are a well-known XSS vector via embedded scripts and event handlers. The fixed 30-second reconnect interval caused unnecessary server load during outages and slow recovery for users.

## Was It Useful

Yes — this is a high-impact security hardening commit. It closes three distinct attack vectors and improves client-side resilience.

## Impact Analysis

- **Security:** High. Prevents unauthenticated AI queries, blocks malicious file uploads, and neutralizes SVG-based XSS.
- **Reliability:** Medium. Exponential backoff prevents reconnect storms and provides faster recovery at scale.
- **Performance:** Low. SVG sanitization uses regex (fast), but adds a small per-upload overhead.
- **Breaking Changes:** None. The file filter may reject previously accepted uploads, but this is intentional.

## Relationship to Surrounding Commits

Precedes commit 0686 (brand logo system). The security hardening here is independent of the branding work that follows. It builds on earlier WebSocket and upload infrastructure without conflicting.

## Confidence Notes

- Full diff available; all changes are straightforward and well-scoped.
- The SVG sanitizer uses regex rather than DOM parsing — functional but not exhaustive against all edge cases (e.g., `<animate>` with `values` attribute).
- The file filter in `documentRoutes.js` allows `mime.startsWith("image/")` which still permits SVG through the MIME check; the sanitizer is the secondary defense layer.

## Optional Technical Details

- `svgSanitizer.js` regex patterns target 13 dangerous tag names, event handler attributes, `data-*` attributes, and `javascript:` URI schemes.
- The exponential backoff formula `Math.min(1000 * 2^n, 120_000)` yields delays of 2s, 4s, 8s, 16s, 32s, 64s, 120s, 120s... with max cap at 2 minutes.
- Multer `fileFilter` receives `(req, file, cb)` — errors passed to `cb` are forwarded to Express error handling middleware.
