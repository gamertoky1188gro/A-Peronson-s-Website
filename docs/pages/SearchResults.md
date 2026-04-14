# SearchResults - Route `/search`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/SearchResults.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/SearchResults.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_SearchResults.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/SearchResults.jsx:34)
- ../components/products/ProductQuickViewModal (src/pages/SearchResults.jsx:35)
- ../lib/events (src/pages/SearchResults.jsx:36)
- ../lib/leadSource (src/pages/SearchResults.jsx:37)
- ./searchFiltersConfig (src/pages/SearchResults.jsx:39)

### 2.2 Structural section tags in JSX

- `aside` at `src/pages/SearchResults.jsx:2710`

```jsx
          <aside className="col-span-12 xl:col-span-3 space-y-4">
            {isBuyer ? (
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Early verified factories</p>
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

#### `src/pages/SearchResults.jsx:306`

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

#### `src/pages/SearchResults.jsx:307`

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

#### `src/pages/SearchResults.jsx:308`

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

#### `src/pages/SearchResults.jsx:309`

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

#### `src/pages/SearchResults.jsx:310`

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

#### `src/pages/SearchResults.jsx:311`

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

#### `src/pages/SearchResults.jsx:312`

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

#### `src/pages/SearchResults.jsx:313`

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

#### `src/pages/SearchResults.jsx:314`

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

#### `src/pages/SearchResults.jsx:315`

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

#### `src/pages/SearchResults.jsx:316`

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

#### `src/pages/SearchResults.jsx:319`

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

#### `src/pages/SearchResults.jsx:320`

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

#### `src/pages/SearchResults.jsx:321`

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

#### `src/pages/SearchResults.jsx:324`

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

#### `src/pages/SearchResults.jsx:331`

```jsx
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = values.includes(option)
        const count = getFacetCount(counts, option)
```
**Raw class strings detected (best effort):**

- `flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:345`

```jsx
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${
              selected
                ? ' bg-[var(--gt-blue)] text-white ring-transparent dark:bg-[var(--gt-blue)] dark:text-white'
                : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10'
```
**Raw class strings detected (best effort):**

- ` bg-[var(--gt-blue)] text-white ring-transparent dark:bg-[var(--gt-blue)] dark:text-white`
- ` bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-transparent` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[var(--gt-blue)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:353`

```jsx
              <span className={`ml-1 text-[10px] ${selected ? 'text-white/80' : 'text-slate-400'}`}>({count})</span>
            ) : null}
          </button>
        )
```
**Raw class strings detected (best effort):**

- `text-white/80`
- `text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white/80` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:365`

```jsx
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const optValue = String(option?.value ?? '')
        const selected = selectedValue === optValue || (!selectedValue && !optValue)
```
**Raw class strings detected (best effort):**

- `flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:379`

```jsx
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${
              selected
                ? ' bg-[var(--gt-blue)] text-white ring-transparent dark:bg-[var(--gt-blue)] dark:text-white'
                : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10'
```
**Raw class strings detected (best effort):**

- ` bg-[var(--gt-blue)] text-white ring-transparent dark:bg-[var(--gt-blue)] dark:text-white`
- ` bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-transparent` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[var(--gt-blue)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:400`

```jsx
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span>{Number.isFinite(minValue) ? format(minValue) : format(min)}</span>
        <div className="h-px flex-1 bg-slate-200" />
```
**Raw class strings detected (best effort):**

- `space-y-2`
- `flex items-center gap-2 text-[11px] text-slate-500`
- `h-px flex-1 bg-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-px` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-200` — Background color/surface.

#### `src/pages/SearchResults.jsx:401`

```jsx
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span>{Number.isFinite(minValue) ? format(minValue) : format(min)}</span>
        <div className="h-px flex-1 bg-slate-200" />
        <span>{Number.isFinite(maxValue) ? format(maxValue) : format(max)}</span>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2 text-[11px] text-slate-500`
- `h-px flex-1 bg-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-px` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-200` — Background color/surface.

#### `src/pages/SearchResults.jsx:403`

```jsx
        <div className="h-px flex-1 bg-slate-200" />
        <span>{Number.isFinite(maxValue) ? format(maxValue) : format(max)}</span>
      </div>
      <div className="flex items-center gap-3">
```
**Raw class strings detected (best effort):**

- `h-px flex-1 bg-slate-200`
- `flex items-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-px` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-200` — Background color/surface.

#### `src/pages/SearchResults.jsx:406`

```jsx
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `range`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `range` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:415`

```jsx
          className="w-full"
        />
        <input
          type="range"
```
**Raw class strings detected (best effort):**

- `w-full`
- `range`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `range` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:425`

```jsx
          className="w-full"
        />
      </div>
    </div>
```
**Raw class strings detected (best effort):**

- `w-full`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1480`

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

#### `src/pages/SearchResults.jsx:1481`

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

#### `src/pages/SearchResults.jsx:1482`

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

#### `src/pages/SearchResults.jsx:1483`

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

#### `src/pages/SearchResults.jsx:1484`

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

#### `src/pages/SearchResults.jsx:1485`

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

#### `src/pages/SearchResults.jsx:1489`

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

#### `src/pages/SearchResults.jsx:1490`

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

#### `src/pages/SearchResults.jsx:1494`

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

#### `src/pages/SearchResults.jsx:1498`

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

#### `src/pages/SearchResults.jsx:1506`

```jsx
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gt-blue)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
              >
                <Bell size={16} />
                Save search
```
**Raw class strings detected (best effort):**

- `inline-flex items-center gap-2 rounded-full bg-[var(--gt-blue)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95`

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
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1514`

```jsx
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
                <Share2 size={16} />
                Share
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

#### `src/pages/SearchResults.jsx:1521`

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

#### `src/pages/SearchResults.jsx:1528`

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

#### `src/pages/SearchResults.jsx:1529`

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

#### `src/pages/SearchResults.jsx:1535`

```jsx
                className="w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                {isMac ? 'Cmd K' : 'Ctrl K'}
```
**Raw class strings detected (best effort):**

- `w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10`
- `Cmd K`
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
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-950/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-translate-y-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Cmd` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `K` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Ctrl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1537`

```jsx
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                {isMac ? 'Cmd K' : 'Ctrl K'}
              </span>
            </div>
```
**Raw class strings detected (best effort):**

- `pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10`
- `Cmd K`
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
  - `Cmd` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `K` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Ctrl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1544`

```jsx
              className="rounded-full bg-[var(--gt-blue)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95 disabled:opacity-60`
- `Searching...`
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
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Searching...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Search` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1551`

```jsx
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={clearCategories}
```
**Raw class strings detected (best effort):**

- `mt-3 flex flex-wrap items-center gap-2`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1555`

```jsx
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${category.length ? ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50' : ' bg-[var(--gt-blue)] text-white ring-transparent'}`}
            >
              All categories
            </button>
```
**Raw class strings detected (best effort):**

- ` bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50`
- ` bg-[var(--gt-blue)] text-white ring-transparent`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `ring-transparent` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1564`

```jsx
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${category.includes(option) ? ' bg-[var(--gt-blue)] text-white ring-transparent' : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50'}`}
              >
                {option}
                {Number.isFinite(Number(getFacetCount(facetCounts.category, option))) ? (
```
**Raw class strings detected (best effort):**

- ` bg-[var(--gt-blue)] text-white ring-transparent`
- ` bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-transparent` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1568`

```jsx
                  <span className={`ml-1 text-[10px] ${category.includes(option) ? 'text-white/80' : 'text-slate-400'}`}>
                    ({getFacetCount(facetCounts.category, option)})
                  </span>
                ) : null}
```
**Raw class strings detected (best effort):**

- `text-white/80`
- `text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white/80` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:1576`

```jsx
          <div className="sticky top-2 z-20 mt-3 rounded-xl bg-white/90 p-2 ring-1 ring-slate-200/70 backdrop-blur dark:bg-slate-950/70 dark:ring-white/10">
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.length ? activeFilterChips.map((chip) => (
                <button
```
**Raw class strings detected (best effort):**

- `sticky top-2 z-20 mt-3 rounded-xl bg-white/90 p-2 ring-1 ring-slate-200/70 backdrop-blur dark:bg-slate-950/70 dark:ring-white/10`
- `flex flex-wrap items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `sticky` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/90` — Background color/surface.
  - `backdrop-blur` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-950/70` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1577`

```jsx
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.length ? activeFilterChips.map((chip) => (
                <button
                  key={chip.key}
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1583`

```jsx
                  className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100"
                >
                  {chip.label} ×
                </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1587`

```jsx
              )) : <span className="text-[11px] text-slate-500 dark:text-slate-400">No active filters</span>}
              <button
                type="button"
                onClick={clearAllFilters}
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1591`

```jsx
                className="ml-auto rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 hover:bg-slate-50 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
              >
                Clear all
              </button>
```
**Raw class strings detected (best effort):**

- `ml-auto rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 hover:bg-slate-50 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5`

**Utility breakdown (grouped):**

- **Spacing:**
  - `ml-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1599`

```jsx
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              {estimateLoading ? 'Estimating results...' : estimateError ? (
                <span className="text-rose-600">{estimateError}</span>
              ) : (
```
**Raw class strings detected (best effort):**

- `mt-2 text-[11px] text-slate-500 dark:text-slate-400`
- `Estimating results...`
- `text-rose-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Estimating` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `results...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1601`

```jsx
                <span className="text-rose-600">{estimateError}</span>
              ) : (
                <>
                  {activeTab === 'requests'
```
**Raw class strings detected (best effort):**

- `text-rose-600`
- `requests`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-rose-600` — Text color or text sizing.
- **Other:**
  - `requests` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1615`

```jsx
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Product</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core filters are visible first</p>
```
**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10`
- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `text-[11px] text-slate-500 dark:text-slate-400 mt-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `lg:grid-cols-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1616`

```jsx
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Product</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core filters are visible first</p>
                <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10`
- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `text-[11px] text-slate-500 dark:text-slate-400 mt-1`
- `mt-3 grid grid-cols-1 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
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
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1617`

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Product</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core filters are visible first</p>
                <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
                  <select
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

#### `src/pages/SearchResults.jsx:1618`

```jsx
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core filters are visible first</p>
                <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
                  <select
                    value={filters.industry}
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

#### `src/pages/SearchResults.jsx:1619`

```jsx
                <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
                  <select
                    value={filters.industry}
                    onChange={(e) => updateCoreFilter('industry', e.target.value)}
```
**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-1 gap-2`
- `industry`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `industry` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1623`

```jsx
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">Industry (Any)</option>
                    {INDUSTRY_OPTIONS.map((option) => (
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

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
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1630`

```jsx
                  <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                    <p className="text-[11px] font-semibold text-slate-500">MOQ range</p>
                    <div className="mt-2">
                      <BucketChips
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1631`

```jsx
                    <p className="text-[11px] font-semibold text-slate-500">MOQ range</p>
                    <div className="mt-2">
                      <BucketChips
                        options={MOQ_BUCKETS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:1632`

```jsx
                    <div className="mt-2">
                      <BucketChips
                        options={MOQ_BUCKETS}
                        value={filters.moqRange}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1649`

```jsx
                    <div className="mt-3">
                      <RangeSlider
                        min={0}
                        max={5000}
```
**Raw class strings detected (best effort):**

- `mt-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1660`

```jsx
                  <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                    <p className="text-[11px] font-semibold text-slate-500">Price per unit</p>
                    <div className="mt-2 flex items-center gap-2">
                      <select
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1661`

```jsx
                    <p className="text-[11px] font-semibold text-slate-500">Price per unit</p>
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        value={filters.priceCurrency || ''}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:1662`

```jsx
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        value={filters.priceCurrency || ''}
                        onChange={(e) => updateCoreFilter('priceCurrency', e.target.value)}
```
**Raw class strings detected (best effort):**

- `mt-2 flex items-center gap-2`
- `priceCurrency`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `priceCurrency` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1666`

```jsx
                        className="w-28 rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                      >
                        <option value="">Currency</option>
                        {CURRENCY_OPTIONS.map((c) => (
```
**Raw class strings detected (best effort):**

- `w-28 rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1673`

```jsx
                      <div className="flex-1">
                        <RangeSlider
                          min={0}
                          max={200}
```
**Raw class strings detected (best effort):**

- `flex-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.

#### `src/pages/SearchResults.jsx:1687`

```jsx
                  <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                    <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
                    <div className="mt-2">
                      <ChipGroup
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1688`

```jsx
                    <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
                    <div className="mt-2">
                      <ChipGroup
                        options={INCOTERM_OPTIONS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:1689`

```jsx
                    <div className="mt-2">
                      <ChipGroup
                        options={INCOTERM_OPTIONS}
                        values={filters.incoterms || []}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1702`

```jsx
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                  >
                    {productMoreOpen ? 'Hide more filters' : 'More filters'}
                  </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `Hide more filters`
- `More filters`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Hide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `more` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `filters` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `More` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1712`

```jsx
                        className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                      />
                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <input
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1714`

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

#### `src/pages/SearchResults.jsx:1719`

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

#### `src/pages/SearchResults.jsx:1728`

```jsx
              <div className={`rounded-2xl p-4 ring-1 shadow-sm${premiumLocked ? ' bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : ' bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`} data-has-advanced-url-filters={hasAdvancedFiltersFromUrl ? 'true' : 'false'}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Supplier / Account</p>
```
**Raw class strings detected (best effort):**

- ` bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30`
- ` bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10`
- `true`
- `false`
- `flex items-center justify-between gap-2`
- `text-xs font-bold text-slate-700 dark:text-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-amber-200` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-amber-500/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-900/40` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `true` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `false` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1729`

```jsx
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Supplier / Account</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core visible first, attributes under More filters</p>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-2`
- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `text-[11px] text-slate-500 dark:text-slate-400 mt-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/SearchResults.jsx:1731`

```jsx
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Supplier / Account</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core visible first, attributes under More filters</p>
                  </div>
                  <button
```
**Raw class strings detected (best effort):**

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
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1732`

```jsx
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core visible first, attributes under More filters</p>
                  </div>
                  <button
                    type="button"
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400 mt-1`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1737`

```jsx
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                  >
                    {supplierMoreOpen ? 'Hide more filters' : 'More filters'}
                  </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `Hide more filters`
- `More filters`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Hide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `more` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `filters` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `More` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1744`

```jsx
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                  >
                    {advancedFiltersOpen ? 'Hide advanced' : 'Advanced'}
                  </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `Hide advanced`
- `Advanced`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Hide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `advanced` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Advanced` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1750`

```jsx
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                    <p className="text-[11px] font-semibold text-slate-500">Account type</p>
                    <div className="mt-2 flex flex-wrap gap-2">
```
**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-1 gap-2`
- `rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1751`

```jsx
                  <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                    <p className="text-[11px] font-semibold text-slate-500">Account type</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['', 'buyer', 'factory', 'buying_house'].map((value) => {
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex flex-wrap gap-2`
- `, `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `,` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1752`

```jsx
                    <p className="text-[11px] font-semibold text-slate-500">Account type</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['', 'buyer', 'factory', 'buying_house'].map((value) => {
                        const label = value === '' ? 'Any' : (value === 'buying_house' ? 'Buying House' : value.charAt(0).toUpperCase() + value.slice(1))
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex flex-wrap gap-2`
- `, `
- ` ? `
- ` : (value === `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `,` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `?` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `:` — Variant prefix (responsive, dark, or interaction state).
  - `(value` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `===` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1753`

```jsx
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['', 'buyer', 'factory', 'buying_house'].map((value) => {
                        const label = value === '' ? 'Any' : (value === 'buying_house' ? 'Buying House' : value.charAt(0).toUpperCase() + value.slice(1))
                        const active = filters.orgType === value
```
**Raw class strings detected (best effort):**

- `mt-2 flex flex-wrap gap-2`
- `, `
- ` ? `
- ` : (value === `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `,` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `?` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `:` — Variant prefix (responsive, dark, or interaction state).
  - `(value` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `===` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1762`

```jsx
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${active ? ' bg-[var(--gt-blue)] text-white ring-transparent' : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50'}`}
                          >
                            {label}
                          </button>
```
**Raw class strings detected (best effort):**

- ` bg-[var(--gt-blue)] text-white ring-transparent`
- ` bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-transparent` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1774`

```jsx
                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                    >
                      <option value="">Lead time (Any)</option>
                      <option value="7">Lead time &lt;= 7 days</option>
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `7`

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
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1787`

```jsx
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <input
                        type="checkbox"
```
**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-1 gap-2`
- `flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200`
- `checkbox`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `checkbox` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1788`

```jsx
                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={filters.priorityOnly}
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

#### `src/pages/SearchResults.jsx:1793`

```jsx
                        className="h-4 w-4"
                      />
                      Priority only
                      {!priorityAllowedForTab ? (
```
**Raw class strings detected (best effort):**

- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1797`

```jsx
                        <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          Premium
                        </span>
                      ) : null}
```
**Raw class strings detected (best effort):**

- `ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `ml-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/SearchResults.jsx:1802`

```jsx
                    <div className="flex flex-wrap gap-2 rounded-full bg-slate-50 p-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                      <button
                        type="button"
                        onClick={() => setFilterMode('product')}
```
**Raw class strings detected (best effort):**

- `flex flex-wrap gap-2 rounded-full bg-slate-50 p-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300`
- `button`
- `product`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-1` — Padding (all sides).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `product` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1806`

```jsx
                        className={`rounded-full px-3 py-1 ${filterMode === 'product' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
                      >
                        Product Filters
                      </button>
```
**Raw class strings detected (best effort):**

- `product`
- `bg-white text-slate-900 shadow-sm`
- `opacity-70`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `opacity-70` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `product` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1813`

```jsx
                        className={`rounded-full px-3 py-1 ${filterMode === 'supplier' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
                      >
                        Supplier Filters
                      </button>
```
**Raw class strings detected (best effort):**

- `supplier`
- `bg-white text-slate-900 shadow-sm`
- `opacity-70`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `opacity-70` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `supplier` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1821`

```jsx
                      className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                    >
                      {(filterMode === 'product' ? productAdvancedOpen : supplierAdvancedOpen) ? 'Hide advanced block' : 'Open advanced block'}
                    </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `product`
- `Hide advanced block`
- `Open advanced block`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `product` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Hide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `advanced` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Open` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1829`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Fabric type</p>
                          <div className="mt-2">
                            <ChipGroup
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1830`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Fabric type</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={FABRIC_TYPE_OPTIONS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:1831`

```jsx
                          <div className="mt-2">
                            <ChipGroup
                              options={FABRIC_TYPE_OPTIONS}
                              values={filters.fabricType}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1841`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">GSM / Weight</p>
                          <div className="mt-2">
                            <RangeSlider
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1842`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">GSM / Weight</p>
                          <div className="mt-2">
                            <RangeSlider
                              min={80}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:1843`

```jsx
                          <div className="mt-2">
                            <RangeSlider
                              min={80}
                              max={600}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1862`

```jsx
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        >
                          <option value="">Size range (Any)</option>
                          {SIZE_RANGE_OPTIONS.map((option) => (
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

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
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1870`

```jsx
                          <div className="mt-2">
                            <input
                              value={filters.sizeRangeCustom || ''}
                              onChange={(e) => updateAdvancedFilter('sizeRangeCustom', e.target.value)}
```
**Raw class strings detected (best effort):**

- `mt-2`
- `sizeRangeCustom`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `sizeRangeCustom` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1876`

```jsx
                              className="w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
                          </div>
                        ) : null}
```
**Raw class strings detected (best effort):**

- `w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1880`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Color / Pantone</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(filters.colorPantone || []).map((code) => (
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1881`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Color / Pantone</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(filters.colorPantone || []).map((code) => (
                              <button
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:1882`

```jsx
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(filters.colorPantone || []).map((code) => (
                              <button
                                key={code}
```
**Raw class strings detected (best effort):**

- `mt-2 flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1888`

```jsx
                                className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700"
                              >
                                {code} ×
                              </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/SearchResults.jsx:1894`

```jsx
                          <div className="mt-2 flex gap-2">
                            <input
                              value={pantoneDraft}
                              onChange={(e) => setPantoneDraft(e.target.value)}
```
**Raw class strings detected (best effort):**

- `mt-2 flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1900`

```jsx
                              className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  event.preventDefault()
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `Enter`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Enter` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1912`

```jsx
                              className="rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                            >
                              Add
                            </button>
```
**Raw class strings detected (best effort):**

- `rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1918`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Customization</p>
                          <div className="mt-2 space-y-2">
                            {CUSTOMIZATION_OPTIONS.map((opt) => {
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1919`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Customization</p>
                          <div className="mt-2 space-y-2">
                            {CUSTOMIZATION_OPTIONS.map((opt) => {
                              const checked = Array.isArray(filters.customization) && filters.customization.includes(opt)
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:1920`

```jsx
                          <div className="mt-2 space-y-2">
                            {CUSTOMIZATION_OPTIONS.map((opt) => {
                              const checked = Array.isArray(filters.customization) && filters.customization.includes(opt)
                              return (
```
**Raw class strings detected (best effort):**

- `mt-2 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1924`

```jsx
                                <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                  <input
                                    type="checkbox"
                                    checked={checked}
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

#### `src/pages/SearchResults.jsx:1935`

```jsx
                                    className="h-4 w-4"
                                  />
                                  {opt}
                                </label>
```
**Raw class strings detected (best effort):**

- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1943`

```jsx
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={filters.sampleAvailable}
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

#### `src/pages/SearchResults.jsx:1949`

```jsx
                            className="h-4 w-4"
                          />
                          Sample available
                        </label>
```
**Raw class strings detected (best effort):**

- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1953`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold text-slate-500">Sample lead time (days)</p>
                            <button
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `flex items-center justify-between gap-3`
- `text-[11px] font-semibold text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1954`

```jsx
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold text-slate-500">Sample lead time (days)</p>
                            <button
                              type="button"
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-[11px] font-semibold text-slate-500`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1955`

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Sample lead time (days)</p>
                            <button
                              type="button"
                              onClick={() => updateAdvancedFilter('sampleLeadTime', '')}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `button`
- `sampleLeadTime`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `sampleLeadTime` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1960`

```jsx
                              className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-60 dark:text-slate-300 dark:hover:text-slate-200"
                            >
                              Clear
                            </button>
```
**Raw class strings detected (best effort):**

- `text-[10px] font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-60 dark:text-slate-300 dark:hover:text-slate-200`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:text-slate-700` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1965`

```jsx
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
```
**Raw class strings detected (best effort):**

- `mt-2 flex items-center gap-3`
- `range`
- `0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `range` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1974`

```jsx
                              className="w-full"
                            />
                            <input
                              type="number"
```
**Raw class strings detected (best effort):**

- `w-full`
- `number`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `number` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1984`

```jsx
                              className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
                          </div>
                          <div className="mt-1 text-[10px] text-slate-400">
```
**Raw class strings detected (best effort):**

- `w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `mt-1 text-[10px] text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1987`

```jsx
                          <div className="mt-1 text-[10px] text-slate-400">
                            {filters.sampleLeadTime ? `Up to ${filters.sampleLeadTime} days` : 'Any (move slider to set)'}
                          </div>
                        </div>
```
**Raw class strings detected (best effort):**

- `mt-1 text-[10px] text-slate-400`
- `Any (move slider to set)`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Other:**
  - `Any` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `(move` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `slider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `set)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:1991`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Certifications</p>
                          <div className="mt-2">
                            <ChipGroup
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:1992`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Certifications</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={CERTIFICATION_OPTIONS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:1993`

```jsx
                          <div className="mt-2">
                            <ChipGroup
                              options={CERTIFICATION_OPTIONS}
                              values={filters.certifications}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2003`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Last audit date</p>
                          <input
                            type="date"
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `date`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `date` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2004`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Last audit date</p>
                          <input
                            type="date"
                            value={filters.auditDate}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `date`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `date` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2010`

```jsx
                            className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
```
**Raw class strings detected (best effort):**

- `mt-2 w-full rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2013`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
                          <div className="mt-2">
                            <ChipGroup
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2014`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={INCOTERM_OPTIONS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2015`

```jsx
                          <div className="mt-2">
                            <ChipGroup
                              options={INCOTERM_OPTIONS}
                              values={filters.incoterms}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2026`

```jsx
                      ) : <p className="text-[11px] text-slate-500">Open advanced block to configure product attributes.</p>
                    ) : (
                      supplierAdvancedOpen ? (
                      <>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2030`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Payment terms</p>
                          <div className="mt-2">
                            <ChipGroup
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2031`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Payment terms</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={PAYMENT_OPTIONS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2032`

```jsx
                          <div className="mt-2">
                            <ChipGroup
                              options={PAYMENT_OPTIONS}
                              values={filters.paymentTerms}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2042`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Document readiness</p>
                          <div className="mt-2">
                            <ChipGroup
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2043`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Document readiness</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={DOCUMENT_READY_OPTIONS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2044`

```jsx
                          <div className="mt-2">
                            <ChipGroup
                              options={DOCUMENT_READY_OPTIONS}
                              values={filters.documentReady}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2055`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold text-slate-500">Audit score (min)</p>
                            <button
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `flex items-center justify-between gap-3`
- `text-[11px] font-semibold text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2056`

```jsx
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold text-slate-500">Audit score (min)</p>
                            <button
                              type="button"
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-[11px] font-semibold text-slate-500`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2057`

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Audit score (min)</p>
                            <button
                              type="button"
                              onClick={() => updateAdvancedFilter('auditScoreMin', '')}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `button`
- `auditScoreMin`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `auditScoreMin` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2062`

```jsx
                              className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-60"
                            >
                              Clear
                            </button>
```
**Raw class strings detected (best effort):**

- `text-[10px] font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-60`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:text-slate-700` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2067`

```jsx
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
```
**Raw class strings detected (best effort):**

- `mt-2 flex items-center gap-3`
- `range`
- `0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `range` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2076`

```jsx
                              className="w-full"
                            />
                            <input
                              type="number"
```
**Raw class strings detected (best effort):**

- `w-full`
- `number`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `number` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2086`

```jsx
                              className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
                          </div>
                          <div className="mt-1 text-[10px] text-slate-400">
```
**Raw class strings detected (best effort):**

- `w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `mt-1 text-[10px] text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2089`

```jsx
                          <div className="mt-1 text-[10px] text-slate-400">
                            {filters.auditScoreMin ? `Min score: ${filters.auditScoreMin}` : 'Any (move slider to set)'}
                          </div>
                        </div>
```
**Raw class strings detected (best effort):**

- `mt-1 text-[10px] text-slate-400`
- `Any (move slider to set)`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Other:**
  - `Any` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `(move` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `slider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `set)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2093`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Language support</p>
                          <div className="mt-2">
                            <ChipGroup
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2094`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Language support</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={LANGUAGE_OPTIONS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2095`

```jsx
                          <div className="mt-2">
                            <ChipGroup
                              options={LANGUAGE_OPTIONS}
                              values={filters.languageSupport}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2105`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Production capacity (units/month)</p>
                          <div className="mt-2 flex items-center gap-3">
                            <input
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex items-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2106`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Production capacity (units/month)</p>
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex items-center gap-3`
- `range`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `range` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2107`

```jsx
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
```
**Raw class strings detected (best effort):**

- `mt-2 flex items-center gap-3`
- `range`
- `0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `range` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2116`

```jsx
                              className="w-full"
                            />
                            <span className="text-[11px] font-semibold">{filters.capacityMin || 0}</span>
                          </div>
```
**Raw class strings detected (best effort):**

- `w-full`
- `text-[11px] font-semibold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2118`

```jsx
                            <span className="text-[11px] font-semibold">{filters.capacityMin || 0}</span>
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold`
- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2121`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Main processes</p>
                          <div className="mt-2">
                            <ChipGroup
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2122`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Main processes</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={PROCESS_OPTIONS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2123`

```jsx
                          <div className="mt-2">
                            <ChipGroup
                              options={PROCESS_OPTIONS}
                              values={filters.processes}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2133`

```jsx
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Years in business (min)</p>
                            <div className="mt-2">
```
**Raw class strings detected (best effort):**

- `grid grid-cols-1 gap-2 md:grid-cols-2`
- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2134`

```jsx
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Years in business (min)</p>
                            <div className="mt-2">
                              <BucketChips
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2135`

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Years in business (min)</p>
                            <div className="mt-2">
                              <BucketChips
                                options={YEARS_IN_BUSINESS_MIN_BUCKETS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2136`

```jsx
                            <div className="mt-2">
                              <BucketChips
                                options={YEARS_IN_BUSINESS_MIN_BUCKETS}
                                value={filters.yearsInBusinessMin}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2145`

```jsx
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Avg response time (max)</p>
                            <div className="mt-2">
                              <BucketChips
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2146`

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Avg response time (max)</p>
                            <div className="mt-2">
                              <BucketChips
                                options={RESPONSE_TIME_MAX_BUCKETS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2147`

```jsx
                            <div className="mt-2">
                              <BucketChips
                                options={RESPONSE_TIME_MAX_BUCKETS}
                                value={filters.responseTimeMax}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2157`

```jsx
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Team seats (min)</p>
                            <div className="mt-2">
```
**Raw class strings detected (best effort):**

- `grid grid-cols-1 gap-2 md:grid-cols-2`
- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2158`

```jsx
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Team seats (min)</p>
                            <div className="mt-2">
                              <BucketChips
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2159`

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Team seats (min)</p>
                            <div className="mt-2">
                              <BucketChips
                                options={TEAM_SEATS_MIN_BUCKETS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2160`

```jsx
                            <div className="mt-2">
                              <BucketChips
                                options={TEAM_SEATS_MIN_BUCKETS}
                                value={filters.teamSeatsMin}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2169`

```jsx
                          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                            <input
                              type="checkbox"
                              checked={Boolean(filters.hasPermissionMatrix)}
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

#### `src/pages/SearchResults.jsx:2175`

```jsx
                              className="h-4 w-4"
                            />
                            Has role-based access (permission matrix)
                          </label>
```
**Raw class strings detected (best effort):**

- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2179`

```jsx
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Permission area</p>
                            <select
                              value={filters.permissionSection || ''}
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2180`

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Permission area</p>
                            <select
                              value={filters.permissionSection || ''}
                              onChange={(e) => updateAdvancedFilter('permissionSection', e.target.value)}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `permissionSection`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `permissionSection` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2185`

```jsx
                              className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            >
                              <option value="">Any (permission)</option>
                              <option value="requests">Requests</option>
```
**Raw class strings detected (best effort):**

- `mt-2 w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `requests`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `requests` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2194`

```jsx
                            <label className="mt-2 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                              <input
                                type="checkbox"
                                checked={Boolean(filters.permissionSectionEdit)}
```
**Raw class strings detected (best effort):**

- `mt-2 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200`
- `checkbox`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `checkbox` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2200`

```jsx
                                className="h-4 w-4"
                              />
                              Require edit access
                            </label>
```
**Raw class strings detected (best effort):**

- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2205`

```jsx
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Role seats</p>
                            <div className="mt-2">
                              <div className="flex gap-2">
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`
- `flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2206`

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Role seats</p>
                            <div className="mt-2">
                              <div className="flex gap-2">
                                <input
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`
- `flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2207`

```jsx
                            <div className="mt-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
```
**Raw class strings detected (best effort):**

- `mt-2`
- `flex gap-2`
- `text`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `text` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2208`

```jsx
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Role (e.g., manager)"
```
**Raw class strings detected (best effort):**

- `flex gap-2`
- `text`
- `Role (e.g., manager)`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `text` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Role` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `(e.g.,` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `manager)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2215`

```jsx
                                  className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                                />
                                <input
                                  type="number"
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `number`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `number` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2224`

```jsx
                                  className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                                />
                                <button
                                  type="button"
```
**Raw class strings detected (best effort):**

- `w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2230`

```jsx
                                  className="rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                                >
                                  Add
                                </button>
```
**Raw class strings detected (best effort):**

- `rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2235`

```jsx
                              <div className="mt-2 space-y-1">
                                {Array.isArray(filters.roleSeats) && filters.roleSeats.length ? (
                                  filters.roleSeats.map((entry) => (
                                    <div key={entry.role} className="flex items-center justify-between">
```
**Raw class strings detected (best effort):**

- `mt-2 space-y-1`
- `flex items-center justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2238`

```jsx
                                    <div key={entry.role} className="flex items-center justify-between">
                                      <div className="text-[11px] text-slate-700">{entry.role}: {entry.seats || 0} seats</div>
                                      <div>
                                        <button
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between`
- `text-[11px] text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2239`

```jsx
                                      <div className="text-[11px] text-slate-700">{entry.role}: {entry.seats || 0} seats</div>
                                      <div>
                                        <button
                                          type="button"
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-700`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2245`

```jsx
                                          className="rounded-full px-2 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30"
                                        >
                                          Remove
                                        </button>
```
**Raw class strings detected (best effort):**

- `rounded-full px-2 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-rose-200/30` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2253`

```jsx
                                  <div className="text-[11px] text-slate-400">No role seat filters</div>
                                )}
                              </div>
                            </div>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2258`

```jsx
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Export ports</p>
                            <div className="mt-2">
                              <ChipGroup
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2259`

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Export ports</p>
                            <div className="mt-2">
                              <ChipGroup
                                options={EXPORT_PORT_OPTIONS}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2260`

```jsx
                            <div className="mt-2">
                              <ChipGroup
                                options={EXPORT_PORT_OPTIONS}
                                values={filters.exportPort}
```
**Raw class strings detected (best effort):**

- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2271`

```jsx
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={filters.handlesMultipleFactories}
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

#### `src/pages/SearchResults.jsx:2277`

```jsx
                            className="h-4 w-4"
                          />
                          Handles multiple factories
                        </label>
```
**Raw class strings detected (best effort):**

- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2281`

```jsx
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Location + radius</p>
                          <div className="mt-2 flex gap-2">
                            <input
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2282`

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Location + radius</p>
                          <div className="mt-2 flex gap-2">
                            <input
                              value={geoQuery}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500`
- `mt-2 flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2283`

```jsx
                          <div className="mt-2 flex gap-2">
                            <input
                              value={geoQuery}
                              onChange={(e) => setGeoQuery(e.target.value)}
```
**Raw class strings detected (best effort):**

- `mt-2 flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2289`

```jsx
                              className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
                            <button
                              type="button"
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[rgba(10,102,194,0.35)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2295`

```jsx
                              className="rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                            >
                              Use my location
                            </button>
```
**Raw class strings detected (best effort):**

- `rounded-lg bg-[var(--gt-blue)] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2300`

```jsx
                          {geoLoading ? <div className="mt-2 text-[10px] text-slate-500">Searching locations...</div> : null}
                          {geoError ? <div className="mt-2 text-[10px] text-rose-600">{geoError}</div> : null}
                          {geoResults.length ? (
                            <div className="mt-2 max-h-32 space-y-1 overflow-auto rounded-lg borderless-shadow bg-white p-2">
```
**Raw class strings detected (best effort):**

- `mt-2 text-[10px] text-slate-500`
- `mt-2 text-[10px] text-rose-600`
- `mt-2 max-h-32 space-y-1 overflow-auto rounded-lg borderless-shadow bg-white p-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-h-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/SearchResults.jsx:2301`

```jsx
                          {geoError ? <div className="mt-2 text-[10px] text-rose-600">{geoError}</div> : null}
                          {geoResults.length ? (
                            <div className="mt-2 max-h-32 space-y-1 overflow-auto rounded-lg borderless-shadow bg-white p-2">
                              {geoResults.map((result) => (
```
**Raw class strings detected (best effort):**

- `mt-2 text-[10px] text-rose-600`
- `mt-2 max-h-32 space-y-1 overflow-auto rounded-lg borderless-shadow bg-white p-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-h-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/SearchResults.jsx:2303`

```jsx
                            <div className="mt-2 max-h-32 space-y-1 overflow-auto rounded-lg borderless-shadow bg-white p-2">
                              {geoResults.map((result) => (
                                <button
                                  key={result.id}
```
**Raw class strings detected (best effort):**

- `mt-2 max-h-32 space-y-1 overflow-auto rounded-lg borderless-shadow bg-white p-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-h-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/SearchResults.jsx:2309`

```jsx
                                  className="w-full text-left text-[11px] text-slate-700 hover:text-[var(--gt-blue)]"
                                >
                                  {result.label}
                                </button>
```
**Raw class strings detected (best effort):**

- `w-full text-left text-[11px] text-slate-700 hover:text-[var(--gt-blue)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-left` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:text-[var(--gt-blue)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2317`

```jsx
                            <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                              Selected: {locationLabel}
                            </div>
                          ) : null}
```
**Raw class strings detected (best effort):**

- `mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.

#### `src/pages/SearchResults.jsx:2321`

```jsx
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                            <span>Lat: {filters.locationLat || '--'} · Lng: {filters.locationLng || '--'}</span>
                            <button
                              type="button"
```
**Raw class strings detected (best effort):**

- `mt-2 flex items-center justify-between text-[10px] text-slate-500`
- `--`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Other:**
  - `--` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2326`

```jsx
                              className="text-[10px] font-semibold text-[var(--gt-blue)]"
                            >
                              {showMapPreview ? 'Hide map' : 'Show map'}
                            </button>
```
**Raw class strings detected (best effort):**

- `text-[10px] font-semibold text-[var(--gt-blue)]`
- `Hide map`
- `Show map`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Other:**
  - `Hide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `map` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Show` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2331`

```jsx
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
```
**Raw class strings detected (best effort):**

- `mt-2 flex items-center gap-3`
- `range`
- `0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `range` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2340`

```jsx
                              className="w-full"
                            />
                            <span className="text-[11px] font-semibold">{filters.distanceKm || 0}km</span>
                          </div>
```
**Raw class strings detected (best effort):**

- `w-full`
- `text-[11px] font-semibold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2342`

```jsx
                            <span className="text-[11px] font-semibold">{filters.distanceKm || 0}km</span>
                          </div>
                          {showMapPreview && filters.locationLat && filters.locationLng ? (
                            <div className="mt-2 h-36 overflow-hidden rounded-lg borderless-shadow">
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold`
- `mt-2 h-36 overflow-hidden rounded-lg borderless-shadow`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-36` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/SearchResults.jsx:2345`

```jsx
                            <div className="mt-2 h-36 overflow-hidden rounded-lg borderless-shadow">
                              <div ref={mapRef} className="h-full w-full" />
                            </div>
                          ) : null}
```
**Raw class strings detected (best effort):**

- `mt-2 h-36 overflow-hidden rounded-lg borderless-shadow`
- `h-full w-full`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-36` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/SearchResults.jsx:2346`

```jsx
                              <div ref={mapRef} className="h-full w-full" />
                            </div>
                          ) : null}
                        </div>
```
**Raw class strings detected (best effort):**

- `h-full w-full`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2351`

```jsx
                      ) : <p className="text-[11px] text-slate-500">Open advanced block to configure supplier/account attributes.</p>
                    )}
                  </div>
                ) : (
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2355`

```jsx
                  <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Advanced filters are hidden to keep search simple. Use "More filters" when needed.</p>
                )}
              </div>

```
**Raw class strings detected (best effort):**

- `mt-3 text-[11px] text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2359`

```jsx
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Filter guidance</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <p>Supplier filters use profile data such as main processes, export ports, and years in business.</p>
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

#### `src/pages/SearchResults.jsx:2360`

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Filter guidance</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <p>Supplier filters use profile data such as main processes, export ports, and years in business.</p>
                  <p>Distance radius uses coordinates. Use “Use my location” to fill lat/lng quickly. If a supplier has no coordinates, we fall back to country matching.</p>
```
**Raw class strings detected (best effort):**

- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2361`

```jsx
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <p>Supplier filters use profile data such as main processes, export ports, and years in business.</p>
                  <p>Distance radius uses coordinates. Use “Use my location” to fill lat/lng quickly. If a supplier has no coordinates, we fall back to country matching.</p>
                  <p>Premium filters are optional. Core filters always remain free and unlimited.</p>
```
**Raw class strings detected (best effort):**

- `mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2368`

```jsx
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status & presets</p>
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

#### `src/pages/SearchResults.jsx:2369`

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status & presets</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2">{upgradePrompt}</p> : null}
```
**Raw class strings detected (best effort):**

- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300`
- `text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2`

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
  - `borderless-shadow` — Border style/width/color.
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2370`

```jsx
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 borderless-shadow rounded-xl p-2">{alertFeedback}</p> : null}
```
**Raw class strings detected (best effort):**

- `mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300`
- `text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2`
- `text-sky-800 bg-sky-50 borderless-shadow rounded-xl p-2`

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
  - `borderless-shadow` — Border style/width/color.
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2372`

```jsx
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 borderless-shadow rounded-xl p-2">{alertFeedback}</p> : null}
                </div>

```
**Raw class strings detected (best effort):**

- `text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2`
- `text-sky-800 bg-sky-50 borderless-shadow rounded-xl p-2`

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
  - `borderless-shadow` — Border style/width/color.
  - `rounded-xl` — Corner radius.

#### `src/pages/SearchResults.jsx:2373`

```jsx
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 borderless-shadow rounded-xl p-2">{alertFeedback}</p> : null}
                </div>

                <div className="mt-4">
```
**Raw class strings detected (best effort):**

- `text-sky-800 bg-sky-50 borderless-shadow rounded-xl p-2`
- `mt-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-2` — Padding (all sides).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sky-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-sky-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-xl` — Corner radius.

#### `src/pages/SearchResults.jsx:2376`

```jsx
                <div className="mt-4">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Apply preset</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
```
**Raw class strings detected (best effort):**

- `mt-4`
- `text-[11px] font-semibold text-slate-500 dark:text-slate-400`
- `mt-2 flex flex-wrap gap-2`
- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2377`

```jsx
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Apply preset</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
```
**Raw class strings detected (best effort):**

- `text-[11px] font-semibold text-slate-500 dark:text-slate-400`
- `mt-2 flex flex-wrap gap-2`
- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2378`

```jsx
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
```
**Raw class strings detected (best effort):**

- `mt-2 flex flex-wrap gap-2`
- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2379`

```jsx
                    <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2380`

```jsx
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
                </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2381`

```jsx
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
                </div>

```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2385`

```jsx
                <div className="mt-3">
                  <button type="button" onClick={() => setManagePresetsOpen((p) => !p)} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Manage presets</button>
                  {managePresetsOpen ? (
                    <div className="mt-2 space-y-2">
```
**Raw class strings detected (best effort):**

- `mt-3`
- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70`
- `mt-2 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2386`

```jsx
                  <button type="button" onClick={() => setManagePresetsOpen((p) => !p)} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Manage presets</button>
                  {managePresetsOpen ? (
                    <div className="mt-2 space-y-2">
                      {listLocalPresets().length ? listLocalPresets().map((p) => (
```
**Raw class strings detected (best effort):**

- `rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70`
- `mt-2 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2388`

```jsx
                    <div className="mt-2 space-y-2">
                      {listLocalPresets().length ? listLocalPresets().map((p) => (
                        <div key={p.key} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70">
                          <div className="min-w-0 text-xs text-slate-700">{p.key.replace('_', ' ')} preset</div>
```
**Raw class strings detected (best effort):**

- `mt-2 space-y-2`
- `flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70`
- `min-w-0 text-xs text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2390`

```jsx
                        <div key={p.key} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70">
                          <div className="min-w-0 text-xs text-slate-700">{p.key.replace('_', ' ')} preset</div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => applyPreset(p.key)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70`
- `min-w-0 text-xs text-slate-700`
- `flex gap-2`
- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `rounded-full` — Corner radius.

#### `src/pages/SearchResults.jsx:2391`

```jsx
                          <div className="min-w-0 text-xs text-slate-700">{p.key.replace('_', ' ')} preset</div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => applyPreset(p.key)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                            <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
```
**Raw class strings detected (best effort):**

- `min-w-0 text-xs text-slate-700`
- `flex gap-2`
- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2392`

```jsx
                          <div className="flex gap-2">
                            <button type="button" onClick={() => applyPreset(p.key)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                            <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
```
**Raw class strings detected (best effort):**

- `flex gap-2`
- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2393`

```jsx
                            <button type="button" onClick={() => applyPreset(p.key)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                            <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `ring-rose-200/30` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2394`

```jsx
                            <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `ring-rose-200/30` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2395`

```jsx
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
                        </div>
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `ring-rose-200/30` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2396`

```jsx
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
                        </div>
                      )) : (
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-rose-200/30` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2400`

```jsx
                        <div className="text-xs text-slate-500">No local presets saved. Use the preset buttons above to save one.</div>
                      )}

                      <div className="pt-2 border-t" />
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`
- `pt-2 border-t`

**Utility breakdown (grouped):**

- **Spacing:**
  - `pt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-t` — Border style/width/color.

#### `src/pages/SearchResults.jsx:2403`

```jsx
                      <div className="pt-2 border-t" />

                      <div>
                        <p className="text-xs font-semibold text-slate-500">Server presets</p>
```
**Raw class strings detected (best effort):**

- `pt-2 border-t`
- `text-xs font-semibold text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `pt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-t` — Border style/width/color.

#### `src/pages/SearchResults.jsx:2406`

```jsx
                        <p className="text-xs font-semibold text-slate-500">Server presets</p>
                        <div className="mt-2 space-y-2">
                          {serverPresetsLoading ? (
                            <div className="text-xs text-slate-500">Loading server presets...</div>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-500`
- `mt-2 space-y-2`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2407`

```jsx
                        <div className="mt-2 space-y-2">
                          {serverPresetsLoading ? (
                            <div className="text-xs text-slate-500">Loading server presets...</div>
                          ) : (serverPresets.length ? serverPresets.map((sp) => (
```
**Raw class strings detected (best effort):**

- `mt-2 space-y-2`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2409`

```jsx
                            <div className="text-xs text-slate-500">Loading server presets...</div>
                          ) : (serverPresets.length ? serverPresets.map((sp) => (
                            <div key={sp.id} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70">
                              <div className="min-w-0 text-xs text-slate-700">{sp.name}{String(sp.owner_id) === String(sessionUser?.id) ? ' (you)' : ''}</div>
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`
- `flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70`
- `min-w-0 text-xs text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2411`

```jsx
                            <div key={sp.id} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70">
                              <div className="min-w-0 text-xs text-slate-700">{sp.name}{String(sp.owner_id) === String(sessionUser?.id) ? ' (you)' : ''}</div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => applyServerPreset(sp)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70`
- `min-w-0 text-xs text-slate-700`
- `flex gap-2`
- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `rounded-full` — Corner radius.

#### `src/pages/SearchResults.jsx:2412`

```jsx
                              <div className="min-w-0 text-xs text-slate-700">{sp.name}{String(sp.owner_id) === String(sessionUser?.id) ? ' (you)' : ''}</div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => applyServerPreset(sp)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                                {String(sp.owner_id) === String(sessionUser?.id) ? (
```
**Raw class strings detected (best effort):**

- `min-w-0 text-xs text-slate-700`
- `flex gap-2`
- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/SearchResults.jsx:2413`

```jsx
                              <div className="flex gap-2">
                                <button type="button" onClick={() => applyServerPreset(sp)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                                {String(sp.owner_id) === String(sessionUser?.id) ? (
                                  <>
```
**Raw class strings detected (best effort):**

- `flex gap-2`
- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/SearchResults.jsx:2414`

```jsx
                                <button type="button" onClick={() => applyServerPreset(sp)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                                {String(sp.owner_id) === String(sessionUser?.id) ? (
                                  <>
                                    <button type="button" onClick={() => updateServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Save</button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2417`

```jsx
                                    <button type="button" onClick={() => updateServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Save</button>
                                    <button type="button" onClick={() => deleteServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                                  </>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `ring-rose-200/30` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2418`

```jsx
                                    <button type="button" onClick={() => deleteServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                                  </>
                                ) : null}
                              </div>
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-rose-200/30` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/SearchResults.jsx:2424`

```jsx
                            <div className="text-xs text-slate-500">No server presets. Save your current search to create one.</div>
                          ))}

                          <div className="mt-2">
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/SearchResults.jsx:2427`

```jsx
                          <div className="mt-2">
                            <button type="button" onClick={() => {
                              const name = window.prompt('Preset name')
                              if (name) createServerPresetFromCurrent(name)
```
**Raw class strings detected (best effort):**

- `mt-2`
- `button`
- `Preset name`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Preset` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `name` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2431`

```jsx
                            }} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Save current as server preset</button>
                          </div>
                        </div>
                      </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/SearchResults.jsx:2440`

```jsx
                  <div className="mt-4 rounded-xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-white/5 dark:text-slate-200">
                    <p className="font-semibold text-slate-700 dark:text-slate-100">Save this search as a preset</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
```
**Raw class strings detected (best effort):**

- `mt-4 rounded-xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-white/5 dark:text-slate-200`
- `font-semibold text-slate-700 dark:text-slate-100`
- `mt-2 flex flex-wrap gap-2`
- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2441`

```jsx
                    <p className="font-semibold text-slate-700 dark:text-slate-100">Save this search as a preset</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-700 dark:text-slate-100`
- `mt-2 flex flex-wrap gap-2`
- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2442`

```jsx
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
```
**Raw class strings detected (best effort):**

- `mt-2 flex flex-wrap gap-2`
- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/SearchResults.jsx:2443`

```jsx
                      <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2444`

```jsx
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2445`

```jsx
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
                  </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white`
- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2446`

```jsx
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
                  </div>
                ) : null}
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2455`

```jsx
        <div className="mt-5 grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10">
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {TAB_OPTIONS.map((t) => {
```
**Raw class strings detected (best effort):**

- `mt-5 grid grid-cols-12 gap-4`
- `col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10`
- `relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`

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
  - `borderless-divider-b` — Border style/width/color.
- **Responsive variants:**
  - `xl:col-span-9` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-950/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2456`

```jsx
          <div className="col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10">
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {TAB_OPTIONS.map((t) => {
                const Icon = t.icon
```
**Raw class strings detected (best effort):**

- `col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10`
- `relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`

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
  - `borderless-divider-b` — Border style/width/color.
- **Responsive variants:**
  - `xl:col-span-9` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-950/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2457`

```jsx
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {TAB_OPTIONS.map((t) => {
                const Icon = t.icon
                const active = activeTab === t.id
```
**Raw class strings detected (best effort):**

- `relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`

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
  - `borderless-divider-b` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-950/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2468`

```jsx
                    className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ring-1${
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

#### `src/pages/SearchResults.jsx:2477`

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

#### `src/pages/SearchResults.jsx:2481`

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

#### `src/pages/SearchResults.jsx:2484`

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

#### `src/pages/SearchResults.jsx:2491`

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

#### `src/pages/SearchResults.jsx:2493`

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

#### `src/pages/SearchResults.jsx:2501`

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

#### `src/pages/SearchResults.jsx:2507`

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

#### `src/pages/SearchResults.jsx:2513`

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

#### `src/pages/SearchResults.jsx:2515`

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

#### `src/pages/SearchResults.jsx:2535`

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

#### `src/pages/SearchResults.jsx:2537`

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

#### `src/pages/SearchResults.jsx:2538`

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

#### `src/pages/SearchResults.jsx:2539`

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

#### `src/pages/SearchResults.jsx:2540`

```jsx
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || 'Buyer'}
                                </Link>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600 dark:bg-white/10 dark:text-slate-200">
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate`
- `Buyer`
- `inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600 dark:bg-white/10 dark:text-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2543`

```jsx
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600 dark:bg-white/10 dark:text-slate-200">
                                  {requestType}
                                </span>
                                {r.verified_only ? (
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600 dark:bg-white/10 dark:text-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2547`

```jsx
                                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                                    Verified only
                                  </span>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-indigo-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2552`

```jsx
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                                    Active discussion
                                  </span>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/SearchResults.jsx:2557`

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

#### `src/pages/SearchResults.jsx:2562`

```jsx
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                                    Certified
                                  </span>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200`

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
  - `bg-emerald-50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-emerald-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2567`

```jsx
                                  <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                                    Priority
                                  </span>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sky-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-sky-50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-sky-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2571`

```jsx
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
                              </div>
                              {(specLabel || quoteDeadline || expiresAt) ? (
                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 dark:text-slate-400`
- `mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2574`

```jsx
                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                                  {specLabel ? <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">{specLabel}</span> : null}
                                  {quoteDeadline ? <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">Quote by {quoteDeadline.toLocaleDateString()}</span> : null}
                                  {expiresAt ? (
```
**Raw class strings detected (best effort):**

- `mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300`
- `rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10`
- `rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-sky-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-100` — Background color/surface.
  - `bg-sky-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-sky-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2575`

```jsx
                                  {specLabel ? <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">{specLabel}</span> : null}
                                  {quoteDeadline ? <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">Quote by {quoteDeadline.toLocaleDateString()}</span> : null}
                                  {expiresAt ? (
                                    <span className={`rounded-full px-2 py-1${isExpired ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'}`}>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10`
- `rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200`
- `bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200`
- `bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sky-700` — Text color or text sizing.
  - `text-rose-700` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `bg-sky-50` — Background color/surface.
  - `bg-rose-50` — Background color/surface.
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-sky-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-rose-500/15` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-amber-500/15` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2576`

```jsx
                                  {quoteDeadline ? <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">Quote by {quoteDeadline.toLocaleDateString()}</span> : null}
                                  {expiresAt ? (
                                    <span className={`rounded-full px-2 py-1${isExpired ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'}`}>
                                      {isExpired ? 'Expired' : `Expires ${expiresAt.toLocaleDateString()}`}
```
**Raw class strings detected (best effort):**

- `rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200`
- `bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200`
- `bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200`
- `Expired`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sky-700` — Text color or text sizing.
  - `text-rose-700` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-sky-50` — Background color/surface.
  - `bg-rose-50` — Background color/surface.
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-sky-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-rose-500/15` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-amber-500/15` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Expired` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2578`

```jsx
                                    <span className={`rounded-full px-2 py-1${isExpired ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'}`}>
                                      {isExpired ? 'Expired' : `Expires ${expiresAt.toLocaleDateString()}`}
                                    </span>
                                  ) : null}
```
**Raw class strings detected (best effort):**

- `bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200`
- `bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200`
- `Expired`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-rose-700` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-50` — Background color/surface.
  - `bg-amber-50` — Background color/surface.
- **Dark mode variants:**
  - `dark:bg-rose-500/15` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-amber-500/15` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Expired` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2583`

```jsx
                                    <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">Max suppliers: {maxSuppliers}</span>
                                  ) : null}
                                </div>
                              ) : null}
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2587`

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

#### `src/pages/SearchResults.jsx:2588`

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

#### `src/pages/SearchResults.jsx:2589`

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

#### `src/pages/SearchResults.jsx:2590`

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

#### `src/pages/SearchResults.jsx:2591`

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

#### `src/pages/SearchResults.jsx:2592`

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

#### `src/pages/SearchResults.jsx:2595`

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

#### `src/pages/SearchResults.jsx:2596`

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

#### `src/pages/SearchResults.jsx:2606`

```jsx
                                className="rounded-full bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
                              >
                                Contact
                              </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2619`

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

#### `src/pages/SearchResults.jsx:2631`

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

#### `src/pages/SearchResults.jsx:2633`

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

#### `src/pages/SearchResults.jsx:2634`

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

#### `src/pages/SearchResults.jsx:2635`

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

#### `src/pages/SearchResults.jsx:2636`

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

#### `src/pages/SearchResults.jsx:2640`

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

#### `src/pages/SearchResults.jsx:2645`

```jsx
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                                    Certified
                                  </span>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200`

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
  - `bg-emerald-50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-emerald-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2650`

```jsx
                                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                                    Premium
                                  </span>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-indigo-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2655`

```jsx
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                                    Boosted {p.boost_multiplier && p.boost_multiplier !== 1 ? `x${p.boost_multiplier}` : ""}
                                  </span>
                                ) : null}
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/SearchResults.jsx:2659`

```jsx
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">- {String(author.role).replaceAll('_', ' ')}</span> : null}
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

#### `src/pages/SearchResults.jsx:2660`

```jsx
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">- {String(author.role).replaceAll('_', ' ')}</span> : null}
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

#### `src/pages/SearchResults.jsx:2662`

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

#### `src/pages/SearchResults.jsx:2663`

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

#### `src/pages/SearchResults.jsx:2664`

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

#### `src/pages/SearchResults.jsx:2665`

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

#### `src/pages/SearchResults.jsx:2666`

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

#### `src/pages/SearchResults.jsx:2667`

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

#### `src/pages/SearchResults.jsx:2668`

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

#### `src/pages/SearchResults.jsx:2671`

```jsx
                              <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                                Rating: <span className="font-semibold text-slate-800 dark:text-slate-100">{rating?.average_score ?? '0.0'}</span> ({rating?.total_count ?? 0}) - Confidence {Math.round((rating?.score_confidence ?? 0) * 100)}%
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

#### `src/pages/SearchResults.jsx:2672`

```jsx
                                Rating: <span className="font-semibold text-slate-800 dark:text-slate-100">{rating?.average_score ?? '0.0'}</span> ({rating?.total_count ?? 0}) - Confidence {Math.round((rating?.score_confidence ?? 0) * 100)}%
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

#### `src/pages/SearchResults.jsx:2674`

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

#### `src/pages/SearchResults.jsx:2676`

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

#### `src/pages/SearchResults.jsx:2677`

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

#### `src/pages/SearchResults.jsx:2683`

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

#### `src/pages/SearchResults.jsx:2694`

```jsx
                                className="rounded-full bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
                              >
                                Contact
                              </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2710`

```jsx
          <aside className="col-span-12 xl:col-span-3 space-y-4">
            {isBuyer ? (
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Early verified factories</p>
```
**Raw class strings detected (best effort):**

- `col-span-12 xl:col-span-3 space-y-4`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-sm font-bold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
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
- **Responsive variants:**
  - `xl:col-span-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2712`

```jsx
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Early verified factories</p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Premium-only early access list</p>
                {!canEarlyAccess ? (
```
**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-[11px] text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
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
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2713`

```jsx
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Early verified factories</p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Premium-only early access list</p>
                {!canEarlyAccess ? (
                  <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-[11px] text-slate-500 dark:text-slate-400`
- `mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-amber-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-amber-500/30` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2714`

```jsx
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Premium-only early access list</p>
                {!canEarlyAccess ? (
                  <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                    Upgrade to Premium to unlock early access to newly verified factories.
```
**Raw class strings detected (best effort):**

- `mt-1 text-[11px] text-slate-500 dark:text-slate-400`
- `mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-amber-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-amber-500/30` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2716`

```jsx
                  <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                    Upgrade to Premium to unlock early access to newly verified factories.
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

#### `src/pages/SearchResults.jsx:2718`

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

#### `src/pages/SearchResults.jsx:2719`

```jsx
                      <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
                    </div>
                  </div>
                ) : earlyVerifiedError ? (
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

#### `src/pages/SearchResults.jsx:2723`

```jsx
                  <div className="mt-2 text-xs text-rose-600 dark:text-rose-300">{earlyVerifiedError}</div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {earlyVerifiedFactories.length ? earlyVerifiedFactories.slice(0, 6).map((row) => (
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-rose-600 dark:text-rose-300`
- `mt-3 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-rose-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2725`

```jsx
                  <div className="mt-3 space-y-2">
                    {earlyVerifiedFactories.length ? earlyVerifiedFactories.slice(0, 6).map((row) => (
                      <Link
                        key={row.id}
```
**Raw class strings detected (best effort):**

- `mt-3 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/SearchResults.jsx:2730`

```jsx
                        className="block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
                      >
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.name || 'Factory'}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.country || '-'} - verified</p>
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

#### `src/pages/SearchResults.jsx:2732`

```jsx
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.name || 'Factory'}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.country || '-'} - verified</p>
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

#### `src/pages/SearchResults.jsx:2733`

```jsx
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.country || '-'} - verified</p>
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

#### `src/pages/SearchResults.jsx:2736`

```jsx
                      <div className="text-xs text-slate-500 dark:text-slate-400">No new verified factories yet.</div>
                    )}
                  </div>
                )}
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2742`

```jsx
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you - Recorded on Quick View</p>
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

#### `src/pages/SearchResults.jsx:2743`

```jsx
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you - Recorded on Quick View</p>
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

#### `src/pages/SearchResults.jsx:2744`

```jsx
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you - Recorded on Quick View</p>
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

#### `src/pages/SearchResults.jsx:2745`

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

#### `src/pages/SearchResults.jsx:2751`

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

#### `src/pages/SearchResults.jsx:2754`

```jsx
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.product?.title || 'Product'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} - {new Date(row.viewed_at).toLocaleString()}</p>
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

#### `src/pages/SearchResults.jsx:2755`

```jsx
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} - {new Date(row.viewed_at).toLocaleString()}</p>
                  </button>
                )) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400">No views yet. Use "Quick view" on a product.</div>
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

#### `src/pages/SearchResults.jsx:2758`

```jsx
                  <div className="text-xs text-slate-500 dark:text-slate-400">No views yet. Use "Quick view" on a product.</div>
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

#### `src/pages/SearchResults.jsx:2761`

```jsx
              <div className="mt-3">
                <Link to="/notifications" className="text-xs font-semibold text-[var(--gt-blue)] hover:underline">Open full history</Link>
              </div>
            </div>
```
**Raw class strings detected (best effort):**

- `mt-3`
- `text-xs font-semibold text-[var(--gt-blue)] hover:underline`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2762`

```jsx
                <Link to="/notifications" className="text-xs font-semibold text-[var(--gt-blue)] hover:underline">Open full history</Link>
              </div>
            </div>

```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[var(--gt-blue)] hover:underline`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/SearchResults.jsx:2767`

```jsx
              <div className="rounded-2xl p-4 ring-1 ring-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:ring-amber-500/30">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Advanced filters locked</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">
                  Upgrade to Premium to unlock advanced filters. Core filters remain unlimited on the free plan.
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

#### `src/pages/SearchResults.jsx:2768`

```jsx
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Advanced filters locked</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">
                  Upgrade to Premium to unlock advanced filters. Core filters remain unlimited on the free plan.
                </p>
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

#### `src/pages/SearchResults.jsx:2769`

```jsx
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">
                  Upgrade to Premium to unlock advanced filters. Core filters remain unlimited on the free plan.
                </p>
              </div>
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

- `src/pages/SearchResults.jsx:324` — Loading result {index + 1}

```jsx
      <span className="sr-only">Loading result {index + 1}</span>
    </div>
  )
}
```
- `src/pages/SearchResults.jsx:353` — ({count})

```jsx
              <span className={`ml-1 text-[10px] ${selected ? 'text-white/80' : 'text-slate-400'}`}>({count})</span>
            ) : null}
          </button>
        )
```
- `src/pages/SearchResults.jsx:1489` — Search

```jsx
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Search</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
              </div>
            </div>
```
- `src/pages/SearchResults.jsx:1490` — Garments & Textile marketplace

```jsx
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
              </div>
            </div>

```
- `src/pages/SearchResults.jsx:1587` — No active filters

```jsx
              )) : <span className="text-[11px] text-slate-500 dark:text-slate-400">No active filters</span>}
              <button
                type="button"
                onClick={clearAllFilters}
```
- `src/pages/SearchResults.jsx:1617` — Product

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Product</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core filters are visible first</p>
                <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
                  <select
```
- `src/pages/SearchResults.jsx:1618` — Core filters are visible first

```jsx
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core filters are visible first</p>
                <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
                  <select
                    value={filters.industry}
```
- `src/pages/SearchResults.jsx:1631` — MOQ range

```jsx
                    <p className="text-[11px] font-semibold text-slate-500">MOQ range</p>
                    <div className="mt-2">
                      <BucketChips
                        options={MOQ_BUCKETS}
```
- `src/pages/SearchResults.jsx:1661` — Price per unit

```jsx
                    <p className="text-[11px] font-semibold text-slate-500">Price per unit</p>
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        value={filters.priceCurrency || ''}
```
- `src/pages/SearchResults.jsx:1688` — Incoterms

```jsx
                    <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
                    <div className="mt-2">
                      <ChipGroup
                        options={INCOTERM_OPTIONS}
```
- `src/pages/SearchResults.jsx:1731` — Supplier / Account

```jsx
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Supplier / Account</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core visible first, attributes under More filters</p>
                  </div>
                  <button
```
- `src/pages/SearchResults.jsx:1732` — Core visible first, attributes under More filters

```jsx
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core visible first, attributes under More filters</p>
                  </div>
                  <button
                    type="button"
```
- `src/pages/SearchResults.jsx:1752` — Account type

```jsx
                    <p className="text-[11px] font-semibold text-slate-500">Account type</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['', 'buyer', 'factory', 'buying_house'].map((value) => {
                        const label = value === '' ? 'Any' : (value === 'buying_house' ? 'Buying House' : value.charAt(0).toUpperCase() + value.slice(1))
```
- `src/pages/SearchResults.jsx:1830` — Fabric type

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Fabric type</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={FABRIC_TYPE_OPTIONS}
```
- `src/pages/SearchResults.jsx:1842` — GSM / Weight

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">GSM / Weight</p>
                          <div className="mt-2">
                            <RangeSlider
                              min={80}
```
- `src/pages/SearchResults.jsx:1881` — Color / Pantone

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Color / Pantone</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(filters.colorPantone || []).map((code) => (
                              <button
```
- `src/pages/SearchResults.jsx:1919` — Customization

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Customization</p>
                          <div className="mt-2 space-y-2">
                            {CUSTOMIZATION_OPTIONS.map((opt) => {
                              const checked = Array.isArray(filters.customization) && filters.customization.includes(opt)
```
- `src/pages/SearchResults.jsx:1955` — Sample lead time (days)

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Sample lead time (days)</p>
                            <button
                              type="button"
                              onClick={() => updateAdvancedFilter('sampleLeadTime', '')}
```
- `src/pages/SearchResults.jsx:1992` — Certifications

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Certifications</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={CERTIFICATION_OPTIONS}
```
- `src/pages/SearchResults.jsx:2004` — Last audit date

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Last audit date</p>
                          <input
                            type="date"
                            value={filters.auditDate}
```
- `src/pages/SearchResults.jsx:2014` — Incoterms

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={INCOTERM_OPTIONS}
```
- `src/pages/SearchResults.jsx:2026` — Open advanced block to configure product attributes.

```jsx
                      ) : <p className="text-[11px] text-slate-500">Open advanced block to configure product attributes.</p>
                    ) : (
                      supplierAdvancedOpen ? (
                      <>
```
- `src/pages/SearchResults.jsx:2031` — Payment terms

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Payment terms</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={PAYMENT_OPTIONS}
```
- `src/pages/SearchResults.jsx:2043` — Document readiness

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Document readiness</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={DOCUMENT_READY_OPTIONS}
```
- `src/pages/SearchResults.jsx:2057` — Audit score (min)

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Audit score (min)</p>
                            <button
                              type="button"
                              onClick={() => updateAdvancedFilter('auditScoreMin', '')}
```
- `src/pages/SearchResults.jsx:2094` — Language support

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Language support</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={LANGUAGE_OPTIONS}
```
- `src/pages/SearchResults.jsx:2106` — Production capacity (units/month)

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Production capacity (units/month)</p>
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
```
- `src/pages/SearchResults.jsx:2122` — Main processes

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Main processes</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={PROCESS_OPTIONS}
```
- `src/pages/SearchResults.jsx:2135` — Years in business (min)

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Years in business (min)</p>
                            <div className="mt-2">
                              <BucketChips
                                options={YEARS_IN_BUSINESS_MIN_BUCKETS}
```
- `src/pages/SearchResults.jsx:2146` — Avg response time (max)

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Avg response time (max)</p>
                            <div className="mt-2">
                              <BucketChips
                                options={RESPONSE_TIME_MAX_BUCKETS}
```
- `src/pages/SearchResults.jsx:2159` — Team seats (min)

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Team seats (min)</p>
                            <div className="mt-2">
                              <BucketChips
                                options={TEAM_SEATS_MIN_BUCKETS}
```
- `src/pages/SearchResults.jsx:2180` — Permission area

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Permission area</p>
                            <select
                              value={filters.permissionSection || ''}
                              onChange={(e) => updateAdvancedFilter('permissionSection', e.target.value)}
```
- `src/pages/SearchResults.jsx:2206` — Role seats

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Role seats</p>
                            <div className="mt-2">
                              <div className="flex gap-2">
                                <input
```
- `src/pages/SearchResults.jsx:2259` — Export ports

```jsx
                            <p className="text-[11px] font-semibold text-slate-500">Export ports</p>
                            <div className="mt-2">
                              <ChipGroup
                                options={EXPORT_PORT_OPTIONS}
```
- `src/pages/SearchResults.jsx:2282` — Location + radius

```jsx
                          <p className="text-[11px] font-semibold text-slate-500">Location + radius</p>
                          <div className="mt-2 flex gap-2">
                            <input
                              value={geoQuery}
```
- `src/pages/SearchResults.jsx:2322` — Lat: {filters.locationLat \|\| '--'} · Lng: {filters.locationLng \|\| '--'}

```jsx
                            <span>Lat: {filters.locationLat || '--'} · Lng: {filters.locationLng || '--'}</span>
                            <button
                              type="button"
                              onClick={() => setShowMapPreview((prev) => !prev)}
```
- `src/pages/SearchResults.jsx:2351` — Open advanced block to configure supplier/account attributes.

```jsx
                      ) : <p className="text-[11px] text-slate-500">Open advanced block to configure supplier/account attributes.</p>
                    )}
                  </div>
                ) : (
```
- `src/pages/SearchResults.jsx:2355` — Advanced filters are hidden to keep search simple. Use "More filters" when needed.

```jsx
                  <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Advanced filters are hidden to keep search simple. Use "More filters" when needed.</p>
                )}
              </div>

```
- `src/pages/SearchResults.jsx:2360` — Filter guidance

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Filter guidance</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <p>Supplier filters use profile data such as main processes, export ports, and years in business.</p>
                  <p>Distance radius uses coordinates. Use “Use my location” to fill lat/lng quickly. If a supplier has no coordinates, we fall back to country matching.</p>
```
- `src/pages/SearchResults.jsx:2362` — Supplier filters use profile data such as main processes, export ports, and years in business.

```jsx
                  <p>Supplier filters use profile data such as main processes, export ports, and years in business.</p>
                  <p>Distance radius uses coordinates. Use “Use my location” to fill lat/lng quickly. If a supplier has no coordinates, we fall back to country matching.</p>
                  <p>Premium filters are optional. Core filters always remain free and unlimited.</p>
                </div>
```
- `src/pages/SearchResults.jsx:2363` — Distance radius uses coordinates. Use “Use my location” to fill lat/lng quickly. If a supplier has no coordinates, we fall back to country matching.

```jsx
                  <p>Distance radius uses coordinates. Use “Use my location” to fill lat/lng quickly. If a supplier has no coordinates, we fall back to country matching.</p>
                  <p>Premium filters are optional. Core filters always remain free and unlimited.</p>
                </div>
              </div>
```
- `src/pages/SearchResults.jsx:2364` — Premium filters are optional. Core filters always remain free and unlimited.

```jsx
                  <p>Premium filters are optional. Core filters always remain free and unlimited.</p>
                </div>
              </div>

```
- `src/pages/SearchResults.jsx:2369` — Status & presets

```jsx
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status & presets</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2">{upgradePrompt}</p> : null}
```
- `src/pages/SearchResults.jsx:2371` — Run a search to see quota status.

```jsx
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 borderless-shadow rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 borderless-shadow rounded-xl p-2">{alertFeedback}</p> : null}
                </div>
```
- `src/pages/SearchResults.jsx:2377` — Apply preset

```jsx
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Apply preset</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
```
- `src/pages/SearchResults.jsx:2379` — applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer

```jsx
                    <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
```
- `src/pages/SearchResults.jsx:2380` — applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house

```jsx
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
                </div>
```
- `src/pages/SearchResults.jsx:2381` — applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory

```jsx
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
                </div>

```
- `src/pages/SearchResults.jsx:2386` — setManagePresetsOpen((p) => !p)} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Manage presets

```jsx
                  <button type="button" onClick={() => setManagePresetsOpen((p) => !p)} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Manage presets</button>
                  {managePresetsOpen ? (
                    <div className="mt-2 space-y-2">
                      {listLocalPresets().length ? listLocalPresets().map((p) => (
```
- `src/pages/SearchResults.jsx:2393` — applyPreset(p.key)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load

```jsx
                            <button type="button" onClick={() => applyPreset(p.key)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                            <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
```
- `src/pages/SearchResults.jsx:2394` — shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share

```jsx
                            <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
```
- `src/pages/SearchResults.jsx:2395` — createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server

```jsx
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
                        </div>
```
- `src/pages/SearchResults.jsx:2396` — deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete

```jsx
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
                        </div>
                      )) : (
```
- `src/pages/SearchResults.jsx:2406` — Server presets

```jsx
                        <p className="text-xs font-semibold text-slate-500">Server presets</p>
                        <div className="mt-2 space-y-2">
                          {serverPresetsLoading ? (
                            <div className="text-xs text-slate-500">Loading server presets...</div>
```
- `src/pages/SearchResults.jsx:2414` — applyServerPreset(sp)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load

```jsx
                                <button type="button" onClick={() => applyServerPreset(sp)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                                {String(sp.owner_id) === String(sessionUser?.id) ? (
                                  <>
                                    <button type="button" onClick={() => updateServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Save</button>
```
- `src/pages/SearchResults.jsx:2417` — updateServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Save

```jsx
                                    <button type="button" onClick={() => updateServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Save</button>
                                    <button type="button" onClick={() => deleteServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                                  </>
                                ) : null}
```
- `src/pages/SearchResults.jsx:2418` — deleteServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete

```jsx
                                    <button type="button" onClick={() => deleteServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                                  </>
                                ) : null}
                              </div>
```
- `src/pages/SearchResults.jsx:2441` — Save this search as a preset

```jsx
                    <p className="font-semibold text-slate-700 dark:text-slate-100">Save this search as a preset</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
```
- `src/pages/SearchResults.jsx:2443` — savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer

```jsx
                      <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
```
- `src/pages/SearchResults.jsx:2444` — savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house

```jsx
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
```
- `src/pages/SearchResults.jsx:2445` — savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory

```jsx
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
                  </div>
```
- `src/pages/SearchResults.jsx:2446` — setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss

```jsx
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
                  </div>
                ) : null}
```
- `src/pages/SearchResults.jsx:2484` — ({count})

```jsx
                      <span className="text-[11px] opacity-70">({count})</span>
                    </span>
                  </motion.button>
                )
```
- `src/pages/SearchResults.jsx:2571` — - {author.country}

```jsx
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
                              </div>
                              {(specLabel || quoteDeadline || expiresAt) ? (
                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
```
- `src/pages/SearchResults.jsx:2576` — Quote by {quoteDeadline.toLocaleDateString()}

```jsx
                                  {quoteDeadline ? <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">Quote by {quoteDeadline.toLocaleDateString()}</span> : null}
                                  {expiresAt ? (
                                    <span className={`rounded-full px-2 py-1${isExpired ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'}`}>
                                      {isExpired ? 'Expired' : `Expires ${expiresAt.toLocaleDateString()}`}
```
- `src/pages/SearchResults.jsx:2583` — Max suppliers: {maxSuppliers}

```jsx
                                    <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">Max suppliers: {maxSuppliers}</span>
                                  ) : null}
                                </div>
                              ) : null}
```
- `src/pages/SearchResults.jsx:2659` — - {author.country}

```jsx
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">- {String(author.role).replaceAll('_', ' ')}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
```
- `src/pages/SearchResults.jsx:2660` — - {String(author.role).replaceAll('_', ' ')}

```jsx
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">- {String(author.role).replaceAll('_', ' ')}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{p.description || ''}</p>
```
- `src/pages/SearchResults.jsx:2713` — Early verified factories

```jsx
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Early verified factories</p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Premium-only early access list</p>
                {!canEarlyAccess ? (
                  <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
```
- `src/pages/SearchResults.jsx:2714` — Premium-only early access list

```jsx
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Premium-only early access list</p>
                {!canEarlyAccess ? (
                  <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                    Upgrade to Premium to unlock early access to newly verified factories.
```
- `src/pages/SearchResults.jsx:2719` — View Premium options

```jsx
                      <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
                    </div>
                  </div>
                ) : earlyVerifiedError ? (
```
- `src/pages/SearchResults.jsx:2743` — Recently viewed

```jsx
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you - Recorded on Quick View</p>
              <div className="mt-3 space-y-2">
                {recentViews.length ? recentViews.map((row) => (
```
- `src/pages/SearchResults.jsx:2744` — Private to you - Recorded on Quick View

```jsx
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you - Recorded on Quick View</p>
              <div className="mt-3 space-y-2">
                {recentViews.length ? recentViews.map((row) => (
                  <button
```
- `src/pages/SearchResults.jsx:2762` — Open full history

```jsx
                <Link to="/notifications" className="text-xs font-semibold text-[var(--gt-blue)] hover:underline">Open full history</Link>
              </div>
            </div>

```
- `src/pages/SearchResults.jsx:2768` — Advanced filters locked

```jsx
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Advanced filters locked</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">
                  Upgrade to Premium to unlock advanced filters. Core filters remain unlimited on the free plan.
                </p>
```
- `src/pages/SearchResults.jsx:1534` — Search requests, factories, products...

```jsx
                placeholder="Search requests, factories, products..."
                className="w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
```
- `src/pages/SearchResults.jsx:1711` — Country (e.g. Bangladesh)

```jsx
                        placeholder="Country (e.g. Bangladesh)"
                        className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                      />
                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
```
- `src/pages/SearchResults.jsx:1874` — Custom sizes (e.g. Chest:32-40; Waist:28-36)

```jsx
                              placeholder="Custom sizes (e.g. Chest:32-40; Waist:28-36)"
                              disabled={premiumLocked}
                              className="w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
```
- `src/pages/SearchResults.jsx:1898` — Add Pantone (e.g. 19-4052)

```jsx
                              placeholder="Add Pantone (e.g. 19-4052)"
                              disabled={premiumLocked}
                              className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                              onKeyDown={(event) => {
```
- `src/pages/SearchResults.jsx:1982` — Any

```jsx
                              placeholder="Any"
                              disabled={premiumLocked}
                              className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
```
- `src/pages/SearchResults.jsx:2084` — Any

```jsx
                              placeholder="Any"
                              disabled={premiumLocked}
                              className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
```
- `src/pages/SearchResults.jsx:2211` — Role (e.g., manager)

```jsx
                                  placeholder="Role (e.g., manager)"
                                  value={roleSeatDraftRole}
                                  onChange={(e) => setRoleSeatDraftRole(e.target.value)}
                                  disabled={premiumLocked}
```
- `src/pages/SearchResults.jsx:2220` — Seats

```jsx
                                  placeholder="Seats"
                                  value={roleSeatDraftSeats}
                                  onChange={(e) => setRoleSeatDraftSeats(e.target.value)}
                                  disabled={premiumLocked}
```
- `src/pages/SearchResults.jsx:2287` — Search city or country

```jsx
                              placeholder="Search city or country"
                              disabled={premiumLocked}
                              className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
```
- `src/pages/SearchResults.jsx:2752` — Open Quick View

```jsx
                    title="Open Quick View"
                  >
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.product?.title || 'Product'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} - {new Date(row.viewed_at).toLocaleString()}</p>
```
- `src/pages/SearchResults.jsx:336` — (element) <button>

```jsx
          <button
            key={option}
            type="button"
            disabled={disabled}
```
- `src/pages/SearchResults.jsx:370` — (element) <button>

```jsx
          <button
            key={`${optValue || 'any'}-${option.label}`}
            type="button"
            disabled={disabled}
```
- `src/pages/SearchResults.jsx:1495` — (element) <button>

```jsx
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
```
- `src/pages/SearchResults.jsx:1503` — (element) <button>

```jsx
              <button
                type="button"
                onClick={saveAlert}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gt-blue)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95"
```
- `src/pages/SearchResults.jsx:1511` — (element) <button>

```jsx
              <button
                type="button"
                onClick={handleShareClick}
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
```
- `src/pages/SearchResults.jsx:1519` — (element) <Link>

```jsx
              <Link
                to="/notifications"
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
```
- `src/pages/SearchResults.jsx:1541` — (element) <button>

```jsx
            <button
              type="button"
              onClick={runSearch}
              className="rounded-full bg-[var(--gt-blue)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95 disabled:opacity-60"
```
- `src/pages/SearchResults.jsx:1552` — (element) <button>

```jsx
            <button
              type="button"
              onClick={clearCategories}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${category.length ? ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50' : ' bg-[var(--gt-blue)] text-white ring-transparent'}`}
```
- `src/pages/SearchResults.jsx:1560` — (element) <button>

```jsx
              <button
                key={option}
                type="button"
                onClick={() => toggleCategory(option)}
```
- `src/pages/SearchResults.jsx:1579` — (element) <button>

```jsx
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
```
- `src/pages/SearchResults.jsx:1588` — (element) <button>

```jsx
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-auto rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 hover:bg-slate-50 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
```
- `src/pages/SearchResults.jsx:1699` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={() => setProductMoreOpen((prev) => !prev)}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
```
- `src/pages/SearchResults.jsx:1734` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={() => setSupplierMoreOpen((prev) => !prev)}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
```
- `src/pages/SearchResults.jsx:1741` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
```
- `src/pages/SearchResults.jsx:1758` — (element) <button>

```jsx
                          <button
                            key={value || 'any'}
                            type="button"
                            onClick={() => updateCoreFilter('orgType', value)}
```
- `src/pages/SearchResults.jsx:1803` — (element) <button>

```jsx
                      <button
                        type="button"
                        onClick={() => setFilterMode('product')}
                        className={`rounded-full px-3 py-1 ${filterMode === 'product' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
```
- `src/pages/SearchResults.jsx:1810` — (element) <button>

```jsx
                      <button
                        type="button"
                        onClick={() => setFilterMode('supplier')}
                        className={`rounded-full px-3 py-1 ${filterMode === 'supplier' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
```
- `src/pages/SearchResults.jsx:1818` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => (filterMode === 'product' ? setProductAdvancedOpen((prev) => !prev) : setSupplierAdvancedOpen((prev) => !prev))}
                      className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
```
- `src/pages/SearchResults.jsx:1884` — (element) <button>

```jsx
                              <button
                                key={code}
                                type="button"
                                onClick={() => removePantone(code)}
```
- `src/pages/SearchResults.jsx:1908` — (element) <button>

```jsx
                            <button
                              type="button"
                              onClick={() => addPantone(pantoneDraft)}
                              disabled={premiumLocked}
```
- `src/pages/SearchResults.jsx:1956` — (element) <button>

```jsx
                            <button
                              type="button"
                              onClick={() => updateAdvancedFilter('sampleLeadTime', '')}
                              disabled={premiumLocked || !filters.sampleLeadTime}
```
- `src/pages/SearchResults.jsx:2058` — (element) <button>

```jsx
                            <button
                              type="button"
                              onClick={() => updateAdvancedFilter('auditScoreMin', '')}
                              disabled={premiumLocked || !filters.auditScoreMin}
```
- `src/pages/SearchResults.jsx:2226` — (element) <button>

```jsx
                                <button
                                  type="button"
                                  onClick={addRoleSeat}
                                  disabled={premiumLocked || !roleSeatDraftRole}
```
- `src/pages/SearchResults.jsx:2241` — (element) <button>

```jsx
                                        <button
                                          type="button"
                                          onClick={() => updateAdvancedFilter('roleSeats', (filters.roleSeats || []).filter((e) => e.role !== entry.role))}
                                          disabled={premiumLocked}
```
- `src/pages/SearchResults.jsx:2291` — (element) <button>

```jsx
                            <button
                              type="button"
                              onClick={useCurrentLocation}
                              disabled={premiumLocked}
```
- `src/pages/SearchResults.jsx:2305` — (element) <button>

```jsx
                                <button
                                  key={result.id}
                                  type="button"
                                  onClick={() => selectGeoResult(result)}
```
- `src/pages/SearchResults.jsx:2323` — (element) <button>

```jsx
                            <button
                              type="button"
                              onClick={() => setShowMapPreview((prev) => !prev)}
                              className="text-[10px] font-semibold text-[var(--gt-blue)]"
```
- `src/pages/SearchResults.jsx:2379` — (element) <button>

```jsx
                    <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
```
- `src/pages/SearchResults.jsx:2380` — (element) <button>

```jsx
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
                </div>
```
- `src/pages/SearchResults.jsx:2381` — (element) <button>

```jsx
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
                </div>

```
- `src/pages/SearchResults.jsx:2386` — (element) <button>

```jsx
                  <button type="button" onClick={() => setManagePresetsOpen((p) => !p)} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Manage presets</button>
                  {managePresetsOpen ? (
                    <div className="mt-2 space-y-2">
                      {listLocalPresets().length ? listLocalPresets().map((p) => (
```
- `src/pages/SearchResults.jsx:2393` — (element) <button>

```jsx
                            <button type="button" onClick={() => applyPreset(p.key)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                            <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
```
- `src/pages/SearchResults.jsx:2394` — (element) <button>

```jsx
                            <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
```
- `src/pages/SearchResults.jsx:2395` — (element) <button>

```jsx
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
                        </div>
```
- `src/pages/SearchResults.jsx:2396` — (element) <button>

```jsx
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
                        </div>
                      )) : (
```
- `src/pages/SearchResults.jsx:2414` — (element) <button>

```jsx
                                <button type="button" onClick={() => applyServerPreset(sp)} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                                {String(sp.owner_id) === String(sessionUser?.id) ? (
                                  <>
                                    <button type="button" onClick={() => updateServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Save</button>
```
- `src/pages/SearchResults.jsx:2417` — (element) <button>

```jsx
                                    <button type="button" onClick={() => updateServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Save</button>
                                    <button type="button" onClick={() => deleteServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                                  </>
                                ) : null}
```
- `src/pages/SearchResults.jsx:2418` — (element) <button>

```jsx
                                    <button type="button" onClick={() => deleteServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                                  </>
                                ) : null}
                              </div>
```
- `src/pages/SearchResults.jsx:2428` — (element) <button>

```jsx
                            <button type="button" onClick={() => {
                              const name = window.prompt('Preset name')
                              if (name) createServerPresetFromCurrent(name)
                            }} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Save current as server preset</button>
```
- `src/pages/SearchResults.jsx:2443` — (element) <button>

```jsx
                      <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
```
- `src/pages/SearchResults.jsx:2444` — (element) <button>

```jsx
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
```
- `src/pages/SearchResults.jsx:2445` — (element) <button>

```jsx
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-[var(--gt-blue)] px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
                  </div>
```
- `src/pages/SearchResults.jsx:2446` — (element) <button>

```jsx
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
                  </div>
                ) : null}
```
- `src/pages/SearchResults.jsx:2540` — (element) <Link>

```jsx
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || 'Buyer'}
                                </Link>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600 dark:bg-white/10 dark:text-slate-200">
```
- `src/pages/SearchResults.jsx:2596` — (element) <Link>

```jsx
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                Open profile
                              </Link>
                              <button
```
- `src/pages/SearchResults.jsx:2599` — (element) <button>

```jsx
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'buyer', {
                                  type: 'buyer_request',
```
- `src/pages/SearchResults.jsx:2636` — (element) <Link>

```jsx
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || p.title || 'Company'}
                                </Link>
                                {author.verified ? (
```
- `src/pages/SearchResults.jsx:2677` — (element) <Link>

```jsx
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                View profile
                              </Link>
                              <button
```
- `src/pages/SearchResults.jsx:2680` — (element) <button>

```jsx
                              <button
                                type="button"
                                onClick={() => setQuickViewItem({ ...p, author })}
                                className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
```
- `src/pages/SearchResults.jsx:2687` — (element) <button>

```jsx
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'company', {
                                  type: 'product',
```
- `src/pages/SearchResults.jsx:2719` — (element) <Link>

```jsx
                      <Link to="/pricing" className="text-[11px] font-semibold text-[var(--gt-blue)] hover:underline">View Premium options</Link>
                    </div>
                  </div>
                ) : earlyVerifiedError ? (
```
- `src/pages/SearchResults.jsx:2727` — (element) <Link>

```jsx
                      <Link
                        key={row.id}
                        to={roleToProfileRoute(row.role, row.id)}
                        className="block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
```
- `src/pages/SearchResults.jsx:2747` — (element) <button>

```jsx
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setQuickViewItem({ ...row.product, author: row.author })}
```
- `src/pages/SearchResults.jsx:2762` — (element) <Link>

```jsx
                <Link to="/notifications" className="text-xs font-semibold text-[var(--gt-blue)] hover:underline">Open full history</Link>
              </div>
            </div>

```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /users/verified/early (src/pages/SearchResults.jsx:507) | /api/users -> server/routes/userRoutes.js:112 | GET /verified/early (server/routes/userRoutes.js:28) | - | listEarlyVerifiedFactoriesController |
| POST /search/alerts (src/pages/SearchResults.jsx:613) | /api/search -> server/routes/searchRoutes.js:130 | POST /alerts (server/routes/searchRoutes.js:7) | server/controllers/notificationController.js | createSearchAlert |
| GET /requirements/search?${qsRequests} (src/pages/SearchResults.jsx:666) | /api/requirements -> server/routes/requirementRoutes.js:113 | - | - | - |
| GET /products/search?${qsProducts} (src/pages/SearchResults.jsx:667) | /api/products -> server/routes/productRoutes.js:119 | - | - | - |
| GET /requirements/search?${qsRequests} (src/pages/SearchResults.jsx:848) | /api/requirements -> server/routes/requirementRoutes.js:113 | - | - | - |
| GET /products/search?${qsProducts} (src/pages/SearchResults.jsx:849) | /api/products -> server/routes/productRoutes.js:119 | - | - | - |
| GET /products/views/me?cursor=0&limit=5 (src/pages/SearchResults.jsx:984) | /api/products -> server/routes/productRoutes.js:119 | - | - | - |
| GET /ratings/search?profile_keys=${encodeURIComponent(keys.join( (src/pages/SearchResults.jsx:998) | /api/ratings -> server/routes/ratingsRoutes.js:137 | - | - | - |
| GET /geo/search?q=${encodeURIComponent(q)} (src/pages/SearchResults.jsx:1066) | /api/geo -> server/routes/geoRoutes.js:143 | - | - | - |
| POST /search/alerts (src/pages/SearchResults.jsx:1128) | /api/search -> server/routes/searchRoutes.js:130 | POST /alerts (server/routes/searchRoutes.js:7) | server/controllers/notificationController.js | createSearchAlert |
| GET /presets (src/pages/SearchResults.jsx:1287) | /api/presets -> server/routes/presetsRoutes.js:131 | GET / (server/routes/presetsRoutes.js:13) | - | listPresetsController |
| POST /presets (src/pages/SearchResults.jsx:1303) | /api/presets -> server/routes/presetsRoutes.js:131 | POST / (server/routes/presetsRoutes.js:14) | - | createPresetController |
| POST /presets (src/pages/SearchResults.jsx:1326) | /api/presets -> server/routes/presetsRoutes.js:131 | POST / (server/routes/presetsRoutes.js:14) | - | createPresetController |
| PATCH /presets/${encodeURIComponent(presetId)} (src/pages/SearchResults.jsx:1374) | /api/presets -> server/routes/presetsRoutes.js:131 | - | - | - |
| DELETE /presets/${encodeURIComponent(presetId)} (src/pages/SearchResults.jsx:1390) | /api/presets -> server/routes/presetsRoutes.js:131 | - | - | - |
| POST /workflow/journeys (src/pages/SearchResults.jsx:1420) | /api/workflow -> server/routes/workflowLifecycleRoutes.js:153 | POST /journeys (server/routes/workflowLifecycleRoutes.js:12) | - | createJourney |
| GET /workflow/journeys/${encodeURIComponent(journey.id)}/transition (src/pages/SearchResults.jsx:1432) | /api/workflow -> server/routes/workflowLifecycleRoutes.js:153 | - | - | - |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/SearchResults.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

