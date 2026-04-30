# CrmSummaryPanel Component

**Type:** Profile CRM Panel
**File:** `src/components/profile/CrmSummaryPanel.jsx`

## 1) Purpose

CRM summary panel for profiles:

- Show relationship data
- Filter by type, match, date range
- Expand conversation threads
- Display lead/timeline data

## 2) Props

| Prop       | Type   | Description        |
| ---------- | ------ | ------------------ |
| `targetId` | string | Target user/org ID |

## 3) API

- CRM relationship data endpoints
- Filter parameters for data retrieval

## 4) State

- `data` - CRM data
- `filterType` - Activity type filter
- `filterMatch` - Search filter
- `filterFrom`, `filterTo` - Date range

## 5) Dependencies

- `../../lib/auth` - apiRequest, getCurrentUser, getToken

---

_Generated from source: src/components/profile/CrmSummaryPanel.jsx_
