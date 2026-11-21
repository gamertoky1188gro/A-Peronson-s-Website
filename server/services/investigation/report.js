/**
 * Markdown report renderer for the AI support investigation portal.
 *
 * `buildReport` turns one support case - its thread and its investigation runs -
 * into the Markdown report that the admin console renders and that the
 * delivery email links to.
 *
 * Two rules shape the output, and both exist because a plausible-looking
 * report is worse than an obviously incomplete one:
 *
 *  1. A FAILED investigation run renders as INCOMPLETE, carrying its error.
 *     It is never rendered as "no findings found". A run that crashed did not
 *     look for anything, so its silence is not an answer, and the report must
 *     not read as if it were one.
 *  2. A finding with no evidence reference renders as SPECULATIVE. The
 *     pipeline has no path that promotes an unevidenced claim, and neither
 *     has this renderer: it re-applies the demotion on the way out, so a row
 *     written by anything other than the findings pipeline cannot smuggle an
 *     unevidenced claim into the "confirmed" group.
 *
 * The renderer is total: it never throws on missing or malformed input. A
 * report that fails to render is a report nobody gets, and the failure would
 * be indistinguishable from a failed investigation.
 */

import { severityOf } from "./classification.js";

/** The confidence buckets, in the order they are reported. */
const CONFIDENCE_LEVELS = ["confirmed", "probable", "speculative"];

/** Anything that is not one of the three buckets is reported as speculative. */
const DEFAULT_CONFIDENCE = "speculative";

/** The agent roles, in the order the pipeline runs them. */
const ROLE_ORDER = ["lead", "code", "repo", "research", "verify"];

/**
 * The roles the CLIENT speaks under. The schema documents `client`, and
 * `caseService.appendCaseMessage` documents `user`; both are accepted so the
 * "original complaint" is found either way.
 */
const CLIENT_ROLES = new Set(["client", "user"]);

/** The line break used to split a multi-line detail. */

/** The placeholder used for an absent value. */
const EMPTY = "-";

function text(value) {
	return String(value ?? "").trim();
}

function singleLine(value) {
	return text(value).replace(/\s+/gu, " ");
}

function asArray(value) {
	return Array.isArray(value) ? value : [];
}

/**
 * A Prisma `Json` column arrives already parsed. A hand-built row (a test
 * fixture, a queue payload) may arrive as a JSON string, so both are read.
 */
function parseJsonColumn(value) {
	if (value === null || value === undefined) {
		return null;
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed === "") {
			return null;
		}
		try {
			return JSON.parse(trimmed);
		} catch {
			return trimmed;
		}
	}
	return value;
}

function formatTimestamp(value) {
	if (value === null || value === undefined || value === "") {
		return EMPTY;
	}
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) {
		return singleLine(value) || EMPTY;
	}
	return date.toISOString();
}

function tableCell(value) {
	return singleLine(value).replace(/\|/gu, "\\|");
}

function describeValue(value) {
	if (value === null || value === undefined) {
		return EMPTY;
	}
	if (typeof value === "object") {
		return JSON.stringify(value);
	}
	return String(value);
}

/**
 * One item of a list that may hold strings or objects. Objects are expanded
 * into their own key/value lines, so every recorded value survives into the
 * report instead of being flattened into `[object Object]`.
 */
function renderItemList(items, indent = "") {
	const lines = [];
	for (const item of asArray(items).filter((entry) => entry !== null && entry !== undefined)) {
		if (typeof item === "object" && !Array.isArray(item)) {
			const entries = Object.entries(item).filter(
				([, value]) => value !== null && value !== undefined && text(value) !== "",
			);
			if (entries.length > 0) {
				const [firstKey, firstValue] = entries[0];
				lines.push(`${indent}- ${firstKey}: ${describeValue(firstValue)}`);
				for (const [key, value] of entries.slice(1)) {
					lines.push(`${indent}  - ${key}: ${describeValue(value)}`);
				}
			}
		} else {
			const value = singleLine(describeValue(item));
			if (value !== "") {
				lines.push(`${indent}- ${value}`);
			}
		}
	}
	return lines;
}

/**
 * Coerce a recorded confidence to one of the three buckets. Anything
 * unrecognised becomes speculative - there is no fourth bucket and no path
 * that promotes an unknown value.
 */
function normalizeConfidence(value) {
	const candidate = singleLine(value).toLowerCase();
	return CONFIDENCE_LEVELS.includes(candidate) ? candidate : DEFAULT_CONFIDENCE;
}

/**
 * Normalize one evidence reference. The recorded shape is
 * `{ file, lines, commit, url }`; a bare string is accepted as a file.
 */
function normalizeEvidenceEntry(entry) {
	if (entry === null || entry === undefined) {
		return null;
	}
	if (typeof entry === "string") {
		const value = entry.trim();
		return value === "" ? null : { file: value, lines: "", commit: "", url: "" };
	}
	if (typeof entry !== "object" || Array.isArray(entry)) {
		return null;
	}
	const normalized = {
		file: text(entry.file ?? entry.path ?? entry.file_path ?? entry.name),
		lines: text(entry.lines ?? entry.line ?? entry.range),
		commit: text(entry.commit ?? entry.sha ?? entry.commit_sha),
		url: text(entry.url ?? entry.link ?? entry.href),
	};
	const hasAny = normalized.file || normalized.lines || normalized.commit || normalized.url;
	return hasAny ? normalized : null;
}

function renderEvidenceEntry(entry) {
	const parts = [];
	if (entry.file) {
		parts.push(entry.file);
	}
	if (entry.lines) {
		parts.push(`lines ${entry.lines}`);
	}
	if (entry.commit) {
		parts.push(`commit ${entry.commit}`);
	}
	if (entry.url) {
		parts.push(entry.url);
	}
	return parts.join(" - ");
}

/**
 * The evidence list of a finding. It is always an array, but a single
 * reference object is accepted so one reference is not read as "unevidenced".
 */
function asEvidenceList(value) {
	if (Array.isArray(value)) {
		return value;
	}
	if (value && typeof value === "object") {
		return [value];
	}
	return [];
}

/**
 * Normalize one finding and re-apply the evidence demotion.
 *
 * A finding whose evidence list is empty is reported as speculative even if
 * the row claims otherwise.
 */
function normalizeFinding(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
		return null;
	}
	const detail = text(raw.detail ?? raw.summary ?? raw.text ?? raw.description);
	if (detail === "") {
		return null;
	}
	const evidence = asEvidenceList(raw.evidence).map(normalizeEvidenceEntry).filter(Boolean);
	const recorded = normalizeConfidence(raw.confidence);
	const confidence = evidence.length === 0 ? DEFAULT_CONFIDENCE : recorded;
	const unverifiedReferences = asArray(raw.unverified_references)
		.map((value) => singleLine(value))
		.filter(Boolean);
	return {
		confidence,
		recordedConfidence: recorded,
		demoted: evidence.length === 0 && recorded !== DEFAULT_CONFIDENCE,
		unverifiedReferences,
		detail,
		evidence,
	};
}

/** The `{ summary, findings, limitations }` payload of an investigation. */
function readFindingsPayload(investigation) {
	const raw = parseJsonColumn(investigation?.findings);
	if (Array.isArray(raw)) {
		// A bare list of findings is accepted: dropping it silently would turn
		// a populated investigation into an empty one.
		return { summary: "", findings: raw, limitations: [] };
	}
	if (!raw || typeof raw !== "object") {
		return { summary: "", findings: [], limitations: [] };
	}
	return {
		summary: text(raw.summary),
		findings: asArray(raw.findings),
		limitations: asArray(raw.limitations),
	};
}

/** The `{ files, commits, queries, failures }` payload of an investigation. */
function readEvidencePayload(investigation) {
	const raw = parseJsonColumn(investigation?.evidence);
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
		return { files: [], commits: [], queries: [], failures: [] };
	}
	return {
		files: asArray(raw.files),
		commits: asArray(raw.commits),
		queries: asArray(raw.queries),
		failures: asArray(raw.failures),
	};
}

/** The `[{ tool, status, error }]` payload of an investigation. */
function readToolLog(investigation) {
	return asArray(parseJsonColumn(investigation?.tool_log)).map((entry) => {
		if (typeof entry === "string") {
			return { tool: entry, status: "unknown", error: "" };
		}
		if (!entry || typeof entry !== "object") {
			return { tool: "unknown", status: "unknown", error: "" };
		}
		return {
			tool: text(entry.tool ?? entry.name ?? "unknown"),
			status: text(entry.status ?? "unknown"),
			error: text(entry.error ?? entry.message),
		};
	});
}

function orderMessages(messages) {
	return asArray(messages)
		.filter((message) => message && typeof message === "object")
		.map((message, index) => ({ message, index }))
		.sort((a, b) => {
			const left = Number(a.message.sequence);
			const right = Number(b.message.sequence);
			const leftUsable = Number.isFinite(left);
			const rightUsable = Number.isFinite(right);
			if (leftUsable && rightUsable && left !== right) {
				return left - right;
			}
			if (leftUsable && !rightUsable) {
				return -1;
			}
			if (!leftUsable && rightUsable) {
				return 1;
			}
			return a.index - b.index;
		})
		.map((entry) => entry.message);
}

/**
 * Order the runs so the report reads in the order the pipeline runs them:
 * lead, code, repo, research, verify. A retry of a role stays with its role.
 */
function orderInvestigations(investigations) {
	return asArray(investigations)
		.filter((investigation) => investigation && typeof investigation === "object")
		.map((investigation, index) => ({ investigation, index }))
		.sort(
			(a, b) =>
				roleRank(a.investigation.role) - roleRank(b.investigation.role) || a.index - b.index,
		)
		.map((entry) => entry.investigation);
}

function roleRank(role) {
	const index = ROLE_ORDER.indexOf(singleLine(role).toLowerCase());
	return index === -1 ? ROLE_ORDER.length : index;
}

/**
 * Reduce one investigation row to everything the report needs to say about
 * it. The `failed` flag is derived here and used everywhere else, so a failed
 * run can never be rendered as a clean one by accident.
 */
function readInvestigation(investigation) {
	const { id, role, status, attempt, model_id, error, report, started_at, completed_at } =
		investigation;
	const normalizedStatus = singleLine(status).toLowerCase() || "unknown";
	const findingsPayload = readFindingsPayload(investigation);
	const evidencePayload = readEvidencePayload(investigation);
	const attemptNumber = Number(attempt);
	return {
		id: text(id),
		role: singleLine(role).toLowerCase() || "unknown",
		status: normalizedStatus,
		failed: normalizedStatus === "failed",
		error: text(error),
		modelId: text(model_id),
		attempt: Number.isFinite(attemptNumber) ? attemptNumber : 0,
		startedAt: formatTimestamp(started_at),
		completedAt: formatTimestamp(completed_at),
		summary: findingsPayload.summary,
		limitations: findingsPayload.limitations,
		findings: findingsPayload.findings.map(normalizeFinding).filter(Boolean),
		toolLog: readToolLog(investigation),
		files: evidencePayload.files,
		commits: evidencePayload.commits,
		queries: evidencePayload.queries,
		failures: evidencePayload.failures,
		report: text(report),
	};
}

function renderToolLog(toolLog) {
	if (toolLog.length === 0) {
		return ["_No tool calls were recorded._"];
	}
	const lines = ["| Tool | Status | Error |", "|---|---|---|"];
	for (const entry of toolLog) {
		lines.push(
			`| ${tableCell(entry.tool)} | ${tableCell(entry.status)} | ${tableCell(entry.error || EMPTY)} |`,
		);
	}
	return lines;
}

function renderEvidenceList(title, items) {
	const rendered = renderItemList(items);
	// File lists that are too long to use vanish; keep only the count.
	if (rendered.length === 0 || rendered.length > 8) {
		const n = Array.isArray(items) ? items.length : asArray(items).length;
		return [`**${title}:** ${n}`, ""];
	}
	return [`**${title}:** ${rendered.join(", ")}`, ""];
}

function renderInvestigationBlock(run) {
	// Compact log: role, result in one line, model, times. Headings must
	// still contain the role name and a FAILED sentinel the tests pin.
	const lines = [];
	const heading = run.failed
		? `### ${run.role} - ${run.status} (INCOMPLETE)`
		: `### ${run.role} - ${run.status}`;
	lines.push(heading, "");
	lines.push(
		`- model ${run.modelId || EMPTY} · attempt ${run.attempt} · ${run.startedAt} → ${run.completedAt}`,
	);
	if (run.failed) {
		lines.push(`- **Error:** ${run.error || "no error message was recorded"}`);
		lines.push(
			"> This run failed. It did not complete its investigation, so its silence is not an answer and nothing is credited to it.",
		);
	}
	return lines;
}

function renderFindingBlock(finding, entry) {
	const sources = entry && Array.isArray(entry.sources) ? entry.sources : ["?"];
	const tag = entry && entry.source?.failed ? " (failed run's finding)" : "";
	const note = finding.demoted
		? " (demoted to speculative: no evidence reference)"
		: finding.unverifiedReferences.length > 0
			? " (demoted to speculative: cite evidence that does not resolve in this repo)"
			: "";
	const lines = [];
	lines.push(`**${finding.confidence}${tag}${note}**`);
	lines.push(
		`- **Severity:** ${severityOf({ confidence: finding.confidence, detail: finding.detail })}`,
	);
	if (finding.evidence.length === 0) {
		lines.push("**Evidence:** none recorded - an unevidenced claim cannot be confirmed", "");
	} else {
		lines.push("**Evidence:**");
		for (const entry of finding.evidence) {
			lines.push(`- ${renderEvidenceEntry(entry)}`);
		}
		lines.push("");
	}
	lines.push(`**Reported by:** ${[...sources].sort().join(", ")}`);
	// Keep the source role substring for back-compat with consumers.
	lines.push(
		`**Source role:** ${[...sources].sort((a, b) => ROLE_ORDER.indexOf(a) - ROLE_ORDER.indexOf(b))[0]}`,
	);
	return lines;
}

/**
 * The detail of a finding, as one list item. A multi-line detail keeps its
 * line breaks and stays inside the item.
 */
function renderNextSteps(grouped, failedRuns) {
	// Synthesized: one line per action, no restating of the finding text.
	// The investigation runtime is read-only - no action was taken by it.
	const lines = [];
	lines.push(
		"_Everything in this section is a recommendation. The investigation runtime is read-only: no code change, configuration change, deployment, or data change was made by this investigation._",
		"",
	);
	const { confirmed, probable, speculative } = grouped;
	if (confirmed.length > 0) {
		lines.push(
			`- **Action (${confirmed.length} confirmed):** section 5's confirmed findings are defects in your own codebase, not speculation. Have the owning team decide which to fix; every one of them cites the exact file and line.`,
		);
	}
	if (probable.length > 0) {
		lines.push(
			`- **Verify (${probable.length} probable):** probable findings cite supporting code but no second source; confirm at one of the cited lines before acting.`,
		);
	}
	if (speculative.length > 0) {
		lines.push(
			`- **Gather evidence (${speculative.length} speculative):** no evidence reference or the file does not resolve; treat as hints, not facts, until you confirm.`,
		);
	}
	for (const run of failedRuns) {
		lines.push(
			`- **Re-run the failed ${run.role} run:** it did not complete (${run.error || "no error message was recorded"}). Its questions are still open.`,
		);
	}
	if (confirmed.length + probable.length + speculative.length + failedRuns.length === 0) {
		lines.push("_No findings produced; no action required._");
	}
	lines.push("");
	return lines;
}

function renderMetadataSection(row) {
	const {
		id,
		subject,
		status,
		created_at,
		updated_at,
		user_id,
		ticket_id,
		summary,
		escalated,
		report_status,
		report_delivered_at,
		retain,
	} = row;
	return [
		"## 1. Case metadata",
		"",
		"| Field | Value |",
		"|---|---|",
		`| Case ID | ${tableCell(id) || EMPTY} |`,
		`| Subject | ${tableCell(subject) || EMPTY} |`,
		`| Status | ${tableCell(status) || EMPTY} |`,
		`| Created | ${tableCell(formatTimestamp(created_at))} |`,
		`| Updated | ${tableCell(formatTimestamp(updated_at))} |`,
		`| User | ${tableCell(user_id) || EMPTY} |`,
		`| Ticket | ${tableCell(ticket_id) || EMPTY} |`,
		`| Confirmed summary | ${tableCell(summary) || EMPTY} |`,
		`| Escalated | ${escalated ? "yes" : "no"} |`,
		`| Report status | ${tableCell(report_status) || EMPTY} |`,
		`| Report delivered at | ${tableCell(formatTimestamp(report_delivered_at))} |`,
		`| Evidence retained | ${retain ? "yes" : "no"} |`,
		"",
	];
}

function renderComplaintSection(messages) {
	const lines = ["## 2. Original complaint", ""];
	const complaint = messages.find((message) =>
		CLIENT_ROLES.has(singleLine(message.role).toLowerCase()),
	);
	if (complaint) {
		const { role, kind, content, created_at } = complaint;
		lines.push(
			`_First ${singleLine(role) || "client"} message, kind ${singleLine(kind) || "answer"}, logged ${formatTimestamp(created_at)}._`,
			"",
		);
		lines.push(text(content) || "_empty_", "");
	} else {
		lines.push("_No client message was recorded for this case._", "");
	}
	return lines;
}

function renderConversationSection(messages) {
	const lines = ["## 3. Conversation log", ""];
	if (messages.length === 0) {
		lines.push("_No messages were recorded for this case._", "");
		return lines;
	}
	messages.forEach((message, index) => {
		const { role, kind, agent, content, created_at } = message;
		const header = [
			`### ${index + 1}. ${singleLine(role) || "unknown"} - ${singleLine(kind) || "answer"}`,
		];
		if (text(agent) !== "") {
			header.push(` (agent: ${text(agent)})`);
		}
		header.push(` - ${formatTimestamp(created_at)}`);
		lines.push(header.join(""), "", text(content) || "_empty_", "");
	});
	return lines;
}

function renderInvestigationsSection(runs) {
	const lines = ["## 4. Investigation log", ""];
	if (runs.length === 0) {
		lines.push("_No investigation runs were recorded for this case._", "");
		return lines;
	}
	for (const run of runs) {
		lines.push(...renderInvestigationBlock(run));
	}
	return lines;
}

function renderConfidenceGroup(lines, level, grouped) {
	const entries = grouped[level];
	lines.push(
		`### ${level.charAt(0).toUpperCase()}${level.slice(1)} findings (${entries.length})`,
		"",
	);
	if (entries.length === 0) {
		lines.push("_None._", "");
		return;
	}
	entries.forEach((entry, index) => {
		lines.push(`#### ${index + 1}. ${singleLine(entry.finding.detail)}`, "");
		lines.push(...renderFindingBlock(entry.finding, entry), "");
	});
}

function collectLimitations(runs) {
	const seen = new Set();
	const out = [];
	for (const run of runs) {
		for (const limitation of asArray(run.limitations)) {
			const value = singleLine(describeValue(limitation));
			if (value.length < 8) {
				continue;
			}
			const key = value.toLowerCase().replace(/\s+/gu, " ").trim();
			if (seen.has(key)) {
				continue;
			}
			seen.add(key);
			out.push(`- [${run.role}] ${value}`);
			if (out.length >= 5) {
				return out;
			}
		}
	}
	return out;
}

function renderFindingsSection(grouped, runs) {
	const lines = ["## 5. Findings", ""];
	lines.push(
		"_Every finding is grouped by confidence: **confirmed**, **probable**, or **speculative**. A finding without an evidence reference is reported as speculative, and so is one whose cited evidence file does not resolve inside the repository; the pipeline has no path that promotes an unevidenced claim._",
		"",
	);
	for (const level of CONFIDENCE_LEVELS) {
		renderConfidenceGroup(lines, level, grouped);
	}
	const limitationLines = collectLimitations(runs);
	lines.push("### Limitations", "");
	if (limitationLines.length === 0) {
		lines.push("_None recorded._", "");
	} else {
		lines.push(...limitationLines, "");
	}
	return lines;
}

/**
 * Build the Sources section: everything the investigator consulted.
 *
 * Every file the investigator read, every commit it referenced, every search
 * query it ran. The audit wants sources visible even when evidence is thin;
 * an untouched list shows the investigator never opened any file.
 *
 * @param {Object[]} runs
 * @returns {string[]}
 */
function collectEvidenceRefs(run, sink) {
	for (const finding of run.findings) {
		for (const evidence of finding.evidence || []) {
			if (evidence.url) sink.urls.add(evidence.url);
			if (evidence.file) sink.files.add(evidence.file);
		}
	}
}

function collectSourceSets(runs) {
	const sink = { files: new Set(), commits: new Set(), queries: new Set(), urls: new Set() };
	for (const run of runs) {
		for (const file of run.files) sink.files.add(file);
		for (const commit of run.commits) sink.commits.add(commit);
		for (const query of run.queries) sink.queries.add(query);
		collectEvidenceRefs(run, sink);
	}
	return sink;
}

function renderSourcesSection(runs) {
	const lines = ["## 7. Sources", ""];
	lines.push(
		"_Every file the investigator read, every commit it referenced, and every search query it ran._",
		"",
	);
	const { files, commits, queries, urls } = collectSourceSets(runs);
	if (files.size === 0 && commits.size === 0 && queries.size === 0 && urls.size === 0) {
		lines.push("_None recorded. The investigator did not read any evidence files._", "");
		return lines;
	}
	if (files.size > 0) {
		lines.push(
			"### Files read",
			"",
			[...files]
				.sort()
				.map((f) => `\`${f}\``)
				.join(" · "),
			"",
		);
	}
	if (commits.size > 0) {
		lines.push("### Commits referenced", "");
		for (const c of [...commits].sort()) {
			lines.push(`- ${c}`);
		}
		lines.push("");
	}
	if (queries.size > 0) {
		lines.push("### Search queries", "");
		for (const q of [...queries].sort()) {
			lines.push(`- ${q}`);
		}
		lines.push("");
	}
	if (urls.size > 0) {
		lines.push("### Web sources", "");
		for (const u of [...urls].sort()) {
			lines.push(`- ${u}`);
		}
		lines.push("");
	}
	return lines;
}

function renderAuditSection(row, runs, grouped, generated) {
	const { id, report_status, report_delivered_at, escalated } = row;
	const failedRuns = runs.filter((run) => run.failed);
	const toolCalls = runs.reduce(
		(sum, run) => sum + (Array.isArray(run.toolLog) ? run.toolLog.length : 0),
		0,
	);
	const failedCalls = runs.reduce(
		(sum, run) =>
			sum +
			(Array.isArray(run.toolLog)
				? run.toolLog.filter((call) => call.status === "error").length
				: 0),
		0,
	);
	const reruns = runs.reduce((sum, run) => sum + (Number(run.attempt) > 1 ? 1 : 0), 0);
	const findingCount =
		grouped.confirmed.length + grouped.probable.length + grouped.speculative.length;
	return [
		"## 8. Audit and delivery",
		"",
		"### Audit events",
		"",
		`- **Investigation runs shown:** ${runs.length} (${runs.length - failedRuns.length} completed, ${failedRuns.length} failed)`,
		`- **Total tool calls:** ${toolCalls}`,
		`- **Failed tool calls:** ${failedCalls}`,
		`- **Reruns requested:** ${reruns}`,
		`- **Findings rendered:** ${findingCount}`,
		`- **Report generated:** ${generated}`,
		"",
		"### Delivery status",
		"",
		`- **Report status:** ${text(report_status) || "not recorded yet"}`,
		`- **Delivered at:** ${report_delivered_at ? formatTimestamp(report_delivered_at) : "not delivered"}`,
		`- **Escalated:** ${escalated ? "yes" : "no"}`,
		"",
	];
}

/**
 * The identity of a finding.
 *
 * The same claim, with the same confidence and the same evidence, is ONE
 * finding however many runs report it.
 *
 * @param {Object} finding A normalized finding.
 * @returns {string}
 */
function findingKey(finding) {
	return JSON.stringify([
		finding.detail,
		finding.confidence,
		(finding.evidence || []).map((entry) => [entry.file, entry.lines, entry.commit, entry.url]),
	]);
}

/**
 * Build the Markdown report for one support case.
 *
 * @param {Object} params
 * @param {Object} [params.caseRow] A `SupportCase` row.
 * @param {Object[]} [params.messages] `SupportCaseMessage` rows, any order.
 * @param {Object[]} [params.investigations] `SupportInvestigation` rows, any order.
 * @param {Date|string} [params.generatedAt] Override the generation time.
 * @returns {string} The Markdown report.
 */
/** Cross-role dedup: the same claim worded by five investigators counts ONCE.
 *
 * The five roles look at the problem from different angles and paraphrase each
 * other. A pure word-overlap test cannot separate "setup needs a password"
 * from "sign-in does not need a password" (the paraphrases share nearly every
 * token), so a merge requires either a shared evidence location plus light
 * token support, or strong token overlap on its own. */
const STOP_WORDS = new Set([
	"the",
	"this",
	"that",
	"with",
	"from",
	"are",
	"have",
	"been",
	"will",
	"when",
	"where",
	"which",
	"their",
	"there",
	"because",
	"into",
	"also",
	"than",
	"then",
	"should",
	"would",
	"could",
	"must",
	"only",
	"such",
	"very",
	"more",
	"what",
	"some",
	"here",
	"still",
	"after",
	"before",
	"less",
	"seen",
	"each",
	"even",
	"does",
	"same",
	"since",
	"says",
	"said",
	"away",
	// Domain terms that every finding in this problem space repeats.
	"login",
	"passkey",
	"password",
	"page",
	"sign",
]);
// One shared evidence location plus a light token floor is not enough (two
// facts about the same file paraphrase too alike) - a merge needs either
// two shared evidence locations and moderate token support, or strong
// token overlap on its own.
const DOMAIN_TOKEN_MIN = 0.3;
const SHARED_EVIDENCE_MERGE = 2;
const TOKEN_MERGE = 0.5;

function tokenKey(text) {
	const words = String(text)
		.toLowerCase()
		.replace(/[^a-z0-9 ]/gu, " ")
		.split(/\s+/u)
		.filter((w) => w.length > 2 && !STOP_WORDS.has(w));
	return new Set(words);
}

function overlap(a, b) {
	if (a.size === 0 || b.size === 0) {
		return 0;
	}
	let hit = 0;
	for (const t of a) {
		if (b.has(t)) hit += 1;
	}
	return hit / Math.min(a.size, b.size);
}

function evidenceRanges(finding) {
	const out = [];
	for (const entry of finding.evidence || []) {
		const file = text(entry.file).toLowerCase();
		if (file === "") {
			continue;
		}
		const match = String(entry.lines ?? "").match(/(\d+)[^0-9]{0,4}(\d+)/u);
		out.push({
			file,
			start: match ? Number(match[1]) : null,
			end: match ? Number(match[2]) : null,
			key: String(entry.lines ?? "")
				.replace(/\s+/gu, " ")
				.trim(),
		});
	}
	return out;
}

function evidenceOverlapPair(x, y) {
	if (x.file !== y.file) {
		return false;
	}
	if (x.start !== null && y.start !== null) {
		return Math.max(x.start, y.start) <= Math.min(x.end, y.end);
	}
	return x.key !== "" && x.key === y.key;
}

function evidenceOverlapCount(a, b) {
	let shared = 0;
	const seen = new Set();
	for (const x of evidenceRanges(a.finding)) {
		for (const y of evidenceRanges(b.finding)) {
			if (!evidenceOverlapPair(x, y)) {
				continue;
			}
			const sig = `${x.file}:${x.key}:${x.start}:${x.end}|${y.key}:${y.start}:${y.end}`;
			if (!seen.has(sig)) {
				seen.add(sig);
				shared += 1;
			}
		}
	}
	return shared;
}

function findingsDuplicate(a, b) {
	const tokOv = overlap(a.tok, b.tok);
	if (tokOv >= TOKEN_MERGE) {
		return true;
	}
	return evidenceOverlapCount(a, b) >= SHARED_EVIDENCE_MERGE && tokOv >= DOMAIN_TOKEN_MIN;
}

function mergeEvidenceInto(keep, extra) {
	const seen = new Set(keep.evidence.map((e) => `${e.file}::${e.lines}`));
	for (const ev of extra.evidence || []) {
		const key = `${ev.file}::${ev.lines}`;
		if (!seen.has(key)) {
			seen.add(key);
			keep.evidence.push(ev);
		}
	}
}

function dedupeFindings(entries) {
	const groups = [];
	for (const entry of entries) {
		const tok = tokenKey(entry.finding.detail);
		const item = { ...entry, tok };
		const joined = [];
		for (let i = groups.length - 1; i >= 0; i--) {
			if (groups[i].some((member) => findingsDuplicate(member, item))) {
				joined.unshift(...groups.splice(i, 1)[0]);
			}
		}
		joined.push(item);
		groups.push(joined);
	}
	return groups.map((members) => {
		const sourceOrder = (role) => {
			const index = ROLE_ORDER.indexOf(role);
			return index === -1 ? ROLE_ORDER.length : index;
		};
		members.sort((a, b) => sourceOrder(a.source.role) - sourceOrder(b.source.role));
		const survivor = members.reduce((best, member) =>
			(member.finding.evidence || []).length > (best.finding.evidence || []).length ? member : best,
		);
		const finding = { ...survivor.finding, evidence: [...survivor.finding.evidence] };
		for (const member of members) {
			if (member !== survivor) {
				mergeEvidenceInto(finding, member.finding);
			}
		}
		const sources = [...new Set(members.map((member) => member.source.role))].sort(
			(a, b) => sourceOrder(a) - sourceOrder(b),
		);
		return { finding, source: survivor.source, sources };
	});
}

export function buildReport({ caseRow, messages, investigations, generatedAt } = {}) {
	const row = caseRow && typeof caseRow === "object" ? caseRow : {};
	const messageRows = orderMessages(messages);
	const runs = orderInvestigations(investigations).map(readInvestigation);
	const failedRuns = runs.filter((run) => run.failed);
	const generated = formatTimestamp(generatedAt ?? new Date());

	const grouped = { confirmed: [], probable: [], speculative: [] };
	// The verify run holds the FINAL set of findings - every specialist
	// finding with the verification applied - and each specialist run holds
	// its own copy of the findings it produced. The same finding therefore
	// arrives twice, and counting it twice would report twice as many
	// findings as the investigation produced.
	//
	// Each finding is counted ONCE, under the run that first reported it:
	// the specialist that found it, not the verifier that checked it.
	const counted = new Set();
	const rawFindings = [];
	for (const run of runs) {
		for (const finding of run.findings) {
			const key = findingKey(finding);
			if (counted.has(key)) {
				continue;
			}
			counted.add(key);
			rawFindings.push({ finding, source: run });
		}
	}
	const deduped = dedupeFindings(rawFindings);
	for (const entry of deduped) {
		grouped[entry.finding.confidence].push(entry);
	}

	const lines = [];
	lines.push("# Support investigation report", "");
	lines.push(`- **Case:** ${text(row.id) || EMPTY}`);
	lines.push(`- **Generated:** ${generated}`);
	lines.push(`- **Status:** ${text(row.status) || EMPTY}`);
	lines.push("");

	if (failedRuns.length > 0) {
		const failedRoles = failedRuns.map((run) => run.role).join(", ");
		lines.push(
			`> **This report is INCOMPLETE.** ${failedRuns.length} of ${runs.length} investigation run(s) failed (${failedRoles}). A failed run is not a clean result: it did not look for anything, so its silence is not an answer. See section 4.`,
			"",
		);
	}

	// Executive summary: three lines a non-technical owner can read in Gmail.
	// It sits above the detail so "what's broken / how bad / what first" is
	// visible without scrolling to the findings.
	const confirmed = grouped.confirmed;
	const severities = confirmed.map((entry) =>
		severityOf({ confidence: "confirmed", detail: entry.finding.detail }),
	);
	const criticalCount = severities.filter((s) => s === "critical").length;
	const highCount = severities.filter((s) => s === "high").length;
	const firstFinding = confirmed[0] || grouped.probable[0] || grouped.speculative[0];
	lines.push("## Executive summary", "");
	lines.push(
		`- **What's broken:** ${confirmed.length > 0 ? singleLine(firstFinding.finding.detail).slice(0, 200) : "No confirmed defect was found; see the findings below."}`,
	);
	lines.push(
		`- **How bad:** ${confirmed.length} confirmed finding${confirmed.length === 1 ? "" : "s"} (${criticalCount} critical, ${highCount} high), ${grouped.probable.length} probable, ${grouped.speculative.length} speculative.`,
	);
	lines.push(
		`- **What to do first:** ${criticalCount > 0 ? "Fix the critical finding(s) before the next release." : highCount > 0 ? "Review the high-severity finding(s) with the owning team." : "Review the confirmed findings with the owning team."}`,
		"",
	);

	// Developer attention: the cases the owner must actually act on. A failed
	// run, a critical/high finding or an escalation are the things that need a
	// human; a clean report says so explicitly instead of leaving the owner to
	// guess whether anything is waiting on them.
	const attention = [];
	if (failedRuns.length > 0) {
		attention.push(
			`${failedRuns.length} investigation run(s) failed — the case is incomplete and may need a re-run.`,
		);
	}
	if (criticalCount > 0 || highCount > 0) {
		attention.push(
			`${criticalCount} critical and ${highCount} high severity confirmed finding(s) need review.`,
		);
	}
	if (row?.escalated === true) {
		attention.push("The case was escalated (security or data-loss finding confirmed).");
	}
	lines.push("## Developer attention required", "");
	if (attention.length > 0) {
		for (const item of attention) {
			lines.push(`- ${item}`);
		}
	} else {
		lines.push(
			"- No immediate action needed. Review the findings and recommended next steps below.",
		);
	}
	lines.push("");

	lines.push(...renderMetadataSection(row));
	lines.push(...renderComplaintSection(messageRows));
	lines.push(...renderConversationSection(messageRows));
	lines.push(...renderInvestigationsSection(runs));
	lines.push(...renderFindingsSection(grouped, runs));
	lines.push("## 6. Recommended next steps", "");
	lines.push(...renderNextSteps(grouped, failedRuns));
	lines.push(...renderSourcesSection(runs));
	lines.push(...renderAuditSection(row, runs, grouped, generated));

	return lines.join("\n");
}
