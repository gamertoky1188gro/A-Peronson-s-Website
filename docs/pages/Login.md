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

#### `src/pages/auth/Login.jsx:71`

```jsx
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card flex items-center justify-center p-4">
      {/* Login card container (max width keeps form readable). */}
      <div className="w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Login</h1>
```
**Raw class strings detected (best effort):**

- `min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card flex items-center justify-center p-4`
- `w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8`
- `text-3xl font-bold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/auth/Login.jsx:73`

```jsx
      <div className="w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-gray-600">Access pages based on your role (Buyer, Factory, Buying House, Admin).</p>

```
**Raw class strings detected (best effort):**

- `w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8`
- `text-3xl font-bold`
- `mt-2 text-sm text-gray-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-md` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/auth/Login.jsx:74`

```jsx
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-gray-600">Access pages based on your role (Buyer, Factory, Buying House, Admin).</p>

        {/* Controlled form: React state is the single source of truth for inputs. */}
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

#### `src/pages/auth/Login.jsx:75`

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

#### `src/pages/auth/Login.jsx:78`

```jsx
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            {/* Email is required; browser validates type=email too. */}
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

#### `src/pages/auth/Login.jsx:80`

```jsx
            <label className="block text-sm font-medium mb-1">Email</label>
            {/* Email is required; browser validates type=email too. */}
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-4 py-3 border rounded-lg" />
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

#### `src/pages/auth/Login.jsx:82`

```jsx
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-4 py-3 border rounded-lg" />
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

#### `src/pages/auth/Login.jsx:85`

```jsx
            <label className="block text-sm font-medium mb-1">Password</label>
            {/* Password is required; actual auth validation happens server-side. */}
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full px-4 py-3 border rounded-lg" />
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

#### `src/pages/auth/Login.jsx:87`

```jsx
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full px-4 py-3 border rounded-lg" />
          </div>

          {/* "Remember me" determines how session is stored (cookie/localStorage) based on `saveSession` implementation. */}
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 border rounded-lg`
- `Remember me`

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
  - `Remember` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `me` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:91`

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

#### `src/pages/auth/Login.jsx:97`

```jsx
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          {/* Primary CTA: disabled while API request is in flight. */}
          <button disabled={loading} className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70">
```
**Raw class strings detected (best effort):**

- `text-sm text-red-500`
- `w-full px-4 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70`

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
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/auth/Login.jsx:100`

```jsx
          <button disabled={loading} className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
```
**Raw class strings detected (best effort):**

- `w-full px-4 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70`
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
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Interaction / motion:**
  - `disabled:opacity-70` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Signing` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `in...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Sign` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `in` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/auth/Login.jsx:106`

```jsx
        <p className="mt-6 text-sm text-gray-600">
          New here? <Link className="text-indigo-500" to="/signup">Create account</Link>
        </p>
      </div>
```
**Raw class strings detected (best effort):**

- `mt-6 text-sm text-gray-600`
- `text-indigo-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-gray-600` — Text color or text sizing.
  - `text-indigo-500` — Text color or text sizing.

#### `src/pages/auth/Login.jsx:107`

```jsx
          New here? <Link className="text-indigo-500" to="/signup">Create account</Link>
        </p>
      </div>
    </div>
```
**Raw class strings detected (best effort):**

- `text-indigo-500`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-indigo-500` — Text color or text sizing.

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/auth/Login.jsx:74` — Login

```jsx
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-gray-600">Access pages based on your role (Buyer, Factory, Buying House, Admin).</p>

        {/* Controlled form: React state is the single source of truth for inputs. */}
```
- `src/pages/auth/Login.jsx:75` — Access pages based on your role (Buyer, Factory, Buying House, Admin).

```jsx
        <p className="mt-2 text-sm text-gray-600">Access pages based on your role (Buyer, Factory, Buying House, Admin).</p>

        {/* Controlled form: React state is the single source of truth for inputs. */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
```
- `src/pages/auth/Login.jsx:80` — Email

```jsx
            <label className="block text-sm font-medium mb-1">Email</label>
            {/* Email is required; browser validates type=email too. */}
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-4 py-3 border rounded-lg" />
          </div>
```
- `src/pages/auth/Login.jsx:85` — Password

```jsx
            <label className="block text-sm font-medium mb-1">Password</label>
            {/* Password is required; actual auth validation happens server-side. */}
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full px-4 py-3 border rounded-lg" />
          </div>
```
- `src/pages/auth/Login.jsx:107` — Create account

```jsx
          New here? <Link className="text-indigo-500" to="/signup">Create account</Link>
        </p>
      </div>
    </div>
```
- `src/pages/auth/Login.jsx:100` — (element) <button>

```jsx
          <button disabled={loading} className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
```
- `src/pages/auth/Login.jsx:107` — (element) <Link>

```jsx
          New here? <Link className="text-indigo-500" to="/signup">Create account</Link>
        </p>
      </div>
    </div>
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /auth/login (src/pages/auth/Login.jsx:17) | /api/auth -> server/routes/authRoutes.js:59 | - | - | - |
| POST /auth/login (src/pages/auth/Login.jsx:52) | /api/auth -> server/routes/authRoutes.js:59 | POST /login (server/routes/authRoutes.js:8) | server/controllers/authController.js | login |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/auth/Login.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

