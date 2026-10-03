# Commit 681 — 872b04c

| Field | Value |
|-------|-------|
| **Commit Number** | 681 |
| **Commit Hash** | 872b04cda8fc0338d684f515e4fdd9f06c2b20e7 |
| **Parent Hash** | ee2d2967dea1bab9093410f5da7c7fe9c3395495 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 18:50:51 |
| **Branch** | main |
| **Files Changed** | 9 |
| **Additions** | 141 |
| **Deletions** | 2 |
| **Net Change** | +141/−2 |
| **Merge Commit** | No |

## Advanced SEO: Structured Data, FAQPage Schema, Noindex on Protected Routes, 404 Page

This commit completes the SEO baseline by adding three major features: (1) JSON-LD structured data for Organization and WebSite schemas in `index.html`, (2) a reusable `StructuredData` component that injects schema.org JSON-LD into pages, and (3) a styled 404 page with `noindex,nofollow` directives. It also applies `noindex,nofollow` to all protected/dynamic routes (feed, search, profile) to prevent them from appearing in search results.

The structured data enables Google Rich Snippets — when users search for "GarTexHub", Google can show the site's description, contact info, and search box directly in search results. The FAQPage schema on the Help Center and Pricing pages enables FAQ rich results. The 404 page replaces the previous catch-all redirect to `/`, giving users a proper error page and telling crawlers not to index 404 URLs.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| index.html | Modified | 35 | 0 | +35 |
| src/App.jsx | Modified | 3 | 1 | +2 |
| src/components/ui/StructuredData.jsx | New | 17 | 0 | +17 |
| src/pages/HelpCenter.jsx | Modified | 17 | 0 | +17 |
| src/pages/MainFeed.jsx | Modified | 1 | 0 | +1 |
| src/pages/NotFound.jsx | New | 52 | 0 | +52 |
| src/pages/Pricing.jsx | Modified | 15 | 0 | +15 |
| src/pages/ProfilePage.jsx | Modified | 2 | 1 | +1 |
| src/pages/SearchResults.jsx | Modified | 1 | 0 | +1 |

## Detailed Diff Analysis

**index.html**: Added two JSON-LD script blocks:
- Organization schema: `@type: "Organization"`, name, URL, description, contact email
- WebSite schema with SearchAction: enables Google's sitelinks search box in search results

**src/components/ui/StructuredData.jsx (new)**: A minimal React component that injects a `<script type="application/ld+json">` element into `<head>` via `useEffect`, and removes it on unmount. Accepts a `data` prop (JSON-LD object).

**src/pages/HelpCenter.jsx**: Added FAQPage structured data using the `StructuredData` component. Maps the existing FAQ data (from seed data or API) into `Question`/`Answer` schema format.

**src/pages/Pricing.jsx**: Added FAQPage structured data for the pricing page's FAQ section.

**src/pages/NotFound.jsx (new, 52 lines)**: A styled 404 page with:
- `usePageMeta` setting `robots: "noindex,nofollow"` and title "404 — Page Not Found"
- Decorative gradient blobs in the background
- Large "404" text with "Page not found" heading
- Links to home and help center
- Uses the same design language as the rest of the app (sky gradients, rounded buttons)

**src/App.jsx**: Changed the catch-all `<Route path="*">` from `<Navigate to="/" replace={true} />` to `<NotFound />`, so unknown routes show the 404 page instead of silently redirecting.

**Protected route noindex tags**:
- `MainFeed.jsx`: Added `robots: "noindex,nofollow"` to `usePageMeta`
- `ProfilePage.jsx`: Added `robots: "noindex,nofollow"` to `usePageMeta`
- `SearchResults.jsx`: Added `robots: "noindex,nofollow"` to `usePageMeta`

## Why This Change Was Needed

Without structured data, GarTexHub missed out on rich search results (FAQ snippets, search boxes, organization info). Without a 404 page, unknown URLs silently redirected to `/`, which meant crawlers would index the homepage for every typo'd URL — creating massive duplicate content. Without `noindex` on protected routes, Google would index feed pages, search results, and user profiles that require authentication, leading to "soft 404" errors when crawlers couldn't access the content.

## Was It Useful

Yes — this is the most impactful SEO commit in the series. It covers all three pillars: structured data for rich results, proper 404 handling, and crawl directive management for protected content.

## Impact Analysis

- **Search visibility**: Organization and WebSite schemas enable rich snippets in Google search results.
- **Rich results**: FAQPage schema on Help Center and Pricing pages can show FAQ accordions directly in search results.
- **Crawl efficiency**: Protected routes are no longer indexed, so crawlers focus on public content.
- **User experience**: 404 pages now show a helpful error page instead of silently redirecting.
- **Data protection**: User profiles and feed content are excluded from search indexing.

## Relationship to Surrounding Commits

This is the final commit in the SEO series (678–681). It builds directly on commit 680's `usePageMeta` hook extensions and uses the new `robots` parameter extensively. The next commit (682) shifts focus to image optimization with LazyImage.

## Confidence Notes

- The `StructuredData` component correctly cleans up its script element on unmount, preventing stale JSON-LD from accumulating.
- The 404 page uses the same Tailwind design system as the rest of the app, maintaining visual consistency.
- The `noindex,nofollow` tags are applied to the right routes — feed, search, and profile are all dynamic/authenticated content that shouldn't be indexed.

## Optional Technical Details

- The Organization schema includes `sameAs: []` as a placeholder for social media links — this should be populated with actual social profiles for maximum rich snippet benefit.
- The WebSite schema's SearchAction enables Google's sitelinks search box, which appears below the site name in search results and lets users search the site directly from Google.
- The FAQPage schema uses the `mainEntity` array format, which is the correct structure for Google's FAQ rich results.
- The NotFound page's `robots` tag uses `noindex,nofollow` (not just `noindex`) to prevent crawlers from following any links on the 404 page.
