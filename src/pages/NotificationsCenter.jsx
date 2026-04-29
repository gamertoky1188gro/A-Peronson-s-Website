import React, { useMemo, useState } from "react";

const TABS = [
  { key: "all", label: "All" },
  { key: "search", label: "Search Matches" },
  { key: "partner", label: "Partner Requests" },
  { key: "locks", label: "Conversation Locks" },
  { key: "ratings", label: "Rating Requests" },
  { key: "system", label: "System" },
  { key: "viewed", label: "Viewed Products" },
];

const notificationsSeed = [
  {
    id: 1,
    type: "search",
    label: "Search Match",
    title: "New buyer request matches your alert: 'denim jacket supplier'.",
    message: "A new buyer request matches your saved keywords and looks relevant to your profile.",
    timestamp: "2026-04-29 09:12",
    unread: true,
    accent: "emerald",
  },
  {
    id: 2,
    type: "partner",
    label: "Connection Request",
    title: "Factory NovaTex sent a partnership request.",
    message: "A verified factory is requesting to connect for sourcing and quotation updates.",
    timestamp: "2026-04-29 08:48",
    unread: true,
    requestId: "PR-48291",
    accent: "blue",
    canModerate: true,
  },
  {
    id: 3,
    type: "locks",
    label: "Conversation Lock",
    title: "A conversation was locked after an important update.",
    message: "The thread is now locked so you can review the latest confirmed information safely.",
    timestamp: "2026-04-28 22:31",
    unread: false,
    accent: "rose",
  },
  {
    id: 4,
    type: "ratings",
    label: "Rating Request",
    title: "Please rate your recent supplier experience.",
    message: "Your feedback helps improve supplier visibility and credibility for the marketplace.",
    timestamp: "2026-04-28 19:06",
    unread: true,
    accent: "amber",
  },
  {
    id: 5,
    type: "system",
    label: "System",
    title: "Your monthly activity summary is ready.",
    message: "You viewed 24 products, saved 3 alerts, and received 8 matched notifications this month.",
    timestamp: "2026-04-28 17:45",
    unread: false,
    accent: "slate",
  },
  {
    id: 6,
    type: "viewed",
    label: "Viewed Product",
    title: "Premium brushed fleece hoodie",
    message: "Quick View history saved from your previous browsing session.",
    timestamp: "2026-04-28 15:20",
    unread: false,
    companyName: "SkyLine Apparel Ltd.",
    viewedDate: "2026-04-28",
    category: "Knitwear",
    moq: "500 pcs",
    leadTime: "18 days",
    accent: "sky",
  },
  {
    id: 7,
    type: "search",
    label: "Search Match",
    title: "New product listing matches your alert: 'organic cotton t-shirt'.",
    message: "A new listing now fits your saved search and may be a strong sourcing option.",
    timestamp: "2026-04-28 10:09",
    unread: false,
    accent: "emerald",
  },
  {
    id: 8,
    type: "partner",
    label: "Connection Request",
    title: "Admin request from Orion Sourcing has been received.",
    message: "This partner request is awaiting review. Accept or reject based on your workflow.",
    timestamp: "2026-04-27 21:14",
    unread: false,
    requestId: "PR-47905",
    accent: "blue",
    canModerate: true,
  },
];

const savedAlertsSeed = [
  { id: 1, query: '"denim jacket supplier"', updated: "2026-04-29" },
  { id: 2, query: '"organic cotton t-shirt"', updated: "2026-04-28" },
  { id: 3, query: '"private label hoodie"', updated: "2026-04-26" },
];

const viewedProductsSeed = [
  {
    id: 1,
    title: "Premium brushed fleece hoodie",
    company: "SkyLine Apparel Ltd.",
    viewedDate: "2026-04-28",
    category: "Knitwear",
    moq: "500 pcs",
    leadTime: "18 days",
    description:
      "Soft heavyweight hoodie with brushed interior, custom labels, and export-ready finishing.",
  },
  {
    id: 2,
    title: "Slim-fit denim jacket",
    company: "BluePeak Manufacturing",
    viewedDate: "2026-04-27",
    category: "Outerwear",
    moq: "300 pcs",
    leadTime: "22 days",
    description:
      "Mid-wash denim jacket with premium stitching, metal buttons, and low-MOQ production.",
  },
  {
    id: 3,
    title: "Organic cotton jersey tee",
    company: "NovaTex Apparel",
    viewedDate: "2026-04-25",
    category: "T-Shirts",
    moq: "1000 pcs",
    leadTime: "12 days",
    description:
      "Smooth combed jersey, eco-conscious fabrication, and scalable OEM/ODM support.",
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Icon({ children, className = "" }) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      {children}
    </span>
  );
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
    primary:
      "bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400",
    ghost:
      "bg-white/5 text-slate-200 ring-1 ring-white/10 hover:bg-white/10",
    danger:
      "bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/20 hover:bg-rose-500/15",
    success:
      "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20 hover:bg-emerald-500/15",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
        styles[variant]
      )}
    >
      {children}
    </button>
  );
}

function getRelativeTone(type) {
  switch (type) {
    case "search":
      return "emerald";
    case "partner":
      return "blue";
    case "locks":
      return "rose";
    case "ratings":
      return "amber";
    case "viewed":
      return "sky";
    default:
      return "slate";
  }
}

function NotificationPage() {
  const [theme, setTheme] = useState("dark");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState(notificationsSeed);
  const [alerts, setAlerts] = useState(savedAlertsSeed);
  const [viewedProducts, setViewedProducts] = useState(viewedProductsSeed);
  const [quickView, setQuickView] = useState(null);
  const [loadedCount, setLoadedCount] = useState(2);
  const [livePulse, setLivePulse] = useState(true);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const passTab =
        tab === "all"
          ? item.type !== "viewed"
          : tab === "viewed"
            ? item.type === "viewed"
            : item.type === tab;
      const passUnread = unreadOnly ? item.unread : true;
      return passTab && passUnread;
    });
  }, [notifications, tab, unreadOnly]);

  const visibleViewed = viewedProducts.slice(0, loadedCount);
  const remainingViewed = Math.max(0, viewedProducts.length - loadedCount);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const acceptRequest = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, unread: false, title: `${n.title} Accepted`, message: "The partner request was accepted and the conversation has been opened." }
          : n
      )
    );
  };

  const rejectRequest = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const deleteAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const loadMoreViewed = () => setLoadedCount((c) => Math.min(viewedProducts.length, c + 2));

  const refreshViewed = () => {
    setViewedProducts((prev) => [...prev]);
    setLivePulse(true);
    window.setTimeout(() => setLivePulse(false), 1200);
  };

  const openQuickView = (product) => setQuickView(product);

  const pageBg =
    theme === "dark"
      ? "bg-[#07111f] text-slate-100"
      : "bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-900";
  const cardBg =
    theme === "dark"
      ? "bg-white/5 border-white/10 shadow-2xl shadow-black/20"
      : "bg-white/75 border-sky-100 shadow-xl shadow-sky-100/50 backdrop-blur";
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
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Notifications
                  </h1>
                  <p className={cn("mt-1 text-sm sm:text-base", subtleText)}>
                    Smart search matches, system alerts, and your viewed history.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200">
                  <span className={cn("h-2 w-2 rounded-full", livePulse ? "animate-pulse bg-emerald-400" : "bg-sky-400")} />
                  Live updates enabled
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <label className={cn("inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium", softBg, theme === "dark" ? "border-white/10" : "border-sky-100") }>
                  <input
                    type="checkbox"
                    checked={unreadOnly}
                    onChange={(e) => setUnreadOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-sky-400 text-sky-500 focus:ring-sky-400"
                  />
                  <span>Unread only</span>
                  <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-xs text-sky-300">
                    {unreadCount}
                  </span>
                </label>

                <div className="ml-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 shadow-lg shadow-black/10">
                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-semibold transition",
                      theme === "dark" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-semibold transition",
                      theme === "light" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Light
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {TABS.map((item) => {
                  const active = tab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      className={cn(
                        "rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                        active
                          ? "border-sky-400/40 bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                          : cn("border-white/10", softBg, "hover:bg-white/10", mutedText)
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={cn("w-full max-w-sm rounded-3xl border p-5", softBg, theme === "dark" ? "border-white/10" : "border-sky-100") }>
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
                <Stat label="Viewed" value={String(viewedProducts.length)} />
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
                      {tab === "viewed"
                        ? "Showing viewed products history from Quick View."
                        : "All notification types except Viewed Products are grouped here."}
                    </p>
                  </div>
                  <div className={cn("rounded-2xl px-4 py-2 text-sm", softBg, subtleText)}>
                    Showing {visibleNotifications.length} item{visibleNotifications.length === 1 ? "" : "s"}
                  </div>
                </div>

                <div className="space-y-3">
                  {visibleNotifications.length === 0 ? (
                    <EmptyState title="No notifications found" description="Try changing the tab or turning off the unread-only filter." />
                  ) : (
                    visibleNotifications.map((item) => (
                      <NotificationCard
                        key={item.id}
                        item={item}
                        theme={theme}
                        onMarkRead={() => markRead(item.id)}
                        onAccept={() => acceptRequest(item.id)}
                        onReject={() => rejectRequest(item.id)}
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
                      <p className={cn("mt-1 text-sm", subtleText)}>
                        Recorded on Quick View. This history helps you revisit products quickly.
                      </p>
                    </div>
                    <button
                      onClick={refreshViewed}
                      className="inline-flex items-center gap-2 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/15"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
                        <path d="M20 12a8 8 0 1 1-2.34-5.66" />
                        <path d="M20 4v6h-6" />
                      </svg>
                      Refresh
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {visibleViewed.map((product) => (
                      <ViewedCard key={product.id} product={product} theme={theme} onQuickView={() => openQuickView(product)} />
                    ))}
                  </div>

                  {remainingViewed > 0 && (
                    <div className="mt-5 flex justify-center">
                      <button
                        onClick={loadMoreViewed}
                        className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                      >
                        Load more ({remainingViewed})
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
                    <p className={cn("mt-1 text-sm", subtleText)}>
                      These power smart notifications for new matching posts.
                    </p>
                  </div>
                  <Badge tone="blue">Active</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {alerts.length === 0 ? (
                    <EmptyState title="No saved alerts yet." description="Save an alert from the search page." compact />
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          "flex items-center justify-between gap-4 rounded-2xl border p-4",
                          theme === "dark" ? "border-white/10 bg-white/5" : "border-sky-100 bg-white/80"
                        )}
                      >
                        <div>
                          <div className="font-semibold text-slate-100 dark:text-slate-900">{alert.query}</div>
                          <div className={cn("mt-1 text-xs", subtleText)}>Updated {alert.updated}</div>
                        </div>
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                          aria-label="Delete alert"
                        >
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
                  <TipItem
                    tone="emerald"
                    text="Smart matches trigger when new buyer requests or products match your saved alert keywords."
                  />
                  <TipItem
                    tone="blue"
                    text="Use verification and credibility signals to reduce fraud risk before accepting requests."
                  />
                  <TipItem
                    tone="sky"
                    text="Viewed history is private and helps you revisit products quickly without losing context."
                  />
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

      {quickView && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center">
          <div className={cn("w-full max-w-2xl rounded-[28px] border p-5 shadow-2xl", theme === "dark" ? "border-white/10 bg-[#0b1324]" : "border-sky-100 bg-white") }>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black">Quick View</h3>
                <p className={cn("mt-1 text-sm", subtleText)}>Full product details preview.</p>
              </div>
              <button
                onClick={() => setQuickView(null)}
                className="rounded-2xl bg-white/5 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className={cn("mt-5 grid gap-4 rounded-3xl border p-5 sm:grid-cols-[1.6fr_1fr]", theme === "dark" ? "border-white/10 bg-white/5" : "border-sky-100 bg-sky-50/50")}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="sky">Product</Badge>
                  <Badge tone="blue">Company profile</Badge>
                </div>
                <h4 className="mt-3 text-xl font-bold">{quickView.title}</h4>
                <p className={cn("mt-2 text-sm leading-6", mutedText)}>{quickView.description}</p>
                <div className="mt-4 flex gap-3">
                  <ActionButton variant="primary">Quick view</ActionButton>
                  <ActionButton variant="ghost">Company page</ActionButton>
                </div>
              </div>
              <div className={cn("rounded-3xl border p-4", theme === "dark" ? "border-white/10 bg-black/20" : "border-sky-100 bg-white") }>
                <DetailRow label="Company" value={quickView.company} />
                <DetailRow label="Viewed" value={quickView.viewedDate} />
                <DetailRow label="Category" value={quickView.category} />
                <DetailRow label="MOQ" value={quickView.moq} />
                <DetailRow label="Lead time" value={quickView.leadTime} />
              </div>
            </div>
          </div>
        </div>
      )}
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
  const dot = {
    emerald: "bg-emerald-400",
    blue: "bg-sky-400",
    sky: "bg-cyan-400",
  };
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
      <span className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-300">
        {method}
      </span>
      <code className="text-xs text-slate-300">{path}</code>
    </div>
  );
}

function EmptyState({ title, description, compact = false }) {
  return (
    <div className={cn("rounded-3xl border border-dashed border-white/10 bg-white/5 text-center", compact ? "p-5" : "p-8") }>
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

function NotificationCard({ item, theme, onMarkRead, onAccept, onReject }) {
  const tone = getRelativeTone(item.type);
  const borderClass =
    theme === "dark" ? "border-white/10 bg-white/5" : "border-sky-100 bg-white/80";

  return (
    <div
      className={cn(
        "group rounded-3xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl",
        borderClass,
        item.unread ? "ring-1 ring-sky-400/20" : ""
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={tone}>{item.label}</Badge>
            {item.unread && <Badge tone="emerald">New</Badge>}
            {item.requestId && (
              <span className="rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-300 ring-1 ring-white/10">
                {item.requestId}
              </span>
            )}
          </div>
          <h3 className="mt-3 text-lg font-bold leading-7">{item.title}</h3>
          <p className={cn("mt-2 text-sm leading-6", theme === "dark" ? "text-slate-300" : "text-slate-700")}>{item.message}</p>
          <div className={cn("mt-3 flex flex-wrap items-center gap-2 text-xs", theme === "dark" ? "text-slate-400" : "text-slate-600") }>
            <span>{item.timestamp}</span>
            {item.type === "viewed" && <span>• View history</span>}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
          {item.type === "partner" && item.canModerate && (
            <>
              <ActionButton variant="success" onClick={onAccept}>
                Accept
              </ActionButton>
              <ActionButton variant="danger" onClick={onReject}>
                Reject
              </ActionButton>
            </>
          )}

          {item.type === "ratings" ? (
            <ActionButton variant="primary">Rate now</ActionButton>
          ) : item.type !== "partner" ? (
            <ActionButton variant="ghost">View</ActionButton>
          ) : null}

          {item.unread && (
            <ActionButton variant="ghost" onClick={onMarkRead}>
              Mark read
            </ActionButton>
          )}
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
            <Badge tone="blue">{product.category}</Badge>
          </div>
          <h3 className="mt-3 text-lg font-bold">{product.title}</h3>
          <div className={cn("mt-1 text-sm", theme === "dark" ? "text-slate-300" : "text-slate-700")}>
            {product.company} · Viewed {product.viewedDate}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">MOQ {product.moq}</span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">Lead time {product.leadTime}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <ActionButton variant="primary" onClick={onQuickView}>
            Quick view
          </ActionButton>
          <ActionButton variant="ghost">Company</ActionButton>
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

export default NotificationPage;