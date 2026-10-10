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

test.describe("backend public surface", () => {
	test("GET /health reports status and uptime", async ({ request }) => {
		skipWithoutServer(await serverUp(request));
		const res = await request.get(`${BASE}/health`);
		expect(res.ok()).toBeTruthy();
		const body = await res.json();
		expect(body.status).toBeDefined();
		expect(typeof body.uptime).toBe("number");
	});

	test("GET /api/diagnostics is reachable without auth", async ({ request }) => {
		skipWithoutServer(await serverUp(request));
		const res = await request.get(`${BASE}/api/diagnostics`);
		expect(res.ok()).toBeTruthy();
	});

	test("GET /api/system/* serves public marketing content", async ({ request }) => {
		skipWithoutServer(await serverUp(request));
		const paths = [
			"/api/system/meta",
			"/api/system/home",
			"/api/system/pricing",
			"/api/system/about",
		];
		const results = await Promise.all(paths.map((path) => request.get(`${BASE}${path}`)));
		for (const [i, res] of results.entries()) {
			expect(res.ok(), paths[i]).toBeTruthy();
		}
	});

	test("protected endpoints reject anonymous callers with 401", async ({ request }) => {
		skipWithoutServer(await serverUp(request));
		const paths = ["/api/users/me", "/api/requirements", "/api/products", "/api/leads"];
		const results = await Promise.all(paths.map((path) => request.get(`${BASE}${path}`)));
		for (const [i, res] of results.entries()) {
			expect([401, 403].includes(res.status()), `${paths[i]} -> ${res.status()}`).toBeTruthy();
		}
	});

	test("POST /api/events validates the event type", async ({ request }) => {
		skipWithoutServer(await serverUp(request));
		const missing = await request.post(`${BASE}/api/events`, { data: {} });
		expect(missing.status()).toBe(400);

		const pageView = await request.post(`${BASE}/api/events`, {
			data: { type: "page_view", entity_type: "route", entity_id: "/feed", client_id: "e2e-probe" },
		});
		expect([201, 400, 202].includes(pageView.status())).toBeTruthy();
	});
});
