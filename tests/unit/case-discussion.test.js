/**
 * The interactive support discussion (server/services/caseDiscussionService.js).
 *
 * The provider and the model config are mocked: this suite is about the
 * loop's state machine — ask a question, read a file, propose a summary,
 * confirm, deny — not about the model.
 */

import fs from "node:fs";
import path from "node:path";
import { jest } from "@jest/globals";

const providerMock = jest.fn();
const makeProviderSpy = jest.fn((/* opts */) => providerMock);

jest.unstable_mockModule("../../server/services/clarificationOpencodeProvider.js", () => ({
	makeClarificationProvider: makeProviderSpy,
}));

jest.unstable_mockModule(
	"../../server/services/investigation/investigationModelConfigService.js",
	() => ({
		getInvestigationModelConfig: async () => ({ allowed: ["m1"], default: "m1" }),
	}),
);

// Capture the live activity events the discussion emits so the buyer sees
// every action as it happens (thinking, reading a file), not just a count.
const activityEvents = [];
jest.unstable_mockModule("../../server/realtime/realtimeBus.js", () => ({
	CASE_EVENTS: {
		message: "support.case.message",
		status: "support.case.status",
		activity: "support.case.activity",
	},
	emitCaseEvent: (caseId, type, payload) => {
		activityEvents.push({ caseId, type, payload });
	},
}));

const {
	discuss,
	confirmDiscussionSummary,
	denyDiscussionSummary,
	updateProblemBrief,
	getDiscussionState,
	clearDiscussion,
} = await import("../../server/services/caseDiscussionService.js");

const CASE_ID = "case-discuss-1";
const TMP_FILE = path.join(process.cwd(), "__discussion_test_fixture.txt");

function tmpFileWith(content) {
	fs.writeFileSync(TMP_FILE, content, "utf8");
}

beforeEach(async () => {
	providerMock.mockReset();
	makeProviderSpy.mockClear();
	activityEvents.length = 0;
	await clearDiscussion(CASE_ID);
	if (fs.existsSync(TMP_FILE)) {
		fs.unlinkSync(TMP_FILE);
	}
});

afterAll(() => {
	if (fs.existsSync(TMP_FILE)) {
		fs.unlinkSync(TMP_FILE);
	}
});

describe("caseDiscussionService", () => {
	it("asks a question and returns the question state", async () => {
		providerMock.mockResolvedValueOnce("Which page were you on when this happened?");
		const result = await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "Checkout broken" },
			history: [{ role: "client", content: "Checkout is broken" }],
			clientMessage: "Checkout is broken",
		});
		expect(result.state).toBe("question");
		expect(result.reply).toContain("Which page");
	});

	it("persists activity so the tree survives a reload", async () => {
		tmpFileWith("export const x = 1;");
		providerMock.mockResolvedValueOnce("Let me check.\nREAD: __discussion_test_fixture.txt");
		await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "x" },
			history: [],
			clientMessage: "help",
		});
		const state = await getDiscussionState(CASE_ID);
		expect(Array.isArray(state.activity)).toBe(true);
		expect(state.activity.some((row) => /thinking/iu.test(row.label))).toBe(true);
		expect(
			state.activity.some((row) => /Reading __discussion_test_fixture\.txt/iu.test(row.label)),
		).toBe(true);
	});

	it("persists the last usage ping so the context meter survives a reload", async () => {
		// The service passes onUsage into the provider factory; the real
		// provider fires it during the turn, before the state write. Mimic that
		// by calling onUsage from inside the mocked turn.
		providerMock.mockImplementationOnce(async () => {
			const factoryArgs = makeProviderSpy.mock.calls.at(-1)?.[0];
			factoryArgs?.onUsage?.({
				used: 123_456,
				output: 789,
				reasoning: 12,
				cacheRead: 3,
				cacheWrite: 4,
			});
			return "A question?";
		});
		await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "x" },
			history: [],
			clientMessage: "help",
		});
		const state = await getDiscussionState(CASE_ID);
		expect(state.lastUsage).toMatchObject({ used: 123_456, output: 789, reasoning: 12 });
	});

	it("emits live activity for thinking and each file it reads", async () => {
		tmpFileWith("export function checkout() { return 42; }");
		providerMock
			.mockResolvedValueOnce("Let me look at the code.\nREAD: __discussion_test_fixture.txt")
			.mockResolvedValueOnce("SUMMARY: The checkout handler returns a constant.");

		await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "Checkout broken" },
			history: [],
			clientMessage: "Checkout is broken",
		});

		const kinds = activityEvents
			.filter((e) => e.type === "support.case.activity")
			.map((e) => e.payload.label);
		expect(kinds.some((label) => /thinking/iu.test(label))).toBe(true);
		expect(kinds.some((label) => /Reading __discussion_test_fixture\.txt/iu.test(label))).toBe(
			true,
		);
	});

	it("reads a requested file, feeds it back, then proposes a summary", async () => {
		tmpFileWith("export function checkout() { return 42; }");
		providerMock
			.mockResolvedValueOnce("Let me look at the code.\nREAD: __discussion_test_fixture.txt")
			.mockResolvedValueOnce(
				"SUMMARY: The checkout handler returns a constant instead of the cart total.",
			);

		const result = await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "Checkout broken" },
			history: [{ role: "client", content: "Checkout is broken" }],
			clientMessage: "Checkout is broken",
		});

		expect(result.state).toBe("summary_proposed");
		expect(result.summary).toContain("checkout handler");
		expect(result.reads).toContain("__discussion_test_fixture.txt");
		// The second provider call must have carried the file content.
		const secondPrompt = providerMock.mock.calls[1][0];
		expect(secondPrompt).toContain("checkout() { return 42; }");
	});

	it("refuses to read a file outside the repository or a secret file", async () => {
		providerMock
			.mockResolvedValueOnce("READ: ../../etc/passwd")
			.mockResolvedValueOnce("READ: .env")
			.mockResolvedValueOnce("SUMMARY: cannot determine the problem from the repository");

		const result = await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "x" },
			history: [],
			clientMessage: "help",
		});

		expect(result.state).toBe("summary_proposed");
		expect(result.reads).toEqual([]);
	});

	it("degrades to a fixed question when no provider answers", async () => {
		providerMock.mockResolvedValue(null);
		const result = await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "x" },
			history: [],
			clientMessage: "help",
		});
		expect(result.state).toBe("question");
		expect(result.reply.length).toBeGreaterThan(0);
	});

	it("confirm returns the stored summary; deny clears it", async () => {
		providerMock.mockResolvedValueOnce("SUMMARY: The login token is never refreshed.");
		await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "Login loop" },
			history: [],
			clientMessage: "I am stuck in a login loop",
		});

		const state = await getDiscussionState(CASE_ID);
		expect(state.proposedSummary).toContain("login token");

		const confirmed = await confirmDiscussionSummary({ caseId: CASE_ID });
		expect(confirmed.ok).toBe(true);
		expect(confirmed.summary).toContain("login token");

		const denied = await denyDiscussionSummary({ caseId: CASE_ID });
		expect(denied.ok).toBe(true);
		const after = await getDiscussionState(CASE_ID);
		expect(after.proposedSummary).toBeNull();
	});

	it("seeds an editable problem brief from the proposed summary", async () => {
		providerMock.mockResolvedValueOnce("SUMMARY: The upload rejects a supported file.");
		await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "Upload broken" },
			history: [],
			clientMessage: "My upload fails",
		});
		const state = await getDiscussionState(CASE_ID);
		expect(state.problemBrief).toContain("upload");
		expect(state.briefStatus).toBe("draft");
	});

	it("lets the buyer edit the brief and confirms the edited text", async () => {
		providerMock.mockResolvedValueOnce("SUMMARY: The upload rejects a supported file.");
		await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "Upload broken" },
			history: [],
			clientMessage: "My upload fails",
		});

		const edited = "The PDF upload fails for files over 5MB.";
		const updated = await updateProblemBrief({ caseId: CASE_ID, brief: edited });
		expect(updated.ok).toBe(true);
		expect((await getDiscussionState(CASE_ID)).problemBrief).toBe(edited);

		const confirmed = await confirmDiscussionSummary({ caseId: CASE_ID, brief: edited });
		expect(confirmed.ok).toBe(true);
		expect(confirmed.summary).toBe(edited);
		const after = await getDiscussionState(CASE_ID);
		expect(after.briefStatus).toBe("confirmed");
	});

	it("records thinking with a running→done lifecycle", async () => {
		providerMock.mockResolvedValueOnce("A question?");
		await discuss({
			caseId: CASE_ID,
			caseRow: { subject: "x" },
			history: [],
			clientMessage: "help",
		});
		const thinking = activityEvents.filter(
			(e) => e.type === "support.case.activity" && /thinking/iu.test(e.payload.label || ""),
		);
		// The same activity id flips from running to done.
		expect(thinking.length).toBeGreaterThanOrEqual(2);
		expect(thinking[0].payload.status).toBe("running");
		expect(thinking.at(-1).payload.status).toBe("done");
		expect(thinking[0].payload.id).toBe(thinking.at(-1).payload.id);
	});

	it("caps the discussion at the round limit and forces a summary", async () => {
		providerMock.mockResolvedValue("Tell me more.");
		let last;
		for (let i = 0; i < 12; i += 1) {
			last = await discuss({
				caseId: CASE_ID,
				caseRow: { subject: "x" },
				history: [],
				clientMessage: `message ${i}`,
			});
		}
		expect(last.state).toBe("summary_proposed");
	});
});
