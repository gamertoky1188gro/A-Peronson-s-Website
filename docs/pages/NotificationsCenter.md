{% raw %}
# NotificationsCenter - Route `/notifications`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/NotificationsCenter.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/NotificationsCenter.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_NotificationsCenter.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/NotificationsCenter.jsx:28)
- ../components/products/ProductQuickViewModal (src/pages/NotificationsCenter.jsx:29)

### 2.2 Structural section tags in JSX

- `main` at `src/pages/NotificationsCenter.jsx:143`

```jsx
        <main className="col-span-12 lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
```
- `aside` at `src/pages/NotificationsCenter.jsx:300`

```jsx
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <p className="text-sm font-bold text-slate-900">Saved Search Alerts</p>
            <p className="mt-1 text-[11px] text-slate-500">These power smart notifications for new matching posts.</p>
```
## 3) Styling (className blocks, utility breakdown, and custom CSS)

### 3.1 Custom CSS utilities referenced by this page (App.css / index.css)

- `.nav-glass` definitions:
  - `src/App.css:615`
- `.spotlight-card` definitions:
  - `src/App.css:267`
- `.skeleton` definitions:
  - `src/App.css:583`
- `.neo-page` definitions:
  - `src/App.css:108`
- `.neo-panel` definitions:
  - `src/App.css:116`
- `.cyberpunk-page` definitions:
  - `src/App.css:109`
- `.cyberpunk-card` definitions:
  - `src/App.css:110`
- `.assistant-orb-btn` definitions:
  - `src/App.css:518`
- `.legal-weave` definitions:
  - `src/App.css:366`
- `.signature-draw` definitions:
  - `src/App.css:401`
- `.verified-shimmer` definitions:
  - `src/App.css:434`
- `.verified-pulse` definitions:
  - `src/App.css:293`
- `.conic-beam` definitions:
  - `src/App.css:302`

### 3.2 Every className block (with grouped explanations)

#### `src/pages/NotificationsCenter.jsx:141`

```jsx
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        <main className="col-span-12 lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out`
- `max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4`
- `col-span-12 lg:col-span-8 space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-12` — Grid layout.
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-6` — Vertical padding (top/bottom).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:142`

```jsx
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        <main className="col-span-12 lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center justify-between gap-3">
```
**Raw class strings detected (best effort):**

- `max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4`
- `col-span-12 lg:col-span-8 space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-12` — Grid layout.
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-6` — Vertical padding (top/bottom).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:143`

```jsx
        <main className="col-span-12 lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
```
**Raw class strings detected (best effort):**

- `col-span-12 lg:col-span-8 space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
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
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:144`

```jsx
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-slate-900">Notifications</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center justify-between gap-3`
- `text-lg font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
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
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:145`

```jsx
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-slate-900">Notifications</p>
                <p className="text-[11px] text-slate-500">Smart search matches, system alerts, and your viewed history.</p>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-lg font-bold text-slate-900`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:147`

```jsx
                <p className="text-lg font-bold text-slate-900">Notifications</p>
                <p className="text-[11px] text-slate-500">Smart search matches, system alerts, and your viewed history.</p>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
```
**Raw class strings detected (best effort):**

- `text-lg font-bold text-slate-900`
- `text-[11px] text-slate-500`
- `inline-flex items-center gap-2 text-xs font-semibold text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:148`

```jsx
                <p className="text-[11px] text-slate-500">Smart search matches, system alerts, and your viewed history.</p>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="h-4 w-4" />
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `inline-flex items-center gap-2 text-xs font-semibold text-slate-700`
- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:150`

```jsx
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="h-4 w-4" />
                Unread only
              </label>
```
**Raw class strings detected (best effort):**

- `inline-flex items-center gap-2 text-xs font-semibold text-slate-700`
- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:151`

```jsx
                <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="h-4 w-4" />
                Unread only
              </label>
            </div>
```
**Raw class strings detected (best effort):**

- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:156`

```jsx
            <div className="mt-4 flex flex-wrap gap-2">
              {TABS.map((t) => {
                const Icon = t.icon
                const active = tab === t.id
```
**Raw class strings detected (best effort):**

- `mt-4 flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:166`

```jsx
                    className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ring-1 ${
                      active
                        ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
                        : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
```
**Raw class strings detected (best effort):**

- `bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35`
- `bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `bg-white/60` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-indigo-200` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#38bdf8]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-[#38bdf8]/35` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:175`

```jsx
                        className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    ) : null}
```
**Raw class strings detected (best effort):**

- `absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10`
- `spring`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `spring` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:179`

```jsx
                    <span className="relative inline-flex items-center gap-2">
                      <Icon size={16} />
                      {t.label}
                    </span>
```
**Raw class strings detected (best effort):**

- `relative inline-flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:190`

```jsx
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `space-y-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/NotificationsCenter.jsx:192`

```jsx
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`notif-skel-${i}`} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10">
                      <div className="flex items-start justify-between gap-3">
```
**Raw class strings detected (best effort):**

- `space-y-3`
- `rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10`
- `flex items-start justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:194`

```jsx
                    <div key={`notif-skel-${i}`} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-3 w-1/3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10`
- `flex items-start justify-between gap-3`
- `min-w-0 flex-1 space-y-2`
- `h-3 w-1/3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:195`

```jsx
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-3 w-1/3 rounded-full skeleton" />
                          <div className="h-3 w-2/3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-3`
- `min-w-0 flex-1 space-y-2`
- `h-3 w-1/3 rounded-full skeleton`
- `h-3 w-2/3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:196`

```jsx
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-3 w-1/3 rounded-full skeleton" />
                          <div className="h-3 w-2/3 rounded-full skeleton" />
                          <div className="h-3 w-1/2 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `min-w-0 flex-1 space-y-2`
- `h-3 w-1/3 rounded-full skeleton`
- `h-3 w-2/3 rounded-full skeleton`
- `h-3 w-1/2 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:197`

```jsx
                          <div className="h-3 w-1/3 rounded-full skeleton" />
                          <div className="h-3 w-2/3 rounded-full skeleton" />
                          <div className="h-3 w-1/2 rounded-full skeleton" />
                        </div>
```
**Raw class strings detected (best effort):**

- `h-3 w-1/3 rounded-full skeleton`
- `h-3 w-2/3 rounded-full skeleton`
- `h-3 w-1/2 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:198`

```jsx
                          <div className="h-3 w-2/3 rounded-full skeleton" />
                          <div className="h-3 w-1/2 rounded-full skeleton" />
                        </div>
                        <div className="h-8 w-20 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `h-3 w-2/3 rounded-full skeleton`
- `h-3 w-1/2 rounded-full skeleton`
- `h-8 w-20 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:199`

```jsx
                          <div className="h-3 w-1/2 rounded-full skeleton" />
                        </div>
                        <div className="h-8 w-20 rounded-full skeleton" />
                      </div>
```
**Raw class strings detected (best effort):**

- `h-3 w-1/2 rounded-full skeleton`
- `h-8 w-20 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:201`

```jsx
                        <div className="h-8 w-20 rounded-full skeleton" />
                      </div>
                    </div>
                  ))}
```
**Raw class strings detected (best effort):**

- `h-8 w-20 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:207`

```jsx
              {!loading && error ? <div className="text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}
              {!loading && !error && !filteredItems.length ? (
                <div className="text-sm text-slate-600">No notifications for this tab.</div>
              ) : null}
```
**Raw class strings detected (best effort):**

- `text-sm text-rose-700 dark:text-rose-200`
- `text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-rose-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:209`

```jsx
                <div className="text-sm text-slate-600">No notifications for this tab.</div>
              ) : null}

              <div className="space-y-3">
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600`
- `space-y-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:212`

```jsx
              <div className="space-y-3">
                {filteredItems.map((i) => (
                  <div key={i.id} className="rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
```
**Raw class strings detected (best effort):**

- `space-y-3`
- `rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5 flex items-start justify-between gap-3`
- `min-w-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50/70` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:214`

```jsx
                  <div key={i.id} className="rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{i.message || i.title || 'Notification'}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{new Date(i.created_at).toLocaleString()}</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5 flex items-start justify-between gap-3`
- `min-w-0`
- `text-sm font-semibold text-slate-900`
- `mt-1 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50/70` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:215`

```jsx
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{i.message || i.title || 'Notification'}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{new Date(i.created_at).toLocaleString()}</p>
                      <p className="mt-1 text-[11px] text-slate-500">Type: {i.type}</p>
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `text-sm font-semibold text-slate-900`
- `mt-1 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:216`

```jsx
                      <p className="text-sm font-semibold text-slate-900">{i.message || i.title || 'Notification'}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{new Date(i.created_at).toLocaleString()}</p>
                      <p className="mt-1 text-[11px] text-slate-500">Type: {i.type}</p>
                    </div>
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `mt-1 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:217`

```jsx
                      <p className="mt-1 text-[11px] text-slate-500">{new Date(i.created_at).toLocaleString()}</p>
                      <p className="mt-1 text-[11px] text-slate-500">Type: {i.type}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
```
**Raw class strings detected (best effort):**

- `mt-1 text-[11px] text-slate-500`
- `flex flex-col gap-2 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:218`

```jsx
                      <p className="mt-1 text-[11px] text-slate-500">Type: {i.type}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
```
**Raw class strings detected (best effort):**

- `mt-1 text-[11px] text-slate-500`
- `flex flex-col gap-2 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:220`

```jsx
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        to={feedLinkForEntity(i.entity_type, i.entity_id)}
                        className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
```
**Raw class strings detected (best effort):**

- `flex flex-col gap-2 shrink-0`
- `rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:223`

```jsx
                        className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
                      >
                        View
                      </Link>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:228`

```jsx
                        <button onClick={() => markRead(i.id)} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                          Mark read
                        </button>
                      ) : null}
```
**Raw class strings detected (best effort):**

- `rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:238`

```jsx
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">Viewed Products</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center justify-between gap-3 mb-3`
- `text-sm font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
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

#### `src/pages/NotificationsCenter.jsx:239`

```jsx
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">Viewed Products</p>
                  <p className="text-[11px] text-slate-500">Private to you • Recorded on Quick View</p>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3 mb-3`
- `text-sm font-bold text-slate-900`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:241`

```jsx
                  <p className="text-sm font-bold text-slate-900">Viewed Products</p>
                  <p className="text-[11px] text-slate-500">Private to you • Recorded on Quick View</p>
                </div>
                <button
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:242`

```jsx
                  <p className="text-[11px] text-slate-500">Private to you • Recorded on Quick View</p>
                </div>
                <button
                  type="button"
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:247`

```jsx
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Refresh
                </button>
```
**Raw class strings detected (best effort):**

- `rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:253`

```jsx
              <div className="space-y-3">
                {views.map((row) => (
                  <div key={row.id} className="rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
```
**Raw class strings detected (best effort):**

- `space-y-3`
- `rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5 flex items-start justify-between gap-3`
- `min-w-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50/70` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:255`

```jsx
                  <div key={row.id} className="rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{row.product?.title || 'Product'}</p>
                      <p className="mt-1 text-[11px] text-slate-500 truncate">{row.author?.name || 'Company'} • {new Date(row.viewed_at).toLocaleString()}</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-50/70 dark:bg-slate-950/30 dark:ring-white/10 dark:hover:bg-white/5 flex items-start justify-between gap-3`
- `min-w-0`
- `text-sm font-semibold text-slate-900 truncate`
- `mt-1 text-[11px] text-slate-500 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50/70` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:256`

```jsx
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{row.product?.title || 'Product'}</p>
                      <p className="mt-1 text-[11px] text-slate-500 truncate">{row.author?.name || 'Company'} • {new Date(row.viewed_at).toLocaleString()}</p>
                      <p className="mt-2 text-xs text-slate-600">
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `text-sm font-semibold text-slate-900 truncate`
- `mt-1 text-[11px] text-slate-500 truncate`
- `mt-2 text-xs text-slate-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:257`

```jsx
                      <p className="text-sm font-semibold text-slate-900 truncate">{row.product?.title || 'Product'}</p>
                      <p className="mt-1 text-[11px] text-slate-500 truncate">{row.author?.name || 'Company'} • {new Date(row.viewed_at).toLocaleString()}</p>
                      <p className="mt-2 text-xs text-slate-600">
                        {row.product?.category || '—'} • MOQ {row.product?.moq || '—'} • Lead time {row.product?.lead_time_days || '—'}
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 truncate`
- `mt-1 text-[11px] text-slate-500 truncate`
- `mt-2 text-xs text-slate-600`
- `—`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `—` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:258`

```jsx
                      <p className="mt-1 text-[11px] text-slate-500 truncate">{row.author?.name || 'Company'} • {new Date(row.viewed_at).toLocaleString()}</p>
                      <p className="mt-2 text-xs text-slate-600">
                        {row.product?.category || '—'} • MOQ {row.product?.moq || '—'} • Lead time {row.product?.lead_time_days || '—'}
                      </p>
```
**Raw class strings detected (best effort):**

- `mt-1 text-[11px] text-slate-500 truncate`
- `mt-2 text-xs text-slate-600`
- `—`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `—` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:259`

```jsx
                      <p className="mt-2 text-xs text-slate-600">
                        {row.product?.category || '—'} • MOQ {row.product?.moq || '—'} • Lead time {row.product?.lead_time_days || '—'}
                      </p>
                    </div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-slate-600`
- `—`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Other:**
  - `—` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:263`

```jsx
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuickViewItem({ ...row.product, author: row.author })}
```
**Raw class strings detected (best effort):**

- `flex flex-col gap-2 shrink-0`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:267`

```jsx
                        className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Quick view
                      </button>
```
**Raw class strings detected (best effort):**

- `rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:274`

```jsx
                          className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
                        >
                          Company
                        </Link>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:283`

```jsx
                {loadingViews ? <div className="text-sm text-slate-600">Loading…</div> : null}
                {!views.length && !loadingViews ? <div className="text-sm text-slate-600">No viewed products yet.</div> : null}
              </div>

```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:284`

```jsx
                {!views.length && !loadingViews ? <div className="text-sm text-slate-600">No viewed products yet.</div> : null}
              </div>

              {viewsNext !== null && !loadingViews ? (
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:291`

```jsx
                  className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
                >
                  Load more
                </button>
```
**Raw class strings detected (best effort):**

- `mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:300`

```jsx
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <p className="text-sm font-bold text-slate-900">Saved Search Alerts</p>
            <p className="mt-1 text-[11px] text-slate-500">These power smart notifications for new matching posts.</p>
```
**Raw class strings detected (best effort):**

- `col-span-12 lg:col-span-4 space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-sm font-bold text-slate-900`
- `mt-1 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:301`

```jsx
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <p className="text-sm font-bold text-slate-900">Saved Search Alerts</p>
            <p className="mt-1 text-[11px] text-slate-500">These power smart notifications for new matching posts.</p>
            <div className="mt-3 space-y-2">
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-sm font-bold text-slate-900`
- `mt-1 text-[11px] text-slate-500`
- `mt-3 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:302`

```jsx
            <p className="text-sm font-bold text-slate-900">Saved Search Alerts</p>
            <p className="mt-1 text-[11px] text-slate-500">These power smart notifications for new matching posts.</p>
            <div className="mt-3 space-y-2">
              {alerts.length ? alerts.map((a) => (
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-1 text-[11px] text-slate-500`
- `mt-3 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:303`

```jsx
            <p className="mt-1 text-[11px] text-slate-500">These power smart notifications for new matching posts.</p>
            <div className="mt-3 space-y-2">
              {alerts.length ? alerts.map((a) => (
                <div key={a.id} className="rounded-xl bg-white p-3 ring-1 ring-slate-200/70 shadow-sm dark:bg-white/5 dark:ring-white/10 flex items-start justify-between gap-2">
```
**Raw class strings detected (best effort):**

- `mt-1 text-[11px] text-slate-500`
- `mt-3 space-y-2`
- `rounded-xl bg-white p-3 ring-1 ring-slate-200/70 shadow-sm dark:bg-white/5 dark:ring-white/10 flex items-start justify-between gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `shadow-sm` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:304`

```jsx
            <div className="mt-3 space-y-2">
              {alerts.length ? alerts.map((a) => (
                <div key={a.id} className="rounded-xl bg-white p-3 ring-1 ring-slate-200/70 shadow-sm dark:bg-white/5 dark:ring-white/10 flex items-start justify-between gap-2">
                  <div className="min-w-0">
```
**Raw class strings detected (best effort):**

- `mt-3 space-y-2`
- `rounded-xl bg-white p-3 ring-1 ring-slate-200/70 shadow-sm dark:bg-white/5 dark:ring-white/10 flex items-start justify-between gap-2`
- `min-w-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `shadow-sm` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:306`

```jsx
                <div key={a.id} className="rounded-xl bg-white p-3 ring-1 ring-slate-200/70 shadow-sm dark:bg-white/5 dark:ring-white/10 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{a.query}</p>
                    <p className="text-[11px] text-slate-500">Updated: {new Date(a.updated_at || a.created_at).toLocaleString()}</p>
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 ring-1 ring-slate-200/70 shadow-sm dark:bg-white/5 dark:ring-white/10 flex items-start justify-between gap-2`
- `min-w-0`
- `text-xs font-semibold text-slate-900 truncate`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
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
  - `shadow-sm` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:307`

```jsx
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{a.query}</p>
                    <p className="text-[11px] text-slate-500">Updated: {new Date(a.updated_at || a.created_at).toLocaleString()}</p>
                  </div>
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `text-xs font-semibold text-slate-900 truncate`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:308`

```jsx
                    <p className="text-xs font-semibold text-slate-900 truncate">{a.query}</p>
                    <p className="text-[11px] text-slate-500">Updated: {new Date(a.updated_at || a.created_at).toLocaleString()}</p>
                  </div>
                  <button
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-900 truncate`
- `text-[11px] text-slate-500`

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

#### `src/pages/NotificationsCenter.jsx:309`

```jsx
                    <p className="text-[11px] text-slate-500">Updated: {new Date(a.updated_at || a.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:314`

```jsx
                    className="rounded-full border border-slate-200 p-2 hover:bg-rose-50"
                    aria-label="Delete alert"
                    title="Delete alert"
                  >
```
**Raw class strings detected (best effort):**

- `rounded-full border border-slate-200 p-2 hover:bg-rose-50`
- `Delete alert`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-2` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-rose-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Delete` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `alert` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/NotificationsCenter.jsx:318`

```jsx
                    <Trash2 size={16} className="text-rose-600" />
                  </button>
                </div>
              )) : (
```
**Raw class strings detected (best effort):**

- `text-rose-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-rose-600` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:322`

```jsx
                <div className="text-xs text-slate-500">No saved alerts yet. Save an alert from the search page.</div>
              )}
            </div>
          </div>
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:327`

```jsx
          <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <p className="text-sm font-bold text-slate-900">Tips</p>
            <ul className="mt-2 text-xs text-slate-600 space-y-1">
              <li>- Smart matches trigger when new buyer requests or products match your saved alert keywords.</li>
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-sm font-bold text-slate-900`
- `mt-2 text-xs text-slate-600 space-y-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
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
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/NotificationsCenter.jsx:328`

```jsx
            <p className="text-sm font-bold text-slate-900">Tips</p>
            <ul className="mt-2 text-xs text-slate-600 space-y-1">
              <li>- Smart matches trigger when new buyer requests or products match your saved alert keywords.</li>
              <li>- Use verification and credibility to reduce fraud risk.</li>
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-2 text-xs text-slate-600 space-y-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/NotificationsCenter.jsx:329`

```jsx
            <ul className="mt-2 text-xs text-slate-600 space-y-1">
              <li>- Smart matches trigger when new buyer requests or products match your saved alert keywords.</li>
              <li>- Use verification and credibility to reduce fraud risk.</li>
              <li>- Viewed history is private and helps you revisit products quickly.</li>
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-slate-600 space-y-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/NotificationsCenter.jsx:147` — Notifications

```jsx
                <p className="text-lg font-bold text-slate-900">Notifications</p>
                <p className="text-[11px] text-slate-500">Smart search matches, system alerts, and your viewed history.</p>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
```
- `src/pages/NotificationsCenter.jsx:148` — Smart search matches, system alerts, and your viewed history.

```jsx
                <p className="text-[11px] text-slate-500">Smart search matches, system alerts, and your viewed history.</p>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="h-4 w-4" />
```
- `src/pages/NotificationsCenter.jsx:218` — Type: {i.type}

```jsx
                      <p className="mt-1 text-[11px] text-slate-500">Type: {i.type}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
```
- `src/pages/NotificationsCenter.jsx:241` — Viewed Products

```jsx
                  <p className="text-sm font-bold text-slate-900">Viewed Products</p>
                  <p className="text-[11px] text-slate-500">Private to you • Recorded on Quick View</p>
                </div>
                <button
```
- `src/pages/NotificationsCenter.jsx:242` — Private to you • Recorded on Quick View

```jsx
                  <p className="text-[11px] text-slate-500">Private to you • Recorded on Quick View</p>
                </div>
                <button
                  type="button"
```
- `src/pages/NotificationsCenter.jsx:302` — Saved Search Alerts

```jsx
            <p className="text-sm font-bold text-slate-900">Saved Search Alerts</p>
            <p className="mt-1 text-[11px] text-slate-500">These power smart notifications for new matching posts.</p>
            <div className="mt-3 space-y-2">
              {alerts.length ? alerts.map((a) => (
```
- `src/pages/NotificationsCenter.jsx:303` — These power smart notifications for new matching posts.

```jsx
            <p className="mt-1 text-[11px] text-slate-500">These power smart notifications for new matching posts.</p>
            <div className="mt-3 space-y-2">
              {alerts.length ? alerts.map((a) => (
                <div key={a.id} className="rounded-xl bg-white p-3 ring-1 ring-slate-200/70 shadow-sm dark:bg-white/5 dark:ring-white/10 flex items-start justify-between gap-2">
```
- `src/pages/NotificationsCenter.jsx:309` — Updated: {new Date(a.updated_at \|\| a.created_at).toLocaleString()}

```jsx
                    <p className="text-[11px] text-slate-500">Updated: {new Date(a.updated_at || a.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
```
- `src/pages/NotificationsCenter.jsx:328` — Tips

```jsx
            <p className="text-sm font-bold text-slate-900">Tips</p>
            <ul className="mt-2 text-xs text-slate-600 space-y-1">
              <li>- Smart matches trigger when new buyer requests or products match your saved alert keywords.</li>
              <li>- Use verification and credibility to reduce fraud risk.</li>
```
- `src/pages/NotificationsCenter.jsx:330` — - Smart matches trigger when new buyer requests or products match your saved alert keywords.

```jsx
              <li>- Smart matches trigger when new buyer requests or products match your saved alert keywords.</li>
              <li>- Use verification and credibility to reduce fraud risk.</li>
              <li>- Viewed history is private and helps you revisit products quickly.</li>
            </ul>
```
- `src/pages/NotificationsCenter.jsx:331` — - Use verification and credibility to reduce fraud risk.

```jsx
              <li>- Use verification and credibility to reduce fraud risk.</li>
              <li>- Viewed history is private and helps you revisit products quickly.</li>
            </ul>
          </div>
```
- `src/pages/NotificationsCenter.jsx:332` — - Viewed history is private and helps you revisit products quickly.

```jsx
              <li>- Viewed history is private and helps you revisit products quickly.</li>
            </ul>
          </div>
        </aside>
```
- `src/pages/NotificationsCenter.jsx:315` — Delete alert

```jsx
                    aria-label="Delete alert"
                    title="Delete alert"
                  >
                    <Trash2 size={16} className="text-rose-600" />
```
- `src/pages/NotificationsCenter.jsx:316` — Delete alert

```jsx
                    title="Delete alert"
                  >
                    <Trash2 size={16} className="text-rose-600" />
                  </button>
```
- `src/pages/NotificationsCenter.jsx:221` — (element) <Link>

```jsx
                      <Link
                        to={feedLinkForEntity(i.entity_type, i.entity_id)}
                        className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
                      >
```
- `src/pages/NotificationsCenter.jsx:228` — (element) <button>

```jsx
                        <button onClick={() => markRead(i.id)} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                          Mark read
                        </button>
                      ) : null}
```
- `src/pages/NotificationsCenter.jsx:244` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={() => loadViews({ reset: true })}
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
```
- `src/pages/NotificationsCenter.jsx:264` — (element) <button>

```jsx
                      <button
                        type="button"
                        onClick={() => setQuickViewItem({ ...row.product, author: row.author })}
                        className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
```
- `src/pages/NotificationsCenter.jsx:272` — (element) <Link>

```jsx
                        <Link
                          to={row.author.role === 'buying_house' ? `/buying-house/${row.author.id}` : `/factory/${row.author.id}`}
                          className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center"
                        >
```
- `src/pages/NotificationsCenter.jsx:288` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={() => loadViews({ reset: false })}
                  className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
```
- `src/pages/NotificationsCenter.jsx:311` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={() => deleteAlert(a.id)}
                    className="rounded-full border border-slate-200 p-2 hover:bg-rose-50"
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /notifications (src/pages/NotificationsCenter.jsx:69) | /api/notifications -> server/routes/notificationRoutes.js:74 | GET / (server/routes/notificationRoutes.js:7) | server/controllers/notificationController.js | getNotifications |
| GET /notifications/search-alerts (src/pages/NotificationsCenter.jsx:82) | /api/notifications -> server/routes/notificationRoutes.js:74 | GET /search-alerts (server/routes/notificationRoutes.js:9) | server/controllers/notificationController.js | getSearchAlerts |
| GET /products/views/me?cursor=${cursor}&limit=10 (src/pages/NotificationsCenter.jsx:94) | /api/products -> server/routes/productRoutes.js:67 | - | - | - |
| PATCH /notifications/${encodeURIComponent(id)}/read (src/pages/NotificationsCenter.jsx:120) | /api/notifications -> server/routes/notificationRoutes.js:74 | - | - | - |
| DELETE /notifications/search-alerts/${encodeURIComponent(id)} (src/pages/NotificationsCenter.jsx:126) | /api/notifications -> server/routes/notificationRoutes.js:74 | - | - | - |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/NotificationsCenter.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
{% endraw %}

