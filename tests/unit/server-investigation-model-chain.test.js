import {
	DEFAULT_MODEL_CHAIN,
	parseModelChain,
} from "../../server/services/investigation/modelChain.js";

describe("investigation model chain (server/services/investigation/modelChain.js)", () => {
	test("defaults to the ten free models, deepseek first", () => {
		expect(DEFAULT_MODEL_CHAIN).toHaveLength(10);
		expect(DEFAULT_MODEL_CHAIN[0]).toEqual({
			id: "deepseek-v4.1-flash-free",
			providerID: "opencode",
		});
		expect(DEFAULT_MODEL_CHAIN.every((m) => m.providerID === "opencode")).toBe(true);
		expect(DEFAULT_MODEL_CHAIN.every((m) => m.id.endsWith("-free") || m.id === "big-pickle")).toBe(
			true,
		);
	});

	test("parses a comma separated list", () => {
		const chain = parseModelChain("opencode/beam-free, opencode/glm-5.3-flash-free");
		expect(chain).toEqual([
			{ id: "beam-free", providerID: "opencode" },
			{ id: "glm-5.3-flash-free", providerID: "opencode" },
		]);
	});

	test("drops blanks and duplicates, keeping order", () => {
		const chain = parseModelChain("opencode/beam-free,,opencode/beam-free,opencode/ll-alpha-free");
		expect(chain.map((m) => m.id)).toEqual(["beam-free", "ll-alpha-free"]);
	});

	test("falls back to the default chain for empty input", () => {
		expect(parseModelChain("")).toEqual(DEFAULT_MODEL_CHAIN);
		expect(parseModelChain(undefined)).toEqual(DEFAULT_MODEL_CHAIN);
	});
});
