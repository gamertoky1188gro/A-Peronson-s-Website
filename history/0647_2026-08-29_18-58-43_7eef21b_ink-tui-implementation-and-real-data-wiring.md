# Commit 0647 — 7eef21b

| Field | Value |
|-------|-------|
| **Commit Number** | 0647 |
| **Commit Hash** | 7eef21b084a71809a9e7b7cebe646fc0ce23280e |
| **Parent Hash** | d7959c8747d5299527212f936088f0573bee3fb1 |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-08-29 18:58:43 |
| **Branch** | main |
| **Files Changed** | 19 |
| **Additions** | 4,631 |
| **Deletions** | 58 |
| **Net Change** | +4,631/−58 |
| **Merge Commit** | No |

## Ink-Based Alternative TUI Implementation with Real-Data Wiring

This commit adds an alternative Ink-based (React for CLI) implementation of the NEON//OBSERVE TUI alongside the existing blessed-based version. It also wires real data sources into the blessed TUI, replacing hardcoded values with actual runtime metrics. The commit introduces the `--ink` flag for launching the React-based terminal interface and `--mode-more-cool` (`-mmc`) for the max-neon visual mode.

The Ink TUI provides a React component architecture for the terminal UI, while the blessed TUI receives significant enhancements including real connection state tracking, live sidebar statistics, worker/queue metrics, and bookmark persistence across reconnections.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| `server/tui/ink/app.jsx` | Ink App (JSX) | 1,706 | 0 | +1,706 |
| `server/tui/ink/app.mjs` | Ink App (Compiled) | 1,990 | 0 | +1,990 |
| `server/tui/ink/index.js` | Ink Entry Point | 43 | 0 | +43 |
| `server/tui/app.js` | Blessed App | 98 | — | ~98 |
| `server/tui/wsClient.js` | WebSocket Client | 47 | — | ~47 |
| `server/tui/topbar.js` | Top Bar | 11 | — | ~11 |
| `server/tui/sidebar.js` | Sidebar | 18 | — | ~18 |
| `server/tui/statusBar.js` | Status Bar | 2 | — | ~2 |
| `server/tui/logList.js` | Log List | 2 | — | ~2 |
| `server/server.js` | Server | 43 | — | ~43 |
| `server/services/esignRetryService.js` | Esign Service | 11 | — | ~11 |
| `server/services/imageQueue.js` | Image Queue | 4 | 0 | +4 |
| `server/services/videoQueue.js` | Video Queue | 4 | 0 | +4 |
| `server/log/parsers.js` | Parsers | 4 | 0 | +4 |
| `package.json` | Package Config | 3 | 0 | +3 |
| `.gitignore` | Git Ignore | 2 | 0 | +2 |
| `AGENTS.md` | Documentation | 8 | 0 | +8 |

## Detailed Diff Analysis

### `server/tui/ink/app.jsx` (+1,706/−0)

A complete React-based TUI implementation using Ink (React for CLIs). Features:
- **NeonObserveApp** main component with full state management
- **TopBar** with live connection status, recording indicator, pause/follow/glow toggles
- **Sidebar** with workspace and service navigation, live stats footer
- **LogArea** with search, filter chips (level-based), scrollable log list
- **Inspector** with Metadata/JSON/Stack/Raw tabs and request flow visualization
- **StatusBar** with CPU/RAM, Redis status, queue depth, latency metrics
- **Toast** notifications and **Modal** for detailed log inspection
- Mouse support with hit-testing for panel navigation
- Shift+mouse for text selection mode
- Custom keyboard handler with shift-aware text selection
- Session recorder UI with start/stop/replay
- Traffic heatmap visualization
- Sparkline charts for live telemetry
- Neon color palette (neonCyan, neonViolet, neonPink, neonGreen, neonAmber)
- Glowing dividers and border effects
- Level-specific icons (● info, ◆ debug, ✔ success, ▲ warn, ✖ error, 🔥 critical)

### `server/tui/ink/index.js` (+43/−0)

Entry point for the Ink-based TUI:
- Babel transpilation of JSX with `@babel/preset-react`
- Caching of compiled output to `.cache/app.mjs`
- Error boundary for render error handling
- WebSocket URL configuration from environment or localhost

### `server/tui/ink/app.mjs` (+1,990/−0)

Compiled JavaScript output of the Ink JSX app (cached build artifact).

### `server/tui/app.js` (+98/−0)

Blessed TUI enhancements:
- **Mode-more-cool** (`-mmc`/`--mmc`/`--cool`): Sets glow intensity to 80, starts border pulse animation cycling panel borders through `pulseColor(COLORS.selected)` every 180ms
- **`_startBorderPulse()`**: Animates all 5 panel borders with electric neon pulse
- **Real connection state**: `topbar.setOnline()` driven by WebSocket events
- **Live sidebar footer**: `sidebar.setLiveInfo()` with actual source/parser/stream counts
- **Worker/queue tracking**: `markWorker()` at each service start, `queueDepth()` polling every 5s
- **Snapshot bookmarks**: Server-side bookmark set loaded on connect, entries marked `bookmarked`
- **`_updateConnectionState()`**: Syncs online/offline status across topbar, sidebar, and tab bar
- Faster animation ticks in cool mode (250ms/150ms vs 400ms/250ms)

### `server/tui/wsClient.js` (+47/−0)

WebSocket client enhancements:
- New message type handlers: `query_result`, `heatmap`, `recorder`, `record_stop_ok`, `clear_ok`
- New methods: `requestFlow()`, `heatmap()`, `recordStart()`, `recordStop()`, `clear()`
- Proper handler cleanup on close (nullify onopen/onmessage/onerror/onclose before close)

### `server/tui/topbar.js` (+11/−0)

- `setCool()` method for cool mode badge display
- Cool badge "✦ COOL" shown in topbar when in max-neon mode
- Configurable animation interval via `options.animMs`

### `server/tui/sidebar.js` (+18/−0)

- `setLiveInfo({sources, parsers, live})` for dynamic footer display
- Footer now shows actual source count, parser count, and connection status
- Pluralization for source/parser counts

### `server/tui/statusBar.js` (+2/−0)

- Configurable animation interval via `options.animMs`

### `server/tui/logList.js` (+2/−0)

- Configurable animation interval via `options.animMs`

### `server/server.js` (+43/−0)

- Worker tracking: `markWorker()` called at syslog, esign, video queue, and image queue start sites
- Queue depth polling: Every 5s sums queue depths from video, image, and esign services
- `logHub.setRuntimeMetrics({workers, workQ})` for live TUI display

### `server/services/videoQueue.js` (+4/−0)

- Added `queueDepth()` export returning current `QUEUE.length`

### `server/services/imageQueue.js` (+4/−0)

- Added `queueDepth()` export returning current `QUEUE.length`

### `server/services/esignRetryService.js` (+11/−0)

- Added `queueDepth()` async export reading retry list length from local storage

### `server/log/parsers.js` (+4/−0)

- Added `parserCount()` export returning registered parser plugin count

### `package.json` (+3/−0)

- Added `ink` (v7.1.1) and `ink-text-input` (v6.0.0) dependencies
- Added `logs:ink` script: `node server/tui/index.js --ink`

### `.gitignore` (+2/−0)

- Added `server/tui/ink/.cache/` to ignore Babel compilation cache

### `AGENTS.md` (+8/−0)

- Documentation for mode-more-cool feature
- Real data wiring notes for connection state, sidebar footer, and worker metrics
- Snapshot bookmarks documentation

## Why This Change Was Needed

The blessed-based TUI was functional but used hardcoded values for several metrics. This commit:
1. Provides an alternative Ink-based UI for developers who prefer React component architecture
2. Wires actual runtime data into the TUI (connection state, source counts, queue depths)
3. Adds the mode-more-cool visual enhancement for developer enjoyment
4. Implements snapshot bookmark persistence across reconnections

## Was It Useful

Very useful. The Ink TUI provides a modern React-based alternative to the blessed TUI. The real-data wiring makes the TUI significantly more accurate and useful for monitoring. The mode-more-cool feature, while cosmetic, demonstrates the TUI's extensibility and adds personality to the developer tooling.

## Impact Analysis

- **Monitoring Accuracy:** Real connection state and metrics replace hardcoded values
- **Developer Choice:** Two TUI implementations (blessed and Ink) for different preferences
- **Visual Polish:** Mode-more-cool adds distinctive neon aesthetic
- **Reliability:** Bookmark persistence prevents data loss on reconnect
- **Service Visibility:** Worker count and queue depth now visible in real-time

## Relationship to Surrounding Commits

Follows the full TUI implementation (commit 0646) and precedes the Ink TUI visibility fix (commit 0648). This commit enhances the TUI with real data and an alternative implementation.

## Confidence Notes

**Confidence: High** — The diff is well-structured with clear additions. New files are clearly the Ink implementation, and modifications to existing files are focused enhancements. The "meow" commit message is deceptive given the substantial infrastructure work.

## Optional Technical Details

- Ink uses React's reconciler for terminal rendering
- The Ink app is compiled from JSX via Babel on first run, cached in `.cache/`
- Worker tracking uses a `Set<string>` to count unique started workers
- Queue depth polling runs every 5 seconds via `setInterval`
- The border pulse animation uses `pulseColor()` from effects.js to cycle hues
- Snapshot bookmarks arrive as an array of entry IDs in the WebSocket hello message
