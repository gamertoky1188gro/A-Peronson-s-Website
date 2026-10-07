#!/usr/bin/env python3
"""Migrate UI-theming arbitrary hex literals to theme vars (one-shot).

Scope: Tailwind arbitrary values that encode APPLICATION UI colors
(page bgs, brand actions, blue accents, chat surfaces). Every replacement
target is verified to exist in theme-tokens.json (and therefore in all 12
theme files via generator parity) before any write happens.

Deliberately KEPT literal (documented in THEME.md):
  NeonAtom loader splash, BotLogo SVG brand marks, AttachmentPreviewModal
  code-syntax colors, CyberpunkCursor/NeonAtom ring colors.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
TOKENS = set(json.load(open(ROOT / "src" / "theme" / "theme-tokens.json"))["tokens"].keys())

PAIRS = [
    # page-level dark backgrounds -> navy custom twins (exact blue values)
    ("dark:bg-[#0b1220]", "dark:bg-[var(--theme-custom-0b1220)]"),
    ("dark:bg-[#07111f]", "dark:bg-[var(--theme-custom-07111f)]"),
    ("dark:bg-[#06111f]", "dark:bg-[var(--theme-custom-06111f)]"),
    ("dark:bg-[#06131f]", "dark:bg-[var(--theme-custom-06131f)]"),
    ("dark:bg-[#050816]", "dark:bg-[var(--theme-custom-050816)]"),
    ("dark:bg-[#020617]", "dark:bg-[var(--theme-slate-950)]"),
    ("dark:from-[#020617]", "dark:from-[var(--theme-slate-950)]"),
    ("bg-[#06131f] text-slate-100", "bg-[var(--theme-custom-06131f)] text-slate-100"),
    ("bg-[#07111f] text-slate-100", "bg-[var(--theme-custom-07111f)] text-slate-100"),
    ("bg-[#081826]/85", "bg-[var(--theme-custom-081826-85)]"),
    ("bg-[#edf6ff]", "bg-[var(--theme-custom-edf6ff)]"),
    ("bg-[#f5f9ff]", "bg-[var(--theme-custom-f5f9ff)]"),
    ("bg-[#f3f9ff]", "bg-[var(--theme-custom-f3f9ff)]"),
    ("bg-[#EFF6FF]", "bg-[var(--theme-blue-50)]"),
    ("ring-[#BFDBFE]", "ring-[var(--theme-blue-200)]"),
    ("dark:bg-[#0b1627]/80", "dark:bg-[var(--theme-custom-0b1627-80)]"),
    ("dark:bg-[#0b1224]", "dark:bg-[var(--theme-custom-0b1224)]"),
    ("bg-[#0B1224]", "bg-[var(--theme-custom-0b1224)]"),
    ("dark:bg-[#0a1a33]", "dark:bg-[var(--theme-custom-0a1a33)]"),
    ("text-[#0a3d78]", "text-[var(--theme-custom-0a3d78)]"),
    ("dark:bg-[#0b1324]", "dark:bg-[var(--theme-custom-0b1324)]"),
    ("bg-[#0b1324]", "bg-[var(--theme-custom-0b1324)]"),
    # brand actions -> brand twins
    ("text-[#0A66C2]", "text-[var(--theme-custom-0a66c2)]"),
    ("bg-[#0A66C2]", "bg-[var(--theme-custom-0a66c2)]"),
    ("hover:text-[#084b8a]", "hover:text-[var(--theme-custom-084b8a)]"),
    ("hover:bg-[#084b8a]", "hover:bg-[var(--theme-custom-084b8a)]"),
    ("focus:ring-[#0A66C2]", "focus:ring-[var(--theme-custom-0a66c2)]"),
    ("focus-within:ring-[#0A66C2]/20", "focus-within:ring-[var(--theme-brand-20)]"),
    # blue accents -> scale twins
    ("ring-[#3b82f6]/35", "ring-[var(--theme-custom-3b82f6-35)]"),
    ("bg-[#3b82f6]/10", "bg-[var(--theme-blue-500-10)]"),
    ("text-[#2563eb]", "text-[var(--theme-blue-600)]"),
    ("dark:bg-[#38bdf8]/10", "dark:bg-[var(--theme-sky-400-10)]"),
    ("dark:text-[#38bdf8]", "dark:text-[var(--theme-sky-400)]"),
    ("bg-[#ffffff]", "bg-[var(--theme-white)]"),
    # chat dark surfaces -> custom twins
    ("bg-[#0f0d22]", "bg-[var(--theme-custom-0f0d22)]"),
    ("bg-[#0b1020]", "bg-[var(--theme-custom-0b1020)]"),
    ("bg-[#171031]", "bg-[var(--theme-custom-171031)]"),
    ("text-[#D4FF59]", "text-[var(--theme-custom-d4ff59)]"),
    ("bg-[rgba(10,102,194,0.18)]", "bg-[var(--theme-custom-0a66c2-18)]"),
    ("text-[#8f95bb]", "text-[var(--theme-custom-8f95bb)]"),
    ("bg-[#2a2744]", "bg-[var(--theme-custom-2a2744)]"),
    ("dark:bg-[#1f2448]", "dark:bg-[var(--theme-custom-1f2448)]"),
    ("dark:text-[#b8bfe8]", "dark:text-[var(--theme-custom-b8bfe8)]"),
    ("bg-[#14122b]", "bg-[var(--theme-custom-14122b)]"),
    ("hover:bg-[#13171E]", "hover:bg-[var(--theme-custom-13171e)]"),
]

# every var() target must exist in the template (=> in all 12 themes)
for old, new in PAIRS:
    for tok in __import__("re").findall(r"var\((--theme-[a-z0-9\-\[\].]+)", new):
        assert tok in TOKENS, f"target token missing from template: {tok}"

files = [p for p in list(SRC.rglob("*.jsx")) + list(SRC.rglob("*.js"))
         if "color palettes" not in str(p) and "/theme/" not in str(p).replace("\\", "/")]
total = 0
for old, new in PAIRS:
    hits = 0
    for p in files:
        t = p.read_text(encoding="utf-8")
        n = t.count(old)
        if n:
            hits += n
            p.write_text(t.replace(old, new), encoding="utf-8")
    if hits == 0:
        # idempotent reruns: already-migrated pairs match nothing on second pass
        print(f"  0x  {old}  (already migrated or absent)")
        continue
    total += hits
    print(f"{hits:3d}x  {old}")
print(f"total replacements: {total}")
