# Commit 0465

## Commit Metadata
- **Hash**: `70d30dbc76667db55c3ba4b52af5eca86e4a6bed`
- **Parent**: `59932041d3c1c5baaf100f296bfbec8569189828`
- **Author**: gamertoky1188gro
- **Date**: 2026-05-29 23:19:06
- **Message**: fix: add missing JWT token to governance API calls and fast-fail when opencode binary is unavailable

## High-Level Summary
Two fixes: (1) Governance API calls now pass JWT token (getToken()) instead of failing with 401, and (2) opencode server startup now checks if binary exists in PATH before spawning, with spawn error detection.

## File-by-File Breakdown
| File | Status | Insertions | Deletions |
|------|--------|-----------|-----------|
| server/services/assistantService.js | modified | 30 | 2 |
| src/pages/AdminGovernance.jsx | modified | 16 | 4 |

## Detailed Diff Analysis
- assistantService.js: Added execSync import, isOpencodeBinaryAvailable() function checks `which opencode` / `where opencode`, returns false if not found. ensureOpencodeServer() fast-fails with null if binary missing. Added spawn error listener and poll check.
- AdminGovernance.jsx: Added getToken import; all three API calls (policies, enforcement history, templates) now pass { token: getToken() } option.

## Why This Change
Governance APIs require auth; missing tokens caused silent 401s. Opencode server startup without binary caused cryptic errors.

## Was It Useful
Yes — fixes both auth failures and improves error messaging for AI service startup.

## Impact Analysis
- Low risk. Backward compatible — tokens are only added, not removed.

## Relationships
Follow-up to 0463 (AdminGovernance refactor needed JWT wiring).

## Confidence Notes
High confidence. Straightforward fix.