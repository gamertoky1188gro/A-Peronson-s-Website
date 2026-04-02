{% raw %}
# Pricing - Route `/pricing`

**Access:** Public

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/Pricing.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/Pricing.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_Pricing.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/Pricing.jsx:29)
- ../components/ui/MagneticButton (src/pages/Pricing.jsx:30)
- ../components/ui/SpotlightCard (src/pages/Pricing.jsx:31)

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

#### `src/pages/Pricing.jsx:48`

```jsx
  return <div className={['skeleton', className].join(' ')} />
}

function MotionItem({ index, className = '', children }) {
```
**Raw class strings detected (best effort):**

- `skeleton`
- ` `

**Utility breakdown (grouped):**

- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:54`

```jsx
  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
```
**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**


#### `src/pages/Pricing.jsx:58`

```jsx
      className={className}
      // Bento entrance: fade + slide up (20px) with a small stagger per index.
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
```
**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**


#### `src/pages/Pricing.jsx:210`

```jsx
    <div className="relative min-h-screen overflow-x-hidden bg-[#fafafa] text-[#09090b] dark:bg-[#09090b] dark:text-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
```
**Raw class strings detected (best effort):**

- `relative min-h-screen overflow-x-hidden bg-[#fafafa] text-[#09090b] dark:bg-[#09090b] dark:text-[#fafafa]`
- `mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8`
- `grid gap-10 lg:grid-cols-12 lg:items-start`
- `lg:col-span-7`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-x-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `pb-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pt-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#fafafa]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:px-6` — Variant prefix (responsive, dark, or interaction state).
  - `lg:px-8` — Variant prefix (responsive, dark, or interaction state).
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-start` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#09090b]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:211`

```jsx
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
```
**Raw class strings detected (best effort):**

- `mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8`
- `grid gap-10 lg:grid-cols-12 lg:items-start`
- `lg:col-span-7`
- `text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `pb-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pt-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:px-6` — Variant prefix (responsive, dark, or interaction state).
  - `lg:px-8` — Variant prefix (responsive, dark, or interaction state).
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-start` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:212`

```jsx
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
              Pricing
```
**Raw class strings detected (best effort):**

- `grid gap-10 lg:grid-cols-12 lg:items-start`
- `lg:col-span-7`
- `text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-start` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:213`

```jsx
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
              Pricing
            </p>
```
**Raw class strings detected (best effort):**

- `lg:col-span-7`
- `text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Responsive variants:**
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:214`

```jsx
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
              Pricing
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] sm:text-5xl">
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]`
- `mt-3 text-4xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] sm:text-5xl`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-4xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
  - `text-[#09090b]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:text-5xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:217`

```jsx
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] sm:text-5xl">
              Clear plans for serious sourcing teams
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
```
**Raw class strings detected (best effort):**

- `mt-3 text-4xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa] sm:text-5xl`
- `mt-4 max-w-xl text-[15px] leading-relaxed text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-4xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[15px]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:text-5xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:220`

```jsx
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
              Borderless surfaces, verified signals, and export-ready reporting — built for buying houses and factories.
            </p>

```
**Raw class strings detected (best effort):**

- `mt-4 max-w-xl text-[15px] leading-relaxed text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[15px]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:224`

```jsx
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton
                to="/signup"
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none"
```
**Raw class strings detected (best effort):**

- `mt-8 flex flex-wrap gap-3`
- `/signup`
- `shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#3b82f6]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_10px_28px_rgba(59,130,246,0.25)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:brightness-105` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `/signup` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:227`

```jsx
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none"
              >
                Create your organization
              </MagneticButton>
```
**Raw class strings detected (best effort):**

- `shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#3b82f6]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_10px_28px_rgba(59,130,246,0.25)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:brightness-105` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:233`

```jsx
                className="inline-flex items-center justify-center rounded-md bg-[rgba(9,9,11,0.06)] px-5 py-3 text-sm font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
              >
                View plans
              </MagneticButton>
```
**Raw class strings detected (best effort):**

- `inline-flex items-center justify-center rounded-md bg-[rgba(9,9,11,0.06)] px-5 py-3 text-sm font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[rgba(9,9,11,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-[rgba(250,250,250,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:240`

```jsx
          <MotionItem index={0} className="lg:col-span-5">
            <SpotlightCard
              className={[
                'rounded-xl p-6',
```
**Raw class strings detected (best effort):**

- `lg:col-span-5`
- `rounded-xl p-6`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:242`

```jsx
              className={[
                'rounded-xl p-6',
                'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-6`
- `bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`
- `dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[#18181b]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-[#27272a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:251`

```jsx
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#09090b] dark:text-[#fafafa]">Analytics snapshot</p>
                <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                  Live
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between`
- `text-sm font-semibold text-[#09090b] dark:text-[#fafafa]`
- `rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:252`

```jsx
                <p className="text-sm font-semibold text-[#09090b] dark:text-[#fafafa]">Analytics snapshot</p>
                <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                  Live
                </span>
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-[#09090b] dark:text-[#fafafa]`
- `rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:253`

```jsx
                <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                  Live
                </span>
              </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:258`

```jsx
                <p className="mt-3 text-xs text-[#a1a1aa]">Analytics unavailable — showing defaults.</p>
              ) : null}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
```
**Raw class strings detected (best effort):**

- `mt-3 text-xs text-[#a1a1aa]`
- `mt-5 grid gap-3 sm:grid-cols-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#a1a1aa]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:260`

```jsx
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
                  <div
                    key={tile.label}
```
**Raw class strings detected (best effort):**

- `mt-5 grid gap-3 sm:grid-cols-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:264`

```jsx
                    className="rounded-lg bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]"
                  >
                    {loading ? (
                      <>
```
**Raw class strings detected (best effort):**

- `rounded-lg bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.04)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.04)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:268`

```jsx
                        <Skeleton className="h-3 w-24 rounded" />
                        <Skeleton className="mt-3 h-7 w-16 rounded" />
                        <Skeleton className="mt-3 h-3 w-28 rounded" />
                      </>
```
**Raw class strings detected (best effort):**

- `h-3 w-24 rounded`
- `mt-3 h-7 w-16 rounded`
- `mt-3 h-3 w-28 rounded`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded` — Corner radius.

#### `src/pages/Pricing.jsx:269`

```jsx
                        <Skeleton className="mt-3 h-7 w-16 rounded" />
                        <Skeleton className="mt-3 h-3 w-28 rounded" />
                      </>
                    ) : (
```
**Raw class strings detected (best effort):**

- `mt-3 h-7 w-16 rounded`
- `mt-3 h-3 w-28 rounded`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded` — Corner radius.

#### `src/pages/Pricing.jsx:270`

```jsx
                        <Skeleton className="mt-3 h-3 w-28 rounded" />
                      </>
                    ) : (
                      <>
```
**Raw class strings detected (best effort):**

- `mt-3 h-3 w-28 rounded`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded` — Corner radius.

#### `src/pages/Pricing.jsx:274`

```jsx
                        <p className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">{tile.label}</p>
                        <p className={['mt-2 text-2xl font-bold tracking-tight', accentClasses(tile.accent)].join(' ')}>
                          {tile.value}
                        </p>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]`
- `mt-2 text-2xl font-bold tracking-tight`
- ` `

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:275`

```jsx
                        <p className={['mt-2 text-2xl font-bold tracking-tight', accentClasses(tile.accent)].join(' ')}>
                          {tile.value}
                        </p>
                        <p className="mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">{tile.sublabel}</p>
```
**Raw class strings detected (best effort):**

- `mt-2 text-2xl font-bold tracking-tight`
- ` `
- `mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:278`

```jsx
                        <p className="mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">{tile.sublabel}</p>
                      </>
                    )}
                  </div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:288`

```jsx
        <div className="mt-16" id="plans">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Simple, transparent pricing</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
```
**Raw class strings detected (best effort):**

- `mt-16`
- `text-center`
- `text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:289`

```jsx
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Simple, transparent pricing</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
              Choose the surface you need today — upgrade when your team scales.
```
**Raw class strings detected (best effort):**

- `text-center`
- `text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:290`

```jsx
            <h2 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Simple, transparent pricing</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
              Choose the surface you need today — upgrade when your team scales.
            </p>
```
**Raw class strings detected (best effort):**

- `text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:291`

```jsx
            <p className="mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
              Choose the surface you need today — upgrade when your team scales.
            </p>
          </div>
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:297`

```jsx
            <div className="mx-auto mt-8 max-w-3xl rounded-xl bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">Preview:</span>
```
**Raw class strings detected (best effort):**

- `mx-auto mt-8 max-w-3xl rounded-xl bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]`
- `flex flex-wrap items-center justify-between gap-3`
- `flex items-center gap-2`
- `text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `mt-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.04)]` — Background color/surface.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.04)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:298`

```jsx
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">Preview:</span>
                  <button
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-3`
- `flex items-center gap-2`
- `text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:299`

```jsx
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">Preview:</span>
                  <button
                    type="button"
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:300`

```jsx
                  <span className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">Preview:</span>
                  <button
                    type="button"
                    onClick={() => {
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:307`

```jsx
                    className="rounded-md bg-[#ffffff] px-3 py-2 text-xs font-semibold text-[#09090b] shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 dark:bg-[#18181b] dark:text-[#fafafa] dark:shadow-none"
                  >
                    {effectiveLoggedIn ? 'Sign out' : 'Mock sign in'}
                  </button>
```
**Raw class strings detected (best effort):**

- `rounded-md bg-[#ffffff] px-3 py-2 text-xs font-semibold text-[#09090b] shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 dark:bg-[#18181b] dark:text-[#fafafa] dark:shadow-none`
- `Sign out`
- `Mock sign in`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_4px_16px_rgba(0,0,0,0.06)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:-translate-y-0.5` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#18181b]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Sign` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Mock` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `sign` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `in` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:314`

```jsx
                  <div className="flex flex-wrap gap-2">
                    {accountTypes.map((t) => (
                      <button
                        key={t}
```
**Raw class strings detected (best effort):**

- `flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:320`

```jsx
                        className={[
                          'rounded-md px-3 py-2 text-xs font-semibold transition',
                          accountType === t
                            ? 'bg-[#3b82f6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)]'
```
**Raw class strings detected (best effort):**

- `rounded-md px-3 py-2 text-xs font-semibold transition`
- `bg-[#3b82f6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#3b82f6]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_10px_24px_rgba(59,130,246,0.24)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:334`

```jsx
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusChip[verificationStatus]].join(' ')}>
                  {statusLabel[verificationStatus]}
                </span>
```
**Raw class strings detected (best effort):**

- `mt-4 flex flex-wrap items-center gap-2`
- `inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold`
- ` `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Pricing.jsx:335`

```jsx
                <span className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusChip[verificationStatus]].join(' ')}>
                  {statusLabel[verificationStatus]}
                </span>
                <span className="text-xs text-[#52525b] dark:text-[#a1a1aa]">Remaining: {Math.max(0, remainingDays)} day(s)</span>
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold`
- ` `
- `text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:338`

```jsx
                <span className="text-xs text-[#52525b] dark:text-[#a1a1aa]">Remaining: {Math.max(0, remainingDays)} day(s)</span>
                <button
                  type="button"
                  onClick={() => setRemainingDays((d) => d - 1)}
```
**Raw class strings detected (best effort):**

- `text-xs text-[#52525b] dark:text-[#a1a1aa]`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:342`

```jsx
                  className="rounded-md bg-[rgba(9,9,11,0.06)] px-3 py-2 text-xs font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
                >
                  -1 day
                </button>
```
**Raw class strings detected (best effort):**

- `rounded-md bg-[rgba(9,9,11,0.06)] px-3 py-2 text-xs font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[rgba(9,9,11,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-[rgba(250,250,250,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:349`

```jsx
                  className="rounded-md bg-[rgba(9,9,11,0.06)] px-3 py-2 text-xs font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
                >
                  +1 day
                </button>
```
**Raw class strings detected (best effort):**

- `rounded-md bg-[rgba(9,9,11,0.06)] px-3 py-2 text-xs font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[rgba(9,9,11,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-[rgba(250,250,250,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:357`

```jsx
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <MotionItem index={1}>
              <SpotlightCard
                className={[
```
**Raw class strings detected (best effort):**

- `mt-10 grid gap-6 lg:grid-cols-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:360`

```jsx
                className={[
                  'rounded-xl p-7',
                  'bg-[rgba(9,9,11,0.02)] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                  'transition duration-300 ease-out',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[rgba(9,9,11,0.02)] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`
- `transition duration-300 ease-out`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.02)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:369`

```jsx
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Free</h3>
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Start with essential workflow.</p>
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-6`
- `text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:371`

```jsx
                    <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Free</h3>
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Start with essential workflow.</p>
                  </div>
                  <div className="text-right">
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `text-right`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-right` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:372`

```jsx
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Start with essential workflow.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$0</p>
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `text-right`
- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-right` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
  - `text-[#09090b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:374`

```jsx
                  <div className="text-right">
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$0</p>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
```
**Raw class strings detected (best effort):**

- `text-right`
- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-right` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:375`

```jsx
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$0</p>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>
```
**Raw class strings detected (best effort):**

- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:376`

```jsx
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>

```
**Raw class strings detected (best effort):**

- `text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:380`

```jsx
                <ul className="mt-6 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  {freeFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(9,9,11,0.06)] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
```
**Raw class strings detected (best effort):**

- `mt-6 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `flex items-start gap-2`
- `mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(9,9,11,0.06)] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:382`

```jsx
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(9,9,11,0.06)] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                        <Minus className="h-3 w-3" />
                      </span>
```
**Raw class strings detected (best effort):**

- `flex items-start gap-2`
- `mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(9,9,11,0.06)] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]`
- `h-3 w-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:383`

```jsx
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(9,9,11,0.06)] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                        <Minus className="h-3 w-3" />
                      </span>
                      <span>{f}</span>
```
**Raw class strings detected (best effort):**

- `mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(9,9,11,0.06)] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]`
- `h-3 w-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:384`

```jsx
                        <Minus className="h-3 w-3" />
                      </span>
                      <span>{f}</span>
                    </li>
```
**Raw class strings detected (best effort):**

- `h-3 w-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:391`

```jsx
                <div className="mt-7">
                  <MagneticButton
                    to="/signup"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[rgba(9,9,11,0.06)] px-5 py-3 text-sm font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
```
**Raw class strings detected (best effort):**

- `mt-7`
- `/signup`
- `inline-flex w-full items-center justify-center rounded-md bg-[rgba(9,9,11,0.06)] px-5 py-3 text-sm font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[rgba(9,9,11,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-[rgba(250,250,250,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `/signup` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:394`

```jsx
                    className="inline-flex w-full items-center justify-center rounded-md bg-[rgba(9,9,11,0.06)] px-5 py-3 text-sm font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
                  >
                    Get started
                  </MagneticButton>
```
**Raw class strings detected (best effort):**

- `inline-flex w-full items-center justify-center rounded-md bg-[rgba(9,9,11,0.06)] px-5 py-3 text-sm font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[rgba(9,9,11,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-[rgba(250,250,250,0.08)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:404`

```jsx
                className={[
                  'conic-beam rounded-xl p-7',
                  'bg-[rgba(255,255,255,0.70)] backdrop-blur-[12px]',
                  'border border-black/5 shadow-[0_10px_38px_-18px_rgba(0,0,0,0.22)]',
```
**Raw class strings detected (best effort):**

- `conic-beam rounded-xl p-7`
- `bg-[rgba(255,255,255,0.70)] backdrop-blur-[12px]`
- `border border-black/5 shadow-[0_10px_38px_-18px_rgba(0,0,0,0.22)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[rgba(255,255,255,0.70)]` — Background color/surface.
  - `backdrop-blur-[12px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-black/5` — Border style/width/color.
  - `shadow-[0_10px_38px_-18px_rgba(0,0,0,0.22)]` — Drop shadow depth (elevation).
- **Other:**
  - `conic-beam` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:414`

```jsx
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Premium</h3>
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-6`
- `flex items-center gap-2`
- `text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:416`

```jsx
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Premium</h3>
                      <span className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusChip[verificationStatus]].join(' ')}>
                        {statusLabel[verificationStatus]}
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold`
- ` `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:417`

```jsx
                      <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Premium</h3>
                      <span className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusChip[verificationStatus]].join(' ')}>
                        {statusLabel[verificationStatus]}
                      </span>
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold`
- ` `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:418`

```jsx
                      <span className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusChip[verificationStatus]].join(' ')}>
                        {statusLabel[verificationStatus]}
                      </span>
                    </div>
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold`
- ` `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Pricing.jsx:422`

```jsx
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Built for buying houses & enterprise teams.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$199</p>
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `text-right`
- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-right` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
  - `text-[#09090b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:424`

```jsx
                  <div className="text-right">
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$199</p>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
```
**Raw class strings detected (best effort):**

- `text-right`
- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-right` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:425`

```jsx
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$199</p>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>
```
**Raw class strings detected (best effort):**

- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:426`

```jsx
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>

```
**Raw class strings detected (best effort):**

- `text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:430`

```jsx
                <ul className="mt-6 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  {premiumFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-[#2dd4bf]">
```
**Raw class strings detected (best effort):**

- `mt-6 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `flex items-start gap-2`
- `mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-[#2dd4bf]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
  - `bg-[rgba(45,212,191,0.14)]` — Background color/surface.
  - `text-[#2dd4bf]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:432`

```jsx
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-[#2dd4bf]">
                        <Check className="h-3 w-3" />
                      </span>
```
**Raw class strings detected (best effort):**

- `flex items-start gap-2`
- `mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-[#2dd4bf]`
- `h-3 w-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(45,212,191,0.14)]` — Background color/surface.
  - `text-[#2dd4bf]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Pricing.jsx:433`

```jsx
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-[#2dd4bf]">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{f}</span>
```
**Raw class strings detected (best effort):**

- `mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(45,212,191,0.14)] text-[#2dd4bf]`
- `h-3 w-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(45,212,191,0.14)]` — Background color/surface.
  - `text-[#2dd4bf]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Pricing.jsx:434`

```jsx
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{f}</span>
                    </li>
```
**Raw class strings detected (best effort):**

- `h-3 w-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:441`

```jsx
                <div className="mt-7">
                  <MagneticButton
                    to="/signup"
                    className="shimmer-btn inline-flex w-full items-center justify-center rounded-md bg-[#2dd4bf] px-5 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none"
```
**Raw class strings detected (best effort):**

- `mt-7`
- `/signup`
- `shimmer-btn inline-flex w-full items-center justify-center rounded-md bg-[#2dd4bf] px-5 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#2dd4bf]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_12px_34px_rgba(45,212,191,0.22)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:brightness-105` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `/signup` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:444`

```jsx
                    className="shimmer-btn inline-flex w-full items-center justify-center rounded-md bg-[#2dd4bf] px-5 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none"
                  >
                    Choose premium
                  </MagneticButton>
```
**Raw class strings detected (best effort):**

- `shimmer-btn inline-flex w-full items-center justify-center rounded-md bg-[#2dd4bf] px-5 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#2dd4bf]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_12px_34px_rgba(45,212,191,0.22)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:brightness-105` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:454`

```jsx
        <div className="mt-16">
          <div className="grid gap-6 md:grid-cols-6">
            <MotionItem index={3} className="md:col-span-3">
              <SpotlightCard
```
**Raw class strings detected (best effort):**

- `mt-16`
- `grid gap-6 md:grid-cols-6`
- `md:col-span-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:grid-cols-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:col-span-3` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:455`

```jsx
          <div className="grid gap-6 md:grid-cols-6">
            <MotionItem index={3} className="md:col-span-3">
              <SpotlightCard
                className={[
```
**Raw class strings detected (best effort):**

- `grid gap-6 md:grid-cols-6`
- `md:col-span-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:grid-cols-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:col-span-3` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:456`

```jsx
            <MotionItem index={3} className="md:col-span-3">
              <SpotlightCard
                className={[
                  'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `md:col-span-3`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `md:col-span-3` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:458`

```jsx
                className={[
                  'rounded-xl p-7',
                  'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                  'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`
- `dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[#18181b]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-[#27272a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:467`

```jsx
                <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Why enterprise matters</h3>
                <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  When your team scales, structure beats noise. Premium keeps workflows conflict-free and audit-ready.
                </p>
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:468`

```jsx
                <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  When your team scales, structure beats noise. Premium keeps workflows conflict-free and audit-ready.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `mt-5 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:471`

```jsx
                <ul className="mt-5 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  {['Team scale without limits', 'Decision-ready visibility', 'Secure contract trail', 'Verified trust signals'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-[#3b82f6]">
```
**Raw class strings detected (best effort):**

- `mt-5 space-y-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `Team scale without limits`
- `Decision-ready visibility`
- `Secure contract trail`
- `Verified trust signals`
- `flex items-start gap-2`
- `mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-[#3b82f6]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `without` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
  - `bg-[rgba(59,130,246,0.14)]` — Background color/surface.
  - `text-[#3b82f6]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Team` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `scale` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `limits` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Decision-ready` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `visibility` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Secure` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `contract` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `trail` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `trust` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `signals` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:473`

```jsx
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-[#3b82f6]">
                        <Check className="h-3 w-3" />
                      </span>
```
**Raw class strings detected (best effort):**

- `flex items-start gap-2`
- `mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-[#3b82f6]`
- `h-3 w-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(59,130,246,0.14)]` — Background color/surface.
  - `text-[#3b82f6]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Pricing.jsx:474`

```jsx
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-[#3b82f6]">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{item}</span>
```
**Raw class strings detected (best effort):**

- `mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-[#3b82f6]`
- `h-3 w-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(59,130,246,0.14)]` — Background color/surface.
  - `text-[#3b82f6]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/Pricing.jsx:475`

```jsx
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{item}</span>
                    </li>
```
**Raw class strings detected (best effort):**

- `h-3 w-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:484`

```jsx
            <MotionItem index={4} className="md:col-span-3">
              <SpotlightCard
                className={[
                  'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `md:col-span-3`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `md:col-span-3` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:486`

```jsx
                className={[
                  'rounded-xl p-7',
                  'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                  'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`
- `dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[#18181b]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-[#27272a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:495`

```jsx
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Enterprise analytics</h3>
                  <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                    Auto-sorted
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between`
- `text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:496`

```jsx
                  <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Enterprise analytics</h3>
                  <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                    Auto-sorted
                  </span>
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:497`

```jsx
                  <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                    Auto-sorted
                  </span>
                </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.06)]` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.06)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:501`

```jsx
                <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Decision-ready metrics without spreadsheet UI.</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `mt-5 grid gap-3 sm:grid-cols-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:503`

```jsx
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
                    <div
                      key={tile.label}
```
**Raw class strings detected (best effort):**

- `mt-5 grid gap-3 sm:grid-cols-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:507`

```jsx
                      className="rounded-lg bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]"
                    >
                      {loading ? (
                        <>
```
**Raw class strings detected (best effort):**

- `rounded-lg bg-[rgba(9,9,11,0.04)] p-4 dark:bg-[rgba(250,250,250,0.04)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
- **Color / surface:**
  - `bg-[rgba(9,9,11,0.04)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-[rgba(250,250,250,0.04)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:511`

```jsx
                          <Skeleton className="h-3 w-24 rounded" />
                          <Skeleton className="mt-3 h-7 w-14 rounded" />
                          <Skeleton className="mt-3 h-3 w-20 rounded" />
                        </>
```
**Raw class strings detected (best effort):**

- `h-3 w-24 rounded`
- `mt-3 h-7 w-14 rounded`
- `mt-3 h-3 w-20 rounded`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded` — Corner radius.

#### `src/pages/Pricing.jsx:512`

```jsx
                          <Skeleton className="mt-3 h-7 w-14 rounded" />
                          <Skeleton className="mt-3 h-3 w-20 rounded" />
                        </>
                      ) : (
```
**Raw class strings detected (best effort):**

- `mt-3 h-7 w-14 rounded`
- `mt-3 h-3 w-20 rounded`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded` — Corner radius.

#### `src/pages/Pricing.jsx:513`

```jsx
                          <Skeleton className="mt-3 h-3 w-20 rounded" />
                        </>
                      ) : (
                        <>
```
**Raw class strings detected (best effort):**

- `mt-3 h-3 w-20 rounded`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded` — Corner radius.

#### `src/pages/Pricing.jsx:517`

```jsx
                          <p className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">{tile.label}</p>
                          <p className={['mt-2 text-2xl font-bold tracking-tight', accentClasses(tile.accent)].join(' ')}>
                            {tile.value}
                          </p>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]`
- `mt-2 text-2xl font-bold tracking-tight`
- ` `

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:518`

```jsx
                          <p className={['mt-2 text-2xl font-bold tracking-tight', accentClasses(tile.accent)].join(' ')}>
                            {tile.value}
                          </p>
                          <p className="mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">{tile.sublabel}</p>
```
**Raw class strings detected (best effort):**

- `mt-2 text-2xl font-bold tracking-tight`
- ` `
- `mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:521`

```jsx
                          <p className="mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">{tile.sublabel}</p>
                        </>
                      )}
                    </div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:532`

```jsx
        <div className="mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Feature comparison</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Horizontal lines only. Clear, audit-ready differences.</p>
```
**Raw class strings detected (best effort):**

- `mt-16`
- `text-center`
- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:533`

```jsx
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Feature comparison</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Horizontal lines only. Clear, audit-ready differences.</p>
          </div>
```
**Raw class strings detected (best effort):**

- `text-center`
- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:534`

```jsx
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Feature comparison</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Horizontal lines only. Clear, audit-ready differences.</p>
          </div>

```
**Raw class strings detected (best effort):**

- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:535`

```jsx
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Horizontal lines only. Clear, audit-ready differences.</p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none">
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `mt-6 overflow-x-auto rounded-xl bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `overflow-x-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[#18181b]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-[#27272a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:538`

```jsx
          <div className="mt-6 overflow-x-auto rounded-xl bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
```
**Raw class strings detected (best effort):**

- `mt-6 overflow-x-auto rounded-xl bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none`
- `min-w-full text-left text-sm`
- `text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `overflow-x-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-left` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `text-[#52525b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[#18181b]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-[#27272a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:539`

```jsx
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
                  <th className="px-6 py-4">Feature</th>
```
**Raw class strings detected (best effort):**

- `min-w-full text-left text-sm`
- `text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]`
- `px-6 py-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
- **Typography:**
  - `text-left` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:541`

```jsx
                <tr className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]">
                  <th className="px-6 py-4">Feature</th>
                  <th className="px-6 py-4">Free</th>
                  <th className="px-6 py-4">Premium</th>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:text-[#a1a1aa]`
- `px-6 py-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:542`

```jsx
                  <th className="px-6 py-4">Feature</th>
                  <th className="px-6 py-4">Free</th>
                  <th className="px-6 py-4">Premium</th>
                </tr>
```
**Raw class strings detected (best effort):**

- `px-6 py-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).

#### `src/pages/Pricing.jsx:543`

```jsx
                  <th className="px-6 py-4">Free</th>
                  <th className="px-6 py-4">Premium</th>
                </tr>
              </thead>
```
**Raw class strings detected (best effort):**

- `px-6 py-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).

#### `src/pages/Pricing.jsx:544`

```jsx
                  <th className="px-6 py-4">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7] dark:divide-[#27272a]">
```
**Raw class strings detected (best effort):**

- `px-6 py-4`
- `divide-y divide-[#e4e4e7] dark:divide-[#27272a]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
- **Borders / rings / shadows:**
  - `divide-y` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `divide-[#e4e4e7]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:divide-[#27272a]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:547`

```jsx
              <tbody className="divide-y divide-[#e4e4e7] dark:divide-[#27272a]">
                {tableRows.map((row) => (
                  <tr key={row.label} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-[#09090b] dark:text-[#fafafa]">{row.label}</td>
```
**Raw class strings detected (best effort):**

- `divide-y divide-[#e4e4e7] dark:divide-[#27272a]`
- `transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]`
- `px-6 py-4 font-medium text-[#09090b] dark:text-[#fafafa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `divide-y` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `divide-[#e4e4e7]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-black/[0.02]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:divide-[#27272a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/[0.02]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:549`

```jsx
                  <tr key={row.label} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-[#09090b] dark:text-[#fafafa]">{row.label}</td>
                    <td className="px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]">
                      {typeof row.free === 'boolean' ? (
```
**Raw class strings detected (best effort):**

- `transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]`
- `px-6 py-4 font-medium text-[#09090b] dark:text-[#fafafa]`
- `px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]`
- `boolean`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-black/[0.02]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:hover:bg-white/[0.02]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `boolean` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:550`

```jsx
                    <td className="px-6 py-4 font-medium text-[#09090b] dark:text-[#fafafa]">{row.label}</td>
                    <td className="px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="h-4 w-4 text-[#2dd4bf]" /> : <Minus className="h-4 w-4 text-[#a1a1aa]" />
```
**Raw class strings detected (best effort):**

- `px-6 py-4 font-medium text-[#09090b] dark:text-[#fafafa]`
- `px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]`
- `boolean`
- `h-4 w-4 text-[#2dd4bf]`
- `h-4 w-4 text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
  - `text-[#2dd4bf]` — Text color or text sizing.
  - `text-[#a1a1aa]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `boolean` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:551`

```jsx
                    <td className="px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="h-4 w-4 text-[#2dd4bf]" /> : <Minus className="h-4 w-4 text-[#a1a1aa]" />
                      ) : (
```
**Raw class strings detected (best effort):**

- `px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]`
- `boolean`
- `h-4 w-4 text-[#2dd4bf]`
- `h-4 w-4 text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
  - `text-[#2dd4bf]` — Text color or text sizing.
  - `text-[#a1a1aa]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `boolean` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:553`

```jsx
                        row.free ? <Check className="h-4 w-4 text-[#2dd4bf]" /> : <Minus className="h-4 w-4 text-[#a1a1aa]" />
                      ) : (
                        row.free
                      )}
```
**Raw class strings detected (best effort):**

- `h-4 w-4 text-[#2dd4bf]`
- `h-4 w-4 text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#2dd4bf]` — Text color or text sizing.
  - `text-[#a1a1aa]` — Text color or text sizing.

#### `src/pages/Pricing.jsx:558`

```jsx
                    <td className="px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="h-4 w-4 text-[#2dd4bf]" /> : <Minus className="h-4 w-4 text-[#a1a1aa]" />
                      ) : (
```
**Raw class strings detected (best effort):**

- `px-6 py-4 text-[#52525b] dark:text-[#a1a1aa]`
- `boolean`
- `h-4 w-4 text-[#2dd4bf]`
- `h-4 w-4 text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
  - `text-[#2dd4bf]` — Text color or text sizing.
  - `text-[#a1a1aa]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `boolean` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:560`

```jsx
                        row.premium ? <Check className="h-4 w-4 text-[#2dd4bf]" /> : <Minus className="h-4 w-4 text-[#a1a1aa]" />
                      ) : (
                        row.premium
                      )}
```
**Raw class strings detected (best effort):**

- `h-4 w-4 text-[#2dd4bf]`
- `h-4 w-4 text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#2dd4bf]` — Text color or text sizing.
  - `text-[#a1a1aa]` — Text color or text sizing.

#### `src/pages/Pricing.jsx:572`

```jsx
        <div className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">FAQ</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Short answers, no sales noise.</p>
```
**Raw class strings detected (best effort):**

- `mt-16`
- `mx-auto max-w-3xl text-center`
- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mx-auto` — Horizontal margin (left/right).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:573`

```jsx
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">FAQ</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Short answers, no sales noise.</p>
          </div>
```
**Raw class strings detected (best effort):**

- `mx-auto max-w-3xl text-center`
- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:574`

```jsx
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">FAQ</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Short answers, no sales noise.</p>
          </div>

```
**Raw class strings detected (best effort):**

- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:575`

```jsx
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Short answers, no sales noise.</p>
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-4">
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `mx-auto mt-6 grid max-w-3xl gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `max-w-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mx-auto` — Horizontal margin (left/right).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:578`

```jsx
          <div className="mx-auto mt-6 grid max-w-3xl gap-4">
            {[
              { q: 'Can I upgrade anytime?', a: 'Yes — your data stays intact.' },
              { q: 'Can I downgrade?', a: 'Yes — plan limits apply immediately.' },
```
**Raw class strings detected (best effort):**

- `mx-auto mt-6 grid max-w-3xl gap-4`
- `Can I upgrade anytime?`
- `Yes — your data stays intact.`
- `Can I downgrade?`
- `Yes — plan limits apply immediately.`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `max-w-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Can` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `I` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `upgrade` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `anytime?` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Yes` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `—` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `your` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `data` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `stays` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `intact.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `downgrade?` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `plan` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `limits` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `apply` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `immediately.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:587`

```jsx
                  className={[
                    'rounded-xl p-6',
                    'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
                    'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-6`
- `bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`
- `dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[#18181b]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-[#27272a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:596`

```jsx
                  <p className="font-semibold text-[#09090b] dark:text-[#fafafa]">{item.q}</p>
                  <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">{item.a}</p>
                </SpotlightCard>
              </MotionItem>
```
**Raw class strings detected (best effort):**

- `font-semibold text-[#09090b] dark:text-[#fafafa]`
- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:597`

```jsx
                  <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">{item.a}</p>
                </SpotlightCard>
              </MotionItem>
            ))}
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:604`

```jsx
        <div className="mt-16 pb-4">
          <SpotlightCard
            className={[
              'rounded-xl p-10 text-center',
```
**Raw class strings detected (best effort):**

- `mt-16 pb-4`
- `rounded-xl p-10 text-center`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-10` — Padding (all sides).
- **Typography:**
  - `text-center` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/Pricing.jsx:606`

```jsx
            className={[
              'rounded-xl p-10 text-center',
              'bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]',
              'dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-10 text-center`
- `bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`
- `dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-10` — Padding (all sides).
- **Typography:**
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[#18181b]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-[#27272a]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:612`

```jsx
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">
              Build a structured textile network today
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#52525b] dark:text-[#a1a1aa]">
```
**Raw class strings detected (best effort):**

- `text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]`
- `mx-auto mt-3 max-w-xl text-sm text-[#52525b] dark:text-[#a1a1aa]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#09090b]` — Text color or text sizing.
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#fafafa]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:615`

```jsx
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#52525b] dark:text-[#a1a1aa]">
              Start free, upgrade when your org needs analytics, export, and secure contract management.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
```
**Raw class strings detected (best effort):**

- `mx-auto mt-3 max-w-xl text-sm text-[#52525b] dark:text-[#a1a1aa]`
- `mt-7 flex flex-wrap justify-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#52525b]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#a1a1aa]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/Pricing.jsx:618`

```jsx
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <MagneticButton
                to="/signup"
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none"
```
**Raw class strings detected (best effort):**

- `mt-7 flex flex-wrap justify-center gap-3`
- `/signup`
- `shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#3b82f6]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_10px_28px_rgba(59,130,246,0.25)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:brightness-105` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `/signup` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:621`

```jsx
                className="shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none"
              >
                Create your organization
              </MagneticButton>
```
**Raw class strings detected (best effort):**

- `shimmer-btn inline-flex items-center justify-center rounded-md bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(59,130,246,0.25)] transition hover:brightness-105 dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#3b82f6]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_10px_28px_rgba(59,130,246,0.25)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:brightness-105` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/Pricing.jsx:627`

```jsx
                className="inline-flex items-center justify-center rounded-md bg-[#2dd4bf] px-6 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none"
              >
                Choose premium
              </MagneticButton>
```
**Raw class strings detected (best effort):**

- `inline-flex items-center justify-center rounded-md bg-[#2dd4bf] px-6 py-3 text-sm font-semibold text-[#09090b] shadow-[0_12px_34px_rgba(45,212,191,0.22)] transition hover:brightness-105 dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#2dd4bf]` — Background color/surface.
  - `text-[#09090b]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_12px_34px_rgba(45,212,191,0.22)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:brightness-105` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/Pricing.jsx:252` — Analytics snapshot

```jsx
                <p className="text-sm font-semibold text-[#09090b] dark:text-[#fafafa]">Analytics snapshot</p>
                <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                  Live
                </span>
```
- `src/pages/Pricing.jsx:258` — Analytics unavailable — showing defaults.

```jsx
                <p className="mt-3 text-xs text-[#a1a1aa]">Analytics unavailable — showing defaults.</p>
              ) : null}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
```
- `src/pages/Pricing.jsx:290` — Simple, transparent pricing

```jsx
            <h2 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Simple, transparent pricing</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
              Choose the surface you need today — upgrade when your team scales.
            </p>
```
- `src/pages/Pricing.jsx:300` — Preview:

```jsx
                  <span className="text-xs font-semibold text-[#52525b] dark:text-[#a1a1aa]">Preview:</span>
                  <button
                    type="button"
                    onClick={() => {
```
- `src/pages/Pricing.jsx:338` — Remaining: {Math.max(0, remainingDays)} day(s)

```jsx
                <span className="text-xs text-[#52525b] dark:text-[#a1a1aa]">Remaining: {Math.max(0, remainingDays)} day(s)</span>
                <button
                  type="button"
                  onClick={() => setRemainingDays((d) => d - 1)}
```
- `src/pages/Pricing.jsx:371` — Free

```jsx
                    <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Free</h3>
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Start with essential workflow.</p>
                  </div>
                  <div className="text-right">
```
- `src/pages/Pricing.jsx:372` — Start with essential workflow.

```jsx
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Start with essential workflow.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$0</p>
```
- `src/pages/Pricing.jsx:375` — $0

```jsx
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$0</p>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>
```
- `src/pages/Pricing.jsx:376` — per month

```jsx
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>

```
- `src/pages/Pricing.jsx:417` — Premium

```jsx
                      <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Premium</h3>
                      <span className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusChip[verificationStatus]].join(' ')}>
                        {statusLabel[verificationStatus]}
                      </span>
```
- `src/pages/Pricing.jsx:422` — Built for buying houses & enterprise teams.

```jsx
                    <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Built for buying houses & enterprise teams.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$199</p>
```
- `src/pages/Pricing.jsx:425` — $199

```jsx
                    <p className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">$199</p>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>
```
- `src/pages/Pricing.jsx:426` — per month

```jsx
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">per month</p>
                  </div>
                </div>

```
- `src/pages/Pricing.jsx:467` — Why enterprise matters

```jsx
                <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Why enterprise matters</h3>
                <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">
                  When your team scales, structure beats noise. Premium keeps workflows conflict-free and audit-ready.
                </p>
```
- `src/pages/Pricing.jsx:496` — Enterprise analytics

```jsx
                  <h3 className="text-lg font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Enterprise analytics</h3>
                  <span className="rounded-full bg-[rgba(9,9,11,0.06)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#a1a1aa]">
                    Auto-sorted
                  </span>
```
- `src/pages/Pricing.jsx:501` — Decision-ready metrics without spreadsheet UI.

```jsx
                <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Decision-ready metrics without spreadsheet UI.</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {(pricing?.analytics?.tiles || []).slice(0, 4).map((tile) => (
```
- `src/pages/Pricing.jsx:534` — Feature comparison

```jsx
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">Feature comparison</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Horizontal lines only. Clear, audit-ready differences.</p>
          </div>

```
- `src/pages/Pricing.jsx:535` — Horizontal lines only. Clear, audit-ready differences.

```jsx
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Horizontal lines only. Clear, audit-ready differences.</p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl bg-[#ffffff] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:shadow-none">
```
- `src/pages/Pricing.jsx:574` — FAQ

```jsx
            <h2 className="text-2xl font-bold tracking-tight text-[#09090b] dark:text-[#fafafa]">FAQ</h2>
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Short answers, no sales noise.</p>
          </div>

```
- `src/pages/Pricing.jsx:575` — Short answers, no sales noise.

```jsx
            <p className="mt-2 text-sm text-[#52525b] dark:text-[#a1a1aa]">Short answers, no sales noise.</p>
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-4">
```
- `src/pages/Pricing.jsx:301` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoggedIn((v) => !v)
```
- `src/pages/Pricing.jsx:316` — (element) <button>

```jsx
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAccountType(t)}
```
- `src/pages/Pricing.jsx:339` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={() => setRemainingDays((d) => d - 1)}
                  className="rounded-md bg-[rgba(9,9,11,0.06)] px-3 py-2 text-xs font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
```
- `src/pages/Pricing.jsx:346` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={() => setRemainingDays((d) => d + 1)}
                  className="rounded-md bg-[rgba(9,9,11,0.06)] px-3 py-2 text-xs font-semibold text-[#09090b] transition hover:bg-[rgba(9,9,11,0.08)] dark:bg-[rgba(250,250,250,0.06)] dark:text-[#fafafa] dark:hover:bg-[rgba(250,250,250,0.08)]"
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /system/pricing (src/pages/Pricing.jsx:17) | /api/system -> server/routes/systemRoutes.js:73 | GET /pricing (server/routes/systemRoutes.js:8) | server/controllers/systemController.js | systemPricing |
| GET /system/pricing (src/pages/Pricing.jsx:89) | /api/system -> server/routes/systemRoutes.js:73 | GET /pricing (server/routes/systemRoutes.js:8) | server/controllers/systemController.js | systemPricing |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/Pricing.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
{% endraw %}

