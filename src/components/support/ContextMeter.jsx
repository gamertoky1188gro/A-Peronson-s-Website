import { Gauge } from "lucide-react";

/**
 * Context meter for the running investigation.
 *
 * `used` is what the server's newest assistant message was fed as its
 * prompt — the context window actually in use. `limit` is the model's own
 * context window from the catalog. Both are raw token counts; the percentage
 * is derived, never invented, and censored only when the limit is unknown.
 *
 * @param {Object} props
 * @param {number|null} props.used - Tokens in use, or null before the first ping.
 * @param {number|null} props.limit - The model's context window, or null when unknown.
 */
export function ContextMeter({ used, limit }) {
	const limitNumber = Number(limit);
	const usedNumber = Number(used);
	const hasLimit = Number.isFinite(limitNumber) && limitNumber > 0;
	const hasUsed = Number.isFinite(usedNumber) && usedNumber >= 0;
	const effectiveUsed = hasUsed ? Math.max(0, Math.floor(usedNumber)) : 0;
	const pct = hasLimit ? Math.min(100, (effectiveUsed / limitNumber) * 100) : null;

	return (
		<div class="rounded-2xl border border-white/10 bg-white/5 p-3">
			<div class="flex items-center justify-between gap-2">
				<p class="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a99bbd]">
					<Gauge class="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
					Context
				</p>
				<p class="text-[10px] tabular-nums text-cyan-200">
					{pct === null ? "—" : `${pct.toFixed(1)}%`}
				</p>
			</div>
			<div
				class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={hasLimit ? limitNumber : 100}
				aria-valuenow={effectiveUsed}
				aria-label="Context window usage"
			>
				<div
					class="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-[width] duration-500"
					style={{ width: `${pct ?? 0}%` }}
				/>
			</div>
			<p class="mt-1.5 text-[10px] tabular-nums leading-4 text-[#f4eeff]">
				{effectiveUsed.toLocaleString()} / {hasLimit ? limitNumber.toLocaleString() : "unknown"}{" "}
				tokens
			</p>
		</div>
	);
}
