# frontend-store

- **Purpose**: Global client state via Redux Toolkit (4 slices, redux-logger in dev only).
- **Key Files**: `src/store/index.js`, `src/store/userSlice.js`, `src/store/themeSlice.js`, `src/store/toastSlice.js`, `src/store/configSlice.js`
- **Dependencies**: (none)
- **Dependents**: frontend-app, frontend-pages, frontend-components, frontend-lib
- **Exposes**: `store`; `user` (session/role), `theme` (resolved light/dark), `toast` (notifications), `config` (remote admin config).
