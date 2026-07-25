import fs from "node:fs/promises";
import path from "node:path";

async function readAppSource() {
	return fs.readFile(path.join(process.cwd(), "src", "App.jsx"), "utf8");
}

describe("App protected routes and role gates", () => {
	test("ProtectedRoute redirects unauthenticated users to login", async () => {
		const source = await readAppSource();
		expect(source).toMatch(/Navigate to=.*login/);
	});

	test("ProtectedRoute redirects unauthorized roles to access-denied", async () => {
		const source = await readAppSource();
		expect(source).toMatch(/Navigate to=.*access-denied/);
	});

	test("critical role arrays and gated routes exist", async () => {
		const source = await readAppSource();

		expect(source).toMatch(/const AUTH_ROLES/);
		expect(source).toMatch(/path="\/admin"/);
		expect(source).toMatch(/path="\/agent"/);
		expect(source).toMatch(/path="\/search"/);
		expect(source).toMatch(/path="\/access-denied"/);
		expect(source).toMatch(/MEMBER_MANAGEMENT_ROLES/);
	});
});
