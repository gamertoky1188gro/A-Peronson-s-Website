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
import { extractGradients, isBorderSideClass, parseColorClass } from "../../src/theme/themeParser.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

describe("blue theme regression cases (spec 20)", () => {
	test("border colors parse with full prefixes, sides excluded", () => {
		expect(parseColorClass("border-rose-200")).toMatchObject({ prefix: "border", color: "rose-200" });
		expect(parseColorClass("border-blue-400")).toMatchObject({ prefix: "border", color: "blue-400" });
		expect(parseColorClass("border-red-500")).toMatchObject({ prefix: "border", color: "red-500" });
		expect(parseColorClass("border-r-2")).toBeNull();
		expect(parseColorClass("border-t")).toBeNull();
		expect(isBorderSideClass("border-r-2")).toBe(true);
		expect(isBorderSideClass("border-rose-200")).toBe(false);
	});

	test("colored shadows incl. base utilities", () => {
		expect(parseColorClass("shadow-sky-500/20")).toMatchObject({ prefix: "shadow", color: "sky-500", alpha: "20" });
		expect(parseColorClass("shadow-black/20")).toMatchObject({ prefix: "shadow", color: "black", alpha: "20" });
		expect(parseColorClass("shadow-blue-500")).toMatchObject({ prefix: "shadow", color: "blue-500", alpha: null });
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
		expect(parseColorClass("bg-[#3b82f6]/10")).toMatchObject({ prefix: "bg", color: "[#3b82f6]", alpha: "10" });
		expect(parseColorClass("ring-[#3b82f6]/35")).toMatchObject({ prefix: "ring", color: "[#3b82f6]", alpha: "35" });
		const dark = parseColorClass("dark:bg-[#0b1627]/80");
		expect(dark).toMatchObject({ prefix: "bg", color: "[#0b1627]", alpha: "80", variants: ["dark"] });
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
			'--theme-surface: rgba(255, 255, 255, 0.05)',
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

	test("runtime sets data-theme=blue + data-mode (slice, provider, boot script)", () => {
		expect(read("src/store/themeSlice.js")).toContain('setAttribute("data-theme", "blue")');
		expect(read("src/store/themeSlice.js")).toContain('setAttribute("data-mode"');
		expect(read("src/lib/ThemeProvider.jsx")).toContain('setAttribute("data-theme", "blue")');
		expect(read("index.html")).toContain('setAttribute("data-theme", "blue")');
		expect(read("index.html")).toContain('setAttribute("data-mode"');
	});

	test("accent map uses static theme-var classes (Tailwind-safe)", () => {
		const utils = read("src/theme/theme-utils.ts");
		for (const accent of ["sky", "cyan", "blue", "emerald", "amber"]) {
			expect(utils).toContain(`--theme-${accent}-400`);
		}
		const adminPanel = read("src/pages/AdminPanel.jsx");
		const shared = read("src/pages/admin/shared/index.jsx");
		expect(adminPanel).not.toMatch(/border-\$\{accent\}/);
		expect(shared).not.toMatch(/border-\$\{accent\}/);
		expect(adminPanel).toContain("accentClasses(accent)");
		expect(shared).toContain("accentClasses(accent)");
	});

	test("legacy palettes are reference-only (never bundled)", () => {
		expect(read("src/tailwind.css")).not.toContain("color palettes");
		expect(read("src/main.jsx")).not.toContain("color palettes");
	});
});
