# Filter Presets

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/presets` -> `server/routes/presetsRoutes.js:11` (router var: `router`)

## Routes

### GET `/api/presets`

- **Route:** `server/routes/presetsRoutes.js:13`
- **Middleware:** requireAuth
- **Handler:** `listPresetsController`
- **Purpose:** List all saved filter presets

### POST `/api/presets`

- **Route:** `server/routes/presetsRoutes.js:14`
- **Middleware:** requireAuth
- **Handler:** `createPresetController`
- **Purpose:** Create a new filter preset

### GET `/api/presets/:id`

- **Route:** `server/routes/presetsRoutes.js:15`
- **Middleware:** requireAuth
- **Handler:** `getPresetController`
- **Purpose:** Get single preset by ID

### PATCH `/api/presets/:id`

- **Route:** `server/routes/presetsRoutes.js:16`
- **Middleware:** requireAuth
- **Handler:** `updatePresetController`
- **Purpose:** Update preset

### DELETE `/api/presets/:id`

- **Route:** `server/routes/presetsRoutes.js:17`
- **Middleware:** requireAuth
- **Handler:** `deletePresetController`
- **Purpose:** Delete preset

---

## Service Layer

- **Presets Service:** `server/services/presetsService.js`

---

*Generated from source: server/routes/presetsRoutes.js*