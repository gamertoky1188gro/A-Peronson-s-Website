import {
  BadgeCheck,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Flag,
  MessageSquareText,
  ArrowUpRight,
  Zap,
  User,
  ExternalLink,
  Link2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import PostPreview from "../ui/PostPreview";

function requestStatusBadgeClass(status = "") {
  const s = String(status || "open").toLowerCase();
  if (s === "open" || s === "active") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
  }
  if (s === "reviewing" || s === "reviewing_quotes") {
    return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
  }
  if (s === "closed" || s === "completed") {
    return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
  }
  return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
}

function formatRequestStatusLabel(status = "") {
  const s = String(status || "open").toLowerCase();
  if (s === "open" || s === "active") return "Active";
  if (s === "reviewing" || s === "reviewing_quotes") return "Reviewing";
  if (s === "closed" || s === "completed") return "Closed";
  return String(status || "open").replaceAll("_", " ");
}

function RequestStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${requestStatusBadgeClass(status)}`}
    >
      {formatRequestStatusLabel(status)}
    </span>
  );
}

function compactText(value) {
  return String(value || "").trim();
}

function fieldRow(label, value) {
  const text = compactText(value);
  if (!text) return null;
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-slate-900 dark:text-slate-100 font-medium text-right whitespace-pre-wrap">
        {text}
      </span>
    </div>
  );
}

export default function FeedItemCard({
  item,
  canExpressInterest,
  expressInterestDisabled,
  onExpressInterest,
  onOpenComments,
  onShare,
  onReport,
  onMessage,
  highlight,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const isBuyerRequest = item.entityType === "buyer_request";
  const isUserFeedPost = item.entityType === "user_feed_post";
  const profileLink = !item.author?.id
    ? ""
    : isBuyerRequest
      ? `/buyer/${encodeURIComponent(item.author.id)}`
      : item.author.rolePath
        ? `/${item.author.rolePath}/${encodeURIComponent(item.author.id)}`
        : "";

  return (
    <article
      className={`relative overflow-hidden rounded-2xl bg-[#ffffff] shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800${
        highlight ? "ring-2 ring-[#3b82f6]/35" : ""
      }`}
      id={`feed-item-${item.entityType}-${item.id}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 dark:bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.10),transparent_52%)]" />
      <header className="relative p-4 bg-white/70 dark:bg-slate-950/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {profileLink ? (
              <Link to={profileLink} className="shrink-0">
                {item.author?.avatar_url ? (
                  <img
                    src={item.author.avatar_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 shrink-0 flex items-center justify-center text-xs font-semibold text-slate-500">
                    {(item.author?.name || "?")[0]}
                  </div>
                )}
              </Link>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 shrink-0 flex items-center justify-center text-xs font-semibold text-slate-500">
                {(item.author?.name || "?")[0]}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {profileLink ? (
                  <Link
                    to={profileLink}
                    className="font-semibold text-slate-900 dark:text-slate-100 truncate hover:underline"
                  >
                    {item.author?.name || "Unknown"}
                  </Link>
                ) : (
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.author?.name || "Unknown"}
                  </p>
                )}
                {item.verified ? (
                  <span
                    className="verified-shimmer inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25"
                    title="Verified"
                  >
                    <BadgeCheck size={14} />
                    <span className="hidden sm:inline">Verified</span>
                  </span>
                ) : null}
                {item.feedMetadata?.paid_boost_active ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-300/25"
                    title="Boosted visibility"
                  >
                    <Zap size={13} />
                    <span className="hidden sm:inline">Boosted</span>
                  </span>
                ) : null}
                {String(item.certificationStatus || "").toLowerCase() ===
                "certified" ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                    Certified
                  </span>
                ) : null}
                {isBuyerRequest && item.priorityActive ? (
                  <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                    Priority
                  </span>
                ) : null}
                {isBuyerRequest ? (
                  <RequestStatusBadge status={item.status} />
                ) : null}
                {item.discussionActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-400/25">
                    Active discussion
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {item.author?.accountType ||
                  (isBuyerRequest ? "Buyer" : "Company")}
              </p>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-full p-2 hover:bg-slate-50/70 dark:hover:bg-white/5"
              aria-label="More actions"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <MoreHorizontal
                size={18}
                className="text-slate-500 dark:text-slate-400"
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700">
                {profileLink ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(profileLink);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <User size={15} /> View Profile
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onShare?.();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Share2 size={15} /> Share
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    const url = profileLink
                      ? `${window.location.origin}${profileLink}`
                      : window.location.href;
                    navigator.clipboard.writeText(url).catch(() => console.warn("Failed to copy link"));
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Link2 size={15} /> Copy Link
                </button>
                {profileLink ? (
                  <a
                    href={profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <ExternalLink size={15} /> Open in New Tab
                  </a>
                ) : null}
                <hr className="my-1 border-slate-100 dark:border-slate-800" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onReport?.();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  <Flag size={15} /> Report
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="relative p-4">
        <div className="flex items-center justify-between gap-3">
          <p
            className={`text-xs font-semibold${isBuyerRequest ? "text-emerald-700 dark:text-emerald-300" : isUserFeedPost ? "text-fuchsia-700 dark:text-fuchsia-300" : "text-indigo-700 dark:text-indigo-300"}`}
          >
            {isBuyerRequest
              ? "Buyer Request"
              : isUserFeedPost
                ? "Feed Post"
                : "Company Product"}
          </p>
          {item.createdAt ? (
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {item.createdAt}
            </p>
          ) : null}
        </div>

        {isUserFeedPost ? (
          <PostPreview item={item} />
        ) : (
          <>
            <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              {isBuyerRequest
                ? item.category || "Request"
                : item.title || item.category || "Product"}
            </h3>

            {item.content ? (
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {item.content}
              </p>
            ) : null}

            {isBuyerRequest ? (
              <div className="mt-3 rounded-xl bg-slate-50/60 p-3 space-y-2 ring-1 ring-slate-200/60 dark:bg-white/5 dark:ring-white/10">
                {fieldRow("Category", item.category)}
                {fieldRow("Quantity", item.quantity)}
                {fieldRow(
                  "Timeline",
                  item.timelineDays ? `${item.timelineDays} days` : "",
                )}
                {fieldRow("Material", item.material)}
                {fieldRow(
                  "Certifications",
                  Array.isArray(item.certifications)
                    ? item.certifications.join(", ")
                    : "",
                )}
                {fieldRow("Shipping", item.shippingTerms)}
              </div>
            ) : (
              <div className="mt-3 rounded-xl bg-slate-50/60 p-3 space-y-2 ring-1 ring-slate-200/60 dark:bg-white/5 dark:ring-white/10">
                {fieldRow("Category", item.category)}
                {fieldRow("MOQ", item.moq)}
                {fieldRow(
                  "Lead time",
                  item.leadTimeDays ? `${item.leadTimeDays} days` : "",
                )}
                {fieldRow("Material", item.material)}
              </div>
            )}

            {item.hasVideo ? (
              <div className="mt-3 rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white p-4 text-center dark:bg-white/5">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Video available
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Open the profile to view the gallery.
                </p>
              </div>
            ) : null}

            {Array.isArray(item.tags) && item.tags.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag, i) => (
                  <span
                    key={`${item.id}-${tag}-${i}`}
                    className="rounded-full bg-[#3b82f6]/10 px-3 py-1 text-[11px] font-semibold text-[#2563eb] dark:bg-[#38bdf8]/10 dark:text-[#38bdf8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      <footer className="relative px-4 py-3 bg-white/70 dark:bg-slate-950/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={onOpenComments}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-gtBlue dark:hover:text-gtBlue hover:bg-slate-200/70 dark:hover:bg-slate-700/60 hover:shadow-sm transition-all active:scale-90 cursor-pointer"
          >
            <MessageSquareText size={16} /> Comment
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-gtBlue dark:hover:text-gtBlue hover:bg-slate-200/70 dark:hover:bg-slate-700/60 hover:shadow-sm transition-all active:scale-90 cursor-pointer"
          >
            <Share2 size={16} /> Share
          </button>
          <button
            type="button"
            onClick={onReport}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-200/60 dark:hover:bg-rose-950/50 hover:shadow-sm transition-all active:scale-90 cursor-pointer"
          >
            <Flag size={16} /> Report
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isBuyerRequest && canExpressInterest ? (
            <button
              type="button"
              onClick={onExpressInterest}
              disabled={Boolean(expressInterestDisabled)}
              className="rounded-full bg-gtBlue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gtBlueHover active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {expressInterestDisabled ? "Claiming..." : "Express Interest"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onMessage?.(item)}
              className="rounded-full bg-gtBlue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gtBlueHover active:scale-95 inline-flex items-center gap-2"
            >
              <MessageCircle size={16} /> Message
            </button>
          )}

          {profileLink ? (
            <Link
              to={profileLink}
              className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 inline-flex items-center gap-2 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
            >
              View profile <ArrowUpRight size={14} />
            </Link>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
