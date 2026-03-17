# Privacy - Route `/privacy`

**Access:** Public

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/Privacy.jsx`.
- **Backend interactions:** None (static page / client-only interactions).
- **Primary file:** `src/pages/Privacy.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_Privacy.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

_No local component imports detected._

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

#### `src/pages/Privacy.jsx:38`

```jsx
      className={[
        'rounded-2xl p-6 lg:p-8 transition-colors duration-500 ease-in-out',
        'bg-[#ffffff] border border-slate-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
        'dark:bg-[#0f172a] dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/5',
```
**Raw class strings detected (best effort):**

- `rounded-2xl p-6 lg:p-8 transition-colors duration-500 ease-in-out`
- `bg-[#ffffff] border border-slate-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`
- `dark:bg-[#0f172a] dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/5`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:p-8` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#0f172a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:54`

```jsx
      className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-700 hover:text-indigo-700 bg-black/[0.03] hover:bg-black/[0.05] dark:text-slate-200 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 transition"
    >
      {label}
    </a>
```
**Raw class strings detected (best effort):**

- `rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-700 hover:text-indigo-700 bg-black/[0.03] hover:bg-black/[0.05] dark:text-slate-200 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 transition`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-black/[0.03]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:text-indigo-700` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-black/[0.05]` — Variant prefix (responsive, dark, or interaction state).
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:66`

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

#### `src/pages/Privacy.jsx:67`

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

#### `src/pages/Privacy.jsx:72`

```jsx
          className="mb-5"
        >
          <div className="rounded-3xl bg-[#ffffff]/80 backdrop-blur-md border border-slate-200 shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
```
**Raw class strings detected (best effort):**

- `mb-5`
- `rounded-3xl bg-[#ffffff]/80 backdrop-blur-md border border-slate-200 shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out`
- `flex flex-col gap-4 md:flex-row md:items-end md:justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mb-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-6` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]/80` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
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
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:74`

```jsx
          <div className="rounded-3xl bg-[#ffffff]/80 backdrop-blur-md border border-slate-200 shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-sky-50 text-sky-700 border border-sky-100 dark:bg-white/5 dark:text-sky-200 dark:border-transparent dark:ring-1 dark:ring-white/10">
```
**Raw class strings detected (best effort):**

- `rounded-3xl bg-[#ffffff]/80 backdrop-blur-md border border-slate-200 shadow-[0_10px_40px_rgba(2,6,23,0.06)] p-6 lg:p-8 dark:bg-[#0f172a]/70 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out`
- `flex flex-col gap-4 md:flex-row md:items-end md:justify-between`
- `inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-sky-50 text-sky-700 border border-sky-100 dark:bg-white/5 dark:text-sky-200 dark:border-transparent dark:ring-1 dark:ring-white/10`

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
  - `text-sky-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]/80` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[11px]` — Text color or text sizing.
  - `bg-sky-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `shadow-[0_10px_40px_rgba(2,6,23,0.06)]` — Drop shadow depth (elevation).
  - `rounded-full` — Corner radius.
  - `border-sky-100` — Border style/width/color.
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
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:75`

```jsx
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-sky-50 text-sky-700 border border-sky-100 dark:bg-white/5 dark:text-sky-200 dark:border-transparent dark:ring-1 dark:ring-white/10">
                  Legal Documentation
```
**Raw class strings detected (best effort):**

- `flex flex-col gap-4 md:flex-row md:items-end md:justify-between`
- `inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-sky-50 text-sky-700 border border-sky-100 dark:bg-white/5 dark:text-sky-200 dark:border-transparent dark:ring-1 dark:ring-white/10`

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
  - `text-sky-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-sky-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `border` — Border style/width/color.
  - `border-sky-100` — Border style/width/color.
- **Responsive variants:**
  - `md:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `md:items-end` — Variant prefix (responsive, dark, or interaction state).
  - `md:justify-between` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:77`

```jsx
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-sky-50 text-sky-700 border border-sky-100 dark:bg-white/5 dark:text-sky-200 dark:border-transparent dark:ring-1 dark:ring-white/10">
                  Legal Documentation
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
```
**Raw class strings detected (best effort):**

- `inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase bg-sky-50 text-sky-700 border border-sky-100 dark:bg-white/5 dark:text-sky-200 dark:border-transparent dark:ring-1 dark:ring-white/10`
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
  - `text-sky-700` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-sky-50` — Background color/surface.
  - `text-[#0f172a]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `border` — Border style/width/color.
  - `border-sky-100` — Border style/width/color.
- **Responsive variants:**
  - `md:text-4xl` — Variant prefix (responsive, dark, or interaction state).
  - `lg:text-5xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:80`

```jsx
                <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
                  Privacy Policy
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

#### `src/pages/Privacy.jsx:83`

```jsx
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Last Updated:{' '}
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

#### `src/pages/Privacy.jsx:85`

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

#### `src/pages/Privacy.jsx:88`

```jsx
              <div className="max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                This Privacy Policy explains how our B2B Garments and Textile Marketplace platform collects, uses, protects, and manages your information. Our platform connects international Buyers, Factories, and Buying Houses in a secure and professional environment. By creating an account or using our services, you agree to the practices described in this policy.
              </div>
            </div>
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

#### `src/pages/Privacy.jsx:95`

```jsx
        <div className="sticky top-[72px] z-40 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-[#ffffff]/70 backdrop-blur-md shadow-[0_10px_34px_rgba(2,6,23,0.05)] px-4 py-3 dark:bg-[#020617]/60 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
            <div className="flex flex-wrap items-center gap-2">
              <TocLink href="#collect" label="1. Collect" />
```
**Raw class strings detected (best effort):**

- `sticky top-[72px] z-40 mb-6`
- `rounded-2xl border border-slate-200 bg-[#ffffff]/70 backdrop-blur-md shadow-[0_10px_34px_rgba(2,6,23,0.05)] px-4 py-3 dark:bg-[#020617]/60 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out`
- `flex flex-wrap items-center gap-2`
- `#collect`
- `1. Collect`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `sticky` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-[72px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-40` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]/70` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `shadow-[0_10px_34px_rgba(2,6,23,0.05)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#020617]/60` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `#collect` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `1.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Collect` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:96`

```jsx
          <div className="rounded-2xl border border-slate-200 bg-[#ffffff]/70 backdrop-blur-md shadow-[0_10px_34px_rgba(2,6,23,0.05)] px-4 py-3 dark:bg-[#020617]/60 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out">
            <div className="flex flex-wrap items-center gap-2">
              <TocLink href="#collect" label="1. Collect" />
              <TocLink href="#use" label="2. Use" />
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-[#ffffff]/70 backdrop-blur-md shadow-[0_10px_34px_rgba(2,6,23,0.05)] px-4 py-3 dark:bg-[#020617]/60 dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/10 transition-colors duration-500 ease-in-out`
- `flex flex-wrap items-center gap-2`
- `#collect`
- `1. Collect`
- `#use`
- `2. Use`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]/70` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `shadow-[0_10px_34px_rgba(2,6,23,0.05)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#020617]/60` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `#collect` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `1.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Collect` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#use` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `2.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Use` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:97`

```jsx
            <div className="flex flex-wrap items-center gap-2">
              <TocLink href="#collect" label="1. Collect" />
              <TocLink href="#use" label="2. Use" />
              <TocLink href="#fraud" label="3. Fraud" />
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center gap-2`
- `#collect`
- `1. Collect`
- `#use`
- `2. Use`
- `#fraud`
- `3. Fraud`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `#collect` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `1.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Collect` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#use` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `2.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Use` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#fraud` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `3.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Fraud` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:111`

```jsx
        <div className="grid grid-cols-12 gap-6">
          <LegalCard index={0} className="col-span-12" id="collect">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm">
```
**Raw class strings detected (best effort):**

- `grid grid-cols-12 gap-6`
- `col-span-12`
- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm`

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
  - `text-slate-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:112`

```jsx
          <LegalCard index={0} className="col-span-12" id="collect">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm">
                1
```
**Raw class strings detected (best effort):**

- `col-span-12`
- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:113`

```jsx
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm">
                1
              </span>
```
**Raw class strings detected (best effort):**

- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:114`

```jsx
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm">
                1
              </span>
              Information We Collect
```
**Raw class strings detected (best effort):**

- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:120`

```jsx
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Account Data</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
```
**Raw class strings detected (best effort):**

- `grid grid-cols-12 gap-4`
- `col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10`
- `font-bold text-[#0f172a] dark:text-white mb-3`
- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-12` — Grid layout.
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-5` — Padding (all sides).
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/[0.02]` — Background color/surface.
  - `text-[#0f172a]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:121`

```jsx
              <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Account Data</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Full Name', 'Organization Name', 'Email Address', 'Phone Number', 'Country', 'Verification Docs', 'Account Type'].map((item) => (
```
**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10`
- `font-bold text-[#0f172a] dark:text-white mb-3`
- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `Full Name`
- `Organization Name`
- `Email Address`
- `Phone Number`
- `Country`
- `Verification Docs`
- `Account Type`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/[0.02]` — Background color/surface.
  - `text-[#0f172a]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Name` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Organization` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Email` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Address` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Phone` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Number` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Country` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Docs` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Type` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:122`

```jsx
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Account Data</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Full Name', 'Organization Name', 'Email Address', 'Phone Number', 'Country', 'Verification Docs', 'Account Type'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
```
**Raw class strings detected (best effort):**

- `font-bold text-[#0f172a] dark:text-white mb-3`
- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `Full Name`
- `Organization Name`
- `Email Address`
- `Phone Number`
- `Country`
- `Verification Docs`
- `Account Type`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Name` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Organization` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Email` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Address` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Phone` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Number` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Country` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Docs` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Type` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:123`

```jsx
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Full Name', 'Organization Name', 'Email Address', 'Phone Number', 'Country', 'Verification Docs', 'Account Type'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
```
**Raw class strings detected (best effort):**

- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `Full Name`
- `Organization Name`
- `Email Address`
- `Phone Number`
- `Country`
- `Verification Docs`
- `Account Type`
- `flex items-center gap-2`
- `w-1.5 h-1.5 rounded-full bg-sky-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-sky-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Name` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Organization` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Email` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Address` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Phone` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Number` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Country` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Docs` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Type` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:125`

```jsx
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                      {item}
                    </li>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `w-1.5 h-1.5 rounded-full bg-sky-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-sky-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Privacy.jsx:126`

```jsx
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                      {item}
                    </li>
                  ))}
```
**Raw class strings detected (best effort):**

- `w-1.5 h-1.5 rounded-full bg-sky-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-sky-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Privacy.jsx:133`

```jsx
              <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Business Data</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Product Specifications', 'Design Requirements', 'Order Documents', 'Digital Signature Records'].map((item) => (
```
**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10`
- `font-bold text-[#0f172a] dark:text-white mb-3`
- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `Product Specifications`
- `Design Requirements`
- `Order Documents`
- `Digital Signature Records`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/[0.02]` — Background color/surface.
  - `text-[#0f172a]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Product` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Specifications` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Design` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Requirements` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Order` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Documents` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Digital` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Signature` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Records` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:134`

```jsx
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Business Data</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Product Specifications', 'Design Requirements', 'Order Documents', 'Digital Signature Records'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
```
**Raw class strings detected (best effort):**

- `font-bold text-[#0f172a] dark:text-white mb-3`
- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `Product Specifications`
- `Design Requirements`
- `Order Documents`
- `Digital Signature Records`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Product` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Specifications` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Design` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Requirements` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Order` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Documents` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Digital` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Signature` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Records` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:135`

```jsx
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Product Specifications', 'Design Requirements', 'Order Documents', 'Digital Signature Records'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
```
**Raw class strings detected (best effort):**

- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `Product Specifications`
- `Design Requirements`
- `Order Documents`
- `Digital Signature Records`
- `flex items-center gap-2`
- `w-1.5 h-1.5 rounded-full bg-indigo-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Product` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Specifications` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Design` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Requirements` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Order` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Documents` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Digital` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Signature` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Records` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:137`

```jsx
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {item}
                    </li>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `w-1.5 h-1.5 rounded-full bg-indigo-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Privacy.jsx:138`

```jsx
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {item}
                    </li>
                  ))}
```
**Raw class strings detected (best effort):**

- `w-1.5 h-1.5 rounded-full bg-indigo-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Privacy.jsx:145`

```jsx
              <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Communications</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Chat messages', 'Video/Audio logs', 'Call recordings'].map((item) => (
```
**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10`
- `font-bold text-[#0f172a] dark:text-white mb-3`
- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `Chat messages`
- `Video/Audio logs`
- `Call recordings`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/[0.02]` — Background color/surface.
  - `text-[#0f172a]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Chat` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `messages` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Video/Audio` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `logs` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Call` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `recordings` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:146`

```jsx
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Communications</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Chat messages', 'Video/Audio logs', 'Call recordings'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
```
**Raw class strings detected (best effort):**

- `font-bold text-[#0f172a] dark:text-white mb-3`
- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `Chat messages`
- `Video/Audio logs`
- `Call recordings`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Chat` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `messages` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Video/Audio` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `logs` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Call` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `recordings` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:147`

```jsx
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Chat messages', 'Video/Audio logs', 'Call recordings'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
```
**Raw class strings detected (best effort):**

- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `Chat messages`
- `Video/Audio logs`
- `Call recordings`
- `flex items-center gap-2`
- `w-1.5 h-1.5 rounded-full bg-emerald-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Chat` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `messages` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Video/Audio` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `logs` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Call` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `recordings` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:149`

```jsx
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {item}
                    </li>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `w-1.5 h-1.5 rounded-full bg-emerald-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Privacy.jsx:150`

```jsx
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {item}
                    </li>
                  ))}
```
**Raw class strings detected (best effort):**

- `w-1.5 h-1.5 rounded-full bg-emerald-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Privacy.jsx:157`

```jsx
              <div className="col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Technical Information</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['IP address', 'Device/Browser type', 'Usage activity', 'Search history'].map((item) => (
```
**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6 rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10`
- `font-bold text-[#0f172a] dark:text-white mb-3`
- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `IP address`
- `Device/Browser type`
- `Usage activity`
- `Search history`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `history` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/[0.02]` — Background color/surface.
  - `text-[#0f172a]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `IP` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `address` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Device/Browser` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `type` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Usage` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `activity` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Search` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:158`

```jsx
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Technical Information</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['IP address', 'Device/Browser type', 'Usage activity', 'Search history'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
```
**Raw class strings detected (best effort):**

- `font-bold text-[#0f172a] dark:text-white mb-3`
- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `IP address`
- `Device/Browser type`
- `Usage activity`
- `Search history`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `history` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `IP` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `address` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Device/Browser` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `type` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Usage` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `activity` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Search` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:159`

```jsx
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['IP address', 'Device/Browser type', 'Usage activity', 'Search history'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
```
**Raw class strings detected (best effort):**

- `space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`
- `IP address`
- `Device/Browser type`
- `Usage activity`
- `Search history`
- `flex items-center gap-2`
- `w-1.5 h-1.5 rounded-full bg-amber-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `history` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `IP` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `address` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Device/Browser` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `type` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Usage` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `activity` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Search` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:161`

```jsx
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      {item}
                    </li>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `w-1.5 h-1.5 rounded-full bg-amber-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-amber-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Privacy.jsx:162`

```jsx
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      {item}
                    </li>
                  ))}
```
**Raw class strings detected (best effort):**

- `w-1.5 h-1.5 rounded-full bg-amber-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-amber-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Privacy.jsx:171`

```jsx
          <LegalCard index={1} className="col-span-12" id="use">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm">
                2
```
**Raw class strings detected (best effort):**

- `col-span-12`
- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:172`

```jsx
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm">
                2
              </span>
```
**Raw class strings detected (best effort):**

- `text-xl md:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-4 flex items-center gap-3`
- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:173`

```jsx
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm">
                2
              </span>
              How We Use Your Information
```
**Raw class strings detected (best effort):**

- `flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-transparent dark:ring-1 dark:ring-white/10 text-sm`

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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:179`

```jsx
            <div className="rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10">
              <ul className="grid md:grid-cols-2 gap-4 list-none p-0 m-0">
                {[
                  'Account Management',
```
**Raw class strings detected (best effort):**

- `rounded-2xl p-5 bg-black/[0.02] border border-slate-200 dark:bg-white/5 dark:border-transparent dark:ring-1 dark:ring-white/10`
- `grid md:grid-cols-2 gap-4 list-none p-0 m-0`
- `Account Management`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Color / surface:**
  - `bg-black/[0.02]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Management` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:180`

```jsx
              <ul className="grid md:grid-cols-2 gap-4 list-none p-0 m-0">
                {[
                  'Account Management',
                  'Order Matching',
```
**Raw class strings detected (best effort):**

- `grid md:grid-cols-2 gap-4 list-none p-0 m-0`
- `Account Management`
- `Order Matching`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Management` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Order` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Matching` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:190`

```jsx
                  <li key={item} className="flex items-center gap-3 text-sm md:text-base font-medium rounded-xl px-3 py-2">
                    <span className="text-sky-600 dark:text-sky-300">✓</span>
                    {item}
                  </li>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3 text-sm md:text-base font-medium rounded-xl px-3 py-2`
- `text-sky-600 dark:text-sky-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sky-600` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-sky-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:191`

```jsx
                    <span className="text-sky-600 dark:text-sky-300">✓</span>
                    {item}
                  </li>
                ))}
```
**Raw class strings detected (best effort):**

- `text-sky-600 dark:text-sky-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sky-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-sky-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:201`

```jsx
            className="col-span-12 dark:bg-[#0b1220] dark:text-white dark:ring-1 dark:ring-white/10"
            id="fraud"
          >
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-[#0f172a] dark:text-white">3. Fraud Prevention Measures</h2>
```
**Raw class strings detected (best effort):**

- `col-span-12 dark:bg-[#0b1220] dark:text-white dark:ring-1 dark:ring-white/10`
- `fraud`
- `text-xl md:text-2xl font-bold tracking-tight mb-4 text-[#0f172a] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#0b1220]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `fraud` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:204`

```jsx
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-[#0f172a] dark:text-white">3. Fraud Prevention Measures</h2>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-slate-700 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0">
              {[
                'Identity verification process',
```
**Raw class strings detected (best effort):**

- `text-xl md:text-2xl font-bold tracking-tight mb-4 text-[#0f172a] dark:text-white`
- `grid md:grid-cols-2 gap-x-8 gap-y-4 text-slate-700 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0`
- `Identity verification process`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-x-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:text-2xl` — Variant prefix (responsive, dark, or interaction state).
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white/85` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Identity` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `process` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:205`

```jsx
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-slate-700 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0">
              {[
                'Identity verification process',
                'Secure digital contracts',
```
**Raw class strings detected (best effort):**

- `grid md:grid-cols-2 gap-x-8 gap-y-4 text-slate-700 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0`
- `Identity verification process`
- `Secure digital contracts`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-x-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
  - `m-0` — Margin (all sides).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white/85` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Identity` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `process` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Secure` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `digital` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `contracts` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:215`

```jsx
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 bg-black/5 dark:bg-white/10 p-1 rounded-full">
                    <svg className="w-3 h-3 text-indigo-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
```
**Raw class strings detected (best effort):**

- `flex items-start gap-3`
- `mt-1 bg-black/5 dark:bg-white/10 p-1 rounded-full`
- `w-3 h-3 text-indigo-700 dark:text-white`
- `round`
- `3`
- `M5 13l4 4L19 7`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-1` — Padding (all sides).
- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/5` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `round` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `M5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `13l4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `4L19` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:216`

```jsx
                  <span className="mt-1 bg-black/5 dark:bg-white/10 p-1 rounded-full">
                    <svg className="w-3 h-3 text-indigo-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
```
**Raw class strings detected (best effort):**

- `mt-1 bg-black/5 dark:bg-white/10 p-1 rounded-full`
- `w-3 h-3 text-indigo-700 dark:text-white`
- `round`
- `3`
- `M5 13l4 4L19 7`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-1` — Padding (all sides).
- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/5` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `round` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `M5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `13l4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `4L19` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:217`

```jsx
                    <svg className="w-3 h-3 text-indigo-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
```
**Raw class strings detected (best effort):**

- `w-3 h-3 text-indigo-700 dark:text-white`
- `round`
- `3`
- `M5 13l4 4L19 7`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `round` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `M5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `13l4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `4L19` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:259`

```jsx
            <LegalCard key={item.id} index={3 + idx} id={item.anchor} className="col-span-12 md:col-span-6">
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-3">
                {item.id}. {item.title}
              </h2>
```
**Raw class strings detected (best effort):**

- `col-span-12 md:col-span-6`
- `text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:260`

```jsx
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-3">
                {item.id}. {item.title}
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">{item.text}</p>
```
**Raw class strings detected (best effort):**

- `text-lg md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white mb-3`
- `text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
  - `md:text-xl` — Variant prefix (responsive, dark, or interaction state).
  - `md:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:263`

```jsx
              <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">{item.text}</p>
            </LegalCard>
          ))}

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

#### `src/pages/Privacy.jsx:267`

```jsx
          <LegalCard index={8} className="col-span-12 dark:bg-[#0b1220] dark:text-white" id="contact">
            <h2 className="text-xl font-bold mb-4 text-[#0f172a] dark:text-white">13. Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
```
**Raw class strings detected (best effort):**

- `col-span-12 dark:bg-[#0b1220] dark:text-white`
- `text-xl font-bold mb-4 text-[#0f172a] dark:text-white`
- `grid md:grid-cols-2 gap-6`
- `space-y-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#0b1220]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:268`

```jsx
            <h2 className="text-xl font-bold mb-4 text-[#0f172a] dark:text-white">13. Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-slate-500 dark:text-white/60 text-sm">Direct Support</p>
```
**Raw class strings detected (best effort):**

- `text-xl font-bold mb-4 text-[#0f172a] dark:text-white`
- `grid md:grid-cols-2 gap-6`
- `space-y-1`
- `text-slate-500 dark:text-white/60 text-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0f172a]` — Text color or text sizing.
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white/60` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:269`

```jsx
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-slate-500 dark:text-white/60 text-sm">Direct Support</p>
                <p className="font-bold underline decoration-sky-500 underline-offset-4">support@gartexhub.com</p>
```
**Raw class strings detected (best effort):**

- `grid md:grid-cols-2 gap-6`
- `space-y-1`
- `text-slate-500 dark:text-white/60 text-sm`
- `font-bold underline decoration-sky-500 underline-offset-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white/60` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `decoration-sky-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `underline-offset-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:270`

```jsx
              <div className="space-y-1">
                <p className="text-slate-500 dark:text-white/60 text-sm">Direct Support</p>
                <p className="font-bold underline decoration-sky-500 underline-offset-4">support@gartexhub.com</p>
              </div>
```
**Raw class strings detected (best effort):**

- `space-y-1`
- `text-slate-500 dark:text-white/60 text-sm`
- `font-bold underline decoration-sky-500 underline-offset-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-white/60` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `decoration-sky-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `underline-offset-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:271`

```jsx
                <p className="text-slate-500 dark:text-white/60 text-sm">Direct Support</p>
                <p className="font-bold underline decoration-sky-500 underline-offset-4">support@gartexhub.com</p>
              </div>
              <div className="flex gap-4 items-center">
```
**Raw class strings detected (best effort):**

- `text-slate-500 dark:text-white/60 text-sm`
- `font-bold underline decoration-sky-500 underline-offset-4`
- `flex gap-4 items-center`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-white/60` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `decoration-sky-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `underline-offset-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:272`

```jsx
                <p className="font-bold underline decoration-sky-500 underline-offset-4">support@gartexhub.com</p>
              </div>
              <div className="flex gap-4 items-center">
                <a
```
**Raw class strings detected (best effort):**

- `font-bold underline decoration-sky-500 underline-offset-4`
- `flex gap-4 items-center`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `decoration-sky-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `underline-offset-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:274`

```jsx
              <div className="flex gap-4 items-center">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-black/5 hover:bg-black/10 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white transition-colors"
```
**Raw class strings detected (best effort):**

- `flex gap-4 items-center`
- `#`
- `p-2 rounded-lg bg-black/5 hover:bg-black/10 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white transition-colors`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/5` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-black/10` — Variant prefix (responsive, dark, or interaction state).
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `#` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Privacy.jsx:277`

```jsx
                  className="p-2 rounded-lg bg-black/5 hover:bg-black/10 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white transition-colors"
                >
                  LinkedIn
                </a>
```
**Raw class strings detected (best effort):**

- `p-2 rounded-lg bg-black/5 hover:bg-black/10 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white transition-colors`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/5` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-black/10` — Variant prefix (responsive, dark, or interaction state).
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:283`

```jsx
                  className="p-2 rounded-lg bg-black/5 hover:bg-black/10 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white transition-colors"
                >
                  Facebook
                </a>
```
**Raw class strings detected (best effort):**

- `p-2 rounded-lg bg-black/5 hover:bg-black/10 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white transition-colors`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-2` — Padding (all sides).
- **Typography:**
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/5` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-black/10` — Variant prefix (responsive, dark, or interaction state).
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:295`

```jsx
            className="col-span-12 text-center"
          >
            <div className="rounded-2xl p-6 bg-[#ffffff] border border-slate-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
```
**Raw class strings detected (best effort):**

- `col-span-12 text-center`
- `rounded-2xl p-6 bg-[#ffffff] border border-slate-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#0f172a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:297`

```jsx
            <div className="rounded-2xl p-6 bg-[#ffffff] border border-slate-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                © 2026 GARTEXHUB PROFESSIONAL NETWORK. ALL RIGHTS RESERVE
              </p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl p-6 bg-[#ffffff] border border-slate-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#0f172a] dark:border-transparent dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors duration-500 ease-in-out`
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
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#0f172a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Privacy.jsx:298`

```jsx
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                © 2026 GARTEXHUB PROFESSIONAL NETWORK. ALL RIGHTS RESERVE
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

- `src/pages/Privacy.jsx:122` — Account Data

```jsx
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Account Data</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Full Name', 'Organization Name', 'Email Address', 'Phone Number', 'Country', 'Verification Docs', 'Account Type'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
```
- `src/pages/Privacy.jsx:134` — Business Data

```jsx
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Business Data</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Product Specifications', 'Design Requirements', 'Order Documents', 'Digital Signature Records'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
```
- `src/pages/Privacy.jsx:146` — Communications

```jsx
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Communications</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['Chat messages', 'Video/Audio logs', 'Call recordings'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
```
- `src/pages/Privacy.jsx:158` — Technical Information

```jsx
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-3">Technical Information</h3>
                <ul className="space-y-2 list-none p-0 m-0 text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {['IP address', 'Device/Browser type', 'Usage activity', 'Search history'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
```
- `src/pages/Privacy.jsx:191` — ✓

```jsx
                    <span className="text-sky-600 dark:text-sky-300">✓</span>
                    {item}
                  </li>
                ))}
```
- `src/pages/Privacy.jsx:204` — 3. Fraud Prevention Measures

```jsx
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-[#0f172a] dark:text-white">3. Fraud Prevention Measures</h2>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-slate-700 dark:text-white/85 text-sm md:text-base leading-relaxed list-none p-0 m-0">
              {[
                'Identity verification process',
```
- `src/pages/Privacy.jsx:268` — 13. Contact Information

```jsx
            <h2 className="text-xl font-bold mb-4 text-[#0f172a] dark:text-white">13. Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-slate-500 dark:text-white/60 text-sm">Direct Support</p>
```
- `src/pages/Privacy.jsx:271` — Direct Support

```jsx
                <p className="text-slate-500 dark:text-white/60 text-sm">Direct Support</p>
                <p className="font-bold underline decoration-sky-500 underline-offset-4">support@gartexhub.com</p>
              </div>
              <div className="flex gap-4 items-center">
```
- `src/pages/Privacy.jsx:272` — support@gartexhub.com

```jsx
                <p className="font-bold underline decoration-sky-500 underline-offset-4">support@gartexhub.com</p>
              </div>
              <div className="flex gap-4 items-center">
                <a
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

_No API calls detected in this page._

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/Privacy.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

