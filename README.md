# GarTexHub Web App

GarTexHub is a modern React + Vite web platform prototype for textile and garment sourcing workflows. It includes landing, discovery, communication, dashboard, profile, legal, and organization management pages.

## Web Details

### Stack
- React 19 + React Router
- Vite 8
- Tailwind CSS utilities (via `@tailwindcss/vite`)
- Font Awesome icons

### UX Updates Included
- Global light/dark theming controlled from the top navigation.
- Persistent theme preference saved in `localStorage` (`theme=light|dark`).
- Mobile-friendly navigation menu with responsive behavior.
- Modernized visual treatment (glassy navbar, soft gradients, stronger card depth).
- Dark-mode harmonization for utility-based page layouts.

### Route Map
- `/` — Landing page
- `/pricing` — Pricing
- `/feed` — Main feed
- `/search` — Search results
- `/buyer/:id`, `/factory/:id`, `/buying-house/:id` — Profiles
- `/member-management`, `/partner-network`, `/product-management`, `/buyer-requests`
- `/chat`, `/call`, `/help`, `/contracts`, `/notifications`
- `/org-settings`, `/insights`, `/owner`, `/agent`
- `/about`, `/terms`, `/privacy`
- `/login`, `/signup`

## Page Documentation
Detailed per-page markdown documentation (theme behavior, structure, layout coordinates, and purpose notes) is available in:

- `docs/pages/`

Each file corresponds to one page component under `src/pages/`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes
- Theme toggle is in the global `NavBar` and affects all routes.
- For page-level metadata updates, edit docs in `docs/pages/` alongside page changes.
