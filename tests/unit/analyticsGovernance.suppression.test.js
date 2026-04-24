import { sanitizePlatformAnalytics } from "../../server/services/analyticsGovernanceService.js";

describe("analytics governance - suppression behavior", () => {
  test("aggregates small labeled buckets into insufficient_data", () => {
    const raw = {
      top_categories_global: [
        { label: "SmallA", count: 3 },
        { label: "SmallB", count: 4 },
        { label: "Large", count: 25 },
      ],
      price_range_demand: [
        { bucket: "0-5", count: 2 },
        { bucket: "50+", count: 50 },
      ],
    };
    const config = { enabled: true, min_cohort_size: 10 };
    const out = sanitizePlatformAnalytics(raw, config);
    expect(out).toBeDefined();
    expect(out.report).toBeDefined();
    // top_categories_global should include an insufficient_data bucket
    const global = out.report.top_categories_global || [];
    expect(Array.isArray(global)).toBe(true);
    const hasInsufficient = global.some((r) =>
      String(r.label || r.bucket || "")
        .toLowerCase()
        .includes("insufficient"),
    );
    expect(hasInsufficient).toBe(true);
  });
});
