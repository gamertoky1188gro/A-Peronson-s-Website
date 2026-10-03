# backend-tui

- **Purpose**: Neon terminal dashboard for live logs (`npm run logs`) — blessed UI plus newer Ink rewrite.
- **Key Files**: `server/tui/index.js`, `server/tui/app.js`, `server/tui/logList.js`, `server/tui/inspector.js`, `server/tui/sidebar.js`, `server/tui/statusBar.js`, `server/tui/panels.js`, `server/tui/ink/app.jsx`
- **Dependencies**: backend-log
- **Dependents**: (none — ops tool)
- **Exposes**: Clickable log list, inspector (Metadata/JSON/Stack/Raw/Flow/Diff tabs with DevTools-style waterfall), level+category filter chips, metrics/timeline/heatmap/latency-histogram panels, session recorder, workspaces, multi-server tabs, `--mode-more-cool` neon mode.
