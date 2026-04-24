import { mapExtractedToForm } from "../../src/lib/aiPrefill.js";

describe("aiPrefill mapping", () => {
  test("maps extracted fields to form shape", () => {
    const extracted = {
      product_type: "shirt",
      category: "tops",
      moq: 100,
      target_price: 5,
      timeline: "6 weeks",
      incoterm: "FOB",
      certifications: ["OEKO"],
      notes: "Some notes",
    };
    const mapped = mapExtractedToForm(extracted);
    expect(mapped.product_type).toBe("shirt");
    expect(mapped.category).toBe("tops");
    expect(mapped.moq).toBe("100");
    expect(mapped.target_price).toBe("5");
    expect(Array.isArray(mapped.certifications)).toBe(true);
  });
});
