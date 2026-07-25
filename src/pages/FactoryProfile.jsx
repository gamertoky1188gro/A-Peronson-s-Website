/*
  Route: /factory/:id
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Render the Factory profile (overview + products + requests as applicable).
    - Highlight verification/trust and show credibility meter (VerificationPanel).
    - Provide relationship actions (follow/connect/message) depending on backend support.

  Key API endpoints:
    - GET /api/profiles/:id
    - GET /api/profiles/:id/products?cursor=...
    - GET /api/ratings/profiles/user::id (public ratings summary)
*/

import {
	AnimatePresence,
	motion,
	useDragControls,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	BadgeCheck,
	Boxes,
	Building2,
	CalendarDays,
	Camera,
	ChevronLeft,
	ChevronRight,
	ClipboardList,
	Clock3,
	Edit3,
	ExternalLink,
	Eye,
	Factory,
	Landmark,
	MapPin,
	MessageSquare,
	Play,
	Rocket,
	ShieldCheck,
	Sparkles,
	Star,
	Trash2,
	UserRound,
	Users,
	Video,
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HorizontalScrollGallery from "../components/HorizontalScrollGallery.jsx";
import HoverCard from "../components/HoverCard.jsx";
import CrmSummaryPanel from "../components/profile/CrmSummaryPanel.jsx";
import VerificationPanel from "../components/profile/VerificationPanel.jsx";
import NeonAtom from "../components/ui/NeonAtom.jsx";
import { usePremiumCheck } from "../hooks/useSecureUser.js";
import { apiRequest, getCurrentUser, getToken } from "../lib/auth.js";
import { trackClientEvent } from "../lib/events.js";
import { recordLeadSource } from "../lib/leadSource.js";
import { logger } from "../lib/logger.js";

const Motion = motion;

function roleToRoute(role, id) {
	if (!id) {
		return "/feed";
	}
	if (role === "buyer") {
		return `/buyer/${encodeURIComponent(id)}`;
	}
	if (role === "buying_house") {
		return `/buying-house/${encodeURIComponent(id)}`;
	}
	return `/factory/${encodeURIComponent(id)}`;
}

function isApprovedVideo(product) {
	return (
		Boolean(product?.video_url) &&
		String(product?.video_review_status || "").toLowerCase() === "approved" &&
		!product?.video_restricted
	);
}

function isBoostActive(boost) {
	if (!boost) {
		return false;
	}
	if (String(boost.status || "").toLowerCase() !== "active") {
		return false;
	}
	const now = Date.now();
	const startsAt = new Date(boost.starts_at).getTime();
	const endsAt = new Date(boost.ends_at).getTime();
	if (!(Number.isFinite(startsAt) && Number.isFinite(endsAt))) {
		return false;
	}
	return now >= startsAt && now <= endsAt;
}

function Pill({ children, tone = "default", title }) {
	const tones = {
		default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
		success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
		info: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
		warning: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
		premium: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white",
		danger: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
	};
	return (
		<span
			title={title}
			class={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone] || tones.default}`}
		>
			{children}
		</span>
	);
}

function Metric({ label, value, helper }) {
	return (
		<div class="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
			<div class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
				{label}
			</div>
			<div class="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</div>
			{helper ? <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</div> : null}
		</div>
	);
}

function AvatarFallback({ name, imageUrl }) {
	const initials = (n) => {
		if (!n) {
			return "?";
		}
		return n
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((p) => p[0]?.toUpperCase())
			.join("");
	};
	return (
		<div class="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-500 via-cyan-400 to-indigo-500 p-[2px] shadow-xl">
			<div class="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.15rem] bg-slate-100 text-2xl font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-100">
				{imageUrl ? (
					<img src={imageUrl} alt={name || "Profile avatar"} class="h-full w-full object-cover" />
				) : (
					initials(name)
				)}
			</div>
		</div>
	);
}

function SoftCard({ children, className = "" }) {
	return (
		<div
			class={`rounded-3xl border border-slate-200/70 bg-white/75 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/65 ${className}`}
		>
			{children}
		</div>
	);
}

function SectionTitle({ icon: Icon, title, subtitle, action }) {
	return (
		<div class="mb-4 flex items-start justify-between gap-3">
			<div>
				<div class="flex items-center gap-2">
					{Icon ? <Icon class="h-4 w-4 text-sky-500" /> : null}
					<h3 class="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
						{title}
					</h3>
				</div>
				{subtitle ? (
					<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
				) : null}
			</div>
			{action}
		</div>
	);
}

function StatCard({ icon: Icon, label, value, caption }) {
	return (
		<div class="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50">
			<div class="flex items-center gap-2 text-sky-600 dark:text-sky-400">
				{Icon ? <Icon class="h-4 w-4" /> : null}
				<span class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
					{label}
				</span>
			</div>
			<div class="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</div>
			{caption ? (
				<div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{caption}</div>
			) : null}
		</div>
	);
}

export default function FactoryProfile() {
	const { id } = useParams();
	const navigate = useNavigate();
	const token = useMemo(() => getToken(), []);
	const currentUser = useMemo(() => getCurrentUser(), []);
	const { isPremium: isPremiumFromApi } = usePremiumCheck();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [profile, setProfile] = useState(null);
	const [ratingSummary, setRatingSummary] = useState(null);
	const [certification, setCertification] = useState(null);

	const [activeTab, setActiveTab] = useState("overview");
	const [products, setProducts] = useState([]);
	const [productsCursor, setProductsCursor] = useState(0);
	const [productsNext, setProductsNext] = useState(null);
	const [loadingProducts, setLoadingProducts] = useState(false);
	const [profileBoost, setProfileBoost] = useState(null);
	const reduceMotion = useReducedMotion();
	const dragControls = useDragControls();
	const [galleryIndex, setGalleryIndex] = useState(0);
	const [showGallery, setShowGallery] = useState(false);
	const { scrollY } = useScroll();
	const coverParallax = useSpring(useTransform(scrollY, [0, 400], [0, 60]), {
		stiffness: 80,
		damping: 20,
		restDelta: 0.001,
	});

	const user = profile?.user || null;
	const verification = profile?.verification_summary || null;
	const relationship = profile?.relationship || {
		following: false,
		friend_status: "none",
	};
	const viewerPerms = profile?.viewer_permissions || {
		is_self: false,
		is_admin: false,
	};
	const isPremium =
		isPremiumFromApi ||
		String(user?.subscription_status || "").toLowerCase() === "premium" ||
		profile?.effective_plan === "premium";
	const isSelfOrAdmin = viewerPerms.is_self || viewerPerms.is_admin;
	const brandProfile = isSelfOrAdmin ? profile?.profile_private || user?.profile || {} : {};
	const hasBrandKit = Boolean(
		brandProfile.brand_name ||
			brandProfile.brand_logo_url ||
			brandProfile.brand_tagline ||
			brandProfile.brand_website,
	);
	const hasAccountManager = Boolean(
		brandProfile.account_manager_name ||
			brandProfile.account_manager_email ||
			brandProfile.account_manager_phone,
	);
	const isCertified = String(certification?.status || "").toLowerCase() === "certified";

	const loadProfile = useCallback(async () => {
		if (!id) {
			return;
		}
		setLoading(true);
		setError("");
		try {
			const data = await apiRequest(`/profiles/${encodeURIComponent(id)}`, {
				token,
			});
			if (data?.user?.role && data.user.role !== "factory") {
				navigate(roleToRoute(data.user.role, id), { replace: true });
				return;
			}
			setProfile(data);
		} catch (err) {
			setError(err.message || "Failed to load profile");
			setProfile(null);
		} finally {
			setLoading(false);
		}
	}, [id, navigate, token]);

	const loadRatings = useCallback(async () => {
		if (!id) {
			return;
		}
		try {
			const data = await apiRequest(`/ratings/profiles/user:${encodeURIComponent(id)}`, {
				token: "",
			});
			setRatingSummary(data || null);
		} catch (err) {
			logger.warn("API error:", err);
			setRatingSummary(null);
		}
	}, [id]);

	const loadCertification = useCallback(async () => {
		if (!(id && token)) {
			return;
		}
		try {
			const data = await apiRequest(`/certifications/org/${encodeURIComponent(id)}`, { token });
			setCertification(data?.summary || null);
		} catch (err) {
			logger.warn("API error:", err);
			setCertification(null);
		}
	}, [id, token]);

	const loadProducts = useCallback(
		async ({ reset }) => {
			if (!id) {
				return;
			}
			const cursor = reset ? 0 : productsCursor;
			setLoadingProducts(true);
			try {
				const data = await apiRequest(
					`/profiles/${encodeURIComponent(id)}/products?cursor=${cursor}&limit=10`,
					{ token },
				);
				const rows = Array.isArray(data?.items) ? data.items : [];
				setProducts((prev) => (reset ? rows : [...prev, ...rows]));
				setProductsCursor(reset ? 10 : cursor + 10);
				setProductsNext(data?.next_cursor ?? null);
			} catch (err) {
				logger.warn("API error:", err);
			} finally {
				setLoadingProducts(false);
			}
		},
		[id, productsCursor, token],
	);

	useEffect(() => {
		if (!id) {
			return;
		}
		let cancelled = false;

		apiRequest(`/profiles/${encodeURIComponent(id)}`, { token })
			.then((data) => {
				if (cancelled) {
					return;
				}
				setError("");
				if (data?.user?.role && data.user.role !== "factory") {
					navigate(roleToRoute(data.user.role, id), { replace: true });
					return;
				}
				setProfile(data);
			})
			.catch((err) => {
				if (!cancelled) {
					setError(err.message || "Failed to load profile");
					setProfile(null);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false);
				}
			});

		apiRequest(`/ratings/profiles/user:${encodeURIComponent(id)}`, {
			token: "",
		})
			.then((data) => {
				if (!cancelled) {
					setRatingSummary(data || null);
				}
			})
			.catch((err) => {
				logger.warn("API error:", err);
				if (!cancelled) {
					setRatingSummary(null);
				}
			});

		if (token) {
			apiRequest(`/certifications/org/${encodeURIComponent(id)}`, { token })
				.then((data) => {
					if (!cancelled) {
						setCertification(data?.summary || null);
					}
				})
				.catch((err) => {
					logger.warn("API error:", err);
					if (!cancelled) {
						setCertification(null);
					}
				});
		}

		return () => {
			cancelled = true;
		};
	}, [id, navigate, token]);

	useEffect(() => {
		if (!user?.id) {
			return;
		}
		trackClientEvent("profile_view", {
			entityType: "profile",
			entityId: user.id,
			metadata: { role: user.role || "factory" },
		});
	}, [user?.id, user?.role]);

	useEffect(() => {
		if (!viewerPerms.is_self) {
			return;
		}
		const tokenValue = getToken();
		if (!tokenValue) {
			return;
		}
		apiRequest("/boosts/me", { token: tokenValue })
			.then((data) => {
				const active = (data?.items || []).find(
					(boost) => boost.scope === "profile" && isBoostActive(boost),
				);
				setProfileBoost(active || null);
			})
			.catch(() => setProfileBoost(null));
	}, [viewerPerms.is_self]);

	useEffect(() => {
		if (!["products", "videos"].includes(activeTab)) {
			return;
		}
		if (products.length > 0) {
			return;
		}
		if (!id) {
			return;
		}
		let cancelled = false;

		queueMicrotask(() => {
			if (!cancelled) {
				setLoadingProducts(true);
			}
		});

		apiRequest(`/profiles/${encodeURIComponent(id)}/products?cursor=0&limit=10`, { token })
			.then((data) => {
				if (cancelled) {
					return;
				}
				const rows = Array.isArray(data?.items) ? data.items : [];
				setProducts(rows);
				setProductsCursor(10);
				setProductsNext(data?.next_cursor ?? null);
			})
			.catch((err) => {
				logger.warn("API error:", err);
			})
			.finally(() => {
				if (!cancelled) {
					setLoadingProducts(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [activeTab, products.length, id, token]);

	async function follow() {
		if (!id) {
			return;
		}
		try {
			const res = await apiRequest(`/users/${encodeURIComponent(id)}/follow`, {
				method: "POST",
				token,
			});
			setProfile((prev) =>
				prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev,
			);
		} catch (err) {
			logger.warn("API error:", err);
		}
	}

	async function connect() {
		if (!id) {
			return;
		}
		try {
			const res = await apiRequest(`/users/${encodeURIComponent(id)}/friend-request`, {
				method: "POST",
				token,
			});
			setProfile((prev) =>
				prev ? { ...prev, relationship: res?.relation || prev.relationship } : prev,
			);
		} catch (err) {
			logger.warn("API error:", err);
		}
	}

	function contact() {
		if (id) {
			recordLeadSource({
				type: "direct",
				id: `profile:${id}`,
				label: `Profile: ${user?.name || roleLabel}`,
			});
		}
		navigate("/chat", {
			state: {
				notice: `Contacting ${user?.name || roleLabel}. If you are unverified, your first message may appear as a request.`,
			},
		});
	}

	const visibleVideos = useMemo(() => {
		if (viewerPerms.is_self || viewerPerms.is_admin) {
			return products.filter((p) => p.video_url);
		}
		return products.filter(isApprovedVideo);
	}, [products, viewerPerms.is_admin, viewerPerms.is_self]);
	const [reviewEditModal, setReviewEditModal] = useState({
		open: false,
		id: null,
		score: 5,
		comment: "",
	});
	const [reviewDeleteId, setReviewDeleteId] = useState(null);
	const isBoosted = Boolean(profileBoost);

	if (loading) {
		return <NeonAtom fill={true} />;
	}
	if (error) {
		return (
			<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.02),rgba(2,6,23,0))] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.22),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))] p-6 text-rose-700 dark:text-rose-200">
				{error}
			</div>
		);
	}
	if (!user) {
		return (
			<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.02),rgba(2,6,23,0))] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.22),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))] p-6 text-slate-700 dark:text-slate-200">
				Profile not found.
			</div>
		);
	}

	const roleLabel = user?.role
		? user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
		: "Factory";
	const displayName = user?.name || roleLabel;
	const country = user?.profile?.country || "—";
	const industry = user?.profile?.industry || "";
	const organization =
		user?.profile?.organization_name || user?.profile?.organization || user?.name || "—";
	const avg = ratingSummary?.aggregate?.average_score ?? 0;
	const totalRatings = ratingSummary?.aggregate?.total_count ?? 0;
	const trustScore = profile?.credibility_meter ?? null;
	const ratingValue = avg;
	const ratingCount = totalRatings;

	const badges = [
		user?.verified ? { label: "Verified", icon: ShieldCheck, tone: "info" } : null,
		isCertified ? { label: "Certified", icon: BadgeCheck, tone: "success" } : null,
		isPremium
			? {
					label: "Premium Reach",
					icon: Sparkles,
					tone: "premium",
					title: "Boosted visibility enabled for Premium",
				}
			: null,
		isBoosted ? { label: "Boosted", icon: Rocket, tone: "success" } : null,
	].filter(Boolean);

	const coverImage = user?.profile?.cover_image_url;
	const avatarImage = user?.profile?.profile_image;

	return (
		<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.02),rgba(2,6,23,0))] text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.22),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))] dark:text-slate-100">
			<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<div class="mb-5 flex items-center justify-between gap-3">
					<button
						onClick={() => navigate(-1)}
						class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:text-sky-300"
					>
						<ChevronLeft class="h-4 w-4" /> Back
					</button>
					<div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
						<ShieldCheck class="h-3.5 w-3.5" /> Role:{" "}
						<span class="font-medium text-slate-700 dark:text-slate-200">{roleLabel}</span>
					</div>
				</div>

				<div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
					<aside class="space-y-6 xl:sticky xl:top-6 xl:self-start">
						<SoftCard>
							<SectionTitle
								icon={Factory}
								title="Factory Profile"
								subtitle="Cover, identity, trust, and relationship actions"
								action={
									<Pill tone="info">
										<Factory class="mr-1 h-3.5 w-3.5" /> {roleLabel}
									</Pill>
								}
							/>
							<div class="overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
								<div class="h-28 bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600" />
								<div class="relative px-5 pb-5 pt-0">
									<div class="-mt-10 flex items-end gap-4">
										<AvatarFallback name={displayName} imageUrl={avatarImage} />
										<div class="pb-1">
											<div class="flex flex-wrap items-center gap-2">
												<h1 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
													{displayName}
												</h1>
												{user?.verified ? <BadgeCheck class="h-5 w-5 text-sky-500" /> : null}
											</div>
											<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{organization}</p>
										</div>
									</div>
									<div class="mt-3 flex flex-wrap gap-2">
										<Pill tone="info">
											<MapPin class="h-3.5 w-3.5" /> {country}
										</Pill>
										<Pill tone="info">{industry}</Pill>
										<Pill tone="info">Trust {trustScore === null ? "—" : trustScore}%</Pill>
									</div>
									<div class="mt-4 grid grid-cols-3 gap-2">
										<button
											onClick={contact}
											class="rounded-2xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5"
										>
											Contact
										</button>
										<button
											onClick={follow}
											class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
										>
											{relationship.following ? "Following" : "Follow"}
										</button>
										<button
											onClick={connect}
											class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
										>
											{relationship.friend_status === "friends"
												? "Connected"
												: relationship.friend_status === "requested"
													? "Requested"
													: "Connect"}
										</button>
									</div>
								</div>
							</div>
							<div class="mt-4 grid gap-3">
								<StatCard icon={Building2} label="Industry" value={industry} />
								<StatCard icon={Landmark} label="Organization" value={organization} />
								<StatCard
									icon={Star}
									label="Rating"
									value={`${ratingValue.toFixed(1)} / 5`}
									caption={`${ratingCount} reviews`}
								/>
								<StatCard
									icon={Boxes}
									label="Monthly"
									value={user?.profile?.monthly_capacity || "--"}
									caption="Capacity"
								/>
								<StatCard
									icon={ClipboardList}
									label="Declared"
									value={user?.profile?.moq || "--"}
									caption="MOQ"
								/>
							</div>
						</SoftCard>

						<SoftCard>
							<SectionTitle
								icon={ShieldCheck}
								title="Verification Panel"
								subtitle="Shared trust and validation signals"
							/>
							<VerificationPanel summary={verification} />
						</SoftCard>

						{certification ? (
							<SoftCard>
								<SectionTitle
									icon={BadgeCheck}
									title="Order Completion Certification"
									subtitle="Signed contract record."
								/>
								<div class="space-y-3">
									<div class="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
										<div>
											<div class="text-sm font-semibold text-slate-900 dark:text-slate-100">
												Status
											</div>
											<div class="mt-1 text-sm text-slate-500 dark:text-slate-400">
												Certification status
											</div>
										</div>
										<Pill tone={certification.status === "certified" ? "success" : "default"}>
											{certification.status || "pending"}
										</Pill>
									</div>
									<Metric label="Signed contracts" value={certification.signed_contracts ?? 0} />
								</div>
							</SoftCard>
						) : null}
					</aside>

					<main class="min-w-0 space-y-6">
						<SoftCard>
							<SectionTitle
								icon={Factory}
								title={displayName}
								subtitle="Overview, products, approved media, work history, and reviews"
							/>
							<div class="flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
								{[
									["overview", "Overview", Eye],
									["products", "Products", Boxes],
									["videos", "Video Gallery", Video],
									["work", "Work History", ClipboardList],
									["reviews", "Reviews", Star],
								].map(([key, label, Icon]) => (
									<button
										key={key}
										onClick={() => setActiveTab(key)}
										class={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === key ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
									>
										<Icon class="h-4 w-4" /> {label}
									</button>
								))}
							</div>

							{loading ? (
								<div class="flex min-h-[280px] items-center justify-center text-slate-500 dark:text-slate-400">
									Loading profile...
								</div>
							) : error ? (
								<div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
									{error}
								</div>
							) : (
								<div class="pt-5">
									<AnimatePresence mode="wait">
										{activeTab === "overview" && (
											<motion.div
												key="overview"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												class="space-y-6"
											>
												<div class="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
													<SoftCard>
														<SectionTitle
															icon={Eye}
															title="About"
															subtitle="Factory overview and positioning."
														/>
														<p class="leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
															{user?.profile?.about || "No description added yet."}
														</p>
													</SoftCard>
													{hasBrandKit ? (
														<SoftCard>
															<SectionTitle
																icon={Eye}
																title="Brand Kit"
																subtitle="Visible only to self or admins."
															/>
															<div class="flex items-center gap-3">
																<div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 ring-1 ring-sky-500/10">
																	{brandProfile.brand_logo_url ? (
																		<img
																			src={brandProfile.brand_logo_url}
																			alt="Brand logo"
																			class="h-full w-full object-cover"
																		/>
																	) : (
																		<Building2 class="h-5 w-5 text-sky-500" />
																	)}
																</div>
																<div class="min-w-0">
																	<div class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
																		{brandProfile.brand_name || user?.name}
																	</div>
																	{brandProfile.brand_tagline ? (
																		<div class="text-xs text-slate-500 dark:text-slate-400">
																			{brandProfile.brand_tagline}
																		</div>
																	) : null}
																	{brandProfile.brand_website ? (
																		<div class="text-xs text-slate-500 dark:text-slate-400">
																			{brandProfile.brand_website}
																		</div>
																	) : null}
																</div>
															</div>
														</SoftCard>
													) : null}
												</div>

												{isPremium && hasAccountManager ? (
													<SoftCard>
														<SectionTitle
															icon={UserRound}
															title="Dedicated Account Manager"
															subtitle="Same pattern as Buyer"
														/>
														<div class="flex items-center gap-4">
															<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
																<UserRound class="h-6 w-6" />
															</div>
															<div>
																<div class="font-semibold">
																	{brandProfile.account_manager_name || "Assigned account manager"}
																</div>
																<div class="text-sm text-slate-500 dark:text-slate-400">
																	{brandProfile.account_manager_email ||
																		brandProfile.account_manager_phone ||
																		""}
																</div>
															</div>
														</div>
													</SoftCard>
												) : null}

												<div class="grid gap-4 md:grid-cols-3">
													<StatCard icon={Building2} label="Industry" value={industry} />
													<StatCard icon={Landmark} label="Organization" value={organization} />
													<StatCard
														icon={Star}
														label="Rating"
														value={`${ratingValue.toFixed(1)} / 5`}
														caption={`${ratingCount} reviews`}
													/>
												</div>

												<div class="grid gap-4 md:grid-cols-3">
													<StatCard
														icon={Clock3}
														label="Lead time (days)"
														value={user?.profile?.lead_time_days || "--"}
													/>
													<StatCard
														icon={BadgeCheck}
														label="Certifications"
														value={(user?.profile?.certifications || []).join(", ") || "--"}
													/>
													<StatCard
														icon={Users}
														label="Employees"
														value={user?.profile?.employee_count || "--"}
													/>
												</div>

												<SoftCard>
													<SectionTitle
														icon={Building2}
														title="Companies Worked With"
														subtitle="Same pattern as Buyer"
													/>
													{(user?.profile?.companies_worked_with || []).length > 0 ? (
														<div class="grid gap-3 md:grid-cols-2">
															{(user.profile.companies_worked_with || []).map((company, idx) => (
																<div
																	key={idx}
																	class="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40"
																>
																	<div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 ring-1 ring-sky-500/10">
																		{company.logo ? (
																			<img
																				src={company.logo}
																				alt={company.name || "Company"}
																				class="h-full w-full object-cover"
																			/>
																		) : (
																			<Building2 class="h-5 w-5 text-sky-500" />
																		)}
																	</div>
																	<div class="min-w-0">
																		<div class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
																			{company.name || "Untitled company"}
																		</div>
																		{company.location ? (
																			<div class="truncate text-xs text-slate-500 dark:text-slate-400">
																				{company.location}
																			</div>
																		) : null}
																	</div>
																</div>
															))}
														</div>
													) : (
														<p class="text-sm text-slate-500 dark:text-slate-400">
															No companies listed yet.
														</p>
													)}
												</SoftCard>
											</motion.div>
										)}

										{activeTab === "products" && (
											<motion.div
												key="products"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												class="space-y-5"
											>
												<SoftCard>
													<SectionTitle
														icon={Boxes}
														title="Products"
														subtitle="Horizontal scroll gallery with fullscreen lightbox"
													/>
													{products.length === 0 && !loadingProducts ? (
														<div class="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
															No products found.
														</div>
													) : (
														<HorizontalScrollGallery>
															{products.map((product) => (
																<div key={product.id} class="w-[310px] snap-start">
																	<HoverCard>
																		<div class="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
																			<button
																				onClick={() => {
																					setGalleryIndex(products.indexOf(product));
																					setShowGallery(true);
																				}}
																				class="group relative block h-48 w-full overflow-hidden bg-slate-200"
																			>
																				<img
																					src={product.cover_image_public_url}
																					alt={product.title}
																					class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
																				/>
																				<div class="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
																				<div class="absolute left-3 top-3 flex gap-2">
																					<Pill
																						tone={
																							product.status === "active"
																								? "success"
																								: product.status === "in production"
																									? "warning"
																									: "default"
																						}
																					>
																						{product.status || "published"}
																					</Pill>
																					{product.hasVideo ? (
																						<Pill tone="info">
																							<Play class="mr-1 h-3 w-3" /> Video
																						</Pill>
																					) : null}
																				</div>
																				<div class="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
																					Open gallery
																				</div>
																			</button>
																			<div class="space-y-3 p-4">
																				<div>
																					<div class="flex items-start justify-between gap-3">
																						<h4 class="line-clamp-1 text-base font-semibold text-slate-900 dark:text-slate-100">
																							{product.title || "Product"}
																						</h4>
																						<button
																							class="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-800 dark:text-slate-400"
																							onClick={() => {
																								setGalleryIndex(products.indexOf(product));
																								setShowGallery(true);
																							}}
																							aria-label={`Open gallery for ${product.title}`}
																						>
																							<Camera class="h-4 w-4" />
																						</button>
																					</div>
																					<p class="mt-1 text-xs uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
																						{product.category || "Category"}
																					</p>
																				</div>
																				<div class="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
																					<span class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-900">
																						MOQ: {product.moq ?? "--"}
																					</span>
																					<span class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-900">
																						Lead time: {product.lead_time_days ?? "--"} days
																					</span>
																				</div>
																				<p class="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
																					{product.description || ""}
																				</p>
																				<div class="flex items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
																					<span>
																						{product.video_review_status
																							? `Review: ${String(product.video_review_status).replace(/_/g, " ")}`
																							: "No review status"}
																					</span>
																					{product.video_url ? (
																						<span class="inline-flex items-center gap-1 text-sky-600 dark:text-sky-300">
																							<Video class="h-3.5 w-3.5" /> Media
																						</span>
																					) : null}
																				</div>
																			</div>
																		</div>
																	</HoverCard>
																</div>
															))}
														</HorizontalScrollGallery>
													)}
													<div class="mt-5 flex items-center justify-between gap-3">
														<div class="text-sm text-slate-500 dark:text-slate-400">
															{loadingProducts
																? "Loading more products..."
																: productsNext === null
																	? "End of catalog."
																	: "More items available."}
														</div>
														{productsNext !== null && !loadingProducts ? (
															<button
																onClick={() => loadProducts({ reset: false })}
																class="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900"
															>
																Load more
															</button>
														) : null}
													</div>
												</SoftCard>
											</motion.div>
										)}

										{activeTab === "videos" && (
											<motion.div
												key="videos"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												class="space-y-5"
											>
												<SoftCard>
													<SectionTitle
														icon={Video}
														title="Video Gallery"
														subtitle="Only approved media is public. Pending or restricted media remains hidden unless you are the profile owner or an admin."
													/>
													{visibleVideos.length === 0 ? (
														<div class="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
															No public videos available.
														</div>
													) : (
														<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
															{visibleVideos.map((item) => (
																<div
																	key={item.id}
																	class="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
																>
																	<div class="flex items-start gap-3">
																		<div class="rounded-2xl bg-sky-500/10 p-3 text-sky-600 dark:text-sky-300">
																			<Play class="h-5 w-5" />
																		</div>
																		<div class="min-w-0 flex-1">
																			<div class="font-semibold text-slate-900 dark:text-slate-100">
																				{item.title || "Video"}
																			</div>
																			<div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
																				{String(item.video_review_status || "--").replace(
																					/_/g,
																					" ",
																				)}
																			</div>
																			<p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
																				{item.description || ""}
																			</p>
																			{item.video_url ? (
																				<a
																					href={item.video_url}
																					target="_blank"
																					rel="noreferrer"
																					class="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
																				>
																					Open video link <ExternalLink class="h-4 w-4" />
																				</a>
																			) : null}
																		</div>
																	</div>
																</div>
															))}
														</div>
													)}
												</SoftCard>
											</motion.div>
										)}

										{activeTab === "work" && (
											<motion.div
												key="work"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												class="space-y-5"
											>
												<SoftCard>
													<SectionTitle
														icon={ClipboardList}
														title="Work History"
														subtitle="Same company list pattern"
													/>
													{(user?.profile?.companies_worked_with || []).length > 0 ? (
														<div class="space-y-3">
															{(user.profile.companies_worked_with || []).map((company, idx) => (
																<div
																	key={idx}
																	class="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/40"
																>
																	<div class="flex items-center gap-3 min-w-0">
																		<div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/15 to-cyan-500/15 ring-1 ring-sky-500/10">
																			{company.logo ? (
																				<img
																					src={company.logo}
																					alt={company.name || "Company"}
																					class="h-full w-full object-cover"
																				/>
																			) : (
																				<Building2 class="h-5 w-5 text-sky-500" />
																			)}
																		</div>
																		<div class="min-w-0">
																			<div class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
																				{company.name || "Untitled company"}
																			</div>
																			<div class="truncate text-xs text-slate-500 dark:text-slate-400">
																				{company.role || "Partner"}
																			</div>
																		</div>
																	</div>
																	<div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
																		<CalendarDays class="h-4 w-4" />{" "}
																		{company.period || company.location || "Ongoing"}
																	</div>
																</div>
															))}
														</div>
													) : (
														<div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/20 dark:text-slate-400">
															No work history added yet.
														</div>
													)}
												</SoftCard>
											</motion.div>
										)}

										{activeTab === "reviews" && (
											<motion.div
												key="reviews"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												class="space-y-5"
											>
												<SoftCard>
													<SectionTitle
														icon={Star}
														title="Rating summary"
														subtitle="Public reviews and confidence scoring."
													/>
													<div class="grid gap-4 md:grid-cols-3">
														<Metric label="Average score" value={`${avg.toFixed(1)} / 5`} />
														<Metric label="Total reviews" value={totalRatings} />
														<Metric
															label="Confidence"
															value={ratingSummary?.aggregate?.reliability?.confidence || "low"}
															helper="Aggregate reliability"
														/>
													</div>
												</SoftCard>

												<div class="rounded-3xl border border-amber-400/25 bg-amber-500/10 p-4 text-sm leading-7 text-amber-950 dark:text-amber-100">
													<strong class="font-semibold">Review Policy:</strong> Reviews can only be
													edited or deleted by the person who wrote them. Profile owners cannot
													delete reviews to maintain transparency and trust.
												</div>

												<SoftCard>
													<SectionTitle
														icon={MessageSquare}
														title="Recent reviews"
														subtitle="Public feedback from past collaborations."
													/>
													{(ratingSummary?.recent_reviews || []).length > 0 ? (
														<div class="space-y-3">
															{(ratingSummary.recent_reviews || []).map((review) => {
																const canEdit =
																	currentUser?.id &&
																	String(currentUser.id) === String(review.from_user_id || "");
																return (
																	<div
																		key={review.id}
																		class="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40"
																	>
																		<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
																			<div class="min-w-0">
																				<div class="flex flex-wrap items-center gap-2">
																					<Pill tone="warning">
																						<Star class="h-3.5 w-3.5" />{" "}
																						{Number(review.score || 0).toFixed(1)}
																					</Pill>
																					<div class="text-sm font-semibold text-slate-900 dark:text-slate-100">
																						{review.reviewer_name || "Anonymous"}
																					</div>
																				</div>
																				<p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
																					{review.comment || "No comment provided."}
																				</p>
																				<div class="mt-2 text-xs text-slate-500 dark:text-slate-400">
																					{review.created_at
																						? new Date(review.created_at).toLocaleDateString()
																						: ""}
																				</div>
																			</div>
																			{canEdit ? (
																				<div class="flex items-center gap-2">
																					<button
																						type="button"
																						class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:text-sky-300"
																						onClick={async () => {
																							const score = setReviewEditModal({
																								open: true,
																								id: review.id,
																								score: Number(review.score || 5),
																								comment: review.comment || "",
																							});
																						}}
																					>
																						<Edit3 class="h-4 w-4" /> Edit
																					</button>
																					<button
																						type="button"
																						class="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-500/15 dark:border-rose-900/60 dark:text-rose-300"
																						onClick={() => {
																							setReviewDeleteId(review.id);
																						}}
																					>
																						<Trash2 class="h-4 w-4" /> Delete
																					</button>
																				</div>
																			) : null}
																		</div>
																	</div>
																);
															})}
														</div>
													) : (
														<div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/20 dark:text-slate-400">
															No reviews yet.
														</div>
													)}
												</SoftCard>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							)}
						</SoftCard>

						<CrmSummaryPanel targetId={user.id} />
					</main>
				</div>
			</div>

			{showGallery && products.length > 0 ? (
				<motion.div
					class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setShowGallery(false)}
					role="dialog"
					aria-modal="true"
					aria-label="Product gallery lightbox"
				>
					<motion.div
						class="relative flex h-[86vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl"
						initial={{ scale: 0.96, y: 20 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.96, y: 20 }}
						transition={{ type: "spring", stiffness: 250, damping: 24 }}
						onClick={(e) => e.stopPropagation()}
					>
						<div class="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
							<div class="min-w-0">
								<div class="truncate text-sm font-semibold">
									{products[galleryIndex]?.title || "Product"}
								</div>
								<div class="text-xs text-slate-400">
									{galleryIndex + 1} / {products.length}
								</div>
							</div>
							<div class="flex items-center gap-2">
								<button
									onClick={() => setGalleryIndex((i) => Math.max(0, i - 1))}
									disabled={galleryIndex === 0}
									class="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-40"
									aria-label="Previous image"
								>
									<ChevronLeft class="h-5 w-5" />
								</button>
								<button
									onClick={() => setGalleryIndex((i) => Math.min(products.length - 1, i + 1))}
									disabled={galleryIndex === products.length - 1}
									class="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-40"
									aria-label="Next image"
								>
									<ChevronRight class="h-5 w-5" />
								</button>
								<button
									onClick={() => setShowGallery(false)}
									class="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
									aria-label="Close gallery"
								>
									<X class="h-5 w-5" />
								</button>
							</div>
						</div>
						<div class="relative flex-1 overflow-hidden">
							<motion.div
								class="flex h-full w-full items-center justify-center"
								drag="x"
								dragControls={dragControls}
								dragConstraints={{ left: 0, right: 0 }}
								dragElastic={0.12}
								onDragEnd={(_, info) => {
									if (info.offset.x < -60) {
										setGalleryIndex((i) => Math.min(products.length - 1, i + 1));
									}
									if (info.offset.x > 60) {
										setGalleryIndex((i) => Math.max(0, i - 1));
									}
								}}
								onPointerDown={(e) => dragControls.start(e)}
							>
								<img
									src={products[galleryIndex]?.cover_image_public_url}
									alt={products[galleryIndex]?.title || "Gallery image"}
									class="max-h-full max-w-full select-none object-contain"
									draggable={false}
								/>
							</motion.div>
							<button
								onClick={() => setGalleryIndex((i) => Math.max(0, i - 1))}
								disabled={galleryIndex === 0}
								class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60 disabled:opacity-40"
								aria-label="Previous image"
							>
								<ArrowLeft class="h-5 w-5" />
							</button>
							<button
								onClick={() => setGalleryIndex((i) => Math.min(products.length - 1, i + 1))}
								disabled={galleryIndex === products.length - 1}
								class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60 disabled:opacity-40"
								aria-label="Next image"
							>
								<ArrowRight class="h-5 w-5" />
							</button>
						</div>
						<div class="border-t border-white/10 px-4 py-3 text-sm text-slate-300">
							<div class="flex flex-wrap items-center justify-between gap-3">
								<div class="truncate">
									{products[galleryIndex]?.description || "Gallery preview"}
								</div>
								<div class="text-xs text-slate-400">
									Counter: {galleryIndex + 1} / {products.length}
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			) : null}

			{reviewEditModal.open ? (
				<div
					class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
					onClick={() => setReviewEditModal({ ...reviewEditModal, open: false })}
					onKeyDown={(e) =>
						e.key === "Escape" && setReviewEditModal({ ...reviewEditModal, open: false })
					}
					tabIndex={-1}
				>
					<div
						class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 class="text-lg font-semibold text-slate-900 dark:text-white">Edit Review</h3>
						<div class="mt-4 space-y-4">
							<div>
								<label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
									Score (1-5)
								</label>
								<input
									type="number"
									min={1}
									max={5}
									value={reviewEditModal.score}
									onChange={(e) =>
										setReviewEditModal({
											...reviewEditModal,
											score: Number(e.target.value),
										})
									}
									class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
									Comment
								</label>
								<textarea
									value={reviewEditModal.comment}
									onChange={(e) =>
										setReviewEditModal({
											...reviewEditModal,
											comment: e.target.value,
										})
									}
									rows={3}
									class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
								/>
							</div>
						</div>
						<div class="mt-6 flex items-center justify-end gap-3">
							<button
								onClick={() => setReviewEditModal({ ...reviewEditModal, open: false })}
								class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
							>
								Cancel
							</button>
							<button
								onClick={async () => {
									try {
										await apiRequest(`/ratings/${reviewEditModal.id}`, {
											method: "PATCH",
											token,
											body: {
												score: reviewEditModal.score,
												comment: reviewEditModal.comment,
											},
										});
										await loadRatings();
									} catch (err) {
										logger.warn("API error:", err);
									}
									setReviewEditModal({
										open: false,
										id: null,
										score: 5,
										comment: "",
									});
								}}
								class="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			) : null}

			{reviewDeleteId ? (
				<div
					class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
					onClick={() => setReviewDeleteId(null)}
					onKeyDown={(e) => e.key === "Escape" && setReviewDeleteId(null)}
					tabIndex={-1}
				>
					<div
						class="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 class="text-lg font-semibold text-slate-900 dark:text-white">Delete Review</h3>
						<p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
							Are you sure you want to delete this review? This action cannot be undone.
						</p>
						<div class="mt-6 flex items-center justify-end gap-3">
							<button
								onClick={() => setReviewDeleteId(null)}
								class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
							>
								Cancel
							</button>
							<button
								onClick={async () => {
									try {
										await apiRequest(`/ratings/${reviewDeleteId}`, {
											method: "DELETE",
											token,
										});
										await loadRatings();
									} catch (err) {
										logger.warn("API error:", err);
									}
									setReviewDeleteId(null);
								}}
								class="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
