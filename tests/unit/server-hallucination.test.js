import { detectHallucination } from "../../server/utils/hallucinationDetector.js";

describe("hallucination detector (server/utils/hallucinationDetector.js)", () => {
	test("flags non-objects and empty extractions as hallucinations", () => {
		expect(detectHallucination(null)).toEqual({ hallucination: true, score: 1.0 });
		expect(detectHallucination("text")).toEqual({ hallucination: true, score: 1.0 });
		expect(detectHallucination({})).toEqual({ hallucination: true, score: 1.0 });
	});

	test("scores a complete extraction below the threshold", () => {
		const result = detectHallucination({
			product_type: "Denim Fabric",
			moq: 500,
			target_price: 4.5,
		});
		expect(result.hallucination).toBe(false);
		expect(result.score).toBeLessThan(0.7);
	});

	test("penalizes a missing product_type core field", () => {
		const result = detectHallucination({ moq: 100 });
		expect(result.score).toBeGreaterThanOrEqual(0.5);
	});

	test("penalizes impossible numeric ranges", () => {
		const moq = detectHallucination({ product_type: "Yarn", moq: 5_000_000 });
		expect(moq.score).toBeGreaterThanOrEqual(0.3);
		const price = detectHallucination({ product_type: "Yarn", target_price: 9_999_999 });
		expect(price.score).toBeGreaterThanOrEqual(0.3);
	});

	test("clamps combined penalties at 1.0 and flags hallucinations", () => {
		const result = detectHallucination({ moq: 9_999_999, target_price: 9_999_999 });
		expect(result.score).toBeLessThanOrEqual(1);
		// missing product_type (0.5) + moq (0.3) + price (0.3) = 1.1 -> clamped to 1
		expect(result).toEqual({ hallucination: true, score: 1 });
	});

	test("parses string MOQs with units before judging", () => {
		expect(detectHallucination({ product_type: "Knit", moq: "5,000 pcs" }).hallucination).toBe(
			false,
		);
	});
});
