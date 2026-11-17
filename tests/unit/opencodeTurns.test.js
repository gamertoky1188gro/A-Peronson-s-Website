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

it("onUsage reports the newest assistant message's token counts every poll", async () => {
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
							tokens: {
								input: 421_000,
								output: 900,
								reasoning: 45,
								cache: { read: 400_000, write: 0 },
							},
						},
					],
				}),
		},
	};
	await waitForAssistantTurn({
		client,
		sessionID: "s1",
		text: "go",
		timeoutMs: 30_000,
		pollIntervalMs: 1,
		stablePollsToSettle: 99,
		onUsage: (usage) => seen.push(usage),
	});
	expect(seen.length).toBeGreaterThan(0);
	// Every ping carries the latest prompt size, never invented zeros.
	expect(seen[seen.length - 1]).toEqual({
		used: 421_000,
		output: 900,
		reasoning: 45,
		cacheRead: 400_000,
		cacheWrite: 0,
	});
});

it("used falls back to the cached prompt when the API reports only the non-cached delta", async () => {
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
							tokens: { input: 341, output: 51, reasoning: 57, cache: { read: 49_061, write: 0 } },
						},
					],
				}),
		},
	};
	await waitForAssistantTurn({
		client,
		sessionID: "s1",
		text: "go",
		timeoutMs: 30_000,
		pollIntervalMs: 1,
		stablePollsToSettle: 99,
		onUsage: (usage) => seen.push(usage),
	});
	expect(seen[seen.length - 1]).toEqual({
		used: 49_061,
		output: 51,
		reasoning: 57,
		cacheRead: 49_061,
		cacheWrite: 0,
	});
});
