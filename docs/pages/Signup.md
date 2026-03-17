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

#### `src/pages/auth/Signup.jsx:76`

```jsx
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card flex items-center justify-center p-4">
      {/* Wider card because signup has more fields than login. */}
      <div className="w-full max-w-2xl bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Create account</h1>
```
**Raw class strings detected (best effort):**

- `min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card flex items-center justify-center p-4`
- `w-full max-w-2xl bg-white neo-panel cyberpunk-card rounded-xl p-8`
- `text-3xl font-bold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `p-8` — Padding (all sides).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Other:**
  - `neo-page` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `cyberpunk-page` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `neo-panel` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `cyberpunk-card` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:78`

```jsx
      <div className="w-full max-w-2xl bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-gray-600">3-step onboarding starts after signup: profile image, organization name, category selection.</p>

```
**Raw class strings detected (best effort):**

- `w-full max-w-2xl bg-white neo-panel cyberpunk-card rounded-xl p-8`
- `text-3xl font-bold`
- `mt-2 text-sm text-gray-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-2xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-8` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-gray-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Other:**
  - `neo-panel` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `cyberpunk-card` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:79`

```jsx
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-gray-600">3-step onboarding starts after signup: profile image, organization name, category selection.</p>

        {/* Responsive 2-column form on desktop; stacks on mobile. */}
```
**Raw class strings detected (best effort):**

- `text-3xl font-bold`
- `mt-2 text-sm text-gray-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-gray-600` — Text color or text sizing.

#### `src/pages/auth/Signup.jsx:80`

```jsx
        <p className="mt-2 text-sm text-gray-600">3-step onboarding starts after signup: profile image, organization name, category selection.</p>

        {/* Responsive 2-column form on desktop; stacks on mobile. */}
        <form className="mt-6 grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-gray-600`
- `mt-6 grid md:grid-cols-2 gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-gray-600` — Text color or text sizing.
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:83`

```jsx
        <form className="mt-6 grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
```
**Raw class strings detected (best effort):**

- `mt-6 grid md:grid-cols-2 gap-4`
- `block text-sm font-medium mb-1`
- `w-full px-4 py-3 border rounded-lg`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:85`

```jsx
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1`
- `w-full px-4 py-3 border rounded-lg`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:86`

```jsx
            <input className="w-full px-4 py-3 border rounded-lg" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 border rounded-lg`
- `block text-sm font-medium mb-1`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:89`

```jsx
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-4 py-3 border rounded-lg" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
          </div>
          <div>
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1`
- `w-full px-4 py-3 border rounded-lg`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:90`

```jsx
            <input type="email" className="w-full px-4 py-3 border rounded-lg" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 border rounded-lg`
- `block text-sm font-medium mb-1`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:93`

```jsx
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full px-4 py-3 border rounded-lg" value={form.password} onChange={(e) => onChange('password', e.target.value)} required />
          </div>
          <div>
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1`
- `w-full px-4 py-3 border rounded-lg`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:94`

```jsx
            <input type="password" className="w-full px-4 py-3 border rounded-lg" value={form.password} onChange={(e) => onChange('password', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 border rounded-lg`
- `block text-sm font-medium mb-1`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:97`

```jsx
            <label className="block text-sm font-medium mb-1">Account Type</label>
            {/* Choosing a role affects what documents are required later in Verification Center. */}
            <select className="w-full px-4 py-3 border rounded-lg" value={form.role} onChange={(e) => onChange('role', e.target.value)}>
              <option value="buyer">Buyer</option>
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1`
- `w-full px-4 py-3 border rounded-lg`
- `buyer`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Other:**
  - `buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:99`

```jsx
            <select className="w-full px-4 py-3 border rounded-lg" value={form.role} onChange={(e) => onChange('role', e.target.value)}>
              <option value="buyer">Buyer</option>
              <option value="factory">Factory</option>
              <option value="buying_house">Buying House</option>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 border rounded-lg`
- `buyer`
- `factory`
- `buying_house`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Other:**
  - `buyer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `factory` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `buying_house` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:106`

```jsx
            <label className="block text-sm font-medium mb-1">Country</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.country} onChange={(e) => onChange('country', e.target.value)} required />
          </div>
          <div>
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1`
- `w-full px-4 py-3 border rounded-lg`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:107`

```jsx
            <input className="w-full px-4 py-3 border rounded-lg" value={form.country} onChange={(e) => onChange('country', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Organization Name</label>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 border rounded-lg`
- `block text-sm font-medium mb-1`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:110`

```jsx
            <label className="block text-sm font-medium mb-1">Organization Name</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
          </div>

```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1`
- `w-full px-4 py-3 border rounded-lg`

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
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:111`

```jsx
            <input className="w-full px-4 py-3 border rounded-lg" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
          </div>

          {/* Info panel: sets expectations (verification happens post-signup). */}
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 border rounded-lg`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Signup.jsx:115`

```jsx
          <div className="md:col-span-2 bg-gray-50 neo-panel cyberpunk-card border rounded-lg p-3 text-sm text-gray-700">
            <p><strong>Verification happens after signup.</strong> Create your account first, then upload role and region-specific documents in Verification Center.</p>
            <p className="mt-2">
              Need the full checklist?
```
**Raw class strings detected (best effort):**

- `md:col-span-2 bg-gray-50 neo-panel cyberpunk-card border rounded-lg p-3 text-sm text-gray-700`
- `mt-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-gray-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-gray-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `neo-panel` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `cyberpunk-card` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:117`

```jsx
            <p className="mt-2">
              Need the full checklist?
              {' '}
              <Link to="/verification" className="text-indigo-700 underline">Go to Verification Center</Link>
```
**Raw class strings detected (best effort):**

- `mt-2`
- ` `
- `text-indigo-700 underline`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:120`

```jsx
              <Link to="/verification" className="text-indigo-700 underline">Go to Verification Center</Link>
              {' '}
              or
              {' '}
```
**Raw class strings detected (best effort):**

- `text-indigo-700 underline`
- ` `

**Utility breakdown (grouped):**

- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:124`

```jsx
              <Link to="/help" className="text-indigo-700 underline">read Help Center guidance</Link>.
            </p>
          </div>

```
**Raw class strings detected (best effort):**

- `text-indigo-700 underline`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:129`

```jsx
          {error ? <p className="md:col-span-2 text-sm text-red-500">{error}</p> : null}

          {/* Footer actions: primary submit + link to login. */}
          <div className="md:col-span-2 flex gap-3">
```
**Raw class strings detected (best effort):**

- `md:col-span-2 text-sm text-red-500`
- `md:col-span-2 flex gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-red-500` — Text color or text sizing.
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Signup.jsx:132`

```jsx
          <div className="md:col-span-2 flex gap-3">
            <button disabled={loading} className="px-5 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
```
**Raw class strings detected (best effort):**

- `md:col-span-2 flex gap-3`
- `px-5 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70`
- `Creating account...`
- `Create account`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Creating` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `account...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Create` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:133`

```jsx
            <button disabled={loading} className="px-5 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <Link to="/login" className="px-5 py-3 rounded-lg border">Have an account? Login</Link>
```
**Raw class strings detected (best effort):**

- `px-5 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70`
- `Creating account...`
- `Create account`
- `px-5 py-3 rounded-lg border`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `border` — Border style/width/color.
- **Interaction / motion:**
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Creating` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `account...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Create` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `account` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Signup.jsx:136`

```jsx
            <Link to="/login" className="px-5 py-3 rounded-lg border">Have an account? Login</Link>
          </div>
        </form>
      </div>
```
**Raw class strings detected (best effort):**

- `px-5 py-3 rounded-lg border`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-5` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `border` — Border style/width/color.

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/auth/Signup.jsx:79` — Create account

```jsx
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-gray-600">3-step onboarding starts after signup: profile image, organization name, category selection.</p>

        {/* Responsive 2-column form on desktop; stacks on mobile. */}
```
- `src/pages/auth/Signup.jsx:80` — 3-step onboarding starts after signup: profile image, organization name, category selection.

```jsx
        <p className="mt-2 text-sm text-gray-600">3-step onboarding starts after signup: profile image, organization name, category selection.</p>

        {/* Responsive 2-column form on desktop; stacks on mobile. */}
        <form className="mt-6 grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
```
- `src/pages/auth/Signup.jsx:85` — Full Name

```jsx
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
```
- `src/pages/auth/Signup.jsx:89` — Email

```jsx
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-4 py-3 border rounded-lg" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
          </div>
          <div>
```
- `src/pages/auth/Signup.jsx:93` — Password

```jsx
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full px-4 py-3 border rounded-lg" value={form.password} onChange={(e) => onChange('password', e.target.value)} required />
          </div>
          <div>
```
- `src/pages/auth/Signup.jsx:97` — Account Type

```jsx
            <label className="block text-sm font-medium mb-1">Account Type</label>
            {/* Choosing a role affects what documents are required later in Verification Center. */}
            <select className="w-full px-4 py-3 border rounded-lg" value={form.role} onChange={(e) => onChange('role', e.target.value)}>
              <option value="buyer">Buyer</option>
```
- `src/pages/auth/Signup.jsx:106` — Country

```jsx
            <label className="block text-sm font-medium mb-1">Country</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.country} onChange={(e) => onChange('country', e.target.value)} required />
          </div>
          <div>
```
- `src/pages/auth/Signup.jsx:110` — Organization Name

```jsx
            <label className="block text-sm font-medium mb-1">Organization Name</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
          </div>

```
- `src/pages/auth/Signup.jsx:120` — Go to Verification Center

```jsx
              <Link to="/verification" className="text-indigo-700 underline">Go to Verification Center</Link>
              {' '}
              or
              {' '}
```
- `src/pages/auth/Signup.jsx:124` — read Help Center guidance

```jsx
              <Link to="/help" className="text-indigo-700 underline">read Help Center guidance</Link>.
            </p>
          </div>

```
- `src/pages/auth/Signup.jsx:136` — Have an account? Login

```jsx
            <Link to="/login" className="px-5 py-3 rounded-lg border">Have an account? Login</Link>
          </div>
        </form>
      </div>
```
- `src/pages/auth/Signup.jsx:120` — (element) <Link>

```jsx
              <Link to="/verification" className="text-indigo-700 underline">Go to Verification Center</Link>
              {' '}
              or
              {' '}
```
- `src/pages/auth/Signup.jsx:124` — (element) <Link>

```jsx
              <Link to="/help" className="text-indigo-700 underline">read Help Center guidance</Link>.
            </p>
          </div>

```
- `src/pages/auth/Signup.jsx:133` — (element) <button>

```jsx
            <button disabled={loading} className="px-5 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <Link to="/login" className="px-5 py-3 rounded-lg border">Have an account? Login</Link>
```
- `src/pages/auth/Signup.jsx:136` — (element) <Link>

```jsx
            <Link to="/login" className="px-5 py-3 rounded-lg border">Have an account? Login</Link>
          </div>
        </form>
      </div>
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /auth/register (src/pages/auth/Signup.jsx:16) | /api/auth -> server/routes/authRoutes.js:59 | - | - | - |
| POST /auth/register (src/pages/auth/Signup.jsx:62) | /api/auth -> server/routes/authRoutes.js:59 | POST /register (server/routes/authRoutes.js:7) | server/controllers/authController.js | register |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/auth/Signup.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

