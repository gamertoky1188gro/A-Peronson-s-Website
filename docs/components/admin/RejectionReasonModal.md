# RejectionReasonModal Component

**Type:** Admin Modal Component
**File:** `src/components/admin/RejectionReasonModal.jsx`

## 1) Purpose

Modal for admin rejection workflow:
- Display rejection reason options
- Allow custom reason input
- Confirm rejection action

## 2) Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | boolean | Modal visibility |
| `onClose` | function | Close modal callback |
| `onConfirm` | function | Confirm rejection callback |
| `itemTitle` | string | Item being rejected (default: "this item") |
| `customReasons` | array | Custom rejection reasons |

## 3) Default Reasons

- Content standards violation (modest apparel)
- Manual review required
- Image/description mismatch
- Prohibited content
- Spam/misleading
- Other

## 4) Dependencies

- `lucide-react` - X icon
- React hooks (useState)

## 5) Styling

- Tailwind utilities
- Dark mode support via `dark:` prefix
- Centered modal with overlay

---

*Generated from source: src/components/admin/RejectionReasonModal.jsx*