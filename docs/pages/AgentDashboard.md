# AgentDashboard - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `AgentDashboard`
- Source file: `src/pages/AgentDashboard.jsx`
- Route: `/agent` (protected roles: `buying_house`, `owner`, `admin`, `agent`)
- Purpose: Gives agent users a compact operational dashboard for assigned requests, chat activity, connected factories, plan status, and summary metrics.

## Layout & Structure
- Global shell:
  - `NavBar` at top (from app layout).
  - `Footer` at bottom.
  - `FloatingAssistant` overlay.
- Page root:
  - Full-height container with white background and neo/cyberpunk classes.
- Main grid (desktop):
  - 4-column layout in a centered container (`max-w-6xl`).
  - Left sidebar: column 1.
  - Main content: columns 2-4.
- Sidebar approximate placement:
  - X: 0-25% width (desktop), full width on mobile.
  - Y: stacked cards with sticky behavior (`top-20`/`top-56` for first two cards).
  - Sections in order:
    1. My Requests card.
    2. My Chats card.
    3. Connected Factories card.
    4. Plan card.
    5. Logout link button.
- Main content approximate placement:
  - X: 25-100% width (desktop), full width on mobile.
  - Contains:
    - Loading/error banners.
    - Agent Activity card with tab toggle and conditional content.

## Theme & Styling
- Primary background: white.
- Accent color: `#0A66C2` (links, active tabs, highlighted states).
- Text colors:
  - Primary: `#1A1A1A`.
  - Secondary: `#5A5A5A`.
- Error colors:
  - Container `bg-red-50`.
  - Text `text-red-600`.
- Cards:
  - Rounded (`rounded-xl`), shadowed (`shadow-md`), white panel style.
- Spacing:
  - Outer padding `p-6`.
  - Internal card paddings `p-4`.
  - Section gaps `gap-6`, `space-y-*`.
- Typography:
  - Section titles are semibold.
  - KPI values use larger size (`text-xl`).

## Content Details
Exact visible text:
- `📋 My Requests`
- `Assigned:`
- `💬 My Chats`
- `Active conversations:`
- `🏭 Connected Factories`
- `connected`
- `Plan`
- `plan`
- `Enterprise analytics on`
- `Free analytics view`
- `Logout`
- `Loading agent metrics…`
- `Agent Activity`
- `Requests`
- `Chats`
- `Buyer Requests`
- `Open Requests`
- `Contracts / Docs`
- `Active chat threads:`
- `Messages exchanged:`
- `Partner factories connected:`

Dynamic text regions:
- `Assigned: {totals.open_buyer_requests ?? 0}`
- `Active conversations: {totals.chats ?? 0}`
- `{totals.partner_network ?? 0} connected`
- `{subscription?.plan || 'free'} plan`
- Request tab KPI values: buyer requests, open requests, contracts/documents.
- Chat tab KPI values: chats, messages, partner network count.

## Interactions & Functionality
- State:
  - `activeTab` with default `requests`.
- Data source:
  - `useAnalyticsDashboard()` provides `dashboard`, `subscription`, `isEnterprise`, `loading`, `error`.
- Interactive elements:
  - Sidebar links:
    - `/agent?tab=requests`
    - `/agent?tab=chats`
    - `/agent?tab=factories`
    - `/login` (logout navigation only).
  - Tab buttons:
    - `Requests` sets `activeTab='requests'`.
    - `Chats` sets `activeTab='chats'`.
- Conditional rendering:
  - Loading banner shown while `loading=true`.
  - Error banner shown when `error` exists.
  - Request KPI grid shown in Requests tab.
  - Chat metric list shown in Chats tab.

## Images & Media
- No `<img>`, `<video>`, or external media files are used.
- Visual cues are text/emoji/icon characters inside links and labels.

## Extra Notes / Metadata
- Responsive behavior:
  - Sidebar and main content stack on small screens (`grid-cols-1`).
  - Desktop uses 4-column split (`lg:grid-cols-4`).
- Accessibility notes:
  - Uses semantic `aside` and `main`.
  - Button labels are explicit and readable.
  - Color-only state differentiation should be paired with text (already present for tab labels).
- SEO:
  - No per-page `<title>` or meta tags set in component.
