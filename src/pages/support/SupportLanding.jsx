import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	FileText,
	LifeBuoy,
	MessageCircle,
	SearchCode,
	Send,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "../../components/support/GlassCard.jsx";
import { apiRequest, getToken } from "../../lib/auth.js";
import { clearSupportSession, setSupportSession } from "../../lib/supportToken.js";

const FEATURES = [
	{
		icon: MessageCircle,
		title: "Talk naturally",
		body: "Explain issues in your own words",
	},
	{
		icon: SearchCode,
		title: "Evidence-based investigation",
		body: "The assistant can inspect authorized code and technical resources",
	},
	{
		icon: FileText,
		title: "Detailed reporting",
		body: "Your discussion and findings reach the team",
	},
];

const TICKET_CATEGORIES = [
	{ value: "bug", label: "Bug" },
	{ value: "account", label: "Account" },
	{ value: "search", label: "Search" },
	{ value: "orders", label: "Orders" },
	{ value: "verification", label: "Verification" },
	{ value: "other", label: "Other" },
];

const inputClasses =
	"w-full rounded-xl border border-white/10 bg-[#0b0714]/70 px-4 py-3 text-sm text-[#f4eeff] placeholder-[#a99bbd]/60 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20";

const labelClasses = "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a99bbd]";

export default function SupportLanding() {
	const navigate = useNavigate();

	const [tokenInput, setTokenInput] = useState("");
	const [tokenBusy, setTokenBusy] = useState(false);
	const [tokenError, setTokenError] = useState("");

	const [formOpen, setFormOpen] = useState(false);
	const [subject, setSubject] = useState("");
	const [category, setCategory] = useState("bug");
	const [priority, setPriority] = useState("standard");
	const [description, setDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState("");
	const [ticketId, setTicketId] = useState(null);

	// A token session is good for one visit; a refresh starts clean.
	useEffect(() => {
		clearSupportSession();
	}, []);

	const signedIn = Boolean(getToken());

	async function handleContinue(event) {
		event.preventDefault();
		const raw = tokenInput.trim();
		if (!raw) {
			setTokenError("Paste a support token to continue.");
			return;
		}
		setTokenBusy(true);
		setTokenError("");
		try {
			const data = await apiRequest("/support/token/validate", {
				method: "POST",
				body: { token: raw },
			});
			if (data?.ok) {
				setSupportSession({
					token: raw,
					buyer: data.buyer ?? null,
					label: data.label || "",
				});
				navigate("/support/case/new", { replace: true });
				return;
			}
			setTokenError("That support token is invalid, expired or revoked.");
		} catch {
			setTokenError("We couldn't verify that token just now. Please try again.");
		} finally {
			setTokenBusy(false);
		}
	}

	async function handleTicketSubmit(event) {
		event.preventDefault();
		setFormError("");
		setSubmitting(true);
		try {
			const data = await apiRequest("/support/tickets", {
				method: "POST",
				token: getToken(),
				body: {
					subject: subject.trim(),
					description: description.trim(),
					category,
					priority,
					page_url: window.location.href,
				},
			});
			setTicketId(data?.ticket?.id ?? data?.id ?? "");
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "Unable to submit the request.");
		} finally {
			setSubmitting(false);
		}
	}

	function resetTicketFlow() {
		setTicketId(null);
		setFormOpen(false);
		setSubject("");
		setCategory("bug");
		setPriority("standard");
		setDescription("");
		setFormError("");
	}

	return (
		<div className="relative min-h-screen overflow-hidden bg-[#0b0714] text-[#f4eeff]">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-purple-600/10 blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-40 -left-40 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-96 -right-40 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl"
			/>

			<div className="relative mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
				<header className="flex items-center justify-between">
					<Link
						to="/"
						className="text-sm font-semibold uppercase tracking-[0.22em] text-purple-400 transition hover:text-purple-300"
					>
						GarTexHub <span className="text-[#a99bbd]">Support</span>
					</Link>
					<Link
						to="/help"
						className="text-xs font-medium text-[#a99bbd] transition hover:text-purple-300"
					>
						Help center
					</Link>
				</header>

				<main>
					<section className="mx-auto mt-14 max-w-3xl text-center sm:mt-20">
						<p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-purple-400">
							GarTexHub Support
						</p>
						<h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-[#f4eeff] sm:text-5xl">
							Something isn&apos;t working as expected?{" "}
							<span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
								Let&apos;s investigate.
							</span>
						</h1>
						<p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#a99bbd]">
							Explain what happened. Share screenshots. Discuss the issue with our AI technical
							assistant. It will investigate the available evidence and prepare a detailed case
							report for our team.
						</p>
					</section>

					<section className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-3">
						{FEATURES.map((feature) => (
							<GlassCard key={feature.title} className="p-5">
								<feature.icon className="h-5 w-5 text-purple-400" aria-hidden="true" />
								<h2 className="mt-3 text-base font-semibold text-[#f4eeff]">{feature.title}</h2>
								<p className="mt-1 text-sm leading-6 text-[#a99bbd]">{feature.body}</p>
							</GlassCard>
						))}
					</section>

					<section className="mt-6 grid gap-6 md:grid-cols-2">
						<GlassCard className="flex flex-col p-6 sm:p-7">
							<div className="flex items-center gap-3">
								<span className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10">
									<Sparkles className="h-5 w-5 text-purple-400" aria-hidden="true" />
								</span>
								<h2 className="text-xl font-semibold text-[#f4eeff]">AI Investigation</h2>
							</div>
							<p className="mt-3 text-sm leading-6 text-[#a99bbd]">
								For buyers: paste the secure support token issued by our team.
							</p>
							<form onSubmit={handleContinue} className="mt-5 flex flex-1 flex-col">
								<label htmlFor="support-token" className={labelClasses}>
									Support token
								</label>
								<input
									id="support-token"
									type="text"
									value={tokenInput}
									onChange={(event) => setTokenInput(event.target.value)}
									placeholder="gtk_sup_…"
									autoComplete="off"
									spellCheck={false}
									className={`mt-2 font-mono ${inputClasses}`}
								/>
								{tokenError ? (
									<p role="alert" className="mt-3 text-sm text-rose-300">
										{tokenError}
									</p>
								) : null}
								<button
									type="submit"
									disabled={tokenBusy}
									className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-[#f4eeff] transition hover:from-purple-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{tokenBusy ? "Verifying…" : "Continue"}
									<ArrowRight className="h-4 w-4" aria-hidden="true" />
								</button>
							</form>
						</GlassCard>

						<GlassCard className="flex flex-col p-6 sm:p-7">
							<div className="flex items-center gap-3">
								<span className="flex h-11 w-11 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10">
									<LifeBuoy className="h-5 w-5 text-fuchsia-400" aria-hidden="true" />
								</span>
								<h2 className="text-xl font-semibold text-[#f4eeff]">General Support</h2>
							</div>
							<p className="mt-3 text-sm leading-6 text-[#a99bbd]">
								For signed-in members: open a ticket and our team will get back to you by email.
							</p>
							<div className="mt-auto pt-5">
								{signedIn ? (
									<button
										type="button"
										onClick={() => setFormOpen((open) => !open)}
										aria-expanded={formOpen}
										aria-controls="general-support-form"
										className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/10 px-5 py-3 text-sm font-semibold text-fuchsia-200 transition hover:border-fuchsia-400/60 hover:bg-fuchsia-500/15"
									>
										{formOpen ? "Hide the form" : "Open the form"}
										<ArrowRight
											className={`h-4 w-4 transition-transform ${formOpen ? "rotate-90" : ""}`}
											aria-hidden="true"
										/>
									</button>
								) : (
									<Link
										to="/login"
										className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[#f4eeff] transition hover:border-cyan-400/40 hover:text-cyan-200"
									>
										Sign in to submit
										<ArrowRight className="h-4 w-4" aria-hidden="true" />
									</Link>
								)}
							</div>
						</GlassCard>
					</section>

					{signedIn && formOpen ? (
						<section id="general-support-form" className="mt-6">
							{ticketId === null ? (
								<GlassCard className="p-6 sm:p-7">
									<form onSubmit={handleTicketSubmit}>
										<h2 className="text-lg font-semibold text-[#f4eeff]">Describe the issue</h2>
										<p className="mt-1 text-sm text-[#a99bbd]">Our team will respond by email.</p>

										<div className="mt-5">
											<label htmlFor="ticket-subject" className={labelClasses}>
												Subject
											</label>
											<input
												id="ticket-subject"
												type="text"
												required={true}
												value={subject}
												onChange={(event) => setSubject(event.target.value)}
												placeholder="What do you need help with?"
												className={`mt-2 ${inputClasses}`}
											/>
										</div>

										<div className="mt-4 grid gap-4 sm:grid-cols-2">
											<div>
												<label htmlFor="ticket-category" className={labelClasses}>
													Category
												</label>
												<select
													id="ticket-category"
													value={category}
													onChange={(event) => setCategory(event.target.value)}
													className={`mt-2 ${inputClasses}`}
												>
													{TICKET_CATEGORIES.map((entry) => (
														<option key={entry.value} value={entry.value}>
															{entry.label}
														</option>
													))}
												</select>
											</div>
											<div>
												<label htmlFor="ticket-priority" className={labelClasses}>
													Priority
												</label>
												<select
													id="ticket-priority"
													value={priority}
													onChange={(event) => setPriority(event.target.value)}
													className={`mt-2 ${inputClasses}`}
												>
													<option value="standard">Standard</option>
													<option value="urgent">Urgent</option>
												</select>
											</div>
										</div>

										<div className="mt-4">
											<label htmlFor="ticket-description" className={labelClasses}>
												Description
											</label>
											<textarea
												id="ticket-description"
												required={true}
												rows={5}
												value={description}
												onChange={(event) => setDescription(event.target.value)}
												placeholder="What happened, what you expected, and how to reproduce it."
												className={`mt-2 resize-y ${inputClasses}`}
											/>
										</div>

										{formError ? (
											<p role="alert" className="mt-4 text-sm text-rose-300">
												{formError}
											</p>
										) : null}

										<button
											type="submit"
											disabled={submitting}
											className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-[#f4eeff] transition hover:from-purple-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-60"
										>
											<Send className="h-4 w-4" aria-hidden="true" />
											{submitting ? "Submitting…" : "Submit request"}
										</button>
									</form>
								</GlassCard>
							) : (
								<GlassCard className="p-8 text-center">
									<CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" aria-hidden="true" />
									<h2 className="mt-4 text-xl font-semibold text-[#f4eeff]">Request received</h2>
									<p className="mt-2 text-sm text-[#a99bbd]">
										Our team will respond by email. Keep this reference:
									</p>
									{ticketId ? (
										<p className="mt-4 font-mono text-lg font-semibold text-cyan-200">
											{String(ticketId)}
										</p>
									) : null}
									<button
										type="button"
										onClick={resetTicketFlow}
										className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-[#f4eeff] transition hover:border-cyan-400/40 hover:text-cyan-200"
									>
										<ArrowLeft className="h-4 w-4" aria-hidden="true" />
										Back to support
									</button>
								</GlassCard>
							)}
						</section>
					) : null}

					<p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-[#a99bbd]/70">
						<ShieldCheck className="h-4 w-4 text-cyan-400" aria-hidden="true" />
						Support tokens are single-purpose and never stored by this page.
					</p>
				</main>
			</div>
		</div>
	);
}
