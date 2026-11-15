import { cn } from "../../lib/cn.js";

/**
 * Elevated glass surface for the support premium UI: base #050b1d page,
 * #0a1025 card, hairline white/10 border, cyan ambient glow.
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function GlassCard({ className, children, ...rest }) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-white/10 bg-[#0a1025]/85 shadow-[0_0_40px_-12px_rgba(34,211,238,0.25)] backdrop-blur-md",
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	);
}
