import { computeCaseModelOrder } from "../../server/services/investigation/caseModelChain.js";

test("case pick leads when allowed and offered", () => {
	const order = computeCaseModelOrder({
		caseModelId: "deepseek-v4.1-flash-free",
		allowed: ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"],
		available: ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"],
	});
	expect(order[0].id).toBe("deepseek-v4.1-flash-free");
});
test("withdrawn case pick falls back to allowlist order", () => {
	const order = computeCaseModelOrder({
		caseModelId: "gone-model-free",
		allowed: ["minimax-m3.1-flash-free"],
		available: ["minimax-m3.1-flash-free", "gone-model-free"],
	});
	expect(order[0].id).toBe("minimax-m3.1-flash-free");
});
test("iceman never appears even if allowed list contains it", () => {
	const order = computeCaseModelOrder({ caseModelId: null, allowed: ["iceman-free", "minimax-m3.1-flash-free"], available: ["iceman-free", "minimax-m3.1-flash-free"] });
	expect(order.map((m) => m.id)).not.toContain("iceman-free");
});
test("DEFAULT_MODEL_CHAIN backstops when allowlist is exhausted by the runtime", () => {
	const order = computeCaseModelOrder({ caseModelId: null, allowed: [], available: ["deepseek-v4.1-flash-free"] });
	expect(order.map((m) => m.id)).toContain("deepseek-v4.1-flash-free");
});
