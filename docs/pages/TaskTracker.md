# TaskTracker - Route `/tasks`

**Access:** Protected - Owner/Admin roles

## 1) Purpose

Project task management interface:

- Tree-view display of project tasks
- Checkbox completion toggle
- Nested task hierarchy
- Task filtering (all, active, completed)
- Save to backend or download as JSON

**Backend interactions:**

- PUT `/api/tasks` - Save task state to server

## 2) Page Structure (Components + Sections)

### 2.1 Imported Components

- `lucide-react` - ChevronRight, ChevronDown, Check, X icons
- `../tasks.json` - Task data import

### 2.2 Structural Sections

- Header with project name
- Filter tabs (All, Active, Completed)
- Tree view with recursive `TreeNode` components
- Save status indicator

## 3) Styling (className blocks)

### 3.1 Tailwind utilities used

- Layout: `flex`, `min-h-screen`, `max-w-4xl`
- Colors: `bg-slate-50`, `bg-blue-600`, `text-slate-*`, `dark:bg-slate-900`
- Spacing: `p-6`, `py-6`, `gap-2`, `px-3`
- Borders: `border-l`, `rounded-lg`

## 4) API Map

| Frontend Call  | Backend Route | Purpose         |
| -------------- | ------------- | --------------- |
| PUT /api/tasks | `/tasks`      | Save task state |

## 5) Component Inventory

- `TreeNode` - Recursive tree node component (inline)
- Lucide icons: ChevronRight, ChevronDown, Check, X

## 6) State Management

- `useState` for:
  - `tasks` - Task list from JSON
  - `saveStatus` - Save status message
  - `filter` - Filter (all/active/completed)
  - `collapsedRoots` - Collapsed state
- `useEffect` for save functionality

## 7) Key Functions

- `TreeNode` component:
  - `handleCheckbox` - Toggle single task
  - `handleParentToggle` - Toggle all children
- `toggleTask(id, isCompleted)` - Update task state recursively

## 8) Animations & Motion

- `transition-colors` on hover states
- No Framer Motion detected

## 9) Theme / Dark Mode

- Full dark mode support via `dark:` prefixes

## 10) Accessibility

- Semantic HTML
- Keyboard accessible checkboxes

## 11) Open Issues / TODOs

- Shows issue count for tasks with `issues` array

## 12) Test Coverage

- Test file: `tests/unit/taskTracker.test.js` (if exists)

## 13) Route Guards & Redirects

- Requires authentication (owner/admin recommended)

## 14) External Dependencies

- `lucide-react` - Icons

## 15) Performance Notes

- Recursive rendering for tree
- ~319 lines

## 16) Error Handling

- Try/catch in save function
- Fallback to download JSON if API fails

## 17) Analytics Events

- No explicit analytics tracking

## 18) URL Params / Query Params

- None

## 19) Real-time Updates

- None

## 20) Form Validation

- None (task completion is boolean)

## 21) Keyboard Shortcuts

- None

## 22) Feature Flags

- None

## 23) SEO / Meta

- No meta tags set

## 24) Caching Strategy

- No caching

## 25) File Size / Bundle Impact

- ~319 lines - lightweight
- Minimal bundle impact

---

_Generated from source: src/pages/TaskTracker.jsx_
