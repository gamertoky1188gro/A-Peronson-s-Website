/**
 * Admin Platform Section - Users, Verification, Subscriptions, Contracts, Moderation
 * Location in main file: ~line 5722-8338
 */

import {
  Users,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { cn } from "../../../lib/utils";

export function AdminPlatformSection({
  activeCategory,
  adminDark,
  platformNav = "overview",
  setPlatformNav = () => {},
  // User management
  usersData = [],
  userSearch = "",
  setUserSearch = () => {},
  userFilter = "all",
  setUserFilter = () => {},
  // Verification
  verificationData = [],
  verificationFilter = "pending",
  setVerificationFilter = () => {},
  // Subscriptions
  subscriptionData = [],
  // Contracts
  contractsData = [],
  // Moderation
  moderationData = [],
  refreshModerationQueues = () => {},
}) {
  if (activeCategory !== "platform") return null;

  const platformTabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "users", label: "Users", icon: Users },
    { id: "verification", label: "Verification", icon: ShieldCheck },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "contracts", label: "Contracts", icon: FileText },
    { id: "moderation", label: "Moderation", icon: AlertTriangle },
    { id: "analytics", label: "Analytics", icon: Search },
  ];

  return (
    <div className="space-y-6">
      {/* Platform Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-4 dark:border-slate-700">
        {platformTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPlatformNav(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition whitespace-nowrap",
              platformNav === tab.id
                ? "bg-sky-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {platformNav === "users" && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className={cn(
                  "w-full rounded-xl border py-2 pl-10 pr-4 text-sm",
                  adminDark
                    ? "border-white/10 bg-white/5 text-white"
                    : "border-slate-200 bg-white text-slate-900",
                )}
              />
            </div>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm",
                adminDark
                  ? "border-white/10 bg-white/5 text-white"
                  : "border-slate-200 bg-white",
              )}
            >
              <option value="all">All Roles</option>
              <option value="buyer">Buyers</option>
              <option value="factory">Factories</option>
              <option value="buying_house">Buying Houses</option>
              <option value="admin">Admins</option>
              <option value="agent">Agents</option>
            </select>
          </div>

          {/* Users Table */}
          <div
            className={cn(
              "rounded-2xl border overflow-x-auto",
              adminDark ? "border-white/10" : "border-slate-200",
            )}
          >
            <table className="w-full">
              <thead className={adminDark ? "bg-white/5" : "bg-slate-50"}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Verified
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {(usersData || []).slice(0, 20).map((user, idx) => (
                  <tr
                    key={idx}
                    className={
                      adminDark
                        ? "border-t border-white/10"
                        : "border-t border-slate-100"
                    }
                  >
                    <td className="px-4 py-3 text-sm">{user?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {user?.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">
                      {user?.role?.replace("_", " ") || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-xs",
                          user?.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : user?.status === "suspended"
                              ? "bg-rose-500/10 text-rose-600"
                              : "bg-slate-500/10 text-slate-600",
                        )}
                      >
                        {user?.status || "unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user?.verified ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-sky-500 hover:underline">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verification Tab */}
      {platformNav === "verification" && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setVerificationFilter("pending")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                verificationFilter === "pending"
                  ? "bg-sky-500 text-white"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              Pending (
              {verificationData.filter((v) => v.status === "pending").length})
            </button>
            <button
              onClick={() => setVerificationFilter("approved")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                verificationFilter === "approved"
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              Approved
            </button>
            <button
              onClick={() => setVerificationFilter("rejected")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                verificationFilter === "rejected"
                  ? "bg-rose-500 text-white"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              Rejected
            </button>
          </div>

          <div
            className={cn(
              "rounded-2xl border overflow-hidden",
              adminDark ? "border-white/10" : "border-slate-200",
            )}
          >
            {(verificationData || [])
              .filter(
                (v) =>
                  verificationFilter === "all" ||
                  v.status === verificationFilter,
              )
              .slice(0, 20)
              .map((verification, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center justify-between p-4",
                    adminDark
                      ? "border-t border-white/10"
                      : "border-t border-slate-100",
                  )}
                >
                  <div>
                    <div className="font-medium">
                      {verification?.company_name || "Company"}
                    </div>
                    <div className="text-sm text-slate-500">
                      {verification?.email}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-emerald-500 px-3 py-1 text-sm text-white hover:bg-emerald-600">
                      Approve
                    </button>
                    <button className="rounded-lg bg-rose-500 px-3 py-1 text-sm text-white hover:bg-rose-600">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Subscriptions Tab */}
      {platformNav === "subscriptions" && (
        <div
          className={cn(
            "rounded-2xl border p-6",
            adminDark ? "border-white/10" : "border-slate-200",
          )}
        >
          <h3
            className={cn(
              "mb-4 text-lg font-semibold",
              adminDark ? "text-white" : "text-slate-900",
            )}
          >
            Subscription Management
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div
              className={cn(
                "rounded-xl p-4",
                adminDark ? "bg-white/5" : "bg-slate-50",
              )}
            >
              <div className="text-2xl font-bold">
                {subscriptionData.filter((s) => s.plan === "free").length}
              </div>
              <div className="text-sm text-slate-500">Free Plan</div>
            </div>
            <div
              className={cn(
                "rounded-xl p-4",
                adminDark ? "bg-white/5" : "bg-slate-50",
              )}
            >
              <div className="text-2xl font-bold">
                {subscriptionData.filter((s) => s.plan === "premium").length}
              </div>
              <div className="text-sm text-slate-500">Premium</div>
            </div>
            <div
              className={cn(
                "rounded-xl p-4",
                adminDark ? "bg-white/5" : "bg-slate-50",
              )}
            >
              <div className="text-2xl font-bold">
                {subscriptionData.filter((s) => s.plan === "enterprise").length}
              </div>
              <div className="text-sm text-slate-500">Enterprise</div>
            </div>
          </div>
        </div>
      )}

      {/* Contracts Tab */}
      {platformNav === "contracts" && (
        <div
          className={cn(
            "rounded-2xl border p-6",
            adminDark ? "border-white/10" : "border-slate-200",
          )}
        >
          <h3
            className={cn(
              "mb-4 text-lg font-semibold",
              adminDark ? "text-white" : "text-slate-900",
            )}
          >
            Contract Management
          </h3>
          <p className="text-slate-500">
            {contractsData.length || 0} total contracts
          </p>
        </div>
      )}

      {/* Moderation Tab */}
      {platformNav === "moderation" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className={cn(
                "text-lg font-semibold",
                adminDark ? "text-white" : "text-slate-900",
              )}
            >
              Content Moderation
            </h3>
            <button
              onClick={refreshModerationQueues}
              className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div
            className={cn(
              "rounded-2xl border overflow-hidden",
              adminDark ? "border-white/10" : "border-slate-200",
            )}
          >
            {(moderationData || []).slice(0, 20).map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center justify-between p-4",
                  adminDark
                    ? "border-t border-white/10"
                    : "border-t border-slate-100",
                )}
              >
                <div>
                  <div className="font-medium">{item?.title || "Item"}</div>
                  <div className="text-sm text-slate-500">
                    {item?.type} • {item?.status}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-emerald-500 px-3 py-1 text-sm text-white">
                    Approve
                  </button>
                  <button className="rounded-lg bg-amber-500 px-3 py-1 text-sm text-white">
                    Flag
                  </button>
                  <button className="rounded-lg bg-rose-500 px-3 py-1 text-sm text-white">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {platformNav === "analytics" && (
        <div
          className={cn(
            "rounded-2xl border p-6",
            adminDark ? "border-white/10" : "border-slate-200",
          )}
        >
          <h3
            className={cn(
              "mb-4 text-lg font-semibold",
              adminDark ? "text-white" : "text-slate-900",
            )}
          >
            Platform Analytics
          </h3>
          <p className="text-slate-500">Analytics dashboard coming soon...</p>
        </div>
      )}

      {/* Overview (default) */}
      {platformNav === "overview" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            className={cn(
              "rounded-2xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="text-3xl font-bold">{usersData.length || 0}</div>
            <div className="text-sm text-slate-500">Total Users</div>
          </div>
          <div
            className={cn(
              "rounded-2xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="text-3xl font-bold">
              {verificationData.filter((v) => v.status === "pending").length}
            </div>
            <div className="text-sm text-slate-500">Pending Verification</div>
          </div>
          <div
            className={cn(
              "rounded-2xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="text-3xl font-bold">
              {contractsData.length || 0}
            </div>
            <div className="text-sm text-slate-500">Active Contracts</div>
          </div>
          <div
            className={cn(
              "rounded-2xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="text-3xl font-bold">
              {moderationData.length || 0}
            </div>
            <div className="text-sm text-slate-500">Pending Moderation</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPlatformSection;
