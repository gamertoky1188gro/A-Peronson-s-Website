# TexHub - Route `/`

**Access:** Public

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/TexHub.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/TexHub.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_TexHub.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/TexHub.jsx:29)

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

#### `src/pages/TexHub.jsx:40`

```jsx
className =
  "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_10px_24px_rgba(16,185,129,0.12)] dark:bg-emerald-400/8 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.14),0_0_32px_rgba(16,185,129,0.16)]";
title =
  "Verified" >
  (
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.65)] dark:bg-emerald-300 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
  );
```

**Raw class strings detected (best effort):**

- `inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_10px_24px_rgba(16,185,129,0.12)] dark:bg-emerald-400/8 dark:text-emerald-200 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.14),0_0_32px_rgba(16,185,129,0.16)]`
- `Verified`
- `h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.65)] dark:bg-emerald-300 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2.5` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-500/10` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `bg-emerald-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_10px_24px_rgba(16,185,129,0.12)]` — Drop shadow depth (elevation).
  - `shadow-[0_0_16px_rgba(16,185,129,0.65)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-emerald-400/8` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_0_0_1px_rgba(16,185,129,0.14),0_0_32px_rgba(16,185,129,0.16)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-emerald-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:43`

```jsx
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.65)] dark:bg-emerald-300 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
      {label}
    </span>
  )
```

**Raw class strings detected (best effort):**

- `h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.65)] dark:bg-emerald-300 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_0_16px_rgba(16,185,129,0.65)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-emerald-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:49`

```jsx
function Surface({ className='', children }) {
  function handleSpotlightMove(event) {
    // Mouse-follow spotlight:
    // - store cursor position inside the card as CSS variables
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/TexHub.jsx:61`

```jsx
      className={[
        // Visual: borderless card with depth via shadows (light) + lifted slate surface (dark).
        'spotlight-card rounded-3xl bg-white/75 backdrop-blur-sm',
        'shadow-[0_18px_46px_rgba(15,23,42,0.08)]',
```

**Raw class strings detected (best effort):**

- `spotlight-card rounded-3xl bg-white/75 backdrop-blur-sm`
- `shadow-[0_18px_46px_rgba(15,23,42,0.08)]`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `bg-white/75` — Background color/surface.
  - `backdrop-blur-sm` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `shadow-[0_18px_46px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
- **Other:**
  - `spotlight-card` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:78`

```jsx
function GlassSurface({ className='', children }) {
  function handleSpotlightMove(event) {
    // Same spotlight behavior as `Surface`, but on a darker "secure room" glass surface.
    const rect = event.currentTarget.getBoundingClientRect()
```

**Raw class strings detected (best effort):**

- `secure room`

**Utility breakdown (grouped):**

- **Other:**
  - `secure` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `room` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:88`

```jsx
      className={[
        // Intentionally dark glass in *both* light + dark mode (Contract Vault = "secure room" vibe).
        // Avoid multiple `bg-*` utilities here (Tailwind utility ordering can make overrides unreliable).
        // `ring-1 ring-white/12` gives the "glass edge" without using borders (which are globally overridden in dark mode).
```

**Raw class strings detected (best effort):**

- `secure room`
- `glass edge`

**Utility breakdown (grouped):**

- **Other:**
  - `secure` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `room` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `glass` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `edge` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:106`

```jsx
function BentoMotion({ index, className='', children }) {
  const reduceMotion = useReducedMotion()
  // Accessibility: if user prefers reduced motion, render without animation.
  if (reduceMotion) return <div className={className}>{children}</div>
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/TexHub.jsx:109`

```jsx
  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/TexHub.jsx:113`

```jsx
      className={className}
      // Entrance: fade + slide up (and a tiny scale) to mimic modern "bento" reveal.
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
```

**Raw class strings detected (best effort):**

- `bento`

**Utility breakdown (grouped):**

- **Other:**
  - `bento` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:129`

```jsx
function AnimatedHeroHeading({ text, className='' }) {
  const reduceMotion = useReducedMotion()
  // Reduced-motion users get static text (no per-character animation).
  if (reduceMotion) return <span className={className}>{text}</span>
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/TexHub.jsx:132`

```jsx
if (reduceMotion) return <span className={className}>{text}</span>;

// Split into words, then characters, so we can stagger a micro animation per character.
const words = String(text).split(" ");
```

**Raw class strings detected (best effort):**

- ` `

**Utility breakdown (grouped):**

#### `src/pages/TexHub.jsx:138`

```jsx
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
```

**Raw class strings detected (best effort):**

- `sr-only`
- `true`

**Utility breakdown (grouped):**

- **Other:**
  - `sr-only` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `true` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:139`

```jsx
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          const chars = Array.from(word)
```

**Raw class strings detected (best effort):**

- `sr-only`
- `true`

**Utility breakdown (grouped):**

- **Other:**
  - `sr-only` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `true` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:145`

```jsx
              <span className="inline-block whitespace-nowrap">
                {chars.map((ch, idx) => {
                  const charIndex = globalIndex++
                  return (
```

**Raw class strings detected (best effort):**

- `inline-block whitespace-nowrap`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `whitespace-nowrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:151`

```jsx
                      className="inline-block"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: charIndex * 0.012 }}
```

**Raw class strings detected (best effort):**

- `inline-block`
- `easeOut`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `easeOut` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:170`

```jsx
function MagneticLinkButton({ to, className='', children }) {
  const reduceMotion = useReducedMotion()
  // Motion values track the current offset; springs return to center smoothly.
  const x = useMotionValue(0)
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/TexHub.jsx:199`

```jsx
    <Link to={to} className="inline-flex">
      <motion.span
        className={className}
        style={{ x: springX, y: springY }}
```

**Raw class strings detected (best effort):**

- `inline-flex`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:201`

```jsx
        className={className}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/TexHub.jsx:214`

```jsx
function SkeletonLine({ className = "" }) {
  // Skeleton shimmer utility (App.css): used during loading to avoid layout shifts.
  return <div className={["skeleton rounded-xl", className].join(" ")} />;
}
```

**Raw class strings detected (best effort):**

- `skeleton rounded-xl`
- ` `

**Utility breakdown (grouped):**

- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:216`

```jsx
  return <div className={['skeleton rounded-xl', className].join(' ')} />
}

export default function TexHub() {
```

**Raw class strings detected (best effort):**

- `skeleton rounded-xl`
- ` `

**Utility breakdown (grouped):**

- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:367`

```jsx
    <div className="neo-page relative min-h-screen overflow-x-hidden bg-[#F8FAFC] dark:bg-[#05050A]">
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
        <div
          className={[
```

**Raw class strings detected (best effort):**

- `neo-page relative min-h-screen overflow-x-hidden bg-[#F8FAFC] dark:bg-[#05050A]`
- `pointer-events-none absolute inset-0 -z-10 hidden dark:block`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-x-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#F8FAFC]` — Background color/surface.
- **Dark mode variants:**
  - `dark:bg-[#05050A]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:block` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `neo-page` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:368`

```jsx
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
        <div
          className={[
            'absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full blur-3xl',
```

**Raw class strings detected (best effort):**

- `pointer-events-none absolute inset-0 -z-10 hidden dark:block`
- `absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full blur-3xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-[520px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[720px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:block` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-top-40` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-translate-x-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `blur-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:370`

```jsx
          className={[
            'absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full blur-3xl',
            mode === 'professional' ? 'bg-emerald-500/10' : 'bg-fuchsia-500/10',
          ].join(' ')}
```

**Raw class strings detected (best effort):**

- `absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full blur-3xl`
- `professional`
- `bg-emerald-500/10`
- `bg-fuchsia-500/10`
- ` `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-[520px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[720px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/10` — Background color/surface.
  - `bg-fuchsia-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `-top-40` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-translate-x-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `blur-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:376`

```jsx
          className={[
            'absolute top-24 right-[-140px] h-[520px] w-[520px] rounded-full blur-3xl',
            mode === 'professional' ? 'bg-sky-500/10' : 'bg-violet-500/10',
          ].join(' ')}
```

**Raw class strings detected (best effort):**

- `absolute top-24 right-[-140px] h-[520px] w-[520px] rounded-full blur-3xl`
- `professional`
- `bg-sky-500/10`
- `bg-violet-500/10`
- ` `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-[-140px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-[520px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[520px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-sky-500/10` — Background color/surface.
  - `bg-violet-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `blur-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:382`

```jsx
          className={[
            'absolute bottom-[-220px] left-[-160px] h-[600px] w-[600px] rounded-full blur-3xl',
            mode === 'professional' ? 'bg-indigo-500/10' : 'bg-emerald-500/10',
          ].join(' ')}
```

**Raw class strings detected (best effort):**

- `absolute bottom-[-220px] left-[-160px] h-[600px] w-[600px] rounded-full blur-3xl`
- `professional`
- `bg-indigo-500/10`
- `bg-emerald-500/10`
- ` `

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-[-220px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-[-160px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-[600px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[600px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-500/10` — Background color/surface.
  - `bg-emerald-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `blur-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:388`

```jsx
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
```

**Raw class strings detected (best effort):**

- `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16`
- `grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center`
- `lg:col-span-6`
- `inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-16` — Vertical padding (top/bottom).
  - `gap-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[#1E293B]/80` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_12px_30px_rgba(15,23,42,0.07)]` — Drop shadow depth (elevation).
- **Responsive variants:**
  - `sm:px-6` — Variant prefix (responsive, dark, or interaction state).
  - `lg:px-8` — Variant prefix (responsive, dark, or interaction state).
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-6` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:389`

```jsx
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]" />
```

**Raw class strings detected (best effort):**

- `grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center`
- `lg:col-span-6`
- `inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]`
- `h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[#1E293B]/80` — Text color or text sizing.
  - `bg-emerald-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_12px_30px_rgba(15,23,42,0.07)]` — Drop shadow depth (elevation).
  - `shadow-[0_0_18px_rgba(16,185,129,0.6)]` — Drop shadow depth (elevation).
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-6` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:390`

```jsx
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]" />
              Clean Tech sourcing for garments & textiles
```

**Raw class strings detected (best effort):**

- `lg:col-span-6`
- `inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]`
- `h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[#1E293B]/80` — Text color or text sizing.
  - `bg-emerald-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_12px_30px_rgba(15,23,42,0.07)]` — Drop shadow depth (elevation).
  - `shadow-[0_0_18px_rgba(16,185,129,0.6)]` — Drop shadow depth (elevation).
- **Responsive variants:**
  - `lg:col-span-6` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:391`

```jsx
<div className="inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]" />
  Clean Tech sourcing for garments & textiles
</div>
```

**Raw class strings detected (best effort):**

- `inline-flex items-center gap-2 rounded-full bg-[#1E293B]/5 px-3 py-1 text-xs font-semibold text-[#1E293B]/80 shadow-[0_12px_30px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:text-slate-300 dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]`
- `h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[#1E293B]/80` — Text color or text sizing.
  - `bg-emerald-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_12px_30px_rgba(15,23,42,0.07)]` — Drop shadow depth (elevation).
  - `shadow-[0_0_18px_rgba(16,185,129,0.6)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:392`

```jsx
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]" />
              Clean Tech sourcing for garments & textiles
            </div>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl dark:text-white">
```

**Raw class strings detected (best effort):**

- `h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]`
- `mt-5 text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-4xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_0_18px_rgba(16,185,129,0.6)]` — Drop shadow depth (elevation).
- **Responsive variants:**
  - `sm:text-5xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:395`

```jsx
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl dark:text-white">
                <AnimatedHeroHeading text={heroHeadline} />
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `mt-5 text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl dark:text-white`
- `mt-5 max-w-xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-4xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[15px]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:text-5xl` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:398`

```jsx
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-400">
                {heroSubheadline}
              </p>
              <p className="mt-3 max-w-xl text-sm font-medium text-[#334155] dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `mt-5 max-w-xl text-[15px] leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-3 max-w-xl text-sm font-medium text-[#334155] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[15px]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:401`

```jsx
              <p className="mt-3 max-w-xl text-sm font-medium text-[#334155] dark:text-slate-300">
                {heroShortDescription}
              </p>
              {heroPresentation ? (
```

**Raw class strings detected (best effort):**

- `mt-3 max-w-xl text-sm font-medium text-[#334155] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:405`

```jsx
                <p className="mt-2 max-w-xl text-xs italic text-[#64748B] dark:text-slate-400">
                  {heroPresentation}
                </p>
              ) : null}
```

**Raw class strings detected (best effort):**

- `mt-2 max-w-xl text-xs italic text-[#64748B] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:410`

```jsx
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticLinkButton
                to="/signup"
                className="shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
```

**Raw class strings detected (best effort):**

- `mt-8 flex flex-wrap items-center gap-3`
- `/signup`
- `shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `shadow-none` — Drop shadow depth (elevation).
  - `rounded-2xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `/signup` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:413`

```jsx
                className="shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
              >
                Create Buyer Account
              </MagneticLinkButton>
```

**Raw class strings detected (best effort):**

- `shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `shadow-none` — Drop shadow depth (elevation).
  - `rounded-2xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:419`

```jsx
                className="px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-white/70 text-[#1E293B] font-semibold tracking-tight backdrop-blur-sm transition duration-300 ease-out hover:bg-white hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]"
              >
                Register Factory
              </MagneticLinkButton>
```

**Raw class strings detected (best effort):**

- `px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-white/70 text-[#1E293B] font-semibold tracking-tight backdrop-blur-sm transition duration-300 ease-out hover:bg-white hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
  - `backdrop-blur-sm` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `shadow-none` — Drop shadow depth (elevation).
  - `rounded-2xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:425`

```jsx
                className="px-4 py-2 shadow-none inline-flex items-center justify-center rounded-2xl bg-[#1E293B]/5 text-[#1E293B]/80 font-semibold transition duration-300 ease-out hover:bg-[#1E293B]/8 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
              >

              </MagneticLinkButton>
```

**Raw class strings detected (best effort):**

- `px-4 py-2 shadow-none inline-flex items-center justify-center rounded-2xl bg-[#1E293B]/5 text-[#1E293B]/80 font-semibold transition duration-300 ease-out hover:bg-[#1E293B]/8 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[#1E293B]/80` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `shadow-none` — Drop shadow depth (elevation).
  - `rounded-2xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[#1E293B]/8` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:431`

```jsx
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-[#475569] sm:grid-cols-4 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
                Structured Buyer Requests
```

**Raw class strings detected (best effort):**

- `mt-8 grid grid-cols-2 gap-3 text-sm text-[#475569] sm:grid-cols-4 dark:text-slate-400`
- `flex items-center gap-2`
- `h-2 w-2 rounded-full bg-emerald-500/90`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Responsive variants:**
  - `sm:grid-cols-4` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:432`

```jsx
<div className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
  Structured Buyer Requests
</div>
```

**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `h-2 w-2 rounded-full bg-emerald-500/90`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:433`

```jsx
                <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
                Structured Buyer Requests
              </div>
              <div className="flex items-center gap-2">
```

**Raw class strings detected (best effort):**

- `h-2 w-2 rounded-full bg-emerald-500/90`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:436`

```jsx
<div className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
  Verified Factories
</div>
```

**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `h-2 w-2 rounded-full bg-emerald-500/90`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:437`

```jsx
                <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
                Verified Factories
              </div>
              <div className="flex items-center gap-2">
```

**Raw class strings detected (best effort):**

- `h-2 w-2 rounded-full bg-emerald-500/90`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:440`

```jsx
<div className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
  Digital Contract Vault
</div>
```

**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `h-2 w-2 rounded-full bg-emerald-500/90`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:441`

```jsx
                <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
                Digital Contract Vault
              </div>
              <div className="flex items-center gap-2">
```

**Raw class strings detected (best effort):**

- `h-2 w-2 rounded-full bg-emerald-500/90`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:444`

```jsx
<div className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
  AI Guided Workflow
</div>
```

**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `h-2 w-2 rounded-full bg-emerald-500/90`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:445`

```jsx
                <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
                AI Guided Workflow
              </div>
            </div>
```

**Raw class strings detected (best effort):**

- `h-2 w-2 rounded-full bg-emerald-500/90`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:451`

```jsx
          <div className="lg:col-span-6">
            <Surface className="p-6">
              <div className="flex items-center justify-between">
                {loading ? (
```

**Raw class strings detected (best effort):**

- `lg:col-span-6`
- `p-6`
- `flex items-center justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
- **Responsive variants:**
  - `lg:col-span-6` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:452`

```jsx
            <Surface className="p-6">
              <div className="flex items-center justify-between">
                {loading ? (
                  <>
```

**Raw class strings detected (best effort):**

- `p-6`
- `flex items-center justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).

#### `src/pages/TexHub.jsx:453`

```jsx
              <div className="flex items-center justify-between">
                {loading ? (
                  <>
                    <SkeletonLine className="h-7 w-40 rounded-full" />
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between`
- `h-7 w-40 rounded-full`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-40` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:456`

```jsx
                    <SkeletonLine className="h-7 w-40 rounded-full" />
                    <SkeletonLine className="h-7 w-24 rounded-full" />
                  </>
                ) : (
```

**Raw class strings detected (best effort):**

- `h-7 w-40 rounded-full`
- `h-7 w-24 rounded-full`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-40` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:457`

```jsx
                    <SkeletonLine className="h-7 w-24 rounded-full" />
                  </>
                ) : (
                  <>
```

**Raw class strings detected (best effort):**

- `h-7 w-24 rounded-full`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/TexHub.jsx:461`

```jsx
                    <div className="h-7 w-40 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]" />
                    <div className="h-7 w-24 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]" />
                  </>
                )}
```

**Raw class strings detected (best effort):**

- `h-7 w-40 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]`
- `h-7 w-24 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-40` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:462`

```jsx
                    <div className="h-7 w-24 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]" />
                  </>
                )}
              </div>
```

**Raw class strings detected (best effort):**

- `h-7 w-24 rounded-full bg-[#1E293B]/5 dark:bg-white/[0.06]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:466`

```jsx
              <div className="mt-5 grid gap-3">
                {loading ? (
                  <>
                    <div className="rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
```

**Raw class strings detected (best effort):**

- `mt-5 grid gap-3`
- `rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Color / surface:**
  - `bg-white/80` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-[0_14px_35px_rgba(15,23,42,0.06)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:469`

```jsx
                    <div className="rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                      <SkeletonLine className="h-3 w-24" />
                      <SkeletonLine className="mt-3 h-4 w-64" />
                      <div className="mt-4 grid grid-cols-2 gap-2">
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]`
- `h-3 w-24`
- `mt-3 h-4 w-64`
- `mt-4 grid grid-cols-2 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-64` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/80` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-[0_14px_35px_rgba(15,23,42,0.06)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:470`

```jsx
                      <SkeletonLine className="h-3 w-24" />
                      <SkeletonLine className="mt-3 h-4 w-64" />
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <SkeletonLine className="h-8" />
```

**Raw class strings detected (best effort):**

- `h-3 w-24`
- `mt-3 h-4 w-64`
- `mt-4 grid grid-cols-2 gap-2`
- `h-8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-64` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:471`

```jsx
                      <SkeletonLine className="mt-3 h-4 w-64" />
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <SkeletonLine className="h-8" />
                        <SkeletonLine className="h-8" />
```

**Raw class strings detected (best effort):**

- `mt-3 h-4 w-64`
- `mt-4 grid grid-cols-2 gap-2`
- `h-8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-64` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:472`

```jsx
<div className="mt-4 grid grid-cols-2 gap-2">
  <SkeletonLine className="h-8" />
  <SkeletonLine className="h-8" />
</div>
```

**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-2 gap-2`
- `h-8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:473`

```jsx
                        <SkeletonLine className="h-8" />
                        <SkeletonLine className="h-8" />
                      </div>
                    </div>
```

**Raw class strings detected (best effort):**

- `h-8`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:474`

```jsx
                        <SkeletonLine className="h-8" />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]">
```

**Raw class strings detected (best effort):**

- `h-8`
- `rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
- **Color / surface:**
  - `bg-[#1E293B]/4` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:477`

```jsx
                    <div className="rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]">
                      <div className="flex items-center justify-between gap-3">
                        <SkeletonLine className="h-4 w-36" />
                        <SkeletonLine className="h-3 w-28" />
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]`
- `flex items-center justify-between gap-3`
- `h-4 w-36`
- `h-3 w-28`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-36` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/4` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:478`

```jsx
<div className="flex items-center justify-between gap-3">
  <SkeletonLine className="h-4 w-36" />
  <SkeletonLine className="h-3 w-28" />
</div>
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `h-4 w-36`
- `h-3 w-28`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-36` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:479`

```jsx
                        <SkeletonLine className="h-4 w-36" />
                        <SkeletonLine className="h-3 w-28" />
                      </div>
                      <div className="mt-3 grid gap-2">
```

**Raw class strings detected (best effort):**

- `h-4 w-36`
- `h-3 w-28`
- `mt-3 grid gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-36` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:480`

```jsx
                        <SkeletonLine className="h-3 w-28" />
                      </div>
                      <div className="mt-3 grid gap-2">
                        <SkeletonLine className="h-10" />
```

**Raw class strings detected (best effort):**

- `h-3 w-28`
- `mt-3 grid gap-2`
- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:482`

```jsx
                      <div className="mt-3 grid gap-2">
                        <SkeletonLine className="h-10" />
                        <SkeletonLine className="h-10" />
                        <SkeletonLine className="h-10" />
```

**Raw class strings detected (best effort):**

- `mt-3 grid gap-2`
- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:483`

```jsx
                        <SkeletonLine className="h-10" />
                        <SkeletonLine className="h-10" />
                        <SkeletonLine className="h-10" />
                      </div>
```

**Raw class strings detected (best effort):**

- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:484`

```jsx
                        <SkeletonLine className="h-10" />
                        <SkeletonLine className="h-10" />
                      </div>
                    </div>
```

**Raw class strings detected (best effort):**

- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:485`

```jsx
                        <SkeletonLine className="h-10" />
                      </div>
                    </div>
                  </>
```

**Raw class strings detected (best effort):**

- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:491`

```jsx
                    <div className="rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-emerald-700">{heroBuyerRequest.label}</p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]`
- `flex items-center justify-between gap-4`
- `min-w-0`
- `text-xs font-semibold text-emerald-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/80` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-[0_14px_35px_rgba(15,23,42,0.06)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:492`

```jsx
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-emerald-700">{heroBuyerRequest.label}</p>
                          <p className="mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white">{heroBuyerRequest.title}</p>
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-4`
- `min-w-0`
- `text-xs font-semibold text-emerald-700`
- `mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:493`

```jsx
<div className="min-w-0">
  <p className="text-xs font-semibold text-emerald-700">
    {heroBuyerRequest.label}
  </p>
  <p className="mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white">
    {heroBuyerRequest.title}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `min-w-0`
- `text-xs font-semibold text-emerald-700`
- `mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:494`

```jsx
                          <p className="text-xs font-semibold text-emerald-700">{heroBuyerRequest.label}</p>
                          <p className="mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white">{heroBuyerRequest.title}</p>
                        </div>
                        <VerifiedBadge label={heroBuyerRequest.badge} />
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-emerald-700`
- `mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:495`

```jsx
                          <p className="mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white">{heroBuyerRequest.title}</p>
                        </div>
                        <VerifiedBadge label={heroBuyerRequest.badge} />
                      </div>
```

**Raw class strings detected (best effort):**

- `mt-1 truncate text-sm font-semibold text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:499`

```jsx
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#475569] dark:text-slate-400">
                        {(heroBuyerRequest.fields || []).slice(0, 2).map((field) => (
                          <div
                            key={field.label}
```

**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:503`

```jsx
                            className="flex items-center justify-between rounded-xl bg-[#1E293B]/4 px-3 py-2 dark:bg-white/[0.03]"
                          >
                            <span>{field.label}</span>
                            <span className="font-semibold text-[#1E293B] dark:text-white">{field.value}</span>
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between rounded-xl bg-[#1E293B]/4 px-3 py-2 dark:bg-white/[0.03]`
- `font-semibold text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/4` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:506`

```jsx
                            <span className="font-semibold text-[#1E293B] dark:text-white">{field.value}</span>
                          </div>
                        ))}
                      </div>
```

**Raw class strings detected (best effort):**

- `font-semibold text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:511`

```jsx
                    <div className="rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{heroFactories.title}</p>
                        <p className="text-xs text-[#475569] dark:text-slate-400">{heroFactories.subtitle}</p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#1E293B]/4 p-4 dark:bg-white/[0.03]`
- `flex items-center justify-between gap-3`
- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `text-xs text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#1E293B]/4` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:512`

```jsx
<div className="flex items-center justify-between gap-3">
  <p className="text-sm font-semibold text-[#1E293B] dark:text-white">
    {heroFactories.title}
  </p>
  <p className="text-xs text-[#475569] dark:text-slate-400">
    {heroFactories.subtitle}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `text-xs text-[#475569] dark:text-slate-400`

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
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:513`

```jsx
                        <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{heroFactories.title}</p>
                        <p className="text-xs text-[#475569] dark:text-slate-400">{heroFactories.subtitle}</p>
                      </div>
                      <div className="mt-3 grid gap-2">
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `text-xs text-[#475569] dark:text-slate-400`
- `mt-3 grid gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:514`

```jsx
                        <p className="text-xs text-[#475569] dark:text-slate-400">{heroFactories.subtitle}</p>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {(heroFactories.factories || []).slice(0, 3).map((factory) => (
```

**Raw class strings detected (best effort):**

- `text-xs text-[#475569] dark:text-slate-400`
- `mt-3 grid gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:516`

```jsx
                      <div className="mt-3 grid gap-2">
                        {(heroFactories.factories || []).slice(0, 3).map((factory) => (
                          <div
                            key={factory.id || factory.name}
```

**Raw class strings detected (best effort):**

- `mt-3 grid gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:520`

```jsx
className =
  "flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 dark:bg-[#05050A]" >
  (
    <p className="text-sm font-semibold text-[#1E293B] dark:text-white">
      {factory.name}
    </p>
  );
{
  factory.verified ? <VerifiedBadge /> : <VerifiedBadge label="Review" />;
}
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 dark:bg-[#05050A]`
- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `Review`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/80` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-[#05050A]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Review` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:522`

```jsx
                            <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{factory.name}</p>
                            {factory.verified ? <VerifiedBadge /> : <VerifiedBadge label="Review" />}
                          </div>
                        ))}
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `Review`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Review` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:530`

```jsx
                {loadError ? <p className="text-xs text-amber-700 dark:text-amber-300">{loadError}</p> : null}
              </div>
            </Surface>
          </div>
```

**Raw class strings detected (best effort):**

- `text-xs text-amber-700 dark:text-amber-300`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-amber-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:536`

```jsx
        <div id="about" className="mt-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <Surface className="relative p-8">
              <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]" />
```

**Raw class strings detected (best effort):**

- `mt-16`
- `grid gap-6 lg:grid-cols-2`
- `relative p-8`
- `pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-8` — Padding (all sides).
- **Color / surface:**
  - `bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]` — Background color/surface.
- **Responsive variants:**
  - `lg:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:block` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-inset-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:537`

```jsx
          <div className="grid gap-6 lg:grid-cols-2">
            <Surface className="relative p-8">
              <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]" />
              <div className="relative z-10">
```

**Raw class strings detected (best effort):**

- `grid gap-6 lg:grid-cols-2`
- `relative p-8`
- `pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]`
- `relative z-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-8` — Padding (all sides).
- **Color / surface:**
  - `bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]` — Background color/surface.
- **Responsive variants:**
  - `lg:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:block` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-inset-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:538`

```jsx
            <Surface className="relative p-8">
              <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Why GarTexHub</h3>
```

**Raw class strings detected (best effort):**

- `relative p-8`
- `pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]`
- `relative z-10`
- `text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-8` — Padding (all sides).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[-0.02em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:block` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-inset-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:539`

```jsx
              <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Why GarTexHub</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]`
- `relative z-10`
- `text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[-0.02em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent_70%)]` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:block` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-inset-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:540`

```jsx
              <div className="relative z-10">
                <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Why GarTexHub</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  A sourcing workflow network built only for garments and textiles: low noise, structured requests, and trust by design.
```

**Raw class strings detected (best effort):**

- `relative z-10`
- `text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[-0.02em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:541`

```jsx
                <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Why GarTexHub</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  A sourcing workflow network built only for garments and textiles: low noise, structured requests, and trust by design.
                </p>
```

**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[-0.02em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:542`

```jsx
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  A sourcing workflow network built only for garments and textiles: low noise, structured requests, and trust by design.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:545`

```jsx
                <ul className="mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300">
                  {(heroValueProps || []).slice(0, 4).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
```

**Raw class strings detected (best effort):**

- `mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:552`

```jsx
            <Surface className="relative p-8">
              <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent_70%)]" />
              <div className="relative z-10">
              <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Solution</h3>
```

**Raw class strings detected (best effort):**

- `relative p-8`
- `pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent_70%)]`
- `relative z-10`
- `text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-8` — Padding (all sides).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[-0.02em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent_70%)]` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:block` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-inset-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:553`

```jsx
              <div className="pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent_70%)]" />
              <div className="relative z-10">
              <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Solution</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `pointer-events-none absolute -inset-28 hidden dark:block bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent_70%)]`
- `relative z-10`
- `text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[-0.02em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent_70%)]` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:block` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-inset-28` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:554`

```jsx
              <div className="relative z-10">
              <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Solution</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Clear surfaces, verified signals, and structured workflows -- designed to stay calm at scale.
```

**Raw class strings detected (best effort):**

- `relative z-10`
- `text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[-0.02em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:555`

```jsx
              <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Solution</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Clear surfaces, verified signals, and structured workflows -- designed to stay calm at scale.
              </p>
```

**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[-0.02em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:556`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Clear surfaces, verified signals, and structured workflows -- designed to stay calm at scale.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:559`

```jsx
              <ul className="mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300">
                <li>Structured Buyer Requests</li>
                <li>Verified supplier priority</li>
                <li>Internal Agent Lock System</li>
```

**Raw class strings detected (best effort):**

- `mt-5 space-y-2 text-sm text-[#334155] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:570`

```jsx
        <div id="how-it-works" className="mt-16">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">How GarTexHub works</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">A simple flow that stays structured end-to-end.</p>
```

**Raw class strings detected (best effort):**

- `mt-16`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:572`

```jsx
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">How GarTexHub works</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">A simple flow that stays structured end-to-end.</p>
          </div>

```

**Raw class strings detected (best effort):**

- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:573`

```jsx
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">A simple flow that stays structured end-to-end.</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-6 grid gap-6 md:grid-cols-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `md:grid-cols-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:576`

```jsx
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Surface className="p-6">
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 1</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Post or search</h4>
```

**Raw class strings detected (best effort):**

- `mt-6 grid gap-6 md:grid-cols-3`
- `p-6`
- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-6` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
- **Responsive variants:**
  - `md:grid-cols-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:577`

```jsx
            <Surface className="p-6">
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 1</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Post or search</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `p-6`
- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:578`

```jsx
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 1</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Post or search</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Buyers post structured requirements. Factories publish products and capacity.
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:579`

```jsx
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Post or search</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Buyers post structured requirements. Factories publish products and capacity.
              </p>
```

**Raw class strings detected (best effort):**

- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:580`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Buyers post structured requirements. Factories publish products and capacity.
              </p>
            </Surface>
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:584`

```jsx
            <Surface className="p-6">
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 2</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Smart matching + claim lead</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `p-6`
- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:585`

```jsx
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 2</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Smart matching + claim lead</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Agents claim requests. AI summarizes context so the team moves fast without noise.
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:586`

```jsx
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Smart matching + claim lead</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Agents claim requests. AI summarizes context so the team moves fast without noise.
              </p>
```

**Raw class strings detected (best effort):**

- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:587`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Agents claim requests. AI summarizes context so the team moves fast without noise.
              </p>
            </Surface>
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:591`

```jsx
            <Surface className="p-6">
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 3</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Chat, call, contract</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `p-6`
- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-6` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:592`

```jsx
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 3</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Chat, call, contract</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Communicate, schedule meetings, and store agreements inside the Contract Vault.
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:593`

```jsx
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Chat, call, contract</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Communicate, schedule meetings, and store agreements inside the Contract Vault.
              </p>
```

**Raw class strings detected (best effort):**

- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:594`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Communicate, schedule meetings, and store agreements inside the Contract Vault.
              </p>
            </Surface>
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:602`

```jsx
          <div className="mt-16">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Why GarTexHub</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `mt-16`
- `flex flex-col items-center text-center`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:603`

```jsx
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Why GarTexHub</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Clear positioning and a structured sourcing workflow -- built only for garments & textile.
```

**Raw class strings detected (best effort):**

- `flex flex-col items-center text-center`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:604`

```jsx
              <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Why GarTexHub</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Clear positioning and a structured sourcing workflow -- built only for garments & textile.
              </p>
```

**Raw class strings detected (best effort):**

- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:605`

```jsx
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Clear positioning and a structured sourcing workflow -- built only for garments & textile.
              </p>
            </div>
```

**Raw class strings detected (best effort):**

- `mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:610`

```jsx
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 dark:gap-px">
              {marketingSections.map((section, idx) => (
                <BentoMotion key={section.id || section.title || String(idx)} index={idx} className="md:col-span-1">
                  <Surface className="p-7">
```

**Raw class strings detected (best effort):**

- `mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 dark:gap-px`
- `md:col-span-1`
- `p-7`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-7` — Padding (all sides).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
  - `md:col-span-1` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:gap-px` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:612`

```jsx
                <BentoMotion key={section.id || section.title || String(idx)} index={idx} className="md:col-span-1">
                  <Surface className="p-7">
                    {section.eyebrow ? (
                      <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{section.eyebrow}</p>
```

**Raw class strings detected (best effort):**

- `md:col-span-1`
- `p-7`
- `text-xs font-semibold text-[#64748B] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-1` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:613`

```jsx
                  <Surface className="p-7">
                    {section.eyebrow ? (
                      <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{section.eyebrow}</p>
                    ) : null}
```

**Raw class strings detected (best effort):**

- `p-7`
- `text-xs font-semibold text-[#64748B] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:615`

```jsx
                      <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{section.eyebrow}</p>
                    ) : null}
                    <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{section.title}</h4>
                    {section.description ? (
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:617`

```jsx
<h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">
  {section.title}
</h4>;
{
  section.description ? (
    <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
      {section.description}
    </p>
  ) : null;
}
```

**Raw class strings detected (best effort):**

- `mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:619`

```jsx
                      <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">{section.description}</p>
                    ) : null}
                    {Array.isArray(section.bullets) && section.bullets.length ? (
                      <ul className="mt-4 space-y-2 text-sm text-[#334155] dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-4 space-y-2 text-sm text-[#334155] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:622`

```jsx
                      <ul className="mt-4 space-y-2 text-sm text-[#334155] dark:text-slate-300">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/90" />
```

**Raw class strings detected (best effort):**

- `mt-4 space-y-2 text-sm text-[#334155] dark:text-slate-300`
- `flex items-start gap-2`
- `mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/90`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#334155]` — Text color or text sizing.
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:624`

```jsx
<li key={bullet} className="flex items-start gap-2">
  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/90" />
  <span className="leading-relaxed">{bullet}</span>
</li>
```

**Raw class strings detected (best effort):**

- `flex items-start gap-2`
- `mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/90`
- `leading-relaxed`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:625`

```jsx
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/90" />
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
```

**Raw class strings detected (best effort):**

- `mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/90`
- `leading-relaxed`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-500/90` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `shrink-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:626`

```jsx
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
```

**Raw class strings detected (best effort):**

- `leading-relaxed`

**Utility breakdown (grouped):**

- **Typography:**
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:638`

```jsx
        <div className="mt-16">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Platform features</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `mt-16`
- `flex flex-col items-center text-center`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:639`

```jsx
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Platform features</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
              Borderless surfaces, clean hierarchy, and strong trust indicators.
```

**Raw class strings detected (best effort):**

- `flex flex-col items-center text-center`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:640`

```jsx
            <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Platform features</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
              Borderless surfaces, clean hierarchy, and strong trust indicators.
            </p>
```

**Raw class strings detected (best effort):**

- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:641`

```jsx
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
              Borderless surfaces, clean hierarchy, and strong trust indicators.
            </p>
          </div>
```

**Raw class strings detected (best effort):**

- `mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:647`

```jsx
            className={[
              'mt-8 rounded-3xl bg-transparent p-0 dark:p-[2px] transition-colors duration-[400ms]',
              mode === 'professional' ? 'dark:bg-[#05050A]' : 'dark:bg-[#0B0A18]',
            ].join(' ')}
```

**Raw class strings detected (best effort):**

- `mt-8 rounded-3xl bg-transparent p-0 dark:p-[2px] transition-colors duration-[400ms]`
- `professional`
- `dark:bg-[#05050A]`
- `dark:bg-[#0B0A18]`
- ` `

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-0` — Padding (all sides).
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-[400ms]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:p-[2px]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[#05050A]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[#0B0A18]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:652`

```jsx
          <div className="grid grid-cols-1 gap-6 md:grid-cols-6 dark:gap-px">
            <BentoMotion index={0} className="md:col-span-3">
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.professionalFeed.title}</h4>
```

**Raw class strings detected (best effort):**

- `grid grid-cols-1 gap-6 md:grid-cols-6 dark:gap-px`
- `md:col-span-3`
- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-7` — Padding (all sides).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Responsive variants:**
  - `md:grid-cols-6` — Variant prefix (responsive, dark, or interaction state).
  - `md:col-span-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:gap-px` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:653`

```jsx
            <BentoMotion index={0} className="md:col-span-3">
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.professionalFeed.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `md:col-span-3`
- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:654`

```jsx
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.professionalFeed.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.professionalFeed.description}
```

**Raw class strings detected (best effort):**

- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:655`

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.professionalFeed.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.professionalFeed.description}
              </p>
```

**Raw class strings detected (best effort):**

- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:656`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.professionalFeed.description}
              </p>
              <div className="mt-5 grid gap-2">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-5 grid gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:659`

```jsx
              <div className="mt-5 grid gap-2">
                {loading ? (
                  <>
                    <SkeletonLine className="h-10" />
```

**Raw class strings detected (best effort):**

- `mt-5 grid gap-2`
- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:662`

```jsx
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                  </>
```

**Raw class strings detected (best effort):**

- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:663`

```jsx
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                  </>
                ) : (
```

**Raw class strings detected (best effort):**

- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:664`

```jsx
                    <SkeletonLine className="h-10" />
                  </>
                ) : (
                  <AnimatePresence mode="popLayout" initial={false}>
```

**Raw class strings detected (best effort):**

- `h-10`
- `popLayout`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `popLayout` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:674`

```jsx
                      className="grid gap-2"
                    >
                      {(bentoView.professionalFeed.lanes || []).map((lane) => (
                        <div
```

**Raw class strings detected (best effort):**

- `grid gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:679`

```jsx
                          className="flex items-center justify-between rounded-2xl bg-slate-900/4 px-4 py-3 dark:bg-white/[0.03]"
                        >
                          <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{lane.label}</p>
                          <span className="rounded-full bg-[#1E293B]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] dark:bg-white/[0.06] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between rounded-2xl bg-slate-900/4 px-4 py-3 dark:bg-white/[0.03]`
- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `rounded-full bg-[#1E293B]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] dark:bg-white/[0.06] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.1em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#64748B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:681`

```jsx
                          <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{lane.label}</p>
                          <span className="rounded-full bg-[#1E293B]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] dark:bg-white/[0.06] dark:text-slate-400">
                            {lane.meta}
                          </span>
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `rounded-full bg-[#1E293B]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] dark:bg-white/[0.06] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.1em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#64748B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:682`

```jsx
                          <span className="rounded-full bg-[#1E293B]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] dark:bg-white/[0.06] dark:text-slate-400">
                            {lane.meta}
                          </span>
                        </div>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-[#1E293B]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B] dark:bg-white/[0.06] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-[0.1em]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `text-[#64748B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:694`

```jsx
            <BentoMotion index={1} className="md:col-span-3">
            <Surface className="p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
```

**Raw class strings detected (best effort):**

- `md:col-span-3`
- `p-7`
- `flex items-center justify-between gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-7` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:col-span-3` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:695`

```jsx
            <Surface className="p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.structuredBuyerRequests.title}</h4>
```

**Raw class strings detected (best effort):**

- `p-7`
- `flex items-center justify-between gap-4`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-7` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:696`

```jsx
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.structuredBuyerRequests.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-4`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:698`

```jsx
                  <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.structuredBuyerRequests.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                    {bentoView.structuredBuyerRequests.description}
                  </p>
```

**Raw class strings detected (best effort):**

- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:699`

```jsx
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                    {bentoView.structuredBuyerRequests.description}
                  </p>
                </div>
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:706`

```jsx
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {loading ? (
                  <>
                    <SkeletonLine className="h-10" />
```

**Raw class strings detected (best effort):**

- `mt-5 grid gap-3 sm:grid-cols-2`
- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:709`

```jsx
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
```

**Raw class strings detected (best effort):**

- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:710`

```jsx
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                  </>
```

**Raw class strings detected (best effort):**

- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:711`

```jsx
                    <SkeletonLine className="h-10" />
                    <SkeletonLine className="h-10" />
                  </>
                ) : (
```

**Raw class strings detected (best effort):**

- `h-10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:712`

```jsx
                    <SkeletonLine className="h-10" />
                  </>
                ) : (
                  <AnimatePresence mode="popLayout" initial={false}>
```

**Raw class strings detected (best effort):**

- `h-10`
- `popLayout`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `popLayout` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:722`

```jsx
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      {(bentoView.structuredBuyerRequests.fields || []).map((field) => (
                        <div
```

**Raw class strings detected (best effort):**

- `grid gap-3 sm:grid-cols-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:727`

```jsx
                          className="flex items-center justify-between rounded-2xl bg-slate-900/4 px-4 py-3 text-sm dark:bg-white/[0.03]"
                        >
                          <span className="text-[#64748B] dark:text-slate-400">{field.label}</span>
                          <span className="font-semibold text-[#1E293B] dark:text-white">{field.value}</span>
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between rounded-2xl bg-slate-900/4 px-4 py-3 text-sm dark:bg-white/[0.03]`
- `text-[#64748B] dark:text-slate-400`
- `font-semibold text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:729`

```jsx
                          <span className="text-[#64748B] dark:text-slate-400">{field.label}</span>
                          <span className="font-semibold text-[#1E293B] dark:text-white">{field.value}</span>
                        </div>
                      ))}
```

**Raw class strings detected (best effort):**

- `text-[#64748B] dark:text-slate-400`
- `font-semibold text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:730`

```jsx
                          <span className="font-semibold text-[#1E293B] dark:text-white">{field.value}</span>
                        </div>
                      ))}
                    </motion.div>
```

**Raw class strings detected (best effort):**

- `font-semibold text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:740`

```jsx
            <BentoMotion index={2} className="md:col-span-2">
            <GlassSurface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.contractVault.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80">{bentoView.contractVault.description}</p>
```

**Raw class strings detected (best effort):**

- `md:col-span-2`
- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white/80` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:741`

```jsx
            <GlassSurface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.contractVault.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80">{bentoView.contractVault.description}</p>
              <div className="mt-5 space-y-2">
```

**Raw class strings detected (best effort):**

- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80`
- `mt-5 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white/80` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:742`

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.contractVault.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80">{bentoView.contractVault.description}</p>
              <div className="mt-5 space-y-2">
                {(bentoView.contractVault.items || []).map((item) => (
```

**Raw class strings detected (best effort):**

- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80`
- `mt-5 space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white/80` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:743`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80">{bentoView.contractVault.description}</p>
              <div className="mt-5 space-y-2">
                {(bentoView.contractVault.items || []).map((item) => (
                  <div key={item} className="rounded-2xl bg-[#1E293B]/5 px-4 py-3 text-sm text-[#1E293B] dark:bg-white/12 dark:text-white">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-white/80`
- `mt-5 space-y-2`
- `rounded-2xl bg-[#1E293B]/5 px-4 py-3 text-sm text-[#1E293B] dark:bg-white/12 dark:text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-white/80` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:744`

```jsx
              <div className="mt-5 space-y-2">
                {(bentoView.contractVault.items || []).map((item) => (
                  <div key={item} className="rounded-2xl bg-[#1E293B]/5 px-4 py-3 text-sm text-[#1E293B] dark:bg-white/12 dark:text-white">
                    {item}
```

**Raw class strings detected (best effort):**

- `mt-5 space-y-2`
- `rounded-2xl bg-[#1E293B]/5 px-4 py-3 text-sm text-[#1E293B] dark:bg-white/12 dark:text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:746`

```jsx
                  <div key={item} className="rounded-2xl bg-[#1E293B]/5 px-4 py-3 text-sm text-[#1E293B] dark:bg-white/12 dark:text-white">
                    {item}
                  </div>
                ))}
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#1E293B]/5 px-4 py-3 text-sm text-[#1E293B] dark:bg-white/12 dark:text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#1E293B]/5` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/12` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:751`

```jsx
              <div className="mt-5 inline-flex">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_16px_40px_rgba(16,185,129,0.12)] dark:bg-emerald-400/18 dark:text-emerald-200 dark:shadow-[0_0_26px_rgba(16,185,129,0.24)]">
                  {bentoView.contractVault.badge}
                </span>
```

**Raw class strings detected (best effort):**

- `mt-5 inline-flex`
- `rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_16px_40px_rgba(16,185,129,0.12)] dark:bg-emerald-400/18 dark:text-emerald-200 dark:shadow-[0_0_26px_rgba(16,185,129,0.24)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_16px_40px_rgba(16,185,129,0.12)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-emerald-400/18` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_0_26px_rgba(16,185,129,0.24)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:752`

```jsx
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_16px_40px_rgba(16,185,129,0.12)] dark:bg-emerald-400/18 dark:text-emerald-200 dark:shadow-[0_0_26px_rgba(16,185,129,0.24)]">
                  {bentoView.contractVault.badge}
                </span>
              </div>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_16px_40px_rgba(16,185,129,0.12)] dark:bg-emerald-400/18 dark:text-emerald-200 dark:shadow-[0_0_26px_rgba(16,185,129,0.24)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_16px_40px_rgba(16,185,129,0.12)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-emerald-400/18` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_0_26px_rgba(16,185,129,0.24)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:759`

```jsx
            <BentoMotion index={3} className="md:col-span-4">
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.enterpriseAnalytics.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `md:col-span-4`
- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-4` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:760`

```jsx
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.enterpriseAnalytics.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.enterpriseAnalytics.description}
```

**Raw class strings detected (best effort):**

- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:761`

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.enterpriseAnalytics.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.enterpriseAnalytics.description}
              </p>
```

**Raw class strings detected (best effort):**

- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:762`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.enterpriseAnalytics.description}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-5 grid gap-3 sm:grid-cols-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:765`

```jsx
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {(bentoView.enterpriseAnalytics.stats || []).map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-slate-900/4 p-4 dark:bg-white/[0.03]">
                    <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{stat.label}</p>
```

**Raw class strings detected (best effort):**

- `mt-5 grid gap-3 sm:grid-cols-3`
- `rounded-2xl bg-slate-900/4 p-4 dark:bg-white/[0.03]`
- `text-xs font-semibold text-[#64748B] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[#64748B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Responsive variants:**
  - `sm:grid-cols-3` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:767`

```jsx
<div
  key={stat.label}
  className="rounded-2xl bg-slate-900/4 p-4 dark:bg-white/[0.03]"
>
  <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">
    {stat.label}
  </p>
  <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">
    {stat.value}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-slate-900/4 p-4 dark:bg-white/[0.03]`
- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/4` — Background color/surface.
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:768`

```jsx
                    <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">{stat.value}</p>
                  </div>
                ))}
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-[#64748B] dark:text-slate-400`
- `mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#64748B]` — Text color or text sizing.
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:769`

```jsx
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
```

**Raw class strings detected (best effort):**

- `mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:776`

```jsx
            <BentoMotion index={4} className="md:col-span-4">
            <Surface className="p-7 bg-slate-900/3">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.agentLock.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `md:col-span-4`
- `p-7 bg-slate-900/3`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/3` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-4` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:777`

```jsx
            <Surface className="p-7 bg-slate-900/3">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.agentLock.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.agentLock.description}
```

**Raw class strings detected (best effort):**

- `p-7 bg-slate-900/3`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/3` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:778`

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">{bentoView.agentLock.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.agentLock.description}
              </p>
```

**Raw class strings detected (best effort):**

- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:779`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                {bentoView.agentLock.description}
              </p>
              <div className="mt-5 rounded-2xl bg-white/70 p-4 dark:bg-white/[0.03]">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-5 rounded-2xl bg-white/70 p-4 dark:bg-white/[0.03]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `bg-white/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:782`

```jsx
              <div className="mt-5 rounded-2xl bg-white/70 p-4 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{bentoView.agentLock.requestLabel}</p>
                  <span className="rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `mt-5 rounded-2xl bg-white/70 p-4 dark:bg-white/[0.03]`
- `flex items-center justify-between gap-3`
- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
  - `bg-slate-900/6` — Background color/surface.
  - `text-[#334155]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:783`

```jsx
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{bentoView.agentLock.requestLabel}</p>
                  <span className="rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300">
                    {bentoView.agentLock.status}
```

**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-3`
- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `bg-slate-900/6` — Background color/surface.
  - `text-[#334155]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:784`

```jsx
                  <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{bentoView.agentLock.requestLabel}</p>
                  <span className="rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300">
                    {bentoView.agentLock.status}
                  </span>
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `bg-slate-900/6` — Background color/surface.
  - `text-[#334155]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:785`

```jsx
                  <span className="rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300">
                    {bentoView.agentLock.status}
                  </span>
                </div>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-[#334155] dark:bg-white/[0.06] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-900/6` — Background color/surface.
  - `text-[#334155]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:789`

```jsx
                <p className="mt-2 text-xs leading-relaxed text-[#475569] dark:text-slate-400">
                  {bentoView.agentLock.note}
                </p>
              </div>
```

**Raw class strings detected (best effort):**

- `mt-2 text-xs leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:796`

```jsx
            <BentoMotion index={5} className="md:col-span-2">
            <Surface
              className={[
                'p-7 transition-colors duration-[400ms]',
```

**Raw class strings detected (best effort):**

- `md:col-span-2`
- `p-7 transition-colors duration-[400ms]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-[400ms]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:798`

```jsx
              className={[
                'p-7 transition-colors duration-[400ms]',
                mode === 'professional' ? '' : 'dark:bg-[#0E0D1A]',
              ].join(' ')}
```

**Raw class strings detected (best effort):**

- `p-7 transition-colors duration-[400ms]`
- `professional`
- `:`
- ` `

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-[400ms]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `:` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:803`

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Unique toggle</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                A tactile switch for diverse content modes -- recessed track, raised handle.
              </p>
```

**Raw class strings detected (best effort):**

- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:804`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                A tactile switch for diverse content modes -- recessed track, raised handle.
              </p>
              <div className="mt-5 inline-flex items-center gap-3">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-5 inline-flex items-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:807`

```jsx
              <div className="mt-5 inline-flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMode((current) => (current === 'professional' ? 'diverse' : 'professional'))}
```

**Raw class strings detected (best effort):**

- `mt-5 inline-flex items-center gap-3`
- `button`
- `professional`
- `diverse`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `diverse` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:811`

```jsx
                  className={[
                    'relative h-10 w-20 rounded-full p-1 flex items-center transition-colors duration-[400ms]',
                    mode === 'professional' ? 'justify-start bg-[#1E293B]/10' : 'justify-end bg-[#312E81]/12',
                    'shadow-[inset_0_2px_6px_rgba(15,23,42,0.18)]',
```

**Raw class strings detected (best effort):**

- `relative h-10 w-20 rounded-full p-1 flex items-center transition-colors duration-[400ms]`
- `professional`
- `justify-start bg-[#1E293B]/10`
- `justify-end bg-[#312E81]/12`
- `shadow-[inset_0_2px_6px_rgba(15,23,42,0.18)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-end` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-1` — Padding (all sides).
- **Color / surface:**
  - `bg-[#1E293B]/10` — Background color/surface.
  - `bg-[#312E81]/12` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[inset_0_2px_6px_rgba(15,23,42,0.18)]` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-[400ms]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:823`

```jsx
                    className="h-8 w-8 rounded-full bg-white shadow-[0_10px_22px_rgba(15,23,42,0.20)] dark:bg-white/90 dark:shadow-[0_14px_40px_rgba(0,0,0,0.65)]"
                  />
                </button>
                <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `h-8 w-8 rounded-full bg-white shadow-[0_10px_22px_rgba(15,23,42,0.20)] dark:bg-white/90 dark:shadow-[0_14px_40px_rgba(0,0,0,0.65)]`
- `text-sm font-semibold text-[#334155] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[#334155]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_10px_22px_rgba(15,23,42,0.20)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/90` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_14px_40px_rgba(0,0,0,0.65)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:826`

```jsx
                <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
                  {mode === 'professional' ? 'Professional' : 'Diverse'}
                </span>
              </div>
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-[#334155] dark:text-slate-300`
- `professional`
- `Professional`
- `Diverse`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Professional` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Diverse` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:833`

```jsx
            <BentoMotion index={6} className="md:col-span-2">
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Factory video gallery</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `md:col-span-2`
- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:834`

```jsx
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Factory video gallery</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Edge-to-edge thumbnails for an immersive profile experience.
```

**Raw class strings detected (best effort):**

- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:835`

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Factory video gallery</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Edge-to-edge thumbnails for an immersive profile experience.
              </p>
```

**Raw class strings detected (best effort):**

- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:836`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Edge-to-edge thumbnails for an immersive profile experience.
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-5 overflow-hidden rounded-2xl`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:839`

```jsx
              <div className="mt-5 overflow-hidden rounded-2xl">
                <div className="grid grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
```

**Raw class strings detected (best effort):**

- `mt-5 overflow-hidden rounded-2xl`
- `grid grid-cols-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-3` — Grid layout.
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.

#### `src/pages/TexHub.jsx:840`

```jsx
                <div className="grid grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
```

**Raw class strings detected (best effort):**

- `grid grid-cols-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-3` — Grid layout.

#### `src/pages/TexHub.jsx:844`

```jsx
                      className={[
                        'aspect-video',
                        loading ? 'skeleton' : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-900 dark:to-slate-800',
                        !loading && i % 3 === 1 ? 'from-slate-100 to-slate-300 dark:from-slate-950 dark:to-slate-800' : '',
```

**Raw class strings detected (best effort):**

- `aspect-video`
- `skeleton`
- `bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-900 dark:to-slate-800`
- `from-slate-100 to-slate-300 dark:from-slate-950 dark:to-slate-800`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `aspect-video` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-slate-200` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-slate-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `from-slate-100` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:from-slate-900` — Variant prefix (responsive, dark, or interaction state).
  - `dark:to-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:from-slate-950` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `skeleton` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:856`

```jsx
            <BentoMotion index={7} className="md:col-span-4">
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">AI assistant</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `md:col-span-4`
- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-4` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:857`

```jsx
            <Surface className="p-7">
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">AI assistant</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                A floating assistant that feels premium -- glassy, calm, and helpful.
```

**Raw class strings detected (best effort):**

- `p-7`
- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-7` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:858`

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">AI assistant</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                A floating assistant that feels premium -- glassy, calm, and helpful.
              </p>
```

**Raw class strings detected (best effort):**

- `text-base font-bold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:859`

```jsx
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                A floating assistant that feels premium -- glassy, calm, and helpful.
              </p>
              <div className="mt-5 rounded-2xl bg-white/55 backdrop-blur-md p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/50 dark:bg-white/[0.03] dark:ring-white/10">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-5 rounded-2xl bg-white/55 backdrop-blur-md p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/50 dark:bg-white/[0.03] dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `bg-white/55` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-[0_18px_50px_rgba(15,23,42,0.10)]` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/50` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:862`

```jsx
<div className="mt-5 rounded-2xl bg-white/55 backdrop-blur-md p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/50 dark:bg-white/[0.03] dark:ring-white/10">
  <p className="text-sm font-semibold text-[#1E293B] dark:text-white">
    “Need help posting a request*”
  </p>
  <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400">
    I can generate a structured template in seconds.
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `mt-5 rounded-2xl bg-white/55 backdrop-blur-md p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/50 dark:bg-white/[0.03] dark:ring-white/10`
- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/55` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-[0_18px_50px_rgba(15,23,42,0.10)]` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/50` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:863`

```jsx
                <p className="text-sm font-semibold text-[#1E293B] dark:text-white">“Need help posting a request*”</p>
                <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400">I can generate a structured template in seconds.</p>
              </div>
            </Surface>
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-[#1E293B] dark:text-white`
- `mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:864`

```jsx
                <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400">I can generate a structured template in seconds.</p>
              </div>
            </Surface>
            </BentoMotion>
```

**Raw class strings detected (best effort):**

- `mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:872`

```jsx
        <div className="mt-16">
          <Surface className="p-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
```

**Raw class strings detected (best effort):**

- `mt-16`
- `p-10`
- `grid gap-10 lg:grid-cols-12 lg:items-center`
- `lg:col-span-7`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-10` — Padding (all sides).
  - `gap-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:873`

```jsx
          <Surface className="p-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Built for growing buying houses</h3>
```

**Raw class strings detected (best effort):**

- `p-10`
- `grid gap-10 lg:grid-cols-12 lg:items-center`
- `lg:col-span-7`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `p-10` — Padding (all sides).
  - `gap-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:874`

```jsx
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Built for growing buying houses</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `grid gap-10 lg:grid-cols-12 lg:items-center`
- `lg:col-span-7`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:875`

```jsx
              <div className="lg:col-span-7">
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Built for growing buying houses</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Unlimited sub-accounts · dedicated analytics · organization control · contract management
```

**Raw class strings detected (best effort):**

- `lg:col-span-7`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:876`

```jsx
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Built for growing buying houses</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Unlimited sub-accounts · dedicated analytics · organization control · contract management
                </p>
```

**Raw class strings detected (best effort):**

- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:877`

```jsx
                <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Unlimited sub-accounts · dedicated analytics · organization control · contract management
                </p>
              </div>
```

**Raw class strings detected (best effort):**

- `mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:881`

```jsx
              <div className="lg:col-span-5 lg:flex lg:justify-end">
                <MagneticLinkButton
                  to="/pricing"
                  className="px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-emerald-500 hover:shadow-[0_22px_50px_rgba(16,185,129,0.28)] dark:bg-emerald-500/80 dark:hover:bg-emerald-500/90 dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
```

**Raw class strings detected (best effort):**

- `lg:col-span-5 lg:flex lg:justify-end`
- `/pricing`
- `px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-emerald-500 hover:shadow-[0_22px_50px_rgba(16,185,129,0.28)] dark:bg-emerald-500/80 dark:hover:bg-emerald-500/90 dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `shadow-none` — Drop shadow depth (elevation).
  - `rounded-2xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-emerald-500` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-[0_22px_50px_rgba(16,185,129,0.28)]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `lg:col-span-5` — Variant prefix (responsive, dark, or interaction state).
  - `lg:flex` — Variant prefix (responsive, dark, or interaction state).
  - `lg:justify-end` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-emerald-500/80` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-emerald-500/90` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `/pricing` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:884`

```jsx
                  className="px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-emerald-500 hover:shadow-[0_22px_50px_rgba(16,185,129,0.28)] dark:bg-emerald-500/80 dark:hover:bg-emerald-500/90 dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
                >
                  View enterprise plans
                </MagneticLinkButton>
```

**Raw class strings detected (best effort):**

- `px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-emerald-500 hover:shadow-[0_22px_50px_rgba(16,185,129,0.28)] dark:bg-emerald-500/80 dark:hover:bg-emerald-500/90 dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-emerald-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `shadow-none` — Drop shadow depth (elevation).
  - `rounded-2xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-emerald-500` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-[0_22px_50px_rgba(16,185,129,0.28)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-emerald-500/80` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-emerald-500/90` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:893`

```jsx
        <div className="mt-16">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Focused only on garments & textile</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">Industry categories:</p>
```

**Raw class strings detected (best effort):**

- `mt-16`
- `flex flex-col items-center text-center`
- `text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:894`

```jsx
<div className="flex flex-col items-center text-center">
  <h3 className="text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">
    Focused only on garments & textile
  </h3>
  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
    Industry categories:
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `flex flex-col items-center text-center`
- `text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:895`

```jsx
            <h3 className="text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Focused only on garments & textile</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">Industry categories:</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300">
```

**Raw class strings detected (best effort):**

- `text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:896`

```jsx
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">Industry categories:</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300">
            {['Shirts', 'Pants', 'Knitwear', 'Woven', 'Denim', 'Custom production'].map((tag) => (
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`
- `mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300`
- `Shirts`
- `Pants`
- `Knitwear`
- `Woven`
- `Denim`
- `Custom production`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Shirts` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Pants` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Knitwear` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Woven` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Denim` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Custom` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `production` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:898`

```jsx
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300">
            {['Shirts', 'Pants', 'Knitwear', 'Woven', 'Denim', 'Custom production'].map((tag) => (
              <span
                key={tag}
```

**Raw class strings detected (best effort):**

- `mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300`
- `Shirts`
- `Pants`
- `Knitwear`
- `Woven`
- `Denim`
- `Custom production`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `text-[#334155]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Shirts` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Pants` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Knitwear` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Woven` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Denim` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Custom` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `production` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:902`

```jsx
                className="rounded-full bg-white/70 px-4 py-2 shadow-[0_14px_38px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
              >
                {tag}
              </span>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-white/70 px-4 py-2 shadow-[0_14px_38px_rgba(15,23,42,0.07)] dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-[0_14px_38px_rgba(15,23,42,0.07)]` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:910`

```jsx
        <div className="mt-16 pb-6">
          <Surface className="p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
```

**Raw class strings detected (best effort):**

- `mt-16 pb-6`
- `p-10`
- `grid gap-8 lg:grid-cols-12 lg:items-center`
- `lg:col-span-7`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-10` — Padding (all sides).
  - `gap-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:911`

```jsx
          <Surface className="p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Start connecting with the right partners</h2>
```

**Raw class strings detected (best effort):**

- `p-10`
- `grid gap-8 lg:grid-cols-12 lg:items-center`
- `lg:col-span-7`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `p-10` — Padding (all sides).
  - `gap-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:912`

```jsx
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Start connecting with the right partners</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `grid gap-8 lg:grid-cols-12 lg:items-center`
- `lg:col-span-7`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `lg:grid-cols-12` — Variant prefix (responsive, dark, or interaction state).
  - `lg:items-center` — Variant prefix (responsive, dark, or interaction state).
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:913`

```jsx
              <div className="lg:col-span-7">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Start connecting with the right partners</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Clear CTAs and clean surfaces -- your first step into a structured marketplace.
```

**Raw class strings detected (best effort):**

- `lg:col-span-7`
- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Responsive variants:**
  - `lg:col-span-7` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:914`

```jsx
                <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Start connecting with the right partners</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Clear CTAs and clean surfaces -- your first step into a structured marketplace.
                </p>
```

**Raw class strings detected (best effort):**

- `text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white`
- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#1E293B]` — Text color or text sizing.
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:915`

```jsx
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Clear CTAs and clean surfaces -- your first step into a structured marketplace.
                </p>
              </div>
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[#475569]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/TexHub.jsx:919`

```jsx
              <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
                <MagneticLinkButton
                  to="/signup"
                  className="shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
```

**Raw class strings detected (best effort):**

- `flex flex-wrap gap-3 lg:col-span-5 lg:justify-end`
- `/signup`
- `shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `shadow-none` — Drop shadow depth (elevation).
  - `rounded-2xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)]` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `lg:col-span-5` — Variant prefix (responsive, dark, or interaction state).
  - `lg:justify-end` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `/signup` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:922`

```jsx
                  className="shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
                >
                  Create account
                </MagneticLinkButton>
```

**Raw class strings detected (best effort):**

- `shimmer-btn px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-[var(--gt-blue)] text-white font-semibold tracking-tight transition duration-300 ease-out hover:bg-[var(--gt-blue-hover)] hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `shadow-none` — Drop shadow depth (elevation).
  - `rounded-2xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-[0_22px_50px_rgba(10,102,194,0.25)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:shadow-[0_22px_60px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.65)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `shimmer-btn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/TexHub.jsx:928`

```jsx
                  className="px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-white/70 text-[#1E293B] font-semibold tracking-tight backdrop-blur-sm transition duration-300 ease-out hover:bg-white hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]"
                >
                  Login
                </MagneticLinkButton>
```

**Raw class strings detected (best effort):**

- `px-6 py-3 shadow-none inline-flex items-center justify-center rounded-2xl bg-white/70 text-[#1E293B] font-semibold tracking-tight backdrop-blur-sm transition duration-300 ease-out hover:bg-white hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06] dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `text-[#1E293B]` — Text color or text sizing.
  - `backdrop-blur-sm` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `shadow-none` — Drop shadow depth (elevation).
  - `rounded-2xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-300` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
  - `hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/[0.03]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/[0.06]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/TexHub.jsx:541` — Why GarTexHub

```jsx
                <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Why GarTexHub</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  A sourcing workflow network built only for garments and textiles: low noise, structured requests, and trust by design.
                </p>
```

- `src/pages/TexHub.jsx:555` — Solution

```jsx
              <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1E293B] dark:text-white">Solution</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Clear surfaces, verified signals, and structured workflows -- designed to stay calm at scale.
              </p>
```

- `src/pages/TexHub.jsx:560` — Structured Buyer Requests

```jsx
                <li>Structured Buyer Requests</li>
                <li>Verified supplier priority</li>
                <li>Internal Agent Lock System</li>
                <li>Organized partner network</li>
```

- `src/pages/TexHub.jsx:561` — Verified supplier priority

```jsx
                <li>Verified supplier priority</li>
                <li>Internal Agent Lock System</li>
                <li>Organized partner network</li>
              </ul>
```

- `src/pages/TexHub.jsx:562` — Internal Agent Lock System

```jsx
                <li>Internal Agent Lock System</li>
                <li>Organized partner network</li>
              </ul>
              </div>
```

- `src/pages/TexHub.jsx:563` — Organized partner network

```jsx
                <li>Organized partner network</li>
              </ul>
              </div>
            </Surface>
```

- `src/pages/TexHub.jsx:572` — How GarTexHub works

```jsx
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">How GarTexHub works</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">A simple flow that stays structured end-to-end.</p>
          </div>

```

- `src/pages/TexHub.jsx:573` — A simple flow that stays structured end-to-end.

```jsx
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">A simple flow that stays structured end-to-end.</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
```

- `src/pages/TexHub.jsx:578` — Step 1

```jsx
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 1</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Post or search</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Buyers post structured requirements. Factories publish products and capacity.
```

- `src/pages/TexHub.jsx:579` — Post or search

```jsx
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Post or search</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Buyers post structured requirements. Factories publish products and capacity.
              </p>
```

- `src/pages/TexHub.jsx:585` — Step 2

```jsx
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 2</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Smart matching + claim lead</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Agents claim requests. AI summarizes context so the team moves fast without noise.
```

- `src/pages/TexHub.jsx:586` — Smart matching + claim lead

```jsx
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Smart matching + claim lead</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Agents claim requests. AI summarizes context so the team moves fast without noise.
              </p>
```

- `src/pages/TexHub.jsx:592` — Step 3

```jsx
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Step 3</p>
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Chat, call, contract</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Communicate, schedule meetings, and store agreements inside the Contract Vault.
```

- `src/pages/TexHub.jsx:593` — Chat, call, contract

```jsx
              <h4 className="mt-2 text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Chat, call, contract</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Communicate, schedule meetings, and store agreements inside the Contract Vault.
              </p>
```

- `src/pages/TexHub.jsx:604` — Why GarTexHub

```jsx
              <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Why GarTexHub</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Clear positioning and a structured sourcing workflow -- built only for garments & textile.
              </p>
```

- `src/pages/TexHub.jsx:640` — Platform features

```jsx
            <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Platform features</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-slate-400">
              Borderless surfaces, clean hierarchy, and strong trust indicators.
            </p>
```

- `src/pages/TexHub.jsx:803` — Unique toggle

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Unique toggle</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                A tactile switch for diverse content modes -- recessed track, raised handle.
              </p>
```

- `src/pages/TexHub.jsx:835` — Factory video gallery

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">Factory video gallery</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                Edge-to-edge thumbnails for an immersive profile experience.
              </p>
```

- `src/pages/TexHub.jsx:858` — AI assistant

```jsx
              <h4 className="text-base font-bold tracking-tight text-[#1E293B] dark:text-white">AI assistant</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                A floating assistant that feels premium -- glassy, calm, and helpful.
              </p>
```

- `src/pages/TexHub.jsx:863` — “Need help posting a request\*”

```jsx
                <p className="text-sm font-semibold text-[#1E293B] dark:text-white">“Need help posting a request*”</p>
                <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400">I can generate a structured template in seconds.</p>
              </div>
            </Surface>
```

- `src/pages/TexHub.jsx:864` — I can generate a structured template in seconds.

```jsx
                <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-400">I can generate a structured template in seconds.</p>
              </div>
            </Surface>
            </BentoMotion>
```

- `src/pages/TexHub.jsx:876` — Built for growing buying houses

```jsx
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Built for growing buying houses</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Unlimited sub-accounts · dedicated analytics · organization control · contract management
                </p>
```

- `src/pages/TexHub.jsx:895` — Focused only on garments & textile

```jsx
            <h3 className="text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Focused only on garments & textile</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">Industry categories:</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300">
```

- `src/pages/TexHub.jsx:896` — Industry categories:

```jsx
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">Industry categories:</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#334155] dark:text-slate-300">
            {['Shirts', 'Pants', 'Knitwear', 'Woven', 'Denim', 'Custom production'].map((tag) => (
```

- `src/pages/TexHub.jsx:914` — Start connecting with the right partners

```jsx
                <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">Start connecting with the right partners</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-400">
                  Clear CTAs and clean surfaces -- your first step into a structured marketplace.
                </p>
```

- `src/pages/TexHub.jsx:41` — Verified

```jsx
title =
  "Verified" >
  (
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.65)] dark:bg-emerald-300 dark:shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
  );
{
  label;
}
```

- `src/pages/TexHub.jsx:817` — Toggle content mode

```jsx
                  aria-label="Toggle content mode"
                >
                  <motion.div
                    layout
```

- `src/pages/TexHub.jsx:199` — (element) <Link>

```jsx
    <Link to={to} className="inline-flex">
      <motion.span
        className={className}
        style={{ x: springX, y: springY }}
```

- `src/pages/TexHub.jsx:808` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={() => setMode((current) => (current === 'professional' ? 'diverse' : 'professional'))}
                  className={[
```

## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line)                   | Express mount                                    | Route definition                            | Controller file                        | Handler    |
| ------------------------------------------- | ------------------------------------------------ | ------------------------------------------- | -------------------------------------- | ---------- |
| GET /system/home (src/pages/TexHub.jsx:18)  | /api/system -> server/routes/systemRoutes.js:127 | GET /home (server/routes/systemRoutes.js:7) | server/controllers/systemController.js | systemHome |
| GET /system/home (src/pages/TexHub.jsx:308) | /api/system -> server/routes/systemRoutes.js:127 | GET /home (server/routes/systemRoutes.js:7) | server/controllers/systemController.js | systemHome |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/TexHub.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
