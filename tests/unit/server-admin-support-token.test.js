import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const issueToken = jest.fn(async () => ({
	token: "gtk_sup_testtoken", id: "tok_1", buyer_id: "buyer-1", label: "pilot", expires_at: null, created_at: new Date("2026-11-15"),
}));
const listTokens = jest.fn(async () => []);
const revokeToken = jest.fn(async () => true);

jest.unstable_mockModule("../../server/services/supportTokenService.js", () => ({
	generateToken: () => ({ token: "gtk_sup_testtoken", hash: "h" }),
	hashToken: () => "h",
	issueToken,
	validateToken: jest.fn(async () => ({ ok: true, buyer: { id: "buyer-1", name: "Buyer One", email: "b@example.com", role: "buyer" }, tokenId: "tok_1", label: "pilot" })),
	listTokens,
	revokeToken,
}));

const adminRoutes = (await import("../../server/routes/adminSupportTokenRoutes.js")).default;

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/admin/support-tokens", adminRoutes);
	return app;
}

describe("admin support-token routes", () => {
	test("requires auth", async () => {
		const res = await request(buildApp()).get("/api/admin/support-tokens");
		expect([401, 403]).toContain(res.status);
	});
});
