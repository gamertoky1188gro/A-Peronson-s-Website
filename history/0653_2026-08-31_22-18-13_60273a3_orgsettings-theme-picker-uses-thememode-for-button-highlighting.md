# Commit 0653 — 60273a3

| Field | Value |
|-------|-------|
| **Commit Number** | 0653 |
| **Commit Hash** | 60273a3e6ce67627a769bfd4901f2503c36c4952 |
| **Parent Hash** | b58826d85e0e7e132fcf51763d57d5bb29fd1252 |
| **Author** | Tokyi |
| **Date/Time** | 2026-08-31 22:18:13 |
| **Branch** | main |
| **Files Changed** | 47 |
| **Additions** | 50 |
| **Deletions** | 50 |
| **Net Change** | +50/−50 |
| **Merge Commit** | No |

## OrgSettings Theme Picker Uses themeMode for System/Light/Dark Button Highlighting

This commit updates the OrgSettings page's theme picker to use `themeMode` (the original mode string) instead of `theme` (the resolved dark/light value) for determining which theme button to highlight. This is necessary because after commit 0652, `theme` is always "dark" or "light" (never "system"), so the system button could never appear highlighted.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `src/pages/OrgSettings.jsx` | Source | 5 | 3 | +2 |
| `dist/assets/OrgSettings-*.js` | Built | 1 | 1 | 0 |
| `dist/assets/*.js` (45 files) | Built | 45 | 45 | 0 |
| `dist/index.html` | Built | 2 | 2 | 0 |

## Detailed Diff Analysis

### `src/pages/OrgSettings.jsx` (+5/−3)

**Destructure `themeMode` from useTheme:**
```jsx
// Before:
const { theme, toggleTheme, setTheme } = useTheme();

// After:
const { theme, themeMode, toggleTheme, setTheme } = useTheme();
```

**Theme button highlighting updates:**
```jsx
// Light button:
- theme === "light" ? "border-sky-500 bg-sky-50 ..." : "border-slate-200 ..."
+ themeMode === "light" ? "border-sky-500 bg-sky-50 ..." : "border-slate-200 ..."

// Dark button:
- theme === "dark" ? "border-sky-500 bg-sky-50 ..." : "border-slate-200 ..."
+ themeMode === "dark" ? "border-sky-500 bg-sky-50 ..." : "border-slate-200 ..."

// System button:
- theme === "system" ? "border-sky-500 bg-sky-50 ..." : "border-slate-200 ..."
+ themeMode === "system" ? "border-sky-500 bg-sky-50 ..." : "border-slate-200 ..."
```

All three theme buttons (light, dark, system) now compare against `themeMode` instead of `theme`. This ensures:
- When mode is "system", the system button is highlighted (not none)
- When mode is "light", the light button is highlighted
- When mode is "dark", the dark button is highlighted

### `dist/assets/OrgSettings-*.js` (+1/−1)

Built JavaScript reflecting the source change. New chunk hash.

### `dist/assets/*.js` (45 files, +45/−45)

All distribution files rebuilt with new chunk hashes.

### `dist/index.html` (+2/−2)

Updated references to new chunk hashes.

## Why This Change Was Needed

After commit 0652 changed `theme` to always be "dark" or "light" (never "system"), the OrgSettings theme picker broke:
- When mode was "system", `theme` was "dark" (or "light"), so `theme === "system"` was false → no button highlighted
- The light and dark buttons would compare against `theme`, but since `theme` was now the resolved value, the highlighting logic was semantically wrong

By using `themeMode`, the button highlighting correctly reflects the user's chosen mode, not the resolved appearance.

## Was It Useful

Essential follow-up to commit 0652. Without this fix, the theme picker in OrgSettings would never highlight the "system" button, and the light/dark highlighting would be based on the resolved value rather than the user's intent.

## Impact Analysis

- **OrgSettings:** Theme picker correctly highlights the active mode (system/light/dark)
- **User Feedback:** Users can see which theme mode is currently selected
- **Consistency:** Button highlighting aligns with the actual mode setting

## Relationship to Surrounding Commits

Follows the ThemeProvider fix (commit 0652) which provides the `themeMode` property. This commit consumes that new property to fix the theme picker UI.

## Confidence Notes

**Confidence: High** — The change is minimal and focused. Three comparison operators change from `theme` to `themeMode`, and one destructuring adds `themeMode`. The logic is straightforward.

## Optional Technical Details

- The highlighted state applies Tailwind CSS classes: `border-sky-500 bg-sky-50 text-sky-700` (light mode) and dark mode variants
- The unhighlighted state uses `border-slate-200 text-slate-600` with hover effects
- The `cx()` utility (likely clsx or similar) handles conditional class merging
