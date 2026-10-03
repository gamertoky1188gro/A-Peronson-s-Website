# Commit 0690 — 856edb3

| Field | Value |
|-------|-------|
| **Commit Number** | 0690 |
| **Commit Hash** | 856edb3d8e749e26e1e4d78f376fc5b914f02374 |
| **Parent Hash** | 2305111e3c8e791583b28b806c7bea4a9647505d |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-14 00:12:17 |
| **Branch** | main |
| **Files Changed** | 11 |
| **Additions** | 111 |
| **Deletions** | 4 |
| **Net Change** | +111/−4 |
| **Merge Commit** | No |

## fix(seo): harden robots.txt for protected routes, add explicit canonicals, noindex IndustryPage

This commit comprehensively hardens the SEO configuration by expanding the `robots.txt` rules to explicitly block all protected/authenticated routes from crawler access, adding explicit canonical URLs to all public-facing pages, and marking the `IndustryPage` as `noindex,nofollow` to prevent indexing of dynamic slug-based pages. The `robots.txt` generation in `seoRoutes.js` is rewritten to include detailed `Disallow` rules for 25+ authenticated routes (admin, owner, chat, feed, search, notifications, buyer/factory/buying-house profiles, contracts, leads, verification, agent, onboarding, member management, partner network, product management, buyer requests, insights, org settings, ratings, support, feedback, calls, join requests, tasks). The `Allow` rules for Googlebot and Bingbot now explicitly whitelist only the 7 public pages (pricing, about, help, login, signup, terms, privacy). Additionally, the global `<link rel="canonical">` tag is removed from `index.html` and replaced with per-page canonical URLs set via the `useSeo` hook across 9 page components.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `index.html` | Modified | 0 | 1 | −1 |
| `server/routes/seoRoutes.js` | Modified | 104 | 3 | +101 |
| `src/pages/About.jsx` | Modified | 1 | 0 | +1 |
| `src/pages/HelpCenter.jsx` | Modified | 1 | 0 | +1 |
| `src/pages/IndustryPage.jsx` | Modified | 2 | 0 | +2 |
| `src/pages/Pricing.jsx` | Modified | 1 | 0 | +1 |
| `src/pages/Privacy.jsx` | Modified | 1 | 0 | +1 |
| `src/pages/Terms.jsx` | Modified | 1 | 0 | +1 |
| `src/pages/TexHub.jsx` | Modified | 1 | 0 | +1 |
| `src/pages/auth/Login.jsx` | Modified | 1 | 0 | +1 |
| `src/pages/auth/Signup.jsx` | Modified | 1 | 0 | +1 |

## Detailed Diff Analysis

- **`index.html`:** Removes the global `<link rel="canonical" href="https://gartexhub.onrender.com/" />` tag. Canonicals are now set per-page via the SEO hook, which is more correct for an SPA with client-side routing.
- **`server/routes/seoRoutes.js`:** The `robotsTxt` template string is rewritten with three user-agent sections (default `*`, `Googlebot`, `Bingbot`). Each section now includes 25+ explicit `Disallow` rules for protected routes. The `Allow` rules are expanded from just `/` to include the 7 public pages. This prevents crawlers from discovering or indexing authenticated-only content.
- **Page components (9 files):** Each public page's `useSeo()` call now includes an explicit `canonical` property:
  - `About.jsx`: `canonical: "https://gartexhub.onrender.com/about"`
  - `HelpCenter.jsx`: `canonical: "https://gartexhub.onrender.com/help"`
  - `Pricing.jsx`: `canonical: "https://gartexhub.onrender.com/pricing"`
  - `Privacy.jsx`: `canonical: "https://gartexhub.onrender.com/privacy"`
  - `Terms.jsx`: `canonical: "https://gartexhub.onrender.com/terms"`
  - `TexHub.jsx`: `canonical: "https://gartexhub.onrender.com/"` (homepage)
  - `Login.jsx`: `canonical: "https://gartexhub.onrender.com/login"`
  - `Signup.jsx`: `canonical: "https://gartexhub.onrender.com/signup"`
- **`IndustryPage.jsx`:** Adds both `canonical` and `robots: "noindex,nofollow"` — dynamic slug-based pages should not be indexed as they create near-duplicate content.

## Why This Change Was Needed

Without explicit `Disallow` rules for protected routes, crawlers could potentially index authenticated-only pages (if they somehow discovered the URLs), leading to confusing search results and potential security information leakage. The global canonical tag was incorrect for an SPA — each page needs its own canonical. The `IndustryPage` generates unique URLs per slug but with largely overlapping content, making `noindex` the correct choice to avoid duplicate content penalties.

## Was It Useful

Yes — this is a critical SEO hygiene commit. It prevents index bloat, eliminates duplicate content issues, and protects authenticated routes from search engine discovery.

## Impact Analysis

- **SEO:** Very High. Proper robots.txt rules, canonical URLs, and noindex directives directly impact search engine behavior.
- **Security:** Medium. Blocking crawlers from admin/owner/chat routes prevents accidental information leakage.
- **Search Rankings:** Positive. Eliminating duplicate content and providing clear canonical signals helps search engines focus on the intended public pages.

## Relationship to Surrounding Commits

Follows commit 0689 (favicon deployment). Precedes commit 0691 (Google Search Console verification). The robots.txt hardening here prepares for the Search Console submission in the next commit.

## Confidence Notes

- The `robotsTxt` template is dynamically generated with `TODAY` date, but this commit removes that dynamic date stamp (it becomes a static string in the template).
- The `IndustryPage` noindex is a judgment call — some sites prefer to index category pages, but for a dynamic slug-based system with potential duplicate content, `noindex` is the safer choice.
- The canonical URLs are hardcoded strings rather than derived from `window.location.origin`, which means they won't work correctly in local development or staging environments.

## Optional Technical Details

- The `robots.txt` uses `Disallow: /feed?*` (with wildcard) to block all feed pages with query parameters, preventing faceted search URLs from being indexed.
- The `IndustryPage` uses `robots: "noindex,nofollow"` — the `nofollow` prevents crawlers from following any links on the page, further reducing index bloat.
- The canonical property in `useSeo` likely generates a `<link rel="canonical">` tag via react-helmet or similar.
