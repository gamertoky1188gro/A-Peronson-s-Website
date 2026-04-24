# VerificationPage - Route `/verification`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

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

- `header` at `src/pages/VerificationPage.jsx:265`

```jsx
      <header className="rounded-2xl borderless-shadow bg-white p-5">
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-1">First month: $1.99 â€¢ Renewals: $6.99/month</p>
```

- `section` at `src/pages/VerificationPage.jsx:273`

```jsx
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl borderless-shadow bg-white p-5 md:col-span-2 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
```

- `aside` at `src/pages/VerificationPage.jsx:369`

```jsx
        <aside className="rounded-2xl borderless-shadow bg-white p-5 space-y-3">
          <p className="text-sm font-bold text-slate-900">Credibility</p>
          <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
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

#### `src/pages/VerificationPage.jsx:264`

```jsx
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="rounded-2xl borderless-shadow bg-white p-5">
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
```

**Raw class strings detected (best effort):**

- `mx-auto max-w-6xl px-4 py-6 space-y-6`
- `rounded-2xl borderless-shadow bg-white p-5`
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
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:265`

```jsx
      <header className="rounded-2xl borderless-shadow bg-white p-5">
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-1">First month: $1.99 â€¢ Renewals: $6.99/month</p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-5`
- `text-2xl font-bold`
- `text-sm text-slate-600 mt-1`
- `text-xs text-slate-500 mt-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:266`

```jsx
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-1">First month: $1.99 â€¢ Renewals: $6.99/month</p>
        <p className="text-xs text-slate-500 mt-2">Review status: <span className="font-semibold">{reviewStatus}</span>{reviewReason ? ` â€¢ ${reviewReason}` : ''}</p>
```

**Raw class strings detected (best effort):**

- `text-2xl font-bold`
- `text-sm text-slate-600 mt-1`
- `text-xs text-slate-500 mt-1`
- `text-xs text-slate-500 mt-2`
- `font-semibold`

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
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:267`

```jsx
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-1">First month: $1.99 â€¢ Renewals: $6.99/month</p>
        <p className="text-xs text-slate-500 mt-2">Review status: <span className="font-semibold">{reviewStatus}</span>{reviewReason ? ` â€¢ ${reviewReason}` : ''}</p>
        <p className="text-xs text-slate-500 mt-2">Need help* Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
```

**Raw class strings detected (best effort):**

- `text-sm text-slate-600 mt-1`
- `text-xs text-slate-500 mt-1`
- `text-xs text-slate-500 mt-2`
- `font-semibold`
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
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:268`

```jsx
        <p className="text-xs text-slate-500 mt-1">First month: $1.99 â€¢ Renewals: $6.99/month</p>
        <p className="text-xs text-slate-500 mt-2">Review status: <span className="font-semibold">{reviewStatus}</span>{reviewReason ? ` â€¢ ${reviewReason}` : ''}</p>
        <p className="text-xs text-slate-500 mt-2">Need help* Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
      </header>
```

**Raw class strings detected (best effort):**

- `text-xs text-slate-500 mt-1`
- `text-xs text-slate-500 mt-2`
- `font-semibold`
- `underline text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:269`

```jsx
        <p className="text-xs text-slate-500 mt-2">Review status: <span className="font-semibold">{reviewStatus}</span>{reviewReason ? ` â€¢ ${reviewReason}` : ''}</p>
        <p className="text-xs text-slate-500 mt-2">Need help* Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
      </header>

```

**Raw class strings detected (best effort):**

- `text-xs text-slate-500 mt-2`
- `font-semibold`
- `underline text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:270`

```jsx
        <p className="text-xs text-slate-500 mt-2">Need help* Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
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

#### `src/pages/VerificationPage.jsx:273`

```jsx
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl borderless-shadow bg-white p-5 md:col-span-2 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
```

**Raw class strings detected (best effort):**

- `grid gap-4 md:grid-cols-3`
- `rounded-2xl borderless-shadow bg-white p-5 md:col-span-2 space-y-4`
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
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:grid-cols-3` — Variant prefix (responsive, dark, or interaction state).
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:274`

```jsx
        <div className="rounded-2xl borderless-shadow bg-white p-5 md:col-span-2 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Your requirements</p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-5 md:col-span-2 space-y-4`
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
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `md:col-span-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:275`

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

#### `src/pages/VerificationPage.jsx:277`

```jsx
              <p className="text-sm font-bold text-slate-900">Your requirements</p>
              <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
            </div>
            <div className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'}`}>
```

**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `text-[11px] text-slate-500`
- `bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30`
- `bg-slate-50 text-slate-700 ring-1 ring-slate-200`

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
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-[#0A66C2]/30` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).

#### `src/pages/VerificationPage.jsx:278`

```jsx
              <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
            </div>
            <div className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'}`}>
              {verified ? 'Verified' : 'Not verified'}
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30`
- `bg-slate-50 text-slate-700 ring-1 ring-slate-200`
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
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-[#0A66C2]/30` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `Verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Not` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:280`

```jsx
            <div className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'}`}>
              {verified ? 'Verified' : 'Not verified'}
            </div>
          </div>
```

**Raw class strings detected (best effort):**

- `bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30`
- `bg-slate-50 text-slate-700 ring-1 ring-slate-200`
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
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-[#0A66C2]/30` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `Verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Not` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:286`

```jsx
            <div className="rounded-xl borderless-shadow bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="buyer-country">Buyer Country</label>
                <select
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-slate-50 p-4`
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
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:287`

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

#### `src/pages/VerificationPage.jsx:288`

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

#### `src/pages/VerificationPage.jsx:293`

```jsx
className =
  "text-sm borderless-shadow rounded-xl px-3 py-2 bg-white" >
  <option value="">Select country</option>;
{
  BUYER_COUNTRY_OPTIONS.map((country) => (
    <option key={country} value={country}>
      {country}
    </option>
  ));
}
```

**Raw class strings detected (best effort):**

- `text-sm borderless-shadow rounded-xl px-3 py-2 bg-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-xl` — Corner radius.

#### `src/pages/VerificationPage.jsx:298`

```jsx
                {savingCountry ? <span className="text-xs text-slate-500">Saving...</span> : null}
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

#### `src/pages/VerificationPage.jsx:299`

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

#### `src/pages/VerificationPage.jsx:301`

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

#### `src/pages/VerificationPage.jsx:305`

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

#### `src/pages/VerificationPage.jsx:310`

```jsx
                <div key={documentKey} className="rounded-2xl borderless-shadow bg-white p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{LABELS[documentKey] || documentKey}</p>
                    <p className="text-[11px] text-slate-500 truncate">{submitted ? 'Submitted' : 'Missing'}</p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-4 flex items-center justify-between gap-3`
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
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:311`

```jsx
<div className="min-w-0">
  <p className="text-sm font-semibold text-slate-900 truncate">
    {LABELS[documentKey] || documentKey}
  </p>
  <p className="text-[11px] text-slate-500 truncate">
    {submitted ? "Submitted" : "Missing"}
  </p>
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

#### `src/pages/VerificationPage.jsx:312`

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

#### `src/pages/VerificationPage.jsx:313`

```jsx
                    <p className="text-[11px] text-slate-500 truncate">{submitted ? 'Submitted' : 'Missing'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${statusChipClass(status)}`}>{status}</span>
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

#### `src/pages/VerificationPage.jsx:315`

```jsx
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${statusChipClass(status)}`}>{status}</span>
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

#### `src/pages/VerificationPage.jsx:316`

```jsx
                    <span className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${statusChipClass(status)}`}>{status}</span>
                    <button
                      type="button"
                      onClick={() => openPicker(documentKey)}
```

**Raw class strings detected (best effort):**

- `button`

**Utility breakdown (grouped):**

- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:321`

```jsx
                      className="rounded-full borderless-shadow px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {busyDoc === documentKey ? 'Uploading...' : 'Upload'}
                    </button>
```

**Raw class strings detected (best effort):**

- `rounded-full borderless-shadow px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed`
- `Uploading...`
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
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:cursor-not-allowed` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Uploading...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Upload` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:331`

```jsx
          <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-900">Optional licenses</p>
            <p className="mt-1 text-[11px] text-slate-500">Optional proofs can be added anytime. More proof = more trust.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-slate-50 p-4`
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
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `sm:flex-row` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:332`

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

#### `src/pages/VerificationPage.jsx:333`

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

#### `src/pages/VerificationPage.jsx:334`

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

#### `src/pages/VerificationPage.jsx:339`

```jsx
                className="flex-1 rounded-full borderless-shadow bg-white px-4 py-2 text-sm"
              />
              <button
                type="button"
```

**Raw class strings detected (best effort):**

- `flex-1 rounded-full borderless-shadow bg-white px-4 py-2 text-sm`
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
  - `borderless-shadow` — Border style/width/color.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:344`

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

#### `src/pages/VerificationPage.jsx:349`

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

#### `src/pages/VerificationPage.jsx:355`

```jsx
                  className="rounded-full borderless-shadow bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50"
                  title="Remove"
                >
                  {lic} ✕
```

**Raw class strings detected (best effort):**

- `rounded-full borderless-shadow bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50`
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
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-rose-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Remove` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:361`

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

#### `src/pages/VerificationPage.jsx:365`

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

#### `src/pages/VerificationPage.jsx:366`

```jsx
          {error ? <div className="text-sm text-rose-700">{error}</div> : null}
        </div>

        <aside className="rounded-2xl borderless-shadow bg-white p-5 space-y-3">
```

**Raw class strings detected (best effort):**

- `text-sm text-rose-700`
- `rounded-2xl borderless-shadow bg-white p-5 space-y-3`

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
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:369`

```jsx
        <aside className="rounded-2xl borderless-shadow bg-white p-5 space-y-3">
          <p className="text-sm font-bold text-slate-900">Credibility</p>
          <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-5 space-y-3`
- `text-sm font-bold text-slate-900`
- `rounded-2xl borderless-shadow bg-slate-50 p-4`
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
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:370`

```jsx
          <p className="text-sm font-bold text-slate-900">Credibility</p>
          <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{credibilityBadge}</p>
```

**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `rounded-2xl borderless-shadow bg-slate-50 p-4`
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
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:371`

```jsx
          <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{credibilityBadge}</p>
            <p className="mt-2 text-xs text-slate-600">More licensing proof increases credibility and international trust.</p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-slate-50 p-4`
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
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:372`

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

#### `src/pages/VerificationPage.jsx:373`

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

#### `src/pages/VerificationPage.jsx:374`

```jsx
            <p className="mt-2 text-xs text-slate-600">More licensing proof increases credibility and international trust.</p>
          </div>

          <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
```

**Raw class strings detected (best effort):**

- `mt-2 text-xs text-slate-600`
- `rounded-2xl borderless-shadow bg-slate-50 p-4`

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
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:377`

```jsx
          <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Subscription</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{remainingDays > 0 ? 'Active' : 'Inactive'}</p>
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active verification subscription.</p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-slate-50 p-4`
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
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/VerificationPage.jsx:378`

```jsx
            <p className="text-xs text-slate-500">Subscription</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{remainingDays > 0 ? 'Active' : 'Inactive'}</p>
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active verification subscription.</p>
            {remainingDays ? (
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

#### `src/pages/VerificationPage.jsx:379`

```jsx
            <p className="mt-1 text-sm font-semibold text-slate-900">{remainingDays > 0 ? 'Active' : 'Inactive'}</p>
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active verification subscription.</p>
            {remainingDays ? (
              <p className={`mt-2 text-[11px]${expiringSoon ? 'text-amber-700' : 'text-slate-600'}`}>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `mt-1 text-[11px] text-slate-600`
- `text-amber-700`
- `text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/VerificationPage.jsx:380`

```jsx
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active verification subscription.</p>
            {remainingDays ? (
              <p className={`mt-2 text-[11px]${expiringSoon ? 'text-amber-700' : 'text-slate-600'}`}>
                Remaining: {remainingDays} day{remainingDays === 1 ? '' : 's'} {expiringSoon ? '(expiring soon)' : ''}
```

**Raw class strings detected (best effort):**

- `mt-1 text-[11px] text-slate-600`
- `text-amber-700`
- `text-slate-600`
- `:`
- `} {expiringSoon ? `

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `:` — Variant prefix (responsive, dark, or interaction state).
  - `}` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `{expiringSoon` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `?` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:382`

```jsx
              <p className={`mt-2 text-[11px]${expiringSoon ? 'text-amber-700' : 'text-slate-600'}`}>
                Remaining: {remainingDays} day{remainingDays === 1 ? '' : 's'} {expiringSoon ? '(expiring soon)' : ''}
              </p>
            ) : null}
```

**Raw class strings detected (best effort):**

- `text-amber-700`
- `text-slate-600`
- `:`
- `} {expiringSoon ? `

**Utility breakdown (grouped):**

- **Typography:**
  - `text-amber-700` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Other:**
  - `:` — Variant prefix (responsive, dark, or interaction state).
  - `}` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `{expiringSoon` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `?` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:392`

```jsx
            className="w-full rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182] disabled:opacity-70"
          >
            {renewing ? 'Processing...' : 'Pay / Renew Verification'}
          </button>
```

**Raw class strings detected (best effort):**

- `w-full rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182] disabled:opacity-70`
- `Processing...`
- `Pay / Renew Verification`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Processing...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Pay` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `/` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Renew` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Verification` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/VerificationPage.jsx:400`

```jsx
            className="w-full rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Refresh status
          </button>
```

**Raw class strings detected (best effort):**

- `w-full rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`

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
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/VerificationPage.jsx:407`

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

- `src/pages/VerificationPage.jsx:266` — Verification Center

```jsx
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-1">First month: $1.99 â€¢ Renewals: $6.99/month</p>
        <p className="text-xs text-slate-500 mt-2">Review status: <span className="font-semibold">{reviewStatus}</span>{reviewReason ? ` â€¢ ${reviewReason}` : ''}</p>
```

- `src/pages/VerificationPage.jsx:267` — Verification is subscription-based and renews monthly.

```jsx
        <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 mt-1">First month: $1.99 â€¢ Renewals: $6.99/month</p>
        <p className="text-xs text-slate-500 mt-2">Review status: <span className="font-semibold">{reviewStatus}</span>{reviewReason ? ` â€¢ ${reviewReason}` : ''}</p>
        <p className="text-xs text-slate-500 mt-2">Need help* Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
```

- `src/pages/VerificationPage.jsx:268` — First month: $1.99 â€¢ Renewals: $6.99/month

```jsx
        <p className="text-xs text-slate-500 mt-1">First month: $1.99 â€¢ Renewals: $6.99/month</p>
        <p className="text-xs text-slate-500 mt-2">Review status: <span className="font-semibold">{reviewStatus}</span>{reviewReason ? ` â€¢ ${reviewReason}` : ''}</p>
        <p className="text-xs text-slate-500 mt-2">Need help* Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
      </header>
```

- `src/pages/VerificationPage.jsx:277` — Your requirements

```jsx
              <p className="text-sm font-bold text-slate-900">Your requirements</p>
              <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
            </div>
            <div className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'}`}>
```

- `src/pages/VerificationPage.jsx:278` — Role-based checklist. Uploading more proof increases credibility.

```jsx
              <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
            </div>
            <div className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'}`}>
              {verified ? 'Verified' : 'Not verified'}
```

- `src/pages/VerificationPage.jsx:288` — Buyer Country

```jsx
                <label className="text-sm font-semibold text-slate-700" htmlFor="buyer-country">Buyer Country</label>
                <select
                  id="buyer-country"
                  value={buyerCountry}
```

- `src/pages/VerificationPage.jsx:298` — Saving...

```jsx
                {savingCountry ? <span className="text-xs text-slate-500">Saving...</span> : null}
                <span className="text-xs text-slate-600">Region: <span className="font-semibold">{buyerRegion}</span></span>
              </div>
              {!buyerCountry ? <p className="mt-2 text-xs text-rose-700">Buyer country is required before completing buyer verification.</p> : null}
```

- `src/pages/VerificationPage.jsx:301` — Buyer country is required before completing buyer verification.

```jsx
              {!buyerCountry ? <p className="mt-2 text-xs text-rose-700">Buyer country is required before completing buyer verification.</p> : null}
            </div>
          ) : null}

```

- `src/pages/VerificationPage.jsx:332` — Optional licenses

```jsx
            <p className="text-sm font-bold text-slate-900">Optional licenses</p>
            <p className="mt-1 text-[11px] text-slate-500">Optional proofs can be added anytime. More proof = more trust.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
```

- `src/pages/VerificationPage.jsx:333` — Optional proofs can be added anytime. More proof = more trust.

```jsx
            <p className="mt-1 text-[11px] text-slate-500">Optional proofs can be added anytime. More proof = more trust.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                value={optionalLicenseInput}
```

- `src/pages/VerificationPage.jsx:361` — No optional licenses yet.

```jsx
              {!optionalLicenses.length ? <p className="text-xs text-slate-500">No optional licenses yet.</p> : null}
            </div>
          </div>

```

- `src/pages/VerificationPage.jsx:370` — Credibility

```jsx
          <p className="text-sm font-bold text-slate-900">Credibility</p>
          <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
            <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{credibilityBadge}</p>
```

- `src/pages/VerificationPage.jsx:374` — More licensing proof increases credibility and international trust.

```jsx
            <p className="mt-2 text-xs text-slate-600">More licensing proof increases credibility and international trust.</p>
          </div>

          <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
```

- `src/pages/VerificationPage.jsx:378` — Subscription

```jsx
            <p className="text-xs text-slate-500">Subscription</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{remainingDays > 0 ? 'Active' : 'Inactive'}</p>
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active verification subscription.</p>
            {remainingDays ? (
```

- `src/pages/VerificationPage.jsx:380` — Verification approval requires an active verification subscription.

```jsx
            <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active verification subscription.</p>
            {remainingDays ? (
              <p className={`mt-2 text-[11px]${expiringSoon ? 'text-amber-700' : 'text-slate-600'}`}>
                Remaining: {remainingDays} day{remainingDays === 1 ? '' : 's'} {expiringSoon ? '(expiring soon)' : ''}
```

- `src/pages/VerificationPage.jsx:338` — e.g. OEKO-TEX, BSCI, WRAP...

```jsx
                placeholder="e.g. OEKO-TEX, BSCI, WRAP..."
                className="flex-1 rounded-full borderless-shadow bg-white px-4 py-2 text-sm"
              />
              <button
```

- `src/pages/VerificationPage.jsx:356` — Remove

```jsx
                  title="Remove"
                >
                  {lic} ✕
                </button>
```

- `src/pages/VerificationPage.jsx:317` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => openPicker(documentKey)}
                      disabled={busyDoc === documentKey || (role === 'buyer' && !buyerCountry)}
```

- `src/pages/VerificationPage.jsx:341` — (element) <button>

```jsx
              <button
                type="button"
                onClick={addOptionalLicense}
                className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
```

- `src/pages/VerificationPage.jsx:351` — (element) <button>

```jsx
                <button
                  key={lic}
                  type="button"
                  onClick={() => removeOptionalLicense(lic)}
```

- `src/pages/VerificationPage.jsx:388` — (element) <button>

```jsx
          <button
            type="button"
            onClick={handleRenewVerification}
            disabled={renewing}
```

- `src/pages/VerificationPage.jsx:397` — (element) <button>

```jsx
          <button
            type="button"
            onClick={loadStatus}
            className="w-full rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
```

## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line)                                     | Express mount                                                | Route definition                                     | Controller file | Handler              |
| ------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- | --------------- | -------------------- |
| GET /verification/me (src/pages/VerificationPage.jsx:109)     | /api/verification -> server/routes/verificationRoutes.js:115 | GET /me (server/routes/verificationRoutes.js:16)     | -               | getMyVerification    |
| POST /verification/me (src/pages/VerificationPage.jsx:138)    | /api/verification -> server/routes/verificationRoutes.js:115 | POST /me (server/routes/verificationRoutes.js:17)    | -               | submitMyVerification |
| POST /verification/me (src/pages/VerificationPage.jsx:177)    | /api/verification -> server/routes/verificationRoutes.js:115 | POST /me (server/routes/verificationRoutes.js:17)    | -               | submitMyVerification |
| POST /verification/me (src/pages/VerificationPage.jsx:212)    | /api/verification -> server/routes/verificationRoutes.js:115 | POST /me (server/routes/verificationRoutes.js:17)    | -               | submitMyVerification |
| POST /verification/me (src/pages/VerificationPage.jsx:230)    | /api/verification -> server/routes/verificationRoutes.js:115 | POST /me (server/routes/verificationRoutes.js:17)    | -               | submitMyVerification |
| POST /verification/renew (src/pages/VerificationPage.jsx:244) | /api/verification -> server/routes/verificationRoutes.js:115 | POST /renew (server/routes/verificationRoutes.js:18) | -               | renewMyVerification  |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/VerificationPage.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
