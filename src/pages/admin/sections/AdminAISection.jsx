import {
	AlertCircle,
	CheckCircle,
	Copy,
	KeyRound,
	ListChecks,
	Plus,
	RefreshCw,
	Save,
	Search,
	Trash2,
	UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { useModalFocus } from "../../../hooks/useModalFocus.js";
import { apiRequest, getToken } from "../../../lib/auth.js";
import { cn } from "../../../lib/cn.js";

function formatDate(value) {
	if (!value) return "—";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat(undefined, {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(d);
}

const PANEL =
	"rounded-3xl border p-5 sm:p-6 " +
	"bg-[#151020]/80 border-purple-400/10 text-slate-200 " +
	"shadow-[0_30px_80px_-40px_rgba(168,85,247,0.45)] backdrop-blur-xl";

// The five investigation agents, in the order the queue runs them. Mirrors
// AGENT_ROLES in server/services/investigation/agents.js.
const INVESTIGATION_ROLES = ["lead", "code", "repo", "research", "verify"];

/**
 * One line of live health for a model: what its investigation runs actually
 * did over the recent window. Empty when the model has not been picked yet —
 * "no runs" is not the same as "healthy", so it says nothing rather than
 * claiming a clean record.
 */
function describeModelHealth(stats) {
	if (!(stats && Number(stats.runs))) {
		return "";
	}
	const parts = [`${stats.runs} run${stats.runs === 1 ? "" : "s"}`];
	if (Number(stats.failed)) {
		const refusals = Number(stats.quotaRefusals) + Number(stats.otherRefusals);
		parts.push(`${stats.failed} failed${refusals ? ` (${refusals} refused)` : ""}`);
	}
	if (stats.avgMs != null) {
		parts.push(`avg ${Math.max(1, Math.round(stats.avgMs / 1000))}s`);
	}
	return parts.join(" · ");
}

export function AdminAISection() {
	const [activeTab, setActiveTab] = useState("tokens");

	/* ---------- Investigation Models ---------- */
	const [modelsAdmin, setModelsAdmin] = useState(null);
	const [modelsAdminLoading, setModelsAdminLoading] = useState(false);
	const [modelsAdminSaving, setModelsAdminSaving] = useState(false);
	const [modelsAdminError, setModelsAdminError] = useState("");
	const [modelsAdminNotice, setModelsAdminNotice] = useState("");
	const [newRule, setNewRule] = useState({ keyword: "", modelId: "", role: "" });

	async function fetchModelsAdmin(refresh) {
		try {
			setModelsAdminLoading(true);
			setModelsAdminError("");
			const data = await apiRequest(
				refresh ? "/admin/support-models?refresh=1" : "/admin/support-models",
				{ token: getToken() },
			);
			setModelsAdmin({
				catalog: Array.isArray(data?.catalog) ? data.catalog : [],
				allowed: Array.isArray(data?.allowed) ? data.allowed : [],
				default: data?.default ?? "",
				buyerSelectEnabled: data?.buyerSelectEnabled !== false,
				catalogStale: Boolean(data?.catalogStale),
				health: data?.health ?? { windowDays: 0, runs: 0, models: {} },
				roleModels: data?.roleModels ?? {},
				routing: Array.isArray(data?.routing) ? data.routing : [],
			});
		} catch (err) {
			setModelsAdminError(err?.message || "Failed to load investigation models");
		} finally {
			setModelsAdminLoading(false);
		}
	}

	async function saveModelsAdmin() {
		if (!modelsAdmin) return;
		if (modelsAdmin.allowed.length === 0) {
			setModelsAdminError("At least one investigation model must stay allowed");
			return;
		}
		setModelsAdminSaving(true);
		setModelsAdminError("");
		setModelsAdminNotice("");
		try {
			await apiRequest("/admin/support-models", {
				method: "PUT",
				token: getToken(),
				body: {
					allowed: modelsAdmin.allowed,
					roleModels: modelsAdmin.roleModels ?? {},
					routing: modelsAdmin.routing ?? [],
					default: modelsAdmin.default,
					buyerSelectEnabled: modelsAdmin.buyerSelectEnabled,
				},
			});
			await fetchModelsAdmin(false);
			setModelsAdminNotice("Saved");
			setTimeout(() => setModelsAdminNotice(""), 1600);
		} catch (err) {
			setModelsAdminError(err?.message || "Failed to save investigation models");
		} finally {
			setModelsAdminSaving(false);
		}
	}

	/**
	 * Add an auto-routing rule: when the case text contains the keyword, the
	 * named model leads that role's chain.
	 */
	function addRoutingRule() {
		const keyword = newRule.keyword.trim();
		const modelId = newRule.modelId.trim();
		if (!(keyword && modelId)) {
			setModelsAdminError("A routing rule needs a keyword and a model.");
			return;
		}
		setModelsAdminError("");
		setModelsAdmin((prev) => {
			if (!prev) return prev;
			const rule = newRule.role ? { keyword, modelId, role: newRule.role } : { keyword, modelId };
			return { ...prev, routing: [...(prev.routing ?? []), rule] };
		});
		setNewRule({ keyword: "", modelId: "", role: "" });
	}

	function removeRoutingRule(index) {
		setModelsAdmin((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				routing: (prev.routing ?? []).filter((_, i) => i !== index),
			};
		});
	}

	/**
	 * Pin a model to one agent role, or unpin it ("" = the chain decides).
	 */
	function setRoleModel(role, modelId) {
		setModelsAdmin((prev) => {
			if (!prev) return prev;
			const roleModels = { ...(prev.roleModels ?? {}) };
			if (modelId) {
				roleModels[role] = modelId;
			} else {
				delete roleModels[role];
			}
			return { ...prev, roleModels };
		});
	}

	function toggleAllowedModel(id) {
		setModelsAdmin((prev) => {
			if (!prev) return prev;
			const checked = !prev.allowed.includes(id);
			const allowed = checked ? [...prev.allowed, id] : prev.allowed.filter((x) => x !== id);
			const def = allowed.includes(prev.default) ? prev.default : (allowed[0] ?? "");
			return { ...prev, allowed, default: def };
		});
	}

	/* ---------- Support Tokens ---------- */
	const [tokens, setTokens] = useState([]);
	const [tokensLoading, setTokensLoading] = useState(false);
	const [tokensError, setTokensError] = useState("");
	const [tokensNotice, setTokensNotice] = useState("");
	const [accountQuery, setAccountQuery] = useState("");
	const [accountResults, setAccountResults] = useState([]);
	const [accountSearching, setAccountSearching] = useState(false);
	const [pickedAccount, setPickedAccount] = useState(null);
	const [newLabel, setNewLabel] = useState("");
	const [newExpiry, setNewExpiry] = useState("never"); // never | 30d | 90d | custom
	const [customDate, setCustomDate] = useState("");
	const [issuedToken, setIssuedToken] = useState(null);
	const [issuedBusy, setIssuedBusy] = useState(false);
	const [tokenCopied, setTokenCopied] = useState(false);
	const issuedPanelRef = useRef(null);
	useModalFocus(Boolean(issuedToken), issuedPanelRef, () => setIssuedToken(null));

	async function fetchTokens() {
		try {
			setTokensLoading(true);
			setTokensError("");
			const data = await apiRequest("/admin/support-tokens", { token: getToken() });
			setTokens(Array.isArray(data?.items) ? data.items : []);
		} catch (err) {
			setTokensError(err?.message || "Failed to load support tokens");
		} finally {
			setTokensLoading(false);
		}
	}

	async function searchAccounts(event) {
		event?.preventDefault?.();
		const q = accountQuery.trim();
		if (!q) {
			setAccountResults([]);
			return;
		}
		try {
			setAccountSearching(true);
			setTokensError("");
			const data = await apiRequest(`/users/search?q=${encodeURIComponent(q)}`, {
				token: getToken(),
			});
			const items = Array.isArray(data?.items) ? data.items : [];
			setAccountResults(items.filter((u) => u?.status !== "locked"));
		} catch (err) {
			setTokensError(err?.message || "Unable to search accounts");
		} finally {
			setAccountSearching(false);
		}
	}

	function expiryForSelection() {
		const now = Date.now();
		if (newExpiry === "30d") return new Date(now + 30 * 86_400_000).toISOString();
		if (newExpiry === "90d") return new Date(now + 90 * 86_400_000).toISOString();
		if (newExpiry === "custom") {
			const date = new Date(customDate);
			return Number.isNaN(date.getTime()) ? null : date.toISOString();
		}
		return null;
	}

	async function issueToken() {
		if (!(pickedAccount && newLabel.trim())) return;
		if (newExpiry === "custom" && !expiryForSelection()) {
			setTokensError("Pick a date for the custom expiry.");
			return;
		}
		try {
			setIssuedBusy(true);
			setTokensError("");
			setTokensNotice("");
			const expiresAt = expiryForSelection();
			const body = { buyerUserId: pickedAccount.id, label: newLabel.trim() };
			if (expiresAt) body.expiresAt = expiresAt;
			const issued = await apiRequest("/admin/support-tokens", {
				method: "POST",
				token: getToken(),
				body,
			});
			setIssuedToken(issued ?? null);
			setTokenCopied(false);
			setNewLabel("");
			setNewExpiry("never");
			setCustomDate("");
			setPickedAccount(null);
			setAccountQuery("");
			setAccountResults([]);
			await fetchTokens();
		} catch (err) {
			setTokensError(err?.message || "Failed to issue the token");
		} finally {
			setIssuedBusy(false);
		}
	}

	async function revokeToken(id) {
		if (!window.confirm("Revoke this support token? The account loses AI access immediately.")) {
			return;
		}
		try {
			const result = await apiRequest(`/admin/support-tokens/${id}/revoke`, {
				method: "POST",
				token: getToken(),
				body: {},
			});
			setTokensNotice(result?.revoked ? "Token revoked" : "Token already revoked");
			await fetchTokens();
		} catch (err) {
			setTokensError(err?.message || "Failed to revoke the token");
		}
	}

	async function copyIssuedToken() {
		if (!issuedToken?.token) return;
		try {
			await navigator.clipboard.writeText(issuedToken.token);
			setTokenCopied(true);
		} catch {
			setTokensError("Copy failed — select the token and copy it manually.");
		}
	}

	// Load tokens once on mount; investigation models only when that tab opens.
	useEffect(() => {
		fetchTokens();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (activeTab === "models") {
			fetchModelsAdmin(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	/* ---------- Render ---------- */
	const tabs = [
		{ id: "tokens", label: "Support Tokens", icon: KeyRound },
		{ id: "models", label: "Investigation Models", icon: ListChecks },
	];

	return (
		<div class="space-y-5">
			{/* Brand header */}
			<div class={cn(PANEL, "p-6")}>
				<div class="flex items-center gap-4">
					<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9333ea] to-[#c026d3] text-white shadow-[0_0_28px_-8px_rgba(168,85,247,0.6)]">
						<ListChecks class="h-6 w-6" />
					</div>
					<div class="min-w-0">
						<h2 class="text-2xl font-semibold tracking-tight text-[#f4eeff]">AI Support</h2>
						<p class="text-sm text-[#a99bbd]">
							Token-gated support access and free investigation models only (OpenCode).
						</p>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div
				role="tablist"
				aria-label="AI Support sections"
				class="flex gap-1.5 rounded-2xl border border-purple-400/10 bg-[#0b0714]/50 p-1.5"
			>
				{tabs.map((tab) => {
					const active = activeTab === tab.id;
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							type="button"
							role="tab"
							aria-selected={active}
							aria-controls={`ai-panel-${tab.id}`}
							id={`ai-tab-${tab.id}`}
							onClick={() => setActiveTab(tab.id)}
							class={cn(
								"flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60",
								active
									? "bg-purple-500/20 text-purple-300 ring-1 ring-inset ring-purple-500/40"
									: "text-slate-400 hover:text-white",
							)}
						>
							<Icon class="h-4 w-4" aria-hidden="true" />
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* Support Tokens */}
			{activeTab === "tokens" && (
				<div
					role="tabpanel"
					id="ai-panel-tokens"
					aria-labelledby="ai-tab-tokens"
					class="grid gap-5 lg:grid-cols-3"
				>
					{/* Issue card */}
					<div class={cn("lg:col-span-2", PANEL)}>
						<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
							<div class="flex items-center gap-2">
								<KeyRound class="h-5 w-5 text-purple-400" />
								<h3 class="font-semibold text-[#f4eeff]">Issue a support token</h3>
							</div>
							<button
								type="button"
								onClick={fetchTokens}
								disabled={tokensLoading}
								class="flex items-center gap-2 rounded-xl border border-slate-600 px-3 py-1.5 text-xs text-slate-300 transition-all hover:text-white disabled:opacity-50"
							>
								<RefreshCw class={cn("h-3.5 w-3.5", tokensLoading && "animate-spin")} />
								Refresh
							</button>
						</div>
						<p class="mb-4 text-xs text-slate-400">
							Tokens open the AI support chat. Any account role is eligible. Shown once at creation.
						</p>

						{tokensError && (
							<div
								role="alert"
								class="mb-3 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
							>
								<AlertCircle class="h-4 w-4" aria-hidden="true" />
								{tokensError}
							</div>
						)}
						{tokensNotice && (
							<div
								role="status"
								class="mb-3 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400"
							>
								<CheckCircle class="h-4 w-4" aria-hidden="true" />
								{tokensNotice}
							</div>
						)}

						<form onSubmit={searchAccounts} class="flex flex-wrap gap-2">
							<div class="relative min-w-0 flex-1">
								<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<input
									type="text"
									value={accountQuery}
									onChange={(e) => setAccountQuery(e.target.value)}
									placeholder="Search accounts by name or email…"
									aria-label="Search accounts"
									class="w-full rounded-2xl border border-purple-400/10 bg-[#0b0714]/60 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-purple-500/70 focus:ring-2 focus-visible:ring-purple-500/60"
								/>
							</div>
							<button
								type="submit"
								disabled={accountSearching}
								class="flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm font-medium text-purple-400 transition-all hover:bg-purple-500/20 disabled:opacity-50"
							>
								{accountSearching ? (
									<ThreeDot variant="bounce" color="#a855f7" size="small" text="" textColor="" />
								) : (
									<Search class="h-4 w-4" />
								)}
								Search
							</button>
						</form>

						{accountResults.length > 0 && (
							<ul class="mt-2 divide-y divide-white/5 overflow-hidden rounded-2xl border border-purple-400/10 bg-[#0b0714]/40">
								{accountResults.map((user) => (
									<li key={user.id}>
										<button
											type="button"
											onClick={() => {
												setPickedAccount(user);
												setAccountResults([]);
											}}
											class="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-purple-500/10"
										>
											<UserRound class="h-4 w-4 shrink-0 text-slate-400" />
											<span class="min-w-0 flex-1 truncate text-sm text-slate-100">
												{user.name || user.email}
											</span>
											<span class="shrink-0 rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-purple-300">
												{user.role}
											</span>
										</button>
									</li>
								))}
							</ul>
						)}

						{pickedAccount && (
							<div class="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm">
								<span class="min-w-0 truncate text-purple-200">
									Issuing to: <strong>{pickedAccount.name || pickedAccount.email}</strong> (
									{pickedAccount.email})
								</span>
								<button
									type="button"
									onClick={() => setPickedAccount(null)}
									class="shrink-0 text-xs text-slate-400 transition-colors hover:text-white"
								>
									Clear
								</button>
							</div>
						)}

						<div class="mt-4 grid gap-3 sm:grid-cols-2">
							<input
								type="text"
								value={newLabel}
								onChange={(e) => setNewLabel(e.target.value)}
								placeholder="Label — e.g. Acme Corp"
								aria-label="Token label"
								class="rounded-2xl border border-purple-400/10 bg-[#0b0714]/60 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-purple-500/70 focus:ring-2 focus-visible:ring-purple-500/60"
							/>
							<select
								value={newExpiry}
								onChange={(e) => setNewExpiry(e.target.value)}
								aria-label="Token expiry"
								class="rounded-2xl border border-purple-400/10 bg-[#0b0714]/60 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-purple-500/70 focus:ring-2 focus-visible:ring-purple-500/60"
							>
								<option value="never">Never expires</option>
								<option value="30d">Expires in 30 days</option>
								<option value="90d">Expires in 90 days</option>
								<option value="custom">Custom date…</option>
							</select>
						</div>
						{newExpiry === "custom" && (
							<input
								type="date"
								value={customDate}
								onChange={(e) => setCustomDate(e.target.value)}
								aria-label="Custom expiry date"
								class="mt-3 rounded-2xl border border-purple-400/10 bg-[#0b0714]/60 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500/70 focus:ring-2 focus-visible:ring-purple-500/60"
							/>
						)}
						<button
							type="button"
							onClick={issueToken}
							disabled={issuedBusy || !pickedAccount || !newLabel.trim()}
							class="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#9333ea] to-[#c026d3] px-5 py-2.5 text-sm font-semibold text-[#f4eeff] shadow-[0_0_24px_-10px_rgba(168,85,247,0.55)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
						>
							{issuedBusy ? (
								<ThreeDot variant="bounce" color="#a855f7" size="small" text="" textColor="" />
							) : (
								<KeyRound class="h-4 w-4" />
							)}
							{issuedBusy ? "Issuing…" : "Issue token"}
						</button>
					</div>

					{/* Issued tokens card */}
					<div class={cn(PANEL, "flex flex-col")}>
						<div class="mb-3 border-b border-white/5 pb-3">
							<h3 class="font-semibold text-[#f4eeff]">Issued tokens ({tokens.length})</h3>
						</div>
						{tokensLoading ? (
							<div class="flex justify-center py-10">
								<ThreeDot variant="bounce" color="#a855f7" size="small" text="" textColor="" />
							</div>
						) : tokens.length === 0 ? (
							<p class="py-10 text-center text-sm text-slate-400">No tokens issued yet</p>
						) : (
							<ul class="max-h-96 space-y-2 overflow-y-auto pr-1">
								{tokens.map((row) => {
									const revoked = Boolean(row.revoked_at);
									const expired = row.expires_at
										? new Date(row.expires_at).getTime() <= Date.now()
										: false;
									const active = !(revoked || expired);
									const status = revoked ? "Revoked" : expired ? "Expired" : "Active";
									return (
										<li
											key={row.id}
											class="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-[#0b0714]/50 px-3 py-2.5"
										>
											<div class="min-w-0 flex-1">
												<p class="truncate text-xs font-medium text-slate-100">
													{row.buyer?.name || row.buyer?.email || row.buyer_id}
												</p>
												<p class="truncate text-[10px] text-slate-400">
													{row.label} · {formatDate(row.created_at)} ·{" "}
													{row.expires_at ? `exp ${formatDate(row.expires_at)}` : "never expires"}
												</p>
											</div>
											<div class="flex shrink-0 items-center gap-2">
												<span
													class={cn(
														"rounded-full border px-2 py-0.5 text-[10px] font-medium",
														revoked
															? "border-red-500/30 bg-red-500/10 text-red-400"
															: expired
																? "border-amber-500/30 bg-amber-500/10 text-amber-400"
																: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
													)}
												>
													{status}
												</span>
												{active && (
													<button
														type="button"
														onClick={() => revokeToken(row.id)}
														aria-label="Revoke token"
														class="rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 transition-all hover:bg-red-500/20"
													>
														<Trash2 class="h-3.5 w-3.5" />
													</button>
												)}
											</div>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>
			)}

			{/* Investigation Models */}
			{activeTab === "models" && (
				<div role="tabpanel" id="ai-panel-models" aria-labelledby="ai-tab-models" class={cn(PANEL)}>
					<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
						<div class="flex flex-wrap items-center gap-2">
							<ListChecks class="h-5 w-5 text-purple-400" />
							<h3 class="font-semibold text-[#f4eeff]">Investigation Models</h3>
							{modelsAdmin?.catalogStale && (
								<span class="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs text-amber-300">
									stale catalog
								</span>
							)}
						</div>
						<button
							type="button"
							onClick={() => fetchModelsAdmin(true)}
							disabled={modelsAdminLoading}
							class="flex items-center gap-2 rounded-xl border border-slate-600 px-3 py-1.5 text-xs text-slate-300 transition-all hover:text-white disabled:opacity-50"
						>
							<RefreshCw class={cn("h-3.5 w-3.5", modelsAdminLoading && "animate-spin")} />
							Refresh
						</button>
					</div>
					<p class="mb-4 text-xs text-slate-400">
						Owner-controlled. Free OpenCode models only; iceman-free is permanently excluded.
					</p>
					{modelsAdmin?.health?.windowDays ? (
						<p class="mb-3 text-[11px] text-slate-400">
							Last {modelsAdmin.health.windowDays} days · {modelsAdmin.health.runs || 0}{" "}
							investigation run{modelsAdmin.health.runs === 1 ? "" : "s"} recorded
						</p>
					) : null}

					{modelsAdminError && (
						<div
							role="alert"
							class="mb-3 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
						>
							<AlertCircle class="h-4 w-4" aria-hidden="true" />
							{modelsAdminError}
						</div>
					)}
					{modelsAdminNotice && (
						<div
							role="status"
							class="mb-3 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400"
						>
							<CheckCircle class="h-4 w-4" aria-hidden="true" />
							{modelsAdminNotice}
						</div>
					)}

					{modelsAdminLoading && !modelsAdmin ? (
						<div class="flex justify-center py-10">
							<ThreeDot variant="bounce" color="#a855f7" size="small" text="" textColor="" />
						</div>
					) : (
						<>
							<div class="space-y-2">
								{(modelsAdmin?.catalog ?? []).map((model) => {
									const checked = modelsAdmin?.allowed.includes(model.id) ?? false;
									return (
										<label
											key={model.id}
											class={cn(
												"flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-2.5 transition-all",
												checked
													? "border-purple-500/30 bg-purple-500/5"
													: "border-white/5 hover:border-white/15",
											)}
										>
											<input
												type="checkbox"
												checked={checked}
												onChange={() => toggleAllowedModel(model.id)}
												disabled={modelsAdminSaving}
												class="h-4 w-4 accent-purple-500"
												aria-label={`Allow ${model.id}`}
											/>
											<span class="min-w-0 flex-1 font-mono text-xs text-slate-100">
												{model.id}
											</span>
											<span class="shrink-0 text-[10px] uppercase tracking-wider text-slate-400">
												{model.ownedBy ?? model.providerID}
											</span>
											{describeModelHealth(modelsAdmin?.health?.models?.[model.id]) ? (
												<span
													class="shrink-0 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-slate-400"
													title={`Last ${modelsAdmin?.health?.windowDays ?? 14} days`}
												>
													{describeModelHealth(modelsAdmin?.health?.models?.[model.id])}
												</span>
											) : null}
										</label>
									);
								})}
								{(modelsAdmin?.allowed ?? [])
									.filter((id) => !(modelsAdmin?.catalog ?? []).some((m) => m.id === id))
									.map((id) => (
										<div
											key={id}
											class="flex items-center gap-3 rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-200"
										>
											<span class="font-mono">{id}</span>
											<span class="ml-auto rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
												persisted
											</span>
										</div>
									))}
							</div>

							<div class="mt-4 rounded-2xl border border-purple-400/10 bg-[#0b0714]/40 p-4">
								<p class="text-xs font-medium text-slate-300">Auto-routing rules</p>
								<p class="mt-1 text-[11px] text-slate-400">
									When the case text contains the keyword, that model leads the chain for the role.
									The first matching rule wins.
								</p>
								{(modelsAdmin?.routing ?? []).length > 0 ? (
									<ul class="mt-3 space-y-1.5">
										{(modelsAdmin?.routing ?? []).map((rule, index) => (
											<li
												key={`${rule.keyword}-${rule.modelId}-${rule.role || "any"}-${index}`}
												class="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-xs"
											>
												<span class="font-mono text-slate-100">{rule.keyword}</span>
												<span class="text-slate-400">→</span>
												<span class="font-mono text-slate-300">{rule.modelId}</span>
												<span class="rounded-full border border-purple-400/20 bg-purple-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-purple-300">
													{rule.role || "all roles"}
												</span>
												<button
													type="button"
													onClick={() => removeRoutingRule(index)}
													aria-label={`Remove the routing rule for ${rule.keyword}`}
													class="ml-auto rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 transition-all hover:bg-red-500/20"
												>
													<Trash2 class="h-3.5 w-3.5" />
												</button>
											</li>
										))}
									</ul>
								) : null}
								<div class="mt-3 grid gap-2 sm:grid-cols-4">
									<input
										type="text"
										value={newRule.keyword}
										onChange={(e) => setNewRule((p) => ({ ...p, keyword: e.target.value }))}
										placeholder="keyword"
										aria-label="Routing keyword"
										class="rounded-xl border border-purple-400/10 bg-[#0b0714]/60 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-400 focus:border-purple-500/70 focus:ring-2 focus-visible:ring-purple-500/60"
									/>
									<select
										value={newRule.modelId}
										onChange={(e) => setNewRule((p) => ({ ...p, modelId: e.target.value }))}
										aria-label="Routing model"
										class="rounded-xl border border-purple-400/10 bg-[#0b0714]/60 px-3 py-2 text-xs text-white outline-none focus:border-purple-500/70 focus:ring-2 focus-visible:ring-purple-500/60"
									>
										<option value="">model…</option>
										{(modelsAdmin?.allowed ?? []).map((id) => (
											<option key={id} value={id}>
												{id}
											</option>
										))}
									</select>
									<select
										value={newRule.role}
										onChange={(e) => setNewRule((p) => ({ ...p, role: e.target.value }))}
										aria-label="Routing role"
										class="rounded-xl border border-purple-400/10 bg-[#0b0714]/60 px-3 py-2 text-xs text-white outline-none focus:border-purple-500/70 focus:ring-2 focus-visible:ring-purple-500/60"
									>
										<option value="">all roles</option>
										{INVESTIGATION_ROLES.map((role) => (
											<option key={role} value={role}>
												{role}
											</option>
										))}
									</select>
									<button
										type="button"
										onClick={addRoutingRule}
										class="flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-300 transition-all hover:bg-purple-500/20"
									>
										<Plus class="h-3.5 w-3.5" />
										Add rule
									</button>
								</div>
							</div>

							<div class="mt-5 rounded-2xl border border-purple-400/10 bg-[#0b0714]/40 p-4">
								<p class="text-xs font-medium text-slate-300">Per-agent models</p>
								<p class="mt-1 text-[11px] text-slate-400">
									Pin a model to one agent. &quot;Chain&quot; lets the free-model chain pick it.
								</p>
								<div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
									{INVESTIGATION_ROLES.map((role) => (
										<label key={role} class="block">
											<span class="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
												{role}
											</span>
											<select
												value={modelsAdmin?.roleModels?.[role] ?? ""}
												onChange={(e) => setRoleModel(role, e.target.value)}
												disabled={modelsAdminSaving || (modelsAdmin?.allowed.length ?? 0) === 0}
												aria-label={`Model for the ${role} agent`}
												class="w-full rounded-xl border border-purple-400/10 bg-[#0b0714]/60 px-3 py-2 text-xs text-white outline-none focus:border-purple-500/70 focus:ring-2 focus-visible:ring-purple-500/60"
											>
												<option value="">Chain (auto)</option>
												{(modelsAdmin?.allowed ?? []).map((id) => (
													<option key={id} value={id}>
														{id}
													</option>
												))}
											</select>
										</label>
									))}
								</div>
							</div>

							<div class="mt-4 flex flex-wrap items-end justify-between gap-4">
								<label class="block">
									<span class="mb-1.5 block text-xs font-medium text-slate-400">Default model</span>
									<select
										value={modelsAdmin?.default ?? ""}
										onChange={(e) =>
											setModelsAdmin((p) => (p ? { ...p, default: e.target.value } : p))
										}
										disabled={modelsAdminSaving || (modelsAdmin?.allowed.length ?? 0) === 0}
										class="rounded-2xl border border-purple-400/10 bg-[#0b0714]/60 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500/70 focus:ring-2 focus-visible:ring-purple-500/60"
									>
										{(modelsAdmin?.allowed ?? []).map((id) => (
											<option key={id} value={id}>
												{id}
											</option>
										))}
									</select>
								</label>

								<label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-purple-400/10 bg-[#0b0714]/50 px-4 py-2.5">
									<input
										type="checkbox"
										checked={modelsAdmin?.buyerSelectEnabled ?? true}
										onChange={() =>
											setModelsAdmin((p) =>
												p ? { ...p, buyerSelectEnabled: !p.buyerSelectEnabled } : p,
											)
										}
										disabled={modelsAdminSaving}
										class="h-4 w-4 accent-purple-500"
										aria-label="Buyers can change model per message"
									/>
									<span class="text-xs leading-5 text-slate-300">
										Buyers can change model per message
									</span>
								</label>
							</div>

							<div class="mt-4 flex justify-end">
								<button
									type="button"
									onClick={saveModelsAdmin}
									disabled={modelsAdminSaving || !modelsAdmin}
									class="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#9333ea] to-[#c026d3] px-5 py-2.5 text-sm font-semibold text-[#f4eeff] shadow-[0_0_24px_-10px_rgba(168,85,247,0.55)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
								>
									{modelsAdminSaving ? (
										<ThreeDot variant="bounce" color="#a855f7" size="small" text="" textColor="" />
									) : (
										<Save class="h-4 w-4" />
									)}
									{modelsAdminSaving ? "Saving…" : "Save"}
								</button>
							</div>
						</>
					)}
				</div>
			)}

			{/* Issued token modal */}
			{issuedToken && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Support token issued"
					class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
				>
					<div
						ref={issuedPanelRef}
						class="w-full max-w-lg rounded-3xl border border-purple-400/20 bg-[#151020] p-6 text-[#f4eeff] shadow-2xl"
					>
						<div class="mb-3 flex items-center gap-2">
							<KeyRound class="h-5 w-5 text-purple-400" />
							<h3 class="text-lg font-semibold">Support token issued</h3>
						</div>
						<p class="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-300">
							Store it now — it will not be shown again.
						</p>
						<code class="mt-3 block break-all rounded-2xl border border-purple-400/10 bg-[#0b0714] px-4 py-3 font-mono text-xs leading-6 text-purple-200">
							{issuedToken.token}
						</code>
						<div class="mt-4 flex items-center justify-between gap-3">
							<button
								type="button"
								onClick={copyIssuedToken}
								class="flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-medium text-purple-300 transition-all hover:bg-purple-500/20"
							>
								{tokenCopied ? <CheckCircle class="h-4 w-4" /> : <Copy class="h-4 w-4" />}
								{tokenCopied ? "Copied" : "Copy"}
							</button>
							<button
								type="button"
								onClick={() => setIssuedToken(null)}
								class="rounded-2xl bg-gradient-to-r from-[#9333ea] to-[#c026d3] px-5 py-2 text-xs font-semibold text-[#f4eeff] transition-all hover:brightness-110"
							>
								Done
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
