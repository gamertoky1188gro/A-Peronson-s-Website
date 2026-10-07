#!/usr/bin/env python3
"""Generate the 11 theme personalities from the blue template (blue preserved).

Mechanism (structural parity, complete personality):
  same token NAMES as blueTheme.css / theme-tokens.json, theme-valued VALUES.
  Every concrete color in the blue template is mapped to a theme color by
  nearest-point lookup over the template's own (family, shade) values, then
  re-emitted through the target theme's interpolated ramps. Alphas, gradient
  geometry, shadow geometry, token counts: all preserved exactly.

Outputs (generated; do not hand-edit):
  src/theme/themes/<slug>.css        full theme (light scope + dark scope)
  src/theme/themes/tokens.json       machine-readable tokens for all themes
  src/theme/themes/themes.ts         chart palettes + registry data for JS
  src/theme/themes/registry.js        theme order/labels/default for runtime
  src/theme/themes/tailwind-tokens.css  @theme var-indirection (Tailwind->vars)

Usage: python scripts/generate-themes.py [--check]
  --check: verify parity only (used by audit/tests), no writes.
"""
import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from theme_specs import THEMES, THEME_ORDER  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[1]
THEME_DIR = ROOT / "src" / "theme"
OUT_DIR = THEME_DIR / "themes"
TOKENS_PATH = THEME_DIR / "theme-tokens.json"

SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

# Tailwind family -> theme ramp key.
FAMILY_RAMP = {
    "sky": "primary", "blue": "secondary", "cyan": "accent", "indigo": "secondary",
    "violet": "accent", "purple": "accent", "fuchsia": "accent", "pink": "accent",
    "emerald": "success", "green": "success", "teal": "success",
    "amber": "warning", "yellow": "warning", "orange": "warning",
    "rose": "danger", "red": "danger",
    "slate": "neutral", "gray": "neutral", "zinc": "neutral",
}
GLOW_FAMILIES = {"sky", "cyan", "blue", "indigo", "violet", "purple", "fuchsia", "pink"}
TW_FAMILIES = ("sky", "blue", "cyan", "slate", "indigo", "violet", "emerald", "amber",
               "rose", "red", "gray", "zinc", "green", "orange", "yellow", "teal", "pink",
               "fuchsia", "purple")


def hx(h):
    h = h.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def to_hx(rgb):
    return "#%02x%02x%02x" % tuple(max(0, min(255, round(c))) for c in rgb)


def mix(a, b, t):
    ra, rb = hx(a), hx(b)
    return to_hx(tuple(ra[i] + (rb[i] - ra[i]) * t for i in range(3)))


def build_ramp(light100, base500, dark900):
    """Full 50-950 ramp from (100, 500, 900) anchors via piecewise interpolation."""
    pts = {100: light100, 500: base500, 900: dark900}
    out = {}
    for s in SHADES:
        if s == 100 or s == 500 or s == 900:
            out[s] = pts[s]
        elif s == 50:
            out[s] = mix(light100, "#ffffff", 0.45)
        elif s == 950:
            out[s] = mix(dark900, "#000000", 0.45)
        elif s < 500:
            t = (s - 100) / 400.0
            out[s] = mix(light100, base500, t)
        else:
            t = (s - 500) / 400.0
            out[s] = mix(base500, dark900, t)
    return out


def parse_color(value):
    """Return (rgb-tuple, alpha-or-None) or None for non-concrete values."""
    v = value.strip()
    m = re.fullmatch(r"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})", v)
    if m:
        return hx(v), None
    m = re.fullmatch(r"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)", v)
    if m:
        return (int(m.group(1)), int(m.group(2)), int(m.group(3))), (float(m.group(4)) if m.group(4) is not None else None)
    return None


def emit(rgb, alpha):
    if alpha is None:
        return to_hx(rgb)
    a = round(alpha, 3)
    return f"rgba({rgb[0]}, {rgb[1]}, {rgb[2]}, {a:g})"


def dist(a, b):
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2


def load_template():
    data = json.loads(TOKENS_PATH.read_text(encoding="utf-8"))
    return data["tokens"]


TOKEN_RE = re.compile(r"^--theme-([a-z]+)-(\d+)(?:-(\d+|\[\d.\d+\]))?$")


def canonical_points(tokens):
    """(rgb -> (family, shade)) lookup from template family-shade values + specials."""
    pts = []
    for name, spec in tokens.items():
        if spec["kind"] != "fixed":
            continue
        m = TOKEN_RE.match(name)
        if not m or m.group(1) not in FAMILY_RAMP:
            continue
        parsed = parse_color(spec["value"])
        if parsed and parsed[1] is None:
            pts.append((parsed[0], m.group(1), int(m.group(2))))
    pts.append((hx("#0a66c2"), "brand", 500))
    pts.append((hx("#004182"), "brand", 700))
    pts.append((hx("#ffffff"), "keep", 0))
    pts.append((hx("#000000"), "keep", 0))
    return pts


class Theme:
    def __init__(self, slug, spec, tokens, points):
        self.slug = slug
        self.spec = spec
        self.tokens = tokens
        self.points = points
        self.ramps = {k: build_ramp(*v) for k, v in spec["ramps"].items()}
        n = spec["neutrals"]
        self.ramps["neutral"] = self._neutral_ramp(n["paper"], n["mid"], n["ink"])
        self.ramp500 = {k: v[500] for k, v in self.ramps.items()}

    @staticmethod
    def _neutral_ramp(paper, mid, ink):
        pts = {50: paper, 500: mid, 950: ink}
        out = {}
        for s in SHADES:
            if s in pts:
                out[s] = pts[s]
            elif s < 500:
                out[s] = mix(paper, mid, (s - 50) / 450.0)
            else:
                out[s] = mix(mid, ink, (s - 500) / 450.0)
        return out

    def themed(self, family, shade):
        if family == "keep":
            return None  # keep original
        if family == "brand":
            return self.spec["brand"] if shade <= 500 else self.spec["brand_hover"]
        ramp = self.ramps[FAMILY_RAMP[family]]
        return ramp.get(shade, ramp[500])

    def map_color(self, value, boost_glow=False):
        """Map one blue-template color value to this theme. Returns new string."""
        parsed = parse_color(value)
        if parsed is None:
            return value  # transparent / var() / keywords pass through
        rgb, alpha = parsed
        if rgb == (255, 255, 255) or rgb == (0, 0, 0):
            return value  # pure white/black stay neutral in every theme
        best, best_d = None, None
        for prgb, fam, shade in self.points:
            d = dist(rgb, prgb)
            if best_d is None or d < best_d:
                best, best_d = (fam, shade), d
        fam, shade = best
        new_hex = self.themed(fam, shade)
        if new_hex is None:
            return value
        new_rgb = hx(new_hex)
        a = alpha
        if a is not None and boost_glow and fam in GLOW_FAMILIES:
            a = min(0.95, round(a * self.spec.get("glow_boost", 1.0), 3))
        return emit(new_rgb, a)

    def sub(self, text, boost_glow=False):
        def repl_hex(m):
            return self.map_color(m.group(0), boost_glow)
        def repl_rgba(m):
            return self.map_color(m.group(0), boost_glow)
        text = re.sub(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b", repl_hex, text)
        text = re.sub(r"rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)", repl_rgba, text)
        return text


def adaptive_roles(theme):
    s, t, n = theme.spec, theme.spec["texts"], theme.spec["neutrals"]
    r = theme.ramps
    glass = s.get("glass", 0.05)
    return {
        "--theme-accent": {"light": r["primary"][600], "dark": r["primary"][300]},
        "--theme-accent-strong": {"light": r["primary"][700], "dark": r["primary"][300]},
        "--theme-border": {"light": theme.ramps["neutral"][200], "dark": theme.ramps["neutral"][800]},
        "--theme-border-accent": {
            "light": emit(hx(r["accent"][200]), 0.7), "dark": emit(hx(r["primary"][500]), 0.2)},
        "--theme-input-placeholder": {"light": t["lt_mut"], "dark": t["dk_mut"]},
        "--theme-success-text": {"light": r["success"][700], "dark": r["success"][300]},
        "--theme-warning-text": {"light": r["warning"][700], "dark": r["warning"][300]},
        "--theme-surface": {"light": theme.ramps["neutral"][50], "dark": f"rgba(255, 255, 255, {glass:g})"},
        "--theme-surface-solid": {"light": "#ffffff", "dark": n["bg"]},
        "--theme-text": {"light": t["lt_hi"], "dark": t["dk_hi"]},
        "--theme-text-bright": {"light": t["lt_hi"], "dark": t["dk_hi"]},
        "--theme-text-faint": {"light": t["lt_mut"], "dark": t["dk_mut"]},
        "--theme-text-muted": {"light": t["lt_mut"], "dark": t["dk_sec"]},
        "--theme-text-secondary": {"light": t["lt_sec"], "dark": t["dk_sec"]},
    }


def chat_roles(theme):
    s, t, n = theme.spec, theme.spec["texts"], theme.spec["neutrals"]
    r = theme.ramps
    thread_active_dk = to_hx(tuple(a + (b - a) * 0.45 for a, b in zip(hx(r["secondary"][900]), hx(n["elev"]))))
    return {
        "--theme-chat-accent": {"light": r["primary"][500], "dark": r["primary"][500]},
        "--theme-chat-input": {"light": r["neutral"][100] if 100 in r["neutral"] else n["paper"], "dark": n["elev"]},
        "--theme-chat-muted": {"light": t["lt_mut"], "dark": t["dk_sec"]},
        "--theme-chat-page-bg": {"light": r["neutral"][50], "dark": n["bg"]},
        "--theme-chat-panel-bg": {"light": "#ffffff", "dark": n["surface"]},
        "--theme-chat-right-panel": {"light": "#ffffff", "dark": n["surface"]},
        "--theme-chat-shadow": {
            "light": "0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
            "dark": "0 10px 40px rgba(0,0,0,0.45)"},
        "--theme-chat-subpanel": {"light": "#ffffff", "dark": n["surface"]},
        "--theme-chat-text": {"light": r["neutral"][800], "dark": t["dk_hi"]},
        "--theme-chat-thread-active": {"light": r["primary"][50], "dark": thread_active_dk},
        "--theme-chat-thread-idle": {"light": "transparent", "dark": emit(hx(n["bg"]), 0.55)},
        "--theme-chat-tile": {"light": r["neutral"][100], "dark": n["elev"]},
    }


OVERLAY_DIR = pathlib.Path(__file__).resolve().parent


def parse_overlay_defs(text):
    """Parse overlay into (fixed_overrides, adaptive_overrides, chat_overrides).

    Mode tracking: base [data-theme] block applies to both modes first
    (dark-oriented defaults), then dark/light blocks override their mode.
    Multi-line values (gradients/shadows) are joined until ';'.
    """
    fixed, adaptive, chat = {}, {}, {}
    mode = "both"
    name, buf = None, []
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("[data-theme"):
            if 'data-mode="dark"' in s or ".dark[" in s or "[data-theme" in s and ".dark" in s:
                mode = "dark"
            elif 'data-mode="light"' in s or ":not(" in s:
                mode = "light"
            else:
                mode = "both"
            continue
        if s.startswith("/*") or s in ("{", "}", ""):
            continue
        m = re.match(r"(--theme-[a-z0-9\-\[\].]+)\s*:\s*(.*)$", s)
        if m and name is None:
            name, buf = m.group(1), [m.group(2)]
        elif name is not None:
            buf.append(s)
        else:
            continue
        if buf and buf[-1].rstrip().endswith(";"):
            value = " ".join(buf).rstrip().rstrip(";").strip()
            if name.startswith("--theme-chat-"):
                target = chat
            elif re.match(r"--theme-(text|border|surface|accent|success-text|warning-text|input-|bg|nav-|card-|modal-|link|control-|selection|scrollbar|info|success|warning|danger|focus|glass|overlay)-?", name) and not re.match(
                    r"--theme-(sky|blue|cyan|indigo|violet|purple|fuchsia|pink|slate|emerald|amber|rose|red|white|black|gray|zinc|green|orange|yellow|teal)-(\d+)", name):
                target = adaptive
            else:
                target = fixed
            if target is adaptive or target is chat:
                for md in (["light", "dark"] if mode == "both" else [mode]):
                    target.setdefault(md, {})[name] = value
            else:
                target[name] = value
            name, buf = None, []
    return fixed, adaptive, chat


def render_theme_css(slug, spec, tokens, points):
    theme = Theme(slug, spec, tokens, points)
    fixed, grads_l, grads_d, shadows = [], [], [], []
    for name, tspec in tokens.items():
        kind = tspec["kind"]
        if kind == "fixed":
            m = TOKEN_RE.match(name)
            if m and m.group(1) in FAMILY_RAMP:
                fam, shade = m.group(1), int(m.group(2))
                new_hex = theme.themed(fam, shade)
                parsed = parse_color(tspec["value"])
                alpha = parsed[1] if parsed else None
                fixed.append((name, emit(hx(new_hex), alpha)))
            else:
                fixed.append((name, theme.sub(tspec["value"])))
        elif kind == "gradient":
            grads_l.append((name, theme.sub(tspec["value"], boost_glow=True)))
        elif kind == "shadow":
            shadows.append((name, theme.sub(tspec["value"], boost_glow=True)))
    # gradient-dark-* live in the dark scope (mirror blue's structure)
    dark_grads = [(n, v) for n, v in grads_l if "-dark" in n]
    light_grads = [(n, v) for n, v in grads_l if "-dark" not in n]
    roles = adaptive_roles(theme)
    chats = chat_roles(theme)
    aliases = [(n, tspec["value"]) for n, tspec in tokens.items() if tspec["kind"] == "alias"]

    L = [f"/* {spec['label']} — generated by scripts/generate-themes.py. Do not hand-edit. */",
         f"/* {spec['vibe']} | gradients: {spec['gradient_note']} */",
         f'[data-theme="{slug}"] {{']
    for n, v in fixed:
        L.append(f"  {n}: {v};")
    L.append(f"  --theme-brand: {spec['brand']};")
    L.append(f"  --theme-brand-hover: {spec['brand_hover']};")
    for n, v in light_grads:
        L.append(f"  {n}: {v};")
    for n, v in shadows:
        L.append(f"  {n}: {v};")
    for n, r in roles.items():
        if r is None or n.endswith("-dup"):
            continue
        L.append(f"  {n}: {r['light']};")
    for n, c in chats.items():
        L.append(f"  {n}: {c['light']};")
    for n, v in aliases:
        L.append(f"  {n}: {v};")
    L.append("}")
    L.append(f'[data-theme="{slug}"][data-mode="dark"], .dark[data-theme="{slug}"] {{')
    for n, r in roles.items():
        if r is None or n.endswith("-dup"):
            continue
        L.append(f"  {n}: {r['dark']};")
    for n, c in chats.items():
        L.append(f"  {n}: {c['dark']};")
    for n, v in dark_grads:
        L.append(f"  {n}: {v};")
    L.append("}")
    return "\n".join(L) + "\n", theme


def main():
    check_only = "--check" in sys.argv
    tokens = load_template()
    points = canonical_points(tokens)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    combined = {}
    problems = []
    for slug in THEME_ORDER:
        if slug == "blue":
            continue
        css, theme = render_theme_css(slug, THEMES[slug], tokens, points)
        combined[slug] = THEMES[slug] | {"tokens": len(tokens)}
        # parity: every template token must be emitted by the generated base
        # (authored overlays only add/override — they never remove)
        emitted = set(re.findall(r"--theme-[a-z0-9\-\[\].]+(?=\s*:)", css))
        missing = [n for n in tokens if n not in emitted]
        if missing:
            problems.append((slug, missing))
        if not check_only:
            overlay_path = OVERLAY_DIR / f"{slug}-overlay.css"
            if overlay_path.exists():
                css += f"\n/* Authored overlay: {overlay_path.name} (wins on conflict) */\n"
                css += overlay_path.read_text(encoding="utf-8")
                if not css.endswith("\n"):
                    css += "\n"
            (OUT_DIR / f"{slug}.css").write_text(css, encoding="utf-8")
    if problems:
        for slug, missing in problems:
            print(f"PARITY FAIL {slug}: missing {len(missing)}: {missing[:8]}")
        sys.exit(1)
    print(f"parity OK: {len(THEME_ORDER) - 1} themes x {len(tokens)} tokens")
    if check_only:
        return
    # combined machine-readable tokens (per-theme fixed values)
    machine = {}
    for slug in THEME_ORDER:
        if slug == "blue":
            machine[slug] = {"source": "src/theme/theme-tokens.json + src/theme/blueTheme.css", "tokens": len(tokens)}
            blue_overlay = OVERLAY_DIR / "blue-overlay.css"
            if blue_overlay.exists():
                ofixed, oadaptive, ochat = parse_overlay_defs(blue_overlay.read_text(encoding="utf-8"))
                machine[slug]["overlay"] = "scripts/blue-overlay.css"
                machine[slug]["overlay_fixed"] = ofixed
                machine[slug]["overlay_adaptive"] = oadaptive
                machine[slug]["overlay_chat"] = ochat
            continue
        theme = Theme(slug, THEMES[slug], tokens, points)
        fixed = {}
        for name, tspec in tokens.items():
            if tspec["kind"] != "fixed":
                continue
            m = TOKEN_RE.match(name)
            if m and m.group(1) in FAMILY_RAMP:
                parsed = parse_color(tspec["value"])
                fixed[name] = emit(hx(theme.themed(m.group(1), int(m.group(2)))), parsed[1] if parsed else None)
            else:
                fixed[name] = theme.sub(tspec["value"])
        machine[slug] = {"label": THEMES[slug]["label"], "vibe": THEMES[slug]["vibe"],
                         "gradient": THEMES[slug]["gradient_note"],
                         "chart": THEMES[slug]["chart"], "fixed": fixed,
                         "adaptive": adaptive_roles(theme), "chat": chat_roles(theme)}
        overlay_path = OVERLAY_DIR / f"{slug}-overlay.css"
        if overlay_path.exists():
            ofixed, oadaptive, ochat = parse_overlay_defs(overlay_path.read_text(encoding="utf-8"))
            machine[slug]["fixed"].update(ofixed)
            for md, vals in oadaptive.items():
                for n, v in vals.items():
                    machine[slug]["adaptive"].setdefault(n, {"light": None, "dark": None})
                    if isinstance(machine[slug]["adaptive"][n], dict):
                        machine[slug]["adaptive"][n][md] = v
                    else:
                        machine[slug]["adaptive"][n] = {md: v}
            for md, vals in ochat.items():
                for n, v in vals.items():
                    machine[slug]["chat"].setdefault(n, {"light": None, "dark": None})
                    if isinstance(machine[slug]["chat"][n], dict):
                        machine[slug]["chat"][n][md] = v
                    else:
                        machine[slug]["chat"][n] = {md: v}
            machine[slug]["overlay"] = f"scripts/{overlay_path.name}"
    (OUT_DIR / "tokens.json").write_text(json.dumps(machine, indent=2), encoding="utf-8")
    # blue overlay ships as its own scoped file (base blueTheme.css stays byte-identical)
    blue_overlay = OVERLAY_DIR / "blue-overlay.css"
    if blue_overlay.exists():
        (OUT_DIR / "blue-overlay.css").write_text(
            "/* Generated copy of scripts/blue-overlay.css (authored overlay). Do not hand-edit here. */\n"
            + blue_overlay.read_text(encoding="utf-8"), encoding="utf-8")
    # registry for runtime
    reg = ["// Generated by scripts/generate-themes.py. Do not hand-edit.",
           "export const DEFAULT_THEME = \"blue\";",
           "export const THEMES = ["]
    reg.append('  { slug: "blue", label: "Deep Sky Blue / Cyan Glass" },')
    for slug in THEME_ORDER:
        if slug == "blue":
            continue
        reg.append(f'  {{ slug: "{slug}", label: "{THEMES[slug]["label"]}" }},')
    reg.append("];")
    reg.append("export const VALID_THEMES = new Set(THEMES.map((t) => t.slug));")
    (OUT_DIR / "registry.js").write_text("\n".join(reg) + "\n", encoding="utf-8")
    # per-theme JS data (chart palettes)
    ts = ["// Generated by scripts/generate-themes.py. Do not hand-edit.",
          "export const THEME_CHARTS = {"]
    ts.append('  blue: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"],')
    for slug in THEME_ORDER:
        if slug == "blue":
            continue
        ts.append(f"  {slug}: {json.dumps(THEMES[slug]['chart'])},")
    ts.append("};")
    (OUT_DIR / "themes.ts").write_text("\n".join(ts) + "\n", encoding="utf-8")
    # tailwind var-indirection for every base-shade template token
    tw = ["/* Generated by scripts/generate-themes.py. Maps Tailwind colors -> theme vars (runtime switchable). */",
          "@theme {"]
    seen = set()
    for name in tokens:
        m = re.fullmatch(r"--theme-([a-z]+)-(\d+)", name)
        if m and m.group(1) in TW_FAMILIES and name not in seen:
            seen.add(name)
            tw.append(f"  --color-{m.group(1)}-{m.group(2)}: var({name});")
    tw.append("  --color-gtBlue: var(--theme-brand, #0a66c2);")
    tw.append("  --color-gtBlueHover: var(--theme-brand-hover, #004182);")
    tw.append("}")
    (OUT_DIR / "tailwind-tokens.css").write_text("\n".join(tw) + "\n", encoding="utf-8")
    print(f"wrote {len(THEME_ORDER) - 1} theme files + tokens.json + registry.js + themes.ts + tailwind-tokens.css ({len(seen)} color mappings)")


if __name__ == "__main__":
    main()
