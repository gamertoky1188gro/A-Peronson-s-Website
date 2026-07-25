import fs from "node:fs/promises";
import path from "node:path";

async function readSource(relPath) {
	return fs.readFile(path.join(process.cwd(), relPath), "utf8");
}

describe("Access denied UX contracts", () => {
	test("AccessDenied page renders action links and back button", async () => {
		const source = await readSource("src/pages/AccessDenied.jsx");
		expect(source).toMatch(/Access denied/);
		expect(source).toMatch(/"login"/);
		expect(source).toMatch(/"feed"/);
		expect(source).toMatch(/navigate/);
	});

	test("AccessDeniedState default message and link", async () => {
		const source = await readSource("src/components/AccessDeniedState.jsx");
		expect(source).toMatch(/permission to access/);
		expect(source).toMatch(/"access-denied"/);
	});
});
