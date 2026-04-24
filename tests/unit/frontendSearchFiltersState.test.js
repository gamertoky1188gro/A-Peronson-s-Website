import fs from "node:fs/promises";
import path from "node:path";
import {
  ADVANCED_FILTER_KEYS,
  DEFAULT_CORE_FILTER_KEYS,
  validateCoreFilterRenderKeys,
} from "../../src/pages/searchFiltersConfig.js";

async function readSearchSource() {
  return fs.readFile(
    path.join(process.cwd(), "src", "pages", "SearchResults.jsx"),
    "utf8",
  );
}

describe("Search filter state + config parity", () => {
  test("SearchResults imports and uses core/advanced filter config", async () => {
    const source = await readSearchSource();
    expect(source).toMatch(
      /import \{ ADVANCED_FILTER_KEYS, DEFAULT_CORE_FILTER_KEYS, validateCoreFilterRenderKeys \} from '\.\/searchFiltersConfig'/,
    );
    expect(source).toMatch(
      /renderedDefaultCoreFilterKeys = useMemo\(\(\) => \[\.\.\.DEFAULT_CORE_FILTER_KEYS\], \[\]\)/,
    );
    expect(source).toMatch(
      /validateCoreFilterRenderKeys\(renderedDefaultCoreFilterKeys\)/,
    );
  });

  test("validateCoreFilterRenderKeys detects unknown and excess keys", () => {
    const result = validateCoreFilterRenderKeys([
      ...DEFAULT_CORE_FILTER_KEYS,
      "unknown_key",
    ]);
    expect(result.isValid).toBe(false);
    expect(result.unknownKeys).toContain("unknown_key");
  });

  test("core and advanced filter sets remain distinct", () => {
    const overlap = DEFAULT_CORE_FILTER_KEYS.filter((key) =>
      ADVANCED_FILTER_KEYS.includes(key),
    );
    expect(overlap).toEqual(["incoterms"]);
  });
});
