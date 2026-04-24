# Terms - Route `/terms`

**Access:** Public

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/Terms.jsx`.
- **Backend interactions:** None (static page / client-only interactions).
- **Primary file:** `src/pages/Terms.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_Terms.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

_No local component imports detected._

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

#### `src/pages/Terms.jsx:25`

```jsx
function SignatureMark({ className='' }) {
  return (
    <div
      className={[
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/Terms.jsx:28`

```jsx
      className={[
        'signature-draw inline-flex items-center justify-center rounded-xl px-3 py-2',
        'bg-black/[0.02] dark:bg-white/5 text-[#0f172a] dark:text-white',
        className,
```

**Raw class strings detected (best effort):**

- `signature-draw inline-flex items-center justify-center rounded-xl px-3 py-2`
- `bg-black/[0.02] dark:bg-white/5 text-[#0f172a] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-black/[0.02]` — Background color/surface.
  - `text-[#0f172a]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `signature-draw` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:49`

```jsx
function LegalCard({ children, className='', index = 0, id }) {
  const reduceMotion = useReducedMotion()

  return (
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/Terms.jsx:62`

```jsx
      className={[
        'rounded-2xl p-6 lg:p-8 transition-colors duration-500 ease-in-out',
        'bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
        'dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5',
```

**Raw class strings detected (best effort):**

- `rounded-2xl p-6 lg:p-8 transition-colors duration-500 ease-in-out`
- `bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`
- `dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:p-8` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#0f172a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:83`

```jsx
    <div className="min-h-screen legal-weave bg-[#f8fafc] text-[#0f172a] dark:bg-[#020617] dark:text-[#f8fafc] transition-colors duration-500 ease-in-out px-4 py-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
```

**Raw class strings detected (best effort):**

- `min-h-screen legal-weave bg-[#f8fafc] text-[#0f172a] dark:bg-[#020617] dark:text-[#f8fafc] transition-colors duration-500 ease-in-out px-4 py-8 lg:px-12 lg:py-12`
- `mx-auto max-w-6xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-6xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-8` — Vertical padding (top/bottom).
  - `mx-auto` — Horizontal margin (left/right).
- **Color / surface:**
  - `bg-[#f8fafc]` — Background color/surface.
  - `text-[#0f172a]` — Text color or text sizing.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:px-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:py-12` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#f8fafc]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `legal-weave` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:84`

```jsx
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
```

**Raw class strings detected (best effort):**

- `mx-auto max-w-6xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-6xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).

#### `src/pages/Terms.jsx:89`

```jsx
          className="mb-8"
        >
          <div className="rounded-3xl bg-[#ffffff]/80 backdrop-blur-md borderless-shadow shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
```

**Raw class strings detected (best effort):**

- `mb-8`
- `rounded-3xl bg-[#ffffff]/80 backdrop-blur-md borderless-shadow shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out`
- `flex flex-col gap-4 md:flex-row md:items-end md:justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mb-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-6` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]/80` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `shadow-[0_10px_40px_rgba(2,6,23,0.06)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:p-8` — Variant prefix (responsive, dark, or interaction state).
  - `md:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `md:items-end` — Variant prefix (responsive, dark, or interaction state).
  - `md:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#0f172a]/70` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:91`

```jsx
          <div className="rounded-3xl bg-[#ffffff]/80 backdrop-blur-md borderless-shadow shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10">
```

**Raw class strings detected (best effort):**

- `rounded-3xl bg-[#ffffff]/80 backdrop-blur-md borderless-shadow shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out`
- `flex flex-col gap-4 md:flex-row md:items-end md:justify-between`
- `inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.18em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]/80` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[11px]` — Text color or text sizing.
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `shadow-[0_10px_40px_rgba(2,6,23,0.06)]` — Drop shadow depth (elevation).
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:p-8` — Variant prefix (responsive, dark, or interaction state).
  - `md:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `md:items-end` — Variant prefix (responsive, dark, or interaction state).
  - `md:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#0f172a]/70` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:92`

```jsx
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10">
                  Legal Agreement
```

**Raw class strings detected (best effort):**

- `flex flex-col gap-4 md:flex-row md:items-end md:justify-between`
- `inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.18em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `md:items-end` — Variant prefix (responsive, dark, or interaction state).
  - `md:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:94`

```jsx
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10">
                  Legal Agreement
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
```

**Raw class strings detected (best effort):**

- `inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10`
- `mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.18em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-indigo-50` — Background color/surface.
  - `text-[#0f172a]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:text-4xl` — Variant prefix (responsive, dark, or interaction state).
  - `lg:text-5xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:97`

```jsx
                <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
                  Terms & Conditions
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white`
- `mt-2 text-sm font-medium text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-4xl` — Variant prefix (responsive, dark, or interaction state).
  - `lg:text-5xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:100`

```jsx
<p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
  Last Updated:{" "}
  <span className="text-[#0f172a] dark:text-slate-100">{lastUpdated}</span>
</p>
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm font-medium text-slate-600 dark:text-slate-300`
- ` `
- `text-[#0f172a] dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:102`

```jsx
                  <span className="text-[#0f172a] dark:text-slate-100">{lastUpdated}</span>
                </p>
              </div>
              <div className="max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `text-[#0f172a] dark:text-slate-100`
- `max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:105`

```jsx
              <div className="max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                This platform is an international B2B Garments and Textiles Marketplace, where Buyer,
                Factory and Buying House connect for professional business purposes. By creating or
                using an account on the platform, you agree to the following terms and conditions.
```

**Raw class strings detected (best effort):**

- `max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:114`

```jsx
        <div className="grid grid-cols-12 gap-6">
          <LegalCard index={0} className="col-span-12 md:col-span-6" id="purpose">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
```

**Raw class strings detected (best effort):**

- `grid grid-cols-12 gap-6`
- `col-span-12 md:col-span-6`
- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-12` — Grid layout.
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:115`

```jsx
          <LegalCard index={0} className="col-span-12 md:col-span-6" id="purpose">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
                1
```

**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6`
- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:116`

```jsx
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
                1
              </span>
```

**Raw class strings detected (best effort):**

- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:117`

```jsx
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
                1
              </span>
              Purpose of the Platform
```

**Raw class strings detected (best effort):**

- `flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:122`

```jsx
            <ul className="space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {[
                'To establish direct and professional connections between international buyers and Garments/Textile Factories',
                'To ensure business matching based on Buyer Request and Company Product',
```

**Raw class strings detected (best effort):**

- `space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `To establish direct and professional connections between international buyers and Garments/Textile Factories`
- `To ensure business matching based on Buyer Request and Company Product`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `To` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `establish` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `direct` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `and` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `connections` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `international` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `buyers` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Garments/Textile` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Factories` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ensure` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `business` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `matching` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `based` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `on` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Request` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Company` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Product` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:129`

```jsx
<li key={idx} className="flex items-start gap-3">
  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0"></span>
  {item}
</li>
```

**Raw class strings detected (best effort):**

- `flex items-start gap-3`
- `mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:130`

```jsx
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0"></span>
                  {item}
                </li>
              ))}
```

**Raw class strings detected (best effort):**

- `mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:137`

```jsx
          <LegalCard index={1} className="col-span-12 md:col-span-6" id="account-policy">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
                2
```

**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6`
- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:138`

```jsx
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
                2
              </span>
```

**Raw class strings detected (best effort):**

- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:139`

```jsx
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm">
                2
              </span>
              Account Policy
```

**Raw class strings detected (best effort):**

- `flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 borderless-shadow dark:bg-white/5 dark:text-indigo-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:144`

```jsx
            <ul className="space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {[
                'It is mandatory to open an account only for legitimate business purposes.',
                'Accurate, true and up-to-date information must be provided.',
```

**Raw class strings detected (best effort):**

- `space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `It is mandatory to open an account only for legitimate business purposes.`
- `Accurate, true and up-to-date information must be provided.`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `It` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `is` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mandatory` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `open` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `an` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `only` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `for` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `legitimate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `business` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `purposes.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Accurate,` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `true` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `and` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `up-to-date` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `information` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `must` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `be` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `provided.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:152`

```jsx
<li key={idx} className="flex items-start gap-3">
  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0"></span>
  {item}
</li>
```

**Raw class strings detected (best effort):**

- `flex items-start gap-3`
- `mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:153`

```jsx
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0"></span>
                  {item}
                </li>
              ))}
```

**Raw class strings detected (best effort):**

- `mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-indigo-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:162`

```jsx
            className={[
              'col-span-12',
              '!bg-rose-50 !text-[#0f172a] !ring-1 !ring-rose-200/70 !shadow-[0_12px_40px_rgba(244,63,94,0.12)]',
              'dark:!bg-[#0b1220] dark:!text-white dark:ring-1 dark:ring-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none',
```

**Raw class strings detected (best effort):**

- `col-span-12`
- `!bg-rose-50 !text-[#0f172a] !ring-1 !ring-rose-200/70 !shadow-[0_12px_40px_rgba(244,63,94,0.12)]`
- `dark:!bg-[#0b1220] dark:!text-white dark:ring-1 dark:ring-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:!bg-[#0b1220]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:!text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `!bg-rose-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `!text-[#0f172a]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `!ring-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `!ring-rose-200/70` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `!shadow-[0_12px_40px_rgba(244,63,94,0.12)]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:169`

```jsx
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3 flex items-center gap-3 text-[#0f172a] dark:text-white">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-800 borderless-shadow dark:bg-white/10 dark:text-white text-sm">
                3
              </span>
```

**Raw class strings detected (best effort):**

- `text-xl md:text-2xl font-bold tracking-tight mb-3 flex items-center gap-3 text-[#0f172a] dark:text-white`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-800 borderless-shadow dark:bg-white/10 dark:text-white text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-800` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-rose-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:170`

```jsx
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-800 borderless-shadow dark:bg-white/10 dark:text-white text-sm">
                3
              </span>
              User Conduct
```

**Raw class strings detected (best effort):**

- `flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-800 borderless-shadow dark:bg-white/10 dark:text-white text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-rose-800` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:175`

```jsx
            <p className="mb-4 font-semibold text-rose-950/80 dark:text-white/80">
              The following activities are strictly prohibited and will be subject to action:
            </p>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-slate-800 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0">
```

**Raw class strings detected (best effort):**

- `mb-4 font-semibold text-rose-950/80 dark:text-white/80`
- `grid md:grid-cols-2 gap-x-8 gap-y-3 text-slate-800 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-x-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-950/80` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white/80` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white/85` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:178`

```jsx
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-slate-800 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0">
              {[
                'Posting fake orders or misleading Buyer Requests',
                'Fraudulent or misleading communications',
```

**Raw class strings detected (best effort):**

- `grid md:grid-cols-2 gap-x-8 gap-y-3 text-slate-800 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0`
- `Posting fake orders or misleading Buyer Requests`
- `Fraudulent or misleading communications`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `orders` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-x-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `text-slate-800` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white/85` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Posting` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `fake` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `or` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `misleading` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Requests` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Fraudulent` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `communications` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:189`

```jsx
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1 bg-rose-100 p-1 rounded-full dark:bg-white/10">
                    <svg className="w-2.5 h-2.5 text-rose-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
```

**Raw class strings detected (best effort):**

- `flex items-start gap-3`
- `mt-1 bg-rose-100 p-1 rounded-full dark:bg-white/10`
- `w-2.5 h-2.5 text-rose-700 dark:text-white`
- `round`
- `3`
- `M6 18L18 6M6 6l12 12`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-1` — Padding (all sides).
- **Typography:**
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `round` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `M6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `18L18` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `6M6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `6l12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:190`

```jsx
                  <span className="mt-1 bg-rose-100 p-1 rounded-full dark:bg-white/10">
                    <svg className="w-2.5 h-2.5 text-rose-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
```

**Raw class strings detected (best effort):**

- `mt-1 bg-rose-100 p-1 rounded-full dark:bg-white/10`
- `w-2.5 h-2.5 text-rose-700 dark:text-white`
- `round`
- `3`
- `M6 18L18 6M6 6l12 12`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-1` — Padding (all sides).
- **Typography:**
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `round` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `M6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `18L18` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `6M6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `6l12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:191`

```jsx
                    <svg className="w-2.5 h-2.5 text-rose-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </span>
```

**Raw class strings detected (best effort):**

- `w-2.5 h-2.5 text-rose-700 dark:text-white`
- `round`
- `3`
- `M6 18L18 6M6 6l12 12`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-rose-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `round` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `M6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `18L18` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `6M6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `6l12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:199`

```jsx
            <p className="mt-6 text-sm italic text-slate-600 dark:text-white/80">
              All media content must be published in a professional and business-like manner.
            </p>
            <div className="mt-6 rounded-2xl borderless-shadow bg-rose-50 p-4 text-sm text-rose-900 shadow-[0_8px_30px_rgba(244,63,94,0.12)] dark:bg-rose-500/10 dark:text-rose-100">
```

**Raw class strings detected (best effort):**

- `mt-6 text-sm italic text-slate-600 dark:text-white/80`
- `mt-6 rounded-2xl borderless-shadow bg-rose-50 p-4 text-sm text-rose-900 shadow-[0_8px_30px_rgba(244,63,94,0.12)] dark:bg-rose-500/10 dark:text-rose-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
  - `text-rose-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `shadow-[0_8px_30px_rgba(244,63,94,0.12)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:text-white/80` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-rose-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:202`

```jsx
            <div className="mt-6 rounded-2xl borderless-shadow bg-rose-50 p-4 text-sm text-rose-900 shadow-[0_8px_30px_rgba(244,63,94,0.12)] dark:bg-rose-500/10 dark:text-rose-100">
              <p className="font-bold uppercase tracking-wide">Strict policy: No third-party contact sharing</p>
              <p className="mt-2 leading-relaxed">
                Sharing any external contact information (phone, email, WhatsApp, Telegram, Facebook, Instagram, or similar)
```

**Raw class strings detected (best effort):**

- `mt-6 rounded-2xl borderless-shadow bg-rose-50 p-4 text-sm text-rose-900 shadow-[0_8px_30px_rgba(244,63,94,0.12)] dark:bg-rose-500/10 dark:text-rose-100`
- `font-bold uppercase tracking-wide`
- `mt-2 leading-relaxed`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-rose-900` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-rose-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `shadow-[0_8px_30px_rgba(244,63,94,0.12)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-rose-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:203`

```jsx
              <p className="font-bold uppercase tracking-wide">Strict policy: No third-party contact sharing</p>
              <p className="mt-2 leading-relaxed">
                Sharing any external contact information (phone, email, WhatsApp, Telegram, Facebook, Instagram, or similar)
                is strictly forbidden on GarTexHub. Violations will result in account restrictions and may lead to permanent
```

**Raw class strings detected (best effort):**

- `font-bold uppercase tracking-wide`
- `mt-2 leading-relaxed`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:204`

```jsx
              <p className="mt-2 leading-relaxed">
                Sharing any external contact information (phone, email, WhatsApp, Telegram, Facebook, Instagram, or similar)
                is strictly forbidden on GarTexHub. Violations will result in account restrictions and may lead to permanent
                termination.
```

**Raw class strings detected (best effort):**

- `mt-2 leading-relaxed`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:267`

```jsx
                className={[
                  'col-span-12 md:col-span-6',
                  isStitch ? 'ring-1 ring-slate-200/70 dark:ring-1 dark:ring-white/10 outline outline-1 outline-dashed outline-slate-200/80 dark:outline-white/10' : '',
                ].join(' ')}
```

**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6`
- `ring-1 ring-slate-200/70 dark:ring-1 dark:ring-white/10 outline outline-1 outline-dashed outline-slate-200/80 dark:outline-white/10`
- ` `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `outline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `outline-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `outline-dashed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `outline-slate-200/80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:outline-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:273`

```jsx
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
                    {section.id}
                  </span>
```

**Raw class strings detected (best effort):**

- `text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:text-xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:274`

```jsx
<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
  {section.id}
</span>;
{
  section.title;
}
```

**Raw class strings detected (best effort):**

- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:279`

```jsx
                <ul className="space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {section.points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0"></span>
```

**Raw class strings detected (best effort):**

- `space-y-3 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `flex items-start gap-3`
- `mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-400` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-500` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:281`

```jsx
<li key={idx} className="flex items-start gap-3">
  <span className="mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0"></span>
  {p}
</li>
```

**Raw class strings detected (best effort):**

- `flex items-start gap-3`
- `mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-400` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-slate-500` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:282`

```jsx
                      <span className="mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0"></span>
                      {p}
                    </li>
                  ))}
```

**Raw class strings detected (best effort):**

- `mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-400` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-slate-500` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:288`

```jsx
                  <div className="mt-6 flex justify-end">
                    <SignatureMark />
                  </div>
                ) : null}
```

**Raw class strings detected (best effort):**

- `mt-6 flex justify-end`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `justify-end` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:298`

```jsx
            className="col-span-12 bg-amber-50 text-amber-950 dark:bg-[rgba(120,53,15,0.10)] dark:text-amber-50 dark:ring-1 dark:ring-amber-500/20 borderless-shadow"
            id="liability"
          >
            <h2 className="text-lg md:text-xl font-bold tracking-tight mb-3 flex items-center gap-2 text-amber-950 dark:text-white">
```

**Raw class strings detected (best effort):**

- `col-span-12 bg-amber-50 text-amber-950 dark:bg-[rgba(120,53,15,0.10)] dark:text-amber-50 dark:ring-1 dark:ring-amber-500/20 borderless-shadow`
- `liability`
- `text-lg md:text-xl font-bold tracking-tight mb-3 flex items-center gap-2 text-amber-950 dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-amber-950` — Text color or text sizing.
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:text-xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[rgba(120,53,15,0.10)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-amber-500/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `liability` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:301`

```jsx
<h2 className="text-lg md:text-xl font-bold tracking-tight mb-3 flex items-center gap-2 text-amber-950 dark:text-white">
  <span className="text-amber-600 dark:text-amber-400">⚠</span>
  9. Liability
</h2>
```

**Raw class strings detected (best effort):**

- `text-lg md:text-xl font-bold tracking-tight mb-3 flex items-center gap-2 text-amber-950 dark:text-white`
- `text-amber-600 dark:text-amber-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-950` — Text color or text sizing.
  - `text-amber-600` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:302`

```jsx
              <span className="text-amber-600 dark:text-amber-400">⚠</span>
              9. Liability
            </h2>
            <div className="space-y-3 text-sm md:text-base leading-relaxed">
```

**Raw class strings detected (best effort):**

- `text-amber-600 dark:text-amber-400`
- `space-y-3 text-sm md:text-base leading-relaxed`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-amber-600` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-amber-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:305`

```jsx
            <div className="space-y-3 text-sm md:text-base leading-relaxed">
              <p>
                The platform provides connectivity between Buyers and Sellers. Strong and effective
                security measures have been implemented to prevent fraud.
```

**Raw class strings detected (best effort):**

- `space-y-3 text-sm md:text-base leading-relaxed`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:310`

```jsx
<p className="font-semibold text-amber-800 dark:text-amber-200">
  If the user violates policies, verification processes or security instructions
  and suffers losses, the user will bear the responsibility himself.
</p>
```

**Raw class strings detected (best effort):**

- `font-semibold text-amber-800 dark:text-amber-200`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:317`

```jsx
          <LegalCard index={9} className="col-span-12" id="suspension">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
                10
```

**Raw class strings detected (best effort):**

- `col-span-12`
- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:318`

```jsx
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
                10
              </span>
```

**Raw class strings detected (best effort):**

- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:319`

```jsx
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm">
                10
              </span>
              Account Suspension or Cancellation
```

**Raw class strings detected (best effort):**

- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 borderless-shadow dark:bg-white/5 dark:text-slate-200 dark:ring-1 dark:ring-white/10 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:324`

```jsx
            <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              <p>
                Accounts will be suspended or canceled in cases of:{' '}
                <strong>Violation of terms, Fraudulent activity, Providing false information,</strong>{' '}
```

**Raw class strings detected (best effort):**

- `space-y-4 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- ` `

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:330`

```jsx
              <ul className="list-disc ml-5 space-y-1 text-sm md:text-base">
                <li>The user will be notified before closing the account.</li>
                <li>A warning will be given if necessary.</li>
                <li>In case of repeated or serious violations, the account will be permanently closed.</li>
```

**Raw class strings detected (best effort):**

- `list-disc ml-5 space-y-1 text-sm md:text-base`

**Utility breakdown (grouped):**

- **Spacing:**
  - `ml-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-disc` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Terms.jsx:338`

```jsx
          <LegalCard index={10} className="col-span-12 md:col-span-6" id="change-policy">
            <h3 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2">
              11. Change Policy
            </h3>
```

**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6`
- `text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:339`

```jsx
            <h3 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2">
              11. Change Policy
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2`
- `text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:342`

```jsx
            <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              These Terms will be updated as needed. Users will be notified of any significant changes via notification.
            </p>
          </LegalCard>
```

**Raw class strings detected (best effort):**

- `text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:347`

```jsx
          <LegalCard index={11} className="col-span-12 md:col-span-6" id="consent">
            <h3 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2">
              12. Consent
            </h3>
```

**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6`
- `text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:348`

```jsx
            <h3 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2">
              12. Consent
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#0f172a] dark:text-white mb-2`
- `text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:351`

```jsx
            <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              By creating an account or using the Platform, you agree to be bound by all provisions of these Terms and Conditions.
            </p>
          </LegalCard>
```

**Raw class strings detected (best effort):**

- `text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:360`

```jsx
            className="col-span-12 text-center"
          >
            <div className="rounded-2xl p-6 bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
```

**Raw class strings detected (best effort):**

- `col-span-12 text-center`
- `rounded-2xl p-6 bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out`
- `text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-widest` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#0f172a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:362`

```jsx
            <div className="rounded-2xl p-6 bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                © 2026 GarTexHub Professional Network. All Rights Reserved.
              </p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl p-6 bg-[#ffffff] borderless-shadow shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out`
- `text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-widest` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#0f172a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Terms.jsx:363`

```jsx
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                © 2026 GarTexHub Professional Network. All Rights Reserved.
              </p>
            </div>
```

**Raw class strings detected (best effort):**

- `text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-widest` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/Terms.jsx:203` — Strict policy: No third-party contact sharing

```jsx
              <p className="font-bold uppercase tracking-wide">Strict policy: No third-party contact sharing</p>
              <p className="mt-2 leading-relaxed">
                Sharing any external contact information (phone, email, WhatsApp, Telegram, Facebook, Instagram, or similar)
                is strictly forbidden on GarTexHub. Violations will result in account restrictions and may lead to permanent
```

- `src/pages/Terms.jsx:302` — ⚠

```jsx
              <span className="text-amber-600 dark:text-amber-400">⚠</span>
              9. Liability
            </h2>
            <div className="space-y-3 text-sm md:text-base leading-relaxed">
```

- `src/pages/Terms.jsx:331` — The user will be notified before closing the account.

```jsx
                <li>The user will be notified before closing the account.</li>
                <li>A warning will be given if necessary.</li>
                <li>In case of repeated or serious violations, the account will be permanently closed.</li>
              </ul>
```

- `src/pages/Terms.jsx:332` — A warning will be given if necessary.

```jsx
                <li>A warning will be given if necessary.</li>
                <li>In case of repeated or serious violations, the account will be permanently closed.</li>
              </ul>
            </div>
```

- `src/pages/Terms.jsx:333` — In case of repeated or serious violations, the account will be permanently closed.

```jsx
                <li>In case of repeated or serious violations, the account will be permanently closed.</li>
              </ul>
            </div>
          </LegalCard>
```

## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

_No API calls detected in this page._

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/Terms.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
