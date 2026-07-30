# Commit 0633 — 0f97e2bed17f

| Field | Value |
|-------|-------|
| **Commit Number** | 0633 |
| **Commit Hash** | 0f97e2bed17fe9610781863866842e1fff4d63a4 |
| **Parent Hash** | 495efd5220f5f4c0a8646b79d5771be8a085d269 |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-27 14:51:42 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 1 |
| **Net Change** | 0 |
| **Merge Commit** | No |

## Remove Watch Flag from Server Script

Changes the `server` npm script from `node --watch server/server.js` to `node server/server.js`, removing the `--watch` flag that causes Node.js to automatically restart the server on file changes.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `package.json` | Modified | 1 | 1 | 0 |

## Detailed Diff Analysis

**Before:**
```
"server": "node --watch server/server.js",
```
**After:**
```
"server": "node server/server.js",
```

Removes the `--watch` flag which is a Node.js 18+ feature that monitors file changes and restarts the process. The `start:prod` script (added in commit 0626) already runs without `--watch`. This change makes the development `server` script consistent with the production start approach.

## Why This Change Was Needed

**Inference**: The `--watch` flag may have been causing issues during development — excessive restarts, memory leaks from uncleaned resources on restart, or file-watching conflicts with the existing Vite/Nodemon setup. The `concurrently` command (`npm run dev:full`) runs both `npm run server` and `npm run dev`, so file watching for the frontend is already handled by Vite's HMR. Removing `--watch` from the server script avoids redundant file watching.

## Was It Useful

**Neutral** — Removes a convenience feature for server development. Developers who want hot-reload for the server will need to use an external tool like `nodemon`. However, it also removes potential issues from the Node.js `--watch` implementation.

## Impact Analysis

- **Development**: Server no longer auto-restarts on file changes; developers must manually restart after editing server code
- **Consistency**: Aligns with `start:prod` (commit 0626) which also runs without `--watch`
- **Resource usage**: No more watch process overhead

## Relationship to Surrounding Commits

Part of the production-readiness and server configuration cleanup spanning commits 0623–0636. Follows the massive `class`→`className` migration (0631-0632). Precedes the logger fix (0634) and opencode env guard (0635-0636).

## Confidence Notes

High confidence. Single-line change with clear before/after.
