import { jest } from "@jest/globals";

const sessionCreate = jest.fn(async () => ({ id: "ses-1" }));
const sessionRemove = jest.fn(async () => ({}));
const turnText = "What page were you on?";

jest.unstable_mockModule("../../server/services/assistantService.js", () => ({
	getRunningOpencodeClient: () => ({
		session: { create: sessionCreate, remove: sessionRemove },
		message: {
			list: async () => ({
				data: [
					{
						id: "a1",
						type: "assistant",
						time: { created: 1 },
						finish: "stop",
						content: [{ type: "text", text: turnText }],
					},
				],
			}),
		},
	}),
}));
const onTextCalls = [];
jest.unstable_mockModule("../../server/services/opencodeTurns.js", () => ({
	waitForAssistantTurn: jest.fn(async (opts) => {
		opts?.onText?.("What page", turnText);
		return {
			text: turnText,
			parts: [{ type: "text", text: turnText }],
		};
	}),
	formatToolError: (e) => String(e),
}));

const { makeClarificationProvider } = await import(
	"../../server/services/clarificationOpencodeProvider.js"
);

it("answers through the warm runtime and deletes the ephemeral session", async () => {
	const provider = makeClarificationProvider({
		modelId: "minimax-m3.1-flash-free",
		caseId: "case-1",
	});
	const reply = await provider("The page is blank after login", "system prompt");
	expect(reply).toBe(turnText);
	expect(sessionCreate).toHaveBeenCalledTimes(1);
	expect(sessionCreate.mock.calls[0][0].model.id).toBe("minimax-m3.1-flash-free");
	expect(sessionRemove).toHaveBeenCalledTimes(1);
});

it("passes the accumulated turn text through onChunk for the buyer's live typing indicator", async () => {
	const chunks = [];
	const provider = makeClarificationProvider({
		modelId: "minimax-m3.1-flash-free",
		caseId: "case-stream",
		onChunk: (full) => chunks.push(full),
	});
	await provider("The page is blank after login", "system prompt");
	expect(chunks.length).toBeGreaterThan(0);
	expect(chunks[chunks.length - 1]).toBe(turnText);
});
