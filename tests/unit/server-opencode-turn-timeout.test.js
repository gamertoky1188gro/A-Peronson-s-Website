import { waitForAssistantTurn } from "../../server/services/opencodeTurns.js";
import { runAgentPrompt } from "../../server/services/investigation/opencodeRuntime.js";

/**
 * A fake v2 client whose assistant never finishes: after the prompt it keeps
 * making tool calls and never emits a text part, so the turn can only end on
 * the deadline.
 *
 * This is the shape of the real failure found by the first live end-to-end
 * run: the agent made 17 COMPLETED read-only tool calls and was still working
 * when it was cut off. The old code returned the partial turn with no error,
 * so the caller reported "the agent did not answer with JSON (empty_text)" -
 * which points at a parsing bug instead of at the clock.
 *
 * The message list is EMPTY before the prompt and carries the tool-calling
 * assistant message only afterwards, because the reader seeds its "already
 * seen" set from the list it fetches before prompting.
 */
function makeNeverFinishingClient() {
	let prompted = false;
	const toolMessage = {
		id: "a1",
		type: "assistant",
		agent: "investigator",
		finish: "tool-calls",
		content: [
			{
				type: "tool",
				tool: "grep",
				state: { status: "completed" },
			},
			{
				type: "tool",
				tool: "read",
				state: { status: "completed" },
			},
		],
	};
	return {
		message: {
			list: async () => ({ data: prompted ? [toolMessage] : [] }),
		},
		session: {
			prompt: async () => {
				prompted = true;
				return { id: "u1" };
			},
		},
	};
}

/** A fake v2 client whose assistant answers and finishes. */
function makeAnsweringClient(text) {
	let prompted = false;
	const answer = {
		id: "a1",
		type: "assistant",
		agent: "investigator",
		finish: "stop",
		content: [{ type: "text", text }],
	};
	return {
		message: {
			list: async () => ({ data: prompted ? [answer] : [] }),
		},
		session: {
			prompt: async () => {
				prompted = true;
				return { id: "u1" };
			},
		},
	};
}

describe("an agent turn that runs out of time", () => {
	test("waitForAssistantTurn says it timed out instead of returning a silent empty turn", async () => {
		const turn = await waitForAssistantTurn({
			client: makeNeverFinishingClient(),
			sessionID: "s1",
			text: "investigate",
			timeoutMs: 120,
			pollIntervalMs: 20,
			stablePollsToSettle: 1000,
		});

		expect(turn.timedOut).toBe(true);
		expect(turn.timeoutMs).toBe(120);
		// The work it DID do is kept - it is the evidence that it was still busy.
		expect(turn.content.filter((part) => part.type === "tool")).toHaveLength(2);
	});

	test("a turn that settles normally is NOT reported as a timeout", async () => {
		const turn = await waitForAssistantTurn({
			client: makeAnsweringClient("ANSWER"),
			sessionID: "s1",
			text: "investigate",
			timeoutMs: 5_000,
			pollIntervalMs: 20,
		});

		expect(turn.timedOut).toBe(false);
		expect(turn.text).toBe("ANSWER");
	});

	test("runAgentPrompt reports a TIMEOUT, not an agent that said nothing", async () => {
		const result = await runAgentPrompt({
			client: makeNeverFinishingClient(),
			sessionID: "s1",
			text: "investigate",
			timeoutMs: 120,
		});

		expect(result.error).toBeTruthy();
		expect(result.error).toMatch(/did not finish within/i);
		// The old message sent the operator hunting for a JSON-parsing bug.
		expect(result.error).not.toMatch(/did not answer with JSON/i);
		// The tool calls it made are kept, so the operator can see it was working.
		expect(result.toolCalls).toHaveLength(2);
	});

	test("runAgentPrompt reports no error when the agent answered", async () => {
		const result = await runAgentPrompt({
			client: makeAnsweringClient("ANSWER"),
			sessionID: "s1",
			text: "investigate",
			timeoutMs: 5_000,
		});

		expect(result.error).toBeUndefined();
		expect(result.text).toBe("ANSWER");
	});
});
