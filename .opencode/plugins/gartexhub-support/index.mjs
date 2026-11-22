/**
 * GarTexHub support plugin — tool lifecycle, retry policy and reference docs.
 *
 * Loaded by every opencode started in this repository, INCLUDING the
 * operator's own interactive session (AGENTS.md item 23). It is therefore
 * INERT unless the spawn sets GHT_PLUGIN_ACTIVE=1, which only our controlled
 * investigation/assistant runtimes do. A session without that flag gets no
 * hooks, no transforms and no network calls at all.
 *
 * @opencode/plugin is provided by the opencode runtime when it loads plugins;
 * it is intentionally NOT a package dependency of this app.
 */

import { Plugin } from "@opencode/plugin";

const ACTIVE = process.env.GHT_PLUGIN_ACTIVE === "1";
const CASE_ID = String(process.env.GHT_CASE_ID || "");
const ACTIVITY_URL = String(process.env.GHT_ACTIVITY_URL || "");
const ACTIVITY_TOKEN = String(process.env.GHT_ACTIVITY_TOKEN || "");

/** Fire-and-forget POST of one activity event to the app's internal sink. */
function emitActivity(payload) {
	if (!(ACTIVE && CASE_ID && ACTIVITY_URL && ACTIVITY_TOKEN)) {
		return;
	}
	try {
		fetch(ACTIVITY_URL, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${ACTIVITY_TOKEN}`,
			},
			body: JSON.stringify({ caseId: CASE_ID, ...payload }),
		}).catch(() => {});
	} catch {
		// telemetry must never break an agent turn
	}
}

/** Stable id matching the queue's toolStartId so SSE + plugin events dedupe. */
function toolKey(tool, input) {
	try {
		return `${tool}|${JSON.stringify(input ?? null)}`;
	} catch {
		return `${tool}|unserializable`;
	}
}

export default Plugin.define({
	id: "gartexhub.support",
	async setup(ctx) {
		if (!ACTIVE) {
			return;
		}

		// 2. Authoritative tool lifecycle. The queue's message-list polling is
		// kept as a fallback; these events carry the same id so the client
		// upsert collapses duplicates.
		await ctx.tool.hook("execute.before", (event) => {
			const tool = String(event.tool || "tool");
			emitActivity({
				id: `tool:${toolKey(tool, event.input)}`,
				kind: "tool",
				label: `Using ${tool}`,
				status: "running",
				at: new Date().toISOString(),
			});
		});
		await ctx.tool.hook("execute.after", (event) => {
			const tool = String(event.tool || "tool");
			const failed = event.status === "error";
			emitActivity({
				id: `tool:${toolKey(tool, event.input)}`,
				kind: "tool",
				label: `Using ${tool}`,
				status: failed ? "failed" : "done",
				at: new Date().toISOString(),
				error: failed ? String(event.error?.message || "tool failed") : undefined,
			});
		});

		// 6. Retry policy: keep quota retries bounded and fast — our Node-side
		// free-model fallback chain already handles model refusals, so a
		// provider 429 here gets one short retry rather than the long default.
		await ctx.session.hook("retry", (event) => {
			if (event.error?.status === 429 && event.attempt <= 2) {
				event.decision = { retry: true, delay: 5000 };
			}
		});

		// 7. Approved knowledge references for the research stage. Local docs
		// ship with the repo; the Git reference makes the public handbook
		// available without leaving the investigation.
		const docsPath = `${String(ctx.location?.directory || process.cwd()).replace(/[\\/]+$/u, "")}/docs`;
		await ctx.reference.transform((editor) => {
			editor.add("gartexhub-docs", { type: "local", path: docsPath });
			editor.add("gartexhub-handbook", {
				type: "git",
				repository: "https://github.com/gamertoky1188gro/A-Peronson-s-Website",
				branch: "main",
			});
		});
	},
});
