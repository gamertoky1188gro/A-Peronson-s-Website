# BuyerProfile - Route `/buyer/:id`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/BuyerProfile.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/BuyerProfile.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_BuyerProfile.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/BuyerProfile.jsx:30)
- ../components/profile/VerificationPanel (src/pages/BuyerProfile.jsx:31)

### 2.2 Structural section tags in JSX

- `aside` at `src/pages/BuyerProfile.jsx:156`

```jsx
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
```
- `main` at `src/pages/BuyerProfile.jsx:206`

```jsx
        <main className="col-span-12 lg:col-span-8 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
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

#### `src/pages/BuyerProfile.jsx:144`

```jsx
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Loading profile…</div>
  }
  if (error) {
    return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">{error}</div>
```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out`
- `min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:147`

```jsx
    return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">{error}</div>
  }
  if (!user) {
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>
```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out`
- `min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-rose-700` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:150`

```jsx
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>
  }

  return (
```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:154`

```jsx
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out`
- `max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4`
- `col-span-12 lg:col-span-4 space-y-4`

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
- **Typography:**
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:155`

```jsx
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
```
**Raw class strings detected (best effort):**

- `max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4`
- `col-span-12 lg:col-span-4 space-y-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
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
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:156`

```jsx
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
```
**Raw class strings detected (best effort):**

- `col-span-12 lg:col-span-4 space-y-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:161`

```jsx
            className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center gap-3`
- `h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:163`

```jsx
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`
- `min-w-0`
- `text-lg font-bold text-slate-900 dark:text-slate-100 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:164`

```jsx
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
```
**Raw class strings detected (best effort):**

- `h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`
- `min-w-0`
- `text-lg font-bold text-slate-900 dark:text-slate-100 truncate`
- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:165`

```jsx
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="uppercase">Buyer</span>
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `text-lg font-bold text-slate-900 dark:text-slate-100 truncate`
- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400`
- `uppercase`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:166`

```jsx
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="uppercase">Buyer</span>
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
```
**Raw class strings detected (best effort):**

- `text-lg font-bold text-slate-900 dark:text-slate-100 truncate`
- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400`
- `uppercase`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:167`

```jsx
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="uppercase">Buyer</span>
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
                  {user.verified ? (
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400`
- `uppercase`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:168`

```jsx
                  <span className="uppercase">Buyer</span>
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
                  {user.verified ? (
                    <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
```
**Raw class strings detected (best effort):**

- `uppercase`
- `verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-r` — Background color/surface.
  - `from-emerald-500/15` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-teal-500/15` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-emerald-500/20` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:from-emerald-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:to-teal-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-emerald-400/25` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verified-shimmer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:171`

```jsx
                    <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                      Verified
                    </span>
                  ) : null}
```
**Raw class strings detected (best effort):**

- `verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-r` — Background color/surface.
  - `from-emerald-500/15` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-teal-500/15` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-emerald-500/20` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:from-emerald-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:to-teal-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-emerald-400/25` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verified-shimmer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:179`

```jsx
            <div className="mt-4 flex gap-2">
              <button onClick={contact} className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.following ? 'Following' : 'Follow'}
```
**Raw class strings detected (best effort):**

- `mt-4 flex gap-2`
- `flex-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950`
- `flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`
- `Following`
- `Follow`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-1` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-indigo-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-indigo-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-950` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Following` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Follow` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:180`

```jsx
              <button onClick={contact} className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950`
- `flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`
- `Following`
- `Follow`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-indigo-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-indigo-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-950` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Following` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Follow` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:181`

```jsx
              <button onClick={follow} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
              <button onClick={connect} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`
- `Following`
- `Follow`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
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
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Following` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Follow` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:184`

```jsx
              <button onClick={connect} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
              </button>
            </div>
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`
- `friends`
- `Connected`
- `requested`
- `Requested`
- `Connect`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
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
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `friends` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Connected` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `requested` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Requested` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Connect` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:189`

```jsx
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
```
**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-2 gap-3`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:190`

```jsx
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:191`

```jsx
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:192`

```jsx
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:193`

```jsx
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Requests</p>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-600`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:195`

```jsx
              <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                <p className="text-[11px] text-slate-500">Requests</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
                <p className="text-[11px] text-slate-600">Total posted</p>
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:196`

```jsx
                <p className="text-[11px] text-slate-500">Requests</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
                <p className="text-[11px] text-slate-600">Total posted</p>
              </div>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:197`

```jsx
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
                <p className="text-[11px] text-slate-600">Total posted</p>
              </div>
            </div>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:198`

```jsx
                <p className="text-[11px] text-slate-600">Total posted</p>
              </div>
            </div>
          </motion.div>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:206`

```jsx
        <main className="col-span-12 lg:col-span-8 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
```
**Raw class strings detected (best effort):**

- `col-span-12 lg:col-span-8 space-y-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:211`

```jsx
            className="rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {['overview', 'requests', 'reviews'].map((tab) => (
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800`
- `relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`
- `overview`
- `requests`
- `reviews`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `bg-white/60` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `border-b` — Border style/width/color.
  - `border-slate-200/60` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `overview` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `requests` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `reviews` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:213`

```jsx
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {['overview', 'requests', 'reviews'].map((tab) => (
                <button
                  key={tab}
```
**Raw class strings detected (best effort):**

- `relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`
- `overview`
- `requests`
- `reviews`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-white/60` — Background color/surface.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200/60` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `overview` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `requests` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `reviews` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:219`

```jsx
                  className={`relative rounded-full px-3 py-2 text-xs font-semibold transition ring-1 active:scale-95 ${
                    activeTab === tab
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

#### `src/pages/BuyerProfile.jsx:228`

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

#### `src/pages/BuyerProfile.jsx:237`

```jsx
            <div className="p-4">
              {activeTab === 'overview' ? (
                <div className="space-y-4">
                  <div>
```
**Raw class strings detected (best effort):**

- `p-4`
- `overview`
- `space-y-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `overview` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:239`

```jsx
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
```
**Raw class strings detected (best effort):**

- `space-y-4`
- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:241`

```jsx
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>

```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:242`

```jsx
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap`
- `grid grid-cols-1 sm:grid-cols-2 gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:245`

```jsx
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '—'}</p>
```
**Raw class strings detected (best effort):**

- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:246`

```jsx
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '—'}</p>
                    </div>
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:247`

```jsx
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:248`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Certifications (declared)</p>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:250`

```jsx
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Certifications (declared)</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '—'}</p>
                    </div>
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:251`

```jsx
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Certifications (declared)</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '—'}</p>
                    </div>
                  </div>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:252`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '—'}</p>
                    </div>
                  </div>
                </div>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:259`

```jsx
                <div className="space-y-3">
                  {requests.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
```
**Raw class strings detected (best effort):**

- `space-y-3`
- `rounded-2xl border border-slate-200 bg-white p-4`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyerProfile.jsx:261`

```jsx
                    <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{r.category || 'Request'}</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-4`
- `flex items-start justify-between gap-3`
- `text-sm font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyerProfile.jsx:262`

```jsx
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{r.category || 'Request'}</p>
                          <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{r.custom_description || ''}</p>
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-3`
- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700 whitespace-pre-wrap`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:264`

```jsx
                          <p className="text-sm font-bold text-slate-900">{r.category || 'Request'}</p>
                          <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{r.custom_description || ''}</p>
                          <div className="mt-2 text-xs text-slate-600 grid grid-cols-2 gap-2">
                            <div>Quantity: <span className="font-semibold text-slate-800">{r.quantity || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700 whitespace-pre-wrap`
- `mt-2 text-xs text-slate-600 grid grid-cols-2 gap-2`
- `font-semibold text-slate-800`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:265`

```jsx
                          <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{r.custom_description || ''}</p>
                          <div className="mt-2 text-xs text-slate-600 grid grid-cols-2 gap-2">
                            <div>Quantity: <span className="font-semibold text-slate-800">{r.quantity || '-'}</span></div>
                            <div>Timeline: <span className="font-semibold text-slate-800">{r.timeline_days || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700 whitespace-pre-wrap`
- `mt-2 text-xs text-slate-600 grid grid-cols-2 gap-2`
- `font-semibold text-slate-800`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:266`

```jsx
                          <div className="mt-2 text-xs text-slate-600 grid grid-cols-2 gap-2">
                            <div>Quantity: <span className="font-semibold text-slate-800">{r.quantity || '-'}</span></div>
                            <div>Timeline: <span className="font-semibold text-slate-800">{r.timeline_days || '-'}</span></div>
                            <div>Material: <span className="font-semibold text-slate-800">{r.material || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-slate-600 grid grid-cols-2 gap-2`
- `font-semibold text-slate-800`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:267`

```jsx
                            <div>Quantity: <span className="font-semibold text-slate-800">{r.quantity || '-'}</span></div>
                            <div>Timeline: <span className="font-semibold text-slate-800">{r.timeline_days || '-'}</span></div>
                            <div>Material: <span className="font-semibold text-slate-800">{r.material || '-'}</span></div>
                            <div>Status: <span className="font-semibold text-slate-800">{r.status || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:268`

```jsx
                            <div>Timeline: <span className="font-semibold text-slate-800">{r.timeline_days || '-'}</span></div>
                            <div>Material: <span className="font-semibold text-slate-800">{r.material || '-'}</span></div>
                            <div>Status: <span className="font-semibold text-slate-800">{r.status || '-'}</span></div>
                          </div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:269`

```jsx
                            <div>Material: <span className="font-semibold text-slate-800">{r.material || '-'}</span></div>
                            <div>Status: <span className="font-semibold text-slate-800">{r.status || '-'}</span></div>
                          </div>
                        </div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.

#### `src/pages/BuyerProfile.jsx:270`

```jsx
                            <div>Status: <span className="font-semibold text-slate-800">{r.status || '-'}</span></div>
                          </div>
                        </div>
                        <div className="shrink-0">
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800`
- `shrink-0`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:273`

```jsx
                        <div className="shrink-0">
                          <button onClick={contact} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
                        </div>
                      </div>
```
**Raw class strings detected (best effort):**

- `shrink-0`
- `rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:274`

```jsx
                          <button onClick={contact} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
                        </div>
                      </div>
                    </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:280`

```jsx
                  {loadingRequests ? <div className="text-sm text-slate-600 dark:text-slate-300">Loading…</div> : null}
                  {requestsNext !== null && !loadingRequests ? (
                    <button
                      type="button"
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600 dark:text-slate-300`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:285`

```jsx
                      className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
                    >
                      Load more
                    </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`

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
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:290`

```jsx
                  {!requests.length && !loadingRequests ? <div className="text-sm text-slate-600 dark:text-slate-300">No requests found.</div> : null}
                </div>
              ) : null}

```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:295`

```jsx
                <div className="space-y-3">
                  <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
```
**Raw class strings detected (best effort):**

- `space-y-3`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-sm text-slate-700 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:296`

```jsx
                  <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 • {ratingSummary?.aggregate?.total_count ?? 0} reviews • {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-sm text-slate-700 dark:text-slate-300`
- `0.0`
- `low`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `0.0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `low` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:297`

```jsx
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 • {ratingSummary?.aggregate?.total_count ?? 0} reviews • {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-sm text-slate-700 dark:text-slate-300`
- `0.0`
- `low`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `0.0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `low` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:298`

```jsx
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 • {ratingSummary?.aggregate?.total_count ?? 0} reviews • {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
                  </div>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700 dark:text-slate-300`
- `0.0`
- `low`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `0.0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `low` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyerProfile.jsx:303`

```jsx
                    <div key={r.id} className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.score}★</p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{r.comment || 'No comment provided.'}</p>
                    </div>
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 text-sm text-slate-700 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:304`

```jsx
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.score}★</p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{r.comment || 'No comment provided.'}</p>
                    </div>
                  ))}
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 text-sm text-slate-700 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:305`

```jsx
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{r.comment || 'No comment provided.'}</p>
                    </div>
                  ))}
                  {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600 dark:text-slate-300">No reviews yet.</div> : null}
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700 dark:text-slate-300`
- `text-sm text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyerProfile.jsx:308`

```jsx
                  {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600 dark:text-slate-300">No reviews yet.</div> : null}
                </div>
              ) : null}
            </div>
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/BuyerProfile.jsx:168` — Buyer

```jsx
                  <span className="uppercase">Buyer</span>
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
                  {user.verified ? (
                    <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
```
- `src/pages/BuyerProfile.jsx:169` — • {user.profile.country}

```jsx
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
                  {user.verified ? (
                    <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                      Verified
```
- `src/pages/BuyerProfile.jsx:180` — Contact

```jsx
              <button onClick={contact} className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
```
- `src/pages/BuyerProfile.jsx:191` — Rating

```jsx
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
```
- `src/pages/BuyerProfile.jsx:196` — Requests

```jsx
                <p className="text-[11px] text-slate-500">Requests</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
                <p className="text-[11px] text-slate-600">Total posted</p>
              </div>
```
- `src/pages/BuyerProfile.jsx:198` — Total posted

```jsx
                <p className="text-[11px] text-slate-600">Total posted</p>
              </div>
            </div>
          </motion.div>
```
- `src/pages/BuyerProfile.jsx:241` — About

```jsx
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>

```
- `src/pages/BuyerProfile.jsx:247` — Country

```jsx
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```
- `src/pages/BuyerProfile.jsx:251` — Certifications (declared)

```jsx
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Certifications (declared)</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '—'}</p>
                    </div>
                  </div>
```
- `src/pages/BuyerProfile.jsx:274` — Contact

```jsx
                          <button onClick={contact} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
                        </div>
                      </div>
                    </div>
```
- `src/pages/BuyerProfile.jsx:297` — Rating summary

```jsx
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 • {ratingSummary?.aggregate?.total_count ?? 0} reviews • {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
```
- `src/pages/BuyerProfile.jsx:180` — (element) <button>

```jsx
              <button onClick={contact} className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
```
- `src/pages/BuyerProfile.jsx:181` — (element) <button>

```jsx
              <button onClick={follow} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
              <button onClick={connect} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
```
- `src/pages/BuyerProfile.jsx:184` — (element) <button>

```jsx
              <button onClick={connect} className="flex-1 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
              </button>
            </div>
```
- `src/pages/BuyerProfile.jsx:215` — (element) <button>

```jsx
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
```
- `src/pages/BuyerProfile.jsx:274` — (element) <button>

```jsx
                          <button onClick={contact} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
                        </div>
                      </div>
                    </div>
```
- `src/pages/BuyerProfile.jsx:282` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => loadRequests({ reset: false })}
                      className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /profiles/${encodeURIComponent(id)} (src/pages/BuyerProfile.jsx:67) | /api/profiles -> server/routes/profileRoutes.js:83 | - | - | - |
| GET /ratings/profiles/user:${encodeURIComponent(id)} (src/pages/BuyerProfile.jsx:84) | /api/ratings -> server/routes/ratingsRoutes.js:81 | - | - | - |
| GET /profiles/${encodeURIComponent(id)}/requests?cursor=${cursor}&limit=10 (src/pages/BuyerProfile.jsx:96) | /api/profiles -> server/routes/profileRoutes.js:83 | - | - | - |
| POST /users/${encodeURIComponent(id)}/follow (src/pages/BuyerProfile.jsx:122) | /api/users -> server/routes/userRoutes.js:60 | - | - | - |
| POST /users/${encodeURIComponent(id)}/friend-request (src/pages/BuyerProfile.jsx:132) | /api/users -> server/routes/userRoutes.js:60 | - | - | - |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/BuyerProfile.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

