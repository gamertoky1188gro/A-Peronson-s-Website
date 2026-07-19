# Commit 0075: Add EU/US Buyer Country Mapping and Verification Guidance

## Commit Metadata

| Field         | Value                                      |
| ------------- | ------------------------------------------ |
| Commit Number | 0075                                       |
| Hash          | `b8715af5ea950d5ae351622087edf2854874a760` |
| Parent Hash   | `44d1e912a178b5e702e97d4e7f577df70c304e5a` |
| Author        | Cyber Code Master                          |
| Date/Time     | 2026-03-03 14:50:21                        |
| Files Changed | 2                                          |
| Additions     | 89                                         |
| Deletions     | 5                                          |
| Net Change    | +84                                        |
| Merge         | No                                         |

## Custom Title

Implement Buyer Country Auto-Mapping and Region-Specific Verification Guidance

## High-Level Summary

This commit enhances the buyer verification flow with automatic country-to-region mapping and contextual guidance. A new `BUYER_COUNTRY_OPTIONS` includes the United States alongside all EU countries. The `verificationRegionFromCountry` function maps buyer countries to `eu`/`us`/`global` regions. The VerificationPage now auto-maps the region from the selected buyer country (disabling the manual region selector for buyers), debounce-saves the country selection to the API after 350ms, and displays region-specific guidance panels (EU requirements, USA requirements, or a prompt to select a country).

## File-by-File Breakdown

### shared/config/geo.js (modified, +9/-0)

- **What changed**: Added `BUYER_COUNTRY_OPTIONS` (United States + EU countries); added `verificationRegionFromCountry` function.
- **Why it matters**: Centralized buyer country-to-region mapping for verification compliance.

### src/pages/VerificationPage.jsx (modified, +80/-5)

- **What changed**: Added `buyerCountrySaving` state; imports `BUYER_COUNTRY_OPTIONS` and `verificationRegionFromCountry`; computes `buyerCountryRegion` from selection; adds `regionGuidance` memo with contextual messages for EU/US/no-selection; auto-syncs region to buyer country region via `useEffect`; debounce-saves buyer country to API after 350ms; region selector disabled for buyers with explanatory text; country selector includes US in options; shows guidance banner with tone-based styling; shows "Buyer country required" warning if no country selected.
- **Why it matters**: Automated region mapping reduces errors and simplifies the buyer verification flow.

## Detailed Diff Analysis

### Functions/Classes Added

- **`BUYER_COUNTRY_OPTIONS`** — `['United States', ...EU_COUNTRIES]`
- **`verificationRegionFromCountry(country)`** — Returns `'eu'`, `'us'`, or `'global'` based on country

### Logic Changes

- **Auto-mapped region**: For buyers, `effectiveRegion` is derived from country selection, not the manual region dropdown
- **Debounced save**: Buyer country auto-saves to API with 350ms debounce (replaces the old immediate-save approach removed in commit 0065)
- **Region selector disabled**: Buyers cannot manually pick region; it's derived from country

### UI/UX Changes

- Country selector includes United States (was previously only EU countries)
- Region-specific guidance banner with contextual heading/message:
  - EU: "Submit VAT Registration, EORI Registration, and Company Bank Proof"
  - USA: "Submit EIN Confirmation, Importer of Record (IOR), and Company Bank Proof"
  - No selection: "Select buyer country to lock requirements"
- "Saving country..." indicator during debounce save
- "Buyer country required" warning when no country is selected
- Guidance banner color-coded: emerald (EU), sky (USA), amber (no selection)

## Why This Change May Have Been Needed

The old verification page had an EU-only country list and a manual region selector. Adding the United States and auto-mapping the region from country simplifies the workflow and ensures correct document requirements for US buyers.

## Was It Useful?

**Useful.** Expands verification to US buyers and reduces user error through auto-mapping and contextual guidance.

## Impact Analysis

- **Developers**: New `verificationRegionFromCountry` function; `BUYER_COUNTRY_OPTIONS` replaces inline EU list usage.
- **Users**: US buyers can now be verified properly. Buyer country auto-maps the region. Clear guidance shown for each region.
- **Backward compatibility**: The manual region dropdown is disabled for buyers but still functional for other roles.

## Relationship to Surrounding Commits

Follows contract workflow merge (0074) and precedes merge PR #40. This verification improvement builds on the VerificationPage created in commit 0065.

## Confidence Notes

High. Well-scoped change with clear mapping logic and UX improvements.

## Optional Technical Details

- Debounce save uses `setTimeout` with 350ms delay in `useEffect`
- Guidance tone classes use Tailwind: `text-emerald-700 border-emerald-200 bg-emerald-50` for EU
- The `BUYER_COUNTRY_OPTIONS` array is used instead of inlining the EU countries list
