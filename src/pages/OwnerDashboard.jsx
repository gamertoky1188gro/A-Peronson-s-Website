import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAnalyticsDashboard from "../hooks/useAnalyticsDashboard";
import LeadManager from "../components/leads/LeadManager";
import { apiRequest, getToken } from "../lib/auth";

function SeriesList({ title, items }) {
  return (
    <div className="bg-[#F9FBFD] rounded-lg p-3 dark:bg-white/5">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="space-y-2 text-sm">
        {items.length === 0 ? (
          <div className="text-[#5A5A5A] dark:text-slate-400">No data yet.</div>
        ) : null}
        {items.map((item) => (
          <div
            key={item.month}
            className="grid grid-cols-[72px_1fr_32px] items-center gap-2"
          >
            <span className="text-slate-600 dark:text-slate-300">{item.month}</span>
            <div className="h-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <div
                className="h-2 bg-[#0A66C2] rounded"
                style={{ width: `${Math.min(100, item.count * 10)}%` }}
              />
            </div>
            <span className="font-medium">{item.count}</span>
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
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-gtBlue/30 border-t-gtBlue rounded-full animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Loading dashboard...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl p-4 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {active === "home" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">📋</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Requests</span>
                  </div>
                  <div className="font-bold text-2xl text-gtBlue">
                    {totals.buyer_requests ?? 0}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {totals.open_buyer_requests ?? 0} open
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">💬</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Chats</span>
                  </div>
                  <div className="font-bold text-2xl text-gtBlue">
                    {totals.chats ?? 0}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {totals.messages ?? 0} messages
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🏭</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Partners</span>
                  </div>
                  <div className="font-bold text-2xl text-gtBlue">
                    {totals.partner_network ?? 0}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {totals.factories ?? 0} factories
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">📄</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Contracts</span>
                  </div>
                  <div className="font-bold text-2xl text-gtBlue">
                    {totals.contracts ?? 0}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {totals.documents ?? 0} documents
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 rounded-2xl bg-white p-5 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link
                      to="/buyer-requests"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-gtBlue/10 to-gtBlue/5 hover:from-gtBlue/20 hover:to-gtBlue/10 transition-all border border-gtBlue/20 dark:border-gtBlue/30"
                    >
                      <span className="text-2xl">📋</span>
                      <span className="text-sm font-medium text-gtBlue">Buyer Requests</span>
                      <span className="text-xs text-slate-500 text-center">
                        View & manage requests
                      </span>
                    </Link>
                    <Link
                      to="/partner-network"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-50 transition-all border border-green-200"
                    >
                      <span className="text-2xl">🏭</span>
                      <span className="text-sm font-medium text-green-700">Partners</span>
                      <span className="text-xs text-slate-500 text-center">
                        Manage network
                      </span>
                    </Link>
                    <Link
                      to="/member-management"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-50 transition-all border border-purple-200"
                    >
                      <span className="text-2xl">👥</span>
                      <span className="text-sm font-medium text-purple-700">Members</span>
                      <span className="text-xs text-slate-500 text-center">
                        Add & manage team
                      </span>
                    </Link>
                    <Link
                      to="/contracts"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-50 transition-all border border-orange-200"
                    >
                      <span className="text-2xl">📄</span>
                      <span className="text-sm font-medium text-orange-700">Contracts</span>
                      <span className="text-xs text-slate-500 text-center">
                        View all contracts
                      </span>
                    </Link>
                    <Link
                      to="/leads"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-50 transition-all border border-pink-200"
                    >
                      <span className="text-2xl">🎯</span>
                      <span className="text-sm font-medium text-pink-700">Leads</span>
                      <span className="text-xs text-slate-500 text-center">
                        CRM pipeline
                      </span>
                    </Link>
                    <Link
                      to="/chat"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-50 transition-all border border-blue-200"
                    >
                      <span className="text-2xl">💬</span>
                      <span className="text-sm font-medium text-blue-700">Messages</span>
                      <span className="text-xs text-slate-500 text-center">
                        Chat with buyers
                      </span>
                    </Link>
                    <Link
                      to="/insights"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-50 transition-all border border-indigo-200"
                    >
                      <span className="text-2xl">📊</span>
                      <span className="text-sm font-medium text-indigo-700">Analytics</span>
                      <span className="text-xs text-slate-500 text-center">
                        View insights
                      </span>
                    </Link>
                    <Link
                      to="/org-settings"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-50 transition-all border border-slate-200"
                    >
                      <span className="text-2xl">⚙️</span>
                      <span className="text-sm font-medium text-slate-700">Settings</span>
                      <span className="text-xs text-slate-500 text-center">
                        Account settings
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl bg-gradient-to-br from-gtBlue to-blue-600 p-5 shadow-borderless text-white dark:shadow-borderlessDark">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm opacity-80">Current Plan</span>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {subscription?.plan?.toUpperCase() || "FREE"}
                      </span>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      {subscription?.plan === "enterprise"
                        ? "Enterprise"
                        : subscription?.plan === "premium"
                          ? "Premium"
                          : "Free"}
                    </div>
                    <div className="text-sm opacity-80">
                      {isEnterprise
                        ? "All features unlocked"
                        : "Limited features"}
                    </div>
                    {!isEnterprise && (
                      <Link
                        to="/pricing"
                        className="mt-4 block w-full py-2 bg-white text-gtBlue rounded-lg text-center font-medium hover:bg-white/90 transition-colors"
                      >
                        Upgrade Now
                      </Link>
                    )}
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                    <h4 className="font-medium mb-3">Platform Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">
                          Total Requests
                        </span>
                        <span className="font-medium">{totals.buyer_requests ?? 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">
                          Active Chats
                        </span>
                        <span className="font-medium">{totals.chats ?? 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">
                          Partners
                        </span>
                        <span className="font-medium">
                          {totals.partner_network ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">
                          Contracts
                        </span>
                        <span className="font-medium">{totals.contracts ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {policy && (
                <div className="rounded-2xl bg-white p-5 shadow-borderless ring-1 ring-slate-200/60 dark:bg-white/5 dark:shadow-borderlessDark dark:ring-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Org Operations Policy</h3>
                    <Link
                      to="/org-settings?tab=policy"
                      className="text-sm text-gtBlue hover:underline"
                    >
                      Edit →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                      <span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">
                        Assignment Strategy
                      </span>
                      <span className="font-medium capitalize">
                        {policy.assignment_strategy?.replace(/_/g, " ") || "Not set"}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                      <span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">
                        SLA Target (New Leads)
                      </span>
                      <span className="font-medium">
                        {policy?.sla_targets_by_stage?.new || "--"} min
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                      <span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">
                        Escalation Window
                      </span>
                      <span className="font-medium">
                        {policy?.escalation_rules?.time_based?.breach_minutes || "--"}{" "}
                        min
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {active === "requests" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Total Requests</div>
                  <div className="text-2xl font-bold text-gtBlue">
                    {totals.buyer_requests ?? 0}
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Open</div>
                  <div className="text-2xl font-bold text-green-600">
                    {totals.open_buyer_requests ?? 0}
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Assigned</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {totals.assigned_requests ?? 0}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 dark:bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">All Buyer Requests</h3>
                  <Link
                    to="/buyer-requests"
                    className="px-4 py-2 bg-gtBlue text-white rounded-lg text-sm hover:bg-gtBlue/90 transition-colors"
                  >
                    View All Requests →
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">Status</span>
                    <span className="font-medium">Active</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">Category</span>
                    <span className="font-medium">All</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">From Agents</span>
                    <span className="font-medium">{totals.assigned_requests ?? 0}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">Unassigned</span>
                    <span className="font-medium">
                      {(totals.buyer_requests ?? 0) - (totals.assigned_requests ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {active === "chats" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Active Chats</div>
                  <div className="text-2xl font-bold text-gtBlue">{totals.chats ?? 0}</div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Messages Sent</div>
                  <div className="text-2xl font-bold text-green-600">{totals.messages ?? 0}</div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Unread</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {totals.unread_messages ?? 0}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 dark:bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Conversations</h3>
                  <Link
                    to="/chat"
                    className="px-4 py-2 bg-gtBlue text-white rounded-lg text-sm hover:bg-gtBlue/90 transition-colors"
                  >
                    Open Chat →
                  </Link>
                </div>
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <p className="text-4xl mb-2">💬</p>
                  <p>Chat with buyers and factories</p>
                  <Link
                    to="/chat"
                    className="mt-4 inline-block text-gtBlue hover:underline text-sm"
                  >
                    Start a new conversation →
                  </Link>
                </div>
              </div>
            </div>
          )}
          {active === "network" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Connected</div>
                  <div className="text-2xl font-bold text-gtBlue">
                    {totals.partner_network ?? 0}
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Pending</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {totals.pending_partners ?? 0}
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Factories</div>
                  <div className="text-2xl font-bold text-green-600">{totals.factories ?? 0}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 dark:bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Partner Network</h3>
                  <Link
                    to="/partner-network"
                    className="px-4 py-2 bg-gtBlue text-white rounded-lg text-sm hover:bg-gtBlue/90 transition-colors"
                  >
                    Manage Partners →
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">Total Partners</span>
                    <span className="font-medium">{totals.partner_network ?? 0}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">Pending</span>
                    <span className="font-medium">{totals.pending_partners ?? 0}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">Factories</span>
                    <span className="font-medium">{totals.factories ?? 0}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">Buying Houses</span>
                    <span className="font-medium">{totals.buying_houses ?? 0}</span>
                  </div>
                </div>
              </div>
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
                  <p>🏢 Agent seats: {subscription?.member_limit || 10}</p>
                  <p>📊 Analytics: {isEnterprise ? "Enterprise" : "Basic"}</p>
                  <p>🤝 Partner Network: {subscription?.partner_network_unlimited ? "Unlimited" : "Limited"}</p>
                  <p>🎯 Lead Management: {subscription?.lead_management_unlimited ? "Unlimited" : "Standard"}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
