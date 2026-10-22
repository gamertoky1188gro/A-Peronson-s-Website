import { jest } from "@jest/globals";

import { resolveRequestTimeoutMs } from "../../server/middleware/requestLogger.js";

// The assistant route now reaches the model, and a model turn can take longer
// than the default request budget. The route must therefore be allowed a
// longer one - while an ordinary route keeps the ordinary timeout.

describe("the per-request timeout", () => {
	const ENV_KEY = "AI_REQUEST_TIMEOUT_MS";

	afterEach(() => {
		delete process.env[ENV_KEY];
	});

	test("an ordinary route keeps the default budget", () => {
		expect(resolveRequestTimeoutMs("/api/users/me", 45_000)).toBe(45_000);
	});

	test("the assistant ask route gets the AI budget", () => {
		expect(resolveRequestTimeoutMs("/api/assistant/ask", 45_000)).toBe(180_000);
	});

	test("the other assistant routes get it too", () => {
		expect(resolveRequestTimeoutMs("/api/assistant/ask-public?x=1", 1_000)).toBe(180_000);
	});

	test("the ai routes get it too", () => {
		expect(resolveRequestTimeoutMs("/api/ai/something", 45_000)).toBe(180_000);
	});

	test("a route that merely starts with the same letters is not an AI route", () => {
		expect(resolveRequestTimeoutMs("/api/assistance", 45_000)).toBe(45_000);
	});

	test("the AI budget is configurable", () => {
		process.env[ENV_KEY] = "240000";
		expect(resolveRequestTimeoutMs("/api/assistant/ask", 45_000)).toBe(240_000);
	});

	test("an AI route never gets less than the default budget", () => {
		process.env[ENV_KEY] = "1000";
		expect(resolveRequestTimeoutMs("/api/assistant/ask", 45_000)).toBe(45_000);
	});

	test("an unusable AI budget falls back to the built-in one", () => {
		process.env[ENV_KEY] = "not-a-number";
		expect(resolveRequestTimeoutMs("/api/assistant/ask", 45_000)).toBe(180_000);
	});

	test("the AI budget does not extend an ordinary route", () => {
		process.env[ENV_KEY] = "240000";
		expect(resolveRequestTimeoutMs("/api/users/me", 45_000)).toBe(45_000);
	});
});
