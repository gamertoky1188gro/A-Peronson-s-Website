{% raw %}
# BuyingHouseProfile - Route `/buying-house/:id`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/BuyingHouseProfile.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/BuyingHouseProfile.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_BuyingHouseProfile.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/BuyingHouseProfile.jsx:24)
- ../components/profile/VerificationPanel (src/pages/BuyingHouseProfile.jsx:25)

### 2.2 Structural section tags in JSX

- `aside` at `src/pages/BuyingHouseProfile.jsx:182`

```jsx
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
```
- `main` at `src/pages/BuyingHouseProfile.jsx:240`

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

#### `src/pages/BuyingHouseProfile.jsx:173`

```jsx
  if (loading) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Loading profile…</div>
  if (error) return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">{error}</div>
  if (!user) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>

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

#### `src/pages/BuyingHouseProfile.jsx:174`

```jsx
  if (error) return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">{error}</div>
  if (!user) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>

  const canRequestPartner = viewer && ['factory', 'buying_house', 'admin'].includes(viewer.role) && !viewerPerms.is_self
```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out`
- `min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out`
- `factory`
- `buying_house`
- `admin`

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
- **Other:**
  - `factory` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `buying_house` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `admin` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:175`

```jsx
  if (!user) return <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">Profile not found.</div>

  const canRequestPartner = viewer && ['factory', 'buying_house', 'admin'].includes(viewer.role) && !viewerPerms.is_self

```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out`
- `factory`
- `buying_house`
- `admin`

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
- **Other:**
  - `factory` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `buying_house` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `admin` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:180`

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

#### `src/pages/BuyingHouseProfile.jsx:181`

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

#### `src/pages/BuyingHouseProfile.jsx:182`

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

#### `src/pages/BuyingHouseProfile.jsx:187`

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

#### `src/pages/BuyingHouseProfile.jsx:189`

```jsx
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`
- `min-w-0`
- `text-lg font-bold text-slate-900 truncate`

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

#### `src/pages/BuyingHouseProfile.jsx:190`

```jsx
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
```
**Raw class strings detected (best effort):**

- `h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`
- `min-w-0`
- `text-lg font-bold text-slate-900 truncate`
- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500`

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

#### `src/pages/BuyingHouseProfile.jsx:191`

```jsx
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="uppercase">Buying House</span>
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `text-lg font-bold text-slate-900 truncate`
- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500`
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

#### `src/pages/BuyingHouseProfile.jsx:192`

```jsx
                <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="uppercase">Buying House</span>
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
```
**Raw class strings detected (best effort):**

- `text-lg font-bold text-slate-900 truncate`
- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500`
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

#### `src/pages/BuyingHouseProfile.jsx:193`

```jsx
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="uppercase">Buying House</span>
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
                  {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500`
- `uppercase`
- `font-bold text-[#0A66C2]`

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
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:194`

```jsx
                  <span className="uppercase">Buying House</span>
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
                  {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
                </div>
```
**Raw class strings detected (best effort):**

- `uppercase`
- `font-bold text-[#0A66C2]`

**Utility breakdown (grouped):**

- **Typography:**
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:196`

```jsx
                  {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
                </div>
              </div>
            </div>
```
**Raw class strings detected (best effort):**

- `font-bold text-[#0A66C2]`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:201`

```jsx
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
```
**Raw class strings detected (best effort):**

- `mt-4 flex flex-wrap gap-2`
- `flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]`
- `flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`
- `Following`
- `Follow`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
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
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Following` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Follow` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:202`

```jsx
              <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]`
- `flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`
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
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Following` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Follow` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:203`

```jsx
              <button onClick={follow} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
              <button onClick={connect} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Following` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Follow` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:206`

```jsx
              <button onClick={connect} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
              </button>
            </div>
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `friends` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Connected` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `requested` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Requested` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Connect` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:212`

```jsx
              <div className="mt-3">
                <button
                  type="button"
                  onClick={requestPartner}
```
**Raw class strings detected (best effort):**

- `mt-3`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:216`

```jsx
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Request partner network connection
                </button>
```
**Raw class strings detected (best effort):**

- `w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:220`

```jsx
                {notice ? <p className="mt-2 text-[11px] text-slate-600">{notice}</p> : null}
              </div>
            ) : null}

```
**Raw class strings detected (best effort):**

- `mt-2 text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:224`

```jsx
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Partner factories</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '—'}</p>
```
**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-2 gap-3`
- `rounded-xl border border-slate-200 bg-slate-50 p-3`
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
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:225`

```jsx
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Partner factories</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '—'}</p>
              </div>
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 bg-slate-50 p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

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
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:226`

```jsx
                <p className="text-[11px] text-slate-500">Partner factories</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl border border-slate-200 bg-slate-50 p-3`

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
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:227`

```jsx
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Rating</p>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl border border-slate-200 bg-slate-50 p-3`
- `text-[11px] text-slate-500`

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
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:229`

```jsx
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 bg-slate-50 p-3`
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
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:230`

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

#### `src/pages/BuyingHouseProfile.jsx:231`

```jsx
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
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

#### `src/pages/BuyingHouseProfile.jsx:232`

```jsx
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
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

#### `src/pages/BuyingHouseProfile.jsx:240`

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

#### `src/pages/BuyingHouseProfile.jsx:245`

```jsx
            className="rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {['overview', 'partner', 'products', 'reviews'].map((tab) => (
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800`
- `relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`
- `overview`
- `partner`
- `products`
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
  - `partner` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `products` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `reviews` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:247`

```jsx
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {['overview', 'partner', 'products', 'reviews'].map((tab) => (
                <button
                  key={tab}
```
**Raw class strings detected (best effort):**

- `relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`
- `overview`
- `partner`
- `products`
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
  - `partner` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `products` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `reviews` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:253`

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

#### `src/pages/BuyingHouseProfile.jsx:262`

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

#### `src/pages/BuyingHouseProfile.jsx:271`

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

#### `src/pages/BuyingHouseProfile.jsx:273`

```jsx
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">About</p>
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
```
**Raw class strings detected (best effort):**

- `space-y-4`
- `text-sm font-bold text-slate-900`
- `mt-2 text-sm text-slate-700 whitespace-pre-wrap`

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

#### `src/pages/BuyingHouseProfile.jsx:275`

```jsx
                    <p className="text-sm font-bold text-slate-900">About</p>
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-2 text-sm text-slate-700 whitespace-pre-wrap`
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
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:276`

```jsx
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-700 whitespace-pre-wrap`
- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `rounded-xl border border-slate-200 bg-slate-50 p-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:278`

```jsx
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-500">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.country || '—'}</p>
```
**Raw class strings detected (best effort):**

- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `rounded-xl border border-slate-200 bg-slate-50 p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

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
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:279`

```jsx
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-500">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.country || '—'}</p>
                    </div>
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 bg-slate-50 p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

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
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:280`

```jsx
                      <p className="text-[11px] text-slate-500">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.country || '—'}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl border border-slate-200 bg-slate-50 p-3`

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
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:281`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.country || '—'}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-500">Certifications (declared)</p>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl border border-slate-200 bg-slate-50 p-3`
- `text-[11px] text-slate-500`

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
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:283`

```jsx
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-500">Certifications (declared)</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{(user.profile?.certifications || []).join(', ') || '—'}</p>
                    </div>
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 bg-slate-50 p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

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
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:284`

```jsx
                      <p className="text-[11px] text-slate-500">Certifications (declared)</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{(user.profile?.certifications || []).join(', ') || '—'}</p>
                    </div>
                  </div>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

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

#### `src/pages/BuyingHouseProfile.jsx:285`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900">{(user.profile?.certifications || []).join(', ') || '—'}</p>
                    </div>
                  </div>
                </div>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:292`

```jsx
                <div className="space-y-3">
                  {loadingNetwork ? <div className="text-sm text-slate-600">Loading partner network…</div> : null}
                  {!loadingNetwork && partnerNetwork ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
```
**Raw class strings detected (best effort):**

- `space-y-3`
- `text-sm text-slate-600`
- `rounded-2xl border border-slate-200 bg-slate-50 p-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:293`

```jsx
                  {loadingNetwork ? <div className="text-sm text-slate-600">Loading partner network…</div> : null}
                  {!loadingNetwork && partnerNetwork ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-bold text-slate-900">Connected factories</p>
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600`
- `rounded-2xl border border-slate-200 bg-slate-50 p-4`
- `text-sm font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:295`

```jsx
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-bold text-slate-900">Connected factories</p>
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-slate-50 p-4`
- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:296`

```jsx
                      <p className="text-sm font-bold text-slate-900">Connected factories</p>
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`
- `mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:297`

```jsx
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {partnerNetwork.factories.map((f) => (
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700`
- `mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:299`

```jsx
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {partnerNetwork.factories.map((f) => (
                            <div key={f.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-800">{f.name}</span>
```
**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2`
- `rounded-xl border border-slate-200 bg-white px-3 py-2 flex items-center justify-between`
- `text-xs font-semibold text-slate-800`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:301`

```jsx
                            <div key={f.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-800">{f.name}</span>
                              {f.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : <span className="text-xs text-slate-500">—</span>}
                            </div>
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 bg-white px-3 py-2 flex items-center justify-between`
- `text-xs font-semibold text-slate-800`
- `text-xs font-bold text-[#0A66C2]`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:302`

```jsx
                              <span className="text-xs font-semibold text-slate-800">{f.name}</span>
                              {f.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : <span className="text-xs text-slate-500">—</span>}
                            </div>
                          ))}
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-800`
- `text-xs font-bold text-[#0A66C2]`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:303`

```jsx
                              {f.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : <span className="text-xs text-slate-500">—</span>}
                            </div>
                          ))}
                        </div>
```
**Raw class strings detected (best effort):**

- `text-xs font-bold text-[#0A66C2]`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:308`

```jsx
                        <p className="mt-2 text-[11px] text-slate-600">Factory list is private; only the organization owner/admin can see it.</p>
                      )}
                    </div>
                  ) : null}
```
**Raw class strings detected (best effort):**

- `mt-2 text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:316`

```jsx
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
```
**Raw class strings detected (best effort):**

- `space-y-3`
- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `rounded-2xl border border-slate-200 bg-white p-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:317`

```jsx
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
```
**Raw class strings detected (best effort):**

- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `rounded-2xl border border-slate-200 bg-white p-4`
- `text-sm font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
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
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:319`

```jsx
                      <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
                        <p className="mt-1 text-xs text-slate-600">{p.category || '—'} • MOQ {p.moq || '—'} • Lead time {p.lead_time_days || '—'}</p>
                        <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-4`
- `text-sm font-bold text-slate-900`
- `mt-1 text-xs text-slate-600`
- `mt-2 text-sm text-slate-700 line-clamp-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:320`

```jsx
                        <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
                        <p className="mt-1 text-xs text-slate-600">{p.category || '—'} • MOQ {p.moq || '—'} • Lead time {p.lead_time_days || '—'}</p>
                        <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                      </div>
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-1 text-xs text-slate-600`
- `mt-2 text-sm text-slate-700 line-clamp-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:321`

```jsx
                        <p className="mt-1 text-xs text-slate-600">{p.category || '—'} • MOQ {p.moq || '—'} • Lead time {p.lead_time_days || '—'}</p>
                        <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                      </div>
                    ))}
```
**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-600`
- `mt-2 text-sm text-slate-700 line-clamp-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:322`

```jsx
                        <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                      </div>
                    ))}
                  </div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-700 line-clamp-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:326`

```jsx
                  {loadingProducts ? <div className="text-sm text-slate-600">Loading…</div> : null}
                  {productsNext !== null && !loadingProducts ? (
                    <button
                      type="button"
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:331`

```jsx
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Load more
                    </button>
```
**Raw class strings detected (best effort):**

- `rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:336`

```jsx
                  {!products.length && !loadingProducts ? <div className="text-sm text-slate-600">No products found.</div> : null}
                </div>
              ) : null}

```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:341`

```jsx
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-bold text-slate-900">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700">
```
**Raw class strings detected (best effort):**

- `space-y-3`
- `rounded-xl border border-slate-200 bg-slate-50 p-3`
- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`

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
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:342`

```jsx
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-bold text-slate-900">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 • {ratingSummary?.aggregate?.total_count ?? 0} reviews • {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 bg-slate-50 p-3`
- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`
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
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Other:**
  - `0.0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `low` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:343`

```jsx
                    <p className="text-sm font-bold text-slate-900">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 • {ratingSummary?.aggregate?.total_count ?? 0} reviews • {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`
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
- **Other:**
  - `0.0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `low` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:344`

```jsx
                    <p className="mt-1 text-sm text-slate-700">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 • {ratingSummary?.aggregate?.total_count ?? 0} reviews • {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
                  </div>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700`
- `0.0`
- `low`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `0.0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `low` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:349`

```jsx
                    <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-900">{r.score}★</p>
                      <p className="mt-1 text-sm text-slate-700">{r.comment || 'No comment provided.'}</p>
                    </div>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-4`
- `text-sm font-semibold text-slate-900`
- `mt-1 text-sm text-slate-700`

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
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:350`

```jsx
                      <p className="text-sm font-semibold text-slate-900">{r.score}★</p>
                      <p className="mt-1 text-sm text-slate-700">{r.comment || 'No comment provided.'}</p>
                    </div>
                  ))}
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `mt-1 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:351`

```jsx
                      <p className="mt-1 text-sm text-slate-700">{r.comment || 'No comment provided.'}</p>
                    </div>
                  ))}
                  {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600">No reviews yet.</div> : null}
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700`
- `text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:354`

```jsx
                  {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600">No reviews yet.</div> : null}
                </div>
              ) : null}
            </div>
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/BuyingHouseProfile.jsx:194` — Buying House

```jsx
                  <span className="uppercase">Buying House</span>
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
                  {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
                </div>
```
- `src/pages/BuyingHouseProfile.jsx:195` — • {user.profile.country}

```jsx
                  {user.profile?.country ? <span>• {user.profile.country}</span> : null}
                  {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
                </div>
              </div>
```
- `src/pages/BuyingHouseProfile.jsx:196` — Verified

```jsx
                  {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
                </div>
              </div>
            </div>
```
- `src/pages/BuyingHouseProfile.jsx:202` — Contact

```jsx
              <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
```
- `src/pages/BuyingHouseProfile.jsx:226` — Partner factories

```jsx
                <p className="text-[11px] text-slate-500">Partner factories</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
```
- `src/pages/BuyingHouseProfile.jsx:230` — Rating

```jsx
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
```
- `src/pages/BuyingHouseProfile.jsx:275` — About

```jsx
                    <p className="text-sm font-bold text-slate-900">About</p>
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
```
- `src/pages/BuyingHouseProfile.jsx:280` — Country

```jsx
                      <p className="text-[11px] text-slate-500">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.country || '—'}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
```
- `src/pages/BuyingHouseProfile.jsx:284` — Certifications (declared)

```jsx
                      <p className="text-[11px] text-slate-500">Certifications (declared)</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{(user.profile?.certifications || []).join(', ') || '—'}</p>
                    </div>
                  </div>
```
- `src/pages/BuyingHouseProfile.jsx:296` — Connected factories

```jsx
                      <p className="text-sm font-bold text-slate-900">Connected factories</p>
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
```
- `src/pages/BuyingHouseProfile.jsx:297` — Total: {partnerNetwork.total_connected ?? 0}

```jsx
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {partnerNetwork.factories.map((f) => (
```
- `src/pages/BuyingHouseProfile.jsx:303` — Verified

```jsx
                              {f.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : <span className="text-xs text-slate-500">—</span>}
                            </div>
                          ))}
                        </div>
```
- `src/pages/BuyingHouseProfile.jsx:308` — Factory list is private; only the organization owner/admin can see it.

```jsx
                        <p className="mt-2 text-[11px] text-slate-600">Factory list is private; only the organization owner/admin can see it.</p>
                      )}
                    </div>
                  ) : null}
```
- `src/pages/BuyingHouseProfile.jsx:343` — Rating summary

```jsx
                    <p className="text-sm font-bold text-slate-900">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 • {ratingSummary?.aggregate?.total_count ?? 0} reviews • {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
```
- `src/pages/BuyingHouseProfile.jsx:202` — (element) <button>

```jsx
              <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
```
- `src/pages/BuyingHouseProfile.jsx:203` — (element) <button>

```jsx
              <button onClick={follow} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
              <button onClick={connect} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
```
- `src/pages/BuyingHouseProfile.jsx:206` — (element) <button>

```jsx
              <button onClick={connect} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
              </button>
            </div>
```
- `src/pages/BuyingHouseProfile.jsx:213` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={requestPartner}
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
```
- `src/pages/BuyingHouseProfile.jsx:249` — (element) <button>

```jsx
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
```
- `src/pages/BuyingHouseProfile.jsx:328` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => loadProducts({ reset: false })}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /profiles/${encodeURIComponent(id)} (src/pages/BuyingHouseProfile.jsx:67) | /api/profiles -> server/routes/profileRoutes.js:83 | - | - | - |
| GET /ratings/profiles/user:${encodeURIComponent(id)} (src/pages/BuyingHouseProfile.jsx:84) | /api/ratings -> server/routes/ratingsRoutes.js:81 | - | - | - |
| GET /profiles/${encodeURIComponent(id)}/products?cursor=${cursor}&limit=10 (src/pages/BuyingHouseProfile.jsx:96) | /api/profiles -> server/routes/profileRoutes.js:83 | - | - | - |
| GET /profiles/${encodeURIComponent(id)}/partner-network (src/pages/BuyingHouseProfile.jsx:112) | /api/profiles -> server/routes/profileRoutes.js:83 | - | - | - |
| POST /users/${encodeURIComponent(id)}/follow (src/pages/BuyingHouseProfile.jsx:141) | /api/users -> server/routes/userRoutes.js:60 | - | - | - |
| POST /users/${encodeURIComponent(id)}/friend-request (src/pages/BuyingHouseProfile.jsx:151) | /api/users -> server/routes/userRoutes.js:60 | - | - | - |
| POST /partners/requests (src/pages/BuyingHouseProfile.jsx:166) | /api/partners -> server/routes/partnerNetworkRoutes.js:77 | POST /requests (server/routes/partnerNetworkRoutes.js:14) | - | createPartnerRequest |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/BuyingHouseProfile.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
{% endraw %}

