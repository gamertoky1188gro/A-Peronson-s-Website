import NeonAtom from "../components/ui/NeonAtom";
import { Mosaic } from "react-loading-indicators";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../lib/ThemeProvider";
import useAnalyticsDashboard from "../hooks/useAnalyticsDashboard";
import LeadManager from "../components/leads/LeadManager";
import { apiRequest, getToken, syncUserFromApi } from "../lib/auth";
import { isRouteValid } from "../lib/routeHealthCheck";
import CountUp from "../components/CountUp";
import ScrollReveal from "../components/ScrollReveal";
import ScaleIn from "../components/ScaleIn";
import { StaggerContainer, StaggerItem } from "../components/StaggerContainer";
import HoverCard from "../components/HoverCard";
import ContractVaultPage from "./ContractVault";
import VerificationPage from "./VerificationPage";
import OrgSettings from "./OrgSettings";
import { cn } from "../lib/cn";

function SparkIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M13 2l1.8 5.4L20 9l-5.2 1.6L13 16l-1.8-5.4L6 9l5.2-1.6L13 2z" />
      <path d="M5 14l.9 2.7L9 18l-3.1 1.3L5 22l-.9-2.7L1 18l3.1-1.3L5 14z" />
    </svg>
  );
}

function Icon({ path, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

const ProgressBar = memo(function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
});

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MiniBarChart = memo(function MiniBarChart({ values }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-44 items-end gap-2 rounded-2xl bg-gradient-to-b from-sky-50/70 to-white p-3 dark:from-sky-950/30 dark:to-slate-950/20">
      {values.map((v, idx) => (
        <div key={idx} className="flex-1">
          <div className="flex h-full items-end">
            <div
              className="w-full rounded-t-xl bg-gradient-to-t from-sky-500 via-cyan-400 to-sky-300 shadow-sm"
              style={{ height: `${(v / max) * 100}%` }}
              title={`${monthLabels[idx]}: ${v}`}
            />
          </div>
          <div className="mt-2 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {monthLabels[idx]}
          </div>
        </div>
      ))}
    </div>
  );
});

const SectionCard = memo(function SectionCard({ title, subtitle, children, className = "", action }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/80",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
});

const StatCard = memo(function StatCard({ label, value, sub, accent = "from-sky-500 to-cyan-400" }) {
  const isNumeric = typeof value === "number" && !Number.isNaN(value);
  return (
    <HoverCard className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 shadow-[0_18px_45px_rgba(8,15,33,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
      <div
        className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accent)}
      />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {isNumeric ? (
              <ScaleIn>
                <CountUp value={value} />
              </ScaleIn>
            ) : (
              value
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {sub}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
            accent,
          )}
        >
          <SparkIcon className="h-5 w-5" />
        </div>
      </div>
    </HoverCard>
  );
});

const menuItems = [
  { id: "home", label: "Dashboard Home", short: "Home" },
  { id: "requests", label: "Buyer Requests", short: "RFQs" },
  { id: "chats", label: "Chats", short: "Chats" },
  { id: "network", label: "Partner Network", short: "Network" },
  { id: "leads", label: "Leads (CRM)", short: "Leads" },
  { id: "members", label: "Member Management", short: "Members" },
  { id: "contracts", label: "Contracts Vault", short: "Contracts" },
  { id: "insights", label: "Insights & Analytics", short: "Insights" },
  { id: "subscription", label: "Subscription", short: "Billing" },
  { id: "verification", label: "Verification", short: "Verify" },
  { id: "settings", label: "Settings", short: "Settings" },
];

const quickActions = [
  {
    label: "Buyer Requests",
    href: "/buyer-requests",
    desc: "View and manage RFQs",
  },
  {
    label: "Partners",
    href: "/partner-network",
    desc: "Manage supplier network",
  },
  { label: "Members", href: "/member-management", desc: "Add team agents" },
  { label: "Contracts", href: "/contracts", desc: "View all contracts" },
  { label: "Leads", href: "/leads", desc: "CRM pipeline" },
  { label: "Messages", href: "/chat", desc: "Chat with buyers" },
  { label: "Analytics", href: "/insights", desc: "View data insights" },
  { label: "Settings", href: "/org-settings", desc: "Account configuration" },
].filter((item) => isRouteValid(item.href));

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const active = useMemo(() => {
    const candidate = searchParams.get("tab") || "home";
    return menuItems.some((t) => t.id === candidate) ? candidate : "home";
  }, [searchParams]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const goTab = useCallback(
    (id) => {
      setSearchParams({ tab: id }, { replace: true });
      setSidebarOpen(false);
    },
    [setSearchParams],
  );
  const { theme, toggleTheme } = useTheme();

  const { dashboard, subscription, isEnterprise, loading, error } =
    useAnalyticsDashboard();
  const [policy, setPolicy] = useState(null);
  const [opsEscalations, setOpsEscalations] = useState([]);
  const [opsWorkload, setOpsWorkload] = useState([]);
  const [memberStats, setMemberStats] = useState({
    owners: 0,
    managers: 0,
    agents: 0,
    observers: 0,
  });
  const [vaultHealth, setVaultHealth] = useState(100);
  const [pageLoading, setPageLoading] = useState(true);

  const totals = dashboard?.totals || {};

  const plan = subscription?.plan?.toUpperCase() || "FREE";

  const currentPlanLabel = useMemo(() => {
    return plan === "FREE"
      ? "Free"
      : plan === "PREMIUM"
        ? "Premium"
        : "Enterprise";
  }, [plan]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    Promise.all([
      apiRequest("/org/ops/policies", { token }).catch(() => null),
      apiRequest("/org/ops/escalations", { token }).catch(() => ({
        items: [],
      })),
      apiRequest("/org/ops/workload", { token }).catch(() => ({ items: [] })),
      apiRequest("/org/members/counts", { token }).catch(() => ({})),
    ])
      .then(([policyRes, escalationsRes, workloadRes, membersRes]) => {
        setPolicy(policyRes);
        setOpsEscalations(escalationsRes?.items || []);
        setOpsWorkload(workloadRes?.items || []);
        if (membersRes) {
          setMemberStats({
            owners: membersRes.owners ?? 0,
            managers: membersRes.managers ?? 0,
            agents: membersRes.agents ?? 0,
            observers: membersRes.observers ?? 0,
          });
        }
        if (membersRes?.vault_health !== undefined) {
          setVaultHealth(membersRes.vault_health);
        }
      })
      .catch(() => null)
      .finally(() => setPageLoading(false));
    syncUserFromApi(token).finally(() => {});
  }, []);

  const go = (href) => {
    navigate(href);
  };

  const logout = () => {
    navigate("/login");
  };

  const policyData = {
    assignmentStrategy:
      policy?.assignment_strategy?.replace(/_/g, " ") ||
      "Round-robin with priority weighting",
    slaTarget: policy?.sla_targets_by_stage?.new
      ? `${policy.sla_targets_by_stage.new} minutes`
      : "15 minutes",
    escalationWindow: policy?.escalation_rules?.time_based?.breach_minutes
      ? `${policy.escalation_rules.time_based.breach_minutes} hours`
      : "2 hours",
  };

  const escalationsData = (opsEscalations || []).slice(0, 6).map((item) => ({
    id: item.lead_id || item.id,
    reason: item.reason || "Needs attention",
    owner: item.owner || item.agent_name || "Unassigned",
  }));

  const agentsData = (opsWorkload || []).slice(0, 6).map((item) => ({
    name: item.agent_name || "Unknown",
    current: item.active_leads || 0,
    cap: item.capped_max_leads || 10,
  }));

  const chartRequestsData =
    dashboard?.series?.buyer_requests?.map((item) => item.count) || [];
  const chartChatsData =
    dashboard?.series?.chats?.map((item) => item.count) || [];
  const chartDocsData =
    dashboard?.series?.documents?.map((item) => item.count) || [];

  if (pageLoading) return <NeonAtom fill />;

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div
        style={{ height: "100vh", overflow: "hidden" }}
        className="flex w-full bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#eef7ff_34%,_#f8fbff_100%)] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.12),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#06111f_46%,_#040816_100%)] dark:text-slate-100"
      >
        <aside
          data-lenis-prevent
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-80 shrink-0 border-r border-slate-200/70 bg-white/80 p-4 backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-950/75 lg:relative lg:z-auto lg:translate-x-0 scrollbar-invisible",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
          )}
          style={{ height: "100vh", overflow: "auto" }}
        >
          <div className="flex min-h-0 flex-col rounded-[2rem] border border-slate-200/70 bg-white/70 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-slate-950/65">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/20">
                  <SparkIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                    Owner Console
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Premium control center
                  </div>
                </div>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-sky-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <Icon path="M6 18L18 6M6 6l12 12" className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-4 space-y-1 pr-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    goTab(item.id);
                  }}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-200",
                    active === item.id
                      ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/20"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5",
                  )}
                >
                  <span className="font-medium">{item.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]",
                      active === item.id
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400",
                    )}
                  >
                    {item.short}
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-4 space-y-3 border-t border-slate-200/70 pt-4 dark:border-white/10">
              <button
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
              >
                <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                  Toggle
                </span>
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
              >
                <span>Logout</span>
                <Icon
                  path="M16 17l5-5-5-5M21 12H9M13 5v2.2A2.8 2.8 0 0 1 10.2 10H6"
                  className="h-4 w-4"
                />
              </button>
            </div>
          </div>
        </aside>

        <div
          data-lenis-prevent
          className="flex flex-1 flex-col min-h-0"
          style={{ overflowY: "auto" }}
        >
          <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:px-6 xl:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
                aria-label="Open sidebar"
              >
                <Icon path="M4 6h16M4 12h16M4 18h16" className="h-5 w-5" />
              </button>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                      Owner Page
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Modern control center for requests, leads, partners, and
                      operations.
                    </p>
                  </div>
                  <div className="ml-auto hidden items-center gap-2 sm:flex">
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                      {currentPlanLabel}
                    </span>
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300">
                      Blue-Sky Theme
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex flex-col flex-1 min-h-0 px-4 py-6 sm:px-6 xl:px-8">
            {loading && (
              <Mosaic
                color="#3b00ff"
                size="large"
                style={{ fontSize: "40px" }}
                text=""
                textColor=""
              />
            )}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl p-4 flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {active === "home" && !loading && (
              <div className="space-y-6">
                <ScrollReveal as="section">
                  <StaggerContainer className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StaggerItem>
                      <StatCard
                        label="Requests"
                        value={totals.buyer_requests ?? 0}
                        sub={`${totals.open_buyer_requests ?? 0} open buyer requests`}
                      />
                    </StaggerItem>
                    <StaggerItem>
                      <StatCard
                        label="Chats"
                        value={totals.chats ?? 0}
                        sub={`${totals.messages ?? 0} total messages`}
                        accent="from-cyan-500 to-sky-400"
                      />
                    </StaggerItem>
                    <StaggerItem>
                      <StatCard
                        label="Partners"
                        value={totals.partner_network ?? 0}
                        sub={`${totals.factories ?? 0} connected factories`}
                        accent="from-blue-500 to-sky-400"
                      />
                    </StaggerItem>
                    <StaggerItem>
                      <StatCard
                        label="Contracts"
                        value={totals.contracts ?? 0}
                        sub={`${totals.documents ?? 0} documents tracked`}
                        accent="from-sky-600 to-cyan-500"
                      />
                    </StaggerItem>
                  </StaggerContainer>
                </ScrollReveal>

                <ScrollReveal as="section">
                  <div className="grid gap-6 xl:grid-cols-3">
                    <SectionCard
                      title="Quick Actions"
                      subtitle="Jump to the most common operational screens."
                      className="xl:col-span-2"
                    >
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => go(item.href)}
                            className="group rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/50"
                          >
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/15 transition group-hover:scale-105">
                              <Icon
                                path="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                                className="h-5 w-5"
                              />
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {item.label}
                            </div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {item.desc}
                            </div>
                          </button>
                        ))}
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Current Plan"
                      subtitle="Subscription overview and next step."
                      action={
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                          {currentPlanLabel}
                        </span>
                      }
                    >
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-4 text-white shadow-lg shadow-cyan-500/20">
                          <div className="text-sm opacity-90">
                            Current subscription
                          </div>
                          <div className="mt-1 text-2xl font-semibold">
                            {currentPlanLabel}
                          </div>
                          {plan !== "ENTERPRISE" ? (
                            <div className="mt-2 text-sm opacity-90">
                              Unlock larger limits and enterprise analytics.
                            </div>
                          ) : (
                            <div className="mt-2 text-sm opacity-90">
                              Enterprise-grade limits and analytics enabled.
                            </div>
                          )}
                        </div>
                        {plan !== "ENTERPRISE" && (
                          <button
                            onClick={() => go("/pricing")}
                            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                          >
                            Upgrade Now
                          </button>
                        )}
                      </div>
                    </SectionCard>
                  </div>
                </ScrollReveal>

                <ScrollReveal as="section">
                  <div className="grid gap-6 xl:grid-cols-3">
                    <SectionCard
                      title="Platform Stats"
                      subtitle="Key totals across the workspace."
                    >
                      <ul className="space-y-3 text-sm">
                        {[
                          ["Requests", totals.buyer_requests ?? 0],
                          ["Chats", totals.chats ?? 0],
                          ["Partners", totals.partner_network ?? 0],
                          ["Contracts", totals.contracts ?? 0],
                        ].map(([label, value]) => (
                          <li
                            key={label}
                            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5"
                          >
                            <span className="text-slate-600 dark:text-slate-300">
                              {label}
                            </span>
                            <span className="font-semibold text-slate-950 dark:text-white">
                              {value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </SectionCard>

                    <SectionCard
                      title="Org Operations Policy"
                      subtitle="How the team handles new demand and escalation."
                    >
                      <div className="space-y-4 text-sm">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">
                              Assignment strategy
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {policyData.assignmentStrategy}
                            </span>
                          </div>
                          <ProgressBar value={vaultHealth} />
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">
                              SLA target
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {policyData.slaTarget}
                            </span>
                          </div>
                          <ProgressBar
                            value={
                              escalationsData.length > 0
                                ? Math.round(
                                    (1 - escalationsData.length / 10) * 100,
                                  )
                                : 85
                            }
                          />
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">
                              Escalation window
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {policyData.escalationWindow}
                            </span>
                          </div>
                          <ProgressBar
                            value={
                              opsEscalations.length > 0
                                ? Math.round(opsEscalations.length * 10)
                                : 0
                            }
                          />
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="At a glance"
                      subtitle="A compact view of the owner workspace."
                    >
                      <div className="grid gap-3">
                        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50 to-cyan-50 p-4 dark:border-white/10 dark:from-sky-500/10 dark:to-cyan-500/10">
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Buyer request health
                          </div>
                          <div className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                            {escalationsData.length === 0
                              ? "Healthy pipeline"
                              : `${escalationsData.length} active escalations`}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-white/10 dark:bg-slate-950/40">
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Team coverage
                          </div>
                          <div className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                            {subscription?.member_limit ?? 10} seats
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  </div>
                </ScrollReveal>
              </div>
            )}

            {active === "requests" && !loading && (
              <div className="space-y-6">
                <ScrollReveal as="section">
                  <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                      label="Total Requests"
                      value={totals.buyer_requests ?? 0}
                      sub="All buyer RFQs in the system"
                    />
                    <StatCard
                      label="Open"
                      value={totals.open_buyer_requests ?? 0}
                      sub="Waiting for action"
                      accent="from-cyan-500 to-sky-400"
                    />
                    <StatCard
                      label="Assigned"
                      value={totals.assigned_requests ?? 0}
                      sub="Handled by the team"
                    />
                  </div>
                </ScrollReveal>

                <SectionCard
                  title="All Buyer Requests"
                  subtitle={`Status: Active · Category: All · Assigned vs unassigned overview`}
                  action={
                    <button
                      onClick={() => go("/buyer-requests")}
                      className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/15"
                    >
                      View All Requests
                    </button>
                  }
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Assigned
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                        {totals.assigned_requests ?? 0}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Unassigned
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                        {(totals.buyer_requests ?? 0) -
                          (totals.assigned_requests ?? 0)}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-sky-500/10 to-cyan-400/10 p-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Open rate
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                        {totals.buyer_requests
                          ? Math.round(
                              (totals.open_buyer_requests /
                                totals.buyer_requests) *
                                100,
                            )
                          : 0}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {(dashboard?.recent_requests || []).length === 0 ? (
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        No recent buyer requests
                      </div>
                    ) : (
                      (dashboard?.recent_requests || []).map((req, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {req.title || req.name || `Request #${i + 1}`}
                            </div>
                            <div className="text-sm text-slate-500">
                              {req.buyer_name || req.buyer || "Unknown buyer"}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                              {req.status || "Open"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {req.created_at
                                ? new Date(req.created_at).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </SectionCard>
              </div>
            )}

            {active === "chats" && !loading && (
              <div className="space-y-6">
                <ScrollReveal as="section">
                  <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                      label="Active Chats"
                      value={totals.chats ?? 0}
                      sub="Live buyer conversations"
                    />
                    <StatCard
                      label="Messages Sent"
                      value={totals.messages ?? 0}
                      sub="Team and buyer messages"
                      accent="from-cyan-500 to-sky-400"
                    />
                    <StatCard
                      label="Unread"
                      value={totals.unread_messages ?? 0}
                      sub="Needs attention"
                    />
                  </div>
                </ScrollReveal>

                <SectionCard
                  title="Conversations"
                  subtitle="Open the chat center and continue buyer communication."
                  action={
                    <button
                      onClick={() => go("/chat")}
                      className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Open Chat
                    </button>
                  }
                >
                  <div className="space-y-3">
                    {(dashboard?.recent_chats || []).length === 0 ? (
                      <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
                        No conversations yet
                      </div>
                    ) : (
                      (dashboard?.recent_chats || []).map((chat, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {chat.contact_name ||
                                  chat.name ||
                                  `Chat #${i + 1}`}
                              </span>
                              {chat.unread ? (
                                <span className="h-2 w-2 rounded-full bg-sky-500" />
                              ) : null}
                            </div>
                            <div className="mt-1 text-sm text-slate-500 line-clamp-1">
                              {chat.last_message || chat.preview || ""}
                            </div>
                          </div>
                          <span className="shrink-0 text-xs text-slate-400">
                            {chat.last_message_at || chat.updated_at
                              ? new Date(
                                  chat.last_message_at || chat.updated_at,
                                ).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      ))
                    )}
                    <button
                      onClick={() => go("/chat")}
                      className="mt-2 w-fit text-sm font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-300"
                    >
                      Start a new conversation →
                    </button>
                  </div>
                </SectionCard>
              </div>
            )}

            {active === "network" && !loading && (
              <div className="space-y-6">
                <ScrollReveal as="section">
                  <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                      label="Connected"
                      value={totals.partner_network ?? 0}
                      sub="Trusted partners online"
                    />
                    <StatCard
                      label="Pending"
                      value={totals.pending_partners ?? 0}
                      sub="Awaiting approval"
                      accent="from-cyan-500 to-sky-400"
                    />
                    <StatCard
                      label="Factories"
                      value={totals.factories ?? 0}
                      sub="Production capacity"
                    />
                  </div>
                </ScrollReveal>

                <SectionCard
                  title="Partner Network"
                  subtitle="Overview of partners, factories, and buying houses."
                  action={
                    <button
                      onClick={() => go("/partner-network")}
                      className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Manage Partners
                    </button>
                  }
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Total partners
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                        {totals.partner_network ?? 0}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Factories
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                        {totals.factories ?? 0}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Buying houses
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                        {totals.buying_houses ?? 0}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {(dashboard?.partners || []).length === 0 ? (
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        No partners yet
                      </div>
                    ) : (
                      (dashboard?.partners || []).map((partner, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {partner.name || `Partner #${i + 1}`}
                            </div>
                            <div className="text-sm text-slate-500">
                              {partner.type || "—"}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-300">
                              {partner.status || "Active"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {partner.request_count ?? 0} requests
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </SectionCard>
              </div>
            )}

            {active === "leads" && !loading && (
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-3">
                  <SectionCard
                    title="Org Operations Policy"
                    subtitle="Rules that govern assignment, response times, and escalation."
                  >
                    <div className="space-y-3 text-sm">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                        <div className="text-slate-500 dark:text-slate-400">
                          Assignment strategy
                        </div>
                        <div className="mt-1 font-semibold text-slate-950 dark:text-white">
                          {policyData.assignmentStrategy}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                        <div className="text-slate-500 dark:text-slate-400">
                          SLA target
                        </div>
                        <div className="mt-1 font-semibold text-slate-950 dark:text-white">
                          {policyData.slaTarget}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                        <div className="text-slate-500 dark:text-slate-400">
                          Escalation breach window
                        </div>
                        <div className="mt-1 font-semibold text-slate-950 dark:text-white">
                          {policyData.escalationWindow}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Escalation Queue"
                    subtitle="Leads that need immediate attention."
                    className="xl:col-span-2"
                  >
                    <div className="space-y-3">
                      {escalationsData.length === 0 ? (
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          No active escalations.
                        </div>
                      ) : (
                        escalationsData.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-white/5"
                          >
                            <div>
                              <div className="font-semibold text-slate-950 dark:text-white">
                                {item.id}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {item.reason}
                              </div>
                            </div>
                            <div className="text-sm font-medium text-sky-600 dark:text-sky-300">
                              Owner: {item.owner}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </SectionCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                  <SectionCard
                    title="Agent Workload"
                    subtitle="Current leads versus maximum capacity."
                  >
                    <div className="space-y-4">
                      {agentsData.length === 0 ? (
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          No workload records.
                        </div>
                      ) : (
                        agentsData.map((agent) => {
                          const percent =
                            agent.cap > 0
                              ? (agent.current / agent.cap) * 100
                              : 0;
                          return (
                            <div key={agent.name} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {agent.name}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">
                                  {agent.current}/{agent.cap}
                                </span>
                              </div>
                              <ProgressBar value={percent} />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </SectionCard>

                  <div className="xl:col-span-2">
                    <LeadManager
                      title="LeadManager"
                      allowAssign
                      showOperations
                    />
                  </div>
                </div>
              </div>
            )}

            {active === "members" && !loading && (
              <div className="space-y-6">
                <SectionCard
                  title="Member Management"
                  subtitle="Team members, agents, and access control in one place."
                  action={
                    <div className="flex gap-2">
                      <button
                        onClick={() => go("/member-management")}
                        className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        Manage Members
                      </button>
                      <button
                        onClick={() => go("/member-management")}
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
                      >
                        Go to Member Management
                      </button>
                    </div>
                  }
                >
                  <div className="grid gap-4 md:grid-cols-4">
                    {["Owners", "Managers", "Agents", "Observers"].map(
                      (role, idx) => (
                        <div
                          key={role}
                          className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
                        >
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {role}
                          </div>
                          <div className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                            {
                              [
                                memberStats.owners,
                                memberStats.managers,
                                memberStats.agents,
                                memberStats.observers,
                              ][idx]
                            }
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </SectionCard>
              </div>
            )}

            {active === "contracts" && !loading && (
              <div className="flex-1 min-h-0 space-y-6" data-lenis-prevent>
                <ContractVaultPage embedded />
              </div>
            )}

            {active === "insights" && !loading && (
              <div className="space-y-6">
                {!isEnterprise && (
                  <SectionCard
                    title="Enterprise Analytics"
                    subtitle="Advanced analytics requires an Enterprise plan."
                  >
                    <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-semibold">Upgrade required</div>
                        <div className="text-sm opacity-90">
                          Unlock advanced trend analysis, deeper attribution,
                          and more accurate forecasting.
                        </div>
                      </div>
                      <button
                        onClick={() => go("/pricing")}
                        className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </SectionCard>
                )}

                <div className="grid gap-6 xl:grid-cols-3">
                  <SectionCard
                    title="Buyer Requests / Month"
                    subtitle="Monthly bar chart visualization."
                  >
                    <MiniBarChart values={chartRequestsData} />
                  </SectionCard>
                  <SectionCard
                    title="Chats / Month"
                    subtitle="Monthly bar chart visualization."
                  >
                    <MiniBarChart values={chartChatsData} />
                  </SectionCard>
                  <SectionCard
                    title="Documents / Month"
                    subtitle="Monthly bar chart visualization."
                  >
                    <MiniBarChart values={chartDocsData} />
                  </SectionCard>
                </div>
              </div>
            )}

            {active === "verification" && !loading && (
              <div className="flex-1 min-h-0 space-y-6" data-lenis-prevent>
                <VerificationPage embedded />
              </div>
            )}

            {active === "settings" && !loading && (
              <div className="flex-1 min-h-0" data-lenis-prevent>
                <OrgSettings embedded />
              </div>
            )}

            {active === "subscription" && !loading && (
              <div className="space-y-6">
                <SectionCard
                  title="Current Plan"
                  subtitle="Subscription, billing, and limits at a glance."
                  action={
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                      {currentPlanLabel}
                    </span>
                  }
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-5 text-white shadow-lg shadow-cyan-500/20">
                      <div className="text-sm opacity-90">Plan name</div>
                      <div className="mt-1 text-3xl font-semibold">
                        {currentPlanLabel}
                      </div>
                      <div className="mt-2 text-sm opacity-90">
                        Status: Active
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Billing Settings
                      </div>
                      <button
                        onClick={() => go("/org-settings?tab=billing")}
                        className="mt-2 text-lg font-semibold text-slate-950 hover:text-sky-600 dark:text-white dark:hover:text-sky-300"
                      >
                        Open billing →
                      </button>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        View Plans
                      </div>
                      <button
                        onClick={() => go("/pricing")}
                        className="mt-2 text-lg font-semibold text-slate-950 hover:text-sky-600 dark:text-white dark:hover:text-sky-300"
                      >
                        Compare plans →
                      </button>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Plan Features"
                  subtitle="Limits and capability summary."
                >
                  <div className="grid gap-4 md:grid-cols-4">
                    {[
                      ["Agent seats", subscription?.member_limit ?? 10],
                      [
                        "Analytics level",
                        isEnterprise ? "Enterprise" : "Basic",
                      ],
                      [
                        "Partner network",
                        plan === "FREE" ? "Limited" : "Enabled",
                      ],
                      [
                        "Lead management",
                        plan === "FREE" ? "Limited" : "Enabled",
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
                      >
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {label}
                        </div>
                        <div className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
