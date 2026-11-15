import { jest } from "@jest/globals";

const sessionCreate = jest.fn(async () => ({ id: "ses-1" }));
const sessionRemove = jest.fn(async () => ({}));
const turnText = "What page were you on?";

jest.unstable_mockModule("../../server/services/assistantService.js", () => ({
	getRunningOpencodeClient: () => ({
		session: { create: sessionCreate, remove: sessionRemove },
		message: { list: async () => ({ data: [
			{ id: "a1", type: "assistant", time: { created: 1 }, finish: "stop", content: [{ type: "text", text: turnText }] },
		] }) },

	}),
}));
jest.unstable_mockModule("../../server/services/opencodeTurns.js", () => ({
	waitForAssistantTurn: jest.fn(async () => ({
		text: turnText,
		parts: [{ type: "text", text: turnText }],
	})),
	formatToolError: (e) => String(e),
}));

const { makeClarificationProvider } = await import("../../server/services/clarificationOpencodeProvider.js");

test("answers through the warm runtime and deletes the ephemeral session", async () => {
	const provider = makeClarificationProvider({ modelId: "minimax-m3.1-flash-free", caseId: "case-1" });
	const reply = await provider("The page is blank after login", "system prompt");
	expect(reply).toBe(turnText);
	expect(sessionCreate).toHaveBeenCalledTimes(1);
	expect(sessionCreate.mock.calls[0][0].model.id).toBe("minimax-m3.1-flash-free");
	expect(sessionRemove).toHaveBeenCalledTimes(1);
});
