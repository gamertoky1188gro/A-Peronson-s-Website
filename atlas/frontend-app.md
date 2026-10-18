# frontend-app

- **Parent**: (none — top of frontend tree)
- **Purpose**: SPA shell — mounts the React tree, defines all 44 routes with role guards, provides theme/scroll/error boundaries, offline banner, and theme switcher.
- **Key Files**: `src/main.jsx`, `src/App.jsx`, `index.html`, `src/tailwind.css`, `src/lib/routes.js`, `src/lib/routeHealthCheck.js`, `src/sw.js`
- **Dependencies**: frontend-pages, frontend-components, frontend-lib, frontend-store, frontend-offline, frontend-theme
- **Dependents**: (none — top of frontend tree)
- **Exposes**: Route table (44 routes), `.app-shell` flex-height chain, `isViewportLockedRoute`, `ROUTES` constants, `isRouteValid()` nav health check, `registerServiceWorker()`.

## Data Flow
`main.jsx` → registers `src/sw.js` (prod only, or `?sw=1`; dispatches window event `sw:update-available`) → Redux Provider + ThemeProvider + LenisProvider → `App.jsx` `<main class="flex flex-col">` → route page. `OfflineBanner` and `ThemeSwitcher` are mounted once here. `ProtectedRoute` reads `auth.js getCurrentUser()` (localStorage-primed) to avoid feed unmount loops.

## Internal Structure
- **Viewport-locked shell** — `isViewportLockedRoute = ["/owner", "/contracts", "/leads", "/verification"]` ⇒ `h-dvh overflow-hidden lg:h-[125dvh]`. The `125dvh` is mandatory: `lg:[zoom:0.8]` scales viewport units, so plain `100dvh` always leaves a ~20% gap on lg screens (`125 × 0.8 = 100`). Non-locked routes use `min-h-[125vh]`; `/feed` additionally gets `h-screen`. Sidebar stretches (`lg:h-auto`); content column + nav are `flex-1 min-h-0` with `overflow-y:auto`. Any wrapper between the motion div and the flex root (e.g. `OwnerDashboard`'s `div.dark`) must itself carry `flex min-h-0 flex-1 flex-col`.
- **Public routes**: `/`, `/pricing`, `/about`, `/terms`, `/privacy`, `/help`, `/:time/meow/:date/SignupUltra`, `/access-denied`, `/share/:entityType/:entityId`, `/org-settings` (redirect → `/settings`).
- **Protected routes**: `/feed`, `/feed/manage`, `/search`, `/chat`, `/call`, `/owner`, `/agent`, `/admin`, `/admin/governance`, `/contracts`, `/leads`, `/verification`, `/settings`, `/profile/:id`, `/product-management`, `/buyer-requests`, `/orders`, `/tasks`, `/member-management`, `/partner-network`, `/join-requests/:requestId`, `/notifications`, `/insights`, `/boosts/:id`, `/support`, `/ratings/feedback`, `/feedback`, `/onboarding`, `/login`, `/signup`, `/industry/:slug`, `/buyer/:id`, `/factory/:id`, `/buying-house/:id`.
- **Owner panel tabs** are driven by `?tab=` (`/contracts`, `/leads`, `/verification` all render `OwnerDashboard`).
- **Settings** — `/settings` is the unlock page alongside `/profile`; `/org-settings` is a `<Navigate replace>` redirect preserving query string.

## Gotchas
- **Never `{/* */}` between JSX props** — esbuild's Vite dev transform 500s the file (blanked `/owner` to a no-shell page).
- `div.dark` theme wrapper between the motion wrapper and the flex root must carry `flex min-h-0 flex-1 flex-col` or every `flex-1` below it dies.