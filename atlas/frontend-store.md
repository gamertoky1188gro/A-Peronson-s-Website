# frontend-store

- **Purpose**: Global client state via Redux Toolkit (4 slices, redux-logger in dev only).
- **Key Files**: `src/store/index.js`, `src/store/userSlice.js`, `src/store/themeSlice.js`, `src/store/toastSlice.js`, `src/store/configSlice.js`
- **Dependencies**: (none)
- **Dependents**: frontend-app, frontend-pages, frontend-components, frontend-lib, frontend-theme
- **Exposes**: `store`; `user` (session/role), `theme` (mode + themeName slug), `toast` (notifications), `config` (remote admin config). `themeSlice` also exports `applyThemeToDOM()`, `setThemeNameBySlug()`, `setThemeNameLegacy()`, `setCanonicalTheme()` — `applyThemeToDOM` is what writes `data-mode`, `.dark`, and `<meta name="theme-color">` at runtime.
