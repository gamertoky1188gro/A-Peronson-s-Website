# Signup - Route `/signup`

**Access:** Public

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/auth/Signup.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/auth/Signup.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_auth_Signup.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../../lib/auth (src/pages/auth/Signup.jsx:24)
- ../../../shared/config/geo.js (src/pages/auth/Signup.jsx:25)
- ../../components/ui/RoleSelect (src/pages/auth/Signup.jsx:26)
- ../../components/ui/CountryAutocomplete (src/pages/auth/Signup.jsx:27)
- ../../components/ui/BackButton (src/pages/auth/Signup.jsx:28)

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

#### `src/pages/auth/Signup.jsx:103`

```jsx
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60">
        <div className="flex items-center justify-between">
          <div>
```
**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 flex items-center justify-center p-4`
- `w-full max-w-2xl rounded-2xl bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60`
- `flex items-center justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `p-8` — Padding (all sides).
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-[0_18px_60px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/auth/Signup.jsx:104`

```jsx
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
```
**Raw class strings detected (best effort):**

- `w-full max-w-2xl rounded-2xl bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60`
- `flex items-center justify-between`
- `text-3xl font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-8` — Padding (all sides).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-[0_18px_60px_rgba(15,23,42,0.08)]` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/auth/Signup.jsx:105`

```jsx
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">A clean, professional start for Garments and Textile sourcing teams.</p>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between`
- `text-3xl font-bold text-slate-900`
- `mt-2 text-sm text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/auth/Signup.jsx:107`

```jsx
            <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">A clean, professional start for Garments and Textile sourcing teams.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
```
**Raw class strings detected (best effort):**

- `text-3xl font-bold text-slate-900`
- `mt-2 text-sm text-slate-500`
- `hidden sm:flex items-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Responsive variants:**
  - `sm:flex` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:108`

```jsx
            <p className="mt-2 text-sm text-slate-500">A clean, professional start for Garments and Textile sourcing teams.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0A66C2]">GarTexHub</div>
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-500`
- `hidden sm:flex items-center gap-3`
- `rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0A66C2]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-blue-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Responsive variants:**
  - `sm:flex` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:110`

```jsx
          <div className="hidden sm:flex items-center gap-3">
            <div className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0A66C2]">GarTexHub</div>
            <BackButton onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none" />
          </div>
```
**Raw class strings detected (best effort):**

- `hidden sm:flex items-center gap-3`
- `rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0A66C2]`
- `text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `px-2` — Horizontal padding (left/right).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `rounded-none` — Corner radius.
- **Interaction / motion:**
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:flex` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:111`

```jsx
            <div className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0A66C2]">GarTexHub</div>
            <BackButton onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none" />
          </div>
        </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0A66C2]`
- `text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `px-2` — Horizontal padding (left/right).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-blue-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `rounded-none` — Corner radius.
- **Interaction / motion:**
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:112`

```jsx
            <BackButton onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none" />
          </div>
        </div>
        <div className="mt-3 sm:hidden">
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none`
- `mt-3 sm:hidden`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-none` — Corner radius.
- **Interaction / motion:**
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:hidden` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:115`

```jsx
        <div className="mt-3 sm:hidden">
          <BackButton onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none" />
        </div>

```
**Raw class strings detected (best effort):**

- `mt-3 sm:hidden`
- `text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-none` — Corner radius.
- **Interaction / motion:**
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `sm:hidden` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:116`

```jsx
          <BackButton onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none" />
        </div>

        <form className="mt-8 grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none`
- `mt-8 grid md:grid-cols-2 gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
  - `mt-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-none` — Corner radius.
- **Interaction / motion:**
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:119`

```jsx
        <form className="mt-8 grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
            <input className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
```
**Raw class strings detected (best effort):**

- `mt-8 grid md:grid-cols-2 gap-4`
- `block text-sm font-medium mb-1 text-slate-700`
- `w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:121`

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
            <input className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1 text-slate-700`
- `w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:122`

```jsx
            <input className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20`
- `block text-sm font-medium mb-1 text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:125`

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
            <input type="email" className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
          </div>
          <div>
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1 text-slate-700`
- `w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:126`

```jsx
            <input type="email" className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20`
- `block text-sm font-medium mb-1 text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:129`

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
            <div className="flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
              <input
                type={passwordVisible ? 'text' : 'password'}
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1 text-slate-700`
- `flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20`
- `text`
- `password`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `focus-within:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus-within:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `text` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `password` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:130`

```jsx
            <div className="flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="w-full bg-transparent outline-none"
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20`
- `text`
- `password`
- `w-full bg-transparent outline-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus-within:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus-within:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `text` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `password` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:133`

```jsx
                className="w-full bg-transparent outline-none"
                value={form.password}
                onChange={(e) => onChange('password', e.target.value)}
                required
```
**Raw class strings detected (best effort):**

- `w-full bg-transparent outline-none`
- `password`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `password` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:141`

```jsx
                className="text-xs font-semibold text-slate-500"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-500`
- `Hide`
- `Show`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Other:**
  - `Hide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Show` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:148`

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Confirm Password</label>
            <div className="flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
              <input
                type={confirmVisible ? 'text' : 'password'}
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1 text-slate-700`
- `flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20`
- `text`
- `password`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `focus-within:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus-within:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `text` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `password` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:149`

```jsx
            <div className="flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
              <input
                type={confirmVisible ? 'text' : 'password'}
                className="w-full bg-transparent outline-none"
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20`
- `text`
- `password`
- `w-full bg-transparent outline-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `focus-within:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus-within:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `text` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `password` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:152`

```jsx
                className="w-full bg-transparent outline-none"
                value={form.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                required
```
**Raw class strings detected (best effort):**

- `w-full bg-transparent outline-none`
- `confirmPassword`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `confirmPassword` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:160`

```jsx
                className="text-xs font-semibold text-slate-500"
              >
                {confirmVisible ? 'Hide' : 'Show'}
              </button>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-500`
- `Hide`
- `Show`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Other:**
  - `Hide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Show` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:166`

```jsx
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-slate-700">Account Type</label>
            <RoleSelect
              value={form.primaryRole}
```
**Raw class strings detected (best effort):**

- `md:col-span-2`
- `block text-sm font-medium mb-2 text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:167`

```jsx
            <label className="block text-sm font-medium mb-2 text-slate-700">Account Type</label>
            <RoleSelect
              value={form.primaryRole}
              onChange={(v) => onChange('primaryRole', v)}
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-2 text-slate-700`
- `primaryRole`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `primaryRole` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:179`

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Country</label>
            <CountryAutocomplete
              value={form.country}
              onChange={(v) => onChange('country', v)}
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1 text-slate-700`
- `country`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `country` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:189`

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Organization Name</label>
            <input className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
          </div>
          {/* API error state (e.g. email already used). */}
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1 text-slate-700`
- `w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:190`

```jsx
            <input className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
          </div>
          {/* API error state (e.g. email already used). */}
          {error ? <p className="md:col-span-2 text-sm text-red-500">{error}</p> : null}
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20`
- `md:col-span-2 text-sm text-red-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-red-500` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `focus:outline-none` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-2` — Variant prefix (responsive, dark, or interaction state).
  - `focus:ring-[#0A66C2]/20` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:193`

```jsx
          {error ? <p className="md:col-span-2 text-sm text-red-500">{error}</p> : null}

          {/* Footer actions: primary submit + link to login. */}
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
```
**Raw class strings detected (best effort):**

- `md:col-span-2 text-sm text-red-500`
- `md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-red-500` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:196`

```jsx
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button disabled={loading} className="px-5 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
```
**Raw class strings detected (best effort):**

- `md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center`
- `px-5 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white disabled:opacity-70`
- `Creating account...`
- `Create account`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).
  - `sm:items-center` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Creating` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `account...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Create` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:197`

```jsx
            <button disabled={loading} className="px-5 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <Link
```
**Raw class strings detected (best effort):**

- `px-5 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white disabled:opacity-70`
- `Creating account...`
- `Create account`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Creating` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `account...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Create` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:202`

```jsx
              className="px-5 py-3 rounded-lg borderless-shadow text-slate-700 font-semibold hover:bg-slate-50 dark:text-white dark:bg-slate-800/60 dark:hover:bg-slate-700/50 dark:ring-1 dark:ring-white/10"
            >
              Already have an account? Login
            </Link>
```
**Raw class strings detected (best effort):**

- `px-5 py-3 rounded-lg borderless-shadow text-slate-700 font-semibold hover:bg-slate-50 dark:text-white dark:bg-slate-800/60 dark:hover:bg-slate-700/50 dark:ring-1 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-white` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-800/60` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-slate-700/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-1` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/auth/Signup.jsx:107` — Create your account

```jsx
            <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">A clean, professional start for Garments and Textile sourcing teams.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
```
- `src/pages/auth/Signup.jsx:108` — A clean, professional start for Garments and Textile sourcing teams.

```jsx
            <p className="mt-2 text-sm text-slate-500">A clean, professional start for Garments and Textile sourcing teams.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0A66C2]">GarTexHub</div>
```
- `src/pages/auth/Signup.jsx:121` — Full Name

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
            <input className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
```
- `src/pages/auth/Signup.jsx:125` — Email

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
            <input type="email" className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
          </div>
          <div>
```
- `src/pages/auth/Signup.jsx:129` — Password

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
            <div className="flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
              <input
                type={passwordVisible ? 'text' : 'password'}
```
- `src/pages/auth/Signup.jsx:148` — Confirm Password

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Confirm Password</label>
            <div className="flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
              <input
                type={confirmVisible ? 'text' : 'password'}
```
- `src/pages/auth/Signup.jsx:167` — Account Type

```jsx
            <label className="block text-sm font-medium mb-2 text-slate-700">Account Type</label>
            <RoleSelect
              value={form.primaryRole}
              onChange={(v) => onChange('primaryRole', v)}
```
- `src/pages/auth/Signup.jsx:179` — Country

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Country</label>
            <CountryAutocomplete
              value={form.country}
              onChange={(v) => onChange('country', v)}
```
- `src/pages/auth/Signup.jsx:189` — Organization Name

```jsx
            <label className="block text-sm font-medium mb-1 text-slate-700">Organization Name</label>
            <input className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
          </div>
          {/* API error state (e.g. email already used). */}
```
- `src/pages/auth/Signup.jsx:184` — Type to search countries

```jsx
              placeholder="Type to search countries"
              required
            />
          </div>
```
- `src/pages/auth/Signup.jsx:138` — (element) <button>

```jsx
              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="text-xs font-semibold text-slate-500"
```
- `src/pages/auth/Signup.jsx:157` — (element) <button>

```jsx
              <button
                type="button"
                onClick={() => setConfirmVisible((prev) => !prev)}
                className="text-xs font-semibold text-slate-500"
```
- `src/pages/auth/Signup.jsx:197` — (element) <button>

```jsx
            <button disabled={loading} className="px-5 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <Link
```
- `src/pages/auth/Signup.jsx:200` — (element) <Link>

```jsx
            <Link
              to="/login"
              className="px-5 py-3 rounded-lg borderless-shadow text-slate-700 font-semibold hover:bg-slate-50 dark:text-white dark:bg-slate-800/60 dark:hover:bg-slate-700/50 dark:ring-1 dark:ring-white/10"
            >
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /auth/register (src/pages/auth/Signup.jsx:16) | /api/auth -> server/routes/authRoutes.js:111 | - | - | - |
| POST /auth/register (src/pages/auth/Signup.jsx:89) | /api/auth -> server/routes/authRoutes.js:111 | POST /register (server/routes/authRoutes.js:18) | - | register |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/auth/Signup.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

