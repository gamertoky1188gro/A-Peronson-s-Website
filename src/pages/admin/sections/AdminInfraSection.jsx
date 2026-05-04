/**
 * Admin Infrastructure Section
 * Location in main file: ~line 8339-9910
 */

import React from "react";
import { 
  Server, 
  Activity, 
  Database, 
  Wifi, 
  UserCog,
  HardDrive
} from "lucide-react";
import { cn } from "../../../lib/utils";

export function AdminInfraSection({ 
  activeCategory, 
  adminDark,
  infraNav = "overview",
  setInfraNav = () => {},
  infraData = {}
}) {
  if (activeCategory !== "infra") return null;

  const infraTabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "capabilities", label: "Capabilities", icon: Server },
    { id: "resources", label: "Resources", icon: HardDrive },
    { id: "security", label: "Security", icon: UserCog },
    { id: "backup", label: "Backup", icon: Database },
    { id: "network", label: "Network", icon: Wifi },
  ];

  return (
    <div className="space-y-6">
      {/* Infrastructure Header */}
      <div className={cn(
        "rounded-3xl border p-6",
        adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
      )}>
        <h2 className={cn(
          "text-2xl font-semibold",
          adminDark ? "text-white" : "text-slate-900"
        )}>
          Infrastructure Management
        </h2>
        <p className={cn(
          "mt-1",
          adminDark ? "text-slate-400" : "text-slate-600"
        )}>
          System health, performance monitoring, and resource management
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-4 dark:border-slate-700">
        {infraTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setInfraNav(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition whitespace-nowrap",
              infraNav === tab.id
                ? "bg-sky-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {infraNav === "overview" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className={cn(
            "rounded-2xl border p-6",
            adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">Operational</div>
                <div className="text-sm text-slate-500">System Status</div>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "rounded-2xl border p-6",
            adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
                <Server className="h-5 w-5 text-sky-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{infraData?.servers || 0}</div>
                <div className="text-sm text-slate-500">Active Servers</div>
              </div>
            </div>
          </div>

          <div className={cn(
            "rounded-2xl border p-6",
            adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Database className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{infraData?.databases || 0}</div>
                <div className="text-sm text-slate-500">Databases</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Capabilities Tab */}
      {infraNav === "capabilities" && (
        <div className="space-y-4">
          <h3 className={cn(
            "text-lg font-semibold",
            adminDark ? "text-white" : "text-slate-900"
          )}>
            System Capabilities
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {(infraData?.capabilities || []).map((cap, idx) => (
              <div 
                key={idx}
                className={cn(
                  "rounded-xl border p-4",
                  adminDark ? "border-white/10" : "border-slate-200"
                )}
              >
                <div className="font-medium">{cap?.title || "Capability"}</div>
                <div className="text-sm text-slate-500">{cap?.subtitle}</div>
                <div className="mt-2 text-xs text-slate-400">{cap?.count} items</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {infraNav === "resources" && (
        <div className={cn(
          "rounded-2xl border p-6",
          adminDark ? "border-white/10" : "border-slate-200"
        )}>
          <h3 className={cn(
            "mb-4 text-lg font-semibold",
            adminDark ? "text-white" : "text-slate-900"
          )}>
            Resource Usage
          </h3>
          <p className="text-slate-500">Resource monitoring dashboard</p>
        </div>
      )}

      {/* Security Tab */}
      {infraNav === "security" && (
        <div className={cn(
          "rounded-2xl border p-6",
          adminDark ? "border-white/10" : "border-slate-200"
        )}>
          <h3 className={cn(
            "mb-4 text-lg font-semibold",
            adminDark ? "text-white" : "text-slate-900"
          )}>
            Infrastructure Security
          </h3>
          <p className="text-slate-500">Security settings and audit logs</p>
        </div>
      )}

      {/* Backup Tab */}
      {infraNav === "backup" && (
        <div className={cn(
          "rounded-2xl border p-6",
          adminDark ? "border-white/10" : "border-slate-200"
        )}>
          <h3 className={cn(
            "mb-4 text-lg font-semibold",
            adminDark ? "text-white" : "text-slate-900"
          )}>
            Backup & Recovery
          </h3>
          <p className="text-slate-500">Backup configuration and restore points</p>
        </div>
      )}

      {/* Network Tab */}
      {infraNav === "network" && (
        <div className={cn(
          "rounded-2xl border p-6",
          adminDark ? "border-white/10" : "border-slate-200"
        )}>
          <h3 className={cn(
            "mb-4 text-lg font-semibold",
            adminDark ? "text-white" : "text-slate-900"
          )}>
            Network Configuration
          </h3>
          <p className="text-slate-500">Network settings and firewall rules</p>
        </div>
      )}
    </div>
  );
}

export default AdminInfraSection;