# AccessDeniedState Component

**Type:** Access Denied UI Component
**File:** `src/components/AccessDeniedState.jsx`

## 1) Purpose

Displayed when user lacks permissions to access a route:
- Shows appropriate message based on context
- Provides navigation back to accessible areas
- Used by route guards

## 2) Props

| Prop | Type | Description |
|------|------|-------------|
| `message` | string | Custom message (optional) |
| `roleRequired` | string | Required role (optional) |

## 3) Dependencies

- `lucide-react` - Icons (Lock, etc.)
- `react-router-dom` - Link, useNavigate

## 4) Styling

- Tailwind utilities
- Dark mode support
- Centered layout with icon

---

*Generated from source: src/components/AccessDeniedState.jsx*