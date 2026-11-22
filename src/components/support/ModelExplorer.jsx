/**
 * OpenCode Model Explorer — a live view of OpenCode's inference model catalog.
 *
 * Ported from the standalone preview.html. The upstream call goes through
 * /api/support/opencode-models (server proxy) because the browser cannot call
 * the API directly (CORS). Every displayed field comes from the API response;
 * nothing about capabilities or pricing is invented.
 */

import { Download, LoaderCircle, RefreshCw, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest, getToken } from "../../lib/auth.js";
import { cn } from "../../lib/cn.js";
import { logger } from "../../lib/logger.js";

const isFree = (model) =>
	[model?.id, model?.name, model?.family].some((v) => typeof v === "string" && /free/iu.test(v));

const nested = (obj, path) => path.split(".").reduce((v, k) => v?.[k], obj);
const fmt = (v) =>
	typeof v === "number" && Number.isFinite(v) ? new Intl.NumberFormat().format(v) : (v ?? "N/A");

function badges(model) {
	const out = [];
	if (isFree(model)) out.push(["FREE", "free"]);
	if (model.open_weights === true) out.push(["OPEN WEIGHTS", ""]);
	if (model.open_weights === false) out.push(["CLOSED WEIGHTS", ""]);
	if (model.capabilities?.reasoning?.supported === true) out.push(["REASONING", ""]);
	if (model.capabilities?.tools?.supported === true) out.push(["TOOL CALLING", ""]);
	const input = model.modalities?.input || [];
	if (Array.isArray(input) && input.some((m) => /image|video/iu.test(String(m))))
		out.push(["VISION / MEDIA", "vision"]);
	if (Array.isArray(input) && input.some((m) => /audio/iu.test(String(m))))
		out.push(["AUDIO INPUT", "vision"]);
	return out;
}

/** Recursive JSON viewer; objects/arrays are collapsible <details>. */
function JsonTree({ value, name = "root", depth = 0 }) {
	const isObj = value !== null && typeof value === "object";
	if (isObj) {
		const array = Array.isArray(value);
		const entries = Object.entries(value);
		return (
			<details open={depth < 3} class="ml-2 border-l border-white/10 pl-2">
				<summary class="cursor-pointer py-0.5 text-[10px] text-[#a69ab8]">
					{name} {array ? `[${value.length} items]` : `{${entries.length} fields}`}
				</summary>
				{entries.length === 0 ? (
					<div class="py-0.5 text-[10px] text-[#6f647d]">Empty</div>
				) : (
					entries.map(([key, val]) => (
						<JsonTree key={key} value={val} name={key} depth={depth + 1} />
					))
				)}
			</details>
		);
	}
	let shown;
	if (typeof value === "string") shown = JSON.stringify(value);
	else if (value === null) shown = "null";
	else shown = String(value);
	const color =
		typeof value === "boolean"
			? "text-purple-300"
			: typeof value === "number"
				? "text-cyan-300"
				: value === null
					? "text-rose-300"
					: "text-[#cfc3e6]";
	return (
		<div class="flex gap-2 py-0.5 text-[10px]">
			<span class="shrink-0 text-[#8f83a8]">{name}:</span>
			<span class={cn("break-all", color)}>{shown}</span>
		</div>
	);
}

function ModelCard({ model }) {
	const quick = [
		["Context Window", fmt(nested(model, "limit.context"))],
		["Max Output", fmt(nested(model, "limit.output"))],
		["Model Type", model.type],
		["Family", model.family],
		["Release Date", model.release_date],
		["Last Updated", model.last_updated],
	];
	return (
		<article class="rounded-2xl border border-white/10 bg-[#0f0a18] p-4">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div class="min-w-0">
					<h3 class="text-sm font-semibold text-[#f4eeff]">
						{model.name || model.id || "Unnamed model"}
					</h3>
					<p class="break-all font-mono text-[10px] text-[#a69ab8]">
						{model.id || "ID not provided"}
					</p>
					{model.description ? (
						<p class="mt-1 text-[11px] leading-5 text-[#c9bce0]">{model.description}</p>
					) : null}
				</div>
				<div class="flex flex-wrap gap-1.5">
					{badges(model).map(([label, tone]) => (
						<span
							key={label}
							class={cn(
								"rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-wide",
								tone === "free"
									? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
									: tone === "vision"
										? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
										: "border-white/10 bg-white/5 text-[#a99bbd]",
							)}
						>
							{label}
						</span>
					))}
				</div>
			</div>
			<div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
				{quick.map(([label, value]) => (
					<div key={label} class="rounded-lg border border-white/5 bg-white/[0.02] p-2">
						<p class="text-[9px] uppercase tracking-wider text-[#8f83a8]">{label}</p>
						<p
							class="mt-0.5 truncate text-[11px] font-semibold text-[#e9dffa]"
							title={String(value)}
						>
							{value ?? "Not provided by API"}
						</p>
					</div>
				))}
			</div>
			<details class="mt-3 border-t border-white/5 pt-2">
				<summary class="cursor-pointer text-[10px] font-semibold tracking-wider text-cyan-300">
					COMPLETE MODEL SPECIFICATION · ALL API FIELDS
				</summary>
				<div class="mt-2 max-h-96 overflow-y-auto">
					{Object.entries(model).map(([key, val]) => (
						<JsonTree key={key} value={val} name={key} depth={0} />
					))}
				</div>
			</details>
		</article>
	);
}

/**
 * @param {{ onClose: () => void }} props
 */
export default function ModelExplorer({ onClose }) {
	const [models, setModels] = useState([]);
	const [raw, setRaw] = useState(null);
	const [status, setStatus] = useState({ text: "Waiting for API connection...", type: "normal" });
	const [loading, setLoading] = useState(false);
	const [lastUpdated, setLastUpdated] = useState(null);
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState("free");
	const [sort, setSort] = useState("name");
	const listRef = useRef(null);
	const setAllDetails = (open) => {
		listRef.current?.querySelectorAll("details").forEach((el) => {
			el.open = open;
		});
	};

	const load = useCallback(async () => {
		if (loading) return;
		setLoading(true);
		setStatus({ text: "Connecting to OpenCode Models API...", type: "normal" });
		try {
			const data = await apiRequest("/support/opencode-models", {
				token: getToken() ?? undefined,
			});
			if (!(data && Array.isArray(data.data))) {
				throw new Error("Unexpected API response: expected a data array");
			}
			setModels(data.data);
			setRaw(data);
			setLastUpdated(new Date());
			setStatus({
				text: `Loaded ${data.data.length} models${data.cached ? " (cached)" : ""} from OpenCode.`,
				type: "success",
			});
		} catch (err) {
			logger.warn("Model explorer fetch failed:", err);
			setStatus({ text: `API error: ${err?.message || String(err)}`, type: "error" });
		} finally {
			setLoading(false);
		}
	}, [loading]);

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const visible = useMemo(() => {
		let list = [...models];
		if (filter === "free") list = list.filter(isFree);
		const q = query.trim().toLowerCase();
		if (q) list = list.filter((m) => JSON.stringify(m).toLowerCase().includes(q));
		const context = (m) => Number(m?.limit?.context) || 0;
		const output = (m) => Number(m?.limit?.output) || 0;
		switch (sort) {
			case "id":
				list.sort((a, b) => String(a.id || "").localeCompare(String(b.id || "")));
				break;
			case "context-desc":
				list.sort((a, b) => context(b) - context(a));
				break;
			case "output-desc":
				list.sort((a, b) => output(b) - output(a));
				break;
			case "newest":
				list.sort((a, b) =>
					String(b.release_date || "").localeCompare(String(a.release_date || "")),
				);
				break;
			default:
				list.sort((a, b) =>
					String(a.name || a.id || "").localeCompare(String(b.name || b.id || "")),
				);
		}
		return list;
	}, [models, filter, query, sort]);

	const freeCount = useMemo(() => models.filter(isFree).length, [models]);

	async function copyJson() {
		if (!raw) return;
		try {
			await navigator.clipboard.writeText(JSON.stringify(raw, null, 2));
		} catch {
			logger.warn("Clipboard write failed");
		}
	}

	function downloadJson() {
		if (!raw) return;
		const blob = new Blob([JSON.stringify(raw, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "opencode-models.json";
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	return (
		<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
			<button
				type="button"
				aria-label="Close model explorer"
				class="absolute inset-0 bg-black/70 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="OpenCode Model Explorer"
				class="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0714] shadow-2xl"
			>
				<div class="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
					<div class="min-w-0">
						<h2 class="text-base font-semibold text-[#f4eeff]">OpenCode Model Explorer</h2>
						<p class="mt-0.5 text-[11px] text-[#a99bbd]">
							Live catalog from <code class="text-cyan-300">opencode.ai/inference/v1/models</code>
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#a99bbd] hover:bg-white/10 hover:text-white"
					>
						<X class="h-4 w-4" />
					</button>
				</div>

				<div class="grid grid-cols-2 gap-2 border-b border-white/10 px-5 py-3 sm:grid-cols-4">
					{[
						["Total API Models", models.length],
						["Free Models", freeCount],
						["Currently Displayed", visible.length],
						["Last Updated", lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"],
					].map(([label, value]) => (
						<div key={label} class="rounded-lg border border-white/5 bg-white/[0.02] p-2">
							<p class="text-[9px] uppercase tracking-wider text-[#8f83a8]">{label}</p>
							<p class="mt-0.5 text-sm font-semibold text-[#e9dffa]">{value}</p>
						</div>
					))}
				</div>

				<div class="flex flex-wrap items-center gap-2 border-b border-white/10 px-5 py-3">
					<div class="relative min-w-[180px] flex-1">
						<Search class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6f647d]" />
						<input
							type="search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search model, ID, family, capabilities, API fields..."
							class="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 pl-8 pr-2 text-[11px] text-[#f4eeff] placeholder:text-[#6f647d] focus:border-purple-500/50 focus:outline-none"
						/>
					</div>
					<select
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						aria-label="Model filter"
						class="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-[#f4eeff] focus:outline-none"
					>
						<option value="free">Free models only</option>
						<option value="all">All API models</option>
					</select>
					<select
						value={sort}
						onChange={(e) => setSort(e.target.value)}
						aria-label="Model sort"
						class="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-[#f4eeff] focus:outline-none"
					>
						<option value="name">Sort: Name</option>
						<option value="id">Sort: Model ID</option>
						<option value="context-desc">Largest context first</option>
						<option value="output-desc">Largest output first</option>
						<option value="newest">Newest release first</option>
					</select>
					<button
						type="button"
						onClick={load}
						disabled={loading}
						class="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] font-semibold text-purple-300 hover:bg-purple-500/20 disabled:opacity-50"
					>
						{loading ? (
							<LoaderCircle class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
						) : (
							<RefreshCw class="h-3.5 w-3.5" />
						)}
						Refresh API
					</button>
					<button
						type="button"
						onClick={() => setAllDetails(true)}
						class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-[#a99bbd] hover:bg-white/10"
					>
						Expand all
					</button>
					<button
						type="button"
						onClick={() => setAllDetails(false)}
						class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-[#a99bbd] hover:bg-white/10"
					>
						Collapse all
					</button>
					<button
						type="button"
						onClick={copyJson}
						class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-[#a99bbd] hover:bg-white/10"
					>
						Copy JSON
					</button>
					<button
						type="button"
						onClick={downloadJson}
						class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-[#a99bbd] hover:bg-white/10"
					>
						<Download class="h-3.5 w-3.5" /> Download JSON
					</button>
				</div>

				<div class="flex items-center gap-2 px-5 py-2 text-[10px]">
					<span
						class={cn(
							"h-2 w-2 rounded-full",
							status.type === "success"
								? "bg-emerald-400"
								: status.type === "error"
									? "bg-rose-400"
									: "bg-white/20",
						)}
					/>
					<span class={status.type === "error" ? "text-rose-300" : "text-[#a99bbd]"}>
						{status.text}
					</span>
				</div>

				<div ref={listRef} class="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-3">
					{visible.length === 0 ? (
						<p class="py-8 text-center text-sm text-[#a99bbd]">
							{loading ? "Loading OpenCode models..." : "No matching models found."}
						</p>
					) : (
						visible.map((model) => <ModelCard key={model.id || model.name} model={model} />)
					)}
				</div>

				<div class="border-t border-white/10 px-5 py-2 text-[9px] leading-4 text-[#6f647d]">
					All displayed model details come directly from the API. Free-model detection is a
					case-insensitive search for “free” in ID, name, and family. No capabilities or pricing are
					invented.
				</div>
			</div>
		</div>
	);
}
