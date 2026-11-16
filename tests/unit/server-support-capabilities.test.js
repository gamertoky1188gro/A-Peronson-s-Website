import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// The support capabilities endpoint.
//
// requireAuth is the real middleware (the same signToken/verify path the app
// uses) and supportRoutes is the real router; prisma is stubbed because the
// capability handler itself touches no rows, and userService is stubbed so
// the JWT lookup resolves against a fixed buyer. The handler reads
// process.env at request time, so the env-key tests set and delete keys per
// test.

const USERS = {
	"buyer-1": { id: "buyer-1", role: "buyer", email: "buyer@example.com" },
};

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({ default: {} }));
jest.unstable_mockModule("../../server/services/userService.js", () => ({
	findUserById: jest.fn(async (id) => USERS[id] ?? null),
}));
// The support-token branch of requireAuthOrSupportToken validates through
// supportTokenService; the route test pins the envelope, not the HMAC.
jest.unstable_mockModule("../../server/services/supportTokenService.js", () => ({
	validateToken: jest.fn(async (token) =>
		token === "gtk_sup_valid-test"
			? {
					ok: true,
					buyer: { id: "support-buyer-1", role: "buyer", email: "support@example.com" },
					tokenId: "tok_test",
					label: "test",
				}
			: { ok: false, reason: "invalid" },
	),
}));

const { signToken } = await import("../../server/middleware/auth.js");
const supportRoutes = (await import("../../server/routes/supportRoutes.js")).default;

const AUTH = { Authorization: `Bearer ${signToken(USERS["buyer-1"])}` };
const CAPABILITY_KEYS = ["GITHUB_PERSONAL_ACCESS_TOKEN", "RENDER_API_KEY", "CONTEXT7_API_KEY"];

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/support", supportRoutes);
	return app;
}

const ORIGINAL_ENV = Object.fromEntries(CAPABILITY_KEYS.map((key) => [key, process.env[key]]));

beforeEach(() => {
	for (const key of CAPABILITY_KEYS) {
		delete process.env[key];
	}
});

afterAll(() => {
	for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
		if (value === undefined) {
			delete process.env[key];
		} else {
			process.env[key] = value;
		}
	}
});

describe("GET /api/support/capabilities", () => {
	it("rejects an unauthenticated request with 401", async () => {
		const res = await request(buildApp()).get("/api/support/capabilities");
		expect(res.status).toBe(401);
	});

	it("answers 200 with the capability envelope for a valid x-support-token", async () => {
		const res = await request(buildApp())
			.get("/api/support/capabilities")
			.set("x-support-token", "gtk_sup_valid-test");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			repositoryInspection: true,
			githubHistory: false,
			renderServices: false,
			research: true,
			libraryDocs: false,
			applicationData: false,
		});
	});

	it("answers 200 with the capability envelope for a Bearer gtk_sup_ support token", async () => {
		const res = await request(buildApp())
			.get("/api/support/capabilities")
			.set("Authorization", "Bearer gtk_sup_valid-test");
		expect(res.status).toBe(200);
		expect(res.body.githubHistory).toBe(false);
	});

	it("rejects a revoked-looking support token with 401", async () => {
		const res = await request(buildApp())
			.get("/api/support/capabilities")
			.set("x-support-token", "gtk_sup_not-a-real-token");
		expect(res.status).toBe(401);
	});

	it("answers 200 with the capability envelope for a signed-in user", async () => {
		const res = await request(buildApp()).get("/api/support/capabilities").set(AUTH);
		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			repositoryInspection: true,
			githubHistory: false,
			renderServices: false,
			research: true,
			libraryDocs: false,
			applicationData: false,
		});
	});

	it("reports githubHistory true only when GITHUB_PERSONAL_ACCESS_TOKEN is a non-empty string", async () => {
		process.env.GITHUB_PERSONAL_ACCESS_TOKEN = "   ";
		const blank = await request(buildApp()).get("/api/support/capabilities").set(AUTH);
		expect(blank.body.githubHistory).toBe(false);
		process.env.GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_test_token";
		const set = await request(buildApp()).get("/api/support/capabilities").set(AUTH);
		expect(set.body.githubHistory).toBe(true);
	});

	it("reports renderServices true only when RENDER_API_KEY is a non-empty string", async () => {
		process.env.RENDER_API_KEY = "rnd_test_key";
		const set = await request(buildApp()).get("/api/support/capabilities").set(AUTH);
		expect(set.body.renderServices).toBe(true);
		process.env.RENDER_API_KEY = "";
		const empty = await request(buildApp()).get("/api/support/capabilities").set(AUTH);
		expect(empty.body.renderServices).toBe(false);
	});

	it("reports libraryDocs true only when CONTEXT7_API_KEY is a non-empty string", async () => {
		process.env.CONTEXT7_API_KEY = "ctx_test_key";
		const set = await request(buildApp()).get("/api/support/capabilities").set(AUTH);
		expect(set.body.libraryDocs).toBe(true);
		delete process.env.CONTEXT7_API_KEY;
		const unset = await request(buildApp()).get("/api/support/capabilities").set(AUTH);
		expect(unset.body.libraryDocs).toBe(false);
	});
});
