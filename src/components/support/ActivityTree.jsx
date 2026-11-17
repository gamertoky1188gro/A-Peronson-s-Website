import { Check, ChevronDown, LoaderCircle, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/cn.js";

const STAGE_ORDER = ["lead", "code", "repo", "research", "verify"];

function summarize(rows) {
	// duration from live timestamps; absent or 0 => omit (never lie)
	const times = (rows ?? []).map((row) => Date.parse(row?.at ?? "")).filter(Number.isFinite);
	if (times.length >= 2) {
		const delta = Math.max(...times) - Math.min(...times);
		if (delta >= 1000) return `${Math.round(delta / 1000)}s`;
	}
	return null;
}

/**
 * The inline AI activity tree. Rows are pre-sanitized server-side; this
 * component renders exactly what it is given and never the assistant's
 * message text.
 */
export function ActivityTree({ activity = [], status = "collecting" }) {
	const rows = Array.isArray(activity) ? activity : [];
	const running = ["investigating", "verifying", "reporting"].includes(
		String(status ?? "").toLowerCase(),
	);
	const [open, setOpen] = useState(true);
	if (rows.length === 0 && !running) {
		return null;
	}
	const ordered = [...rows].sort(
		(left, right) =>
			STAGE_ORDER.indexOf(left?.role ?? "") - STAGE_ORDER.indexOf(right?.role ?? "") || 0,
	);
	const duration = summarize(rows);
	const heading = running
		? "Working…"
		: `How this was investigated · ${rows.length} steps${duration ? ` · ${duration}` : ""}`;
	return (
		<section aria-label="AI activity" class="mx-auto w-full max-w-3xl">
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-expanded={open}
				class="flex w-full items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-left text-[11px] font-semibold text-cyan-200 transition hover:border-cyan-400/40"
			>
				{running ? (
					<LoaderCircle class="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
				) : (
					<Check class="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
				)}
				<span class="min-w-0 flex-1 truncate font-mono">{heading}</span>
				<ChevronDown
					class={cn("h-4 w-4 shrink-0 text-[#a99bbd] transition-transform", open && "rotate-180")}
					aria-hidden="true"
				/>
			</button>
			{open ? (
				<ol class="mt-1.5 border-l border-cyan-400/20 pl-4">
					{ordered.map((row, index) => {
						const previousRole = ordered[index - 1]?.role ?? null;
						const showRole = row?.role && row.role !== previousRole;
						const failed = row?.status === "failed";
						return (
							<li
								key={row?.id ?? index}
								class="flex items-baseline gap-2 py-0.5 font-mono text-[11px] leading-5"
							>
								<span class={failed ? "text-amber-400" : "text-emerald-400"} aria-hidden="true">
									{failed ? <TriangleAlert class="h-3 w-3 translate-y-0.5" /> : "|_"}
								</span>
								{showRole ? <span class="text-[#8f83a8]">{row.role} ·</span> : null}
								<span class="text-[#cfe8ef]">{row?.label ?? "Working"}</span>
							</li>
						);
					})}
				</ol>
			) : null}
		</section>
	);
}
