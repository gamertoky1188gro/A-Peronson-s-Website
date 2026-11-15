import { jest } from "@jest/globals";

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		user: { findUnique: jest.fn(async () => null) },
		appState: { findUnique: jest.fn(async () => null) },
		assistantKnowledge: { findMany: jest.fn(async () => []) },
		adminBranding: { findUnique: jest.fn(async () => null) },
		adminConfigHistory: { create: jest.fn(async () => ({})) },
	},
}));

const { buildMatchedResponse } = await import("../../server/services/assistantService.js");

describe("buildMatchedResponse opencode metadata", () => {
	test("adds model and fallback_attempts when an opencode outcome is provided", () => {
		const res = buildMatchedResponse({
			matchedAnswer: "hi",
			source: "dynamic_ai:local_llm",
			score: 2,
			opencodeMeta: {
				model: "glm-5.3-flash-free",
				attempts: [{ model: "minimax-m3.1-flash-free", outcome: "refused" }],
			},
		});
		expect(res.metadata.model).toBe("glm-5.3-flash-free");
		expect(res.metadata.fallback_attempts).toHaveLength(1);
	});

	test("omits model when no opencode outcome is provided", () => {
		const res = buildMatchedResponse({ matchedAnswer: "hi", source: "faq", score: 1 });
		expect(res.metadata.model).toBeUndefined();
	});
});
