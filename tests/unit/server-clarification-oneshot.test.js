// One-shot classification (follow-up separation) takes a cheap session.generate
// decision instead of a streamed turn poll. It must still delete the ephemeral
// session and fall back to the full turn when the runtime lacks generate.

import { jest } from "@jest/globals";

const sessionCreate = jest.fn(async () => ({ id: "ses-1" }));
const sessionRemove = jest.fn(async () => ({}));
const sessionGenerate = jest.fn(async () => ({ text: '  {"sameProblem": false}  ' }));
const waitForAssistantTurn = jest.fn(async () => ({ text: "full-turn-answer" }));

jest.unstable_mockModule("../../server/services/assistantService.js", () => ({
	getRunningOpencodeClient: () => ({
		session: {
			create: sessionCreate,
			remove: sessionRemove,
			generate: sessionGenerate,
		},
	}),
}));
jest.unstable_mockModule("../../server/services/opencodeTurns.js", () => ({
	waitForAssistantTurn,
	formatToolError: (e) => String(e),
}));

const { makeClarificationProvider } = await import(
	"../../server/services/clarificationOpencodeProvider.js"
);

beforeEach(() => {
	sessionCreate.mockClear();
	sessionRemove.mockClear();
	sessionGenerate.mockClear();
	waitForAssistantTurn.mockClear();
});

describe("one-shot clarification", () => {
	it("calls session.generate and skips the turn poll", async () => {
		const provider = makeClarificationProvider({
			modelId: "minimax-m3.1-flash-free",
			caseId: "case-1",
			oneShot: true,
		});
		const reply = await provider("classify me", "system");
		expect(reply).toBe('{"sameProblem": false}');
		expect(sessionGenerate).toHaveBeenCalledTimes(1);
		expect(waitForAssistantTurn).not.toHaveBeenCalled();
		expect(sessionRemove).toHaveBeenCalledTimes(1);
	});

	it("keeps the turn poll for the buyer's live chat (oneShot off)", async () => {
		const provider = makeClarificationProvider({
			modelId: "minimax-m3.1-flash-free",
			caseId: "case-2",
		});
		const reply = await provider("live chat", "system");
		expect(reply).toBe("full-turn-answer");
		expect(waitForAssistantTurn).toHaveBeenCalledTimes(1);
		expect(sessionGenerate).not.toHaveBeenCalled();
	});
});
