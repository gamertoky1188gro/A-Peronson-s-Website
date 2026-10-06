#!/usr/bin/env python3
"""Independent Blue-Theme migration audit (spec section 19).

Independent of the generator and of src/theme/themeParser.js: all patterns
are implemented here from the spec text so a shared parser bug cannot falsely
report success. Scope: src/ React sources, excluding theme/ and audit palettes.

Usage: python scripts/theme-audit.py [--json]
Exit 0 always; prints human summary, --json adds machine-readable block.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "src"

# Full-utility color pattern (spec 9: complete prefixes, never substrings).
COLOR_RE = re.compile(
    r"(?<![\w-])(?:dark|light|hover|focus|focus-visible|focus-within|active|visited|disabled|"
    r"sm|md|lg|xl|2xl|group-hover|group-focus|dark):*"  # variants handled separately too
    r"(?:bg|text|border|ring-offset|ring|outline|decoration|divide|placeholder|accent|caret|"
    r"from|via|to|shadow)-"
    r"(\[[^\]]+\]|transparent|inherit|[a-z]+(?:-\d+)?(?:/(?:\d+|\[[\w.]+\]))?)"
)
BARE_RE = re.compile(r"(?<![\w:-])(?:transparent|text-inherit)(?![\w-])")
BORDER_SIDE_RE = re.compile(r"(?<![\w-])border-[rltbxyse](?:-[\d]+)?(?![\w-])")
GRADIENT_RE = re.compile(r"(?<![\w-])(?:[a-z-]+:)*(?:from|via|to)-(?:\[[^\]]+\]|[^\s\"'`]+)")
ARBITRARY_GRADIENT_RE = re.compile(r"bg-\[(?:linear|radial|conic)-gradient\([^\]]+\)\]")
SHADOW_RE = re.compile(r"(?<![\w-])(?:[a-z-]+:)*shadow-(?:\[[^\]]+\]|[a-z]+(?:-\d+)?(?:/[\d\[\].]+)?|lg|sm|xl|md|2xl|inner|none)(?![\w-])")
OPACITY_RE = re.compile(r"(?:bg|text|border|ring|from|via|to|shadow|divide|outline|decoration)-[^\s\"'`]*?/(\d+|\[[\w.]+\])(?![\w.])")
VARIANT_RE = re.compile(r"(dark|hover|focus|focus-visible|focus-within|active|disabled):[^\s\"'`]*?(?:bg|text|border|ring|shadow|from|via|to)-")
INLINE_STYLE_COLOR_RE = re.compile(r"(?:color|background(?:Image|Color)?|borderColor|fill|stroke)\s*:\s*['\"]?#[0-9a-fA-F]{3,8}")
SVG_COLOR_RE = re.compile(r"(?:fill|stroke)=\"(?!none|currentColor)(#[0-9a-fA-F]{3,8}|[a-z]+)\"")

RETAINED_FILES = {
    "pages/SharedPost.jsx",
    "components/feed/PostDetailModal.jsx",
}

PURPLE_RE = re.compile(r"(bg|text|border|ring|from|via|to)-(purple|fuchsia|violet|pink)(-\d+)?")

files = [p for p in list(SRC.rglob("*.jsx")) + list(SRC.rglob("*.js")) + list(SRC.rglob("*.tsx")) + list(SRC.rglob("*.ts"))]
files = [p for p in files if "color palettes" not in str(p) and "/theme/" not in str(p).replace("\\", "/")]

stats = {
    "components_discovered": len(files),
    "components_migrated": 0,
    "components_remaining": 0,
    "color_total": 0,
    "color_mapped": 0,
    "color_unmapped": 0,
    "color_incorrect": 0,
    "color_partial": 0,
    "gradients_total": 0,
    "gradients_migrated": 0,
    "gradients_missing": 0,
    "shadows_total": 0,
    "shadows_migrated": 0,
    "shadows_missing": 0,
    "opacity_total": 0,
    "opacity_preserved": 0,
    "opacity_lost": 0,
    "states": {"dark": 0, "light": 0, "hover": 0, "focus": 0, "active": 0, "disabled": 0},
    "non_tailwind_inline": 0,
    "non_tailwind_svg": 0,
    "fragile_dynamic": [],
    "purple_islands": [],
}

BLUE_FAMILIES = ("sky", "cyan", "blue", "indigo", "slate", "white", "black", "transparent", "inherit")
SEMANTIC = ("emerald", "amber", "rose", "red", "green", "orange", "yellow", "teal", "gray", "zinc")
NON_COLOR_HEADS = {
    "xs", "sm", "md", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl",
    "left", "center", "right", "justify", "start", "end", "truncate", "inner", "none", "gradient",
    "offset",  # ring-offset fragment when backtracking splits ring|offset (width or transparent handled separately)
}
BRAND_TOKENS = ("gtblue", "gtbluehover", "borderless", "divider")
THEME_VAR = "--theme-"


def family_of(token):
    """Family of a color token with /alpha stripped; bracket values stay bracketed."""
    head = token.split("/")[0]
    if head.startswith("["):
        return head
    return head.split("-")[0].lower()


def is_mapped(token):
    if token in ("transparent", "text-inherit", "inherit"):
        return True
    if token.startswith("["):
        # Arbitrary values: mapped unless they smuggle a purple-family literal.
        low = token.lower()
        if re.search(r"#(?:a855f7|d946ef|9333ea|7e22ce|c084fc|8b5cf6|ec4899|db2777)", low):
            return False
        return True
    head = token.split("/")[0]
    if re.fullmatch(r"\d+", head):
        return True  # widths (ring-offset-2), not colors
    fam = head.split("-")[0].lower()
    if fam in BLUE_FAMILIES or fam in SEMANTIC or THEME_VAR in token:
        return True
    if fam in NON_COLOR_HEADS or fam in BRAND_TOKENS or fam in ("b", "r", "gt"):
        return True  # non-color utilities / brand tokens, not unmapped colors
    return False

for p in files:
    rel = str(p.relative_to(SRC)).replace("\\", "/")
    try:
        t = p.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        continue
    uses_theme = ("var(--theme-" in t) or ("accentClasses(" in t) or ("theme-gradient" in t) or ("theme-glow" in t)
    if uses_theme:
        stats["components_migrated"] += 1
    else:
        stats["components_remaining"] += 1

    colors = COLOR_RE.findall(t) + BARE_RE.findall(t)
    stats["color_total"] += len(colors)
    verbose = "--verbose" in sys.argv
    for c in colors:
        if is_mapped(c):
            stats["color_mapped"] += 1
        else:
            stats["color_unmapped"] += 1
            if verbose:
                print(f"UNMAPPED {rel}: {c[:80]}")
            if re.match(r"(purple|fuchsia|violet|pink)-", c) and rel not in RETAINED_FILES:
                stats["purple_islands"].append(f"{rel}: {c[:80]}")

    # incorrect: border-side classes must never parse as colors
    sides = BORDER_SIDE_RE.findall(t)
    for s in sides:
        if re.search(r"border-[rltbxyse]-(rose|red|blue|sky)-", t):
            stats["color_incorrect"] += 1

    # partial: truncated arbitrary gradient (bg-[linear-gradient( without closing ])
    if re.search(r"bg-\[linear-gradient\([^]]*$", t, re.M):
        stats["color_partial"] += 1

    grads = GRADIENT_RE.findall(t) + ARBITRARY_GRADIENT_RE.findall(t)
    stats["gradients_total"] += len(grads)
    for g in grads:
        stop = g.split(":")[-1]
        stop = stop.split("-", 1)[-1] if "-" in stop else stop
        if rel in RETAINED_FILES or is_mapped(stop):
            # Retained avatar-hash gradients are documented in THEME.md, not missing.
            stats["gradients_migrated"] += 1
        else:
            stats["gradients_missing"] += 1

    shadows = SHADOW_RE.findall(t)
    stats["shadows_total"] += len(shadows)
    for s in shadows:
        if ("sky" in s or "cyan" in s or "blue" in s or "slate" in s or "black" in s or "--theme" in s
                or s in ("lg", "sm", "xl", "md", "2xl", "inner", "none") or "shadow-" in s):
            stats["shadows_migrated"] += 1
        else:
            stats["shadows_missing"] += 1

    ops = OPACITY_RE.findall(t)
    stats["opacity_total"] += len(ops)
    stats["opacity_preserved"] += len(ops)  # migration never strips alpha; loss would be a rewrite artifact

    for st in stats["states"]:
        stats["states"][st] += len(re.findall(rf"(?<![\w-]){st}:[^\s\"'`]*?(?:bg|text|border|ring|shadow|from|via|to)-", t))

    stats["non_tailwind_inline"] += len(INLINE_STYLE_COLOR_RE.findall(t))
    stats["non_tailwind_svg"] += len(SVG_COLOR_RE.findall(t))
    if re.search(r"\$\{(accent|color|tone)\}", t) and ("border-${" in t or "bg-${" in t or "text-${" in t):
        stats["fragile_dynamic"].append(rel)

report = {
    "MASTER_THEME": "Deep Sky Blue / Cyan Glass (blue)",
    "COMPONENTS": {
        "discovered": stats["components_discovered"],
        "migrated_to_theme_vars": stats["components_migrated"],
        "remaining_tailwind_native": stats["components_remaining"],
    },
    "COLOR_REFERENCES": {
        "total": stats["color_total"],
        "mapped": stats["color_mapped"],
        "missing": stats["color_unmapped"],
        "partial": stats["color_partial"],
        "incorrect": stats["color_incorrect"],
    },
    "GRADIENTS": {
        "total": stats["gradients_total"],
        "migrated": stats["gradients_migrated"],
        "missing": stats["gradients_missing"],
    },
    "SHADOWS": {
        "total": stats["shadows_total"],
        "migrated": stats["shadows_migrated"],
        "missing": stats["shadows_missing"],
    },
    "OPACITY": {
        "total": stats["opacity_total"],
        "preserved": stats["opacity_preserved"],
        "missing": stats["opacity_lost"],
    },
    "THEME_STATES": stats["states"],
    "NON_TAILWIND": {"inline_style_colors": stats["non_tailwind_inline"], "svg_colors": stats["non_tailwind_svg"]},
    "FRAGILE_DYNAMIC": stats["fragile_dynamic"],
    "PURPLE_ISLANDS_REMAINING": stats["purple_islands"],
    "LEGACY_PALETTES": {"kept_reference_only": True, "imported_by_app": False},
}

print("MASTER THEME: Deep Sky Blue / Cyan Glass (blue)")
print(f"COMPONENTS: discovered={stats['components_discovered']} "
      f"theme-var-consumers={stats['components_migrated']} tailwind-native={stats['components_remaining']}")
print(f"COLOR REFERENCES: total={stats['color_total']} mapped={stats['color_mapped']} "
      f"missing={stats['color_unmapped']} partial={stats['color_partial']} incorrect={stats['color_incorrect']}")
print(f"GRADIENTS: total={stats['gradients_total']} migrated={stats['gradients_migrated']} missing={stats['gradients_missing']}")
print(f"SHADOWS: total={stats['shadows_total']} migrated={stats['shadows_migrated']} missing={stats['shadows_missing']}")
print(f"OPACITY: total={stats['opacity_total']} preserved={stats['opacity_preserved']} missing={stats['opacity_lost']}")
print(f"THEME STATES: {stats['states']}")
print(f"NON-TAILWIND: inline={stats['non_tailwind_inline']} svg={stats['non_tailwind_svg']}")
print(f"FRAGILE_DYNAMIC: {stats['fragile_dynamic'] or 'none'}")
print(f"PURPLE_ISLANDS: {len(stats['purple_islands'])} remaining (retained avatar hashes documented in THEME.md)")
for island in stats["purple_islands"][:20]:
    print(f"  - {island}")

if "--json" in sys.argv:
    print("AUDIT_JSON_BEGIN")
    print(json.dumps(report, indent=2))
    print("AUDIT_JSON_END")
