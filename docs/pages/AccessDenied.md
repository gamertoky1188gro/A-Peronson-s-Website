# AccessDenied - Route `/access-denied`

**Access:** Public

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/AccessDenied.jsx`.
- **Backend interactions:** None (static page / client-only interactions).
- **Primary file:** `src/pages/AccessDenied.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_AccessDenied.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

_No local component imports detected._

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

#### `src/pages/AccessDenied.jsx:28`

```jsx
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card p-6">
      {/* Centered panel to keep the message readable and focused. */}
      <div className="max-w-3xl mx-auto mt-16 bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Access denied</h1>
```
**Raw class strings detected (best effort):**

- `min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card p-6`
- `max-w-3xl mx-auto mt-16 bg-white neo-panel cyberpunk-card rounded-xl p-8`
- `text-3xl font-bold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
  - `mx-auto` — Horizontal margin (left/right).
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/AccessDenied.jsx:30`

```jsx
      <div className="max-w-3xl mx-auto mt-16 bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-gray-600">
          {/* Show the blocked route (fallback to generic wording if missing). */}
```
**Raw class strings detected (best effort):**

- `max-w-3xl mx-auto mt-16 bg-white neo-panel cyberpunk-card rounded-xl p-8`
- `text-3xl font-bold`
- `mt-3 text-gray-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-w-3xl` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `mt-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-8` — Padding (all sides).
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-gray-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Other:**
  - `neo-panel` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `cyberpunk-card` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/AccessDenied.jsx:31`

```jsx
        <h1 className="text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-gray-600">
          {/* Show the blocked route (fallback to generic wording if missing). */}
          You do not have permission to access <strong>{location.state?.from || 'this page'}</strong>.
```
**Raw class strings detected (best effort):**

- `text-3xl font-bold`
- `mt-3 text-gray-600`
- `this page`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-3xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-gray-600` — Text color or text sizing.
- **Other:**
  - `this` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `page` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/AccessDenied.jsx:32`

```jsx
        <p className="mt-3 text-gray-600">
          {/* Show the blocked route (fallback to generic wording if missing). */}
          You do not have permission to access <strong>{location.state?.from || 'this page'}</strong>.
        </p>
```
**Raw class strings detected (best effort):**

- `mt-3 text-gray-600`
- `this page`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-gray-600` — Text color or text sizing.
- **Other:**
  - `this` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `page` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/AccessDenied.jsx:37`

```jsx
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login with another account</Link>
          <Link to="/feed" className="px-4 py-2 rounded-lg border">Go to Feed</Link>
        </div>
```
**Raw class strings detected (best effort):**

- `mt-6 flex flex-wrap gap-3`
- `px-4 py-2 rounded-lg bg-indigo-600 text-white`
- `px-4 py-2 rounded-lg border`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `border` — Border style/width/color.

#### `src/pages/AccessDenied.jsx:38`

```jsx
          <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login with another account</Link>
          <Link to="/feed" className="px-4 py-2 rounded-lg border">Go to Feed</Link>
        </div>
      </div>
```
**Raw class strings detected (best effort):**

- `px-4 py-2 rounded-lg bg-indigo-600 text-white`
- `px-4 py-2 rounded-lg border`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-600` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `border` — Border style/width/color.

#### `src/pages/AccessDenied.jsx:39`

```jsx
          <Link to="/feed" className="px-4 py-2 rounded-lg border">Go to Feed</Link>
        </div>
      </div>
    </div>
```
**Raw class strings detected (best effort):**

- `px-4 py-2 rounded-lg border`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
  - `border` — Border style/width/color.

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/AccessDenied.jsx:31` — Access denied

```jsx
        <h1 className="text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-gray-600">
          {/* Show the blocked route (fallback to generic wording if missing). */}
          You do not have permission to access <strong>{location.state?.from || 'this page'}</strong>.
```
- `src/pages/AccessDenied.jsx:38` — Login with another account

```jsx
          <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login with another account</Link>
          <Link to="/feed" className="px-4 py-2 rounded-lg border">Go to Feed</Link>
        </div>
      </div>
```
- `src/pages/AccessDenied.jsx:39` — Go to Feed

```jsx
          <Link to="/feed" className="px-4 py-2 rounded-lg border">Go to Feed</Link>
        </div>
      </div>
    </div>
```
- `src/pages/AccessDenied.jsx:38` — (element) <Link>

```jsx
          <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login with another account</Link>
          <Link to="/feed" className="px-4 py-2 rounded-lg border">Go to Feed</Link>
        </div>
      </div>
```
- `src/pages/AccessDenied.jsx:39` — (element) <Link>

```jsx
          <Link to="/feed" className="px-4 py-2 rounded-lg border">Go to Feed</Link>
        </div>
      </div>
    </div>
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

_No API calls detected in this page._

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/AccessDenied.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

