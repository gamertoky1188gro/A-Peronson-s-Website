# Commit 0661 — e772eb6

| Field | Value |
|-------|-------|
| **Commit Number** | 0661 |
| **Commit Hash** | e772eb66bb263b142bc3a41a8be2aa2b458d5691 |
| **Parent Hash** | 5a7fa642b40bcbe97c99d9536a48a16b50d3cfc2 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 17:19:34 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 14 |
| **Deletions** | 7 |
| **Net Change** | +14/-7 |
| **Merge Commit** | No |

## enable-content-mode-toggle-redirect-unauthenticated-users-to-login

Activates the previously disabled content mode toggle button on the TexHub page. The toggle was a cosmetic placeholder — a `disabled={true}` button with `cursor-not-allowed` styling and 50% opacity. Now it's a functional switch that toggles between "professional" and "diverse" content modes, with authentication gating: unauthenticated users are redirected to `/login` when they click the toggle.

**Changes in src/pages/TexHub.jsx:**
1. Added `useNavigate` import from `react-router-dom`.
2. Added `const navigate = useNavigate()` hook call.
3. Replaced the disabled button with a functional one that:
   - Checks `isLoggedIn` state on click
   - If logged in: toggles `mode` between "professional" and "diverse" via `setMode((m) => (m === "professional" ? "diverse" : "professional"))`
   - If not logged in: navigates to `/login`
4. Updated button classes: removed `disabled`, `cursor-not-allowed`, `opacity-50`; added `cursor-pointer`, `transition-colors`
5. The button's visual appearance (size, shape, colors) remains unchanged — it still shows the same animated pill toggle with `motion.div`.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/pages/TexHub.jsx | edit | 14 | 7 | +7 |

## Detailed Diff Analysis

**Before:**
```jsx
<button
    type="button"
    disabled={true}
    aria-label="Toggle content mode"
    className="relative h-8 w-16 cursor-not-allowed rounded-full bg-slate-200 p-1 opacity-50 dark:bg-slate-800"
>
```

**After:**
```jsx
<button
    type="button"
    onClick={() => {
        if (isLoggedIn) {
            setMode((m) => (m === "professional" ? "diverse" : "professional"));
        } else {
            navigate("/login");
        }
    }}
    aria-label="Toggle content mode"
    className="relative h-8 w-16 cursor-pointer rounded-full bg-slate-200 p-1 transition-colors dark:bg-slate-800"
>
```

The `isLoggedIn` state was already present in the component (set from `getToken()` on mount). The `mode` state was also already present — it controlled which content feed layout was displayed. The toggle just needed to be wired up.

## Why This Change Was Needed

The content mode toggle was built as a UI element but left disabled during development. Enabling it completes the feature and allows users to switch between curated professional content and a more diverse content mix.

## Was It Useful

Yes. It completes a partially implemented feature. The authentication gate prevents anonymous users from accessing content mode switching, which may be a premium feature.

## Impact Analysis

- **Feature completeness:** Content mode toggle is now functional.
- **User experience:** Authenticated users can switch content modes; unauthenticated users get a login prompt.
- **Risk:** Low. The toggle state is local React state — no server-side implications.

## Relationship to Surrounding Commits

This continues the TexHub page improvements started in 0660 (zoom fix, copy changes). The subsequent commit 0662 addresses the floating assistant panel behavior on mobile.

## Confidence Notes

- The `isLoggedIn` state and `mode` state were already declared in the component — this commit only wires up the onClick handler.
- The `useNavigate` hook is the standard React Router v6 navigation method.

## Optional Technical Details

- The mode state default is `"professional"` — the `setMode` callback uses a functional update to toggle between the two values.
- The `motion.div` inside the button (the animated pill indicator) already had layout animation configured — it slides left/right based on the mode state.
- The button's visual feedback (the pill position) was already animated via Framer Motion's `layout` prop, so no additional animation code was needed.
