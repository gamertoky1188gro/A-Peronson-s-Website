# Commit 0648 — 77db487

| Field | Value |
|-------|-------|
| **Commit Number** | 0648 |
| **Commit Hash** | 77db4874d33a7b8f458879333b5cfa64086cd541 |
| **Parent Hash** | 7eef21b084a71809a9e7b7cebe646fc0ce23280e |
| **Author** | Tokyi |
| **Date/Time** | 2026-08-31 00:06:47 |
| **Branch** | main |
| **Files Changed** | 122 |
| **Additions** | 2,132 |
| **Deletions** | 3,311 |
| **Net Change** | +2,132/−3,311 |
| **Merge Commit** | No |

## Fix Ink TUI Visible Log Row Calculation and Rebuild Distribution

This commit fixes a critical bug in the Ink-based TUI where the visible log row count was incorrectly calculated, causing rows to be hidden or layout issues. The calculation was changed from `logHeight - 6` to `logHeight - 4` to account for the correct UI element overhead. The commit also removes the compiled `.mjs` cache file and rebuilds the entire distribution.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `server/tui/ink/app.jsx` | Ink App | ~460 | ~460 | Net refactor |
| `server/tui/ink/app.mjs` | Compiled Cache | 0 | 1,990 | −1,990 |
| `server/tui/index.js` | TUI Entry | 12 | — | ~12 |
| `package.json` | Package Config | 3 | — | ~3 |
| `.gitignore` | Git Ignore | 1 | 0 | +1 |
| `pnpm-lock.yaml` | Lock File | ~970 | ~970 | Updated |
| `dist/assets/*` | Built Assets | ~1,060 | ~1,340 | Rebuilt |

## Detailed Diff Analysis

### `server/tui/ink/app.jsx` (~460 lines changed)

Major refactor of the Ink TUI application:

**Key fix — Visible row calculation:**
```javascript
// Before:
const visible = Math.max(1, logHeight - 6);
// After:
const visible = Math.max(1, logHeight - 4);
```

**Other changes:**
- Refactored state management to use refs for stale-closure prevention (`filteredRef`, `selectedIdRef`, `searchActiveRef`, `modalIdRef`)
- Rewrote mouse input handling from a separate `useEffect` to a unified `useEffect` with raw stdin parsing
- Added `disableMouseRef` for programmatic mouse control
- Added shift+arrow key support for text selection
- Replaced `useInput` hook with manual stdin data handler for better control
- Added `reenableTimer` that periodically re-enables mouse tracking when conditions are met
- Simplified `keyHandler` from a regular function to `useCallback` with proper dependencies
- Changed `queryResult` state to include entries directly instead of separate `entries` state
- Added level-specific icons to log rows (● ◆ ✔ ▲ ✖ 🔥)
- Added bookmarked indicator (★) in log rows
- Improved request flow visualization with duration bars
- Changed many color references to neon variants
- Removed `InputBridge` component (replaced by manual input handling)
- Added `neonBar` and `NeonBar` components for gradient dividers
- Added `LEVEL_ICON` mapping for visual log level identification
- Compact code style throughout (single-line conditionals, shorter variable names)

### `server/tui/ink/app.mjs` (−1,990)

Removed the cached compiled version of the Ink app. The Babel compilation will regenerate this on next run.

### `server/tui/index.js` (+12/−0)

Updated entry point to handle the `--ink` flag properly:
- Detects `--ink` argument
- Dynamically imports and starts the Ink app
- Falls back to blessed TUI if `--ink` not specified
- Added environment variable support for `PORT` and `LOG_WS_URL`

### `package.json` (+3/−0)

- Added `@babel/core` as a dependency (needed for Ink JSX compilation)
- Added `@babel/preset-react` for JSX transformation
- Updated version or scripts

### `.gitignore` (+1/−0)

- Added entry to ignore Babel cache files

### `pnpm-lock.yaml` (restructured)

Complete lock file update reflecting new and updated dependencies for Babel compilation support.

### `dist/` (rebuilt)

All distribution assets rebuilt with new chunk hashes. Net reduction of ~1,200 lines due to the removal of the compiled `.mjs` file and optimized build output.

## Why This Change Was Needed

The `logHeight - 6` calculation was subtracting too many rows for UI elements that weren't actually consuming space in the Ink layout. This caused the visible log area to be smaller than expected, hiding log entries and leaving blank space at the bottom. The fix to `logHeight - 4` correctly accounts for the topbar, status bar, and search/filter bars without over-counting.

## Was It Useful

Essentially useful. This is a bug fix commit that corrects a layout calculation issue in the Ink TUI. The removal of the compiled `.mjs` file also cleans up the repository by not checking in build artifacts.

## Impact Analysis

- **Ink TUI Usability:** Log list now correctly fills available vertical space
- **Code Quality:** Refactored input handling eliminates stale closure bugs
- **Repository Hygiene:** Removed compiled artifact from version control
- **Build System:** Added Babel dependencies for JSX compilation

## Relationship to Surrounding Commits

Follows the Ink TUI implementation (commit 0647) and precedes the login page icon fix (commit 0649). This is a bug fix and cleanup commit that improves the Ink TUI's reliability.

## Confidence Notes

**Confidence: High** — The core fix (`logHeight - 6` → `logHeight - 4`) is clearly visible in the diff. The refactoring of input handling and removal of compiled artifacts are straightforward improvements.

## Optional Technical Details

- The Ink app is now compiled on-demand via Babel rather than checked in as a pre-compiled `.mjs`
- The `visible` calculation affects how many log rows are rendered in the terminal viewport
- The refactored stdin handler uses a buffer-and-parse approach for raw mouse sequences
- Shift+arrow keys now trigger text selection mode (disabling mouse navigation temporarily)
