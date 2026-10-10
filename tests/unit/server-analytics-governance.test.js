import {
	ANALYTICS_GOVERNANCE_DEFAULTS,
	assertNoUnauthorizedAnalyticsJoin,
	checkAnalyticsAccessPolicy,
	DENIED_ANALYTICS_FIELDS,
	sanitizePlatformAnalytics,
} from "../../server/services/analyticsGovernanceService.js";

describe("analytics governance (server/services/analyticsGovernanceService.js)", () => {
	test("defaults require owner/admin for view and block raw exports", () => {
		expect(ANALYTICS_GOVERNANCE_DEFAULTS.view_allowed_roles).toEqual(
			expect.arrayContaining(["admin", "owner"]),
		);
		expect(ANALYTICS_GOVERNANCE_DEFAULTS.allow_raw_exports).toBe(false);
		expect(DENIED_ANALYTICS_FIELDS).toEqual(
			expect.arrayContaining(["actor_id", "email", "ip", "user_id"]),
		);
	});

	test("checkAnalyticsAccessPolicy enforces view roles", () => {
		expect(checkAnalyticsAccessPolicy({ role: "admin" }).allowed).toBe(true);
		expect(checkAnalyticsAccessPolicy({ role: "owner" }).allowed).toBe(true);
		const denied = checkAnalyticsAccessPolicy({ role: "buyer" });
		expect(denied).toMatchObject({ allowed: false, reason: "analytics_view_denied" });
	});

	test("checkAnalyticsAccessPolicy blocks exports unless explicitly enabled", () => {
		expect(
			checkAnalyticsAccessPolicy({ role: "admin" }, undefined, { mode: "export" }).allowed,
		).toBe(false);
		const open = { ...ANALYTICS_GOVERNANCE_DEFAULTS, allow_raw_exports: true };
		expect(checkAnalyticsAccessPolicy({ role: "admin" }, open, { mode: "export" }).allowed).toBe(
			true,
		);
		expect(checkAnalyticsAccessPolicy({ role: "buyer" }, open, { mode: "export" }).allowed).toBe(
			false,
		);
	});

	test("disabled governance allows everything through", () => {
		const off = { ...ANALYTICS_GOVERNANCE_DEFAULTS, enabled: false };
		expect(checkAnalyticsAccessPolicy({ role: "buyer" }, off).allowed).toBe(true);
	});

	test("assertNoUnauthorizedAnalyticsJoin blocks PII dimensions and joins", () => {
		expect(() => assertNoUnauthorizedAnalyticsJoin(["actor_id"])).toThrow(
			expect.objectContaining({ code: "ANALYTICS_JOIN_BLOCKED" }),
		);
		// A PII dimension combined with a benign one hits the per-dimension rule.
		expect(() => assertNoUnauthorizedAnalyticsJoin(["email", "category"])).toThrow(
			expect.objectContaining({ code: "ANALYTICS_DIMENSION_BLOCKED" }),
		);
		expect(assertNoUnauthorizedAnalyticsJoin(["country", "category"])).toEqual([
			"country",
			"category",
		]);
	});

	test("assertNoUnauthorizedAnalyticsJoin blocks re-identification slices", () => {
		expect(() =>
			assertNoUnauthorizedAnalyticsJoin(["country", "category", "month", "price_bucket"]),
		).toThrow(expect.objectContaining({ code: "ANALYTICS_REIDENTIFICATION_BLOCKED" }));
	});

	test("sanitizePlatformAnalytics suppresses small cohorts into insufficient_data", () => {
		const { report, suppression } = sanitizePlatformAnalytics({
			top_categories_by_country: [],
			top_search_categories_by_country: [],
			monthly_demand_by_category: [],
			monthly_demand_by_product: [],
			top_categories_global: [
				{ label: "Denim", count: 2 },
				{ label: "Knit", count: 50 },
			],
		});
		const labels = report.top_categories_global.map((r) => r.label);
		expect(labels).toContain("insufficient_data");
		expect(labels).toContain("Knit");
		expect(labels).not.toContain("Denim");
		expect(suppression.suppressed_values).toBeGreaterThan(0);
	});

	test("sanitizePlatformAnalytics strips denied identity fields at any depth", () => {
		const { report } = sanitizePlatformAnalytics({
			top_categories_by_country: [],
			top_search_categories_by_country: [],
			monthly_demand_by_category: [],
			monthly_demand_by_product: [],
			totals: { buyer_requests: 10 },
			top_categories_global: [
				{ label: "Knit", count: 100, actor_id: "u-1", email: "a@b.com", ip: "1.2.3.4" },
			],
		});
		const knit = report.top_categories_global.find((r) => r.label === "Knit");
		expect(knit).toBeDefined();
		expect(knit.actor_id).toBeUndefined();
		expect(knit.email).toBeUndefined();
		expect(knit.ip).toBeUndefined();
		expect(knit.count).toBe(100);
	});

	test("sanitizePlatformAnalytics buckets unknown price buckets to 'unknown'", () => {
		const { report } = sanitizePlatformAnalytics({
			top_categories_by_country: [],
			top_search_categories_by_country: [],
			monthly_demand_by_category: [],
			monthly_demand_by_product: [],
			price_range_demand: [
				{ bucket: "WEIRD", count: 100 },
				{ bucket: "0-5", count: 100 },
			],
		});
		expect(report.price_range_demand.map((r) => r.bucket)).toContain("unknown");
	});
});
