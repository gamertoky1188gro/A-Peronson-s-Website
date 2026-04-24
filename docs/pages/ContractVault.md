# ContractVault - Route `/contracts`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/ContractVault.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/ContractVault.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_ContractVault.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../components/AccessDeniedState (src/pages/ContractVault.jsx:30)
- ../lib/auth (src/pages/ContractVault.jsx:31)
- ../lib/events (src/pages/ContractVault.jsx:32)
- ../components/JourneyTimeline (src/pages/ContractVault.jsx:33)

### 2.2 Structural section tags in JSX

_No <header/main/section/aside/footer/nav> tags detected by the heuristic extractor._

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

#### `src/pages/ContractVault.jsx:180`

```jsx
    <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1${done ? 'bg-[#E8F3FF] text-[#0A66C2] ring-[#BBD8FF]' : 'bg-white text-slate-600 ring-slate-200'}`}>
      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full${done ? 'bg-[#0A66C2] text-white' : 'bg-slate-100 text-slate-500'}`}>
        {done ? '\u2713' : '\u2022'}
      </span>
```

**Raw class strings detected (best effort):**

- `bg-[#E8F3FF] text-[#0A66C2] ring-[#BBD8FF]`
- `bg-white text-slate-600 ring-slate-200`
- `bg-[#0A66C2] text-white`
- `bg-slate-100 text-slate-500`
- `\u2713`
- `\u2022`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#E8F3FF]` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
  - `bg-[#0A66C2]` — Background color/surface.
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-[#BBD8FF]` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `\u2713` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `\u2022` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:181`

```jsx
      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full${done ? 'bg-[#0A66C2] text-white' : 'bg-slate-100 text-slate-500'}`}>
        {done ? '\u2713' : '\u2022'}
      </span>
      <span>{label}</span>
```

**Raw class strings detected (best effort):**

- `bg-[#0A66C2] text-white`
- `bg-slate-100 text-slate-500`
- `\u2713`
- `\u2022`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
  - `bg-slate-100` — Background color/surface.
- **Other:**
  - `\u2713` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `\u2022` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:196`

```jsx
      className={`w-full rounded-2xl p-4 text-left transition ring-1${active ? 'bg-indigo-50/60 text-slate-900 ring-indigo-200 shadow-sm dark:bg-white/5 dark:text-slate-100 dark:ring-[#38bdf8]/35' : 'bg-white text-slate-900 ring-slate-200/70 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-white/5'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
```

**Raw class strings detected (best effort):**

- `bg-indigo-50/60 text-slate-900 ring-indigo-200 shadow-sm dark:bg-white/5 dark:text-slate-100 dark:ring-[#38bdf8]/35`
- `bg-white text-slate-900 ring-slate-200/70 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-white/5`
- `flex items-start justify-between gap-4`
- `min-w-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-50/60` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-indigo-200` — Outline ring (often used instead of borders in dark mode).
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-[#38bdf8]/35` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:198`

```jsx
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">{contract.contract_number || contract.id}</div>
```

**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-4`
- `min-w-0`
- `flex items-center gap-2`
- `truncate text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:199`

```jsx
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">{contract.contract_number || contract.id}</div>
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1${statusClass(status)}`}>
```

**Raw class strings detected (best effort):**

- `min-w-0`
- `flex items-center gap-2`
- `truncate text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:200`

```jsx
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">{contract.contract_number || contract.id}</div>
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1${statusClass(status)}`}>
              {toLabel(status)}
```

**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `truncate text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:201`

```jsx
            <div className="truncate text-sm font-semibold text-slate-900">{contract.contract_number || contract.id}</div>
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1${statusClass(status)}`}>
              {toLabel(status)}
            </span>
```

**Raw class strings detected (best effort):**

- `truncate text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:202`

```jsx
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1${statusClass(status)}`}>
              {toLabel(status)}
            </span>
          </div>
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/ContractVault.jsx:206`

```jsx
          <div className="mt-1 truncate text-xs text-slate-600">{safeDash(contract.title)}</div>
          <div className="mt-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">-</span>
            <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
```

**Raw class strings detected (best effort):**

- `mt-1 truncate text-xs text-slate-600`
- `mt-2 text-xs text-slate-600`
- `font-semibold text-slate-700`
- `mx-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:207`

```jsx
<div className="mt-2 text-xs text-slate-600">
  <span className="font-semibold text-slate-700">Buyer:</span>{" "}
  {safeDash(contract.buyer_name)} <span className="mx-1">-</span>
  <span className="font-semibold text-slate-700">Factory:</span>{" "}
  {safeDash(contract.factory_name)}
</div>
```

**Raw class strings detected (best effort):**

- `mt-2 text-xs text-slate-600`
- `font-semibold text-slate-700`
- `mx-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:208`

```jsx
            <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">-</span>
            <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
          </div>
        </div>
```

**Raw class strings detected (best effort):**

- `font-semibold text-slate-700`
- `mx-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:209`

```jsx
            <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
          </div>
        </div>

```

**Raw class strings detected (best effort):**

- `font-semibold text-slate-700`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:213`

```jsx
        <div className="shrink-0 text-right text-xs text-slate-600">
          <div>{(contract.updated_at || contract.created_at || '').slice(0, 10) || '\u2014'}</div>
          <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
            Next: {flow.nextAction}
```

**Raw class strings detected (best effort):**

- `shrink-0 text-right text-xs text-slate-600`
- `).slice(0, 10) || `
- `mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-right` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `).slice(0,` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `10)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `||` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:215`

```jsx
          <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
            Next: {flow.nextAction}
          </div>
        </div>
```

**Raw class strings detected (best effort):**

- `mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:221`

```jsx
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Buyer: {contract.buyer_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Factory: {contract.factory_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
```

**Raw class strings detected (best effort):**

- `mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-600`
- `inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/ContractVault.jsx:222`

```jsx
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Buyer: {contract.buyer_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Factory: {contract.factory_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
```

**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/ContractVault.jsx:223`

```jsx
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Factory: {contract.factory_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
    </button>
```

**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/ContractVault.jsx:224`

```jsx
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
    </button>
  )
```

**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/ContractVault.jsx:233`

```jsx
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-auto rounded-t-3xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
```

**Raw class strings detected (best effort):**

- `fixed inset-0 z-50 lg:hidden`
- `absolute inset-0 bg-slate-900/30`
- `absolute inset-x-0 bottom-0 max-h-[86vh] overflow-auto rounded-t-3xl bg-white p-5 shadow-2xl`
- `mb-4 flex items-center justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `fixed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-x-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-h-[86vh]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/30` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-t-3xl` — Corner radius.
  - `shadow-2xl` — Drop shadow depth (elevation).
- **Responsive variants:**
  - `lg:hidden` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:234`

```jsx
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-auto rounded-t-3xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Contract details</div>
```

**Raw class strings detected (best effort):**

- `absolute inset-0 bg-slate-900/30`
- `absolute inset-x-0 bottom-0 max-h-[86vh] overflow-auto rounded-t-3xl bg-white p-5 shadow-2xl`
- `mb-4 flex items-center justify-between`
- `text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-x-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-h-[86vh]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/30` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-t-3xl` — Corner radius.
  - `shadow-2xl` — Drop shadow depth (elevation).

#### `src/pages/ContractVault.jsx:235`

```jsx
      <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-auto rounded-t-3xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Contract details</div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
```

**Raw class strings detected (best effort):**

- `absolute inset-x-0 bottom-0 max-h-[86vh] overflow-auto rounded-t-3xl bg-white p-5 shadow-2xl`
- `mb-4 flex items-center justify-between`
- `text-sm font-semibold text-slate-900`
- `rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-x-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-h-[86vh]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-t-3xl` — Corner radius.
  - `shadow-2xl` — Drop shadow depth (elevation).
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:236`

```jsx
<div className="mb-4 flex items-center justify-between">
  <div className="text-sm font-semibold text-slate-900">Contract details</div>
  <button
    type="button"
    onClick={onClose}
    className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100"
  >
    Close
  </button>
</div>
```

**Raw class strings detected (best effort):**

- `mb-4 flex items-center justify-between`
- `text-sm font-semibold text-slate-900`
- `rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:237`

```jsx
          <div className="text-sm font-semibold text-slate-900">Contract details</div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
        </div>
        {children}
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:238`

```jsx
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
        </div>
        {children}
      </div>
```

**Raw class strings detected (best effort):**

- `rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:651`

```jsx
    <div className="rounded-2xl borderless-shadow bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-5`
- `flex items-start justify-between gap-4`
- `min-w-0`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:652`

```jsx
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-lg font-bold text-slate-900">{selected.contract_number || selected.id}</div>
```

**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-4`
- `min-w-0`
- `flex items-center gap-2`
- `truncate text-lg font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:653`

```jsx
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-lg font-bold text-slate-900">{selected.contract_number || selected.id}</div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
```

**Raw class strings detected (best effort):**

- `min-w-0`
- `flex items-center gap-2`
- `truncate text-lg font-bold text-slate-900`
- `pending_signature`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Other:**
  - `pending_signature` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:654`

```jsx
          <div className="flex items-center gap-2">
            <div className="truncate text-lg font-bold text-slate-900">{selected.contract_number || selected.id}</div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
              {toLabel(selected.lifecycle_status || 'pending_signature')}
```

**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `truncate text-lg font-bold text-slate-900`
- `pending_signature`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Other:**
  - `pending_signature` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:655`

```jsx
            <div className="truncate text-lg font-bold text-slate-900">{selected.contract_number || selected.id}</div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
              {toLabel(selected.lifecycle_status || 'pending_signature')}
            </span>
```

**Raw class strings detected (best effort):**

- `truncate text-lg font-bold text-slate-900`
- `pending_signature`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Other:**
  - `pending_signature` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:656`

```jsx
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
              {toLabel(selected.lifecycle_status || 'pending_signature')}
            </span>
          </div>
```

**Raw class strings detected (best effort):**

- `pending_signature`

**Utility breakdown (grouped):**

- **Other:**
  - `pending_signature` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:660`

```jsx
          <div className="mt-1 text-sm text-slate-600">{safeDash(selected.title)}</div>
          <div className="mt-3 text-sm text-slate-700">
            <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">-</span>
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-600`
- `mt-3 text-sm text-slate-700`
- `font-semibold`
- `mx-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:661`

```jsx
<div className="mt-3 text-sm text-slate-700">
  <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)}{" "}
  <span className="mx-1">-</span>
  <span className="font-semibold">Factory:</span>{" "}
  {safeDash(selected.factory_name)}
</div>
```

**Raw class strings detected (best effort):**

- `mt-3 text-sm text-slate-700`
- `font-semibold`
- `mx-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:662`

```jsx
            <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">-</span>
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
          </div>
        </div>
```

**Raw class strings detected (best effort):**

- `font-semibold`
- `mx-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:663`

```jsx
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
          </div>
        </div>
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
```

**Raw class strings detected (best effort):**

- `font-semibold`
- `shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#E8F3FF]` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#D9ECFF]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:666`

```jsx
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
      </div>

      {actionError ? <div className="mt-4 rounded-xl borderless-shadow bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}
```

**Raw class strings detected (best effort):**

- `shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]`
- `mt-4 rounded-xl borderless-shadow bg-rose-50 p-3 text-sm font-semibold text-rose-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#E8F3FF]` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
  - `bg-rose-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-[#D9ECFF]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:669`

```jsx
{
  actionError ? (
    <div className="mt-4 rounded-xl borderless-shadow bg-rose-50 p-3 text-sm font-semibold text-rose-700">
      {actionError}
    </div>
  ) : null;
}
<div className="mt-4">
  <JourneyTimeline
    title="Journey Timeline"
    matchId={
      selected.match_id ||
      journeyParams.get("journey_match_id") ||
      journeyParams.get("match_id") ||
      ""
    }
  />
</div>;
```

**Raw class strings detected (best effort):**

- `mt-4 rounded-xl borderless-shadow bg-rose-50 p-3 text-sm font-semibold text-rose-700`
- `mt-4`
- `Journey Timeline`
- `journey_match_id`
- `match_id`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Other:**
  - `Journey` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Timeline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `journey_match_id` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `match_id` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:670`

```jsx
      <div className="mt-4">
        <JourneyTimeline title="Journey Timeline" matchId={selected.match_id || journeyParams.get('journey_match_id') || journeyParams.get('match_id') || ''} />
      </div>
      {selected.requirement_id ? (
```

**Raw class strings detected (best effort):**

- `mt-4`
- `Journey Timeline`
- `journey_match_id`
- `match_id`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Journey` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Timeline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `journey_match_id` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `match_id` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:674`

```jsx
        <div className="mt-2">
          <Link to={`/search?requirementId=${encodeURIComponent(selected.requirement_id)}`} className="text-xs font-semibold text-[#0A66C2] hover:underline">Open source requirement</Link>
        </div>
      ) : null}
```

**Raw class strings detected (best effort):**

- `mt-2`
- `text-xs font-semibold text-[#0A66C2] hover:underline`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:675`

```jsx
          <Link to={`/search?requirementId=${encodeURIComponent(selected.requirement_id)}`} className="text-xs font-semibold text-[#0A66C2] hover:underline">Open source requirement</Link>
        </div>
      ) : null}
      {!hasRecordedCall ? (
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#0A66C2] hover:underline`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:679`

```jsx
        <div className="mt-4 rounded-xl borderless-shadow bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Video calls are recommended before finalizing contracts. No recorded call is linked to this contract yet.</span>
            <Link to="/chat" className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500">
```

**Raw class strings detected (best effort):**

- `mt-4 rounded-xl borderless-shadow bg-amber-50 p-3 text-sm font-semibold text-amber-900`
- `flex flex-wrap items-center justify-between gap-3`
- `rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-900` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `bg-amber-600` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-amber-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:680`

```jsx
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Video calls are recommended before finalizing contracts. No recorded call is linked to this contract yet.</span>
            <Link to="/chat" className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500">
              Open chat
```

**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-3`
- `rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-600` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-amber-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:682`

```jsx
            <Link to="/chat" className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500">
              Open chat
            </Link>
          </div>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-600` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-amber-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:689`

```jsx
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <StepPill done={selectedFlow.stepState.draft_creation} label="Draft" />
        <StepPill done={selectedFlow.stepState.buyer_signature} label="Buyer sign" />
        <StepPill done={selectedFlow.stepState.factory_signature} label="Factory sign" />
```

**Raw class strings detected (best effort):**

- `mt-5 flex flex-wrap items-center gap-2`
- `Draft`
- `Buyer sign`
- `Factory sign`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Draft` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `sign` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Factory` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:697`

```jsx
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl borderless-shadow bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Signatures</div>
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
```

**Raw class strings detected (best effort):**

- `mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2`
- `rounded-2xl borderless-shadow bg-white p-4`
- `text-sm font-semibold text-slate-900`
- `mt-2 text-sm text-slate-700`
- `font-semibold`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:698`

```jsx
        <div className="rounded-2xl borderless-shadow bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Signatures</div>
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-4`
- `text-sm font-semibold text-slate-900`
- `mt-2 text-sm text-slate-700`
- `font-semibold`
- `text-xs text-slate-500`
- `mt-1 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:699`

```jsx
          <div className="text-sm font-semibold text-slate-900">Signatures</div>
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          {!hasAcceptedProof ? (
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `mt-2 text-sm text-slate-700`
- `font-semibold`
- `text-xs text-slate-500`
- `mt-1 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:700`

```jsx
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          {!hasAcceptedProof ? (
            <div className="mt-3 rounded-lg borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-700`
- `font-semibold`
- `text-xs text-slate-500`
- `mt-1 text-sm text-slate-700`
- `mt-3 rounded-lg borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-amber-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:701`

```jsx
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          {!hasAcceptedProof ? (
            <div className="mt-3 rounded-lg borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
              Warning: No accepted payment proof yet. You may continue, but proof is strongly recommended for safety.
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700`
- `font-semibold`
- `text-xs text-slate-500`
- `mt-3 rounded-lg borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-amber-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:703`

```jsx
            <div className="mt-3 rounded-lg borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
              Warning: No accepted payment proof yet. You may continue, but proof is strongly recommended for safety.
            </div>
          ) : null}
```

**Raw class strings detected (best effort):**

- `mt-3 rounded-lg borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:707`

```jsx
          <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                disabled={Boolean(selectedActionBlockers.buyerSign) || saving}
```

**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-1 gap-2`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:716`

```jsx
                className="rounded-xl bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
              >
                Buyer sign
              </button>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `disabled:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:text-slate-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:720`

```jsx
            {selectedActionBlockers.buyerSign ? <div className="text-xs text-amber-700">{selectedActionBlockers.buyerSign}</div> : null}

              <button
                type="button"
```

**Raw class strings detected (best effort):**

- `text-xs text-amber-700`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:730`

```jsx
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0A66C2] ring-1 ring-[#BBD8FF] hover:bg-[#F6FAFF] disabled:bg-slate-50 disabled:text-slate-400 disabled:ring-slate-200"
              >
                Factory sign
              </button>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0A66C2] ring-1 ring-[#BBD8FF] hover:bg-[#F6FAFF] disabled:bg-slate-50 disabled:text-slate-400 disabled:ring-slate-200`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-[#BBD8FF]` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-[#F6FAFF]` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:ring-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:755`

```jsx
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400"
            >
              Start e-sign session
            </button>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:759`

```jsx
            {selectedActionBlockers.factorySign ? <div className="text-xs text-amber-700">{selectedActionBlockers.factorySign}</div> : null}
          </div>
        </div>

```

**Raw class strings detected (best effort):**

- `text-xs text-amber-700`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:763`

```jsx
        <div className="rounded-2xl borderless-shadow bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Artifact (PDF)</div>
          <div className="mt-2 text-sm text-slate-700">Status: <span className="font-semibold">{selected.artifact?.status || 'draft'}</span></div>
          <div className="mt-1 text-xs text-slate-500">PDF generates automatically after both signatures.</div>
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-4`
- `text-sm font-semibold text-slate-900`
- `mt-2 text-sm text-slate-700`
- `font-semibold`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:764`

```jsx
          <div className="text-sm font-semibold text-slate-900">Artifact (PDF)</div>
          <div className="mt-2 text-sm text-slate-700">Status: <span className="font-semibold">{selected.artifact?.status || 'draft'}</span></div>
          <div className="mt-1 text-xs text-slate-500">PDF generates automatically after both signatures.</div>

```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `mt-2 text-sm text-slate-700`
- `font-semibold`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:765`

```jsx
          <div className="mt-2 text-sm text-slate-700">Status: <span className="font-semibold">{selected.artifact?.status || 'draft'}</span></div>
          <div className="mt-1 text-xs text-slate-500">PDF generates automatically after both signatures.</div>

          <div className="mt-4 grid grid-cols-1 gap-2">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-700`
- `font-semibold`
- `mt-1 text-xs text-slate-500`
- `mt-4 grid grid-cols-1 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:766`

```jsx
          <div className="mt-1 text-xs text-slate-500">PDF generates automatically after both signatures.</div>

          <div className="mt-4 grid grid-cols-1 gap-2">
              <button
```

**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-500`
- `mt-4 grid grid-cols-1 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:768`

```jsx
          <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                disabled={Boolean(selectedActionBlockers.lock) || saving}
```

**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-1 gap-2`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:777`

```jsx
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400"
              >
                Lock PDF
              </button>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:781`

```jsx
            {selectedActionBlockers.lock ? <div className="text-xs text-amber-700">{selectedActionBlockers.lock}</div> : null}

            <button
              type="button"
```

**Raw class strings detected (best effort):**

- `text-xs text-amber-700`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:791`

```jsx
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
            >
              Archive
            </button>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `disabled:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:text-slate-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:795`

```jsx
            {selectedActionBlockers.archive ? <div className="text-xs text-amber-700">{selectedActionBlockers.archive}</div> : null}

            {canDownload
              ? <a href={downloadUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#0A66C2] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#0959A8]">Download PDF</a>
```

**Raw class strings detected (best effort):**

- `text-xs text-amber-700`
- `rounded-xl bg-[#0A66C2] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#0959A8]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#0959A8]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:798`

```jsx
              ? <a href={downloadUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#0A66C2] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#0959A8]">Download PDF</a>
              : <button type="button" disabled className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Download (not ready)</button>}
          </div>
        </div>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-[#0A66C2] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#0959A8]`
- `rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
  - `bg-slate-200` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#0959A8]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:799`

```jsx
              : <button type="button" disabled className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Download (not ready)</button>}
          </div>
        </div>
      </div>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-200` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/ContractVault.jsx:804`

```jsx
      <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4 dark:bg-slate-900/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Banking references (optional)</div>
```

**Raw class strings detected (best effort):**

- `mt-5 rounded-2xl borderless-shadow bg-white p-4 dark:bg-slate-900/50`
- `flex items-start justify-between gap-4`
- `text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:805`

```jsx
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Banking references (optional)</div>
            <div className="mt-1 text-xs text-slate-500">For fraud prevention only. No direct payments are processed on-platform.</div>
```

**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-4`
- `text-sm font-semibold text-slate-900`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:807`

```jsx
            <div className="text-sm font-semibold text-slate-900">Banking references (optional)</div>
            <div className="mt-1 text-xs text-slate-500">For fraud prevention only. No direct payments are processed on-platform.</div>
          </div>
          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `mt-1 text-xs text-slate-500`
- `shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:808`

```jsx
            <div className="mt-1 text-xs text-slate-500">For fraud prevention only. No direct payments are processed on-platform.</div>
          </div>
          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {canViewBankingReferences(currentUser, selected) ? 'Visible' : 'Masked'}
```

**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-500`
- `shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700`
- `Visible`
- `Masked`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Visible` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Masked` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:810`

```jsx
          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {canViewBankingReferences(currentUser, selected) ? 'Visible' : 'Masked'}
          </div>
        </div>
```

**Raw class strings detected (best effort):**

- `shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700`
- `Visible`
- `Masked`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Visible` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Masked` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:815`

```jsx
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
          <div>Bank name: {canViewBankingReferences(currentUser, selected) ? safeDash(selected.bank_name) : maskValue(selected.bank_name)}</div>
          <div>Beneficiary: {canViewBankingReferences(currentUser, selected) ? safeDash(selected.beneficiary_name) : maskValue(selected.beneficiary_name)}</div>
          <div>Transaction reference: {canViewBankingReferences(currentUser, selected) ? safeDash(selected.transaction_reference) : maskValue(selected.transaction_reference)}</div>
```

**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:822`

```jsx
      <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4 dark:bg-slate-900/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Payment proof workflow</div>
```

**Raw class strings detected (best effort):**

- `mt-5 rounded-2xl borderless-shadow bg-white p-4 dark:bg-slate-900/50`
- `flex items-start justify-between gap-4`
- `text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:823`

```jsx
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Payment proof workflow</div>
            <div className="mt-1 text-xs text-slate-500">Submit bank transfer or LC documents. Seller review sets status, disputes trigger internal admin review.</div>
```

**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-4`
- `text-sm font-semibold text-slate-900`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:825`

```jsx
            <div className="text-sm font-semibold text-slate-900">Payment proof workflow</div>
            <div className="mt-1 text-xs text-slate-500">Submit bank transfer or LC documents. Seller review sets status, disputes trigger internal admin review.</div>
          </div>
          <button type="button" onClick={() => loadPaymentProofs(selected.id)} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `mt-1 text-xs text-slate-500`
- `rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:826`

```jsx
            <div className="mt-1 text-xs text-slate-500">Submit bank transfer or LC documents. Seller review sets status, disputes trigger internal admin review.</div>
          </div>
          <button type="button" onClick={() => loadPaymentProofs(selected.id)} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
            Refresh
```

**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-500`
- `rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:828`

```jsx
          <button type="button" onClick={() => loadPaymentProofs(selected.id)} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
            Refresh
          </button>
        </div>
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

#### `src/pages/ContractVault.jsx:833`

```jsx
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-600">Proof type</label>
          <div />
          <select
```

**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2`
- `text-xs font-semibold text-slate-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:834`

```jsx
          <label className="text-xs font-semibold text-slate-600">Proof type</label>
          <div />
          <select
            value={paymentForm.type}
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:839`

```jsx
            className="rounded-xl borderless-shadow px-3 py-2 text-sm"
          >
            <option value="bank_transfer">Bank transfer</option>
            <option value="lc">Letter of credit (LC)</option>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `bank_transfer`
- `lc`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Other:**
  - `bank_transfer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `lc` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:848`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Transaction reference" value={paymentForm.transaction_reference} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_reference: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Bank name" value={paymentForm.bank_name} onChange={(e) => setPaymentForm((p) => ({ ...p, bank_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Sender account name" value={paymentForm.sender_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, sender_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:849`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Bank name" value={paymentForm.bank_name} onChange={(e) => setPaymentForm((p) => ({ ...p, bank_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Sender account name" value={paymentForm.sender_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, sender_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.transaction_date} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:850`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Sender account name" value={paymentForm.sender_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, sender_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.transaction_date} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
              <div className="flex gap-2">
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:851`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.transaction_date} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `flex gap-2`
- `flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:852`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.transaction_date} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `flex gap-2`
- `flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm`
- `w-24 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-1` — Flex layout.
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:853`

```jsx
<div className="flex gap-2">
  <input
    className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm"
    placeholder="Amount"
    value={paymentForm.amount}
    onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))}
  />
  <input
    className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm"
    placeholder="Currency"
    value={paymentForm.currency}
    onChange={(e) =>
      setPaymentForm((p) => ({ ...p, currency: e.target.value }))
    }
  />
</div>
```

**Raw class strings detected (best effort):**

- `flex gap-2`
- `flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm`
- `w-24 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-1` — Flex layout.
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:854`

```jsx
                <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
```

**Raw class strings detected (best effort):**

- `flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm`
- `w-24 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:855`

```jsx
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
          ) : (
```

**Raw class strings detected (best effort):**

- `w-24 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:860`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="LC number" value={paymentForm.lc_number} onChange={(e) => setPaymentForm((p) => ({ ...p, lc_number: e.target.value }))} />
              <div className="flex flex-wrap gap-2">
                <select
                  value={paymentForm.lc_type}
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:861`

```jsx
              <div className="flex flex-wrap gap-2">
                <select
                  value={paymentForm.lc_type}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, lc_type: e.target.value }))}
```

**Raw class strings detected (best effort):**

- `flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:865`

```jsx
                  className="rounded-xl borderless-shadow px-3 py-2 text-sm"
                >
                  <option value="sight">Sight LC</option>
                  <option value="usance">Usance LC</option>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `sight`
- `usance`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Other:**
  - `sight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `usance` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:875`

```jsx
                      className="rounded-xl borderless-shadow px-3 py-2 text-sm"
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `30`
- `60`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Other:**
  - `30` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `60` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:885`

```jsx
                        className="w-32 rounded-xl borderless-shadow px-3 py-2 text-sm"
                        placeholder="Days"
                        value={paymentForm.usance_custom_days}
                        onChange={(e) => setPaymentForm((p) => ({ ...p, usance_custom_days: e.target.value }))}
```

**Raw class strings detected (best effort):**

- `w-32 rounded-xl borderless-shadow px-3 py-2 text-sm`
- `Days`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Other:**
  - `Days` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:894`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Issuing bank" value={paymentForm.issuing_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, issuing_bank: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Advising bank" value={paymentForm.advising_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, advising_bank: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Applicant name" value={paymentForm.applicant_name} onChange={(e) => setPaymentForm((p) => ({ ...p, applicant_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:895`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Advising bank" value={paymentForm.advising_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, advising_bank: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Applicant name" value={paymentForm.applicant_name} onChange={(e) => setPaymentForm((p) => ({ ...p, applicant_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.issue_date} onChange={(e) => setPaymentForm((p) => ({ ...p, issue_date: e.target.value }))} />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:896`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Applicant name" value={paymentForm.applicant_name} onChange={(e) => setPaymentForm((p) => ({ ...p, applicant_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.issue_date} onChange={(e) => setPaymentForm((p) => ({ ...p, issue_date: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.expiry_date} onChange={(e) => setPaymentForm((p) => ({ ...p, expiry_date: e.target.value }))} />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:897`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.issue_date} onChange={(e) => setPaymentForm((p) => ({ ...p, issue_date: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.expiry_date} onChange={(e) => setPaymentForm((p) => ({ ...p, expiry_date: e.target.value }))} />
              <div className="flex gap-2">
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:898`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.issue_date} onChange={(e) => setPaymentForm((p) => ({ ...p, issue_date: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.expiry_date} onChange={(e) => setPaymentForm((p) => ({ ...p, expiry_date: e.target.value }))} />
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `flex gap-2`
- `flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:899`

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.expiry_date} onChange={(e) => setPaymentForm((p) => ({ ...p, expiry_date: e.target.value }))} />
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm`
- `flex gap-2`
- `flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm`
- `w-24 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-1` — Flex layout.
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:900`

```jsx
<div className="flex gap-2">
  <input
    className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm"
    placeholder="Amount"
    value={paymentForm.amount}
    onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))}
  />
  <input
    className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm"
    placeholder="Currency"
    value={paymentForm.currency}
    onChange={(e) =>
      setPaymentForm((p) => ({ ...p, currency: e.target.value }))
    }
  />
</div>
```

**Raw class strings detected (best effort):**

- `flex gap-2`
- `flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm`
- `w-24 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-1` — Flex layout.
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:901`

```jsx
                <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
```

**Raw class strings detected (best effort):**

- `flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm`
- `w-24 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:902`

```jsx
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
          )}
```

**Raw class strings detected (best effort):**

- `w-24 rounded-xl borderless-shadow px-3 py-2 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:907`

```jsx
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-600">Upload proof document</label>
            <input
              type="file"
```

**Raw class strings detected (best effort):**

- `sm:col-span-2`
- `text-xs font-semibold text-slate-600`
- `file`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Responsive variants:**
  - `sm:col-span-2` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `file` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:908`

```jsx
            <label className="text-xs font-semibold text-slate-600">Upload proof document</label>
            <input
              type="file"
              className="mt-2 text-xs"
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-600`
- `file`
- `mt-2 text-xs`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Other:**
  - `file` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:911`

```jsx
              className="mt-2 text-xs"
              onChange={(e) => setPaymentForm((p) => ({ ...p, document_file: e.target.files?.[0] || null }))}
            />
          </div>
```

**Raw class strings detected (best effort):**

- `mt-2 text-xs`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:917`

```jsx
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={submitPaymentProof}
```

**Raw class strings detected (best effort):**

- `mt-4 flex flex-wrap items-center gap-2`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:922`

```jsx
            className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            Submit proof
          </button>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
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
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:926`

```jsx
          {paymentNotice ? <span className="text-xs text-slate-500">{paymentNotice}</span> : null}
        </div>

        <div className="mt-4 space-y-2">
```

**Raw class strings detected (best effort):**

- `text-xs text-slate-500`
- `mt-4 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:929`

```jsx
        <div className="mt-4 space-y-2">
          {paymentLoading ? <div className="text-xs text-slate-500">Loading proofs...</div> : null}
          {!paymentLoading && paymentProofs.length === 0 ? <div className="text-xs text-slate-500">No proofs submitted yet.</div> : null}
          {paymentProofs.map((proof) => {
```

**Raw class strings detected (best effort):**

- `mt-4 space-y-2`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:930`

```jsx
          {paymentLoading ? <div className="text-xs text-slate-500">Loading proofs...</div> : null}
          {!paymentLoading && paymentProofs.length === 0 ? <div className="text-xs text-slate-500">No proofs submitted yet.</div> : null}
          {paymentProofs.map((proof) => {
            const proofDocUrl = resolveDownloadUrl(proof.document_url || '')
```

**Raw class strings detected (best effort):**

- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:931`

```jsx
          {!paymentLoading && paymentProofs.length === 0 ? <div className="text-xs text-slate-500">No proofs submitted yet.</div> : null}
          {paymentProofs.map((proof) => {
            const proofDocUrl = resolveDownloadUrl(proof.document_url || '')
            return (
```

**Raw class strings detected (best effort):**

- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:935`

```jsx
            <div key={proof.id} className="rounded-xl borderless-shadow bg-slate-50 p-3 text-xs text-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{String(proof.type || '').replace('_', ' ').toUpperCase()}</div>
                <div className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-slate-50 p-3 text-xs text-slate-700`
- `flex flex-wrap items-center justify-between gap-2`
- `font-semibold`
- `rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `bg-white` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/ContractVault.jsx:936`

```jsx
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{String(proof.type || '').replace('_', ' ').toUpperCase()}</div>
                <div className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                  {proof.status || 'pending'}
```

**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-2`
- `font-semibold`
- `rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200`
- `pending`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `pending` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:937`

```jsx
                <div className="font-semibold">{String(proof.type || '').replace('_', ' ').toUpperCase()}</div>
                <div className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                  {proof.status || 'pending'}
                </div>
```

**Raw class strings detected (best effort):**

- `font-semibold`
- `rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200`
- `pending`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `pending` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:938`

```jsx
                <div className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                  {proof.status || 'pending'}
                </div>
              </div>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200`
- `pending`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `pending` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:942`

```jsx
              <div className="mt-2 grid grid-cols-1 gap-1">
                {proof.transaction_reference ? <div>Ref: {proof.transaction_reference}</div> : null}
                {proof.lc_number ? <div>LC: {proof.lc_number}</div> : null}
                {proof.lc_type ? (
```

**Raw class strings detected (best effort):**

- `mt-2 grid grid-cols-1 gap-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:954`

```jsx
                <div className="mt-2">
                  {proofDocUrl ? (
                    <a href={proofDocUrl} target="_blank" rel="noreferrer" className="text-[10px] font-semibold text-[#0A66C2] hover:underline">Open proof document</a>
                  ) : (
```

**Raw class strings detected (best effort):**

- `mt-2`
- `text-[10px] font-semibold text-[#0A66C2] hover:underline`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:956`

```jsx
                    <a href={proofDocUrl} target="_blank" rel="noreferrer" className="text-[10px] font-semibold text-[#0A66C2] hover:underline">Open proof document</a>
                  ) : (
                    <span className="text-[10px] text-slate-500">Document linked</span>
                  )}
```

**Raw class strings detected (best effort):**

- `text-[10px] font-semibold text-[#0A66C2] hover:underline`
- `text-[10px] text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:958`

```jsx
                    <span className="text-[10px] text-slate-500">Document linked</span>
                  )}
                </div>
              ) : null}
```

**Raw class strings detected (best effort):**

- `text-[10px] text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:963`

```jsx
                <div className="mt-2 flex flex-wrap gap-2">
                  {proof.type === 'bank_transfer' ? (
                    <>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'received')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Mark received</button>
```

**Raw class strings detected (best effort):**

- `mt-2 flex flex-wrap gap-2`
- `bank_transfer`
- `rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white`

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
  - `bg-emerald-600` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `bank_transfer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:966`

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'received')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Mark received</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_check')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending check</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white`
- `rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white`
- `rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-600` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `bg-amber-600` — Background color/surface.
  - `bg-rose-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:967`

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_check')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending check</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
                  ) : (
```

**Raw class strings detected (best effort):**

- `rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white`
- `rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-600` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `bg-rose-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:968`

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
                  ) : (
                    <>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-600` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:972`

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'accepted')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Accept</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_review')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending review</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white`
- `rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white`
- `rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-600` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `bg-amber-600` — Background color/surface.
  - `bg-rose-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:973`

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_review')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending review</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
                  )}
```

**Raw class strings detected (best effort):**

- `rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white`
- `rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-600` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `bg-rose-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:974`

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
                  )}
                </div>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-600` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:984`

```jsx
      <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Call recordings</div>
```

**Raw class strings detected (best effort):**

- `mt-5 rounded-2xl borderless-shadow bg-white p-4`
- `flex items-start justify-between gap-4`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:985`

```jsx
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Call recordings</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">Recorded calls are stored for dispute resolution and security (project.md).</div>
```

**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-4`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-500 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:987`

```jsx
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Call recordings</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">Recorded calls are stored for dispute resolution and security (project.md).</div>
          </div>
          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200">
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-500 dark:text-slate-300`
- `shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:988`

```jsx
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">Recorded calls are stored for dispute resolution and security (project.md).</div>
          </div>
          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200">
            {callsLoading ? 'Loading...' : `${callItems.filter((c) => c.recording_url).length} available`}
```

**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-500 dark:text-slate-300`
- `shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200`
- `Loading...`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Loading...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:990`

```jsx
          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200">
            {callsLoading ? 'Loading...' : `${callItems.filter((c) => c.recording_url).length} available`}
          </div>
        </div>
```

**Raw class strings detected (best effort):**

- `shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200`
- `Loading...`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Loading...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:995`

```jsx
        <div className="mt-3 space-y-3">
          {callItems.map((call) => {
            const url = resolveDownloadUrl(call.recording_url)
            const canPlay = Boolean(call.recording_status === 'available' && url)
```

**Raw class strings detected (best effort):**

- `mt-3 space-y-3`
- `available`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `available` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1000`

```jsx
              <div key={call.id} className="rounded-xl borderless-shadow bg-slate-50 p-3 dark:bg-black/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{safeDash(call.title) || 'Call session'}</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-slate-50 p-3 dark:bg-black/20`
- `flex items-start justify-between gap-3`
- `min-w-0`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-black/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1001`

```jsx
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{safeDash(call.title) || 'Call session'}</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-3`
- `min-w-0`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1002`

```jsx
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{safeDash(call.title) || 'Call session'}</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {safeDash(call.status)} - {call.created_at ? new Date(call.created_at).toLocaleString() : '\u2014'}
```

**Raw class strings detected (best effort):**

- `min-w-0`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-600 dark:text-slate-300`
- `\u2014`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `\u2014` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1003`

```jsx
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{safeDash(call.title) || 'Call session'}</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {safeDash(call.status)} - {call.created_at ? new Date(call.created_at).toLocaleString() : '\u2014'}
                    </div>
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 text-xs text-slate-600 dark:text-slate-300`
- `\u2014`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `\u2014` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1004`

```jsx
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {safeDash(call.status)} - {call.created_at ? new Date(call.created_at).toLocaleString() : '\u2014'}
                    </div>
                  </div>
```

**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-600 dark:text-slate-300`
- `\u2014`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `\u2014` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1008`

```jsx
                  <div className="shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-200">
                    {String(call.recording_status || 'pending')}
                  </div>
                </div>
```

**Raw class strings detected (best effort):**

- `shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-200`
- `pending`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pending` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1014`

```jsx
                  <div className="mt-3">
                    <video
                      src={url}
                      controls
```

**Raw class strings detected (best effort):**

- `mt-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1018`

```jsx
                      className="w-full rounded-lg bg-black/5 dark:bg-black/30"
                      onPlay={async () => {
                        try {
                          const token = getToken()
```

**Raw class strings detected (best effort):**

- `w-full rounded-lg bg-black/5 dark:bg-black/30`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-black/5` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-black/30` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1031`

```jsx
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">Recording not available yet.</div>
                )}
              </div>
            )
```

**Raw class strings detected (best effort):**

- `mt-3 text-xs text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1037`

```jsx
            <div className="text-sm text-slate-600 dark:text-slate-300">No calls linked to this contract yet.</div>
          ) : null}
        </div>
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

#### `src/pages/ContractVault.jsx:1042`

```jsx
      <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">Artifact audit</div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
          <div>Status: {safeDash(selected.artifact?.status)}</div>
```

**Raw class strings detected (best effort):**

- `mt-5 rounded-2xl borderless-shadow bg-white p-4`
- `text-sm font-semibold text-slate-900`
- `mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:1043`

```jsx
        <div className="text-sm font-semibold text-slate-900">Artifact audit</div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
          <div>Status: {safeDash(selected.artifact?.status)}</div>
          <div>Generated at: {safeDash(selected.artifact?.generated_at)}</div>
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1044`

```jsx
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
          <div>Status: {safeDash(selected.artifact?.status)}</div>
          <div>Generated at: {safeDash(selected.artifact?.generated_at)}</div>
          <div>Version: {selected.artifact?.version ?? 0}</div>
```

**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1048`

```jsx
          <div className="break-all text-xs text-slate-600">Hash: {safeDash(selected.artifact?.pdf_hash)}</div>
          <div className="text-xs text-slate-600">
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
          </div>
```

**Raw class strings detected (best effort):**

- `break-all text-xs text-slate-600`
- `text-xs text-slate-600`
- `mx-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `break-all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1049`

```jsx
          <div className="text-xs text-slate-600">
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
          </div>
          <div className="text-xs text-slate-600">
```

**Raw class strings detected (best effort):**

- `text-xs text-slate-600`
- `mx-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1050`

```jsx
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
          </div>
          <div className="text-xs text-slate-600">
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
```

**Raw class strings detected (best effort):**

- `mx-1`
- `text-xs text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1052`

```jsx
          <div className="text-xs text-slate-600">
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
          </div>
        </div>
```

**Raw class strings detected (best effort):**

- `text-xs text-slate-600`
- `mx-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mx-1` — Horizontal margin (left/right).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1053`

```jsx
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
          </div>
        </div>
      </div>
```

**Raw class strings detected (best effort):**

- `mx-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mx-1` — Horizontal margin (left/right).

#### `src/pages/ContractVault.jsx:1058`

```jsx
      <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-slate-900">Contract Audit Trail</div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600">Premium</div>
```

**Raw class strings detected (best effort):**

- `mt-5 rounded-2xl borderless-shadow bg-white p-4`
- `flex items-center justify-between gap-4`
- `text-sm font-semibold text-slate-900`
- `rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `bg-slate-100` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:1059`

```jsx
<div className="flex items-center justify-between gap-4">
  <div className="text-sm font-semibold text-slate-900">
    Contract Audit Trail
  </div>
  <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600">
    Premium
  </div>
</div>
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-4`
- `text-sm font-semibold text-slate-900`
- `rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:1060`

```jsx
          <div className="text-sm font-semibold text-slate-900">Contract Audit Trail</div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600">Premium</div>
        </div>
        {auditLoading ? (
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:1061`

```jsx
          <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600">Premium</div>
        </div>
        {auditLoading ? (
          <div className="mt-3 text-sm text-slate-600">Loading audit trail...</div>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600`
- `mt-3 text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ContractVault.jsx:1064`

```jsx
          <div className="mt-3 text-sm text-slate-600">Loading audit trail...</div>
        ) : auditError ? (
          <div className="mt-3 rounded-lg borderless-shadow bg-amber-50 p-3 text-xs text-amber-800">
            {auditError}
```

**Raw class strings detected (best effort):**

- `mt-3 text-sm text-slate-600`
- `mt-3 rounded-lg borderless-shadow bg-amber-50 p-3 text-xs text-amber-800`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:1066`

```jsx
          <div className="mt-3 rounded-lg borderless-shadow bg-amber-50 p-3 text-xs text-amber-800">
            {auditError}
          </div>
        ) : auditLog.length ? (
```

**Raw class strings detected (best effort):**

- `mt-3 rounded-lg borderless-shadow bg-amber-50 p-3 text-xs text-amber-800`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-amber-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:1070`

```jsx
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            {auditLog.map((entry) => (
              <div key={entry.id || `${entry.timestamp}-${entry.note}`} className="rounded-lg borderless-shadow bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
```

**Raw class strings detected (best effort):**

- `mt-3 space-y-2 text-xs text-slate-600`
- `rounded-lg borderless-shadow bg-slate-50 p-3`
- `flex items-center justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:1072`

```jsx
              <div key={entry.id || `${entry.timestamp}-${entry.note}`} className="rounded-lg borderless-shadow bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900">{entry.action || 'update'}</span>
                  <span>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '\u2014'}</span>
```

**Raw class strings detected (best effort):**

- `rounded-lg borderless-shadow bg-slate-50 p-3`
- `flex items-center justify-between gap-3`
- `font-semibold text-slate-900`
- `\u2014`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Other:**
  - `\u2014` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1073`

```jsx
<div className="flex items-center justify-between gap-3">
  <span className="font-semibold text-slate-900">
    {entry.action || "update"}
  </span>
  <span>
    {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "\u2014"}
  </span>
</div>
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `font-semibold text-slate-900`
- `\u2014`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Other:**
  - `\u2014` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1074`

```jsx
                  <span className="font-semibold text-slate-900">{entry.action || 'update'}</span>
                  <span>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '\u2014'}</span>
                </div>
                <div className="mt-1 text-slate-600">{entry.note || 'Audit entry recorded.'}</div>
```

**Raw class strings detected (best effort):**

- `font-semibold text-slate-900`
- `\u2014`
- `mt-1 text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Other:**
  - `\u2014` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1077`

```jsx
<div className="mt-1 text-slate-600">
  {entry.note || "Audit entry recorded."}
</div>;
{
  entry.actor_name || entry.actor_id ? (
    <div className="mt-2 text-[11px] text-slate-500">
      By {entry.actor_name || entry.actor_id}
    </div>
  ) : null;
}
```

**Raw class strings detected (best effort):**

- `mt-1 text-slate-600`
- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1079`

```jsx
                  <div className="mt-2 text-[11px] text-slate-500">By {entry.actor_name || entry.actor_id}</div>
                ) : null}
              </div>
            ))}
```

**Raw class strings detected (best effort):**

- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1085`

```jsx
          <div className="mt-3 text-sm text-slate-600">No audit entries yet.</div>
        )}
      </div>
    </div>
```

**Raw class strings detected (best effort):**

- `mt-3 text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1090`

```jsx
    <div className="rounded-2xl borderless-shadow bg-white p-10 text-center text-sm text-slate-600">
      Select a contract to see details.
    </div>
  )
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-10 text-center text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-10` — Padding (all sides).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/ContractVault.jsx:1096`

```jsx
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
```

**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out`
- `mx-auto max-w-7xl p-4 sm:p-6`
- `mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `p-4` — Padding (all sides).
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:p-6` — Variant prefix (responsive, dark, or interaction state).
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-end` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1097`

```jsx
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold text-[var(--gt-blue)]">Vault</div>
```

**Raw class strings detected (best effort):**

- `mx-auto max-w-7xl p-4 sm:p-6`
- `mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between`
- `text-xs font-semibold text-[var(--gt-blue)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `p-4` — Padding (all sides).
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:p-6` — Variant prefix (responsive, dark, or interaction state).
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-end` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1098`

```jsx
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold text-[var(--gt-blue)]">Vault</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Contract Vault</h1>
```

**Raw class strings detected (best effort):**

- `mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between`
- `text-xs font-semibold text-[var(--gt-blue)]`
- `mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-end` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1100`

```jsx
            <div className="text-xs font-semibold text-[var(--gt-blue)]">Vault</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Contract Vault</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[var(--gt-blue)]`
- `mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-sm text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1101`

```jsx
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Contract Vault</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
```

**Raw class strings detected (best effort):**

- `mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-sm text-slate-600 dark:text-slate-300`
- `flex flex-wrap items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1102`

```jsx
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-600 dark:text-slate-300`
- `flex flex-wrap items-center gap-2`
- `rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
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
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1104`

```jsx
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
```

**Raw class strings detected (best effort):**

- `flex flex-wrap items-center gap-2`
- `rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
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

#### `src/pages/ContractVault.jsx:1105`

```jsx
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
```

**Raw class strings detected (best effort):**

- `rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
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
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1106`

```jsx
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
              disabled={!canCreateDraft(currentUser)}
```

**Raw class strings detected (best effort):**

- `rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
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
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1111`

```jsx
              className="rounded-full bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95 disabled:bg-slate-200 disabled:text-slate-500"
            >
              New draft
            </button>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95 disabled:bg-slate-200 disabled:text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
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
  - `disabled:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:text-slate-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1119`

```jsx
        {!forbidden && error ? <div className="mb-4 rounded-2xl borderless-shadow bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}

        {!forbidden ? (
          <div className="secure-grid grid grid-cols-1 gap-6 lg:grid-cols-12">
```

**Raw class strings detected (best effort):**

- `mb-4 rounded-2xl borderless-shadow bg-rose-50 p-4 text-sm font-semibold text-rose-700`
- `secure-grid grid grid-cols-1 gap-6 lg:grid-cols-12`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `secure-grid` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1122`

```jsx
          <div className="secure-grid grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
```

**Raw class strings detected (best effort):**

- `secure-grid grid grid-cols-1 gap-6 lg:grid-cols-12`
- `lg:col-span-5`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-5` — Variant prefix (responsive, dark, or interaction state).
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `secure-grid` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1123`

```jsx
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contracts</div>
```

**Raw class strings detected (best effort):**

- `lg:col-span-5`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
- **Responsive variants:**
  - `lg:col-span-5` — Variant prefix (responsive, dark, or interaction state).
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1124`

```jsx
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contracts</div>
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1125`

```jsx
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
    Contracts
  </div>
  <button
    type="button"
    onClick={loadContracts}
    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8"
  >
    Refresh
  </button>
</div>
```

**Raw class strings detected (best effort):**

- `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1126`

```jsx
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contracts</div>
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
                </div>

```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1127`

```jsx
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
                </div>

                <div className="mt-4 grid gap-3">
```

**Raw class strings detected (best effort):**

- `rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8`
- `mt-4 grid gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1130`

```jsx
                <div className="mt-4 grid gap-3">
                  <div className="relative">
                    <input
                      ref={searchRef}
```

**Raw class strings detected (best effort):**

- `mt-4 grid gap-3`
- `relative`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1131`

```jsx
                  <div className="relative">
                    <input
                      ref={searchRef}
                      value={query}
```

**Raw class strings detected (best effort):**

- `relative`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1137`

```jsx
                      className="w-full rounded-xl bg-white px-3 py-2 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                      {isMac ? '⌘ K' : 'Ctrl K'}
```

**Raw class strings detected (best effort):**

- `w-full rounded-xl bg-white px-3 py-2 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`
- `pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10`
- `⌘ K`
- `Ctrl K`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
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
  - `bg-white` — Background color/surface.
  - `bg-white/70` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-inner` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `rounded-full` — Corner radius.
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

#### `src/pages/ContractVault.jsx:1139`

```jsx
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                      {isMac ? '⌘ K' : 'Ctrl K'}
                    </span>
                  </div>
```

**Raw class strings detected (best effort):**

- `pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10`
- `⌘ K`
- `Ctrl K`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/ContractVault.jsx:1144`

```jsx
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'draft', label: 'Draft' },
```

**Raw class strings detected (best effort):**

- `flex flex-wrap items-center gap-2`
- `all`
- `All`
- `draft`
- `Draft`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `All` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `draft` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Draft` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1157`

```jsx
                        className={`relative rounded-full px-3 py-1 text-xs font-semibold transition ring-1${
                          statusFilter === chip.key
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

#### `src/pages/ContractVault.jsx:1166`

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

#### `src/pages/ContractVault.jsx:1170`

```jsx
                        <span className="relative">{chip.label}</span>
                      </motion.button>
                    ))}
                  </div>
```

**Raw class strings detected (best effort):**

- `relative`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1177`

```jsx
              <div className="mt-4 grid gap-3">
                {loadingContracts ? (
                  <div className="grid gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
```

**Raw class strings detected (best effort):**

- `mt-4 grid gap-3`
- `grid gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1179`

```jsx
                  <div className="grid gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={`contract-skel-${i}`} className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                        <div className="flex items-start justify-between gap-3">
```

**Raw class strings detected (best effort):**

- `grid gap-3`
- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-start justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/ContractVault.jsx:1181`

```jsx
                      <div key={`contract-skel-${i}`} className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-3 w-1/3 rounded-full skeleton" />
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
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

#### `src/pages/ContractVault.jsx:1182`

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

#### `src/pages/ContractVault.jsx:1183`

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

#### `src/pages/ContractVault.jsx:1184`

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

#### `src/pages/ContractVault.jsx:1185`

```jsx
                            <div className="h-3 w-2/3 rounded-full skeleton" />
                            <div className="h-3 w-1/2 rounded-full skeleton" />
                          </div>
                          <div className="h-7 w-20 rounded-full skeleton" />
```

**Raw class strings detected (best effort):**

- `h-3 w-2/3 rounded-full skeleton`
- `h-3 w-1/2 rounded-full skeleton`
- `h-7 w-20 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2/3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1186`

```jsx
                            <div className="h-3 w-1/2 rounded-full skeleton" />
                          </div>
                          <div className="h-7 w-20 rounded-full skeleton" />
                        </div>
```

**Raw class strings detected (best effort):**

- `h-3 w-1/2 rounded-full skeleton`
- `h-7 w-20 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1188`

```jsx
                          <div className="h-7 w-20 rounded-full skeleton" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <div className="h-6 w-24 rounded-full skeleton" />
```

**Raw class strings detected (best effort):**

- `h-7 w-20 rounded-full skeleton`
- `mt-3 flex flex-wrap gap-2`
- `h-6 w-24 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1190`

```jsx
                        <div className="mt-3 flex flex-wrap gap-2">
                          <div className="h-6 w-24 rounded-full skeleton" />
                          <div className="h-6 w-24 rounded-full skeleton" />
                          <div className="h-6 w-20 rounded-full skeleton" />
```

**Raw class strings detected (best effort):**

- `mt-3 flex flex-wrap gap-2`
- `h-6 w-24 rounded-full skeleton`
- `h-6 w-20 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1191`

```jsx
                          <div className="h-6 w-24 rounded-full skeleton" />
                          <div className="h-6 w-24 rounded-full skeleton" />
                          <div className="h-6 w-20 rounded-full skeleton" />
                        </div>
```

**Raw class strings detected (best effort):**

- `h-6 w-24 rounded-full skeleton`
- `h-6 w-20 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1192`

```jsx
                          <div className="h-6 w-24 rounded-full skeleton" />
                          <div className="h-6 w-20 rounded-full skeleton" />
                        </div>
                      </div>
```

**Raw class strings detected (best effort):**

- `h-6 w-24 rounded-full skeleton`
- `h-6 w-20 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1193`

```jsx
                          <div className="h-6 w-20 rounded-full skeleton" />
                        </div>
                      </div>
                    ))}
```

**Raw class strings detected (best effort):**

- `h-6 w-20 rounded-full skeleton`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1204`

```jsx
                    className="hidden lg:block"
                  >
                    <ContractRow
                      contract={c}
```

**Raw class strings detected (best effort):**

- `hidden lg:block`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1213`

```jsx
                  <div className="rounded-2xl bg-[#ffffff] p-8 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-800">
                    No contracts found.
                  </div>
                )}
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-8 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-800`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-8` — Padding (all sides).
- **Typography:**
  - `text-center` — Text color or text sizing.
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

#### `src/pages/ContractVault.jsx:1219`

```jsx
                  <div className="grid gap-3 lg:hidden">
                    {visibleContracts.map((c) => (
                      <ContractRow
                        key={c.id}
```

**Raw class strings detected (best effort):**

- `grid gap-3 lg:hidden`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:hidden` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1233`

```jsx
            <div className="hidden lg:col-span-7 lg:block">
              {detailPanel}
            </div>
          </div>
```

**Raw class strings detected (best effort):**

- `hidden lg:col-span-7 lg:block`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
  - `lg:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1244`

```jsx
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/30" onClick={() => setDraftOpen(false)} />
            <div className="absolute left-1/2 top-10 w-[min(40rem,92vw)] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
```

**Raw class strings detected (best effort):**

- `fixed inset-0 z-50`
- `absolute inset-0 bg-slate-900/30`
- `absolute left-1/2 top-10 w-[min(40rem,92vw)] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl`
- `flex items-start justify-between gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `fixed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[min(40rem,92vw)]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/30` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `shadow-2xl` — Drop shadow depth (elevation).
- **Other:**
  - `-translate-x-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1245`

```jsx
            <div className="absolute inset-0 bg-slate-900/30" onClick={() => setDraftOpen(false)} />
            <div className="absolute left-1/2 top-10 w-[min(40rem,92vw)] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
```

**Raw class strings detected (best effort):**

- `absolute inset-0 bg-slate-900/30`
- `absolute left-1/2 top-10 w-[min(40rem,92vw)] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl`
- `flex items-start justify-between gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[min(40rem,92vw)]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/30` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `shadow-2xl` — Drop shadow depth (elevation).
- **Other:**
  - `-translate-x-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1246`

```jsx
            <div className="absolute left-1/2 top-10 w-[min(40rem,92vw)] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#0A66C2]">New</div>
```

**Raw class strings detected (best effort):**

- `absolute left-1/2 top-10 w-[min(40rem,92vw)] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl`
- `flex items-start justify-between gap-4`
- `text-xs font-semibold text-[#0A66C2]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[min(40rem,92vw)]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `shadow-2xl` — Drop shadow depth (elevation).
- **Other:**
  - `-translate-x-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1247`

```jsx
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#0A66C2]">New</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">Create contract draft</div>
```

**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-4`
- `text-xs font-semibold text-[#0A66C2]`
- `mt-1 text-lg font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1249`

```jsx
                  <div className="text-xs font-semibold text-[#0A66C2]">New</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">Create contract draft</div>
                  <div className="mt-1 text-xs text-slate-600">Banking references are optional and should be used only for fraud prevention.</div>
                </div>
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#0A66C2]`
- `mt-1 text-lg font-bold text-slate-900`
- `mt-1 text-xs text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:1250`

```jsx
                  <div className="mt-1 text-lg font-bold text-slate-900">Create contract draft</div>
                  <div className="mt-1 text-xs text-slate-600">Banking references are optional and should be used only for fraud prevention.</div>
                </div>
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
```

**Raw class strings detected (best effort):**

- `mt-1 text-lg font-bold text-slate-900`
- `mt-1 text-xs text-slate-600`
- `rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1251`

```jsx
                  <div className="mt-1 text-xs text-slate-600">Banking references are optional and should be used only for fraud prevention.</div>
                </div>
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
              </div>
```

**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-600`
- `rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1253`

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
```

**Raw class strings detected (best effort):**

- `rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100`
- `mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1256`

```jsx
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={draftForm.title} onChange={(e) => setDraftForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
```

**Raw class strings detected (best effort):**

- `mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2`
- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1257`

```jsx
                <input value={draftForm.title} onChange={(e) => setDraftForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1258`

```jsx
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1259`

```jsx
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <div className="hidden sm:block" />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none`
- `hidden sm:block`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1260`

```jsx
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <div className="hidden sm:block" />

```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none`
- `hidden sm:block`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1261`

```jsx
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <div className="hidden sm:block" />

                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none`
- `hidden sm:block`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1262`

```jsx
                <div className="hidden sm:block" />

                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
```

**Raw class strings detected (best effort):**

- `hidden sm:block`
- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1264`

```jsx
                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2" />
              </div>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none`
- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1265`

```jsx
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2" />
              </div>

```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none`
- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1266`

```jsx
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2" />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2`
- `mt-6 flex items-center justify-end gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-end` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:1269`

```jsx
              <div className="mt-6 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
                <button
                  type="button"
```

**Raw class strings detected (best effort):**

- `mt-6 flex items-center justify-end gap-2`
- `rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-end` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1270`

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
                <button
                  type="button"
                  disabled={!canCreateDraft(currentUser) || saving}
```

**Raw class strings detected (best effort):**

- `rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:1275`

```jsx
                  className="rounded-full bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
                >
                  Create draft
                </button>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `disabled:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:text-slate-500` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/ContractVault.jsx:208` — Buyer:

```jsx
            <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">-</span>
            <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
          </div>
        </div>
```

- `src/pages/ContractVault.jsx:209` — Factory:

```jsx
            <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
          </div>
        </div>

```

- `src/pages/ContractVault.jsx:222` — Buyer: {contract.buyer_signature_state \|\| 'pending'}

```jsx
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Buyer: {contract.buyer_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Factory: {contract.factory_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
```

- `src/pages/ContractVault.jsx:223` — Factory: {contract.factory_signature_state \|\| 'pending'}

```jsx
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Factory: {contract.factory_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
    </button>
```

- `src/pages/ContractVault.jsx:224` — PDF: {flow.hasPdf ? 'ready' : 'pending'}

```jsx
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
    </button>
  )
```

- `src/pages/ContractVault.jsx:238` — Close

```jsx
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
        </div>
        {children}
      </div>
```

- `src/pages/ContractVault.jsx:662` — Buyer:

```jsx
            <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">-</span>
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
          </div>
        </div>
```

- `src/pages/ContractVault.jsx:663` — Factory:

```jsx
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
          </div>
        </div>
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
```

- `src/pages/ContractVault.jsx:666` — Help

```jsx
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
      </div>

      {actionError ? <div className="mt-4 rounded-xl borderless-shadow bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}
```

- `src/pages/ContractVault.jsx:675` — Open source requirement

```jsx
          <Link to={`/search?requirementId=${encodeURIComponent(selected.requirement_id)}`} className="text-xs font-semibold text-[#0A66C2] hover:underline">Open source requirement</Link>
        </div>
      ) : null}
      {!hasRecordedCall ? (
```

- `src/pages/ContractVault.jsx:681` — Video calls are recommended before finalizing contracts. No recorded call is linked to this contract yet.

```jsx
            <span>Video calls are recommended before finalizing contracts. No recorded call is linked to this contract yet.</span>
            <Link to="/chat" className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500">
              Open chat
            </Link>
```

- `src/pages/ContractVault.jsx:700` — ({selected.buyer_signed_at})

```jsx
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          {!hasAcceptedProof ? (
            <div className="mt-3 rounded-lg borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
```

- `src/pages/ContractVault.jsx:701` — ({selected.factory_signed_at})

```jsx
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          {!hasAcceptedProof ? (
            <div className="mt-3 rounded-lg borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
              Warning: No accepted payment proof yet. You may continue, but proof is strongly recommended for safety.
```

- `src/pages/ContractVault.jsx:799` — Download (not ready)

```jsx
              : <button type="button" disabled className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Download (not ready)</button>}
          </div>
        </div>
      </div>
```

- `src/pages/ContractVault.jsx:834` — Proof type

```jsx
          <label className="text-xs font-semibold text-slate-600">Proof type</label>
          <div />
          <select
            value={paymentForm.type}
```

- `src/pages/ContractVault.jsx:908` — Upload proof document

```jsx
            <label className="text-xs font-semibold text-slate-600">Upload proof document</label>
            <input
              type="file"
              className="mt-2 text-xs"
```

- `src/pages/ContractVault.jsx:958` — Document linked

```jsx
                    <span className="text-[10px] text-slate-500">Document linked</span>
                  )}
                </div>
              ) : null}
```

- `src/pages/ContractVault.jsx:966` — updatePaymentStatus(proof.id, 'received')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Mark received

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'received')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Mark received</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_check')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending check</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
```

- `src/pages/ContractVault.jsx:967` — updatePaymentStatus(proof.id, 'pending_check')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending check

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_check')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending check</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
                  ) : (
```

- `src/pages/ContractVault.jsx:968` — updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
                  ) : (
                    <>
```

- `src/pages/ContractVault.jsx:972` — updatePaymentStatus(proof.id, 'accepted')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Accept

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'accepted')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Accept</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_review')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending review</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
```

- `src/pages/ContractVault.jsx:973` — updatePaymentStatus(proof.id, 'pending_review')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending review

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_review')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending review</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
                  )}
```

- `src/pages/ContractVault.jsx:974` — updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
                  )}
                </div>
```

- `src/pages/ContractVault.jsx:1050` — -

```jsx
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
          </div>
          <div className="text-xs text-slate-600">
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
```

- `src/pages/ContractVault.jsx:1053` — -

```jsx
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
          </div>
        </div>
      </div>
```

- `src/pages/ContractVault.jsx:1101` — Contract Vault

```jsx
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Contract Vault</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
```

- `src/pages/ContractVault.jsx:1102` — Draft → Sign → PDF artifact → Lock → Archive

```jsx
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
```

- `src/pages/ContractVault.jsx:1105` — Dashboard

```jsx
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
```

- `src/pages/ContractVault.jsx:1106` — Notifications

```jsx
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
              disabled={!canCreateDraft(currentUser)}
```

- `src/pages/ContractVault.jsx:1127` — Refresh

```jsx
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
                </div>

                <div className="mt-4 grid gap-3">
```

- `src/pages/ContractVault.jsx:1253` — setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
```

- `src/pages/ContractVault.jsx:1270` — setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
                <button
                  type="button"
                  disabled={!canCreateDraft(currentUser) || saving}
```

- `src/pages/ContractVault.jsx:671` — Journey Timeline

```jsx
        <JourneyTimeline title="Journey Timeline" matchId={selected.match_id || journeyParams.get('journey_match_id') || journeyParams.get('match_id') || ''} />
      </div>
      {selected.requirement_id ? (
        <div className="mt-2">
```

- `src/pages/ContractVault.jsx:848` — Transaction reference

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Transaction reference" value={paymentForm.transaction_reference} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_reference: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Bank name" value={paymentForm.bank_name} onChange={(e) => setPaymentForm((p) => ({ ...p, bank_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Sender account name" value={paymentForm.sender_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, sender_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
```

- `src/pages/ContractVault.jsx:849` — Bank name

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Bank name" value={paymentForm.bank_name} onChange={(e) => setPaymentForm((p) => ({ ...p, bank_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Sender account name" value={paymentForm.sender_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, sender_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.transaction_date} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
```

- `src/pages/ContractVault.jsx:850` — Sender account name

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Sender account name" value={paymentForm.sender_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, sender_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.transaction_date} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
              <div className="flex gap-2">
```

- `src/pages/ContractVault.jsx:851` — Receiver/company account name

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.transaction_date} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
```

- `src/pages/ContractVault.jsx:854` — Amount

```jsx
                <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
```

- `src/pages/ContractVault.jsx:855` — Currency

```jsx
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
          ) : (
```

- `src/pages/ContractVault.jsx:860` — LC number

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="LC number" value={paymentForm.lc_number} onChange={(e) => setPaymentForm((p) => ({ ...p, lc_number: e.target.value }))} />
              <div className="flex flex-wrap gap-2">
                <select
                  value={paymentForm.lc_type}
```

- `src/pages/ContractVault.jsx:886` — Days

```jsx
                        placeholder="Days"
                        value={paymentForm.usance_custom_days}
                        onChange={(e) => setPaymentForm((p) => ({ ...p, usance_custom_days: e.target.value }))}
                      />
```

- `src/pages/ContractVault.jsx:894` — Issuing bank

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Issuing bank" value={paymentForm.issuing_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, issuing_bank: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Advising bank" value={paymentForm.advising_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, advising_bank: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Applicant name" value={paymentForm.applicant_name} onChange={(e) => setPaymentForm((p) => ({ ...p, applicant_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
```

- `src/pages/ContractVault.jsx:895` — Advising bank

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Advising bank" value={paymentForm.advising_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, advising_bank: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Applicant name" value={paymentForm.applicant_name} onChange={(e) => setPaymentForm((p) => ({ ...p, applicant_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.issue_date} onChange={(e) => setPaymentForm((p) => ({ ...p, issue_date: e.target.value }))} />
```

- `src/pages/ContractVault.jsx:896` — Applicant name

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Applicant name" value={paymentForm.applicant_name} onChange={(e) => setPaymentForm((p) => ({ ...p, applicant_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.issue_date} onChange={(e) => setPaymentForm((p) => ({ ...p, issue_date: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.expiry_date} onChange={(e) => setPaymentForm((p) => ({ ...p, expiry_date: e.target.value }))} />
```

- `src/pages/ContractVault.jsx:897` — Beneficiary name

```jsx
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.issue_date} onChange={(e) => setPaymentForm((p) => ({ ...p, issue_date: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.expiry_date} onChange={(e) => setPaymentForm((p) => ({ ...p, expiry_date: e.target.value }))} />
              <div className="flex gap-2">
```

- `src/pages/ContractVault.jsx:901` — Amount

```jsx
                <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
```

- `src/pages/ContractVault.jsx:902` — Currency

```jsx
                <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
          )}
```

- `src/pages/ContractVault.jsx:1136` — Search by number, buyer, factory, title...

```jsx
                      placeholder="Search by number, buyer, factory, title..."
                      className="w-full rounded-xl bg-white px-3 py-2 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
```

- `src/pages/ContractVault.jsx:1257` — Title

```jsx
                <input value={draftForm.title} onChange={(e) => setDraftForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
```

- `src/pages/ContractVault.jsx:1258` — Buyer name

```jsx
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
```

- `src/pages/ContractVault.jsx:1259` — Factory name

```jsx
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <div className="hidden sm:block" />
```

- `src/pages/ContractVault.jsx:1260` — Buyer user ID

```jsx
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <div className="hidden sm:block" />

```

- `src/pages/ContractVault.jsx:1261` — Factory user ID

```jsx
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <div className="hidden sm:block" />

                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
```

- `src/pages/ContractVault.jsx:1264` — Bank name (optional)

```jsx
                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2" />
              </div>
```

- `src/pages/ContractVault.jsx:1265` — Beneficiary name (optional)

```jsx
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2" />
              </div>

```

- `src/pages/ContractVault.jsx:1266` — Transaction reference (optional)

```jsx
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2" />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
```

- `src/pages/ContractVault.jsx:193` — (element) <button>

```jsx
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl p-4 text-left transition ring-1${active ? 'bg-indigo-50/60 text-slate-900 ring-indigo-200 shadow-sm dark:bg-white/5 dark:text-slate-100 dark:ring-[#38bdf8]/35' : 'bg-white text-slate-900 ring-slate-200/70 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-white/5'}`}
```

- `src/pages/ContractVault.jsx:238` — (element) <button>

```jsx
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
        </div>
        {children}
      </div>
```

- `src/pages/ContractVault.jsx:666` — (element) <Link>

```jsx
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
      </div>

      {actionError ? <div className="mt-4 rounded-xl borderless-shadow bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}
```

- `src/pages/ContractVault.jsx:675` — (element) <Link>

```jsx
          <Link to={`/search?requirementId=${encodeURIComponent(selected.requirement_id)}`} className="text-xs font-semibold text-[#0A66C2] hover:underline">Open source requirement</Link>
        </div>
      ) : null}
      {!hasRecordedCall ? (
```

- `src/pages/ContractVault.jsx:682` — (element) <Link>

```jsx
            <Link to="/chat" className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500">
              Open chat
            </Link>
          </div>
```

- `src/pages/ContractVault.jsx:708` — (element) <button>

```jsx
              <button
                type="button"
                disabled={Boolean(selectedActionBlockers.buyerSign) || saving}
                onClick={() => runStepActionWithProofWarning(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
```

- `src/pages/ContractVault.jsx:722` — (element) <button>

```jsx
              <button
                type="button"
                disabled={Boolean(selectedActionBlockers.factorySign) || saving}
                onClick={() => runStepActionWithProofWarning(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
```

- `src/pages/ContractVault.jsx:734` — (element) <button>

```jsx
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
```

- `src/pages/ContractVault.jsx:769` — (element) <button>

```jsx
              <button
                type="button"
                disabled={Boolean(selectedActionBlockers.lock) || saving}
                onClick={() => runStepActionWithProofWarning(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
```

- `src/pages/ContractVault.jsx:783` — (element) <button>

```jsx
            <button
              type="button"
              disabled={Boolean(selectedActionBlockers.archive) || saving}
              onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
```

- `src/pages/ContractVault.jsx:799` — (element) <button>

```jsx
              : <button type="button" disabled className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Download (not ready)</button>}
          </div>
        </div>
      </div>
```

- `src/pages/ContractVault.jsx:828` — (element) <button>

```jsx
          <button type="button" onClick={() => loadPaymentProofs(selected.id)} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
            Refresh
          </button>
        </div>
```

- `src/pages/ContractVault.jsx:918` — (element) <button>

```jsx
          <button
            type="button"
            onClick={submitPaymentProof}
            disabled={saving}
```

- `src/pages/ContractVault.jsx:966` — (element) <button>

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'received')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Mark received</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_check')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending check</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
```

- `src/pages/ContractVault.jsx:967` — (element) <button>

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_check')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending check</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
                  ) : (
```

- `src/pages/ContractVault.jsx:968` — (element) <button>

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
                  ) : (
                    <>
```

- `src/pages/ContractVault.jsx:972` — (element) <button>

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'accepted')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Accept</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_review')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending review</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
```

- `src/pages/ContractVault.jsx:973` — (element) <button>

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_review')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending review</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
                  )}
```

- `src/pages/ContractVault.jsx:974` — (element) <button>

```jsx
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
                  )}
                </div>
```

- `src/pages/ContractVault.jsx:1105` — (element) <Link>

```jsx
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
```

- `src/pages/ContractVault.jsx:1106` — (element) <Link>

```jsx
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
              disabled={!canCreateDraft(currentUser)}
```

- `src/pages/ContractVault.jsx:1107` — (element) <button>

```jsx
            <button
              type="button"
              disabled={!canCreateDraft(currentUser)}
              onClick={() => setDraftOpen(true)}
```

- `src/pages/ContractVault.jsx:1127` — (element) <button>

```jsx
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
                </div>

                <div className="mt-4 grid gap-3">
```

- `src/pages/ContractVault.jsx:1253` — (element) <button>

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
```

- `src/pages/ContractVault.jsx:1270` — (element) <button>

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
                <button
                  type="button"
                  disabled={!canCreateDraft(currentUser) || saving}
```

- `src/pages/ContractVault.jsx:1271` — (element) <button>

```jsx
                <button
                  type="button"
                  disabled={!canCreateDraft(currentUser) || saving}
                  onClick={handleCreateDraft}
```

## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line)                                                                           | Express mount                                                  | Route definition                                    | Controller file                              | Handler          |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------- | ---------------- |
| GET /documents/contracts (src/pages/ContractVault.jsx:325)                                          | /api/documents -> server/routes/documentRoutes.js:114          | GET /contracts (server/routes/documentRoutes.js:29) | -                                            | getContracts     |
| GET /payment-proofs?contract_id=${encodeURIComponent(contractId)} (src/pages/ContractVault.jsx:373) | -                                                              | -                                                   | -                                            | -                |
| GET /documents/contracts/${encodeURIComponent(contractId)}/audit (src/pages/ContractVault.jsx:391)  | /api/documents -> server/routes/documentRoutes.js:114          | -                                                   | -                                            | -                |
| POST /payment-proofs (src/pages/ContractVault.jsx:458)                                              | /api/payment-proofs -> server/routes/paymentProofRoutes.js:145 | POST / (server/routes/paymentProofRoutes.js:8)      | server/controllers/paymentProofController.js | postPaymentProof |
| GET /payment-proofs/${encodeURIComponent(proofId)} (src/pages/ContractVault.jsx:476)                | /api/payment-proofs -> server/routes/paymentProofRoutes.js:145 | -                                                   | -                                            | -                |
| GET /calls/by-contract/${encodeURIComponent(selected.id)} (src/pages/ContractVault.jsx:551)         | /api/calls -> server/routes/callSessionRoutes.js:134           | -                                                   | -                                            | -                |
| GET /documents/contracts/draft (src/pages/ContractVault.jsx:617)                                    | /api/documents -> server/routes/documentRoutes.js:114          | -                                                   | -                                            | -                |
| GET /documents/contracts/${selected.id}/signatures (src/pages/ContractVault.jsx:711)                | /api/documents -> server/routes/documentRoutes.js:114          | -                                                   | -                                            | -                |
| GET /documents/contracts/${selected.id}/signatures (src/pages/ContractVault.jsx:725)                | /api/documents -> server/routes/documentRoutes.js:114          | -                                                   | -                                            | -                |
| POST /documents/contracts/${selected.id}/sign-session (src/pages/ContractVault.jsx:743)             | /api/documents -> server/routes/documentRoutes.js:114          | -                                                   | -                                            | -                |
| GET /documents/contracts/${selected.id}/artifact (src/pages/ContractVault.jsx:772)                  | /api/documents -> server/routes/documentRoutes.js:114          | -                                                   | -                                            | -                |
| GET /documents/contracts/${selected.id}/artifact (src/pages/ContractVault.jsx:786)                  | /api/documents -> server/routes/documentRoutes.js:114          | -                                                   | -                                            | -                |
| POST /calls/${encodeURIComponent(call.id)}/recording/viewed (src/pages/ContractVault.jsx:1023)      | /api/calls -> server/routes/callSessionRoutes.js:134           | -                                                   | -                                            | -                |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/ContractVault.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
