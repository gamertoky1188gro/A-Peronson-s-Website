{% raw %}
# HelpCenter - Route `/help`

**Access:** Public

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/HelpCenter.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/HelpCenter.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_HelpCenter.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/HelpCenter.jsx:33)
- ../components/ui/SpotlightCard (src/pages/HelpCenter.jsx:34)

### 2.2 Structural section tags in JSX

- `header` at `src/pages/HelpCenter.jsx:377`

```jsx
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Industrial reliability, tech-forward SaaS guidance.</p>
        </header>
```
- `section` at `src/pages/HelpCenter.jsx:407`

```jsx
                <section id={section.id} className="scroll-mt-6">
                  <SpotlightCard className={cardClassName()}>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{section.title}</h2>
```
- `section` at `src/pages/HelpCenter.jsx:567`

```jsx
              <section id="faq" className="scroll-mt-6">
                <SpotlightCard className={cardClassName()}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
```
- `section` at `src/pages/HelpCenter.jsx:628`

```jsx
                <section className="scroll-mt-6">
                  <SpotlightCard className={cardClassName({ glass: true })}>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
```
- `section` at `src/pages/HelpCenter.jsx:720`

```jsx
              <section className="scroll-mt-6">
                <SpotlightCard className={cardClassName({ glass: true })}>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Support</h2>
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

#### `src/pages/HelpCenter.jsx:188`

```jsx
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
```
**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**


#### `src/pages/HelpCenter.jsx:191`

```jsx
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
```
**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**


#### `src/pages/HelpCenter.jsx:202`

```jsx
  return <div className={['skeleton', className].join(' ')} />
}

function VerifiedBadge() {
```
**Raw class strings detected (best effort):**

- `skeleton`
- ` `

**Utility breakdown (grouped):**

- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:208`

```jsx
      className={[
        'verified-shimmer inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        'bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.10)]',
        'dark:bg-emerald-500/12 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_24px_rgba(16,185,129,0.12)]',
```
**Raw class strings detected (best effort):**

- `verified-shimmer inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold`
- `bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.10)]`
- `dark:bg-emerald-500/12 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_24px_rgba(16,185,129,0.12)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-emerald-600/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.10)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-emerald-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_24px_rgba(16,185,129,0.12)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verified-shimmer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:214`

```jsx
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_14px_rgba(5,150,105,0.55)] dark:bg-emerald-400 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
      Verified
    </span>
  )
```
**Raw class strings detected (best effort):**

- `h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_14px_rgba(5,150,105,0.55)] dark:bg-emerald-400 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_0_14px_rgba(5,150,105,0.55)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-emerald-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:375`

```jsx
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0B0F1A] dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
```
**Raw class strings detected (best effort):**

- `min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#0B0F1A] dark:text-slate-100`
- `mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8`
- `text-center`
- `text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-x-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-6xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-10` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-900` — Text color or text sizing.
  - `text-center` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Responsive variants:**
  - `sm:px-6` — Variant prefix (responsive, dark, or interaction state).
  - `lg:px-8` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#0B0F1A]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:376`

```jsx
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Industrial reliability, tech-forward SaaS guidance.</p>
```
**Raw class strings detected (best effort):**

- `mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8`
- `text-center`
- `text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-2 text-sm text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-6xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-10` — Vertical padding (top/bottom).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Responsive variants:**
  - `sm:px-6` — Variant prefix (responsive, dark, or interaction state).
  - `lg:px-8` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:377`

```jsx
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Industrial reliability, tech-forward SaaS guidance.</p>
        </header>
```
**Raw class strings detected (best effort):**

- `text-center`
- `text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-2 text-sm text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:378`

```jsx
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Industrial reliability, tech-forward SaaS guidance.</p>
        </header>

```
**Raw class strings detected (best effort):**

- `text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-2 text-sm text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:379`

```jsx
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Industrial reliability, tech-forward SaaS guidance.</p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-500 dark:text-slate-400`
- `mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Responsive variants:**
  - `lg:grid-cols-4` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:382`

```jsx
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {hubTiles.map((tile, idx) => {
```
**Raw class strings detected (best effort):**

- `mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4`
- `lg:col-span-3 space-y-8`
- `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:grid-cols-4` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-3` — Variant prefix (responsive, dark, or interaction state).
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
  - `lg:grid-cols-6` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:383`

```jsx
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {hubTiles.map((tile, idx) => {
                const Icon = tile.icon
```
**Raw class strings detected (best effort):**

- `lg:col-span-3 space-y-8`
- `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `space-y-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-3` — Variant prefix (responsive, dark, or interaction state).
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
  - `lg:grid-cols-6` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:384`

```jsx
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {hubTiles.map((tile, idx) => {
                const Icon = tile.icon
                return (
```
**Raw class strings detected (best effort):**

- `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
  - `lg:grid-cols-6` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:388`

```jsx
                  <MotionItem key={tile.id} index={idx} className={tile.span}>
                    <a href={`#${tile.id}`} className={[cardClassName({ glass: true }), 'group block h-full'].join(' ')}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
```
**Raw class strings detected (best effort):**

- `group block h-full`
- ` `
- `flex items-start justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `group` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:389`

```jsx
                    <a href={`#${tile.id}`} className={[cardClassName({ glass: true }), 'group block h-full'].join(' ')}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">{tile.title}</p>
```
**Raw class strings detected (best effort):**

- `group block h-full`
- ` `
- `flex items-start justify-between gap-3`
- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `group` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:390`

```jsx
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">{tile.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{tile.desc}</p>
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-3`
- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:392`

```jsx
                          <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">{tile.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{tile.desc}</p>
                        </div>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition group-hover:bg-blue-600/14 dark:bg-blue-500/12 dark:text-blue-400">
```
**Raw class strings detected (best effort):**

- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400`
- `inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition group-hover:bg-blue-600/14 dark:bg-blue-500/12 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-blue-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `group-hover:bg-blue-600/14` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-blue-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:393`

```jsx
                          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{tile.desc}</p>
                        </div>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition group-hover:bg-blue-600/14 dark:bg-blue-500/12 dark:text-blue-400">
                          <Icon className="h-5 w-5" />
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400`
- `inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition group-hover:bg-blue-600/14 dark:bg-blue-500/12 dark:text-blue-400`
- `h-5 w-5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-blue-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `group-hover:bg-blue-600/14` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-blue-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:395`

```jsx
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition group-hover:bg-blue-600/14 dark:bg-blue-500/12 dark:text-blue-400">
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
```
**Raw class strings detected (best effort):**

- `inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition group-hover:bg-blue-600/14 dark:bg-blue-500/12 dark:text-blue-400`
- `h-5 w-5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `group-hover:bg-blue-600/14` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-blue-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:396`

```jsx
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                    </a>
```
**Raw class strings detected (best effort):**

- `h-5 w-5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:407`

```jsx
                <section id={section.id} className="scroll-mt-6">
                  <SpotlightCard className={cardClassName()}>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{section.title}</h2>
```
**Raw class strings detected (best effort):**

- `scroll-mt-6`
- `flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800`
- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `scroll-mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:408`

```jsx
                  <SpotlightCard className={cardClassName()}>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{section.title}</h2>
                      {section.id === 'verification' ? <VerifiedBadge /> : null}
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800`
- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `verification`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:409`

```jsx
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{section.title}</h2>
                      {section.id === 'verification' ? <VerifiedBadge /> : null}
                    </div>
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800`
- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `verification`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:410`

```jsx
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{section.title}</h2>
                      {section.id === 'verification' ? <VerifiedBadge /> : null}
                    </div>

```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `verification`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:415`

```jsx
                      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
                    ) : null}

                    {section.content ? (
```
**Raw class strings detected (best effort):**

- `mt-4 text-sm text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:419`

```jsx
                      <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        {section.content.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
```
**Raw class strings detected (best effort):**

- `mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400`
- `flex gap-2`
- `mt-0.5 text-blue-600 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-blue-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:421`

```jsx
                          <li key={item} className="flex gap-2">
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
                            <span>{item}</span>
                          </li>
```
**Raw class strings detected (best effort):**

- `flex gap-2`
- `mt-0.5 text-blue-600 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:422`

```jsx
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
```
**Raw class strings detected (best effort):**

- `mt-0.5 text-blue-600 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:430`

```jsx
                      <div className="mt-5 grid gap-4 lg:grid-cols-3">
                        {section.subsections.map((sub, subIndex) => (
                          <motion.div
                            key={sub.name}
```
**Raw class strings detected (best effort):**

- `mt-5 grid gap-4 lg:grid-cols-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:grid-cols-3` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:437`

```jsx
                            className={[
                              'rounded-xl bg-slate-900/2 p-5 transition duration-300 ease-out',
                              'hover:-translate-y-0.5 hover:bg-slate-900/3 active:scale-[0.98]',
                              'dark:bg-white/5 dark:hover:bg-white/6 dark:hover:translate-y-0',
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-900/2 p-5 transition duration-300 ease-out`
- `hover:-translate-y-0.5 hover:bg-slate-900/3 active:scale-[0.98]`
- `dark:bg-white/5 dark:hover:bg-white/6 dark:hover:translate-y-0`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-5` — Padding (all sides).
- **Color / surface:**
  - `bg-slate-900/2` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:-translate-y-0.5` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-slate-900/3` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:translate-y-0` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:444`

```jsx
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{sub.name}</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                              {sub.points.map((p) => (
                                <li key={p} className="flex gap-2">
```
**Raw class strings detected (best effort):**

- `font-semibold text-slate-900 dark:text-slate-100`
- `mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400`
- `flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:445`

```jsx
                            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                              {sub.points.map((p) => (
                                <li key={p} className="flex gap-2">
                                  <span className="mt-0.5 text-blue-600/90 dark:text-blue-400">•</span>
```
**Raw class strings detected (best effort):**

- `mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400`
- `flex gap-2`
- `mt-0.5 text-blue-600/90 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-blue-600/90` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:447`

```jsx
                                <li key={p} className="flex gap-2">
                                  <span className="mt-0.5 text-blue-600/90 dark:text-blue-400">•</span>
                                  <span>{p}</span>
                                </li>
```
**Raw class strings detected (best effort):**

- `flex gap-2`
- `mt-0.5 text-blue-600/90 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600/90` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:448`

```jsx
                                  <span className="mt-0.5 text-blue-600/90 dark:text-blue-400">•</span>
                                  <span>{p}</span>
                                </li>
                              ))}
```
**Raw class strings detected (best effort):**

- `mt-0.5 text-blue-600/90 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600/90` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:459`

```jsx
                      <div className="mt-5 space-y-5">
                        {section.roles.map((roleBlock) => (
                          <div key={roleBlock.role}>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{roleBlock.role}</p>
```
**Raw class strings detected (best effort):**

- `mt-5 space-y-5`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:462`

```jsx
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{roleBlock.role}</p>
                            <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-slate-500 md:grid-cols-2 dark:text-slate-400">
                              {roleBlock.docs.map((d) => (
                                <li key={d} className="flex gap-2">
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-slate-500 md:grid-cols-2 dark:text-slate-400`
- `flex gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-x-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:463`

```jsx
                            <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-slate-500 md:grid-cols-2 dark:text-slate-400">
                              {roleBlock.docs.map((d) => (
                                <li key={d} className="flex gap-2">
                                  <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">•</span>
```
**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-slate-500 md:grid-cols-2 dark:text-slate-400`
- `flex gap-2`
- `mt-0.5 text-emerald-600 dark:text-emerald-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-x-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-emerald-600` — Text color or text sizing.
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:465`

```jsx
                                <li key={d} className="flex gap-2">
                                  <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">•</span>
                                  <span>{d}</span>
                                </li>
```
**Raw class strings detected (best effort):**

- `flex gap-2`
- `mt-0.5 text-emerald-600 dark:text-emerald-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-emerald-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-emerald-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:466`

```jsx
                                  <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">•</span>
                                  <span>{d}</span>
                                </li>
                              ))}
```
**Raw class strings detected (best effort):**

- `mt-0.5 text-emerald-600 dark:text-emerald-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-emerald-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-emerald-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:477`

```jsx
                      <div className="mt-5 space-y-4">
                        {section.sections.map((s) => (
                          <div key={s.title} className="rounded-xl bg-slate-900/2 p-5 dark:bg-white/5">
                            <div className="flex items-center justify-between gap-3">
```
**Raw class strings detected (best effort):**

- `mt-5 space-y-4`
- `rounded-xl bg-slate-900/2 p-5 dark:bg-white/5`
- `flex items-center justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-5` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/2` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:479`

```jsx
                          <div key={s.title} className="rounded-xl bg-slate-900/2 p-5 dark:bg-white/5">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{s.title}</p>
                              {s.title.toLowerCase().includes('verified') ? <VerifiedBadge /> : null}
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-900/2 p-5 dark:bg-white/5`
- `flex items-center justify-between gap-3`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `verified`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/2` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:480`

```jsx
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{s.title}</p>
                              {s.title.toLowerCase().includes('verified') ? <VerifiedBadge /> : null}
                            </div>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `verified`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:481`

```jsx
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{s.title}</p>
                              {s.title.toLowerCase().includes('verified') ? <VerifiedBadge /> : null}
                            </div>
                            {s.text ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.text}</p> : null}
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `verified`
- `mt-2 text-sm text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:484`

```jsx
                            {s.text ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.text}</p> : null}
                            {s.points ? (
                              <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                {s.points.map((p) => (
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-500 dark:text-slate-400`
- `mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:486`

```jsx
                              <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                {s.points.map((p) => (
                                  <li key={p} className="flex gap-2">
                                    <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
```
**Raw class strings detected (best effort):**

- `mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400`
- `flex gap-2`
- `mt-0.5 text-blue-600 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-blue-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:488`

```jsx
                                  <li key={p} className="flex gap-2">
                                    <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
                                    <span>{p}</span>
                                  </li>
```
**Raw class strings detected (best effort):**

- `flex gap-2`
- `mt-0.5 text-blue-600 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:489`

```jsx
                                    <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
                                    <span>{p}</span>
                                  </li>
                                ))}
```
**Raw class strings detected (best effort):**

- `mt-0.5 text-blue-600 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:497`

```jsx
                              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/70 px-4 py-3 backdrop-blur-md shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/5 dark:shadow-none">
                                <div className="flex items-center gap-3">
                                  <AnimatePresence initial={false} mode="popLayout">
                                    {lockGranted ? (
```
**Raw class strings detected (best effort):**

- `mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/70 px-4 py-3 backdrop-blur-md shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/5 dark:shadow-none`
- `flex items-center gap-3`
- `popLayout`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_24px_rgba(15,23,42,0.06)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `popLayout` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:498`

```jsx
                                <div className="flex items-center gap-3">
                                  <AnimatePresence initial={false} mode="popLayout">
                                    {lockGranted ? (
                                      <motion.div
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `popLayout`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `popLayout` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:507`

```jsx
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-200"
                                      >
                                        <Check className="h-5 w-5" />
                                      </motion.div>
```
**Raw class strings detected (best effort):**

- `inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-200`
- `h-5 w-5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-600/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-emerald-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:509`

```jsx
                                        <Check className="h-5 w-5" />
                                      </motion.div>
                                    ) : (
                                      <motion.div
```
**Raw class strings detected (best effort):**

- `h-5 w-5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:518`

```jsx
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/6 text-slate-700 dark:bg-white/6 dark:text-slate-200"
                                      >
                                        <Lock className="h-5 w-5" />
                                      </motion.div>
```
**Raw class strings detected (best effort):**

- `inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/6 text-slate-700 dark:bg-white/6 dark:text-slate-200`
- `h-5 w-5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/6` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:520`

```jsx
                                        <Lock className="h-5 w-5" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
```
**Raw class strings detected (best effort):**

- `h-5 w-5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:525`

```jsx
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Lock demo</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {lockGranted ? 'Permission granted — teammates can message.' : 'Locked — teammates need permission.'}
                                    </p>
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `text-xs text-slate-500 dark:text-slate-400`
- `Permission granted — teammates can message.`
- `Locked — teammates need permission.`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Permission` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `granted` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `—` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `teammates` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `can` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `message.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Locked` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `need` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `permission.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:526`

```jsx
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {lockGranted ? 'Permission granted — teammates can message.' : 'Locked — teammates need permission.'}
                                    </p>
                                  </div>
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500 dark:text-slate-400`
- `Permission granted — teammates can message.`
- `Locked — teammates need permission.`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Permission` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `granted` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `—` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `teammates` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `can` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `message.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Locked` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `need` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `permission.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:534`

```jsx
                                  className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400"
                                >
                                  {lockGranted ? 'Reset' : 'Grant permission'}
                                </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400`
- `Reset`
- `Grant permission`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-blue-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-blue-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-blue-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Reset` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Grant` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `permission` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:546`

```jsx
                      <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        {section.points.map((p) => (
                          <li key={p} className="flex gap-2">
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
```
**Raw class strings detected (best effort):**

- `mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400`
- `flex gap-2`
- `mt-0.5 text-blue-600 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-blue-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:548`

```jsx
                          <li key={p} className="flex gap-2">
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
                            <span>{p}</span>
                          </li>
```
**Raw class strings detected (best effort):**

- `flex gap-2`
- `mt-0.5 text-blue-600 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:549`

```jsx
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
```
**Raw class strings detected (best effort):**

- `mt-0.5 text-blue-600 dark:text-blue-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-0.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:557`

```jsx
                      <p className="mt-5 border-t border-slate-200 pt-3 text-xs italic text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        {section.footer}
                      </p>
                    ) : null}
```
**Raw class strings detected (best effort):**

- `mt-5 border-t border-slate-200 pt-3 text-xs italic text-slate-500 dark:border-slate-800 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-t` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:567`

```jsx
              <section id="faq" className="scroll-mt-6">
                <SpotlightCard className={cardClassName()}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
```
**Raw class strings detected (best effort):**

- `scroll-mt-6`
- `flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800`
- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `scroll-mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:568`

```jsx
                <SpotlightCard className={cardClassName()}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      10. Frequently Asked Questions (FAQ)
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800`
- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:569`

```jsx
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      10. Frequently Asked Questions (FAQ)
                    </h2>
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800`
- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:570`

```jsx
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      10. Frequently Asked Questions (FAQ)
                    </h2>
                    <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:573`

```jsx
                    <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                      Searchable
                    </span>
                  </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:578`

```jsx
                  <div className="mt-4">
                    <input
                      placeholder="Search FAQs..."
                      value={q}
```
**Raw class strings detected (best effort):**

- `mt-4`
- `Search FAQs...`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Search` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `FAQs...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:583`

```jsx
                      className="w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                    />
                  </div>

```
**Raw class strings detected (best effort):**

- `w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `placeholder:text-slate-500` — Variant prefix (responsive, dark, or interaction state).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2.5` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-blue-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:placeholder:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:587`

```jsx
                  <div className="mt-5 space-y-3">
                    {faqLoading ? (
                      <>
                        <Skeleton className="h-16 rounded-xl" />
```
**Raw class strings detected (best effort):**

- `mt-5 space-y-3`
- `h-16 rounded-xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/HelpCenter.jsx:590`

```jsx
                        <Skeleton className="h-16 rounded-xl" />
                        <Skeleton className="h-16 rounded-xl" />
                        <Skeleton className="h-16 rounded-xl" />
                      </>
```
**Raw class strings detected (best effort):**

- `h-16 rounded-xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/HelpCenter.jsx:591`

```jsx
                        <Skeleton className="h-16 rounded-xl" />
                        <Skeleton className="h-16 rounded-xl" />
                      </>
                    ) : (
```
**Raw class strings detected (best effort):**

- `h-16 rounded-xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/HelpCenter.jsx:592`

```jsx
                        <Skeleton className="h-16 rounded-xl" />
                      </>
                    ) : (
                      <AnimatePresence mode="wait" initial={false}>
```
**Raw class strings detected (best effort):**

- `h-16 rounded-xl`
- `wait`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `wait` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/HelpCenter.jsx:602`

```jsx
                          className="space-y-3"
                        >
                          {filteredFaqs.map((f) => (
                            <details
```
**Raw class strings detected (best effort):**

- `space-y-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:607`

```jsx
                              className="group rounded-xl bg-slate-900/2 p-4 transition-colors hover:bg-slate-900/3 dark:bg-white/5 dark:hover:bg-white/6"
                            >
                              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                <span className="min-w-0 truncate">Q: {f.q}</span>
```
**Raw class strings detected (best effort):**

- `group rounded-xl bg-slate-900/2 p-4 transition-colors hover:bg-slate-900/3 dark:bg-white/5 dark:hover:bg-white/6`
- `flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `min-w-0 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/2` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-900/3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `group` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `cursor-pointer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:609`

```jsx
                              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                <span className="min-w-0 truncate">Q: {f.q}</span>
                                <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400" />
                              </summary>
```
**Raw class strings detected (best effort):**

- `flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `min-w-0 truncate`
- `h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `cursor-pointer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `list-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `group-open:rotate-180` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:610`

```jsx
                                <span className="min-w-0 truncate">Q: {f.q}</span>
                                <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400" />
                              </summary>
                              <p className="mt-3 border-l-2 border-blue-600/50 pl-4 text-sm text-slate-500 dark:border-blue-400/50 dark:text-slate-400">
```
**Raw class strings detected (best effort):**

- `min-w-0 truncate`
- `h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400`
- `mt-3 border-l-2 border-blue-600/50 pl-4 text-sm text-slate-500 dark:border-blue-400/50 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pl-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-l-2` — Border style/width/color.
  - `border-blue-600/50` — Border style/width/color.
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-blue-400/50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `group-open:rotate-180` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:611`

```jsx
                                <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400" />
                              </summary>
                              <p className="mt-3 border-l-2 border-blue-600/50 pl-4 text-sm text-slate-500 dark:border-blue-400/50 dark:text-slate-400">
                                A: {f.a}
```
**Raw class strings detected (best effort):**

- `h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400`
- `mt-3 border-l-2 border-blue-600/50 pl-4 text-sm text-slate-500 dark:border-blue-400/50 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pl-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-l-2` — Border style/width/color.
  - `border-blue-600/50` — Border style/width/color.
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-blue-400/50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `group-open:rotate-180` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:613`

```jsx
                              <p className="mt-3 border-l-2 border-blue-600/50 pl-4 text-sm text-slate-500 dark:border-blue-400/50 dark:text-slate-400">
                                A: {f.a}
                              </p>
                            </details>
```
**Raw class strings detected (best effort):**

- `mt-3 border-l-2 border-blue-600/50 pl-4 text-sm text-slate-500 dark:border-blue-400/50 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pl-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-l-2` — Border style/width/color.
  - `border-blue-600/50` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-blue-400/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:628`

```jsx
                <section className="scroll-mt-6">
                  <SpotlightCard className={cardClassName({ glass: true })}>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
```
**Raw class strings detected (best effort):**

- `scroll-mt-6`
- `flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800`
- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `scroll-mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:629`

```jsx
                  <SpotlightCard className={cardClassName({ glass: true })}>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Admin: Manage Knowledge Base FAQ
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800`
- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:630`

```jsx
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Admin: Manage Knowledge Base FAQ
                      </h2>
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800`
- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-b` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:631`

```jsx
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Admin: Manage Knowledge Base FAQ
                      </h2>
                      <span className="rounded-full bg-blue-600/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700 dark:bg-blue-500/12 dark:text-blue-200">
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `rounded-full bg-blue-600/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700 dark:bg-blue-500/12 dark:text-blue-200`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-blue-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600/10` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-blue-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:634`

```jsx
                      <span className="rounded-full bg-blue-600/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700 dark:bg-blue-500/12 dark:text-blue-200">
                        Owner/Admin
                      </span>
                    </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-blue-600/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700 dark:bg-blue-500/12 dark:text-blue-200`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-blue-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600/10` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-blue-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:639`

```jsx
                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <form onSubmit={saveFaq} className="space-y-3">
                        <input
                          placeholder="Question"
```
**Raw class strings detected (best effort):**

- `mt-6 grid grid-cols-1 gap-6 md:grid-cols-2`
- `space-y-3`
- `Question`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Question` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:640`

```jsx
                      <form onSubmit={saveFaq} className="space-y-3">
                        <input
                          placeholder="Question"
                          value={form.question}
```
**Raw class strings detected (best effort):**

- `space-y-3`
- `Question`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Question` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:645`

```jsx
                          className="w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                          required
                        />
                        <textarea
```
**Raw class strings detected (best effort):**

- `w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `placeholder:text-slate-500` — Variant prefix (responsive, dark, or interaction state).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-blue-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:placeholder:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:652`

```jsx
                          className="min-h-28 w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                          required
                        />
                        <input
```
**Raw class strings detected (best effort):**

- `min-h-28 w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `placeholder:text-slate-500` — Variant prefix (responsive, dark, or interaction state).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-blue-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:placeholder:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:659`

```jsx
                          className="w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
```
**Raw class strings detected (best effort):**

- `w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400`
- `flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `placeholder:text-slate-500` — Variant prefix (responsive, dark, or interaction state).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-blue-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:placeholder:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:661`

```jsx
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400"
```
**Raw class strings detected (best effort):**

- `flex flex-wrap gap-2`
- `submit`
- `rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-5` — Horizontal padding (left/right).
  - `py-2.5` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-blue-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-blue-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-blue-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `submit` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:664`

```jsx
                            className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400"
                          >
                            {editingId ? 'Update' : 'Add'} FAQ
                          </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400`
- `Update`
- `Add`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-2.5` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-blue-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-blue-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-blue-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Update` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Add` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:672`

```jsx
                              className="rounded-full bg-slate-900/4 px-5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-900/6 active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/8"
                            >
                              Cancel
                            </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-900/4 px-5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-900/6 active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-2.5` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-900/6` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:678`

```jsx
                        {feedback ? <p className="text-xs text-slate-500 dark:text-slate-400">{feedback}</p> : null}
                      </form>

                      <div className="max-h-72 space-y-2 overflow-y-auto pr-2">
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500 dark:text-slate-400`
- `max-h-72 space-y-2 overflow-y-auto pr-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-h-72` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-y-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pr-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:681`

```jsx
                      <div className="max-h-72 space-y-2 overflow-y-auto pr-2">
                        {faqLoading ? (
                          <>
                            <Skeleton className="h-12 rounded-xl" />
```
**Raw class strings detected (best effort):**

- `max-h-72 space-y-2 overflow-y-auto pr-2`
- `h-12 rounded-xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-h-72` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-y-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pr-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/HelpCenter.jsx:684`

```jsx
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
```
**Raw class strings detected (best effort):**

- `h-12 rounded-xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/HelpCenter.jsx:685`

```jsx
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
                          </>
```
**Raw class strings detected (best effort):**

- `h-12 rounded-xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/HelpCenter.jsx:686`

```jsx
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-12 rounded-xl" />
                          </>
                        ) : (
```
**Raw class strings detected (best effort):**

- `h-12 rounded-xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/HelpCenter.jsx:687`

```jsx
                            <Skeleton className="h-12 rounded-xl" />
                          </>
                        ) : (
                          entries.map((e) => (
```
**Raw class strings detected (best effort):**

- `h-12 rounded-xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/HelpCenter.jsx:693`

```jsx
                              className="rounded-xl bg-[#ffffff] p-3 text-xs shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/5 dark:shadow-none"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
```
**Raw class strings detected (best effort):**

- `rounded-xl bg-[#ffffff] p-3 text-xs shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/5 dark:shadow-none`
- `flex items-start justify-between gap-3`
- `min-w-0 flex-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
- **Spacing:**
  - `p-3` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_24px_rgba(15,23,42,0.06)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:695`

```jsx
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{e.question}</p>
                                  <p className="mt-1 truncate text-slate-500 dark:text-slate-400">{e.answer}</p>
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-3`
- `min-w-0 flex-1`
- `truncate font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 truncate text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:696`

```jsx
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{e.question}</p>
                                  <p className="mt-1 truncate text-slate-500 dark:text-slate-400">{e.answer}</p>
                                </div>
```
**Raw class strings detected (best effort):**

- `min-w-0 flex-1`
- `truncate font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 truncate text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:697`

```jsx
                                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{e.question}</p>
                                  <p className="mt-1 truncate text-slate-500 dark:text-slate-400">{e.answer}</p>
                                </div>
                                <div className="flex shrink-0 gap-2">
```
**Raw class strings detected (best effort):**

- `truncate font-semibold text-slate-900 dark:text-slate-100`
- `mt-1 truncate text-slate-500 dark:text-slate-400`
- `flex shrink-0 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:698`

```jsx
                                  <p className="mt-1 truncate text-slate-500 dark:text-slate-400">{e.answer}</p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                  <button onClick={() => selectForEdit(e)} className="text-blue-600 hover:underline dark:text-blue-400">
```
**Raw class strings detected (best effort):**

- `mt-1 truncate text-slate-500 dark:text-slate-400`
- `flex shrink-0 gap-2`
- `text-blue-600 hover:underline dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-blue-600` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:700`

```jsx
                                <div className="flex shrink-0 gap-2">
                                  <button onClick={() => selectForEdit(e)} className="text-blue-600 hover:underline dark:text-blue-400">
                                    Edit
                                  </button>
```
**Raw class strings detected (best effort):**

- `flex shrink-0 gap-2`
- `text-blue-600 hover:underline dark:text-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-blue-600` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:701`

```jsx
                                  <button onClick={() => selectForEdit(e)} className="text-blue-600 hover:underline dark:text-blue-400">
                                    Edit
                                  </button>
                                  <button onClick={() => removeFaq(e.id)} className="text-rose-600 hover:underline dark:text-rose-300">
```
**Raw class strings detected (best effort):**

- `text-blue-600 hover:underline dark:text-blue-400`
- `text-rose-600 hover:underline dark:text-rose-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-blue-600` — Text color or text sizing.
  - `text-rose-600` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-blue-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:704`

```jsx
                                  <button onClick={() => removeFaq(e.id)} className="text-rose-600 hover:underline dark:text-rose-300">
                                    Del
                                  </button>
                                </div>
```
**Raw class strings detected (best effort):**

- `text-rose-600 hover:underline dark:text-rose-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-rose-600` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-rose-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:720`

```jsx
              <section className="scroll-mt-6">
                <SpotlightCard className={cardClassName({ glass: true })}>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Support</h2>
```
**Raw class strings detected (best effort):**

- `scroll-mt-6`
- `flex items-center justify-between gap-3`
- `text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `scroll-mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:721`

```jsx
                <SpotlightCard className={cardClassName({ glass: true })}>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Support</h2>
                    <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:722`

```jsx
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Support</h2>
                    <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                      Response varies
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:723`

```jsx
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Support</h2>
                    <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                      Response varies
                    </span>
```
**Raw class strings detected (best effort):**

- `text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:724`

```jsx
                    <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                      Response varies
                    </span>
                  </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:728`

```jsx
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    If your issue is not resolved, use the Floating Assistant, submit a support ticket, or contact the GarTexHub Support Team.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400`
- `mt-6 flex flex-wrap gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:731`

```jsx
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400">
                      Open support ticket
                    </button>
```
**Raw class strings detected (best effort):**

- `mt-6 flex flex-wrap gap-3`
- `rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-blue-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-blue-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-blue-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:732`

```jsx
                    <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400">
                      Open support ticket
                    </button>
                    <button className="rounded-full bg-[#ffffff] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/8">
```
**Raw class strings detected (best effort):**

- `rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400`
- `rounded-full bg-[#ffffff] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600` — Background color/surface.
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-blue-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:-translate-y-0.5` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-md` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-blue-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-blue-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:translate-y-0` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:735`

```jsx
                    <button className="rounded-full bg-[#ffffff] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/8">
                      Live chat
                    </button>
                  </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[#ffffff] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:-translate-y-0.5` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-md` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:translate-y-0` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:739`

```jsx
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                    Tip: On <span className="font-semibold">/help</span>, the assistant uses an “Orb” style to indicate ready-to-help status.
                  </p>
                </SpotlightCard>
```
**Raw class strings detected (best effort):**

- `mt-4 text-xs text-slate-500 dark:text-slate-400`
- `font-semibold`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:740`

```jsx
                    Tip: On <span className="font-semibold">/help</span>, the assistant uses an “Orb” style to indicate ready-to-help status.
                  </p>
                </SpotlightCard>
              </section>
```
**Raw class strings detected (best effort):**

- `font-semibold`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:747`

```jsx
          <div className="space-y-6">
            <div className="sticky top-8 space-y-6">
              <SpotlightCard className={cardClassName({ glass: true })}>
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Search</h3>
```
**Raw class strings detected (best effort):**

- `space-y-6`
- `sticky top-8 space-y-6`
- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `sticky` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:748`

```jsx
            <div className="sticky top-8 space-y-6">
              <SpotlightCard className={cardClassName({ glass: true })}>
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Search</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Search FAQ answers instantly.</p>
```
**Raw class strings detected (best effort):**

- `sticky top-8 space-y-6`
- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-2 text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `sticky` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:749`

```jsx
              <SpotlightCard className={cardClassName({ glass: true })}>
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Search</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Search FAQ answers instantly.</p>
                <div className="mt-4">
```
**Raw class strings detected (best effort):**

- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-2 text-xs text-slate-500 dark:text-slate-400`
- `mt-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:750`

```jsx
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Search</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Search FAQ answers instantly.</p>
                <div className="mt-4">
                  <input
```
**Raw class strings detected (best effort):**

- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-2 text-xs text-slate-500 dark:text-slate-400`
- `mt-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:751`

```jsx
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Search FAQ answers instantly.</p>
                <div className="mt-4">
                  <input
                    value={q}
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-slate-500 dark:text-slate-400`
- `mt-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:752`

```jsx
                <div className="mt-4">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
```
**Raw class strings detected (best effort):**

- `mt-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:757`

```jsx
                    className="w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
```
**Raw class strings detected (best effort):**

- `w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400`
- `mt-3 flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `placeholder:text-slate-500` — Variant prefix (responsive, dark, or interaction state).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2.5` — Vertical padding (top/bottom).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-blue-500/40` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:placeholder:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:760`

```jsx
                <div className="mt-3 flex flex-wrap gap-2">
                  {['verification', 'contracts', 'messages', 'premium', 'sub-accounts'].map((chip) => (
                    <button
                      key={chip}
```
**Raw class strings detected (best effort):**

- `mt-3 flex flex-wrap gap-2`
- `verification`
- `contracts`
- `messages`
- `premium`
- `sub-accounts`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `contracts` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `messages` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `premium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `sub-accounts` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:766`

```jsx
                      className="rounded-full bg-slate-900/4 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-900/6 active:scale-[0.98] dark:bg-white/6 dark:text-slate-300 dark:hover:bg-white/8"
                    >
                      {chip}
                    </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-900/4 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-900/6 active:scale-[0.98] dark:bg-white/6 dark:text-slate-300 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-900/6` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:774`

```jsx
              <SpotlightCard className={cardClassName({ glass: true })}>
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Quick navigation</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[...HELP_SECTIONS.map((s) => ({ id: s.id, label: s.title })), { id: 'faq', label: '10. FAQ' }].map((s) => (
```
**Raw class strings detected (best effort):**

- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-4 flex flex-wrap gap-2`
- `faq`
- `10. FAQ`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `faq` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `10.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `FAQ` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:775`

```jsx
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Quick navigation</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[...HELP_SECTIONS.map((s) => ({ id: s.id, label: s.title })), { id: 'faq', label: '10. FAQ' }].map((s) => (
                    <a
```
**Raw class strings detected (best effort):**

- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `mt-4 flex flex-wrap gap-2`
- `faq`
- `10. FAQ`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `faq` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `10.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `FAQ` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:776`

```jsx
                <div className="mt-4 flex flex-wrap gap-2">
                  {[...HELP_SECTIONS.map((s) => ({ id: s.id, label: s.title })), { id: 'faq', label: '10. FAQ' }].map((s) => (
                    <a
                      key={s.id}
```
**Raw class strings detected (best effort):**

- `mt-4 flex flex-wrap gap-2`
- `faq`
- `10. FAQ`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `faq` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `10.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `FAQ` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/HelpCenter.jsx:781`

```jsx
                      className="rounded-full bg-blue-600/10 px-3 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-600/14 active:scale-[0.98] dark:bg-blue-500/12 dark:text-blue-200 dark:hover:bg-blue-500/18"
                    >
                      {s.label}
                    </a>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-blue-600/10 px-3 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-600/14 active:scale-[0.98] dark:bg-blue-500/12 dark:text-blue-200 dark:hover:bg-blue-500/18`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-blue-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600/10` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-blue-600/14` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-[0.98]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-blue-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-blue-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-blue-500/18` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:789`

```jsx
              <SpotlightCard className={cardClassName({ glass: true })}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Floating Assistant</h3>
                  <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:790`

```jsx
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Floating Assistant</h3>
                  <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                    Orb mode
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:791`

```jsx
                  <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Floating Assistant</h3>
                  <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                    Orb mode
                  </span>
```
**Raw class strings detected (best effort):**

- `text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100`
- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:792`

```jsx
                  <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                    Orb mode
                  </span>
                </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/6` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:796`

```jsx
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  On this page, the assistant uses a glass “Orb” with a rotating ring in dark mode to signal it’s ready to help.
                </p>
                <div className="mt-4 rounded-xl bg-slate-900/2 p-4 dark:bg-white/5">
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400`
- `mt-4 rounded-xl bg-slate-900/2 p-4 dark:bg-white/5`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/2` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:799`

```jsx
                <div className="mt-4 rounded-xl bg-slate-900/2 p-4 dark:bg-white/5">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">What it can do</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Setup, navigation, support articles — it does not negotiate.
```
**Raw class strings detected (best effort):**

- `mt-4 rounded-xl bg-slate-900/2 p-4 dark:bg-white/5`
- `text-xs font-semibold text-slate-900 dark:text-slate-100`
- `mt-2 text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900/2` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:800`

```jsx
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">What it can do</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Setup, navigation, support articles — it does not negotiate.
                  </p>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-900 dark:text-slate-100`
- `mt-2 text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/HelpCenter.jsx:801`

```jsx
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Setup, navigation, support articles — it does not negotiate.
                  </p>
                </div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/HelpCenter.jsx:378` — Help Center

```jsx
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Help Center</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Industrial reliability, tech-forward SaaS guidance.</p>
        </header>

```
- `src/pages/HelpCenter.jsx:379` — Industrial reliability, tech-forward SaaS guidance.

```jsx
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Industrial reliability, tech-forward SaaS guidance.</p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
```
- `src/pages/HelpCenter.jsx:422` — •

```jsx
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
```
- `src/pages/HelpCenter.jsx:448` — •

```jsx
                                  <span className="mt-0.5 text-blue-600/90 dark:text-blue-400">•</span>
                                  <span>{p}</span>
                                </li>
                              ))}
```
- `src/pages/HelpCenter.jsx:466` — •

```jsx
                                  <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">•</span>
                                  <span>{d}</span>
                                </li>
                              ))}
```
- `src/pages/HelpCenter.jsx:489` — •

```jsx
                                    <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
                                    <span>{p}</span>
                                  </li>
                                ))}
```
- `src/pages/HelpCenter.jsx:525` — Lock demo

```jsx
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Lock demo</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {lockGranted ? 'Permission granted — teammates can message.' : 'Locked — teammates need permission.'}
                                    </p>
```
- `src/pages/HelpCenter.jsx:549` — •

```jsx
                            <span className="mt-0.5 text-blue-600 dark:text-blue-400">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
```
- `src/pages/HelpCenter.jsx:610` — Q: {f.q}

```jsx
                                <span className="min-w-0 truncate">Q: {f.q}</span>
                                <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400" />
                              </summary>
                              <p className="mt-3 border-l-2 border-blue-600/50 pl-4 text-sm text-slate-500 dark:border-blue-400/50 dark:text-slate-400">
```
- `src/pages/HelpCenter.jsx:723` — Contact Support

```jsx
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Support</h2>
                    <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                      Response varies
                    </span>
```
- `src/pages/HelpCenter.jsx:740` — /help

```jsx
                    Tip: On <span className="font-semibold">/help</span>, the assistant uses an “Orb” style to indicate ready-to-help status.
                  </p>
                </SpotlightCard>
              </section>
```
- `src/pages/HelpCenter.jsx:750` — Search

```jsx
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Search</h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Search FAQ answers instantly.</p>
                <div className="mt-4">
                  <input
```
- `src/pages/HelpCenter.jsx:751` — Search FAQ answers instantly.

```jsx
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Search FAQ answers instantly.</p>
                <div className="mt-4">
                  <input
                    value={q}
```
- `src/pages/HelpCenter.jsx:775` — Quick navigation

```jsx
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Quick navigation</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[...HELP_SECTIONS.map((s) => ({ id: s.id, label: s.title })), { id: 'faq', label: '10. FAQ' }].map((s) => (
                    <a
```
- `src/pages/HelpCenter.jsx:791` — Floating Assistant

```jsx
                  <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Floating Assistant</h3>
                  <span className="rounded-full bg-slate-900/4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/6 dark:text-slate-400">
                    Orb mode
                  </span>
```
- `src/pages/HelpCenter.jsx:800` — What it can do

```jsx
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">What it can do</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Setup, navigation, support articles — it does not negotiate.
                  </p>
```
- `src/pages/HelpCenter.jsx:580` — Search FAQs...

```jsx
                      placeholder="Search FAQs..."
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
```
- `src/pages/HelpCenter.jsx:642` — Question

```jsx
                          placeholder="Question"
                          value={form.question}
                          onChange={(e) => setForm({ ...form, question: e.target.value })}
                          className="w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
```
- `src/pages/HelpCenter.jsx:649` — Answer

```jsx
                          placeholder="Answer"
                          value={form.answer}
                          onChange={(e) => setForm({ ...form, answer: e.target.value })}
                          className="min-h-28 w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
```
- `src/pages/HelpCenter.jsx:656` — Keywords (comma separated)

```jsx
                          placeholder="Keywords (comma separated)"
                          value={form.keywords}
                          onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                          className="w-full rounded-xl bg-slate-900/4 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
```
- `src/pages/HelpCenter.jsx:756` — Search users, terms, workflows...

```jsx
                    placeholder="Search users, terms, workflows..."
                    className="w-full rounded-full bg-slate-900/4 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-400"
                  />
                </div>
```
- `src/pages/HelpCenter.jsx:531` — (element) <button>

```jsx
                                <button
                                  type="button"
                                  onClick={() => setLockGranted((v) => !v)}
                                  className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400"
```
- `src/pages/HelpCenter.jsx:662` — (element) <button>

```jsx
                          <button
                            type="submit"
                            className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400"
                          >
```
- `src/pages/HelpCenter.jsx:669` — (element) <button>

```jsx
                            <button
                              type="button"
                              onClick={resetForm}
                              className="rounded-full bg-slate-900/4 px-5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-900/6 active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/8"
```
- `src/pages/HelpCenter.jsx:701` — (element) <button>

```jsx
                                  <button onClick={() => selectForEdit(e)} className="text-blue-600 hover:underline dark:text-blue-400">
                                    Edit
                                  </button>
                                  <button onClick={() => removeFaq(e.id)} className="text-rose-600 hover:underline dark:text-rose-300">
```
- `src/pages/HelpCenter.jsx:704` — (element) <button>

```jsx
                                  <button onClick={() => removeFaq(e.id)} className="text-rose-600 hover:underline dark:text-rose-300">
                                    Del
                                  </button>
                                </div>
```
- `src/pages/HelpCenter.jsx:732` — (element) <button>

```jsx
                    <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:text-slate-900 dark:hover:bg-blue-400">
                      Open support ticket
                    </button>
                    <button className="rounded-full bg-[#ffffff] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/8">
```
- `src/pages/HelpCenter.jsx:735` — (element) <button>

```jsx
                    <button className="rounded-full bg-[#ffffff] px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-white/6 dark:text-slate-100 dark:shadow-none dark:hover:translate-y-0 dark:hover:bg-white/8">
                      Live chat
                    </button>
                  </div>
```
- `src/pages/HelpCenter.jsx:762` — (element) <button>

```jsx
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setQ(chip)}
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /assistant/knowledge (src/pages/HelpCenter.jsx:274) | /api/assistant -> server/routes/assistantRoutes.js:69 | GET /knowledge (server/routes/assistantRoutes.js:16) | - | getAssistantKnowledge |
| PUT /assistant/knowledge/${editingId} (src/pages/HelpCenter.jsx:319) | /api/assistant -> server/routes/assistantRoutes.js:69 | - | - | - |
| POST /assistant/knowledge (src/pages/HelpCenter.jsx:321) | /api/assistant -> server/routes/assistantRoutes.js:69 | POST /knowledge (server/routes/assistantRoutes.js:17) | - | createAssistantKnowledge |
| DELETE /assistant/knowledge/${entryId} (src/pages/HelpCenter.jsx:335) | /api/assistant -> server/routes/assistantRoutes.js:69 | - | - | - |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/HelpCenter.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
{% endraw %}

