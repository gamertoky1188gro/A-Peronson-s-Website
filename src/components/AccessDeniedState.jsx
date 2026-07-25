import { Link } from "react-router-dom";

/**
 * Renders a state indicating that access to a section is denied.
 *
 * @param {Object} props
 * @param {string} [props.message="You do not have permission to access this section."] - The message to display.
 * @returns {JSX.Element} The rendered access denied component.
 */
export default function AccessDeniedState({
	message = "You do not have permission to access this section.",
}) {
	return (
		<div class="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-amber-50 p-4 text-amber-800">
			<h2 class="font-semibold">Access denied</h2>
			<p class="mt-1 text-sm">{message}</p>
			<Link
				to="/access-denied"
				class="mt-3 inline-block text-sm font-medium text-[#0A66C2] underline"
			>
				View details
			</Link>
		</div>
	);
}
