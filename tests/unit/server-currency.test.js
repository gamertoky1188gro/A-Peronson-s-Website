import { jest } from "@jest/globals";

describe("currency service (server/services/currencyService.js)", () => {
	let currency;
	let prisma;

	beforeEach(async () => {
		jest.resetModules();
		// NODE_ENV=test gives us the prisma Proxy; grab handles to override per test.
		prisma = (await import("../../server/utils/prisma.js")).default;
		currency = await import("../../server/services/currencyService.js");
	});

	test("extractOriginalPrice reads direct min/max fields", () => {
		expect(
			currency.extractOriginalPrice({ priceOriginalMin: 4, priceOriginalMax: 6, currency: "usd" }),
		).toEqual({ priceOriginalMin: 4, priceOriginalMax: 6, currency: "USD" });
	});

	test("extractOriginalPrice expands a single price to both ends", () => {
		expect(currency.extractOriginalPrice({ price: 12.5, currency: "BDT" })).toEqual({
			priceOriginalMin: 12.5,
			priceOriginalMax: 12.5,
			currency: "BDT",
		});
	});

	test("extractOriginalPrice parses dash ranges from legacy fields", () => {
		expect(currency.extractOriginalPrice({ price_range: "4-6", currency: "usd" })).toMatchObject({
			priceOriginalMin: 4,
			priceOriginalMax: 6,
		});
		expect(currency.extractOriginalPrice({})).toMatchObject({
			priceOriginalMin: null,
			priceOriginalMax: null,
			currency: "USD",
		});
	});

	test("getRate returns the identity rate for same-currency pairs", async () => {
		const rate = await currency.getRate("usd", "USD");
		expect(rate).toMatchObject({ base: "USD", quote: "USD", rate: 1, stale: false });
	});

	test("normalizeMoney passes through same-currency amounts with rounding", async () => {
		const out = await currency.normalizeMoney("10.55555", "USD", "usd");
		expect(out).toMatchObject({
			amount: 10.5556,
			rate: 1,
			currency_from: "USD",
			currency_base: "USD",
		});
	});

	test("normalizeMoney rejects non-numeric amounts without calling the provider", async () => {
		const out = await currency.normalizeMoney("not-a-number", "USD", "BDT");
		expect(out.amount).toBeNull();
		expect(out.rate).toBeNull();
	});

	test("getRate returns null when no cache exists and the provider is down", async () => {
		prisma.currencyConfig.findFirst = async () => null;
		prisma.fxRate.findUnique = async () => null;
		const realFetch = global.fetch;
		global.fetch = () => Promise.reject(new Error("provider down"));
		try {
			await expect(currency.getRate("USD", "EUR")).resolves.toBeNull();
		} finally {
			global.fetch = realFetch;
		}
	});

	test("getRate serves a fresh cached rate without network", async () => {
		const future = new Date(Date.now() + 3_600_000).toISOString();
		prisma.currencyConfig.findFirst = async () => null;
		prisma.fxRate.findUnique = async () => ({
			rate: 117.5,
			source: "cached",
			fetchedAt: new Date().toISOString(),
			expiresAt: future,
		});
		const rate = await currency.getRate("USD", "BDT");
		expect(rate).toMatchObject({ base: "USD", quote: "BDT", rate: 117.5, fx_stale: false });
	});

	test("getFxHealth exposes the refresh lifecycle fields", () => {
		expect(currency.getFxHealth()).toEqual(
			expect.objectContaining({
				last_refresh_started_at: expect.any(String),
				last_refresh_completed_at: expect.any(String),
			}),
		);
	});
});
