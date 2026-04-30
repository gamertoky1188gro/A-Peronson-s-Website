# FeedItemCard Component

**Type:** Feed Item Display Component
**File:** `src/components/feed/FeedItemCard.jsx`
**Lines:** ~414

## 1) Purpose

Displays a feed item (buyer request or user feed post) in the main feed:
- Shows item details (title, status, author, fields)
- Express interest button
- Comments, share, report, message actions
- Status badge (open, reviewing, closed)
- Markdown rendering for description

## 2) Props

| Prop | Type | Description |
|------|------|-------------|
| `item` | object | Feed item data |
| `canExpressInterest` | boolean | Show interest button |
| `expressInterestDisabled` | boolean | Disable interest button |
| `onExpressInterest` | function | Callback for interest |
| `onOpenComments` | function | Open comments |
| `onShare` | function | Share item |
| `onReport` | function | Report item |
| `onMessage` | function | Message author |
| `highlight` | boolean | Highlight item |

## 3) Dependencies

### External Libraries
- `lucide-react` - Icons (BadgeCheck, MessageCircle, etc.)
- `react-router-dom` - Link

### Local Imports
- `./MarkdownReadme` - Markdown rendering

## 4) State Management

- No internal state (stateless component)
- All data passed via props

## 5) Key Functions

- `requestStatusBadgeClass(status)` - CSS class for status badge
- `formatRequestStatusLabel(status)` - Human-readable status
- `compactText(value)` - Trim text
- `fieldRow(label, value)` - Render field row

## 6) Styling

- Tailwind utilities for layout, colors, spacing
- Dark mode support
- Status badge colors: emerald (open), blue (reviewing), slate (closed)

## 7) Accessibility

- Semantic HTML structure
- Action buttons with icons

---

*Generated from source: src/components/feed/FeedItemCard.jsx*