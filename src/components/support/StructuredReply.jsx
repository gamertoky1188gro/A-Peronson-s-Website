import { Check, ClipboardCopy, LogIn, XCircle } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { cn } from "../../lib/cn.js";

/* The pieces the intake assistant can render inside a bubble when its own
 * message carries structured hints. Every card is client-only UI: it collects
 * input for the case and never talks to anything except the existing case
 * upload/send flows. No network reads happen because the model asked. */

/** "Upload: <what>" — a compact card the client taps to attach evidence. It reuses
 *  the existing /documents upload path so the file is anchored to the case. */
export function StructuredUpload({ label = "evidence", onAttach }) {
	const inputId = useId();
	const [busy, setBusy] = useState(false);
	return (
		<label
			for={inputId}
			class={cn(
				"flex cursor-pointer items-center gap-3 rounded-2xl border border-cyan-400/25 bg-cyan-500/5 p-3 transition",
				"hover:border-cyan-400/40 hover:bg-cyan-500/10 focus-within:ring-2 focus-within:ring-cyan-400/60",
				busy && "pointer-events-none opacity-60",
			)}
		>
			<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
				<LogIn class="h-5 w-5" aria-hidden="true" />
			</span>
			<span class="min-w-0">
				<span class="block text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
					📎 Drop a log, screenshot or code snippet
				</span>
				<span class="mt-0.5 block text-xs font-medium leading-5 text-[#f4eeff]">
					Attach {label} — the investigation reads it the moment you send it.
				</span>
			</span>
			<input
				id={inputId}
				type="file"
				multiple={true}
				accept="image/*,text/*,application/pdf,application/json,application/zip,application/octet-stream"
				class="hidden"
				onChange={(event) => {
					const files = Array.from(event.target.files ?? []);
					event.target.value = "";
					if (files.length > 0 && typeof onAttach === "function") {
						setBusy(true);
						Promise.resolve(onAttach(files)).finally(() => setBusy(false));
					}
				}}
			/>
		</label>
	);
}

/** "Paste: <language>" — a bordered monospace box the client pastes into. Content posts
 *  as a normal message through the parent's onSend. */
export function PasteBox({ hint = "paste here", placeholder = "…", onSend }) {
	const [value, setValue] = useState("");
	const trimmed = value.trim();
	return (
		<div class="rounded-2xl border border-white/10 bg-[#0b0714]">
			<div class="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-1.5">
				<p class="font-mono text-[10px] uppercase tracking-wider text-[#a99bbd]">Paste —{hint}</p>
				<span class="text-[10px] tabular-nums text-[#a99bbd]">{trimmed.length} chars</span>
			</div>
			<textarea
				value={value}
				onChange={(event) => setValue(event.target.value)}
				placeholder={placeholder}
				rows={5}
				spellCheck="false"
				class="w-full resize-y bg-transparent px-3 py-2 font-mono text-[12px] leading-5 text-[#f4eeff] outline-none placeholder-[#6b5f88]"
			/>
			<div class="flex items-center justify-end border-t border-white/10 px-2 py-1.5">
				<button
					type="button"
					disabled={!trimmed}
					onClick={() => {
						onSend?.(trimmed);
						setValue("");
					}}
					class="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 transition hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-40"
				>
					<ClipboardCopy class="h-3.5 w-3.5" aria-hidden="true" />
					Attach to case
				</button>
			</div>
		</div>
	);
}

/** "Chips: A | B | C" — tappable pills; tapping sends the chip text as the reply. */
export function GuidedChips({ chips, onPick, disabled = false }) {
	const list = Array.isArray(chips) ? chips : [];
	if (list.length === 0) {
		return null;
	}
	return (
		<div class="flex flex-wrap gap-2">
			{list.map((chip, index) => (
				<button
					key={`chip-${index}-${chip}`}
					type="button"
					disabled={disabled}
					onClick={() => onPick?.(chip)}
					class="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1.5 text-[11px] font-semibold text-purple-300 transition hover:border-purple-400/70 hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{chip}
				</button>
			))}
		</div>
	);
}

/** "Check: <label> | OK|FAIL" — the "what I checked vs. what I found" table. */
export function CheckTable({ rows }) {
	const list = Array.isArray(rows) ? rows : [];
	if (list.length === 0) {
		return null;
	}
	let okCount = 0;
	let failCount = 0;
	for (const row of list) {
		if (
			String(row?.ok ?? row?.status ?? "")
				.toUpperCase()
				.includes("FAIL")
		) {
			failCount += 1;
		} else {
			okCount += 1;
		}
	}
	return (
		<div class="overflow-hidden rounded-2xl border border-white/10">
			<div class="flex items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-3 py-1.5">
				<p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a99bbd]">
					What I checked
				</p>
				<p class="text-[10px] tabular-nums">
					<span class="mr-2 text-emerald-300">{okCount} ok</span>
					<span class="text-rose-300">{failCount} failed</span>
				</p>
			</div>
			<table class="w-full text-left text-[12px]">
				<tbody>
					{list.map((row, index) => {
						const failed = String(row?.ok ?? row?.status ?? "")
							.toUpperCase()
							.includes("FAIL");
						return (
							<tr key={`check-${index}`} class="border-t border-white/5">
								<td class="w-8 px-2 py-1.5 text-center">
									{failed ? (
										<XCircle class="h-4 w-4 text-rose-400" aria-label="failing" role="img" />
									) : (
										<Check class="h-4 w-4 text-emerald-400" aria-label="ok" role="img" />
									)}
								</td>
								<td class="px-2 py-1.5 text-[#f4eeff]">{row?.label ?? row}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
