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

const { orderChainForRole } = await import("../../server/services/investigationQueue.js");

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
