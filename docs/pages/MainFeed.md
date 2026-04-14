# MainFeed - Route `/feed`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/MainFeed.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/MainFeed.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_MainFeed.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../components/feed/FeedControlBar (src/pages/MainFeed.jsx:30)
- ../components/feed/FeedItemCard (src/pages/MainFeed.jsx:31)
- ../components/feed/CommentsDrawer (src/pages/MainFeed.jsx:32)
- ../components/feed/ReportModal (src/pages/MainFeed.jsx:33)
- ../hooks/useLocalStorageState (src/pages/MainFeed.jsx:34)
- ../lib/auth (src/pages/MainFeed.jsx:35)
- ../lib/events (src/pages/MainFeed.jsx:36)
- ../lib/leadSource (src/pages/MainFeed.jsx:37)

### 2.2 Structural section tags in JSX

- `aside` at `src/pages/MainFeed.jsx:471`

```jsx
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
```
- `main` at `src/pages/MainFeed.jsx:506`

```jsx
        <main className="col-span-12 lg:col-span-6 space-y-4">
          {headerLabel ? (
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-xs font-semibold text-slate-500">Feed</p>
```
- `aside` at `src/pages/MainFeed.jsx:657`

```jsx
        <aside className="col-span-3 hidden xl:block space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tips</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
```
## 3) Styling (className blocks, utility breakdown, and custom CSS)

### 3.1 Custom CSS utilities referenced by this page (App.css / index.css)

- `.nav-glass` definitions:
  - `src/App.css:897`
- `.spotlight-card` definitions:
  - `src/App.css:550`
- `.skeleton` definitions:
  - `src/App.css:865`
- `.neo-page` definitions:
  - `src/App.css:115`
- `.neo-panel` definitions:
  - `src/App.css:123`
- `.cyberpunk-page` definitions:
  - `src/App.css:116`
- `.cyberpunk-card` definitions:
  - `src/App.css:117`
- `.assistant-orb-btn` definitions:
  - `src/App.css:801`
- `.legal-weave` definitions:
  - `src/App.css:649`
- `.signature-draw` definitions:
  - `src/App.css:684`
- `.verified-shimmer` definitions:
  - `src/App.css:717`
- `.verified-pulse` definitions:
  - `src/App.css:576`
- `.conic-beam` definitions:
  - `src/App.css:585`

### 3.2 Every className block (with grouped explanations)

#### `src/pages/MainFeed.jsx:134`

```jsx
      className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `true`
- `flex items-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `true` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:137`

```jsx
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `h-10 w-10 rounded-full skeleton`
- `flex-1 space-y-2`
- `h-3 w-1/3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:138`

```jsx
        <div className="h-10 w-10 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded-full skeleton" />
          <div className="h-2 w-1/4 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `h-10 w-10 rounded-full skeleton`
- `flex-1 space-y-2`
- `h-3 w-1/3 rounded-full skeleton`
- `h-2 w-1/4 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:139`

```jsx
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded-full skeleton" />
          <div className="h-2 w-1/4 rounded-full skeleton" />
        </div>
```
**Raw class strings detected (best effort):**

- `flex-1 space-y-2`
- `h-3 w-1/3 rounded-full skeleton`
- `h-2 w-1/4 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:140`

```jsx
          <div className="h-3 w-1/3 rounded-full skeleton" />
          <div className="h-2 w-1/4 rounded-full skeleton" />
        </div>
        <div className="h-6 w-16 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `h-3 w-1/3 rounded-full skeleton`
- `h-2 w-1/4 rounded-full skeleton`
- `h-6 w-16 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:141`

```jsx
          <div className="h-2 w-1/4 rounded-full skeleton" />
        </div>
        <div className="h-6 w-16 rounded-full skeleton" />
      </div>
```
**Raw class strings detected (best effort):**

- `h-2 w-1/4 rounded-full skeleton`
- `h-6 w-16 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:143`

```jsx
        <div className="h-6 w-16 rounded-full skeleton" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-2/3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `h-6 w-16 rounded-full skeleton`
- `mt-4 space-y-2`
- `h-3 w-2/3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:145`

```jsx
      <div className="mt-4 space-y-2">
        <div className="h-3 w-2/3 rounded-full skeleton" />
        <div className="h-3 w-1/2 rounded-full skeleton" />
        <div className="h-24 w-full rounded-xl skeleton" />
```
**Raw class strings detected (best effort):**

- `mt-4 space-y-2`
- `h-3 w-2/3 rounded-full skeleton`
- `h-3 w-1/2 rounded-full skeleton`
- `h-24 w-full rounded-xl skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `rounded-xl` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:146`

```jsx
        <div className="h-3 w-2/3 rounded-full skeleton" />
        <div className="h-3 w-1/2 rounded-full skeleton" />
        <div className="h-24 w-full rounded-xl skeleton" />
      </div>
```
**Raw class strings detected (best effort):**

- `h-3 w-2/3 rounded-full skeleton`
- `h-3 w-1/2 rounded-full skeleton`
- `h-24 w-full rounded-xl skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `rounded-xl` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:147`

```jsx
        <div className="h-3 w-1/2 rounded-full skeleton" />
        <div className="h-24 w-full rounded-xl skeleton" />
      </div>
      <div className="mt-4 flex items-center justify-between">
```
**Raw class strings detected (best effort):**

- `h-3 w-1/2 rounded-full skeleton`
- `h-24 w-full rounded-xl skeleton`
- `mt-4 flex items-center justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `rounded-xl` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:148`

```jsx
        <div className="h-24 w-full rounded-xl skeleton" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-32 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `h-24 w-full rounded-xl skeleton`
- `mt-4 flex items-center justify-between`
- `h-3 w-32 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:150`

```jsx
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-32 rounded-full skeleton" />
        <div className="h-9 w-32 rounded-full skeleton" />
      </div>
```
**Raw class strings detected (best effort):**

- `mt-4 flex items-center justify-between`
- `h-3 w-32 rounded-full skeleton`
- `h-9 w-32 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:151`

```jsx
        <div className="h-3 w-32 rounded-full skeleton" />
        <div className="h-9 w-32 rounded-full skeleton" />
      </div>
      <span className="sr-only">Loading feed item {index + 1}</span>
```
**Raw class strings detected (best effort):**

- `h-3 w-32 rounded-full skeleton`
- `h-9 w-32 rounded-full skeleton`
- `sr-only`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `sr-only` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:152`

```jsx
        <div className="h-9 w-32 rounded-full skeleton" />
      </div>
      <span className="sr-only">Loading feed item {index + 1}</span>
    </div>
```
**Raw class strings detected (best effort):**

- `h-9 w-32 rounded-full skeleton`
- `sr-only`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `sr-only` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:154`

```jsx
      <span className="sr-only">Loading feed item {index + 1}</span>
    </div>
  )
}
```
**Raw class strings detected (best effort):**

- `sr-only`

**Utility breakdown (grouped):**

- **Other:**
  - `sr-only` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:447`

```jsx
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <FeedControlBar
        activeType={activeType}
        onTypeChange={(type) => {
```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:470`

```jsx
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 px-4 py-4">
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center gap-3">
```
**Raw class strings detected (best effort):**

- `max-w-7xl mx-auto grid grid-cols-12 gap-4 px-4 py-4`
- `col-span-12 lg:col-span-3 space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-12` — Grid layout.
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `lg:col-span-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:471`

```jsx
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
```
**Raw class strings detected (best effort):**

- `col-span-12 lg:col-span-3 space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center gap-3`
- `h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `rounded-full` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:472`

```jsx
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center gap-3`
- `h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`
- `min-w-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:473`

```jsx
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Member'}</p>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`
- `min-w-0`
- `font-semibold text-slate-900 dark:text-slate-100 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:474`

```jsx
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Member'}</p>
                <p className="text-xs text-slate-500">{user?.role ? user.role.replaceAll('_', ' ') : 'Account'}</p>
```
**Raw class strings detected (best effort):**

- `h-12 w-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`
- `min-w-0`
- `font-semibold text-slate-900 dark:text-slate-100 truncate`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:475`

```jsx
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Member'}</p>
                <p className="text-xs text-slate-500">{user?.role ? user.role.replaceAll('_', ' ') : 'Account'}</p>
              </div>
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `font-semibold text-slate-900 dark:text-slate-100 truncate`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:476`

```jsx
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Member'}</p>
                <p className="text-xs text-slate-500">{user?.role ? user.role.replaceAll('_', ' ') : 'Account'}</p>
              </div>
            </div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-900 dark:text-slate-100 truncate`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:477`

```jsx
                <p className="text-xs text-slate-500">{user?.role ? user.role.replaceAll('_', ' ') : 'Account'}</p>
              </div>
            </div>

```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/MainFeed.jsx:481`

```jsx
            <div className="mt-4 borderless-divider-t pt-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Quick actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((a) => (
```
**Raw class strings detected (best effort):**

- `mt-4 borderless-divider-t pt-4`
- `text-xs font-semibold text-slate-700 mb-2`
- `flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-divider-t` — Border style/width/color.

#### `src/pages/MainFeed.jsx:482`

```jsx
              <p className="text-xs font-semibold text-slate-700 mb-2">Quick actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((a) => (
                  <Link
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-700 mb-2`
- `flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/MainFeed.jsx:483`

```jsx
              <div className="flex flex-wrap gap-2">
                {quickActions.map((a) => (
                  <Link
                    key={a.to}
```
**Raw class strings detected (best effort):**

- `flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:488`

```jsx
                    className="rounded-full borderless-shadow bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {a.label}
                  </Link>
```
**Raw class strings detected (best effort):**

- `rounded-full borderless-shadow bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:498`

```jsx
            <div className="hidden lg:block rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-xs font-semibold text-slate-500">Viewing</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
```
**Raw class strings detected (best effort):**

- `hidden lg:block rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-xs font-semibold text-slate-500`
- `mt-1 text-lg font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `lg:block` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:499`

```jsx
              <p className="text-xs font-semibold text-slate-500">Viewing</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-500`
- `mt-1 text-lg font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:500`

```jsx
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
          ) : null}
```
**Raw class strings detected (best effort):**

- `mt-1 text-lg font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:501`

```jsx
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
          ) : null}
        </aside>
```
**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/MainFeed.jsx:506`

```jsx
        <main className="col-span-12 lg:col-span-6 space-y-4">
          {headerLabel ? (
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-xs font-semibold text-slate-500">Feed</p>
```
**Raw class strings detected (best effort):**

- `col-span-12 lg:col-span-6 space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-xs font-semibold text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `lg:col-span-6` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:508`

```jsx
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-xs font-semibold text-slate-500">Feed</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-xs font-semibold text-slate-500`
- `mt-1 text-xl font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:509`

```jsx
              <p className="text-xs font-semibold text-slate-500">Feed</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-500`
- `mt-1 text-xl font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:510`

```jsx
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
          ) : null}
```
**Raw class strings detected (best effort):**

- `mt-1 text-xl font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:511`

```jsx
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
          ) : null}

```
**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/MainFeed.jsx:516`

```jsx
            <div className={`rounded-2xl p-4 text-sm ring-1${
              notice.type === 'error'
                ? 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30'
                : notice.type === 'success'
```
**Raw class strings detected (best effort):**

- `error`
- `bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30`
- `success`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-rose-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-rose-200` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-rose-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-rose-500/30` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `error` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `success` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:523`

```jsx
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{notice.message}</p>
                {claimedRequestId ? (
                  <button
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `font-medium`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:524`

```jsx
                <p className="font-medium">{notice.message}</p>
                {claimedRequestId ? (
                  <button
                    type="button"
```
**Raw class strings detected (best effort):**

- `font-medium`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:529`

```jsx
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
                  >
                    Open Chat
                  </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:539`

```jsx
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Early access: new verified factories</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center justify-between`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:540`

```jsx
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Early access: new verified factories</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified in the last 30 days</p>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `text-[11px] text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:542`

```jsx
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Early access: new verified factories</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified in the last 30 days</p>
                </div>
                {!canEarlyAccess ? (
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `text-[11px] text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:543`

```jsx
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified in the last 30 days</p>
                </div>
                {!canEarlyAccess ? (
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400`
- `rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-amber-50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:546`

```jsx
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                    Premium
                  </span>
                ) : null}
```
**Raw class strings detected (best effort):**

- `rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:552`

```jsx
                <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                  Unlock early access to newly verified factories with a Premium plan.
                  <div className="mt-2">
                    <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
```
**Raw class strings detected (best effort):**

- `mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30`
- `mt-2`
- `text-[11px] font-semibold text-[var(--gt-blue)] hover:underline`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-amber-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-amber-500/30` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:554`

```jsx
                  <div className="mt-2">
                    <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
                  </div>
                </div>
```
**Raw class strings detected (best effort):**

- `mt-2`
- `text-[11px] font-semibold text-[var(--gt-blue)] hover:underline`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:555`

```jsx
                    <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
                  </div>
                </div>
              ) : (
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-[var(--gt-blue)] hover:underline`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:559`

```jsx
                <div className="mt-3">
                  {earlyVerifiedLoading ? <div className="text-xs text-slate-500">Loading early access list...</div> : null}
                  {earlyVerifiedError ? <div className="text-xs text-rose-600">{earlyVerifiedError}</div> : null}
                  {!earlyVerifiedLoading && !earlyVerifiedError ? (
```
**Raw class strings detected (best effort):**

- `mt-3`
- `text-xs text-slate-500`
- `text-xs text-rose-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.

#### `src/pages/MainFeed.jsx:560`

```jsx
                  {earlyVerifiedLoading ? <div className="text-xs text-slate-500">Loading early access list...</div> : null}
                  {earlyVerifiedError ? <div className="text-xs text-rose-600">{earlyVerifiedError}</div> : null}
                  {!earlyVerifiedLoading && !earlyVerifiedError ? (
                    <div className="space-y-2">
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`
- `text-xs text-rose-600`
- `space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.

#### `src/pages/MainFeed.jsx:561`

```jsx
                  {earlyVerifiedError ? <div className="text-xs text-rose-600">{earlyVerifiedError}</div> : null}
                  {!earlyVerifiedLoading && !earlyVerifiedError ? (
                    <div className="space-y-2">
                      {earlyVerifiedFactories.length ? earlyVerifiedFactories.slice(0, 6).map((factory) => (
```
**Raw class strings detected (best effort):**

- `text-xs text-rose-600`
- `space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.

#### `src/pages/MainFeed.jsx:563`

```jsx
                    <div className="space-y-2">
                      {earlyVerifiedFactories.length ? earlyVerifiedFactories.slice(0, 6).map((factory) => (
                        <Link
                          key={factory.id}
```
**Raw class strings detected (best effort):**

- `space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:568`

```jsx
                          className="block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
                        >
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{factory.name || 'Factory'}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{factory.country || '-'} · verified</p>
```
**Raw class strings detected (best effort):**

- `block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8`
- `text-xs font-semibold text-slate-900 dark:text-slate-100 truncate`
- `text-[11px] text-slate-500 dark:text-slate-400 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-left` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:570`

```jsx
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{factory.name || 'Factory'}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{factory.country || '-'} · verified</p>
                        </Link>
                      )) : (
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-900 dark:text-slate-100 truncate`
- `text-[11px] text-slate-500 dark:text-slate-400 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:571`

```jsx
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{factory.country || '-'} · verified</p>
                        </Link>
                      )) : (
                        <div className="text-xs text-slate-500 dark:text-slate-400">No new verified factories yet.</div>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400 truncate`
- `text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:574`

```jsx
                        <div className="text-xs text-slate-500 dark:text-slate-400">No new verified factories yet.</div>
                      )}
                    </div>
                  ) : null}
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:584`

```jsx
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <FeedSkeletonCard key={`feed-skel-${i}`} index={i} />
              ))}
```
**Raw class strings detected (best effort):**

- `space-y-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:592`

```jsx
            <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30">
              {error}
              <div className="mt-3">
                <button
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30`
- `mt-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-rose-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-rose-200` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-rose-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-rose-500/30` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:594`

```jsx
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => loadFeedPage({ reset: true })}
```
**Raw class strings detected (best effort):**

- `mt-3`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:598`

```jsx
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
                >
                  Retry
                </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:607`

```jsx
            <div className="rounded-2xl bg-[#ffffff] p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-800">
              No feed items found.
            </div>
          ) : null}
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-800`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:644`

```jsx
          <div ref={sentinelRef} className="h-10" />

          {loadingMore ? (
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
```
**Raw class strings detected (best effort):**

- `h-10`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:647`

```jsx
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <div className="h-3 w-40 rounded-full skeleton mx-auto" />
            </div>
          ) : null}
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `h-3 w-40 rounded-full skeleton mx-auto`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-40` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mx-auto` — Horizontal margin (left/right).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:648`

```jsx
              <div className="h-3 w-40 rounded-full skeleton mx-auto" />
            </div>
          ) : null}

```
**Raw class strings detected (best effort):**

- `h-3 w-40 rounded-full skeleton mx-auto`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-40` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/MainFeed.jsx:653`

```jsx
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-3">You’re all caught up.</div>
          ) : null}
        </main>

```
**Raw class strings detected (best effort):**

- `text-center text-xs text-slate-400 dark:text-slate-500 py-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:657`

```jsx
        <aside className="col-span-3 hidden xl:block space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tips</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
```
**Raw class strings detected (best effort):**

- `col-span-3 hidden xl:block space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `xl:block` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:658`

```jsx
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tips</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Turn on <span className="font-semibold">Unique</span> to avoid seeing only one product type all day. Use the category chips for fast filtering.
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed`
- `font-semibold`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:659`

```jsx
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tips</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Turn on <span className="font-semibold">Unique</span> to avoid seeing only one product type all day. Use the category chips for fast filtering.
            </p>
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed`
- `font-semibold`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:660`

```jsx
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Turn on <span className="font-semibold">Unique</span> to avoid seeing only one product type all day. Use the category chips for fast filtering.
            </p>
            <div className="mt-3 flex gap-2">
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed`
- `font-semibold`
- `mt-3 flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:661`

```jsx
              Turn on <span className="font-semibold">Unique</span> to avoid seeing only one product type all day. Use the category chips for fast filtering.
            </p>
            <div className="mt-3 flex gap-2">
              <Link to="/search" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Search</Link>
```
**Raw class strings detected (best effort):**

- `font-semibold`
- `mt-3 flex gap-2`
- `rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:663`

```jsx
            <div className="mt-3 flex gap-2">
              <Link to="/search" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Search</Link>
              <Link to="/notifications" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Alerts</Link>
            </div>
```
**Raw class strings detected (best effort):**

- `mt-3 flex gap-2`
- `rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:664`

```jsx
              <Link to="/search" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Search</Link>
              <Link to="/notifications" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Alerts</Link>
            </div>
          </div>
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/MainFeed.jsx:665`

```jsx
              <Link to="/notifications" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Alerts</Link>
            </div>
          </div>
        </aside>
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/MainFeed.jsx:154` — Loading feed item {index + 1}

```jsx
      <span className="sr-only">Loading feed item {index + 1}</span>
    </div>
  )
}
```
- `src/pages/MainFeed.jsx:482` — Quick actions

```jsx
              <p className="text-xs font-semibold text-slate-700 mb-2">Quick actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((a) => (
                  <Link
```
- `src/pages/MainFeed.jsx:499` — Viewing

```jsx
              <p className="text-xs font-semibold text-slate-500">Viewing</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
```
- `src/pages/MainFeed.jsx:501` — Category: {activeCategory}

```jsx
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
          ) : null}
        </aside>
```
- `src/pages/MainFeed.jsx:509` — Feed

```jsx
              <p className="text-xs font-semibold text-slate-500">Feed</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{headerLabel}</p>
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
```
- `src/pages/MainFeed.jsx:511` — Category: {activeCategory}

```jsx
              {activeCategory ? <p className="mt-1 text-xs text-slate-500">Category: {activeCategory}</p> : null}
            </div>
          ) : null}

```
- `src/pages/MainFeed.jsx:542` — Early access: new verified factories

```jsx
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Early access: new verified factories</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified in the last 30 days</p>
                </div>
                {!canEarlyAccess ? (
```
- `src/pages/MainFeed.jsx:543` — Verified in the last 30 days

```jsx
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified in the last 30 days</p>
                </div>
                {!canEarlyAccess ? (
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
```
- `src/pages/MainFeed.jsx:555` — View Premium options

```jsx
                    <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
                  </div>
                </div>
              ) : (
```
- `src/pages/MainFeed.jsx:659` — Tips

```jsx
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tips</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Turn on <span className="font-semibold">Unique</span> to avoid seeing only one product type all day. Use the category chips for fast filtering.
            </p>
```
- `src/pages/MainFeed.jsx:661` — Unique

```jsx
              Turn on <span className="font-semibold">Unique</span> to avoid seeing only one product type all day. Use the category chips for fast filtering.
            </p>
            <div className="mt-3 flex gap-2">
              <Link to="/search" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Search</Link>
```
- `src/pages/MainFeed.jsx:664` — Search

```jsx
              <Link to="/search" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Search</Link>
              <Link to="/notifications" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Alerts</Link>
            </div>
          </div>
```
- `src/pages/MainFeed.jsx:665` — Alerts

```jsx
              <Link to="/notifications" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Alerts</Link>
            </div>
          </div>
        </aside>
```
- `src/pages/MainFeed.jsx:485` — (element) <Link>

```jsx
                  <Link
                    key={a.to}
                    to={a.to}
                    className="rounded-full borderless-shadow bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
```
- `src/pages/MainFeed.jsx:526` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={() => navigate('/chat', { state: { notice: `Buyer request ${claimedRequestId} claimed. Open inbox to continue.` } })}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
```
- `src/pages/MainFeed.jsx:555` — (element) <Link>

```jsx
                    <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
                  </div>
                </div>
              ) : (
```
- `src/pages/MainFeed.jsx:565` — (element) <Link>

```jsx
                        <Link
                          key={factory.id}
                          to={`/factory/${encodeURIComponent(factory.id)}`}
                          className="block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
```
- `src/pages/MainFeed.jsx:595` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={() => loadFeedPage({ reset: true })}
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
```
- `src/pages/MainFeed.jsx:664` — (element) <Link>

```jsx
              <Link to="/search" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Search</Link>
              <Link to="/notifications" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Alerts</Link>
            </div>
          </div>
```
- `src/pages/MainFeed.jsx:665` — (element) <Link>

```jsx
              <Link to="/notifications" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">Alerts</Link>
            </div>
          </div>
        </aside>
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /feed?${query} (src/pages/MainFeed.jsx:264) | - | - | - | - |
| GET /users/verified/early (src/pages/MainFeed.jsx:305) | /api/users -> server/routes/userRoutes.js:112 | GET /verified/early (server/routes/userRoutes.js:28) | - | listEarlyVerifiedFactoriesController |
| POST /social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}/share (src/pages/MainFeed.jsx:357) | /api/social -> server/routes/socialRoutes.js:129 | - | - | - |
| POST /reports/content (src/pages/MainFeed.jsx:393) | /api/reports -> server/routes/reportRoutes.js:148 | POST /content (server/routes/reportRoutes.js:13) | - | createContentReportController |
| POST /conversations/${encodeURIComponent(item.id)}/claim (src/pages/MainFeed.jsx:414) | /api/conversations -> server/routes/conversationRoutes.js:122 | - | - | - |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/MainFeed.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

