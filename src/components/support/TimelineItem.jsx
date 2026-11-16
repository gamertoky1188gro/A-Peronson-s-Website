import { cn } from "../../lib/cn.js";

const DOT_CLASSES = {
	cyan: "border-cyan-400/60 bg-cyan-400/20",
	sky: "border-purple-500/60 bg-purple-500/20",
	emerald: "border-emerald-400/60 bg-emerald-400/20",
	amber: "border-amber-400/60 bg-amber-400/20",
	rose: "border-rose-400/60 bg-rose-400/20",
	slate: "border-white/20 bg-white/10",
};

/**
 * One entry on a vertical case timeline: a dot on the rail, a timestamp, a
 * title and an optional body. Presentation only — ordering is the caller's.
 *
 * @param {Object} props
 * @param {string} [props.time] - Pre-formatted timestamp.
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {"cyan"|"sky"|"emerald"|"amber"|"rose"|"slate"} [props.tone]
 * @param {boolean} [props.last] - Hide the connector line under the dot.
 * @param {string} [props.className]
 * @param {import("react").ReactNode} [props.children] - Extra content under the description.
 */
export function TimelineItem({
	time,
	title,
	description,
	tone = "cyan",
	last = false,
	className,
	children,
}) {
	return (
		<li className={cn("relative flex gap-3 pb-5", last && "pb-0", className)}>
			{!last ? (
				<span aria-hidden="true" className="absolute top-3 left-[5px] h-full w-px bg-white/10" />
			) : null}
			<span
				aria-hidden="true"
				className={cn(
					"relative mt-1 h-[11px] w-[11px] shrink-0 rounded-full border",
					DOT_CLASSES[tone] ?? DOT_CLASSES.slate,
				)}
			/>
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-baseline gap-x-2">
					<p className="text-sm font-medium text-[#f4eeff]">{title}</p>
					{time ? <time className="text-[11px] tabular-nums text-[#a99bbd]">{time}</time> : null}
				</div>
				{description ? (
					<p className="mt-0.5 text-xs leading-relaxed text-[#a99bbd]">{description}</p>
				) : null}
				{children ? <div className="mt-2">{children}</div> : null}
			</div>
		</li>
	);
}
