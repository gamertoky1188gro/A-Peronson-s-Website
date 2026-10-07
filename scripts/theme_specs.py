"""Personality specs for the 11 generated themes (blue is preserved as-is).

Each spec defines a complete token personality per the design rule:
background philosophy, surface elevation, primary/secondary hue, text
contrast, border character, glass opacity, gradient language, shadow
temperature, glow intensity, success/warning/danger treatment, chart
palette, chat palette, light mode, dark mode.

Ramp triples are (light100, base500, dark900); the generator interpolates
the full 50-950 scales. Neutrals give (paper50, mid500, ink950) plus
explicit surfaces and text colors per mode.
"""

THEMES = {
    "aurora": {
        "label": "Midnight Aurora",
        "vibe": "Premium AI + realtime + futuristic SaaS; indigo-blue-cyan.",
        "ramps": {
            "primary": ("#c7d2fe", "#6366f1", "#312e81"),
            "secondary": ("#bfdbfe", "#3b82f6", "#1e3a8a"),
            "accent": ("#a5f3fc", "#22d3ee", "#155e75"),
            "success": ("#a7f3d0", "#10b981", "#064e3b"),
            "warning": ("#fde68a", "#f59e0b", "#78350f"),
            "danger": ("#fecdd3", "#f43f5e", "#881337"),
        },
        "neutrals": {
            "paper": "#edf0ff", "mid": "#8b93b8", "ink": "#050816",
            "bg": "#0b1020", "surface": "#111827", "elev": "#172033",
        },
        "texts": {
            "dk_hi": "#f4f6ff", "dk_sec": "#c6cdea", "dk_mut": "#8b93b8",
            "lt_hi": "#0b1020", "lt_sec": "#3c4266", "lt_mut": "#64748b",
        },
        "brand": "#4f46e5", "brand_hover": "#4338ca",
        "glow": "#818cf8", "glow_boost": 1.1, "glass": 0.05,
        "gradient_note": "indigo -> blue -> cyan",
        "chart": ["#6366F1", "#22D3EE", "#10B981", "#F59E0B", "#F43F5E", "#3B82F6", "#A78BFA", "#84CC16"],
    },
    "violet": {
        "label": "Obsidian Violet",
        "vibe": "Expensive AI startup / premium software; violet-indigo-blue.",
        "ramps": {
            "primary": ("#ddd6fe", "#8b5cf6", "#4c1d95"),
            "secondary": ("#c7d2fe", "#6366f1", "#312e81"),
            "accent": ("#ede9fe", "#a78bfa", "#6d28d9"),
            "success": ("#a7f3d0", "#10b981", "#064e3b"),
            "warning": ("#fde68a", "#f59e0b", "#78350f"),
            "danger": ("#fecdd3", "#f43f5e", "#881337"),
        },
        "neutrals": {
            "paper": "#f4f1ff", "mid": "#948aa8", "ink": "#09090b",
            "bg": "#0f0b1a", "surface": "#181526", "elev": "#221d33",
        },
        "texts": {
            "dk_hi": "#faf9ff", "dk_sec": "#d9d2f2", "dk_mut": "#9a8fc0",
            "lt_hi": "#0f0b1a", "lt_sec": "#3f3a52", "lt_mut": "#847d99",
        },
        "brand": "#7c3aed", "brand_hover": "#6d28d9",
        "glow": "#a78bfa", "glow_boost": 1.15, "glass": 0.06,
        "gradient_note": "violet -> indigo -> blue",
        "chart": ["#8B5CF6", "#6366F1", "#22D3EE", "#10B981", "#F59E0B", "#F43F5E", "#3B82F6", "#EC4899"],
    },
    "sapphire": {
        "label": "Royal Sapphire",
        "vibe": "Serious enterprise platform with premium polish; sapphire-azure-sky.",
        "ramps": {
            "primary": ("#bfdbfe", "#2563eb", "#1e3a8a"),
            "secondary": ("#dbeafe", "#1d4ed8", "#172c5e"),
            "accent": ("#bae6fd", "#38bdf8", "#075985"),
            "success": ("#a7f3d0", "#10b981", "#064e3b"),
            "warning": ("#fde68a", "#f59e0b", "#78350f"),
            "danger": ("#fecaca", "#ef4444", "#7f1d1d"),
        },
        "neutrals": {
            "paper": "#eef4ff", "mid": "#7d8aa5", "ink": "#020617",
            "bg": "#081226", "surface": "#0e1e3a", "elev": "#16294d",
        },
        "texts": {
            "dk_hi": "#f0f5ff", "dk_sec": "#bcd0ee", "dk_mut": "#8296b8",
            "lt_hi": "#081226", "lt_sec": "#334155", "lt_mut": "#64748b",
        },
        "brand": "#1d4ed8", "brand_hover": "#1e40af",
        "glow": "#60a5fa", "glow_boost": 1.05, "glass": 0.05,
        "gradient_note": "sapphire -> azure -> sky",
        "chart": ["#2563EB", "#38BDF8", "#10B981", "#F59E0B", "#EF4444", "#1D4ED8", "#60A5FA", "#06B6D4"],
    },
    "arctic": {
        "label": "Arctic Ocean",
        "vibe": "Oceanic, clean, calm, highly polished; lightest light/dark pair.",
        "ramps": {
            "primary": ("#a5f3fc", "#0891b2", "#164e63"),
            "secondary": ("#bae6fd", "#0ea5e9", "#0c4a6e"),
            "accent": ("#cffafe", "#67e8f9", "#0e7490"),
            "success": ("#99f6e4", "#14b8a6", "#134e4a"),
            "warning": ("#fde68a", "#f59e0b", "#78350f"),
            "danger": ("#fecaca", "#ef4444", "#7f1d1d"),
        },
        "neutrals": {
            "paper": "#f2f8fb", "mid": "#7d9ab0", "ink": "#04141f",
            "bg": "#06131f", "surface": "#0b1f2e", "elev": "#123043",
        },
        "texts": {
            "dk_hi": "#f0f9ff", "dk_sec": "#b9d6e4", "dk_mut": "#7d9ab0",
            "lt_hi": "#06131f", "lt_sec": "#33566b", "lt_mut": "#64748b",
        },
        "brand": "#0891b2", "brand_hover": "#0e7490",
        "glow": "#67e8f9", "glow_boost": 1.0, "glass": 0.05,
        "gradient_note": "cyan -> sky -> sea",
        "chart": ["#0891B2", "#22D3EE", "#14B8A6", "#F59E0B", "#EF4444", "#0EA5E9", "#67E8F9", "#84CC16"],
    },
    "emerald": {
        "label": "Emerald Noir",
        "vibe": "Fintech trust + verified marketplace; emerald-teal-cyan.",
        "ramps": {
            "primary": ("#a7f3d0", "#10b981", "#064e3b"),
            "secondary": ("#99f6e4", "#14b8a6", "#134e4a"),
            "accent": ("#d1fae5", "#34d399", "#065f46"),
            "success": ("#bbf7d0", "#16a34a", "#14532d"),
            "warning": ("#fde68a", "#f59e0b", "#78350f"),
            "danger": ("#fecdd3", "#f43f5e", "#881337"),
        },
        "neutrals": {
            "paper": "#eef7f1", "mid": "#6f8f7c", "ink": "#040d09",
            "bg": "#06110d", "surface": "#0d1b15", "elev": "#163026",
        },
        "texts": {
            "dk_hi": "#f0fdf4", "dk_sec": "#bcd9c9", "dk_mut": "#6f8f7c",
            "lt_hi": "#06110d", "lt_sec": "#2f3d33", "lt_mut": "#64748b",
        },
        "brand": "#059669", "brand_hover": "#047857",
        "glow": "#34d399", "glow_boost": 1.05, "glass": 0.05,
        "gradient_note": "emerald -> teal -> cyan",
        "chart": ["#10B981", "#14B8A6", "#38BDF8", "#F59E0B", "#F43F5E", "#22C55E", "#6EE7B7", "#A3E635"],
    },
    "blurple": {
        "label": "Blurple Fusion",
        "vibe": "Realtime/social powerhouse; blurple-violet-cyan.",
        "ramps": {
            "primary": ("#c7d2fe", "#5865f2", "#2e3488"),
            "secondary": ("#ddd6fe", "#7c3aed", "#4c1d95"),
            "accent": ("#c7d2fe", "#818cf8", "#3730a3"),
            "success": ("#c2f5d1", "#43b581", "#1e5c38"),
            "warning": ("#fef9c3", "#eab308", "#713f12"),
            "danger": ("#fecaca", "#ed4245", "#7f1d1d"),
        },
        "neutrals": {
            "paper": "#eceffd", "mid": "#8b90b8", "ink": "#070912",
            "bg": "#0b0d17", "surface": "#15182a", "elev": "#1f2440",
        },
        "texts": {
            "dk_hi": "#f5f6ff", "dk_sec": "#c7cdf5", "dk_mut": "#8b90b8",
            "lt_hi": "#0b0d17", "lt_sec": "#3a3f5c", "lt_mut": "#64748b",
        },
        "brand": "#5865f2", "brand_hover": "#4752c4",
        "glow": "#818cf8", "glow_boost": 1.2, "glass": 0.06,
        "gradient_note": "blurple -> violet -> cyan",
        "chart": ["#5865F2", "#7C3AED", "#22D3EE", "#43B581", "#FEE75C", "#ED4245", "#818CF8", "#EB459E"],
    },
    "mono": {
        "label": "Obsidian Mono",
        "vibe": "Vercel-minimal serious mode; monochrome + blue whisper.",
        "ramps": {
            "primary": ("#e7e7e7", "#737373", "#262626"),
            "secondary": ("#d4d4d4", "#525252", "#1c1c1c"),
            "accent": ("#dbeafe", "#60a5fa", "#1e40af"),
            "success": ("#d1fae5", "#059669", "#064e3b"),
            "warning": ("#fde68a", "#d97706", "#78350f"),
            "danger": ("#fecaca", "#dc2626", "#7f1d1d"),
        },
        "neutrals": {
            "paper": "#fafafa", "mid": "#737373", "ink": "#000000",
            "bg": "#000000", "surface": "#0a0a0a", "elev": "#171717",
        },
        "texts": {
            "dk_hi": "#fafafa", "dk_sec": "#a3a3a3", "dk_mut": "#737373",
            "lt_hi": "#000000", "lt_sec": "#404040", "lt_mut": "#737373",
        },
        "brand": "#404040", "brand_hover": "#262626",
        "glow": "#94a3b8", "glow_boost": 0.35, "glass": 0.03,
        "gradient_note": "white -> slate / blue whisper",
        "chart": ["#737373", "#60A5FA", "#059669", "#D97706", "#DC2626", "#A3A3A3", "#404040", "#38BDF8"],
    },
    "plasma": {
        "label": "Cyberpunk Plasma",
        "vibe": "Original GarTexHub neon DNA; pink-violet-blue-cyan.",
        "ramps": {
            "primary": ("#fbcfe8", "#ff2daa", "#831843"),
            "secondary": ("#ddd6fe", "#8b5cf6", "#4c1d95"),
            "accent": ("#fce7f3", "#ff6ec7", "#9d174d"),
            "success": ("#a7f3d0", "#10c981", "#065f46"),
            "warning": ("#fde68a", "#ffb020", "#78350f"),
            "danger": ("#fecdd3", "#ff2d55", "#881337"),
        },
        "neutrals": {
            "paper": "#fdf0f7", "mid": "#a87a94", "ink": "#06020f",
            "bg": "#06020f", "surface": "#110a1d", "elev": "#1e1030",
        },
        "texts": {
            "dk_hi": "#fff5fb", "dk_sec": "#f0bfe0", "dk_mut": "#a87a94",
            "lt_hi": "#1a0512", "lt_sec": "#5b2347", "lt_mut": "#9c6184",
        },
        "brand": "#d61e9b", "brand_hover": "#a21caf",
        "glow": "#ff2daa", "glow_boost": 1.3, "glass": 0.07,
        "gradient_note": "pink -> violet -> blue -> cyan",
        "chart": ["#FF2DAA", "#8B5CF6", "#22D3EE", "#00E69A", "#FFB020", "#FF2D55", "#3B82F6", "#FF6EC7"],
    },
    "solaris": {
        "label": "Solaris",
        "vibe": "Warm futuristic marketing heat; orange-pink-violet.",
        "ramps": {
            "primary": ("#fed7aa", "#f97316", "#7c2d12"),
            "secondary": ("#fbcfe8", "#ec4899", "#831843"),
            "accent": ("#ede9fe", "#8b5cf6", "#4c1d95"),
            "success": ("#bbf7d0", "#16a34a", "#14532d"),
            "warning": ("#fef3c7", "#f59e0b", "#78350f"),
            "danger": ("#ffe4e6", "#e11d48", "#881337"),
        },
        "neutrals": {
            "paper": "#faf5ee", "mid": "#a89880", "ink": "#060403",
            "bg": "#0c0a09", "surface": "#1c1917", "elev": "#292524",
        },
        "texts": {
            "dk_hi": "#fff7ed", "dk_sec": "#e6c9a8", "dk_mut": "#a89880",
            "lt_hi": "#0c0a09", "lt_sec": "#57534e", "lt_mut": "#8a7f72",
        },
        "brand": "#ea580c", "brand_hover": "#c2410c",
        "glow": "#fb923c", "glow_boost": 1.2, "glass": 0.06,
        "gradient_note": "orange -> pink -> violet",
        "chart": ["#F97316", "#EC4899", "#8B5CF6", "#16A34A", "#F59E0B", "#E11D48", "#FDBA74", "#14B8A6"],
    },
    "forest": {
        "label": "Forest Glass",
        "vibe": "Organic premium marketplace; green-emerald-teal.",
        "ramps": {
            "primary": ("#bbf7d0", "#16a34a", "#14532d"),
            "secondary": ("#99f6e4", "#059669", "#134e4a"),
            "accent": ("#dcfce7", "#4ade80", "#166534"),
            "success": ("#bbf7d0", "#15803d", "#14532d"),
            "warning": ("#fef3c7", "#b45309", "#78350f"),
            "danger": ("#fecaca", "#dc2626", "#7f1d1d"),
        },
        "neutrals": {
            "paper": "#eef5ef", "mid": "#6b7f72", "ink": "#030c08",
            "bg": "#06110d", "surface": "#0d1b14", "elev": "#163024",
        },
        "texts": {
            "dk_hi": "#f0fdf4", "dk_sec": "#bcd8c6", "dk_mut": "#6b7f72",
            "lt_hi": "#06110d", "lt_sec": "#2f3d33", "lt_mut": "#5f7268",
        },
        "brand": "#15803d", "brand_hover": "#166534",
        "glow": "#4ade80", "glow_boost": 1.0, "glass": 0.05,
        "gradient_note": "green -> emerald -> teal",
        "chart": ["#16A34A", "#059669", "#14B8A6", "#B45309", "#DC2626", "#4ADE80", "#86EFAC", "#84CC16"],
    },
    "crimson": {
        "label": "Crimson Night",
        "vibe": "High-energy premium; rose-pink-violet.",
        "ramps": {
            "primary": ("#fecdd3", "#e11d48", "#881337"),
            "secondary": ("#fbcfe8", "#db2777", "#831843"),
            "accent": ("#ede9fe", "#a78bfa", "#5b21b6"),
            "success": ("#a7f3d0", "#10b981", "#064e3b"),
            "warning": ("#fde68a", "#f59e0b", "#78350f"),
            "danger": ("#fecaca", "#ef4444", "#7f1d1d"),
        },
        "neutrals": {
            "paper": "#fdf0f3", "mid": "#a87a86", "ink": "#060204",
            "bg": "#0d0509", "surface": "#1c0b12", "elev": "#2b1020",
        },
        "texts": {
            "dk_hi": "#fff1f2", "dk_sec": "#efc3cd", "dk_mut": "#a87a86",
            "lt_hi": "#0d0509", "lt_sec": "#50202c", "lt_mut": "#97707b",
        },
        "brand": "#be123c", "brand_hover": "#9f1239",
        "glow": "#fb7185", "glow_boost": 1.25, "glass": 0.06,
        "gradient_note": "rose -> pink -> violet",
        "chart": ["#E11D48", "#8B5CF6", "#F472B6", "#10B981", "#F59E0B", "#EF4444", "#FB7185", "#FBBF24"],
    },
}

THEME_ORDER = ["blue", "aurora", "violet", "sapphire", "arctic", "emerald",
               "blurple", "mono", "plasma", "solaris", "forest", "crimson"]
