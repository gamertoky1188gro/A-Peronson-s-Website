import { jest } from "@jest/globals";

// Per-agent model assignment (Phase D.1).
//
// The owner pins a model to one of the five investigation agents. The pin
// only decides the ORDER of the chain for that role: the chain itself is
// still the truth about what the runtime offers, so a pin the runtime does
// not have is ignored rather than honoured.

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		supportInvestigation: { findMany: jest.fn(async () => []) },
		adminBranding: { findMany: jest.fn(async () => []) },
	},
}));

const { orderChainForRole, routedModelId } = await import(
	"../../server/services/investigationQueue.js"
);

const CHAIN = [
	{ id: "minimax-m3.1-flash-free", providerID: "opencode" },
	{ id: "glm-5.3-flash-free", providerID: "opencode" },
	{ id: "deepseek-v4.1-flash-free", providerID: "opencode" },
];

describe("orderChainForRole", () => {
	it("the pinned model leads the chain for that role", () => {
		const ordered = orderChainForRole(CHAIN, "deepseek-v4.1-flash-free");
		expect(ordered.map((m) => m.id)).toEqual([
			"deepseek-v4.1-flash-free",
			"minimax-m3.1-flash-free",
			"glm-5.3-flash-free",
		]);
	});

	it("no pin leaves the chain alone", () => {
		expect(orderChainForRole(CHAIN, "").map((m) => m.id)).toEqual(CHAIN.map((m) => m.id));
		expect(orderChainForRole(CHAIN, null).map((m) => m.id)).toEqual(CHAIN.map((m) => m.id));
	});

	it("a pin the runtime does not offer is ignored", () => {
		const ordered = orderChainForRole(CHAIN, "iceman-free");
		expect(ordered.map((m) => m.id)).toEqual(CHAIN.map((m) => m.id));
	});

	it("the chain is not mutated", () => {
		orderChainForRole(CHAIN, "glm-5.3-flash-free");
		expect(CHAIN.map((m) => m.id)).toEqual([
			"minimax-m3.1-flash-free",
			"glm-5.3-flash-free",
			"deepseek-v4.1-flash-free",
		]);
	});
});

describe("routedModelId", () => {
	const ROUTING = [
		{ keyword: "csv", modelId: "glm-5.3-flash-free" },
		{ keyword: "login", modelId: "deepseek-v4.1-flash-free", role: "code" },
	];

	it("a keyword in the case text picks the model", () => {
		expect(routedModelId(ROUTING, "The CSV export is empty", "lead")).toBe("glm-5.3-flash-free");
	});

	it("the match is case-insensitive", () => {
		expect(routedModelId(ROUTING, "the csv export is empty", "code")).toBe("glm-5.3-flash-free");
	});

	it("a role-scoped rule only fires for that role", () => {
		expect(routedModelId(ROUTING, "the login button does nothing", "code")).toBe(
			"deepseek-v4.1-flash-free",
		);
		expect(routedModelId(ROUTING, "the login button does nothing", "repo")).toBe("");
	});

	it("no keyword, no model", () => {
		expect(routedModelId(ROUTING, "something else entirely", "lead")).toBe("");
		expect(routedModelId(ROUTING, "", "lead")).toBe("");
	});

	it("the first matching rule wins", () => {
		expect(
			routedModelId(
				[
					{ keyword: "csv", modelId: "a-free" },
					{ keyword: "csv", modelId: "b-free" },
				],
				"csv csv",
				"lead",
			),
		).toBe("a-free");
	});
});

describe("orderChainForRole with a preferred list", () => {
	it("the pin leads, the routed model follows it", () => {
		const ordered = orderChainForRole(CHAIN, ["glm-5.3-flash-free", "deepseek-v4.1-flash-free"]);
		expect(ordered.map((m) => m.id)).toEqual([
			"glm-5.3-flash-free",
			"deepseek-v4.1-flash-free",
			"minimax-m3.1-flash-free",
		]);
	});

	it("a preferred model the runtime does not offer is skipped", () => {
		const ordered = orderChainForRole(CHAIN, ["iceman-free", "deepseek-v4.1-flash-free"]);
		expect(ordered.map((m) => m.id)).toEqual([
			"deepseek-v4.1-flash-free",
			"minimax-m3.1-flash-free",
			"glm-5.3-flash-free",
		]);
	});
});
