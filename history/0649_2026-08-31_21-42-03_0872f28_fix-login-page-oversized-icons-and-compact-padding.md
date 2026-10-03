# Commit 0649 — 0872f28

| Field | Value |
|-------|-------|
| **Commit Number** | 0649 |
| **Commit Hash** | 0872f28334231fba8b0d48e3441aa7055f5f045b |
| **Parent Hash** | 77db4874d33a7b8f458879333b5cfa64086cd541 |
| **Author** | Tokyi |
| **Date/Time** | 2026-08-31 21:42:03 |
| **Branch** | main |
| **Files Changed** | 49 |
| **Additions** | 55 |
| **Deletions** | 55 |
| **Net Change** | +55/−55 |
| **Merge Commit** | No |

## Fix Login Page Oversized SVG Icons and Compact Button/Input Padding

This commit fixes two visual issues on the login page: SVG icons were rendered at incorrect sizes because the `Icon` component used `class` instead of `className` for the SVG element's class attribute, and button/input elements had excessive padding making them appear oversized. The fix changes the `Icon` component to use `className` (React's correct prop name for SVG elements) and reduces vertical padding on inputs and buttons.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `src/pages/auth/Login.jsx` | Source | 6 | 6 | 0 |
| `dist/assets/Login-*.js` | Built | 2 | 2 | 0 |
| `dist/assets/index-*.css` | Built | 1 | 1 | 0 |
| `dist/assets/*.js` (45 files) | Built | 47 | 47 | 0 |
| `dist/index.html` | Built | 2 | 2 | 0 |

## Detailed Diff Analysis

### `src/pages/auth/Login.jsx` (+6/−6)

**Icon component fix:**
```jsx
// Before:
const Icon = ({ d, className = "" }) => (
    <svg ... class={className}>

// After:
const Icon = ({ d, className = "" }) => (
    <svg ... className={className}>
```

In React, SVG elements must use `className` instead of `class` for the class attribute to work correctly. The `class` attribute was being silently ignored, causing SVG icons to lose their sizing classes.

**Padding reductions:**
- Email/Agent ID input: `py-3` → `py-2.5` (−0.5 units)
- Password input: `py-3` → `py-2.5` (−0.5 units)
- Sign in button: `py-4` → `py-3` (−1 unit)
- Passkey login button: `py-4` → `py-3` (−1 unit)
- Enroll button: `py-4` → `py-3` (−1 unit)

### `dist/assets/Login-*.js` (+2/−2)

Built JavaScript reflecting the source changes. New chunk hash.

### `dist/assets/index-*.css` (+1/−1)

CSS updates from the rebuild.

### `dist/assets/*.js` (45 files, +47/−47)

All distribution JavaScript files rebuilt with new chunk hashes due to the source change affecting the build graph.

### `dist/index.html` (+2/−2)

Updated script/CSS references to new chunk hashes.

## Why This Change Was Needed

The login page had two visual issues:
1. **Oversized icons:** The `Icon` component passed `class` to SVG elements, but React requires `className`. Without proper class application, Tailwind CSS sizing utilities (`h-4 w-4`) weren't applied, causing icons to render at their intrinsic SVG size (typically 24×24) rather than the intended 16×16.
2. **Oversized padding:** Buttons and inputs had padding values that made them appear larger than the design intended, particularly on mobile viewports.

## Was It Useful

Very useful. These are visual polish fixes that directly improve the login page appearance. The icon fix is particularly important as it affects all icon components throughout the login form (email icon, password icon, fingerprint icon, badge icon).

## Impact Analysis

- **Login Page:** Icons now render at correct sizes, buttons/inputs have tighter spacing
- **Consistency:** Icon component now follows React conventions for SVG elements
- **User Experience:** More compact, properly proportioned login form

## Relationship to Surrounding Commits

Follows the Ink TUI fix (commit 0648) and precedes the Icon component dual-prop fix (commit 0650). This commit addresses the immediate symptom; the next commit addresses the root cause more thoroughly.

## Confidence Notes

**Confidence: High** — The diff is clear and focused. The `class` → `className` change is the core fix, with padding reductions as additional polish. All other file changes are build artifacts from the rebuild.

## Optional Technical Details

- React's `className` prop is mapped to the DOM `class` attribute
- Tailwind CSS utility classes like `h-4 w-4` require proper class application
- The padding changes use Tailwind's spacing scale (0.25rem per unit)
