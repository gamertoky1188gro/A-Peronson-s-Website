# ReportModal Component

**Type:** Content Reporting Modal
**File:** `src/components/feed/ReportModal.jsx`

## 1) Purpose

Modal for reporting inappropriate content:
- Select report reason
- Add details (optional)
- Submit report

## 2) Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | boolean | Modal visibility |
| `onClose` | function | Close callback |
| `onSubmit` | function | Submit report callback |
| `item` | object | Item being reported |

## 3) Report Reasons

- Misleading information
- Spam or scam
- Inappropriate content
- Copyright/brand violation
- Other

## 4) Dependencies

- `lucide-react` - X icon

---

*Generated from source: src/components/feed/ReportModal.jsx*