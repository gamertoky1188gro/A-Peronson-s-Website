# BuyerProfile - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `BuyerProfile`
- Source file: `src/pages/BuyerProfile.jsx`
- Route: `/buyer/:id` (protected roles: all authenticated roles)
- Purpose: Public-style buyer profile page showing buyer identity, active requests, past deal stats, and ratings/reviews summary.

## Layout & Structure
- Global shell:
  - `NavBar` top, `Footer` bottom, floating assistant overlay.
- Main container:
  - `max-w-7xl` centered, padding `p-6`.
- Core grid:
  - Desktop: 3 columns (`lg:grid-cols-3`).
  - Left sidebar (`aside`): 1 column, sticky.
  - Main content (`main`): 2 columns area, stacked sections.
- Sidebar (left block):
  - Buyer card with avatar placeholder square, name, verified badge, location.
  - Quick facts: industry, organization type, rating.
  - Action buttons: `Contact`, `Follow`.
- Main content sections in order:
  1. About section with tags and three info cards.
  2. Active Buyer Requests list (card-per-request).
  3. Past Deals KPI cards.
  4. Reviews section with score, stars, reliability cards, review list.

Approximate placement:
- Sidebar: left 0-33% desktop width, full width mobile.
- Main: right 33-100% desktop width, full width mobile.

## Theme & Styling
- Base background: white.
- Accent blue: `#0A66C2`.
- Secondary light blue card background: `#F4F9FF`.
- Secondary text color: `#5A5A5A`.
- Verified pill uses pale blue background with blue check circle.
- Status chips:
  - `Open`: green pill.
  - `In Progress`: blue pill.
- Cards:
  - Rounded corners, white surfaces, drop shadows, bordered rows.

## Content Details
Exact fixed text:
- `Verified`
- `Industry:`
- `Organization:`
- `Rating:`
- `Contact`
- `Follow`
- `About`
- `Typical Order Volume`
- `Preferred Fabrics`
- `Certifications Required`
- `Active Buyer Requests`
- `Budget:`
- `Deadline:`
- `View Details`
- `Past Deals`
- `Completed Contracts`
- `Success Rate`
- `Top Reviews`
- `Reviews`
- `Recent Avg:`
- `Reliability:`
- `Qualified Ratings:`
- `Breakdown: 5★ ... 1★`
- `— Factory Reviewer • 3 weeks ago`
- `No reviews available yet.`

Hardcoded profile content:
- Buyer name: `Global Apparel Co`
- Location: `Dhaka, Bangladesh`
- Industry: `Garments`
- Organization type: `Direct Buyer`
- About paragraph about seasonal sourcing and QA.
- Tags: `Knits`, `Woven`, `Embroidery`
- Order volume: `500-5000 units per order`
- Fabrics: `Cotton`, `Poly-cotton`, `Denim`
- Certifications: `BSCI`, `OEKO-TEX`

Hardcoded request content:
- `White cotton tees with custom print`
- `Denim jeans - slim fit`

Dynamic content:
- Rating data is fetched from `/ratings/profiles/buyer:global-apparel-co`.
- Aggregate score, count, reliability, breakdown, and recent reviews populate UI.

## Interactions & Functionality
- Data fetch:
  - `useEffect` fetches rating summary once on mount.
  - API base from `VITE_API_URL` fallback `http://localhost:4000/api`.
- Utility function:
  - `starsFromAverage(avg)` returns star string based on rounded average.
- Interactive controls:
  - `View Details` links route to `/buyer/requests/{id}`.
  - `Contact` and `Follow` are UI buttons (no click handler defined in this component).
- Conditional rendering:
  - Review list renders fetched recent reviews.
  - Empty state shown when no recent reviews.

## Images & Media
- No real image URLs in this page component.
- Avatar is a placeholder block (`w-20 h-20 bg-gray-100`).
- No video/audio media.

## Extra Notes / Metadata
- Responsive behavior:
  - Converts 3-column desktop layout into 1-column mobile flow.
  - Internal cards use responsive grids for detail blocks.
- Accessibility:
  - Semantic `aside`, `main`, `section`, heading hierarchy.
  - Links/buttons have visible text labels.
- SEO:
  - No page-level meta/title management present.
