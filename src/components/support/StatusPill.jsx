import { cn } from "../../lib/cn.js";

const TONE_BY_STATUS = {
	collecting: "cyan",
	investigating: "sky",
	verifying: "amber",
	completed: "emerald",
	failed: "rose",
};

const TONE_CLASSES = {
	cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
	sky: "border-sky-400/30 bg-sky-400/10 text-sky-300",
	amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
	emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
	rose: "border-rose-400/30 bg-rose-400/10 text-rose-300",
	slate: "border-white/10 bg-white/5 text-[#8ea3c8]",
};

const DOT_CLASSES = {
	cyan: "bg-cyan-400",
	sky: "bg-sky-400",
	amber: "bg-amber-400",
	emerald: "bg-emerald-400",
	rose: "bg-rose-400",
	slate: "bg-[#8ea3c8]",
};

/**
 * Non-interactive pill for a support case status. Unknown statuses fall back
 * to a neutral slate tone rather than guessing.
 *
 * @param {Object} props
 * @param {string} [props.status] - The case status, e.g. "collecting".
 * @param {string} [props.className]
 */
export function StatusPill({ status, className }) {
	const key = String(status ?? "").toLowerCase();
	const tone = TONE_BY_STATUS[key] ?? "slate";
	const label = key ? key.charAt(0).toUpperCase() + key.slice(1) : "Unknown";
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
				TONE_CLASSES[tone],
				className,
			)}
		>
			<span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", DOT_CLASSES[tone])} />
			{label}
		</span>
	);
}
