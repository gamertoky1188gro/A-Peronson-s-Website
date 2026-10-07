/**
 * Blue Theme regression tests (migration spec sections 9 + 20).
 *
 * Validates the strict parser against every previously-failing case, plus
 * canonical-theme wiring (CSS variables present, runtime attributes set by
 * themeSlice/ThemeProvider/index.html, legacy palettes kept out of the bundle).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createThemeHotkeyState, trackThemeHotkey } from "../../src/lib/themeHotkey.js";
import {
	extractGradients,
	isBorderSideClass,
	parseColorClass,
} from "../../src/theme/themeParser.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

describe("blue theme regression cases (spec 20)", () => {
	test("border colors parse with full prefixes, sides excluded", () => {
		expect(parseColorClass("border-rose-200")).toMatchObject({
			prefix: "border",
			color: "rose-200",
		});
		expect(parseColorClass("border-blue-400")).toMatchObject({
			prefix: "border",
			color: "blue-400",
		});
		expect(parseColorClass("border-red-500")).toMatchObject({ prefix: "border", color: "red-500" });
		expect(parseColorClass("border-r-2")).toBeNull();
		expect(parseColorClass("border-t")).toBeNull();
		expect(isBorderSideClass("border-r-2")).toBe(true);
		expect(isBorderSideClass("border-rose-200")).toBe(false);
	});

	test("colored shadows incl. base utilities", () => {
		expect(parseColorClass("shadow-sky-500/20")).toMatchObject({
			prefix: "shadow",
			color: "sky-500",
			alpha: "20",
		});
		expect(parseColorClass("shadow-black/20")).toMatchObject({
			prefix: "shadow",
			color: "black",
			alpha: "20",
		});
		expect(parseColorClass("shadow-blue-500")).toMatchObject({
			prefix: "shadow",
			color: "blue-500",
			alpha: null,
		});
	});

	test("non-color utilities sharing a prefix return null", () => {
		expect(parseColorClass("text-sm")).toBeNull();
		expect(parseColorClass("text-lg")).toBeNull();
		expect(parseColorClass("text-center")).toBeNull();
		expect(parseColorClass("shadow-lg")).toBeNull();
		expect(parseColorClass("shadow-sm")).toBeNull();
		expect(parseColorClass("shadow-borderless")).toBeNull();
		expect(parseColorClass("border-b-0")).toBeNull();
		expect(parseColorClass("text-md")).toBeNull();
		expect(parseColorClass("hover:shadow-md")).toBeNull();
		expect(parseColorClass("bg-gradient-to-r")).toBeNull();
		expect(parseColorClass("dark:bg-gradient-to-br")).toBeNull();
		expect(parseColorClass("ring-offset-2")).toBeNull();
		expect(parseColorClass("focus:ring-offset-2")).toBeNull();
		expect(parseColorClass("ring-offset-transparent")).toMatchObject({
			prefix: "ring-offset",
			color: "transparent",
		});
	});

	test("multiple independent gradients in one file are all preserved", () => {
		const classList =
			"bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 bg-gradient-to-br from-sky-500 to-cyan-400";
		expect(extractGradients(classList)).toHaveLength(5);
	});

	test("transparent and inherit", () => {
		expect(parseColorClass("transparent")).toMatchObject({ color: "transparent" });
		expect(parseColorClass("text-inherit")).toMatchObject({ prefix: "text", color: "inherit" });
	});

	test("arbitrary alpha bg-white/[0.03]", () => {
		expect(parseColorClass("bg-white/[0.03]")).toMatchObject({
			prefix: "bg",
			color: "white",
			alpha: "[0.03]",
		});
	});

	test("arbitrary color + opacity incl. variant", () => {
		expect(parseColorClass("bg-[#3b82f6]/10")).toMatchObject({
			prefix: "bg",
			color: "[#3b82f6]",
			alpha: "10",
		});
		expect(parseColorClass("ring-[#3b82f6]/35")).toMatchObject({
			prefix: "ring",
			color: "[#3b82f6]",
			alpha: "35",
		});
		const dark = parseColorClass("dark:bg-[#0b1627]/80");
		expect(dark).toMatchObject({
			prefix: "bg",
			color: "[#0b1627]",
			alpha: "80",
			variants: ["dark"],
		});
	});

	test("multi-stop arbitrary gradients are never truncated", () => {
		const full = "bg-[linear-gradient(90deg,#0ea5e9_0%,#22d3ee_50%,#3b82f6_100%)]";
		const parsed = parseColorClass(full);
		expect(parsed.color).toBe("[linear-gradient(90deg,#0ea5e9_0%,#22d3ee_50%,#3b82f6_100%)]");
		expect(parsed.raw).toBe(full);
	});
});

describe("canonical blue theme wiring", () => {
	test("blueTheme.css defines core + semantic + mode tokens", () => {
		const css = read("src/theme/blueTheme.css");
		for (const token of [
			"--theme-sky-500: #0ea5e9",
			"--theme-slate-950: #020617",
			"--theme-gradient-primary",
			"--theme-shadow-1",
			"--theme-surface: rgba(255, 255, 255, 0.05)",
			'[data-theme="blue"][data-mode="dark"]',
			'[data-mode="light"]',
		]) {
			expect(css).toContain(token);
		}
	});

	test("tailwind.css imports the canonical theme and exposes semantic tokens", () => {
		const css = read("src/tailwind.css");
		expect(css).toContain('@import "./theme/blueTheme.css"');
		expect(css).toContain("--color-theme-primary");
		expect(css).toContain(".theme-gradient-primary");
	});

	test("runtime sets data-theme + data-mode (slice, provider, boot script)", () => {
		const slice = read("src/store/themeSlice.js");
		expect(slice).toContain('setAttribute("data-theme", themeName)');
		expect(slice).toContain('setAttribute("data-mode"');
		expect(slice).toContain("setThemeName");
		expect(slice).toContain("VALID_THEMES");
		const provider = read("src/lib/ThemeProvider.jsx");
		expect(provider).toContain("themeName");
		expect(provider).toContain("setThemeName");
		const boot = read("index.html");
		expect(boot).toContain('setAttribute("data-theme"');
		expect(boot).toContain('setAttribute("data-mode"');
		expect(boot).toContain("themeName");
	});

	test("accent map uses static theme-var classes (Tailwind-safe)", () => {
		const utils = read("src/theme/theme-utils.ts");
		for (const accent of ["sky", "cyan", "blue", "emerald", "amber"]) {
			expect(utils).toContain(`--theme-${accent}-400`);
		}
		const adminPanel = read("src/pages/AdminPanel.jsx");
		const shared = read("src/pages/admin/shared/index.jsx");
		expect(adminPanel).not.toContain("border-${accent}");
		expect(shared).not.toContain("border-${accent}");
		expect(adminPanel).toContain("accentClasses(accent)");
		expect(shared).toContain("accentClasses(accent)");
	});

	test("legacy palettes are reference-only (never bundled)", () => {
		expect(read("src/tailwind.css")).not.toContain("color palettes");
		expect(read("src/main.jsx")).not.toContain("color palettes");
	});
});

describe("twelve-theme system (blue preserved + 11 personalities)", () => {
	const SLUGS = [
		"blue",
		"aurora",
		"violet",
		"sapphire",
		"arctic",
		"emerald",
		"blurple",
		"mono",
		"plasma",
		"solaris",
		"forest",
		"crimson",
	];

	test("registry lists all 12 themes with blue as default", () => {
		const reg = read("src/theme/themes/registry.js");
		expect(reg).toContain('DEFAULT_THEME = "blue"');
		for (const slug of SLUGS) expect(reg).toContain(`slug: "${slug}"`);
	});

	test("every non-blue theme ships a complete scoped file", () => {
		for (const slug of SLUGS) {
			if (slug === "blue") continue;
			const css = read(`src/theme/themes/${slug}.css`);
			expect(css).toContain(`[data-theme="${slug}"]`);
			expect(css).toContain(`[data-theme="${slug}"][data-mode="dark"]`);
			// core personality tokens present in both scopes
			for (const token of ["--theme-sky-500:", "--theme-slate-950:", "--theme-gradient-primary:"]) {
				expect(css).toContain(token);
			}
		}
	});

	test("blue personality is preserved byte-for-byte as the reference", () => {
		const css = read("src/theme/blueTheme.css");
		expect(css).toContain("--theme-sky-500: #0ea5e9;");
		expect(css).toContain(":root,");
	});

	test("aurora authored overlay wins over generated approximations", () => {
		const css = read("src/theme/themes/aurora.css");
		expect(css).toContain("Authored overlay");
		// true Tailwind scales from the overlay, not interpolated ramps
		expect(css).toMatch(/--theme-amber-200: #fde68a;/);
		expect(css).toContain("--theme-surface-hover:");
		expect(css).toContain("--theme-card-bg:");
		expect(css).toContain("--theme-gradient-hero:");
		// contract tokens from the generated base still present
		expect(css).toContain("--theme-custom-0b1220:");
		expect(css).toContain("--theme-sky-400-10:");
	});

	test("violet authored overlay: true violet brand, scoped, no leaks", () => {
		const css = read("src/theme/themes/violet.css");
		expect(css).toContain("Authored overlay");
		expect(css).toMatch(/--theme-sky-500:\s*var\(--theme-violet-500\);/);
		expect(css).toContain("--theme-surface-hover:");
		expect(css).toContain("--theme-brand: #7c3aed;");
	});

	test("blue authored overlay: scoped file, base file untouched", () => {
		const overlay = read("src/theme/themes/blue-overlay.css");
		expect(overlay).toContain('[data-theme="blue"]');
		expect(overlay).toContain("--theme-primary: var(--theme-sky-500);");
		expect(overlay).toContain("--theme-brand: #0a66c2;");
		expect(overlay).not.toMatch(/^:root,/m);
		expect(overlay).not.toMatch(/^\.dark \{/m);
		expect(read("src/tailwind.css")).toContain('@import "./theme/themes/blue-overlay.css";');
	});

	test("sapphire/arctic/emerald/blurple authored overlays win", () => {
		const sapphire = read("src/theme/themes/sapphire.css");
		expect(sapphire).toContain("Authored overlay");
		expect(sapphire).toContain("--theme-sapphire-500: #5874f5;");
		expect(sapphire).toContain("--theme-brand: #405ce3;");

		const arctic = read("src/theme/themes/arctic.css");
		expect(arctic).toContain("Authored overlay");
		expect(arctic).toContain("--theme-primary: #087f9d;");

		const emerald = read("src/theme/themes/emerald.css");
		expect(emerald).toContain("Authored overlay");
		expect(emerald).toContain("--theme-custom-noir: #08130e;");
		expect(emerald).toContain("--theme-brand: #10b981;");

		const blurple = read("src/theme/themes/blurple.css");
		expect(blurple).toContain("Authored overlay");
		expect(blurple).toContain("--theme-accent: #4f46d8;");
		expect(blurple).toContain("--theme-brand: #5865f2;");
	});

	test("mono authored overlay: obsidian neutrals + whisper system", () => {
		const css = read("src/theme/themes/mono.css");
		expect(css).toContain("Authored overlay");
		expect(css).toContain("--theme-neutral-500: #737373;");
		expect(css).toContain("--theme-whisper-500: #7895ae;");
		expect(css).toMatch(/--theme-sky-500:\s*var\(--theme-whisper-500\);/);
		expect(css).toContain("--theme-brand: #4d667e;");
	});

	test("plasma authored overlay: four distinct neon roles", () => {
		const css = read("src/theme/themes/plasma.css");
		expect(css).toContain("Authored overlay");
		expect(css).toContain("--theme-pink-500: #ff2db5;");
		expect(css).toContain("--theme-violet-500: #8b5cf6;");
		expect(css).toContain("--theme-blue-500: #3b82f6;");
		expect(css).toContain("--theme-cyan-500: #22d3ee;");
		expect(css).toContain("--theme-brand: #ff2db5;");
		expect(css).toContain("--theme-pink-500-20: rgba(255, 45, 181, 0.2);");
	});

	test("solaris authored overlay: orange-pink-violet master", () => {
		const css = read("src/theme/themes/solaris.css");
		expect(css).toContain("Authored overlay");
		expect(css).toContain("--theme-solar-orange-500: #ff7a18;");
		expect(css).toContain("--theme-brand: #ff7a18;");
		expect(css).toContain("--theme-gradient-solaris:");
		expect(css).toContain("--theme-sky-500: #ff7a18;");
	});

	test("forest authored overlay: pine-emerald-teal role separation", () => {
		const css = read("src/theme/themes/forest.css");
		expect(css).toContain("Authored overlay");
		expect(css).toContain("--theme-green-500: #22c55e;");
		expect(css).toContain("--theme-teal-500: #14b8a6;");
		expect(css).toContain("--theme-brand:          #16a34a;");
		expect(css).toContain("--theme-gradient-forest:");
	});

	test("crimson authored overlay: crimson-pink-violet hierarchy", () => {
		const css = read("src/theme/themes/crimson.css");
		expect(css).toContain("Authored overlay");
		expect(css).toContain("--theme-red-600: #e11d48;");
		expect(css).toContain("--theme-pink-600: #db2777;");
		expect(css).toContain("--theme-violet-600: #7c3aed;");
		expect(css).toContain("--theme-gradient-crimson:");
	});

	test("personalities are not blue-swaps: primaries differ per theme", () => {
		const primaries = new Set();
		for (const slug of SLUGS) {
			if (slug === "blue") continue;
			const css = read(`src/theme/themes/${slug}.css`);
			const m = css.match(/--theme-sky-500: ([^;]+);/);
			expect(m).toBeTruthy();
			primaries.add(m[1].trim());
		}
		// 11 distinct primary values (mono gray … plasma pink … solaris orange)
		expect(primaries.size).toBe(11);
		expect(primaries.has("#0ea5e9")).toBe(false);
	});

	test("tailwind var-indirection covers the template's base shades + brand", () => {
		const mapping = read("src/theme/themes/tailwind-tokens.css");
		expect(mapping).toContain("@theme");
		expect(mapping).toContain("--color-sky-500: var(--theme-sky-500);");
		expect(mapping).toContain("--color-slate-950: var(--theme-slate-950);");
		expect(mapping).toContain("--color-gtBlue: var(--theme-brand, #0a66c2);");
		expect(read("src/tailwind.css")).toContain('@import "./theme/themes/tailwind-tokens.css";');
	});

	test("theme slice validates names and persists them", () => {
		const slice = read("src/store/themeSlice.js");
		expect(slice).toContain("themeName");
		expect(slice).toContain('localStorage.setItem("themeName"');
		expect(slice).toContain("VALID_THEMES.has");
	});

	test("no UI-theming arbitrary hex literals remain (brand/loader/content kept)", () => {
		// Every literal below was migrated to a var(--theme-*) twin so themes re-skin it.
		// Documented keeps (not matched here): NeonAtom loader splash, BotLogo SVG,
		// AttachmentPreviewModal code-syntax colors.
		const banned = [
			"bg-[#0b1220]",
			"bg-[#07111f]",
			"bg-[#0A66C2]",
			"text-[#0A66C2]",
			"bg-[#3b82f6]/10",
			"text-[#2563eb]",
			"bg-[#38bdf8]/10",
			"text-[#38bdf8]",
			"bg-[#171031]",
			"bg-[#2a2744]",
			"bg-[#14122b]",
			"bg-[#0f0d22]",
			"bg-[#0b1020]",
			"bg-[#0B1224]",
			"bg-[#0b1224]",
			"bg-[#f5f9ff]",
			"bg-[#f3f9ff]",
			"bg-[#edf6ff]",
			"bg-[#ffffff]",
		];
		const hits = [];
		const walk = (dir) => {
			for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
				if (entry.name === "color palettes css" || entry.name === "theme") continue;
				const full = path.join(dir, entry.name);
				if (entry.isDirectory()) walk(full);
				else if (/\.(jsx|js)$/.test(entry.name)) {
					const text = fs.readFileSync(full, "utf8");
					for (const lit of banned) {
						if (text.includes(lit)) hits.push(`${path.relative(root, full)}: ${lit}`);
					}
				}
			}
		};
		walk(path.join(root, "src"));
		expect(hits).toEqual([]);
	});
});

describe("themes hotkey (type 'themes' within 3.6s anywhere)", () => {
	function feed(word, gapMs, startAt = 1000) {
		const state = createThemeHotkeyState();
		let fired = false;
		let at = startAt;
		for (const ch of word) {
			fired =
				trackThemeHotkey(state, {
					key: ch,
					repeat: false,
					metaKey: false,
					ctrlKey: false,
					altKey: false,
					now: at,
				}) || fired;
			at += gapMs;
		}
		return fired;
	}

	test("fires when typed fast enough", () => {
		expect(feed("themes", 200)).toBe(true);
		expect(feed("THEMES", 100)).toBe(true); // case-insensitive
		expect(feed("themes", 700)).toBe(true); // 6 chars x 700ms = 3.5s span
	});

	test("does not fire when too slow", () => {
		expect(feed("themes", 800)).toBe(false); // 5 x 800ms = 4.0s span
	});

	test("does not fire on partial or polluted input", () => {
		expect(feed("theme", 100)).toBe(false);
		expect(feed("xthemes", 900)).toBe(false); // last-6 spells 'themes' but span 4.5s > 3.6s
	});

	test("ignores repeats, modifiers, and non-character keys", () => {
		const state = createThemeHotkeyState();
		const base = { repeat: false, metaKey: false, ctrlKey: false, altKey: false, now: 0 };
		expect(trackThemeHotkey(state, { ...base, key: "t", repeat: true, now: 0 })).toBe(false);
		expect(trackThemeHotkey(state, { ...base, key: "h", metaKey: true, now: 100 })).toBe(false);
		expect(trackThemeHotkey(state, { ...base, key: "Enter", now: 200 })).toBe(false);
		expect(trackThemeHotkey(state, { ...base, key: "Shift", now: 300 })).toBe(false);
	});

	test("switcher is mounted globally and listens for the hotkey", () => {
		expect(read("src/App.jsx")).toContain("<ThemeSwitcher />");
		expect(read("src/components/ThemeSwitcher.jsx")).toContain("open-theme-switcher");
		expect(read("src/components/ThemeSwitcher.jsx")).toContain("setThemeName(t.slug)");
	});
});
