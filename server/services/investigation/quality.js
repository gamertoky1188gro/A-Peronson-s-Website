/**
 * Case-quality evaluator.
 *
 * A separate check before finalization. It evaluates the case itself — not
 * the model's confidence in itself — against seven questions and returns one
 * of three verdicts: `ready`, `needs_more_discussion`, or
 * `needs_more_investigation`, with the reasons. It never invents completeness
 * and never certifies a finding without evidence.
 *
 * The verdict gates finalization. The caller keeps the case open when it is
 * not ready, so the original problem is adequately discussed and investigated
 * before the report is delivered and the case completed.
 */

export const QUALITY_CHECKS = [
	"problem_clarity",
	"discussion_completeness",
	"investigation_completeness",
	"evidence_quality",
	"unresolved_questions",
	"report_quality",
	"email_readiness",
];

export const QUALITY_CONTRACT = [
	"Reply with a single JSON object and nothing else: {status, reasons, checks}.",
	"status is one of: ready, needs_more_discussion, needs_more_investigation.",
	"reasons is an array of short, plain-language strings explaining the verdict (empty only when status is ready).",
	`checks is an object with exactly these keys, each "ok" or "needs_work": ${QUALITY_CHECKS.join(", ")}.`,
	"Judge the case against the questions below. Do not claim a check is ok without evidence in the case. Never certify a finding you cannot support.",
].join(" ");

/**
 * Build the evaluator prompt from the case itself.
 *
 * All client-supplied text is fenced and labelled untrusted. The report draft
 * is included only so the evaluator can judge report quality — it is not
 * treated as authority for any finding.
 */
export function buildQualityPrompt({
	subject,
	summary,
	brief,
	conversation,
	findings,
	limitations,
} = {}) {
	const briefText = brief?.fields
		? Object.entries(brief.fields)
				.map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
				.join("\n")
		: "(no structured brief)";
	return [
		"Evaluate the quality of this support investigation case before its report is finalized.",
		`CASE SUBJECT: ${String(subject || "")}`,
		`CONFIRMED SUMMARY: ${String(summary || "")}`,
		`STRUCTURED PROBLEM BRIEF:\n${briefText}`,
		`CONVERSATION:\n${String(conversation || "")}`,
		`FINDINGS:\n${JSON.stringify(Array.isArray(findings) ? findings : [], null, 2)}`,
		`LIMITATIONS:\n${JSON.stringify(Array.isArray(limitations) ? limitations : [], null, 2)}`,
		"",
		"CHECKS TO EVALUATE:",
		"- problem_clarity: is the actual problem understood (expected vs actual, affected page)?",
		"- discussion_completeness: have the buyer's questions been addressed?",
		"- investigation_completeness: were the necessary investigations performed?",
		"- evidence_quality: are important findings supported by evidence?",
		"- unresolved_questions: is anything still unanswered?",
		"- report_quality: does the report accurately represent the case?",
		"- email_readiness: is the final report ready for delivery?",
		"",
		QUALITY_CONTRACT,
	].join("\n\n");
}

/** Normalize a model answer into a safe verdict. Never throws. */
export function normalizeQualityVerdict(raw, attempts = 1) {
	const checkedAt = new Date().toISOString();
	const fallback = {
		status: "needs_more_investigation",
		reasons: ["The quality evaluator did not return a usable verdict."],
		checks: {},
		checkedAt,
		attempts,
	};
	let parsed = raw;
	if (typeof raw === "string") {
		try {
			parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/iu, "").replace(/\s*```$/u, ""));
		} catch {
			return fallback;
		}
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
		return fallback;
	}
	const status = ["ready", "needs_more_discussion", "needs_more_investigation"].includes(
		String(parsed.status || ""),
	)
		? String(parsed.status)
		: fallback.status;
	const reasons = Array.isArray(parsed.reasons)
		? parsed.reasons
				.map((entry) =>
					String(entry || "")
						.trim()
						.slice(0, 240),
				)
				.filter(Boolean)
				.slice(0, 8)
		: [];
	const checks = {};
	if (parsed.checks && typeof parsed.checks === "object") {
		for (const key of QUALITY_CHECKS) {
			const value = String(parsed.checks[key] || "");
			if (value === "ok" || value === "needs_work") {
				checks[key] = value;
			}
		}
	}
	return {
		status,
		reasons: status === "ready" ? [] : reasons.length > 0 ? reasons : fallback.reasons,
		checks,
		checkedAt,
		attempts,
	};
}
