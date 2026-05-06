/**
 * Admin Home Section - Dashboard Overview
 *
 * Contains: Overview metrics, recent activity, system status
 * Location in main file: ~line 5009-5721
 */

import React from "react";
import { LayoutDashboard, TrendingUp, Activity } from "lucide-react";
import { cn } from "../../../lib/utils";

export function AdminHomeSection({
  activeCategory,
  adminDark,
  metricsData,
  recentActivity,
  systemAlerts,
  activeSection,
  setActiveSection,
}) {
  if (activeCategory !== "home") return null;

  const sections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "reports", label: "Reports", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-4 dark:border-slate-700">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
              activeSection === section.id
                ? "bg-sky-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
            )}
          >
            <section.icon className="h-4 w-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Overview Content */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(metricsData || []).slice(0, 8).map((metric, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-3xl border p-6 shadow-lg",
                  adminDark
                    ? "border-white/10 bg-white/5"
                    : "border-slate-200 bg-white",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      adminDark ? "text-slate-400" : "text-slate-600",
                    )}
                  >
                    {metric?.label || "Metric"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {metric?.trend}
                  </span>
                </div>
                <div className="mt-2 text-3xl font-bold">
                  {metric?.value || 0}
                </div>
                {metric?.subtitle && (
                  <div className="mt-1 text-xs text-slate-500">
                    {metric.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          {recentActivity && recentActivity.length > 0 && (
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
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-sky-500" />
                    <span
                      className={cn(
                        "text-sm",
                        adminDark ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      {activity?.description || "Activity"}
                    </span>
                    <span className="ml-auto text-xs text-slate-500">
                      {activity?.time || ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Alerts */}
          {systemAlerts && systemAlerts.length > 0 && (
            <div
              className={cn(
                "rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6",
              )}
            >
              <h3 className="mb-4 text-lg font-semibold text-amber-600">
                System Alerts
              </h3>
              <div className="space-y-3">
                {systemAlerts.slice(0, 3).map((alert, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-700">
                      {alert?.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeSection === "activity" && (
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
            Activity Log
          </h3>
          <p className="text-slate-500">Activity tracking coming soon...</p>
        </div>
      )}

      {/* Reports Tab */}
      {activeSection === "reports" && (
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
            Reports
          </h3>
          <p className="text-slate-500">Reports and analytics coming soon...</p>
        </div>
      )}
    </div>
  );
}

export default AdminHomeSection;
