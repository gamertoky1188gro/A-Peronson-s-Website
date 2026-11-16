import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// The case-model routes and the admin support-models routes.
//
// Persistence is an in-memory store (only the two supportCase methods the
// routes touch), the model-config service is mocked at the module boundary,
// and the ownership rule runs FOR REAL (caseService -> canReadCase) so a
// stranger is refused by the same rule every other case route uses.
// caseService itself is not mocked: the point of the test is that the routes
// reuse it. The one dependency the routes share with the rest of the server,
// prisma, is the stub.

const state = { cases: new Map() };

const supportCase = {
	findUnique: jest.fn(async ({ where } = {}) => state.cases.get(where?.id) ?? null),
	update: jest.fn(async ({ where, data } = {}) => {
		const row = state.cases.get(where?.id);
		if (!row) {
			const error = new Error("not found");
			error.code = "P2025";
			throw error;
		}
		Object.assign(row, data);
		return { ...row };
	}),
};

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		supportCase,
		supportCaseMessage: { count: jest.fn(async () => 0) },
	},
}));

const findUserById = jest.fn(async (id) => USERS[id] ?? null);
jest.unstable_mockModule("../../server/services/userService.js", () => ({
	findUserById,
}));

const CATALOG = [
	{
		id: "minimax-m3.1-flash-free",
		name: "MiniMax M3.1 Flash",
		providerID: "opencode",
		created: 1_730_000_000_000,
		ownedBy: "minimax",
	},
	{
		id: "deepseek-v4.1-flash-free",
		name: "DeepSeek V4.1 Flash",
		providerID: "opencode",
		created: 1_730_000_000_001,
		ownedBy: "deepseek",
	},
];
const configState = {
	allowed: ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"],
	default: "minimax-m3.1-flash-free",
	buyerSelectEnabled: true,
	catalog: CATALOG,
	catalogStale: false,
	catalogFetchedAt: 1_730_000_000_000,
};
const getBuyerSelectableConfig = jest.fn(async () => ({ ...configState }));
const getInvestigationModelConfig = jest.fn(async () => ({ ...configState }));
const setInvestigationModelConfig = jest.fn(async (input, actorId) => {
	if (Array.isArray(input?.allowed) && input.allowed.length === 0) {
		const error = new Error("At least one allowed model is required");
		error.status = 400;
		throw error;
	}
	if (input?.allowed !== undefined) configState.allowed = [...input.allowed];
	if (input?.default !== undefined) configState.default = input.default;
	if (typeof input?.buyerSelectEnabled === "boolean")
		configState.buyerSelectEnabled = input.buyerSelectEnabled;
	return { ...configState, previousActor: actorId };
});

jest.unstable_mockModule(
	"../../server/services/investigation/investigationModelConfigService.js",
	() => ({
		getBuyerSelectableConfig,
		getInvestigationModelConfig,
		setInvestigationModelConfig,
	}),
);

// The health readout reads the run history; the routes must not depend on
// that table existing, so it is mocked here and asserted as part of the
// response shape.
const HEALTH = {
	windowDays: 14,
	runs: 2,
	models: {
		"minimax-m3.1-flash-free": {
			runs: 2,
			completed: 2,
			failed: 0,
			quotaRefusals: 0,
			otherRefusals: 0,
			avgMs: 42_000,
			lastRunAt: "2026-11-16T10:00:00.000Z",
		},
	},
};
const getModelHealth = jest.fn(async () => ({ ...HEALTH }));
jest.unstable_mockModule("../../server/services/investigation/modelHealthService.js", () => ({
	getModelHealth,
}));

const { signToken } = await import("../../server/middleware/auth.js");
const caseRoutes = (await import("../../server/routes/caseRoutes.js")).default;
const adminSupportModelRoutes = (await import("../../server/routes/adminSupportModelRoutes.js"))
	.default;

const USERS = {
	"buyer-1": { id: "buyer-1", role: "buyer", email: "buyer@example.com" },
	"stranger-1": { id: "stranger-1", role: "buyer", email: "stranger@example.com" },
	"admin-1": { id: "admin-1", role: "admin", email: "admin@example.com" },
};
const AUTH = {
	owner: { Authorization: `Bearer ${signToken(USERS["buyer-1"])}` },
	stranger: { Authorization: `Bearer ${signToken(USERS["stranger-1"])}` },
	admin: { Authorization: `Bearer ${signToken(USERS["admin-1"])}` },
};

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/support/cases", caseRoutes);
	app.use("/api/admin/support-models", adminSupportModelRoutes);
	return app;
}

function seedCase(overrides = {}) {
	const row = {
		id: "case-1",
		user_id: "buyer-1",
		status: "collecting",
		model_id: null,
		...overrides,
	};
	state.cases.set(row.id, row);
	return row;
}

beforeEach(() => {
	state.cases.clear();
	configState.allowed = ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"];
	configState.default = "minimax-m3.1-flash-free";
	configState.buyerSelectEnabled = true;
	configState.catalogStale = false;
	configState.catalogFetchedAt = 1_730_000_000_000;
	jest.clearAllMocks();
});

describe("PUT /api/support/cases/:caseId/model", () => {
	it("a stranger is refused with 403, and the case is not written", async () => {
		seedCase();
		const res = await request(buildApp())
			.put("/api/support/cases/case-1/model")
			.set(AUTH.stranger)
			.send({ modelId: "deepseek-v4.1-flash-free" });
		expect(res.status).toBe(403);
		expect(state.cases.get("case-1").model_id).toBeNull();
		expect(supportCase.update).not.toHaveBeenCalled();
	});

	it("the buyer sets the model on their own case", async () => {
		seedCase();
		const res = await request(buildApp())
			.put("/api/support/cases/case-1/model")
			.set(AUTH.owner)
			.send({ modelId: "deepseek-v4.1-flash-free" });
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ modelId: "deepseek-v4.1-flash-free" });
		expect(state.cases.get("case-1").model_id).toBe("deepseek-v4.1-flash-free");
	});

	it("a model outside the allowlist is refused with 400", async () => {
		seedCase();
		const res = await request(buildApp())
			.put("/api/support/cases/case-1/model")
			.set(AUTH.owner)
			.send({ modelId: "gpt-4o" });
		expect(res.status).toBe(400);
		expect(state.cases.get("case-1").model_id).toBeNull();
	});

	it("the buyer toggle being off refuses the pick with 403", async () => {
		configState.buyerSelectEnabled = false;
		seedCase();
		const res = await request(buildApp())
			.put("/api/support/cases/case-1/model")
			.set(AUTH.owner)
			.send({ modelId: "deepseek-v4.1-flash-free" });
		expect(res.status).toBe(403);
		expect(state.cases.get("case-1").model_id).toBeNull();
	});

	it("null clears the pick", async () => {
		seedCase({ model_id: "deepseek-v4.1-flash-free" });
		const res = await request(buildApp())
			.put("/api/support/cases/case-1/model")
			.set(AUTH.owner)
			.send({ modelId: null });
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ modelId: null });
		expect(state.cases.get("case-1").model_id).toBeNull();
	});

	it("an unknown case is a 404, not a 403", async () => {
		const res = await request(buildApp())
			.put("/api/support/cases/no-such-case/model")
			.set(AUTH.owner)
			.send({ modelId: "deepseek-v4.1-flash-free" });
		expect(res.status).toBe(404);
	});
});

describe("GET /api/support/cases/:caseId/model", () => {
	it("a stranger is refused with 403", async () => {
		seedCase();
		const res = await request(buildApp()).get("/api/support/cases/case-1/model").set(AUTH.stranger);
		expect(res.status).toBe(403);
	});

	it("returns the shape with the effective model", async () => {
		seedCase({ model_id: "deepseek-v4.1-flash-free" });
		const res = await request(buildApp()).get("/api/support/cases/case-1/model").set(AUTH.owner);
		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			modelId: "deepseek-v4.1-flash-free",
			effectiveModelId: "deepseek-v4.1-flash-free",
			default: "minimax-m3.1-flash-free",
			buyerSelectEnabled: true,
			allowed: ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"],
		});
	});

	it("a stored pick that is no longer allowed falls back to the default", async () => {
		seedCase({ model_id: "retired-free" });
		const res = await request(buildApp()).get("/api/support/cases/case-1/model").set(AUTH.owner);
		expect(res.status).toBe(200);
		expect(res.body.effectiveModelId).toBe("minimax-m3.1-flash-free");
		expect(res.body.modelId).toBe("retired-free");
	});
});

describe("GET /api/admin/support-models", () => {
	it("an owner/admin reads the config plus the catalog markers", async () => {
		const res = await request(buildApp()).get("/api/admin/support-models").set(AUTH.admin);
		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			ok: true,
			allowed: ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"],
			default: "minimax-m3.1-flash-free",
			buyerSelectEnabled: true,
			catalog: CATALOG,
			catalogStale: false,
			catalogFetchedAt: 1_730_000_000_000,
			health: HEALTH,
		});
	});

	it("?refresh=1 forwards forceCatalogRefresh to the service", async () => {
		getInvestigationModelConfig.mockClear();
		const res = await request(buildApp())
			.get("/api/admin/support-models?refresh=1")
			.set(AUTH.admin);
		expect(res.status).toBe(200);
		expect(getInvestigationModelConfig).toHaveBeenCalledWith({ forceCatalogRefresh: true });
	});

	it("a buyer is refused", async () => {
		const res = await request(buildApp()).get("/api/admin/support-models").set(AUTH.owner);
		expect([401, 403]).toContain(res.status);
	});
});

describe("PUT /api/admin/support-models", () => {
	it("persists a validated config and returns the same shape", async () => {
		const res = await request(buildApp())
			.put("/api/admin/support-models")
			.set(AUTH.admin)
			.send({
				allowed: ["deepseek-v4.1-flash-free"],
				default: "deepseek-v4.1-flash-free",
				buyerSelectEnabled: false,
			});
		expect(res.status).toBe(200);
		expect(setInvestigationModelConfig).toHaveBeenCalledWith(
			{
				allowed: ["deepseek-v4.1-flash-free"],
				default: "deepseek-v4.1-flash-free",
				buyerSelectEnabled: false,
			},
			"admin-1",
		);
		expect(res.body).toMatchObject({
			allowed: ["deepseek-v4.1-flash-free"],
			default: "deepseek-v4.1-flash-free",
			buyerSelectEnabled: false,
		});
	});

	it("a validation failure from the service surfaces as 400", async () => {
		const res = await request(buildApp())
			.put("/api/admin/support-models")
			.set(AUTH.admin)
			.send({ allowed: [] });
		expect(res.status).toBe(400);
	});
});
