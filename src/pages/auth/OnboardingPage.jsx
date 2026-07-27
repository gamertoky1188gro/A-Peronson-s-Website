import {
	ArrowLeft,
	ArrowRight,
	Building2,
	Check,
	CloudUpload,
	ImageIcon,
	Layers3,
	MoonStar,
	Sparkles,
	SunMedium,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import NeonAtom from "../../components/ui/NeonAtom.jsx";
import ProfileImageUpload from "../../components/ui/ProfileImageUpload.jsx";
import { apiRequest, getCurrentUser, getRoleHome, getToken, saveSession } from "../../lib/auth.js";
import { logger } from "../../lib/logger.js";
import { useTheme } from "../../lib/ThemeProvider.jsx";

const DEFAULT_CATEGORIES = [
	"T-Shirt",
	"Polo",
	"Denim",
	"Hoodie",
	"Sportswear",
	"Knitwear",
	"Woven",
	"Outerwear",
];

export default function OnboardingPage() {
	const navigate = useNavigate();
	const user = getCurrentUser();
	const token = getToken();

	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";
	const [step, setStep] = useState(1);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [availableCategories, setAvailableCategories] = useState(DEFAULT_CATEGORIES);

	const [profileImage, setProfileImage] = useState(() => user?.profile?.profile_image || "");
	const [organizationName, setOrganizationName] = useState(
		() => user?.profile?.organization_name || user?.company_name || "",
	);
	const [bio, setBio] = useState(() => user?.profile?.bio || "");
	const [categories, setCategories] = useState(() => {
		const current = user?.profile?.categories;
		return Array.isArray(current) && current.length > 0 ? current : [];
	});

	useEffect(() => {
		if (!token) {
			return;
		}
		apiRequest("/categories", { token })
			.then((data) => {
				if (Array.isArray(data?.items)) {
					setAvailableCategories(data.items.map((c) => c.name || c.label || c));
				}
			})
			.catch((err) => logger.warn("Failed to load categories:", err));
	}, [token]);

	const progress = useMemo(() => ((step - 1) / 2) * 100, [step]);

	function toggleCategory(cat) {
		setCategories((prev) => {
			const set = new Set(prev);
			if (set.has(cat)) {
				set.delete(cat);
			} else {
				set.add(cat);
			}
			return [...set];
		});
	}

	async function submit({ skipped = false } = {}) {
		if (!token) {
			return;
		}
		setSaving(true);
		setError("");
		try {
			if (!skipped) {
				const name = String(organizationName || "").trim();
				if (!name || name.length < 3) {
					setError("Organization name must be at least 3 characters.");
					setSaving(false);
					return;
				}
				if (!Array.isArray(categories) || categories.length === 0) {
					setError('Please select at least one category or click "Skip for now".');
					setSaving(false);
					return;
				}
			}
			const payload = {
				profile_image: skipped ? profileImage || "" : profileImage || "",
				organization_name: skipped ? organizationName || "" : organizationName || "",
				bio: skipped ? bio || "" : bio || "",
				categories: skipped ? categories || [] : categories || [],
			};

			const updatedUser = await apiRequest("/onboarding", {
				method: "POST",
				token,
				body: payload,
			});
			saveSession(updatedUser, token);
			navigate(getRoleHome(updatedUser.role), { replace: true });
		} catch (err) {
			setError(err.message || "Unable to save onboarding");
		} finally {
			setSaving(false);
		}
	}

	function next() {
		setError("");
		const validate = (s) => {
			if (s === 1) {
				if (!profileImage || profileImage.trim() === "") {
					setError("Profile image is required.");
					return false;
				}
				const isUrl = profileImage.startsWith("http://") || profileImage.startsWith("https://");
				const isRelativePath = profileImage.startsWith("/uploads/");
				if (!(isUrl || isRelativePath)) {
					setError("Please enter a valid image URL or upload an image.");
					return false;
				}
			}
			if (s === 2) {
				const name = String(organizationName || "").trim();
				if (!name || name.length < 3) {
					setError("Organization name is required (min 3 characters).");
					return false;
				}
			}
			if (s === 3 && (!categories || categories.length === 0)) {
				setError("Please select at least one category.");
				return false;
			}
			return true;
		};

		if (!validate(step)) {
			return;
		}
		setStep((s) => Math.min(3, s + 1));
	}

	if (saving) {
		return <NeonAtom fill={true} />;
	}

	return (
		<div class={isDark ? "dark" : ""}>
			<div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#07111f] dark:text-white">
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute left-[-10rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-sky-400/25 blur-3xl dark:bg-sky-500/20" />
					<div className="absolute right-[-8rem] top-[8rem] h-[24rem] w-[24rem] rounded-full bg-blue-500/20 blur-3xl dark:bg-cyan-500/10" />
					<div className="absolute bottom-[-10rem] left-[20%] h-[22rem] w-[22rem] rounded-full bg-cyan-300/20 blur-3xl dark:bg-blue-600/10" />
				</div>

				<div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
					<div className="grid w-full gap-6 lg:grid-cols-[1.05fr_1.2fr]">
						<aside className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
							<div className="mb-8 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30">
										<Sparkles className="h-6 w-6" />
									</div>
									<div>
										<p className="text-sm font-medium text-slate-500 dark:text-slate-400">Welcome</p>
										<h1 className="text-xl font-semibold tracking-tight">Finish your setup</h1>
									</div>
								</div>

								<button
									onClick={toggleTheme}
									className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
								>
									{isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
									{isDark ? "Light" : "Dark"}
								</button>
							</div>

							<div className="space-y-5">
								<div>
									<div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
										<span>Setup progress</span>
										<span>{Math.round(progress)}%</span>
									</div>
									<div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
										<div
											className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 transition-all duration-500"
											style={{ width: `${progress}%` }}
										/>
									</div>
								</div>

								<div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
									{[
										{
											title: "Step 1",
											desc: "Add your profile image",
											active: step === 1,
											done: step > 1,
										},
										{
											title: "Step 2",
											desc: "Confirm organization",
											active: step === 2,
											done: step > 2,
										},
										{
											title: "Step 3",
											desc: "Select categories",
											active: step === 3,
											done: step > 3,
										},
									].map((item, index) => (
										<div
											key={item.title}
											className={`rounded-2xl border p-4 transition-all ${
												item.active
													? "border-sky-400/60 bg-sky-500/10 shadow-lg shadow-sky-500/10"
													: item.done
														? "border-emerald-400/40 bg-emerald-500/10"
														: "border-slate-200/70 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]"
											}`}
										>
											<div className="flex items-center justify-between gap-3">
												<div>
													<p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
														{item.title}
													</p>
													<h3 className="mt-1 text-base font-semibold">{item.desc}</h3>
												</div>
												<div
													className={`flex h-9 w-9 items-center justify-center rounded-full ${item.done ? "bg-emerald-500 text-white" : item.active ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"}`}
												>
													{item.done ? <Check className="h-4 w-4" /> : index + 1}
												</div>
											</div>
										</div>
									))}
								</div>

								<div className="rounded-3xl border border-sky-500/15 bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-cyan-500/10 p-5 dark:border-white/10 dark:from-sky-400/10 dark:via-blue-400/10 dark:to-cyan-400/10">
									<div className="flex items-start gap-4">
										<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-sky-600 shadow-sm dark:bg-white/10 dark:text-sky-300">
											<Building2 className="h-6 w-6" />
										</div>
										<div>
											<h3 className="text-lg font-semibold">
												{String(user?.role || "Account").replace("_", " ")} setup
											</h3>
											<p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
												Step {step} of 3 —{" "}
												{step === 1
													? "profile image"
													: step === 2
														? "organization details"
														: "product categories"}
												. You can always update these later.
											</p>
										</div>
									</div>
								</div>
							</div>
						</aside>

						<main className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-slate-950/75 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
							<div className="mb-6 flex items-center justify-between gap-4">
								<div>
									<p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-500">
										Onboarding
									</p>
									<h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
										Step {step} / 3
									</h2>
								</div>
								<div className="hidden rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-700 dark:text-sky-300 sm:flex sm:items-center sm:gap-2">
									<Layers3 className="h-4 w-4" />
									{String(user?.role || "user").replace("_", " ")}
								</div>
							</div>

							<div className="space-y-5">
								{step === 1 && (
									<section className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
										<div className="mb-5 flex items-center gap-3">
											<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30">
												<ImageIcon className="h-5 w-5" />
											</div>
											<div>
												<h3 className="text-xl font-semibold">Add your profile image</h3>
												<p className="text-sm text-slate-500 dark:text-slate-400">
													Optional. Upload an image for your profile.
												</p>
											</div>
										</div>

										<ProfileImageUpload
											value={profileImage}
											onChange={setProfileImage}
											label="Profile Image"
										/>
									</section>
								)}

								{step === 2 && (
									<section className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
										<div className="mb-5 flex items-center gap-3">
											<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30">
												<Building2 className="h-5 w-5" />
											</div>
											<div>
												<h3 className="text-xl font-semibold">Confirm your organization</h3>
												<p className="text-sm text-slate-500 dark:text-slate-400">
													Use the official name used in documents.
												</p>
											</div>
										</div>

										<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
											Organization name
										</label>
										<input
											value={organizationName}
											onChange={(e) => setOrganizationName(e.target.value)}
											placeholder="Your company / buying house name"
											className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)] dark:border-white/10 dark:bg-slate-900/80 dark:placeholder:text-slate-500"
										/>

										<div className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-white/10 dark:bg-slate-900/70">
											<p className="text-sm text-slate-500 dark:text-slate-400">Account role</p>
											<p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
												{String(user?.role || "").replace("_", " ")}
											</p>
										</div>

										<label className="mt-4 mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
											Description / Bio
										</label>
										<textarea
											value={bio}
											onChange={(e) => setBio(e.target.value)}
											placeholder="Tell us about your organization..."
											rows={3}
											className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)] dark:border-white/10 dark:bg-slate-900/80 dark:placeholder:text-slate-500 resize-none"
										/>
									</section>
								)}

								{step === 3 && (
									<section className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
										<div className="mb-5 flex items-center gap-3">
											<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30">
												<CloudUpload className="h-5 w-5" />
											</div>
											<div>
												<h3 className="text-xl font-semibold">Select categories</h3>
												<p className="text-sm text-slate-500 dark:text-slate-400">
													Pick a few categories you work with.
												</p>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
											{availableCategories.map((cat) => {
												const active = categories.includes(cat);
												return (
													<button
														key={cat}
														type="button"
														onClick={() => toggleCategory(cat)}
														className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all ${
															active
																? "border-sky-500 bg-sky-500/10 text-sky-700 shadow-[0_12px_30px_rgba(14,165,233,0.18)] dark:text-sky-300"
																: "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-500/5 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200"
														}`}
													>
														<div className="flex items-center justify-between gap-3">
															<span>{cat}</span>
															<span
																className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
																	active
																		? "bg-sky-500 text-white"
																		: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
																}`}
															>
																{active ? <Check className="h-3.5 w-3.5" /> : "+"}
															</span>
														</div>
													</button>
												);
											})}
										</div>

										<p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
											You can change these later in Organization Settings.
										</p>
									</section>
								)}
							</div>

							{error ? (
								<div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
									{error}
								</div>
							) : null}

							<div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-center gap-2">
									<button
										onClick={() => setStep((s) => Math.max(1, s - 1))}
										disabled={step === 1 || saving}
										className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:shadow-sm disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
									>
										<ArrowLeft className="h-4 w-4" />
										Back
									</button>
									{step < 3 ? (
										<button
											onClick={next}
											disabled={saving}
											className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-60"
										>
											Continue
											<ArrowRight className="h-4 w-4" />
										</button>
									) : (
										<button
											onClick={() => submit()}
											disabled={saving}
											className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-60"
										>
											{saving ? (
												<ThreeDot
													variant="bounce"
													color="#6100ff"
													size="small"
													text=""
													textColor=""
												/>
											) : (
												"Finish setup"
											)}
											<Check className="h-4 w-4" />
										</button>
									)}
								</div>

								<button
									onClick={() => submit({ skipped: true })}
									disabled={saving}
									className="text-sm font-semibold text-slate-500 transition hover:text-slate-700 disabled:opacity-60 dark:text-slate-400 dark:hover:text-slate-200"
								>
									Skip for now
								</button>
							</div>
						</main>
					</div>
				</div>
			</div>
		</div>
	);
}
