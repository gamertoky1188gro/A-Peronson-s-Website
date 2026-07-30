# Commit 0635 — e4f752027413

| Field | Value |
|-------|-------|
| **Commit Number** | 0635 |
| **Commit Hash** | e4f7520274133f45764082ae75f8035d03343ce5 |
| **Parent Hash** | e5a6be781d78c436159a0ba6878125554f025332 |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-27 14:56:42 |
| **Branch** | main |
| **Files Changed** | 3 |
| **Additions** | 8 |
| **Deletions** | 1 |
| **Net Change** | +7 |
| **Merge Commit** | No |

## Add OPENCODE_ENABLED Env Guard

Adds an environment variable guard (`OPENCODE_ENABLED`) that controls whether the opencode AI server starts up. When set to `false`, the server initialization is skipped. Also disables `AI_HARAM_ANALYTICS_ENABLED` locally and sets `OPENCODE_ENABLED=true` in production (Render).

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `server/services/assistantService.js` | Modified | 4 | 0 | +4 |
| `render.yaml` | Modified | 2 | 0 | +2 |
| `.env` | Modified | 2 | 1 | +1 |

## Detailed Diff Analysis

### `server/services/assistantService.js` (+4)

In `initOpencodeServer()`:
```js
export async function initOpencodeServer() {
    if (process.env.OPENCODE_ENABLED === "false") {
        logInfo("OPENCODE_ENABLED=false — skipping opencode server startup");
        return null;
    }
    logInfo("Initializing opencode server on startup...");
    // ... rest of the function
}
```

The guard is placed at the top of the function — if `OPENCODE_ENABLED` is explicitly `"false"`, it logs a message and returns `null` immediately without attempting to start the opencode server process.

### `.env` (+2/−1)

- `AI_HARAM_ANALYTICS_ENABLED` changed from `true` to `false` (disables AI-based NSFW/analytics locally)
- Added `OPENCODE_ENABLED=false` (disables opencode server locally)

### `render.yaml` (+2)

Added:
```yaml
- key: OPENCODE_ENABLED
  value: "true"
```
in the production environment variables. This ensures the opencode server starts on Render (production), while being disabled for local development.

## Why This Change Was Needed

**Inference**: The opencode AI server start was causing issues in local development — it requires the opencode binary, a valid model configuration, and sufficient system resources. Developers who don't have opencode installed or configured locally would see errors or startup failures. The `OPENCODE_ENABLED=false` flag allows local development to proceed without the AI dependency. Production still enables it. The `AI_HARAM_ANALYTICS_ENABLED=false` change suggests the AI moderation pipeline was also causing issues locally.

## Was It Useful

**Useful** — Decouples local development from the opencode AI server dependency. Developers can work on other features without needing the full AI infrastructure locally.

## Impact Analysis

- **Local development**: Server starts faster, no opencode binary/dependency errors
- **Production**: OpenCode server still runs on Render (OPENCODE_ENABLED=true)
- **AI moderation**: Haram detection disabled locally, enabled in production
- **Configuration**: Environment-based toggle pattern — clean separation of dev/prod concerns

## Relationship to Surrounding Commits

First of two commits adding the OPENCODE_ENABLED guard. Commit 0636 extends the guard to `ensureOpencodeServer()`, which was called from `initAllUserSessions` and bypassed the first check. Together they ensure the opencode server is never started when `OPENCODE_ENABLED=false`.

## Confidence Notes

High confidence. The guard pattern is straightforward. The diff shows clear additions of the env var check in the right location.
