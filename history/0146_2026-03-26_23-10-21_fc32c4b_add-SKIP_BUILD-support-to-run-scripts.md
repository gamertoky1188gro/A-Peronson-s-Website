# Commit 0146: Add SKIP_BUILD Support to Deployment Run Scripts

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0146                                       |
| **Commit Hash**   | `fc32c4b791acd84e4bdce9770dc2edf4e46b28a1` |
| **Parent Hash**   | `0fcdb85907c97a524b687549baab8db53da07ab0` |
| **Author**        | gamertoky1188gro                           |
| **Date/Time**     | 2026-03-26 23:10:21                        |
| **Files Changed** | 3                                          |
| **Additions**     | 49                                         |
| **Deletions**     | 16                                         |
| **Net Change**    | +33                                        |
| **Merge Commit**  | No                                         |

## Custom Title

Add SKIP_BUILD Environment Variable to Deployment Run Scripts

## High-Level Summary

Enhanced all three deployment run scripts (`run.sh`, `run.bat`, `run.ps1`) with a `SKIP_BUILD` environment variable and `is_skip_build` helper function. When set, the scripts skip the `npm run build` step during backend-served or ngrok deployment modes. This saves time during iterative development where the frontend is already built.

## File-by-File Breakdown

| File              | Type     | +   | -   | Δ   |
| ----------------- | -------- | --- | --- | --- |
| `scripts/run.sh`  | Modified | 20  | 4   | +16 |
| `scripts/run.bat` | Modified | 22  | 6   | +16 |
| `scripts/run.ps1` | Modified | 7   | 6   | +1  |

### `scripts/run.sh`

Added an `is_skip_build()` shell function that checks the `SKIP_BUILD` env var for truthy values (`true`, `1`, `yes`, `y`, case-insensitive). Wrapped both `backend` and `ngrok` mode build commands in `if ! is_skip_build; then ... fi` guards. Added an info echo line to print the current `SKIP_BUILD` setting.

### `scripts/run.bat`

Added equivalent skip-build logic for Windows batch. Guarded `npm run build` calls in `backend` and `ngrok` modes.

### `scripts/run.ps1`

Added equivalent skip-build logic for PowerShell. Guarded build calls in both deployment modes.

## Detailed Diff Analysis

Only deployment scripts changed. No application logic was modified.

The change adds flexibility to the deployment pipeline by allowing developers to bypass the frontend build when it is already up to date. This is a developer-experience improvement.

## Why This Change May Have Been Needed

Iterative development with the "backend serves dist" pattern required a full `npm run build` on every restart. For rapid iteration, this was wasteful when the frontend hadn't changed. The `SKIP_BUILD` env var allows developers to skip the build step.

## Was It Useful?

Yes. Simple, non-invasive change that improves developer workflow without breaking existing behavior. Backward compatible — when `SKIP_BUILD` is not set, the scripts behave exactly as before.

## Impact Analysis

- **Developers**: Can set `SKIP_BUILD=true` to skip rebuilds during backend-focused development
- **Users**: No visible change
- **Backward compatibility**: Fully compatible; default behavior is unchanged

## Relationship to Surrounding Commits

Part of a sequence of deployment script refinements (0146–0149) following the Docker/Prisma cleanup in 0144. These small iterative fixes improve the developer experience for running the full stack.

## Confidence Notes

High confidence — the diff is clear and the function is well-documented.

## Optional Technical Details

The `SKIP_BUILD` check is case-insensitive and accepts `true|1|yes|y`. The `run.sh` version uses `printf '%s'` piped to `tr` for safe case conversion, following portable shell practices.
