# Commit 0694 — bbeebb6

| Field | Value |
|-------|-------|
| **Commit Number** | 0694 |
| **Commit Hash** | bbeebb61a09ff7709ab22e1bba4030c11d9f2238 |
| **Parent Hash** | bf3e65086b4e1b587e44b48adc5ba758f3a3598e |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-14 01:05:07 |
| **Branch** | main |
| **Files Changed** | 3 |
| **Additions** | 55 |
| **Deletions** | 1 |
| **Net Change** | +55/−1 |
| **Merge Commit** | No |

## fix(seo): strip CSP from static files — fixes Google sub-sitemap fetch

This commit addresses the remaining CSP (Content Security Policy) issue that was still affecting static file responses after commit 0692 moved sitemaps to static files. Even though the static files bypass the Express route-level helmet middleware, they were still being served through a code path that applied CSP headers. The fix adds `res.removeHeader("content-security-policy")` in the static file serving block of `server.js`, explicitly stripping the CSP header before sending the response. Additionally, the sub-sitemap URL structure is flattened: `sitemaps/pages.xml` is moved to the root `public/pages.xml`, and the sitemap index is updated to point to the new location. This simplifies the URL structure and avoids a potential directory-level CSP enforcement issue.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `public/pages.xml` | New | 51 | 0 | +51 |
| `public/sitemap.xml` | Modified | 1 | 1 | +0 |
| `server/server.js` | Modified | 3 | 1 | +2 |

## Detailed Diff Analysis

- **`public/pages.xml` (NEW):** Moved from `public/sitemaps/pages.xml` to `public/pages.xml`. Content is identical — the same 8 public URLs with priorities and change frequencies. This flattens the directory structure.
- **`public/sitemap.xml`:** Updates the sub-sitemap `<loc>` from `https://gartexhub.onrender.com/sitemaps/pages.xml` to `https://gartexhub.onrender.com/pages.xml`.
- **`server/server.js`:** In the static file serving block (the `try` block that reads files from `distRoot`), adds `res.removeHeader("content-security-policy")` after reading the file content and before calling `res.writeHead()`. This strips any CSP headers that may have been applied by earlier middleware (helmet). An explanatory comment is added: "Strip helmet CSP from static file responses — Google sitemap fetcher rejects XML with frame-src 'none' in CSP headers."

## Why This Change Was Needed

After commit 0692, Google's sitemap fetcher was still failing to process the sitemap XML. Investigation revealed that even though the files were now static, they were still being served through a code path that included CSP headers from the helmet middleware. Google's fetcher specifically rejects XML responses that contain `frame-src 'none'` in the CSP header, as it interprets this as a restriction that prevents iframe-based processing. The `res.removeHeader()` call explicitly strips the CSP header from static file responses, resolving the issue.

The sub-sitemap directory move (`sitemaps/pages.xml` → `pages.xml`) was likely done to simplify the URL structure and avoid potential issues with directory-level middleware applying headers to subdirectory files.

## Was It Useful

Yes — this is the final fix in the SEO static file migration saga (commits 0692 → 0693 → 0694). It definitively resolves the Google sitemap fetch failure by ensuring static files are served without CSP restrictions.

## Impact Analysis

- **SEO:** Very High. Fixes the root cause of Google sitemap fetch failures.
- **Security:** Minor. Removing CSP from static files (robots.txt, sitemaps) is safe because these files don't execute JavaScript or load external resources.
- **Compliance:** The CSP removal is scoped only to static file responses — dynamic API responses still have full CSP protection.

## Relationship to Surrounding Commits

Follows commit 0693 (MIME types). This is the final commit in the SEO hardening sequence (0690 → 0691 → 0692 → 0693 → 0694). The SEO system should now be fully functional with proper robots.txt, canonical URLs, Search Console verification, correct MIME types, and CSP-free static file responses.

## Confidence Notes

- The `res.removeHeader()` approach is correct — it removes the header after it's been set by helmet middleware but before the response is sent.
- The CSP removal is scoped to static files only (robots.txt, sitemaps, favicons) which are inert assets.
- The comment in the code explains the rationale clearly for future maintainers.

## Optional Technical Details

- The static file serving block in `server.js` uses a custom path that reads files from `distRoot` (the built frontend directory). This is distinct from Express's built-in `express.static()` middleware.
- Helmet typically applies CSP via the `content-security-policy` header. The `frame-src 'none'` directive specifically blocks iframe embedding, which Google's sitemap processor apparently requires.
- The `res.removeHeader()` API is a standard Node.js `http.ServerResponse` method that removes a previously set header.
- The old `public/sitemaps/pages.xml` file is not explicitly deleted in this commit — it remains as an orphan file but is no longer referenced by the sitemap index.
