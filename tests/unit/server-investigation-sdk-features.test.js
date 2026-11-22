// The v2 client features added to the investigation runtime: session-layer
// deny-first permissions, keyed instruction entries for the brief, and one-shot
// generation for cheap classification (quality verdict). Each is non-fatal on
// failure so an older SDK or a transient error cannot stall an investigation.

import { jest } from "@jest/globals";

const {
	INVESTIGATION_SESSION_PERMISSIONS,
	generateOnce,
	putProblemBrief,
	createInvestigationSession,
} = await import("../../server/services/investigation/opencodeRuntime.js");

describe("INVESTIGATION_SESSION_PERMISSIONS", () => {
	it("denies write/edit/patch/task and reads of .env at every depth", () => {
		const rules = INVESTIGATION_SESSION_PERMISSIONS;
		for (const action of ["write", "edit", "patch", "task"]) {
			expect(rules).toContainEqual({ action, resource: "**", effect: "deny" });
		}
		for (const resource of ["*.env", "**/.env"]) {
			expect(rules).toContainEqual({ action: "read", resource, effect: "deny" });
		}
	});

	it("does not override the agent's *.env.example re-allow", () => {
		// Session rules are evaluated after the agent's and last-match-wins, so
		// a **/.env.* deny here would override the `.env.example` allow.
		expect(INVESTIGATION_SESSION_PERMISSIONS).not.toContainEqual({
			action: "read",
			resource: "**/.env.*",
			effect: "deny",
		});
	});

	it("does NOT deny bash — item 33 restored a narrow read-only shell allowlist", () => {
		expect(INVESTIGATION_SESSION_PERMISSIONS.some((r) => r.action === "bash")).toBe(false);
	});

	it("never uses an `ask` effect — an unattended run cannot stall on a prompt", () => {
		expect(INVESTIGATION_SESSION_PERMISSIONS.every((r) => r.effect === "deny")).toBe(true);
	});
});

describe("generateOnce", () => {
	it("returns the trimmed model text", async () => {
		const client = { session: { generate: jest.fn(async () => ({ text: "  ready  " })) } };
		await expect(generateOnce({ client, sessionID: "s1", prompt: "judge" })).resolves.toBe("ready");
		expect(client.session.generate).toHaveBeenCalledWith({
			sessionID: "s1",
			prompt: "judge",
		});
	});

	it("returns null on a refused/empty turn or a thrown error", async () => {
		const empty = { session: { generate: jest.fn(async () => ({ text: "  " })) } };
		await expect(generateOnce({ client: empty, sessionID: "s1", prompt: "p" })).resolves.toBeNull();
		const throwing = {
			session: {
				generate: jest.fn(async () => {
					throw new Error("429 provider.quota");
				}),
			},
		};
		await expect(
			generateOnce({ client: throwing, sessionID: "s1", prompt: "p" }),
		).resolves.toBeNull();
	});

	it("returns null without a generate API rather than throwing", async () => {
		await expect(generateOnce({ client: {}, sessionID: "s1", prompt: "p" })).resolves.toBeNull();
	});
});

describe("putProblemBrief", () => {
	function clientWithPut(put = jest.fn(async () => {})) {
		return { client: { session: { instructions: { entry: { put } } } }, put };
	}

	it("writes structured fields as one keyed <context> entry", async () => {
		const { client, put } = clientWithPut();
		const ok = await putProblemBrief({
			client,
			sessionID: "s1",
			brief: { fields: { problem: "Cannot delete", environment: "Chrome" } },
		});
		expect(ok).toBe(true);
		expect(put).toHaveBeenCalledTimes(1);
		const arg = put.mock.calls[0][0];
		expect(arg.sessionID).toBe("s1");
		expect(arg.key).toBe("problem-brief");
		expect(arg.value).toContain("problem: Cannot delete");
		expect(arg.value).toContain("environment: Chrome");
	});

	it("falls back to the summary when there are no fields, and caps length", async () => {
		const { client, put } = clientWithPut();
		const ok = await putProblemBrief({
			client,
			sessionID: "s1",
			brief: { summary: "x".repeat(5000) },
		});
		expect(ok).toBe(true);
		expect(put.mock.calls[0][0].value).toHaveLength(4000);
	});

	it("returns false (non-fatal) on a thrown error or a missing API", async () => {
		const failing = clientWithPut(
			jest.fn(async () => {
				throw new Error("unsupported");
			}),
		);
		await expect(
			putProblemBrief({ client: failing.client, sessionID: "s1", brief: { summary: "s" } }),
		).resolves.toBe(false);
		await expect(
			putProblemBrief({ client: {}, sessionID: "s1", brief: { summary: "s" } }),
		).resolves.toBe(false);
	});
});

describe("createInvestigationSession", () => {
	it("pins the investigator agent and attaches the session-layer rules", async () => {
		const create = jest.fn(async () => ({ data: { id: "new-session" } }));
		const client = { session: { create } };
		const id = await createInvestigationSession({
			client,
			title: "investigation lead c1",
			model: { id: "m1", providerID: "opencode" },
			directory: process.cwd(),
		});
		expect(id).toBe("new-session");
		const arg = create.mock.calls[0][0];
		expect(arg.agent).toBe("investigator");
		expect(arg.permissions).toBe(INVESTIGATION_SESSION_PERMISSIONS);
	});
});
