# Commit 0703 — c8746ba

| Field | Value |
|-------|-------|
| **Commit Number** | 0703 |
| **Commit Hash** | `c8746ba83319982144fec0630aea37f33c7d2666` |
| **Parent Hash** | `4ad5c64e9468a20931a003e604a6aee5757ca0f6` |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-16 19:11:34 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 160 |
| **Deletions** | 83 |
| **Net Change** | +160/-83 |
| **Merge Commit** | No |

## Add Other Category Option with Validation in Onboarding

This commit adds an "Other" option to the category selection grid in the onboarding page, allowing users to specify a custom business category when none of the predefined options (Denim, Hoodie, Knitwear, Outerwear, Polo, Sportswear, T-Shirt, Woven) apply. When "Other" is selected, a text input appears with validation rules. The commit also converts all JSX `className` attributes to `class` throughout the file.

## Files Changed

| File | Type | + | - | Delta |
|------|------|---|---|-------|
| `src/pages/auth/OnboardingPage.jsx` | modified | +160 | -83 | +77 |

## Detailed Diff Analysis

### Category Grid Changes

- Added "Other" to the `DEFAULT_CATEGORIES` array.
- When "Other" is toggled on, a text input field appears below the category grid with label "Type your category", placeholder "e.g. Sustainable Fabrics", max length 40 characters.
- When "Other" is deselected, the custom category text and error state are cleared.

### Validation Logic

New `validateCustomCategory()` function checks:
- Not empty
- At least 2 characters
- At most 40 characters
- Only allows letters, spaces, hyphens, and ampersands via regex `^[a-zA-Z\s-&]+$`

### Form Submission

When "Other" is selected, the final categories list replaces "Other" with the trimmed custom category value:
```
const finalCategories = categories.includes("Other")
    ? categories.filter((c) => c !== "Other").concat(customCategory.trim())
    : categories;
```

### Step Navigation

The `next()` function's step-3 validation now also validates the custom category before advancing to submission.

### className to class

All JSX `className` attributes throughout the file were converted to `class`. This affects the entire template section of the component. This is consistent with the same change in commit 0700's OrgSettings and Signup files.

## Why This Change Was Needed

The predefined categories (Denim, Hoodie, Knitwear, Outerwear, Polo, Sportswear, T-Shirt, Woven) cover the main textile categories but don't account for niche or emerging categories like "Sustainable Fabrics", "Leather Goods", or "Accessories". The "Other" option with free-text input ensures users can always describe their business accurately without being forced into an ill-fitting predefined category.

## Was It Useful

Yes. This is a standard UX pattern for category selection:
- Provides flexibility for edge cases not covered by predefined options.
- Input validation prevents garbage data (empty strings, special characters, overly long names).
- The regex whitelist (letters, spaces, hyphens, ampersands) is appropriate for business category names.
- The validation runs on change, blur, and before form submission.

## Impact Analysis

- **Users**: Can now specify custom business categories during onboarding.
- **Data quality**: Input validation ensures clean category data.
- **Backend**: No changes needed -- the custom category is sent as a regular category string.

## Relationship to Surrounding Commits

This follows commit 0702 (organization name pre-fill) and precedes commit 0704 (feed filter panel). Both 0702 and 0703 improve the onboarding experience.

## Confidence Notes

- **Confidence: Very high**. The changes are self-contained within a single file.
- The `className` to `class` conversion is consistent with commits 0700 and may indicate a build system change.
