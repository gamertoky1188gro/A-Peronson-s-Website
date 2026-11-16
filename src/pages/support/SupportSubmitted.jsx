/*
  Route: /support/case/:caseId/submitted (public; guards stay on the API)

  The post-confirmation landing: the case reference, the email delivery
  status when the case row reports one, and the way back. The case fetch is
  best-effort — a failed GET renders the reference only and never blocks.
*/

import { Check, Mail } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GlassCard } from "../../components/support/GlassCard.jsx";
import { apiRequest, getToken } from "../../lib/auth.js";
import { getSupportSession } from "../../lib/supportToken.js";

const PILL_TONES = {
	emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
	rose: "border-rose-400/30 bg-rose-400/10 text-rose-300",
	amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
	sky: "border-sky-400/30 bg-sky-400/10 text-sky-300",
	cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
};

const DOT_TONES = {
	emerald: "bg-emerald-400",
	rose: "bg-rose-400",
	amber: "bg-amber-400",
	sky: "bg-sky-400",
	cyan: "bg-cyan-400",
};

/**
 * Maps whatever the case row carries onto a delivery pill. Unknown statuses
 * render their own (capitalised) value rather than a guess; nothing recorded
 * renders no pill at all.
 */
function deliveryPill(caseRow) {
	const status = String(caseRow?.report_status ?? "")
		.toLowerCase()
		.trim();
	if (status === "failed") {
		return { label: "Failed", tone: "rose" };
	}
	if (status === "sent" || caseRow?.report_delivered_at) {
		return { label: "Sent", tone: "emerald" };
	}
	if (status === "queued") {
		return { label: "Queued", tone: "amber" };
	}
	if (status === "sending") {
		return { label: "Sending…", tone: "sky" };
	}
	if (status === "saved" || status === "draft" || status === "pending") {
		return { label: "Saved", tone: "cyan" };
	}
	if (status) {
		return { label: status.charAt(0).toUpperCase() + status.slice(1), tone: "cyan" };
	}
	return null;
}

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60";

export default function SupportSubmitted() {
	const { caseId } = useParams();
	const jwt = useMemo(() => getToken(), []);
	const supportToken = useMemo(() => getSupportSession()?.token ?? "", []);
	const [caseRow, setCaseRow] = useState(null);

	// Best-effort only: the reference renders regardless of this call.
	useEffect(() => {
		if (!jwt && !supportToken) {
			return;
		}
		let cancelled = false;
		apiRequest(`/support/cases/${caseId}`, {
			token: jwt ?? undefined,
			headers: supportToken ? { "x-support-token": supportToken } : undefined,
			skipSessionClear: Boolean(supportToken),
		})
			.then((data) => {
				if (!cancelled) {
					setCaseRow(data?.case ?? null);
				}
			})
			.catch(() => {
				// A failed fetch renders the reference only, never blocks the page.
			});
		return () => {
			cancelled = true;
		};
	}, [caseId, jwt, supportToken]);

	const pill = caseRow ? deliveryPill(caseRow) : null;

	return (
		<div className="relative min-h-dvh overflow-hidden bg-[#050b1d] text-[#e8eefc]">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,rgba(34,211,238,0.14),transparent_70%),radial-gradient(40%_40%_at_100%_100%,rgba(56,189,248,0.08),transparent_70%)]"
			/>
			<div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
				<div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_40px_-8px_rgba(34,211,238,0.45)]">
					<Check className="h-10 w-10 text-cyan-300" aria-hidden="true" />
				</div>
				<h1 className="mt-6 text-3xl font-semibold tracking-tight text-[#f2f6ff] sm:text-4xl">
					Report submitted!
				</h1>
				<p className="mt-2 text-sm leading-6 text-[#a9bcd9]">
					Your investigation report is on its way to the support team.
				</p>

				<GlassCard className="mt-8 w-full p-5">
					<p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8ea3c8]">
						CASE REFERENCE
					</p>
					<p className="mt-2 break-all font-mono text-base font-semibold text-cyan-200 sm:text-lg">
						{caseId}
					</p>
					{pill ? (
						<div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
							<p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8ea3c8]">
								Email report
							</p>
							<span
								className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${PILL_TONES[pill.tone]}`}
							>
								<span
									aria-hidden="true"
									className={`h-1.5 w-1.5 rounded-full ${DOT_TONES[pill.tone]}`}
								/>
								{pill.label}
							</span>
						</div>
					) : null}
				</GlassCard>

				<p className="mt-6 inline-flex items-center gap-2 text-sm text-[#8ea3c8]">
					<Mail className="h-4 w-4 text-cyan-400" aria-hidden="true" />A copy will be sent to your
					email
				</p>

				<Link
					to="/support"
					className={`mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-8 py-3 text-sm font-semibold text-[#050b1d] transition hover:-translate-y-0.5 ${focusRing}`}
				>
					Back to Support
				</Link>
			</div>
		</div>
	);
}
