# Commit 0619 — `cdb4cc43f791`

| Field | Value |
|-------|-------|
| **Commit Number** | 0619 |
| **Commit Hash** | `cdb4cc43f7912af8463b211adbd1df7b28e140a3` |
| **Parent Hash** | `0ffab809e9080b27815a1eed2c26c8c73affd860` |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-25 13:46:16 |
| **Branch** | main |
| **Files Changed** | 166 |
| **Additions** | 3,504 |
| **Deletions** | 3,546 |
| **Net Change** | −42 |
| **Merge Commit** | No |

## Fix: Resolve Build Errors — Wrong Import Paths, Missing TIMEOUTS Export, Circular Vendor Chunks

A build-fix commit that addresses three categories of build failure introduced by the massive refactoring in commit 0617. The diff is dominated by content-hash changes across 160+ `dist/assets/` files, but the meaningful source changes include: correcting `../../../lib/utils` → `../../../lib/cn` import paths in 8 admin section files, adding the missing `TIMEOUTS` export to `src/lib/constants.js`, fixing `useSecureUser.js` which lacked its React/Router imports, removing the duplicate `AdminPanel.cms.jsx` component (107 lines deleted), fixing `FactoryProfile.jsx` duplicate imports, and restructuring `vite.config.js` to replace the catch-all `vendor` chunk with targeted vendor bundles (vendor-motion, vendor-router, vendor-redux) to resolve circular dependency issues.

## Files Changed

| Category | Files | Additions | Deletions | Description |
|----------|-------|-----------|-----------|-------------|
| `dist/assets/*` | 130+ | 3,400+ | 3,500+ | Rebuilt JS/CSS bundles with new content hashes |
| `dist/index.html` | 1 | 12 | 12 | Updated bundled file references |
| `src/lib/constants.js` | 1 | 6 | 0 | Added `TIMEOUTS` export |
| `src/hooks/useSecureUser.js` | 1 | 5 | 0 | Added missing React/Redux imports |
| `src/pages/AdminPanel.cms.jsx` | 1 | 0 | 107 | Removed duplicate `SkeletonLine`/`Badge`/`StatCard` exports |
| `src/pages/AdminPanel.helpers.js` | 1 | 0 | 2 | Removed `eslint-disable` comment |
| `src/pages/admin/sections/Admin*Section.jsx` (8 files) | 8 | 46 | 8 | Fixed `../../../lib/utils` → `../../../lib/cn` import paths |
| `src/pages/admin/shared/index.jsx` | 1 | 2 | 1 | Fixed `../../../lib/utils` → `../../../lib/cn` + added eslint-disable |
| `src/pages/chat/MessageArea.jsx` | 1 | 1 | 1 | Fixed `UploadProgressBar` import path |
| `src/pages/BuyerRequestManagement.jsx` | 1 | 10 | 0 | Added missing import statements |
| `src/pages/ChatInterface.jsx` | 1 | 10 | 0 | Added `useNavigate`/`useLocation` + eslint-disable comments |
| `src/pages/FactoryProfile.jsx` | 1 | 1 | 3 | Fixed duplicate import + added `Landmark` |
| Server services (6 files) | 6 | 12 | 6 | Various minor fixes |
| `vite.config.js` | 1 | 6 | 1 | Replaced catch-all vendor chunk with targeted split chunks |
| `eslint.config.js` | 1 | 13 | 1 | Moved `.eslintignore` patterns into `globalIgnores` |
| `.eslintignore` | 1 | 0 | 11 | Deleted (patterns merged into eslint.config.js) |

## Detailed Diff Analysis

### Import Path Corrections — `../../../lib/utils` → `../../../lib/cn`

**Root cause**: Commit 0617 modularized `AdminPanel.jsx` but the 8 extracted section files plus `shared/index.jsx` all imported from `../../../lib/utils` for the `cn` utility. However, `cn` lives in `../../../lib/cn` (a separate file), not in `../../../lib/utils`. This causes a build error (or runtime `undefined is not a function`) because `utils.js` does not export a `cn` function.

Files fixed (each: `-1/+1` line):

| File | Old Import | New Import |
|------|-----------|------------|
| `AdminCMSSection.jsx` | `../../../lib/utils` | `../../../lib/cn` |
| `AdminHomeSection.jsx` | `../../../lib/utils` | `../../../lib/cn` |
| `AdminInfraSection.jsx` | `../../../lib/utils` | `../../../lib/cn` |
| `AdminNetworkSection.jsx` | `../../../lib/utils` | `../../../lib/cn` |
| `AdminPlatformSection.jsx` | `../../../lib/utils` | `../../../lib/cn` |
| `AdminSecuritySection.jsx` | `../../../lib/utils` | `../../../lib/cn` |
| `AdminServerSection.jsx` | `../../../lib/utils` | `../../../lib/cn` |
| `admin/shared/index.jsx` | `../../../lib/utils` | `../../../lib/cn` |

### `src/lib/constants.js` — Missing `TIMEOUTS` Export

**Root cause**: The `TIMEOUTS` constant object (with `.SHORT`, `.MEDIUM`, `.LONG` timeout values) was used across the codebase but never exported from `constants.js`. Code relying on `import { TIMEOUTS } from "../lib/constants"` would get `undefined` at runtime.

Added:
```js
export const TIMEOUTS = {
  SHORT: 300,
  MEDIUM: 1500,
  LONG: 3000,
};
```

### `src/hooks/useSecureUser.js` — Missing Imports

**Root cause**: The hook file was a JSDoc-only file in commit 0614 (no runtime code — just `@typedef` imports). When actual runtime code was added later (calling `useEffect`, `useSelector`, `useDispatch`, `getToken`, `fetchUser`), the imports were never added. This causes `ReferenceError` at module load.

Added imports:
```js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../lib/auth";
import { fetchUser } from "../store/userSlice";
```

### `src/pages/AdminPanel.cms.jsx` — Duplicate Export Removal (0/-107)

**Root cause**: When `AdminPanel.jsx` was split in commit 0617, the extracted `shared/index.jsx` took ownership of `SkeletonLine`, `Badge`, and `StatCard`. But `AdminPanel.cms.jsx` still had duplicate definitions of these same components (with identical `eslint-disable react-refresh/only-export-components` annotation, imports, and full implementations). This caused a build error due to duplicate identifier exports.

Deletions:
- `SkeletonLine` component (using `ThreeDot` from `react-loading-indicators`) — full implementation removed (import + component)
- `Badge` component with tone variants (default, sky, emerald, amber, rose, violet, blue) — full implementation removed
- `StatCard` component with gradient backgrounds and tone classes — full implementation removed (this was the second `StatCard` in the file)

The `SectionCard` component that follows these removals was preserved — it was not duplicated.

### `src/pages/AdminPanel.helpers.js` — Lint Comment Removal

**Root cause**: The `eslint-disable no-unused-vars` comment at the top was leftover from when the file had unused variables. After cleanup, having the disable creates a ESLint "unused disable directive" warning.

Removed: `/* eslint-disable no-unused-vars */` line.

### `src/pages/admin/sections/AdminPlatformSection.jsx` — Multiple Fixes (+29 lines net)

The most complex source fix. Changes include:

1. **`cn` import fix** (same as other sections): `../../../lib/utils` → `../../../lib/cn`
2. **`policyMetrics` stale closure fix**: Added new state `policyMetricsData` initialized to the `policyMetrics` prop. When the prop changes (e.g., after API refresh), the state updates via `useEffect` or direct setter. Prevents stale renders of blocked_rate, queued_to_sent_conversion, and spam_false_positive_ratio displays.
3. **`buildAdminHeaders` → `useCallback`**: Changed from plain function to `useCallback` with `[mfaCode, deviceId, passkeyValue, stepUpCode]` deps. This prevents the function identity from changing on every render, which was causing infinite re-render loops in dependent `useCallback`/`useMemo` chains.
4. **Dependency-array fixes**: `refreshModerationQueues`, `refreshMessagePolicyOps`, `refreshReportQueuesLocal`, `refreshSupportTicketsLocal`, and `handleConfirmRejection` all received proper `useCallback` dependency arrays including `buildAdminHeaders` and other closure variables they reference.
5. **Report rendering fix**: Changed `systemReportsSafe`/`productAppealReportsSafe`/`contentReportsSafe` to `systemReports`/`productAppealReports`/`contentReports` in the JSX — these were already the safe variables from the earlier state-localization logic.

### `src/pages/admin/sections/AdminNetworkSection.jsx` — useMemo Dep Fix

**Root cause**: The `filteredNetworkInventory` `useMemo` depended on `networkInventory?.devices` (a derived expression) instead of `networkInventory` (the state variable itself). While both trigger recalculations on change, `networkInventory?.devices` could be `undefined` when `networkInventory` is `null`, causing subtle bug if `networkInventory` transitions from `null` to `{ devices: [] }`.

Fixed: dep changed from `networkInventory?.devices` to `networkInventory`.

### `src/pages/admin/shared/index.jsx` — Lint Suppression Added

Added `/* eslint-disable react-refresh/only-export-components */` above the `cmsChipClass` utility function. This utility is a pure function (not a component) but ESLint's `react-refresh` plugin may flag non-component exports in files with JSX. The disable prevents a false-positive warning.

### `src/pages/chat/MessageArea.jsx` — Import Path Fix

**Root cause**: The extracted `MessageArea.jsx` (from commit 0617) imported `UploadProgressBar` from `../../components/chat/UploadProgressBar`, but the actual file lives at `../../components/ui/UploadProgressBar`.

Fixed: `../../components/chat/UploadProgressBar` → `../../components/ui/UploadProgressBar`.

### `src/pages/BuyerRequestManagement.jsx` — Missing Imports (+10 lines)

**Root cause**: The massive refactor in commit 0614 had removed most imports from this file (as part of dead-code cleanup), but the remaining code still uses functions from auth, hooks, theme, upload, and validation modules. Without imports, runtime `ReferenceError` occurs.

Added imports for: `useState`, `useMemo`, `useEffect`, `useCallback`, `apiRequest`, `getCurrentUser`, `getToken`, `hasEntitlement`, `useSecureUser`, `useEntitlements`, `useTheme`, `uploadFile`, `mapExtractedToForm`, `getBuyerRequestStepErrors`, `getBuyerRequestSubmissionErrors`, `getBuyerRequestErrorStep`, and `NeonAtom`.

### `src/pages/ChatInterface.jsx` — Scope Fix + Lint Suppressions (+10 lines)

1. **`navigate`/`location` moved to proper scope**: These were declared after `setNotice` using them in its initializer (`useState(() => location.state?.notice ?? null)`), causing a `ReferenceError` because `location` was not yet defined when the initializer ran. Fixed by moving the declarations above `setNotice`.

2. **Added `// eslint-disable-next-line react-hooks/set-state-in-effect`** to 8 `useEffect` hooks that call state setters (e.g., `setPageLoading`, `setLeadSummary`, `setAiSummary`, `setCountdownSeconds`) directly in the effect body. While this is not ideal React practice, these effects intentionally synchronize derived state — per the project convention, the explicit disable comments acknowledge the pattern.

### `src/pages/FactoryProfile.jsx` — Duplicate Import Fix (+1/-3)

**Root cause**: `BadgeCheck`, `Boxes`, `Building2`, `CalendarDays`, `Camera` were imported twice from `lucide-react` (duplicate entries in the same import statement). Also `ChevronLeft` was missing from the first duplicate block but present in the correct alphabetical position.

Fixed: Collapsed the duplicate `BadgeCheck`/`Boxes`/`Building2`/`CalendarDays`/`Camera` into one import, and added `Landmark` (which was being used in the JSX but not imported — a separate build error).

### Server Service Fixes (6 files, +12/-6)

| File | Change |
|------|--------|
| `conversationLockService.js` | Renamed `createLockNotification` → `_createLockNotification` (private convention, prevents unused function warning) |
| `imageQueue.js` | Replaced truncated/empty stub with proper queue processing: `processNext()` function that shifts items from `QUEUE` and logs processing |
| `leadService.js` | Removed unused destructured `updated2` variable from `$transaction` result |
| `requirementService.js` | Removed unused `logError` import |
| `uploadsService.js` | Added missing `logInfo, logError` imports for error logging |
| `walletService.js` | Renamed `balanceAfter` → `_balanceAfter` (unused variable convention); changed return value from `balanceAfter` to `user?.wallet_balance_usd || 0` |

### `vite.config.js` — Vendor Chunk Restructuring (+6/-1)

**Root cause**: The catch-all `if (id.includes("node_modules")) return "vendor"` in rollup's `manualChunks` caused a single massive `vendor-*.js` bundle (2,391 lines react-only, plus all other deps combined). This created circular dependency issues with `framer-motion` importing from `react` (already in vendor), and made vendor caching suboptimal — any dependency update invalidated the entire vendor bundle.

Fixed by replacing the catch-all with targeted chunk splits:
- `vendor-react`: React + ReactDOM
- `vendor-motion`: `framer-motion` (new — previously bundled into catch-all vendor)
- `vendor-router`: `react-router` (new)
- `vendor-redux`: `@reduxjs/toolkit` + `react-redux` (new)
- `vendor-icons`: `lucide-react` (unchanged)
- `vendor-security`: `dompurify` (unchanged)
- `vendor-charts`: `recharts` (unchanged)

Additionally raised `chunkSizeWarningLimit` from 500 KB to 1000 KB to suppress false-positive warnings on legitimately large vendor chunks.

### `eslint.config.js` + `.eslintignore` Deletion

**Root cause**: ESLint 9's flat config system has `globalIgnores()` which is the canonical way to ignore directories. The separate `.eslintignore` file was redundant and could cause conflicts.

Deleted `.eslintignore` (11 lines) and moved all ignore patterns into `eslint.config.js` `globalIgnores()`:
```
globalIgnores(["dist", "history", "node_modules", "docs", "*.md", "*.docx",
  "server/uploads", "scripts/*.txt", "tests/e2e/*.cypress.*",
  "pnpm-lock.yaml", "package-lock.json"])
```

### `dist/` Rebuild

All 130+ `dist/assets/` files were regenerated with new content-hash filenames. Notable changes:
- `vendor-react` split into `vendor-react-D0oTn3WI.js` (old, 2,391 lines) → `vendor-react-g6Li9OLm.js` (new, 2,424 lines — includes framer-motion that was previously in catch-all)
- `vendor-motion-C-xd8CSk.js` (new, 9 lines — thin re-export/entry)
- `vendor-redux-Dq19LI2y.js` (new, 1 line — re-export entry)
- `vendor-router` not present as standalone file (likely inlined into the react chunk or tree-shaken)
- `vendor-mDMHlejg.js` (old catch-all, 288 lines) deleted
- `vendor-charts-BqQZNk6A.js` (new, 59 lines) — same size as old, new hash
- `vendor-icons-DaXXaHSK.js` (new, 383 lines, +383/-? from old) — icon tree-shaking may have shifted content
- `index-C8ZAG3sf.js` (new main entry, 319 lines) replaces `index-RdONC1D4.js` (240 lines deleted)
- New files added: `pdf-D-oSvAqu.js` (+55), `pdf.worker-BUWz98b6.js` (+1), `xlsx-CkFp8p6R.js` (+105), `startAuthentication-BfX2JIkb.js` (+1), `upload-SuhAPaRx.js` (+1)
- `dist/index.html` updated to reference new content-hashed filenames (+12/-12)

## Why This Change Was Needed

Commit 0617 introduced three categories of build-breaking bugs:

1. **Wrong import paths**: The 8 extracted admin section files imported `cn` from `../../../lib/utils` instead of `../../../lib/cn`. This causes either a build-time module-not-found error or a runtime `cn is not a function` error.

2. **Missing exports/imports**: `TIMEOUTS` was referenced but never exported from `constants.js`. `useSecureUser.js` had no React/Redux imports despite calling hook functions. `BuyerRequestManagement.jsx` was missing ~16 imports after the dead-code cleanup in 0614. `UploadProgressBar` import path in `MessageArea.jsx` pointed to the wrong directory.

3. **Circular vendor chunks**: The catch-all `if (id.includes("node_modules")) return "vendor"` caused a single massive vendor bundle with circular dependencies (framer-motion imports from react, which was already in the same vendor chunk). Replacing with targeted splits resolves the circular issue and enables better caching granularity.

## Was It Useful

**Critical** — Without this commit, the project would not build. The import path errors, missing exports, and circular vendor dependencies each independently cause build failures. The duplicate `AdminPanel.cms.jsx` exports would cause runtime module resolution errors.

## Impact Analysis

- **Build status**: Restored from broken to passing. The project can be built and deployed again.
- **Vendor chunking**: Replaced a single 2,700+ line vendor bundle with 7 targeted chunks. Enables better long-term caching (only changed dependency groups invalidate their chunk).
- **Admin section modules**: All 9 files now import `cn` from the correct module. The duplicate component definitions in `AdminPanel.cms.jsx` are removed.
- **Server services**: 6 services received minor fixes — unused variable cleanup, missing imports, and function renames to suppress warnings.
- **ESLint config**: `.eslintignore` deleted — all patterns consolidated into `eslint.config.js` `globalIgnores()`.
- **dist/**: All 130+ bundles rebuilt with correct content hashes. New `pdf.js`, `xlsx.js`, and `startAuthentication.js` chunk entries added.
- **Performance**: Targetted vendor chunks reduce the per-page JS payload. Only the vendor groups needed by each page are loaded, rather than the monolithic vendor bundle.

## Relationship to Surrounding Commits

Parent is commit 0618 (the history documentation commit). Commit 0617 (the massive refactor) introduced the bugs that this commit fixes. The immediate ancestor chain is 0617 (refactor) → 0618 (docs) → 0619 (build fixes), with 0618 and 0619 both created on 2026-07-25. This is a classic "documentation commit followed by bugfix commit" pattern — the docs were written before the build issues were discovered.

## Confidence Notes

High for the import-path and missing-export fixes (these are straightforward corrections verified by build success). High for the vendor chunk restructuring (targeted splits are the recommended Vite pattern and the catch-all was the root cause of the circular dependency). Moderate for the `AdminPlatformSection.jsx` refactoring — the `policyMetricsData` state addition, `buildAdminHeaders` useCallback conversion, and dependency array corrections are more invasive changes that could introduce new bugs if other code paths depend on `policyMetrics` being the raw prop. However, the diff shows all changes follow established patterns in the file and the build succeeds.
