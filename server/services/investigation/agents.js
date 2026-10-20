/**
 * The five read-only investigation agents, their prompts, and the verification
 * helpers.
 *
 * Every agent is the same machine with a different question. The runtime gives
 * each one its own session (contracts.md §6, one session per role, never the
 * model's own `task` delegation); this file gives each one a prompt that names
 * the question, the case, the evidence, and the shape of the answer.
 *
 * Two invariants live here, and both are load-bearing:
 *
 *  - A prompt never asks for something the runtime denies the agent. The
 *    runtime configuration (server/services/investigation/runtimeConfig.js)
 *    denies `edit`, `bash`, `webfetch`, `websearch`, `question` and `task`, so
 *    a prompt that asks for "the git log" or "the upstream issue" is asking
 *    for something the agent cannot do, and whatever it invents instead is
 *    worse than an honest limitation. Every prompt therefore asks only for
 *    what the read tools can produce, and says so in `limitations` when the
 *    rest is out of reach.
 *  - A claim without evidence cannot survive the pipeline. `applyVerification`
 *    demotes a refuted finding, and demotes any finding with an empty evidence
 *    array, whatever the verifier said about it.
 */

/** The five roles, in the order the investigation runs them. */
export const AGENT_ROLES = ["lead", "code", "repo", "research", "verify"];

/**
 * The exact answer format every agent must reply with.
 *
 * The string is part of the contract with the parser
 * (server/services/investigation/findings.js), so it is exported verbatim and
 * every prompt ends with it, character for character.
 */
export const JSON_CONTRACT =
	"Reply with a single JSON object and nothing else: {summary, findings:[{confidence, detail, evidence:[{file, lines, commit, url}]}], limitations}. confidence is one of confirmed, probable, speculative.";

const CONFIDENCE_VALUES = ["confirmed", "probable", "speculative"];

/** The question each role exists to answer (design spec §9.2). */
const ROLE_QUESTIONS = {
	lead: "What is actually being asked? Frame the investigation and say what a correct answer has to establish.",
	code: "Where in the code does this live? Trace the path that produces the behaviour in question.",
	repo: "Did this break recently? Look for what changed, and when.",
	research:
		"Is there external context - library behaviour, configuration, documentation - that explains this?",
	verify: "Do the candidate findings actually hold? Try to refute them.",
};

const ROLE_GUIDANCE = {
	lead: [
		"- Read the repository and the supplied evidence before you answer.",
		"- Frame the investigation: what is actually being asked, which parts of the system are involved, and what would have to be true for the reported symptom to happen.",
		"- Ground every claim in a file you actually opened, and cite the file, the line range and the commit.",
		'- Never invent a path, a line number or a commit hash. If you cannot substantiate something, put it in `limitations` and use confidence "speculative".',
	],
	code: [
		"- Trace the path end to end: the route, the controller, the service and the storage it touches.",
		"- Read the files you cite. A filename you have not opened is not evidence.",
		"- Cite the file, the line range and the commit for every finding.",
		'- Never invent a path, a line number or a commit hash. If you cannot substantiate something, put it in `limitations` and use confidence "speculative".',
	],
	repo: [
		"- Look for evidence of a recent change in the repository: changelogs and release notes, migration history, the commit references cited in the code, and the comments that describe when behaviour changed.",
		"- You cannot run git commands and you cannot reach the network. If the change history is not readable to you, say so in `limitations` instead of guessing at it.",
		"- Name the commit that introduced or changed the behaviour when a file cites one.",
		'- Never invent a path, a line number or a commit hash. If you cannot substantiate something, put it in `limitations` and use confidence "speculative".',
	],
	research: [
		"- Look for external context inside the repository: dependency versions in the manifests and lockfiles, vendored or bundled library code, and the documentation or comments that describe the behaviour in question.",
		"- You have no network access in this investigation. Do not claim to have read an upstream issue, a changelog or a specification you could not open.",
		"- Cite the file, the line range and the commit for every finding.",
		'- Never invent a path, a line number or a commit hash. If you cannot substantiate something, put it in `limitations` and use confidence "speculative".',
	],
	verify: [
		"- Try to REFUTE each candidate finding. Open the cited files yourself and look for the code that contradicts the claim.",
		"- A candidate finding you cannot refute stands as it is. Do not downgrade it and do not repeat it as your own finding.",
		'- To report a candidate you refute, include a finding whose `detail` is that candidate\'s exact `detail` string, with confidence "speculative" and the evidence that contradicts it.',
		"- To report a candidate whose cited evidence you could not locate at all, include that candidate's exact `detail` string as a single entry of `limitations`, with no other text on that entry.",
		'- Never invent a path, a line number or a commit hash. If you cannot substantiate something, put it in `limitations` and use confidence "speculative".',
	],
};

const READ_ONLY_RULES = [
	"READ-ONLY RULES:",
	"You are READ-ONLY. You must not modify, create, write, move, rename or delete any file, you must not run shell commands, and you must not delegate to another agent. Use only the read tools available to you (read, glob, grep, list). Nothing you produce is written back to the repository, and no attempt to write will succeed.",
].join("\n");

/**
 * Build the prompt for one investigation role.
 *
 * @param {string} role One of AGENT_ROLES. An unknown role throws: a typo must
 *   not silently fall back to the lead prompt.
 * @param {{ description?: string, evidence?: unknown[] }} context The case
 *   description and the evidence collected with it. `evidence` is a list of
 *   strings; evidence objects (`{file, lines, commit, url}`) are accepted too
 *   and are rendered for reading.
 * @returns {string} The prompt, ending with the JSON contract.
 */
export function buildAgentPrompt(role, context = {}) {
	const key = normalizeRole(role);
	return composePrompt({
		role: key,
		description: toText(context?.description),
		evidence: toEvidenceList(context?.evidence),
		// The verify role always states its candidate list, so a caller that
		// reaches it through this entry point gets an honest "none supplied"
		// rather than a prompt that talks about findings it cannot see.
		candidates: key === "verify" ? [] : null,
	});
}

/**
 * Build the prompt for the verification pass.
 *
 * The prompt must carry every candidate finding, because the agent refutes
 * findings by detail string: a candidate the agent cannot see cannot be
 * refuted, and a candidate the agent cannot refute for lack of seeing is
 * indistinguishable from one that holds.
 *
 * @param {{ description?: string, candidateFindings?: unknown[] }} context The
 *   case description and the findings the specialists produced.
 * @returns {string} The prompt, ending with the JSON contract.
 */
export function buildVerifyPrompt(context = {}) {
	const candidates = normalizeCandidates(context?.candidateFindings);
	const evidence = toEvidenceList(candidates.flatMap((candidate) => candidate.evidence));
	return composePrompt({
		role: "verify",
		description: toText(context?.description),
		evidence,
		candidates,
	});
}

/**
 * Apply the verification outcome to the candidate findings.
 *
 * Two demotions, and only two:
 *  - a finding the verifier refuted becomes `speculative`;
 *  - a finding with an empty evidence array becomes `speculative`, whatever
 *    the verifier said about it. There is no path that promotes an unevidenced
 *    claim.
 *
 * A candidate the verifier could not refute keeps its confidence.
 *
 * @param {unknown[]} candidateFindings The findings under verification.
 * @param {{ refuted?: string[], unsupported?: string[] } | null} verification
 *   The verifier's verdict. The strings are findings' `detail` values.
 * @returns {{ findings: object[], refuted: string[] }} The adjusted findings,
 *   each exactly `{ confidence, detail, evidence }`, and the details that were
 *   actually refuted.
 */
export function applyVerification(candidateFindings, verification) {
	const candidates = Array.isArray(candidateFindings) ? candidateFindings : [];
	const refutedDetails = new Set(toStringList(verification?.refuted));
	const refuted = [];
	const seenRefuted = new Set();

	const findings = candidates.map((candidate) => {
		const detail = toText(candidate?.detail);
		const evidence = Array.isArray(candidate?.evidence) ? candidate.evidence : [];
		const isRefuted = refutedDetails.has(detail.trim());
		if (isRefuted && !seenRefuted.has(detail)) {
			seenRefuted.add(detail);
			refuted.push(detail);
		}
		const confidence =
			isRefuted || evidence.length === 0 ? "speculative" : coerceConfidence(candidate?.confidence);
		return { confidence, detail, evidence };
	});

	return { findings, refuted };
}

/**
 * Assemble a prompt. The JSON contract is the last section, so the prompt
 * ends with it exactly.
 */
function composePrompt({ role, description, evidence, candidates }) {
	const sections = [
		`You are the ${role} investigator in a support investigation.`,
		`Your question: ${ROLE_QUESTIONS[role]}`,
		`Case description:\n${description || "(no case description was supplied)"}`,
	];
	if (candidates) {
		sections.push(renderCandidateSection(candidates));
	}
	sections.push(
		`Evidence supplied with this case:\n${renderBulletList(evidence, "(no evidence was supplied with this case)")}`,
	);
	sections.push(`How to work:\n${ROLE_GUIDANCE[role].join("\n")}`);
	sections.push(READ_ONLY_RULES);
	sections.push(JSON_CONTRACT);
	return sections.join("\n\n");
}

function renderCandidateSection(candidates) {
	const header = `Candidate findings to refute (${candidates.length}):`;
	if (candidates.length === 0) {
		return `${header}\n- (no candidate findings were supplied)`;
	}
	const rendered = candidates.map((candidate, index) => {
		const evidence = toEvidenceList(candidate.evidence);
		const lines =
			evidence.length > 0
				? evidence.map((entry) => `   evidence: ${entry}`).join("\n")
				: "   evidence: (none cited)";
		return `${index + 1}. confidence: ${candidate.confidence}\n   detail: ${candidate.detail || "(no detail)"}\n${lines}`;
	});
	return `${header}\n${rendered.join("\n")}`;
}

function renderBulletList(items, emptyText) {
	if (items.length === 0) {
		return `- ${emptyText}`;
	}
	return items.map((item) => `- ${item}`).join("\n");
}

function normalizeRole(role) {
	const key = typeof role === "string" ? role.trim().toLowerCase() : "";
	if (!AGENT_ROLES.includes(key)) {
		throw new Error(
			`Unknown investigation agent role "${String(role)}". Expected one of: ${AGENT_ROLES.join(", ")}.`,
		);
	}
	return key;
}

function normalizeCandidates(value) {
	if (!Array.isArray(value)) {
		return [];
	}
	return value
		.filter((candidate) => candidate && typeof candidate === "object")
		.map((candidate) => ({
			confidence: coerceConfidence(candidate.confidence),
			detail: toText(candidate.detail),
			evidence: Array.isArray(candidate.evidence) ? candidate.evidence : [],
		}));
}

/**
 * Coerce a confidence to one of the three allowed values. Anything else -
 * including a missing value - is `speculative`.
 */
function coerceConfidence(value) {
	const key = typeof value === "string" ? value.trim().toLowerCase() : "";
	return CONFIDENCE_VALUES.includes(key) ? key : "speculative";
}

/**
 * Render one evidence entry. A string is used as it stands; an evidence object
 * (`{file, lines, commit, url}`) is rendered as a readable reference.
 */
function renderEvidenceEntry(entry) {
	if (typeof entry === "string") {
		return entry.trim() ? entry : "";
	}
	if (typeof entry === "number" || typeof entry === "boolean") {
		return String(entry);
	}
	if (!entry || typeof entry !== "object") {
		return "";
	}
	const parts = [];
	const file = toText(entry.file);
	const lines = toText(entry.lines);
	const commit = toText(entry.commit);
	const url = toText(entry.url);
	if (file) {
		parts.push(file);
	}
	if (lines) {
		parts.push(`(lines ${lines})`);
	}
	if (commit) {
		parts.push(`@${commit}`);
	}
	if (url) {
		parts.push(url);
	}
	return parts.join(" ");
}

function toEvidenceList(value) {
	if (!Array.isArray(value)) {
		return [];
	}
	const rendered = [];
	for (const entry of value) {
		const text = renderEvidenceEntry(entry);
		if (text) {
			rendered.push(text);
		}
	}
	return rendered;
}

function toStringList(value) {
	if (!Array.isArray(value)) {
		return [];
	}
	return value
		.filter((entry) => typeof entry === "string" && entry.trim())
		.map((entry) => entry.trim());
}

function toText(value) {
	return typeof value === "string" ? value : "";
}
