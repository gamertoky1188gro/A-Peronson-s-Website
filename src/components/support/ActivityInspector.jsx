import { Check, CircleAlert, Clock, Copy, ShieldCheck, X } from "lucide-react";
import { useRef } from "react";
import { useModalFocus } from "../../hooks/useModalFocus.js";
import { cn } from "../../lib/cn.js";

const TYPE_LABEL = {
	think: "Reasoning · Safe progress summary",
	read: "Filesystem · Read",
	write: "Filesystem · Write",
	search: "Search · Codebase",
	shell: "Shell · Command",
	skill: "Skill · Guidance",
	mcp: "MCP · External tool",
	browser: "Browser · Web",
	agent: "Agent · Delegation",
	test: "Testing · Verification",
	error: "Error · Failed operation",
	other: "Activity",
};

function statusTone(status) {
	if (status === "failed") return "text-rose-300 bg-rose-500/10 border-rose-400/20";
	if (status === "running") return "text-blue-300 bg-blue-500/10 border-blue-400/20";
	if (status === "queued" || status === "waiting")
		return "text-amber-300 bg-amber-500/10 border-amber-400/20";
	return "text-emerald-300 bg-emerald-500/10 border-emerald-400/20";
}

function copy(text) {
	try {
		navigator.clipboard?.writeText?.(String(text ?? ""));
	} catch {
		// clipboard is best-effort
	}
}

/**
 * Click-to-inspect details panel for one activity node.
 *
 * Shows only what the server recorded — label, type, status, timestamps and
 * any sanitized metadata. Never shows private model reasoning or secrets;
 * the server redacts those before the row ever reaches the client.
 */
export function ActivityInspector({ node, onClose }) {
	const panelRef = useRef(null);
	const open = Boolean(node);
	useModalFocus(open, panelRef, onClose);
	if (!node) return null;

	const detail = String(node.description ?? node.detail ?? node.title ?? "—");
	const input = String(node.input ?? node.target ?? node.file ?? node.command ?? "—");
	const time = node.time || null;

	return (
		<div class="fixed inset-0 z-50 flex justify-end">
			<button
				type="button"
				aria-label="Close activity inspector"
				class="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div
				ref={panelRef}
				role="dialog"
				aria-modal="true"
				aria-label="Activity details"
				class="relative flex h-full w-full max-w-md flex-col overflow-hidden border-l border-white/10 bg-[#110c1d] shadow-2xl"
			>
				<div class="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
					<div class="min-w-0">
						<p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8f83a8]">
							Selected activity
						</p>
						<h2 class="mt-1 truncate text-base font-semibold text-[#f4eeff]">
							{node.title || "Activity"}
						</h2>
						<p class="mt-0.5 text-[11px] text-[#a99bbd]">
							{TYPE_LABEL[node.type] || TYPE_LABEL.other}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#a99bbd] transition hover:bg-white/10 hover:text-white"
					>
						<X class="h-4 w-4" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto px-5 py-5">
					<div class="flex flex-wrap items-center gap-2">
						<span
							class={cn(
								"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
								statusTone(node.status),
							)}
						>
							{node.status === "failed" ? (
								<CircleAlert class="h-3 w-3" />
							) : (
								<Check class="h-3 w-3" />
							)}
							{node.status || "done"}
						</span>
						{node.role ? (
							<span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[#c9bce0]">
								{node.role}
							</span>
						) : null}
					</div>

					<div class="mt-5 grid grid-cols-3 gap-2">
						<div class="rounded-xl border border-white/10 bg-white/[0.02] p-3">
							<p class="text-[9px] uppercase tracking-wider text-[#8f83a8]">Started</p>
							<p class="mt-1 text-xs font-semibold tabular-nums text-[#e9dffa]">{time || "—"}</p>
						</div>
						<div class="rounded-xl border border-white/10 bg-white/[0.02] p-3">
							<p class="text-[9px] uppercase tracking-wider text-[#8f83a8]">Duration</p>
							<p class="mt-1 text-xs font-semibold tabular-nums text-[#e9dffa]">
								{node.durationMs ? `${Math.round(node.durationMs / 1000)}s` : "—"}
							</p>
						</div>
						<div class="rounded-xl border border-white/10 bg-white/[0.02] p-3">
							<p class="text-[9px] uppercase tracking-wider text-[#8f83a8]">Type</p>
							<p class="mt-1 truncate text-xs font-semibold text-[#e9dffa]">
								{node.type || "other"}
							</p>
						</div>
					</div>

					<div class="mt-5">
						<div class="mb-2 flex items-center justify-between">
							<p class="text-[10px] font-semibold uppercase tracking-wider text-[#c9bce0]">
								{node.type === "shell"
									? "Command"
									: node.type === "mcp"
										? "Tool input"
										: "Target / input"}
							</p>
							<button
								type="button"
								onClick={() => copy(input)}
								class="inline-flex items-center gap-1 text-[10px] text-[#8f83a8] transition hover:text-white"
							>
								<Copy class="h-3 w-3" /> Copy
							</button>
						</div>
						<pre class="overflow-x-auto rounded-xl border border-white/10 bg-[#0b0714] p-3 font-mono text-[11px] leading-relaxed text-[#cbbddf]">
							{input}
						</pre>
					</div>

					<div class="mt-5">
						<p class="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#c9bce0]">
							Summary
						</p>
						<p class="whitespace-pre-wrap text-[12px] leading-6 text-[#d8cfe5]">{detail}</p>
					</div>

					{node.error ? (
						<div class="mt-5 rounded-xl border border-rose-400/20 bg-rose-500/5 p-3">
							<p class="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rose-300">
								Error
							</p>
							<p class="whitespace-pre-wrap font-mono text-[11px] leading-5 text-rose-200">
								{node.error}
							</p>
						</div>
					) : null}

					{node.metadata && Object.keys(node.metadata).length > 0 ? (
						<div class="mt-5">
							<p class="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#c9bce0]">
								Metadata
							</p>
							<pre class="overflow-x-auto rounded-xl border border-white/10 bg-[#0b0714] p-3 font-mono text-[11px] leading-relaxed text-[#cbbddf]">
								{JSON.stringify(node.metadata, null, 2)}
							</pre>
						</div>
					) : null}

					<div class="mt-6 flex gap-2.5 rounded-xl border border-cyan-400/15 bg-cyan-500/5 p-3">
						<ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
						<p class="text-[11px] leading-5 text-[#a9cdd4]">
							<strong class="text-cyan-200">Privacy:</strong> credentials and secret values are
							redacted from activity previews. Private model reasoning is never shown — only safe
							progress summaries and the operations the server recorded.
						</p>
					</div>

					<div class="mt-5 flex items-center gap-1.5 text-[10px] text-[#6f647d]">
						<Clock class="h-3 w-3" /> Activity id:{" "}
						<span class="font-mono text-[#9c8fb4]">{node.id || "—"}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
