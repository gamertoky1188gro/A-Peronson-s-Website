# VerificationCenter - Route `/verification-center`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

> Alias: `/verification-center` renders the same component as `/verification`.

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/VerificationPage.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/VerificationPage.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_VerificationPage.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/VerificationPage.jsx:26)
- ../../shared/config/geo.js (src/pages/VerificationPage.jsx:27)

### 2.2 Structural section tags in JSX

- `header` at `src/pages/VerificationPage.jsx:248`

```jsx
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-2">Need help? Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
```
- `section` at `src/pages/VerificationPage.jsx:254`

```jsx
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:col-span-2 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
```
- `aside` at `src/pages/VerificationPage.jsx:350`

```jsx
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <p className="text-sm font-bold text-slate-900">Credibility</p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
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

#### `src/pages/VerificationPage.jsx:247`

```jsx
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
```
**Raw class strings detected (best effort):**

- `mx-auto max-w-6xl px-4 py-6 space-y-6`
- `rounded-2xl border border-slate-200 bg-white p-5`
- `text-2xl font-bold`
- `text-sm text-slate-600 mt-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-6xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-6` — Vertical padding (top/bottom).
  - `space-y-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-5` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:248`

```jsx
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-2">Need help? Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-5`
- `text-2xl font-bold`
- `text-sm text-slate-600 mt-1`
- `text-xs text-slate-500 mt-2`
- `underline text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:249`

```jsx
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-2">Need help? Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
      </header>
```
**Raw class strings detected (best effort):**

- `text-2xl font-bold`
- `text-sm text-slate-600 mt-1`
- `text-xs text-slate-500 mt-2`
- `underline text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:250`

```jsx
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-2">Need help? Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
      </header>

```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600 mt-1`
- `text-xs text-slate-500 mt-2`
- `underline text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:251`

```jsx
        <p className="text-xs text-slate-500 mt-2">Need help? Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500 mt-2`
- `underline text-slate-700`
- `grid gap-4 md:grid-cols-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `md:grid-cols-3` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:254`

```jsx
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:col-span-2 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
```
**Raw class strings detected (best effort):**

- `grid gap-4 md:grid-cols-3`
- `rounded-2xl border border-slate-200 bg-white p-5 md:col-span-2 space-y-4`
- `flex items-start justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-5` — Padding (all sides).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:grid-cols-3` — Variant prefix (responsive, dark, or interaction state).
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:255`

```jsx
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:col-span-2 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Your requirements</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-5 md:col-span-2 space-y-4`
- `flex items-start justify-between gap-3`
- `text-sm font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:256`

```jsx
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Your requirements</p>
              <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
```
**Raw class strings detected (best effort):**

- `flex items-start justify-between gap-3`
- `text-sm font-bold text-slate-900`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:258`

```jsx
              <p className="text-sm font-bold text-slate-900">Your requirements</p>
              <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
            </div>
            <div className={`rounded-full border px-3 py-1 text-xs font-bold ${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `text-[11px] text-slate-500`
- `bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20`
- `bg-slate-50 text-slate-700 border-slate-200`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-[#0A66C2]/10` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `border-[#0A66C2]/20` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:259`

```jsx
              <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
            </div>
            <div className={`rounded-full border px-3 py-1 text-xs font-bold ${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
              {verified ? 'Verified' : 'Not verified'}
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20`
- `bg-slate-50 text-slate-700 border-slate-200`
- `Verified`
- `Not verified`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-[#0A66C2]/10` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `border-[#0A66C2]/20` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Other:**
  - `Verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Not` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:261`

```jsx
            <div className={`rounded-full border px-3 py-1 text-xs font-bold ${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
              {verified ? 'Verified' : 'Not verified'}
            </div>
          </div>
```
**Raw class strings detected (best effort):**

- `bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20`
- `bg-slate-50 text-slate-700 border-slate-200`
- `Verified`
- `Not verified`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]/10` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `border-[#0A66C2]/20` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Other:**
  - `Verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Not` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:267`

```jsx
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="buyer-country">Buyer Country</label>
                <select
```
**Raw class strings detected (best effort):**

- `rounded-xl border border-slate-200 bg-slate-50 p-4`
- `flex flex-wrap items-center gap-2`
- `text-sm font-semibold text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:268`

```jsx
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="buyer-country">Buyer Country</label>
                <select
                  id="buyer-country"
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center gap-2`
- `text-sm font-semibold text-slate-700`
- `buyer-country`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `buyer-country` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:269`

```jsx
                <label className="text-sm font-semibold text-slate-700" htmlFor="buyer-country">Buyer Country</label>
                <select
                  id="buyer-country"
                  value={buyerCountry}
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-700`
- `buyer-country`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `buyer-country` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:274`

```jsx
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="">Select country</option>
                  {BUYER_COUNTRY_OPTIONS.map((country) => <option key={country} value={country}>{country}</option>)}
```
**Raw class strings detected (best effort):**

- `text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
  - `rounded-xl` — Corner radius.

#### `src/pages/VerificationPage.jsx:279`

```jsx
                {savingCountry ? <span className="text-xs text-slate-500">Saving…</span> : null}
                <span className="text-xs text-slate-600">Region: <span className="font-semibold">{buyerRegion}</span></span>
              </div>
              {!buyerCountry ? <p className="mt-2 text-xs text-rose-700">Buyer country is required before completing buyer verification.</p> : null}
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`
- `text-xs text-slate-600`
- `font-semibold`
- `mt-2 text-xs text-rose-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-700` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:280`

```jsx
                <span className="text-xs text-slate-600">Region: <span className="font-semibold">{buyerRegion}</span></span>
              </div>
              {!buyerCountry ? <p className="mt-2 text-xs text-rose-700">Buyer country is required before completing buyer verification.</p> : null}
            </div>
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-600`
- `font-semibold`
- `mt-2 text-xs text-rose-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-700` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:282`

```jsx
              {!buyerCountry ? <p className="mt-2 text-xs text-rose-700">Buyer country is required before completing buyer verification.</p> : null}
            </div>
          ) : null}

```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-rose-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-rose-700` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:286`

```jsx
          <div className="grid gap-3 md:grid-cols-2">
            {requiredDocs.map((documentKey) => {
              const submitted = Boolean(documents?.[documentKey])
              const status = submitted ? 'submitted' : 'missing'
```
**Raw class strings detected (best effort):**

- `grid gap-3 md:grid-cols-2`
- `submitted`
- `missing`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `md:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `submitted` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `missing` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:291`

```jsx
                <div key={documentKey} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{LABELS[documentKey] || documentKey}</p>
                    <p className="text-[11px] text-slate-500 truncate">{submitted ? 'Submitted' : 'Missing'}</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-3`
- `min-w-0`
- `text-sm font-semibold text-slate-900 truncate`
- `text-[11px] text-slate-500 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:292`

```jsx
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{LABELS[documentKey] || documentKey}</p>
                    <p className="text-[11px] text-slate-500 truncate">{submitted ? 'Submitted' : 'Missing'}</p>
                  </div>
```
**Raw class strings detected (best effort):**

- `min-w-0`
- `text-sm font-semibold text-slate-900 truncate`
- `text-[11px] text-slate-500 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:293`

```jsx
                    <p className="text-sm font-semibold text-slate-900 truncate">{LABELS[documentKey] || documentKey}</p>
                    <p className="text-[11px] text-slate-500 truncate">{submitted ? 'Submitted' : 'Missing'}</p>
                  </div>
                  <div className="flex items-center gap-2">
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 truncate`
- `text-[11px] text-slate-500 truncate`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:294`

```jsx
                    <p className="text-[11px] text-slate-500 truncate">{submitted ? 'Submitted' : 'Missing'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusChipClass(status)}`}>{status}</span>
```
**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500 truncate`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:296`

```jsx
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusChipClass(status)}`}>{status}</span>
                    <button
                      type="button"
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:297`

```jsx
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusChipClass(status)}`}>{status}</span>
                    <button
                      type="button"
                      onClick={() => openPicker(documentKey)}
```
**Raw class strings detected (best effort):**

- `button`

**Utility breakdown (grouped):**

- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:302`

```jsx
                      className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {busyDoc === documentKey ? 'Uploading…' : 'Upload'}
                    </button>
```
**Raw class strings detected (best effort):**

- `rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed`
- `Uploading…`
- `Upload`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:cursor-not-allowed` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Uploading…` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Upload` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:312`

```jsx
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-900">Optional licenses</p>
            <p className="mt-1 text-[11px] text-slate-500">Optional proofs can be added anytime. More proof = more trust.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-slate-50 p-4`
- `text-sm font-bold text-slate-900`
- `mt-1 text-[11px] text-slate-500`
- `mt-3 flex flex-col sm:flex-row gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:313`

```jsx
            <p className="text-sm font-bold text-slate-900">Optional licenses</p>
            <p className="mt-1 text-[11px] text-slate-500">Optional proofs can be added anytime. More proof = more trust.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-1 text-[11px] text-slate-500`
- `mt-3 flex flex-col sm:flex-row gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:314`

```jsx
            <p className="mt-1 text-[11px] text-slate-500">Optional proofs can be added anytime. More proof = more trust.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                value={optionalLicenseInput}
```
**Raw class strings detected (best effort):**

- `mt-1 text-[11px] text-slate-500`
- `mt-3 flex flex-col sm:flex-row gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:315`

```jsx
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                value={optionalLicenseInput}
                onChange={(e) => setOptionalLicenseInput(e.target.value)}
```
**Raw class strings detected (best effort):**

- `mt-3 flex flex-col sm:flex-row gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:320`

```jsx
                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"
              />
              <button
                type="button"
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:325`

```jsx
                className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
              >
                Add
              </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:330`

```jsx
            <div className="mt-3 flex flex-wrap gap-2">
              {optionalLicenses.map((lic) => (
                <button
                  key={lic}
```
**Raw class strings detected (best effort):**

- `mt-3 flex flex-wrap gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:336`

```jsx
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50"
                  title="Remove"
                >
                  {lic} ✕
```
**Raw class strings detected (best effort):**

- `rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50`
- `Remove`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1.5` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-rose-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Remove` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:342`

```jsx
              {!optionalLicenses.length ? <p className="text-xs text-slate-500">No optional licenses yet.</p> : null}
            </div>
          </div>

```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:346`

```jsx
          {feedback ? <div className="text-sm text-emerald-700">{feedback}</div> : null}
          {error ? <div className="text-sm text-rose-700">{error}</div> : null}
        </div>

```
**Raw class strings detected (best effort):**

- `text-sm text-emerald-700`
- `text-sm text-rose-700`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-emerald-700` — Text color or text sizing.
  - `text-rose-700` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:347`

```jsx
          {error ? <div className="text-sm text-rose-700">{error}</div> : null}
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
```
**Raw class strings detected (best effort):**

- `text-sm text-rose-700`
- `rounded-2xl border border-slate-200 bg-white p-5 space-y-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-5` — Padding (all sides).
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:350`

```jsx
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <p className="text-sm font-bold text-slate-900">Credibility</p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-white p-5 space-y-3`
- `text-sm font-bold text-slate-900`
- `rounded-2xl border border-slate-200 bg-slate-50 p-4`
- `text-3xl font-extrabold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-5` — Padding (all sides).
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:351`

```jsx
          <p className="text-sm font-bold text-slate-900">Credibility</p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{credibilityBadge}</p>
```
**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `rounded-2xl border border-slate-200 bg-slate-50 p-4`
- `text-3xl font-extrabold text-slate-900`
- `mt-1 text-sm font-semibold text-slate-800`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:352`

```jsx
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{credibilityBadge}</p>
            <p className="mt-2 text-xs text-slate-600">More licensing proof increases credibility and international trust.</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-slate-50 p-4`
- `text-3xl font-extrabold text-slate-900`
- `mt-1 text-sm font-semibold text-slate-800`
- `mt-2 text-xs text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:353`

```jsx
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{credibilityBadge}</p>
            <p className="mt-2 text-xs text-slate-600">More licensing proof increases credibility and international trust.</p>
          </div>
```
**Raw class strings detected (best effort):**

- `text-3xl font-extrabold text-slate-900`
- `mt-1 text-sm font-semibold text-slate-800`
- `mt-2 text-xs text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:354`

```jsx
            <p className="mt-1 text-sm font-semibold text-slate-800">{credibilityBadge}</p>
            <p className="mt-2 text-xs text-slate-600">More licensing proof increases credibility and international trust.</p>
          </div>

```
**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-800`
- `mt-2 text-xs text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:355`

```jsx
            <p className="mt-2 text-xs text-slate-600">More licensing proof increases credibility and international trust.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
```
**Raw class strings detected (best effort):**

- `mt-2 text-xs text-slate-600`
- `rounded-2xl border border-slate-200 bg-slate-50 p-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:358`

```jsx
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Subscription</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{subscription?.plan || subscription?.status || '—'}</p>
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active subscription.</p>
```
**Raw class strings detected (best effort):**

- `rounded-2xl border border-slate-200 bg-slate-50 p-4`
- `text-xs text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `mt-1 text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:359`

```jsx
            <p className="text-xs text-slate-500">Subscription</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{subscription?.plan || subscription?.status || '—'}</p>
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active subscription.</p>
          </div>
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `mt-1 text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:360`

```jsx
            <p className="mt-1 text-sm font-semibold text-slate-900">{subscription?.plan || subscription?.status || '—'}</p>
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active subscription.</p>
          </div>

```
**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `mt-1 text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:361`

```jsx
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active subscription.</p>
          </div>

          <button
```
**Raw class strings detected (best effort):**

- `mt-1 text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:367`

```jsx
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Refresh status
          </button>
```
**Raw class strings detected (best effort):**

- `w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-200` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:374`

```jsx
      <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelected} />
    </div>
  )
}
```
**Raw class strings detected (best effort):**

- `hidden`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/VerificationPage.jsx:249` — Verification Center

```jsx
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-2">Need help? Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
      </header>
```
- `src/pages/VerificationPage.jsx:250` — Verification is subscription-based and renews monthly.

```jsx
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-2">Need help? Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
      </header>

```
- `src/pages/VerificationPage.jsx:258` — Your requirements

```jsx
              <p className="text-sm font-bold text-slate-900">Your requirements</p>
              <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
            </div>
            <div className={`rounded-full border px-3 py-1 text-xs font-bold ${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
```
- `src/pages/VerificationPage.jsx:259` — Role-based checklist. Uploading more proof increases credibility.

```jsx
              <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
            </div>
            <div className={`rounded-full border px-3 py-1 text-xs font-bold ${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
              {verified ? 'Verified' : 'Not verified'}
```
- `src/pages/VerificationPage.jsx:269` — Buyer Country

```jsx
                <label className="text-sm font-semibold text-slate-700" htmlFor="buyer-country">Buyer Country</label>
                <select
                  id="buyer-country"
                  value={buyerCountry}
```
- `src/pages/VerificationPage.jsx:279` — Saving…

```jsx
                {savingCountry ? <span className="text-xs text-slate-500">Saving…</span> : null}
                <span className="text-xs text-slate-600">Region: <span className="font-semibold">{buyerRegion}</span></span>
              </div>
              {!buyerCountry ? <p className="mt-2 text-xs text-rose-700">Buyer country is required before completing buyer verification.</p> : null}
```
- `src/pages/VerificationPage.jsx:282` — Buyer country is required before completing buyer verification.

```jsx
              {!buyerCountry ? <p className="mt-2 text-xs text-rose-700">Buyer country is required before completing buyer verification.</p> : null}
            </div>
          ) : null}

```
- `src/pages/VerificationPage.jsx:313` — Optional licenses

```jsx
            <p className="text-sm font-bold text-slate-900">Optional licenses</p>
            <p className="mt-1 text-[11px] text-slate-500">Optional proofs can be added anytime. More proof = more trust.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
```
- `src/pages/VerificationPage.jsx:314` — Optional proofs can be added anytime. More proof = more trust.

```jsx
            <p className="mt-1 text-[11px] text-slate-500">Optional proofs can be added anytime. More proof = more trust.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                value={optionalLicenseInput}
```
- `src/pages/VerificationPage.jsx:342` — No optional licenses yet.

```jsx
              {!optionalLicenses.length ? <p className="text-xs text-slate-500">No optional licenses yet.</p> : null}
            </div>
          </div>

```
- `src/pages/VerificationPage.jsx:351` — Credibility

```jsx
          <p className="text-sm font-bold text-slate-900">Credibility</p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{credibilityBadge}</p>
```
- `src/pages/VerificationPage.jsx:355` — More licensing proof increases credibility and international trust.

```jsx
            <p className="mt-2 text-xs text-slate-600">More licensing proof increases credibility and international trust.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
```
- `src/pages/VerificationPage.jsx:359` — Subscription

```jsx
            <p className="text-xs text-slate-500">Subscription</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{subscription?.plan || subscription?.status || '—'}</p>
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active subscription.</p>
          </div>
```
- `src/pages/VerificationPage.jsx:361` — Verification approval requires an active subscription.

```jsx
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active subscription.</p>
          </div>

          <button
```
- `src/pages/VerificationPage.jsx:319` — e.g. OEKO-TEX, BSCI, WRAP…

```jsx
                placeholder="e.g. OEKO-TEX, BSCI, WRAP…"
                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"
              />
              <button
```
- `src/pages/VerificationPage.jsx:337` — Remove

```jsx
                  title="Remove"
                >
                  {lic} ✕
                </button>
```
- `src/pages/VerificationPage.jsx:298` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => openPicker(documentKey)}
                      disabled={busyDoc === documentKey || (role === 'buyer' && !buyerCountry)}
```
- `src/pages/VerificationPage.jsx:322` — (element) <button>

```jsx
              <button
                type="button"
                onClick={addOptionalLicense}
                className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
```
- `src/pages/VerificationPage.jsx:332` — (element) <button>

```jsx
                <button
                  key={lic}
                  type="button"
                  onClick={() => removeOptionalLicense(lic)}
```
- `src/pages/VerificationPage.jsx:364` — (element) <button>

```jsx
          <button
            type="button"
            onClick={loadStatus}
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /verification/me (src/pages/VerificationPage.jsx:110) | /api/verification -> server/routes/verificationRoutes.js:63 | GET /me (server/routes/verificationRoutes.js:7) | server/controllers/verificationController.js | getMyVerification |
| GET /subscriptions/me (src/pages/VerificationPage.jsx:111) | /api/subscriptions -> server/routes/subscriptionRoutes.js:64 | GET /me (server/routes/subscriptionRoutes.js:7) | server/controllers/subscriptionController.js | getMySubscription |
| POST /verification/me (src/pages/VerificationPage.jsx:142) | /api/verification -> server/routes/verificationRoutes.js:63 | POST /me (server/routes/verificationRoutes.js:8) | server/controllers/verificationController.js | submitMyVerification |
| POST /verification/me (src/pages/VerificationPage.jsx:181) | /api/verification -> server/routes/verificationRoutes.js:63 | POST /me (server/routes/verificationRoutes.js:8) | server/controllers/verificationController.js | submitMyVerification |
| POST /verification/me (src/pages/VerificationPage.jsx:216) | /api/verification -> server/routes/verificationRoutes.js:63 | POST /me (server/routes/verificationRoutes.js:8) | server/controllers/verificationController.js | submitMyVerification |
| POST /verification/me (src/pages/VerificationPage.jsx:234) | /api/verification -> server/routes/verificationRoutes.js:63 | POST /me (server/routes/verificationRoutes.js:8) | server/controllers/verificationController.js | submitMyVerification |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/VerificationPage.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

