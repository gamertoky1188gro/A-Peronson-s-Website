/*
  Route: /feed
  Access: Protected (login required)
  Using the exact template layout with glass-morphism theme
*/
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import useLocalStorageState from "../hooks/useLocalStorageState";
import {
  apiRequest,
  fetchCurrentUser,
  getCurrentUser,
  getToken,
} from "../lib/auth";
import { trackClientEvent } from "../lib/events";
import { recordLeadSource } from "../lib/leadSource";
import FeedItemCard from "../components/feed/FeedItemCard";
import CommentsDrawer from "../components/feed/CommentsDrawer";
import ReportModal from "../components/feed/ReportModal";

const Motion = motion;

// ====== ICONS (from template) ======
const Icon = ({ children, className = "h-5 w-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);
const FilterIcon = (p) => (
  <Icon {...p}>
    <polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3" />
  </Icon>
);
const ChevronDown = (p) => (
  <Icon {...p}>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);
const MessageCircle = (p) => (
  <Icon {...p}>
    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.38 8.38 0 0 1-4-.98L3 21l1.98-5.5A8.5 8.5 0 1 1 21 11.5z" />
  </Icon>
);
const Share2 = (p) => (
  <Icon {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Icon>
);
const Flag = (p) => (
  <Icon {...p}>
    <path d="M4 4v16" />
    <path d="M4 4c5-2 7 2 12 0v8c-5 2-7-2-12 0" />
  </Icon>
);
const Send = (p) => (
  <Icon {...p}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Icon>
);
const Sparkles = (p) => (
  <Icon {...p}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
  </Icon>
);
const LayoutGrid = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </Icon>
);
const BadgeCheck = (p) => (
  <Icon {...p}>
    <path d="M9 12l2 2 4-4" />
    <circle cx="12" cy="12" r="10" />
  </Icon>
);
const SunMedium = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
  </Icon>
);
const MoonStar = (p) => (
  <Icon {...p}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Icon>
);
const SlidersHorizontal = (p) => (
  <Icon {...p}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
  </Icon>
);
const Plus = (p) => (
  <Icon {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);
const MoreHorizontal = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </Icon>
);
const Bell = (p) => (
  <Icon {...p}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </Icon>
);
const UserCircle2 = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20c0-4 12-4 12 0" />
  </Icon>
);
const BriefcaseBusiness = (p) => (
  <Icon {...p}>
    <rect x="2" y="7" width="20" height="14" />
    <path d="M16 3H8v4h8z" />
  </Icon>
);
const Upload = (p) => (
  <Icon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </Icon>
);

const TABS = [
  "All",
  "Buyer Requests",
  "Company Products",
  "Posts",
  "Unique OFF",
];

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
    premium_experience: "Premium feed experience",
    hero_title: "Modern buyer and company feed, tuned for clarity and speed.",
    hero_description:
      "Browse buyer requests, company products, and posts from one polished admin-friendly workspace with a clean blue-sky visual system.",
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
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function buildFeedLeadLabel(item) {
  const title = String(item?.title || "").trim();
  if (title) return title;
  const category = String(item?.category || "").trim();
  if (category) return category;
  const content = String(item?.content || "")
    .replace(/\s+/g, " ")
    .trim();
  if (content) return content.slice(0, 80);
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
  const authorId =
    raw.buyer_id || raw.company_id || raw.user_id || raw.author_id || "";
  const accountType =
    raw.author?.role ||
    raw.company_role ||
    (isBuyerRequest ? "buyer" : isUserFeedPost ? "member" : "factory");
  const rolePath =
    accountType === "buying_house"
      ? "buying-house"
      : accountType === "buyer"
        ? "buyer"
        : accountType === "factory"
          ? "factory"
          : "";

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
    tags: [
      raw.category,
      raw.material,
      ...(Array.isArray(raw.hashtags) ? raw.hashtags : []),
    ].filter(Boolean),
    material: raw.material || "",
    quantity: raw.quantity || "",
    timelineDays: raw.timeline_days || "",
    shippingTerms: raw.shipping_terms || "",
    certifications: Array.isArray(raw.certifications_required)
      ? raw.certifications_required
      : [],
    moq: raw.moq || "",
    leadTimeDays: raw.lead_time_days || "",
    hasVideo: Boolean(
      raw.hasVideo ||
      (!raw.video_restricted &&
        raw.video_review_status === "approved" &&
        raw.video_url),
    ),
    media: Array.isArray(raw.media) ? raw.media : [],
    ctaText: raw.cta_text || "",
    ctaUrl: raw.cta_url || "",
    mentions: Array.isArray(raw.mentions) ? raw.mentions : [],
    links: Array.isArray(raw.links) ? raw.links : [],
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
  if (!text) return false;
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

function FeedSkeletonCard() {
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton" />
          <div className="h-3 w-1/4 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-5 w-2/3 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton" />
        <div className="h-4 w-full rounded-xl relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton" />
      </div>
    </div>
  );
}

// ====== UI COMPONENTS ======
function Pill({ children, active = false, onClick }) {
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
}

function StatCard({ icon, label, value, accent = "sky" }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="text-xl font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            accent === "sky" && "bg-sky-500/15 text-sky-600 dark:text-sky-400",
            accent === "blue" &&
              "bg-blue-500/15 text-blue-600 dark:text-blue-400",
            accent === "indigo" &&
              "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-500 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-sky-500 dark:hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
}

// ====== MAIN COMPONENT ======
export default function MainFeed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => getToken(), []);
  const sessionUser = getCurrentUser();
  const userId = sessionUser?.id || "user";
  const uniqueKey = `gartexhub_unique:${userId}`;

  const [user, setUser] = useState(sessionUser);
  const [feedConfig, setFeedConfig] = useState(DEFAULT_FEED_CONFIG);
  const [activeType, setActiveType] = useState(feedConfig.tabs[0]);
  const [activeCategory, setActiveCategory] = useState(
    feedConfig.labels.categories,
  );
  const [unique, setUnique] = useLocalStorageState(uniqueKey, false); // eslint-disable-line no-unused-vars
  const [search, setSearch] = useState("");

  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [nextCursor, setNextCursor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });

  const [commentsItem, setCommentsItem] = useState(null);
  const [reportItem, setReportItem] = useState(null);
  const [reportCooldowns, setReportCooldowns] = useState({});
  const [reportBusy, setReportBusy] = useState(false); // eslint-disable-line no-unused-vars
  const [expressBusyId, setExpressBusyId] = useState("");
  const [claimedRequestId, setClaimedRequestId] = useState("");

  const highlightKey = searchParams.get("item") || "";
  const sentinelRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const canExpressInterest = useMemo(() => {
    const role = user?.role || "";
    return role === "buying_house" || role === "admin";
  }, [user?.role]);

  const loadUser = useCallback(async () => {
    try {
      const fresh = await fetchCurrentUser(token);
      if (fresh) setUser(fresh);
    } catch {
      /* ignore */
    }
  }, [token]);

  const loadFeedPage = useCallback(
    async ({ reset }) => {
      const limit = 12;
      const cursor = reset ? 0 : Number(nextCursor || 0);

      if (reset) {
        setLoading(true);
        setError("");
        setNotice({ type: "", message: "" });
      } else {
        setLoadingMore(true);
        setError("");
      }

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
          activeCategory === feedConfig.labels.categories
            ? ""
            : activeCategory.toLowerCase();

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
        setItems((previous) =>
          reset ? normalized : [...previous, ...normalized],
        );

        const serverNext = data?.next_cursor;
        setNextCursor(
          serverNext === null || serverNext === undefined ? null : serverNext,
        );

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
        if (reset) setItems([]);
        setNextCursor(null);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, activeType, token, unique, user?.role, feedConfig, nextCursor],
  );  

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    apiRequest("/api/admin/config/feed-page")
      .then((data) => setFeedConfig({ ...DEFAULT_FEED_CONFIG, ...data }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setItems([]);
    setNextCursor(0);
    loadFeedPage({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType, activeCategory, unique]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;
    if (nextCursor === null || loadingMore || loading) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry?.isIntersecting &&
          !loadingMore &&
          !loading &&
          nextCursor !== null
        ) {
          loadFeedPage({ reset: false });
        }
      },
      { rootMargin: "220px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadFeedPage, loading, loadingMore, nextCursor]);

  function isReportCoolingDown(item) {
    const key = `${item.entityType}:${item.id}`;
    const ends = reportCooldowns[key] || 0;
    return ends > Date.now();
  }

  async function handleShare(item) {
    setNotice({ type: "", message: "" });
    try {
      await apiRequest(
        `/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}/share`,
        { method: "POST", token },
      );
      const url = `${window.location.origin}/feed?item=${encodeURIComponent(`${item.entityType}:${item.id}`)}`;
      await copyToClipboard(url);
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
          : item.entityType === "product" ||
              item.entityType === "company_product"
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
    if (expressBusyId) return;
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
        [`${reportItem.entityType}:${reportItem.id}`]: Date.now() + 30000,
      }));
    } catch (err) {
      setNotice({ type: "error", message: err.message || "Report failed." });
    } finally {
      setReportBusy(false);
    }
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
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

      const searchHit =
        search === "" || searchBlob.includes(search.toLowerCase());
      const categoryHit =
        activeCategory === feedConfig.labels.categories ||
        item.category?.toLowerCase() === activeCategory.toLowerCase();

      return searchHit && categoryHit;
    });
  }, [items, search, activeCategory, feedConfig]);

  const quickActions = useMemo(() => {
    const role = user?.role || "";
    if (role === "buyer") {
      return [
        { to: "/buyer-requests", label: "Post a Buyer Request" },
        { to: "/feed/manage", label: "Manage Feed Posts" },
      ];
    }
    if (role === "factory") {
      return [
        { to: "/product-management", label: "Post a Product" },
        { to: "/feed/manage", label: "Manage Feed Posts" },
        { to: "/member-management", label: "Members" },
      ];
    }
    if (role === "buying_house") {
      return [
        { to: "/product-management", label: "Post a Product" },
        { to: "/feed/manage", label: "Manage Feed Posts" },
        { to: "/agent", label: "Go to Agent Dashboard" },
      ];
    }
    return [
      { to: "/feed/manage", label: "Manage Feed Posts" },
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_25%),linear-gradient(180deg,#f8fbff_0%,#eef8ff_48%,#f8fbff_100%)] text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_25%),linear-gradient(180deg,#07111f_0%,#081627_45%,#06111f_100%)] dark:text-white">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-4 md:px-6 lg:h-screen lg:flex-row lg:overflow-hidden lg:p-6">
          {/* ====== SIDEBAR ====== */}
          <aside className="flex h-fit w-full flex-col gap-4 rounded-[32px] border border-white/70 bg-white/75 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:w-[320px] lg:overflow-y-auto">
            {/* Header */}
            <div className="rounded-[28px] bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-400 p-5 text-white shadow-xl shadow-sky-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                    <LayoutGrid className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm/none font-medium opacity-90">
                      {user?.name?.split(" ")[0] || "User"}
                    </p>
                    <p className="text-xl font-semibold">
                      {feedConfig.labels.feed_center}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm opacity-95">
                <BadgeCheck className="h-4 w-4" />
                {feedConfig.labels.premium_badge}
              </div>
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
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                  onClick={() =>
                    setActiveCategory(feedConfig.labels.categories)
                  }
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
          <main className="min-w-0 flex-1 space-y-6 overflow-y-auto pb-4 lg:pb-0">
            {/* Hero Section */}
            <section className="rounded-[32px] border border-white/70 bg-white/75 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                    <Sparkles className="h-4 w-4" />
                    {feedConfig.labels.premium_experience}
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                    Modern buyer and company feed, tuned for clarity and speed.
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Browse buyer requests, company products, and posts from one
                    polished admin-friendly workspace with a clean blue-sky
                    visual system.
                  </p>
                </div>
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
            </section>

            {/* Tabs & Filters */}
            <section className="rounded-[32px] border border-white/70 bg-white/75 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap gap-2">
                  {feedConfig.tabs.map((tab) => (
                    <Pill
                      key={tab}
                      active={activeType === tab}
                      onClick={() => setActiveType(tab)}
                    >
                      {tab}
                    </Pill>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-500/30 dark:hover:text-sky-300">
                    <FilterIcon className="h-4 w-4" />
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
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <FeedSkeletonCard key={`feed-skel-${i}`} />
                  ))}
                </div>
              ) : null}

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

              {!loading && !error && filtered.length === 0 && (
                <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
                  {feedConfig.messages.no_results}
                </div>
              )}

              {!loading &&
                !error &&
                filtered.map((item, idx) => {
                  const highlight =
                    highlightKey === `${item.entityType}:${item.id}`;
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
                          canExpressInterest &&
                          item.entityType === "buyer_request"
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

              {!loading && !error && nextCursor === null ? (
                <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-3">
                  {feedConfig.messages.all_caught_up}
                </div>
              ) : null}
            </section>
          </main>
        </div>

        <CommentsDrawer
          open={Boolean(commentsItem)}
          onClose={() => setCommentsItem(null)}
          item={commentsItem}
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
