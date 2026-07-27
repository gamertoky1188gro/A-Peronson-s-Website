/*
  Route: /support
  Access: Protected (login required)

  Purpose:
    - Collect bug reports, feature requests, account issues, and general feedback.
    - Store submissions in the reports queue for admin review.
*/

import {
	AlertTriangle,
	ArrowLeft,
	Bug,
	Check,
	CheckCircle,
	ChevronDown,
	ClipboardList,
	Crown,
	FileText,
	Globe,
	Mail,
	MessageSquare,
	Moon,
	RefreshCw,
	Shield,
	Sparkles,
	Sun,
	Ticket,
	Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Mosaic, ThreeDot } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal.jsx";
import NeonAtom from "../components/ui/NeonAtom.jsx";
import UploadProgressBar from "../components/ui/UploadProgressBar.jsx";
import { usePremiumCheck } from "../hooks/useSecureUser.js";
import { apiRequest, getCurrentUser, getToken, hasEntitlement } from "../lib/auth.js";
import { logger } from "../lib/logger.js";
import { useTheme } from "../lib/ThemeProvider.jsx";
import { uploadFile } from "../lib/upload.js";

const FALLBACK_CATEGORIES = [
	"Bug Report",
	"Feature Request",
	"Account Problem",
	"Payment / Verification Issue",
	"Report a User",
	"Content Report",
	"General Feedback",
	"Other",
];

const FALLBACK_PRIORITIES = ["Low", "Medium", "High", "Urgent"];

export default function SupportReports() {
	const token = useMemo(() => getToken(), []);
	const navigate = useNavigate();
	const sessionUser = getCurrentUser();
	const { isPremium, loading: premiumLoading } = usePremiumCheck();

	const canPrioritySupport = isPremium || hasEntitlement(sessionUser, "dedicated_support");
	const canDedicatedManager = isPremium || hasEntitlement(sessionUser, "dedicated_account_manager");
	const accountManager = sessionUser?.profile || {};
	const hasAccountManager = Boolean(
		accountManager.account_manager_name ||
			accountManager.account_manager_email ||
			accountManager.account_manager_phone,
	);

	const { theme: currentTheme, toggleTheme } = useTheme();
	const darkMode = currentTheme === "dark";
	const [subject, setSubject] = useState("");
	const [category, setCategory] = useState("Bug Report");
	const [description, setDescription] = useState("");
	const [pageUrl, setPageUrl] = useState("");
	const [priority, setPriority] = useState("Medium");
	const [contactEmail, setContactEmail] = useState("");
	const [attachment, setAttachment] = useState(null);
	const [attachmentUploadProgress, setAttachmentUploadProgress] = useState(0);
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState("");
	const [reportId, setReportId] = useState("");
	const [tickets, setTickets] = useState([]);
	const [ticketsLoading, setTicketsLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);
	const [categoryOptions, setCategoryOptions] = useState(FALLBACK_CATEGORIES);
	const [priorityOptions, setPriorityOptions] = useState(FALLBACK_PRIORITIES);

	const theme = useMemo(
		() => (darkMode ? "bg-slate-950 text-white" : "bg-sky-50 text-slate-900"),
		[darkMode],
	);

	const cardTheme = useMemo(
		() =>
			darkMode
				? "bg-white/5 border-white/10 shadow-[0_20px_80px_rgba(2,132,199,0.18)]"
				: "bg-white border-slate-200 shadow-[0_20px_60px_rgba(14,165,233,0.10)]",
		[darkMode],
	);

	const inputTheme = useMemo(
		() =>
			darkMode
				? "bg-slate-900/70 border-white/10 placeholder:text-slate-400 text-white focus:border-sky-400 focus:ring-sky-400/20"
				: "bg-white border-slate-200 placeholder:text-slate-400 text-slate-900 focus:border-sky-500 focus:ring-sky-500/20",
		[darkMode],
	);

	const loadTickets = useCallback(async () => {
		if (!token) {
			return;
		}
		setTicketsLoading(true);
		try {
			const data = await apiRequest("/support/tickets", { token });
			setTickets(Array.isArray(data?.items) ? data.items : []);
		} catch (err) {
			logger.warn("Failed to load tickets:", err);
			setTickets([]);
		} finally {
			setTicketsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadTickets();
	}, [loadTickets]);

	useEffect(() => {
		if (pageLoading && !ticketsLoading && !premiumLoading) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setPageLoading(false);
		}
	}, [pageLoading, ticketsLoading, premiumLoading]);

	useEffect(() => {
		if (!token) {
			return;
		}
		apiRequest("/support/categories", { token })
			.then((data) => {
				if (Array.isArray(data?.categories)) {
					setCategoryOptions(data.categories);
					if (!data.categories.includes(category)) {
						setCategory(data.categories[0] || "");
					}
				}
				if (Array.isArray(data?.priorities)) {
					setPriorityOptions(data.priorities);
					if (!data.priorities.includes(priority)) {
						setPriority(data.priorities[0] || "Medium");
					}
				}
			})
			.catch((err) => logger.warn("Failed to load support options:", err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, priority, category]);

	async function submitReport(e) {
		e.preventDefault();
		if (!token) {
			setFeedback("Please login again to submit a report.");
			return;
		}
		setLoading(true);
		setFeedback("");
		setReportId("");
		try {
			const report = await apiRequest("/support/tickets", {
				method: "POST",
				token,
				body: {
					subject,
					category,
					description,
					page_url: pageUrl,
					...(canPrioritySupport ? { priority } : {}),
					contact_email: contactEmail,
				},
			});

			const ticketId = report?.ticket?.id || report?.id;
			if (attachment && ticketId) {
				setAttachmentUploadProgress(0);
				await uploadFile("/documents", {
					file: attachment,
					token,
					fields: {
						entity_type: "support_ticket",
						entity_id: ticketId,
						type: "screenshot",
					},
					onProgress: setAttachmentUploadProgress,
				});
			}

			setReportId(ticketId || "");
			setFeedback("Ticket submitted successfully.");
			setSubject("");
			setDescription("");
			setPageUrl("");
			setPriority("Medium");
			setContactEmail("");
			setAttachment(null);
			await loadTickets();
		} catch (err) {
			setFeedback(err.message || "Unable to submit report");
		} finally {
			setLoading(false);
		}
	}

	const getPriorityColor = (p) => {
		if (p === "Urgent") {
			return "bg-rose-500/15 text-rose-300";
		}
		if (p === "High") {
			return "bg-orange-500/15 text-orange-300";
		}
		if (p === "Medium") {
			return "bg-amber-500/15 text-amber-300";
		}
		return "bg-emerald-500/15 text-emerald-300";
	};

	if (pageLoading) {
		return <NeonAtom fill={true} />;
	}

	return (
		<div className={`min-h-screen ${theme} transition-colors duration-300`}>
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
				<div className="absolute top-40 right-[-6rem] h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
				<div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<header className={`mb-6 overflow-hidden rounded-[28px] border ${cardTheme} backdrop-blur-xl`}>
					<div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
						<div className="max-w-3xl">
							<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-300">
								<Sparkles className="h-4 w-4" />
								Premium support center
							</div>

							<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
								Support &amp; Reports
							</h1>
							<p
								className={`mt-4 max-w-2xl text-sm leading-6 sm:text-base ${darkMode ? "text-slate-300" : "text-slate-600"}`}
							>
								Report bugs, request features, or share any issue. We collect everything in one
								place so it can be tracked and resolved.
							</p>

							{canDedicatedManager && hasAccountManager ? (
								<div
									className={`mt-4 rounded-2xl border p-4 ${darkMode ? "border-amber-400/20 bg-amber-500/10" : "border-amber-200 bg-amber-50"}`}
								>
									<div className="flex items-start gap-3">
										<Crown
											className={`mt-0.5 h-5 w-5 ${darkMode ? "text-amber-300" : "text-amber-600"}`}
										/>
										<div>
											<p className="font-semibold">Dedicated Account Manager</p>
											<p
												className={`mt-1 text-sm leading-6 ${darkMode ? "text-amber-100/80" : "text-amber-900/70"}`}
											>
												{accountManager.account_manager_name || "Support manager"} —{" "}
												{accountManager.account_manager_email || ""} —{" "}
												{accountManager.account_manager_phone || ""}
											</p>
										</div>
									</div>
								</div>
							) : null}
						</div>

						<div className="flex flex-wrap items-center gap-3">
							<button
								type="button"
								onClick={toggleTheme}
								className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition hover:scale-[1.01] active:scale-[0.99] ${
									darkMode
										? "border-white/10 bg-white/5 text-white hover:bg-white/10"
										: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
								}`}
							>
								{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
								{darkMode ? "Light mode" : "Dark mode"}
							</button>

							<button
								type="button"
								onClick={() => navigate(-1)}
								className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5"
							>
								<ArrowLeft className="h-4 w-4" />
								Back
							</button>
						</div>
					</div>
				</header>

				{feedback && (
					<div
						className={`mb-6 rounded-2xl border px-4 py-3 ${
							feedback.includes("success")
								? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
								: "border-rose-400/20 bg-rose-500/10 text-rose-300"
						}`}
					>
						{feedback}
					</div>
				)}

				<main className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
					<ScrollReveal as="section">
						<section className={`rounded-[28px] border ${cardTheme} p-5 backdrop-blur-xl sm:p-6`}>
							<div className="mb-6 flex items-center justify-between gap-4">
								<div>
									<h2 className="text-2xl font-semibold tracking-tight">Submit a report</h2>
									<p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
										Every report gets organized, prioritized, and tracked.
									</p>
								</div>
								<div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-3 text-sky-300">
									<Shield className="h-5 w-5" />
								</div>
							</div>

							<form onSubmit={submitReport} className="space-y-5">
								<div className="grid gap-5 md:grid-cols-2">
									<label className="block">
										<span
											className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
										>
											Subject
										</span>
										<input
											value={subject}
											onChange={(e) => setSubject(e.target.value)}
											placeholder="Short summary of the issue"
											className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${inputTheme}`}
											required={true}
										/>
									</label>

									<label className="block">
										<span
											className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
										>
											Category
										</span>
										<div className="relative">
											<select
												value={category}
												onChange={(e) => setCategory(e.target.value)}
												className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-11 text-sm outline-none transition ${inputTheme}`}
											>
												{categoryOptions.map((item) => (
													<option key={item} value={item}>
														{item}
													</option>
												))}
											</select>
											<ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
										</div>
									</label>
								</div>

								<div className="grid gap-5 md:grid-cols-2">
									<div>
										<span
											className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
										>
											Priority
										</span>
										<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
											{priorityOptions.map((item) => (
												<button
													key={item}
													type="button"
													onClick={() => canPrioritySupport && setPriority(item)}
													disabled={!canPrioritySupport}
													className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
														priority === item
															? "border-sky-400 bg-sky-500/15 text-sky-300 shadow-lg shadow-sky-500/10"
															: canPrioritySupport
																? darkMode
																	? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
																	: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
																: "border-white/5 bg-white/5 text-slate-600 cursor-not-allowed opacity-50"
													}`}
												>
													{item}
												</button>
											))}
										</div>
										{!canPrioritySupport && (
											<p className="mt-2 text-xs text-slate-500">
												Upgrade to Premium for priority support
											</p>
										)}
									</div>

									<div
										className={`rounded-2xl border p-4 ${darkMode ? "border-amber-400/20 bg-amber-500/10" : "border-amber-200 bg-amber-50"}`}
									>
										<div className="flex items-start gap-3">
											<Crown
												className={`mt-0.5 h-5 w-5 ${darkMode ? "text-amber-300" : "text-amber-600"}`}
											/>
											<div>
												<p className="font-semibold">Premium Priority</p>
												<p
													className={`mt-1 text-sm leading-6 ${darkMode ? "text-amber-100/80" : "text-amber-900/70"}`}
												>
													{canPrioritySupport
														? "Your high-tier requests are highlighted for faster review."
														: "Upgrade to Premium for priority support and faster escalation."}
												</p>
											</div>
										</div>
									</div>
								</div>

								<label className="block">
									<span
										className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
									>
										Description
									</span>
									<textarea
										rows={6}
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Write the full details here"
										className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${inputTheme}`}
										required={true}
									/>
								</label>

								<div className="grid gap-5 md:grid-cols-2">
									<label className="block">
										<span
											className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
										>
											Page URL{" "}
											<span className={darkMode ? "text-slate-500" : "text-slate-400"}>(optional)</span>
										</span>
										<div className="relative">
											<Globe className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
											<input
												value={pageUrl}
												onChange={(e) => setPageUrl(e.target.value)}
												placeholder="https://..."
												className={`w-full rounded-2xl border px-10 py-3 text-sm outline-none transition ${inputTheme}`}
											/>
										</div>
									</label>

									<label className="block">
										<span
											className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}
										>
											Contact Email{" "}
											<span className={darkMode ? "text-slate-500" : "text-slate-400"}>(optional)</span>
										</span>
										<div className="relative">
											<Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
											<input
												value={contactEmail}
												onChange={(e) => setContactEmail(e.target.value)}
												placeholder="you@example.com"
												className={`w-full rounded-2xl border px-10 py-3 text-sm outline-none transition ${inputTheme}`}
											/>
										</div>
									</label>
								</div>

								<div
									className={`rounded-[24px] border border-dashed p-5 ${darkMode ? "border-white/10 bg-slate-900/30" : "border-slate-200 bg-slate-50"}`}
								>
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-start gap-3">
											<Upload
												className={`mt-0.5 h-5 w-5 ${darkMode ? "text-sky-300" : "text-sky-600"}`}
											/>
											<div>
												<p className="font-medium">
													Screenshot / File{" "}
													<span className={darkMode ? "text-slate-500" : "text-slate-400"}>
														(optional)
													</span>
												</p>
												<p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
													{attachment ? attachment.name : "No file chosen"}
												</p>
											</div>
										</div>

										<label
											className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition hover:scale-[1.01] active:scale-[0.99] ${darkMode ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
										>
											<input
												type="file"
												className="hidden"
												onChange={(e) => setAttachment(e.target.files?.[0] || null)}
											/>
											<FileText className="h-4 w-4" />
											{attachment ? "Change" : "Choose file"}
										</label>
										{attachmentUploadProgress > 0 && (
											<UploadProgressBar progress={attachmentUploadProgress} className="mt-2" />
										)}
									</div>
								</div>

								{reportId && (
									<div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
										<p className="font-semibold text-emerald-300">Ticket Submitted!</p>
										<p className="text-sm text-emerald-200/80">Your ticket ID: {reportId}</p>
									</div>
								)}

								<button
									type="submit"
									disabled={loading}
									className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
								>
									{loading ? (
										<ThreeDot variant="bounce" color="#6100ff" size="small" text="" textColor="" />
									) : (
										<Check className="h-4 w-4" />
									)}
									Submit Report
								</button>
							</form>
						</section>
					</ScrollReveal>

					<aside className="space-y-6">
						<ScrollReveal as="section">
							<section className={`rounded-[28px] border ${cardTheme} p-5 backdrop-blur-xl sm:p-6`}>
								<div className="mb-5 flex items-center justify-between">
									<div>
										<h3 className="text-xl font-semibold">My Support Tickets</h3>
										<p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
											Refresh and track your recent submissions.
										</p>
									</div>
									<button
										type="button"
										onClick={loadTickets}
										disabled={ticketsLoading}
										className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
											darkMode
												? "border-white/10 bg-white/5 text-white hover:bg-white/10"
												: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
										}`}
									>
										{ticketsLoading ? (
											<ThreeDot
												variant="bounce"
												color="#6100ff"
												size="small"
												text=""
												textColor=""
											/>
										) : (
											<RefreshCw className="h-4 w-4" />
										)}
										Refresh
									</button>
								</div>

								{ticketsLoading ? (
									<Mosaic
										color="#3b00ff"
										size="large"
										style={{ fontSize: "40px" }}
										text=""
										textColor=""
									/>
								) : tickets.length === 0 ? (
									<div
										className={`rounded-[24px] border border-dashed p-8 text-center ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}
									>
										<Ticket
											className={`mx-auto h-10 w-10 ${darkMode ? "text-sky-300" : "text-sky-600"}`}
										/>
										<p className="mt-4 text-lg font-semibold">No tickets yet.</p>
										<p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
											Submit a report to create your first support ticket.
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{tickets.map((ticket) => (
											<article
												key={ticket.id}
												className={`rounded-[24px] border p-4 transition hover:-translate-y-0.5 ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
											>
												<div className="flex items-start justify-between gap-4">
													<div>
														<div className="flex flex-wrap items-center gap-2">
															<span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-semibold text-sky-300">
																{ticket.id}
															</span>
															<span
																className={`rounded-full px-2.5 py-1 text-xs font-semibold ${darkMode ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-600"}`}
															>
																{ticket.status || "Open"}
															</span>
														</div>
														<h4 className="mt-3 font-semibold">{ticket.subject}</h4>
														<p
															className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
														>
															{ticket.category}
														</p>
													</div>
													{ticket.priority && (
														<span
															className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(ticket.priority)}`}
														>
															{ticket.priority}
														</span>
													)}
												</div>
												<p className={`mt-4 text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
													{ticket.created_at ? new Date(ticket.created_at).toLocaleString() : ""}
												</p>
											</article>
										))}
									</div>
								)}
							</section>
						</ScrollReveal>

						<ScrollReveal as="section">
							<section className={`rounded-[28px] border ${cardTheme} p-5 backdrop-blur-xl sm:p-6`}>
								<h3 className="text-xl font-semibold">What happens next</h3>
								<div className="mt-5 space-y-4">
									{(() => {
										const statusCounts = tickets.reduce((acc, t) => {
											const s = t.status || "open";
											acc[s] = (acc[s] || 0) + 1;
											return acc;
										}, {});
										const steps = [
											{
												icon: ClipboardList,
												title: "Collected",
												text: `Your report is grouped with the right category and priority.${tickets.length > 0 ? ` You have ${tickets.length} ticket${tickets.length > 1 ? "s" : ""} in the system.` : ""}`,
											},
											{
												icon: Bug,
												title: "Reviewed",
												text: `The issue is checked for clarity, impact, and reproducibility.${statusCounts.in_review ? ` ${statusCounts.in_review} currently in review.` : ""}`,
											},
											{
												icon: MessageSquare,
												title: "Responded",
												text: `A team member can follow up if more details are needed.${statusCounts.awaiting_response ? ` ${statusCounts.awaiting_response} awaiting your response.` : ""}`,
											},
											{
												icon: CheckCircle,
												title: "Resolved",
												text: `Completed items are tracked until the case is closed.${statusCounts.resolved || statusCounts.closed ? ` ${statusCounts.resolved || statusCounts.closed} resolved.` : ""}`,
											},
										];
										return steps.map((item, index) => {
											const LucideIcon = item.icon;
											return (
												<div key={item.title} className="flex gap-4">
													<div className="flex flex-col items-center">
														<div
															className={`flex h-11 w-11 items-center justify-center rounded-2xl ${darkMode ? "bg-white/5 text-sky-300" : "bg-sky-50 text-sky-600"}`}
														>
															<LucideIcon className="h-5 w-5" />
														</div>
														{index < 3 && (
															<div
																className={`mt-2 h-full w-px flex-1 ${darkMode ? "bg-white/10" : "bg-slate-200"}`}
															/>
														)}
													</div>
													<div className="pb-3">
														<p className="font-semibold">{item.title}</p>
														<p
															className={`mt-1 text-sm leading-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
														>
															{item.text}
														</p>
													</div>
												</div>
											);
										});
									})()}
								</div>
							</section>
						</ScrollReveal>

						<ScrollReveal as="section">
							<section className={`rounded-[28px] border ${cardTheme} p-5 backdrop-blur-xl sm:p-6`}>
								<div className="flex items-start gap-3">
									<AlertTriangle
										className={`mt-0.5 h-5 w-5 ${darkMode ? "text-sky-300" : "text-sky-600"}`}
									/>
									<div>
										<h3 className="font-semibold">Best practice</h3>
										<p
											className={`mt-1 text-sm leading-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
										>
											Include steps to reproduce, screenshots, page URL, and any visible error text
											for faster resolution.
										</p>
									</div>
								</div>
							</section>
						</ScrollReveal>
					</aside>
				</main>
			</div>
		</div>
	);
}
