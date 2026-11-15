import { cn } from "../../lib/cn.js";
import { StatusPill } from "./StatusPill.jsx";

/**
 * Page-level shell for the support case surfaces: the dark base canvas with
 * an ambient cyan wash, a constrained column, and a header row carrying the
 * eyebrow, title, status pill and an action slot.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {string} props.title
 * @param {string} [props.status] - Optional case status shown as a pill.
 * @param {import("react").ReactNode} [props.actions] - Right-side header slot.
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function CaseShell({ eyebrow, title, status, actions, className, children }) {
	return (
		<div className="relative min-h-dvh overflow-hidden bg-[#050b1d] text-[#e8eefc]">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,rgba(34,211,238,0.12),transparent_70%),radial-gradient(40%_40%_at_100%_100%,rgba(56,189,248,0.08),transparent_70%)]"
			/>
			<div
				className={cn(
					"relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-6 sm:px-6",
					className,
				)}
			>
				<header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
					<div className="min-w-0">
						{eyebrow ? (
							<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
								{eyebrow}
							</p>
						) : null}
						<div className="mt-1 flex flex-wrap items-center gap-3">
							<h1 className="text-xl font-semibold leading-tight sm:text-2xl">{title}</h1>
							{status ? <StatusPill status={status} /> : null}
						</div>
					</div>
					{actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
				</header>
				<main className="flex min-h-0 flex-1 flex-col pt-4">{children}</main>
			</div>
		</div>
	);
}
