{% raw %}
# SearchResults - Route `/search`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## IA + Control Map (2026-04 UX pass)

### Top-level filter sections

1. **Product**
   - **Core (always visible):** Industry, MOQ range, Price per unit.
   - **More filters:** Country and Verified only.
   - **Advanced nested block:** Product attributes (fabric type, GSM, size range, color/pantone, customization, sample readiness, certifications, incoterms).
2. **Supplier / Account**
   - **Core (always visible):** Account type.
   - **More filters:** Lead-time cap.
   - **Advanced nested block:** Supplier/account attributes (payment terms, document readiness, audit, language support, capacity, processes, team/response buckets, export ports, geo distance, multi-factory handling).

### Progressive disclosure model

- Level 1: section core controls.
- Level 2: section “More filters”.
- Level 3: nested “Advanced block” within Product or Supplier/Account mode.

### Presets and persistence

- Presets: `buyer`, `buying_house`, `factory`.
- Selected preset is persisted in local storage (`gt_search_selected_preset`).
- Preset-specific filter payloads are saved locally (`gt_search_preset_<preset>`), and can also be saved server-side using search alerts.

### Sticky active-filter rail

- Active filter chips and a global **Clear all** action remain visible in a sticky area under category chips.

### Telemetry

- `search_filter_depth_opened`: records disclosure depth (1-3) and preset.
- `search_filter_abandonment`: tracks abandonment when filters were changed but no search run occurred.
- `search_preset_conversion`: tracks search conversion by selected preset.

### UX cleanup decisions

- Rare/secondary controls were moved behind section “More filters” and nested advanced blocks.
- First interaction path now prioritizes high-signal, low-friction controls.

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/SearchResults.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/SearchResults.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_SearchResults.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/SearchResults.jsx:34)
- ../components/products/ProductQuickViewModal (src/pages/SearchResults.jsx:35)

### 2.2 Structural section tags in JSX

- `aside` at `src/pages/SearchResults.jsx:569`

```jsx
          <aside className="col-span-12 xl:col-span-3 space-y-4">
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you • Recorded on Quick View</p>
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

#### `src/pages/SearchResults.jsx:77`

```jsx
    <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-3 w-1/3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-start justify-between gap-3`
- `min-w-0 flex-1`
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

#### `src/pages/SearchResults.jsx:78`

```jsx
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-3 w-1/3 rounded-full skeleton" />
          <div className="mt-3 h-3 w-3/4 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-3`
- `min-w-0 flex-1`
- `h-3 w-1/3 rounded-full skeleton`
- `mt-3 h-3 w-3/4 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3/4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:79`

```jsx
        <div className="min-w-0 flex-1">
          <div className="h-3 w-1/3 rounded-full skeleton" />
          <div className="mt-3 h-3 w-3/4 rounded-full skeleton" />
          <div className="mt-2 h-3 w-2/3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `min-w-0 flex-1`
- `h-3 w-1/3 rounded-full skeleton`
- `mt-3 h-3 w-3/4 rounded-full skeleton`
- `mt-2 h-3 w-2/3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3/4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:80`

```jsx
          <div className="h-3 w-1/3 rounded-full skeleton" />
          <div className="mt-3 h-3 w-3/4 rounded-full skeleton" />
          <div className="mt-2 h-3 w-2/3 rounded-full skeleton" />
          <div className="mt-4 grid grid-cols-2 gap-2">
```
**Raw class strings detected (best effort):**

- `h-3 w-1/3 rounded-full skeleton`
- `mt-3 h-3 w-3/4 rounded-full skeleton`
- `mt-2 h-3 w-2/3 rounded-full skeleton`
- `mt-4 grid grid-cols-2 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3/4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:81`

```jsx
          <div className="mt-3 h-3 w-3/4 rounded-full skeleton" />
          <div className="mt-2 h-3 w-2/3 rounded-full skeleton" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `mt-3 h-3 w-3/4 rounded-full skeleton`
- `mt-2 h-3 w-2/3 rounded-full skeleton`
- `mt-4 grid grid-cols-2 gap-2`
- `h-3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3/4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:82`

```jsx
          <div className="mt-2 h-3 w-2/3 rounded-full skeleton" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `mt-2 h-3 w-2/3 rounded-full skeleton`
- `mt-4 grid grid-cols-2 gap-2`
- `h-3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:83`

```jsx
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-2 gap-2`
- `h-3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:84`

```jsx
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
```
**Raw class strings detected (best effort):**

- `h-3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:85`

```jsx
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
          </div>
```
**Raw class strings detected (best effort):**

- `h-3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:86`

```jsx
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
          </div>
        </div>
```
**Raw class strings detected (best effort):**

- `h-3 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:87`

```jsx
            <div className="h-3 rounded-full skeleton" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
```
**Raw class strings detected (best effort):**

- `h-3 rounded-full skeleton`
- `flex flex-col gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:90`

```jsx
        <div className="flex flex-col gap-2">
          <div className="h-9 w-28 rounded-full skeleton" />
          <div className="h-9 w-28 rounded-full skeleton" />
        </div>
```
**Raw class strings detected (best effort):**

- `flex flex-col gap-2`
- `h-9 w-28 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:91`

```jsx
          <div className="h-9 w-28 rounded-full skeleton" />
          <div className="h-9 w-28 rounded-full skeleton" />
        </div>
      </div>
```
**Raw class strings detected (best effort):**

- `h-9 w-28 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:92`

```jsx
          <div className="h-9 w-28 rounded-full skeleton" />
        </div>
      </div>
      <span className="sr-only">Loading result {index + 1}</span>
```
**Raw class strings detected (best effort):**

- `h-9 w-28 rounded-full skeleton`
- `sr-only`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `sr-only` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:95`

```jsx
      <span className="sr-only">Loading result {index + 1}</span>
    </div>
  )
}
```
**Raw class strings detected (best effort):**

- `sr-only`

**Utility breakdown (grouped):**

- **Other:**
  - `sr-only` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:249`

```jsx
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md dark:bg-slate-950/40 dark:ring-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out`
- `max-w-7xl mx-auto px-4 py-6`
- `rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md dark:bg-slate-950/40 dark:ring-white/10`
- `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-6` — Vertical padding (top/bottom).
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-950/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:250`

```jsx
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md dark:bg-slate-950/40 dark:ring-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
```
**Raw class strings detected (best effort):**

- `max-w-7xl mx-auto px-4 py-6`
- `rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md dark:bg-slate-950/40 dark:ring-white/10`
- `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-6` — Vertical padding (top/bottom).
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:251`

```jsx
        <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md dark:bg-slate-950/40 dark:ring-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center">
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md dark:bg-slate-950/40 dark:ring-white/10`
- `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- `flex items-center gap-2`
- `h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:252`

```jsx
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center">
                <SearchIcon size={18} />
```
**Raw class strings detected (best effort):**

- `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- `flex items-center gap-2`
- `h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:253`

```jsx
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center">
                <SearchIcon size={18} />
              </div>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/SearchResults.jsx:254`

```jsx
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center">
                <SearchIcon size={18} />
              </div>
              <div>
```
**Raw class strings detected (best effort):**

- `h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/SearchResults.jsx:258`

```jsx
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Search</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
              </div>
            </div>
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `text-[11px] text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:259`

```jsx
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
              </div>
            </div>

```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:263`

```jsx
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
```
**Raw class strings detected (best effort):**

- `flex gap-2`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:267`

```jsx
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
                <Filter size={16} />
                Filters
```
**Raw class strings detected (best effort):**

- `inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:275`

```jsx
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
              >
                <Bell size={16} />
                Save alert
```
**Raw class strings detected (best effort):**

- `inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-indigo-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-indigo-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-950` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:282`

```jsx
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
                Alerts
              </Link>
```
**Raw class strings detected (best effort):**

- `inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:289`

```jsx
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <input
                ref={queryInputRef}
```
**Raw class strings detected (best effort):**

- `mt-4 flex flex-col gap-2 sm:flex-row`
- `relative flex-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:290`

```jsx
            <div className="relative flex-1">
              <input
                ref={queryInputRef}
                value={query}
```
**Raw class strings detected (best effort):**

- `relative flex-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.

#### `src/pages/SearchResults.jsx:296`

```jsx
                className="w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                {isMac ? '⌘ K' : 'Ctrl K'}
```
**Raw class strings detected (best effort):**

- `w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10`
- `⌘ K`
- `Ctrl K`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `pr-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-widest` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100/70` — Background color/surface.
  - `bg-white/70` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-inner` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-indigo-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-950/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-translate-y-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `⌘` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `K` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Ctrl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:298`

```jsx
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                {isMac ? '⌘ K' : 'Ctrl K'}
              </span>
            </div>
```
**Raw class strings detected (best effort):**

- `pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10`
- `⌘ K`
- `Ctrl K`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-widest` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-950/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-translate-y-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `⌘` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `K` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Ctrl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:305`

```jsx
              className="rounded-full bg-white px-4 py-3 text-sm text-slate-800 ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
            >
              <option value="">All categories</option>
              <option value="Shirts">Shirts</option>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-4 py-3 text-sm text-slate-800 ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `Shirts`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-indigo-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Shirts` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:317`

```jsx
              className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Search'}
```
**Raw class strings detected (best effort):**

- `rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950`
- `Searching…`
- `Search`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-indigo-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-indigo-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-950` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Searching…` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Search` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:325`

```jsx
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`rounded-2xl p-4 ring-1 shadow-sm ${premiumLocked ? 'bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : 'bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`}>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Advanced filters</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{premiumLocked ? 'Locked on Free plan' : 'Available'}</p>
```
**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-1 md:grid-cols-2 gap-3`
- `bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30`
- `bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10`
- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `text-[11px] text-slate-500 dark:text-slate-400 mt-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `ring-amber-200` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-amber-500/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-900/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:326`

```jsx
              <div className={`rounded-2xl p-4 ring-1 shadow-sm ${premiumLocked ? 'bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : 'bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`}>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Advanced filters</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{premiumLocked ? 'Locked on Free plan' : 'Available'}</p>

```
**Raw class strings detected (best effort):**

- `bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30`
- `bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10`
- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `text-[11px] text-slate-500 dark:text-slate-400 mt-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `ring-amber-200` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-amber-500/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-900/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:327`

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Advanced filters</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{premiumLocked ? 'Locked on Free plan' : 'Available'}</p>

                <div className="mt-3 grid grid-cols-1 gap-2">
```
**Raw class strings detected (best effort):**

- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `text-[11px] text-slate-500 dark:text-slate-400 mt-1`
- `mt-3 grid grid-cols-1 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:328`

```jsx
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{premiumLocked ? 'Locked on Free plan' : 'Available'}</p>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <select
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400 mt-1`
- `mt-3 grid grid-cols-1 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:330`

```jsx
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <select
                    value={filters.moqRange}
                    onChange={(e) => updateAdvancedFilter('moqRange', e.target.value)}
```
**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-1 gap-2`
- `moqRange`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `moqRange` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:334`

```jsx
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">{`MOQ: ${formatMoqRangeLabel('Any')}`}</option>
                    <option value="0-100">MOQ: 0 - 100</option>
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `>{`MOQ: ${formatMoqRangeLabel(`
- `0-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-indigo-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `>{`MOQ:` — Variant prefix (responsive, dark, or interaction state).
  - `${formatMoqRangeLabel(` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `0-100` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:347`

```jsx
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  />

                  <select
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-indigo-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:353`

```jsx
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">Organization type (Any)</option>
                    <option value="buyer">Buyer</option>
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `buyer`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-indigo-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:361`

```jsx
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200`
- `checkbox`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `checkbox` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:366`

```jsx
                      className="h-4 w-4"
                    />
                    Verified only
                  </label>
```
**Raw class strings detected (best effort):**

- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:373`

```jsx
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10`
- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-900/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:374`

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">{upgradePrompt}</p> : null}
```
**Raw class strings detected (best effort):**

- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300`
- `text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `border-amber-200` — Border style/width/color.
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:375`

```jsx
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-2">{alertFeedback}</p> : null}
```
**Raw class strings detected (best effort):**

- `mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300`
- `text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2`
- `text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
  - `text-sky-800` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-amber-50` — Background color/surface.
  - `bg-sky-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `border-amber-200` — Border style/width/color.
  - `rounded-xl` — Corner radius.
  - `border-sky-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:377`

```jsx
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-2">{alertFeedback}</p> : null}
                </div>
              </div>
```
**Raw class strings detected (best effort):**

- `text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2`
- `text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-amber-800` — Text color or text sizing.
  - `text-sky-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `bg-sky-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `border-amber-200` — Border style/width/color.
  - `rounded-xl` — Corner radius.
  - `border-sky-200` — Border style/width/color.

#### `src/pages/SearchResults.jsx:378`

```jsx
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-2">{alertFeedback}</p> : null}
                </div>
              </div>
            </div>
```
**Raw class strings detected (best effort):**

- `text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-sky-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-sky-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `border-sky-200` — Border style/width/color.
  - `rounded-xl` — Corner radius.

#### `src/pages/SearchResults.jsx:385`

```jsx
        <div className="mt-5 grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10">
          <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
            {TAB_OPTIONS.map((t) => {
```
**Raw class strings detected (best effort):**

- `mt-5 grid grid-cols-12 gap-4`
- `col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10`
- `relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-12` — Grid layout.
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-white/40` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `border-b` — Border style/width/color.
  - `border-slate-200/60` — Border style/width/color.
- **Responsive variants:**
  - `xl:col-span-9` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-950/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:386`

```jsx
          <div className="col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10">
          <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
            {TAB_OPTIONS.map((t) => {
              const Icon = t.icon
```
**Raw class strings detected (best effort):**

- `col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10`
- `relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-white/40` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `border-b` — Border style/width/color.
  - `border-slate-200/60` — Border style/width/color.
- **Responsive variants:**
  - `xl:col-span-9` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-950/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:387`

```jsx
          <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
            {TAB_OPTIONS.map((t) => {
              const Icon = t.icon
              const active = activeTab === t.id
```
**Raw class strings detected (best effort):**

- `relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-transparent dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`

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
  - `bg-white/40` — Background color/surface.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200/60` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-950/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:398`

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

#### `src/pages/SearchResults.jsx:407`

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

#### `src/pages/SearchResults.jsx:411`

```jsx
                  <span className="relative inline-flex items-center gap-2">
                    <Icon size={16} />
                    <span>{t.label}</span>
                    <span className="text-[11px] opacity-70">({count})</span>
```
**Raw class strings detected (best effort):**

- `relative inline-flex items-center gap-2`
- `text-[11px] opacity-70`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `opacity-70` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:414`

```jsx
                    <span className="text-[11px] opacity-70">({count})</span>
                  </span>
                </motion.button>
              )
```
**Raw class strings detected (best effort):**

- `text-[11px] opacity-70`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `opacity-70` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:421`

```jsx
          <div className="p-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
```
**Raw class strings detected (best effort):**

- `p-4`
- `space-y-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:423`

```jsx
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ResultSkeletonCard key={`result-skel-${i}`} index={i} />
                ))}
```
**Raw class strings detected (best effort):**

- `space-y-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:431`

```jsx
              <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 text-center ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30">
                {error}
              </div>
            ) : null}
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 text-center ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-rose-800` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
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

#### `src/pages/SearchResults.jsx:437`

```jsx
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-700 text-center ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                No results found. Try a different query or category.
              </div>
            ) : null}
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-slate-50 p-6 text-sm text-slate-700 text-center ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:443`

```jsx
              <div className="space-y-4">
                {(activeTab === 'all' || activeTab === 'requests') ? (
                  <div className="space-y-3">
                    {requests.map((r, idx) => {
```
**Raw class strings detected (best effort):**

- `space-y-4`
- `all`
- `requests`
- `space-y-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `requests` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:445`

```jsx
                  <div className="space-y-3">
                    {requests.map((r, idx) => {
                      const author = r.author || {}
                      const profileRoute = roleToProfileRoute(author.role, author.id)
```
**Raw class strings detected (best effort):**

- `space-y-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:455`

```jsx
                          className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-start justify-between gap-3`
- `min-w-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:-translate-y-0.5` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-md` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:457`

```jsx
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-3`
- `min-w-0`
- `flex items-center gap-2`
- `font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:458`

```jsx
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || 'Buyer'}
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `flex items-center gap-2`
- `font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate`
- `Buyer`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:459`

```jsx
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || 'Buyer'}
                                </Link>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate`
- `Buyer`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:460`

```jsx
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || 'Buyer'}
                                </Link>
                                {author.verified ? (
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate`
- `Buyer`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:464`

```jsx
                                  <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                                    Verified
                                  </span>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-r` — Background color/surface.
  - `from-emerald-500/15` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-teal-500/15` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[11px]` — Text color or text sizing.
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

#### `src/pages/SearchResults.jsx:468`

```jsx
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">• {author.country}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{r.custom_description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400`
- `mt-2 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap`
- `mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:470`

```jsx
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{r.custom_description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.category || '-'}</span></div>
                                <div>Quantity/MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.quantity || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap`
- `mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300`
- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:471`

```jsx
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.category || '-'}</span></div>
                                <div>Quantity/MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.quantity || '-'}</span></div>
                                <div>Timeline: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.timeline_days || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300`
- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:472`

```jsx
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.category || '-'}</span></div>
                                <div>Quantity/MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.quantity || '-'}</span></div>
                                <div>Timeline: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.timeline_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.material || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:473`

```jsx
                                <div>Quantity/MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.quantity || '-'}</span></div>
                                <div>Timeline: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.timeline_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.material || '-'}</span></div>
                              </div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:474`

```jsx
                                <div>Timeline: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.timeline_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.material || '-'}</span></div>
                              </div>
                            </div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:475`

```jsx
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.material || '-'}</span></div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800 dark:text-slate-100`
- `flex flex-col gap-2 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:478`

```jsx
                            <div className="flex flex-col gap-2 shrink-0">
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                Open profile
                              </Link>
```
**Raw class strings detected (best effort):**

- `flex flex-col gap-2 shrink-0`
- `rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

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
  - `text-slate-700` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
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
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:479`

```jsx
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                Open profile
                              </Link>
                              <button
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
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

#### `src/pages/SearchResults.jsx:485`

```jsx
                                className="rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
                              >
                                Contact
                              </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-indigo-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-indigo-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-950` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:498`

```jsx
                  <div className="space-y-3">
                    {companies.map((p, idx) => {
                      const author = p.author || {}
                      const profileRoute = roleToProfileRoute(author.role, author.id)
```
**Raw class strings detected (best effort):**

- `space-y-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:509`

```jsx
                          className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-start justify-between gap-3`
- `min-w-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:-translate-y-0.5` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-md` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:511`

```jsx
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-3`
- `min-w-0`
- `flex items-center gap-2`
- `font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:512`

```jsx
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || p.title || 'Company'}
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `flex items-center gap-2`
- `font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate`
- `Company`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Company` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:513`

```jsx
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || p.title || 'Company'}
                                </Link>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate`
- `Company`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Company` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:514`

```jsx
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || p.title || 'Company'}
                                </Link>
                                {author.verified ? (
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate`
- `Company`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Company` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:518`

```jsx
                                  <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                                    Verified
                                  </span>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-r` — Background color/surface.
  - `from-emerald-500/15` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-teal-500/15` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[11px]` — Text color or text sizing.
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

#### `src/pages/SearchResults.jsx:522`

```jsx
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">• {author.country}</span> : null}
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">• {String(author.role).replaceAll('_', ' ')}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400`
- `text-[11px] text-slate-500 dark:text-slate-400 uppercase`
- `mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:523`

```jsx
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">• {String(author.role).replaceAll('_', ' ')}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{p.description || ''}</p>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400 uppercase`
- `mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold`
- `mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:525`

```jsx
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{p.description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.category || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold`
- `mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2`
- `mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300`
- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:526`

```jsx
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{p.description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.category || '-'}</span></div>
                                <div>MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.moq || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2`
- `mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300`
- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:527`

```jsx
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.category || '-'}</span></div>
                                <div>MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.moq || '-'}</span></div>
                                <div>Lead time: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.lead_time_days || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300`
- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:528`

```jsx
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.category || '-'}</span></div>
                                <div>MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.moq || '-'}</span></div>
                                <div>Lead time: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.lead_time_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.material || '-'}</span></div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:529`

```jsx
                                <div>MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.moq || '-'}</span></div>
                                <div>Lead time: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.lead_time_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.material || '-'}</span></div>
                              </div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:530`

```jsx
                                <div>Lead time: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.lead_time_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.material || '-'}</span></div>
                              </div>

```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:531`

```jsx
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.material || '-'}</span></div>
                              </div>

                              <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800 dark:text-slate-100`
- `mt-3 text-xs text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:534`

```jsx
                              <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                                Rating: <span className="font-semibold text-slate-800 dark:text-slate-100">{rating?.average_score ?? '0.0'}</span> ({rating?.total_count ?? 0}) • Confidence {Math.round((rating?.score_confidence ?? 0) * 100)}%
                              </div>
                              {p.hasVideo ? <div className="mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-200">Video available</div> : null}
```
**Raw class strings detected (best effort):**

- `mt-3 text-xs text-slate-600 dark:text-slate-300`
- `font-semibold text-slate-800 dark:text-slate-100`
- `mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-200`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `text-indigo-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:535`

```jsx
                                Rating: <span className="font-semibold text-slate-800 dark:text-slate-100">{rating?.average_score ?? '0.0'}</span> ({rating?.total_count ?? 0}) • Confidence {Math.round((rating?.score_confidence ?? 0) * 100)}%
                              </div>
                              {p.hasVideo ? <div className="mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-200">Video available</div> : null}
                            </div>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-800 dark:text-slate-100`
- `mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-200`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-indigo-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:537`

```jsx
                              {p.hasVideo ? <div className="mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-200">Video available</div> : null}
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-200`
- `flex flex-col gap-2 shrink-0`
- `rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:539`

```jsx
                            <div className="flex flex-col gap-2 shrink-0">
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                View profile
                              </Link>
```
**Raw class strings detected (best effort):**

- `flex flex-col gap-2 shrink-0`
- `rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

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
  - `text-slate-700` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
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
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:540`

```jsx
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                View profile
                              </Link>
                              <button
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
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

#### `src/pages/SearchResults.jsx:546`

```jsx
                                className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
                              >
                                Quick view
                              </button>
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

#### `src/pages/SearchResults.jsx:553`

```jsx
                                className="rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
                              >
                                Contact
                              </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-indigo-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-indigo-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-950` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:569`

```jsx
          <aside className="col-span-12 xl:col-span-3 space-y-4">
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you • Recorded on Quick View</p>
```
**Raw class strings detected (best effort):**

- `col-span-12 xl:col-span-3 space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-[11px] text-slate-500 dark:text-slate-400`

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
  - `xl:col-span-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:570`

```jsx
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you • Recorded on Quick View</p>
              <div className="mt-3 space-y-2">
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-[11px] text-slate-500 dark:text-slate-400`
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
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:571`

```jsx
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you • Recorded on Quick View</p>
              <div className="mt-3 space-y-2">
                {recentViews.length ? recentViews.map((row) => (
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-[11px] text-slate-500 dark:text-slate-400`
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
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:572`

```jsx
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you • Recorded on Quick View</p>
              <div className="mt-3 space-y-2">
                {recentViews.length ? recentViews.map((row) => (
                  <button
```
**Raw class strings detected (best effort):**

- `mt-1 text-[11px] text-slate-500 dark:text-slate-400`
- `mt-3 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:573`

```jsx
              <div className="mt-3 space-y-2">
                {recentViews.length ? recentViews.map((row) => (
                  <button
                    key={row.id}
```
**Raw class strings detected (best effort):**

- `mt-3 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:579`

```jsx
                    className="w-full text-left rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-[0.99] dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
                    title="Open Quick View"
                  >
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.product?.title || 'Product'}</p>
```
**Raw class strings detected (best effort):**

- `w-full text-left rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-[0.99] dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8`
- `Open Quick View`
- `text-xs font-semibold text-slate-900 dark:text-slate-100 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-left` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.99]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Open` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Quick` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `View` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:582`

```jsx
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.product?.title || 'Product'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} • {new Date(row.viewed_at).toLocaleString()}</p>
                  </button>
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

#### `src/pages/SearchResults.jsx:583`

```jsx
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} • {new Date(row.viewed_at).toLocaleString()}</p>
                  </button>
                )) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400">No views yet. Use “Quick view” on a product.</div>
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

#### `src/pages/SearchResults.jsx:586`

```jsx
                  <div className="text-xs text-slate-500 dark:text-slate-400">No views yet. Use “Quick view” on a product.</div>
                )}
              </div>
              <div className="mt-3">
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500 dark:text-slate-400`
- `mt-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:589`

```jsx
              <div className="mt-3">
                <Link to="/notifications" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300">Open full history</Link>
              </div>
            </div>
```
**Raw class strings detected (best effort):**

- `mt-3`
- `text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-600` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-indigo-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:590`

```jsx
                <Link to="/notifications" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300">Open full history</Link>
              </div>
            </div>

```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-600` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-indigo-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:595`

```jsx
              <div className="rounded-2xl p-4 ring-1 ring-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:ring-amber-500/30">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Premium filters</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">Upgrade to use advanced filters like country, MOQ range, verified-only, and org type.</p>
              </div>
```
**Raw class strings detected (best effort):**

- `rounded-2xl p-4 ring-1 ring-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:ring-amber-500/30`
- `text-sm font-bold text-amber-900 dark:text-amber-200`
- `mt-1 text-xs text-amber-800 dark:text-amber-200/90`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-amber-200` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-amber-500/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200/90` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:596`

```jsx
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Premium filters</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">Upgrade to use advanced filters like country, MOQ range, verified-only, and org type.</p>
              </div>
            ) : null}
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-amber-900 dark:text-amber-200`
- `mt-1 text-xs text-amber-800 dark:text-amber-200/90`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200/90` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:597`

```jsx
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">Upgrade to use advanced filters like country, MOQ range, verified-only, and org type.</p>
              </div>
            ) : null}
          </aside>
```
**Raw class strings detected (best effort):**

- `mt-1 text-xs text-amber-800 dark:text-amber-200/90`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-amber-200/90` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/SearchResults.jsx:95` — Loading result {index + 1}

```jsx
      <span className="sr-only">Loading result {index + 1}</span>
    </div>
  )
}
```
- `src/pages/SearchResults.jsx:258` — Search

```jsx
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Search</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
              </div>
            </div>
```
- `src/pages/SearchResults.jsx:259` — Garments & Textile marketplace

```jsx
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
              </div>
            </div>

```
- `src/pages/SearchResults.jsx:327` — Advanced filters

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Advanced filters</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{premiumLocked ? 'Locked on Free plan' : 'Available'}</p>

                <div className="mt-3 grid grid-cols-1 gap-2">
```
- `src/pages/SearchResults.jsx:374` — Status

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">{upgradePrompt}</p> : null}
```
- `src/pages/SearchResults.jsx:376` — Run a search to see quota status.

```jsx
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-2">{alertFeedback}</p> : null}
                </div>
```
- `src/pages/SearchResults.jsx:414` — ({count})

```jsx
                    <span className="text-[11px] opacity-70">({count})</span>
                  </span>
                </motion.button>
              )
```
- `src/pages/SearchResults.jsx:468` — • {author.country}

```jsx
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">• {author.country}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{r.custom_description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
```
- `src/pages/SearchResults.jsx:522` — • {author.country}

```jsx
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">• {author.country}</span> : null}
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">• {String(author.role).replaceAll('_', ' ')}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
```
- `src/pages/SearchResults.jsx:523` — • {String(author.role).replaceAll('_', ' ')}

```jsx
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">• {String(author.role).replaceAll('_', ' ')}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{p.description || ''}</p>
```
- `src/pages/SearchResults.jsx:571` — Recently viewed

```jsx
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you • Recorded on Quick View</p>
              <div className="mt-3 space-y-2">
                {recentViews.length ? recentViews.map((row) => (
```
- `src/pages/SearchResults.jsx:572` — Private to you • Recorded on Quick View

```jsx
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you • Recorded on Quick View</p>
              <div className="mt-3 space-y-2">
                {recentViews.length ? recentViews.map((row) => (
                  <button
```
- `src/pages/SearchResults.jsx:590` — Open full history

```jsx
                <Link to="/notifications" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300">Open full history</Link>
              </div>
            </div>

```
- `src/pages/SearchResults.jsx:596` — Premium filters

```jsx
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Premium filters</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">Upgrade to use advanced filters like country, MOQ range, verified-only, and org type.</p>
              </div>
            ) : null}
```
- `src/pages/SearchResults.jsx:597` — Upgrade to use advanced filters like country, MOQ range, verified-only, and org type.

```jsx
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">Upgrade to use advanced filters like country, MOQ range, verified-only, and org type.</p>
              </div>
            ) : null}
          </aside>
```
- `src/pages/SearchResults.jsx:295` — Search requests, factories, products…

```jsx
                placeholder="Search requests, factories, products…"
                className="w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
```
- `src/pages/SearchResults.jsx:346` — Country (e.g. Bangladesh)

```jsx
                    placeholder="Country (e.g. Bangladesh)"
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  />

```
- `src/pages/SearchResults.jsx:580` — Open Quick View

```jsx
                    title="Open Quick View"
                  >
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.product?.title || 'Product'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} • {new Date(row.viewed_at).toLocaleString()}</p>
```
- `src/pages/SearchResults.jsx:264` — (element) <button>

```jsx
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
```
- `src/pages/SearchResults.jsx:272` — (element) <button>

```jsx
              <button
                type="button"
                onClick={saveAlert}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
```
- `src/pages/SearchResults.jsx:280` — (element) <Link>

```jsx
              <Link
                to="/notifications"
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
```
- `src/pages/SearchResults.jsx:314` — (element) <button>

```jsx
            <button
              type="button"
              onClick={runSearch}
              className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
```
- `src/pages/SearchResults.jsx:460` — (element) <Link>

```jsx
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || 'Buyer'}
                                </Link>
                                {author.verified ? (
```
- `src/pages/SearchResults.jsx:479` — (element) <Link>

```jsx
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                Open profile
                              </Link>
                              <button
```
- `src/pages/SearchResults.jsx:482` — (element) <button>

```jsx
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'buyer')}
                                className="rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
```
- `src/pages/SearchResults.jsx:514` — (element) <Link>

```jsx
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || p.title || 'Company'}
                                </Link>
                                {author.verified ? (
```
- `src/pages/SearchResults.jsx:540` — (element) <Link>

```jsx
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                View profile
                              </Link>
                              <button
```
- `src/pages/SearchResults.jsx:543` — (element) <button>

```jsx
                              <button
                                type="button"
                                onClick={() => setQuickViewItem({ ...p, author })}
                                className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
```
- `src/pages/SearchResults.jsx:550` — (element) <button>

```jsx
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'company')}
                                className="rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
```
- `src/pages/SearchResults.jsx:575` — (element) <button>

```jsx
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setQuickViewItem({ ...row.product, author: row.author })}
```
- `src/pages/SearchResults.jsx:590` — (element) <Link>

```jsx
                <Link to="/notifications" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300">Open full history</Link>
              </div>
            </div>

```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /requirements/search?${qs} (src/pages/SearchResults.jsx:164) | /api/requirements -> server/routes/requirementRoutes.js:61 | - | - | - |
| GET /products/search?${qs} (src/pages/SearchResults.jsx:165) | /api/products -> server/routes/productRoutes.js:67 | - | - | - |
| GET /products/views/me?cursor=0&limit=5 (src/pages/SearchResults.jsx:194) | /api/products -> server/routes/productRoutes.js:67 | - | - | - |
| GET /ratings/search?profile_keys=${encodeURIComponent(keys.join( (src/pages/SearchResults.jsx:208) | /api/ratings -> server/routes/ratingsRoutes.js:81 | - | - | - |
| POST /search/alerts (src/pages/SearchResults.jsx:233) | /api/search -> server/routes/searchRoutes.js:76 | POST /alerts (server/routes/searchRoutes.js:7) | server/controllers/notificationController.js | createSearchAlert |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/SearchResults.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
{% endraw %}
