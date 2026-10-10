import { expect, test } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:4000";

async function serverUp(request): Promise<boolean> {
	try {
		const res = await request.get(`${BASE}/health`);
		return res.ok();
	} catch {
		return false;
	}
}

// Skip cleanly when no API is running (environment-dependent, not a skipped test).
function skipWithoutServer(up: boolean) {
	test.skip(!up, `API server not running at ${BASE}`);
}

test.describe("backend input validation", () => {
	test("search endpoints reject mistyped filters with 400", async ({ request }) => {
		skipWithoutServer(await serverUp(request));
		const res = await request.get(`${BASE}/api/products/search`, {
			params: { gsmMin: "not-a-number-at-all" },
		});
		// Auth may reject first (401) or validation rejects (400); a 500 or 200 is a failure.
		expect([400, 401, 403].includes(res.status()), `status=${res.status()}`).toBeTruthy();
	});

	test("assistant endpoints require their payloads", async ({ request }) => {
		skipWithoutServer(await serverUp(request));
		const extract = await request.post(`${BASE}/api/assistant/extract-requirement`, { data: {} });
		expect(
			[400, 401].includes(extract.status()),
			`extract status=${extract.status()}`,
		).toBeTruthy();

		const reply = await request.post(`${BASE}/api/assistant/generate-first-response`, { data: {} });
		expect([400, 401].includes(reply.status()), `reply status=${reply.status()}`).toBeTruthy();
	});

	test("auth endpoints rate-limit or validate login payloads", async ({ request }) => {
		skipWithoutServer(await serverUp(request));
		const res = await request.post(`${BASE}/api/auth/login`, {
			data: { email: "nobody@example.com", password: "wrong" },
		});
		// Invalid credentials -> 401; malformed -> 400; never a 500 or a leaked token.
		expect([400, 401, 429].includes(res.status()), `status=${res.status()}`).toBeTruthy();
		const body = await res.json().catch(() => ({}));
		expect(body.token).toBeUndefined();
	});
});
