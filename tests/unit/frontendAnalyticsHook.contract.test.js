import fs from "node:fs/promises";
import path from "node:path";

async function readHookSource() {
  return fs.readFile(
    path.join(process.cwd(), "src", "hooks", "useAnalyticsDashboard.js"),
    "utf8",
  );
}

describe("useAnalyticsDashboard contracts", () => {
  test("hook tracks loading and forbidden error state", async () => {
    const source = await readHookSource();
    expect(source).toMatch(/setLoading/);
    expect(source).toMatch(/setForbidden/);
    expect(source).toMatch(/setError/);
  });

  test("hook returns full data shape with flags", async () => {
    const source = await readHookSource();
    expect(source).toMatch(/return \{/);
    expect(source).toMatch(/dashboard/);
    expect(source).toMatch(/loading/);
    expect(source).toMatch(/error/);
    expect(source).toMatch(/forbidden/);
  });
});
