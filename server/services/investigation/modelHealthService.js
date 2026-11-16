import prisma from "../../utils/prisma.js";

// Live model health for the owner console (Phase D.2).
//
// The support_investigations row already records what the investigation
// queue actually did: which model it picked, whether the run completed, the
// error it died with, and when it started and finished. This service only
// reads that history — no new instrumentation, no sampling, nothing to keep
// in sync. A model the free tier refuses shows up as a quota refusal because
// the queue writes the provider's own message into `error`.
//
// The window is deliberately short: a free tier's health changes by the day,
// so a long window would hide the thing the owner is looking at (is this
// model working right now?).

export const HEALTH_WINDOW_DAYS = 14;

const QUOTA_RE = /quota|rate.?limit|too many requests/iu;
const REFUSAL_RE = /refus|did not answer|empty_text|no content/iu;

function emptyStats() {
	return {
		runs: 0,
		completed: 0,
		failed: 0,
		quotaRefusals: 0,
		otherRefusals: 0,
		totalMs: 0,
		timedRuns: 0,
		lastRunAt: null,
	};
}

function finishStats(stats) {
	const avgMs = stats.timedRuns > 0 ? Math.round(stats.totalMs / stats.timedRuns) : null;
	const { totalMs, timedRuns, ...rest } = stats;
	return { ...rest, avgMs };
}

/**
 * Per-model run statistics over the recent window.
 *
 * @param {Object} [options]
 * @param {number} [options.windowDays]
 * @returns {Promise<{windowDays: number, runs: number, models: Object}>}
 */
export async function getModelHealth({ windowDays = HEALTH_WINDOW_DAYS } = {}) {
	const days =
		Number.isFinite(windowDays) && windowDays > 0 ? Math.floor(windowDays) : HEALTH_WINDOW_DAYS;
	const since = new Date(Date.now() - days * 86_400_000);
	let rows = [];
	try {
		rows = await prisma.supportInvestigation.findMany({
			where: { started_at: { gte: since } },
			select: {
				model_id: true,
				status: true,
				error: true,
				started_at: true,
				completed_at: true,
			},
		});
	} catch {
		// The health readout is an admin convenience: a database it cannot
		// read must not take the model configuration down with it.
		return { windowDays: days, runs: 0, models: {} };
	}

	const models = {};
	let runs = 0;
	for (const row of Array.isArray(rows) ? rows : []) {
		const id = String(row?.model_id || "unknown");
		const stats = models[id] ?? (models[id] = emptyStats());
		runs += 1;
		stats.runs += 1;

		const status = String(row?.status || "").toLowerCase();
		if (status === "complete" || status === "completed") {
			stats.completed += 1;
		} else if (status === "failed" || status === "error") {
			stats.failed += 1;
			const error = String(row?.error || "");
			if (QUOTA_RE.test(error)) {
				stats.quotaRefusals += 1;
			} else if (REFUSAL_RE.test(error)) {
				stats.otherRefusals += 1;
			}
		}

		const startedAt = row?.started_at ? new Date(row.started_at) : null;
		const completedAt = row?.completed_at ? new Date(row.completed_at) : null;
		// A Date is an object: Number.isFinite(date) is false, so the two
		// timestamps have to be compared as numbers.
		const startedMs = startedAt ? startedAt.getTime() : Number.NaN;
		const completedMs = completedAt ? completedAt.getTime() : Number.NaN;
		if (Number.isFinite(startedMs) && Number.isFinite(completedMs)) {
			const ms = completedMs - startedMs;
			if (ms >= 0) {
				stats.totalMs += ms;
				stats.timedRuns += 1;
			}
		}
		if (
			Number.isFinite(startedMs) &&
			(!stats.lastRunAt || startedMs > new Date(stats.lastRunAt).getTime())
		) {
			stats.lastRunAt = new Date(startedMs).toISOString();
		}
	}

	return {
		windowDays: days,
		runs,
		models: Object.fromEntries(Object.entries(models).map(([id, s]) => [id, finishStats(s)])),
	};
}
