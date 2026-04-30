# NavBar Component

**Type:** Global Navigation Component
**File:** `src/components/NavBar.jsx`
**Lines:** ~885

## 1) Purpose

Global navigation bar used across most authenticated pages:
- Provides navigation links (public + authenticated)
- Theme toggle (light/dark mode)
- User search suggestions dropdown
- Unread notification badge
- Mobile navigation drawer
- Ctrl+K / Cmd+K keyboard shortcut for search

## 2) Routes Impacted

- Public (logged out): `/pricing`, `/about`, `/help`, `/support`
- Authenticated: `/feed`, `/search`, `/contracts`, `/notifications`, `/chat`, `/verification`, `/admin`
- Hidden on: `/chat/*` and `/call/*` (immersive pages)

## 3) Key APIs Used

| API | Purpose |
|-----|---------|
| GET `/api/notifications` | Unread count |
| GET `/api/users/search?q=...` | User search suggestions |
| POST `/api/users/:id/friend-request` | Connect user |
| POST `/api/users/:id/follow` | Follow user |
| POST `/api/chat/rooms` | Start conversation |
| POST `/api/calls` | Start call |

## 4) Dependencies

### External Libraries
- `framer-motion` - Animations (magnetic hover, active indicator slide)
- `lucide-react` - Icons (Bell, DollarSign, FileText, etc.)
- `react-router-dom` - Link, useLocation, useNavigate

### Local Imports
- `../lib/auth` - apiRequest, clearSession, getCurrentUser, getRoleHome, getToken
- `../lib/notificationsRealtime` - connectNotificationsRealtime, subscribeNotificationsRealtime

## 5) State Management

- `useState` for:
  - `user` - Current user
  - `darkMode` - Theme state
  - `searchOpen` - Search modal
  - `searchQuery` - Search input
  - `searchResults` - User suggestions
  - `notifs` - Notifications
  - `drawerOpen` - Mobile drawer
- `useRef` for search input
- `useEffect` for real-time notifications, keyboard shortcuts

## 6) Key Functions

- `MagneticNavLink` - Magnetic hover effect component
- Theme toggle via `.dark` class on `<html>`
- Real-time notification subscription via WebSocket
- User search with debounce
- Friend request / follow actions from search

## 7) Styling

### Custom CSS Classes (App.css)
- `.nav-glass` - Glassmorphism effect (semi-transparent + blur)
- `.text-gtBlue` - Brand color

### Tailwind Utilities
- Layout: `flex`, `fixed`, `relative`
- Colors: `bg-white`, `dark:bg-slate-900`, `text-slate-*`
- Spacing: `p-*`, `gap-*`, `px-*`
- Transitions: `transition-colors`

## 8) Animations (Framer Motion)

- **Magnetic hover:** `useMotionValue`, `useSpring` for magnetic pull effect
- **Active indicator:** `layoutId="nav-active"` pill slides between links
- **Ease curve:** `[0.16, 1, 0.3, 1]` (premium feel)
- **Reduced motion support:** `useReducedMotion` hook

## 9) Keyboard Shortcuts

- `Ctrl+K` / `Cmd+K` - Opens search modal

## 10) Real-time Features

- WebSocket connection for notifications via `connectNotificationsRealtime`
- Subscribe to notification updates via `subscribeNotificationsRealtime`

## 11) Accessibility

- Semantic `<nav>` element
- `aria-label` on search
- Keyboard navigable links
- Reduced motion support

## 12) Error Handling

- Graceful fallback if notifications fail to load
- Search error handling with user feedback

---

*Generated from source: src/components/NavBar.jsx*