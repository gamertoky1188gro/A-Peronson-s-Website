/*
  Route: /buying-house/:id
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Render Buying House profile with enterprise-style trust and collaboration context.
    - Show verification/trust summary and credibility meter.
    - Show organization/agents and relationship actions (depending on backend data).

  Key API endpoints:
    - GET /api/profiles/:id
    - GET /api/ratings/profiles/user::id (public ratings summary)
*/

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
	BadgeCheck,
	Building2,
	CalendarDays,
	ChevronDown,
	ChevronLeft,
	ClipboardList,
	Edit3,
	Eye,
	Globe2,
	Handshake,
	Heart,
	Image as ImageIcon,
	MapPin,
	MessageSquare,
	Network,
	Package,
	Phone,
	Plus,
	Rocket,
	Search,
	ShieldCheck,
	Sparkles,
	Star,
	Trash2,
	Users,
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { useNavigate, useParams } from "react-router-dom";
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

function InfoTile({ label, value, icon: Icon }) {
	return (
		<div class="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
			<div class="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
				{Icon ? <Icon size={14} class="text-sky-500" /> : null}
				<span>{label}</span>
			</div>
			<div class="text-sm font-semibold text-slate-900 dark:text-white">{value ?? "—"}</div>
		</div>
	);
}

function ActionButton({ children, icon: Icon, onClick, variant = "primary", disabled, loading }) {
	const styles = {
		primary:
			"bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
		soft: "bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-950/60",
		ghost:
			"bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
		premium:
			"bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 text-white shadow-lg shadow-sky-500/20 hover:brightness-110",
		danger:
			"bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50",
	};
	return (
		<button
			onClick={onClick}
			disabled={disabled || loading}
			class={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-sky-400/50 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]}`}
		>
			{loading ? (
				<ThreeDot variant="bounce" color="#6100ff" size="small" text="" textColor="" />
			) : Icon ? (
				<Icon size={16} />
			) : null}
			<span>{children}</span>
		</button>
	);
}

function EmptyState({ icon: Icon, title, description, action }) {
	return (
		<div class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/80 bg-slate-50/70 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
			{Icon ? <Icon size={28} class="mb-3 text-sky-500" /> : null}
			<div class="text-base font-semibold text-slate-900 dark:text-white">{title}</div>
			{description ? (
				<div class="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
					{description}
				</div>
			) : null}
			{action ? <div class="mt-5">{action}</div> : null}
		</div>
	);
}

function BadgeList({ items = [] }) {
	if (items.length === 0) {
		return <span class="text-sm text-slate-500 dark:text-slate-400">—</span>;
	}
	return (
		<div class="flex flex-wrap gap-2">
			{items.map((item) => (
				<Pill key={item} tone="info">
					{item}
				</Pill>
			))}
		</div>
	);
}

function TimelineItem({ item, index }) {
	const color =
		item.kind === "success"
			? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
			: item.kind === "warn"
				? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
				: item.kind === "danger"
					? "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300"
					: "border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300";
	return (
		<div class="relative flex gap-4">
			<div class="flex flex-col items-center">
				<div
					class={`mt-1 flex h-10 w-10 items-center justify-center rounded-2xl border text-xs font-semibold ${color}`}
				>
					{index + 1}
				</div>
				<div class="h-full w-px bg-slate-200 dark:bg-slate-800" />
			</div>
			<div class="pb-6">
				<div class="flex flex-wrap items-center gap-2">
					<div class="font-semibold text-slate-900 dark:text-white">{item.title}</div>
					<Pill
						tone={
							item.kind === "success"
								? "success"
								: item.kind === "warn"
									? "warning"
									: item.kind === "danger"
										? "danger"
										: "info"
						}
					>
						{item.type || "Update"}
					</Pill>
				</div>
				<div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</div>
				<div class="mt-2 text-xs text-slate-400 dark:text-slate-500">{item.time || ""}</div>
			</div>
		</div>
	);
}

function Lightbox({ open, image, onClose }) {
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && onClose?.();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	if (!open) {
		return null;
	}
	return (
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				class="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					class="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
					onClick={onClose}
				>
					<X size={18} />
				</button>
				<img src={image} alt="Product preview" class="max-h-[92vh] w-full object-contain" />
			</div>
		</div>
	);
}

export default function BuyingHouseProfile() {
	const { id } = useParams();
	const navigate = useNavigate();
	const token = useMemo(() => getToken(), []);
	const viewer = getCurrentUser();
	const { isPremium: isPremiumFromApi } = usePremiumCheck();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [profile, setProfile] = useState(null);
	const [ratingSummary, setRatingSummary] = useState(null);
	const [certification, setCertification] = useState(null);
	const [notice, setNotice] = useState("");

	const [activeTab, setActiveTab] = useState("overview");
	const [products, setProducts] = useState([]);
	const [productsCursor, setProductsCursor] = useState(0);
	const [productsNext, setProductsNext] = useState(null);
	const [loadingProducts, setLoadingProducts] = useState(false);
	const [profileBoost, setProfileBoost] = useState(null);

	const [partnerNetwork, setPartnerNetwork] = useState(null);
	const [loadingNetwork, setLoadingNetwork] = useState(false);
	const [partnerRequestLoading, setPartnerRequestLoading] = useState(false);
	const [searchProducts, setSearchProducts] = useState("");
	const [lightbox, setLightbox] = useState({ open: false, image: "" });
	const reduceMotion = useReducedMotion();
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
	const [reviewEditModal, setReviewEditModal] = useState({
		open: false,
		id: null,
		score: 5,
		comment: "",
	});
	const [reviewDeleteId, setReviewDeleteId] = useState(null);
	const [relationshipFeedback, setRelationshipFeedback] = useState(null);
	const viewerPerms = profile?.viewer_permissions || {
		is_self: false,
		is_admin: false,
	};
	const isBoosted = Boolean(profileBoost);
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
			if (data?.user?.role && data.user.role !== "buying_house") {
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

	const loadPartnerNetwork = useCallback(async () => {
		if (!id) {
			return;
		}
		setLoadingNetwork(true);
		try {
			const data = await apiRequest(`/profiles/${encodeURIComponent(id)}/partner-network`, {
				token,
			});
			setPartnerNetwork(data || null);
		} catch (err) {
			logger.warn("API error:", err);
			setPartnerNetwork(null);
		} finally {
			setLoadingNetwork(false);
		}
	}, [id, token]);

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
				if (data?.user?.role && data.user.role !== "buying_house") {
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
			metadata: { role: user.role || "buying_house" },
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
		if (activeTab !== "products") {
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

	useEffect(() => {
		if (activeTab !== "partner") {
			return;
		}
		if (partnerNetwork) {
			return;
		}
		if (!id) {
			return;
		}
		let cancelled = false;

		queueMicrotask(() => {
			if (!cancelled) {
				setLoadingNetwork(true);
			}
		});

		apiRequest(`/profiles/${encodeURIComponent(id)}/partner-network`, { token })
			.then((data) => {
				if (!cancelled) {
					setPartnerNetwork(data || null);
				}
			})
			.catch((err) => {
				logger.warn("API error:", err);
				if (!cancelled) {
					setPartnerNetwork(null);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoadingNetwork(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [activeTab, partnerNetwork, id, token]);

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

	async function requestPartner() {
		if (!id) {
			return;
		}
		setNotice("");
		setPartnerRequestLoading(true);
		try {
			await apiRequest("/partners/requests", {
				method: "POST",
				token,
				body: { targetAccountId: id },
			});
			setNotice("Partner request sent.");
		} catch (err) {
			setNotice(err.message || "Unable to send partner request.");
		} finally {
			setPartnerRequestLoading(false);
		}
	}

	async function requestRelationship() {
		if (!id) {
			return;
		}
		setRelationshipFeedback(null);
		try {
			const tokenValue = getToken();
			await apiRequest("/relationships", {
				method: "POST",
				token: tokenValue,
				body: { recipient_id: id, recipient_type: "user" },
			});
			setRelationshipFeedback("Business relationship request sent.");
		} catch (err) {
			setRelationshipFeedback(err.message || "Failed to send relationship request.");
		}
	}

	async function requestLicense() {
		if (!id) {
			return;
		}
		setRelationshipFeedback(null);
		try {
			const tokenValue = getToken();
			await apiRequest("/license-requests", {
				method: "POST",
				token: tokenValue,
				body: { recipient_id: id, license_name: user?.profile?.industry || "General" },
			});
			setRelationshipFeedback("License request sent.");
		} catch (err) {
			setRelationshipFeedback(err.message || "Failed to send license request.");
		}
	}

	const canRequestPartner =
		viewer && ["factory", "buying_house", "admin"].includes(viewer.role) && !viewerPerms.is_self;

	const filteredProducts = useMemo(() => {
		if (typeof searchProducts !== "string") {
			return products;
		}
		const q = searchProducts.trim().toLowerCase();
		if (!q) {
			return products;
		}
		return products.filter((p) => {
			const hay = [p.title, p.category, p.description, p.status]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return hay.includes(q);
		});
	}, [products, searchProducts]);

	if (loading) {
		return <NeonAtom fill={true} />;
	}
	if (error) {
		return (
			<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_30%),linear-gradient(180deg,#eff9ff_0%,#ffffff_35%,#f8fbff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_35%),linear-gradient(180deg,#050816_0%,#07111f_40%,#020617_100%)] p-6 text-rose-700 dark:text-rose-200">
				{error}
			</div>
		);
	}
	if (!user) {
		return (
			<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_30%),linear-gradient(180deg,#eff9ff_0%,#ffffff_35%,#f8fbff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_35%),linear-gradient(180deg,#050816_0%,#07111f_40%,#020617_100%)] p-6 text-slate-700 dark:text-slate-200">
				Profile not found.
			</div>
		);
	}

	const roleLabel = user?.role
		? user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
		: "Buying House";
	const displayName = user?.name || roleLabel;
	const country = user?.profile?.country || "—";
	const industry = user?.profile?.industry || "";
	const organization =
		user?.profile?.organization_name || user?.profile?.organization || user?.name || "—";
	const avg = ratingSummary?.aggregate?.average_score ?? 0;
	const totalRatings = ratingSummary?.aggregate?.total_count ?? 0;
	const partnerTotal = partnerNetwork?.total_connected ?? profile?.counts?.connected_factories ?? 0;
	const requestsCount = profile?.counts?.requests ?? 0;
	const coverImage = user?.profile?.cover_image_url;
	const avatarImage = user?.profile?.profile_image;
	const capacity = user?.profile?.sourcing_capacity || "—";
	const companiesWorked = user?.profile?.companies_worked_with || [];

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

	const timeline = profile?.crm_timeline || profile?.timeline || [];

	return (
		<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_30%),linear-gradient(180deg,#eff9ff_0%,#ffffff_35%,#f8fbff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_35%),linear-gradient(180deg,#050816_0%,#07111f_40%,#020617_100%)] dark:text-white">
			<Lightbox
				open={lightbox.open}
				image={lightbox.image}
				onClose={() => setLightbox({ open: false, image: "" })}
			/>

			<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
					<button
						onClick={() => navigate(-1)}
						class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:text-sky-300"
					>
						<ChevronLeft class="h-4 w-4" /> Back
					</button>
					<div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
						<Sparkles size={13} /> Enterprise {roleLabel} profile
					</div>
				</div>

				<div class="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_-25px_rgba(2,132,199,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
					<div class="relative">
						<div class="h-56 w-full bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600 sm:h-64">
							{coverImage ? (
								<img
									src={coverImage}
									alt="Cover"
									class="h-full w-full object-cover opacity-80 mix-blend-overlay"
								/>
							) : null}
						</div>
						<div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
						<div class="absolute left-4 right-4 top-4 flex items-start justify-between gap-4 sm:left-6 sm:right-6">
							<div class="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
								<Building2 size={13} /> {roleLabel}
							</div>
							<div class="flex items-center gap-2">
								{user?.verified ? (
									<Pill tone="success">Verified</Pill>
								) : (
									<Pill tone="warning">Unverified</Pill>
								)}
								{isPremium ? <Pill tone="premium">Premium</Pill> : null}
							</div>
						</div>
						<div class="absolute bottom-0 left-0 right-0 px-4 pb-4 sm:px-6 sm:pb-6">
							<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
								<div class="flex flex-col gap-4 sm:flex-row sm:items-end">
									<AvatarFallback name={displayName} imageUrl={avatarImage} />
									<div class="pb-1">
										<div class="flex flex-wrap items-center gap-3">
											<h1 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
												{displayName}
											</h1>
											{user?.verified ? <BadgeCheck class="text-sky-300" size={22} /> : null}
										</div>
										<div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-100/90">
											<span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
												<User2 size={13} /> {roleLabel}
											</span>
											<span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
												<MapPin size={13} /> {country}
											</span>
											<span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
												<Star size={13} /> {avg ? `${avg.toFixed(1)} / 5` : "No rating"}
											</span>
										</div>
									</div>
								</div>
								<div class="flex flex-wrap items-center gap-2">
									<ActionButton icon={Phone} variant="soft" onClick={contact}>
										Contact
									</ActionButton>
									<ActionButton icon={Heart} variant="ghost" onClick={follow}>
										{relationship.following ? "Following" : "Follow"}
									</ActionButton>
									<ActionButton icon={Handshake} variant="primary" onClick={connect}>
										{relationship.friend_status === "friends"
											? "Connected"
											: relationship.friend_status === "requested"
												? "Requested"
												: "Connect"}
									</ActionButton>
									{canRequestPartner ? (
										<ActionButton
											icon={Plus}
											variant="premium"
											onClick={requestPartner}
											loading={partnerRequestLoading}
										>
											Request partner network connection
										</ActionButton>
									) : null}
									{notice ? <p class="text-xs text-sky-600">{notice}</p> : null}
									{viewer?.id === user?.id ? null : (
										<>
											<ActionButton icon={Handshake} variant="soft" onClick={requestRelationship}>
												Confirm Business Relationship
											</ActionButton>
											<ActionButton icon={ShieldCheck} variant="soft" onClick={requestLicense}>
												Request License
											</ActionButton>
										</>
									)}
									{relationshipFeedback ? (
										<p class="w-full text-xs text-sky-600">{relationshipFeedback}</p>
									) : null}
								</div>
							</div>
						</div>
					</div>

					<div class="grid gap-6 p-4 lg:grid-cols-[1.7fr_0.95fr] lg:p-6">
						<div class="w-full space-y-6">
							<div class="rounded-3xl border border-slate-200/80 bg-white/90 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
								<div class="flex flex-wrap gap-2">
									{["overview", "partner", "products", "work", "reviews"].map((key) => {
										const label =
											key === "overview"
												? "Overview"
												: key === "partner"
													? "Partner network"
													: key === "products"
														? "Products"
														: key === "work"
															? "Work history"
															: "Reviews";
										const active = activeTab === key;
										return (
											<button
												key={key}
												onClick={() => setActiveTab(key)}
												class={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-all ${active ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
											>
												{label}
											</button>
										);
									})}
								</div>
							</div>

							{error ? (
								<div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-200">
									{error}
								</div>
							) : null}

							{activeTab === "overview" ? (
								<div class="space-y-5">
									<SoftCard>
										<SectionTitle
											icon={Eye}
											title="About"
											subtitle="Business overview and positioning."
										/>
										<p class="text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
											{user?.profile?.about || "No description added yet."}
										</p>
									</SoftCard>

									{hasBrandKit ? (
										<SoftCard>
											<SectionTitle
												icon={Eye}
												title="Brand Kit"
												subtitle="Visual identity assets."
											/>
											<div class="rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/40">
												<div class="flex items-center gap-3">
													<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20">
														{brandProfile.brand_logo_url ? (
															<img
																src={brandProfile.brand_logo_url}
																alt="Brand"
																class="h-full w-full object-cover rounded-2xl"
															/>
														) : (
															<Sparkles size={18} />
														)}
													</div>
													<div>
														<div class="font-semibold text-slate-900 dark:text-white">
															{brandProfile.brand_name || displayName}
														</div>
														<div class="text-sm text-slate-500 dark:text-slate-400">
															{brandProfile.brand_tagline || "Premium brand presentation"}
														</div>
													</div>
												</div>
											</div>
										</SoftCard>
									) : null}

									{isPremium && hasAccountManager ? (
										<SoftCard>
											<SectionTitle
												icon={Users}
												title="Account manager"
												subtitle="Relationship ownership."
											/>
											<div class="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
												<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 text-lg font-semibold text-white">
													{brandProfile.account_manager_name?.charAt(0) || "?"}
												</div>
												<div>
													<div class="text-sm font-semibold text-slate-900 dark:text-white">
														{brandProfile.account_manager_name || "Unassigned"}
													</div>
													<div class="mt-1 text-sm text-slate-500 dark:text-slate-400">
														{brandProfile.account_manager_email || "No manager email available"}
													</div>
												</div>
											</div>
										</SoftCard>
									) : null}

									<div class="grid gap-4 lg:grid-cols-2">
										<InfoTile label="Industry" value={industry} icon={Globe2} />
										<InfoTile label="Organization" value={organization} icon={Building2} />
										<InfoTile
											label="Rating"
											value={avg ? `${avg.toFixed(1)} / 5` : "—"}
											icon={Star}
										/>
										<InfoTile label="Country" value={country} icon={MapPin} />
									</div>

									<SoftCard>
										<SectionTitle
											icon={BadgeCheck}
											title="Certifications"
											subtitle="Compliance and commercial credentials."
										/>
										<BadgeList items={user?.profile?.certifications || []} />
									</SoftCard>

									<div class="grid gap-4 sm:grid-cols-2">
										<InfoTile label="Sourcing capacity" value={capacity} icon={ClipboardList} />
										<InfoTile
											label="Order completion"
											value={certification?.status || "—"}
											icon={BadgeCheck}
										/>
									</div>

									<SoftCard>
										<SectionTitle
											icon={Building2}
											title="Companies worked with"
											subtitle="Selected partners and references."
										/>
										{companiesWorked.length > 0 ? (
											<div class="flex flex-wrap gap-2">
												{companiesWorked.map((company, idx) => (
													<Pill
														key={idx}
														tone={idx % 3 === 0 ? "info" : idx % 3 === 1 ? "success" : "default"}
													>
														{company.name || company}
													</Pill>
												))}
											</div>
										) : (
											<p class="text-sm text-slate-500 dark:text-slate-400">
												No companies listed yet.
											</p>
										)}
									</SoftCard>
								</div>
							) : null}

							{activeTab === "partner" ? (
								<div class="space-y-4">
									<SoftCard>
										<SectionTitle
											icon={Network}
											title="Connected factories"
											subtitle={`Total: ${partnerTotal}`}
										/>
										{loadingNetwork ? (
											<div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
												<ThreeDot
													variant="bounce"
													color="#6100ff"
													size="small"
													text=""
													textColor=""
												/>{" "}
												Loading partner network...
											</div>
										) : partnerNetwork &&
											profile?.partner_network_private &&
											!(viewerPerms.is_self || viewerPerms.is_admin) ? (
											<div class="rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/60 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
												Factory list is private; only the organization owner/admin can see it.
											</div>
										) : partnerNetwork?.factories?.length > 0 ? (
											<div class="grid gap-3 md:grid-cols-2">
												{partnerNetwork.factories.map((factory) => (
													<div
														key={factory.id || factory.name}
														class="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60"
													>
														<div class="flex items-center justify-between gap-3">
															<div>
																<div class="font-semibold text-slate-900 dark:text-white">
																	{factory.name || "Factory"}
																</div>
																<div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
																	{factory.country || "Factory partner"}
																</div>
															</div>
															{factory.verified ? (
																<Pill tone="success">Verified</Pill>
															) : (
																<span class="text-sm text-slate-400">--</span>
															)}
														</div>
													</div>
												))}
											</div>
										) : (
											<EmptyState
												icon={Network}
												title="No connected factories yet."
												description="Partner network data will appear once connections are established."
											/>
										)}
									</SoftCard>
								</div>
							) : null}

							{activeTab === "products" ? (
								<div class="space-y-4">
									<SoftCard
										title="Products"
										subtitle="Deferred loading; products load only when this tab is active"
									>
										<div class="space-y-4">
											<div class="flex items-center gap-2">
												<div class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
													<Search size={16} class="text-slate-400" />
													<input
														value={searchProducts}
														onChange={(e) => setSearchProducts(e.target.value)}
														placeholder="Search products"
														class="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100"
													/>
												</div>
											</div>
											{loadingProducts && products.length === 0 ? (
												<div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
													<ThreeDot
														variant="bounce"
														color="#6100ff"
														size="small"
														text=""
														textColor=""
													/>{" "}
													Loading products...
												</div>
											) : filteredProducts.length > 0 ? (
												<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
													{filteredProducts.map((product) => (
														<div
															key={product.id || product.title}
															class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
														>
															<div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 dark:from-sky-950/50 dark:via-cyan-950/40 dark:to-blue-950/40">
																{product.cover_image_public_url ? (
																	<img
																		src={product.cover_image_public_url}
																		alt={product.title || "Product"}
																		class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
																		onClick={() =>
																			setLightbox({
																				open: true,
																				image: product.cover_image_public_url,
																			})
																		}
																	/>
																) : (
																	<div class="flex h-full items-center justify-center text-sky-400">
																		<ImageIcon size={40} />
																	</div>
																)}
																<div class="absolute left-3 top-3">
																	<Pill
																		tone={
																			product.status === "active"
																				? "success"
																				: product.status === "draft"
																					? "warning"
																					: "default"
																		}
																	>
																		{product.status || "Listed"}
																	</Pill>
																</div>
															</div>
															<div class="space-y-3 p-4">
																<div>
																	<div class="text-base font-semibold text-slate-900 dark:text-white">
																		{product.title || "Untitled product"}
																	</div>
																	<div class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
																		{product.category || "Category"}
																	</div>
																</div>
																<div class="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
																	<span class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-900">
																		MOQ: {product.moq || "--"}
																	</span>
																	<span class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-900">
																		Lead time: {product.lead_time_days || "--"}
																	</span>
																</div>
																<p class="text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-3">
																	{product.description || "No description available."}
																</p>
															</div>
														</div>
													))}
												</div>
											) : (
												<EmptyState
													icon={Package}
													title="No products found."
													description="This buying house has not published product listings yet, or the current filters returned no results."
												/>
											)}
											<div class="flex items-center justify-center">
												{productsNext !== null && !loadingProducts ? (
													<button
														onClick={() => loadProducts({ reset: false })}
														class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300"
													>
														Load more <ChevronDown class="h-4 w-4" />
													</button>
												) : null}
											</div>
										</div>
									</SoftCard>
								</div>
							) : null}

							{activeTab === "work" ? (
								<SoftCard>
									<SectionTitle
										icon={ClipboardList}
										title="Work history"
										subtitle="Commercial and operational history."
									/>
									{companiesWorked.length > 0 ? (
										<div class="space-y-3">
											{companiesWorked.map((company, idx) => (
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
														<CalendarDays class="h-4 w-4" /> {company.period || "Ongoing"}
													</div>
												</div>
											))}
										</div>
									) : (
										<EmptyState
											icon={CalendarDays}
											title="No work history yet."
											description="Historical milestones and projects will appear here when available."
										/>
									)}
								</SoftCard>
							) : null}

							{activeTab === "reviews" ? (
								<div class="space-y-4">
									<SoftCard>
										<SectionTitle
											icon={Star}
											title="Rating summary"
											subtitle="Average score and review volume."
										/>
										<div class="grid gap-4 md:grid-cols-3">
											<Metric label="Average rating" value={`${avg.toFixed(1)} / 5`} />
											<Metric label="Reviews" value={totalRatings} />
											<Metric
												label="Confidence"
												value={ratingSummary?.aggregate?.reliability?.confidence || "low"}
												helper="Aggregate reliability"
											/>
										</div>
										<div class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
											<strong>Review policy:</strong> Reviews can only be edited or deleted by the
											person who wrote them. Profile owners cannot delete reviews to maintain
											transparency and trust.
										</div>
									</SoftCard>
									<SoftCard>
										<SectionTitle
											icon={MessageSquare}
											title="Recent reviews"
											subtitle="Public feedback from past collaborations."
										/>
										{(ratingSummary?.recent_reviews || []).length > 0 ? (
											<div class="space-y-3">
												{(ratingSummary.recent_reviews || []).map((review) => {
													const isAuthor = String(review.from_user_id) === String(user?.id);
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
																{isAuthor ? (
																	<div class="flex items-center gap-2">
																		<button
																			type="button"
																			class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:text-sky-300"
																			onClick={() => {
																				setReviewEditModal({
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
											<EmptyState
												icon={MessageSquare}
												title="No reviews yet."
												description="This profile has not received any public reviews."
											/>
										)}
									</SoftCard>
								</div>
							) : null}

							<SoftCard>
								<SectionTitle
									icon={ClipboardList}
									title="CRM timeline"
									subtitle="Shared component for relationship tracking."
								/>
								{timeline.length > 0 ? (
									<div class="space-y-1">
										{timeline.map((item, idx) => (
											<TimelineItem key={item.id || idx} item={item} index={idx} />
										))}
									</div>
								) : (
									<EmptyState
										icon={ClipboardList}
										title="No CRM timeline entries yet."
										description="Tracking notes, outreach, and relationship events will be displayed here."
									/>
								)}
							</SoftCard>

							<CrmSummaryPanel targetId={user.id} />
						</div>

						<aside class="space-y-4">
							<SoftCard>
								<SectionTitle
									icon={Building2}
									title="Profile snapshot"
									subtitle="Trust and commercial indicators."
								/>
								<div class="grid grid-cols-1 gap-3">
									<InfoTile label="Industry" value={industry} icon={Globe2} />
									<InfoTile label="Organization" value={organization} icon={Building2} />
									<InfoTile
										label="Rating"
										value={avg ? `${avg.toFixed(1)} / 5` : "—"}
										icon={Star}
									/>
									<InfoTile label="Partner factories" value={partnerTotal} icon={Network} />
									<InfoTile label="Requests" value={requestsCount} icon={Handshake} />
								</div>
							</SoftCard>

							<SoftCard>
								<SectionTitle
									icon={ShieldCheck}
									title="Verification panel"
									subtitle="Shared trust component."
								/>
								<VerificationPanel summary={verification} />
							</SoftCard>

							<SoftCard>
								<SectionTitle
									icon={BadgeCheck}
									title="Order completion certification"
									subtitle="Shared pattern for order delivery confidence."
								/>
								<div class="space-y-3">
									<div class="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
										<ShieldCheck class="text-sky-500" size={18} />
										<div>
											<div class="text-sm font-semibold text-slate-900 dark:text-white">
												Verified profile status
											</div>
											<div class="text-xs text-slate-500 dark:text-slate-400">
												{certification?.status || "Unknown"}
											</div>
										</div>
									</div>
									<div class="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
										<BadgeCheck class="text-emerald-500" size={18} />
										<div>
											<div class="text-sm font-semibold text-slate-900 dark:text-white">
												Signed contracts
											</div>
											<div class="text-xs text-slate-500 dark:text-slate-400">
												{certification?.signed_contracts ?? 0}
											</div>
										</div>
									</div>
								</div>
							</SoftCard>
						</aside>
					</div>
				</div>
			</div>

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
