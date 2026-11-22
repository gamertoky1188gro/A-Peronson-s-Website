// The guarded plugin posts tool-lifecycle events back through a short-lived,
// in-memory token. A wrong case, an expired token, or no token must never
// publish to a case stream — the sink is an unauthenticated HTTP route and the
// token is its only credential.

import { jest } from "@jest/globals";

const emitCaseEvent = jest.fn();
jest.unstable_mockModule("../../server/realtime/realtimeBus.js", () => ({
	CASE_EVENTS: { activity: "support.case.activity" },
	emitCaseEvent,
}));

const { mintPluginToken, revokePluginToken, acceptPluginActivity } = await import(
	"../../server/services/pluginActivityService.js"
);

beforeEach(() => {
	emitCaseEvent.mockReset();
});

describe("pluginActivityService", () => {
	it("publishes a well-formed event for a valid token + matching case", () => {
		const token = mintPluginToken("case-1");
		const ok = acceptPluginActivity({
			token,
			caseId: "case-1",
			payload: {
				id: "tool:read|x",
				label: "Using read",
				status: "done",
				kind: "tool",
			},
		});
		expect(ok).toBe(true);
		expect(emitCaseEvent).toHaveBeenCalledTimes(1);
		const [caseId, type, event] = emitCaseEvent.mock.calls[0];
		expect(caseId).toBe("case-1");
		expect(type).toBe("support.case.activity");
		expect(event.id).toBe("tool:read|x");
		expect(event.status).toBe("done");
		expect(event.source).toBe("plugin");
	});

	it("refuses a token used against a different case", () => {
		const token = mintPluginToken("case-1");
		expect(acceptPluginActivity({ token, caseId: "case-2", payload: { label: "x" } })).toBe(false);
		expect(emitCaseEvent).not.toHaveBeenCalled();
		// The token is not consumed by a refused attempt.
		expect(acceptPluginActivity({ token, caseId: "case-1", payload: { label: "x" } })).toBe(true);
	});

	it("refuses missing, revoked, and expired tokens", () => {
		expect(acceptPluginActivity({ token: "", caseId: "c", payload: {} })).toBe(false);
		expect(acceptPluginActivity({ token: "bogus", caseId: "c", payload: {} })).toBe(false);
		const revoked = mintPluginToken("c");
		revokePluginToken(revoked);
		expect(acceptPluginActivity({ token: revoked, caseId: "c", payload: {} })).toBe(false);
		const expired = mintPluginToken("c", -1);
		expect(acceptPluginActivity({ token: expired, caseId: "c", payload: {} })).toBe(false);
		expect(emitCaseEvent).not.toHaveBeenCalled();
	});

	it("clamps an unknown status to `done` and truncates an error", () => {
		const token = mintPluginToken("c");
		acceptPluginActivity({
			token,
			caseId: "c",
			payload: { status: "weird", error: "e".repeat(500), label: "L".repeat(200) },
		});
		const event = emitCaseEvent.mock.calls[0][2];
		expect(event.status).toBe("done");
		expect(event.error).toHaveLength(300);
		expect(event.label).toHaveLength(80);
	});
});
