/*
  Route: /notifications
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Display system + workflow notifications (search matches, conversation locks, rating requests, etc.).
    - Provide tabbed filtering with animated active pill indicator.
    - Support actions like mark-as-read and manage search alerts.

  Key API endpoints:
    - GET /api/notifications
    - PATCH /api/notifications/:id/read
    - GET /api/notifications/search-alerts
    - DELETE /api/notifications/search-alerts/:id
    - GET /api/products/views/me (for the "Viewed Products" tab)
*/
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Factory,
  History,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { apiRequest, getCurrentUser, getToken } from "../lib/auth";
import ProductQuickViewModal from "../components/products/ProductQuickViewModal";
import {
  connectNotificationsRealtime,
  subscribeNotificationsRealtime,
} from "../lib/notificationsRealtime";

const Motion = motion;

const TABS = [
  { key: "all", label: "All", icon: Bell },
  { key: "smart_search_match", label: "Search Matches", icon: Sparkles },
  { key: "partner_request", label: "Partner Requests", icon: Factory },
  { key: "conversation_lock", label: "Conversation Locks", icon: ShieldAlert },
  { key: "rating_feedback_request", label: "Rating Requests", icon: ShieldAlert },
  { key: "system", label: "System", icon: Bell },
  { key: "viewed", label: "Viewed Products", icon: History },
];

const TYPE_LABELS = {
  smart_search_match: "Search Match",
  partner_request: "Connection Request",
  conversation_lock: "Conversation Lock",
  rating_feedback_request: "Rating Request",
  monthly_summary: "Monthly Summary",
  system: "System",
};

function typeAccent(type = "") {
  const key = String(type || "").toLowerCase();
  if (key === "partner_request") return "bg-[#0A66C2]";
  if (key === "smart_search_match") return "bg-emerald-500";
  if (key === "rating_feedback_request") return "bg-amber-500";
  if (key === "monthly_summary") return "bg-indigo-500";
  if (key === "conversation_lock") return "bg-rose-500";
  return "bg-slate-400";
}

function feedLinkForEntity(entityType, entityId) {
  if (!entityType || !entityId) return "/feed";
  return `/feed?item=${encodeURIComponent(`${entityType}:${entityId}`)}`;
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ children, tone = "slate" }) {
  const tones = {
    emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
    blue: "bg-sky-500/10 text-sky-300 ring-sky-400/20",
    rose: "bg-rose-500/10 text-rose-300 ring-rose-400/20",
    amber: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
    slate: "bg-slate-500/10 text-slate-300 ring-slate-400/20",
    sky: "bg-cyan-500/10 text-cyan-300 ring-cyan-400/20",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", tones[tone] || tones.slate)}>
      {children}
    </span>
  );
}

function ActionButton({ children, variant = "primary", onClick }) {
  const styles = {
    primary: "bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400",
    ghost: "bg-white/5 text-slate-200 ring-1 ring-white/10 hover:bg-white/10",
    danger: "bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/20 hover:bg-rose-500/15",
    success: "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20 hover:bg-emerald-500/15",
  };
  return (
    <button
      onClick={onClick}
      className={cn("inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98]", styles[variant])}
    >
      {children}
    </button>
  );
}

function getRelativeTone(type) {
  switch (type) {
    case "smart_search_match": return "emerald";
    case "partner_request": return "blue";
    case "conversation_lock": return "rose";
    case "rating_feedback_request": return "amber";
    case "viewed": return "sky";
    default: return "slate";
  }
}

export default function NotificationsCenter() {
  const token = useMemo(() => getToken(), []);
  const user = useMemo(() => getCurrentUser(), []);
  const reduceMotion = useReducedMotion();
  const [theme, setTheme] = useState("dark");
  const [tab, setTab] = useState("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [livePulse, setLivePulse] = useState(true);

  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [views, setViews] = useState([]);
  const [viewsCursor, setViewsCursor] = useState(0);
  const [viewsNext, setViewsNext] = useState(null);
  const [loadingViews, setLoadingViews] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/notifications", { token });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadAlerts = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiRequest("/notifications/search-alerts", { token });
      setAlerts(Array.isArray(data) ? data : []);
    } catch {
      setAlerts([]);
    }
  }, [token]);

  const loadViews = useCallback(
    async ({ reset }) => {
      if (!token) return;
      const cursor = reset ? 0 : viewsCursor;
      setLoadingViews(true);
      try {
        const data = await apiRequest(`/products/views/me?cursor=${cursor}&limit=10`, { token });
        const rows = Array.isArray(data?.items) ? data.items : [];
        setViews((prev) => (reset ? rows : [...prev, ...rows]));
        setViewsCursor(reset ? 10 : cursor + 10);
        setViewsNext(data?.next_cursor ?? null);
      } catch {
        if (reset) setViews([]);
        setViewsNext(null);
      } finally {
        setLoadingViews(false);
      }
    },
    [token, viewsCursor],
  );

  useEffect(() => {
    loadNotifications();
    loadAlerts();
  }, [loadAlerts, loadNotifications]);

  useEffect(() => {
    if (!token) return undefined;
    connectNotificationsRealtime(token);
    const unsubscribe = subscribeNotificationsRealtime((msg) => {
      if (!msg) return;
      if (msg.type === "notification_created" && msg.notification?.id) {
        setItems((prev) => {
          const exists = prev.some((n) => String(n?.id) === String(msg.notification.id));
          if (exists) return prev;
          return [msg.notification, ...prev];
        });
      }
      if (msg.type === "notification_read" && msg.id) {
        setItems((prev) =>
          prev.map((n) => String(n?.id) === String(msg.id) ? { ...n, read: true } : n),
        );
      }
    });
    return unsubscribe;
  }, [token]);

  useEffect(() => {
    if (tab !== "viewed") return;
    if (views.length) return;
    loadViews({ reset: true });
  }, [loadViews, tab, views.length]);

  async function markRead(id) {
    if (!token || !id) return;
    await apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH", token });
    setItems((prev) =>
      prev.map((n) => String(n?.id) === String(id) ? { ...n, read: true } : n),
    );
  }

  async function respondPartnerRequest(requestId, action, notificationId) {
    if (!token || !requestId) return;
    await apiRequest(`/partners/requests/${encodeURIComponent(requestId)}/${action}`, { method: "POST", token });
    if (notificationId) {
      await apiRequest(`/notifications/${encodeURIComponent(notificationId)}/read`, { method: "PATCH", token });
      setItems((prev) =>
        prev.map((n) => String(n?.id) === String(notificationId) ? { ...n, read: true } : n),
      );
    }
  }

  async function deleteAlert(id) {
    if (!token || !id) return;
    await apiRequest(`/notifications/search-alerts/${encodeURIComponent(id)}`, { method: "DELETE", token });
    await loadAlerts();
  }

  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      if (unreadOnly && it.read) return false;
      if (tab === "all") return it.type !== "viewed";
      if (tab === "viewed") return false;
      return it.type === tab;
    });
  }, [items, tab, unreadOnly]);

  const unreadCount = items.filter((n) => !n.read).length;

  const refreshViewed = () => {
    setViews((prev) => [...prev]);
    setLivePulse(true);
    window.setTimeout(() => setLivePulse(false), 1200);
    loadViews({ reset: true });
  };

  const pageBg = theme === "dark" ? "bg-[#07111f] text-slate-100" : "bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-900";
  const cardBg = theme === "dark" ? "bg-white/5 border-white/10 shadow-2xl shadow-black/20" : "bg-white/75 border-sky-100 shadow-xl shadow-sky-100/50 backdrop-blur";
  const softBg = theme === "dark" ? "bg-white/5" : "bg-slate-900/5";
  const subtleText = theme === "dark" ? "text-slate-400" : "text-slate-600";
  const mutedText = theme === "dark" ? "text-slate-300" : "text-slate-700";

  return (
    <div className={cn("min-h-screen transition-colors duration-500", pageBg)}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-sky-500/20 via-cyan-400/10 to-transparent blur-3xl" />

        <div className={cn("overflow-hidden rounded-[28px] border p-5 sm:p-6 lg:p-8", cardBg)}>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[2]">
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
                    <path d="M9 17a3 3 0 0 0 6 0" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Notifications</h1>
                  <p className={cn("mt-1 text-sm sm:text-base", subtleText)}>Smart search matches, system alerts, and your viewed history.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200">
                  <span className={cn("h-2 w-2 rounded-full", livePulse ? "animate-pulse bg-emerald-400" : "bg-sky-400")} />
                  Live updates enabled
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <label className={cn("inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium", softBg, theme === "dark" ? "border-white/10" : "border-sky-100")}>
                  <input
                    type="checkbox"
                    checked={unreadOnly}
                    onChange={(e) => setUnreadOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-sky-400 text-sky-500 focus:ring-sky-400"
                  />
                  <span>Unread only</span>
                  <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-xs text-sky-300">{unreadCount}</span>
                </label>

                <div className="ml-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 shadow-lg shadow-black/10">
                  <button onClick={() => setTheme("dark")} className={cn("rounded-xl px-4 py-2 text-sm font-semibold transition", theme === "dark" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-slate-200")}>Dark</button>
                  <button onClick={() => setTheme("light")} className={cn("rounded-xl px-4 py-2 text-sm font-semibold transition", theme === "light" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-slate-200")}>Light</button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {TABS.map((item) => {
                  const active = tab === item.key;
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.key}
                      type="button"
                      onClick={() => setTab(item.key)}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      className={cn("inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200", active ? "border-sky-400/40 bg-sky-500 text-white shadow-lg shadow-sky-500/20" : cn("border-white/10", softBg, "hover:bg-white/10", mutedText))}
                    >
                      {active ? (
                        <motion.span layoutId="notif-tab" className="absolute inset-0 rounded-2xl bg-sky-500/20" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                      ) : null}
                      <span className="relative inline-flex items-center gap-2"><Icon size={16} />{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className={cn("w-full max-w-sm rounded-3xl border p-5", softBg, theme === "dark" ? "border-white/10" : "border-sky-100")}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-sky-300">Real-time feed</div>
                  <div className={cn("mt-1 text-xs", subtleText)}>WebSocket updates appear instantly at the top.</div>
                </div>
                <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-300 ring-1 ring-sky-400/20">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
                    <path d="M5 12h14" />
                    <path d="M13 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Stat label="Unread" value={String(unreadCount)} />
                <Stat label="Alerts" value={String(alerts.length)} />
                <Stat label="Viewed" value={String(views.length)} />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <section className={cn("rounded-[28px] border p-4 sm:p-5", cardBg)}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Notifications feed</h2>
                    <p className={cn("mt-1 text-sm", subtleText)}>
                      {tab === "viewed" ? "Showing viewed products history from Quick View." : "All notification types except Viewed Products are grouped here."}
                    </p>
                  </div>
                  <div className={cn("rounded-2xl px-4 py-2 text-sm", softBg, subtleText)}>
                    Showing {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"}
                  </div>
                </div>

                <div className="space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={`notif-skel-${i}`} className={cn("rounded-3xl border p-4", cardBg)}>
                          <div className="h-4 w-1/3 rounded-full bg-slate-400/20 animate-pulse" />
                          <div className="mt-3 h-3 w-2/3 rounded-full bg-slate-400/20 animate-pulse" />
                          <div className="mt-2 h-3 w-1/2 rounded-full bg-slate-400/20 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-sm text-rose-300">{error}</div>
                  ) : filteredItems.length === 0 ? (
                    <EmptyState title="No notifications found" description="Try changing the tab or turning off the unread-only filter." />
                  ) : (
                    filteredItems.map((item) => (
                      <NotificationCard
                        key={item.id}
                        item={item}
                        theme={theme}
                        user={user}
                        onMarkRead={() => markRead(item.id)}
                        onAccept={() => respondPartnerRequest(item?.meta?.request_id || item.entity_id, "accept", item.id)}
                        onReject={() => respondPartnerRequest(item?.meta?.request_id || item.entity_id, "reject", item.id)}
                      />
                    ))
                  )}
                </div>
              </section>

              {tab === "viewed" && (
                <section className={cn("rounded-[28px] border p-4 sm:p-5", cardBg)}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold">Viewed Products</h2>
                        <Badge tone="sky">Private to you</Badge>
                      </div>
                      <p className={cn("mt-1 text-sm", subtleText)}>Recorded on Quick View. This history helps you revisit products quickly.</p>
                    </div>
                    <button onClick={refreshViewed} className="inline-flex items-center gap-2 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/15">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
                        <path d="M20 12a8 8 0 1 1-2.34-5.66" />
                        <path d="M20 4v6h-6" />
                      </svg>
                      Refresh
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {loadingViews ? (
                      <div className="text-sm text-slate-400">Loading...</div>
                    ) : views.length === 0 ? (
                      <EmptyState title="No viewed products yet" description="View products from the search page to see them here." />
                    ) : (
                      views.map((row) => (
                        <ViewedCard
                          key={row.id}
                          product={row}
                          theme={theme}
                          onQuickView={() => setQuickViewItem({ ...row.product, author: row.author })}
                        />
                      ))
                    )}
                  </div>

                  {viewsNext !== null && !loadingViews && (
                    <div className="mt-5 flex justify-center">
                      <button onClick={() => loadViews({ reset: false })} className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400">
                        Load more
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <section className={cn("rounded-[28px] border p-4 sm:p-5", cardBg)}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">Saved Search Alerts</h3>
                    <p className={cn("mt-1 text-sm", subtleText)}>These power smart notifications for new matching posts.</p>
                  </div>
                  <Badge tone="blue">Active</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {alerts.length === 0 ? (
                    <EmptyState title="No saved alerts yet." description="Save an alert from the search page." compact />
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className={cn("flex items-center justify-between gap-4 rounded-2xl border p-4", theme === "dark" ? "border-white/10 bg-white/5" : "border-sky-100 bg-white/80")}>
                        <div>
                          <div className="font-semibold text-slate-100 dark:text-slate-900">{alert.query}</div>
                          <div className={cn("mt-1 text-xs", subtleText)}>Updated {new Date(alert.updated_at || alert.created_at).toLocaleDateString()}</div>
                        </div>
                        <button onClick={() => deleteAlert(alert.id)} className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300" aria-label="Delete alert">
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M6 6l1 14h10l1-14" />
                            <path d="M10 11v5" />
                            <path d="M14 11v5" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className={cn("rounded-[28px] border p-4 sm:p-5", cardBg)}>
                <h3 className="text-lg font-bold">Tips</h3>
                <div className="mt-4 space-y-3 text-sm leading-6">
                  <TipItem tone="emerald" text="Smart matches trigger when new buyer requests or products match your saved alert keywords." />
                  <TipItem tone="blue" text="Use verification and credibility signals to reduce fraud risk before accepting requests." />
                  <TipItem tone="sky" text="Viewed history is private and helps you revisit products quickly without losing context." />
                </div>
              </section>

              <section className={cn("rounded-[28px] border p-4 sm:p-5", cardBg)}>
                <h3 className="text-lg font-bold">API endpoints</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <ApiChip method="GET" path="/notifications" />
                  <ApiChip method="PATCH" path="/notifications/:id/read" />
                  <ApiChip method="DELETE" path="/notifications/search-alerts/:id" />
                  <ApiChip method="GET" path="/products/views/me" />
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      {quickViewItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center">
          <div className={cn("w-full max-w-2xl rounded-[28px] border p-5 shadow-2xl", theme === "dark" ? "border-white/10 bg-[#0b1324]" : "border-sky-100 bg-white")}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black">Quick View</h3>
                <p className={cn("mt-1 text-sm", subtleText)}>Full product details preview.</p>
              </div>
              <button onClick={() => setQuickViewItem(null)} className="rounded-2xl bg-white/5 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10">Close</button>
            </div>

            <div className={cn("mt-5 grid gap-4 rounded-3xl border p-5 sm:grid-cols-[1.6fr_1fr]", theme === "dark" ? "border-white/10 bg-white/5" : "border-sky-100 bg-sky-50/50")}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="sky">Product</Badge>
                  <Badge tone="blue">Company profile</Badge>
                </div>
                <h4 className="mt-3 text-xl font-bold">{quickViewItem.product?.title || quickViewItem.title || "Product"}</h4>
                <p className={cn("mt-2 text-sm leading-6", mutedText)}>{quickViewItem.product?.description || quickViewItem.description || "--"}</p>
                <div className="mt-4 flex gap-3">
                  <ActionButton variant="primary">Quick view</ActionButton>
                  <ActionButton variant="ghost">Company page</ActionButton>
                </div>
              </div>
              <div className={cn("rounded-3xl border p-4", theme === "dark" ? "border-white/10 bg-black/20" : "border-sky-100 bg-white")}>
                <DetailRow label="Company" value={quickViewItem.author?.name || quickViewItem.companyName || "--"} />
                <DetailRow label="Viewed" value={quickViewItem.viewed_at ? new Date(quickViewItem.viewed_at).toLocaleDateString() : "--"} />
                <DetailRow label="Category" value={quickViewItem.product?.category || quickViewItem.category || "--"} />
                <DetailRow label="MOQ" value={quickViewItem.product?.moq || quickViewItem.moq || "--"} />
                <DetailRow label="Lead time" value={quickViewItem.product?.lead_time_days || quickViewItem.leadTime || "--"} />
              </div>
            </div>
          </div>
        </div>
      )}

      <ProductQuickViewModal
        open={Boolean(quickViewItem)}
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onViewed={() => loadViews({ reset: true })}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
      <div className="text-xl font-black text-sky-300">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</div>
    </div>
  );
}

function TipItem({ tone, text }) {
  const dot = { emerald: "bg-emerald-400", blue: "bg-sky-400", sky: "bg-cyan-400" };
  return (
    <div className="flex gap-3">
      <span className={cn("mt-2 h-2.5 w-2.5 rounded-full shrink-0", dot[tone] || dot.sky)} />
      <p className="text-slate-300 dark:text-slate-700">{text}</p>
    </div>
  );
}

function ApiChip({ method, path }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
      <span className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-300">{method}</span>
      <code className="text-xs text-slate-300">{path}</code>
    </div>
  );
}

function EmptyState({ title, description, compact = false }) {
  return (
    <div className={cn("rounded-3xl border border-dashed border-white/10 bg-white/5 text-center", compact ? "p-5" : "p-8")}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[2]">
          <path d="M12 4v16" />
          <path d="M4 12h16" />
        </svg>
      </div>
      <h4 className="mt-4 text-base font-bold">{title}</h4>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function NotificationCard({ item, theme, user, onMarkRead, onAccept, onReject }) {
  const tone = getRelativeTone(item.type);
  const borderClass = theme === "dark" ? "border-white/10 bg-white/5" : "border-sky-100 bg-white/80";

  return (
    <div className={cn("group rounded-3xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl", borderClass, !item.read ? "ring-1 ring-sky-400/20" : "")}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={tone}>{TYPE_LABELS[item.type] || "Update"}</Badge>
            {!item.read && <Badge tone="emerald">New</Badge>}
            {item?.meta?.request_id && (
              <span className="rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-300 ring-1 ring-white/10">{item.meta.request_id}</span>
            )}
          </div>
          <h3 className="mt-3 text-lg font-bold leading-7">{item.message || item.title || "Notification"}</h3>
          <p className={cn("mt-2 text-sm leading-6", theme === "dark" ? "text-slate-300" : "text-slate-700")}>{item.message}</p>
          <div className={cn("mt-3 flex flex-wrap items-center gap-2 text-xs", theme === "dark" ? "text-slate-400" : "text-slate-600")}>
            <span>{new Date(item.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
          {item.type === "partner_request" && (user?.role === "factory" || user?.role === "admin" || user?.role === "owner") && (
            <>
              <ActionButton variant="success" onClick={onAccept}>Accept</ActionButton>
              <ActionButton variant="danger" onClick={onReject}>Reject</ActionButton>
            </>
          )}
          {item.type === "rating_feedback_request" ? (
            <Link to={`/ratings/feedback?profile_key=${encodeURIComponent(item?.entity_id || item?.meta?.profile_key || "")}`} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center">Rate now</Link>
          ) : item.entity_type ? (
            <Link to={feedLinkForEntity(item.entity_type, item.entity_id)} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center">View</Link>
          ) : null}
          {!item.read && <ActionButton variant="ghost" onClick={onMarkRead}>Mark read</ActionButton>}
        </div>
      </div>
    </div>
  );
}

function ViewedCard({ product, theme, onQuickView }) {
  return (
    <div className={cn("rounded-3xl border p-4", theme === "dark" ? "border-white/10 bg-white/5" : "border-sky-100 bg-white/85")}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="sky">Viewed</Badge>
            <Badge tone="blue">{product.product?.category || product.category || "--"}</Badge>
          </div>
          <h3 className="mt-3 text-lg font-bold">{product.product?.title || product.title || "Product"}</h3>
          <div className={cn("mt-1 text-sm", theme === "dark" ? "text-slate-300" : "text-slate-700")}>
            {product.author?.name || product.company || "--"} · Viewed {new Date(product.viewed_at).toLocaleDateString()}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">MOQ {product.product?.moq || product.moq || "--"}</span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">Lead time {product.product?.lead_time_days || product.leadTime || "--"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <ActionButton variant="primary" onClick={onQuickView}>Quick view</ActionButton>
          {product.author?.id && (
            <Link to={product.author.role === "buying_house" ? `/buying-house/${product.author.id}` : `/factory/${product.author.id}`} className="rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004182] text-center">Company</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:mb-0 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-100 dark:text-slate-900">{value}</span>
    </div>
  );
}