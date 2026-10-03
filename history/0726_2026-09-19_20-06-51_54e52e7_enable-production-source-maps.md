# Commit 0726 — 54e52e7

| Field | Value |
|-------|-------|
| **Commit Number** | 0726 |
| **Commit Hash** | 54e52e7dec458715f34a3735a1fccf2ba6d400d9 |
| **Parent Hash** | fa2efeed051a6e2d39f72115e3ca78b0d88f7671 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-19 20:06:51 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 1 |
| **Net Change** | +1/-1 |
| **Merge Commit** | No |

## Enable Production Source Maps for Debugging

This commit changes the Vite build configuration to always generate source maps regardless of the environment. Previously, source maps were conditionally disabled in production (`sourcemap: process.env.NODE_ENV !== "production"`), which meant production builds shipped without sourcemaps, making it impossible to debug minified/bundled code in the browser's DevTools. The change sets `sourcemap: true` unconditionally, enabling source map generation for all builds including production.

This is a common debugging aid during active development and bug-fixing phases. When a production error occurs, the stack traces will map back to the original source files rather than showing minified variable names and line numbers. The trade-off is a slightly larger build output and the exposure of original source structure to end users via DevTools, but this is acceptable during development and early deployment phases.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `vite.config.js` | Modified | 1 | 1 | 0 |

## Detailed Diff Analysis

```js
// Before:
sourcemap: process.env.NODE_ENV !== "production",

// After:
sourcemap: true,
```

A single line change in `vite.config.js` within the `build` configuration block (line 51). The ternary condition that suppressed sourcemaps in production is replaced with a hardcoded `true`.

## Why This Change Was Needed

The project was entering a debugging and verification phase where production errors needed to be traceable back to source. Without production sourcemaps, any runtime error in the deployed build would show only minified code locations, making debugging significantly harder. This was likely motivated by upcoming bug-fix commits (0727, 0728, 0729, 0730) that required inspecting production behavior.

## Was It Useful

Yes. Enabling production sourcemaps during an active bug-fix sprint is a standard best practice. It allows the developer to use browser DevTools to inspect the original source code even in the deployed build, dramatically reducing debugging time.

## Impact Analysis

- **Scope**: Build configuration only; no source code changes.
- **Risk**: Low. The only downside is slightly larger bundle output (sourcemap files are separate `.map` files that browsers only fetch on demand). Source code is visible to anyone who opens DevTools, but this is acceptable for a private B2B platform.
- **Benefit**: Full debuggability in production builds.

## Relationship to Surrounding Commits

- **Follows**: Commit 0725 (audit rephrasing to past tense) — documentation cleanup.
- **Precedes**: Commit 0727 (TDZ crash fix in NavBar) — the next commit benefits from having sourcemaps enabled to diagnose the crash.
- This is part of the production-readiness preparation before the large feature/cleanup commits (0728, 0729).

## Confidence Notes

- This is a standard Vite configuration change with no ambiguity.
- The next commit (0727) will change this to `"hidden"` for a more production-appropriate setting.

## Optional Technical Details

- Vite's `sourcemap: true` generates separate `.map` files alongside the bundled `.js` files.
- The `"hidden"` variant (used in 0727) generates sourcemaps without adding `//# sourceMappingURL` comments to the bundles, which is more appropriate for production as it keeps sourcemaps available for error tracking services but not directly accessible via DevTools without configuration.
