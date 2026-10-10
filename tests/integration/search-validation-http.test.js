import express from "express";
import request from "supertest";
import validateFiltersMiddleware from "../../server/middleware/validateSearchFilters.js";

function buildApp() {
	const app = express();
	app.use(express.json());
	app.get("/api/products/search", validateFiltersMiddleware, (req, res) =>
		res.json({ ok: true, filters: req.parsedFilters }),
	);
	return app;
}

describe("search filter validation over HTTP (validateSearchFilters + schema)", () => {
	test("accepts a clean query and returns coerced filters", async () => {
		const res = await request(buildApp())
			.get("/api/products/search")
			.query({ verifiedOnly: "true", gsmMin: "180", category: "Denim,Knit" })
			.expect(200);
		expect(res.body.ok).toBe(true);
		expect(res.body.filters).toMatchObject({ verifiedOnly: true, gsmMin: 180 });
		expect(res.body.filters.category).toEqual(["Denim", "Knit"]);
	});

	test("rejects mistyped numeric filters with 400 + details", async () => {
		const res = await request(buildApp())
			.get("/api/products/search")
			.query({ gsmMin: "not-a-number-at-all" })
			.expect(400);
		expect(res.body.error).toMatch(/Invalid search filter/);
		expect(Array.isArray(res.body.details)).toBe(true);
		expect(res.body.details[0]).toMatchObject({ key: "gsmMin" });
	});

	test("passes unknown future filters through untouched", async () => {
		await request(buildApp())
			.get("/api/products/search")
			.query({ someFutureFilter: "x" })
			.expect(200);
	});

	test("accepts an empty query", async () => {
		const res = await request(buildApp()).get("/api/products/search").expect(200);
		expect(res.body.ok).toBe(true);
	});
});
