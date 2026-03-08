# BuyingHouseProfile - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `BuyingHouseProfile`
- Source file: `src/pages/BuyingHouseProfile.jsx`
- Route: `/buying-house/:id`
- Purpose: Displays buying house identity, service capabilities, partner preview, active handled requests, and rating-backed performance metrics.

## Layout & Structure
- Root wrapper: full-height white themed page.
- Centered content: `max-w-7xl`, padded container.
- Main responsive grid:
  - Desktop 3 columns.
  - Sidebar (`aside`) left 1 column.
  - Main content (`main`) right 2 columns.
- Sidebar card:
  - Avatar placeholder square.
  - Organization name, verified badge, location.
  - Operational facts (years, partner factories).
  - CTA button `Contact Organization`.
- Main section order:
  1. `About` section with about text and three metric tiles.
  2. `Partner Network Preview` with a 3-column mini-grid of partner cards and `View Full Network` link.
  3. `Active Buyer Requests Handling` with status rows and `View` buttons.
  4. `Performance Metrics` with completion rate, average deal time, rating score.

Approximate placement:
- Left panel: x=0-33% desktop width.
- Right content: x=33-100%.
- Mobile: all sections stack vertically.

## Theme & Styling
- Primary palette:
  - White background cards.
  - Blue accent `#0A66C2`.
  - Secondary text `#5A5A5A`.
  - Light info surfaces `#F4F9FF`.
- Verified badge:
  - Outer light-blue pill.
  - Inner circular check icon.
- Buttons:
  - Primary blue fill with darker hover (`#083B75`).

## Content Details
Static user-facing text:
- `Verified`
- `Years in operation:`
- `Partner Factories:`
- `Contact Organization`
- `About`
- `Markets Served`
- `Service Type`
- `Partner Factories`
- `Breakdown: 5★ ... 1★`
- `Partner Network Preview`
- `View Full Network`
- `Active Buyer Requests Handling`
- `Status:`
- `View`
- `Performance Metrics`
- `Completion Rate`
- `Average Deal Time`
- `Rating Score`
- `reviews •`
- `confidence`

Hardcoded profile content:
- Name: `Atlas Buying House`
- Location: `Ho Chi Minh City, Vietnam`
- Years: `12`
- Partners: `18`
- About: sourcing/QC/shipment description.
- Markets: `EU`, `North America`, `AU`
- Services: `Sourcing`, `Quality Control`, `Full Management`

Request handling rows:
- `Sportswear order - 2000 units` (`In Progress`)
- `Knit polo - 1200 units` (`Sampling`)

Dynamic text:
- Rating summary fetched from `/ratings/profiles/buying_house:atlas-buying-house`.
- Breakdown counts and aggregate review stats displayed from API response.

## Interactions & Functionality
- Initial data load:
  - `useEffect` performs ratings profile fetch and stores `ratingSummary`.
- Link interactions:
  - `View Full Network` -> `/buying-house/network`.
- Button interactions:
  - `Contact Organization` and row `View` buttons are visual controls without local handler in this component.
- Conditional UI:
  - Rating values fallback to `0.0` and `0` when API data missing.

## Images & Media
- No actual image/video files referenced.
- Placeholder avatar and partner tiles are styled blocks.

## Extra Notes / Metadata
- Responsive:
  - Grid and card layout collapses to single-column on small screens.
- Accessibility:
  - Semantic main/aside/section usage.
  - Text labels for all controls.
- SEO:
  - No component-level meta tags.
