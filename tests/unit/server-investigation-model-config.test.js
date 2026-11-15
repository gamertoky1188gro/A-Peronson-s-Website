import { jest } from "@jest/globals";

const brandingStore = new Map();
const historyCalls = [];

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		adminBranding: {
			findUnique: jest.fn(async ({ where }) => brandingStore.get(where.brand_key) ?? null),
			findMany: jest.fn(async ({ where }) => [...brandingStore.values()]),
			upsert: jest.fn(async ({ where, create, update }) => {
				const row = { ...(brandingStore.get(where.brand_key) || {}), ...(update || create), brand_key: where.brand_key };
				brandingStore.set(where.brand_key, row);
				return row;
			}),
		},
		adminConfigHistory: { create: jest.fn(async ({ data }) => { historyCalls.push(data); return data; }) },
	},
}));
jest.unstable_mockModule("../../server/services/investigation/modelCatalog.js", () => ({
	getOpenCodeFreeModels: jest.fn(async () => ({
		models: [
			{ id: "minimax-m3.1-flash-free", name: "MiniMax", providerID: "opencode", created: 1, ownedBy: "opencode" },
			{ id: "deepseek-v4.1-flash-free", name: "DeepSeek", providerID: "opencode", created: 1, ownedBy: "opencode" },
			{ id: "big-pickle", name: "Big Pickle", providerID: "opencode", created: 1, ownedBy: "opencode" },
			{ id: "longcat-2.5-free", name: "LongCat", providerID: "opencode", created: 1, ownedBy: "opencode" },
		],
		cached: false,
		fetchedAt: 1000,
	})),
}));
const svc = await import("../../server/services/investigation/investigationModelConfigService.js");
beforeEach(() => { brandingStore.clear(); historyCalls.length = 0; });

test("default allowed excludes longcat; iceman never appears", async () => {
	const cfg = await svc.getInvestigationModelConfig();
	expect(cfg.allowed).not.toContain("longcat-2.5-free");
	expect(cfg.allowed).not.toContain("iceman-free");
});
test("setInvestigationModelConfig persists and audits; default must be in allowed", async () => {
	await svc.setInvestigationModelConfig({ allowed: ["minimax-m3.1-flash-free"], default: "deepseek-v4.1-flash-free" }, "owner-1")
		.then(() => { throw new Error("should have thrown"); }, (e) => expect(e.status).toBe(400));
	const next = await svc.setInvestigationModelConfig({ allowed: ["deepseek-v4.1-flash-free"], default: "deepseek-v4.1-flash-free", buyerSelectEnabled: true }, "owner-1");
	expect(historyCalls).toHaveLength(1);
	expect(next.default).toBe("deepseek-v4.1-flash-free");
});
