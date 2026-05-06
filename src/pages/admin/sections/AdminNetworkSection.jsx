/**
 * Admin Network Section
 * Location in main file: ~line 9911-11807
 */

import React from "react";
import {
  Network,
  Wifi,
  Lock,
  BarChart3,
  ShieldCheck,
  Users,
  LayoutDashboard,
  CircuitBoard,
} from "lucide-react";
import { cn } from "../../../lib/utils";

export function AdminNetworkSection({
  activeCategory,
  adminDark,
  networkNav = "overview",
  setNetworkNav = () => {},
  networkData = {},
}) {
  if (activeCategory !== "network") return null;

  const networkTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Wifi },
    { id: "security", label: "Security", icon: Lock },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "audit", label: "Audit", icon: ShieldCheck },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Network Header */}
      <div
        className={cn(
          "rounded-3xl border p-6",
          adminDark
            ? "border-white/10 bg-white/5"
            : "border-slate-200 bg-white",
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white">
            <CircuitBoard className="h-6 w-6" />
          </div>
          <div>
            <h2
              className={cn(
                "text-2xl font-semibold",
                adminDark ? "text-white" : "text-slate-900",
              )}
            >
              Network Control
            </h2>
            <p
              className={cn(
                "mt-1",
                adminDark ? "text-slate-400" : "text-slate-600",
              )}
            >
              Enterprise monitoring, configuration, security, and audit
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {networkTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setNetworkNav(tab.id)}
            className={cn(
              "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
              networkNav === tab.id
                ? "bg-sky-500 text-white"
                : adminDark
                  ? "bg-white/5 text-slate-100 hover:bg-white/10"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200",
            )}
          >
            <span className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </span>
            <Network className="h-4 w-4 opacity-70" />
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {networkNav === "overview" && (
        <div className="grid gap-6 md:grid-cols-3">
          <div
            className={cn(
              "rounded-2xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="text-3xl font-bold">
              {networkData?.interfaces || 0}
            </div>
            <div className="text-sm text-slate-500">Network Interfaces</div>
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
              {networkData?.connections || 0}
            </div>
            <div className="text-sm text-slate-500">Active Connections</div>
          </div>
          <div
            className={cn(
              "rounded-2xl border p-6",
              adminDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="text-3xl font-bold">{networkData?.alerts || 0}</div>
            <div className="text-sm text-slate-500">Active Alerts</div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {networkNav === "inventory" && (
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
            Network Inventory
          </h3>
          <p className="text-slate-500">Network devices and configurations</p>
        </div>
      )}

      {/* Security Tab */}
      {networkNav === "security" && (
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
            Network Security
          </h3>
          <p className="text-slate-500">Firewall rules and security policies</p>
        </div>
      )}

      {/* Analytics Tab */}
      {networkNav === "analytics" && (
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
            Network Analytics
          </h3>
          <p className="text-slate-500">
            Traffic analysis and performance metrics
          </p>
        </div>
      )}

      {/* Audit Tab */}
      {networkNav === "audit" && (
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
            Audit Logs
          </h3>
          <p className="text-slate-500">Network activity and security logs</p>
        </div>
      )}

      {/* Users Tab */}
      {networkNav === "users" && (
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
            Network Users
          </h3>
          <p className="text-slate-500">User access and permissions</p>
        </div>
      )}
    </div>
  );
}

export default AdminNetworkSection;
