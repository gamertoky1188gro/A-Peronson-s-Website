/**
 * Admin AI Section - AI Rules & Configuration
 */

import {
	AlertCircle,
	Bot,
	Check,
	CheckCircle,
	Code2,
	Copy,
	KeyRound,
	Lightbulb,
	ListChecks,
	MessageSquare,
	Plus,
	RefreshCw,
	Save,
	Settings,
	ToggleLeft,
	ToggleRight,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Mosaic, ThreeDot } from "react-loading-indicators";
import { apiRequest, getToken } from "../../../lib/auth.js";
import { cn } from "../../../lib/cn.js";
import { TIMEOUTS } from "../../../lib/constants.js";
import { logger } from "../../../lib/logger.js";

/**
 * A date for the tokens table, or an em dash.
 *
 * @param {string|null|undefined} value - The stored timestamp.
 * @returns {string} The local date-time, or "—".
 */
function formatTokenDate(value) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export function AdminAISection({ activeCategory, adminDark }) {
	const [rules, setRules] = useState({ globalRules: [], smallTalkRules: [] });
	const [config, setConfig] = useState({
		systemPrompt: "",
		agentPrompt: "",
		codeContextEnabled: true,
		codeContextKeywords: "",
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [notice, setNotice] = useState("");
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState("settings");

	const [newRule, setNewRule] = useState({
		source: "",
		keywords: "",
		response: "",
	});
	const [showAddForm, setShowAddForm] = useState(false);

	const [tokens, setTokens] = useState([]);
	const [tokensLoading, setTokensLoading] = useState(false);
	const [tokensError, setTokensError] = useState("");
	const [tokensNotice, setTokensNotice] = useState("");
	const [buyerQuery, setBuyerQuery] = useState("");
	const [buyerResults, setBuyerResults] = useState([]);
	const [buyerSearching, setBuyerSearching] = useState(false);
	const [pickedBuyer, setPickedBuyer] = useState(null);
	const [newLabel, setNewLabel] = useState("");
	const [newExpiry, setNewExpiry] = useState("never"); // never|30d|90d|custom
	const [customDate, setCustomDate] = useState("");
	const [issuedToken, setIssuedToken] = useState(null); // { token, …row } — shown once
	const [issuedBusy, setIssuedBusy] = useState(false);
	const [tokenCopied, setTokenCopied] = useState(false);
	const [modelsAdmin, setModelsAdmin] = useState(null);
	const [modelsAdminLoading, setModelsAdminLoading] = useState(false);
	const [modelsAdminSaving, setModelsAdminSaving] = useState(false);
	const [modelsAdminError, setModelsAdminError] = useState("");
	const [modelsAdminNotice, setModelsAdminNotice] = useState("");

	async function fetchModelsAdmin(refresh = false) {
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
				catalogFetchedAt: data?.catalogFetchedAt ?? null,
			});
		} catch (err) {
			setModelsAdminError(err?.message || "Failed to load the investigation models");
		} finally {
			setModelsAdminLoading(false);
		}
	}

	// Toggling a checkbox edits the pending allowlist in component state;
	// nothing is persisted until Save. The default snaps to the first
	// pending allowed id when its option disappears.
	function toggleAllowedModel(id) {
		setModelsAdmin((prev) => {
			if (!prev) {
				return prev;
			}
			const checked = !prev.allowed.includes(id);
			const allowed = checked ? [...prev.allowed, id] : prev.allowed.filter((x) => x !== id);
			const def = allowed.includes(prev.default) ? prev.default : (allowed[0] ?? "");
			return { ...prev, allowed, default: def };
		});
	}

	async function saveModelsAdmin() {
		if (!modelsAdmin) {
			return;
		}
		if (modelsAdmin.allowed.length === 0) {
			setModelsAdminError("At least one model must stay allowed");
			return;
		}
		setModelsAdminSaving(true);
		setModelsAdminError("");
		setModelsAdminNotice("");
		const def = modelsAdmin.allowed.includes(modelsAdmin.default)
			? modelsAdmin.default
			: modelsAdmin.allowed[0];
		try {
			await apiRequest("/admin/support-models", {
				method: "PUT",
				token: getToken(),
				body: {
					allowed: modelsAdmin.allowed,
					default: def,
					buyerSelectEnabled: modelsAdmin.buyerSelectEnabled,
				},
			});
			await fetchModelsAdmin();
			setModelsAdminNotice("Saved");
			setTimeout(() => setModelsAdminNotice(""), TIMEOUTS.LONG);
		} catch (err) {
			setModelsAdminError(err?.message || "Failed to save the investigation models");
		} finally {
			setModelsAdminSaving(false);
		}
	}

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

	async function searchBuyers(event) {
		event?.preventDefault?.();
		const q = buyerQuery.trim();
		if (!q) {
			setBuyerResults([]);
			return;
		}
		try {
			setBuyerSearching(true);
			setTokensError("");
			const data = await apiRequest(`/users/search?q=${encodeURIComponent(q)}`, {
				token: getToken(),
			});
			const items = Array.isArray(data?.items) ? data.items : [];
			setBuyerResults(items);
		} catch (err) {
			setTokensError(err?.message || "Unable to search users");
		} finally {
			setBuyerSearching(false);
		}
	}

	function expiryForSelection() {
		const now = Date.now();
		if (newExpiry === "30d") {
			return new Date(now + 30 * 86_400_000).toISOString();
		}
		if (newExpiry === "90d") {
			return new Date(now + 90 * 86_400_000).toISOString();
		}
		if (newExpiry === "custom") {
			const date = new Date(customDate);
			return Number.isNaN(date.getTime()) ? null : date.toISOString();
		}
		return null;
	}

	async function issueToken() {
		if (!(pickedBuyer && newLabel.trim())) {
			return;
		}
		if (newExpiry === "custom" && !expiryForSelection()) {
			setTokensError("Pick a date for the custom expiry.");
			return;
		}
		try {
			setIssuedBusy(true);
			setTokensError("");
			setTokensNotice("");
			const expiresAt = expiryForSelection();
			const body = { buyerUserId: pickedBuyer.id, label: newLabel.trim() };
			if (expiresAt) {
				body.expiresAt = expiresAt;
			}
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
			setPickedBuyer(null);
			setBuyerQuery("");
			setBuyerResults([]);
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
			setTokensError("");
			setTokensNotice("");
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
		if (!issuedToken?.token) {
			return;
		}
		try {
			await navigator.clipboard.writeText(issuedToken.token);
			setTokenCopied(true);
		} catch {
			setTokensError("Copy failed — select the token and copy it manually.");
		}
	}

	async function fetchData() {
		try {
			setLoading(true);
			const [rulesData, configData] = await Promise.all([
				apiRequest("/api/assistant/rules", { token: true }),
				apiRequest("/api/assistant/config", { token: true }),
			]);
			if (rulesData) {
				setRules({
					globalRules: rulesData.globalRules || [],
					smallTalkRules: rulesData.smallTalkRules || [],
				});
			}
			if (configData) {
				setConfig({
					systemPrompt: configData.systemPrompt || "",
					agentPrompt: configData.agentPrompt || "",
					codeContextEnabled: configData.codeContextEnabled !== false,
					codeContextKeywords: (configData.codeContextKeywords || []).join(", "),
				});
			}
		} catch (err) {
			logger.warn("Failed to load AI data:", err);
			setError("Failed to load data");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchData();
	}, [
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchData,
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: fetch when the tab opens
	useEffect(() => {
		if (activeTab === "tokens") {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			fetchTokens();
		} else if (activeTab === "models-admin") {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			fetchModelsAdmin();
		}
	}, [activeTab]);

	if (activeCategory !== "ai") {
		return null;
	}

	async function saveConfig() {
		setSaving(true);
		setError("");
		setNotice("");
		try {
			await apiRequest("/api/assistant/config", {
				method: "POST",
				token: true,
				body: {
					systemPrompt: config.systemPrompt,
					agentPrompt: config.agentPrompt,
					codeContextEnabled: config.codeContextEnabled,
					codeContextKeywords: config.codeContextKeywords
						.split(",")
						.map((k) => k.trim())
						.filter(Boolean),
				},
			});
			setNotice("Configuration saved");
		} catch (err) {
			setError(err.message || "Failed to save configuration");
		} finally {
			setSaving(false);
		}
	}

	async function addRule() {
		if (!(newRule.response && newRule.keywords)) {
			setError("Keywords and response are required");
			return;
		}
		try {
			const keywordArray = newRule.keywords
				.split(",")
				.map((k) => k.trim())
				.filter(Boolean);
			const ruleType = activeTab === "global" ? "global" : "smalltalk";
			const rule = await apiRequest("/api/assistant/rules", {
				method: "POST",
				token: true,
				body: {
					type: ruleType,
					source: newRule.source || `${ruleType}_rule_${Date.now()}`,
					keywords: keywordArray,
					response: newRule.response,
				},
			});
			if (rule) {
				setRules((prev) => ({
					...prev,
					[ruleType === "global" ? "globalRules" : "smallTalkRules"]: [
						...(ruleType === "global" ? prev.globalRules : prev.smallTalkRules),
						rule,
					],
				}));
				setNewRule({ source: "", keywords: "", response: "" });
				setShowAddForm(false);
				setNotice("Rule added successfully");
				setTimeout(() => setNotice(""), TIMEOUTS.LONG);
			}
		} catch (err) {
			logger.warn("Failed to add rule:", err);
			setError("Failed to add rule");
		}
	}

	async function deleteRule(ruleId) {
		try {
			const ruleType = activeTab === "global" ? "global" : "smalltalk";
			await apiRequest(`/api/assistant/rules/${ruleType}/${ruleId}`, {
				method: "DELETE",
				token: true,
			});
			setRules((prev) => ({
				...prev,
				[ruleType === "global" ? "globalRules" : "smallTalkRules"]: (ruleType === "global"
					? prev.globalRules
					: prev.smallTalkRules
				).filter((r) => r.id !== ruleId),
			}));
			setNotice("Rule deleted");
			setTimeout(() => setNotice(""), TIMEOUTS.LONG);
		} catch (err) {
			logger.warn("Failed to delete rule:", err);
			setError("Failed to delete rule");
		}
	}

	const currentRules = activeTab === "global" ? rules.globalRules : rules.smallTalkRules;
	const tabs = [
		{ id: "settings", label: "Settings", icon: Settings },
		{ id: "global", label: "Global Rules", icon: Lightbulb },
		{ id: "smalltalk", label: "Small Talk", icon: MessageSquare },
		{ id: "tokens", label: "Support Tokens", icon: KeyRound },
		{ id: "models-admin", label: "Investigation Models", icon: ListChecks },
	];

	return (
		<div class="space-y-6">
			<div
				class={cn(
					"rounded-3xl border p-6",
					adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
				)}
			>
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-400 text-white">
						<Bot class="h-6 w-6" />
					</div>
					<div>
						<h2 class={cn("text-2xl font-semibold", adminDark ? "text-white" : "text-slate-900")}>
							AI Support
						</h2>
						<p class={adminDark ? "text-slate-400" : "text-slate-500"}>
							Investigation models, assistant rules, and buyer-token support
						</p>
					</div>
				</div>
			</div>

			{notice && (
				<div class="flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
					<CheckCircle class="h-5 w-5" />
					{notice}
				</div>
			)}

			{error && (
				<div class="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
					<AlertCircle class="h-5 w-5" />
					{error}
				</div>
			)}

			{/* Tabs */}
			<div
				class={cn(
					"flex gap-2 rounded-2xl border p-1",
					adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50",
				)}
			>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setActiveTab(tab.id)}
						class={cn(
							"flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
							activeTab === tab.id
								? adminDark
									? "bg-indigo-500/20 text-indigo-300"
									: "bg-white text-indigo-600 shadow-sm"
								: adminDark
									? "text-slate-400 hover:text-white"
									: "text-slate-600 hover:text-slate-900",
						)}
					>
						<tab.icon class="h-4 w-4" />
						{tab.label}
					</button>
				))}
			</div>

			{loading ? (
				<Mosaic color="#337ab0" size="large" style={{ fontSize: "40px" }} text="" textColor="" />
			) : activeTab === "settings" ? (
				<div class="space-y-6">
					{/* System Prompt */}
					<div
						class={cn(
							"rounded-3xl border p-6",
							adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
						)}
					>
						<div class="mb-4 flex items-center gap-2">
							<Code2 class="h-5 w-5 text-indigo-400" />
							<h3 class={cn("font-semibold", adminDark ? "text-white" : "text-slate-900")}>
								System Prompt
							</h3>
						</div>
						<p class={cn("mb-4 text-sm", adminDark ? "text-slate-400" : "text-slate-500")}>
							Short instruction that defines AI's role. Sent as "system" message to AI.
						</p>
						<textarea
							value={config.systemPrompt}
							onChange={(e) => setConfig((prev) => ({ ...prev, systemPrompt: e.target.value }))}
							rows={3}
							placeholder="You are a helpful GarTex assistant."
							class={cn(
								"w-full rounded-2xl border px-4 py-3 text-sm outline-none resize-none",
								adminDark
									? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
									: "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
							)}
						/>
					</div>

					{/* Agent Prompt */}
					<div
						class={cn(
							"rounded-3xl border p-6",
							adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
						)}
					>
						<div class="mb-4 flex items-center gap-2">
							<Bot class="h-5 w-5 text-indigo-400" />
							<h3 class={cn("font-semibold", adminDark ? "text-white" : "text-slate-900")}>
								Agent Prompt
							</h3>
						</div>
						<p class={cn("mb-4 text-sm", adminDark ? "text-slate-400" : "text-slate-500")}>
							Full prompt with role description. Appended before knowledge base and user question.
						</p>
						<textarea
							value={config.agentPrompt}
							onChange={(e) => setConfig((prev) => ({ ...prev, agentPrompt: e.target.value }))}
							rows={6}
							placeholder="You are the GarTex Assistant, an expert on the GarTexHub textile marketplace platform..."
							class={cn(
								"w-full rounded-2xl border px-4 py-3 text-sm outline-none resize-none font-mono",
								adminDark
									? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
									: "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
							)}
						/>
					</div>

					{/* Code Context Settings */}
					<div
						class={cn(
							"rounded-3xl border p-6",
							adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
						)}
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<Code2 class="h-5 w-5 text-indigo-400" />
								<h3 class={cn("font-semibold", adminDark ? "text-white" : "text-slate-900")}>
									Code Context Search
								</h3>
							</div>
							<button
								type="button"
								onClick={() =>
									setConfig((prev) => ({
										...prev,
										codeContextEnabled: !prev.codeContextEnabled,
									}))
								}
								class="text-indigo-400"
							>
								{config.codeContextEnabled ? (
									<ToggleRight class="h-6 w-6" />
								) : (
									<ToggleLeft class="h-6 w-6" />
								)}
							</button>
						</div>
						<p class={cn("mb-4 text-sm", adminDark ? "text-slate-400" : "text-slate-500")}>
							When enabled, AI will search your codebase for relevant code snippets when questions
							contain these keywords.
						</p>
						<div>
							<label
								class={cn(
									"mb-1.5 block text-sm font-medium",
									adminDark ? "text-slate-300" : "text-slate-700",
								)}
							>
								Keywords (comma separated)
							</label>
							<input
								type="text"
								value={config.codeContextKeywords}
								onChange={(e) =>
									setConfig((prev) => ({
										...prev,
										codeContextKeywords: e.target.value,
									}))
								}
								placeholder="api, route, server, code, bug, error"
								disabled={!config.codeContextEnabled}
								class={cn(
									"w-full rounded-2xl border px-4 py-2.5 text-sm outline-none",
									adminDark
										? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
										: "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
									!config.codeContextEnabled && "opacity-50",
								)}
							/>
						</div>
					</div>

					{/* Save Button */}
					<button
						type="button"
						onClick={saveConfig}
						disabled={saving}
						class="flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/20 px-6 py-3 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/30 disabled:opacity-50"
					>
						{saving ? (
							<ThreeDot variant="bounce" color="#337ab0" size="small" text="" textColor="" />
						) : (
							<Save class="h-4 w-4" />
						)}
						{saving ? "Saving..." : "Save Settings"}
					</button>
				</div>
			) : activeTab === "tokens" ? (
				<div class="space-y-6">
					<div
						class={cn(
							"rounded-3xl border p-6",
							adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
						)}
					>
						<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
							<div class="flex items-center gap-2">
								<KeyRound class="h-5 w-5 text-indigo-400" />
								<h3 class={cn("font-semibold", adminDark ? "text-white" : "text-slate-900")}>
									Support Tokens
								</h3>
							</div>
							<button
								type="button"
								onClick={fetchTokens}
								disabled={tokensLoading}
								class="flex items-center gap-2 rounded-xl border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:text-white disabled:opacity-50"
							>
								<RefreshCw class={cn("h-3.5 w-3.5", tokensLoading && "animate-spin")} />
								Refresh
							</button>
						</div>
						<p class={cn("mb-4 text-sm", adminDark ? "text-slate-400" : "text-slate-500")}>
							Issue a support token so any account can reach the AI investigation care path. Any
							account role is eligible; the token is shown once, at creation time.
						</p>

						{tokensError && (
							<div class="mb-3 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
								<AlertCircle class="h-4 w-4" />
								{tokensError}
							</div>
						)}
						{tokensNotice && (
							<div class="mb-3 flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
								<CheckCircle class="h-4 w-4" />
								{tokensNotice}
							</div>
						)}

						<form onSubmit={searchBuyers} class="flex gap-2">
							<input
								type="text"
								value={buyerQuery}
								onChange={(event) => setBuyerQuery(event.target.value)}
								placeholder="Search accounts by name or email…"
								aria-label="Search accounts"
								class={cn(
									"flex-1 rounded-2xl border px-4 py-2.5 text-sm outline-none transition-all",
									adminDark
										? "border-white/10 bg-slate-900/70 placeholder:text-slate-500 text-white focus:border-indigo-400"
										: "border-slate-200 bg-white placeholder:text-slate-400 text-slate-900 focus:border-indigo-400",
								)}
							/>
							<button
								type="submit"
								disabled={buyerSearching}
								class="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20 disabled:opacity-50"
							>
								{buyerSearching ? (
									<ThreeDot variant="bounce" color="#6366f1" size="small" text="" textColor="" />
								) : (
									<KeyRound class="h-4 w-4" />
								)}
								Search
							</button>
						</form>

						{buyerResults.length > 0 && (
							<ul
								class={cn(
									"mt-2 divide-y overflow-hidden rounded-2xl border",
									adminDark
										? "divide-white/5 border-white/10 bg-slate-900/40"
										: "divide-slate-100 border-slate-200 bg-slate-50",
								)}
							>
								{buyerResults.map((user) => (
									<li key={user.id}>
										<button
											type="button"
											onClick={() => {
												setPickedBuyer(user);
												setBuyerResults([]);
											}}
											class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-indigo-500/5"
										>
											<span class="min-w-0">
												<span
													class={cn(
														"block truncate text-sm font-medium",
														adminDark ? "text-slate-100" : "text-slate-800",
													)}
												>
													{user.name || user.email}
												</span>
												<span class="block truncate text-xs text-slate-500">{user.email}</span>
											</span>
											<span class="shrink-0 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-300">
												{user.role}
											</span>
										</button>
									</li>
								))}
							</ul>
						)}

						{pickedBuyer && (
							<div
								class={cn(
									"mt-3 flex items-center justify-between gap-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm",
									adminDark ? "text-indigo-200" : "text-indigo-700",
								)}
							>
								<span class="min-w-0 truncate">
									Issuing to: <strong>{pickedBuyer.name || pickedBuyer.email}</strong> (
									{pickedBuyer.email})
								</span>
								<button
									type="button"
									onClick={() => setPickedBuyer(null)}
									class="shrink-0 text-xs text-slate-400 hover:text-white"
								>
									Clear
								</button>
							</div>
						)}

						<div class="mt-4 grid gap-4 sm:grid-cols-2">
							<input
								type="text"
								value={newLabel}
								onChange={(event) => setNewLabel(event.target.value)}
								placeholder="Label — e.g. Acme Corp, Nov issue"
								aria-label="Token label"
								class={cn(
									"rounded-2xl border px-4 py-2.5 text-sm outline-none transition-all",
									adminDark
										? "border-white/10 bg-slate-900/70 placeholder:text-slate-500 text-white focus:border-indigo-400"
										: "border-slate-200 bg-white placeholder:text-slate-400 text-slate-900 focus:border-indigo-400",
								)}
							/>
							<select
								value={newExpiry}
								onChange={(event) => setNewExpiry(event.target.value)}
								aria-label="Token expiry"
								class={cn(
									"rounded-2xl border px-4 py-2.5 text-sm outline-none transition-all",
									adminDark
										? "border-white/10 bg-slate-900/70 text-white focus:border-indigo-400"
										: "border-slate-200 bg-white text-slate-900 focus:border-indigo-400",
								)}
							>
								<option value="never">Never expires</option>
								<option value="30d">Expires in 30 days</option>
								<option value="90d">Expires in 90 days</option>
								<option value="custom">Custom date…</option>
							</select>
						</div>
						{newExpiry === "custom" && (
							<div class="mt-3">
								<input
									type="date"
									value={customDate}
									onChange={(event) => setCustomDate(event.target.value)}
									aria-label="Custom expiry date"
									class={cn(
										"rounded-2xl border px-4 py-2.5 text-sm outline-none transition-all",
										adminDark
											? "border-white/10 bg-slate-900/70 text-white focus:border-indigo-400"
											: "border-slate-200 bg-white text-slate-900 focus:border-indigo-400",
									)}
								/>
							</div>
						)}
						<button
							type="button"
							onClick={issueToken}
							disabled={issuedBusy || !pickedBuyer || !newLabel.trim()}
							class="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{issuedBusy ? (
								<ThreeDot variant="bounce" color="#6366f1" size="small" text="" textColor="" />
							) : (
								<KeyRound class="h-4 w-4" />
							)}
							{issuedBusy ? "Issuing…" : "Issue token"}
						</button>
					</div>

					{/* The token is shown exactly once, right after issue. */}
					{issuedToken && (
						<div
							class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
							role="dialog"
							aria-modal="true"
							aria-label="Support token issued"
						>
							<div
								class={cn(
									"w-full max-w-lg rounded-3xl border p-6",
									adminDark
										? "border-white/10 bg-slate-900 text-white"
										: "border-slate-200 bg-white text-slate-900",
								)}
							>
								<h3 class="text-lg font-semibold">Token issued</h3>
								<p class="mt-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
									This token will not be shown again. Store it somewhere safe.
								</p>
								<div class="mt-4 flex items-stretch gap-2">
									<code
										class={cn(
											"flex-1 select-all break-all rounded-2xl border px-4 py-3 font-mono text-xs leading-5",
											adminDark
												? "border-white/10 bg-slate-950 text-emerald-300"
												: "border-slate-200 bg-slate-50 text-emerald-700",
										)}
									>
										{issuedToken.token}
									</code>
									<button
										type="button"
										onClick={copyIssuedToken}
										class="flex items-center gap-1.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20"
									>
										{tokenCopied ? <Check class="h-4 w-4" /> : <Copy class="h-4 w-4" />}
										{tokenCopied ? "Copied" : "Copy"}
									</button>
								</div>
								<div class="mt-4 flex justify-end">
									<button
										type="button"
										onClick={() => setIssuedToken(null)}
										class="rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-400 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
									>
										Done
									</button>
								</div>
							</div>
						</div>
					)}

					<div
						class={cn(
							"overflow-x-auto rounded-3xl border",
							adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
						)}
					>
						<div class="border-b border-slate-200/10 px-6 py-4">
							<h3 class={cn("font-semibold", adminDark ? "text-white" : "text-slate-900")}>
								Issued tokens ({tokens.length})
							</h3>
						</div>
						{tokensLoading ? (
							<div class="flex justify-center px-6 py-12">
								<Mosaic
									color="#6366f1"
									size="large"
									style={{ fontSize: "40px" }}
									text=""
									textColor=""
								/>
							</div>
						) : tokens.length === 0 ? (
							<div class="px-6 py-12 text-center">
								<KeyRound
									class={cn(
										"mx-auto h-12 w-12 mb-4",
										adminDark ? "text-slate-600" : "text-slate-300",
									)}
								/>
								<p class={adminDark ? "text-slate-400" : "text-slate-500"}>No tokens issued yet</p>
							</div>
						) : (
							<table class="min-w-full text-sm">
								<thead>
									<tr class={cn("text-left", adminDark ? "text-slate-400" : "text-slate-500")}>
										<th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
											Account
										</th>
										<th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Label</th>
										<th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
											Created
										</th>
										<th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
											Last used
										</th>
										<th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Expiry</th>
										<th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
										<th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider" />
									</tr>
								</thead>
								<tbody class={cn("divide-y", adminDark ? "divide-white/5" : "divide-slate-100")}>
									{tokens.map((row) => {
										const revoked = Boolean(row.revoked_at);
										const expired = row.expires_at
											? new Date(row.expires_at).getTime() <= Date.now()
											: false;
										const status = revoked ? "Revoked" : expired ? "Expired" : "Active";
										const statusClass = revoked
											? "border-rose-500/30 bg-rose-500/10 text-rose-400"
											: expired
												? "border-amber-500/30 bg-amber-500/10 text-amber-400"
												: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
										return (
											<tr key={row.id}>
												<td class="px-6 py-3">
													<span
														class={cn(
															"block font-medium",
															adminDark ? "text-slate-100" : "text-slate-800",
														)}
													>
														{row.buyer?.name || row.buyer?.email || row.buyer_id}
													</span>
													<span class="block text-xs text-slate-500">{row.buyer?.email}</span>
												</td>
												<td class="px-6 py-3">{row.label}</td>
												<td class="px-6 py-3 whitespace-nowrap">
													{formatTokenDate(row.created_at)}
												</td>
												<td class="px-6 py-3 whitespace-nowrap">
													{row.last_used_at ? formatTokenDate(row.last_used_at) : "—"}
												</td>
												<td class="px-6 py-3 whitespace-nowrap">
													{row.expires_at ? formatTokenDate(row.expires_at) : "Never"}
												</td>
												<td class="px-6 py-3">
													<span
														class={cn(
															"inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
															statusClass,
														)}
													>
														{status}
													</span>
												</td>
												<td class="px-6 py-3 text-right">
													{!revoked && (
														<button
															type="button"
															onClick={() => revokeToken(row.id)}
															class="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 transition-all hover:bg-rose-500/20"
														>
															<Trash2 class="h-3.5 w-3.5" />
															Revoke
														</button>
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)}
					</div>
				</div>
			) : activeTab === "models-admin" ? (
				<div class="space-y-6">
					<div
						class={cn(
							"rounded-3xl border p-6",
							adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
						)}
					>
						<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
							<div class="flex flex-wrap items-center gap-2">
								<ListChecks class="h-5 w-5 text-indigo-400" />
								<h3 class={cn("font-semibold", adminDark ? "text-white" : "text-slate-900")}>
									Investigation Models
								</h3>
								{modelsAdmin?.catalogStale && (
									<span class="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-0.5 text-xs text-yellow-300">
										stale catalog
									</span>
								)}
							</div>
							<button
								type="button"
								onClick={() => fetchModelsAdmin(true)}
								disabled={modelsAdminLoading}
								class="flex items-center gap-2 rounded-xl border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:text-white disabled:opacity-50"
							>
								<RefreshCw class={cn("h-3.5 w-3.5", modelsAdminLoading && "animate-spin")} />
								Refresh
							</button>
						</div>
						<p class={cn("mb-4 text-sm", adminDark ? "text-slate-400" : "text-slate-500")}>
							Owner-controlled. Free OpenCode models only.
						</p>

						{modelsAdminError && (
							<div class="mb-3 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
								<AlertCircle class="h-4 w-4" />
								{modelsAdminError}
							</div>
						)}
						{modelsAdminNotice && (
							<div class="mb-3 flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
								<CheckCircle class="h-4 w-4" />
								{modelsAdminNotice}
							</div>
						)}

						<div class="space-y-2">
							{(modelsAdmin?.catalog ?? []).length === 0 && !modelsAdminLoading ? (
								<p class={cn("text-sm", adminDark ? "text-slate-500" : "text-slate-400")}>
									The live catalog is unavailable — the persisted allowlist is kept as-is.
								</p>
							) : null}
							{(modelsAdmin?.catalog ?? []).map((model) => (
								<label
									key={model.id}
									class={cn(
										"flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-all",
										adminDark
											? "border-white/10 hover:border-white/20"
											: "border-slate-200 hover:border-slate-300",
									)}
								>
									<input
										type="checkbox"
										checked={modelsAdmin?.allowed.includes(model.id) ?? false}
										onChange={() => toggleAllowedModel(model.id)}
										disabled={modelsAdminSaving}
										class="h-4 w-4 accent-indigo-500"
										aria-label={`Allow ${model.id}`}
									/>
									<span
										class={cn(
											"min-w-0 flex-1 font-mono text-sm",
											adminDark ? "text-slate-100" : "text-slate-800",
										)}
									>
										{model.id}
									</span>
									<span class={cn("text-xs", adminDark ? "text-slate-500" : "text-slate-400")}>
										{model.ownedBy ?? model.providerID}
									</span>
								</label>
							))}
						</div>

						{/* Allowed but not in the catalog (e.g. catalog down) — shown so the
						    allowlist is never silently truncated. */}
						{(modelsAdmin?.allowed ?? [])
							.filter((id) => !(modelsAdmin?.catalog ?? []).some((m) => m.id === id))
							.map((id) => (
								<div
									key={id}
									class={cn(
										"mt-2 flex items-center gap-3 rounded-2xl border border-dashed px-4 py-3 text-xs",
										adminDark
											? "border-white/15 text-slate-400"
											: "border-slate-300 text-slate-500",
									)}
								>
									<span class="font-mono">{id}</span>
									<span class="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-yellow-300">
										persisted
									</span>
								</div>
							))}

						<div class="mt-4 grid gap-4 sm:grid-cols-2">
							<div>
								<label
									class={cn(
										"mb-1.5 block text-sm font-medium",
										adminDark ? "text-slate-300" : "text-slate-700",
									)}
									for="investigation-default-model"
								>
									Default model
								</label>
								<select
									id="investigation-default-model"
									value={modelsAdmin?.default ?? ""}
									onChange={(event) =>
										setModelsAdmin((prev) =>
											prev ? { ...prev, default: event.target.value } : prev,
										)
									}
									disabled={modelsAdminSaving || (modelsAdmin?.allowed.length ?? 0) === 0}
									aria-label="Default model"
									class={cn(
										"w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition-all",
										adminDark
											? "border-white/10 bg-slate-900/70 text-white focus:border-indigo-400"
											: "border-slate-200 bg-white text-slate-900 focus:border-indigo-400",
									)}
								>
									{(modelsAdmin?.allowed ?? []).map((id) => (
										<option key={id} value={id}>
											{id}
										</option>
									))}
								</select>
							</div>

							<div class="flex items-end">
								<div
									class={cn(
										"flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3",
										adminDark ? "border-white/10" : "border-slate-200",
									)}
								>
									<div class="min-w-0">
										<p
											class={cn(
												"text-sm font-medium",
												adminDark ? "text-slate-200" : "text-slate-700",
											)}
										>
											Buyers can change model per message
										</p>
										<p class={cn("text-xs", adminDark ? "text-slate-500" : "text-slate-400")}>
											Exposes the picker in the buyer's composer
										</p>
									</div>
									<button
										type="button"
										onClick={() =>
											setModelsAdmin((prev) =>
												prev ? { ...prev, buyerSelectEnabled: !prev.buyerSelectEnabled } : prev,
											)
										}
										disabled={modelsAdminSaving}
										aria-label="Buyers can change model per message"
										aria-pressed={modelsAdmin?.buyerSelectEnabled ?? true}
										class="shrink-0 text-indigo-400 disabled:opacity-50"
									>
										{(modelsAdmin?.buyerSelectEnabled ?? true) ? (
											<ToggleRight class="h-7 w-7" />
										) : (
											<ToggleLeft class="h-7 w-7" />
										)}
									</button>
								</div>
							</div>
						</div>

						<div class="mt-4 flex flex-wrap items-center justify-between gap-3">
							<p class={cn("text-xs", adminDark ? "text-slate-500" : "text-slate-400")}>
								iceman-free is permanently excluded (trains on prompts).
							</p>
							<button
								type="button"
								onClick={saveModelsAdmin}
								disabled={modelsAdminSaving || !modelsAdmin}
								class="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{modelsAdminSaving ? (
									<ThreeDot variant="bounce" color="#6366f1" size="small" text="" textColor="" />
								) : (
									<Save class="h-4 w-4" />
								)}
								{modelsAdminSaving ? "Saving…" : "Save"}
							</button>
						</div>
					</div>
				</div>
			) : (
				<div class="space-y-4">
					{/* Rules List */}
					<div
						class={cn(
							"rounded-3xl border",
							adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
						)}
					>
						<div class="border-b border-slate-200/10 px-6 py-4">
							<div class="flex items-center justify-between">
								<h3 class={cn("font-semibold", adminDark ? "text-white" : "text-slate-900")}>
									{activeTab === "global" ? "Global Rules" : "Small Talk Rules"} (
									{currentRules.length})
								</h3>
								<button
									type="button"
									onClick={() => setShowAddForm(!showAddForm)}
									class="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20"
								>
									<Plus class="h-4 w-4" />
									Add Rule
								</button>
							</div>
						</div>

						{currentRules.length === 0 ? (
							<div class="px-6 py-12 text-center">
								<Bot
									class={cn(
										"mx-auto h-12 w-12 mb-4",
										adminDark ? "text-slate-600" : "text-slate-300",
									)}
								/>
								<p class={adminDark ? "text-slate-400" : "text-slate-500"}>
									No rules configured yet
								</p>
							</div>
						) : (
							<div class="divide-y divide-slate-200/10">
								{currentRules.map((rule) => (
									<div key={rule.id} class="px-6 py-4 hover:bg-white/5">
										<div class="flex items-start justify-between gap-4">
											<div class="min-w-0 flex-1">
												<div class="flex items-center gap-2 flex-wrap">
													<span
														class={cn(
															"text-sm font-medium",
															adminDark ? "text-white" : "text-slate-900",
														)}
													>
														{rule.source}
													</span>
												</div>
												<div class="mt-2 flex items-center gap-2 flex-wrap">
													{rule.keywords?.map((kw, idx) => (
														<span
															key={idx}
															class={cn(
																"rounded-full border px-2 py-0.5 text-xs",
																adminDark
																	? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
																	: "border-indigo-200 bg-indigo-50 text-indigo-600",
															)}
														>
															{kw}
														</span>
													))}
												</div>
												<p
													class={cn(
														"mt-2 text-sm",
														adminDark ? "text-slate-300" : "text-slate-600",
													)}
												>
													{rule.response}
												</p>
											</div>
											<button
												type="button"
												onClick={() => deleteRule(rule.id)}
												class="shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20"
											>
												<Trash2 class="h-4 w-4" />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Add Rule Form */}
					{showAddForm && (
						<div
							class={cn(
								"rounded-3xl border p-6",
								adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white",
							)}
						>
							<h3 class={cn("mb-4 font-semibold", adminDark ? "text-white" : "text-slate-900")}>
								Add New Rule
							</h3>
							<div class="space-y-4">
								<div>
									<label
										class={cn(
											"mb-1.5 block text-sm font-medium",
											adminDark ? "text-slate-300" : "text-slate-700",
										)}
									>
										Source (optional)
									</label>
									<input
										type="text"
										value={newRule.source}
										onChange={(e) =>
											setNewRule((prev) => ({
												...prev,
												source: e.target.value,
											}))
										}
										placeholder="e.g., custom_rule_name"
										class={cn(
											"w-full rounded-2xl border px-4 py-2.5 text-sm outline-none",
											adminDark
												? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
												: "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
										)}
									/>
								</div>
								<div>
									<label
										class={cn(
											"mb-1.5 block text-sm font-medium",
											adminDark ? "text-slate-300" : "text-slate-700",
										)}
									>
										Keywords (comma separated)
									</label>
									<input
										type="text"
										value={newRule.keywords}
										onChange={(e) =>
											setNewRule((prev) => ({
												...prev,
												keywords: e.target.value,
											}))
										}
										placeholder="e.g., setup, onboarding, profile"
										class={cn(
											"w-full rounded-2xl border px-4 py-2.5 text-sm outline-none",
											adminDark
												? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
												: "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
										)}
									/>
								</div>
								<div>
									<label
										class={cn(
											"mb-1.5 block text-sm font-medium",
											adminDark ? "text-slate-300" : "text-slate-700",
										)}
									>
										Response
									</label>
									<textarea
										value={newRule.response}
										onChange={(e) =>
											setNewRule((prev) => ({
												...prev,
												response: e.target.value,
											}))
										}
										rows={3}
										placeholder="The response the AI should give when keywords match"
										class={cn(
											"w-full rounded-2xl border px-4 py-2.5 text-sm outline-none resize-none",
											adminDark
												? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
												: "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500",
										)}
									/>
								</div>
								<div class="flex gap-2">
									<button
										type="button"
										onClick={addRule}
										class="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/20"
									>
										<Plus class="h-4 w-4" />
										Add Rule
									</button>
									<button
										type="button"
										onClick={() => {
											setShowAddForm(false);
											setNewRule({ source: "", keywords: "", response: "" });
										}}
										class={cn(
											"rounded-xl border px-4 py-2 text-sm font-medium transition-all",
											adminDark
												? "border-slate-700 text-slate-400 hover:text-white"
												: "border-slate-200 text-slate-600 hover:text-slate-900",
										)}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default AdminAISection;
