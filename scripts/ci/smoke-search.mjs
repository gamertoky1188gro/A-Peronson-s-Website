#!/usr/bin/env node
import { Client } from "@opensearch-project/opensearch";

const OPENSEARCH_URL = process.env.OPENSEARCH_URL || "http://localhost:9200";
const client = new Client({ node: OPENSEARCH_URL });
const STRICT_MODE =
  String(process.env.CI || "").toLowerCase() === "true" ||
  String(process.env.OPENSEARCH_REQUIRED || "").toLowerCase() === "true";

async function run() {
  try {
    console.log("Connecting to OpenSearch at", OPENSEARCH_URL);
    await client.ping();
    const productsIndex = "gartexhub_products";

    const body = {
      query: {
        bool: {
          filter: [
            {
              bool: {
                should: [
                  { range: { "role_seats.manager": { gte: 2 } } },
                  { range: { team_seats: { gte: 2 } } },
                ],
              },
            },
          ],
        },
      },
    };

    const res = await client.search({ index: productsIndex, body });
    const hits = res?.body?.hits?.hits || [];
    if (hits.length === 0) {
      console.error(
        "Smoke test failed: no hits found for role_seats.manager>=2",
      );
      process.exit(3);
    }
    const ids = hits.map((h) => h._id);
    console.log("Found hits:", ids);
    if (!ids.includes("prod-1")) {
      console.error("Smoke test failed: expected prod-1 in results");
      process.exit(4);
    }
    console.log("Smoke test passed");
    process.exit(0);
  } catch (err) {
    const message = err?.message || String(err);
    if (!STRICT_MODE) {
      console.warn("Smoke test skipped (OpenSearch unavailable):", message);
      process.exit(0);
      return;
    }
    console.error("Smoke test error", message);
    process.exit(2);
  }
}

if (process.argv[1] && process.argv[1].endsWith("smoke-search.mjs")) run();

export { run };
