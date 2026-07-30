# Commit 0636 — fe656b4c52a5

| Field | Value |
|-------|-------|
| **Commit Number** | 0636 |
| **Commit Hash** | fe656b4c52a54d1e637281d16ed7d23dd14f709a |
| **Parent Hash** | e4f7520274133f45764082ae75f8035d03343ce5 |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-27 14:58:38 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 3 |
| **Deletions** | 0 |
| **Net Change** | +3 |
| **Merge Commit** | No |

## Guard ensureOpencodeServer in Session Init

Extends the `OPENCODE_ENABLED` guard to `ensureOpencodeServer()` — a lower-level function called by `initAllUserSessions()` that was bypassing the check added in commit 0635.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `server/services/assistantService.js` | Modified | 3 | 0 | +3 |

## Detailed Diff Analysis

Added the same guard at the top of `ensureOpencodeServer()`:
```js
async function ensureOpencodeServer() {
    if (process.env.OPENCODE_ENABLED === "false") {
        return null;
    }
    const cfg = aiConfig.opencode;
    // ... rest of the function
}
```

This is the same pattern as the guard added in `initOpencodeServer()` in commit 0635. The difference is that `ensureOpencodeServer()` is a private function called from multiple places:
- `initOpencodeServer()` (the main startup path — already guarded in 0635)
- `initAllUserSessions()` (a separate code path that was NOT guarded)

Without this fix, calling `initAllUserSessions()` would still start the opencode server even when `OPENCODE_ENABLED=false`, because it calls `ensureOpencodeServer()` directly rather than going through `initOpencodeServer()`.

## Why This Change Was Needed

The guard in commit 0635 only protected the `initOpencodeServer()` entry point. But `initAllUserSessions()` (which initializes sessions for all authenticated users) calls `ensureOpencodeServer()` directly, bypassing the check. This meant the opencode server would still start in local development when users logged in and their sessions were initialized.

## Was It Useful

**Useful** — Closes the bypass path. With both guards in place, the opencode server is reliably prevented from starting when `OPENCODE_ENABLED=false`, regardless of which code path triggers server initialization.

## Impact Analysis

- **Session initialization**: `initAllUserSessions()` no longer triggers opencode server startup when disabled
- **Completeness**: Both entry points to opencode server startup are now guarded
- **User session creation**: New user sessions in local dev won't attempt to start opencode

## Relationship to Surrounding Commits

Immediate follow-up to commit 0635 (2 minutes later). The previous commit guarded `initOpencodeServer()` but missed the `ensureOpencodeServer()` bypass via `initAllUserSessions()`. This commit fixes that gap. Together they form a complete guard solution.

## Confidence Notes

High confidence. Simple three-line addition following the exact same pattern as commit 0635. The guard placement at the top of `ensureOpencodeServer()` is the logical location — it's a private function with multiple callers.
