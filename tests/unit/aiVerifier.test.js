import { verifyExtraction } from "../../server/services/aiVerifier.js";

describe("aiVerifier fallback", () => {
  test("verifies when product_type present", async () => {
    const r = await verifyExtraction({ product_type: "t-shirt" });
    expect(r).toBeDefined();
    expect(r.verified).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(1);
  });

  test("fails verification when missing product_type", async () => {
    const r = await verifyExtraction({});
    expect(r).toBeDefined();
    expect(r.verified).toBe(false);
    expect(r.score).toBe(0);
  });
});
