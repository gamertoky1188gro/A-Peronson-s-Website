import { jest } from "@jest/globals";

const ORIGINAL_ENV = process.env.INVESTIGATION_AGENT_TIMEOUT_MS;

async function loadQueue() {
	// The queue module reads the timeout at call time, so it is imported once
	// and the env var is varied around it.
	return await import("../../server/services/investigationQueue.js");
}

describe("the investigation's per-agent timeout", () => {
	afterEach(() => {
		if (ORIGINAL_ENV === undefined) delete process.env.INVESTIGATION_AGENT_TIMEOUT_MS;
		else process.env.INVESTIGATION_AGENT_TIMEOUT_MS = ORIGINAL_ENV;
	});

	test("defaults to ten minutes, because a codebase investigation is not a one-shot question", async () => {
		delete process.env.INVESTIGATION_AGENT_TIMEOUT_MS;
		const { agentTimeoutMs } = await loadQueue();
		expect(agentTimeoutMs()).toBe(600_000);
	});

	test("honours INVESTIGATION_AGENT_TIMEOUT_MS", async () => {
		process.env.INVESTIGATION_AGENT_TIMEOUT_MS = "900000";
		const { agentTimeoutMs } = await loadQueue();
		expect(agentTimeoutMs()).toBe(900_000);
	});

	test("floors at 60s so a typo cannot turn a case into a one-minute no-op", async () => {
		process.env.INVESTIGATION_AGENT_TIMEOUT_MS = "5";
		const { agentTimeoutMs } = await loadQueue();
		expect(agentTimeoutMs()).toBe(60_000);
	});

	test("ignores a value that is not a number", async () => {
		process.env.INVESTIGATION_AGENT_TIMEOUT_MS = "soon";
		const { agentTimeoutMs } = await loadQueue();
		expect(agentTimeoutMs()).toBe(600_000);
	});
});
