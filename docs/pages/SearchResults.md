# SearchResults - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `SearchResults`
- Route: `/search`
- Purpose: Unified search across buyer requirements and company products with quota-aware advanced filtering and saved alert support.

## Layout & Structure
- Root: centered container inside full-height page background.
- Top search action row:
  - query input
  - `Search` button
  - `Show Filters/Hide Filters` toggle
  - `Save Alert` button
- Plan/capability notices:
  - current plan label
  - premium lock banner (if free)
  - upgrade prompt, alert feedback, quota/capability messages
- Optional filters panel:
  - two-column filter controls + premium lock hints
- Results summary + tabs:
  - tabs for `All`, `Buyer Requests`, `Companies`
- Result area:
  - loading / error / empty state
  - buyer request cards
  - company cards with ratings and optional video indicator

Approximate placement:
- Controls in top 0-20% of page.
- Results tab bar around 20-30%.
- Card list in remaining page body.

## Theme & Styling
- Base: light gray background (`bg-gray-50`) with white cards.
- Accent colors:
  - primary blue for active tab and primary buttons
  - amber for premium lock notices
  - red for errors
- Typography:
  - utilitarian dashboard style with small metadata text.
- Spacing:
  - consistent card/list paddings (`p-6`, `mb-4`, `gap-*`).

## Content Details
Exact key text:
- Search input placeholder: `Search buyer requests and products`
- Buttons:
  - `Search`
  - `Show Filters` / `Hide Filters`
  - `Save Alert`
- Plan and notices:
  - `Current plan:`
  - `Upgrade to Premium to unlock advanced filters and higher daily limits.`
  - `Premium filters are visible for discovery and disabled on free plans.`
- Filter section:
  - `Filter Results`
  - `Primary Filter`, `Category`, `MOQ Range`, `Country`, `Verified Only`, `Organization Type`
  - option labels from component source.
- Result header:
  - `Results for "<query>" (<N> total)`
- State messages:
  - `Loading results...`
  - `No results found. Try adjusting your query or filters.`
- Buyer card labels:
  - `MOQ:`
  - `Deadline:`
  - `Take Lead`
- Company card labels:
  - `Video available`
  - `Message`
  - ratings line and confidence/breakdown lines.

## Interactions & Functionality
- Query behavior:
  - `searchQueryInput` controls field.
  - submit sets `activeQuery`, which rebuilds `queryString` and triggers search.
- Search API calls:
  - requirements: `GET /requirements/search?...`
  - products: `GET /products/search?...`
- Ratings enrichment:
  - `GET /ratings/search?profile_keys=...` after company list load.
- Subscription plan preload:
  - `GET /subscriptions/me` on mount.
- Save alert:
  - `POST /search/alerts` with `{ query, filters }`.
- Premium gating:
  - premium-only filter controls are disabled when plan is free.
  - changing premium filter on free plan sets upgrade prompt instead of value.
- Error handling:
  - `upgrade_required` -> premium upgrade message.
  - `limit_reached` -> quota exhaustion message.
  - generic error fallback.
- Tabs:
  - `all`, `requests`, `companies` toggle displayed lists.

## Images & Media
- No external images.
- Company cards show:
  - gray box avatar placeholder.
  - text indicator for video availability (`🎬` icon text).

## Extra Notes / Metadata
- SEO:
  - no per-page meta tags in component.
- Accessibility:
  - filter controls are label-associated.
  - disabled controls communicate premium lock.
- Responsive:
  - control row stacks on small screens (`flex-col`).
  - filters use responsive grid.
