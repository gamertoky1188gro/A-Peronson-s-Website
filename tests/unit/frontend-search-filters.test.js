import fs from "node:fs";
import path from "node:path";
import {
	ADVANCED_FILTER_KEYS,
	DEFAULT_CORE_FILTER_KEYS,
	validateCoreFilterRenderKeys,
} from "../../src/pages/searchFiltersConfig.js";

const schema = JSON.parse(
	fs.readFileSync(
		path.join(process.cwd(), "server", "schemas", "searchFilters.schema.json"),
		"utf8",
	),
);

describe("search filter config (src/pages/searchFiltersConfig.js)", () => {
	test("core filter keys match the documented free-tier set", () => {
		expect(DEFAULT_CORE_FILTER_KEYS).toEqual([
			"industry",
			"category",
			"verifiedOnly",
			"incoterms",
			"moqRange",
			"priceRange",
			"orgType",
			"leadTimeMax",
		]);
	});

	test("advanced keys are non-empty and disjoint from core keys", () => {
		expect(ADVANCED_FILTER_KEYS.length).toBeGreaterThan(10);
		for (const key of ADVANCED_FILTER_KEYS) {
			expect(DEFAULT_CORE_FILTER_KEYS).not.toContain(key);
		}
		expect(ADVANCED_FILTER_KEYS).toContain("fabricType");
		expect(ADVANCED_FILTER_KEYS).toContain("certifications");
	});

	test("validateCoreFilterRenderKeys flags unknown keys and over-rendering", () => {
		const ok = validateCoreFilterRenderKeys(["industry", "category"]);
		expect(ok).toMatchObject({ isValid: true, unknownKeys: [], exceededLimit: false });

		const bad = validateCoreFilterRenderKeys(["industry", "nonexistent_filter"]);
		expect(bad.isValid).toBe(false);
		expect(bad.unknownKeys).toEqual(["nonexistent_filter"]);

		const over = validateCoreFilterRenderKeys([...DEFAULT_CORE_FILTER_KEYS, "extra"]);
		expect(over.exceededLimit).toBe(true);
		expect(over.isValid).toBe(false);
	});

	test("validateCoreFilterRenderKeys dedupes and ignores falsy entries", () => {
		const result = validateCoreFilterRenderKeys(["industry", "industry", null, "category"]);
		expect(result.rendered).toEqual(["industry", "category"]);
		expect(result.isValid).toBe(true);
	});

	test("schema covers the filter keys the UI can send", () => {
		const props = schema.properties || {};
		for (const key of [
			"category",
			"verifiedOnly",
			"certifications",
			"incoterms",
			"gsmMin",
			"leadTimeMax",
		]) {
			expect(props[key]).toBeDefined();
		}
	});
});
