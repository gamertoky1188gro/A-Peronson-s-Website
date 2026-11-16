import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// The assistant's opencode server used to be spawned with no isolation at
// all: no `OPENCODE_CONFIG_CONTENT`, no isolated `OPENCODE_CONFIG_DIR`, and
// no `OPENCODE_CONFIG_PROJECT_DISABLE`. It therefore inherited the
// operator's global opencode config - MCP servers and all - and its sessions
// carried no permission restriction.
//
// And `POST /api/assistant/ask-public` had no `requireAuth`, so an
// unauthenticated caller reached `createUserOpencodeSession(null)`: a guest
// session, created per call, owned by nobody, on a write-capable agent.
//
// The two rules under test are narrow and absolute:
//   1. the assistant's server is spawned with the isolation keys, and
//   2. the "public" assistant route refuses an unauthenticated caller.

const userFindUnique = jest.fn(async () => null);

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		user: { findUnique: userFindUnique },
		appState: { findUnique: jest.fn(async () => null) },
		assistantKnowledge: { findMany: jest.fn(async () => []) },
	},
}));

const { buildAssistantRuntimeEnv } = await import(
	"../../server/services/investigation/opencodeRuntime.js"
);
const assistantRoutes = (await import("../../server/routes/assistantRoutes.js")).default;
const { trimHistory } = await import("../../server/services/assistantService.js");

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/assistant", assistantRoutes);
	return app;
}

describe("the assistant's opencode spawn env", () => {
	test("the spawn env carries only the password and the log level", () => {
		const env = buildAssistantRuntimeEnv({ password: "a-password" });
		expect(env.OPENCODE_SERVER_PASSWORD).toBe("a-password");
		expect(env.OPENCODE_CONFIG_CONTENT).toBeUndefined();
		expect(env.OPENCODE_CONFIG_DIR).toBeUndefined();
		expect(env.OPENCODE_CONFIG_PROJECT_DISABLE).toBeUndefined();
	});

	test("the MCP credentials pass through only when set", () => {
		const without = buildAssistantRuntimeEnv({ password: "p", baseEnv: {} });
		expect(without.GITHUB_PERSONAL_ACCESS_TOKEN).toBeUndefined();
		expect(without.RENDER_API_KEY).toBeUndefined();
		expect(without.CONTEXT7_API_KEY).toBeUndefined();

		const withKeys = buildAssistantRuntimeEnv({
			password: "p",
			baseEnv: {
				GITHUB_PERSONAL_ACCESS_TOKEN: "gh-key",
				RENDER_API_KEY: "rnd-key",
				CONTEXT7_API_KEY: "ctx-key",
			},
		});
		expect(withKeys.GITHUB_PERSONAL_ACCESS_TOKEN).toBe("gh-key");
		expect(withKeys.RENDER_API_KEY).toBe("rnd-key");
		expect(withKeys.CONTEXT7_API_KEY).toBe("ctx-key");
	});
});

describe("the assistant's conversation history", () => {
	const message = (n, size = 10) => ({
		role: n % 2 ? "user" : "assistant",
		text: `${n}:`.padEnd(size, "x"),
	});

	test("keeps the newest messages when there are too many", () => {
		const history = Array.from({ length: 30 }, (_, index) => message(index));

		const kept = trimHistory(history);

		expect(kept).toHaveLength(12);
		expect(kept[kept.length - 1].text).toBe(history[history.length - 1].text);
	});

	test("drops the oldest messages until the history fits the character budget", () => {
		const history = Array.from({ length: 10 }, (_, index) => message(index, 5_000));

		const kept = trimHistory(history);

		expect(kept.length).toBeLessThan(10);
		expect(kept[kept.length - 1].text).toBe(history[history.length - 1].text);
		expect(kept.reduce((sum, entry) => sum + entry.text.length, 0)).toBeLessThanOrEqual(12_000);
	});

	test("a single oversized message is cut down to its newest end", () => {
		const giant = { role: "user", text: `OLDEST-START${"y".repeat(30_000)}NEWEST-END` };

		const kept = trimHistory([giant]);

		expect(kept).toHaveLength(1);
		expect(kept[0].text.length).toBe(12_000);
		expect(kept[0].text.endsWith("NEWEST-END")).toBe(true);
	});

	test("an empty history stays empty", () => {
		expect(trimHistory([])).toEqual([]);
	});
});

describe("the assistant's public route", () => {
	test("an unauthenticated caller is refused", async () => {
		const res = await request(buildApp())
			.post("/api/assistant/ask-public")
			.send({ question: "how do I place an order?" });

		expect(res.status).toBe(401);
	});

	test("a caller with no token is refused", async () => {
		const res = await request(buildApp()).post("/api/assistant/ask-public").send({});

		expect(res.status).toBe(401);
	});
});
