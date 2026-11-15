/**
 * Investigation model picker — the buyer's per-case pick of the model that
 * runs the clarifying chat and the investigation. Fetches the effective
 * config on mount and whenever the case changes; persists with a PUT on
 * change. Free models only (the server enforces it; the list it returns is
 * already the allowlist).
 */

import { Cpu } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { apiRequest, getToken } from "../../lib/auth.js";
import { logger } from "../../lib/logger.js";

/**
 * @param {Object} props - The component props.
 * @param {string} props.caseId - The case the pick is stored on.
 * @param {string} props.token - The session JWT, if any.
 * @param {string} props.supportToken - The raw support token, if any.
 * @param {boolean} props.darkMode - Whether the dark theme is on.
 * @returns {JSX.Element|null} The picker, or null when there is no case.
 */
export default function InvestigationModelPicker({ caseId, token, supportToken, darkMode }) {
	const [config, setConfig] = useState(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const load = useCallback(async () => {
		if (!caseId) {
			return;
		}
		try {
			const data = await apiRequest(`/support/cases/${caseId}/model`, {
				token: token ?? getToken() ?? "",
				headers: supportToken ? { "x-support-token": supportToken } : undefined,
				skipSessionClear: Boolean(supportToken),
			});
			setConfig({
				modelId: data?.modelId ?? null,
				effectiveModelId: data?.effectiveModelId ?? data?.default ?? "",
				default: data?.default ?? "",
				buyerSelectEnabled: data?.buyerSelectEnabled !== false,
				allowed: Array.isArray(data?.allowed) ? data.allowed : [],
			});
			setError("");
		} catch (err) {
			// A failed read must not block the conversation; the server's
			// backstop applies when nothing was picked.
			logger.warn("Failed to load the investigation model config:", err);
			setConfig(null);
		}
	}, [caseId, token, supportToken]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		load();
	}, [load]);

	if (!caseId || !config) {
		return null;
	}

	const muted = darkMode ? "text-slate-400" : "text-slate-500";

	async function handleChange(event) {
		const nextId = event.target.value;
		setSaving(true);
		setError("");
		try {
			await apiRequest(`/support/cases/${caseId}/model`, {
				method: "PUT",
				token: token ?? getToken() ?? "",
				headers: supportToken ? { "x-support-token": supportToken } : undefined,
				skipSessionClear: Boolean(supportToken),
				body: { modelId: nextId },
			});
			setConfig((previous) =>
				previous ? { ...previous, modelId: nextId, effectiveModelId: nextId } : previous,
			);
		} catch (err) {
			const status = err?.status;
			setError(
				status === 400 || status === 403
					? "That model is no longer available"
					: "Could not update the investigation model",
			);
			// Nudge a re-render so the controlled select snaps back to the
			// stored value.
			setConfig((previous) => (previous ? { ...previous } : previous));
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="mt-2">
			<div className="flex flex-wrap items-center gap-2">
				<Cpu className={`h-4 w-4 ${muted}`} aria-hidden="true" />
				{config.buyerSelectEnabled ? (
					<select
						value={config.effectiveModelId}
						onChange={handleChange}
						disabled={saving}
						aria-label="Investigation model"
						className={`rounded-xl border px-3 py-1.5 text-xs outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${
							darkMode
								? "border-white/10 bg-slate-900/70 text-slate-100 focus:border-indigo-400"
								: "border-slate-200 bg-white text-slate-800 focus:border-indigo-400"
						}`}
					>
						{config.allowed.map((id) => (
							<option key={id} value={id}>
								{id} · free
							</option>
						))}
					</select>
				) : (
					<span
						className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${
							darkMode
								? "border-white/10 bg-white/5 text-slate-300"
								: "border-slate-200 bg-slate-100 text-slate-600"
						}`}
					>
						Investigation model: {config.effectiveModelId}
					</span>
				)}
				{saving ? <span className={`text-xs ${muted}`}>Saving…</span> : null}
			</div>
			{error ? <p className="mt-1 text-xs text-rose-400">{error}</p> : null}
			<p className={`mt-1 text-[11px] ${muted}`}>
				Applies to the clarifying chat and the investigation. Free models only.
			</p>
		</div>
	);
}
