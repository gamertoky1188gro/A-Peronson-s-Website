# Blue Theme — Deep Sky Blue / Cyan Glass

Single source of truth: `src/theme/blueTheme.css` (values),
`src/theme/blueTheme.ts` (typed mirrors for JS),
`src/theme/theme-tokens.json` (machine-readable tokens).
Strict validator-side parser: `src/theme/themeParser.js`.
Regression suite: `tests/unit/themeRegression.test.js`.

## Design philosophy

One product, one progression: Deep Navy → Slate Surface → Sky Blue →
Royal/Strong Blue → Cyan Highlight. Blue carries brand/primary/info/focus;
cyan carries highlight/glass/glow/gradient endpoints. Emerald/amber/rose-red
stay strictly semantic (success/warning/danger) so the app never becomes
semantically confusing.

## Token groups

| Group | Tokens | Notes |
|---|---|---|
| Background | `--theme-slate-950 #020617`, `--theme-slate-900 #0f172a`, light `--theme-slate-50 #f8fafc` / `#ffffff` | Deepest/primary/light/pure surfaces from spec §1 |
| Surface | `--theme-surface` (adaptive: `#f8fafc` / `rgba(255,255,255,.05)`), `--theme-surface-solid` (`#ffffff` / `#020617`), glass/hover/active/selected via alpha variants | Alpha preserved, never flattened |
| Text | `--theme-text(-secondary,-muted,-faint,-bright)` adaptive | Dark UI `#f8fafc/#cbd5e1/#94a3b8`; light UI `#0f172a/#334155/#64748b` |
| Border | `--theme-border` adaptive + `--theme-border-accent`, full `--theme-{sky,blue,cyan,slate,…}` scales | Full-utility parsing: `border-rose-200` ≠ `border-r-2` |
| Primary | `#0ea5e9` primary, `#0284c7` deep, `#2563eb` strong, `#3b82f6` bright; hover/active/soft/contrast via scale + alpha | Separate tokens per state |
| Secondary/highlight | `#38bdf8` sky, `#22d3ee` cyan, `#60a5fa` soft blue | Glow + gradient endpoints |
| Ring/focus | `ring-[#3b82f6]/35`-style arbitrary supported; `--theme-accent` adaptive focus | |
| Shadow/glow | `--theme-shadow-1…101` (soft/standard/strong/blue/cyan/modal/card/button) + `.theme-glow-blue/cyan/soft` | Colored shadows incl. `shadow-sky-500/20`, `shadow-black/20` |
| Overlay | `--theme-black-*/--theme-slate-950-*` alpha ramp; `--theme-white-*` glass ramp | `bg-black/40`, `bg-white/5`, `bg-white/[0.03]` preserved |
| Gradient | `--theme-gradient-primary/--theme-gradient-hero` + ~140 audited `--theme-gradient-N/--theme-gradient-dark-N` | Linear/radial intent, multi-stop arbitrary, transparent stops kept |
| Success/warning/danger/info | emerald/amber/rose + red scales, soft/border/text/strong per state | Never recolored blue |
| Disabled | slate-based bg/text/border | |
| Input/button/card/modal/tooltip/nav | `--theme-input-placeholder`, `--theme-surface`, chat roles, card shadows | See CSS |
| Code | prism/recharts use chart roles below | |
| Chart | `chartPiePalette` / `chartPaletteCompact` in `blueTheme.ts`; `DEFAULT_PIE_PALETTE` in `AdminPanel.utils.js` | Content-specific, intentionally multi-hue (see retained list) |
| Scrollbar/selection/skeleton | `::selection rgba(14,165,233,.28)`; skeleton shimmer keyframes in `tailwind.config.js` | |

## Dark mode + light mode

Same semantic names, different values. Light in `:root`; dark under
`.dark`, `[data-theme="blue"][data-mode="dark"]`, and container-scoped
`[data-mode="dark"]` / `[data-mode="light"]` (explicit container wins).
Runtime: `<html data-theme="blue" data-mode="dark|light">`.
`setTheme("dark"|"light"|"system")` (mode) + `setThemeName("blue")` /
`ThemeProvider.setThemeName` (name guard). Boot script in `index.html`
sets both attributes pre-paint (no FOUC).

## Runtime switching

Change any `--theme-*` value in `blueTheme.css` → every consumer updates;
components need no edits. Accent switching uses the static
`ACCENT_THEMES` map (`accentClasses()` in `theme-utils.ts`); every string
appears literally so Tailwind generates it. Fragile
``border-${accent}-400/20`` interpolation is banned (migrated in
`AdminPanel.jsx`, `admin/shared/index.jsx`).

## Legacy migration aliases

`src/color palettes css/*_color_palettes.css` are **reference-only audit
artifacts** (never imported; see `color palettes css/index.css` header).
No component consumes them, so no global alias layer is needed and no
`:root` namespace collision is possible. When migrating a component to
variables, import its single palette file directly (documented in that
index) and map `--color-*` → `--theme-*` per the table above.

## Accessibility notes

Text tokens pair muted-on-surface at ≥4.5:1 in both modes (slate-500/400
on white/navy checked at audit). Focus rings always use accent tokens,
never removed for aesthetics. `prefers-reduced-motion` disables blob
animations. Loaders use `#0ea5e9` (was `#6100ff`/`#3b00ff`) for
consistency with focus/primary.

## Intentionally retained non-theme colors

1. `SharedPost.jsx avatarColorClass` (`from-rose-500 to-pink-600`,
   `from-violet-500 to-purple-600`, …) — hash-distinguishes authors.
2. `PostDetailModal.jsx avatarColors` (`bg-violet-500`, `bg-pink-500`, …) —
   same hash-avatar purpose.
3. `DEFAULT_PIE_PALETTE` / `chartPiePalette` / `chartPaletteCompact` —
   chart-series distinction requires multi-hue.
4. `index.html` boot-loader neon (`#ff00ff`/`#00ffff` rings) + `NeonAtom`
   (`#00ffff`/`#ff00ff`/`#00bfff`) — loader identity, pre-bundle splash only.
5. Status badges (`statusBadge()`: amber/emerald/rose/slate; `OrderManagement`
   flow map; `PaymentProofReviewModal` emerald/rose) — semantic states.
6. `AttachmentPreviewModal` code-render colors (`#ccc/#999/#e2777a/#6196cc/…`)
   — file-content syntax theme, not application UI.
7. `BotLogo` (`#0A66C2`/`#fff`) — brand logo asset (gtBlue).
8. `TexHub` ambient conic blobs (`rgba(14,165,233)/rgba(99,102,241)/rgba(6,182,212)`)
   + `WatermarkOverlay` neutral-black repeating gradient + `JoinRequestPage`
   slate scrim — in-theme or neutral overlays.
9. Chat surfaces (`theme.textPrimary/textMuted/inputBg` in `ChatInterface`,
   `MessageArea`, `RightPanel`, `ThreadList`) — already consume the canonical
   chat roles from `blueTheme.ts` (`chatThemeVars`); fully dynamic.

## Validation

Independent audit: `python scripts/theme-audit.py` (no shared code with the
generator/parser). Regression: `tests/unit/themeRegression.test.js`.
Coverage targets: missing = incorrect = partial = 0 for static UI refs.
