import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// The intake path is offline and deterministic in a test.
//
// `AI_ENABLED=false` and `CASE_AI_PROVIDER=none` are set BEFORE anything is
// imported, because the provider configuration is read at call time by
// server/services/caseConversationService.js and at module load time by
// server/services/assistantService.js. Set later, they would arrive too late
// for the module-load read - and a test that reached a real provider would
// depend on the developer's machine, on the network, and on the machine's
// .env.
const ORIGINAL_AI_ENABLED = process.env.AI_ENABLED;
const ORIGINAL_CASE_AI_PROVIDER = process.env.CASE_AI_PROVIDER;
process.env.AI_ENABLED = "false";
process.env.CASE_AI_PROVIDER = "none";

// --- an in-memory Prisma ----------------------------------------------------
//
// The routes are exercised for real, so the persistence underneath them is
// exercised for real too: the sequence allocation in `appendCaseMessage`,
// the client-message counter that measures the clarification round cap, and
// the ownership check all run against this store rather than being stubbed
// out. A stubbed store would let a broken round cap pass.
const state = {
	users: [],
	cases: [],
	messages: [],
	attachments: [],
	investigations: [],
	documents: [],
};

function matches(row, where) {
	if (!where || typeof where !== "object") {
		return true;
	}
	return Object.entries(where).every(([key, value]) => {
		if (value && typeof value === "object" && !Array.isArray(value) && "in" in value) {
			return Array.isArray(value.in) && value.in.includes(row[key]);
		}
		return row[key] === value;
	});
}

function sortRows(rows, orderBy) {
	if (!orderBy || typeof orderBy !== "object") {
		return rows;
	}
	const entries = Object.entries(orderBy);
	if (entries.length === 0) {
		return rows;
	}
	const [field, direction] = entries[0];
	const factor = direction === "desc" ? -1 : 1;
	return [...rows].sort((left, right) => {
		const a = left[field];
		const b = right[field];
		if (a === b) {
			return 0;
		}
		if (a === null || a === undefined) {
			return 1;
		}
		if (b === null || b === undefined) {
			return -1;
		}
		return (a < b ? -1 : 1) * factor;
	});
}

function project(row, select) {
	if (!select) {
		return { ...row };
	}
	const out = {};
	for (const [key, wanted] of Object.entries(select)) {
		if (wanted) {
			out[key] = row[key];
		}
	}
	return out;
}

function collection(rows) {
	return {
		findMany({ where, orderBy } = {}) {
			return sortRows(
				rows.filter((row) => matches(row, where)),
				orderBy,
			).map((row) => ({
				...row,
			}));
		},
		findFirst({ where, orderBy, select } = {}) {
			const [found] = sortRows(
				rows.filter((row) => matches(row, where)),
				orderBy,
			);
			return found ? project(found, select) : null;
		},
		findUnique({ where, select } = {}) {
			const found = rows.find((row) => matches(row, where));
			return found ? project(found, select) : null;
		},
		create({ data } = {}) {
			const row = { ...data };
			rows.push(row);
			return { ...row };
		},
		update({ where, data } = {}) {
			const row = rows.find((candidate) => matches(candidate, where));
			if (!row) {
				throw new Error(`no row for ${JSON.stringify(where)}`);
			}
			Object.assign(row, data);
			return { ...row };
		},
		upsert({ where, create, update } = {}) {
			const row = rows.find((candidate) => matches(candidate, where));
			if (row) {
				Object.assign(row, update?.data ?? {});
				return { ...row };
			}
			const created = { ...(create?.data ?? {}) };
			rows.push(created);
			return { ...created };
		},
		delete({ where } = {}) {
			const index = rows.findIndex((candidate) => matches(candidate, where));
			if (index === -1) {
				throw new Error(`no row for ${JSON.stringify(where)}`);
			}
			const [removed] = rows.splice(index, 1);
			return { ...removed };
		},
		count({ where } = {}) {
			return rows.filter((row) => matches(row, where)).length;
		},
	};
}

const supportCase = collection(state.cases);
const supportCaseMessage = collection(state.messages);

// `getCaseWithMessages` asks for the case WITH its messages; that relation
// is the one the API's read route depends on.
supportCase.findUnique = ({ where, select, include } = {}) => {
	const row = state.cases.find((candidate) => matches(candidate, where));
	if (!row) {
		return null;
	}
	const out = project(row, select);
	if (include?.messages) {
		out.messages = sortRows(
			state.messages.filter((message) => message.case_id === row.id),
			include.messages.orderBy,
		).map((message) => ({ ...message }));
	}
	return out;
};

const prismaMock = {
	user: collection(state.users),
	document: collection(state.documents),
	supportCase,
	supportCaseMessage,
	supportCaseAttachment: collection(state.attachments),
	supportInvestigation: collection(state.investigations),
	$transaction: async (fn) => fn(prismaMock),
};

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({ default: prismaMock }));

// The investigation queue belongs to Workstream 2 and is NOT part of Workstream
// 1 - Workstream 1 is integrated (and gated) before Workstream 2 lands. The
// queue is therefore mocked only when it exists; the routes must not need it
// to be present to answer a message.
const QUEUE_MODULE_PATH = "../../server/services/investigationQueue.js";
const queueModuleExists = fs.existsSync(
	fileURLToPath(new URL("../../server/services/investigationQueue.js", import.meta.url)),
);
const enqueueInvestigation = jest.fn(async () => {});
if (queueModuleExists) {
	jest.unstable_mockModule(QUEUE_MODULE_PATH, () => ({
		enqueueInvestigation,
		queueDepth: () => 0,
	}));
}

const { signToken } = await import("../../server/middleware/auth.js");
const { realtimeBus, CASE_EVENTS, emitCaseEvent } = await import(
	"../../server/realtime/realtimeBus.js"
);
const {
	answerClarification,
	FALLBACK_CLARIFYING_QUESTION,
	READY_REPLY,
	resetClarificationProvider,
	setClarificationProvider,
} = await import("../../server/services/caseConversationService.js");
const caseRoutes = (await import("../../server/routes/caseRoutes.js")).default;

// --- fixtures ---------------------------------------------------------------
const OWNER = { id: "case-owner", role: "buyer", email: "owner@x.com" };
const STRANGER = { id: "case-stranger", role: "buyer", email: "stranger@x.com" };
const ADMIN = { id: "case-admin", role: "admin", email: "admin@x.com" };

const AUTH = {
	owner: { Authorization: `Bearer ${signToken(OWNER)}` },
	stranger: { Authorization: `Bearer ${signToken(STRANGER)}` },
	admin: { Authorization: `Bearer ${signToken(ADMIN)}` },
};

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/support/cases", caseRoutes);
	return app;
}

// contracts.md §3 fixes the RESPONSE BODIES of the six routes but not their
// success status codes, and the conventional status for "created" is 201
// while the rest of this repo's routes answer 200. Both are accepted, so the
// test pins the contract - the body and the ownership rule - and not a
// detail the contract leaves open.
function expectSuccess(res) {
	// biome-ignore lint/suspicious/noMisplacedAssertion: runs inside the caller
	expect([200, 201]).toContain(res.status);
}

async function createCase(subject = "Checkout fails") {
	const res = await request(buildApp())
		.post("/api/support/cases")
		.set(AUTH.owner)
		.send({ subject });
	// biome-ignore lint/suspicious/noMisplacedAssertion: the assertions run inside the test that called this helper
	expectSuccess(res);
	// biome-ignore lint/suspicious/noMisplacedAssertion: the assertions run inside the test that called this helper
	expect(res.body.case).toMatchObject({ user_id: OWNER.id });
	return res.body.case;
}

function postMessage(caseId, content, auth = AUTH.owner) {
	return request(buildApp())
		.post(`/api/support/cases/${caseId}/messages`)
		.set(auth)
		.send({ content });
}

beforeEach(() => {
	state.users.length = 0;
	state.users.push(
		{ ...OWNER, status: "active", password_reset_at: null },
		{ ...STRANGER, status: "active", password_reset_at: null },
		{ ...ADMIN, status: "active", password_reset_at: null },
	);
	state.cases.length = 0;
	state.messages.length = 0;
	state.attachments.length = 0;
	state.investigations.length = 0;
	state.documents.length = 0;
	enqueueInvestigation.mockClear();
});

afterAll(() => {
	if (ORIGINAL_AI_ENABLED === undefined) {
		delete process.env.AI_ENABLED;
	} else {
		process.env.AI_ENABLED = ORIGINAL_AI_ENABLED;
	}
	if (ORIGINAL_CASE_AI_PROVIDER === undefined) {
		delete process.env.CASE_AI_PROVIDER;
	} else {
		process.env.CASE_AI_PROVIDER = ORIGINAL_CASE_AI_PROVIDER;
	}
});

// --- the contract in contracts.md §3 ---------------------------------------
describe("support case API (real router, real controller)", () => {
	test("a second user gets 403 on the case and on its messages", async () => {
		const created = await createCase();

		const read = await request(buildApp())
			.get(`/api/support/cases/${created.id}`)
			.set(AUTH.stranger);
		expect(read.status).toBe(403);
		expect(typeof read.body.error).toBe("string");

		const write = await postMessage(created.id, "can you look at this?", AUTH.stranger);
		expect(write.status).toBe(403);
		expect(typeof write.body.error).toBe("string");

		// The refusal must not have written anything: the case is still the
		// owner's, and the transcript is untouched.
		const after = await request(buildApp())
			.get(`/api/support/cases/${created.id}`)
			.set(AUTH.owner)
			.expect(200);
		expect(after.body.messages).toHaveLength(0);
	});

	test("the owner can read the case and post to it", async () => {
		const created = await createCase();

		const read = await request(buildApp())
			.get(`/api/support/cases/${created.id}`)
			.set(AUTH.owner)
			.expect(200);
		expect(read.body.case).toMatchObject({ id: created.id, user_id: OWNER.id });
		expect(Array.isArray(read.body.messages)).toBe(true);

		const posted = await postMessage(created.id, "The total is wrong at checkout");
		expectSuccess(posted);
		expect(posted.body.message).toMatchObject({
			case_id: created.id,
			role: "client",
			content: "The total is wrong at checkout",
		});
		// contracts.md §3: `reply` is the assistant's SupportCaseMessage row,
		// not the text of the reply. The text is its `content`.
		expect(posted.body.reply).toMatchObject({
			case_id: created.id,
			role: "assistant",
		});
		expect(typeof posted.body.reply.content).toBe("string");
		expect(posted.body.reply.content.length).toBeGreaterThan(0);
		expect(posted.body.ready).toBe(false);
	});

	test("the owner sees only their own cases in the list", async () => {
		const mine = await createCase("Mine");

		const list = await request(buildApp()).get("/api/support/cases").set(AUTH.owner).expect(200);
		expect(Array.isArray(list.body.cases)).toBe(true);
		expect(list.body.cases.map((row) => row.id)).toEqual([mine.id]);

		const strangerList = await request(buildApp())
			.get("/api/support/cases")
			.set(AUTH.stranger)
			.expect(200);
		expect(strangerList.body.cases).toHaveLength(0);
	});

	test("ready is true after 6 client messages", async () => {
		const created = await createCase();

		for (let round = 1; round <= 5; round += 1) {
			const res = await postMessage(created.id, `Answer number ${round}`);
			expectSuccess(res);
			expect(res.body.ready).toBe(false);
		}

		const sixth = await postMessage(created.id, "Answer number 6");
		expectSuccess(sixth);
		expect(sixth.body.ready).toBe(true);
	});

	test("confirming the summary moves the case to investigating", async () => {
		const created = await createCase();

		const confirmed = await request(buildApp())
			.post(`/api/support/cases/${created.id}/confirm`)
			.set(AUTH.owner)
			.expect(200);
		expect(confirmed.body.case).toMatchObject({ id: created.id, status: "investigating" });
	});

	test("an owner/admin may read another client's case; a buyer may not", async () => {
		const created = await createCase();

		await request(buildApp()).get(`/api/support/cases/${created.id}`).set(AUTH.admin).expect(200);
		await request(buildApp())
			.get(`/api/support/cases/${created.id}`)
			.set(AUTH.stranger)
			.expect(403);
	});
});

// --- the contract in contracts.md §4 ---------------------------------------
describe("case events on the realtime bus", () => {
	test("a posted message produces a support.case.message event", async () => {
		const created = await createCase();
		const events = [];
		const listener = (payload) => events.push(payload);
		realtimeBus.on(CASE_EVENTS.message, listener);

		try {
			const posted = await postMessage(created.id, "The upload button does nothing");
			expectSuccess(posted);

			const mine = events.filter((event) => event.caseId === created.id);
			expect(mine.length).toBeGreaterThan(0);
			const clientEvent = mine.find((event) => event.message?.id === posted.body.message?.id);
			expect(clientEvent).toBeDefined();
			expect(clientEvent.message).toMatchObject({
				case_id: created.id,
				role: "client",
				content: "The upload button does nothing",
			});
		} finally {
			realtimeBus.off(CASE_EVENTS.message, listener);
		}
	});

	test("a case that starts being investigated fires a support.case.status event", async () => {
		const created = await createCase();
		const events = [];
		const listener = (payload) => events.push(payload);
		realtimeBus.on(CASE_EVENTS.status, listener);

		try {
			await request(buildApp())
				.post(`/api/support/cases/${created.id}/confirm`)
				.set(AUTH.owner)
				.expect(200);
			const mine = events.filter((event) => event.caseId === created.id);
			expect(mine.length).toBeGreaterThan(0);
			expect(mine.at(-1)).toMatchObject({ status: "investigating" });
			expect(typeof mine.at(-1).summary).toBe("string");
		} finally {
			realtimeBus.off(CASE_EVENTS.status, listener);
		}
	});

	test("emitCaseEvent publishes each of the five fixed event types", () => {
		const seen = [];
		const listeners = Object.entries(CASE_EVENTS).map(([key, type]) => {
			const listener = (payload) => seen.push({ key, type, payload });
			realtimeBus.on(type, listener);
			return { type, listener };
		});

		try {
			emitCaseEvent("case-1", CASE_EVENTS.message, { message: { id: "m1" } });
			emitCaseEvent("case-1", CASE_EVENTS.status, { status: "investigating" });
			emitCaseEvent("case-1", CASE_EVENTS.progress, { role: "code", status: "running" });
			emitCaseEvent("case-1", CASE_EVENTS.finding, { role: "code", finding: { detail: "x" } });
			emitCaseEvent("case-1", CASE_EVENTS.report, { report: "# report", reportStatus: "ready" });

			expect(seen.map((entry) => entry.key)).toEqual([
				"message",
				"status",
				"progress",
				"finding",
				"report",
			]);
			for (const entry of seen) {
				expect(entry.payload.caseId).toBe("case-1");
			}
			expect(seen[0].payload.message).toEqual({ id: "m1" });
			expect(seen[1].payload.status).toBe("investigating");
			expect(seen[2].payload).toMatchObject({ role: "code", status: "running" });
			expect(seen[3].payload.finding).toEqual({ detail: "x" });
			expect(seen[4].payload).toMatchObject({ report: "# report", reportStatus: "ready" });
		} finally {
			for (const { type, listener } of listeners) {
				realtimeBus.off(type, listener);
			}
		}
	});

	test("emitCaseEvent ignores a missing case or type", () => {
		const seen = [];
		const listener = (payload) => seen.push(payload);
		realtimeBus.on(CASE_EVENTS.message, listener);
		try {
			emitCaseEvent("", CASE_EVENTS.message, { message: { id: "m1" } });
			emitCaseEvent("case-1", "", { message: { id: "m1" } });
			expect(seen).toHaveLength(0);
		} finally {
			realtimeBus.off(CASE_EVENTS.message, listener);
		}
	});
});

// --- the clarification answerer (ws1-brief Part 3C) -----------------------
//
// The service has three promises, and each of them is a promise about what
// does NOT happen: it does not throw, it does not hang, and it does not
// invent readiness. Each one gets its own test, because a service that only
// answers when the provider is healthy is not the service the intake path
// needs.
describe("the clarification answerer (server/services/caseConversationService.js)", () => {
	afterEach(() => {
		resetClarificationProvider();
	});

	test("with no provider configured it asks the fixed question and is not ready", async () => {
		const answer = await answerClarification({
			subject: "Checkout fails",
			messages: [{ role: "client", content: "The total is wrong" }],
		});
		expect(answer).toEqual({ reply: FALLBACK_CLARIFYING_QUESTION, ready: false });
	});

	test("a provider that throws falls back instead of failing the request", async () => {
		setClarificationProvider(() => Promise.reject(new Error("provider is down")));
		const answer = await answerClarification({
			subject: "Checkout fails",
			messages: [{ role: "client", content: "The total is wrong" }],
		});
		expect(answer).toEqual({ reply: FALLBACK_CLARIFYING_QUESTION, ready: false });
	});

	test("a provider that never answers does not hang the request", async () => {
		const previous = process.env.CASE_AI_TIMEOUT_MS;
		process.env.CASE_AI_TIMEOUT_MS = "150";
		setClarificationProvider(() => new Promise(() => {}));
		try {
			const answer = await answerClarification({
				subject: "Checkout fails",
				messages: [{ role: "client", content: "The total is wrong" }],
			});
			expect(answer).toEqual({ reply: FALLBACK_CLARIFYING_QUESTION, ready: false });
		} finally {
			if (previous === undefined) {
				delete process.env.CASE_AI_TIMEOUT_MS;
			} else {
				process.env.CASE_AI_TIMEOUT_MS = previous;
			}
		}
	});

	test("a provider's answer is used when it works", async () => {
		const provider = jest.fn(async () => "Which browser were you using?");
		setClarificationProvider(provider);
		const answer = await answerClarification({
			subject: "Checkout fails",
			messages: [{ role: "client", content: "The total is wrong" }],
		});
		expect(answer).toEqual({ reply: "Which browser were you using?", ready: false });
		expect(provider).toHaveBeenCalledTimes(1);
		// The prompt must carry the case subject and the client's own words,
		// or the question is asked blind.
		const [prompt, systemPrompt] = provider.mock.calls[0];
		expect(prompt).toContain("Checkout fails");
		expect(prompt).toContain("The total is wrong");
		expect(typeof systemPrompt).toBe("string");
		expect(systemPrompt.length).toBeGreaterThan(0);
	});

	test("a ready case gets the hand-over notice and no question", async () => {
		const provider = jest.fn(async () => "Which browser were you using?");
		setClarificationProvider(provider);
		const answer = await answerClarification({
			subject: "Checkout fails",
			messages: [{ role: "client", content: "The total is wrong" }],
			ready: true,
		});
		expect(answer).toEqual({ reply: READY_REPLY, ready: true });
		expect(provider).not.toHaveBeenCalled();
	});

	test("the round cap is read from the transcript when the caller does not say", async () => {
		const history = Array.from({ length: 6 }, (_unused, index) => ({
			role: "client",
			content: `Answer ${index + 1}`,
		}));
		const answer = await answerClarification({ subject: "Checkout fails", messages: history });
		expect(answer.ready).toBe(true);
	});
});
