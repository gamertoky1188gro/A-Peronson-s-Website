import fs from "node:fs/promises";
import path from "node:path";

async function readJson(relPath) {
  const raw = await fs.readFile(path.join(process.cwd(), relPath), "utf8");
  return JSON.parse(raw);
}

async function readText(relPath) {
  return fs.readFile(path.join(process.cwd(), relPath), "utf8");
}

describe("frontend infra wiring", () => {
  test("jest config uses jsdom harness for DOM tests", async () => {
    const jestConfig = await readText("jest.config.cjs");
    expect(jestConfig).toMatch(/testEnvironment:\s*'jsdom'/);
    expect(jestConfig).toMatch(/setupFilesAfterEnv/);
  });

  test("package.json provides a dedicated e2e test script", async () => {
    const pkg = await readJson("package.json");
    const scripts = pkg.scripts || {};
    expect(Object.keys(scripts)).toContain("test:e2e");
  });

  test("workflow-lifecycle e2e spec is discoverable by Playwright", async () => {
    const specPath = path.join(
      process.cwd(),
      "tests",
      "e2e",
      "workflow-lifecycle.spec.ts",
    );
    const exists = await fs
      .readFile(specPath, "utf8")
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
  });
});
