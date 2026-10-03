# Commit 0670 — 2664fb8

| Field | Value |
|-------|-------|
| **Commit Number** | 0670 |
| **Commit Hash** | 2664fb82ed886b142b61c2fafe06e0bd9c6d7988 |
| **Parent Hash** | bffaf65cd65aab1d543dc5af90221366163f118a |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 00:21:44 |
| **Branch** | main |
| **Files Changed** | 5 |
| **Additions** | 260 |
| **Deletions** | 15 |
| **Net Change** | +260/-15 |

## Contract Sales Flow + Mobile Horizontal Scroll

This is a multi-file commit that (1) adds a full contract creation form to ContractVault.jsx replacing the bare "New draft" button, (2) updates the About page's "Contact Sales" buttons to link to `/contracts` instead of `/help`, (3) grants buyer role access to `/contracts`, (4) fixes TexHub's mobile horizontal scroll with `data-lenis-prevent` and fade gradient, and (5) fixes HelpCenter overflow-x with a simpler grid layout.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/App.jsx | Modified | 2 | 1 | +1 |
| src/pages/About.jsx | Modified | 2 | 2 | 0 |
| src/pages/ContractVault.jsx | Modified | 249 | 2 | +247 |
| src/pages/HelpCenter.jsx | Modified | 8 | 7 | +1 |
| src/pages/TexHub.jsx | Modified | 4 | 3 | +1 |

## Detailed Diff Analysis

### 1. App.jsx — CONTRACT_ROLES

```javascript
+ const CONTRACT_ROLES = ["owner", "admin", "buying_house", "factory", "buyer"];
```

A new role array grants buyer role access to the `/contracts` route (previously restricted to `OWNER_ROLES`). This enables buyers to create and manage contracts, which aligns with the new contract creation form.

### 2. About.jsx — Contact Sales Links

Two `MagneticButton` components change their `to` prop from `/help` to `/contracts`:
- Hero section's "Contact sales" button
- CTA section's "Contact sales" button

This routes sales inquiries to the contract management page instead of the help center.

### 3. ContractVault.jsx — Full Creation Form (+247 lines)

This is the bulk of the commit. Key additions:

**New state variables:**
- `showCreateForm` — toggles the creation modal
- `createForm` — form state with 12 fields (title, description, buyer/factory names, product details, quantity, unit price, currency, delivery date, payment terms)
- `createFiles` — file attachments state

**`handleCreateContract` function:**
- Validates title is required
- Creates contract via `POST /contracts` with all form fields
- Uploads any attached files via `uploadFile`
- Resets form and shows success feedback

**Create form modal (`createFormModal`):**
- Full modal with backdrop blur
- Form fields: title (required), buyer/factory names (2-col grid), description (textarea), product details, quantity/unit price/currency (3-col grid), delivery date/payment terms (2-col grid)
- File upload with preview chips and remove buttons
- Cancel/Create buttons with loading state

**Embedded view:**
- Adds "+ New Contract" button visible only in embedded mode (inside OwnerDashboard)
- The create form modal renders in both embedded and standalone modes

### 4. HelpCenter.jsx — Simplified Overflow

```diff
- <div className="-mx-6 overflow-x-auto px-6 snap-x snap-mandatory scrollbar-hide md:mx-0 md:px-0 md:snap-none">
- <div className="flex w-max gap-4 md:w-full md:grid md:grid-cols-2 xl:grid-cols-3">
+ <div className="overflow-x-hidden">
+ <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
```

Replaces the complex negative-margin scroll wrapper (from commits 0665-0666) with a simple grid layout. Uses `overflow-x-hidden` instead of `overflow-x-auto` — the step cards no longer scroll horizontally; they stack in a responsive grid.

Also adds `overflow-x-hidden` and `min-w-0` to prevent horizontal overflow at the page and sidebar levels.

### 5. TexHub.jsx — Mobile Scroll Fix

```diff
- <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-3">
+ <div className="relative mt-8">
+ <div data-lenis-prevent className="flex gap-4 overflow-x-auto snap-x snap-proximal scrollbar-hide px-1 pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
```

- Adds `data-lenis-prevent` to prevent Lenis smooth-scroll from intercepting wheel events on the horizontal scroll container
- Uses `snap-proximal` instead of `snap-mandatory` for softer snap behavior
- Adds padding for mobile scroll, visible only on mobile
- Adds a fade gradient indicator on the right edge (only on mobile via `lg:hidden`)

## Why This Change Was Needed

1. **Contract creation:** The "New draft" button created an empty contract with no user input. The full form lets users specify contract details upfront, which is essential for the sales flow.
2. **Buyer access:** Buyers couldn't access `/contracts` at all. Adding them to `CONTRACT_ROLES` enables the sales flow.
3. **About page routing:** "Contact Sales" buttons pointed to `/help` which was wrong — they should go to `/contracts` where users can actually create contracts.
4. **Mobile scroll:** TexHub's workflow section had the same Lenis interference issue as other scrollable containers.
5. **HelpCenter overflow:** The negative-margin scroll approach was overly complex; a simple grid is more maintainable and avoids horizontal scroll issues entirely.

## Was It Useful

Yes — this is a significant feature addition (contract creation form) combined with several mobile UX fixes. The contract form is well-structured with proper validation, file upload, and responsive layout.

## Impact Analysis

- **User-facing:** Buyers can now create detailed contracts; About page routes to contracts; HelpCenter and TexHub have better mobile layouts
- **Feature:** New contract creation modal with 12 form fields and file attachments
- **Access control:** New `CONTRACT_ROLES` array changes who can access `/contracts`
- **Risk:** Medium — the contract creation form is a new feature that needs testing; the role change could have security implications if not intended

## Relationship to Surrounding Commits

- **Predecessor (0669):** Mobile menu opacity fix
- **Successor (0671):** Verified documents table mobile layout fix
- Part of a late-night development session (00:21 AM) combining feature work and mobile fixes

## Confidence Notes

The contract creation form is well-implemented with proper state management, validation, and error handling. The `CONTRACT_ROLES` addition is straightforward. The HelpCenter simplification (grid instead of scroll) is a good call. The TexHub Lenis fix follows the established pattern from earlier commits.

## Optional Technical Details

- The create form modal uses `max-h-[90vh] overflow-y-auto` for long forms
- File upload accepts `image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx`
- Currency options: USD, EUR, GBP, BDT
- The form uses `Input` components from the project's component library
- `snap-proximal` is softer than `snap-mandatory` — it snaps to the nearest item but doesn't force it
- The fade gradient uses `pointer-events-none` so it doesn't block clicks
