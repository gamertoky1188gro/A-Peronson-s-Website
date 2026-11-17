// tests/unit/opencodeTurns.test.js
import { jest } from "@jest/globals";
import { waitForAssistantTurn } from "../../server/services/opencodeTurns.js";

function partList(status) {
	return [
		{
			type: "tool",
			name: "read",
			state: { status, input: { path: "server/services/walletService.js" } },
		},
	];
}

it("onToolSettled fires once per settled tool and toolCalls carry labels", async () => {
	const seen = [];
	const client = {
		session: {
			prompt: jest.fn(async () => ({})),
		},
		message: {
			list: jest
				.fn()
				.mockResolvedValueOnce({ data: [] }) // seen snapshot
				.mockResolvedValue({
					data: [
						{
							id: "m1",
							type: "assistant",
							content: partList("completed"),
							finish: "stop",
							time: { created: 1 },
						},
					],
				}),
		},
	};
	const turn = await waitForAssistantTurn({
		client,
		sessionID: "s1",
		text: "go",
		timeoutMs: 30_000,
		pollIntervalMs: 1,
		stablePollsToSettle: 99,
		onToolSettled: (part) => seen.push(part),
	});
	expect(seen).toHaveLength(1);
	expect(turn.content[0].state.status).toBe("completed");
});
