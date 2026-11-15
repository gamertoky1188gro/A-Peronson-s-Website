import { cn } from "../../lib/cn.js";

/**
 * Section heading for the support premium surfaces: a small cyan eyebrow,
 * a primary title, an optional description and an optional right-side slot.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import("react").ReactNode} [props.action] - Right-aligned slot (buttons, links).
 * @param {string} [props.className]
 */
export function SectionTitle({ eyebrow, title, description, action, className }) {
	return (
		<div className={cn("flex items-end justify-between gap-4", className)}>
			<div className="min-w-0">
				{eyebrow ? (
					<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
						{eyebrow}
					</p>
				) : null}
				<h2 className="mt-1 text-lg font-semibold leading-snug text-[#e8eefc]">{title}</h2>
				{description ? (
					<p className="mt-1 text-sm leading-relaxed text-[#8ea3c8]">{description}</p>
				) : null}
			</div>
			{action ? <div className="shrink-0">{action}</div> : null}
		</div>
	);
}
