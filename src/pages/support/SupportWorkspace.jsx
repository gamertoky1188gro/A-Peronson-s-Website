/*
  Route: /support/case/:caseId (public; guards stay on the API and in-page)

  The premium investigation workspace: three columns (left rail / center
  conversation / right investigation status) above 1024px, single column with
  two drawers below. Extracted from src/pages/SupportReports.jsx's case
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
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { Composer } from "../../components/support/Composer.jsx";
import { EvidenceViewerModal } from "../../components/support/EvidenceViewerModal.jsx";
import InvestigationModelPicker from "../../components/support/InvestigationModelPicker.jsx";
import { StageRail } from "../../components/support/StageRail.jsx";
import { useSupportCase } from "../../hooks/useSupportCase.js";
import { apiRequest, getToken } from "../../lib/auth.js";
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

// The three confidence levels a finding can carry (contracts.md §5).
const CONFIDENCE_LABELS = {
	confirmed: "Confirmed",
	probable: "Probable",
	speculative: "Speculative",
};

const RESOURCES = [
	"Repository inspection",
	"GitHub history",
	"External research",
	"Approved application data",
];

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

/** One message in the transcript. The body is rendered as TEXT, never markup. */
function MessageBubble({ message }) {
	const role = String(message?.role || "system");
	const kind = String(message?.kind || "answer");
	const body = decodeStoredText(message?.content);

	const isClient = role === "client";
	const isAdmin = role === "admin";
	const isNotice = role === "system" || kind === "notice" || kind === "progress";

	let bubbleClass = "border-white/10 bg-white/5 text-[#e8eefc]";
	if (isClient) {
		bubbleClass = "border-sky-400/30 bg-sky-500/10 text-sky-50";
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
			<div className="flex justify-center">
				<p className="max-w-[85%] rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-xs text-[#8ea3c8]">
					{body}
				</p>
			</div>
		);
	}

	return (
		<div className={`flex ${isClient ? "justify-end" : "justify-start"}`}>
			<div className={cn("max-w-[85%] rounded-2xl border px-4 py-3", bubbleClass)}>
				<p className={cn("text-xs font-semibold", isClient ? "text-sky-300" : "text-[#8ea3c8]")}>
					{label}
					{message?.agent ? ` · ${message.agent}` : ""}
				</p>
				<p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">{body}</p>
			</div>
		</div>
	);
}

/** The findings that arrived while the investigation ran. */
function FindingsPanel({ findingRows }) {
	return (
		<section aria-label="Findings" className="rounded-2xl border border-white/10 bg-white/5 p-4">
			<h3 className="text-sm font-semibold text-[#e8eefc]">Findings</h3>
			<ul className="mt-3 space-y-3">
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
						<li key={key} className="rounded-xl border border-white/10 bg-[#050b1d]/60 p-3">
							<div className="flex flex-wrap items-center gap-2">
								<span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", tone)}>
									{CONFIDENCE_LABELS[confidence] || confidence}
								</span>
								{entry?.role ? (
									<span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-[#8ea3c8]">
										{entry.role}
									</span>
								) : null}
							</div>
							<p className="mt-2 text-sm leading-6 text-[#e8eefc]">{finding.detail || ""}</p>
							{evidence.length > 0 ? (
								<ul className="mt-2 space-y-1">
									{evidence.map((item) => {
										const href = safeExternalUrl(item?.url);
										const label = item?.file || item?.commit || "evidence";
										const suffix = item?.lines ? ` (lines ${item.lines})` : "";
										return (
											<li key={`${label}${suffix}`} className="text-xs">
												{href ? (
													<a
														href={href}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 text-cyan-300 underline underline-offset-2"
													>
														{label}
														{suffix}
														<ExternalLink className="h-3 w-3" />
													</a>
												) : (
													<span className="text-[#8ea3c8]">
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
				className="max-w-full rounded-2xl"
			/>
		);
	},
};

/** The finished report, and the action that confirms it. */
function ReportPanel({ report, confirming, confirmed, onConfirm }) {
	return (
		<section
			aria-label="Investigation report"
			className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4"
		>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h3 className="text-sm font-semibold text-[#e8eefc]">Investigation report</h3>
				{report?.reportStatus ? (
					<span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-[#8ea3c8]">
						{report.reportStatus}
					</span>
				) : null}
			</div>
			<div className="mt-3 max-h-80 overflow-y-auto break-words text-sm leading-6 text-[#e8eefc]">
				<ReactMarkdown remarkPlugins={[remarkGfm]} components={REPORT_MARKDOWN_COMPONENTS}>
					{String(report?.report ?? "")}
				</ReactMarkdown>
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={onConfirm}
					disabled={confirming || confirmed}
					className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-2.5 text-xs font-semibold text-[#050b1d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{confirming ? (
						<ThreeDot variant="bounce" color="#050b1d" size="small" text="" textColor="" />
					) : (
						<Check className="h-4 w-4" />
					)}
					Confirm this is accurate
				</button>
				{confirmed ? (
					<p className="text-xs text-emerald-300">Thanks — your confirmation was recorded.</p>
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

	const transcriptRef = useRef(null);
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

	// Escape closes either mobile drawer.
	const anyDrawerOpen = leftDrawerOpen || rightDrawerOpen;
	useEffect(() => {
		if (!anyDrawerOpen) {
			return undefined;
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

	async function startCase() {
		if (!jwt && !supportToken) {
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
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 text-[#050b1d]">
					<Bot className="h-5 w-5" aria-hidden="true" />
				</div>
				<div className="min-w-0">
					<p className="text-sm font-semibold text-[#e8eefc]">Support</p>
					<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
						AI Investigation
					</p>
				</div>
			</div>

			<div className="rounded-xl border border-white/10 bg-white/5 p-3">
				<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ea3c8]">
					Case reference
				</p>
				<p
					className="mt-1 truncate font-mono text-[11px] text-[#e8eefc]"
					title={caseId ?? "not opened yet"}
				>
					{caseId ?? "not opened yet"}
				</p>
			</div>

			<div>
				<p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ea3c8]">
					Case progress
				</p>
				<StageRail status={caseStatus} />
			</div>

			<div className="min-h-0">
				<p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ea3c8]">
					Evidence ({attachments.length})
				</p>
				{attachments.length === 0 ? (
					<p className="text-[11px] text-[#8ea3c8]">No evidence yet.</p>
				) : (
					<ul className="space-y-1.5">
						{attachments.map((attachment, index) => {
							const name = fileNameOf(attachment?.file_path);
							const Icon = attachmentIcon(attachment);
							return (
								<li key={attachment.file_path}>
									<button
										type="button"
										onClick={() => openViewer(index)}
										aria-label={`Open evidence ${name}`}
										className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
									>
										<Icon className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
										<span className="min-w-0 flex-1 truncate text-[11px] text-[#e8eefc]">
											{name}
										</span>
										{attachment?.byte_size ? (
											<span className="shrink-0 text-[10px] tabular-nums text-[#8ea3c8]">
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

			<div className="flex gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
				<Lock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
				<p className="text-[11px] leading-5 text-[#c8d4ee]">
					Private session. Evidence is visible only to you and the support team. Nothing is shared
					publicly.
				</p>
			</div>

			<button
				type="button"
				onClick={endSession}
				className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-[#e8eefc] transition hover:border-rose-400/30 hover:bg-white/10"
			>
				<LogOut className="h-4 w-4" aria-hidden="true" />
				End session
			</button>
		</>
	);

	const rightRail = (
		<>
			<div>
				<p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
					<Activity className="h-3.5 w-3.5" aria-hidden="true" />
					Investigation
				</p>
				<ol>
					{INVESTIGATION_STEPS.map((step, index) => {
						const resolvedState = investigationStepState(index, activeStep);
						const chip =
							resolvedState === "done"
								? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
								: resolvedState === "active"
									? "border-sky-400/40 bg-sky-400/10 text-sky-300"
									: "border-white/10 bg-white/5 text-[#8ea3c8]";
						return (
							<li
								key={step}
								className="flex items-center gap-2 border-b border-white/5 py-2 last:border-0"
							>
								<span
									aria-hidden="true"
									className={cn(
										"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
										resolvedState === "done" && "border-cyan-400/60 bg-cyan-400/20 text-cyan-300",
										resolvedState === "active" && "border-sky-400/60 bg-sky-400/20",
										resolvedState === "idle" && "border-white/15 bg-white/5",
									)}
								>
									{resolvedState === "done" ? <Check className="h-2.5 w-2.5" /> : null}
								</span>
								<span
									className={cn(
										"min-w-0 flex-1 text-[11px] leading-4",
										resolvedState === "idle" ? "text-[#8ea3c8]" : "text-[#e8eefc]",
									)}
								>
									{step}
								</span>
								<span
									className={cn(
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
					<p className="mt-2 text-[11px] leading-4 text-rose-300">
						The investigation reported a failure — see the conversation.
					</p>
				) : null}
			</div>

			<div>
				<p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ea3c8]">
					Resources
				</p>
				<ul className="space-y-1.5">
					{RESOURCES.map((resource) => (
						<li
							key={resource}
							className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5"
						>
							<span className="text-[11px] text-[#c8d4ee]">{resource}</span>
							<span className="inline-flex shrink-0 items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
								Authorized
							</span>
						</li>
					))}
				</ul>
			</div>

			<div>
				<p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ea3c8]">
					Evidence collected
				</p>
				{attachments.length === 0 ? (
					<p className="text-[11px] text-[#8ea3c8]">Nothing collected yet.</p>
				) : (
					<ul className="space-y-1.5">
						{attachments.map((attachment, index) => {
							const name = fileNameOf(attachment?.file_path);
							return (
								<li key={attachment.file_path}>
									<button
										type="button"
										onClick={() => openViewer(index)}
										aria-label={`Open evidence ${name}`}
										className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
									>
										<FileText className="h-3.5 w-3.5 shrink-0 text-cyan-300" aria-hidden="true" />
										<span className="min-w-0 flex-1 truncate text-[11px] text-[#e8eefc]">
											{name}
										</span>
										{attachment?.byte_size ? (
											<span className="shrink-0 text-[10px] tabular-nums text-[#8ea3c8]">
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

			<div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-sky-400/5 p-3">
				<p className="flex items-center gap-2 text-xs font-semibold text-cyan-200">
					<ShieldCheck className="h-4 w-4" aria-hidden="true" />
					Read-only by design
				</p>
				<p className="mt-1.5 text-[11px] leading-5 text-[#c8d4ee]">
					The AI cannot modify source code, create files, run commands or deploy. It inspects
					authorized sources only.
				</p>
			</div>
		</>
	);

	return (
		<div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#050b1d] text-[#e8eefc]">
			{/* Header row */}
			<header className="relative z-10 flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2.5 sm:gap-3 sm:px-4">
				<button
					type="button"
					onClick={() => setLeftDrawerOpen((value) => !value)}
					aria-label="Toggle evidence panel"
					aria-expanded={leftDrawerOpen}
					className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#8ea3c8] transition hover:text-[#e8eefc] lg:hidden"
				>
					<PanelLeft className="h-5 w-5" aria-hidden="true" />
				</button>

				<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/25 to-sky-500/15 text-cyan-300">
					<Bot className="h-5 w-5" aria-hidden="true" />
				</div>
				<div className="min-w-0">
					<h1 className="text-base font-semibold leading-tight text-[#e8eefc] sm:text-lg">
						AI Investigation
					</h1>
					<p
						className="max-w-[10rem] truncate font-mono text-[10px] text-[#8ea3c8] sm:max-w-[16rem]"
						title={caseId ?? "new case"}
					>
						{caseId ? `case ${caseId}` : "new case"}
					</p>
				</div>
				<span
					className={cn(
						"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
						isInvestigating
							? "border-sky-400/40 bg-sky-400/10 text-sky-300"
							: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
					)}
				>
					{isInvestigating ? (
						<span
							aria-hidden="true"
							className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400"
						/>
					) : null}
					{statusLabel}
				</span>

				<div className="ml-auto flex items-center gap-2">
					<div className="hidden md:block">
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
						className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-[#e8eefc] transition hover:border-rose-400/30 hover:text-rose-200 sm:inline-flex"
					>
						<LogOut className="h-4 w-4" aria-hidden="true" />
						End session
					</button>
					<button
						type="button"
						onClick={() => setRightDrawerOpen((value) => !value)}
						aria-label="Toggle investigation panel"
						aria-expanded={rightDrawerOpen}
						className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#8ea3c8] transition hover:text-[#e8eefc] lg:hidden"
					>
						<PanelRight className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>
			</header>

			{/* Three columns above 1024px, single column + drawers below */}
			<div
				data-testid="workspace-grid"
				className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_280px]"
			>
				<aside
					data-testid="workspace-left-rail"
					data-lenis-prevent={true}
					className="hidden min-h-0 flex-col gap-5 overflow-y-auto border-r border-white/10 p-4 lg:flex"
				>
					{leftRail}
				</aside>

				<main data-testid="workspace-center" className="flex min-h-0 flex-col bg-[#050b1d]">
					{failure ? (
						<div
							role="alert"
							className="flex items-center gap-2 border-b border-rose-400/20 bg-rose-500/10 px-4 py-2 text-xs text-rose-300"
						>
							<AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
							{failure}
						</div>
					) : null}
					{notice ? (
						<div className="border-b border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
							{notice}
						</div>
					) : null}

					<div
						ref={transcriptRef}
						data-lenis-prevent={true}
						className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6"
					>
						{!caseId ? (
							<div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
								<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-sky-500/10 text-cyan-300">
									<Sparkles className="h-7 w-7" aria-hidden="true" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-[#e8eefc]">Start your investigation</h2>
									<p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#8ea3c8]">
										Open a case and describe the problem in plain language. The assistant asks for
										what it needs, then investigators work on it and report back.
									</p>
								</div>
								<button
									type="button"
									onClick={startCase}
									disabled={creating}
									className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-sm font-semibold text-[#050b1d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{creating ? (
										<ThreeDot variant="bounce" color="#050b1d" size="small" text="" textColor="" />
									) : (
										<Sparkles className="h-4 w-4" aria-hidden="true" />
									)}
									{creating ? "Opening…" : "Open an investigation"}
								</button>
							</div>
						) : (
							<>
								{supportCase.caseRow?.summary ? (
									<div className="rounded-2xl border border-white/10 bg-white/5 p-3">
										<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ea3c8]">
											Summary
										</p>
										<p className="mt-1 text-sm leading-6 text-[#e8eefc]">
											{supportCase.caseRow.summary}
										</p>
									</div>
								) : null}

								{messages.length === 0 ? (
									<p className="py-8 text-center text-sm text-[#8ea3c8]">
										No messages yet. Describe the problem below and the assistant will take it from
										there.
									</p>
								) : (
									messages.map((message) => (
										<MessageBubble
											key={message?.id ?? `seq-${message?.sequence ?? 0}`}
											message={message}
										/>
									))
								)}

								{findingRows.length > 0 ? <FindingsPanel findingRows={findingRows} /> : null}

								{supportCase.report?.report ? (
									<ReportPanel
										report={supportCase.report}
										confirming={confirming}
										confirmed={confirmed}
										onConfirm={handleConfirm}
									/>
								) : null}

								{attachments.length > 0 ? (
									<div>
										<p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ea3c8]">
											Evidence from this case
										</p>
										<div className="flex gap-2 overflow-x-auto pb-1">
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
														className="group w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition hover:border-cyan-400/40"
													>
														<span className="flex h-16 w-full items-center justify-center overflow-hidden bg-[#050b1d]">
															{isImage && url ? (
																<img
																	src={url}
																	alt={name}
																	loading="lazy"
																	className="h-full w-full object-cover"
																/>
															) : (
																<FileText className="h-6 w-6 text-cyan-300/80" aria-hidden="true" />
															)}
														</span>
														<span className="block truncate px-1.5 py-1 text-[9px] text-[#c8d4ee]">
															{name}
														</span>
													</button>
												);
											})}
										</div>
									</div>
								) : null}
							</>
						)}
					</div>

					{uploads.length > 0 ? (
						<ul className="space-y-1.5 border-t border-white/5 px-4 py-2">
							{uploads.map((upload) => (
								<li key={upload.key} className="flex items-center gap-2 text-[11px]">
									<FileText className="h-3.5 w-3.5 shrink-0 text-cyan-300" aria-hidden="true" />
									<span className="max-w-40 truncate text-[#c8d4ee]">{upload.name}</span>
									<span
										className={cn(
											"shrink-0",
											upload.status === "error"
												? "text-rose-300"
												: upload.status === "done"
													? "text-emerald-300"
													: "text-[#8ea3c8]",
										)}
									>
										{upload.status === "queued" && "Queued"}
										{upload.status === "uploading" && "Uploading…"}
										{upload.status === "done" && "Uploaded"}
										{upload.status === "error" && "Failed"}
									</span>
									<div
										aria-hidden="true"
										className="h-1 w-20 overflow-hidden rounded-full bg-white/10"
									>
										<div
											className={cn(
												"h-full rounded-full",
												upload.status === "error" && "w-full bg-rose-400",
												upload.status === "done" && "w-full bg-cyan-400",
												upload.status === "uploading" && "w-full animate-pulse bg-cyan-400/70",
												upload.status === "queued" && "w-1/5 bg-white/20",
											)}
										/>
									</div>
								</li>
							))}
						</ul>
					) : null}

					<div className="border-t border-white/10 bg-[#0a1025]/60 p-3 sm:p-4">
						<Composer
							onSend={handleSend}
							onFiles={handleFiles}
							disabled={sending || creating || !caseId || uploadsBusy}
							attachVisible={Boolean(jwt)}
						/>
						{caseId && caseStatus === "collecting" ? (
							<div className="mt-2 flex justify-end">
								<button
									type="button"
									onClick={handleConfirm}
									disabled={confirming}
									className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<ShieldCheck className="h-4 w-4" aria-hidden="true" />
									{confirming ? "Starting…" : "Start the investigation"}
								</button>
							</div>
						) : null}
					</div>
				</main>

				<aside
					data-testid="workspace-right-rail"
					data-lenis-prevent={true}
					className="hidden min-h-0 flex-col gap-5 overflow-y-auto border-l border-white/10 p-4 lg:flex"
				>
					{rightRail}
				</aside>
			</div>

			{/* Mobile drawers */}
			{leftDrawerOpen ? (
				<>
					<button
						type="button"
						aria-label="Close evidence panel"
						className="fixed inset-0 z-30 bg-black/60"
						onClick={() => setLeftDrawerOpen(false)}
					/>
					<div
						role="dialog"
						aria-label="Evidence panel"
						className="fixed inset-y-0 left-0 z-40 flex w-80 max-w-[85vw] flex-col gap-5 overflow-y-auto border-r border-white/10 bg-[#0a1025] p-4"
					>
						<button
							type="button"
							onClick={() => setLeftDrawerOpen(false)}
							aria-label="Close evidence panel"
							className="inline-flex h-10 w-10 items-center justify-center self-end rounded-xl border border-white/10 bg-white/5 text-[#8ea3c8] transition hover:text-[#e8eefc]"
						>
							<X className="h-5 w-5" aria-hidden="true" />
						</button>
						{leftRail}
					</div>
				</>
			) : null}

			{rightDrawerOpen ? (
				<>
					<button
						type="button"
						aria-label="Close investigation panel"
						className="fixed inset-0 z-30 bg-black/60"
						onClick={() => setRightDrawerOpen(false)}
					/>
					<div
						role="dialog"
						aria-label="Investigation panel"
						className="fixed inset-y-0 right-0 z-40 flex w-80 max-w-[85vw] flex-col gap-5 overflow-y-auto border-l border-white/10 bg-[#0a1025] p-4"
					>
						<button
							type="button"
							onClick={() => setRightDrawerOpen(false)}
							aria-label="Close investigation panel"
							className="inline-flex h-10 w-10 items-center justify-center self-end rounded-xl border border-white/10 bg-white/5 text-[#8ea3c8] transition hover:text-[#e8eefc]"
						>
							<X className="h-5 w-5" aria-hidden="true" />
						</button>
						{rightRail}
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
