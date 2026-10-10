import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockFindUserById = jest.fn();

describe("auth middleware over HTTP (server/middleware/auth.js + allowRoles)", () => {
	let signToken;
	let requireAuth;
	let allowRoles;

	function buildApp() {
		const app = express();
		app.use(express.json());
		app.get("/probe", requireAuth, (req, res) =>
			res.json({ id: req.user.id, role: req.user.role }),
		);
		app.get("/factory-only", requireAuth, allowRoles("factory"), (_req, res) =>
			res.json({ ok: true }),
		);
		return app;
	}

	beforeEach(async () => {
		jest.resetModules();
		mockFindUserById.mockReset();
		mockFindUserById.mockResolvedValue({ id: "u-1", role: "buyer", status: "active" });
		jest.unstable_mockModule("../../server/services/userService.js", () => ({
			findUserById: (...args) => mockFindUserById(...args),
		}));
		const auth = await import("../../server/middleware/auth.js");
		({ signToken, requireAuth, allowRoles } = auth);
	});

	test("rejects missing and malformed tokens with 401", async () => {
		const app = buildApp();
		await request(app).get("/probe").expect(401);
		await request(app).get("/probe").set("Authorization", "Bearer garbage").expect(401);
		await request(app).get("/probe").set("Authorization", "Token abc").expect(401);
	});

	test("authenticates a valid token and exposes req.user downstream", async () => {
		const app = buildApp();
		const token = signToken({ id: "u-1", role: "buyer", email: "b@x.com" });
		const res = await request(app)
			.get("/probe")
			.set("Authorization", `Bearer ${token}`)
			.expect(200);
		expect(res.body).toMatchObject({ id: "u-1", role: "buyer" });
	});

	test("rejects tokens for deleted users with 401", async () => {
		mockFindUserById.mockResolvedValue(null);
		const app = buildApp();
		const token = signToken({ id: "ghost", role: "buyer", email: "g@x.com" });
		await request(app).get("/probe").set("Authorization", `Bearer ${token}`).expect(401);
	});

	test("enforces role gates after authentication", async () => {
		const app = buildApp();
		const buyer = signToken({ id: "u-1", role: "buyer", email: "b@x.com" });
		await request(app).get("/factory-only").set("Authorization", `Bearer ${buyer}`).expect(403);

		mockFindUserById.mockResolvedValue({ id: "f-1", role: "factory", status: "active" });
		const factory = signToken({ id: "f-1", role: "factory", email: "f@x.com" });
		await request(app).get("/factory-only").set("Authorization", `Bearer ${factory}`).expect(200);
	});
});
