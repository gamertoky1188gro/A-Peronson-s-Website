# backend-tui

- **Parent**: (none — ops tool)
- **Purpose**: Neon terminal dashboard for live logs (`npm run logs`) — blessed UI. 27 files.
- **Key Files**: `server/tui/index.js`, `app.js`, `logList.js`, `inspector.js`, `sidebar.js`, `statusBar.js`, `topbar.js`, `panels.js`, `bottomPanels.js`, `overlays.js`, `contextMenu.js`, `filterBar.js`, `tabs.js`, `theme.js`, `state.js`, `workspace.js`, `effects.js`, `overview.js`, `jsonTree.js`, `parseWorker.js`, `workerPool.js`, `wsClient.js`, `ink/{index.js,app.jsx,app.mjs}`
- **Dependencies**: backend-log
- **Dependents**: (none — ops tool)
- **Exposes**: Clickable log list, inspector (Metadata/JSON/Stack/Raw/Flow/Diff tabs with DevTools-style waterfall), level+category filter chips, metrics/timeline/heatmap/latency-histogram panels, session recorder, workspaces, multi-server tabs, theme picker, `--mode-more-cool` neon mode.

## Gotchas (Windows blessed)
- `blessed` is installed as an **alias** of `neo-blessed@0.2.0` (`"blessed": "npm:neo-blessed@^0.2.0"`). **Always `import from "blessed"`, never `"neo-blessed"** — blessed-contrib and the TUI must share one instance.
- `blessed.screen({ forceUnicode: true })` is **mandatory** — blessed silently disables `fullUnicode` when it can't detect terminal unicode, so wide emoji count as 1 column and diff rendering merges/stales cells.
- `smartCSR: false` — Windows Terminal renders the scroll-region optimization badly, leaving stale regions until a mouse event.
- Animation loops are throttled (statusBar 400ms, logList 250ms; 250/150 in `-mmc` mode) or the terminal floods with full renders and drops frames.
- The launcher bat runs `mode con cols=220 lines=55` before `node`, or the log list truncates to ~10 visible chars.

## Keyboard
`j/k` nav · `?` search · `space` pause · `f` follow · `c`/`C-c` copy · `d` diff · `b`/`B` bookmarks · `e` ignore · `y` copy field · `r` regex · `m/t/h/l` panels · `s`/`S` workspace · `C-t` add server · `V` time-travel · `C-g` theme picker · `C-f` filter · `Tab` focus-next · `1-9`/`C-1-9` sections · `g` grouping · `?` help · `C-q` quit.