/*
  Route: /support/case/:caseId (public; guards stay on the API and in-page)

  The premium investigation workspace: three columns (left rail / center
  conversation / right investigation status) above 1024px, single column with
  two drawers below. Extracted from the legacy support page's case
  subtree, restyled to the premium spec. The case API contract and the SSE
  stream are untouched — src/hooks/useSupportCase.js owns both.

  The support-token buyer session comes from src/lib/supportToken.js (module
  state, never persisted). A signed-in visitor reads only their own case.

  "/support/case/new" is the pre-case route the landing sends a validated
  token to: no case exists yet, so the page shows a start CTA that creates the
  case and routes to its real id.
*/

import {
	Activity,
	AlertTriangle,
	ArrowRight,
	Bot,
	Check,
	ExternalLink,
	File,
	FileText,
	FileVideo,
	Image as ImageIcon,
	Lock,
	LogOut,
	PanelLeft,
	PanelRight,
	ShieldCheck,
	Sparkles,
	Trash2,
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { ActivityTree } from "../../components/support/ActivityTree.jsx";
import { Composer } from "../../components/support/Composer.jsx";
import { EvidenceViewerModal } from "../../components/support/EvidenceViewerModal.jsx";
import InvestigationModelPicker from "../../components/support/InvestigationModelPicker.jsx";
import { MermaidBlock } from "../../components/support/MermaidBlock.jsx";
import { StageRail } from "../../components/support/StageRail.jsx";
import {
	CheckTable,
	GuidedChips,
	PasteBox,
	StructuredUpload,
} from "../../components/support/StructuredReply.jsx";
import { useModalFocus } from "../../hooks/useModalFocus.js";
import { useSupportCase } from "../../hooks/useSupportCase.js";
import { apiRequest, getCurrentUser, getToken } from "../../lib/auth.js";
import { cn } from "../../lib/cn.js";
import { formatBytes } from "../../lib/formatBytes.js";
import { signOne } from "../../lib/signedFile.js";
import { clearSupportSession, getSupportSession } from "../../lib/supportToken.js";

// The six investigation steps, in run order. Derived from the case status —
// the case contract has no finer-grained stage event, so SSE does not drive
// them (support.case.progress rows are per-role, not per-step).
const INVESTIGATION_STEPS = [
	"Understanding complaint",
	"Gathering evidence",
	"Inspecting code",
	"Verifying causes",
	"Discussing findings",
	"Preparing report",
];

// Case status → the index of the active step; indices below it are done,
// above it are queued. "completed" parks the cursor past the end so every
// step renders done. "failed" idles every step.
const STEP_INDEX_BY_STATUS = {
	collecting: 0,
	investigating: 2,
	verifying: 3,
	reporting: 5,
	completed: INVESTIGATION_STEPS.length,
	failed: -1,
};

/** done | active | idle for one of the six investigation steps. */
function investigationStepState(index, activeStep) {
	if (activeStep === -1) {
		return "idle";
	}
	if (index < activeStep) {
		return "done";
	}
	if (index === activeStep) {
		return "active";
	}
	return "idle";
}

// Status pill tones for the recent-case list.
const RECENT_STATUS_TONE = {
	completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
	failed: "border-rose-400/30 bg-rose-400/10 text-rose-300",
	investigating: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
	verifying: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
	reporting: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
};

/**
 * The caller's recent cases, each one a link to open it. The current case is
 * highlighted and marked `aria-current="page"`. Hidden entirely while loading
 * or on error; renders "No other cases yet" when the list is empty.
 */
function RecentCasesSection({ state, currentCaseId }) {
	if (state === null || state === "error") {
		return null;
	}
	const rows = state;
	return (
		<div>
			<p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99bbd]">
				Recent cases ({rows.length})
			</p>
			{rows.length === 0 ? (
				<p class="text-[11px] text-[#a99bbd]">No other cases yet.</p>
			) : (
				<ul class="space-y-1.5">
					{rows.map((entry) => {
						const id = String(entry?.id ?? "");
						const status = String(entry?.status ?? "collecting").toLowerCase();
						const tone =
							RECENT_STATUS_TONE[status] ?? "border-slate-400/30 bg-slate-400/10 text-slate-400";
						const label = status.charAt(0).toUpperCase() + status.slice(1);
						const title = entry?.subject || entry?.summary || "Untitled case";
						const when = entry?.updated_at || entry?.created_at;
						const isCurrent = id !== "" && id === currentCaseId;
						return (
							<li key={id}>
								<Link
									to={`/support/case/${id}`}
									aria-current={isCurrent ? "page" : undefined}
									class={cn(
										"flex w-full items-center gap-2 rounded-lg border p-2 text-left transition",
										isCurrent
											? "border-purple-500/40 bg-purple-500/10"
											: "border-white/10 bg-white/5 hover:border-cyan-400/30 hover:bg-white/10",
									)}
								>
									<span class="min-w-0 flex-1">
										<span class="block truncate font-mono text-[10px] text-[#a99bbd]">
											{id.slice(0, 8)}
										</span>
										<span class="mt-0.5 block truncate text-[11px] leading-4 text-[#f4eeff]">
											{title}
										</span>
									</span>
									<span class="flex shrink-0 flex-col items-end gap-1">
										<span
											class={cn(
												"inline-flex rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
												tone,
											)}
										>
											{label}
										</span>
										{when ? (
											<span class="text-[9px] tabular-nums text-[#a99bbd]">
												{new Date(when).toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "short",
												})}
											</span>
										) : null}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}

// The three confidence levels a finding can carry (contracts.md §5).
const CONFIDENCE_LABELS = {
	confirmed: "Confirmed",
	probable: "Probable",
	speculative: "Speculative",
};

// The six capability rows in the right rail. The pills come from
// GET /api/support/capabilities: until that answers — or when it fails — every
// pill reads "Unknown", never "Authorized" without the server saying so.
const CAPABILITY_ROWS = [
	{ label: "Repository inspection", key: "repositoryInspection" },
	{ label: "GitHub history", key: "githubHistory" },
	{ label: "Render services", key: "renderServices" },
	{ label: "Parallel research", key: "research" },
	{ label: "Library docs", key: "libraryDocs" },
	{ label: "Approved application data", key: "applicationData" },
];

const PILL_AUTHORIZED = "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
const PILL_UNAVAILABLE = "border-slate-400/30 bg-slate-400/10 text-slate-400";

/** The pill for one capability: authorized only when the endpoint said so. */
function capabilityPill(capabilities, key) {
	if (capabilities === null || capabilities === "error") {
		return { label: "Unknown", className: PILL_UNAVAILABLE };
	}
	return capabilities[key] === true
		? { label: "Authorized", className: PILL_AUTHORIZED }
		: { label: "Unavailable", className: PILL_UNAVAILABLE };
}

// Top level, so they are compiled once.
const IMAGE_FILE_PATTERN = /\.(png|jpe?g|gif|webp|avif|bmp)$/iu;
const EXTERNAL_URL_PATTERN = /^https?:\/\//iu;

/** Reverses the HTML escaping the server applies to stored message content. */
function decodeStoredText(value) {
	return String(value ?? "")
		.replace(/&lt;/gu, "<")
		.replace(/&gt;/gu, ">")
		.replace(/&quot;/gu, '"')
		.replace(/&#39;/gu, "'")
		.replace(/&amp;/gu, "&");
}

/** The display name of a stored file — only the LAST path segment ever reaches the DOM. */
function fileNameOf(filePath) {
	const raw = String(filePath || "");
	const [withoutQuery] = raw.split("?");
	const [withoutHash] = withoutQuery.split("#");
	const parts = withoutHash.split("/").filter(Boolean);
	return parts.length > 0 ? (parts.at(-1) ?? "attachment") : "attachment";
}

/** Whether a stored file is an image, so the page can offer a preview. */
function isImageAttachment(attachment) {
	const mime = String(attachment?.mime_type || "").toLowerCase();
	if (mime.startsWith("image/")) {
		return true;
	}
	return IMAGE_FILE_PATTERN.test(fileNameOf(attachment?.file_path));
}

/** An external link, but only an http(s) one; a relative path is never rendered as one. */
function safeExternalUrl(value) {
	const raw = String(value ?? "").trim();
	if (!EXTERNAL_URL_PATTERN.test(raw)) {
		return null;
	}
	return raw;
}

/** The icon that stands for one attachment, by mime type. */
function attachmentIcon(attachment) {
	const mime = String(attachment?.mime_type || "").toLowerCase();
	if (mime.startsWith("image/")) {
		return ImageIcon;
	}
	if (mime.startsWith("video/")) {
		return FileVideo;
	}
	if (mime.startsWith("text/") || mime === "application/pdf") {
		return FileText;
	}
	return File;
}

// The tags the intake assistant may emit that this bubble renders as
// structure: severity pills, symptom / root-cause callouts, Upload/Paste
// cards, Guided Chips, Check tables, and <details> collapsible sections.
// Everything else stays plain markdown. Never markup-injected by the assistant.
const SEVERITY_EMOJI_TONE = {
	"🔴": "border-rose-500/40 bg-rose-500/15 text-rose-200",
	"🟠": "border-amber-400/40 bg-amber-500/15 text-amber-200",
	"🟡": "border-yellow-400/40 bg-yellow-500/15 text-yellow-200",
	"🟢": "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
	"🔵": "border-cyan-400/40 bg-cyan-500/15 text-cyan-200",
};
const SEVERITY_PATTERN = /^Severity:\s*(🔴|🟠|🟡|🟢|🔵)\s*(.+)$/u;
const SYMPTOM_PATTERN = /^Symptom:\s*(.+)$/iu;
const ROOT_CAUSE_PATTERN = /^Root cause:\s*(.+)$/iu;
const UPLOAD_PATTERN = /^Upload:\s*(.+)$/iu;
const PASTE_PATTERN = /^Paste:\s*(.+)$/iu;
const CHIPS_PATTERN = /^Chips:\s*(.+\|.+)$/iu;
const CHECKTABLEROWS = /^Check:\s*(.+)\|\s*(ok|fail|missing|pass)$/iu;
const DETAILS_OPEN_PATTERN = /^<details>$/u;
const DETAILS_CLOSE_PATTERN = /^<\/details>$/u;

/** Split a block of text into sections the bubble renders distinctly. */
function parseStructuredBlocks(body) {
	const lines = String(body || "").split("\n");
	const blocks = [];
	let text = [];
	let details = null;
	let checks = [];
	const pushText = () => {
		if (text.length > 0) {
			const joined = text
				.join("\n")
				.replace(/\n{3,}/gu, "\n\n")
				.trim();
			if (joined) {
				blocks.push({ kind: "markdown", text: joined });
			}
			text = [];
		}
	};
	const flushChecks = () => {
		if (checks.length > 0) {
			blocks.push({ kind: "checktable", rows: checks });
			checks = [];
		}
	};
	for (const line of lines) {
		const trimmed = line.trim();
		if (details) {
			if (DETAILS_CLOSE_PATTERN.test(trimmed)) {
				blocks.push({ kind: "details", content: details.join("\n").trim() });
				details = null;
				continue;
			}
			details.push(line);
			continue;
		}
		const severity = trimmed.match(SEVERITY_PATTERN);
		if (severity) {
			pushText();
			flushChecks();
			blocks.push({ kind: "severity", emoji: severity[1], label: severity[2].trim() });
			continue;
		}
		const symptom = trimmed.match(SYMPTOM_PATTERN);
		if (symptom) {
			pushText();
			flushChecks();
			blocks.push({ kind: "symptom", text: symptom[1].trim() });
			continue;
		}
		const rootCause = trimmed.match(ROOT_CAUSE_PATTERN);
		if (rootCause) {
			pushText();
			flushChecks();
			blocks.push({ kind: "rootcause", text: rootCause[1].trim() });
			continue;
		}
		const upload = trimmed.match(UPLOAD_PATTERN);
		if (upload) {
			pushText();
			flushChecks();
			blocks.push({ kind: "dropzone", label: upload[1].trim().slice(0, 80) });
			continue;
		}
		const paste = trimmed.match(PASTE_PATTERN);
		if (paste) {
			pushText();
			flushChecks();
			blocks.push({ kind: "pastebox", hint: paste[1].trim().slice(0, 60) });
			continue;
		}
		const chips = trimmed.match(CHIPS_PATTERN);
		if (chips) {
			pushText();
			flushChecks();
			const list = chips[1]
				.split("|")
				.map((s) => s.trim())
				.filter(Boolean)
				.slice(0, 5);
			if (list.length > 0) {
				blocks.push({ kind: "chips", chips: list });
			}
			continue;
		}
		const check = trimmed.match(CHECKTABLEROWS);
		if (check) {
			pushText();
			checks.push({
				label: check[1].trim().slice(0, 120),
				ok: check[2].toLowerCase() !== "fail" && check[2].toLowerCase() !== "missing",
			});
			continue;
		}
		flushChecks();
		if (DETAILS_OPEN_PATTERN.test(trimmed)) {
			pushText();
			details = [];
			continue;
		}
		text.push(line);
	}
	pushText();
	flushChecks();
	if (details) {
		blocks.push({ kind: "details", content: details.join("\n").trim() });
	}
	return blocks;
}

const DETAILS_SUMMARY = "View technical details";

function BubbleRichBody({ body, onAttachFile, sending, onSend }) {
	const blocks = parseStructuredBlocks(body);
	const markdownComponents = {
		code: ({ className: _cn, children, ...props }) => {
			const text = String(children ?? "");
			const langMatch = /language-(\w+)/u.exec(_cn ?? "");
			const lang = langMatch?.[1] ?? "";
			if (lang === "mermaid") {
				return <MermaidBlock chart={text} />;
			}
			return (
				<pre class="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-[#0b0714] p-3 font-mono text-[11px] leading-5 text-[#cfc3e6]">
					<code {...props}>{text}</code>
				</pre>
			);
		},
		table: ({ children, ...props }) => (
			<div class="my-2 overflow-x-auto rounded-xl border border-white/10">
				<table {...props} class="w-full text-left text-[11px] text-[#f4eeff]">
					{children}
				</table>
			</div>
		),
	};
	return (
		<div class="mt-1 space-y-2">
			{blocks.map((block, index) => {
				switch (block.kind) {
					case "severity":
						return (
							<span
								key={index}
								class={cn(
									"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
									SEVERITY_EMOJI_TONE[block.emoji] ?? "border-white/10 bg-white/5 text-[#a99bbd]",
								)}
							>
								{block.emoji} {block.label}
							</span>
						);
					case "symptom":
						return (
							<div
								key={index}
								class="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2"
							>
								<p class="text-[10px] font-semibold uppercase tracking-wider text-amber-300/90">
									Symptom
								</p>
								<p class="mt-0.5 text-[12px] leading-5 text-amber-100">{block.text}</p>
							</div>
						);
					case "rootcause":
						return (
							<div
								key={index}
								class="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2"
							>
								<p class="text-[10px] font-semibold uppercase tracking-wider text-violet-300/90">
									Root cause
								</p>
								<p class="mt-0.5 text-[12px] leading-5 text-violet-100">{block.text}</p>
							</div>
						);
					case "dropzone":
						return (
							<StructuredUpload
								key={index}
								label={block.label}
								onAttach={(files) => onAttachFile?.(files)}
							/>
						);
					case "pastebox":
						return (
							<PasteBox
								key={index}
								hint={block.hint}
								placeholder="Paste the snippet, log line, or stack trace…"
								onSend={(text) => onSend?.(text)}
							/>
						);
					case "chips":
						return (
							<GuidedChips
								key={index}
								chips={block.chips}
								disabled={Boolean(sending)}
								onPick={(chip) => onSend?.(chip)}
							/>
						);
					case "checktable":
						return <CheckTable key={index} rows={block.rows} />;
					case "details":
						return (
							<details
								key={index}
								class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 [&_summary]:cursor-pointer [&_summary]:text-[11px] [&_summary]:font-semibold [&_summary]:text-[#a99bbd] [&_summary]:outline-none"
							>
								<summary class="select-none">{DETAILS_SUMMARY}</summary>
								<pre class="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] leading-5 text-[#cfc3e6]">
									{block.content}
								</pre>
							</details>
						);
					case "markdown":
						return (
							<ReactMarkdown
								key={index}
								remarkPlugins={[remarkGfm]}
								components={markdownComponents}
							>
								{block.text}
							</ReactMarkdown>
						);
					default:
						return (
							<p key={index} class="whitespace-pre-wrap break-words text-sm leading-6">
								{block.text}
							</p>
						);
				}
			})}
		</div>
	);
}

/** One message in the transcript. The body is rendered as TEXT, never markup.
 * Assistant messages additionally parse the SERVER-LESS structured hints the
 * intake assistant may emit (severity pill, symptom/root-cause cards,
 * <details> technical sections) and, when the parent wires `onFeedback`, two
 * buttons asking whether the last reply helped. */
function MessageBubble({
	message,
	onFeedback,
	feedbackDisabled = false,
	onAttachFile,
	sending,
	onSend,
}) {
	const role = String(message?.role || "system");
	const kind = String(message?.kind || "answer");
	const body = decodeStoredText(message?.content);

	const isClient = role === "client";
	const isAdmin = role === "admin";
	const isNotice = role === "system" || kind === "notice" || kind === "progress";

	let bubbleClass = "border-white/10 bg-white/5 text-[#f4eeff]";
	if (isClient) {
		bubbleClass = "border-purple-500/30 bg-purple-500/10 text-purple-50";
	} else if (isAdmin) {
		bubbleClass = "border-amber-400/20 bg-amber-500/5 text-amber-100";
	}

	let label = "Assistant";
	if (isClient) {
		label = "You";
	} else if (isAdmin) {
		label = "Support";
	}

	if (isNotice) {
		return (
			<div class="flex justify-center">
				<p class="max-w-[85%] rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-xs text-[#a99bbd]">
					{body}
				</p>
			</div>
		);
	}

	const showFeedback = typeof onFeedback === "function" && !isClient && !isAdmin && !isNotice;

	return (
		<div class={`flex ${isClient ? "justify-end" : "justify-start"}`}>
			<div class={cn("max-w-[85%] rounded-2xl border px-4 py-3", bubbleClass)}>
				<p class={cn("text-xs font-semibold", isClient ? "text-purple-400" : "text-[#a99bbd]")}>
					{label}
					{message?.agent ? ` · ${message.agent}` : ""}
				</p>
				<BubbleRichBody
					body={body}
					onAttachFile={onAttachFile}
					sending={feedbackDisabled}
					onSend={onSend}
				/>
				{showFeedback ? (
					<div class="mt-2.5 flex flex-wrap items-center gap-2">
						<button
							type="button"
							disabled={feedbackDisabled}
							onClick={() => onFeedback("fixed")}
							class="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
						>
							✅ Fixed it
						</button>
						<button
							type="button"
							disabled={feedbackDisabled}
							onClick={() => onFeedback("broken")}
							class="rounded-lg border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-300 transition hover:border-rose-400/50 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-50"
						>
							❌ Still broken
						</button>
					</div>
				) : null}
			</div>
		</div>
	);
}

/** The findings that arrived while the investigation ran. */
function FindingsPanel({ findingRows }) {
	return (
		<section aria-label="Findings" class="rounded-2xl border border-white/10 bg-white/5 p-4">
			<h3 class="text-sm font-semibold text-[#f4eeff]">Findings</h3>
			<ul class="mt-3 space-y-3">
				{findingRows.map(({ key, entry }) => {
					const finding = entry?.finding || {};
					const confidence = String(finding.confidence || "speculative");
					const evidence = Array.isArray(finding.evidence) ? finding.evidence : [];
					let tone = "bg-slate-500/15 text-slate-400";
					if (confidence === "confirmed") {
						tone = "bg-emerald-500/15 text-emerald-300";
					} else if (confidence === "probable") {
						tone = "bg-amber-500/15 text-amber-300";
					}
					return (
						<li key={key} class="rounded-xl border border-white/10 bg-[#0b0714]/60 p-3">
							<div class="flex flex-wrap items-center gap-2">
								<span class={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", tone)}>
									{CONFIDENCE_LABELS[confidence] || confidence}
								</span>
								{entry?.role ? (
									<span class="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-[#a99bbd]">
										{entry.role}
									</span>
								) : null}
							</div>
							<p class="mt-2 text-sm leading-6 text-[#f4eeff]">{finding.detail || ""}</p>
							{evidence.length > 0 ? (
								<ul class="mt-2 space-y-1">
									{evidence.map((item) => {
										const href = safeExternalUrl(item?.url);
										const label = item?.file || item?.commit || "evidence";
										const suffix = item?.lines ? ` (lines ${item.lines})` : "";
										return (
											<li key={`${label}${suffix}`} class="text-xs">
												{href ? (
													<a
														href={href}
														target="_blank"
														rel="noopener noreferrer"
														class="inline-flex items-center gap-1 text-cyan-300 underline underline-offset-2"
													>
														{label}
														{suffix}
														<ExternalLink class="h-3 w-3" aria-hidden="true" />
													</a>
												) : (
													<span class="text-[#a99bbd]">
														{label}
														{suffix}
													</span>
												)}
											</li>
										);
									})}
								</ul>
							) : null}
						</li>
					);
				})}
			</ul>
		</section>
	);
}

const REPORT_MARKDOWN_COMPONENTS = {
	a({ node: _node, href, children, ...props }) {
		const url = safeExternalUrl(href);
		if (!url) {
			return <span {...props}>{children}</span>;
		}
		return (
			<a {...props} href={url} target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		);
	},
	img({ node: _node, src, alt }) {
		const url = safeExternalUrl(src);
		if (!url) {
			return null;
		}
		return (
			<img
				src={url}
				alt={alt || ""}
				width={640}
				height={360}
				loading="lazy"
				class="max-w-full rounded-2xl"
			/>
		);
	},
};

/** The finished report, plus the ticket preview for the team. */
function ReportPanel({ report, confirming, confirmed, onConfirm, preview }) {
	return (
		<section
			aria-label="Investigation report"
			class="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4"
		>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h3 class="text-sm font-semibold text-[#f4eeff]">Investigation report</h3>
				{report?.reportStatus ? (
					<span class="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-[#a99bbd]">
						{report.reportStatus}
					</span>
				) : null}
			</div>
			<div class="mt-3 max-h-80 overflow-y-auto break-words text-sm leading-6 text-[#f4eeff]">
				<ReactMarkdown remarkPlugins={[remarkGfm]} components={REPORT_MARKDOWN_COMPONENTS}>
					{String(report?.report ?? "")}
				</ReactMarkdown>
			</div>
			{preview ? (
				<div class="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4">
					<p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
						Ticket preview — what goes to the support team
					</p>
					<dl class="mt-3 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
						<div class="min-w-0">
							<dt class="text-[10px] font-semibold uppercase tracking-wider text-[#a99bbd]">
								Client
							</dt>
							<dd class="mt-0.5 truncate text-[#f4eeff]">{preview.client}</dd>
						</div>
						<div class="min-w-0">
							<dt class="text-[10px] font-semibold uppercase tracking-wider text-[#a99bbd]">
								Severity
							</dt>
							<dd class="mt-0.5 text-[#f4eeff]">{preview.severity}</dd>
						</div>
						<div class="min-w-0 sm:col-span-2">
							<dt class="text-[10px] font-semibold uppercase tracking-wider text-[#a99bbd]">
								Problem
							</dt>
							<dd class="mt-0.5 text-[#f4eeff]">{preview.problem}</dd>
						</div>
						<div>
							<dt class="text-[10px] font-semibold uppercase tracking-wider text-[#a99bbd]">
								Steps tried
							</dt>
							<dd class="mt-0.5 tabular-nums text-[#f4eeff]">
								{preview.stepsTried} {preview.stepsTried === 1 ? "message" : "messages"}
							</dd>
						</div>
						<div>
							<dt class="text-[10px] font-semibold uppercase tracking-wider text-[#a99bbd]">
								Findings
							</dt>
							<dd class="mt-0.5 tabular-nums text-[#f4eeff]">{preview.findingCount} total</dd>
						</div>
					</dl>
					{preview.note ? (
						<p class="mt-3 text-[11px] leading-5 text-cyan-200">{preview.note}</p>
					) : null}
				</div>
			) : null}
			<div class="mt-4 flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={onConfirm}
					disabled={confirming || confirmed}
					class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#c026d3] px-4 py-2.5 text-xs font-semibold text-[#f4eeff] transition motion-reduce:transition-none hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{confirming ? (
						<ThreeDot variant="bounce" color="#f4eeff" size="small" text="" textColor="" />
					) : (
						<Check class="h-4 w-4" />
					)}
					Confirm this is accurate
				</button>
				{confirmed ? (
					<p class="text-xs text-emerald-300">Thanks — your confirmation was recorded.</p>
				) : null}
			</div>
		</section>
	);
}

/**
 * The premium investigation workspace — the central /support route.
 */
export default function SupportWorkspace() {
	const { caseId: rawCaseId } = useParams();
	const navigate = useNavigate();
	const jwt = useMemo(() => getToken(), []);
	const supportToken = useMemo(() => getSupportSession()?.token ?? "", []);
	const isNew = !rawCaseId || rawCaseId === "new";
	const [createdCaseId, setCreatedCaseId] = useState(null);
	const caseId = isNew ? createdCaseId : rawCaseId;

	const supportCase = useSupportCase(caseId ?? null, supportToken);

	const [creating, setCreating] = useState(false);
	const [sending, setSending] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [confirmed, setConfirmed] = useState(false);
	const [notice, setNotice] = useState("");
	const [problem, setProblem] = useState("");
	const [uploads, setUploads] = useState([]); // { key, file, name, status, pct }
	const [viewerIndex, setViewerIndex] = useState(null);
	const [signedUrls, setSignedUrls] = useState({});
	const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
	const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
	// null while the capabilities request is in flight; "error" when it fails;
	// otherwise the envelope from GET /api/support/capabilities.
	const [capabilities, setCapabilities] = useState(null);
	// The caller's cases: null while loading, "error" on failure, rows otherwise.
	const [recentCases, setRecentCases] = useState(null);

	const transcriptRef = useRef(null);
	const leftDrawerRef = useRef(null);
	const rightDrawerRef = useRef(null);
	const descriptorsRef = useRef(new Map()); // File -> uploaded descriptor
	const inflightRef = useRef(new Set()); // Files whose upload has started
	const signedRef = useRef(new Set()); // Paths a signature was asked for
	const uploadKeyRef = useRef(0);

	const caseStatus = supportCase.status || supportCase.caseRow?.status || "collecting";
	const attachments = useMemo(() => supportCase.attachments ?? [], [supportCase.attachments]);
	const messages = supportCase.messages ?? [];
	const messageCount = messages.length;
	const failure = problem || supportCase.error || "";
	const isInvestigating = caseStatus === "investigating";
	const statusLabel = isInvestigating ? "Investigating" : "Ready";
	const activeStep = STEP_INDEX_BY_STATUS[String(caseStatus).toLowerCase()] ?? 0;

	// A 401 from any case request means the token was revoked, expired or
	// deleted: drop it and go back to the landing.
	const errorStatus = supportCase.errorStatus ?? null;
	useEffect(() => {
		if (errorStatus === 401) {
			clearSupportSession();
			navigate("/support", { replace: true });
		}
	}, [errorStatus, navigate]);

	// Load the investigation capabilities once on mount. Failure is not a
	// reason to claim access: the pills fall back to "Unknown".
	useEffect(() => {
		let cancelled = false;
		apiRequest("/support/capabilities", {
			token: jwt ?? undefined,
			headers: supportToken ? { "x-support-token": supportToken } : undefined,
			skipSessionClear: Boolean(supportToken),
		})
			.then((data) => {
				if (cancelled) {
					return;
				}
				setCapabilities(data && typeof data === "object" ? data : "error");
			})
			.catch(() => {
				if (!cancelled) {
					setCapabilities("error");
				}
			});
		return () => {
			cancelled = true;
		};
	}, [jwt, supportToken]);

	// Recent cases for the left rail: fetched on mount and whenever the
	// current case changes. Failure hides the section entirely — a decorative
	// list must never block or break the workspace.
	useEffect(() => {
		let cancelled = false;
		apiRequest("/support/cases", {
			token: jwt ?? undefined,
			headers: supportToken ? { "x-support-token": supportToken } : undefined,
			skipSessionClear: Boolean(supportToken),
		})
			.then((data) => {
				if (cancelled) {
					return;
				}
				const rows = Array.isArray(data?.cases) ? data.cases : [];
				setRecentCases(rows.slice(0, 5));
			})
			.catch(() => {
				if (!cancelled) {
					setRecentCases("error");
				}
			});
		return () => {
			cancelled = true;
		};
	}, [caseId, jwt, supportToken]);

	// Escape closes either mobile drawer.
	const anyDrawerOpen = leftDrawerOpen || rightDrawerOpen;
	useModalFocus(leftDrawerOpen, leftDrawerRef, () => setLeftDrawerOpen(false));
	useModalFocus(rightDrawerOpen, rightDrawerRef, () => setRightDrawerOpen(false));
	useEffect(() => {
		if (!anyDrawerOpen) {
			return;
		}
		const onKeyDown = (event) => {
			if (event.key === "Escape") {
				setLeftDrawerOpen(false);
				setRightDrawerOpen(false);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [anyDrawerOpen]);

	// Keep the newest message in view. The transcript scrolls inside its own box.
	useEffect(() => {
		const node = transcriptRef.current;
		if (!node || messageCount === 0) {
			return;
		}
		node.scrollTop = node.scrollHeight;
	}, [messageCount]);

	// Mint signed urls for the attachments once each, for the previews and
	// the viewer. The raw path never renders.
	useEffect(() => {
		let cancelled = false;
		for (const attachment of attachments) {
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
	}, [attachments]);

	// Start queued uploads one at a time per file. The pct stays honest: the
	// HTTP layer gives no progress events, so "uploading" renders indeterminate.
	// attach lives on a ref so the effect only re-runs when the list itself does.
	const attachRef = useRef(supportCase.attach);
	attachRef.current = supportCase.attach;
	useEffect(() => {
		for (const upload of uploads) {
			if (upload.status !== "queued" || inflightRef.current.has(upload.file)) {
				continue;
			}
			inflightRef.current.add(upload.file);
			setUploads((prev) =>
				prev.map((entry) =>
					entry.key === upload.key ? { ...entry, status: "uploading", pct: null } : entry,
				),
			);
			attachRef
				.current(upload.file)
				.then((descriptor) => {
					inflightRef.current.delete(upload.file);
					if (descriptor) {
						descriptorsRef.current.set(upload.file, descriptor);
						setUploads((prev) =>
							prev.map((entry) =>
								entry.key === upload.key ? { ...entry, status: "done", pct: 100 } : entry,
							),
						);
						return;
					}
					setUploads((prev) =>
						prev.map((entry) =>
							entry.key === upload.key ? { ...entry, status: "error", pct: 0 } : entry,
						),
					);
				})
				.catch(() => {
					inflightRef.current.delete(upload.file);
					setUploads((prev) =>
						prev.map((entry) =>
							entry.key === upload.key ? { ...entry, status: "error", pct: 0 } : entry,
						),
					);
				});
		}
	}, [uploads]);

	const handleFiles = useCallback((files) => {
		setUploads((prev) => {
			const next = prev.filter((entry) => files.includes(entry.file));
			for (const file of files) {
				const tracked = next.some((entry) => entry.file === file);
				if (!tracked) {
					uploadKeyRef.current += 1;
					next.push({
						key: `upload-${uploadKeyRef.current}`,
						file,
						name: file.name,
						status: "queued",
						pct: 0,
					});
				}
			}
			return next;
		});
	}, []);

	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);

	async function deleteCase() {
		if (!caseId) {
			setDeleteConfirmOpen(false);
			return;
		}
		setDeleting(true);
		setProblem("");
		try {
			await apiRequest(`/support/cases/${encodeURIComponent(caseId)}`, {
				method: "DELETE",
				token: jwt ?? undefined,
				headers: supportToken ? { "x-support-token": supportToken } : undefined,
				skipSessionClear: Boolean(supportToken),
			});
			setDeleteConfirmOpen(false);
			clearSupportSession();
			navigate("/support", { replace: true });
		} catch (error) {
			setProblem(error instanceof Error ? error.message : "Unable to delete this case.");
		} finally {
			setDeleting(false);
		}
	}

	async function startCase() {
		if (!(jwt || supportToken)) {
			setProblem("Please sign in again to start an investigation.");
			return;
		}
		setCreating(true);
		setProblem("");
		setNotice("");
		try {
			const data = await apiRequest("/support/cases", {
				method: "POST",
				token: jwt ?? undefined,
				headers: supportToken ? { "x-support-token": supportToken } : undefined,
				skipSessionClear: Boolean(supportToken),
				body: {},
			});
			const id = data?.case?.id ?? null;
			if (!id) {
				setProblem("The server did not return an investigation. Please try again.");
				return;
			}
			setCreatedCaseId(id);
			setNotice("Investigation opened. Describe the problem below.");
			navigate(`/support/case/${id}`, { replace: true });
		} catch (err) {
			setProblem(err instanceof Error ? err.message : "Unable to open the investigation.");
		} finally {
			setCreating(false);
		}
	}

	async function handleSend(text, files) {
		if (!caseId) {
			setProblem("Open an investigation before sending a message.");
			return;
		}
		const attachmentList = (files || [])
			.map((file) => descriptorsRef.current.get(file))
			.filter(Boolean);
		setSending(true);
		setProblem("");
		setNotice("");
		try {
			const result = await supportCase.send(text, attachmentList);
			if (result) {
				descriptorsRef.current.clear();
				setUploads([]);
				setConfirmed(false);
			}
		} finally {
			setSending(false);
		}
	}

	async function handleConfirm() {
		if (!caseId) {
			return;
		}
		setConfirming(true);
		setProblem("");
		const wasCollecting = caseStatus === "collecting";
		try {
			const result = await supportCase.confirm();
			if (result) {
				setConfirmed(true);
				setNotice(wasCollecting ? "Investigation started." : "");
			}
		} finally {
			setConfirming(false);
		}
	}

	function endSession() {
		clearSupportSession();
		navigate("/support");
	}

	const openViewer = useCallback((index) => setViewerIndex(index), []);

	// Findings carry no id, so the key is built from the content. The counter
	// keeps two identical findings from colliding.
	const findingRows = useMemo(() => {
		const seen = new Map();
		return (supportCase.findings || []).map((entry) => {
			const base = `${entry?.role ?? "unknown"}:${entry?.finding?.detail ?? ""}`;
			const count = seen.get(base) ?? 0;
			seen.set(base, count + 1);
			return { key: `${base}#${count}`, entry };
		});
	}, [supportCase.findings]);
	const latestAssistantSeverity = useMemo(() => {
		const assistant = [...messages].reverse().find((m) => m?.role === "assistant");
		const match =
			typeof assistant?.content === "string"
				? assistant.content.match(/Severity:\s*(🔴|🟠|🟡|🟢|🔵)\s*([^\n]{1,40})/iu)
				: null;
		return match ? { emoji: match[1], label: match[2].trim() } : null;
	}, [messages]);

	const ticketPreview = useMemo(() => {
		if (!supportCase.report?.report) {
			return null;
		}
		const buyer = getSupportSession()?.buyer ?? getCurrentUser() ?? {};
		const buyerName = buyer?.name || buyer?.email || "You";
		const stepsTried = messages.filter((m) => String(m?.role ?? "") === "client").length;
		const confirmedCount = findingRows.filter(
			(row) => String(row?.finding?.confidence ?? "").toLowerCase() === "confirmed",
		).length;
		const probableCount = findingRows.filter(
			(row) => String(row?.finding?.confidence ?? "").toLowerCase() === "probable",
		).length;
		return {
			client: buyerName,
			problem: supportCase.caseRow?.subject || supportCase.caseRow?.summary || "Untitled case",
			stepsTried,
			findingCount: findingRows.length,
			confirmedCount,
			probableCount,
			severity: latestAssistantSeverity?.label ?? null,
			severityEmoji: latestAssistantSeverity?.emoji ?? null,
			note: "Confirming tells us the summary is accurate. The team gets it by email either way.",
		};
	}, [supportCase.report, supportCase.caseRow, messages, findingRows, latestAssistantSeverity]);

	const viewerItems = attachments.map((attachment) => ({
		url: signedUrls[attachment?.file_path] ?? "",
		name: fileNameOf(attachment?.file_path),
		type: attachment?.mime_type ?? "",
		size: Number(attachment?.byte_size) || undefined,
	}));

	const uploadsBusy = uploads.some(
		(entry) => entry.status === "queued" || entry.status === "uploading",
	);

	const leftRail = (
		<>
			<div class="flex items-center gap-3">
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#9333ea] to-[#c026d3] text-[#f4eeff]">
					<Bot class="h-5 w-5" aria-hidden="true" />
				</div>
				<div class="min-w-0">
					<p class="text-sm font-semibold text-[#f4eeff]">Support</p>
					<p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-400">
						AI Investigation
					</p>
				</div>
			</div>

			<div class="rounded-xl border border-white/10 bg-white/5 p-3">
				<p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99bbd]">
					Case reference
				</p>
				<p
					class="mt-1 truncate text-[12px] text-[#f4eeff]"
					title={supportCase.caseRow?.subject ?? ""}
				>
					{supportCase.caseRow?.subject || "Untitled case"}
				</p>
				<p class="mt-0.5 truncate font-mono text-[10px] text-[#a99bbd]" title={caseId ?? ""}>
					{caseId ? `case ${caseId}` : "not opened yet"}
				</p>
			</div>

			<div>
				<p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99bbd]">
					Case progress
				</p>
				<StageRail status={caseStatus} />
			</div>

			<RecentCasesSection state={recentCases} currentCaseId={caseId ?? null} />

			<div class="min-h-0">
				<p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99bbd]">
					Evidence ({attachments.length})
				</p>
				{attachments.length === 0 ? (
					<p class="text-[11px] text-[#a99bbd]">No evidence yet.</p>
				) : (
					<ul class="space-y-1.5">
						{attachments.map((attachment, index) => {
							const name = fileNameOf(attachment?.file_path);
							const Icon = attachmentIcon(attachment);
							return (
								<li key={attachment.file_path}>
									<button
										type="button"
										onClick={() => openViewer(index)}
										aria-label={`Open evidence ${name}`}
										class="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
									>
										<Icon class="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
										<span class="min-w-0 flex-1 truncate text-[11px] text-[#f4eeff]">{name}</span>
										{attachment?.byte_size ? (
											<span class="shrink-0 text-[10px] tabular-nums text-[#a99bbd]">
												{formatBytes(attachment.byte_size)}
											</span>
										) : null}
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>

			<div class="flex gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
				<Lock class="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
				<p class="text-[11px] leading-5 text-[#f4eeff]">
					Private session. Evidence is visible only to you and the support team. Nothing is shared
					publicly.
				</p>
			</div>

			<button
				type="button"
				onClick={endSession}
				class="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-[#f4eeff] transition hover:border-rose-400/30 hover:bg-white/10"
			>
				<LogOut class="h-4 w-4" aria-hidden="true" />
				End session
			</button>
		</>
	);

	const rightRail = (
		<>
			<div>
				<p class="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-400">
					<Activity class="h-3.5 w-3.5" aria-hidden="true" />
					Investigation
				</p>
				<ol>
					{INVESTIGATION_STEPS.map((step, index) => {
						const resolvedState = investigationStepState(index, activeStep);
						const chip =
							resolvedState === "done"
								? "border-purple-500/30 bg-purple-500/10 text-purple-400"
								: resolvedState === "active"
									? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
									: "border-white/10 bg-white/5 text-[#a99bbd]";
						return (
							<li
								key={step}
								class="flex items-center gap-2 border-b border-white/5 py-2 last:border-0"
							>
								<span
									aria-hidden="true"
									class={cn(
										"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
										resolvedState === "done" &&
											"border-purple-500/60 bg-purple-500/20 text-purple-400",
										resolvedState === "active" && "border-cyan-400/60 bg-cyan-400/20",
										resolvedState === "idle" && "border-white/15 bg-white/5",
									)}
								>
									{resolvedState === "done" ? <Check class="h-2.5 w-2.5" /> : null}
								</span>
								<span
									class={cn(
										"min-w-0 flex-1 text-[11px] leading-4",
										resolvedState === "idle" ? "text-[#a99bbd]" : "text-[#f4eeff]",
									)}
								>
									{step}
								</span>
								<span
									class={cn(
										"shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
										chip,
									)}
								>
									{resolvedState === "done"
										? "Done"
										: resolvedState === "active"
											? "Active"
											: "Queued"}
								</span>
							</li>
						);
					})}
				</ol>
				{caseStatus === "failed" ? (
					<p class="mt-2 text-[11px] leading-4 text-rose-300">
						The investigation reported a failure — see the conversation.
					</p>
				) : null}
			</div>

			<div>
				<p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99bbd]">
					Resources
				</p>
				<ul class="space-y-1.5">
					{CAPABILITY_ROWS.map(({ label, key }) => {
						const pill = capabilityPill(capabilities, key);
						return (
							<li
								key={key}
								class="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5"
							>
								<span class="text-[11px] text-[#f4eeff]">{label}</span>
								<span
									class={cn(
										"inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
										pill.className,
									)}
								>
									{pill.label}
								</span>
							</li>
						);
					})}
				</ul>
			</div>

			<div>
				<p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99bbd]">
					Evidence collected
				</p>
				{attachments.length === 0 ? (
					<p class="text-[11px] text-[#a99bbd]">Nothing collected yet.</p>
				) : (
					<ul class="space-y-1.5">
						{attachments.map((attachment, index) => {
							const name = fileNameOf(attachment?.file_path);
							return (
								<li key={attachment.file_path}>
									<button
										type="button"
										onClick={() => openViewer(index)}
										aria-label={`Open evidence ${name}`}
										class="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
									>
										<FileText class="h-3.5 w-3.5 shrink-0 text-cyan-300" aria-hidden="true" />
										<span class="min-w-0 flex-1 truncate text-[11px] text-[#f4eeff]">{name}</span>
										{attachment?.byte_size ? (
											<span class="shrink-0 text-[10px] tabular-nums text-[#a99bbd]">
												{formatBytes(attachment.byte_size)}
											</span>
										) : null}
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>

			<div class="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5 p-3">
				<p class="flex items-center gap-2 text-xs font-semibold text-purple-300">
					<ShieldCheck class="h-4 w-4" aria-hidden="true" />
					Read-only by design
				</p>
				<p class="mt-1.5 text-[11px] leading-5 text-[#f4eeff]">
					The AI cannot modify source code, create files, run commands or deploy. It inspects
					authorized sources only.
				</p>
			</div>
		</>
	);

	return (
		<div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#0b0714] text-[#f4eeff]">
			{/* Header row */}
			<header class="relative z-10 flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2.5 sm:gap-3 sm:px-4">
				<button
					type="button"
					onClick={() => setLeftDrawerOpen((value) => !value)}
					aria-label="Toggle evidence panel"
					aria-expanded={leftDrawerOpen}
					class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#a99bbd] transition hover:text-[#f4eeff] lg:hidden"
				>
					<PanelLeft class="h-5 w-5" aria-hidden="true" />
				</button>

				<div class="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/25 to-fuchsia-500/15 text-purple-400">
					<Bot class="h-5 w-5" aria-hidden="true" />
				</div>
				<div class="min-w-0">
					<h1 class="text-base font-semibold leading-tight text-[#f4eeff] sm:text-lg">
						AI Investigation
					</h1>
					<p
						class="max-w-[14rem] truncate text-[10px] text-[#a99bbd] sm:max-w-[16rem]"
						title={supportCase.caseRow?.subject ?? caseId ?? "new case"}
					>
						{supportCase.caseRow?.subject || (caseId ? `case ${caseId}` : "new case")}
					</p>
				</div>
				<span
					class={cn(
						"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
						isInvestigating
							? "border-purple-500/40 bg-purple-500/10 text-purple-400"
							: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
					)}
				>
					<span
						class="hidden items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 sm:inline-flex"
						title="The AI can view, never change. It cannot run commands or deploy."
					>
						<Lock class="h-3 w-3" aria-hidden="true" />
						Read-only access
					</span>
					{isInvestigating ? (
						<span
							aria-hidden="true"
							class="h-1.5 w-1.5 animate-pulse motion-reduce:animate-none rounded-full bg-purple-500"
						/>
					) : null}
					{statusLabel}
				</span>

				<button
					type="button"
					onClick={() => setDeleteConfirmOpen(true)}
					disabled={!caseId || creating}
					aria-label="Delete this case"
					title="Delete this case"
					class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#a99bbd] transition hover:border-rose-400/40 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
				>
					<Trash2 class="h-4 w-4" aria-hidden="true" />
				</button>
				<div class="ml-auto flex items-center gap-2">
					<div class="hidden md:block">
						<InvestigationModelPicker
							caseId={caseId}
							token={jwt ?? undefined}
							supportToken={supportToken}
							darkMode={true}
						/>
					</div>
					<button
						type="button"
						onClick={endSession}
						class="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-[#f4eeff] transition hover:border-rose-400/30 hover:text-rose-200 sm:inline-flex"
					>
						<LogOut class="h-4 w-4" aria-hidden="true" />
						End session
					</button>
					<button
						type="button"
						onClick={() => setRightDrawerOpen((value) => !value)}
						aria-label="Toggle investigation panel"
						aria-expanded={rightDrawerOpen}
						class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#a99bbd] transition hover:text-[#f4eeff] lg:hidden"
					>
						<PanelRight class="h-5 w-5" aria-hidden="true" />
					</button>
				</div>
			</header>

			{/* Three columns above 1024px, single column + drawers below */}
			<div
				data-testid="workspace-grid"
				class="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_280px]"
			>
				<aside
					data-testid="workspace-left-rail"
					aria-label="Evidence panel"
					data-lenis-prevent={true}
					class="hidden min-h-0 flex-col gap-5 overflow-y-auto border-r border-white/10 p-4 lg:flex"
				>
					{leftRail}
				</aside>

				<main data-testid="workspace-center" class="flex min-h-0 flex-col bg-[#0b0714]">
					{failure ? (
						<div
							role="alert"
							class="flex items-center gap-2 border-b border-rose-400/20 bg-rose-500/10 px-4 py-2 text-xs text-rose-300"
						>
							<AlertTriangle class="h-4 w-4 shrink-0" aria-hidden="true" />
							{failure}
						</div>
					) : null}
					{notice ? (
						<div
							role="status"
							class="border-b border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300"
						>
							{notice}
						</div>
					) : null}

					<div
						ref={transcriptRef}
						role="log"
						aria-live="polite"
						data-lenis-prevent={true}
						class="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6"
					>
						{(supportCase.activity?.length ?? 0) > 0 || isInvestigating ? (
							<ActivityTree activity={supportCase.activity} status={caseStatus} />
						) : null}
						{caseId ? (
							<>
								{supportCase.caseRow?.summary ? (
									<div class="rounded-2xl border border-white/10 bg-white/5 p-3">
										<p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99bbd]">
											Summary
										</p>
										<p class="mt-1 text-sm leading-6 text-[#f4eeff]">
											{supportCase.caseRow.summary}
										</p>
									</div>
								) : null}

								{messages.length === 0 ? (
									<p class="py-8 text-center text-sm text-[#a99bbd]">
										No messages yet. Describe the problem below and the assistant will take it from
										there.
									</p>
								) : (
									messages.map((message) => (
										<MessageBubble
											key={message?.id ?? `seq-${message?.sequence ?? 0}`}
											message={message}
											onFeedback={(verdict) =>
												handleSend(verdict === "fixed" ? "Fixed it." : "Still broken.")
											}
											feedbackDisabled={sending}
											onAttachFile={handleFiles}
											onSend={handleSend}
										/>
									))
								)}

								{findingRows.length > 0 ? <FindingsPanel findingRows={findingRows} /> : null}

								{supportCase.report?.report ? (
									<>
										<ReportPanel
											report={supportCase.report}
											confirming={confirming}
											confirmed={confirmed}
											onConfirm={handleConfirm}
											preview={ticketPreview}
										/>
										<Link
											to={`/support/case/${caseId}/report`}
											state={supportCase.report}
											class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-2.5 text-xs font-semibold text-purple-300 transition hover:border-purple-400/60 hover:bg-purple-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
										>
											Review &amp; submit the report
											<ArrowRight class="h-4 w-4" aria-hidden="true" />
										</Link>
									</>
								) : null}

								{attachments.length > 0 ? (
									<div>
										<p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99bbd]">
											Evidence from this case
										</p>
										<div class="flex gap-2 overflow-x-auto pb-1">
											{attachments.map((attachment, index) => {
												const name = fileNameOf(attachment?.file_path);
												const url = signedUrls[attachment?.file_path];
												const isImage = isImageAttachment(attachment);
												return (
													<button
														key={attachment.file_path}
														type="button"
														onClick={() => openViewer(index)}
														aria-label={`Open evidence ${name}`}
														class="group w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition hover:border-cyan-400/40"
													>
														<span class="flex h-16 w-full items-center justify-center overflow-hidden bg-[#0b0714]">
															{isImage && url ? (
																<img
																	src={url}
																	alt={name}
																	loading="lazy"
																	class="h-full w-full object-cover"
																/>
															) : (
																<FileText class="h-6 w-6 text-cyan-300/80" aria-hidden="true" />
															)}
														</span>
														<span class="block truncate px-1.5 py-1 text-[9px] text-[#f4eeff]">
															{name}
														</span>
													</button>
												);
											})}
										</div>
									</div>
								) : null}
							</>
						) : (
							<div class="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
								<div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 text-purple-400">
									<Sparkles class="h-7 w-7" aria-hidden="true" />
								</div>
								<div>
									<h2 class="text-lg font-semibold text-[#f4eeff]">Start your investigation</h2>
									<p class="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#a99bbd]">
										Open a case and describe the problem in plain language. The assistant asks for
										what it needs, then investigators work on it and report back.
									</p>
								</div>
								<button
									type="button"
									onClick={startCase}
									disabled={creating}
									class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#9333ea] to-[#c026d3] px-5 py-3 text-sm font-semibold text-[#f4eeff] transition motion-reduce:transition-none hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{creating ? (
										<ThreeDot variant="bounce" color="#f4eeff" size="small" text="" textColor="" />
									) : (
										<Sparkles class="h-4 w-4" aria-hidden="true" />
									)}
									{creating ? "Opening…" : "Open an investigation"}
								</button>
							</div>
						)}
					</div>

					{uploads.length > 0 ? (
						<ul class="space-y-1.5 border-t border-white/5 px-4 py-2">
							{uploads.map((upload) => (
								<li key={upload.key} class="flex items-center gap-2 text-[11px]">
									<FileText class="h-3.5 w-3.5 shrink-0 text-cyan-300" aria-hidden="true" />
									<span class="max-w-40 truncate text-[#f4eeff]">{upload.name}</span>
									<span
										class={cn(
											"shrink-0",
											upload.status === "error"
												? "text-rose-300"
												: upload.status === "done"
													? "text-emerald-300"
													: "text-[#a99bbd]",
										)}
									>
										{upload.status === "queued" && "Queued"}
										{upload.status === "uploading" && "Uploading…"}
										{upload.status === "done" && "Uploaded"}
										{upload.status === "error" && "Failed"}
									</span>
									<div aria-hidden="true" class="h-1 w-20 overflow-hidden rounded-full bg-white/10">
										<div
											class={cn(
												"h-full rounded-full",
												upload.status === "error" && "w-full bg-rose-400",
												upload.status === "done" && "w-full bg-cyan-400",
												upload.status === "uploading" &&
													"w-full animate-pulse motion-reduce:animate-none bg-cyan-400/70",
												upload.status === "queued" && "w-1/5 bg-white/20",
											)}
										/>
									</div>
								</li>
							))}
						</ul>
					) : null}

					<div class="border-t border-white/10 bg-[#151020]/60 p-3 sm:p-4">
						<Composer
							onSend={handleSend}
							onFiles={handleFiles}
							disabled={sending || creating || !caseId || uploadsBusy}
							attachVisible={Boolean(jwt)}
						/>
						{caseId && caseStatus === "collecting" ? (
							<div class="mt-2 flex justify-end">
								<button
									type="button"
									onClick={handleConfirm}
									disabled={confirming}
									class="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-[11px] font-semibold text-purple-300 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<ShieldCheck class="h-4 w-4" aria-hidden="true" />
									{confirming ? "Starting…" : "Start the investigation"}
								</button>
							</div>
						) : null}
					</div>
				</main>

				<aside
					data-testid="workspace-right-rail"
					aria-label="Investigation status"
					data-lenis-prevent={true}
					class="hidden min-h-0 flex-col gap-5 overflow-y-auto border-l border-white/10 p-4 lg:flex"
				>
					{rightRail}
				</aside>
			</div>

			{/* Mobile drawers */}
			{leftDrawerOpen ? (
				<>
					<button
						type="button"
						aria-hidden="true"
						tabIndex={-1}
						class="fixed inset-0 z-30 bg-black/60"
						onClick={() => setLeftDrawerOpen(false)}
					/>
					<div
						ref={leftDrawerRef}
						role="dialog"
						aria-modal="true"
						aria-label="Evidence panel"
						class="fixed inset-y-0 left-0 z-40 flex w-80 max-w-[85vw] flex-col gap-5 overflow-y-auto border-r border-white/10 bg-[#151020] p-4"
					>
						<button
							type="button"
							onClick={() => setLeftDrawerOpen(false)}
							aria-label="Close evidence panel"
							class="inline-flex h-10 w-10 items-center justify-center self-end rounded-xl border border-white/10 bg-white/5 text-[#a99bbd] transition hover:text-[#f4eeff]"
						>
							<X class="h-5 w-5" aria-hidden="true" />
						</button>
						{leftRail}
					</div>
				</>
			) : null}

			{rightDrawerOpen ? (
				<>
					<button
						type="button"
						aria-hidden="true"
						tabIndex={-1}
						class="fixed inset-0 z-30 bg-black/60"
						onClick={() => setRightDrawerOpen(false)}
					/>
					<div
						ref={rightDrawerRef}
						role="dialog"
						aria-modal="true"
						aria-label="Investigation panel"
						class="fixed inset-y-0 right-0 z-40 flex w-80 max-w-[85vw] flex-col gap-5 overflow-y-auto border-l border-white/10 bg-[#151020] p-4"
					>
						<button
							type="button"
							onClick={() => setRightDrawerOpen(false)}
							aria-label="Close investigation panel"
							class="inline-flex h-10 w-10 items-center justify-center self-end rounded-xl border border-white/10 bg-white/5 text-[#a99bbd] transition hover:text-[#f4eeff]"
						>
							<X class="h-5 w-5" aria-hidden="true" />
						</button>
						{rightRail}
					</div>
				</>
			) : null}

			{deleteConfirmOpen ? (
				<>
					<button
						type="button"
						aria-hidden="true"
						tabIndex={-1}
						class="fixed inset-0 z-40 bg-black/60"
						onClick={() => (deleting ? null : setDeleteConfirmOpen(false))}
					/>
					<div
						role="dialog"
						aria-modal="true"
						aria-label="Delete case"
						class="fixed left-1/2 top-1/2 z-50 w-[min(26rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-rose-500/25 bg-[#151020] p-5"
					>
						<h2 class="text-base font-semibold text-[#f4eeff]">Delete this case?</h2>
						<p class="mt-1.5 text-sm leading-6 text-[#a99bbd]">
							This removes the conversation, evidence and any report. It cannot be undone.
						</p>
						<div class="mt-4 flex items-center justify-end gap-2">
							<button
								type="button"
								disabled={deleting}
								onClick={() => setDeleteConfirmOpen(false)}
								class="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-[#f4eeff] transition hover:border-cyan-400/40 hover:text-cyan-200 disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="button"
								disabled={deleting}
								onClick={deleteCase}
								class="inline-flex h-10 items-center gap-2 justify-center rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 text-xs font-semibold text-rose-300 transition hover:border-rose-400/60 hover:bg-rose-500/20 disabled:opacity-50"
							>
								<Trash2 class="h-4 w-4" aria-hidden="true" />
								{deleting ? "Deleting…" : "Delete case"}
							</button>
						</div>
					</div>
				</>
			) : null}

			{/* Evidence viewer */}
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
