# Vite Configuration

**File:** `vite.config.js`

## Configuration

| Setting | Value |
|---------|-------|
| Base URL | `./` (configurable via VITE_BASE_URL) |
| Server Port | Default (Vite auto) |

## Plugins

- `@tailwindcss/vite` - Tailwind CSS integration
- `@vitejs/plugin-react` - React Fast Refresh + compiler

## Server Proxies

| Path | Target | Purpose |
|------|--------|---------|
| `/api` | localhost:4000 | API requests |
| `/uploads` | localhost:4000 | File uploads |
| `/ws` | localhost:4000 (ws: true) | WebSocket |

## Watch Options

- Ignores: `server/database/**`, `server/uploads/**`

---

*Generated from source: vite.config.js*