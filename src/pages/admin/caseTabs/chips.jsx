// Shared glass chips for the owner case console: priority, investigation
// status, email report status and finding confidence. One look, one place -
// the inbox table and the detail tabs both render them.

export const SUPPORT_CASE_CONFIDENCE_CLASS = {
	confirmed: "border border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
	probable: "border border-amber-400/30 bg-amber-500/15 text-amber-300",
	speculative: "border border-slate-400/30 bg-slate-500/15 text-slate-300",
};

const BASE =
	"inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]";

const PRIORITY_CLASS = {
	low: "border-slate-400/30 bg-slate-500/15 text-slate-300",
	normal: "border-sky-400/30 bg-sky-500/15 text-sky-300",
	high: "border-amber-400/30 bg-amber-500/15 text-amber-300",
	urgent: "border-rose-400/30 bg-rose-500/15 text-rose-300",
};

/** Priority chip. Unknown or absent priorities render a quiet dash, not a guessed colour. */
export function PriorityChip({ priority }) {
	const key = String(priority || "")
		.trim()
		.toLowerCase();
	const tone = PRIORITY_CLASS[key];
	if (!tone) {
		return <span className="text-[11px] text-slate-500">—</span>;
	}
	return <span className={`${BASE} ${tone}`}>{key}</span>;
}

const STATUS_CLASS = {
	completed: "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
	investigating: "border-sky-400/30 bg-sky-500/15 text-sky-300",
	running: "border-sky-400/30 bg-sky-500/15 text-sky-300",
	verifying: "border-sky-400/30 bg-sky-500/15 text-sky-300",
	reporting: "border-sky-400/30 bg-sky-500/15 text-sky-300",
	collecting: "border-slate-400/30 bg-slate-500/15 text-slate-300",
	failed: "border-rose-400/30 bg-rose-500/15 text-rose-300",
};

/** Investigation status chip. */
export function InvestigationStatusChip({ status }) {
	const key = String(status || "collecting")
		.trim()
		.toLowerCase();
	const tone = STATUS_CLASS[key] || STATUS_CLASS.collecting;
	return <span className={`${BASE} ${tone}`}>{key}</span>;
}

const REPORT_STATUS_CLASS = {
	sent: "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
	queued: "border-amber-400/30 bg-amber-500/15 text-amber-300",
	pending: "border-amber-400/30 bg-amber-500/15 text-amber-300",
	draft: "border-amber-400/30 bg-amber-500/15 text-amber-300",
	failed: "border-rose-400/30 bg-rose-500/15 text-rose-300",
};

const REPORT_STATUS_LABEL = {
	sent: "Sent",
	queued: "Queued",
	pending: "Queued",
	draft: "Queued",
	failed: "Failed",
};

/** Email report status pill. No recorded delivery reads as None, never as Sent. */
export function ReportStatusPill({ status }) {
	const key = String(status || "")
		.trim()
		.toLowerCase();
	const tone = REPORT_STATUS_CLASS[key] || "border-slate-400/30 bg-slate-500/15 text-slate-300";
	const label = REPORT_STATUS_LABEL[key] || "None";
	return <span className={`${BASE} ${tone}`}>{label}</span>;
}

/** Confidence chip for a finding. */
export function ConfidenceChip({ confidence }) {
	const key = String(confidence || "speculative")
		.trim()
		.toLowerCase();
	const tone = SUPPORT_CASE_CONFIDENCE_CLASS[key] || SUPPORT_CASE_CONFIDENCE_CLASS.speculative;
	return <span className={`${BASE} ${tone}`}>{key}</span>;
}
