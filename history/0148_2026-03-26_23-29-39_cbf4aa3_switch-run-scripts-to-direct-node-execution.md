# Commit 0148: Switch Run Scripts to Direct Node Execution and Set NODE_ENV

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0148                                       |
| **Commit Hash**   | `cbf4aa377fc8dcd13a22ef8c5d1d0368182e87f9` |
| **Parent Hash**   | `d877261fdd52babeda7a74f4e2e0d2f7010f0c98` |
| **Author**        | gamertoky1188gro                           |
| **Date/Time**     | 2026-03-26 23:29:39                        |
| **Files Changed** | 4                                          |
| **Additions**     | 13                                         |
| **Deletions**     | 7                                          |
| **Net Change**    | +6                                         |
| **Merge Commit**  | No                                         |

## Custom Title

Change Run Scripts to Invoke Node Directly and Set NODE_ENV=production

## High-Level Summary

Updated all three deployment run scripts (`.bat`, `.ps1`, `.sh`) to invoke `node server/server.js` directly instead of going through `npm run server`. Also sets `NODE_ENV=production` when starting the backend server in both `backend` and `ngrok` modes. Additionally changed the server's SPA wildcard from `/*` to a regex pattern `/.*/`.

## File-by-File Breakdown

| File               | Type     | +   | -   | Δ   |
| ------------------ | -------- | --- | --- | --- |
| `scripts/run.bat`  | Modified | 6   | 2   | +4  |
| `scripts/run.ps1`  | Modified | 6   | 2   | +4  |
| `scripts/run.sh`   | Modified | 6   | 2   | +4  |
| `server/server.js` | Modified | 1   | 1   | 0   |

### Deployment Scripts

In all three scripts:

- Changed `npm run server` to `node server/server.js` for both `backend` and `ngrok` modes
- Added `NODE_ENV=production` environment variable before starting the server

### `server/server.js`

Changed the SPA wildcard from `app.get('/*', ...)` to `app.get(/.*/, ...)` — a regex pattern that matches any path.

## Detailed Diff Analysis

**Deployment scripts**: Running `node server/server.js` directly avoids overhead of npm script resolution and provides more predictable behavior. Setting `NODE_ENV=production` ensures Express runs in production mode (enabling caching, disabling stack traces).

**Server SPA fallback**: The regex `/.*/` is functionally similar to `/*` for Express but may behave differently in edge cases with query strings or special characters.

## Why This Change May Have Been Needed

Direct `node` invocation is more reliable for production deployment, avoiding npm's script resolution layer. Setting `NODE_ENV=production` is critical for Express performance. The regex pattern change may have been needed to handle certain URL patterns that the string wildcard didn't match correctly.

## Was It Useful?

Yes. Production deployments benefit from direct node execution and explicit `NODE_ENV`. The script changes are good practice for deployment reliability.

## Impact Analysis

- **Users**: Express will run in production mode (better performance, no error stack traces in responses)
- **Developers**: Deploy scripts are more predictable and faster
- **Backward compatibility**: `NODE_ENV=production` changes Express behavior — middleware error responses will differ

## Relationship to Surrounding Commits

Follows the SPA wildcard fix in 0147. Part of a series hardening the deployment pipeline. Precedes the database utility enhancement in 0149.

## Confidence Notes

High. Changes are self-explanatory deployment best practices.
