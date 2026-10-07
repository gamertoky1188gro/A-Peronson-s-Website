# Blue Theme — Deep Sky Blue / Cyan Glass

> This file documents the DEFAULT theme. The full 12-theme catalog lives in
> [`themes/`](./themes/) — see "Theme catalog" below. Every theme shares the
> same token NAMES; only values change per `[data-theme]`.

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

## Theme catalog (12 personalities, one token contract)

`blue` is preserved byte-for-byte as the reference. The 11 generated themes
(`src/theme/themes/<slug>.css`, built by `scripts/generate-themes.py` from
`scripts/theme_specs.py`) redefine all 838 token values by color-role
substitution — same names, same alphas, same gradient/shadow geometry, new
hue personality. Token parity is enforced by `scripts/theme-audit.py`
(`THEMES` section) and `tests/unit/themeRegression.test.js`.

Tailwind utilities themselves are theme-dynamic: `themes/tailwind-tokens.css`
maps every used `--color-<family>-<shade>` to its `var(--theme-…)` twin, so
`bg-sky-500`, `dark:bg-slate-950`, `shadow-sky-500/20` etc. re-skin at
runtime with zero component edits.

### Authored overlays (design vocabulary on top of generated contract)

Seven themes carry hand-authored overlays (all following the aurora pattern:
generated 838-token base first, overlay appended after and winning on
conflict; draft bare `:root,` / `.dark` selectors stripped at install so
values can't leak across themes):

- `aurora` (`scripts/aurora-overlay.css`): true scales, semantic roles, signature gradients/glows.
- `violet` (`scripts/violet-overlay.css`): true violet brand `#8B5CF6`, `sky → violet` var-refs, obsidian neutrals.
- `blue` (`scripts/blue-overlay.css` → `src/theme/themes/blue-overlay.css`, `blueTheme.css` stays byte-identical).
- `sapphire` (`scripts/sapphire-overlay.css`): sapphire-led `#405CE3`, azure/sky support, restrained gold, layered shadows.
- `arctic` (`scripts/arctic-overlay.css`): cyan-led `#0891B2`, ocean neutrals, polar-gold restraint, full compat customs.
- `emerald` (`scripts/emerald-overlay.css`): Emerald Noir v2, noir→forest→panel depth, brand/success separation.
- `blurple` (`scripts/blurple-overlay.css`): Electric Prism, true blurple/violet/cyan, distinct semantics.
- `mono` (`scripts/mono-overlay.css`): obsidian neutrals + desaturated blue-whisper, monochrome-first.
- `plasma` (`scripts/plasma-overlay.css`): pink brand, ultraviolet secondary/AI, electric-blue data/nav, ion-cyan realtime.
- `solaris` (`scripts/solaris-overlay.css`): orange → radiant pink → ultraviolet master, solar-eclipse dark.
- `forest` (`scripts/forest-overlay.css`): pine/leaf brand, emerald premium, teal realtime, cyan highlights.
- `crimson` (`scripts/crimson-overlay.css`): crimson brand, pink expressive, violet AI/premium, midnight-crimson dark.

In all cases the generated base underneath keeps the machine contract (`custom-*`
twins, alpha variants, numbered gradients/shadows) that components depend
on — so the authored layers get the Radix/Primer-style semantic hierarchy
without breaking token parity.

| # | Slug | Name | Primary → Secondary → Highlight | BG / Surface | Glow × | Gradient language |
|---|---|---|---|---|---|---|
| 1 | `blue` | Deep Sky Blue / Cyan Glass (default, preserved) | `#0EA5E9` → `#2563EB` → `#22D3EE` | `#020617` / `#0F172A` | 1.0 | sky → blue → cyan |
| 2 | `aurora` | Midnight Aurora | `#6366F1` → `#3B82F6` → `#22D3EE` | `#050816` / `#0B1020` | 1.1 | indigo → blue → cyan |
| 3 | `violet` | Obsidian Violet | `#8B5CF6` → `#6366F1` → `#C4B5FD` | `#09090B` / `#0F0B1A` | 1.15 | violet → indigo → blue |
| 4 | `sapphire` | Royal Sapphire | `#2563EB` → `#1D4ED8` → `#60A5FA` | `#020617` / `#081226` | 1.05 | sapphire → azure → sky |
| 5 | `arctic` | Arctic Ocean | `#0891B2` → `#0EA5E9` → `#67E8F9` | `#06131F` / `#0B1F2E` | 1.0 | cyan → sky → sea |
| 6 | `emerald` | Emerald Noir | `#10B981` → `#14B8A6` → `#6EE7B7` | `#06110D` / `#0D1B15` | 1.05 | emerald → teal → cyan |
| 7 | `blurple` | Blurple Fusion | `#5865F2` → `#7C3AED` → `#818CF8` | `#0B0D17` / `#15182A` | 1.2 | blurple → violet → cyan |
| 8 | `mono` | Obsidian Mono | `#737373` → `#525252` → `#60A5FA`* | `#000000` / `#0A0A0A` | 0.35 | white → slate / blue whisper |
| 9 | `plasma` | Cyberpunk Plasma | `#FF2DAA` → `#8B5CF6` → `#FF6EC7` | `#06020F` / `#110A1D` | 1.3 | pink → violet → blue → cyan |
| 10 | `solaris` | Solaris | `#F97316` → `#EC4899` → `#8B5CF6` | `#0C0A09` / `#1C1917` | 1.2 | orange → pink → violet |
| 11 | `forest` | Forest Glass | `#16A34A` → `#059669` → `#86EFAC` | `#06110D` / `#0D1B14` | 1.0 | green → emerald → teal |
| 12 | `crimson` | Crimson Night | `#E11D48` → `#DB2777` → `#A78BFA` | `#0D0509` / `#1C0B12` | 1.25 | rose → pink → violet |

\* `mono` deliberately uses an accessible mid-gray primary (`#737373`, ~4.7:1
with white text) instead of pure white so white-text buttons keep contrast in
both modes; the white→slate identity lives in surfaces, text, and gradients.

Per-theme design axes (all in `theme_specs.py` + generated CSS):
- **Background philosophy / surface elevation** — `neutrals.bg/surface/elev` (+ deepest ink).
- **Text contrast** — explicit `texts` per mode (dark hi/sec/mut, light hi/sec/mut).
- **Border character** — neutral-200/800 borders + accent-tinted `border-accent`.
- **Glass opacity** — dark `--theme-surface` alpha per theme (0.03 mono … 0.07 plasma).
- **Shadow temperature** — shadow tints follow the theme glow/primary automatically.
- **Success/warning/danger** — per-theme ramps (e.g. blurple uses Discord `#43B581`/`#FEE75C`/`#ED4245`; mono mutes them; plasma neons them).
- **Chart palette** — 8 hand-picked colors per theme (`themes.ts` → `THEME_CHARTS`).
- **Chat palette** — 12 roles × light/dark derived from theme neutrals + primary.
- **Light + dark mode** — same names; light scope under `[data-theme]`, dark under `[data-theme][data-mode="dark"]` / `.dark[data-theme]`.

### Switching themes at runtime
```js
import { useTheme } from "./lib/ThemeProvider.jsx";
const { themeName, setThemeName } = useTheme();
setThemeName("plasma"); // persisted to localStorage, applied to <html data-theme>
```

Redux: `dispatch(setThemeName("aurora"))` (invalid slugs rejected). Pre-paint
boot script in `index.html` restores the stored theme. Registry:
`src/theme/themes/registry.js` (`THEMES`, `VALID_THEMES`, `DEFAULT_THEME`).

### Known runtime limits (honest)

- ~~Arbitrary literal colors (`bg-[#0A66C2]`, `dark:bg-[#1f2448]` chat tiles)
  stay fixed across themes~~ — **migrated** by `scripts/migrate-literals.py`:
  ~100 UI-theming arbitrary hex literals (page navies, brand `#0A66C2`,
  blue accents, chat dark tiles, light tinted surfaces) now resolve through
  `var(--theme-…)` twins, so all 12 themes re-skin them. Guarded by the
  denylist test in `themeRegression.test.js`.
- Deliberately literal forever: NeonAtom loader splash, BotLogo SVG brand
  marks, code-syntax highlight colors, CyberpunkCursor/NeonAtom ring colors.
- Avatar hash palettes and pie charts intentionally keep multi-hue variety
  (per-theme chart palettes exist in `themes.ts` for new chart work).

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
