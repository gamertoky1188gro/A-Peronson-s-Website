import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockFindUserById = jest.fn();

const actor = { id: "factory-1", role: "factory", status: "active" };

describe("search presets over HTTP (server/routes/presetsRoutes.js)", () => {
	let app;
	let signToken;

	beforeEach(async () => {
		jest.resetModules();
		mockFindUserById.mockReset();
		mockFindUserById.mockImplementation(async (id) => (id === actor.id ? actor : null));
		jest.unstable_mockModule("../../server/services/userService.js", () => ({
			findUserById: (...args) => mockFindUserById(...args),
		}));
		const auth = await import("../../server/middleware/auth.js");
		({ signToken } = auth);
		const { default: presetsRoutes } = await import("../../server/routes/presetsRoutes.js");
		app = express();
		app.use(express.json());
		app.use("/api/presets", presetsRoutes);
	});

	test("rejects unauthenticated preset access with 401", async () => {
		await request(app).get("/api/presets").expect(401);
		await request(app).post("/api/presets").send({ name: "x" }).expect(401);
	});

	test("full preset lifecycle over HTTP: create, list, get, patch, delete", async () => {
		const token = signToken({ id: actor.id, role: actor.role, email: "f@x.com" });
		const authHeader = { Authorization: `Bearer ${token}` };

		const created = await request(app)
			.post("/api/presets")
			.set(authHeader)
			.send({ name: "HTTP Denim Hunt", filters: { category: "Denim" }, shared: false })
			.expect(201);
		const { id } = created.body;
		expect(created.body).toMatchObject({ owner_id: actor.id, name: "HTTP Denim Hunt" });

		const listed = await request(app).get("/api/presets").set(authHeader).expect(200);
		expect(listed.body.items.some((p) => p.id === id)).toBe(true);

		await request(app).get(`/api/presets/${id}`).set(authHeader).expect(200);

		const patched = await request(app)
			.patch(`/api/presets/${id}`)
			.set(authHeader)
			.send({ name: "Renamed Hunt" })
			.expect(200);
		expect(patched.body.name).toBe("Renamed Hunt");

		await request(app).delete(`/api/presets/${id}`).set(authHeader).expect(200);
		await request(app).get(`/api/presets/${id}`).set(authHeader).expect(404);
	});

	test("returns 404 for unknown preset ids", async () => {
		const token = signToken({ id: actor.id, role: actor.role, email: "f@x.com" });
		await request(app).get("/api/presets/nope").set("Authorization", `Bearer ${token}`).expect(404);
	});
});
