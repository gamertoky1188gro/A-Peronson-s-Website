/*
  Route: /pricing
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Present pricing tiers for Buyer, Factory, Buying House (Free vs Premium).
    - Present enterprise-style analytics preview tiles (dynamic, public).
    - Feature comparison table (icons, row hover, no vertical lines).
    - Theme: New sky-blue theme while preserving all functionality.

  Key API endpoints:
    - GET /api/system/pricing  (via `apiRequest('/system/pricing')`)
*/
import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Check } from "lucide-react";
import { apiRequest, getCurrentUser, getToken } from "../lib/auth";
import { useSecureUser } from "../hooks/useSecureUser";

function planKeyForUserRole(role) {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "buyer") return "buyer";
  if (normalized === "factory") return "factory";
  if (normalized === "buying_house") return "buying_house";
  return "buying_house";
}

const defaultPricing = {
  ok: true,
  analytics: {
    tiles: [
      {
        label: "Order completion",
        value: "72%",
        sublabel: "last 30 days",
        accent: "teal",
      },
      {
        label: "Avg. cycle",
        value: "18d",
        sublabel: "request → contract",
        accent: "blue",
      },
      {
        label: "Active orgs",
        value: "24",
        sublabel: "buyers + factories",
        accent: "gold",
      },
      {
        label: "Response SLA",
        value: "1h 10m",
        sublabel: "median",
        accent: "blue",
      },
    ],
  },
  comparisonRows: [
    ["Buyer requests or product posts", "", ""],
    ["Agent IDs / sub-accounts", "Up to 10", "Unlimited"],
    ["Contract Vault storage", "Basic", "Extended"],
    ["Exportable reports", "", ""],
    ["AI auto-reply customization", "", ""],
    ["Analytics page", "Basic", ""],
    ["Search filtering priority", "Standard", "Advanced"],
    ["Priority request placement", "", ""],
    ["Support level", "Standard", "Dedicated"],
    ["Buying pattern analysis", "", ""],
    ["Order Completion Certification", "", ""],
    ["Profile / product boost", "", ""],
  ],
  buyerFree: [
    "Post structured buyer requests",
    "Search factories & suppliers (basic)",
    "Chat & call access",
    "Contract Vault (basic)",
    "Saved searches (limited)",
  ],
  buyerPremium: [
    "Advanced Search Filters",
    "Priority Buyer Request Placement",
    "Dedicated Support",
    "Contract History & Audit Trail",
    "Early Access to New Verified Factories",
    "Buying Pattern Analysis",
    "Order Completion Certification",
    "AI Auto-reply Customization",
    "Smart Supplier Matching",
    "Request Performance Insights",
    "Profile & product boost with increased reach",
  ],
  factoryFree: [
    "Product management",
    "Video gallery (approved media)",
    "Receive buyer requests",
    "Chat & call access",
    "Contract Vault (basic)",
    "Agent IDs / sub-accounts (limit 10)",
  ],
  factoryPremium: [
    "Profile & product boost with increased reach",
    "Advanced analytics (who viewed, inquiry rate)",
    "Priority in search results and filter",
    "AI auto-reply customization",
    "Dedicated account manager",
    "Custom branding on profile",
    "Enterprise analytics dashboard",
    "Unlimited agent/sub-ID creation",
    "Buying Pattern Analysis",
    "Order Completion Certification",
    "Dedicated Support",
    "Contract history & audit trail",
    "Multi-agent management",
    "Multiple team/agent access management",
    "Request factory Performance Insights",
    "Buyer interest analytics",
    "Agent performance analytics and reporting",
    "More product/video posting capacity",
    "Lead distribution across agents",
    "Buyer communication insights",
    "Buyer Request Priority Access",
    "Buyer Conversion Insights",
    "Unlimited Partner Network request accept",
  ],
  houseFree: [
    "Lead workflow basics",
    "Buyer request queue access",
    "Partner Network (Buying House only)",
    "Chat & call access",
    "Contract Vault (basic)",
    "Agent IDs / sub-accounts (limit 10)",
  ],
  housePremium: [
    "Profile & product boost with increased reach",
    "Advanced analytics (who viewed, inquiry rate)",
    "Priority in search results and filter",
    "AI auto-reply customization",
    "Dedicated account manager",
    "Custom branding on profile",
    "Enterprise analytics dashboard",
    "Unlimited agent/sub-ID creation",
    "Buying Pattern Analysis",
    "Order Completion Certification",
    "Dedicated Support",
    "Contract history & audit trail",
    "Multi-agent management",
    "Multiple team/agent access management",
    "Request Buying House Performance Insights",
    "Buyer interest analytics",
    "Agent performance analytics and reporting",
    "More product/video posting capacity",
    "Lead distribution across agents",
    "Buyer communication insights",
    "Buyer Request Priority Access",
    "Buyer Conversion Insights",
    "Unlimited Partner Network Access",
  ],
  faqs: [
    { q: "Can I upgrade anytime?", a: "Yes — your data stays intact." },
    { q: "Can I downgrade?", a: "Yes — plan limits apply immediately." },
    {
      q: "Does GarTexHub handle payments?",
      a: "Not yet. The platform focuses on workflow + coordination. Premium can be activated via promo coupon without a card when eligible.",
    },
    { q: "Are calls recorded?", a: "Yes — for documentation and compliance." },
  ],
  sectionTitles: {
    plans: {
      eyebrow: "Simple, transparent pricing",
      title:
        "Choose the surface you need today — upgrade when your team scales.",
      subtitle:
        "Role-specific plans keep workflows clean for buyers, factories, and buying houses. Start free, then move into premium when you need analytics, priority placement, export-ready reporting, and secure contract history.",
    },
    enterprise: {
      eyebrow: "Why enterprise matters",
      title: "When your team scales, structure beats noise.",
      subtitle: "Premium keeps workflows conflict-free and audit-ready.",
      items: [
        "Team scale without limits",
        "Decision-ready visibility",
        "Secure contract trail",
        "Verified trust signals",
      ],
    },
    premiumFeatures: {
      eyebrow: "Premium feature deep dive",
      title: "A role-specific roundup of what the Premium plan unlocks.",
      subtitle:
        "Buyer, Factory, and Buying House teams all get the right controls, analytics, and trust signals — without bloated UI or confusing add-ons.",
    },
    analytics: {
      eyebrow: "Analytics snapshot",
      title: "Decision-ready metrics without spreadsheet UI.",
      subtitle:
        "Auto-sorted, calm, and clean — the data feels like part of the product instead of a separate dashboard.",
    },
    comparison: {
      eyebrow: "Comparison",
      title: "Feature comparison",
      subtitle: "A clear line-by-line look at the Free and Premium surfaces.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Short answers, no sales noise.",
      subtitle: "Everything important, kept simple.",
    },
    cta: {
      eyebrow: "Ready for serious sourcing",
      title: "Build a structured textile network today",
      subtitle:
        "Start free, upgrade when your org needs analytics, export, and secure contract management.",
    },
  },
};

const _statCards = [
  { label: "Order completion", value: "72%", meta: "last 30 days", icon: "📊" },
  { label: "Avg. cycle", value: "18d", meta: "request → contract", icon: "📈" },
  { label: "Active orgs", value: "24", meta: "buyers + factories", icon: "👥" },
  { label: "Response SLA", value: "1h 10m", meta: "median", icon: "🔒" },
];

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm backdrop-blur dark:text-sky-200">
        <span>✨</span>
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureList({ items, accent = false }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
        >
          <span
            className={
              accent
                ? "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-200"
                : "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10"
            }
          >
            <Check className="h-3.5 w-3.5" />
          </span>
          <span className="leading-6">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PlanCard({
  title,
  role,
  price,
  description,
  features,
  buttonLabel,
  highlighted,
  icon,
}) {
  const IconComponent = icon;
  return (
    <div
      className={
        "relative overflow-hidden rounded-3xl border p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 dark:shadow-[0_20px_60px_rgba(2,8,23,0.4)] " +
        (highlighted
          ? "border-sky-500/30 bg-gradient-to-b from-sky-50 via-white to-white dark:from-sky-950/60 dark:via-slate-950 dark:to-slate-950"
          : "border-slate-200/80 bg-white/85 dark:border-white/10 dark:bg-white/5")
      }
    >
      {highlighted && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />
      )}
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-200">
              {role}
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-500/10 bg-sky-500/10 p-3 text-sky-700 dark:text-sky-200">
            <span className="text-2xl">{IconComponent}</span>
          </div>
        </div>

        <div className="mt-6 flex items-end gap-2">
          <div className="text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {price}
          </div>
          <div className="pb-2 text-sm text-slate-500 dark:text-slate-400">
            per month
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
          <FeatureList items={features} accent={highlighted} />
        </div>

        <div className="mt-6">
          <Link
            to="/signup"
            className={
              "group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 " +
              (highlighted
                ? "bg-slate-900 text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                : "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-sky-400 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-sky-400 dark:hover:text-sky-200")
            }
          >
            {buttonLabel}
            <span className="h-4 w-4 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ tiles = [], loading = false, loadError = "" }) {
  const metrics = useMemo(
    () => [
      { label: "Order completion", value: "72%" },
      { label: "Avg. cycle", value: "18d" },
      { label: "Active orgs", value: "24" },
      { label: "Response SLA", value: "1h 10m" },
    ],
    [],
  );

  const displayMetrics = tiles.length > 0 ? tiles : metrics;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-500/15 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.12)] dark:border-sky-400/20 dark:from-sky-950/60 dark:via-slate-950 dark:to-slate-900">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(34,197,94,0.12)]" />
          Live
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5 animate-pulse"
                >
                  <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="mt-2 h-8 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </>
          ) : (
            displayMetrics.slice(0, 4).map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {m.label}
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {m.value}
                </div>
              </div>
            ))
          )}
        </div>
        {loadError && (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
            {loadError}
          </p>
        )}
      </div>
    </div>
  );
}

function ComparisonTable({ comparisonRows = [] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(2,8,23,0.4)]">
      <div className="border-b border-slate-200/80 px-6 py-4 dark:border-white/10">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          Feature comparison
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Horizontal lines only. Clear, audit-ready differences.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            <tr>
              <th className="px-6 py-4 font-medium">Feature</th>
              <th className="px-6 py-4 font-medium">Free</th>
              <th className="px-6 py-4 font-medium">Premium</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-white/10">
            {comparisonRows.map(([feature, free, premium]) => (
              <tr key={feature} className="text-slate-700 dark:text-slate-200">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {feature}
                </td>
                <td className="px-6 py-4">
                  {free || (
                    <span
                      className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500/80"
                      aria-label="Included"
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  {premium || (
                    <span
                      className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500/80"
                      aria-label="Included"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:border-sky-400/40 hover:shadow-md dark:border-white/10 dark:bg-white/5"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-semibold text-slate-900 dark:text-white">
          {q}
        </span>
        <span
          className={
            "h-5 w-5 shrink-0 text-slate-500 transition-transform dark:text-slate-300 " +
            (open ? "rotate-180" : "")
          }
        >
          ⌄
        </span>
      </div>
      {open && (
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {a}
        </p>
      )}
    </button>
  );
}

export default function PricingPage() {
  const location = useLocation();
  const [pricing, setPricing] = useState(defaultPricing);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return true;
  });

  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setDark(isDark);
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  const sessionUser = getCurrentUser();
  const { user: secureUser } = useSecureUser();
  const token = getToken();
  const isLoggedIn = Boolean(token && sessionUser);
  const userRole = secureUser?.role || sessionUser?.role;
  const activePlanKey = isLoggedIn ? planKeyForUserRole(userRole) : "neutral";

  useEffect(() => {
    if (typeof window !== "undefined" && location?.hash) {
      const id = String(location.hash || "").replace(/^#/, "");
      if (id) {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    }

    let alive = true;
    const controller = new AbortController();

    apiRequest("/system/pricing", { signal: controller.signal })
      .then((data) => {
        if (!alive) return;
        if (data?.ok && data?.analytics?.tiles) setPricing(data);
      })
      .catch((err) => {
        if (!alive) return;
        if (err?.name === "AbortError") return;
        setLoadError(String(err?.message || "Failed to load analytics"));
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [location.hash]);

  const plansByRole = useMemo(
    () => ({
      buyer: {
        Free: pricing?.buyerFree || defaultPricing.buyerFree,
        Premium: pricing?.buyerPremium || defaultPricing.buyerPremium,
      },
      factory: {
        Free: pricing?.factoryFree || defaultPricing.factoryFree,
        Premium: pricing?.factoryPremium || defaultPricing.factoryPremium,
      },
      buying_house: {
        Free: pricing?.houseFree || defaultPricing.houseFree,
        Premium: pricing?.housePremium || defaultPricing.housePremium,
      },
      neutral: {
        Free: [
          "Structured buyer requests or product posts",
          "Basic search and messaging access",
          "Contract Vault (basic)",
          "Saved searches (limited)",
        ],
        Premium: pricing?.buyerPremium || defaultPricing.buyerPremium,
      },
    }),
    [pricing],
  );

  const comparisonRows =
    pricing?.comparisonRows || defaultPricing.comparisonRows;
  const faqs = pricing?.faqs || defaultPricing.faqs;
  const _sectionTitles = pricing?.sectionTitles || defaultPricing.sectionTitles;

  const premiumFeatures = [
    {
      title: "Buyer (Premium)",
      items: pricing?.buyerPremium || defaultPricing.buyerPremium,
    },
    {
      title: "Factory (Premium)",
      items: pricing?.factoryPremium || defaultPricing.factoryPremium,
    },
    {
      title: "Buying House (Premium)",
      items: pricing?.housePremium || defaultPricing.housePremium,
    },
  ];

  const roleSections = [
    {
      key: "buyer",
      title: "Buyer",
      subtitle: "For direct buyers sourcing verified factories.",
    },
    {
      key: "factory",
      title: "Factory",
      subtitle: "For factories managing products and inbound buyer requests.",
    },
    {
      key: "buying_house",
      title: "Buying House",
      subtitle: "For buying houses coordinating teams and partners.",
    },
  ];

  const visibleSections = isLoggedIn
    ? roleSections.filter((section) => section.key === activePlanKey)
    : roleSections;

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[#f5f9ff] text-slate-900 dark:bg-[#07111f] dark:text-white">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.12),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.1),transparent_28%)]" />

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-700 dark:text-sky-200">
                <span>✔</span>
                Pricing
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Clear plans for serious sourcing teams
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Borderless surfaces, verified signals, and export-ready
                reporting — built for buying houses and factories.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  Create your organization
                  <span>→</span>
                </Link>
                <Link
                  to="#plans"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-400 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-sky-400 dark:hover:text-sky-200"
                >
                  <span>🔍</span>
                  View plans
                </Link>
              </div>
            </div>

            <AnalyticsCard
              tiles={pricing?.analytics?.tiles || []}
              loading={loading}
              loadError={loadError}
            />
          </section>

          <section id="plans" className="mt-20 scroll-mt-24">
            <SectionTitle
              eyebrow="Simple, transparent pricing"
              title="Choose the surface you need today — upgrade when your team scales."
              subtitle="Role-specific plans keep workflows clean for buyers, factories, and buying houses. Start free, then move into premium when you need analytics, priority placement, export-ready reporting, and secure contract history."
            />

            <div className="mt-10 grid gap-6 xl:grid-cols-3">
              {visibleSections.map((section) => {
                const rolePlan =
                  plansByRole[section.key] || plansByRole.neutral;
                return (
                  <>
                    <PlanCard
                      title={section.title}
                      role={
                        section.key === "buyer"
                          ? "For direct buyers sourcing verified factories"
                          : section.key === "factory"
                            ? "For factories managing products and inbound buyer requests"
                            : "For buying houses coordinating teams and partners"
                      }
                      price="$0"
                      description="Start with essential workflow."
                      features={rolePlan.Free}
                      buttonLabel="Get started"
                      icon={
                        section.key === "buyer"
                          ? "🏢"
                          : section.key === "factory"
                            ? "🏭"
                            : "👥"
                      }
                    />
                    <PlanCard
                      title={`${section.title} Premium`}
                      role="Verified active"
                      price="$199"
                      description="Built for buying houses & enterprise teams."
                      features={rolePlan.Premium}
                      buttonLabel="Choose premium"
                      highlighted
                      icon="✨"
                    />
                  </>
                );
              })}
            </div>
          </section>

          <section className="mt-20 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(2,8,23,0.4)]">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Why enterprise matters
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                When your team scales, structure beats noise. Premium keeps
                workflows conflict-free and audit-ready.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Team scale without limits",
                  "Decision-ready visibility",
                  "Secure contract trail",
                  "Verified trust signals",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <AnalyticsCard
              tiles={pricing?.analytics?.tiles || []}
              loading={loading}
              loadError={loadError}
            />
          </section>

          <section className="mt-20">
            <SectionTitle
              eyebrow="Premium feature deep dive"
              title="A role-specific roundup of what the Premium plan unlocks."
              subtitle="Buyer, Factory, and Buying House teams all get the right controls, analytics, and trust signals — without bloated UI or confusing add-ons."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {premiumFeatures.map((bundle) => (
                <div
                  key={bundle.title}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                    {bundle.title}
                  </div>
                  <FeatureList items={bundle.items} accent />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <SectionTitle
              eyebrow="Analytics snapshot"
              title="Decision-ready metrics without spreadsheet UI."
              subtitle="Auto-sorted, calm, and clean — the data feels like part of the product instead of a separate dashboard."
            />
            <div className="mt-10">
              <AnalyticsCard
                tiles={pricing?.analytics?.tiles || []}
                loading={loading}
                loadError={loadError}
              />
            </div>
          </section>

          <section className="mt-20">
            <SectionTitle
              eyebrow="Comparison"
              title="Feature comparison"
              subtitle="A clear line-by-line look at the Free and Premium surfaces."
            />
            <div className="mt-10">
              <ComparisonTable comparisonRows={comparisonRows} />
            </div>
          </section>

          <section className="mt-20">
            <SectionTitle
              eyebrow="FAQ"
              title="Short answers, no sales noise."
              subtitle="Everything important, kept simple."
            />
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {faqs.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>

          <section className="mt-20 rounded-[2rem] border border-sky-500/15 bg-gradient-to-br from-sky-500/10 via-white to-cyan-500/10 p-8 shadow-[0_24px_80px_rgba(14,165,233,0.12)] dark:from-sky-500/10 dark:via-slate-950 dark:to-cyan-500/10">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-700 dark:text-sky-200">
                  <span>🛡️</span>
                  Ready for serious sourcing
                </div>
                <h3 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Build a structured textile network today
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Start free, upgrade when your org needs analytics, export, and
                  secure contract management.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  Create your organization
                  <span>→</span>
                </Link>
                <Link
                  to="#plans"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-400 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-sky-400 dark:hover:text-sky-200"
                >
                  Choose premium
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
