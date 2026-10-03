# Commit 0727 — 21cc9d6

| Field | Value |
|-------|-------|
| **Commit Number** | 0727 |
| **Commit Hash** | 21cc9d6fa106649eaeeca45981540567717e7693 |
| **Parent Hash** | 54e52e7dec458715f34a3735a1fccf2ba6d400d9 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-19 20:14:54 |
| **Branch** | main |
| **Files Changed** | 2 |
| **Additions** | 2 |
| **Deletions** | 2 |
| **Net Change** | +2/-2 |
| **Merge Commit** | No |

## Fix TDZ Crash: Move getCurrentUser() Before useMemo That References User

This commit fixes a Temporal Dead Zone (TDZ) crash in `NavBar.jsx` where `getCurrentUser()` was called after a `useMemo` hook that referenced the `user` variable. In JavaScript, `const` and `let` declarations are hoisted but not initialized — accessing them before their declaration line throws a `ReferenceError`. Since React hooks are called sequentially during render, the `useMemo` at line 186 (`validPublicLinks`) executed before `getCurrentUser()` was assigned at what was previously line 228, causing a crash on certain render paths.

The fix moves `const user = getCurrentUser()` to line 186, immediately after the state declarations and before the `useMemo` calls. Additionally, this commit changes the Vite sourcemap setting from `true` to `"hidden"`, which generates sourcemap files without embedding `//# sourceMappingURL` comments in the bundles — a more production-appropriate configuration that still allows error tracking services to use sourcemaps while keeping them invisible to casual DevTools inspection.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `src/components/NavBar.jsx` | Modified | 1 | 1 | 0 |
| `vite.config.js` | Modified | 1 | 1 | 0 |

## Detailed Diff Analysis

**NavBar.jsx** (line 186):
```jsx
// Before (line 228):
const user = getCurrentUser();

// After (line 186, moved before useMemo):
const user = getCurrentUser();
```

The `getCurrentUser()` call was moved from line 228 (after several `useMemo` and `useCallback` hooks) to line 186 (right after state declarations). This ensures `user` is defined before any hook that references it.

**vite.config.js** (line 51):
```js
// Before:
sourcemap: true,

// After:
sourcemap: "hidden",
```

Changes sourcemap mode from fully visible to hidden (no `//# sourceMappingURL` in output).

## Why This Change Was Needed

The TDZ crash was a runtime error that could crash the NavBar component and potentially the entire application on certain render paths. The `validPublicLinks` useMemo at line 186 filtered `publicLinks` using `isRouteValid(link.to)`, but the `user` variable (needed for role-based filtering in other hooks) was declared much later. While the specific useMemo at line 186 might not directly reference `user`, other hooks between lines 186-228 did, and the sequential execution of hooks during render meant the TDZ violation occurred.

The sourcemap change from `true` to `"hidden"` was a correction to the previous commit (0726) — full sourcemaps in production expose source code to anyone using DevTools, while `"hidden"` sourcemaps are only accessible to error tracking services that have the mapping files.

## Was It Useful

Yes. This fixes a crash that would have been difficult to reproduce in development (where the render order might differ) but could manifest in production. The sourcemap change is also a security/privacy improvement.

## Impact Analysis

- **Scope**: Two small, targeted fixes — one component bug, one build config improvement.
- **Risk**: Very low. Moving a function call earlier in the render flow has no side effects (getCurrentUser is a pure read from cache/localStorage). The sourcemap change only affects build output visibility.
- **Benefit**: Eliminates a potential runtime crash and improves production build hygiene.

## Relationship to Surrounding Commits

- **Follows**: Commit 0726 (enabled production sourcemaps) — this commit refines that setting to `"hidden"`.
- **Precedes**: Commit 0728 (large dead code removal + UI fixes) — theNavBar fix ensures the app is stable before the large refactor.
- This is a critical bug fix that unblocks the subsequent development work.

## Confidence Notes

- The TDZ issue is well-understood: `const`/`let` declarations are not accessible before their declaration line in JavaScript.
- The fix is minimal and correct — no logic changes, just reordering.
- The sourcemap change is a standard production practice.

## Optional Technical Details

- `getCurrentUser()` reads from an in-memory cache or localStorage (see `src/lib/auth.js`). It's a synchronous, side-effect-free call that returns the cached user object or null.
- The TDZ error would manifest as: `ReferenceError: Cannot access 'user' before initialization` in the browser console.
- Vite's `"hidden"` sourcemap mode generates `.map` files but does not add the `//# sourceMappingURL=` comment to the end of JS bundles, making sourcemaps invisible in DevTools Network tab but still usable by tools like Sentry.
