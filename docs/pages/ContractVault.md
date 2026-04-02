{% raw %}
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

### 2.2 Structural section tags in JSX

_No <header/main/section/aside/footer/nav> tags detected by the heuristic extractor._

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

#### `src/pages/ContractVault.jsx:176`

```jsx
    <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${done ? 'bg-[#E8F3FF] text-[#0A66C2] ring-[#BBD8FF]' : 'bg-white text-slate-600 ring-slate-200'}`}>
      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-[#0A66C2] text-white' : 'bg-slate-100 text-slate-500'}`}>
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

#### `src/pages/ContractVault.jsx:177`

```jsx
      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-[#0A66C2] text-white' : 'bg-slate-100 text-slate-500'}`}>
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

#### `src/pages/ContractVault.jsx:192`

```jsx
      className={`w-full rounded-2xl p-4 text-left transition ring-1 ${active ? 'bg-indigo-50/60 text-slate-900 ring-indigo-200 shadow-sm dark:bg-white/5 dark:text-slate-100 dark:ring-[#38bdf8]/35' : 'bg-white text-slate-900 ring-slate-200/70 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-white/5'}`}
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

#### `src/pages/ContractVault.jsx:194`

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

#### `src/pages/ContractVault.jsx:195`

```jsx
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">{contract.contract_number || contract.id}</div>
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>
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

#### `src/pages/ContractVault.jsx:196`

```jsx
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">{contract.contract_number || contract.id}</div>
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>
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

#### `src/pages/ContractVault.jsx:197`

```jsx
            <div className="truncate text-sm font-semibold text-slate-900">{contract.contract_number || contract.id}</div>
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>
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

#### `src/pages/ContractVault.jsx:198`

```jsx
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>
              {toLabel(status)}
            </span>
          </div>
```
**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**


#### `src/pages/ContractVault.jsx:202`

```jsx
          <div className="mt-1 truncate text-xs text-slate-600">{safeDash(contract.title)}</div>
          <div className="mt-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">•</span>
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

#### `src/pages/ContractVault.jsx:203`

```jsx
          <div className="mt-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">•</span>
            <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
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

#### `src/pages/ContractVault.jsx:204`

```jsx
            <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">•</span>
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

#### `src/pages/ContractVault.jsx:205`

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

#### `src/pages/ContractVault.jsx:209`

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

#### `src/pages/ContractVault.jsx:211`

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

#### `src/pages/ContractVault.jsx:217`

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

#### `src/pages/ContractVault.jsx:218`

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

#### `src/pages/ContractVault.jsx:219`

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

#### `src/pages/ContractVault.jsx:220`

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

#### `src/pages/ContractVault.jsx:229`

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

#### `src/pages/ContractVault.jsx:230`

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

#### `src/pages/ContractVault.jsx:231`

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

#### `src/pages/ContractVault.jsx:232`

```jsx
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Contract details</div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
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

#### `src/pages/ContractVault.jsx:233`

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

#### `src/pages/ContractVault.jsx:234`

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

#### `src/pages/ContractVault.jsx:393`

```jsx
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-5`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/ContractVault.jsx:394`

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

#### `src/pages/ContractVault.jsx:395`

```jsx
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-lg font-bold text-slate-900">{selected.contract_number || selected.id}</div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
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

#### `src/pages/ContractVault.jsx:396`

```jsx
          <div className="flex items-center gap-2">
            <div className="truncate text-lg font-bold text-slate-900">{selected.contract_number || selected.id}</div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
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

#### `src/pages/ContractVault.jsx:397`

```jsx
            <div className="truncate text-lg font-bold text-slate-900">{selected.contract_number || selected.id}</div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
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

#### `src/pages/ContractVault.jsx:398`

```jsx
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
              {toLabel(selected.lifecycle_status || 'pending_signature')}
            </span>
          </div>
```
**Raw class strings detected (best effort):**

- `pending_signature`

**Utility breakdown (grouped):**

- **Other:**
  - `pending_signature` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:402`

```jsx
          <div className="mt-1 text-sm text-slate-600">{safeDash(selected.title)}</div>
          <div className="mt-3 text-sm text-slate-700">
            <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">•</span>
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

#### `src/pages/ContractVault.jsx:403`

```jsx
          <div className="mt-3 text-sm text-slate-700">
            <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">•</span>
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
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

#### `src/pages/ContractVault.jsx:404`

```jsx
            <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">•</span>
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

#### `src/pages/ContractVault.jsx:405`

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

#### `src/pages/ContractVault.jsx:408`

```jsx
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
      </div>

      {actionError ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}
```
**Raw class strings detected (best effort):**

- `shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]`
- `mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700`

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
  - `border` — Border style/width/color.
  - `border-rose-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-[#D9ECFF]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:411`

```jsx
      {actionError ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <StepPill done={selectedFlow.stepState.draft_creation} label="Draft" />
```
**Raw class strings detected (best effort):**

- `mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700`
- `mt-5 flex flex-wrap items-center gap-2`
- `Draft`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-rose-200` — Border style/width/color.
- **Other:**
  - `Draft` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:413`

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

#### `src/pages/ContractVault.jsx:421`

```jsx
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Signatures</div>
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
```
**Raw class strings detected (best effort):**

- `mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2`
- `rounded-2xl border border-slate-200 bg-white p-4`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:422`

```jsx
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Signatures</div>
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-4`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/ContractVault.jsx:423`

```jsx
          <div className="text-sm font-semibold text-slate-900">Signatures</div>
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          <div className="mt-4 grid grid-cols-1 gap-2">
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `mt-2 text-sm text-slate-700`
- `font-semibold`
- `text-xs text-slate-500`
- `mt-1 text-sm text-slate-700`
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
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/ContractVault.jsx:424`

```jsx
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-700`
- `font-semibold`
- `text-xs text-slate-500`
- `mt-1 text-sm text-slate-700`
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

#### `src/pages/ContractVault.jsx:425`

```jsx
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              type="button"
```
**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700`
- `font-semibold`
- `text-xs text-slate-500`
- `mt-4 grid grid-cols-1 gap-2`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:426`

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

#### `src/pages/ContractVault.jsx:435`

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

#### `src/pages/ContractVault.jsx:439`

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

#### `src/pages/ContractVault.jsx:449`

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

#### `src/pages/ContractVault.jsx:453`

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

#### `src/pages/ContractVault.jsx:457`

```jsx
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Artifact (PDF)</div>
          <div className="mt-2 text-sm text-slate-700">Status: <span className="font-semibold">{selected.artifact?.status || 'draft'}</span></div>
          <div className="mt-1 text-xs text-slate-500">PDF generates automatically after both signatures.</div>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-4`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/ContractVault.jsx:458`

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

#### `src/pages/ContractVault.jsx:459`

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

#### `src/pages/ContractVault.jsx:460`

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

#### `src/pages/ContractVault.jsx:462`

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

#### `src/pages/ContractVault.jsx:471`

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

#### `src/pages/ContractVault.jsx:475`

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

#### `src/pages/ContractVault.jsx:485`

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

#### `src/pages/ContractVault.jsx:489`

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

#### `src/pages/ContractVault.jsx:492`

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

#### `src/pages/ContractVault.jsx:493`

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

#### `src/pages/ContractVault.jsx:498`

```jsx
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Banking references (optional)</div>
```
**Raw class strings detected (best effort):**

- `mt-5 rounded-2xl border border-slate-200 bg-white p-4`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/ContractVault.jsx:499`

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

#### `src/pages/ContractVault.jsx:501`

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

#### `src/pages/ContractVault.jsx:502`

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

#### `src/pages/ContractVault.jsx:504`

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

#### `src/pages/ContractVault.jsx:509`

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

#### `src/pages/ContractVault.jsx:516`

```jsx
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">Artifact audit</div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
          <div>Status: {safeDash(selected.artifact?.status)}</div>
```
**Raw class strings detected (best effort):**

- `mt-5 rounded-2xl border border-slate-200 bg-white p-4`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/ContractVault.jsx:517`

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

#### `src/pages/ContractVault.jsx:518`

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

#### `src/pages/ContractVault.jsx:522`

```jsx
          <div className="break-all text-xs text-slate-600">Hash: {safeDash(selected.artifact?.pdf_hash)}</div>
          <div className="text-xs text-slate-600">
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
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

#### `src/pages/ContractVault.jsx:523`

```jsx
          <div className="text-xs text-slate-600">
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
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

#### `src/pages/ContractVault.jsx:524`

```jsx
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
          </div>
          <div className="text-xs text-slate-600">
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
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

#### `src/pages/ContractVault.jsx:526`

```jsx
          <div className="text-xs text-slate-600">
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
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

#### `src/pages/ContractVault.jsx:527`

```jsx
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
          </div>
        </div>
      </div>
```
**Raw class strings detected (best effort):**

- `mx-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mx-1` — Horizontal margin (left/right).

#### `src/pages/ContractVault.jsx:533`

```jsx
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
      Select a contract to see details.
    </div>
  )
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600`

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
  - `border` — Border style/width/color.
  - `border-dashed` — Border style/width/color.
  - `border-slate-300` — Border style/width/color.

#### `src/pages/ContractVault.jsx:539`

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

#### `src/pages/ContractVault.jsx:540`

```jsx
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">Vault</div>
```
**Raw class strings detected (best effort):**

- `mx-auto max-w-7xl p-4 sm:p-6`
- `mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between`
- `text-xs font-semibold text-indigo-600 dark:text-indigo-300`

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
  - `text-indigo-600` — Text color or text sizing.
- **Responsive variants:**
  - `sm:p-6` — Variant prefix (responsive, dark, or interaction state).
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-end` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-indigo-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:541`

```jsx
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">Vault</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Contract Vault</h1>
```
**Raw class strings detected (best effort):**

- `mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between`
- `text-xs font-semibold text-indigo-600 dark:text-indigo-300`
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
  - `text-indigo-600` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-end` — Variant prefix (responsive, dark, or interaction state).
  - `sm:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-indigo-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:543`

```jsx
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">Vault</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Contract Vault</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-indigo-600 dark:text-indigo-300`
- `mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100`
- `mt-1 text-sm text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-600` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-indigo-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:544`

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

#### `src/pages/ContractVault.jsx:545`

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

#### `src/pages/ContractVault.jsx:547`

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

#### `src/pages/ContractVault.jsx:548`

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

#### `src/pages/ContractVault.jsx:549`

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

#### `src/pages/ContractVault.jsx:554`

```jsx
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950"
            >
              New draft
            </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-slate-950`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
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
  - `disabled:bg-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:text-slate-500` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-indigo-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-950` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:562`

```jsx
        {!forbidden && error ? <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}

        {!forbidden ? (
          <div className="secure-grid grid grid-cols-1 gap-6 lg:grid-cols-12">
```
**Raw class strings detected (best effort):**

- `mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700`
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
  - `border` — Border style/width/color.
  - `border-rose-200` — Border style/width/color.
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `secure-grid` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ContractVault.jsx:565`

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

#### `src/pages/ContractVault.jsx:566`

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

#### `src/pages/ContractVault.jsx:567`

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

#### `src/pages/ContractVault.jsx:568`

```jsx
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contracts</div>
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
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

#### `src/pages/ContractVault.jsx:569`

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

#### `src/pages/ContractVault.jsx:570`

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

#### `src/pages/ContractVault.jsx:573`

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

#### `src/pages/ContractVault.jsx:574`

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

#### `src/pages/ContractVault.jsx:580`

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

#### `src/pages/ContractVault.jsx:582`

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

#### `src/pages/ContractVault.jsx:587`

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

#### `src/pages/ContractVault.jsx:600`

```jsx
                        className={`relative rounded-full px-3 py-1 text-xs font-semibold transition ring-1 ${
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

#### `src/pages/ContractVault.jsx:609`

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

#### `src/pages/ContractVault.jsx:613`

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

#### `src/pages/ContractVault.jsx:620`

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

#### `src/pages/ContractVault.jsx:622`

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

#### `src/pages/ContractVault.jsx:624`

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

#### `src/pages/ContractVault.jsx:625`

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

#### `src/pages/ContractVault.jsx:626`

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

#### `src/pages/ContractVault.jsx:627`

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

#### `src/pages/ContractVault.jsx:628`

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

#### `src/pages/ContractVault.jsx:629`

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

#### `src/pages/ContractVault.jsx:631`

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

#### `src/pages/ContractVault.jsx:633`

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

#### `src/pages/ContractVault.jsx:634`

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

#### `src/pages/ContractVault.jsx:635`

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

#### `src/pages/ContractVault.jsx:636`

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

#### `src/pages/ContractVault.jsx:647`

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

#### `src/pages/ContractVault.jsx:656`

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

#### `src/pages/ContractVault.jsx:662`

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

#### `src/pages/ContractVault.jsx:676`

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

#### `src/pages/ContractVault.jsx:687`

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

#### `src/pages/ContractVault.jsx:688`

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

#### `src/pages/ContractVault.jsx:689`

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

#### `src/pages/ContractVault.jsx:690`

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

#### `src/pages/ContractVault.jsx:692`

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

#### `src/pages/ContractVault.jsx:693`

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

#### `src/pages/ContractVault.jsx:694`

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

#### `src/pages/ContractVault.jsx:696`

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

#### `src/pages/ContractVault.jsx:699`

```jsx
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={draftForm.title} onChange={(e) => setDraftForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
```
**Raw class strings detected (best effort):**

- `mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2`
- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:700`

```jsx
                <input value={draftForm.title} onChange={(e) => setDraftForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:701`

```jsx
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:702`

```jsx
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <div className="hidden sm:block" />
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:703`

```jsx
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <div className="hidden sm:block" />

```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:704`

```jsx
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <div className="hidden sm:block" />

                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:705`

```jsx
                <div className="hidden sm:block" />

                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
```
**Raw class strings detected (best effort):**

- `hidden sm:block`
- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:707`

```jsx
                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2" />
              </div>
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]`
- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:708`

```jsx
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2" />
              </div>

```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]`
- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:709`

```jsx
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2" />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus:border-[#0A66C2]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ContractVault.jsx:712`

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

#### `src/pages/ContractVault.jsx:713`

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

#### `src/pages/ContractVault.jsx:718`

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

- `src/pages/ContractVault.jsx:204` — Buyer:

```jsx
            <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">•</span>
            <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
          </div>
        </div>
```
- `src/pages/ContractVault.jsx:205` — Factory:

```jsx
            <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
          </div>
        </div>

```
- `src/pages/ContractVault.jsx:218` — Buyer: {contract.buyer_signature_state \|\| 'pending'}

```jsx
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Buyer: {contract.buyer_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Factory: {contract.factory_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
```
- `src/pages/ContractVault.jsx:219` — Factory: {contract.factory_signature_state \|\| 'pending'}

```jsx
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Factory: {contract.factory_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
    </button>
```
- `src/pages/ContractVault.jsx:220` — PDF: {flow.hasPdf ? 'ready' : 'pending'}

```jsx
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
    </button>
  )
```
- `src/pages/ContractVault.jsx:234` — Close

```jsx
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
        </div>
        {children}
      </div>
```
- `src/pages/ContractVault.jsx:404` — Buyer:

```jsx
            <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">•</span>
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
          </div>
        </div>
```
- `src/pages/ContractVault.jsx:405` — Factory:

```jsx
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
          </div>
        </div>
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
```
- `src/pages/ContractVault.jsx:408` — Help

```jsx
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
      </div>

      {actionError ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}
```
- `src/pages/ContractVault.jsx:424` — ({selected.buyer_signed_at})

```jsx
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
```
- `src/pages/ContractVault.jsx:425` — ({selected.factory_signed_at})

```jsx
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              type="button"
```
- `src/pages/ContractVault.jsx:493` — Download (not ready)

```jsx
              : <button type="button" disabled className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Download (not ready)</button>}
          </div>
        </div>
      </div>
```
- `src/pages/ContractVault.jsx:524` — •

```jsx
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
          </div>
          <div className="text-xs text-slate-600">
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
```
- `src/pages/ContractVault.jsx:527` — •

```jsx
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
          </div>
        </div>
      </div>
```
- `src/pages/ContractVault.jsx:544` — Contract Vault

```jsx
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Contract Vault</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
```
- `src/pages/ContractVault.jsx:545` — Draft → Sign → PDF artifact → Lock → Archive

```jsx
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
```
- `src/pages/ContractVault.jsx:548` — Dashboard

```jsx
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
```
- `src/pages/ContractVault.jsx:549` — Notifications

```jsx
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
              disabled={!canCreateDraft(currentUser)}
```
- `src/pages/ContractVault.jsx:570` — Refresh

```jsx
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
                </div>

                <div className="mt-4 grid gap-3">
```
- `src/pages/ContractVault.jsx:696` — setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
```
- `src/pages/ContractVault.jsx:713` — setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
                <button
                  type="button"
                  disabled={!canCreateDraft(currentUser) || saving}
```
- `src/pages/ContractVault.jsx:579` — Search by number, buyer, factory, title…

```jsx
                      placeholder="Search by number, buyer, factory, title…"
                      className="w-full rounded-xl bg-white px-3 py-2 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
```
- `src/pages/ContractVault.jsx:700` — Title

```jsx
                <input value={draftForm.title} onChange={(e) => setDraftForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
```
- `src/pages/ContractVault.jsx:701` — Buyer name

```jsx
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
```
- `src/pages/ContractVault.jsx:702` — Factory name

```jsx
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <div className="hidden sm:block" />
```
- `src/pages/ContractVault.jsx:703` — Buyer user ID

```jsx
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <div className="hidden sm:block" />

```
- `src/pages/ContractVault.jsx:704` — Factory user ID

```jsx
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <div className="hidden sm:block" />

                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
```
- `src/pages/ContractVault.jsx:707` — Bank name (optional)

```jsx
                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2" />
              </div>
```
- `src/pages/ContractVault.jsx:708` — Beneficiary name (optional)

```jsx
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2" />
              </div>

```
- `src/pages/ContractVault.jsx:709` — Transaction reference (optional)

```jsx
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2" />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
```
- `src/pages/ContractVault.jsx:189` — (element) <button>

```jsx
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl p-4 text-left transition ring-1 ${active ? 'bg-indigo-50/60 text-slate-900 ring-indigo-200 shadow-sm dark:bg-white/5 dark:text-slate-100 dark:ring-[#38bdf8]/35' : 'bg-white text-slate-900 ring-slate-200/70 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-white/5'}`}
```
- `src/pages/ContractVault.jsx:234` — (element) <button>

```jsx
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
        </div>
        {children}
      </div>
```
- `src/pages/ContractVault.jsx:408` — (element) <Link>

```jsx
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
      </div>

      {actionError ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}
```
- `src/pages/ContractVault.jsx:427` — (element) <button>

```jsx
            <button
              type="button"
              disabled={Boolean(selectedActionBlockers.buyerSign) || saving}
              onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
```
- `src/pages/ContractVault.jsx:441` — (element) <button>

```jsx
            <button
              type="button"
              disabled={Boolean(selectedActionBlockers.factorySign) || saving}
              onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
```
- `src/pages/ContractVault.jsx:463` — (element) <button>

```jsx
            <button
              type="button"
              disabled={Boolean(selectedActionBlockers.lock) || saving}
              onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
```
- `src/pages/ContractVault.jsx:477` — (element) <button>

```jsx
            <button
              type="button"
              disabled={Boolean(selectedActionBlockers.archive) || saving}
              onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
```
- `src/pages/ContractVault.jsx:493` — (element) <button>

```jsx
              : <button type="button" disabled className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Download (not ready)</button>}
          </div>
        </div>
      </div>
```
- `src/pages/ContractVault.jsx:548` — (element) <Link>

```jsx
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
```
- `src/pages/ContractVault.jsx:549` — (element) <Link>

```jsx
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
              disabled={!canCreateDraft(currentUser)}
```
- `src/pages/ContractVault.jsx:550` — (element) <button>

```jsx
            <button
              type="button"
              disabled={!canCreateDraft(currentUser)}
              onClick={() => setDraftOpen(true)}
```
- `src/pages/ContractVault.jsx:570` — (element) <button>

```jsx
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
                </div>

                <div className="mt-4 grid gap-3">
```
- `src/pages/ContractVault.jsx:696` — (element) <button>

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
```
- `src/pages/ContractVault.jsx:713` — (element) <button>

```jsx
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
                <button
                  type="button"
                  disabled={!canCreateDraft(currentUser) || saving}
```
- `src/pages/ContractVault.jsx:714` — (element) <button>

```jsx
                <button
                  type="button"
                  disabled={!canCreateDraft(currentUser) || saving}
                  onClick={handleCreateDraft}
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /documents/contracts (src/pages/ContractVault.jsx:280) | /api/documents -> server/routes/documentRoutes.js:62 | GET /contracts (server/routes/documentRoutes.js:20) | - | getContracts |
| GET /documents/contracts/draft (src/pages/ContractVault.jsx:359) | /api/documents -> server/routes/documentRoutes.js:62 | - | - | - |
| GET /documents/contracts/${selected.id}/signatures (src/pages/ContractVault.jsx:430) | /api/documents -> server/routes/documentRoutes.js:62 | - | - | - |
| GET /documents/contracts/${selected.id}/signatures (src/pages/ContractVault.jsx:444) | /api/documents -> server/routes/documentRoutes.js:62 | - | - | - |
| GET /documents/contracts/${selected.id}/artifact (src/pages/ContractVault.jsx:466) | /api/documents -> server/routes/documentRoutes.js:62 | - | - | - |
| GET /documents/contracts/${selected.id}/artifact (src/pages/ContractVault.jsx:480) | /api/documents -> server/routes/documentRoutes.js:62 | - | - | - |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/ContractVault.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
{% endraw %}

