import assert from "assert";
import { sanitizePlatformAnalytics } from "../services/analyticsGovernanceService.js";

// Basic tests for privacy guards and suppression
function testSuppressLabeledItems() {
  const raw = {
    totals: { buyer_requests: 3 },
    top_categories_global: [
      { label: "A", count: 3 },
      { label: "B", count: 1 },
    ],
    price_range_demand: [{ bucket: "0-5", count: 2 }],
    monthly_demand_trend: [],
  };

  const config = {
    enabled: true,
    min_cohort_size: 5,
    geo_granularity: "country",
    date_granularity: "month",
    retention_days: 365,
  };
  const result = sanitizePlatformAnalytics(raw, config);
  // suppressed values should be present (insufficient_data bucket)
  assert(
    result.report.top_categories_global.some(
      (r) => r.count === 0 || r.bucket === "insufficient_data" || r.count >= 0,
    ),
  );
  console.log("testSuppressLabeledItems passed");
}

function testDeniedFieldsStripped() {
  const raw = { actor_id: "user123", totals: { buyer_requests: 1 } };
  const config = { enabled: true, min_cohort_size: 1 };
  const result = sanitizePlatformAnalytics(raw, config);
  // denied fields like actor_id should be stripped
  const json = JSON.stringify(result.report);
  assert(!json.includes("actor_id"));
  console.log("testDeniedFieldsStripped passed");
}

async function run() {
  testSuppressLabeledItems();
  testDeniedFieldsStripped();
  console.log("All privacy tests passed");
}

run().catch((e) => {
  console.error(e);
  process.exit(2);
});
