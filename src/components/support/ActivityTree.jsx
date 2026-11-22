import {
	Bot,
	Brain,
	Check,
	ChevronDown,
	ChevronsDownUp,
	ChevronsUpDown,
	CircleAlert,
	Clock,
	FilePen,
	FileSearch,
	FolderSearch,
	Globe,
	LoaderCircle,
	Plug,
	Puzzle,
	Search,
	Terminal,
	TestTube2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/cn.js";

const STAGE_ORDER = ["lead", "code", "repo", "research", "verify", "assistant"];
const STAGE_TITLE = {
	lead: "Planning",
	code: "Code investigation",
	repo: "Repository history",
	research: "Research",
	verify: "Verification",
	assistant: "Discussion",
};

function orderOf(role) {
	const index = STAGE_ORDER.indexOf(role ?? "");
	return index === -1 ? STAGE_ORDER_END : index;
}
const STAGE_ORDER_END = 99;

/** Map a row to a rich node type + icon, keeping the raw label untouched. */
function classifyNode(row) {
	const label = String(row?.label ?? "");
	const status = String(row?.status ?? "");
	if (status === "failed") return { type: "error", Icon: CircleAlert, filter: "tools" };
	if (/thinking|analyz|reasoning|planning/iu.test(label))
		return { type: "think", Icon: Brain, filter: "thinking" };
	if (/search|grep|find|glob/iu.test(label))
		return { type: "search", Icon: Search, filter: "tools" };
	if (/writing|edit|modify/iu.test(label)) return { type: "write", Icon: FilePen, filter: "files" };
	if (/read|open/iu.test(label)) return { type: "read", Icon: FileSearch, filter: "files" };
	if (/shell|command|ran|running/iu.test(label))
		return { type: "shell", Icon: Terminal, filter: "tools" };
	if (/test/iu.test(label)) return { type: "test", Icon: TestTube2, filter: "tools" };
	if (/mcp|github|render|context7/iu.test(label))
		return { type: "mcp", Icon: Plug, filter: "tools" };
	if (/skill/iu.test(label)) return { type: "skill", Icon: Puzzle, filter: "tools" };
	if (/browser|http|web/iu.test(label)) return { type: "browser", Icon: Globe, filter: "tools" };
	if (/agent|delegat/iu.test(label)) return { type: "agent", Icon: Bot, filter: "tools" };
	const kind = String(row?.kind ?? "other");
	if (kind === "read") return { type: "read", Icon: FileSearch, filter: "files" };
	if (kind === "search") return { type: "search", Icon: Search, filter: "tools" };
	return { type: "shell", Icon: Terminal, filter: "tools" };
}

function summarize(rows) {
	const times = (rows ?? []).map((row) => Date.parse(row?.at ?? "")).filter(Number.isFinite);
	if (times.length >= 2) {
		const delta = Math.max(...times) - Math.min(...times);
		if (delta >= 1000) return `${Math.round(delta / 1000)}s`;
	}
	return null;
}

// Simple view: map a technical tool label to the buyer-facing milestone it
// corresponds to. Never exposes raw tool names, paths or MCP calls.
const SIMPLE_MILESTONE = {
	think: "Examining your issue",
	read: "Checking evidence",
	search: "Searching for the cause",
	write: "Preparing the report",
	shell: "Checking evidence",
	test: "Verifying results",
	mcp: "Checking evidence",
	browser: "Researching",
	skill: "Examining your issue",
	agent: "Investigating",
	error: "Checking evidence",
	other: "Investigating",
};
function displayLabel(row, simple) {
	if (!simple) {
		return String(row?.label ?? "Working");
	}
	return SIMPLE_MILESTONE[classifyNode(row).type] || "Investigating";
}

function statusText(status) {
	const map = {
		done: "Done",
		completed: "Completed",
		running: "Running",
		failed: "Failed",
		queued: "Queued",
		waiting: "Waiting",
		skipped: "Skipped",
		cancelled: "Cancelled",
	};
	return map[status] || "Done";
}

function timeOf(value) {
	const t = Date.parse(value ?? "");
	return Number.isFinite(t)
		? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
		: null;
}

/** One activity row. Clicking it opens the inspector via onInspect. */
function Node({ row, selected, onInspect, simple }) {
	const meta = classifyNode(row);
	const Icon = meta.Icon;
	const failed = row?.status === "failed";
	const running = row?.status === "running";
	const time = timeOf(row?.at);
	const { type, filter, ...nodeMeta } = meta;
	const node = useMemo(
		() => ({
			...row,
			type: meta.type,
			title: displayLabel(row, simple),
			status: row?.status ?? "done",
			time: timeOf(row?.at),
		}),
		[row, meta.type, simple],
	);
	return (
		<li class="tree-item">
			<button
				type="button"
				data-testid="activity-node"
				onClick={() => onInspect?.(node)}
				class={cn(
					"group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors",
					"hover:bg-white/[0.05]",
					selected && "bg-purple-500/10 ring-1 ring-purple-500/25",
					running && !selected && "bg-blue-500/[0.07] ring-1 ring-blue-400/15",
				)}
			>
				<span
					class={cn(
						"flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
						failed
							? "border-rose-400/30 bg-rose-500/10 text-rose-300"
							: running
								? "border-blue-400/30 bg-blue-500/10 text-blue-300"
								: "border-white/10 bg-white/5 text-[#b9a8d4]",
					)}
					aria-hidden="true"
				>
					<Icon class="h-3 w-3" />
				</span>
				<span
					class={cn(
						"min-w-0 flex-1 truncate text-[11px]",
						failed ? "text-rose-200" : "text-[#dcd2ea]",
					)}
				>
					{displayLabel(row, simple)}
				</span>
				{time ? <span class="shrink-0 text-[9px] tabular-nums text-[#6f647d]">{time}</span> : null}
				<span
					class={cn(
						"inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold",
						failed
							? "bg-rose-500/10 text-rose-300"
							: running
								? "bg-blue-500/10 text-blue-300"
								: "bg-emerald-500/10 text-emerald-300",
					)}
				>
					<span
						class={cn(
							"h-1.5 w-1.5 rounded-full",
							failed
								? "bg-rose-400"
								: running
									? "bg-blue-400 animate-pulse motion-reduce:animate-none"
									: "bg-emerald-400",
						)}
					/>
					{statusText(row?.status)}
				</span>
			</button>
		</li>
	);
}

/**
 * Stage group: header is a native <details> summary so expand/collapse is
 * free and keyboard accessible. Children are activity nodes.
 */
function Stage({ stage, filter, selectedId, onInspect, expandSignal, simple }) {
	const [open, setOpen] = useState(true);
	const visible = stage.rows.filter(
		(row) => filter === "all" || classifyNode(row).filter === filter,
	);
	useEffect(() => {
		if (typeof expandSignal === "boolean") setOpen(expandSignal);
	}, [expandSignal]);
	if (visible.length === 0) return null;
	const failed = visible.some((row) => row?.status === "failed");
	const running = visible.some((row) => row?.status === "running");
	const done = visible.filter(
		(row) => !["running", "queued", "waiting", "failed"].includes(row?.status),
	).length;
	const duration = summarize(visible);
	return (
		<div class="tree-stage" data-stage={stage.role ?? "assistant"}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-white/[0.04]"
			>
				<ChevronDown
					class={cn("h-3.5 w-3.5 text-[#7c6f92] transition-transform", !open && "-rotate-90")}
				/>
				<FolderSearch class="h-4 w-4 text-cyan-300/80" aria-hidden="true" />
				<span class="min-w-0 flex-1 truncate text-[11px] font-semibold text-[#efe6f8]">
					{STAGE_TITLE[stage.role] || stage.role || "Activity"}
				</span>
				{duration ? <span class="text-[9px] tabular-nums text-[#6f647d]">{duration}</span> : null}
				<span class="text-[9px] text-[#6f647d]">
					{done}/{visible.length}
				</span>
				<span
					class={cn(
						"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold",
						failed
							? "bg-rose-500/10 text-rose-300"
							: running
								? "bg-blue-500/10 text-blue-300"
								: "bg-emerald-500/10 text-emerald-300",
					)}
				>
					{failed ? "Failed" : running ? "Running" : "Completed"}
				</span>
			</button>
			{open ? (
				<ul class="ml-6 mt-1 space-y-0.5 border-l border-white/10 pl-2">
					{visible.map((row, index) => (
						<Node
							key={row?.id ?? index}
							row={row}
							selected={selectedId && row?.id === selectedId}
							onInspect={onInspect}
							simple={simple}
						/>
					))}
				</ul>
			) : null}
		</div>
	);
}

/**
 * The inline AI activity tree. Rows are pre-sanitized server-side; this
 * component renders exactly what it is given and never the assistant's
 * message text.
 */
export function ActivityTree({
	activity = [],
	status = "collecting",
	active = null,
	onInspect = null,
	selectedId = null,
	// When set, only this role's activity group renders (one investigator).
	role = null,
	// When set, only this investigation run's activity renders.
	runId = null,
	// Default to the buyer-friendly simple view.
	defaultSimple = true,
}) {
	const rows = Array.isArray(activity) ? activity : [];
	const [simple, setSimple] = useState(defaultSimple);
	const statusKey = String(status ?? "").toLowerCase();
	const phaseRunning = ["investigating", "verifying", "reporting"].includes(statusKey);
	const running = active === null ? phaseRunning : active;
	const [open, setOpen] = useState(() => (active === null ? phaseRunning : active));
	const [filter, setFilter] = useState("all");
	const [expandSignal, setExpandSignal] = useState(null);

	useEffect(() => {
		if (running) setOpen(true);
	}, [running]);

	// Scope to one role and/or one run so the tree renders a single
	// investigator's group instead of the whole investigation.
	const scoped = rows.filter(
		(row) => (role === null || row?.role === role) && (runId === null || row?.runId === runId),
	);

	const ordered = useMemo(
		() => [...scoped].sort((left, right) => orderOf(left?.role) - orderOf(right?.role) || 0),
		[scoped],
	);
	const stages = useMemo(() => {
		const map = new Map();
		for (const row of ordered) {
			const role = row?.role ?? null;
			if (!map.has(role)) map.set(role, { role, rows: [] });
			map.get(role).rows.push(row);
		}
		return [...map.values()];
	}, [ordered]);

	if (scoped.length === 0 && !running) return null;

	const duration = summarize(scoped);
	const doneCount = scoped.filter(
		(row) => !["running", "queued", "waiting", "failed"].includes(row?.status),
	).length;
	const failedCount = scoped.filter((row) => row?.status === "failed").length;
	const runningCount = scoped.filter((row) => row?.status === "running").length;
	// No percentage: `done / observed` is not task completion (the investigation
	// can have many more steps to run), so a bar would lie. Counts are honest.
	const countsLabel = `${doneCount} of ${scoped.length} done`;
	const currentActionRow = scoped.find((row) => row?.status === "running");
	const currentAction = currentActionRow ? displayLabel(currentActionRow, simple) : null;
	const heading = running
		? currentAction
			? `Working: ${currentAction}`
			: "Working…"
		: `How this was investigated · ${scoped.length} steps${duration ? ` · ${duration}` : ""}`;

	const filters = [
		["all", "All"],
		["files", "Files"],
		["tools", "Tools"],
		["thinking", "Thinking"],
	];

	return (
		<section aria-label="AI activity" class="mx-auto w-full max-w-3xl">
			<div
				class={cn(
					"overflow-hidden rounded-2xl border shadow-sm transition-colors",
					running ? "border-cyan-400/25 bg-[#0b121b]/80" : "border-white/10 bg-[#0b0714]/70",
				)}
			>
				{/* Header */}
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					aria-expanded={open}
					class="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition hover:bg-white/[0.04]"
				>
					<span
						class={cn(
							"flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
							running
								? "border-blue-400/30 bg-blue-500/10 text-blue-300"
								: "border-purple-400/25 bg-purple-500/10 text-purple-300",
						)}
						aria-hidden="true"
					>
						{running ? (
							<LoaderCircle class="h-4 w-4 animate-spin motion-reduce:animate-none" />
						) : (
							<Check class="h-4 w-4" />
						)}
					</span>
					<span class="min-w-0 flex-1">
						<span class="block truncate text-[12px] font-semibold text-[#f0e9fa]">
							Activity tree
						</span>
						<span class="mt-0.5 block truncate text-[10px] text-[#9c8fb4]">{heading}</span>
					</span>
					<span class="hidden shrink-0 items-center gap-3 text-[10px] text-[#9c8fb4] sm:flex">
						<span class="inline-flex items-center gap-1">
							<Clock class="h-3 w-3" aria-hidden="true" />
							{duration || "—"}
						</span>
						<span>{failedCount > 0 ? `${failedCount} failed` : `${rows.length} nodes`}</span>
					</span>
					<span
						class={cn(
							"inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
							running
								? "border-blue-400/20 bg-blue-500/10 text-blue-300"
								: failedCount > 0
									? "border-rose-400/20 bg-rose-500/10 text-rose-300"
									: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
						)}
					>
						<span
							class={cn(
								"h-1.5 w-1.5 rounded-full",
								running
									? "animate-pulse motion-reduce:animate-none bg-blue-400"
									: failedCount > 0
										? "bg-rose-400"
										: "bg-emerald-400",
							)}
						/>
						{running ? "Running" : failedCount > 0 ? "Failed" : "Completed"}
					</span>
					<ChevronDown
						class={cn(
							"h-4 w-4 shrink-0 text-[#7c6f92] transition-transform",
							!open && "-rotate-90",
						)}
					/>
				</button>

				{open ? (
					<div class="border-t border-white/5">
						{/* Progress: counts and the current action, never a percentage. */}
						{/* A percentage of observed steps is not investigation completion */}
						{/* and would mislead the buyer. */}
						<div class="px-3.5 py-2.5">
							<div class="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#9c8fb4]">
								<span>
									<strong class="font-semibold text-[#e9dffa]">{countsLabel}</strong>
									{runningCount > 0 ? ` · ${runningCount} running` : ""}
									{failedCount > 0 ? ` · ${failedCount} failed` : ""}
								</span>
								{duration ? <span class="tabular-nums">{duration}</span> : null}
							</div>
							{currentAction ? (
								<p class="mt-1.5 text-[11px] text-cyan-200">
									<span class="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 motion-reduce:animate-none" />
									{currentAction}
								</p>
							) : null}
						</div>

						{/* Toolbar */}
						<div class="flex flex-wrap items-center gap-1 border-t border-white/5 px-2.5 py-1.5">
							{filters.map(([id, label]) => (
								<button
									key={id}
									type="button"
									onClick={() => setFilter(id)}
									class={cn(
										"rounded-md border px-2 py-1 text-[10px] transition",
										filter === id
											? "border-purple-500/25 bg-purple-500/10 text-purple-200"
											: "border-transparent text-[#9c8fb4] hover:bg-white/5 hover:text-white",
									)}
								>
									{label}
								</button>
							))}
							<span class="flex-1" />
							<button
								type="button"
								onClick={() => setSimple((v) => !v)}
								aria-pressed={!simple}
								title={simple ? "Show technical tool names" : "Show simple milestones"}
								class={cn(
									"rounded-md border px-2 py-1 text-[10px] transition",
									simple
										? "border-transparent text-[#9c8fb4] hover:bg-white/5 hover:text-white"
										: "border-cyan-500/25 bg-cyan-500/10 text-cyan-200",
								)}
							>
								{simple ? "Technical view" : "Simple view"}
							</button>
							<button
								type="button"
								onClick={() => setExpandSignal(true)}
								class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-[#9c8fb4] transition hover:bg-white/5 hover:text-white"
								title="Expand all stages"
							>
								<ChevronsUpDown class="h-3 w-3" /> Expand
							</button>
							<button
								type="button"
								onClick={() => setExpandSignal(false)}
								class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-[#9c8fb4] transition hover:bg-white/5 hover:text-white"
								title="Collapse all stages"
							>
								<ChevronsDownUp class="h-3 w-3" /> Collapse
							</button>
						</div>

						{/* Tree */}
						<div class="max-h-[440px] space-y-1 overflow-y-auto px-2.5 py-2">
							{stages.map((stage) => (
								<Stage
									key={stage.role ?? "assistant"}
									stage={stage}
									filter={filter}
									selectedId={selectedId}
									onInspect={onInspect}
									expandSignal={expandSignal}
									simple={simple}
								/>
							))}
							{stages.every(
								(stage) =>
									!stage.rows.some(
										(row) => filter === "all" || classifyNode(row).filter === filter,
									),
							) ? (
								<p class="px-2 py-3 text-center text-[11px] text-[#6f647d]">
									No activities match this filter.
								</p>
							) : null}
						</div>

						{/* Footer */}
						<div class="flex items-center justify-between border-t border-white/5 px-3.5 py-2 text-[9px] text-[#6f647d]">
							<span class="inline-flex items-center gap-1.5">
								<span class="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
								{running ? "Streaming activity events" : "All activity events recorded"}
							</span>
							<span>{onInspect ? "Click any node to inspect details" : "Read-only trace"}</span>
						</div>
					</div>
				) : null}
			</div>
		</section>
	);
}
