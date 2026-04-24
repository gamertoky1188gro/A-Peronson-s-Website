# CallInterface - Route `/call`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/CallInterface.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/CallInterface.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_CallInterface.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/CallInterface.jsx:43)
- ../lib/events (src/pages/CallInterface.jsx:44)
- ../components/chat/MarkdownMessage (src/pages/CallInterface.jsx:45)
- ../components/JourneyTimeline (src/pages/CallInterface.jsx:46)

### 2.2 Structural section tags in JSX

- `header` at `src/pages/CallInterface.jsx:1532`

```jsx
      <header className="flex h-16 items-center justify-between gap-4 borderless-divider-b bg-white/70 px-4 shadow-sm backdrop-blur-xl dark:bg-slate-950/40 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
```

- `aside` at `src/pages/CallInterface.jsx:1735`

```jsx
          <aside className="flex w-full flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10 lg:w-[380px]">
            <div className="flex h-14 items-center justify-between gap-3 borderless-divider-b bg-white/40 px-5 backdrop-blur-xl dark:bg-white/5">
              <div className="min-w-0">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80">Chat</h2>
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

#### `src/pages/CallInterface.jsx:1518`

```jsx
    <div className="relative isolate flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-900 dark:from-[#050816] dark:via-slate-950/10 dark:to-[#120726] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-[callFloat_14s_ease-in-out_infinite] dark:bg-cyan-400/10" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10" style={{ animationDelay: '-6s' }} />
```

**Raw class strings detected (best effort):**

- `relative isolate flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-900 dark:from-[#050816] dark:via-slate-950/10 dark:to-[#120726] dark:text-slate-100`
- `pointer-events-none absolute inset-0 -z-10 overflow-hidden`
- `absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-[callFloat_14s_ease-in-out_infinite] dark:bg-cyan-400/10`
- `absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-col` — Flex layout.
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-96` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-96` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-[28rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[28rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-sans` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-slate-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `via-white` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-slate-100` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-cyan-400/20` — Background color/surface.
  - `bg-fuchsia-400/20` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `motion-safe:animate-[callFloat_14s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
  - `motion-safe:animate-[callFloat_18s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:from-[#050816]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:via-slate-950/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:to-[#120726]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-cyan-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-fuchsia-400/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `isolate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-left-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-top-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `blur-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-bottom-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-right-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1519`

```jsx
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-[callFloat_14s_ease-in-out_infinite] dark:bg-cyan-400/10" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10" style={{ animationDelay: '-6s' }} />
        <div className="absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10" style={{ animationDelay: '-12s' }} />
```

**Raw class strings detected (best effort):**

- `pointer-events-none absolute inset-0 -z-10 overflow-hidden`
- `absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-[callFloat_14s_ease-in-out_infinite] dark:bg-cyan-400/10`
- `absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10`
- `absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-96` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-96` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-[28rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[28rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-[-6rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-[35%]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-cyan-400/20` — Background color/surface.
  - `bg-fuchsia-400/20` — Background color/surface.
  - `bg-indigo-400/15` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `motion-safe:animate-[callFloat_14s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
  - `motion-safe:animate-[callFloat_18s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
  - `motion-safe:animate-[callFloat_16s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-cyan-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-fuchsia-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-indigo-400/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-z-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-left-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-top-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `blur-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-bottom-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-right-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1520`

```jsx
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-[callFloat_14s_ease-in-out_infinite] dark:bg-cyan-400/10" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10" style={{ animationDelay: '-6s' }} />
        <div className="absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10" style={{ animationDelay: '-12s' }} />
      </div>
```

**Raw class strings detected (best effort):**

- `absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-[callFloat_14s_ease-in-out_infinite] dark:bg-cyan-400/10`
- `absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10`
- `absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-96` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-96` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-[28rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[28rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-[-6rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-[35%]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-cyan-400/20` — Background color/surface.
  - `bg-fuchsia-400/20` — Background color/surface.
  - `bg-indigo-400/15` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `motion-safe:animate-[callFloat_14s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
  - `motion-safe:animate-[callFloat_18s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
  - `motion-safe:animate-[callFloat_16s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-cyan-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-fuchsia-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-indigo-400/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `-left-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-top-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `blur-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-bottom-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-right-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1521`

```jsx
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10" style={{ animationDelay: '-6s' }} />
        <div className="absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10" style={{ animationDelay: '-12s' }} />
      </div>
      {toast ? (
```

**Raw class strings detected (best effort):**

- `absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl motion-safe:animate-[callFloat_18s_ease-in-out_infinite] dark:bg-fuchsia-400/10`
- `absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-[28rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[28rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-[-6rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-[35%]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-fuchsia-400/20` — Background color/surface.
  - `bg-indigo-400/15` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `motion-safe:animate-[callFloat_18s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
  - `motion-safe:animate-[callFloat_16s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-fuchsia-400/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-indigo-400/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `-bottom-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-right-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `blur-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1522`

```jsx
        <div className="absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10" style={{ animationDelay: '-12s' }} />
      </div>
      {toast ? (
        <div className="pointer-events-none fixed left-1/2 top-[76px] z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 px-2">
```

**Raw class strings detected (best effort):**

- `absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl motion-safe:animate-[callFloat_16s_ease-in-out_infinite] dark:bg-indigo-400/10`
- `pointer-events-none fixed left-1/2 top-[76px] z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 px-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-[-6rem]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-[35%]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `fixed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-[76px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-[70]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[calc(100%-2rem)]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-lg` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
- **Color / surface:**
  - `bg-indigo-400/15` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `motion-safe:animate-[callFloat_16s_ease-in-out_infinite]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-indigo-400/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `blur-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-translate-x-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1525`

```jsx
        <div className="pointer-events-none fixed left-1/2 top-[76px] z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 px-2">
          <div className={`rounded-2xl px-4 py-2 text-center text-sm font-semibold shadow-lg ring-1 backdrop-blur-xl${toast.tone === 'error' ? 'bg-rose-500/15 text-rose-100 ring-rose-500/25' : toast.tone === 'success' ? 'bg-emerald-500/15 text-emerald-50 ring-emerald-500/25' : 'bg-slate-950/75 text-white ring-white/10'}`}>
            {toast.message}
          </div>
```

**Raw class strings detected (best effort):**

- `pointer-events-none fixed left-1/2 top-[76px] z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 px-2`
- `error`
- `bg-rose-500/15 text-rose-100 ring-rose-500/25`
- `success`
- `bg-emerald-500/15 text-emerald-50 ring-emerald-500/25`
- `bg-slate-950/75 text-white ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `fixed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-[76px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-[70]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-[calc(100%-2rem)]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-lg` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
- **Typography:**
  - `text-rose-100` — Text color or text sizing.
  - `text-emerald-50` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-500/15` — Background color/surface.
  - `bg-emerald-500/15` — Background color/surface.
  - `bg-slate-950/75` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-rose-500/25` — Outline ring (often used instead of borders in dark mode).
  - `ring-emerald-500/25` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/10` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-translate-x-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `error` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `success` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1526`

```jsx
          <div className={`rounded-2xl px-4 py-2 text-center text-sm font-semibold shadow-lg ring-1 backdrop-blur-xl${toast.tone === 'error' ? 'bg-rose-500/15 text-rose-100 ring-rose-500/25' : toast.tone === 'success' ? 'bg-emerald-500/15 text-emerald-50 ring-emerald-500/25' : 'bg-slate-950/75 text-white ring-white/10'}`}>
            {toast.message}
          </div>
        </div>
```

**Raw class strings detected (best effort):**

- `error`
- `bg-rose-500/15 text-rose-100 ring-rose-500/25`
- `success`
- `bg-emerald-500/15 text-emerald-50 ring-emerald-500/25`
- `bg-slate-950/75 text-white ring-white/10`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-rose-100` — Text color or text sizing.
  - `text-emerald-50` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-500/15` — Background color/surface.
  - `bg-emerald-500/15` — Background color/surface.
  - `bg-slate-950/75` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-rose-500/25` — Outline ring (often used instead of borders in dark mode).
  - `ring-emerald-500/25` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/10` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `error` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `success` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1532`

```jsx
      <header className="flex h-16 items-center justify-between gap-4 borderless-divider-b bg-white/70 px-4 shadow-sm backdrop-blur-xl dark:bg-slate-950/40 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
```

**Raw class strings detected (best effort):**

- `flex h-16 items-center justify-between gap-4 borderless-divider-b bg-white/70 px-4 shadow-sm backdrop-blur-xl dark:bg-slate-950/40 sm:px-6`
- `flex min-w-0 items-center gap-3 sm:gap-4`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `borderless-divider-b` — Border style/width/color.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Responsive variants:**
  - `sm:px-6` — Variant prefix (responsive, dark, or interaction state).
  - `sm:gap-4` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-slate-950/40` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1533`

```jsx
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
```

**Raw class strings detected (best effort):**

- `flex min-w-0 items-center gap-3 sm:gap-4`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:gap-4` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1537`

```jsx
className =
  "group flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-600 shadow-sm ring-1 ring-slate-200/60 transition hover:bg-white hover:text-slate-900 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10";
title =
  "Back" >
  (
    <ChevronLeft
      size={18}
      className="transition-transform group-hover:-translate-x-0.5"
    />
  );
```

**Raw class strings detected (best effort):**

- `group flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-600 shadow-sm ring-1 ring-slate-200/60 transition hover:bg-white hover:text-slate-900 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`
- `Back`
- `transition-transform group-hover:-translate-x-0.5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/80` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `group-hover:-translate-x-0.5` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `group` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Back` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1540`

```jsx
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base">
```

**Raw class strings detected (best effort):**

- `transition-transform group-hover:-translate-x-0.5`
- `min-w-0`
- `truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `group-hover:-translate-x-0.5` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1542`

```jsx
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base">
              Call with <span className="text-slate-600 dark:text-slate-300">“{remoteName}”</span>
            </div>
```

**Raw class strings detected (best effort):**

- `min-w-0`
- `truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base`
- `text-slate-600 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Responsive variants:**
  - `sm:text-base` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1543`

```jsx
            <div className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base">
              Call with <span className="text-slate-600 dark:text-slate-300">“{remoteName}”</span>
            </div>
            <div className="hidden truncate text-xs text-slate-500 dark:text-slate-300/80 sm:block">
```

**Raw class strings detected (best effort):**

- `truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base`
- `text-slate-600 dark:text-slate-300`
- `hidden truncate text-xs text-slate-500 dark:text-slate-300/80 sm:block`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Responsive variants:**
  - `sm:text-base` — Variant prefix (responsive, dark, or interaction state).
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300/80` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1544`

```jsx
              Call with <span className="text-slate-600 dark:text-slate-300">“{remoteName}”</span>
            </div>
            <div className="hidden truncate text-xs text-slate-500 dark:text-slate-300/80 sm:block">
              {statusMessage || 'Preparing call...'}
```

**Raw class strings detected (best effort):**

- `text-slate-600 dark:text-slate-300`
- `hidden truncate text-xs text-slate-500 dark:text-slate-300/80 sm:block`
- `Preparing call...`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300/80` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Preparing` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `call...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1546`

```jsx
            <div className="hidden truncate text-xs text-slate-500 dark:text-slate-300/80 sm:block">
              {statusMessage || 'Preparing call...'}
            </div>
          </div>
```

**Raw class strings detected (best effort):**

- `hidden truncate text-xs text-slate-500 dark:text-slate-300/80 sm:block`
- `Preparing call...`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Responsive variants:**
  - `sm:block` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300/80` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Preparing` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `call...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1552`

```jsx
        <div className="flex flex-none items-center gap-2">
          <span className={`hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 sm:inline-flex${connectionBadge.pillClass}`}>
            <span className={`h-2 w-2 rounded-full${connectionBadge.dotClass}`} />
            {connectionBadge.label}
```

**Raw class strings detected (best effort):**

- `flex flex-none items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-none` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1553`

```jsx
<span
  className={`hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 sm:inline-flex${connectionBadge.pillClass}`}
>
  <span className={`h-2 w-2 rounded-full${connectionBadge.dotClass}`} />
  {connectionBadge.label}
</span>
```

**Raw class strings detected (best effort):**

- _(dynamic className; inspect the snippet above)_

**Utility breakdown (grouped):**

#### `src/pages/CallInterface.jsx:1554`

```jsx
            <span className={`h-2 w-2 rounded-full${connectionBadge.dotClass}`} />
            {connectionBadge.label}
          </span>
          {recordingState !== 'idle' ? (
```

**Raw class strings detected (best effort):**

- `idle`

**Utility breakdown (grouped):**

- **Other:**
  - `idle` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1558`

```jsx
            <span className="hidden items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 sm:inline-flex">
              <span className={`h-2 w-2 rounded-full${recordingState === 'recording' ? 'bg-rose-500 animate-pulse' : recordingState === 'available' ? 'bg-emerald-500' : recordingState === 'uploading' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
              {recordingState === 'recording'
                ? 'REC'
```

**Raw class strings detected (best effort):**

- `hidden items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 sm:inline-flex`
- `recording`
- `bg-rose-500 animate-pulse`
- `available`
- `bg-emerald-500`
- `uploading`
- `bg-amber-500 animate-pulse`
- `bg-rose-500`
- `REC`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `bg-rose-500` — Background color/surface.
  - `bg-emerald-500` — Background color/surface.
  - `bg-amber-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `animate-pulse` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:inline-flex` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `recording` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `available` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uploading` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `REC` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1559`

```jsx
              <span className={`h-2 w-2 rounded-full${recordingState === 'recording' ? 'bg-rose-500 animate-pulse' : recordingState === 'available' ? 'bg-emerald-500' : recordingState === 'uploading' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
              {recordingState === 'recording'
                ? 'REC'
                : recordingState === 'uploading'
```

**Raw class strings detected (best effort):**

- `recording`
- `bg-rose-500 animate-pulse`
- `available`
- `bg-emerald-500`
- `uploading`
- `bg-amber-500 animate-pulse`
- `bg-rose-500`
- `REC`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `bg-rose-500` — Background color/surface.
  - `bg-emerald-500` — Background color/surface.
  - `bg-amber-500` — Background color/surface.
- **Interaction / motion:**
  - `animate-pulse` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `recording` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `available` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uploading` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `REC` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1569`

```jsx
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold tabular-nums text-slate-700 ring-1 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
            {timer}
          </span>
        </div>
```

**Raw class strings detected (best effort):**

- `rounded-full bg-white/70 px-3 py-1 text-xs font-bold tabular-nums text-slate-700 ring-1 ring-slate-200/60 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `tabular-nums` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1576`

```jsx
      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6 lg:flex-row">

        {/* Left Side: Video Feed Area */}
        <div className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10">
```

**Raw class strings detected (best effort):**

- `flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6 lg:flex-row`
- `relative flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-1` — Flex layout.
  - `flex-col` — Flex layout.
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-h-[520px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-[28px]` — Corner radius.
  - `shadow-xl` — Drop shadow depth (elevation).
  - `shadow-slate-900/5` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `sm:p-6` — Variant prefix (responsive, dark, or interaction state).
  - `lg:flex-row` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1579`

```jsx
        <div className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10">

          <div ref={stageRef} className="relative flex-1 overflow-hidden rounded-[24px] bg-slate-950">
            {/* Remote Participant Label */}
```

**Raw class strings detected (best effort):**

- `relative flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10`
- `relative flex-1 overflow-hidden rounded-[24px] bg-slate-950`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `min-h-[520px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `flex-col` — Flex layout.
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-slate-950` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-[28px]` — Corner radius.
  - `shadow-xl` — Drop shadow depth (elevation).
  - `shadow-slate-900/5` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `rounded-[24px]` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1581`

```jsx
          <div ref={stageRef} className="relative flex-1 overflow-hidden rounded-[24px] bg-slate-950">
            {/* Remote Participant Label */}
            <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold">
```

**Raw class strings detected (best effort):**

- `relative flex-1 overflow-hidden rounded-[24px] bg-slate-950`
- `absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/10`
- `flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-950` — Background color/surface.
  - `bg-black/35` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-white/10` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-[24px]` — Corner radius.
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/10` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/CallInterface.jsx:1583`

```jsx
            <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold">
                {(remoteName || 'U').slice(0, 1).toUpperCase()}
              </div>
```

**Raw class strings detected (best effort):**

- `absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/10`
- `flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold`
- `U`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-black/35` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-white/10` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/10` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `U` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1584`

```jsx
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold">
                {(remoteName || 'U').slice(0, 1).toUpperCase()}
              </div>
              <div className="max-w-[220px] truncate">{remoteName}</div>
```

**Raw class strings detected (best effort):**

- `flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold`
- `U`
- `max-w-[220px] truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-7` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-[220px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/10` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `U` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1587`

```jsx
              <div className="max-w-[220px] truncate">{remoteName}</div>
            </div>

            {/* Remote Video (Main) */}
```

**Raw class strings detected (best effort):**

- `max-w-[220px] truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-[220px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1596`

```jsx
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
            {!hasRemoteStream && (
```

**Raw class strings detected (best effort):**

- `absolute inset-0 h-full w-full object-cover`
- `pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-gradient-to-b` — Background color/surface.
  - `from-black/10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `via-transparent` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-black/50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1598`

```jsx
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
            {!hasRemoteStream && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-white/80">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold ring-1 ring-white/10">
```

**Raw class strings detected (best effort):**

- `pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50`
- `absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-white/80`
- `flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold ring-1 ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-white/80` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-gradient-to-b` — Background color/surface.
  - `from-black/10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `via-transparent` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-black/50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-white/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/10` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1600`

```jsx
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-white/80">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold ring-1 ring-white/10">
                  {(remoteName || 'U').slice(0, 1).toUpperCase()}
                </div>
```

**Raw class strings detected (best effort):**

- `absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-white/80`
- `flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold ring-1 ring-white/10`
- `U`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-white/80` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/10` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `U` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1601`

```jsx
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold ring-1 ring-white/10">
                  {(remoteName || 'U').slice(0, 1).toUpperCase()}
                </div>
                <div className="text-base font-semibold">{remoteName}</div>
```

**Raw class strings detected (best effort):**

- `flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold ring-1 ring-white/10`
- `U`
- `text-base font-semibold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-base` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-3xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/10` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `U` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1604`

```jsx
                <div className="text-base font-semibold">{remoteName}</div>
                <div className="max-w-xs text-center text-xs text-white/60">
                  {statusMessage || 'Waiting to connect...'}
                </div>
```

**Raw class strings detected (best effort):**

- `text-base font-semibold`
- `max-w-xs text-center text-xs text-white/60`
- `Waiting to connect...`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xs` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-base` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-center` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-white/60` — Text color or text sizing.
- **Other:**
  - `Waiting` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `connect...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1605`

```jsx
                <div className="max-w-xs text-center text-xs text-white/60">
                  {statusMessage || 'Waiting to connect...'}
                </div>
              </div>
```

**Raw class strings detected (best effort):**

- `max-w-xs text-center text-xs text-white/60`
- `Waiting to connect...`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-xs` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-white/60` — Text color or text sizing.
- **Other:**
  - `Waiting` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `connect...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1612`

```jsx
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
                <div className="w-full max-w-md rounded-2xl borderless-shadow bg-white/10 p-6 text-center text-white backdrop-blur-md">
                  <div className="text-lg font-semibold">{mediaGate.title}</div>
                  <div className="mt-2 text-sm text-white/80">{mediaGate.message}</div>
```

**Raw class strings detected (best effort):**

- `absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6`
- `w-full max-w-md rounded-2xl borderless-shadow bg-white/10 p-6 text-center text-white backdrop-blur-md`
- `text-lg font-semibold`
- `mt-2 text-sm text-white/80`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
  - `text-lg` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-white/80` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/60` — Background color/surface.
  - `bg-white/10` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/CallInterface.jsx:1613`

```jsx
                <div className="w-full max-w-md rounded-2xl borderless-shadow bg-white/10 p-6 text-center text-white backdrop-blur-md">
                  <div className="text-lg font-semibold">{mediaGate.title}</div>
                  <div className="mt-2 text-sm text-white/80">{mediaGate.message}</div>
                  <div className="mt-5 flex items-center justify-center gap-3">
```

**Raw class strings detected (best effort):**

- `w-full max-w-md rounded-2xl borderless-shadow bg-white/10 p-6 text-center text-white backdrop-blur-md`
- `text-lg font-semibold`
- `mt-2 text-sm text-white/80`
- `mt-5 flex items-center justify-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
  - `text-lg` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-white/80` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/10` — Background color/surface.
  - `backdrop-blur-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/CallInterface.jsx:1614`

```jsx
                  <div className="text-lg font-semibold">{mediaGate.title}</div>
                  <div className="mt-2 text-sm text-white/80">{mediaGate.message}</div>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    {mediaGate.actionLabel ? (
```

**Raw class strings detected (best effort):**

- `text-lg font-semibold`
- `mt-2 text-sm text-white/80`
- `mt-5 flex items-center justify-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-white/80` — Text color or text sizing.

#### `src/pages/CallInterface.jsx:1615`

```jsx
                  <div className="mt-2 text-sm text-white/80">{mediaGate.message}</div>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    {mediaGate.actionLabel ? (
                      <button
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm text-white/80`
- `mt-5 flex items-center justify-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-white/80` — Text color or text sizing.

#### `src/pages/CallInterface.jsx:1616`

```jsx
                  <div className="mt-5 flex items-center justify-center gap-3">
                    {mediaGate.actionLabel ? (
                      <button
                        type="button"
```

**Raw class strings detected (best effort):**

- `mt-5 flex items-center justify-center gap-3`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1622`

```jsx
                        className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
                      >
                        {isRequestingMedia ? 'Requesting...' : mediaGate.actionLabel}
                      </button>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60`
- `Requesting...`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-blue-600` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Requesting...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1630`

```jsx
                      className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
                    >
                      Dismiss
                    </button>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-white/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1641`

```jsx
              className={`absolute right-5 top-5 z-30 aspect-video w-40 overflow-hidden rounded-2xl bg-black/80 ring-1${isSpeaking ? 'ring-cyan-300/70' : 'ring-white/20'}shadow-2xl shadow-black/40 sm:w-56`}
              style={isSpeaking ? { boxShadow: '0 22px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,211,238,0.35), 0 0 34px rgba(34,211,238,0.25)' } : undefined}
            >
              <video
```

**Raw class strings detected (best effort):**

- `ring-cyan-300/70`
- `ring-white/20`
- `0 22px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,211,238,0.35), 0 0 34px rgba(34,211,238,0.25)`

**Utility breakdown (grouped):**

- **Borders / rings / shadows:**
  - `ring-cyan-300/70` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/20` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `22px` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `60px` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `rgba(0,0,0,0.55),` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `1px` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `rgba(34,211,238,0.35),` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `34px` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `rgba(34,211,238,0.25)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1649`

```jsx
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                {localName}
```

**Raw class strings detected (best effort):**

- `h-full w-full object-cover`
- `absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `backdrop-blur` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1651`

```jsx
              <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                {localName}
              </div>
            </div>
```

**Raw class strings detected (best effort):**

- `absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/50` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
  - `backdrop-blur` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/CallInterface.jsx:1657`

```jsx
            <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-black/35 p-2 backdrop-blur-xl ring-1 ring-white/10 shadow-lg">
              <button
                type="button"
                onClick={() => setIsChatOpen((prev) => !prev)}
```

**Raw class strings detected (best effort):**

- `absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-black/35 p-2 backdrop-blur-xl ring-1 ring-white/10 shadow-lg`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-40` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Color / surface:**
  - `bg-black/35` — Background color/surface.
  - `backdrop-blur-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-white/10` — Outline ring (often used instead of borders in dark mode).
  - `shadow-lg` — Drop shadow depth (elevation).
- **Other:**
  - `-translate-x-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1661`

```jsx
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isChatOpen ? 'bg-sky-500/90 hover:bg-sky-500' : 'bg-white/10 hover:bg-white/15'}`}
                title={isChatOpen ? 'Hide chat' : 'Show chat'}
              >
                <MessageSquare size={20} />
```

**Raw class strings detected (best effort):**

- `bg-sky-500/90 hover:bg-sky-500`
- `bg-white/10 hover:bg-white/15`
- `Hide chat`
- `Show chat`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `bg-sky-500/90` — Background color/surface.
  - `bg-white/10` — Background color/surface.
- **Interaction / motion:**
  - `hover:bg-sky-500` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-white/15` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Hide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `chat` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Show` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1666`

```jsx
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-black/40">
                    {unreadChatCount > 99 ? '99+' : unreadChatCount}
                  </span>
                ) : null}
```

**Raw class strings detected (best effort):**

- `absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-black/40`
- `99+`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-1.5` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `leading-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-500` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `ring-2` — Outline ring (often used instead of borders in dark mode).
  - `ring-black/40` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `-right-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `-top-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `99+` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1674`

```jsx
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isSpeakerMuted ? 'bg-amber-500/90 hover:bg-amber-500' : 'bg-white/10 hover:bg-white/15'}`}
                title={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
              >
                {isSpeakerMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
```

**Raw class strings detected (best effort):**

- `bg-amber-500/90 hover:bg-amber-500`
- `bg-white/10 hover:bg-white/15`
- `Unmute speaker`
- `Mute speaker`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `bg-amber-500/90` — Background color/surface.
  - `bg-white/10` — Background color/surface.
- **Interaction / motion:**
  - `hover:bg-amber-500` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-white/15` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Unmute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `speaker` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Mute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1682`

```jsx
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isMuted ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white/10 hover:bg-white/15'}`}
                title={isMuted ? 'Unmute mic' : 'Mute mic'}
                aria-pressed={!isMuted}
                style={!isMuted && micLevel > 0.02 ? { boxShadow: `0 0 ${10 + micLevel * 26}px rgba(34,211,238,${0.18 + micLevel * 0.35})` } : undefined}
```

**Raw class strings detected (best effort):**

- `bg-rose-500 hover:bg-rose-600`
- `bg-white/10 hover:bg-white/15`
- `Unmute mic`
- `Mute mic`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `bg-rose-500` — Background color/surface.
  - `bg-white/10` — Background color/surface.
- **Interaction / motion:**
  - `hover:bg-rose-600` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-white/15` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Unmute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Mute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1692`

```jsx
className =
  "flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white transition-all hover:bg-rose-600 active:scale-95";
title = "End call" > <PhoneOff size={20} />;
```

**Raw class strings detected (best effort):**

- `flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white transition-all hover:bg-rose-600 active:scale-95`
- `End call`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-rose-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition-all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-rose-600` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `End` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `call` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1700`

```jsx
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${!isCameraOn ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white/10 hover:bg-white/15'}`}
                title={!isCameraOn ? 'Turn camera on' : 'Turn camera off'}
              >
                {!isCameraOn ? <VideoOff size={20} /> : <Video size={20} />}
```

**Raw class strings detected (best effort):**

- `bg-rose-500 hover:bg-rose-600`
- `bg-white/10 hover:bg-white/15`
- `Turn camera on`
- `Turn camera off`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `bg-rose-500` — Background color/surface.
  - `bg-white/10` — Background color/surface.
- **Interaction / motion:**
  - `hover:bg-rose-600` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-white/15` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Turn` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `camera` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `on` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `off` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1708`

```jsx
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isFullscreen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                <Maximize size={20} />
```

**Raw class strings detected (best effort):**

- `bg-white/20`
- `bg-white/10 hover:bg-white/15`
- `Exit fullscreen`
- `Fullscreen`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `bg-white/20` — Background color/surface.
  - `bg-white/10` — Background color/surface.
- **Interaction / motion:**
  - `hover:bg-white/15` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Exit` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `fullscreen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Fullscreen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1717`

```jsx
          <div className="flex items-center gap-3 borderless-divider-t bg-white/70 px-4 py-3 backdrop-blur-xl dark:bg-white/5 sm:px-6">
            <div className="flex items-end gap-1.5 text-sky-600 dark:text-cyan-300" aria-hidden="true">
              {[0.28, 0.44, 0.72, 0.44, 0.28].map((base, index) => (
                <span
```

**Raw class strings detected (best effort):**

- `flex items-center gap-3 borderless-divider-t bg-white/70 px-4 py-3 backdrop-blur-xl dark:bg-white/5 sm:px-6`
- `flex items-end gap-1.5 text-sky-600 dark:text-cyan-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-end` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `gap-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sky-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `borderless-divider-t` — Border style/width/color.
- **Responsive variants:**
  - `sm:px-6` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-cyan-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1718`

```jsx
            <div className="flex items-end gap-1.5 text-sky-600 dark:text-cyan-300" aria-hidden="true">
              {[0.28, 0.44, 0.72, 0.44, 0.28].map((base, index) => (
                <span
                  key={index}
```

**Raw class strings detected (best effort):**

- `flex items-end gap-1.5 text-sky-600 dark:text-cyan-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-end` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sky-600` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-cyan-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1722`

```jsx
                  className="h-5 w-1.5 rounded-full bg-current transition-transform duration-150 will-change-transform"
                  style={{ transformOrigin: 'bottom', transform: `scaleY(${Math.max(0.18, base + micLevel * 0.9)})` }}
                />
              ))}
```

**Raw class strings detected (best effort):**

- `h-5 w-1.5 rounded-full bg-current transition-transform duration-150 will-change-transform`
- `bottom`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-current` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-150` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `will-change-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1727`

```jsx
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              {statusMessage || callDetails?.context?.notes || 'Live call in progress.'}
            </p>
          </div>
```

**Raw class strings detected (best effort):**

- `min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200`
- `Live call in progress.`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Live` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `call` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `in` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `progress.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1735`

```jsx
          <aside className="flex w-full flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10 lg:w-[380px]">
            <div className="flex h-14 items-center justify-between gap-3 borderless-divider-b bg-white/40 px-5 backdrop-blur-xl dark:bg-white/5">
              <div className="min-w-0">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80">Chat</h2>
```

**Raw class strings detected (best effort):**

- `flex w-full flex-col overflow-hidden rounded-[28px] bg-white/70 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10 lg:w-[380px]`
- `flex h-14 items-center justify-between gap-3 borderless-divider-b bg-white/40 px-5 backdrop-blur-xl dark:bg-white/5`
- `min-w-0`
- `text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-col` — Flex layout.
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-5` — Horizontal padding (left/right).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
  - `backdrop-blur-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bg-white/40` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-[28px]` — Corner radius.
  - `shadow-xl` — Drop shadow depth (elevation).
  - `shadow-slate-900/5` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `borderless-divider-b` — Border style/width/color.
- **Responsive variants:**
  - `lg:w-[380px]` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300/80` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1736`

```jsx
            <div className="flex h-14 items-center justify-between gap-3 borderless-divider-b bg-white/40 px-5 backdrop-blur-xl dark:bg-white/5">
              <div className="min-w-0">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80">Chat</h2>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-300/70">{remoteName}</p>
```

**Raw class strings detected (best effort):**

- `flex h-14 items-center justify-between gap-3 borderless-divider-b bg-white/40 px-5 backdrop-blur-xl dark:bg-white/5`
- `min-w-0`
- `text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80`
- `truncate text-[11px] text-slate-500 dark:text-slate-300/70`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-5` — Horizontal padding (left/right).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/40` — Background color/surface.
  - `backdrop-blur-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-divider-b` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300/80` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300/70` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1737`

```jsx
<div className="min-w-0">
  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80">
    Chat
  </h2>
  <p className="truncate text-[11px] text-slate-500 dark:text-slate-300/70">
    {remoteName}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `min-w-0`
- `text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80`
- `truncate text-[11px] text-slate-500 dark:text-slate-300/70`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300/80` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300/70` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1738`

```jsx
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80">Chat</h2>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-300/70">{remoteName}</p>
              </div>
              <div ref={morePopoverRef} className="relative flex items-center gap-2">
```

**Raw class strings detected (best effort):**

- `text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80`
- `truncate text-[11px] text-slate-500 dark:text-slate-300/70`
- `relative flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300/80` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300/70` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1739`

```jsx
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-300/70">{remoteName}</p>
              </div>
              <div ref={morePopoverRef} className="relative flex items-center gap-2">
                <span className={`hidden items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 sm:inline-flex${isChatLive ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-200' : 'bg-slate-500/10 text-slate-600 ring-slate-400/20 dark:text-slate-300'}`}>
```

**Raw class strings detected (best effort):**

- `truncate text-[11px] text-slate-500 dark:text-slate-300/70`
- `relative flex items-center gap-2`
- `bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-200`
- `bg-slate-500/10 text-slate-600 ring-slate-400/20 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-emerald-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-emerald-500/10` — Background color/surface.
  - `bg-slate-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-emerald-500/20` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-400/20` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-300/70` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1741`

```jsx
              <div ref={morePopoverRef} className="relative flex items-center gap-2">
                <span className={`hidden items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 sm:inline-flex${isChatLive ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-200' : 'bg-slate-500/10 text-slate-600 ring-slate-400/20 dark:text-slate-300'}`}>
                  <span className={`h-2 w-2 rounded-full${isChatLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {isChatLive ? 'Live' : 'Syncing'}
```

**Raw class strings detected (best effort):**

- `relative flex items-center gap-2`
- `bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-200`
- `bg-slate-500/10 text-slate-600 ring-slate-400/20 dark:text-slate-300`
- `bg-emerald-500 animate-pulse`
- `bg-slate-400`
- `Live`
- `Syncing`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-emerald-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-500/10` — Background color/surface.
  - `bg-slate-500/10` — Background color/surface.
  - `bg-emerald-500` — Background color/surface.
  - `bg-slate-400` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-emerald-500/20` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-400/20` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `animate-pulse` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Live` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Syncing` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1742`

```jsx
<span
  className={`hidden items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 sm:inline-flex${isChatLive ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-200" : "bg-slate-500/10 text-slate-600 ring-slate-400/20 dark:text-slate-300"}`}
>
  <span
    className={`h-2 w-2 rounded-full${isChatLive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
  />
  {isChatLive ? "Live" : "Syncing"}
</span>
```

**Raw class strings detected (best effort):**

- `bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-200`
- `bg-slate-500/10 text-slate-600 ring-slate-400/20 dark:text-slate-300`
- `bg-emerald-500 animate-pulse`
- `bg-slate-400`
- `Live`
- `Syncing`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-emerald-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-500/10` — Background color/surface.
  - `bg-slate-500/10` — Background color/surface.
  - `bg-emerald-500` — Background color/surface.
  - `bg-slate-400` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-emerald-500/20` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-400/20` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `animate-pulse` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-emerald-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Live` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Syncing` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1743`

```jsx
                  <span className={`h-2 w-2 rounded-full${isChatLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {isChatLive ? 'Live' : 'Syncing'}
                </span>
                <button
```

**Raw class strings detected (best effort):**

- `bg-emerald-500 animate-pulse`
- `bg-slate-400`
- `Live`
- `Syncing`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `bg-emerald-500` — Background color/surface.
  - `bg-slate-400` — Background color/surface.
- **Interaction / motion:**
  - `animate-pulse` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Live` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Syncing` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1752`

```jsx
className =
  "flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200";
title = "More" > <MoreHorizontal size={20} />;
```

**Raw class strings detected (best effort):**

- `flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200`
- `More`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `hover:text-slate-700` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:hover:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `More` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1759`

```jsx
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl bg-white/90 p-2 shadow-xl ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-slate-950/60 dark:ring-white/10">
                    <button
                      type="button"
                      onClick={() => {
```

**Raw class strings detected (best effort):**

- `absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl bg-white/90 p-2 shadow-xl ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-slate-950/60 dark:ring-white/10`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-64` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
- **Color / surface:**
  - `bg-white/90` — Background color/surface.
  - `backdrop-blur-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-xl` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-950/60` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1766`

```jsx
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                    >
                      <Copy size={16} className="opacity-80" />
                      Copy call link
```

**Raw class strings detected (best effort):**

- `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10`
- `opacity-80`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1768`

```jsx
                      <Copy size={16} className="opacity-80" />
                      Copy call link
                    </button>
                    <button
```

**Raw class strings detected (best effort):**

- `opacity-80`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1777`

```jsx
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                    >
                      <ShieldAlert size={16} className="opacity-80" />
                      Request permissions
```

**Raw class strings detected (best effort):**

- `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10`
- `opacity-80`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1779`

```jsx
                      <ShieldAlert size={16} className="opacity-80" />
                      Request permissions
                    </button>
                    <button
```

**Raw class strings detected (best effort):**

- `opacity-80`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1789`

```jsx
className =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10" >
  <RefreshCw size={16} className="opacity-80" />;
Reconnect;
```

**Raw class strings detected (best effort):**

- `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10`
- `opacity-80`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1791`

```jsx
                      <RefreshCw size={16} className="opacity-80" />
                      Reconnect
                    </button>
                    <button
```

**Raw class strings detected (best effort):**

- `opacity-80`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1800`

```jsx
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                    >
                      <MessageSquare size={16} className="opacity-80" />
                      Hide chat
```

**Raw class strings detected (best effort):**

- `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10`
- `opacity-80`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1802`

```jsx
                      <MessageSquare size={16} className="opacity-80" />
                      Hide chat
                    </button>
                  </div>
```

**Raw class strings detected (best effort):**

- `opacity-80`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1809`

```jsx
<div className="borderless-divider-b bg-white/30 p-3 dark:bg-white/5">
  <JourneyTimeline title="Journey Timeline" matchId={effectiveMatchId || ""} />
</div>
```

**Raw class strings detected (best effort):**

- `borderless-divider-b bg-white/30 p-3 dark:bg-white/5`
- `Journey Timeline`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
- **Color / surface:**
  - `bg-white/30` — Background color/surface.
- **Borders / rings / shadows:**
  - `borderless-divider-b` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Journey` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Timeline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1813`

```jsx
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto bg-slate-50/60 p-5 space-y-6 dark:bg-black/20 scrollbar-hide">
            {sortedChatMessages.length > 0 ? sortedChatMessages.map((msg) => {
              const isOwn = msg.sender_id === user?.id
              const sender = userMap.get(msg.sender_id)
```

**Raw class strings detected (best effort):**

- `flex-1 overflow-y-auto bg-slate-50/60 p-5 space-y-6 dark:bg-black/20 scrollbar-hide`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
  - `overflow-y-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `space-y-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-50/60` — Background color/surface.
- **Dark mode variants:**
  - `dark:bg-black/20` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `scrollbar-hide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1819`

```jsx
                <div key={msg.id} className={`flex flex-col${isOwn ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!isOwn && (
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
```

**Raw class strings detected (best effort):**

- `items-end`
- `items-start`
- `flex items-center gap-2 mb-1`
- `h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `items-end` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-green-500` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/CallInterface.jsx:1820`

```jsx
                  <div className="flex items-center gap-2 mb-1">
                    {!isOwn && (
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
                        {senderName[0] || 'U'}
```

**Raw class strings detected (best effort):**

- `flex items-center gap-2 mb-1`
- `h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold`
- `U`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-green-500` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `U` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1822`

```jsx
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
                        {senderName[0] || 'U'}
                      </div>
                    )}
```

**Raw class strings detected (best effort):**

- `h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold`
- `U`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-green-500` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `U` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1826`

```jsx
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{senderName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400/80">{formatMessageTime(msg.timestamp)}</span>
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm${
```

**Raw class strings detected (best effort):**

- `text-xs font-bold text-slate-700 dark:text-slate-200`
- `text-[10px] text-slate-400 dark:text-slate-400/80`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400/80` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1827`

```jsx
                    <span className="text-[10px] text-slate-400 dark:text-slate-400/80">{formatMessageTime(msg.timestamp)}</span>
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm${
                    isOwn
```

**Raw class strings detected (best effort):**

- `text-[10px] text-slate-400 dark:text-slate-400/80`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400/80` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1829`

```jsx
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm${
                    isOwn
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white/80 text-slate-800 ring-1 ring-slate-200/60 rounded-tl-none dark:bg-white/5 dark:text-slate-100 dark:ring-white/10'
```

**Raw class strings detected (best effort):**

- `bg-blue-600 text-white rounded-tr-none`
- `bg-white/80 text-slate-800 ring-1 ring-slate-200/60 rounded-tl-none dark:bg-white/5 dark:text-slate-100 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600` — Background color/surface.
  - `bg-white/80` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-tr-none` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `rounded-tl-none` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1839`

```jsx
              <div className="text-sm text-slate-400">No messages yet.</div>
            )}
            <div ref={chatEndRef} />
          </div>
```

**Raw class strings detected (best effort):**

- `text-sm text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.

#### `src/pages/CallInterface.jsx:1844`

```jsx
            <div className="borderless-divider-t p-4">
              <div className="relative flex items-center gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-slate-200/60 focus-within:ring-sky-500/30 dark:bg-white/5 dark:ring-white/10">
                <div ref={emojiPopoverRef} className="relative ml-1">
                  <button
```

**Raw class strings detected (best effort):**

- `borderless-divider-t p-4`
- `relative flex items-center gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-slate-200/60 focus-within:ring-sky-500/30 dark:bg-white/5 dark:ring-white/10`
- `relative ml-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
  - `ml-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `borderless-divider-t` — Border style/width/color.
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `focus-within:ring-sky-500/30` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1845`

```jsx
              <div className="relative flex items-center gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-slate-200/60 focus-within:ring-sky-500/30 dark:bg-white/5 dark:ring-white/10">
                <div ref={emojiPopoverRef} className="relative ml-1">
                  <button
                    type="button"
```

**Raw class strings detected (best effort):**

- `relative flex items-center gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-slate-200/60 focus-within:ring-sky-500/30 dark:bg-white/5 dark:ring-white/10`
- `relative ml-1`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
  - `ml-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `focus-within:ring-sky-500/30` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1846`

```jsx
                <div ref={emojiPopoverRef} className="relative ml-1">
                  <button
                    type="button"
                    onClick={() => {
```

**Raw class strings detected (best effort):**

- `relative ml-1`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `ml-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1853`

```jsx
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200${isEmojiOpen ? 'bg-slate-100 dark:bg-white/10' : ''}`}
                    title="Emoji"
                  >
                    <Smile size={20} />
```

**Raw class strings detected (best effort):**

- `bg-slate-100 dark:bg-white/10`
- `Emoji`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Emoji` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1860`

```jsx
                    <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-2xl bg-white/90 p-3 shadow-xl ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-slate-950/60 dark:ring-white/10">
                      <div className="grid grid-cols-8 gap-1">
                        {QUICK_EMOJIS.map((emoji) => (
                          <button
```

**Raw class strings detected (best effort):**

- `absolute bottom-full left-0 z-50 mb-2 w-72 rounded-2xl bg-white/90 p-3 shadow-xl ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-slate-950/60 dark:ring-white/10`
- `grid grid-cols-8 gap-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-72` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-8` — Grid layout.
- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white/90` — Background color/surface.
  - `backdrop-blur-xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-xl` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-950/60` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1861`

```jsx
                      <div className="grid grid-cols-8 gap-1">
                        {QUICK_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
```

**Raw class strings detected (best effort):**

- `grid grid-cols-8 gap-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-8` — Grid layout.
- **Spacing:**
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1871`

```jsx
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-lg transition hover:bg-slate-100 dark:hover:bg-white/10"
                            title={`Insert ${emoji}`}
                          >
                            {emoji}
```

**Raw class strings detected (best effort):**

- `flex h-8 w-8 items-center justify-center rounded-xl text-lg transition hover:bg-slate-100 dark:hover:bg-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:hover:bg-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1878`

```jsx
                      <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-300/70">Press Esc to close.</div>
                    </div>
                  ) : null}
                </div>
```

**Raw class strings detected (best effort):**

- `mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-300/70`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300/70` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/CallInterface.jsx:1886`

```jsx
                  className="flex-1 bg-transparent px-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-400/70"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage() }}
```

**Raw class strings detected (best effort):**

- `flex-1 bg-transparent px-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-400/70`
- `Enter`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
  - `placeholder:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Spacing:**
  - `px-1` — Horizontal padding (left/right).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:placeholder:text-slate-400/70` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Enter` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/CallInterface.jsx:1895`

```jsx
className =
  "flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 active:scale-95";
title = "Send" > <Send size={16} />;
```

**Raw class strings detected (best effort):**

- `flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 active:scale-95`
- `Send`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-md` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-blue-700` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Send` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/CallInterface.jsx:1544` — “{remoteName}”

```jsx
              Call with <span className="text-slate-600 dark:text-slate-300">“{remoteName}”</span>
            </div>
            <div className="hidden truncate text-xs text-slate-500 dark:text-slate-300/80 sm:block">
              {statusMessage || 'Preparing call...'}
```

- `src/pages/CallInterface.jsx:1738` — Chat

```jsx
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300/80">Chat</h2>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-300/70">{remoteName}</p>
              </div>
              <div ref={morePopoverRef} className="relative flex items-center gap-2">
```

- `src/pages/CallInterface.jsx:1538` — Back

```jsx
            title="Back"
          >
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
```

- `src/pages/CallInterface.jsx:1693` — End call

```jsx
                title="End call"
              >
                <PhoneOff size={20} />
              </button>
```

- `src/pages/CallInterface.jsx:1753` — More

```jsx
                  title="More"
                >
                  <MoreHorizontal size={20} />
                </button>
```

- `src/pages/CallInterface.jsx:1810` — Journey Timeline

```jsx
              <JourneyTimeline title="Journey Timeline" matchId={effectiveMatchId || ''} />
            </div>

          <div ref={chatScrollRef} className="flex-1 overflow-y-auto bg-slate-50/60 p-5 space-y-6 dark:bg-black/20 scrollbar-hide">
```

- `src/pages/CallInterface.jsx:1854` — Emoji

```jsx
                    title="Emoji"
                  >
                    <Smile size={20} />
                  </button>
```

- `src/pages/CallInterface.jsx:1885` — Type here...

```jsx
                  placeholder="Type here..."
                  className="flex-1 bg-transparent px-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-400/70"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
```

- `src/pages/CallInterface.jsx:1896` — Send

```jsx
                  title="Send"
                >
                  <Send size={16} />
                </button>
```

- `src/pages/CallInterface.jsx:1534` — (element) <button>

```jsx
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-600 shadow-sm ring-1 ring-slate-200/60 transition hover:bg-white hover:text-slate-900 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
```

- `src/pages/CallInterface.jsx:1618` — (element) <button>

```jsx
                      <button
                        type="button"
                        onClick={() => ensureLocalStream().catch(() => {})}
                        disabled={isRequestingMedia}
```

- `src/pages/CallInterface.jsx:1627` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => setMediaGate(null)}
                      className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
```

- `src/pages/CallInterface.jsx:1658` — (element) <button>

```jsx
              <button
                type="button"
                onClick={() => setIsChatOpen((prev) => !prev)}
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isChatOpen ? 'bg-sky-500/90 hover:bg-sky-500' : 'bg-white/10 hover:bg-white/15'}`}
```

- `src/pages/CallInterface.jsx:1671` — (element) <button>

```jsx
              <button
                type="button"
                onClick={toggleSpeaker}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isSpeakerMuted ? 'bg-amber-500/90 hover:bg-amber-500' : 'bg-white/10 hover:bg-white/15'}`}
```

- `src/pages/CallInterface.jsx:1679` — (element) <button>

```jsx
              <button
                type="button"
                onClick={toggleMute}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isMuted ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white/10 hover:bg-white/15'}`}
```

- `src/pages/CallInterface.jsx:1689` — (element) <button>

```jsx
              <button
                type="button"
                onClick={endCall}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white transition-all hover:bg-rose-600 active:scale-95"
```

- `src/pages/CallInterface.jsx:1697` — (element) <button>

```jsx
              <button
                type="button"
                onClick={toggleCamera}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${!isCameraOn ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white/10 hover:bg-white/15'}`}
```

- `src/pages/CallInterface.jsx:1705` — (element) <button>

```jsx
              <button
                type="button"
                onClick={toggleFullscreen}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all active:scale-95${isFullscreen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
```

- `src/pages/CallInterface.jsx:1746` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen((prev) => !prev)
```

- `src/pages/CallInterface.jsx:1760` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => {
                        copyCallLink()
```

- `src/pages/CallInterface.jsx:1771` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => {
                        requestMediaPermissions()
```

- `src/pages/CallInterface.jsx:1782` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => {
                        reconnectCall()
```

- `src/pages/CallInterface.jsx:1794` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => {
                        setIsChatOpen(false)
```

- `src/pages/CallInterface.jsx:1847` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmojiOpen((prev) => !prev)
```

- `src/pages/CallInterface.jsx:1863` — (element) <button>

```jsx
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
```

- `src/pages/CallInterface.jsx:1892` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={sendChatMessage}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 active:scale-95"
```

## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line)                                                                                  | Express mount                                                 | Route definition                                             | Controller file | Handler       |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ | --------------- | ------------- |
| GET /calls/${callId} (src/pages/CallInterface.jsx:517)                                                     | /api/calls -> server/routes/callSessionRoutes.js:134          | -                                                            | -               | -             |
| POST /calls/${callId}/start (src/pages/CallInterface.jsx:539)                                              | /api/calls -> server/routes/callSessionRoutes.js:134          | -                                                            | -               | -             |
| POST /workflow/journeys (src/pages/CallInterface.jsx:541)                                                  | /api/workflow -> server/routes/workflowLifecycleRoutes.js:153 | POST /journeys (server/routes/workflowLifecycleRoutes.js:12) | -               | createJourney |
| GET /workflow/journeys/${encodeURIComponent(journey.id)}/transition (src/pages/CallInterface.jsx:547)      | /api/workflow -> server/routes/workflowLifecycleRoutes.js:153 | -                                                            | -               | -             |
| POST /users/lookup (src/pages/CallInterface.jsx:562)                                                       | /api/users -> server/routes/userRoutes.js:112                 | POST /lookup (server/routes/userRoutes.js:29)                | -               | lookupUsers   |
| GET /messages/${effectiveMatchId} (src/pages/CallInterface.jsx:573)                                        | /api/messages -> server/routes/messageRoutes.js:123           | -                                                            | -               | -             |
| GET /calls/${callId}/ice (src/pages/CallInterface.jsx:580)                                                 | /api/calls -> server/routes/callSessionRoutes.js:134          | -                                                            | -               | -             |
| POST /calls/${callId}/end (src/pages/CallInterface.jsx:1455)                                               | /api/calls -> server/routes/callSessionRoutes.js:134          | -                                                            | -               | -             |
| GET /workflow/journeys/by-match/${encodeURIComponent(effectiveMatchId)} (src/pages/CallInterface.jsx:1457) | /api/workflow -> server/routes/workflowLifecycleRoutes.js:153 | -                                                            | -               | -             |
| GET /workflow/journeys/${encodeURIComponent(journey.id)}/transition (src/pages/CallInterface.jsx:1459)     | /api/workflow -> server/routes/workflowLifecycleRoutes.js:153 | -                                                            | -               | -             |
| POST /messages/${threadId} (src/pages/CallInterface.jsx:1504)                                              | /api/messages -> server/routes/messageRoutes.js:123           | -                                                            | -               | -             |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/CallInterface.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
