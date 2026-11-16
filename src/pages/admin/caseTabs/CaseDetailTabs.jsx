// The tabbed case detail for the owner console: Overview, Conversation,
// Evidence, Code findings, Activity and Email report. The data is whatever
// the admin case endpoint already returned - nothing here fetches.
//
// Escalate / Re-run stay in the header above this tab bar on purpose: they
// are the existing action contract, not part of the read-only panels.

import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EvidenceViewerModal } from "../../../components/support/EvidenceViewerModal.jsx";
import { StageRail } from "../../../components/support/StageRail.jsx";
import { signOne } from "../../../lib/signedFile.js";
import {
	ConfidenceChip,
	InvestigationStatusChip,
	PriorityChip,
	ReportStatusPill,
} from "./chips.jsx";

// Top level, so they are compiled once.
const IMAGE_FILE_PATTERN = /\.(png|jpe?g|gif|webp|avif|bmp)$/iu;
const EXTERNAL_URL_PATTERN = /^https?:\/\//iu;
const TABS = [
	{ id: "overview", label: "Overview" },
	{ id: "conversation", label: "Conversation" },
	{ id: "evidence", label: "Evidence" },
	{ id: "findings", label: "Code findings" },
	{ id: "activity", label: "Activity" },
	{ id: "email", label: "Email report" },
];

function fileNameOf(filePath) {
	const raw = String(filePath || "");
	const [withoutQuery] = raw.split("?");
	const [withoutHash] = withoutQuery.split("#");
	const parts = withoutHash.split("/").filter(Boolean);
	return parts.length > 0 ? (parts.at(-1) ?? "attachment") : "attachment";
}

/** Whether a stored file is an image, so the grid can offer a preview. */
function isImageAttachment(attachment) {
	const mime = String(attachment?.mime_type || "").toLowerCase();
	if (mime.startsWith("image/")) {
		return true;
	}
	return IMAGE_FILE_PATTERN.test(fileNameOf(attachment?.file_path));
}

function formatStamp(value) {
	if (!value) {
		return "--";
	}
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "--" : date.toLocaleString();
}

const EMPTY = [];
const panelClasses = "rounded-2xl border border-white/10 bg-white/5 p-4";
const subtleText = "text-[11px] text-slate-400";
const monoLine = "font-mono text-[10px] text-slate-400";

function Empty({ children }) {
	return <p class="text-[11px] text-slate-500">{children}</p>;
}

/** Overview: who, what, when, where in the pipeline. */
function OverviewPanel({ caseRow, clientUser, reportStatus, feedback = null }) {
	const clientName = clientUser?.name || clientUser?.email || caseRow?.user_id || "--";
	return (
		<div class={panelClasses}>
			<h3 class="text-sm font-semibold text-slate-100">{caseRow?.subject || "Support case"}</h3>
			<div class="mt-3 grid grid-cols-1 gap-3 text-[11px] sm:grid-cols-2">
				<div>
					<p class="uppercase tracking-[0.18em] text-slate-500">Client</p>
					<p class="mt-1 text-slate-200">{clientName}</p>
					{clientUser?.email && clientUser.name !== clientUser.email ? (
						<p class="text-slate-500">{clientUser.email}</p>
					) : null}
				</div>
				<div>
					<p class="uppercase tracking-[0.18em] text-slate-500">Case</p>
					<p class="mt-1 font-mono text-slate-200" title={caseRow?.id}>
						{String(caseRow?.id || "--").slice(0, 12)}
						{caseRow?.ticket_id ? ` · ticket ${caseRow.ticket_id}` : ""}
					</p>
				</div>
				<div>
					<p class="uppercase tracking-[0.18em] text-slate-500">Submitted</p>
					<p class="mt-1 tabular-nums text-slate-200">{formatStamp(caseRow?.created_at)}</p>
				</div>
				<div>
					<p class="uppercase tracking-[0.18em] text-slate-500">Updated</p>
					<p class="mt-1 tabular-nums text-slate-200">{formatStamp(caseRow?.updated_at)}</p>
				</div>
			</div>
			{feedback ? (
				<div class="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 px-4 py-3 text-[11px]">
					<p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
						Client feedback
					</p>
					<p class="mt-1 text-xs text-emerald-200/90">
						{feedback.rating === "up"
							? "Solved — useful investigation"
							: "Not useful — investigation missed the mark"}
					</p>
					{feedback.note ? (
						<p class="mt-2 whitespace-pre-wrap text-[11px] leading-5 text-emerald-100/80">
							{feedback.note}
						</p>
					) : null}
					<p class="mt-2 text-[10px] text-emerald-200/60">
						Saved {new Date(feedback.updated_at).toLocaleString()}
					</p>
				</div>
			) : null}
			<div class="mt-4 flex flex-wrap items-center gap-2">
				<PriorityChip priority={caseRow?.priority} />
				<InvestigationStatusChip status={caseRow?.status} />
				<ReportStatusPill status={reportStatus} />
				{caseRow?.escalated ? (
					<span class="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-300">
						Escalated
					</span>
				) : null}
				{caseRow?.retain ? (
					<span class="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-purple-400">
						Retained
					</span>
				) : null}
			</div>
			<StageRail status={caseRow?.status} class="mt-4" />
			{caseRow?.summary ? (
				<p class="mt-4 border-t border-white/5 pt-4 text-[11px] leading-relaxed text-slate-300">
					{caseRow.summary}
				</p>
			) : null}
		</div>
	);
}

/** Conversation: right bubble for the client, left bubble for everyone else. */
function ConversationPanel({ messages = EMPTY }) {
	const list = Array.isArray(messages) ? messages : EMPTY;
	const isClientSide = (role) =>
		["client", "buyer", "user"].includes(String(role || "").toLowerCase());
	return (
		<div class={panelClasses}>
			{list.length === 0 ? <Empty>No messages.</Empty> : null}
			<div class="space-y-2">
				{list.map((message) => {
					const clientSide = isClientSide(message?.role);
					return (
						<div key={message.id} class={clientSide ? "flex justify-end" : "flex justify-start"}>
							<div
								class={`max-w-[80%] rounded-2xl border px-3 py-2 ${
									clientSide
										? "border-purple-500/30 bg-purple-500/15"
										: "border-white/10 bg-white/5"
								}`}
							>
								<p class={subtleText}>
									#{message.sequence} · {message.role}
									{message.kind ? ` · ${message.kind}` : ""}
									{message.agent ? ` · ${message.agent}` : ""}
									{message.created_at ? ` · ${formatStamp(message.created_at)}` : ""}
								</p>
								{/* The stored content is HTML-escaped by the server, so it renders as TEXT. */}
								<p class="mt-1 whitespace-pre-wrap text-xs text-slate-100">{message.content}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

/** Evidence: signed-url thumbnail grid, opening the shared viewer modal. */
function EvidencePanel({ attachments = EMPTY }) {
	const list = Array.isArray(attachments) ? attachments : EMPTY;
	const [signedUrls, setSignedUrls] = useState({});
	const [viewerIndex, setViewerIndex] = useState(null);
	const signedRef = useRef(new Set());

	// Mint signed urls once per path, for the previews and the viewer. The raw
	// path never renders.
	useEffect(() => {
		let cancelled = false;
		for (const attachment of list) {
			const path = attachment?.file_path;
			if (!path || signedRef.current.has(path)) {
				continue;
			}
			signedRef.current.add(path);
			signOne(path)
				.then((url) => {
					if (!cancelled) {
						setSignedUrls((prev) => ({ ...prev, [path]: url ?? null }));
					}
				})
				.catch(() => {
					if (!cancelled) {
						setSignedUrls((prev) => ({ ...prev, [path]: null }));
					}
				});
		}
		return () => {
			cancelled = true;
		};
		// The list identity is stable per loaded case; re-minting is guarded above.
	}, [list]);

	const viewerItems = list.map((attachment) => ({
		url: signedUrls[attachment?.file_path] ?? "",
		name: fileNameOf(attachment?.file_path),
		type: attachment?.mime_type ?? "",
		size: Number(attachment?.byte_size) || undefined,
	}));

	return (
		<div class={panelClasses}>
			{list.length === 0 ? <Empty>No evidence attached to this case.</Empty> : null}
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
				{list.map((attachment, index) => {
					const path = attachment?.file_path;
					const name = fileNameOf(path);
					const url = signedUrls[path];
					const isImage = isImageAttachment(attachment);
					return (
						<button
							key={path || attachment?.id || index}
							type="button"
							onClick={() => setViewerIndex(index)}
							aria-label={`Open evidence ${name}`}
							class="group overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition hover:border-cyan-400/40"
						>
							<span class="flex h-24 w-full items-center justify-center overflow-hidden bg-[#0b0714]">
								{isImage && url ? (
									<img src={url} alt={name} loading="lazy" class="h-full w-full object-cover" />
								) : (
									<FileText class="h-7 w-7 text-cyan-300/80" aria-hidden="true" />
								)}
							</span>
							<span class="block truncate px-2 py-1.5 text-[10px] text-slate-300">{name}</span>
						</button>
					);
				})}
			</div>
			{viewerIndex !== null && viewerItems.length > 0 ? (
				<EvidenceViewerModal
					items={viewerItems}
					index={Math.min(viewerIndex, viewerItems.length - 1)}
					onClose={() => setViewerIndex(null)}
					onNavigate={setViewerIndex}
				/>
			) : null}
		</div>
	);
}

/** Code findings: one card per investigation role, findings with file:line evidence. */
function FindingsPanel({ investigations = EMPTY }) {
	const list = Array.isArray(investigations) ? investigations : EMPTY;
	return (
		<div class={panelClasses}>
			{list.length === 0 ? <Empty>No investigation has run yet.</Empty> : null}
			<div class="space-y-3">
				{list.map((investigation) => {
					const findings = Array.isArray(investigation?.findings?.findings)
						? investigation.findings.findings
						: [];
					const limitations = Array.isArray(investigation?.findings?.limitations)
						? investigation.findings.limitations
						: [];
					return (
						<div key={investigation.id} class="rounded-xl border border-white/10 bg-white/5 p-3">
							<div class="flex flex-wrap items-center gap-2">
								<span class="rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
									{investigation.role}
								</span>
								<span class={subtleText}>
									{investigation.status} · attempt {investigation.attempt}
									{investigation.model_id ? ` · ${investigation.model_id}` : ""}
								</span>
							</div>
							{investigation.error ? (
								<p class="mt-2 text-[11px] text-rose-400">{investigation.error}</p>
							) : null}
							{investigation.findings?.summary ? (
								<p class="mt-2 text-xs text-slate-200">{investigation.findings.summary}</p>
							) : null}
							{findings.map((finding) => (
								<div
									key={`${investigation.id}-${finding.confidence}-${finding.detail}`}
									class="mt-2 border-t border-white/5 pt-2"
								>
									<ConfidenceChip confidence={finding.confidence} />
									<p class="mt-1 text-xs text-slate-100">{finding.detail}</p>
									{Array.isArray(finding.evidence) && finding.evidence.length > 0 ? (
										<ul class="mt-1.5 space-y-1">
											{finding.evidence.map((entry) => (
												<li key={`${entry.file}-${entry.lines}-${entry.commit}`} class={monoLine}>
													{entry.file}
													{entry.lines ? `:${entry.lines}` : ""}
													{entry.commit ? ` @ ${String(entry.commit).slice(0, 8)}` : ""}
													{EXTERNAL_URL_PATTERN.test(String(entry.url || "")) ? (
														<>
															{" · "}
															<a
																href={entry.url}
																target="_blank"
																rel="noreferrer"
																class="text-cyan-300 hover:underline"
															>
																{`Open ${entry.file || "evidence link"}`}
															</a>
														</>
													) : null}
												</li>
											))}
										</ul>
									) : null}
								</div>
							))}
							{limitations.length > 0 ? (
								<p class="mt-2 text-[11px] text-slate-500">
									Limitations: {limitations.join(" · ")}
								</p>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
}

/** Activity: the tool-call log. Tool, status, optional error - never reasoning. */
const runStatusClass = (status) => {
	const key = String(status || "").toLowerCase();
	if (["ok", "completed", "complete", "done", "success"].includes(key)) {
		return "text-emerald-300";
	}
	if (["failed", "error"].includes(key)) {
		return "text-rose-300";
	}
	return "text-slate-400";
};

/**
 * Activity: one group per investigation run, oldest first.
 *
 * A case can be investigated more than once (a re-run writes new rows), so
 * the runs stay separate: the owner reads which role answered, with which
 * model, in what state, and then replays that run's tool calls in order.
 */
function ActivityPanel({ timeline = EMPTY }) {
	const runs = Array.isArray(timeline) ? timeline : EMPTY;
	return (
		<div class={panelClasses}>
			{runs.length === 0 ? <Empty>No investigation run was recorded.</Empty> : null}
			<ol class="space-y-3">
				{runs.map((run, index) => (
					<li key={run.key} class="rounded-xl border border-white/5 bg-white/5 p-3">
						<header class="flex flex-wrap items-center gap-x-3 gap-y-1">
							<span class="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-300/80">
								{run.role}
							</span>
							<span class="font-mono text-[10px] text-slate-400">{run.model}</span>
							<span class={`font-mono text-[10px] uppercase ${runStatusClass(run.status)}`}>
								{run.status}
							</span>
							<span class="ml-auto font-mono text-[10px] text-slate-500">
								run {index + 1}
								{run.attempt ? ` · attempt ${run.attempt}` : ""}
							</span>
						</header>
						{run.startedAt ? (
							<p class="mt-1 font-mono text-[10px] text-slate-500">
								{formatStamp(run.startedAt)}
								{run.completedAt ? ` → ${formatStamp(run.completedAt)}` : ""}
							</p>
						) : null}
						{run.calls.length === 0 ? (
							<p class="mt-2 text-[11px] text-slate-500">No tool call was recorded.</p>
						) : (
							<ol class="mt-2 space-y-1">
								{run.calls.map((call, callIndex) => (
									<li
										key={call.key}
										class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-lg border border-white/5 bg-black/20 px-3 py-1.5"
									>
										<span class="w-6 shrink-0 font-mono text-[10px] text-slate-500">
											{callIndex + 1}.
										</span>
										<span class="font-mono text-[11px] text-slate-100">{call.tool}</span>
										<span class={`font-mono text-[10px] uppercase ${runStatusClass(call.status)}`}>
											{call.status}
										</span>
										{call.error ? (
											<span class="w-full text-[11px] text-rose-400">{call.error}</span>
										) : null}
									</li>
								))}
							</ol>
						)}
					</li>
				))}
			</ol>
		</div>
	);
}

/** Email report: delivery pill + resend via the existing rerun action. */
function EmailReportPanel({ caseRow, report, busy, onResendReport }) {
	const deliveredAt = caseRow?.report_delivered_at;
	return (
		<div class={panelClasses}>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p class="uppercase tracking-[0.18em] text-slate-500">Report email</p>
					<div class="mt-2 flex flex-wrap items-center gap-2">
						<ReportStatusPill status={caseRow?.report_status} />
						<span class={subtleText}>
							{deliveredAt ? `Delivered ${formatStamp(deliveredAt)}` : "Not delivered yet"}
						</span>
					</div>
				</div>
				<button
					type="button"
					onClick={onResendReport}
					disabled={busy}
					class="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Resend report
				</button>
			</div>
			{report ? (
				<pre class="mt-4 max-h-96 overflow-auto whitespace-pre-wrap border-t border-white/5 pt-4 font-sans text-[11px] leading-relaxed text-slate-200">
					{report}
				</pre>
			) : (
				<p class="mt-4 border-t border-white/5 pt-4 text-[11px] text-slate-500">
					No report has been written yet.
				</p>
			)}
		</div>
	);
}

/**
 * The tabbed detail region. Everything above this (subject header, escalate /
 * re-run actions, escalation note) stays in the parent section.
 *
 * @param {Object} props
 * @param {Object} props.caseRow - the support_cases row
 * @param {Object|null} [props.clientUser] - the joined users row, when the admin has one
 * @param {Array} [props.messages]
 * @param {Array} [props.investigations]
 * @param {Array} [props.attachments]
 * @param {Array} [props.timeline]
 * @param {string} [props.report]
 * @param {boolean} [props.busy]
 * @param {() => void} [props.onResendReport]
 */
export function CaseDetailTabs({
	caseRow,
	clientUser = null,
	messages = EMPTY,
	investigations = EMPTY,
	attachments = EMPTY,
	timeline = EMPTY,
	report = "",
	busy = false,
	onResendReport,
	feedback = null,
}) {
	const [activeTab, setActiveTab] = useState("overview");

	const onTabKeyDown = (event) => {
		if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
			return;
		}
		const current = TABS.findIndex((tab) => tab.id === activeTab);
		const delta = event.key === "ArrowRight" ? 1 : -1;
		const next = TABS[(current + delta + TABS.length) % TABS.length];
		setActiveTab(next.id);
		document.getElementById(`case-tab-${next.id}`)?.focus();
	};

	const panels = {
		overview: (
			<OverviewPanel
				caseRow={caseRow}
				clientUser={clientUser}
				reportStatus={caseRow?.report_status}
				feedback={feedback}
			/>
		),
		conversation: <ConversationPanel messages={messages} />,
		evidence: <EvidencePanel attachments={attachments} />,
		findings: <FindingsPanel investigations={investigations} />,
		activity: <ActivityPanel timeline={timeline} />,
		email: (
			<EmailReportPanel
				caseRow={caseRow}
				report={report}
				busy={busy}
				onResendReport={onResendReport}
			/>
		),
	};

	return (
		<div>
			<div
				role="tablist"
				aria-label="Case detail"
				onKeyDown={onTabKeyDown}
				class="flex flex-wrap items-center gap-1 border-b border-white/10"
			>
				{TABS.map((tab) => {
					const selected = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							id={`case-tab-${tab.id}`}
							type="button"
							role="tab"
							aria-selected={selected}
							aria-controls={`case-panel-${tab.id}`}
							onClick={() => setActiveTab(tab.id)}
							class={`rounded-t-lg border-b-2 px-3 py-2 text-[11px] font-semibold transition ${
								selected
									? "border-cyan-400 text-cyan-300"
									: "border-transparent text-slate-400 hover:text-slate-200"
							}`}
						>
							{tab.label}
						</button>
					);
				})}
			</div>
			{TABS.map((tab) => (
				<div
					key={tab.id}
					id={`case-panel-${tab.id}`}
					role="tabpanel"
					aria-labelledby={`case-tab-${tab.id}`}
					hidden={activeTab !== tab.id}
					class="pt-3"
				>
					{panels[tab.id]}
				</div>
			))}
		</div>
	);
}
