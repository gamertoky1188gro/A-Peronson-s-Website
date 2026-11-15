import { cn } from "../../lib/cn.js";

/**
 * Read-only pill badge for model-related notes in the support UI.
 * Extracted from InvestigationModelPicker so the picker and the premium
 * surfaces render the same badge. Keeps the picker's light/dark theming.
 *
 * @param {Object} props
 * @param {boolean} [props.darkMode] - Defaults to true (the premium surface is dark).
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function ModelBadge({ darkMode = true, className, children }) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border px-3 py-1 text-xs",
				darkMode
					? "border-white/10 bg-white/5 text-slate-300"
					: "border-slate-200 bg-slate-100 text-slate-600",
				className,
			)}
		>
			{children}
		</span>
	);
}
