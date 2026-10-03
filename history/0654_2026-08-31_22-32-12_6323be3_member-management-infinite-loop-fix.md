# Commit 0654 — 6323be3

| Field | Value |
|-------|-------|
| **Commit Number** | 0654 |
| **Commit Hash** | 6323be396eae93cb2bbd2b520f6d95319b32cf17 |
| **Parent Hash** | 60273a3e6ce67627a769bfd4901f2503c36c4952 |
| **Author** | Tokyi |
| **Date/Time** | 2026-08-31 22:32:12 |
| **Branch** | main |
| **Files Changed** | 47 |
| **Additions** | 47 |
| **Deletions** | 51 |
| **Net Change** | +47/−51 |
| **Merge Commit** | No |

## Fix MemberManagement Infinite Loop from loadMembers Recreated Every Render

This commit fixes an infinite loop bug in the MemberManagement page where the `loadMembers` function was being recreated on every render, causing its `useEffect` dependency to trigger endlessly. The fix removes `loadMembers` from the `useEffect` dependencies array and removes the associated ESLint disable comments, allowing the effect to run only once on mount.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `src/pages/MemberManagement.jsx` | Source | 1 | 5 | −4 |
| `dist/assets/MemberManagement-*.js` | Built | 1 | 1 | 0 |
| `dist/assets/*.js` (45 files) | Built | 45 | 45 | 0 |
| `dist/index.html` | Built | 2 | 2 | 0 |

## Detailed Diff Analysis

### `src/pages/MemberManagement.jsx` (+1/−5)

**Before:**
```jsx
useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembers,
]);
```

**After:**
```jsx
useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

**Changes:**
1. Removed `loadMembers` from the `useEffect` dependency array
2. Removed the `react-hooks/set-state-in-effect` ESLint disable comments (3 instances)
3. Kept the `react-hooks/exhaustive-deps` disable comment (1 instance) since the effect intentionally runs only on mount

### `dist/assets/MemberManagement-*.js` (+1/−1)

Built JavaScript reflecting the source change. New chunk hash.

### `dist/assets/*.js` (45 files, +45/−45)

All distribution files rebuilt with new chunk hashes.

### `dist/index.html` (+2/−2)

Updated references to new chunk hashes.

## Why This Change Was Needed

The `loadMembers` function was likely defined inside the component body or was a state-setting function that got a new reference on every render. When included in the `useEffect` dependency array, React detected a "new" dependency on every render, causing the effect to re-run, which called `loadMembers`, which triggered a state update, which caused a re-render, which created a new `loadMembers` reference — an infinite loop.

By removing `loadMembers` from the dependencies, the effect only runs once on mount (similar to `componentDidMount`). The `eslint-disable-next-line react-hooks/exhaustive-deps` comment acknowledges this intentional omission.

## Was It Useful

Essential bug fix. Infinite loops in React cause:
- Continuous network requests (if `loadMembers` fetches data)
- High CPU usage from constant re-renders
- Potential browser tab freezing
- Poor user experience

## Impact Analysis

- **Performance:** Eliminates infinite render loop
- **Network:** Prevents continuous API calls to fetch members
- **User Experience:** MemberManagement page loads once and displays correctly
- **CPU:** No longer pegs the browser's main thread

## Relationship to Surrounding Commits

Follows the OrgSettings theme picker fix (commit 0653). This is a standalone bug fix unrelated to the theme system changes.

## Confidence Notes

**Confidence: High** — The infinite loop pattern (dependency that recreates on every render → effect re-runs → state updates → re-render) is a well-known React anti-pattern. The fix of removing the dependency and running only on mount is the standard solution.

## Optional Technical Details

- The `loadMembers` function likely calls `setState` internally, which triggers re-renders
- React's `useEffect` compares dependencies by reference (`Object.is`)
- A new function reference on every render means the dependency always appears "changed"
- The fix follows the common pattern of "mount-only" effects with empty dependency arrays
- The remaining ESLint disable for `exhaustive-deps` is necessary because `loadMembers` may reference state variables that are stable but not in scope
