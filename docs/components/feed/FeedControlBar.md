# FeedControlBar Component

**Type:** Feed Filter Bar
**File:** `src/components/feed/FeedControlBar.jsx`

## 1) Purpose

Feed filter and control bar:

- Type filter (All, Buyer Requests, Products, Posts)
- Unique/Duplicate toggle
- Category filter dropdown

## 2) Props

| Prop               | Type     | Description              |
| ------------------ | -------- | ------------------------ |
| `activeType`       | string   | Current type filter      |
| `onTypeChange`     | function | Type change callback     |
| `unique`           | boolean  | Unique filter state      |
| `onUniqueChange`   | function | Unique toggle callback   |
| `categories`       | array    | Category options         |
| `activeCategory`   | string   | Current category         |
| `onCategoryChange` | function | Category change callback |

## 3) Type Options

| ID       | Label            | Icon         |
| -------- | ---------------- | ------------ |
| all      | All              | LayoutGrid   |
| requests | Buyer Requests   | Briefcase    |
| products | Company Products | Building2    |
| posts    | Posts            | NotebookText |

## 4) Dependencies

- `lucide-react` - Icons
- React

## 5) Styling

- Sticky positioning
- Backdrop blur effect
- Dark mode support
- Active state styling with ring

---

_Generated from source: src/components/feed/FeedControlBar.jsx_
