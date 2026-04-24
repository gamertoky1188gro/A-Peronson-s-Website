# Insights - Complete Page Specification (Manual)

## Page Title & Description

- Page title: `Insights`
- Source file: `src/pages/Insights.jsx`
- Route: `/insights` (owner/admin only)
- Purpose: Analytics dashboard with summary KPIs; enterprise users get event-level analytics and export controls, non-enterprise users see upgrade prompt.

## Layout & Structure

- Global shell: nav + footer + floating assistant from app layout.
- Page container: centered `max-w-7xl`, padded.
- Header row:
  - Left title `Insights & Analytics` with plan badge text `(Enterprise Plan)` or `(Free Plan)`.
- Status blocks under header:
  - Loading banner.
  - Access denied component when forbidden.
  - Error banner when not forbidden but fetch failed.
- Main content (hidden if forbidden):
  1. KPI grid of four stat cards (`md:grid-cols-4`).
  2. Analytics panel card:
  - Free plan view: plan notice + upgrade button.
  - Enterprise view: `Analytics Events by Type`, event list, export buttons.

## Theme & Styling

- Base: white page surface.
- Text:
  - Primary dark text.
  - Secondary gray `#5A5A5A`.
- Error state:
  - Red background and text.
- Buttons:
  - Upgrade button: blue background with white text.
  - Export buttons: bordered neutral style.
- Card design:
  - Rounded, shadowed, white cards (`neo-panel cyberpunk-card` classes).

## Content Details

Exact text strings:

- `Insights & Analytics`
- `(Enterprise Plan)` / `(Free Plan)`
- `Loading analytics…`
- `Total Buyer Requests`
- `Active Chats`
- `Connected Partners`
- `Contracts / Documents`
- `You are currently on`
- `Upgrade to Enterprise to unlock event-level analytics and export controls.`
- `Upgrade to Enterprise`
- `Analytics Events by Type`
- `No analytics events recorded yet.`
- `Export CSV`
- `Download PDF Report`

Dynamic text:

- Summary values from `dashboard.totals`:
  - buyer requests, chats, partner network, contracts/documents.
- Event list from `dashboard.analytics_events.by_type`.
- Subscription text from `subscription.plan`.

## Interactions & Functionality

- Data source:
  - `useAnalyticsDashboard()` returns:
    - `dashboard`
    - `subscription`
    - `isEnterprise`
    - `loading`
    - `error`
    - `forbidden`
- Conditional logic:
  - `forbidden` -> `AccessDeniedState`.
  - Not forbidden + free plan -> upgrade message.
  - Not forbidden + enterprise -> show event table + export controls.
- Interactive controls:
  - Upgrade button (UI-only in this component; no click handler).
  - `Export CSV` button (UI-only).
  - `Download PDF Report` button (UI-only).

## Images & Media

- No images/videos/icons from media files.
- Purely text + card based interface.

## Extra Notes / Metadata

- Responsive behavior:
  - KPI cards stack on small screens.
  - Event list uses vertical rows with label/count.
- Accessibility:
  - Semantic heading hierarchy.
  - Status messages are visually distinct.
- SEO:
  - No direct meta tag handling in component.
