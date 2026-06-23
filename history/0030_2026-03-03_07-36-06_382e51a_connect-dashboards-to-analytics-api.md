# Commit 0030: Connect Dashboards to Live Analytics and Subscription Data

## Commit Metadata

| Field | Value |
|-------|-------|
| **Commit Number** | 0030 |
| **Commit Hash** | `382e51acbeb50d0150c2a2946ecbdc98ac52566d` |
| **Parent Hash** | `456b2c7` (0028) |
| **Author** | Cyber Code Master |
| **Date/Time** | 2026-03-03 07:36:06 (+0600) |
| **Files Changed** | 7 |
| **Additions** | 215 |
| **Deletions** | 258 |
| **Net Change** | -43 lines |
| **Merge Commit** | No |

## Custom Title

**Add useAnalyticsDashboard Hook and Connect Dashboards to Live API**

## High-Level Summary

Creates a reusable `useAnalyticsDashboard` hook and rewrites AgentDashboard, Insights, and OwnerDashboard pages to fetch live analytics and subscription data from the API instead of using hardcoded data. The analytics service is expanded with a `getDashboardAnalytics()` function that computes totals, event counts, and monthly time series across all data stores.

## Key New/Changed Files

- **`src/hooks/useAnalyticsDashboard.js`** (new, 46 lines) — Custom hook that fetches `/api/analytics/dashboard` and `/api/subscriptions/me` in parallel, returns dashboard, subscription, isEnterprise flag, loading, and error states.
- **`server/services/analyticsService.js`** (+60 lines) — Added `getDashboardAnalytics()` with totals (buyer_requests, chats, messages, partners, contracts, documents, factories), analytics events by type, and monthly time series for requests, chats, and documents.
- **`src/pages/AgentDashboard.jsx`** (-69 lines) — Rewired to use analytics hook, removed hardcoded sample data
- **`src/pages/Insights.jsx`** (-20 lines) — Rewired to live analytics data
- **`src/pages/OwnerDashboard.jsx`** (-103 lines) — Rewired to live data with subscription awareness
- **`server/routes/analyticsRoutes.js`** — Added GET `/dashboard` route

## Why

To move away from hardcoded sample data on dashboard pages and show real metrics from the backend's JSON stores.

## Impact

- Net code reduction of 43 lines despite adding the hook and analytics service expansion
- Dashboards now show real data: requirement counts, chat volumes, partner counts, document totals
- Monthly time series enable trend visualization

## Relationship

This is the last commit in the batch (0030). It branches from 0028 in parallel with 0029. Both will be merged together in commit 0031.
