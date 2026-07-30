/*
  Route: /feed
  Access: Protected (login required)
  Using the exact template layout with glass-morphism theme
*/

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
	BadgeCheck,
	Bell,
	BriefcaseBusiness,
	ChevronDown,
	Filter,
	LayoutGrid,
	Plus,
	Search,
	Upload,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import FeedItemCard from "../components/feed/FeedItemCard.jsx";
import PostDetailModal from "../components/feed/PostDetailModal.jsx";
import ReportModal from "../components/feed/ReportModal.jsx";
import NeonAtom from "../components/ui/NeonAtom.jsx";
import useLocalStorageState from "../hooks/useLocalStorageState.js";
import { apiRequest, fetchCurrentUser, getCurrentUser, getToken } from "../lib/auth.js";
import { trackClientEvent } from "../lib/events.js";
import { subscribeFeedRealtime } from "../lib/feedRealtime.js";
import { recordLeadSource } from "../lib/leadSource.js";
import { logger } from "../lib/logger.js";
import usePageMeta from "../lib/usePageMeta.js";

const Motion = motion;

const TABS = ["All", "Buyer Requests", "Company Products", "Posts", "Unique OFF"];

const DEFAULT_FEED_CONFIG = {
	tabs: ["All", "Buyer Requests", "Company Products", "Posts", "Unique OFF"],
	labels: {
		feed_center: "Feed Center",
		premium_badge: "Premium moderation dashboard",
		quick_actions: "Quick actions",
		live_status: "Live",
		search: "Search",
		search_placeholder: "Search posts, buyers...",
		categories: "All categories",
		hero_title: "Feed Center",
		hero_description:
			"Browse buyer requests, company products, and posts from one unified workspace.",
		stats: {
			buyer_requests: "Buyer Requests",
			company_products: "Company Products",
			feed_posts: "Feed Posts",
		},
	},
	messages: {
		share_copied: "Share link copied to clipboard.",
		report_submitted: "Report submitted. Thank you.",
		interest_expressed: "Interest expressed.",
		rate_limited: "Please wait a few seconds before reporting again.",
		all_caught_up: "You're all caught up.",
		no_results: "No posts matched your filters.",
		load_failed: "Failed to load feed",
	},
};

// ====== UTILITIES ======
function cx(...classes) {
	return classes.filter(Boolean).join(" ");
}

function formatRelativeTime(value) {
	if (!value) {
		return "";
	}
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	const diffMs = Date.now() - date.getTime();
	const diffMinutes = Math.floor(diffMs / 60_000);
	if (diffMinutes < 1) {
		return "Just now";
	}
	if (diffMinutes < 60) {
		return `${diffMinutes}m ago`;
	}
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}h ago`;
	}
	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays}d ago`;
}

function buildFeedLeadLabel(item) {
	const title = String(item?.title || "").trim();
	if (title) {
		return title;
	}
	const category = String(item?.category || "").trim();
	if (category) {
		return category;
	}
	const content = String(item?.content || "")
		.replace(/\s+/g, " ")
		.trim();
	if (content) {
		return content.slice(0, 80);
	}
	const author = String(item?.author?.name || "").trim();
	return author ? `${author} update` : "Feed post";
}

function normalizeFeedItem(raw) {
	const entityType =
		raw.feed_type === "buyer_request"
			? "buyer_request"
			: raw.feed_type === "user_feed_post"
				? "user_feed_post"
				: "company_product";
	const isBuyerRequest = entityType === "buyer_request";
	const isUserFeedPost = entityType === "user_feed_post";
	const authorId = raw.buyer_id || raw.company_id || raw.user_id || raw.author_id || "";
	const accountType =
		raw.author?.role ||
		raw.company_role ||
		(isBuyerRequest ? "buyer" : isUserFeedPost ? "member" : "factory");
	const rolePath =
		raw.author?.rolePath ||
		(accountType === "buying_house"
			? "buying-house"
			: accountType === "buyer"
				? "buyer"
				: accountType === "factory"
					? "factory"
					: "");

	return {
		id: raw.id,
		entityType,
		author: {
			id: authorId,
			name:
				raw.author?.name ||
				raw.company_name ||
				raw.organization_name ||
				raw.org ||
				raw.name ||
				"Unknown",
			accountType: accountType
				? String(accountType).replaceAll("_", " ")
				: isBuyerRequest
					? "Buyer"
					: "Company",
			rolePath,
			avatar_url: raw.author?.avatar_url || "",
		},
		verified: Boolean(raw.author?.verified || raw.verified),
		createdAt: formatRelativeTime(raw.created_at),
		content: isBuyerRequest
			? raw.custom_description || ""
			: isUserFeedPost
				? raw.caption || ""
				: raw.description || "",
		title: raw.title || "",
		descriptionMarkdown: raw.description_markdown || "",
		category: raw.category || "",
		tags: [raw.category, raw.material, ...(Array.isArray(raw.hashtags) ? raw.hashtags : [])].filter(
			Boolean,
		),
		material: raw.material || "",
		quantity: raw.quantity || "",
		timelineDays: raw.timeline_days || "",
		shippingTerms: raw.shipping_terms || "",
		certifications: Array.isArray(raw.certifications_required) ? raw.certifications_required : [],
		moq: raw.moq || "",
		leadTimeDays: raw.lead_time_days || "",
		hasVideo: Boolean(
			raw.hasVideo ||
				(!raw.video_restricted && raw.video_review_status === "approved" && raw.video_url),
		),
		media: Array.isArray(raw.media) ? raw.media : [],
		ctaText: raw.cta_text || "",
		ctaUrl: raw.cta_url || "",
		mentions: Array.isArray(raw.mentions) ? raw.mentions : [],
		links: Array.isArray(raw.links) ? raw.links : [],
		link_previews: Array.isArray(raw.link_previews) ? raw.link_previews : [],
		productTags: Array.isArray(raw.product_tags) ? raw.product_tags : [],
		locationTag: raw.location_tag || "",
		emojis: Array.isArray(raw.emojis) ? raw.emojis : [],
		discussionActive: Boolean(raw.discussion_active),
		feedMetadata: raw.feed_metadata || {},
		priorityActive: Boolean(raw.priority_active),
		certificationStatus: raw.order_certification_status || "",
	};
}

async function copyToClipboard(text) {
	if (!text) {
		return false;
	}
	if (navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(text);
		return true;
	}
	const el = document.createElement("textarea");
	el.value = text;
	el.setAttribute("readonly", "true");
	el.style.position = "fixed";
	el.style.left = "-9999px";
	document.body.appendChild(el);
	el.select();
	const ok = document.execCommand("copy");
	document.body.removeChild(el);
	return ok;
}

// ====== UI COMPONENTS ======
const Pill = memo(function Pill({ children, active = false, onClick }) {
	return (
		<button
			onClick={onClick}
			className={cx(
				"inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
				active
					? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
					: "bg-white/70 text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800",
			)}
		>
			{children}
		</button>
	);
});

const StatCard = memo(function StatCard({ icon, label, value, accent = "sky" }) {
	return (
		<div className="rounded-3xl border border-white/60 bg-white/80 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
			<div className="flex items-center justify-between gap-2">
				<div className="flex-1">
					<p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
						{label}
					</p>
					<p className="text-xl font-semibold text-slate-900 dark:text-white">{value}</p>
				</div>
				<div
					className={cx(
						"flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
						accent === "sky" && "bg-sky-500/15 text-sky-600 dark:text-sky-400",
						accent === "blue" && "bg-blue-500/15 text-blue-600 dark:text-blue-400",
						accent === "indigo" && "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
					)}
				>
					{icon}
				</div>
			</div>
		</div>
	);
});

const ActionButton = memo(function ActionButton({ icon, label, onClick }) {
	return (
		<button
			onClick={onClick}
			className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-500 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-sky-500 dark:hover:text-white"
		>
			{icon}
			{label}
		</button>
	);
});

// ====== MAIN COMPONENT ======
export default function MainFeed() {
	usePageMeta({
		title: "Feed — GarTexHub",
		description:
			"Stay updated with the latest textile and garment industry posts, product launches, and market insights on GarTexHub.",
		url: "/feed",
	});

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = useMemo(() => getToken(), []);
	const sessionUser = getCurrentUser();
	const userId = sessionUser?.id || "user";
	const uniqueKey = `gartexhub_unique:${userId}`;

	const [user, setUser] = useState(sessionUser);
	const [feedConfig, setFeedConfig] = useState(DEFAULT_FEED_CONFIG);
	const [activeType, setActiveType] = useState(feedConfig.tabs[0]);
	const [activeCategory, setActiveCategory] = useState(feedConfig.labels.categories);
	const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

	useEffect(() => {
		const onResize = () => setIsLargeScreen(window.innerWidth >= 1024);
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [unique, setUnique] = useLocalStorageState(uniqueKey, false);
	const [search, setSearch] = useState("");

	const [items, setItems] = useState([]);
	const [tags, setTags] = useState([]);
	const [nextCursor, setNextCursor] = useState(0);
	const nextCursorRef = useRef(0);
	const setNextCursorBoth = useCallback((val) => {
		setNextCursor(val);
		nextCursorRef.current = val;
	}, []);
	const [pageLoading, setPageLoading] = useState(true);
	const loadFlags = useRef({ user: false, config: false, feed: false });
	const markLoaded = useCallback((key) => {
		loadFlags.current[key] = true;
		if (loadFlags.current.user && loadFlags.current.config && loadFlags.current.feed) {
			setPageLoading(false);
		}
	}, []);

	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState({ type: "", message: "" });
	const [filtersOpen, setFiltersOpen] = useState(false);

	const [commentsItem, setCommentsItem] = useState(null);
	const [reportItem, setReportItem] = useState(null);
	const [reportCooldowns, setReportCooldowns] = useState({});
	const [reportBusy, setReportBusy] = useState(false);
	const [expressBusyId, setExpressBusyId] = useState("");
	const [claimedRequestId, setClaimedRequestId] = useState("");

	const liveRef = useRef({ token, activeCategory, activeType, unique, feedConfig, nextCursor: nextCursorRef.current });
	liveRef.current = { token, activeCategory, activeType, unique, feedConfig, nextCursor: nextCursorRef.current };

	const highlightKey = searchParams.get("item") || "";
	const sentinelRef = useRef(null);
	const reduceMotion = useReducedMotion();
	const { scrollY } = useScroll();
	const heroScale = useSpring(useTransform(scrollY, [0, 200], [1, 0.95]), {
		stiffness: 80,
		damping: 20,
		restDelta: 0.001,
	});
	const bgParallax = useSpring(useTransform(scrollY, [0, 600], [0, -40]), {
		stiffness: 80,
		damping: 20,
		restDelta: 0.001,
	});

	const canExpressInterest = useMemo(() => {
		const role = user?.role || "";
		return role === "buying_house" || role === "admin";
	}, [user?.role]);

	const loadUser = useCallback(async () => {
		const t = liveRef.current.token;
		if (!t) return;
		try {
			const fresh = await fetchCurrentUser(t);
			if (fresh) {
				setUser(fresh);
			}
		} catch {
			/* ignore */
		} finally {
			markLoaded("user");
		}
	}, [markLoaded]);

	const loadFeedPage = useCallback(
		async ({ reset }) => {
			const limit = 12;
			const cursor = reset ? 0 : Number(nextCursorRef.current || 0);

			if (reset) {
				setLoading(true);
				setError("");
				setNotice({ type: "", message: "" });
			} else {
				setLoadingMore(true);
				setError("");
			}

			const s = liveRef.current;
			const token = s.token;
			const feedConfig = s.feedConfig;
			const activeType = s.activeType;
			const activeCategory = s.activeCategory;
			const unique = s.unique;

			if (!token) return;

			try {
				const role = user?.role || "";
				let feedType = activeType;

				if (activeType === "All") {
					if (role === "buyer") {
						feedType = "products";
					} else if (role === "factory" || role === "buying_house") {
						feedType = "requests";
					}
				} else if (activeType === "Buyer Requests") {
					feedType = "requests";
				} else if (activeType === "Company Products") {
					feedType = "products";
				} else if (activeType === "Posts") {
					feedType = "posts";
				} else if (activeType === "Unique OFF") {
					feedType = "all";
				}

				const categoryParam =
					activeCategory === feedConfig.labels.categories ? "" : activeCategory.toLowerCase();

				const query = new URLSearchParams({
					unique: unique ? "true" : "false",
					type: feedType,
					category: categoryParam,
					cursor: String(cursor),
					limit: String(limit),
					role_filter: "true",
				}).toString();

				const data = await apiRequest(`/feed?${query}`, { token });
				const rows = Array.isArray(data?.items) ? data.items : [];
				const normalized = rows.map(normalizeFeedItem);

				setTags(Array.isArray(data?.tags) ? data.tags : []);
				setItems((previous) => {
					if (reset) {
						return normalized;
					}
					const existingIds = new Set(previous.map((i) => i.id));
					const fresh = normalized.filter((i) => !existingIds.has(i.id));
					return fresh.length > 0 ? [...previous, ...fresh] : previous;
				});

				const serverNext = data?.next_cursor;
				setNextCursorBoth(serverNext === null || serverNext === undefined ? null : serverNext);

				if (reset) {
					normalized.slice(0, 6).forEach((item) => {
						trackClientEvent("feed_item_viewed", {
							entityType: item.entityType,
							entityId: item.id,
						});
					});
				}
			} catch (err) {
				setError(err.message || feedConfig.messages.load_failed);
				if (reset) {
					setItems([]);
				}
				setNextCursorBoth(null);
			} finally {
				setLoading(false);
				setLoadingMore(false);
				if (!loadFlags.current.feed && reset) {
					markLoaded("feed");
				}
			}
		},
		[markLoaded],
	);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadUser();
	}, [loadUser]);

	useEffect(() => {
		let cancelled = false;
		const token = getToken();
		if (!token) {
			return markLoaded("config");
		}
		apiRequest("/admin/config/feed-page", { token })
			.then((data) => {
				if (!cancelled) setFeedConfig({ ...DEFAULT_FEED_CONFIG, ...data });
			})
			.catch(() => logger.warn("Failed to load feed config"))
			.finally(() => {
				if (!cancelled) markLoaded("config");
			});
		return () => { cancelled = true; };
	}, [markLoaded]);

	useEffect(() => {
		setItems([]);
		setNextCursorBoth(0);
		loadFeedPage({ reset: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadFeedPage, activeCategory, activeType, unique, feedConfig]);

	useEffect(() => {
		const node = sentinelRef.current;
		if (!node) {
			return;
		}
		if (nextCursor === null || loadingMore || loading) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry?.isIntersecting && !loadingMore && !loading && nextCursor !== null) {
					loadFeedPage({ reset: false });
				}
			},
			{ rootMargin: "220px" },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [loadFeedPage, loading, loadingMore, nextCursor]);

	useEffect(() => {
		const token = getToken();
		if (!token) {
			return;
		}

		const source = subscribeFeedRealtime({
			onNewPost(raw) {
				const normalized = normalizeFeedItem({
					...raw,
					feed_type: "user_feed_post",
				});
				setItems((prev) => {
					if (prev.some((i) => i.id === normalized.id)) {
						return prev;
					}
					return [normalized, ...prev];
				});
			},
			onDeletedPost(id) {
				setItems((prev) => prev.filter((i) => i.id !== id));
			},
			onUpdatedPost(raw) {
				const normalized = normalizeFeedItem({
					...raw,
					feed_type: "user_feed_post",
				});
				setItems((prev) => prev.map((i) => (i.id === normalized.id ? normalized : i)));
			},
		});

		return () => source?.close();
	}, []);

	useEffect(() => {
		if (!(highlightKey && items.length > 0)) {
			return;
		}
		const match = items.find((i) => `${i.entityType}:${i.id}` === highlightKey);
		if (match) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setCommentsItem(match);
		}
	}, [highlightKey, items]);

	const _nowRef = useRef(null);
	useEffect(() => {
		_nowRef.current = Date.now();
	}, []);
	function isReportCoolingDown(item) {
		const key = `${item.entityType}:${item.id}`;
		const ends = reportCooldowns[key] || 0;
		return ends > _nowRef.current;
	}

	async function handleShare(item) {
		setNotice({ type: "", message: "" });
		try {
			const url = `${window.location.origin}/feed?item=${encodeURIComponent(`${item.entityType}:${item.id}`)}`;
			await copyToClipboard(url);
			await apiRequest(
				`/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}/share`,
				{ method: "POST", token },
			);
			setNotice({ type: "success", message: feedConfig.messages.share_copied });
		} catch (err) {
			setNotice({ type: "error", message: err.message || "Share failed." });
		}
	}

	function handleMessage(item = null) {
		if (item?.id) {
			const sourceType =
				item.entityType === "buyer_request"
					? "buyer_request"
					: item.entityType === "product" || item.entityType === "company_product"
						? "product"
						: "feed_post";
			recordLeadSource({
				type: sourceType,
				id: item.id,
				label: buildFeedLeadLabel(item),
			});
		}
		navigate("/chat", {
			state: {
				lead: item
					? {
							type: item.entityType,
							id: item.id,
							label: buildFeedLeadLabel(item),
						}
					: undefined,
			},
		});
	}

	async function handleExpressInterest(item) {
		if (expressBusyId) {
			return;
		}
		setExpressBusyId(item.id);
		try {
			await apiRequest(`/buyer-requests/${item.id}/express-interest`, {
				method: "POST",
				token,
			});
			setNotice({
				type: "success",
				message: feedConfig.messages.interest_expressed,
			});
			setClaimedRequestId(item.id);
		} catch (err) {
			setNotice({
				type: "error",
				message: err.message || "Failed to express interest.",
			});
		} finally {
			setExpressBusyId("");
		}
	}

	async function handleSubmitReport(reason) {
		setReportBusy(true);
		try {
			await apiRequest(
				`/social/${encodeURIComponent(reportItem.entityType)}/${encodeURIComponent(reportItem.id)}/report`,
				{
					method: "POST",
					token,
					body: { reason },
				},
			);
			setNotice({
				type: "success",
				message: feedConfig.messages.report_submitted,
			});
			setReportItem(null);
			setReportCooldowns((prev) => ({
				...prev,
				[`${reportItem.entityType}:${reportItem.id}`]: Date.now() + 30_000,
			}));
		} catch (err) {
			setNotice({ type: "error", message: err.message || "Report failed." });
		} finally {
			setReportBusy(false);
		}
	}

	const filtered = useMemo(
		() =>
			items.filter((item) => {
				const searchBlob = [
					item.author?.name,
					item.title,
					item.content,
					item.category,
					...(item.tags || []),
					...(item.productTags || []),
				]
					.join(" ")
					.toLowerCase();

				const searchHit = search === "" || searchBlob.includes(search.toLowerCase());
				const categoryHit =
					activeCategory === feedConfig.labels.categories ||
					item.category?.toLowerCase() === activeCategory.toLowerCase();

				return searchHit && categoryHit;
			}),
		[items, search, activeCategory, feedConfig],
	);

	const quickActions = useMemo(() => {
		const role = user?.role || "";
		if (role === "buyer") {
			return [
				{ to: "/buyer-requests", label: "Post a Buyer Request" },
				{ to: "/feed/manage", label: "Create Listing" },
			];
		}
		if (role === "factory") {
			return [
				{ to: "/product-management", label: "Create Listing" },
				{ to: "/member-management", label: "Members" },
			];
		}
		if (role === "buying_house") {
			return [
				{ to: "/product-management", label: "Create Listing" },
				{ to: "/agent", label: "Go to Agent Dashboard" },
			];
		}
		return [
			{ to: "/feed/manage", label: "Create Listing" },
			{ to: "/search", label: "Search" },
		];
	}, [user?.role]);

	const stats = useMemo(
		() => ({
			requests: items.filter((i) => i.entityType === "buyer_request").length,
			products: items.filter(
				(i) => i.entityType === "company_product" || i.entityType === "product",
			).length,
			posts: items.filter((i) => i.entityType === "user_feed_post").length,
		}),
		[items],
	);

	if (pageLoading) {
		return <NeonAtom fill={true} size={80} text="Loading feed..." />;
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-slate-50 text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
			<motion.div
				style={{ y: reduceMotion ? 0 : bgParallax }}
				className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_25%),linear-gradient(180deg,#f8fbff_0%,#eef8ff_48%,#f8fbff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_25%),linear-gradient(180deg,#07111f_0%,#081627_45%,#06111f_100%)]"
			/>
			<div className="flex min-h-0 flex-1 flex-col text-slate-900 transition-colors dark:text-white">
				<div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-6 px-4 py-4 md:px-6 lg:flex-row lg:overflow-hidden lg:p-6 min-h-0">
					{/* Mobile hamburger */}
					<div className="flex items-center justify-between lg:hidden">
						<h1 className="text-lg font-bold text-slate-900 dark:text-white">Feed</h1>
						<button
							onClick={() => setSidebarOpen(true)}
							className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300"
							aria-label="Open sidebar"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>

					{/* Mobile drawer overlay */}
					{sidebarOpen && (
						<div className="fixed inset-0 z-50 lg:hidden">
							<div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
							<aside className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] overflow-y-auto border-r border-white/10 bg-white/95 p-4 backdrop-blur-2xl dark:bg-slate-950/95">
								<div className="flex justify-end mb-4">
									<button
										onClick={() => setSidebarOpen(false)}
										className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
										aria-label="Close sidebar"
									>
										✕
									</button>
								</div>
								{/* ====== MOBILE SIDEBAR CONTENT ====== */}
								{/* Header */}
								<div className="rounded-[28px] bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-400 p-5 text-white shadow-xl shadow-sky-500/20">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											{user?.profile?.profile_image || user?.avatar_url ? (
												<img
													src={user.profile?.profile_image || user.avatar_url}
													alt={user?.name || "User"}
													className="h-12 w-12 rounded-2xl object-cover"
												/>
											) : (
												<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
													<LayoutGrid className="h-6 w-6" />
												</div>
											)}
											<div>
												<p className="text-sm/none font-medium opacity-90">
													{user?.role
														? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace(/_/g, " ")
														: "User"}
												</p>
												<p className="text-xl font-semibold">{user?.name || "Feed Center"}</p>
											</div>
										</div>
									</div>
									<div className="mt-4 flex items-center gap-2 text-sm opacity-95">
										<BadgeCheck className="h-4 w-4" />
										{user?.profile?.bio || feedConfig.labels.premium_badge}
									</div>
									{user?.email && <div className="mt-2 text-xs opacity-75">{user.email}</div>}
								</div>
								{/* Quick Actions */}
								<div className="mt-4 rounded-[28px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60">
									<div className="flex items-center justify-between">
										<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{feedConfig.labels.quick_actions}</h2>
										<span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">{feedConfig.labels.live_status}</span>
									</div>
									<div className="mt-4 grid gap-3">
										{quickActions.map((a) => (
											<Link
												key={a.to}
												to={a.to}
												onClick={() => setSidebarOpen(false)}
												className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sky-500/10 dark:hover:text-sky-300"
											>
												<span className="flex items-center gap-2">
													{a.label.includes("Post") ? <Upload className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
													{a.label}
												</span>
												<ChevronDown className="h-4 w-4" />
											</Link>
										))}
									</div>
								</div>
								{/* Search */}
								<div className="mt-4 rounded-[28px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60">
									<div className="flex items-center justify-between gap-3">
										<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Search</h2>
										<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">Feed</span>
									</div>
									<div className="mt-4 relative">
										<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
										<input
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											placeholder={feedConfig.labels.search_placeholder}
											className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
										/>
									</div>
								</div>
								{/* Categories */}
								<div className="mt-4 rounded-[28px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60">
									<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{feedConfig.labels.categories}</h2>
									<div className="mt-4 flex flex-wrap gap-2">
										<Pill active={activeCategory === feedConfig.labels.categories} onClick={() => { setActiveCategory(feedConfig.labels.categories); setSidebarOpen(false); }}>{feedConfig.labels.categories}</Pill>
										{tags.map((cat) => (
											<Pill key={cat} active={activeCategory === cat} onClick={() => { setActiveCategory(cat); setSidebarOpen(false); }}>{cat}</Pill>
										))}
									</div>
								</div>
							</aside>
						</div>
					)}

					{/* ====== SIDEBAR ====== */}
					<aside
						data-lenis-prevent={isLargeScreen ? true : undefined}
						className="hidden lg:flex h-fit w-full flex-col gap-4 rounded-[32px] border border-white/70 bg-white/75 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:h-full lg:w-[320px] lg:overflow-y-auto scrollbar-invisible"
					>
						{/* Header */}
						<div className="rounded-[28px] bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-400 p-5 text-white shadow-xl shadow-sky-500/20">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									{user?.profile?.profile_image || user?.avatar_url ? (
										<img
											src={user.profile?.profile_image || user.avatar_url}
											alt={user?.name || "User"}
											className="h-12 w-12 rounded-2xl object-cover"
										/>
									) : (
										<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
											<LayoutGrid className="h-6 w-6" />
										</div>
									)}
									<div>
										<p className="text-sm/none font-medium opacity-90">
											{user?.role
												? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace(/_/g, " ")
												: "User"}
										</p>
										<p className="text-xl font-semibold">{user?.name || "Feed Center"}</p>
									</div>
								</div>
							</div>
							<div className="mt-4 flex items-center gap-2 text-sm opacity-95">
								<BadgeCheck className="h-4 w-4" />
								{user?.profile?.bio || feedConfig.labels.premium_badge}
							</div>
							{user?.email && <div className="mt-2 text-xs opacity-75">{user.email}</div>}
						</div>

						{/* Quick Actions */}
						<div className="rounded-[28px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60">
							<div className="flex items-center justify-between">
								<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
									{feedConfig.labels.quick_actions}
								</h2>
								<span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
									{feedConfig.labels.live_status}
								</span>
							</div>
							<div className="mt-4 grid gap-3">
								{quickActions.map((a) => (
									<Link
										key={a.to}
										to={a.to}
										className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sky-500/10 dark:hover:text-sky-300"
									>
										<span className="flex items-center gap-2">
											{a.label.includes("Post") ? (
												<Upload className="h-4 w-4" />
											) : (
												<Plus className="h-4 w-4" />
											)}
											{a.label}
										</span>
										<ChevronDown className="h-4 w-4" />
									</Link>
								))}
							</div>
						</div>

						{/* Search */}
						<div className="rounded-[28px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60">
							<div className="flex items-center justify-between gap-3">
								<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
									Search
								</h2>
								<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
									Feed
								</span>
							</div>
							<div className="mt-4 relative">
								<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder={feedConfig.labels.search_placeholder}
									className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
								/>
							</div>
						</div>

						{/* Categories */}
						<div className="rounded-[28px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60">
							<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
								{feedConfig.labels.categories}
							</h2>
							<div className="mt-4 flex flex-wrap gap-2">
								<Pill
									active={activeCategory === feedConfig.labels.categories}
									onClick={() => setActiveCategory(feedConfig.labels.categories)}
								>
									{feedConfig.labels.categories}
								</Pill>
								{tags.map((cat) => (
									<Pill
										key={cat}
										active={activeCategory === cat}
										onClick={() => setActiveCategory(cat)}
									>
										{cat}
									</Pill>
								))}
							</div>
						</div>
					</aside>

					{/* ====== MAIN CONTENT ====== */}
					<main
						data-lenis-prevent={isLargeScreen ? true : undefined}
						className="min-w-0 flex-1 space-y-6 overflow-y-auto pb-4 lg:pb-0 scrollbar-invisible"
					>
						{/* Hero Section */}
						<motion.section
							className="rounded-[32px] border border-white/70 bg-white/75 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 sm:p-6"
							style={{ scale: reduceMotion ? 1 : heroScale }}
						>
							<div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
								<div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[540px]">
									<StatCard
										icon={<BriefcaseBusiness className="h-3 w-3" />}
										label={feedConfig.labels.stats.buyer_requests}
										value={String(stats.requests)}
										accent="sky"
									/>
									<StatCard
										icon={<LayoutGrid className="h-3 w-3" />}
										label={feedConfig.labels.stats.company_products}
										value={String(stats.products)}
										accent="blue"
									/>
									<StatCard
										icon={<Bell className="h-3 w-3" />}
										label={feedConfig.labels.stats.feed_posts}
										value={String(stats.posts)}
										accent="indigo"
									/>
								</div>
							</div>
						</motion.section>

						{/* Tabs & Filters */}
						<section className="rounded-[32px] border border-white/70 bg-white/75 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
							<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
								<div className="flex flex-wrap gap-2">
									{feedConfig.tabs.map((tab) => (
										<Pill key={tab} active={activeType === tab} onClick={() => setActiveType(tab)}>
											{tab}
										</Pill>
									))}
								</div>
								<div className="flex flex-wrap items-center gap-3">
									<button
										onClick={() => setFiltersOpen((v) => !v)}
										className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-500/30 dark:hover:text-sky-300"
									>
										<Filter className="h-4 w-4" />
										Filters
									</button>
									<Link
										to="/feed/manage"
										className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600"
									>
										<Plus className="h-4 w-4" />
										Create post
									</Link>
								</div>
							</div>
						</section>

						{/* Notice */}
						{notice?.message && (
							<div
								className={`rounded-2xl p-4 text-sm ring-1 ${
									notice.type === "error"
										? "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30"
										: notice.type === "success"
											? "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/25"
											: "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/25"
								}`}
							>
								<div className="flex items-center justify-between gap-3">
									<p className="font-medium">{notice.message}</p>
									{claimedRequestId && (
										<button
											type="button"
											onClick={() =>
												navigate("/chat", {
													state: {
														notice: `Buyer request ${claimedRequestId} claimed. Open inbox to continue.`,
													},
												})
											}
											className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
										>
											Open Chat
										</button>
									)}
								</div>
							</div>
						)}

						{/* Feed Items */}
						<section className="grid gap-5">
							{error ? (
								<div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30">
									{error}
									<div className="mt-3">
										<button
											type="button"
											onClick={() => loadFeedPage({ reset: true })}
											className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
										>
											Retry
										</button>
									</div>
								</div>
							) : null}

							{!(loading || error) && filtered.length === 0 && (
								<div className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
									{feedConfig.messages.no_results}
								</div>
							)}

							{!(loading || error) &&
								// eslint-disable-next-line react-hooks/refs
								filtered.map((item, idx) => {
									const highlight = highlightKey === `${item.entityType}:${item.id}`;
									const reportDisabled = isReportCoolingDown(item);

									return (
										<motion.div
											key={`${item.entityType}:${item.id}`}
											initial={reduceMotion ? false : { opacity: 0, y: 20 }}
											animate={reduceMotion ? false : { opacity: 1, y: 0 }}
											transition={{
												duration: 0.45,
												ease: [0.16, 1, 0.3, 1],
												delay: idx * 0.05,
											}}
										>
											<FeedItemCard
												item={item}
												highlight={highlight}
												canExpressInterest={
													canExpressInterest && item.entityType === "buyer_request"
												}
												expressInterestDisabled={expressBusyId === item.id}
												onExpressInterest={() => handleExpressInterest(item)}
												onOpenComments={() => setCommentsItem(item)}
												onShare={() => handleShare(item)}
												onReport={() => {
													if (reportDisabled) {
														setNotice({
															type: "info",
															message: feedConfig.messages.rate_limited,
														});
														return;
													}
													setReportItem(item);
												}}
												onMessage={() => handleMessage(item)}
											/>
										</motion.div>
									);
								})}

							<div ref={sentinelRef} className="h-10" />

							{loadingMore ? (
								<div className="rounded-[28px] border border-white/60 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 p-5">
									<div className="h-3 w-40 mx-auto rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5" />
								</div>
							) : null}

							{!(loading || error) && nextCursor === null ? (
								<div className="text-center text-xs text-slate-400 dark:text-slate-500 py-3">
									{feedConfig.messages.all_caught_up}
								</div>
							) : null}
						</section>
					</main>
				</div>

				<PostDetailModal
					open={Boolean(commentsItem)}
					onClose={() => setCommentsItem(null)}
					item={commentsItem}
					onShare={() => commentsItem && handleShare(commentsItem)}
				/>
				<ReportModal
					open={Boolean(reportItem)}
					item={reportItem}
					onClose={() => setReportItem(null)}
					onSubmit={(reason) => handleSubmitReport(reason)}
				/>
			</div>
		</div>
	);
}
