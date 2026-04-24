# BuyingHouseProfile - Route `/buying-house/:id`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/BuyingHouseProfile.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/BuyingHouseProfile.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_BuyingHouseProfile.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/BuyingHouseProfile.jsx:24)
- ../lib/events (src/pages/BuyingHouseProfile.jsx:25)
- ../lib/leadSource (src/pages/BuyingHouseProfile.jsx:26)
- ../components/profile/VerificationPanel (src/pages/BuyingHouseProfile.jsx:27)
- ../components/profile/CrmSummaryPanel (src/pages/BuyingHouseProfile.jsx:28)

### 2.2 Structural section tags in JSX

- `aside` at `src/pages/BuyingHouseProfile.jsx:244`

```jsx
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
```

- `main` at `src/pages/BuyingHouseProfile.jsx:330`

```jsx
        <main className="col-span-12 lg:col-span-8 space-y-4">
          <CrmSummaryPanel targetId={user.id} />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
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

#### `src/pages/BuyingHouseProfile.jsx:235`

```jsx
if (loading)
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">
      Loading profile...
    </div>
  );
if (error)
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">
      {error}
    </div>
  );
if (!user)
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">
      Profile not found.
    </div>
  );
```

**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out`
- `min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
  - `text-rose-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:236`

```jsx
if (error)
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out">
      {error}
    </div>
  );
if (!user)
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">
      Profile not found.
    </div>
  );

const canRequestPartner =
  viewer &&
  ["factory", "buying_house", "admin"].includes(viewer.role) &&
  !viewerPerms.is_self;
```

**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200 transition-colors duration-500 ease-in-out`
- `min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out`
- `factory`
- `buying_house`
- `admin`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-rose-700` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-rose-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `factory` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `buying_house` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `admin` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:237`

```jsx
if (!user)
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out">
      Profile not found.
    </div>
  );

const canRequestPartner =
  viewer &&
  ["factory", "buying_house", "admin"].includes(viewer.role) &&
  !viewerPerms.is_self;
```

**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 p-6 text-slate-700 dark:bg-[#020617] dark:text-slate-200 transition-colors duration-500 ease-in-out`
- `factory`
- `buying_house`
- `admin`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `factory` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `buying_house` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `admin` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:242`

```jsx
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
```

**Raw class strings detected (best effort):**

- `min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out`
- `max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4`
- `col-span-12 lg:col-span-4 space-y-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-12` — Grid layout.
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-6` — Vertical padding (top/bottom).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `duration-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ease-in-out` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-[#020617]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:243`

```jsx
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
```

**Raw class strings detected (best effort):**

- `max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4`
- `col-span-12 lg:col-span-4 space-y-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-7xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid` — Grid layout.
  - `grid-cols-12` — Grid layout.
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `px-4` — Horizontal padding (left/right).
  - `py-6` — Vertical padding (top/bottom).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:244`

```jsx
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
```

**Raw class strings detected (best effort):**

- `col-span-12 lg:col-span-4 space-y-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-4` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:249`

```jsx
            className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <div className="flex items-center gap-3">
              {user.profile?.profile_image ? (
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800`
- `flex items-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:251`

```jsx
            <div className="flex items-center gap-3">
              {user.profile?.profile_image ? (
                <img src={user.profile.profile_image} alt={user.name} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
```

**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `h-14 w-14 rounded-2xl object-cover`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:253`

```jsx
                <img src={user.profile.profile_image} alt={user.name} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              )}
```

**Raw class strings detected (best effort):**

- `h-14 w-14 rounded-2xl object-cover`
- `h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:255`

```jsx
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
              )}
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
```

**Raw class strings detected (best effort):**

- `h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`
- `min-w-0`
- `text-lg font-bold text-slate-900 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-14` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.

#### `src/pages/BuyingHouseProfile.jsx:257`

```jsx
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="uppercase">Buying House</span>
```

**Raw class strings detected (best effort):**

- `min-w-0`
- `text-lg font-bold text-slate-900 truncate`
- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500`
- `uppercase`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:258`

```jsx
                <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="uppercase">Buying House</span>
                  {user.profile?.country ? <span>- {user.profile.country}</span> : null}
```

**Raw class strings detected (best effort):**

- `text-lg font-bold text-slate-900 truncate`
- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500`
- `uppercase`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:259`

```jsx
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="uppercase">Buying House</span>
                  {user.profile?.country ? <span>- {user.profile.country}</span> : null}
                  {user.verified ? <span className="font-bold text-[#0A66C2]">Verified</span> : null}
```

**Raw class strings detected (best effort):**

- `flex flex-wrap items-center gap-2 text-[11px] text-slate-500`
- `uppercase`
- `font-bold text-[#0A66C2]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:260`

```jsx
<span className="uppercase">Buying House</span>;
{
  user.profile?.country ? <span>- {user.profile.country}</span> : null;
}
{
  user.verified ? (
    <span className="font-bold text-[#0A66C2]">Verified</span>
  ) : null;
}
{
  isCertified ? (
    <span className="font-bold text-emerald-600">Certified</span>
  ) : null;
}
```

**Raw class strings detected (best effort):**

- `uppercase`
- `font-bold text-[#0A66C2]`
- `font-bold text-emerald-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:262`

```jsx
{
  user.verified ? (
    <span className="font-bold text-[#0A66C2]">Verified</span>
  ) : null;
}
{
  isCertified ? (
    <span className="font-bold text-emerald-600">Certified</span>
  ) : null;
}
{
  isPremium ? (
    <span
      title="Boosted visibility enabled for Premium"
      className="font-bold text-blue-600"
    >
      Premium Reach
    </span>
  ) : null;
}
{
  isBoosted ? (
    <span className="font-bold text-emerald-600">Boosted</span>
  ) : null;
}
```

**Raw class strings detected (best effort):**

- `font-bold text-[#0A66C2]`
- `font-bold text-emerald-600`
- `font-bold text-blue-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-600` — Text color or text sizing.
  - `text-blue-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:263`

```jsx
                  {isCertified ? <span className="font-bold text-emerald-600">Certified</span> : null}
                  {isPremium ? <span title="Boosted visibility enabled for Premium" className="font-bold text-blue-600">Premium Reach</span> : null}
                  {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
                </div>
```

**Raw class strings detected (best effort):**

- `font-bold text-emerald-600`
- `font-bold text-blue-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-600` — Text color or text sizing.
  - `text-blue-600` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:264`

```jsx
                  {isPremium ? <span title="Boosted visibility enabled for Premium" className="font-bold text-blue-600">Premium Reach</span> : null}
                  {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
                </div>
              </div>
```

**Raw class strings detected (best effort):**

- `font-bold text-blue-600`
- `font-bold text-emerald-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-blue-600` — Text color or text sizing.
  - `text-emerald-600` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:265`

```jsx
                  {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
                </div>
              </div>
            </div>
```

**Raw class strings detected (best effort):**

- `font-bold text-emerald-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-600` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:270`

```jsx
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
```

**Raw class strings detected (best effort):**

- `mt-4 flex flex-wrap gap-2`
- `flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]`
- `flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`
- `Following`
- `Follow`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `flex-1` — Flex layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Following` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Follow` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:271`

```jsx
              <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
```

**Raw class strings detected (best effort):**

- `flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]`
- `flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`
- `Following`
- `Follow`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#0A66C2]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-[#004182]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Following` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Follow` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:272`

```jsx
              <button onClick={follow} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
              <button onClick={connect} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
```

**Raw class strings detected (best effort):**

- `flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`
- `Following`
- `Follow`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
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
- **Other:**
  - `Following` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Follow` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:275`

```jsx
              <button onClick={connect} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
              </button>
            </div>
```

**Raw class strings detected (best effort):**

- `flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`
- `friends`
- `Connected`
- `requested`
- `Requested`
- `Connect`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
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
- **Other:**
  - `friends` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Connected` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `requested` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Requested` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Connect` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:281`

```jsx
              <div className="mt-3">
                <button
                  type="button"
                  onClick={requestPartner}
```

**Raw class strings detected (best effort):**

- `mt-3`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:285`

```jsx
                  className="w-full rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Request partner network connection
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

#### `src/pages/BuyingHouseProfile.jsx:289`

```jsx
                {notice ? <p className="mt-2 text-[11px] text-slate-600">{notice}</p> : null}
              </div>
            ) : null}

```

**Raw class strings detected (best effort):**

- `mt-2 text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:293`

```jsx
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Industry</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.industry || 'Garments & Textile'}</p>
```

**Raw class strings detected (best effort):**

- `mt-4 grid grid-cols-1 gap-3`
- `rounded-xl borderless-shadow bg-slate-50 p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:294`

```jsx
<div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  <p className="text-[11px] text-slate-500">Industry</p>
  <p className="mt-1 text-sm font-semibold text-slate-900">
    {user.profile?.industry || "Garments & Textile"}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-slate-50 p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:295`

```jsx
                <p className="text-[11px] text-slate-500">Industry</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.industry || 'Garments & Textile'}</p>
              </div>
              <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl borderless-shadow bg-slate-50 p-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:296`

```jsx
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.industry || 'Garments & Textile'}</p>
              </div>
              <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Organization</p>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl borderless-shadow bg-slate-50 p-3`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:298`

```jsx
<div className="rounded-xl borderless-shadow bg-slate-50 p-3">
  <p className="text-[11px] text-slate-500">Organization</p>
  <p className="mt-1 text-sm font-semibold text-slate-900">
    {user.profile?.organization_name || user.profile?.organization || user.name}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-slate-50 p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:299`

```jsx
                <p className="text-[11px] text-slate-500">Organization</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
              </div>
              <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl borderless-shadow bg-slate-50 p-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:300`

```jsx
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
              </div>
              <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Rating</p>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl borderless-shadow bg-slate-50 p-3`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:302`

```jsx
              <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-slate-50 p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:303`

```jsx
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:304`

```jsx
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
            </div>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

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

#### `src/pages/BuyingHouseProfile.jsx:305`

```jsx
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-600`
- `mt-3 grid grid-cols-2 gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:308`

```jsx
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl borderless-shadow bg-white p-3">
                <p className="text-[11px] text-slate-500">Partner factories</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '--'}</p>
```

**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-2 gap-3`
- `rounded-xl borderless-shadow bg-white p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-2` — Grid layout.
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:309`

```jsx
<div className="rounded-xl borderless-shadow bg-white p-3">
  <p className="text-[11px] text-slate-500">Partner factories</p>
  <p className="mt-1 text-sm font-semibold text-slate-900">
    {profile?.counts?.connected_factories ?? "--"}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-white p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:310`

```jsx
                <p className="text-[11px] text-slate-500">Partner factories</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '--'}</p>
              </div>
              <div className="rounded-xl borderless-shadow bg-white p-3">
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl borderless-shadow bg-white p-3`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:311`

```jsx
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '--'}</p>
              </div>
              <div className="rounded-xl borderless-shadow bg-white p-3">
                <p className="text-[11px] text-slate-500">Requests</p>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `rounded-xl borderless-shadow bg-white p-3`
- `text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:313`

```jsx
<div className="rounded-xl borderless-shadow bg-white p-3">
  <p className="text-[11px] text-slate-500">Requests</p>
  <p className="mt-1 text-sm font-semibold text-slate-900">
    {profile?.counts?.requests ?? 0}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-white p-3`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:314`

```jsx
                <p className="text-[11px] text-slate-500">Requests</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
              </div>
            </div>
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:315`

```jsx
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
              </div>
            </div>
          </motion.div>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:322`

```jsx
            <div className="mt-4 rounded-xl bg-white/60 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
              <p className="text-[11px] text-slate-500">Order Completion Certification</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{certification.status || 'pending'}</p>
              <p className="text-[11px] text-slate-600">Signed contracts: {certification.signed_contracts ?? 0}</p>
```

**Raw class strings detected (best effort):**

- `mt-4 rounded-xl bg-white/60 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white/60` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:323`

```jsx
              <p className="text-[11px] text-slate-500">Order Completion Certification</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{certification.status || 'pending'}</p>
              <p className="text-[11px] text-slate-600">Signed contracts: {certification.signed_contracts ?? 0}</p>
            </div>
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-500`
- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:324`

```jsx
              <p className="mt-1 text-sm font-semibold text-slate-900">{certification.status || 'pending'}</p>
              <p className="text-[11px] text-slate-600">Signed contracts: {certification.signed_contracts ?? 0}</p>
            </div>
          ) : null}
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900`
- `text-[11px] text-slate-600`

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

#### `src/pages/BuyingHouseProfile.jsx:325`

```jsx
              <p className="text-[11px] text-slate-600">Signed contracts: {certification.signed_contracts ?? 0}</p>
            </div>
          ) : null}
        </aside>
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:330`

```jsx
        <main className="col-span-12 lg:col-span-8 space-y-4">
          <CrmSummaryPanel targetId={user.id} />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
```

**Raw class strings detected (best effort):**

- `col-span-12 lg:col-span-8 space-y-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Responsive variants:**
  - `lg:col-span-8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:336`

```jsx
            className="rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {['overview', 'partner', 'products', 'reviews'].map((tab) => (
```

**Raw class strings detected (best effort):**

- `rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 overflow-hidden dark:bg-slate-900/50 dark:ring-slate-800`
- `relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`
- `overview`
- `partner`
- `products`
- `reviews`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-[#ffffff]` — Background color/surface.
  - `bg-white/60` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/60` — Outline ring (often used instead of borders in dark mode).
  - `borderless-divider-b` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-900/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `overview` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `partner` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `products` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `reviews` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:338`

```jsx
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {['overview', 'partner', 'products', 'reviews'].map((tab) => (
                <button
                  key={tab}
```

**Raw class strings detected (best effort):**

- `relative flex items-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-950/30 borderless-divider-b dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]`
- `overview`
- `partner`
- `products`
- `reviews`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Color / surface:**
  - `bg-white/60` — Background color/surface.
- **Borders / rings / shadows:**
  - `borderless-divider-b` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-950/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `overview` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `partner` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `products` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `reviews` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:344`

```jsx
                  className={`relative rounded-full px-3 py-2 text-xs font-semibold transition ring-1 active:scale-95${
                    activeTab === tab
                      ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
                      : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
```

**Raw class strings detected (best effort):**

- `bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35`
- `bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-indigo-700` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `bg-white/60` — Background color/surface.
- **Borders / rings / shadows:**
  - `ring-indigo-200` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Interaction / motion:**
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#38bdf8]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-[#38bdf8]/35` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/8` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:353`

```jsx
                      className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  ) : null}
```

**Raw class strings detected (best effort):**

- `absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10`
- `spring`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `spring` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:362`

```jsx
            <div className="p-4">
              {activeTab === 'overview' ? (
                <div className="space-y-4">
                  <div>
```

**Raw class strings detected (best effort):**

- `p-4`
- `overview`
- `space-y-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `overview` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:364`

```jsx
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
```

**Raw class strings detected (best effort):**

- `space-y-4`
- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:366`

```jsx
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>

```

**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900 dark:text-slate-100`
- `mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:367`

```jsx
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>

                  {hasBrandKit ? (
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:371`

```jsx
                    <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Brand Kit</p>
                      <div className="mt-3 flex items-center gap-3">
                        {brandProfile.brand_logo_url ? (
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-3 flex items-center gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:372`

```jsx
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Brand Kit</p>
                      <div className="mt-3 flex items-center gap-3">
                        {brandProfile.brand_logo_url ? (
                          <img src={brandProfile.brand_logo_url} alt="Brand logo" className="h-12 w-12 rounded-xl object-cover" />
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-3 flex items-center gap-3`
- `h-12 w-12 rounded-xl object-cover`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:373`

```jsx
                      <div className="mt-3 flex items-center gap-3">
                        {brandProfile.brand_logo_url ? (
                          <img src={brandProfile.brand_logo_url} alt="Brand logo" className="h-12 w-12 rounded-xl object-cover" />
                        ) : (
```

**Raw class strings detected (best effort):**

- `mt-3 flex items-center gap-3`
- `h-12 w-12 rounded-xl object-cover`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:375`

```jsx
                          <img src={brandProfile.brand_logo_url} alt="Brand logo" className="h-12 w-12 rounded-xl object-cover" />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
                        )}
```

**Raw class strings detected (best effort):**

- `h-12 w-12 rounded-xl object-cover`
- `h-12 w-12 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:377`

```jsx
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]" />
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
```

**Raw class strings detected (best effort):**

- `h-12 w-12 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF]`
- `min-w-0`
- `text-sm font-semibold text-slate-900 dark:text-slate-100 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-12` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-[#0A66C2]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-[#2E8BFF]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:379`

```jsx
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {brandProfile.brand_name || user.name}
                          </div>
```

**Raw class strings detected (best effort):**

- `min-w-0`
- `text-sm font-semibold text-slate-900 dark:text-slate-100 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:380`

```jsx
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {brandProfile.brand_name || user.name}
                          </div>
                          {brandProfile.brand_tagline ? (
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:384`

```jsx
                            <div className="text-xs text-slate-600 dark:text-slate-300">{brandProfile.brand_tagline}</div>
                          ) : null}
                          {brandProfile.brand_website ? (
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{brandProfile.brand_website}</div>
```

**Raw class strings detected (best effort):**

- `text-xs text-slate-600 dark:text-slate-300`
- `text-xs text-slate-500 dark:text-slate-400 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:387`

```jsx
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{brandProfile.brand_website}</div>
                          ) : null}
                        </div>
                      </div>
```

**Raw class strings detected (best effort):**

- `text-xs text-slate-500 dark:text-slate-400 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:395`

```jsx
                    <div className="rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dedicated Account Manager</p>
                      <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        {brandProfile.account_manager_name || 'Assigned manager'}
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-4 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-2 text-sm text-slate-700 dark:text-slate-300`
- `Assigned manager`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Assigned` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `manager` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:396`

```jsx
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dedicated Account Manager</p>
                      <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        {brandProfile.account_manager_name || 'Assigned manager'}
                      </div>
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100`
- `mt-2 text-sm text-slate-700 dark:text-slate-300`
- `Assigned manager`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Assigned` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `manager` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:397`

```jsx
                      <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        {brandProfile.account_manager_name || 'Assigned manager'}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-700 dark:text-slate-300`
- `Assigned manager`
- `mt-1 text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Assigned` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `manager` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:400`

```jsx
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {brandProfile.account_manager_email || brandProfile.account_manager_phone || ''}
                      </div>
                    </div>
```

**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:405`

```jsx
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Industry</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.industry || 'Garments & Textile'}</p>
```

**Raw class strings detected (best effort):**

- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:406`

```jsx
<div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
    Industry
  </p>
  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
    {user.profile?.industry || "Garments & Textile"}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:407`

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Industry</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.industry || 'Garments & Textile'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```

**Raw class strings detected (best effort):**

- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:408`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.industry || 'Garments & Textile'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Organization</p>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:410`

```jsx
<div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
    Organization
  </p>
  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
    {user.profile?.organization_name || user.profile?.organization || user.name}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:411`

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Organization</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```

**Raw class strings detected (best effort):**

- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:412`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating</p>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:414`

```jsx
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                      <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:415`

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                      <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
                    </div>
```

**Raw class strings detected (best effort):**

- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:416`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                      <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `text-[11px] text-slate-600`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:417`

```jsx
                      <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country</p>
```

**Raw class strings detected (best effort):**

- `text-[11px] text-slate-600`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:419`

```jsx
<div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
    Country
  </p>
  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
    {user.profile?.country || "--"}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:420`

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '--'}</p>
                    </div>
                  </div>
```

**Raw class strings detected (best effort):**

- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:421`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '--'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `grid grid-cols-1 sm:grid-cols-2 gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:424`

```jsx
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Certifications</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '--'}</p>
```

**Raw class strings detected (best effort):**

- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:425`

```jsx
<div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
    Certifications
  </p>
  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
    {(user.profile?.certifications || []).join(", ") || "--"}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:426`

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Certifications</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```

**Raw class strings detected (best effort):**

- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:427`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Capacity</p>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`
- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:429`

```jsx
<div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
    Capacity
  </p>
  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
    {user.profile?.sourcing_capacity || "--"}
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:430`

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Capacity</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.sourcing_capacity || '--'}</p>
                    </div>
                  </div>
```

**Raw class strings detected (best effort):**

- `text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`
- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:431`

```jsx
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.sourcing_capacity || '--'}</p>
                    </div>
                  </div>
                  {(user.profile?.companies_worked_with || []).length > 0 && (
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:436`

```jsx
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Companies Worked With</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(user.profile?.companies_worked_with || []).map((company, idx) => (
                          <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```

**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900 dark:text-slate-100 mb-3`
- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:437`

```jsx
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(user.profile?.companies_worked_with || []).map((company, idx) => (
                          <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                            {company.logo ? (
```

**Raw class strings detected (best effort):**

- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:439`

```jsx
                          <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                            {company.logo ? (
                              <img src={company.logo} alt={company.name} className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
```

**Raw class strings detected (best effort):**

- `flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10`
- `h-10 w-10 rounded-lg object-cover`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Color / surface:**
  - `bg-slate-50/70` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-slate-200/70` — Outline ring (often used instead of borders in dark mode).
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/5` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-white/10` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:441`

```jsx
                              <img src={company.logo} alt={company.name} className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500" />
                            )}
```

**Raw class strings detected (best effort):**

- `h-10 w-10 rounded-lg object-cover`
- `h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-indigo-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-purple-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:443`

```jsx
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{company.name}</p>
```

**Raw class strings detected (best effort):**

- `h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500`
- `min-w-0 flex-1`
- `text-sm font-semibold text-slate-900 dark:text-slate-100 truncate`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-gradient-to-br` — Background color/surface.
  - `from-indigo-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to-purple-500` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:445`

```jsx
<div className="min-w-0 flex-1">
  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
    {company.name}
  </p>
  {company.location && (
    <p className="text-xs text-slate-500 dark:text-slate-400">
      {company.location}
    </p>
  )}
</div>
```

**Raw class strings detected (best effort):**

- `min-w-0 flex-1`
- `text-sm font-semibold text-slate-900 dark:text-slate-100 truncate`
- `text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:446`

```jsx
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{company.name}</p>
                              {company.location && <p className="text-xs text-slate-500 dark:text-slate-400">{company.location}</p>}
                            </div>
                          </div>
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900 dark:text-slate-100 truncate`
- `text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:447`

```jsx
                              {company.location && <p className="text-xs text-slate-500 dark:text-slate-400">{company.location}</p>}
                            </div>
                          </div>
                        ))}
```

**Raw class strings detected (best effort):**

- `text-xs text-slate-500 dark:text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:458`

```jsx
                <div className="space-y-3">
                  {loadingNetwork ? <div className="text-sm text-slate-600">Loading partner network...</div> : null}
                  {!loadingNetwork && partnerNetwork ? (
                    <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
```

**Raw class strings detected (best effort):**

- `space-y-3`
- `text-sm text-slate-600`
- `rounded-2xl borderless-shadow bg-slate-50 p-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:459`

```jsx
                  {loadingNetwork ? <div className="text-sm text-slate-600">Loading partner network...</div> : null}
                  {!loadingNetwork && partnerNetwork ? (
                    <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
                      <p className="text-sm font-bold text-slate-900">Connected factories</p>
```

**Raw class strings detected (best effort):**

- `text-sm text-slate-600`
- `rounded-2xl borderless-shadow bg-slate-50 p-4`
- `text-sm font-bold text-slate-900`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:461`

```jsx
                    <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
                      <p className="text-sm font-bold text-slate-900">Connected factories</p>
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-slate-50 p-4`
- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:462`

```jsx
                      <p className="text-sm font-bold text-slate-900">Connected factories</p>
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
```

**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`
- `mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:463`

```jsx
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {partnerNetwork.factories.map((f) => (
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700`
- `mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:465`

```jsx
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {partnerNetwork.factories.map((f) => (
                            <div key={f.id} className="rounded-xl borderless-shadow bg-white px-3 py-2 flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-800">{f.name}</span>
```

**Raw class strings detected (best effort):**

- `mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2`
- `rounded-xl borderless-shadow bg-white px-3 py-2 flex items-center justify-between`
- `text-xs font-semibold text-slate-800`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:467`

```jsx
<div
  key={f.id}
  className="rounded-xl borderless-shadow bg-white px-3 py-2 flex items-center justify-between"
>
  <span className="text-xs font-semibold text-slate-800">{f.name}</span>
  {f.verified ? (
    <span className="text-xs font-bold text-[#0A66C2]">Verified</span>
  ) : (
    <span className="text-xs text-slate-500">--</span>
  )}
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-white px-3 py-2 flex items-center justify-between`
- `text-xs font-semibold text-slate-800`
- `text-xs font-bold text-[#0A66C2]`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:468`

```jsx
                              <span className="text-xs font-semibold text-slate-800">{f.name}</span>
                              {f.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : <span className="text-xs text-slate-500">--</span>}
                            </div>
                          ))}
```

**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-800`
- `text-xs font-bold text-[#0A66C2]`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:469`

```jsx
                              {f.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : <span className="text-xs text-slate-500">--</span>}
                            </div>
                          ))}
                        </div>
```

**Raw class strings detected (best effort):**

- `text-xs font-bold text-[#0A66C2]`
- `text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[#0A66C2]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:474`

```jsx
                        <p className="mt-2 text-[11px] text-slate-600">Factory list is private; only the organization owner/admin can see it.</p>
                      )}
                    </div>
                  ) : null}
```

**Raw class strings detected (best effort):**

- `mt-2 text-[11px] text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:482`

```jsx
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div key={p.id} className="rounded-2xl borderless-shadow bg-white p-4">
```

**Raw class strings detected (best effort):**

- `space-y-3`
- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `rounded-2xl borderless-shadow bg-white p-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:483`

```jsx
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div key={p.id} className="rounded-2xl borderless-shadow bg-white p-4">
                        {p.cover_image_public_url ? (
```

**Raw class strings detected (best effort):**

- `grid grid-cols-1 sm:grid-cols-2 gap-3`
- `rounded-2xl borderless-shadow bg-white p-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-1` — Grid layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `sm:grid-cols-2` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:485`

```jsx
                      <div key={p.id} className="rounded-2xl borderless-shadow bg-white p-4">
                        {p.cover_image_public_url ? (
                          <img src={p.cover_image_public_url} alt={p.title || 'Product'} className="h-32 w-full rounded-xl object-cover mb-3" />
                        ) : null}
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-4`
- `h-32 w-full rounded-xl object-cover mb-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `rounded-xl` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:487`

```jsx
                          <img src={p.cover_image_public_url} alt={p.title || 'Product'} className="h-32 w-full rounded-xl object-cover mb-3" />
                        ) : null}
                        <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
                        <p className="mt-1 text-xs text-slate-600">{p.category || '--'} - MOQ {p.moq || '--'} - Lead time {p.lead_time_days || '--'}</p>
```

**Raw class strings detected (best effort):**

- `h-32 w-full rounded-xl object-cover mb-3`
- `text-sm font-bold text-slate-900`
- `mt-1 text-xs text-slate-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-32` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:489`

```jsx
                        <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
                        <p className="mt-1 text-xs text-slate-600">{p.category || '--'} - MOQ {p.moq || '--'} - Lead time {p.lead_time_days || '--'}</p>
                        <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                        <p className="mt-2 text-[11px] text-slate-500">Status: {String(p.status || 'published')}</p>
```

**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-1 text-xs text-slate-600`
- `mt-2 text-sm text-slate-700 line-clamp-3`
- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:490`

```jsx
                        <p className="mt-1 text-xs text-slate-600">{p.category || '--'} - MOQ {p.moq || '--'} - Lead time {p.lead_time_days || '--'}</p>
                        <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                        <p className="mt-2 text-[11px] text-slate-500">Status: {String(p.status || 'published')}</p>
                      </div>
```

**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-600`
- `mt-2 text-sm text-slate-700 line-clamp-3`
- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:491`

```jsx
                        <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                        <p className="mt-2 text-[11px] text-slate-500">Status: {String(p.status || 'published')}</p>
                      </div>
                    ))}
```

**Raw class strings detected (best effort):**

- `mt-2 text-sm text-slate-700 line-clamp-3`
- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:492`

```jsx
                        <p className="mt-2 text-[11px] text-slate-500">Status: {String(p.status || 'published')}</p>
                      </div>
                    ))}
                  </div>
```

**Raw class strings detected (best effort):**

- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:496`

```jsx
                  {loadingProducts ? <div className="text-sm text-slate-600">Loading...</div> : null}
                  {productsNext !== null && !loadingProducts ? (
                    <button
                      type="button"
```

**Raw class strings detected (best effort):**

- `text-sm text-slate-600`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:501`

```jsx
                      className="rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Load more
                    </button>
```

**Raw class strings detected (best effort):**

- `rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`

**Utility breakdown (grouped):**

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

#### `src/pages/BuyingHouseProfile.jsx:506`

```jsx
                  {!products.length && !loadingProducts ? <div className="text-sm text-slate-600">No products found.</div> : null}
                </div>
              ) : null}

```

**Raw class strings detected (best effort):**

- `text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:511`

```jsx
                <div className="space-y-3">
                  <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
                    <p className="text-sm font-bold text-slate-900">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700">
```

**Raw class strings detected (best effort):**

- `space-y-3`
- `rounded-xl borderless-shadow bg-slate-50 p-3`
- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:512`

```jsx
                  <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
                    <p className="text-sm font-bold text-slate-900">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 - {ratingSummary?.aggregate?.total_count ?? 0} reviews - {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
```

**Raw class strings detected (best effort):**

- `rounded-xl borderless-shadow bg-slate-50 p-3`
- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`
- `0.0`
- `low`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Other:**
  - `0.0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `low` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:513`

```jsx
                    <p className="text-sm font-bold text-slate-900">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 - {ratingSummary?.aggregate?.total_count ?? 0} reviews - {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
```

**Raw class strings detected (best effort):**

- `text-sm font-bold text-slate-900`
- `mt-1 text-sm text-slate-700`
- `0.0`
- `low`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `0.0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `low` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:514`

```jsx
                    <p className="mt-1 text-sm text-slate-700">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 - {ratingSummary?.aggregate?.total_count ?? 0} reviews - {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
                  </div>
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700`
- `0.0`
- `low`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Other:**
  - `0.0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `low` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:518`

```jsx
<div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800 ring-1 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/30">
  <p className="font-semibold">Review Policy</p>
  <p className="mt-1">
    Reviews can only be edited or deleted by the person who wrote them. Profile
    owners cannot delete reviews to maintain transparency and trust.
  </p>
</div>
```

**Raw class strings detected (best effort):**

- `rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800 ring-1 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/30`
- `font-semibold`
- `mt-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-indigo-800` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-indigo-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-indigo-200` — Outline ring (often used instead of borders in dark mode).
- **Dark mode variants:**
  - `dark:bg-indigo-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-indigo-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:ring-indigo-500/30` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/BuyingHouseProfile.jsx:519`

```jsx
                    <p className="font-semibold">Review Policy</p>
                    <p className="mt-1">Reviews can only be edited or deleted by the person who wrote them. Profile owners cannot delete reviews to maintain transparency and trust.</p>
                  </div>
                  {(ratingSummary?.recent_reviews || []).map((r) => {
```

**Raw class strings detected (best effort):**

- `font-semibold`
- `mt-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:520`

```jsx
                    <p className="mt-1">Reviews can only be edited or deleted by the person who wrote them. Profile owners cannot delete reviews to maintain transparency and trust.</p>
                  </div>
                  {(ratingSummary?.recent_reviews || []).map((r) => {
                    const canEdit = viewer?.id && String(viewer.id) === String(r.from_user_id || '')
```

**Raw class strings detected (best effort):**

- `mt-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:525`

```jsx
                      <div key={r.id} className="rounded-2xl borderless-shadow bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{r.score} / 5</p>
```

**Raw class strings detected (best effort):**

- `rounded-2xl borderless-shadow bg-white p-4`
- `flex flex-wrap items-start justify-between gap-3`
- `text-sm font-semibold text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.

#### `src/pages/BuyingHouseProfile.jsx:526`

```jsx
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{r.score} / 5</p>
                            <p className="mt-1 text-sm text-slate-700">{r.comment || 'No comment provided.'}</p>
```

**Raw class strings detected (best effort):**

- `flex flex-wrap items-start justify-between gap-3`
- `text-sm font-semibold text-slate-900`
- `mt-1 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:528`

```jsx
                            <p className="text-sm font-semibold text-slate-900">{r.score} / 5</p>
                            <p className="mt-1 text-sm text-slate-700">{r.comment || 'No comment provided.'}</p>
                          </div>
                          {canEdit ? (
```

**Raw class strings detected (best effort):**

- `text-sm font-semibold text-slate-900`
- `mt-1 text-sm text-slate-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-900` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:529`

```jsx
                            <p className="mt-1 text-sm text-slate-700">{r.comment || 'No comment provided.'}</p>
                          </div>
                          {canEdit ? (
                            <div className="flex items-center gap-2">
```

**Raw class strings detected (best effort):**

- `mt-1 text-sm text-slate-700`
- `flex items-center gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.

#### `src/pages/BuyingHouseProfile.jsx:532`

```jsx
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50"
```

**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `button`
- `rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-indigo-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:535`

```jsx
                                className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50"
                                onClick={async () => {
                                  const nextScore = Number(window.prompt('Update score (1-5)', r.score))
                                  if (!Number.isFinite(nextScore)) return
```

**Raw class strings detected (best effort):**

- `rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50`
- `Update score (1-5)`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-indigo-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Update` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `score` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `(1-5)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:552`

```jsx
                                className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                                onClick={async () => {
                                  if (!window.confirm('Delete this review?')) return
                                  try {
```

**Raw class strings detected (best effort):**

- `rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50`
- `Delete this review?`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-rose-50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Delete` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `this` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `review?` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/BuyingHouseProfile.jsx:571`

```jsx
                  {!ratingSummary?.recent_reviews?.length ? <div className="text-sm text-slate-600">No reviews yet.</div> : null}
                </div>
              ) : null}
            </div>
```

**Raw class strings detected (best effort):**

- `text-sm text-slate-600`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/BuyingHouseProfile.jsx:260` — Buying House

```jsx
<span className="uppercase">Buying House</span>;
{
  user.profile?.country ? <span>- {user.profile.country}</span> : null;
}
{
  user.verified ? (
    <span className="font-bold text-[#0A66C2]">Verified</span>
  ) : null;
}
{
  isCertified ? (
    <span className="font-bold text-emerald-600">Certified</span>
  ) : null;
}
```

- `src/pages/BuyingHouseProfile.jsx:261` — - {user.profile.country}

```jsx
{
  user.profile?.country ? <span>- {user.profile.country}</span> : null;
}
{
  user.verified ? (
    <span className="font-bold text-[#0A66C2]">Verified</span>
  ) : null;
}
{
  isCertified ? (
    <span className="font-bold text-emerald-600">Certified</span>
  ) : null;
}
{
  isPremium ? (
    <span
      title="Boosted visibility enabled for Premium"
      className="font-bold text-blue-600"
    >
      Premium Reach
    </span>
  ) : null;
}
```

- `src/pages/BuyingHouseProfile.jsx:262` — Verified

```jsx
{
  user.verified ? (
    <span className="font-bold text-[#0A66C2]">Verified</span>
  ) : null;
}
{
  isCertified ? (
    <span className="font-bold text-emerald-600">Certified</span>
  ) : null;
}
{
  isPremium ? (
    <span
      title="Boosted visibility enabled for Premium"
      className="font-bold text-blue-600"
    >
      Premium Reach
    </span>
  ) : null;
}
{
  isBoosted ? (
    <span className="font-bold text-emerald-600">Boosted</span>
  ) : null;
}
```

- `src/pages/BuyingHouseProfile.jsx:263` — Certified

```jsx
                  {isCertified ? <span className="font-bold text-emerald-600">Certified</span> : null}
                  {isPremium ? <span title="Boosted visibility enabled for Premium" className="font-bold text-blue-600">Premium Reach</span> : null}
                  {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
                </div>
```

- `src/pages/BuyingHouseProfile.jsx:264` — Premium Reach

```jsx
                  {isPremium ? <span title="Boosted visibility enabled for Premium" className="font-bold text-blue-600">Premium Reach</span> : null}
                  {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
                </div>
              </div>
```

- `src/pages/BuyingHouseProfile.jsx:265` — Boosted

```jsx
                  {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
                </div>
              </div>
            </div>
```

- `src/pages/BuyingHouseProfile.jsx:271` — Contact

```jsx
              <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
```

- `src/pages/BuyingHouseProfile.jsx:295` — Industry

```jsx
                <p className="text-[11px] text-slate-500">Industry</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.industry || 'Garments & Textile'}</p>
              </div>
              <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
```

- `src/pages/BuyingHouseProfile.jsx:299` — Organization

```jsx
                <p className="text-[11px] text-slate-500">Organization</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
              </div>
              <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
```

- `src/pages/BuyingHouseProfile.jsx:303` — Rating

```jsx
                <p className="text-[11px] text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
              </div>
```

- `src/pages/BuyingHouseProfile.jsx:310` — Partner factories

```jsx
                <p className="text-[11px] text-slate-500">Partner factories</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.connected_factories ?? '--'}</p>
              </div>
              <div className="rounded-xl borderless-shadow bg-white p-3">
```

- `src/pages/BuyingHouseProfile.jsx:314` — Requests

```jsx
                <p className="text-[11px] text-slate-500">Requests</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.counts?.requests ?? 0}</p>
              </div>
            </div>
```

- `src/pages/BuyingHouseProfile.jsx:323` — Order Completion Certification

```jsx
              <p className="text-[11px] text-slate-500">Order Completion Certification</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{certification.status || 'pending'}</p>
              <p className="text-[11px] text-slate-600">Signed contracts: {certification.signed_contracts ?? 0}</p>
            </div>
```

- `src/pages/BuyingHouseProfile.jsx:325` — Signed contracts: {certification.signed_contracts ?? 0}

```jsx
              <p className="text-[11px] text-slate-600">Signed contracts: {certification.signed_contracts ?? 0}</p>
            </div>
          ) : null}
        </aside>
```

- `src/pages/BuyingHouseProfile.jsx:366` — About

```jsx
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">About</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{user.profile?.about || 'No description added yet.'}</p>
                  </div>

```

- `src/pages/BuyingHouseProfile.jsx:372` — Brand Kit

```jsx
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Brand Kit</p>
                      <div className="mt-3 flex items-center gap-3">
                        {brandProfile.brand_logo_url ? (
                          <img src={brandProfile.brand_logo_url} alt="Brand logo" className="h-12 w-12 rounded-xl object-cover" />
```

- `src/pages/BuyingHouseProfile.jsx:396` — Dedicated Account Manager

```jsx
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dedicated Account Manager</p>
                      <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        {brandProfile.account_manager_name || 'Assigned manager'}
                      </div>
```

- `src/pages/BuyingHouseProfile.jsx:407` — Industry

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Industry</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.industry || 'Garments & Textile'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```

- `src/pages/BuyingHouseProfile.jsx:411` — Organization

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Organization</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.organization_name || user.profile?.organization || user.name}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```

- `src/pages/BuyingHouseProfile.jsx:415` — Rating

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{ratingSummary?.aggregate?.average_score ?? '0.0'} / 5</p>
                      <p className="text-[11px] text-slate-600">{ratingSummary?.aggregate?.total_count ?? 0} reviews</p>
                    </div>
```

- `src/pages/BuyingHouseProfile.jsx:420` — Country

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.country || '--'}</p>
                    </div>
                  </div>
```

- `src/pages/BuyingHouseProfile.jsx:426` — Certifications

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Certifications</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{(user.profile?.certifications || []).join(', ') || '--'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```

- `src/pages/BuyingHouseProfile.jsx:430` — Capacity

```jsx
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Capacity</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{user.profile?.sourcing_capacity || '--'}</p>
                    </div>
                  </div>
```

- `src/pages/BuyingHouseProfile.jsx:436` — Companies Worked With

```jsx
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Companies Worked With</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(user.profile?.companies_worked_with || []).map((company, idx) => (
                          <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
```

- `src/pages/BuyingHouseProfile.jsx:462` — Connected factories

```jsx
                      <p className="text-sm font-bold text-slate-900">Connected factories</p>
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
```

- `src/pages/BuyingHouseProfile.jsx:463` — Total: {partnerNetwork.total_connected ?? 0}

```jsx
                      <p className="mt-1 text-sm text-slate-700">Total: {partnerNetwork.total_connected ?? 0}</p>
                      {Array.isArray(partnerNetwork.factories) ? (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {partnerNetwork.factories.map((f) => (
```

- `src/pages/BuyingHouseProfile.jsx:469` — Verified

```jsx
                              {f.verified ? <span className="text-xs font-bold text-[#0A66C2]">Verified</span> : <span className="text-xs text-slate-500">--</span>}
                            </div>
                          ))}
                        </div>
```

- `src/pages/BuyingHouseProfile.jsx:474` — Factory list is private; only the organization owner/admin can see it.

```jsx
                        <p className="mt-2 text-[11px] text-slate-600">Factory list is private; only the organization owner/admin can see it.</p>
                      )}
                    </div>
                  ) : null}
```

- `src/pages/BuyingHouseProfile.jsx:492` — Status: {String(p.status \|\| 'published')}

```jsx
                        <p className="mt-2 text-[11px] text-slate-500">Status: {String(p.status || 'published')}</p>
                      </div>
                    ))}
                  </div>
```

- `src/pages/BuyingHouseProfile.jsx:513` — Rating summary

```jsx
                    <p className="text-sm font-bold text-slate-900">Rating summary</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {ratingSummary?.aggregate?.average_score ?? '0.0'} / 5 - {ratingSummary?.aggregate?.total_count ?? 0} reviews - {ratingSummary?.aggregate?.reliability?.confidence || 'low'} confidence
                    </p>
```

- `src/pages/BuyingHouseProfile.jsx:519` — Review Policy

```jsx
                    <p className="font-semibold">Review Policy</p>
                    <p className="mt-1">Reviews can only be edited or deleted by the person who wrote them. Profile owners cannot delete reviews to maintain transparency and trust.</p>
                  </div>
                  {(ratingSummary?.recent_reviews || []).map((r) => {
```

- `src/pages/BuyingHouseProfile.jsx:520` — Reviews can only be edited or deleted by the person who wrote them. Profile owners cannot delete reviews to maintain transparency and trust.

```jsx
                    <p className="mt-1">Reviews can only be edited or deleted by the person who wrote them. Profile owners cannot delete reviews to maintain transparency and trust.</p>
                  </div>
                  {(ratingSummary?.recent_reviews || []).map((r) => {
                    const canEdit = viewer?.id && String(viewer.id) === String(r.from_user_id || '')
```

- `src/pages/BuyingHouseProfile.jsx:264` — Boosted visibility enabled for Premium

```jsx
                  {isPremium ? <span title="Boosted visibility enabled for Premium" className="font-bold text-blue-600">Premium Reach</span> : null}
                  {isBoosted ? <span className="font-bold text-emerald-600">Boosted</span> : null}
                </div>
              </div>
```

- `src/pages/BuyingHouseProfile.jsx:271` — (element) <button>

```jsx
              <button onClick={contact} className="flex-1 rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]">Contact</button>
              <button onClick={follow} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
```

- `src/pages/BuyingHouseProfile.jsx:272` — (element) <button>

```jsx
              <button onClick={follow} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.following ? 'Following' : 'Follow'}
              </button>
              <button onClick={connect} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
```

- `src/pages/BuyingHouseProfile.jsx:275` — (element) <button>

```jsx
              <button onClick={connect} className="flex-1 rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {relationship.friend_status === 'friends' ? 'Connected' : (relationship.friend_status === 'requested' ? 'Requested' : 'Connect')}
              </button>
            </div>
```

- `src/pages/BuyingHouseProfile.jsx:282` — (element) <button>

```jsx
                <button
                  type="button"
                  onClick={requestPartner}
                  className="w-full rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
```

- `src/pages/BuyingHouseProfile.jsx:340` — (element) <button>

```jsx
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
```

- `src/pages/BuyingHouseProfile.jsx:498` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => loadProducts({ reset: false })}
                      className="rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
```

- `src/pages/BuyingHouseProfile.jsx:533` — (element) <button>

```jsx
                              <button
                                type="button"
                                className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50"
                                onClick={async () => {
```

- `src/pages/BuyingHouseProfile.jsx:550` — (element) <button>

```jsx
                              <button
                                type="button"
                                className="rounded-full borderless-shadow px-3 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                                onClick={async () => {
```

## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line)                                                                                         | Express mount                                                   | Route definition                                          | Controller file                       | Handler              |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------- | -------------------- |
| GET /profiles/${encodeURIComponent(id)} (src/pages/BuyingHouseProfile.jsx:90)                                     | /api/profiles -> server/routes/profileRoutes.js:139             | -                                                         | -                                     | -                    |
| GET /ratings/profiles/user:${encodeURIComponent(id)} (src/pages/BuyingHouseProfile.jsx:107)                       | /api/ratings -> server/routes/ratingsRoutes.js:137              | -                                                         | -                                     | -                    |
| GET /certifications/org/${encodeURIComponent(id)} (src/pages/BuyingHouseProfile.jsx:117)                          | /api/certifications -> server/routes/certificationRoutes.js:149 | -                                                         | -                                     | -                    |
| GET /profiles/${encodeURIComponent(id)}/products?cursor=${cursor}&limit=10 (src/pages/BuyingHouseProfile.jsx:129) | /api/profiles -> server/routes/profileRoutes.js:139             | -                                                         | -                                     | -                    |
| GET /profiles/${encodeURIComponent(id)}/partner-network (src/pages/BuyingHouseProfile.jsx:145)                    | /api/profiles -> server/routes/profileRoutes.js:139             | -                                                         | -                                     | -                    |
| GET /boosts/me (src/pages/BuyingHouseProfile.jsx:173)                                                             | /api/boosts -> server/routes/boostRoutes.js:142                 | GET /me (server/routes/boostRoutes.js:7)                  | server/controllers/boostController.js | getMyBoosts          |
| POST /users/${encodeURIComponent(id)}/follow (src/pages/BuyingHouseProfile.jsx:196)                               | /api/users -> server/routes/userRoutes.js:112                   | -                                                         | -                                     | -                    |
| POST /users/${encodeURIComponent(id)}/friend-request (src/pages/BuyingHouseProfile.jsx:206)                       | /api/users -> server/routes/userRoutes.js:112                   | -                                                         | -                                     | -                    |
| POST /partners/requests (src/pages/BuyingHouseProfile.jsx:228)                                                    | /api/partners -> server/routes/partnerNetworkRoutes.js:132      | POST /requests (server/routes/partnerNetworkRoutes.js:14) | -                                     | createPartnerRequest |
| PATCH /ratings/${r.id} (src/pages/BuyingHouseProfile.jsx:541)                                                     | /api/ratings -> server/routes/ratingsRoutes.js:137              | -                                                         | -                                     | -                    |
| DELETE /ratings/${r.id} (src/pages/BuyingHouseProfile.jsx:556)                                                    | /api/ratings -> server/routes/ratingsRoutes.js:137              | -                                                         | -                                     | -                    |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/BuyingHouseProfile.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.
