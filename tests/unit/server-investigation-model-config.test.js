import { jest } from "@jest/globals";

const brandingStore = new Map();
const historyCalls = [];

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		adminBranding: {
			findUnique: jest.fn(async ({ where }) => brandingStore.get(where.brand_key) ?? null),
			findMany: jest.fn(async ({ where }) => [...brandingStore.values()]),
			upsert: jest.fn(async ({ where, create, update }) => {
				const row = {
					...(brandingStore.get(where.brand_key) || {}),
					...(update || create),
					brand_key: where.brand_key,
				};
				brandingStore.set(where.brand_key, row);
				return row;
			}),
		},
		adminConfigHistory: {
			create: jest.fn(async ({ data }) => {
				historyCalls.push(data);
				return data;
			}),
		},
		$transaction: jest.fn(async (ops) =>
			Promise.all(
				ops.map((op) => (op && typeof op.then === "function" ? op : Promise.resolve(op))),
			),
		),
	},
}));
jest.unstable_mockModule("../../server/services/investigation/modelCatalog.js", () => ({
	getOpenCodeFreeModels: jest.fn(async () => ({
		models: [
			{
				id: "minimax-m3.1-flash-free",
				name: "MiniMax",
				providerID: "opencode",
				created: 1,
				ownedBy: "opencode",
			},
			{
				id: "deepseek-v4.1-flash-free",
				name: "DeepSeek",
				providerID: "opencode",
				created: 1,
				ownedBy: "opencode",
			},
			{
				id: "big-pickle",
				name: "Big Pickle",
				providerID: "opencode",
				created: 1,
				ownedBy: "opencode",
			},
			{
				id: "longcat-2.5-free",
				name: "LongCat",
				providerID: "opencode",
				created: 1,
				ownedBy: "opencode",
			},
		],
		cached: false,
		fetchedAt: 1000,
	})),
}));
const svc = await import("../../server/services/investigation/investigationModelConfigService.js");
beforeEach(() => {
	brandingStore.clear();
	historyCalls.length = 0;
});

it("default allowed excludes longcat; iceman never appears", async () => {
	const cfg = await svc.getInvestigationModelConfig();
	expect(cfg.allowed).not.toContain("longcat-2.5-free");
	expect(cfg.allowed).not.toContain("iceman-free");
});
it("setInvestigationModelConfig persists and audits; default must be in allowed", async () => {
	await svc
		.setInvestigationModelConfig(
			{ allowed: ["minimax-m3.1-flash-free"], default: "deepseek-v4.1-flash-free" },
			"owner-1",
		)
		.then(
			() => {
				throw new Error("should have thrown");
			},
			(e) => expect(e.status).toBe(400),
		);
	const next = await svc.setInvestigationModelConfig(
		{
			allowed: ["deepseek-v4.1-flash-free"],
			default: "deepseek-v4.1-flash-free",
			buyerSelectEnabled: true,
		},
		"owner-1",
	);
	expect(historyCalls).toHaveLength(1);
	expect(next.default).toBe("deepseek-v4.1-flash-free");
});

it("a per-role pin is persisted and survives a read", async () => {
	await svc.setInvestigationModelConfig(
		{
			allowed: ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"],
			default: "minimax-m3.1-flash-free",
			roleModels: { lead: "deepseek-v4.1-flash-free" },
		},
		"owner-1",
	);
	const cfg = await svc.getInvestigationModelConfig();
	expect(cfg.roleModels).toEqual({ lead: "deepseek-v4.1-flash-free" });
});

it("a pin to a model that is not allowed is refused with a 400", async () => {
	await expect(
		svc.setInvestigationModelConfig(
			{
				allowed: ["minimax-m3.1-flash-free"],
				default: "minimax-m3.1-flash-free",
				roleModels: { lead: "deepseek-v4.1-flash-free" },
			},
			"owner-1",
		),
	).rejects.toMatchObject({ status: 400 });
});

it("a pin to an unknown role is refused with a 400", async () => {
	await expect(
		svc.setInvestigationModelConfig(
			{
				allowed: ["minimax-m3.1-flash-free"],
				default: "minimax-m3.1-flash-free",
				roleModels: { wizard: "minimax-m3.1-flash-free" },
			},
			"owner-1",
		),
	).rejects.toMatchObject({ status: 400 });
});

it("a pin to a model that is not free never survives a read", async () => {
	await svc.setInvestigationModelConfig(
		{
			allowed: ["minimax-m3.1-flash-free"],
			default: "minimax-m3.1-flash-free",
			roleModels: { lead: "minimax-m3.1-flash-free" },
		},
		"owner-1",
	);
	// A forged row in the store (an old key written by hand) must not put a
	// non-free model into the chain.
	brandingStore.set("ai.opencode.investigation_role_models", {
		brand_key: "ai.opencode.investigation_role_models",
		value: JSON.stringify({ lead: "iceman-free", code: "minimax-m3.1-flash-free" }),
		active: true,
	});
	const cfg = await svc.getInvestigationModelConfig();
	expect(cfg.roleModels).toEqual({ code: "minimax-m3.1-flash-free" });
});

it("a routing rule is persisted and survives a read", async () => {
	await svc.setInvestigationModelConfig(
		{
			allowed: ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"],
			default: "minimax-m3.1-flash-free",
			routing: [{ keyword: "csv", modelId: "deepseek-v4.1-flash-free", role: "code" }],
		},
		"owner-1",
	);
	const cfg = await svc.getInvestigationModelConfig();
	expect(cfg.routing).toEqual([
		{ keyword: "csv", modelId: "deepseek-v4.1-flash-free", role: "code" },
	]);
});

it("a routing rule for a model that is not allowed is refused with a 400", async () => {
	await expect(
		svc.setInvestigationModelConfig(
			{
				allowed: ["minimax-m3.1-flash-free"],
				default: "minimax-m3.1-flash-free",
				routing: [{ keyword: "csv", modelId: "deepseek-v4.1-flash-free" }],
			},
			"owner-1",
		),
	).rejects.toMatchObject({ status: 400 });
});

it("a routing rule without a keyword is refused with a 400", async () => {
	await expect(
		svc.setInvestigationModelConfig(
			{
				allowed: ["minimax-m3.1-flash-free"],
				default: "minimax-m3.1-flash-free",
				routing: [{ keyword: "  ", modelId: "minimax-m3.1-flash-free" }],
			},
			"owner-1",
		),
	).rejects.toMatchObject({ status: 400 });
});
