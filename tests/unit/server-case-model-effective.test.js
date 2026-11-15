import { effectiveCaseModelId } from "../../server/services/investigation/caseModelChain.js";

// The buyer's per-case pick is only usable when the admin toggle is on, the
// id is a plausible free-model id, and the id is on the allowlist. Anything
// else falls back to the platform default (null).

const ALLOWED = ["minimax-m3.1-flash-free", "glm-5.3-flash-free"];

test("toggle off returns null even for a valid pick", () => {
	expect(
		effectiveCaseModelId({
			caseModelId: "minimax-m3.1-flash-free",
			buyerSelectEnabled: false,
			allowed: ALLOWED,
		}),
	).toBeNull();
});

test("pick not on the allowlist returns null", () => {
	expect(
		effectiveCaseModelId({
			caseModelId: "mimo-v2.6-flash-free",
			buyerSelectEnabled: true,
			allowed: ALLOWED,
		}),
	).toBeNull();
});

test("iceman pick returns null even when it is on the allowlist", () => {
	expect(
		effectiveCaseModelId({
			caseModelId: "iceman-free",
			buyerSelectEnabled: true,
			allowed: ["iceman-free"],
		}),
	).toBeNull();
});

test("valid pick with the toggle on returns the id", () => {
	expect(
		effectiveCaseModelId({
			caseModelId: "glm-5.3-flash-free",
			buyerSelectEnabled: true,
			allowed: ALLOWED,
		}),
	).toBe("glm-5.3-flash-free");
});
