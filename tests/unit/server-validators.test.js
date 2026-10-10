import {
	escapeHtml,
	isPositiveNumberLike,
	limitWordCount,
	requireFields,
	sanitizeForHtml,
	sanitizeString,
	unescapeHtml,
	validateEmail,
	validatePublicRole,
	validateRole,
} from "../../server/utils/validators.js";

describe("server validators (server/utils/validators.js)", () => {
	test("validateEmail accepts real emails and rejects garbage", () => {
		expect(validateEmail("owner@gartexhub.com")).toBe(true);
		expect(validateEmail("")).toBe(false);
		expect(validateEmail(null)).toBe(false);
		expect(validateEmail("no-at-sign")).toBe(false);
		expect(validateEmail(42)).toBe(false);
	});

	test("validateRole accepts all six platform roles only", () => {
		for (const role of ["buyer", "factory", "buying_house", "admin", "agent", "owner"]) {
			expect(validateRole(role)).toBe(true);
		}
		expect(validateRole("superadmin")).toBe(false);
		expect(validateRole("")).toBe(false);
		expect(validateRole(null)).toBe(false);
	});

	test("validatePublicRole excludes owner/admin from public signup", () => {
		for (const role of ["buyer", "factory", "buying_house", "agent"]) {
			expect(validatePublicRole(role)).toBe(true);
		}
		expect(validatePublicRole("owner")).toBe(false);
		expect(validatePublicRole("admin")).toBe(false);
	});

	test("escapeHtml/unescapeHtml round-trip without XSS payload surviving", () => {
		const evil = `<script>alert("x")</script><img src=x onerror='evil()'>`;
		const escaped = escapeHtml(evil);
		expect(escaped).not.toContain("<script>");
		expect(escaped).toContain("&lt;script&gt;");
		expect(unescapeHtml(escaped)).toBe(evil);
		expect(escapeHtml(123)).toBe("");
		expect(unescapeHtml(null)).toBe("");
	});

	test("sanitizeString trims, collapses whitespace, and caps length", () => {
		expect(sanitizeString("  hello   world  ")).toBe("hello world");
		expect(sanitizeString("a\nb\r\nc")).toBe("a b c");
		expect(sanitizeString("<b>bold</b>")).toBe("&lt;b&gt;bold&lt;/b&gt;");
		expect(sanitizeString("x".repeat(600), 500)).toHaveLength(500);
		expect(sanitizeString(null)).toBe("");
		expect(sanitizeForHtml("ok")).toBe("ok");
	});

	test("requireFields lists every missing field", () => {
		expect(requireFields({ a: 1, b: 2 }, ["a", "b"])).toEqual([]);
		expect(requireFields({ a: 1 }, ["a", "b", "c"])).toEqual(["b", "c"]);
		expect(requireFields({ a: "" }, ["a"])).toEqual(["a"]);
		expect(requireFields({ a: null }, ["a"])).toEqual(["a"]);
	});

	test("isPositiveNumberLike coerces numeric strings", () => {
		expect(isPositiveNumberLike(5)).toBe(true);
		expect(isPositiveNumberLike("3.5")).toBe(true);
		expect(isPositiveNumberLike(0)).toBe(false);
		expect(isPositiveNumberLike(-2)).toBe(false);
		expect(isPositiveNumberLike("abc")).toBe(false);
		expect(isPositiveNumberLike(Number.NaN)).toBe(false);
	});

	test("limitWordCount truncates to whole words", () => {
		expect(limitWordCount("one two three", 5)).toBe("one two three");
		expect(limitWordCount("one two three four", 2)).toBe("one two");
		expect(limitWordCount("   ", 3)).toBe("");
		expect(limitWordCount(null, 3)).toBe("");
	});
});
