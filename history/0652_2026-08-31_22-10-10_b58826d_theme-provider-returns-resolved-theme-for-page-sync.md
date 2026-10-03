# Commit 0652 — b58826d

| Field | Value |
|-------|-------|
| **Commit Number** | 0652 |
| **Commit Hash** | b58826d85e0e7e132fcf51763d57d5bb29fd1252 |
| **Parent Hash** | 556c04b6d56c69f5e47fa1e7f143956de9e4f8d8 |
| **Author** | Tokyi |
| **Date/Time** | 2026-08-31 22:10:10 |
| **Branch** | main |
| **Files Changed** | 46 |
| **Additions** | 76 |
| **Deletions** | 66 |
| **Net Change** | +76/−66 |
| **Merge Commit** | No |

## ThemeProvider Returns Resolved Theme Instead of System String

This commit fixes a bug where the ThemeProvider's `useTheme()` hook returned the raw theme mode string (e.g., `"system"`) instead of the resolved theme (`"dark"` or `"light"`). This caused pages that compared `theme === "dark"` to fail when the mode was set to "system", since `"system" !== "dark"`. The fix adds a `resolveTheme()` function that converts `"system"` to the actual OS preference, and exposes both the resolved theme and the original mode.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `src/lib/ThemeProvider.jsx` | Source | 14 | 4 | +10 |
| `dist/assets/index-*.js` | Built | 40 | 36 | +4 |
| `dist/assets/*.js` (44 files) | Built | 44 | 44 | 0 |
| `dist/index.html` | Built | 2 | 2 | 0 |

## Detailed Diff Analysis

### `src/lib/ThemeProvider.jsx` (+14/−4)

**New `resolveTheme()` helper:**
```jsx
function resolveTheme(mode) {
    if (mode === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return mode === "dark" ? "dark" : "light";
}
```

**Updated `ThemeProvider` component:**
```jsx
// Before:
<ThemeContext.Provider value={{
    theme,  // Could be "system", "dark", or "light"
    ...
}}>

// After:
const resolved = useMemo(() => resolveTheme(theme), [theme]);
<ThemeContext.Provider value={{
    theme: resolved,      // Always "dark" or "light" (never "system")
    themeMode: theme,     // Original mode including "system"
    resolvedTheme: resolved, // Alias for clarity
    ...
}}>
```

**Key changes:**
1. Added `useMemo` import
2. Added `resolveTheme()` function that converts "system" to actual OS preference
3. Added `resolved` memo that recalculates when `theme` changes
4. Context now provides `theme: resolved` (always concrete dark/light)
5. Context also provides `themeMode: theme` (original mode including "system")
6. Added `resolvedTheme` as an alias for `resolved`

### `dist/assets/index-*.js` (+40/−36)

Built main bundle reflecting ThemeProvider changes. Moderate size increase due to the new function and useMemo hook.

### `dist/assets/*.js` (44 files, +44/−44)

All distribution files rebuilt with new chunk hashes.

### `dist/index.html` (+2/−2)

Updated references to new chunk hashes.

## Why This Change Was Needed

When the user selected "system" as their theme preference, the ThemeProvider passed the string `"system"` to consuming components. Components like OrgSettings compared `theme === "light"` or `theme === "dark"` to determine which theme button to highlight. Since `"system" !== "light"` and `"system" !== "dark"`, no button appeared highlighted, and some components may have failed to apply the correct styles.

Additionally, components using `theme` to set CSS classes (e.g., `dark:bg-slate-800`) needed a concrete "dark" or "light" value, not the abstract "system" mode.

## Was It Useful

Very useful. This fix ensures all components receive a concrete theme value, enabling proper dark/light mode switching and UI indicator highlighting.

## Impact Analysis

- **Theme Consistency:** All pages now receive "dark" or "light" instead of "system"
- **UI Indicators:** Theme pickers can correctly highlight the active theme
- **CSS Classes:** Dark/light mode classes work correctly regardless of mode setting
- **Backward Compatibility:** `themeMode` preserves the original mode for components that need it

## Relationship to Surrounding Commits

Followes the Prisma migration fix (commit 0651) and precedes the OrgSettings theme picker fix (commit 0653). This commit provides the foundation that commit 0653 builds upon.

## Confidence Notes

**Confidence: High** — The fix is well-reasoned and the `resolveTheme()` function correctly handles all three modes. The `useMemo` ensures the resolved value only recalculates when the mode changes.

## Optional Technical Details

- `window.matchMedia("(prefers-color-scheme: dark)")` reads the OS dark mode preference
- The resolved theme is memoized to avoid unnecessary recalculations
- Components that need the original mode (for system/light/dark button highlighting) should use `themeMode` instead of `theme`
- The `resolvedTheme` alias provides semantic clarity for components that explicitly need the resolved value
