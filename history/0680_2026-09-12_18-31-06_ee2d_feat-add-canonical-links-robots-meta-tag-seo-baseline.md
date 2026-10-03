# Commit 680 — ee2d296

| Field | Value |
|-------|-------|
| **Commit Number** | 680 |
| **Commit Hash** | ee2d2967dea1bab9093410f5da7c7fe9c3395495 |
| **Parent Hash** | 43c3bc224b49d518af351b8ac6f4b3aa8a1868c7 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 18:31:06 |
| **Branch** | main |
| **Files Changed** | 2 |
| **Additions** | 26 |
| **Deletions** | 0 |
| **Net Change** | +26/0 |
| **Merge Commit** | No |

## Add Canonical Links and Robots Meta Tag for SEO Baseline

This commit adds the client-side SEO infrastructure for managing canonical URLs and robots meta tags on a per-page basis. It extends the existing `usePageMeta` hook with two new parameters (`canonical` and `robots`) and adds baseline SEO tags to the root `index.html`. This allows any page to declare its canonical URL and crawl directives dynamically via the hook, which is essential for a single-page application where the URL changes via client-side routing.

The `index.html` changes provide fallback defaults so that even before React hydrates, the page has correct SEO tags. The `usePageMeta` hook dynamically creates or updates `<link rel="canonical">` and `<meta name="robots">` elements in the document head, ensuring they stay in sync with the current route.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| index.html | Modified | 2 | 0 | +2 |
| src/lib/usePageMeta.js | Modified | 24 | 0 | +24 |

## Detailed Diff Analysis

**index.html**:
- Added `<meta name="robots" content="index,follow" />` — tells crawlers to index the page and follow links by default
- Added `<link rel="canonical" href="https://gartexhub.onrender.com/" />` — sets the canonical URL for the homepage

**src/lib/usePageMeta.js**:
- Added two new parameters to the hook signature: `canonical` (optional string) and `robots` (default `"index,follow"`)
- Added canonical URL handling: creates or updates a `<link rel="canonical">` element in `<head>`, using `window.location.href` as fallback when no canonical is provided
- Added robots meta handling: creates or updates a `<meta name="robots">` element in `<head>`, allowing per-page control of indexing directives
- Both parameters are added to the dependency array for the main `useEffect`
- The `canonical` and `robots` values are included in the returned object for memoization

## Why This Change Was Needed

Single-page applications (SPAs) have a well-known SEO problem: all routes are served from the same `index.html`, so crawlers see the same meta tags regardless of which URL they request. Without explicit canonical tags, Google may index the wrong URL variant (e.g., with/without trailing slash, with query parameters). Without per-page robots directives, protected routes (feed, search, profile) would be indexed alongside public pages, diluting search authority.

This commit establishes the mechanism for per-page SEO control that is used extensively in the following commit (681).

## Was It Useful

Yes — this is the foundational layer for all subsequent SEO work. Without it, the structured data and noindex directives from commit 681 would have no mechanism to be applied.

## Impact Analysis

- **SEO foundation**: Every page can now declare its canonical URL and robots directives dynamically.
- **SPA compatibility**: The hook-based approach works with React Router, ensuring SEO tags update on route changes.
- **Default safety**: The `index.html` defaults ensure the site is indexable even before React loads.
- **No visual change**: These are invisible `<head>` elements that don't affect rendering.

## Relationship to Surrounding Commits

This is the third in the SEO commit series (678–681). It bridges the server-side SEO (robots.txt, sitemap) with the client-side SEO (per-page meta tags). The next commit (681) immediately uses the new `robots` parameter to add `noindex,nofollow` to protected routes.

## Confidence Notes

- The canonical URL defaults to `window.location.href` when not provided, which is correct for most pages.
- The robots default of `"index,follow"` is the standard default — pages must explicitly opt out with `"noindex,nofollow"`.
- The hook correctly handles the case where the `<link>` or `<meta>` element already exists (e.g., from `index.html`) by querying for it before creating.

## Optional Technical Details

- The canonical element is created with `document.createElement("link")` and appended to `document.head` — this works because React's `useEffect` runs after the DOM is ready.
- The hook uses `document.querySelector('link[rel="canonical"]')` to find existing elements, which works correctly because there is only one canonical link per page.
- The `robots` parameter is a string (not an object) to keep the API simple — complex directives like `max-image-preview:large` can be passed as a single string.
