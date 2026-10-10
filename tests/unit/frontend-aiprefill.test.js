import { mapExtractedToForm } from "../../src/lib/aiPrefill.js";

describe("AI extraction to form mapper (src/lib/aiPrefill.js)", () => {
	test("returns empty-shape object for missing input, {} for wrong types", () => {
		expect(mapExtractedToForm(null)).toEqual({});
		expect(mapExtractedToForm("text")).toEqual({});
		// undefined triggers the {} default parameter, so it maps like an empty object
		expect(mapExtractedToForm(undefined)).toEqual(mapExtractedToForm({}));
		expect(Object.keys(mapExtractedToForm({}))).toContain("product_type");
	});

	test("maps core requirement fields with legacy compat keys", () => {
		const form = mapExtractedToForm({
			product_type: "Organic Cotton Textile",
			category: "Denim",
			quantity: 5000,
			unit: "meters",
			incoterm: "FOB",
			certifications: ["GOTS", "OEKO-TEX"],
			notes: "Rush order",
		});
		expect(form.product_type).toBe("Organic Cotton Textile");
		expect(form.category).toBe("Denim");
		expect(form.totalQuantity).toBe("5000");
		expect(form.quantity).toBe("5000");
		expect(form.unit).toBe("meters");
		expect(form.incoterm).toBe("FOB");
		expect(form.incoterms).toBe("FOB");
		expect(form.certifications).toEqual(["GOTS", "OEKO-TEX"]);
		expect(form.notes).toBe("Rush order");
		expect(form.requestType).toBe("textile");
	});

	test("formats price ranges into display strings", () => {
		const form = mapExtractedToForm({ price: { min: 4.5, max: 6.0, currency: "USD" } });
		expect(form.targetFobPrice).toBe("USD 4.5-6");
		expect(form.targetPrice).toBe("USD 4.5-6");
		expect(form.target_price).toBe("4.5");

		const single = mapExtractedToForm({ price: { min: 5, currency: "BDT" } });
		expect(single.targetFobPrice).toBe("BDT 5");
	});

	test("falls back to moq for quantity and handles timeline shapes", () => {
		const withMoq = mapExtractedToForm({ moq: 1000 });
		expect(withMoq.moq).toBe("1000");
		expect(withMoq.quantity).toBe("1000");

		expect(mapExtractedToForm({ timeline: { normalized_days: 45 } }).leadTimeRequired).toBe(
			"45 days",
		);
		expect(mapExtractedToForm({ timeline: 30 }).leadTimeRequired).toBe("30 days");
	});

	test("maps fabric composition, weight, and compliance fields", () => {
		const form = mapExtractedToForm({
			fabric: { composition: "100% Cotton", gsm: 280 },
			compliance: { notes: "Needs audit", certs: ["BSCI"] },
		});
		expect(form.fabricComposition).toBe("100% Cotton");
		expect(form.fiberComposition).toBe("100% Cotton");
		expect(form.fabricWeightGsm).toBe("280");
		expect(form.complianceNotes).toBe("Needs audit");
		expect(form.complianceCerts).toEqual(["BSCI"]);
	});

	test("normalizes non-array certifications to empty arrays", () => {
		expect(mapExtractedToForm({ certifications: "GOTS" }).certifications).toEqual([]);
		expect(mapExtractedToForm({}).certifications).toEqual([]);
	});
});
