/*
  Route: /support/case/:caseId/report (public; guards stay on the API and in-page)

  The report preview: the finished Markdown report, read-only, split into
  numbered sections (01..07), then the buyer's approval gate. The report
  payload is the same one the workspace renders — nothing here invents a new
  backend contract — with a router-state handoff from the workspace as the
  preferred source so the common path never depends on a live event replay.

  Confirm → POST /api/support/cases/:caseId/confirm (the same call the
  workspace makes, token headers included) → /support/case/:caseId/submitted.
  A failed confirm stays on this page with an inline error.
*/

import { AlertTriangle, ArrowLeft, Check, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import ReactMarkdown from "react-markdown";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { GlassCard } from "../../components/support/GlassCard.jsx";
import { useSupportCase } from "../../hooks/useSupportCase.js";
import { clearSupportSession, getSupportSession } from "../../lib/supportToken.js";

const EXTERNAL_URL_PATTERN = /^https?:\/\//iu;

/** An external link, but only an http(s) one; a relative path is never rendered as one. */
function safeExternalUrl(value) {
	const raw = String(value ?? "").trim();
	if (!EXTERNAL_URL_PATTERN.test(raw)) {
		return null;
	}
	return raw;
}

// Only these two markdown elements can carry a path; both refuse anything
// that is not an absolute http(s) url. No rehype-raw, so any raw HTML in the
// report never reaches the DOM.
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

/**
 * Splits the server-generated report Markdown into its preamble and its
 * `## ` sections, in document order. Fenced code blocks are honoured so a
 * "## " inside one is not read as a section boundary. A report without any
 * `## ` heading yields no sections; the caller renders it whole instead.
 */
function splitReportSections(markdown) {
	const lines = String(markdown ?? "").split(/\r?\n/u);
	const preamble = [];
	const sections = [];
	let current = null;
	let inFence = false;
	for (const line of lines) {
		if (/^\s*```/u.test(line)) {
			inFence = !inFence;
			(current ? current.lines : preamble).push(line);
			continue;
		}
		const heading = inFence ? null : /^##\s+(.+?)\s*$/u.exec(line);
		if (heading) {
			if (current) {
				sections.push(current);
			}
			current = { title: heading[1], lines: [] };
			continue;
		}
		(current ? current.lines : preamble).push(line);
	}
	if (current) {
		sections.push(current);
	}
	return {
		preamble: preamble.join("\n").trim(),
		sections: sections.map((section, index) => ({
			index,
			// The card renders its own 01.. index; drop the server's "3. " prefix.
			title:
				String(section.title)
					.replace(/^\d+[.)]\s*/u, "")
					.trim() || section.title,
			body: section.lines.join("\n").trim(),
		})),
	};
}

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60";

export default function SupportReportPreview() {
	const { caseId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const supportToken = useMemo(() => getSupportSession()?.token ?? "", []);
	const supportCase = useSupportCase(caseId ?? null, supportToken);

	const [approved, setApproved] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [problem, setProblem] = useState("");

	// A 401 from any case request means the token was revoked: drop it and go back to the landing.
	const errorStatus = supportCase.errorStatus ?? null;
	useEffect(() => {
		if (errorStatus === 401) {
			clearSupportSession();
			navigate("/support", { replace: true });
		}
	}, [errorStatus, navigate]);

	const state = location.state && typeof location.state === "object" ? location.state : null;
	const report = String(state?.report ?? supportCase.report?.report ?? "").trim();
	const hasReport = report.length > 0;
	const { preamble, sections } = useMemo(() => splitReportSections(report), [report]);
	const incomplete = /INCOMPLETE/iu.test(preamble);

	async function handleSubmit() {
		if (!approved || confirming) {
			return;
		}
		setConfirming(true);
		setProblem("");
		try {
			const result = await supportCase.confirm();
			if (result) {
				navigate(`/support/case/${caseId}/submitted`, { replace: true });
				return;
			}
			setProblem("The report could not be submitted. Please try again.");
		} finally {
			setConfirming(false);
		}
	}

	return (
		<div className="relative min-h-dvh overflow-hidden bg-[#050b1d] text-[#e8eefc]">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,rgba(34,211,238,0.12),transparent_70%),radial-gradient(40%_40%_at_100%_100%,rgba(56,189,248,0.08),transparent_70%)]"
			/>
			<div className="relative mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<Link
						to={`/support/case/${caseId}`}
						className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#a9bcd9] transition hover:text-cyan-300 ${focusRing}`}
					>
						<ArrowLeft className="h-4 w-4" aria-hidden="true" />
						Back to conversation
					</Link>
					<p className="max-w-[12rem] truncate font-mono text-[11px] text-[#5b6b8f]" title={caseId}>
						{caseId}
					</p>
				</div>

				<header className="mt-6">
					<p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
						Report preview
					</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#f2f6ff] sm:text-4xl">
						Investigation report
					</h1>
					<p className="mt-2 max-w-xl text-sm leading-6 text-[#a9bcd9]">
						Review what the investigation found. Nothing goes to the support team until you approve
						it below.
					</p>
				</header>

				{hasReport ? (
					<>
						{preamble ? (
							<GlassCard
								className={`mt-6 p-5 ${incomplete ? "border-amber-400/30 bg-amber-500/5" : ""}`}
							>
								<div className="flex flex-wrap items-center gap-2">
									{incomplete ? (
										<AlertTriangle className="h-4 w-4 text-amber-300" aria-hidden="true" />
									) : null}
									<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ea3c8]">
										{incomplete ? "Incomplete investigation" : "Report summary"}
									</p>
								</div>
								<div className="mt-2 text-sm leading-6 text-[#e8eefc]">
									<ReactMarkdown
										remarkPlugins={[remarkGfm]}
										components={REPORT_MARKDOWN_COMPONENTS}
									>
										{preamble}
									</ReactMarkdown>
								</div>
							</GlassCard>
						) : null}

						{sections.length === 0 ? (
							<GlassCard className="mt-6 p-5">
								<h2 className="text-base font-semibold text-[#f2f6ff]">Investigation report</h2>
								<div className="mt-3 break-words text-sm leading-6 text-[#e8eefc]">
									<ReactMarkdown
										remarkPlugins={[remarkGfm]}
										components={REPORT_MARKDOWN_COMPONENTS}
									>
										{report}
									</ReactMarkdown>
								</div>
							</GlassCard>
						) : (
							<div className="mt-6 space-y-4">
								{sections.map((section) => (
									<GlassCard key={`${section.index}-${section.title}`} className="p-5">
										<div className="flex items-baseline gap-4">
											<span
												aria-hidden="true"
												className="font-mono text-sm font-semibold tracking-widest text-cyan-400"
											>
												{String(section.index + 1).padStart(2, "0")}
											</span>
											<h2 className="text-base font-semibold leading-snug text-[#f2f6ff]">
												{section.title}
											</h2>
										</div>
										{section.body ? (
											<div className="mt-3 break-words text-sm leading-6 text-[#e8eefc]">
												<ReactMarkdown
													remarkPlugins={[remarkGfm]}
													components={REPORT_MARKDOWN_COMPONENTS}
												>
													{section.body}
												</ReactMarkdown>
											</div>
										) : null}
									</GlassCard>
								))}
							</div>
						)}

						<GlassCard className="mt-6 p-5">
							<label
								htmlFor="report-approval"
								className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl"
							>
								<input
									id="report-approval"
									type="checkbox"
									checked={approved}
									onChange={(event) => setApproved(event.target.checked)}
									className={`h-5 w-5 shrink-0 accent-cyan-400 ${focusRing}`}
								/>
								<span className="text-sm leading-6 text-[#e8eefc]">
									I&apos;ve reviewed this report and I&apos;m ready to send it
								</span>
							</label>
							{problem ? (
								<p
									role="alert"
									className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
								>
									{problem}
								</p>
							) : null}
							<div className="mt-4 flex flex-wrap items-center justify-between gap-4">
								<p className="max-w-xs text-xs leading-5 text-[#8ea3c8]">
									The support team receives this exact report. There is no way to edit it after
									sending.
								</p>
								<button
									type="button"
									onClick={handleSubmit}
									disabled={!approved || confirming}
									className={`inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3 text-sm font-semibold text-[#050b1d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${focusRing}`}
								>
									{confirming ? (
										<ThreeDot variant="bounce" color="#050b1d" size="small" text="" textColor="" />
									) : (
										<Check className="h-4 w-4" aria-hidden="true" />
									)}
									Finish &amp; Submit Report
								</button>
							</div>
						</GlassCard>
					</>
				) : (
					<GlassCard className="mt-6 p-10 text-center">
						<FileText className="mx-auto h-10 w-10 text-cyan-300/70" aria-hidden="true" />
						<h2 className="mt-4 text-lg font-semibold text-[#f2f6ff]">
							The report isn&apos;t ready yet
						</h2>
						<p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8ea3c8]">
							It appears here as soon as the investigation finishes writing it.
						</p>
						<Link
							to={`/support/case/${caseId}`}
							className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-[#e8eefc] transition hover:border-cyan-400/40 hover:text-cyan-200 ${focusRing}`}
						>
							Back to conversation
						</Link>
					</GlassCard>
				)}
			</div>
		</div>
	);
}
