import { cn } from "../../lib/cn.js";

/**
 * Elevated glass surface for the support premium UI: base #0b0714 page,
 * #151020 card, hairline purple/white border, purple ambient glow.
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function GlassCard({ className, children, ...rest }) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-purple-400/15 bg-[#151020]/85 shadow-[0_0_40px_-12px_rgba(168,85,247,0.25)] backdrop-blur-md",
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	);
}
