import { Check } from "lucide-react";
import { cn } from "../../lib/cn.js";

const STAGE_BY_STATUS = {
	collecting: 0,
	investigating: 1,
	verifying: 2,
	reporting: 3,
	completed: 3,
};

export const DEFAULT_STAGES = ["Understand", "Investigate", "Discuss", "Report"];

/**
 * Horizontal progress rail for the four support stages. Chips are
 * non-interactive; the current stage is derived from the case status.
 * Unknown statuses park on stage 0.
 *
 * @param {Object} props
 * @param {string[]} [props.steps]
 * @param {string} [props.status] - collecting | investigating | verifying | reporting | completed
 * @param {string} [props.className]
 */
export function StageRail({ steps = DEFAULT_STAGES, status, className }) {
	const current = STAGE_BY_STATUS[String(status ?? "").toLowerCase()] ?? 0;
	return (
		<ol aria-label="Case progress" className={cn("flex flex-wrap items-center gap-2", className)}>
			{steps.map((step, index) => {
				const state = index < current ? "done" : index === current ? "current" : "upcoming";
				return (
					<li key={step} className="flex items-center gap-2">
						{index > 0 ? (
							<span
								aria-hidden="true"
								className={cn(
									"hidden h-px w-6 sm:block",
									index <= current ? "bg-purple-500/60" : "bg-white/10",
								)}
							/>
						) : null}
						<span
							data-stage={step}
							data-stage-state={state}
							aria-current={state === "current" ? "step" : undefined}
							className={cn(
								"inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
								state === "done" && "border-purple-500/30 bg-purple-500/10 text-purple-400",
								state === "current" &&
									"border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-[#f4eeff] shadow-[0_0_16px_-6px_rgba(168,85,247,0.5)]",
								state === "upcoming" && "border-white/10 bg-white/5 text-[#a99bbd]",
							)}
						>
							{state === "done" ? <Check aria-hidden="true" className="h-3 w-3" /> : null}
							{step}
						</span>
					</li>
				);
			})}
		</ol>
	);
}
