/**
 * @jest-environment allure-jest/jsdom
 *
 * The client half of the support investigation portal (contracts.md 3 and 4).
 *
 * This file owns the assertions for Workstream 4 Part 7A - the state hook in
 * `src/hooks/useSupportCase.js`. The HTTP contract is contracts.md 3:
 *
 *   POST /api/support/cases/:caseId/messages -> { message, reply, ready }
 *   POST /api/support/cases/:caseId/confirm  -> { case }
 *
 * and the event contract is contracts.md 4 - exactly six `support.case.*`
 * type strings, each with its own payload shape.
 *
 * `src/lib/caseRealtime.js` is mocked out on purpose. The SSE endpoint and
 * its wire format belong to the server (contracts.md 4 says so explicitly),
 * so asserting on them here would pin this test to a guess. What is asserted
 * instead is the hook's side of the boundary: the six event names, and the
 * payload keys each one carries.
 */
import { jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react";

const apiRequest = jest.fn();
const getToken = jest.fn(() => "test-token");
const subscribeToCase = jest.fn(() => () => {});

// The hook imports exactly these two symbols from auth.js. An ESM mock factory
// that omits one fails at link time with "does not provide an export named ...".
jest.unstable_mockModule("../../src/lib/auth.js", () => ({ apiRequest, getToken }));

// The SSE client itself, loaded BEFORE the mock below is registered.
//
// The hook tests mock `src/lib/caseRealtime.js` out on purpose: the endpoint
// and its wire format belong to the server (contracts.md §4 says so
// explicitly). The PARSER is ours though - it decides which frames are
// contract events and which are noise - so it is tested here against the
// real module. Jest picks the mock per import, so the real module imported
// first and the mock registered afterwards live side by side: the hook gets
// the mock, this file keeps the real parser.
const realCaseRealtime = await import("../../src/lib/caseRealtime.js");

jest.unstable_mockModule("../../src/lib/caseRealtime.js", () => ({ subscribeToCase }));

const { useSupportCase, seedActivityFromInvestigations } = await import(
	"../../src/hooks/useSupportCase.js"
);

const CASE_ID = "case-1";

// One attachment row, as the GET route serves it.
function caseAttachment(overrides = {}) {
	return {
		id: "att-1",
		case_id: CASE_ID,
		file_path: "/uploads/support/shot.png",
		mime_type: "image/png",
		byte_size: 1024,
		uploaded_by: "user-1",
		created_at: "2026-11-16T09:00:00.000Z",
		...overrides,
	};
}

// One case row.
function caseRow(overrides = {}) {
	return {
		id: CASE_ID,
		status: "collecting",
		subject: "The export button stopped working",
		summary: null,
		...overrides,
	};
}

// The default server answers for one case.
function defaultResponses(overrides = {}) {
	return {
		case: { case: caseRow(), messages: [], attachments: [caseAttachment()] },
		message: {
			message: {
				id: "msg-client",
				role: "client",
				kind: "question",
				content: "The export button stopped working",
				sequence: 1,
			},
			reply: {
				id: "msg-assistant",
				role: "assistant",
				kind: "question",
				content: "Which browser are you on?",
				sequence: 2,
			},
			ready: false,
		},
		confirm: { case: caseRow({ status: "investigating", summary: "The export button 404s." }) },
		...overrides,
	};
}

// Installs the apiRequest mock for one case.
function installApi(overrides = {}) {
	const map = defaultResponses(overrides);
	apiRequest.mockImplementation((path) => {
		if (path === `/support/cases/${CASE_ID}`) {
			return map.case;
		}
		if (path === `/support/cases/${CASE_ID}/messages`) {
			return map.message;
		}
		if (path === `/support/cases/${CASE_ID}/confirm`) {
			return map.confirm;
		}
		throw new Error(`unexpected apiRequest path: ${path}`);
	});
}

// The handler the hook handed to the case stream, captured per test.
let eventHandler = null;

beforeEach(() => {
	apiRequest.mockReset();
	getToken.mockClear();
	eventHandler = null;
	subscribeToCase.mockReset();
	subscribeToCase.mockImplementation((_caseId, handler) => {
		eventHandler = handler;
		return () => {};
	});
});

describe("useSupportCase (src/hooks/useSupportCase.js)", () => {
	it("loads the case with the bearer token when it mounts", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));

		await waitFor(() => expect(result.current.caseRow).not.toBeNull());
		expect(apiRequest).toHaveBeenCalledWith(
			`/support/cases/${CASE_ID}`,
			expect.objectContaining({ token: "test-token" }),
		);
		expect(result.current.status).toBe("collecting");
	});

	it("loads the attachments the server returns with the case", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));

		await waitFor(() => expect(result.current.attachments).toHaveLength(1));
		expect(result.current.attachments[0]).toMatchObject({
			id: "att-1",
			file_path: "/uploads/support/shot.png",
		});
	});

	it("a send followed by a reload keeps one attachment per file", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.caseRow).not.toBeNull());

		await act(async () => {
			await result.current.send("Here is the screenshot", [
				{ file_path: "/uploads/support/shot.png", mime_type: "image/png", byte_size: 1024 },
			]);
		});

		await act(async () => {
			await result.current.refresh();
		});

		expect(result.current.attachments).toHaveLength(1);
		expect(result.current.attachments[0]).toMatchObject({ id: "att-1" });
	});

	it("threads the support token into the x-support-token header when one is set", async () => {
		installApi();
		renderHook(() => useSupportCase(CASE_ID, "gtk_sup_test-token"));
		await waitFor(() => expect(apiRequest).toHaveBeenCalled());
		expect(apiRequest).toHaveBeenCalledWith(
			`/support/cases/${CASE_ID}`,
			expect.objectContaining({
				headers: { "x-support-token": "gtk_sup_test-token" },
				skipSessionClear: true,
			}),
		);
	});

	it("subscribes to the case event stream", async () => {
		installApi();
		renderHook(() => useSupportCase(CASE_ID));

		await waitFor(() =>
			expect(subscribeToCase).toHaveBeenCalledWith(CASE_ID, expect.any(Function), ""),
		);
	});

	it("send posts to the case messages endpoint and appends the message and the reply", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.caseRow).not.toBeNull());

		await act(async () => {
			await result.current.send("The export button stopped working");
		});

		expect(apiRequest).toHaveBeenCalledWith(
			`/support/cases/${CASE_ID}/messages`,
			expect.objectContaining({
				method: "POST",
				token: "test-token",
				body: expect.objectContaining({ content: "The export button stopped working" }),
			}),
		);

		await waitFor(() => {
			expect(result.current.messages.map((message) => message.id)).toEqual([
				"msg-client",
				"msg-assistant",
			]);
		});
		expect(result.current.messages[1].content).toBe("Which browser are you on?");
	});

	it("send carries attachments in the shape contracts.md 3 defines", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.caseRow).not.toBeNull());

		await act(async () => {
			await result.current.send("Here is the screenshot", [
				{ file_path: "/uploads/support/shot.png", mime_type: "image/png", byte_size: 1024 },
			]);
		});

		expect(apiRequest).toHaveBeenCalledWith(
			`/support/cases/${CASE_ID}/messages`,
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({
					content: "Here is the screenshot",
					attachments: [
						{ file_path: "/uploads/support/shot.png", mime_type: "image/png", byte_size: 1024 },
					],
				}),
			}),
		);
	});

	it("a ready response moves the case to investigating", async () => {
		installApi({ message: { ...defaultResponses().message, ready: true } });
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.caseRow).not.toBeNull());
		expect(result.current.status).toBe("collecting");

		await act(async () => {
			await result.current.send("The export button stopped working");
		});

		expect(result.current.status).toBe("investigating");
		expect(result.current.caseRow?.status).toBe("investigating");
	});

	it("a response that is not ready leaves the case collecting", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.caseRow).not.toBeNull());

		await act(async () => {
			await result.current.send("The export button stopped working");
		});

		expect(result.current.status).toBe("collecting");
	});

	it("applies the returned subject to the case row", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID, "tok"));
		await waitFor(() => expect(result.current.caseRow).not.toBeNull());
		apiRequest.mockImplementationOnce(async () => ({
			message: { id: "m2", role: "client", content: "hi", sequence: 2 },
			reply: {
				id: "m3",
				role: "assistant",
				kind: "question",
				content: "Where exactly?",
				sequence: 3,
			},
			ready: false,
			subject: "verification renewal free months never applied",
		}));
		await act(async () => {
			await result.current.send("hi", []);
		});
		expect(result.current.caseRow?.subject).toBe("verification renewal free months never applied");
	});

	it("confirm posts to the case confirm endpoint", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.caseRow).not.toBeNull());

		await act(async () => {
			await result.current.confirm();
		});

		expect(apiRequest).toHaveBeenCalledWith(
			`/support/cases/${CASE_ID}/confirm`,
			expect.objectContaining({ method: "POST", token: "test-token" }),
		);
		expect(result.current.status).toBe("investigating");
		expect(result.current.caseRow?.summary).toBe("The export button 404s.");
	});

	it("applies the six contract event types from contracts.md 4", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(typeof eventHandler).toBe("function"));

		act(() => {
			eventHandler("support.case.message", {
				message: { id: "msg-live", role: "assistant", content: "live", sequence: 3 },
			});
		});
		expect(result.current.messages.map((message) => message.id)).toContain("msg-live");

		act(() => {
			eventHandler("support.case.status", {
				caseId: CASE_ID,
				status: "reporting",
				summary: "Found it.",
			});
		});
		expect(result.current.status).toBe("reporting");
		expect(result.current.caseRow?.status).toBe("reporting");
		expect(result.current.caseRow?.summary).toBe("Found it.");

		act(() => {
			eventHandler("support.case.progress", {
				caseId: CASE_ID,
				role: "lead",
				status: "running",
				detail: "reading the logs",
			});
		});
		expect(result.current.progress).toEqual([
			{ role: "lead", status: "running", detail: "reading the logs" },
		]);

		act(() => {
			eventHandler("support.case.finding", {
				caseId: CASE_ID,
				role: "code",
				finding: { confidence: "confirmed", detail: "the route is missing", evidence: [] },
			});
		});
		expect(result.current.findings).toHaveLength(1);
		expect(result.current.findings[0].role).toBe("code");
		expect(result.current.findings[0].finding.confidence).toBe("confirmed");

		act(() => {
			eventHandler("support.case.report", {
				caseId: CASE_ID,
				report: "# Investigation report",
				reportStatus: "ready",
			});
		});
		expect(result.current.report).toEqual({
			report: "# Investigation report",
			reportStatus: "ready",
		});
	});

	it("ignores an event type that is not one of the six", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(typeof eventHandler).toBe("function"));

		act(() => {
			eventHandler("support.case.something-else", { status: "completed" });
		});

		expect(result.current.status).toBe("collecting");
		expect(result.current.messages).toHaveLength(0);
	});

	it("send posts nothing when no case is open", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(null));

		await act(async () => {
			await result.current.send("hello");
		});

		expect(apiRequest).not.toHaveBeenCalled();
		expect(result.current.error).toBeTruthy();
	});

	it("send posts nothing when the message is empty", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(apiRequest).toHaveBeenCalled());
		apiRequest.mockClear();

		await act(async () => {
			await result.current.send("   ");
		});

		expect(apiRequest).not.toHaveBeenCalled();
		expect(result.current.error).toBeTruthy();
	});
});

// ---------------------------------------------------------------------------
// The SSE parser (src/lib/caseRealtime.js), directly.
//
// The contract is contracts.md §4: exactly six `support.case.*` event type
// strings, and the frame's data is the payload. A frame with any other type
// is ignored rather than guessed at.
// ---------------------------------------------------------------------------

/**
 * A fetch stub that answers with one SSE body and then ends the stream.
 *
 * @param {string} text The raw stream text.
 * @returns {Function} A fetch stub.
 */
function stubStream(text) {
	const encoder = new TextEncoder();
	const chunk = encoder.encode(text);
	let sent = false;
	return jest.fn(async () => ({
		ok: true,
		body: {
			getReader() {
				return {
					async read() {
						if (sent) {
							return { done: true, value: undefined };
						}
						sent = true;
						return { done: false, value: chunk };
					},
				};
			},
		},
	}));
}

/** One SSE frame: a type, a data line and the blank line that ends it. */
function sseFrame(type, data) {
	return `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
}

describe("the case SSE parser (src/lib/caseRealtime.js)", () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it("the event types are exactly the seven case event names", () => {
		expect(realCaseRealtime.CASE_EVENT_TYPES).toEqual([
			"support.case.message",
			"support.case.status",
			"support.case.progress",
			"support.case.finding",
			"support.case.report",
			"support.case.activity",
			"support.case.usage",
		]);
	});

	it("each of the seven types is dispatched on, with its payload", () => {
		for (const type of realCaseRealtime.CASE_EVENT_TYPES) {
			const event = realCaseRealtime.normalizeCaseEvent(type, { caseId: CASE_ID, detail: "x" });
			expect(event).not.toBeNull();
			expect(event.type).toBe(type);
			expect(event.payload).toEqual({ caseId: CASE_ID, detail: "x" });
		}
	});

	it("a type that is not one of the six is ignored", () => {
		for (const type of ["support.case.something-else", "support.case", "message", "status", ""]) {
			expect(realCaseRealtime.normalizeCaseEvent(type, { caseId: CASE_ID })).toBeNull();
		}
	});

	it("a frame of the stream reaches the handler with its type and its payload", async () => {
		const events = [];
		global.fetch = stubStream(
			sseFrame("support.case.status", { caseId: CASE_ID, status: "reporting" }),
		);

		const unsubscribe = realCaseRealtime.subscribeToCase(CASE_ID, (type, payload) => {
			events.push({ type, payload });
		});
		await waitFor(() => expect(events).toHaveLength(1));
		unsubscribe?.();

		expect(events[0].type).toBe("support.case.status");
		expect(events[0].payload).toMatchObject({ caseId: CASE_ID, status: "reporting" });
	});

	it("a frame of an unknown type never reaches the handler", async () => {
		const events = [];
		global.fetch = stubStream(
			sseFrame("support.case.something-else", { caseId: CASE_ID, status: "completed" }),
		);

		const unsubscribe = realCaseRealtime.subscribeToCase(CASE_ID, (type, payload) => {
			events.push({ type, payload });
		});
		// The frame is read from the stream; the handler is not called.
		await new Promise((resolve) => setTimeout(resolve, 50));
		unsubscribe?.();

		expect(events).toHaveLength(0);
	});

	it("the stream path is the case stream of contracts.md 4", () => {
		expect(realCaseRealtime.caseStreamPath(CASE_ID)).toBe(`/api/support/cases/${CASE_ID}/stream`);
	});
});

// ---------------------------------------------------------------------------
// The activity tree state (Task 7). The reducer seeds `activity` from the
// investigations projection the case read serves, and merges live
// `support.case.activity` frames into the same list, deduped by id.
// ---------------------------------------------------------------------------

describe("useSupportCase activity (Task 7)", () => {
	it("seeds the activity rows from the investigations the case read returns", async () => {
		installApi({
			case: {
				case: caseRow(),
				messages: [],
				attachments: [],
				investigations: [
					{
						role: "lead",
						status: "completed",
						completed_at: "2026-11-17T06:00:06.000Z",
						tool_log: [
							{ kind: "read", label: "Reading walletService.js", status: "done" },
							{ kind: "search", label: "Searching code", status: "failed" },
						],
					},
				],
			},
		});
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.activity).toHaveLength(2));
		expect(result.current.activity[0]).toMatchObject({
			role: "lead",
			label: "Reading walletService.js",
			status: "done",
		});
		expect(result.current.activity[0].id).toMatch(/^persist:lead:0:/u);
		expect(result.current.activity[1]).toMatchObject({
			status: "failed",
		});
		expect(result.current.activity[1].id).toMatch(/^persist:lead:1:/u);
	});

	it("a support.case.activity frame merges a row by id instead of duplicating it", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(typeof eventHandler).toBe("function"));

		act(() => {
			eventHandler("support.case.activity", {
				caseId: CASE_ID,
				id: "row-1",
				role: "code",
				kind: "read",
				label: "Reading routes",
				status: "done",
				at: "2026-11-17T06:00:00.000Z",
			});
		});
		act(() => {
			eventHandler("support.case.activity", {
				caseId: CASE_ID,
				id: "row-1",
				role: "code",
				kind: "read",
				label: "Reading routes (updated)",
				status: "done",
				at: "2026-11-17T06:00:01.000Z",
			});
		});

		expect(result.current.activity).toHaveLength(1);
		expect(result.current.activity[0].label).toBe("Reading routes (updated)");
	});

	it("a support.case.usage frame updates the hook's usage state", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(typeof eventHandler).toBe("function"));

		act(() => {
			eventHandler("support.case.usage", {
				caseId: CASE_ID,
				role: "lead",
				used: 62_464,
				output: 80,
				reasoning: 207,
				cacheRead: 62_464,
				cacheWrite: 0,
			});
		});

		expect(result.current.usage).toEqual({
			used: 62_464,
			output: 80,
			reasoning: 207,
			cacheRead: 62_464,
			cacheWrite: 0,
		});
	});

	it("a streaming intake chunk updates the hook's streaming state; the real message settles it", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(typeof eventHandler).toBe("function"));

		act(() => {
			eventHandler("support.case.message", {
				caseId: CASE_ID,
				message: {
					id: "stream-1",
					role: "assistant",
					kind: "question",
					content: "Partial answer...",
					streaming: true,
				},
			});
		});
		expect(result.current.streaming?.content).toBe("Partial answer...");

		act(() => {
			eventHandler("support.case.message", {
				caseId: CASE_ID,
				message: {
					id: "m-99",
					role: "assistant",
					kind: "question",
					content: "Partial answer, completed.",
					sequence: 5,
				},
			});
		});
		expect(result.current.streaming).toBeNull();
	});

	it("an activity frame without an id is ignored", async () => {
		installApi();
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(typeof eventHandler).toBe("function"));

		act(() => {
			eventHandler("support.case.activity", { caseId: CASE_ID, label: "no id" });
		});

		expect(result.current.activity).toHaveLength(0);
	});
});

describe("useSupportCase activity seeds (fix round 1)", () => {
	it("caps a >200-entry seed at the last 200 rows", async () => {
		const toolLog = Array.from({ length: 210 }, (_, index) => ({
			kind: "read",
			label: `Step ${index}`,
			status: "done",
		}));
		installApi({
			case: {
				case: caseRow(),
				messages: [],
				attachments: [],
				investigations: [
					{
						role: "lead",
						status: "completed",
						completed_at: "2026-11-17T06:00:06.000Z",
						tool_log: toolLog,
					},
				],
			},
		});
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.activity).toHaveLength(200));
		expect(result.current.activity[0].id).toMatch(/^persist:lead:10:/u);
		expect(result.current.activity[199].id).toMatch(/^persist:lead:209:/u);
	});

	it("survives a non-date completed_at and produces an empty at", async () => {
		installApi({
			case: {
				case: caseRow(),
				messages: [],
				attachments: [],
				investigations: [
					{
						role: "code",
						status: "completed",
						completed_at: "not a date",
						tool_log: [{ kind: "read", label: "Reading routes", status: "done" }],
					},
				],
			},
		});
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.activity).toHaveLength(1));
		expect(result.current.activity[0].at).toBe("");
	});
});

describe("useSupportCase activity seeds (fix round 2)", () => {
	it("keeps live activity rows when a reload seeds the persisted projection", async () => {
		installApi({
			case: {
				case: caseRow(),
				messages: [],
				attachments: [],
				investigations: [
					{
						role: "lead",
						status: "completed",
						completed_at: "2026-11-17T06:00:06.000Z",
						tool_log: [{ kind: "read", label: "Reading walletService.js", status: "done" }],
					},
				],
			},
		});
		const { result } = renderHook(() => useSupportCase(CASE_ID));
		await waitFor(() => expect(result.current.activity).toHaveLength(1));

		act(() => {
			eventHandler("support.case.activity", {
				caseId: CASE_ID,
				id: "live-1",
				role: "code",
				kind: "read",
				label: "Reading routes (live)",
				status: "done",
				at: "2026-11-17T06:01:00.000Z",
			});
		});
		expect(result.current.activity).toHaveLength(2);

		await act(async () => {
			await result.current.refresh();
		});

		expect(result.current.activity.map((row) => row.id)).toEqual(
			expect.arrayContaining([expect.stringMatching(/^persist:lead:0:/u), "live-1"]),
		);
		expect(result.current.activity).toHaveLength(2);
	});
});

describe("seedActivityFromInvestigations — reload keeps the timeline readable", () => {
	it("spreads tool calls across the role window so duration survives a reload", () => {
		const rows = seedActivityFromInvestigations([
			{
				role: "code",
				status: "complete",
				started_at: "2026-11-17T06:00:00.000Z",
				completed_at: "2026-11-17T06:01:30.000Z",
				tool_log: [
					{ tool: "read", kind: "read", label: "Reading a.js", status: "complete" },
					{ tool: "grep", kind: "search", label: "Searching code", status: "complete" },
					{ tool: "read", kind: "read", label: "Reading b.js", status: "complete" },
				],
			},
		]);
		expect(rows).toHaveLength(3);
		const times = rows.map((r) => Date.parse(r.at)).filter(Number.isFinite);
		expect(times).toHaveLength(3);
		// Distinct, increasing timestamps — not all equal to completed_at.
		expect(new Set(times).size).toBe(3);
		expect(times[0]).toBeLessThan(times[2]);
		expect(times[2] - times[0]).toBeGreaterThanOrEqual(60_000);
	});

	it("prefers a real per-tool timestamp when the server recorded one", () => {
		const rows = seedActivityFromInvestigations([
			{
				role: "lead",
				status: "complete",
				completed_at: "2026-11-17T06:01:30.000Z",
				tool_log: [
					{
						tool: "read",
						kind: "read",
						label: "Reading a.js",
						status: "complete",
						at: "2026-11-17T06:00:12.000Z",
					},
				],
			},
		]);
		expect(rows[0].at).toBe("2026-11-17T06:00:12.000Z");
	});
});
