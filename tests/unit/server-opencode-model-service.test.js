import { jest } from "@jest/globals";

const upsertBranding = jest.fn(async () => ({}));
const findBranding = jest.fn(async () => null);
const createHistory = jest.fn(async () => ({}));

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		adminBranding: { findUnique: findBranding, upsert: upsertBranding },
		adminConfigHistory: { create: createHistory },
	},
}));

const svc = await import("../../server/services/opencodeModelService.js");

function assistantMsg(id, created, text, finish = "stop", error = null) {
	return {
		id,
		type: "assistant",
		time: { created },
		finish,
		content: [{ type: "text", text }],
		...(error ? { error } : {}),
	};
}

function makeClient({ listResponse, refusalFirst = false } = {}) {
	// Messages already in the session before the prompt (newest first),
	// and the message the prompt will produce.
	let fresh = [];
	const session = {
		create: jest.fn(async () => ({ id: `ephemeral-${Date.now()}` })),
		remove: jest.fn(async () => ({})),
		prompt: jest.fn(async () => {
			fresh = refusalFirst
				? [
						{
							id: "refused-1",
							type: "assistant",
							time: { created: 9999 },
							finish: "error",
							content: [],
							error: { type: "provider.quota", message: "Rate limit exceeded", status: 429 },
						},
					]
				: [assistantMsg("ok-1", 9999, "ANSWER FROM FALLBACK")];
			return { id: "u" };
		}),
	};
	const message = {
		list: jest.fn(async () => ({ data: [...fresh, ...(listResponse ?? [])] })),
	};
	return { session, message };
}

beforeEach(() => {
	upsertBranding.mockClear();
	findBranding.mockResolvedValue(null);
	createHistory.mockClear();
	svc.clearLastOpencodeOutcome();
	delete process.env.OPENCODE_MODEL_ID;
});

describe("fetchAvailableModels", () => {
	it("keeps only free-tier opencode models", async () => {
		const client = {
			model: {
				list: async () => ({
					data: [
						{ modelID: "minimax-m3.1-flash-free", providerID: "opencode" },
						{ modelID: "gpt-5-paid", providerID: "opencode" },
						{ modelID: "minimax-m3.1-flash-free", providerID: "openai" },
					],
				}),
			},
		};
		const models = await svc.fetchAvailableModels(client, { fresh: true });
		expect(models).toEqual([{ id: "minimax-m3.1-flash-free", providerID: "opencode" }]);
	});
});

describe("getActiveModel", () => {
	it("admin row wins when it is a free model", async () => {
		findBranding.mockResolvedValue({
			brand_key: "ai.opencode.model_id",
			value: "glm-5.3-flash-free",
			active: true,
		});
		const active = await svc.getActiveModel();
		expect(active).toEqual({ id: "glm-5.3-flash-free", providerID: "opencode", source: "admin" });
	});

	it("non-free admin row is ignored", async () => {
		findBranding.mockResolvedValue({
			brand_key: "ai.opencode.model_id",
			value: "gpt-5-paid",
			active: true,
		});
		const active = await svc.getActiveModel();
		expect(active).toEqual({
			id: "minimax-m3.1-flash-free",
			providerID: "opencode",
			source: "default",
		});
	});
});

describe("setActiveModel", () => {
	it("refuses a non-free model id", async () => {
		await expect(svc.setActiveModel("gpt-5-paid", "admin-1", null)).rejects.toMatchObject({
			status: 400,
		});
		expect(upsertBranding).not.toHaveBeenCalled();
	});

	it("persists branding + config history and returns admin source", async () => {
		const client = {
			model: { list: async () => ({ data: [{ modelID: "beam-free", providerID: "opencode" }] }) },
		};
		const result = await svc.setActiveModel("beam-free", "admin-1", client);
		expect(result).toEqual({ id: "beam-free", providerID: "opencode", source: "admin" });
		expect(upsertBranding).toHaveBeenCalledTimes(1);
		expect(createHistory).toHaveBeenCalledTimes(1);
	});

	it("rolls back branding when the history write fails", async () => {
		findBranding.mockResolvedValueOnce({
			brand_key: "ai.opencode.model_id",
			value: "minimax-m3.1-flash-free",
			active: true,
		}); // previous value read for rollback
		const client = {
			model: { list: async () => ({ data: [{ modelID: "beam-free", providerID: "opencode" }] }) },
		};
		createHistory.mockRejectedValueOnce(new Error("db down"));
		await expect(svc.setActiveModel("beam-free", "admin-1", client)).rejects.toMatchObject({
			status: 500,
		});
		// 1st upsert = the switch, 2nd upsert = the rollback to the previous value
		expect(upsertBranding).toHaveBeenCalledTimes(2);
	});
});

describe("runAssistantPrompt", () => {
	it("returns the active model's answer with attempts recorded", async () => {
		process.env.OPENCODE_MODEL_ID = "minimax-m3.1-flash-free";
		const client = makeClient();
		const result = await svc.runAssistantPrompt({
			client,
			sessionID: "user-session-1",
			text: "hello",
			timeoutMs: 5000,
		});
		expect(result?.model).toBe("minimax-m3.1-flash-free");
		expect(result?.attempts.map((a) => a.outcome)).toEqual(["ok"]);
		expect(result?.text).toBe("ANSWER FROM FALLBACK");
	});

	it("a refusal on the active model falls back to the next free model", async () => {
		process.env.OPENCODE_MODEL_ID = "minimax-m3.1-flash-free";
		const prompted = new Set();
		const refusedMsg = {
			id: "refused-1",
			type: "assistant",
			time: { created: 1 },
			finish: "error",
			content: [],
			error: { type: "provider.quota", message: "quota", status: 429 },
		};
		const client = {
			session: {
				create: jest.fn(async () => ({ id: "ephemeral-1" })),
				remove: jest.fn(async () => ({})),
				prompt: jest.fn(async ({ sessionID }) => {
					prompted.add(sessionID);
					return {};
				}),
			},
			message: {
				list: jest.fn(async ({ sessionID }) => {
					if (!prompted.has(sessionID)) return { data: [] };
					if (sessionID === "user-session-1") return { data: [refusedMsg] };
					return { data: [assistantMsg("ok-1", 2, "ANSWER FROM FALLBACK")] };
				}),
			},
		};
		const result = await svc.runAssistantPrompt({
			client,
			sessionID: "user-session-1",
			text: "hello",
			timeoutMs: 5000,
		});
		expect(result?.model).toBe("deepseek-v4.1-flash-free"); // first entry of DEFAULT_MODEL_CHAIN
		expect(result?.attempts.map((a) => a.outcome)).toEqual(["refused", "ok"]);
	});

	it("a fallback session that cannot be created is refused and the chain advances", async () => {
		process.env.OPENCODE_MODEL_ID = "minimax-m3.1-flash-free";
		const prompted = new Set();
		const refusedMsg = {
			id: "refused-1",
			type: "assistant",
			time: { created: 1 },
			finish: "error",
			content: [],
			error: { type: "provider.quota", message: "quota", status: 429 },
		};
		const create = jest
			.fn()
			.mockRejectedValueOnce(new Error("session create failed"))
			.mockImplementation(async () => ({ id: "ephemeral-2" }));
		const client = {
			session: {
				create,
				remove: jest.fn(async () => ({})),
				prompt: jest.fn(async ({ sessionID }) => {
					prompted.add(sessionID);
					return {};
				}),
			},
			message: {
				list: jest.fn(async ({ sessionID }) => {
					if (!prompted.has(sessionID)) return { data: [] };
					if (sessionID === "user-session-1") return { data: [refusedMsg] };
					return { data: [assistantMsg("ok-1", 2, "ANSWER FROM FALLBACK")] };
				}),
			},
		};
		const result = await svc.runAssistantPrompt({
			client,
			sessionID: "user-session-1",
			text: "hello",
			timeoutMs: 5000,
		});
		// First fallback candidate's session.create threw; the next one answered.
		expect(result?.model).toBe("mimo-v2.6-flash-free");
		expect(result?.attempts.map((a) => a.outcome)).toEqual(["refused", "refused", "ok"]);
	});

	it("a timeout is NOT retried and the fallback chain does not advance", async () => {
		process.env.OPENCODE_MODEL_ID = "minimax-m3.1-flash-free";
		const createSpy = jest.fn(async () => ({ id: "ephemeral-1" }));
		const client = {
			session: {
				create: createSpy,
				remove: jest.fn(async () => ({})),
				prompt: jest.fn(async () => ({})),
			},
			message: {
				// No assistant message ever appears; the deadline (1 ms) expires first.
				list: jest.fn(async () => ({ data: [] })),
			},
		};
		const result = await svc.runAssistantPrompt({
			client,
			sessionID: "user-session-1",
			text: "hello",
			timeoutMs: 1,
		});
		expect(result).toBeNull();
		expect(createSpy).not.toHaveBeenCalled();
	});
});
