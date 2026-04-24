import fs from "fs";
import path from "path";
import { FILTER_TIERS } from "../../server/config/searchAccessConfig.js";

describe("filter mapping verification", () => {
  test("schema includes all configured filter tier keys", async () => {
    const schemaPath = path.join(
      process.cwd(),
      "server",
      "schemas",
      "searchFilters.schema.json",
    );
    const data = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    const props = data.properties || {};
    const missing = [];
    Object.values(FILTER_TIERS)
      .flat()
      .forEach((k) => {
        if (!Object.prototype.hasOwnProperty.call(props, k)) missing.push(k);
      });
    expect(missing).toEqual([]);
  });
});
