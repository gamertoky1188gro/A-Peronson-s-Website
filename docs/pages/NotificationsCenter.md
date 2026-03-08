# NotificationsCenter - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `NotificationsCenter`
- Source file: `src/pages/NotificationsCenter.jsx`
- Route: `/notifications` (all authenticated roles)
- Purpose: Displays user notifications with type tabs, unread filtering, and mark-as-read action.

## Layout & Structure
- Outer page: full-height white themed container.
- Main centered grid (`max-w-7xl`):
  - Desktop 4 columns.
  - Main notification list: 3 columns width.
  - Filter sidebar: 1 column width.
- Main column structure:
  1. Header row with title.
  2. Tab button row (`All`, `Search Matches`, `System`).
  3. Notification list cards.
- Sidebar:
  - `Filters` card containing `Unread` checkbox.

Approximate placement:
- Notification list occupies left 75% desktop.
- Filters card occupies right 25% desktop.
- Mobile stacks vertically.

## Theme & Styling
- Accent blue `#0A66C2` for active tab and primary action link.
- Hover card highlight: `#F4F9FF`.
- Secondary metadata text: `#5A5A5A`.
- Card appearance: white, border, rounded corners.

## Content Details
Exact text:
- `Notifications`
- `All`
- `Search Matches`
- `System`
- `View`
- `Mark read`
- `Filters`
- `Unread`

Dynamic text:
- Each notification shows:
  - `i.message || i.title`
  - `new Date(i.created_at).toLocaleString()`
- `View` link destination:
  - `/buyer-requests` when `entity_type === 'buyer_request'`
  - otherwise `/feed`.

## Interactions & Functionality
- State:
  - `tab` default `all`.
  - `unreadOnly` default `false`.
  - `items` loaded from API.
- Loading behavior:
  - On mount, `load()` fetches notifications with token.
- API calls:
  - GET `/notifications`
  - PATCH `/notifications/{id}/read`
- Tab interactions:
  - `All` -> shows all types.
  - `Search Matches` -> `smart_search_match`.
  - `System` -> `system`.
- Filter interaction:
  - `Unread` checkbox restricts to unread only.
- Row action:
  - `Mark read` updates backend then reloads list.

## Images & Media
- No media assets used.
- Purely text cards with buttons and links.

## Extra Notes / Metadata
- Route access requires authenticated user.
- Error handling is silent during initial load (`load().catch(() => {})`).
- Accessibility:
  - Buttons and checkbox have explicit visible labels.
- SEO:
  - No page-specific metadata in component.
