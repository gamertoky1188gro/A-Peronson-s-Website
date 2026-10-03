# Commit 0650 — 4f599c6

| Field | Value |
|-------|-------|
| **Commit Number** | 0650 |
| **Commit Hash** | 4f599c616f40c4ed3955339895f5293042debcb9 |
| **Parent Hash** | 0872f28334231fba8b0d48e3441aa7055f5f045b |
| **Author** | Tokyi |
| **Date/Time** | 2026-08-31 21:47:53 |
| **Branch** | main |
| **Files Changed** | 49 |
| **Additions** | 51 |
| **Deletions** | 51 |
| **Net Change** | +51/−51 |
| **Merge Commit** | No |

## Icon Component Dual-Prop Support for Both class and className

This commit updates the `Icon` component in the Login page to accept both `class` and `className` props, ensuring SVG icons render at the correct size regardless of which prop name is used by callers. The previous commit (0649) changed `class` to `className` on the SVG element, but this commit makes the component more resilient by accepting either prop.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `src/pages/auth/Login.jsx` | Source | 2 | 2 | 0 |
| `dist/assets/Login-*.js` | Built | 2 | 2 | 0 |
| `dist/assets/index-*.css` | Built | 1 | 1 | 0 |
| `dist/assets/*.js` (45 files) | Built | 47 | 47 | 0 |
| `dist/index.html` | Built | 2 | 2 | 0 |

## Detailed Diff Analysis

### `src/pages/auth/Login.jsx` (+2/−2)

**Icon component update:**
```jsx
// Before:
const Icon = ({ d, className = "" }) => (
    <svg ... className={className}>

// After:
const Icon = ({ d, className: cn, class: cls }) => (
    <svg ... className={cn || cls}>
```

The component now destructures both `className` (aliased as `cn`) and `class` (aliased as `cls`), using `cn || cls` for the SVG's `className` attribute. This ensures:
- Standard React usage (`className="h-4 w-4"`) works
- Non-standard usage (`class="h-4 w-4"`) also works
- The component is backward-compatible with any callers using either prop name

### `dist/assets/Login-*.js` (+2/−2)

Built JavaScript reflecting the source change. New chunk hash.

### `dist/assets/*.js` (45 files, +47/−47)

All distribution files rebuilt with new hashes due to source graph change.

### `dist/index.html` (+2/−2)

Updated references to new chunk hashes.

## Why This Change Was Needed

While commit 0649 fixed the immediate issue by changing `class` to `className`, some third-party libraries or non-standard code patterns may still pass `class` as a prop to components. By accepting both prop names, the `Icon` component becomes more robust and avoids future issues if callers use the wrong prop name.

## Was It Useful

Useful defensive improvement. This is a minor but important robustness fix that prevents the icon sizing issue from recurring if any code path uses `class` instead of `className`.

## Impact Analysis

- **Component Resilience:** Icon component now handles both prop naming conventions
- **Backward Compatibility:** Existing code using `class` prop continues to work
- **Future-Proofing:** New code using `className` also works correctly

## Relationship to Surrounding Commits

Follows commit 0649 (which fixed `class` → `className`) and precedes the Prisma migration fix (commit 0651). This commit is the "belt and suspenders" approach to the same issue.

## Confidence Notes

**Confidence: High** — The change is minimal and focused. The destructuring pattern `({ d, className: cn, class: cls })` is a standard React idiom for dual-prop support.

## Optional Technical Details

- The `||` operator means `className` takes precedence over `class` when both are provided
- This pattern is commonly used in component libraries that need to support multiple API styles
- The component is small enough that this dual-prop approach doesn't add meaningful complexity
