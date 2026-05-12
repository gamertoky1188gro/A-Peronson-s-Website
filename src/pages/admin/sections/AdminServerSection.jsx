/**
 * Admin Server Section - Server & App Management
 * Location in main file: ~line 11808-14079
 */

import { Server, Database, HardDrive, Activity, Wrench } from "lucide-react";
import { cn } from "../../../lib/utils";

export function AdminServerSection({
  activeCategory,
  adminDark,
  serverNav = "overview",
  setServerNav = () => {},
  serverData = {},
}) {
  if (activeCategory !== "server-admin") return null;

  const serverTabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "servers", label: "Servers", icon: Server },
    { id: "databases", label: "Databases", icon: Database },
    { id: "storage", label: "Storage", icon: HardDrive },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
  ];

  return (
    <div className="space-y-6">
      {/* Server Header */}
      <div
        className={cn(
          "rounded-3xl border p-6",
          adminDark
            ? "border-white/10 bg-white/5"
            : "border-slate-200 bg-white",
        )}
      >
        <h2
          className={cn(
            "text-2xl font-semibold",
            adminDark ? "text-white" : "text-slate-900",
          )}
        >
          Server & App Management
        </h2>
        <p
          className={cn(
            "mt-1",
            adminDark ? "text-slate-400" : "text-slate-600",
          )}
        >
          Server configuration, deployments, and maintenance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-4 dark:border-slate-700">
        {serverTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setServerNav(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition whitespace-nowrap",
              serverNav === tab.id
                ? "bg-sky-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {serverNav === "overview" && (
        <div className="grid gap-6 md:grid-cols-4">
          <div
            className={cn(
              "rounded-2xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="text-3xl font-bold">
              {serverData?.totalServers || 0}
            </div>
            <div className="text-sm text-slate-500">Total Servers</div>
          </div>
          <div
            className={cn(
              "rounded-2xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="text-3xl font-bold">{serverData?.running || 0}</div>
            <div className="text-sm text-slate-500">Running</div>
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
              {serverData?.databases || 0}
            </div>
            <div className="text-sm text-slate-500">Databases</div>
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
              {serverData?.storage || "0 GB"}
            </div>
            <div className="text-sm text-slate-500">Storage Used</div>
          </div>
        </div>
      )}

      {serverNav === "servers" && (
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
            Server List
          </h3>
          <p className="text-slate-500">Manage your servers</p>
        </div>
      )}

      {serverNav === "databases" && (
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
            Database Management
          </h3>
          <p className="text-slate-500">Manage your databases</p>
        </div>
      )}

      {serverNav === "storage" && (
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
            Storage Management
          </h3>
          <p className="text-slate-500">Manage storage resources</p>
        </div>
      )}

      {serverNav === "maintenance" && (
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
            Maintenance
          </h3>
          <p className="text-slate-500">System maintenance and updates</p>
        </div>
      )}
    </div>
  );
}

export default AdminServerSection;
