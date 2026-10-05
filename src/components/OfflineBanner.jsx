// HyperCache Phase 1 — offline status banner (spec section 19 card).
// Non-blocking: fixed-position pill, pointer-events only on the card itself.
// Shows connectivity state (DEGRADED/OFFLINE/SYNCING/SYNC_ERROR/OFFLINE_SNAPSHOT)
// plus service-worker update prompts. Hidden when ONLINE / UP_TO_DATE.

import { useCallback, useEffect, useState } from "react";
import { subscribe as subscribeHypercache } from "../offline/broadcast.js";
import {
	ConnectivityState,
	getStatus,
	pingNow,
	startConnectivity,
	subscribe,
} from "../offline/connectivity.js";

const COPY = {
	[ConnectivityState.DEGRADED]: {
		dot: "bg-amber-400",
		title: "Unstable connection",
		body: "Some requests are slow or failing. Changes are kept locally.",
	},
	[ConnectivityState.OFFLINE]: {
		dot: "bg-red-400",
		title: "You're offline",
		body: "Browsing the cached app shell. Fresh data needs a connection.",
	},
	[ConnectivityState.OFFLINE_SNAPSHOT]: {
		dot: "bg-sky-400",
		title: "Offline — showing saved snapshot",
		body: "You're viewing locally saved data. It will refresh when you reconnect.",
	},
	[ConnectivityState.SYNCING]: {
		dot: "bg-cyan-400 animate-pulse",
		title: "Syncing…",
		body: "Refreshing local data in the background.",
	},
	[ConnectivityState.SYNC_ERROR]: {
		dot: "bg-orange-400",
		title: "Sync failed",
		body: "Couldn't refresh data. Your local copy is intact.",
	},
};

function SwUpdateCard({ registration, onDone }) {
	const apply = useCallback(() => {
		try {
			registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
		} catch {
			onDone?.();
		}
	}, [registration, onDone]);

	return (
		<div class="pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-400/30 bg-slate-950/90 px-4 py-3 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
			<span class="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
			<div class="min-w-0 flex-1">
				<p class="text-xs font-semibold text-white">Update available</p>
				<p class="truncate text-[11px] text-slate-400">A new version is ready to install.</p>
			</div>
			<button
				type="button"
				onClick={apply}
				class="shrink-0 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-emerald-400"
			>
				Refresh
			</button>
			<button
				type="button"
				onClick={onDone}
				aria-label="Dismiss update"
				class="shrink-0 rounded-full px-2 py-1 text-[11px] text-slate-400 transition hover:text-white"
			>
				Later
			</button>
		</div>
	);
}

export default function OfflineBanner() {
	const [status, setStatus] = useState(() => getStatus());
	const [swWaiting, setSwWaiting] = useState(null);
	const [swDismissed, setSwDismissed] = useState(false);
	const [retrying, setRetrying] = useState(false);
	const [pendingDrafts, setPendingDrafts] = useState(0);

	useEffect(() => {
		const stop = startConnectivity();
		const unsub = subscribe(setStatus);
		setStatus(getStatus());

		const onUpdate = (event) => {
			setSwDismissed(false);
			setSwWaiting(event?.detail || null);
		};
		const onControllerChange = () => {
			// New SW took over after SKIP_WAITING — reload once for fresh shell.
			window.location.reload();
		};
		window.addEventListener("sw:update-available", onUpdate);
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
		}
		return () => {
			unsub();
			stop();
			window.removeEventListener("sw:update-available", onUpdate);
			if ("serviceWorker" in navigator) {
				try {
					navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
				} catch {
					/* ignore */
				}
			}
		};
	}, []);

	const retry = useCallback(async () => {
		setRetrying(true);
		try {
			const next = await pingNow();
			setStatus(next);
		} finally {
			setRetrying(false);
		}
	}, []);

	useEffect(() => {
		let cancelled = false;
		const refresh = async () => {
			try {
				const mod = await import("../offline/outbox.js");
				if (cancelled || typeof mod.getOutboxCount !== "function") return;
				const count = await mod.getOutboxCount();
				if (!cancelled) setPendingDrafts(Number(count) || 0);
			} catch {
				/* IndexedDB unavailable — leave count at 0 */
			}
		};
		refresh();
		const unsub = subscribeHypercache((msg) => {
			if (msg?.type === "hypercache:outbox") {
				if (typeof msg.count === "number") setPendingDrafts(msg.count);
				else refresh();
			}
		});
		const timer = setInterval(refresh, 10_000);
		return () => {
			cancelled = true;
			unsub();
			clearInterval(timer);
		};
	}, []);

	const card = COPY[status.state];
	const showState = Boolean(card);
	const showUpdate = Boolean(swWaiting) && !swDismissed;
	const showOutbox = pendingDrafts > 0;
	if (!(showState || showUpdate || showOutbox)) return null;

	return (
		<div
			role="status"
			aria-live="polite"
			class="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4"
		>
			{showUpdate ? (
				<SwUpdateCard
					registration={swWaiting}
					onDone={() => {
						setSwDismissed(true);
						setSwWaiting(null);
					}}
				/>
			) : null}
			{showState ? (
				<div class="pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
					<span class={`h-2 w-2 shrink-0 rounded-full ${card.dot}`} />
					<div class="min-w-0 flex-1">
						<p class="text-xs font-semibold text-white">{card.title}</p>
						<p class="text-[11px] leading-snug text-slate-400">{card.body}</p>
						{showOutbox ? (
							<p class="mt-0.5 text-[11px] leading-snug text-cyan-300">
								{pendingDrafts} {pendingDrafts === 1 ? "draft" : "drafts"} pending
							</p>
						) : null}
					</div>
					{status.state === ConnectivityState.SYNCING ? null : (
						<button
							type="button"
							onClick={retry}
							disabled={retrying}
							class="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:border-white/30 hover:text-white disabled:opacity-50"
						>
							{retrying ? "Checking…" : "Retry"}
						</button>
					)}
				</div>
			) : showOutbox ? (
				<div class="pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
					<span class="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
					<div class="min-w-0 flex-1">
						<p class="text-[11px] leading-snug text-slate-300">
							{pendingDrafts} {pendingDrafts === 1 ? "draft" : "drafts"} pending
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
