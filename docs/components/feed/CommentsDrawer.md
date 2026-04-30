# CommentsDrawer Component

**Type:** Feed Comments Drawer
**File:** `src/components/feed/CommentsDrawer.jsx`

## 1) Purpose

Slide-in drawer for viewing and posting comments:
- Load comments for feed items
- Post new comments
- Reply to existing comments
- Expand/collapse comment threads
- Real-time comment list updates

## 2) Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | boolean | Drawer visibility |
| `onClose` | function | Close callback |
| `item` | object | Feed item (id, entityType) |

## 3) API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/social/:type/:id` | GET | Load comments |
| `/api/social/:type/:id/comment` | POST | Post comment |
| `/api/social/:type/:id/comment/:parentId/reply` | POST | Reply to comment |

## 4) Dependencies

- `lucide-react` - X icon
- `../../lib/auth` - apiRequest, getToken
- React hooks (useState, useEffect, useMemo)

## 5) State Management

- `comments` - Comment list
- `input` - New comment input
- `replyInput` - Reply input
- `replyingTo` - Reply target
- `expandedThreads` - Thread expansion state
- `loading`, `submitting`, `error`

## 6) Styling

- Tailwind utilities
- Drawer overlay with `fixed` positioning
- Dark mode support

---

*Generated from source: src/components/feed/CommentsDrawer.jsx*