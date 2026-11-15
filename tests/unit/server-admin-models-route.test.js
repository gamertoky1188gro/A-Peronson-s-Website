import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		user: { findUnique: jest.fn(async () => ({ id: "owner-1", role: "owner" })) },
		appState: { findUnique: jest.fn(async () => null) },
		assistantKnowledge: { findMany: jest.fn(async () => []) },
		adminBranding: {
			findUnique: jest.fn(async () => null),
			upsert: jest.fn(async () => ({})),
		},
		adminConfigHistory: { create: jest.fn(async () => ({})) },
	},
}));

const assistantRoutes = (await import("../../server/routes/assistantRoutes.js")).default;

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/assistant", assistantRoutes);
	return app;
}

describe("GET /api/assistant/models", () => {
	test("requires authentication", async () => {
		const res = await request(buildApp()).get("/api/assistant/models");
		expect(res.status).toBe(401);
	});
});
