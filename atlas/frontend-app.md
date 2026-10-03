# frontend-app

- **Purpose**: SPA shell — mounts React tree, defines all routes with role guards, provides theme/scroll/error boundaries.
- **Key Files**: `src/main.jsx`, `src/App.jsx`, `src/tailwind.css`, `index.html`, `src/lib/routes.js`, `src/lib/routeHealthCheck.js`
- **Dependencies**: frontend-pages, frontend-components, frontend-lib, frontend-store
- **Dependents**: (none — top of frontend tree)
- **Exposes**: Route table (~40 routes), `.app-shell` flex-height chain (`h-screen` on `/feed`), `ROUTES` constants, `isRouteValid()` nav health check.

## Data Flow
`main.jsx` → Redux Provider + ThemeProvider + LenisProvider → `App.jsx` `<main class="flex flex-col">` → route page; `ProtectedRoute` reads `auth.js getCurrentUser()` (localStorage-primed) to avoid feed unmount loops.

## Internal Structure
- Public routes (`/`, `/pricing`, `/login`, `/signup`, `/share/:entityType/:entityId`) vs protected routes (feed, chat, owner, agent, admin) with `OWNER_ROLES`/admin guards.
- Owner panel tabs driven by `?tab=` query param (`/contracts`, `/leads` render OwnerDashboard).
