# OwnerDashboard - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `OwnerDashboard`
- Source file: `src/pages/OwnerDashboard.jsx`
- Route: `/owner` (owner/admin only)
- Purpose: Owner/admin control dashboard with sidebar navigation and section-specific summary/analytics views.

## Layout & Structure
- Root: full-height dashboard with `max-w-full` and 6-column desktop grid.
- Sidebar (`aside`, 1 column on desktop):
  - Sticky vertical nav cards:
    - Dashboard Home
    - Buyer Requests
    - Chats
    - Partner Network
    - Member Management
    - Contracts Vault
    - Insights & Analytics
    - Subscription
    - Logout
- Main area (`main`, 5 columns):
  - Loading/error banners at top.
  - Content depends on `active` state.
- `home` section:
  - KPI card row (4 cards).
  - Subscription & Access card.
- Other sections:
  - Requests, Chats, Network, Contracts: each a single summary card.
  - Insights: optional upgrade warning + three monthly series panels.

Approximate placement:
- Sidebar x=0-16% desktop.
- Main content x=16-100%.
- Mobile stacks one-column.

## Theme & Styling
- Accent: `#0A66C2`.
- Page background tone includes `#F9FBFD` in `SeriesList` cards.
- Text:
  - Primary dark headings.
  - Secondary `#5A5A5A`.
- Active sidebar item:
  - Light-blue background + blue text.
- Warnings:
  - Yellow alert panel for enterprise upsell in insights.
- Error:
  - Red tinted banner.

## Content Details
Exact text labels:
- `📊 Dashboard Home`
- `📋 Buyer Requests`
- `💬 Chats`
- `🏭 Partner Network`
- `👥 Member Management`
- `📄 Contracts Vault`
- `📈 Insights & Analytics`
- `💳 Subscription`
- `🚪 Logout`
- `Loading dashboard metrics…`
- `Buyer Requests`
- `Active Chats`
- `Partner Network`
- `Contracts / Docs`
- `Subscription & Access`
- `Current plan:`
- `Enterprise analytics enabled.`
- `Free plan: advanced analytics are limited.`
- `Total:`
- `Open:`
- `Active chat threads:`
- `Messages sent:`
- `Connected factory partners:`
- `Total factory profiles:`
- `Contracts uploaded:`
- `Total documents:`
- `Upgrade to Enterprise to unlock advanced monthly trends and analytics event breakdown.`
- `Buyer Requests / Month`
- `Chats / Month`
- `Documents / Month`
- `No data yet.`

## Interactions & Functionality
- State:
  - `active` section default `home`.
- Data:
  - From `useAnalyticsDashboard()`.
- Sidebar interactions:
  - Clicking each link sets `active` and navigates with `to` path/query.
- Conditional rendering:
  - Panels shown according to selected `active`.
  - Insights section shows series charts; enterprise warning shown when not enterprise.
- Series chart behavior (`SeriesList`):
  - Bar width = `Math.min(100, count * 10)%`.
  - Displays month and count.

## Images & Media
- No media files.
- Charts are CSS bars, not image/chart libraries.

## Extra Notes / Metadata
- Responsive:
  - Sidebar and main area stack on small screens.
- Accessibility:
  - Sidebar controls are links with text+emoji labels.
  - Main panels have heading text for context.
- SEO:
  - No explicit per-page metadata management.
