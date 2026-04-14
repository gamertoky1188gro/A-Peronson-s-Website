# Login - Route `/login`

**Access:** Public

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/auth/Login.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/auth/Login.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_auth_Login.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../../lib/auth (src/pages/auth/Login.jsx:25)

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

#### `src/pages/auth/Login.jsx:194`

```jsx
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card flex items-center justify-center p-4">
      {/* Login card container (max width keeps form readable). */}
      <div className="w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <div className="flex items-center justify-between">
```
**Raw class strings detected (best effort):**

- `min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card flex items-center justify-center p-4`
- `w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8`
- `flex items-center justify-between`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `p-8` — Padding (all sides).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Other:**
  - `neo-page` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `cyberpunk-page` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `neo-panel` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `cyberpunk-card` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:196`

```jsx
      <div className="w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Login</h1>
          <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
```
**Raw class strings detected (best effort):**

- `w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8`
- `flex items-center justify-between`
- `text-3xl font-bold`
- `text-sm text-slate-600 hover:text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-8` — Padding (all sides).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `neo-panel` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `cyberpunk-card` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:197`

```jsx
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Login</h1>
          <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
            Back
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between`
- `text-3xl font-bold`
- `text-sm text-slate-600 hover:text-slate-900`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Login.jsx:198`

```jsx
          <h1 className="text-3xl font-bold">Login</h1>
          <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
            Back
          </button>
```
**Raw class strings detected (best effort):**

- `text-3xl font-bold`
- `text-sm text-slate-600 hover:text-slate-900`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Login.jsx:199`

```jsx
          <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
            Back
          </button>
        </div>
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-600 hover:text-slate-900`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:text-slate-900` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Login.jsx:203`

```jsx
        <p className="mt-2 text-sm text-gray-600">Access pages based on your role (Buyer, Factory, Buying House, Admin).</p>

        {/* Controlled form: React state is the single source of truth for inputs. */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
```
**Raw class strings detected (best effort):**

- `mt-2 text-sm text-gray-600`
- `mt-6 space-y-4`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-gray-600` — Text color or text sizing.

#### `src/pages/auth/Login.jsx:206`

```jsx
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email or Agent ID</label>
            <input
```
**Raw class strings detected (best effort):**

- `mt-6 space-y-4`
- `block text-sm font-medium mb-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:208`

```jsx
            <label className="block text-sm font-medium mb-1">Email or Agent ID</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:215`

```jsx
              className="w-full px-4 py-3 borderless-shadow rounded-lg"
            />
            <p className="mt-1 text-xs text-slate-500">Agents: Use your assigned Agent ID to login</p>
          </div>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 borderless-shadow rounded-lg`
- `mt-1 text-xs text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Login.jsx:217`

```jsx
            <p className="mt-1 text-xs text-slate-500">Agents: Use your assigned Agent ID to login</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
```
**Raw class strings detected (best effort):**

- `mt-1 text-xs text-slate-500`
- `block text-sm font-medium mb-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:220`

```jsx
            <label className="block text-sm font-medium mb-1">Password</label>
            {/* Password is required; actual auth validation happens server-side. */}
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full px-4 py-3 borderless-shadow rounded-lg" />
          </div>
```
**Raw class strings detected (best effort):**

- `block text-sm font-medium mb-1`
- `w-full px-4 py-3 borderless-shadow rounded-lg`

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
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Login.jsx:222`

```jsx
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full px-4 py-3 borderless-shadow rounded-lg" />
          </div>

          <div className="space-y-2">
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 borderless-shadow rounded-lg`
- `space-y-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.

#### `src/pages/auth/Login.jsx:225`

```jsx
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
```
**Raw class strings detected (best effort):**

- `space-y-2`
- `flex items-center gap-2 text-sm`
- `checkbox`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Other:**
  - `checkbox` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:226`

```jsx
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
            </label>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2 text-sm`
- `checkbox`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Other:**
  - `checkbox` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:230`

```jsx
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberPasskeyUser}
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2 text-sm`
- `checkbox`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
- **Other:**
  - `checkbox` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:239`

```jsx
              <p className="text-xs text-slate-500">
                Passkey: <span className="font-semibold">{passkeyHint.passkey_name || 'Passkey'}</span>
                {passkeyHint.user_name ? ` · ${passkeyHint.user_name}` : ''}
                {passkeyHint.user_email ? ` (${passkeyHint.user_email})` : ''}
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-500`
- `font-semibold`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:240`

```jsx
                Passkey: <span className="font-semibold">{passkeyHint.passkey_name || 'Passkey'}</span>
                {passkeyHint.user_name ? ` · ${passkeyHint.user_name}` : ''}
                {passkeyHint.user_email ? ` (${passkeyHint.user_email})` : ''}
              </p>
```
**Raw class strings detected (best effort):**

- `font-semibold`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:248`

```jsx
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          {/* Primary CTA: uses brand blue color */}
          <button disabled={loading} className="w-full px-4 py-3 rounded-lg bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-hover)] text-white disabled:opacity-70 transition">
```
**Raw class strings detected (best effort):**

- `text-sm text-red-500`
- `w-full px-4 py-3 rounded-lg bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-hover)] text-white disabled:opacity-70 transition`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-red-500` — Text color or text sizing.
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:251`

```jsx
          <button disabled={loading} className="w-full px-4 py-3 rounded-lg bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-hover)] text-white disabled:opacity-70 transition">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <button
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 rounded-lg bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-hover)] text-white disabled:opacity-70 transition`
- `Signing in...`
- `Sign in`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[var(--gt-blue-hover)]` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Signing` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `in...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Sign` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `in` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:258`

```jsx
            className="w-full px-4 py-3 rounded-lg borderless-shadow text-slate-700 disabled:opacity-70"
          >
            {passkeyLoading ? 'Opening passkey...' : 'Sign in with passkey'}
          </button>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 rounded-lg borderless-shadow text-slate-700 disabled:opacity-70`
- `Opening passkey...`
- `Sign in with passkey`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `with` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Opening` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `passkey...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Sign` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `in` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `passkey` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:266`

```jsx
            className="w-full px-4 py-3 rounded-lg borderless-shadow text-slate-700 disabled:opacity-70"
          >
            {enrollLoading ? 'Setting up passkey...' : 'Set up passkey (first time)'}
          </button>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 rounded-lg borderless-shadow text-slate-700 disabled:opacity-70`
- `Setting up passkey...`
- `Set up passkey (first time)`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Setting` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `up` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `passkey...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Set` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `passkey` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `(first` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `time)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:273`

```jsx
        <p className="mt-6 text-sm text-gray-600">
          New here* <Link className="text-[var(--gt-blue)] hover:underline" to="/signup">Create account</Link>
        </p>
      </div>
```
**Raw class strings detected (best effort):**

- `mt-6 text-sm text-gray-600`
- `text-[var(--gt-blue)] hover:underline`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-gray-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Login.jsx:274`

```jsx
          New here* <Link className="text-[var(--gt-blue)] hover:underline" to="/signup">Create account</Link>
        </p>
      </div>
    </div>
```
**Raw class strings detected (best effort):**

- `text-[var(--gt-blue)] hover:underline`

**Utility breakdown (grouped):**

- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:underline` — Variant prefix (responsive, dark, or interaction state).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/auth/Login.jsx:198` — Login

```jsx
          <h1 className="text-3xl font-bold">Login</h1>
          <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
            Back
          </button>
```
- `src/pages/auth/Login.jsx:203` — Access pages based on your role (Buyer, Factory, Buying House, Admin).

```jsx
        <p className="mt-2 text-sm text-gray-600">Access pages based on your role (Buyer, Factory, Buying House, Admin).</p>

        {/* Controlled form: React state is the single source of truth for inputs. */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
```
- `src/pages/auth/Login.jsx:208` — Email or Agent ID

```jsx
            <label className="block text-sm font-medium mb-1">Email or Agent ID</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
```
- `src/pages/auth/Login.jsx:217` — Agents: Use your assigned Agent ID to login

```jsx
            <p className="mt-1 text-xs text-slate-500">Agents: Use your assigned Agent ID to login</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
```
- `src/pages/auth/Login.jsx:220` — Password

```jsx
            <label className="block text-sm font-medium mb-1">Password</label>
            {/* Password is required; actual auth validation happens server-side. */}
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full px-4 py-3 borderless-shadow rounded-lg" />
          </div>
```
- `src/pages/auth/Login.jsx:274` — Create account

```jsx
          New here* <Link className="text-[var(--gt-blue)] hover:underline" to="/signup">Create account</Link>
        </p>
      </div>
    </div>
```
- `src/pages/auth/Login.jsx:214` — Enter your email or Agent ID

```jsx
              placeholder="Enter your email or Agent ID"
              className="w-full px-4 py-3 borderless-shadow rounded-lg"
            />
            <p className="mt-1 text-xs text-slate-500">Agents: Use your assigned Agent ID to login</p>
```
- `src/pages/auth/Login.jsx:199` — (element) <button>

```jsx
          <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
            Back
          </button>
        </div>
```
- `src/pages/auth/Login.jsx:251` — (element) <button>

```jsx
          <button disabled={loading} className="w-full px-4 py-3 rounded-lg bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-hover)] text-white disabled:opacity-70 transition">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <button
```
- `src/pages/auth/Login.jsx:254` — (element) <button>

```jsx
          <button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading}
```
- `src/pages/auth/Login.jsx:262` — (element) <button>

```jsx
          <button
            type="button"
            onClick={handlePasskeyEnroll}
            disabled={enrollLoading}
```
- `src/pages/auth/Login.jsx:274` — (element) <Link>

```jsx
          New here* <Link className="text-[var(--gt-blue)] hover:underline" to="/signup">Create account</Link>
        </p>
      </div>
    </div>
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /auth/login (src/pages/auth/Login.jsx:17) | /api/auth -> server/routes/authRoutes.js:111 | - | - | - |
| POST /auth/login (src/pages/auth/Login.jsx:92) | /api/auth -> server/routes/authRoutes.js:111 | POST /login (server/routes/authRoutes.js:19) | - | login |
| POST /auth/passkey/login/options (src/pages/auth/Login.jsx:118) | /api/auth -> server/routes/authRoutes.js:111 | POST /passkey/login/options (server/routes/authRoutes.js:20) | - | passkeyLoginOptions |
| POST /auth/passkey/login/verify (src/pages/auth/Login.jsx:123) | /api/auth -> server/routes/authRoutes.js:111 | POST /passkey/login/verify (server/routes/authRoutes.js:21) | - | passkeyLoginVerify |
| POST /auth/login (src/pages/auth/Login.jsx:164) | /api/auth -> server/routes/authRoutes.js:111 | POST /login (server/routes/authRoutes.js:19) | - | login |
| POST /auth/passkey/registration/options (src/pages/auth/Login.jsx:168) | /api/auth -> server/routes/authRoutes.js:111 | POST /passkey/registration/options (server/routes/authRoutes.js:22) | - | passkeyRegistrationOptions |
| POST /auth/passkey/registration/verify (src/pages/auth/Login.jsx:176) | /api/auth -> server/routes/authRoutes.js:111 | POST /passkey/registration/verify (server/routes/authRoutes.js:23) | - | passkeyRegistrationVerify |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/auth/Login.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

