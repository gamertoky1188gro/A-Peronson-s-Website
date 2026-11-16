import { jest } from "@jest/globals";

// Live model health (Phase D.2).
//
// The readout is only as good as the rows it aggregates, so what is pinned
// here is the classification: a completed run counts as completed, a failed
// run whose error names a quota counts as a quota refusal (the free tier's
// per-model limit, which is the failure the owner most needs to see), and an
// average is taken only over runs that recorded both ends.

const supportInvestigationFindMany = jest.fn(async () => []);

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		supportInvestigation: { findMany: supportInvestigationFindMany },
	},
}));

const { getModelHealth } = await import(
	"../../server/services/investigation/modelHealthService.js"
);

const DAY = 86_400_000;

function row(overrides = {}) {
	return {
		model_id: "opencode/minimax-m3.1-flash-free",
		status: "complete",
		error: null,
		started_at: new Date("2026-11-16T10:00:00.000Z"),
		completed_at: new Date("2026-11-16T10:01:00.000Z"),
		...overrides,
	};
}

beforeEach(() => {
	supportInvestigationFindMany.mockReset();
	supportInvestigationFindMany.mockResolvedValue([]);
});

describe("getModelHealth", () => {
	it("averages the duration of completed runs only", async () => {
		supportInvestigationFindMany.mockResolvedValue([
			row({
				started_at: new Date("2026-11-16T10:00:00Z"),
				completed_at: new Date("2026-11-16T10:01:00Z"),
			}),
			row({
				started_at: new Date("2026-11-16T11:00:00Z"),
				completed_at: new Date("2026-11-16T11:03:00Z"),
			}),
		]);
		const health = await getModelHealth({ windowDays: 7 });
		expect(health.runs).toBe(2);
		expect(health.models["opencode/minimax-m3.1-flash-free"]).toMatchObject({
			runs: 2,
			completed: 2,
			failed: 0,
			avgMs: 120_000,
		});
	});

	it("splits quota refusals from other failures", async () => {
		supportInvestigationFindMany.mockResolvedValue([
			row({ status: "failed", error: "provider.quota: 429 Too Many Requests" }),
			row({ status: "failed", error: "The agent did not answer with JSON (empty_text)" }),
			row({ status: "failed", error: "Something else entirely" }),
		]);
		const stats = (await getModelHealth()).models["opencode/minimax-m3.1-flash-free"];
		expect(stats.failed).toBe(3);
		expect(stats.quotaRefusals).toBe(1);
		expect(stats.otherRefusals).toBe(1);
	});

	it("names the model that was actually picked, and the last run", async () => {
		supportInvestigationFindMany.mockResolvedValue([
			row({ model_id: "opencode/glm-5.3-flash-free", started_at: new Date(Date.now() - 2 * DAY) }),
			row({ model_id: "opencode/glm-5.3-flash-free", started_at: new Date(Date.now() - DAY) }),
		]);
		const health = await getModelHealth({ windowDays: 7 });
		expect(Object.keys(health.models)).toEqual(["opencode/glm-5.3-flash-free"]);
		expect(health.models["opencode/glm-5.3-flash-free"].lastRunAt).toBeTruthy();
	});

	it("falls back to `unknown` when a row records no model", async () => {
		supportInvestigationFindMany.mockResolvedValue([row({ model_id: null })]);
		const health = await getModelHealth({ windowDays: 7 });
		expect(health.models.unknown.runs).toBe(1);
	});

	it("answers empty instead of throwing when the history cannot be read", async () => {
		supportInvestigationFindMany.mockRejectedValue(new Error("db down"));
		await expect(getModelHealth()).resolves.toEqual({ windowDays: 14, runs: 0, models: {} });
	});
});
