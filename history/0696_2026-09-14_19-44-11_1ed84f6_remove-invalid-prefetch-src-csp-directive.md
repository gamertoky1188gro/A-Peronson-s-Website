# Commit 0696 — 1ed84f6

| Field | Value |
|-------|-------|
| **Commit Number** | 0696 |
| **Commit Hash** | `1ed84f65505ff53f376820e0400e3b01934c302c` |
| **Parent Hash** | `be221901368cf9965abcde0b78fdf89eddeab7ee` |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-14 19:44:11 |
| **Branch** | main |
| **Files Changed** | 2 |
| **Additions** | 46 |
| **Deletions** | 9 |
| **Net Change** | +46/-9 |
| **Merge Commit** | No |

## Remove Invalid prefetch-src CSP Directive and Unused Font Preload

This commit fixes two issues in `index.html`: (1) removes the `prefetch-src` directive from the Content-Security-Policy meta tag, which is an invalid/obsolete CSP directive that causes browser console warnings; and (2) removes an unused `<link rel="preload" as="font">` tag pointing to an Inter font WOFF2 file that was not actually served. The same fixes are applied to the built `dist/index.html` output, along with structural SEO improvements including canonical URL, robots meta tag, and structured data (JSON-LD) for Organization and WebSite schemas.

## Files Changed

| File | Type | + | - | Delta |
|------|------|---|---|-------|
| `dist/index.html` | modified | +44 | -7 | +37 |
| `index.html` | modified | +2 | -2 | 0 |

## Detailed Diff Analysis

### `index.html` (source)

- Removed `<link rel="preload" as="font" type="font/woff2" ...>` — this preload pointed to a specific Inter font subset (`UcCo3FwrK3iLTcviYwY.woff2`) that was not actually used. The Google Fonts stylesheet loads different subsets dynamically. Removing it eliminates a wasted network request and a potential CSP violation.
- Removed `prefetch-src 'self' https://gartexhub.onrender.com;` from the CSP meta tag. The `prefetch-src` directive is not a valid CSP level-3 directive; browsers ignore it and log a warning to the console.

### `dist/index.html` (built output)

- Same CSP fix and font preload removal applied to the production build.
- Added `<meta name="robots" content="index,follow" />` and `<link rel="canonical" href="https://gartexhub.onrender.com/" />` for SEO.
- Added JSON-LD structured data blocks for Organization and WebSite (with SearchAction) schemas.
- Updated asset hashes to reflect the new build.

## Why This Change Was Needed

The `prefetch-src` CSP directive was causing browser console warnings on every page load, which polluted the developer experience and could trigger CSP violation reports. The unused font preload wasted a network request (the browser would fetch a WOFF2 file that was never referenced by any stylesheet). Both issues needed to be fixed to clean up the console and improve load performance.

## Was It Useful

Yes. Removing an invalid CSP directive eliminates console warnings and potential CSP violation reports. Removing the unused font preload saves one network round-trip. The SEO additions in `dist/index.html` (canonical URL, structured data) are also beneficial for search engine indexing.

## Impact Analysis

- **Users**: No visible change, but cleaner browser console.
- **Developers**: No more CSP warnings in console during development.
- **Performance**: One fewer network request on page load (font preload removed).
- **SEO**: Canonical URL and structured data added to production build, improving search engine understanding.

## Relationship to Surrounding Commits

This follows commit 0695 (favicon.ico addition) and precedes commit 0697 (major bundle optimization). All three are part of a performance/SEO hardening session on 2026-09-14.

## Confidence Notes

- **Confidence: Very high**. The diffs are clear and the changes are straightforward.
- The `prefetch-src` removal is well-documented as an invalid directive.

## Optional Technical Details

- **CSP `prefetch-src`**: This directive was proposed in CSP Level 2 drafts but was removed before the spec reached Candidate Recommendation. Modern browsers ignore it.
- **Font preloading**: The preloaded WOFF2 was for Inter's Latin subset, but Google Fonts serves a dynamically constructed URL that differs from the hardcoded one.
