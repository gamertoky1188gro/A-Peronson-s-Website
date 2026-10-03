# Commit 0663 — c38f6da

| Field | Value |
|-------|-------|
| **Commit Number** | 0663 |
| **Commit Hash** | c38f6da0c7af59528a0c2bbdd6237b0fbe957c6a |
| **Parent Hash** | 434285ebbdd779a5cf37edcf5bf3cba9a9807986 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 17:58:34 |
| **Branch** | main |
| **Files Changed** | 3 |
| **Additions** | 8 |
| **Deletions** | 12 |
| **Net Change** | +8/-12 |
| **Merge Commit** | No |

## cleanup-signup-positions-error-placement-and-unused-fonts

Three small cleanup changes across the signup flow and global HTML: (1) remove "Logistics Coordinator" and "Designer" from the POSITIONS array (not relevant for a B2B textile marketplace), (2) move the password mismatch error banner from the top of the form to immediately above the submit button, and (3) remove unused Space Grotesk and Sora Google Fonts from the HTML preload.

**Position removal (src/pages/auth/Signup.jsx + SignupUltra.jsx):** Both signup pages share an identical `POSITIONS` array. "Logistics Coordinator" and "Designer" were removed — these roles don't exist in the B2B textile manufacturing domain. The remaining positions (Compliance Officer, Sourcing Manager, Supply Chain Manager, Industrial Engineer, Textile Technologist, Pattern Master, Supervisor, Executive, Procurement Officer, Sample Master, Finishing Supervisor, Store In-Charge) are all relevant textile industry roles.

**Error banner relocation (src/pages/auth/Signup.jsx):** The `{error && (...)}` block was moved from before the `<form>` element (line ~381, above all form fields) to after the last form field and before the submit button (line ~650). This puts the error message in the user's natural flow — they see it right when they're about to click "Create Account" instead of having to scroll back to the top of a long form.

**Font cleanup (index.html):** The Google Fonts preload and noscript stylesheet links were changed from `family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap` to `family=Inter:wght@300;400;500;600;700&display=swap`. Space Grotesk and Sora were loaded but never used in any CSS or component — only Inter is actually used throughout the application. Removing them eliminates two unnecessary font downloads (~100 KB each).

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| index.html | edit | 2 | 2 | 0 |
| src/pages/auth/Signup.jsx | edit | 6 | 8 | −2 |
| src/pages/auth/SignupUltra.jsx | edit | 0 | 2 | −2 |

## Detailed Diff Analysis

**Positions array:** Both `Signup.jsx` and `SignupUltra.jsx` have identical `POSITIONS` arrays. The two removed entries were:
- `"Logistics Coordinator"` — a supply chain role, not a textile manufacturing role
- `"Designer"` — a creative role, not relevant for a B2B textile marketplace focused on manufacturing/sourcing

**Error placement:** In `Signup.jsx`, the error banner was moved from:
```jsx
{/* Before form */}
{error && (
    <div className="mb-5 rounded-xl bg-rose-500/15 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">
        {error}
    </div>
)}

<form onSubmit={handleSubmit} className="space-y-5">
```
To:
```jsx
<form onSubmit={handleSubmit} className="space-y-5">
    {/* ... all form fields ... */}
    
    {error && (
        <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">
            {error}
        </div>
    )}
    
    <button type="submit" ...>
```

**Fonts:** The preload `<link>` and noscript `<link>` both had Space Grotesk and Sora removed. These fonts were likely included during an early design exploration and never cleaned up.

## Why This Change Was Needed

The irrelevant positions created confusion during signup — users in the textile industry don't identify as "Logistics Coordinators" or "Designers" in this context. The error placement was a UX issue — on a long form, an error at the top is easily missed. The unused fonts were浪费 bandwidth on every page load.

## Was It Useful

Yes. All three changes improve the signup experience and reduce unnecessary resource loading.

## Impact Analysis

- **Signup UX:** Error messages are now visible at the point of action (near the submit button).
- **Form relevance:** Position options are now all textile-industry-specific.
- **Performance:** Two fewer font files downloaded (~200 KB savings per page load).
- **Risk:** Very low. All changes are cosmetic/UX improvements.

## Relationship to Surrounding Commits

This is part of the mobile/UX improvement batch (0660-0664). The subsequent commit 0664 addresses horizontal scrolling on the HelpCenter page.

## Confidence Notes

- The positions array is identical in both Signup.jsx and SignupUltra.jsx — both were updated consistently.
- Space Grotesk and Sora font references were verified to not appear in any CSS file or Tailwind config.
- The error banner class names and styling are unchanged — only the position in the JSX tree changed.

## Optional Technical Details

- The `mb-5` margin was removed from the error banner when it was moved inside the form (the form's `space-y-5` provides consistent spacing between children).
- Google Fonts preload with `as="style"` tells the browser to fetch the font CSS as a stylesheet, which triggers a non-blocking download.
- The noscript fallback ensures fonts load even when JavaScript is disabled (though the app requires JavaScript to function).
