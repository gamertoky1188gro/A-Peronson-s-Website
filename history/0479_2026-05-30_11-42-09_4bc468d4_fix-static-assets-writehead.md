# Commit 0479

## Commit Metadata
- **Hash**: `4bc468d4da10a064a8733a33840a236a0ae87d62`
- **Parent**: `75a535bf6f4633ef92751625ec64d2f1efeb6961`
- **Author**: gamertoky1188gro
- **Date**: 2026-05-30 11:42:09
- **Message**: fix: serve static assets with res.writeHead to bypass send package MIME override

## High-Level Summary
Refactored static asset middleware: replaced conditional if-else chain with a MIME_TYPES lookup map. Added file existence check before reading. Added Cache-Control immutable headers.

## File-by-File Breakdown
| File | Status | Insertions | Deletions |
|------|--------|-----------|-----------|
| server/server.js | modified | 26 | 21 |

## Detailed Diff Analysis
- Created MIME_TYPES constant object mapping 11 extensions to Content-Type values
- Replaced the if-else chain with const contentType = MIME_TYPES[ext]; if (!contentType) return next();
- Added fs.existsSync check before reading
- Added Cache-Control: public, max-age=31536000, immutable header
- Removed express.static(distRoot) call entirely (now only serves via custom middleware)

## Why This Change
The send package used by express.static was overriding manually set Content-Type headers. By using writeHead + end directly, we bypass send's MIME detection entirely.

## Was It Useful
Yes — definitively fixes the MIME type issue for production.

## Impact Analysis
Medium — changed static file serving mechanism. Added immutable caching (1 year) for performance.

## Relationships
Final fix in the MIME type saga (0462 -> 0472 -> 0479).

## Confidence Notes
High.