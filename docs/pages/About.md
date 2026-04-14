# About - Route `/about`

**Access:** Public

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/About.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/About.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_About.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/About.jsx:28)
- ../components/ui/MagneticButton (src/pages/About.jsx:29)
- ../components/ui/SpotlightCard (src/pages/About.jsx:30)

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

#### `src/pages/About.jsx:53`

```jsx
function Skeleton({ className='' }) {
  return <div className={['skeleton', className].join(' ')} />
}

```
**Raw class strings detected (best effort):**

- `skeleton`
- ` `

**Utility breakdown (grouped):**

- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:54`

```jsx
  return <div className={['skeleton', className].join(' ')} />
}

function MotionItem({ index, className='', children }) {
```
**Raw class strings detected (best effort):**

- `skeleton`
- ` `

**Utility breakdown (grouped):**

- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:57`

```jsx
function MotionItem({ index, className='', children }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
```
**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**


#### `src/pages/About.jsx:59`

```jsx
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
```
**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**


#### `src/pages/About.jsx:62`

```jsx
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
```
**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**


#### `src/pages/About.jsx:75`

```jsx
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        'bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.12)]',
        'dark:bg-emerald-500/12 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_28px_rgba(16,185,129,0.14)]',
```
**Raw class strings detected (best effort):**

- `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold`
- `bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.12)]`
- `dark:bg-emerald-500/12 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_28px_rgba(16,185,129,0.14)]`

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
  - `shadow-[0_0_0_1px_rgba(5,150,105,0.20),0_16px_36px_rgba(5,150,105,0.12)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-emerald-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_28px_rgba(16,185,129,0.14)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:82`

```jsx
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_14px_rgba(5,150,105,0.55)] dark:bg-emerald-400 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
      {label}
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

#### `src/pages/About.jsx:92`

```jsx
      <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700 shadow-[0_0_0_1px_rgba(56,189,248,0.18)] dark:bg-sky-400/10 dark:text-sky-200">
        Pending
      </span>
    )
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700 shadow-[0_0_0_1px_rgba(56,189,248,0.18)] dark:bg-sky-400/10 dark:text-sky-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sky-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-sky-500/10` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_0_0_1px_rgba(56,189,248,0.18)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-sky-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:98`

```jsx
    <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-700 shadow-[0_0_0_1px_rgba(244,63,94,0.18)] dark:bg-rose-400/10 dark:text-rose-200">
      Expired
    </span>
  )
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-700 shadow-[0_0_0_1px_rgba(244,63,94,0.18)] dark:bg-rose-400/10 dark:text-rose-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-500/10` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_0_0_1px_rgba(244,63,94,0.18)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-rose-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:152`

```jsx
    <div className="weave-bg relative min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#1E293B] dark:bg-[#0F172A] dark:text-[#F1F5F9]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <MotionItem index={0} className="lg:col-span-8">
```
**Raw class strings detected (best effort):**

- `weave-bg relative min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#1E293B] dark:bg-[#0F172A] dark:text-[#F1F5F9]`
- `mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8`
- `grid grid-cols-1 gap-6 lg:grid-cols-12`
- `lg:col-span-8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `weave-bg` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-x-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-16` — Vertical padding (top/bottom).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#F8FAFC]` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:px-6` — Variant prefix (responsive, dark, or interaction state).
  - `lg:px-8` — Variant prefix (responsive, dark, or interaction state).
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#0F172A]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#F1F5F9]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:153`

```jsx
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <MotionItem index={0} className="lg:col-span-8">
            <SpotlightCard
```
**Raw class strings detected (best effort):**

- `mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8`
- `grid grid-cols-1 gap-6 lg:grid-cols-12`
- `lg:col-span-8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-16` — Vertical padding (top/bottom).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:px-6` — Variant prefix (responsive, dark, or interaction state).
  - `lg:px-8` — Variant prefix (responsive, dark, or interaction state).
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:154`

```jsx
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <MotionItem index={0} className="lg:col-span-8">
            <SpotlightCard
              className={[
```
**Raw class strings detected (best effort):**

- `grid grid-cols-1 gap-6 lg:grid-cols-12`
- `lg:col-span-8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:155`

```jsx
          <MotionItem index={0} className="lg:col-span-8">
            <SpotlightCard
              className={[
                'rounded-xl p-8',
```
**Raw class strings detected (best effort):**

- `lg:col-span-8`
- `rounded-xl p-8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-8` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:157`

```jsx
              className={[
                'rounded-xl p-8',
                'bg-white/60 backdrop-blur-[10px]',
                'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-8`
- `bg-white/60 backdrop-blur-[10px]`
- `shadow-[0_10px_40px_rgba(15,23,42,0.08)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-8` — Padding (all sides).
- **Color / surface:**
  - `bg-white/60` — Background color/surface.
  - `backdrop-blur-[10px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).

#### `src/pages/About.jsx:167`

```jsx
              <h1 className="text-4xl font-extrabold tracking-tight text-[#1E293B] dark:text-[#F1F5F9] sm:text-5xl">
                About GarTexHub - Show notifications
              </h1>
              <p className="mt-3 text-lg italic text-[#475569] dark:text-slate-300">
```
**Raw class strings detected (best effort):**

- `text-4xl font-extrabold tracking-tight text-[#1E293B] dark:text-[#F1F5F9] sm:text-5xl`
- `mt-3 text-lg italic text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-4xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-lg` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:text-5xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-[#F1F5F9]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:170`

```jsx
              <p className="mt-3 text-lg italic text-[#475569] dark:text-slate-300">
                A professional B2B platform built exclusively for the Garments and Textile industry.
              </p>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-300">
```
**Raw class strings detected (best effort):**

- `mt-3 text-lg italic text-[#475569] dark:text-slate-300`
- `mt-5 max-w-3xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `text-[15px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:173`

```jsx
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub is a professional B2B platform built exclusively for the Garments and Textile industry. Our goal is
                to create a structured, transparent, and trust-driven environment where international buyers, factories, and
                buying houses can connect with confidence.
```
**Raw class strings detected (best effort):**

- `mt-5 max-w-3xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[15px]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:179`

```jsx
              <div className="mt-7 flex flex-wrap gap-3">
                <MagneticButton
                  to="/verification"
                  className="liquid-btn inline-flex items-center justify-center rounded-md bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.20)] transition hover:brightness-105 dark:bg-sky-500/15 dark:text-sky-100 dark:shadow-none"
```
**Raw class strings detected (best effort):**

- `mt-7 flex flex-wrap gap-3`
- `/verification`
- `liquid-btn inline-flex items-center justify-center rounded-md bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.20)] transition hover:brightness-105 dark:bg-sky-500/15 dark:text-sky-100 dark:shadow-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0F172A]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_14px_34px_rgba(15,23,42,0.20)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:brightness-105` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-sky-500/15` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `/verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `liquid-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:182`

```jsx
                  className="liquid-btn inline-flex items-center justify-center rounded-md bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.20)] transition hover:brightness-105 dark:bg-sky-500/15 dark:text-sky-100 dark:shadow-none"
                >
                  View verification standards
                </MagneticButton>
```
**Raw class strings detected (best effort):**

- `liquid-btn inline-flex items-center justify-center rounded-md bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.20)] transition hover:brightness-105 dark:bg-sky-500/15 dark:text-sky-100 dark:shadow-none`

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
  - `bg-[#0F172A]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_14px_34px_rgba(15,23,42,0.20)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:brightness-105` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-sky-500/15` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-sky-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `liquid-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:188`

```jsx
                  className="liquid-btn inline-flex items-center justify-center rounded-md bg-white/70 px-5 py-3 text-sm font-semibold text-[#1E293B] shadow-[0_10px_26px_rgba(15,23,42,0.10)] transition hover:bg-white dark:bg-white/10 dark:text-white dark:shadow-none"
                >
                  Contact sales
                </MagneticButton>
```
**Raw class strings detected (best effort):**

- `liquid-btn inline-flex items-center justify-center rounded-md bg-white/70 px-5 py-3 text-sm font-semibold text-[#1E293B] shadow-[0_10px_26px_rgba(15,23,42,0.10)] transition hover:bg-white dark:bg-white/10 dark:text-white dark:shadow-none`

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
  - `bg-white/70` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-md` — Corner radius.
  - `shadow-[0_10px_26px_rgba(15,23,42,0.10)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `liquid-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:196`

```jsx
          <MotionItem index={1} className="lg:col-span-4">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-4`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:198`

```jsx
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]`
- `dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#FFFFFF]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[rgba(30,41,59,0.80)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:207`

```jsx
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#1E293B] dark:text-[#F1F5F9]">Trust indicators</p>
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between`
- `text-sm font-semibold text-[#1E293B] dark:text-[#F1F5F9]`
- `h-5 w-5 text-emerald-600 dark:text-emerald-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#F1F5F9]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:208`

```jsx
                <p className="text-sm font-semibold text-[#1E293B] dark:text-[#F1F5F9]">Trust indicators</p>
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-[#1E293B] dark:text-[#F1F5F9]`
- `h-5 w-5 text-emerald-600 dark:text-emerald-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-[#F1F5F9]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:209`

```jsx
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              {loadError ? (
```
**Raw class strings detected (best effort):**

- `h-5 w-5 text-emerald-600 dark:text-emerald-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-emerald-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-emerald-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:213`

```jsx
                <p className="mt-3 text-xs text-[#64748B] dark:text-slate-300">Live data unavailable -- showing defaults.</p>
              ) : null}

              <div className="mt-5 grid gap-3">
```
**Raw class strings detected (best effort):**

- `mt-3 text-xs text-[#64748B] dark:text-slate-300`
- `mt-5 grid gap-3`

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
  - `text-[#64748B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:216`

```jsx
              <div className="mt-5 grid gap-3">
                {loading ? (
                  <>
                    <Skeleton className="h-14 rounded-lg" />
```
**Raw class strings detected (best effort):**

- `mt-5 grid gap-3`
- `h-14 rounded-lg`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.

#### `src/pages/About.jsx:219`

```jsx
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
```
**Raw class strings detected (best effort):**

- `h-14 rounded-lg`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.

#### `src/pages/About.jsx:220`

```jsx
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                  </>
```
**Raw class strings detected (best effort):**

- `h-14 rounded-lg`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.

#### `src/pages/About.jsx:221`

```jsx
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                  </>
                ) : (
```
**Raw class strings detected (best effort):**

- `h-14 rounded-lg`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.

#### `src/pages/About.jsx:222`

```jsx
                    <Skeleton className="h-14 rounded-lg" />
                  </>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
```
**Raw class strings detected (best effort):**

- `h-14 rounded-lg`
- `wait`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `wait` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.

#### `src/pages/About.jsx:232`

```jsx
                      className="grid gap-3"
                    >
                      {[
                        { label: 'Verified factories', value: String(about.stats.verifiedFactories) },
```
**Raw class strings detected (best effort):**

- `grid gap-3`
- `Verified factories`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `factories` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:240`

```jsx
                        <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-900/4 px-4 py-3 dark:bg-white/5">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] dark:text-slate-300">{item.label}</p>
                          <p className="text-lg font-extrabold tracking-tight text-[#1E293B] dark:text-white">{item.value}</p>
                        </div>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between rounded-lg bg-slate-900/4 px-4 py-3 dark:bg-white/5`
- `text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] dark:text-slate-300`
- `text-lg font-extrabold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-lg` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:241`

```jsx
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] dark:text-slate-300">{item.label}</p>
                          <p className="text-lg font-extrabold tracking-tight text-[#1E293B] dark:text-white">{item.value}</p>
                        </div>
                      ))}
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] dark:text-slate-300`
- `text-lg font-extrabold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-lg` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:242`

```jsx
                          <p className="text-lg font-extrabold tracking-tight text-[#1E293B] dark:text-white">{item.value}</p>
                        </div>
                      ))}
                    </motion.div>
```
**Raw class strings detected (best effort):**

- `text-lg font-extrabold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:252`

```jsx
          <MotionItem index={2} className="lg:col-span-12">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-12`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-12` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:254`

```jsx
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]`
- `dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#FFFFFF]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[rgba(30,41,59,0.80)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:263`

```jsx
              <h2 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-white">Why GarTexHub Exists</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                Cross-border textile trade often depends on informal communication, scattered documents, and manual
                verification processes. This creates inefficiencies, misunderstandings, and trust barriers.
```
**Raw class strings detected (best effort):**

- `text-xl font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:264`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                Cross-border textile trade often depends on informal communication, scattered documents, and manual
                verification processes. This creates inefficiencies, misunderstandings, and trust barriers.
              </p>
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:268`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub was created to solve this problem by combining structured communication, verified business
                identities, and secure documentation within one unified system.
              </p>
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:275`

```jsx
          <MotionItem index={3} className="lg:col-span-4">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-4`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:277`

```jsx
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]`
- `dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#FFFFFF]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[rgba(30,41,59,0.80)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:286`

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Mission</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                To simplify international garment sourcing by building a secure digital infrastructure that prioritizes
                credibility, transparency, and efficiency.
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:287`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                To simplify international garment sourcing by building a secure digital infrastructure that prioritizes
                credibility, transparency, and efficiency.
              </p>
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:294`

```jsx
          <MotionItem index={4} className="lg:col-span-4">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-4`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:296`

```jsx
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]`
- `dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#FFFFFF]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[rgba(30,41,59,0.80)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:305`

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Vision</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                To become a trusted digital bridge between global buyers and garment manufacturers, reducing negotiation
                friction and strengthening international trade relationships.
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:306`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                To become a trusted digital bridge between global buyers and garment manufacturers, reducing negotiation
                friction and strengthening international trade relationships.
              </p>
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:313`

```jsx
          <MotionItem index={5} className="lg:col-span-4 lg:row-span-2">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-4 lg:row-span-2`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).
  - `lg:row-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:315`

```jsx
              className={[
                'rounded-xl p-7',
                'bg-white/60 backdrop-blur-[10px]',
                'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-white/60 backdrop-blur-[10px]`
- `shadow-[0_10px_40px_rgba(15,23,42,0.08)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-white/60` — Background color/surface.
  - `backdrop-blur-[10px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).

#### `src/pages/About.jsx:325`

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">How the Platform Works</h2>

              <ul className="mt-6 space-y-4">
                {howItWorks.map((step, idx) => (
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-6 space-y-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:327`

```jsx
              <ul className="mt-6 space-y-4">
                {howItWorks.map((step, idx) => (
                  <motion.li
                    key={`${step}-${idx}`}
```
**Raw class strings detected (best effort):**

- `mt-6 space-y-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:334`

```jsx
                    className="flex gap-3"
                  >
                    <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.18)] dark:bg-emerald-500/12 dark:text-emerald-200">
                      <Check className="h-4 w-4" />
```
**Raw class strings detected (best effort):**

- `flex gap-3`
- `mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.18)] dark:bg-emerald-500/12 dark:text-emerald-200`
- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-600/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `shadow-[0_0_0_1px_rgba(5,150,105,0.18)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-emerald-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:336`

```jsx
                    <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.18)] dark:bg-emerald-500/12 dark:text-emerald-200">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
```
**Raw class strings detected (best effort):**

- `mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 shadow-[0_0_0_1px_rgba(5,150,105,0.18)] dark:bg-emerald-500/12 dark:text-emerald-200`
- `h-4 w-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-600/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `shadow-[0_0_0_1px_rgba(5,150,105,0.18)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-emerald-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:337`

```jsx
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm leading-relaxed text-[#475569] dark:text-slate-300">{step}</p>
```
**Raw class strings detected (best effort):**

- `h-4 w-4`
- `text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:340`

```jsx
                      <p className="text-sm leading-relaxed text-[#475569] dark:text-slate-300">{step}</p>
                    </div>
                  </motion.li>
                ))}
```
**Raw class strings detected (best effort):**

- `text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:348`

```jsx
          <MotionItem index={6} className="lg:col-span-8">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-8`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:350`

```jsx
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]`
- `dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#FFFFFF]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[rgba(30,41,59,0.80)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:359`

```jsx
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verification & Trust</h2>
                </div>
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-4`
- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:361`

```jsx
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verification & Trust</h2>
                </div>
                <VerifiedBadge label="Verification green" />
              </div>
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `Verification green`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `green` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:366`

```jsx
              <p className="mt-4 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub uses a document-based verification system. Companies must submit legal and operational documents,
                which are manually reviewed before verification status is granted.
              </p>
```
**Raw class strings detected (best effort):**

- `mt-4 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:370`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                Verification is subscription-based and must be maintained to ensure ongoing compliance.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:373`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                The more verified documentation a company provides, the stronger its credibility and international acceptance.
              </p>
            </SpotlightCard>
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:379`

```jsx
          <MotionItem index={7} className="lg:col-span-7">
            <SpotlightCard
              className={[
                'needle-area rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-7`
- `needle-area rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `needle-area` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:381`

```jsx
              className={[
                'needle-area rounded-xl p-7',
                'bg-white/60 backdrop-blur-[10px]',
                'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
```
**Raw class strings detected (best effort):**

- `needle-area rounded-xl p-7`
- `bg-white/60 backdrop-blur-[10px]`
- `shadow-[0_10px_40px_rgba(15,23,42,0.08)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-white/60` — Background color/surface.
  - `backdrop-blur-[10px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Other:**
  - `needle-area` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:392`

```jsx
              <span className="needle-cursor" />
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verified documents</h2>
```
**Raw class strings detected (best effort):**

- `needle-cursor`
- `flex items-center justify-between gap-3`
- `min-w-0`
- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `needle-cursor` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:393`

```jsx
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verified documents</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `min-w-0`
- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:394`

```jsx
                <div className="min-w-0">
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verified documents</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                    Skeleton loads into audit-ready details -- verified signals stay prominent.
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:395`

```jsx
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verified documents</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                    Skeleton loads into audit-ready details -- verified signals stay prominent.
                  </p>
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:396`

```jsx
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                    Skeleton loads into audit-ready details -- verified signals stay prominent.
                  </p>
                </div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:400`

```jsx
                <FileText className="h-5 w-5 text-[#0F172A]/70 dark:text-slate-200" />
              </div>

              <div className="mt-6 grid gap-3">
```
**Raw class strings detected (best effort):**

- `h-5 w-5 text-[#0F172A]/70 dark:text-slate-200`
- `mt-6 grid gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#0F172A]/70` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:403`

```jsx
              <div className="mt-6 grid gap-3">
                {loading ? (
                  <>
                    <Skeleton className="h-12 rounded-xl" />
```
**Raw class strings detected (best effort):**

- `mt-6 grid gap-3`
- `h-12 rounded-xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/About.jsx:406`

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

#### `src/pages/About.jsx:407`

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

#### `src/pages/About.jsx:408`

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

#### `src/pages/About.jsx:409`

```jsx
                    <Skeleton className="h-12 rounded-xl" />
                  </>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
```
**Raw class strings detected (best effort):**

- `h-12 rounded-xl`
- `wait`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `wait` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.

#### `src/pages/About.jsx:419`

```jsx
                      className="grid gap-3"
                    >
                      {(about.documents || []).map((doc) => (
                        <div
```
**Raw class strings detected (best effort):**

- `grid gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:424`

```jsx
                          className={[
                            'group flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3',
                            'bg-[#FFFFFF] shadow-[0_10px_26px_rgba(15,23,42,0.08)]',
                            'transition duration-300 ease-out',
```
**Raw class strings detected (best effort):**

- `group flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3`
- `bg-[#FFFFFF] shadow-[0_10px_26px_rgba(15,23,42,0.08)]`
- `transition duration-300 ease-out`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-[#FFFFFF]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_26px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `group` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:432`

```jsx
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#1E293B] dark:text-white">{doc.name}</p>
                            <p className="mt-1 text-xs text-[#64748B] dark:text-slate-300">Updated {doc.updatedAt}</p>
                          </div>
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `truncate text-sm font-semibold text-[#1E293B] dark:text-white`
- `mt-1 text-xs text-[#64748B] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#64748B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:433`

```jsx
                            <p className="truncate text-sm font-semibold text-[#1E293B] dark:text-white">{doc.name}</p>
                            <p className="mt-1 text-xs text-[#64748B] dark:text-slate-300">Updated {doc.updatedAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
```
**Raw class strings detected (best effort):**

- `truncate text-sm font-semibold text-[#1E293B] dark:text-white`
- `mt-1 text-xs text-[#64748B] dark:text-slate-300`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#64748B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:434`

```jsx
                            <p className="mt-1 text-xs text-[#64748B] dark:text-slate-300">Updated {doc.updatedAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusChip status={doc.status} />
```
**Raw class strings detected (best effort):**

- `mt-1 text-xs text-[#64748B] dark:text-slate-300`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:436`

```jsx
                          <div className="flex items-center gap-2">
                            <StatusChip status={doc.status} />
                          </div>
                        </div>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/About.jsx:448`

```jsx
          <MotionItem index={8} className="lg:col-span-5">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-5`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:450`

```jsx
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]`
- `dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#FFFFFF]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[rgba(30,41,59,0.80)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:459`

```jsx
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Digital Bridge</h2>
                <span className="rounded-full bg-[#0F172A]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569] dark:bg-white/8 dark:text-slate-300">
                  Coming soon
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `rounded-full bg-[#0F172A]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569] dark:bg-white/8 dark:text-slate-300`

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
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `bg-[#0F172A]/5` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/8` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:460`

```jsx
                <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Digital Bridge</h2>
                <span className="rounded-full bg-[#0F172A]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569] dark:bg-white/8 dark:text-slate-300">
                  Coming soon
                </span>
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `rounded-full bg-[#0F172A]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569] dark:bg-white/8 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `bg-[#0F172A]/5` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/8` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:461`

```jsx
                <span className="rounded-full bg-[#0F172A]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569] dark:bg-white/8 dark:text-slate-300">
                  Coming soon
                </span>
              </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[#0F172A]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569] dark:bg-white/8 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.12em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#0F172A]/5` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/8` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:465`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                A global map view that visualizes verified connections between buyers and manufacturers.
              </p>
              <div className="mt-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500/10 via-emerald-500/6 to-indigo-500/10 p-5 dark:from-sky-500/12 dark:via-emerald-500/8 dark:to-indigo-500/12">
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300`
- `mt-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500/10 via-emerald-500/6 to-indigo-500/10 p-5 dark:from-sky-500/12 dark:via-emerald-500/8 dark:to-indigo-500/12`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-5` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `bg-gradient-to-br` — Background color/surface.
  - `from-sky-500/10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `via-emerald-500/6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-indigo-500/10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:from-sky-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:via-emerald-500/8` — Variant prefix (responsive, dark, or interaction state).
  - `dark:to-indigo-500/12` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:468`

```jsx
              <div className="mt-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500/10 via-emerald-500/6 to-indigo-500/10 p-5 dark:from-sky-500/12 dark:via-emerald-500/8 dark:to-indigo-500/12">
                <div className="h-32 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
```
**Raw class strings detected (best effort):**

- `mt-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500/10 via-emerald-500/6 to-indigo-500/10 p-5 dark:from-sky-500/12 dark:via-emerald-500/8 dark:to-indigo-500/12`
- `h-32 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5`
- `mt-4 grid grid-cols-3 gap-2`
- `h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-3` — Grid layout.
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-5` — Padding (all sides).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-sky-500/10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `via-emerald-500/6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-indigo-500/10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-white/55` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:from-sky-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:via-emerald-500/8` — Variant prefix (responsive, dark, or interaction state).
  - `dark:to-indigo-500/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:469`

```jsx
                <div className="h-32 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
```
**Raw class strings detected (best effort):**

- `h-32 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5`
- `mt-4 grid grid-cols-3 gap-2`
- `h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-3` — Grid layout.
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/55` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:470`

```jsx
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
```
**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-3 gap-2`
- `h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-3` — Grid layout.
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/55` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:471`

```jsx
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                </div>
```
**Raw class strings detected (best effort):**

- `h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/55` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:472`

```jsx
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                </div>
              </div>
```
**Raw class strings detected (best effort):**

- `h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/55` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:473`

```jsx
                  <div className="h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5" />
                </div>
              </div>
            </SpotlightCard>
```
**Raw class strings detected (best effort):**

- `h-8 rounded-lg bg-white/55 backdrop-blur-md dark:bg-white/5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/55` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:479`

```jsx
          <MotionItem index={9} className="lg:col-span-6">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-6`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-6` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:481`

```jsx
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]`
- `dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#FFFFFF]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[rgba(30,41,59,0.80)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:490`

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Industry Focus</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub is strictly dedicated to the Garments and Textile sector. By focusing on a single industry, we
                provide smarter categorization, clearer communication, and more relevant matching between buyers and
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:491`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub is strictly dedicated to the Garments and Textile sector. By focusing on a single industry, we
                provide smarter categorization, clearer communication, and more relevant matching between buyers and
                manufacturers.
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:499`

```jsx
          <MotionItem index={10} className="lg:col-span-6">
            <SpotlightCard
              className={[
                'rounded-xl p-7',
```
**Raw class strings detected (best effort):**

- `lg:col-span-6`
- `rounded-xl p-7`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-6` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:501`

```jsx
              className={[
                'rounded-xl p-7',
                'bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                'dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-7`
- `bg-[#FFFFFF] shadow-[0_10px_40px_rgba(15,23,42,0.08)]`
- `dark:bg-[rgba(30,41,59,0.80)] dark:ring-1 dark:ring-white/10 dark:shadow-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Color / surface:**
  - `bg-[#FFFFFF]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-[rgba(30,41,59,0.80)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:510`

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Professional Commitment</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                We do not process direct financial transactions. Our platform is designed to facilitate secure communication,
                structured agreements, and verified business interactions.
```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:511`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                We do not process direct financial transactions. Our platform is designed to facilitate secure communication,
                structured agreements, and verified business interactions.
              </p>
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:515`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub operates with the principle that trust is earned through transparency, documentation, and
                professional conduct.
              </p>
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:522`

```jsx
          <MotionItem index={11} className="lg:col-span-12">
            <SpotlightCard
              className={[
                'rounded-xl p-8',
```
**Raw class strings detected (best effort):**

- `lg:col-span-12`
- `rounded-xl p-8`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-8` — Padding (all sides).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Responsive variants:**
  - `lg:col-span-12` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:524`

```jsx
              className={[
                'rounded-xl p-8',
                'bg-white/60 backdrop-blur-[10px]',
                'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
```
**Raw class strings detected (best effort):**

- `rounded-xl p-8`
- `bg-white/60 backdrop-blur-[10px]`
- `shadow-[0_10px_40px_rgba(15,23,42,0.08)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-8` — Padding (all sides).
- **Color / surface:**
  - `bg-white/60` — Background color/surface.
  - `backdrop-blur-[10px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-[0_10px_40px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).

#### `src/pages/About.jsx:531`

```jsx
              <h2 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-white">Contact & Legal Information</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                For partnership inquiries, support, or compliance-related questions, please contact us through our official
                communication channels listed on the platform.
```
**Raw class strings detected (best effort):**

- `text-xl font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/About.jsx:532`

```jsx
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                For partnership inquiries, support, or compliance-related questions, please contact us through our official
                communication channels listed on the platform.
              </p>
```
**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/About.jsx:208` — Trust indicators

```jsx
                <p className="text-sm font-semibold text-[#1E293B] dark:text-[#F1F5F9]">Trust indicators</p>
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

```
- `src/pages/About.jsx:213` — Live data unavailable -- showing defaults.

```jsx
                <p className="mt-3 text-xs text-[#64748B] dark:text-slate-300">Live data unavailable -- showing defaults.</p>
              ) : null}

              <div className="mt-5 grid gap-3">
```
- `src/pages/About.jsx:263` — Why GarTexHub Exists

```jsx
              <h2 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-white">Why GarTexHub Exists</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                Cross-border textile trade often depends on informal communication, scattered documents, and manual
                verification processes. This creates inefficiencies, misunderstandings, and trust barriers.
```
- `src/pages/About.jsx:286` — Mission

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Mission</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                To simplify international garment sourcing by building a secure digital infrastructure that prioritizes
                credibility, transparency, and efficiency.
```
- `src/pages/About.jsx:305` — Vision

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Vision</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                To become a trusted digital bridge between global buyers and garment manufacturers, reducing negotiation
                friction and strengthening international trade relationships.
```
- `src/pages/About.jsx:325` — How the Platform Works

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">How the Platform Works</h2>

              <ul className="mt-6 space-y-4">
                {howItWorks.map((step, idx) => (
```
- `src/pages/About.jsx:361` — Verification & Trust

```jsx
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verification & Trust</h2>
                </div>
                <VerifiedBadge label="Verification green" />
              </div>
```
- `src/pages/About.jsx:395` — Verified documents

```jsx
                  <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Verified documents</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                    Skeleton loads into audit-ready details -- verified signals stay prominent.
                  </p>
```
- `src/pages/About.jsx:434` — Updated {doc.updatedAt}

```jsx
                            <p className="mt-1 text-xs text-[#64748B] dark:text-slate-300">Updated {doc.updatedAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusChip status={doc.status} />
```
- `src/pages/About.jsx:460` — Digital Bridge

```jsx
                <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Digital Bridge</h2>
                <span className="rounded-full bg-[#0F172A]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569] dark:bg-white/8 dark:text-slate-300">
                  Coming soon
                </span>
```
- `src/pages/About.jsx:490` — Industry Focus

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Industry Focus</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                GarTexHub is strictly dedicated to the Garments and Textile sector. By focusing on a single industry, we
                provide smarter categorization, clearer communication, and more relevant matching between buyers and
```
- `src/pages/About.jsx:510` — Professional Commitment

```jsx
              <h2 className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-white">Professional Commitment</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                We do not process direct financial transactions. Our platform is designed to facilitate secure communication,
                structured agreements, and verified business interactions.
```
- `src/pages/About.jsx:531` — Contact & Legal Information

```jsx
              <h2 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-white">Contact & Legal Information</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                For partnership inquiries, support, or compliance-related questions, please contact us through our official
                communication channels listed on the platform.
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /system/about (src/pages/About.jsx:17) | /api/system -> server/routes/systemRoutes.js:127 | GET /about (server/routes/systemRoutes.js:9) | server/controllers/systemController.js | systemAbout |
| GET /system/about (src/pages/About.jsx:113) | /api/system -> server/routes/systemRoutes.js:127 | GET /about (server/routes/systemRoutes.js:9) | server/controllers/systemController.js | systemAbout |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/About.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

