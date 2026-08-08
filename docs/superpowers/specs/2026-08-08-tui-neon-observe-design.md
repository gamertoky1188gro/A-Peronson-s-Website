# NEON//OBSERVE — Restyle Log TUI to HTML Mockup Design

Date: 2026-08-08

## Goal

Translate the HTML mockup `C:\Users\USER\Downloads\preview.html` (NEON//OBSERVE Server
Log Observatory) into the existing blessed TUI (`server/tui/`), producing a UI that is
**100% similar in layout and styling** to the mockup while streaming **real log data**
from the existing WS backend (`/ws/logs`).

## Guiding principle

HTML provides **styling + layout**. Features are merged from BOTH the HTML and the TUI.
Every existing TUI feature that the HTML has no style for stays working; placement is at
the implementer's discretion.

## Non-goals / frozen pieces

- `wsClient.js`, `state.js` store, `effects.js`, `theme.js`, `panels.js` popups,
  `overlays.js`, `workerPool.js`, `log/` (categories, search, parsers), the server — all
  unchanged. This is a front-end (TUI layout/widget) restyle only.
- No data-layer changes; all numbers are real (`stats.byLevel`, `stats.reqRate`, heatmap
  buckets, request-flow entries, system CPU/RAM sampling).

## Layout skeleton

```
┌ topbar (1 row): NEON//OBSERVE · ● SERVER ONLINE pill · REC Pause Follow Glow ─┐
├ tabbar (1 row, kept TUI feature, restyled thin) ─────────────────────────────┤
│ ┌sidebar┐ ┌ overview cards (hero + INFO WARN ERROR REQ/s) ──────────────┐ ┌──┐│
│ │WORK-   │ ├ toolbar (⌕ search / + level chips + category chips + ──────┤ │IN││
│ │SPACE   │ │  Filter Export)                                            │ │SP││
│ │SERVICES│ ├ log list — 2-line cards ────────────────────────────────────┤ │EC││
│ │summary │ ├ bottom telemetry: sparkline | heatmap | session recorder ───┤ │TO││
│ └────────┘ └─────────────────────────────────────────────────────────────┘ │R ││
├ status footer (1 row): LIVE · rate cpu ram redis q w lat drop filt regex ──┤ └──┘
```

### Row/column budget (at 220×55)

- Topbar: height 1, full width.
- Tabbar: height 1, full width.
- Body top = 2.
- Sidebar: `left: 0`, `width: panelSize.sidebar` (default 22).
- Inspector: `right: 0`, `width: panelSize.inspector` (default 50).
- Center column spans sidebar→inspector:
  - Overview row: height 5 (4 content rows + border).
  - Toolbar: height 1.
  - Log list: `flex-1` (fills remaining height).
  - Bottom telemetry row: height 8.
- Footer: `top: 100%-1`, height 1.

## Component changes

### 1. Topbar (new widget in `app.js` — `TopBar` class in new file `topbar.js`)

- Left: `NEON//OBSERVE` brand (bold violet→cyan gradient feel via blessed colors),
  sublabel `SERVER LOG OBSERVATORY`.
- Middle: server pill `● SERVER ONLINE · backend/` (green dot pulse).
- Right: clickable buttons `● REC`, `⏸ Pause`, `⌄ Follow`, `◐ Glow`.
- Behaviors:
  - **REC** toggles `this.sessionOverlay.open()` / stop recorder (tie to existing
    `startRecorder`/`stopRecorder`).
  - **Pause** calls `togglePause()` (state).
  - **Follow** calls `toggleFollow()`.
  - **Glow** toggles glow intensity via `setGlowIntensity()` (already exists) — HIGH/LOW.
- Hit-testing via `mouse`/`click` with computed zones (same pattern as `filterBar.js`).

### 2. Sidebar (`sidebar.js`)

- Two grouped sections with uppercase micro-labels:
  - **WORKSPACE**: Overview, Live, Errors, Warnings, Info.
  - **SERVICES**: Requests, Assistant, Image Queue, Redis, Prisma, Syslog, Audit,
    Analytics, Workers, Favorites.
- Active row = HTML's gradient highlight: `{blue-bg}{black-fg}` bar + left accent.
- Unread badges (red ●N) kept; burst alert box kept; `⌘ help: ?` footer kept.
- Bottom: **WORKSPACE · production** card — "3 sources · 2 parsers · 1 live stream"
  using real counts where available (sources from `client.stats.sources`, fallback text).
- `CATEGORIES` from `categories.js` drives the rows; grouping by explicit key list.

### 3. Overview row (new `overview.js` — `Overview` class)

One bordered box, content is 5 cards on a single line:
- **hero**: `LIVE OBSERVABILITY / Backend · server logs / Canonical logger · request
  middleware · audit · syslog · workers`.
- **INFO** `<stats.byLevel.info.toLocaleString()>` · **WARN** · **ERROR** ·
  **REQ/SEC** `stats.reqRate`.
- Cards visually separated with `│` dividers; level-colored values (blue/amber/pink).
- Redraw on `store.on("stats")`.

### 4. Toolbar (restyled `filterBar.js`, repositioned to top of log area)

- Left: `⌕ / search…` zone → opens `openSearch()` on click (and `/`).
- Level chips `INFO DEBUG SUCCESS WARN ERROR CRITICAL` (toggle via `store.toggleLevel`).
- Category chips `REQ SYSLOG REDIS WORKER AUTH ASSISTANT IMAGE PRISMA`.
- Right: `☷ Filter`, `⇩ Export`, plus existing Pause/Follow/Regex/Time/Bkmk actions.
- Chips use HTML `.chip.on` look: active = cyan border/glow.
- Keep `_actionHit` zone tracking for click handling.

### 5. Log list 2-line cards (`logList.js`)

- Each entry renders as **2 rows** (card):
  - Line 1: `HH:MM:SS.xxx` (dim) + `LEVEL` (colored, padded) + tags on the right.
  - Line 2: `{bold}message{/}` + source subtext (`meta.source`/`data.source`/`category`)
    + duration badge + grouped `▶/▼ ×n`, bookmark ★, pin.
- Selection = electric-blue pulsing glow spanning **both** lines (existing glow loop).
- Hover = subtle bg highlight spanning both lines.
- Mouse math: `_indexAt` uses `row = floor((y - top - 1) / 2) + topIndex`; scroll/
  `_visibleRows`/`follow` account for 2× density.
- Search highlight, fresh-arrival neon pulse, smooth wheel scroll all kept.
- Row rendering extracted/rewritten inside `renderRow` → returns 2 lines.

### 6. Bottom telemetry row (new `bottomPanels.js`)

Three cards side by side inside one bordered box:
1. **LIVE TELEMETRY · last 60 sec** — sparkline of `reqRate` (rolling samples, reuse
   statusBar sampling or own 60-sample buffer).
2. **TRAFFIC HEATMAP · hour density** — compact 24h grid from heatmap buckets (bars per
   2-hour cell, like HTML `.heat`).
3. **SESSION RECORDER** — `[Last 30 min]` / `[Last hour]` buttons → `startRecorder`,
   REC state label (IDLE/RECORDING).
- `m/t/h` keys keep opening the full-size popup panels; histogram `l` popup unchanged.

### 7. Inspector (`inspector.js`)

Restyled body to match HTML:
- Header: `LEVEL · Event Inspector` + `source #id`.
- Divider, then kv metadata grid (Timestamp / Source / Message / Subsystem).
- **Request Flow** waterfall (`step · ─┤ bar … total ms`) from `request_flow` entries.
- **Payload** JSON block with colored keys (violet) / strings (green) / numbers (blue).
- Tabs kept: Metadata / JSON / Stack / Raw / Flow / Diff. Style tabs like `.itab`
  (active = raised box).
- Raw = monospace multi-line block (already exists; restyle colors).

### 8. Context menu / notifications / help

- Right-click context menu restyled to neon palette (keep all actions).
- Slide-in notifications: restyle to match HTML toast (violet border, glow).
- Help overlay: updated to document new topbar buttons + unchanged keys.

### 9. Status footer (`statusBar.js`)

- Restyle to HTML `.status`: `● LIVE` pulsing + stats with `│` separators +
  right-aligned `⌘ shortcut hints` line (kept on row with the existing data).
- All current fields kept: rate, total, err/warn/crit, req/s, cpu, ram, redis, queue,
  workers, latency, dropped, filtered, regex, REC state, clock.

## Data flow

- Store `stats` → overview cards, status bar, telemetry samples.
- Store `heatmap` → heatmap card + popup heatmap panel.
- Store `entries`/`filteredEntries` → log list (2-line cards).
- `request_flow` messages → inspector flow waterfall.
- No new server endpoints. No new WS messages.

## Error handling

- All new widgets guard against missing screen/width (non-TTY safety, as in the rest of
  the TUI).
- Empty stats → show `0`/`—`, never NaN.
- Heatmap with no buckets → blank grid, not crash.

## Testing

- `node --check` on all touched files.
- `npx biome check` on touched files (existing style: tabs, double quotes avoided,
  trailing commas).
- Smoke-run: launch TUI headless against running server (as done previously) and confirm
  it stays alive; then manual visual check by user at 220×55.

## Files touched

- `server/tui/app.js` — layout skeleton (rows/columns), topbar wiring.
- `server/tui/topbar.js` — NEW.
- `server/tui/overview.js` — NEW.
- `server/tui/bottomPanels.js` — NEW.
- `server/tui/sidebar.js` — grouped sections + workspace card.
- `server/tui/filterBar.js` — moved, restyled chips/toolbar.
- `server/tui/logList.js` — 2-line cards + mouse/scroll math.
- `server/tui/statusBar.js` — restyle only.
- `server/tui/inspector.js` — restyled body/tabs.
- `server/tui/contextMenu.js` — palette restyle (minor).
- `server/tui/overlays.js` — toast/notification restyle (minor).
