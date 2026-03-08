# PartnerNetwork - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `PartnerNetwork`
- Route: `/partner-network` (protected, role-restricted in app routing).
- Purpose: Manage partner requests and connected relationships by status, including send/accept/reject/cancel actions.

## Layout & Structure
- Top header row:
  - title and subtitle
  - optional view-only indicator for agent mode
  - target account ID input + `Send Request` button
- Secondary utility row:
  - search input
  - signed-in role display
- Status tab row:
  - `Connected`
  - `Pending Requests`
  - `Rejected`
- Feedback rows:
  - error message
  - loading indicator
- Card grid:
  - partner/request cards in responsive 1/2/3-column layout.
- Empty state message when no rows.

Approximate placement:
- Controls in top ~25% of page.
- Cards occupy remaining page height.

## Theme & Styling
- White panel style with blue brand action.
- Primary color: `#0A66C2`.
- Text palette: dark neutral with muted secondary gray.
- Cards:
  - bordered, rounded, soft shadow.
- Active tab:
  - blue background + white text.

## Content Details
Exact key text:
- Heading: `Partner Network`
- Subtitle: `Manage connected factories and request workflow by account ID`
- Agent notice: `Agent mode: view-only access enabled.`
- Input placeholder:
  - `Target account ID`
  - `Search partners`
- Button labels:
  - `Send Request`
  - `Accept`
  - `Reject`
  - `Cancel`
  - `View Profile`
- Tab labels:
  - `Connected`
  - `Pending Requests`
  - `Rejected`
- Status block labels:
  - `Status:`
  - `Direction:`
  - `Role:`
  - `Account ID:`
- Fallback text:
  - `Unknown account`
  - `No requests found for this filter.`
  - `Loading...`

## Interactions & Functionality
- Data load:
  - `GET /partners?status=<tab>` on mount and tab changes.
- Search:
  - client-side filters loaded rows by counterparty `name`/`id`.
- Send request:
  - `POST /partners/requests` with `{ targetAccountId }`.
  - after success:
    - clears target input.
    - switches tab to `pending`.
    - reloads pending data.
- Row actions:
  - Accept: `POST /partners/requests/:requestId/accept`
  - Reject: `POST /partners/requests/:requestId/reject`
  - Cancel: `POST /partners/requests/:requestId/cancel`
- Permissions behavior:
  - `canManage = permissions.can_manage && !permissions.view_only`.
  - disables write controls when user is view-only or loading.
- View profile link:
  - factory -> `/factory/:id`
  - otherwise -> `/buying-house/:id`
- Error behavior:
  - 403 mapped to `You do not have permission to perform this action.`
  - otherwise shows API error text.

## Images & Media
- No image/media assets.
- Uses text-only verified badge marker: `✓ Verified`.

## Extra Notes / Metadata
- SEO:
  - no explicit page metadata tags.
- Accessibility:
  - control disabling reflects permission state.
  - consider adding `aria-live` for load/error status text for assistive feedback.
- Responsive:
  - header control rows wrap on smaller screens.
  - cards shift to single-column in narrow viewport.
