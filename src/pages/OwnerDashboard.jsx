import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAnalyticsDashboard from "../hooks/useAnalyticsDashboard";
import LeadManager from "../components/leads/LeadManager";
import { apiRequest, getToken } from "../lib/auth";

function SeriesList({ title, items }) {
  return (
    <div className="bg-[#F9FBFD] rounded-lg p-3">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="space-y-2 text-sm">
        {items.length === 0 ? (
          <div className="text-[#5A5A5A]">No data yet.</div>
        ) : null}
        {items.map((item) => (
          <div
            key={item.month}
            className="grid grid-cols-[72px_1fr_32px] items-center gap-2"
          >
            <span>{item.month}</span>
            <div className="h-2 bg-blue-100 rounded">
              <div
                className="h-2 bg-[#0A66C2] rounded"
                style={{ width: `${Math.min(100, item.count * 10)}%` }}
              />
            </div>
            <span>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const [active, setActive] = useState("home");
  const { dashboard, subscription, isEnterprise, loading, error } =
    useAnalyticsDashboard();
  const [policy, setPolicy] = useState(null);
  const [opsEscalations, setOpsEscalations] = useState([]);
  const [opsWorkload, setOpsWorkload] = useState([]);

  const totals = dashboard?.totals || {};

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    Promise.all([
      apiRequest("/org/ops/policies", { token }).catch(() => null),
      apiRequest("/org/ops/escalations", { token }).catch(() => ({
        items: [],
      })),
      apiRequest("/org/ops/workload", { token }).catch(() => ({ items: [] })),
    ])
      .then(([policyRes, escalationsRes, workloadRes]) => {
        setPolicy(policyRes);
        setOpsEscalations(escalationsRes?.items || []);
        setOpsWorkload(workloadRes?.items || []);
      })
      .catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#020617] dark:text-slate-100">
      <div className="max-w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-6 gap-6">
        <aside className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 space-y-2 sticky top-20 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
            <Link
              to="/owner"
              className={`block p-3 rounded-md cursor-pointer font-medium ${active === "home" ? "bg-gtBlue/10 text-gtBlue dark:bg-gtBlue/20 dark:text-slate-100" : "hover:bg-slate-50 dark:hover:bg-white/8"}`}
              onClick={() => setActive("home")}
            >
              📊 Dashboard Home
            </Link>
            <Link
              to="/owner?tab=requests"
              className={`block p-3 rounded-md cursor-pointer font-medium ${active === "requests" ? "bg-gtBlue/10 text-gtBlue dark:bg-gtBlue/20 dark:text-slate-100" : "hover:bg-slate-50 dark:hover:bg-white/8"}`}
              onClick={() => setActive("requests")}
            >
              📋 Buyer Requests
            </Link>
            <Link
              to="/owner?tab=chats"
              className={`block p-3 rounded-md cursor-pointer font-medium ${active === "chats" ? "bg-gtBlue/10 text-gtBlue dark:bg-gtBlue/20 dark:text-slate-100" : "hover:bg-slate-50 dark:hover:bg-white/8"}`}
              onClick={() => setActive("chats")}
            >
              💬 Chats
            </Link>
            <Link
              to="/owner?tab=network"
              className={`block p-3 rounded-md cursor-pointer font-medium ${active === "network" ? "bg-gtBlue/10 text-gtBlue dark:bg-gtBlue/20 dark:text-slate-100" : "hover:bg-slate-50 dark:hover:bg-white/8"}`}
              onClick={() => setActive("network")}
            >
              🏭 Partner Network
            </Link>
            <Link
              to="/owner?tab=leads"
              className={`block p-3 rounded-md cursor-pointer font-medium ${active === "leads" ? "bg-gtBlue/10 text-gtBlue dark:bg-gtBlue/20 dark:text-slate-100" : "hover:bg-slate-50 dark:hover:bg-white/8"}`}
              onClick={() => setActive("leads")}
            >
              📌 Leads (CRM)
            </Link>
            <Link
              to="/owner?tab=members"
              className={`block p-3 rounded-md cursor-pointer font-medium ${active === "members" ? "bg-gtBlue/10 text-gtBlue dark:bg-gtBlue/20 dark:text-slate-100" : "hover:bg-slate-50 dark:hover:bg-white/8"}`}
              onClick={() => setActive("members")}
            >
              👥 Member Management
            </Link>
            <Link
              to="/owner?tab=contracts"
              className={`block p-3 rounded-md cursor-pointer font-medium ${active === "contracts" ? "bg-gtBlue/10 text-gtBlue dark:bg-gtBlue/20 dark:text-slate-100" : "hover:bg-slate-50 dark:hover:bg-white/8"}`}
              onClick={() => setActive("contracts")}
            >
              📄 Contracts Vault
            </Link>
            <Link
              to="/owner?tab=insights"
              className={`block p-3 rounded-md cursor-pointer font-medium ${active === "insights" ? "bg-gtBlue/10 text-gtBlue dark:bg-gtBlue/20 dark:text-slate-100" : "hover:bg-slate-50 dark:hover:bg-white/8"}`}
              onClick={() => setActive("insights")}
            >
              📈 Insights & Analytics
            </Link>
            <Link
              to="/owner?tab=subscription"
              className={`block p-3 rounded-md cursor-pointer font-medium ${active === "subscription" ? "bg-gtBlue/10 text-gtBlue dark:bg-gtBlue/20 dark:text-slate-100" : "hover:bg-slate-50 dark:hover:bg-white/8"}`}
              onClick={() => setActive("subscription")}
            >
              💳 Subscription
            </Link>
            <Link
              to="/login"
              className="block p-3 rounded-md cursor-pointer font-medium hover:bg-red-50 text-red-600"
            >
              🚪 Logout
            </Link>
          </div>
        </aside>

        <main className="lg:col-span-5 space-y-6">
          {loading ? (
            <div className="bg-white rounded-xl p-4">
              Loading dashboard metrics...
            </div>
          ) : null}
          {error ? (
            <div className="bg-red-50 text-red-600 rounded-xl p-4">{error}</div>
          ) : null}

          {active === "home" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Buyer Requests
                  </div>
                  <div className="font-semibold text-xl">
                    {totals.buyer_requests ?? 0}
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Active Chats
                  </div>
                  <div className="font-semibold text-xl">
                    {totals.chats ?? 0}
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Partner Network
                  </div>
                  <div className="font-semibold text-xl">
                    {totals.partner_network ?? 0}
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Contracts / Docs
                  </div>
                  <div className="font-semibold text-xl">{`${totals.contracts ?? 0} / ${totals.documents ?? 0}`}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/buyer-requests"
                      className="p-2 rounded-lg bg-gtBlue/10 text-gtBlue text-center text-sm hover:bg-gtBlue/20 dark:bg-gtBlue/20"
                    >
                      View Requests
                    </Link>
                    <Link
                      to="/partner-network"
                      className="p-2 rounded-lg bg-gtBlue/10 text-gtBlue text-center text-sm hover:bg-gtBlue/20 dark:bg-gtBlue/20"
                    >
                      Partner Network
                    </Link>
                    <Link
                      to="/member-management"
                      className="p-2 rounded-lg bg-gtBlue/10 text-gtBlue text-center text-sm hover:bg-gtBlue/20 dark:bg-gtBlue/20"
                    >
                      Add Member
                    </Link>
                    <Link
                      to="/contracts"
                      className="p-2 rounded-lg bg-gtBlue/10 text-gtBlue text-center text-sm hover:bg-gtBlue/20 dark:bg-gtBlue/20"
                    >
                      Contracts
                    </Link>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Subscription
                  </div>
                  <div className="font-semibold">Plan: {subscription?.plan || "free"}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {isEnterprise
                      ? "Enterprise analytics enabled."
                      : "Free plan: limited features."}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                <h3 className="font-semibold mb-2">Subscription & Access</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Current plan: <strong>{subscription?.plan || "free"}</strong>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {isEnterprise
                    ? "Enterprise analytics enabled."
                    : "Free plan: advanced analytics are limited."}
                </div>
              </div>
            </div>
          )}

          {active === "requests" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-4 dark:bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">All Buyer Requests</h3>
                  <Link
                    to="/buyer-requests"
                    className="text-sm text-gtBlue hover:underline"
                  >
                    View All →
                  </Link>
                </div>
                <p className="text-sm text-[#5A5A5A] dark:text-slate-300">
                  Total: {totals.buyer_requests ?? 0} | Open:{" "}
                  {totals.open_buyer_requests ?? 0}
                </p>
                <p className="text-sm text-[#5A5A5A] dark:text-slate-300 mt-1">
                  Assigned to your agents: {totals.assigned_requests ?? 0}
                </p>
              </div>
            </div>
          )}
          {active === "chats" && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold mb-2">Chats</h3>
              <p className="text-sm text-[#5A5A5A]">
                Active chat threads: {totals.chats ?? 0}. Messages sent:{" "}
                {totals.messages ?? 0}.
              </p>
            </div>
          )}
          {active === "network" && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold mb-2">Partner Network</h3>
              <p className="text-sm text-[#5A5A5A]">
                Connected factory partners: {totals.partner_network ?? 0}. Total
                factory profiles: {totals.factories ?? 0}.
              </p>
            </div>
          )}
          {active === "leads" && (
            <div className="space-y-4">
              {policy ? (
                <div className="bg-white rounded-xl shadow-md p-4 text-sm text-slate-700">
                  <h3 className="font-semibold mb-2">Org Operations Policy</h3>
                  <p>
                    Assignment strategy:{" "}
                    <strong>{policy.assignment_strategy}</strong>
                  </p>
                  <p>
                    SLA target for new leads:{" "}
                    <strong>{policy?.sla_targets_by_stage?.new} min</strong>
                  </p>
                  <p>
                    Escalation breach window:{" "}
                    <strong>
                      {policy?.escalation_rules?.time_based?.breach_minutes} min
                    </strong>
                  </p>
                </div>
              ) : null}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-md p-4 text-sm">
                  <h4 className="font-semibold mb-2">Escalation Queue</h4>
                  {(opsEscalations || []).slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="py-1 border-b border-slate-100"
                    >
                      Lead <strong>{item.lead_id}</strong> · {item.reason}
                    </div>
                  ))}
                  {!opsEscalations.length ? (
                    <div className="text-slate-500">No active escalations.</div>
                  ) : null}
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 text-sm">
                  <h4 className="font-semibold mb-2">Agent Workload</h4>
                  {(opsWorkload || []).slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="py-1 border-b border-slate-100"
                    >
                      {item.agent_name}: {item.active_leads}/
                      {item.capped_max_leads} ({item.utilization_pct}%)
                    </div>
                  ))}
                  {!opsWorkload.length ? (
                    <div className="text-slate-500">No workload records.</div>
                  ) : null}
                </div>
              </div>
              <LeadManager title="Leads (CRM)" allowAssign showOperations />
            </div>
          )}
          {active === "contracts" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-4 dark:bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Contracts Vault</h3>
                  <Link
                    to="/contracts"
                    className="text-sm text-gtBlue hover:underline"
                  >
                    View All →
                  </Link>
                </div>
                <p className="text-sm text-[#5A5A5A] dark:text-slate-300">
                  Active contracts: {totals.contracts ?? 0} | Total documents:{" "}
                  {totals.documents ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 dark:bg-white/5">
                <h4 className="font-medium mb-2">Quick Actions</h4>
                <div className="flex gap-2">
                  <Link
                    to="/contracts?action=new"
                    className="px-4 py-2 rounded-lg bg-gtBlue text-white text-sm hover:bg-gtBlue/90"
                  >
                    + New Contract
                  </Link>
                  <Link
                    to="/contracts"
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-white/8"
                  >
                    View All Contracts
                  </Link>
                </div>
              </div>
            </div>
          )}

          {active === "insights" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Insights & Analytics</h3>
              {!isEnterprise ? (
                <div className="bg-yellow-50 rounded-xl p-4 text-sm text-[#5A5A5A]">
                  Upgrade to Enterprise to unlock advanced monthly trends and
                  analytics event breakdown.
                </div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SeriesList
                  title="Buyer Requests / Month"
                  items={dashboard?.series?.buyer_requests || []}
                />
                <SeriesList
                  title="Chats / Month"
                  items={dashboard?.series?.chats || []}
                />
                <SeriesList
                  title="Documents / Month"
                  items={dashboard?.series?.documents || []}
                />
              </div>
            </div>
          )}

          {active === "subscription" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-4 dark:bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Subscription & Billing</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Current Plan</span>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {subscription?.plan?.toUpperCase() || "FREE"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          subscription?.plan?.toLowerCase() === "premium" ||
                          subscription?.plan?.toLowerCase() === "enterprise"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {subscription?.plan?.toLowerCase() === "premium" ||
                        subscription?.plan?.toLowerCase() === "enterprise"
                          ? "Active"
                          : "Free"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/org-settings?tab=billing"
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      Billing Settings
                    </Link>
                    <Link
                      to="/pricing"
                      className="p-2 rounded-lg bg-gtBlue/10 text-gtBlue text-center text-sm hover:bg-gtBlue/20"
                    >
                      View Plans
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 dark:bg-white/5">
                <h4 className="font-medium mb-2">Plan Features</h4>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <p>Agent seats: {subscription?.member_limit || 10}</p>
                  <p>
                    Analytics:{" "}
                    {isEnterprise ? "Enterprise" : "Basic"}
                  </p>
                  <p>
                    Partner Network:{" "}
                    {subscription?.partner_network_unlimited ? "Unlimited" : "Limited"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
